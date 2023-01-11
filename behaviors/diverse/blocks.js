class BlocksGUIPawn {
    setup() {
        const editor = document.getElementById("editor");
        if (editor) {
            return;
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
                <p style="font-size: 12px; margin: 0; text-align: center;">
                <span>DynaverseBlocks</span>
                <span id="card-tag"></span>
                </p>
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
        ide.addMessageListener("doCommand", options => this.doCommand(options));
        requestAnimationFrame(loop);
    }

    doCommand(options) {
        const PREFIX = "blocks";
        const [cardId, command, args] = options.asArray();
        console.log("received", command, options);
        let scope = cardId,
            event = `${PREFIX}:${command}`,
            data;
        switch (command) {
            case "setTranslation":
                data = {translation: args};
                break;
            case "setRotation":
                data = {rotation: Microverse.q_euler(...args)};
                break;
            case "setScale":
                data = {scale: args};
                break;
            case "rotateTo":
                data = Microverse.q_euler(...args);
                break;
            case "createCardClone":
                scope = "spriteManager";
                event = "duplicateCard";
                data = [cardId, args];
                break;
            case "removeCardClone":
                scope = "spriteManager";
                event = "removeCard";
                data = cardId;
                break;
            case "translateTo":
            case "scaleTo":
            case "move":
            case "turn":
            case "roll":
                data = args;
                break;
        }
        this.publish(scope, event, data);
    }

    teardown() {
        const ide = window.world?.children[0];
        if (ide) {
            const editor = document.getElementById("editor");
            editor.style.display = "none";
            ide.stop();
        }
    }
}

class BlocksEditorPawn {
    setEditor() {
        const ide = window.world?.children[0];
        if (ide) {
            const editor = document.getElementById("editor");
            const tag = document.getElementById("card-tag");
            const spriteName = `${this.actor.name}-${this.actor.id}`;
            const sprite = ide.sprites.asArray().filter((morph) => morph.name === spriteName)[0];
            if (sprite) {
                ide.selectSprite(sprite);
                tag.textContent = ` - ${spriteName}`;
                editor.style.display = "";
            }
        }
    }
}

class BlocksHandlerActor {
    setup() {
        const PREFIX = "blocks";
        this.subscribe(this.id, `${PREFIX}:setTranslation`, this.set);
        this.subscribe(this.id, `${PREFIX}:setRotation`, this.set);
        this.subscribe(this.id, `${PREFIX}:setScale`, this.set);
        this.subscribe(this.id, `${PREFIX}:translateTo`, this.translateTo);
        this.subscribe(this.id, `${PREFIX}:rotateTo`, this.rotateTo);
        this.subscribe(this.id, `${PREFIX}:scaleTo`, this.scaleTo);
        this.subscribe(this.id, `${PREFIX}:move`, this.move);
        this.subscribe(this.id, `${PREFIX}:turn`, this.turn);
        this.subscribe(this.id, `${PREFIX}:roll`, this.roll);
    }

    move(options) {
        const [dir, dist] = options;
        switch (dir) {
            case "left":
                this.translateX(dist);
                break;
            case "right":
                this.translateX(-dist);
                break;
            case "forward" :
                this.translateZ(dist);
                break;
            case "backward":
                this.translateZ(-dist);
                break;
            case "up":
                this.translateY(dist);
                break;
            case "down":
                this.translateY(-dist);
                break;
        }
    }

    turn(options) {
        const [dir, angle] = options;
        switch (dir) {
            case "forward":
                this.rotateX(-angle);
                break;
            case "backward":
                this.rotateX(angle);
                break;
            case "left":
                this.rotateY(angle);
                break;
            case "right":
                this.rotateY(-angle);
                break;
        }

    }

    roll(options) {
        const [dir, angle] = options;
        switch (dir) {
            case "left":
                this.rotateZ(angle);
                break;
            case "right":
                this.rotateZ(-angle);
                break;
        }
    }

    translateOnAxis(axis, dist) {
        const relative = Microverse.v3_scale(axis, dist);
        const move = Microverse.v3_transform(relative, Microverse.m4_rotationQ(this.rotation));
        const v = Microverse.v3_add(this.translation, move);
        this.translateTo(v);
    }

    translateX(dist) {
        this.translateOnAxis(Microverse._xAxis, dist);
    }

    translateY(dist) {
        this.translateOnAxis(Microverse._yAxis, dist);
    }

    translateZ(dist) {
        this.translateOnAxis(Microverse._zAxis, dist);
    }

    rotateOnAxis(axis, angle) {
        const axisAngle = Microverse.q_axisAngle(axis, angle);
        const q = Microverse.q_multiply(this.rotation, axisAngle);
        this.rotateTo(q);
    }

    rotateX(angle) {
        this.rotateOnAxis(Microverse._xAxis, angle);
    }

    rotateY(angle) {
        this.rotateOnAxis(Microverse._yAxis, angle);
    }

    rotateZ(angle) {
        this.rotateOnAxis(Microverse._zAxis, angle);
    }
}

class BlocksHandlerPawn {
    setup() {

    }
}

class SpriteManagerActor {
    setup() {
        this.subscribe("spriteManager", "duplicateCard", this.duplicateCard);
        this.subscribe("spriteManager", "removeCard", this.removeCard);
    }

    duplicateCard(options) {
        const [cardId, exemplarName] = options;
        const target = this.queryCards().filter(card => card.id === cardId)[0];
        const data = target.collectCardData();
        data.layers = data.layers.concat(["clone"]);
        const newCard = this.createCard(data);
        console.log("duplicate target card", target);
        console.log("new card", newCard);
        this.publish("spriteManager", "cloneSprite", [newCard, exemplarName]);
    }

    removeCard(cardId) {
        const target = this.queryCards().filter(card => card.id === cardId)[0];
        target.destroy();
    }
}

class SpriteManagerPawn {
    setup() {
        this.subscribe("spriteManager", "cloneSprite", this.cloneSprite);
        this.subscribe("spriteManager", "removeSprite", this.removeSprite);
        this.cards = this.actor.queryCards().filter(card => card.layers.includes("pointer"));
        this.handler = () => this.start();
        document.addEventListener("click", this.handler);
    }

    start() {
        const ide = window.world?.children[0];
        if (ide) {
            this.cards.forEach(card => {
                this.addSprite(card);
            });
        }
        document.removeEventListener("click", this.handler);
        delete this.handler;
    }

    cloneSprite(options) {
        const ide = window.world?.children[0];
        if (ide) {
            const [newCard, exemplarName] = options;
            const exemplar = ide.sprites.asArray().filter((morph) => morph.name === exemplarName)[0];
            const stage = exemplar.parentThatIsA(StageMorph);
            const clone = exemplar.fullCopy(true);
            clone.card = newCard;
            clone.clonify(stage, true);
            console.log("exemplar sprite", exemplar);
            console.log("cloned sprite", clone);
        }
    }

    removeSprite(spriteName) {
        const ide = window.world?.children[0];
        if (ide) {
            ide.sprites.asArray().forEach(morph => {
                if (morph.name === spriteName) {
                    const editor = document.getElementById("editor");
                    editor.style.display = "none";
                    ide.removeSprite(morph);
                }
            });
        }
    }
}

export default {
    modules: [
        {
            name: "BlocksGUI",
            pawnBehaviors: [BlocksGUIPawn]
        },
        {
            name: "BlocksEditor",
            pawnBehaviors: [BlocksEditorPawn]
        },
        {
            name: "BlocksHandler",
            actorBehaviors: [BlocksHandlerActor],
            pawnBehaviors: [BlocksHandlerPawn]
        },
        {
            name: "SpriteManager",
            actorBehaviors: [SpriteManagerActor],
            pawnBehaviors: [SpriteManagerPawn]
        }
    ]
}

/* globals Microverse */