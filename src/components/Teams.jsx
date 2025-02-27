import postService from "@/services/postService";
import { useEffect, useState } from "react";

const Teams = () => {
    const [teams, setteams] = useState([]);
    const [error, setError] = useState(null); 

    const fetchteams = async () => {
    try {
        const response = await postService.getteams();
        setteams(response.data.data);
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
    fetchteams();
    }, []);


  return (
    <div>
        {teams.map((items, id)=>{
            return(<div key={id} className="flex flex-row gap-4">
                <img src={`http://localhost:8001/uploads/${items.teamimage}`} alt="photo" className="h-24 w-24 object-cover"/>
                <h2 key={id}>{items.name}</h2>
                <p>{items.profession}</p>
            </div>)
        })}
        <div>
        {error && <p className="text-red-500">{error}</p>}
        </div>
    </div>
  )
}

export default Teams