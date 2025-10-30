"use strict";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const user_id = document.getElementById('UserID');
const username = document.getElementById('username');
const color_picker = document.getElementById('ColorPicker');

const api_url = "http://localhost:5019/playerHub";

var position_prime = {
    x: 0.0,
    y: 0.0
}; // The player's position data the last time this client sent an update to the server

var myself = {id: -1};
var velocity = {
    x: 0.0,
    y: 0.0
};

var connection = new signalR.HubConnectionBuilder().withUrl(api_url, {
    withCredentials: false
}).build();

connection.start().then(async function () {
    console.log("Connected to " + api_url);

    // Initialize this client's data
    const response = await connection.invoke("AddPlayer");

    myself = response;

    // Shallow Copy
    position_prime.x = myself.position.x;
    position_prime.y = myself.position.y;

    user_id.innerHTML = myself.id;
    username.value = myself.username;
    color_picker.value = '#' + myself.color.toString(16);

}).catch(function (err) {
    return console.error(err.toString());
});

window.onload = async () => {
    resizeCanvas();
};

// We have received an update from the server
connection.on("ServerSentUpdate", function (UpdatedPlayers) {
    try
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (var i = 0; i < UpdatedPlayers.length; i++)
        {
            // Draw Circle
            var player = UpdatedPlayers[i];
            ctx.beginPath();
            ctx.ellipse(player.position.x, player.position.y, 10, 10, 0, 0, 2 * Math.PI);
            ctx.fillStyle = '#' + player.color.toString(16);
            ctx.fill();
            ctx.stroke();

            // Draw ID
            // --- 1. Set Styles for Filled Text ---
            ctx.font = 'bold 12pt Arial'
            ctx.fillStyle = 'Black';
            ctx.textAlign = 'center';
            ctx.fillText(player.username, player.position.x, player.position.y);
        }
    }
    catch (error)
    {
        console.error("Error updating players:", error);
    }
});

// We have received an update request from the server
connection.on("ServerRequestedUpdate", () => {
    // If player is uninitialized don't send update
    if (myself.id == -1) { return; }

    // Right now we're only using this to update position, since this is changing a lot and
    // would cause a lot more traffic to the server if we updated it on the server's end everytime it changes.
    UpdateMyPosition();
});


var can_jump = false;
window.requestAnimationFrame(main);
function main() {
    if (myself.id != -1)
    {
        // Placing the floor at y level 100, this is gravity
        if (myself.position.y < 200.0)
        {
            velocity.y -= 9.8 / 60;
        }
        else 
        {
            velocity.y = 0.0;
            can_jump = true;
        }
        
        // Handle player input
        if (key_states['d'] == 'JUSTPRESSED' || key_states['d'] == 'HELD')
        {
            myself.position.x += 2;
        }
        if (key_states['a'] == 'JUSTPRESSED' || key_states['a'] == 'HELD')
        {
            myself.position.x -= 2;
        }
        if (key_states[' '] == 'JUSTPRESSED' && can_jump)
        {
            can_jump = false;
            velocity.y += 5;
        }

        // Update position with velocity
        myself.position.y -= velocity.y;

        UpdateAllKeyStates();
    }
    window.requestAnimationFrame(main);
}

// Updates this player's position on the server
async function UpdateMyPosition()
{
    // Do not send update if the position has not changed significantly
    var deltaX = myself.position.x - position_prime.x;
    var deltaY = myself.position.y - position_prime.y;
    var deltaPos = Math.abs(deltaX) + Math.abs(deltaY);
    if (deltaPos <= 0.5)
    {
        return;
    }
    console.log('UPDATE')

    try
    {
        if (myself.id == -1)
        {
            throw new Error("Player id is invalid");
        }
        await connection.invoke("ChangePosition", myself.id, myself.position.x, myself.position.y);
        position_prime.x = myself.position.x;
        position_prime.y = myself.position.y;
    }
    catch (error)
    {
        console.error("Error moving player:", error);
    }
};

color_picker.addEventListener('change', async (event) => {
    try
    {
        if (myself.id == -1)
        {
            throw new Error("Player id is invalid");
        }
        var new_color = parseInt(color_picker.value.substring(1), 16);
        await connection.invoke("ChangeColor", myself.id, new_color);
    }
    catch (error)
    {
        console.error("Error changing player color:", error);
    }
});

username.addEventListener('change', async (event) => {
    try
    {
        if (myself.id == -1)
        {
            throw new Error("Player id is invalid");
        }
        var new_username = username.value;
        await connection.invoke("ChangeDisplayName", myself.id, new_username);
    }
    catch (error)
    {
        console.Error("Error changing player username:", error);
    }
});