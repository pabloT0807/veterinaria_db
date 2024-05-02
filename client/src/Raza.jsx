import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

function Raza() {
  //constantes
  const [id_raza, setId_raza] = useState(0);
  const [nombre, setNombre] = useState("");

  const [razaList, setRaza] = useState([]);

  const [opcionesRaza, setOpcionesRaza] = useState([]);

  const [editar, setEditar] = useState(false);

  //para filtar por nombre
  const [filtrarNombre, setFiltrarNombre] = useState("");

  /**agregar una raza */

  const addRaza = (val) => {
    Axios.post("http://localhost:3001/create-raza", {
      nombre: nombre,
    })
      .then(() => {
        getRaza();
        alert("raza registrada");
        //limpiarCampos();
        Swal.fire({
          title: "<strong>registro exitoso!</strong>",
          html:
            "<i>El tipo de raza :   <strong>" +
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
  };

  /**termina agregar raza */

  /**modificar raza */

  const limpiarCampos = () => {
    setId_raza("");
    setNombre("");
    setEditar(false);
  };
  const editarRazas = (val) => {
    setEditar(true);

    setId_raza(parseInt(val[0], 10));
    setNombre(val[1]);
  };
  const updateRaza = () => {
    Axios.put("http://localhost:3001/updateRaza", {
      id_raza: id_raza,
      nombre: nombre,
    })
      .then(() => {
        getRaza();
        alert("tipo de raza actualizado");
        limpiarCampos();

        Swal.fire({
          title: "<strong>Actualizacion exitosa!!!</strong>",
          html:
            "<i>El tipo de raza  <strong>" +
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

  /**termina modificar raza */

  /**eliminar raza */
  const deleteRaza = async (val) => {
    Swal.fire({
      title: "Confirmar eliminado?",
      html:
        "<i>¿Realmente desea eliminar a <strong>" + nombre + "</strong> ?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`http://localhost:3001/deleteRaza/${val.id_raza}`);

          getRaza();
          limpiarCampos();
          Swal.fire({
            position: "top-end",
            icon: "success",
            showConfirmButton: false,
            title: val.nombre + " ha sido eliminado.",
            timer: 2000,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logró eliminar la raza.",
            footer:
              error.message === "Network Error"
                ? "Intente más tarde"
                : error.message,
          });
        } /** */
      }
    });
  };
  /**termina eliminar raza */

  const getRaza = () => {
    Axios.get("http://localhost:3001/obtenerRazas")
      .then((response) => {
         console.log("Data from server:", response.data);
        setRaza(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  getRaza();

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Razas</div>
        <div className="card-body">
          {/**parte de registrar */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              id :
            </span>
            <input
              type="number"
              value={id_raza}
              readOnly
              onChange={(event) => {
                setId_raza(event.target.value);
              }}
              className="form-control"
              placeholder="id del tipo de operacion"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              tipo de raza :{" "}
            </span>
            <input
              type="text"
              value={nombre}
              onChange={(event) => {
                setNombre(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese un tipo raza"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="card-footer text-muted">
          {" "}
          {/**botones de add,update */}
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={updateRaza}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                cancelar
              </button>
            </div>
          ) : (
            /**DE LO CONTRARIO */

            <button className="btn btn-success btn-sep" onClick={addRaza}>
              Registrar
            </button>
          )}
        </div>
        {/**termina diseño boton  */}
      </div>
      <div>
        <nav class="navbar navbar-light bg-light">
          <form class="form-inline">
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={filtrarNombre}
              onChange={(e) => setFiltrarNombre(e.target.value)}
            ></input>
          </form>
        </nav>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {razaList
            .filter((raza) =>
              raza.nombre.toLowerCase().includes(filtrarNombre.toLowerCase())
            )
            .map((raza, key) => (
              <tr key={raza.id_raza}>
                <td>{raza.id_raza}</td>
                <td>{raza.nombre}</td>
                <td>
                  {/**botones  */}
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic mixed styles example"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        editarRazas(raza);
                      }}
                      className="btn btn-info"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteRaza({
                          id_raza: raza.id_raza,
                          nombre: raza.nombre,
                        });
                      }}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export default Raza;
