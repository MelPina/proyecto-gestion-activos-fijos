using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class EmpleadoService : IEmpleadoService
    {
        private readonly ApplicationDbContext _context;

        public EmpleadoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmpleadoDto>> GetAllAsync(string? search = null, int? departamentoId = null)
        {
            var query = _context.Empleados
                .Include(e => e.Departamento)
                .Where(e => e.Activo);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(e => e.Nombre.Contains(search) || e.Cedula.Contains(search));
            }

            if (departamentoId.HasValue)
            {
                query = query.Where(e => e.DepartamentoId == departamentoId.Value);
            }

            var empleados = await query.OrderBy(e => e.Nombre).ToListAsync();

            return empleados.Select(e => new EmpleadoDto
            {
                Id = e.Id,
                Nombre = e.Nombre,
                Cedula = e.Cedula,
                DepartamentoId = e.DepartamentoId,
                DepartamentoDescripcion = e.Departamento?.Descripcion ?? "",
                TipoPersona = e.TipoPersona,
                TipoPersonaDescripcion = GetTipoPersonaDescripcion(e.TipoPersona),
                FechaIngreso = e.FechaIngreso,
                Activo = e.Activo
            });
        }

        public async Task<EmpleadoDto?> GetByIdAsync(int id)
        {
            var empleado = await _context.Empleados
                .Include(e => e.Departamento)
                .FirstOrDefaultAsync(e => e.Id == id && e.Activo);

            if (empleado == null) return null;

            return new EmpleadoDto
            {
                Id = empleado.Id,
                Nombre = empleado.Nombre,
                Cedula = empleado.Cedula,
                DepartamentoId = empleado.DepartamentoId,
                DepartamentoDescripcion = empleado.Departamento?.Descripcion ?? "",
                TipoPersona = empleado.TipoPersona,
                TipoPersonaDescripcion = GetTipoPersonaDescripcion(empleado.TipoPersona),
                FechaIngreso = empleado.FechaIngreso,
                Activo = empleado.Activo
            };
        }

        public async Task<EmpleadoDto> CreateAsync(CreateEmpleadoDto createDto)
        {
            if (await ExistsByCedulaAsync(createDto.Cedula))
            {
                throw new InvalidOperationException("Ya existe un empleado con esta cédula");
            }

            var empleado = new Empleado
            {
                Nombre = createDto.Nombre,
                Cedula = createDto.Cedula,
                DepartamentoId = createDto.DepartamentoId,
                TipoPersona = createDto.TipoPersona,
                FechaIngreso = createDto.FechaIngreso,
                Activo = true
            };

            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(empleado.Id) ?? throw new InvalidOperationException("Error al crear empleado");
        }

        public async Task<EmpleadoDto> UpdateAsync(int id, UpdateEmpleadoDto updateDto)
        {
            var empleado = await _context.Empleados.FirstOrDefaultAsync(e => e.Id == id && e.Activo);
            if (empleado == null)
            {
                throw new InvalidOperationException("Empleado no encontrado");
            }

            if (await ExistsByCedulaAsync(updateDto.Cedula, id))
            {
                throw new InvalidOperationException("Ya existe otro empleado con esta cédula");
            }

            empleado.Nombre = updateDto.Nombre;
            empleado.Cedula = updateDto.Cedula;
            empleado.DepartamentoId = updateDto.DepartamentoId;
            empleado.TipoPersona = updateDto.TipoPersona;
            empleado.FechaIngreso = updateDto.FechaIngreso;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id) ?? throw new InvalidOperationException("Error al actualizar empleado");
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var empleado = await _context.Empleados.FirstOrDefaultAsync(e => e.Id == id && e.Activo);
            if (empleado == null) return false;

            empleado.Activo = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<EmpleadoStatsDto> GetStatsAsync()
        {
            var total = await _context.Empleados.CountAsync(e => e.Activo);

            var porDepartamento = await _context.Departamentos
                .Where(d => d.Activo)
                .Select(d => new DepartamentoStatsDto
                {
                    Descripcion = d.Descripcion,
                    Cantidad = d.Empleados.Count(e => e.Activo)
                })
                .OrderByDescending(x => x.Cantidad)
                .ToListAsync();

            var porTipo = await _context.Empleados
                .Where(e => e.Activo)
                .GroupBy(e => e.TipoPersona)
                .Select(g => new TipoPersonaStatsDto
                {
                    Tipo = GetTipoPersonaDescripcion(g.Key),
                    Cantidad = g.Count()
                })
                .ToListAsync();

            return new EmpleadoStatsDto
            {
                Total = total,
                PorDepartamento = porDepartamento,
                PorTipo = porTipo
            };
        }

        public async Task<bool> ExistsByCedulaAsync(string cedula, int? excludeId = null)
        {
            var query = _context.Empleados.Where(e => e.Cedula == cedula && e.Activo);
            
            if (excludeId.HasValue)
            {
                query = query.Where(e => e.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        private static string GetTipoPersonaDescripcion(int tipo)
        {
            return tipo switch
            {
                1 => "Empleado",
                2 => "Contratista",
                _ => "Otro"
            };
        }
    }
}
