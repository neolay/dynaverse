window.onload = function () {
    const hud = document.getElementById("hud");
    if (hud) {
        hud.style.display = "none";
    }
    const editor = document.getElementById('editor');
    if (editor) {
        for (const event of ["keydown", "keyup",
            "click", "mousedown", "mouseup", "mousemove", "wheel",
            "touchstart", "touchend", "touchmove", "touchcancel",
            "pointerdown", "pointerup", "pointermove", "pointercancel",
        ]) {
            editor[`on${event}`] = event => event.stopPropagation();
        }
        const config = {
            path: "./lib/blocks",
            // load: "./blocks/inline.xml",
            design: "flat",
            border: 1,
            dynaverseMode: true,
            // hideControls: true,
            // hideCategories: true,
            // hideSpriteBar: true,
            // noSprites: true,
            // noImports: true,
            // noOwnBlocks: true,
            noRingify: true,
            noUserSettings: true,
            categories: [
                "motion",
                "looks",
                "sound",
                "control",
                "sensing",
                "operators",
                "variables",
            ]
        };
        const loop = () => {
            requestAnimationFrame(loop);
            window.world.doOneCycle();
        };
        window.world = new WorldMorph(document.getElementById('world'));
        new IDE_Morph(config).openIn(window.world);
        requestAnimationFrame(loop);
    }
};
