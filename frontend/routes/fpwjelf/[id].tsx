import { PageProps } from "$fresh/server.ts";

interface Params {
  id: string;
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
    const { id } = ctx.params
    console.log(id)
    if (!id) return ctx.render(null)
    const resp = await fetch('http://localhost:8000/fpwjelf/' + id)
    if (!resp.ok) return ctx.render(null)
    console.log(resp)
    const fpwjelf: Fpwjelf  = await resp.json()
    return ctx.render(fpwjelf)
  }
}

export default function NolijaDescription({ data }: PageProps<Fpwjelf | null>) {
  if (!data) return <div class='font-bold' style={{ 'font-family': 'YanoljaYacheR, serif' }} >Not Found</div>;
  else return (
    <div style={{ 'font-family': 'YanoljaYacheR, serif' }}>
      <h1>{data.LSR_GOODS_NM}</h1>
      <p>{data.SLE_STATE_DC}</p>
      <p>{data.LSR_GOODS_INFO_DC}</p>
      <p>{data.FCLTY_INFO_CN}</p>
      <p>{data.RFN_POLICY_DC}</p>
      <p>{data.CSTMR_INQRY_CTTPLC_DC}</p>
      <p>{data.FCLTY_TEL_NO}</p>
      <p>{data.FCLTY_ROAD_NM_ADDR}</p>
      <p>{data.GOODS_GUID_CN}</p>
      <p>{data.GOODS_HEDMTR_CN}</p>
      <div>
        <img src={data.LSR_MAIN_THUMB_URL}/>
        {data.LSR_DETAIL_IMAGE_URL && data.LSR_DETAIL_IMAGE_URL.replace("[", "").replace("]", "").split(",").map((url: string) => <img src={url}/>)}
      </div>
    </div>
  )
}
