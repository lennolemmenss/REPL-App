const readline = require('readline');
const { Sequelize } = require('sequelize');
const createUserModel = require('./models/User');  // Import the User model creator

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'command> '
});

// Function to prompt for connection string and initialize Sequelize
async function initializeDatabase() {
    return new Promise((resolve) => {
        rl.question('Please enter your PostgreSQL connection string: ', (connectionString) => {
            const sequelize = new Sequelize(connectionString, {
                dialect: 'postgres',
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                }
            });

            resolve(sequelize);
        });
    });
}

// Synchronize database
async function syncDatabase(sequelize) {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized");
    } catch (error) {
        console.error("Error synchronizing the database:", error);
    }
}

// Function to execute raw SQL queries
async function executeQuery(sequelize, sqlQuery) {
    try {
        const [results, metadata] = await sequelize.query(sqlQuery, {
            type: sequelize.QueryTypes.SELECT,
            raw: true
        });

        if (!results || results.length === 0) {
            console.log('Query executed successfully. No results to display.');
            return;
        }

        console.table(results);

    } catch (err) {
        console.error('Error executing query:', err.message);
    }
}

// Main function
async function main() {
    const sequelize = await initializeDatabase();  // Initialize database with user input
    const User = createUserModel(sequelize);  // Initialize User model with sequelize

    await syncDatabase(sequelize);
    
    console.log("Available commands: add, delete, update, list, tables, info <table_name>, query <sql>, help, exit");
    
    rl.prompt();

    rl.on('line', async (input) => {
        await handleCommand(input.trim(), sequelize, User);  // Pass sequelize instance and User model
        rl.prompt();
    });

    rl.on('close', () => {
        console.log('Exiting REPL...');
        process.exit(0);
    });
}

// Show all users
async function showUsers(User) {
    try {
        const users = await User.findAll({
            raw: true
        });
        console.table(users);
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}

// Additional Features
async function showTables(sequelize) {
    try {
        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log("Available tables:");
        console.table(tables.map(table => ({ tableName: table })));
    } catch (error) {
        console.error("Error fetching tables:", error);
    }
}

async function describeTable(sequelize, tableName) {
    try {
        const tableDescription = await sequelize.getQueryInterface().describeTable(tableName);
        console.log(`Structure of table '${tableName}':`);
        console.table(tableDescription);
    } catch (err) {
        console.error(`Table '${tableName}' does not exist!`);
    }
}

function helpInfo() {
    console.log("\nAvailable commands:");
    console.log("  add <LastName> <FirstName> <Age>    - Add a new user");
    console.log("  delete <PersonID>                   - Delete a user by ID");
    console.log("  update <PersonID> <LastName> <FirstName> <Age> - Update a user");
    console.log("  list                               - Show all users");
    console.log("  tables                             - Show all tables");
    console.log("  info <table_name>                  - Show table structure");
    console.log("  query <sql>                        - Execute raw SQL query");
    console.log("  help                               - Show this help");
    console.log("  exit                               - Exit the program\n");
}

// Handle REPL commands
async function handleCommand(input, sequelize, User) {
    const args = input.split(' ');
    const command = args[0].toLowerCase();

    try {
        switch (command) {
            case 'query':
                if (args.length >= 2) {
                    const sqlQuery = args.slice(1).join(' ');
                    await executeQuery(sequelize, sqlQuery);
                } else {
                    console.log('Usage: query <SQL statement>');
                }
                break;

            case 'add':
                if (args.length === 4) {
                    const lastName = args[1];
                    const firstName = args[2];
                    const age = parseInt(args[3]);
                    if (!isNaN(age)) {
                        await User.create({ LastName: lastName, FirstName: firstName, Age: age });
                        console.log('User added successfully.');
                    } else {
                        console.log('Invalid age');
                    }
                } else {
                    console.log('Usage: add <LastName> <FirstName> <Age>');
                }
                break;

            case 'delete':
                if (args.length === 2) {
                    const personID = parseInt(args[1]);
                    if (!isNaN(personID)) {
                        await User.destroy({ where: { id: personID } });
                        console.log('User deleted successfully.');
                    } else {
                        console.log('Invalid PersonID');
                    }
                } else {
                    console.log('Usage: delete <PersonID>');
                }
                break;

            case 'update':
                if (args.length === 5) {
                    const personID = parseInt(args[1]);
                    const lastName = args[2];
                    const firstName = args[3];
                    const age = parseInt(args[4]);
                    if (!isNaN(personID) && !isNaN(age)) {
                        await User.update(
                            { LastName: lastName, FirstName: firstName, Age: age },
                            { where: { id: personID } }
                        );
                        console.log('User updated successfully.');
                    } else {
                        console.log('Invalid PersonID or Age');
                    }
                } else {
                    console.log('Usage: update <PersonID> <LastName> <FirstName> <Age>');
                }
                break;

            case 'list':
                await showUsers(User);
                break;

            case 'info':
                if (args.length === 2) {
                    await describeTable(sequelize, args[1]);
                } else {
                    console.log('Usage: info <table_name>');
                }
                break;

            case 'tables':
                await showTables(sequelize);
                break;

            case 'help':
                helpInfo();
                break;

            case 'exit':
                rl.close();
                break;

            default:
                if (input.trim()) {
                    console.log('Unknown command. Type "help" for available commands.');
                }
                break;
        }
    } catch (error) {
        console.error('Error executing command:', error.message);
    }
}

main();
