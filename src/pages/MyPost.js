import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import TopNav from './../components/TopNav'
import Post from './../components/Post'

import { BASE_URL } from './../env'

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

const MyPost = () => {
    const [token, setToken] = useState(null);
    const [posts, setPosts] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        let isSession = sessionStorage.getItem('isLoggedIn');
        if(isSession){
            setToken(sessionStorage.getItem('token'));
            setUser(JSON.parse(sessionStorage.getItem('user')));
        }
    },[])
    
    const getPosts = () => {
        const params = {
            user: user._id,
        }

        // converting (json --> form-urlencoded)
        const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

        axios
        .post(BASE_URL+"/admin/post-list", data,{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        .then((res) => {
            // Validating form
            if(res.data.status === 'success'){
                setPosts(res.data.result)
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
            Toast.fire({
                icon: 'error',
                title: "Please refresh page"
            })
        });
    }

    useEffect(() => {
        if(token !== null && user !== null){
            getPosts();
        }
        // eslint-disable-next-line
    },[token, user])

    const deletePost = (id) => {
        const params = {
            user: user._id,
            id: id,
        }

        // converting (json --> form-urlencoded)
        const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

        axios
        .post(BASE_URL+"/admin/delete-post", data,{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorization': token
                }
            })
        .then((res) => {
            // Validating form
            if(res.data.status === 'success'){
                Toast.fire({
                    icon: 'success',
                    title: "Successfully deleted post"
                })
                getPosts()
            }else if(res.data.status === "error"){
                Toast.fire({
                    icon: 'error',
                    title: res.data.message
                })
            }else{
                Toast.fire({
                    icon: 'error',
                    title: "Unable to delete"
                })
            }
        })
        .catch((err) => {
            Toast.fire({
                icon: 'error',
                title: "Please Try Again"
            })
        });
    }

    return(
        <div>
            <TopNav />
            <div className="row">
                {(posts !== null)?
                    posts.map(post => (
                        <Post 
                            className="col-md-4"
                            post={post}
                            user={user}
                            deletePost={deletePost}
                        />
                    ))
                :null}
            </div>
        </div>
    )
}

export default MyPost;