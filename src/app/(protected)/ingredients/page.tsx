import { Metadata } from 'next';
import IngredientForm from '@/forms/ingredient.form';
import IngredientsTable from '@/components/UI/tables/Ingredients';

export const metadata: Metadata = {
  title: 'Ингридиенты',
  description: '',
};

const IngredientsPage = () => {
  return (
    <div>
      <IngredientForm/>
      <IngredientsTable/>
    </div>
  )
}

export default IngredientsPage;