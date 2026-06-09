from backend.utils import clean_text

def test_clean_text():
    text = "Hello!! Visit http://example.com for more!!!"
    cleaned = clean_text(text)
    assert cleaned == "Hello Visit for more"