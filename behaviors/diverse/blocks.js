class BlocksGUIPawn {
    setup() {
        this._isBroadcastingMessage = false;
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
        // this.publish("doCommand", "done", messageId);
        this.subscribe("doCommand", "done", "_doCommandDone");
        requestAnimationFrame(loop);
    }

    doCommand(options) {
        const PREFIX = "blocks";
        const [cardId, messageId, _, command, argsList] = options.asArray(); // ignore _ ("wait")
        const args = argsList.asArray();
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
                data = [cardId, ...args];
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
        this.publish(scope, event, [data, messageId]);
    }

    _doCommandDone(messageId) {
        const ide = window.world?.children[0];
        if (ide) {
            let payload = new List([messageId]);

            if (!this._isBroadcastingMessage){
                this._isBroadcastingMessage = true;
                ide.broadcast("_doCommandDone", this._broadcastCallback.bind(this), payload);
                // setTimeout(() => {this._isBroadcastingMessage = false}, 1000);
            } else {
                // wait 1/1000 second and retry;
                setTimeout(() => {this._doCommandDone(messageId)}, 1);
            }
        }
    }

    _broadcastCallback(){
        this._isBroadcastingMessage = false;
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
            const spriteName = this.actor.spriteName;
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
        this.subscribe(this.id, `${PREFIX}:setTranslation`, this._set);
        this.subscribe(this.id, `${PREFIX}:setRotation`, this._set);
        this.subscribe(this.id, `${PREFIX}:setScale`, this._set);
        this.subscribe(this.id, `${PREFIX}:translateTo`, this._translateTo);
        this.subscribe(this.id, `${PREFIX}:rotateTo`, this._rotateTo);
        this.subscribe(this.id, `${PREFIX}:scaleTo`, this._scaleTo);
        this.subscribe(this.id, `${PREFIX}:move`, this.move);
        this.subscribe(this.id, `${PREFIX}:turn`, this.turn);
        this.subscribe(this.id, `${PREFIX}:roll`, this.roll);
        this.addEventListener("pointerTap", "mouseClickLeft");
        this.addEventListener("pointerDown", "mouseDownLeft");
        this.addEventListener("pointerEnter", "mouseEnter");
        this.addEventListener("pointerLeave", "mouseLeave");
        this.addEventListener("pointerMove", "nop");
    }

    _set(options) {
        const [data, messageId] = options;
        this.set(data);
        this.publish("doCommand", "done", messageId);
    }

    _translateTo(options) {
        const [data, messageId] = options;
        this.translateTo(data);
        this.publish("doCommand", "done", messageId);
    }

    _rotateTo(options) {
        const [data, messageId] = options;
        this.rotateTo(data);
        this.publish("doCommand", "done", messageId);
    }

    _scaleTo(options) {
        const [data, messageId] = options;
        this.scaleTo(data);
        this.publish("doCommand", "done", messageId);
    }

    move(options) {
        const [[dir, dist], messageId] = options;
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
        // done, publish it to Snap
        this.publish("doCommand", "done", messageId);
    }

    turn(options) {
        const [[dir, angle], messageId] = options;
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
        this.publish("doCommand", "done", messageId);
    }

    roll(options) {
        const [[dir, angle], messageId] = options;
        switch (dir) {
            case "left":
                this.rotateZ(angle);
                break;
            case "right":
                this.rotateZ(-angle);
                break;
        }
        this.publish("doCommand", "done", messageId);
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

    mouseClickLeft() {
        this.say("interaction", "clicked");
    }

    mouseDownLeft() {
        this.say("interaction", "pressed");
    }

    mouseEnter() {
        this.say("interaction", "mouse-entered");
    }

    mouseLeave() {
        this.say("interaction", "mouse-departed");
    }
}

class BlocksHandlerPawn {
    setup() {
        this.listen("interaction", this.receiveUserInteraction);
    }

    receiveUserInteraction(interaction) {
        const ide = window.world?.children[0];
        if (ide) {
            const sprite = ide.sprites.asArray().filter((morph) => morph.name === this.actor.spriteName)[0];
            sprite?.receiveUserInteraction(interaction);
        }
    }
}

class SpriteManagerActor {
    setup() {
        this.subscribe("spriteManager", "duplicateCard", this.duplicateCard);
        this.subscribe("spriteManager", "removeCard", this.removeCard);
    }

    duplicateCard(options) {
        const [[cardId, exemplarName], messageId] = options;
        const target = this.queryCards().filter(card => card.id === cardId)[0];
        const data = target.collectCardData();
        const newCard = this.createCard(data);
        newCard.addLayer("clone");
        console.log("duplicate target card", target);
        console.log("new card", newCard);
        this.publish("spriteManager", "cloneSprite", [newCard, exemplarName]);
    }

    removeCard(options) {
        const [cardId, messageId] = options;
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