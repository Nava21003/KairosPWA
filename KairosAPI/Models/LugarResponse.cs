namespace KairosAPI.Models
{
    public class LugarResponse
    {
        public int IdLugar { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int IdCategoria { get; set; }
        public string? NombreCategoria { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public string? Direccion { get; set; }
        public string? Horario { get; set; }
        public string? Imagen { get; set; }
        public bool EsPatrocinado { get; set; }
        public bool Estatus { get; set; }
    }
}
