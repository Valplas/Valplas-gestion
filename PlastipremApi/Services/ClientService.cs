using Microsoft.EntityFrameworkCore;
using Valplas.Models;
using Valplas.Data;

namespace Valplas.Services;

public class ClientService
{
    private readonly ValplasContext _context;

    public ClientService(ValplasContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<ClientModel>> GetAll()
    {
        return await _context
        .Clients.AsNoTracking()
        .Where(c => !c.IsDeleted)
        .OrderBy(c => c.ClientName ?? string.Empty)
        .ThenBy(c => c.ClientDate ?? DateTime.MinValue) // Ordena por fecha de creación si hay empate
        .ToListAsync();
    }

    // Obtener un cliente por su ID
    public async Task<ClientModel?> GetById(Guid id)
    {
        return await _context.Clients.AsNoTracking().FirstOrDefaultAsync(c => c.ClientID == id);
    }


    // Crear un nuevo cliente
    public async Task<ClientModel> Create(ClientModel client)
    {
        client.ClientID = Guid.NewGuid(); // Genera un nuevo ID
        _context.Clients.Add(client);
        await _context.SaveChangesAsync();
        return client;
    }

    // Actualizar un cliente existente
    public async Task<bool> Update(Guid id, ClientModel updatedClient)
    {
        var existingClient = await _context.Clients.FindAsync(id);
        if (existingClient == null)
        {
            return false;
        }

        existingClient.ClientName = updatedClient.ClientName;
        existingClient.ClientSurname = updatedClient.ClientSurname;
        existingClient.ClientType = updatedClient.ClientType;
        existingClient.ClientNumber = updatedClient.ClientNumber;
        existingClient.ClientAddress = updatedClient.ClientAddress;
        existingClient.ClientLocality = updatedClient.ClientLocality;
        existingClient.ClientNotes = updatedClient.ClientNotes;
        existingClient.ClientWorkingHours = updatedClient.ClientWorkingHours;
        existingClient.ClientPoint = updatedClient.ClientPoint;
        existingClient.ClientPhone = updatedClient.ClientPhone;
        existingClient.ClientAlternativePhone = updatedClient.ClientAlternativePhone;
        existingClient.ClientEmail = updatedClient.ClientEmail;
        existingClient.ClientCUIT = updatedClient.ClientCUIT;
        existingClient.ClientTaxCondition = updatedClient.ClientTaxCondition;
        existingClient.ClientFont = updatedClient.ClientFont;
        existingClient.ClientDate = updatedClient.ClientDate;

        _context.Entry(existingClient).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return true;
    }

    // Eliminar un cliente
    public async Task<bool> Delete(Guid id)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null)
        {
            return false;
        }

        client.IsDeleted = true;
        _context.Clients.Update(client);
        await _context.SaveChangesAsync();

        return true;
    }
}