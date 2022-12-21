class BlocksGUIPawn {
    setup() {
        const editor = document.getElementById("editor");
        if (editor) {
            editor.remove();
        }
        const div = document.createElement("div");
        div.innerHTML = `<div id="editor" style="
                z-index: 1;
                position: absolute;
                bottom: 10px;
                right: 10px;
                white-space: nowrap;
                padding: 8px;
                color: white;
                text-shadow: 2px 2px 2px rgb(0 0 0 / 50%);
                border-radius: 8px; 
                background-color: rgba(0, 0, 0, 0.5);
                display: none;">
                <button id="close-editor-button" type="button" class="btn btn-danger btn-x topleft">x</button>
                <p style="font-size: 12px; margin: 0;">Snap<em>!</em></p>
                <canvas id="snap" tabindex="1" width="450" height="600"></canvas>
            </div>`;
        const wrapper = div.firstChild;
        for (const event of ["keydown", "keyup",
            "click", "mousedown", "mouseup", "mousemove", "wheel",
            "touchstart", "touchend", "touchmove", "touchcancel",
            "pointerdown", "pointerup", "pointermove", "pointercancel",
        ]) {
            wrapper[`on${event}`] = event => event.stopPropagation();
        }
        document.body.appendChild(wrapper);
        const button = document.getElementById("close-editor-button");
        button.onclick = () => {
            const editor = document.getElementById("editor");
            editor.style.display = "none";
        }

        const ide = new IDE_Morph({
            path: "./lib/snap",
            load: "./blocks/inline.xml",
            lang: "zh_CN",
            design: "flat",
            border: 1,
            hideControls: true,
            hideCategories: true,
            noSprites: true,
            // noImports: true,
            noOwnBlocks: true,
            noRingify: true,
            noUserSettings: true
        });
        const loop = () => {
            requestAnimationFrame(loop);
            window.world.doOneCycle();
        };
        window.world = new WorldMorph(document.getElementById("snap"), false);
        ide.openIn(window.world);
        requestAnimationFrame(loop);
    }
}

class SpriteManagerActor {
    setup() {
        this.cards = this.queryCards();
    }
}

class SpriteManagerPawn {
    setup() {
        this.handler = () => this.start();
        document.addEventListener("click", this.handler);
    }

    start() {
        const ide = window.world.children[0];
        this.actor.cards.forEach(card => {
            const sprite = new SpriteMorph(ide.globalVariables);
            const spriteName = `${card.name}-${card.id}`;
            sprite.name = ide.newSpriteName(spriteName);
            ide.stage.add(sprite);
            ide.sprites.add(sprite);
            ide.corral.addSprite(sprite);
        });
        document.removeEventListener('click', this.handler);
        delete this.handler;
    }
}

class BlocksEditorActor {
    setup() {
        this.initialScale = this.scale;
    }
}

class BlocksEditorPawn {
    setup() {
        this.addEventListener("pointerDown", this.pointerDown.bind(this));
    }

    pointerDown(e) {
        if (e.shiftKey) {
            const editor = document.getElementById("editor");
            const ide = window.world.children[0];
            const spriteName = `${this.actor.name}-${this.actor.id}`;
            const sprite = ide.sprites.asArray().filter((morph) => morph.name === spriteName)[0];
            editor.style.display = "";
            ide.addMessageListener("setPropertyTo", data => this.setPropertyTo(data));
            ide.selectSprite(sprite);
        } else {
            const ide = window.world.children[0];
            let message = 'click';
            // broadcast to Snap
            ide.broadcast(message);
        }
    }

    setPropertyTo(data){
        // data: list(spriteName, property, args)
        const [spriteNameFromSnap, property, argsData] = data.asArray();
        const args = argsData.asArray();
        const spriteName = `${this.actor.name}-${this.actor.id}`;
        if (spriteNameFromSnap === spriteName) {
            this.set({[property]: args}); 
        }
    }

}

export default {
    modules: [
        {
            name: "BlocksGUI",
            pawnBehaviors: [BlocksGUIPawn],
        },
        {
            name: "SpriteManager",
            actorBehaviors: [SpriteManagerActor],
            pawnBehaviors: [SpriteManagerPawn]
        },
        {
            name: "BlocksEditor",
            actorBehaviors: [BlocksEditorActor],
            pawnBehaviors: [BlocksEditorPawn]
        }
    ]
}
