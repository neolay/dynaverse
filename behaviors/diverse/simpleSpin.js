class SpinningActor {
    setup() {
        this.spinning = true; // start with spinning
        this.angle = 0; // the initial angle
        this.spinSpeed = 0.01; // how fast will we spin (in radians)
        this.addEventListener("pointerDown", "toggle");
        this.step();
    }

    step() {
        if (!this.spinning) {
            return;
        }
        this.future(20).step();
        this.angle += this.spinSpeed;
        this.set({rotation: Microverse.q_euler(this.angle, Math.PI / 2, 0)});
    }

    toggle() {
        this.spinning = !this.spinning;
        if (this.spinning) this.step();
    }

    teardown() {
        this.removeEventListener("pointerDown", "toggle");
        this.spinning = false;
    }
}

export default {
    modules: [
        {
            name: "SimpleSpin",
            actorBehaviors: [SpinningActor],
        }
    ]
}

/* globals Microverse */
