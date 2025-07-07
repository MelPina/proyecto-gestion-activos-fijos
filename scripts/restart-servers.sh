#!/bin/bash

echo "Reiniciando servidores con configuración HTTP..."

# Función para matar procesos en puertos específicos
kill_port() {
    local port=$1
    echo "Matando procesos en puerto $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
}

# Matar procesos existentes
kill_port 3000
kill_port 5001
kill_port 7001

echo "Procesos anteriores terminados"

# Esperar un momento
sleep 2

echo ""
echo "Iniciando API en modo HTTP..."
echo "   La API estará disponible en:"
echo "   - HTTP: http://localhost:5001"
echo "   - HTTPS: https://localhost:7001"
echo "   - Swagger HTTP: http://localhost:5001/swagger"
echo ""

# Iniciar API en background
cd ActivosFijosAPI
dotnet run --urls="https://localhost:7001;http://localhost:5001" &
API_PID=$!

# Esperar a que la API inicie
echo "⏳ Esperando a que la API inicie..."
sleep 5

# Probar la API
echo "Probando API HTTP..."
curl -s http://localhost:5001/api/health | jq . 2>/dev/null || curl -s http://localhost:5001/api/health

echo ""
echo "Iniciando Frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Servidores iniciados:"
echo "   - API PID: $API_PID"
echo "   - Frontend PID: $FRONTEND_PID"
echo ""
echo "URLs disponibles:"
echo "   - Frontend: http://localhost:3000"
echo "   - Debug: http://localhost:3000/debug"
echo "   - API HTTP: http://localhost:5001/api/health"
echo "   - Swagger HTTP: http://localhost:5001/swagger"
echo ""
echo "Para detener los servidores:"
echo "   kill $API_PID $FRONTEND_PID"
