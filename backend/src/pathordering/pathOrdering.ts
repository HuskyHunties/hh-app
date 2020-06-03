/* eslint-disable @typescript-eslint/no-use-before-define */
import { Graph, Edge, ClueNode } from "./classes";

const locsSmall = [
  { id: 1, lat: 14, long: 11 },
  { id: 2, lat: -15, long: 41 },
  { id: 3, lat: -49, long: 45 },
  { id: 4, lat: -19, long: 25 },
  { id: 5, lat: -32, long: 31 },
  { id: 6, lat: 13, long: 16 },
];

const locsMedium = [
  { id: 1, lat: 14, long: 11 },
  { id: 2, lat: -15, long: 41 },
  { id: 3, lat: -49, long: 45 },
  { id: 4, lat: -19, long: 25 },
  { id: 5, lat: -32, long: 31 },
  { id: 6, lat: 13, long: 16 },
  { id: 7, lat: -45, long: 21 },
  { id: 8, lat: -20, long: -40 },
  { id: 9, lat: -46, long: 49 },
  { id: 10, lat: 32, long: 24 },
  { id: 11, lat: -8, long: -21 },
  { id: 12, lat: -35, long: 12 },
  { id: 13, lat: 26, long: 39 },
  { id: 14, lat: 42, long: 22 },
  { id: 15, lat: 27, long: 43 },
];
const locsBig = [
  { id: 1, lat: 14, long: 11 },
  { id: 2, lat: -15, long: 41 },
  { id: 3, lat: -49, long: 45 },
  { id: 4, lat: -19, long: 25 },
  { id: 5, lat: -32, long: 31 },
  { id: 6, lat: 13, long: 16 },
  { id: 7, lat: -45, long: 21 },
  { id: 8, lat: -20, long: -40 },
  { id: 9, lat: -46, long: 49 },
  { id: 10, lat: 32, long: 24 },
  { id: 11, lat: -8, long: -21 },
  { id: 12, lat: -35, long: 12 },
  { id: 13, lat: 26, long: 39 },
  { id: 14, lat: 42, long: 22 },
  { id: 15, lat: 27, long: 43 },
  { id: 16, lat: 31, long: 2 },
  { id: 17, lat: -14, long: -11 },
  { id: 18, lat: 15, long: -41 },
  { id: 19, lat: 49, long: -45 },
  { id: 20, lat: 19, long: -25 },
  { id: 21, lat: 32, long: -31 },
  { id: 22, lat: -13, long: -16 },
  { id: 23, lat: 45, long: -21 },
  { id: 24, lat: 20, long: 40 },
  { id: 25, lat: 46, long: -49 },
  { id: 26, lat: -32, long: -24 },
  { id: 27, lat: 8, long: 21 },
  { id: 28, lat: 35, long: -12 },
  { id: 29, lat: -26, long: -39 },
  { id: 30, lat: -42, long: -22 },
  { id: 31, lat: -27, long: -43 },
  { id: 32, lat: -31, long: -2 },
];

/**
 * @returns - clue IDS in their order in the path
 * @param  locations - a list of ClueNodes
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function orderPath(locations: ClueNode[], startingID: number): number[] {
  const MST = makeMST(locations);
  const MSTEdges = MST.edges;
  const degreeMap = getDegrees(MST);
  // set of all the nodes with odd degree
  const oddDegreeNodes: ClueNode[] = [];
  MST.nodes.forEach((node) => {
    if (degreeMap.get(node) % 2 === 1) {
      oddDegreeNodes.push(node);
    }
  });
  const matching: Graph = makeMatching(oddDegreeNodes);
  const matchingEdges = matching.edges;
  console.log("MST");
  console.log(MST.display());
  console.log("Matching");
  console.log(matching.display());

  //finding the union of the edges in the MST and the matching
  const sharedEdges: Edge[] = [];
  MSTEdges.forEach((edge) => {
    sharedEdges.push(edge);
  });
  matchingEdges.forEach((edge) => {
    sharedEdges.push(edge);
  });

  //subgraph with shared edges
  const subgraph: Graph = new Graph();
  sharedEdges.forEach((edge) => {
    const node1 = edge.from;
    const node2 = edge.to;

    subgraph.addEdge(node1, node2);
    if (!subgraph.nodes.includes(node1)) subgraph.addNode(node1);
    if (!subgraph.nodes.includes(node2)) subgraph.addNode(node2);
  });

  console.log("Subgraph");
  console.log(subgraph.display());

  const orderedEdges = orderEdges(subgraph.edges, startingID);
  const orderedIDs = getOrderOfIDs(orderedEdges, startingID);
  // console.log("Ordered Edges");
  // console.log(orderedEdges);
  return orderedIDs;
}

// returns a list of numbers representing the order in which the ids occur in the
// given list of edges, starting with the given id
function getOrderOfIDs(edges: Edge[], startingID: number): number[] {
  const duplicateEdges = edges.slice();
  const orderedIDS: number[] = [startingID];

  let currentID = startingID;
  let edge;
  while (orderedIDS.length < edges.length) {
    edge = duplicateEdges.shift();

    if (edge.from.id === currentID) {
      currentID = edge.to.id;
    } else if (edge.to.id === currentID) {
      currentID = edge.from.id;
    }

    orderedIDS.push(currentID);
  }

  return orderedIDS;
}
// returns a list of edges, in the order they appear in the round trip, starting at the
// specified clue
function orderEdges(edges: Edge[], startingID: number): Edge[] {
  const edgesToBeOrdered = edges.slice();
  edgesToBeOrdered.sort((a, b) => a.weight - b.weight);

  const orderedEdges: Edge[] = [];

  let currentID: number = startingID;
  while (orderedEdges.length < edges.length) {
    console.log("    ");
    console.log(currentID);
    const edge = nextEdge(edgesToBeOrdered, currentID);
    console.log(edge);
    orderedEdges.push(edge);

    if (edge.from.id === currentID) {
      currentID = edge.to.id;
    } else if (edge.to.id === currentID) {
      currentID = edge.from.id;
    }
    console.log(currentID);
  }

  return orderedEdges;
}

// returns the id of the next node to visit, based off the list of edges and the current node
function nextEdge(edges: Edge[], currentID: number): Edge {
  console.log(`Num Edges Left ${edges.length}`);
  // console.log("Edges")
  // console.log(edges)
  const options: Edge[] = [];

  edges.forEach((edge) => {
    if (edge.from.id === currentID || edge.to.id === currentID) {
      options.push(edge);
    }
  });

  options.sort((a, b) => a.weight - b.weight);

  edges.splice(edges.indexOf(options[0]), 1);
  return options[0];
}

// returns a list of edges which is the matching of the graph, a perfect matching only occurs
// when the graph has an even number of nodes, so that might be a constraint to consider
function makeMatching(locations: ClueNode[]): Graph {
  const connectedGraph = makeFullyConnectedGraph(locations);
  const nodes: ClueNode[] = connectedGraph.nodes;
  const numNodes: number = nodes.length;
  const edges = connectedGraph.edges;
  edges.sort((a, b) => a.weight - b.weight);

  const matchGraph = new Graph();

  while (edges.length > 0 && matchGraph.nodes.length < numNodes) {
    const edgeAdded = edges.shift();
    const node1 = edgeAdded.from;
    const node2 = edgeAdded.to;
    if (
      !matchGraph.nodes.includes(node1) &&
      !matchGraph.nodes.includes(node2)
    ) {
      matchGraph.addNode(node1);
      matchGraph.addNode(node2);
      matchGraph.addEdge(node1, node2);
    }
  }

  return matchGraph;
}
// returns a list of edges in a MST of the given list of edges
function makeMST(locations: ClueNode[]): Graph {
  const connectedGraph = makeFullyConnectedGraph(locations);
  const MST = connectedGraph.kruskalsMST();

  return MST;
}

function getDegrees(g: Graph): Map<ClueNode, number> {
  const degreeMap = new Map<ClueNode, number>();
  g.nodes.forEach((node) => {
    degreeMap.set(node, getDegree(g, node));
  });

  return degreeMap;
}

function getDegree(g: Graph, node: ClueNode): number {
  let degree = 0;

  g.edges.forEach((edge) => {
    if (edge.to === node || edge.from === node) {
      degree += 1;
    }
  });

  return degree;
}

// returns a list of Edges
function makeFullyConnectedGraph(locations: ClueNode[]): Graph {
  const connectedGraph = new Graph();
  for (let i = 0; i < locations.length; i++) {
    for (let j = 0; j < locations.length; j++) {
      if (i !== j) {
        const node1 = locations[i];
        const node2 = locations[j];
        if (!connectedGraph.nodes.includes(node1))
          connectedGraph.addNode(node1);
        if (!connectedGraph.nodes.includes(node2))
          connectedGraph.addNode(node2);
        connectedGraph.addEdge(node1, node2);
      }
    }
  }
  return connectedGraph;
}

console.log(orderPath(locsMedium, 5));
