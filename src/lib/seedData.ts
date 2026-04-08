import { collection, addDoc, getDocs, query, limit, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

const products = [
  {
    name: 'Whey Protein Isolate',
    description: 'Ultra-pure whey protein isolate for rapid muscle recovery. Each serving provides 25g of high-quality protein with minimal fats and carbs. Perfect for post-workout nutrition.\n\n### Benefits\n- 25g Protein per serving\n- Low Fat & Low Carb\n- Fast Absorption\n- Great Taste',
    price: 59.99,
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1593095191850-2a733009e0bb?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 124,
    stock: 50,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Pre-Workout Energy',
    description: 'Explosive energy and focus for your most intense workouts. Contains Beta-Alanine, Caffeine, and L-Citrulline for maximum pump and endurance.\n\n### Key Ingredients\n- 300mg Caffeine\n- 3.2g Beta-Alanine\n- 6g L-Citrulline',
    price: 34.99,
    category: 'Pre-workout',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviewsCount: 89,
    stock: 30,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Daily Multivitamin',
    description: 'Complete daily multivitamin designed for active individuals. Supports immune system, energy levels, and overall health with 20+ essential vitamins and minerals.',
    price: 24.99,
    category: 'Vitamins',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 210,
    stock: 100,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Creatine Monohydrate',
    description: 'Pure micronized creatine monohydrate for increased strength and power. The most researched supplement in fitness history.\n\n### Why Creatine?\n- Increase Strength\n- Improve Muscle Volume\n- Enhance Recovery',
    price: 29.99,
    category: 'Creatine',
    image: 'https://images.unsplash.com/photo-1593095191850-2a733009e0bb?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewsCount: 156,
    stock: 75,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Mass Gainer Pro',
    description: 'High-calorie mass gainer for hardgainers. Packed with complex carbs and protein to help you pack on size and strength.',
    price: 49.99,
    category: 'Mass Gainers',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    reviewsCount: 67,
    stock: 25,
    isBestSeller: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'BCAA Recovery',
    description: 'Branched-chain amino acids to support muscle recovery and prevent breakdown during fasted training.',
    price: 27.99,
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    rating: 4.4,
    reviewsCount: 45,
    stock: 40,
    createdAt: '2026-04-01T10:00:00Z'
  },
  {
    name: 'Ashwagandha Extract',
    description: 'High-potency Ashwagandha extract to support stress management and cognitive function. Standardized to 5% withanolides for maximum effectiveness.',
    price: 19.99,
    category: 'Herbs',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 156,
    stock: 60,
    createdAt: '2026-04-02T10:00:00Z'
  },
  {
    name: 'Turmeric Curcumin',
    description: 'Advanced Turmeric Curcumin with BioPerine for enhanced absorption. Supports joint health and healthy inflammatory response.',
    price: 22.99,
    category: 'Herbs',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewsCount: 92,
    stock: 45,
    createdAt: '2026-04-03T10:00:00Z'
  },
  {
    name: 'Omega-3 Fish Oil',
    description: 'Triple strength Omega-3 fish oil for heart, brain, and joint health. Burpless formula with high EPA and DHA content.',
    price: 26.99,
    category: 'Supplements',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 312,
    stock: 80,
    createdAt: '2026-04-04T10:00:00Z'
  },
  {
    name: 'ZMA Night Recovery',
    description: 'Scientifically formulated blend of Zinc, Magnesium, and Vitamin B6 to support recovery and sleep quality.',
    price: 21.99,
    category: 'Supplements',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviewsCount: 74,
    stock: 55,
    createdAt: '2026-04-05T10:00:00Z'
  },
  {
    name: 'Premium Shaker Bottle',
    description: 'Durable, leak-proof shaker bottle with a stainless steel mixing ball. Perfect for smooth protein shakes on the go.',
    price: 14.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1593095191850-2a733009e0bb?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 450,
    stock: 200
  },
  {
    name: 'Pro Lifting Straps',
    description: 'Heavy-duty cotton lifting straps for improved grip strength during heavy pulls and deadlifts.',
    price: 12.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewsCount: 128,
    stock: 150
  },
  {
    name: 'Resistance Bands Set',
    description: 'Set of 5 high-quality latex resistance bands for home workouts and mobility training.',
    price: 24.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewsCount: 310,
    stock: 85
  },
  {
    name: 'Men\'s Daily Multivitamin',
    description: 'Specifically formulated for men\'s health needs, including prostate support and energy metabolism.',
    price: 25.99,
    category: 'Vitamins',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 185,
    stock: 120
  },
  {
    name: 'Women\'s Daily Multivitamin',
    description: 'Tailored for women\'s health, featuring iron, folic acid, and bone support nutrients.',
    price: 25.99,
    category: 'Vitamins',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewsCount: 192,
    stock: 115
  }
];

export const seedDatabase = async () => {
  const productsRef = collection(db, 'products');
  try {
    console.log('Checking for existing products to seed...');
    const snapshot = await getDocs(productsRef);
    const existingProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const existingNames = new Set(existingProducts.map((p: any) => p.name));
    
    let addedCount = 0;
    let updatedCount = 0;

    for (const product of products) {
      const existing = existingProducts.find((p: any) => p.name === product.name) as any;
      
      if (!existing) {
        console.log(`Seeding new product: ${product.name}`);
        const docRef = await addDoc(productsRef, {
          ...product,
          createdAt: product.createdAt || new Date().toISOString()
        });
        addedCount++;
        
        // Add some sample reviews for each product
        const reviewsRef = collection(db, 'products', docRef.id, 'reviews');
        await addDoc(reviewsRef, {
          userName: 'John Doe',
          userId: 'sample-user-1',
          productId: docRef.id,
          rating: 5,
          comment: 'Amazing product! Really helped with my recovery.',
          createdAt: new Date().toISOString()
        });
      } else if (product.isBestSeller && !existing.isBestSeller) {
        // Update existing product to be a best seller if it's not already
        console.log(`Updating existing product to Best Seller: ${product.name}`);
        const docRef = doc(db, 'products', existing.id);
        await updateDoc(docRef, { isBestSeller: true });
        updatedCount++;
      }

      // Ensure createdAt exists for all products
      if (existing && !existing.createdAt) {
        const docRef = doc(db, 'products', existing.id);
        await updateDoc(docRef, { createdAt: product.createdAt || new Date().toISOString() });
      }
    }
    
    if (addedCount > 0 || updatedCount > 0) {
      console.log(`Successfully added ${addedCount} new products and updated ${updatedCount} existing products.`);
    } else {
      console.log('Database already seeded and up to date. No changes made.');
    }
  } catch (error: any) {
    console.error('Seeding error details:', error);
    if (error.code === 'permission-denied') {
      console.warn('Seeding skipped: Missing permissions. Only admins can seed the database.');
    } else {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  }
};
