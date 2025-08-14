interface RecommendedServiceCardProps {
    serviceName: string;
    description: string;
    imageUrl: string;
}

export default function RecommendedServiceCard({ serviceName, description, imageUrl }: RecommendedServiceCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img src={imageUrl} alt={serviceName} className="w-full h-32 object-cover"/>
            <div className="p-4">
                <h4 className="font-semibold text-gray-800">{serviceName}</h4>
                <p className="text-xs text-gray-500 mb-3">{description}</p>
                <button className="w-full font-semibold py-2 text-sm text-red-600 border border-red-500 rounded-lg hover:bg-red-50">
                    Explore
                </button>
            </div>
        </div>
    );
}