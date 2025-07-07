using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class ActivoFijoService : IActivoFijoService
    {
        private readonly ApplicationDbContext _context;

        public ActivoFijoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ActivoFijoDto>> GetAllAsync(string? search = null, int? tipoActivoId = null, int? departamentoId = null, int? estado = null)
        {
            var query = _context.ActivosFijos
                .Include(a => a.TipoActivo)
                .Include(a => a.Departamento)
                .Where(a => a.Estado > 0); // No incluir eliminados

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

            var activos = await query.OrderBy(a => a.Descripcion).ToListAsync();

            return activos.Select(a => new ActivoFijoDto
            {
                Id = a.Id,
                Descripcion = a.Descripcion,
                DepartamentoId = a.DepartamentoId,
                DepartamentoDescripcion = a.Departamento?.Descripcion ?? "",
                TipoActivoId = a.TipoActivoId,
                TipoActivoDescripcion = a.TipoActivo?.Descripcion ?? "",
                FechaAdquisicion = a.FechaAdquisicion,
                Valor = a.Valor,
                DepreciacionAcumulada = a.DepreciacionAcumulada,
                Estado = a.Estado,
                EstadoDescripcion = GetEstadoDescripcion(a.Estado)
            });
        }

        public async Task<ActivoFijoDto?> GetByIdAsync(int id)
        {
            var activo = await _context.ActivosFijos
                .Include(a => a.TipoActivo)
                .Include(a => a.Departamento)
                .FirstOrDefaultAsync(a => a.Id == id && a.Estado > 0);

            if (activo == null) return null;

            return new ActivoFijoDto
            {
                Id = activo.Id,
                Descripcion = activo.Descripcion,
                DepartamentoId = activo.DepartamentoId,
                DepartamentoDescripcion = activo.Departamento?.Descripcion ?? "",
                TipoActivoId = activo.TipoActivoId,
                TipoActivoDescripcion = activo.TipoActivo?.Descripcion ?? "",
                FechaAdquisicion = activo.FechaAdquisicion,
                Valor = activo.Valor,
                DepreciacionAcumulada = activo.DepreciacionAcumulada,
                Estado = activo.Estado,
                EstadoDescripcion = GetEstadoDescripcion(activo.Estado)
            };
        }

        public async Task<ActivoFijoDto> CreateAsync(CreateActivoFijoDto createDto)
        {
            var activo = new ActivoFijo
            {
                Descripcion = createDto.Descripcion,
                DepartamentoId = createDto.DepartamentoId,
                TipoActivoId = createDto.TipoActivoId,
                FechaAdquisicion = createDto.FechaAdquisicion,
                Valor = createDto.Valor,
                DepreciacionAcumulada = 0,
                Estado = 1 // Activo
            };

            _context.ActivosFijos.Add(activo);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(activo.Id) ?? throw new InvalidOperationException("Error al crear activo fijo");
        }

        public async Task<ActivoFijoDto> UpdateAsync(int id, UpdateActivoFijoDto updateDto)
        {
            var activo = await _context.ActivosFijos.FirstOrDefaultAsync(a => a.Id == id && a.Estado > 0);
            if (activo == null)
            {
                throw new InvalidOperationException("Activo fijo no encontrado");
            }

            activo.Descripcion = updateDto.Descripcion;
            activo.DepartamentoId = updateDto.DepartamentoId;
            activo.TipoActivoId = updateDto.TipoActivoId;
            activo.FechaAdquisicion = updateDto.FechaAdquisicion;
            activo.Valor = updateDto.Valor;
            activo.Estado = updateDto.Estado;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id) ?? throw new InvalidOperationException("Error al actualizar activo fijo");
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var activo = await _context.ActivosFijos.FirstOrDefaultAsync(a => a.Id == id && a.Estado > 0);
            if (activo == null) return false;

            activo.Estado = 0; // Eliminado
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ActivoFijoStatsDto> GetStatsAsync()
        {
            var total = await _context.ActivosFijos.CountAsync(a => a.Estado > 0);
            var enUso = await _context.ActivosFijos.CountAsync(a => a.Estado == 1);
            var disponibles = await _context.ActivosFijos.CountAsync(a => a.Estado == 2);
            var enMantenimiento = await _context.ActivosFijos.CountAsync(a => a.Estado == 3);
            var valorTotal = await _context.ActivosFijos.Where(a => a.Estado > 0).SumAsync(a => a.Valor);

            return new ActivoFijoStatsDto
            {
                Total = total,
                EnUso = enUso,
                Disponibles = disponibles,
                EnMantenimiento = enMantenimiento,
                ValorTotal = valorTotal
            };
        }

        private static string GetEstadoDescripcion(int estado)
        {
            return estado switch
            {
                1 => "En Uso",
                2 => "Disponible",
                3 => "En Mantenimiento",
                4 => "Fuera de Servicio",
                _ => "Desconocido"
            };
        }
    }
}
