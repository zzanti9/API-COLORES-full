require("dotenv").config();
const {MongoClient,ObjectId } = require("mongodb");

function conectar(){
    return MongoClient.connect(process.env.DB_URL);
}

/*
//PRUEBA node db.js
conectar()
.then(conexion => {
    console.log("conect")
})
.catch(error => {
    console.log("...error")
})
*/

// AHORA EMPEZAMOS API
function leerColores(){
    return new Promise(async (ok,ko) => {       

        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let colores = await coleccion.find({}).toArray();

            conexion.close();

            ok(colores);

        }catch(error){

            ko({ error : "error en base de datos" });
        }
    });
}

/*
PRUEBA (node db.js)

leerColores()
.then(colores => console.log(colores))
.catch(colores => console.log(colores))
*/

function crearColor(color){
    return new Promise(async (ok,ko) => {       

        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let {insertedId} = await coleccion.insertOne(color); // insertedId despues de la prueba, donde me da esa kay. Antes lo llamamos reusltado(ejemplo).

            conexion.close();

            ok({id : insertedId});

        }catch(error){

            ko({ error : "error en base de datos" });
        }
    });
}

/*
//PRUEBA 
crearColor({r:23,g:234,b:123})
.then(algo => console.log(algo));
*/

function borrarColor(id){
    return new Promise(async (ok,ko) => {       

        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let {deletedCount} = await coleccion.deleteOne({_id : new ObjectId(id) });

            conexion.close();

            ok(deletedCount);

        }catch(error){

            ko({ error : "error en base de datos" });
        }
    });
}

/*
//PRUEBA (llamando a la let resultado)

borrarColor('65eef2424d14e55fdace8af4')
.then(algo => console.log(algo))
// nos quedamos con el deletedCount como key
*/

module.exports={conectar,leerColores,borrarColor,crearColor};





