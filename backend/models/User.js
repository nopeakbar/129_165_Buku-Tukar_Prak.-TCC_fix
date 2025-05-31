// models/User.js
import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  whatsappNumber: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  addressUser: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING(500), // Increased length for full GCS URLs
    allowNull: true,
    field: 'avatarUrl'
  },
  // refresh_token: {
  //   type: DataTypes.TEXT,
  //   allowNull: true
  // }
}, {
  tableName: 'users',
  timestamps: true
})

export default User