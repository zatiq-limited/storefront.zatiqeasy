"use client";

import { useState } from "react";

export const useCartFloat = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const openCartModal = () => {
    setShowCartModal(true);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleCartModal = () => {
    setShowCartModal(!showCartModal);
  };

  return {
    isCartOpen,
    showCartModal,
    openCart,
    closeCart,
    toggleCart,
    openCartModal,
    closeCartModal,
    toggleCartModal,
  };
};