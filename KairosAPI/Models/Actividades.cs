using System;
using System.Collections.Generic;

namespace KairosAPI.Models;

public partial class Actividades
{
    public int IdActividad { get; set; }

    public int? IdUsuario { get; set; }

    public int? IdLugar { get; set; }

    public DateTime? FechaInicio { get; set; }

    public DateTime? FechaFin { get; set; }

    public int? Pasos { get; set; }

    public decimal? Distancia { get; set; }

    public byte? Calificacion { get; set; }

    public string? Comentarios { get; set; }

    public virtual Lugare? IdLugarNavigation { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
