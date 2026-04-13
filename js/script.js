// js/script.js - 메인 스크립트 및 이벤트 리스너

function initializeEventListeners() {
    $$('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', handleDifficultyChange);
    });

    $('#restartBtn').addEventListener('click', () => {
        game.start();
    });

    $('#rulesBtn').addEventListener('click', showRulesModal);

    $('#startGameBtn').addEventListener('click', () => {
        hideRulesModal();
        game.start();
    });

    $('#closeModalBtn').addEventListener('click', () => {
        hideClearModal();
        showRulesModal();
    });

    $('#board').addEventListener('mousedown', handleBoardMouseDown);
    $('#board').addEventListener('touchstart', handleBoardTouchStart);
}

function handleDifficultyChange(e) {
    $$('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    game.changeDifficulty(e.target.dataset.difficulty);
}

function handleBoardMouseDown(e) {
    const vehicleEl = e.target.closest('.vehicle');
    if (!vehicleEl) return;

    e.preventDefault();
    const vehicleId = vehicleEl.dataset.vehicleId;
    const vehicle = game.state.vehicles.find(v => v.id === vehicleId);

    if (!vehicle || game.state.isCleared) return;

    game.selectVehicle(vehicle);

    const startX = e.clientX;
    const startY = e.clientY;
    const startVehicleX = vehicle.x;
    const startVehicleY = vehicle.y;

    function handleMouseMove(moveEvent) {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        if (vehicle.direction === 'horizontal' && Math.abs(deltaX) > 10) {
            const newX = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - vehicle.length, 
                startVehicleX + Math.round(deltaX / (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP))));
            
            if (canMoveVehicle(vehicle, newX, vehicle.y, game.state.vehicles)) {
                vehicle.x = newX;
                renderBoard(game.state);
            }
        } else if (vehicle.direction === 'vertical' && Math.abs(deltaY) > 10) {
            const newY = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - vehicle.length,
                startVehicleY + Math.round(deltaY / (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP))));
            
            if (canMoveVehicle(vehicle, vehicle.x, newY, game.state.vehicles)) {
                vehicle.y = newY;
                renderBoard(game.state);
            }
        }
    }

    function handleMouseUp() {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        const moved = vehicle.x !== startVehicleX || vehicle.y !== startVehicleY;

        if (moved) {
            game.state.moveCount++;
            updateMoveCounter(game.state.moveCount);

            if (isGameCleared(game.state.vehicles)) {
                game.state.isCleared = true;
                setTimeout(() => {
                    showClearModal(game.state.moveCount);
                }, 300);
            }
        }

        game.deselectVehicle();
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleBoardTouchStart(e) {
    const vehicleEl = e.target.closest('.vehicle');
    if (!vehicleEl) return;

    e.preventDefault();
    const vehicleId = vehicleEl.dataset.vehicleId;
    const vehicle = game.state.vehicles.find(v => v.id === vehicleId);

    if (!vehicle || game.state.isCleared) return;

    game.selectVehicle(vehicle);

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startVehicleX = vehicle.x;
    const startVehicleY = vehicle.y;

    function handleTouchMove(moveEvent) {
        const touch = moveEvent.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (vehicle.direction === 'horizontal' && Math.abs(deltaX) > 10) {
            const newX = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - vehicle.length,
                startVehicleX + Math.round(deltaX / (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP))));
            
            if (canMoveVehicle(vehicle, newX, vehicle.y, game.state.vehicles)) {
                vehicle.x = newX;
                renderBoard(game.state);
            }
        } else if (vehicle.direction === 'vertical' && Math.abs(deltaY) > 10) {
            const newY = Math.max(0, Math.min(GAME_CONFIG.BOARD_SIZE - vehicle.length,
                startVehicleY + Math.round(deltaY / (GAME_CONFIG.CELL_SIZE + GAME_CONFIG.CELL_GAP))));
            
            if (canMoveVehicle(vehicle, vehicle.x, newY, game.state.vehicles)) {
                vehicle.y = newY;
                renderBoard(game.state);
            }
        }
    }

    function handleTouchEnd() {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);

        const moved = vehicle.x !== startVehicleX || vehicle.y !== startVehicleY;

        if (moved) {
            game.state.moveCount++;
            updateMoveCounter(game.state.moveCount);

            if (isGameCleared(game.state.vehicles)) {
                game.state.isCleared = true;
                setTimeout(() => {
                    showClearModal(game.state.moveCount);
                }, 300);
            }
        }

        game.deselectVehicle();
    }

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
}

window.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    showRulesModal();
});
