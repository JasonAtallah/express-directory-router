import { NextFunction, Request, Response } from 'express';

export function emptyMiddleware(
  _: Request,
  __: Response,
  next: NextFunction,
): void {
  console.log('Running empty middleware');
  next();
}

export function sendResponse(req: Request, res: Response): void {
  const { path } = req.route;
  const method = Object.keys(req.route.methods)[0].toUpperCase();

  res.send(`${method} ${path} - SUCCESS`);
}
