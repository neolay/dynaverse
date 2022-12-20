export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite", "madhatter", "marchhare", "queenofhearts", "cheshirecat", "alice"
    ];

    Constants.UserBehaviorDirectory = "behaviors/diverse";
    Constants.UserBehaviorModules = [
        "lights.js", "sound.js", "throb.js", "urlLink.js", "bounce.js", "simpleSpin.js", "text3D.js", "replaceWorld.js", "blocks.js"
    ];

    Constants.ExcludedSystemBehaviorModules = ["gizmo.js"];
    Constants.IncludedSystemBehaviorModules = ["pedestal.js"];

    Constants.DefaultCards = [
        {
            card: {
                name: "entrance",
                type: "object",
                spawn: "default",
                behaviorModules: ["BlocksGUI", "SpriteManager"],
            }
        },
        {
            card: {
                name: "world model",
                type: "3d",
                dataLocation: "./assets/3D/artgallery_042122.glb.zip",
                dataScale: [1, 1, 1],
                singleSided: true,
                shadow: true,
                layers: ["walk"],
                translation: [0, -1.7, 0],
                placeholder: true,
                placeholderSize: [100, 0.01, 100],
                placeholderColor: 0xcccccc,
                placeholderOffset: [0, -1.7, 0],
            }
        },
        {
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
                dataLocation: "./assets/sky/shanghai_riverside_2k.exr",
                dataType: "exr",
            }
        },
        {
            card: {
                name: "scratch cat",
                type: "3d",
                dataLocation: "./assets/3D/scratch_cat.glb.zip",
                layers: ["pointer"],
                translation: [-2.973275739954604, -0.746324277905422, -8],
                rotation: [0, 0.042575427635536914, 0, 0.9990932553879298],
                dataScale: [2.5, 2.5, 2.5],
                shadow: true,
                behaviorModules: ["BlocksEditor"],
            }
        },
        {
            card: {
                name: "dynalab",
                translation: [-12.1, 1.5, -10.18],
                rotation: [0, Math.PI / 2, 0],
                scale: [3, 3, 3],
                type: "2d",
                textureType: "image",
                textureLocation: "35hx21Njx2Qq88GJL9vtaSGIhcAE1Ty9AlN52EAjdykUXUFBRUYPGhpTXFlQRhtARhtWR1pEQFBBG1xaGkAaT2BBQmV6T3NAemYEflxSeG9cAAYMTXNxcg0FBxpcWhtWR1pEQFBBG1hcVkdaQ1BHRlAbWVpWVFlRUENRUFNUQFlBGnRMQVBScQRYdn0FV1RGUVBBeHYEAwRiVkFbUmFNTQRscEUGRF8AbEBxAloaUVRBVBpgc0VXbGVnZnJGf2dsdmQGY35ScllXcGJqGAJ-Aw0YU1B_XUUHW3d_XANG",
                fullBright: true,
                frameColor: 0xcccccc,
                color: 0xbbbbbb,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
                behaviorModules: ["URLLink"],
                cardURL: "https://github.com/dynalab-live",
            }
        },
        {
            card: {
                name: "windmill",
                type: "3d",
                dataLocation: "./assets/3D/windmill.glb.zip",
                layers: ["pointer"],
                translation: [3.353431584172484, 0.32, -10],
                rotation: [-0.7063054944928459, 0.03365335717601678, 0.7063054944928457, 0.033653357176016786],
                dataScale: [0.7, 0.7, 0.7],
                shadow: true,
                behaviorModules: ["SimpleSpin"],
            }
        },
        {
            card: {
                name: "scratch cat flying",
                translation: [12, 0.70, -10.24],
                rotation: [0, -Math.PI / 2, 0],
                behaviorModules: ["Bounce"],
                scale: [3, 3, 3],
                width: 1,
                height: 1,
                layers: ["pointer"],
                type: "2d",
                dataLocation: "./assets/SVG/full-circle.svg",
                textureType: "dynamic",
                textureWidth: 1024,
                textureHeight: 1024,
                frameColor: 0x888888,
                color: 0xffffff,
                depth: 0.05,
                fullBright: true,
            }
        },
        {
            card: {
                name: "message",
                text: "Blocks!",
                color: 0xF0493E,
                frameColor: 0x444444,
                weight: 'bold',
                font: "helvetiker",
                fullBright: true,
                bevelEnabled: false,
                translation: [-7.066189321712586, -0.4259831336397919, -10.00003322547244],
                rotation: [0, 0.4153962766047525, 0, 0.9096405517471765],
                scale: [2, 2, 2],
                behaviorModules: ["Text3D", "BlocksEditor"],
                shadow: true,
            }
        },
        {
            card: {
                name: "dynalab",
                translation: [-0.2, 0.5, -10],
                scale: [2, 2, 2],
                type: "2d",
                textureType: "image",
                textureLocation: "3BGpBXkpV9coWx6zMWorilvkUn4P856H2wYmCwKITE8wKjY2MjF4bW0kKy4nMWw3MWwhMC0zNyc2bCstbTdtOBc2NRINOAQ3DRFzCSslDxgrd3F7OgQGBXpycG0rLWwhMC0zNyc2bC8rITAtNCcwMSdsLi0hIy4mJzQmJyQjNy42bXMwFTIBACwUCRUYNyUGCB0dexQVLDUgATQFOjFyNilwKytwIHAdOwsTCg9tJiM2I20bCXEVDS8KAXEIDRc6czMrBHouFgcSJhcYKgp6DBcVdTUnNhoHCgRxBwcX",
                fullBright: true,
                frameColor: 0xcccccc,
                color: 0xbbbbbb,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
                behaviorModules: ["BlocksEditor"],
            }
        },
    ];
}
