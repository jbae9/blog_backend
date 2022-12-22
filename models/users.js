'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Users.hasMany(models.Posts, {foreignKey: 'userId'})
      models.Users.hasMany(models.Comments, {foreignKey: 'userId'})
    }
  }
  Users.init({
    userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
    nickname: {
        allowNull: false,
        type: DataTypes.STRING
      },
    password: {
        allowNull: false,
        type: DataTypes.STRING
      }
  }, {
    sequelize,
    modelName: 'Users',
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  return Users;
};