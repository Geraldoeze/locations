import React, {useContext} from "react";
import { NavLink } from "react-router-dom";
import './NavLinks.css'
import { AuthContext } from "../../context/auth-context";

const NavLinks = () => {
    const auth = useContext(AuthContext);
    const location = `/${auth.userId}/places`;

    return <ul className="nav-links">
        <li>
            <NavLink to='/' exact="true" >ALL USERS</NavLink>
        </li>
        {auth.isLoggedIn && (<li>
            <NavLink to={location} >MY PLACES</NavLink>
        </li>)}
        {auth.isLoggedIn && (<li>
            <NavLink to='/places/new'>ADD PLACE</NavLink>
        </li>)}
        {!auth.isLoggedIn && (<li>
            <NavLink to='/auth'>AUTHENTICATE</NavLink>
        </li>)} 
        {auth.isLoggedIn && (
            <button onClick={auth.logout}>LOGOUT</button>
        )}
    </ul>
     
}
 
export default NavLinks;