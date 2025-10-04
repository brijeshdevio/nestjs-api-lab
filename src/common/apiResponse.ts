import type { Response } from 'express';
import { APIResponse } from 'src/types';

export const apiResponse = <T, R>(
  res: Response,
  { status = 200, message, data, rest }: APIResponse<T, R>,
) => {
  return res.status(status).json({
    success: true,
    status,
    message,
    data,
    ...rest,
  });
};
