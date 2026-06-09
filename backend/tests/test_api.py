from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Fake News Detection API is Running!"}

def test_predict():
    response = client.post("/predict", json={"text": "Breaking news! AI is changing the world."})
    assert response.status_code == 200
    assert "prediction" in response.json()
    assert "confidence" in response.json()