var ROW_LEN = 15
var COL_HEIGHT = 15
var NUMBER_OF_WALLS = 50;
var SOLVE_SPEED = 50;

var found = false;
var grid = []
var start = undefined

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


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
  grid[goal_i][goal_j] = "B"

  render_grid()
}


render_grid = () => {
  clear_grid()

  var main_div = document.getElementById("app");

  for(var i = 0; i < grid.length; i++ ) {
    var new_row = document.createElement("div")
    new_row.className = "row-container";
    main_div.appendChild(new_row)

    for(var j = 0; j < grid[i].length; j++){
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


mark_visited_bfs = (node, steps) => {
  var element = document.getElementById(node);

  if(found)
   element.classList.add(...["block-goal-found"]) 
  else
   element.classList.add(...["block-bfs-visited"])

  element.appendChild(document.createTextNode(steps))
}

check_neighbor = (shortestPath, memory, visited, next_node_i, next_node_j, current_node) => {
  var current_node_i = current_node[0]
  var current_node_j = current_node[1]
  
  if (next_node_i >= 0 && next_node_j >= 0 && next_node_j < ROW_LEN && next_node_i < COL_HEIGHT) {
    if (grid[next_node_i][next_node_j] != "#" && visited[next_node_i][next_node_j] === 0 && !found) {

      if(grid[next_node_i][next_node_j] === "B") {
        found = true
      }

      visited[next_node_i][next_node_j] = 1;
      shortestPath[next_node_i][next_node_j] = shortestPath[current_node_i][current_node_j]+1;
      mark_visited_bfs([next_node_i, next_node_j], shortestPath[current_node_i][current_node_j]+1)
      memory.push([next_node_i, next_node_j])
    }
  }
}

bfs = async () => {
  var memory = [];
  var visited = Array(COL_HEIGHT).fill().map(() => Array(ROW_LEN).fill(0));
  var shortestPath = Array(COL_HEIGHT).fill().map(() => Array(ROW_LEN).fill(null));

  memory.push(start);

  visited[start[0]][start[1]] = 1
  shortestPath[start[0]][start[1]] = 0;

  while(memory.length != 0) {
    var current_node = memory.shift()

    var next_node_i = current_node[0]+1
    var next_node_j = current_node[1]
    check_neighbor(shortestPath, memory, visited, next_node_i, next_node_j, current_node)
    await sleep(SOLVE_SPEED)

    var next_node_i = current_node[0]-1
    var next_node_j = current_node[1]
    check_neighbor(shortestPath, memory, visited, next_node_i, next_node_j, current_node)
    await sleep(SOLVE_SPEED)


    var next_node_i = current_node[0]
    var next_node_j = current_node[1]+1
    check_neighbor(shortestPath, memory, visited, next_node_i, next_node_j, current_node)
    await sleep(SOLVE_SPEED)


    var next_node_i = current_node[0]
    var next_node_j = current_node[1]-1
    check_neighbor(shortestPath, memory, visited, next_node_i, next_node_j, current_node)
    await sleep(SOLVE_SPEED)

    if(found) return;
  }
};



mark_visited_dfs = (node, steps, type) => {
  var element = document.getElementById(node);

  if(found) {
    if(type === "goal") {
      element.classList.add(...["block-goal-found"]) 
      element.appendChild(document.createTextNode(steps))
    } else {
      element.appendChild(document.createTextNode(steps))
    }
    return;
  }

  if(type == "dfs_path") {
    element.classList.add(...["block-dfs-path"])
  }
  
  if(type == "dfs_visited") {
    element.classList.add(...["block-dfs-visited"])
  }
}

calc_dfs = () => {
  var visited = Array(COL_HEIGHT).fill().map(() => Array(ROW_LEN).fill(0));
  dfs(start, 0, visited)
}

dfs = async (node, steps, visited) => {
  var node_i = node[0]
  var node_j = node[1]

  if(found) {
    return
  }

  if (node_i < 0 || node_j < 0 || node_i >= COL_HEIGHT || node_j >= ROW_LEN) {
    return
  }

  var symbol = grid[node_i][node_j]

  if (symbol === "B"){
    found = true
    mark_visited_dfs([node_i, node_j], steps, "goal")
    return
  }

  if (symbol === "#" || visited[node_i][node_j] === 1){
    return
  }

  await sleep(SOLVE_SPEED)

  visited[node_i][node_j] = 1;
  mark_visited_dfs([node_i, node_j], steps, "dfs_path")
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

  mark_visited_dfs([node_i, node_j], steps, "dfs_visited")
  steps--
}


clear_grid = () => {
  var main_div = document.getElementById("app")
  main_div.innerHTML = ''
  found = false
}


generate_grid()