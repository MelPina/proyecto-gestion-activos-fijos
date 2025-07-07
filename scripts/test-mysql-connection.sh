#!/bin/bash

echo "Diagnosticando conexión MySQL..."

# Verificar si MySQL está ejecutándose
echo "1. Verificando estado de MySQL..."
if command -v brew &> /dev/null; then
    echo "   Usando Homebrew MySQL:"
    brew services list | grep mysql
elif command -v systemctl &> /dev/null; then
    echo "   Usando systemctl:"
    systemctl status mysql
else
    echo "   Verificando procesos MySQL:"
    ps aux | grep mysql
fi

echo ""
echo "2. Verificando puerto 3306..."
if command -v lsof &> /dev/null; then
    lsof -i :3306
elif command -v netstat &> /dev/null; then
    netstat -an | grep 3306
fi

echo ""
echo "3. Intentando conectar a MySQL..."
echo "   Ejecuta este comando manualmente para probar:"
echo "   mysql -u root -p -h localhost -P 3306"

echo ""
echo "4. Verificando si la base de datos existe..."
echo "   Ejecuta en MySQL:"
echo "   SHOW DATABASES;"
echo "   USE bd_activo_fijo;"
echo "   SHOW TABLES;"

echo ""
echo "Si MySQL no está ejecutándose:"
echo "   macOS (Homebrew): brew services start mysql"
echo "   Linux: sudo systemctl start mysql"
echo "   Windows: net start mysql"
