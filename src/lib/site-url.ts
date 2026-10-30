/** Public paths follow Vite's base; Lovable keeps its default root base. */
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const productionUrl = (path = "") =>
  `https://engeteles.com.br/black-livros/${path.replace(/^\/+/, "")}`;
