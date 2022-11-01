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

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 75;

    scene = new THREE.Scene();
    scene.rotation.y = 0.5; // avoid flying objects occluding the sun

    scene.background = new CubeTextureLoader()
        .setPath( '../pics/cube/' )
        .load([
            'px.jpg',
            'nx.jpg',
            'py.jpg',
            'ny.jpg',
            'pz.jpg',
            'nz.jpg'
        ]);  


    var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
    cube = new THREE.Mesh( new THREE.BoxGeometry( 15, 15, 15 ), material );
    scene.add( cube );

    torus = new THREE.Mesh( new THREE.SphereGeometry(15), material );
    scene.add( torus );
    //
    //scene.background = new THREE.Color(0xff0000);
    document.body.appendChild( renderer.domElement );

   controls = new OrbitControls( camera, renderer.domElement );
   controls.autoRotate = true;

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