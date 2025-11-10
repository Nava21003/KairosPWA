using KairosAPI.Data;
using KairosAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KairosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LugaresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LugaresController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lugare>>> GetLugares()
        {
            return await _context.Lugares
                .Include(l => l.IdCategoriaNavigation)
                .Where(l => l.Estatus == true)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Lugare>> GetLugar(int id)
        {
            var lugar = await _context.Lugares
                .Include(l => l.IdCategoriaNavigation)
                .FirstOrDefaultAsync(l => l.IdLugar == id);
            if (lugar == null) return NotFound();
            return lugar;
        }

        [HttpPost]
        public async Task<ActionResult<Lugare>> PostLugar(Lugare lugar)
        {
            _context.Lugares.Add(lugar);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetLugar), new { id = lugar.IdLugar }, lugar);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutLugar(int id, Lugare lugar)
        {
            if (id != lugar.IdLugar) return BadRequest();
            _context.Entry(lugar).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLugar(int id)
        {
            var lugar = await _context.Lugares.FindAsync(id);
            if (lugar == null) return NotFound();
            lugar.Estatus = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
