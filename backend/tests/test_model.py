from backend.models import predict_fake_news

def test_fake_news_prediction():
    result = predict_fake_news("This is completely fake news!")
    assert result["prediction"] in ["FAKE", "REAL"]
    assert 0.0 <= result["confidence"] <= 1.0