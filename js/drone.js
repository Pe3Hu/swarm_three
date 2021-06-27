class hive {
  constructor( index, vel, radius, board ) {
    this.const = {
      index: index,
      max: {
        speed: board.const.max.speed,
        force: board.const.max.force,
      },
      radius: {
        body: radius
      }
    };
    this.var = {
      vel: vel,
      acc: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      type: 'hive'
    };
    //console.log( this.var.vel )
    this.array = {
      position: {
        'hive': board.data.geometry.hives.attributes.position.array,
        'drone': board.data.geometry.drones.attributes.position.array,
        'source': board.data.geometry.sources.attributes.position.array
      }
    };
    this.data = {
      board: board,
      cargo: new cargo( this.var.type )
    };
  }

  get_pos(){
    let x = this.array.position[this.var.type][this.const.index];
    let y = this.array.position[this.var.type][this.const.index + 1];
    let z = this.array.position[this.var.type][this.const.index + 2];
    return new THREE.Vector3( x, y, z );
  }

  set_pos( pos ){
    this.array.position[this.var.type][this.const.index] = pos.x;
    this.array.position[this.var.type][this.const.index + 1] = pos.y;
    this.array.position[this.var.type][this.const.index + 2] = pos.z;
  }

  add_pos( vec ){
    //
    this.var.pos = this.get_pos();
    this.var.pos.add( vec );
    this.set_pos( this.var.pos );
  }

  set_vel( vec ){
    /*if( this.var.repel.current == 0 ){
      this.var.vel = vec;
      this.var.repel.current = this.var.repel.max;
    }*/
    this.var.vel = vec;
  }

  update() {
    /*this.var.vel.add( this.var.acc );
    this.var.vel.normalize();
    this.var.vel.muldtiplyScalar( this.const.max_speed );*/

    this.add_pos( this.var.vel );
    this.var.acc = new THREE.Vector3();
    if( this.var.type == 'drone' ){
      let flag = this.collision_check();

      if( flag ){
        let vel = this.var.vel;
        vel.multiplyScalar( -1 );
        this.set_vel( vel );
        this.add_pos( this.var.vel );
        this.colorize( this.var.last_repel )
      }
    }

    this.edges();
  }

  edges() {
    /*
    if ( this.var.pos.x > WORKSPACE.x + this.const.radius.body )
      this.var.pos.x = -this.const.radius.body;
    else if ( this.var.pos.x < -this.const.radius.body )
      this.var.pos.x = WORKSPACE.x + this.const.radius.body;

    if ( this.var.pos.y > WORKSPACE.y + this.const.radius.body )
      this.var.pos.y = -this.const.radius.body;
    else if ( this.var.pos.y < -this.const.radius.body )
      this.var.pos.y = WORKSPACE.y + this.const.radius.body;
      */
    if ( this.var.pos.x > WORKSPACE.x - this.const.radius.body )
      this.var.vel.x *= -1;
    else if ( this.var.pos.x < -WORKSPACE.x + this.const.radius.body )
      this.var.vel.x *= -1;

    if ( this.var.pos.y > WORKSPACE.y - this.const.radius.body )
      this.var.vel.y *= -1;
    else if ( this.var.pos.y < -WORKSPACE.y + this.const.radius.body )
      this.var.vel.y *= -1;

    if ( this.var.pos.z > WORKSPACE.z - this.const.radius.body )
      this.var.vel.z *= -1;
    else if ( this.var.pos.z < -WORKSPACE.z + this.const.radius.body )
      this.var.vel.z *= -1;
  }

}

class source extends hive {
  constructor( index, vel, radius, board ) {
    super( index, vel, radius, board );
    this.const = {
      index: index,
      max: {
        speed: board.const.max.speed,
        force: board.const.max.force,
      },
      radius: {
        body: radius
      },
     type: Math.random() * 3
    };
    this.var = {
      vel: vel,
      acc: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      type: 'source'
    };
    //console.log( this.var.vel )
    this.array = {
      position: {
        'hive': board.data.geometry.hives.attributes.position.array,
        'drone': board.data.geometry.drones.attributes.position.array,
        'source': board.data.geometry.sources.attributes.position.array
      }
    };
    this.data = {
      board: board,
      cargo: new cargo( this.var.type )
    };
  }
}

class drone extends hive {
  constructor( index, vel, radius, board ) {
    super( index, vel, radius, board );
    this.const = {
      index: index,
      max: {
        speed: board.const.max.speed * 3,
        force: board.const.max.force
      },
      radius: {
        body: radius,
        scream: radius * 10
      },
     type: Math.random() * 3
    };
    this.var = {
      vel: vel,
      acc: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      type: 'drone',
      last_repel: {
        target: null,
        index: null
      }
    };
    //console.log( this.var.vel )
    this.array = {
      position: {
        'hive': board.data.geometry.hives.attributes.position.array,
        'drone': board.data.geometry.drones.attributes.position.array,
        'source': board.data.geometry.sources.attributes.position.array
      },
      echo: []
    };
    this.data = {
      board: board,
      cargo: new cargo( this.var.type ),
      to_do: new to_do( this )
    };
  }

  evade( target ) {
    let pursuit = this.pursue( target );
    pursuit.multiplyScalar( -1 );
    return pursuit;
  }

  pursue( target ) {
    let target_vec = target.get_pos();
    let prediction = target.vel.copy();
    prediction.multiplyScalar( target.prediction );
    target_vec.add( prediction );
    return this.seek( target_vec );
  }

  flee(target) {
    return this.seek( target ).multiplyScalar( -1 );
  }

  seek( target_vec) {
    let pos = this.get_pos();
    let forse = target_vec.copy();
    forse.sub( pos )
    force.normalize();
    force.multiplyScalar( this.const.max_speed );
    force.sub( this.var.vel );
    force.normalize();
    force.multiplyScalar( this.const.max_force );
    this.apply_force( force );
    //return force;
  }

  apply_force( force ) {
    this.var.acc.add( force );
  }

  take( source ){
    let storage = this.data.storage;

    for( let food in storage.array.food_type ){
        let value = Math.min(
          storage.const.max.cargo - storage.var.current.cargo,
          source.data.storage.var.current[food] );
        source.data.storage.var.current[food] -= value;
        storage.var.current[food] += value;
        storage.var.current.cargo += value;
    }
  }

  give( hive ){
    let storage = this.data.storage;

    for( let food in storage.array.food_type ){
      let value = Math.min(
        this.const.max.cargo - storage.var.current.cargo,
        source.data.storage.var.current[food] );
      source.data.storage.var.current[food] -= value;
      storage.var.current[food] += value;
      storage.var.current.cargo += value;
    }
  }

  check_last_repel( target, index ){
    return this.var.last_repel.target == target && this.var.last_repel.index == index;
  }

  collision_check(){
    let target = 'hive';
    let flag = false;

    for ( let i = 0; i < this.array.position[target].length; i += 3 )
      if( !this.check_last_repel( target, i ) ){
        let target_vec = new THREE.Vector3(
          this.array.position[target][i],
          this.array.position[target][i + 1],
          this.array.position[target][i + 2]
          );
        //target_vec.sub( this.var.vel );

        let d = this.var.pos.distanceTo( target_vec );
        if( d < DRONE_RADIUS + HIVE_RADIUS ){
          this.var.last_repel = {
            target: target,
            index: i
          }
          flag = true;
          break;
        }
      }

    target = 'source';

    for ( let i = 0; i < this.array.position[target].length; i += 3 )
      if( !this.check_last_repel( target, i ) ){
        let target_vec = new THREE.Vector3(
          this.array.position[target][i],
          this.array.position[target][i + 1],
          this.array.position[target][i + 2]
          );
        //target_vec.sub( this.var.vel );

        let d = this.var.pos.distanceTo( target_vec );
        if( d < DRONE_RADIUS + SOURCE_RADIUS ){
          this.var.last_repel = {
            target: target,
            index: i
          }
          flag = true;
          break;
        }
      }

    return flag;
  }

  colorize( parent ){
    let hues = this.data.board.data.hues;
    let hue = hues[parent.target][parent.index / 3]
    let colors = this.data.board.data.geometry.drones.attributes.color.array;
    let color = new THREE.Color();
    color.setHSL( hue, 1.0, 0.5 );

    colors[this.const.index] = color.r;
    colors[this.const.index + 1] = color.g;
    colors[this.const.index + 2] = color.b;
  }

  scream(){
    //for( let )
  }
}
