namespace ActivosFijosAPI.DTOs
{
    public class DepartamentoDto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public int CantidadEmpleados { get; set; }
    }

    public class CreateDepartamentoDto
    {
        public string Descripcion { get; set; } = string.Empty;
    }

    public class UpdateDepartamentoDto
    {
        public string Descripcion { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }
}
