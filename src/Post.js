import React, { useEffect, useState } from "react";
import "./Post.css";
import { Avatar } from "@mui/material";
import { db } from "./firebase";
import {
    collection,
    doc,
    onSnapshot,
    query,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            const postRef = doc(collection(db, "posts"), postId);
            const commentsRef = collection(postRef, "comments");

            unsubscribe = onSnapshot(commentsRef, (snapshot) => {
                const comments = snapshot.docs.map((doc) => doc.data());
                setComments(comments);
            });

            /*
                        const commentsRef = collection(db, "posts", postId, "comments");
                        const commentsQuery = query(commentsRef);
            
                        unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
                            const comments = snapshot.docs.map((doc) => doc.data());
                            setComments(comments);
                        });
            
            */
            // unsubscribe = db
            //     .collection("posts")
            //     .doc(postId)
            //     .collection("comments")
            //     .onSnapshot((snapshot) => {
            //         setComments(snapshot.docs.map((doc) => doc.data()));
            //     });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    /*
    
        const postComment = (event) => {
            event.preventDefault();
            db.collection("posts").doc(postId).collection("comments").add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            setComment('');
    
        }
    */

    const postComment = async (event) => {
        event.preventDefault();

        const commentsRef = collection(doc(db, "posts", postId), "comments");

        try {
            await addDoc(commentsRef, {
                text: comment,
                username: user.displayName,
                timestamp: serverTimestamp(),
            });

            setComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            {/* header -> avatar username*/}

            <img className="post__image" src={imageUrl} alt="" />

            <h4 className="post__text">
                <strong>{username}</strong> {caption}
            </h4>
            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}
        </div>
    );
}

export default Post;
