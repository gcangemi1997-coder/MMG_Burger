import mongoose from "mongoose";
import dotenv from "dotenv";

// Carichiamo le variabili d'ambiente dal file .env
dotenv.config();

const connectDB = async () => {
  // Controlliamo se siamo già connessi (ottimizzazione cruciale per le Serverless Functions di Vercel)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    // Recuperiamo la stringa segreta dal process.env
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connesso con successo: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Errore di connessione a MongoDB: ${error.message}`);
    // Non blocchiamo brutalmente il processo con process.exit() perché su Vercel si bloccherebbe il serverless container
    throw error;
  }
};

export default connectDB;

// Le funzioni Serverless si accendono e si spengono continuamente. Se ogni volta che arriva una richiesta aprissimo una nuova connessione a MongoDB senza controllare, satureremmo subito il limite di connessioni del database gratuito. La riga if (mongoose.connection.readyState >= 1) { return; } controlla se c'è già una connessione attiva rimasta in memoria da una richiesta precedente e la riutilizza, rendendo l'app velocissima e stabile.
