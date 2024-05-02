import { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
function MascotaServicio() {
  const [nombre, setNombre] = useState("");
  const [dia,setDia] = useState(0);
  const [resultados, setResultados] = useState([]);
  const [resultados2,setResultados2] = useState([]);
  const [resultados3,setResultados3] = useState([])
  const [resultados4,setResultados4] = useState([])

  const buscarPorNombre = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/buscarPorNombre?nombre=${nombre}`
      );
      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Error al buscar por nombre:", error);
    }
  };
  const buscarPorDia = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/buscarPorDia?dia=${dia}`
      );
      const data = await response.json();
      setResultados2(data);
    } catch (error) {
      console.error("Error al buscar por dia:", error);
    }
  };
  const cantidadCitasPorClin = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/cantidadCitasPorClinica`
      );
      const data = await response.json();
      setResultados3(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const masContratado = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/servicioMasContratado`
      );
      const data = await response.json();
      setResultados4(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    
    <div>
        <Link to={`/`}>
              <button className="btn btn-secondary">Ir a Inicio</button>
        </Link>
      <form>
        <h2>Servicios proporcionados a una mascota</h2>   
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Nombre :{" "}
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la mascota"
          />
          <div id="emailHelp" class="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        <button type="button" class="btn btn-primary" onClick={buscarPorNombre}>
          Submit
        </button>
      </form>

      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">servicio</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((val, key) => (
              <tr key={val[0]}>
                <td>{val[0]}</td>
                <td>{val[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*ganacias monetarias */}
      <form>
        <h2>Consultar ganancias monetarias</h2>   
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            dia :{" "}
          </label>
          <input
            type="number"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            placeholder="dia"
          />
          
        </div>

        <button type="button" class="btn btn-primary" onClick={buscarPorDia}>
          Submit
        </button>
      </form>

      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">servicio</th>
              <th scope="col">monto</th>
            </tr>
          </thead>
          <tbody>
            {resultados2.map((val, key) => (
              <tr key={val[0]}>
                <td>{val[0]}</td>
                <td>{val[1]}</td>

                <td>
                  {/**botones  */}
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic mixed styles example"
                  >
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/**cantidad de citas por clinica */}
        <h2> Citas por clinica</h2>   
      <div>
      <button type="button" class="btn btn-primary" onClick={cantidadCitasPorClin}>
          Consultar
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">clinica</th>
              <th scope="col">cantidad de citas</th>
            </tr>
          </thead>
          <tbody>
            {resultados3.map((val, key) => (
              <tr key={val[0]}>
                <td>{val[0]}</td>
                <td>{val[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/**servicio mas contratado */}
      <h2> servicios mas contratados</h2>   
      <div>
      <button type="button" class="btn btn-primary" onClick={masContratado}>
          Consultar
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">servicio</th>
              <th scope="col">cantidad de veces solicitado</th>
            </tr>
          </thead>
          <tbody>
            {resultados4.map((val, key) => (
              <tr key={val[0]}>
                <td>{val[0]}</td>
                <td>{val[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}

export default MascotaServicio;
