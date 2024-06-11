let pokemonList = [
    {
        id: 1, 
        name: 'Bulbasaur',
        type: ['grass', 'poison'],
        height: 2.04
    },
    { 
        id: 2,
        name: 'Ivysaur',
        type: ['grass', 'poison'],
        height: 3.03
    },
    { 
        id: 3,
        name: 'Venusaur',
        type: ['grass', 'poison'],
        height: 6.07 
    }
];
// for (let i = 0; i < pokemonList.length; i++) {
//     let pokemon = pokemonList[i];
//     document.write(pokemon.name + " (height: " + pokemon.height + ")");
//     if (pokemon.height > 6) {
//         document.write(" - Wow, that\'s Big!");
//     }
//     document.write("</br>");
// };

pokemonList.forEach( pokemon => {
    document.write(pokemon.name)
        if (pokemon.height > 6) {
                document.write(" - Wow, that\'s Big!");
                }
    document.write("</br>");
} );