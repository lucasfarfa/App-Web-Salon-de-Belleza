<?php

$db = mysqli_connect('localhost', 'root', 'root', 'appsalon'); // host, user , password, database

if (!$db) { // corta el programa si se produce algun error
    echo 'Error trying to connect to database.';
    exit;
}  