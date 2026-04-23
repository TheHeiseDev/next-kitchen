import type { IIngredient } from "@/types/ingredient";
import { create } from "zustand";
import { createIngredient, deleteIngredient, getIngredients } from "@/actions/ingredients";


interface IngredientsStore {
    ingredients: IIngredient[]
    isLoading: boolean,
    error: string | null,
    loadIngredients: () => Promise<void>,
    addIngredient: (formData: FormData) => Promise<void>,
    removeIngredinet: (id: string) => Promise<void>,
}

export const useIngredientsStore = create<IngredientsStore>((set) => ({
    ingredients: [],
    isLoading: false,
    error: null,
    loadIngredients: async () => {
        set({ isLoading: true, error: null });
    
        try {
          const result = await getIngredients();
    
          if (result.success) {
            set({ ingredients: result.ingredients, isLoading: false });
          } else {
            set({ error: result.error, isLoading: false });
          }
        } catch (error) {
          console.error("error", error);
          set({ error: "Ошибка при загрузке ингредиентов", isLoading: false });
        }
      },
    addIngredient: async (formData: FormData) => {
      set({isLoading: true, error: null});

      try {
        const {success, ingredient, error} = await createIngredient(formData);

        if(success) {
            set((state) => {
                return {
                    ingredients: [...state.ingredients, ingredient],
                    isLoading: false
                }
            })
        } else {
            set({error, isLoading: false})
        }
      } catch (error) {
        console.log("Ошибка при добалении ингредента", error)
        set({error: "Ошибка при добалении ингредента", isLoading: false})
      }
    },
    removeIngredinet: async (id: string) => {
        set({isLoading: true, error: null});

        try {
            const {error, success} = await  deleteIngredient(id);

            if(success) {
                set((state) => {
                    return {
                        ingredients: state.ingredients.filter((ingredient) => ingredient.id !== id),
                        isLoading: false
                    }
                })
            } else {
                set({error, isLoading: false})
            }

        } catch (error) {
            console.log("Ошибка при удалении ингредента", error)
            set({error: "Ошибка при удалении ингредента", isLoading: false})
        }
    },
}))