async function bfs(grid, start_cell, end_cell) {

    let queue = [];
    let visited = new Set();
    let previous = {};
  
    queue.push(start_cell);
    visited.add(start_cell);
  
    while (queue.length > 0) {
		
		let current_cell = queue.shift();
  
      	if (current_cell === end_cell) {
		
			return reconstruct_path(previous, end_cell);

      	}
  
		let neighbors = get_neighbors(grid, current_cell);

		for (let neighbor of neighbors) {

			if (!visited.has(neighbor) && neighbor['type'] != 'wall') {

				queue.push(neighbor);
				visited.add(neighbor);

				previous[grid.indexOf(neighbor)] = current_cell;
			
				if (neighbor != end_cell) {

					neighbor['type'] = 'visited';

					await sleep(0.1);

					draw();

				}

        	}

    	}

	}
  
	return null;
    
}
  
function get_neighbors(grid, cell) {

	let neighbors = [];
	let index = grid.indexOf(cell);

	if (index >= 30) {

		neighbors.push(grid[index - 30]);
		
	}

	if (index < 870) {

		neighbors.push(grid[index + 30]);
		
	}
 	
	if (index % 30 != 0) {

		neighbors.push(grid[index - 1]);
		
	}

	if (index % 30 != 29) {

		neighbors.push(grid[index + 1]);
		
	}

	return neighbors;
}
  
function reconstruct_path(previous, end_cell) {

    let path = [];
    let current_cell = end_cell;

    while (current_cell) {
      	
		path.push(current_cell);
      	current_cell = previous[grid.indexOf(current_cell)];

    }

    return path.reverse();

}
  
function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
	
}