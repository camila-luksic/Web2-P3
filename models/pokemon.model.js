module.exports = (sequelize, Sequelize) => {
    const Pokemon = sequelize.define("pokemon", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nroPokedex: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING,
            allowNull: false
        },
        idHabilidad1:{
            type: Sequelize.INTEGER,
            allowNull: false 
        },
        idHabilidad2:{
            type: Sequelize.INTEGER
        },
        idHabilidad3:{
            type: Sequelize.INTEGER
        },
        idTipo1:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        idTipo2:{
            type: Sequelize.INTEGER
        },
        hp: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        attack: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        defense: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        spattack: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        spdefense: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        speed: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nivelEvolucion: {
            type: Sequelize.INTEGER
        },
        idEvolucionPrevia: {
            type: Sequelize.INTEGER
        },
        idEvolucionSiguiente: {
            type: Sequelize.INTEGER
        }
        
    });
    return Pokemon;
}