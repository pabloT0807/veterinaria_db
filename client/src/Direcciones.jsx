import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useState } from "react";
import Axios from "axios";
import "./Cliente.css";
import { Link } from "react-router-dom";

function Direccion() {
  //constantes
  const [id_direccion, setId_direccion] = useState(0);
  const [numero_interior, setNumeroInterior] = useState(0);
  const [numero_exterior, setNumero_exterior] = useState(0);
  const [alcaldia, setAlcaldia] = useState("");
  const [colonia, setColonia] = useState("");
  const [cp, setCp] = useState("");
  const [calle, setCalle] = useState("");

  const [direccionList, setDireccion] = useState([]);

  const [opcionesDireccion, setOpcionesDireccion] = useState([]);

  const [editar, setEditar] = useState(false);

  //para filtar por nombre
  const [filtrarNombre, setFiltrarNombre] = useState("");

  /**insertar direcciones */

  const addDireccion = (val) => {
    Axios.post("http://localhost:3001/create-direccion", {
      calle: calle,
      numero_interior: numero_interior,
      numero_exterior: numero_exterior,
      alcaldia: alcaldia,
      colonia: colonia,
      cp: cp,
    })
      .then(() => {
        getDireccion();
        alert("direccion registrada");
        //limpiarCampos();
        Swal.fire({
          title: "<strong>registro exitoso!</strong>",
          html:
            "<i>La direccion :   <strong>" +
            calle +
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

  /**termina insertar direcciones */

  /**actualizar direcciones */
  const limpiarCampos = () => {
    setId_direccion("");
    setCalle("");
    setNumeroInterior("");
    setNumero_exterior("");
    setAlcaldia("");
    setColonia("");
    setCp("");
    setEditar(false);
  };
  const editarDirecciones = (val) => {
    setEditar(true);

    setId_direccion(parseInt(val[0], 10));
    setCalle(val[1]);
    setNumeroInterior(parseInt(val[2], 10));
    setNumero_exterior(parseInt(val[3], 10));
    setAlcaldia(val[4]);
    setColonia(val[5]);
    setCp(val[6]);
  };
  const updateDireccion = () => {
    Axios.put("http://localhost:3001/updateDireccion", {
      id_direccion: id_direccion,
      calle: calle,
      numero_interior: numero_interior,
      numero_exterior: numero_exterior,
      alcaldia: alcaldia,
      colonia: colonia,
      cp: cp,
    })
      .then(() => {
        getDireccion();
        alert("tipo de direccion actualizado");
        limpiarCampos();
        Swal.fire({
          title: "<strong>Actualizacion exitosa!!!</strong>",
          html:
            "<i>La direccion con el ID :   <strong>" +
            id_direccion +
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

  const getDireccion = () => {
    Axios.get("http://localhost:3001/obtenerDirecciones")
      .then((response) => {
        setDireccion(response.data);

        const opciones = [
          ...new Set(response.data.map((direccion) => direccion.alcaldia)),
        ];
        setOpcionesDireccion(opciones);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  getDireccion();

  console.log("direccionList:", direccionList);

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">DIRECCIONES</div>
        <div className="card-body">
          {/**parte de registrar */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              id_direccion :
            </span>
            <input
              type="number"
              value={id_direccion}
              readOnly
              onChange={(event) => {
                setId_direccion(event.target.value);
              }}
              className="form-control"
              placeholder="id del tipo de operacion"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              calle :{" "}
            </span>
            <input
              type="text"
              value={calle}
              onChange={(event) => {
                setCalle(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese la calle"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              numero interior :{" "}
            </span>
            <input
              type="number"
              value={numero_interior}
              onChange={(event) => {
                setNumeroInterior(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese numero interior"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              numero exterior :{" "}
            </span>
            <input
              type="number"
              value={numero_exterior}
              onChange={(event) => {
                setNumero_exterior(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese numero exterior"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              alcaldia :{" "}
            </span>
            <input
              type="text"
              value={alcaldia}
              onChange={(event) => {
                setAlcaldia(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese alcaldia"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              colonia :{" "}
            </span>
            <input
              type="text"
              value={colonia}
              onChange={(event) => {
                setColonia(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese colonia"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              cp :{" "}
            </span>
            <input
              type="number"
              value={cp}
              onChange={(event) => {
                setCp(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese codigo postal"
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
              <button className="btn btn-warning m-2" onClick={updateDireccion}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                cancelar
              </button>
            </div>
          ) : (
            /**DE LO CONTRARIO */

            <button className="btn btn-success btn-sep" onClick={addDireccion}>
              Registrar
            </button>
          )}
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
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Calle</th>
            <th scope="col">Numero interior</th>
            <th scope="col">Numero exterior</th>
            <th scope="col">Alcaldia</th>
            <th scope="col">Colonia</th>
            <th scope="col">CP</th>
          </tr>
        </thead>
        <tbody>
         {/* Mapeo de las direcciones para mostrar en la tabla */}
         {direccionList.map((direccion) => (
            <tr key={direccion.id_direccion}>
              <td>{direccion.id_direccion}</td>
              <td>{direccion.calle}</td>
              <td>{direccion.numero_interior || "N/A"}</td>
              <td>{direccion.numero_exterior || "N/A"}</td>
              <td>{direccion.alcaldia || "N/A"}</td>
              <td>{direccion.colonia || "N/A"}</td>
              <td>{direccion.cp || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );


}
export default Direccion;
