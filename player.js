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
      }, 1000)
    }
    
    
    
  }

  movePlayer(TWEEN) {

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
      

      
      
  
      
      //console.log(grid);

      

      
      this.playerCanRun = true;
      
    }
    
      
    if (this.playerCanRun && !this.playerTween.isPlaying()) {
      

      this.playerTouch = false;
    

      //console.log(this.path);
          
          
            
            //if (ii-1 >= 0) delete worldMapClass.worldMap[path[ii-1][1]][path[ii-1][0]].player;
            if (this.path.length>1) {
              //this.player.position.x = this.path[this.ii][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2;
              //this.player.position.y = -this.path[this.ii][1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2; 
              
              // let goPlayer = gsap.to( this.player.position, {
              //   duration: 2,
              //   x: this.path[1][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2,
              //   y: -this.path[1][1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2,
              //   z: 0,
              //   ease: 'none',
                
              // });
              //console.log(this.player.position.x)
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

              
              
              
              
              
              
              // if (Math.abs(Math.abs(this.player.position.x) - Math.abs(this.path[1][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2)) < 0.01 && Math.abs(Math.abs(this.player.position.y) - Math.abs(this.path[1][1] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2)) < 1) {
                
              //   this.path.splice(1,1);
              //   console.log(1)
              // }
              
            }
            else {
              //this.path = [];
              this.playerRuninig = false;
              
            }
            

            
            // goPlayer = gsap.to( this.player.position, {
            //   duration: 1,
            //   x: path[ii][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2,
            //   y: -path[ii][1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2,
            //   z: 0,
            
            // });
                  
                  
            
            //worldMapClass.worldMap[path[ii][1]][path[ii][0]].player = true;
          
    }
  
  }
}
