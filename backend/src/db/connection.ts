 import mongoose, { connect } from "mongoose";

async function connectToDatabase() {
    try {
        await connect(process.env.MONGODB_URL, {
            
                bufferCommands: false, // Disable mongoose buffering
                
               
        });

    } catch (err) {
        console.log(err)

    }
}
export {connectToDatabase}