document.addEventListener("DOMContentLoaded", () => {
  // Block access if payment not verified
  const paid = localStorage.getItem("paymentVerified");
  if (paid !== "true") {
    alert("Payment not detected. Redirecting to payment page.");
    window.location.href = "payment.html";
    return;
  }

  // Clear verification token (force new payment next time)
  localStorage.removeItem("paymentVerified");

  document.getElementById("done-btn").addEventListener("click", () => {
    window.location.href = "index.html"; // back to home
  });
});
