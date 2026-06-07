import { PropertyStatus } from '@prisma/client';

export const MOCK_AGENTS = {
  julian: {
    id: 'agent-julian',
    name: 'Julian Vance',
    email: 'agent@xyzhomes.com',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  },
  marcus: {
    id: 'agent-marcus',
    name: 'Marcus Richardson',
    email: 'marcus@xyzhomes.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  }
};

export const MOCK_PROPERTIES: any[] = [
  {
    id: 'p1',
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
    agentId: MOCK_AGENTS.julian.id,
    agent: MOCK_AGENTS.julian,
    images: [
      { id: 'img-p1-1', propertyId: 'p1', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArM6tnyoD0IJooZr0_XzuS7VyzN_5MxgmqqsDFKH5rMbiQMyAHgVgSyEUzjWSPKRZT22Yu7HNuJkcnyr1LM-TV0dJ70NaPDbtmVaL2XteCVaaF1xrsDTH8q2BDwiPp3z-ihe7_lyTvZQyNiLIbYhBfXcLJ8914dFFd0YulY0vQz-cn3VDcU_r3FUcDXwBnw2M-8MO8IBT5xgxRfZvmPU5iIJeQQDpXBhIxoF4fnZrLt8ofnO5rXc3SkXz1AfSlPJrpRtztUWNDqa0' },
      { id: 'img-p1-2', propertyId: 'p1', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqQSKHYEyw3BAMmZJ_qOWjtiwUvF4qEtJD-bvS3J56iosaB3Tmp2la3JbMC8EQjohXKaqMIu_ISc36bSXFjh8aCpvLJ850DCi8ghUBF_FfPBc6ZvOGuy7CIr9bOPiUTiNXogvT24egbpDUml-dS-ja_lXuc6uiTcKLo8IlzN0Ua0JX5TLevFEu5_Fxb8IVWkTOqCcvSUpVF2h6zRKQYM9skpCXCfpEhkgQuYbgsvjAdrdU_fIBbB_Zs95sQY7IQn0sbF2bXfSQESg' },
      { id: 'img-p1-3', propertyId: 'p1', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChQ9zo4oJTqK0nDsOSsQ8q7CW9IRnygQXbUCWo_AjKC6485SRySsnzYEziXvbHWIz8Jmxf8s5o3hQFTu2ll6u47O0qOQjYESq2JwUO4xd-gIwZ1QP0jwdfn5Wl_KGq22HV6G2rOMSIxp9vlblxEWHGrVqhIlmt6AIgoxQF83FOn0tQB0npff71FHVGY06inhCPlPG2sZom4ytNaqNLz-6ZhTmDI4xCabcr1Mu1y2xVz7PwCQPmlW8Vy-TrX7sELWpDJ9Wa_Zdo7ng' }
    ],
    reviews: [
      {
        id: 'rev-p1-1',
        rating: 5,
        review: 'Redefines minimalism completely. Visited last week and was blown away by the automated retracting glass walls.',
        createdAt: new Date().toISOString(),
        user: { id: 'user-john', name: 'John Doe', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p2',
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
    agentId: MOCK_AGENTS.julian.id,
    agent: MOCK_AGENTS.julian,
    images: [
      { id: 'img-p2-1', propertyId: 'p2', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUoi8G7t4Pv64fs3j-EY2AbDJV87MS8mkOxvH4Zw49rbw4iEb99URZnrhVW5v0PGPplGZwmxR5yKbVTMabg9dsFTposRrO_b3x8NJQgwkOuZ6e8W76gBHsZgTgst_Qml_b1jZfCBrQw6hjtAh3Z0j4ZWZu8S1hdFonqSjBrQCQr1xk0xVxWv6_R1wzHSWNBh4LsvcBcHBxhH3BHg4N-9jVFCBDoT8M9bRJcBOnguldf0-NLpC7L9z931Hf_jlxOyCYAXSS0N1SE_Y' }
    ],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p3',
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
    agentId: MOCK_AGENTS.marcus.id,
    agent: MOCK_AGENTS.marcus,
    images: [
      { id: 'img-p3-1', propertyId: 'p3', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2-H7a3hRtnfzVnLgMcQy2N9rnwjLNMw7VVWHZcbxlfiANAVXUEUC2a_V9BhlJKk7sfz-DaF5KnOyUxoV27DVn7jg3doOkV40Vn6oQtibLY00U_VN8buD6kZ97xtmZJlRi_NJwTxs2hE8iSc2eg1leRbvQnCVdvg3V62fUVt260P456pSvQviMyxiwRGiUsFZ-v_rpk-dgFTUhnr4Kuu1yMD4BtPE-I7VC5T2c9DBZDpjNy2ePHus0K9eHNLWtbHc1lrjIWIyWST8' }
    ],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p4',
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
    agentId: MOCK_AGENTS.marcus.id,
    agent: MOCK_AGENTS.marcus,
    images: [
      { id: 'img-p4-1', propertyId: 'p4', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-o16fHXboqUOBIkaqmXML9KtOmCW0NPyh-u5MaKHhD6LnoV2TGpi1yWyESbDvevSKdS7qPdqzmHw3S2mrOjf84LMNb5pblTK2pDAGwQY-JLvvJLHwtSIQCnLvofffFd07GiS4BrfRm-fuXDk9cjILZscTpSh8QFkBbeVEJb2Bc8sgNYimQkcL_kjGw-JOBIeZNejSvRh7frGe6xzfoqv28vrNRWP64_pTVE34sUoiH_5XN8JUgDSwNACuJLPur09EBLlPp7UGgyA' }
    ],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'l1',
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
    area: 18295200,
    type: 'Land',
    status: PropertyStatus.FOR_SALE,
    featured: true,
    amenities: ['Residential/Ag Zoning', 'Utilities On-site', 'Mountain Views', 'Water Rights'],
    agentId: MOCK_AGENTS.julian.id,
    agent: MOCK_AGENTS.julian,
    images: [
      { id: 'img-l1-1', propertyId: 'l1', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChXYOD-gkWd9RouaM-C28OJTwgXlIhHp2gXQFI3EuWiSY6uKy6TgyyTODdLE6xQM21OnKrLeL5GmoMdxu3Oi4_mE8URJ72-sbpA_-TvqMjRdp5T9Wr_-zaoEqiX30IMWgC-s3RVRoMI4xvGT6I11-_oAwGZmCwr5XwxGU_7jJT0VmeOifplpbvBIV6vUHUu3dHt17v7L_bPwDKKGLEgZuvcaMovgJ3RBURxnp01Bdlot805vSjaLc9gr5bkQc5KyQ2LJRQ45Ru7I' }
    ],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'l2',
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
    area: 522720,
    type: 'Land',
    status: PropertyStatus.FOR_SALE,
    featured: true,
    amenities: ['Estate Zoning', 'Private Gated Access', 'Oceanfront Bluffs', 'Conceptual Plans Available'],
    agentId: MOCK_AGENTS.julian.id,
    agent: MOCK_AGENTS.julian,
    images: [
      { id: 'img-l2-1', propertyId: 'l2', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfoOtePJle_eG-6noaVNtC_dDb9Zcl4VKt41QD8NTsv0aQvOKMUxOmIWsnKrERu1MvDPAgbc7NBPkC2XuPjVJEfLVsF1XFUoQWsVUYw29WeqRsFvn0Qft8bmT4vMoE2NQpgrZpc5824R2mfbMCQr_BN7GVrPmmF5dBrNoEr2JvP4lUr7DEhztowrQjftb-LJdm92U66UScGSgFewYEZwNNYR7aMcr71tB1gbZnY10JqUA6ju7bGO6PrRpsgBOTOKGq2PNPEovNVPQ' }
    ],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'l3',
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
    area: 52272000,
    type: 'Land',
    status: PropertyStatus.FOR_SALE,
    featured: true,
    amenities: ['Agricultural Zoning', '3 Water Wells', 'Equestrian Potential', 'Vineyard Soils'],
    agentId: MOCK_AGENTS.marcus.id,
    agent: MOCK_AGENTS.marcus,
    images: [
      { id: 'img-l3-1', propertyId: 'l3', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTdJrumPziM1OSKaPrTQEdeu5ucAaQb9_PHE7D0-XVSj1ncdGq5dCGjSLQWA7ItJI-S7ojHb6QNsHGdMFGeXHhZ7EhLvONCrs2r7E4yXGIoc5TsBMJQTfBd5lUSspVuhBr-LqyJpEmyD7kqL089KVfs27Xf3rntJG8WmVTQliRTd-FCU-DFyKFTGWF0DQVlN9IWCvKOZkDVBPvHkSvCycZXLJZBgw3ZSVmiD8hovUOb4QFFzUvfbhtoybsmqVys2mzimw0HSeCkiU' }
    ],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p5',
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
    agentId: MOCK_AGENTS.julian.id,
    agent: MOCK_AGENTS.julian,
    images: [
      { id: 'img-p5-1', propertyId: 'p5', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800' }
    ],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function filterMockProperties(query: any) {
  const {
    search,
    city,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minArea,
    maxArea,
    status,
    featured,
    sortBy,
    page = '1',
    limit = '12',
  } = query;

  let list = [...MOCK_PROPERTIES];

  // status filter
  const targetStatus = status || PropertyStatus.FOR_SALE;
  list = list.filter((p) => p.status === targetStatus);

  // featured filter
  if (featured === 'true') {
    list = list.filter((p) => p.featured === true);
  }

  // search filter
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s)
    );
  }

  // city filter
  if (city) {
    const c = city.toLowerCase();
    list = list.filter((p) => p.city.toLowerCase().includes(c));
  }

  // type filter (if not 'Property Type')
  if (type && type !== 'Property Type') {
    list = list.filter((p) => p.type.toLowerCase() === type.toLowerCase());
  }

  // price filter
  if (minPrice) {
    const min = parseFloat(minPrice);
    list = list.filter((p) => p.price >= min);
  }
  if (maxPrice) {
    const max = parseFloat(maxPrice);
    list = list.filter((p) => p.price <= max);
  }

  // bedrooms filter
  if (bedrooms) {
    const beds = parseInt(bedrooms, 10);
    list = list.filter((p) => p.bedrooms >= beds);
  }

  // bathrooms filter
  if (bathrooms) {
    const baths = parseFloat(bathrooms);
    list = list.filter((p) => p.bathrooms >= baths);
  }

  // area filter
  if (minArea) {
    const min = parseFloat(minArea);
    list = list.filter((p) => p.area >= min);
  }
  if (maxArea) {
    const max = parseFloat(maxArea);
    list = list.filter((p) => p.area <= max);
  }

  // sorting
  if (sortBy === 'Price: Low to High') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price: High to Low') {
    list.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Square Footage') {
    list.sort((a, b) => b.area - a.area);
  } else {
    // Default: Newest Listings
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // pagination
  const parsedPage = parseInt(page as string, 10);
  const parsedLimit = parseInt(limit as string, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  const paginatedList = list.slice(skip, skip + parsedLimit);

  return {
    properties: paginatedList,
    totalCount: list.length,
    totalPages: Math.ceil(list.length / parsedLimit),
    currentPage: parsedPage,
  };
}
