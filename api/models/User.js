import mongoose from "mongoose";

// Definiamo lo schema dell'utente nel database
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Il nome è obbligatorio"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email è obbligatoria"],
    unique: true, // Impedisce di registrare due account con la stessa email
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "La password è obbligatoria"],
    minlength: [6, "La password deve avere almeno 6 caratteri"],
  },
  role: {
    type: String,
    enum: ["user", "staff", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Esportiamo il modello. Se esiste già lo usiamo, altrimenti lo creiamo da zero.
export default mongoose.models.User || mongoose.model("User", UserSchema);
