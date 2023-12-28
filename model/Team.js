const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Team = sequelize.define(
    "Team",
    {
      name: DataTypes.STRING,
      adminid: DataTypes.INTEGER,
    },
    {
      timestamps: true,
    }
  );

  return Team;
};
