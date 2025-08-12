using System.ComponentModel.DataAnnotations;

namespace ActivosFijosAPI.DTOs
{
    public class TipoActivoDto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string CuentaContableCompra { get; set; } = string.Empty;
        public string CuentaContableDepreciacion { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public int CantidadActivos { get; set; }
    }

    public class CreateTipoActivoDto
    {
        [Required(ErrorMessage = "La descripción es obligatoria")]
        [StringLength(255, ErrorMessage = "La descripción no puede exceder 255 caracteres")]
        public string Descripcion { get; set; } = string.Empty;

        [Required(ErrorMessage = "La cuenta contable de compra es obligatoria")]
        [StringLength(20, ErrorMessage = "La cuenta contable de compra no puede exceder 20 caracteres")]
        public string CuentaContableCompra { get; set; } = string.Empty;

        [Required(ErrorMessage = "La cuenta contable de depreciación es obligatoria")]
        [StringLength(20, ErrorMessage = "La cuenta contable de depreciación no puede exceder 20 caracteres")]
        public string CuentaContableDepreciacion { get; set; } = string.Empty;
    }

    public class UpdateTipoActivoDto
    {
        [Required(ErrorMessage = "La descripción es obligatoria")]
        [StringLength(255, ErrorMessage = "La descripción no puede exceder 255 caracteres")]
        public string Descripcion { get; set; } = string.Empty;

        [Required(ErrorMessage = "La cuenta contable de compra es obligatoria")]
        [StringLength(20, ErrorMessage = "La cuenta contable de compra no puede exceder 20 caracteres")]
        public string CuentaContableCompra { get; set; } = string.Empty;

        [Required(ErrorMessage = "La cuenta contable de depreciación es obligatoria")]
        [StringLength(20, ErrorMessage = "La cuenta contable de depreciación no puede exceder 20 caracteres")]
        public string CuentaContableDepreciacion { get; set; } = string.Empty;

        public bool Activo { get; set; }
    }
}
