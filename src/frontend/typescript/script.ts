{
    const NAV_BTN = document.querySelector('.nav__btn');
    const NAV_LINKS = document.querySelector('.nav__links');
    if(NAV_BTN instanceof HTMLButtonElement && NAV_LINKS !== null) {
        NAV_BTN.addEventListener('click', function() {
            NAV_LINKS.classList.toggle('d-flex');
        })
    }
}

{
    const IMG_CONTAINERS = document.querySelectorAll('.img-fader');
    IMG_CONTAINERS.forEach((imgContainer) => {
        const IMGS = Array.from(imgContainer.querySelectorAll('.fader-img') as NodeListOf<HTMLElement>) ;
        const TRANSITION_DURATION_IN_MS = 1500;

        IMGS.forEach((img) => {
            img.style.transition = 'opacity ' + TRANSITION_DURATION_IN_MS + 'ms';
        })
    
        setInterval(() => {
            IMGS[IMGS.length - 1].style.opacity = '0';
    
            setTimeout(() => {
                IMGS[IMGS.length - 1].style.opacity = '1';
    
                IMGS.unshift(IMGS[IMGS.length - 1]);
                IMGS.pop();
    
                IMGS.forEach((img) => imgContainer.appendChild(img));
            }, TRANSITION_DURATION_IN_MS);
        }, 4000);
    })
}

{
    const CANVAS = document.createElement('canvas');
    if(CANVAS instanceof HTMLCanvasElement) {
        const GRID_ROWS = 3;
        const GRID_COLUMNS = GRID_ROWS;

        CANVAS.style.width = '100%';
        CANVAS.width = 600;
        CANVAS.height = CANVAS.width;

        class ImagePiece
        {
            static PIECE_WIDTH = CANVAS.width / GRID_ROWS;
            static PIECE_HEIGHT = CANVAS.height / GRID_ROWS;

            #img : HTMLImageElement;
            #posX : number;
            #posY : number;
            #width : number;
            #height : number;

            constructor(img : HTMLImageElement, posX : number, posY : number, width : number, height : number) {
                this.#img = img;
                this.#posX = posX;
                this.#posY = posY;
                this.#width = width;
                this.#height = height;
            }

            get img() {
                return this.#img;
            }

            #updatePosition(x : number, y : number) {
                this.#posX = x;
                this.#posY = y;

                // CTX?.drawImage(this.#img, this)
            }
        }

        const DEBUG_MODE : boolean = false;

        document.querySelector('main')?.appendChild(CANVAS);

        const IMGS = document.querySelectorAll('img.slider__item') as NodeListOf<HTMLImageElement>;
        const CTX = CANVAS.getContext('2d');

        function splitInPieces(img : HTMLImageElement) : void {
            const IMG_PIECES : ImagePiece[] = [];
            const IMG_PIECE_WIDTH = Math.round(img.naturalWidth / GRID_COLUMNS);
            const IMG_PIECE_HEIGHT = Math.round(img.naturalHeight / GRID_ROWS);
            if(DEBUG_MODE) {
                let i = 0;
                let j = 0;
                const INTERVAL_ID = setInterval(() => {
                    const IMG_POSX = Math.round(IMG_PIECE_WIDTH * i);
                    const IMG_POSY = Math.round(IMG_PIECE_HEIGHT * j);

                    CTX?.drawImage(img, IMG_POSX, IMG_POSY, IMG_PIECE_WIDTH, IMG_PIECE_HEIGHT, ImagePiece.PIECE_WIDTH * i, ImagePiece.PIECE_WIDTH * j, ImagePiece.PIECE_WIDTH, ImagePiece.PIECE_HEIGHT);
                    CTX?.rect(ImagePiece.PIECE_WIDTH * i, ImagePiece.PIECE_WIDTH * j, ImagePiece.PIECE_WIDTH, ImagePiece.PIECE_HEIGHT);
                    CTX?.stroke();

                    j++;

                    if(j === 3) {
                        i++;
                        j = 0;
                    }

                    if(i === 3) {
                        clearInterval(INTERVAL_ID);
                    }

                }, 1000);
            } else {
                for(let i = 0; i < GRID_ROWS; i++) {
                    for(let j = 0; j < GRID_COLUMNS; j++) {
                        const IMG_POSX = Math.round(IMG_PIECE_WIDTH * i);
                        const IMG_POSY = Math.round(IMG_PIECE_HEIGHT * j);
                        CTX?.drawImage(img, IMG_POSX, IMG_POSY, IMG_PIECE_WIDTH, IMG_PIECE_HEIGHT, ImagePiece.PIECE_WIDTH * i, ImagePiece.PIECE_WIDTH * j, ImagePiece.PIECE_WIDTH, ImagePiece.PIECE_HEIGHT);
                        CTX?.stroke();
    
                        const IMAGE = new Image();
                        IMG_PIECES.push(new ImagePiece(IMAGE, IMG_POSX, IMG_POSY, IMG_PIECE_WIDTH, IMG_PIECE_HEIGHT));
                        IMAGE.src = CANVAS.toDataURL();
                        CTX?.clearRect(0, 0, CANVAS.width, CANVAS.height);
                    }
                }
            }

            console.log(IMG_PIECES);
        }

        IMGS.forEach((img) => {
            const ABORT_CONTROLLER = new AbortController();
            if(img.complete) {
                splitInPieces(img);
                // CTX?.clearRect(0, 0, CANVAS.width, CANVAS.height);
            } else {
                img.addEventListener("load", (e) => {
                    splitInPieces(img);
                    ABORT_CONTROLLER.abort();
                    // CTX?.clearRect(0, 0, CANVAS.width, CANVAS.height);
                }, { signal : ABORT_CONTROLLER.signal });
            }
        })

        function update(requestId : number, ellapsedTimeInMs : number) {
            if(ellapsedTimeInMs > 3000) {
                cancelAnimationFrame(requestId);
            }
        }
        
        let lastTimestamp : number = 0;
        const FRAMES_PER_SECOND = 1;
        const FRAME_DURATION_IN_MS = 1 / FRAMES_PER_SECOND * 1000;
        let timer = 0;
        let requestId = 0;
        let ellapsedTimeInMs = 0;
        function loop(timestamp : number) {
            const DELTA_TIME = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            timer += DELTA_TIME;
            ellapsedTimeInMs += DELTA_TIME;

            requestId = requestAnimationFrame(loop);

            if(timer > FRAME_DURATION_IN_MS) {
                update(requestId, ellapsedTimeInMs)
                timer = 0;
            }
        }

        requestId = requestAnimationFrame(loop)
    }

}