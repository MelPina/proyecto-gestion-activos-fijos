using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class DepartamentoService : IDepartamentoService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DepartamentoService> _logger;

        public DepartamentoService(ApplicationDbContext context, ILogger<DepartamentoService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<DepartamentoDto>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation("Getting all departamentos (including inactive)");
                
                var departamentos = await _context.Departamentos
                    .Include(d => d.Empleados.Where(e => e.Activo))
                    .OrderBy(d => d.Descripcion)
                    .ToListAsync();

                _logger.LogInformation($"Found {departamentos.Count} departamentos total");

                return departamentos.Select(d => new DepartamentoDto
                {
                    Id = d.Id,
                    Descripcion = d.Descripcion,
                    Activo = d.Activo,
                    CantidadEmpleados = d.Empleados.Count(e => e.Activo)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting departamentos");
                throw;
            }
        }

        public async Task<DepartamentoDto?> GetByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Getting departamento with ID: {id}");
                
                var departamento = await _context.Departamentos
                    .Include(d => d.Empleados.Where(e => e.Activo))
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (departamento == null)
                {
                    _logger.LogWarning($"Departamento with ID {id} not found");
                    return null;
                }

                return new DepartamentoDto
                {
                    Id = departamento.Id,
                    Descripcion = departamento.Descripcion,
                    Activo = departamento.Activo,
                    CantidadEmpleados = departamento.Empleados.Count(e => e.Activo)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting departamento with ID: {id}");
                throw;
            }
        }

        public async Task<DepartamentoDto> CreateAsync(CreateDepartamentoDto createDto)
        {
            try
            {
                _logger.LogInformation($"Creating departamento: {createDto.Descripcion}");

                // Verificar si ya existe un departamento activo con la misma descripción
                var existingDepartamento = await _context.Departamentos
                    .FirstOrDefaultAsync(d => d.Descripcion.ToLower().Trim() == createDto.Descripcion.ToLower().Trim() && d.Activo);

                if (existingDepartamento != null)
                {
                    throw new InvalidOperationException("Ya existe un departamento activo con esta descripción");
                }

                var departamento = new Departamento
                {
                    Descripcion = createDto.Descripcion.Trim(),
                    Activo = true
                };

                _context.Departamentos.Add(departamento);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created departamento with ID: {departamento.Id}");
                return await GetByIdAsync(departamento.Id) ?? throw new InvalidOperationException("Error al crear departamento");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating departamento: {createDto.Descripcion}");
                throw;
            }
        }

        public async Task<DepartamentoDto> UpdateAsync(int id, UpdateDepartamentoDto updateDto)
        {
            try
            {
                _logger.LogInformation($"Updating departamento with ID: {id}");
                _logger.LogInformation($"Update data: Descripcion='{updateDto.Descripcion}', Activo={updateDto.Activo}");

                var departamento = await _context.Departamentos.FirstOrDefaultAsync(d => d.Id == id);
                if (departamento == null)
                {
                    _logger.LogWarning($"Departamento with ID {id} not found for update");
                    throw new InvalidOperationException("Departamento no encontrado");
                }

                // Verificar si ya existe otro departamento activo con la misma descripción
                var existingDepartamento = await _context.Departamentos
                    .FirstOrDefaultAsync(d => d.Id != id && 
                                           d.Descripcion.ToLower().Trim() == updateDto.Descripcion.ToLower().Trim() && 
                                           d.Activo);

                if (existingDepartamento != null)
                {
                    throw new InvalidOperationException("Ya existe otro departamento activo con esta descripción");
                }

                // Actualizar los campos
                departamento.Descripcion = updateDto.Descripcion.Trim();
                departamento.Activo = updateDto.Activo;

                // Usar Update para asegurar que EF detecte los cambios
                _context.Entry(departamento).State = EntityState.Modified;
                var changes = await _context.SaveChangesAsync();
                
                _logger.LogInformation($"Updated departamento with ID: {id}, Changes saved: {changes}");

                // Refrescar el contexto para obtener los datos actualizados
                _context.Entry(departamento).Reload();

                return await GetByIdAsync(id) ?? throw new InvalidOperationException("Error al actualizar departamento");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating departamento with ID: {id}");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting departamento with ID: {id}");
                
                var departamento = await _context.Departamentos.FirstOrDefaultAsync(d => d.Id == id);
                if (departamento == null)
                {
                    _logger.LogWarning($"Departamento with ID {id} not found for deletion");
                    return false;
                }

                // Verificar si tiene empleados activos
                var tieneEmpleados = await _context.Empleados.AnyAsync(e => e.DepartamentoId == id && e.Activo);
                if (tieneEmpleados)
                {
                    throw new InvalidOperationException("No se puede eliminar el departamento porque tiene empleados asignados");
                }

                // Soft delete - marcar como inactivo
                departamento.Activo = false;
                _context.Entry(departamento).State = EntityState.Modified;
                var changes = await _context.SaveChangesAsync();
                
                _logger.LogInformation($"Deleted (deactivated) departamento with ID: {id}, Changes: {changes}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting departamento with ID: {id}");
                throw;
            }
        }
    }
}
