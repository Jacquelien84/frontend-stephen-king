import './Register.css';
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';

import Input from "../../components/input/Input.jsx";

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!username || !email || !password) {
            setError('Alle velden zijn verplicht');
            return false;
        }
        if (password.length < 6) {
            setError('Wachtwoord moet minstens 6 karakters lang zijn');
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await axios.post('/users/register', {
                username, email, password });
            console.log('Registration successful:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            if (error.response) {
                setError(error.response.data.message || 'Registratie mislukt. Probeer het opnieuw.');
            } else {
                setError('Er is een fout opgetreden. Probeer het opnieuw.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <section className="login outer-content-container">
                <div className="inner-content-container">
                    <h1>Registreer je hier:</h1>
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
                            type="email"
                            label="Voer hier je e-mailadres in:"
                            id="email"
                            placeholder="Emailadres"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            id="password"
                            label="Voer je wachtwoord in::"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Voer hier je wachtwoord in"
                            required
                        />
                        {error && <p className="error">Dit account bestaat al. Probeer een ander emailadres.</p>}
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Bezig met registreren...' : 'Registreer'}
                        </button>
                    </form>
                </div>
                <p>Heb je al een account? <Link to="/login">Log</Link> je dan hier in.</p>
            </section>
        </>
    );
}

export default Register;
