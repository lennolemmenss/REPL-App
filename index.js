const readline = require('readline');
const sequelize = require('./models/db');
const User = require('./models/User'); 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'command> '
});

// Synchronize database
async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized");
    } catch (error) {
        console.error("Error synchronizing the database:", error);
    }
}

// New function to execute raw SQL queries
async function executeQuery(sqlQuery) {
    try {
        const [results, metadata] = await sequelize.query(sqlQuery, {
            type: sequelize.QueryTypes.SELECT,  // Force SELECT type for consistent output
            raw: true  // Get raw results
        });
        
        if (!results || results.length === 0) {
            console.log('Query executed successfully. No results to display.');
            return;
        }

        // If results are present, display them in a table format
        console.table(results);
        
    } catch (err) {
        console.error('Error executing query:', err.message);
    }
}

// Main function
async function main() {
    await syncDatabase();
   
    console.log("Available commands: add, delete, update, list, tables, info <table_name>, query <sql>, help, exit");
    
    rl.prompt();

    rl.on('line', async (input) => {
        await handleCommand(input.trim());  // Make sure to await the command handling
        rl.prompt();
    });

    rl.on('close', () => {
        console.log('Exiting REPL...');
        process.exit(0);
    });
}

// Show all users
async function showUsers() {
    try {
        const users = await User.findAll({
            raw: true  // Get raw results
        });
        console.table(users);
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}

// Additional Features
async function showTables() {
    try {
        const tables = await sequelize.queryInterface.showAllTables();
        console.log("Available tables:");
        console.table(tables.map(table => ({ tableName: table })));
    } catch (error) {
        console.error("Error fetching tables:", error);
    }
}

async function describeTable(tableName) {
    try {
        const tableDescription = await sequelize.queryInterface.describeTable(tableName);
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
async function handleCommand(input) {
    const args = input.split(' ');
    const command = args[0].toLowerCase();  // Convert command to lowercase for case-insensitive matching

    try {
        switch (command) {
            case 'query':
                if (args.length >= 2) {
                    const sqlQuery = args.slice(1).join(' ');
                    await executeQuery(sqlQuery);
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
                        await addUser(lastName, firstName, age);
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
                        await deleteUser(personID);
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
                        await updateUser(personID, lastName, firstName, age);
                    } else {
                        console.log('Invalid PersonID or Age');
                    }
                } else {
                    console.log('Usage: update <PersonID> <LastName> <FirstName> <Age>');
                }
                break;

            case 'list':
                await showUsers();
                break;
    
            case 'info':
                if (args.length === 2) {
                    await describeTable(args[1]);
                } else {
                    console.log('Usage: info <table_name>');
                }
                break;

            case 'tables':
                await showTables();
                break;

            case 'help':
                helpInfo();
                break;

            case 'exit':
                rl.close();
                break;

            default:
                if (input.trim()) {  // Only show error for non-empty input
                    console.log('Unknown command. Type "help" for available commands.');
                }
                break;
        }
    } catch (error) {
        console.error('Error executing command:', error.message);
    }
}

main();     