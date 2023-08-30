from sentence_transformers import SentenceTransformer, util
from konlpy.tag import Hannanum
import numpy as np
import torch

device = "cuda:0" if torch.cuda.is_available() else "cpu"
embedder = SentenceTransformer("jhgan/ko-sroberta-multitask", device)

from typing import Union
from fastapi import FastAPI

app = FastAPI()

from pydantic import BaseModel
class Body(BaseModel):
    text: Union[str, None] = None
    corpus: Union[list, None] = None

@app.get("/")
def root():
    return {"MAIN": "AI"}

@app.post("/query")
def query(body: Body = None):
    print(body)
    if body.text == None or body.corpus == None:
       return { "result": None }

    print(body.text, body.corpus)
    corpus_embeddings = embedder.encode(body.corpus, convert_to_tensor=True)

    top_k = 5
    if corpus_embeddings.shape[0] < 5:
        top_k = corpus_embeddings.shape[0]
    #elif corpus_embeddings.shape[0] <= 100:
    #    top_k = corpus_embeddings.shape[0]
    query_embedding = embedder.encode(body.text, convert_to_tensor=True)
    cos_scores = util.pytorch_cos_sim(query_embedding, corpus_embeddings)[0]
    cos_scores = cos_scores.cpu()

    top_results = np.argpartition(-cos_scores, range(top_k))[0:top_k]


    results = []
    for idx in top_results[0:top_k]:
        results.append(body.corpus[idx].strip())
        print(body.corpus[idx].strip(), "(Score: %.4f)" % (cos_scores[idx]))

    return {"results": results }


# Kobert
# ㄴ 

# /
# /query?text=asdasd
# ㄴ Kobert https://github.com/jhgan00/ko-sentence-transformers
# ㄴ Chroma https://github.com/chroma-core/chroma
# /fpwjelf?id=01 (PK)