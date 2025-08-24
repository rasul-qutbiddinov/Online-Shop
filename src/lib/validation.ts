/* eslint-disable @typescript-eslint/no-explicit-any */
export const validateFirstName = (_: any, value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject("Пожалуйста, введите имя");
  }

  const regex = /^[A-Za-zА-Яа-яЁё\s'-]+$/;

  if (!regex.test(value)) {
    return Promise.reject(
      "Имя не должно содержать цифры или специальные символы",
    );
  }

  return Promise.resolve();
};

export const validateLastName = (_: any, value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject("Пожалуйста, введите фамилию");
  }

  const regex = /^[A-Za-zА-Яа-яЁё\s'-]+$/;

  if (!regex.test(value)) {
    return Promise.reject(
      "Фамилия не должна содержать цифры или специальные символы",
    );
  }

  return Promise.resolve();
};

export const validateId = (_: any, value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject("Пожалуйста, введите ID");
  }

  const regex = /^\d+$/;

  if (!regex.test(value)) {
    return Promise.reject("ID должен содержать только цифры");
  }

  return Promise.resolve();
};

export const validatePassword = (_: any, value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject("Пожалуйста, введите пароль");
  }

  if (value.length < 6) {
    return Promise.reject("Пароль должен быть не менее 6 символов");
  }

  return Promise.resolve();
};

export const validateEmailFormat = (_: any, value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject("Пожалуйста, введите электронную почту");
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    return Promise.reject("Неверный формат электронной почты");
  }

  return Promise.resolve();
};
