using KairosAPI.Data;
using KairosAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KairosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActividadesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActividadesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{idUsuario}")]
        public async Task<ActionResult<IEnumerable<Actividades>>> GetByUsuario(int idUsuario)
        {
            return await _context.Actividades
                .Include(a => a.IdLugarNavigation)
                .Where(a => a.IdUsuario == idUsuario)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Actividades>> PostActividad(Actividades actividad)
        {
            _context.Actividades.Add(actividad);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetByUsuario), new { idUsuario = actividad.IdUsuario }, actividad);
        }
    }
}
