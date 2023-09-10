class Tonal:
    def __init__(self, model):
        self.model = model

    def predict(self, texts):
        return self.model.predict(texts)