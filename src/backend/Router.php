<?php

namespace App;

use Exception;

class Router
{
    private static array $routes;

    public static function getRequestedTemplateName() : ?string
    {
        match($_SERVER['REQUEST_METHOD']) {
            'GET' => self::$routes = json_decode(file_get_contents('./config/routes.get.json'), true),
            'POST' => self::$routes = json_decode(file_get_contents('./config/routes.post.json'), true),
            default => throw new Exception('Request method ' . $_SERVER['REQUEST_METHOD'] . ' has no routes defined.')
        };

        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        return (isset(self::$routes[$path])) ? self::$routes[$path] : null;
    }
}