import postService from "@/services/postService";
import { useEffect, useState } from "react";

const Review = () => {

    const [reviews, setreviews] = useState([]);
            const [error, setError] = useState(null); 
        
            const fetchReview = async () => {
            try {
                const response = await postService.getReviews();
                setreviews(response.data.data);
                setError(null); 
            } catch (error) {
                if (error.response) {
                setError(`Server Error: ${error.response.status} - ${error.response.data.message || "Something went wrong"}`);
                } else if (error.request) {
                setError("Network error: Unable to reach the server. Please try again.");
                } else {
                setError("An unexpected error occurred.");
                }
            }
            };
        
            useEffect(() => {
            fetchReview();
            }, []);


  return (
    <div>{reviews.map((items, id)=>{
        return (<div key={id}>
            <img src={`http://localhost:8001/reviews/${items.profilepic}`} alt="photo" className="h-24 w-24 object-cover"/>
            <h2 key={id}>{items.name}</h2>
            <p>{items.review}</p>
        </div>)
    })}</div>
  )
}

export default Review