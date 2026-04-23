<?php
// create_appointments_db.php
// Optional one-time helper: run from CLI to pre-create appointments.db and table.
// Usage (CLI): php create_appointments_db.php

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
    echo "appointments.db created/verified at: {$dbFile}\n";
} catch (Exception $e) {
    echo "Error creating DB: " . $e->getMessage() . "\n";
    exit(1);
}
?>