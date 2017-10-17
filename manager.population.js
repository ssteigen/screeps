function calcBodyCost(body) {
    var cost = 0;
    
    body.forEach(function(part){
        cost += BODYPART_COST[part];
    });
    
    return cost;
}

function getCreepBody(maxCost) {

    var genericBuilds = [
        [
            WORK,
            CARRY,
            MOVE
        ],
        [
            WORK,
            CARRY, CARRY,
            MOVE
        ],
        [
            WORK,
            CARRY, CARRY,
            MOVE,  MOVE
        ],
        [
            WORK, WORK,
            CARRY,CARRY,
            MOVE, MOVE
        ],
        [
            WORK, WORK,
            CARRY,CARRY,CARRY,
            MOVE, MOVE
        ],
        [
            WORK, WORK,
            CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK,
            CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK,
            CARRY,CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK,
            CARRY,CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK,
            CARRY,CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK,
            CARRY,CARRY,CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK,
            CARRY,CARRY,CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK, WORK,
            CARRY,CARRY,CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK, WORK,
            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK, WORK,
            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        [
            WORK, WORK, WORK, WORK, WORK, WORK,
            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        // [
        //     WORK, WORK, WORK, WORK, WORK, WORK,
        //     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        //     MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        // ],
        // [
        //     WORK, WORK, WORK, WORK, WORK, WORK,
        //     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        //     MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        // ],
        // [
        //     WORK, WORK, WORK, WORK, WORK, WORK, WORK,
        //     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        //     MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        // ]
    ];

    genericBuilds.reverse();

    for (var index in genericBuilds) {
        genericBuild = genericBuilds[index];
        
        if (maxCost - calcBodyCost(genericBuild) >= 0) {
            console.log('build cost: ' + calcBodyCost(genericBuild));
            return genericBuild;
        }
        else {
            console.log('build cost: ' + calcBodyCost(genericBuild));
        }
    }
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
            builder: 1,
            harvester: 4,
            upgrader: 3,
            transporter: 1
        };
        
        var currentPopulation = {
            builder: countCreeps('builder'),
            harvester: countCreeps('harvester'),
            upgrader: countCreeps('upgrader'),
            transporter: countCreeps('transporter')
        }
        
        console.log(JSON.stringify(currentPopulation));

        // If there are zero of the current population, spawn the biggest creep possible right now.
        var energyAvailable = Game.rooms['W8N3'].energyAvailable;

        if(currentPopulation.harvester < 3) {
            spawnCreep('harvester', energyAvailable);
        }
        else if(currentPopulation.builder < 1) {
            spawnCreep('builder', energyAvailable);
        }
        else if(currentPopulation.upgrader < 1) {
            spawnCreep('upgrader', energyAvailable);
        }
        else if(currentPopulation.transporter < 1) {
            spawnCreep('transporter', energyAvailable);
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
        else if(currentPopulation.transporter < desiredPopulation.transporter) {
            spawnCreep('transporter', energyCapacity);
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