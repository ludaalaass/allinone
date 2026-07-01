const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Apni upstream API
const API = "https://cooperation-swing-reed-formed.trycloudflare.com/chain";

app.get("/", (req, res) => {
  res.json({
    developer: "@sahilxalone",
    status: true,
    message: "API Running"
  });
});

app.get("/all-in-one", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        developer: "@sahilxalone",
        status: false,
        message: "Missing q parameter"
      });
    }

    const response = await axios.get(API, {
      params: { q },
      timeout: 15000
    });

    let data = response.data;

    // Agar JSON object hai to developer fields add/update karo
    if (typeof data === "object" && data !== null) {
      data.developer = "@sahilxalone";
      data.footer = "@sahilxalone";
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({
      developer: "@sahilxalone",
      status: false,
      message: err.response?.data || err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
