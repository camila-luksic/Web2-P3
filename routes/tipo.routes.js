module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/tipo.controller.js");

    router.get('/', controller.listTipo);
    router.get('/:id', controller.getTipoById);
    router.post('/', controller.createTipo);
    router.put('/:id', controller.updateTipoPut);
    router.patch('/:id', controller.updateTipoPatch);
    router.delete('/:id', controller.deleteTipo);
    app.use('/Tipos', router);

};