class OpenPortalActor {
    setup() {
        this.addEventListener("pointerTap", "pressed");
    }

    check() {
        const cards = this.queryCards({methodName: "isPortal"}, this);
        this.hasOpened = cards.length > 0;
    }

    isPortal(card) {
        return card.layers.includes("portal");
    }

    pressed() {
        this.check();
        if (this.hasOpened) {
            return;
        }
        this.hasOpened = true;

        this.createCard({
            translation: [-12.572904707142762, -0.37893816212634024, -5.187379803842383],
            rotation: [0, -Math.PI / 2, 0],
            scale: [1.54, 1.05, 1],
            layers: ["pointer"],
            className: "PortalActor",
            color: 16737996,
            cornerRadius: 0.05,
            depth: 0.05,
            frameColor: 8947848,
            portalURL: "?world=pixel",
            type: "2d",
            width: 1.8,
            height: 2.4,
        });

        this.say("portalChanged");
    }
}

class OpenPortalPawn {
    setup() {
        this.addEventListener("pointerMove", "nop");
        this.addEventListener("pointerEnter", "hilite");
        this.addEventListener("pointerLeave", "unhilite");
        this.makeButton();
        this.listen("portalChanged", "setColor");
    }

    setColor() {
        const baseColor = !this.actor.hasOpened
            ? (this.entered ? 0xeeeeee : 0xcccccc)
            : 0x22ff22;

        if (this.shape.children[0] && this.shape.children[0].material) {
            this.shape.children[0].material.color.setHex(baseColor);
        }
    }

    makeButton() {
        this.shape.children.forEach((c) => this.shape.remove(c));
        this.shape.children = [];

        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
        const material = new THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.8});
        const button = new THREE.Mesh(geometry, material);
        this.shape.add(button);
        this.setColor();
    }

    hilite() {
        this.entered = true;
        this.setColor();
    }

    unhilite() {
        this.entered = false;
        this.setColor();
    }
}

export default {
    modules: [
        {
            name: "OpenPortalButton",
            actorBehaviors: [OpenPortalActor],
            pawnBehaviors: [OpenPortalPawn]
        }
    ]
}
