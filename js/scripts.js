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

      function showDetails(pokemon){
        console.log(pokemon);

      }

      function onClick(button, pokemon) {
        button.addEventListener('click', function (event) {
          pokemonRepository.showDetails(pokemon);
        });
      }

      function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('pokemon-card');
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
        onClick(button, pokemon); 
      }
    
      return {
        add: add,
        getAll: getAll,
        showDetails: showDetails,
        addListItem: addListItem
      };
})();


//add function
pokemonRepository.add({
    id: 4, 
    name: 'Charmander',
    type: ['Fire'],
    height: 0.6
});
pokemonRepository.add('Pikachu');
console.log(pokemonRepository.getAll());

//forEachfunction - list all pokemon's name and exclaim if height > 6
// pokemonRepository.getAll().forEach( pokemon => {
//     document.write(pokemon.name)
//         if (pokemon.height > 6) {
//                 document.write(" - Wow, that\'s Big!");
//                 }
//     document.write("</br>");
// } );

//filter function
const result = pokemonRepository.getAll().filter((pokemon) => pokemon.name.length > 8);
console.log(result);


//queryselector
pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
});

