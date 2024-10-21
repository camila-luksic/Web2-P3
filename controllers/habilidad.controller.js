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
exports.listHabilidad = async (req, res) => {
    try {
        const habilidades = await db.habilidades.findAll();
        res.json(habilidades);
    } catch (error) {
        sendError500(error);
    }
}

exports.getHabilidadById = async (req, res) => {
    const id = req.params.id;
    try {
        const habilidad = await getHabilidadOr404(id, res);
        if (!habilidad) {
            return;
        }
        res.json(habilidad);
    } catch (error) {
        sendError500(error);
    }
}

exports.createHabilidad = async (req, res) => {

    const requiredFields = ['nombre'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const habilidad = {
            nombre: req.body.nombre
        }
        const habilidadCreada = await db.habilidades.create(habilidad);

        res.status(201).json(habilidadCreada);
    } catch (error) {
        sendError500(error);
    }
}
exports.updateHabilidadPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const habilidad = await getHabilidadOr404(id, res);
        if (!habilidad) {
            return;
        }
        habilidad.nombre = req.body.nombre || habilidad.nombre;

        await habilidad.save();
        res.json(habilidad);
    } catch (error) {
        sendError500(error);
    }
}
exports.updateHabilidadPut = async (req, res) => {
    const id = req.params.id;
    try {
        const habilidad = await getHabilidadOr404(id, res);
        if (!habilidad) {
            return;
        }
        const requiredFields = ['nombre'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        habilidad.nombre = req.body.nombre;
        

        await habilidad.save();

        res.json(habilidad);
    } catch (error) {
        sendError500(error);
    }
}
exports.deleteHabilidad = async (req, res) => {
    const id = req.params.id;
    try {
        const habilidad = await getHabilidadOr404(id, res);
        if (!habilidad) {
            return;
        }
        await habilidad.destroy();
        res.json({
            msg: 'Habilidad eliminado correctamente'
        });
    } catch (error) {
        sendError500(error);
    }
}
async function getHabilidadOr404(id, res) {
    const habilidad = await db.habilidades.findByPk(id);
    if (!habilidad) {
        res.status(404).json({
            msg: 'Habilidad no encontrado'
        });
        return;
    }
    return habilidad;
}