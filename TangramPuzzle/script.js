$(document).ready(function () {

});

const pieces = document.querySelectorAll(".tangram-piece");
const board = document.querySelector(".tangram-board");
const rotateBtn = document.querySelector("#rotate-btn");
const leftBtn = document.querySelector("#left-btn");
const rightBtn = document.querySelector("#right-btn");
const upBtn = document.querySelector("#up-btn");
const downBtn = document.querySelector("#down-btn");

let selectedPiece = null;
const MOVE_STEP = 1;
const pieceDropdown = document.querySelector("#piece-dropdown");

function positionRotateButton() {
    if (!selectedPiece) return;
    console.log("Piece rotating 45!");

    const pieceRect = selectedPiece.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    rotateBtn.style.left =
    `${pieceRect.left - boardRect.left + pieceRect.width / 2 - 20}px`;

    rotateBtn.style.top =
    `${pieceRect.top - boardRect.top - 45}px`;
}


pieces.forEach((piece) => {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;


    piece.addEventListener("pointerdown", (event) => {
        console.log("Piece selected!");
        isDragging = true;
        selectedPiece = piece;
        rotateBtn.style.display = "block";

        // Bring the selected piece to the front
        pieces.forEach((p) => {
        p.style.zIndex = 1;
        });
        piece.style.zIndex = 10;

        const rect = piece.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        piece.setPointerCapture(event.pointerId);
        pieces.forEach((p) => {
            p.style.zIndex = 1;
        });

        piece.style.zIndex = 10;
    });

    piece.addEventListener("pointermove", (event) => {
        console.log("Piece Moving......!");
        // console.log(event.clientX, event.clientY);
        if (!isDragging) return;

        const board = piece.parentElement;
        const boardRect = board.getBoundingClientRect();

        const x = event.clientX - boardRect.left - offsetX;
        const y = event.clientY - boardRect.top - offsetY;

        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
        piece.style.right = "auto";
        piece.style.bottom = "auto";
        
        positionRotateButton();
    });

    piece.addEventListener("pointerup", () => {
        isDragging = false;
    });

    piece.addEventListener("pointercancel", () => {
        isDragging = false;
    });

});
rotateBtn.addEventListener("click", () => {
    if (!selectedPiece) return;

    const current = Number(selectedPiece.dataset.rotation || 0);
    const next = (current + 45) % 360;

    selectedPiece.dataset.rotation = next;
    selectedPiece.style.transform = `rotate(${next}deg)`;

    updatePieceDropdown();
});

// Move selected piece
function moveSelectedPiece(dx, dy) {
    if (!selectedPiece) return;

    const currentLeft = parseFloat(selectedPiece.style.left) ||
        selectedPiece.offsetLeft;
    const currentTop = parseFloat(selectedPiece.style.top) ||
        selectedPiece.offsetTop;

    selectedPiece.style.left = `${currentLeft + dx}px`;
    selectedPiece.style.top = `${currentTop + dy}px`;
    selectedPiece.style.right = "auto";
    selectedPiece.style.bottom = "auto";
}

leftBtn.addEventListener("click", () => {
    moveSelectedPiece(-MOVE_STEP, 0);
});

rightBtn.addEventListener("click", () => {
    moveSelectedPiece(MOVE_STEP, 0);
});

upBtn.addEventListener("click", () => {
    moveSelectedPiece(0, -MOVE_STEP);
});

downBtn.addEventListener("click", () => {
    moveSelectedPiece(0, MOVE_STEP);
});

// Select a piece using the dropdown
pieceDropdown.addEventListener("change", () => {
    const selectedClass = pieceDropdown.value;

    selectedPiece = document.querySelector(
        `.tangram-piece.${selectedClass}`
    );

    pieces.forEach((piece) => {
        piece.style.zIndex = 1;
    });

    if (selectedPiece) {
        selectedPiece.style.zIndex = 10;
    }
});

function updatePieceDropdown() {
    pieces.forEach((piece) => {
        const pieceClass = [...piece.classList].find(
            (className) => className !== "tangram-piece"
        );

        const option = pieceDropdown.querySelector(
            `option[value="${pieceClass}"]`
        );

        if (option) {
            const angle = Number(piece.dataset.rotation || 0);
            const labels = {
                "triangle-left": "Purple Triangle",
                "triangle-top": "Blue Triangle",
                "triangle-right": "Red Triangle",
                "triangle-corner": "Dark Purple Triangle",
                "square": "Green Square",
                "triangle-middle": "Teal Triangle",
                "parallelogram": "Orange Parallelogram"
            };

            option.textContent = `${labels[pieceClass]} — ${angle}°`;
        }
    });
}

