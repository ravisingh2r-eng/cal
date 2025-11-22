/**
 * Local Storage Manager
 * Handles calculation history and user preferences
 */

(function() {
    'use strict';

    const STORAGE_KEYS = {
        HISTORY: 'calc-history',
        PREFERENCES: 'calc-preferences',
        FAVORITES: 'calc-favorites'
    };

    const MAX_HISTORY_ITEMS = 50;

    /**
     * Save calculation to history
     */
    function saveCalculation(calculatorType, inputs, result) {
        const history = getHistory();

        const calculation = {
            id: Date.now(),
            type: calculatorType,
            inputs: inputs,
            result: result,
            timestamp: new Date().toISOString()
        };

        history.unshift(calculation);

        // Limit history size
        if (history.length > MAX_HISTORY_ITEMS) {
            history.pop();
        }

        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

        return calculation;
    }

    /**
     * Get calculation history
     */
    function getHistory(calculatorType = null) {
        try {
            const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');

            if (calculatorType) {
                return history.filter(calc => calc.type === calculatorType);
            }

            return history;
        } catch (e) {
            console.error('Error reading history:', e);
            return [];
        }
    }

    /**
     * Clear calculation history
     */
    function clearHistory(calculatorType = null) {
        if (calculatorType) {
            const history = getHistory();
            const filtered = history.filter(calc => calc.type !== calculatorType);
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
        } else {
            localStorage.removeItem(STORAGE_KEYS.HISTORY);
        }
    }

    /**
     * Delete specific calculation from history
     */
    function deleteCalculation(id) {
        const history = getHistory();
        const filtered = history.filter(calc => calc.id !== id);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
    }

    /**
     * Save user preference
     */
    function savePreference(key, value) {
        const preferences = getPreferences();
        preferences[key] = value;
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    }

    /**
     * Get user preference
     */
    function getPreference(key, defaultValue = null) {
        const preferences = getPreferences();
        return preferences[key] !== undefined ? preferences[key] : defaultValue;
    }

    /**
     * Get all preferences
     */
    function getPreferences() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES) || '{}');
        } catch (e) {
            console.error('Error reading preferences:', e);
            return {};
        }
    }

    /**
     * Add calculator to favorites
     */
    function addFavorite(calculatorType) {
        const favorites = getFavorites();
        if (!favorites.includes(calculatorType)) {
            favorites.push(calculatorType);
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        }
    }

    /**
     * Remove calculator from favorites
     */
    function removeFavorite(calculatorType) {
        const favorites = getFavorites();
        const filtered = favorites.filter(calc => calc !== calculatorType);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    }

    /**
     * Get favorite calculators
     */
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
        } catch (e) {
            console.error('Error reading favorites:', e);
            return [];
        }
    }

    /**
     * Check if calculator is favorited
     */
    function isFavorite(calculatorType) {
        return getFavorites().includes(calculatorType);
    }

    /**
     * Export history as JSON
     */
    function exportHistory() {
        const history = getHistory();
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `calculator-history-${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Import history from JSON
     */
    function importHistory(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const history = JSON.parse(e.target.result);
                    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
                    resolve(history);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Get storage usage info
     */
    function getStorageInfo() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }

        return {
            used: total,
            usedKB: (total / 1024).toFixed(2),
            historyCount: getHistory().length,
            favoritesCount: getFavorites().length
        };
    }

    /**
     * Clear all storage
     */
    function clearAll() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    // Export public API
    window.StorageManager = {
        saveCalculation,
        getHistory,
        clearHistory,
        deleteCalculation,
        savePreference,
        getPreference,
        getPreferences,
        addFavorite,
        removeFavorite,
        getFavorites,
        isFavorite,
        exportHistory,
        importHistory,
        getStorageInfo,
        clearAll
    };

})();
