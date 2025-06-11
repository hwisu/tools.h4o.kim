const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const unit1 = document.getElementById('unit1');
const unit2 = document.getElementById('unit2');
const formulaDisplay = document.getElementById('formulaDisplay');
const commonConversions = document.getElementById('commonConversions');
const tabButtons = document.querySelectorAll('.tab-btn');

let currentCategory = 'length';
let isUpdating = false; // Prevent infinite loops

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

// Common conversion pairs for each category
const commonConversionPairs = {
  length: [
    ['meter', 'foot'],
    ['kilometer', 'mile'],
    ['centimeter', 'inch'],
    ['yard', 'meter']
  ],
  weight: [
    ['kilogram', 'pound'],
    ['gram', 'ounce'],
    ['ton', 'pound'],
    ['stone', 'kilogram']
  ],
  temperature: [
    ['celsius', 'fahrenheit'],
    ['celsius', 'kelvin'],
    ['fahrenheit', 'kelvin']
  ],
  area: [
    ['square_meter', 'square_foot'],
    ['hectare', 'acre'],
    ['square_kilometer', 'square_mile']
  ],
  volume: [
    ['liter', 'gallon'],
    ['milliliter', 'fluid_ounce'],
    ['cubic_meter', 'liter']
  ],
  speed: [
    ['kilometer_per_hour', 'mile_per_hour'],
    ['meter_per_second', 'foot_per_second'],
    ['knot', 'kilometer_per_hour']
  ],
  energy: [
    ['kilocalorie', 'kilojoule'],
    ['kilowatt_hour', 'joule'],
    ['btu', 'joule']
  ],
  pressure: [
    ['bar', 'psi'],
    ['atmosphere', 'pascal'],
    ['torr', 'pascal']
  ]
};

// Initialize
function init() {
  setupTabs();
  loadUnits(currentCategory);
  setupEventListeners();
  setDefaultValues();
  updateCommonConversions();
}

function setupTabs() {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentCategory = button.dataset.category;
      loadUnits(currentCategory);
      setDefaultValues();
      updateCommonConversions();
    });
  });
}

function loadUnits(category) {
  const categoryData = units[category];
  if (!categoryData) return;

  // Clear existing options
  unit1.innerHTML = '';
  unit2.innerHTML = '';

  // Add units to select elements
  Object.keys(categoryData.units).forEach(unitKey => {
    const unit = categoryData.units[unitKey];
    const option1 = new Option(`${unit.symbol} (${unit.name})`, unitKey);
    const option2 = new Option(`${unit.symbol} (${unit.name})`, unitKey);
    unit1.appendChild(option1);
    unit2.appendChild(option2);
  });

  // Set default units (first two different units)
  const unitKeys = Object.keys(categoryData.units);
  if (unitKeys.length >= 2) {
    unit1.value = unitKeys[0];
    unit2.value = unitKeys[1];
  }
}

function setDefaultValues() {
  input1.value = '1';
  input2.value = '';
  convertFromFirst();
}

function setupEventListeners() {
  input1.addEventListener('input', () => {
    if (!isUpdating) {
      convertFromFirst();
    }
  });

  input2.addEventListener('input', () => {
    if (!isUpdating) {
      convertFromSecond();
    }
  });

  unit1.addEventListener('change', () => {
    if (input1.value) {
      convertFromFirst();
    }
    updateCommonConversions();
  });

  unit2.addEventListener('change', () => {
    if (input2.value) {
      convertFromSecond();
    }
    updateCommonConversions();
  });
}

function convertFromFirst() {
  const value = parseFloat(input1.value);
  if (isNaN(value) || value === '') {
    isUpdating = true;
    input2.value = '';
    formulaDisplay.textContent = '';
    isUpdating = false;
    return;
  }

  const fromUnit = unit1.value;
  const toUnit = unit2.value;

  if (!fromUnit || !toUnit) return;

  const result = convertValue(value, fromUnit, toUnit, currentCategory);

  isUpdating = true;
  input2.value = formatNumber(result);
  isUpdating = false;

  updateFormula(value, fromUnit, result, toUnit);
}

function convertFromSecond() {
  const value = parseFloat(input2.value);
  if (isNaN(value) || value === '') {
    isUpdating = true;
    input1.value = '';
    formulaDisplay.textContent = '';
    isUpdating = false;
    return;
  }

  const fromUnit = unit2.value;
  const toUnit = unit1.value;

  if (!fromUnit || !toUnit) return;

  const result = convertValue(value, fromUnit, toUnit, currentCategory);

  isUpdating = true;
  input1.value = formatNumber(result);
  isUpdating = false;

  updateFormula(result, toUnit, value, fromUnit);
}

function convertValue(value, fromUnitKey, toUnitKey, category) {
  if (fromUnitKey === toUnitKey) return value;

  if (category === 'temperature') {
    return convertTemperature(value, fromUnitKey, toUnitKey);
  } else {
    return convertStandard(value, fromUnitKey, toUnitKey, units[category]);
  }
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

function updateFormula(value1, unit1Key, value2, unit2Key) {
  const categoryData = units[currentCategory];
  const unit1Data = categoryData.units[unit1Key];
  const unit2Data = categoryData.units[unit2Key];

  const formula = `${formatNumber(value1)} ${unit1Data.symbol} = ${formatNumber(value2)} ${unit2Data.symbol}`;
  formulaDisplay.textContent = formula;
}

function updateCommonConversions() {
  const pairs = commonConversionPairs[currentCategory] || [];
  let html = '';

  pairs.forEach(pair => {
    const [unit1Key, unit2Key] = pair;
    const unit1Data = units[currentCategory].units[unit1Key];
    const unit2Data = units[currentCategory].units[unit2Key];

    if (unit1Data && unit2Data) {
      const converted = convertValue(1, unit1Key, unit2Key, currentCategory);

      html += `
        <div class="conversion-item" onclick="setConversion('${unit1Key}', '${unit2Key}')">
          <div class="conversion-label">1 ${unit1Data.symbol} =</div>
          <div class="conversion-value">${formatNumber(converted)} ${unit2Data.symbol}</div>
        </div>
      `;
    }
  });

  commonConversions.innerHTML = html;
}

function setConversion(fromUnit, toUnit) {
  unit1.value = fromUnit;
  unit2.value = toUnit;
  input1.value = '1';
  convertFromFirst();
}

// Make setConversion global for onclick handlers
window.setConversion = setConversion;

// Initialize when page loads
init();
