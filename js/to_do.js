
class to_do {
  constructor( drone ) {
    this.array = {
      task: [ 'take', 'give' ],
      to_whom: [ 'source', 'queen' ]
    };
    this.var = {
      task: 0
    }
    this.data = {
      drone: drone,
      which_one: {
        'source': [ -1, 0, 1, 2 ],
        'queen': [ -1, 0, 1 ]
      },
      destination: {
          'to_whom': null,
          'which_one': null
      }
    };

    this.init();
  }

  init(){
    this.data.distance_to = {};

    /*for( to_whom in this.data.to_whoms )
      this.data.distance_to[to_whom] = {};

    for( to_whom in this.array.to_whom )
      for( which_one in this.data.which_one[to_whom] )
        this.data.distance_to[to_whom][which_ones] = MAX_DIST;*/

    /*this.data.hit_flag = {};
    for( to_whom in this.array.to_whom ):
    this.data.hit_flag[to_whom] = {}
    for to_whom in this.data.to_whoms:
    for which_ones in this.data.which_ones[to_whom]:
    this.data.hit_flag[to_whom][which_ones] = False*/

  }

  get_task(){
    this.data.destination['to_whom'] = this.data.to_whoms[this.var.curent.task];
    this.data.destination['which_one'] = this.data.which_one[this.data.destination['to_whom']][this.var.curent.task];
  }

  next_step(){
    for( to_whom in this.data.distance_to )
      for( which_one in this.data.distance_to[to_whom] ){
        which_one += 1
        this.check_distance_to();
      }

    /*hit = False

    for to_whom in this.data.hit_flag.keys:
    for which_ones in this.data.hit_flag[to_whom]:
    if this.data.hit_flag[to_whom][which_ones] == True:
    this.data.hit_flag[to_whom][which_ones] = this.data.drone.velocity
    hit = True

    if hit == True:
    this.data.drone.direction = -this.data.drone.direction*/
  }

  check_distance_to(){

  }
}
