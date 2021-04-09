import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  });

 
  const [loggedInUser, setLoggedInUser] = useContext (UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleGoogleSignIn = () => {
    
     firebase.auth().signInWithPopup(googleProvider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          success:true
        };
        setUserToken();       
         setUser (signedInUser);
        // console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }
  const setUserToken = () => {
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      sessionStorage.setItem('token', idToken)
    }).catch(function(error) {
   
    });
  }
  const handleFbSignIn =() =>{ 
     firebase.auth().signInWithPopup(fbProvider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;      
      var user = result.user;    
      var accessToken = credential.accessToken;    
      console.log('fb user after sign in', user);
    })
    .catch((error) => {     
      var errorCode = error.code;
      var errorMessage = error.message;    
      var email = error.email;    
      var credential = error.credential;
    });
   }
  
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser (signedOutUser);
      })
      .catch(err => {

      });
  }
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }
  const handleSubmit = (e) => {
    // console.log(user.email,user.password)
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName (user.name);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          setLoggedInUser (newUserInfo);
          history.replace(from);
           console.log ('sign in user info', res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }
  const updateUserName = name => {
    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name
    }).then(function() {
     console.log ('user name update successfully')
    }).catch(function(error) {
      console.log(error)
    });
  }
  return (
    <div style= {{textAlign : 'center'}}>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
          <button onClick={handleGoogleSignIn}>Sign in</button>

      }
      <br/>
       <button onClick ={handleFbSignIn}> Sign in Using Facebook</button>
      {
        user.isSignedIn && <div>
          <p> Welcome, {user.name} </p>
          <p> your email: {user.email} </p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1> Our Own Authentication system</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser" >New User Sign up </label>
      {/* <p>Name: {user.name}</p>
    <p>Email: {user.email}</p>
    <p>password : {user.password}</p> */}
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" onBlur={handleBlur} placeholder=" Your Name" required />}
        <br />

        <input type="text" name="email" onBlur={handleBlur} placeholder=" Your Email Address" required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder=" Your password" required />
        <br />
        <input type="submit" value={newUser ? 'sign up' :'sign in'} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'logged in'} Successfully</p>}
    </div>
  );
}

export default Login;
