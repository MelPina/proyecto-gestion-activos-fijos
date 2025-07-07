using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class DepartamentoService : IDepartamentoService
    {
        private readonly ApplicationDbContext _context;

        public DepartamentoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DepartamentoDto>> GetAllAsync()
        {
            var departamentos = await _context.Departamentos
                .Where(d => d.Activo)
                .Include(d => d.Empleados.Where(e => e.Activo))
                .OrderBy(d => d.Descripcion)
                .ToListAsync();

            return departamentos.Select(d => new DepartamentoDto
            {
                Id = d.Id,
                Descripcion = d.Descripcion,
                Activo = d.Activo,
                CantidadEmpleados = d.Empleados.Count
            });
        }

        public async Task<DepartamentoDto?> GetByIdAsync(int id)
        {
            var departamento = await _context.Departamentos
                .Include(d => d.Empleados.Where(e => e.Activo))
                .FirstOrDefaultAsync(d => d.Id == id && d.Activo);

            if (departamento == null) return null;

            return new DepartamentoDto
            {
                Id = departamento.Id,
                Descripcion = departamento.Descripcion,
                Activo = departamento.Activo,
                CantidadEmpleados = departamento.Empleados.Count
            };
        }

        public async Task<DepartamentoDto> CreateAsync(CreateDepartamentoDto createDto)
        {
            var departamento = new Departamento
            {
                Descripcion = createDto.Descripcion,
                Activo = true
            };

            _context.Departamentos.Add(departamento);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(departamento.Id) ?? throw new InvalidOperationException("Error al crear departamento");
        }

        public async Task<DepartamentoDto> UpdateAsync(int id, UpdateDepartamentoDto updateDto)
        {
            var departamento = await _context.Departamentos.FirstOrDefaultAsync(d => d.Id == id && d.Activo);
            if (departamento == null)
            {
                throw new InvalidOperationException("Departamento no encontrado");
            }

            departamento.Descripcion = updateDto.Descripcion;
            departamento.Activo = updateDto.Activo;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id) ?? throw new InvalidOperationException("Error al actualizar departamento");
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var departamento = await _context.Departamentos.FirstOrDefaultAsync(d => d.Id == id && d.Activo);
            if (departamento == null) return false;

            // Verificar si tiene empleados activos
            var tieneEmpleados = await _context.Empleados.AnyAsync(e => e.DepartamentoId == id && e.Activo);
            if (tieneEmpleados)
            {
                throw new InvalidOperationException("No se puede eliminar el departamento porque tiene empleados asignados");
            }

            departamento.Activo = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
