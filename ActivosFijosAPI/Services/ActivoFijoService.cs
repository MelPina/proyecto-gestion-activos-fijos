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

        public async Task<IEnumerable<ActivoFijoDto>> GetAllAsync(string? search = null, int? tipoActivoId = null, int? departamentoId = null, int? estado = null)
        {
            try
            {
                var query = _context.ActivosFijos
                    .Where(a => a.Estado > 0)
                    .Include(a => a.TipoActivo)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(a => a.Descripcion.Contains(search));
                }

                if (tipoActivoId.HasValue)
                {
                    query = query.Where(a => a.TipoActivoId == tipoActivoId.Value);
                }

                if (departamentoId.HasValue)
                {
                    query = query.Where(a => a.DepartamentoId == departamentoId.Value);
                }

                if (estado.HasValue)
                {
                    query = query.Where(a => a.Estado == estado.Value);
                }

                var activosFijos = await query
                    .OrderBy(a => a.Id)
                    .ToListAsync();

                return activosFijos.Select(a => new ActivoFijoDto
                {
                    Id = a.Id,
                    Descripcion = a.Descripcion,
                    FechaAdquisicion = a.FechaAdquisicion,
                    TipoActivoId = a.TipoActivoId,
                    TipoActivoDescripcion = a.TipoActivo?.Descripcion ?? "",
                    DepartamentoId = a.DepartamentoId,
                    DepartamentoDescripcion = "", 
                    Valor = a.Valor,
                    DepreciacionAcumulada = 0, 
                    Estado = a.Estado,
                    EstadoDescripcion = "" 
                });
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
                var activoFijo = await _context.ActivosFijos
                    .Include(a => a.TipoActivo)
                    .FirstOrDefaultAsync(a => a.Id == id && a.Estado > 0);

                if (activoFijo == null) return null;

                return new ActivoFijoDto
                {
                    Id = activoFijo.Id,
                    Descripcion = activoFijo.Descripcion,
                    FechaAdquisicion = activoFijo.FechaAdquisicion,
                    TipoActivoId = activoFijo.TipoActivoId,
                    TipoActivoDescripcion = activoFijo.TipoActivo?.Descripcion ?? "",
                    DepartamentoId = activoFijo.DepartamentoId,
                    DepartamentoDescripcion = "",
                    Valor = activoFijo.Valor,
                    DepreciacionAcumulada = 0,
                    Estado = activoFijo.Estado,
                    EstadoDescripcion = ""
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener activo fijo {Id}", id);
                throw;
            }
        }

        public async Task<ActivoFijoDto> CreateAsync(CreateActivoFijoDto createDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var activoFijo = new ActivoFijo
                {
                    Descripcion = createDto.Descripcion,
                    TipoActivoId = createDto.TipoActivoId,
                    DepartamentoId = createDto.DepartamentoId,
                    FechaAdquisicion = createDto.FechaAdquisicion,
                    Valor = createDto.Valor,
                    Estado = 1
                };

                _context.ActivosFijos.Add(activoFijo);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetByIdAsync(activoFijo.Id) ?? throw new InvalidOperationException("Error al crear activo fijo");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error al crear activo fijo");
                throw;
            }
        }

        public async Task<ActivoFijoDto> UpdateAsync(int id, UpdateActivoFijoDto updateDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var activoFijo = await _context.ActivosFijos
                    .FirstOrDefaultAsync(a => a.Id == id && a.Estado > 0);

                if (activoFijo == null)
                {
                    throw new InvalidOperationException("Activo fijo no encontrado");
                }

                activoFijo.Descripcion = updateDto.Descripcion;
                activoFijo.TipoActivoId = updateDto.TipoActivoId;
                activoFijo.DepartamentoId = updateDto.DepartamentoId;
                activoFijo.FechaAdquisicion = updateDto.FechaAdquisicion;
                activoFijo.Valor = updateDto.Valor;
                activoFijo.Estado = updateDto.Estado;

                _context.Entry(activoFijo).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetByIdAsync(id) ?? throw new InvalidOperationException("Error al actualizar activo fijo");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error al actualizar activo fijo {Id}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var activoFijo = await _context.ActivosFijos
                    .FirstOrDefaultAsync(a => a.Id == id && a.Estado > 0);

                if (activoFijo == null)
                {
                    return false;
                }

                activoFijo.Estado = 0;
                _context.Entry(activoFijo).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error al eliminar activo fijo {Id}", id);
                throw;
            }
        }

        public async Task<ActivoFijoStatsDto> GetStatsAsync()
        {
            try
            {
                var total = await _context.ActivosFijos.CountAsync(a => a.Estado > 0);
                var enUso = await _context.ActivosFijos.CountAsync(a => a.Estado == 2);
                var disponibles = await _context.ActivosFijos.CountAsync(a => a.Estado == 1);
                var enMantenimiento = await _context.ActivosFijos.CountAsync(a => a.Estado == 3);
                var valorTotal = await _context.ActivosFijos
                    .Where(a => a.Estado > 0)
                    .SumAsync(a => a.Valor);

                return new ActivoFijoStatsDto
                {
                    Total = total,
                    EnUso = enUso,
                    Disponibles = disponibles,
                    EnMantenimiento = enMantenimiento,
                    ValorTotal = valorTotal
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener estadísticas de activos fijos");
                throw;
            }
        }
    }
}
