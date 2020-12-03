import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import UserController from "./controllers/UserController";
import LessonController from "./controllers/LessonController";
import SolveController from "./controllers/SolveController";
import DisciplineController from "./controllers/DisciplineController";
import { errorMiddleware } from "./utils/errorHandler";

const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(errorMiddleware)

app.use("/api/users", UserController);
app.use("/api/lessons", LessonController);
app.use("/api/disciplines", DisciplineController);
app.use("/api/solves", SolveController);


export default app;
