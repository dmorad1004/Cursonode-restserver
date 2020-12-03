const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const uniqid = require('uniqid');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    //validar tipos 

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(200).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son ' + tiposValidos.join(' '),
            },
        })
    }

    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];



    //extensiones permitidas

    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones validas son ' + extensionesValidas.join(' '),
            },
            ext: extension
        })
    }

    //cambiar nombre al archivo
    let nombreArchivo = `${id}-${uniqid()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }




        //aquI, imagen cargada 
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {

            imagenProducto(id, res, nombreArchivo);
        }

    });


});




function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })

        })


    })

}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');


        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })

        })
    })
}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;
