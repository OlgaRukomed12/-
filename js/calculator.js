/* ============================================
   Логика калькулятора семейного бюджета
   ============================================ */

function getValue(id) {
  return Number(document.getElementById(id).value) || 0;
}

function formatRubles(amount) {
  return amount.toLocaleString("ru-RU") + " ₽";
}

function calculateBudget() {
  const incomes = {
    salary1: getValue("salary1"),
    salary2: getValue("salary2"),
    extraIncome: getValue("extraIncome"),
    otherIncome: getValue("otherIncome")
  };

  const expenses = {
    "Жильё / ипотека / аренда": getValue("housing"),
    "Продукты": getValue("food"),
    "Коммунальные услуги": getValue("utilities"),
    "Транспорт": getValue("transport"),
    "Связь и интернет": getValue("internet"),
    "Кредиты": getValue("loans"),
    "Образование": getValue("education"),
    "Здоровье": getValue("health"),
    "Развлечения": getValue("entertainment"),
    "Прочие расходы": getValue("otherExpenses")
  };

  const totalIncome =
    incomes.salary1 +
    incomes.salary2 +
    incomes.extraIncome +
    incomes.otherIncome;

  let totalExpenses = 0;

  for (const category in expenses) {
    totalExpenses += expenses[category];
  }

  const balance = totalIncome - totalExpenses;
  const recommendedSavings = totalIncome * 0.1;
  const expensePercent = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  document.getElementById("totalIncome").textContent = formatRubles(totalIncome);
  document.getElementById("totalExpenses").textContent = formatRubles(totalExpenses);
  document.getElementById("balance").textContent = formatRubles(balance);
  document.getElementById("recommendedSavings").textContent = formatRubles(recommendedSavings);

  const progress = document.getElementById("expenseProgress");
  const roundedPercent = Math.min(expensePercent, 100).toFixed(0);

  progress.style.width = roundedPercent + "%";
  progress.textContent = expensePercent.toFixed(1) + "%";

  if (expensePercent <= 50) {
    progress.style.background = "#16a34a";
  } else if (expensePercent <= 80) {
    progress.style.background = "#f59e0b";
  } else {
    progress.style.background = "#dc2626";
  }

  createExpenseTable(expenses, totalExpenses);
  createAnalysis(totalIncome, totalExpenses, balance, recommendedSavings, expensePercent);
}

function createExpenseTable(expenses, totalExpenses) {
  const table = document.getElementById("expenseTable");
  table.innerHTML = "";

  for (const category in expenses) {
    const amount = expenses[category];

    if (amount > 0) {
      const percent = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;

      table.innerHTML += `
        <tr>
          <td>${category}</td>
          <td>${formatRubles(amount)}</td>
          <td>${percent.toFixed(1)}%</td>
        </tr>
      `;
    }
  }

  if (table.innerHTML === "") {
    table.innerHTML = `
      <tr>
        <td colspan="3">Расходы не указаны</td>
      </tr>
    `;
  }
}

function createAnalysis(totalIncome, totalExpenses, balance, recommendedSavings, expensePercent) {
  const analysis = document.getElementById("analysis");
  let text = "";

  if (totalIncome <= 0) {
    text = "Укажите хотя бы один источник дохода, чтобы получить анализ бюджета.";
  } else if (balance > 0) {
    text = `
      Ваш семейный бюджет в плюсе. После всех расходов остаётся
      <strong>${formatRubles(balance)}</strong>.
      Рекомендуется откладывать минимум 10% дохода —
      <strong>${formatRubles(recommendedSavings)}</strong> в месяц.
    `;

    if (expensePercent <= 50) {
      text += " У вас хороший уровень расходов: семья тратит меньше половины дохода.";
    } else if (expensePercent <= 80) {
      text += " Расходы находятся на среднем уровне. Желательно следить за необязательными тратами.";
    } else {
      text += " Расходы занимают слишком большую часть дохода. Лучше пересмотреть крупные статьи бюджета.";
    }
  } else if (balance === 0) {
    text = `
      Ваш бюджет полностью сбалансирован: доходы равны расходам.
      Но накоплений не остаётся. Желательно сократить часть расходов или увеличить доход.
    `;
  } else {
    text = `
      Ваш бюджет в минусе на <strong>${formatRubles(Math.abs(balance))}</strong>.
      Расходы превышают доходы. Рекомендуется срочно пересмотреть траты, особенно кредиты, развлечения и прочие расходы.
    `;
  }

  analysis.innerHTML = text;
}

function resetCalculator() {
  document.querySelectorAll("#calculator input").forEach((input) => {
    input.value = "";
  });

  document.getElementById("totalIncome").textContent = "0 ₽";
  document.getElementById("totalExpenses").textContent = "0 ₽";
  document.getElementById("balance").textContent = "0 ₽";
  document.getElementById("recommendedSavings").textContent = "0 ₽";

  const progress = document.getElementById("expenseProgress");
  progress.style.width = "0%";
  progress.textContent = "0%";

  document.getElementById("analysis").textContent =
    "Введите доходы и расходы, затем нажмите кнопку «Рассчитать бюджет».";

  document.getElementById("expenseTable").innerHTML = `
    <tr>
      <td colspan="3">Данные появятся после расчёта</td>
    </tr>
  `;
}
