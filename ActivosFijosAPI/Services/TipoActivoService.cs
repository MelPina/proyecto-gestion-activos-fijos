using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class TipoActivoService : ITipoActivoService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TipoActivoService> _logger;

        public TipoActivoService(ApplicationDbContext context, ILogger<TipoActivoService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<TipoActivoDto>> GetAllAsync()
        {
            try
            {
                var tiposActivos = await _context.TiposActivos
                    .Include(t => t.ActivosFijos)
                    .OrderBy(t => t.Descripcion)
                    .ToListAsync();

                return tiposActivos.Select(t => new TipoActivoDto
                {
                    Id = t.Id,
                    Descripcion = t.Descripcion,
                    CuentaContableCompra = t.CuentaContableCompra,
                    CuentaContableDepreciacion = t.CuentaContableDepreciacion,
                    Activo = t.Activo,
                    CantidadActivos = t.ActivosFijos.Count(a => a.Estado > 0)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tipos de activos");
                throw;
            }
        }

        public async Task<TipoActivoDto?> GetByIdAsync(int id)
        {
            try
            {
                var tipoActivo = await _context.TiposActivos
                    .Include(t => t.ActivosFijos)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tipoActivo == null) return null;

                return new TipoActivoDto
                {
                    Id = tipoActivo.Id,
                    Descripcion = tipoActivo.Descripcion,
                    CuentaContableCompra = tipoActivo.CuentaContableCompra,
                    CuentaContableDepreciacion = tipoActivo.CuentaContableDepreciacion,
                    Activo = tipoActivo.Activo,
                    CantidadActivos = tipoActivo.ActivosFijos.Count(a => a.Estado > 0)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener tipo de activo {Id}", id);
                throw;
            }
        }

        public async Task<TipoActivoDto> CreateAsync(CreateTipoActivoDto createDto)
        {
            try
            {
                // Verificar si ya existe un tipo de activo con la misma descripción
                var existingTipo = await _context.TiposActivos
                    .FirstOrDefaultAsync(t => t.Descripcion.ToLower() == createDto.Descripcion.ToLower());

                if (existingTipo != null)
                {
                    if (!existingTipo.Activo)
                    {
                        // Reactivar tipo de activo inactivo
                        existingTipo.CuentaContableCompra = createDto.CuentaContableCompra;
                        existingTipo.CuentaContableDepreciacion = createDto.CuentaContableDepreciacion;
                        existingTipo.Activo = true;

                        await _context.SaveChangesAsync();

                        _logger.LogInformation("Tipo de activo reactivado: {Id}", existingTipo.Id);
                        return await GetByIdAsync(existingTipo.Id) ?? throw new InvalidOperationException("Error al reactivar tipo de activo");
                    }
                    else
                    {
                        throw new InvalidOperationException("Ya existe un tipo de activo activo con esta descripción");
                    }
                }

                var tipoActivo = new TipoActivo
                {
                    Descripcion = createDto.Descripcion,
                    CuentaContableCompra = createDto.CuentaContableCompra,
                    CuentaContableDepreciacion = createDto.CuentaContableDepreciacion,
                    Activo = true
                };

                _context.TiposActivos.Add(tipoActivo);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Tipo de activo creado: {Id}", tipoActivo.Id);
                return await GetByIdAsync(tipoActivo.Id) ?? throw new InvalidOperationException("Error al crear tipo de activo");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear tipo de activo");
                throw;
            }
        }

        public async Task<TipoActivoDto> UpdateAsync(int id, UpdateTipoActivoDto updateDto)
        {
            try
            {
                var tipoActivo = await _context.TiposActivos
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tipoActivo == null)
                {
                    throw new InvalidOperationException("Tipo de activo no encontrado");
                }

                var descripcionNormalizada = updateDto.Descripcion.Trim().ToLower();
                var existingTipo = await _context.TiposActivos
                    .FirstOrDefaultAsync(t => t.Id != id && 
                                       t.Descripcion.Trim().ToLower() == descripcionNormalizada && 
                                       t.Activo);

                if (existingTipo != null)
                {
                    throw new InvalidOperationException("Ya existe otro tipo de activo activo con esta descripción");
                }

                tipoActivo.Descripcion = updateDto.Descripcion.Trim();
                tipoActivo.CuentaContableCompra = updateDto.CuentaContableCompra;
                tipoActivo.CuentaContableDepreciacion = updateDto.CuentaContableDepreciacion;
                tipoActivo.Activo = updateDto.Activo;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Tipo de activo actualizado: {Id}", id);
                
                return new TipoActivoDto
                {
                    Id = tipoActivo.Id,
                    Descripcion = tipoActivo.Descripcion,
                    CuentaContableCompra = tipoActivo.CuentaContableCompra,
                    CuentaContableDepreciacion = tipoActivo.CuentaContableDepreciacion,
                    Activo = tipoActivo.Activo,
                    CantidadActivos = await _context.ActivosFijos.CountAsync(a => a.TipoActivoId == tipoActivo.Id && a.Estado > 0)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar tipo de activo {Id}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var tipoActivo = await _context.TiposActivos
                    .Include(t => t.ActivosFijos)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tipoActivo == null)
                {
                    _logger.LogWarning("Tipo de activo no encontrado para eliminar: {Id}", id);
                    return false;
                }

                // Verificar si tiene activos fijos asignados
                var activosAsignados = tipoActivo.ActivosFijos.Count(a => a.Estado > 0);
                if (activosAsignados > 0)
                {
                    throw new InvalidOperationException($"No se puede eliminar el tipo de activo porque tiene {activosAsignados} activos fijos asignados");
                }

                tipoActivo.Activo = false; // Soft delete
                await _context.SaveChangesAsync();

                _logger.LogInformation("Tipo de activo eliminado: {Id}", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar tipo de activo {Id}", id);
                throw;
            }
        }
    }
}
