const cors = require("cors")
const express = require('express')
const app = express()
const port = 8010

const baseURL = "https://api.scratch.mit.edu/"
const whiteList = ["/explore/projects"]

app.use(cors())
app.use(async(req, res, next)=>{
    if(!req.path.startsWith("/proxy")){
        next()
        return;
    }
    if(!whiteList.includes(req.path.replace("/proxy", ""))){
        res.status(403)
        res.json({
            "proxy": true,
            "error":"The endpoint you requested isn't whitelisted!"
        })
        return;
    }

    let newPath = req.url.replace("/proxy/", "")
    let resp = await (await fetch(baseURL+newPath)).text()

    res.send(resp)
})

app.use(express.static("./web"))

app.use((req, res)=>{
    res.status(404)
    res.json({
        "proxy": true,
        "error":"The path you requested doesn't exist!"
    })
})

app.listen(port, () => {
    console.log(`Proxy listening on port ${port}`)
})