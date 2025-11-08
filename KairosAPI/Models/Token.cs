using System;

namespace KairosAPI.Models
{
    public partial class Token
    {
        public int IdToken { get; set; }
        public int IdUsuario { get; set; }
        public string Token1 { get; set; } = null!;
        public string Tipo { get; set; } = null!;
        public DateTime? FechaRegistro { get; set; }

        public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
    }
}
