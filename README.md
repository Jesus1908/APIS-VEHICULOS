## APIRest utilizando Express + MySQL
No olvide construir la tabla:
```sql
CREATE DATABASE tiendaveh;

USE tiendaveh;

CREATE TABLE vehiculos
(
	id		INT 				AUTO_INCREMENT PRIMARY KEY,
	marca	VARCHAR(30)		NOT NULL,
	modelo VARCHAR(30)	NOT NULL,
	color  VARCHAR(20) 	NOT NULL,
	precio DECIMAL(9,2) 	NOT NULL,
	placa CHAR(7) 			NOT NULL,
	CONSTRAINT uk_placa_veh UNIQUE (placa)
)ENGINE = INNODB;
```
Modulos requeridos:
```
npm install express mysql2 dotenv nodemon
```