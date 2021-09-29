import React,{ useState, useEffect} from 'react';
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

const Register = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
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
        if(name.trim() === "" || mobile.trim() === "" || email.trim() === "" || password.trim() === ""){
            Toast.fire({
                icon: 'error',
                title: "Please fill all fields"
            })
        }else{
            setIsLoading(true);
            const params = {
                full_name: name,
                mobile: mobile,
                email: email,
                password: password,
            }
    
            // converting (json --> form-urlencoded)
            const data = Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
    
            axios
            .post(BASE_URL+"/admin/create-user", data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            .then((res) => {
                // Validating form
                setIsLoading(false);
                if(res.data.status === 'success'){
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
                    <h5 className="card-title row justify-content-center">Register</h5>
                    <div className="m-4">
                        <div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div className="form-group mt-3">
                                <input type="number" className="form-control" placeholder="Enter Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)}/>
                            </div>
                            <div className="form-group mt-3">
                                <input type="email" className="form-control" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="form-group mt-3">
                                <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            {!isLoading && <button type="button" className="btn btn-primary mt-3" onClick={() => handleLogin()}>Register </button>}
                            {isLoading && <button type="button" className="btn btn-primary mt-3" disabled><i className="fas fa-spinner fa-spin mr-1"></i> Registering... </button>}
                        </div>
                    </div>
                    <Link to="/login" className="card-link row justify-content-center">Already have An Account.</Link>
                </div>
            </div>
        </div>
    )
}

export default Register;