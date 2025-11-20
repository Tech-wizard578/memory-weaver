import { Memory } from "@/types/memory";

export const getMockMemories = (): Memory[] => {
  return [
    {
      id: "1",
      title: "Family Beach Vacation",
      narrative: "It was a beautiful summer day at the beach in July 2015. The warm sun shone down as you built sandcastles with the kids, their laughter echoing across the shore. The ocean breeze was refreshing, and everyone seemed so happy and carefree. This was a perfect family moment, captured forever in time.",
      date: new Date("2015-07-15"),
      photos: [
        {
          id: "p1",
          url: "/placeholder.svg",
          metadata: {
            date: new Date("2015-07-15"),
            location: "Santa Monica Beach, CA",
            latitude: 34.0195,
            longitude: -118.4912,
          },
          aiAnalysis: {
            description: "Family on beach, children playing in sand",
            detectedObjects: ["beach", "ocean", "sandcastle", "people"],
            detectedPeople: ["John Smith", "Emma Smith", "Sophie Smith"],
            emotions: ["happy", "joyful", "playful"],
            confidence: 0.92,
          },
        },
      ],
      location: "Santa Monica Beach, CA",
      people: ["John Smith", "Emma Smith", "Sophie Smith"],
      emotions: ["happy", "joyful", "peaceful"],
      category: "Family",
    },
    {
      id: "2",
      title: "Birthday Celebration at Home",
      narrative: "March 2018 brought a wonderful celebration at home. The living room was decorated with colorful balloons and streamers as family and friends gathered around. The birthday cake sat at the center of the table, candles flickering in the warm glow. Everyone sang together, their voices filled with love and celebration.",
      date: new Date("2018-03-22"),
      photos: [
        {
          id: "p2",
          url: "/placeholder.svg",
          metadata: {
            date: new Date("2018-03-22"),
            location: "Home",
            latitude: 34.0522,
            longitude: -118.2437,
          },
          aiAnalysis: {
            description: "Indoor birthday party with cake and decorations",
            detectedObjects: ["cake", "balloons", "people", "decorations"],
            detectedPeople: ["Sarah Johnson", "Emma Smith", "Michael Johnson"],
            emotions: ["happy", "excited", "celebratory"],
            confidence: 0.89,
          },
        },
      ],
      location: "Home",
      people: ["Sarah Johnson", "Emma Smith", "Michael Johnson"],
      emotions: ["happy", "excited", "loving"],
      category: "Celebration",
    },
    {
      id: "3",
      title: "Graduation Ceremony",
      narrative: "June 2020 marked a significant milestone - graduation day. Despite the challenges of the year, there was pride and accomplishment in the air. The cap and gown represented years of hard work and dedication. Family members beamed with pride as they watched this important moment unfold, knowing it was the beginning of a new chapter.",
      date: new Date("2020-06-12"),
      photos: [
        {
          id: "p3",
          url: "/placeholder.svg",
          metadata: {
            date: new Date("2020-06-12"),
            location: "University Campus",
            latitude: 34.0689,
            longitude: -118.4452,
          },
          aiAnalysis: {
            description: "Graduation ceremony with cap and gown",
            detectedObjects: ["graduation cap", "diploma", "people", "campus"],
            detectedPeople: ["Emma Smith", "John Smith", "Sarah Johnson"],
            emotions: ["proud", "accomplished", "hopeful"],
            confidence: 0.95,
          },
        },
      ],
      location: "University Campus",
      people: ["Emma Smith", "John Smith", "Sarah Johnson"],
      emotions: ["proud", "accomplished", "hopeful"],
      category: "Milestone",
    },
    {
      id: "4",
      title: "Autumn Park Walk",
      narrative: "October 2016 painted the park in vibrant autumn colors. Golden and crimson leaves carpeted the walking path as you strolled through the peaceful afternoon. The crisp air felt refreshing, and the beauty of nature in transition was breathtaking. It was one of those quiet moments where everything felt just right.",
      date: new Date("2016-10-08"),
      photos: [
        {
          id: "p4",
          url: "/placeholder.svg",
          metadata: {
            date: new Date("2016-10-08"),
            location: "Central Park",
            latitude: 40.7829,
            longitude: -73.9654,
          },
          aiAnalysis: {
            description: "Person walking through autumn park with colorful leaves",
            detectedObjects: ["trees", "leaves", "path", "person"],
            detectedPeople: ["John Smith"],
            emotions: ["peaceful", "contemplative", "serene"],
            confidence: 0.88,
          },
        },
      ],
      location: "Central Park",
      people: ["John Smith"],
      emotions: ["peaceful", "serene", "appreciative"],
      category: "Nature",
    },
    {
      id: "5",
      title: "Holiday Dinner Gathering",
      narrative: "December 2017 brought the family together for a wonderful holiday dinner. The dining table was beautifully set with festive decorations and delicious food. Conversations flowed easily as everyone shared stories and laughter. The warmth of being surrounded by loved ones made this evening truly special and memorable.",
      date: new Date("2017-12-24"),
      photos: [
        {
          id: "p5",
          url: "/placeholder.svg",
          metadata: {
            date: new Date("2017-12-24"),
            location: "Home",
            latitude: 34.0522,
            longitude: -118.2437,
          },
          aiAnalysis: {
            description: "Holiday dinner table with family gathered around",
            detectedObjects: ["table", "food", "decorations", "people"],
            detectedPeople: ["John Smith", "Sarah Johnson", "Emma Smith", "Michael Johnson"],
            emotions: ["warm", "joyful", "grateful"],
            confidence: 0.91,
          },
        },
      ],
      location: "Home",
      people: ["John Smith", "Sarah Johnson", "Emma Smith", "Michael Johnson"],
      emotions: ["warm", "joyful", "grateful"],
      category: "Holiday",
    },
  ];
};
