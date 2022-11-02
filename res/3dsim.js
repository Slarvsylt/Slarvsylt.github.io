
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
        metalness: 0.85
    } );

    const gui = new GUI();
    gui.add( materialReflect, 'roughness', 0, 1 );
    gui.add( materialReflect, 'metalness', 0, 1 );
    gui.add( renderer, 'toneMappingExposure', 0, 2 ).name( 'exposure' );

    var material = new THREE.MeshPhongMaterial();
    material.color.setHSL(1, 1, .75);
    cube = new THREE.Mesh( new THREE.BoxGeometry( 15, 15, 15 ), material );
    scene.add( cube );

    torus = new THREE.Mesh( new THREE.SphereGeometry(5), materialReflect );
    scene.add( torus );


    cube2 = new THREE.Mesh( new THREE.BoxGeometry( 15, 900, 15 ), material );
    scene.add( cube2 );
    
    //
    //scene.background = new THREE.Color(0xff0000);
    document.body.appendChild( renderer.domElement );

   controls = new OrbitControls( camera, renderer.domElement );
   controls.autoRotate = true;

   const skyColor = 0xedf3ff;  // light blue
   const groundColor = 0xe6e6e6;  //  grey
   const intensity = 0.25;
   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
   scene.add(light);

   const color = 0xFFFFFF;
   const sunintensity = 0.75;
   const sunlight = new THREE.DirectionalLight(color, sunintensity);
   sunlight.position.set(-51, 5, 15);
   sunlight.target.position.set(-5, 0, 0);
   scene.add(sunlight);
   scene.add(sunlight.target);

}

function onWindowResized() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    //camera.aspect = window.innerWidth / window.innerHeight;
    //camera.updateProjectionMatrix();

}

function animation(msTime) {

    const time = msTime / 1000;

    cube.position.x = Math.cos( time ) * 30;
    cube.position.y = Math.sin( time ) * 30;
    cube.position.z = Math.sin( time ) * 30;

    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;

    torus.position.x = Math.cos( time + 10 ) * 30;
    torus.position.y = Math.sin( time + 10 ) * 30;
    torus.position.z = Math.sin( time + 10 ) * 30;

    torus.rotation.x += 0.02;
    torus.rotation.y += 0.03;

    renderer.render( scene, camera );
    controls.update();

}