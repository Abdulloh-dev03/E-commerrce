import { getAuth } from '@hono/clerk-auth'
import {createMiddleware} from 'hono/factory'
import {Send} from '@repo/response'
import type {CustomJwtSessionClaims} from '@repo/types'

export const protectedRoute = createMiddleware<{
  Variables: { userId: string }
}>(async (c, next): Promise<Response | void> => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return Send.status401(c, 'You are not logged in.');
  }

  c.set('userId', auth.userId);
  await next();
});

export const AdminRoute = createMiddleware<{
  Variables: { userId: string }
}>(async (c, next): Promise<Response | void> => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return Send.status401(c, 'You are not logged in.');
  }

  const claims = auth.sessionClaims as CustomJwtSessionClaims;

  if(claims.metadata?.role !== "admin"){
        return Send.status403(c, 'Unathorized')
  }

  c.set('userId', auth.userId);
  await next();
});
