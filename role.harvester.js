var roleCreep = require('role.creep');

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var roleHarvester = {

    getTargets: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        return targets;
    },

    getTargetId: function(creep) {
        var targets = roleHarvester.getTargets(creep);

        if (targets.length > 0) {
            targetIndex = Math.round(getRandomArbitrary(0, targets.length));
        }

        return targets[targetIndex].id;
    },

    getClosestLink: function (creep) {
        var link = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_LINK && structure.energy < structure.energyCapacity)
            }
        });

        return link;
    },

    run: function(creep) {

        if(typeof creep.memory.harvesting == 'undefined' || (!creep.memory.harvesting && creep.carry.energy == 0)) {
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
            creep.memory.sourceId = roleCreep.getSourceId(creep);
        }
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('🔋 store');
            creep.memory.targetId = roleHarvester.getTargetId(creep);
        }
        
        
         if(creep.memory.harvesting) {
            if (creep.carry.energy < creep.carryCapacity) {
                roleCreep.harvest(creep);
            }
        }
        else {
            var linkA = Game.getObjectById('ac4c1f69c0ebe2a');
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            var storage = Game.getObjectById('49602f5f2afd59c');
            
            if (linkA.energy < linkA.energyCapacity) {
                if(creep.transfer(linkA, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(linkA, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if(targets.length > 0) {
                var target = Game.getObjectById(creep.memory.targetId);
                
                if (!target || typeof target == 'undefined' || target.energy == target.energyCapacity) {
                    creep.memory.targetId = roleHarvester.getTargetId(creep);
                    console.log('get new target');
                }

                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if(storage.energy < storage.energyCapacity) {
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                roleCreep.rest(creep);
            }
        }
    }
};

module.exports = roleHarvester;
