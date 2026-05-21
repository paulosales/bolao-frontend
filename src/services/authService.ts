import api from './api'
import { User } from '../types'

interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  async login(data: { login: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  async register(data: {
    name: string
    password: string
    email?: string
    phone?: string
  }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  async me(): Promise<User> {
    const res = await api.get<User>('/auth/me')
    return res.data
  },

  async updateProfile(data: {
    name?: string
    email?: string
    phone?: string
    password?: string
    current_password?: string
  }): Promise<User> {
    const res = await api.put<User>('/auth/profile', data)
    return res.data
  },

  async refresh(): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/refresh')
    return res.data
  },
}
