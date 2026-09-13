const ACHIEVEMENTS = [
    { id: 'streak_3', days: 3, title: 'Primeiros passos', description: '3 dias seguidos escrevendo no diário.' },
    { id: 'streak_7', days: 7, title: 'Uma semana forte', description: '7 dias seguidos escrevendo no diário.' },
    { id: 'streak_14', days: 14, title: 'Duas semanas de foco', description: '14 dias seguidos escrevendo no diário.' },
    { id: 'streak_30', days: 30, title: 'Um mês de dedicação', description: '30 dias seguidos escrevendo no diário.' },
    { id: 'streak_60', days: 60, title: 'Dois meses de jornada', description: '60 dias seguidos escrevendo no diário.' },
    { id: 'streak_100', days: 100, title: 'Cem dias', description: '100 dias seguidos escrevendo no diário.' },
]

function getAchievements(longestStreak) {
    return ACHIEVEMENTS.map((achievements) => ({
        ...achievements,
        unlocked: longestStreak >= achievements.days,
    }))
}

function getNewlyUnlocked(oldLongestStreak, newLongestStreak) {
    return ACHIEVEMENTS.filter(
        (achievement) =>
            oldLongestStreak < achievement.days && newLongestStreak >= achievement.days
    );
}


module.exports = { getAchievements, getNewlyUnlocked };