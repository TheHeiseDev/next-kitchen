"use client";

import { signInWithCredentials } from "@/actions/sign-in";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useState, useTransition } from "react";

interface IProps {
  onClose: () => void;
  onForgotPassword: () => void;
}

const LoginForm = ({ onClose, onForgotPassword }: IProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    startTransition(async () => {
      try {
        await signInWithCredentials(formData.email, formData.password);
       
        window.location.reload();
    
        onClose();
      } catch (error: unknown) { 
        if(error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
          setErrorMessage(error.message);
        }else {
          setErrorMessage('Неизвестная ошибка');
        }
      }
    })
  };

  return (
    <Form className="w-full" onSubmit={handleSubmit}>
      <Input
        aria-label="Email"
        isRequired
        name="email"
        placeholder="Введите email"
        type="email"
        value={formData.email}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none "
        }}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        validate={(value) => {
          if (!value) return "Почта обязательна";
          return null;
        }}
      />
      <Input
        isRequired
        name="password"
        placeholder="Введите пароль"
        type="password"
        value={formData.password}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none "
        }}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        validate={(value) => {
          if (!value) return "Пароль обязателен";
          return null;
        }}
      />

      <Button variant="light" className="w-full justify-start px-0" onPress={onForgotPassword}>
        Забыли пароль?
      </Button>

        {errorMessage && <p className="text-red-400">{errorMessage}</p>}
      <div className="flex w-full  gap-4 items-center pt-5 justify-end">
        <Button variant="light" onPress={onClose}>
          Отмена
        </Button>
        <Button  
          color="secondary"
          type="submit"
          isLoading={isPending}
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          Войти
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;