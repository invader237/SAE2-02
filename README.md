
# Gestionnaire de Graphes

Ce projet implémente un système de gestion de graphes en Deno, permettant la manipulation de graphes à travers diverses opérations telles que l'ajout de sommets et d'arêtes, la suppression de ceux-ci, le redimensionnement du graphe, et l'application de l'algorithme de Dijkstra pour trouver les chemins les plus courts.

## Fonctionnalités

- Ajout et suppression de sommets
- Ajout, suppression et modification des arêtes
- Calcul des chemins les plus courts via l'algorithme de Dijkstra
- Support du redimensionnement dynamique des graphes
- Interface en ligne de commande pour une interaction facile avec l'utilisateur
- Tests de performance pour des manipulations massives de graphes

## Technologies Utilisées

- Deno: Un runtime sécurisé pour JavaScript et TypeScript
- TypeScript: Un sur-ensemble de JavaScript offrant des types statiques

## Installation

Pour exécuter ce projet, vous aurez besoin de Deno installé sur votre machine. Vous pouvez installer Deno en suivant les instructions sur [le site officiel de Deno](https://deno.land/#installation).

```bash
# Installation via Shell (Unix/Linux/macOS):
curl -fsSL https://deno.land/install.sh | sh

# Installation via PowerShell (Windows):
iwr https://deno.land/install.ps1 -useb | iex
```

## Utilisation

Pour démarrer l'interface de gestion de graphes, exécutez le script principal en utilisant Deno :

```bash
deno run --allow-read --allow-write main.ts
```

Assurez-vous de donner les permissions nécessaires pour lire et écrire des fichiers si votre utilisation inclut la sauvegarde ou le chargement de graphes depuis des fichiers.
Voici la section ajoutée pour "Deno Tests" dans votre fichier `README.md`, complet avec une introduction à la façon de lancer les tests et pourquoi ils sont importants :


## Deno Tests

Les tests sont essentiels pour assurer la fiabilité et la robustesse du code. Pour exécuter les tests de ce projet, vous pouvez utiliser la commande suivante :

```bash
deno test --allow-read
```

Cette commande lancera tous les tests définis dans les fichiers de test du projet, en vérifiant chaque fonctionnalité pour des bugs et des erreurs potentielles. Cela inclut les tests pour l'ajout et la suppression de sommets et d'arêtes, ainsi que les tests de l'algorithme de Dijkstra.

## Contact


Lien du projet: [https://github.com/invader237/SAE2-02](https://github.com/invader237/SAE2-02)
```
