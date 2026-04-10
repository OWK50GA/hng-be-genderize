import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import classifyRoutes from "./routes/classify"

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", classifyRoutes)

app.listen(3001, () => {
    console.log("Server running on port 3001");
})
