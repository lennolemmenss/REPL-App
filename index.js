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

// Main function
async function main() {
    await syncDatabase();
   
    console.log("Available commands: add, delete, update, list, tables, info <table_name>, help, exit");
    
    rl.prompt();

    rl.on('line', (input) => {
        handleCommand(input);
        rl.prompt();
    });

    rl.on('close', () => {
        console.log('Exiting REPL...');
        process.exit(0);
    });
}


// CRUD

// Add user to the database
async function addUser(lastName, firstName, age) {
    try {
        const user = await User.create({ LastName: lastName, FirstName: firstName, Age: age });
        console.log('User added:', user.toJSON());
    } catch (err) {
        console.error('Error adding user:', err);
    }
}

// Update a user by personID
async function updateUser(personID, lastName, firstName, age) {
    try {
        const user = await User.findOne({ where: { id: personID } });
        if (!user) {
            console.log('User not found');
            return;
        }

        // Bijwerken van de gebruiker
        user.LastName = lastName;
        user.FirstName = firstName;
        user.Age = age;

        await user.save();
        console.log('User updated:', user.toJSON());
    } catch (err) {
        console.error('Error updating user:', err);
    }
}

// Delete user by personID
async function deleteUser(personID) {
    try {
        const user = await User.destroy({ where: { id: personID } });
        if (user) {
            console.log('User deleted');
        } else {
            console.log('User not found');
        }
    } catch (err) {
        console.error('Error deleting user:', err);
    }
}

// Show all users
async function showUsers() {
    try {
        const users = await User.findAll();
        console.table(users.map(user => user.toJSON()));
    } catch (err) {
        console.error('Error fetching users:', err);
    }
}



// Additional Features
async function describeTable(tableName) {
    try {
        const tableDescription = await sequelize.queryInterface.describeTable(tableName)
        console.table(tableDescription);
    } catch (err) {
        console.error("Table does not exists!");
    }
}

async function showTables() {

    try {
        const tables = await sequelize.queryInterface.showAllTables();
        console.log(tables);
    } catch (error) {
        console.log("Error fetching tables:", err.stack);
    }
    
}


function helpInfo() {
    console.log("Available commands: add, delete, update, list, tables, info <table_name>, help, exit")    
}



// Handle REPL commands
function handleCommand(input) {
    const args = input.trim().split(' ');
    const command = args[0];

    switch (command) {
        case 'add':
            if (args.length === 4) {
                const lastName = args[1];
                const firstName = args[2];
                const age = parseInt(args[3]);
                if (!isNaN(age)) {
                    addUser(lastName, firstName, age);
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
                    deleteUser(personID);
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
                    updateUser(personID, lastName, firstName, age);
                } else {
                    console.log('Invalid PersonID or Age');
                }
            } else {
                console.log('Usage: update <PersonID> <LastName> <FirstName> <Age>');
            }
            break;

        case 'list':
            showUsers();
            break;
 
        case 'info':
            if (args.length === 2) {
                const tableName = args[1];
                describeTable(tableName);
            } else {
                console.log('Usage: info <table_name>');
            }
            break;

        case 'tables':
            showTables();
            break;

        case "help":
            helpInfo();
            break;

        case 'exit':
            rl.close();
            break;

        default:
            console.log('Unknown command. Available commands: add, delete, update, list, tables, info <table_name>, help, exit');
            break;
    }
}

main();
