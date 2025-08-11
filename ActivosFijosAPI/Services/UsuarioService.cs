using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ActivosFijosAPI.Data;
using ActivosFijosAPI.Models;
using ActivosFijosAPI.DTOs;

namespace ActivosFijosAPI.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UsuarioService> _logger;

        public UsuarioService(ApplicationDbContext context, IConfiguration configuration, ILogger<UsuarioService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<IEnumerable<UsuarioDto>> GetAllAsync()
        {
            try
            {
                var usuarios = await _context.Usuarios
                    .OrderBy(u => u.Nombre)
                    .ToListAsync();

                return usuarios.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener usuarios");
                throw;
            }
        }

        public async Task<UsuarioDto?> GetByIdAsync(int id)
        {
            try
            {
                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Id == id);

                return usuario != null ? MapToDto(usuario) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener usuario por ID: {Id}", id);
                throw;
            }
        }

        public async Task<UsuarioDto?> GetByEmailAsync(string email)
        {
            try
            {
                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Email == email);

                return usuario != null ? MapToDto(usuario) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener usuario por email: {Email}", email);
                throw;
            }
        }

        public async Task<UsuarioDto> CreateAsync(CreateUsuarioDto createDto)
        {
            try
            {
                var strategy = _context.Database.CreateExecutionStrategy();
                return await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _context.Database.BeginTransactionAsync();
                    try
                    {
                        // Verificar si el email ya existe
                        var existingUser = await _context.Usuarios
                            .FirstOrDefaultAsync(u => u.Email == createDto.Email);

                        if (existingUser != null)
                        {
                            throw new InvalidOperationException("El email ya está registrado");
                        }

                        // Crear hash de la contraseña
                        CreatePasswordHash(createDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

                        var usuario = new Usuario
                        {
                            Nombre = createDto.Nombre,
                            Email = createDto.Email,
                            IdSistemaAuxiliar = createDto.IdSistemaAuxiliar,
                            PasswordHash = passwordHash,
                            PasswordSalt = passwordSalt,
                            FechaCreacion = DateTime.Now
                        };

                        _context.Usuarios.Add(usuario);
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Usuario creado: {Email}", usuario.Email);
                        return MapToDto(usuario);
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
                _logger.LogError(ex, "Error al crear usuario");
                throw;
            }
        }

        public async Task<UsuarioDto> UpdateAsync(int id, UpdateUsuarioDto updateDto)
        {
            try
            {
                var strategy = _context.Database.CreateExecutionStrategy();
                return await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _context.Database.BeginTransactionAsync();
                    try
                    {
                        var usuario = await _context.Usuarios
                            .FirstOrDefaultAsync(u => u.Id == id);

                        if (usuario == null)
                        {
                            throw new InvalidOperationException("Usuario no encontrado");
                        }

                        if (!string.IsNullOrEmpty(updateDto.Nombre))
                            usuario.Nombre = updateDto.Nombre;

                        if (!string.IsNullOrEmpty(updateDto.Email))
                        {
                            // Verificar que el nuevo email no esté en uso
                            var existingUser = await _context.Usuarios
                                .FirstOrDefaultAsync(u => u.Email == updateDto.Email && u.Id != id);

                            if (existingUser != null)
                            {
                                throw new InvalidOperationException("El email ya está en uso");
                            }

                            usuario.Email = updateDto.Email;
                        }

                        if (updateDto.IdSistemaAuxiliar.HasValue)
                            usuario.IdSistemaAuxiliar = updateDto.IdSistemaAuxiliar.Value;

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Usuario actualizado: {Id}", id);
                        return MapToDto(usuario);
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
                _logger.LogError(ex, "Error al actualizar usuario: {Id}", id);
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
                        var usuario = await _context.Usuarios
                            .FirstOrDefaultAsync(u => u.Id == id);

                        if (usuario == null)
                        {
                            return false;
                        }

                        _context.Usuarios.Remove(usuario);
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Usuario eliminado: {Id}", id);
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
                _logger.LogError(ex, "Error al eliminar usuario: {Id}", id);
                throw;
            }
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (usuario == null || !VerifyPasswordHash(loginDto.Password, usuario.PasswordHash, usuario.PasswordSalt))
                {
                    return null;
                }

                var token = CreateToken(usuario);

                return new LoginResponseDto
                {
                    Token = token,
                    Usuario = MapToDto(usuario)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en login para email: {Email}", loginDto.Email);
                throw;
            }
        }

        // public async Task<bool> ValidateTokenAsync(string token)
        // {
        //     try
        //     {
        //         var tokenHandler = new JwtSecurityTokenHandler();
        //         var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "");

        //         tokenHandler.ValidateToken(token, new TokenValidationParameters
        //         {
        //             ValidateIssuerSigningKey = true,
        //             IssuerSigningKey = new SymmetricSecurityKey(key),
        //             ValidateIssuer = false,
        //             ValidateAudience = false,
        //             ClockSkew = TimeSpan.Zero
        //         }, out SecurityToken validatedToken);

        //         return true;
        //     }
        //     catch
        //     {
        //         return false;
        //     }
        // }

        public Task<bool> ValidateTokenAsync(string token)
{
    try
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "");

        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        }, out SecurityToken validatedToken);

        return Task.FromResult(true);
    }
    catch
    {
        return Task.FromResult(false);
    }
}


        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
        {
            try
            {
                var strategy = _context.Database.CreateExecutionStrategy();
                return await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _context.Database.BeginTransactionAsync();
                    try
                    {
                        var usuario = await _context.Usuarios
                            .FirstOrDefaultAsync(u => u.Id == userId);

                        if (usuario == null)
                        {
                            return false;
                        }

                        if (!VerifyPasswordHash(changePasswordDto.CurrentPassword, usuario.PasswordHash, usuario.PasswordSalt))
                        {
                            return false;
                        }

                        CreatePasswordHash(changePasswordDto.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);

                        usuario.PasswordHash = passwordHash;
                        usuario.PasswordSalt = passwordSalt;

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Contraseña cambiada para usuario: {Id}", userId);
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
                _logger.LogError(ex, "Error al cambiar contraseña para usuario: {UserId}", userId);
                throw;
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private static bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512(passwordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(passwordHash);
        }

        private string CreateToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.Nombre)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static UsuarioDto MapToDto(Usuario usuario)
        {
            return new UsuarioDto
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                IdSistemaAuxiliar = usuario.IdSistemaAuxiliar,
                FechaCreacion = usuario.FechaCreacion
            };
        }
    }
}
