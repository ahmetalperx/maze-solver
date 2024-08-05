async function astar(grid, start_cell, end_cell) {

    let open_set = new Set();
    let closed_set = new Set();

    let came_from = {};
    let g_score = {};
    let f_score = {};
  
    for (let cell of grid) {

        g_score[grid.indexOf(cell)] = Infinity;
        f_score[grid.indexOf(cell)] = Infinity;

    }
  
    g_score[grid.indexOf(start_cell)] = 0;
    f_score[grid.indexOf(start_cell)] = heuristic(start_cell, end_cell);

    open_set.add(start_cell);
  
    while (open_set.size > 0) {

        let current_cell = get_lowest_f_score_cell(open_set, f_score);

        if (current_cell == end_cell) {

            return reconstruct_path(came_from, end_cell);

        }
  
        open_set.delete(current_cell);
        closed_set.add(current_cell);
  
        let neighbors = get_neighbors(grid, current_cell);

        for (let neighbor of neighbors) {

			if (closed_set.has(neighbor) || neighbor['type'] == 'wall') {

				continue;

			}
  
        let tentative_g_score = g_score[grid.indexOf(current_cell)] + 1;

        if (!open_set.has(neighbor) || tentative_g_score < g_score[grid.indexOf(neighbor)]) {

            came_from[grid.indexOf(neighbor)] = current_cell;
            g_score[grid.indexOf(neighbor)] = tentative_g_score;
          	f_score[grid.indexOf(neighbor)] = tentative_g_score + heuristic(neighbor, end_cell);
  
          	if (!open_set.has(neighbor)) {

            	open_set.add(neighbor);
  
            if (neighbor != end_cell) {

              	neighbor['type'] = 'visited';

				await sleep(0.1);
				draw();
            }

          }

        }

      }

    }
  
	return null;
 
}
  
function get_lowest_f_score_cell(open_set, f_score) {

    let lowest_f_score_cell = null;
    let lowest_f_score = Infinity;
  
    for (let cell of open_set) {

      	let index = grid.indexOf(cell);
      	
		if (f_score[index] < lowest_f_score) {

        	lowest_f_score_cell = cell;
        	lowest_f_score = f_score[index];
      	}
    }
  
    return lowest_f_score_cell;

}
  
function heuristic(cell_a, cell_b) {

    return Math.abs(cell_a.x - cell_b.x) + Math.abs(cell_a.y - cell_b.y);

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