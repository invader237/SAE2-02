import { Graph } from "./class_graph:coffin:"
import { proposeToSaveGraph } from "./menu";

// Interface définissant les résultats d'un algorithme de graphes, notamment Dijkstra
interface GraphResults {
    distances: Map<number, number>;  // Carte des distances minimales depuis le sommet de départ
    predecessors: Map<number, number | null>;  // Carte des prédécesseurs sur le chemin le plus court
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
    console.log("\x1b[33mDébut de la création du graphe par liste d'adjacence.\x1b[0m");

    while (continueAdding) {
        try {
            const source = await promptForInteger("Entrez le sommet source (doit être un entier positif):", false);
            const destination = await promptForInteger("Entrez le sommet destination (doit être un entier positif):", false);
            const weight = await promptForInteger("Entrez le poids de l'arête (doit être un entier positif):", false);
            // Vérification que les sommets source et destination ne sont pas identiques
            if (source === destination) {
                throw new Error("Une boucle (arc de sommet à lui-même) n'est pas autorisée.");
            }

            // Ajout des sommets et de l'arc dans le graphe
            graph.addVertex(source);
            graph.addVertex(destination);
            graph.addEdge(source, destination, weight);
            console.log(`\x1b[32mArc ajouté de ${source} à ${destination} avec un poids de ${weight}.\x1b[0m`);
        } catch (error) {
            console.error(`\x1b[31mErreur: ${error.message}\x1b[0m`);
        }

        // Demande à l'utilisateur s'il souhaite continuer à ajouter d'autres arêtes
        const response = await prompt("Voulez-vous ajouter une autre arête ? (oui/non)");
        continueAdding = response.toLowerCase() === 'oui';
    }

    await proposeToSaveGraph(graph);
}

async function promptForInteger(message: string, allowNegative = false): Promise<number> {
    let input, value;
    do {
        input = await prompt(`${message}`);
        value = parseInt(input);
        if (isNaN(value) || (!allowNegative && value < 0)) {
            console.log("\x1b[31mVeuillez entrer un entier valide.\x1b[0m");
        }
    } while (isNaN(value) || (!allowNegative && value < 0));
    return value;
    }
if (import.meta.main) {
    await mainMenu();
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

export { displayResults, getSuccessors, getNeighbors, getPredecessors, testArcExistence, getArcWeight, addArcOption, removeArcOption, createGraphMenu};
