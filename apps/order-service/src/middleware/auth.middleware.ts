import { FastifyReply, FastifyRequest } from "fastify";
import CLerk from '@clerk/fastify'
import {Send} from '@repo/response'
import type {CustomJwtSessionClaims} from "@repo/types"
declare module "fastify"{
    interface FastifyRequest {
        userId?:string;
    }
}
export const protectedRoute = async (request:FastifyRequest,reply:FastifyReply) => {
    const { userId } = CLerk.getAuth(request)
    if (!userId) {
        return Send.status401(reply, 'You are not logged in')
    }
    request.userId = userId
}

export const AdmindRoute = async (request:FastifyRequest,reply:FastifyReply) => {
    const auth = CLerk.getAuth(request)
    if (!auth.userId) {
        return Send.status401(reply, 'You are not logged in')
    }

    const claims = auth.sessionClaims as CustomJwtSessionClaims;

    if(claims.metadata?.role !== "admin"){
        return Send.status403(reply, 'Unathorized')
    }

    request.userId = auth.userId
}