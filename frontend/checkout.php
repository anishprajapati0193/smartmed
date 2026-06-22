<?php
session_start();

// Example cart (replace with your real checkout form data)
$_SESSION['cart'] = [
    ["name" => "Paracetamol", "quantity" => 2, "price" => 50],
    ["name" => "Cough Syrup", "quantity" => 1, "price" => 120]
];

// Now redirect to payment page
header("Location: payment.html");
exit;
?>
