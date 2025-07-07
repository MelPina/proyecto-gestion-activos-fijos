using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ActivosFijosAPI.Models
{
    [Table("departamentos")]
    public class Departamento
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Descripcion { get; set; } = string.Empty;

        public bool Activo { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();
        public virtual ICollection<ActivoFijo>? activosFijos { get; set; }
    }
}
