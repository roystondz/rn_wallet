import express from "express";
import dotenv from "dotenv";
import { initDB} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config()

const PORT = process.env.PORT || 5001;


const app = express();
if(process.env.NODE_ENV==="production"){
    job.start();
}

//middleware
app.use(express.json());
app.use(rateLimiter)

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        message:"API is healthy",
        status:"ok"
    })
})

app.use("/api/transactions",transactionsRoute);
app.get("/health",(req,res)=>{
    res.status(200).json({
    message:"Server is up and running"
    })
})

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port: ", PORT);
    })
})