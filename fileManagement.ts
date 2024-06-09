import { Graph } from "./class_graph";

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

async function loadGraphMenu(): Promise<void> {
    while (true) {
        console.log("Veuillez entrer le chemin complet du fichier du graphe:");
        const filePath = await prompt("Chemin du fichier :");
        try {
            const graph = await loadGraphFromFile(filePath);
            console.log("Graphe chargé avec succès.");
            //await graphOptions(graph);
            break;
        } catch (error) {
            console.error("Erreur lors du chargement du graphe. Vérifiez le chemin du fichier et réessayez.", error);
            console.log("1. Réessayer");
            console.log("2. Retourner au menu principal");
            const choice = await prompt("Choisissez une option:");
            if (choice === '2') {
                //menue principal 
                return;
            }
        }
    }
}

export { loadGraphMenu };
