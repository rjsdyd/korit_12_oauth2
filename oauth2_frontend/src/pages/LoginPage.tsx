import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Container, Box, TextField, Button, Typography, Alert, Divider, CircularProgress, Paper } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { loginApi, startGoogleLogin } from "../api/authApi";
import { useAuth } from "../store/authStore";
import type { LoginRequest, LoignFormErrors } from "../types/auth";
import type { ChangeEvent, FormEvent } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [ form, setForm ] = useState<LoginRequest> ({
      email: '',
      password: ''
  });
  const [ errors, setErrors ] = useState<LoignFormErrors>({});
  const validate = () : boolean => {
    const newErrors: LoignFormErrors = {};

    if(!form.email.trim()) newErrors.email = 'email을 입력해주세요🚫';
    if(!form.password) newErrors.password = '비밀번호를 입력해주세요🚫';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: data => {
      login(data.token, {
        email: data.email,
        name: data.name,
        role: data.role,
      });
      setTimeout(() => {
        navigate('/', { replace: true});
      }, 0)
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if(validate()) {
      loginMutation.mutate(form);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      setForm(prev => ({...prev, [name]: value}));
      if(errors[name as keyof LoignFormErrors]) {
        setErrors(prev => ({...prev, [name]: ''}));
      }
    };

  return(
    <Container maxWidth="xs">
      <Box sx={{mt:8, display:'flex', flexDirection:'column', alignItems: 'center'}}>
        <Paper elevation={3} sx={{p: 4, width: '100%'}}>
          <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', mb:3}}>
            <LockOpenIcon color='primary' sx={{fontsize:48, mb:1}} />
            <Typography>로그인</Typography>
          </Box>

          {loginMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginMutation.error instanceof Error ? loginMutation.error.message: 'email 또는 비밀번호를 확인해주세요🚫'}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit}>
            <TextField 
              fullWidth label='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin='normal'
              type='email'
            />
            <TextField 
              fullWidth label='비밀번호 (8자 이상)'
              name='password'
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin='normal'
              type='password'
            />
            <Button
              type='submit'
              fullWidth variant='contained'
              size='large'
              sx={{mt:2}}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <CircularProgress size={24} color='inherit' /> : '로그인'}
            </Button>
          </Box>

          <Divider sx={{my:3}}>
            <Typography variant="body2" color='text.secondary'>
              또는
            </Typography>
          </Divider>
          <Button
            fullWidth variant="contained" 
            size="large"
            startIcon={<GoogleIcon />}
            onClick={startGoogleLogin}
            sx={{borderColor: '#4285f4', color: '#4285f4'}}
          >
            Google로 계속하기
          </Button>

          <Box sx={{mt:2, textAlign: 'center'}}>
            <Typography variant="body2" color='text.secondary'>
              계정이 없으신가요?{' '}
              <Link to='/signup' style={{color: '#4285f4'}}>회원가입</Link>
            </Typography>
          </Box>
          
        </Paper>
      </Box>
      
    </Container>
  )
}