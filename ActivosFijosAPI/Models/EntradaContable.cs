namespace ActivosFijosAPI.Models
{
    public class DetalleAsiento
    {
        // 65 - Gasto depreciación Activos Fijos
        // 66 - Depreciación Acumulada Activos Fijos
        public int cuentaId { get; set; }
        // DB // CR
        public string tipoMovimiento { get; set; } = string.Empty;
        public decimal montoAsiento { get; set; }
    }

    public class EntradaContable
    {
        public int? id { get; set; }
        public string descripcion { get; set; } = string.Empty;
        // Definido en el servicio
        public int sistemaAuxiliarId { get; set; }
        public DateTime fechaAsiento { get; set; }
        public List<DetalleAsiento> detalles { get; set; } = new();
    }
}
