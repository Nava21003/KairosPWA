using System;
using System.Collections.Generic;

namespace KairosAPI.Models;

public partial class UsoDigital
{
    public int IdUsoDigital { get; set; }

    public int? IdUsuario { get; set; }

    public int? TiempoDigitalMinutos { get; set; }

    public DateOnly FechaRegistro { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
