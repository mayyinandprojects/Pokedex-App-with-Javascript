let pokemonRepository = (function() {
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

    function add(pokemon) {
        if (typeof pokemon === 'object' && pokemon !== null) {
            pokemonList.push(pokemon);
        } else {
            console.log('Only objects can be added');
        }
    }
    
      function getAll() {
        return pokemonList;
      }
    
      return {
        add: add,
        getAll: getAll
      };
})();


//testing add function
pokemonRepository.add({
    id: 4, 
    name: 'Charmander',
    type: ['Fire'],
    height: 0.6
});
pokemonRepository.add('Pikachu');
console.log(pokemonRepository.getAll());

//forEachfunction - list all pokemon's name and exclaim if height > 6
pokemonRepository.getAll().forEach( pokemon => {
    document.write(pokemon.name)
        if (pokemon.height > 6) {
                document.write(" - Wow, that\'s Big!");
                }
    document.write("</br>");
} );

//testing filter function
const result = pokemonRepository.getAll().filter((pokemon) => pokemon.name.length > 8);
console.log(result);
