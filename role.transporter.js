var roleCreep = require('role.creep');

var roleTransporter = {

    getClosestLink: function (creep) {
        var link = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(structure) {
                return (structure.structureType == STRUCTURE_LINK && structure.energy < structure.energyCapacity)
            }
        });

        return link;
    },

    run: function(creep) {
        if(typeof creep.memory.transporting == 'undefined' || (!creep.memory.transporting && creep.carry.energy == 0)) {
            creep.memory.transporting = true;
            creep.say('🔄 harvest');
            creep.memory.sourceId = roleCreep.getSourceId(creep);
        }
        if(creep.memory.transporting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transporting = false;
            creep.say('🔋 store');
        }

        if(creep.memory.transporting) {
            if (creep.carry.energy < creep.carryCapacity) {
                roleCreep.harvest(creep);
            }
        }
        else {
            
            var linkA = Game.getObjectById('ac4c1f69c0ebe2a');
            var storage = Game.getObjectById('49602f5f2afd59c');
            
            if (linkA.energy < linkA.energyCapacity) {
                if(creep.transfer(linkA, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(linkA, {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleTransporter;
