import { PrismaClient, Role, PropertyStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.analyticsEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Sarah Connor',
      email: 'admin@xyzhomes.com',
      passwordHash,
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  });

  const agent = await prisma.user.create({
    data: {
      name: 'Julian Vance',
      email: 'agent@xyzhomes.com',
      passwordHash,
      role: Role.AGENT,
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      name: 'Marcus Richardson',
      email: 'marcus@xyzhomes.com',
      passwordHash,
      role: Role.AGENT,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
  });

  const buyer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'user@xyzhomes.com',
      passwordHash,
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  console.log('Users seeded successfully');

  // Create Properties
  const p1 = await prisma.property.create({
    data: {
      title: 'The Glass Pavilion',
      description: 'Redefining modern luxury, The Glass Pavilion is an architectural tour de force situated on one of Beverly Hills\' most prestigious ridgelines. Designed with an emphasis on seamless indoor-outdoor living, the residence features massive automated glass walls that vanish into the structure, opening the home to panoramic canyon and ocean views. Every material has been meticulously curated, from the imported Italian stone to the custom white oak millwork.',
      price: 12450000,
      location: 'Beverly Hills, CA',
      address: '1240 Oak Ridge Road',
      city: 'Beverly Hills',
      state: 'California',
      country: 'USA',
      latitude: 34.07362,
      longitude: -118.400356,
      bedrooms: 5,
      bathrooms: 6.5,
      area: 8200,
      type: 'Villa',
      status: PropertyStatus.FOR_SALE,
      featured: true,
      amenities: ['Zero-edge Infinity Pool', '12-Seat Dolby Atmos Cinema', '1,500 Bottle Climate Controlled Cellar', '6-Car Gallery Garage', 'Wellness Center & Dry Sauna', 'Savant Smart Home Integration'],
      agentId: agent.id,
      images: {
        create: [
          { imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArM6tnyoD0IJooZr0_XzuS7VyzN_5MxgmqqsDFKH5rMbiQMyAHgVgSyEUzjWSPKRZT22Yu7HNuJkcnyr1LM-TV0dJ70NaPDbtmVaL2XteCVaaF1xrsDTH8q2BDwiPp3z-ihe7_lyTvZQyNiLIbYhBfXcLJ8914dFFd0YulY0vQz-cn3VDcU_r3FUcDXwBnw2M-8MO8IBT5xgxRfZvmPU5iIJeQQDpXBhIxoF4fnZrLt8ofnO5rXc3SkXz1AfSlPJrpRtztUWNDqa0' },
          { imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqQSKHYEyw3BAMmZJ_qOWjtiwUvF4qEtJD-bvS3J56iosaB3Tmp2la3JbMC8EQjohXKaqMIu_ISc36bSXFjh8aCpvLJ850DCi8ghUBF_FfPBc6ZvOGuy7CIr9bOPiUTiNXogvT24egbpDUml-dS-ja_lXuc6uiTcKLo8IlzN0Ua0JX5TLevFEu5_Fxb8IVWkTOqCcvSUpVF2h6zRKQYM9skpCXCfpEhkgQuYbgsvjAdrdU_fIBbB_Zs95sQY7IQn0sbF2bXfSQESg' },
          { imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChQ9zo4oJTqK0nDsOSsQ8q7CW9IRnygQXbUCWo_AjKC6485SRySsnzYEziXvbHWIz8Jmxf8s5o3hQFTu2ll6u47O0qOQjYESq2JwUO4xd-gIwZ1QP0jwdfn5Wl_KGq22HV6G2rOMSIxp9vlblxEWHGrVqhIlmt6AIgoxQF83FOn0tQB0npff71FHVGY06inhCPlPG2sZom4ytNaqNLz-6ZhTmDI4xCabcr1Mu1y2xVz7PwCQPmlW8Vy-TrX7sELWpDJ9Wa_Zdo7ng' }
        ]
      }
    }
  });

  const p2 = await prisma.property.create({
    data: {
      title: 'Azure Heights',
      description: 'An ultra-modern minimalist luxury villa with a glowing infinity pool at night. The architecture is sharp and cubic with floor-to-ceiling glass windows showing warm interior light. Surrounded by dark palm silhouettes under a starlit sky. High-key luxury aesthetic with deep primary blue tones and clean white surfaces.',
      price: 2450000,
      location: 'Los Angeles, CA',
      address: '782 Skyline Drive',
      city: 'Los Angeles',
      state: 'California',
      country: 'USA',
      latitude: 34.05223,
      longitude: -118.24368,
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      type: 'Villa',
      status: PropertyStatus.FOR_SALE,
      featured: true,
      amenities: ['Pool', 'Garage', 'Smart Automation', 'Wine Cellar'],
      agentId: agent.id,
      images: {
        create: [
          { imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUoi8G7t4Pv64fs3j-EY2AbDJV87MS8mkOxvH4Zw49rbw4iEb99URZnrhVW5v0PGPplGZwmxR5yKbVTMabg9dsFTposRrO_b3x8NJQgwkOuZ6e8W76gBHsZgTgst_Qml_b1jZfCBrQw6hjtAh3Z0j4ZWZu8S1hdFonqSjBrQCQr1xk0xVxWv6_R1wzHSWNBh4LsvcBcHBxhH3BHg4N-9jVFCBDoT8M9bRJcBOnguldf0-NLpC7L9z931Hf_jlxOyCYAXSS0N1SE_Y' }
        ]
      }
    }
  });

  const p3 = await prisma.property.create({
    data: {
      title: 'The Oasis Villa',
      description: 'A bright, airy contemporary coastal home with white-washed walls and expansive wooden decks overlooking a turquoise ocean. Soft natural daylight floods the scene, emphasizing a peaceful, vacation-like atmosphere. The interior is minimally furnished with light wood and beige textiles, maintaining a high-end, clean light-mode aesthetic.',
      price: 1890000,
      location: 'Miami, FL',
      address: '320 Ocean Drive',
      city: 'Miami',
      state: 'Florida',
      country: 'USA',
      latitude: 25.76168,
      longitude: -80.19179,
      bedrooms: 5,
      bathrooms: 4,
      area: 4100,
      type: 'Villa',
      status: PropertyStatus.FOR_SALE,
      featured: true,
      amenities: ['Beachfront access', 'Deck', 'Outdoor Kitchen', 'Guest House'],
      agentId: agent2.id,
      images: {
        create: [
          { imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2-H7a3hRtnfzVnLgMcQy2N9rnwjLNMw7VVWHZcbxlfiANAVXUEUC2a_V9BhlJKk7sfz-DaF5KnOyUxoV27DVn7jg3doOkV40Vn6oQtibLY00U_VN8buD6kZ97xtmZJlRi_NJwTxs2hE8iSc2eg1leRbvQnCVdvg3V62fUVt260P456pSvQviMyxiwRGiUsFZ-v_rpk-dgFTUhnr4Kuu1yMD4BtPE-I7VC5T2c9DBZDpjNy2ePHus0K9eHNLWtbHc1lrjIWIyWST8' }
        ]
      }
    }
  });

  const p4 = await prisma.property.create({
    data: {
      title: 'Willow Creek House',
      description: 'An elegant, modern suburban house with a large glass facade and dark charcoal accents, set against a lush green park landscape during a bright sunny morning. High-contrast shadows and sharp architectural lines give it a sophisticated, contemporary feel. The mood is tranquil and upscale, reflecting a premium lifestyle.',
      price: 950000,
      location: 'Austin, TX',
      address: '405 Willow Creek Way',
      city: 'Austin',
      state: 'Texas',
      country: 'USA',
      latitude: 30.267153,
      longitude: -97.74306,
      bedrooms: 3,
      bathrooms: 2,
      area: 2400,
      type: 'House',
      status: PropertyStatus.FOR_SALE,
      featured: false,
      amenities: ['Suburban Park View', 'Garage', 'Solar System', 'Backyard Patio'],
      agentId: agent2.id,
      images: {
        create: [
          { imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-o16fHXboqUOBIkaqmXML9KtOmCW0NPyh-u5MaKHhD6LnoV2TGpi1yWyESbDvevSKdS7qPdqzmHw3S2mrOjf84LMNb5pblTK2pDAGwQY-JLvvJLHwtSIQCnLvofffFd07GiS4BrfRm-fuXDk9cjILZscTpSh8QFkBbeVEJb2Bc8sgNYimQkcL_kjGw-JOBIeZNejSvRh7frGe6xzfoqv28vrNRWP64_pTVE34sUoiH_5XN8JUgDSwNACuJLPur09EBLlPp7UGgyA' }
        ]
      }
    }
  });

  // Premium Land Holdings (Map search / discover entries)
  const l1 = await prisma.property.create({
    data: {
      title: 'Summit Ridge Plateau',
      description: 'An expansive, high-altitude alpine meadow at sunset, featuring lush green grasses and scattered wildflowers under a dramatic purple and gold sky. The scene is framed by jagged, snow-capped mountain peaks in the distance, creating a sense of isolation and grandeur.',
      price: 6400000,
      location: 'Telluride, CO',
      address: 'Summit Ridge Route 4',
      city: 'Telluride',
      state: 'Colorado',
      country: 'USA',
      latitude: 37.937493,
      longitude: -107.812285,
      bedrooms: 0,
      bathrooms: 0,
      area: 18295200, // 420 Acres in sqft
      type: 'Land',
      status: PropertyStatus.FOR_SALE,
      featured: true,
      amenities: ['Residential/Ag Zoning', 'Utilities On-site', 'Mountain Views', 'Water Rights'],
      agentId: agent.id,
      images: {
        create: [
          { imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAChXYOD-gkWd9RouaM-C28OJTwgXlIhHp2gXQFI3EuWiSY6uKy6TgyyTODdLE6xQM21OnKrLeL5GmoMdxu3Oi4_mE8URJ72-sbpA_-TvqMjRdp5T9Wr_-zaoEqiX30IMWgC-s3RVRoMI4xvGT6I11-_oAwGZmCwr5XwxGU_7jJT0VmeOifplpbvBIV6vUHUu3dHt17v7L_bPwDKKGLEgZuvcaMovgJ3RBURxnp01Bdlot805vSjaLc9gr5bkQc5KyQ2LJRQ45Ru7I' }
        ]
      }
    }
  });

  const l2 = await prisma.property.create({
    data: {
      title: 'Azure Coast Bluffs',
      description: 'A pristine coastal bluff overlooking a turquoise ocean, with golden dry grass waving in the sea breeze under a clear, bright midday sun. The rugged coastline features dramatic cliffs and hidden coves, suggesting exclusive privacy and natural beauty.',
      price: 18200000,
      location: 'Big Sur, CA',
      address: 'Mile Marker 42 Highway 1',
      city: 'Big Sur',
      state: 'California',
      country: 'USA',
      latitude: 36.270415,
      longitude: -121.80806,
      bedrooms: 0,
      bathrooms: 0,
      area: 522720, // 12 Acres in sqft
      type: 'Land',
      status: PropertyStatus.FOR_SALE,
      featured: true,
      amenities: ['Estate Zoning', 'Private Gated Access', 'Oceanfront Bluffs', 'Conceptual Plans Available'],
      agentId: agent.id,
      images: {
        create: [
          { imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfoOtePJle_eG-6noaVNtC_dDb9Zcl4VKt41QD8NTsv0aQvOKMUxOmIWsnKrERu1MvDPAgbc7NBPkC2XuPjVJEfLVsF1XFUoQWsVUYw29WeqRsFvn0Qft8bmT4vMoE2NQpgrZpc5824R2mfbMCQr_BN7GVrPmmF5dBrNoEr2JvP4lUr7DEhztowrQjftb-LJdm92U66UScGSgFewYEZwNNYR7aMcr71tB1gbZnY10JqUA6ju7bGO6PrRpsgBOTOKGq2PNPEovNVPQ' }
        ]
      }
    }
  });

  const l3 = await prisma.property.create({
    data: {
      title: 'Heritage Oaks Ranch',
      description: 'A vast expanse of rolling golden hills dotted with ancient oak trees during the late afternoon golden hour. The landscape is peaceful and timeless, with soft shadows stretching across the terrain and a warm, hazy glow in the air.',
      price: 9850000,
      location: 'Santa Ynez, CA',
      address: '8900 Happy Canyon Rd',
      city: 'Santa Ynez',
      state: 'California',
      country: 'USA',
      latitude: 34.61466,
      longitude: -120.083756,
      bedrooms: 0,
      bathrooms: 0,
      area: 52272000, // 1200 Acres in sqft
      type: 'Land',
      status: PropertyStatus.FOR_SALE,
      featured: true,
      amenities: ['Agricultural Zoning', '3 Water Wells', 'Equestrian Potential', 'Vineyard Soils'],
      agentId: agent2.id,
      images: {
        create: [
          { imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTdJrumPziM1OSKaPrTQEdeu5ucAaQb9_PHE7D0-XVSj1ncdGq5dCGjSLQWA7ItJI-S7ojHb6QNsHGdMFGeXHhZ7EhLvONCrs2r7E4yXGIoc5TsBMJQTfBd5lUSspVuhBr-LqyJpEmyD7kqL089KVfs27Xf3rntJG8WmVTQliRTd-FCU-DFyKFTGWF0DQVlN9IWCvKOZkDVBPvHkSvCycZXLJZBgw3ZSVmiD8hovUOb4QFFzUvfbhtoybsmqVys2mzimw0HSeCkiU' }
        ]
      }
    }
  });

  // Pending approval property for Admin dashboard approval workflow
  await prisma.property.create({
    data: {
      title: 'Suburban Glass Chalet',
      description: 'A modern chalet pending platform approval. Clean wood paneling, floor-to-ceiling glass, forest views, smart lighting controls.',
      price: 1550000,
      location: 'Seattle, WA',
      address: '22 Valley View Lane',
      city: 'Seattle',
      state: 'Washington',
      country: 'USA',
      latitude: 47.6062,
      longitude: -122.3321,
      bedrooms: 3,
      bathrooms: 2.5,
      area: 2800,
      type: 'House',
      status: PropertyStatus.PENDING_APPROVAL,
      featured: false,
      amenities: ['Floor-to-ceiling Glass', 'Cedar Accents', 'Smart Automation'],
      agentId: agent.id,
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800' }
        ]
      }
    }
  });

  console.log('Properties seeded successfully');

  // Bookings
  await prisma.booking.create({
    data: {
      userId: buyer.id,
      propertyId: p1.id,
      date: '2026-06-12',
      time: 'Afternoon (12:00 PM - 4:00 PM)',
      status: 'PENDING',
      notes: 'I would like to view the Dolby Atmos cinema room specifically.',
    }
  });

  // Favorites
  await prisma.favorite.create({
    data: {
      userId: buyer.id,
      propertyId: p1.id,
    }
  });

  await prisma.favorite.create({
    data: {
      userId: buyer.id,
      propertyId: p2.id,
    }
  });

  // Reviews
  await prisma.review.create({
    data: {
      userId: buyer.id,
      propertyId: p1.id,
      rating: 5,
      review: 'Redefines minimalism completely. Visited last week and was blown away by the automated retracting glass walls.',
    }
  });

  // Notifications
  await prisma.notification.create({
    data: {
      userId: buyer.id,
      title: 'Tour Confirmed',
      message: 'Your walkthrough tour request for The Glass Pavilion has been received.',
    }
  });

  await prisma.notification.create({
    data: {
      userId: agent.id,
      title: 'New Tour Request',
      message: 'John Doe requested a private walkthrough for The Glass Pavilion on June 12.',
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
