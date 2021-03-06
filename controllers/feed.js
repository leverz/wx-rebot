/**
 * Created by Lever on 16/11/15.
 */
const getUser = require("../model/getUser")
const register = require("./register")
const question = require("./question")

const feed = async (ctx, next) => {
    ctx.status = 200
    ctx.type = "application/xml"

    const data = ctx.request.body.xml

    const rData = await getUser(data.FromUserName[0])

    let content = "";

    if (!!rData && rData.isReady === "true") {
        content = question(data, JSON.parse(rData.question)) || "您有什么安排？"
    } else {
        content = register(data, rData)
    }

    ctx.body = `<xml>
<ToUserName><![CDATA[${data.FromUserName}]]></ToUserName>
<FromUserName><![CDATA[${data.ToUserName}]]></FromUserName>
<CreateTime>${parseInt(new Date().valueOf() / 1000)}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${content}]]></Content>
</xml>`
}

module.exports = {
    "POST /app": feed
}
