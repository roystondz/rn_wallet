//react custom hook file
import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { API_URL } from '../constants/api';



export const useTransactions = (userId)=>{
    console.log("useTransactions userId: ",userId);
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [summary,setSummary]=useState({
        income:0,
        expense:0,
        balance:0
    })

        //useCallback to performance reasons 
    const fetchTransaction = useCallback(async()=>{
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data  = await response.json();
            
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    },[ userId ]);

    const fetchSummary = useCallback(async()=>{
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data  = await response.json();
            setSummary(data);
            console.log("Fetched summary: ",data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    },[ userId ]);

    const loadData=useCallback(async()=>{
        if(!userId) return;
        setLoading(true);

        try {
            await Promise.all([fetchTransaction(),fetchSummary()]);
        } catch (error) {
            console.error("Error loading data: ",error);
        }finally{
            setLoading(false);
        }
    },[fetchTransaction,fetchSummary,userId]);


    const deleteTransaction = async(id)=>{
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`,{method:'DELETE'});
            if(!response.ok){
                throw new Error("Failed to delete transaction");
            }

            loadData();
            Alert.alert("Success","Transaction deleted successfully");
            
        } catch (error) {
            console.error("Error deleting transaction:",error);
            Alert.alert("Error","Failed to delete transaction. Please try again later.");
        }
    }

    return{
        transactions,summary,loading,loadData,deleteTransaction
    };
}