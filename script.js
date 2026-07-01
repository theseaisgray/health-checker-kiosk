const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzbE2Cdw8WKhgyHbKWCHCASlgjcsC8SF-lR1RuahWlFbNIMtbAnit_uXMTTnijntChOTw/exec';

const submissionHistory = [];

const form = document.getElementById('bmiForm');
const resultCard = document.getElementById('resultCard');
const resultCategory = document.getElementById('resultCategory');
const resultBMI = document.getElementById('resultBMI');
const resultMessage = document.getElementById('resultMessage');
const resetBtn = document.getElementById('resetBtn');
const historyList = document.getElementById('historyList');

function validateFields() {
  const requiredFields = [
    { id: 'name', label: 'Full Name', type: 'text' },
    { id: 'age', label: 'Age', type: 'number' },
    { id: 'sex', label: 'Sex', type: 'select' },
    { id: 'weight', label: 'Weight', type: 'number' },
    { id: 'height', label: 'Height', type: 'number' },
  ];

  let isValid = true;
  const values = {};

  for (const field of requiredFields) {
    document.getElementById(field.id).classList.remove('invalid');
    document.getElementById('err-' + field.id).textContent = '';
  }
  document.getElementById('err-consent').textContent = '';
  document.getElementById('consent').classList.remove('invalid');

  for (const field of requiredFields) {
    const el = document.getElementById(field.id);
    const rawValue = el.value.trim();
    const errEl = document.getElementById('err-' + field.id);

    if (field.type === 'text') {
      if (rawValue === '') {
        errEl.textContent = `${field.label} is required.`;
        el.classList.add('invalid');
        isValid = false;
      } else {
        values[field.id] = rawValue;
      }
    } else if (field.type === 'select') {
      if (rawValue === '') {
        errEl.textContent = `Please select your ${field.label.toLowerCase()}.`;
        el.classList.add('invalid');
        isValid = false;
      } else {
        values[field.id] = rawValue;
      }
    } else if (field.type === 'number') {
      const num = parseFloat(rawValue);
      if (rawValue === '' || isNaN(num) || num <= 0) {
        errEl.textContent = `Enter a valid ${field.label.toLowerCase()} greater than 0.`;
        el.classList.add('invalid');
        isValid = false;
      } else if (field.id === 'age' && (num < 1 || num > 120)) {
        errEl.textContent = 'Age must be between 1 and 120.';
        el.classList.add('invalid');
        isValid = false;
      } else {
        values[field.id] = num;
      }
    }
  }

  // Consent checkbox check
  const consentEl = document.getElementById('consent');
  if (!consentEl.checked) {
    document.getElementById('err-consent').textContent = 'You must consent to submit.';
    consentEl.classList.add('invalid');
    isValid = false;
  }

  return isValid ? values : null;
}

function computeBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

function classifyBMI(bmi) {
  let category, message, cssClass;

  switch (true) {
    case bmi < 18.5:
      category = 'Underweight';
      cssClass = 'category-underweight';
      message = 'You are below the healthy weight range. Consider a balanced, calorie-sufficient diet and consult a nutritionist if needed.';
      break;
    case bmi < 25:
      category = 'Normal';
      cssClass = 'category-normal';
      message = 'Great! Your BMI is within the healthy range. Keep up your current habits.';
      break;
    case bmi < 30:
      category = 'Overweight';
      cssClass = 'category-overweight';
      message = 'You are slightly above the healthy range. Consider more physical activity and mindful eating.';
      break;
    default:
      category = 'Obese';
      cssClass = 'category-obese';
      message = 'Your BMI suggests a higher health risk. We recommend consulting a healthcare provider.';
  }

  return { category, message, cssClass };
}

function showResult(name, bmi, category, message, cssClass) {
  resultCard.classList.remove('hidden', 'category-underweight', 'category-normal', 'category-overweight', 'category-obese');
  resultCard.classList.add(cssClass);
  resultCategory.textContent = `${name}, your result: ${category}`;
  resultBMI.textContent = `BMI: ${bmi}`;
  resultMessage.textContent = message;
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderHistory() {
  historyList.innerHTML = '';

  if (submissionHistory.length === 0) {
    historyList.innerHTML = '<li class="empty-state">No submissions yet.</li>';
    return;
  }

  submissionHistory.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>#${index + 1} ${entry.name} — BMI ${entry.bmi}</span>
      <span class="badge ${entry.cssClass}">${entry.category}</span>
    `;
    historyList.appendChild(li);
  });
}

function recordSubmission(record) {
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(record),
  }).catch(err => console.error('Could not record submission:', err));
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const values = validateFields();
  if (!values) {
    return; 
  }

  const bmi = computeBMI(values.weight, values.height);
  const { category, message, cssClass } = classifyBMI(bmi);

  showResult(values.name, bmi, category, message, cssClass);

  const record = {
    name: values.name,
    age: values.age,
    sex: values.sex,
    weight: values.weight,
    heightCm: values.height,
    bmi,
    category,
  };

  submissionHistory.push({ ...record, cssClass });
  renderHistory();
  recordSubmission(record);

  form.reset();
});

resetBtn.addEventListener('click', function () {
  resultCard.classList.add('hidden');
  form.reset();
  document.getElementById('name').focus();
});