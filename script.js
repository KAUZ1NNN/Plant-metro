let currentDate = new Date();
let startDate = null;
let schedule = {};

function generateCalendar() {
    startDate = new Date(document.getElementById("startDate").value);
    if (isNaN(startDate)) {
        alert("Por favor, selecione uma data válida.");
        return;
    }
    schedule = generateSchedule(startDate);
    saveSchedule();
    renderCalendar();
}

function renderCalendar() {
    let calendar = document.getElementById("calendar");
    calendar.innerHTML = "";
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    document.getElementById("currentMonth").innerText = `${year}-${(month + 1).toString().padStart(2, '0')}`;
    
    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let todayStr = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < firstDay; i++) {
        let emptyDiv = document.createElement("div");
        calendar.appendChild(emptyDiv);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        let dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        let type = schedule[dateStr] || "rest-day";
        let dayDiv = document.createElement("div");
        dayDiv.classList.add("day", type);
        if (dateStr === todayStr) {
            dayDiv.classList.add("today");
        }
        dayDiv.innerText = day;
        dayDiv.onclick = () => toggleExtra(dayDiv, dateStr);
        calendar.appendChild(dayDiv);
    }
}

function generateSchedule(startDate) {
    let newSchedule = {};
    let workDay = new Date(startDate);
    while (workDay.getFullYear() < 2100) {  // Simula um ciclo infinito
        let workDate = new Date(workDay);
        newSchedule[workDate.toISOString().split('T')[0]] = "work-day";
        for (let j = 1; j <= 3; j++) {
            let restDay = new Date(workDate);
            restDay.setDate(restDay.getDate() + j);
            newSchedule[restDay.toISOString().split('T')[0]] = "rest-day";
        }
        workDay.setDate(workDay.getDate() + 4);
    }
    return newSchedule;
}

function toggleExtra(element, date) {
    schedule[date] = schedule[date] === "rest-day" ? "day-extra" : schedule[date] === "day-extra" ? "night-extra" : "rest-day";
    saveSchedule();
    renderCalendar();
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

function saveSchedule() {
    localStorage.setItem("pantometroSchedule", JSON.stringify(schedule));
}

function loadSchedule() {
    let savedSchedule = localStorage.getItem("pantometroSchedule");
    if (savedSchedule) {
        schedule = JSON.parse(savedSchedule);
        renderCalendar();
    }
}

document.addEventListener("DOMContentLoaded", loadSchedule);
