function RenderPlayers()
{
    for (var i = 0; i < all_players.length; i++)
        {
            var player = all_players[i];
            var pos_x = XPosToScreenSpace(player.position.x);
            var pos_y = YPosToScreenSpace(player.position.y);
            var scale_x = XScaleToScreenSpace(player.size);
            var scale_y = YScaleToScreenSpace(player.size);
            // Draw Circle
            ctx.beginPath();
            ctx.ellipse(pos_x, pos_y, scale_x, scale_y, 0, 0, 2 * Math.PI);
            ctx.fillStyle = '#' + player.color.toString(16);
            ctx.fill();
            ctx.lineWidth = XScaleToScreenSpace(1);
            ctx.stroke();

            var font_size = XScaleToScreenSpace(player.size / 2);
            // Draw Username
            if (myself.id == player.id)
            {
                ctx.font = `bold ${font_size}pt Arial`;
                myself.size = player.size;
                myself.score = player.score;
            }
            else
            {
                ctx.font = `${font_size}pt Arial`;
            }
            ctx.fillStyle = 'Black';
            ctx.textAlign = 'center';
            ctx.fillText(player.username, pos_x, pos_y - (scale_y / 2) - font_size);
            
            font_size = XScaleToScreenSpace(player.size);
            // Draw Points
            if (myself.id == player.id)
            {
                ctx.font = `bold ${font_size}pt Arial`;
            }
            else
            {
                ctx.font = `${font_size}pt Arial`;
            }
            ctx.fillStyle = 'Black';
            ctx.textAlign = 'center';
            ctx.fillText(player.points, pos_x, pos_y + font_size / 2);
        }
}

function RenderCoins()
{
    for (var i = 0; i < all_coins.length; i++)
        {
            var coin = all_coins[i];
            var pos_x = XPosToScreenSpace(coin.position.x + (coin.size / 2));
            var pos_y = YPosToScreenSpace(coin.position.y - (coin.size / 2));
            var scale_x = XScaleToScreenSpace(coin.size);
            var scale_y = YScaleToScreenSpace(coin.size);
            // Draw Circle
            ctx.beginPath();
            ctx.ellipse(pos_x, pos_y, scale_x, scale_y, 0, 0, 2 * Math.PI);
            ctx.fillStyle = '#' + coin.color.toString(16);
            ctx.fill();
            ctx.lineWidth = XScaleToScreenSpace(1);
            ctx.stroke();

            var font_size = XScaleToScreenSpace(coin.size);
            // Draw value
            ctx.font = `${font_size}pt Arial`;
            ctx.fillStyle = 'Black';
            ctx.textAlign = 'center';
            ctx.fillText(coin.value, pos_x, pos_y + font_size / 2);
        }
}

function Render()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    RenderCoins();
    RenderPlayers();
}