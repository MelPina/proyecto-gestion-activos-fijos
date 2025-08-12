
# Sistema de Gestión de Activos Fijos

Un sistema completo de gestión de activos fijos desarrollado con Next.js y ASP.NET Core, que incluye integración con APIs externas para entradas contables.

## Características

### Módulos Principales
- **Dashboard**: Estadísticas en tiempo real de activos, departamentos y empleados
- **Gestión de Empleados**: CRUD completo con asignación de departamentos
- **Gestión de Departamentos**: Control de departamentos activos/inactivos
- **Gestión de Activos Fijos**: Registro y seguimiento de activos
- **Tipos de Activos**: Categorización con cuentas contables
- **Depreciación**: Cálculo automático de depreciación de activos
- **Entradas Contables**: Integración con API externa para gestión contable

### Funcionalidades Técnicas
- **Autenticación**: Sistema de login con bypass para desarrollo
- **Tema Oscuro**: Interfaz adaptable con modo oscuro/claro
- **API REST**: Backend completo con Entity Framework Core
- **Base de Datos**: MySQL con migraciones automáticas
- **Integración Externa**: Conexión con API de entradas contables
- **Responsive**: Diseño adaptable para móviles y escritorio

## Tecnologías

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Shadcn/ui** - Componentes de interfaz
- **Lucide React** - Iconografía

### Backend
- **ASP.NET Core 8** - API REST
- **Entity Framework Core** - ORM
- **MySQL** - Base de datos
- **AutoMapper** - Mapeo de objetos
- **Swagger** - Documentación de API

##  Requisitos Previos

- **Node.js** 18+ 
- **.NET 8 SDK**
- **MySQL** 8.0+
- **Git**

## Instalación

### 1. Clonar el Repositorio
\`\`\`bash
git clone <repository-url>
cd proyecto-gestion-activos-fijos
\`\`\`

### 2. Configurar Backend

#### Instalar dependencias
\`\`\`bash
cd ActivosFijosAPI
dotnet restore
\`\`\`

#### Configurar Base de Datos
1. Crear base de datos MySQL llamada `bd_activo_fijo`
2. Actualizar cadena de conexión en `appsettings.json`:
\`\`\`json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=bd_activo_fijo;Uid=root;Pwd=TU_PASSWORD;SslMode=none;AllowPublicKeyRetrieval=true;"
  }
}
\`\`\`

#### Ejecutar migraciones
\`\`\`bash
dotnet ef database update
\`\`\`

#### Ejecutar API
\`\`\`bash
dotnet run
\`\`\`
La API estará disponible en: `https://localhost:7001` y `http://localhost:5001`

### 3. Configurar Frontend

#### Instalar dependencias
\`\`\`bash
npm install
\`\`\`

#### Configurar variables de entorno
Crear archivo `.env.local`:
\`\`\`env
API_BASE_URL=http://localhost:5001/api
NEXT_PUBLIC_DEV_MODE=true
\`\`\`

#### Ejecutar aplicación
\`\`\`bash
npm run dev
\`\`\`
La aplicación estará disponible en: `http://localhost:3000`

## Configuración

### Variables de Entorno

#### Backend (appsettings.json)
\`\`\`json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=bd_activo_fijo;Uid=root;Pwd=PASSWORD;"
  },
  "ExternalApi": {
    "EntradasContables": {
      "BaseUrl": "http://3.80.223.142:3001/api/public/entradas-contables",
      "Timeout": 30,
      "DefaultFilters": {
        "CuentaId": 3,
        "SistemaAuxiliarId": 4
      }
    }
  }
}
\`\`\`

#### Frontend (.env.local)
\`\`\`env
API_BASE_URL=http://localhost:5001/api
NEXT_PUBLIC_DEV_MODE=true
\`\`\`

## Estructura del Proyecto

\`\`\`
proyecto-gestion-activos-fijos/
├── ActivosFijosAPI/              # Backend ASP.NET Core
│   ├── Controllers/              # Controladores de API
│   ├── Services/                 # Lógica de negocio
│   ├── Models/                   # Modelos de datos
│   ├── DTOs/                     # Objetos de transferencia
│   └── Data/                     # Contexto de base de datos
├── app/                          # Frontend Next.js
│   ├── (dashboard)/              # Rutas del dashboard
│   └── globals.css               # Estilos globales
├── components/                   # Componentes React
│   ├── pages/                    # Componentes de página
│   ├── modals/                   # Modales de CRUD
│   └── ui/                       # Componentes base
├── lib/                          # Utilidades
│   ├── actions/                  # Server Actions
│   └── utils/                    # Funciones auxiliares
└── scripts/                      # Scripts de base de datos
\`\`\`

## API Externa

### Entradas Contables
El sistema se integra con una API externa para gestionar entradas contables:

**Endpoint**: `http://3.80.223.142:3001/api/public/entradas-contables`

**Parámetros de consulta**:
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha de fin (YYYY-MM-DD)
- `cuenta_Id`: ID de cuenta contable

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.



