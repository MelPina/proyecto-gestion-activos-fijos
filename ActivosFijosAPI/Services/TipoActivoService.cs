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
                    .Where(t => t.Activo)
                    .OrderBy(t => t.Descripcion)
                    .ToListAsync();

                var result = new List<TipoActivoDto>();
                foreach (var tipo in tiposActivos)
                {
                    // Contar activos fijos asociados
                    var cantidadActivos = await _context.ActivosFijos
                        .CountAsync(a => a.TipoActivoId == tipo.Id && a.Estado == 1);

                    result.Add(new TipoActivoDto
                    {
                        Id = tipo.Id,
                        Descripcion = tipo.Descripcion,
                        CuentaContableCompra = tipo.CuentaContableCompra,
                        CuentaContableDepreciacion = tipo.CuentaContableDepreciacion,
                        Activo = tipo.Activo,
                        CantidadActivos = cantidadActivos
                    });
                }

                return result;
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
                    .FirstOrDefaultAsync(t => t.Id == id && t.Activo);

                if (tipoActivo == null) return null;

                // Contar activos fijos asociados
                var cantidadActivos = await _context.ActivosFijos
                    .CountAsync(a => a.TipoActivoId == id && a.Estado == 1);

                return new TipoActivoDto
                {
                    Id = tipoActivo.Id,
                    Descripcion = tipoActivo.Descripcion,
                    CuentaContableCompra = tipoActivo.CuentaContableCompra,
                    CuentaContableDepreciacion = tipoActivo.CuentaContableDepreciacion,
                    Activo = tipoActivo.Activo,
                    CantidadActivos = cantidadActivos
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
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Verificar si ya existe un tipo de activo con la misma descripción
                var existingTipoActivo = await _context.TiposActivos
                    .FirstOrDefaultAsync(t => t.Descripcion.ToLower() == createDto.Descripcion.ToLower());

                if (existingTipoActivo != null)
                {
                    if (!existingTipoActivo.Activo)
                    {
                        // Reactivar tipo de activo inactivo
                        existingTipoActivo.CuentaContableCompra = createDto.CuentaContableCompra;
                        existingTipoActivo.CuentaContableDepreciacion = createDto.CuentaContableDepreciacion;
                        existingTipoActivo.Activo = true;
                        _context.Entry(existingTipoActivo).State = EntityState.Modified;
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Tipo de activo reactivado: {Id}", existingTipoActivo.Id);
                        return new TipoActivoDto
                        {
                            Id = existingTipoActivo.Id,
                            Descripcion = existingTipoActivo.Descripcion,
                            CuentaContableCompra = existingTipoActivo.CuentaContableCompra,
                            CuentaContableDepreciacion = existingTipoActivo.CuentaContableDepreciacion,
                            Activo = existingTipoActivo.Activo,
                            CantidadActivos = 0
                        };
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
                await transaction.CommitAsync();

                _logger.LogInformation("Tipo de activo creado: {Id}", tipoActivo.Id);

                return new TipoActivoDto
                {
                    Id = tipoActivo.Id,
                    Descripcion = tipoActivo.Descripcion,
                    CuentaContableCompra = tipoActivo.CuentaContableCompra,
                    CuentaContableDepreciacion = tipoActivo.CuentaContableDepreciacion,
                    Activo = tipoActivo.Activo,
                    CantidadActivos = 0
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error al crear tipo de activo");
                throw;
            }
        }

        public async Task<TipoActivoDto> UpdateAsync(int id, UpdateTipoActivoDto updateDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var tipoActivo = await _context.TiposActivos
                    .FirstOrDefaultAsync(t => t.Id == id && t.Activo);

                if (tipoActivo == null)
                {
                    throw new InvalidOperationException("Tipo de activo no encontrado");
                }

                // Verificar si ya existe otro tipo de activo con la misma descripción
                var existingTipoActivo = await _context.TiposActivos
                    .FirstOrDefaultAsync(t => t.Id != id && 
                                           t.Descripcion.ToLower() == updateDto.Descripcion.ToLower() && 
                                           t.Activo);

                if (existingTipoActivo != null)
                {
                    throw new InvalidOperationException("Ya existe otro tipo de activo activo con esta descripción");
                }

                tipoActivo.Descripcion = updateDto.Descripcion;
                tipoActivo.CuentaContableCompra = updateDto.CuentaContableCompra;
                tipoActivo.CuentaContableDepreciacion = updateDto.CuentaContableDepreciacion;
                tipoActivo.Activo = updateDto.Activo;
                _context.Entry(tipoActivo).State = EntityState.Modified;
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Tipo de activo actualizado: {Id}", id);

                // Contar activos fijos asociados
                var cantidadActivos = await _context.ActivosFijos
                    .CountAsync(a => a.TipoActivoId == id && a.Estado == 1);

                return new TipoActivoDto
                {
                    Id = tipoActivo.Id,
                    Descripcion = tipoActivo.Descripcion,
                    CuentaContableCompra = tipoActivo.CuentaContableCompra,
                    CuentaContableDepreciacion = tipoActivo.CuentaContableDepreciacion,
                    Activo = tipoActivo.Activo,
                    CantidadActivos = cantidadActivos
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error al actualizar tipo de activo {Id}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var tipoActivo = await _context.TiposActivos
                    .FirstOrDefaultAsync(t => t.Id == id && t.Activo);

                if (tipoActivo == null)
                {
                    _logger.LogWarning("Tipo de activo no encontrado para eliminar: {Id}", id);
                    return false;
                }

                // Verificar si hay activos fijos que usan este tipo
                var activosConTipo = await _context.ActivosFijos
                    .CountAsync(a => a.TipoActivoId == id && a.Estado == 1);

                if (activosConTipo > 0)
                {
                    throw new InvalidOperationException($"No se puede eliminar el tipo de activo porque hay {activosConTipo} activo(s) fijo(s) que lo usan");
                }

                tipoActivo.Activo = false; // Soft delete
                _context.Entry(tipoActivo).State = EntityState.Modified;
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Tipo de activo eliminado: {Id}", id);
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error al eliminar tipo de activo {Id}", id);
                throw;
            }
        }
    }
}
