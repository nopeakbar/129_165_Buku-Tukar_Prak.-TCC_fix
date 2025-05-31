import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import Exchange from './Exchange.js'

const ExchangeHistory = sequelize.define('ExchangeHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  exchangeRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'exchangeRequestId'
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'exchanges_history',
  timestamps: false
})

ExchangeHistory.belongsTo(Exchange, {
  foreignKey: 'exchangeRequestId',
  as: 'exchange'
})

export default ExchangeHistory
