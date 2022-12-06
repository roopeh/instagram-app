// Returns shortened values for values over 1000 (i.e. 46700 => 46.7k)
// eslint-disable-next-line import/prefer-default-export
export const beautifyBigNumber = (like: number): string => (like >= 1000
  ? `${Math.sign(like) * Number((like / 1000).toFixed(1))}k`
  : like.toString());
