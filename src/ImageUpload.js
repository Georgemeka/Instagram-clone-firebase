import { Button } from '@mui/material'
import React, { useState } from 'react'
import { db, storage } from './firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import './ImageUpload.css'


function ImageUpload({ username }) {

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {

        const storageRef = ref(storage, `/images/${image.name}`)
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                //update progress
                setProgress(progress);
            },
            (err) => console.log(err),
            () => {
                //download url
                getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                    try {
                        await addDoc(collection(db, "posts"), {
                            timestamp: serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                        })

                    } catch (error) {
                        console.error(error.mesage)
                    }

                    setProgress(0);
                    setCaption("");
                    setImage(null);


                });
            }
        )
    }



    return (
        <div className='imageupload'>
            <progress className='imageupload__progress' value={progress} max="100" />
            <input type='text' placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption} />

            <input type='file' onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>



        </div>
    )
}

export default ImageUpload