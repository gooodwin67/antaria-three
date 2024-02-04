import { WorldMapClass } from "./map.js"
import * as THREE from 'three';

let worldMapClass = new WorldMapClass();

export class Player {
  geometryPlayer = new THREE.BoxGeometry( 4, 4, 5 );
  materialPlayer = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  player = new THREE.Mesh;
  playerRun = false;
  playerPathCalc = false;
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
    this.path = [];
    this.playerRun = true;
    this.playerPathCalc = true;
    this.intersects = intersects;
    this.ii = 1;
  }

  movePlayer() {

    

    if (this.playerPathCalc) {
      var grid = new PF.Grid(worldMapClass.worldMap[0].length, worldMapClass.worldMap.length); 
      
      worldMapClass.worldMap.forEach((n, i) => {
        n.forEach((b, j) => {
            if (worldMapClass.worldMap[i][j].map == '0') {
              grid.setWalkableAt(j, i, false);
            }
        });
      });
      
  
      this.path = new PF.AStarFinder().findPath(Math.trunc(Math.abs(this.player.position.x/10)), Math.trunc(Math.abs(this.player.position.y/10)), Math.trunc(Math.abs(this.intersects.x/10)), Math.trunc(Math.abs(this.intersects.y/10)), grid);
      this.playerPathCalc = false;
    

      //console.log(this.path);
          
          
            
            //if (ii-1 >= 0) delete worldMapClass.worldMap[path[ii-1][1]][path[ii-1][0]].player;
            if (this.path.length>1) {
              //this.player.position.x = this.path[this.ii][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2;
              //this.player.position.y = -this.path[this.ii][1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2; 
              
              let goPlayer = gsap.to( this.player.position, {
                duration: 2,
                x: this.path[1][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2,
                y: -this.path[1][1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2,
                z: 0,
                ease: 'none',
                
              });
              console.log(goPlayer.isActive())
              if (goPlayer.ratio == 1) console.log(1)
              
              // if (Math.abs(Math.abs(this.player.position.x) - Math.abs(this.path[1][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2)) < 0.01 && Math.abs(Math.abs(this.player.position.y) - Math.abs(this.path[1][1] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2)) < 1) {
                
              //   this.path.splice(1,1);
              //   console.log(1)
              // }
              
            }
            else this.playerRun = false;
            

            
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
