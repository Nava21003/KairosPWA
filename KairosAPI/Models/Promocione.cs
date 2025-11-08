using System;
using System.Collections.Generic;

namespace KairosAPI.Models;

public partial class Promocione
{
    public int IdPromocion { get; set; }

    public int IdLugar { get; set; }

    public int? IdSocio { get; set; }

    public string Titulo { get; set; } = null!;

    public string? Descripcion { get; set; }

    public DateTime FechaInicio { get; set; }

    public DateTime FechaFin { get; set; }

    public bool? Estatus { get; set; }

    public virtual Lugare IdLugarNavigation { get; set; } = null!;

    public virtual SociosAfiliado? IdSocioNavigation { get; set; }

    public virtual ICollection<RegistroClic> RegistroClics { get; set; } = new List<RegistroClic>();
}
