IDE_Morph.prototype.createSpriteBar = function () {
    // assumes that the categories pane has already been created
    var rotationStyleButtons = [],
        thumbSize = new Point(45, 45),
        nameField,
        padlock,
        thumbnail,
        tabCorner = 15,
        tabColors = this.tabColors,
        tabBar = new AlignmentMorph('row', -tabCorner * 2),
        tab,
        symbols = [
            new SymbolMorph('arrowRightThin', 10),
            new SymbolMorph('turnAround', 10),
            new SymbolMorph('arrowLeftRightThin', 10),
        ],
        labels = ['don\'t rotate', 'can rotate', 'only face left/right'],
        myself = this;

    if (this.spriteBar) {
        this.spriteBar.destroy();
    }

    this.spriteBar = new Morph();
    this.spriteBar.color = this.frameColor;
    this.add(this.spriteBar);

    function addRotationStyleButton(rotationStyle) {
        var colors = myself.rotationStyleColors,
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            () => {
                if (myself.currentSprite instanceof SpriteMorph) {
                    myself.currentSprite.rotationStyle = rotationStyle;
                    myself.currentSprite.changed();
                    myself.currentSprite.fixLayout();
                    myself.currentSprite.rerender();
                    myself.currentSprite.recordUserEdit(
                        'sprite',
                        'rotation',
                        rotationStyle
                    );
                }
                rotationStyleButtons.forEach(each =>
                    each.refresh()
                );
            },
            symbols[rotationStyle], // label
            () => myself.currentSprite instanceof SpriteMorph // query
                && myself.currentSprite.rotationStyle === rotationStyle,
            null, // environment
            localize(labels[rotationStyle])
        );

        button.corner = 8;
        button.labelMinExtent = new Point(11, 11);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        rotationStyleButtons.push(button);
        button.setPosition(myself.spriteBar.position().add(new Point(2, 4)));
        button.setTop(button.top()
            + ((rotationStyleButtons.length - 1) * (button.height() + 2))
        );
        myself.spriteBar.add(button);
        if (myself.currentSprite instanceof StageMorph) {
            button.hide();
        }
        return button;
    }

    addRotationStyleButton(1);
    addRotationStyleButton(2);
    addRotationStyleButton(0);
    this.rotationStyleButtons = rotationStyleButtons;

    thumbnail = new Morph();
    thumbnail.isCachingImage = true;
    thumbnail.bounds.setExtent(thumbSize);
    thumbnail.cachedImage = this.currentSprite.thumbnail(thumbSize);
    thumbnail.setPosition(
        rotationStyleButtons[0].topRight().add(new Point(5, 3))
    );
    this.spriteBar.add(thumbnail);

    thumbnail.fps = 3;

    thumbnail.step = function () {
        if (thumbnail.version !== myself.currentSprite.version) {
            thumbnail.cachedImage = myself.currentSprite.thumbnail(
                thumbSize,
                thumbnail.cachedImage
            );
            thumbnail.changed();
            thumbnail.version = myself.currentSprite.version;
        }
    };

    nameField = new InputFieldMorph(this.currentSprite.name);
    nameField.setWidth(100); // fixed dimensions
    nameField.contrast = 90;
    nameField.setPosition(thumbnail.topRight().add(new Point(10, 3)));
    this.spriteBar.add(nameField);
    this.spriteBar.nameField = nameField;
    nameField.fixLayout();
    nameField.accept = function () {
        var newName = nameField.getValue();
        myself.currentSprite.setName(
            myself.newSpriteName(newName, myself.currentSprite)
        );
        nameField.setContents(myself.currentSprite.name);
    };
    this.spriteBar.reactToEdit = nameField.accept;

    // padlock
    padlock = new ToggleMorph(
        'checkbox',
        null,
        () => {
            this.currentSprite.isDraggable = !this.currentSprite.isDraggable;
            this.currentSprite.recordUserEdit(
                'sprite',
                'draggable',
                this.currentSprite.isDraggable
            );
        },
        localize('draggable'),
        () => this.currentSprite.isDraggable
    );
    padlock.label.isBold = false;
    padlock.label.setColor(this.buttonLabelColor);
    padlock.color = tabColors[2];
    padlock.highlightColor = tabColors[0];
    padlock.pressColor = tabColors[1];

    padlock.tick.shadowOffset = MorphicPreferences.isFlat ?
        ZERO : new Point(-1, -1);
    padlock.tick.shadowColor = BLACK;
    padlock.tick.color = this.buttonLabelColor;
    padlock.tick.isBold = false;
    padlock.tick.fixLayout();

    padlock.setPosition(nameField.bottomLeft().add(2));
    padlock.fixLayout();
    this.spriteBar.add(padlock);
    if (this.currentSprite instanceof StageMorph) {
        padlock.hide();
    }

    // tab bar
    tabBar.tabTo = function (tabString) {
        var active;
        if (myself.currentTab === tabString) {
            return;
        }
        myself.world().hand.destroyTemporaries();
        myself.currentTab = tabString;
        this.children.forEach(each => {
            each.refresh();
            if (each.state) {
                active = each;
            }
        });
        active.refresh(); // needed when programmatically tabbing
        myself.createSpriteEditor();
        myself.fixLayout('tabEditor');
    };

    tab = new TabMorph(
        tabColors,
        null, // target
        () => tabBar.tabTo('scripts'),
        localize('Scripts'), // label
        () => this.currentTab === 'scripts' // query
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;

    tab.getPressRenderColor = function () {
        if (MorphicPreferences.isFlat ||
            SyntaxElementMorph.prototype.alpha > 0.85) {
            return this.pressColor;
        }
        return this.pressColor.mixed(
            Math.max(SyntaxElementMorph.prototype.alpha - 0.15, 0),
            SpriteMorph.prototype.paletteColor
        );
    };

    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        () => tabBar.tabTo('costumes'),
        localize(this.currentSprite instanceof SpriteMorph ?
            'Costumes' : 'Backgrounds'
        ),
        () => this.currentTab === 'costumes' // query
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.fixLayout();
    tabBar.add(tab);

    tab = new TabMorph(
        tabColors,
        null, // target
        () => tabBar.tabTo('sounds'),
        localize('Sounds'), // label
        () => this.currentTab === 'sounds' // query
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;
    tab.fixLayout();
    tabBar.add(tab);

    tabBar.fixLayout();
    tabBar.children.forEach(each =>
        each.refresh()
    );
    this.spriteBar.tabBar = tabBar;
    this.spriteBar.add(this.spriteBar.tabBar);

    this.spriteBar.fixLayout = function () {
        this.tabBar.setLeft(this.left());
        this.tabBar.setBottom(this.bottom() + myself.padding);
    };
};

IDE_Morph.prototype.createSpriteEditor = function () {
    // assumes that the logo pane and the stage have already been created
    var scripts = this.currentSprite.scripts;

    if (this.spriteEditor) {
        this.spriteEditor.destroy();
    }

    if (this.currentTab === 'scripts') {
        scripts.isDraggable = false;
        scripts.color = this.groupColor;
        scripts.cachedTexture = this.scriptsPaneTexture;

        this.spriteEditor = new ScrollFrameMorph(
            scripts,
            null,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.spriteEditor.padding = 10;
        this.spriteEditor.growth = 50;
        this.spriteEditor.isDraggable = false;
        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = true;

        scripts.scrollFrame = this.spriteEditor;
        scripts.updateToolbar();
        this.add(this.spriteEditor);
        this.spriteEditor.scrollX(this.spriteEditor.padding);
        this.spriteEditor.scrollY(this.spriteEditor.padding);
    } else if (this.currentTab === 'costumes') {
        this.spriteEditor = new WardrobeMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);
        this.spriteEditor.updateSelection();

        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else if (this.currentTab === 'sounds') {
        this.spriteEditor = new JukeboxMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);
        this.spriteEditor.updateSelection();
        this.spriteEditor.acceptDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else {
        this.spriteEditor = new Morph();
        this.spriteEditor.color = this.groupColor;
        this.spriteEditor.acceptsDrops = true;
        this.spriteEditor.reactToDropOf = (droppedMorph) => {
            if (droppedMorph instanceof DialogBoxMorph) {
                this.world().add(droppedMorph);
            } else if (droppedMorph instanceof SpriteMorph) {
                this.removeSprite(droppedMorph);
            } else {
                droppedMorph.destroy();
            }
        };
        this.add(this.spriteEditor);
    }

    this.spriteEditor.mouseEnterDragging = (morph) => {
        if (morph instanceof BlockMorph) {
            this.spriteBar.tabBar.tabTo('scripts');
        } else if (morph instanceof CostumeIconMorph) {
            this.spriteBar.tabBar.tabTo('costumes');
        } else if (morph instanceof SoundIconMorph) {
            this.spriteBar.tabBar.tabTo('sounds');
        }
    };

    this.spriteEditor.contents.mouseEnterDragging =
        this.spriteEditor.mouseEnterDragging;
};

// IDE_Morph layout

IDE_Morph.prototype.fixLayout = function (situation) {
    // situation is a string, i.e.
    // 'selectSprite' or 'refreshPalette' or 'tabEditor'
    var padding = this.padding,
        cnf = this.config,
        border = cnf.border || 0,
        flag,
        maxPaletteWidth;

    // logo
    this.logo.setLeft(this.left() + border);
    this.logo.setTop(this.top() + border);

    if (situation !== 'refreshPalette') {
        // controlBar
        this.controlBar.setPosition(this.logo.topRight());
        this.controlBar.setWidth(
            this.right() - this.controlBar.left() - border
        );
        this.controlBar.fixLayout();

        // categories
        this.categories.setLeft(this.logo.left());
        this.categories.setTop(
            cnf.hideControls ? this.top() + border : this.logo.bottom()
        );
        this.categories.setWidth(this.paletteWidth);
        if (this.categories.scroller) {
            this.categories.scroller.setWidth(this.paletteWidth);
        }
    }

    // palette
    this.palette.setLeft(this.logo.left());
    this.palette.setTop(
        cnf.hideCategories ?
            (cnf.hideControls ?
                this.top() + border
                : this.controlBar.bottom() + padding)
            : this.categories.bottom()
    );
    this.palette.setHeight(this.bottom() - this.palette.top() - border);
    this.palette.setWidth(this.paletteWidth);

    if (situation !== 'refreshPalette') {
        // stage
        if (this.isEmbedMode) {
            this.stage.setScale(Math.floor(Math.min(
                this.width() / this.stage.dimensions.x,
                this.height() / this.stage.dimensions.y
            ) * 100) / 100);
            flag = this.embedPlayButton.flag;
            flag.size = Math.floor(Math.min(
                this.width(), this.height())) / 5;
            flag.fixLayout();
            this.embedPlayButton.size = flag.size * 1.6;
            this.embedPlayButton.fixLayout();
            if (this.embedOverlay) {
                this.embedOverlay.setExtent(this.extent());
            }
            this.stage.setCenter(this.center());
            this.embedPlayButton.setCenter(this.stage.center());
            flag.setCenter(this.embedPlayButton.center());
            flag.setLeft(flag.left() + flag.size * 0.1); // account for slight asymmetry
        } else if (this.isAppMode) {
            this.stage.setScale(Math.floor(Math.min(
                (this.width() - padding * 2) / this.stage.dimensions.x,
                (this.height() - this.controlBar.height() * 2 - padding * 2)
                / this.stage.dimensions.y
            ) * 10) / 10);
            this.stage.setCenter(this.center());
        } else {
            this.stage.setScale(this.isSmallStage ? this.stageRatio : 1);
            this.stage.setTop(
                cnf.hideControls ?
                    this.top() + border
                    : this.logo.bottom() + padding
            );
            this.stage.setRight(this.right() - border);
            if (cnf.noSprites) {
                maxPaletteWidth = Math.max(
                    200,
                    this.width() -
                    border * 2
                );
            } else {
                maxPaletteWidth = Math.max(
                    200,
                    this.width() -
                    this.stage.width() -
                    this.spriteBar.tabBar.width() -
                    padding * 2 -
                    border * 2
                );
            }
            if (this.paletteWidth > maxPaletteWidth) {
                this.paletteWidth = maxPaletteWidth;
                this.fixLayout();
            }
            this.stageHandle.fixLayout();
            this.paletteHandle.fixLayout();
        }

        // spriteBar
        this.spriteBar.setLeft(cnf.noPalette ?
            this.left() + border
            : this.paletteWidth + padding + border
        );
        this.spriteBar.setTop(
            cnf.hideControls ?
                this.top() + border
                : this.logo.bottom() + padding
        );
        this.spriteBar.setWidth(
            Math.max(0, this.stage.left() - padding - this.spriteBar.left())
        );
        this.spriteBar.setHeight(
            Math.round(this.logo.height() * 2.6)
        );
        this.spriteBar.fixLayout();

        // spriteEditor
        if (this.spriteEditor.isVisible) {
            this.spriteEditor.setLeft(this.spriteBar.left());
            this.spriteEditor.setTop(
                cnf.hideSpriteBar ?
                    (cnf.hideControls ? this.top() + border
                        : this.controlBar.bottom() + padding)
                    : this.spriteBar.bottom() + padding
            );
            this.spriteEditor.setWidth(
                cnf.noSprites ?
                    this.right() - this.spriteEditor.left() - border
                    : this.spriteBar.width()
            );
            this.spriteEditor.setHeight(
                this.bottom() - this.spriteEditor.top() - border
            );
        }

        // corralBar
        this.corralBar.setLeft(this.stage.left());
        this.corralBar.setTop(this.stage.bottom() + padding);
        this.corralBar.setWidth(this.stage.width());

        // corral
        if (!contains(['selectSprite', 'tabEditor'], situation)) {
            this.corral.setPosition(this.corralBar.bottomLeft());
            this.corral.setWidth(this.stage.width());
            this.corral.setHeight(this.bottom() - this.corral.top() - border);
            this.corral.fixLayout();
        }
    }
};