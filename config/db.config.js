import mongoose from "mongoose"

export default function connectDB(){
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
      })
        .then(() => {
          console.log('Connected to MongoDB using Mongoose');
        })
        .catch((err) => {
          console.error('Error connecting to MongoDB:', err);
          process.exit(1); 
        });
      
}