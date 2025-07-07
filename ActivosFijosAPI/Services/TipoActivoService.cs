using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class TipoActivoService : ITipoActivoService
    {
        private readonly ApplicationDbContext _context;

        public TipoActivoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TipoActivoDto>> GetAllAsync()
        {
            var tiposActivos = await _context.TiposActivos
                .Where(t => t.Activo)
                .Include(t => t.ActivosFijos.Where(a => a.Estado == 1))
                .OrderBy(t => t.Descripcion)
                .ToListAsync();

            return tiposActivos.Select(t => new TipoActivoDto
            {
                Id = t.Id,
                Descripcion = t.Descripcion,
                CuentaContableCompra = t.CuentaContableCompra,
                CuentaContableDepreciacion = t.CuentaContableDepreciacion,
                Activo = t.Activo,
                CantidadActivos = t.ActivosFijos.Count
            });
        }

        public async Task<TipoActivoDto?> GetByIdAsync(int id)
        {
            var tipoActivo = await _context.TiposActivos
                .Include(t => t.ActivosFijos.Where(a => a.Estado == 1))
                .FirstOrDefaultAsync(t => t.Id == id && t.Activo);

            if (tipoActivo == null) return null;

            return new TipoActivoDto
            {
                Id = tipoActivo.Id,
                Descripcion = tipoActivo.Descripcion,
                CuentaContableCompra = tipoActivo.CuentaContableCompra,
                CuentaContableDepreciacion = tipoActivo.CuentaContableDepreciacion,
                Activo = tipoActivo.Activo,
                CantidadActivos = tipoActivo.ActivosFijos.Count
            };
        }

        public async Task<TipoActivoDto> CreateAsync(CreateTipoActivoDto createDto)
        {
            var tipoActivo = new TipoActivo
            {
                Descripcion = createDto.Descripcion,
                CuentaContableCompra = createDto.CuentaContableCompra,
                CuentaContableDepreciacion = createDto.CuentaContableDepreciacion,
                Activo = true
            };

            _context.TiposActivos.Add(tipoActivo);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(tipoActivo.Id) ?? throw new InvalidOperationException("Error al crear tipo de activo");
        }

        public async Task<TipoActivoDto> UpdateAsync(int id, UpdateTipoActivoDto updateDto)
        {
            var tipoActivo = await _context.TiposActivos.FirstOrDefaultAsync(t => t.Id == id && t.Activo);
            if (tipoActivo == null)
            {
                throw new InvalidOperationException("Tipo de activo no encontrado");
            }

            tipoActivo.Descripcion = updateDto.Descripcion;
            tipoActivo.CuentaContableCompra = updateDto.CuentaContableCompra;
            tipoActivo.CuentaContableDepreciacion = updateDto.CuentaContableDepreciacion;
            tipoActivo.Activo = updateDto.Activo;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id) ?? throw new InvalidOperationException("Error al actualizar tipo de activo");
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var tipoActivo = await _context.TiposActivos.FirstOrDefaultAsync(t => t.Id == id && t.Activo);
            if (tipoActivo == null) return false;

            // Verificar si tiene activos fijos asociados
            var tieneActivos = await _context.ActivosFijos.AnyAsync(a => a.TipoActivoId == id && a.Estado == 1);
            if (tieneActivos)
            {
                throw new InvalidOperationException("No se puede eliminar el tipo de activo porque tiene activos fijos asociados");
            }

            tipoActivo.Activo = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
