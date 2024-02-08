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
//scene.fog = new THREE.Fog(0xffffff);
scene.background = new THREE.Color( 0x444444 );

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xffffff)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
stats = new Stats();
document.body.appendChild( stats.dom );



let camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1000);
camera.position.set(50, -50, 300);
camera.lookAt(50,-50,0);

var ambient = new THREE.AmbientLight( 0xffffff, 0.1);

scene.add( ambient )

let light = new THREE.SpotLight( 0xffffff, 1 );
light.position.set(0,0, 100);
light.penumbra = 1;
light.power = 2;
light.decay = 2;
light.distance = 300;


scene.add( light );

let controls = new OrbitControls(camera, renderer.domElement);
//controls.enableDamping = true;
controls.target.set(50, -50, 0);


let plane;

export let worldMapClass = new WorldMapClass();
let playerClass = new Player();
let enemyClass = new Enemy();

let dirTap; // след от мышки на карте




function init() {
    
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
  scene.add( gridHelper );

  const geometryDirTap = new THREE.BoxGeometry( worldMapClass.worldSettings.sizeOneBlock, worldMapClass.worldSettings.sizeOneBlock, 1 );
  const materialDirTap = new THREE.MeshBasicMaterial( { color: 0xffff00, transparent: true, opacity: 0 } );
  dirTap = new THREE.Mesh( geometryDirTap, materialDirTap );
  dirTap.position.set(worldMapClass.worldSettings.sizeOneBlock+worldMapClass.worldSettings.sizeOneBlock/2 ,-worldMapClass.worldSettings.sizeOneBlock-worldMapClass.worldSettings.sizeOneBlock/2,0);
  scene.add( dirTap );



  
  worldMapClass.loadingMap(THREE, scene); 
  playerClass.addPlayer(scene);
  enemyClass.addEnemy(scene, TWEEN);
  

  // enemyClass.idleEnemy(enemyClass.enemies);


  

  const testBlockGeometry = new THREE.BoxGeometry( worldMapClass.worldSettings.sizeOneBlock, worldMapClass.worldSettings.sizeOneBlock, 1 );
  const testBlockMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, transparent: true, opacity: 1 } );
  testBlock = new THREE.Mesh( testBlockGeometry, testBlockMaterial );
  
  scene.add( testBlock );
  
 
};

init();

/*///////////////////////////////////////////////////////////////////*/

function animate( ) {

  

  playerClass.movePlayer(TWEEN);

  enemyClass.idleEnemy(enemyClass.enemies, TWEEN, playerClass.player);

  worldMapClass.worldMap.forEach((n, i) => {
    n.forEach((b, j) => {
        if (worldMapClass.worldMap[i][j].player) {
          
          testBlock.position.set(worldMapClass.worldSettings.sizeOneBlock * j + worldMapClass.worldSettings.sizeOneBlock/2  , -worldMapClass.worldSettings.sizeOneBlock * i - worldMapClass.worldSettings.sizeOneBlock / 2,0);
          //console.log(`${i}---${j}`)
          
        }
    });
  });
  
  
  //console.log(enemyClass.enemy.position.distanceTo(playerClass.player.position));
  controls.update();
    
};

/*///////////////////////////////////////////////////////////////////*/

$('.btn1').click(function() {console.log(1)});
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );

/*///////////////////////////////////////////////////////////////////*/

renderer.setAnimationLoop((_) => {
    
    animate();
    TWEEN.update();
    stats.update();
    renderer.render(scene, camera);
});

/*///////////////////////////////////////////////////////////////////*/



function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );
    
    plane.geometry.computeBoundingBox();
    var box1 = plane.geometry.boundingBox.clone();
    box1.applyMatrix4(plane.matrixWorld);
    
    let intersects = raycaster.ray.intersectBox( box1, new THREE.Vector3() );
    
    
    if (intersects) {
      // console.log(Math.trunc(Math.abs(player.position.x/10)));
      dirTap.material.opacity = 0.1;
      dirTap.position.x = Math.trunc(Math.abs(intersects.x/10)) * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2;
      dirTap.position.y = -Math.trunc(Math.abs(intersects.y/10)) * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2;
    }
    else {
      dirTap.material.opacity = 0;
    }
}
function onDocumentMouseDown( event ) { 
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

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





