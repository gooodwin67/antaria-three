import { TextureLoader } from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export class WorldMapClass {

  worldMap = [
    [{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'}],
    [{map:'0'},{map:'g', player: true},{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g', enemy: true},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'0'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'0'},{map:'0'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'}],
  ]
  // worldMap = [
  //   [{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'}],
  //   [{map:'0'},{map:'g'},{map:'0'},{map:'g', enemy: true},{map:'g'},{map:'g', enemy: true},{map:'g'},{map:'g', enemy: true},{map:'g'},{map:'0'}],
  //   [{map:'0'},{map:'g', player: true},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'0'}],
  //   [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'}],
  //   [{map:'0'},{map:'g'},{map:'g', enemy: true},{map:'g', enemy: true},{map:'g', enemy: true},{map:'0'},{map:'g', enemy: true},{map:'g', enemy: true},{map:'g'},{map:'0'}],
  //   [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'0'},{map:'g'},{map:'g'},{map:'0'}],
  //   [{map:'0'},{map:'g'},{map:'g', enemy: true},{map:'0'},{map:'g', enemy: true},{map:'0'},{map:'0'},{map:'g', enemy: true},{map:'g'},{map:'0'}],
  //   [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'g', enemy: true},{map:'0'}],
  //   [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g', enemy: true},{map:'0'}],
  //   [{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'}],
  // ]

  






      
      worldSettings = {
        sizeX: this.worldMap[0].length, 
        sizeY: this.worldMap.length,
        sizeOneBlock: 10,
      }

      tree = 0;

      

      

      loading3D(THREE, scene) {
        var loader3D = new GLTFLoader();
        let tree = this.tree;
        let IsLoaded3D = this.IsLoaded3D;
        tree = 2;

        loader3D.load(
          
          'assets/models/tree.gltf',
          function ( gltf) {
            
            gltf.scene.scale.set(3,3,3);
            gltf.scene.position.set(50,-50,0);
            
            
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            
            
            tree = gltf.scene;
            tree.rotation.x = Math.PI/2

            scene.add( tree );
            
            console.log(tree);

            
            
            
           
      
            
            // playerAll.traverse( function ( child ) {
            //   if ( child.isMesh ) {
            //     child.castShadow = true;
            //   }
            // } );
            
            
          
          },
          // called while loading is progressing
          function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          // called when loading has errors
          function ( error ) {
            console.log( 'An error happened' );
          }
      
      
        );
      }

      
      
      

      loadingMap(THREE, scene) {

        

        

        let tree = this.tree;
        console.log(this.tree);

        //console.log(tree);

        let geometry = new THREE.BoxGeometry( this.worldSettings.sizeOneBlock, this.worldSettings.sizeOneBlock, 0.2 ); 
      
        const loadMngr = new THREE.LoadingManager();
        const loader = new TextureLoader(loadMngr);
      
        let grassTexture = loader.load('assets/map/grass/grass1.png');
        
        let wallTexture = loader.load('assets/map/ground/ground1.png');
        

        
        
      
        loadMngr.onLoad = () => {
          let grassMaterial = new THREE.MeshBasicMaterial( { map: grassTexture} );
          let grass = new THREE.Mesh( geometry, grassMaterial );
      
          let wallMaterial = new THREE.MeshBasicMaterial( { map: wallTexture } );
          let wall = new THREE.Mesh( geometry, wallMaterial );
      
      
          for (let i = 0; i < this.worldSettings.sizeX; i++) {
            for (let j = 0; j < this.worldSettings.sizeY; j++) {
              if (this.worldMap[i][j].map == 'g') {
                let grassClone = grass.clone();
                grassClone.position.set(this.worldSettings.sizeOneBlock * j + this.worldSettings.sizeOneBlock/2  , -this.worldSettings.sizeOneBlock * i - this.worldSettings.sizeOneBlock / 2,0.2);
                scene.add( grassClone );      
              }
              else if (this.worldMap[i][j].map == '0') {
                let wallClone = wall.clone();
                wallClone.position.set(this.worldSettings.sizeOneBlock * j + this.worldSettings.sizeOneBlock/2  , -this.worldSettings.sizeOneBlock * i - this.worldSettings.sizeOneBlock / 2,0.2);
                scene.add( wallClone );      
              }
            } 
          }
      
        }
    }
}