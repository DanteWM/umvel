# BED Umvel


### Instalación

1. Clonar
   ```sh
   git clone https://github.com/DanteWM/umvel.git
   ```
2. Correr el docker compose
   ```sh
   docker-compose up
   ```
3. De ser necesario, ingresar a la base de datos con el container id
   ```sh
   docker exec -it [CONTAINER ID] /bin/bash
   ```
4. Crear las bases de datos users y orders
   ```sh
   CREATE DATABASE users
   ```
   ```sh
   CREATE DATABASE orders
   ```



## Descripción

La practica esta integrada por un Gateway que escucha peticiones en el puerto 5001 y dos microservicios, uno para ordenes y otro para usuarios.
EL microservicio de Ordenes consta de cuatro rutas ( Listar ordenes, Listar items, Crear ordenes, Crear items ) todas la rutas estan protegidas por token, es necesario loguearse y colocar el token en la cabecera 'Authorization', se adjunta el archivo de postman.

Para el cambio de estatus en una orden, debe tomarse en cuenta el flujo y los estatus permitidos ( OPEN - COMMANDED o CANCELLED - SERVED - PAID - CLOSED ) al cambiar de estatus se debe tomar en cuenta este orden. 

Los usuarios generados automaticamento son admin@umvel.com password: admin y guest@umvel.com password: guest.
