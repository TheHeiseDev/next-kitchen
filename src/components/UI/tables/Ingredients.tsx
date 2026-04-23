'use client'

import { Button } from "@heroui/button";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { useAuthStore } from "@/store/auth.store";
import { useIngredientsStore } from "@/store/ingredients.store";
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/constants/select-options";

const IngredientsTable = () => {
    const { ingredients, removeIngredinet, isLoading } = useIngredientsStore();
    const { isAuth } = useAuthStore();

    const handleDelete = async  (id: string) => {
        await removeIngredinet(id)
    }

    const getCategoryLabel = (value: string) => {
        const option = CATEGORY_OPTIONS.find((opt) => opt.value === value);
        return option?.label || value;
    }

    const getUnitLabel = (value: string) => {
        const option = UNIT_OPTIONS.find((opt) => opt.value === value);
        return option?.label || value;
    }

    return !isLoading && isAuth ?  (
        <Table
        aria-label="Ингредиенты"
        classNames={{
            wrapper: "mt-4",
            table: "w-full",
            th: "text-white",
            td: "text-white"
        }}
        >
            <TableHeader>
                <TableColumn>Название</TableColumn>
                <TableColumn>Категория</TableColumn>
                <TableColumn>Ед. изм.</TableColumn>
                <TableColumn>Цена за единицу</TableColumn>
                <TableColumn>Описание</TableColumn>
                <TableColumn>Действие</TableColumn>
            </TableHeader>
            <TableBody>
                {ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                        <TableCell>{ingredient.name}</TableCell>
                        <TableCell>{getCategoryLabel(ingredient.category)}</TableCell>
                        <TableCell>{getUnitLabel(ingredient.unit)}</TableCell>
                        <TableCell>{
                            ingredient.pricePerUnit !== null 
                            ? `${ingredient.pricePerUnit} ₽`
                            : '—'
                            }</TableCell>
                        <TableCell>{ingredient.description}</TableCell>
                        <TableCell>
                            <Button
                            color="danger"
                            size="sm"
                            onPress={()=> handleDelete(ingredient.id)}
                            >Удалить</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    ) : <p className="mt-4 text-white">Загрузка...</p>;
}
 
export default IngredientsTable;