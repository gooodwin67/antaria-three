import { WorldMapClass } from "./map.js"
import * as THREE from 'three';
import { randomIntFromInterval } from "./functions.js";
import { worldMapClass } from "./main.js";

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
          newEnemy.userData.speed = 2;
          newEnemy.userData.delta = 0;
          newEnemy.userData.time = 0;
          newEnemy.userData.clock = new THREE.Clock();
          newEnemy.position.set(worldMapClass.worldSettings.sizeOneBlock*j+worldMapClass.worldSettings.sizeOneBlock/2 ,-worldMapClass.worldSettings.sizeOneBlock*i-worldMapClass.worldSettings.sizeOneBlock/2,0);
          this.enemies.push(newEnemy);
          scene.add( newEnemy );
        }
      }
    }
        
  }

  


  idleEnemy(enemies, TWEEN) {
    
    

    //console.log(this.time)


    enemies.forEach(el => {

      el.userData.delta = el.userData.clock.getDelta();
      el.userData.time += el.userData.delta;
      

      if (el.userData.time >= el.userData.speed) {
        
        let masNewPos = [];

        let yPos = Math.trunc(Math.abs(el.position.y/10));
        let xPos = Math.trunc(Math.abs(el.position.x/10));
        
        if (worldMapClass.worldMap[yPos][xPos-1].map == 'g' && !worldMapClass.worldMap[yPos][xPos-1].player && !worldMapClass.worldMap[yPos][xPos-1].enemy) {
          masNewPos.push([xPos-1, yPos]);
        }
        if (worldMapClass.worldMap[yPos][xPos+1].map == 'g' && !worldMapClass.worldMap[yPos][xPos+1].player && !worldMapClass.worldMap[yPos][xPos+1].enemy) {
          masNewPos.push([xPos+1, yPos]);
        }
        if (worldMapClass.worldMap[yPos-1][xPos].map == 'g' && !worldMapClass.worldMap[yPos-1][xPos].player && !worldMapClass.worldMap[yPos-1][xPos].enemy) {
          masNewPos.push([xPos, yPos-1]);
        }
        if (worldMapClass.worldMap[yPos+1][xPos].map == 'g' && !worldMapClass.worldMap[yPos+1][xPos].player && !worldMapClass.worldMap[yPos+1][xPos].enemy) {
          masNewPos.push([xPos, yPos+1]);
        }

      
        let rand = randomIntFromInterval(0,masNewPos.length-1)
        let newPath = masNewPos[rand];

        if (masNewPos.length>0) {

          delete worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/10))][Math.trunc(Math.abs(el.position.x/10))].enemy;
          

          new TWEEN.Tween(el.position).to( { x: newPath[0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2, y: -newPath[1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2 }, (el.userData.speed-1)*1000).start()

          


          worldMapClass.worldMap[newPath[1]][newPath[0]].enemy = true;
        }

        
          el.userData.time = 0;

      }
      

    });
    

  }
  
}