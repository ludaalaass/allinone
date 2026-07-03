const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Upstream API
const API = "https://ft-osint-api.duckdns.org/api/leakinfo";
const API_KEY = "nxsahilx928x926";

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
      params: {
        key: API_KEY,
        term: q
      },
      timeout: 15000
    });

    let data = response.data;

    // Replace/remove upstream branding
    const replaceBranding = (obj) => {
      // Handle strings
      if (typeof obj === "string") {
        return obj
          .replace(/@ftgamerv2/gi, "@sahilxalone")
          .replace(/ftgamerv2/gi, "sahilxalone")
          .replace(/@ftgamer2/gi, "@sahilxalone")
          .replace(/ftgamer2/gi, "sahilxalone")
          .replace(/"by":"[^"]*"/g, '"by":"@sahilxalone"') // Replace any "by" value
          .replace(/"credit":"[^"]*"/g, '"credit":"@sahilxalone"') // Replace any "credit" value
          .replace(/"author":"[^"]*"/g, '"author":"@sahilxalone"'); // Replace any "author" value
      }

      // Handle arrays
      if (Array.isArray(obj)) {
        return obj.map(replaceBranding);
      }

      // Handle objects
      if (obj && typeof obj === "object") {
        // Remove unwanted keys completely
        delete obj.developer;
        delete obj.footer;
        delete obj.owner;
        delete obj.credit;
        delete obj.author;
        delete obj.telegram;
        delete obj.instagram;
        delete obj.facebook;
        delete obj.twitter;
        delete obj.youtube;
        delete obj.discord;
        delete obj.by;
        delete obj.branding;
        delete obj.attribution;

        // Recursively process all values
        for (const key in obj) {
          obj[key] = replaceBranding(obj[key]);
        }

        return obj;
      }

      return obj;
    };

    // Apply branding replacement
    data = replaceBranding(data);

    // Add your own branding
    if (typeof data === "object" && data !== null) {
      data.developer = "@sahilxalone";
      data.footer = "@sahilxalone";
      data.by = "@sahilxalone";
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
  console.log(`✅ Server started on port ${PORT}`);
  console.log(`🔗 Visit: http://localhost:${PORT}`);
  console.log(`👤 Developer: @sahilxalone`);
});
