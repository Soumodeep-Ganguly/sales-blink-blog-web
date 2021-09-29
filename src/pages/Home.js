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

const Home = () => {
    const [posts, setPosts] = useState(null);
    
    const getPosts = () => {
        axios
        .post(BASE_URL+"/admin/post-list", {},{
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
                    title: "Unexpected error while getting posts"
                })
            }
        })
        .catch((err) => {
            Toast.fire({
                icon: 'error',
                title: "Unexpected error while getting posts"
            })
        });
    }

    useEffect(() => {
        getPosts();
    },[])

    return(
        <div>
            <TopNav />
            <div className="row">
                {(posts !== null)?
                    posts.map(post => (
                        <Post 
                            className="col-md-4"
                            post={post}
                            user={null}
                        />
                    ))
                :null}
            </div>
        </div>
    )
}

export default Home;