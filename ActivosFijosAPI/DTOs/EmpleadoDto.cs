namespace ActivosFijosAPI.DTOs
{
    public class EmpleadoDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Cedula { get; set; } = string.Empty;
        public int DepartamentoId { get; set; }
        public string DepartamentoDescripcion { get; set; } = string.Empty;
        public int TipoPersona { get; set; }
        public string TipoPersonaDescripcion { get; set; } = string.Empty;
        public DateTime FechaIngreso { get; set; }
        public bool Activo { get; set; }
    }

    public class CreateEmpleadoDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Cedula { get; set; } = string.Empty;
        public int DepartamentoId { get; set; }
        public int TipoPersona { get; set; }
        public DateTime FechaIngreso { get; set; }
    }

    public class UpdateEmpleadoDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Cedula { get; set; } = string.Empty;
        public int DepartamentoId { get; set; }
        public int TipoPersona { get; set; }
        public DateTime FechaIngreso { get; set; }
    }

    public class EmpleadoStatsDto
    {
        public int Total { get; set; }
        public List<DepartamentoStatsDto> PorDepartamento { get; set; } = new();
        public List<TipoPersonaStatsDto> PorTipo { get; set; } = new();
    }

    public class DepartamentoStatsDto
    {
        public string Descripcion { get; set; } = string.Empty;
        public int Cantidad { get; set; }
    }

    public class TipoPersonaStatsDto
    {
        public string Tipo { get; set; } = string.Empty;
        public int Cantidad { get; set; }
    }
}
