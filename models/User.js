const { Model, DataTypes } = require('sequelize');;
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
            },
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [4],
            },
          },
        },
        {
          hooks: {
              //hash password when creating user data
              async beforeCreate(newUserData) {
                  newUserData.password = await bcrypt.hash(newUserData.password, 10);
                  return newUserData;
              },
              //hash password when updating user data
             async beforeUpdate(updatedUserData) {
                 updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                 return updatedUserData;
             }
          },
          sequelize,
          timestamps: false,
          freezeTableName: true,
          underscored: true,
          modelName: "user",
    }
);

module.exports = User;