import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/data/mockData";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  return null;
};

export default Index;
