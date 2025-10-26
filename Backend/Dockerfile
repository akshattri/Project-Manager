# Build stage (uses .NET 9 SDK to match your Backend.csproj target net9.0)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and restore, then publish only the Backend project
COPY . .
WORKDIR /src/Backend
RUN dotnet restore
RUN dotnet publish -c Release -o /app/out

# Runtime stage (lightweight image)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published output
COPY --from=build /app/out .

# At runtime, Render provides a PORT env var — pass it to Kestrel
# Use shell entrypoint so ${PORT} is expanded at container runtime
EXPOSE 80
ENTRYPOINT ["sh", "-c", "dotnet Backend.dll --urls http://0.0.0.0:${PORT:-80}"]