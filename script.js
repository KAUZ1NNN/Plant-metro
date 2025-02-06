function generateSchedule() {
    const startDate = document.getElementById("startDate").value;
    if (!startDate) return alert("Por favor, insira uma data de início.");
    
    let schedule = [];
    let currentDate = new Date(startDate);
    let tableBody = document.querySelector("#schedule tbody");
    tableBody.innerHTML = "";
    
    for (let i = 0; i < 30; i += 4) { // Gera escala para 1 mês
        let workDay = new Date(currentDate);
        schedule.push({ date: workDay.toISOString().split('T')[0], type: "Trabalho" });
        
        for (let j = 1; j <= 3; j++) {
            let restDay = new Date(workDay);
            restDay.setDate(restDay.getDate() + j);
            schedule.push({ date: restDay.toISOString().split('T')[0], type: "Folga" });
        }
        
        currentDate.setDate(currentDate.getDate() + 4);
    }

    // Salva a escala gerada no localStorage
    localStorage.setItem("schedule", JSON.stringify(schedule));

    schedule.forEach(entry => addRow(entry.date, entry.type));
}

function addRow(date, type) {
    let tableBody = document.querySelector("#schedule tbody");
    let row = tableBody.insertRow();
    row.insertCell(0).innerText = date;
    let typeCell = row.insertCell(1);
    typeCell.innerText = type;

    // Adiciona cor conforme o tipo
    if (type === "Trabalho") {
        row.classList.add('work-day');
    } else if (type === "Folga") {
        row.classList.add('rest-day');
    } else if (type === "Extra Diurno") {
        row.classList.add('day-extra');
    } else if (type === "Extra Noturno") {
        row.classList.add('night-extra');
    }

    let actionCell = row.insertCell(2);
    
    if (type === "Folga") {
        let btnDay = document.createElement("button");
        btnDay.innerText = "Extra Diurno";
        btnDay.onclick = function() { updateRow(row, "Extra Diurno"); };
        
        let btnNight = document.createElement("button");
        btnNight.innerText = "Extra Noturno";
        btnNight.onclick = function() { updateRow(row, "Extra Noturno"); };
        
        actionCell.appendChild(btnDay);
        actionCell.appendChild(btnNight);
    } else {
        let btnRemove = document.createElement("button");
        btnRemove.innerText = "Remover Extra";
        btnRemove.onclick = function() { updateRow(row, "Folga"); };
        actionCell.appendChild(btnRemove);
    }
}

function updateRow(row, newType) {
    row.cells[1].innerText = newType;
    let actionCell = row.cells[2];
    actionCell.innerHTML = "";

    // Remove classes antigas
    row.classList.remove('rest-day', 'work-day', 'night-extra', 'day-extra');

    // Define nova classe de cor
    if (newType === "Folga") {
        row.classList.add('rest-day');
        let btnDay = document.createElement("button");
        btnDay.innerText = "Extra Diurno";
        btnDay.onclick = function() { updateRow(row, "Extra Diurno"); };
        
        let btnNight = document.createElement("button");
        btnNight.innerText = "Extra Noturno";
        btnNight.onclick = function() { updateRow(row, "Extra Noturno"); };
        
        actionCell.appendChild(btnDay);
        actionCell.appendChild(btnNight);
    } else if (newType === "Extra Diurno") {
        row.classList.add('day-extra');
        let btnRemove = document.createElement("button");
        btnRemove.innerText = "Remover Extra";
        btnRemove.onclick = function() { updateRow(row, "Folga"); };
        actionCell.appendChild(btnRemove);
    } else if (newType === "Extra Noturno") {
        row.classList.add('night-extra');
        let btnRemove = document.createElement("button");
        btnRemove.innerText = "Remover Extra";
        btnRemove.onclick = function() { updateRow(row, "Folga"); };
        actionCell.appendChild(btnRemove);
    } else {
        row.classList.add('work-day');
    }

    // Atualiza o localStorage
    updateLocalStorage();
}

function updateLocalStorage() {
    const scheduleData = [];
    const rows = document.querySelectorAll("#schedule tbody tr");

    rows.forEach(row => {
        let date = row.cells[0].innerText;
        let type = row.cells[1].innerText;
        scheduleData.push({ date, type });
    });

    // Salva a escala atualizada no localStorage
    localStorage.setItem("schedule", JSON.stringify(scheduleData));
}

// Função para carregar os dados do localStorage ao iniciar
function loadSchedule() {
    const savedSchedule = JSON.parse(localStorage.getItem("schedule"));

    if (savedSchedule) {
        savedSchedule.forEach(entry => addRow(entry.date, entry.type));
    }
}

// Chama a função de carregamento quando a página for carregada
document.addEventListener("DOMContentLoaded", loadSchedule);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Service Worker registrado!"))
        .catch(err => console.log("Erro no Service Worker:", err));
}
