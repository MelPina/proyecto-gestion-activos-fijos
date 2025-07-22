namespace ActivosFijosAPI.DTOs
{
    public class UsuarioDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int IdSistemaAuxiliar { get; set; }
        public DateTime FechaCreacion { get; set; }
    }

    public class CreateUsuarioDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int IdSistemaAuxiliar { get; set; }
    }

    public class UpdateUsuarioDto
    {
        public string? Nombre { get; set; }
        public string? Email { get; set; }
        public int? IdSistemaAuxiliar { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UsuarioDto Usuario { get; set; } = null!;
    }

    public class ValidateTokenDto
    {
        public string Token { get; set; } = string.Empty;
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
