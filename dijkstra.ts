import { Graph } from './class_graph.ts';
import { GraphResults } from './algo.ts';

function dijkstra(graph: Graph, startVertex: number): GraphResults {
    const distances = new Map<number, number>();
    const predecessors = new Map<number, number | null>();
    const priorityQueue = new Set<number>();

    // Initialiser toutes les distances à l'infini, sauf pour le sommet de départ
    graph.getAdjacencyList().forEach((_, vertex) => {
        distances.set(vertex, Infinity);
        predecessors.set(vertex, null);
        priorityQueue.add(vertex);
    });
    distances.set(startVertex, 0);

    while (priorityQueue.size > 0) {
        const currentVertex = getVertexWithMinDistance(distances, priorityQueue);

        // Si le sommet avec la distance minimale a une distance infinie, tous les sommets restants sont inatteignables.
        if (currentVertex === -1 || distances.get(currentVertex) === Infinity) {
            break;  // Aucun chemin restant possible
        }

        priorityQueue.delete(currentVertex);
        const currentDistance = distances.get(currentVertex) ?? Infinity;

        // Mettre à jour les distances pour chaque voisin
        graph.getNeighbors(currentVertex).forEach((weight, neighbor) => {
            if (priorityQueue.has(neighbor)) {  // Considérer uniquement les sommets encore dans la queue
                const alt = currentDistance + weight;
                if (alt < (distances.get(neighbor) ?? Infinity)) {
                    distances.set(neighbor, alt);
                    predecessors.set(neighbor, currentVertex);
                    // Ceci n'est pas nécessaire pour une simple queue, mais serait nécessaire pour une priority queue implémentée correctement
                }
            }
        });
    }

    return { distances, predecessors };
}

function getVertexWithMinDistance(distances: Map<number, number>, priorityQueue: Set<number>): number {
    let minDistance = Infinity;
    let vertexWithMinDistance = -1;

    priorityQueue.forEach(vertex => {
        const distance = distances.get(vertex) ?? Infinity;
        if (distance < minDistance) {
            minDistance = distance;
            vertexWithMinDistance = vertex;
        }
    });

    return vertexWithMinDistance;
}

function calculateIsochrone(graphResults: GraphResults, maxDistance: number): Set<number> {
    const reachableVertices = new Set<number>();
    for (const [vertex, distance] of graphResults.distances) {
        if (distance <= maxDistance) {
            reachableVertices.add(vertex);
        }
    }
    return reachableVertices;
}

export{ calculateIsochrone, dijkstra};
