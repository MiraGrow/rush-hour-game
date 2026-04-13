// js/board.js - 보드 렌더링 로직

function renderBoard(gameState) {
    const boardEl = $('#board');
    boardEl.innerHTML = '';

    for (let y = 0; y < GAME_CONFIG.BOARD_SIZE; y++) {
        for (let x = 0; x < GAME_CONFIG.BOARD_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (x === GAME_CONFIG.EXIT_POS && y === 2) {
                cell.classList.add('exit');
            }

            boardEl.appendChild(cell);
        }
    }

    gameState.vehicles.forEach(vehicle => {
        renderVehicle(vehicle, gameState.selectedVehicle);
    });
}

function renderVehicle(vehicle, selectedVehicle) {
    const boardEl = $('#board');
    const vehicleEl = document.createElement('div');
    vehicleEl.className = `vehicle ${vehicle.color}`;
    
    if (selectedVehicle && vehicle.id === selectedVehicle.id) {
        vehicleEl.classList.add('selected');
    }

    vehicleEl.textContent = vehicle.id;
    vehicleEl.dataset.vehicleId = vehicle.id;

    if (vehicle.direction === 'horizontal') {
        vehicleEl.style.width = `${vehicle.length * GAME_CONFIG.CELL_SIZE + (vehicle.length - 1) * GAME_CONFIG.CELL_GAP}px`;
        vehicleEl.style.height = `${GAME_CONFIG.CELL_SIZE}px`;
    } else {
        vehicleEl.style.width = `${GAME_CONFIG.CELL_SIZE}px`;
        vehicleEl.style.height = `${vehicle.length * GAME_CONFIG.CELL_SIZE + (vehicle.length - 1) * GAME_CONFIG.CELL_GAP}px`;
    }

    const left = GAME_CONFIG.BOARD_PADDING + vehicle.x * (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP);
    const top = GAME_CONFIG.BOARD_PADDING + vehicle.y * (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP);
    vehicleEl.style.left = `${left}px`;
    vehicleEl.style.top = `${top}px`;

    boardEl.appendChild(vehicleEl);
}

function updateMoveCounter(moveCount) {
    $('#moveCount').textContent = moveCount;
}

function showRulesModal() {
    $('#rulesModal').classList.add('show');
}

function hideRulesModal() {
    $('#rulesModal').classList.remove('show');
}

function showClearModal(moveCount) {
    $('#finalMoveCount').textContent = moveCount;
    $('#starRating').textContent = calculateStars(moveCount);
    $('#clearModal').classList.add('show');
}

function hideClearModal() {
    $('#clearModal').classList.remove('show');
}
