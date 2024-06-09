import { Graph } from "./class_graph";
import {displayResults} from "./algo";
import {dijkstra, calculateIsochrone} from "./dijkstra";

async function graphOptions(graph: Graph): Promise<void> {
    const running = true;
    while (running) {
        console.clear();  // Nettoie la console pour une vue propre
        console.log("\x1b[1m\x1b[94m" + "═".repeat(80) + "\x1b[0m");
        console.log("\x1b[1m\x1b[94m║\x1b[0m \x1b[1m\x1b[93m                 Gestionnaire de Graphes                  \x1b[0m\x1b[1m\x1b[94m║\x1b[0m");
        console.log("\x1b[1m\x1b[94m" + "═".repeat(80) + "\x1b[0m");
        console.log("\x1b[36mChoisissez une action parmi les suivantes :\x1b[0m");
        console.log("\x1b[1m\x1b[92m1\x1b[0m - Visualiser le nombre de sommets");
        console.log("\x1b[1m\x1b[92m2\x1b[0m - Visualiser le nombre d'arcs");
        console.log("\x1b[1m\x1b[92m3\x1b[0m - Calculer les plus courts chemins avec Dijkstra");
        console.log("\x1b[1m\x1b[92m4\x1b[0m - Ajouter un arc");
        console.log("\x1b[1m\x1b[92m5\x1b[0m - Retirer un arc");
        console.log("\x1b[1m\x1b[92m6\x1b[0m - Tester l'existence d'un arc");
        console.log("\x1b[1m\x1b[92m7\x1b[0m - Afficher les successeurs d'un sommet");
        console.log("\x1b[1m\x1b[92m8\x1b[0m - Afficher les prédécesseurs d'un sommet");
        console.log("\x1b[1m\x1b[92m9\x1b[0m - Lister les voisins d'un sommet");
        console.log("\x1b[1m\x1b[92m10\x1b[0m - Obtenir le poids d'un arc spécifique");
        console.log("\x1b[1m\x1b[92m11\x1b[0m - Calculer un isochrone à partir d'un sommet");
        console.log("\x1b[1m\x1b[92m12\x1b[0m - Redimensionner le nombre de sommets");
        console.log("\x1b[1m\x1b[92m13\x1b[0m - Revenir au menu principal");
        console.log("\x1b[1m\x1b[92m14\x1b[0m - Quitter l'application");
        console.log("\x1b[1m\x1b[94m" + "═".repeat(80) + "\x1b[0m");

        const action = await prompt("\x1b[33mEntrez votre choix (1-14) :\x1b[0m ");
        switch (action) {
            case '1': {
                console.log(`\x1b[32mLe graphe contient ${graph.getVertexCount()} sommets.\x1b[0m`);
                break;
            }
            case '2': {
                console.log(`\x1b[32mLe graphe contient ${graph.getEdgeCount()} arcs.\x1b[0m`);
                break;
            }
            case '3': {
                const startVertex = parseInt(await prompt("\x1b[33mNuméro du sommet de départ pour Dijkstra :\x1b[0m"));
                if (isNaN(startVertex) || !graph.getAdjacencyList().has(startVertex)) {
                    console.error("\x1b[31mSommet invalide ou inexistant.\x1b[0m");
                    continue;
                }
                const results = dijkstra(graph, startVertex);
                displayResults(results.distances, results.predecessors, startVertex);
                break;
            }
            case '4': {
                await addArcOption(graph);
                break;
            }
            case '5': {
                await removeArcOption(graph);
                break;
            }
            case '6': {
                await testArcExistence(graph);
                break;
            }
            case '7': {
                await getSuccessors(graph);
                break;
            }
            case '8': {
                await getPredecessors(graph);
                break;
            }
            case '9': {
                await getNeighbors(graph);
                break;
            }
            case '10': {
                await getArcWeight(graph);
                break;
            }
            case '11': {
                const isoStartVertex = parseInt(await prompt("\x1b[33mNuméro du sommet initial pour l'isochrone :\x1b[0m"));
                const maxDistance = parseInt(await prompt("\x1b[33mDistance maximale de l'isochrone :\x1b[0m"));
                if (isNaN(isoStartVertex) || !graph.getAdjacencyList().has(isoStartVertex) || isNaN(maxDistance)) {
                    console.error("\x1b[31mEntrée invalide ou sommet inexistant.\x1b[0m");
                    break;
                }
                const isoResults = dijkstra(graph, isoStartVertex);
                const isochrone = calculateIsochrone(isoResults, maxDistance);
                console.log(`\x1b[36mSommets accessibles à une distance de ${maxDistance} unités depuis le sommet ${isoStartVertex} : ${Array.from(isochrone).join(', ')}\x1b[0m`);
                break;
            }
            case '12': {
                const newSize = parseInt(await prompt("\x1b[33mEntrez le nouveau nombre de sommets :\x1b[0m"));
                graph.resizeGraph(newSize);
                break;
            }
            case '13': {
                await mainMenu();
                return;
            }
            case '14': {
                console.log("\x1b[34mMerci d'avoir utilisé l'application.\x1b[0m");
                return;
            }
            default: {
                console.log("\x1b[31mChoix non valide. Veuillez choisir une option entre 1 et 14.\x1b[0m");
                break;
            }
        }
        await prompt("\x1b[34mAppuyez sur 'Entrée' pour continuer...\x1b[0m");
    }
}


// Fonction pour demander à l'utilisateur d'entrer des données
async function prompt(message: string): Promise<string> {
    console.log(message);
    const buf = new Uint8Array(1024);
    const n = await Deno.stdin.read(buf) as number;
    return new TextDecoder().decode(buf.subarray(0, n)).trim();
}


// Fonction pour introduire un délai
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
// Affiche le menu principal et gère la navigation
async function mainMenu(): Promise<void> {
    try {
        console.clear();
        console.log("\x1b[45m\x1b[1m\x1b[37m" + "═".repeat(60) + "\x1b[0m");
        console.log("\x1b[45m\x1b[1m\x1b[37m              Gestionnaire de Graphes              \x1b[0m");
        console.log("\x1b[45m\x1b[1m\x1b[37m" + "═".repeat(60) + "\x1b[0m");
        await sleep(200); // Petit délai pour une meilleure expérience utilisateur
        console.log("\x1b[1m\x1b[33mChoisissez une option:\x1b[0m");
        console.log("\x1b[32m1.\x1b[0m Charger un graphe à partir d'un fichier");
        console.log("\x1b[32m2.\x1b[0m Créer un graphe manuellement");
        const choice = await prompt("\x1b[36m➤ Entrez votre choix (1 ou 2):\x1b[0m ");

        switch (choice) {
            case '1':
                await loadGraphMenu();
                break;
            case '2':
                await createGraphMenu();
                break;
            default:
                console.log("\x1b[31mChoix non valide, veuillez entrer 1 ou 2.\x1b[0m");
                await sleep(500);
                await mainMenu();
                break;
        }
    } catch (error) {
        console.error("\x1b[31mUne erreur est survenue:\x1b[0m", error);
        await sleep(500);
        await mainMenu();
    }
}

// Menu pour charger un graphe depuis un fichier
async function loadGraphMenu(): Promise<void> {
    console.clear();
    console.log("\x1b[46m\x1b[1m\x1b[37m" + "═".repeat(60) + "\x1b[0m");
    console.log("\x1b[46m\x1b[1m\x1b[37m             Chargement de Graphes             \x1b[0m");
    console.log("\x1b[46m\x1b[1m\x1b[37m" + "═".repeat(60) + "\x1b[0m");
    await sleep(200);
    console.log("\x1b[36mVeuillez entrer le chemin complet du fichier du graphe :\x1b[0m");
    const filePath = await prompt("\x1b[36m➤ Chemin du fichier :\x1b[0m");
    try {
        const graph = await loadGraphFromFile(filePath);
        console.log("\x1b[32mGraphe chargé avec succès.\x1b[0m");
        await sleep(400);
        await graphOptions(graph);
    } catch (error) {
        console.error("\x1b[31mErreur lors du chargement :\x1b[0m", error);
        console.log("\x1b[33m1. Réessayer\x1b[0m");
        console.log("\x1b[33m2. Retourner au menu principal\x1b[0m");
        const choice = await prompt("\x1b[36m➤ Choisissez une option :\x1b[0m");
        if (choice === '2') {
            if (import.meta.main) {
                await mainMenu();
            }
        } else {
            await loadGraphMenu();
        }
    }
}

async function proposeToSaveGraph(graph: Graph): Promise<void> {
    const save = (await prompt("Voulez-vous sauvegarder le graphe? (oui/non)")).toLowerCase();
    if (save === 'oui') {
        const filePath = await prompt("Veuillez entrer le chemin complet pour enregistrer le fichier:");
        try {
            await graph.saveGraphToFile(filePath);
            console.log("\x1b[32mGraphe sauvegardé avec succès.\x1b[0m");
        } catch (error) {
            console.error(`\x1b[31mErreur lors de la sauvegarde du graphe: ${error}\x1b[0m`);
        }
    }
}
export { proposeToSaveGraph };
