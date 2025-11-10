using System.ComponentModel.DataAnnotations;

namespace KairosAPI.Models
{
    public class LugarUpdateRequest
    {
        [MaxLength(150)]
        public string? Nombre { get; set; }

        [MaxLength(500)]
        public string? Descripcion { get; set; }

        public int? IdCategoria { get; set; }

        [Range(-90.0, 90.0, ErrorMessage = "Latitud inválida.")]
        public decimal? Latitud { get; set; }

        [Range(-180.0, 180.0, ErrorMessage = "Longitud inválida.")]
        public decimal? Longitud { get; set; }

        [MaxLength(255)]
        public string? Direccion { get; set; }

        [MaxLength(100)]
        public string? Horario { get; set; }

        [MaxLength(255)]
        public string? Imagen { get; set; }

        public bool? EsPatrocinado { get; set; }

        public bool? Estatus { get; set; }
    }
}
