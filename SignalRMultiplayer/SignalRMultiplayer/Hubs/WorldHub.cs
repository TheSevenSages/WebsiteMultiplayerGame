using Microsoft.AspNetCore.SignalR;
using SignalRMultiplayer.Data;

namespace SignalRMultiplayer.Hubs
{
    public class WorldHub : Hub
    {
        static public int world_size = 400;
        public Task<int> GetWorldSize()
        {
            return Task.FromResult(world_size);
        }
    }
}
