import { Graph } from "./class_graph.ts"
interface GraphResults {
    distances: Map<number, number>;
    predecessors: Map<number, number | null>;
}

async function loadGraphMenu(): Promise<void> {
    while (true) {
        console.log("Veuillez entrer le chemin complet du fichier du graphe:");
        const filePath = await prompt("Chemin du fichier :");
        try {
            const graph = await loadGraphFromFile(filePath);
            console.log("Graphe chargé avec succès.");
            await graphOptions(graph);
            break;
        } catch (error) {
            console.error("Erreur lors du chargement du graphe. Vérifiez le chemin du fichier et réessayez.", error);
            console.log("1. Réessayer");
            console.log("2. Retourner au menu principal");
            const choice = await prompt("Choisissez une option:");
            if (choice === '2') {
                await mainMenu();
                return;
            }
        }
    }
}

async function graphOptions(graph: Graph): Promise<void> {
    const running = true;
    while (running) {
        console.log("\nQue souhaitez-vous faire ?");
        console.log("1. Récupérer le nombre de sommets");
        console.log("2. Récupérer le nombre d'arcs");
        console.log("3. Exécuter l'algorithme de Dijkstra");
        console.log("4. Retirer un arc");
        console.log("5. Ajouter un arc"); 
        console.log("6. Tester l'existence d'un arc");
        console.log("7. Récupérer les successeurs d’un sommet");
        console.log("8. Récupérer les prédécesseurs d’un sommet");
        console.log("9. Récupérer les voisins d’un sommet");
        console.log("10. Redimensionner le nombre de sommets");
        console.log("11. Récupérer le poids d’un arc");
        console.log("12. Retour au menu principal");
        console.log("13. Quitter");

        const action = await prompt("Choisissez une option:");
        switch (action) {
            case '1': {
                console.log(`Le graphe contient ${graph.getVertexCount()} sommets.`);
                break;
            }
            case '2': {
                console.log(`Le graphe contient ${graph.getEdgeCount()} arcs.`);
                break;
            }
            case '3': {
                const startVertex = parseInt(await prompt("Entrez le numéro du sommet initial pour Dijkstra:"));
                if (isNaN(startVertex) || !graph.getAdjacencyList().has(startVertex)) {
                    console.error("Sommet initial invalide ou inexistant.");
                    continue;
                }
                const results = dijkstra(graph, startVertex);
                displayResults(results.distances, results.predecessors, startVertex);
                break;
            }
            case '4':
                await removeArcOption(graph);
                break;
            case '5':
                await addArcOption(graph);
                break;
            case '6':
                await testArcExistence(graph);
                break;
            case '7':
                await getSuccessors(graph);
                break;
            case '8':
                await getPredecessors(graph);
                break;
            case '9':
                await getNeighbors(graph);
                break;
            case '11': 
                await getArcWeight(graph);
                break;
            case '12':
                await mainMenu();
                return;
            case '13':
                console.log("Merci d'avoir utilisé l'application.");
                return;
            default:
                console.log("Choix non valide, veuillez choisir une option valide.");
                break;
        }
    }
}
async function getSuccessors(graph: Graph): Promise<void> {
    const vertex = parseInt(await prompt("Entrez le numéro du sommet pour obtenir ses successeurs :"));
    if (isNaN(vertex)) {
        console.log("Veuillez entrer un numéro de sommet valide.");
        return;
    }

    const successors = graph.getNeighbors(vertex);
    if (successors.size > 0) {
        console.log(`Les successeurs de ${vertex} sont :`);
        successors.forEach((weight, adjVertex) => {
            console.log(`Sommet: ${adjVertex} avec poids d'arc: ${weight}`);
        });
    } else {
        console.log(`Aucun successeur trouvé pour le sommet ${vertex}.`);
    }
}
async function getNeighbors(graph: Graph): Promise<void> {
    const vertex = parseInt(await prompt("Entrez le numéro du sommet pour obtenir ses voisins :"));
    if (isNaN(vertex)) {
        console.log("Veuillez entrer un numéro de sommet valide.");
        return;
    }

    const neighbors = graph.getNeighbors(vertex);
    if (neighbors.size > 0) {
        console.log(`Les voisins du sommet ${vertex} sont :`);
        neighbors.forEach((weight, adjVertex) => {
            console.log(`Sommet: ${adjVertex} avec poids d'arc: ${weight}`);
        });
    } else {
        console.log(`Aucun voisin trouvé pour le sommet ${vertex}.`);
    }
}
async function getPredecessors(graph: Graph): Promise<void> {
    const vertex = parseInt(await prompt("Entrez le numéro du sommet pour obtenir ses prédécesseurs :"));
    if (isNaN(vertex)) {
        console.log("Veuillez entrer un numéro de sommet valide.");
        return;
    }

    let hasPredecessors = false;
    console.log(`Les prédécesseurs du sommet ${vertex} sont :`);
    graph.getAdjacencyList().forEach((edges, source) => {
        if (edges.has(vertex)) {
            console.log(`Sommet: ${source} avec poids d'arc: ${edges.get(vertex)}`);
            hasPredecessors = true;
        }
    });

    if (!hasPredecessors) {
        console.log(`Aucun prédécesseur trouvé pour le sommet ${vertex}.`);
    }
}

async function testArcExistence(graph: Graph): Promise<void> {
    const source = parseInt(await prompt("Entrez le sommet source de l'arc à tester:"));
    const destination = parseInt(await prompt("Entrez le sommet destination de l'arc à tester:"));
    if (!graph.getAdjacencyList().has(source) || !graph.getAdjacencyList().get(source)?.has(destination)) {
        console.log(`Aucun arc trouvé de ${source} à ${destination}.`);
    } else {
        console.log(`Un arc existe de ${source} à ${destination}.`);
    }
}
async function getArcWeight(graph: Graph): Promise<void> {
    let continueChecking = true;
    while (continueChecking) {
        const source = parseInt(await prompt("Entrez le sommet source de l'arc :"));
        const destination = parseInt(await prompt("Entrez le sommet destination de l'arc :"));

        if (isNaN(source) || isNaN(destination)) {
            console.log("Veuillez entrer des valeurs valides pour les sommets.");
        } else {
            const adjacencyList = graph.getAdjacencyList();
            if (adjacencyList.has(source)) {
                const edges = adjacencyList.get(source);
                if (edges && edges.has(destination)) {
                    const weight = edges.get(destination);
                    console.log(`Le poids de l'arc de ${source} à ${destination} est ${weight}.`);
                } else {
                    console.log(`Aucun arc trouvé de ${source} à ${destination}.`);
                }
            } else {
                console.log(`Le sommet source ${source} n'existe pas dans le graphe.`);
            }
        }

        const choice = await prompt("Voulez-vous vérifier le poids d'un autre arc ? (oui/non)");
        continueChecking = choice.toLowerCase() === 'oui';
    }
}

async function addArcOption(graph: Graph): Promise<void> {
    let continueAdding = true;
    while (continueAdding) {
        const source = parseInt(await prompt("Entrez le sommet source de l'arc à ajouter:"));
        const destination = parseInt(await prompt("Entrez le sommet destination de l'arc à ajouter:"));
        const weight = parseInt(await prompt("Entrez le poids de l'arc:"));

        if (isNaN(source) || isNaN(destination) || isNaN(weight)) {
            console.log("Veuillez entrer des nombres valides pour la source, la destination et le poids.");
        } else {
            if (!graph.getAdjacencyList().get(source)?.has(destination)) {
                graph.addEdge(source, destination, weight);
                console.log(`Arc ajouté de ${source} à ${destination} avec un poids de ${weight}.`);
            } else {
                console.log("Un arc identique existe déjà.");
            }
        }

        const choice = await prompt("Voulez-vous ajouter un autre arc ? (oui/non)");
        continueAdding = choice.toLowerCase() === 'oui';
    }

    const save = await prompt("Voulez-vous enregistrer les modifications sur le graphe? (oui/non)");
    if (save.toLowerCase() === 'oui') {
        const filePath = await prompt("Veuillez entrer le chemin complet pour enregistrer le fichier:");
        try {
            await graph.saveGraphToFile(filePath);
            console.log("Modifications enregistrées avec succès.");
        } catch (error) {
            console.error("Impossible de sauvegarder le graphe.", error);
        }
    }
}
async function removeArcOption(graph: Graph): Promise<void> {
    let continueRemoving = true;
    while (continueRemoving) {
        let validRemoval = false;
        while (!validRemoval) {
            const source = parseInt(await prompt("Entrez le sommet source de l'arc à retirer:"));
            const destination = parseInt(await prompt("Entrez le sommet destination de l'arc à retirer:"));
            if (graph.getAdjacencyList().get(source)?.has(destination)) {
                graph.removeEdge(source, destination);
                console.log(`Arc supprimé de ${source} à ${destination}.`);
                validRemoval = true;
            } else {
                console.log(`Aucun arc trouvé de ${source} à ${destination}. Veuillez essayer à nouveau.`);
            }
        }

        const choice = await prompt("Voulez-vous encore supprimer un arc ? (oui/non)");
        continueRemoving = choice.toLowerCase() === 'oui';
    }

    const save = await prompt("Voulez-vous enregistrer les modifications sur le graphe? (oui/non)");
    if (save.toLowerCase() === 'oui') {
        const filePath = await prompt("Veuillez entrer le chemin complet pour enregistrer le fichier:");
        try {
            await graph.saveGraphToFile(filePath);
            console.log("Modifications enregistrées avec succès.");
        } catch (error) {
            console.error("Impossible de sauvegarder le graphe.", error);
        }
    }
}

async function createGraphMenu(): Promise<void> {
    console.log("Choisissez le type de graphe à créer:");
    console.log("1. Liste d'adjacence");
    console.log("2. Matrice d'adjacence");
    let typeChoice = await prompt("Entrez votre choix (1 ou 2):");

    while (!['1', '2'].includes(typeChoice)) {
        console.log("Entrée invalide. Veuillez choisir 1 pour une liste d'adjacence ou 2 pour une matrice d'adjacence.");
        typeChoice = await prompt("Entrez votre choix (1 ou 2):");
    }

    const graph = new Graph();
    if (typeChoice === '1') {
        await createAdjacencyListGraph(graph);
    } else {
        await createAdjacencyMatrixGraph(graph);
    }

    // Demandez à l'utilisateur s'il souhaite sauvegarder le graphe
    const save = await prompt("Voulez-vous sauvegarder le graphe? (oui/non)");
    if (save.toLowerCase() === 'oui') {
        const filePath = await prompt("Veuillez entrer le chemin complet pour enregistrer le fichier:");
        await saveGraphToFile(graph, filePath);
    } else {
        await afterCreationOptions(graph);
    }
}
async function afterCreationOptions(graph: Graph): Promise<void> {
    console.log("Que souhaitez-vous faire ensuite ?");
    console.log("1. Afficher les options du graphe");
    console.log("2. Écraser le graphe et recommencer");
    console.log("3. Retourner au menu principal");

    const choice = await prompt("Entrez votre choix (1, 2, ou 3):");
    switch (choice) {
        case '1':
            await graphOptions(graph);
            break;
        case '2':
            await createGraphMenu();
            break;
        case '3':
            await mainMenu();
            break;
        default:
            console.log("Choix non valide, veuillez réessayer.");
            await afterCreationOptions(graph);
            break;
    }
}

async function createAdjacencyListGraph(graph: Graph): Promise<void> {
    let more = true;
    console.log("Création du graphe par liste d'adjacence.");
    while (more) {
        const source = await promptForInteger("Entrez le sommet source (doit être un entier positif):", false);
        const destination = await promptForInteger("Entrez le sommet destination (doit être un entier positif):", false);
        const weight = await promptForInteger("Entrez le poids de l'arête (doit être un entier positif):", false);

        // Vérifie si l'arc existe déjà
        if (graph.getNeighbors(source)?.has(destination)) {
            console.log(`Un arc entre ${source} et ${destination} existe déjà avec un poids de ${graph.getNeighbors(source).get(destination)}.`);
        } else {
            graph.addEdge(source, destination, weight);
            console.log(`Arc ajouté de ${source} à ${destination} avec un poids de ${weight}.`);
        }

        const another = await prompt("Voulez-vous ajouter une autre arête ? (oui/non)");
        more = another.toLowerCase() === 'oui';
    }
}

async function createAdjacencyMatrixGraph(graph: Graph): Promise<void> {
    const size = await promptForInteger("Entrez le nombre de sommets du graphe:");
    for (let i = 0; i < size; i++) {
        graph.addVertex(i);  // Assurez-vous que tous les sommets sont initialisés
        const weights = await prompt(`Entrez les poids des arêtes pour le sommet ${i}, séparés par des espaces:`);
        const weightList = weights.split(' ').map(w => parseInt(w));
        weightList.forEach((weight, index) => {
            if (weight > 0) {  // Ajoutez une arête uniquement si le poids est supérieur à 0
                graph.addEdge(i, index, weight);
            }
        });
    }
}
async function promptForInteger(message: string, allowNegative = false): Promise<number> {
    let input = await prompt(message);
    let value = parseInt(input);
    while (isNaN(value) || (!allowNegative && value < 0)) {
        console.log(`Entrée invalide. ${allowNegative ? '' : 'Veuillez entrer un entier non négatif.'}`);
        input = await prompt(message);
        value = parseInt(input);
    }
    return value;
}

async function saveGraphToFile(graph: Graph, filePath: string): Promise<void> {
    let data = '';
    let edgeCount = 0;
    const sortedVertices = Array.from(graph.getAdjacencyList().keys()).sort((a, b) => a - b);
    sortedVertices.forEach(source => {
        const edges = graph.getAdjacencyList().get(source);
        if (edges) {
            edges.forEach((weight, destination) => {
                data += `${source} ${destination} ${weight}\n`;
                edgeCount++;
            });
        }
    });
    const header = `${graph.getVertexCount()} ${edgeCount}\n`;
    data = header + data;
    try {
        await Deno.writeTextFile(filePath, data);
        console.log("Graphe sauvegardé au format liste d'adjacence avec succès.");
    } catch (error) {
        console.error("Erreur lors de la sauvegarde du graphe:", error);
    }
}



await mainMenu();

async function loadGraphFromFile(filePath: string): Promise<Graph> {
    const graph = new Graph();
    const fileContent = await Deno.readTextFile(filePath);
    const lines = fileContent.trim().split('\n');
    let header = true;  // Ajout d'un indicateur pour la première ligne

    lines.forEach((line, _index) => {
        if (header) {  // Ignore la première ligne (header)
            header = false;
            return;
        }
        const parts = line.split(' ').map(Number);
        if (parts.length === 3) {
            const [source, destination, weight] = parts;
            // Assurez-vous que les sommets existent avant d'ajouter des arêtes
            if (!graph.getAdjacencyList().has(source)) {
                graph.addVertex(source);
            }
            if (!graph.getAdjacencyList().has(destination)) {
                graph.addVertex(destination);
            }
            try {
                graph.addEdge(source, destination, weight);
            } catch (error) {
                console.error(`Erreur lors de l'ajout de l'arc ${source} -> ${destination} avec poids ${weight}: ${error}`);
            }
        } else {
            console.error(`Ligne mal formatée ou poids négatif trouvé: '${line}'`);
        }
    });
    return graph;
}

export function dijkstra(graph: Graph, startVertex: number): GraphResults {
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
function displayResults(
    distances: Map<number, number>,
    predecessors: Map<number, number | null>,
    startVertex: number
): void {
    const results: { Sommet: number; Distance: string; Prédecesseur: string | number }[] = [];

    Array.from(distances.keys())
        .sort((a, b) => a - b)  // Tri par ordre croissant des sommets
        .forEach(vertex => {
            const distance = distances.get(vertex) ?? Infinity;
            const predecessor = predecessors.get(vertex) ?? "Aucun";

            results.push({
                Sommet: vertex,
                Distance: distance === Infinity ? "Infini" : distance.toString(),
                Prédecesseur: predecessor === null ? "Aucun" : predecessor.toString()
            });
        });

    console.log(`Résultats de Dijkstra depuis le sommet ${startVertex}:`);
    console.table(results, ["Sommet", "Distance", "Prédecesseur"]);  // Spécifiez les colonnes à afficher pour éviter '(idx)'
}

