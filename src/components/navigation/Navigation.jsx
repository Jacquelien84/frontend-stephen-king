import './Navigation.css'
import {Link, useNavigate} from 'react-router-dom';
import Button from "../button/Button.jsx";
import sk from '../../assets/stephen-king-logo.jpg';

function Navigation() {
    const navigate = useNavigate();

    return(
        <nav className="main-navigation outer-content-container">
            <div className="inner-navigation-container">
                <Button type="botton" variant="invisible" onClick={() => navigate('/')}>
                    <img className="img" src={sk} alt="Logo that links to home page" />
                </Button>
                <ul className="main-navigation-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/boeken">Boeken</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navigation;
