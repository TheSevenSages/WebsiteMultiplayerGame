using SignalRMultiplayer.Hubs;

namespace SignalRMultiplayer.Data
{
    public class Coin
    {
        public int id { get; set; }
        public Transform position { get; set; }
        public int color { get; set; }
        public float size { get; set; }
        public int value { get; set; }
        public float lifetime { get; set; }

        public Coin()
        {
            id = ++CoinManager.total_coins_spawned;
            Random rand = new Random();
            position = new Transform(rand.Next(0, WorldHub.world_size) - (WorldHub.world_size / 2), rand.Next(WorldHub.world_size / 2, WorldHub.world_size));
            color = 16766720;
            size = 15.0f;
            value = 1;
            lifetime = 7.0f;
        }

        public Coin(int _color, float _size, int _value, float _lifetime)
        {
            id = ++CoinManager.total_coins_spawned;
            Random rand = new Random();
            position = new Transform(rand.Next(0, WorldHub.world_size) - (WorldHub.world_size / 2), rand.Next(WorldHub.world_size / 2, WorldHub.world_size));
            color = _color;
            size = _size;
            value = _value;
            lifetime = _lifetime;
        }
    }

    public class CoinManager
    {
        public static List<Coin> coins = new List<Coin>();
        public static int total_coins_spawned = 0;

        // The time in seconds until the next coin is spawned
        private static float time_until_next_spawn = 0.0f;
        public static void CoinLoop(float delta_t)
        {
            time_until_next_spawn -= delta_t;
            if (time_until_next_spawn <= 0.0f)
            {
                Random rand = new Random();
                if (rand.Next(100) < 15)
                {
                    coins.Add(new Coin(6591981, 9.0f, 5, 4.0f));
                }
                if (rand.Next(100) < 40)
                {
                    coins.Add(new Coin(9830425, 12.0f, 3, 6.0f));
                }
                coins.Add(new Coin());

                // Add spikes
                if (rand.Next(100) < 30)
                {
                    Coin new_coin = new Coin(6591981, 20.0f, -100, 10.0f);
                    new_coin.position = new Transform(rand.Next(0, WorldHub.world_size) - (WorldHub.world_size / 2), rand.Next(WorldHub.world_size / 10, WorldHub.world_size * 2 / 3));
                    coins.Add(new_coin);
                }


                time_until_next_spawn = rand.Next(3, 8);
            }

            List<Coin> to_remove = new List<Coin>();
            foreach (var coin in coins)
            {
                coin.size = coin.size * ((coin.lifetime - (delta_t / 4)) / coin.lifetime);
                coin.lifetime -= delta_t;
                if (coin.lifetime <= 0.0f)
                {
                    to_remove.Add(coin);
                }
            }
            foreach (var coin in to_remove)
            {
                coins.Remove(coin);
            }
        }
    }
}
