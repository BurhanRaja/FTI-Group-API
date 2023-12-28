const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      is_admin: DataTypes.STRING,
      status: DataTypes.STRING,
      roleid: DataTypes.INTEGER,
      teamid: DataTypes.INTEGER,
    },
    {
      timestamps: true,
    }
  );

  return User;
};
