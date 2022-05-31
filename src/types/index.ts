const orderTypes = ['ASC', 'DESC'] as const;

type Order = typeof orderTypes[number];

export const isOrderType = (type: any): type is Order =>
  orderTypes.includes(type);
