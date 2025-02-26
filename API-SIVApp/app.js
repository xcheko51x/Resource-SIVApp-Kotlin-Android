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
// REGISTRO
//////////////////////////////////////////////////////////
app.post('/registro', (req, res) => {
    const usuario = {
        usuario: req.body.usuario,
        contrasena: req.body.contrasena
    }

    const query = `INSERT INTO usuarios SET ?`
    conexion.query(query, usuario, (error) => {
        if(error) return console.error(error.message);
        var objeto = {}
        objeto.codigo = "200"
        objeto.mensaje = "Se inserto correctamente el usuario"
        objeto.resultado = ""
        res.send(objeto);
    })
});

//////////////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////////////
app.post('/login', (req, res) => {
    const usuario = {
        usuario: req.body.usuario,
        contrasena: req.body.contrasena
    }

    const query = `SELECT * FROM usuarios WHERE usuario='${usuario.usuario}' AND contrasena='${usuario.contrasena}'`
    conexion.query(query, usuario, (error, resultado) => {
        if(error) return console.error(error.message)
        var objeto = {}
        if(resultado.length > 0){
            objeto.codigo = "200"
            objeto.mensaje = `Bienvenido al sistema: ${usuario.usuario}`
            objeto.resultado = ""
        } else {
            objeto.codigo = "400"
            objeto.mensaje = "No hay registro con esa información"
            objeto.resultado = ""
        }

        res.json(objeto);
    })
});

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
            objeto.codigo = "400"
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
        var objeto = {}
        objeto.codigo = "200"
        objeto.mensaje = "Se eliminó correctamente el producto"
        objeto.resultado = []
        res.send(objeto);
    })
});

//////////////////////////////////////////////////////////
// END PRODUCTOS
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
// VENTAS
//////////////////////////////////////////////////////////

// CONSULT VENTA DEVOLUCION
app.get('/venta', (req, res) => {
    //const {idVenta} = req.paramsç
    const idVenta = req.query.id_venta

    const query = `SELECT * FROM ventas WHERE idVenta='${idVenta}'`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)
        var objeto = {}
        if(resultado.length > 0) {
            objeto.codigo = "200"
            objeto.mensaje = "Producto"
            objeto.resultado = resultado
            res.json(objeto)
        } else {
            objeto.codigo = "400"
            objeto.mensaje = "No hay registro con ese código"
            objeto.resultado = []
            res.send(objeto)
        }
    })
});

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

                var arrComa = element.datosProdVenta.split("_")
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
        total: req.body.total
    }

    console.log(venta.datosProdVenta)

    var aux = venta.datosProdVenta.replace(',', '_')
    var productos = aux.split('_')
    //console.log(productos)
    
    var objeto = {}
    for(var i = 0 ; i < productos.length ; i+=3) {
        //console.log(productos[i])
        //console.log(productos[i+1])
        
        const updateAlmacen = `UPDATE productos SET almacen=almacen-'${productos[i+1]}' WHERE codProducto='${productos[i]}'`
        conexion.query(updateAlmacen, (error) => {
            if(error) return console.error(error.message);
        })
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





//////////////////////////////////////////////////////////
// DEVOLUCIONES
//////////////////////////////////////////////////////////
// CONSULT DEVOLUCIONES PERIODO
app.get('/devoluciones/periodo', (req, res) => {
    const fechaInicio = req.query.fechaInicio
    const fechaFinal = req.query.fechaFinal

    const query = `SELECT * FROM devoluciones WHERE fechaVenta BETWEEN '${fechaInicio}' AND '${fechaFinal}' ORDER BY fechaVenta ASC;`
    conexion.query(query, (error, resultado) => {
        var respuesta = {}
        var arrayVentas = []
        var arrayProds = []

        if(resultado.length > 0){
            respuesta.codigo = "200"
            respuesta.mensaje = "Devoluciones"
            
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
                        total: element.total,
                        fechaDevolucion: element.fechaDevolucion
                    }
                )
            });
            respuesta.resultado = arrayVentas
            res.send(respuesta)
        } else {
            respuesta.codigo = "200"
            respuesta.mensaje = "No hay devoluciones en ese periodo de tiempo"
            respuesta.resultado = []
            res.send(respuesta);
        }

        //console.log(respuesta)
    })
});

app.get('/devoluciones', (req, res) => {
    const idVenta = req.query.id_venta
 
    const queryConsult = `SELECT * FROM ventas WHERE idVenta='${idVenta}'`
    conexion.query(queryConsult, (error, resultado) => {
        if(error) return console.error(error.message)
        var resConsultVenta = {}
        if(resultado.length > 0) {
            resConsultVenta = resultado

            const hoy = new Date()
            const fechaHoy = `${hoy.getFullYear()}-${hoy.getMonth()+1}-${hoy.getDate()}`

            resConsultVenta[0].fechaDevolucion = fechaHoy

            //res.json(resConsultVenta[0].datosProdVenta)

            const arrProductos = resConsultVenta[0].datosProdVenta.split("_")
            //res.json(resConsultVenta[0].datosProdVenta)
            for(var i = 0 ; i < arrProductos.length ; i+=3) {
                const updateAlmacen = `UPDATE productos SET almacen=almacen+'${arrProductos[i+1]}' WHERE codProducto='${arrProductos[i]}'`
                conexion.query(updateAlmacen, (error) => {
                    if(error) return console.error(error.message);
                })
            }

            const queryAddDevoluciones = `INSERT INTO devoluciones SET ?`
            conexion.query(queryAddDevoluciones, resConsultVenta, (error) => {
                if(error) return console.error(error.message);

                const queryDeleteVenta = `DELETE FROM ventas WHERE idVenta='${idVenta}'`
                conexion.query(queryDeleteVenta, (error) => {
                if(error) return console.error(error.message)
                var objeto = {}
                objeto.codigo = "200"
                objeto.mensaje = "Se registro correctamente la devolución"
                objeto.resultado = []

                res.send(objeto);
                })
            })
        }
    })
});


//////////////////////////////////////////////////////////
// END DEVOLUCIONES
//////////////////////////////////////////////////////////