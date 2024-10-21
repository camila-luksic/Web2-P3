module.exports=app=>{

    require("./habilidad.routes.js")(app);
    require("./tipo.routes.js")(app);
    require("./pokemon.routes.js")(app);
    
}