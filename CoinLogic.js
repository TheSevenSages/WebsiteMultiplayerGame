let all_coins = [];

// Establishes the connection with the coinHub
var coin_connection = new signalR.HubConnectionBuilder().withUrl(api_url + 'coinHub', {
    withCredentials: false
}).build();

coin_connection.start();
coin_connection.on("ServerSentUpdate", (UpdatedCoins) => {
    try
    {
        all_coins = UpdatedCoins;
    }
    catch (error)
    {
        console.error("Error updating coins:", error);
    }
});

function coin_main()
{
    if(myself.id != -1)
    {
        for (i = 0; i < all_coins.length; i++)
        {
            var coin = all_coins[i];
            // Distance between the player and the coin
            var distance = Math.sqrt(Math.pow(myself.position.x - coin.position.x, 2) + Math.pow(myself.position.y - coin.position.y, 2))
            if(distance < myself.size + coin.size)
            {
                coin_connection.invoke("CollectCoin", myself.id, coin.id);
                var audio = new Audio('CoinGet.mp3');
                audio.play();
            }
        }
    }
}