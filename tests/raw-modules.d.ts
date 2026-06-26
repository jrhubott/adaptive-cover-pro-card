// Ambient type for Vite/Vitest `?raw` imports (file contents as a string).
declare module '*?raw' {
  const content: string;
  export default content;
}
