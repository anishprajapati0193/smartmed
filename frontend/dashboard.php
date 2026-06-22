<?php
session_start();
include "db.php";

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit;
}

$user_id = $_SESSION['user_id'];

// Get user orders
$stmt = $conn->prepare("SELECT product_name, quantity, price, order_date 
                        FROM orders WHERE user_id=? ORDER BY order_date DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>
<!DOCTYPE html>
<html>
<head>
  <title>My Orders</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Your Order History</h1>
  <table border="1" cellpadding="10">
    <tr>
      <th>Product</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Date</th>
    </tr>
    <?php while($row = $result->fetch_assoc()) { ?>
      <tr>
        <td><?= htmlspecialchars($row['product_name']) ?></td>
        <td><?= $row['quantity'] ?></td>
        <td>₹<?= $row['price'] ?></td>
        <td><?= $row['order_date'] ?></td>
      </tr>
    <?php } ?>
  </table>
</body>
</html>
