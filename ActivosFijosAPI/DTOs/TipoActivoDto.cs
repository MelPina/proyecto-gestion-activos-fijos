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
        public string Descripcion { get; set; } = string.Empty;
        public string CuentaContableCompra { get; set; } = string.Empty;
        public string CuentaContableDepreciacion { get; set; } = string.Empty;
    }

    public class UpdateTipoActivoDto
    {
        public string Descripcion { get; set; } = string.Empty;
        public string CuentaContableCompra { get; set; } = string.Empty;
        public string CuentaContableDepreciacion { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }
}
