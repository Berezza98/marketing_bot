const Sequelize = require('sequelize');
const UserViews = require('../models/UserViews');

class Statistics {
  async write(userId, postTitle) {
    try {
      const existedRow = await UserViews.findOne({
        where: {
          telegramId: userId,
          postTitle
        }
      });
  
      if (existedRow) return;
  
      const newRow = new UserViews({
        telegramId: userId,
        postTitle
      });
  
      await newRow.save();
    } catch (e) {
      console.log('Statistics write ERROR: ', e);
    }
  }

  async getUniqueUsersCount() {
    try {
      const uniqueUsersCount = await UserViews.count({
        distinct: true,
        col: 'telegramId'
      });

      return uniqueUsersCount;
    } catch (e) {
      console.log('Statistics getUniqueUsersCount ERROR: ', e);
    }
  }

  async getStatisticsByPostTitle() {
    try {
      const groupedByTitle = await UserViews.findAll({
        group: ['postTitle'],
        attributes: {
          include: ['postTitle', [Sequelize.fn('COUNT', Sequelize.col('postTitle')), 'total']]
        }
      });

      return groupedByTitle;
    } catch (e) {
      console.log('Statistics getStatisticsByPostTitle ERROR: ', e);
    }
  }
}

module.exports = new Statistics();