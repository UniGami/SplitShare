const AZURE_ENDPOINT = process.env.AZURE_CV_ENDPOINT;
const AZURE_KEY = process.env.AZURE_CV_KEY;
const ANALYZE_URL = AZURE_ENDPOINT + "vision/v3.2/read/analyze";

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createReceipt,
  updateReceipt,
  deleteReceipt
} = require('../controllers/receiptController');

// Utility function to extract items with prices(Change to billRouter as it makes more)
router.post('/scan', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageData = req.file.buffer;

    // Azure OCR request
    const response = await fetch(ANALYZE_URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: imageData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OCR request failed: ${errText}`);
    }

    const operationLocation = response.headers.get("operation-location");
    if (!operationLocation) throw new Error("No operation-location header found");

    await new Promise(r => setTimeout(r, 3000));

    const result = await fetch(operationLocation, {
      headers: { "Ocp-Apim-Subscription-Key": AZURE_KEY },
    });

    const ocrData = await result.json();
    if (!ocrData.analyzeResult?.readResults) {
      throw new Error("Unexpected OCR response structure");
    }

    const lines = ocrData.analyzeResult.readResults
      .flatMap(page => page.lines.map(line => line.text))
      .filter(Boolean);

    const priceRegex = /(?:(?:[\$₹]|Rs?\.?|rs?\.?)\s*\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\b\d+(?:\.\d+)?\b)/g;
    const excludePatterns = /\b(total|subtotal|tax|visa|savings|paid|balance|refund|receipt|amount|net|tender|returns|card|items|purchased|purchase|purchases)\b/i;
    let items = [];
    let prices = [];

    for (let line of lines) {
      let cleanedLine = line.replace(/[*@]|lb|ea|ft|fl|oz|pkg|unit|sale/gi, "").trim();

      // Extract price if any
      const priceMatch = cleanedLine.match(priceRegex);
      let price;
      if (priceMatch) {
        price = priceMatch[0];
        prices.push(price);
      }

      // Remove the price from the line to get item text
      const itemText = cleanedLine.replace(priceRegex, "").trim();

      // Only add item if it has actual text and doesn't fully match excluded words
      if (itemText && !excludePatterns.test(itemText)) {
        items.push(itemText);
      }
    }
    items = items.filter(item => {
    // Remove if length is 1 OR contains only digits
    return !(item.length <= 3 || /^\d+$/.test(item) || excludePatterns.test(item.toLowerCase()) || /^[^\w\s]|^\d/.test(item.toLowerCase()));
    });
    const simpleCurrencyRegex = /^(?:[\$₹]|Rs?\.?|rs?\.?)\s*\d+[.,]?\d*/i;
    let currencyCount = 0;
    const totalEntries = prices.length;
    const majorityThreshold = totalEntries / 2;

    // 2. COUNT THE CURRENCY ENTRIES
    for (const entry of prices) {
        if (typeof entry === 'string' && simpleCurrencyRegex.test(entry.trim())) {
            currencyCount++;
        }
    }

    // 3. APPLY FILTERING LOGIC
    let finalArray;
    if (currencyCount >= majorityThreshold) {
        // Majority found: Filter to keep ONLY the entries that start with a currency symbol
        prices = prices.filter(entry => 
            typeof entry === 'string' && simpleCurrencyRegex.test(entry.trim())
        );
    }
    res.json({ items, prices });
  } catch (error) {
    console.error("💥 OCR failed:", error.message);
    res.status(500).json({ error: "OCR failed", details: error.message });
  }
});











// CRUD routes
router.post('/', createReceipt);
router.put('/:id', updateReceipt);
router.delete('/:id', deleteReceipt);



module.exports = router;
