using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class AsientoContableService : IAsientoContableService
    {
        private readonly ApplicationDbContext _context;

        public AsientoContableService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AsientoContableDto>> GetAllAsync(string? search = null, int? id = null, DateTime? fechaAsiento = null, string? cuentaContable = null, string? tipoMovimiento = null)
        {
            var query = _context.AsientosContables.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(a => a.Descripcion.Contains(search) || a.CuentaContable.Contains(search) || a.TipoMovimiento.Contains(search));
            }

            if (fechaAsiento.HasValue)
            {
                query = query.Where(a => a.FechaAsiento.Date == fechaAsiento.Value.Date);
            }

            var asientos = await query.OrderByDescending(a => a.FechaAsiento).ToListAsync();

            return asientos.Select(a => new AsientoContableDto
            {
                Id = a.Id,
                Descripcion = a.Descripcion,
                TipoMovimiento = a.TipoMovimiento,
                TipoInventarioId = a.TipoInventarioId,
                FechaAsiento = a.FechaAsiento,
                MontoAsiento = a.MontoAsiento,
                CuentaContable = a.CuentaContable,
                Estado = a.Estado
            });
        }

        public async Task<AsientoContableDto?> GetByIdAsync(int id)
        {
            var asiento = await _context.AsientosContables.FirstOrDefaultAsync(a => a.Id == id);
            if (asiento == null) return null;

            return new AsientoContableDto
            {
                Id = asiento.Id,
                Descripcion = asiento.Descripcion,
                TipoMovimiento = asiento.TipoMovimiento,
                TipoInventarioId = asiento.TipoInventarioId,
                FechaAsiento = asiento.FechaAsiento,
                MontoAsiento = asiento.MontoAsiento,
                CuentaContable = asiento.CuentaContable,
                Estado = asiento.Estado
            };
        }

        public async Task<AsientoContableDto> CreateAsync(CreateAsientoContableDto createDto)
        {
            var asiento = new AsientoContable
            {
                Descripcion = createDto.Descripcion,
                TipoMovimiento = createDto.TipoMovimiento,
                TipoInventarioId = createDto.TipoInventarioId,
                FechaAsiento = createDto.FechaAsiento,
                MontoAsiento = createDto.MontoAsiento,
                CuentaContable = createDto.CuentaContable,
                Estado = createDto.Estado
            };

            _context.AsientosContables.Add(asiento);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(asiento.Id) ?? throw new InvalidOperationException("Error al crear el asiento contable");
        }

        public async Task<AsientoContableDto> UpdateAsync(int id, UpdateAsientoContableDto updateDto)
        {
            var asiento = await _context.AsientosContables.FirstOrDefaultAsync(a => a.Id == id);
            if (asiento == null)
            {
                throw new InvalidOperationException("Asiento contable no encontrado");
            }

            asiento.Descripcion = updateDto.Descripcion;
            asiento.TipoMovimiento = updateDto.TipoMovimiento;
            asiento.TipoInventarioId = updateDto.TipoInventarioId;
            asiento.FechaAsiento = updateDto.FechaAsiento;
            asiento.CuentaContable = updateDto.CuentaContable;
            asiento.Estado = updateDto.Estado;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id) ?? throw new InvalidOperationException("Error al actualizar asiento contable");
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var asiento = await _context.AsientosContables.FirstOrDefaultAsync(a => a.Id == id);
            if (asiento == null) return false;

            _context.AsientosContables.Remove(asiento);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
