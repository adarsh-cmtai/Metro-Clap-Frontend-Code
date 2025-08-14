import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ServicesPageClient from './ServicesPageClient';

export default function ServicesPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            </div>
        }>
            <ServicesPageClient />
        </Suspense>
    );
}
