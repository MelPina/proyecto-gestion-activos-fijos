using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Services;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

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

// Add HttpClient for external API calls
builder.Services.AddHttpClient();

builder.Services.AddHttpClient<IEntradaContableService, EntradaContableService>((sp, client) =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var baseUrl = configuration["ExternalApi:BaseUrl"];
    var apiKey = configuration["ExternalApi:ApiKey"];
    var timeout = configuration.GetValue<int>("ExternalApi:Timeout", 30);
    
    if (string.IsNullOrEmpty(baseUrl))
        throw new InvalidOperationException("Configuración de API externa incompleta: BaseUrl no encontrada");
    
    if (string.IsNullOrEmpty(apiKey))
        throw new InvalidOperationException("Configuración de API externa incompleta: ApiKey no encontrada");
    
    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromSeconds(timeout);

    client.DefaultRequestHeaders.Add("User-Agent", "ActivosFijosAPI/1.0");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    
    
    client.DefaultRequestHeaders.Add("x-api-key", apiKey);
});


// Add services
builder.Services.AddScoped<IEmpleadoService, EmpleadoService>();
builder.Services.AddScoped<IDepartamentoService, DepartamentoService>();
builder.Services.AddScoped<ITipoActivoService, TipoActivoService>();
builder.Services.AddScoped<IActivoFijoService, ActivoFijoService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();

// Add CORS - IMPORTANTE: Configuración más permisiva para desarrollo
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
        Task.Run(async () => await context.Database.CanConnectAsync()).Wait();
        Console.WriteLine("✅ Database connection successful!");
        
        // Optionally create database if it doesn't exist
        Task.Run(async () => await context.Database.EnsureCreatedAsync()).Wait();
        Console.WriteLine("✅ Database schema verified!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database connection failed: {ex.Message}");
        Console.WriteLine($"Connection String: {context.Database.GetConnectionString()}");
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

// IMPORTANTE: Usar CORS antes de otros middlewares
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Add a test endpoint
app.MapGet("/", () => "Activos Fijos API is running! Go to /swagger to see the API documentation.");

// Health check endpoint
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.UtcNow });

Console.WriteLine("🚀 API started successfully!");
Console.WriteLine("📖 Swagger UI: http://localhost:5001/swagger");
Console.WriteLine("🌐 API Base: http://localhost:5001/api");
Console.WriteLine("🔒 HTTPS Swagger: https://localhost:7001/swagger");
Console.WriteLine("🔒 HTTPS API: https://localhost:7001/api");

app.Run();
