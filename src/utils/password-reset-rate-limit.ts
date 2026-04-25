import {
  PASSWORD_RESET_ATTEMPT_WINDOW_MINUTES,
  PASSWORD_RESET_MAX_ATTEMPTS
} from "@/utils/password-reset";

type AttemptState = {
  attempts: number;
  firstAttemptAt: number;
};

const attemptsStore = new Map<string, AttemptState>();

export const registerPasswordResetAttempt = (email: string) => {
  const key = email.toLowerCase();
  const now = Date.now();
  const windowMs = PASSWORD_RESET_ATTEMPT_WINDOW_MINUTES * 60 * 1000;
  const state = attemptsStore.get(key);

  if (!state || now - state.firstAttemptAt > windowMs) {
    attemptsStore.set(key, { attempts: 1, firstAttemptAt: now });
    return { blocked: false, remaining: PASSWORD_RESET_MAX_ATTEMPTS - 1 };
  }

  if (state.attempts >= PASSWORD_RESET_MAX_ATTEMPTS) {
    return { blocked: true, remaining: 0 };
  }

  state.attempts += 1;
  attemptsStore.set(key, state);

  return { blocked: false, remaining: PASSWORD_RESET_MAX_ATTEMPTS - state.attempts };
};

export const clearPasswordResetAttempts = (email: string) => {
  attemptsStore.delete(email.toLowerCase());
};
