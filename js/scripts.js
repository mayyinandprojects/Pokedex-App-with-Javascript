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
        pokemonList.push(pokemon);
      }
    
      function getAll() {
        return pokemonList;
      }
    
      return {
        add: add,
        getAll: getAll
      };
})();

console.log(pokemonRepository.getAll());

pokemonRepository.getAll().forEach( pokemon => {
    document.write(pokemon.name)
        if (pokemon.height > 6) {
                document.write(" - Wow, that\'s Big!");
                }
    document.write("</br>");
} );


