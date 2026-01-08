import { sql } from "../config/db.js";

export async function getTransactionByUserId(req,res){
  
        try {
            const { userId } = req.params;
    
            const result = await sql`
            select * from transaction where user_id=${userId} order by created_at DESC`;
    
            if (result.length === 0) {
                return res.status(400).json({ message: "No transaction found" });
            }
    
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching the transactions: ", error);
            res.status(500).json("Internal Server Error");
        }
    }


export async function createTransaction(req,res){
    
    
        try {
            const { title, amount, category, user_id } = req.body;
            if (!title || amount === undefined || !category || !user_id) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const transaction = await sql`
            INSERT INTO transaction(user_id,title,amount,category)
            VALUES(${user_id},${title},${amount},${category})
            RETURNING *
            `
            res.status(201).json({ message: "Transaction created successfully" })
    
        } catch (error) {
            console.log("Error creating a transaction : ", error);
            res.status(500).json({ message: "Internal Error" })
        }
    
}

export async function deleteTransaction(req,res){
     
        try {
            const { id } = req.params;
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: "Invalid Transaction Id" });
            }
    
            const result = await sql`DELETE FROM transaction WHERE id=${id} RETURNING * `;
            if (result.length === 0) {
                return res.status(404).json({ message: "Transaction not found" });
            }
    
            res.status(200).json({ message: "Deleted transaction successfully", data: result });
    
        } catch (error) {
            console.error("Error deleting the transaction: ", error);
            res.status(500).json("Internal Server Error");
        }
    
}

export async function getUserSummary(req,res){
    
    
        try {
            const {userId} = req.params;
            const balance = await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transaction WHERE user_id =${userId}`;
    
            const income = await sql`SELECT COALESCE(SUM(amount),0) as income FROM transaction WHERE user_id =${userId} AND amount>0`;
            const expense = await sql`SELECT COALESCE(SUM(amount),0) as expense FROM transaction WHERE user_id =${userId} AND amount<0`;
    
            res.status(200).json({message:"Transaction Summary",
                balance:balance[0].balance,
                income:income[0].income,
                expense:expense[0].expense //Whatever we give as the table name will be used as the key in the response
            });
        } catch (error) {
            console.error("Error getting the summary of transactions: ", error);
            res.status(500).json("Internal Server Error");
        }
    
}
