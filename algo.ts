import { Graph } from "./class_graph.ts"

interface GraphResults {
    distances: Map<number, number>;
    predecessors: Map<number, number | null>;
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

export { displayResults, getSuccessors, getNeighbors, getPredecessors, testArcExistence, getArcWeight, addArcOption, removeArcOption};
export type { GraphResults };
