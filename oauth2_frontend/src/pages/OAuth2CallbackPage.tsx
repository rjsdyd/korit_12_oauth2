import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { useAuth } from "../store/authStore";

export default function OAuth2CallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {login} = useAuth();
  const [ error, setError ] = useState<string | null> (null);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const role = searchParams.get('role') ?? 'ROLE_USER';

    if(!token) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      return;
    }

    login(token, {
      email: email ?? '',
      name: name ?? '',
      role,
    });

    navigate('/', {replace: true});
  }, [searchParams]);

  if(error) {
    return (
      <Box sx={{mt:8, textAlign: 'center'}}>
        <Alert severity="error" sx={{maxWidth: 400, mx: 'auto'}}>{error}</Alert>
      </Box>
    )
  }

  return(
    <Box sx={{mt: 8, display: 'flex', flexDirection: 'column', alignItems:'center', gap:2}}>
      <CircularProgress size={48} />
      <Typography color='text.secondary'>구글 로그인 처리 중...⏱️</Typography>
    </Box>
  );
}