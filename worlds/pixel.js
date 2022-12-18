export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite", "madhatter", "marchhare", "queenofhearts", "cheshirecat", "alice"
    ];

    Constants.UserBehaviorDirectory = "behaviors/diverse";
    Constants.UserBehaviorModules = [
        "lights.js", "sound.js", "throb.js", "urlLink.js", "bounce.js", "simpleSpin.js", "text3D.js", "pixel.js", "forklift.js", "platform.js"
    ];

    Constants.DefaultCards = [
        {
            card: {
                name: "entrance",
                type: "object",
                translation: [0, 0.4, 12],
                spawn: "default",
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
                name: "mbit display",
                behaviorModules: ["MbitDisplay"],
                layers: ["pointer"],
                type: "object",
                translation: [-5, 0.6, -16.87],
                // rotation: [0, -Math.PI / 2, 0],
                shadow: true,
                scale: [3.1, 3.1, 3.1],
                pixelX: 5,
                pixelY: 5,
            }
        },
        {
            card: {
                name: "bag display",
                behaviorModules: ["BagDisplay"],
                layers: ["pointer"],
                type: "object",
                translation: [5.5, 0.6, -16.87],
                // rotation: [0, -Math.PI / 2, 0],
                shadow: true,
                scale: [1, 1, 1],
                pixelX: 16,
                pixelY: 16,
            }
        },
        {
            card: {
                name: "pixel display",
                behaviorModules: ["PixelDisplay"],
                layers: ["pointer"],
                type: "object",
                translation: [0.2, 0.6, -16.87],
                // rotation: [0, -Math.PI / 2, 0],
                shadow: true,
                scale: [1.75, 1.75, 1.75],
                pixelX: 9,
                pixelY: 9,
            }
        },
        {
            card: {
                name: "strip display",
                behaviorModules: ["StripDisplay"],
                layers: ["pointer"],
                type: "object",
                translation: [-0.05, -1.55, -16.87],
                // rotation: [0, -Math.PI / 2, 0],
                shadow: true,
                scale: [1, 1, 1],
                pixelX: 120,
                pixelY: 1,
                ledWidth: 0.15,
                ledHeight: 0.15,
            }
        },
        {
            card: {
                name: "forklift",
                dataTranslation: [0, -1.65, 0],
                translation: [0, 0, 0],
                dataScale: [1.2, 1.2, 1.2],
                behaviorModules: ["ForkLift"],
                layers: ["pointer"],
                dataLocation: "3UkowQroW_SGvJ0N4hXnZO_pwIEEVlVQNTvj8CJ0CG78PSEhJSZvenozPDkwJnsgJns2JzokIDAhezw6eiB6EjEDNyw5HCYUPgQ2Fw0xZhItNCMsIgAeAgwMZ3o8Ons2JzokIDAhezg8Nic6IzAnJjB6YBAAGSIZES8PHCcNBAVhIhlkbScSITQYHhliDR8SNy0DFz8gFAo7PAcTPnoxNCE0enhkF3gzEjxsDQYaIhwTYDsfGjkHMz84OCMTCjcjPzIfF3gkNzYgEyUtGzI",
                pathIndex: 1,
                modelType: "glb",
                shadow: true,
                singleSided: true,
                type: "3d",
            }
        },
        {
            card: {
                name: "move cuboid",
                translation: [-8, -1.55, 13.5],
                behaviorModules: ["MoveCuboid", "DebugRender"],
                type: "object",
            }
        },
        {
            card: {
                name: "elevated stage",
                behaviorModules: ["ElevatedStage", "DebugRender"],
                layers: ["pointer"],
                type: "object",
                translation: [5.694537082265905, -1.5985832680931038, 11.283709368434067],
                shadow: true,
                scale: [1, 1, 1],
                rotation: [0, Math.PI, 0],
            },
            id: "stage",
        },
        {
            card: {
                name: "cuboid base",
                type: "object",
                layers: ["pointer"],
                behaviorModules: ["Physics", "PhysicsDemo"],
                physicsSize: [1, 0.2, 1],
                color: 0xff0000,
                physicsShape: "cuboid",
                physicsType: "dynamic",
                shadow: true,
                translation: [0, 1, 0],
                physicsRender: false,
                parent: "stage",
            },
            id: "cuboid",
        },
        {
            card: {
                name: "samba glasses",
                layers: ["pointer"],
                animationClipIndex: 0,
                animationStartTime: 549887,
                dataLocation: "3cc4ywUoRo62Cyj8hcs7tuwOmqQP5ZGyj93MyhNsydMoCxcXExBZTEwFCg8GEE0WEE0AEQwSFgYXTQoMTBZMGTYXFDMsGSUWLDBSKAoELjkKVlBaGyUnJFtTUUwKDE0AEQwSFgYXTQ4KABEMFQYREAZNDwwAAg8HBhUHBgUCFg8XTFRaKgYaOSQmWhoKETsMJBIEGQcLLRYyAAwtB1NVCSg5EVdXVFckNAE8NVdMBwIXAkwIB1cUCwkNKE5OASIbNjU6ChMSExQALgEVNyo3LycZOwICAhYOIScqGwsy",
                dataScale: [0.015, 0.015, 0.015],
                fileName: "/SambaGlasses.fbx",
                modelType: "fbx",
                shadow: true,
                singleSided: true,
                type: "3d",
                parent: "cuboid",
            }
        },
        {
            card: {
                translation: [5.694537082265905, -1.496254626075859, 4.3],
                layers: ["pointer"],
                behaviorModules: ["Spray", "DebugRender"],
                name: "spray",
                color: 13421772,
                shadow: true,
                type: "object",
            }
        },
        {
            card: {
                translation: [-1.3, -1.496254626075859, 11.283709368434067],
                layers: ["pointer"],
                behaviorModules: ["Spray", "DebugRender"],
                name: "spray",
                color: 13421772,
                shadow: true,
                type: "object",
            }
        },
        {
            card: {
                name: "control button",
                translation: [5, 0.6, 17],
                rotation: [Math.PI / 2, 0, 0],
                scale: [3, 3, 3],
                behaviorModules: ["ControlButton"],
                shadow: true,
                type: "object",
            }
        },
        {
            card: {
                name: "dynalab",
                translation: [12, 0.6, 10.77],
                rotation: [0, -Math.PI / 2, 0],
                scale: [3, 3, 3],
                type: "2d",
                textureType: "image",
                textureLocation: "3BGpBXkpV9coWx6zMWorilvkUn4P856H2wYmCwKITE8wKjY2MjF4bW0kKy4nMWw3MWwhMC0zNyc2bCstbTdtOBc2NRINOAQ3DRFzCSslDxgrd3F7OgQGBXpycG0rLWwhMC0zNyc2bC8rITAtNCcwMSdsLi0hIy4mJzQmJyQjNy42bXMwFTIBACwUCRUYNyUGCB0dexQVLDUgATQFOjFyNilwKytwIHAdOwsTCg9tJiM2I20bCXEVDS8KAXEIDRc6czMrBHouFgcSJhcYKgp6DBcVdTUnNhoHCgRxBwcX",
                fullBright: true,
                frameColor: 0xcccccc,
                color: 0xbbbbbb,
                cornerRadius: 0.1,
                depth: 0.05,
                shadow: true,
            }
        },
        {
            card: {
                name: "dynalab",
                translation: [-12.1, 1.7, -10.18],
                rotation: [0, Math.PI / 2, 0],
                scale: [4, 4, 4],
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
    ];
}
