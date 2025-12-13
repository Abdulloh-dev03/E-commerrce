import { getAuth } from "@clerk/express";
import { Send } from "@repo/response";
import { NextFunction, Request, Response } from "express";
import type {CustomJwtSessionClaims} from "@repo/types"

declare global {
    namespace Express{
        interface Request {
            userId?:string
        }
    }
}

export const protectedRoute = (req:Request,res:Response,next:NextFunction) => {
    const auth = getAuth(req);
    const userId = auth.userId;
    if(!userId){
        return Send.status401(res, "You are not logged in");
    };

    req.userId = auth.userId;
    return next();
}

export const AdminRoute = (req:Request,res:Response,next:NextFunction) => {
    const auth = getAuth(req);
    const userId = auth.userId;
    if(!userId){
        return Send.status401(res, "You are not logged in");
    };

    const claims = auth.sessionClaims as CustomJwtSessionClaims;


    if(claims.metadata?.role !== "admin"){
        return Send.status403(res, 'Unathorized')
    }

    req.userId = auth.userId;
    return next();
}





