<?php
session_start();
include "db.php";

$phone = $_POST['phone'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT user_id, password FROM users WHERE phone_number=?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        $_SESSION['user_id'] = $row['user_id']; // Save login
        header("Location: dashboard.php");
        exit;
    } else {
        echo "Wrong password!";
    }
} else {
    echo "No user found!";
}
?>
