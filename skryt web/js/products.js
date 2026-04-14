const products = [
  {
    id: "hoodie",
    name: "Skryt Signature Hoodie",
    name_es: "Sudadera Skryt Signature",
    price: 79.95,
    category: "Apparel",
    images: ["assets/images/hoodies_trio.png"],
    description: "Heavyweight premium cotton hoodie available in Black, Maroon, and Grey. Features a relaxed fit and dropped shoulders for the ultimate streetwear look.",
    description_es: "Sudadera de algodón premium de alto gramaje disponible en negro, granate и gris. Cuenta con un ajuste relajado y hombros caídos para el look streetwear definitivo.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: "balaklava",
    name: "Skryt Balaklava",
    name_es: "Pasamontañas Skryt",
    price: 44.95,
    category: "Headwear",
    images: ["assets/images/keffiyeh_model_red.png"],
    description: "Premium knit balaklava with signature Skryt script embroidery. Engineered for comfort and style in any urban environment.",
    description_es: "Pasamontañas de punto premium con bordado de la firma Skryt. Diseñado para ofrecer comodidad y estilo en cualquier entorno urbano.",
    sizes: ["OS"]
  },
  {
    id: "pants",
    name: "Skryt Cargo Pants",
    name_es: "Pantalones Cargo Skryt",
    price: 69.95,
    category: "Apparel",
    images: ["assets/images/pants_black.png"],
    description: "Heavyweight cotton trousers with reinforced stitching and utility pockets. Designed for the modern nomad.",
    description_es: "Pantalones de algodón de alto gramaje con costuras reforzadas и bolsillos utilitarios. Diseñado para el nómada moderno.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: "socks",
    name: "Logo Script Socks",
    name_es: "Calcetines Logo Script",
    price: 9.95,
    category: "Accessories",
    images: ["assets/images/socks_black_white.png"],
    description: "Durable ribbed cotton socks featuring the Skryt logo in high-contrast knit. Reinforced heel and toe for maximum longevity.",
    description_es: "Calcetines de algodón acanalado duraderos con el logotipo de Skryt en punto de alto contraste. Talón и puntera reforzados para una máxima longevidad.",
    sizes: ["S-M", "L-XL"]
  },
  {
    id: "keychain",
    name: "Skryt Mini Keychain",
    name_es: "Mini Llavero Skryt",
    price: 12.95,
    category: "Objects",
    images: ["assets/images/keychain_net.png"],
    description: "Polished metal keychain with laser-etched branding. A subtle statement piece for your everyday carry.",
    description_es: "Llavero de metal pulido con marca grabada con láser. Una pieza sutil para tu día a día.",
    sizes: ["OS"]
  },
  {
    id: "bag",
    name: "Tofu Suede Bag",
    name_es: "Bolso Tofu Suede",
    price: 99.95,
    category: "Bags",
    images: ["assets/images/bag_beige.png"],
    description: "Premium suede handbag in our signature Tofu colorway. Featuring an adjustable strap and internal compartments.",
    description_es: "Bolso de gamuza premium en nuestro color Tofu característico. Incluye una correa ajustable y compartimentos internos.",
    sizes: ["OS"]
  },
  {
    id: "belt",
    name: "Skryt Buckle Belt",
    name_es: "Cinturón de Hebilla Skryt",
    price: 49.95,
    category: "Accessories",
    images: ["assets/images/belt_black.png"],
    description: "Genuine leather belt with custom oversized Skryt script buckle. Add an edgy touch to any outfit.",
    description_es: "Cinturón de cuero genuino con hebilla de la firma Skryt de gran tamaño. Añade un toque atrevido a cualquier atuendo.",
    sizes: ["85", "90", "95", "100"]
  },
  {
    id: "glasses",
    name: "Onyx Sport Shades",
    name_es: "Gafas Onyx Sport",
    price: 79.95,
    category: "Jewelry",
    images: ["assets/images/glasses_onyx.png"],
    description: "Wrap-around aerodynamic sunglasses with UV400 protection. Sleek black finish with side logo detailing.",
    description_es: "Gafas de sol aerodinámicas envolventes con protección UV400. Elegante acabado negro con detalles del logo en los laterales.",
    sizes: ["OS"]
  },
  {
    id: "scarf",
    name: "Nomad Scarf",
    name_es: "Bufanda Nomad",
    price: 34.95,
    category: "Headwear",
    images: ["assets/images/scarves_duo.png"],
    description: "Lightweight woven scarf with classic geometric patterns. Versatile enough to be worn as a headwrap or traditional scarf.",
    description_es: "Bufanda de tejido ligero con patrones geométricos clásicos. Lo suficientemente versátil como para ser usada como envoltura para la cabeza o bufanda tradicional.",
    sizes: ["OS"]
  }
];

if (typeof window !== 'undefined') {
    window.skrytProducts = products;
}
