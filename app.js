var ROW_LEN = 25
var COL_HEIGHT = 25
var NUMBER_OF_WALLS = 50;
var SOLVE_SPEED = 0; // Lower the value, faster the solve speed
var DFS_INCREMENT = 50; // Constant to equalize solve speed of DFS and BFS, do not touch
var BACKTRACKING_SPEED = 50; // Path is visualized by backtracking after the path is solved

var found = false;
var grid = []
var start = undefined
var goal = undefined


// Asyncronous sleep call to help with visualization
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


// Generates a grid where # denotes walls, A denotes starting point and B denotes the goal
generate_grid = () => {
  grid = Array(COL_HEIGHT).fill().map(() => Array(ROW_LEN).fill("."));

  for (var i = 0; i < NUMBER_OF_WALLS; i++) {
    var randomized_i = Math.floor(Math.random() * COL_HEIGHT);
    var randomized_j = Math.floor(Math.random() * ROW_LEN);
    grid[randomized_i][randomized_j] = "#"
  }

  var start_i = Math.floor(Math.random() * COL_HEIGHT);
  var start_j = Math.floor(Math.random() * ROW_LEN);
  start = [start_i, start_j]
  grid[start_i][start_j] = "A"

  var goal_i = Math.floor(Math.random() * COL_HEIGHT);
  var goal_j = Math.floor(Math.random() * ROW_LEN);
  goal = [goal_i, goal_j]
  grid[goal_i][goal_j] = "B"

  render_grid()
}


// Renders the grid visualization by creating styled div-elements based on the grid symbols
render_grid = () => {
  clear_grid()

  var main_div = document.getElementById("app");

  for (var i = 0; i < grid.length; i++ ) {
    var new_row = document.createElement("div")
    new_row.className = "row-container";
    main_div.appendChild(new_row)

    for (var j = 0; j < grid[i].length; j++){
      var new_block = document.createElement("div")
      new_block.setAttribute("id", [i,j])
     
      switch(grid[i][j]){
        case "#":
          new_block.classList.add(...["block", "block-wall"])
          //new_block.appendChild(document.createTextNode("W"))
          break
        case "A":
          new_block.classList.add(...["block", "block-start"]) 
          //new_block.appendChild(document.createTextNode("A"))
          break
        case "B":
          new_block.classList.add(...["block", "block-goal"]) 
          //new_block.appendChild(document.createTextNode("B"))
          break
        case ".":
          new_block.classList.add(...["block", "block-unvisited"])         
          break
      }
      new_row.appendChild(new_block)
    }
  }
}


// Function to re-style the nodes when accessed by the BFS algorithm
render_node_bfs = (node, steps) => {
  var element = document.getElementById(node);

  if (found) {
    element.classList.add(...["block-goal-found"])
    element.appendChild(document.createTextNode(steps))
  } else {
    element.classList.add(...["block-bfs-visited"])
  }
}

// Utility function for BFS:
// 1) Ensures that the next node is not out of bounds nor wall
// 2) If not, marks the node visited and determines its shortest path (previous node + 1)
// 3) Visualizes the node in HTML using render_node_bfs()
// 4) Pushes the node to the memory structure required by the BFS algorithm
// 5) Checks if the node is goal (symbol B)
check_neighbor = (shortest_path, memory, visited, next_node_i, next_node_j, current_node) => {
  if (found) return;
 
  if (next_node_i >= 0 && next_node_j >= 0 && next_node_j < ROW_LEN && next_node_i < COL_HEIGHT) {
    if (grid[next_node_i][next_node_j] != "#" && visited[next_node_i][next_node_j] === 0) {
      visited[next_node_i][next_node_j] = 1;
      shortest_path[next_node_i][next_node_j] = shortest_path[current_node[0]][current_node[1]]+1;
      render_node_bfs([next_node_i, next_node_j])
      memory.push([next_node_i, next_node_j])

      if (grid[next_node_i][next_node_j] === "B") {
        found = true
      }
    }
  }
}

// Basic BFS algorithm with 3 utility data structures: memory for to-be-processed nodes, grid
// for marking visited nodes and a grid for marking the shortest paths for each processed node.
// When the goal is found, a global variable "found" is set to true, after which no more nodes
// are added to the memory and backtracking function is called to visualize the shortes path.
bfs = async () => {
  var memory = [];
  var visited = Array(COL_HEIGHT).fill().map(() => Array(ROW_LEN).fill(0));
  var shortest_path = Array(COL_HEIGHT).fill().map(() => Array(ROW_LEN).fill(null));

  memory.push(start);

  visited[start[0]][start[1]] = 1
  shortest_path[start[0]][start[1]] = 0;

  while (memory.length != 0) {
    var current_node = memory.shift()

    var next_node_i = current_node[0]+1
    var next_node_j = current_node[1]
    check_neighbor(shortest_path, memory, visited, next_node_i, next_node_j, current_node)
    await sleep(SOLVE_SPEED)

    var next_node_i = current_node[0]-1
    var next_node_j = current_node[1]
    check_neighbor(shortest_path, memory, visited, next_node_i, next_node_j, current_node)
    await sleep(SOLVE_SPEED)


    var next_node_i = current_node[0]
    var next_node_j = current_node[1]+1
    check_neighbor(shortest_path, memory, visited, next_node_i, next_node_j, current_node)
    await sleep(SOLVE_SPEED)


    var next_node_i = current_node[0]
    var next_node_j = current_node[1]-1
    check_neighbor(shortest_path, memory, visited, next_node_i, next_node_j, current_node)
    await sleep(SOLVE_SPEED)

    if (found) {
      backtrack_shortest_path_bfs(shortest_path)
      return
    }
  }
}

// Visualizes the shortest path after BFS has found the goal. Starts backtracking from the goal and
// moves towards the starting point by on each turn visualizing the shortest path to each node.
// At each node the adjacent nodes are checked and if the shortest path to the adjacent node is one
// less, it has to a part of the shortest path.
backtrack_shortest_path_bfs = async (shortest_path) => {
  var current_node_i = goal[0]
  var current_node_j = goal[1]
  
  var steps_remaining = shortest_path[goal[0]][goal[1]]
  var step_found = false;

  render_node_bfs([current_node_i, current_node_j], steps_remaining)

  while (steps_remaining > 0) {
    await sleep(BACKTRACKING_SPEED)
    steps_remaining--

    if (!step_found && current_node_i+1 < COL_HEIGHT){
      if (shortest_path[current_node_i+1][current_node_j] === steps_remaining){
        current_node_i = current_node_i+1
        render_node_bfs([current_node_i, current_node_j], steps_remaining)
        step_found = true;
      }
    }

    if (!step_found && current_node_i-1 >= 0){
      if (shortest_path[current_node_i-1][current_node_j] === steps_remaining){
        current_node_i = current_node_i-1
        render_node_bfs([current_node_i, current_node_j], steps_remaining)
        step_found = true;
      }
    }
    
    if (!step_found && current_node_j+1 < ROW_LEN){
      if (shortest_path[current_node_i][current_node_j+1] === steps_remaining){
        current_node_j = current_node_j+1
        render_node_bfs([current_node_i, current_node_j], steps_remaining)
        step_found = true;
      }
    }

    if (!step_found && current_node_j-1 >= 0){
      if (shortest_path[current_node_i][current_node_j-1] === steps_remaining){
        current_node_j = current_node_j-1
        render_node_bfs([current_node_i, current_node_j], steps_remaining)
        step_found = true;
      }
    }

    step_found = false;
  }
}


// Function to re-style the nodes when accessed by the DFS algorithm
render_node_dfs = (node, steps, type) => {
  var element = document.getElementById(node);

  if (found) {
    element.classList.add(...["block-goal-found"]) 
    element.appendChild(document.createTextNode(steps))
    return;
  }

  if (type === "dfs_path") {
    element.classList.add(...["block-dfs-path"])
  }
  
  if (type == "dfs_visited") {
    element.classList.add(...["block-dfs-visited"])
  }
}

calc_dfs = () => {
  var visited = Array(COL_HEIGHT).fill().map(() => Array(ROW_LEN).fill(0));
  dfs(start, 0, visited)
}

// Recursive DFS algorithm aiming to find one path to goal, which likely isn't the shortest path.
// When the goal node is found, a global variable "found" is set to true, after which recursion
// stops and falls back.
dfs = async (node, steps, visited) => {
  var node_i = node[0]
  var node_j = node[1]

  if (found) {
    return
  }

  if (node_i < 0 || node_j < 0 || node_i >= COL_HEIGHT || node_j >= ROW_LEN) {
    return
  }

  var symbol = grid[node_i][node_j]

  if (symbol === "B"){
    found = true
    render_node_dfs([node_i, node_j], steps, "goal")
    return
  }

  if (symbol === "#" || visited[node_i][node_j] === 1){
    return
  }

  await sleep(SOLVE_SPEED+DFS_INCREMENT)

  visited[node_i][node_j] = 1;
  render_node_dfs([node_i, node_j], steps, "dfs_path")
  steps++


  var next_node_i = node_i+1
  var next_node_j = node_j
  await dfs([next_node_i, next_node_j], steps, visited)

  var next_node_i = node_i-1
  var next_node_j = node_j
  await dfs([next_node_i, next_node_j], steps, visited)


  var next_node_i = node_i
  var next_node_j = node_j+1
  await dfs([next_node_i, next_node_j], steps, visited)

  var next_node_i = node_i
  var next_node_j = node_j-1
  await dfs([next_node_i, next_node_j], steps, visited)

  steps--

  // When found is set to true, sleep is applied to slow down the backtracking visualization
  if (found) await sleep(BACKTRACKING_SPEED)

  // Function call is reached either when recursion ends on the processed node (path cannot be 
  // found and node is set to red) or when goal is found and recursion falls back (visualizes
  // the amount of steps taken on each node)
  render_node_dfs([node_i, node_j], steps, "dfs_visited")
}


clear_grid = () => {
  var main_div = document.getElementById("app")
  main_div.innerHTML = ''
  found = false
}

generate_grid()