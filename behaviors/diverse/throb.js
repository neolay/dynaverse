class ThrobActor {
    setup() {
        console.log("addEventListener");
        this.addEventListener("pointerTap", "start");
    }

    start() {
        if (this.throbStartTime) {
            return;
        }
        this.throbStartTime = this.now();
        this.startScale = this.scale;
        this.animation();
    }

    getScale(time, period = 1000) {
        let half = period / 2;
        let third = time % period;
        if (third < half) {
            return third / half;
        }
        return (period - third) / half;
    }

    animation() {
        if (!this.throbStartTime) {
            return;
        }
        let now = this.now();
        let offset = now - this.throbStartTime;

        let throbTimes = this._cardData.throbTimes;
        if (offset >= 1000 * throbTimes) {
            this.scaleTo(this.startScale);
            delete this.throbStartTime;
            return;
        }

        let scaleOffset = this.getScale(offset, 3000 / 3);
        let scale = [
            this.startScale[0] + 0.2 * scaleOffset,
            this.startScale[1] + 0.2 * scaleOffset,
            this.startScale[2] + 0.2 * scaleOffset
        ];
        this.scaleTo(scale);
        this.future(50).animation();
    }

    teardown() {
        console.log("removeEventListener");
        this.removeEventListener("pointerTap", "start");
    }
}

export default {
    modules: [
        {
            name: "Throb",
            actorBehaviors: [ThrobActor],
        },
    ]
}

/* globals Microverse */
