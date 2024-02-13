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
                        width: 50,
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
                        width: 350,
                        height: 350,
                        alignment: 'center',
                        margin: [0, 20],
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
            list1: 'data:image/png;base64,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',
            list2_1: `${APIPDF}api/image/pdf/list2_1.jpg`,
            list2_2: `${APIPDF}api/image/pdf/list2_2.jpg`
        },
        defaultStyle: {
            fontSize: 9.5,
            color: '#00416A',
        },
    }
} 