import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({component: Component, ...rest}) => {
    const isSessionAuth = sessionStorage.getItem('isLoggedIn');
    return (
        <Route
            {...rest} 
            render={props => {
                if(isSessionAuth)
                {
                    return (
                        <div>
                            <Component {...props}/>
                        </div>
                    );
                }else{
                    return <Redirect to={
                        {
                            pathname: "/login",
                            state: {
                                from: props.location
                            }
                        }
                    }/>
                }
            }
        }/>
    );
};