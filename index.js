import express from "express";
import mongoose from "mongoose";
import { serve } from "inngest/express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";

dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const app = express();

app.unsubscribe("/api/auth", userRoutes);
app.unsubscribe("/api/tickets", ticketRoutes);

app.use(cors());
app.use(express.json());

app.use(
  "/api/inngest",
  serve({ client: inngest, functions: [onUserSignup, onTicketCreated] })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));
