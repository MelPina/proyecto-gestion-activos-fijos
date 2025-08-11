using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});

// Add Entity Framework with better error handling
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    Console.WriteLine($"Connection String: {connectionString}");

    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 21)),
        mySqlOptions =>
        {
            mySqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }
    );

    // Enable sensitive data logging in development
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
        options.LogTo(Console.WriteLine, LogLevel.Information);
    }
});

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "your-super-secret-jwt-key-that-is-at-least-32-characters-long";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// HttpClient para API externa con configuración mejorada
builder.Services.AddHttpClient<IEntradaContableService, EntradaContableService>((sp, client) =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var baseUrl = config["ExternalApi:BaseUrl"];
    var apiKey = config["ExternalApi:ApiKey"];

    if (string.IsNullOrEmpty(baseUrl))
    {
        throw new InvalidOperationException("ExternalApi:BaseUrl no está configurada");
    }

    if (string.IsNullOrEmpty(apiKey))
    {
        throw new InvalidOperationException("ExternalApi:ApiKey no está configurada");
    }

    if (string.IsNullOrEmpty(baseUrl))
    {
        throw new InvalidOperationException("ExternalApi:BaseUrl no está configurada");
    }

    if (string.IsNullOrEmpty(apiKey))
    {
        throw new InvalidOperationException("ExternalApi:ApiKey no está configurada");
    }

    client.BaseAddress = new Uri(baseUrl);
    client.DefaultRequestHeaders.Add("x-api-key", apiKey);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    client.DefaultRequestHeaders.Add("User-Agent", "ActivosFijosAPI/1.0");
    
    // Timeout configurado
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("User-Agent", "ActivosFijosAPI/1.0");
    
    // Timeout configurado
    client.Timeout = TimeSpan.FromSeconds(30);
})
.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    // Configuraciones adicionales si son necesarias
    ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
   
});

// Add services
builder.Services.AddScoped<IEmpleadoService, EmpleadoService>();
builder.Services.AddScoped<IDepartamentoService, DepartamentoService>();
builder.Services.AddScoped<ITipoActivoService, TipoActivoService>();
builder.Services.AddScoped<IActivoFijoService, ActivoFijoService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IEntradaContableService, EntradaContableService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// HTTP Context Accessor
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Test database connection on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        Console.WriteLine("Testing database connection...");
        await context.Database.CanConnectAsync();
        Console.WriteLine("Database connection successful!");
        
        // Optionally create database if it doesn't exist
        await context.Database.EnsureCreatedAsync();
        Console.WriteLine("Database schema verified!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection failed: {ex.Message}");
        Console.WriteLine($"Connection String: {context.Database.GetConnectionString()}");
    }
}

// Test external API connection on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var entradaService = scope.ServiceProvider.GetRequiredService<IEntradaContableService>();
        Console.WriteLine("Testing external API connection...");
        
        var testResult = await entradaService.GetAllAsync(null);
        if (testResult != null)
        {
            Console.WriteLine($"External API connection successful! Found {testResult.Count} records.");
        }
        else
        {
            Console.WriteLine("External API connection failed - check configuration and network connectivity.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"External API connection test failed: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Activos Fijos API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAll");
// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Add test endpoints
app.MapGet("/", () => "Activos Fijos API is running! Go to /swagger to see the API documentation.");

app.MapGet("/health", () => new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    version = "1.0.0"
});

// External API health check
app.MapGet("/health/external-api", async (IEntradaContableService service) =>
{
    try
    {
        var result = await service.GetAllAsync(null);
        return Results.Ok(new
        {
            status = result != null ? "healthy" : "unhealthy",
            timestamp = DateTime.UtcNow,
            recordsFound = result?.Count ?? 0
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            detail: ex.Message,
            title: "External API Connection Failed",
            statusCode: 503
        );
    }
});

Console.WriteLine("API started successfully!");
Console.WriteLine("Swagger UI: http://localhost:5001/swagger");
Console.WriteLine("API Base: http://localhost:5001/api");
Console.WriteLine("HTTPS Swagger: https://localhost:7001/swagger");
Console.WriteLine("HTTPS API: https://localhost:7001/api");
Console.WriteLine("Health Check: http://localhost:5001/health");
Console.WriteLine("External API Health: http://localhost:5001/health/external-api");

app.Run();