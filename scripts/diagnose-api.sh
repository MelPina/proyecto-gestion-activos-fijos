#!/bin/bash

echo "Diagnosticando API..."

echo "1. Verificando si la API está ejecutándose..."
if curl -k -s https://localhost:7001/ > /dev/null; then
    echo "API responde en https://localhost:7001"
else
    echo "API no responde en https://localhost:7001"
fi

echo ""
echo "2. Probando endpoint de salud..."
curl -k -s https://localhost:7001/api/health | jq . 2>/dev/null || curl -k -s https://localhost:7001/api/health

echo ""
echo "3. Probando conexión a base de datos..."
curl -k -s https://localhost:7001/api/health/database | jq . 2>/dev/null || curl -k -s https://localhost:7001/api/health/database

echo ""
echo "4. Listando endpoints disponibles..."
echo "   - Swagger: https://localhost:7001/swagger"
echo "   - Health: https://localhost:7001/api/health"
echo "   - Empleados: https://localhost:7001/api/empleados"
echo "   - Departamentos: https://localhost:7001/api/departamentos"

echo ""
echo "5. Verificando logs de la API..."
echo "   Revisa la consola donde ejecutaste 'dotnet run' para ver errores detallados"
