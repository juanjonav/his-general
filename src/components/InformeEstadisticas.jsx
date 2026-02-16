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
    <div className="contenedor-tablas">
      <table className="tabla-alineada tabla-cabecera">
        <thead>
          <tr>
            <th rowSpan="4" className="col-nombres">CONDICION</th>
            <th colSpan="24">{titulo}</th>
            <th colSpan="3" rowSpan="3">TOTAL DE TAMIZAJES</th>
            <th colSpan="3" rowSpan="3">PERSONAS VICTIMAS DE VIOLENCIA POLITICA</th>
          </tr>

          <tr>
            <th colSpan="8">NINO</th>
            <th colSpan="4">ADOLESCENTE</th>
            <th colSpan="4">JOVEN</th>
            <th colSpan="4">ADULTO</th>
            <th colSpan="4">ADULTO MAYOR</th>
          </tr>

          <tr>
            <th colSpan="2">00a - 02a</th>
            <th colSpan="2">03a - 05a</th>
            <th colSpan="2">06a - 09a</th>
            <th colSpan="2">10a - 11a</th>
            <th colSpan="2">12a - 14a</th>
            <th colSpan="2">15a - 17a</th>
            <th colSpan="2">18a - 24a</th>
            <th colSpan="2">25a - 29a</th>
            <th colSpan="2">30a - 39a</th>
            <th colSpan="2">40a - 59a</th>
            <th colSpan="2">60a - 79a</th>
            <th colSpan="2">80a+</th>
          </tr>

          <tr>
            {Array.from({ length: 24 }).map((_, i) => (
              <th key={`h-${i}`} className="col-estrecha">{i % 2 === 0 ? 'M' : 'F'}</th>
            ))}
            <th>Meta Anual</th>
            <th>Avance Mes</th>
            <th>Acum. Anual</th>
            <th>F</th>
            <th>M</th>
            <th>TOTAL</th>
          </tr>
        </thead>
      </table>

      <table className="tabla-alineada tabla-nombres">
        <tbody>
          <tr className="fila-45 fila-total">
            <td><strong>{totalTitulo}</strong></td>
          </tr>
          {tamizajes.map((t) => (
            <tr key={t.key} className="fila-45">
              <td>{t.label}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="tabla-alineada tabla-datos">
        <tbody>
          <tr className="fila-45 fila-total">
            {totales.map((valor, idx) => (
              <td key={`tot-${idx}`}>{valor}</td>
            ))}
          </tr>
          {matrix.map((fila, filaIndex) => (
            <tr key={`f-${filaIndex}`} className="fila-45">
              {fila.map((valor, colIndex) => (
                <td key={`c-${filaIndex}-${colIndex}`}>{valor}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function InformeEstadisticas() {
  const [mes, setMes] = useState('01')
  const [datosFirestore, setDatosFirestore] = useState({})
  const [cargandoMes, setCargandoMes] = useState(false)
  const [errorLectura, setErrorLectura] = useState('')

  useEffect(() => {
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
