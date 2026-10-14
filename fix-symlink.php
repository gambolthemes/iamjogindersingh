<?php
// One-time helper. Upload it where the website is served from, open it once, it deletes itself.
// Makes <public_html>/iamjogindersingh point to the folder ../iamjogindersingh (outside public_html).
// Works whether it sits in public_html or in public_html/public.
header('Content-Type: text/plain; charset=utf-8');
if (($_GET['k'] ?? '') !== 'a5df24a9218dc3c1') { http_response_code(403); exit('forbidden'); }

$here = __DIR__;
$publicHtml = basename($here) === 'public_html' ? $here
            : (basename(dirname($here)) === 'public_html' ? dirname($here) : null);
echo "this file is in: $here\n";
if (!$publicHtml) {
  echo "Could not find a folder named public_html above this file. Folders around:\n";
  foreach (scandir(dirname($here)) as $f) if ($f[0] !== '.') echo " - $f\n";
  exit;
}

$link = $publicHtml . '/iamjogindersingh';
$target = realpath($publicHtml . '/../iamjogindersingh');
echo "public_html: $publicHtml\n";
echo "target:      " . ($target ?: 'NOT FOUND') . "\n";

if (!$target) {
  echo "\nNo folder named 'iamjogindersingh' next to public_html. Folders next to public_html:\n";
  foreach (scandir(dirname($publicHtml)) as $f) if ($f[0] !== '.') echo " - $f\n";
  exit;
}
if (!is_file($target . '/index.html')) echo "WARNING: index.html is not directly inside the target folder.\n";

if (is_link($link)) {
  echo "A symlink already exists.\n";
} elseif (file_exists($link)) {
  exit("A real file/folder named iamjogindersingh already exists in public_html. Rename or delete it, then reload.\n");
} else {
  if (!function_exists('symlink') || !@symlink($target, $link)) {
    exit("symlink failed: " . (error_get_last()['message'] ?? 'function is disabled on this plan') . "\n");
  }
  echo "symlink created.\n";
}
echo "iamjogindersingh -> " . readlink($link) . "\n";
@unlink(__FILE__);
echo "This helper file deleted itself.\n";
