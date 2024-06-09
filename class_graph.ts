// Classe principale pour la gestion des graphes
class Graph {
    // Liste d'adjacence stockant les sommets et les arcs
    private adjacencyList: Map<number, Map<number, number>> = new Map();

    // Ajoute un sommet au graphe
    addVertex(vertex: number): void {
        if (vertex < 0) {
            throw new Error("Le numéro du sommet ne peut pas être négatif.");
        }
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, new Map());
        }
    }

    // Ajoute un arc entre deux sommets avec un poids donné
    addEdge(source: number, destination: number, weight: number): void {
        if (weight < 0) {
            throw new Error("Les poids négatifs ne sont pas autorisés.");
        }
        if (!this.adjacencyList.has(source) || !this.adjacencyList.has(destination)) {
            throw new Error("Un ou plusieurs sommets spécifiés n'existent pas.");
        }
        if (source === destination) {
            throw new Error("Les boucles ne sont pas autorisées.");
        }
        if (this.adjacencyList.get(source)?.has(destination)) {
            throw new Error("Un arc entre ces sommets existe déjà.");
        }
        this.adjacencyList.get(source)?.set(destination, weight);
    }

    // Supprime un arc entre deux sommets
    removeEdge(source: number, destination: number): void {
        if (!this.adjacencyList.has(source) || !this.adjacencyList.get(source)?.has(destination)) {
            throw new Error("L'arc à supprimer n'existe pas.");
        }
        this.adjacencyList.get(source)?.delete(destination);
    }

    // Supprime un sommet et tous les arcs associés
    removeVertex(vertex: number): void {
        if (!this.adjacencyList.has(vertex)) {
            throw new Error("Le sommet à supprimer n'existe pas.");
        }
        this.adjacencyList.delete(vertex);
        this.adjacencyList.forEach(edges => edges.delete(vertex));
    }

    // Redimensionne le graphe à une nouvelle taille
    resizeGraph(newSize: number): void {
        const currentSize = this.adjacencyList.size;
        if (newSize < currentSize) {
            for (let i = currentSize - 1; i >= newSize; i--) {
                this.removeVertex(i);
            }
        } else if (newSize > currentSize) {
            for (let i = currentSize; i < newSize; i++) {
                this.addVertex(i);
            }
        }
    }

    // Renvoie le nombre de sommets dans le graphe
    getVertexCount(): number {
        return this.adjacencyList.size;
    }

    // Renvoie le nombre d'arcs dans le graphe
    getEdgeCount(): number {
        let count = 0;
        this.adjacencyList.forEach(edges => count += edges.size);
        return count;
    }

    // Renvoie les voisins (arcs sortants) d'un sommet donné
    getNeighbors(vertex: number): Map<number, number> {
        if (!this.adjacencyList.has(vertex)) {
            throw new Error("Le sommet demandé n'existe pas.");
        }
        return this.adjacencyList.get(vertex) || new Map();
    }

    // Renvoie la liste d'adjacence du graphe
    public getAdjacencyList(): Map<number, Map<number, number>> {
        return this.adjacencyList;
    }

    // Enregistre le graphe dans un fichier au format liste d'adjacence
    async saveGraphToFile(filePath: string): Promise<void> {
        if (!filePath) {
            throw new Error("Le chemin du fichier n'est pas spécifié.");
        }
        let data = '';
        let edgeCount = 0;
        const sortedVertices = Array.from(this.adjacencyList.keys()).sort((a, b) => a - b);
        sortedVertices.forEach(source => {
            const edges = this.adjacencyList.get(source);
            if (edges) {
                edges.forEach((weight, destination) => {
                    data += `${source} ${destination} ${weight}\n`;
                    edgeCount++;
                });
            }
        });
        const header = `${this.getVertexCount()} ${edgeCount}\n`;
        data = header + data;

        try {
            await Deno.writeTextFile(filePath, data);
            console.log("Graphe sauvegardé au format liste d'adjacence avec succès.");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du graphe:", error);
            throw error;
        }
    }
}

export { Graph }
