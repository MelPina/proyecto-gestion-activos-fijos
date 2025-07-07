#!/bin/bash

echo "Probando conexión Frontend -> API..."

# Verificar variables de entorno
echo "1. Verificando variables de entorno..."
if [ -f .env.local ]; then
    echo ".env.local existe"
    cat .env.local
else
    echo "   .env.local no existe"
    echo "   Creando .env.local..."
    echo "NEXT_PUBLIC_API_URL=https://localhost:7001/api" > .env.local
fi

echo ""
echo "2. Probando conexión directa a la API..."
echo "   Probando Health endpoint..."
curl -k -s https://localhost:7001/api/health | jq . 2>/dev/null || curl -k -s https://localhost:7001/api/health

echo ""
echo "   Probando Departamentos endpoint..."
curl -k -s https://localhost:7001/api/departamentos | jq . 2>/dev/null || curl -k -s https://localhost:7001/api/departamentos

echo ""
echo "   Probando Empleados endpoint..."
curl -k -s https://localhost:7001/api/empleados | jq . 2>/dev/null || curl -k -s https://localhost:7001/api/empleados

echo ""
echo "3. Verificando CORS..."
curl -k -s -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS https://localhost:7001/api/departamentos -v

echo ""
echo "4. URLs para probar en el navegador:"
echo "   - Frontend: http://localhost:3000"
echo "   - Debug page: http://localhost:3000/debug"
echo "   - API Health: https://localhost:7001/api/health"
echo "   - API Swagger: https://localhost:7001/swagger"

echo ""
echo "5. Pasos siguientes:"
echo "   - Abrir http://localhost:3000/debug para ejecutar pruebas"
echo "   - Revisar la consola del navegador (F12) para ver errores"
echo "   - Verificar que ambos servidores estén ejecutándose"
