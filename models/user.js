const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');


class User extends Model {
    async checkPassword(pass) {
        try {
          return await bcrypt.compare(pass, this.password);
        } catch (err) {
          console.log(err);
        }
      }
}

User.init({
    
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, 
{
    hooks: {
        beforeCreate: async (newUser) => {
          newUser.password = await bcrypt.hash(newUser.password, 10);
          return newUser;
        },
        beforeUpdate: async (updatedUser) => {
          updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
          return updatedUser;
        },
      },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'User'
});


module.exports = User;
