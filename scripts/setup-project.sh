#!/bin/bash

echo "Configurando proyecto completo..."

# Instalar dependencias del frontend
echo "Instalando dependencias de Next.js..."
npm install

# Instalar dependencia faltante para animaciones
npm install tailwindcss-animate

# Crear archivo de variables de entorno si no existe
if [ ! -f .env.local ]; then
    echo "🔧 Creando archivo .env.local..."
    cat > .env.local << EOL
NEXT_PUBLIC_API_URL=https://localhost:7001/api
EOL
    echo "Archivo .env.local creado"
else
    echo "Archivo .env.local ya existe"
fi

echo "Configuración del frontend completada"
echo ""
echo "Para ejecutar el proyecto:"
echo "1. Terminal 1 - API: cd ActivosFijosAPI && dotnet run"
echo "2. Terminal 2 - Frontend: npm run dev"
echo ""
echo "URLs:"
echo "- Frontend: http://localhost:3000"
echo "- API: https://localhost:7001"
echo "- Swagger: https://localhost:7001/swagger"
