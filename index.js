require("dotenv").config();

const express = require("express");
const {json} = require("body-parser");
const cors = require("cors")
const {leerColores,borrarColor,crearColor} = require("./db");


const servidor = express();

servidor.use(json()); // requiriendo body-parser
servidor.use(cors());

//servidor.use("/estaticos", express.static("./pruebas")); // CREO CARPETA CON LOS FICHEROS ESTATICOS (INDEX.html) Y EN ESTE MIDDLEWARE LO REQUERIRÉ


servidor.get("/colores", async (peticion,respuesta) =>{
    try{
        let colores = await leerColores();         

        respuesta.json(colores.map(({_id,r,g,b}) => { return { id : _id,r,g,b } } ));
        // ese return!
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);        
    }  
});

servidor.post("/colores/nuevo",async (peticion,respuesta,siguiente) =>{
    
    let {r,g,b} = peticion.body;
    
    let valido = true;

    [r,g,b].forEach(n => valido = valido && n >= 0 && n <=255);

    if(valido){
        try{

            let resultado = await crearColor({r,g,b});

            return respuesta.json(resultado);

        }catch(error){
            respuesta.status(500);
            
            return respuesta.json(error);            
        }
    }

    siguiente({ error : "parametros erróneos" });//invoca el error, el MW final. (HAY QUE PASARLE ESE ARGUMENTO A LA PETICION, arriba). HAY QUE PASARLE ALGO --> ({ ERROR : ""})    
});

servidor.delete("/colores/borrar/:id([a-f0-9]{24})",async (peticion,respuesta) =>{
    try{

        let cantidad = await borrarColor(peticion.params.id);

        respuesta.json({ resultado : cantidad > 0 ? "ok" : "ko"});

    }catch(error){

        respuesta.status(500);

        respuesta.json(error);
    }
});

servidor.use((error,peticion,respuesta,siguiente) => { // MW para capturar el error. Siempre al final de los MW
    respuesta.status(400);
    respuesta.json({ error: "error en la peticion" });
});

servidor.use((peticion,respuesta) => {
    respuesta.status(400);
    respuesta.json({ error : "recurso no encontrado" });
});

servidor.listen(process.env.PORT);