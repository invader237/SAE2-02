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

export { saveGraphToFile };
