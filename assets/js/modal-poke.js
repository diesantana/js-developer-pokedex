const fade = document.querySelector('#fade-pokemon');
const modal = document.querySelector('#modal-pokemon');

// Cria a estrutura do pokemon 
function getPokemonDetails(pokemon) {
    return `
    <div class="pokemon ${pokemon.typePrincipal}">

        <!-- modal header -->
        <div class="modal-header">
            <div class="pokemon-dados-iniciais">
                <h2 class="name">${pokemon.name}</h2>
                <span class="number">#${pokemon.id}</span>
            </div>

            <div class="detail">
                <ol class="types">
                ${pokemon.types.map((typeCurrent) => `<li class="type ${typeCurrent}">${typeCurrent}</li>`).join('')}
                </ol>
                <img src="${pokemon.img}"
                    alt="${pokemon.name}">
            </div>
        </div>

        <!-- modal body -->
        <div id="modal-body">
            <h3>Sobre</h3>
            <ul>
                <li>Altura: <span class="height-value">${pokemon.altura}</span></li>
                <li>Peso: <span class="weight-value">${pokemon.peso}</span></li>
                <li>Habilidades:
                    <ul class="abilities-list">
                        ${pokemon.habilidades.map((habilidade) => `<li class="abilities-value">${habilidade}</li>`).join('')}
                    </ul>
                </li>
            </ul>
        </div>

    </div>
    `
}


// Busca os dados do Pokemon
function pokeDetails(pokeName) {
    // Crie uma URL com o nome do Pokemon clicado   
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
    const pokemonModal = {
        types: [],
    };

    // Buscando os dados
    return fetch(url)
        .then(response => response.json()).then(pokemonDados => {
            pokemonModal.name = pokemonDados.name;
            pokemonModal.id = pokemonDados.id;
            // mapeando os tipos e retornando um array contendo apenas nomes dos tipos
            const arrayTypes = pokemonDados.types.map((typeSlot) => typeSlot.type.name);
            // Pegando o primeiro type (será o principal)
            const [typePrincipal] = arrayTypes;
            // inserindo os tipos no obj pokemonsDados
            pokemonModal.types = arrayTypes;
            pokemonModal.typePrincipal = typePrincipal;

            pokemonModal.img = pokemonDados.sprites.other.dream_world.front_default;
            pokemonModal.altura = pokemonDados.height;
            pokemonModal.peso = pokemonDados.weight;
            pokemonModal.habilidades = pokemonDados.abilities.map(indice => indice.ability.name);
            const modalConteudo =   getPokemonDetails(pokemonModal);
            return modalConteudo;
        })
}



// Exibe e esconde o fade e modal
function toggleModal() {
    modal.classList.toggle('hide');
    fade.classList.toggle('hide');
}

// Função para lidar com o clique em um card de Pokémon
async function handlePokemonClick(event) {
    // Captura o elemento clicado
    const clickedElement = event.target;
    // Verifica se o elemento clicado é um li.pokemon
    const pokemonCard = clickedElement.closest('li.pokemon');

    // Se um li.pokemon foi encontrado
    if (pokemonCard) {
        console.log('Card completo:', pokemonCard);
        // Chamando a função que mostra e esconde o modal
        toggleModal();

        // acessando o nome do Pokemon clicado. 
        const nameElement = pokemonCard.querySelector('.name');
        const pokemonName = nameElement.textContent;
        modal.innerHTML = '';
        const modalConteudo = await pokeDetails(pokemonName);
        modal.innerHTML = modalConteudo;
    }
}

// Verifica se o elemento clicado é o fade
document.addEventListener('click', event => {
    if(event.target === fade){
        toggleModal();
    }
})

// Adicione um evento de clique ao ícone de "X" para fechar o modal
const closeFadeIcon = document.querySelector('#close-fade');
closeFadeIcon.addEventListener('click', toggleModal);

// Adicione um evento de clique ao documento para lidar com todos os cliques
document.addEventListener('click', handlePokemonClick);
