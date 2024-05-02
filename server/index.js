const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");


app.use(cors());
app.use(express.json());

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "aguilas0807", // Cambia esto por tu contraseña de MySQL
    database: "veterinaria_servicios" // Cambia esto por el nombre de tu base de datos

};

// Crear una pool de conexiones a MySQL
const pool = mysql.createPool(dbConfig);

// Registrar un cliente
app.post("/create-cliente", (req, res) => {
    const { nombre, apellido, telefono, direccion_id_direccion } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO cliente (nombre, apellido, telefono, direccion_id_direccion) VALUES (?, ?, ?, ?)";
        connection.query(query, [nombre, apellido, telefono, direccion_id_direccion], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar cliente:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Cliente agregado" });
        });
    });
});

// Método para obtener clientes
app.get("/obtenerClientes", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "SELECT * FROM cliente";
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al obtener clientes:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json(results);
        });
    });
});

// Método para actualizar cliente
app.put("/updateCliente", (req, res) => {
    const { id_cliente, nombre, apellido, telefono, direccion_id_direccion } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "UPDATE cliente SET nombre=?, apellido=?, telefono=?, direccion_id_direccion=? WHERE id_cliente=?";
        connection.query(query, [nombre, apellido, telefono, direccion_id_direccion, id_cliente], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al actualizar cliente:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Cliente actualizado" });
        });
    });
});


/** Eliminar un cliente */
app.delete("/deleteCliente/:id_cliente", (req, res) => {
    const id_cliente = req.params.id_cliente;

    // Validar que id_cliente sea un número
    if (!id_cliente || isNaN(id_cliente) || id_cliente === '0') {
        console.error('ID del cliente no es un número válido:', id_cliente);
        return res.status(400).json({ error: "ID de cliente no válido" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "DELETE FROM cliente WHERE id_cliente = ?";
        connection.query(query, [id_cliente], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al eliminar cliente:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Cliente eliminado" });
        });
    });
});

/******************* MASCOTA *****************/
/** Crear mascota */
app.post("/create-mascota", (req, res) => {
    const { nombre, edad, peso, raza_id_raza, cliente_id_cliente } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO mascota (nombre, edad, peso, raza_id_raza, cliente_id_cliente) VALUES (?, ?, ?, ?, ?)";
        connection.query(query, [nombre, edad, peso, raza_id_raza, cliente_id_cliente], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar mascota:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Mascota agregada" });
        });
    });
});

/** Obtener mascotas */
app.get("/obtenerMascotas", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "SELECT m.id_mascota, m.nombre, m.edad, m.peso, m.raza_id_raza, m.cliente_id_cliente, cli.nombre FROM mascota m JOIN cliente cli ON m.cliente_id_cliente = cli.id_cliente";
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al obtener mascotas:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json(results);
        });
    });
});

/** Editar mascota */
app.put("/updateMascota", (req, res) => {
    const { id_mascota, nombre, edad, peso, raza_id_raza, cliente_id_cliente } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "UPDATE mascota SET nombre=?, edad=?, peso=?, raza_id_raza=?, cliente_id_cliente=? WHERE id_mascota=?";
        connection.query(query, [nombre, edad, peso, raza_id_raza, cliente_id_cliente, id_mascota], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al actualizar mascota:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Mascota actualizada" });
        });
    });
});

/** Eliminar mascota */
app.delete("/deleteMascota/:id_mascota", (req, res) => {
    const id_mascota = req.params.id_mascota;

    // Validar que id_mascota sea un número
    if (!id_mascota || isNaN(id_mascota) || id_mascota === '0') {
        console.error('ID de la mascota no es un número válido:', id_mascota);
        return res.status(400).json({ error: "ID de la mascota no válido" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "DELETE FROM mascota WHERE id_mascota = ?";
        connection.query(query, [id_mascota], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al eliminar mascota:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Mascota eliminada" });
        });
    });
});

/************************************************************** */

/** Eliminar una raza */
app.delete("/deleteRaza/:id_raza", (req, res) => {
    const id_raza = req.params.id_raza;

    // Validar que id_raza sea un número
    if (!id_raza || isNaN(id_raza) || id_raza === '0') {
        console.error('ID de raza no es un número válido:', id_raza);
        return res.status(400).json({ error: "ID de raza no válido" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "DELETE FROM raza WHERE id_raza = ?";
        connection.query(query, [id_raza], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al eliminar raza:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Tipo de raza eliminado" });
        });
    });
});

/** Obtener diagnósticos */
app.get("/obtenerDiagnosticos", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "SELECT d.id_diagnostico, d.cita_id_cita, d.diagnostico, m.nombre FROM diagnostico d JOIN cita c ON d.cita_id_cita = c.id_cita JOIN mascota m ON c.mascota_id_mascota = m.id_mascota";
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al obtener diagnósticos:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            // Personaliza los datos antes de enviarlos como respuesta JSON
            const dataToSend = results.map(row => ({
                id_diagnostico: row.id_diagnostico,
                cita_id_cita: row.cita_id_cita,
                diagnostico: row.diagnostico,
                nombre_mascota: row.nombre
                // Asegúrate de agregar solo los campos necesarios y evitar referencias circulares
            }));

            res.json(dataToSend);
        });
    });
});

/** Crear diagnóstico */
app.post("/create-diagnostico", (req, res) => {
    const { cita_id_cita, diagnostico } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO diagnostico (cita_id_cita, diagnostico) VALUES (?, ?)";
        connection.query(query, [cita_id_cita, diagnostico], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar diagnóstico:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Diagnóstico agregado" });
        });
    });
});

/** Actualizar diagnóstico */
app.put("/updateDiagnostico", (req, res) => {
    const { id_diagnostico, cita_id_cita, diagnostico } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "UPDATE diagnostico SET cita_id_cita = ?, diagnostico = ? WHERE id_diagnostico = ?";
        connection.query(query, [cita_id_cita, diagnostico, id_diagnostico], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al actualizar diagnóstico:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Diagnóstico actualizado" });
        });
    });
});

/** Termina diagnóstico */
/** Crear operación */
app.post("/create-operacion", (req, res) => {
    const { observaciones, fecha_hora, mascota_id_mascota, medico_id_medico, tipo_operacion_id_tipo_operacion } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO operacion_mascota (observaciones, fecha_hora, mascota_id_mascota, medico_id_medico, tipo_operacion_id_tipo_operacion) VALUES (?, ?, ?, ?, ?)";
        connection.query(query, [observaciones, fecha_hora, mascota_id_mascota, medico_id_medico, tipo_operacion_id_tipo_operacion], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar operación:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Operación agregada" });
        });
    });
});

/** Actualizar tipo de operaciones */
app.put("/updateTipoOperaciones", (req, res) => {
    const { id_tipo_operacion, tipo, costo } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "UPDATE tipo_operacion SET tipo = ?, costo = ? WHERE id_tipo_operacion = ?";
        connection.query(query, [tipo, costo, id_tipo_operacion], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al actualizar tipo de operación:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Tipo de operación actualizado" });
        });
    });
});

/** Crear tipo de operación */
app.post("/create-tipoOperacion", (req, res) => {
    const { tipo, costo } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO tipo_operacion (tipo, costo) VALUES (?, ?)";
        connection.query(query, [tipo, costo], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar tipo de operación:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Tipo de operación agregado" });
        });
    });
});

/** Eliminar tipo de operación */
app.delete("/deleteTipoOperacion/:id_tipo_operacion", (req, res) => {
    const id_tipo_operacion = req.params.id_tipo_operacion;

    // Validar que id_tipo_operacion sea un número
    if (!id_tipo_operacion || isNaN(id_tipo_operacion) || id_tipo_operacion === '0') {
        console.error('ID del tipo de operación no es un número válido:', id_tipo_operacion);
        return res.status(400).json({ error: "ID de tipo de operación no válido" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "DELETE FROM tipo_operacion WHERE id_tipo_operacion = ?";
        connection.query(query, [id_tipo_operacion], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al eliminar tipo de operación:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Tipo de operación eliminado" });
        });
    });
});

/** Obtener servicios */
app.get("/obtenerServicios", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "SELECT * FROM servicio";
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al obtener servicios:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json(results);
        });
    });
});

/** Actualizar servicio */
app.put("/updateServicios", (req, res) => {
    const { id_servicio, tipo_servicio, costo } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "UPDATE servicio SET tipo_servicio = ?, costo = ? WHERE id_servicio = ?";
        connection.query(query, [tipo_servicio, costo, id_servicio], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al actualizar servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Servicio actualizado" });
        });
    });
});

/** Crear servicio */
app.post("/create-servicio", (req, res) => {
    const { tipo_servicio, costo } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO servicio (tipo_servicio, costo) VALUES (?, ?)";
        connection.query(query, [tipo_servicio, costo], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Servicio agregado" });
        });
    });
});

/** Eliminar servicio */
app.delete("/deleteTipoServicio/:id_servicio", (req, res) => {
    const id_servicio = req.params.id_servicio;

    // Validar que id_servicio sea un número
    if (!id_servicio || isNaN(id_servicio) || id_servicio === '0') {
        console.error('ID del servicio no es un número válido:', id_servicio);
        return res.status(400).json({ error: "ID de servicio no válido" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "DELETE FROM servicio WHERE id_servicio = ?";
        connection.query(query, [id_servicio], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al eliminar servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Servicio eliminado" });
        });
    });
});

/** Obtener detalles del servicio */
app.get("/obtenerDetalles", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "SELECT ds.id_detalle_servicio, ds.detalle, ds.servicio_id_servicio, ds.cita_id_cita, m.nombre FROM detalle_servicio ds JOIN cita c ON ds.cita_id_cita = c.id_cita JOIN mascota m ON c.mascota_id_mascota = m.id_mascota";
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al obtener detalles del servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json(results);
        });
    });
});

/** Crear detalle del servicio */
app.post("/create-detalleServicio", (req, res) => {
    const { detalle, servicio_id_servicio, cita_id_cita } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO detalle_servicio (detalle, servicio_id_servicio, cita_id_cita) VALUES (?, ?, ?)";
        connection.query(query, [detalle, servicio_id_servicio, cita_id_cita], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar detalle del servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Detalle del servicio agregado" });
        });
    });
});

/** Termina detalles del servicio / /****************************************** */

/** Crear operación */
app.post("/create-operacion", (req, res) => {
    const { observaciones, fecha_hora, mascota_id_mascota, medico_id_medico, tipo_operacion_id_tipo_operacion } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO operacion_mascota (observaciones, fecha_hora, mascota_id_mascota, medico_id_medico, tipo_operacion_id_tipo_operacion) VALUES (?, ?, ?, ?, ?)";
        connection.query(query, [observaciones, fecha_hora, mascota_id_mascota, medico_id_medico, tipo_operacion_id_tipo_operacion], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar operación:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Operación agregada" });
        });
    });
});

/** Actualizar tipo de operaciones */
app.put("/updateTipoOperaciones", (req, res) => {
    const { id_tipo_operacion, tipo, costo } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "UPDATE tipo_operacion SET tipo = ?, costo = ? WHERE id_tipo_operacion = ?";
        connection.query(query, [tipo, costo, id_tipo_operacion], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al actualizar tipo de operación:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Tipo de operación actualizado" });
        });
    });
});

/** Crear tipo de operación */
app.post("/create-tipoOperacion", (req, res) => {
    const { tipo, costo } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO tipo_operacion (tipo, costo) VALUES (?, ?)";
        connection.query(query, [tipo, costo], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar tipo de operación:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Tipo de operación agregado" });
        });
    });
});

/** Eliminar tipo de operación */
app.delete("/deleteTipoOperacion/:id_tipo_operacion", (req, res) => {
    const id_tipo_operacion = req.params.id_tipo_operacion;

    // Validar que id_tipo_operacion sea un número
    if (!id_tipo_operacion || isNaN(id_tipo_operacion) || id_tipo_operacion === '0') {
        console.error('ID del tipo de operación no es un número válido:', id_tipo_operacion);
        return res.status(400).json({ error: "ID de tipo de operación no válido" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "DELETE FROM tipo_operacion WHERE id_tipo_operacion = ?";
        connection.query(query, [id_tipo_operacion], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al eliminar tipo de operación:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Tipo de operación eliminado" });
        });
    });
});

/** Obtener servicios */
app.get("/obtenerServicios", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "SELECT * FROM servicio";
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al obtener servicios:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json(results);
        });
    });
});

/** Actualizar servicio */
app.put("/updateServicios", (req, res) => {
    const { id_servicio, tipo_servicio, costo } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "UPDATE servicio SET tipo_servicio = ?, costo = ? WHERE id_servicio = ?";
        connection.query(query, [tipo_servicio, costo, id_servicio], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al actualizar servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Servicio actualizado" });
        });
    });
});

/** Crear servicio */
app.post("/create-servicio", (req, res) => {
    const { tipo_servicio, costo } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO servicio (tipo_servicio, costo) VALUES (?, ?)";
        connection.query(query, [tipo_servicio, costo], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Servicio agregado" });
        });
    });
});

/** Eliminar servicio */
app.delete("/deleteTipoServicio/:id_servicio", (req, res) => {
    const id_servicio = req.params.id_servicio;

    // Validar que id_servicio sea un número
    if (!id_servicio || isNaN(id_servicio) || id_servicio === '0') {
        console.error('ID del servicio no es un número válido:', id_servicio);
        return res.status(400).json({ error: "ID de servicio no válido" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "DELETE FROM servicio WHERE id_servicio = ?";
        connection.query(query, [id_servicio], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al eliminar servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Servicio eliminado" });
        });
    });
});

/** Obtener detalles del servicio */
app.get("/obtenerDetalles", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "SELECT ds.id_detalle_servicio, ds.detalle, ds.servicio_id_servicio, ds.cita_id_cita, m.nombre FROM detalle_servicio ds JOIN cita c ON ds.cita_id_cita = c.id_cita JOIN mascota m ON c.mascota_id_mascota = m.id_mascota";
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al obtener detalles del servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json(results);
        });
    });
});

/** Crear detalle del servicio */
app.post("/create-detalleServicio", (req, res) => {
    const { detalle, servicio_id_servicio, cita_id_cita } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO detalle_servicio (detalle, servicio_id_servicio, cita_id_cita) VALUES (?, ?, ?)";
        connection.query(query, [detalle, servicio_id_servicio, cita_id_cita], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar detalle del servicio:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Detalle del servicio agregado" });
        });
    });
});

/** Termina detalles del servicio / /****************************************** */

///direccion
app.post("/create-direccion", (req, res) => {
    const { calle,numero_interior,numero_exterior,alcaldia,colonia,cp } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "INSERT INTO direccion (calle,numero_interior,numero_exterior,alcaldia,colonia,cp) VALUES (?, ?, ?, ?,?,?)";
        connection.query(query, [calle,numero_interior,numero_exterior,alcaldia,colonia,cp], (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al insertar dirección:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json({ mensaje: "Dirección agregada" });
        });
    });
});


app.get("/obtenerDirecciones", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "SELECT * FROM direccion";
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al obtener direcciones:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json(results);
        });
    });
});


app.get("/obtenerRazas", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error al obtener conexión:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const query = "SELECT * FROM raza";
        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error("Error al obtener razas:", err);
                return res.status(500).json({ error: "Error interno del servidor" });
            }

            res.json(results);
        });
    });
});


app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});