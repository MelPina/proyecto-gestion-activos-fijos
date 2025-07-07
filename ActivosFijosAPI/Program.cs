using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Services;
using System;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
    }
});

// Add services
builder.Services.AddScoped<IEmpleadoService, EmpleadoService>();
builder.Services.AddScoped<IDepartamentoService, DepartamentoService>();
builder.Services.AddScoped<ITipoActivoService, TipoActivoService>();
builder.Services.AddScoped<IActivoFijoService, ActivoFijoService>();

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

var app = builder.Build();

// Test database connection on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        Console.WriteLine("Testing database connection...");
        Task.Run(async () => await context.Database.CanConnectAsync()).Wait();
        Console.WriteLine("Database connection successful!");
        
        // Optionally create database if it doesn't exist
        Task.Run(async () => await context.Database.EnsureCreatedAsync()).Wait();
        Console.WriteLine("Database schema verified!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection failed: {ex.Message}");
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

// No usar HTTPS redirection en desarrollo para evitar problemas de certificados
// app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();

// Add a test endpoint
app.MapGet("/", () => "Activos Fijos API is running! Go to /swagger to see the API documentation.");

Console.WriteLine("API started successfully!");
Console.WriteLine("Swagger UI: http://localhost:5001/swagger");
Console.WriteLine("API Base: http://localhost:5001/api");
Console.WriteLine("HTTPS Swagger: https://localhost:7001/swagger");
Console.WriteLine("HTTPS API: https://localhost:7001/api");

app.Run();
