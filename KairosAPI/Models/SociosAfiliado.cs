using System;
using System.Collections.Generic;

namespace KairosAPI.Models;

public partial class SociosAfiliado
{
    public int IdSocio { get; set; }

    public string NombreSocio { get; set; } = null!;

    public decimal? TarifaCpc { get; set; }

    public virtual ICollection<Promocione> Promociones { get; set; } = new List<Promocione>();
}
