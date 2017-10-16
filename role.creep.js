roleCreep = {
    // Get all sources.
    getSources:function(creep) {
        return creep.room.find(FIND_SOURCES);
    },

    // Get the ID of a random source.
    getSourceId:function(creep) {
        var sources = roleCreep.getSources(creep);
        var sourceIndex = Math.round(Math.random(0, sources.length));

        return sources[sourceIndex].id;
    },
    

    withdraw:function(creep, source) {
        if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },

    // Harvest energy from a source.
    harvest:function(creep, source) {
        // If a source is not provided, check the creep's memory.
        if (typeof source == 'undefined') {
            source = Game.getObjectById(creep.memory.sourceId);
        }

        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },
    
    rest:function(creep) {
        creep.say('rest');
        var flags = creep.room.find(FIND_FLAGS);
        
        if (flags.length > 0) {
            creep.moveTo(flags[0], {visualizePathStyle: {stroke: '#ffffff'}});    
        }
    }
};

module.exports = roleCreep;
