import { worldMapClass } from "./main.js";
import * as THREE from 'three';
import { TWEEN } from './libs/tween.module.min.js';



export class Player {
  geometryPlayer = new THREE.BoxGeometry( 4, 4, 5 );
  materialPlayer = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  player = new THREE.Mesh;
  playerRuninig = false;
  playerCanRun = false;
  playerTouch = false;
  playerTween = new TWEEN.Tween;

  playerInBattle = false;
  playerInBattleId = 0;
  playerHealth = 120;
  playerPower = 0;
  maxplayerPower = 30;
  playerCanPunch = false;

  
  
  intersects;
  path = [];
  ii = 1;

  addPlayer (scene){
    this.player = new THREE.Mesh( this.geometryPlayer, this.materialPlayer );
    for (let i = 0; i < worldMapClass.worldSettings.sizeX; i++) {
      for (let j = 0; j < worldMapClass.worldSettings.sizeY; j++) {
        if (worldMapClass.worldMap[i][j].player) {
          this.player.position.set(worldMapClass.worldSettings.sizeOneBlock*j+worldMapClass.worldSettings.sizeOneBlock/2 ,-worldMapClass.worldSettings.sizeOneBlock*i-worldMapClass.worldSettings.sizeOneBlock/2,0);

        }
      }
    }
    scene.add( this.player );
  }

  setPlayerRun(intersects) {
    if (this.path.length < 2) {
      this.path = [];
      this.playerTouch = true;
      this.intersects = intersects;
    }
    else  {
      this.path = [];
      setTimeout(()=>{
        this.playerTouch = true;
        this.intersects = intersects;
      }, 100)
    }

  }

  setPlayerInBattle(enemy) {
    if (this.playerInBattle == false) {
      this.playerInBattle = true;
      this.playerInBattleId = enemy.id;
    }
  }

  movePlayer(TWEEN, enemyClass) {

    $('.player_health').text(this.playerHealth);
    $('.enemy_health').text('');

    if (this.playerTouch) {

    
      var grid = new PF.Grid(worldMapClass.worldMap[0].length, worldMapClass.worldMap.length); 
      
      worldMapClass.worldMap.forEach((n, i) => {
        n.forEach((b, j) => {
            if (worldMapClass.worldMap[i][j].map == '0') {
              grid.setWalkableAt(j, i, false);
            }
        });
      });

      if (!worldMapClass.worldMap[Math.trunc(Math.abs(this.intersects.y/10))][Math.trunc(Math.abs(this.intersects.x/10))].enemy) {
        this.path = new PF.AStarFinder().findPath(Math.trunc(Math.abs(this.player.position.x/10)), Math.trunc(Math.abs(this.player.position.y/10)), Math.trunc(Math.abs(this.intersects.x/10)), Math.trunc(Math.abs(this.intersects.y/10)), grid);
      }
      

         
      this.playerCanRun = true;
      
    }
    
      
    if (this.playerCanRun && !this.playerTween.isPlaying()) {
      
      this.playerTouch = false;
  
      if (this.path.length>1) {

        let backPosition;
        let newPosition;
        backPosition = this.path[0];
        this.path[0] = this.path[1];
        newPosition = this.path[1];

        
        if (!this.playerRuninig && !worldMapClass.worldMap[this.path[1][1]][this.path[1][0]].enemy) this.playerTween = new TWEEN.Tween(this.player.position).to( { x: this.path[1][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2, y: -this.path[1][1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2 }, 1000)

        delete worldMapClass.worldMap[backPosition[1]][backPosition[0]].player
        
        this.playerTween.start().onComplete(()=>{
          
          worldMapClass.worldMap[Math.trunc(Math.abs(this.player.position.y/10))][Math.trunc(Math.abs(this.player.position.x/10))].player = true;
          if (!worldMapClass.worldMap[newPosition[1]][newPosition[0]].enemy) worldMapClass.worldMap[newPosition[1]][newPosition[0]].player = true;

          this.playerInBattle = false;
          this.playerInBattleID = 0;
          
          
          
          this.path.splice(1,1);
          this.playerCanRun = true;
          this.playerRuninig = false;
          if (worldMapClass.worldMap[newPosition[1]][newPosition[0]].enemy) {  //Уступаем место врагу, если идем на одну клетку
            this.player.position.set(backPosition[0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2, -backPosition[1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2, 0);
            delete worldMapClass.worldMap[backPosition[1]][backPosition[0]].player
            worldMapClass.worldMap[newPosition[1]][newPosition[0]].player = true;
            this.playerCanRun = false;
          }
        }).onUpdate(()=>{
          
          //delete worldMapClass.worldMap[Math.trunc(Math.abs(this.player.position.y/10))][Math.trunc(Math.abs(this.player.position.x/10))].player;
          this.playerRuninig = true;
          this.playerCanRun = false;
          worldMapClass.worldMap[newPosition[1]][newPosition[0]].player = true;
          
        });

      }
      else {

        this.playerRuninig = false;
        
      }
                      
    }

    if (this.playerInBattle == true) {
      this.playerNowBattle(enemyClass);
    }
  
  }

  playerNowBattle(enemyClass) {
    //console.log(`Бой с ${this.playerInBattleId}`);
    
    
    let enemyInBattle = enemyClass.enemies.find((el)=> el.id == this.playerInBattleId);
      
    $('.enemy_health').text(enemyInBattle.userData.health);

    
    let playerPunch;

    if (!this.playerCanPunch) playerPunch = new TWEEN.Tween({playerPower: 0}).to( {playerPower: this.maxplayerPower}, 2000).start().onUpdate(()=>{
      //console.log('update');
      this.playerCanPunch = true;
    }).onComplete(()=>{
      //console.log('complite');
      enemyInBattle.userData.health -= this.maxplayerPower;
      this.playerCanPunch = false;
    })

    // playerPunch.start().onComplete(()=>{

    //   this.playerCanPunch = true;
      
    //   playerPunch.playerPower = 0;

    // }).onUpdate(()=>{

    //   this.playerCanPunch = false;

    // })


    

    
  }
}
