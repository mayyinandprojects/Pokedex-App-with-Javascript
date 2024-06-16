let pokemonRepository = (function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

  function showLoadingMessage() {
      let loadingMessageElement = document.getElementById('loading-message');
      loadingMessageElement.style.display = 'block';
  }

  function hideLoadingMessage() {
      let loadingMessageElement = document.getElementById('loading-message');
      loadingMessageElement.style.display = 'none';
  }

  function add(pokemon) {
      if (typeof pokemon === 'object' && "name" in pokemon && "id" in pokemon) {
          pokemonList.push(pokemon);
      } else {
          console.log('Only objects with a name and id can be added');
      }
  }
  
  function getAll() {
      return pokemonList;
  }

  function showDetails(pokemon) {
      loadDetails(pokemon).then(function() {
          console.log(pokemon);
      });
  }

  function buttonClick(button, pokemon) {
      button.addEventListener('click', function(event) {
          showDetails(pokemon);
      });
  }

  function addListItem(pokemon) {
      let pokemonListElement = document.querySelector('.pokemon-list');
      let listItem = document.createElement('li');
      let button = document.createElement('button');
      button.classList.add('pokemon-card');

      let imageElement = document.createElement('img');
      imageElement.classList.add('pokemon-image');

      imageElement.src = pokemon.imageUrl; // Set the image source to the sprite URL
      //button.appendChild(imageElement);
      button.innerText = pokemon.name; // Add the Pokémon's name
      button.insertBefore(imageElement, button.firstChild);
      listItem.appendChild(button);
      pokemonListElement.appendChild(listItem);
      buttonClick(button, pokemon);
  }

  function loadList() {
      showLoadingMessage();
      return fetch(apiUrl).then(function(response) {
          return response.json();
      }).then(function(json) {
          let loadDetailsPromises = [];
          json.results.forEach(function(item) {
              let pokemon = {
                  name: item.name,
                  detailsUrl: item.url,
                  id: extractPokemonId(item.url) // Extract the ID from the URL
              };
              add(pokemon);
              loadDetailsPromises.push(loadDetails(pokemon));
          });

          return Promise.all(loadDetailsPromises);
      }).then(function() {
          // Sort the pokemonList by ID
          pokemonList.sort((a, b) => a.id - b.id);
          hideLoadingMessage();
          renderPokemonList(); 
      }).catch(function(e) {
          console.error(e);
          hideLoadingMessage();
      });
  }
  
  function loadDetails(item) {
      let url = item.detailsUrl;
      return fetch(url).then(function(response) {
          return response.json();
      }).then(function(details) {
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.types = details.types;
      }).catch(function(e) {
          console.error(e);
      });
  }

  function extractPokemonId(url) {
      // Extract the ID from the URL (e.g., https://pokeapi.co/api/v2/pokemon/1/ -> 1)
      let idMatch = url.match(/\/pokemon\/(\d+)\//);
      return idMatch ? parseInt(idMatch[1]) : null;
  }

  function renderPokemonList() {
      // Clear existing list items
      let pokemonListElement = document.querySelector('.pokemon-list');
      pokemonListElement.innerHTML = '';
      // Add sorted list items
      pokemonRepository.getAll().forEach(function(pokemon) {
          pokemonRepository.addListItem(pokemon);
      });
  }

  return {
      add: add,
      getAll: getAll,
      showDetails: showDetails,
      addListItem: addListItem,
      loadList: loadList,
      showDetails: showDetails
  };
})();

// Load the list of Pokémon
pokemonRepository.loadList();
