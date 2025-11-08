namespace KairosAPI.Models
{
    public class LugarFiltros
    {
        public decimal? Latitud { get; set; }

        public decimal? Longitud { get; set; }

        public int? RadioKm { get; set; }

        public int? IdCategoria { get; set; }

        public string? TerminoBusqueda { get; set; }

        public int Pagina { get; set; } = 1;

        public int TamanoPagina { get; set; } = 20;
    }
}
