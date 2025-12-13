import { prisma, Prisma } from "@repo/database";
import { Send } from "@repo/response";
import { Request, Response } from "express";

export const createCategory = async (req:Request,res:Response) => {
    const data:Prisma.CategoryCreateInput = req.body;
    const existingCategory = await prisma.category.findUnique({
        where:{slug:data.slug}
    });
    if(existingCategory){
        return Send.status400(res, 'Category already exists')
    }
    const category = await prisma.category.create({data});
    return Send.status201(res, 'Category created succesfully',category)
};

export const updateCategory = async (req:Request,res:Response) => {
    const {id} = req.params;
    const data:Prisma.CategoryUpdateInput = req.body;
    const updatedCategory = await prisma.category.update({
        where:{id:Number(id)},
        data,
    })
    return Send.status200(res, 'Category updated succesfully',updatedCategory)
};

export const deleteCategory = async (req:Request,res:Response) => {
    const {id} = req.params;
    const category = await prisma.category.delete({
        where:{id:Number(id)}
    })
    return Send.status200(res, 'Category deleted succesfully',category)
};

export const getAllCategory = async (req:Request,res:Response) => {
    const categories = await prisma.category.findMany();
    return Send.status200(res, 'Categories fetched succesfully',categories)
};



