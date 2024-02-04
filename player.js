import { WorldMapClass } from "./map.js"
import * as THREE from 'three';

let worldMapClass = new WorldMapClass();

export class Player {
  geometryPlayer = new THREE.BoxGeometry( 4, 4, 5 );
  materialPlayer = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  player = new THREE.Mesh;

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

  movePlayer(intersects) {

    
  
    var grid = new PF.Grid(worldMapClass.worldMap[0].length, worldMapClass.worldMap.length); 
      
      worldMapClass.worldMap.forEach((n, i) => {
        n.forEach((b, j) => {
            if (worldMapClass.worldMap[i][j].map == '0') {
              grid.setWalkableAt(j, i, false);
            }
        });
      });
  
      var path = new PF.AStarFinder().findPath(Math.trunc(Math.abs(this.player.position.x/10)), Math.trunc(Math.abs(this.player.position.y/10)), Math.trunc(Math.abs(intersects.x/10)), Math.trunc(Math.abs(intersects.y/10)), grid);
      //console.log(path);
  
      // var ii = 0;
      //setInterval(function(){
  
        //if (ii<path.length) {

          console.log(path)
          
            let ii = 1;
            //if (ii-1 >= 0) delete worldMapClass.worldMap[path[ii-1][1]][path[ii-1][0]].player;
            //this.player.position.x = path[ii][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2;
            //this.player.position.y = -path[ii][1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2; 
            let goPlayer = gsap.to( this.player.position, {
              duration: 1,
              x: path[ii][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2,
              y: -path[ii][1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2,
              z: 0,
            }).then((goPlayer)=>{
              ii++;
              goPlayer.restart();
            });

            
            
            //worldMapClass.worldMap[path[ii][1]][path[ii][0]].player = true;
          
          //ii++
        //}
       
      //}, 200)
  
  }
}
