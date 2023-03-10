SyntaxElementMorph.prototype.labelParts = Object.assign(
    SyntaxElementMorph.prototype.labelParts, {
        '%prop': {
            type: 'input',
            tags: 'read-only static',
            menu: {
                'id': ['id'],
                'translation': ['translation'],
                'rotation': ['rotation'],
                'scale': ['scale']
            }
        },
        '%axis': {
            type: 'input',
            tags: 'read-only static',
            menu: {
                'x': ['x'],
                'y': ['y'],
                'z': ['z']
            }
        },
        '%dir3': {
            type: 'input',
            tags: 'read-only static',
            menu: 'directionMenu'
        },
        '%scope': {
            type: 'input',
            menu: {
                id: ['id']
            },
            value: ['id']
        },
        '%sd': {
            type: 'multi',
            slots: ['%scope', '%s'],
            label: ['to scope', 'with data'],
            tags: 'static widget',
            max: 2
        },
    }
);

InputSlotMorph.prototype.directionMenu = function (searching) {
    if (searching) {
        return {};
    }

    const block = this.parentThatIsA(BlockMorph);
    let dict;
    if (block.selector === 'move') {
        dict = {
            'forward': ['forward'],
            'backward': ['backward'],
            'left': ['left'],
            'right': ['right'],
            'up': ['up'],
            'down': ['down']
        };
    } else if (block.selector === 'turnTo') {
        dict = {
            'left': ['left'],
            'right': ['right'],
            'forward': ['forward'],
            'backward': ['backward']
        };
    } else if (block.selector === 'rollTo') {
        dict = {
            'left': ['left'],
            'right': ['right']
        };
    }
    return dict;
};

CommandBlockMorph.prototype.isStop = function () {
    if (this.selector === 'doStopThis') {
        const choice = this.inputs()[0].evaluate();
        return choice instanceof Array && choice[0].length < 12;
    }
    return ([
        'doForever',
        'doReport',
        'removeClone',
        'removeCardClone',
        'doSwitchToScene'
    ].indexOf(this.selector) > -1);
};
