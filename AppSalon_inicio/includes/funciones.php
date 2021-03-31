<?php
function obtenerServicios(): array {
    try { //igual que en JS, se usa en punntos criticos de app, estilo consultar la db.
        
        //importar una conexion
        require 'database.php';

        $db->set_charset("utf8"); // IMPORTANTE sino no imprime

        // Escribir el codigo SQL (igual que en la shell de MYSQL)
        $sql = "SELECT * FROM servicios;";

        $consulta = mysqli_query($db , $sql);// permite connsultar db en php (databse, isntruccion.)
        
        // Array vacio para ir colocando los resultados de la DB
        $servicios = [];

        $contador = 0; //para ir iterando sobre la db

        // Obtener los resultados
        while ($row = mysqli_fetch_assoc(($consulta))) { //row es cada uno de los registros
            $servicios[$contador]['id'] = $row['id']; //fetch assoc convierte en un array de php (solo trae el ultimo)
            $servicios[$contador]['nombre'] = $row['nombre'];
            $servicios[$contador]['precio'] = $row['precio'];

            $contador ++;
        }


        return $servicios; // la funcion devuelve el array con servicios.

    } catch (\Throwable $th) { //muestra el error
        var_dump($th);
    }
}

obtenerServicios();