import { jwtDecode } from "jwt-decode";
import axios from "axios";

function checkValidationOfJWT(token) {
    try {
        const decodedToken = jwtDecode(token);

        // Controleer of de 'exp' claim aanwezig is
        if (!decodedToken.exp) {
            console.warn("Token bevat geen exp claim");
            return false;
        }

        const expirationUnix = decodedToken.exp;  // Vervaltijd in Unix tijd (seconden)
        const nowInUnix = Math.floor(Date.now() / 1000);  // Huidige tijd in Unix tijd (seconden)

        // Vergelijk de huidige tijd met de vervaltijd
        return expirationUnix > nowInUnix;
    } catch (e) {
        console.error("Ongeldig token:", e);
        return false;
    }
}

const token = localStorage.getItem('token');
if (token && checkValidationOfJWT(token)) {
    axios.get('your-api-endpoint', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error("Error during API call", error);
        });
} else {
    console.log("Token is invalid or missing.");
}


export default checkValidationOfJWT;


