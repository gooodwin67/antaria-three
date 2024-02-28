import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';


import { OrbitControls } from "three/addons/controls/OrbitControls";

import { WorldMapClass } from "./map.js"
import { Player } from "./player.js"
import { Enemy } from "./enemy.js"

import { TWEEN } from './libs/tween.module.min.js';


let stats;




let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

let testBlock;

let scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0xffffff);
scene.background = new THREE.Color( 0x000000 );







let camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1300);
camera.position.set(50, -50, 300);
//camera.lookAt(50,-50,0);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize($('.game').width(), $('.game').height());
renderer.setClearColor(0xffffff)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
camera.aspect = $('.game').width() / $('.game').height();
camera.updateProjectionMatrix();
document.querySelector('.game').appendChild(renderer.domElement);
window.addEventListener("resize", (event) => {
  camera.aspect = $('.game').width() / $('.game').height();
  camera.updateProjectionMatrix();
  renderer.setSize($('.game').width(), $('.game').height());
});
stats = new Stats();
$('.stats').append( stats.dom );



export let worldMapClass = new WorldMapClass();
let playerClass = new Player();
let enemyClass = new Enemy();



scene.add( new THREE.AmbientLight( 0x666666, 3 ) );





let light = new THREE.PointLight( 0xffffff, 1 );
//light.position.set(playerClass.player.position.x,playerClass.player.position.y, 100);
light.penumbra = 2;
light.power = 10;
light.decay = 2;


scene.add( light );

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(50, -50, 0);


let plane;



let dirTap; // след от мышки на карте




async function init() {

  worldMapClass.loading3DMap(THREE, scene).then(()=>{

    if (worldMapClass.mapIsLoaded) {

      
    
      var geometryPlane = new THREE.BoxGeometry(worldMapClass.worldSettings.sizeX*worldMapClass.worldSettings.sizeOneBlock, worldMapClass.worldSettings.sizeY*worldMapClass.worldSettings.sizeOneBlock, 1);
      var materialPlane = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide })
      plane = new THREE.Mesh ( geometryPlane, materialPlane );
      plane.receiveShadow = true;
      plane.position.set(worldMapClass.worldSettings.sizeX*worldMapClass.worldSettings.sizeOneBlock/2,-worldMapClass.worldSettings.sizeY*worldMapClass.worldSettings.sizeOneBlock/2,-1);
      
      scene.add( plane );

      const size = worldMapClass.worldSettings.sizeX*worldMapClass.worldSettings.sizeOneBlock;
      const divisions = worldMapClass.worldSettings.sizeX;
      const gridHelper = new THREE.GridHelper( size, divisions );
      gridHelper.position.set(worldMapClass.worldSettings.sizeX*worldMapClass.worldSettings.sizeOneBlock/2,-worldMapClass.worldSettings.sizeY*worldMapClass.worldSettings.sizeOneBlock/2,0.4);
      gridHelper.rotation.x = Math.PI/2;
      //scene.add( gridHelper );

      const geometryDirTap = new THREE.BoxGeometry( worldMapClass.worldSettings.sizeOneBlock, worldMapClass.worldSettings.sizeOneBlock, 1 );
      const materialDirTap = new THREE.MeshBasicMaterial( { color: 0xffff00, transparent: true, opacity: 0 } );
      dirTap = new THREE.Mesh( geometryDirTap, materialDirTap );
      dirTap.position.set(worldMapClass.worldSettings.sizeOneBlock+worldMapClass.worldSettings.sizeOneBlock/2 ,-worldMapClass.worldSettings.sizeOneBlock-worldMapClass.worldSettings.sizeOneBlock/2,0);
      scene.add( dirTap );



  
  
    
      playerClass.addPlayer(scene, worldMapClass);
      enemyClass.addEnemy(scene, TWEEN);

      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    }
  })
  //worldMapClass.loading3D(THREE, scene)
  //worldMapClass.loadingMap(THREE, scene);
  
  
  
  

  // enemyClass.idleEnemy(enemyClass.enemies);


  

  const testBlockGeometry = new THREE.BoxGeometry( worldMapClass.worldSettings.sizeOneBlock, worldMapClass.worldSettings.sizeOneBlock, 1 );
  const testBlockMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, transparent: true, opacity: 1 } );
  testBlock = new THREE.Mesh( testBlockGeometry, testBlockMaterial );
  
  //scene.add( testBlock );
  
 
};

init();

/*///////////////////////////////////////////////////////////////////*/

function animate( ) {
  
  
  
  playerClass.movePlayer(TWEEN, enemyClass);

  enemyClass.idleEnemy(scene, enemyClass.enemies, TWEEN, playerClass.player, playerClass);


  
  if (playerClass.playerLoaded) {
    if ( playerClass.player.children[1].mixers.length > 0 ) {
      for ( var i = 0; i < playerClass.player.children[1].mixers.length; i ++ ) {
        playerClass.player.children[1].mixers[ i ].update( playerClass.player.children[1].clock.getDelta() );
      }
    } 
  }

  // worldMapClass.worldMap.forEach((n, i) => {
  //   n.forEach((b, j) => {
  //       if (worldMapClass.worldMap[i][j].player) {
  //         let testblock1 = testBlock.clone();
          
  //         testblock1.position.set(worldMapClass.worldSettings.sizeOneBlock * j + worldMapClass.worldSettings.sizeOneBlock/2  , -worldMapClass.worldSettings.sizeOneBlock * i - worldMapClass.worldSettings.sizeOneBlock / 2,0);
  //         //console.log(`${i}---${j}`)
          
  //       }
  //   });
  // });
  
  
  
  controls.update();
  // camera.position.set(playerClass.player.position.x, playerClass.player.position.y-300, camera.position.z)
  // camera.lookAt(playerClass.player.position);
  light.position.set(playerClass.player.position.x,playerClass.player.position.y, 200);

    
};

/*///////////////////////////////////////////////////////////////////*/

$('.btn1').click(function() {console.log(1)});


/*///////////////////////////////////////////////////////////////////*/

renderer.setAnimationLoop((_) => {
    
    animate();
    TWEEN.update();
    stats.update();
    renderer.render(scene, camera);
});

/*///////////////////////////////////////////////////////////////////*/



function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX / $('.game').width() ) * 2 - 1;
    mouse.y = - ( event.clientY / $('.game').height() ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );
    
    plane.geometry.computeBoundingBox();
    var box1 = plane.geometry.boundingBox.clone();
    box1.applyMatrix4(plane.matrixWorld);
    
    let intersects = raycaster.ray.intersectBox( box1, new THREE.Vector3() );
    
    
    if (intersects) {
      // console.log(Math.trunc(Math.abs(player.position.x/10)));
      dirTap.material.opacity = 0.1;
      dirTap.position.x = Math.trunc(Math.abs(intersects.x/worldMapClass.worldSettings.sizeOneBlock)) * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2;
      dirTap.position.y = -Math.trunc(Math.abs(intersects.y/worldMapClass.worldSettings.sizeOneBlock)) * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2;
    }
    else {
      dirTap.material.opacity = 0;
    }
}
function onDocumentMouseDown( event ) { 
  event.preventDefault();
  mouse.x = ( event.clientX / $('.game').width() ) * 2 - 1;
  mouse.y = - ( event.clientY / $('.game').height() ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );
    
  plane.geometry.computeBoundingBox();
  var box1 = plane.geometry.boundingBox.clone();
  box1.applyMatrix4(plane.matrixWorld);
  
  let intersects = raycaster.ray.intersectBox( box1, new THREE.Vector3() );
  
  
  if (intersects) {
    
    playerClass.setPlayerRun(intersects);
    
    
    
    
    
  }
}


  


/*///////////////////////////////////////////////////////////////////*/





