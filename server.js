import express from "express";
import run from "./index.js";

const app = express();

app.get("/run", async (req, res) => {
  try {
    await run();
    res.send("done");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.listen(10000, () => {
  console.log("Server running on port 10000");
});
