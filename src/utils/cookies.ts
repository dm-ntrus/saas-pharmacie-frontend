export const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax; ${
    process.env.NODE_ENV === "production" ? "Secure;" : ""
  }`;
};

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
};
