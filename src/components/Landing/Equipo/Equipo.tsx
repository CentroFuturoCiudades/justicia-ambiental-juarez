import LandingBackground from "/assets/Fondo.jpg";
import Footer from "../Footer/Footer";
import './Equipo.scss'
import Home from "/assets/Icono HOME.png";


const Equipo = () => {
    return (
        <div className="landing"  >
           {<img src={LandingBackground} className="landing__background" />}
            <div className="landing__main equipo" >
                <p className="equipo__title" style={{padding: '3dvh'}}> Red de Colaboración</p>
                <button type="button" className='home' onClick={() => window.location.href = '/'}>
                    <img src={Home} alt="Home" style={{width:'100%', height: '100%', objectFit: 'contain'}}/>
                </button>

                <div className="equipo__content" style={{marginBottom: 'min(4dvh, 2.3dvw)'}}>
                    <p>
                        Este proyecto ha sido fondeado por el <span className="bold">Banco de Desarrollo del América del Norte (NADBank)</span> [Número de fondo: IVONNE] 
                    </p>
                    <p>
                        <span className="bold">El Centro México-U.S.</span> (CUSMX)- <span className="bold">Baker Institute for Public Policy de la Universidad de Rice</span> coordinó el proyecto, su ejecución y es la institución responsable de su resguardo.
                    </p>
                    <p>
                        El <span className="bold">Centro para el Futuro de las Ciudades del Tecnológico de Monterrey (CFC)</span> coordinó y ejecutó el análisi de datos, así como la creación y diseño de la plataforma.
                    </p>
                    <p>
                        El <span className="bold">Instituto Municipal de Investigación y Planeación (IMIP)</span> del municipio de Ciudad Juárez, Chihuahua y <span className="bold">NADBank</span> aportaron datos e información relevante para la construcción de la plataforma.
                    </p>
                </div>

                    <div>
                        <p className="equipo__title equipo__title--small" > Equipo </p>
                        <div className="equipo__row" >
                            <div className="equipo__col">
                                <p style={{ fontWeight: 'bold'}}>Coordinación</p>
                                <ul>
                                    <li>Ivonne Cruz – Centro México-U.S. Baker Institute for Public Policy</li>
                                    <li>Roberto Ponce – CFC</li>
                                    <li>Eugen Reséndiz – CFC</li>
                                </ul>
                            </div>
                            <div className="equipo__col">
                                <p style={{ fontWeight: 'bold'}}>Desarrollo</p>
                                <ul>
                                    <li>Uriel Salazar– CFC</li>
                                    <li>Jeannette Arjona – CFC</li>
                                    <li>Rodolfo Figueroa – CFC</li>
                                </ul>
                            </div>
                            <div className="equipo__col">
                                <p style={{ fontWeight: 'bold'}}>Dirección creativa</p>
                                <ul>
                                    <li>Sofía Vignetta – CFC</li>
                                    <li>Uriel Salazar – CFC</li>
                                    <li>Eugen Resendiz – CFC</li>
                                    <li>Ivonne Cruz – Baker Institute for Public Policy</li>
                                </ul>
                            </div>
                            <div className="equipo__col">
                                <p style={{ fontWeight: 'bold'}}>Agradecimientos</p>
                                <ul>
                                    <li>Dr. Adrián Vázquez – UACJ</li>
                                    <li>Claudia García, CODER – Consejo de Desarrollo Económico Regional Juárez, A.C.</li>
                                </ul>
                            </div>
                        </div>
                        <p style={{ marginTop: '4dvh'}}>
                            *Los errores u omisiones contenidos en esta página son responsabilidad exclusiva del CUSMX Baker Institute for Public Policy de la Universidad de Rice y del Centro para el Futuro de las Ciudades del Tecnológico de Monterrey. Para correcciones, comentarios o aclaraciones, favor de contactar a <span className="bold">Ivonne Cruz <span style={{ textDecoration: "underline" }}>(ic23@rice.edu)</span></span> y <span className="bold">Roberto Ponce <span style={{ textDecoration: "underline" }}>(rpl@tec.mx)</span></span>.*
                        </p>
                    </div>
            </div>
            <div className="landing__footer" >
                <Footer />
            </div>
        </div>
    );
}

export default Equipo;