class CrystalballActor {
    setup() {
        this.isMagic = false;
        this.update();
        this.addEventListener("pointerDown", this.toggle);
    }

    update() {
        this.say("update", this.now());
        this.future(50).update();
    }

    toggle() {
        this.isMagic = !this.isMagic;
    }
}

class CrystalballPawn {
    setup() {
        const heightMap = new THREE.TextureLoader().load("./assets/images/heightMap.jpeg");
        const displacementMap = new THREE.TextureLoader().load("./assets/images/displacementMap.jpeg");
        heightMap.wrapS = heightMap.wrapT = THREE.RepeatWrapping;
        displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;
        heightMap.minFilter = displacementMap.minFilter = THREE.NearestFilter;

        const material = new THREE.MeshStandardMaterial({
            roughness: 0.3,
            metalness: 0.2
        });

        const uniforms = {
            colorA: {value: new THREE.Color(0x404040)},
            colorB: {value: new THREE.Color(0x808080)},
            heightMap: {value: heightMap},
            displacementMap: {value: displacementMap},
            iterations: {value: 48},
            depth: {value: 0.2},
            smoothing: {value: 0.2},
            displacement: {value: 0.1},
            time: {value: 0},
        };

        // tutorial https://tympanus.net/codrops/2021/08/02/magical-marbles-in-three-js
        material.onBeforeCompile = shader => {
            shader.uniforms = {...shader.uniforms, ...uniforms}

            // add to top of vertex shader
            shader.vertexShader = /* glsl */`
                varying vec3 v_pos;
                varying vec3 v_dir;
                ` + shader.vertexShader

            // assign values to varyings inside of main()
            shader.vertexShader = shader.vertexShader.replace(
                /void main\(\) {/,
                (match) => match + /* glsl */ `
                v_dir = position - cameraPosition; // Points from camera to vertex
                v_pos = position;
                `
            )

            // add to top of fragment shader
            shader.fragmentShader = /* glsl */ `
                #define FLIP vec2(1., -1.)
                
                uniform vec3 colorA;
                uniform vec3 colorB;
                uniform sampler2D heightMap;
                uniform sampler2D displacementMap;
                uniform int iterations;
                uniform float depth;
                uniform float smoothing;
                uniform float displacement;
                uniform float time;
                
                varying vec3 v_pos;
                varying vec3 v_dir;
                ` + shader.fragmentShader

            // add above fragment shader main() so we can access common.glsl.js
            shader.fragmentShader = shader.fragmentShader.replace(
                /void main\(\) {/,
                (match) => /* glsl */ `
                /**
                 * @param p - Point to displace
                 * @param strength - How much the map can displace the point
                 * @returns Point with scrolling displacement applied
                 */
                vec3 displacePoint(vec3 p, float strength) {
                  vec2 uv = equirectUv(normalize(p));
                  vec2 scroll = vec2(time, 0.);
                  vec3 displacementA = texture(displacementMap, uv + scroll).rgb; // Upright
                  vec3 displacementB = texture(displacementMap, uv * FLIP - scroll).rgb; // Upside down
                  
                  // Center the range to [-0.5, 0.5], note the range of their sum is [-1, 1]
                  displacementA -= 0.5;
                  displacementB -= 0.5;
                  
                  return p + strength * (displacementA + displacementB);
                }
                
                /**
                * @param rayOrigin - Point on sphere
                * @param rayDir - Normalized ray direction
                * @returns Diffuse RGB color
                */
                vec3 marchMarble(vec3 rayOrigin, vec3 rayDir) {
                  float perIteration = 1. / float(iterations);
                  vec3 deltaRay = rayDir * perIteration * depth;
                  // Start at point of intersection and accumulate volume
                  vec3 p = rayOrigin;
                  float totalVolume = 0.;
                  for (int i=0; i<iterations; ++i) {
                    // Read heightmap from spherical direction of displaced ray position
                    vec3 displaced = displacePoint(p, displacement);
                    vec2 uv = equirectUv(normalize(displaced));
                    float heightMapVal = texture(heightMap, uv + vec2(time, time)).r;
                    // Take a slice of the heightmap
                    float height = length(p); // 1 at surface, 0 at core, assuming radius = 1
                    float cutoff = 1. - float(i) * perIteration;
                    float slice = smoothstep(cutoff, cutoff + smoothing, heightMapVal);
                    // Accumulate the volume and advance the ray forward one step
                    totalVolume += slice * perIteration;
                    p += deltaRay;
                  }
                  return mix(colorA, colorB, totalVolume);
                }
                ` + match
            )

            shader.fragmentShader = shader.fragmentShader.replace(
                /vec4 diffuseColor.*;/,
                /* glsl */ `
                vec3 rayDir = normalize(v_dir);
                vec3 rayOrigin = v_pos;
                
                vec3 rgb = marchMarble(rayOrigin, rayDir);
                vec4 diffuseColor = vec4(rgb, 1.);      
                `
            )
        }
        material.uniforms = uniforms;

        this.crystalball = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 16),
            material
        );

        this.pointLight = new THREE.PointLight(0x00abff, 0);
        this.crystalball.add(this.pointLight);

        this.shape.add(this.crystalball);

        this.listen("update", this.update);
    }

    update(t) {
        if (this.actor.isMagic) {
            this.crystalball.material.uniforms.colorA.value = new THREE.Color(0x023a56);
            this.crystalball.material.uniforms.colorB.value = new THREE.Color(0x00abff);
            this.crystalball.material.uniforms.time.value += 0.005;
            this.pointLight.intensity = 0.5 + 0.5 * Math.sin(t * 0.001) * Math.cos(t * 0.01);
        } else {
            this.crystalball.material.uniforms.colorA.value = new THREE.Color(0x404040);
            this.crystalball.material.uniforms.colorB.value = new THREE.Color(0x808080);
            this.pointLight.intensity = 0;
        }
    }
}

export default {
    modules: [
        {
            name: "Crystalball",
            actorBehaviors: [CrystalballActor],
            pawnBehaviors: [CrystalballPawn],
        }
    ]
}
