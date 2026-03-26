import React, { createContext, useContext } from 'react';
import { api } from '../api/api';

type User = {
  _id: string,
  username: string,
  email: string,
  avatar: string,
  points: number,
  walletBalance: number,
};

type AuthContextType = {
  user: User | null,
  isLoading: boolean,
  signIn: (email: string, password: string) => Promise(void);
  signUp: (username: string, email: string, password: string) => Promise(void);
  logout: () => Promise(void);
  checkAuthentication: () => Promise(void);
};

const AuthContext = creatontext<AuthContextType>({ requireChildren: false };

export function UseAuthContext() {
  return useContext(AuthContext);
}

// Example usage
// import { UseAuthContext } from './context/auth';
// const { user, signIn } = UseAuthContext();
// await signIn('email@gmail.com', 'password');
.