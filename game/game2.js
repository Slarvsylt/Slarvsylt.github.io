var scene, camera, clock, renderer, water;
var torusKnot;
var params = {
	color: '#ffffff',
	scale: 4,
	flowX: 1,
	flowY: 1
};

init();
animate();

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, 0.1, 1000);

    camera.position.set( - 15, 7, 15 );
    camera.lookAt( scene.position );

    clock = new THREE.Clock();

    var torusKnotGeometry = new THREE.TorusKnotBufferGeometry( 3, 1, 256, 32 );
    var torusKnotMaterial = new THREE.MeshNormalMaterial();
    torusKnot = new THREE.Mesh( torusKnotGeometry, torusKnotMaterial );
    torusKnot.position.y = 4;
    torusKnot.scale.set( 0.5, 0.5, 0.5 );
    scene.add( torusKnot );


    var groundGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
	var groundMaterial = new THREE.MeshStandardMaterial( { roughness: 0.8, metalness: 0.4 } );
	var ground = new THREE.Mesh( groundGeometry, groundMaterial );
	ground.rotation.x = Math.PI * - 0.5;
    scene.add( ground );
    
	var textureLoader = new THREE.TextureLoader();
	textureLoader.load( "F:\Users\jespe_000\Documents\GitHub\Slarvsylt.github.io\pics\yokoFace.jpg", function ( map ) {
		map.wrapS = THREE.RepeatWrapping;
		map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 16;
		map.repeat.set( 4, 4 );
		groundMaterial.map = map;
		groundMaterial.needsUpdate = true;
    } );
    
    var waterGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
	water = new THREE.Water( waterGeometry, {
		color: params.color,
		scale: params.scale,
		flowDirection: new THREE.Vector2( params.flowX, params.flowY ),
		textureWidth: 1024,
		textureHeight: 1024
    } );
            
	water.position.y = 1;
	water.rotation.x = Math.PI * - 0.5;
    scene.add( water );
    
    var cubeTextureLoader = new THREE.CubeTextureLoader();

    cubeTextureLoader.setPath( "F:\Users\jespe_000\Documents\GitHub\Slarvsylt.github.io\pics\cube" );
    var cubeTexture = cubeTextureLoader.load( [
        'px.jpg', 'nx.jpg',
        'py.jpg', 'ny.jpg',
        'pz.jpg', 'nz.jpg',
    ] );

    var cubeShader = THREE.ShaderLib[ 'cube' ];
    cubeShader.uniforms[ 'tCube' ].value = cubeTexture;

    var skyBoxMaterial = new THREE.ShaderMaterial( {
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        side: THREE.BackSide
    } );

    var skyBox = new THREE.Mesh( new THREE.BoxBufferGeometry( 1000, 1000, 1000 ), skyBoxMaterial );
    scene.add( skyBox );

    
	var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );
    
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
	directionalLight.position.set( - 1, 1, 1 );
	scene.add( directionalLight );
		
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );
    
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    var delta = clock.getDelta();
    torusKnot.rotation.x += delta;
    torusKnot.rotation.y += delta * 0.5;
    renderer.render( scene, camera );
}
