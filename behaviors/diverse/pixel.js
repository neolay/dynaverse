class MbitDisplayActor {
    setup() {
        this.generateLed();
        this.state = this.initialState(this.pixelX, this.pixelY);
        this.image = {
            HEART: [
                [0, 1, 0, 1, 0],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [0, 1, 1, 1, 0],
                [0, 0, 1, 0, 0],
            ],
            HEART_SMALL: [
                [0, 0, 0, 0, 0],
                [0, 1, 0, 1, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0]
            ],
            HAPPY: [
                [0, 0, 0, 0, 0],
                [0, 1, 0, 1, 0],
                [0, 0, 0, 0, 0],
                [1, 0, 0, 0, 1],
                [0, 1, 1, 1, 0],
            ]
        }
        // this.show(this.image.HEART);
        this.throb();
    }

    generateLed() {
        this.leds = [];
        this.pixelX = this._cardData.pixelX || 5;
        this.pixelY = this._cardData.pixelY || 5;
        const spacingCol = this._cardData.spacingCol || 0.05;
        const spacingRow = this._cardData.spacingRow || 0.05;
        const ledWidth = this._cardData.ledWidth || 0.2;
        const ledHeight = this._cardData.ledHeight || 0.2;
        const ledDepth = this._cardData.ledDepth || 0.1;
        const boardWidth = this._cardData.width ||= ledWidth * this.pixelX + spacingCol * (this.pixelX + 1);
        const boardHeight = this._cardData.height ||= ledHeight * this.pixelY + spacingRow * (this.pixelY + 1);
        const boardDepth = this._cardData.depth ||= 0.05;

        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const led = this.createCard({
                    translation: [(2 * x + 1) / 2 * ledWidth + spacingCol * (x + 1) - boardWidth / 2,
                        -(2 * y + 1) / 2 * ledHeight - spacingRow * (y + 1) + boardHeight / 2, (boardDepth + ledDepth) / 2],
                    name: `led-${x}-${y}`,
                    behaviorModules: ["LED"],
                    parent: this,
                    type: "object",
                    width: ledWidth,
                    height: ledHeight,
                    coordinate: [x, y],
                });
                this.leds.push(led);
            }
        }
    }

    initialState(x, y) {
        return new Array(x).fill(0).map(() => new Array(y).fill(0));
    }

    setPixel(x, y) {
        this.state[x][y] = 1;
        console.log("setPixel", this.state);
    }

    show(image) {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                this.state[x][y] = image[y][x];
            }
        }
        this.say("render");
        // console.log(this.state);
    }

    throb() {
        const delay = 500;
        this.show(this.image.HEART);
        this.future(delay).show(this.image.HEART_SMALL);
        this.future(delay * 2).throb();
    }
}

class MbitDisplayPawn {
    setup() {
        this.generateBoard();
        this.render();
        this.listen("render", "render");
    }

    generateBoard() {
        const THREE = Microverse.THREE;
        this.pixelX = this.actor._cardData.pixelX;
        this.pixelY = this.actor._cardData.pixelY;
        const boardWidth = this.actor._cardData.width;
        const boardHeight = this.actor._cardData.height;
        const boardDepth = this.actor._cardData.depth;

        const board = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth, 2, 2, 2),
            new THREE.MeshStandardMaterial({color: 0x000000, toneMapped: false}),
        );

        this.shape.add(board);
    }

    render() {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const on = this.actor.state[x][y];
                const led = this.actor.leds[x * this.pixelY + y];
                if (on) {
                    this.publish(led.id, "ledOn", {color: 0xFF0000, intensity: 1});
                } else {
                    this.publish(led.id, "ledOff", {color: 0x000000, intensity: 0});
                }
            }
        }
    }
}

class BagDisplayActor {
    setup() {
        this.pixelX = this._cardData.pixelX || 16;
        this.pixelY = this._cardData.pixelY || 16;
        this.state = this.initialState(this.pixelX, this.pixelY);
        // this.subscribe("input", "xDown", "showSnowCrash");

        this.step();
    }

    // you may see the error: Send rate exceeded, when every led is a card
    step() {
        this.showSnowCrash();
        this.future(100).step();
    }

    initialState(x, y) {
        return new Array(x).fill(0).map(() => new Array(y).fill(0));
    }

    setPixel(x, y, color) {
        this.state[x][y] = color;
        // console.log("setPixel", this.state);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return b | g << 8 | r << 16;
    }

    showSnowCrash() {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                if (this.getRandomInt(2) === 1) {
                    this.setPixel(x, y, 0xFFFFFF);
                } else {
                    this.setPixel(x, y, 0x000000);
                }
            }
        }
        this.say("render");
    }
}

class BagDisplayPawn {
    setup() {
        this.generatePixel();

        this.render();
        this.listen("render", "render");
    }

    generatePixel() {
        const THREE = Microverse.THREE;

        this.leds = [];
        this.pixelX = this.actor._cardData.pixelX || 16;
        this.pixelY = this.actor._cardData.pixelY || 16;
        const spacingCol = this.actor._cardData.spacingCol || 0.05;
        const spacingRow = this.actor._cardData.spacingRow || 0.05;
        const ledWidth = this.actor._cardData.ledWidth || 0.2;
        const ledHeight = this.actor._cardData.ledHeight || 0.2;
        const ledDepth = this.actor._cardData.ledDepth || 0.1;
        const boardWidth = this.actor._cardData.width ||= ledWidth * this.pixelX + spacingCol * (this.pixelX + 1);
        const boardHeight = this.actor._cardData.height ||= ledHeight * this.pixelY + spacingRow * (this.pixelY + 1);
        const boardDepth = this.actor._cardData.depth ||= 0.05;

        const board = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth, 2, 2, 2),
            new THREE.MeshBasicMaterial({color: 0x000000, toneMapped: false}),
        );

        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const led = new THREE.Mesh(
                    new THREE.BoxGeometry(ledWidth, ledHeight, ledDepth, 2, 2, 2),
                    new THREE.MeshBasicMaterial({color: 0x000000, toneMapped: false}));
                const translation = [(2 * x + 1) / 2 * ledWidth + spacingCol * (x + 1) - boardWidth / 2,
                    -(2 * y + 1) / 2 * ledHeight - spacingRow * (y + 1) + boardHeight / 2, (boardDepth + ledDepth) / 2];
                led.position.set(translation[0], translation[1], translation[2]);
                board.add(led);
                this.leds.push(led);
            }
        }

        this.shape.add(board);
    }

    render() {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const on = this.actor.state[x][y];
                const led = this.leds[x * this.pixelY + y];
                if (on) {
                    const color = this.actor.state[x][y];
                    led.material.color.set(color);
                } else {
                    led.material.color.set(0x000000);
                }
            }
        }
    }
}

class PixelDisplayActor {
    setup() {
        this.pixelX = this._cardData.pixelX || 16;
        this.pixelY = this._cardData.pixelY || 16;
        this.state = this.initialState(this.pixelX, this.pixelY);

        this.image = {
            0: [
                [0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D],
                [0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D],
                [0xE1483D, 0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xE1483D, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xE1483D, 0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xE1483D, 0xE1483D, 0xE1483D],
            ],
            1: [
                [0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D],
                [0xE1483D, 0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xE1483D, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xF3C31F, 0xF3C31F, 0xF3C31F, 0xFFFFFF, 0xFFFFFF, 0xE1483D],
                [0xE1483D, 0xE1483D, 0xE1483D, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xE1483D, 0xE1483D, 0xE1483D],
                [0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D, 0xE1483D],
            ],
        }

        this.throb();
    }

    initialState(x, y) {
        return new Array(x).fill(0).map(() => new Array(y).fill(0));
    }

    setPixel(x, y, color) {
        this.state[x][y] = color;
        // console.log("setPixel", this.state);
    }

    show(image) {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                this.state[x][y] = image[y][x];
            }
        }
        this.say("render");
        // console.log(this.state);
    }

    throb() {
        const delay = 500;
        this.show(this.image[0]);
        this.future(delay).show(this.image[1]);
        this.future(delay * 2).throb();
    }
}

class PixelDisplayPawn {
    setup() {
        this.generatePixel();

        this.render();
        this.listen("render", "render");
    }

    generatePixel() {
        const THREE = Microverse.THREE;

        this.leds = [];
        this.pixelX = this.actor._cardData.pixelX || 16;
        this.pixelY = this.actor._cardData.pixelY || 16;
        const spacingCol = this.actor._cardData.spacingCol || 0.05;
        const spacingRow = this.actor._cardData.spacingRow || 0.05;
        const ledWidth = this.actor._cardData.ledWidth || 0.2;
        const ledHeight = this.actor._cardData.ledHeight || 0.2;
        const ledDepth = this.actor._cardData.ledDepth || 0.1;
        const boardWidth = this.actor._cardData.width ||= ledWidth * this.pixelX + spacingCol * (this.pixelX + 1);
        const boardHeight = this.actor._cardData.height ||= ledHeight * this.pixelY + spacingRow * (this.pixelY + 1);
        const boardDepth = this.actor._cardData.depth ||= 0.05;

        const board = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth, 2, 2, 2),
            new THREE.MeshBasicMaterial({color: 0x000000, toneMapped: false}),
        );

        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const led = new THREE.Mesh(
                    new THREE.BoxGeometry(ledWidth, ledHeight, ledDepth, 2, 2, 2),
                    new THREE.MeshBasicMaterial({color: 0x000000, toneMapped: false}));
                const translation = [(2 * x + 1) / 2 * ledWidth + spacingCol * (x + 1) - boardWidth / 2,
                    -(2 * y + 1) / 2 * ledHeight - spacingRow * (y + 1) + boardHeight / 2, (boardDepth + ledDepth) / 2];
                led.position.set(translation[0], translation[1], translation[2]);
                board.add(led);
                this.leds.push(led);
            }
        }

        this.shape.add(board);
    }

    render() {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const on = this.actor.state[x][y];
                const led = this.leds[x * this.pixelY + y];
                if (on) {
                    const color = this.actor.state[x][y];
                    led.material.color.set(color);
                } else {
                    led.material.color.set(0x000000);
                }
            }
        }
    }
}

class StripDisplayActor {
    setup() {
        this.pixelX = this._cardData.pixelX || 16;
        this.pixelY = this._cardData.pixelY || 1;
        this.state = this.initialState(this.pixelX, this.pixelY);

        // this.random();
        this.showRainbow();
        this.wave();
    }

    initialState(x, y) {
        return new Array(x).fill(0).map(() => new Array(y).fill(0));
    }

    setPixel(x, y, color) {
        this.state[x][y] = color;
        // console.log("setPixel", this.state);
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return b | g << 8 | r << 16;
    }

    rotate(offset = 1) {
        const gcd = (x, y) => y ? gcd(y, x % y) : x;
        const arr = this.state;
        const n = arr.length;
        offset = offset % n;
        let count = gcd(offset, n);
        for (let start = 0; start < count; start++) {
            let current = start;
            let prev = arr[start];
            do {
                const next = (current + offset) % n;
                const temp = arr[next];
                arr[next] = prev;
                prev = temp;
                current = next;
            } while (start !== current);
        }
    }

    random() {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                this.setPixel(x, y, this.getRandomColor());
            }
        }
        this.say("render");
        this.future(100).random();
    }

    wave() {
        this.rotate(10);
        this.say("render");
        this.future(100).wave();
    }

    showRainbow(startHue = 1, endHue = 360) {
        const idiv = (x, y) => {
            return ((x | 0) / (y | 0)) | 0
        }

        startHue = startHue >> 0;
        endHue = endHue >> 0;
        const saturation = 100;
        const luminance = 50;
        const steps = this.pixelX;

        const h1 = startHue;
        const h2 = endHue;
        const hDistCW = ((h2 + 360) - h1) % 360;
        const hStep = idiv((hDistCW * 100), steps);

        const h1_100 = h1 * 100;

        const s1 = saturation;
        const sDist = saturation - s1;
        const sStep = idiv(sDist, steps);
        const s1_100 = s1 * 100;

        const l1 = luminance;
        const lDist = luminance - l1;
        const lStep = idiv(lDist, steps);
        const l1_100 = l1 * 100

        if (steps === 1) {
            this.setPixel(0, 0, this.hsl(h1 + hStep, s1 + sStep, l1 + lStep));
        } else {
            this.setPixel(0, 0, this.hsl(startHue, saturation, luminance));
            for (let i = 1; i < steps - 1; i++) {
                const h = idiv((h1_100 + i * hStep), 100) + 360;
                const s = idiv((s1_100 + i * sStep), 100);
                const l = idiv((l1_100 + i * lStep), 100);
                this.setPixel(i, 0, this.hsl(h, s, l));
            }
            this.setPixel(steps - 1, 0, this.hsl(endHue, saturation, luminance));
        }

        this.say("render");
    }

    hsl(h, s, l) {
        const idiv = (x, y) => {
            return ((x | 0) / (y | 0)) | 0
        }

        const clamp = (min, max, value) => {
            return Math.min(max, Math.max(min, value));
        }

        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = clamp(0, 99, s);
        l = clamp(0, 99, l);
        const c = idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000);
        const h1 = idiv(h, 60);
        const h2 = idiv((h - h1 * 60) * 256, 60);
        const temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        const x = (c * (256 - (temp))) >> 8;
        let r$;
        let g$;
        let b$;
        if (h1 === 0) {
            r$ = c;
            g$ = x;
            b$ = 0;
        } else if (h1 === 1) {
            r$ = x;
            g$ = c;
            b$ = 0;
        } else if (h1 === 2) {
            r$ = 0;
            g$ = c;
            b$ = x;
        } else if (h1 === 3) {
            r$ = 0;
            g$ = x;
            b$ = c;
        } else if (h1 === 4) {
            r$ = x;
            g$ = 0;
            b$ = c;
        } else if (h1 === 5) {
            r$ = c;
            g$ = 0;
            b$ = x;
        }
        const m = idiv((idiv((l * 2 << 8), 100) - c), 2);
        const r = r$ + m;
        const g = g$ + m;
        const b = b$ + m;

        return b | g << 8 | r << 16;
    }
}

class StripDisplayPawn {
    setup() {
        this.generatePixel();

        this.render();
        this.listen("render", "render");
    }

    generatePixel() {
        const THREE = Microverse.THREE;

        this.leds = [];
        this.pixelX = this.actor._cardData.pixelX || 16;
        this.pixelY = this.actor._cardData.pixelY || 1;
        const spacingCol = this.actor._cardData.spacingCol || 0.05;
        const spacingRow = this.actor._cardData.spacingRow || 0.05;
        const ledWidth = this.actor._cardData.ledWidth || 0.2;
        const ledHeight = this.actor._cardData.ledHeight || 0.2;
        const ledDepth = this.actor._cardData.ledDepth || 0.1;
        const boardWidth = this.actor._cardData.width ||= ledWidth * this.pixelX + spacingCol * (this.pixelX + 1);
        const boardHeight = this.actor._cardData.height ||= ledHeight * this.pixelY + spacingRow * (this.pixelY + 1);
        const boardDepth = this.actor._cardData.depth ||= 0.05;

        const board = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth, 2, 2, 2),
            new THREE.MeshBasicMaterial({color: 0x000000, toneMapped: false}),
        );

        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const led = new THREE.Mesh(
                    new THREE.BoxGeometry(ledWidth, ledHeight, ledDepth, 2, 2, 2),
                    new THREE.MeshBasicMaterial({color: 0x000000, toneMapped: false}));
                const translation = [(2 * x + 1) / 2 * ledWidth + spacingCol * (x + 1) - boardWidth / 2,
                    -(2 * y + 1) / 2 * ledHeight - spacingRow * (y + 1) + boardHeight / 2, (boardDepth + ledDepth) / 2];
                led.position.set(translation[0], translation[1], translation[2]);
                board.add(led);
                this.leds.push(led);
            }
        }

        this.shape.add(board);
    }

    render() {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const on = this.actor.state[x][y];
                const led = this.leds[x * this.pixelY + y];
                if (on) {
                    const color = this.actor.state[x][y];
                    led.material.color.set(color);
                } else {
                    led.material.color.set(0xFF0000);
                }
            }
        }
    }
}

class LEDActor {
    setup() {
        this.subscribe(this.id, "ledOn", "updateLed");
        this.subscribe(this.id, "ledOff", "updateLed");
    }

    updateLed({color, intensity}) {
        this.say("updateLed", {color, intensity});
    }
}

class LEDPawn {
    setup() {
        const THREE = Microverse.THREE;
        const width = this.actor._cardData.width || 0.2;
        const height = this.actor._cardData.height || 0.2;
        const depth = this.actor._cardData.depth || 0.1;

        this.led = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth, 2, 2, 2),
            new THREE.MeshBasicMaterial({color: 0x000000, toneMapped: false}));

        // if you try to increase the number of lights (change pixelX or pixelY), you may see the error:
        // Program Info Log: FRAGMENT shader uniforms count exceeds MAX_FRAGMENT_UNIFORM_VECTORS(1024)
        // you can comment out it temporarily
        this.light = new THREE.PointLight(0x000000, 0, 2);
        this.led.add(this.light);

        this.shape.add(this.led);

        this.listen("updateLed", "updateLed");
    }

    updateLed({color, intensity}) {
        this.led.material.color.set(color);
        this.light.color.set(color);
        this.light.intensity = intensity;
    }
}

export default {
    modules: [
        {
            name: "MbitDisplay",
            actorBehaviors: [MbitDisplayActor],
            pawnBehaviors: [MbitDisplayPawn]
        },
        {
            name: "BagDisplay",
            actorBehaviors: [BagDisplayActor],
            pawnBehaviors: [BagDisplayPawn]
        },
        {
            name: "PixelDisplay",
            actorBehaviors: [PixelDisplayActor],
            pawnBehaviors: [PixelDisplayPawn]
        },
        {
            name: "StripDisplay",
            actorBehaviors: [StripDisplayActor],
            pawnBehaviors: [StripDisplayPawn]
        },
        {
            name: "LED",
            actorBehaviors: [LEDActor],
            pawnBehaviors: [LEDPawn]
        }
    ]
}

/* globals Microverse */
