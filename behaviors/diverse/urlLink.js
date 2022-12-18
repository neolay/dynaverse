class URLPawn {
    setup() {
        this.addEventListener("pointerTap", "tap");
        this.addEventListener("pointerEnter", "enter");
        this.addEventListener("pointerLeave", "leave");
        this.addEventListener("pointerMove", "move");
    }

    tap() {
        let div = document.createElement("div");
        let url = this.actor._cardData.cardURL
        if (url) {
            div.innerHTML = `<a id="link" target="_blank" rel="noopener noreferrer" href="${url}"></a>`;
            let a = div.querySelector("#link");
            a.click();
            div.remove();
        }
    }

    enter() {
        let hilite = this.actor._cardData.cardHilite || 0xffffaa;
        this.doHilite(hilite); // hilite in yellow
    }

    leave() {
        this.doHilite(null);
    }

    move() {

    }

    doHilite(hval) {
        this.shape.traverse((m) => {
            if (m.material) {
                if (!Array.isArray(m.material)) {
                    this.setColor(m.material, hval);
                } else {
                    m.material.forEach((mm) => this.setColor(mm, hval));
                }
            }
        });
    }

    setColor(material, color) {
        if (color) {
            let c = new Microverse.THREE.Color(color);
            material.saveColor = material.color;
            material.color = c;
        } else {
            material.color = material.saveColor;
        }
    }

    teardown() {
        this.removeEventListener("pointerTap", "tap");
        this.removeEventListener("pointerEnter", "enter");
        this.removeEventListener("pointerLeave", "leave");
        this.removeEventListener("pointerMove", "move");
    }
}

export default {
    modules: [
        {
            name: "URLLink",
            pawnBehaviors: [URLPawn]
        }
    ]
}

/* globals Microverse */
