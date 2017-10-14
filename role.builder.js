var roleCreep = require('role.creep');

var roleBuilder = {

    run: function(creep) {
        
        if(typeof creep.memory.building == 'undefined' || (creep.memory.building && creep.carry.energy == 0)) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
            creep.memory.sourceIndex = roleCreep.getSourceIndex(creep);
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            
            // Sort construction sites by progress.
            targets.sort(function(a, b){
                return b.progress - a.progress;
            });

            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                roleCreep.rest(creep);
            }
        }
        else {
            roleCreep.harvest(creep);
        }
    }
};

module.exports = roleBuilder;
