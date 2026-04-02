export const MOCK_TRIP_DATA = {
  hotelOptions: [
    {
      hotelName: "Grand Plaza Resort",
      hotelAddress: "City Center Boulevard",
      price: "$150/night",
      rating: "4.8",
      description: "Luxurious resort with amazing views, spa, and multiple dining options. Perfect for a premium stay.",
      geoCoordinates: null,
      hotelImageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    },
    {
      hotelName: "Budget Inn Downtown",
      hotelAddress: "Market Street, Downtown",
      price: "$60/night",
      rating: "3.8",
      description: "Affordable and central stay with easy transit access and free breakfast.",
      geoCoordinates: null,
      hotelImageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
    },
    {
      hotelName: "Boutique Heritage Suites",
      hotelAddress: "Old Town Road",
      price: "$210/night",
      rating: "4.9",
      description: "Elegant historic boutique hotel with personalized services and classic architecture.",
      geoCoordinates: null,
      hotelImageUrl: "https://images.unsplash.com/photo-1551882547-ff40c0d5e9af"
    }
  ],
  itinerary: [
    {
      day: "Day 1",
      plan: [
        {
          placeName: "Central Viewpoint",
          placeDetails: "A spectacular viewpoint offering a 360-degree panorama of the city.",
          time: "10:00 AM - 12:00 PM",
          ticketPricing: "$15",
          rating: "4.7",
          travelTimeToNextLocation: "15 mins taxi",
          placeImageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
        },
        {
          placeName: "Historic Museum & Gallery",
          placeDetails: "Explore extensive collections covering centuries of culture and local heritage.",
          time: "2:00 PM - 5:00 PM",
          ticketPricing: "$25",
          rating: "4.8",
          travelTimeToNextLocation: "10 mins walk",
          placeImageUrl: "https://images.unsplash.com/photo-1518998053401-a4149019a263"
        }
      ]
    },
    {
      day: "Day 2",
      plan: [
        {
          placeName: "Local Market Square",
          placeDetails: "Experience the vibrant local culture, street food, and artisan crafts.",
          time: "09:30 AM - 01:30 PM",
          ticketPricing: "Free",
          rating: "4.6",
          travelTimeToNextLocation: "20 mins metro",
          placeImageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e"
        },
        {
          placeName: "Riverside Sunset Cruise",
          placeDetails: "Enjoy local cuisine on a scenic river cruise at sunset.",
          time: "5:00 PM - 8:00 PM",
          ticketPricing: "$85",
          rating: "4.9",
          travelTimeToNextLocation: "N/A",
          placeImageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        }
      ]
    }
  ],
  estimatedCosts: {
    totalFlights: 400,
    dailyFoodPerPerson: 60,
    transportationPerDay: 40,
    totalActivities: 125
  },
  travelTips: [
    "Always carry some local currency for small purchases and street food.",
    "Book museums in advance to skip the queue.",
    "Public transport is the most economical way to get around."
  ],
  smartRecommendations: {
    shopping: [
      { item: "Traditional Handicrafts", reason: "The local artisan markets offer unique, handmade artifacts that represent centuries of heritage." },
      { item: "Aromatic Spice Blends", reason: "The region is world-renowned for its organic vanilla and smoked paprika." }
    ],
    localDelicacies: [
      { food: "Authentic Street Noodles", reason: "Found only in the night markets, these have a unique umami blast you won't find in restaurants." },
      { food: "Floral Herbal Teas", reason: "A soothing local specialty made from mountain-picked wildflowers." }
    ],
    experienceScores: {
      nightlife: 8,
      culture: 9,
      relaxation: 7,
      adventure: 6
    },
    crowdPredictor: {
      level: "Medium",
      description: "While popular, the vast area helps manage crowds. Peak hours are mid-afternoon at major landmarks."
    },
    safetyScore: {
      overall: 4.5,
      factors: {
        crime: 4.2,
        travel: 4.8,
        women: 4.5,
        night: 4.0
      }
    },
    foodExplorer: {
      mustTry: ["Glazed Honey Pastries", "Saffron Infused Risotto", "Spiced Botanical Brew"],
      recommendedRestaurants: [
        { name: "The Gilded Fork", cuisine: "Modern Fusion", rating: 4.8 },
        { name: "Old Town Bistro", cuisine: "Traditional Heritage", rating: 4.6 },
        { name: "Azure Waterside", cuisine: "Seafood & Grill", rating: 4.7 }
      ]
    }
  }
};
