using Microsoft.AspNetCore.SignalR;
using SignalRMultiplayer.Data;

namespace SignalRMultiplayer.Hubs
{
    public class PlayerHub : Hub
    {
        // Lifecycle Functions (GET, PUSH, DELETE)
        public override async Task OnConnectedAsync()
        {
            Player new_player = new Player(++PlayerManager.total_session_players);

            PlayerManager.connection_player_map[Context.ConnectionId] = new_player.id;
            PlayerManager.players.Add(new_player);

            await Clients.Caller.SendAsync("ConnectionEstablished", new_player);

            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Remove player from PlayerManager
            try
            {
                var player_id = PlayerManager.connection_player_map[Context.ConnectionId];
                var player = PlayerManager.players.Find(x => x.id == player_id);
                if (player == null)
                {
                    throw new HubException($"Failed to delete player with id {player_id}: player not found");
                }
                PlayerManager.players.Remove(player);
                PlayerManager.connection_player_map.Remove(Context.ConnectionId);
            }
            catch(Exception e) 
            {
                Console.Error.WriteLine(e.Message);
            }

            await base.OnDisconnectedAsync(exception);
        }

        // Modifier Functions (PUT)
        public void ChangePosition(int id, float x, float y)
        {
            var player = PlayerManager.players.Find(x => x.id == id);
            if (player == null)
            {
                throw new HubException($"Failed to move player with id {id}: player not found");
            }
            var position = player.position;
            position.x = x;
            position.y = y;
        }
        public void ChangeColor(int id, int color)
        {
            var player = PlayerManager.players.Find(x => x.id == id);
            if (player == null)
            {
                throw new HubException($"Failed to move player with id {id}: player not found");
            }

            player.color = color;
        }
        public void ChangeDisplayName(int id, string username)
        {
            var player = PlayerManager.players.Find(x => x.id == id);
            if (player == null)
            {
                throw new HubException($"Failed to move player with id {id}: player not found");
            }

            player.username = username;
        }
    }
}
