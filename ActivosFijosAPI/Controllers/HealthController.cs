using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;

namespace ActivosFijosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HealthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                // Test database connection
                var canConnect = await _context.Database.CanConnectAsync();
                
                var health = new
                {
                    Status = "Healthy",
                    Timestamp = DateTime.UtcNow,
                    Database = canConnect ? "Connected" : "Disconnected",
                    ConnectionString = _context.Database.GetConnectionString()?.Replace("Password=", "Password=***"),
                    Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
                };

                return Ok(health);
            }
            catch (Exception ex)
            {
                var health = new
                {
                    Status = "Unhealthy",
                    Timestamp = DateTime.UtcNow,
                    Error = ex.Message,
                    Database = "Error",
                    Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
                };

                return StatusCode(500, health);
            }
        }

        [HttpGet("database")]
        public async Task<IActionResult> TestDatabase()
        {
            try
            {
                var departamentosCount = await _context.Departamentos.CountAsync();
                var empleadosCount = await _context.Empleados.CountAsync();
                
                return Ok(new
                {
                    Message = "Database connection successful",
                    Tables = new
                    {
                        Departamentos = departamentosCount,
                        Empleados = empleadosCount
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Database connection failed",
                    Error = ex.Message,
                    InnerException = ex.InnerException?.Message
                });
            }
        }
    }
}
