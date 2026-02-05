
const { performance } = require('perf_hooks');

// 1. Setup - Replicate the logic
function getEventBgColor(type) {
    switch (type) {
      case 'major': return 'bg-amber-50 dark:bg-amber-900/20';
      case 'important': return 'bg-emerald-50 dark:bg-emerald-900/20';
      case 'special': return 'bg-blue-50 dark:bg-blue-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
    }
}

// 2. Mock Data
const ITERATIONS = 100000; // Simulate many change detection cycles
const DAYS_IN_MONTH = 42; // typical 6-row calendar view
const TOTAL_OPERATIONS = ITERATIONS * DAYS_IN_MONTH;

const mockDays = [];
const types = ['major', 'important', 'special', undefined];

// Initialize data
for (let i = 0; i < DAYS_IN_MONTH; i++) {
    const type = types[i % types.length];
    mockDays.push({
        type: type,
        preComputedColor: getEventBgColor(type) // Pre-compute once
    });
}

console.log(`Running benchmark with ${TOTAL_OPERATIONS} total operations...`);

// 3. Benchmark Function Call
const startFunction = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    for (const day of mockDays) {
        const color = getEventBgColor(day.type);
    }
}
const endFunction = performance.now();
const functionDuration = endFunction - startFunction;

// 4. Benchmark Property Access
const startProperty = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    for (const day of mockDays) {
        const color = day.preComputedColor;
    }
}
const endProperty = performance.now();
const propertyDuration = endProperty - startProperty;

// 5. Results
console.log('--- Results ---');
console.log(`Function Call Approach: ${functionDuration.toFixed(4)} ms`);
console.log(`Property Access Approach: ${propertyDuration.toFixed(4)} ms`);
console.log(`Improvement: ${(functionDuration / propertyDuration).toFixed(2)}x faster`);
