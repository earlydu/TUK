import { NextRequest, NextResponse } from 'next/server';

// Initial about page data
let aboutPageData = {
  id: '2',
  title: 'About Page',
  slug: 'about',
  hero: {
    title: 'High-Performance Cabling Built to Last',
    subtitle:
      ' manufacturing excellence in voice and data infrastructure since 1984.',
    badges: [
      { icon: 'IconShieldCheck', text: 'ISO 9001:2015 Certified' },
      { icon: 'IconMapPin', text: 'Based in London, UK' },
    ],
  },
  heritage: {
    subtitle: 'Established 1984',
    title: 'Our Heritage of Innovation',
    content: [
      'Originally founded in 1984, TUK Ltd is based in South West London and has manufacturing facilities both in the UK and Far East. For nearly four decades, we have been at the forefront of the cabling industry.',
      'The quality of our products is ensured through ISO 9001 manufacturing and a two-stage quality assurance procedure, making us a trusted partner for telecommunications, data centres, and enterprise networking.',
      'Our commitment to excellence has allowed us to grow from a small local supplier to an international distributor of high-performance RJ45 solutions, multimedia connectors, and modular patch panels.',
    ],
    image: '/image/about.png',
    experience: '40+',
    experienceText: 'Years Experience',
  },
  mission: {
    title: 'Our Mission',
    description:
      'Our mission is to deliver reliable passive data and multimedia connectivity systems through a continuously evolving product range. We focus on quality, innovation, and dependable performance while providing high-value solutions and exceptional service that support our customers\' communication infrastructure and long-term success.',
    bigImage: '/image/about1.png',
    smallImage: '/image/about.png',
  },
  iso: {
    title: 'ISO 9001:2015 Firm',
    certNumber: 'Certification Number: GB1094',
    description:
      'Our ISO 9001 registration is a testament to our commitment to maintaining the highest standards in manufacturing and customer service across our entire product range.',
  },
  coreValues: [
    {
      icon: 'IconShieldCheck',
      title: 'Quality First',
      description: 'Exceptional build integrity defines every product we produce.',
    },
    {
      icon: 'IconBulb',
      title: 'Innovation',
      description: 'Developing patented solutions like our SPEEDY RJ45 system.',
    },
    {
      icon: 'IconLink',
      title: 'Reliability',
      description: 'Consistent lead times and high stock availability.',
    },
    {
      icon: 'IconLeaf',
      title: 'Sustainability',
      description: 'WEEE compliance and eco-conscious manufacturing processes.',
    },
    {
      icon: 'IconHeadset',
      title: 'Technical Support',
      description: 'Expert guidance from our London-based engineering team.',
    },
  ],
  weee: {
    title: 'WEEE Compliance',
    description:
      'TUK Ltd is fully registered for WEEE (Waste Electrical and Electronic Equipment) compliance, ensuring our products are disposed of responsibly at the end of their lifecycle.',
    cards: [
      {
        icon: 'IconLeaf',
        title: 'Environmental Policy',
        description:
          'We are committed to minimizing our carbon footprint through localized manufacturing and streamlined logistics to reduce transport emissions.',
      },
      {
        icon: 'IconPackage',
        title: 'Sustainable Packaging',
        description:
          'Transitioning to 100% recyclable packaging across our flagship product lines to eliminate single-use plastics from the supply chain.',
      },
    ],
  },
};

// GET request to fetch about page data
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(aboutPageData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch about page' },
      { status: 500 }
    );
  }
}

// POST request to update about page data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Update the about page data
    aboutPageData = {
      ...aboutPageData,
      ...body,
    };

    return NextResponse.json(
      { message: 'About page updated successfully', data: aboutPageData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update about page' },
      { status: 500 }
    );
  }
}
