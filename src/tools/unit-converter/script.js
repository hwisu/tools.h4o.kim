const inputValue = document.getElementById('inputValue');
const inputUnit = document.getElementById('inputUnit');
const conversionResults = document.getElementById('conversionResults');
const tabButtons = document.querySelectorAll('.tab-btn');

let currentCategory = 'length';

// Unit definitions with conversion factors to base unit
const units = {
  length: {
    name: 'Length',
    base: 'meter',
    units: {
      meter: { name: 'Meter', symbol: 'm', factor: 1 },
      kilometer: { name: 'Kilometer', symbol: 'km', factor: 1000 },
      centimeter: { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      millimeter: { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      inch: { name: 'Inch', symbol: 'in', factor: 0.0254 },
      foot: { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      yard: { name: 'Yard', symbol: 'yd', factor: 0.9144 },
      mile: { name: 'Mile', symbol: 'mi', factor: 1609.344 },
      nautical_mile: { name: 'Nautical Mile', symbol: 'nmi', factor: 1852 }
    }
  },
  weight: {
    name: 'Weight',
    base: 'kilogram',
    units: {
      kilogram: { name: 'Kilogram', symbol: 'kg', factor: 1 },
      gram: { name: 'Gram', symbol: 'g', factor: 0.001 },
      pound: { name: 'Pound', symbol: 'lb', factor: 0.453592 },
      ounce: { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
      ton: { name: 'Metric Ton', symbol: 't', factor: 1000 },
      stone: { name: 'Stone', symbol: 'st', factor: 6.35029 }
    }
  },
  temperature: {
    name: 'Temperature',
    base: 'celsius',
    units: {
      celsius: { name: 'Celsius', symbol: '°C' },
      fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
      kelvin: { name: 'Kelvin', symbol: 'K' }
    }
  },
  area: {
    name: 'Area',
    base: 'square_meter',
    units: {
      square_meter: { name: 'Square Meter', symbol: 'm²', factor: 1 },
      square_kilometer: { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
      square_centimeter: { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
      square_inch: { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
      square_foot: { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      acre: { name: 'Acre', symbol: 'ac', factor: 4046.86 },
      hectare: { name: 'Hectare', symbol: 'ha', factor: 10000 }
    }
  },
  volume: {
    name: 'Volume',
    base: 'liter',
    units: {
      liter: { name: 'Liter', symbol: 'L', factor: 1 },
      milliliter: { name: 'Milliliter', symbol: 'mL', factor: 0.001 },
      cubic_meter: { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      gallon: { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
      quart: { name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
      pint: { name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
      cup: { name: 'Cup (US)', symbol: 'cup', factor: 0.236588 },
      fluid_ounce: { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 }
    }
  },
  speed: {
    name: 'Speed',
    base: 'meter_per_second',
    units: {
      meter_per_second: { name: 'Meter per Second', symbol: 'm/s', factor: 1 },
      kilometer_per_hour: { name: 'Kilometer per Hour', symbol: 'km/h', factor: 0.277778 },
      mile_per_hour: { name: 'Mile per Hour', symbol: 'mph', factor: 0.44704 },
      foot_per_second: { name: 'Foot per Second', symbol: 'ft/s', factor: 0.3048 },
      knot: { name: 'Knot', symbol: 'kn', factor: 0.514444 }
    }
  },
  energy: {
    name: 'Energy',
    base: 'joule',
    units: {
      joule: { name: 'Joule', symbol: 'J', factor: 1 },
      kilojoule: { name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
      calorie: { name: 'Calorie', symbol: 'cal', factor: 4.184 },
      kilocalorie: { name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
      watt_hour: { name: 'Watt Hour', symbol: 'Wh', factor: 3600 },
      kilowatt_hour: { name: 'Kilowatt Hour', symbol: 'kWh', factor: 3600000 },
      btu: { name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.06 }
    }
  },
  pressure: {
    name: 'Pressure',
    base: 'pascal',
    units: {
      pascal: { name: 'Pascal', symbol: 'Pa', factor: 1 },
      kilopascal: { name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
      bar: { name: 'Bar', symbol: 'bar', factor: 100000 },
      atmosphere: { name: 'Atmosphere', symbol: 'atm', factor: 101325 },
      psi: { name: 'Pounds per Square Inch', symbol: 'psi', factor: 6894.76 },
      torr: { name: 'Torr', symbol: 'Torr', factor: 133.322 }
    }
  }
};

// Initialize
function init() {
  setupTabs();
  loadUnits(currentCategory);
  setupEventListeners();
}

function setupTabs() {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentCategory = button.dataset.category;
      loadUnits(currentCategory);
      clear();
    });
  });
}

function loadUnits(category) {
  const categoryData = units[category];
  if (!categoryData) return;

  // Clear existing options
  inputUnit.innerHTML = '';

  // Add units to select element
  Object.keys(categoryData.units).forEach(unitKey => {
    const unit = categoryData.units[unitKey];
    const option = new Option(`${unit.name} (${unit.symbol})`, unitKey);
    inputUnit.appendChild(option);
  });

  // Set default selection to first unit
  const unitKeys = Object.keys(categoryData.units);
  if (unitKeys.length > 0) {
    inputUnit.value = unitKeys[0];
  }
}

function setupEventListeners() {
  inputValue.addEventListener('input', convertAll);
  inputUnit.addEventListener('change', convertAll);

  // Allow conversion by pressing Enter
  inputValue.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      convertAll();
    }
  });
}

function convertAll() {
  const value = parseFloat(inputValue.value);
  if (isNaN(value) || value === '') {
    showEmptyState();
    return;
  }

  const fromUnitKey = inputUnit.value;
  const categoryData = units[currentCategory];

  if (!fromUnitKey || !categoryData) return;

  showAllConversions(value, fromUnitKey, categoryData);
}

function showAllConversions(value, fromUnitKey, categoryData) {
  let html = '';

  Object.keys(categoryData.units).forEach(unitKey => {
    if (unitKey === fromUnitKey) return; // Skip same unit

    let result;
    if (currentCategory === 'temperature') {
      result = convertTemperature(value, fromUnitKey, unitKey);
    } else {
      result = convertStandard(value, fromUnitKey, unitKey, categoryData);
    }

    const unit = categoryData.units[unitKey];
    const formattedResult = formatNumber(result);

    html += `
      <div class="result-item">
        <div class="result-info">
          <div class="result-value">${formattedResult}</div>
          <div class="result-unit">${unit.symbol} (${unit.name})</div>
        </div>
        <button class="copy-btn" onclick="copyToClipboard('${formattedResult}', this)">Copy</button>
      </div>
    `;
  });

  conversionResults.innerHTML = html;
}

function showEmptyState() {
  conversionResults.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">🔄</div>
      <div>Enter a value and select a unit to see all conversion results</div>
    </div>
  `;
}

function convertStandard(value, fromUnitKey, toUnitKey, categoryData) {
  const fromFactor = categoryData.units[fromUnitKey].factor;
  const toFactor = categoryData.units[toUnitKey].factor;

  // Convert to base unit, then to target unit
  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

function convertTemperature(value, fromUnit, toUnit) {
  // Convert to Celsius first
  let celsius;
  switch (fromUnit) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = (value - 32) * 5/9;
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
  }

  // Convert from Celsius to target
  switch (toUnit) {
    case 'celsius':
      return celsius;
    case 'fahrenheit':
      return celsius * 9/5 + 32;
    case 'kelvin':
      return celsius + 273.15;
  }
}

function formatNumber(num) {
  if (Math.abs(num) >= 1000000) {
    return num.toExponential(6);
  } else if (Math.abs(num) < 0.001 && num !== 0) {
    return num.toExponential(6);
  } else {
    return parseFloat(num.toFixed(8)).toString();
  }
}

function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    // Show success feedback
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copied');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Copy failed:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('copied');

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
    document.body.removeChild(textArea);
  });
}

function clear() {
  inputValue.value = '';
  showEmptyState();
}

// Make functions global for onclick handlers
window.copyToClipboard = copyToClipboard;
window.clear = clear;

// Initialize when page loads
init();
