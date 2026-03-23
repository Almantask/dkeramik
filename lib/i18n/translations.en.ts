import type { SiteTranslations } from './types';

export const en: SiteTranslations = {
  nav: {
    home: 'Home',
    about: 'About',
    portfolio: 'Portfolio',
    craft: 'Craft',
    journal: 'Journal',
    contact: 'Contact',
  },

  home: {
    headline: 'Homes become true homes\nwhen they are filled with heartfelt details.',
    introParagraph1Part1: 'Home means something different to each of us.\nFor me, it is made of ',
    introBold1: 'memories',
    introParagraph1Part2: ', ',
    introBold2: 'traditions',
    introParagraph1Part3: ', ',
    introBold3: 'warmth',
    introParagraph1Part4: ' and ',
    introBold4: 'small details',
    introParagraph1Part5: ', that slowly fill a space with life.',
    introParagraph2:
      'Growing up, I watched my mother fill our home with handmade ceramics from local makers — small boxes, angel figurines, and other objects with their own character and soul. From her I learned that handmade things have a special power — they bring not only beauty to everyday life, but also warmth, mood, and meaning.',
    introParagraph3Part1: 'Through ',
    introParagraph3Bold: 'DKeramik',
    introParagraph3Part2:
      ' I seek to continue this thought — to create ceramics that remind us that it is the small details that enrich life.',
    introParagraph4:
      'I hope that each of my pieces will become more than just an object — a small spark of joy and a cosy part of your home\'s story.',
    signature: 'Homes are built little by little — detail by detail.',
    invitation: 'If you wish, take it in your hands and feel the warmth of clay.',
    closing: 'Perhaps here you will find what will become part of your home\'s story.',
    ctaPortfolio: 'Explore Portfolio',
    ctaAbout: 'About Me',
  },

  about: {
    headline: 'About DKeramik',
    subheadline: 'A letter from the workshop',
    section1Heading: 'How it began',
    section1Body:
      'I grew up surrounded by the quiet beauty of handmade things. My grandmother\'s kitchen shelves held mismatched bowls, each one shaped by a local potter\'s hands. Some were perfectly smooth, others carried the subtle thumbprint of their maker. They weren\'t precious — they were used daily, filled with everything from morning oatmeal to summer berries.',
    section1Bold: 'Those bowls taught me something essential: the objects we live with shape how we feel at home.',
    section2Heading: 'The Beginning',
    section2Body:
      'DKeramik was born in a small studio, with clay-stained hands and the dream of creating pieces that carry meaning. Not just beautiful objects, but ',
    section2Bold1: 'vessels for daily rituals',
    section2Bold2: 'warmth',
    section3Heading: 'Philosophy',
    section3Body:
      'Every piece I create is made slowly, with intention. The clay speaks as it spins on the wheel, and I listen. Sometimes it wants to become a wide, generous bowl. Sometimes a slender vase. Each piece emerges ',
    section3Bold: 'unique',
    section4Heading: 'The Promise',
    section4Body:
      'When you bring a DKeramik piece into your home, you\'re not just acquiring a product. You\'re inviting in a small piece of craftsmanship, a quiet daily pleasure, a reminder that ',
    section4Bold: 'beautiful things don\'t have to shout',
    closing: 'Homes are created little by little — detail by detail.',
  },

  portfolio: {
    headline: 'Portfolio',
    subheadline:
      'Each piece is handcrafted with intention. Designed for daily use, built to last, made to bring warmth to your home.',
    categoryAll: 'All',
    categoryBowls: 'Bowls',
    categoryCups: 'Cups',
    categoryVases: 'Vases',
    categorySmallDecor: 'Small Decor',
    categoryKeepsakes: 'Keepsakes',
    categorySeasonal: 'Seasonal',
    emptyState: 'No pieces in this category yet.',
  },

  product: {
    categoryLabel: 'Category',
    dimensionsLabel: 'Dimensions',
    materialLabel: 'Material',
    careLabel: 'Care Instructions',
    handmadeNoteTitle: 'Handmade variation',
    handmadeNoteBody:
      'Each piece is individually crafted, so slight variations in size, shape, and glaze are natural and celebrated. Your piece will be beautifully unique.',
    closingBody:
      'This piece is ready to become part of your daily rituals. To bring warmth to your table. To remind you that beautiful things don\'t have to wait for special occasions — they make ordinary moments special.',
    galleryHeading: 'Details',
    backToPortfolio: '← Back to Portfolio',
  },

  craft: {
    headline: 'The Craft',
    subheadline:
      'From raw earth to finished piece, each creation passes through patient hands and transformative fire.',
    intro:
      'Ceramics is not hurried. It asks for time, attention, and respect for the material. Each step — from selecting the clay to the final firing — has its own pace and its own truth.',
    steps: [
      {
        title: 'Choosing Clay',
        description:
          'Everything begins with the material. Different clays give different texture, weight, and character. I choose the clay according to what I want to create.',
      },
      {
        title: 'Centering',
        description:
          'Centering requires patience — the clay must become calm, even, humble. Only then can shaping begin.',
      },
      {
        title: 'Shaping',
        description:
          'Hands follow the clay, clay follows the hands. Form emerges from dialogue — between idea and material, between what is desired and what is possible.',
      },
      {
        title: 'Trimming',
        description:
          'The dried piece returns to the wheel — it is trimmed, refined, given its final contour. Details decide everything.',
      },
      {
        title: 'Drying',
        description:
          'Slow drying is just as important as shaping. Rushing here is costly — clay needs time to dry on its own.',
      },
      {
        title: 'Glazing',
        description:
          'Glaze is the piece\'s skin. It gives colour, texture, character. I choose glazes that reflect the earth — quiet, warm, vibrant.',
      },
      {
        title: 'Firing',
        description:
          'Transformation happens in the kiln. Clay becomes stone, glaze melts and hardens. After firing, the piece no longer belongs to me — it comes into the world.',
      },
      {
        title: 'Final Touch',
        description:
          'Each finished piece is examined, touched, assessed. If it brings joy — it travels to you.',
      },
    ],
    processLabels: ['Centering', 'Shaping', 'Firing', 'Finishing'],
    closing: 'Beauty lives in the imperfections.',
  },

  journal: {
    headline: 'Journal',
    subheadline: 'Thoughts on making, living with intention, and the quiet beauty of handmade things.',
    readMore: 'Read more →',
    backToJournal: '← Back to Journal',
    entries: [
      {
        slug: 'home-rituals',
        title: 'Home Rituals: The Objects That Shape Our Days',
        date: 'March 15, 2024',
        excerpt:
          'How the simple act of reaching for a handmade mug can transform an ordinary morning into a moment of mindfulness.',
        body: [
          'There is something magical in the morning coffee ceremony. Not because of the caffeine — though that helps — but because of the act itself: the rising, the water, the reaching for a cup.',
          'When that cup is handmade, warm, slightly irregular, carrying the fingerprints of its maker — something shifts. An ordinary morning becomes a little more sacred.',
          'We live among objects. They shape our movements, our rituals, our feelings. A handmade object reminds us that someone took time to create it. And that time, that intention — it is passed to you through the object itself.',
          'So in the morning, when you reach for your cup — notice it. Feel its weight. Its warmth. Its uniqueness. Let this small detail make your day a little more beautiful.',
        ],
      },
      {
        slug: 'warmth-of-clay',
        title: 'The Warmth of Clay: Why Handmade Matters',
        date: 'February 28, 2024',
        excerpt:
          'In a world of mass production, choosing handmade is an act of quiet resistance — and profound connection.',
        body: [
          'When you hold a handmade ceramic piece, you hold more than just an object. You hold time. A decision. The hand movements that created form.',
          'A mass-produced item is perfect — identical to every other item of the same shape. It has no biography. A handmade piece has small imperfections — a slightly asymmetric rim, the trace of a glaze flow, a place where fingers left a mark on wet clay.',
          'Those imperfections are not defects. They are proof that someone with hands and a heart created what you are now holding.',
          'In choosing handmade, you support not just the craftsperson. You support the idea that objects can have meaning. That beauty can be human. That a home environment can feel not like a catalogue, but like a lived story.',
        ],
      },
      {
        slug: 'handmade-details',
        title: 'Handmade Details: Building a Home That Feels Like You',
        date: 'March 8, 2024',
        excerpt:
          'Your home doesn\'t need to be perfect. It needs to be filled with things that make you feel something.',
        body: [
          'Interior magazines are full of perfect homes. Perfect sofas, perfectly coordinated cushions, perfectly arranged cacti. And somehow — they all look the same.',
          'Real homes look different. They have sagging shelves full of books you love. A cup received as a birthday gift. A bowl bought from a ceramicist you spoke with for twenty minutes about clay and life.',
          'Those objects tell your story. They are the melody of your home — unique, unrepeatable, entirely yours.',
          'That is why I create each piece with the thought: perhaps this will become part of someone\'s home story. Perhaps this vase will stand in a room where children\'s laughter rings. Perhaps this cup will be in someone\'s hand every morning.',
          'That is enough for me. That is the meaning.',
        ],
      },
    ],
  },

  contact: {
    headline: 'Get in Touch',
    subheadline: 'I\'d love to hear from you.',
    intro:
      'Whether you\'re curious about a specific piece, interested in custom work, or simply want to connect about the craft of ceramics — please reach out.',
    emailLabel: 'Email',
    studioLabel: 'Studio',
    studioValue: 'By appointment only\nPlease email to schedule a visit',
    socialHeading: 'Social',
    closing: 'Take it into your hands and feel the warmth of clay.',
  },

  footer: {
    tagline: 'Take it into your hands and feel the warmth of clay.',
    exploreHeading: 'Explore',
    connectHeading: 'Connect',
    copyright: 'DKeramik. All rights reserved.',
    links: {
      portfolio: 'Portfolio',
      craft: 'Our Craft',
      journal: 'Journal',
    },
  },

  common: {
    handcraftedWith: 'Handcrafted with care',
    languageSwitchLabel: 'LT',
  },
};
