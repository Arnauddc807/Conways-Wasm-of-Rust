import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 12;
const GRID_COLOUR = "#000";
const DEAD_COLOUR = "#F3F8FF";
const ALIVE_COLOUR = "#7E30E1";

const WIDTH = 118;
const HEIGHT = 64;

let p = 0.5
let slider = document.getElementById("slider");
let label = document.getElementById("label");
let universe = Universe.new(WIDTH, HEIGHT, p);
let playing = false;


const canvas = document.getElementById("game-of-live-canvas");
canvas.height = (CELL_SIZE + 1) * HEIGHT + 1;
canvas.width = (CELL_SIZE + 1) * WIDTH + 1;

const ctx = canvas.getContext("2d");

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOUR;

    for (let i = 0; i <= WIDTH; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * HEIGHT + 1);
    }

    for (let j = 0; j <= HEIGHT; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * WIDTH + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const bitIsSet = (n, arr) => {
    const byte = Math.floor(n/8);
    const mask = 1 << (n % 8);
    return (arr[byte] & mask) === mask;
}

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, WIDTH * HEIGHT / 8);

    ctx.beginPath();

    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = bitIsSet(idx, cells)
                ? ALIVE_COLOUR
                : DEAD_COLOUR;
            
            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
        ctx.stroke();
    }
};




document.getElementById("play").onclick = () => {
    if (playing) {
        playing = false
    } else {
        playing = true
        drawGrid();
        drawCells();
        requestAnimationFrame(renderLoop);
    }
}

document.getElementById("step").onclick = () => {
    if (!playing) {
        universe.tick();
        drawGrid();
        drawCells();
        requestAnimationFrame(renderLoop);
    }
}


const renderLoop = () => {
    if (playing) {
        setTimeout(function() {
            universe.tick();

            drawGrid();
            drawCells();
        
            requestAnimationFrame(renderLoop);
        }, 40)
    }
};


const getIndex = (row, col) => {
    return row * WIDTH + col;
};

const reset = () => {
    universe = Universe.new(WIDTH, HEIGHT, p);
    drawGrid();
    drawCells();
    requestAnimationFrame(renderLoop);
}

document.getElementById("reset").onclick = reset;



slider.oninput = () => {
    p = slider.value/100;
    label.innerHTML = slider.value
    reset()
}



drawGrid();
drawCells();
requestAnimationFrame(renderLoop);