using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ActivosFijosAPI.Models
{
    [Table("tipos_activos")]
    public class TipoActivo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Descripcion { get; set; } = string.Empty;

        [Column("cuenta_contable_compra")]
        [StringLength(50)]
        public string CuentaContableCompra { get; set; } = string.Empty;

        [Column("cuenta_contable_depreciacion")]
        [StringLength(50)]
        public string CuentaContableDepreciacion { get; set; } = string.Empty;

        public bool Activo { get; set; } = true;

        // Navigation properties
        public virtual ICollection<ActivoFijo> ActivosFijos { get; set; } = new List<ActivoFijo>();
    }
}
