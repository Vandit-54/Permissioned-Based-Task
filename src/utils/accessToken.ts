import jwt from 'jsonwebtoken';

export function generateAccessToken(): string {
  const { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRE } = process.env;

  if (!ACCESS_TOKEN || !ACCESS_TOKEN_EXPIRE) {
    throw new Error('ACCESS_TOKEN and ACCESS_TOKEN_EXPIRE must be defined in environment variables.');
  }

  interface PayloadInterface {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  const payload: PayloadInterface = {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role
  };

  try {
    const token = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: ACCESS_TOKEN_EXPIRE });
    return token;
  } catch (error: any) {
    throw new Error('Error signing token: ' + error.message);
  }
}
