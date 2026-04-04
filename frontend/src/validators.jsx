export const esEmailValido = (email) => /^\S+@\S+\.\S+$/.test(email);

export const esPasswordValida = (pwd) => pwd.length >= 6;

export const esUsernameValido = (u) => /^[a-z0-9_.-]+$/i.test(u) && u.length >= 3;