export function getFileName(params){
    return `${params.workCode}_${params.workIndex}_${params.studentCode}.${params.fileExtension}`
}

export function getFileNameWithoutExtension(path){
    let result = path.match(/[^\\/]+(?=\.[^\.]+$)/)
    if (result.length == 0){
        return null
    }
    return result[0]
}

export function getFileExtension(path){
    let result = path.match(/\.([^.\\/]+)$/)
    if (result.length == 0){
        return null
    }
    return result[1]
}