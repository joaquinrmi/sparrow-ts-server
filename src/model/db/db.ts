import { Sequelize } from "sequelize";

const db = new Sequelize(
    process.env.DATABASE_URL,
    {
        dialect: "postgres"
    }
);

(async () =>{
    try
    {
        await db.authenticate();
        console.log("Connected to the database.");
    }
    catch(err)
    {
        console.log("Unable to connect to the database.", err);
    }
})();

export default db;