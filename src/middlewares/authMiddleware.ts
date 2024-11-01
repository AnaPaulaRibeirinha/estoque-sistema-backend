import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string } | jwt.JwtPayload;
}

export const authMiddleware: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Token inválido ou expirado.' });
      return;
    }

    req.user = decoded as { id: string; email: string };
    next();
  });
};
