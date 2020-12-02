const { response } = require('express');
const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//=======================
//Buscar productos
//=================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                productos,
            })

        })


})



//=======================
//Obtener todos los productos
//=================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            };



            res.json({
                ok: true,
                productos
            });
        })
})

//=======================
//Obtener producto por id
//=================
app.get('/productos/:id', verificaToken, (req, res) => {


    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            };


            res.json({
                ok: true,
                producto: productoDB
            })
        })




})


//=======================
//Crear nuevo producto
//=================
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body

    console.log(req);

    let producto = new Producto({
        nombre: body.nombre,
        usuario: req.usuario._id,
        categoria: body.categoria,
        precioUni: body.precioUni,
        disponible: body.disponible,
        descripcion: body.descripcion,

    });

    producto.save((err, productoDB) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        };


        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            producto: productoDB,
        })
    })

    //grabar el usuario
    //grabar una categoria del listado

})

//=======================
//actualiza  producto
//=================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el ID no existe '
                }
            });
        };

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;


        productoDB.save((err, productoGuardado) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el ID no existe '
                    }
                });
            };

            res.json({
                ok: true,
                producto: productoGuardado,
            })
        })

    });

    //grabar el usuario
    //grabar una categoria del listado

})


//=======================
//borrar un  producto
//=================
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        };


        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el ID no existe '
                }
            });
        };

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {


            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            };


            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'producto borrado'
            })

        })

    });

})

module.exports = app;