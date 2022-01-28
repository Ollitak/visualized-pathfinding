const nodes = [
  ["#","#","#","#","#","#","#","#","#","#"],
  ["#",".",".",".",".","#",".",".",".","#"],
  ["#",".",".",".",".",".",".","#",".","#"],
  ["#",".",".",".",".","B",".",".",".","#"],
  ["#",".",".","#",".",".",".",".",".","#"],
  ["#",".",".",".","#",".",".",".",".","#"],
  ["#","A",".",".",".","#","#",".",".","#"],
  ["#",".",".",".",".",".",".",".",".","#"],
  ["#",".","#",".",".",".",".",".",".","#"],
  ["#","#","#","#","#","#","#","#","#","#"],
]

var start = [6,1]
var rowLen = nodes[0].length 
var colHeight = nodes.length

render_nodes = () => {
  var main_div = document.getElementById("app");

  for(var i = 0; i < nodes.length; i++ ) {
    var new_row = document.createElement("div")
    new_row.className = "container";
    main_div.appendChild(new_row)

    for(var j = 0; j < nodes[i].length; j++){
      var new_block = document.createElement("div")
      new_block.setAttribute("id", [i,j])
     
      switch(nodes[i][j]){
        case "#":
          new_block.classList.add(...["block", "block-wall"])
          new_block.appendChild(document.createTextNode("W"))
          break
        case "A":
          new_block.classList.add(...["block", "block-character"]) 
          new_block.appendChild(document.createTextNode("A"))
          break
        case "B":
          new_block.classList.add(...["block", "block-goal"]) 
          new_block.appendChild(document.createTextNode("B"))
          break
        case ".":
          new_block.classList.add(...["block", "block-unvisited"])         
          break
      }
      new_row.appendChild(new_block)
    }
  }
}


mark_visited = (node, value) => {
  var element = document.getElementById(node);
  element.classList.add(...["block-visited"])
  element.appendChild(document.createTextNode(value))
}


bfs = () => {
  var memory = [];
  var visited = Array(colHeight).fill().map(() => Array(rowLen).fill(0));
  var shortestPath = Array(colHeight).fill().map(() => Array(rowLen).fill(999));

  memory.push(start);
  visited[start[0]][start[1]] = 1
  shortestPath[start[0]][start[1]] = 0;

  while(memory.length != 0) {
    var current_node = memory.shift()

    var next_node_i = current_node[0]+1
    var next_node_j = current_node[1]
    check_neighbor(shortestPath, memory, visited, next_node_i, next_node_j, current_node)

    var next_node_i = current_node[0]-1
    var next_node_j = current_node[1]
    check_neighbor(shortestPath, memory, visited, next_node_i, next_node_j, current_node)


    var next_node_i = current_node[0]
    var next_node_j = current_node[1]+1
    check_neighbor(shortestPath, memory, visited, next_node_i, next_node_j, current_node)


    var next_node_i = current_node[0]
    var next_node_j = current_node[1]-1
    check_neighbor(shortestPath, memory, visited, next_node_i, next_node_j, current_node)
  }
};


check_neighbor = (shortestPath, memory, visited, next_node_i, next_node_j, current_node) => {
  var current_node_i = current_node[0]
  var current_node_j = current_node[1]
  
  if (next_node_i >= 0 && next_node_j >= 0 && next_node_j < rowLen && next_node_i < colHeight) {
    if (nodes[next_node_i][next_node_j] != "#" && visited[next_node_i][next_node_j] == 0) {
      visited[next_node_i][next_node_j] = 1;
      shortestPath[next_node_i][next_node_j] = shortestPath[current_node_i][current_node_j]+1;
      mark_visited([next_node_i, next_node_j], shortestPath[current_node_i][current_node_j]+1)
      memory.push([next_node_i, next_node_j])
    }
  }
}


unsolve = () => {
  var main_div = document.getElementById("app")
  main_div.innerHTML = ''
  render_nodes()
}


render_nodes()