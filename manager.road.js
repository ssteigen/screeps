var managerRoad = {

    run: function() {
        // Get all energy sources.
        var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        
        // Get all energy storage units.
        var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER ||
                    structure.structureType == STRUCTURE_LINK);
            }
        });
        
        // Get controller.
        var myController = Game.rooms['W8N3'].controller;
        targets.push(myController);
        
        // Calculate path between sources and targts.
        if (sources.length > 0 && targets.length > 0) {
            sources.forEach(function(origin){
                targets.forEach(function(goal){
                    var path = PathFinder.search(origin.pos, goal.pos);
                    // Mark each path as a road construction site.
                    path.path.forEach(function (cell) {
                        new RoomVisual('W8N3').text("x", cell.x, cell.y, {color: 'green', font: 0.8});
                        Game.rooms['W8N3'].createConstructionSite(cell.x, cell.y, STRUCTURE_ROAD);
                    });
                });
            }); 
        }
    }
};

module.exports = managerRoad;