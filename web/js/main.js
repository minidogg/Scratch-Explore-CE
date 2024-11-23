const ENDPOINTS = {
    base: "https://api.scratch.mit.edu/",
    explore: (limit=16,offset=0,q="*",mode="trending",language="en")=>{
        if(limit>16)throw "Max of 16 projects at a time!"

        return `explore/projects?limit=${limit}&offset=${offset}&language=${language}&mode=${mode}&q=${q}`
    }
}

const whitelistedCharacters = "qwertyuiopasdfghjklzxcvbnm.'\"QWERTYUIOPASDFGHJKLZXCVBNM1234567890-_|[]{}# ".split("")
const offenseCap = 5

async function GetScratchProjects(page = 0){
    let projects = await (await fetch(ENDPOINTS.explore(16, 16*page))).json()
    let startCount = projects.length
    
    
    projects = projects.filter(project=>{
        let offenseCounter = 0
        project.title.split("").forEach(e=>{
            if(!whitelistedCharacters.includes(e))offenseCounter++
        })
    
        return offenseCounter<=offenseCap
    })
    
    console.log(`Only ${projects.length} out of ${startCount} filtered projects remain`)
    console.log(projects.map(e=>e.title).join("\n"))
}
await GetScratchProjects(0)
await GetScratchProjects(1)