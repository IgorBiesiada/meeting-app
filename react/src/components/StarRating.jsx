import React, { useState } from 'react';

const StarRating = ({ meetingId, onRatingSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) return;
        
        setIsSubmitting(true);
        setMessage('');

        const url = `http://localhost:8000/api/rating/${meetingId}/`;
        
        console.log("=== START WYSYŁANIA ===");
        console.log("1. Moje meetingId to:", meetingId);
        console.log("2. Ocena jaką kliknąłem to:", rating);
        console.log("3. Mój token to:", localStorage.getItem('access_token'));
        console.log("4. Strzelam pod adres:", url);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                // Wysyłamy tylko rating, meeting jest brany z URL w backendzie
                body: JSON.stringify({ rating: rating }) 
            });

            console.log("5. Odpowiedź serwera (status):", response.status);

            if (response.ok) {
                setMessage('Dziękujemy za ocenę!');
                if (onRatingSuccess) onRatingSuccess(); 
            } else if (response.status === 400) {
                setMessage('Już oceniłeś to spotkanie lub podano błędne dane.');
            } else {
                setMessage(`Coś poszło nie tak. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("6. BŁĄD W CATCH:", error);
            setMessage('Błąd połączenia z serwerem.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-800 text-gray-100 rounded-2xl border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Oceń spotkanie</h3>
            
            <div className="flex space-x-2 mb-6">
                {[...Array(6)].map((_, index) => {
                    const ratingValue = index + 1;
                    
                    return (
                        <button
                            type="button"
                            key={ratingValue}
                            style={{
                                color: ratingValue <= (hover || rating) ? '#fbbf24' : '#4b5563',
                                fontSize: '2.5rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.2s'
                            }}
                            onClick={() => setRating(ratingValue)}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                            title={`Oceń na ${ratingValue}`}
                        >
                            ★
                        </button>
                    );
                })}
            </div>

            <button 
                onClick={handleSubmit} 
                disabled={rating === 0 || isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij ocenę'}
            </button>

            {message && (
                <p className={`mt-4 text-sm font-semibold ${message.includes('Dziękujemy') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default StarRating;