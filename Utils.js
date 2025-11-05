let world_size = 100;

var world_connection = new signalR.HubConnectionBuilder().withUrl(api_url + 'worldHub', {
    withCredentials: false
}).build();
world_connection.start().then(async () => {
    const result = await world_connection.invoke("GetWorldSize");
    world_size = result;
    console.log(`World size is: ${world_size}`)
});

function XPosToScreenSpace(world_unit)
{
    var holder = world_unit + (world_size / 2);
    holder = holder / world_size;
    holder = holder * canvas.width;

    return holder;
    // return world_unit;
}

function YPosToScreenSpace(world_unit)
{
    var holder = world_unit / world_size;
    holder = holder * canvas.height;

    return holder;
    // return world_unit;
}

function XScaleToScreenSpace(world_unit)
{
    var holder = world_unit / world_size;
    holder = holder * canvas.width;

    return holder;
    // return world_unit;
}

function YScaleToScreenSpace(world_unit)
{
    var holder = world_unit / world_size;
    holder = holder * canvas.height;

    return holder;
    // return world_unit;
}

