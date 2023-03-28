module.exports = async (ctx, next) => {
  const adminIDs = process.env.ADMIN_ID.split(' ');
  const isAdmin = adminIDs.includes(ctx.from.id.toString());
  
  if (isAdmin) {
    await next();
    return;
  }

  await ctx.reply('Даний функціонал не доступний');
}