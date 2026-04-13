// js/vehicle.js - 차량 관리 로직

function isPositionOccupied(x, y, excludeId, vehicles) {
    return vehicles.some(vehicle => {
        if (vehicle.id === excludeId) return false;
        
        for (let i = 0; i < vehicle.length; i++) {
            if (vehicle.direction === 'horizontal') {
                if (vehicle.y === y && vehicle.x + i === x) return true;
            } else {
                if (vehicle.x === x && vehicle.y + i === y) return true;
            }
        }
        return false;
    });
}

function getMovableRange(vehicle, vehicles) {
    let minPos, maxPos;

    if (vehicle.direction === 'horizontal') {
        minPos = 0;
        for (let x = vehicle.x - 1; x >= 0; x--) {
            if (isPositionOccupied(x, vehicle.y, vehicle.id, vehicles)) {
                minPos = x + 1;
                break;
            }
        }

        maxPos = GAME_CONFIG.BOARD_SIZE - vehicle.length;
        for (let x = vehicle.x + vehicle.length; x < GAME_CONFIG.BOARD_SIZE; x++) {
            if (isPositionOccupied(x, vehicle.y, vehicle.id, vehicles)) {
                maxPos = x - vehicle.length;
                break;
            }
        }

        return { minPos, maxPos, axis: 'x' };
    } else {
        minPos = 0;
        for (let y = vehicle.y - 1; y >= 0; y--) {
            if (isPositionOccupied(vehicle.x, y, vehicle.id, vehicles)) {
                minPos = y + 1;
                break;
            }
        }

        maxPos = GAME_CONFIG.BOARD_SIZE - vehicle.length;
        for (let y = vehicle.y + vehicle.length; y < GAME_CONFIG.BOARD_SIZE; y++) {
            if (isPositionOccupied(vehicle.x, y, vehicle.id, vehicles)) {
                maxPos = y - vehicle.length;
                break;
            }
        }

        return { minPos, maxPos, axis: 'y' };
    }
}

function canMoveVehicle(vehicle, newX, newY, vehicles) {
    const range = getMovableRange(vehicle, vehicles);

    if (vehicle.direction === 'horizontal') {
        return newY === vehicle.y && newX >= range.minPos && newX <= range.maxPos;
    } else {
        return newX === vehicle.x && newY >= range.minPos && newY <= range.maxPos;
    }
}

function isGameCleared(vehicles) {
    const redVehicle = vehicles.find(v => v.id === 'A');
    return redVehicle && redVehicle.x + redVehicle.length - 1 === GAME_CONFIG.EXIT_POS;
}
