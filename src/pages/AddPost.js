import React,{ useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import FileBase from 'react-file-base64';
import Swal from 'sweetalert2';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import { BASE_URL } from '../env';
import TopNav from '../components/TopNav';

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

const AddPost = () => {
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    let history = useHistory();
    let { id } = useParams();

    useEffect(() => {
        let isSession = sessionStorage.getItem('isLoggedIn');
        if(isSession){
            setToken(sessionStorage.getItem('token'));
            setUser(JSON.parse(sessionStorage.getItem('user')));
        }
    },[])

    const handlePost = () => {
        if(title.trim() === "" || details.trim() === "" || token == null || user === null){
            Toast.fire({
                icon: 'error',
                title: "All fields required"
            })
        }else{
            setIsLoading(true);
            let params = {}

            let link = "";
            if(id){
                link = BASE_URL + "/admin/update-post"
                params = {
                    title: title,
                    details: details,
                    image: image,
                    user: user._id,
                    id: id,
                }
            }else{
                link = BASE_URL + "/admin/create-post"
                params = {
                    title: title,
                    details: details,
                    image: image,
                    user: user._id,
                }
            }

            // converting (json --> form-urlencoded)
            const data = Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
    
            axios
            .post(link, data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorization': token
                    }
                })
            .then((res) => {
                // Validating form
                setIsLoading(false);
                if(res.data.status === 'success'){
                    if(id){
                        history.push('/my-post');
                    }else{
                        history.push('/');
                    }
                }else if(res.data.status === "error"){
                    Toast.fire({
                        icon: 'error',
                        title: "An Error Occured"
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
                });
            });
        }
    }

    const getPost = () => {
        const params = {
            id: id,
        }

        // converting (json --> form-urlencoded)
        const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

        axios
        .post(BASE_URL + "/admin/single-post", data,{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        .then((res) => {
            // Validating form
            setIsLoading(false);
            if(res.data.status === 'success'){
                setTitle(res.data.result.title);
                setDetails(res.data.result.details);
                setImage(res.data.result.image);
            }else if(res.data.status === "error"){
                Toast.fire({
                    icon: 'error',
                    title: "Unable to get post"
                })
            }else{
                Toast.fire({
                    icon: 'error',
                    title: "Unexpected error"
                })
            }
        })
        .catch((err) => {
            setIsLoading(false);
            Toast.fire({
                icon: 'error',
                title: "Please refresh page"
            })
        });
    }

    useEffect(() => {
        if(id) {
            getPost()
        }
        // eslint-disable-next-line
    },[id])

    return(
        <div>
            <TopNav />
            <div className="row justify-content-center mt-5">
                <div className="card col-md-8">
                    <div className="card-body p-4">
                        <h5 className="card-title">{id?"Update":"Add"} Post</h5>
                        <div className="form-group mt-2">
                            <label>Title</label>
                            <input type="text" className="form-control" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </div>
                        <div className="form-group mt-2">
                            <label>Details</label>
                            <SunEditor setContents={details} height="200px" onChange={setDetails}/>
                            {/* <textarea className="form-control" placeholder="Enter Details" value={details} onChange={(e) => setDetails(e.target.value)}/> */}
                        </div>
                        <div className="form-group mt-2">
                            <FileBase type="file" multiple={false} onDone={({ base64 }) => setImage(base64)} />
                        </div>
                        {!isLoading && <button type="button" className="btn btn-primary mt-3" onClick={() => handlePost()}>{id?"Update":"Add"} Post </button>}
                        {isLoading && <button type="button" className="btn btn-primary mt-3" disabled><i className="fas fa-spinner fa-spin mr-1"></i> {id?"Updating":"Adding"} Post... </button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPost;