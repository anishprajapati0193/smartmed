// 🌐 Change this URL to your Render FastAPI API endpoint
// Example: "https://my-prescription-api.onrender.com/predict"
const API_URL = "https://prescription-ocr-api-p74p.onrender.com";

// 🌍 Translations
const translations = {
  en: {
    prescription_title: "Prescription Based Medicines",
    upload_label: "📄 Click here to Upload Prescription",
    read_btn: "Read Prescription",
    home: "⬅ Back to Home",
    proceed_payment: "Proceed to Payment",
    grand_total: "Grand Total",
    medicine_col: "Medicine",
    price_col: "Price",
    qty_col: "Quantity",
    total_col: "Total",
    no_medicines: "No medicines detected in prescription."
  },
  hi: {
    prescription_title: "प्रिस्क्रिप्शन आधारित दवाइयाँ",
    upload_label: "📄 प्रिस्क्रिप्शन अपलोड करने के लिए यहाँ क्लिक करें",
    read_btn: "प्रिस्क्रिप्शन पढ़ें",
    home: "⬅ होम पर वापस जाएँ",
    proceed_payment: "भुगतान के लिए आगे बढ़ें",
    grand_total: "कुल राशि",
    medicine_col: "दवा का नाम",
    price_col: "कीमत",
    qty_col: "मात्रा",
    total_col: "कुल",
    no_medicines: "प्रिस्क्रिप्शन में कोई दवा नहीं मिली।"
  }
};

// 🌐 Apply translations
function applyTranslations(lang, root = document) {
  root.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("language") || "en";
  applyTranslations(savedLang);
});

// prescription.js

// Optional: adjust prices as needed
const priceList = {
  atorvastatin: 120,
  paracetamol: 50,
  amoxicillin: 100,
  cetirizine: 40,
  ibuprofen: 60,
  // add more medicine prices here if needed
};

// Show selected file name (optional UI nicety)
document.getElementById("upload").addEventListener("change", function () {
  const fileNameEl = document.getElementById("file-name");
  fileNameEl.textContent = this.files.length
    ? `Selected: ${this.files[0].name}`
    : "";
});

// MAIN FUNCTION — run OCR on the uploaded image
async function sendImage() {
  const fileInput = document.getElementById("upload");
  const results = document.getElementById("results");

  if (!fileInput.files.length) {
    alert("Please upload an image first");
    return;
  }

  results.innerHTML = "⏳ Reading prescription...";

  const image = fileInput.files[0];

  try {
    // Using Tesseract.js to recognize text
    const { data: { text } } = await Tesseract.recognize(
      image,
      "eng",
      { logger: m => console.log(m) } // optional progress logger
    );

    console.log("OCR TEXT:", text);
    extractData(text);

  } catch (err) {
    results.innerHTML = "❌ OCR failed.";
    console.error(err);
  }
}

// Parse OCR text, detect name, id, medicines, quantities
function extractData(text) {
  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  let patientName = "Not Found";
  let patientId = "Not Found";

  // extract known fields
  lines.forEach(line => {
    if (/patient\s*name/i.test(line)) {
      patientName = line.split(":").pop().trim();
    }
    if (/patient\s*id|id/i.test(line)) {
      patientId = line.split(":").pop().trim();
    }
  });

  // list medicines you expect (add more as needed)
  const knownMedicines = [
    "paracetamol",
    "amoxicillin",
    "cetirizine",
    "ibuprofen",
    "atorvastatin",
    // add other known medicine names (lowercase)
  ];

  const medicines = [];

  lines.forEach(line => {
    knownMedicines.forEach(med => {
      if (line.toLowerCase().includes(med)) {

        // detect quantity using a few patterns
        let quantity = 1; // default if no number found
        const qtyMatch =
          line.match(/(\d+)\s*(tablet|tablets|tab|tabs)/i) ||
          line.match(/x\s*(\d+)/i) ||
          line.match(/-\s*(\d+)/);

        if (qtyMatch) {
          // qtyMatch[1] holds the number
          quantity = parseInt(qtyMatch[1], 10);
        }

        medicines.push({
          name: med.charAt(0).toUpperCase() + med.slice(1),
          quantity
        });
      }
    });
  });

  displayResult(patientName, patientId, medicines);
}

// Display patient details, billing, and enable proceed to payment
function displayResult(name, id, medicines) {
  const results = document.getElementById("results");
  const billingSection = document.getElementById("billing-section");
  const billTable = document.getElementById("bill-table");

  // show patient info
  results.innerHTML = `
    <h3>🧑 Patient details</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>ID:</strong> ${id}</p>
  `;

  // if no medicines detected, hide billing section
  if (!medicines || medicines.length === 0) {
    billingSection.style.display = "none";
    return;
  }

  // build billing table
  let total = 0;
  let tableHTML = `
    <table>
      <tr>
        <th>Medicine</th>
        <th>Price</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
  `;

  medicines.forEach(med => {
    const key = med.name.toLowerCase();
    const price = priceList[key] || 0;
    const lineTotal = price * med.quantity;
    total += lineTotal;

    tableHTML += `
      <tr>
        <td>${med.name}</td>
        <td>₹${price}</td>
        <td>${med.quantity}</td>
        <td>₹${lineTotal}</td>
      </tr>
    `;
  });

  tableHTML += `
      <tr>
        <td colspan="3"><strong>Grand Total</strong></td>
        <td><strong>₹${total}</strong></td>
      </tr>
    </table>
  `;

  billTable.innerHTML = tableHTML;
  billingSection.style.display = "block";

  // attach handler to proceed to payment button
  document.getElementById("payBtn").onclick = () => {
    const cart = medicines.map(med => ({
      name: med.name,
      price: priceList[med.name.toLowerCase()] || 0,
      qty: med.quantity
    }));

    // save to localStorage — read by payment.html
    localStorage.setItem("medicineCart", JSON.stringify(cart));
    localStorage.setItem("patientName", name);
    localStorage.setItem("patientId", id);

    // redirect to payment page
    window.location.href = "payment.html";
  };
}