using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ActivosFijosAPI.Models
{
    [Table("activos_fijos")]
    public class ActivoFijo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Descripcion { get; set; } = string.Empty;

        [Column("departamento_id")]
        public int? DepartamentoId { get; set; }

        [Column("tipo_activo_id")]
        public int TipoActivoId { get; set; }

        [Column("fecha_adquisicion")]
        public DateTime FechaAdquisicion { get; set; }

        [Column(TypeName = "decimal(15,2)")]
        public decimal Valor { get; set; }

        [Column("depreciacion_acumulada", TypeName = "decimal(15,2)")]
        public decimal DepreciacionAcumulada { get; set; }

        public int Estado { get; set; } = 1;

        [ForeignKey("DepartamentoId")]
        public virtual Departamento? Departamento { get; set; }

        [ForeignKey("TipoActivoId")]
        public virtual TipoActivo? TipoActivo { get; set; }
    }
}
