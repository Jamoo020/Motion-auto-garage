<?php
// Simple PHPMailer SMTP test. Run from CLI: php mailer_test.php
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo "vendor/autoload.php not found. Run: composer require phpmailer/phpmailer\n";
    exit(1);
}
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$host = getenv('SMTP_HOST') ?: 'smtp.example.com';
$port = getenv('SMTP_PORT') ?: 587;
$user = getenv('SMTP_USER') ?: 'smtp-user';
$pass = getenv('SMTP_PASS') ?: 'smtp-pass';
$from = getenv('SMTP_FROM') ?: 'noreply@your-domain.example';
$fromName = getenv('SMTP_FROM_NAME') ?: 'Motion Auto Garage';
$secure = getenv('SMTP_SECURE') ?: 'tls';
$to = getenv('CONTACT_TO') ?: 'jamoomwalks@gmail.com';

echo "SMTP test — host={$host} port={$port} user={$user}\n";

$mail = new PHPMailer(true);
try {
    // Verbose debug output
    $mail->SMTPDebug = SMTP::DEBUG_CONNECTION; // for more detail: SMTP::DEBUG_SERVER
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $user;
    $mail->Password = $pass;
    $mail->SMTPSecure = ($secure === 'ssl') ? 'ssl' : 'tls';
    $mail->Port = (int)$port;

    $mail->setFrom($from, $fromName);
    $mail->addAddress($to);
    $mail->addReplyTo($from);
    $mail->isHTML(false);
    $mail->Subject = 'PHPMailer SMTP test';
    $mail->Body = "Test message from Motion Auto Garage — " . date('c');

    $mail->send();
    echo "\nMessage sent successfully.\n";
} catch (Exception $e) {
    echo "\nPHPMailer Exception: " . $mail->ErrorInfo . "\n";
    echo "Exception message: " . $e->getMessage() . "\n";
    exit(1);
}
?>