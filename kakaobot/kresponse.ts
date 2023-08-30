class KResponse {
    static simpleText(text: string): Response {
        const json = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": text
                        }
                    }
                ]
            }
        }
        return KResponse.#JSONResponse(json)
    }
    static quickReplies(text: string, quickReplies: quickReplies[]): Response {
        const json = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": text
                        }
                    }
                ],
                "quickReplies": quickReplies
            }
        }
        return KResponse.#JSONResponse(json)
    }
    // deno-lint-ignore no-explicit-any
    static #JSONResponse(json: any): Response {
        return new Response(JSON.stringify(json),  { "status": 200, headers: { "Content-Type": "application/json" } })
    }
}

interface quickReplies {
    messageText: string
    action: "message" // message
    label: string
}

export default KResponse