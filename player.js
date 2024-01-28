import { WorldMapClass } from "./map.js"
import * as THREE from 'three';

let worldMapClass = new WorldMapClass();

export class Player {
  geometryPlayer = new THREE.BoxGeometry( 4, 4, 5 );
  materialPlayer = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  player = new THREE.Mesh;

  addPlayer (scene){
    this.player = new THREE.Mesh( this.geometryPlayer, this.materialPlayer );
    this.player.position.set(worldMapClass.worldSettings.sizeOneBlock+worldMapClass.worldSettings.sizeOneBlock/2 ,-worldMapClass.worldSettings.sizeOneBlock-worldMapClass.worldSettings.sizeOneBlock/2,0);
    scene.add( this.player );
  }
}