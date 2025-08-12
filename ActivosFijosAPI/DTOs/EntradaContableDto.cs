using System.ComponentModel.DataAnnotations;

namespace ActivosFijosAPI.DTOs
{
    public class DetalleAsientoDto
    {
        [Required]
        public int cuentaId { get; set; }
        
        [Required]
        [StringLength(2)]
        public string tipoMovimiento { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0")]
        public decimal montoAsiento { get; set; }
    }

    public class EntradaContableDto
    {
        public int? id { get; set; }
        
        [Required]
        [StringLength(500)]
        public string descripcion { get; set; } = string.Empty;
        
        public int sistemaAuxiliarId { get; set; }
        
        [Required]
        public DateTime fechaAsiento { get; set; }
        
        [Required]
        [MinLength(1, ErrorMessage = "Debe incluir al menos un detalle")]
        public List<DetalleAsientoDto> detalles { get; set; } = new();
    }

    public class CreateEntradaContableDto
    {
        [Required]
        [StringLength(500)]
        public string descripcion { get; set; } = string.Empty;
        
        [Required]
        public DateTime fechaAsiento { get; set; }
        
        [Required]
        [MinLength(1, ErrorMessage = "Debe incluir al menos un detalle")]
        public List<DetalleAsientoDto> detalles { get; set; } = new();
    }

    public class UpdateEntradaContableDto
    {
        [Required]
        [StringLength(500)]
        public string descripcion { get; set; } = string.Empty;
        
        [Required]
        public DateTime fechaAsiento { get; set; }
        
        [Required]
        [MinLength(1, ErrorMessage = "Debe incluir al menos un detalle")]
        public List<DetalleAsientoDto> detalles { get; set; } = new();
    }

    public class EntradaContableFiltersDto
    {
        public DateTime? fechaInicio { get; set; }
        public DateTime? fechaFin { get; set; }
        public int? cuentaId { get; set; }
    }
}
