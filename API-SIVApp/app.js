const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express()

const PORT = 3000

const conexion = mysql.createConnection(
    {
        host:'localhost',
        database:'db_siv_app',
        user: 'root',
        password: ''
    }
);

conexion.connect(error => {
    if(error) throw error;
    console.log('Conexión exitosa a la base de datos');
});

app.use(bodyParser.json())

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.get('/', (req, res) => {    
    res.json('API SIVAPP')
})

//////////////////////////////////////////////////////////
// PROVEEDORES
//////////////////////////////////////////////////////////

// CONSULT PROVEEDORES
app.get('/proveedores', (req, res) => {
    const query = `SELECT * FROM proveedores`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)
        var objeto = {}
        if(resultado.length > 0){
            objeto.codigo = "200"
            objeto.mensaje = "Lista proveedores"
            objeto.resultado = resultado
            res.json(objeto);
        } else {
            objeto.codigo = "200"
            objeto.mensaje = "No hay registros"
            objeto.resultado = []
            res.send(objeto);
        }
    })
});

// CONSULT PROVEEDOR
app.get('/proveedores/:nomProveedor', (req, res) => {
    const {nomProveedor} = req.params

    const query = `SELECT * FROM proveedores WHERE nomProveedor='${nomProveedor}'`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)
        var objeto = {}
        if(resultado.length > 0) {
            objeto.codigo = "200"
            objeto.mensaje = "Proveedor"
            objeto.resultado = resultado
            res.json(objeto)
        } else {
            objeto.codigo = "200"
            objeto.mensaje = "No hay coincidencinas"
            objeto.resultado = []
            res.send(objeto);
        }
    })
});

// ADD PROVEEDOR
app.post('/proveedores/add', (req, res) => {
    const proveedor = {
        nomProveedor: req.body.nomProveedor,
        telefono: req.body.telefono,
        email: req.body.email
    }

    const query = `INSERT INTO proveedores SET ?`
    conexion.query(query, proveedor, (error) => {
        if(error) return console.error(error.message);
        var objeto = {}
        objeto.codigo = "200"
        objeto.mensaje = "Se inserto correctamente el proveedor"
        objeto.resultado = []
        res.send(objeto);
    })
});

// UPDATE PROVEEDOR
app.put('/proveedores/update/:nomProveedor', (req, res) => {
    const { nomProveedor } = req.params
    const { telefono, email } = req.body

    const query = `UPDATE proveedores SET telefono='${telefono}', email='${email}' WHERE nomProveedor='${nomProveedor}'`
    conexion.query(query, (error) => {
        if(error) return console.error(error.message);
        var objeto = {}
        objeto.codigo = "200"
        objeto.mensaje = "Se actualizo correctamente el proveedor"
        objeto.resultado = []
        res.send(objeto);
    })
});

//////////////////////////////////////////////////////////
// END PROVEEDORES
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
// PRODUCTOS
//////////////////////////////////////////////////////////

// CONSULT PRODUCTOS
app.get('/productos', (req, res) => {
    const query = `SELECT * FROM productos`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)
        var objeto = {}
        if(resultado.length > 0){
            objeto.codigo = "200"
            objeto.mensaje = "Lista Productos"
            objeto.resultado = resultado
            res.json(objeto);
        } else {
            objeto.codigo = "200"
            objeto.mensaje = "No hay registros"
            objeto.resultado = []
            res.send(objeto);
        }
    })
});

// CONSULT PRODUCTO
app.get('/productos/:codProducto', (req, res) => {
    const {codProducto} = req.params

    const query = `SELECT * FROM productos WHERE codProducto='${codProducto}'`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)
        var objeto = {}
        if(resultado.length > 0) {
            objeto.codigo = "200"
            objeto.mensaje = "Producto"
            objeto.resultado = resultado
            res.json(objeto);
        } else {
            objeto.codigo = "200"
            objeto.mensaje = "No hay registro con ese código"
            objeto.resultado = []
            res.send(objeto);
        }
    })
});

// ADD PRODUCTO
app.post('/productos/add', (req, res) => {
    const producto = {
        codProducto: req.body.codProducto,
        nomProducto: req.body.nomProducto,
        descripcion: req.body.descripcion,
        nomProveedor: req.body.nomProveedor,
        precio: req.body.precio,
        almacen: req.body.almacen
    }

    const query = `INSERT INTO productos SET ?`
    conexion.query(query, producto, (error) => {
        if(error) return console.error(error.message);
        var objeto = {}
        objeto.codigo = "200"
        objeto.mensaje = "Se inserto correctamente el producto"
        objeto.resultado = []
        res.send(objeto);
    })
});

// UPDATE PRODUCTO
app.put('/productos/update/:codProducto', (req, res) => {
    const { codProducto } = req.params
    const { 
        nomProducto,
        descripcion,
        nomProveedor,
        precio,
        almacen
    } = req.body

    const query = `UPDATE productos 
        SET nomProducto='${nomProducto}', 
        descripcion='${descripcion}',
        nomProveedor='${nomProveedor}',
        precio='${precio}',
        almacen='${almacen}'
        WHERE codProducto='${codProducto}'
        `
    conexion.query(query, (error) => {
        if(error) return console.error(error.message);
        var objeto = {}
        objeto.codigo = "200"
        objeto.mensaje = "Se actualizo correctamente el producto"
        objeto.resultado = []
        res.send(objeto);
    })
});

// DELETE PRODUCTO
app.delete('/productos/delete/:codProducto', (req, res) => {
    const { codProducto } = req.params

    const query = `DELETE FROM productos WHERE codProducto='${codProducto}'`
    conexion.query(query, (error) => {
        if(error) return console.error(error.message);
        res.send(`Se eliminó correctamente el producto`);
    })
});

//////////////////////////////////////////////////////////
// END PRODUCTOS
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
// VENTAS
//////////////////////////////////////////////////////////

// CONSULT VENTAS
app.get('/ventas', (req, res) => {
    const query = `SELECT * FROM ventas`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)
        var respuesta = {}
        var arrayVentas = []
        var arrayProds = []

        if(resultado.length > 0){
            respuesta.codigo = "200"
            respuesta.mensaje = "Ventas"
            
            resultado.forEach(element => {
                arrayProds = []

                var arrComa = element.datosProdVenta.split(",")
                arrComa.forEach(element => {
                    var arrGuion = element.split("_")

                    arrayProds.push(
                        {
                            codProducto: arrGuion[0],
                            cantidad: arrGuion[1],
                            precioUnidad: arrGuion[2]
                        }
                    )
                })

                arrayVentas.push(
                    {
                        idVenta: element.idVenta,
                        totalVenta: element.total,
                        fechaVenta: element.fechaVenta,
                        prodsVenta: arrayProds
                    }
                )
            });
            respuesta.resultado = arrayVentas
            res.send(respuesta)
        } else {
            respuesta.codigo = "200"
            respuesta.mensaje = "No hay registros de ventas"
            respuesta.resultado = []
            res.send(respuesta);
        }
    })
});
// CONSULT VENTA PERIODO
app.get('/ventas/periodo', (req, res) => {
    const fechaInicio = req.query.fechaInicio
    const fechaFinal = req.query.fechaFinal

    const query = `SELECT * FROM ventas WHERE fechaVenta BETWEEN '${fechaInicio}' AND '${fechaFinal}' ORDER BY fechaVenta ASC;`
    conexion.query(query, (error, resultado) => {
        var respuesta = {}
        var arrayVentas = []
        var arrayProds = []

        if(resultado.length > 0){
            respuesta.codigo = "200"
            respuesta.mensaje = "Ventas"
            
            resultado.forEach(element => {
                arrayProds = []

                var arrComa = element.datosProdVenta.split(",")
                arrComa.forEach(element => {
                    var arrGuion = element.split("_")

                    arrayProds.push(
                        {
                            codProducto: arrGuion[0],
                            cantidad: arrGuion[1],
                            precioUnidad: arrGuion[2]
                        }
                    )
                })

                arrayVentas.push(
                    {
                        idVenta: element.idVenta,
                        totalVenta: element.total,
                        fechaVenta: element.fechaVenta,
                        prodsVenta: arrayProds,
                        total: element.total
                    }
                )
            });
            respuesta.resultado = arrayVentas
            res.send(respuesta)
        } else {
            respuesta.codigo = "200"
            respuesta.mensaje = "No hay ventas en ese periodo de tiempo"
            respuesta.resultado = []
            res.send(respuesta);
        }

        //console.log(respuesta)
    })
});

// ADD VENTA
app.post('/ventas/add', (req, res) => {
    const venta = {
        idVenta: req.body.idVenta,
        datosProdVenta: req.body.codProductos,
        fechaVenta: req.body.fechaVenta,
        total: req.body.total,
    }

    const query = `INSERT INTO ventas SET ?`
    conexion.query(query, venta, (error) => {
        if(error) return console.error(error.message);
        var objeto = {}
        objeto.codigo = "200"
        objeto.mensaje = "Se inserto correctamente la venta"
        objeto.resultado = []
        res.send(objeto);
    })
});

//////////////////////////////////////////////////////////
// END VENTAS
//////////////////////////////////////////////////////////