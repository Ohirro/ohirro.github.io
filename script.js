function generateMap() {
    const n = 10; // Размер карты
    const k = 0.5; // Коэффициент шума
    const size = Math.pow(2, n) + 1;
    let grid = createGrid(size);

    initializeCorners(grid, size);
    diamondSquare(grid, size, k);

    drawMap(grid, size);
}

function createGrid(size) {
    let grid = new Array(size);
    for (let i = 0; i < size; i++) {
        grid[i] = new Array(size).fill(0);
    }
    return grid;
}

function initializeCorners(grid, size) {
    grid[0][0] = Math.random();
    grid[0][size - 1] = Math.random();
    grid[size - 1][0] = Math.random();
    grid[size - 1][size - 1] = Math.random();
}

function diamondSquare(grid, size, k) {
    let step = size - 1;
    while (step > 1) {
        let halfStep = step / 2;

        // Diamond step
        for (let y = halfStep; y < size; y += step) {
            for (let x = halfStep; x < size; x += step) {
                diamondStep(grid, x, y, halfStep, k);
            }
        }

        // Square step
        for (let y = 0; y < size; y += halfStep) {
            for (let x = (y + halfStep) % step; x < size; x += step) {
                squareStep(grid, x, y, halfStep, k);
            }
        }

        step /= 2;
        k /= 2;
    }
}

function diamondStep(grid, x, y, size, k) {
    let sum = grid[y - size][x - size] +
              grid[y - size][x + size] +
              grid[y + size][x - size] +
              grid[y + size][x + size];
    let average = sum / 4.0;
    grid[y][x] = average + randomDisplacement(k);
}

function squareStep(grid, x, y, size, k) {
    let sum = 0;
    let count = 0;

    if (x - size >= 0) {
        sum += grid[y][x - size];
        count++;
    }
    if (x + size < grid.length) {
        sum += grid[y][x + size];
        count++;
    }
    if (y - size >= 0) {
        sum += grid[y - size][x];
        count++;
    }
    if (y + size < grid.length) {
        sum += grid[y + size][x];
        count++;
    }

    let average = sum / count;
    grid[y][x] = average + randomDisplacement(k);
}

function randomDisplacement(k) {
    return (Math.random() - 0.5) * 2 * k;
}

function drawMap(grid, size) {
    let canvas = document.getElementById('mapCanvas');
    let ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            ctx.fillStyle = getColorForHeight(grid[y][x]);
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function getColorForHeight(height) {
    let color = Math.floor(height * 255);
    let r, g, b;

    if (color > 225) {
        // очень высокие горы (снег)
    r = g = b = lerp(230, 255, (color - 230) / 25);
    } else if (color > 210) {
        // высокие горы
        let t = (color - 200) / 30;
        r = g = b = lerp(180, 230, t);
    } else if (color > 195) {
        // горы
        let t = (color - 170) / 30;
        r = g = b = lerp(150, 180, t);
    } else if (color > 170) {
        // горные холмы
        let t = (color - 140) / 30;
        r = lerp(120, 150, t);
        g = lerp(100, 130, t);
        b = lerp(80, 110, t);
    } else if (color > 140) {
        // равнины
        let t = (color - 110) / 30;
        r = lerp(85, 120, t);
        g = lerp(160, 195, t);
        b = lerp(85, 120, t);
    } else if (color > 110) {
        // пустыни
        let t = (color - 80) / 30;
        r = lerp(210, 240, t);
        g = lerp(180, 210, t);
        b = lerp(150, 180, t);
    } else if (color > 80) {
        // низменности
        let t = (color - 50) / 30;
        r = lerp(50, 85, t);
        g = lerp(150, 185, t);
        b = lerp(50, 85, t);
    } else if (color > 40) {
        // мелководье
        let t = (color - 20) / 30
        r = lerp(0, 100, t);
        g = lerp(120, 180, t);
        b = lerp(150, 230, t);
    } else {
        // глубокие воды
        let t = color / 20;
        r = 0;
        g = lerp(50, 100, t);
        b = lerp(150, 200, t);
    }
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
}

function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
}


document.getElementById('generateButton').addEventListener('click', generateMap);
