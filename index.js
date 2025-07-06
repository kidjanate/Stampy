import * as lib from "/lib.js"
import { downloadZip } from "https://cdn.jsdelivr.net/npm/client-zip/index.js"

let multipleFilesCheckbox = document.getElementById("multipleFiles")
let fileInput = document.getElementById("file")

//Forms
let nameInput = document.getElementById("name")
let nicknameInput = document.getElementById("nickname")
let studentCodeInput = document.getElementById("studentCode")
let secInput = document.getElementById("sec")
let subjectCodeInput = document.getElementById("subjectCode")
let workCodeInput = document.getElementById("workCode")
let commentType = document.getElementById("commentType")
let filesDetail = document.getElementById("filesDetail")
let finishUI = document.getElementById('finishUI')

let output = document.getElementById("output")

const triggerElements = [
    nameInput,
    nicknameInput,
    studentCodeInput,
    secInput,
    subjectCodeInput,
    workCodeInput,
    commentType
]

async function updateFiles(){
    console.log(fileInput.value)
    filesDetail.innerHTML = ""
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i]
        let fileName = lib.getFileNameWithoutExtension(file.name)
        let fileExtension = lib.getFileExtension(file.name)

        let vaild = true
        let errorDetail = ""
        if (fileName == null || fileExtension == null) {
            vaild = false
            errorDetail = "path ไม่ถูกต้อง"
        }

        let workIndex = Number(fileName)
        if (isNaN(workIndex)) {
            vaild = false
            errorDetail = "ชื่อไฟล์ไม่ถูกต้อง ต้องเป็นตัวเลขเท่านั้น"
        }
        console.log(fileExtension)

        const resultFileName = lib.getFileName({
            workCode: workCodeInput.value,
            workIndex: workIndex,
            studentCode: studentCodeInput.value,
            fileExtension: fileExtension
        })

        let displayer = document.createElement("li")
        displayer.innerHTML = `${file.name} -> ${resultFileName} ${vaild ? "✅" : "❌"} ${errorDetail}`
        filesDetail.appendChild(displayer)
    }
}

function getCommentCode(workIndex){
    if (workIndex == null){
        workIndex = "XX"
    }
    let prefix = null
    let header = ""
    switch (commentType.value){
        case "Python3":
            prefix = "#"
            header = "#!/usr/bin/env python3\n"
            break
        case "Code.org":
            prefix = "//"
            break
    }
    let result = `${header}${prefix} ${nameInput.value} (${nicknameInput.value})
${prefix} ${studentCodeInput.value}
${prefix} ${workCodeInput.value}_${workIndex}
${prefix} ${subjectCodeInput.value} Sec ${secInput.value}`
    return result
}

function updateOutput(){
    output.value = getCommentCode()
    updateFiles()
}

function updateFileInputType(){
    fileInput.value = ""
    fileInput.webkitdirectory = false
    if (multipleFilesCheckbox.checked){
        fileInput.webkitdirectory = true
    }
}

function download(filename, text) {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

triggerElements.forEach(element => {
    element.addEventListener("change", updateOutput)
});

multipleFilesCheckbox.addEventListener("change", updateFileInputType)
fileInput.addEventListener("change", updateFiles)

document.getElementById("download").addEventListener("click", async function(){
    console.log("Click")
    let files = null
    if (fileInput.files.length > 1){
        files = []
    }
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i]
        
        let fileName = lib.getFileNameWithoutExtension(file.name)
        if (fileName == null)
            continue
        
        let workIndex = Number(fileName)
        if (isNaN(workIndex))
            continue

        const content = await file.text()
        const result = `${getCommentCode(workIndex)}\n${content}`

        let fileExtension = lib.getFileExtension(file.name)
        if (fileExtension == null)
            continue

        const resultFileName = lib.getFileName({
            workCode: workCodeInput.value,
            workIndex: workIndex,
            studentCode: studentCodeInput.value,
            fileExtension: fileExtension
        })
        if (fileInput.files.length > 1){
            files.push({
                name: resultFileName,
                lastModified: new Date(),
                input: result
            })
        }else{
            download(resultFileName, result)
        }
        console.log(result)
    }
    if (files != null){
        const blob = await downloadZip(files).blob()
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${workCodeInput.value}_ALL_${studentCodeInput.value}.zip`
        link.click()
        link.remove()
    }
    finishUI.setAttribute("open", true)
})

updateFileInputType()
getCommentCode()
updateOutput()