"use client";

import { useState, useTransition } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { requestPasswordReset } from "@/actions/request-password-reset";
import { confirmPasswordReset } from "@/actions/confirm-password-reset";

interface IProps {
  onClose: () => void;
}

const PasswordResetForm = ({ onClose }: IProps) => {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    startTransition(async () => {
      try {
        const result = await requestPasswordReset(email);
        setInfoMessage(result.message);
        setStep("confirm");
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
          return;
        }

        setErrorMessage("Не удалось отправить код");
      }
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    startTransition(async () => {
      try {
        const result = await confirmPasswordReset({
          email,
          code,
          newPassword,
          confirmPassword
        });

        setInfoMessage(result.message);
        onClose();
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
          return;
        }

        setErrorMessage("Не удалось обновить пароль");
      }
    });
  };

  if (step === "request") {
    return (
      <Form className="w-full" onSubmit={handleRequestCode}>
        <Input
          aria-label="Email"
          isRequired
          name="email"
          placeholder="Введите email"
          type="email"
          value={email}
          classNames={{
            inputWrapper: "bg-default-100",
            input: "text-sm focus:outline-none "
          }}
          onChange={(e) => setEmail(e.target.value)}
        />

        {infoMessage && <p className="text-green-500">{infoMessage}</p>}
        {errorMessage && <p className="text-red-400">{errorMessage}</p>}

        <div className="flex w-full gap-4 items-center pt-5 justify-end">
          <Button variant="light" onPress={onClose}>
            Отмена
          </Button>
          <Button
            color="secondary"
            type="submit"
            isLoading={isPending}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Отправить код
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <Form className="w-full" onSubmit={handleResetPassword}>
      <Input
        aria-label="Email"
        isRequired
        name="email"
        placeholder="Введите email"
        type="email"
        value={email}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none "
        }}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        aria-label="Code"
        isRequired
        name="code"
        placeholder="Код из письма"
        value={code}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none "
        }}
        onChange={(e) => setCode(e.target.value)}
      />
      <Input
        aria-label="New password"
        isRequired
        name="newPassword"
        placeholder="Новый пароль"
        type="password"
        value={newPassword}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none "
        }}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        aria-label="Confirm password"
        isRequired
        name="confirmPassword"
        placeholder="Подтвердите новый пароль"
        type="password"
        value={confirmPassword}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm focus:outline-none "
        }}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {infoMessage && <p className="text-green-500">{infoMessage}</p>}
      {errorMessage && <p className="text-red-400">{errorMessage}</p>}

      <div className="flex w-full gap-4 items-center pt-5 justify-end">
        <Button variant="light" onPress={() => setStep("request")}>
          Назад
        </Button>
        <Button
          color="secondary"
          type="submit"
          isLoading={isPending}
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Сбросить пароль
        </Button>
      </div>
    </Form>
  );
};

export default PasswordResetForm;
