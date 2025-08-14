// --- START OF FILE app/pro/availability/page.tsx ---

"use client";

import { useState, useEffect, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, getHours } from 'date-fns';
import { Clock, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchAvailability, updateAvailability } from '@/app/store/features/pro/proAvailabilitySlice';

const timeSlotsConfig = Array.from({ length: 12 }, (_, i) => {
    const startHour = 9 + i;
    const endHour = startHour + 1;
    const formatTime = (hour: number) => new Date(0,0,0,hour).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(' ', '');
    return {
        id: startHour,
        time: `${formatTime(startHour)} - ${formatTime(endHour)}`,
    };
});

export default function AvailabilityPage() {
    const dispatch = useAppDispatch();
    const { availability, status, error } = useAppSelector(state => state.proAvailability);
    const { token } = useAppSelector(state => state.auth);

    const [selectedDay, setSelectedDay] = useState<Date>(new Date());
    const [localUnavailableHours, setLocalUnavailableHours] = useState<number[]>([]);

    const selectedDateKey = useMemo(() => format(selectedDay, 'yyyy-MM-dd'), [selectedDay]);

    useEffect(() => {
        if (token && selectedDateKey) {
            dispatch(fetchAvailability(selectedDateKey));
        }
    }, [dispatch, token, selectedDateKey]);

    useEffect(() => {
        setLocalUnavailableHours(availability[selectedDateKey] || []);
    }, [availability, selectedDateKey]);

    const toggleSlotAvailability = (hourId: number) => {
        setLocalUnavailableHours(prev =>
            prev.includes(hourId)
                ? prev.filter(h => h !== hourId)
                : [...prev, hourId]
        );
    };

    const handleSaveChanges = () => {
        dispatch(updateAvailability({ date: selectedDateKey, unavailableHours: localUnavailableHours }));
    };

    const handleReset = () => {
        setLocalUnavailableHours(availability[selectedDateKey] || []);
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">My Availability</h1>
                <p className="text-gray-500 mt-1">Manage your schedule and block time off.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <style>{`.rdp-day_selected { background-color: #ef4444 !important; }`}</style>
                        <DayPicker
                            mode="single"
                            selected={selectedDay}
                            onSelect={(day) => day && setSelectedDay(day)}
                            className="w-full"
                            fromDate={new Date()}
                        />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center mb-6">
                            <Clock className="w-6 h-6 text-red-500 mr-3" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Time Slots</h2>
                                <p className="text-gray-500 text-sm">
                                    For {format(selectedDay, 'PPP')}
                                </p>
                            </div>
                        </div>

                        {status === 'loading' && localUnavailableHours.length === 0 ? (
                           <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-red-500"/></div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {timeSlotsConfig.map(slot => {
                                        const isAvailable = !localUnavailableHours.includes(slot.id);
                                        return (
                                            <button
                                                key={slot.id}
                                                onClick={() => toggleSlotAvailability(slot.id)}
                                                className={`p-3 rounded-lg text-center text-sm font-semibold border-2 transition-colors ${
                                                    isAvailable
                                                        ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                                                        : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                                                }`}
                                            >
                                                {slot.time}
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="mt-6 flex justify-end space-x-4">
                                    <button onClick={handleReset} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300">
                                        Reset
                                    </button>
                                    <button onClick={handleSaveChanges} disabled={status === 'loading'} className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 disabled:bg-red-300 flex items-center justify-center min-w-[120px]">
                                        {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                                    </button>
                                </div>
                                {error && <p className="text-right text-red-500 text-sm mt-2">{error}</p>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- END OF FILE app/pro/availability/page.tsx ---