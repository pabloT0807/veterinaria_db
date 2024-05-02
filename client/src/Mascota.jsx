import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useState, useRef } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import "./Mascota.css";
import { Link } from "react-router-dom";
import Cita from "./Cita";
import { useReactToPrint } from "react-to-print";

function Mascota() {
  const componentPDF = useRef();
  const [id_mascota, setId_mascota] = useState(0);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [peso, setPeso] = useState(0);
  const [raza_id_raza, setRaza_id_raza] = useState(0);

  const [disabledRows, setDisabledRows] = useState([]);

  /**detalles */
  const [detallesMascota, setDetallesMascota] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  //editar
  const [editar, setEditar] = useState(false);

  const { id_cliente } = useParams();
  const [cliente_id_cliente, setCliente_id_cliente] = useState(id_cliente);

  const [mascotaList, setMascotas] = useState([]);

  /**METODOS PARA CONFIGURAR LAS PETICIONES */

  const addMascota = () => {
    Axios.post("http://localhost:3001/create-mascota", {
      nombre: nombre,
      edad: edad,
      peso: peso,
      raza_id_raza: raza_id_raza,
      cliente_id_cliente: cliente_id_cliente,
    })
      .then(() => {
        getMascota();
        alert("mascota agregada");

        Swal.fire({
          title: "<strong>registro exitoso</strong>",
          html:
            "<i>La mascota <strong>" +
            nombre +
            "</strong> ha sigo registrado</i>",
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
  };

  /**METODO PARA LIMPIAR CAMPOS */
  const limpiarCampos = () => {
    setNombre("");
    setEdad("");
    setPeso("");
    setRaza_id_raza("");
    setCliente_id_cliente("");

    /**regresar al boton de registrar */
    setEditar(false);
  };
  const editarMascota = (val) => {
    setEditar(true);

    setNombre(val[1]);
    setEdad(val[2]);
    setPeso(val[3]);
    setRaza_id_raza(parseInt(val[4], 10)); // convertir a numero
    setCliente_id_cliente(parseInt(val[5], 10)); // convertir a numero
    setId_mascota(parseInt(val[0], 10));
  };

  //metodos para editar
  const updateMascota = () => {
    //const idClienteNumerico = parseInt(id_cliente, 10);
    console.log("Datos a enviar para la actualización:", {
      id_mascota,
      nombre,
      edad,
      peso,
      raza_id_raza,
      cliente_id_cliente,
    });

    Axios.put("http://localhost:3001/updateMascota", {
      id_mascota: id_mascota,
      nombre: nombre,
      edad: edad,
      peso: peso,
      raza_id_raza: raza_id_raza,
      cliente_id_cliente: cliente_id_cliente,
    })
      .then(() => {
        getMascota();
        alert("mascota actualizado");
        limpiarCampos();

        Swal.fire({
          title: "<strong>Actualizacion exitosa!!!</strong>",
          html:
            "<i>La mascota <strong>" +
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

  //eliminar mascota
  const deleteMascota = async (val) => {
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
            `http://localhost:3001/deleteMascota/${val.id_mascota}`
          );

          getMascota();
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
            text: "No se logró eliminar la mascota.",
            footer:
              error.message === "Network Error"
                ? "Intente más tarde"
                : error.message,
          });
        } /** */
      }
    });
  };

  /**detalles */
  const verDetalles = (val) => {
    setDetallesMascota(val);
    setMostrarDetalles(true);
  };

  const mostrarDetallesMascotas = (mascota) => {
    setDetallesMascota({
      id_mascota: mascota[0],
      nombre: mascota[1],
      edad: mascota[2],
      peso: mascota[3],
      raza_id_raza: mascota[4],
      cliente_id_cliente: cliente_id_cliente[5],
    });
    setMostrarDetalles(true);
  };
  /**pdf metodo */
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => alert("informacion guardada en pdf"),
  });

  const getMascota = () => {
    Axios.get("http://localhost:3001/obtenerMascotas")
      .then((response) => {
        // console.log("Data from server:", response.data);
        setMascotas(response.data);
        /**extraer las direcciones */
        // const opciones = [
        //   ...new Set(response.data.map((cliente) => cliente[4])),
        // ];
        // setOpcionesDireccion(opciones);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  getMascota();

  const toggleDisableRow = (mascotaId) => {
    setDisabledRows((prevDisabledRows) => {
      if (prevDisabledRows.includes(mascotaId)) {
        // Si ya está deshabilitada, quitarla de la lista
        return prevDisabledRows.filter((id) => id !== mascotaId);
      } else {
        // Si no está deshabilitada, agregarla a la lista
        return [...prevDisabledRows, mascotaId];
      }
    });
  };

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">GESTION DE MASCOTAS</div>
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
              edad:{" "}
            </span>
            <input
              type="number"
              value={edad}
              onChange={(event) => {
                setEdad(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese edad"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              peso:{" "}
            </span>
            <input
              type="number"
              value={peso}
              onChange={(event) => {
                setPeso(event.target.value); // Cambiar idEmpleado(event.target.value) a setIdEmpleado(event.target.value)
              }}
              className="form-control"
              placeholder="peso"
              aria-label="peso"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              raza_id:{" "}
            </span>
            <input
              type="number"
              value={raza_id_raza}
              onChange={(event) => {
                setRaza_id_raza(event.target.value); // Cambiar idEmpleado(event.target.value) a setIdEmpleado(event.target.value)
              }}
              className="form-control"
              placeholder="direccion"
              aria-label="id de la raza"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              id_cliente:{""}
            </span>
            <input
              type="number"
              value={cliente_id_cliente}
              readOnly
              onChange={(event) => {
                setCliente_id_cliente(event.target.value); // Cambiar idEmpleado(event.target.value) a setIdEmpleado(event.target.value)
              }}
              className="form-control"
              placeholder="id del cliente"
              aria-label="id del cliente"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="card-footer text-muted">
          {" "}
          {/**botones de add,update */}
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={updateMascota}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                cancelar
              </button>
            </div>
          ) : (
            /**DE LO CONTRARIO */

            <button className="btn btn-success" onClick={addMascota}>
              Registrar
            </button>
          )}
          <Link to={"/Raza"}>
            <button className="btn btn-outline-primary btn-sep">
              Ver razas
            </button>
          </Link>
          <button className="btn btn-danger btn-sep" onClick={generatePDF}>
            PDF
          </button>
        </div>
        {/**termina diseño boton  */}
      </div>
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">Peso</th>
              <th scope="col">raza_id</th>
              <th scope="col">cliente_id</th>
              <th scope="col">Nombre del cliente</th>
              <th scope="col">acciones</th>
            </tr>
          </thead>
          <tbody>
            {mascotaList.map((val, key) => (
              <tr
                key={val[0]}
                style={{
                  backgroundColor: disabledRows.includes(val[0])
                    ? "red"
                    : "transparent",
                  color: disabledRows.includes(val[0]) ? "white" : "black",
                }}
              >
                {" "}
                {/**id */}
                <td>{val[0]}</td> {/*id*/}
                <td>{val[1]}</td> {/**nombre*/}
                <td>{val[2] || "N/A"}</td> {/**edad */}
                <td>{val[3] || "N/A"}</td> {/**peso */}
                <td>{val[4] || "N/A"}</td> {/**raza_id */}
                <td>{val[5] || "N/A"}</td> {/**cliente_id */}
                <td>{val[6]}</td>
                <td>
                  {" "}
                  {/**botones  */}
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic mixed styles example"
                  >
                    <button
                      disabled={disabledRows.includes(val[0]) || editar}
                      type="button"
                      onClick={() => {
                        editarMascota(val);
                      }}
                      className="btn btn-info"
                    >
                      Editar
                    </button>
                    <button
                      disabled={disabledRows.includes(val[0]) || editar}
                      type="button"
                      onClick={() => {
                        deleteMascota({
                          id_mascota: val[0],
                          nombre: val[1],
                          edad: val[2],
                          peso: val[3],
                          raza_id_raza: val[4],
                          cliente_id_cliente: val[5],
                        });
                      }}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                    <button
                      disabled={disabledRows.includes(val[0]) || editar}
                      type="button"
                      onClick={() => {
                        verDetalles(val);
                      }}
                      className="btn btn-info"
                    >
                      Detalles
                    </button>

                    <button
                      onClick={() => toggleDisableRow(val[0])}
                      className="btn btn-danger"
                    >
                      {disabledRows.includes(val[0])
                        ? "Habilitar"
                        : "Deshabilitar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>{" "}
      </div>
      {/**termina tabla */}

      {/**empieza tabla de detalles */}
      {mostrarDetalles && detallesMascota && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Detalles del cliente</h5>
            <p className="card-text">
              <strong>id_mascota:</strong> {detallesMascota[0]}
            </p>
            <p className="card-text">
              <strong>nombre:</strong> {detallesMascota[1]}
            </p>
            <p className="card-text">
              <strong>edad:</strong> {detallesMascota[2]}
            </p>
            <p className="card-text">
              <strong>peso:</strong> {detallesMascota[3]}
            </p>
            <p className="card-text">
              <strong>raza_id:</strong> {detallesMascota[4]}
            </p>
            <p className="card-text">
              <strong>cliente_id:</strong> {detallesMascota[5]}
            </p>

            <button
              className="btn btn-secondary btnDetalles"
              onClick={() => setMostrarDetalles(false)}
            >
              Cerrar Detalles
            </button>

            <Link to={`/Cita/${detallesMascota[0]}`}>
              <button className="btn btn-secondary btnDetalles">
                Generar cita
              </button>
            </Link>

            <Link to={`/Operacion/${detallesMascota[0]}`}>
              <button className="btn btn-secondary btnDetalles">
                Operacion registro
              </button>
            </Link>

            <Link to={`/Diagnostico`}>
              <button className="btn btn-secondary btnDetalles">
                Dar diagnostico
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
export default Mascota;
