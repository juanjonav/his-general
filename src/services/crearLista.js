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

export async function generarExcelLista({ pacientes, encargado }) {
  if (!pacientes.length) {
    alert('No hay pacientes en la tabla')
    return
  }

  const workbook = new ExcelJS.Workbook()
  const response = await fetch('https://juanjonav.github.io/HIS/Plantillas/lista.xlsx')
  const arrayBuffer = await response.arrayBuffer()
  await workbook.xlsx.load(arrayBuffer)

  const hoja = workbook.getWorksheet('Hoja1')

  const columnaMap = {
    '01': 'L',
    '02': 'M',
    '03': 'N',
    '04': 'O',
    '05': 'P',
    '06': 'Q',
    '07': 'R',
    '08': 'S',
  }

  const lugarNumeroCita = {
    '1': 'AG',
    '2': 'AH',
    '3': 'AI',
    '4': 'AJ',
    '5': 'AK',
    '6': 'AL',
    '7': 'AM',
    '8': 'AN',
  }

  for (let i = 0; i < Math.min(pacientes.length, 25); i += 1) {
    const p = pacientes[i]
    const baseRow = 3 + i

    const fechaNacimiento = p.fecha ? p.fecha.split('-').reverse().join('-') : ''
    const hoy = new Date()
    const fechaActual = `${p.dia || ''}-${hoy.getMonth() + 1}-${hoy.getFullYear()}`

    hoja.getCell(`A${baseRow}`).value = fechaActual
    hoja.getCell(`B${baseRow}`).value = p.dni || ''
    hoja.getCell(`D${baseRow}`).value = fechaNacimiento
    hoja.getCell(`E${baseRow}`).value = p.nombresApellidos || ''

    if ((p.sexo || '').toUpperCase() === 'F') {
      hoja.getCell(`F${baseRow}`).value = 1
    } else if ((p.sexo || '').toUpperCase() === 'M') {
      hoja.getCell(`G${baseRow}`).value = 1
    }

    const tipoSeguro = p.financiadorSalud === '2' ? 'H' : 'I'
    hoja.getCell(`${tipoSeguro}${baseRow}`).value = p.financiadorSalud || ''

    const diagnosticos = (p.codigosCIE || '').split(',,,').map((x) => x.trim())
    hoja.getCell(`AA${baseRow}`).value = diagnosticos[0] || ''
    hoja.getCell(`AB${baseRow}`).value = diagnosticos[1] || ''
    hoja.getCell(`AC${baseRow}`).value = diagnosticos[2] || ''

    hoja.getCell(`AD${baseRow}`).value = p.numeroCita || ''
    hoja.getCell(`K${baseRow}`).value = p.Direccion || ''
    hoja.getCell(`J${baseRow}`).value = p.Telefono || ''

    const columna = columnaMap[p.tamizaje]
    if (columna) {
      hoja.getCell(`${columna}${baseRow}`).value = 1
    }

    const letraCita = lugarNumeroCita[p.numeroCita]
    if (letraCita) {
      hoja.getCell(`${letraCita}${baseRow}`).value = 'x'
    }

    hoja.getCell(`AO${baseRow}`).value = encargado.nombresApellidosResponsable || ''
  }

  await descargarWorkbook(workbook, 'lista.xlsx')
}
