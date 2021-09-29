import React,{ useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import { BASE_URL } from '../env';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    let history = useHistory();

    useEffect(() => {
        let isSession = sessionStorage.getItem('isLoggedIn');
        if(isSession){
            history.push('/');
        }
        // eslint-disable-next-line
    },[])

    const handleLogin = () => {
        if(email.trim() === "" || password.trim() === ""){
            Toast.fire({
                icon: 'error',
                title: "Fill all fields"
            })
        }else{
            setIsLoading(true);
            const params = {
                email: email,
                password: password,
            }
    
            // converting (json --> form-urlencoded)
            const data = Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
    
            axios
            .post(BASE_URL+"/admin/login", data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            .then((res) => {
                // Validating form
                setIsLoading(false);
                if(res.data.status === 'success'){
                    sessionStorage.setItem('isLoggedIn', true);
                    sessionStorage.setItem('token', res.data.token);
                    sessionStorage.setItem('user', JSON.stringify(res.data.result))
                    history.push('/');
                }else if(res.data.status === "error"){
                    Toast.fire({
                        icon: 'error',
                        title: res.data.message
                    })
                }else{
                    Toast.fire({
                        icon: 'error',
                        title: "Unexpected Error"
                    })
                }
            })
            .catch((err) => {
                setIsLoading(false);
                Toast.fire({
                    icon: 'error',
                    title: "Please try again"
                })
            });
        }
    }

    return(
        <div className="row justify-content-center">
            <div className="card p-4 col-md-5" style={{ marginTop: '15vh'}}>
                <div className="card-body">
                    <Link to="/"><h3 className="row justify-content-center mb-3">BLOG</h3></Link>
                    <h5 className="card-title row justify-content-center">Login</h5>
                    <div className="m-4">
                        <div>
                            <div className="form-group">
                                <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="form-group mt-3">
                                <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            {!isLoading && <button type="button" className="btn btn-primary mt-3" onClick={() => handleLogin()}>Log In </button>}
                            {isLoading && <button type="button" className="btn btn-primary mt-3" disabled><i className="fas fa-spinner fa-spin mr-1"></i> Logging In... </button>}
                        </div>
                    </div>
                    <Link to="/register" className="card-link row justify-content-center">Create An Account.</Link>
                </div>
            </div>

        </div>
    )
}

export default Login;