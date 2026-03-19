import { useState, createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { UserInfo, AuthContextType } from "../types/auth";

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_info';

// ContextAPI 쓰겠다는 뜻이겠네요.
const AuthContext = createContext<AuthContextType | null>(null);

// children의 타입 : ReactNode란걸 이용할건데 특징으로 JSX, 문자열, 배열 등 모두 허용합니다.
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children } : AuthProviderProps) {
  
  const [ user, setUser ] = useState<UserInfo | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? (JSON.parse(savedUser) as UserInfo) : null;
  });

  const login = (token: string, userInfo: UserInfo): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () : void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const getToken = () : string | null => localStorage.getItem(TOKEN_KEY);

  const isLoggedIn : boolean = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() : AuthContextType {
  const context = useContext(AuthContext);
  // null이면 AuthProvider return 외부에서 사용했다는 의미가 될겁니다. -> 오류 발생해야함.
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  // 정상 작동했다면 TypeScript의 return 타입에 따라서 작성해야 하기 때문에
  return context;
}