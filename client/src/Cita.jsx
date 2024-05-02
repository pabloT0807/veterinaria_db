import { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import Axios from "axios";
import { useParams } from "react-router-dom";
import Mascota from "./Mascota";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Cita() {
  /**pdf */
  const componentPDF = useRef();

  const [id_cita, setId_cita] = useState(0);

  const [fecha, setFecha] = useState(new Date());

  const { id_mascota } = useParams();

  const [mascota_id_mascota, setMascota_id_mascota] = useState(id_mascota);

  const [clinica_id_clinica, setClinica_id_clinica] = useState(0);

  const [citasList, setCitasList] = useState([]);

  const [filtrarPorId, setFiltrarPorId] = useState(0);

  const [filtrarPorMascota, setFiltrarPorMascota] = useState("");

  const [opcionesDeClinica, setOpcionesDeClinica] = useState([]);

  const [editar, setEditar] = useState(false);

  /*metodo para agregar cita*/
  const addCita = () => {
    const monthAbbreviation = fecha
      .toLocaleString("default", { month: "short" })
      .toUpperCase();

    // Formatea la fecha en 'DD-MON-YY'
    const formattedFecha = `${fecha
      .getDate()
      .toString()
      .padStart(2, "0")}-${monthAbbreviation}-${fecha
      .getFullYear()
      .toString()
      .slice(-2)}`;

    Axios.post("http://localhost:3001/create-cita", {
      fecha: formattedFecha,
      mascota_id_mascota: mascota_id_mascota,
      clinica_id_clinica: clinica_id_clinica,
    })
      .then(() => {
        getCitas();
        alert("cita agregada");

        Swal.fire({
          title: "<strong>registro exitoso</strong>",
          html: `<i>La cita de <strong>${mascota_id_mascota}</strong> ha sido registrada</i>`,
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
  }; /**termina metdo agregar cita */
  /**editar cita */
  const limpiarCampos = () => {
    setFecha("");
    setMascota_id_mascota("");
    setClinica_id_clinica("");
    /**regresar al boton de registrar */
    setEditar(false);
  };
  const editarCitar = (val) => {
    setEditar(true);
    setId_cita(parseInt(val[0], 10));
    setFecha(new Date(val[1]));
    setMascota_id_mascota(parseInt(val[2], 10));
    setClinica_id_clinica(parseInt(val[3], 10));
  };
  const updateCita = () => {
    //const idClienteNumerico = parseInt(id_cliente, 10);
    // console.log("Datos a enviar para la actualización:", {
    //   id_cita,
    //   fecha,

    // });
    const monthAbbreviation = fecha
      .toLocaleString("default", { month: "short" })
      .toUpperCase();

    // Formatea la fecha en 'DD-MON-YY'
    const formattedFecha = `${fecha
      .getDate()
      .toString()
      .padStart(2, "0")}-${monthAbbreviation}-${fecha
      .getFullYear()
      .toString()
      .slice(-2)}`;
    Axios.put("http://localhost:3001/updateCitas", {
      id_cita: id_cita,
      fecha: formattedFecha,
      mascota_id_mascota: mascota_id_mascota,
      clinica_id_clinica: clinica_id_clinica,
    })
      .then((response) => {
        console.log(response.data);
        getCitas();
        alert("cita actualizada");
        limpiarCampos();
      })
      .catch(function (error) {
        console.error("Error al enviar la solicitud de actualización:", error);
      });
  };
  /**pdf metodo */
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => alert("informacion guardada en pdf"),
  });

  /**termina editar cita */

  /**metodo para ver obtener citas */
  const getCitas = () => {
    Axios.get("http://localhost:3001/obtenerCitas")
      .then((response) => {
        // console.log("Data from server:", response.data);
        setCitasList(response.data);
        /**extraer las direcciones */
        /**para sacar las opciones de IDS */
        const opciones = [
          ...new Set(response.data.map((clinica) => clinica[3])),
        ];
        setOpcionesDeClinica(opciones);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  getCitas();

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">CITA DE MASCOTAS</div>
        <div className="card-body">
          {" "}
          {/**parte de registrar */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              id_cita:{" "}
            </span>
            <input
              type="number"
              readOnly
              value={id_cita}
              onChange={(event) => {
                setId_cita(event.target.value);
              }}
              className="form-control"
              placeholder="id_cita"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              fecha:{" "}
            </span>
            <DatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              className="form-control"
              dateFormat="dd/MMM/yy"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              mascota_id:{" "}
            </span>
            <input
              type="number"
              readOnly
              value={mascota_id_mascota}
              onChange={(event) => {
                setMascota_id_mascota(event.target.value);
              }}
              className="form-control"
              placeholder="mascota_id"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              clinica_id:{" "}
            </span>
            <input
              type="number"
              value={clinica_id_clinica}
              onChange={(event) => {
                setClinica_id_clinica(event.target.value);
              }}
              className="form-control"
              placeholder="clinica_id"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="card-footer text-muted">
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={updateCita}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                cancelar
              </button>
            </div>
          ) : (
            /**DE LO CONTRARIO */

            <button className="btn btn-success btn-sep" onClick={addCita}>
              Registrar
            </button>
          )}
          <Link to={`/Clinica`}>
            <button className="btn btn-outline-primary btn-sep">
              ver clinicas
            </button>
          </Link>

          <button className="btn btn-danger btn-sep" onClick={generatePDF}>
            PDF
          </button>
        </div>
        <div>
          <nav class="navbar navbar-light bg-light">
            <form class="form-inline">
              <input
                class="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={filtrarPorMascota}
                onChange={(e) => setFiltrarPorMascota(e.target.value)}
              ></input>
            </form>
          </nav>
        </div>
        {/**termina diseño boton  */}
      </div>
      <div ref={componentPDF} style={{ width: "100%" }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">fecha</th>
              <th scope="col">mascota_id</th>
              <th scope="col">clinica_id</th>
              <th scope="col">Nombre de la mascota</th>
              <th scope="col">acciones</th>
            </tr>
          </thead>
          <tbody>
            {citasList.filter((mascota) =>
              mascota[4]
                .toLowerCase()
                .includes(filtrarPorMascota.toLocaleLowerCase())
            ).length === 0 ? (
              <tr>
                <td colSpan="5">No hay citas con ese nombre</td>
              </tr>
            ) : (
              citasList
                .filter((mascota) =>
                  mascota[4]
                    .toLowerCase()
                    .includes(filtrarPorMascota.toLocaleLowerCase())
                )
                .map((val, key) => (
                  <tr key={val[0]}>
                    {" "}
                    {/**id */}
                    <td>{val[0]}</td> {/*id_cita*/}
                    <td>{val[1]}</td> {/**fecha*/}
                    <td>{val[2] || "N/A"}</td> {/**mascota_id */}
                    <td>{val[3] || "N/A"}</td> {/**clinica_id */}
                    <td>{val[4] || "N/A"}</td> {/**nombre de la mascota  */}
                    <td>
                      {" "}
                      {/**botones  */}
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic mixed styles example"
                      >
                        <button
                          type="btn-group"
                          role="group"
                          onClick={() => {
                            editarCitar(val);
                          }}
                          className="btn btn-success"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          // onClick={() => {
                          //   verDetalles(val);
                          // }}
                          className="btn btn-info"
                        >
                          imprimir cita
                        </button>
                        <Link to={`/DetalleServicio/${val[0]}`}>
                          <button className="btn btn-outline-primary btn-sep">
                            dar detalles
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>{" "}
        {/**termina tabla */}
      </div>
    </div>
  );
}

export default Cita;
