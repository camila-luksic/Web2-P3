const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listTipo = async (req, res) => {
    try {
        const tipos = await db.tipos.findAll();
        res.json(tipos);
    } catch (error) {
        sendError500(error);
    }
}

exports.getTipoById = async (req, res) => {
    const id = req.params.id;
    try {
        const tipo = await getTipoOr404(id, res);
        if (!tipo) {
            return;
        }
        res.json(tipo);
    } catch (error) {
        sendError500(error);
    }
}

exports.createTipo = async (req, res) => {

    const requiredFields = ['nombre'];
    console.log("---", JSON.stringify(req.body, null, 2));

    console.log("---"+req.body);
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const tipo = {
            nombre: req.body.nombre
        }
        console.log("--"+req.body);

        const tipoCreada = await db.tipos.create(tipo);

        res.status(201).json(tipoCreada);
    } catch (error) {
        sendError500(error);
    }
}
exports.updateTipoPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const tipo = await getTipoOr404(id, res);
        if (!tipo) {
            return;
        }
        tipo.nombre = req.body.nombre || tipo.nombre;

        await tipo.save();
        res.json(tipo);
    } catch (error) {
        sendError500(error);
    }
}
exports.updateTipoPut = async (req, res) => {
    const id = req.params.id;
    try {
        const tipo = await getTipoOr404(id, res);
        if (!tipo) {
            return;
        }
        const requiredFields = ['nombre'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        tipo.nombre = req.body.nombre;
        

        await tipo.save();

        res.json(tipo);
    } catch (error) {
        sendError500(error);
    }
}
exports.deleteTipo = async (req, res) => {
    const id = req.params.id;
    try {
        const tipo = await getTipoOr404(id, res);
        if (!tipo) {
            return;
        }
        await tipo.destroy();
        res.json({
            msg: 'Tipo eliminado correctamente'
        });
    } catch (error) {
        sendError500(error);
    }
}
async function getTipoOr404(id, res) {
    const tipo = await db.tipos.findByPk(id);
    if (!tipo) {
        res.status(404).json({
            msg: 'tipo no encontrado'
        });
        return;
    }
    return tipo;
}