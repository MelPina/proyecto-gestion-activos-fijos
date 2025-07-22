namespace ActivosFijosAPI.DTOs
{
    public class ActivoFijoDto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int? DepartamentoId { get; set; }
        public string DepartamentoNombre { get; set; } = string.Empty;
        public int TipoActivoId { get; set; }
        public string TipoActivoNombre { get; set; } = string.Empty;
        public DateTime FechaAdquisicion { get; set; }
        public decimal Valor { get; set; }
        public decimal DepreciacionAcumulada { get; set; }
        public int Estado { get; set; }
        public decimal ValorNeto { get; set; }
    }

    public class CreateActivoFijoDto
    {
        public string Descripcion { get; set; } = string.Empty;
        public int? DepartamentoId { get; set; }
        public int TipoActivoId { get; set; }
        public DateTime FechaAdquisicion { get; set; }
        public decimal Valor { get; set; }
        public int Estado { get; set; } = 1;
    }

    public class UpdateActivoFijoDto
    {
        public string? Descripcion { get; set; }
        public int? DepartamentoId { get; set; }
        public int? TipoActivoId { get; set; }
        public DateTime? FechaAdquisicion { get; set; }
        public decimal? Valor { get; set; }
        public decimal? DepreciacionAcumulada { get; set; }
        public int? Estado { get; set; }
    }

    public class ActivoFijoStatsDto
    {
        public int Total { get; set; }
        public int Activos { get; set; }
        public int Inactivos { get; set; }
        public decimal ValorTotal { get; set; }
        public decimal DepreciacionTotal { get; set; }
        public decimal ValorNeto { get; set; }
    }
}
