//@rotor
class _KakaoBotNOJLA {
    async "/" (req: Request) {
        const dotenv = (await import("https://deno.land/std@0.201.0/dotenv/mod.ts"))

        const conf = await dotenv.load({
            envPath: "../.env",
            examplePath: "../.env.sample",
            export: true,
        })

        interface Fpwjelf {
            LSR_GOODS_CD: number
            SLE_STATE_DC: string
            FCLTY_TEL_NO: string
            LSR_GOODS_NM: string
            FCLTY_ROAD_NM_ADDR: string
            LSR_MAIN_THUMB_URL: string
            GOODS_GUID_CN: string | null
            GOODS_HEDMTR_CN: string
            CSTMR_INQRY_CTTPLC_DC: string
            LSR_GOODS_INFO_DC: string | null
            RFN_POLICY_DC: string
            LSR_DETAIL_IMAGE_URL: string
            FCLTY_INFO_CN: string
        }

        interface quickReplies {
            messageText: string
            action: "message" // message
            label: string
        }

        const KResponse = (await import("./kresponse.ts")).default


        const json = await req.json()
        console.log(json.action.name + ': ' + json.userRequest.utterance)
        const text = json.userRequest.utterance as string

        const validateNumber = (n: number | string) => !isNaN(parseFloat(n as string)) && isFinite(n as number) && Number(n) == n;

        if (validateNumber(text)) {
            const resp = await fetch(`${conf.NOLJA_DATA_API}/fpwjelf/` + text)
            if (!resp.ok) return KResponse.simpleText("레저 데이터 서버에 문제가 생겼습니다.")
            const fpwjelf: Fpwjelf = await resp.json()
            return KResponse.simpleText('레저상품명:\n' + fpwjelf.LSR_GOODS_NM  + '\n\n고객 문의 연락처:\n'+ fpwjelf.CSTMR_INQRY_CTTPLC_DC + '\n\n레저 상품 정보:\n' + fpwjelf.FCLTY_INFO_CN + '\n\n시설도로명 주소:\n' + fpwjelf.FCLTY_ROAD_NM_ADDR)
        }
        // https://i.kakao.com/docs/skill-response-format#%EC%98%88%EC%A0%9C-%EC%BD%94%EB%93%9C-7

        const resp_data = await fetch(`${conf.NOLJA_DATA_API}/data-query?text=` + text)
        if (!resp_data.ok) return KResponse.simpleText("쿼리 데이터 서버에 문제가 생겼습니다.")
        const json_data = await resp_data.json()
        if (json_data === null) return KResponse.simpleText("쿼리 데이터 서버에 문제가 생겼습니다.")

        const resp_ai = await fetch(`${conf.NOLJA_AI_API}/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: text,
              corpus: json_data.data
            })
        })

        const fpwjelfs: Fpwjelf[] = []
        const json_ =  await resp_ai.json()
        if (json_.results === undefined) return KResponse.simpleText("인공지능 서버에 문제가 생겼습니다.")
        let num = 0
        for (const result of json_.results) {
            if (num === 3) break
            const resp = await fetch(`${conf.NOLJA_DATA_API}/fpwjelf/` + result.split(' ')[0])
            if (!resp.ok) return KResponse.simpleText("레저 데이터 서버에 문제가 생겼습니다.")
            const fpwjelf: Fpwjelf = await resp.json()
            fpwjelfs.push(fpwjelf)
            num += 1
        }

        const t  = []
        for (const f of fpwjelfs) {
            t.push({
                'messageText': f.LSR_GOODS_CD,
                'action': 'message',
                'label': f.LSR_GOODS_NM
            })
        }

        return KResponse.quickReplies('제가 찾은 레저 장소들이에요!', t as unknown as quickReplies[])
    }
}