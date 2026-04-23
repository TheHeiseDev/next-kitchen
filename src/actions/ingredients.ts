"use server"

import { ZodError } from "zod"
import { ingredientSchema } from "@/schema/zod"
import prisma from "@/utils/prisma"

export const createIngredient = async (formdata: FormData) => {
    try {
        const data = {
            name: formdata.get('name') as string,
            category: formdata.get('category') as string,
            unit: formdata.get('unit') as string,
            pricePerUnit: formdata.get('pricePerUnit') 
            ? parseFloat(formdata.get('pricePerUnit') as string)
            : null,
            description: formdata.get('description') as string
        }

        const validateData = ingredientSchema.parse(data)

        const ingredient = await prisma.ingredient.create({
            data: {
                name: validateData.name,
                category: validateData.category,
                unit: validateData.unit,
                pricePerUnit: validateData.pricePerUnit,
                description: validateData.description,
            }
        })

        return { success: true, ingredient }
    } catch (error) {
        if(error instanceof ZodError) return { error: error.message }

        console.log('Ошибка при создании ингредиента', error);
        return { error: "Ошибка при создании ингредиента" }
    }
}

export const getIngredients = async () => {
    try {
        const ingredients = await prisma.ingredient.findMany();

        return { success: true, ingredients }

    } catch (error) {
        console.log('Ошибка при получении ингредиентов', error);
        return { error: "Ошибка при получении ингредиентов" }
    }
}

export const deleteIngredient = async (id: string) => {
    try {
        const ingredient = await prisma.ingredient.delete({where: {id}});

        return { success: true, ingredient }

    } catch (error) {
        console.log('Ошибка при удалении ингреидиента', error);
        return { error: "Ошибка при удалении ингредиента" }
    }
}