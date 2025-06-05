export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  createdAt: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  locationFound: string;
  dateReported: string;
  status: 'LOST' | 'FOUND' | 'CLAIMED';
  reportedById: number;
  reportedByUsername: string;
  heldById?: number;
  heldByUsername?: string;
  claimedById?: number;
  claimedByUsername?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: number;
  itemId: number;
  itemName: string;
  requesterId: number;
  requesterUsername: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message: string;
  requestDate: string;
  resolutionDate?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JwtAuthenticationResponse {
  token: string;
  username: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'STAFF' | 'USER';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: SignUpRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ItemFormData {
  name: string;
  description: string;
  category: string;
  locationFound: string;
  dateReported: string;
  status: 'LOST' | 'FOUND' | 'CLAIMED';
}

export interface RequestCreateDto {
  itemId: number;
  message?: string;
}

export interface RequestUpdateDto {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
} 