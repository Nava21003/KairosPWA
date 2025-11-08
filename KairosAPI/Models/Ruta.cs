using System;
using System.Collections.Generic;

namespace KairosAPI.Models;

public partial class Ruta
{
    public int IdRuta { get; set; }

    public int? IdUsuario { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public string? Estatus { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }

    public virtual ICollection<RutasLugare> RutasLugares { get; set; } = new List<RutasLugare>();
}
