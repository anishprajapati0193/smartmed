<?php
session_start();
include "db.php";

// User must be logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit;
}

$user_id = $_SESSION['user_id'];

// Example: collect order details from session (set during checkout)
if (!isset($_SESSION['cart'])) {
    echo "No order found.";
    exit;
}

// Loop through cart and save each item
foreach ($_SESSION['cart'] as $item) {
    $product = $item['name'];
    $qty     = $item['quantity'];
    $price   = $item['price'];

    $stmt = $conn->prepare("INSERT INTO orders (user_id, product_name, quantity, price) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isid", $user_id, $product, $qty, $price);
    $stmt->execute();
}

// Clear cart after saving
unset($_SESSION['cart']);
?>
<!DOCTYPE html>
<html>
<head>
  <title>Payment Successful</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>✅ Payment Successful</h1>
  <p>Your order has been placed. You can check your order history anytime.</p>
  <a href="dashboard.php">Go to My Orders</a>
</body>
</html>
