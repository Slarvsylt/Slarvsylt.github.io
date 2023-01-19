
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import { CubeTextureLoader } from 'https://unpkg.com/three/src/loaders/CubeTextureLoader.js';
import { GUI } from 'https://unpkg.com/three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'https://unpkg.com/three/examples/jsm/libs/stats.module.js';

let camera, scene, renderer, stats;
let cube, cube2, sphere, torus, materialReflect;
let cubeRenderTarget, cubeCamera

let controls;

init();
//animate();

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setAnimationLoop( animation );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;

    window.addEventListener( 'resize', onWindowResized );

    stats = new Stats();
    document.body.appendChild( stats.dom );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = 75;

    scene = new THREE.Scene();
    scene.rotation.y = 0.5; // avoid flying objects occluding the sun

    var texture = new CubeTextureLoader()
        .setPath( '../pics/cube/' )
        .load([
            'px.jpg',
            'nx.jpg',
            'py.jpg',
            'ny.jpg',
            'pz.jpg',
            'nz.jpg'
        ]);  
        scene.background = texture;
       // scene.environment = texture;
      // scene.envMap = texture;

    {
        const color = 0x96a6b5;
        const density = 0.002;
        scene.fog = new THREE.FogExp2(color, density);
    }

    cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 );
    cubeRenderTarget.texture.type = THREE.HalfFloatType;
    cubeRenderTarget.texture = texture;

    cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );

    materialReflect = new THREE.MeshStandardMaterial( {
        envMap: cubeRenderTarget.texture,
        roughness: 0.05,
        metalness: 0.85,
        color: new THREE.Color( 0x647790 )

    } );

    const gui = new GUI();
    gui.add( materialReflect, 'roughness', 0, 1 );
    gui.add( materialReflect, 'metalness', 0, 1 );
    gui.addColor( materialReflect, 'color')
    gui.add( renderer, 'toneMappingExposure', 0, 2 ).name( 'exposure' );
    
    //
    //scene.background = new THREE.Color(0xff0000);
    document.body.appendChild( renderer.domElement );

   controls = new OrbitControls( camera, renderer.domElement );
   controls.autoRotate = false;

   const skyColor = 0xedf3ff;  // light blue
   const groundColor = 0xe6e6e6;  //  grey
   const intensity = 0.25;
   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
   scene.add(light);

   const color = 0xFFFFAA;
   const sunintensity = 1.0;
   const sunlight = new THREE.DirectionalLight(color, sunintensity);
   sunlight.position.set(-91, 35, 25);
   sunlight.target.position.set(0, 0, 0);
   sunlight.castShadow = true;
   sunlight.shadow.camera.near = 0.1;
   sunlight.shadow.camera.far = 1000;
   sunlight.shadow.camera.right = 97;
   sunlight.shadow.camera.left = - 97;
   sunlight.shadow.camera.top	= 97;
   sunlight.shadow.camera.bottom = - 97;
   sunlight.shadow.mapSize.width = 512;
   sunlight.shadow.mapSize.height = 512;
   sunlight.shadow.radius = 2;
   sunlight.shadow.bias = - 0.0005;
   scene.add(sunlight);
   scene.add(sunlight.target);

   const ball = new THREE.Mesh( new THREE.SphereGeometry(5), materialReflect );
   ball.castShadow = true;
   ball.receiveShadow = true;
   ball.position.set(0,0,0);
   scene.add( ball );

   const planeGeometry = new THREE.PlaneGeometry( 200, 200 );
   const planeMaterial = new THREE.MeshPhongMaterial( {
       color: 0xff9999,
       shininess: 0,
       specular: 0x111111
   } );

   {
        const ground = new THREE.Mesh( new THREE.BoxGeometry( 100,1, 100), material);
       // ground.rotation.x = - Math.PI / 2;
        ground.position.y = -50;
        ground.scale.multiplyScalar( 3 );
        ground.castShadow = true;
        ground.receiveShadow = true;
        scene.add( ground );
   }
   effect = new THREE.AsciiEffect(renderer);
   effect.setSize(width, height);
   container.appendChild(effect.domElement);
}

function onWindowResized() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    //camera.aspect = window.innerWidth / window.innerHeight;
    //camera.updateProjectionMatrix();

}

function animation(msTime) {

    const time = msTime / 1000;

    renderer.render( scene, camera );
    controls.update();

}