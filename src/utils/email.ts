import { Resend } from "resend";
import { PASSWORD_RESET_TTL_MINUTES } from "@/utils/password-reset";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

const getResendClient = () => {
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY не настроен");
  }

  return new Resend(resendApiKey);
};

export const sendPasswordResetCodeEmail = async (to: string, code: string) => {
  if (!resendFromEmail) {
    throw new Error("RESEND_FROM_EMAIL не настроен");
  }

  const resend = getResendClient();

  try {
    const result = await resend.emails.send({
      from: resendFromEmail,
      to,
      subject: "Код восстановления пароля",
      text: `Ваш код для восстановления пароля: ${code}. Код действует ${PASSWORD_RESET_TTL_MINUTES} минут.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Восстановление пароля</h2>
          <p>Ваш код для восстановления пароля:</p>
          <p style="font-size: 24px; font-weight: 700; letter-spacing: 6px;">${code}</p>
          <p>Код действует ${PASSWORD_RESET_TTL_MINUTES} минут.</p>
        </div>
      `
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    const resendError = error as Error & {
      name?: string;
      statusCode?: number;
    };

    const details = [
      resendError.name ? `name=${resendError.name}` : null,
      resendError.statusCode ? `statusCode=${resendError.statusCode}` : null,
      resendError.message ? `message=${resendError.message}` : null
    ]
      .filter(Boolean)
      .join(", ");

    throw new Error(`Resend send failed: ${details || "unknown error"}`);
  }
};
