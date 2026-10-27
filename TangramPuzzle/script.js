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

        positionRotateButton();
    });

    piece.addEventListener("pointerup", () => {
        isDragging = false;
    });

    piece.addEventListener("pointercancel", () => {
        isDragging = false;
    });
    rotateBtn.addEventListener("click", () => {
        if (!selectedPiece) return;

        const current = Number(selectedPiece.dataset.rotation || 0);
        const next = (current + 45) % 360;

        selectedPiece.dataset.rotation = next;
        selectedPiece.style.transform = `rotate(${next}deg)`;

        positionRotateButton();
    });
    document.addEventListener("pointerdown", (event) => {
        if (
        !event.target.closest(".tangram-piece") &&
        !event.target.closest("#rotate-btn")
        ) {
        selectedPiece = null;
        rotateBtn.style.display = "none";
        }
    });
});




