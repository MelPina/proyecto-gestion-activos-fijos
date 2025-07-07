namespace ActivosFijosAPI.DTOs
{
    public class ActivoFijoDto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public int? DepartamentoId { get; set; }
        public string DepartamentoDescripcion { get; set; } = string.Empty;
        public int TipoActivoId { get; set; }
        public string TipoActivoDescripcion { get; set; } = string.Empty;
        public DateTime FechaAdquisicion { get; set; }
        public decimal Valor { get; set; }
        public decimal DepreciacionAcumulada { get; set; }
        public int Estado { get; set; }
        public string EstadoDescripcion { get; set; } = string.Empty;
    }

    public class CreateActivoFijoDto
    {
        public string Descripcion { get; set; } = string.Empty;
        public int? DepartamentoId { get; set; }
        public int TipoActivoId { get; set; }
        public DateTime FechaAdquisicion { get; set; }
        public decimal Valor { get; set; }
    }

    public class UpdateActivoFijoDto
    {
        public string Descripcion { get; set; } = string.Empty;
        public int? DepartamentoId { get; set; }
        public int TipoActivoId { get; set; }
        public DateTime FechaAdquisicion { get; set; }
        public decimal Valor { get; set; }
        public int Estado { get; set; }
    }

    public class ActivoFijoStatsDto
    {
        public int Total { get; set; }
        public int EnUso { get; set; }
        public int Disponibles { get; set; }
        public int EnMantenimiento { get; set; }
        public decimal ValorTotal { get; set; }
    }
}
