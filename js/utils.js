// js/utils.js - 유틸리티 함수들

const GAME_CONFIG = {
    BOARD_SIZE: 6,
    CELL_SIZE: 70,
    CELL_GAP: 2,
    BOARD_PADDING: 10,
    EXIT_POS: 5
};

const VEHICLE_COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

const VEHICLE_TEMPLATES = {
    easy: [
        { length: 2, direction: 'horizontal' },
        { length: 3, direction: 'vertical' },
        { length: 2, direction: 'horizontal' }
    ],
    normal: [
        { length: 2, direction: 'horizontal' },
        { length: 3, direction: 'vertical' },
        { length: 2, direction: 'horizontal' },
        { length: 2, direction: 'vertical' },
        { length: 2, direction: 'horizontal' }
    ],
    hard: [
        { length: 2, direction: 'horizontal' },
        { length: 3, direction: 'vertical' },
        { length: 3, direction: 'horizontal' },
        { length: 2, direction: 'horizontal' },
        { length: 2, direction: 'vertical' },
        { length: 2, direction: 'horizontal' }
    ]
};

function isValidPosition(x, y, length, direction, existingVehicles) {
    if (direction === 'horizontal') {
        if (x < 0 || x + length > GAME_CONFIG.BOARD_SIZE || y < 0 || y >= GAME_CONFIG.BOARD_SIZE) {
            return false;
        }
    } else {
        if (x < 0 || x >= GAME_CONFIG.BOARD_SIZE || y < 0 || y + length > GAME_CONFIG.BOARD_SIZE) {
            return false;
        }
    }

    for (let existingVehicle of existingVehicles) {
        for (let i = 0; i < length; i++) {
            let checkX = direction === 'horizontal' ? x + i : x;
            let checkY = direction === 'vertical' ? y + i : y;

            for (let j = 0; j < existingVehicle.length; j++) {
                let existX = existingVehicle.direction === 'horizontal' ? existingVehicle.x + j : existingVehicle.x;
                let existY = existingVehicle.direction === 'vertical' ? existingVehicle.y + j : existingVehicle.y;

                if (checkX === existX && checkY === existY) {
                    return false;
                }
            }
        }
    }

    return true;
}

function generateRandomPuzzle(difficulty) {
    const templates = VEHICLE_TEMPLATES[difficulty];
    const vehicles = [];
    let colorIndex = 0;

    const redVehicle = {
        id: 'A',
        x: Math.floor(Math.random() * (GAME_CONFIG.BOARD_SIZE - 2 + 1)),
        y: 2,
        length: 2,
        direction: 'horizontal',
        color: 'red'
    };

    if (isValidPosition(redVehicle.x, redVehicle.y, redVehicle.length, redVehicle.direction, vehicles)) {
        vehicles.push(redVehicle);
        colorIndex++;
    }

    for (let i = 1; i < templates.length; i++) {
        const template = templates[i];
        let attempts = 0;
        let placed = false;

        while (attempts < 50 && !placed) {
            let randomX, randomY;

            if (template.direction === 'horizontal') {
                randomX = Math.floor(Math.random() * (GAME_CONFIG.BOARD_SIZE - template.length + 1));
                randomY = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
            } else {
                randomX = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
                randomY = Math.floor(Math.random() * (GAME_CONFIG.BOARD_SIZE - template.length + 1));
            }

            if (isValidPosition(randomX, randomY, template.length, template.direction, vehicles)) {
                const vehicle = {
                    id: String.fromCharCode(65 + i),
                    x: randomX,
                    y: randomY,
                    length: template.length,
                    direction: template.direction,
                    color: VEHICLE_COLORS[colorIndex % VEHICLE_COLORS.length]
                };
                vehicles.push(vehicle);
                colorIndex++;
                placed = true;
            }

            attempts++;
        }
    }

    return vehicles;
}

function calculateStars(moveCount) {
    if (moveCount <= 10) return '⭐⭐⭐';
    if (moveCount <= 15) return '⭐⭐';
    return '⭐';
}

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}
