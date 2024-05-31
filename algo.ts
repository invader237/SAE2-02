import CliTable from "https://esm.sh/cli-table3";
import { Graph } from "./class_graph.ts"
interface GraphResults {
    distances: Map<number, number>;
    predecessors: Map<number, number | null>;
}


async function loadGraphFromFile(filePath: string): Promise<Graph> {
    const graph = new Graph();
    const fileContent = await Deno.readTextFile(filePath);
    const lines = fileContent.trim().split('\n').slice(1);

    lines.forEach(line => {
        const parts = line.split(' ').map(Number);
        if (parts.length === 3) {
            const [source, destination, weight] = parts;
            graph.addEdge(source, destination, weight);
            console.log(`Added edge from ${source} to ${destination} with weight ${weight}`);
        } else {
            console.log(`Malformatted line: '${line}'`);
        }
    });

    return graph;
}

function dijkstra(graph: Graph, startVertex: number): GraphResults {
    const distances = new Map<number, number>();
    const predecessors = new Map<number, number>();
    const priorityQueue = new Set<number>();

    //recupération des sommets pour créer le tableau
    const vertices = graph.getVertices();
    //création du tableau avec le nom des sommets
    const table = new CliTable({
      head: ["E"].concat(vertices.map(v => " " + v.toString() + " ")).concat(["B"]),
    });
    //Initialisation de la première ligne du tableau
    table.push(["∅"].concat(vertices.map(v => "∞")).concat(startVertex.toString()));
    console.log(table.toString());

    // Initialisation des distances et ajout des sommets à la file de priorité
    graph.getAdjacencyList().forEach((_, vertex) => {
        distances.set(vertex, Infinity);
        priorityQueue.add(vertex);
    });
    // Définir la distance au sommet de départ à 0 et s'assurer qu'elle est mise à jour dans la file
    distances.set(startVertex, 0);

    while (priorityQueue.size !== 0) {
        const currentVertex = getVertexWithMinDistance(distances, priorityQueue);

        if (currentVertex === -1) break;

        priorityQueue.delete(currentVertex);
        const currentDistance = distances.get(currentVertex) ?? Infinity;
        const neighbors = graph.getNeighbors(currentVertex);
        neighbors.forEach((weight, neighbor) => {
            const alt = currentDistance + weight;
            if (alt < (distances.get(neighbor) ?? Infinity)) {
                distances.set(neighbor, alt);
                predecessors.set(neighbor, currentVertex);
            }
        });
        table.push(newTableLine(distances, currentVertex, vertices));
        console.log(table.toString());
    }
    return { distances, predecessors };
}

function newTableLine(distancesMap: Map<number, number>, currentVertex: number, vertices: number[]): Array<string> {

    const distancesMapSorted = new Map([...distancesMap.entries()].sort((a, b) => a[0] - b[0]));

    let tableLine: Array<string> = [currentVertex.toString()];
    vertices.forEach(vertex => {
        const distance = distancesMapSorted.get(vertex);
        const distanceString = distance !== undefined && distance !== Infinity ? distance.toString() : '∞';
        tableLine.push(distanceString);
    });
    return tableLine;
}

function getVertexWithMinDistance(distances: Map<number, number>, priorityQueue: Set<number>): number {
    let minDistance = Infinity;
    let vertexWithMinDistance = -1;

    priorityQueue.forEach(vertex => {
        const distance = distances.get(vertex);
        if (distance !== undefined && distance < minDistance) {
            minDistance = distance;
            vertexWithMinDistance = vertex;
        }
    });

    if (vertexWithMinDistance === -1) {
        console.error('No valid vertex found in priority queue.');
    }

    return vertexWithMinDistance;
}


// Chargement des graphes et exécution de Dijkstra pour chaque fichier
const basePath = './'; // Adapte ce chemin à ton environnement
const files = ['dagn_20_76_01.txt'];

for (const file of files) {
    const filePath = `${basePath}${file}`;
    loadGraphFromFile(filePath).then(graph => {
        console.log(`Executing Dijkstra for file ${file}`);
        const startVertex = 0; // Ou tout autre sommet de départ selon le cas
        const result = dijkstra(graph, startVertex);

        console.log(`Results for file ${file}:`);
        console.log("Distances:", result.distances);
        console.log("Predecessors:", result.predecessors);
    }).catch(error => {
        console.error(`Error processing file ${file}: ${error}`);
    });
}



/*
table.push('test', 'test2', 'test3');
console.log(table.toString());*/
