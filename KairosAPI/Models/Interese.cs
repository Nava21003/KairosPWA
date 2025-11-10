using System;
using System.Collections.Generic;

namespace KairosAPI.Models;

public partial class Interese
{
    public int IdInteres { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public virtual ICollection<Usuario> IdUsuarios { get; set; } = new List<Usuario>();
}
