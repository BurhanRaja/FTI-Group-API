const { Sequelize } = require("sequelize");
const { dbName, username, password, host } = require("./db.config");

const sequelize = new Sequelize(dbName, username, password, {
  host: host,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((err) => {
    console.log(err);
  });

db = {};

db.sequelize = sequelize;

db.user = require("../model/User")(sequelize);
db.team = require("../model/Team")(sequelize);
db.role = require("../model/Role")(sequelize);
db.permission = require("../model/Permission")(sequelize);

module.exports = db;
