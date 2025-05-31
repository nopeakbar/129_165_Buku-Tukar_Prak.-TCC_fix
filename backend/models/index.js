import sequelize from '../config/database.js';
import User from './User.js';
import Book from './Book.js';
import Exchange from './Exchange.js';
import ExchangeHistory from './ExchangeHistory.js';

// User ↔ Book
Book.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
User.hasMany(Book, { foreignKey: 'userId', as: 'books' });

// Exchange ↔ Book
Exchange.belongsTo(Book, { foreignKey: 'offeredBookId', as: 'offeredBook' });
Exchange.belongsTo(Book, { foreignKey: 'requestedBookId', as: 'requestedBook' });

// Exchange ↔ User
Exchange.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Exchange.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// ExchangeHistory ↔ Exchange
Exchange.hasOne(ExchangeHistory, { foreignKey: 'exchangeRequestId', as: 'history' });
ExchangeHistory.belongsTo(Exchange, { foreignKey: 'exchangeRequestId', as: 'parentExchange' });

export { sequelize, User, Book, Exchange, ExchangeHistory };