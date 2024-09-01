const cron = require('node-cron');
const sendEmail = require('./mailService');
const runQuery = require('../db_operations/sql_operations')
// Example function to send reminder emails
const sendReminderEmails = (to, subject, text) => {
  // Define email content
  const emailContent = {
    to,
    subject,
    text
  };

  // Call the sendEmail function
  sendEmail(emailContent.to, emailContent.subject, emailContent.text);
};

// Schedule the task to run daily at 8 AM
cron.schedule('0 8 * * *', () => {
  console.log('Running daily task at 8 AM');

  const users = runQuery("select email from users where is_deleted = 'N'")
  if(users.status && users.value.length) {

    for(let user of users.value) {
        let email = user.email
        let username = user.name;
        let subject = "IT'S TIME TO HAVE SOME BREAKFAST";
        let text = "Because we are serving the best breakfast ot you. so why are you waiting";
        sendReminderEmails(email, subject, text);
    }
  }

}, {
  scheduled: true,
  timezone: 'Your/Timezone' // Replace with your timezone
});
