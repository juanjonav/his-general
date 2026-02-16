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

export async function generarExcelHis({ pacientes, encargado }) {
  if (!pacientes.length) {
    alert('No hay pacientes en la tabla')
    return
  }

  const workbook = new ExcelJS.Workbook()
  const response = await fetch('https://juanjonav.github.io/HIS/Plantillas/HIS2025.xlsx')
  const arrayBuffer = await response.arrayBuffer()
  await workbook.xlsx.load(arrayBuffer)

  const hoja = workbook.getWorksheet('Hoja1')
  const textoPlano = 'NOMBRES Y APELLIDOS PACIENTE: '

  for (let i = 0; i < Math.min(pacientes.length, 25); i += 1) {
    const p = pacientes[i]
    const diagnosticos = (p.diagnosticos || '').split(',,,').map((d) => d.trim())
    const codigos = (p.codigosCIE || '').split(',,,').map((c) => c.trim())
    const fecha = p.fecha ? p.fecha.split('-') : ['', '', '']

    const baseRow = i < 12 ? 12 + i * 6 : 97 + (i - 12) * 6

    hoja.getCell(`B${baseRow}`).value = `${textoPlano}${p.nombresApellidos || ''}`
    hoja.getCell(`B${baseRow + 2}`).value = p.dia || ''

    hoja.getCell(`D${baseRow + 1}`).value = fecha[2] || ''
    hoja.getCell(`E${baseRow + 1}`).value = fecha[1] || ''
    hoja.getCell(`F${baseRow + 1}`).value = fecha[0] || ''

    hoja.getCell(`C${baseRow + 2}`).value = p.dni || ''
    hoja.getCell(`D${baseRow + 2}`).value = p.financiadorSalud || ''
    hoja.getCell(`D${baseRow + 4}`).value = p.etnia || ''

    hoja.getCell(`E${baseRow + 2}`).value = p.distrito || ''
    hoja.getCell(`E${baseRow + 4}`).value = p.CentroPoblado || ''
    hoja.getCell(`I${baseRow + 2}`).value = p.edad || ''

    hoja.getCell(`S${baseRow + 2}`).value = diagnosticos[0] || ''
    hoja.getCell(`Z${baseRow + 2}`).value = codigos[0] || ''
    hoja.getCell(`S${baseRow + 3}`).value = diagnosticos[1] || ''
    hoja.getCell(`Z${baseRow + 3}`).value = codigos[1] || ''
    hoja.getCell(`S${baseRow + 5}`).value = diagnosticos[2] || ''
    hoja.getCell(`Z${baseRow + 5}`).value = codigos[2] || ''

    hoja.getCell(`C${baseRow + 5}`).value = p.gestante || ''
  }

  hoja.getCell('X7').value = encargado.nombresApellidosResponsable || ''
  hoja.getCell('U7').value = encargado.dniResponsable || ''
  hoja.getCell('C7').value = encargado.mes || ''

  await descargarWorkbook(workbook, 'nuevo_HIS.xlsx')
}
