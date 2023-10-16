require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const { fmt, bold, link } = require('telegraf/format');

const data = require('./data.js');
const { BACK_BTN } = require('./consts');
const isAdmin = require('./middlewares/isAdmin.js');
const { sequelize } = require('./models/UserViews.js');
const statistics = require('./services/Statistics.js');

const bot = new Telegraf(process.env.TELEGRAM_KEY);

const getKeyboard = () => {
  const buttons = data.topics.map(topic => topic.button);

  return Markup.keyboard(buttons.map(btn => [btn])).resize();
}

bot.start((ctx) => ctx.reply(
  'Оберіть тему:',
  getKeyboard()
));

bot.command('statistics', isAdmin, async (ctx) => {
  const uniqueUsersCount = await statistics.getUniqueUsersCount();
  const uniqueUsersCountByPost = await statistics.getStatisticsByPostTitle();

  const byPostTemplate = uniqueUsersCountByPost.map((post) => `${post.get('postTitle')}: ${post.get('total')}\n\n`);
  const template = fmt`${bold('Загальна кількість унікальних користувачів: ')}${uniqueUsersCount}\n\n${byPostTemplate.join('')}`;

  await ctx.reply(template);
});

bot.hears(BACK_BTN, (ctx) => ctx.reply(
  'Оберіть тему:',
  getKeyboard()
));

for (const topic of data.topics) {
  bot.hears(topic.button, async (ctx) => {
    statistics.write(ctx.from.id.toString(), topic.button);

    if (!topic.photo) {
      return ctx.reply(topic.answer, Markup.keyboard([[BACK_BTN]]).resize());
    }

    await ctx.reply(topic.answer, Markup.keyboard([[BACK_BTN]]).resize());
    await ctx.sendPhoto(topic.photo);
  });
}

function gracefullShotdown() {
  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection has been established successfully.');

    const options = process.env.NODE_ENV === 'production'
    ? {
        webhook: {
          domain: 'marketing-bot.amazon-extension.com',
          port: 80
        }
      } : {};

    await bot.launch(options)
    gracefullShotdown();
    console.log(process.env.NODE_ENV === 'production' ? 'Bot Launched in PROD mode!' : 'Bot Launched in DEV mode!');
  } catch (error) {
    console.error('Start error: ', error);
  }
}

main();
