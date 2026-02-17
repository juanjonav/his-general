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
        const row = hoja.getRow(11 + i)
        for (let j = 0; j < matrizGeneral[i].length; j++) {
            // La columna H es la numero 8. j=0 -> columna 8
            row.getCell(8 + j).value = matrizGeneral[i][j] || 0
        }
        row.commit()
    }


    //completar positivos de matrizPositivos
    //aca es diferente porque haremos una pausa en 2 filas
    //for valor inicial de i=21 hasta 23 y despues otro de 
    //26 hasta 31 asi tenemos los 9 pero no escrito seguido sino con un espacio vacio
    //positivos Hi a AEi por fila
    //hoja.getCell('H21').value = '' || ''
    for (let i = 0; i < matrizPositivos.length; i++) {
        const row = hoja.getRow(21 + i)
        for (let j = 0; j < matrizPositivos[i].length; j++) {
            // La columna H es la numero 8. j=0 -> columna 8
            row.getCell(8 + j).value = matrizPositivos[i][j] || 0
        }
        row.commit()
    }

    await descargarWorkbook(workbook, 'nuevo_INFORMEMENSUAL2026.xlsx')
}