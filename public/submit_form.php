<?php
// submit_form.php - unified handler (contact + booking) using PHPMailer/SMTP from environment variables.
// Falls back to PHP mail() if PHPMailer is not available or sending fails.

// Require PHPMailer if installed as dependency; otherwise attempt to require source files if present.
$phpmailerAvailable = false;
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
    $phpmailerAvailable = class_exists('PHPMailer\PHPMailer\PHPMailer');
} else {
    // Try direct includes (in case you placed PHPMailer source under vendor/phpmailer/)
    if (file_exists(__DIR__ . '/vendor/phpmailer/src/PHPMailer.php')) {
        require_once __DIR__ . '/vendor/phpmailer/src/Exception.php';
        require_once __DIR__ . '/vendor/phpmailer/src/PHPMailer.php';
        require_once __DIR__ . '/vendor/phpmailer/src/SMTP.php';
        $phpmailerAvailable = class_exists('PHPMailer\PHPMailer\PHPMailer');
    }
}

// Helper to send mail via PHPMailer or fallback to mail()
function send_mail_smtp($to, $subject, $body, $replyTo = null) {
    global $phpmailerAvailable;

    // sanitize reply-to
    $safeReplyTo = $replyTo ? preg_replace("/[\r\n]+/", '', $replyTo) : null;

    // SMTP config from environment
    $smtpHost = getenv('SMTP_HOST') ?: '';
    $smtpPort = getenv('SMTP_PORT') ?: '';
    $smtpUser = getenv('SMTP_USER') ?: '';
    $smtpPass = getenv('SMTP_PASS') ?: '';
    $smtpFrom = getenv('SMTP_FROM') ?: 'noreply@your-domain.example';
    $smtpFromName = getenv('SMTP_FROM_NAME') ?: 'Motion Auto Garage';
    $smtpSecure = getenv('SMTP_SECURE') ?: 'tls';

    if ($phpmailerAvailable && $smtpHost) {
        try {
            /** @noinspection PhpUndefinedClassInspection */
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            // Use SMTP
            $mail->isSMTP();
            $mail->Host = $smtpHost;
            $mail->SMTPAuth = true;
            $mail->Username = $smtpUser;
            $mail->Password = $smtpPass;
            /** @noinspection PhpUndefinedClassInspection */
            $mail->SMTPSecure = ($smtpSecure === 'ssl') ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = (int)$smtpPort ?: 587;

            // Optional TLS options: rely on defaults in production
            $mail->setFrom($smtpFrom, $smtpFromName);
            $mail->addAddress($to);
            if ($safeReplyTo) $mail->addReplyTo($safeReplyTo);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->isHTML(false);
            $mail->CharSet = 'UTF-8';
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("PHPMailer send error: " . $e->getMessage());
            // fall back to mail()
        }
    }

    // Fallback: PHP mail()
    $headers = "From: {$smtpFrom}\r\n";
    if ($safeReplyTo) $headers .= "Reply-To: {$safeReplyTo}\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    return mail($to, $subject, $body, $headers);
}

// --- Request handling below (kept largely unchanged) ---

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "Method not allowed";
    exit;
}

$isAjax = (
    (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
);

function respond($success, $message, $redirect = '/contacts') {
    global $isAjax;
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => (bool)$success, 'message' => $message]);
    } else {
        $msg = addslashes($message);
        echo "<script>alert('{$msg}'); window.location.href = '{$redirect}';</script>";
    }
    exit;
}

// read form type
$form_type = isset($_POST['form_type']) ? trim($_POST['form_type']) : 'contact';

// reCAPTCHA
$secretKey = getenv('RECAPTCHA_SECRET') ?: '';
if (empty($secretKey)) respond(false, 'ReCAPTCHA secret not configured on the server.');

$recaptchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
if (empty($recaptchaResponse)) respond(false, 'Please complete the reCAPTCHA challenge.');

$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
$postData = http_build_query(['secret' => $secretKey, 'response' => $recaptchaResponse, 'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '']);
$ch = curl_init($verifyUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
/** @noinspection PhpDeprecatedFunctionUsageInspection */
curl_close($ch);
if ($response === false) respond(false, 'Could not verify reCAPTCHA. Try again later.');
$responseKeys = json_decode($response, true);
if (!isset($responseKeys['success']) || intval($responseKeys['success']) !== 1) respond(false, 'reCAPTCHA verification failed. Please try again.');

// Common fields
$name = trim(strip_tags($_POST['name'] ?? ''));
$email = trim($_POST['email'] ?? '');
if ($name === '' || $email === '') respond(false, 'Please provide your name and email.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(false, 'Please enter a valid email address.');

if ($form_type === 'booking') {
    // booking flow
    $phone = trim(strip_tags($_POST['phone'] ?? ''));
    $service = trim(strip_tags($_POST['service'] ?? ''));
    $date = trim($_POST['date'] ?? '');
    $time = trim($_POST['time'] ?? '');
    $notes = trim(strip_tags($_POST['notes'] ?? ''));

    if ($phone === '' || $service === '' || $date === '' || $time === '') {
        respond(false, 'Please fill in all required booking fields.');
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !preg_match('/^\d{2}:\d{2}$/', $time)) {
        respond(false, 'Please provide a valid date and time.');
    }
    $appointmentTs = strtotime($date . ' ' . $time);
    if ($appointmentTs === false || $appointmentTs < time() - 60) respond(false, 'Please select a future date and time.');

    $datetime = $date . ' ' . $time . ':00';

    // Save to SQLite
    $dbFile = __DIR__ . '/appointments.db';
    try {
        $pdo = new PDO('sqlite:' . $dbFile);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            datetime TEXT NOT NULL,
            notes TEXT,
            created_at TEXT NOT NULL
        )");
        $stmt = $pdo->prepare("INSERT INTO appointments (name,email,phone,service,datetime,notes,created_at) VALUES (:name,:email,:phone,:service,:datetime,:notes,:created_at)");
        $stmt->execute([
            ':name' => $name, ':email' => $email, ':phone' => $phone,
            ':service' => $service, ':datetime' => $datetime, ':notes' => $notes,
            ':created_at' => date('c')
        ]);
    } catch (Exception $e) {
        respond(false, 'Failed to save appointment. Check DB permissions.');
    }

    // Notification email
    $to = getenv('APPOINTMENT_TO') ?: 'jamoomwalks@gmail.com';
    $subject = "New Appointment: {$service} on {$date} {$time}";
    $body = "New booking received:\n\nName: {$name}\nEmail: {$email}\nPhone: {$phone}\nService: {$service}\nPreferred Date/Time: {$datetime}\nNotes: {$notes}\n\nSubmitted at: " . date('Y-m-d H:i:s');

    if (send_mail_smtp($to, $subject, $body, $email)) {
        respond(true, "Thank you {$name}! Your booking request has been received. We'll contact you to confirm.");
    } else {
        // persisted in DB, return success but warn about email
        respond(true, "Booking saved but the server could not send notification email. We'll contact you soon.");
    }

} else {
    // contact message flow
    $message = trim(strip_tags($_POST['message'] ?? ''));

    $to = getenv('CONTACT_TO') ?: 'jamoomwalks@gmail.com';
    $subject = "New Message from Motion Auto Garage Website";
    $body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}";

    if (send_mail_smtp($to, $subject, $body, $email)) {
        respond(true, "Thank you {$name}! Your message has been sent successfully.");
    } else {
        respond(false, 'Sorry, there was a problem sending your message. Please try again later.');
    }
}
?>