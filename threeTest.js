var colors = [0x05A8AA, 0xB8D5B8, 0xD7B49E, 0xDC602E,
			 0xBC412B, 0xF19C79, 0xCBDFBD, 0xF6F4D2,
			  0xD4E09B, 0xFFA8A9, 0xF786AA, 0xA14A76, 
			  0xBC412B, 0x63A375, 0xD57A66, 0x731A33,
			   0xCBD2DC, 0xDBD48E, 0x5E5E5E];

var scene, camera, renderer, geometry, mesh;

var verticePositions = [];

function initScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(30,window.innerWidth/window.innerHeight, 0.1, 1000);
	renderer = new THREE.WebGLRenderer({alpha: true});
	camera.position.z = 100;
}

function initLightning() {

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 0, 1, 0 );
	scene.add( light );
  
	var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set( 0, -1, 0 );
	scene.add( light );
  
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 1, 0, 0 );
	scene.add( light );
  
	var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set( 0, 0, 1 );
	scene.add( light );
  
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 0, 0, -1 );
	scene.add( light );
  
	var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set( -1, 0, 0 );
	scene.add( light );
}

function initGeometry() {
	geometry = new THREE.IcosahedronGeometry(20);
	for(var i = 0; i < geometry.faces.length; i++) {
		var face = geometry.faces[i];
		face.color.setHex(colors[i]);
	}

	mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } ));
	scene.add( mesh );
}

function render() {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
};
  
function resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

initScene();
initLighting();
initGeometry();
render();

window.addEventListener("resize", resize);