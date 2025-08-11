namespace ActivosFijosAPI.DTOs
{
    public class DepreciacionDto
    {
        public int Id { get; set; }
        public int Anio { get; set; }
        public int Mes { get; set; }
        public DateTime FechaProceso { get; set; }
        public int ActivoFijoId { get; set; }
        public decimal MontoDepreciado { get; set; }
        public decimal DepreciacionAcumulada { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string CuentaCompra { get; set; } = string.Empty;
        public string CuentaDepreciacion { get; set; } = string.Empty;
    }

    public class DepreciacionStatsDto
    {

        public List<ActivoFijoStatsDto> porActivoFijo { get; set; } = new();
        public decimal acumuladaPorTipoactivo { get; set; }
        public decimal SumaTotal { get; set; }
    }

    public class CalcularDepreciacionDto
    {
        public int Id { get; set; }
        public DateTime FechaProceso { get; set; }
        public int ActivoFijoId { get; set; }
        public decimal MontoDepreciado { get; set; }
        public decimal DepreciacionAcumulada { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
    

}
