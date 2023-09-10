from tqdm import tqdm 
from transformers import AutoModel, AutoTokenizer
from sklearn.decomposition import PCA
import os, json
import pandas as pd
import numpy as np
from .Sum import Sum, TextAnalyzer
from .Tonal import Tonal
from sklearn.feature_extraction.text import CountVectorizer 
#import tensorflow_hub as hub
#embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")


class Predictor():
    def __init__(self, model, tonal_analyst):
        self.cluster_model = model
        self.tonal_analyst = tonal_analyst
        self.model = AutoModel.from_pretrained("DeepPavlov/distilrubert-small-cased-conversational") 
        self.tokenizer = AutoTokenizer.from_pretrained("DeepPavlov/distilrubert-small-cased-conversational")
        self.pca = PCA(n_components=2)

    def _build_data_frame_from_jsons(self, json_text):
        df = pd.DataFrame(columns=['answer'])

        text = json_text # json.loads(json_text)
        answers = text["answers"] # context cluster

        answers_texts = []
        for i in answers:
            answers_texts.append(i['answer'])

        df1 = pd.DataFrame(columns=['answer'])
        df1.loc[:, 'answer'] = answers_texts

        df = pd.concat([df, df1], ignore_index = True)
        df.reset_index()

        df = df.replace(r'^s*$', float('NaN'), regex = True)
        df = df.dropna(subset=['answer'])

        df = df.reset_index()
        df = df.drop(['index'], axis=1)

        return df

    def _get_embend(self, sents): 
        embends = []
        for sent in tqdm(sents): 
            tokens = self.tokenizer(sent, padding='max_length', max_length=512, truncation=True, return_tensors="pt") 
            embendings = self.model(input_ids=tokens["input_ids"], attention_mask=tokens["attention_mask"], return_dict=True) 
            embends.append(embendings.last_hidden_state[0][0].tolist())
        return embends

    def _fit(self, df, embds):
        self.cluster_model.fit(embds)
        emb_2dRub = pd.DataFrame(self.pca.fit_transform(embds), columns=['x1', 'x2'])
        emb_2dRub['label'] = self.cluster_model.labels_
        df.loc[:, 'label'] = emb_2dRub['label']
        return df
    
    def _fit_and_get_points(self, df, embds):
        self.cluster_model.fit(embds)
        emb_2dRub = pd.DataFrame(self.pca.fit_transform(embds), columns=['x1', 'x2'])
        emb_2dRub['label'] = self.cluster_model.labels_
        df.loc[:, 'label'] = emb_2dRub['label']
        return df, emb_2dRub

    def get_grouped_info(self, df):
        grouped = df.groupby("label")["answer"].apply(list)
        label_answers_dict = grouped.to_dict()
        return label_answers_dict
    
    def get_names_for_labels(self, df):
        labels_to_sums = {}
        for k, v in self.get_grouped_info(df).items():
            summarizator = Sum(v)
            text_sum = summarizator.get_sum(",".join(v))
            labels_to_sums[k] = text_sum

        grouped = df.groupby('label')['answer'].count()
        label_counts = grouped.to_dict()

        result = {}
        for k, v in label_counts.items():
            result[k] = labels_to_sums[k]

        return result

    def get_histogram_info(self, df, labels_to_sums):
        grouped = df.groupby('label')['answer'].count()
        label_counts = grouped.to_dict()

        result = {}
        for k, v in label_counts.items():
            result[labels_to_sums[k][0]] = v

        return result
    
    def get_points_info(self, df, points, labels_to_names):
        df.loc[:, 'x1'] = points['x1']
        df.loc[:, 'x2'] = points['x2']

        result = []
        i = 1
        for k, v in labels_to_names.items():
            res = {"clusterId": i,
                 "clusterName": v[0],
                 "dataPoints": []}
            pedik = df.groupby('label')[['x1', 'x2']].apply(lambda x: x.values.tolist()).to_dict()
            for k1, v in pedik.items():
                if k == k1:
                    for pair in v:
                        res["dataPoints"].append({"x": pair[0], "y": pair[1]})
            result.append(res)
            i+=1
        return result
    
    def get_bubble_info(self, df, points, labels_to_names):
        df.loc[:, 'x1'] = points['x1']
        df.loc[:, 'x2'] = points['x2']

        grouped = df.groupby('label')['answer'].count()
        label_counts = grouped.to_dict()
        result = []
        i = 1
        for k, v in labels_to_names.items():
            res = {"chartName": v[0],
                   "markerSizes": [label_counts[k]*20],
                   "textLabels": [v[0]],
                   "xValues": [],
                   "yValues": []}
            cluster_points = []
            pedik = df.groupby('label')[['x1', 'x2']].apply(lambda x: x.values.tolist()).to_dict()
            for k1, v in pedik.items():
                if k == k1:
                    for pair in v:
                        cluster_points.append([pair[0], pair[1]])
            cluster_center = np.mean(cluster_points, axis=0)
            res["xValues"] = [cluster_center[0]]
            res["yValues"] = [cluster_center[1]]
            result.append(res)
            i+=1
        return result
    
    def _remove_duplicate_words(self, string):
        # Разбиваем строку на слова, используя пробел в качестве разделителя
        words = string.split()

        # Создаем пустой список для хранения уникальных слов
        unique_words = []

        # Проходим по каждому слову в списке
        for word in words:
            # Если слово уже есть в списке уникальных слов, пропускаем его
            if word in unique_words:
                continue
            # Иначе добавляем слово в список уникальных слов
            unique_words.append(word)

        # Соединяем слова из списка уникальных слов в новую строку, используя пробел в качестве разделителя
        new_string = ' '.join(unique_words)

        # Возвращаем новую строку без повторений слов
        return new_string
    
    def _get_with_no_duplicates(self, labels_to_names):
        result = {}
        for k, v in labels_to_names.items():
            new_string = self._remove_duplicate_words(v[0])
            result[k] = [new_string]
        return result
    
    def do_preprocessing(self, json_text):
        df = self._build_data_frame_from_jsons(json_text)
        texts = [str(i) for i in df['answer'].values]
        embeds = self._get_embend(texts)
        df_result, points = self._fit_and_get_points(df, embeds)

        _labels_to_names = TextAnalyzer.get_sums(df)
        labels_to_names = self._get_with_no_duplicates(_labels_to_names)

        return df_result, points, labels_to_names
    
    def build_final_json(self, old_json):
        df, _, _labels_to_names = self.do_preprocessing(old_json)

        labels_to_names = {}
        for k, v in _labels_to_names.items():
            labels_to_names[k] = v[0]
        print(labels_to_names)
        df['cluster_name'] = df['label'].replace(labels_to_names)
        df = df.drop('label', axis=1)
        
        tonals = self.tonal_analyst.predict(df["answer"])
        df.loc[:, "sentiment"] = tonals

        new_json = {
            "question": old_json["question"],
            "id": old_json["id"]
        }
        answers = df.to_dict(orient='records')
        new_json["answers"] = answers

        print(new_json)
        return new_json
    
    
    def get_results(self, json_text):
        df_result, points, labels_to_names = self.do_preprocessing(json_text)

        predictions = {}
        #labels_to_names = self.get_names_for_labels(df)
        predictions["bubbles"] = self.get_bubble_info(df_result, points, labels_to_names)
        predictions["points"] = self.get_points_info(df_result, points, labels_to_names)
        predictions["hist"] = self.get_histogram_info(df_result, labels_to_names)
        return predictions
    