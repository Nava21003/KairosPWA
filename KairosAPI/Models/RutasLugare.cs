using System;
using System.Collections.Generic;

namespace KairosAPI.Models;

public partial class RutasLugare
{
    public int IdRuta { get; set; }

    public int IdLugar { get; set; }

    public int? Orden { get; set; }

    public virtual Lugare IdLugarNavigation { get; set; } = null!;

    public virtual Ruta IdRutaNavigation { get; set; } = null!;
}
