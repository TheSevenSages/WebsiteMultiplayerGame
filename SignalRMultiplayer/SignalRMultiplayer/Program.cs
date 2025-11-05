using SignalRMultiplayer.Hubs;
using SignalRMultiplayer.Services;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddHostedService<Updater>();

// ******************************************************
// ** 1. Add CORS services to the service container. **
// ******************************************************
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          // For development, you can allow any origin.
                          // For production, you should restrict this to your front-end's URL.
                          policy.AllowAnyOrigin()
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});
// The server is explicitly configured for HTTP on 8080:
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // This Listen call defaults to HTTP
    serverOptions.Listen(IPAddress.Any, 8080);
});

var app = builder.Build();

app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapHub<PlayerHub>("/playerHub");
app.MapHub<CoinHub>("/coinHub");
app.MapHub<WorldHub>("/worldHub");

app.Run();
