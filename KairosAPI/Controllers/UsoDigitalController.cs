using KairosAPI.Data;
using KairosAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KairosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsoDigitalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsoDigitalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{idUsuario}")]
        public async Task<ActionResult<IEnumerable<UsoDigital>>> GetByUsuario(int idUsuario)
        {
            return await _context.UsoDigitals
                .Where(u => u.IdUsuario == idUsuario)
                .OrderByDescending(u => u.FechaRegistro)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<UsoDigital>> PostUsoDigital(UsoDigital usoDigital)
        {
            usoDigital.FechaRegistro = DateOnly.FromDateTime(DateTime.Now);
            _context.UsoDigitals.Add(usoDigital);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetByUsuario), new { idUsuario = usoDigital.IdUsuario }, usoDigital);
        }
    }
}
