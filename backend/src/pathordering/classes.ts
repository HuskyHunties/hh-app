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

function pythDistance(loc1: ClueNode, loc2: ClueNode): number {
  return Math.sqrt(
    Math.pow(loc2.lat - loc1.lat, 2) + Math.pow(loc2.long - loc1.long, 2)
  );
}

export { UnionFind, Graph, Edge, ClueNode };
