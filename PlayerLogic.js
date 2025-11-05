"use strict";

const user_id = document.getElementById('UserID');
const username = document.getElementById('username');
const color_picker = document.getElementById('ColorPicker');

let all_players = [];

var position_prime = {
    x: 0.0,
    y: 0.0
}; // The player's position data the last time this client sent an update to the server

var myself = {id: -1};
var velocity = {
    x: 0.0,
    y: 0.0
};

var player_connection = new signalR.HubConnectionBuilder().withUrl(api_url + 'playerHub', {
    withCredentials: false
}).build();

player_connection.start();
player_connection.on("ConnectionEstablished", async function (message) {
    console.log("Connected to " + api_url);

    // Initialize this client's data
    myself = message;

    // Shallow Copy
    position_prime.x = myself.position.x;
    position_prime.y = myself.position.y;

    user_id.innerHTML = myself.id;
    username.value = myself.username;
    color_picker.value = '#' + myself.color.toString(16);
});

window.onload = async () => {
    resizeCanvas();
};

// We have received an update from the server
player_connection.on("ServerSentUpdate", function (UpdatedPlayers) {
    try
    {
        all_players = UpdatedPlayers;
    }
    catch (error)
    {
        console.error("Error updating players:", error);
    }
});

// We have received an update request from the server
player_connection.on("ServerRequestedUpdate", () => {
    // If player is uninitialized don't send update
    if (myself.id == -1) { return; }

    // Right now we're only using this to update position, since this is changing a lot and
    // would cause a lot more traffic to the server if we updated it on the server's end everytime it changes.
    UpdateMyPosition();
});


var can_jump = false;
function player_main() {
    if (myself.id != -1)
    {
        // Placing the floor at y level 100, this is gravity
        if (myself.position.y + myself.size - velocity.y < world_size)
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
            if (myself.position.x + myself.size < (world_size / 2))
            {
                myself.position.x += 2;
            }
        }
        if (key_states['a'] == 'JUSTPRESSED' || key_states['a'] == 'HELD')
        {
            if (myself.position.x - myself.size > -(world_size / 2))
            {
                myself.position.x -= 2;
            }
        }
        if (key_states[' '] == 'JUSTPRESSED' && can_jump)
        {
            can_jump = false;
            var jump_vel = myself.size / 2.0;
            if (jump_vel > 16)
            {
                jump_vel = 16;
            }
            velocity.y += jump_vel;
        }

        // Update position with velocity
        myself.position.y -= velocity.y;

        UpdateAllKeyStates();
    }
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
        await player_connection.invoke("ChangePosition", myself.id, myself.position.x, myself.position.y);
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
        await player_connection.invoke("ChangeColor", myself.id, new_color);
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
        await player_connection.invoke("ChangeDisplayName", myself.id, new_username);
    }
    catch (error)
    {
        console.Error("Error changing player username:", error);
    }
});