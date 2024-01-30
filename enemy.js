import { WorldMapClass } from "./map.js"
import * as THREE from 'three';
import { randomIntFromInterval } from "./functions.js";

let worldMapClass = new WorldMapClass();

export class Enemy {
  geometryEnemy = new THREE.BoxGeometry( 4, 4, 5 );
  materialEnemy = new THREE.MeshPhongMaterial( { color: 0x000000 } );
  enemy = new THREE.Mesh( this.geometryEnemy, this.materialEnemy );
  enemies = [];

  addEnemy (scene){

    for (let i = 0; i < worldMapClass.worldSettings.sizeX; i++) {
      for (let j = 0; j < worldMapClass.worldSettings.sizeY; j++) {
        if (worldMapClass.worldMap[i][j].enemy) {
          let newEnemy = this.enemy.clone();
          newEnemy.position.set(worldMapClass.worldSettings.sizeOneBlock*j+worldMapClass.worldSettings.sizeOneBlock/2 ,-worldMapClass.worldSettings.sizeOneBlock*i-worldMapClass.worldSettings.sizeOneBlock/2,0);
          this.enemies.push(newEnemy);
          scene.add( newEnemy );
        }
      }
    }
        
  }

  idleEnemy(enemies) {
    var ii = 0;
    enemies.forEach(el => {
      
      setInterval(function(){
        let masNewPos = [];
  
        
        
        if (worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/10))][Math.trunc(Math.abs(el.position.x/10))-1].map == 'g') {
          masNewPos.push([Math.trunc(Math.abs(el.position.x/10))-1, Math.trunc(Math.abs(el.position.y/10))]);
        }
        if (worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/10))][Math.trunc(Math.abs(el.position.x/10))+1].map == 'g') {
          masNewPos.push([Math.trunc(Math.abs(el.position.x/10))+1, Math.trunc(Math.abs(el.position.y/10))]);
        }
        if (worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/10))-1][Math.trunc(Math.abs(el.position.x/10))].map == 'g') {
          masNewPos.push([Math.trunc(Math.abs(el.position.x/10)), Math.trunc(Math.abs(el.position.y/10))-1]);
        }
        if (worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/10))+1][Math.trunc(Math.abs(el.position.x/10))].map == 'g') {
          masNewPos.push([Math.trunc(Math.abs(el.position.x/10)), Math.trunc(Math.abs(el.position.y/10))+1]);
        }
  
      
        let rand = randomIntFromInterval(0,masNewPos.length-1)
        let newPath = masNewPos[rand];
  
        delete worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/10))][Math.trunc(Math.abs(el.position.x/10))].enemy;

        el.position.x = newPath[0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2;
        el.position.y = -newPath[1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2; 

        worldMapClass.worldMap[newPath[1]][newPath[0]].enemy = true;
          // ii++

          console.log(worldMapClass.worldMap);/*///////////////////////////////////////////////////////////////////////////////////////////////////////*/
        
        
      }, 500)

    });
    
    
    

  }


  
}