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
                <p style="font-size: 12px; margin: 0;">DynaverseBlocks</p>
                <canvas id="snap" tabindex="1" width="585" height="600"></canvas>
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

        const config = {
            path: "./lib/snap",
            load: "./blocks/inline.xml",
            design: "flat",
            border: 1,
            // hideControls: true,
            // hideCategories: true,
            noSprites: true,
            // noImports: true,
            // noOwnBlocks: true,
            noRingify: true,
            noUserSettings: true,
            categories: [
                "motion",
                "looks",
                "control",
                "sensing",
                "operators",
                "variables",
            ]
        }
        const lang = this.actor._cardData.lang;
        if (lang) {
            config.lang = lang;
        }
        const ide = new IDE_Morph(config);
        const loop = () => {
            requestAnimationFrame(loop);
            window.world.doOneCycle();
        };
        window.world = new WorldMorph(document.getElementById("snap"), false);
        ide.openIn(window.world);
        ide.addMessageListener("_setPropertyTo", data => this.publish("blocks", "_setPropertyTo", data.asArray()));
        ide.addMessageListener("scaleTo", data => this.publish("blocks", "scaleTo", data.asArray()));
        ide.addMessageListener("_queryActorData", data => this.publish("blocks", "_queryActorData", data.asArray()));
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
        this.subscribe("removeSprite", "removeSprite", this.removeSprite);
        this.handler = () => this.start();
        document.addEventListener("click", this.handler);
    }

    start() {
        const ide = window.world.children[0];
        if (ide) {
            this.actor.cards.forEach(card => {
                const sprite = new SpriteMorph(ide.globalVariables);
                const spriteName = `${card.name}-${card.id}`;
                sprite.name = ide.newSpriteName(spriteName);
                ide.stage.add(sprite);
                ide.sprites.add(sprite);
                ide.corral.addSprite(sprite);
            });
        }
        document.removeEventListener("click", this.handler);
        delete this.handler;
    }

    removeSprite(data) {
        const ide = window.world.children[0];
        if (ide) {
            ide.sprites.asArray().forEach(morph => {
                if (morph.name === data) {
                    const editor = document.getElementById("editor");
                    editor.style.display = "none";
                    ide.removeSprite(morph);
                }
            });
        }
    }
}

class BlocksEditorPawn {
    setEditor() {
        this.subscribe("blocks", "_setPropertyTo", this._setPropertyTo);
        this.subscribe("blocks", "scaleTo", this._scaleTo);
        this.subscribe("blocks", "_queryActorData", this._queryActorData);

        const editor = document.getElementById("editor");
        const ide = window.world.children[0];
        const spriteName = `${this.actor.name}-${this.actor.id}`;
        const sprite = ide.sprites.asArray().filter((morph) => morph.name === spriteName)[0];
        if (sprite) {
            ide.selectSprite(sprite);
            editor.style.display = "";
        }
    }

    _setPropertyTo(data) {
        // data: list(spriteName, property, args)
        const [spriteNameFromSnap, property, argsData] = data;
        const args = argsData.asArray();
        const spriteName = `${this.actor.name}-${this.actor.id}`;
        if (spriteNameFromSnap === spriteName) {
            if (args.length > 0 && args[0] === "q_euler") {
                this.set({[property]: Microverse.q_euler(args[1], args[2], args[3])});
                return
            }
            this.set({[property]: args});
        }
    }

    _scaleTo(data) {
        const [spriteNameFromSnap, percent] = data;
        const spriteName = `${this.actor.name}-${this.actor.id}`;
        if (spriteNameFromSnap === spriteName) {
            const scale = this.actor._initialData.scale.map(x => x * percent / 100);
            this.scaleTo(scale);
        }
    }

    _queryActorData(data){
        // use message_id(globally unique), no need to specify spriteName
        // debugger;
        const message_id = data[0];
        let ide = window.world.children[0];
        let payload = new List([message_id, new List([new List(this.actor.translation), new List(this.actor.rotation), new List(this.actor.scale)])]);
        ide.broadcast("_responseToReporter", null, payload);
    }

    tick() {
        //
    }

    broadcastClick() {
        if (window.world) {
            const ide = window.world.children[0];
            let spriteName = `${this.actor.name}-${this.actor.id}`;
            let payload = new List([spriteName]);
            // broadcast to Snap
            ide.broadcast("click", null, payload); // todo send to Sprite
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
            pawnBehaviors: [BlocksEditorPawn]
        }
    ]
}
