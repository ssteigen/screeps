roleCreep = {
    
    getSourceIndex:function(creep) {
        // Find all sources.
        var sources = creep.room.find(FIND_SOURCES);
        
        // Choose a random one.
        return Math.round(Math.random(0, sources.length));
    },
    
    harvest:function(creep) {
        var sourceIndex = creep.memory.sourceIndex;
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[sourceIndex], {visualizePathStyle: {stroke: '#ffaa00'}});
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
