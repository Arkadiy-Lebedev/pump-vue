
export const isSeriesPump = (name: string):string|null => {
 
  if (name.indexOf("WQA") !== -1) {
   
        return 'WQA'
  } 
    if (name.indexOf("TD") !== -1) {
        return 'TD'
  }   
      if (name.indexOf("CDLF") !== -1) {
    return 'CDLF'
  }
  return null
}