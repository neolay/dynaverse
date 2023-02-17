SpriteMorph.prototype._initBlocks = SpriteMorph.prototype.initBlocks;
SpriteMorph.prototype.initBlocks = function () {
    this._initBlocks();
    Object.keys(this.blocks).forEach(key => {
        if (['motion', 'looks', 'pen'].includes(this.blocks[key].category)) {
            delete this.blocks[key];
        }
    });
    Object.assign(
        SpriteMorph.prototype.blocks, {
            move: {
                only: SpriteMorph,
                type: 'command',
                category: 'motion',
                spec: 'move %dir3 %n steps',
                defaults: [['forward'], 1]
            },
            turnTo: {
                only: SpriteMorph,
                type: 'command',
                category: 'motion',
                spec: 'turn %dir3 %n degrees',
                defaults: [['left'], 90]
            },
            rollTo: {
                only: SpriteMorph,
                type: 'command',
                category: 'motion',
                spec: 'roll %dir3 %n degrees',
                defaults: [['left'], 90]
            },
            translateTo: {
                only: SpriteMorph,
                type: 'command',
                category: 'motion',
                spec: 'move to x: %n y: %n z: %n',
                defaults: [0, 0, 0]
            },
            rotateTo: {
                only: SpriteMorph,
                type: 'command',
                category: 'motion',
                spec: 'rotate to x: %n y: %n z: %n',
                defaults: [0, 0, 0]
            },
            setTranslation: {
                only: SpriteMorph,
                type: 'command',
                category: 'motion',
                spec: 'set position x: %n y: %n z: %n',
                defaults: [0, 0, 0]
            },
            setRotation: {
                only: SpriteMorph,
                type: 'command',
                category: 'motion',
                spec: 'set rotation x: %n y: %n z: %n',
                defaults: [0, 0, 0]
            },
            reportTranslation: {
                only: SpriteMorph,
                type: 'reporter',
                category: 'motion',
                spec: 'position'
            },
            reportAxisTranslation: {
                only: SpriteMorph,
                type: 'reporter',
                category: 'motion',
                spec: '%axis position',
                defaults: [['x']]
            },
            reportRotation: {
                only: SpriteMorph,
                type: 'reporter',
                category: 'motion',
                spec: 'rotation'
            },
            reportAxisRotation: {
                only: SpriteMorph,
                type: 'reporter',
                category: 'motion',
                spec: '%axis rotation',
                defaults: [['x']]
            },
            scaleTo: {
                only: SpriteMorph,
                type: 'command',
                category: 'looks',
                spec: 'scale to x: %n y: %n z: %n',
                defaults: [1, 1, 1]
            },
            setScale: {
                only: SpriteMorph,
                type: 'command',
                category: 'looks',
                spec: 'set scale x: %n y: %n z: %n',
                defaults: [1, 1, 1]
            },
            reportScale: {
                only: SpriteMorph,
                type: 'reporter',
                category: 'looks',
                spec: 'scale'
            },
            reportAxisScale: {
                only: SpriteMorph,
                type: 'reporter',
                category: 'looks',
                spec: '%axis scale',
                defaults: [['x']]
            },
            createCardClone: {
                only: SpriteMorph,
                type: 'command',
                category: 'control',
                spec: 'create a clone',
            },
            removeCardClone: {
                only: SpriteMorph,
                type: 'command',
                category: 'control',
                spec: 'delete this clone',
            },
            doPublish: {
                only: SpriteMorph,
                type: 'command',
                category: 'other',
                spec: 'publish event %s %sd',
            },
            doPublishAndWait: {
                only: SpriteMorph,
                type: 'command',
                category: 'other',
                spec: 'publish event %s %sd and wait',
            },
            reportProperty: {
                only: SpriteMorph,
                type: 'reporter',
                category: 'other',
                spec: 'property %prop',
                defaults: [['id']]
            },
        }
    );
};
SpriteMorph.prototype.initBlocks();

SpriteMorph.prototype.reportTranslation = function () {
    return this.getCardProperty('translation');
};

SpriteMorph.prototype.reportAxisTranslation = function (axis) {
    const [x, y, z] = this.getCardProperty('translation').asArray();
    switch (Process.prototype.inputOption(axis)) {
        case 'x':
            return x;
        case 'y':
            return y;
        case 'z':
            return z;
    }
};

SpriteMorph.prototype.reportRotation = function () {
    return this.getCardProperty('rotation');
};

SpriteMorph.prototype.reportAxisRotation = function (axis) {
    const [x, y, z] = this.getCardProperty('rotation').asArray();
    switch (Process.prototype.inputOption(axis)) {
        case 'x':
            return x;
        case 'y':
            return y;
        case 'z':
            return z;
    }
};

SpriteMorph.prototype.reportScale = function () {
    return this.getCardProperty('scale');
};

SpriteMorph.prototype.reportAxisScale = function (axis) {
    const [x, y, z] = this.getCardProperty('translation').asArray();
    switch (Process.prototype.inputOption(axis)) {
        case 'x':
            return x;
        case 'y':
            return y;
        case 'z':
            return z;
    }
};

SpriteMorph.prototype.reportProperty = function (prop) {
    prop = Process.prototype.inputOption(prop);
    return this.getCardProperty(prop);
};

SpriteMorph.prototype.getCardProperty = function (prop) {
    const card = this.cardPawn?.actor;
    if (card) {
        console.log("card", card);
        console.log("cardData", card.collectCardData());
        const p = card[prop];
        if (p instanceof Array) {
            if (prop === 'rotation') {
                const x = p[0], y = p[1], z = p[2], w = p[3];
                return new List([
                    Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * x * x - 2 * z * z),
                    Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * y * y - 2 * z * z),
                    Math.asin(2 * x * y + 2 * z * w)
                ]);
            } else {
                return new List(p);
            }
        } else if (typeof p === 'string') {
            return p;
        } else {
            throw new Error('unsupported property');
        }
    }
    throw new Error('card does not exist');
};

SpriteMorph.prototype.blockTemplates = function (
    category = 'motion',
    all = false // include hidden blocks
) {
    let varNames;
    const blocks = [], myself = this,
        inheritedVars = this.inheritedVariableNames(),
        wrld = this.world(),
        devMode = wrld && wrld.isDevMode;

    function block(selector, isGhosted) {
        if (StageMorph.prototype.hiddenPrimitives[selector] && !all) {
            return null;
        }
        const newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        if (isGhosted) {
            newBlock.ghost();
        }
        return newBlock;
    }

    function variableBlock(varName, isLocal) {
        const newBlock = SpriteMorph.prototype.variableBlock(varName, isLocal);
        newBlock.isDraggable = false;
        newBlock.isTemplate = true;
        if (contains(inheritedVars, varName)) {
            newBlock.ghost();
        }
        return newBlock;
    }

    function watcherToggle(selector) {
        if (StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        const info = SpriteMorph.prototype.blocks[selector];
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleWatcher(
                    selector,
                    localize(info.spec),
                    myself.blockColor[info.category]
                );
            },
            null,
            function () {
                return myself.showingWatcher(selector);
            },
            null
        );
    }

    function variableWatcherToggle(varName, isGlobal) {
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleVariableWatcher(varName, isGlobal);
            },
            null,
            function () {
                return myself.showingVariableWatcher(varName, isGlobal);
            },
            null
        );
    }

    SnapExtensions.buttons.palette.forEach(buttonDescriptor => {
        if (buttonDescriptor.category === category) {
            blocks.push(this.customPaletteButton(buttonDescriptor));
        }
    });

    if (category === 'motion') {

        blocks.push(block('move'));
        blocks.push(block('turnTo'));
        blocks.push(block('rollTo'));
        blocks.push(block('translateTo'));
        blocks.push(block('rotateTo'));
        blocks.push(block('setTranslation'));
        blocks.push(block('setRotation'));
        blocks.push(block('reportTranslation'));
        blocks.push(block('reportAxisTranslation'));
        blocks.push(block('reportRotation'));
        blocks.push(block('reportAxisRotation'));

    } else if (category === 'looks') {

        blocks.push(block('scaleTo'));
        blocks.push(block('setScale'));
        blocks.push(block('reportScale'));
        blocks.push(block('reportAxisScale'));

    } else if (category === 'sound') {

        blocks.push(block('playSound'));
        blocks.push(block('doPlaySoundUntilDone'));
        blocks.push(block('doStopAllSounds'));
        blocks.push('-');
        blocks.push(block('doPlaySoundAtRate'));
        blocks.push(block('reportGetSoundAttribute'));
        blocks.push(block('reportNewSoundFromSamples'));
        blocks.push('-');
        blocks.push(block('doRest'));
        blocks.push(block('doPlayNote'));
        blocks.push(block('doSetInstrument'));
        blocks.push('-');
        blocks.push(block('doChangeTempo'));
        blocks.push(block('doSetTempo'));
        blocks.push(watcherToggle('getTempo'));
        blocks.push(block('getTempo'));
        blocks.push('-');
        blocks.push(block('changeVolume'));
        blocks.push(block('setVolume'));
        blocks.push(watcherToggle('getVolume'));
        blocks.push(block('getVolume', this.inheritsAttribute('volume')));
        blocks.push('-');
        blocks.push(block('changePan'));
        blocks.push(block('setPan'));
        blocks.push(watcherToggle('getPan'));
        blocks.push(block('getPan', this.inheritsAttribute('balance')));
        blocks.push('-');
        blocks.push(block('playFreq'));
        blocks.push(block('stopFreq'));

        // for debugging: ///////////////
        if (devMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(block('doPlayFrequency'));
        }

    } else if (category === 'control') {

        blocks.push(block('receiveGo'));
        blocks.push(block('receiveKey'));
        blocks.push(block('receiveInteraction'));
        blocks.push(block('receiveCondition'));
        blocks.push('-');
        blocks.push(block('receiveMessage'));
        blocks.push(block('doBroadcast'));
        blocks.push(block('doBroadcastAndWait'));
        blocks.push('-');
        blocks.push(block('doWarp'));
        blocks.push('-');
        blocks.push(block('doWait'));
        blocks.push(block('doWaitUntil'));
        blocks.push('-');
        blocks.push(block('doForever'));
        blocks.push(block('doRepeat'));
        blocks.push(block('doUntil'));
        blocks.push(block('doFor'));
        blocks.push('-');
        blocks.push(block('doIf'));
        blocks.push(block('doIfElse'));
        blocks.push(block('reportIfElse'));
        blocks.push('-');
        blocks.push(block('doReport'));
        blocks.push(block('doStopThis'));
        blocks.push('-');
        blocks.push(block('doRun'));
        blocks.push(block('fork'));
        blocks.push(block('evaluate'));
        blocks.push(block('reportPipe'));
        blocks.push('-');
        blocks.push(block('doTellTo'));
        blocks.push(block('reportAskFor'));
        blocks.push('-');
        blocks.push(block('doCallCC'));
        blocks.push(block('reportCallCC'));
        blocks.push('-');
        blocks.push(block('receiveOnClone'));
        blocks.push(block('createCardClone'));
        blocks.push(block('removeCardClone'));
        blocks.push('-');
        blocks.push(block('doPauseAll'));
        blocks.push(block('doSwitchToScene'));
        blocks.push('-');
        blocks.push(block('receiveUserEdit'));
        blocks.push(block('doDefineBlock'));
        blocks.push(block('doDeleteBlock'));
        blocks.push(block('doSetBlockAttribute'));
        blocks.push(block('reportBlockAttribute'));
        blocks.push(block('reportThisContext'));

        // for debugging: ///////////////
        if (devMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(watcherToggle('getLastMessage'));
            blocks.push(block('getLastMessage'));
        }

    } else if (category === 'sensing') {

        blocks.push(block('reportTouchingObject'));
        blocks.push(block('reportTouchingColor'));
        blocks.push(block('reportColorIsTouchingColor'));
        blocks.push('-');
        blocks.push(block('doAsk'));
        blocks.push(watcherToggle('getLastAnswer'));
        blocks.push(block('getLastAnswer'));
        blocks.push('-');
        blocks.push(block('reportMousePosition'));
        blocks.push(watcherToggle('reportMouseX'));
        blocks.push(block('reportMouseX'));
        blocks.push(watcherToggle('reportMouseY'));
        blocks.push(block('reportMouseY'));
        blocks.push(block('reportMouseDown'));
        blocks.push('-');
        blocks.push(block('reportKeyPressed'));
        blocks.push('-');
        blocks.push(block('reportRelationTo'));
        blocks.push(block('reportAspect'));
        blocks.push('-');
        blocks.push(block('doResetTimer'));
        blocks.push(watcherToggle('getTimer'));
        blocks.push(block('getTimer'));
        blocks.push(block('reportDate'));
        blocks.push('-');
        blocks.push(block('reportAttributeOf'));

        if (SpriteMorph.prototype.enableFirstClass) {
            blocks.push(block('reportGet'));
        }

        blocks.push(block('reportObject'));
        blocks.push('-');
        blocks.push(block('reportURL'));
        blocks.push(block('reportAudio'));
        blocks.push(block('reportVideo'));
        blocks.push(block('doSetVideoTransparency'));
        blocks.push('-');
        blocks.push(block('reportGlobalFlag'));
        blocks.push(block('doSetGlobalFlag'));

        // for debugging: ///////////////
        if (devMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(watcherToggle('reportThreadCount'));
            blocks.push(block('reportThreadCount'));
            blocks.push(block('reportStackSize'));
            blocks.push(block('reportFrameCount'));
            blocks.push(block('reportYieldCount'));
        }
    } else if (category === 'operators') {

        blocks.push(block('reifyScript'));
        blocks.push(block('reifyReporter'));
        blocks.push(block('reifyPredicate'));
        blocks.push('#');
        blocks.push('-');
        blocks.push(block('reportVariadicSum'));
        blocks.push(block('reportDifference'));
        blocks.push(block('reportVariadicProduct'));
        blocks.push(block('reportQuotient'));
        blocks.push(block('reportPower'));
        blocks.push('-');
        blocks.push(block('reportModulus'));
        blocks.push(block('reportRound'));
        blocks.push(block('reportMonadic'));
        blocks.push(block('reportRandom'));
        blocks.push('-');
        blocks.push(block('reportLessThan'));
        blocks.push(block('reportEquals'));
        blocks.push(block('reportGreaterThan'));
        blocks.push('-');
        blocks.push(block('reportAnd'));
        blocks.push(block('reportOr'));
        blocks.push(block('reportNot'));
        blocks.push(block('reportBoolean'));
        blocks.push('-');
        blocks.push(block('reportJoinWords'));
        blocks.push(block('reportTextSplit'));
        blocks.push(block('reportLetter'));
        blocks.push(block('reportStringSize'));
        blocks.push('-');
        blocks.push(block('reportUnicode'));
        blocks.push(block('reportUnicodeAsLetter'));
        blocks.push('-');
        blocks.push(block('reportIsA'));
        blocks.push(block('reportIsIdentical'));

        if (Process.prototype.enableJS) {
            blocks.push('-');
            blocks.push(block('reportJSFunction'));
            if (Process.prototype.enableCompiling) {
                blocks.push(block('reportCompiled'));
            }
        }
        // for debugging: ///////////////
        if (devMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(block('reportTypeOf'));
            blocks.push(block('reportTextFunction'));
        }

    } else if (category === 'variables') {

        blocks.push(this.makeVariableButton());
        if (this.deletableVariableNames().length > 0) {
            blocks.push(this.deleteVariableButton());
        }
        blocks.push('-');

        varNames = this.allGlobalVariableNames(true, all);
        if (varNames.length > 0) {
            varNames.forEach(name => {
                blocks.push(variableWatcherToggle(name, true));
                blocks.push(variableBlock(name));
            });
            blocks.push('-');
        }

        varNames = this.allLocalVariableNames(true, all);
        if (varNames.length > 0) {
            varNames.forEach(name => {
                blocks.push(variableWatcherToggle(name));
                blocks.push(variableBlock(name, true));
            });
            blocks.push('-');
        }

        blocks.push(block('doSetVar'));
        blocks.push(block('doChangeVar'));
        blocks.push(block('doShowVar'));
        blocks.push(block('doHideVar'));
        blocks.push(block('doDeclareVariables'));

        // inheritance:

        if (StageMorph.prototype.enableInheritance) {
            blocks.push('-');
            blocks.push(block('doDeleteAttr'));
        }

        blocks.push('=');
        blocks.push(block('reportNewList'));
        blocks.push(block('reportNumbers'));
        blocks.push('-');
        blocks.push(block('reportCONS'));
        blocks.push(block('reportListItem'));
        blocks.push(block('reportCDR'));
        blocks.push('-');
        blocks.push(block('reportListAttribute'));
        blocks.push(block('reportListIndex'));
        blocks.push(block('reportListContainsItem'));
        blocks.push(block('reportListIsEmpty'));
        blocks.push('-');
        blocks.push(block('reportMap'));
        blocks.push(block('reportKeep'));
        blocks.push(block('reportFindFirst'));
        blocks.push(block('reportCombine'));
        blocks.push('-');
        blocks.push(block('doForEach'));
        blocks.push('-');
        blocks.push(block('doAddToList'));
        blocks.push(block('doDeleteFromList'));
        blocks.push(block('doInsertInList'));
        blocks.push(block('doReplaceInList'));
        blocks.push('-');
        blocks.push(block('reportConcatenatedLists'));
        blocks.push(block('reportReshape'));
        blocks.push(block('reportCrossproduct'));
        blocks.push('=');
        blocks.push(block('doPublish'));
        blocks.push(block('doPublishAndWait'));
        blocks.push(block('reportProperty'));

        if (SpriteMorph.prototype.showingExtensions) {
            blocks.push('=');
            blocks.push(block('doApplyExtension'));
            blocks.push(block('reportApplyExtension'));
        }

        if (StageMorph.prototype.enableCodeMapping) {
            blocks.push('=');
            blocks.push(block('doMapCodeOrHeader'));
            blocks.push(block('doMapValueCode'));
            blocks.push(block('doMapListCode'));
            blocks.push('-');
            blocks.push(block('reportMappedCode'));
        }

        // for debugging: ///////////////
        if (this.world().isDevMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(block('doShowTable'));
        }
    }

    return blocks;
};

StageMorph.prototype.blockTemplates = function (
    category = 'motion',
    all = false // include hidden blocks
) {
    let varNames, txt;
    const blocks = [], myself = this;

    function block(selector) {
        if (myself.hiddenPrimitives[selector] && !all) {
            return null;
        }
        const newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        return newBlock;
    }

    function variableBlock(varName, isLocal) {
        const newBlock = SpriteMorph.prototype.variableBlock(varName, isLocal);
        newBlock.isDraggable = false;
        newBlock.isTemplate = true;
        return newBlock;
    }


    function watcherToggle(selector) {
        if (myself.hiddenPrimitives[selector]) {
            return null;
        }
        const info = SpriteMorph.prototype.blocks[selector];
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleWatcher(
                    selector,
                    localize(info.spec),
                    myself.blockColor[info.category]
                );
            },
            null,
            function () {
                return myself.showingWatcher(selector);
            },
            null
        );
    }

    function variableWatcherToggle(varName, isGlobal) {
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleVariableWatcher(varName, isGlobal);
            },
            null,
            function () {
                return myself.showingVariableWatcher(varName, isGlobal);
            },
            null
        );
    }


    SnapExtensions.buttons.palette.forEach(buttonDescriptor => {
        if (buttonDescriptor.category === category) {
            blocks.push(this.customPaletteButton(buttonDescriptor));
        }
    });

    if (category === 'motion') {

        txt = new TextMorph(localize('Stage selected:\nno motion primitives'));
        txt.fontSize = 9;
        txt.setColor(this.paletteTextColor);
        txt.hideWithCategory = true; // hide txt when category names are hidden
        blocks.push(txt);

    } else if (category === 'looks') {

        txt = new TextMorph(localize('Stage selected:\nno looks primitives'));
        txt.fontSize = 9;
        txt.setColor(this.paletteTextColor);
        txt.hideWithCategory = true; // hide txt when category names are hidden
        blocks.push(txt);

    } else if (category === 'sound') {

        blocks.push(block('playSound'));
        blocks.push(block('doPlaySoundUntilDone'));
        blocks.push(block('doStopAllSounds'));
        blocks.push('-');
        blocks.push(block('doPlaySoundAtRate'));
        blocks.push(block('reportGetSoundAttribute'));
        blocks.push(block('reportNewSoundFromSamples'));
        blocks.push('-');
        blocks.push(block('doRest'));
        blocks.push(block('doPlayNote'));
        blocks.push(block('doSetInstrument'));
        blocks.push('-');
        blocks.push(block('doChangeTempo'));
        blocks.push(block('doSetTempo'));
        blocks.push(watcherToggle('getTempo'));
        blocks.push(block('getTempo'));
        blocks.push('-');
        blocks.push(block('changeVolume'));
        blocks.push(block('setVolume'));
        blocks.push(watcherToggle('getVolume'));
        blocks.push(block('getVolume'));
        blocks.push('-');
        blocks.push(block('changePan'));
        blocks.push(block('setPan'));
        blocks.push(watcherToggle('getPan'));
        blocks.push(block('getPan'));
        blocks.push('-');
        blocks.push(block('playFreq'));
        blocks.push(block('stopFreq'));

        // for debugging: ///////////////
        if (this.world().isDevMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(block('doPlayFrequency'));
        }

    } else if (category === 'control') {

        blocks.push(block('receiveGo'));
        blocks.push(block('receiveKey'));
        blocks.push(block('receiveInteraction'));
        blocks.push(block('receiveCondition'));
        blocks.push('-');
        blocks.push(block('receiveMessage'));
        blocks.push(block('doBroadcast'));
        blocks.push(block('doBroadcastAndWait'));
        blocks.push('-');
        blocks.push(block('doWarp'));
        blocks.push('-');
        blocks.push(block('doWait'));
        blocks.push(block('doWaitUntil'));
        blocks.push('-');
        blocks.push(block('doForever'));
        blocks.push(block('doRepeat'));
        blocks.push(block('doUntil'));
        blocks.push(block('doFor'));
        blocks.push('-');
        blocks.push(block('doIf'));
        blocks.push(block('doIfElse'));
        blocks.push(block('reportIfElse'));
        blocks.push('-');
        blocks.push(block('doReport'));
        blocks.push(block('doStopThis'));
        blocks.push('-');
        blocks.push(block('doRun'));
        blocks.push(block('fork'));
        blocks.push(block('evaluate'));
        blocks.push(block('reportPipe'));
        blocks.push('-');
        blocks.push(block('doTellTo'));
        blocks.push(block('reportAskFor'));
        blocks.push('-');
        blocks.push(block('doCallCC'));
        blocks.push(block('reportCallCC'));
        blocks.push('-');
        blocks.push(block('createClone'));
        blocks.push(block('newClone'));
        blocks.push('-');
        blocks.push(block('doPauseAll'));
        blocks.push(block('doSwitchToScene'));
        blocks.push('-');
        blocks.push(block('receiveUserEdit'));
        blocks.push(block('doDefineBlock'));
        blocks.push(block('doDeleteBlock'));
        blocks.push(block('doSetBlockAttribute'));
        blocks.push(block('reportBlockAttribute'));
        blocks.push(block('reportThisContext'));

        // for debugging: ///////////////
        if (this.world().isDevMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(watcherToggle('getLastMessage'));
            blocks.push(block('getLastMessage'));
        }

    } else if (category === 'sensing') {

        blocks.push(block('doAsk'));
        blocks.push(watcherToggle('getLastAnswer'));
        blocks.push(block('getLastAnswer'));
        blocks.push('-');
        blocks.push(block('reportMousePosition'));
        blocks.push(watcherToggle('reportMouseX'));
        blocks.push(block('reportMouseX'));
        blocks.push(watcherToggle('reportMouseY'));
        blocks.push(block('reportMouseY'));
        blocks.push(block('reportMouseDown'));
        blocks.push('-');
        blocks.push(block('reportKeyPressed'));
        blocks.push('-');
        blocks.push(block('reportAspect'));
        blocks.push('-');
        blocks.push(block('doResetTimer'));
        blocks.push(watcherToggle('getTimer'));
        blocks.push(block('getTimer'));
        blocks.push(block('reportDate'));
        blocks.push('-');
        blocks.push(block('reportAttributeOf'));

        if (SpriteMorph.prototype.enableFirstClass) {
            blocks.push(block('reportGet'));
        }

        blocks.push(block('reportObject'));
        blocks.push('-');
        blocks.push(block('reportURL'));
        blocks.push(block('reportAudio'));
        blocks.push(block('reportVideo'));
        blocks.push(block('doSetVideoTransparency'));
        blocks.push('-');
        blocks.push(block('reportGlobalFlag'));
        blocks.push(block('doSetGlobalFlag'));

        // for debugging: ///////////////
        if (this.world().isDevMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(watcherToggle('reportThreadCount'));
            blocks.push(block('reportThreadCount'));
            blocks.push(block('reportStackSize'));
            blocks.push(block('reportFrameCount'));
            blocks.push(block('reportYieldCount'));
        }
    }
    if (category === 'operators') {

        blocks.push(block('reifyScript'));
        blocks.push(block('reifyReporter'));
        blocks.push(block('reifyPredicate'));
        blocks.push('#');
        blocks.push('-');
        blocks.push(block('reportVariadicSum'));
        blocks.push(block('reportDifference'));
        blocks.push(block('reportVariadicProduct'));
        blocks.push(block('reportQuotient'));
        blocks.push(block('reportPower'));
        blocks.push('-');
        blocks.push(block('reportModulus'));
        blocks.push(block('reportRound'));
        blocks.push(block('reportMonadic'));
        blocks.push(block('reportRandom'));
        blocks.push('-');
        blocks.push(block('reportLessThan'));
        blocks.push(block('reportEquals'));
        blocks.push(block('reportGreaterThan'));
        blocks.push('-');
        blocks.push(block('reportAnd'));
        blocks.push(block('reportOr'));
        blocks.push(block('reportNot'));
        blocks.push(block('reportBoolean'));
        blocks.push('-');
        blocks.push(block('reportJoinWords'));
        blocks.push(block('reportTextSplit'));
        blocks.push(block('reportLetter'));
        blocks.push(block('reportStringSize'));
        blocks.push('-');
        blocks.push(block('reportUnicode'));
        blocks.push(block('reportUnicodeAsLetter'));
        blocks.push('-');
        blocks.push(block('reportIsA'));
        blocks.push(block('reportIsIdentical'));

        if (Process.prototype.enableJS) { // (Process.prototype.enableJS) {
            blocks.push('-');
            blocks.push(block('reportJSFunction'));
            if (Process.prototype.enableCompiling) {
                blocks.push(block('reportCompiled'));
            }
        }

        // for debugging: ///////////////
        if (this.world().isDevMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(block('reportTypeOf'));
            blocks.push(block('reportTextFunction'));
        }

    }
    if (category === 'variables') {

        blocks.push(this.makeVariableButton());
        if (this.variables.allNames().length > 0) {
            blocks.push(this.deleteVariableButton());
        }
        blocks.push('-');

        varNames = this.allGlobalVariableNames(true, all);
        if (varNames.length > 0) {
            varNames.forEach(name => {
                blocks.push(variableWatcherToggle(name, true));
                blocks.push(variableBlock(name));
            });
            blocks.push('-');
        }

        varNames = this.allLocalVariableNames(true, all);
        if (varNames.length > 0) {
            varNames.forEach(name => {
                blocks.push(variableWatcherToggle(name));
                blocks.push(variableBlock(name, true));
            });
            blocks.push('-');
        }

        blocks.push(block('doSetVar'));
        blocks.push(block('doChangeVar'));
        blocks.push(block('doShowVar'));
        blocks.push(block('doHideVar'));
        blocks.push(block('doDeclareVariables'));
        blocks.push('=');
        blocks.push(block('reportNewList'));
        blocks.push(block('reportNumbers'));
        blocks.push('-');
        blocks.push(block('reportCONS'));
        blocks.push(block('reportListItem'));
        blocks.push(block('reportCDR'));
        blocks.push('-');
        blocks.push(block('reportListAttribute'));
        blocks.push(block('reportListIndex'));
        blocks.push(block('reportListContainsItem'));
        blocks.push(block('reportListIsEmpty'));
        blocks.push('-');
        blocks.push(block('reportMap'));
        blocks.push(block('reportKeep'));
        blocks.push(block('reportFindFirst'));
        blocks.push(block('reportCombine'));
        blocks.push('-');
        blocks.push(block('doForEach'));
        blocks.push('-');
        blocks.push(block('doAddToList'));
        blocks.push(block('doDeleteFromList'));
        blocks.push(block('doInsertInList'));
        blocks.push(block('doReplaceInList'));
        blocks.push('-');
        blocks.push(block('reportConcatenatedLists'));
        blocks.push(block('reportReshape'));
        blocks.push(block('reportCrossproduct'));

        if (SpriteMorph.prototype.showingExtensions) {
            blocks.push('=');
            blocks.push(block('doApplyExtension'));
            blocks.push(block('reportApplyExtension'));
        }

        if (StageMorph.prototype.enableCodeMapping) {
            blocks.push('=');
            blocks.push(block('doMapCodeOrHeader'));
            blocks.push(block('doMapValueCode'));
            blocks.push(block('doMapListCode'));
            blocks.push('-');
            blocks.push(block('reportMappedCode'));
        }

        // for debugging: ///////////////
        if (this.world().isDevMode) {
            blocks.push('-');
            blocks.push(this.devModeText());
            blocks.push('-');
            blocks.push(block('doShowTable'));
        }
    }

    return blocks;
};

StageMorph.prototype._userMenu = StageMorph.prototype.userMenu;
StageMorph.prototype.userMenu = function () {
    const menu = new MenuMorph(this);
    if (this.threeRenderManager) {
        return menu;
    }
    return this._userMenu();
};

StageMorph.prototype.getThreeCanvas = function () {
    return this.threeRenderManager?.renderer.domElement;
};

StageMorph.prototype._step = StageMorph.prototype.step;
StageMorph.prototype.step = function () {
    this._step();
    if (this.threeRenderManager) {
        this.changed();
    }
    if (!this.threeRenderManager || !this.inputManager) {
        const ide = this.parentThatIsA(IDE_Morph);
        ide.broadcast("refreshStage");
    }
}

StageMorph.prototype._setScale = StageMorph.prototype.setScale;
StageMorph.prototype.setScale = function (number) {
    this._setScale(number);
    if (this.inputManager) {
        this.inputManager.publish("input", "resize");
    }
    if (this.joyStick) {
        this.joyStick.destroy();
        this.createJoyStick();
    }
};

StageMorph.prototype._drawOn = StageMorph.prototype.drawOn;
StageMorph.prototype.drawOn = function (ctx, rect) {
    this._drawOn(ctx, rect);
    let clipped = rect.intersect(this.bounds),
        pos, src, w, h, sl, st, ws, hs;
    pos = this.position();
    src = clipped.translateBy(pos.neg());
    sl = src.left();
    st = src.top();
    w = src.width();
    h = src.height();
    ws = w / this.scale;
    hs = h / this.scale;

    if (this.threeRenderManager) {
        ctx.save();
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(
            this.getThreeCanvas(),
            sl / this.scale,
            st / this.scale,
            w,
            h,
            clipped.left() / this.scale,
            clipped.top() / this.scale,
            ws,
            hs
        );
        this.version = Date.now();
    }
    ctx.restore();
}

StageMorph.prototype._fancyThumbnail = StageMorph.prototype.fancyThumbnail;
StageMorph.prototype.fancyThumbnail = function (extentPoint, excludedSprite, nonRetina, recycleMe, noWatchers) {
    this._fancyThumbnail(extentPoint, excludedSprite, nonRetina, recycleMe, noWatchers);
    const src = this.getImage(),
        scale = Math.min(
            (extentPoint.x / src.width),
            (extentPoint.y / src.height)
        ),
        trg = newCanvas(extentPoint, nonRetina, recycleMe),
        ctx = trg.getContext('2d');

    if (this.threeRenderManager) {
        ctx.save();
        ctx.scale(scale, scale);
        ctx.drawImage(
            this.getThreeCanvas(),
            0,
            0,
            this.dimensions.x * this.scale,
            this.dimensions.y * this.scale
        );
        ctx.restore();
    }
    return trg;
};

StageMorph.prototype.addAllListeners = function () {
    const canvas = this.world().worldCanvas;
    canvas.addEventListener("click", event => this.invokeListener("onClick", event));
    canvas.addEventListener("pointerlockchange", event => this.invokeListener("onPointerLock", event));
    canvas.addEventListener("pointerdown", event => this.invokeListener("onPointerDown", event));
    canvas.addEventListener("pointerup", event => this.invokeListener("onPointerUp", event));
    canvas.addEventListener("pointercancel", event => this.invokeListener("onPointerUp", event));
    canvas.addEventListener("pointermove", event => this.invokeListener("onPointerMove", event));
    canvas.addEventListener("mousewheel", event => this.invokeListener("onWheel", event));
    canvas.addEventListener("DOMMouseScroll", event => this.invokeListener("onWheel", event));
};

StageMorph.prototype.invokeListener = function (listenerName, event) {
    const hand = this.world().hand;
    const morph = hand.morphAtPointer();
    if (this.inputManager && morph === this) {
        this.inputManager[listenerName](event);
    }
};

StageMorph.prototype.createJoyStick = function () {
    this.joyStick = new JoyStickMorph(50 * this.scale);
    this.joyStick.target = this;
    this.joyStick.setCenter(new Point(this.center().x, this.bottomCenter().y - 100 * this.scale));
    this.add(this.joyStick);
};

StageMorph.prototype.updateMotion = function (dx, dy) {
    if (this.inputManager) {
        this.inputManager.publish("joyStickMorph", "updateMotion", [dx, dy]);
    }
};

StageMorph.prototype.endMotion = function () {
    if (this.inputManager) {
        this.inputManager.publish("joyStickMorph", "endMotion");
    }
};

var CircleMorph;

CircleMorph.prototype = new Morph();
CircleMorph.prototype.constructor = CircleMorph;
CircleMorph.uber = Morph.prototype;

function CircleMorph(radius) {
    this.init(radius);
}

CircleMorph.prototype.init = function (radius) {
    CircleMorph.uber.init.call(this);
    this.radius = radius || 50;
    this.setExtent(new Point(this.radius * 2, this.radius * 2));
};

CircleMorph.prototype.render = function (ctx) {
    ctx.fillStyle = this.color.toString();
    ctx.beginPath();
    ctx.arc(
        this.radius,
        this.radius,
        this.radius,
        0,
        Math.PI * 2
    );
    ctx.closePath();
    ctx.fill();
};

var JoyStickMorph;

JoyStickMorph.prototype = new CircleMorph();
JoyStickMorph.prototype.constructor = JoyStickMorph;
JoyStickMorph.uber = CircleMorph.prototype;

function JoyStickMorph(radius) {
    this.init(radius);
}

JoyStickMorph.prototype.init = function (radius) {
    JoyStickMorph.uber.init.call(this, radius);
    this.target = null;
    this.setColor(new Color(255, 255, 255));
    this.alpha = 0.5;

    this.base = new CircleMorph(radius - 2);
    this.base.setColor(new Color(0, 0, 0));
    this.base.alpha = 0.5;
    this.base.setCenter(this.center());
    this.base.isDraggable = false;
    this.add(this.base);

    this.trackingKnob = new CircleMorph(radius - 2);
    this.trackingKnob.setColor(new Color(124, 124, 124));
    this.trackingKnob.alpha = 0.2;
    this.trackingKnob.setCenter(this.center());
    this.trackingKnob.isDraggable = false;
    this.add(this.trackingKnob);

    this.knob = new CircleMorph(radius / 2);
    this.knob.setColor(new Color(224, 224, 224));
    this.knob.alpha = 0.5;
    this.knob.setCenter(this.center());
    this.knob.isDraggable = false;
    this.add(this.knob);
};

JoyStickMorph.prototype.mouseDownLeft = function () {
    this.step = () => {
        const hand = this.world().hand;
        if (hand.mouseButton) {
            this.trackingKnob.setCenter(hand.center());
            this.dx = this.trackingKnob.center().x - this.center().x;
            this.dy = this.trackingKnob.center().y - this.center().y;
            this.updateTarget("updateMotion");

            const m = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            const r = this.base.radius / 2;
            if (m < r) {
                this.knob.setCenter(hand.center());
            } else {
                const x = this.center().x + this.dx / m * r;
                const y = this.center().y + this.dy / m * r;
                this.knob.setCenter(new Point(x, y));
            }
        } else {
            this.step = null;
            this.trackingKnob.setCenter(this.center());
            this.knob.setCenter(this.center());
            this.updateTarget("endMotion");
        }
    };
};

JoyStickMorph.prototype.updateTarget = function (command) {
    if (this.target[command]) {
        if (command === "updateMotion") {
            this.target.updateMotion(this.dx, this.dy);
        } else if (command === "endMotion") {
            this.target.endMotion();
        }
    }
};
