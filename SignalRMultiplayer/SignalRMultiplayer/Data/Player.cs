using System.Numerics;

namespace SignalRMultiplayer.Data
{
    public class Transform
    {
        public float x {  get; set; }
        public float y { get; set; }

        public Transform(float _x, float _y)
        {
            x = _x;
            y = _y;
        }
    }

    public class Player
    {
        public int id { get; set; }
        public string username { get; set; }
        public Transform position { get; set; }
        public int color { get; set; }

        public Player() 
        {
            id = -1;
            username = "Red";
            position = new Transform(0.0f, 0.0f);
            color = 16058127;
        }
    }

    public class PlayerManager
    {
        public static List<Player> players = new List<Player>();
        // A map of connection ID's to player ID's so we can keep track of which connection has which ID
        public static Dictionary<string, int> connection_player_map = new Dictionary<string, int>();
        public static int total_session_players = 0;
    }
}
