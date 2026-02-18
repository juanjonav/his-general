export default function PacientesAgregadosSection({
  pacientes,
  editarPaciente,
  eliminarPaciente,
  limpiarTabla,
  onGenerarHis,
  onGenerarLista,
  onGuardarEstadisticas,
}) {
  return (
    <>
      <section>
        <h2 className="h5">Pacientes Agregados</h2>
        <div className="overflow-x-auto w-full">
          <table id="tablaPacientes" className="table table-sm table-striped min-w-max">
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
                    <button type="button" className="btn btn-sm btn-warning me-2" onClick={() => editarPaciente(index)}>
                      Editar
                    </button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => eliminarPaciente(index)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <button type="button" id="limpiarTabla" className="btn btn-danger btn-sm" onClick={limpiarTabla}>
        limpiar datos
      </button>

      <section className="mt-4 text-center">
        <button type="button" id="btnGenerarExcelHis" className="btn bg-green-600 hover:bg-green-700 text-white btn-sm" onClick={onGenerarHis}>Generar HIS</button>
        <button type="button" id="btnGenerarExcelTabla" className="btn bg-green-600 hover:bg-green-700 text-white btn-sm" onClick={onGenerarLista}>Generar Registro</button>
        <button type="button" id="btnEscribirFirestore" className="btn btn-success btn-sm" onClick={onGuardarEstadisticas}>Guardar Estadisticas</button>
      </section>
    </>
  )
}
