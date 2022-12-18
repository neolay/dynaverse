class SpriteSoundPawn {
    setup() {
        this.audio = new Audio(this.actor._cardData.sound);
        this.audio.loop = this.actor._cardData.loop || false;
        this.addEventListener("pointerDown", "update");
    }

    update() {
        if (this.playing) {
            this.stop();
        } else {
            this.play();
        }
    }

    play() {
        if (this.audio) {
            this.audio.currentTime = 0;
            this.audio.play();
        }
        this.playing = true;
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
        }
        this.playing = false;
    }
}

export default {
    modules: [
        {
            name: "SpriteSound",
            pawnBehaviors: [SpriteSoundPawn]
        }
    ]
}

/* globals Microverse */
