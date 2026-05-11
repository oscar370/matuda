export const COLOR_SCHEMAS = [
  { value: "scheme-content", label: "Content" },
  { value: "scheme-expressive", label: "Expressive" },
  { value: "scheme-fidelity", label: "Fidelity" },
  { value: "scheme-fruit-salad", label: "Fruit Salad" },
  { value: "scheme-monochrome", label: "Monochrome" },
  { value: "scheme-neutral", label: "Neutral" },
  { value: "scheme-rainbow", label: "Rainbow" },
  { value: "scheme-tonal-spot", label: "Tonal Spot" },
  { value: "scheme-vibrant", label: "Vibrant" },
] as const;

export const RESIZE_FILTERS = [
  { value: "nearest", label: "Nearest" },
  { value: "triangle", label: "Triangle" },
  { value: "catmull-rom", label: "Catmull-Rom" },
  { value: "gaussian", label: "Gaussian" },
  { value: "lanczos3", label: "Lanczos3" },
] as const;
