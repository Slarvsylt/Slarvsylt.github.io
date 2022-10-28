//import * as THREE from 'three';
import * as THREE from '../node_modules/three/build/three.module.js';

import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { CubeTextureLoader } from '../node_modules/three/src/loaders/CubeTextureLoader.js';

import { GUI } from '../node_modules/three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';

let camera, scene, renderer, stats;
let cube, sphere, torus, material;

let cubeCamera, cubeRenderTarget;

let controls;

init();

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResized );

    stats = new Stats();
    document.body.appendChild( stats.dom );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 75;

    scene = new THREE.Scene();
    scene.rotation.y = 0.5; // avoid flying objects occluding the sun

    /*new CubeTextureLoader()
        .setPath( '../pics/cube/' )
        .load( [
            'px.jpg',
            'nx.jpg',
            'py.jpg',
            'ny.jpg',
            'pz.jpg',
            'nz.jpg'
        ], function ( texture ) {

            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.background = texture;
            scene.environment = texture;

        } );    **/

    //
    scene.background = new THREE.Color(0xff0000);

    controls = new OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;

}

function onWindowResized() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}