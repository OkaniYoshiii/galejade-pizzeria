<?php

use App\Router;

require_once './vendor/autoload.php';

$template = Router::getRequestedTemplateName();

$loader = new \Twig\Loader\FilesystemLoader('./templates');
$twig = new \Twig\Environment($loader, ['strict_variables' => true]);

echo $twig->render($template, []);