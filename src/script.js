import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import vertexEarth from './glsl/earth/earth-vertex.glsl';
import fragmentEarth from './glsl/earth/earth-fragment.glsl';
import vertexEarthAtmosphere from './glsl/earth/earth-atmosphere-vertex.glsl';
import fragmentEarthAtmosphere from './glsl/earth/earth-atmosphere-fragment.glsl';
import sunFragment from './glsl/sun/noise/sun-fragment.glsl';
import sunVertex from './glsl/sun/noise/sun-vertex.glsl';
import sunFragmentTexture from './glsl/sun/texture/sun-fragment.glsl';
import sunVertexTexture from './glsl/sun/texture/sun-vertex.glsl';
import sunAtmosphereVertex from './glsl/sun/atmosphere/vertex.glsl';
import sunAtmosphereFragment from './glsl/sun/atmosphere/fragment.glsl';

// Debug
const gui = new dat.GUI();

//loader

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('textures/earth.jpg');
const starsTexture = textureLoader.load('textures/stars-particle.png');
const asteroidTexture = textureLoader.load('textures/asteroid.png');
const milkwayTexture = textureLoader.load('textures/milkwayHigh.jpg');

function createPathStrings(filename) {
    const basePath = "/textures/space/";
    const baseFilename = basePath + filename;
    const fileType = ".png";
    const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    const pathStrings = sides.map(side => {
        return baseFilename + "_" + side + fileType;
    });

    return pathStrings;
}

function createMaterialArray(filename) {

    const skyboxImagepaths = createPathStrings(filename);
  
    const materialArray = skyboxImagepaths.map(image => {
  
      let texture = new THREE.TextureLoader().load(image);
  
      return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  
    });
  
    return materialArray;
  
}

const imagePath = "corona";
const materialArray = createMaterialArray(imagePath);

milkwayTexture.wrapS = milkwayTexture.wrapT = THREE.MirroredRepeatWrapping;
milkwayTexture.repeat.set(4,1);

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const scene1 = new THREE.Scene();

// Objects
const spaceBox = new THREE.BoxBufferGeometry(600, 600, 600);
const orbitSphereGeometry = new THREE.SphereBufferGeometry(0.1, 6, 6);
const mercuryGeometry = new THREE.SphereBufferGeometry(0.1, 32, 16);
const venusGeometry = new THREE.SphereBufferGeometry(0.2, 32, 16);
const marsGeometry = new THREE.SphereBufferGeometry(0.25, 32, 16);
const asteroidBeltGeometry = new THREE.TorusBufferGeometry( 14, 0.6, 30, 200, 1000 );
const jupiterGeometry = new THREE.SphereBufferGeometry(1.5, 32, 16);
const saturnGeometry = new THREE.SphereBufferGeometry(1, 32, 16);
const saturnRingGeometry = new THREE.RingGeometry( 1.2, 1.4, 32 );
const secondSaturnRingGeometry = new THREE.RingGeometry( 1.45, 1.7, 32 );
const uranoGeometry = new THREE.SphereBufferGeometry(0.6, 32, 16);
const neptuneGeometry = new THREE.SphereBufferGeometry(0.8, 32, 16);
const sunGeometry = new THREE.SphereBufferGeometry( 4, 32, 30 );
const sunPerlinGeometry = new THREE.SphereBufferGeometry( 4, 32, 30 );
const sunAtmosphereGeometry = new THREE.SphereBufferGeometry( 4.2, 32, 16 );
const earthPlanetGeometry = new THREE.SphereBufferGeometry( 0.4, 32, 16 );
const earthAtmosphereGeometry = new THREE.SphereBufferGeometry( 0.5, 32, 16 );

// Particles
const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 50000;

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) { 
    posArray[i] = (Math.random() - 0.5) * (Math.random() - 0.5) * 80;    
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Materials

const material = new THREE.MeshBasicMaterial({
    color: '3f7b9d'
});

const starsMaterial = new THREE.PointsMaterial({
    size: 0.01,
    map: starsTexture,
    transparent: true,
    color: 'white'
});

const asteroidMaterial = new THREE.PointsMaterial({
    size: 0.2,
    map: asteroidTexture,
    transparent: true,
    color: 'white'
});

const mercuryMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexEarth,
    fragmentShader: fragmentEarth,
    uniforms: {
        globeTexture: {
            value: textureLoader.load('textures/mercury.jpg')
        }
    }
});

const venusMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexEarth,
    fragmentShader: fragmentEarth,
    uniforms: {
        globeTexture: {
            value: textureLoader.load('textures/venus.jpg')
        }
    }
});

const marsMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexEarth,
    fragmentShader: fragmentEarth,
    uniforms: {
        globeTexture: {
            value: textureLoader.load('textures/mars.jpg')
        }
    }
});

const saturnMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexEarth,
    fragmentShader: fragmentEarth,
    uniforms: {
        globeTexture: {
            value: textureLoader.load('textures/saturn.jpg')
        }
    }
});

const saturnRingMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexEarth,
    fragmentShader: fragmentEarth,
    side: THREE.DoubleSide,
    uniforms: {
        globeTexture: {
            value: textureLoader.load('textures/saturn-rings-new.jpg')
        }
    }
});

const jupiterMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexEarth,
    fragmentShader: fragmentEarth,
    uniforms: {
        globeTexture: {
            value: textureLoader.load('textures/jupiter.jpg')
        }
    }
});

const uranoMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexEarth,
    fragmentShader: fragmentEarth,
    uniforms: {
        globeTexture: {
            value: textureLoader.load('textures/urano.jpg')
        }
    }
});

const neptuneMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexEarth,
    fragmentShader: fragmentEarth,
    uniforms: {
        globeTexture: {
            value: textureLoader.load('textures/neptune.jpg')
        }
    }
});
const earthMaterial = new THREE.ShaderMaterial({
   vertexShader: vertexEarth,
   fragmentShader: fragmentEarth,
   uniforms: {
       globeTexture: {
           value: earthTexture
       }
   }
});

const materialSun = new THREE.ShaderMaterial({
    vertexShader: sunVertexTexture,
    fragmentShader: sunFragmentTexture,
    side: THREE.DoubleSide,
    uniforms: {
        time: {
            value: { value: 0}
        },
        uPerlin: { value: null},
        resolution: { value: new THREE.Vector4()}
    }
 });

 const sunAtmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: sunAtmosphereVertex,
    fragmentShader: sunAtmosphereFragment,
    side: THREE.BackSide,
    uniforms: {
        time: {
            value: { value: 0}
        },
        uPerlin: { value: null},
        resolution: { value: new THREE.Vector4()}
    }
 });

const earthAtmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexEarthAtmosphere,
    fragmentShader: fragmentEarthAtmosphere,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
 });

const cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(
        256, {
            format: THREE.RGBFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipMapLinearFilter,
            encoding: THREE.sRGBEncoding
        }
    );

const cubCamera1 = new THREE.CubeCamera(0.1, 10, cubeRenderTarget1);


const materialPerlin = new THREE.ShaderMaterial({
    vertexShader: sunVertex,
    fragmentShader: sunFragment,
    side: THREE.DoubleSide,
    uniforms: {
        time: {
            value: { value: 0}
        },
        resolution: { value: new THREE.Vector4()}
    }
 });

// Mesh
const spaceBoxMesh = new THREE.Mesh(spaceBox, materialArray);
const orbitMeshMercury = new THREE.Mesh(orbitSphereGeometry, material);
const orbitMeshVenus = new THREE.Mesh(orbitSphereGeometry, material);
const orbitMeshEarth = new THREE.Mesh(orbitSphereGeometry, material);
const orbitMeshMars = new THREE.Mesh(orbitSphereGeometry, material);
//const asteroidBeltGeometryMesh = new THREE.Points(asteroidBeltGeometry, asteroidBeltMaterial);

const orbitMeshJupiter = new THREE.Mesh(orbitSphereGeometry, material);
const orbitMeshSaturn = new THREE.Mesh(orbitSphereGeometry, material);
const orbitMeshUrano = new THREE.Mesh(orbitSphereGeometry, material);
const orbitMeshNeptune = new THREE.Mesh(orbitSphereGeometry, material);
const particlesMesh = new THREE.Points(particlesGeometry, starsMaterial);
//const asteroidMesh = new THREE.Points(asteroidsGeometry, asteroidMaterial);
const mercuryPlanet = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
const venusPlanet = new THREE.Mesh(venusGeometry, venusMaterial);
const earthPlanet = new THREE.Mesh(earthPlanetGeometry, earthMaterial);
const marsPlanet = new THREE.Mesh(marsGeometry, marsMaterial)
const saturnPlanet = new THREE.Mesh(saturnGeometry, saturnMaterial);
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
const secondSaturnRing = new THREE.Mesh(secondSaturnRingGeometry, saturnRingMaterial);
const jupiterPlanet = new THREE.Mesh(jupiterGeometry, jupiterMaterial)
const uranoPlanet = new THREE.Mesh(uranoGeometry, uranoMaterial);
const neptunePlanet = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
const sun = new THREE.Mesh(sunGeometry, materialSun);
const sunPerlin = new THREE.Mesh(sunPerlinGeometry, materialPerlin);
const sunAtmosphere = new THREE.Mesh(sunAtmosphereGeometry, sunAtmosphereMaterial)
const earthPlanetAtmosphere = new THREE.Mesh(earthAtmosphereGeometry, earthAtmosphereMaterial);

const planets = [];
planets.push(orbitMeshMercury,
    orbitMeshVenus,
    orbitMeshEarth,
    orbitMeshMars,
    orbitMeshJupiter,
    orbitMeshSaturn,
    orbitMeshUrano,
    orbitMeshNeptune
);

for(let i = 0; i < planets.length; i++){
    planets[i].position.set(0,0,0);
}

scene.add(
    spaceBoxMesh,
    orbitMeshMercury,
    orbitMeshVenus,
    orbitMeshEarth,
    orbitMeshMars,
    // asteroidBeltGeometryMesh,
    orbitMeshJupiter,
    orbitMeshSaturn,
    orbitMeshUrano,
    orbitMeshNeptune,
    particlesMesh, 
    sun,
    sunAtmosphere
);

//asteroidBeltGeometryMesh.add(asteroidMesh);

orbitMeshMercury.add(mercuryPlanet);
orbitMeshVenus.add(venusPlanet); 
orbitMeshEarth.add(earthPlanet); 
orbitMeshMars.add(marsPlanet); 
orbitMeshJupiter.add(jupiterPlanet); 
orbitMeshSaturn.add(saturnPlanet); 
orbitMeshUrano.add(uranoPlanet); 
orbitMeshNeptune.add(neptunePlanet);

const v = new THREE.Vector2();

function randomAsteroidCircle(radius){
    const x = THREE.MathUtils.randFloat(-1,1);
    const y = THREE.MathUtils.randFloat(-1,1);
    const r = THREE.Math.randFloat( 0.5 * radius, 0.58 * radius );

    const normalizationFactor = 1 / Math.sqrt(x * x + y * y);

    v.x = x * normalizationFactor * r;
    v.y = y * normalizationFactor * r;

    return v;
}

function asteroidBelt(radius, asteroidsCount, size = 0.1) {
    const asteroidsGeometryBelt = new THREE.BufferGeometry;
    const positions = [];

    for (let i = 0; i < asteroidsCount; i++){
        const vertex = randomAsteroidCircle(radius);
        positions.push(vertex.x, vertex.y, 0);
    }

    asteroidsGeometryBelt.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const asteroidMaterialBelt = new THREE.PointsMaterial({
        size,
        map: asteroidTexture
    });

    const asteroids = new THREE.Points(asteroidsGeometryBelt, asteroidMaterialBelt);
    asteroids.rotateX( Math.PI / 2 );

    scene.add(asteroids);

    return asteroids;

}

const asteroidBeltOne = asteroidBelt(27, 2500);
const asteroidBeltTwo = asteroidBelt(84, 10000, 0.22);

earthPlanet.add(earthPlanetAtmosphere)
earthPlanet.position.x = 10;
mercuryPlanet.position.x = -6;
venusPlanet.position.x = 7;
marsPlanet.position.x = -12;
saturnPlanet.add(saturnRing);
saturnPlanet.add(secondSaturnRing);
saturnPlanet.position.x = 23;
jupiterPlanet.position.x = -18;
uranoPlanet.position.x = 29
neptunePlanet.position.x = -35;


saturnRing.rotateX( Math.PI / 1.5 );
secondSaturnRing.rotateX( Math.PI / 1.5 );
scene1.add(sunPerlin);

// Lights
const pointLight = new THREE.PointLight(0xfffff, 0.1);
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 0;
scene.add(pointLight);

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio);
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 7;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.minDistance = 1;
controls.enableDamping = true;
controls.maxDistance = 100;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;

/**
 * Animate
 */

const clock = new THREE.Clock();
let time = 0;
function animate() {

    cubCamera1.update( renderer, scene1);
    materialSun.uniforms.uPerlin.value = cubeRenderTarget1.texture; 
    materialSun.uniforms.time.value = time;
    materialPerlin.uniforms.time.value = time;
 
    // Update objects
    spaceBoxMesh.rotation.x += 0.00015;
    spaceBoxMesh.rotation.y += 0.00015;
    orbitMeshMercury.rotation.y += 0.01;
    orbitMeshVenus.rotation.y += 0.01;
    orbitMeshEarth.rotation.y += 0.009;
    orbitMeshMars.rotation.y += 0.006;
    orbitMeshJupiter.rotation.y += 0.004;
    orbitMeshSaturn.rotation.y += 0.003;
    orbitMeshUrano.rotation.y += 0.0009;
    orbitMeshNeptune.rotation.y += 0.0007;
    earthPlanet.rotation.y += 0.004;
    time = time + 0.05;

    asteroidBeltOne.rotateZ(-0.0009);
    asteroidBeltTwo.rotateZ(-0.0009);
       
    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(animate);     
}

animate();