// js/game.js - 게임 상태 관리

const game = {
    state: {
        moveCount: 0,
        currentDifficulty: 'easy',
        vehicles: [],
        selectedVehicle: null,
        isCleared: false
    },

    start() {
        this.state.moveCount = 0;
        this.state.isCleared = false;
        this.state.selectedVehicle = null;
        this.state.vehicles = generateRandomPuzzle(this.state.currentDifficulty);
        
        updateMoveCounter(this.state.moveCount);
        renderBoard(this.state);
        hideClearModal();
    },

    changeDifficulty(difficulty) {
        this.state.currentDifficulty = difficulty;
        this.start();
    },

    moveVehicle(vehicle, newX, newY) {
        if (!canMoveVehicle(vehicle, newX, newY, this.state.vehicles)) {
            return false;
        }

        const oldX = vehicle.x;
        const oldY = vehicle.y;
        vehicle.x = newX;
        vehicle.y = newY;

        if (oldX !== newX || oldY !== newY) {
            this.state.moveCount++;
            updateMoveCounter(this.state.moveCount);

            if (isGameCleared(this.state.vehicles)) {
                this.state.isCleared = true;
                setTimeout(() => {
                    showClearModal(this.state.moveCount);
                }, 300);
            }

            return true;
        }

        return false;
    },

    selectVehicle(vehicle) {
        this.state.selectedVehicle = vehicle;
        renderBoard(this.state);
    },

    deselectVehicle() {
        this.state.selectedVehicle = null;
        renderBoard(this.state);
    },

    getState() {
        return this.state;
    }
};
