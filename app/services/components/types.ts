export interface SubService {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
}

export interface Faq {
    question: string;
    answer: string;
}

export interface HowItWorksStep {
    title: string;
    description: string;
}

export interface Service {
    _id: string;
    name: string;
    slug: string;
    tagline: string;
    price: number;
    duration: string;
    imageUrl: string;
    inclusions: string[];
    exclusions: string[];
    faqs: Faq[];
    howItWorks: HowItWorksStep[];
    subServices: SubService[];
    category: string;
}

export interface CategoryWithServices {
    _id: string;
    name: string;
    locationId: string;
    services: Service[];
}

export interface CartItem {
    serviceId: string;
    serviceName: string;
    serviceImage: string;
    subService: SubService;
    quantity: number;
    price: number;
}

export interface Address {
    _id: string;
    userId: string;
    type: 'Home' | 'Office' | 'Other';
    line1: string;
    line2: string;
    city: string;
    pincode: string;
}

export interface Location {
    _id: string;
    name: string;
    city: string;
    state: string;
    pincode: string;
    isActive: boolean;
}