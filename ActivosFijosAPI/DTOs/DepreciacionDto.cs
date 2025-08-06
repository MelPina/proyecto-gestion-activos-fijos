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
        public string CuentaCompra { get; set; }  = string.Empty;
        public string CuentaDepreciacion { get; set; }  = string.Empty;
    }

        public class DepreciacioinStatsDto
    {
        public int Total { get; set; }
        public List<ActivoFijoStatsDto> PorActivoFijo { get; set; } = new();
        public List<DepreciacionStatsDto> PorMontoDepreciacion { get; set; } = new();
        public List<DepreciacionAcumuladaStatsDto> PorDepreciacionAcumulada { get; set; } = new();
    }

        public class DepreciacionStatsDto
    {
        public string MontoDepreciado { get; set; } = string.Empty;
        public decimal SumaTotal { get; set; }
    }
            public class DepreciacionAcumuladaStatsDto
    {
        public string DepreciadoAcumulada { get; set; } = string.Empty;
        public decimal SumaTotal { get; set; }
    }
}
