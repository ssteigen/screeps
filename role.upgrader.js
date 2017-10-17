var roleCreep = require('role.creep');

var roleUpgrader = {

    run: function(creep) {
        if(typeof creep.memory.upgrading == 'undefined' || (creep.memory.upgrading && creep.carry.energy == 0)) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
            creep.memory.sourceId = roleCreep.getSourceId(creep);
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var linkB = Game.getObjectById('c5ee2091a92a6e3');
            if (linkB.energy > 0) {
                roleCreep.withdraw(creep, linkB);
            }
            else {
                roleCreep.harvest(creep);
            }
        }
    }
};

module.exports = roleUpgrader;
