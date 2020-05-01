import Sequelize from 'sequelize';

import Recipient from '../app/models/Recipients';
import User from '../app/models/Users';
import Deliveryman from '../app/models/Deliverymans';

import databaseConfig from '../config/database';

const models = [Recipient, User, Deliveryman];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connetion = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connetion));
  }
}

export default new Database();
