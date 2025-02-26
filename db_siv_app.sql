CREATE DATABASE db_siv_app;

CREATE TABLE `usuarios` (
  `usuario` varchar(50) PRIMARY KEY,
  `contrasena` varchar(10) NOT NULL
);

CREATE TABLE `productos` (
  `codProducto` varchar(50) NOT NULL,
  `nomProducto` text NOT NULL,
  `descripcion` text NOT NULL,
  `nomProveedor` varchar(100) NOT NULL,
  `precio` double NOT NULL,
  `almacen` int(11) NOT NULL
);

INSERT INTO `productos` (`codProducto`, `nomProducto`, `descripcion`, `nomProveedor`, `precio`, `almacen`) VALUES
('3086129999675', 'plumon', 'marcador color rojo', 'papeleria', 45, 30),
('738545010481', 'salsa picante', '370ml', 'abarrotera', 15, 24),
('7501020607048', 'gel antibacterial', '300ml', 'farmacia', 80, 100);


CREATE TABLE `proveedores` (
  `nomProveedor` varchar(100) NOT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `email` text DEFAULT NULL
);


INSERT INTO `proveedores` (`nomProveedor`, `telefono`, `email`) VALUES
('abarrotera', '456123789', 'ventas@abarrotera.com.mx'),
('farmacia', '123456789', 'ventasfarmacia@farmacia.com.mx'),
('papeleria', '987654321', 'papeleriaventas@papeleria.mx');


CREATE TABLE `ventas` (
  `idVenta` varchar(100) NOT NULL,
  `datosProdVenta` text NOT NULL,
  `fechaVenta` date NOT NULL,
  `total` double NOT NULL
);

create table `devoluciones`(
    idVenta varchar(100) not null,
    datosProdVenta text not null,
    fechaVenta date not null,
    total double not null,
    fechaDevolucion date not null
);


INSERT INTO `ventas` (`idVenta`, `datosProdVenta`, `fechaVenta`, `total`) VALUES
('1668111141543', '3086129999675_1_30.0,7501020607048_1_80.0', '2023-04-02', 110),
('1668111141703', '3086129999675_3_30.0,7501020607048_2_80.0', '2023-04-03', 250),
('1668111159796', '3086129999675_1_30.0', '2023-04-04', 30),
('1668113278611', '738545010481_2_15.0', '2023-04-04', 30);


ALTER TABLE `productos`
  ADD PRIMARY KEY (`codProducto`),
  ADD KEY `fk_productos_proveedores` (`nomProveedor`);


ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`nomProveedor`);


ALTER TABLE `ventas`
  ADD PRIMARY KEY (`idVenta`);

  ALTER TABLE `devoluciones`
  ADD PRIMARY KEY (`idVenta`);


ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_proveedores` FOREIGN KEY (`nomProveedor`) REFERENCES `proveedores` (`nomProveedor`);
