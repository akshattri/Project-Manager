# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY . .

RUN if [ -f "./Backend/Backend.csproj" ]; then \
      dotnet restore "./Backend/Backend.csproj"; \
      dotnet publish "./Backend/Backend.csproj" -c Release -o /app/out; \
    elif [ -f "./Backend.csproj" ]; then \
      dotnet restore "./Backend.csproj"; \
      dotnet publish "./Backend.csproj" -c Release -o /app/out; \
    else \
      echo "No Backend.csproj found"; exit 1; \
    fi

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/out .

EXPOSE 80
ENTRYPOINT ["sh", "-c", "dotnet Backend.dll --urls http://0.0.0.0:${PORT:-80}"]