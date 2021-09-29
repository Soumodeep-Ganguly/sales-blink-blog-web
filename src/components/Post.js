import React from 'react';
import { Link, useHistory } from 'react-router-dom'

const Post = ({ post, className, user, deletePost }) => {
    let history = useHistory();
    return(
        <div className={className} key={post._id}>
            <div className="m-3 card">
                <div className="card-body row">
                    <h5 className="card-title col-md-8">{post.title}</h5> 
                    - <small className="col-md-3">{post.user != null ? post.user.full_name :null}</small>
                    <p className="card-text mt-1 col-md-12" dangerouslySetInnerHTML={{__html: post.details.substring(0,200)}}></p>
                    <Link to={`/post/${post._id}`} className="card-link col-md-6">View Post</Link>
                    {(user !== null)?
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-3">
                                    <button className="btn btn-info btn-sm" onClick={() => history.push('/update-post/'+post._id)}>Edit</button>
                                </div>
                                <div className="col-md-3">
                                    <button className="btn btn-danger btn-sm" onClick={() => deletePost(post._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    :null}
                </div>
            </div>
        </div>
    )
}

export default Post;