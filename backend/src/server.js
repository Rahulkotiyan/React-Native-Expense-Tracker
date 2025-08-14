import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionRoute.js"



dotenv.config();

const app = express();
//middleware
app.use(express.json());
app.use(rateLimiter);

const PORT = process.env.PORT||5001;

async function initDB() {
    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`
        console.log("Database initialsed successfully");
    }catch(error){
        console.log("Error initialising DB",error);
        process.exit(1); //status code 1 means failure,0 success
    }
}

app.get("/",(req,res)=>{
    res.send("Its working");
});

app.use("/api/transaction",transactionRoute)

initDB().then(()=>{
    app.listen(PORT, () => {
      console.log("Server is up and running on PORT:", PORT);
    });
})

