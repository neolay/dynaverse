export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite", "madhatter", "marchhare", "queenofhearts", "cheshirecat", "alice"
    ];

    Constants.UserBehaviorDirectory = "behaviors/diverse";
    Constants.UserBehaviorModules = [
        "lights.js", "sound.js", "throb.js", "urlLink.js", "bounce.js", "simpleSpin.js", "text3D.js", "graphing.js", "blocks.js"
    ];

    Constants.DefaultCards = [
        {
            card: {
                name: "entrance",
                type: "object",
                spawn: "default",
                behaviorModules: ["SpriteManager"],
                translation: [
                    7.5516356710613435,
                    -0.06965080749988539,
                    -0.9345792539321668
                ],
                rotation: [
                    0,
                    0.48725287459904615,
                    0,
                    0.8732609210281691
                ],
                // lang: "zh_CN"
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
                translation: [2.8700464783328092, 0.3353000862885606, -10],
                rotation: [0.14204542629682113, 0.6926926424238634, -0.1420454262968211, 0.6926926424238635],
                dataScale: [0.7, 0.7, 0.7],
                shadow: true,
                // behaviorModules: ["SimpleSpin"],
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
                behaviorModules: ["Text3D"],
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
            }
        },
        {
            card: {
                name: "heart",
                translation: [-3.2923719590754903, -0.6135479654834599, -10],
                scale: [1, 1, 1],
                rotation: [0, 0.22751997615512262, 0, 0.9737734133002258],
                layers: ["pointer"],
                dataLocation: "3Kl2Rl7pX7CI02-9odYVozxQNAF8W1wElG9a1MT4fRCMIz8_OzhxZGQtIicuOGU-OGUoOSQ6Pi4_ZSIkZD5kDC8dKTInAjgKIBooCRMveAwzKj0yPB4AHBISeWQiJGUoOSQ6Pi4_ZSYiKDkkPS45OC5kLyIHGAwpAjl-Zn8YPwARew4RA3sHfiR-L31-BRM-JAQPf3MyBnwyOwEHe2QvKj8qZHsgLwk7fCATAxoELBIIDQckHWYsLAoCASc_fnICJw59AjghPzk_BSIteBI",
                dataScale: [0.3, 0.3, 0.3],
                fileName: "heart.glb",
                modelType: "glb",
                shadow: true,
                singleSided: true,
                type: "3d",
            }
        },
        {
            card: {
                name: "line graphs background",
                translation: [11.914606500892997, 0.4, -1],
                rotation: [0, -Math.PI / 2, 0],
                scale: [2, 2, 2],
                className: "TextFieldActor",
                type: "text",
                layers: ["pointer"],
                color: 0xFFFFFF,
                backgroundColor: 0x202020,
                frameColor: 0x202020,
                width: 1.1,
                height: 1.2,
                depth: 0.05,
                margins: {bottom: 20, left: 20, right: 20, top: 20},
                runs: [{text: "tilt x\n\n\n\ntilt y\n\n\n\ntilt z"}],
                textScale: 0.002,
            },
            id: "linegraphs",
        },
        {
            card: {
                name: "yellow line graph",
                translation: [0, -0.5, 0.05],
                height: 0.2,
                color: 0xffff00,
                generateValues: {min: 0, max: 100, tick: 100},
                length: 20,
                behaviorModules: ["Values", "LineGraph"],
                parent: "linegraphs",
            },
        },
        {
            card: {
                name: "cyan line graph",
                translation: [0, -0.1, 0.05],
                height: 0.2,
                color: 0x00ffff,
                generateValues: {min: 0, max: 100, tick: 100},
                length: 20,
                behaviorModules: ["Values", "LineGraph"],
                parent: "linegraphs",
            },
        },
        {
            card: {
                name: "magenta line graph",
                translation: [0, 0.3, 0.05],
                height: 0.2,
                color: 0xff00ff,
                generateValues: {min: 0, max: 100, tick: 100},
                length: 20,
                behaviorModules: ["Values", "LineGraph"],
                parent: "linegraphs",
            },
        },
        {
            card: {
                name: "bar graph background",
                translation: [11.914606500892997, 0.4, 2],
                rotation: [0, -Math.PI / 2, 0],
                scale: [2, 2, 2],
                className: "TextFieldActor",
                type: "text",
                layers: ["pointer"],
                color: 0xFFFFFF,
                backgroundColor: 0x202020,
                frameColor: 0x202020,
                width: 1.1,
                height: 1.2,
                depth: 0.05,
                margins: {bottom: 20, left: 20, right: 20, top: 20},
                runs: [{text: "Power"}],
                textScale: 0.002,
            },
            id: "bargraph"
        },
        {
            card: {
                name: "bar graph",
                translation: [0, -0.5, 0.05],
                width: 2,
                height: 1,
                color: 0x008000,
                generateValues: {min: 0, max: 100, tick: 100},
                length: 20,
                behaviorModules: ["Values", "BarGraph"],
                parent: "bargraph",
            },
        },
        {
            card: {
                name: "alice",
                translation: [0, 0, 0],
                scale: [0.42698682808571414, 0.42698682808571414, 0.42698682808571414],
                rotation: [0, Math.PI, 0],
                layers: ["pointer"],
                dataLocation: "30hu3n--alpLJIMDzvTbHl8E27n0N7PU4oDBPiyOaOU4WEREQEMKHx9WWVxVQx5FQx5TQl9BRVVEHllfH0UfSmVER2B_SnZFf2MBe1lXfWpZBQMJSHZ0dwgAAh9ZXx5TQl9BRVVEHl1ZU0JfRlVCQ1UeXF9TUVxUVUZUVVZRRVxEHwNpVHx_ZWpReQNxQUR-fWh9VlRpBAdJRFZqRV4Je3xSVwBvSkkAd1N8SnEfVFFEUR9oY0ZHf294YQZUU1tEeGVEaVdpQAFRR3h_eWN-UwFmRkJoZkNpY1QCW111",
                dataScale: [0.5937912363848868, 0.5937912363848868, 0.5937912363848868],
                fileName: "/alice.zip",
                modelType: "zip",
                shadow: true,
                singleSided: true,
                type: "3d",
            }
        },
    ];
}
