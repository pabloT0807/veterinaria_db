import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useState, useRef } from "react";
import Axios from "axios";
import "./Cliente.css";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

function Diagnostico() {
  //constantes
  /**pdf */
  const componentPDF = useRef();
  const [id_diagnostico, setId_diagnostico] = useState(0);
  const [cita_id_cita, setCita_id_cita] = useState(0);
  const [diagnostico, setDiagnostico] = useState("");
  const { nombre } = useParams();
  const [nombreMascota, setNombreMascota] = useState(nombre);

  const [editar, setEditar] = useState(false);

  const [diagnosticoList, setDiagnosticoList] = useState([]);

  const [opcionesCita, setOpciionesLista] = useState([]);

  //para filtar por nombre
  const [filtrarNombre, setFiltrarNombre] = useState("");

  /**editar tipo de operaciones */
  const limpiarCampos = () => {
    setId_diagnostico("");
    setCita_id_cita("");
    setDiagnostico("");
    setNombreMascota("");
    /**regresar al boton de registrar */
    setEditar(false);
  };
  const editarDiagnostico = (val) => {
    setEditar(true);

    setId_diagnostico(parseInt(val.id_diagnostico, 10));
    setCita_id_cita(parseInt(val.cita_id_cita, 10));
    setDiagnostico(val.diagnostico);
    // setNombreMascota(val[3]);
  };
  const updateDiagnostico = () => {
    Axios.put("http://localhost:3001/updateDiagnostico", {
      id_diagnostico: id_diagnostico,
      cita_id_cita: cita_id_cita,
      diagnostico: diagnostico,
    })
      .then(() => {
        getDiagnostico();
        alert("diagnostico  actualizado");
        limpiarCampos();

        Swal.fire({
          title: "<strong>Actualizacion exitosa!!!</strong>",
          html:
            "<i>El diagnostico de   <strong>" +
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

  /**termina editar operaciones tipo */

  /**agregar un nuevo tipo de operacion */
  const addDianostico = (val) => {
    Axios.post("http://localhost:3001/create-diagnostico", {
      cita_id_cita: cita_id_cita,
      diagnostico: diagnostico,
    })
      .then(() => {
        getDiagnostico();
        alert("Diagnostico registrado");
        limpiarCampos();
        Swal.fire({
          title: "<strong>registro exitoso!</strong>",
          html:
            "<i>El diagnostico de   <strong>" +
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

  /**pdf metodo */
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => alert("informacion guardada en pdf"),
  });

  const getDiagnostico = () => {
    Axios.get("http://localhost:3001/obtenerDiagnosticos")
      .then((response) => {
        //console.log("Data from server:", response.data);
        setDiagnosticoList(response.data);

        const opciones = [
          ...new Set(response.data.map((diagnos) => diagnos.cita_id_cita)),
        ];
        setOpciionesLista(opciones);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  getDiagnostico();

  const filteredDiagnosticoList = diagnosticoList.filter((val) =>
    val.nombre.toLowerCase().includes(filtrarNombre.toLowerCase())
  );

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Diagnostico</div>
        <div className="card-body">
          {" "}
          {/**parte de registrar */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              id :{" "}
            </span>
            <input
              type="number"
              value={id_diagnostico}
              readOnly
              onChange={(event) => {
                setDiagnostico(event.target.value);
              }}
              className="form-control"
              placeholder="id del tipo de operacion"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              opciones de citas :{" "}
            </span>
            <input
              type="number"
              value={cita_id_cita}
              onChange={(event) => {
                setCita_id_cita(event.target.value);
              }}
              className="form-control"
              placeholder="id de la cita"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              diagnostico canino :{" "}
            </span>
            <input
              type="text"
              value={diagnostico}
              onChange={(event) => {
                setDiagnostico(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese un diagnostico"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Nombre :{" "}
            </span>
            <input
              type="text"
              value={nombreMascota}
              readOnly
              onChange={(event) => {
                setNombreMascota(event.target.value); // Cambiar idEmpleado(event.target.value) a setIdEmpleado(event.target.value)
              }}
              className="form-control"
              placeholder="nombre"
              aria-label="costo"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="card-footer text-muted">
          {" "}
          {/**botones de add,update */}
          {editar ? (
            <div>
              <button
                className="btn btn-warning m-2"
                onClick={updateDiagnostico}
              >
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                cancelar
              </button>
            </div>
          ) : (
            /**DE LO CONTRARIO */

            <button className="btn btn-success btn-sep" onClick={addDianostico}>
              Registrar
            </button>
          )}
          <Link to={`/Cita`}>
            <button className="btn btn-secondary">Ir a citas</button>
          </Link>
          <button className="btn btn-danger btn-sep" onClick={generatePDF}>
            PDF
          </button>
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
      <div ref={componentPDF} style={{ width: "100%" }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">cita</th>
              <th scope="col">diagnostico canino</th>
              <th scope="col">nombre</th>
              <th scope="col">acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredDiagnosticoList) &&
              filteredDiagnosticoList.map((val, key) => (
                <tr key={val.id_diagnostico}>
                  <td>{val.id_diagnostico}</td>
                  <td>{val.cita_id_cita}</td>
                  <td>{val.diagnostico || "N/A"}</td>
                  <td>{val.nombre || "N/A"}</td>
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
                          editarDiagnostico(val);
                        }}
                        className="btn btn-info"
                      >
                        Editar
                      </button>

                      {/* <button
                        type="button"
                        onClick={() => {
                          de({
                            id_tipo_operacion: val[0],
                            tipo: val[1],
                            costo: val[2]
                          });
                        }}
                        className="btn btn-danger"
                        >
                        Eliminar
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Diagnostico;
