import type { IPump } from "../types/IPump"
import type { IType } from "../types/IType"


let fullName: string
let typeForData: number | string


let isErrors: boolean = false
let errorsMessage: string[] = []
let formula: string 

export const itemPumpForExel = (el: any, types: IType, i: number) => {
  errorsMessage = []
  isErrors = false

  if (el.name && el.name.indexOf("WQA")) {
    let diameter = el.diameter ? `${el.diameter}` : '' 
    let series = el.series ? `${el.series}` : '' 
    let nominal_q = el.nominal_q ? `${el.nominal_q}` : '' 
    let nominal_h = el.nominal_h ? `-${el.nominal_h}` : '' 
    let power = el.power ? `-${el.power}` : '' 
    let pole = el.pole ? `-${el.pole}` : '' 
    let execution = el.execution ? `-${el.execution}` : '' 
    fullName = diameter + series + nominal_q + nominal_h + power + pole + execution
    
  }
  else {
    fullName = el.name ?? 'Насос'
  }
// @ts-ignore
  let typeEltement = types.value.find(item => item.type == el.type)


  if (typeEltement) {
    typeForData = typeEltement.id
    
  } else {
    typeForData = ''
    isErrors = true
    errorsMessage.push('Неверный Тип насоса')

  }

  if (el.formuls) {
    try {
      let x = 1
      let y = eval(el.formuls.replace(/x/g, x))
      
    }
    catch (err) {
isErrors = true
      errorsMessage.push('Неверная формула')
      
    }
  }


  if (isErrors) {
    return { status: true, message: errorsMessage,  pump: el, index: i }
  }

  
  
    let pumpElement: IPump = {
        id: 0,
        coordinates: [],
        name: "",
        series: "",
        diameter: null,
        efficiency: null,
        note: "",
        power: null,
        speed: null,
        frequency: null,
        phase: null,
        voltage: null,
        launch: "",
        seal: "",
        shaft: "",
        pump: "",
      type: '',
        error: 1,
        minx: 0,
        maxx: 50,
        miny: 0,
        maxy: 50,
        formuls: '',
        start: null,
        finish: null,
        step: 0.2,
        nominal_q: null,
        nominal_h: null,
        bar: null,
        material_standart: '',
        material_order: '',
        isolation_standart: '',
        isolation_order: '',
        shaft_standart: '',
        shaft_order: '',
        bearing_standart: '',
        bearing_order: '',
        bearing_up_standart: '',
        bearing_up_order: '',
        bearing_down_standart: '',
        bearing_down_order: '',
        spring_standart: '',
        spring_order: '',
        seal_order: '',
        oring_standart: '',
        oring_order: '',
        protect_standart: '',
        protect_order: '',
        ip: null,
        current_strength: null,
        weight: null,
        size: '',
        l10: null,
        l6: null,
        l4: null,
        l3: null,
        de: '',
        m: null,
        l2: null,
        l1: null,
        l: null,
        h7: null,
        h6: null,
        h5: null,
        h4: null,
        h3: null,
        n2: '',
        j: null,
        b1: null,
        b: null,
        a1: null,
        a: null,
        n1: '',
        d1: null,
        d: null,
        g_l5: null,
        g_b2: null,
        g_h: null,
        g_h1: null,
        g_h2: null,
        g_l8: null,
        g_l9: null,
        g_l7: null,
        flange: null,
        wheel_standart: '',
        wheel_order: '',
      pole: '',
      execution: '',
      step_x: null,
      step_y: null,
      }
      
      
      
      pumpElement.name = fullName
      pumpElement.series=  el.series ?? ""
      pumpElement.diameter=  el.diameter ?? null
      pumpElement.efficiency=  el.efficiency ?? null
      pumpElement.note=  el.note ?? ""
      pumpElement.power=  el.power ?? null
      pumpElement.speed=  el.speed ?? null
      pumpElement.frequency=  el.frequency ?? null
      pumpElement.phase=  el.phase ?? null
      pumpElement.voltage=  el.voltage ?? null
      pumpElement.launch=  el.launch ?? ""
      pumpElement.seal=  el.seal ?? ""
      pumpElement.shaft=  el.shaft ?? ""
      pumpElement.pump=  el.pump ?? ""
  pumpElement.type = typeForData
      pumpElement.error= el.error ?? 1
      pumpElement.minx= el.minx ?? 0
      pumpElement.maxx= el.maxx ?? 50
      pumpElement.miny= el.miny ?? 0
      pumpElement.maxy= el.maxy ?? 50
      pumpElement.formuls=  el.formuls ?? "x*1"
      pumpElement.start=  el.start ?? 0
      pumpElement.finish=  el.finish ?? 0
      pumpElement.step= el.step ?? 0.2
      pumpElement.nominal_q=  el.nominal_q ?? null
      pumpElement.nominal_h=  el.nominal_h ?? null
      pumpElement.bar=  el.bar ?? null
      pumpElement.material_standart=  el.material_standart ?? ""
      pumpElement.material_order=  el.material_order ?? ""
      pumpElement.isolation_standart=  el.isolation_standart ?? ""
      pumpElement.isolation_order=  el.isolation_order ?? ""
      pumpElement.shaft_standart=  el.shaft_standart ?? ""
      pumpElement.shaft_order=  el.shaft_order ?? ""
      pumpElement.bearing_standart=  el.bearing_standart ?? ""
      pumpElement.bearing_order=  el.bearing_order ?? ""
      pumpElement.bearing_up_standart=  el.bearing_up_standart ?? ""
      pumpElement.bearing_up_order=  el.bearing_up_order ?? ""
      pumpElement.bearing_down_standart=  el.bearing_down_standart ?? ""
      pumpElement.bearing_down_order=  el.bearing_down_order ?? ""
      pumpElement.spring_standart=  el.spring_standart ?? ""
      pumpElement.spring_order=  el.spring_order ?? ""
      pumpElement.seal_order=  el.seal_order ?? ""
      pumpElement.oring_standart=  el.oring_standart ?? ""
      pumpElement.oring_order=  el.oring_order ?? ""
      pumpElement.protect_standart=  el.protect_standart ?? ""
      pumpElement.protect_order=  el.protect_order ?? ""
      pumpElement.ip=  el.ip ?? null
      pumpElement.current_strength=  el.current_strength ?? null
      pumpElement.weight=  el.weight ?? null
      pumpElement.size=  el.size ?? ""
      pumpElement.l10=  el.l10 ?? null
      pumpElement.l6=  el.l6 ?? null
      pumpElement.l4=  el.l4 ?? null
      pumpElement.l3=  el.l3 ?? null
      pumpElement.de=  el.de ?? ""
      pumpElement.m=  el.m ?? null
      pumpElement.l2=  el.l2 ?? null
      pumpElement.l1=  el.l1 ?? null
      pumpElement.l=  el.l ?? null
      pumpElement.h7=  el.h7 ?? null
      pumpElement.h6=  el.h6 ?? null
      pumpElement.h5=  el.h5 ?? null
      pumpElement.h4=  el.h4 ?? null
      pumpElement.h3=  el.h3 ?? null
      pumpElement.n2=  el.n2 ?? ""
      pumpElement. j=  el.j ?? null
      pumpElement.b1=  el.b1 ?? null
      pumpElement.b=  el.b ?? null
      pumpElement.a1=  el.a1 ?? null
      pumpElement.a=  el.a ?? null
      pumpElement.n1=  el.n1 ?? ""
      pumpElement.d1=  el.d1 ?? null
      pumpElement.d=  el.d ?? null
      pumpElement.g_l5=  el.g_l5 ?? null
      pumpElement.g_b2=  el.g_b2 ?? null
      pumpElement.g_h=  el.g_h ?? null
      pumpElement.g_h1=  el.g_h1 ?? null
      pumpElement.g_h2=  el.g_h2 ?? null
      pumpElement.g_l8=  el.g_l8 ?? null
      pumpElement.g_l9=  el.g_l9 ?? null
      pumpElement.g_l7=  el.g_l7 ?? null
      pumpElement.flange=  el.flange ?? null
      pumpElement.wheel_standart=  el. wheel_standart ?? ""
      pumpElement.wheel_order=  el. wheel_order ?? ""
      pumpElement.pole=  el.pole ?? null
  pumpElement.execution = el.execution ?? ''
  pumpElement.step_x = el.step_x ?? 10
  pumpElement.step_y = el.step_y ?? 10
    
      return pumpElement
}