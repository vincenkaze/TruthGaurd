import os, sys
import numpy as np
import pandas as pd
import joblib
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    confusion_matrix, classification_report,
    precision_recall_curve, roc_curve, brier_score_loss, auc
)

# make backend.utils importable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.utils import clean_text

MODEL_PATH = "backend/fake_news_model.pkl"

def load_and_prepare_data():
    """Loads and combines ISOT and LIAR datasets."""
    print("Loading datasets...")
    # ISOT  
    df_fake_isot = pd.read_csv("dataset/fake.csv")
    df_real_isot = pd.read_csv("dataset/true.csv")
    df_fake_isot["label"] = 1; df_real_isot["label"] = 0
    df_fake_isot["source"] = "ISOT_FAKE"
    df_real_isot["source"] = "ISOT_REAL"
    df_isot = pd.concat([df_fake_isot[["text","label","source"]],
                         df_real_isot[["text","label","source"]]], ignore_index=True).dropna(subset=["text"])

    # LIAR
    liar_path = "dataset/liar"
    liar_columns = ['id','label','statement','subjects','speaker','speaker_job_title',
                    'state_info','party_affiliation','barely_true_counts','false_counts',
                    'half_true_counts','mostly_true_counts','pants_on_fire_counts','context']
    def load_tsv(name):
        return pd.read_csv(os.path.join(liar_path, name), sep="\t", header=None, names=liar_columns)
    df_liar = pd.concat([load_tsv("train.tsv"), load_tsv("test.tsv"), load_tsv("valid.tsv")], ignore_index=True)
    df_liar["original_liar_label"] = df_liar["label"] # Save original label
    df_liar = df_liar[["statement","label","original_liar_label"]].rename(columns={"statement":"text"})
    mapping = {'pants-fire':1,'false':1,'barely-true':1,'half-true':0,'mostly-true':0,'true':0}
    df_liar["label"] = df_liar["label"].map(mapping)
    df_liar = df_liar.dropna(subset=["text","label"])
    df_liar["label"] = df_liar["label"].astype(int)
    df_liar["source"] = "LIAR"

    # Combine and clean
    df = pd.concat([df_isot, df_liar], ignore_index=True)
    df["text"] = df["text"].astype(str).apply(clean_text)
    df = df[df["text"].str.strip().str.len() > 0].drop_duplicates(subset=["text","label"]).reset_index(drop=True)
    return df

def short(s, n=160):
    """A simple function to shorten a string to n characters."""
    s = " ".join(s.split())
    return (s[:n] + "…") if len(s) > n else s

def main():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Missing model at {MODEL_PATH}. Train first.")

    print("Loading model...")
    model = joblib.load(MODEL_PATH)

    print("Loading & preparing full dataset...")
    df = load_and_prepare_data()

    # --- This is the key change: splitting the data for proper evaluation ---
    print("\nSplitting data into training and test sets (20% test)...")
    _, test_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df["label"])

    X_test = test_df["text"].values
    y_test = test_df["label"].values
    src_test = test_df["source"].values

    print("\nScoring on held-out test set...")
    if hasattr(model, "predict_proba"):
        proba_fake = model.predict_proba(X_test)[:, 1]
    else:
        scores = model.decision_function(X_test)
        proba_fake = 1/(1+np.exp(-scores))

    # Default threshold 0.5 for analysis
    y_pred = (proba_fake >= 0.5).astype(int)

    # --- Comprehensive Evaluation Metrics (from first script) ---
    print("\n=== Overall Metrics on Test Set (threshold=0.5) ===")
    print(confusion_matrix(y_test, y_pred))
    print(classification_report(y_test, y_pred, target_names=["REAL(0)","FAKE(1)"]))
    print(f"Brier score (lower is better): {brier_score_loss(y_test, proba_fake):.4f}")

    # Per-source metrics on the test set
    print("\n=== Per-source breakdown on Test Set ===")
    for s in pd.unique(src_test):
        m = src_test == s
        cm = confusion_matrix(y_test[m], y_pred[m])
        print(f"\nSource: {s}  (n={m.sum()})")
        print(cm)
        print(classification_report(y_test[m], y_pred[m], target_names=["REAL(0)","FAKE(1)"]))

    # Calibration analysis on the test set
    print("\n=== Calibration by probability bins (for FAKE=1) on Test Set ===")
    bins = np.linspace(0, 1, 11)
    df_cal = pd.DataFrame({ "proba": proba_fake, "label": y_test })
    df_cal["bin"] = pd.cut(df_cal["proba"], bins, include_lowest=True)
    cal = df_cal.groupby("bin").agg(
        count=("label","size"),
        mean_pred=("proba","mean"),
        true_rate=("label","mean")
    ).reset_index()
    print(cal)

    # --- Error Analysis & Visualization (from both scripts) ---
    conf = np.where(y_pred==1, proba_fake, 1-proba_fake)
    wrong = (y_pred != y_test)
    df_err = test_df.copy()
    df_err["pred"] = y_pred
    df_err["proba_fake"] = proba_fake
    df_err["model_conf"] = conf
    df_err = df_err[wrong].sort_values("model_conf", ascending=False)

    out_csv = "backend/misclassified_samples_testset.csv"
    df_err.to_csv(out_csv, index=False)
    print(f"\nSaved all misclassified samples from test set to: {out_csv}")

    print("\nTop 5 FALSE NEGATIVES (true=FAKE(1) but predicted REAL):")
    fn = df_err[df_err["label"].eq(1) & df_err["pred"].eq(0)].head(5)
    for i, r in fn.iterrows():
        print(f"\n— src={r['source']} | proba_fake={r['proba_fake']:.3f} | conf={r['model_conf']:.3f}")
        print(short(r["text"]))

    print("\nTop 5 FALSE POSITIVES (true=REAL(0) but predicted FAKE):")
    fp = df_err[df_err["label"].eq(0) & df_err["pred"].eq(1)].head(5)
    for i, r in fp.iterrows():
        print(f"\n— src={r['source']} | proba_fake={r['proba_fake']:.3f} | conf={r['model_conf']:.3f}")
        print(short(r["text"]))

    # ROC Curve Visualization
    print("\n=== Plotting ROC Curve ===")
    fpr, tpr, thresholds = roc_curve(y_test, proba_fake)
    roc_auc = auc(fpr, tpr)
    plt.figure(figsize=(7,7))
    plt.plot(fpr, tpr, color='blue', label=f'ROC Curve (AUC = {roc_auc:.3f})')
    plt.plot([0,1], [0,1], color='red', linestyle='--', label='Random Guess')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve for Fake News Detection (on Test Set)')
    plt.legend(loc='lower right')
    plt.grid(True)
    plt.show()

    # Threshold suggestion
    print("\n=== Threshold suggestion for FAKE emphasis (maximize F1 on FAKE) ===")
    precision, recall, thresh = precision_recall_curve(y_test, proba_fake, pos_label=1)
    f1 = 2 * precision * recall / (precision + recall + 1e-12)
    best_idx = np.nanargmax(f1)
    best_thr = thresh[max(0, best_idx-1)] if best_idx >= len(thresh) else thresh[best_idx]
    print(f"Suggested threshold for FAKE (max F1): {best_thr:.3f} | F1={np.nanmax(f1):.3f}, P={precision[best_idx]:.3f}, R={recall[best_idx]:.3f}")

if __name__ == "__main__":
    main()