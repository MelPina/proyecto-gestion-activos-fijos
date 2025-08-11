using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ActivosFijosAPI.Models
{
    [Table("activos_fijos")]
    public class ActivoFijo
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("descripcion")]
        [StringLength(255)]
        public string Descripcion { get; set; } = string.Empty;

        [Column("departamento_id")]
        public int? DepartamentoId { get; set; }

        [Required]
        [Column("tipo_activo_id")]
        public int TipoActivoId { get; set; }

        [Required]
        [Column("fecha_adquisicion")]
        public DateTime FechaAdquisicion { get; set; }

        [Required]
        [Column("valor")]
        public decimal Valor { get; set; }

        [Column("depreciacion_acumulada")]
        public decimal DepreciacionAcumulada { get; set; } = 0;

        [Required]
        [Column("estado")]
        public int Estado { get; set; } = 1; // 1 = Activo, 0 = Inactivo

        // Navigation properties
        [ForeignKey("DepartamentoId")]
        public virtual Departamento? Departamento { get; set; }

        [ForeignKey("TipoActivoId")]
<<<<<<< HEAD
        public virtual TipoActivo? TipoActivo { get; set; }

        public virtual ICollection<Depreciacion> Depreciaciones { get; set; } = new List<Depreciacion>();
=======
        public virtual TipoActivo TipoActivo { get; set; } = null!;

        // Calculated property
        [NotMapped]
        public decimal ValorNeto => Valor - DepreciacionAcumulada;
>>>>>>> origin/dev-mel
    }
}
