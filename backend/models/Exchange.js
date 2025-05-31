// src/models/Exchange.js
import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'
import Book from './Book.js'

const Exchange = sequelize.define('Exchange', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'requesterId',
    references: {
      model: User,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },

  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ownerId',
    references: {
      model: User,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },

  offeredBookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'offeredBookId',
    references: {
      model: Book,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },

  requestedBookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'requestedBookId',
    references: {
      model: Book,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },

  messages: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'messages'
  },

  location: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'location'
  },

  meetingDatetime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'meeting_datetime'
  },

  status: {
    type: DataTypes.ENUM(
      'pending',
      'accepted',
      'declined',
      'cancelled',
      'completed'
    ),
    allowNull: false,
    defaultValue: 'pending',
    field: 'status'
  }
}, {
  tableName: 'exchanges',
  timestamps: true
})

export default Exchange
