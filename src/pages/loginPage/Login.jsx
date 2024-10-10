import './Login.css';
import {Link, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import api from "../../services/api.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import Button from "../../components/button/Button.jsx";

function Login() {
    const [error, toggleError] = useState(false);
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");
    const { login, loggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn) {
            navigate("/profile");
        }
    }, [loggedIn, navigate]);


    function handleChangeUsername(value) {
        toggleError(false);
        setUsername(value);
    }

    async function logIn(e) {
        e.preventDefault();
        toggleError(false);

        try {
            const result = await api.post(`/login`, {
                username: username,
                password: password,
            });

            console.log(result.data);
            localStorage.setItem("token", result.data.access_token);
            let token = result.data.access_token;
            login(token);
        } catch(e) {
            console.log(e.response);
            toggleError(true);
        }
    }

    return (
        <>
            <section className="login-content">
                    <div className="inner-content-container">
                        <h1>Login</h1>
                        {!(loggedIn) &&
                            <form onSubmit={logIn}>
                                <label htmlFor="username"><p>Username:</p>
                                    <input type="text" id="username" value={username}
                                           onChange={(e) => {handleChangeUsername(e.target.value)}}></input>
                                </label>
                                <label htmlFor="password"><p>Password:</p>
                                    <input type="password" id="password" value={password}
                                           onChange={(e) => setPassword(e.target.value)}></input>
                                </label>

                                {(username === "" || password === "") && <> <Button disabled = {true} size="small" text="Submit"/>
                                    <>not all required fields filled in</>
                                </>}
                                {!(username === "" || password === "") && <Button size="small" type="submit" value="Submit" text="Submit"/>}
                                {error && <div className="error-text">Something went wrong! Try again.</div>}
                        </form>
                        }
                        <p>Heb je nog geen account? <Link to="/register">Registreer</Link> je dan eerst.</p>
                    </div>
            </section>
        </>
    );
}

export default Login;

