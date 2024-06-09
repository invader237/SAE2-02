import { mainMenu } from './menu.ts';

// Exécution de la fonction principale pour démarrer l'application
async function main() {
    await mainMenu();
}

// Exécution du point d'entrée
main().catch(err => {
    console.error("Erreur lors de l'exécution du programme principal:", err);
});
