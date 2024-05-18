
function all_players() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const playerList = document.getElementById('player-list');
    const cartCount = document.getElementById('cart-count');
    const cartList = document.getElementById('cart-list');

    fetchPlayers('L', 10);

    searchButton.addEventListener('click', () => {
        const playerName = searchInput.value;
        if (playerName === '') return;
        fetchPlayers(playerName);
    });
}

function fetchPlayers(playerName) {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`)
        .then(res => res.json())
        .then(data => {
            displayPlayers(data.player);
        });
}

function displayPlayers(players) {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = '';
    players.slice(0, 10).forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.classList.add('player-item');
        playerItem.innerHTML = `
            <h3>${player.strPlayer}</h3>
            <p>Nationality: ${player.strNationality}</p>
            <p>Sport: ${player.strSport}</p>
            <img src="${player.strThumb}" alt="${player.strPlayer}">
            <button class="add-to-cart-button" data-player-id="${player.idPlayer}">Add to Cart</button>
            <button class="show-details-button" data-player-id="${player.idPlayer}">Details</button>
        `;
        playerList.appendChild(playerItem);
    });

    playerList.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', () => {
            const playerId = button.dataset.playerId;
            addToCart(playerId);
        });
    });

    playerList.querySelectorAll('.show-details-button').forEach(button => {
        button.addEventListener('click', () => {
            const playerId = button.dataset.playerId;
            showPlayerDetails(playerId);
        });
    });
}

function addToCart(playerId) {
    const cartList = document.getElementById('cart-list');
    const cartCount = document.getElementById('cart-count');
    if (cartList.children.length >= 11) {
        alert("You already have 11 players");
        return;
    }

    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
        .then(res => res.json())
        .then(data => {
            const player = data.players[0];
            const playerName = player.strPlayer;
            const playerItem = document.createElement('li');
            playerItem.textContent = playerName;
            cartList.appendChild(playerItem);

            cartCount.textContent = cartList.children.length;
        });
}

function showPlayerDetails(playerId) {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
        .then(res => res.json())
        .then(data => {
            const player = data.players[0];
            const playerDetails = document.getElementById('player-details');
            const playerDetailsOverlay = document.getElementById('player-details-frist');
            const socialMediaIcons = `
                <div class="social-media">
                    <a href="${player.strFacebook}" target="_blank"><i class="fab fa-facebook">facebook</i></a>
                    <a href="${player.strTwitter}" target="_blank"><i class="fab fa-twitter">twitter</i></a>
                </div>
            `;

            playerDetails.innerHTML = `
                <h2>${player.strPlayer}</h2>
                <p>Id: ${player.idPlayer}</p>
                <p>Nationality: ${player.strNationality}</p>
                <p>Sport: ${player.strSport}</p>
                <p>Salary: ${player.strSalary || 'N/A'}</p>
                <p>Description: ${player.strDescriptionEN.slice(0, 10)}</p>
                <img src="${player.strThumb}" alt="${player.strPlayer}">
                ${socialMediaIcons}
                <button id="close-details-button">Close</button>
            `;
            playerDetails.style.display = 'block';
            playerDetailsOverlay.style.display = 'block';

          
            const closeButton = document.getElementById('close-details-button');
            closeButton.addEventListener('click', closeDetails);
        });
}

function closeDetails() {
    const playerDetails = document.getElementById('player-details');
    const playerDetailsOverlay = document.getElementById('player-details-frist');
    playerDetails.innerHTML = '';
    playerDetails.style.display = 'none';
    playerDetailsOverlay.style.display = 'none';
}


all_players();
