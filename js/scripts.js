let pokemonRepository = (function () {
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

    //function: add pokemon into the array with validation criteria
    function add(pokemon) {
        if (typeof pokemon === 'object' && "name" in pokemon && "id" in pokemon) {
            pokemonList.push(pokemon);
        } else {
            console.log('Only objects with a name and id can be added');
        }
    }

    //function: returns the array
    function getAll() {
        return pokemonList;
    }

    //function: event listener to open the modal when button is clicked
    function buttonClick(button, pokemon) {
        button.addEventListener('click', function (event) {
            showDetails(pokemon);
        });
    }

    //function: generates the buttons by setting the elements and appending them to the li .list-group
    function addListItem(pokemon) {
        let pokemonListElement = document.querySelector('.list-group');
        let listItem = document.createElement('li');

        let button = document.createElement('button');
        button.setAttribute('data-toggle', 'modal')
        button.setAttribute('data-target', '#modal-container')
        button.classList.add('list-group-item');

        let imageElement = document.createElement('img');
        imageElement.classList.add('pokemon-image');
        imageElement.src = pokemon.imageUrl; // Set the image source to the sprite URL

        button.innerText = '#'+ pokemon.id + '\n' + ' '+ pokemon.name; // Add the Pokémon's name
        button.insertBefore(imageElement, button.firstChild);
        listItem.appendChild(button);
        pokemonListElement.appendChild(listItem);

        buttonClick(button, pokemon);
    }

    //function: renders the list of buttons for every pokemon available from the api (up to 151 currently)
    function renderPokemonList() {
        // Clear existing list items
        let pokemonListElement = document.querySelector('.list-group');
        pokemonListElement.innerHTML = '';
        // Add sorted list items
        pokemonRepository.getAll().forEach(function (pokemon) {
            pokemonRepository.addListItem(pokemon);
        });
    }

    //function: extract the ID from the URL (e.g., https://pokeapi.co/api/v2/pokemon/1/ -> 1)
    function extractPokemonId(url) {
        let idMatch = url.match(/\/pokemon\/(\d+)\//);
        return idMatch ? parseInt(idMatch[1]) : null;
    }

    //function: loads the pokemon based on the array and generate the list of pokemon buttons
    function loadList() {
        showLoadingMessage();//display loading message
        //promise to fetch the pokemon details from the url
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            let loadDetailsPromises = [];
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url,
                    id: extractPokemonId(item.url) // Extract the ID from the URL
                };
                add(pokemon);
                loadDetailsPromises.push(loadDetails(pokemon));
            });

            return Promise.all(loadDetailsPromises);
        }).then(function () {
            // Sort the pokemonList by ID, ensure pokemon is not displayed randomly
            pokemonList.sort((a, b) => a.id - b.id);
            hideLoadingMessage();
            renderPokemonList();
        }).catch(function (e) {
            console.error(e);
            hideLoadingMessage();
        });
    }

   //function: prepares information to be prepared on the modal
   function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
        return response.json();
    }).then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.types = loadTypes(details.types);
        item.height = details.height;
        item.weight = details.weight;
    }).catch(function (e) {
        console.error(e);
    });
}
    //function: display the pokemon types properly on the modal
    function loadTypes(item) {
        returntypes = "";
        item.forEach(function (row) {
            returntypes += row.type.name + ", ";
        })

        return returntypes.substring(0, returntypes.length - 2);
    }

    //function: details to be displayed on the modal
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            showModal(
                pokemon.name,
                'Type: ' + pokemon.types + '\n' +
                'Height: ' + pokemon.height + '\n' +
                'Weight: ' + pokemon.weight + '\n',
                pokemon.imageUrl
            );
            console.log(pokemon);
        });
    }

    //function: attach information to the bootstrap modal template on the .html file
    function showModal(title, text, img) {
        let modal = document.querySelector('#exampleModalCenter');
        let modalTitle = modal.querySelector('.modal-title');
        let modalBody = modal.querySelector('.modal-body');
        let modalText = modalBody.querySelector('p');
        let modalImage = modalBody.querySelector('img');

        modalTitle.innerText = title;
        modalText.innerText = text;
        modalImage.src = img;

        // Show the modal
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
