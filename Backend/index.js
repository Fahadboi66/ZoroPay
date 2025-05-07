import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./Database/db.js";
const PORT = process.env.PORT || 5000;

const app = express();
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(express.json());
connectDB();


app.use((req, res, next) => {
    // Middleware to log request details with timestamp
    const currentDate = new Date(); 
    const formattedDate = currentDate.toISOString();
    console.log(`[${formattedDate}] ${req.method} request to ${req.url}`);
    next();
});

app.get("/test", (req, res) => {
    console.log("App is running successfully");
    res.send("App is running successfully");
})

app.get("/health-check", (req, res) => {
    console.log("App health check is successful");
    res.send("App health check is successful");
})


import userRoutes from "./Routes/user.routes.js";
import invoiceRoutes from "./Routes/invoice.routes.js";
import paymentRoutes from "./Routes/payment.routes.js";


app.use("/api/users", userRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(PORT, () => {
    console.log(`Your server is listening on PORT ${PORT}`);
});
