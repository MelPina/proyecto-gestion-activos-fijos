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
                var departamentos = await _context.Departamentos
                    .OrderBy(d => d.Descripcion)
                    .ToListAsync();

                var result = new List<DepartamentoDto>();
                foreach (var dept in departamentos)
                {
                    var cantidadEmpleados = await _context.Empleados
                        .CountAsync(e => e.DepartamentoId == dept.Id && e.Activo == true);

                    result.Add(new DepartamentoDto
                    {
                        Id = dept.Id,
                        Descripcion = dept.Descripcion,
                        Activo = dept.Activo,
                        CantidadEmpleados = cantidadEmpleados
                    });
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener departamentos");
                throw;
            }
        }

        public async Task<DepartamentoDto?> GetByIdAsync(int id)
        {
            try
            {
                var departamento = await _context.Departamentos
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (departamento == null) return null;

                var cantidadEmpleados = await _context.Empleados
                    .CountAsync(e => e.DepartamentoId == id && e.Activo == true);

                return new DepartamentoDto
                {
                    Id = departamento.Id,
                    Descripcion = departamento.Descripcion,
                    Activo = departamento.Activo,
                    CantidadEmpleados = cantidadEmpleados
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener departamento {Id}", id);
                throw;
            }
        }

        public async Task<DepartamentoDto> CreateAsync(CreateDepartamentoDto createDto)
        {
            try
            {
                var strategy = _context.Database.CreateExecutionStrategy();
                return await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _context.Database.BeginTransactionAsync();
                    try
                    {
                        var existingDepartamento = await _context.Departamentos
                            .FirstOrDefaultAsync(d => d.Descripcion.ToLower() == createDto.Descripcion.ToLower());

                        if (existingDepartamento != null)
                        {
                            if (!existingDepartamento.Activo)
                            {
                                existingDepartamento.Activo = true;
                                _context.Entry(existingDepartamento).State = EntityState.Modified;
                                await _context.SaveChangesAsync();
                                await transaction.CommitAsync();

                                _logger.LogInformation("Departamento reactivado: {Id}", existingDepartamento.Id);
                                return new DepartamentoDto
                                {
                                    Id = existingDepartamento.Id,
                                    Descripcion = existingDepartamento.Descripcion,
                                    Activo = true,
                                    CantidadEmpleados = 0
                                };
                            }
                            else
                            {
                                throw new InvalidOperationException("Ya existe un departamento activo con esta descripción");
                            }
                        }

                        var departamento = new Departamento
                        {
                            Descripcion = createDto.Descripcion,
                            Activo = true
                        };

                        _context.Departamentos.Add(departamento);
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Departamento creado: {Id}", departamento.Id);
                        return new DepartamentoDto
                        {
                            Id = departamento.Id,
                            Descripcion = departamento.Descripcion,
                            Activo = true,
                            CantidadEmpleados = 0
                        };
                    }
                    catch
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear departamento");
                throw;
            }
        }

        public async Task<DepartamentoDto> UpdateAsync(int id, UpdateDepartamentoDto updateDto)
        {
            try
            {
                var strategy = _context.Database.CreateExecutionStrategy();
                return await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _context.Database.BeginTransactionAsync();
                    try
                    {
                        var departamento = await _context.Departamentos
                            .FirstOrDefaultAsync(d => d.Id == id);

                        if (departamento == null)
                        {
                            throw new InvalidOperationException("Departamento no encontrado");
                        }

                        var existingDepartamento = await _context.Departamentos
                            .FirstOrDefaultAsync(d => d.Id != id && 
                                               d.Descripcion.ToLower() == updateDto.Descripcion.ToLower() && 
                                               d.Activo);

                        if (existingDepartamento != null)
                        {
                            throw new InvalidOperationException("Ya existe otro departamento activo con esta descripción");
                        }

                        departamento.Descripcion = updateDto.Descripcion;
                        departamento.Activo = updateDto.Activo;

                        _context.Entry(departamento).State = EntityState.Modified;
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Departamento actualizado: {Id}", id);

                        var cantidadEmpleados = await _context.Empleados
                            .CountAsync(e => e.DepartamentoId == id && e.Activo == true);

                        return new DepartamentoDto
                        {
                            Id = departamento.Id,
                            Descripcion = departamento.Descripcion,
                            Activo = departamento.Activo,
                            CantidadEmpleados = cantidadEmpleados
                        };
                    }
                    catch
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar departamento {Id}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var strategy = _context.Database.CreateExecutionStrategy();
                return await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _context.Database.BeginTransactionAsync();
                    try
                    {
                        var departamento = await _context.Departamentos
                            .FirstOrDefaultAsync(d => d.Id == id);

                        if (departamento == null)
                        {
                            _logger.LogWarning("Departamento no encontrado para eliminar: {Id}", id);
                            return false;
                        }

                        var empleadosAsignados = await _context.Empleados
                            .CountAsync(e => e.DepartamentoId == id && e.Activo == true);

                        if (empleadosAsignados > 0)
                        {
                            throw new InvalidOperationException($"No se puede eliminar el departamento porque tiene {empleadosAsignados} empleado(s) asignado(s)");
                        }

                        var activosAsignados = await _context.ActivosFijos
                            .CountAsync(af => af.DepartamentoId == id && af.Estado > 0);

                        if (activosAsignados > 0)
                        {
                            throw new InvalidOperationException($"No se puede eliminar el departamento porque tiene {activosAsignados} activo(s) fijo(s) asignado(s)");
                        }

                        departamento.Activo = false;
                        _context.Entry(departamento).State = EntityState.Modified;
                        
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Departamento eliminado: {Id}", id);
                        return true;
                    }
                    catch
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar departamento {Id}", id);
                throw;
            }
        }
    }
}
