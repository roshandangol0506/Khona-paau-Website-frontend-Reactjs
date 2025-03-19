import axios from "axios";

class Get {
  getteams() {
    return axios.get("http://localhost:8001/allteams");
  }

  getvisibleProducts() {
    return axios.get("http://localhost:8001/visibleproducts");
  }

  getallProducts() {
    return axios.get("http://localhost:8001/allproducts");
  }

  getReviews() {
    return axios.get("http://localhost:8001/allreviews");
  }
  getMyCarts() {
    return axios.get("http://localhost:8001/mycart", {
      withCredentials: true,
    });
  }
  getCheckout() {
    return axios.get("http://localhost:8001/checkout", {
      withCredentials: true,
    });
  }

  getuserlogout() {
    return axios.get("http://localhost:8001/user/logout", {
      withCredentials: true,
    });
  }

  getbestselling() {
    return axios.get("http://localhost:8001/bestselling", {});
  }
}

export default new Get();
