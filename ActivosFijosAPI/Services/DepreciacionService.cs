using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;
using ActivosFijosAPI.Services;

namespace ActivoFijoAPI.Services
{
    public class DepreciacionService : IDepreciacionService
    {
        private readonly ApplicationDbContext _context;

        public DepreciacionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DepreciacionDto>> GetAllAsync(
            string? search = null,
            int? id = null,
            int? anio = null,
            int? mes = null,
            int? activoFijoId = null,
            DateTime? fechaAsiento = null,
            string? cuentaCompra = null,
            string? cuentaDepreciacion = null
        )
        {
            var query = _context.Depreciaciones
                .Include(d => d.ActivoFijo) // Incluimos para usar en cálculo
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(d =>
                    d.CuentaCompra.Contains(search) ||
                    d.CuentaDepreciacion.Contains(search)
                );
            }

            if (id.HasValue)
                query = query.Where(d => d.Id == id.Value);

            if (anio.HasValue)
                query = query.Where(d => d.AnioProceso == anio.Value);

            if (mes.HasValue)
                query = query.Where(d => d.MesProceso == mes.Value);

            if (activoFijoId.HasValue)
                query = query.Where(d => d.ActivoFijoId == activoFijoId.Value);

            if (fechaAsiento.HasValue)
                query = query.Where(d => d.FechaProceso.Date == fechaAsiento.Value.Date);

            if (!string.IsNullOrEmpty(cuentaCompra))
                query = query.Where(d => d.CuentaCompra == cuentaCompra);

            if (!string.IsNullOrEmpty(cuentaDepreciacion))
                query = query.Where(d => d.CuentaDepreciacion == cuentaDepreciacion);

            var depreciaciones = await query
                .OrderByDescending(d => d.FechaProceso)
                .ToListAsync();

            return depreciaciones.Select(d =>
            {
                var categoria = CategorizarActivo(d.ActivoFijo.TipoActivoId, d.CuentaDepreciacion);
                var porcentaje = DefinirTasaDepreciacion(categoria);
                var montoDepreciado = CalcularMontoDepreciado(d.ActivoFijo, d.FechaProceso, categoria, porcentaje) ?? 0;

                return new DepreciacionDto
                {
                    Id = d.Id,
                    Anio = d.AnioProceso,
                    Mes = d.MesProceso,
                    ActivoFijoId = d.ActivoFijoId,
                    FechaProceso = d.FechaProceso,
                    MontoDepreciado = montoDepreciado,
                    DepreciacionAcumulada = -Math.Abs(montoDepreciado),
                    CuentaCompra = d.CuentaCompra,
                    CuentaDepreciacion = d.CuentaDepreciacion,
                    FechaCreacion = d.FechaCreacion
                };
            });
        }

        public async Task<DepreciacionDto?> GetByIdAsync(int id)
        {
            var depreciacion = await _context.Depreciaciones
                .Include(d => d.ActivoFijo)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (depreciacion == null) return null;



                var categoria = CategorizarActivo(depreciacion.ActivoFijo.TipoActivoId, depreciacion.CuentaDepreciacion);
                var porcentaje = DefinirTasaDepreciacion(categoria);
                var montoDepreciado = CalcularMontoDepreciado(depreciacion.ActivoFijo, depreciacion.FechaProceso, categoria, porcentaje) ?? 0;

                return new DepreciacionDto
                {
                    Id = depreciacion.Id,
                    Anio = depreciacion.AnioProceso,
                    Mes = depreciacion.MesProceso,
                    ActivoFijoId = depreciacion.ActivoFijoId,
                    FechaProceso = depreciacion.FechaProceso,
                    MontoDepreciado = montoDepreciado,
                    DepreciacionAcumulada = -Math.Abs(montoDepreciado),
                    CuentaCompra = depreciacion.CuentaCompra,
                    CuentaDepreciacion = depreciacion.CuentaDepreciacion,
                    FechaCreacion = depreciacion.FechaCreacion
                };
            }

        public int? CategorizarActivo(int tipoActivoId, string? cuentaDepreciacion)
        {
            if (!string.IsNullOrEmpty(cuentaDepreciacion))
            {
                int[] categoria1 = { 1, 2 };
                int[] categoria2 = { 3, 4, 5, 6, 7, 8 };

                if (categoria1.Contains(tipoActivoId)) return 1;
                if (categoria2.Contains(tipoActivoId)) return 2;
                return 3;
            }
            return null;
        }

        public decimal? DefinirTasaDepreciacion(int? categoria) => categoria switch
        {
            1 => 0.05m,
            2 => 0.25m,
            3 => 0.15m,
            _ => null
        };

        public decimal? CalcularMontoDepreciado(ActivoFijo activo, DateTime fechaProceso, int? categoria, decimal? porcentaje)
        {
            porcentaje = DefinirTasaDepreciacion(categoria);
            if (categoria == null || porcentaje == null) return null;

            int totalMeses = (fechaProceso.Year - activo.FechaAdquisicion.Year) * 12 + fechaProceso.Month - activo.FechaAdquisicion.Month;
            if (totalMeses < 1) return 0;

            int vidaUtil = (int)(100 / porcentaje.Value);
            if (totalMeses > vidaUtil * 12) totalMeses = vidaUtil * 12;

            decimal valorEnLibros = activo.Valor;
            decimal monto = 0;

            for (int i = 0; i < totalMeses; i++)
            {
                decimal baseCalculo = i < 12 ? valorEnLibros * 0.5m : valorEnLibros;
                decimal anual = baseCalculo * porcentaje.Value;
                decimal mensual = anual / 12;
                monto += mensual;
                valorEnLibros -= mensual;
                if (valorEnLibros < 0) break;
            }

            return Math.Round(monto, 2);
        }

        // Este método se queda igual, solo para reportes globales
        public decimal? CalcularDepreciacionAcumuladaTotalPorActivo(ActivoFijo activo, DateTime fechaProceso, int? categoria, decimal? porcentaje)
        {
            porcentaje = DefinirTasaDepreciacion(categoria);
            if (categoria == null || porcentaje == null) return null;

            int totalMeses = (fechaProceso.Year - activo.FechaAdquisicion.Year) * 12 + fechaProceso.Month - activo.FechaAdquisicion.Month;
            if (totalMeses < 1) return 0;

            int vidaUtil = (int)(100 / porcentaje.Value);
            if (totalMeses > vidaUtil * 12) totalMeses = vidaUtil * 12;

            decimal acumulada = 0;
            decimal valorEnLibros = activo.Valor;

            for (int i = 0; i < totalMeses; i++)
            {
                decimal baseCalculo = i < 12 ? valorEnLibros * 0.5m : valorEnLibros;
                decimal anual = baseCalculo * porcentaje.Value;
                decimal mensual = anual / 12;
                acumulada += mensual;
                valorEnLibros -= mensual;
                if (valorEnLibros < 0) break;
            }

            if (acumulada > activo.Valor) acumulada = activo.Valor;
            return Math.Round(acumulada, 2);
        }
    }
    
}
