

export const useDefaultRow = (array: any[]) => {
    for (let i = 0; i < array?.length; i++) {
        const obj = array[i]
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                // @ts-ignore
                if (obj[key] == "" || obj[key] == null || obj[key] == "null" || obj[key] == " ") {
                    // @ts-ignore
                    obj[key] = "---"
                }
            }
        }
    }
    return array
}