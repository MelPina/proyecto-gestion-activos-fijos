using Microsoft.AspNetCore.Mvc;

namespace ActivosFijosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivosFijosController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetActivos()
        {
            var activos = new[]
            {
                new { Id = 1, Nombre = "Computadora Dell", Categoria = "Tecnología", Valor = 1500.00 },
                new { Id = 2, Nombre = "Escritorio Ejecutivo", Categoria = "Mobiliario", Valor = 800.00 },
                new { Id = 3, Nombre = "Impresora HP", Categoria = "Tecnología", Valor = 300.00 }
            };

            return Ok(activos);
        }

        [HttpGet("{id}")]
        public IActionResult GetActivo(int id)
        {
            var activo = new { Id = id, Nombre = $"Activo {id}", Categoria = "General", Valor = 100.00 };
            return Ok(activo);
        }

        [HttpPost]
        public IActionResult CreateActivo([FromBody] object activo)
        {
            return CreatedAtAction(nameof(GetActivo), new { id = 1 }, activo);
        }
    }
}
