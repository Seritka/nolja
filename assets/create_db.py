import pandas as pd
import sqlite3

dirs = {
    '고객센터정보': 'YN_LSR_CSINFO',
    '기본필수 정보': 'YN_LSR_DEAL_INFO',
    '레저사업장 주소정보': 'YN_LSR_RDNMADR',
    '상태 정보': 'YN_LSR_DEAL_SLE_AT',
    '상품 이미지 URL': 'YN_LSR_DEAL_GOODS_PHOTO_URL',
    '상품소개': 'YN_LSR_DEALINTRODUCE',
    '이용정보': 'YN_LSR_DEAL_NOTICEINFO',
    '전화번호': 'YN_LSR_TELNO',
    '취소환불 규정': 'YN_LSR_DEAL_REFUNDINFO',
    'ID': 'YN_LSR_DEAL_ID',
    '일반정보': 'YN_LSR_INFO'
}

yearmonth = ["202208", "202209", "202210", "202211", "202212", "202301", "202302", "202304", "202305"]

def main():
    # "레저딜" 폴더 -> ID: 제목 -> csv 파일들 열고 ID에 맞쳐서 dict 타입으로 추출 및 db화하기
    df_all = pd.DataFrame()
    i = 0
    for key, value in dirs.items(): # TODO: 데이터마다 겹치는 키 값을 찾아서 병합하기, 현 코드는 최근 연도 밖에 못 합침
        for j in yearmonth:
            df = pd.read_csv(f'./레저딜 {key}/{value}_{j}.csv') 
        if i == 0:
            df_all = df
        else:
            df_all = pd.merge(df, df_all, on=['LSR_GOODS_CD', 'LSR_GOODS_NM'], how='outer')
        i += 1

    df_all.drop_duplicates(subset=None, inplace=False, ignore_index=False)
    df_all.to_csv('./total.csv')

    conn =sqlite3.connect('nolja.db')
    
    df_all.to_sql('NOLJA', conn, if_exists='append', index=False)
    conn.cursor().execute('SELECT * FROM NOLJA ORDER BY LSR_GOODS_CD')
    pass


if __name__ == '__main__':
    main()