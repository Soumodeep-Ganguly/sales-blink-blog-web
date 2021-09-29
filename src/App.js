import './App.css';

import {
  Route,
  Switch
} from 'react-router-dom';
import { ProtectedRoute } from './protected.route';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddPost from './pages/AddPost';
import MyPost from './pages/MyPost';
import Post from './pages/Post';

function App() {
  return (
    <div>
      <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <ProtectedRoute exact path="/add-post" component={AddPost} />
          <ProtectedRoute exact path="/update-post/:id" component={AddPost} />
          <ProtectedRoute exact path="/my-post" component={MyPost} />
          <Route exact path="/post/:id" component={Post} />
          <Route path="*" component={() => (<h1 className="mt-5">404 Not Found</h1>)} />
      </Switch>
    </div>
  );
}

export default App;