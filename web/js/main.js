const ENDPOINTS = {
    base: "https://api.scratch.mit.edu/",
    explore: (limit=16,offset=0,q="*",mode="trending",language="en")=>{
        if(limit>16)throw "Max of 16 projects at a time!"

        return `explore/projects?limit=${limit}&offset=${offset}&language=${language}&mode=${mode}&q=${q}`
    }
}

const whitelistedCharacters = "qwertyuiopasdfghjklzxcvbnm.'\"QWERTYUIOPASDFGHJKLZXCVBNM1234567890-_|[]{}# ".split("")
const offenseCap = 5

const proxy = "/proxy/"
const proxyType = "RESTRICTED" // RESTRICTED or UNRESTRICTED

async function GET_json(url){
    if(proxy!=""){
        switch (proxyType) {
            case ("RESTRICTED"):
                url = proxy+url
                break;
            case("UNRESTRICTED"):
                url = proxy+encodeURIComponent(url)
                break;
            default:
                throw "Unrecognized proxy type"
        }
    }else{
        url = ENDPOINTS.base+url
    }
    let response = await fetch(url)
    if(response.status!=200){
        console.error(response)
        throw "Something went wrong when fetching "+url
    }
    response = await response.json()

    return response
}

async function GetScratchProjects(page = 0){
    let projects = await GET_json(ENDPOINTS.explore(16, 16*page))
    let startCount = projects.length
    
    
    projects = projects.filter(project=>{
        let offenseCounter = 0
        project.title.split("").forEach(e=>{
            if(!whitelistedCharacters.includes(e))offenseCounter++
        })
    
        return offenseCounter<=offenseCap
    })
    
    console.log(`Only ${projects.length} out of ${startCount} filtered projects remain`)
    // console.log(projects.map(e=>e.title).join("\n"))
    console.log(projects)

    return projects
}

GetScratchProjects(0)
GetScratchProjects(1)

function escapeHtml(str) {
    return str.replace(/[&<>"'`]/g, function(match) {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            case '`': return '&#96;';
            default: return match;
        }
    });
}

function CreateProjectElement(projectLink = "https://scratch.mit.edu/projects/513518804/"){
    let div = document.createElement("div")
    div.classList.add("project")

    projectLink = escapeHtml(projectLink)


    div.innerHTML = `
        <a href="${projectLink}">
            <img src="https://cdn2.scratch.mit.edu/get_image/project/513518804_480x360.png" class="projectImg">
        </a>
        
        <div class="flex">
            <a href="https://scratch.mit.edu/users/Juicity/">
                <img src="https://cdn2.scratch.mit.edu/get_image/user/69377286_32x32.png" class="projectDevPfp">
            </a>
            <div>
                <a href="https://scratch.mit.edu/projects/513518804/" class="projectName">Block Blast!</a>
                <a href="https://scratch.mit.edu/users/Juicity/" class="projectDevName">Juicity</a>
            </div>
        </div>  
    `

    return div
}