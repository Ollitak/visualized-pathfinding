# visualized-pathfinding

Implementation and visualization of common pathfinding algorithms operating in a finite and randomized maze. Algorithms do not necessarily find the shortest route between the starting node and the goal node, as algorithms that simple aim to find any route are also implemented (e.g. [DFS](https://en.wikipedia.org/wiki/Depth-first_search)) 

Currently only the following algorithms are impemented, but more is to follow:
- [DFS](https://en.wikipedia.org/wiki/Depth-first_search)
- [BFS](https://en.wikipedia.org/wiki/Breadth-first_search)

At least to me, visualizing the execution of an algorithm helps a lot in comprehending its logic and effectively builds algorithmic thinking. Yet, even though the algorihm logic behind DFS and BFS is already quite clear to me, this project acts as a great outset for other pathfinding algorithms I am not familiar yet.

## How it works?
The program starts with generating a random grid of .'s (floor) and #'s (wall), which is then rendered in browser DOM as div-blocks. When user selects an algorithm, algorithm starts to operate and on each processed node, the DOM is manipulated accordinly to visualize the algorithm's logic. 

Program is coded in JavaScript and visualization is done in html+css. Currently, all the script code is packed in a single .js file (app.js). Feel free to modify the global constants defined in the beginning of .js file in order to try out e.g. different maze sizes.

## How to run it?
Test it here: https://ollitak.github.io/visualized-pathfinding/

OR 

Clone the project repository and simply open the .html in browser. Make sure that the browser can successfully access .js and .css files.

You can also use, for example, any local development server to open the project in localhost.

**Notice that clicking "RESET" during the execution does not currently work as intended. If you want to stop the execution, please refresh the page.**
