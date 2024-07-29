const express = require('express');
const fs = require('fs');

const server = express();
server.use(express.json());

const filePath = './koders.json';

// Función para leer koders del archivo JSON
function readKoders() {
    if (!fs.existsSync(filePath)) {
        writeKoders([]); // Inicializar con un arreglo vacío si el archivo no existe
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// Función para escribir koders en el archivo JSON
function writeKoders(koders) {
    fs.writeFileSync(filePath, JSON.stringify(koders, null, 2));
}

// Ruta de prueba
server.get("/", (request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello World");
    response.end();
});

// Listar koders
server.get("/koders", (request, response) => {
    const koders = readKoders();
    response.status(200).json(koders);
});

// Crear un koder nuevo
server.post("/koders", (request, response) => {
    const name = request.body.name;

    if (!name) {
        response.status(400).json({
            message: "El nombre es requerido"
        });
        return;
    }

    const koders = readKoders();
    koders.push(name);
    writeKoders(koders);

    response.status(201).json(koders);
});

// Borrar un koder por nombre
server.delete("/koders/:name", (request, response) => {
    const name = request.params.name;
    let koders = readKoders();

    const newKoders = koders.filter(
        (koder) => koder.toLowerCase() !== name.toLowerCase()
    );

    if (newKoders.length === koders.length) {
        response.status(404).json({
            message: `El koder con el nombre ${name} no fue encontrado`
        });
        return;
    }

    writeKoders(newKoders);
    response.status(200).json(newKoders);
});

// Eliminar todos los koders
server.delete("/koders", (request, response) => {
    writeKoders([]);
    response.status(200).json([]);
});

server.listen(8081, () => {
    console.log("Server is running on port 8081");
});
