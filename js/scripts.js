let pokemonRepository = (function() {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
  let modalContainer = document.querySelector('#modal-container');

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
          showModal(
            pokemon.name,
            'Type: '+ pokemon.types+'\n'+
            'Height: '+pokemon.height+'\n'+
            'Weight: '+pokemon.weight+'\n',
            pokemon.imageUrl
        ); 
          console.log(pokemon);
      });
  }

  function buttonClick(button, pokemon) {
      button.addEventListener('click', function(event) {
          showDetails(pokemon);
      });
  }

  function addListItem(pokemon) {
      let pokemonListElement = document.querySelector('.list-group');
      let listItem = document.createElement('li');
      let button = document.createElement('button');
      button.setAttribute('data-toggle','modal')
      button.setAttribute('data-target','#modal-container')
      button.classList.add('list-group-item');

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
  
  function loadTypes(item){
    returntypes = "";
    item.forEach(function(row){
        returntypes += row.type.name + ", ";
    })
    
    return returntypes.substring(0, returntypes.length - 2);
  }


  function loadDetails(item) {
      let url = item.detailsUrl;
      return fetch(url).then(function(response) {
          return response.json();
      }).then(function(details) {
          item.imageUrl = details.sprites.front_default;
          item.types = loadTypes(details.types);
          item.height = details.height;
          item.weight = details.weight;
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
      let pokemonListElement = document.querySelector('.list-group');
      pokemonListElement.innerHTML = '';
      // Add sorted list items
      pokemonRepository.getAll().forEach(function(pokemon) {
          pokemonRepository.addListItem(pokemon);
      });
  }


function showModal(title, text, img) {
    // Clear all existing modal content
    modalContainer.innerHTML = '';
  
    let modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'pokemonCardModal');
    modal.setAttribute('aria-hidden', 'true');
  
    let modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog');
    modalDialog.setAttribute('role', 'document');
  
    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
  
    let modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
  
    let titleElement = document.createElement('h5');
    titleElement.classList.add('modal-title');
    titleElement.setAttribute('id', 'pokemonCardModal');
    titleElement.innerText = title;
  
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('close');
    closeButtonElement.setAttribute('type', 'button');
    closeButtonElement.setAttribute('data-dismiss', 'modal');
    closeButtonElement.setAttribute('aria-label', 'Close');
    closeButtonElement.innerHTML = '<span aria-hidden="true">&times;</span>';
  
    modalHeader.appendChild(titleElement);
    modalHeader.appendChild(closeButtonElement);
  
    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
  
    let contentElement = document.createElement('p');
    contentElement.innerText = text;
  
    let imageElement = document.createElement("img");
    imageElement.setAttribute("src", img);
    imageElement.setAttribute("width", "304");
    imageElement.setAttribute("height", "228");
    imageElement.setAttribute("alt", "Pokemon Sprite");
  
    modalBody.appendChild(contentElement);
    modalBody.appendChild(imageElement);
  
    let modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
  
    let closeButtonFooter = document.createElement('button');
    closeButtonFooter.classList.add('btn', 'btn-secondary');
    closeButtonFooter.setAttribute('type', 'button');
    closeButtonFooter.setAttribute('data-dismiss', 'modal');
    closeButtonFooter.innerText = 'Close';
  
    modalFooter.appendChild(closeButtonFooter);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    modalContainer.appendChild(modal);
  
    $(modal).modal('show');
  }

  return {
      add: add,
      getAll: getAll,
      showDetails: showDetails,
      addListItem: addListItem,
      loadList: loadList
  };
})();

// Load the list of Pokémon
pokemonRepository.loadList();
