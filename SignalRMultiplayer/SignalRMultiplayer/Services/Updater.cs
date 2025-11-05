
using Microsoft.AspNetCore.SignalR;
using SignalRMultiplayer.Data;
using SignalRMultiplayer.Hubs;

namespace SignalRMultiplayer.Services
{
    public class Updater : BackgroundService
    {
        private readonly IHubContext<PlayerHub> playerHubContext;
        private readonly IHubContext<CoinHub> coinHubContext;
        private readonly ILogger<Updater> logger;
        private int looptime_ms = 16;

        public Updater(IHubContext<PlayerHub> _playerHubContext, IHubContext<CoinHub> _coinHubContext, ILogger<Updater> _logger)
        {
            playerHubContext = _playerHubContext;
            coinHubContext = _coinHubContext;
            logger = _logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Updater is running.");

            // Send an initial update before beginning the timer
            await SendUpdate();

            using PeriodicTimer timer = new PeriodicTimer(TimeSpan.FromMilliseconds(looptime_ms));
            try
            {
                while (await timer.WaitForNextTickAsync(stoppingToken))
                {
                    await SendUpdate();
                }
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation("Updater is stopping.");
            }
        }

        private async Task SendUpdate()
        {
            // Don't bother with updates if there aren't any players
            if (PlayerManager.players.Count > 0)
            {
                // NOTE: This just notifies the clients that we'd like an update, there is NO GUARANTEE that the updates will come before we send out our 
                // Notifies the clients that the server would like an update
                await playerHubContext.Clients.All.SendAsync("ServerRequestedUpdate");

                // Sends an updated list of all current players to every client
                await playerHubContext.Clients.All.SendAsync("ServerSentUpdate", PlayerManager.players);

                // Updates the internal coin manager
                CoinManager.CoinLoop(looptime_ms / 1000.0f);

                // Sends an updated list of all current coins to every client
                await coinHubContext.Clients.All.SendAsync("ServerSentUpdate", CoinManager.coins);
            }
        }
    }
}
