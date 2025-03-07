import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/comments/";

function App() {
  const [comments, setComments] = useState([]); // Default to empty array
  const [newComment, setNewComment] = useState({ author: "", text: "" });
  const [editingComment, setEditingComment] = useState(null);

  // Fetch comments from API on initial load
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log("Fetched Comments:", response.data); // Log the response for debugging
        setComments(response.data); // Directly set the comments
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Add or update a comment
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingComment) {
      axios
        .patch(`${API_URL}${editingComment.id}/`, newComment)
        .then((response) => {
          setComments(
            comments.map((comment) =>
              comment.id === editingComment.id ? response.data : comment
            )
          );
          setEditingComment(null);
          setNewComment({ author: "", text: "" });
        })
        .catch((error) => console.error("Error updating comment:", error));
    } else {
      axios
        .post(API_URL, newComment)
        .then((response) => {
          fetchComments(); // Re-fetch the comments after adding a new one
          setNewComment({ author: "", text: "" });
        })
        .catch((error) => console.error("Error adding comment:", error));
    }
  };

  // Fetch all comments from the backend
  const fetchComments = async () => {
    try {
      const response = await axios.get(API_URL);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Delete a comment
  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}${id}/`)
      .then(() => {
        setComments(comments.filter((comment) => comment.id !== id));
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  // Set comment for editing
  const handleEdit = (comment) => {
    setEditingComment(comment);
    setNewComment({ author: comment.author, text: comment.text });
  };

  return (
    <div className="container">
      <h2>Comments</h2>

      {/* Form for adding/editing a comment */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Author"
          value={newComment.author}
          onChange={(e) =>
            setNewComment({ ...newComment, author: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Comment"
          value={newComment.text}
          onChange={(e) =>
            setNewComment({ ...newComment, text: e.target.value })
          }
          required
        />
        <button type="submit">
          {editingComment ? "Update" : "Add"} Comment
        </button>
      </form>

      {/* Display list of comments */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments
            .slice() // Create a shallow copy of the array to avoid mutating the original state
            .reverse() // Reverse the array to show most recent comments at the top
            .map((comment) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <strong>{comment.author}</strong>
                  <span className="comment-date">
                    {new Date(comment.date).toLocaleString()}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
                {comment.image && (
                  <img
                    src={comment.image}
                    alt="Comment"
                    className="comment-image"
                  />
                )}
                <div className="comment-footer">
                  <small>Likes: {comment.likes}</small>
                  <button
                    onClick={() => handleEdit(comment)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p>No comments available</p>
        )}
      </div>
    </div>
  );
}

export default App;
