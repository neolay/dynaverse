class BlocksEditorPawn {
    setEditor() {
        const ide = window.world?.children[0];
        if (ide) {
            const spriteName = this.actor.spriteName;
            const sprite = ide.sprites.asArray().filter((morph) => morph.name === spriteName)[0];
            if (sprite) {
                ide.selectSprite(sprite);
            }
        }
    }
}

class BlocksHandlerActor {
    setup() {
        const PREFIX = "blocks";
        this.listen(`${PREFIX}:setTranslation`, this._setTranslation);
        this.listen(`${PREFIX}:setRotation`, this._setRotation);
        this.listen(`${PREFIX}:setScale`, this._setScale);
        this.listen(`${PREFIX}:translateTo`, this._translateTo);
        this.listen(`${PREFIX}:rotateTo`, this._rotateTo);
        this.listen(`${PREFIX}:scaleTo`, this._scaleTo);
        this.listen(`${PREFIX}:move`, this.move);
        this.listen(`${PREFIX}:turn`, this.turn);
        this.listen(`${PREFIX}:roll`, this.roll);
    }

    _setTranslation(options) {
        const [messageId, args] = options;
        this.set({translation: args});
        this.say('blocks:doneMessage', messageId);
    }

    _setRotation(options) {
        const [messageId, args] = options;
        this.set({rotation: Microverse.q_euler(...args)});
        this.say('blocks:doneMessage', messageId);
    }

    _setScale(options) {
        const [messageId, args] = options;
        this.set({scale: args});
        this.say('blocks:doneMessage', messageId);
    }

    _translateTo(options) {
        const [messageId, args] = options;
        this.translateTo(args);
        this.say('blocks:doneMessage', messageId);
    }

    _rotateTo(options) {
        const [messageId, args] = options;
        this.rotateTo(Microverse.q_euler(...args));
        this.say('blocks:doneMessage', messageId);
    }

    _scaleTo(options) {
        const [messageId, args] = options;
        this.scaleTo(args);
        this.say('blocks:doneMessage', messageId);
    }

    move(options) {
        const [messageId, [dir, dist]] = options;
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
        this.say('blocks:doneMessage', messageId);
    }

    turn(options) {
        const [messageId, [dir, angle]] = options;
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
        this.say('blocks:doneMessage', messageId);
    }

    roll(options) {
        const [messageId, [dir, angle]] = options;
        switch (dir) {
            case "left":
                this.rotateZ(angle);
                break;
            case "right":
                this.rotateZ(-angle);
                break;
        }
        this.say('blocks:doneMessage', messageId);
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
        this.addEventListener("pointerTap", "mouseClickLeft");
        this.addEventListener("pointerDown", "mouseDownLeft");
        this.addEventListener("pointerEnter", "mouseEnter");
        this.addEventListener("pointerLeave", "mouseLeave");
        this.addEventListener("pointerMove", "nop");
    }

    mouseClickLeft() {
        this.receiveUserInteraction('clicked');
    }

    mouseDownLeft() {
        this.receiveUserInteraction('pressed');
    }

    mouseEnter() {
        this.receiveUserInteraction('mouse-entered');
    }

    mouseLeave() {
        this.receiveUserInteraction('mouse-departed');
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
        const [_, [cardId, exemplarName]] = options;
        const target = this.queryCards().filter(card => card.id === cardId)[0];
        const data = target.collectCardData();
        const newCard = this.createCard(data);
        newCard.addLayer("clone");
        console.log("duplicate target card", target);
        console.log("new card", newCard);
        this.publish("spriteManager", "cloneSprite", [newCard, exemplarName]);
        // this.publish(cardId, 'blocks:doneMessage', messageId);
    }

    removeCard(options) {
        const [_, [cardId]] = options;
        const target = this.queryCards().filter(card => card.id === cardId)[0];
        // this.publish(cardId, 'blocks:doneMessage', messageId);
        // destroy will alse destroy listener.
        target.destroy();
        // setTimeout(() => {}, 100);
    }
}

class SpriteManagerPawn {
    setup() {
        this.subscribe("spriteManager", "cloneSprite", this.cloneSprite);
        this.subscribe("spriteManager", "removeSprite", this.removeSprite);
        this.removeSprite(localize('Sprite'));
    }

    cloneSprite(options) {
        const ide = window.world?.children[0];
        if (ide) {
            const [newCard, exemplarName] = options;
            const exemplar = ide.sprites.asArray().filter((morph) => morph.name === exemplarName)[0];
            const stage = exemplar.parentThatIsA(StageMorph);
            const clone = exemplar.fullCopy(true);
            clone.cardPawn = this.service("PawnManager").get(newCard.id);
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
                    ide.removeSprite(morph);
                }
            });
        }
    }
}

export default {
    modules: [
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
