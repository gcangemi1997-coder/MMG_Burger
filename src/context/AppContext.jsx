import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // AGGIUNGO GLI STATI ESISTENTI
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);

  // 🌟 METTIAMO I PANINI DIRETTAMENTE QUI DENTRO COME "DATI INIZIALI"
  const [products, setProducts] = useState([
    {
      _id: "b1",
      name: "🍔 MMG Classic",
      ingredients: "Manzo 150g, Cheddar, Lattuga, Pomodoro, Salsa Segreta MMG",
      price: 8.5,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "b2",
      name: "🔥 MMG Spicy BBQ",
      ingredients: "Manzo 150g, Bacon Croccante, Jalapeños, Cheddar, Salsa BBQ",
      price: 9.5,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "b3",
      name: "🥑 MMG Veggie Green",
      ingredients:
        "Burger di Ceci e Zucchine, Avocado, Maionese Vegana, Rucola",
      price: 9.0,
      image:
        "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500&auto=format&fit=crop&q=60",
    },
    {
      _id: "b4",
      name: "👑 MMG King Bacon",
      ingredients:
        "Doppio Manzo (300g), Triplo Bacon, Formaggio Fuso, Cipolla Caramellata",
      price: 13.0,
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60",
    },
  ]);

  // Visto che i dati sono già presenti all'avvio, il caricamento è istantaneo (false)
  const [loadingProducts, setLoadingProducts] = useState(false);

  // CONTROLLO INIZIALE UTENTE (Manteniamo intatta la tua logica del LocalStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("mmg_user");
    const storedToken = localStorage.getItem("mmg_token");

    if (storedUser && storedToken) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // FUNZIONI DI AUTENTICAZIONE
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("mmg_user", JSON.stringify(userData));
    localStorage.setItem("mmg_token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("mmg_user");
    localStorage.removeItem("mmg_token");
  };

  // FUNZIONI DEL CARRELLO
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i._id === productId);
      if (!item) return prevCart;

      if (item.quantity === 1) {
        return prevCart.filter((i) => i._id !== productId);
      }
      return prevCart.map((i) =>
        i._id === productId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        cart,
        login,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
        products, // Consegniamo i panini alla Home
        loadingProducts, // Sarà sempre false, quindi niente attese
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
