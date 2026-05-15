const opciones = document.getElementById("opciones");
const items = document.querySelectorAll(".dropdown-item");

document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown-container")) {
        opciones.classList.add("hidden");
    }
});

// Limitar fecha máxima
const today = new Date();

const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 30);

const maxDateFormatted = maxDate.toISOString().split('T')[0];

document.getElementById("filtrarFecha").max = maxDateFormatted;

// Cargar incendios
function cargarIncendios(filtros = {}) {
    const params = new URLSearchParams(filtros);

    fetch(`/api/pacientes?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            const tableBody = document.getElementById("table");
            tableBody.innerHTML = "";

            data.forEach(incendio => {
                tableBody.innerHTML += `
                <tr>
                    <td>${incendio.nombre}</td>
                    <td>${incendio.region}</td>
                    <td>${incendio.comuna}</td>
                    <td>${incendio.fecha}</td>
                    <td>${incendio.estado}</td>
                    <td>${incendio.superficie}</td>
                </tr>`;
            });
        });
}

// Filtrar
function predecir() {
    const fecha = document.getElementById("predecir").value;

    const predecir = {};
    if (fecha) predecir.fecha = fecha;

    cargarIncendios(predecir);
}

// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
    cargarIncendios();
});

