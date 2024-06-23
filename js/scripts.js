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

    //function: add pokemon into the array with the following validation criteria
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




    //function: generates the individual pokemon cards by setting the elements and appending them to the li .list-group
    function addListItem(pokemon) {
        let pokemonListElement = document.querySelector('.list-group');
        let listItem = document.createElement('li');

        let card = document.createElement('div');
        card.classList.add('card');

        // Set the background color based on Pokémon types
        if (pokemon.types.length > 1) {
            let color1 = getTypeColor(pokemon.types[0]);
            let color2 = getTypeColor(pokemon.types[1]);
            card.style.background = `linear-gradient(to right, ${color1} 50%, ${color2} 50%)`;
        } else {
            card.style.backgroundColor = getTypeColor(pokemon.types[0]);
        }

        let imageElement = document.createElement('img');
        imageElement.classList.add('card-img-top', 'pokemon-image');
        imageElement.src = pokemon.imageUrl; // Set the image source to the sprite URL
        imageElement.setAttribute('alt', pokemon.name + ' sprite');

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        let cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = '#' + pokemon.id + '\n' + ' ' + pokemon.name;

        cardBody.appendChild(cardTitle);
        card.appendChild(imageElement);
        card.appendChild(cardBody);
        listItem.appendChild(card);
        pokemonListElement.appendChild(listItem);

        buttonClick(card, pokemon);
    }

    //function: helper function to set the background-color of the individual cards in addListItem
    function getTypeColor(type) {
        const typeColors = {
            bug: '#afd354',
            dark: '#545177',
            dragon: '#394fba',
            electric: '#fcfa74',
            fairy: '#e198f9',
            fighting: '#823746',
            fire: '#efad3b',
            flying: '#7da6e0',
            ghost: '#6e54af',
            grass: '#36874f',
            ground: '#894c34',
            ice: '#82d3e0',
            normal: '#e0e0e0',
            poison: '#7f429b',
            psychic: '#d86584',
            rock: '#999999',
            steel: '#566d89',
            water: '#226ccc',
        };
        return typeColors[type] || 'white'; // Default to gray if type not found
    }

    //function: renders the list of cards for every pokemon available from the api (up to 151 currently)
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


    //function: loads the pokemon based on the pokeAPi and generate the list of pokemon cards
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

    // function: Function to update API URL and reload list, activate via the next event listener 
    function updateApiUrlAndReload(newUrl) {
        apiUrl = newUrl;
        pokemonList = []; // Clear the current list
        loadList(); 
    }

    // Add event listener to the button with respective IDs
    document.getElementById('gen1').addEventListener('click', function () {
        updateApiUrlAndReload('https://pokeapi.co/api/v2/pokemon/?limit=151');
    });
    document.getElementById('gen2').addEventListener('click', function () {
        updateApiUrlAndReload('https://pokeapi.co/api/v2/pokemon?offset=151&limit=100');
    });
    document.getElementById('gen3').addEventListener('click', function () {
        updateApiUrlAndReload('https://pokeapi.co/api/v2/pokemon?offset=251&limit=134');
    });
    document.getElementById('gen4').addEventListener('click', function () {
        updateApiUrlAndReload('https://pokeapi.co/api/v2/pokemon?offset=386&limit=108');
    });
    document.getElementById('gen5').addEventListener('click', function () {
        updateApiUrlAndReload('https://pokeapi.co/api/v2/pokemon?offset=494&limit=155');
    });
    document.getElementById('gen6').addEventListener('click', function () {
        updateApiUrlAndReload('https://pokeapi.co/api/v2/pokemon?offset=649&limit=72');
    });
    document.getElementById('gen7').addEventListener('click', function () {
        updateApiUrlAndReload('https://pokeapi.co/api/v2/pokemon?offset=721&limit=87');
    });
    document.getElementById('gen8').addEventListener('click', function () {
        updateApiUrlAndReload('https://pokeapi.co/api/v2/pokemon?offset=809&limit=96');
    });
    document.getElementById('gen9').addEventListener('click', function () {
        updateApiUrlAndReload('https://pokeapi.co/api/v2/pokemon?offset=898&limit=127');
    });





    //function: prepares information to be prepared on the modal
    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            item.imageUrl = details.sprites.front_default;
            item.types = item.types = details.types.map(typeInfo => typeInfo.type.name); // Ensure types are stored as an array of strings
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


