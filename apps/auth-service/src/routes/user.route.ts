import { Request, Response, Router } from "express";
import clerkClient from "../utils/clerk";
import { Send } from "@repo/response";
import { producer } from "../utils/kafka";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const users = await clerkClient.users.getUserList();
  return Send.status200(res,"Users fetched successfully",users);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return Send.status400(res, "User ID is required");
  }
  const user = await clerkClient.users.getUser(id);
  return Send.status200(res,"User fetched successfully",user);
});

router.post("/", async (req:Request,res:Response) => {
    type CreateParams = Parameters<typeof clerkClient.users.createUser>[0];
    const newUser:CreateParams = req.body;
    const users = await clerkClient.users.createUser(newUser);
    producer.send("user.created",{
      value:{
        username:users.username,
        email:users.emailAddresses[0]?.emailAddress,
      },
    })
    return Send.status201(res,"User created successfully",users)
})

router.delete("/:id", async (req:Request,res:Response) => {
    const {id} = req.params;
    if(!id){ return Send.status400(res, "User ID is required")}
    const users = await clerkClient.users.deleteUser(id)
    return Send.status200(res,"User deleted successfully",users)
})

export default router;
