const COLOR_MAX = 360;
const COLOR_BG = COLOR_MAX / 2;
const HIVE_RADIUS = 100;
const DRONE_RADIUS = 10;
const SOURCE_RADIUS = 50;

let MAX_DIST;
let WORKSPACE;
let GAME_BOARD;

init();
animate();

 function init(){
   GAME_BOARD = new board();
 }

 function animate() {
 	requestAnimationFrame( animate );

 	GAME_BOARD.render();
 	GAME_BOARD.data.stats.update();
 }
