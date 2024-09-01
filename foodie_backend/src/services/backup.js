const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
require('dotenv').config(); // Load environment variables from .env file

// Load environment variables
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME || 'foodie_db';
const BACKUP_DIR = path.join(__dirname, 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

// Function to perform a full database backup
function backupDatabase() {
    const fileName = `backup-${DB_NAME}-${new Date().toISOString().slice(0, 10)}.sql.gz`;
    const filePath = path.join(BACKUP_DIR, fileName);

    const command = `mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} | gzip > ${filePath}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Backup error: ${stderr}`);
        } else {
            console.log(`Backup successful: ${filePath}`);
        }
    });
}

// Function to restore a database from a backup file
function restoreDatabase(backupFile) {
    const filePath = path.join(BACKUP_DIR, backupFile);

    if (fs.existsSync(filePath)) {
        const command = `gunzip < ${filePath} | mysql -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Restore error: ${stderr}`);
            } else {
                console.log(`Restore successful from: ${filePath}`);
            }
        });
    } else {
        console.error(`Backup file not found: ${filePath}`);
    }
}

// Schedule a daily backup at 2:00 AM
cron.schedule('0 2 * * *', () => {
    console.log('Starting daily backup...');
    backupDatabase();
});

console.log('Cron job set up to run daily backups at 2:00 AM.');

// Export functions for potential external use or testing
module.exports = { backupDatabase, restoreDatabase };
