import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Container, Box, TextField, Button, Typography, Alert, Divider, CircularProgress, Paper } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { signupApi, startGoogleLogin } from "../api/authApi";
import { useAuth } from "../store/authStore";
import type { SignupRequest, SignupFormErrors } from "../types/auth";
import type { ChangeEvent, FormEvent } from "react";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [ form, setForm ] = useState<SignupRequest> ({
    email: '',
    password: '',
    name: ''
  });
  const [ errors, setErrors ] = useState<SignupFormErrors>({});
  const validate = (): boolean => {
    const newErrors: SignupFormErrors = {};
    
    if(!form.name.trim()) newErrors.name = '이름을 입력해주세요🚫';
    if(!form.email.trim()) newErrors.email = 'email을 입력해주세요🚫';
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = '올바른 이메일 형식이 아닙니다🚫';

    if(!form.password) newErrors.password = '비밀번호를 입력해주세요🚫';
    else if(form.password.length < 8) newErrors.password = '비밀번호는 8자 이상이어야 합니다🚫';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signupMutation = useMutation({
    mutationFn: signupApi,
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
      signupMutation.mutate(form);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
    if(errors[name as keyof SignupFormErrors]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  return(
    <Container maxWidth="xs">
      <Box sx={{mt:8, display:'flex', flexDirection:'column', alignItems: 'center'}}>
        <Paper elevation={3} sx={{p: 4, width: '100%'}}>
          <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', mb:3}}>
            <PersonAddIcon color='primary' sx={{fontsize:48, mb:1}} />
            <Typography>회원가입</Typography>
          </Box>

          {signupMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {signupMutation.error instanceof Error ? signupMutation.error.message: '회원가입 중 오류가 발생했습니다🚫'}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit}>
            <TextField 
              fullWidth label='이름'
              name='name'
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin='normal'
              autoFocus
            />
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
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? <CircularProgress size={24} color='inherit' /> : '회원가입'}
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
              이미 계정이 있으신가요?{' '}
              <Link to='/login' style={{color: '#4285f4'}}>로그인</Link>
            </Typography>
          </Box>

        </Paper>
      </Box>
    </Container>
  )
}