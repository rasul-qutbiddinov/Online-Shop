// login types
export type LoginFieldType = {
  identity: string;
  password: string;
};

export type LoginRequest = {
  identity: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  record: {
    id: string;
    username: string;
    email: string;
    name: string;
    avatar: string;
    verified: boolean;
    created: string;
    updated: string;
  };
};

export type LoginApiError = {
  code: number;
  message: string;
  data: Record<string, unknown>;
};