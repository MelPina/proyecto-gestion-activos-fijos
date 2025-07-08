import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "bd_activo_fijo",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
}

export async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    return connection
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw error
  }
}

export interface Empleado {
  id: number
  nombre: string
  cedula: string
  departamento_id: number
  tipo_persona: number
  fecha_ingreso: string
  activo: boolean
  departamento_descripcion?: string
}

export interface Departamento {
  id: number
  descripcion: string
  activo: boolean
}

export interface ActivoFijo {
  id: number
  descripcion: string
  departamentoId: number | null
  departamentoDescripcion?: string
  tipoActivoId: number
  tipoActivoDescripcion?: string
  fechaAdquisicion: string // en formato YYYY-MM-DD
  valor: number
  depreciacionAcumulada: number
  estado: number
  estadoDescripcion?: string
}

export interface TipoActivo {
  id: number;
  descripcion: string;
  cuenta_contable_compra: string;
  cuenta_contable_depreciacion: string;
  activo: boolean;
}