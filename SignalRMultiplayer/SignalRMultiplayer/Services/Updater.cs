
using Microsoft.AspNetCore.SignalR;
using SignalRMultiplayer.Data;
using SignalRMultiplayer.Hubs;

namespace SignalRMultiplayer.Services
{
    public class Updater : BackgroundService
    {
        private readonly IHubContext<PlayerHub> hubContext;
        private readonly ILogger<Updater> logger;

        public Updater(IHubContext<PlayerHub> _hubContext, ILogger<Updater> _logger)
        {
            hubContext = _hubContext;
            logger = _logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Updater is running.");

            // Send an initial update before beginning the timer
            await SendUpdate();

            using PeriodicTimer timer = new PeriodicTimer(TimeSpan.FromMilliseconds(16));
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
            // NOTE: This just notifies the clients that we'd like an update, there is NO GUARANTEE that the updates will come before we send out our 
            // Notifies the clients that the server would like an update
            await hubContext.Clients.All.SendAsync("ServerRequestedUpdate");

            // Sends an updated list of all current players to every client
            await hubContext.Clients.All.SendAsync("ServerSentUpdate", PlayerManager.players);
        }
    }
}
