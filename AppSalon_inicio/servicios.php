<?php
require "includes/funciones.php"; // me traigo las funcionnes


$servicios = obtenerServicios();

echo json_encode($servicios);