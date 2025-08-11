using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Models;

namespace ActivosFijosAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Empleado> Empleados { get; set; }
        public DbSet<Departamento> Departamentos { get; set; }
        public DbSet<TipoActivo> TiposActivos { get; set; }
        public DbSet<ActivoFijo> ActivosFijos { get; set; }
<<<<<<< HEAD
        public DbSet<AsientoContable> AsientosContables { get; set; }
=======
        public DbSet<Usuario> Usuarios { get; set; }
>>>>>>> origin/dev-mel

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar relaciones
            modelBuilder.Entity<Empleado>()
                .HasOne(e => e.Departamento)
                .WithMany(d => d.Empleados)
                .HasForeignKey(e => e.DepartamentoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ActivoFijo>()
                .HasOne(a => a.TipoActivo)
                .WithMany(t => t.ActivosFijos)
                .HasForeignKey(a => a.TipoActivoId)
                .OnDelete(DeleteBehavior.Restrict);


            // Configurar índices únicos
            modelBuilder.Entity<Empleado>()
                .HasIndex(e => e.Cedula)
                .IsUnique();

<<<<<<< HEAD
            modelBuilder.Entity<Depreciacion>()
                .HasOne(d => d.ActivoFijo)
                .WithMany(a => a.Depreciaciones)
                .HasForeignKey(d => d.ActivoFijoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AsientoContable>()
                .HasOne(a => a.Depreciacion)
                .WithMany(c => c.AsientosContables)
                .HasForeignKey(a => a.Depreciacion)
                .OnDelete(DeleteBehavior.Restrict);
=======
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Nombre)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();
>>>>>>> origin/dev-mel
        }
    }
}
