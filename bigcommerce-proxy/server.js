const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// BigCommerce API credentials
const STORE_HASH = "7v0bcn6k91";
const AUTH_TOKEN = "6e7hyy6t2op9ccwnwtvm5vpyngfrhcg";

// Route to fetch customers from BigCommerce API
app.get("/api/customers", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers`,
      {
        headers: {
          "X-Auth-Token": AUTH_TOKEN,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ message: "Error fetching customers" });
  }
});

// Route to fetch orders for a specific customer
app.get("/api/orders", async (req, res) => {
  const { customer_id } = req.query; // Get customer_id from query params

  if (!customer_id) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    const response = await axios.get(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v2/orders?customer_id=${customer_id}`,
      {
        headers: {
          "X-Auth-Token": AUTH_TOKEN,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data); // Send orders data to the frontend
  } catch (error) {
    console.error(`Error fetching orders for customer ${customer_id}:`, error.message);
    res.status(500).json({ message: `Error fetching orders for customer ${customer_id}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
