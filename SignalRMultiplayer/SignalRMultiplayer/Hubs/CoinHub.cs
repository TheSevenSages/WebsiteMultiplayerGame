using Microsoft.AspNetCore.SignalR;
using SignalRMultiplayer.Data;

namespace SignalRMultiplayer.Hubs
{
    public class CoinHub : Hub
    {
        public void CollectCoin(int player_id, int coin_id)
        {
            try
            {
                // Get Player
                var player = PlayerManager.players.Find(x => x.id == player_id);
                if (player == null)
                {
                    throw new HubException($"Player#{player_id} not found");
                }
                // Get Coin
                var coin = CoinManager.coins.Find(x => x.id == coin_id);
                if (coin == null)
                {
                    throw new HubException($"Coin#{coin_id} not found");
                }
                // Check to make sure they overlap
                // Distance between the coin and the player
                float distance = (float)Math.Sqrt(Math.Pow(player.position.x - coin.position.x, 2) + Math.Pow(player.position.y - coin.position.y, 2));
                if (distance < player.size + coin.size)
                {
                    // Add the coins value to the player's points, and delete the coin
                    player.points += coin.value;
                    player.size += coin.value / 2.0f;
                    CoinManager.coins.Remove(coin);
                }
            }
            catch(Exception e)
            {
                Console.Error.WriteLine($"Player#{player_id} failed to collect coin#{coin_id}: {e.Message}");
            }
        }

    }
}
