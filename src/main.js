let renderer, scene, camera, stats;

let particleSystem, uniforms, geometry;

let borders, borders_geometry;
let particle_vels;

const radius = 100;
const particles = 2000;
const particle_size = 10;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( radius , window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = radius * 2.5;

	scene = new THREE.Scene();

	uniforms = {

		pointTexture: { value: new THREE.TextureLoader().load( "textures/sprites/spark1.png" ) }

	};

	const shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true,
		vertexColors: true

	} );

	geometry = new THREE.BufferGeometry();

	const positions = [];
	const colors = [];
	const sizes = [];

	const color = new THREE.Color();

	for ( let i = 0; i < particles; i ++ ) {

		positions.push( ( Math.random() * 2 - 1 ) * radius );
		positions.push( ( Math.random() * 2 - 1 ) * radius );
		positions.push( ( Math.random() * 2 - 1 ) * radius );

		color.setHSL( i / particles, 1.0, 0.5 );

		colors.push( color.r, color.g, color.b );

		sizes.push( particle_size );

	}

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

	particleSystem = new THREE.Points( geometry, shaderMaterial );

	scene.add( particleSystem );

	const material = new THREE.LineBasicMaterial({
		color: 0xffffff
	});

	let points = [];
	let r = radius * 1.75;
	points.push( new THREE.Vector3( -r, -r, 0 ) );
	points.push( new THREE.Vector3( -r, r, 0 ) );
	points.push( new THREE.Vector3( r, r, 0 ) );
	points.push( new THREE.Vector3( r, -r, 0 ) );
	points.push( new THREE.Vector3( -r, -r, 0 ) );

	borders_geometry = new THREE.BufferGeometry().setFromPoints( points );
	borders = new THREE.Line( borders_geometry, material );

	scene.add( borders );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	const container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );

	//

	window.addEventListener( 'resize', onWindowResize );

	init_drones();

}

function init_drones(){
	particle_vels = [];

	for ( let i = 0; i < particles; i ++ )
		particle_vels
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	/*const time = Date.now() * 0.005;

	particleSystem.rotation.z = 0.01 * time;

	const sizes = geometry.attributes.size.array;

	for ( let i = 0; i < particles; i ++ ) {

		sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );

	}*/

	geometry.attributes.size.needsUpdate = true;

	renderer.render( scene, camera );

}
