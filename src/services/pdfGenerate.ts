import { APIPDF } from "../api/api"
import { API } from "../api/api"


function isWqaName(name: string | undefined) {
    if (name && name.indexOf("WQA")) {
        let newName = name.replace('-', '').replace('-', '')
        return newName
    } else {
        return name
    }
}

const textForNull = (item: string | number | null | undefined) => {
    if (!item || item == '' || item == 'null') {
        return '---'
    } else {
        return item
    }
}

const CenteredLayout = {
    // @ts-ignore
    paddingTop: function (index, node) {
        applyVerticalAlignment(node, index, 'center', [])
        return 0
    },
    defaultBorder: true,
}

function findInlineHeight(
    // @ts-ignore
    cell,
    // @ts-ignore
    maxWidth,
    // @ts-ignore
    usedWidth = 0,
    // @ts-ignore
    rowIndex,
    // @ts-ignore
    columnIndex
) {
    if (cell._margin) {
        maxWidth = maxWidth - cell._margin[0] - cell._margin[2]
    }
    // @ts-ignore
    let calcLines = inlines => {
        if (!inlines) {
            return {
                height: 0,
                width: 0,
            }
        }
        let currentMaxHeight = 0
        let lastHadLineEnd = false
        for (const currentNode of inlines) {
            usedWidth += currentNode.width
            if (usedWidth > maxWidth || lastHadLineEnd) {
                currentMaxHeight += currentNode.height
                usedWidth = currentNode.width
            } else {
                currentMaxHeight = Math.max(currentNode.height, currentMaxHeight)
            }
            lastHadLineEnd = !!currentNode.lineEnd
        }
        return fillMargin({
            height: currentMaxHeight,
            width: usedWidth,
        },
            cell._margin
        )
    }
    if (cell._offsets) {
        usedWidth += cell._offsets.total
    }
    if (cell._inlines && cell._inlines.length) {
        return calcLines(cell._inlines)
    } else if (cell.stack && cell.stack[0]) {
        return fillMargin(
            cell.stack
                // @ts-ignore
                .map(item => {
                    // @ts-ignore
                    return findInlineHeight(item, maxWidth)
                })
                // @ts-ignore
                .reduce((prev, next) => {
                    return {
                        height: prev.height + next.height,
                        width: Math.max(prev.width + next.width),
                    }
                }),
            cell._margin
        )
    } else if (cell.ul) {
        return fillMargin(
            cell.ul
                // @ts-ignore
                .map(item => {
                    // @ts-ignore
                    return findInlineHeight(item, maxWidth)
                })
                // @ts-ignore
                .reduce((prev, next) => {
                    return {
                        height: prev.height + next.height,
                        width: Math.max(prev.width + next.width),
                    }
                }),
            cell._margin
        )
    } else if (cell.table) {
        let currentMaxHeight = 0
        for (const currentTableBodies of cell.table.body) {
            // @ts-ignore
            const innerTableHeights = currentTableBodies.map(val =>
                mapTableBodies(val, maxWidth, usedWidth)
            )
            currentMaxHeight = Math.max(...innerTableHeights, currentMaxHeight)
        }
        return fillMargin({
            height: currentMaxHeight,
            width: usedWidth,
        },
            cell._margin
        )
    } else if (cell._height) {
        usedWidth += cell._width
        return fillMargin({
            height: cell._height,
            width: usedWidth,
        },
            cell._margin
        )
    }

    return fillMargin({
        height: null,
        width: usedWidth,
    },
        cell._margin
    )
}
// @ts-ignore
function mapTableBodies(innerTableCell, maxWidth, usedWidth) {


    // @ts-ignore
    const inlineHeight = findInlineHeight(innerTableCell, maxWidth, usedWidth)

    usedWidth = inlineHeight.width
    return inlineHeight.height
}
// @ts-ignore
function fillMargin(obj, margin) {
    if (margin) {
        obj.height += margin[1] + margin[3]
        obj.width += margin[0] + margin[2]
    }
    return obj
}
// @ts-ignore
function updateRowSpanCell(rowHeight, rowSpanCell) {
    for (let i = rowSpanCell.length - 1; i >= 0; i--) {
        const rowCell = rowSpanCell[i]
        rowCell.maxHeight = rowCell.maxHeight + rowHeight
        const {
            maxHeight,
            cellHeight,
            align,
            cell
        } = rowCell
        rowCell.rowSpanCount = rowCell.rowSpanCount - 1
        if (!rowCell.rowSpanCount) {
            if (cellHeight && maxHeight > cellHeight) {
                let topMargin

                let cellAlign = align
                if (Array.isArray(align)) {
                    cellAlign = align
                }
                if (cellAlign === 'bottom') {
                    topMargin = maxHeight - cellHeight
                } else if (cellAlign === 'center') {
                    topMargin = (maxHeight - cellHeight) / 2
                }
                if (topMargin) {
                    if (cell._margin) {
                        cell._margin[1] = cell._margin[1] + topMargin
                    } else {
                        cell._margin = [0, topMargin, 0, 0]
                    }
                }
            }
            rowSpanCell.splice(i, 1)
        }
    }
}

function applyVerticalAlignment(
    // @ts-ignore
    node,
    // @ts-ignore
    rowIndex,
    // @ts-ignore
    align,
    // @ts-ignore
    rowSpanCell,
    // @ts-ignore
    manualHeight = 0
) {
    // New default argument
    const allCellHeights = node.table.body[rowIndex].map(
        // @ts-ignore
        (innerNode, columnIndex) => {
            if (innerNode._span) return null
            const calcWidth = [...Array(innerNode.colSpan || 1).keys()].reduce(
                (acc, i) => {
                    return acc + node.table.widths[columnIndex + i]._calcWidth
                },
                0
            )
            const mFindInlineHeight = findInlineHeight(
                innerNode,
                calcWidth,
                0,
                rowIndex,
                columnIndex
            )
            return mFindInlineHeight.height
        }
    )
    let maxRowHeight = manualHeight ?
        // @ts-ignore
        manualHeight[rowIndex] :
        Math.max(...allCellHeights) // handle manual height
    // @ts-ignore
    node.table.body[rowIndex].forEach((cell, ci) => {
        // rowSpan
        if (cell.rowSpan) {
            rowSpanCell.push({
                cell,
                rowSpanCount: cell.rowSpan,
                cellHeight: allCellHeights[ci],
                maxHeight: 0,
                align,
            })
            return
        }
        if (allCellHeights[ci] && maxRowHeight > allCellHeights[ci]) {
            let topMargin

            let cellAlign = align
            if (Array.isArray(align)) {
                cellAlign = align[ci]
            }
            if (cellAlign === 'bottom') {
                topMargin = maxRowHeight - allCellHeights[ci]
            } else if (cellAlign === 'center') {
                topMargin = (maxRowHeight - allCellHeights[ci]) / 2
            }
            if (topMargin) {
                if (cell._margin) {
                    cell._margin[1] += topMargin
                } else {
                    cell._margin = [0, topMargin, 0, 0]
                }
            }
        }
    })
    updateRowSpanCell(maxRowHeight, rowSpanCell)
    if (rowSpanCell.length > 0) {
        applyVerticalAlignment(node, rowIndex + 1, align, rowSpanCell, manualHeight)
    }
}


export const pdfGenerate = (itemPump: any, pumpSelect: any, date: any, canvas: any) => {



    return {
        info: {
            title: 'Название фирмы',
            author: 'Название фирмы',
            subject: 'Насосы',
            keywords: 'Насосы',
        },

        pageSize: 'A4',
        pageOrientation: 'portrait', //landscape
        pageMargins: [30, 10, 10, 40],
        // @ts-ignore
        footer: function (currentPage, pageCount) {
            return [{
                columns: [{
                    text: 'VOLGA.SU',
                    link: 'https://volga.su',
                    bold: true,
                    margin: [100, 0, 0, 0],
                    color: '#00385c',
                },
                {
                    text: '-' + currentPage.toString() + '/' + pageCount + '-',
                    alignment: 'right',
                    bold: true,
                    margin: [0, 0, 80, 0],
                    color: '#00385c',
                },
                ],
            },]
        },
        //  footer: {
        //  	columns: [
        //  		'Left part',
        //  		{
        //  			text: 'Right part',
        //  			alignment: 'right'
        //  		}
        //  	]
        //  },
        watermark: { text: 'ВОЛГА', color: '#00416A', opacity: 0.08, bold: true, angle: 0, fontSize: 120, font: 'DaysSansBlack', },
        //страница 1
        content: [{
            table: {
                widths: [110, '*', 90, 50, 30],
                body: [
                    [{
                        rowSpan: 4,
                        image: 'snow',
                        width: 100,
                        height: 21,
                        alignment: 'center',
                    },
                    {
                        rowSpan: 4,
                        text: 'Лист подбора\n насосного агрегата',
                        alignment: 'center',
                        margin: [0, -5, 0, 0]
                        
                    },
                    {
                        text: 'Дата подбора:',
                        alignment: 'right',
                        margin: [0, -5, 0, 0],
                    },
                    {
                        colSpan: 2,
                        text: date,
                        margin: [0, -5, 0, 0],
                    },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'Поставщик:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: 'Стандарт групп',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'E-mail:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: 'sale@stgp.su',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'Телефон:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: '+7(495)664-63-86',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],

                    [{
                        rowSpan: 2,
                        text: 'Насосный агрегат:',
                        alignment: 'right',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        rowSpan: 2,
                        text: itemPump.value.name,
                        alignment: 'center',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        rowSpan: 2,
                        text: 'Номинальная рабочая точка:',
                        alignment: 'right',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        colSpan: 1,
                        text: 'Q (м³/ч):',
                        alignment: 'right',
                        margin: [0, -5, 0, -1],
                    },
                    {
                        text: itemPump.value.nominal_q,
                        alignment: 'center',
                        margin: [0, -5, 0, -1],
                    },
                    ],
                    [
                        '',
                        '',
                        '',
                        {
                            text: 'H (м.в.ст.):',
                            alignment: 'right',
                            margin: [0, 0, 0, -2],
                        },
                        {
                            text: itemPump.value.nominal_h,
                            alignment: 'center',
                            margin: [0, 0, 0, -2],
                        },
                    ],
                ],
            },
            layout: CenteredLayout,
        },
        {
            text: ' ',
        },
        {
            table: {
                widths: [60, '*', 130, 130, 50],
                body: [
                    [{
                        colSpan: 5,
                        text: '1. Основные характеристики',
                        bold: true,
                    },
                        '',
                        '',
                        '',
                        '',
                    ],
                    [{
                        colSpan: 2,
                        text: 'Фото модели',
                        alignment: 'center',
                    },
                        '',
                    {
                        colSpan: 3,
                        text: 'Описание изделия',
                        alignment: 'center',
                    },
                        '',
                        '',
                    ],
                    [{
                        colSpan: 2,
                        image: 'list1',
                        width: 90,
                        height: 80,
                        alignment: 'center',
                    },
                        '',
                    {
                        colSpan: 3,
                        text: 'Насосные агрегаты Волга, серии WQA используются в дренажных системах водоотведения, сбора, перекачивания и очистки сточных вод. Насосные агрегаты, имеют высокую эффективность и стабильную работу в широком диапазоне, а использование усовершенствованной гидравлической формулы позволяет развивать эффект полного напора, что позволяет достичь широких зон высокой эффективности, при стабильной работе.',
                        alignment: 'justify',
                    },
                        '',
                        '',
                    ],

                    [{
                        colSpan: 2,
                        text: 'Параметры',
                        alignment: 'center',
                        bold: true,
                    },
                        '',
                    {
                        text: ' ',
                    },
                    {
                        text: ' ',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Выбранный расход, Q (м³/ч):',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(pumpSelect.pumpX),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Выбранный напор, H (м.в.ст.):',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(pumpSelect.pumpY),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Номинальный КПД двигателя, %:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.efficiency),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Номинальная скорость вращения вала, rpm:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.speed),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Номинальное рабочее давление бар:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.bar),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    {
                        text: ' ',
                    },
                    ],
                   
                    [{
                        colSpan: 2,
                        text: 'Материалы',
                        alignment: 'center',
                        bold: true,
                    },
                        '',
                    {
                        text: 'Стандарт',
                        alignment: 'center',
                    },
                    {
                        text: 'Под заказ',
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Корпус насоса, крышка масляной камеры, корпус масляной камеры, корпус двигателя и крышка насоса, верхней крышки и основание насоса:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.material_standart),
                        alignment: 'center',
                        margin: [0, 15, 0, 0],
                    },
                    {
                        text: textForNull(itemPump.value?.material_order),
                        alignment: 'center',
                        margin: [0, 15, 0, 0],
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Рабочее колесо:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.wheel_standart),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value?.wheel_order),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Класс изоляции двигателя:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.isolation_standart),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.isolation_order),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Вал насоса:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.shaft_standart),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.shaft_order),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    ],

                    [{
                        rowSpan: 5,
                        text: 'Торцевое уплотнение вала:',
                        alignment: 'center',
                        margin: [0, 19, 0, 0],
                    },
                    {
                        text: 'Производитель подшипника:',
                        alignment: 'right',
                    },

                    {
                        text: textForNull(itemPump.value.bearing_standart),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.bearing_order),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [
                        '',
                        {
                            text: 'На двигателе:',
                            alignment: 'right',
                        },

                        {
                            text: textForNull(itemPump.value.bearing_up_standart),
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.bearing_up_order),
                            alignment: 'center',
                        },
                        {
                            text: ' ',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'На насосе:',
                            alignment: 'right',
                        },

                        {
                            text: textForNull(itemPump.value.bearing_down_standart),
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.bearing_down_order),
                            alignment: 'center',
                        },
                        {
                            text: ' ',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'Материал пружины:',
                            alignment: 'right',
                        },

                        {
                            text: textForNull(itemPump.value.spring_standart),
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.spring_order),
                            alignment: 'center',
                        },
                        {
                            text: ' ',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'Уплотнитель торцевой:',
                            alignment: 'right',
                        },

                        {
                            text: textForNull(itemPump.value.seal),
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.oring_standart),
                            alignment: 'center',
                        },
                        {
                            text: ' ',
                        },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Уплотнение O-ring:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.oring_standart),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.oring_order),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Устройство защиты насоса:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.protect_standart),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.protect_order),
                        alignment: 'center',
                    },
                        '',
                    ],
                
                    [{
                        colSpan: 2,
                        text: 'Размеры',
                        alignment: 'center',
                        bold: true,
                    },
                        '',
                    {
                        text: '',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Диаметр выпускного коллектора DN:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.diameter),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Тип исполнения:',
                        alignment: 'right',
                    },
                        '',
                        {
                            text: textForNull(itemPump.value.execution),
                            alignment: 'center',
                        },
                        {
                            text: '',
                        },
                        {
                            text: ' ',
                        },
                    ],
                 
                    [{
                        colSpan: 2,
                        text: 'Двигатель',
                        alignment: 'center',
                        bold: true,
                    },
                        '',
                    {
                        text: '',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Количество фаз:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.phase),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Количество полюсов:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.pole),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Степень защиты, IP:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.ip),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Номинальное питание, кВт:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.power),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Частота работы, Hz:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.frequency),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Номинальное напряжение, V:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.voltage),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Номинальная сила тока, А:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.current_strength),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Способ запуска:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.launch),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Вес:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value.weight),
                        alignment: 'center',
                    },
                    {
                        text: '',
                    },
                    {
                        text: ' ',
                    },
                    ],
                ],
            },
            layout: {
                CenteredLayout,
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
                // hLineStyle: function (i: any, node: any) { return {dash: { length: 10, space: 4 }}; },
                // vLineStyle: function (i: any, node: any) { return {dash: { length: 10, space: 4 }}; },
                // paddingLeft: function(i, node) { return 4; },
                // paddingRight: function(i, node) { return 4; },
                // paddingTop: function(i, node) { return 2; },
                // paddingBottom: function(i, node) { return 2; },
                // fillColor: function (rowIndex, node, columnIndex) { return null; }
            },
        },
        // страница 2
        {
            table: {
                widths: [110, '*', 90, 50, 30], 
                body: [
                    [{
                        rowSpan: 4,
                        image: 'snow',
                        width: 100,
                        height: 21,
                        alignment: 'center',
                    },
                    {
                        rowSpan: 4,
                        text: 'Лист подбора\n насосного агрегата',
                        alignment: 'center',
                        margin: [0, -5, 0, 0],
                    },
                    {
                        text: 'Дата подбора:',
                        alignment: 'right',
                        margin: [0, -5, 0, 0],
                    },
                    {
                        colSpan: 2,
                        text: date,
                        margin: [0, -5, 0, 0],
                    },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'Поставщик:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: 'Стандарт групп',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'E-mail:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: 'sale@stgp.su',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'Телефон:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: '+7(495)664-63-86',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],

                    [{
                        rowSpan: 2,
                        text: 'Насосный агрегат:',
                        alignment: 'right',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        rowSpan: 2,
                        text: itemPump.value.name,
                        alignment: 'center',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        rowSpan: 2,
                        text: 'Номинальная рабочая точка:',
                        alignment: 'right',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        colSpan: 1,
                        text: 'Q (м³/ч):',
                        alignment: 'right',
                        margin: [0, -5, 0, -1],
                    },
                    {
                        text: itemPump.value.nominal_q,
                        alignment: 'center',
                        margin: [0, -5, 0, -1],
                    },
                    ],
                    [
                        '',
                        '',
                        '',
                        {
                            text: 'H (м.в.ст.):',
                            alignment: 'right',
                            margin: [0, 0, 0, -2],
                        },
                        {
                            text: itemPump.value.nominal_h,
                            alignment: 'center',
                            margin: [0, 0, 0, -2],
                        },
                    ],
                ],
            },
            layout: CenteredLayout,
            pageBreak: 'before',
        },
        {
            text: ' ',
        },
        {
            table: {
                widths: ['*'],
                body: [
                    [{
                        text: '2.	График гидравлической характеристики насосного агрегата',
                        bold: true,
                    },],
                    [{
                        // @ts-ignore
                        image: canvas,
                        width: 400,
                        height: 200,
                        alignment: 'center',
                        margin: [0, 5],
                    },],
                ],
            },
            layout: {
                CenteredLayout,
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
            },
        },
        {
            text: ' ',
        },

        {
            table: {
                widths: ['*', '*'],
                body: [
                    [{
                        colSpan: 2,
                        text: '3.	Схема насосного агрегата',
                        bold: true,
                    },
                        ''
                    ],
                    [{
                        image: 'list2_1',
                        width: 200,
                        height: 200,
                        alignment: 'center',
                        margin: [0, 5, 0, 5],
                    },
                    {
                        image: 'list2_2',
                        width: 200,
                        height: 200,
                        alignment: 'center',
                        margin: [0, 5, 0, 5],
                    },
                    ],
                    [{
                        text: 'Мощность до 11 кВт',
                        alignment: 'center',
                    },
                    {
                        text: 'Мощность свыше 11 кВт',
                        alignment: 'center',
                    }
                    ],
                ],
            },
            layout: {
                CenteredLayout,
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
            },
        },


        // 3 страница

        {
            table: {
                widths: [110, '*', 90, 50, 30], 
                body: [
                    [{
                        rowSpan: 4,
                        image: 'snow',
                        width: 100,
                        height: 21,
                        alignment: 'center',
                    },
                    {
                        rowSpan: 4,
                        text: 'Лист подбора\n насосного агрегата',
                        alignment: 'center',
                        margin: [0, -5, 0, 0],
                    },
                    {
                        text: 'Дата подбора:',
                        alignment: 'right',
                        margin: [0, -5, 0, 0],
                    },
                    {
                        colSpan: 2,
                        text: date,
                        margin: [0, -5, 0, 0],
                    },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'Поставщик:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: 'Стандарт групп',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'E-mail:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: 'sale@stgp.su',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'Телефон:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: '+7(495)664-63-86',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],

                    [{
                        rowSpan: 2,
                        text: 'Насосный агрегат:',
                        alignment: 'right',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        rowSpan: 2,
                        text: itemPump.value.name,
                        alignment: 'center',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        rowSpan: 2,
                        text: 'Номинальная рабочая точка:',
                        alignment: 'right',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        colSpan: 1,
                        text: 'Q (м³/ч):',
                        alignment: 'right',
                        margin: [0, -5, 0, -1],
                    },
                    {
                        text: itemPump.value.nominal_q,
                        alignment: 'center',
                        margin: [0, -5, 0, -1],
                    },
                    ],
                    [
                        '',
                        '',
                        '',
                        {
                            text: 'H (м.в.ст.):',
                            alignment: 'right',
                            margin: [0, 0, 0, -2],
                        },
                        {
                            text: itemPump.value.nominal_h,
                            alignment: 'center',
                            margin: [0, 0, 0, -2],
                        },
                    ],
                ],
            },
            layout: CenteredLayout,
            pageBreak: 'before',
        },
        {
            text: ' ',
        },
        {
            table: {
                widths: [380, '*', '*'],
                body: [
                    [{
                        colSpan: 3,
                        text: '4.	Габариты размеры автоматической трубной муфты и насосного агрегата',
                        bold: true,
                    },
                        '',
                        '',
                    ],
                    [{
                        rowSpan: 27,
                        image: 'list3',
                        width: 330,
                        height: 600,
                        alignment: 'center',
                        margin: [0, 12, 0, 0],
                    },
                    {
                        text: 'Размер трубной направляющей',
                        margin: [0, 3],
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.size),
                        margin: [0, 8, 0, 0],
                        alignment: 'center',
                    },
                    ],
                    [
                        '',
                        {
                            text: 'L10',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.l10),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'L6',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.l6),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'L4',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.l4),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],

                    [
                        '',
                        {
                            text: 'L3',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.l3),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'Øe',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.de),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'M',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.m),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'L2',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.l2),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'L1',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.l1),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'L',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.l),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'H7',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.h7),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'H6',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.h6),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'H5',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.h5),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'H4',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.h4),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'H3',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.h3),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            colSpan: 2,
                            text: 'Размеры опорного колена, мм',
                            alignment: 'center',
                            bold: true,
                            margin: [0, 8],
                        },
                        '',
                    ],
                    [
                        '',
                        {
                            text: 'n2-Ød2',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.n2),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'J',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.j),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'B1',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.b1),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'B',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.b),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'A1',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.a1),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'A',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.a),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            colSpan: 2,
                            text: 'Размер фланцев, мм',
                            alignment: 'center',
                            bold: true,
                            margin: [0, 8],
                        },
                        '',
                    ],
                    [
                        '',
                        {
                            text: 'N1-Ød1',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.n1),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'D1',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.d1),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'D',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.d),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'DN, фланца насоса',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: itemPump.value.flange,
                            margin: [0, 3],
                            alignment: 'center',

                        },
                    ],
                ],
            },
            layout: {
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
            },
        },

        //страница 4
        {
            table: {
                widths: [110, '*', 90, 50, 30],
                body: [
                    [{
                        rowSpan: 4,
                        image: 'snow',
                        width: 100,
                        height: 21,
                        alignment: 'center',
                    },
                    {
                        rowSpan: 4,
                        text: 'Лист подбора\n насосного агрегата',
                        alignment: 'center',
                        margin: [0, -5, 0, 0],
                    },
                    {
                        text: 'Дата подбора:',
                        alignment: 'right',
                        margin: [0, -5, 0, 0],
                    },
                    {
                        colSpan: 2,
                        text: date,
                        margin: [0, -5, 0, 0],
                    },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'Поставщик:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: 'Стандарт групп',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'E-mail:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: 'sale@stgp.su',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],
                    [
                        '',
                        '',
                        {
                            text: 'Телефон:',
                            alignment: 'right',
                            margin: [0, 0, 0, -1],
                        },
                        {
                            colSpan: 2,
                            text: '+7(495)664-63-86',
                            margin: [0, 0, 0, -1],
                        },
                        '',
                    ],

                    [{
                        rowSpan: 2,
                        text: 'Насосный агрегат:',
                        alignment: 'right',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        rowSpan: 2,
                        text: itemPump.value.name,
                        alignment: 'center',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        rowSpan: 2,
                        text: 'Номинальная рабочая точка:',
                        alignment: 'right',
                        margin: [0, -5, 0, -2],
                    },
                    {
                        colSpan: 1,
                        text: 'Q (м³/ч):',
                        alignment: 'right',
                        margin: [0, -5, 0, -1],
                    },
                    {
                        text: itemPump.value.nominal_q,
                        alignment: 'center',
                        margin: [0, -5, 0, -1],
                    },
                    ],
                    [
                        '',
                        '',
                        '',
                        {
                            text: 'H (м.в.ст.):',
                            alignment: 'right',
                            margin: [0, 0, 0, -2],
                        },
                        {
                            text: itemPump.value.nominal_h,
                            alignment: 'center',
                            margin: [0, 0, 0, -2],
                        },
                    ],
                ],
            },
            layout: CenteredLayout,
            pageBreak: 'before',
        },
        {
            text: ' ',
        },
        {
            table: {
                widths: [110, 110, '*', '*'],
                body: [
                    [{
                        colSpan: 4,
                        text: '5.	Дополнительные параметры и данные',
                        bold: true,
                    },
                        '',
                        '',
                        '',
                    ],
                    [{
                        colSpan: 4,
                        text: 'Габариты разных типов насосных агрегатов с указанием минимального уровня жидкости',
                        bold: true,
                    },
                        '',
                        '',
                        '',
                    ],
                    [{
                        image: 'list4_1',
                        width: 100,
                        height: 150,
                        alignment: 'center',
                    },
                    {
                        image: 'list4_2',
                        width: 100,
                        height: 150,
                        alignment: 'center',
                    },
                    {
                        image: 'list4_3',
                        width: 140,
                        height: 150,
                        alignment: 'center',
                    },
                    {
                        image: 'list4_4',
                        width: 140,
                        height: 150,
                        alignment: 'center',
                    },
                    ],
                ],
            },
            layout: {
                CenteredLayout,
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
            },
        },
        {
            table: {
                widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
                body: [
                    [{
                        text: 'L5',
                        alignment: 'center',
                    },
                    {
                        text: 'B2',
                        alignment: 'center',
                    },
                    {
                        text: 'H',
                        alignment: 'center',
                    },
                    {
                        text: 'H1',
                        alignment: 'center',
                    },
                    {
                        text: 'H2',
                        alignment: 'center',
                    },
                    {
                        text: 'L8',
                        alignment: 'center',
                    },
                    {
                        text: 'L9',
                        alignment: 'center',
                    },
                    {
                        text: 'L7',
                        alignment: 'center',
                    },
                    {
                        text: 'КГ',
                        alignment: 'center',
                    },
                    ],
                    [{
                        text: textForNull(itemPump.value.g_l5),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.g_b2),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.g_h),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.g_h1),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.g_h2),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.g_l8),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.g_l9),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.g_l7),
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.weight),
                        alignment: 'center',
                    },
                    ],
                ],
            },
            layout: {
                CenteredLayout,
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
            },
        },

        {
            text: ' ',
        },

        {
            table: {
                widths: [
                    100,
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    80,
                ],
                body: [
                    [{
                        colSpan: 13,
                        text: 'Спецификация требуемых трубных направляющих (бесшовная стальная/нержавеющая труба)*',
                        bold: true,
                    },
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ],
                    [{
                        text: 'Диметр патрубка',
                        alignment: 'center',
                    },
                    {
                        text: '40',
                        alignment: 'center',
                    },
                    {
                        text: '50',
                        alignment: 'center',
                    },
                    {
                        text: '65',
                        alignment: 'center',
                    },
                    {
                        text: '80',
                        alignment: 'center',
                    },
                    {
                        text: '10',
                        alignment: 'center',
                    },
                    {
                        text: '150',
                        alignment: 'center',
                    },
                    {
                        text: '20',
                        alignment: 'center',
                    },
                    {
                        text: '250',
                        alignment: 'center',
                    },
                    {
                        text: '300',
                        alignment: 'center',
                    },
                    {
                        text: '350',
                        alignment: 'center',
                    },
                    {
                        text: '400',
                        alignment: 'center',
                    },
                    {
                        text: '500',
                        alignment: 'center',
                    },
                    ],

                    [{
                        text: 'Внешний DN х \n толщина стенки, мм',
                        alignment: 'center',
                    },
                    {
                        colSpan: 3,
                        text: "1''/Ø33х3",
                        margin: [0, 6, 0, 0],
                        alignment: 'center',
                    },
                        '',
                        '',
                    {
                        colSpan: 5,
                        text: "1,5''/Ø48х3",
                        margin: [0, 6, 0, 0],
                        alignment: 'center',
                    },
                        '',
                        '',
                        '',
                        '',
                    {
                        colSpan: 3,
                        text: "2''/Ø60х3",
                        margin: [0, 6, 0, 0],
                        alignment: 'center',
                    },
                        '',
                        '',
                    {
                        text: "2,5''/Ø76х3",
                        margin: [0, 6, 0, 0],
                        alignment: 'center',
                    },
                    ],
                ],
            },
            layout: {
                CenteredLayout,
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
            },
        },
        {
            text: ' ',
        },
        {
            table: {
                widths: [
                    100,
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                    '*',
                ],
                body: [
                    [{
                        colSpan: 13,
                        text: 'Вес комплекта автоматической трубной муфты*',
                        bold: true,
                    },
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ],
                    [{
                        text: 'Диметр патрубка',
                        alignment: 'center',
                    },
                    {
                        text: '40',
                        alignment: 'center',
                    },
                    {
                        text: '50',
                        alignment: 'center',
                    },
                    {
                        text: '65',
                        alignment: 'center',
                    },
                    {
                        text: '80',
                        alignment: 'center',
                    },
                    {
                        text: '10',
                        alignment: 'center',
                    },
                    {
                        text: '150',
                        alignment: 'center',
                    },
                    {
                        text: '20',
                        alignment: 'center',
                    },
                    {
                        text: '250',
                        alignment: 'center',
                    },
                    {
                        text: '300',
                        alignment: 'center',
                    },
                    {
                        text: '350',
                        alignment: 'center',
                    },
                    {
                        text: '400',
                        alignment: 'center',
                    },
                    {
                        text: '500',
                        alignment: 'center',
                    },
                    ],
                    [{
                        text: 'Вес комплекта, кг',
                        alignment: 'center',
                    },
                    {
                        text: '10',
                        alignment: 'center',
                    },
                    {
                        text: '16',
                        alignment: 'center',
                    },
                    {
                        text: '21',
                        alignment: 'center',
                    },
                    {
                        text: '27',
                        alignment: 'center',
                    },
                    {
                        text: '38',
                        alignment: 'center',
                    },
                    {
                        text: '107',
                        alignment: 'center',
                    },
                    {
                        text: '135',
                        alignment: 'center',
                    },
                    {
                        text: '195',
                        alignment: 'center',
                    },
                    {
                        text: '320',
                        alignment: 'center',
                    },
                    {
                        text: '410',
                        alignment: 'center',
                    },
                    {
                        text: '742',
                        alignment: 'center',
                    },
                    {
                        text: '780',
                        alignment: 'center',
                    },
                    ],
                    [{
                        colSpan: 13,
                        text: 'Комплект автоматической трубной муфты входит опорное колено, зацеп фланцевого подключения и кронштейн для направляющих.',
                    },
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ],
                ],
            },
            layout: {
                CenteredLayout,
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
            },
        },
        {
            text: ' ',
        },
        {
            table: {
                widths: [150, '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
                body: [
                    [{
                        colSpan: 12,
                        text: 'Таблица характеристик рекомендуемых грузоподъемных цепей*',
                        bold: true,
                    },
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ],
                    [{
                        text: 'Размер цепи, мм',
                        alignment: 'center',
                    },
                    {
                        text: '5',
                        alignment: 'center',
                    },
                    {
                        text: '6,3',
                        alignment: 'center',
                    },
                    {
                        text: '8',
                        alignment: 'center',
                    },
                    {
                        text: '10',
                        alignment: 'center',
                    },
                    {
                        text: '12,5',
                        alignment: 'center',
                    },
                    {
                        text: '14',
                        alignment: 'center',
                    },
                    {
                        text: '16',
                        alignment: 'center',
                    },
                    {
                        text: '18',
                        alignment: 'center',
                    },
                    {
                        text: '20',
                        alignment: 'center',
                    },
                    {
                        text: '25',
                        alignment: 'center',
                    },
                    {
                        text: '28',
                        alignment: 'center',
                    },
                    ],
                    [{
                        text: 'Предельная нагрузка, кг',
                        alignment: 'center',
                    },
                    {
                        text: '0,4',
                        alignment: 'center',
                    },
                    {
                        text: '0,63',
                        alignment: 'center',
                    },
                    {
                        text: '1',
                        alignment: 'center',
                    },
                    {
                        text: '1,6',
                        alignment: 'center',
                    },
                    {
                        text: '2,5',
                        alignment: 'center',
                    },
                    {
                        text: '3,2',
                        alignment: 'center',
                    },
                    {
                        text: '4',
                        alignment: 'center',
                    },
                    {
                        text: '5',
                        alignment: 'center',
                    },
                    {
                        text: '6,3',
                        alignment: 'center',
                    },
                    {
                        text: '10',
                        alignment: 'center',
                    },
                    {
                        text: '12,5',
                        alignment: 'center',
                    },
                    ],
                    [{
                        colSpan: 12,
                        text: 'ПРИМЕЧАНИЕ: При подборе необходимо выбирать подъемную цепь с предельной нагрузкой, превышающей в 2 раза вес насосного агрегата. Для увеличения безопасности для насосных агрегатов, вес которых превышает 1 тонну, запас по предельной нагрузке цепи следует дополнительно увеличить.',
                    },
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ],
                ],
            },
            layout: {
                CenteredLayout,
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
            },
        },
        {
            text: ' ',
        },
        {
            table: {
                widths: ['*'],
                body: [
                    [{
                        text: '* Автоматические трубные муфты, трубные направляющие, грузоподъемные цепи в комплект поставки не входят и оплачиваются отдельно. \n - Все значения, в настоящем листе подбора, являются справочными.',
                    },],
                ],
            },
            layout: {
                CenteredLayout,
                hLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 0.5 : 0.5
                },
                vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
                },
                hLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.body.length ? 'black' : 'black'
                },
                vLineColor: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 'black' : 'black'
                },
            },
        },
        ],
     
        images: {
            list3: `${APIPDF}api/image/pdf/list3.jpg`,
            list4_1: `${APIPDF}api/image/pdf/list4_1.jpg`,

            list4_2: `${APIPDF}api/image/pdf/list4_2.jpg`,

            list4_3: `${APIPDF}api/image/pdf/list4_3.jpg`,

            list4_4: `${APIPDF}api/image/pdf/list4_4.jpg`,
            snow: 'data:image/png;base64,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',
            list1: itemPump.value.power>=11 ? `${APIPDF}api/image/pdf/WQA1.jpg` : `${APIPDF}api/image/pdf/WQA2.jpg`,
            list2_1: `${APIPDF}api/image/pdf/list2_1.jpg`,
            list2_2: `${APIPDF}api/image/pdf/list2_2.jpg`
        },
        defaultStyle: {
            fontSize: 9.5,
            color: '#00416A',
        },
    }
} 