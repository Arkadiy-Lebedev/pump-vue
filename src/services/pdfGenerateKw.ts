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


export const pdfGenerateKw = (itemPump: any, pumpSelect: any, date: any, canvas: any, xNpsh:number|null, xKw:number|null, canvasNpsh:any, canvasKw:any) => {
console.log(xNpsh)
console.log(canvasNpsh)

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
                heights: 12,
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
                        text: 'Внешний вид модели',
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
                        width: 95,
                        height: 100,
                        alignment: 'center',
                    },
                        '',
                    {
                        colSpan: 3,
                        text: 'Циркуляционные насосные агрегаты Волга, серии TD, применяются в системах центрального отопления, тепловых пунктах, котельных, пожаротушении, кондиционирования, а также других промышленных процессах, где требуется перекачка и распределение жидкостей. Благодаря своей надёжности, эффективности и компактности, они стали незаменимым элементом современных инженерных систем.',
                        alignment: 'justify',
                        
                    },
                        '',
                        '',
                    ],
 [
                        {	border: [false, true, false, true],
                          colSpan: 5,
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {border: [false, true, false, true],
                        text: '',                       
                    },
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
                        text: 'NPSH в рабочей точке:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(xNpsh),
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
                        text: 'Питание двигателя в рабочей точке, кВт:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(xKw),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    {
                        text: ' ',
                    },
                    ],  
                    [
                        {	border: [false, true, false, true],
                          colSpan: 5,
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {border: [false, true, false, true],
                        text: '',                       
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
                        text: '',
                        alignment: 'center',
                    },
                    {
                        text: '',
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    ],
                     [{
                        colSpan: 2,
                        text: 'Гидравлический корпус:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.frame),
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
                        text: 'Рабочее колесо:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.wheel_order),
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
                        text: 'Основание насоса:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.base),
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
                        text: 'Торцевое уплотнение вала:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.seal_order),
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
                        text: 'Крышка:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.lid),
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
                        text: 'Вал:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.shaft_standart),
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
                        text: 'Воздухоотводчик:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.airVent),
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
                        text: 'Уплотнительное кольцо:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.oring),
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
                        text: 'Болт:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.bolt),
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
                        text: 'Муфта:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.coupling),
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
                        text: 'Опора торцевого уплотнения:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.seal),
                        alignment: 'center',
                   
                    },
                    {
                        text: ' ',
                    
                    },
                    {
                        text: ' ',
                    },
                    ], 
                       [
                        {	border: [false, true, false, true],
                          colSpan: 5,
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {border: [false, true, false, true],
                        text: '',                       
                    },
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
                        alignment: 'center',
                    },
                    {
                        text: '',
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    ],
                    [{
                        colSpan: 2,
                        text: 'Диаметр выпускного коллектора, DN:',
                        alignment: 'right',
                    },
                        '',
                    {
                        text: textForNull(itemPump.value?.dn),
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
                        text: 'Вес:',
                        alignment: 'right',
                    },
                     '',
                    {
                        text: textForNull(itemPump.value?.weight),
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                        alignment: 'center',
                    },
                    {
                        text: ' ',
                    },
                    ],
 [
                        {	border: [false, true, false, true],
                          colSpan: 5,
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {
                        text: '',                       
                        },
                        {border: [false, true, false, true],
                        text: '',                       
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
                        text: 'Количество фаз двигателя:',
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
                        text: 'Количество полюсов двигателя:',
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
                        text: 'Количество оборотов вала в минуту:',
                        alignment: 'right',
                    },
                    '',
                    {
                        text: textForNull(itemPump.value.rpm),
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
                        text: '55',
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
                        text: 'Номинальное питание двигателя, кВт:',
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
                        text: '50',
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
                        text: 'Способ запуска:',
                        alignment: 'right',
                    },
                      '',
                    {
                        text: 'Прямой',
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
                widths: ['*'],
                body: [
                    [{
                        text: '3. Характеристика NPSH',
                        bold: true,
                    },],
                    [{
                        // @ts-ignore
                        image: canvasNpsh,
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
        // {
        //     table: {
        //         widths: ['*', '*'],
        //         body: [
        //             [{
        //                 colSpan: 2,
        //                 text: '3.	Схема насосного агрегата',
        //                 bold: true,
        //             },
        //                 ''
        //             ],
        //             [{
        //                 image: 'list2_1',
        //                 width: 200,
        //                 height: 200,
        //                 alignment: 'center',
        //                 margin: [0, 5, 0, 5],
        //             },
        //             {
        //                 image: 'list2_2',
        //                 width: 200,
        //                 height: 200,
        //                 alignment: 'center',
        //                 margin: [0, 5, 0, 5],
        //             },
        //             ],
        //             [{
        //                 text: 'Мощность до 11 кВт',
        //                 alignment: 'center',
        //             },
        //             {
        //                 text: 'Мощность свыше 11 кВт',
        //                 alignment: 'center',
        //             }
        //             ],
        //         ],
        //     },
        //     layout: {
        //         CenteredLayout,
        //         hLineWidth: function (i: any, node: any) {
        //             return i === 0 || i === node.table.body.length ? 0.5 : 0.5
        //         },
        //         vLineWidth: function (i: any, node: any) {
        //             return i === 0 || i === node.table.widths.length ? 0.5 : 0.5
        //         },
        //         hLineColor: function (i: any, node: any) {
        //             return i === 0 || i === node.table.body.length ? 'black' : 'black'
        //         },
        //         vLineColor: function (i: any, node: any) {
        //             return i === 0 || i === node.table.widths.length ? 'black' : 'black'
        //         },
        //     },
        // },


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
                widths: ['*'],
                body: [
                    [{
                        text: '4. Питание кВт',
                        bold: true,
                    },],
                    [{
                        // @ts-ignore
                        image: canvasKw,
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
                widths: ['*','*','*'],
                body: [
                    [{
                        colSpan: 3,
                        text: '5. Конструкция насосного агрегата',
                        bold: true,
                    },
                    '',
                    '',],
                    [{
                       
                        image: 'list3_1',
                        width: 100,
                        height: 180,
                        alignment: 'center',
                          margin: [0, 5, 0, 5],
                    },
                        {                        
                        image: 'list3_2',
                        width: 120,
                        height: 180,
                            alignment: 'center',
                          margin: [0, 5, 0, 5],
                        },
                        {                       
                        image: 'list3_3',
                        width: 120,
                        height: 180,
                            alignment: 'center',
                          margin: [0, 5, 0, 5],
                        },                   
                    ],
                     [{                       
                         text: 'Модели: TD32-18/2 - TD125-14/4 ',     
                          alignment: 'center', 
                    },
                    {                       
                        text: 'Модели: TD125-18/4 - TD150-50/4',    
                          alignment: 'center',
                    },
                    {                       
                        text: 'Модели: TD200 - TD250',         
                          alignment: 'center',
                    }],
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
                widths: [380, '*', '*'],
                body: [
                    [{
                        colSpan: 3,
                        text: '6. Габариты размеры автоматической трубной муфты и насосного агрегата',
                        bold: true,
                    },
                        '',
                        '',
                    ],
                    [{
                        rowSpan: 12,
                        image: 'list4_1',
                        width: 270,
                        height: 550,
                        alignment: 'center',
                        margin: [0, 12, 0, 0],
                    },
                    {
                        text: 'Dn прохода Ø',
                        margin: [0, 3],
                        alignment: 'center',
                    },
                    {
                        text: textForNull(itemPump.value.dn),
                        margin: [0, 8, 0, 0],
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
                            text: 'B2',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.b2),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'B3',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.b3),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],

                    [
                        '',
                        {
                            text: 'B4',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.b4),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'B5',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.b5),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'H1',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.h1),
                            margin: [0, 3],
                            alignment: 'center',
                        },
                    ],
                    [
                        '',
                        {
                            text: 'H2',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.h2),
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
                            text: 'l2',
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
                            text: 'Вес:',
                            margin: [0, 3],
                            alignment: 'center',
                        },
                        {
                            text: textForNull(itemPump.value.weight),
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
 {
            text: ' ',
            },
             {
            text: ' ',
            },
 {
            table: {
                widths: ['*'],
                body: [
                    [{
                      
                        text: 'Все значения, в настоящем листе подбора, являются справочными.',
                        
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
      
        ],
     
        images: {
            list3_1: `${APIPDF}api/image/pdf/kw_l3_1.jpg`,
            list3_2: `${APIPDF}api/image/pdf/kw_l3_2.jpg`,
            list3_3: `${APIPDF}api/image/pdf/kw_l3_3.jpg`,
            list4_1: `${APIPDF}api/image/pdf/kw_l4_1.jpg`,
            
            snow: 'data:image/png;base64,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',
            list1: `${APIPDF}api/image/pdf/kw.jpg`,
            
           
        },
        defaultStyle: {
            fontSize: 9.5,
            color: '#00416A',
        },
    }
} 