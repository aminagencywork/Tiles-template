export const siteConfig = {
  name: "Luxe Marble",
  description: "Premium Marble & Stone Tiles for Elegant Spaces",
  adminPassword: "admin123", // Moved from .env as requested
  whatsapp: {
    number: "+917758846111", // Replace with actual shop number
    message: "Hello! I'm interested in ordering the following products:"
  },
  imageKit: {
    urlEndpoint: "https://ik.imagekit.io/your_id", // Replace with actual ImageKit ID
    publicKey: "your_public_key",
  },
  contact: {
    address: "123 Stone Avenue, Quarry District, Marble City, MC 54321",
    phone: "+1 (555) 123-4567",
    email: "info@luxemarble.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194154846816!3d37.77492957975948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1625161000000!5m2!1sen!2sus"
  },
  hero: {
    slides: [
      {
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920",
        title: "Timeless Elegance in Every Slab",
        subtitle: "Discover our exclusive collection of Italian Carrara and Calacatta marble."
      },
      {
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920",
        title: "Modern Stone Solutions",
        subtitle: "Premium tiles designed for contemporary living spaces and commercial projects."
      }
    ]
  },
  categories: [
    { id: 'marble', name: 'Marble', image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=800' },
    { id: 'granite', name: 'Granite', image: 'https://images.unsplash.com/photo-1590059530470-369400266028?auto=format&fit=crop&q=80&w=800' },
    { id: 'quartz', name: 'Quartz', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800' },
    { id: 'travertine', name: 'Travertine', image: 'https://images.unsplash.com/photo-1523413363574-c3c44b91d8a2?auto=format&fit=crop&q=80&w=800' }
  ],
  products: [
    {
      id: 1,
      name: "Carrara White Marble",
      category: "marble",
      price: "₹45/sqft",
      image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=800",
      articleModel: "Classic Italian marble with soft grey veining."
    },
    {
      id: 2,
      name: "Black Galaxy Granite",
      category: "granite",
      price: "₹38/sqft",
      image: "https://images.unsplash.com/photo-1590059530470-369400266028?auto=format&fit=crop&q=80&w=800",
      articleModel: "Deep black stone with golden copper flecks."
    },
    {
      id: 3,
      name: "Calacatta Gold",
      category: "marble",
      price: "₹85/sqft",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      articleModel: "Luxurious white marble with bold gold veining."
    },
    {
      id: 4,
      name: "Silver Travertine",
      category: "travertine",
      price: "₹32/sqft",
      image: "https://images.unsplash.com/photo-1523413363574-c3c44b91d8a2?auto=format&fit=crop&q=80&w=800",
      articleModel: "Natural stone with unique linear patterns."
    }
  ]
};
