'use strict';

/*
Apologies in advance for the total mess this code is in
The aim was to do it quickly, not well
*/

const Vec3 = require('vec3').Vec3;
const mcData = require('minecraft-data')('1.15.2')
const rand = require('random-seed')

const voxel = require('./map-data/voxel.json');
const special = require('./map-data/special.json');
const specialFn = require('./special.js');

const { 
  plain,
  mountain, hill, lake, 
  deciduous, evergreen, quarry, 
  desert, lush, sea,
  tarmac, pyramid, slimelake, dome, cube, pit, square, prism, speckle,
  wall
} = require('./terrain.js');

function generation ({ version = '1.15.2', seed } = {}) {
  // map width for actual land is 101
  // add an extra 16 chunks of sea around the world
  // const size = 117*6*16 // map width * tiles * chunk size
  const Chunk = require('prismarine-chunk')(version);
  const majorVersion = mcData.version.majorVersion;

  function generateSimpleChunk (chunkX, chunkY) {
    const chunk = new Chunk()
    const seedRand = rand.create(seed + ':' + chunkX + ':' + chunkY)
    let level = 80 - 15 - 30 + 8
    /*
    console.log("\nChunk request:")
    console.log("chunkX: " + chunkX.toString() + " chunkY: " + chunkY.toString())
    */
    const tileX = Math.floor(chunkX/6)
    const tileY = Math.floor(chunkY/6)
    //console.log("Chunk is in tile " + tileX.toString() + ", " + tileY.toString())
    let posX = chunkX % 6
    let posY = chunkY % 6
    if (posX < 0 ) { posX += 6 }
    if (posY < 0 ) { posY += 6 }
    // console.log("We want character at index " + ((posY * 6) + posX).toString())
    const tileKey = tileX.toString() + ":" + tileY.toString();
    const posKey = posX.toString() + ":" + posY.toString();
    let feature;
    let castleLvl = 0;
    let realm = 0;
    let fn;
    // if tile is not on map, use sea by default
    let tokenId = "0x2222222222222222222222222222222222222220"
    // if we are at the boundary, use grass plains with mountains at the edge
    if ((tileX === 57) || (tileX === -57) || (tileY === 57) || (tileY === -57)) {
      tokenId = "0x3333333333333333333333333333333333333333"
      if (tileY == -57) {
        tokenId = tokenId.slice(0,2) + "111111" + tokenId.slice(8);
      }
      if (tileY == 57) {
        tokenId = tokenId.slice(0,32) + "111111" + tokenId.slice(38);
      }
      if (tileX == 57) {
        for (let i = 0; i < 6; i++) {
          tokenId = tokenId.slice(0,7 + i*6) + "1" + tokenId.slice(8 + i*6);
        }
      }
      if (tileX == -57) {
        for (let i = 0; i < 6; i++) {
          tokenId = tokenId.slice(0,2 + i*6) + "1" + tokenId.slice(3 + i*6);
        }
      }
    }
    if (tileKey in voxel) {
      tokenId = voxel[tileKey][0];
    }

    if (tileKey in special) {
      // special features need flat land
      feature = special[tileKey].feature[((posY * 6) + posX)];
      fn = specialFn[special[tileKey].function]
    } else if (tileKey in voxel) {
      castleLvl = voxel[tileKey][2] % 8;
      realm = (voxel[tileKey][2] > 7) ? 1 : 0;
      // standard tile, but may contain a castle!
      feature = voxel[tileKey][0][((posY * 6) + posX) + 2];
      // castle
      if (((castleLvl > 0) && (realm === 0)) &&
      ((posX === 2) || (posX === 3)) &&
      ((posY === 2) || (posY === 3))) { feature = '#' }
      if (((castleLvl > 0) && (realm === 1)) &&
      ((posX === 2) || (posX === 3)) &&
      ((posY === 4) || (posY === 5))) { feature = '#' }
    } else if ((tileX === 58) || (tileX === -58) || (tileY === 58) || (tileY === -58)) {
      feature = "h";
    } else if (tokenId !== "0x2222222222222222222222222222222222222220") { // we have wall
      feature = tokenId[((posY * 6) + posX) + 2];
    } else {  // we have sea
      feature = "g"
    }
    //
    if (realm === 0) {
    // start with a plain
      plain(chunk, level, seedRand)
      // then put the required feature on top of it
      if (feature === "0") {  hill(chunk, level, seedRand, true) }; // lush hill
      if (feature === "1") {  mountain(chunk, level, seedRand, true) }; // lush mountain
      if (feature === "2") {  lake(chunk, seedRand) };
      if (feature === "3") { }; // plains - default terrain
      if (feature === "4") {  deciduous(chunk, level, seedRand) };
      if (feature === "5") {  lush(chunk, level, seedRand) }; // lush plains
      if (feature === "6") {  quarry(chunk, seedRand, true) };
      if (feature === "7") {  evergreen(chunk, level, seedRand) };
      if (feature === "8") {  hill(chunk, level, seedRand, false) }; // barren hill
      if (feature === "9") {  mountain(chunk, level, seedRand, false) }; // barren mountain
      if (feature === "a") {  lake(chunk, seedRand) };
      if (feature === "b") {  desert(chunk, seedRand, level, true) }; // desert plains
      if (feature === "c") {  deciduous(chunk, level, seedRand) };
      if (feature === "d") {  desert(chunk, seedRand, level, false) }; // badlands
      if (feature === "e") {  quarry(chunk, seedRand, false) }; // cobblestone quarry
      if (feature === "f") {  deciduous(chunk, level, seedRand) };
      if (feature === "g") {  sea(chunk, seedRand) };
      if (feature === "h") {  wall(chunk, seedRand) };
      if (feature === "#") {  
        specialFn['castle_' + castleLvl.toString()](chunk, level, seedRand, posX, posY) 
      } // we have a castle
    } else {
    // start with tarmac
      tarmac(chunk, level, seedRand)
      // then put the required feature on top of it
      if (feature === "0") {  cube(chunk, level, true) }; // lush hill
      if (feature === "1") {  pyramid(chunk, level, true) }; // lush mountain
      if (feature === "2") {  slimelake(chunk, seedRand) };
      if (feature === "3") {  square(chunk, level, true)}; // tarmac - default terrain
      if (feature === "4") {  dome(chunk, level, true) };
      if (feature === "5") {  speckle(chunk, level, seedRand, true) }; // lush plains
      if (feature === "6") {  pit(chunk, true) };
      if (feature === "7") {  prism(chunk, level, true) };
      if (feature === "8") {  cube(chunk, level) }; // barren hill
      if (feature === "9") {  pyramid(chunk, level, seedRand, false) }; // barren mountain
      if (feature === "a") {  slimelake(chunk, seedRand) };
      if (feature === "b") {  square(chunk, level, false) }; // desert plains
      if (feature === "c") {  dome(chunk, level, false) };
      if (feature === "d") {  speckle(chunk, level, seedRand, false) }; // badlands
      if (feature === "e") {  pit(chunk, false) }; // cobblestone quarry
      if (feature === "f") {  prism(chunk, level, false) };
      if (feature === "g") {  sea(chunk, seedRand) };
      if (feature === "h") {  wall(chunk, seedRand) };
      if (feature === "#") {  
        specialFn['castle_' + (castleLvl + 8).toString()](chunk, level, seedRand, posX, posY, tokenId) 
      } // we have a castle
    }
    if (fn) { 
      fn(chunk, level, seedRand, posX, posY, chunkX, chunkY)
    };

    return chunk
  }

  return generateSimpleChunk
}



module.exports = generation;
