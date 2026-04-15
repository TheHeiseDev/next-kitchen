"use client"

import { Button } from '@heroui/button';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[100%]">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Страница не найдена</p>
      
      <Button as={Link} color='primary' variant='shadow' href='/'
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Вернуться на главную
      </Button>
    </div>
  )
}

export default NotFoundPage;