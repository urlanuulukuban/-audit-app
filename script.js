// ========== ДАННЫЕ ==========

const PASSWORD = '12345';

const quizData = {
    'Бухгалтерия': [
        'Нужно ли вести кассовую книгу?',
        'Обязателен ли учёт основных средств?',
        'Нужна ли приходно-расходная ведомость?',
        'Обязателен ли месячный отчёт?',
        'Нужно ли сверять остатки денег?',
        'Обязателен ли аудит для малых предприятий?',
        'Нужна ли инвентаризация ежегодно?'
    ],
    'Налоги': [
        'Нужно ли подавать декларацию по НДС?',
        'Обязателен ли налог на прибыль?',
        'Нужно ли платить налог на имущество?',
        'Обязателен ли налог на добавленную стоимость?',
        'Нужно ли подавать ежегодно расчёт по налогам?',
        'Обязателен ли авансовый платёж?'
    ],
    'Кадры': [
        'Нужна ли кадровая служба?',
        'Обязателен ли трудовой договор?',
        'Нужно ли вести табель учёта?',
        'Обязателен ли медицинский осмотр?',
        'Нужно ли оформлять приказ при приёме?',
        'Обязателен ли расчётный лист?'
    ],
    'Документооборот': [
        'Нужно ли согласовывать документы?',
        'Обязателен ли номерной реестр?',
        'Нужна ли должностная инструкция?',
        'Обязателен ли график отпусков?',
        'Нужно ли хранить документы 3 года?'
    ],
    'Отчётность': [
        'Нужна ли квартальная отчётность?',
        'Обязательна ли бухгалтерская отчётность?',
        'Нужна ли финансовая отчётность?',
        'Обязательна ли статистическая отчётность?',
        'Нужна ли налоговая отчётность ежемесячно?'
    ]
};

// ========== ПЕРЕМЕННЫЕ СОСТОЯНИЯ ==========

let currentSection = '';
let currentQuestionIndex = 0;
let totalQuestions = 0;
let answers = [];
let allQuestions = [];

// ========== ФУНКЦИИ ИНИЦИАЛИЗАЦИИ ==========

function initQuiz() {
    // Подготовка всех вопросов
    allQuestions = [];
    Object.keys(quizData).forEach(section => {
        quizData[section].forEach(question => {
            allQuestions.push({
                section: section,
                text: question
            });
        });
    });
    
    totalQuestions = allQuestions.length;
    answers = new Array(totalQuestions).fill(null);
    currentQuestionIndex = 0;
    currentSection = '';
    
    showScreen('quizScreen');
    loadQuestion();
}

// ========== ФУНКЦИИ НАВИГАЦИИ ЭКРАНОВ ==========

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ========== ФУНКЦИИ АУТЕНТИФИКАЦИИ ==========

function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (password === PASSWORD) {
        errorMessage.textContent = '';
        initQuiz();
    } else {
        errorMessage.textContent = '❌ Неверный пароль!';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// Вход по Enter
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('passwordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
});

// ========== ФУНКЦИИ ВИКТОРИНЫ ==========

function loadQuestion() {
    const question = allQuestions[currentQuestionIndex];
    
    if (question.section !== currentSection) {
        currentSection = question.section;
    }
    
    document.getElementById('sectionTitle').textContent = currentSection;
    document.getElementById('questionText').textContent = `${currentQuestionIndex + 1}. ${question.text}`;
    updateProgress();
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = 
        `Вопрос ${currentQuestionIndex + 1} из ${totalQuestions}`;
}

function answerQuestion(answer) {
    answers[currentQuestionIndex] = answer;
    nextQuestion();
}

function skipQuestion() {
    answers[currentQuestionIndex] = 'Пропущено';
    nextQuestion();
}

function nextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
}

// ========== ФУНКЦИИ РЕЗУЛЬТАТОВ ==========

function showResults() {
    const yesCount = answers.filter(a => a === 'Да').length;
    const percentage = Math.round((yesCount / totalQuestions) * 100);
    
    document.getElementById('scorePercentage').textContent = percentage + '%';
    document.getElementById('scoreText').textContent = 
        `Вы ответили "Да" на ${yesCount} из ${totalQuestions} вопросов`;
    
    // Список ответов
    const answersList = document.getElementById('answersList');
    answersList.innerHTML = '';
    
    allQuestions.forEach((q, index) => {
        const answer = answers[index];
        const item = document.createElement('div');
        item.className = 'answer-item';
        
        let answerClass = '';
        if (answer === 'Да') answerClass = 'answer-yes';
        else if (answer === 'Нет') answerClass = 'answer-no';
        else answerClass = 'answer-skip';
        
        item.innerHTML = `
            <span>${q.text}</span>
            <span class="${answerClass}">${answer}</span>
        `;
        answersList.appendChild(item);
    });
    
    showScreen('resultsScreen');
}

function downloadResults() {
    const yesCount = answers.filter(a => a === 'Да').length;
    const percentage = Math.round((yesCount / totalQuestions) * 100);
    
    let content = '=== РЕЗУЛЬТАТЫ АУДИТА ===\n\n';
    content += `Дата: ${new Date().toLocaleString('ru-RU')}\n`;
    content += `Результат: ${yesCount}/${totalQuestions} (${percentage}%)\n`;
    content += `\n=== ПОДРОБНЫЕ ОТВЕТЫ ===\n\n`;
    
    allQuestions.forEach((q, index) => {
        content += `${index + 1}. ${q.text}\n`;
        content += `   Раздел: ${q.section}\n`;
        content += `   Ответ: ${answers[index]}\n\n`;
    });
    
    // Создание файла
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit-results-${new Date().getTime()}.txt`;
    link.click();
}

function restartQuiz() {
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordInput').focus();
    showScreen('loginScreen');
}

function logout() {
    restartQuiz();
}
