import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

const TopNav = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let isSession = sessionStorage.getItem('isLoggedIn');
        if(isSession){
            setUser(JSON.parse(sessionStorage.getItem('user')));
        }
    },[])

    const handleLogOut = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }

    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">My Blog</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    {user !== null && <li className="nav-item">
                        <Link className="nav-link" to="/add-post">Add Post</Link>
                    </li>}
                    {user !== null && <li className="nav-item">
                        <Link className="nav-link" to="/my-post">My Post</Link>
                    </li>}
                    {(user !== null) ? <li className="nav-item">
                        <Link className="nav-link" to="/login" onClick={() => handleLogOut()}>Log Out</Link>
                    </li>:
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Log In</Link>
                    </li>}
                </ul>
            </div>
        </nav>

    )
}

export default TopNav;