const colors = {
	'path_color': '#181818',
	'wall_color': '#ff0080',
	'start_color': '#13c734',
	'end_color': '#d40d0d',
	'visited_color': '#f1b613',
	'solution_color': '#0EB8C4'
};

function generate_grid() {

    const grid = [];

    for (let y = 10; y < 630; y += 21) {

        for (let x = 10; x < 630; x += 21) {

            grid.push({x: x, y: y, width: 20, height: 20, type: 'path'});

        }

    }

    return grid;

}

const canvas = document.querySelector('.maze');
const ctx = canvas.getContext('2d');

var grid = generate_grid();

var selected_cell_type = 'wall';
var selected_algorithm = 'bfs';

var is_mouse_down = false;

var is_algorithm_running = false;

var solution = null;

var mouse_x_cordinate = 0;
var mouse_y_cordinate = 0;

var hovered_cell = null;
var hover_cell_index = 0;

var start_cell = grid[0];
var end_cell = grid[899];

start_cell['type'] = 'start';
end_cell['type'] = 'end';

function draw() {

    ctx.fillStyle = '#025fa2';
    ctx.fillRect(0, 0, 1000, 649);

    ctx.fillStyle = '#252525';
    ctx.fillRect(10, 10, 629, 629);

    ctx.fillStyle = '#181818';
    ctx.fillRect(649, 10, 341, 629);

    if (hovered_cell) {

        ctx.fillStyle = 'white';
        ctx.fillRect(hovered_cell.x - 1, hovered_cell.y - 1, hovered_cell.width + 2, hovered_cell.height + 2);

    }

    grid.forEach(cell => {

        ctx.fillStyle = colors[`${cell['type']}_color`];

        ctx.fillRect(cell.x, cell.y, cell.width, cell.height);

    });

    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`X : ${Math.round(mouse_x_cordinate)} Y : ${Math.round(mouse_y_cordinate)}`, 660, 35);

    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`GRID : ${hover_cell_index}`, 660, 65);

    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`Selected cell type : ${selected_cell_type} | press c`, 660, 110);

    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`Selected algorithm : ${selected_algorithm} | press x`, 660, 140);

    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`Solve the maze | press space`, 660, 185);
    
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`Reset the maze | press r`, 660, 215);

    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText(`Solution : ${solution}`, 660, 260);

}

function handle_mouse_move(event) {

    rect = canvas.getBoundingClientRect();

    const x = event.clientX;
    const y = event.clientY;

    mouse_x_cordinate = x;
    mouse_y_cordinate = y;

    const canvas_x = x - rect.left;
    const canvas_y = y - rect.top;

    cell = grid.find(cell => 

        (canvas_x >= cell.x) && (canvas_x < (cell.x + cell.width)) &&
        (canvas_y >= cell.y) && (canvas_y < (cell.y + cell.height))

    );

    if (cell) {

        hovered_cell = cell;

        hover_cell_index = grid.indexOf(cell) + 1;

        if (is_mouse_down) {

            if (selected_cell_type === 'start') {

                start_cell['type'] = 'path';
                start_cell = cell;

            }
            
            if (selected_cell_type === 'end') {

                end_cell['type'] = 'path';
                end_cell = cell;

            }

            if (cell['type'] != 'start' && cell['type'] != 'end') {

                cell['type'] = selected_cell_type;

            }

        }

    } else {

        hovered_cell = null;

    }

    draw();

}

function start_drawing() {

    is_mouse_down = true;
    
}

function stop_drawing() {

    is_mouse_down = false;
    
}

function cycle_selected_cell_type() {

    const types = ['wall', 'path', 'start', 'end'];

    const current_index = types.indexOf(selected_cell_type);

    selected_cell_type = types[(current_index + 1) % types.length];

    draw();

}

function cycle_selected_algorithm() {

    const types = ['bfs', 'dfs', 'a-star'];

    const current_index = types.indexOf(selected_algorithm);

    selected_algorithm = types[(current_index + 1) % types.length];

    draw();

}

function reset_grid() {

    grid.forEach(cell => {

        cell['type'] = 'path';

    });

    start_cell = grid[0];
    end_cell = grid[899];

    start_cell['type'] = 'start';
    end_cell['type'] = 'end';
    
    selected_cell_type = 'wall';
    selected_algorithm = 'bfs';

    draw();

}

function handle_keypress(event) {

    if (!is_algorithm_running) {

        if (event.key === 'c' || event.key === 'C') {
        
            cycle_selected_cell_type();
        }
    
        if (event.key === 'x' || event.key === 'X') {
            
            cycle_selected_algorithm();
        }
    
        if (event.key === 'r' || event.key === 'R') {
            
            reset_grid();
        }
    
        if (event.key == ' ') {

            is_algorithm_running = true;

            grid.forEach(cell => {
    
                if (cell['type'] === 'visited' || cell['type'] === 'solution') {
    
                    cell['type'] = 'path';
    
                }
    
            });
    
            if (selected_algorithm == 'bfs') {
    
                bfs(grid, start_cell, end_cell)
				
					.then(path => {

                    	if (path) {

                        	solution = 'solved';

							for (let i = 1; i < path.length - 1; i++) {
								
								path[i]['type'] = 'solution';
							}
						
						} else {
							
							solution = 'no solution';

						}

						is_algorithm_running = false;

						draw();

                });

            }
    
            if (selected_algorithm == 'dfs') {

                dfs(grid, start_cell, end_cell)
					
					.then(path => {

					if (path) {
						
						solution = 'solved';

						for (let i = 1; i < path.length - 1; i++) {

						path[i]['type'] = 'solution';

						}

					} else {
						
						solution = 'no solution';

					}

					is_algorithm_running = false;

					draw();

                });
            }

            if (selected_algorithm == 'a-star') {

                astar(grid, start_cell, end_cell)
				
					.then(path => {

					if (path) {

						solution = 'solved';

						for (let i = 1; i < path.length - 1; i++) {

						path[i]['type'] = 'solution';

						}

					} else {

						solution = 'no solution';

					}

					is_algorithm_running = false;

					draw();

				});
            }
    
        }
        
    }
        
}

draw();

document.addEventListener('mousemove', handle_mouse_move);
document.addEventListener('keypress', handle_keypress);
document.addEventListener('mousedown', start_drawing);
document.addEventListener('mouseup', stop_drawing);