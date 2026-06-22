// ------------------------------
// Config & helper functions
// ------------------------------
const UPI_ID = "paytmqr5kpeef@ptys";  // Your Paytm Merchant UPI ID
const UPI_NAME = "Anish Prajapati Pharmacy";
const NOTE = "MedicineOrder";

function createUpiLink(upiId, amount) {
  const pa = encodeURIComponent(upiId);
  const pn = encodeURIComponent(UPI_NAME);
  const am = encodeURIComponent(amount);
  const tn = encodeURIComponent(NOTE);
  const cu = "INR";
  // Correct URL format for UPI
  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}`;
}

function openUpiLink(link) {
  // Open payment app on mobile device
  window.location.href = link;
}

// ------------------------------
// Main Script
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("paymentVerified");

  const cartData = localStorage.getItem("medicineCart");
  const cart = cartData ? JSON.parse(cartData) : [];
  const detailsDiv = document.getElementById("details");

  if (!cart || cart.length === 0) {
    detailsDiv.innerHTML = `<p class="error-message">🛒 Your cart is empty. Please go back and select a medicine.</p>`;
    document.getElementById("payment-methods").style.display = "none";
    return;
  }

  // Show cart items
  let grandTotal = 0;
  let itemsHTML = `<div class="summary-header"><span>Item</span><span>Total</span></div>`;
  cart.forEach(item => {
    const subtotal = (Number(item.price) || 0) * (Number(item.qty) || 1);
    grandTotal += subtotal;
    itemsHTML += `
      <div class="order-item">
        <div class="item-details">
          <span class="item-name">${item.name}</span>
          <span class="item-meta">Qty: ${item.qty} × ₹${Number(item.price).toFixed(2)}</span>
        </div>
        <div class="item-subtotal">₹${subtotal.toFixed(2)}</div>
      </div>`;
  });
  itemsHTML += `<hr><div class="order-total"><span>Grand Total</span><strong>₹${grandTotal.toFixed(2)}</strong></div>`;
  detailsDiv.innerHTML = itemsHTML;

  const total = grandTotal.toFixed(2);
  const upiLink = createUpiLink(UPI_ID, total);

  // --- Payment buttons ---
  document.getElementById("phonepe-btn").addEventListener("click", () => openUpiLink(upiLink));
  document.getElementById("gpay-btn").addEventListener("click", () => openUpiLink(upiLink));

  // --- QR button ---
  const qrSection = document.getElementById("qr-code-section");
  const qrPopup = document.getElementById("qr-popup");
  const qrImage = document.querySelector(".qr-image");

  document.getElementById("qr-pay-btn").addEventListener("click", () => {
    qrSection.classList.remove("hidden");
    const qrData = encodeURIComponent(upiLink);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
  });

  // --- Click outside to close popup ---
  qrSection.addEventListener("click", (e) => {
    if (e.target === qrSection) {
      qrSection.classList.add("hidden");
    }
  });

  // --- Confirm payment ---
  document.getElementById("confirm-payment-btn").addEventListener("click", () => {
    alert("✅ Payment confirmed!");
    localStorage.setItem("paymentVerified", "true");
    localStorage.removeItem("medicineCart");
    window.location.href = "success.html";
  });
});

