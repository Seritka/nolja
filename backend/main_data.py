import os
os.environ['PYARROW_IGNORE_TIMEZONE'] = '1'
from pyspark.sql import SparkSession
import pyspark.pandas as ps

from typing import Union
from konlpy.tag import Hannanum

sc = (SparkSession.builder
    .master("local")
    .appName("NOLJA Data Backend")
    .config(
        "spark.jars",
        "{}/sqlite-jdbc-3.34.0.jar".format(os.getcwd()))
    .config(
        "spark.driver.extraClassPath",
        "{}/sqlite-jdbc-3.34.0.jar".format(os.getcwd()))
    .getOrCreate()) # doctest: +SKIP


sc.sparkContext.setLogLevel("WARN")
log4j = sc._jvm.org.apache.log4j
logger = log4j.LogManager.getLogger("NOLJA Backend")

df_sql = ps.read_sql("NOLJA", con="jdbc:sqlite:./nolja.db")
df_sql.drop_duplicates(subset=['LSR_GOODS_NM', 'FCLTY_ROAD_NM_ADDR'], inplace=True, ignore_index=False, keep=False)

# soldout = 장사 끝남, sale = 세일(만 표시), stop = ???
# SLE_STATE_DC,LSR_GOODS_NM,FCLTY_ROAD_NM_ADDR
df = df_sql[['LSR_GOODS_CD', 'SLE_STATE_DC', 'LSR_GOODS_NM', 'FCLTY_ROAD_NM_ADDR']]

# embedding 문제 해결 방안 -> 미리 임베딩을 하고 저장해서 다시 쓸 때 그대로 가지고 온다
#corpus_embeddings = embedder.encode(corpus, convert_to_tensor=True)
#np.savetxt('embeddings.txt', corpus_embeddings.cpu().numpy())

# B00T END

from fastapi.responses import JSONResponse
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"MAIN": "DATA"}

@app.get("/data-query")
def data_query(text: Union[str, None] = None):
    if text == None:
       return { "result": None }

    corpus = []
    texts = Hannanum().nouns(text)
    print(texts)
    for row in df.itertuples():
        SLE_STATE_DC = row.SLE_STATE_DC if getattr(row, 'SLE_STATE_DC') else "없음"
        LSR_GOODS_NM = row.LSR_GOODS_NM if getattr(row, 'FCLTY_ROAD_NM_ADDR') else "없음"
        FCLTY_ROAD_NM_ADDR = row.FCLTY_ROAD_NM_ADDR if getattr(row, 'FCLTY_ROAD_NM_ADDR') else "없음"
        if SLE_STATE_DC == "없음" or LSR_GOODS_NM == "없음" or FCLTY_ROAD_NM_ADDR == "없음": continue
        if any(text in SLE_STATE_DC or text in LSR_GOODS_NM or text in FCLTY_ROAD_NM_ADDR for text in texts):
            corpus.append(f'{row.LSR_GOODS_CD} {SLE_STATE_DC} {LSR_GOODS_NM} {FCLTY_ROAD_NM_ADDR}')
    print(len(corpus))

    if corpus == []:
        return { "data": None }

    return { "data": corpus }

@app.get("/fpwjelf/{item_id}")
def fpwjelf(item_id: int):
    import json
    item = df_sql.loc[df['LSR_GOODS_CD'] == item_id].to_json(force_ascii=False, orient = 'records', indent=4)
    if item == None:
        return JSONResponse(content=None, status_code=404)
    return JSONResponse(content=json.loads(item)[0], status_code=200)