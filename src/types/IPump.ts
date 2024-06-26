export interface IPump {
    id: number,
    coordinates?: {
        x: number,
        y: number
    }[],
    name: string,
    series: string,
    diameter: number | null,
    efficiency: number | null,
    note: string,
    power: number | null,
    speed: number | null,
    frequency: number | null,
    phase: number | null,
    voltage: number | null,
    launch: string,
    seal: string,
    shaft: string,
    pump: string,
    type: string | number,
    error: number | null,
    minx: number,
    maxx: number,
    miny: number,
    maxy: number,
    formuls: string,
    start: number | null,
    finish: number | null,
    step: number,
    nominal_q: number | null,
    nominal_h: number | null,
    bar: number | null,
    material_standart: string,
    material_order: string,
    isolation_standart: string,
    isolation_order: string,
    shaft_standart: string,
    shaft_order: string,
    bearing_standart: string,
    bearing_order: string,
    bearing_up_standart: string,
    bearing_up_order: string,
    bearing_down_standart: string,
    bearing_down_order: string,
    spring_standart: string,
    spring_order: string,
    seal_order: string,
    oring_standart: string,
    oring_order: string,
    protect_standart: string,
    protect_order: string,
    ip: number | null,
    current_strength: number | null,
    weight: number | null,
    size: string,
    l10: number | null,
    l6: number | null,
    l4: number | null,
    l3: number | null,
    de: string,
    m: number | null,
    l2: number | null,
    l1: number | null,
    l:number |  null,
    h7: number | null,
    h6: number | null,
    h5: number | null,
    h4: number | null,
    h3: number | null,
    n2: string,
    j: number | null,
    b1: number | null,
    b: number | null,
    a1: number | null,
    a: number | null,
    n1: string,
    d1: number | null,
    d: number | null,
    g_l5: number | null,
    g_b2: number | null,
    g_h: number | null,
    g_h1: number | null,
    g_h2: number | null,
    g_l8: number | null,
    g_l9: number | null,
    g_l7: number | null,
    flange: number | null,
    wheel_standart: string,
    wheel_order: string,
    date_update?: string | null,
    pole:  string| number | null,
    execution: string,
    step_x: number | null,
    step_y: number | null,
}

export interface IPumpTd {
    id: number,
    coordinates?: {
        x: number,
        y: number
    }[],
    name: string,
    type: string | number,
    nominal_q: number | null,
    nominal_h: number | null,
    frame: string,
    wheel_order: string,
    base: string,
    lid: string,   
    shaft_standart: string, 
    airVent: string, 
    oring: string,
    bolt: string,
    coupling: string,
    seal_order: string,
    seal:string,
    d: number | null,
    b1: number | null,
    b2: number | null,
    b3: number | null,
    b4: number | null,
    b5: number | null,
    h1: number | null,
    h2: number | null,
    h3: number | null,
    l1: number | null,
    l2: number | null,
    weight: number | null,
    power: number | null, 
    note: string,
    error: number | null,
    minx: number,
    maxx: number,
    miny: number,
    maxy: number,
    formuls: string,
    start: number | null,
    finish: number | null,
    step: number,
    step_x: number | null,
    step_y: number | null,
    date_update?: string | null,
    
    rpm: number | null,
    pole: string| number | null,
    dn: number | null,
    phase: number | null,
    voltage: number | null,

    minx_kw: number,
    maxx_kw: number,
    miny_kw: number,
    maxy_kw: number,
    formuls_kw: string,
    start_kw: number | null,
    finish_kw: number | null,
    step_kw: number,
    step_x_kw: number | null,
    step_y_kw: number | null,

    minx_npsh: number,
    maxx_npsh: number,
    miny_npsh: number,
    maxy_npsh: number,
    formuls_npsh: string,
    start_npsh: number | null,
    finish_npsh: number | null,
    step_npsh: number,
    step_x_npsh: number | null,
    step_y_npsh: number | null,
}


export interface IPumpCdlf {
    id: number,
    coordinates?: {
        x: number,
        y: number
    }[],
    name: string,
    type: string | number,
    b1: number | null,
    b2: number | null,
    b12: number | null,
    d1: number | null,
    d2: number | null,
    weight: number | null,
    power: number | null,    
    engineMount: string,
    diffuser: string,
    innerBody: string,
    housingSupport: string,  
    coupling: string, 
    wheel: string, 
    outerCasing: string, 
    shaft: string, 
    pipe: string, 
    lid: string, 
    base: string,
    note: string,
    error: number | null,
    minx: number,
    maxx: number,
    miny: number,
    maxy: number,
    formuls: string,
    start: number | null,
    finish: number | null,
    step: number,
    step_x: number | null,
    step_y: number | null,
    date_update?: string | null,
    
}


export interface IPumpsAll extends IPump, IPumpTd, IPumpCdlf {

}