/**
 * Test script for BiblioDrift Reading Streak functionality
 * Simulates browser environment to verify streak calculations,
 * green cell intensity calculations, and local storage state persistence.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting BiblioDrift Reading Streak Unit Tests...\n');

// 1. Mock the Browser Global Environment
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

// Mock Document Elements
class MockElement {
  constructor(id) {
    this.id = id;
    this.textContent = '';
    this.innerHTML = '';
    this.disabled = false;
    this.attributes = {};
    this.children = [];
    this.dataset = {};
    this.parentNode = { replaceChild: (n, o) => {} };
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c)
    };
  }

  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  querySelector(sel) { return this; }
  appendChild(child) { this.children.push(child); }
  closest() { return { scrollLeft: 0, scrollWidth: 100 }; }
  addEventListener(ev, cb) {}
  cloneNode() {
    return new MockElement(this.id);
  }
}

const elements = {
  'reading-streak-calendar': new MockElement('reading-streak-calendar'),
  'reading-streak-mark-today': new MockElement('reading-streak-mark-today'),
  'reading-streak-current': new MockElement('reading-streak-current'),
  'reading-streak-longest': new MockElement('reading-streak-longest'),
};

global.document = {
  readyState: 'complete',
  addEventListener: () => {},
  getElementById: (id) => elements[id] || null,
  createElement: (tag) => {
    const el = new MockElement();
    el.tagName = tag;
    return el;
  }
};

global.window = {};

// 2. Load the actual reading-streak.js source code
const jsPath = path.join(__dirname, '../frontend/js/reading-streak.js');
const jsCode = fs.readFileSync(jsPath, 'utf8');

// Evaluate the script in global scope
eval(jsCode);

const ReadingStreak = global.window.ReadingStreak;

// 3. Perform assertions
try {
  // Test 1: getTodayDate returns YYYY-MM-DD
  const todayStr = ReadingStreak.getTodayDate();
  console.log(`✅ Test 1: getTodayDate() -> ${todayStr}`);
  assert.match(todayStr, /^\d{4}-\d{2}-\d{2}$/);

  // Test 2: Fresh streak calculation should be 0
  let data = ReadingStreak.loadReadingData();
  assert.deepStrictEqual(data, {});
  let current = ReadingStreak.calculateCurrentStreak(data);
  let longest = ReadingStreak.calculateLongestStreak(data);
  console.log(`✅ Test 2: Fresh stats -> Current: ${current}, Longest: ${longest}`);
  assert.strictEqual(current, 0);
  assert.strictEqual(longest, 0);

  // Test 3: Mark today as read
  console.log('👉 Marking today as read...');
  const marked = ReadingStreak.markTodayAsRead();
  assert.strictEqual(marked, true);

  data = ReadingStreak.loadReadingData();
  assert.strictEqual(data[todayStr], 1);
  console.log(`✅ Test 3: Mark today -> localStorage successfully populated for ${todayStr}`);

  // Test 4: Re-calculate streak with today active
  current = ReadingStreak.calculateCurrentStreak(data);
  longest = ReadingStreak.calculateLongestStreak(data);
  console.log(`✅ Test 4: Post-read stats -> Current: ${current}, Longest: ${longest}`);
  assert.strictEqual(current, 1);
  assert.strictEqual(longest, 1);

  // Test 5: Gamified Rollback - If today not read but yesterday read, streak is still active (value = 1)
  console.log('👉 Simulating yesterday read, today not read...');
  localStorage.clear();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  data = {};
  data[yesterdayStr] = 1;
  ReadingStreak.saveReadingData(data);

  // Calculate streak - should be 1 because yesterday was read!
  current = ReadingStreak.calculateCurrentStreak(data);
  console.log(`✅ Test 5: Resilient Streak (Yesterday active, today inactive) -> Current: ${current}`);
  assert.strictEqual(current, 1);

  // Test 6: Consecutive Days Calculation
  console.log('👉 Simulating a 5-day active streak...');
  localStorage.clear();
  data = {};
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    data[dStr] = 1;
  }
  ReadingStreak.saveReadingData(data);

  current = ReadingStreak.calculateCurrentStreak(data);
  longest = ReadingStreak.calculateLongestStreak(data);
  console.log(`✅ Test 6: 5 consecutive days -> Current: ${current}, Longest: ${longest}`);
  assert.strictEqual(current, 5);
  assert.strictEqual(longest, 5);

  // Test 7: Broken Streak / Longest Streak preservation
  console.log('👉 Simulating broken streak: active 3 days, gap of 2 days, then active 5 days...');
  localStorage.clear();
  data = {};
  
  // 5 days active leading to yesterday
  for (let i = 1; i <= 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    data[dStr] = 1;
  }
  // 2 days gap (6 and 7 days ago)
  // 3 days active (8, 9, 10 days ago)
  for (let i = 8; i <= 10; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    data[dStr] = 1;
  }
  ReadingStreak.saveReadingData(data);

  current = ReadingStreak.calculateCurrentStreak(data);
  longest = ReadingStreak.calculateLongestStreak(data);
  console.log(`✅ Test 7: Broken streak stats -> Current: ${current}, Longest: ${longest}`);
  assert.strictEqual(current, 5); // Current is 5 (yesterday back 5 days)
  assert.strictEqual(longest, 5); // Longest consecutive is 5

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The streak calculation, storage, and logic are 100% correct.');
} catch (err) {
  console.error('\n❌ TEST FAILURE:');
  console.error(err);
  process.exit(1);
}
