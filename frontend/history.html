<?php
session_start();
if (!isset($_SESSION['user_id'])) {
  echo "Please log in to view your orders.";
  exit;
}

$user_id = $_SESSION['user_id'];

$conn = new mysqli('localhost', 'root', '', 'users');
$stmt = $conn->prepare("SELECT order_id, product_name, quantity, order_date FROM orders WHERE user_id = ? ORDER BY order_date DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

echo "<h2>Your Order History</h2><ul>";
while ($row = $result->fetch_assoc()) {
  echo "<li>#" . $row['order_id'] . " — " . $row['product_name'] . " × " . $row['quantity'] . " (" . $row['order_date'] . ")</li>";
}
echo "</ul>";

$stmt->close();
$conn->close();
?>
