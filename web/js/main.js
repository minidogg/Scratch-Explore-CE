const ENDPOINTS = {
    base: "https://api.scratch.mit.edu/",
    explore: (limit=16,offset=0,q="*",mode="trending",language="en")=>{
        if(limit>16)throw "Max of 16 projects at a time!"

        return `explore/projects?limit=${limit}&offset=${offset}&language=${language}&mode=${mode}&q=${q}`
    }
}

const whitelistedCharacters = "qwertyuiopasdfghjklzxcvbnm.'\"QWERTYUIOPASDFGHJKLZXCVBNM1234567890-_|[]{} ".split("")
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

function CreateProjectElement(
    projectName = "Block Blast!",
    projectImg = "https://cdn2.scratch.mit.edu/get_image/project/513518804_480x360.png",
    projectLink = "https://scratch.mit.edu/projects/513518804/",

    projectDevName = "Juicity",
    projectDevPfp = "https://cdn2.scratch.mit.edu/get_image/user/69377286_32x32.png",
    projectDevLink = "https://scratch.mit.edu/users/Juicity/",
){
    let div = document.createElement("div")
    div.classList.add("project")

    projectName = escapeHtml(projectName)
    projectImg = escapeHtml(projectImg)
    projectLink = escapeHtml(projectLink)

    projectDevName = escapeHtml(projectDevName)
    projectDevPfp = escapeHtml(projectDevPfp)
    projectDevLink = escapeHtml(projectDevLink)


    div.innerHTML = `
        <a href="${projectLink}">
            <img src="${projectImg}" class="projectImg">
        </a>
        
        <div class="flex">
            <a href="${projectDevLink}">
                <img src="${projectDevPfp}" class="projectDevPfp">
            </a>
            <div>
                <a href="${projectLink}" class="projectName">${projectName}</a>
                <a href="${projectDevLink}" class="projectDevName">${projectDevName}</a>
            </div>
        </div>  
    `

    return div
}

function FindBestImage(images){
    // TODO: Implement image finding logic
}

function GetScratchProjectDisplayData(project){
    return {
        projectName: project.title,
        projectImg: project.image,
        projectLink: "https://scratch.mit.edu/projects/"+project.id,
    
        projectDevName: project.author.username,
        projectDevPfp: project.author.profile.images["32x32"],
        projectDevLink: "https://scratch.mit.edu/users/"+project.author.username,
    }
}

let projectsDiv = document.querySelector("#projects")
let currentPage = 0
async function LoadMoreProjects(){
    console.log("Fetching more projects")
    let projects = await GetScratchProjects(currentPage)

    console.log("Loading project display data")
    projects = projects.map(project=>GetScratchProjectDisplayData(project))
    console.log(projects)

    console.log("Converting to project elements")
    projects = projects.map(project=>{
        return CreateProjectElement(project.projectName, project.projectImg, project.projectlink, project.projectDevName, project.projectDevPfp, project.projectDevLink)
    })
    console.log(projects)

    console.log("Appending projects to the project div")
    projects.forEach(project=>{
        projectsDiv.appendChild(project)
    })

    currentPage++
} 
document.getElementById("loadMore").addEventListener("click", LoadMoreProjects)
LoadMoreProjects()