class Banana {
    pixels = [];

    minX = 0;
    maxX = 0;
    minY = 0;
    maxY = 0;

    constructor(x, y) {
        this.addPixel({ x, y });
        this.minX = x;
        this.maxX = x;
        this.minY = y;
        this.maxY = y;
    }

    addPixel(x, y) {
        this.pixels.push({ x, y });
        
        this.minX = x < this.minX ? x : this.minX;
        this.maxX = x > this.maxX ? x : this.maxX;
        this.minY = y < this.minY ? y : this.minY;
        this.maxY = y > this.maxY ? y : this.maxY;
    }

    isNear(x, y) {
        if (x >= this.minX && x < this.maxX && y >= this.minY && y <= this.maxY) {
            return true;
        }

        var distX = 0;
        var distY = 0;

        if (x < this.minX) {
            distX = this.minX - x;
        }

        if (x > this.maxX) {
            distX = x - this.maxX;
        }

        if (y < this.minY) {
            distY = this.minY - y;
        }

        if (y > this.maxY) {
            distY = x - this.maxY;
        }

        var distance = distX + distY;

        return distance < 50;
    }

    draw(ctx) {
        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 4;
        ctx.beginPath();

        var x = this.minX;
        var y = this.minY;
        var width = this.maxX - this.minX;
        var height = this.maxY - this.minY;

        ctx.rect(x, y, width, height);
        ctx.stroke();
    }
}