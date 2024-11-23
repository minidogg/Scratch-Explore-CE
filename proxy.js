const cors = require("cors")
const express = require('express')
const app = express()
const port = 8010

const baseURL = "https://api.scratch.mit.edu/"

app.use(cors())
app.get("/proxy",async(req, res)=>{
    let newPath = req.path.replace("/proxy", "")
    let resp = await (await fetch(baseURL+newPath)).text()

    res.send(resp)
})

app.listen(port, () => {
    console.log(`Proxy listening on port ${port}`)
})