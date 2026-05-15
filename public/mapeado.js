const mapElement = document.getElementById('map');
const canvas = document.getElementById('canvas-overlay');
const ctx = canvas.getContext('2d');

// Ajustar tamaño inicial del canvas
function resizeCanvas() {
    canvas.width = mapElement.clientWidth;
    canvas.height = mapElement.clientHeight;
}
resizeCanvas();

// Colocar el canvas encima del mapa
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.pointerEvents = "none";
mapElement.appendChild(canvas);

// Inicializar el mapa
const map = L.map('map').setView([-35.4232, -71.6554], 8.4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función de estilo para GeoJSON
function style(feature) {
    return {
        color: "#000000",
        weight: 1.5,
        opacity: 1,
        fillColor: getColor(feature.properties.nivel_incidente),
        fillOpacity: 0.5
    };
}

function onEachFeature(feature, layer) {
    console.log(feature.properties);
}

function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(`
            <b>Comuna:</b> ${feature.properties.Comuna} <br>
            <b>Nivel de incidentes:</b> ${feature.properties.nivel_incidente} <br>
            <b>Densidad poblacional:</b> ${feature.properties.densidad_poblacional}
        `);
    }
}

fetch('chile_regiones.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });

// Obtener color según nivel
function getColor(nivel) {
    return nivel > 0.8 ? "#ff0000" :
           nivel > 0.6 ? "#ff8800" :
           nivel > 0.4 ? "#e4c600ff" :
           nivel > 0.2 ? "#00ff00" :
           nivel > 0   ? "#ffffff" :
                         "#ffffff";
}

// Función para convertir coordenadas a píxeles
function latLonToPixel(lat, lon) {
    const point = map.latLngToContainerPoint([lat, lon]);
    return { x: point.x, y: point.y };
}

// Variable global para guardar datos
let datosIA = [];

// Función que dibuja todos los píxeles
function dibujarPixeles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    datosIA.forEach(dato => {
        const pixel = latLonToPixel(dato.lat, dato.lon);
        const color = getColor(dato.nivel);
        ctx.fillStyle = color;
        ctx.fillRect(pixel.x, pixel.y, 11.5, 11.5);
    });
}

// Escuchar eventos para redibujar
map.on('move zoom resize', () => {
    resizeCanvas();
    dibujarPixeles();
});

// Cargar datos de la IA y dibujar por primera vez
fetch("/api/coordenadas")
    .then(response => response.json())
    .then(datos => {
        datosIA = datos.map(d => ({
            lat: d.lat,
            lon: d.lon,
            nivel: d.nivel
        }));
        dibujarPixeles();
    })
    .catch(error => console.error("Error cargando coordenadas:", error));

    /*
    function cargarCoordenadas() {
    fetch("/api/coordenadas")
        .then(res => res.json())
        .then(datos => {
            datosIA = datos;
            dibujarPixeles();
        });
}

setInterval(cargarCoordenadas, 5000);
*/