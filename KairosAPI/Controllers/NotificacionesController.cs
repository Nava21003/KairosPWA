using KairosAPI.Data;
using KairosAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KairosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificacionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificacionesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{idUsuario}")]
        public async Task<ActionResult<IEnumerable<Notificacione>>> GetNotificacionesUsuario(int idUsuario)
        {
            return await _context.Notificaciones
                .Where(n => n.IdUsuario == idUsuario)
                .OrderByDescending(n => n.FechaEnvio)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Notificacione>> PostNotificacion(Notificacione notificacion)
        {
            notificacion.FechaEnvio = DateTime.Now;
            _context.Notificaciones.Add(notificacion);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNotificacionesUsuario), new { idUsuario = notificacion.IdUsuario }, notificacion);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotificacion(int id)
        {
            var notificacion = await _context.Notificaciones.FindAsync(id);
            if (notificacion == null) return NotFound();
            _context.Notificaciones.Remove(notificacion);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
