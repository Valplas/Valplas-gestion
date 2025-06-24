FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el .csproj desde subcarpeta
COPY PlastipremApi/PlastipremApi.csproj ./PlastipremApi/
RUN dotnet restore ./PlastipremApi/PlastipremApi.csproj

# Copiar todo el código fuente de la API
COPY PlastipremApi/. ./PlastipremApi/

WORKDIR /src/PlastipremApi
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "PlastipremApi.dll"]
