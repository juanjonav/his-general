import { useEffect, useState } from 'react'
import codigosCie from '../data/codigos_cie.json'
import { generarExcelHis } from '../services/crearRegistro'
import { generarExcelLista } from '../services/crearLista'

const RESPONSABLES = {
  "JESUS ROJAS POZO": "08388048",
  "ERIKA GISELA CRUZ CAMPOS": "42597775",
  "MARAVI SAAVEDRA LIUS ALBERTO": "45515386",
  "VERDE GONZALES HEGIDIO": "22498733",
}

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

export default function FormularioPaciente() {
  const [encargado, setEncargado] = useState({
    nombresApellidosResponsable: 'JESUS ROJAS POZO',
    dniResponsable: '08388048',
    mes: '',
  })
  const [paciente, setPaciente] = useState(initialPaciente)
  const [pacientes, setPacientes] = useState([])

  useEffect(() => {
    const guardados = localStorage.getItem(PACIENTES_KEY)
    if (!guardados) return

    try {
      const parsed = JSON.parse(guardados)
      if (Array.isArray(parsed)) setPacientes(parsed)
    } catch {
      setPacientes([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(PACIENTES_KEY, JSON.stringify(pacientes))
  }, [pacientes])

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

  const onEncargadoChange = (e) => {
    const { name, value } = e.target

    if (name === 'nombresApellidosResponsable') {
      setEncargado((prev) => ({
        ...prev,
        nombresApellidosResponsable: value,
        dniResponsable: RESPONSABLES[value] || '',
      }))
      return
    }

    setEncargado((prev) => ({ ...prev, [name]: value }))
  }

  const onPacienteChange = (e) => {
    const { name, value } = e.target
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

  return (
    <div>
      <form id="formularioEncargado" className="mb-5">
        <h3>responsable de la atencion</h3>

        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="nombresApellidosResponsable" className="form-label">
              Nombres y Apellidos del responsable
            </label>
            <select
              id="nombresApellidosResponsable"
              className="form-select form-select-sm"
              name="nombresApellidosResponsable"
              value={encargado.nombresApellidosResponsable}
              onChange={onEncargadoChange}
            >
              <option value="JESUS ROJAS POZO">Jesus Rojas Pozo</option>
              <option value="ERIKA GISELA CRUZ CAMPOS">Erika Gisela Cruz Campos</option>
              <option value="MARAVI SAAVEDRA LIUS ALBERTO">Luis Alberto Maravi Saavedra</option>
              <option value="VERDE GONZALES HEGIDIO">Hegidio Verde Gonzales</option>
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="dniResponsable" className="form-label">DNI</label>
            <input
              type="text"
              id="dniResponsable"
              className="form-control form-control-sm"
              name="dniResponsable"
              value={encargado.dniResponsable}
              readOnly
            />
          </div>

          <div className="espaciovacio col-1" />
          <div className="mes col-md-2">
            <label htmlFor="mes" className="form-label">Mes</label>
            <select
              name="mes"
              id="mes"
              className="form-select form-select-sm"
              value={encargado.mes}
              onChange={onEncargadoChange}
            >
              <option value="">Seleccione</option>
              <option value="Enero">Enero</option>
              <option value="Febrero">Febrero</option>
              <option value="Marzo">Marzo</option>
              <option value="Abril">Abril</option>
              <option value="Mayo">Mayo</option>
              <option value="Junio">Junio</option>
              <option value="Julio">Julio</option>
              <option value="Agosto">Agosto</option>
              <option value="Septiembre">Septiembre</option>
              <option value="Octubre">Octubre</option>
              <option value="Noviembre">Noviembre</option>
              <option value="Diciembre">Diciembre</option>
            </select>
          </div>
        </div>
      </form>

      <form id="formularioPaciente" className="mb-5" onSubmit={(e) => e.preventDefault()}>
        <h3 className="mb-3">Datos del Paciente</h3>

        <div className="row g-3">
          <div className="col-8">
            <label htmlFor="nombresApellidos" className="form-label">Nombres y Apellidos del paciente</label>
            <input type="text" id="nombresApellidos" className="form-control form-control-sm" name="nombresApellidos" value={paciente.nombresApellidos} onChange={onPacienteChange} />
          </div>

          <div className="col-md-1">
            <label htmlFor="edad" className="form-label">Edad</label>
            <input type="number" id="edad" className="form-control form-control-sm" name="edad" value={paciente.edad} onChange={onPacienteChange} />
          </div>

          <div className="col-1">
            <label htmlFor="dia" className="form-label">Dia</label>
            <input type="number" id="dia" className="form-control form-control-sm" name="dia" value={paciente.dia} onChange={onPacienteChange} />
          </div>

          <div className="col-md-2">
            <label htmlFor="numeroCita" className="form-label">Numero de Cita</label>
            <input type="text" id="numeroCita" className="form-control form-control-sm" name="numeroCita" value={paciente.numeroCita} onChange={onPacienteChange} />
          </div>

          <div className="col-2">
            <label htmlFor="fecha" className="form-label">Fecha de nacimiento</label>
            <input type="date" id="fecha" className="form-control form-control-sm" name="fecha" value={paciente.fecha} onChange={onPacienteChange} />
          </div>

          <div className="col-md-3">
            <label htmlFor="dni" className="form-label">DNI</label>
            <input type="text" id="dni" className="form-control form-control-sm" name="dni" value={paciente.dni} onChange={onPacienteChange} />
          </div>

          <div className="col-md-3">
            <label htmlFor="financiadorSalud" className="form-label">Financiador de Salud</label>
            <input type="text" id="financiadorSalud" className="form-control form-control-sm" name="financiadorSalud" value={paciente.financiadorSalud} onChange={onPacienteChange} />
          </div>

          <div className="col-md-2">
            <label htmlFor="etnia" className="form-label">Etnia</label>
            <input type="text" id="etnia" className="form-control form-control-sm" name="etnia" value={paciente.etnia} onChange={onPacienteChange} />
          </div>

          <div className="col-md-2">
            <label htmlFor="tamizaje" className="form-label">Tamizaje</label>
            <select name="tamizaje" id="tamizaje" className="form-select form-select-sm" value={paciente.tamizaje} onChange={onPacienteChange}>
              <option value="">Seleccione</option>
              <option value="01">Violencia</option>
              <option value="02">Alcohol y Drogas</option>
              <option value="03">Trastornos Depresivos</option>
              <option value="04">Psicosis</option>
              <option value="05">Habilidades Sociales</option>
              <option value="06">Problemas del Neurodesarrollo</option>
              <option value="07">Deterioro Cognitivo/Demencia</option>
              <option value="08">Trastorno de Comportamiento</option>
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="Distrito" className="form-label">Distrito</label>
            <select name="distrito" id="Distrito" className="form-control form-control-sm" value={paciente.distrito} onChange={onPacienteChange}>
              <option value="">Seleccione</option>
              <option value="Tocache">Tocache</option>
              <option value="Nuevo Progreso">Nuevo Progreso</option>
              <option value="Polvora">Polvora</option>
              <option value="Shunte">Shunte</option>
              <option value="Uchiza">Uchiza</option>
              <option value="Santa Lucia">Santa Lucia</option>
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="CentroPoblado" className="form-label">Centro Poblado</label>
            <input type="text" id="CentroPoblado" className="form-control form-control-sm" name="CentroPoblado" value={paciente.CentroPoblado} onChange={onPacienteChange} />
          </div>

          <div className="col-md-2">
            <label htmlFor="sexo" className="form-label">Sexo</label>
            <select id="sexo" className="form-select form-select-sm" name="sexo" value={paciente.sexo} onChange={onPacienteChange}>
              <option value="">Seleccione</option>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="gestante" className="form-label">Gestante/Puerpera</label>
            <select id="gestante" className="form-select form-select-sm" name="gestante" value={paciente.gestante} onChange={onPacienteChange}>
              <option value="">Seleccione</option>
              <option value="GESTANTE">GESTANTE</option>
              <option value="PUERPERA">PUERPERA</option>
            </select>
          </div>

          <div className="col-1" />

          <div className="col-md-2">
            <label htmlFor="Tamizajetipo" className="form-label">tamizaje</label>
            <select id="Tamizajetipo" className="form-select form-select-sm" name="tamizajeTipo" value={paciente.tamizajeTipo} onChange={onPacienteChange}>
              <option value="" />
              <option value="+">Positivo</option>
              <option value="-">Negativo</option>
            </select>
          </div>
        </div>

        <h3 className="h6 mt-4">Diagnosticos</h3>

        <div className="row">
          <div className="col-10">
            <label htmlFor="diagnostico1">Diagnostico 1:</label>
            <input type="text" id="diagnostico1" className="form-control" name="diagnostico1" value={paciente.diagnostico1} onChange={onPacienteChange} />
          </div>
          <div className="col-2">
            <label htmlFor="cie1">Codigo CIE/CPT:</label>
            <input type="text" id="cie1" className="form-control" name="cie1" value={paciente.cie1} onChange={onPacienteChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-10">
            <label htmlFor="diagnostico2">Diagnostico 2:</label>
            <input type="text" id="diagnostico2" className="form-control" name="diagnostico2" value={paciente.diagnostico2} onChange={onPacienteChange} />
          </div>
          <div className="col-2">
            <label htmlFor="cie2">Codigo CIE/CPT:</label>
            <input type="text" id="cie2" className="form-control" name="cie2" value={paciente.cie2} onChange={onPacienteChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-10">
            <label htmlFor="diagnostico3">Diagnostico 3:</label>
            <input type="text" id="diagnostico3" className="form-control" name="diagnostico3" value={paciente.diagnostico3} onChange={onPacienteChange} />
          </div>
          <div className="col-2">
            <label htmlFor="cie3">Codigo CIE/CPT:</label>
            <input type="text" id="cie3" className="form-control" name="cie3" value={paciente.cie3} onChange={onPacienteChange} />
          </div>
        </div>

        <div className="datoscontacto row">
          <div className="col-4">
            <label htmlFor="Direccion">Direccion</label>
            <input type="text" id="Direccion" className="form-control" name="Direccion" value={paciente.Direccion} onChange={onPacienteChange} />
          </div>
          <div className="col-3">
            <label htmlFor="Telefono">Telefono</label>
            <input type="text" id="Telefono" className="form-control" name="Telefono" value={paciente.Telefono} onChange={onPacienteChange} />
          </div>
          <div className="col-2" />
          <div className="col-3 text-end">
            <button type="button" className="btn btn-primary btn-sm" id="BTNbuscarDiagnosticos" onClick={buscarDiagnosticos}>
              Buscar Diagnosticos
            </button>
          </div>
        </div>

        <div className="text-end mt-4">
          <button type="button" id="agregarPaciente" className="btn btn-primary btn-sm" onClick={agregarPaciente}>
            Agregar Paciente
          </button>
        </div>
      </form>

      <section>
        <h2 className="h5">Pacientes Agregados</h2>
        <table id="tablaPacientes" className="table table-sm table-striped">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Dia</th>
              <th>DNI</th>
              <th>NConsulta</th>
              <th>Financ</th>
              <th>Etnia</th>
              <th>Tamizaje</th>
              <th>tipo</th>
              <th>Distrito</th>
              <th>CentroPoblado</th>
              <th>Edad</th>
              <th>Sexo</th>
              <th>Diagnosticos</th>
              <th>CIE</th>
              <th>fecha</th>
              <th>Direccion</th>
              <th>Telefono</th>
              <th>Gestante</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody id="tablaPacientesBody">
            {pacientes.map((item, index) => (
              <tr key={`${item.dni}-${item.numeroCita}-${index}`}>
                <td>{item.nombresApellidos}</td>
                <td>{item.dia}</td>
                <td>{item.dni}</td>
                <td>{item.numeroCita}</td>
                <td>{item.financiadorSalud}</td>
                <td>{item.etnia}</td>
                <td>{item.tamizaje}</td>
                <td>{item.Tamizajetipo}</td>
                <td>{item.distrito}</td>
                <td>{item.CentroPoblado}</td>
                <td>{item.edad}</td>
                <td>{item.sexo}</td>
                <td>{item.diagnosticos}</td>
                <td>{item.codigosCIE}</td>
                <td>{item.fecha}</td>
                <td>{item.Direccion}</td>
                <td>{item.Telefono}</td>
                <td>{item.gestante}</td>
                <td>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => eliminarPaciente(index)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <button type="button" id="limpiarTabla" className="btn btn-danger btn-sm" onClick={limpiarTabla}>
        limpiar datos
      </button>

      <section className="mt-4 text-center">
        <button type="button" id="btnGenerarExcelHis" className="btn btn-secondary btn-sm" onClick={onGenerarHis}>Generar HIS</button>
        <button type="button" id="btnGenerarExcelTabla" className="btn btn-secondary btn-sm" onClick={onGenerarLista}>Generar Registro</button>
      </section>
    </div>
  )
}
