using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ActivosFijosAPI.Models
{
    [Table("depreciaciones")]
    public class Depreciacion
    {
        [Key]
        public int Id { get; set; }

        [Column("fecha_adquisicion")]
        public DateTime FechaCreacion { get; set; }

        [Required]
        public int AnioProceso { get; set; }

        [Required]
        public int MesProceso { get; set; }

        [Required]
        public DateTime FechaProceso { get; set; }
        
        [ForeignKey("ActivoFijo")]
        
        [Required]
        public int ActivoFijoId { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal MontoDepreciado { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal DepreciacionAcumulada { get; set; }

        [Required]
        [StringLength(50)]
        [Column("cuenta_compra")]
        public string CuentaCompra { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [Column("cuenta_depreciacion")]
        public string CuentaDepreciacion { get; set; } = string.Empty;


        [Required]
        public virtual ActivoFijo? ActivoFijo { get; set; }
        [Required]
        public virtual TipoActivo? TipoActivo { get; set; }
    }

}
