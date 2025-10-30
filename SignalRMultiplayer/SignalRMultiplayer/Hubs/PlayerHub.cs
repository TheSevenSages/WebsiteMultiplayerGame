using Microsoft.AspNetCore.SignalR;
using SignalRMultiplayer.Data;

namespace SignalRMultiplayer.Hubs
{
    public class PlayerHub : Hub
    {
        // Lifecycle Functions (GET, PUSH, DELETE)
        public Task<Player> AddPlayer()
        {
            Player new_player = new Player();
            new_player.id = ++PlayerManager.total_session_players;

            PlayerManager.players.Add(new_player);

            return Task.FromResult(new_player);
        }

        public Task<int> RemovePlayerByID(int id)
        {
            var player = PlayerManager.players.Find(x => x.id == id);
            if (player == null)
            {
                throw new HubException($"Failed to delete player with id {id}: player not found");
            }
            PlayerManager.players.Remove(player);

            return Task.FromResult(id);
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
