import express from "express";
import routes from "./routes";
import { initDb } from "./models/db";
import cors from "cors";

const app = express();
app.use(express.json());

// enable CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
}));
//initialize database 
initDb();

//routes
app.use("/", routes);

export default app;
