import express from "express";
import cors from "cors";
import groupRouter from "./routers/groupRouter.js";
import AuthRouter from "./routers/AuthRouter.js";

const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", groupRouter);
app.use("/login", AuthRouter);
app.use("/signup", AuthRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(port);
