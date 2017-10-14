var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var managerPopulation = require('manager.population');
var managerRoad = require('manager.road');

module.exports.loop = function () {

    
    
    // Manage population every 10 ticks.
    if(Game.time%10 == 0) {
        managerPopulation.run();
    }
    
    // Repair roads every 100 ticks.
    if(Game.time%100 == 0) {
        managerRoad.run();
    }
    
    // Display room energy.
    var energyAvailable = Game.rooms['W8N3'].energyAvailable;
    var energyCapacity = Game.rooms['W8N3'].energyCapacityAvailable;
    console.log('Energy: ' + energyAvailable + '/' + energyCapacity + ' (' + Math.round(energyAvailable/energyCapacity*100) + '%)');

    // Run tower.
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    // Run creeps.
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
