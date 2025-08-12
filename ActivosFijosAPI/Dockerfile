FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ActivosFijosAPI/ActivosFijosAPI.csproj", "ActivosFijosAPI/"]
RUN dotnet restore "ActivosFijosAPI/ActivosFijosAPI.csproj"
COPY . .
WORKDIR "/src/ActivosFijosAPI"
RUN dotnet publish "ActivosFijosAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ActivosFijosAPI.dll"]
