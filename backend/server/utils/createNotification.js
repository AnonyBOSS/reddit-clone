const Notification = require('../models/Notification');

async function createNotification({
  user, // who will receive notification
  type,
  sourceUser,
  sourcePost,
  sourceComment
}) {
  if (!user || !sourceUser) return;

  // Don't notify user about their own actions
  if (user.toString() === sourceUser.toString()) return;

  await Notification.create({
    user,
    type,
    sourceUser,
    sourcePost,
    sourceComment
  });
}

module.exports = createNotification;
