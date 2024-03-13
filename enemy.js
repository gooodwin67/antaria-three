import { WorldMapClass } from "./map.js"
import * as THREE from 'three';
import { randomIntFromInterval } from "./functions.js";
import { worldMapClass } from "./main.js";

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export class Enemy {
  geometryEnemy = new THREE.BoxGeometry( worldMapClass.worldSettings.sizeOneBlock/1.5, worldMapClass.worldSettings.sizeOneBlock/1.5, 5 );
  materialEnemy = new THREE.MeshPhongMaterial( { color: 0x000000 } );
  enemy = new THREE.Group();
  enemy3D = new THREE.Mesh( this.geometryEnemy, this.materialEnemy );
  enemies = [];
  

  distanceToWatchPlayer = worldMapClass.worldSettings.sizeOneBlock*5;
  

  

  async addEnemy (scene, TWEEN, worldMapClass){

    var loader = new GLTFLoader();
    await loader.loadAsync(
      'assets/models/player/player6.gltf').then(( gltf ) =>{
        
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Scene
        gltf.scenes; // Array<THREE.Scene>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
  
        gltf.scene.animations = gltf.animations;
        
        this.enemy3D = gltf.scene;
  
        this.enemy3D.rotation.x = Math.PI/2;

        this.enemy3D.scale.set(10,10,10);

        this.enemy3D.up.set(0,0,1);

        

        this.enemy.add(this.enemy3D);

    

      for (let i = 0; i < worldMapClass.worldSettings.sizeX; i++) {
        for (let j = 0; j < worldMapClass.worldSettings.sizeY; j++) {
          if (worldMapClass.worldMap[i][j].enemy) {

            let newEnemy = this.enemy.clone();

            newEnemy.rotation.x = -Math.PI/2;

            newEnemy.scale.set(0.1,0.1,0.1);

            newEnemy.up.set(0,0,1);

            console.log(newEnemy);

            newEnemy.children[0].add(SkeletonUtils.clone(this.enemy3D));

            newEnemy.userData.speed = 2+Math.random();
            newEnemy.userData.delta = 0;
            newEnemy.userData.time = 0;
            newEnemy.userData.clock = new THREE.Clock();

            newEnemy.userData.timeToAlive = 5;
            newEnemy.userData.timeDie = 0;

            newEnemy.userData.enemyCanRun = true;
            newEnemy.userData.enemyCanPath = false;
            newEnemy.userData.path = [];
            newEnemy.userData.enemyTween = new TWEEN.Tween;

            newEnemy.userData.inBattle = false;
            newEnemy.userData.enemyCanPunch = false;
            newEnemy.userData.health = 100;
            newEnemy.userData.maxHealth = 100;
            newEnemy.userData.enemyCanHealth = false;

            newEnemy.userData.enemyPower = 0;
            newEnemy.userData.maxEnemyPower = 5;

            newEnemy.userData.dead = false;

            newEnemy.userData.firstPosition = new THREE.Vector3(worldMapClass.worldSettings.sizeOneBlock*j+worldMapClass.worldSettings.sizeOneBlock/2 ,-worldMapClass.worldSettings.sizeOneBlock*i-worldMapClass.worldSettings.sizeOneBlock/2,0);

            newEnemy.userData.firstPositionOnMasMap = new THREE.Vector2(j , i);


            newEnemy.position.set(newEnemy.userData.firstPosition.x, newEnemy.userData.firstPosition.y, newEnemy.userData.firstPosition.z);
            this.enemies.push(newEnemy);
            scene.add( newEnemy );
          }
        }
      }




    });
        
  }

  


  idleEnemy(scene, enemies, TWEEN, player, playerClass) {
    


    let livesEnemies = enemies.filter((el) => !el.userData.dead);
    let deadEnemies = enemies.filter((el) => el.userData.dead);

    deadEnemies.forEach(el => {
      el.userData.timeDie += el.userData.delta;
      

      if (el.userData.timeDie > el.userData.timeToAlive && !worldMapClass.worldMap[el.userData.firstPositionOnMasMap.y][el.userData.firstPositionOnMasMap.x].enemy && !worldMapClass.worldMap[el.userData.firstPositionOnMasMap.y][el.userData.firstPositionOnMasMap.x].player) {
        el.position.set(el.userData.firstPosition.x, el.userData.firstPosition.y, el.userData.firstPosition.z);
        worldMapClass.worldMap[el.userData.firstPositionOnMasMap.y][el.userData.firstPositionOnMasMap.x].enemy = true;
        scene.add( el );
        el.userData.health = 100;
        el.userData.dead = false;
        el.userData.timeDie = 0;
      }
      else if ((el.userData.timeDie > el.userData.timeToAlive && worldMapClass.worldMap[el.userData.firstPositionOnMasMap.y][el.userData.firstPositionOnMasMap.x].enemy) || (el.userData.timeDie > el.userData.timeToAlive && worldMapClass.worldMap[el.userData.firstPositionOnMasMap.y][el.userData.firstPositionOnMasMap.x].player)) {
        el.userData.timeDie = 0;
      }
      
    })

    
        
        


    livesEnemies.forEach(el => {

      el.userData.delta = el.userData.clock.getDelta();
      el.userData.time += el.userData.delta;
      
      
      if (el.userData.time >= el.userData.speed) {
        
        
        
        if (el.position.distanceTo(player.position) > this.distanceToWatchPlayer || !el.userData.enemyCanPath) {
          if (!el.userData.enemyCanPath) {
            var grid = new PF.Grid(worldMapClass.worldMap[0].length, worldMapClass.worldMap.length); 
            
            worldMapClass.worldMap.forEach((n, i) => {
              n.forEach((b, j) => {
                  if (worldMapClass.worldMap[i][j].map == '0' || worldMapClass.worldMap[i][j].enemy) {
                    grid.setWalkableAt(j, i, false);
                  }
              });
            });

            el.userData.path = new PF.AStarFinder().findPath(Math.trunc(Math.abs(el.position.x/worldMapClass.worldSettings.sizeOneBlock)), Math.trunc(Math.abs(el.position.y/worldMapClass.worldSettings.sizeOneBlock)), Math.trunc(Math.abs(player.position.x/worldMapClass.worldSettings.sizeOneBlock)), Math.trunc(Math.abs(player.position.y/worldMapClass.worldSettings.sizeOneBlock)), grid);
            
            if (el.userData.path.length == 0) {
              
            this.enemyIdle(scene, el, TWEEN);
            }
            else {
              el.userData.enemyCanPath = true;
            }

          }
          else {
            this.enemyIdle(scene, el, TWEEN);
          }

        }
        else {
          
          this.runEnemyToPlayer(scene, el, player, TWEEN, playerClass)
        }

      }
      

    });
    

  }

  enemyIdle(scene, el, TWEEN) {
    

    el.userData.inBattle = false;
    
    let masNewPos = [];
      
      el.userData.path = [];

      let yPos = Math.trunc(Math.abs(el.position.y/worldMapClass.worldSettings.sizeOneBlock));
      let xPos = Math.trunc(Math.abs(el.position.x/worldMapClass.worldSettings.sizeOneBlock));
      
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

        delete worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/worldMapClass.worldSettings.sizeOneBlock))][Math.trunc(Math.abs(el.position.x/worldMapClass.worldSettings.sizeOneBlock))].enemy;
        

        new TWEEN.Tween(el.position).to( { x: newPath[0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2, y: -newPath[1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2 }, (el.userData.speed-1)*1000).start().onUpdate(()=>{
          //el.userData.enemyCanHealth = false;
        }).onComplete(()=>{
          el.userData.health += 10;
          if (el.userData.health>=el.userData.maxHealth) el.userData.health = el.userData.maxHealth
          //else el.userData.enemyCanHealth = true;
        })

        


        worldMapClass.worldMap[newPath[1]][newPath[0]].enemy = true;
      }

      
        el.userData.time = 0;


  }

  runEnemyToPlayer(scene, el, player, TWEEN, playerClass) {
    el.userData.inBattle = false;
    
    var grid = new PF.Grid(worldMapClass.worldMap[0].length, worldMapClass.worldMap.length); 
      
    worldMapClass.worldMap.forEach((n, i) => {
      n.forEach((b, j) => {
          if (worldMapClass.worldMap[i][j].map == '0' || worldMapClass.worldMap[i][j].enemy) {
            grid.setWalkableAt(j, i, false);
          }
      });
    });
    
    
    

    
    
    if (el.userData.enemyCanRun && el.position.distanceTo(player.position) > worldMapClass.worldSettings.sizeOneBlock+1) {
      
      el.userData.inBattle = false;
      
      el.userData.path = new PF.AStarFinder().findPath(Math.trunc(Math.abs(el.position.x/worldMapClass.worldSettings.sizeOneBlock)), Math.trunc(Math.abs(el.position.y/worldMapClass.worldSettings.sizeOneBlock)), Math.trunc(Math.abs(player.position.x/worldMapClass.worldSettings.sizeOneBlock)), Math.trunc(Math.abs(player.position.y/worldMapClass.worldSettings.sizeOneBlock)), grid);

      if (el.userData.path.length == 0) el.userData.enemyCanPath = false;

      let newPosition = el.userData.path[1];
      
      

      if (el.userData.path.length>0) {

        

        delete worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/worldMapClass.worldSettings.sizeOneBlock))][Math.trunc(Math.abs(el.position.x/worldMapClass.worldSettings.sizeOneBlock))].enemy;

        el.userData.enemyTween = new TWEEN.Tween(el.position).to( { x: el.userData.path[1][0] * worldMapClass.worldSettings.sizeOneBlock + worldMapClass.worldSettings.sizeOneBlock/2, y: -el.userData.path[1][1] * worldMapClass.worldSettings.sizeOneBlock - worldMapClass.worldSettings.sizeOneBlock/2 }, 1000);

        worldMapClass.worldMap[el.userData.path[1][1]][el.userData.path[1][0]].enemy = true;

        el.userData.enemyTween.start().onComplete(()=>{
          setTimeout(()=>{
            el.userData.enemyCanRun = true;
            el.userData.path = [];
            el.userData.enemyCanPath = false;
          }, 500)
          
        })
        el.userData.enemyTween.onUpdate(()=>{
          el.userData.enemyCanRun = false;
          el.userData.enemyCanPath = true;
        });
      }
      
      
      
      
    }
    else if (el.position.distanceTo(player.position) < worldMapClass.worldSettings.sizeOneBlock+1) {
      
      if (!el.userData.inBattle) playerClass.setPlayerInBattle(el);

      el.userData.inBattle = true;

      let enemyPunch;
      
    
      if (!el.userData.enemyCanPunch) enemyPunch = new TWEEN.Tween({enemyPower: 0}).to( {enemyPower: el.userData.maxEnemyPower}, 1000).start().onUpdate(()=>{
        //console.log('update');
        el.userData.enemyCanPunch = true;
      }).onComplete(()=>{
        //console.log('complite');
        playerClass.playerHealth -= el.userData.maxEnemyPower;
        playerClass.playerCanHealth = true;
        el.userData.enemyCanPunch = false;
      })

      if (el.userData.health <= 0) {
        
        playerClass.playerInBattle = false;
        delete worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/worldMapClass.worldSettings.sizeOneBlock))][Math.trunc(Math.abs(el.position.x/worldMapClass.worldSettings.sizeOneBlock))].enemy;
        scene.remove( el );
        
        el.userData.dead = true;
      }
    }
    
    

  }
  








}