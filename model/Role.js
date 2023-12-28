const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      name: DataTypes.STRING,
    },
    {
      timestamp: true,
    }
  );
  return Role;
};
