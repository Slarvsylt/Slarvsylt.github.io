var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("myScene").appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
//cube.position.x = 100;
//cube.translateX = 100;
//three.cube.position.x = 100;
scene.add( cube );

camera.position.z = 10;    
camera.position.x = 10;

var geometry_2 = new THREE.BoxGeometry( 2, 2, 2 );
var material_2 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var cube_2 = new THREE.Mesh( geometry_2, material_2 );
scene.add( cube_2 );


function animate() {
requestAnimationFrame( animate );
cube.rotation.y += 0.01;
cube_2.position.x += 0.05;
renderer.render( scene, camera );
}
animate();