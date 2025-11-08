using System;
using System.Collections.Generic;

namespace KairosAPI.Models;

public partial class RegistroClic
{
    public int IdClic { get; set; }

    public int IdPromocion { get; set; }

    public int? IdUsuario { get; set; }

    public DateTime? FechaClic { get; set; }

    public virtual Promocione IdPromocionNavigation { get; set; } = null!;

    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
