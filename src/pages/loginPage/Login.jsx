import './Login.css';
import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Input from '../../components/input/Input.jsx';
import axios from "axios";
import {AuthContext} from "../../context/AuthContext.jsx";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, toggleError] = useState(false);
    const { login } = useContext(AuthContext);

    const source = axios.CancelToken.source();

    // // mocht onze pagina ge-unmount worden voor we klaar zijn met data ophalen, aborten we het request
    // useEffect(() => {
    //     return function cleanup() {
    //         source.cancel();
    //     }
    // }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        toggleError(false);

        try {
            const result = await axios.post('/users/login', {
                email: username,
                password: password,
            },{
                cancelToken: source.token,
            });
            // log het resultaat in de console
            console.log(result.data);

            // geef de JWT token aan de login-functie van de context mee
            login(result.data.accessToken);

        } catch(e) {
            console.error(e);
            toggleError(true);
        }
    }


    return (
        <>
            <section>
                <div className="login outer-content-container">
                    <div className="inner-content-container">
                        <h1>Login</h1>
                        <form onSubmit={handleSubmit}>
                            {error && <div className="error-message">{error}</div>}

                            <Input
                                id="username"
                                label="Voer hier je gebruikersnaam in:"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Gebruikersnaam"
                                required
                            />

                            <Input
                                id="password"
                                label="Voer hier je wachtwoord in om in te loggen:"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Voer hier je wachtwoord in"
                                required
                            />

                            <button type="submit">Inloggen</button>
                        </form>
                        <p>Heb je nog geen account? <Link to="/register">Registreer</Link> je dan eerst.</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;
