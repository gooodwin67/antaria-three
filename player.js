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
}