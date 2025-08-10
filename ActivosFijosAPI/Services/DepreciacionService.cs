using Microsoft.EntityFrameworkCore;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;


namespace ActivoFijoAPI.Services
{
    public class DepreciacionService : IDepreciacionService
    {
        private readonly ApplicationDbContext _context;

        public DepreciacionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<object>> GetMesesProcesoAsync()
        {
            return new List<object>
            {
                new { id = 1, nombre = "Ene" },
                new { id = 2, nombre = "Feb" },
                new { id = 3, nombre = "Mar" },
                new { id = 4, nombre = "Abr" },
                new { id = 5, nombre = "May" },
                new { id = 6, nombre = "Jun" },
                new { id = 7, nombre = "Jul" },
                new { id = 8, nombre = "Ago" },
                new { id = 9, nombre = "Sep" },
                new { id = 10, nombre = "Oct" },
                new { id = 11, nombre = "Nov" },
                new { id = 12, nombre = "Dic" }
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

        public decimal? CalcularDepreciacionAcumulada(ActivoFijo activo, DateTime fechaProceso, int? categoria, decimal? porcentaje)
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

        public async Task<IEnumerable<DepreciacionDto>> GetReporteDepreciacionAsync(int anio, int? mes, int? activoFijoId = null)
        {
            var query = _context.Depreciaciones
                .Include(d => d.ActivoFijo)
                .ThenInclude(a => a.TipoActivo)  
                .Where(d => d.AnioProceso == anio && d.ActivoFijo.FechaAdquisicion <= DateTime.Now);

            if (mes.HasValue)
                query = query.Where(d => d.MesProceso == mes.Value);

            if (activoFijoId.HasValue)
                query = query.Where(d => d.ActivoFijoId == activoFijoId.Value);

            var result = await query.ToListAsync();

            return result.Select(d => new DepreciacionDto
            {
                Id = d.Id,
                Anio = d.AnioProceso,
                Mes = d.MesProceso,
                FechaProceso = d.FechaProceso,
                ActivoFijoId = d.ActivoFijoId,
                MontoDepreciado = d.MontoDepreciado,
                DepreciacionAcumulada = d.DepreciacionAcumulada,
                CuentaCompra = d.CuentaCompra,
                CuentaDepreciacion = d.CuentaDepreciacion,
                FechaCreacion = d.FechaCreacion
            });
        }

        public async Task<IEnumerable<AsientoActivoFijoDto>> GetAsientosContablesAsync(int anio, int? mes, int? tipoActivoId = null)
        {
            var query = _context.Depreciaciones
                .Include( d => d.ActivoFijo)
                .ThenInclude(a => a.TipoActivoId)
                .Where(d => d.Anio == anio && d.ActivoFijo.Estado && d.ActivoFijo.TipoActivo.Activo);

            if (mes.HasValue)
                query = query.Where(d => d.MesProceso == mes.Value);

            if (tipoActivoId.HasValue)
                query = query.Where(d => d.ActivoFijo.TipoActivoId == tipoActivoId.Value);

            var result = await query.ToListAsync();

            return result.Select(d => new AsientoActivoFijoDto
            {
                TipoMovimiento = d.TipoMovimiento,
                FechaProceso = d.FechaProceso,
                TipoActivoId = d.ActivoFijo.TipoActivoId,
                FechaCreacion = d.FechaCreacion,
                CuentaCompra = d.CuentaCompra,
                CuentaDepreciacion = d.CuentaDepreciacion,
                MontoDepreciado = d.MontoDepreciado,
                DepreciacionAcumulada = d.DepreciacionAcumulada
            });
        }

        
        }
    }

