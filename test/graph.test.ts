import { assertEquals, assertThrows } from "https://deno.land/std@0.220.0/assert/mod.ts";
import { dijkstra } from "../dijkstra.ts";
import { Graph } from "../class_graph.ts";

Deno.test("Ajout de sommet : devrait ajouter un sommet correctement", () => {
  const graph = new Graph();
  graph.addVertex(1);
  assertEquals(graph.getVertexCount(), 1);
});

Deno.test("Ajout de sommet : ne devrait pas ajouter un sommet négatif", () => {
  const graph = new Graph();
  assertThrows(() => graph.addVertex(-1), Error, "Le numéro du sommet ne peut pas être négatif");
});

Deno.test("Ajout de sommet : ajouter des sommets multiples et vérifier leur nombre", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  assertEquals(graph.getVertexCount(), 2);
});
Deno.test("Ajout de sommet : devrait gérer l'ajout de sommets en double sans augmenter le compte", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(1);
  assertEquals(graph.getVertexCount(), 1);
});

Deno.test("Ajout d'arête : devrait ajouter une arête correctement", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addEdge(1, 2, 100);
  assertEquals(graph.getEdgeCount(), 1);
});

Deno.test("Ajout d'arête : devrait lever une exception pour un poids négatif", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  assertThrows(() => graph.addEdge(1, 2, -1), Error, "Les poids négatifs ne sont pas autorisés");
});

Deno.test("Ajout d'arête : devrait empêcher l'ajout d'une arête lorsque le sommet source n'existe pas", () => {
  const graph = new Graph();
  graph.addVertex(2);
  assertThrows(() => graph.addEdge(1, 2, 100), Error, "Un ou plusieurs sommets spécifiés n'existent pas");
});

Deno.test("Ajout d'arête : devrait empêcher l'ajout d'une arête lorsque le sommet destination n'existe pas", () => {
  const graph = new Graph();
  graph.addVertex(1);
  assertThrows(() => graph.addEdge(1, 3, 100), Error, "Un ou plusieurs sommets spécifiés n'existent pas");
});

Deno.test("Ajout d'arête : devrait empêcher l'ajout d'une boucle", () => {
  const graph = new Graph();
  graph.addVertex(1);
  assertThrows(() => graph.addEdge(1, 1, 100), Error, "Les boucles ne sont pas autorisées");
});

Deno.test("Ajout d'arête : devrait empêcher l'ajout d'une arête déjà existante", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addEdge(1, 2, 100);
  assertThrows(() => graph.addEdge(1, 2, 100), Error, "Un arc entre ces sommets existe déjà");
});

Deno.test("Ajout d'arête : devrait permettre l'ajout d'une arête après la suppression d'une arête existante", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addEdge(1, 2, 100);
  graph.removeEdge(1, 2);
  graph.addEdge(1, 2, 200);
  const neighbors = graph.getNeighbors(1);
  assertEquals(neighbors.get(2), 200);
});
Deno.test("Redimensionnement du graphe : devrait réduire la taille correctement", () => {
  const graph = new Graph();
  for (let i = 0; i < 5; i++) graph.addVertex(i);
  graph.resizeGraph(3);
  assertEquals(graph.getVertexCount(), 3);
});

Deno.test("Redimensionnement du graphe : devrait augmenter la taille correctement", () => {
  const graph = new Graph();
  for (let i = 0; i < 3; i++) graph.addVertex(i);
  graph.resizeGraph(5);
  assertEquals(graph.getVertexCount(), 5);
});

Deno.test("Redimensionnement du graphe : devrait supprimer les arêtes connectées aux sommets supprimés", () => {
  const graph = new Graph();
  graph.addVertex(0);
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addEdge(0, 1, 1);
  graph.addEdge(1, 2, 2);
  graph.resizeGraph(1);
  assertEquals(graph.getEdgeCount(), 0);
});

Deno.test("Suppression de sommet : devrait supprimer un sommet correctement", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.removeVertex(1);
  assertEquals(graph.getVertexCount(), 0);
});

Deno.test("Suppression de sommet : devrait lever une exception si le sommet n'existe pas", () => {
  const graph = new Graph();
  assertThrows(() => graph.removeVertex(1), Error, "Le sommet à supprimer n'existe pas");
});
Deno.test("Suppression de sommet : devrait supprimer toutes les arêtes liées à un sommet supprimé", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addEdge(1, 2, 100);
  graph.addVertex(3);
  graph.addEdge(3, 2, 50);
  graph.removeVertex(2);
  assertEquals(graph.getEdgeCount(), 0);
});

Deno.test("Suppression d'arête : devrait supprimer une arête correctement", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addEdge(1, 2, 100);
  graph.removeEdge(1, 2);
  assertEquals(graph.getEdgeCount(), 0);
});

Deno.test("Suppression d'arête : devrait lever une exception si l'arête n'existe pas", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  assertThrows(() => graph.removeEdge(1, 3), Error, "L'arc à supprimer n'existe pas");
});
Deno.test("Suppression d'arête : devrait gérer correctement la suppression d'arêtes dans un graphe vide", () => {
  const graph = new Graph();
  assertThrows(() => graph.removeEdge(1, 2), Error, "L'arc à supprimer n'existe pas");
});

Deno.test("Suppression d'arête : ne devrait rien faire si les sommets n'existent pas", () => {
  const graph = new Graph();
  graph.addVertex(1);
  assertThrows(() => graph.removeEdge(1, 3), Error, "L'arc à supprimer n'existe pas");
});

// Continuer avec plus de tests pour les différentes interactions
Deno.test("Compte des sommets : devrait retourner le nombre correct de sommets", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  assertEquals(graph.getVertexCount(), 2);
});

Deno.test("Compte des arêtes : devrait retourner le nombre correct d'arêtes", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addEdge(1, 2, 100);
  assertEquals(graph.getEdgeCount(), 1);
});
Deno.test("Obtenir les voisins : devrait retourner un map vide si aucun voisin n'existe", () => {
  const graph = new Graph();
  graph.addVertex(1);
  assertEquals(graph.getNeighbors(1).size, 0);
});

Deno.test("Obtenir les voisins : devrait lever une exception si le sommet n'existe pas", () => {
  const graph = new Graph();
  assertThrows(() => graph.getNeighbors(1), Error, "Le sommet demandé n'existe pas");
});
Deno.test("Compte des sommets et des arêtes : devrait ajuster les comptes après suppressions", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addEdge(1, 2, 100);
  graph.removeVertex(1);
  assertEquals(graph.getVertexCount(), 1);
  assertEquals(graph.getEdgeCount(), 0);
});
Deno.test("Vérifier l'intégrité du graphe après des modifications multiples", () => {
  const graph = new Graph();
  graph.addVertex(0);
  graph.addVertex(1);
  graph.addEdge(0, 1, 100);
  graph.removeVertex(0);
  graph.addVertex(2);
  graph.addEdge(1, 2, 50);
  graph.removeEdge(1, 2);
  graph.addVertex(0);
  graph.addEdge(2, 0, 30);
  assertEquals(graph.getVertexCount(), 3);
  assertEquals(graph.getEdgeCount(), 1);
});
Deno.test("Vérifier la récupération des voisins après des modifications complexes", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addVertex(3);
  graph.addEdge(1, 2, 10);
  graph.addEdge(2, 3, 20);
  graph.removeVertex(2);
  graph.addVertex(4);
  graph.addEdge(1, 4, 30);
  const neighbors = graph.getNeighbors(1);
  assertEquals(neighbors.size, 1);
  assertEquals(neighbors.get(4), 30);
});
Deno.test("Vérification de l'intégrité après plusieurs opérations", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addEdge(1, 2, 10);
  graph.removeVertex(1);
  graph.addVertex(3);
  graph.addEdge(2, 3, 20);
  assertEquals(graph.getVertexCount(), 2);
  assertEquals(graph.getEdgeCount(), 1);
  const neighbors = graph.getNeighbors(2);
  assertEquals(neighbors.size, 1);
  assertEquals(neighbors.get(3), 20);
});
Deno.test("Performance : manipulation extensive",  () => {
  const graph = new Graph();
  const size = 1000; // Test avec un grand nombre de sommets pour mesurer les performances
  for (let i = 0; i < size; i++) {
    graph.addVertex(i);
    if (i > 0) graph.addEdge(i - 1, i, i);
  }
  assertEquals(graph.getVertexCount(), size);
  assertEquals(graph.getEdgeCount(), size - 1);
});
Deno.test("Performance : ajout massif de sommets",  () => {
  const graph = new Graph();
  for (let i = 0; i < 10000; i++) {
    graph.addVertex(i);
  }
  assertEquals(graph.getVertexCount(), 10000);
});

Deno.test("Performance : ajout massif d'arêtes",  () => {
  const graph = new Graph();
  for (let i = 0; i < 1000; i++) {
    graph.addVertex(i);
  }
  for (let i = 0; i < 1000; i++) {
    for (let j = i + 1; j < 1000; j++) {
      graph.addEdge(i, j, Math.random());
    }
  }
  assertEquals(graph.getEdgeCount(), 499500); // N(N-1)/2 arêtes pour un graphe complet
});

Deno.test("Dijkstra : devrait gérer un graphe totalement disjoint", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2); // Aucune arête ajoutée
  const results = dijkstra(graph, 1);
  assertEquals(results.distances.get(2), Infinity);
  assertEquals(results.predecessors.get(2), null);
});
Deno.test("Dijkstra : graphe non connecté", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  const results = dijkstra(graph, 1);
  assertEquals(results.distances.get(2), Infinity);
  assertEquals(results.predecessors.get(2), null);
});
Deno.test("Dijkstra : vérification des prédecesseurs dans un chemin complexe", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addVertex(3);
  graph.addVertex(4);
  graph.addEdge(1, 2, 1);
  graph.addEdge(2, 3, 2);
  graph.addEdge(1, 3, 10);
  graph.addEdge(3, 4, 3);
  const results = dijkstra(graph, 1);
  assertEquals(results.distances.get(4), 6);
  assertEquals(results.predecessors.get(4), 3);
  assertEquals(results.predecessors.get(3), 2);
  assertEquals(results.predecessors.get(2), 1);
});
Deno.test("Algorithme de Dijkstra : devrait traiter correctement les graphes avec des cycles", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addVertex(3);
  graph.addVertex(4);
  graph.addEdge(1, 2, 1);
  graph.addEdge(2, 3, 2);
  graph.addEdge(3, 4, 3);
  graph.addEdge(4, 1, 4);  // Création d'un cycle
  const results = dijkstra(graph, 1);
  assertEquals(results.distances.get(4), 6);  // La route devrait être 1->2->3->4
});

Deno.test("Algorithme de Dijkstra : devrait retourner des prédecesseurs corrects", () => {
  const graph = new Graph();
  graph.addVertex(0);
  graph.addVertex(1);
  graph.addEdge(0, 1, 1);
  const results = dijkstra(graph, 0);
  assertEquals(results.predecessors.get(1), 0);
});

Deno.test("Algorithme de Dijkstra : devrait gérer les graphes avec des poids variés", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addVertex(3);
  graph.addVertex(4);
  graph.addEdge(1, 2, 1);
  graph.addEdge(1, 3, 4);
  graph.addEdge(2, 3, 2);
  graph.addEdge(3, 4, 1);
  
  const results = dijkstra(graph, 1);
  assertEquals(results.distances.get(4), 4);
});

Deno.test("Algorithme de Dijkstra : devrait retourner infini pour des sommets non connectés", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  const results = dijkstra(graph, 1);
  assertEquals(results.distances.get(2), Infinity);
});

Deno.test("Algorithme de Dijkstra : devrait retourner les distances correctes pour le chemin le plus court", () => {
  const graph = new Graph();
  graph.addVertex(1);
  graph.addVertex(2);
  graph.addVertex(3);
  graph.addEdge(1, 2, 1);
  graph.addEdge(2, 3, 1);
  graph.addEdge(1, 3, 10);
  
  const results = dijkstra(graph, 1);
  assertEquals(results.distances.get(3), 2);  // La distance la plus courte attendue au sommet 3 est de 2
});
