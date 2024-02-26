import { TextureLoader } from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export class WorldMapClass {

  worldMap = [
    [{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g', enemy: true},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'0'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'0'},{map:'0'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'g'},{map:'0'}],
    [{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'},{map:'0'}],
  ]


  worldMap = [];


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
        sizeX: 13, 
        sizeY: 13,
        sizeOneBlock: 16,
      }

      mapIsLoaded = false;
      

      

      async loading3DMap(THREE, scene) {

        var loader3DMap = new GLTFLoader();

        await loader3DMap.loadAsync(
          
          'assets/map/map_test.gltf'
          ).then((gltf)=>{
            gltf.scene.scale.set(this.worldSettings.sizeOneBlock/2, this.worldSettings.sizeOneBlock/2, this.worldSettings.sizeOneBlock/2);
            //gltf.scene.position.set(this.worldSettings.sizeX/2*this.worldSettings.sizeOneBlock,-this.worldSettings.sizeX/2*this.worldSettings.sizeOneBlock,0);
            
            
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene
            gltf.scenes; // Array<THREE.Scene>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            let map = gltf.scene;
            map.rotation.x = Math.PI/2;
            


            
            // map.traverse( function ( child ) {
            //   if ( child.isMesh ) {
            //     child.castShadow = true;
            //     child.receiveShadow = true;
            //   }
            // } );

            scene.add( map );

            this.loadingMap(THREE, scene, map);
          })

      }

      

      

      
      
      

      loadingMap(THREE, scene, map) {

        
        let sizeMapMas = map.children.filter((res)=>{
          return res.name.includes('map');
        })

        
        
        let worldMapNew = [...Array(13)].map(e => Array(13));
        console.log(worldMapNew);
        for (var i = 0; i< Math.sqrt(sizeMapMas.length); i++) {
          for (var j = 0; j< Math.sqrt(sizeMapMas.length); j++) {
            worldMapNew[i][j] = 0;
          }  
        }        

        
        
        
        
        
        for (let i = 0; i < map.children.length; i++) {

          if (map.children[i].name.includes('wall027')) {
            console.log(Math.round(Math.abs((map.children[i].getWorldPosition(new THREE.Vector3()).x + this.worldSettings.sizeOneBlock/2-1) / this.worldSettings.sizeOneBlock)));
            console.log(Math.round(Math.abs((-map.children[i].getWorldPosition(new THREE.Vector3()).y - this.worldSettings.sizeOneBlock/2+1) / this.worldSettings.sizeOneBlock)));
            
          }
          
          let xBlock = Math.round(Math.abs((map.children[i].getWorldPosition(new THREE.Vector3()).x + this.worldSettings.sizeOneBlock/2-1) / this.worldSettings.sizeOneBlock))-1
          let yBlock = Math.round(Math.abs((-map.children[i].getWorldPosition(new THREE.Vector3()).y - this.worldSettings.sizeOneBlock/2+1) / this.worldSettings.sizeOneBlock))

          
          

          if (map.children[i].name.includes('wall')) {
            worldMapNew[yBlock][xBlock] = {map:'0'}
            
            
            
          }
          else if (map.children[i].name.includes('ground') || map.children[i].name.includes('grass')) {
            worldMapNew[yBlock][xBlock] = {map:'g'}
          }
          if (map.children[i].name.includes('player')) {
            worldMapNew[yBlock][xBlock].player = true;
          }
          if (map.children[i].name.includes('enemy')) {
            worldMapNew[yBlock][xBlock].enemy = true;
          }
          
        }

        // console.log(this.worldMap);
        
        this.worldMap = worldMapNew;
        this.mapIsLoaded = true;







        // let geometry = new THREE.BoxGeometry( this.worldSettings.sizeOneBlock, this.worldSettings.sizeOneBlock, 0.2 ); 
      
        // const loadMngr = new THREE.LoadingManager();
        // const loader = new TextureLoader(loadMngr);
      
        // let grassTexture = loader.load('assets/map/grass/grass1.png');
        
        // let wallTexture = loader.load('assets/map/ground/ground1.png');
        

        
        
      
        // loadMngr.onLoad = () => {
        //   let grassMaterial = new THREE.MeshBasicMaterial( { map: grassTexture} );
        //   let grass = new THREE.Mesh( geometry, grassMaterial );
      
        //   let wallMaterial = new THREE.MeshBasicMaterial( { map: wallTexture } );
        //   let wall = new THREE.Mesh( geometry, wallMaterial );
      
      
        //   for (let i = 0; i < this.worldSettings.sizeX; i++) {
        //     for (let j = 0; j < this.worldSettings.sizeY; j++) {
        //       if (this.worldMap[i][j].map == 'g') {
        //         let grassClone = grass.clone();
        //         grassClone.position.set(this.worldSettings.sizeOneBlock * j + this.worldSettings.sizeOneBlock/2  , -this.worldSettings.sizeOneBlock * i - this.worldSettings.sizeOneBlock / 2,0.2);
        //         scene.add( grassClone );      
        //       }
        //       else if (this.worldMap[i][j].map == '0') {
        //         let wallClone = wall.clone();
                
        //         wallClone.position.set(this.worldSettings.sizeOneBlock * j + this.worldSettings.sizeOneBlock/2  , -this.worldSettings.sizeOneBlock * i - this.worldSettings.sizeOneBlock / 2,0.2);
        //         scene.add( wallClone );      
        //       }
        //     } 
        //   }
      
        // }
    }
}