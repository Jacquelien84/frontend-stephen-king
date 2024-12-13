import './Navigation.css'
import {NavLink, useNavigate} from 'react-router-dom';
import SK from '../../assets/stephen-king-logo.jpg';
import {AuthContext} from "../../Context/AuthContext";
import {useContext} from "react";

function Navigation() {
    const navigate = useNavigate();
    const {logout, loggedIn} = useContext(AuthContext);

    const navigateToHome = () => {
        navigate('/');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return(
        <nav className="main-navigation outer-content-container">
            <span className="inner-nav-container">
                <img onClick={navigateToHome} className="img" src={SK} alt="Logo" />
            </span>
                <ul className="NavUser">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/book">Boeken</NavLink>
                    </li>
                    <li>
                        <NavLink to="/news">Vers van de pers</NavLink>
                    </li>
                    {!loggedIn && (
                        <li>
                            <NavLink to="/register">Registreren</NavLink>
                        </li>
                    )}
                    {!loggedIn && (
                        <li>
                            <NavLink to="/login">Login</NavLink>
                        </li>
                    )}
                    {loggedIn && <>
                        <li>
                            <NavLink to="/profile">Profile</NavLink>
                        </li>
                        <li>
                            <NavLink onClick={handleLogout} to="/">Logout</NavLink>
                        </li>
                    </>
                    }
                </ul>
        </nav>
    )
}

export default Navigation;
