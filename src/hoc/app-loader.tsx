"use client"

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth.store";
import { useIngredientsStore } from "@/store/ingredients.store";
import { useRecipeStore } from "@/store/recipe.store";

interface IProps {
    children: React.ReactNode
}

const AppLoader = ({children}: IProps) => {
    const { data: session, status } = useSession();
    const { loadIngredients } = useIngredientsStore();
    const { setAuthState, isAuth } = useAuthStore();
    const { loadRecipes } = useRecipeStore();
    
    useEffect(() => {
        setAuthState(status, session);
    }, [session, status, setAuthState])

    useEffect(() => {
        if (isAuth) {
          loadIngredients();
        }
    }, [isAuth, loadIngredients])

    useEffect(() => {
        loadRecipes()
    }, [loadRecipes])

    return <>{children}</>
}
 
export default AppLoader;