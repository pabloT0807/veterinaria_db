import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useState } from "react";
import Axios from "axios";
import "./Cliente.css";
import { Link, useParams } from "react-router-dom";

function DetalleServicio() {
  //constantes
  const [id_detalle_servcio, setId_detalle_servicio] = useState(0);
  const [servicio_id_servicio, setServicio_id_servicio] = useState(0);
  const {id_cita} = useParams();
  const [cita_id_cita, setCita_id_cita] = useState(id_cita);
  const [detalle,setDetalle] = useState("");

  const [editar,setEditar] = useState(false);

  const [nombre,setNombre] = useState("");
 
  const [detalleServicioList, setDetalleServicioList] = useState([]);

  const [opcionesServicio, setOpcionesServicio] = useState([]);

  

  //para filtar por nombre
  const [filtrarNombre , setFiltrarNombre] = useState("");

  /**editar tipo de operaciones */
  const limpiarCampos = () => {
    setId_detalle_servicio("");
    setDetalle("");
    setServicio_id_servicio("");
    setCita_id_cita("");
  
    
    /**regresar al boton de registrar */
    setEditar(false);
  };
  const editarDetalleServicio = (val) => {
    setEditar(true);

    setId_detalle_servicio(parseInt(val[0],10));
    setDetalle(val[1]);
    setServicio_id_servicio(parseInt(val[2],10));
    setCita_id_cita(parseInt(val[3],10));

   // setNombreMascota(val[3]);
  };
  const updateDetalleServicio = () => {
    

    Axios.put("http://localhost:3001/updateDetalleServicio", {
     id_detalle_servicio:id_detalle_servicio,
     detalle : detalle,
     servicio_id_servicio: servicio_id_servicio,
     cita_id_cita: cita_id_cita
     
    
    })
      .then(() => {
        getDetalleService();
        alert("detalle  actualizado");
        limpiarCampos();

        Swal.fire({
          title: "<strong>Actualizacion exitosa!!!</strong>",
          html:
            "<i>El detalle de   <strong>" +
            cita_id_cita +
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
  const addDetalleService = (val) => {
    
    Axios.post("http://localhost:3001/create-detalleServicio", {
      detalle,detalle,
      servicio_id_servicio: servicio_id_servicio,
      cita_id_cita : cita_id_cita
      
    })
      .then(() => {
        getDetalleService();
        alert("detalle registrado");
        limpiarCampos();
        Swal.fire({
          title: "<strong>registro exitoso!</strong>",
          html:
            "<i>El detalle de   <strong>" +
            cita_id_cita +
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



  const getDetalleService = () => {
    Axios.get("http://localhost:3001/obtenerDetalles")
      .then((response) => {
        console.log("Data from server:", response.data);
        setDetalleServicioList(response.data);
        

         const opciones = [
             ...new Set(response.data.map((ser) => ser[2])),
          ];
           setOpcionesServicio(opciones);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  
  

  getDetalleService();


  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">detalles</div>
        <div className="card-body">
          {" "}
          {/**parte de registrar */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              id :{" "}
            </span>
            <input
              type="number"
              value={id_detalle_servcio} readOnly
              onChange={(event) => {
                setId_detalle_servicio(event.target.value);
              }}
              className="form-control"
              placeholder="id del tipo de operacion"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="inputGroupSelect01">
                Opciones de servicio
              </label>
              <select
                className="form-select"
                id="inputGroupSelect01"
                value={servicio_id_servicio}
                onChange={(event) =>
                  setServicio_id_servicio(event.target.value)
                }
              >
                <option value="" disabled>
                  Selecciona...
                </option>
                {opcionesServicio.map((opcion, index) => (
                  <option key={index} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>
            
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              cita :{" "}
            </span>
            <input
              type="text"
              value={cita_id_cita}
              onChange={(event) => {
                setCita_id_cita(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese cita"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Detalle del Servicio : {" "}
            </span>
            <input
              type="text"
              value={detalle} 
              onChange={(event) => {
                setDetalle(event.target.value); // Cambiar idEmpleado(event.target.value) a setIdEmpleado(event.target.value)
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
              <button className="btn btn-warning m-2" onClick={updateDetalleServicio}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                cancelar
              </button>
            </div>
          ) : (
            /**DE LO CONTRARIO */

            <button className="btn btn-success btn-sep" onClick={addDetalleService}>
              Registrar
            </button>
           
          )}
            <Link to={`/Servicio`}>
              <button className="btn btn-secondary btn-sep">Ir a servicios</button>
            </Link>

            <Link to={`/cita`}>
              <button className="btn btn-secondary btn-sep">Ir a citas</button>
            </Link>
          
        </div>
        
        {/**termina diseño boton  */}
      </div>
      <div>
        <nav class="navbar navbar-light bg-light">
          <form class="form-inline">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={filtrarNombre} 
              onChange={(e) => setFiltrarNombre(e.target.value)}
            ></input>    
            
          </form>
        </nav>
        
        </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">detalle</th>
            <th scope="col">servicio</th>
            <th scope="col">cita</th>
            <th scope="col">nombre</th>
            <th scope="col">acciones</th>
          </tr>
        </thead>
        <tbody>
         
          {detalleServicioList.filter((nom)=>
            nom[4].toLowerCase().includes(filtrarNombre.toLocaleLowerCase())
          )

          
          .map((val, key) => (
            <tr key={val[0]}>
              <td>{val[0]}</td>
              <td>{val[1]}</td>
              <td>{val[2]}</td>
              <td>{val[3] || "N/A"}</td>
              <td>{val[4] || "N/A"}</td>
              
              {/* <td>{val.nombre || "N/A"}</td> */}
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
                          editarDetalleServicio(val);
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
  );
}
export default DetalleServicio;
