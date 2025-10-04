// ============ API RESPONSE ============
export interface APIResponse<T, R> {
  status?: number;
  message?: string;
  data?: T;
  rest?: R;
}
