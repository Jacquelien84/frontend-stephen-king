import './Register.css';
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import React from "react";
import Button from "../../components/button/Button.jsx";
import {FaShieldCat} from "react-icons/fa6";
import {PiUserCircleCheck} from "react-icons/pi";
import {FaUserPlus} from "react-icons/fa";

function Register() {
    const [error, setError] = React.useState(null);
    const [addedSuccess, toggleAddedSuccess] = React.useState(false);
    const [role, setRole] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const navigate = useNavigate();

    async function addUser(e) {
        e.preventDefault();
        toggleAddedSuccess(false);
        setError(null);

        try {
            const response = await api.post('/register', {
                username: username,
                email: email,
                password: password,
                role: role,
            });

            const token = response.data.access_token;
            localStorage.setItem("token", token);

            toggleAddedSuccess(true);
        } catch (error) {
            setError(error);
        }
    }

    return (
        <>
            <section className="register-content">
                <div className="container-column">
                    {!addedSuccess && <div className="info-text">
                        <h1>Sign up!</h1>
                    </div>}
                    {addedSuccess &&
                        <div className="successfully-added"><PiUserCircleCheck className="user-added-icon"/>
                            <h4>Account created successfully! You can now</h4>
                            <Link
                                to="login"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/login");
                                }}
                            >
                                <h3>log in </h3>
                            </Link>
                        </div>}

                    {!addedSuccess &&
                        <form onSubmit={addUser}>
                            <div className="input-container">
                                <div className="input-block-row">
                                    <label htmlFor="username"><p>Username:</p>
                                        <input type="text" id="username" value={username}
                                               onChange={(e) => setUsername(e.target.value)}></input>
                                        {!username && <p><em>required field</em></p>}
                                        {username && <p><em></em></p>}
                                    </label>
                                    <label htmlFor="email"><p>Email:</p>
                                        <input type="text" id="email" value={email}
                                               onChange={(e) => setEmail(e.target.value)}></input>
                                        {!email && <p><em>required field</em></p>}
                                        {email && <p><em></em></p>}
                                    </label>
                                    <label htmlFor="password"><p>Password:</p>
                                        <input type="password" id="password" value={password}
                                               onChange={(e) => setPassword(e.target.value)}></input>
                                        {!password && <p><em>required field</em></p>}
                                        {password && <p><em></em></p>}
                                    </label>
                                </div>
                            </div>
                            <p>As a:</p>

                            <div className="container-row">
                                <div className="radio-container">
                                    <input type="radio" id="user" value="User" checked={role === "USER"}
                                           className="user"
                                           onChange={() => setRole("USER")}/>
                                    <label htmlFor="user">
                                        <div className="status">
                                            {(role === "USER") &&
                                                <div className="on"><p>User</p> <FaUserPlus className="radio-symbol"/>
                                                </div>}
                                            {!(role === "USER") &&
                                                <div className="off"><p>User</p> <FaUserPlus className="radio-symbol"/>
                                                </div>}
                                        </div>
                                    </label>

                                    <input type="radio" id="admin" value="Admin" checked={role === "ADMIN"}
                                           className="admin"
                                           onChange={() => setRole("ADMIN")}/>
                                    <label htmlFor="admin">
                                        <div className="status">
                                            {(role === "ADMIN") &&
                                                <div className="on"><p>Admin</p> <FaShieldCat className="radio-symbol"/>
                                                </div>}
                                            {!(role === "ADMIN") &&
                                                <div className="off"><p>Admin</p> <FaShieldCat
                                                    className="radio-symbol"/></div>}
                                        </div>
                                    </label>
                                </div>
                                {!role && <p><em>required field</em></p>}
                            </div>
                            {(role === "ADMIN") &&
                                <p>Once submitted, our existing admins will contact you to approve or reject your
                                    application asap.</p>}

                            {(username === "" || password === "" || role === "") && <> <Button disabled={true}
                                                                                               size="medium"
                                                                                               text="Submit"/>
                                Not all required fields have been filled in
                            </>}
                            {!(username === "" || password === "" || role === "") &&
                                <Button size="medium" type="submit" value="Submit" text="Submit"/>}
                            {error && <>⚠️ {error}</>}
                        </form>
                    }
                </div>
            </section>
        </>
    );
}

export default Register;

