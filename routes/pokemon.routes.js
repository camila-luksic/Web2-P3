module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/pokemon.controller.js");

    router.get('/', controller.listPokemon);
    router.get("/buscar",controller.buscarPokemon);
    router.get("/buscarCorrecto",controller.buscarPokemonCorrecto);
    router.get('/:id', controller.getPokemonById);
    router.post('/', controller.createPokemon);
    router.put('/:id', controller.updatePokemonPut);
    router.patch('/:id', controller.updatePokemonPatch);
    router.delete('/:id', controller.deletePokemon);
    router.post('/:id/foto', controller.uploadPicture);

    router.get("/:id/linea-evolutiva",controller.getLineaEvolutiva);
    app.use('/Pokemones', router);

};