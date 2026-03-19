import { Container, Box, Typography, Button, Paper, Chip, Avatar } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";


export default function HomePage() {
  // 정의한 useAuth()를 사용해볼겁니다.
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () : void => {
    logout();
    navigate('/login');
  }

  return (
    <>
    
    </>
  );
}