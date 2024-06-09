async function createAdjacencyListGraph(graph: Graph): Promise<void> {
    console.log("\x1b[33mDébut de la création du graphe par liste d'adjacence.\x1b[0m");
    let continueAdding = true;

    while (continueAdding) {
        try {
            const source = await promptForInteger("Entrez le sommet source (doit être un entier positif):", false);
            const destination = await promptForInteger("Entrez le sommet destination (doit être un entier positif):", false);
            const weight = await promptForInteger("Entrez le poids de l'arête (doit être un entier non négatif):", false);

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

async function createAdjacencyMatrixGraph(graph: Graph): Promise<void> {
    console.log("\x1b[33mDébut de la création du graphe par matrice d'adjacence.\x1b[0m");
    const size = await promptForInteger("Entrez le nombre de sommets pour le graphe:");

    // Initialisation des sommets
    for (let i = 0; i < size; i++) {
        graph.addVertex(i);
    }

    // Lecture et validation des poids des arcs
    for (let i = 0; i < size; i++) {
        let validInput = false;
        while (!validInput) {
            console.log(`Entrez les poids des arcs pour chaque paire de sommets depuis le sommet ${i}, séparés par des espaces (utilisez -1 pour l'absence d'arc, '0' pour le sommet lui-même):`);
            const weights = (await prompt(`Poids des arcs à partir du sommet ${i}, séparés par des espaces :`)).split(' ').map(str => parseInt(str));

            if (weights.length !== size) {
                console.log("Erreur: Le nombre d'entrées de poids doit correspondre au nombre de sommets.");
                continue;
            }

            weights.forEach((weight, j) => {
                if (weight >= 0 && i !== j) {
                    try {
                        graph.addEdge(i, j, weight);
                        validInput = true; // Assume valid unless an error is thrown
                    } catch (error) {
                        console.log(`Erreur: ${error.message}`);
                        validInput = false; // Invalidate the input to re-prompt
                    }
                }
            });
        }
    }

    await proposeToSaveGraph(graph);
}