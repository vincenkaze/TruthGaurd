import sys
import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split, GridSearchCV 
from sklearn.metrics import accuracy_score
from collections import Counter

# Ensure Python recognizes backend module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.utils import clean_text  # Import text cleaning function

# --- Load Existing ISOT Datasets ---
print("Loading ISOT Fake News Dataset...")
df_fake_isot = pd.read_csv("dataset/fake.csv")
df_real_isot = pd.read_csv("dataset/true.csv")

# Balance ISOT dataset to the smaller size
min_size_isot = min(len(df_fake_isot), len(df_real_isot))
df_fake_isot = df_fake_isot.sample(n=min_size_isot, random_state=42)
df_real_isot = df_real_isot.sample(n=min_size_isot, random_state=42)

# Add labels (Fake = 1, Real = 0) to ISOT data
df_fake_isot['label'] = 1
df_real_isot['label'] = 0

# Combine & shuffle ISOT data
df_isot = pd.concat([df_fake_isot, df_real_isot], ignore_index=True)
df_isot = df_isot.dropna(subset=['text']) # Drop rows where 'text' is missing
print(f"ISOT dataset loaded: {len(df_isot)} articles.")

# --- Load and Process LIAR Dataset ---
print("Loading LIAR Dataset...")
liar_path = "dataset/liar/"

liar_columns = [
    'id', 'label', 'statement', 'subjects', 'speaker', 'speaker_job_title',
    'state_info', 'party_affiliation', 'barely_true_counts', 'false_counts',
    'half_true_counts', 'mostly_true_counts', 'pants_on_fire_counts', 'context'
]

df_liar_train = pd.read_csv(os.path.join(liar_path, "train.tsv"), sep='\t', header=None, names=liar_columns)
df_liar_test = pd.read_csv(os.path.join(liar_path, "test.tsv"), sep='\t', header=None, names=liar_columns)
df_liar_valid = pd.read_csv(os.path.join(liar_path, "valid.tsv"), sep='\t', header=None, names=liar_columns)

# Concatenate all LIAR splits
df_liar = pd.concat([df_liar_train, df_liar_test, df_liar_valid], ignore_index=True)

# Select only the 'statement' and 'label' columns from LIAR
df_liar = df_liar[['statement', 'label']]
df_liar = df_liar.rename(columns={'statement': 'text'})

# Map LIAR's 6-class labels to binary (Fake = 1, Real = 0)
label_mapping = {
    'pants-fire': 1,
    'false': 1,
    'barely-true': 1,
    'half-true': 0,
    'mostly-true': 0,
    'true': 0
}
df_liar['label'] = df_liar['label'].map(label_mapping)
df_liar = df_liar.dropna(subset=['label'])
df_liar['label'] = df_liar['label'].astype(int)

print(f"LIAR dataset loaded and processed: {len(df_liar)} statements.")

# --- Combine ISOT and LIAR datasets ---
print("Combining datasets...")
df = pd.concat([df_isot[['text', 'label']], df_liar[['text', 'label']]], ignore_index=True)
df = df.drop_duplicates(subset=['text', 'label'])
df = df.dropna(subset=['text'])
df = df.sample(frac=1, random_state=42).reset_index(drop=True)
print(f"Total combined dataset size: {len(df)} articles/statements.")

# --- Preprocess text for the entire combined dataset ---
print("Applying text cleaning...")
df["text"] = df["text"].apply(clean_text)

# 🔹 Check word frequency distribution (Debugging Bias)
fake_words = Counter(" ".join(df[df['label'] == 1]['text']).split())
real_words = Counter(" ".join(df[df['label'] == 0]['text']).split())
print(f" Most common FAKE news words: {fake_words.most_common(10)}")
print(f" Most common REAL news words: {real_words.most_common(10)}")

# --- Split data ---
X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label'], test_size=0.2, random_state=42)

# --- Define the Pipeline ---
pipeline = make_pipeline(
    TfidfVectorizer(
        # We've removed stop_words="english" here to avoid the UserWarning.
        analyzer="char_wb",
    ),
    LogisticRegression(
        max_iter=1000,
        solver="liblinear"
    )
)

# --- Define the Parameter Grid for GridSearchCV ---
param_grid = {
    'tfidfvectorizer__ngram_range': [(1, 1), (1, 2), (1, 3)],
    'tfidfvectorizer__max_features': [5000, 10000, 20000, 50000],
    'logisticregression__C': [0.1, 1, 10, 100],
}

# --- Perform GridSearchCV ---
print("Starting GridSearchCV for hyperparameter tuning...")
grid_search = GridSearchCV(
    pipeline,          # The pipeline to optimize
    param_grid,        # The grid of parameters to search
    cv=5,              # 5-fold cross-validation
    n_jobs=-1,         # Use all available CPU cores for parallel processing
    verbose=2,         # Show detailed progress messages
    scoring='accuracy' # Metric to optimize
)

grid_search.fit(X_train, y_train)
print("GridSearchCV complete.")

# --- Get the best model and its performance ---
best_model = grid_search.best_estimator_
print("\nBest parameters found: ", grid_search.best_params_)
print("Best cross-validation accuracy: {:.4f}".format(grid_search.best_score_))

# --- Evaluate the best model on the test set ---
print("Evaluating the best model on the test set...")
y_pred = best_model.predict(X_test)
final_accuracy = accuracy_score(y_test, y_pred)
print(f"Final Model Accuracy on Test Set: {final_accuracy:.4f}")

# --- Save the best model ---
joblib.dump(best_model, "backend/fake_news_model.pkl")
print("Optimized model trained & saved as 'backend/fake_news_model.pkl'")