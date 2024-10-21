const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
const { Pokemon, Tipo } = require('../models');

const { Op } = require('sequelize');
// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listPokemon = async (req, res) => {
    try {
        const pokemones = await db.pokemones.findAll();
        res.json(pokemones);
    } catch (error) {
        sendError500(error);
    }
}

exports.getPokemonById = async (req, res) => {
    const id = req.params.id;
    try {
        const pokemon = await getPokemonOr404(id, res);
        if (!pokemon) {
            return;
        }
        res.json(pokemon);
    } catch (error) {
        sendError500(error);
    }
}

exports.createPokemon = async (req, res) => {
    const requiredFields = ['nombre', 'nroPokedex', 'descripcion', 'hp', 'attack',
        'defense', 'spattack', 'spdefense', 'speed', 'habilidades', 'tipos'];

    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }

    try {
        const habilidades = req.body.habilidades;
        const tipos = req.body.tipos;

        const pokemon = {
            nombre: req.body.nombre,
            nroPokedex: req.body.nroPokedex,
            descripcion: req.body.descripcion,
            hp: req.body.hp,
            attack: req.body.attack,
            defense: req.body.defense,
            spattack: req.body.spattack,
            spdefense: req.body.spdefense,
            speed: req.body.speed,
            nivelEvolucion: req.body.nivelEvolucion || null,
            idEvolucionPrevia: req.body.idEvolucionPrevia,
            idEvolucionSiguiente: req.body.idEvolucionSiguiente,
            idHabilidad1: habilidades[0],
            idHabilidad2: habilidades[1] || null,
            idHabilidad3: habilidades[2] || null,
            idTipo1: tipos[0],
            idTipo2: tipos[1] || null
        };

        const pokemonCreado = await db.pokemones.create(pokemon);

        res.status(201).json(pokemonCreado);
    } catch (error) {
        sendError500(error);
    }
};

exports.updatePokemonPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const pokemon = await getPokemonOr404(id, res);
        if (!pokemon) {
            return;
        }
        pokemon.nombre = req.body.nombre || pokemon.nombre;
        pokemon.nroPokedex = req.body.nroPokedex || pokemon.nroPokedex;
        pokemon.descripcion = req.body.descripcion || pokemon.descripcion;
        pokemon.hp = req.body.hp || pokemon.hp;
        pokemon.attack = req.body.attack || pokemon.attack;
        pokemon.defense = req.body.defense || pokemon.defense;
        pokemon.spattack = req.body.spattack || pokemon.spattack;
        pokemon.spdefense = req.body.spdefense || pokemon.spdefense;
        pokemon.speed = req.body.speed || pokemon.speed;
        pokemon.nivelEvolucion = req.body.nivelEvolucion || pokemon.nivelEvolucion || null;
        pokemon.idEvolucionPrevia = req.body.idEvolucionPrevia || pokemon.idEvolucionPrevia || null;
        pokemon.idEvolucionSiguiente = req.body.idEvolucionSiguiente || pokemon.idEvolucionSiguiente || null;
        await pokemon.save();
        res.json(pokemon);
    } catch (error) {
        sendError500(error);
    }
}
exports.updatePokemonPut = async (req, res) => {
    const id = req.params.id;
    try {
        const pokemon = await getPokemonOr404(id, res);
        if (!pokemon) {
            return;
        }

        const requiredFields = ['nombre', 'nroPokedex', 'descripcion', 'hp', 'attack',
            'defense', 'spattack', 'spdefense', 'speed', 'habilidades', 'tipos'];

        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }

        const habilidades = req.body.habilidades;
        const tipos = req.body.tipos;

        pokemon.nombre = req.body.nombre;
        pokemon.nroPokedex = req.body.nroPokedex;
        pokemon.descripcion = req.body.descripcion;
        pokemon.hp = req.body.hp;
        pokemon.attack = req.body.attack;
        pokemon.defense = req.body.defense;
        pokemon.spattack = req.body.spattack;
        pokemon.spdefense = req.body.spdefense;
        pokemon.speed = req.body.speed;
        pokemon.nivelEvolucion = req.body.nivelEvolucion || null;
        pokemon.idEvolucionPrevia = req.body.idEvolucionPrevia;
        pokemon.idEvolucionSiguiente = req.body.idEvolucionSiguiente;
        pokemon.idHabilidad1 = habilidades[0];
        pokemon.idHabilidad2 = habilidades[1] || null;
        pokemon.idHabilidad3 = habilidades[2] || null;
        pokemon.idTipo1 = tipos[0];
        pokemon.idTipo2 = tipos[1] || null;

        await pokemon.save();

        res.json(pokemon);
    } catch (error) {
        sendError500(error);
    }
};

exports.deletePokemon = async (req, res) => {
    const id = req.params.id;
    try {
        const pokemon = await getPokemonOr404(id, res);
        if (!pokemon) {
            return;
        }
        await pokemon.destroy();
        res.json({
            msg: 'Pokemon eliminado correctamente'
        });
    } catch (error) {
        sendError500(error);
    }
}
exports.uploadPicture = async (req, res) => {
    const id = req.params.id;
    try {
        const pokemon = await getPokemonOr404(id, res);
        if (!pokemon) {
            return;
        }
        if (!req.files) {
            res.status(400).json({
                msg: 'No se ha enviado el archivo'
            });
            return;
        }
        const file = req.files.fotoPerfil;
        const fileName = pokemon.id + '.jpg';
        file.mv(`public/pokemones/${fileName}`);
        await pokemon.save();
        res.json(pokemon);
    } catch (error) {
        sendError500(error);
    }
}
async function getPokemonOr404(id, res) {
    const pokemon = await db.pokemones.findByPk(id);
    if (!pokemon) {
        res.status(404).json({
            msg: 'Pokemon no encontrado'
        });
        return;
    }
    return pokemon;
};

exports.buscarPokemon = async (req, res) => {
    console.log(req.query);
    try {
        const { q } = req.query;
        console.log("Q:", q);

        if (!q) {
            return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda.' });
        }
        const tipos = await db.tipos.findAll({
            where: { nombre: { [Op.like]: `%${q}%` } },
            attributes: ['id']
        });

        const tipoIds = tipos.map(tipo => tipo.id);

        const resultados = await db.pokemones.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${q}%` } },
                    { nroPokedex: { [Op.like]: `%${q}%` } },
                    { idTipo1: { [Op.in]: tipoIds } },
                    { idTipo2: { [Op.in]: tipoIds } }

                ]
            },
            include: [
                { model: db.tipos, as: 'Tipo1', attributes: ['id', 'nombre'] },
                { model: db.tipos, as: 'Tipo2', attributes: ['id', 'nombre'] }
            ]

        });
        console.log("R--" + resultados);
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron pokémones.' });
        }

        res.status(200).json(resultados);
        return resultados;

    } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        res.status(500).json({ error: 'Error al buscar Pokémon' });
    }
};

exports.buscarPokemonCorrecto = async (req, res) => {
    console.log("********");
    console.log('Controlador correcto llamado'); 
    const { q } = req.query;

    try {
        const resultados = await Pokemon.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${q}%` } },
                    { idTipo1: { [Op.like]: `%${q}%` } },
                    { idTipo2: { [Op.like]: `%${q}%` } }
                ]
            }
        });

        if (resultados.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron pokémones' });
        }

        res.status(200).json(resultados);
    } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        res.status(500).json({ error: 'Error al realizar la búsqueda' });
    }
};
exports.getLineaEvolutiva = async (req, res) => {
    const idPokemonActual = req.params.id;
    console.log(`ID del Pokémon actual recibido: ${idPokemonActual}`);

    try {
        const preEvoluciones = [];
        const postEvoluciones = [];
        const pokemonIds = new Set();

        const agregarPokemon = (array, pokemon) => {
            if (!pokemonIds.has(pokemon.id)) {
                array.push({
                    id: pokemon.id,
                    nombre: pokemon.nombre,
                    idEvolucionSiguiente: pokemon.idEvolucionSiguiente
                });
                pokemonIds.add(pokemon.id);
                console.log(`Añadido a la lista: ${pokemon.nombre}`);
            }
        };

        // Buscar hacia atrás (pre-evoluciones)
        let pokemon = await db.pokemones.findByPk(idPokemonActual);
        console.log(`Pokémon actual encontrado: ${JSON.stringify(pokemon)}`);

        if (!pokemon) {
            console.log("Pokémon no encontrado");
            return res.status(404).json({ message: 'Pokémon no encontrado' });
        }

        let prePokemon = pokemon;
        while (prePokemon && prePokemon.idEvolucionPrevia) {
            console.log(`Buscando pre-evolución con ID: ${prePokemon.idEvolucionPrevia}`);
            prePokemon = await db.pokemones.findByPk(prePokemon.idEvolucionPrevia);
            if (prePokemon) preEvoluciones.unshift(prePokemon);
        }

        agregarPokemon(postEvoluciones, pokemon);

        // Buscar hacia adelante (evoluciones posteriores)
        while (pokemon && pokemon.idEvolucionSiguiente) {
            console.log(`Buscando evolución siguiente con ID: ${pokemon.idEvolucionSiguiente}`);
            pokemon = await db.pokemones.findByPk(pokemon.idEvolucionSiguiente);
            if (pokemon) agregarPokemon(postEvoluciones, pokemon);
        }

        const lineaEvolutiva = [...preEvoluciones, ...postEvoluciones];
        console.log("Línea evolutiva completa:", JSON.stringify(lineaEvolutiva));

        res.json(lineaEvolutiva);

    } catch (error) {
        console.error("Error al obtener la línea evolutiva:", error);
        res.status(500).json({ message: "Error al obtener la línea evolutiva" });
    }
};
