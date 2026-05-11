export const getWishlist = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("wishlist") || "[]")
}

export const addToWishlist = (product: any) => {
  const wishlist = getWishlist()

  const exists = wishlist.find((item: any) => item.id === product.id)

  if (!exists) {
    wishlist.push({
      ...product,
      quantity: product.quantity && product.quantity > 0 ? product.quantity : 1,
    })
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }

  return wishlist
}

export const updateWishlistQuantity = (id: string, quantity: number) => {
  const wishlist = getWishlist().map((item: any) =>
    item.id === id
      ? { ...item, quantity: Math.max(1, quantity) }
      : item,
  )
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  return wishlist
}

export const removeFromWishlist = (id: string) => {
  const wishlist = getWishlist().filter((item: any) => item.id !== id)
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  return wishlist
}

export const isInWishlist = (id: string) => {
  const wishlist = getWishlist()
  return wishlist.some((item: any) => item.id === id)
}