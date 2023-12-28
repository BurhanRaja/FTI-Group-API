const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Permission = sequelize.define(
    "Permission",
    {
      name: DataTypes.STRING,
      roleid: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      timestamp: true,
    }
  );

  return Permission;
};
