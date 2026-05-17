/**
 * BiblioDrift Mood-Based UI Theming
 * Provides color palettes for different reading moods.
 */

const THEMES = {
    "rainy": {
        "--theme-bg": "#eef2f5",
        "--theme-surface": "#ffffff",
        "--theme-accent": "#5a7d9a",
        "--theme-accent-light": "#a5b8c8",
        "--theme-text": "#2c3e50",
        "--theme-text-muted": "#7f8c8d",
        "--theme-border": "#d1d9e0",
        "--theme-pill-bg": "#f0f4f7"
    },
    "cozy": {
        "--theme-bg": "#fcf9f2",
        "--theme-surface": "#ffffff",
        "--theme-accent": "#b68d40",
        "--theme-accent-light": "#d4a373",
        "--theme-text": "#4a3728",
        "--theme-text-muted": "#8b7355",
        "--theme-border": "#e9e4d9",
        "--theme-pill-bg": "#f7f3e9"
    },
    "dark-academia": {
        "--theme-bg": "#1c1c1c",
        "--theme-surface": "#2a2a2a",
        "--theme-accent": "#8b4513",
        "--theme-accent-light": "#a0522d",
        "--theme-text": "#e0d5cb",
        "--theme-text-muted": "#a89a8e",
        "--theme-border": "#3e3e3e",
        "--theme-pill-bg": "#333333"
    },
    "ocean": {
        "--theme-bg": "#f0f8ff",
        "--theme-surface": "#ffffff",
        "--theme-accent": "#0077be",
        "--theme-accent-light": "#5dade2",
        "--theme-text": "#003366",
        "--theme-text-muted": "#546e7a",
        "--theme-border": "#add8e6",
        "--theme-pill-bg": "#e1f5fe"
    },
    "indian-authors": {
        "--theme-bg": "#fffbf0",
        "--theme-surface": "#ffffff",
        "--theme-accent": "#e67e22",
        "--theme-accent-light": "#f39c12",
        "--theme-text": "#1b5e20",
        "--theme-text-muted": "#4e342e",
        "--theme-border": "#ffe0b2",
        "--theme-pill-bg": "#fff3e0"
    }
};

/**
 * Applies a specific theme to the UI by setting CSS variables on the root element.
 * @param {string} themeName - The key of the theme to apply.
 */
function setTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) {
        console.warn("Unknown theme:", themeName);
        return;
    }

    // Apply all CSS variables defined in the theme
    Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(key, theme[key]);
    });

    // Set data attribute on html for theme-specific CSS selectors (consistent with night mode)
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Persist choice to localStorage
    localStorage.setItem("bibliodrift_theme", themeName);
}

/**
 * Restores the theme from localStorage or defaults to 'rainy'.
 */
function restoreTheme() {
    const savedTheme = localStorage.getItem("bibliodrift_theme");
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme("rainy");
    }
}

// Ensure functions are globally accessible
window.THEMES = THEMES;
window.setTheme = setTheme;
window.restoreTheme = restoreTheme;
