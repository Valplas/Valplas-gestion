import { BusinessOptions, ProductModel } from "../../types/product.type";

// Función para generar un producto aleatorio
const generateProduct = (index: number): ProductModel => ({
  productID: String(index),
  name: `Producto ${index + 1}`,
  business: Math.random() > 0.5 ? BusinessOptions.Valplas : null, // Nullable
  description: `Descripción del producto ${index + 1}`,
  manufacturer: Math.random() > 0.5 ? `Fabricante ${index + 1}` : null,
  weightKg: Math.random() > 0.5 ? +(Math.random() * 10).toFixed(2) : null,
  width: Math.random() > 0.5 ? +(Math.random() * 50).toFixed(2) : null,
  long: Math.random() > 0.5 ? +(Math.random() * 50).toFixed(2) : null,
  height: Math.random() > 0.5 ? +(Math.random() * 50).toFixed(2) : null,
  origin: Math.random() > 0.5 ? `País ${index + 1}` : null,
  code: 1000 + index,
  container: Math.random() > 0.5, // Aleatorio entre true y false
  productIdRelated: Math.random() > 0.5 ? String(index) : null,
  quantity: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : null, // Valor entre 0 y 100 o null
});

// Generar un array de 15 productos
const products: ProductModel[] = Array.from({ length: 15 }, (_, index) => generateProduct(index));

console.log(products); // Para visualizar los datos generados

export default products;
