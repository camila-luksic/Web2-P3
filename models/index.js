const dbConfig=require("../config/db.config.js");
const Sequelize=require("sequelize");
const sequelize=new Sequelize(
    dbConfig.Db,
    dbConfig.User,
    dbConfig.Password,
    {
        host:dbConfig.Host,
        port:dbConfig.Port,
        dialect:"mysql",
    }
);

const db={};
db.Sequelize=Sequelize;
db.sequelize=sequelize;

db.pokemones=require("./pokemon.model.js")(sequelize,Sequelize);
db.tipos=require("./tipo.model.js")(sequelize,Sequelize);
db.habilidades=require("./habilidad.model.js")(sequelize,Sequelize);

db.pokemones.belongsTo(db.habilidades, { as: 'Habilidad1', foreignKey: 'idHabilidad1' });
db.pokemones.belongsTo(db.habilidades, { as: 'Habilidad2', foreignKey: 'idHabilidad2' });
db.pokemones.belongsTo(db.habilidades, { as: 'Habilidad3', foreignKey: 'idHabilidad3' });

db.pokemones.belongsTo(db.tipos, { as: 'Tipo1', foreignKey: 'idTipo1' });
db.pokemones.belongsTo(db.tipos, { as: 'Tipo2', foreignKey: 'idTipo2' });



module.exports = db;
