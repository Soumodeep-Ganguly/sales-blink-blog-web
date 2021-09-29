import React,{ useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import TopNav from '../components/TopNav';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';

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

const Post = () => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);
    const [comment, setComment] = useState("");
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    let { id } = useParams()

    useEffect(() => {
        let isSession = sessionStorage.getItem('isLoggedIn');
        if(isSession){
            setToken(sessionStorage.getItem('token'));
            setUser(JSON.parse(sessionStorage.getItem('user')));
        }
    },[])

    const getPost = () => {
        const params = {
            id: id,
        }

        // converting (json --> form-urlencoded)
        const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

        axios
        .post(BASE_URL+"/admin/single-post", data,{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        .then((res) => {
            // Validating form
            if(res.data.status === 'success'){
                setPost(res.data.result);
                setComments(res.data.comments);
            }else if(res.data.status === "error"){
                Toast.fire({
                    icon: 'error',
                    title: res.data.message
                })
            }else{
                Toast.fire({
                    icon: 'error',
                    title: "Unable to get post"
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
        if(id !== ""){
            getPost();
        }
        // eslint-disable-next-line
    },[id])

    const addComment = () => {
        if(user !== null && token !== null){
            if(comment.trim() === ""){
                Toast.fire({
                    icon: 'error',
                    title: "Please fill all fields"
                })
            }else{
                const params = {
                    post: id,
                    user: user._id,
                    comment: comment,
                }
        
                // converting (json --> form-urlencoded)
                const data = Object.keys(params)
                .map((key) => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');
        
                axios
                .post(BASE_URL+"/admin/create-comment", data,{
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'authorization': token
                        }
                    })
                .then((res) => {
                    // Validating form
                    if(res.data.status === 'success'){
                        getPost();
                        setComment("");
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
                        title: "Please Try Again"
                    })
                });
            }
        }
    }
    return(
        <div>
            <TopNav />
            {(post !== null)? 
                <div className="row justify-content-center mt-3">
                    <div className="p-3 card col-md-8">
                        {post.image !== ""?
                            <img className="card-img-top" src={post.image} alt={post.title} />
                        :null}
                        <div className="card-body">
                            <div className="row">
                                <h5 className="col-md-9">{post.title}</h5> 
                                <small className="col-md-3"> - {post.user != null ? post.user.full_name :null}</small>
                            </div>
                            <div>
                                {moment(post.created_date).format("D MMM YYYY")}
                            </div>
                            <p className="card-text mt-3" dangerouslySetInnerHTML={{__html: post.details}}></p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        {(user !== null)?
                            <div className="mb-4">
                                <div className="form-group">
                                    <textarea className="form-control" placeholder="Comment here..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                                </div>
                                <button className="btn btn-primary mt-2 mb-2" onClick={() => addComment()}>Comment</button>
                                <hr />
                            </div>
                        :null}
                        <div>
                            {(comments !== null && comments.length > 0)?
                                comments.map(comment => (
                                    <div className="card p-2 mb-2">
                                        <div>
                                            {(comment.user !== null)?<b>{comment.user.full_name} </b>:<b>Anonymous </b>} 
                                            - <small>{moment(comment.created_date).format('(D-MMM-YYYY) h:m a')}</small>
                                        </div>
                                        <div className="ml-2">
                                            {comment.comment}
                                        </div>
                                    </div>
                                ))
                            :null}
                        </div>
                    </div>
                </div>
            :null}
        </div>
    )
}
export default Post;