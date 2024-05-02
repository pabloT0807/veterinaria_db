import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Cliente from "./Cliente";
import Mascota from "./Mascota";
import Cita from "./Cita";
import Direcciones from "./Direcciones";
import Raza from "./Raza";
import Operacion from "./Operacion";
import TipoOperacion from "./TipoOperacion";
import Diagnostico from "./Diagnostico";
import Servicio from "./Servicio";
import DetalleServicio from "./DetalleServicio";
import Medico from "./Medico";
import Clinica from "./Clinica";
import MascotaServicio from "./MascotaServicio";
import miImagen1 from "./imagenes/about.jpg";

function Inicio() {
  return (
    <div>
      <head>

        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ejemplo</title>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          integrity="sha512-...tu-integridad-aqui..."
          crossorigin="anonymous"
        />
          <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway|Candal"/>
          
        {/* <link rel="stylesheet" href="css/style.css" /> */}
      </head>
      <body>
        <header class="header">
          <a href="#" class="logo">
            <i class="fas fa-paw"></i>
          </a>

          <nav class="navbar">
            <a href="#home">Recursos</a>
            <a href="#about">telefonos</a>
            <a href="#shop">primeros auxilios</a>
            <a href="#services">aseo</a>
            <a href="#plan">recomendaciones</a>
            <a href="#contact">medicamentos</a>
          </nav>

          {/* <div class="icons">
            <div class="fas fa-bars" id="menu-btn"></div>
            <a href="#" class="fas fa-shopping-cart"></a>
            <div class="fas fa-user" id="login-btn"></div>
          </div> */}
        </header>

        <section class="home" id="home">
          <div class="container">
            <div class="content">
              <h3>
                <span>hola</span> bienvenido a pet friends
              </h3>
              <a href="#" className="btn">
                abajo
              </a>
            </div>
            <img src="" alt="" />
          </div>
        </section>
        {/* <!--home ends-->

    <!--about section--> */}

        <section class="about" id="about">
          <div class="image">
            <img src={miImagen1} alt="" />
          </div>
          <div class="content">
            <h3>
              servicios <span>ofrecidos a los clientes</span>
            </h3>
            <p>
              En Pet Friends, nos enorgullece ofrecer una variedad de servicios diseñados para mantener a tus compañeros peludos felices y saludables. Desde consultas especializadas hasta servicios de limpieza y cuidado, nos dedicamos a brindar la mejor atención posible a tus queridos animales.
            </p>
            <a href="" className="btn">
              saber más
            </a>
          </div>
        </section>
        {/* <!--termina about -->
    <!--services--> */}
        <section class="services">
          <h1 class="heading">
            {" "}
            nuestro <span>menu</span>
          </h1>
          <div class="box-container">
            <div class="box">
              <i class="fas fa-dog"></i>
              <h3>dog boarding</h3>
              <Link to="/Cliente">
                <a href="#" className="btn">
                  Ir a Cliente
                </a>
              </Link>
            </div>

            <div class="box">
              <i class="fas fa-cat"></i>
              <h3>cat boarding</h3>
              <a href="/Mascota" class="btn">
                ir a mascota
              </a>
            </div>

            <div class="box">
              <i class="fas fa-bath"></i>
              <h3>spa & groaming</h3>
              <a href="/Operacion" class="btn">
                ir a operacion
              </a>
            </div>

            <div class="box">
              <i class="fas fa-drumstick-bite"></i>
              <h3>healthy meal</h3>
              <a href="/Cita" class="btn">
                cita
              </a>
            </div>

            <div class="box">
              <i class="fas fa-baseball-ball"></i>
              <h3>activity excersie</h3>
              <a href="/TipoOperacion" class="btn">
                ir a tipo de operación
              </a>
            </div>

            <div class="box">
              <i class="fas fa-heartbeat"></i>
              <h3>healthy meal</h3>
              <a href="/Raza" class="btn">
                Razas registradas
              </a>
            </div>
        
            <div class="box">
              <i class="fa fa-user-md"></i>
              <h3>healthy meal</h3>
              <a href="/Diagnostico" class="btn">
                Diagnostico
              </a>
            </div>

            <div class="box">
              <i class="fa-solid fa-dog"></i>
              <h3>pet friend</h3>
              <a href="/Servicio" class="btn">
                Servicio
              </a>
            </div>
            
            <div class="box">
              <i class="fa-solid fa-bone"></i>
              <h3>time for running</h3>
              <a href="/DetalleServicio" class="btn">
                detalle del servicio
              </a>
            </div>
            
           
            <div class="box">
              <i class="fa-solid fa-dog"></i>
              <h3>Food according</h3>
              <a href="/Direcciones" class="btn">
                direcciones disponibles
              </a>
            </div>
        
            <div class="box">
              <i class="fa fa-user-md"></i>
              <h3>Checking alerts</h3>
              <a href="/Medico" class="btn">
                Médicos
              </a>
            </div>
           
            <div class="box">
              <i class="fas fa-baseball-ball"></i>
              <h3>Healthy teeth</h3>
              <a href="/Clinica" class="btn">
                Clinicas
              </a>
            </div>


            <div class="box">
              <i class="fa-solid fa-bone"></i>
              <h3>play everytime</h3>
              <a href="/MascotaServicio" class="btn">
                consultas rapidas
              </a>
            </div>

          </div>
        </section>

        <script src="js/script.js"></script>
      </body>
    </div>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/Cliente" element={<Cliente />} />
        <Route path="/Mascota/:id_cliente" element={<Mascota />} />
        <Route path="/Mascota/" element={<Mascota />} />
        <Route path="/Direcciones" element={<Direcciones />} />
        <Route path="/Raza" element={<Raza />} />
        <Route path="/Cita/:id_mascota" element={<Cita />}></Route>
        <Route path="/Operacion/:id_mascota" element={<Operacion />}></Route>
        <Route path="/Operacion" element={<Operacion />}></Route>
        <Route path="/TipoOperacion" element={<TipoOperacion />}></Route>
        <Route path="/Cita" element={<Cita />}></Route>
        <Route path="/Diagnostico" element={<Diagnostico />}></Route>
        <Route path="/Servicio" element={<Servicio />}></Route>
        <Route path="/DetalleServicio" element={<DetalleServicio />}></Route>
        <Route
          path="/DetalleServicio/:id_cita"
          element={<DetalleServicio />}
        ></Route>
        <Route path="/Medico" element={<Medico />}></Route>
        <Route path="/Clinica" element={<Clinica />}></Route>
        <Route path="/MascotaServicio" element={<MascotaServicio />}></Route>

        {/* <Route path='/Operacion/:id_tipo_operacion' element={<Operacion />}></Route> */}
      </Routes>
    </Router>
  );
}

export default App;
