import type { IPumpCdlf } from "../types/IPump"
import type { IType } from "../types/IType"


let fullName: string
let typeForData: number | string


let isErrors: boolean = false
let errorsMessage: string[] = []
let formula: string 

export const itemPumpForExel = (el: any, types: IType, i: number) => {
  errorsMessage = []
  isErrors = false

  // if (el.name && el.name.indexOf("WQA")) {
  //   let diameter = el.diameter ? `${el.diameter}` : '' 
  //   let series = el.series ? `${el.series}` : '' 
  //   let nominal_q = el.nominal_q ? `${el.nominal_q}` : '' 
  //   let nominal_h = el.nominal_h ? `-${el.nominal_h}` : '' 
  //   let power = el.power ? `-${el.power}` : '' 
  //   let pole = el.pole ? `-${el.pole}` : '' 
  //   let execution = el.execution ? `-${el.execution}` : '' 
  //   fullName = diameter + series + nominal_q + nominal_h + power + pole + execution
    
  // }
  // else {
  //   fullName = el.name ?? 'Насос'
  // }
// @ts-ignore
  if (el.type) {
  let typeEltement = types.value.find(item => item.type == el.type)


  if (typeEltement && el.type) {
    typeForData = typeEltement.id
    
  } else {
    typeForData = ''
    isErrors = true
    errorsMessage.push('Неверный Тип насоса')

  }
}
  

  if (el.formuls) {
    console.log(el.formuls)

    let x = 50
    let y = eval(el.formuls)
    console.log(y)
    try {
  
      let y = eval(el.formuls)
      console.log(y)
      if (y == false) {
        errorsMessage.push('Неверная формула')
        isErrors = true
      }
    }
    catch (err) {
isErrors = true
      errorsMessage.push('Неверная формула')
      
    }
  }


  if (isErrors) {
    return { status: true, message: errorsMessage,  pump: el, index: i }
  }

  
  
    let pumpElement: IPumpCdlf = {
      id: 0,
 coordinates: [],
  name: "",
  type: "",
  b1: null,
  b2: null,
  b12: null,
  d1: null,
  d2: null,
  weight: null,
  power: null,
  engineMount: '',
  diffuser: '',
  innerBody: '',
  housingSupport: '',
  coupling: '',
  wheel: '',
  outerCasing: '',
  shaft: '',
  pipe: '',
  lid: '',
  base: '',
  note: '',
  error: 1,
  minx: 0,
  maxx: 50,
  miny: 0,
  maxy: 50,
  formuls: '',
  start: null,
  finish: null,
  step: 0.2,
  step_x: null,
  step_y: null,

      }
      
      
      
      pumpElement.name = el.name ?? "DefaultTD"
  pumpElement.type = typeForData
pumpElement.b1=  el.b1 ?? null
  pumpElement.b2 = el.b2 ?? null
  pumpElement.b12=  el.b12 ?? null
  pumpElement.d1=  el.d1 ?? null
  pumpElement.d2 = el.d2 ?? null
   pumpElement.weight=  el.weight ?? null
      pumpElement.power=  el.power ?? null  
  pumpElement.engineMount = el.engineMount ?? ""
pumpElement.diffuser = el.diffuser ?? ""
  pumpElement.innerBody = el.innerBody ?? ""
  pumpElement.housingSupport = el.housingSupport ?? ""
pumpElement.coupling = el.coupling ?? ""
pumpElement.wheel = el.wheel ?? ""
  pumpElement.outerCasing = el.outerCasing ?? "" 
  pumpElement.shaft = el.shaft ?? "" 
  pumpElement.pipe = el.pipe ?? "" 
  pumpElement.lid = el.lid ?? "" 
  pumpElement.base = el.base ?? ""
  pumpElement.note = el.note ?? ""
  pumpElement.error= el.error ?? 1
      pumpElement.minx= el.minx ?? 0
      pumpElement.maxx= el.maxx ?? 50
      pumpElement.miny= el.miny ?? 0
      pumpElement.maxy= el.maxy ?? 50
      pumpElement.formuls=  el.formuls ?? "x*1"
      pumpElement.start=  el.start ?? 0
      pumpElement.finish=  el.finish ?? 0
      pumpElement.step= el.step ?? 0.2
      pumpElement.step_x = el.step_x ?? 10
      pumpElement.step_y = el.step_y ?? 10

      

    
      return pumpElement
}