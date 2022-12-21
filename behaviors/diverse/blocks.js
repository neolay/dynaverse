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
        ide.addMessageListener("setPropertyTo", data => this.publish("blocks", "setPropertyTo", data.asArray()));
        requestAnimationFrame(loop);
    }
}

class SpriteManagerActor {
    setup() {
        this.cards = this.queryCards().filter(card => card.layers.includes("pointer"));
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
        document.removeEventListener("click", this.handler);
        delete this.handler;
    }
}

class BlocksEditorPawn {
    setEditor() {
        this.subscribe("blocks", "setPropertyTo", this.setPropertyTo);

        const editor = document.getElementById("editor");
        const ide = window.world.children[0];
        const spriteName = `${this.actor.name}-${this.actor.id}`;
        const sprite = ide.sprites.asArray().filter((morph) => morph.name === spriteName)[0];
        ide.selectSprite(sprite);
        editor.style.display = "";
    }

    setPropertyTo(data) {
        // data: list(spriteName, property, args)
        const [spriteNameFromSnap, property, argsData] = data;
        const args = argsData.asArray();
        const spriteName = `${this.actor.name}-${this.actor.id}`;
        if (spriteNameFromSnap === spriteName) {
            this.set({[property]: args});
        }
    }

    tick(){
        let spriteName = `${this.name}-${this.id}`;
        // Make sure world already exists
        if (window.world){
            let ide = window.world.children[0];
            // List from Snap! list.js
            let payload = new List([spriteName, new List(this.translation), new List(this.rotation), new List(this.scale)]);
            ide.broadcast("updateCardData", null, payload);
        }
        // sent together will cause overwriting. This is a temporary solution
        this.future(20 + 20 * this.random()).tick();
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
            pawnBehaviors: [BlocksEditorPawn]
        }
    ]
}
