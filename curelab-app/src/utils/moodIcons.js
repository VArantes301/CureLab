export const MOOD_OPTIONS = [
    { value: 0, emoji: '😭', label: 'Péssimo' },
    { value: 1, emoji: '😢', label: 'Ruim' },
    { value: 2, emoji: '😐', label: 'Neutro' },
    { value: 3, emoji: '🙂', label: 'Bom' },
    { value: 4, emoji: '😄', label: 'Muito bom' },
    { value: 5, emoji: '😁', label: 'Ótimo' },
];


export function getMoodEmoji(mood) {
    const found = MOOD_OPTIONS.find((option)=> option.value === mood)
    return found ? found.emoji : '❓';
}