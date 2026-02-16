import { useEffect, useMemo, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import baseGeneral from '../data/tamizajes_base_general.json'
import basePositivos from '../data/tamizajes_base_positivos.json'
import { auth, db } from '../services/firebase.js'
import './InformeEstadisticas.css'

const tamizajes = [
  { label: 'VIOLENCIA FAMILIAR / MALTRATO INFANTIL', key: 'Violencia' },
  { label: 'TRASTORNO DEPRESIVO', key: 'Trastornos Depresivos' },
  { label: 'ALCOHOL Y DROGAS', key: 'Alcohol y Drogas' },
  { label: 'PSICOSIS', key: 'Psicosis' },
  { label: 'HABILIDADES SOCIALES', key: 'Habilidades Sociales' },
  { label: 'PROBLEMAS DEL NEURODESARROLLO', key: 'Problemas del Neurodesarrollo' },
  { label: 'DETERIORO COGNITIVO - DEMENCIA', key: 'Deterioro Cognitivo/Demencia' },
  { label: 'TRASTORNO DE COMPORTAMIENTO', key: 'Trastorno de Comportamiento' },
]

const rangosEdad = [
  '00a-02a', '03a-05a', '06a-09a', '10a-11a',
  '12a-14a', '15a-17a',
  '18a-24a', '25a-29a',
  '30a-39a', '40a-59a',
  '60a-79a', '80a+',
]

const meses = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
]

function obtenerMatriz(data, sufijo) {
  return tamizajes.map((tamizaje) => {
    return rangosEdad.flatMap((rango) => {
      const keyM = `${tamizaje.key}_M_${rango}_${sufijo}`
      const keyF = `${tamizaje.key}_F_${rango}_${sufijo}`
      return [data[keyM] || 0, data[keyF] || 0]
    })
  })
}

function obtenerTotalesColumnas(matrix) {
  const totalColumnas = Array.from({ length: 24 }, () => 0)

  matrix.forEach((fila) => {
    fila.forEach((valor, idx) => {
      totalColumnas[idx] += Number(valor) || 0
    })
  })

  return totalColumnas
}

function TablaBloque({ titulo, totalTitulo, matrix }) {
  const totales = useMemo(() => obtenerTotalesColumnas(matrix), [matrix])

  return (
    <div className="w-full overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
      <table className="w-full min-w-max border-collapse text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-300">
          <tr>
            <th rowSpan="4" className="border border-gray-300 px-4 py-2 sticky left-0 bg-gray-100 z-10 w-[300px] min-w-[300px]">
              CONDICION
            </th>
            <th colSpan="24" className="border border-gray-300 px-2 py-1 text-center bg-blue-50">
              {titulo}
            </th>
            <th colSpan="3" rowSpan="3" className="border border-gray-300 px-2 py-1 text-center bg-yellow-50">
              TOTAL DE TAMIZAJES
            </th>
            <th colSpan="3" rowSpan="3" className="border border-gray-300 px-2 py-1 text-center bg-green-50">
              PERSONAS VICTIMAS DE VIOLENCIA POLITICA
            </th>
          </tr>

          <tr>
            <th colSpan="8" className="border border-gray-300 px-2 py-1 text-center">NINO</th>
            <th colSpan="4" className="border border-gray-300 px-2 py-1 text-center">ADOLESCENTE</th>
            <th colSpan="4" className="border border-gray-300 px-2 py-1 text-center">JOVEN</th>
            <th colSpan="4" className="border border-gray-300 px-2 py-1 text-center">ADULTO</th>
            <th colSpan="4" className="border border-gray-300 px-2 py-1 text-center">ADULTO MAYOR</th>
          </tr>

          <tr>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">00a - 02a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">03a - 05a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">06a - 09a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">10a - 11a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">12a - 14a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">15a - 17a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">18a - 24a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">25a - 29a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">30a - 39a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">40a - 59a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">60a - 79a</th>
            <th colSpan="2" className="border border-gray-300 px-1 py-1 text-center text-xs">80a+</th>
          </tr>

          <tr>
            {Array.from({ length: 24 }).map((_, i) => (
              <th key={`h-${i}`} className="border border-gray-300 px-1 py-1 text-center text-[10px] min-w-[35px] w-[35px]">
                {i % 2 === 0 ? 'M' : 'F'}
              </th>
            ))}
            <th className="border border-gray-300 px-1 py-1 text-center text-[10px]">Meta Anual</th>
            <th className="border border-gray-300 px-1 py-1 text-center text-[10px]">Avance Mes</th>
            <th className="border border-gray-300 px-1 py-1 text-center text-[10px]">Acum. Anual</th>
            <th className="border border-gray-300 px-1 py-1 text-center text-[10px]">F</th>
            <th className="border border-gray-300 px-1 py-1 text-center text-[10px]">M</th>
            <th className="border border-gray-300 px-1 py-1 text-center text-[10px]">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {/* Fila de Totales */}
          <tr className="bg-gray-200 font-bold hover:bg-gray-300 transition-colors">
            <td className="border border-gray-300 px-4 py-2 sticky left-0 bg-gray-200 z-10">
              {totalTitulo}
            </td>
            {totales.map((valor, idx) => (
              <td key={`tot-${idx}`} className="border border-gray-300 px-1 py-1 text-center text-xs">
                {valor}
              </td>
            ))}
            {/* Celdas vacías para las últimas 6 columnas de totales si no hay datos calculados para ellas en 'totales' 
                El array 'totales' viene de obtenerTotalesColumnas(matrix) que devuelve 24 columnas.
                Faltan las 6 columnas de la derecha (Meta, Avance, Acum, F, M, Total).
                Asumiré que deben estar vacías o calcularse, pero por ahora renderizo celdas vacías para mantener la estructura. */}
            <td className="border border-gray-300 px-1 py-1"></td>
            <td className="border border-gray-300 px-1 py-1"></td>
            <td className="border border-gray-300 px-1 py-1"></td>
            <td className="border border-gray-300 px-1 py-1"></td>
            <td className="border border-gray-300 px-1 py-1"></td>
            <td className="border border-gray-300 px-1 py-1"></td>
          </tr>

          {/* Filas de Datos */}
          {tamizajes.map((t, filaIndex) => (
            <tr key={t.key} className="hover:bg-gray-50 transition-colors text-gray-800">
              <td className="border border-gray-300 px-4 py-2 sticky left-0 bg-white z-10 font-medium">
                {t.label}
              </td>
              {matrix[filaIndex]?.map((valor, colIndex) => (
                <td key={`c-${filaIndex}-${colIndex}`} className="border border-gray-300 px-1 py-1 text-center text-xs">
                  {valor}
                </td>
              ))}
              {/* Celdas vacías para las columnas de totales extra, igual que arriba */}
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1"></td>
              <td className="border border-gray-300 px-1 py-1"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function InformeEstadisticas() {
  const [mes, setMes] = useState('')
  const [datosFirestore, setDatosFirestore] = useState({})
  const [cargandoMes, setCargandoMes] = useState(false)
  const [errorLectura, setErrorLectura] = useState('')

  useEffect(() => {
    if (!mes) return
    let activa = true

    const cargarDatosDelMes = async () => {
      try {
        const uid = auth.currentUser?.uid
        if (!uid) {
          if (activa) {
            setDatosFirestore({})
            setErrorLectura('No hay usuario autenticado')
          }
          return
        }

        setCargandoMes(true)
        setErrorLectura('')

        const ref = doc(db, 'usuarios', uid, 'estadisticas', '2026', 'meses', mes)
        const snap = await getDoc(ref)

        if (!activa) return
        setDatosFirestore(snap.exists() ? snap.data() : {})
      } catch (error) {
        console.error('Error leyendo estadísticas:', error)
        if (activa) {
          setDatosFirestore({})
          setErrorLectura('No se pudo leer las estadísticas del mes seleccionado')
        }
      } finally {
        if (activa) {
          setCargandoMes(false)
        }
      }
    }

    cargarDatosDelMes()

    return () => {
      activa = false
    }
  }, [mes])

  const datosGeneralFusionados = useMemo(
    () => ({ ...baseGeneral, ...datosFirestore }),
    [datosFirestore],
  )
  const datosPositivosFusionados = useMemo(
    () => ({ ...basePositivos, ...datosFirestore }),
    [datosFirestore],
  )

  const matrizGeneral = useMemo(
    () => obtenerMatriz(datosGeneralFusionados, 'total'),
    [datosGeneralFusionados],
  )
  const matrizPositivos = useMemo(
    () => obtenerMatriz(datosPositivosFusionados, 'positivo'),
    [datosPositivosFusionados],
  )

  return (
    <section className="estadisticas-panel">
      <div className="estadisticas-header">
        <h2>Reporte de Tamizajes</h2>
        <label htmlFor="mes-estadisticas" className="mes-label">
          Mes
          <select id="mes-estadisticas" value={mes} onChange={(e) => setMes(e.target.value)}>
            <option value="">Seleccione mes</option>
            {meses.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>
      </div>
      {cargandoMes ? <p>Cargando datos del mes...</p> : null}
      {errorLectura ? <p>{errorLectura}</p> : null}

      <TablaBloque
        titulo="TOTAL DE TAMIZAJES"
        totalTitulo="TOTAL DE TAMIZAJES"
        matrix={matrizGeneral}
      />

      <table className="tabla-alineada tabla-separador">
        <thead>
          <tr>
            <th>SOLO TAMIZAJES POSITIVOS</th>
          </tr>
        </thead>
      </table>

      <TablaBloque
        titulo="SOLO TAMIZAJES POSITIVOS"
        totalTitulo="TOTAL DE TAMIZAJES POSITIVOS"
        matrix={matrizPositivos}
      />
    </section>
  )
}
