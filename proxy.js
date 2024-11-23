const cors = require("cors")
const express = require('express')
const app = express()
const port = 8010

const baseURL = "https://api.scratch.mit.edu/"

app.use(cors())
app.use(async(req, res, next)=>{
    if(!req.path.startsWith("/proxy")){
        next()
        return;
    }
    let newPath = baseURL+req.url.replace("/proxy/", "")
    console.log(newPath)
    let resp = await (await fetch(newPath)).text()

    res.send(resp)
})

app.listen(port, () => {
    console.log(`Proxy listening on port ${port}`)
})