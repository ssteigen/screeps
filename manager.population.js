function calcBodyCost(body) {
    var cost = 0;
    
    body.forEach(function(part){
        cost += BODYPART_COST[part];
    });
    
    return cost;
}

function getCreepBody(maxCost) {

    var lvl1 = [
        WORK,
        CARRY,
        MOVE
    ];
    
    var lvl2 = [
        WORK,
        CARRY,CARRY,
        MOVE
    ];

    var lvl3 = [
        WORK,
        CARRY,CARRY,
        MOVE, MOVE
    ];

    var lvl4 = [
        WORK, WORK,
        CARRY,CARRY,
        MOVE, MOVE
    ];

    var lvl5 = [
        WORK, WORK,
        CARRY,CARRY,CARRY,
        MOVE, MOVE
    ];

    var lvl6 = [
        WORK, WORK,
        CARRY,CARRY,CARRY,
        MOVE, MOVE, MOVE
    ];

    var lvl7 = [
        WORK, WORK, WORK,
        CARRY,CARRY,CARRY,
        MOVE, MOVE, MOVE
    ];

    var lvl8 = [
        WORK, WORK, WORK,
        CARRY,CARRY,CARRY,CARRY,
        MOVE, MOVE, MOVE
    ];

    var lvl9 = [
        WORK, WORK, WORK,
        CARRY,CARRY,CARRY,CARRY,
        MOVE, MOVE, MOVE, MOVE
    ];

    var lvl10 = [
        WORK, WORK, WORK, WORK,
        CARRY,CARRY,CARRY,CARRY,
        MOVE, MOVE, MOVE, MOVE
    ];
    
    
    var body;
    
    switch (true) {
        case (maxCost - calcBodyCost(lvl10) >= 0):
            body = lvl10;
            break;
        case (maxCost - calcBodyCost(lvl9) >= 0):
            body = lvl9;
            break;
        case (maxCost - calcBodyCost(lvl8) >= 0):
            body = lvl8;
            break;
        case (maxCost - calcBodyCost(lvl7) >= 0):
            body = lvl7;
            break;
        case (maxCost - calcBodyCost(lvl6) >= 0):
            body = lvl6;
            break;
        case (maxCost - calcBodyCost(lvl5) >= 0):
            body = lvl5;
            break;
        case (maxCost - calcBodyCost(lvl4) >= 0):
            body = lvl4;
            break;
        case (maxCost - calcBodyCost(lvl3) >= 0):
            body = lvl3;
            break;
        case (maxCost - calcBodyCost(lvl2) >= 0):
            body = lvl2;
            break;
        default:
            body = lvl1;
            break;
    }

    return body;
}

function spawnCreep(role, maxCost) {
    var newName = role + Game.time;
    
    console.log('Spawing new ' + role + ': ' + newName);
    
    body = getCreepBody(maxCost);
    
    Game.spawns['Spawn1'].spawnCreep(body, newName, {memory: {role: role}});
}

function countCreeps(role) {
    var numCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    return numCreeps.length;
}

function clearDeadCreepMemory() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

var managerPopulation = {

    run: function() {
        
        // Clear dead-creep memory.
        clearDeadCreepMemory();
        
        var desiredPopulation = {
            builder: 5,
            harvester: 3,
            upgrader: 8
        };
        
        var currentPopulation = {
            builder: countCreeps('builder'),
            harvester: countCreeps('harvester'),
            upgrader: countCreeps('upgrader')
        }
        
        console.log(JSON.stringify(currentPopulation));

        // If there are zero of the current population, spawn the biggest creep possible right now.
        var energyAvailable = Game.rooms['W8N3'].energyAvailable;

        if(currentPopulation.harvester < 2) {
            spawnCreep('harvester', energyAvailable);
        }
        else if(currentPopulation.builder < 1) {
            spawnCreep('builder', energyAvailable);
        }
        else if(currentPopulation.upgrader < 1) {
            spawnCreep('upgrader', energyAvailable);
        }

        // Otherwise, spawn the highest level.
        var energyCapacity = Game.rooms['W8N3'].energyCapacityAvailable;

        if(currentPopulation.harvester < desiredPopulation.harvester) {
            spawnCreep('harvester', energyCapacity);
        }
        else if(currentPopulation.builder < desiredPopulation.builder) {
            spawnCreep('builder', energyCapacity);
        }
        else if(currentPopulation.upgrader < desiredPopulation.upgrader) {
            spawnCreep('upgrader', energyCapacity);
        }
    
        // Spawn new creep.
        if(Game.spawns['Spawn1'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                {align: 'left', opacity: 0.8}
            );
        }
    }
};

module.exports = managerPopulation;