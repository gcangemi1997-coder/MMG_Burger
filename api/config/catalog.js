export const AUTHORIZED_PRODUCTS = [
  {
    _id: "b1",
    name: "MMG Classic",
    price: 8.5,
    ingredients: "Manzo 150g, Cheddar, Lattuga, Pomodoro, Salsa Segreta MMG",
  },
  {
    _id: "b2",
    name: "MMG Spicy BBQ",
    price: 9.5,
    ingredients: "Manzo 150g, Bacon Croccante, Jalapeños, Cheddar, Salsa BBQ",
  },
  {
    _id: "b3",
    name: "MMG Veggie Green",
    price: 9.0,
    ingredients: "Burger di Ceci e Zucchine, Avocado, Maionese Vegana, Rucola",
  },
  {
    _id: "b4",
    name: "MMG King Bacon",
    price: 13.0,
    ingredients:
      "Doppio Manzo (300g), Triplo Bacon, Formaggio Fuso, Cipolla Caramellata",
  },
];

export const PRODUCT_CATALOG = Object.fromEntries(
  AUTHORIZED_PRODUCTS.map((product) => [product._id, product]),
);
