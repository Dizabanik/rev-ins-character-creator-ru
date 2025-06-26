
import React, { useState, useCallback } from 'react';
import { Character } from '../types';
import { generateBackstory } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon } from '../constants';

interface GeminiFeatureProps {
  character: Character;
  onBackstoryGenerated: (backstory: string) => void;
}

const GeminiFeature: React.FC<GeminiFeatureProps> = ({ character, onBackstoryGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateBackstory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const backstory = await generateBackstory(character);
      onBackstoryGenerated(backstory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла неизвестная ошибка.");
    } finally {
      setIsLoading(false);
    }
  }, [character, onBackstoryGenerated]);

  return (
    <div className="mt-6">
      <button
        onClick={handleGenerateBackstory}
        disabled={isLoading || !process.env.API_KEY}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
      >
        <SparklesIcon />
        {isLoading ? "Создание вашей легенды..." : "Сгенерировать предысторию с ИИ"}
      </button>
      {!process.env.API_KEY && (
         <p className="text-xs text-yellow-400 mt-2 text-center">API ключ не настроен. Функции ИИ отключены.</p>
      )}
      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default GeminiFeature;