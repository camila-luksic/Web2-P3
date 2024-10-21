module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/habilidad.controller.js");

    router.get('/', controller.listHabilidad);
    router.get('/:id', controller.getHabilidadById);
    router.post('/', controller.createHabilidad);
    router.put('/:id', controller.updateHabilidadPut);
    router.patch('/:id', controller.updateHabilidadPatch);
    router.delete('/:id', controller.deleteHabilidad);
    app.use('/Habilidades', router);

};