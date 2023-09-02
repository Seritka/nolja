import { PageProps } from "$fresh/server.ts";
import SearchBar from '../islands/SearchBar.tsx';
import { load } from "https://deno.land/std@0.201.0/dotenv/mod.ts";

const conf = await load({
  envPath: "../.env",
  examplePath: "../.env.sample",
  export: true,
});

interface Params {
    search: string;
}

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

export const handler: Handlers<Params | null> = {
  async GET(_, ctx) {
    const { search } = ctx.params
    if (String(search).substr(0, 7) !== 'search_') return ctx.render(null)
    const search_r = search.replace('search_', '')
    console.log(search_r)
    if (!search_r) return ctx.render(null)
    // Data 부분
    const resp_data = await fetch(`${conf.NOLJA_DATA_API}/data-query?text=` + search_r)
    if (!resp_data.ok) return ctx.render(null)
    const json_data = await resp_data.json()
    if (json_data === null) return ctx.render(null)
    // AI 부분
    const resp_ai = await fetch(`${conf.NOLJA_AI_API}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: search_r,
        corpus: json_data.data
      })
    })  //corpus
    let fpwjelfs: Fpwjelf[] = []
    const json =  await resp_ai.json()
    console.log(json.results)
    if (json.results === undefined) return ctx.render(null)
    for (const result of json.results) {
        const resp = await fetch(`${conf.NOLJA_DATA_API}/fpwjelf/` + result.split(' ')[0])
        if (!resp.ok) return ctx.render(null)
        console.log(resp)
        const fpwjelf: Fpwjelf  = await resp.json()
        fpwjelfs.push(fpwjelf)
    }
    return ctx.render(fpwjelfs)
  }
}

export default function NolijaSaerch({ data }: PageProps<Fpwjelf[] | null>) {
  if (!data) return <div><SearchBar/><div class="text-center" style={{ 'font-family': 'YanoljaYacheR, serif' }}>Not Found</div></div>;
  else return (
    <div style={{ 'font-family': 'YanoljaYacheR, serif' }} class='font-bold' >
        <SearchBar/>
        {data.length > 0 && <div class="text-center">검색 결과가 {data.length}개 있습니다.</div>}
        {data.length == 0 && <div class="text-center">검색 결과가 없습니다.</div>}
        <div class="flex flex-wrap justify-center">
        {data.map((fpwjelf: Fpwjelf) => (
            <div class="m-3 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <img class="rounded-t-lg" src={fpwjelf.LSR_MAIN_THUMB_URL} alt={fpwjelf.LSR_GOODS_NM} />
            </a>
            <div class="p-5">
                <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{fpwjelf.LSR_GOODS_NM}</h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{fpwjelf.LSR_GOODS_INFO_DC}</p>
                <a href={"/fpwjelf/" + fpwjelf.LSR_GOODS_CD} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    상세보기
                     <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>
            </div>
        </div>
        ))}
        </div>
    </div>
  )
}
