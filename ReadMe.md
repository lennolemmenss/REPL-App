# Tembo CLI Application

## Overview

The **REPL CLI Application** is a simple command-line tool built with Node.js, utilizing **Sequelize** to interact with a PostgreSQL database. Users can perform CRUD operations on a `Users` table and retrieve information about the database through various commands.

## Features

- **Add a user** (`add`): Add a new user with a last name, first name, and age.
- **Update a user** (`update`): Update the details of an existing user by their ID.
- **Delete a user** (`delete`): Remove a user from the database using their ID.
- **List all users** (`list`): Display all users in the database.
- **Show all tables** (`tables`): List all tables available in the database.
- **Describe a table** (`info <table_name>`): Show the structure of a specific table, including column names, data types, and constraints.

## Requirements

- Node.js (version 14 or higher)
- PostgreSQL (Tembo)
- Sequelize (included as a dependency)

## Installation

1. Clone the repository to your local machine.
   ```bash
   git clone <repository-url>


## Running the application

Start the CLI by running the following command:

``npm start
