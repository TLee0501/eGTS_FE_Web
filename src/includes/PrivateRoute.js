import React from "react";
import { Navigate, Outlet} from 'react-router-dom';
import Header from "../flagments/header";
import Navbar from "../flagments/navbar";

const PrivateRoute = ({isAuthenticated, setAuthenticated}) => {
    return isAuthenticated() ? (
        <>
            <div className='content-container'>
                <aside className='left-side'>
                    <Navbar setAuthenticated={setAuthenticated}/>
                </aside>
                <aside className="right-side">
                    <Header setAuthenticated={setAuthenticated}/>
                    <div className="content">
                        <div className="inner-content">
                            <Outlet />
                        </div>
                    </div>
                </aside>
            </div>
        </>
        ): <Navigate to="/login"/>;
};

export default PrivateRoute;