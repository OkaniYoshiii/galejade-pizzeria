import { ImagePiece } from "./classes/ImagePiece.js";
{
    const NAV_BTN = document.querySelector('.nav__btn');
    const NAV_LINKS = document.querySelector('.nav__links');
    if (NAV_BTN instanceof HTMLButtonElement && NAV_LINKS !== null) {
        NAV_BTN.addEventListener('click', function () {
            NAV_LINKS.classList.toggle('d-flex');
        });
    }
}
{
    const IMG_CONTAINERS = document.querySelectorAll('.img-fader');
    IMG_CONTAINERS.forEach((imgContainer) => {
        const IMGS = Array.from(imgContainer.querySelectorAll('.fader-img'));
        const TRANSITION_DURATION_IN_MS = 1500;
        IMGS.forEach((img) => {
            img.style.transition = 'opacity ' + TRANSITION_DURATION_IN_MS + 'ms';
        });
        setInterval(() => {
            IMGS[IMGS.length - 1].style.opacity = '0';
            setTimeout(() => {
                IMGS[IMGS.length - 1].style.opacity = '1';
                IMGS.unshift(IMGS[IMGS.length - 1]);
                IMGS.pop();
                IMGS.forEach((img) => imgContainer.appendChild(img));
            }, TRANSITION_DURATION_IN_MS);
        }, 4000);
    });
}
{
    const CANVAS = document.createElement('canvas');
    if (CANVAS instanceof HTMLCanvasElement) {
        CANVAS.style.width = '100%';
        CANVAS.width = 600;
        CANVAS.height = CANVAS.width;
        document.querySelector('main')?.appendChild(CANVAS);
        const GRID_ROWS = 3;
        const GRID_COLUMNS = GRID_ROWS;
        const PIECE_WIDTH = CANVAS.width / GRID_ROWS;
        const PIECE_HEIGHT = CANVAS.height / GRID_ROWS;
        const IMGS = Array.from(document.querySelectorAll('img.slider__item'));
        const CTX = CANVAS.getContext('2d');
        async function waitForImagesToLoad(imgs) {
            const PROMISES = imgs.map((img) => {
                return new Promise((res) => {
                    if (img.complete) {
                        res(img);
                    }
                    else {
                        img.addEventListener('load', () => res(img));
                    }
                });
            });
            return Promise.all(PROMISES);
        }
        waitForImagesToLoad(IMGS).then((loadedImgs) => {
            console.log('Images has loaded');
            if (CTX !== null) {
                function splitInPieces(ctx, img) {
                    const IMG_PIECES = [];
                    const IMG_PIECE_WIDTH = Math.round(img.naturalWidth / GRID_COLUMNS);
                    const IMG_PIECE_HEIGHT = Math.round(img.naturalHeight / GRID_ROWS);
                    for (let i = 0; i < GRID_ROWS; i++) {
                        for (let j = 0; j < GRID_COLUMNS; j++) {
                            const IMG_POSX = Math.round(IMG_PIECE_WIDTH * i);
                            const IMG_POSY = Math.round(IMG_PIECE_HEIGHT * j);
                            const IMAGE_PIECE = new ImagePiece(ctx, img, IMG_POSX, IMG_POSY, IMG_PIECE_WIDTH, IMG_PIECE_HEIGHT, PIECE_WIDTH * i, PIECE_WIDTH * j, PIECE_WIDTH, PIECE_HEIGHT);
                            IMAGE_PIECE.updatePosition(IMAGE_PIECE.posX, IMAGE_PIECE.posY);
                            IMG_PIECES.push(IMAGE_PIECE);
                        }
                    }
                    return IMG_PIECES;
                }
                function sortImgPiecesByColumn(imgPieces) {
                    const IMG_PIECES = [...imgPieces];
                    return IMG_PIECES.sort((a, b) => {
                        if (a.posX < b.posX) {
                            return -1;
                        }
                        if (a.posX > b.posX) {
                            return 1;
                        }
                        if (a.posX === b.posX) {
                            if (a.posY < b.posY) {
                                return -1;
                            }
                            else {
                                return 1;
                            }
                        }
                        return 0;
                    });
                }
                const IMGS_PIECES = Array.from(loadedImgs).map((img) => splitInPieces(CTX, img));
                const IMG_PIECES_BY_COLUMN = IMGS_PIECES.map(sortImgPiecesByColumn);
                function update(requestId, ellapsedTimeInMs) {
                    CTX?.clearRect(0, 0, CANVAS.width, CANVAS.height);
                    const IMG_PIECES_COUNT = IMG_PIECES_BY_COLUMN[0].length;
                    for (let i = IMG_PIECES_COUNT - 3; i < IMG_PIECES_COUNT; i++) {
                        const IMG_PIECE = IMG_PIECES_BY_COLUMN[0][i];
                        IMG_PIECE.updatePosition(IMG_PIECE.posX, IMG_PIECE.posY + 10);
                    }
                }
                let lastTimestamp = 0;
                const FRAMES_PER_SECOND = 1;
                const FRAME_DURATION_IN_MS = 1 / FRAMES_PER_SECOND * 1000;
                let timer = 0;
                let requestId = 0;
                let ellapsedTimeInMs = 0;
                function loop(timestamp) {
                    const DELTA_TIME = timestamp - lastTimestamp;
                    lastTimestamp = timestamp;
                    timer += DELTA_TIME;
                    ellapsedTimeInMs += DELTA_TIME;
                    requestId = requestAnimationFrame(loop);
                    if (timer > FRAME_DURATION_IN_MS) {
                        update(requestId, ellapsedTimeInMs);
                        timer = 0;
                    }
                }
                requestId = requestAnimationFrame(loop);
            }
        });
    }
}
