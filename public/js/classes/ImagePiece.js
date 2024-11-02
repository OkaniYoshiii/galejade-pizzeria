export class ImagePiece {
    #ctx;
    #img;
    #srcX;
    #srcY;
    #srcWidth;
    #srcHeight;
    #posX;
    #posY;
    #width;
    #height;
    constructor(ctx, img, srcX, srcY, srcWidth, srcHeight, posX, posY, width, height) {
        this.#ctx = ctx;
        this.#img = img;
        this.#srcX = srcX;
        this.#srcY = srcY;
        this.#srcWidth = srcWidth;
        this.#srcHeight = srcHeight;
        this.#posX = posX;
        this.#posY = posY;
        this.#width = width;
        this.#height = height;
    }
    // get img() {
    //     return this.#img;
    // }
    get posX() {
        return this.#posX;
    }
    get posY() {
        return this.#posY;
    }
    // get width() {
    //     return this.#width;
    // }
    // get height() {
    //     return this.#height;
    // }
    updatePosition(x, y) {
        this.#posX = x;
        this.#posY = y;
        this.#ctx.drawImage(this.#img, this.#srcX, this.#srcY, this.#srcWidth, this.#srcHeight, this.#posX, this.#posY, this.#width, this.#height);
    }
}
