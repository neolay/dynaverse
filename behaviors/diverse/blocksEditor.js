class BlocksEditorPawn {
    setup() {
        this.addEventListener("pointerDown", this.pointerDown);
    }

    pointerDown(e) {
        if (e.shiftKey) {
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
                background-color: rgba(0, 0, 0, 0.5);">
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
                editor.remove();
            }

            const ide = new IDE_Morph({
                path: "./lib/snap",
                load: "./blocks/dynaverse-blocks.xml",
                lang: "zh_CN",
                design: "flat",
                border: 1,
                hideControls: true,
                hideCategories: true,
                noSprites: true,
                noImports: true,
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
            requestAnimationFrame(loop);
        }
    }
}

export default {
    modules: [
        {
            name: "BlocksEditor",
            pawnBehaviors: [BlocksEditorPawn],
        }
    ]
}
