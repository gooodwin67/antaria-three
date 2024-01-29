import { WorldMapClass } from "./map.js"
import * as THREE from 'three';
import { randomIntFromInterval } from "./functions.js";

let worldMapClass = new WorldMapClass();

export class Enemy {
  geometryEnemy = new THREE.BoxGeometry( 4, 4, 5 );
  materialEnemy = new THREE.MeshPhongMaterial( { color: 0x000000 } );
  enemy = new THREE.Mesh;

  addEnemy (scene){
    this.enemy = new THREE.Mesh( this.geometryEnemy, this.materialEnemy );
    this.enemy.position.set(worldMapClass.worldSettings.sizeOneBlock*8+worldMapClass.worldSettings.sizeOneBlock/2 ,-worldMapClass.worldSettings.sizeOneBlock*8-worldMapClass.worldSettings.sizeOneBlock/2,0);
    scene.add( this.enemy );
    
  }

  idleEnemy(enemy) {
    var ii = 0;
    
    setInterval(function(){
      let masNewPos = [];

      
      
      if (worldMapClass.worldMap[Math.trunc(Math.abs(enemy.position.y/10))][Math.trunc(Math.abs(enemy.position.x/10))-1] == 'g') {
        masNewPos.push([Math.trunc(Math.abs(enemy.position.x/10))-1, Math.trunc(Math.abs(enemy.position.y/10))]);
      }
      if (worldMapClass.worldMap[Math.trunc(Math.abs(enemy.position.y/10))][Math.trunc(Math.abs(enemy.position.x/10))+1] == 'g') {
        masNewPos.push([Math.trunc(Math.abs(enemy.position.x/10))+1, Math.trunc(Math.abs(enemy.position.y/10))]);
      }
      if (worldMapClass.worldMap[Math.trunc(Math.abs(enemy.position.y/10))-1][Math.trunc(Math.abs(enemy.position.x/10))] == 'g') {
        masNewPos.push([Math.trunc(Math.abs(enemy.position.x/10)), Math.trunc(Math.abs(enemy.position.y/10))-1]);
      }
      if (worldMapClass.worldMap[Math.trunc(Math.abs(enemy.position.y/10))+1][Math.trunc(Math.abs(enemy.position.x/10))] == 'g') {
        masNewPos.push([Math.trunc(Math.abs(enemy.position.x/10)), Math.trunc(Math.abs(enemy.position.y/10))+1]);
      }

    
      let rand = randomIntFromInterval(0,masNewPos.length-1)
      let newPath = masNewPos[rand];

      
        enemy.position.x = newPath[0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2;
        enemy.position.y = -newPath[1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2; 
        // ii++
      
      
    }, 1500)
    
    
    
    

  }
}