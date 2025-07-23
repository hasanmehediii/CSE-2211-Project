import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (car) => {
    if (!user) {
      return { success: false, message: 'Please log in to add items to cart.' };
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.car_id === car.car_id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.car_id === car.car_id
            ? { ...item, quantity: Math.min(item.quantity + 1, car.quantity) }
            : item
        );
      }
      return [...prevItems, { ...car, quantity: 1, maxQuantity: car.quantity }];
    });
    return { success: true, message: 'Car added to cart!' };
  };

  const removeFromCart = (carId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.car_id !== carId));
  };

  const updateQuantity = (carId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.car_id === carId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const submitOrder = async (orderDetails) => {
    if (!user) {
      return { success: false, message: 'Please log in to place an order.' };
    }
    try {
      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const purchaseResponse = await axios.post('http://localhost:8000/purchases/', {
        user_id: user.user_id,
        amount: totalAmount,
        payment_method: orderDetails.paymentMethod,
        status: 'pending',
        invoice_number: `INV-${Date.now()}`,
      });

      const orderResponse = await axios.post('http://localhost:8000/orders/', {
        purchase_id: purchaseResponse.data.purchase_id,
        shipping_address: orderDetails.shippingAddress,
        status: 'processing',
        expected_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      });

      for (const item of cartItems) {
        await axios.post('http://localhost:8000/order_items/', {
          order_id: orderResponse.data.order_id,
          car_id: item.car_id,
          quantity: item.quantity,
          price_at_order: item.price,
        });

        await axios.patch(`http://localhost:8000/car_inventory/${item.car_id}`, {
          quantity: item.maxQuantity - item.quantity,
        });
      }

      clearCart();
      return {
        success: true,
        message: 'Order placed successfully!',
        purchaseId: purchaseResponse.data.purchase_id,
      };
    } catch (error) {
      console.error('Failed to submit order:', error);
      return { success: false, message: 'Failed to place order. Please try again.' };
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, submitOrder, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};