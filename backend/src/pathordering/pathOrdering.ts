import { match } from "assert";

/* eslint-disable @typescript-eslint/no-use-before-define */
class UnionFind {
  count: number;
  parent: Map<ClueNode, ClueNode>;
  constructor(nodes) {
    // Number of disconnected components
    this.count = nodes.length;

    // Keep Track of connected components
    this.parent = new Map();

    // Initialize the data structure such that all
    // elements have themselves as parents
    nodes.forEach((node) => this.parent.set(node, node));
  }

  union(node1: ClueNode, node2: ClueNode): void {
    const root1: ClueNode = this.findParent(node1);
    const root2: ClueNode = this.findParent(node2);
    //console.log(`root1: ${root1.id}, root2: ${root2.id}`)
    // Roots are same so these are already connected.
    if (root1.id === root2.id) return;

    // Always make the element with smaller root the parent.
    if (root1.id < root2.id) {
      if (this.parent.get(node2) != node2) {
        this.union(this.parent.get(node2), node1);
      } else {
        this.parent.set(node2, this.parent.get(node1));
      }
    } else {
      if (this.parent.get(node1) != node1) {
        this.union(this.parent.get(node1), node2);
      } else {
        this.parent.set(node1, this.parent.get(node2));
      }
    }
  }

  // Returns final parent of a node
  findParent(node: ClueNode): ClueNode {
    // console.log(`parent of ${a.id} is:`)
    while (this.parent.get(node) !== node) {
      node = this.parent.get(node);
    }
    //console.log(`${a.id}`)
    return node;
  }

  // Checks connectivity of the 2 nodes
  areConnected(a: ClueNode, b: ClueNode): boolean {
    return this.findParent(a) === this.findParent(b);
  }
}

class ClueNode {
  id: number;
  lat: number;
  long: number;
  constructor(id: number, lat: number, long: number) {
    this.id = id;
    this.lat = lat;
    this.long = long;
  }
}

class Edge {
  from: ClueNode;
  to: ClueNode;
  weight: number;
  constructor(from: ClueNode, to: ClueNode, weight: number) {
    this.from = to;
    this.to = from;
    this.weight = weight;
  }
}

class Graph {
  edges: Edge[];
  nodes: ClueNode[];
  constructor() {
    this.edges = [];
    this.nodes = [];
  }

  // returns a graph which is an MST for this graph
  kruskalsMST(): Graph {
    // Initialize graph that'll contain the MST
    const MST = new Graph();
    this.nodes.forEach((node) => MST.addNode(node));
    if (this.nodes.length === 0) {
      return MST;
    }

    // duplicate all edges in this graph and sort by weight
    const edgeQueue: Edge[] = this.edges.slice();
    edgeQueue.sort((a, b) => a.weight - b.weight);
    //console.log(edgeQueue)
    const uf = new UnionFind(this.nodes);

    // Loop until either we explore all nodes or queue is empty
    while (edgeQueue.length > 0) {
      // Get the edge data using destructuring
      const nextEdge: Edge = edgeQueue.shift();
      const nodes = [nextEdge.to, nextEdge.from];

      // console.log(`edges remaining: ${edgeQueue.length}`)
      //console.log(`are ${nodes[0].id} and ${nodes[1].id} connected?: ${uf.connected(nodes[0], nodes[1])}`)
      if (!uf.areConnected(nodes[0], nodes[1])) {
        //console.log(`adding edge between ${nodes[0].id} and ${nodes[1].id}`)
        MST.addEdge(nodes[0], nodes[1]);
        uf.union(nodes[0], nodes[1]);
      }
    }
    return MST;
  }

  addNode(node: ClueNode): void {
    this.nodes.push(node);
  }
  addEdge(node1: ClueNode, node2: ClueNode): void {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.edges.push(new Edge(node1, node2, pythDistance(node1, node2)));
  }

  display(): void {
    let graph = "";
    this.nodes.forEach((node) => {
      graph +=
        node.id +
        "->" +
        this.edges
          .filter((edge) => edge.from.id === node.id)
          .map((edge) => edge.to.id)
          .join(", ") +
        "\n";
    });
    console.log(graph);
  }
}
const locsSmall = [
  { id: 1, lat: 14, long: 11 },
  { id: 2, lat: -15, long: 41 },
  { id: 3, lat: -49, long: 45 },
  { id: 4, lat: -19, long: 25 },
  { id: 5, lat: -32, long: 31 },
  { id: 6, lat: 13, long: 16 },
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
function pythDistance(loc1: ClueNode, loc2: ClueNode): number {
  return Math.sqrt(
    Math.pow(loc2.lat - loc1.lat, 2) + Math.pow(loc2.long - loc1.long, 2)
  );
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

console.log(orderPath(locsBig, 5));
