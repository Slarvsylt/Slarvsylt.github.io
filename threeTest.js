var scene, camera, renderer;
var material, rocks;
var angle = 0;

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 80, window.innerWidth/window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}

function loadRockTexture() {
  var textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = true;
  textureLoader.load('jeppeFace.jpg', function(texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 2, 2 );
    material = new THREE.MeshLambertMaterial( {map: texture} );  
    createRocks();
  });
}

function createRocks() {
  rocks = [];
  for (var i = 0; i < 100; i++) {
    var r = new Rock();
    rocks.push(r);
  }
}

function initLights() {
  var light = new THREE.PointLight( 0xFFFFFF );
  light.position.set( 300, 300, 0 );
  scene.add( light );

  var light = new THREE.PointLight( 0xFFFFFF );
  light.position.set( 0, 300, 300 );
  scene.add( light );
}

function Rock() {
  // init
  var size = 10+Math.random()*10;
  var geometry = new THREE.IcosahedronGeometry(size, 0);
  var icosahedron = new THREE.Mesh( geometry, material );
  
  for (var i = 0, l = geometry.vertices.length; i<l; i++) {
    geometry.vertices[i].x += size*-0.25 + Math.random()*size*0.5;
    geometry.vertices[i].y += size*-0.25 + Math.random()*size*0.5;
  }
  
  // rotate cube
  var variance = 0.01;
  this.vr = {
    x: -variance + Math.random()*variance*2,
    y: -variance + Math.random()*variance*2
  }
  var field = 300;
  scene.add( icosahedron );
  icosahedron.position.x = -field+Math.random()*field*2;
  icosahedron.position.y = -field+Math.random()*field*2;
  icosahedron.position.z = -field+Math.random()*field*2;
  
  this.mesh = icosahedron;
}

Rock.prototype.rotate = function() {
  this.mesh.rotation.x += this.vr.x;
  this.mesh.rotation.y += this.vr.y;
}

function render() {
  requestAnimationFrame( render );

  renderer.render(scene, camera);
  for (var i = 0; i < 100; i++) {
    rocks[i].rotate();
  }
  
  updateCamPosition();
}

function updateCamPosition() {
  angle += 0.005;
  var z = 100 * Math.cos(angle);
  var y = 100 * Math.sin(angle);

  camera.position.z = z;
  camera.position.y = y;
  camera.rotation.x = z*0.02;
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


window.addEventListener("resize", resize);

initScene();
initLights();
loadRockTexture();
render();