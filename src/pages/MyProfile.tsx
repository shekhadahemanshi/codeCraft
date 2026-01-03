import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, mockEmployees } from '@/data/mockData';

const MyProfile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // Find the current user's employee record
    // For demo, we'll use the first employee if no match
    const employeeId = mockEmployees[0]?.id || '1';
    navigate(`/employee/${employeeId}`, { replace: true });
  }, [navigate]);

  return null;
};

export default MyProfile;
