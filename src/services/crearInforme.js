import ExcelJS from 'exceljs'

function descargarWorkbook(workbook, fileName) {
    return workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })

        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        URL.revokeObjectURL(link.href)
    })
}
//obtener los datos dinamicos de InformeEstadisticas.jsx general y positivos
//matrizGeneral

//matrizPositivos
export async function generarExcelInforme(matrizGeneral, matrizPositivos) {
    const workbook = new ExcelJS.Workbook()
    const response = await fetch('https://juanjonav.github.io/DocsPlantilla/INFORMEMENSUAL2026.xlsx')
    const arrayBuffer = await response.arrayBuffer()
    await workbook.xlsx.load(arrayBuffer)

    const hoja = workbook.getWorksheet('Hoja1')

    for (let i = 0; i < matrizGeneral.length; i++) {
        for (let j = 0; j < matrizGeneral[i].length; j++) {
            hoja.getCell(`H${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`I${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`J${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`K${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`L${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`M${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`N${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`O${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`P${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`Q${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`R${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`S${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`T${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`U${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`V${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`W${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`X${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`Y${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`Z${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`AA${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`AB${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`AC${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`AD${i + 11}`).value = matrizGeneral[i][j] || ''
            hoja.getCell(`AE${i + 11}`).value = matrizGeneral[i][j] || ''
        }
    }


    //completar positivos de matrizPositivos
    //aca es diferente porque haremos una pausa en 2 filas
    //for valor inicial de i=21 hasta 23 y despues otro de 
    //26 hasta 31 asi tenemos los 9 pero no escrito seguido sino con un espacio vacio
    //positivos Hi a AEi por fila
    //hoja.getCell('H21').value = '' || ''
    for (let i = 0; i < matrizPositivos.length; i++) {
        for (let j = 0; j < matrizPositivos[i].length; j++) {
            hoja.getCell(`H${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`I${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`J${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`K${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`L${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`M${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`N${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`O${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`P${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`Q${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`R${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`S${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`T${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`U${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`V${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`W${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`X${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`Y${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`Z${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`AA${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`AB${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`AC${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`AD${i + 21}`).value = matrizPositivos[i][j] || ''
            hoja.getCell(`AE${i + 21}`).value = matrizPositivos[i][j] || ''
        }
    }

    await descargarWorkbook(workbook, 'nuevo_INFORMEMENSUAL2026.xlsx')
}