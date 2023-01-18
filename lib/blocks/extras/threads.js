Process.prototype.move = function (dir, dist) {
    const cmd = 'move';
    dir = this.inputOption(dir);
    const args = [dir, dist];
    this.publishAndWait('id', cmd, args);
};

Process.prototype.turnTo = function (dir, deg) {
    const cmd = 'turn';
    dir = this.inputOption(dir);
    const rad = deg * Math.PI / 180;
    const args = [dir, rad];
    this.publishAndWait('id', cmd, args);
};

Process.prototype.rollTo = function (dir, deg) {
    const cmd = 'roll';
    dir = this.inputOption(dir);
    const rad = deg * Math.PI / 180;
    const args = [dir, rad];
    this.publishAndWait('id', cmd, args);
};

Process.prototype.translateTo = function (x, y, z) {
    const cmd = 'translateTo';
    const args = [x, y, z];
    this.publishAndWait('id', cmd, args);
};

Process.prototype.rotateTo = function (x, y, z) {
    const cmd = 'rotateTo';
    const args = [x, y, z];
    this.publishAndWait('id', cmd, args);
};

Process.prototype.setTranslation = function (x, y, z) {
    const cmd = 'setTranslation';
    const args = [x, y, z];
    this.publishAndWait('id', cmd, args);
};

Process.prototype.setRotation = function (x, y, z) {
    const cmd = 'setRotation';
    const args = [x, y, z];
    this.publishAndWait('id', cmd, args);
};

Process.prototype.scaleTo = function (x, y, z) {
    const cmd = 'scaleTo';
    const args = [x, y, z];
    this.publishAndWait('id', cmd, args);
};

Process.prototype.setScale = function (x, y, z) {
    const cmd = 'setScale';
    const args = [x, y, z];
    this.publishAndWait('id', cmd, args);
};

Process.prototype.createCardClone = function () {
    const thisObj = this.blockReceiver();
    const cardId = thisObj.getCardProperty("id");
    const args = [cardId, thisObj.name];
    this.publish('spriteManager', 'duplicateCard', args);
};

Process.prototype.removeCardClone = function () {
    const thisObj = this.blockReceiver();
    const cardId = thisObj.getCardProperty("id");
    const args = [cardId];
    thisObj.removeClone();
    this.publish('spriteManager', 'removeCard', args);
};

Process.prototype.doPublish = function (event, options) {
    const scope = this.inputOption(options.at(1)) || 'id';
    let data = options.at(2);
    if (event) {
        if (data) {
            this.publish(scope, event, data);
        } else {
            this.publish(scope, event);
        }
    }
};

Process.prototype.doPublishAndWait = function (event, options) {
    const scope = this.inputOption(options.at(1)) || 'id';
    let data = options.at(2);
    if (event) {
        if (data) {
            this.publishAndWait(scope, event, data);
        } else {
            this.publishAndWait(scope, event);
        }
    }
};

Process.prototype.publish = function (scope, event, data) {
    const thisObj = this.blockReceiver();
    const cardPawn = thisObj.cardPawn;
    if (cardPawn) {
        const messageId = Math.floor(Math.random() * 1000000000);
        if (data instanceof List) {
            if (data.canBeJSON()) {
                data = JSON.parse(data.asJSON());
            } else {
                throw new Error('unsupported type');
            }
        }
        data = [messageId, data];
        if (scope === 'id') {
            event = `blocks:${event}`;
            cardPawn.say(event, data);
        } else {
            cardPawn.publish(scope, event, data);
        }
        console.log("cardPawn", thisObj.cardPawn, "publish", scope, event, data);
        return messageId;
    } else {
        throw new Error('card does not exist');
    }
};

Process.prototype.publishAndWait = function (scope, event, data) {
    const thisObj = this.blockReceiver();
    const cardPawn = thisObj.cardPawn;
    if (cardPawn) {
        if (!this.context.accumulator) {
            this.context.accumulator = {done: false};
            if (!thisObj._accumulatorWait) {
                thisObj._accumulatorWait = {};
            }
            if (!thisObj._doneMessageListeners){
                // class scope
                thisObj._doneMessageListeners = [];
            }
            if (!thisObj._doneMessageListeners.includes(cardPawn.actor.id)){
                // this.cardPawn.listen('blocks:doneMessage', this._handleDoneMessage.bind(this));
                cardPawn.listen('blocks:doneMessage', this._handleDoneMessage.bind(this));
                thisObj._doneMessageListeners.push(cardPawn.actor.id);
            }
            
            const messageId = this.publish(scope, event, data);
            thisObj._accumulatorWait[messageId] = this;
        } else if (this.context.accumulator.done) {
            return;
        }
        this.pushContext('doYield');
        this.pushContext();
    } else {
        throw new Error('card does not exist');
    }
};

Process.prototype._handleDoneMessage = function (messageId) {
    const thisObj = this.blockReceiver();
    console.log("_handleDoneMessage", Object.keys(thisObj._accumulatorWait).length, thisObj._accumulatorWait, messageId);
    if (thisObj._accumulatorWait[messageId]){
        thisObj._accumulatorWait[messageId].context.accumulator.done = true;
        delete thisObj._accumulatorWait[messageId];
    }
}