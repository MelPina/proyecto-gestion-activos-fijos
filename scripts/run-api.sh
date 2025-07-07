# Navegar al directorio de la API
cd ActivosFijosAPI

# Restaurar paquetes NuGet
dotnet restore

# Ejecutar migraciones (si es necesario)
# dotnet ef database update

# Ejecutar la API
dotnet run --urls="https://localhost:7001;http://localhost:5001"
