function XPosToScreenSpace(world_unit)
{
    var holder = world_unit + 100;
    holder = holder / 200;
    holder = holder * canvas.width;

    return holder;
    // return world_unit;
}

function YPosToScreenSpace(world_unit)
{
    var holder = world_unit / 200;
    holder = holder * canvas.height;

    return holder;
    // return world_unit;
}

function XScaleToScreenSpace(world_unit)
{
    var holder = world_unit / 200;
    holder = holder * canvas.width;

    return holder;
    // return world_unit;
}

function YScaleToScreenSpace(world_unit)
{
    var holder = world_unit / 200;
    holder = holder * canvas.height;

    return holder;
    // return world_unit;
}

