using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ActivosFijosAPI.Models
{
    [Table("asiento_contable")]
    public class AsientoContable
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Descripcion { get; set; } = string.Empty;

        [Column("tipo_movimiento")]
        public string TipoMovimiento { get; set; } = string.Empty;

        [Column("tipo_inventario_id")]
        public int TipoInventarioId { get; set; }

        [Column("fecha_asiento")]
        public DateTime FechaAsiento { get; set; }

        [Column("monto_asiento", TypeName = "decimal(15,2)")]
        public decimal MontoAsiento { get; set; }

        [Column("cuenta_contable", TypeName = "decimal(15,2)")]
        public string CuentaContable { get; set; } = string.Empty;

        public int Estado { get; set; } = 1;


        [ForeignKey("ActivoFijoId")]
        public virtual ActivoFijo? ActivoFijo { get; set; }

        [ForeignKey("DepreciacionId")]
        public virtual Depreciacion? Depreciacion { get; set; }

        public virtual ICollection<Depreciacion> Depreciaciones { get; set; } = new List<Depreciacion>();

       
    }
}
