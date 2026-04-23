<?php
// submit_appointment.php - standalone booking endpoint using the same SMTP helper behavior.
// You can use submit_form.php (unified) instead; this is provided if your site still posts to submit_appointment.php.

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "Method not allowed";
    exit;
}

// Try to load PHPMailer the same way submit_form.php does
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
} else {
    if (file_exists(__DIR__ . '/vendor/phpmailer/src/PHPMailer.php')) {
        require_once __DIR__ . '/vendor/phpmailer/src/Exception.php';
        require_once __DIR__ . '/vendor/phpmailer/src/PHPMailer.php';
        require_once __DIR__ . '/vendor/phpmailer/src/SMTP.php';
    }
}

// Reuse send helper from submit_form.php if present, otherwise define a small one here:
if (!function_exists('send_mail_smtp')) {
    function send_mail_smtp($to, $subject, $body, $replyTo = null) {
        $safeReplyTo = $replyTo ? preg_replace("/[\r\n]+/", '', $replyTo) : null;
        $smtpHost = getenv('SMTP_HOST') ?: '';
        $smtpPort = getenv('SMTP_PORT') ?: '';
        $smtpUser = getenv('SMTP_USER') ?: '';
        $smtpPass = getenv('SMTP_PASS') ?: '';
        $smtpFrom = getenv('SMTP_FROM') ?: 'noreply@your-domain.example';
        $smtpFromName = getenv('SMTP_FROM_NAME') ?: 'Motion Auto Garage';
        $smtpSecure = getenv('SMTP_SECURE') ?: 'tls';

        if (class_exists('PHPMailer\PHPMailer\PHPMailer') && $smtpHost) {
            try {
                /** @noinspection PhpUndefinedClassInspection */
                $mail = new PHPMailer\PHPMailer\PHPMailer(true);
                $mail->isSMTP();
                $mail->Host = $smtpHost;
                $mail->SMTPAuth = true;
                $mail->Username = $smtpUser;
                $mail->Password = $smtpPass;
                /** @noinspection PhpUndefinedClassInspection */
                $mail->SMTPSecure = ($smtpSecure === 'ssl') ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = (int)$smtpPort ?: 587;
                $mail->setFrom($smtpFrom, $smtpFromName);
                $mail->addAddress($to);
                if ($safeReplyTo) $mail->addReplyTo($safeReplyTo);
                $mail->Subject = $subject;
                $mail->Body = $body;
                $mail->isHTML(false);
                $mail->send();
                return true;
            } catch (Exception $e) {
                error_log("PHPMailer error: " . $e->getMessage());
            }
        }
        $headers = "From: {$smtpFrom}\r\n";
        if ($safeReplyTo) $headers .= "Reply-To: {$safeReplyTo}\r\n";
        $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
        return mail($to, $subject, $body, $headers);
    }
}

// Process booking (same validation as before)
$isAjax = (
    (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
);

function respond($success, $message) {
    global $isAjax;
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => (bool)$success, 'message' => $message]);
    } else {
        $msg = addslashes($message);
        echo "<script>alert('{$msg}'); window.location.href = '/contacts';</script>";
    }
    exit;
}

// reCAPTCHA and validation (same as before)
$secretKey = getenv('RECAPTCHA_SECRET') ?: '';
if (empty($secretKey)) respond(false, 'ReCAPTCHA not configured.');

$recaptchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
if (empty($recaptchaResponse)) respond(false, 'Please complete the reCAPTCHA.');

$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
$postData = http_build_query(['secret' => $secretKey, 'response' => $recaptchaResponse, 'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '']);
$ch = curl_init($verifyUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
/** @noinspection PhpDeprecatedFunctionUsageInspection */
curl_close($ch);
if ($response === false) respond(false, 'Could not verify reCAPTCHA.');
$responseKeys = json_decode($response, true);
if (!isset($responseKeys['success']) || intval($responseKeys['success']) !== 1) respond(false, 'reCAPTCHA verification failed.');

$name = trim(strip_tags($_POST['name'] ?? ''));
$email = trim($_POST['email'] ?? '');
$phone = trim(strip_tags($_POST['phone'] ?? ''));
$service = trim(strip_tags($_POST['service'] ?? ''));
$date = trim($_POST['date'] ?? '');
$time = trim($_POST['time'] ?? '');
$notes = trim(strip_tags($_POST['notes'] ?? ''));

if ($name === '' || $email === '' || $phone === '' || $service === '' || $date === '' || $time === '') {
    respond(false, 'Please fill in all required fields.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(false, 'Please enter a valid email.');

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !preg_match('/^\d{2}:\d{2}$/', $time)) {
    respond(false, 'Invalid date or time format.');
}
$appointmentTs = strtotime($date . ' ' . $time);
if ($appointmentTs === false || $appointmentTs < time() - 60) respond(false, 'Please select a future date/time.');

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
        ':name'=>$name, ':email'=>$email, ':phone'=>$phone,
        ':service'=>$service, ':datetime'=>$datetime, ':notes'=>$notes,
        ':created_at'=>date('c')
    ]);
} catch (Exception $e) {
    respond(false, 'Failed to save appointment. Check DB permissions.');
}

// Send notification email
$to = getenv('APPOINTMENT_TO') ?: 'jamoomwalks@gmail.com';
$subject = "New Appointment: {$service} on {$date} {$time}";
$body = "New booking received:\n\nName: {$name}\nEmail: {$email}\nPhone: {$phone}\nService: {$service}\nPreferred Date/Time: {$datetime}\nNotes: {$notes}\n\nSubmitted at: " . date('Y-m-d H:i:s');

if (send_mail_smtp($to, $subject, $body, $email)) {
    respond(true, "Thank you {$name}! Your booking request has been received.");
} else {
    respond(true, "Booking saved. Unable to send notification email; we'll follow up soon.");
}
?>