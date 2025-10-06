// ============ API RESPONSE ============
export interface APIResponse<T, R> {
  status?: number;
  message?: string;
  data?: T;
  rest?: R;
}

// ============ GITHUB PROFILE USER ============
export interface GITHUB_PROFILE {
  id: string;
  displayName: string;
  provider: string;
  _json: {
    avatar_url: string;
    bio: string;
  };
}
