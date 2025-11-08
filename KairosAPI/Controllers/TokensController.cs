using KairosAPI.Data;
using KairosAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KairosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokensController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TokensController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 GET: api/Tokens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Token>>> GetTokens()
        {
            return await _context.Tokens
                .Include(t => t.IdUsuarioNavigation)
                .ToListAsync();
        }

        // 🔹 GET: api/Tokens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Token>> GetToken(int id)
        {
            var token = await _context.Tokens
                .Include(t => t.IdUsuarioNavigation)
                .FirstOrDefaultAsync(t => t.IdToken == id);

            if (token == null)
                return NotFound();

            return token;
        }

        // 🔹 GET: api/Tokens/usuario/3
        [HttpGet("usuario/{idUsuario}")]
        public async Task<ActionResult<IEnumerable<Token>>> GetTokensByUsuario(int idUsuario)
        {
            var tokens = await _context.Tokens
                .Where(t => t.IdUsuario == idUsuario)
                .Include(t => t.IdUsuarioNavigation)
                .ToListAsync();

            if (tokens == null || tokens.Count == 0)
                return NotFound("No se encontraron tokens para este usuario.");

            return tokens;
        }

        // 🔹 POST: api/Tokens
        [HttpPost]
        public async Task<ActionResult<Token>> PostToken(Token token)
        {
            token.FechaRegistro = DateTime.Now;
            _context.Tokens.Add(token);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetToken), new { id = token.IdToken }, token);
        }

        // 🔹 PUT: api/Tokens/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutToken(int id, Token token)
        {
            if (id != token.IdToken)
                return BadRequest();

            _context.Entry(token).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tokens.Any(e => e.IdToken == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // 🔹 DELETE: api/Tokens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToken(int id)
        {
            var token = await _context.Tokens.FindAsync(id);
            if (token == null)
                return NotFound();

            _context.Tokens.Remove(token);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
