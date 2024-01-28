import { TIFFLoader } from 'three/addons/loaders/TIFFLoader.js';

export class WorldMapClass {

    worldMap = [
        ['0','0','0','0','0','0','0','0','0','0'],
        ['0','g','g','g','g','g','g','g','g','0'],
        ['0','g','g','g','g','g','g','0','g','0'],
        ['0','g','g','g','g','g','g','g','g','0'],
        ['0','g','g','g','g','0','g','g','g','0'],
        ['0','g','g','g','0','g','0','g','g','0'],
        ['0','g','g','0','g','0','0','g','g','0'],
        ['0','g','g','g','g','g','0','g','g','0'],
        ['0','g','g','g','g','g','g','g','g','0'],
        ['0','0','0','0','0','0','0','0','0','0'],
      ]
      
      worldSettings = {
        sizeX: this.worldMap[0].length, 
        sizeY: this.worldMap.length,
        sizeOneBlock: 10,
      }

      loadingMap(THREE, scene) {

        let geometry = new THREE.BoxGeometry( this.worldSettings.sizeX, this.worldSettings.sizeY, 0.2 ); 
      
        const loadMngr = new THREE.LoadingManager();
        const loader = new TIFFLoader(loadMngr);
      
        let grassTexture = loader.load('assets/map/grass.tif');
        let wallTexture = loader.load('assets/map/wall.tif');
      
        loadMngr.onLoad = () => {
          let grassMaterial = new THREE.MeshBasicMaterial( { map: grassTexture } );
          let grass = new THREE.Mesh( geometry, grassMaterial );
      
          let wallMaterial = new THREE.MeshBasicMaterial( { map: wallTexture } );
          let wall = new THREE.Mesh( geometry, wallMaterial );
      
      
          for (let i = 0; i < this.worldSettings.sizeX; i++) {
            for (let j = 0; j < this.worldSettings.sizeY; j++) {
              if (this.worldMap[i][j] == 'g') {
                let grassClone = grass.clone();
                grassClone.position.set(this.worldSettings.sizeOneBlock * j + this.worldSettings.sizeOneBlock/2  , -this.worldSettings.sizeOneBlock * i - this.worldSettings.sizeOneBlock / 2,0.2);
                scene.add( grassClone );      
              }
              else if (this.worldMap[i][j] == '0') {
                let wallClone = wall.clone();
                wallClone.position.set(this.worldSettings.sizeOneBlock * j + this.worldSettings.sizeOneBlock/2  , -this.worldSettings.sizeOneBlock * i - this.worldSettings.sizeOneBlock / 2,0.2);
                scene.add( wallClone );      
              }
            } 
          }
      
        }
    }
}