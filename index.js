const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;
const { publish } = require("./mqtt/publish");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.post("/", async (req, res) => {
  if (!req.body.topic || !req.body.message || !req.body.qos) {
    return res.status(400).send({
      message: "Bad Request",
      status: 400,
    });
  }

  const topic = req.body.topic;
  const payload = JSON.stringify({ message: req.body.message });
  const qos = req.body.qos;
  const retain = false; // retain not working

  const error = await publish(topic, payload, qos, retain);

  if (error) {
    return res.status(500).send({
      status: 500,
      message: error.message,
    });
  }

  res.status(200).send({
    status: 200,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
