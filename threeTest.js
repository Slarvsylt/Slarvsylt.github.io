var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
camera.position.set(5,5,0);
camera.lookAt(new THREE.Vector3(0,0,0));
renderer.setSize(window.innerWidth/2,window.innerHeight/2);
renderer.setClearColor(0xfff6e6);
document.body.appendChild(renderer.domElement);

var plane = new THREE.Mesh(
  new THREE.PlaneGeometry( 5, 5, 5, 5 ),
  new THREE.MeshBasicMaterial( { color: 0x393839, wireframe: true } )
);
plane.rotateX(Math.PI/2);
scene.add( plane );

renderer.render(scene, camera);

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', function() { renderer.render(scene, camera); } );
