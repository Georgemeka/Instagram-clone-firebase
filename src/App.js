import Image from './images/logoinsta.png'
import { useState, useEffect } from 'react';
import './App.css';
import './Post'
import Post from './Post';
import { db, auth } from './firebase';
import { collection, onSnapshot } from "firebase/firestore";
import { Box, Button, Input, Modal } from '@mui/material';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import ImageUpload from './ImageUpload';






const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser(user);


      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    };
  }, [user, username]);



  useEffect(() => {
    const colRef = collection(db, 'posts');
    //get collection data
    // getDocs(colRef)
    //   .then((snapshot) => {
    //     setPosts(snapshot.docs.map(doc => doc.data()));
    //   });

    //real time data collection 
    onSnapshot(colRef, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })

    // db.collection('posts').onSnapshot(snapshot => {

    //   setPosts(snapshot.docs.map(doc => doc.data()))

    // });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log('User created:', cred.user)

        updateProfile(auth.currentUser, {
          displayName: username,
        })

      })
      .catch((error) => alert(error.message))

    setOpen(false);


  }

  const signIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        return updateProfile(auth.currentUser, {
          displayName: username,
        }).then(() => {
          console.log('User logged in:', cred.user);
          setOpenSignIn(false);
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  return (


    <div className="app">



      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={style}>
          <center>
            <img
              className='app__headerImage'
              src={Image}
              alt='Instagram logo'
            />
          </center>
          <form className='app_signup'>
            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder='password'
              type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>SIGNUP</Button>
          </form>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <Box sx={style}>
          <center>
            <img
              className='app__headerImage'
              src={Image}
              alt='Instagram logo'
            />
          </center>
          <form className='app_signup'>

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder='password'
              type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>LOG IN</Button>
          </form>
        </Box>
      </Modal>



      <div className='app__header'>
        <img
          className='app__headerImage'
          src={Image}
          alt='Instagram'
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className='app__loginContainer'>

            <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
            <Button onClick={() => setOpen(true)}>Signup</Button>


          </div>
        )}



      </div>

      <div className='app__posts'>
        {
          posts.map(({ id, post }) => (
            <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
      </div>















      {
        user?.email ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>Sorry you need to login to upload</h3>
        )
      }





      {/* Posts */}
      {/* Posts */}
    </div >
  );
}

export default App;
