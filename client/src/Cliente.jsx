import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useState, useRef } from "react";
import Axios from "axios";
import "./Cliente.css";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Alert } from "bootstrap";

function Cliente() {
  //constantes
  /**pdf */
  const componentPDF = useRef();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion_id_direccion, setDireccion_id_direccion] = useState(0);
  const [id_cliente, setId_cliente] = useState(0);

  const [editar, setEditar] = useState(false);
  const [clientesList, setClientes] = useState([]);

  const [disabledRows, setDisabledRows] = useState([]);


  const [opcionesDireccion, setOpcionesDireccion] = useState([]);

  /**para detalles */
  const [detallesCliente, setDetallesCliente] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  //para filtar por nombre
  const [filtrarNombre, setFiltrarNombre] = useState("");

  /**METODO PARA AGREGAR UN CLIENTE */
  const addCliente = () => {
    Axios.post("http://localhost:3001/create-cliente", {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      direccion_id_direccion: direccion_id_direccion,
    })
      .then(() => {
        getCliente();
        alert("cliente registrado");
        limpiarCampos();
        Swal.fire({
          title: "<strong>registro exitoso!</strong>",
          html:
            "<i>El cliente <strong>" +
            nombre +
            "</strong> ha sido registrado</i>",
          icon: "success",
          timer: 3000,
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          footer:
            JSON.parse(JSON.stringify(error)).message === "Network Error"
              ? "Intente mas tarde"
              : JSON.parse(JSON.stringify(error)).message,
        });
      });
  }; /**TERMINA METODO ADD */

  /**METODO PARA LIMPIAR CAMPOS */
  const limpiarCampos = () => {
    setNombre("");
    setApellido("");
    setTelefono("");
    setDireccion_id_direccion("");
    setId_cliente("");

    /**regresar al boton de registrar */
    setEditar(false);
  };
  const editarCliente = (val) => {
    setEditar(true);

    setNombre(val[1]);
    setApellido(val[2]);
    setTelefono(val[3]);
    setDireccion_id_direccion(parseInt(val[4], 10)); // convertir a numero
    setId_cliente(parseInt(val[0], 10)); // convertir a numero
  };

  /**update cliente */
  const updateClientes = () => {
    //const idClienteNumerico = parseInt(id_cliente, 10);
    console.log("Datos a enviar para la actualización:", {
      id_cliente,
      nombre,
      apellido,
      telefono,
      direccion_id_direccion,
    });

    Axios.put("http://localhost:3001/updateCliente", {
      id_cliente: id_cliente,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      direccion_id_direccion: direccion_id_direccion,
    })
      .then(() => {
        getCliente();
        alert("cliente actualizado");
        limpiarCampos();

        Swal.fire({
          title: "<strong>Actualizacion exitosa!!!</strong>",
          html:
            "<i>El cliente <strong>" +
            nombre +
            "</strong> ha sido actualizado</i>",
          icon: "success",
          timer: 3000,
        });
      })
      .catch(function (error) {
        console.error("Error al enviar la solicitud de actualización:", error);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          footer:
            JSON.parse(JSON.stringify(error)).message === "Network Error"
              ? "Intente mas tarde"
              : JSON.parse(JSON.stringify(error)).message,
        });
      });
  };
  /**eliminar cliente */

  const deleteCliente = async (val) => {
    // if (!val) {
    //   console.error('Val no tiene un formato válido:', val);
    //   return;
    // }

    // const id_cliente = Array.isArray(val) ? val[0] : val.id_cliente;

    // if (!id_cliente || isNaN(id_cliente) || id_cliente === 0) {
    //   console.error('ID del cliente no es un número válido:', id_cliente);
    //   return;
    // }

    Swal.fire({
      title: "Confirmar eliminado?",
      html:
        "<i>¿Realmente desea eliminar a <strong>" +
        val.nombre +
        "</strong> ?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(
            `http://localhost:3001/deleteCliente/${val.id_cliente}`
          );

          getCliente();
          limpiarCampos();
          Swal.fire({
            position: "top-end",
            icon: "success",
            showConfirmButton: false,
            title: val.nombre + " has been deleted.",
            timer: 2000,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logró eliminar el cliente.",
            footer:
              error.message === "Network Error"
                ? "Intente más tarde"
                : error.message,
          });
        } /** */
      }
    });
  };

  //detalles
  const verDetalles = (val) => {
    setDetallesCliente(val);
    setMostrarDetalles(true);
  };

  /**mostrar detalles del cliente */
  const mostrarDetallesCliente = (cliente) => {
    setDetallesCliente({
      id_cliente: cliente[0],
      nombre: cliente[1],
      apellido: cliente[2],
      telefono: cliente[3],
      direccion_id_direccion: cliente[4],
    });
    setMostrarDetalles(true);
  };

  /**pdf metodo */
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => alert("informacion guardada en pdf"),
  });

  const getCliente = () => {
    Axios.get("http://localhost:3001/obtenerClientes")
      .then((response) => {
        //      console.log("Data from server:", response.data);
        setClientes(response.data);
        //        console.log("Clientes actualizados:", clientesList);

        /**extraer las direcciones */
        /**para sacar las opciones de IDS */
        const opciones = [
          ...new Set(response.data.map((cliente) => cliente[4])),
        ];
        setOpcionesDireccion(opciones);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  getCliente();

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">GESTION DE CLIENTES</div>
        <div className="card-body">
          {" "}
          {/**parte de registrar */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombre:{" "}
            </span>
            <input
              type="text"
              value={nombre}
              onChange={(event) => {
                setNombre(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese un nombre"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              apellido:{" "}
            </span>
            <input
              type="text"
              value={apellido}
              onChange={(event) => {
                setApellido(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese apellido"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              telefono:{" "}
            </span>
            <input
              type="text"
              value={telefono}
              onChange={(event) => {
                setTelefono(event.target.value); // Cambiar idEmpleado(event.target.value) a setIdEmpleado(event.target.value)
              }}
              className="form-control"
              placeholder="telefono"
              aria-label="ID del empleado"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputGroupSelect01">
              Opciones de Dirección
            </label>
            <select
              className="form-select"
              id="inputGroupSelect01"
              value={direccion_id_direccion}
              onChange={(event) =>
                setDireccion_id_direccion(event.target.value)
              }
            >
              <option value="" disabled>
                Selecciona...
              </option>
              {opcionesDireccion.map((opcion, index) => (
                <option key={index} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-footer text-muted">
          {" "}
          {/**botones de add,update */}
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={updateClientes}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                cancelar
              </button>
            </div>
          ) : (
            /**DE LO CONTRARIO */

            <button className="btn btn-success btn-sep" onClick={addCliente}>
              Registrar
            </button>
          )}
          <Link to={"/Direcciones"}>
            <button className="btn btn-outline-primary btn-sep">
              Ver direcciones
            </button>
          </Link>
          <button className="btn btn-danger btn-sep" onClick={generatePDF}>
            PDF
          </button>
        </div>

        {/**termina diseño boton  */}
      </div>
      <div>
        <nav className="navbar navbar-light bg-light">
          <form className="form-inline">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={filtrarNombre}
              onChange={(e) => setFiltrarNombre(e.target.value)}
            />
          </form>
        </nav>
      </div>
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido</th>
              <th scope="col">Telefono</th>
              <th scope="col">id_direccion</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesList
              .filter(
                (cliente) =>
                  cliente.nombre &&
                  cliente.nombre
                    .toLowerCase()
                    .includes(filtrarNombre.toLowerCase())
              )
              .map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido || "N/A"}</td>
                  <td>{cliente.telefono || "N/A"}</td>
                  <td>{cliente.direccion_id_direccion || "N/A"}</td>
                  <td>{/* botones */}</td>

                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic mixed styles example"
                    >
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => editarCliente(cliente)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => deleteCliente(cliente)}
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => verDetalles(cliente)}
                      >
                        Detalles
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
          </tbody>
        </table>{" "}
      </div>
      {/*termina tabla*/}
      {/**ver detalles */}
      {mostrarDetalles && detallesCliente && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Detalles del cliente</h5>
            <p className="card-text">
              <strong>Nombre:</strong> {detallesCliente.nombre}
            </p>
            <p className="card-text">
              <strong>Apellido:</strong> {detallesCliente.apellido}
            </p>
            <p className="card-text">
              <strong>Telefono:</strong> {detallesCliente.telefono}
            </p>
            <p className="card-text">
              <strong>id_direccion:</strong>{" "}
              {detallesCliente.direccion_id_direccion}
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => setMostrarDetalles(false)}
            >
              Cerrar Detalles
            </button>
            <Link to={`/Mascota/${detallesCliente.id_cliente}`}>
              <button className="btn btn-secondary">Ir a Animal</button>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
export default Cliente;
