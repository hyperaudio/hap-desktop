export const formatTime = (t: number) => {
  return new Date(t * 1000).toISOString().slice(14, 19);
};
