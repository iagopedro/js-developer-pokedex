const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.querySelector(".modal");
const modalContent = document.getElementById("pokemonDetails");


const maxRecords = 151
const limit = 10
let offset = 0;



window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



// Chamar função que vai pegar os dados de um Pokemon

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onClick="handlePokemonClick(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

const handlePokemonClick = async (id) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await res.json();
    loadPokemonInfo(pokemon);
}

function loadPokemonInfo(pokemon) {
    modal.style.display = "block";

    const selectedPokemon = convertPokeApiDetailToPokemon(pokemon);
    
    modalContent.innerHTML = `
        <span class="close">×</span>
        <span class="number">#${selectedPokemon.number}</span>
        <span class="name">${selectedPokemon.name}</span>

        <div class="detail">
            <ol class="types">
            ${selectedPokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            
            <img src="${selectedPokemon.photo}"
            alt="${selectedPokemon.name}">
        </div>
    `
    
    const span = document.querySelector(".close");

    span.onclick = function () {
        modal.style.display = "none";
    }
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})