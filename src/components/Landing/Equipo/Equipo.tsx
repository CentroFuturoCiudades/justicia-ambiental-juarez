import LandingBackground from "/assets/Fondo.jpg";
import Footer from "../Footer/Footer";

const Equipo = () => {
    return (
        <div className="landing">
            <img src={LandingBackground} className="landing__background" />
            <div className="landing__main" style={{ zIndex: 2, padding: '3dvh 4dvw', gap: '2dvh' }} >
                <p style={{ fontWeight: 'bold', fontFamily:'Space Mono, monospace', fontSize: 'min(7dvh, 5dvw)',alignSelf: 'center'}}> Red de Colaboración</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2dvh'}}>
                    <p>
                        Este proyecto ha sido fondeado por el <strong>Banco de Desarrollo del América del Norte (NADBank)</strong> [Número de fondo: IVONNE] 
                    </p>
                    <p>
                        El <strong>Baker Institute for Public Policy de la Universidad de Rice</strong>  coordinó el proyecto, su ejecución y es la institución responsable de su resguardo.
                    </p>
                    <p>
                        El <strong>Centro para el Futuro de las Ciudades del Tecnológico de Monterrey (CFC)</strong> coordinó y ejecutó el análisi de datos y la creación y diseño de la plataforma.
                    </p>
                    <p>
                        El <strong>Instituto Municipal de Investigación y Planeación (IMIP)</strong> del municipio de Ciudad Juárez, Chihuahua y <strong>NADBank</strong> aportaron datos e información relevante para la construcción de la plataforma.
                    </p>
                </div>

                <p style={{ fontWeight: 'bold', fontFamily:'Space Mono, monospace', fontSize: 'var(--font-size-title)',alignSelf: 'center'}}> Equipo </p>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2dvh', maxWidth: '20dvw' }}>
                        <p style={{ fontWeight: 'bold'}}>Coordinación</p>
                        <p>Ivonne Cruz – Baker Institute for Public Policy
                            <br />Roberto Ponce – CFC
                            <br />Eugen Resendiz – CFC</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2dvh', maxWidth: '20dvw'}}>
                        <p style={{ fontWeight: 'bold'}}>Desarrollo</p>
                        <p>Uriel Salazar– CFC
                            <br />Jeannette Arjona – CFC
                            <br />Rodolfo Figueroa – CFC</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2dvh', maxWidth: '20dvw'}}>
                        <p style={{ fontWeight: 'bold'}}>Dirección creativa</p>
                        <p>Sofía Vignetta – CFC
                            <br />Uriel Salazar – CFC
                            <br />Eugen Resendiz– CFC
                            <br />Ivonne Cruz – Baker Institute for Public Policy</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2dvh', maxWidth: '20dvw'}}>
                        <p style={{ fontWeight: 'bold'}}>Agradecimientos</p>
                        <p>Dr. Adrián Vázquez – UACJ</p>
                    </div>
                </div>

                <p style={{ marginTop: '4dvh'}}>
                    *Los errores u omisiones contenidos en esta página son responsabilidad exclusiva del Centro para el Futuro de las Ciudades del Tecnológico de Monterrey. Para correcciones, comentarios o aclaraciones, favor de contactar a <strong>Ivonne Cruz <span style={{ textDecoration: "underline" }}>(ic23@rice.edu)</span></strong> y <strong>Roberto Ponce <span style={{ textDecoration: "underline" }}>(rpl@tec.mx)</span></strong>.*
                </p>
            </div>
            <div className="landing__footer" >
                <Footer />
            </div>
        </div>
    );
}

export default Equipo;