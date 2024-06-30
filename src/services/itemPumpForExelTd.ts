import type { IPumpTd } from "../types/IPump"
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
  let typeEltement = types.value.find(item => item.type == el.type)


  if (typeEltement) {
    typeForData = typeEltement.id
    
  } else {
    typeForData = ''
    isErrors = true
    errorsMessage.push('Неверный Тип насоса')

  }

  if (el.formuls || el.formuls_kw || el.formuls_npsh) {
    console.log(el.formuls)

    let x = 50
    let y = eval(el.formuls)
    let kw = eval(el.formuls_kw)
    let npsh = eval(el.formuls_npsh)
    console.log(y)
    try {
  
      let y = eval(el.formuls)
      let kw = eval(el.formuls_kw)
    let npsh = eval(el.formuls_npsh)
      console.log(y)
      if (y == false || kw == false || npsh == false) {
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

  
  
    let pumpElement: IPumpTd = {
      id: 0,
  coordinates: [],
  name: "",
  type: "",
  nominal_q: null,
  nominal_h: null,
  frame: '',
  wheel_order: '',
  base: '',  
  lid: '',   
  shaft_standart: '', 
  airVent: '', 
  oring: '',
  bolt: '',
  coupling: '',
  seal_order: '',  
  seal: '',
  d: '',
  b1: null,
  b2: null,
  b3: null,
  b4: null,
  b5: null,
  h1: null,
  h2: null,
  h3: null,
  l1: null,
  l2: null,
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
  weight: null,
  power: null,
  note: '',
  

    rpm: null,
    pole: null,
    dn: null,
    phase: null,
    voltage: null,

    minx_kw: 0,
    maxx_kw: 50,
    miny_kw: 0,
    maxy_kw: 50,
    formuls_kw: '',
    start_kw: null,
    finish_kw: null,
    step_kw: 0.2,
    step_x_kw: null,
    step_y_kw: null,

    minx_npsh: 0,
    maxx_npsh: 50,
    miny_npsh: 0,
    maxy_npsh: 50,
    formuls_npsh: '',
    start_npsh: null,
    finish_npsh: null,
    step_npsh: 0.2,
    step_x_npsh: null,
    step_y_npsh: null,
      }
      
      
      
      pumpElement.name = el.name ?? "DefaultTD"
      pumpElement.type = typeForData
      pumpElement.nominal_q=  el.nominal_q ?? null
      pumpElement.nominal_h = el.nominal_h ?? null  
      pumpElement.frame = el.frame ?? ""
      pumpElement.wheel_order = el.wheel_order ?? ""
      pumpElement.base=  el.base ?? ""
      pumpElement.lid = el.lid ?? ""
      pumpElement.shaft_standart=  el.shaft_standart ?? ""
      pumpElement.airVent = el.airVent ?? ""
      pumpElement.oring=  el.oring ?? ""
      pumpElement.bolt=  el.bolt ?? ""
      pumpElement.coupling=  el.coupling ?? ""
      pumpElement.seal_order = el.seal_order ?? ""
      pumpElement.seal = el.seal ?? ""
      pumpElement.d = el.d ?? ""
      pumpElement.b1 = el.b1 ?? null
      pumpElement.b2 = el.b2 ?? null
      pumpElement.b3 = el.b3 ?? null
      pumpElement.b4 = el.b4 ?? null
      pumpElement.b5 = el.b5 ?? null
      pumpElement.h1 = el.h1 ?? null
      pumpElement.h2 = el.h2 ?? null
      pumpElement.h3 = el.h3 ?? null
      pumpElement.l1 = el.l1 ?? null
      pumpElement.l2 = el.l2 ?? null
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
      pumpElement.weight=  el.weight ?? null
      pumpElement.power=  el.power ?? null  
  pumpElement.note = el.note ?? ""  

  pumpElement.rpm=  el.rpm ?? null  
  pumpElement.pole=  el.pole ?? null  
pumpElement.dn=  el.dn ?? null  
  pumpElement.phase = el.phase ?? null  
  pumpElement.voltage = el.voltage ?? null 
  
   pumpElement.minx_kw= el.minx_kw ?? 0
      pumpElement.maxx_kw= el.maxx_kw ?? 50
      pumpElement.miny_kw= el.miny_kw ?? 0
      pumpElement.maxy_kw= el.maxy_kw ?? 50
      pumpElement.formuls_kw=  el.formuls_kw ?? "x*1"
      pumpElement.start_kw=  el.start_kw ?? 0
      pumpElement.finish_kw=  el.finish_kw ?? 0
      pumpElement.step_kw= el.step_kw ?? 0.2
      pumpElement.step_x_kw = el.step_x_kw ?? 10
      pumpElement.step_y_kw = el.step_y_kw ?? 10
  
       pumpElement.minx_npsh= el.minx_npsh ?? 0
      pumpElement.maxx_npsh= el.maxx_npsh ?? 50
      pumpElement.miny_npsh= el.miny_npsh ?? 0
      pumpElement.maxy_npsh= el.maxy_npsh ?? 50
      pumpElement.formuls_npsh=  el.formuls_npsh ?? "x*1"
      pumpElement.start_npsh=  el.start_npsh ?? 0
      pumpElement.finish_npsh=  el.finish_npsh ?? 0
      pumpElement.step_npsh= el.step_npsh ?? 0.2
      pumpElement.step_x_npsh = el.step_x_npsh ?? 10
      pumpElement.step_y_npsh = el.step_y_npsh ?? 10
  
      return pumpElement
}