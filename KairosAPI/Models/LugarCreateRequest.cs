using System.ComponentModel.DataAnnotations;

namespace KairosAPI.Models
{
    public class LugarCreateRequest
    {
        [Required(ErrorMessage = "El nombre del lugar es obligatorio.")]
        [MaxLength(150)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "La categoría es obligatoria.")]
        public int IdCategoria { get; set; }

        [Required(ErrorMessage = "La latitud es obligatoria.")]
        [Range(-90.0, 90.0, ErrorMessage = "Latitud inválida.")]
        public decimal Latitud { get; set; }

        [Required(ErrorMessage = "La longitud es obligatoria.")]
        [Range(-180.0, 180.0, ErrorMessage = "Longitud inválida.")]
        public decimal Longitud { get; set; }

        [MaxLength(255)]
        public string? Direccion { get; set; }

        [MaxLength(100)]
        public string? Horario { get; set; }

        [MaxLength(255)]
        public string? Imagen { get; set; }

        public bool EsPatrocinado { get; set; } = false;
    }
}
