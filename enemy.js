import { WorldMapClass } from "./map.js"
import * as THREE from 'three';
import { randomIntFromInterval } from "./functions.js";
import { worldMapClass } from "./main.js";

export class Enemy {
  geometryEnemy = new THREE.BoxGeometry( 4, 4, 5 );
  materialEnemy = new THREE.MeshPhongMaterial( { color: 0x000000 } );
  enemy = new THREE.Mesh( this.geometryEnemy, this.materialEnemy );
  enemies = [];
  

  distanceToWatchPlayer = 50;
  

  

  addEnemy (scene, TWEEN){

    for (let i = 0; i < worldMapClass.worldSettings.sizeX; i++) {
      for (let j = 0; j < worldMapClass.worldSettings.sizeY; j++) {
        if (worldMapClass.worldMap[i][j].enemy) {
          let newEnemy = this.enemy.clone();

          newEnemy.userData.speed = 2+Math.random();
          newEnemy.userData.delta = 0;
          newEnemy.userData.time = 0;
          newEnemy.userData.clock = new THREE.Clock();

          newEnemy.userData.enemyCanRun = true;
          newEnemy.userData.enemyCanPath = false;
          newEnemy.userData.path = [];
          newEnemy.userData.enemyTween = new TWEEN.Tween;

          newEnemy.userData.inBattle = false;
          newEnemy.userData.enemyCanPunch = false;
          newEnemy.userData.health = 100;
          newEnemy.userData.maxHealth = 100;

          newEnemy.userData.enemyPower = 0;
          newEnemy.userData.maxEnemyPower = 5;

          newEnemy.userData.dead = false;


          newEnemy.position.set(worldMapClass.worldSettings.sizeOneBlock*j+worldMapClass.worldSettings.sizeOneBlock/2 ,-worldMapClass.worldSettings.sizeOneBlock*i-worldMapClass.worldSettings.sizeOneBlock/2,0);
          this.enemies.push(newEnemy);
          scene.add( newEnemy );
        }
      }
    }
        
  }

  


  idleEnemy(scene, enemies, TWEEN, player, playerClass) {
    


    let livesEnemies = enemies.filter((el) => !el.userData.dead);


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

            el.userData.path = new PF.AStarFinder().findPath(Math.trunc(Math.abs(el.position.x/10)), Math.trunc(Math.abs(el.position.y/10)), Math.trunc(Math.abs(player.position.x/10)), Math.trunc(Math.abs(player.position.y/10)), grid);
            
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
    
    
    

    
    
    if (el.userData.enemyCanRun && el.position.distanceTo(player.position) > 11) {
      
      el.userData.inBattle = false;
      
      el.userData.path = new PF.AStarFinder().findPath(Math.trunc(Math.abs(el.position.x/10)), Math.trunc(Math.abs(el.position.y/10)), Math.trunc(Math.abs(player.position.x/10)), Math.trunc(Math.abs(player.position.y/10)), grid);

      if (el.userData.path.length == 0) el.userData.enemyCanPath = false;

      let newPosition = el.userData.path[1];
      
      

      if (el.userData.path.length>0) {

        

        delete worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/10))][Math.trunc(Math.abs(el.position.x/10))].enemy;

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
    else if (el.position.distanceTo(player.position) < 11) {
      
      if (!el.userData.inBattle) playerClass.setPlayerInBattle(el);

      el.userData.inBattle = true;

      let enemyPunch;
      $('.enemy_health').fadeIn();
    
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
        $('.enemy_health').fadeOut();
        playerClass.playerInBattle = false;
        delete worldMapClass.worldMap[Math.trunc(Math.abs(el.position.y/10))][Math.trunc(Math.abs(el.position.x/10))].enemy;
        scene.remove( el );
        el.userData.dead = true;
      }
    }
    

  }
  








}