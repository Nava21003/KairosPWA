using System;
using System.Collections.Generic;

namespace KairosAPI.Models;

public partial class Categoria
{
    public int IdCategoria { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<Lugare> Lugares { get; set; } = new List<Lugare>();
}
