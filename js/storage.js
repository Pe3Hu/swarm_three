//
class storage {
  constructor( parent ){
    this.const = {
      max: {
        cargo: null
      },
      parent: parent
    };
    this.var = {
      current: {
        cargo: 0
      }
    };
    this.array = {
      food_type: [ '0', '1', '2' ]
    };

    this.init();
  }

  init(){
    for( let food in this.array.food_type )
      this.var.current[food] = 0;

    switch ( this.const.parent ) {
      case 'hive':
        this.const.max.cargo = 10000;
        break;
      case 'drone':
        this.const.max.cargo = 3;
        break;
      case 'source':
        this.const.max.cargo = 1000;
        this.var.current.cargo = 1000;
        this.var.current[parent.const.type.toString()] = this.const.max.cargo;
        break;
    }
  }
}
