class board{
  constructor (){
    this.const = {
      workspace_size: 500,
      count: {
        hive: 1,
        drone: 1000,
        source: 3
      },
      max: {
        speed: 1,
        force: 0.5
      }
    };
    this.array = {
      hive: [],
      drone: [],
      source: []
    };
    this.data = {
      renderer: null,
      scene: null,
      camera: null,
      stats: null,
      drone_system: null,
      hive_system: null,
      source_system: null,
      uniforms: null,
      geometry: {
        drones: null,
        hives: null,
        source: null,
        border_line: null
      },
      hues: {
        'hive': [],
        'source': []
      }
    };

    this.init();
  }

  init() {
    WORKSPACE = new THREE.Vector3(
      this.const.workspace_size,
      this.const.workspace_size,
      this.const.workspace_size
    );
    MAX_DIST = Math.sqrt( Math.pow( this.const.workspace_size * 2, 2 ) + Math.pow( this.const.workspace_size * 2, 2 ) );

    this.data.camera = new THREE.PerspectiveCamera( this.const.workspace_size, window.innerWidth / window.innerHeight, 1, 10000 );
    this.data.camera.position.x = 0;
    this.data.camera.position.y = 0;
    this.data.camera.position.z = -this.const.workspace_size * 0.4;
    this.data.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    this.data.scene = new THREE.Scene();

    let material = new THREE.LineBasicMaterial({
      color: 0xffffff
    });

    let points = [];
    let r = this.const.workspace_size;
    points.push( new THREE.Vector3( -r, -r, 0 ) );
    points.push( new THREE.Vector3( -r, r, 0 ) );
    points.push( new THREE.Vector3( r, r, 0 ) );
    points.push( new THREE.Vector3( r, -r, 0 ) );
    points.push( new THREE.Vector3( -r, -r, 0 ) );
    /*points.push( new THREE.Vector3( -r, -r, -r ) );
    points.push( new THREE.Vector3( -r, r, -r ) );
    points.push( new THREE.Vector3( r, r, -r ) );
    points.push( new THREE.Vector3( r, -r, -r ) );
    points.push( new THREE.Vector3( -r, -r, -r ) );
    points.push( new THREE.Vector3( -r, -r, r ) );
    points.push( new THREE.Vector3( -r, r, r ) );
    points.push( new THREE.Vector3( -r, r, -r ) );
    points.push( new THREE.Vector3( -r, r, r ) );
    points.push( new THREE.Vector3( r, r, r ) );
    points.push( new THREE.Vector3( r, -r, r ) );
    points.push( new THREE.Vector3( r, -r, -r ) );
    points.push( new THREE.Vector3( r, -r, r ) );
    points.push( new THREE.Vector3( -r, -r, r ) );
    points.push( new THREE.Vector3( r, -r, r ) );
    points.push( new THREE.Vector3( r, r, r ) );
    points.push( new THREE.Vector3( r, r, -r ) );*/

    this.data.geometry.borders_line = new THREE.BufferGeometry().setFromPoints( points );
    this.data.borders_line = new THREE.Line( this.data.geometry.borders_line, material );

    this.data.scene.add( this.data.borders_line );

    this.data.renderer = new THREE.WebGLRenderer();
    this.data.renderer.setPixelRatio( window.devicePixelRatio );
    this.data.renderer.setSize( window.innerWidth, window.innerHeight );

    let container = document.getElementById( 'container' );
    container.appendChild( this.data.renderer.domElement );

    this.data.stats = new Stats();
    container.appendChild( this.data.stats.dom );

    window.addEventListener( 'resize', this.onWindowResize() );

    this.data.clock = new THREE.Clock( true );
    this.init_geometrys();
    this.init_objects();
  }

  init_geometrys(){
    this.data.uniforms = {
      pointTexture: { value: new THREE.TextureLoader().load( "textures/sprites/spark1.png" ) }
    };

    let shaderMaterial = new THREE.ShaderMaterial( {

    uniforms: this.data.uniforms,
      vertexShader: document.getElementById( 'vertexshader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    } );

    this.data.geometry.hives = new THREE.BufferGeometry();

    let positions = [];
    let colors = [];
    let sizes = [];

    let color = new THREE.Color();

    for ( let i = 0; i < this.const.count.hive; i ++ ) {
      let x = ( Math.random() * 2 - 1 ) * 0.25;
      x += 0.5 * Math.sign( x );
      x *= this.const.workspace_size;
      let y = ( Math.random() * 2 - 1 ) * 0.25;
      y += 0.5 * Math.sign( y );
      y *= this.const.workspace_size;
      let z = 0;//( Math.random() * 2 - 1 ) * this.const.workspace_size * 0.5;
      positions.push( x );
      positions.push( y );
      positions.push( z );

      let hue = i / COLOR_MAX
      color.setHSL(hue, 1.0, 0.5 );
      this.data.hues.hive.push( hue );

      colors.push( color.r, color.g, color.b );

      sizes.push( HIVE_RADIUS );
    }

    this.data.geometry.hives.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    this.data.geometry.hives.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    this.data.geometry.hives.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

    this.data.hive_system = new THREE.Points( this.data.geometry.hives, shaderMaterial );

    this.data.scene.add( this.data.hive_system );

    this.data.geometry.drones = new THREE.BufferGeometry();

    positions = [];
    colors = [];
    sizes = [];

    color = new THREE.Color();

    for ( let i = 0; i < this.const.count.drone; i ++ ) {
      let x = ( Math.random() * 2 - 1 ) * this.const.workspace_size * 0.5;
      let y = ( Math.random() * 2 - 1 ) * this.const.workspace_size * 0.5;
      let z = 0;//( Math.random() * 2 - 1 ) * this.const.workspace_size * 0.5;
      positions.push( x );
      positions.push( y );
      positions.push( z );

      colors.push( COLOR_MAX );

      sizes.push( DRONE_RADIUS );
    }

    this.data.geometry.drones.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    this.data.geometry.drones.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    this.data.geometry.drones.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

    this.data.drone_system = new THREE.Points( this.data.geometry.drones, shaderMaterial );

    this.data.scene.add( this.data.drone_system );

    this.data.geometry.sources = new THREE.BufferGeometry();

    positions = [];
    colors = [];
    sizes = [];

    color = new THREE.Color();

    for ( let i = 0; i < this.const.count.source; i ++ ) {
      let x = ( Math.random() * 2 - 1 ) * 0.25;
      x += 0.5 * Math.sign( x );
      x *= this.const.workspace_size;
      let y = ( Math.random() * 2 - 1 ) * 0.25;
      y += 0.5 * Math.sign( y );
      y *= this.const.workspace_size;
      let z = 0;//( ( Math.random() * 2 - 1 ) * 0.25 + 0.5 ) * this.const.workspace_size;
      positions.push( x );
      positions.push( y );
      positions.push( z );

      let hue = ( 60 + i * 80 ) / COLOR_MAX;
      color.setHSL(hue, 1.0, 0.5 );
      this.data.hues.source.push( hue );

      colors.push( color.r, color.g, color.b );

      sizes.push( SOURCE_RADIUS );
    }

    this.data.geometry.sources.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    this.data.geometry.sources.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    this.data.geometry.sources.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

    this.data.source_system = new THREE.Points( this.data.geometry.sources, shaderMaterial );

    this.data.scene.add( this.data.source_system );
  }

  init_objects(){
    for ( let i = 0; i < this.data.geometry.hives.attributes.position.array.length; i += 3 ){
      let vel = new THREE.Vector3(
         Math.random() * 2 - 1,
         Math.random() * 2 - 1,
         0//Math.random() * 2 - 1
        );
      this.array.hive.push(
        new hive(
          i,
          vel,
          HIVE_RADIUS,
          this
        )
      );
    }


    for ( let i = 0; i < this.data.geometry.drones.attributes.position.array.length; i += 3 ){
      let vel = new THREE.Vector3(
         Math.random() * 2 - 1,
         Math.random() * 2 - 1,
         0//Math.random() * 2 - 1
        );
      this.array.drone.push(
        new drone(
          i,
          vel,
          DRONE_RADIUS,
          this
        )
      );
    }
    //console.log( this.data.geometry.hives.attributes.position.array )

    for ( let i = 0; i < this.data.geometry.sources.attributes.position.array.length; i += 3 ){
      let vel = new THREE.Vector3(
         Math.random() * 2 - 1,
         Math.random() * 2 - 1,
         0//Math.random() * 2 - 1
        );
      this.array.source.push(
        new source(
          i,
          vel,
          SOURCE_RADIUS,
          this
        )
      );
    }
  }

  onWindowResize() {
    this.data.camera.aspect = window.innerWidth / window.innerHeight;
    this.data.camera.updateProjectionMatrix();

    this.data.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  render() {
    //this.data.geometry.drones.attributes.size.needsUpdate = true;
    this.data.geometry.hives.attributes.position.needsUpdate = true;
    this.data.geometry.drones.attributes.position.needsUpdate = true;
    this.data.geometry.drones.attributes.color.needsUpdate = true;
    this.data.geometry.sources.attributes.position.needsUpdate = true;

    this.data.renderer.render( this.data.scene, this.data.camera );
    for( let hive of this.array.hive )
      hive.update();

    for( let source of this.array.source )
      source.update();

    for( let drone of this.array.drone )
      drone.update();

    if( Math.round( this.data.clock.getElapsedTime().toFixed(2) * 100 ) % 100 == 0 ){

      for( let i = 0; i < this.array.drone.length; i++ )
        this.array.drone[i].scream( i + 1, this.array.drone );
      for( let i = 0; i < this.array.drone.length; i++ )
        this.array.drone[i].listen();
    }

  }
}
