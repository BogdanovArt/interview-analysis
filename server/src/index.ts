import express, { RequestHandler } from "express";
import { connect, connection } from "mongoose";

import Controllers from "./mongo/controllers";

const app = express();
const port = 8080;

connect("mongodb://mongodb:27017/INTERVIEW", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = connection;

app.use(express.json({ limit: "10mb" }) as RequestHandler);
app.use(express.urlencoded({ extended: true, limit: "10mb" }) as RequestHandler);

db.on("error", console.error.bind(console, "error connection to database"));
db.once("open", function () {
  // ---- Project controllers ----
  app.get("/api/projects", (req, res) => Controllers.getProjects({ res, req }));
  app.get("/api/projects/:id", (req, res) => Controllers.getProject({ res, req }));
  app.put("/api/projects", (req, res) => Controllers.putProject({ req, res }));
  app.delete("/api/projects", (req, res) => Controllers.deleteProject({ req, res }));
  app.patch("/api/projects/:id", (req, res) => Controllers.changeProject({ req, res }));

  // ---- Interview controllers ----
  app.get("/api/interviews", (req, res) => Controllers.getUnboundInterviews({ req, res }));
  app.get("/api/interviews/:id", (req, res) => Controllers.getInterview({ req, res }));
  app.post("/api/interviews/:id/edit", (req, res) => Controllers.changeInterviewContent({ req, res }));
  app.post("/api/interviews/:id/reset", (req, res) => Controllers.resetInterview({ req, res }));
  app.patch("/api/interviews/:id", (req, res) => Controllers.changeInterview({ req, res }));
  app.put("/api/interviews", (req, res) => Controllers.putInterview({ req, res }));
  app.delete("/api/interviews", (req, res) => Controllers.deleteInterview({ req, res }));

  // ---- AtomNode controllers ----
  app.put("/api/atomnodes", (req, res) => Controllers.putNode({ req, res }));
  app.options("/api/atomnodes", (req, res) => Controllers.changeNode({ req, res }));
  app.delete("/api/atomnodes", (req, res) => Controllers.deleteNodes({ req, res }));

  // ---- TextBlock controllers ----
  app.patch("/api/textblocks/:id", (req, res) => Controllers.changeTextBlock({ req, res }));
  app.patch("/api/textblocks", (req, res) => Controllers.changeTextBlocks({ req, res }));

  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
});
