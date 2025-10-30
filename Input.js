// STATES: NONE -> JUSTPRESSED -> HELD -> RELEASED
var key_states = {
    'd': 'NONE',
    'a': 'NONE',
    ' ': 'NONE'
};

window.addEventListener('keydown', (event) => {
    if (key_states[event.key] != 'HELD')
    {
        key_states[event.key] = 'JUSTPRESSED';
    }
});

window.addEventListener('keyup', (event) => {
    key_states[event.key] = 'RELEASED';
});

function UpdateAllKeyStates()
{
    Object.entries(key_states).forEach(([key, value]) => {
        if (value == 'JUSTPRESSED')
        {
            key_states[key] = 'HELD';
        }
        else if (value == "RELEASED")
        {
            key_states[key] = 'NONE';
        }
    });
}
