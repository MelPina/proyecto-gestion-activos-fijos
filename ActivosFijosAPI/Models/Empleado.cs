using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ActivosFijosAPI.Models
{
    [Table("empleados")]
    public class Empleado
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Cedula { get; set; } = string.Empty;

        [Column("departamento_id")]
        public int DepartamentoId { get; set; }

        [Column("tipo_persona")]
        public int TipoPersona { get; set; }

        [Column("fecha_ingreso")]
        public DateTime FechaIngreso { get; set; }

        public bool Activo { get; set; } = true;

        // Navigation properties
        public virtual Departamento? Departamento { get; set; }
    }
}
