var roleCreep = require('role.creep');

var roleHarvester = {

    run: function(creep) {
        
        if(typeof creep.memory.harvesting == 'undefined' || (!creep.memory.harvesting && creep.carry.energy == 0)) {
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
            creep.memory.sourceIndex = roleCreep.getSourceIndex(creep);
        }
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('🔋 store');
        }
        
        
         if(creep.memory.harvesting) {
            if (creep.carry.energy < creep.carryCapacity) {
                roleCreep.harvest(creep);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                roleCreep.rest(creep);
            }
        }
    }
};

module.exports = roleHarvester;
