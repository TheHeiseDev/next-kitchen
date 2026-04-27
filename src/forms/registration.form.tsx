"use client";

import { registerUser } from "@/actions/register";
import { IFormData } from "@/types/form-data";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useState, useTransition } from "react";

interface IProps {
  onClose: () => void;
}

const RegistrationForm = ({ onClose }: IProps) => {
  const [formData, setFormData] = useState<IFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage,setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    startTransition(async () => {
      try {  
        await registerUser(formData);
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
        aria-label="First name"
        isRequired
        name="firstName"
        placeholder="Введите имя"
        type="text"
        value={formData.firstName}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none "
        }}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        validate={(value) => {
          if (!value?.trim()) return "Имя обязательно";
          return null;
        }}
      />
      <Input
        aria-label="Last name"
        isRequired
        name="lastName"
        placeholder="Введите фамилию"
        type="text"
        value={formData.lastName}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none "
        }}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        validate={(value) => {
          if (!value?.trim()) return "Фамилия обязательна";
          return null;
        }}
      />
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
          if (!validateEmail(value)) return "Некорректный email";
          return null;
        }}
      />
      <Input
        aria-label="Password"
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
          if (value.length < 6) return "Пароль должен быть не менее 6 символов";
          return null;
        }}
      />
      <Input
        isRequired
        aria-label="Confirm password"
        name="confirmPassword"
        placeholder="Подтвердите пароль"
        type="password"
        value={formData.confirmPassword}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none "
        }}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
        validate={(value) => {
          if (!value) return "Пароль для подтверждения обязателен";
          if (value !== formData.password) return "Пароли не совпадают";
          return null;
        }}
      />

    {errorMessage && <p className="text-red-400">{errorMessage}</p>}

      <div className="flex w-[100%]  gap-4 items-center pt-8 justify-end">
         <Button variant="light" onPress={onClose}>
          Отмена
        </Button>
        <Button  
          color="secondary"
          type="submit"
          isLoading={isPending}
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          Зарегестрироваться
        </Button>
      </div>
    </Form>
  );
};

export default RegistrationForm;