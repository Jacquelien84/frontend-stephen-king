import './Profile.css';
import {NavLink, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import Button from "../../components/button/Button.jsx";
import {FaUser} from "react-icons/fa";
import {Balloon} from "@phosphor-icons/react";




function Profile() {
    const { loggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const navigateToFavourites = () => {
        navigate('/favourites');
    };

    const navigateToNewBook = () => {
        navigate('/uploadnewbook');
    };

    const navigateToNewBookcover = () => {
        navigate('/uploadbookcover');
    };

    return (
        <>
            <section className="profile-content">
                <div className="container-row">
                    {(loggedIn) && <>
                    <h2>
                    {(user.role === "USER") && <FaUser/>}
                    {(user.role === "ADMIN") && <Balloon/>}
                    Welcome {user.username}!
                    </h2>
                    </>}
                </div>
                <div className="profile-container-column">
                    {loggedIn && <div className="profile-buttons">
                        {user.role === "USER"  && <>
                        <Button size="medium" text="View favourites" onclick={navigateToFavourites}/> </>}
                        {user.role === "ADMIN" && <>
                            <Button size="medium" text="Upload nieuw boek" onclick={navigateToNewBook}/>
                            <Button size="medium" text="View favourites" onclick={navigateToFavourites}/> </>}
                    </div>}
                </div>
            </section>
        </>
    );
}

export default Profile;

