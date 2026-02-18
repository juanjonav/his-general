export default function FormularioPacienteForms({
  encargado,
  paciente,
  onEncargadoChange,
  onPacienteChange,
  buscarDiagnosticos,
  agregarPaciente,
}) {
  return (
    <>
      <form id="formularioEncargado" className="mb-5">
        <h2>Responsable de la atencion</h2>

        <div className="encargado-grid">
          <div className="encargado-hospital">
            <p className="encargado-hospital-value">{encargado.hospital || 'No asignado'}</p>
          </div>

          <div className="encargado-mes">
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

          <div className="encargado-nombre">
            <label htmlFor="nombresApellidosResponsable" className="form-label">
              Nombres y Apellidos del responsable
            </label>
            <input
              type="text"
              id="nombresApellidosResponsable"
              className="form-control form-control-sm"
              name="nombresApellidosResponsable"
              value={encargado.nombresApellidosResponsable}
              onChange={onEncargadoChange}
            />
          </div>

          <div className="encargado-dni">
            <label htmlFor="dniResponsable" className="form-label">DNI</label>
            <input
              type="text"
              id="dniResponsable"
              className="form-control form-control-sm"
              name="dniResponsable"
              value={encargado.dniResponsable}
              onChange={onEncargadoChange}
            />
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
            <select id="gestante" className="form-select form-select-sm" name="gestante" value={paciente.gestante} onChange={onPacienteChange} disabled={paciente.sexo !== 'F'}>
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
    </>
  )
}
