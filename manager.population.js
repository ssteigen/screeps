function spawnCreep(role) {
    var newName = role + Game.time;
    
    console.log('Spawing new ' + role + ': ' + newName);
    
    var energyCapacity = Game.rooms['W8N3'].energyCapacityAvailable;
    
    var lvl1 = [WORK,CARRY,MOVE] // 100 + 50 + 50 = 200
    var lvl2 = [WORK,CARRY,CARRY,MOVE] // 200 + 50 = 250
    var lvl3 = [WORK,CARRY,CARRY,MOVE,MOVE] // 250 + 50 = 300
    var lvl4 = [WORK,WORK,CARRY,CARRY,MOVE,MOVE] // 300 + 100 = 400
    var lvl5 = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE] // 400 + 50 = 450
    var lvl6 = [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE] // 450 + 50 = 500
    var lvl7 = [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE] // 500 + 100 = 600
    var lvl8 = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE] // 600 + 50 = 650
    var lvl9 = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE] // 650 + 50 = 700
    
    var body;
    
    switch (true) {
        case (energyCapacity - 700 >= 0):
            body = lvl9;
            break;
        case (energyCapacity - 650 >= 0):
            body = lvl8;
            break;
        case (energyCapacity - 600 >= 0):
            body = lvl7;
            break;
        case (energyCapacity - 500 >= 0):
            body = lvl6;
            break;
        case (energyCapacity - 450 >= 0):
            body = lvl5;
            break;
        case (energyCapacity - 400 >= 0):
            body = lvl4;
            break;
        case (energyCapacity - 300 >= 0):
            body = lvl3;
            break;
        case (energyCapaity - 250 >= 0):
            body = lvl2;
            break;
        default:
            body = lvl1;
            break;
    }
   
    
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
        
        // console.log(JSON.stringify(desiredPopulation));
        console.log(JSON.stringify(currentPopulation));
        
        if(currentPopulation.builder < desiredPopulation.builder) {
            spawnCreep('builder');
        }
        if(currentPopulation.harvester < desiredPopulation.harvester) {
            spawnCreep('harvester');
        }
        if(currentPopulation.upgrader < desiredPopulation.upgrader) {
            spawnCreep('upgrader');
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