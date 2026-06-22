<?php
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid JSON"]);
  exit;
}

$phone = isset($data['phone']) ? trim($data['phone']) : null;
$username = isset($data['username']) ? trim($data['username']) : null;
if (!$phone) {
  http_response_code(400);
  echo json_encode(["error" => "Phone number required"]);
  exit;
}

$DB_HOST = 'localhost';
$DB_USER = 'root'; // change to your DB user
$DB_PASS = '';     // change to your DB password
$DB_NAME = 'users';

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Database connection failed"]);
  exit;
}

// check if phone already exists
$stmt = $conn->prepare("SELECT user_id FROM user WHERE phone = ? LIMIT 1");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
  $user_id = $row['user_id'];
} else {
  // create new user record
  $insert = $conn->prepare("INSERT INTO user (username, phone) VALUES (?, ?)");
  $insert->bind_param("ss", $username, $phone);
  $insert->execute();
  $user_id = $insert->insert_id;
  $insert->close();
}

$stmt->close();

// store in session
$_SESSION['user_id'] = $user_id;

echo json_encode([
  "ok" => true,
  "user_id" => $user_id,
  "message" => "Phone verified successfully"
]);

$conn->close();
?>
