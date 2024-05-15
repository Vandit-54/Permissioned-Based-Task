import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.DB_URL;
    if (mongoURI) {
      await mongoose.connect(mongoURI);
      console.log('Connected to MongoDB');
    }

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }
};
