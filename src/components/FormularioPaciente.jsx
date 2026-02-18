import { useEffect, useState } from 'react'
import { doc, increment, setDoc } from 'firebase/firestore'
import codigosCie from '../data/codigos_cie.json'
import { generarExcelHis } from '../services/crearHis'
import { generarExcelLista } from '../services/crearLista'
import { auth, db } from '../services/firebase.js'
import FormularioPacienteForms from './FormularioPacienteForms.jsx'
import PacientesAgregadosSection from './PacientesAgregadosSection.jsx'

const CIE_TAMIZAJE = {
  '01': '96150.01',
  '02': '96150.02',
  '03': '96150.03',
  '04': '96150.04',
  '05': '96150.05',
  '06': '96150.06',
  '07': '96150.07',
  '08': '96150.08',
}

const DIC_MESES = {
  Enero: '01',
  Febrero: '02',
  Marzo: '03',
  Abril: '04',
  Mayo: '05',
  Junio: '06',
  Julio: '07',
  Agosto: '08',
  Septiembre: '09',
  Octubre: '10',
  Noviembre: '11',
  Diciembre: '12',
}

const DIC_TAMIZAJES = {
  '01': 'Violencia',
  '02': 'Alcohol y Drogas',
  '03': 'Trastornos Depresivos',
  '04': 'Psicosis',
  '05': 'Habilidades Sociales',
  '06': 'Problemas del Neurodesarrollo',
  '07': 'Deterioro Cognitivo/Demencia',
  '08': 'Trastorno de Comportamiento',
}

const PACIENTES_KEY = 'pacientes'

const initialPaciente = {
  nombresApellidos: '',
  edad: '',
  dia: '',
  numeroCita: '',
  fecha: '',
  dni: '',
  financiadorSalud: '',
  etnia: '',
  tamizaje: '',
  distrito: '',
  CentroPoblado: '',
  sexo: '',
  gestante: '',
  tamizajeTipo: '',
  diagnostico1: '',
  cie1: '',
  diagnostico2: '',
  cie2: '',
  diagnostico3: '',
  cie3: '',
  Direccion: '',
  Telefono: '',
}

function calcularEdad(fechaNacimiento) {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()

  const mesDiff = hoy.getMonth() - nacimiento.getMonth()
  if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad -= 1
  }

  return edad >= 0 ? String(edad) : ''
}

function calcularRangoEdad(edad) {
  const edadNum = Number.parseInt(edad, 10)
  if (Number.isNaN(edadNum)) return '00a-02a'
  if (edadNum <= 2) return '00a-02a'
  if (edadNum <= 5) return '03a-05a'
  if (edadNum <= 9) return '06a-09a'
  if (edadNum <= 11) return '10a-11a'
  if (edadNum <= 14) return '12a-14a'
  if (edadNum <= 17) return '15a-17a'
  if (edadNum <= 24) return '18a-24a'
  if (edadNum <= 29) return '25a-29a'
  if (edadNum <= 39) return '30a-39a'
  if (edadNum <= 59) return '40a-59a'
  if (edadNum <= 79) return '60a-79a'
  return '80a+'
}

export default function FormularioPaciente({ userAuth, userDoc }) {
  const [encargado, setEncargado] = useState({
    hospital: '',
    nombresApellidosResponsable: '',
    dniResponsable: '',
    mes: '',
  })
  const [paciente, setPaciente] = useState(initialPaciente)
  const [pacientes, setPacientes] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const guardados = localStorage.getItem(PACIENTES_KEY)
    if (!guardados) {
      setIsInitialized(true)
      return
    }

    try {
      const parsed = JSON.parse(guardados)
      if (Array.isArray(parsed)) setPacientes(parsed)
    } catch {
      setPacientes([])
    } finally {
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem(PACIENTES_KEY, JSON.stringify(pacientes))
  }, [pacientes, isInitialized])

  useEffect(() => {
    if (!paciente.fecha) return
    setPaciente((prev) => ({ ...prev, edad: calcularEdad(prev.fecha) }))
  }, [paciente.fecha])

  useEffect(() => {
    if (!paciente.tamizaje || !paciente.tamizajeTipo) return

    const cie1 = CIE_TAMIZAJE[paciente.tamizaje] || ''
    const cie2 = paciente.tamizajeTipo === '-' ? '99402.09' : 'Z133'
    const cie3 = paciente.tamizajeTipo === '+' ? '99402.09' : ''

    setPaciente((prev) => ({ ...prev, cie1, cie2, cie3 }))
  }, [paciente.tamizaje, paciente.tamizajeTipo])

  useEffect(() => {
    setEncargado((prev) => ({
      ...prev,
      hospital: userDoc?.hospitalId || '',
      nombresApellidosResponsable: userDoc?.nombre || userAuth?.displayName || '',
      dniResponsable: userDoc?.dni || userAuth?.dni || '',
    }))
  }, [userAuth, userDoc])

  const onEncargadoChange = (e) => {
    const { name, value } = e.target
    setEncargado((prev) => ({ ...prev, [name]: value }))
  }

  const onPacienteChange = (e) => {
    const { name, value } = e.target

    if (name === 'sexo') {
      if (value === 'M') {
        setPaciente((prev) => ({ ...prev, sexo: value, gestante: '' }))
      } else {
        setPaciente((prev) => ({ ...prev, sexo: value }))
      }
      return
    }

    setPaciente((prev) => ({ ...prev, [name]: value }))
  }

  const buscarDiagnosticos = () => {
    const cie1 = paciente.cie1.trim().toUpperCase()
    const cie2 = paciente.cie2.trim().toUpperCase()
    const cie3 = paciente.cie3.trim().toUpperCase()

    setPaciente((prev) => ({
      ...prev,
      diagnostico1: codigosCie[cie1] || '',
      diagnostico2: codigosCie[cie2] || '',
      diagnostico3: codigosCie[cie3] || '',
    }))
  }

  const agregarPaciente = () => {
    const tieneAlgo = Object.values(paciente).some((v) => String(v).trim() !== '')
    if (!tieneAlgo) return

    const registro = {
      nombresApellidos: paciente.nombresApellidos,
      dia: paciente.dia,
      dni: paciente.dni,
      numeroCita: paciente.numeroCita,
      financiadorSalud: paciente.financiadorSalud,
      etnia: paciente.etnia,
      tamizaje: paciente.tamizaje,
      Tamizajetipo: paciente.tamizajeTipo,
      distrito: paciente.distrito,
      CentroPoblado: paciente.CentroPoblado,
      edad: paciente.edad,
      sexo: paciente.sexo,
      diagnosticos: [paciente.diagnostico1, paciente.diagnostico2, paciente.diagnostico3].filter(Boolean).join(',,,'),
      codigosCIE: [paciente.cie1, paciente.cie2, paciente.cie3].filter(Boolean).join(',,,'),
      fecha: paciente.fecha,
      Direccion: paciente.Direccion,
      Telefono: paciente.Telefono,
      gestante: paciente.gestante,
    }

    setPacientes((prev) => [...prev, registro])
    setPaciente(initialPaciente)
  }

  const eliminarPaciente = (index) => {
    setPacientes((prev) => prev.filter((_, i) => i !== index))
  }

  const editarPaciente = (index) => {
    const pacienteAEditar = pacientes[index]
    const diagnosticos = pacienteAEditar.diagnosticos.split(',,,').map((d) => d.trim())
    const codigosCIE = pacienteAEditar.codigosCIE.split(',,,').map((c) => c.trim())

    setPaciente({
      nombresApellidos: pacienteAEditar.nombresApellidos || '',
      edad: pacienteAEditar.edad || '',
      dia: pacienteAEditar.dia || '',
      numeroCita: pacienteAEditar.numeroCita || '',
      fecha: pacienteAEditar.fecha || '',
      dni: pacienteAEditar.dni || '',
      financiadorSalud: pacienteAEditar.financiadorSalud || '',
      etnia: pacienteAEditar.etnia || '',
      tamizaje: pacienteAEditar.tamizaje || '',
      distrito: pacienteAEditar.distrito || '',
      CentroPoblado: pacienteAEditar.CentroPoblado || '',
      sexo: pacienteAEditar.sexo || '',
      gestante: pacienteAEditar.gestante || '',
      tamizajeTipo: pacienteAEditar.Tamizajetipo || '',
      diagnostico1: diagnosticos[0] || '',
      cie1: codigosCIE[0] || '',
      diagnostico2: diagnosticos[1] || '',
      cie2: codigosCIE[1] || '',
      diagnostico3: diagnosticos[2] || '',
      cie3: codigosCIE[2] || '',
      Direccion: pacienteAEditar.Direccion || '',
      Telefono: pacienteAEditar.Telefono || '',
    })

    setPacientes((prev) => prev.filter((_, i) => i !== index))
  }

  const limpiarTabla = () => {
    setPacientes([])
    localStorage.removeItem(PACIENTES_KEY)
  }

  const onGenerarHis = async () => {
    try {
      await generarExcelHis({ pacientes, encargado })
    } catch (error) {
      console.error(error)
      alert('Error al generar HIS')
    }
  }

  const onGenerarLista = async () => {
    try {
      await generarExcelLista({ pacientes, encargado })
    } catch (error) {
      console.error(error)
      alert('Error al generar Registro')
    }
  }

  const onGuardarEstadisticas = async () => {
    try {
      const uid = auth.currentUser?.uid
      if (!uid) {
        alert('No hay usuario autenticado')
        return
      }

      const mesSeleccionado = encargado.mes
      const mes = DIC_MESES[mesSeleccionado]
      if (!mes) {
        alert('Por favor seleccione un mes')
        return
      }

      if (!pacientes.length) {
        alert('No hay pacientes en la tabla')
        return
      }

      const docRef = doc(db, 'usuarios', uid, 'estadisticas', '2026', 'meses', mes)
      const acumulado = {}

      for (const p of pacientes) {
        const tamizaje = DIC_TAMIZAJES[p.tamizaje]
        const sexo = (p.sexo || '').trim()
        const resultado = (p.Tamizajetipo || '').trim()

        if (!tamizaje || !sexo) continue

        const rangoEdad = calcularRangoEdad(p.edad)
        const campoTotal = `${tamizaje}_${sexo}_${rangoEdad}_total`
        const campoPositivo = `${tamizaje}_${sexo}_${rangoEdad}_positivo`

        acumulado[campoTotal] = (acumulado[campoTotal] || 0) + 1
        if (resultado === '+') {
          acumulado[campoPositivo] = (acumulado[campoPositivo] || 0) + 1
        }
      }

      const actualizacion = {}
      Object.entries(acumulado).forEach(([campo, valor]) => {
        actualizacion[campo] = increment(valor)
      })

      if (!Object.keys(actualizacion).length) {
        alert('No hay datos válidos para guardar estadísticas')
        return
      }

      await setDoc(docRef, actualizacion, { merge: true })
      alert(`Estadísticas guardadas para ${mesSeleccionado}`)
    } catch (error) {
      console.error('Error al guardar estadísticas:', error)
      alert(`Error al guardar estadísticas: ${error.message}`)
    }
  }

  return (
    <div>
      <FormularioPacienteForms
        encargado={encargado}
        paciente={paciente}
        onEncargadoChange={onEncargadoChange}
        onPacienteChange={onPacienteChange}
        buscarDiagnosticos={buscarDiagnosticos}
        agregarPaciente={agregarPaciente}
      />

      <PacientesAgregadosSection
        pacientes={pacientes}
        editarPaciente={editarPaciente}
        eliminarPaciente={eliminarPaciente}
        limpiarTabla={limpiarTabla}
        onGenerarHis={onGenerarHis}
        onGenerarLista={onGenerarLista}
        onGuardarEstadisticas={onGuardarEstadisticas}
      />
    </div>
  )
}
