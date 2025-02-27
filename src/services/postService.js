import axios from "axios";

class Get {
  getteams() {
    return axios.get("http://localhost:8001/allteams");
  }

  getProducts() {
    return axios.get("http://localhost:8001/allitems");
  }

  getReviews() {
    return axios.get("http://localhost:8001/allreviews");
  }
}

export default new Get();
