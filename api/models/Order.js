import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // Colleghiamo l'ordine all'ID dell'utente che lo ha fatto
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Array di prodotti dentro l'ordine
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["In preparazione", "Pronto", "Consegnato"],
      default: "In preparazione",
    },
  },
  { timestamps: true }, // Crea automaticamente i campi createdAt e updatedAt
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
