const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 3000;

/*El siguiente codigo nos permite identificar
cual es la base de datos que se va a ocupar*/
const db =mysql.createConnection({
    host: process.env.HOST ||'srv5.cpanelhost.cl', //srv5.cpanelhost.cl  localhost
    user: process.env.USER ||'cal115531_cal115531', //cal115531  Tshm4466
    password: process.env.PWD ||'TpVZqDXkDTGVQkvGVTMH', //TpVZqDXkDTGVQkvGVTMH  hM67RvYu*38gF4L
    database: process.env.DB ||'cal115531_pacientes',
    port: process.env.DBPORT || 3306
});


/*El siguiente codigo nos ayuda a comprobar si la
conexion se realiso exitosamente o no y da la razon 
de porque*/
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Se conecto la base de datos MySQL: incendios');
});



app.get("/api/pacientes", (req, res) => {
    db.query("SELECT * FROM reporte", (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error en reporte" });
            return;
        }
        res.json(results);
    });
});

app.get("/api/coordenadas", (req, res) => {
    db.query("SELECT * FROM coordenadas", (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error en coordenadas" });
            return;
        }
        res.json(results);
    });
});

/*El siguiente codigo nos permite comprobar si se 
pueden entregar los datos que se piden*/
/*app.get("/reporte", (req, res) => {
    connection.query('SELECT * FROM reporte', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error obteniendo datosWHERE id = ?');
            return;
        }
        res.json(results[0]); 
        console.log("funciono");
    });
});*/

app.use(express.static("public"));

/*El siguiente codigo permite que se ejecute desde 
el esta pestaña a la pagina "index.html" y a su vez
permite que los datos de la base de datos puedan 
estar en el HTML y a su paso pueda estar en el 
sitio web*/

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});


//  https://bitbiosis.cl/mapa_predictivo/
//srv5.cpanelhost.cl

//package.json file is required. Add package.json file to run "npm install"

//app.listen(PORT, '0.0.0.0', () =>                http://localhost: