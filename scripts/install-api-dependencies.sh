# Crear el proyecto de API
dotnet new webapi -n ActivosFijosAPI
cd ActivosFijosAPI

# Agregar paquetes NuGet necesarios
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Pomelo.EntityFrameworkCore.MySql
dotnet add package Microsoft.AspNetCore.OpenApi
dotnet add package Swashbuckle.AspNetCore

echo "API dependencies installed successfully!"
echo "Configure your connection string in appsettings.json"
echo "Run 'dotnet run' to start the API"
