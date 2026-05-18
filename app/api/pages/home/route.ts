import { NextRequest, NextResponse } from 'next/server';

let homePageData = {
  stats: [
    { number: '1984', label: 'Founded in London', prefix: '', suffix: '' },
    { number: '9001', label: 'Quality Certified', prefix: 'ISO ', suffix: '' },
    { number: '10', label: 'Worldwide Shipping', prefix: '', suffix: '+' },
    { number: '20K', label: 'End Users', prefix: '', suffix: '+' },
  ],
  about: {
    sectionLabel: 'ABOUT TUK LTD',
    heading: 'TUK SPECIALISES IN',
    points: [
      'Cat 5e, 6 & 6A connectivity',
      'UK telephone connectivity',
      'US RJ type modular plugs and sockets',
      'Handtools for voice and data cabling systems',
      '19 inch related metalwork',
      'OEM production of related products',
    ],
    description:
      'TUK supplies manufacturers, wholesalers and distributors, focusing primarily on trade customers. ',
    badges: [
      'ISO 9001 Certified',
      'B2B Trade Only',
      'UK Manufactured',
      'Technical Support',
    ],
  },
  vision: {
    missionTitle: 'Our Mission',
    missionText:
      "Our mission is to deliver reliable passive data and multimedia connectivity systems through a continuously evolving product range. We focus on quality, innovation, and dependable performance while providing high-value solutions and exceptional service.",
    coreValuesTitle: 'Our Core Values',
    coreValuesText:
      'Our values guide the way we deliver our mission. We are passionate about providing excellent value and service while building long-term partnerships with our customers. We value, respect, and trust one another, take pride in working together as a strong team, and remain committed to completing our work efficiently and to the highest standards.',
  },
  productGuide: {
    heading: 'Get the 2025 Product Guide',
    subheading:
      'Detailed specifications, installation diagrams, and the full SPEEDY RJ45 range. Direct to your inbox.',
    buttonText: 'Send PDF Guide',
  },
  contactBar: {
    headOffice: {
      title: 'Head Office',
      line1: 'TUK Ltd, Wimbledon',
      line2: 'London, SW19, UK',
    },
    salesEnquiries: {
      title: 'Sales Enquiries',
      line1: '+44 (0)20 8946 6688',
    },
    email: {
      title: 'Email',
      line1: 'sales@tuk.co.uk',
    },
    certifications: {
      title: 'Certifications',
      line1: 'ISO 9001:2015',
      line2: 'UKCA & CE Marked',
    },
  },
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(homePageData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch home page data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    homePageData = { ...homePageData, ...body };
    return NextResponse.json(
      { message: 'Home page updated successfully', data: homePageData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update home page data' },
      { status: 500 }
    );
  }
}
