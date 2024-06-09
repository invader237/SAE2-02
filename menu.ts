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