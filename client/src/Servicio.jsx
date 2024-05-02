import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { useState } from "react";
import Axios from "axios";
import "./Cliente.css";
import { Link } from "react-router-dom";

function Servicio() {
  //constantes
  const [id_servicio, setId_servicio] = useState(0);
  const [tipo_servicio, setTipo_servicio] = useState("");
  const [costo, setCosto] = useState(0);

  const [editar,setEditar] = useState(false);
 
  const [tipoServicioList, setTipoServicioList] = useState([]);

  const [opcionesTipoOperacion, setOpcionesTipoOperacion] = useState([]);
  

  //para filtar por nombre
  const [filtrarNombre , setFiltrarNombre] = useState("");

  /**editar tipo de operaciones */
  const limpiarCampos = () => {
    setId_servicio("");
    setTipo_servicio("");
    setCosto("");
    /**regresar al boton de registrar */
    setEditar(false);
  };
  const editarServicio = (val) => {
    setEditar(true);

    setId_servicio(parseInt(val[0],10));
    setTipo_servicio(val[1]);
    setCosto(val[2]);
  };
  const updateServicios = () => {
    

    Axios.put("http://localhost:3001/updateServicios", {
     id_servicio:id_servicio,
     tipo_servicio:tipo_servicio,
     costo:costo
    })
      .then(() => {
        getServicios();
        alert("tipo de operacion  actualizado");
        limpiarCampos();

        Swal.fire({
          title: "<strong>Actualizacion exitosa!!!</strong>",
          html:
            "<i>El tipo de servicio  <strong>" +
            tipo_servicio +
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
  const addServicio = (val) => {
    
    Axios.post("http://localhost:3001/create-servicio", {
      tipo_servicio:tipo_servicio,
      costo:costo
    })
      .then(() => {
        getServicios();
        alert("servicio registrado");
        limpiarCampos();
        Swal.fire({
          title: "<strong>registro exitoso!</strong>",
          html:
            "<i>El tipo de servicio  <strong>" +
            tipo_servicio +
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

  /**termina metodo post */

  /**metodo de delete  */
  const deleteTipoSer = async (val) => {
   
    Swal.fire({
      title: "Confirmar eliminado?",
      html:
        "<i>¿Realmente desea eliminar a <strong>" +
        tipo_servicio +
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
            `http://localhost:3001/deleteTipoServicio/${val.id_servicio}`
          );

          getServicios();
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
            text: "No se logró eliminar el tipo de servicio.",
            footer:
              error.message === "Network Error"
                ? "Intente más tarde"
                : error.message,
          });
        } /** */
      }
    });
  };


  /**termina metodo de delete */


  const getServicios = () => {
    Axios.get("http://localhost:3001/obtenerServicios")
      .then((response) => {
        // console.log("Data from server:", response.data);
        setTipoServicioList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  
  

  getServicios();

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">Tipo de servicios</div>
        <div className="card-body">
          {" "}
          {/**parte de registrar */}
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              id :{" "}
            </span>
            <input
              type="number"
              value={id_servicio} readOnly
              onChange={(event) => {
                setId_servicio(event.target.value);
              }}
              className="form-control"
              placeholder="id del tipo de servicio"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              tipo de servicio :{" "}
            </span>
            <input
              type="text"
              value={tipo_servicio}
              onChange={(event) => {
                setTipo_servicio(event.target.value);
              }}
              className="form-control"
              placeholder="Ingrese un tipo de servicio"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              costo : {" "}
            </span>
            <input
              type="number"
              value={costo}
              onChange={(event) => {
                setCosto(event.target.value); // Cambiar idEmpleado(event.target.value) a setIdEmpleado(event.target.value)
              }}
              className="form-control"
              placeholder="costo"
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
              <button className="btn btn-warning m-2" onClick={updateServicios}>
                Actualizar
              </button>
              <button className="btn btn-info m-2" onClick={limpiarCampos}>
                cancelar
              </button>
            </div>
          ) : (
            /**DE LO CONTRARIO */

            <button className="btn btn-success btn-sep" onClick={addServicio}>
              Registrar
            </button>
           
          )}
          
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
            <th scope="col">tipo</th>
            <th scope="col">costo</th>
            <th scope="col">acciones</th>
          </tr>
        </thead>
        <tbody>
        
          {tipoServicioList.filter((tipoS) =>
            tipoS[1] && tipoS[1].toLowerCase().includes(filtrarNombre.toLocaleLowerCase())

          )
          .map((val, key) => (
            <tr key={val[0]}>
              <td>{val[0]}</td>
              <td>{val[1]}</td>
              <td>{val[2] || "N/A"}</td>
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
                          editarServicio(val);
                        }}
                        className="btn btn-info"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          deleteTipoSer({
                            id_servicio: val[0],
                            tipoServicio: val[1],
                            costoServicio: val[2]
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
export default Servicio;
