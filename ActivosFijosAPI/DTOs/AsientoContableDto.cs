namespace ActivosFijosAPI.DTOs
{
    public class AsientoContableDto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string TipoMovimiento{ get; set; } = string.Empty;
        public int TipoInventarioId { get; set; }
        public DateTime FechaAsiento { get; set; }
        public decimal MontoAsiento { get; set; }
       public string CuentaContable { get; set; } = string.Empty;
        public int Estado { get; set; }
  
    }

    public class CreateAsientoContableDto
    {
        public string Descripcion { get; set; } = string.Empty;
        public string TipoMovimiento{ get; set; } = string.Empty;
        public int TipoInventarioId { get; set; }
        public DateTime FechaAsiento { get; set; }
        public decimal MontoAsiento { get; set; }
       public string CuentaContable { get; set; } = string.Empty;
        public int Estado { get; set; }
    }

    public class UpdateAsientoContableDto
    {
        public string Descripcion { get; set; } = string.Empty;
        public string TipoMovimiento{ get; set; } = string.Empty;
        public int TipoInventarioId { get; set; }
        public DateTime FechaAsiento { get; set; }
       public string CuentaContable { get; set; } = string.Empty;
        public int Estado { get; set; }
    }
}
