using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class ActivoFijoService : IActivoFijoService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ActivoFijoService> _logger;

        public ActivoFijoService(ApplicationDbContext context, ILogger<ActivoFijoService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<ActivoFijoDto>> GetAllAsync()
        {
            try
            {
                var activos = await _context.ActivosFijos
                    .Include(a => a.Departamento)
                    .Include(a => a.TipoActivo)
                    .Select(a => new ActivoFijoDto
                    {
                        Id = a.Id,
                        Descripcion = a.Descripcion,
                        DepartamentoId = a.DepartamentoId,
                        DepartamentoNombre = a.Departamento != null ? a.Departamento.Descripcion : "Sin departamento",
                        TipoActivoId = a.TipoActivoId,
                        TipoActivoNombre = a.TipoActivo.Descripcion,
                        FechaAdquisicion = a.FechaAdquisicion,
                        Valor = a.Valor,
                        DepreciacionAcumulada = a.DepreciacionAcumulada,
                        Estado = a.Estado,
                        ValorNeto = a.Valor - a.DepreciacionAcumulada
                    })
                    .ToListAsync();

                return activos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener activos fijos");
                throw;
            }
        }

        public async Task<ActivoFijoDto?> GetByIdAsync(int id)
        {
            try
            {
                var activo = await _context.ActivosFijos
                    .Include(a => a.Departamento)
                    .Include(a => a.TipoActivo)
                    .Where(a => a.Id == id)
                    .Select(a => new ActivoFijoDto
                    {
                        Id = a.Id,
                        Descripcion = a.Descripcion,
                        DepartamentoId = a.DepartamentoId,
                        DepartamentoNombre = a.Departamento != null ? a.Departamento.Descripcion : "Sin departamento",
                        TipoActivoId = a.TipoActivoId,
                        TipoActivoNombre = a.TipoActivo.Descripcion,
                        FechaAdquisicion = a.FechaAdquisicion,
                        Valor = a.Valor,
                        DepreciacionAcumulada = a.DepreciacionAcumulada,
                        Estado = a.Estado,
                        ValorNeto = a.Valor - a.DepreciacionAcumulada
                    })
                    .FirstOrDefaultAsync();

                return activo;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener activo fijo con ID {Id}", id);
                throw;
            }
        }

        public async Task<ActivoFijoDto> CreateAsync(CreateActivoFijoDto createDto)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    // Validar que el tipo de activo existe
                    var tipoActivo = await _context.TiposActivos
                        .FirstOrDefaultAsync(t => t.Id == createDto.TipoActivoId && t.Activo);

                    if (tipoActivo == null)
                    {
                        throw new ArgumentException("El tipo de activo no existe o está inactivo");
                    }

                    // Validar departamento si se proporciona
                    if (createDto.DepartamentoId.HasValue)
                    {
                        var departamento = await _context.Departamentos
                            .FirstOrDefaultAsync(d => d.Id == createDto.DepartamentoId.Value && d.Activo);

                        if (departamento == null)
                        {
                            throw new ArgumentException("El departamento no existe o está inactivo");
                        }
                    }

                    var activo = new ActivoFijo
                    {
                        Descripcion = createDto.Descripcion.Trim(),
                        DepartamentoId = createDto.DepartamentoId,
                        TipoActivoId = createDto.TipoActivoId,
                        FechaAdquisicion = createDto.FechaAdquisicion,
                        Valor = createDto.Valor,
                        DepreciacionAcumulada = 0,
                        Estado = createDto.Estado
                    };

                    _context.ActivosFijos.Add(activo);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    _logger.LogInformation("Activo fijo creado: {Descripcion} (ID: {Id})", activo.Descripcion, activo.Id);

                    return await GetByIdAsync(activo.Id) ?? throw new InvalidOperationException("Error al recuperar el activo creado");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error al crear activo fijo");
                    throw;
                }
            });
        }

        public async Task<ActivoFijoDto?> UpdateAsync(int id, UpdateActivoFijoDto updateDto)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var activo = await _context.ActivosFijos.FindAsync(id);
                    if (activo == null)
                    {
                        return null;
                    }

                    // Actualizar campos si se proporcionan
                    if (!string.IsNullOrWhiteSpace(updateDto.Descripcion))
                    {
                        activo.Descripcion = updateDto.Descripcion.Trim();
                    }

                    if (updateDto.DepartamentoId.HasValue)
                    {
                        if (updateDto.DepartamentoId.Value > 0)
                        {
                            var departamento = await _context.Departamentos
                                .FirstOrDefaultAsync(d => d.Id == updateDto.DepartamentoId.Value && d.Activo);

                            if (departamento == null)
                            {
                                throw new ArgumentException("El departamento no existe o está inactivo");
                            }
                        }
                        activo.DepartamentoId = updateDto.DepartamentoId.Value > 0 ? updateDto.DepartamentoId.Value : null;
                    }

                    if (updateDto.TipoActivoId.HasValue)
                    {
                        var tipoActivo = await _context.TiposActivos
                            .FirstOrDefaultAsync(t => t.Id == updateDto.TipoActivoId.Value && t.Activo);

                        if (tipoActivo == null)
                        {
                            throw new ArgumentException("El tipo de activo no existe o está inactivo");
                        }
                        activo.TipoActivoId = updateDto.TipoActivoId.Value;
                    }

                    if (updateDto.FechaAdquisicion.HasValue)
                    {
                        activo.FechaAdquisicion = updateDto.FechaAdquisicion.Value;
                    }

                    if (updateDto.Valor.HasValue)
                    {
                        activo.Valor = updateDto.Valor.Value;
                    }

                    if (updateDto.DepreciacionAcumulada.HasValue)
                    {
                        activo.DepreciacionAcumulada = updateDto.DepreciacionAcumulada.Value;
                    }

                    if (updateDto.Estado.HasValue)
                    {
                        activo.Estado = updateDto.Estado.Value;
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    _logger.LogInformation("Activo fijo actualizado: {Descripcion} (ID: {Id})", activo.Descripcion, activo.Id);

                    return await GetByIdAsync(activo.Id);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error al actualizar activo fijo con ID {Id}", id);
                    throw;
                }
            });
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var activo = await _context.ActivosFijos.FindAsync(id);
                    if (activo == null)
                    {
                        return false;
                    }

                    // Soft delete - cambiar estado a inactivo
                    activo.Estado = 0;
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    _logger.LogInformation("Activo fijo eliminado (soft delete): {Descripcion} (ID: {Id})", activo.Descripcion, activo.Id);
                    return true;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error al eliminar activo fijo con ID {Id}", id);
                    throw;
                }
            });
        }

        public async Task<IEnumerable<ActivoFijoDto>> SearchAsync(string searchTerm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return await GetAllAsync();
                }

                var term = searchTerm.ToLower().Trim();

                var activos = await _context.ActivosFijos
                    .Include(a => a.Departamento)
                    .Include(a => a.TipoActivo)
                    .Where(a => a.Descripcion.ToLower().Contains(term) ||
                               (a.Departamento != null && a.Departamento.Descripcion.ToLower().Contains(term)) ||
                               a.TipoActivo.Descripcion.ToLower().Contains(term))
                    .Select(a => new ActivoFijoDto
                    {
                        Id = a.Id,
                        Descripcion = a.Descripcion,
                        DepartamentoId = a.DepartamentoId,
                        DepartamentoNombre = a.Departamento != null ? a.Departamento.Descripcion : "Sin departamento",
                        TipoActivoId = a.TipoActivoId,
                        TipoActivoNombre = a.TipoActivo.Descripcion,
                        FechaAdquisicion = a.FechaAdquisicion,
                        Valor = a.Valor,
                        DepreciacionAcumulada = a.DepreciacionAcumulada,
                        Estado = a.Estado,
                        ValorNeto = a.Valor - a.DepreciacionAcumulada
                    })
                    .ToListAsync();

                return activos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al buscar activos fijos con término: {SearchTerm}", searchTerm);
                throw;
            }
        }

        public async Task<ActivoFijoStatsDto> GetStatsAsync()
        {
            try
            {
                var total = await _context.ActivosFijos.CountAsync();
                var activos = await _context.ActivosFijos.CountAsync(a => a.Estado == 1);
                var inactivos = await _context.ActivosFijos.CountAsync(a => a.Estado == 0);
                var valorTotal = await _context.ActivosFijos.SumAsync(a => a.Valor);
                var depreciacionTotal = await _context.ActivosFijos.SumAsync(a => a.DepreciacionAcumulada);

                return new ActivoFijoStatsDto
                {
                    Total = total,
                    Activos = activos,
                    Inactivos = inactivos,
                    ValorTotal = valorTotal,
                    DepreciacionTotal = depreciacionTotal,
                    ValorNeto = valorTotal - depreciacionTotal
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener estadísticas de activos fijos");
                throw;
            }
        }

        public async Task<IEnumerable<ActivoFijoDto>> GetByDepartamentoAsync(int departamentoId)
        {
            try
            {
                var activos = await _context.ActivosFijos
                    .Include(a => a.Departamento)
                    .Include(a => a.TipoActivo)
                    .Where(a => a.DepartamentoId == departamentoId)
                    .Select(a => new ActivoFijoDto
                    {
                        Id = a.Id,
                        Descripcion = a.Descripcion,
                        DepartamentoId = a.DepartamentoId,
                        DepartamentoNombre = a.Departamento != null ? a.Departamento.Descripcion : "Sin departamento",
                        TipoActivoId = a.TipoActivoId,
                        TipoActivoNombre = a.TipoActivo.Descripcion,
                        FechaAdquisicion = a.FechaAdquisicion,
                        Valor = a.Valor,
                        DepreciacionAcumulada = a.DepreciacionAcumulada,
                        Estado = a.Estado,
                        ValorNeto = a.Valor - a.DepreciacionAcumulada
                    })
                    .ToListAsync();

                return activos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener activos fijos por departamento {DepartamentoId}", departamentoId);
                throw;
            }
        }

        public async Task<IEnumerable<ActivoFijoDto>> GetByTipoActivoAsync(int tipoActivoId)
        {
            try
            {
                var activos = await _context.ActivosFijos
                    .Include(a => a.Departamento)
                    .Include(a => a.TipoActivo)
                    .Where(a => a.TipoActivoId == tipoActivoId)
                    .Select(a => new ActivoFijoDto
                    {
                        Id = a.Id,
                        Descripcion = a.Descripcion,
                        DepartamentoId = a.DepartamentoId,
                        DepartamentoNombre = a.Departamento != null ? a.Departamento.Descripcion : "Sin departamento",
                        TipoActivoId = a.TipoActivoId,
                        TipoActivoNombre = a.TipoActivo.Descripcion,
                        FechaAdquisicion = a.FechaAdquisicion,
                        Valor = a.Valor,
                        DepreciacionAcumulada = a.DepreciacionAcumulada,
                        Estado = a.Estado,
                        ValorNeto = a.Valor - a.DepreciacionAcumulada
                    })
                    .ToListAsync();

                return activos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener activos fijos por tipo {TipoActivoId}", tipoActivoId);
                throw;
            }
        }
    }
}
