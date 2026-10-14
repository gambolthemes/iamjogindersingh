<?php
// Receives enquiries from the portfolio form and emails them to you.
// Delivery: SMTP through a Hostinger mailbox whose login you put in ../mail-config.php (outside the web root).
// Without that file, or if SMTP fails, it falls back to PHP mail().
// The recipient address stays on the server; it is never sent to visitors' browsers.
$to = 'gambol943@gmail.com';
$configFile = __DIR__ . '/../mail-config.php'; // optional, outside the web root; see mail-config.sample.php
$smtpHost = 'smtp.hostinger.com';
$smtpPort = 465; // implicit TLS
$fallbackFrom = 'no-reply@gambolthemes.net';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond($code, $ok, $error = '', $extra = []) {
  http_response_code($code);
  echo json_encode(['ok' => $ok, 'error' => $error] + $extra);
  exit;
}

// Single-line values: strip line breaks so nothing can inject extra mail headers.
function line($v, $max) {
  $v = is_array($v) ? implode(', ', $v) : (string) $v;
  return mb_substr(trim(preg_replace('/[\r\n]+/', ' ', $v)), 0, $max);
}

function mime_word($s) { return '=?UTF-8?B?' . base64_encode($s) . '?='; }

// Mailbox login for SMTP, kept in a file you create outside the web root. Returns [] if it doesn't exist.
function mail_config($file) {
  $c = is_readable($file) ? include $file : [];
  return is_array($c) ? $c : [];
}

// Minimal SMTP client (implicit TLS, AUTH LOGIN). Returns true only if the server accepted the message.
function smtp_send($host, $port, $user, $pass, $to, $fromName, $replyName, $replyEmail, $subject, $body) {
  $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
  $fp = @stream_socket_client("ssl://$host:$port", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
  if (!$fp) return false;
  stream_set_timeout($fp, 15);
  $read = function () use ($fp) {
    $out = '';
    while (($l = fgets($fp, 515)) !== false) { $out .= $l; if (strlen($l) < 4 || $l[3] === ' ') break; }
    return $out;
  };
  $step = function ($cmd, $expect) use ($fp, $read) {
    if ($cmd !== null) fwrite($fp, $cmd . "\r\n");
    return substr($read(), 0, 3) === $expect;
  };
  $domain = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
  $ok = $step(null, '220')
     && $step('EHLO ' . $domain, '250')
     && $step('AUTH LOGIN', '334')
     && $step(base64_encode($user), '334')
     && $step(base64_encode($pass), '235')
     && $step('MAIL FROM:<' . $user . '>', '250')
     && $step('RCPT TO:<' . $to . '>', '250')
     && $step('DATA', '354');
  if ($ok) {
    $headers = [
      'Date: ' . date('r'),
      'From: ' . mime_word($fromName) . ' <' . $user . '>',
      'To: <' . $to . '>',
      'Reply-To: ' . mime_word($replyName) . ' <' . $replyEmail . '>',
      'Subject: ' . mime_word($subject),
      'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $domain . '>',
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
    ];
    $data = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($body), 76, "\r\n");
    fwrite($fp, $data . ".\r\n");
    $ok = substr($read(), 0, 3) === '250';
  }
  @fwrite($fp, "QUIT\r\n");
  fclose($fp);
  return $ok;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, false, 'Method not allowed');
if ($to === '') respond(500, false, 'Contact email is not configured');

// Only accept submissions that come from this website.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== ($_SERVER['HTTP_HOST'] ?? '')) {
  respond(403, false, 'Forbidden');
}

// Allow at most 5 enquiries per hour from one IP address.
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = trim(explode(',', $ip)[0]);
$bucket = sys_get_temp_dir() . '/enquiry_' . md5($ip) . '.json';
$now = time();
$times = is_file($bucket) ? (json_decode(@file_get_contents($bucket), true) ?: []) : [];
$times = array_values(array_filter($times, function ($t) use ($now) { return $t > $now - 3600; }));
if (count($times) >= 5) respond(429, false, 'Too many messages, please try again later');

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) $in = $_POST;

if (!empty($in['website'])) respond(200, true); // honeypot: bots fill this in

$name = line($in['name'] ?? '', 100);
$email = line($in['email'] ?? '', 150);
$phone = line($in['phone'] ?? '', 40);
$services = line($in['services'] ?? '', 200);
$timeline = line($in['timeline'] ?? '', 60);
$message = trim(mb_substr((string) ($in['message'] ?? ''), 0, 3000));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($message) < 10) {
  respond(422, false, 'Please check the form and try again');
}

$subject = 'Project enquiry from ' . $name;
$body = "New enquiry from your portfolio website\n\n"
  . "Name: $name\nEmail: $email\n"
  . ($phone !== '' ? "Phone: $phone\n" : '')
  . ($services !== '' ? "Interested in: $services\n" : '')
  . ($timeline !== '' ? "Timeline: $timeline\n" : '')
  . "\nMessage:\n$message\n";

$via = 'smtp';
$cfg = mail_config($configFile);
$user = (string) ($cfg['username'] ?? '');
$pass = (string) ($cfg['password'] ?? '');
$sent = $user !== '' && $pass !== ''
  && smtp_send($smtpHost, $smtpPort, $user, $pass, $to, 'Portfolio Enquiry', $name, $email, $subject, $body);

if (!$sent) { // fallback: PHP mail()
  $via = 'mail';
  $headers = implode("\r\n", [
    'From: ' . mime_word('Portfolio Enquiry') . ' <' . $fallbackFrom . '>',
    'Reply-To: ' . mime_word($name) . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
  ]);
  $sent = mail($to, mime_word($subject), $body, $headers);
}

if ($sent) {
  $times[] = $now;
  @file_put_contents($bucket, json_encode($times));
}
respond($sent ? 200 : 500, $sent, $sent ? '' : 'Mail could not be sent', ['via' => $via]);
