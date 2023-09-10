from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import pandas as pd
import numpy as np

import torch
from transformers import AutoModelForSeq2SeqLM, T5TokenizerFast


class Sum:
    def __init__(self, sentences):
        self.vectorizer = CountVectorizer(ngram_range=(1, 2))
        X = self.vectorizer.fit_transform(sentences)
        self.lda = LatentDirichletAllocation(n_components=2)
        self.lda.fit(X)

    def get_sum(self, sentence):
        sentence_vectorized = self.vectorizer.transform([sentence])
        topic_distribution = self.lda.transform(sentence_vectorized)
        topic_index = topic_distribution.argmax()
        topic_words = self.vectorizer.get_feature_names_out()
        summarized_sentence = ' '.join(topic_words[j] for j in self.lda.components_[topic_index].argsort()[:2])
        return summarized_sentence
    
class TextAnalyzer: 
    def __init__(self, texts): 
        self.texts = texts 
 
    def process_texts(self): 
        docs_df = self.texts 
 
        docs_per_topic = docs_df.groupby(['Topic'], as_index=False).agg({'Doc': ' '.join}) 
 
        tf_idf, count = self.c_tf_idf(docs_per_topic.Doc.values, m=len(docs_df)) 
 
        return tf_idf, count 
 
    @staticmethod 
    def c_tf_idf(documents, m, ngram_range=(1, 1)): 
        count = CountVectorizer(ngram_range=ngram_range, stop_words="english").fit(documents) 
        t = count.transform(documents).toarray() 
        w = t.sum(axis=1) 
        tf = np.divide(t.T, w) 
        sum_t = t.sum(axis=0) 
        idf = np.log(np.divide(m, sum_t)).reshape(-1, 1) 
        tf_idf = np.multiply(tf, idf) 
 
        return tf_idf, count 
 
    @staticmethod 
    def extract_top_n_words_per_topic(tf_idf, count, docs_per_topic, n=7): 
        words = count.get_feature_names_out() 
        labels = list(docs_per_topic.Topic) 
        tf_idf_transposed = tf_idf.T 
        indices = tf_idf_transposed.argsort()[:, -n:] 
        top_n_words = {label: [words[j] for j in indices[i]][::-1] for i, label in enumerate(labels)} 
        return top_n_words 
 
    @staticmethod 
    def process_sum_list(sum_list): 
        MODEL_NAME = 'UrukHan/t5-russian-spell' 
        MAX_INPUT = 256 
 
        tokenizer = T5TokenizerFast.from_pretrained(MODEL_NAME) 
        modelT5 = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME) 
 
        result = {} 
        n = 0 
        for sublist in sum_list: 
            input_sequences = sublist[:3] 
            input_sequences = ' '.join(input_sequences) 
 
            task_prefix = "Spell correct: " 
            if type(input_sequences) != list: 
                input_sequences = [input_sequences] 
 
            encoded = tokenizer( 
                [task_prefix + sequence for sequence in input_sequences], 
                padding="longest", 
                max_length=MAX_INPUT, 
                truncation=True, 
                return_tensors="pt", 
            ) 
 
            device = torch.device('cpu') 
            predicts = modelT5.generate(**encoded.to(device)) 
            sum1 = tokenizer.batch_decode(predicts, skip_special_tokens=True) 
 
            result[n] = sum1 
            n += 1 
 
        return result
    
    @staticmethod
    def get_sums(df):
        docs_df = pd.DataFrame()
        docs_df["Doc"] = df["answer"]
        docs_df['Topic'] = df["label"]
        docs_per_topic = docs_df.groupby(['Topic'], as_index = False).agg({'Doc': ' '.join})
        # docs_df - DataFrame с столбцами "Doc" и "Topic" 
        analyzer = TextAnalyzer(docs_df) 
        tf_idf, count = analyzer.process_texts()
        
        top_words = analyzer.extract_top_n_words_per_topic(tf_idf, count, docs_per_topic, n=2) 
        sum_list = list(top_words.values())  # Ваш список sum_list 
        results = analyzer.process_sum_list(sum_list) 
        return results