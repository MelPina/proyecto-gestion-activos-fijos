#!/bin/bash

echo "🔧 Solucionando problemas de certificado y configuración..."

# Limpiar certificados existentes
echo "1. Limpiando certificados existentes..."
dotnet dev-certs https --clean

# Generar nuevo certificado de desarrollo
echo "2. Generando nuevo certificado de desarrollo..."
dotnet dev-certs https --trust

# Verificar certificado
echo "3. Verificando certificado..."
dotnet dev-certs https --check --trust

echo "Certificado configurado correctamente"
