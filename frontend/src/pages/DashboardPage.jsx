import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProtectedData } from "../api";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetchProtectedData();
      if (response.email) {
        setUser(response);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    loadUser();
  }, [navigate]);

  return user ? <div>Welcome, {user.full_name}!</div> : <div>Loading...</div>;
};

export default DashboardPage;
