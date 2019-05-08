var container;
var camera;
var scene;
var scene2;
var water;
var renderer;
var controls;
var container;
var grid;
var floor;
var clock;
var stats;
var raycaster;
var spotlight;
var hlight,alight,plight1,plight2,plight3;
var fog;

var SETTINGS_ENVIRONMENT = {
	fog_near: 1,
	fog_far: 200,
};

function setup_environment_clouds(){


	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 1000 );

    container = document.getElementById( 'canvas' );
	renderer = new THREE.WebGLRenderer( {canvas: container, antialias: true, alpha:true } );
	renderer.autoClear = false;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000, 0 ); // the default
	

}

function create_clouds(){

    geometry = new THREE.Geometry();

    var texture = THREE.ImageUtils.loadTexture( '../cloud.png' );
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

    material = new THREE.ShaderMaterial( {

        uniforms: {

            "map": { type: "t", value: texture },
            "fogColor" : { type: "c", value: fog.color },
            "fogNear" : { type: "f", value: fog.near },
            "fogFar" : { type: "f", value: fog.far },

        },
        vertexShader: document.getElementById( 'vs' ).textContent,
        fragmentShader: document.getElementById( 'fs' ).textContent,
        depthWrite: false,
        depthTest: false,
        transparent: true

    } );

    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

    for ( var i = 0; i < 8000; i++ ) {

        plane.position.x = Math.random() * 1000 - 500;
        plane.position.y = - Math.random() * Math.random() * 200 - 15;
        plane.position.z = i;
        plane.rotation.z = Math.random() * Math.PI;
        plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
        THREE.GeometryUtils.merge( geometry, plane );

    }
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    load_counter();

}

function init(){
    scene = new THREE.Scene();

    
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set( - 15, 7, 15 );
    camera.lookAt( scene.position );
    
    var waterGeometry = new THREE.PlaneBufferGeometry( 100, 100 );
	water = new THREE.Water( waterGeometry, {
		color: 0xb5e9f4,
		scale: 1,
		flowDirection: new THREE.Vector2( 1, 0 ),
		textureWidth: 512,
		textureHeight: 512
	} );
	water.position.y = 1;
	water.rotation.x = Math.PI * - 0.5;
    scene.add( water );    	

}