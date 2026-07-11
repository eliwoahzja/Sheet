/*
 * Curated template expansion: animations, buttons, inputs & UI widgets,
 * each with a detailed step-by-step `guide` tutorial rendered on the doc page.
 * Idempotent: re-running skips entries that already exist (matched by id).
 */
const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'client/src/data/structured_content.json');
const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const templates = [];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function addTemplate(cat, name, desc, example, useCase, guide, guideNote) {
  templates.push({
    lang: 'templates',
    cat,
    shortcut: name,
    desc,
    example,
    whatItDoes: desc,
    syntax: example.split('\n')[0],
    useCase,
    shortcuts: {},
    category: cat,
    relatedIds: [],
    validParents: [],
    validChildren: [],
    browserSupport: { chrome: true, firefox: true, safari: true, edge: true },
    guide,
    guideNote,
    id: `template_curated_${slugify(cat)}_${slugify(name)}`,
  });
}

/* ============================ ANIMATIONS ============================ */

addTemplate(
  'Animations',
  'Fade In On Load',
  'A smooth fade-in entrance animation that plays when the element first appears.',
  `<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeIn 0.8s ease-out both;
}
</style>
<div class="fade-in" style="padding:24px;border-radius:12px;background:#4f46e5;color:#fff;font-family:sans-serif;">
  <h3 style="margin:0 0 8px 0;">Hello there 👋</h3>
  <p style="margin:0;">This card faded in smoothly when the page loaded.</p>
</div>`,
  'Use for hero sections, cards, or any content you want to enter gracefully instead of popping in abruptly.',
  [
    { title: '1. Define the @keyframes', detail: 'In your CSS file (or a `<style>` tag in the `<head>`), create a `@keyframes fadeIn` block. The `from` state is invisible (`opacity: 0`) and slightly pushed down (`translateY(12px)`); the `to` state is fully visible and in place.' },
    { title: '2. Create the animation class', detail: 'Add a `.fade-in` class that applies `animation: fadeIn 0.8s ease-out both;`. The `both` fill mode keeps the element at the final state after the animation ends (and at the initial state before it starts), preventing a flash of visible content.' },
    { title: '3. Attach the class to your element', detail: 'Add `class="fade-in"` to any element in your HTML — a `<div>`, `<section>`, `<img>`, etc. The animation runs automatically once, as soon as the element renders.' },
    { title: '4. Tune duration and easing', detail: 'Shorter durations (0.3–0.5s) feel snappy; longer (0.8–1.2s) feel elegant. `ease-out` starts fast and slows down, which reads naturally for entrances.' },
    { title: '5. Stagger multiple elements (optional)', detail: 'To fade in a list one item at a time, give each item an increasing `animation-delay`, e.g. `.item:nth-child(2) { animation-delay: 0.1s; }`, `.item:nth-child(3) { animation-delay: 0.2s; }`.' },
  ],
  'Prefer animating only `opacity` and `transform` — they are GPU-accelerated and will not cause layout jank.'
);

addTemplate(
  'Animations',
  'Bounce Attention',
  'A looping bounce animation that draws the eye to a button, badge, or icon.',
  `<style>
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-14px); }
}
.bounce {
  animation: bounce 1s ease-in-out infinite;
  display: inline-block;
}
</style>
<div style="text-align:center;font-family:sans-serif;">
  <span class="bounce" style="font-size:40px;">⬇️</span>
  <p>Scroll down for more</p>
</div>`,
  'Use for scroll indicators, notification badges, or call-to-action arrows that need continuous attention.',
  [
    { title: '1. Define the bounce keyframes', detail: 'Create `@keyframes bounce` with three stops: at `0%` and `100%` the element sits at its normal position (`translateY(0)`), and at `50%` it rises up (`translateY(-14px)`). Because start and end match, the loop is seamless.' },
    { title: '2. Apply the animation infinitely', detail: 'The `.bounce` class uses `animation: bounce 1s ease-in-out infinite;`. `infinite` makes it loop forever, and `ease-in-out` makes it accelerate and decelerate like real physics.' },
    { title: '3. Make inline elements animatable', detail: 'Transforms do not apply to plain inline elements like `<span>`. Add `display: inline-block;` so the transform takes effect.' },
    { title: '4. Attach to your target', detail: 'Add `class="bounce"` to an arrow icon, emoji, or badge. Keep it on ONE element per screen — multiple bouncing elements compete for attention.' },
    { title: '5. Respect reduced motion (recommended)', detail: 'Wrap the animation in `@media (prefers-reduced-motion: no-preference) { ... }` so users who disable motion in their OS are not shown a perpetual bounce.' },
  ],
  'Continuous animations should be subtle. If it distracts from reading, reduce the distance or slow the duration.'
);

addTemplate(
  'Animations',
  'Typing Text Effect',
  'A typewriter effect where text appears character by character with a blinking cursor.',
  `<style>
.typewriter {
  font-family: monospace;
  font-size: 22px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #4f46e5;
  width: 0;
  animation:
    typing 2.5s steps(22) 0.4s forwards,
    blink 0.8s step-end infinite;
}
@keyframes typing { to { width: 22ch; } }
@keyframes blink { 50% { border-color: transparent; } }
</style>
<span class="typewriter">Hello, I build things.</span>`,
  'Use on portfolio hero sections, terminal-style UIs, or landing pages to add personality to a headline.',
  [
    { title: '1. Understand the trick', detail: 'The text is fully present in the HTML the whole time. We hide it by giving the element `width: 0` with `overflow: hidden` and `white-space: nowrap`, then animate the width open so characters are revealed left to right.' },
    { title: '2. Set up the element', detail: 'Use a monospace font so every character has the same width — this is what makes `steps()` line up exactly one character per step.' },
    { title: '3. Animate the width with steps()', detail: '`animation: typing 2.5s steps(22) forwards` reveals the text in 22 discrete jumps (one per character). The `ch` unit equals the width of one character, so `width: 22ch` matches a 22-character string. Count YOUR string length and use that number in both `steps()` and `ch`.' },
    { title: '4. Add the blinking cursor', detail: 'The `border-right` acts as the cursor. A second animation, `blink`, toggles the border color to transparent every half cycle using `step-end`, producing a classic terminal blink.' },
    { title: '5. Delay and hold', detail: 'The `0.4s` delay lets the page settle before typing begins, and `forwards` keeps the text fully revealed when done. To type multiple lines, trigger each line with an increasing `animation-delay`.' },
  ],
  'This pure-CSS version only works for a single line of nowrap text. For multi-line or dynamic text, use a small JS loop instead.'
);

addTemplate(
  'Animations',
  'Scroll Reveal (Intersection Observer)',
  'Elements slide and fade into view as the user scrolls to them, powered by IntersectionObserver.',
  `<style>
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
<div style="height:120px;display:grid;place-items:center;font-family:sans-serif;">Scroll down ⬇</div>
<div class="reveal" style="padding:20px;border-radius:12px;background:#0ea5e9;color:#fff;font-family:sans-serif;margin:8px 0;">Section one reveals</div>
<div class="reveal" style="padding:20px;border-radius:12px;background:#8b5cf6;color:#fff;font-family:sans-serif;margin:8px 0;">Section two reveals</div>
<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
</script>`,
  'Use on marketing and portfolio pages so sections animate in as the visitor scrolls, adding polish without a library.',
  [
    { title: '1. Style the hidden state', detail: 'Every element that should reveal gets the `.reveal` class: invisible (`opacity: 0`) and shifted down (`translateY(30px)`), with a `transition` on both properties.' },
    { title: '2. Style the visible state', detail: 'The `.reveal.visible` rule is the destination: full opacity and no offset. Because a transition is declared, the browser animates smoothly between the two states whenever the class is added.' },
    { title: '3. Create an IntersectionObserver', detail: 'In a `<script>` at the end of `<body>` (or in your JS file), create `new IntersectionObserver(callback, { threshold: 0.2 })`. The threshold means the callback fires when 20% of the element is inside the viewport.' },
    { title: '4. Add the class when visible', detail: 'Inside the callback, loop over `entries`; if `entry.isIntersecting` is true, add the `visible` class to `entry.target` and call `observer.unobserve(entry.target)` so the animation only ever plays once.' },
    { title: '5. Observe all reveal elements', detail: 'Select every `.reveal` element with `querySelectorAll` and call `observer.observe(el)` on each. New sections only need the `reveal` class in HTML — no extra JS.' },
    { title: '6. Verify', detail: 'Open the page, scroll down slowly, and watch each section fade up as it enters the viewport. In DevTools you can watch the `visible` class appear on each element.' },
  ],
  'IntersectionObserver is far more efficient than listening to `scroll` events — the browser does the visibility math for you.'
);

addTemplate(
  'Animations',
  'Loading Spinner',
  'A lightweight, pure-CSS circular loading spinner.',
  `<style>
.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid rgba(79, 70, 229, 0.2);
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
<div style="display:grid;place-items:center;gap:10px;font-family:sans-serif;">
  <div class="spinner" role="status" aria-label="Loading"></div>
  <span>Loading…</span>
</div>`,
  'Use while fetching data, submitting forms, or lazy-loading images — anywhere the user has to wait.',
  [
    { title: '1. Draw the ring', detail: 'A square `<div>` with `border-radius: 50%` becomes a circle. Give all four borders a faint color, then override just `border-top-color` with a strong color — that one bright arc is what appears to spin.' },
    { title: '2. Animate the rotation', detail: 'One keyframe is enough: `@keyframes spin { to { transform: rotate(360deg); } }`. Apply it with `animation: spin 0.8s linear infinite;`. `linear` is important — any easing makes the spin look like it stutters.' },
    { title: '3. Make it accessible', detail: 'Add `role="status"` and `aria-label="Loading"` so screen readers announce the busy state even though the element has no text.' },
    { title: '4. Show and hide with JS', detail: 'Toggle it around async work: `spinner.hidden = false;` before `await fetch(...)`, and `spinner.hidden = true;` in a `finally` block so it always disappears even if the request fails.' },
    { title: '5. Resize for context', detail: 'Scale by changing `width`/`height` and border thickness together — e.g. 16px/2px for inline button spinners, 44px/4px for page-level loading.' },
  ],
  'Pure-CSS spinners keep animating even when the main thread is busy, unlike GIFs that can freeze.'
);

/* ============================ BUTTONS ============================ */

addTemplate(
  'Buttons',
  'Ripple Click Effect',
  'A Material-style ripple that expands from the exact point where the button is clicked.',
  `<style>
.ripple-btn {
  position: relative;
  overflow: hidden;
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: scale(0);
  animation: ripple 0.6s ease-out forwards;
  pointer-events: none;
}
@keyframes ripple { to { transform: scale(4); opacity: 0; } }
</style>
<button class="ripple-btn">Click me anywhere</button>
<script>
document.querySelector('.ripple-btn').addEventListener('click', function (e) {
  const rect = this.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const circle = document.createElement('span');
  circle.className = 'ripple';
  circle.style.width = circle.style.height = size + 'px';
  circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
  circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
  this.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
});
</script>`,
  'Use to give tactile, app-like feedback on primary action buttons.',
  [
    { title: '1. Prepare the button', detail: 'The button needs `position: relative` (so the ripple positions inside it) and `overflow: hidden` (so the expanding circle is clipped to the button shape).' },
    { title: '2. Style the ripple element', detail: 'The `.ripple` span is an absolutely-positioned white circle starting at `transform: scale(0)`. The keyframe animates it to `scale(4)` while fading `opacity` to 0.' },
    { title: '3. Listen for clicks', detail: 'Add a `click` listener on the button. Inside it, `this.getBoundingClientRect()` gives the button position so we can convert the mouse coordinates (`e.clientX/Y`) into coordinates relative to the button.' },
    { title: '4. Spawn the circle at the click point', detail: 'Create a `<span class="ripple">`, size it to the larger of the button width/height, and offset `left`/`top` by half its size so it is centered exactly under the cursor. Append it to the button — the CSS animation starts automatically.' },
    { title: '5. Clean up after the animation', detail: 'Listen for `animationend` on the circle and call `circle.remove()`. Without this, every click leaves an invisible span behind and the DOM slowly fills up.' },
  ],
  'Setting `pointer-events: none` on the ripple prevents it from swallowing a second quick click.'
);

addTemplate(
  'Buttons',
  'Loading Button (async submit)',
  'A button that disables itself and shows a spinner while an async action runs, then restores.',
  `<style>
.btn {
  padding: 12px 28px; border: none; border-radius: 8px;
  background: #16a34a; color: #fff; font-size: 15px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
}
.btn:disabled { opacity: 0.7; cursor: not-allowed; }
.btn .mini-spin {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
<button class="btn" id="saveBtn">Save changes</button>
<script>
const btn = document.getElementById('saveBtn');
btn.addEventListener('click', async () => {
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="mini-spin"></span> Saving…';
  try {
    await new Promise((r) => setTimeout(r, 1500)); // replace with fetch(...)
    btn.innerHTML = '✓ Saved';
    setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 1200);
  } catch (err) {
    btn.innerHTML = '✗ Failed — retry';
    btn.disabled = false;
  }
});
</script>`,
  'Use on form submits and save buttons to prevent double-submission and show progress.',
  [
    { title: '1. Build the base button', detail: 'Use `display: inline-flex` with `gap` so an inline spinner and label sit neatly side by side. Style `:disabled` with reduced opacity and `cursor: not-allowed`.' },
    { title: '2. Add a tiny CSS spinner', detail: 'The `.mini-spin` element is the classic border-circle spinner scaled down to 14px so it fits inside the button text line.' },
    { title: '3. Enter the loading state', detail: 'In the click handler, first save `btn.innerHTML` so you can restore it later. Then set `btn.disabled = true` (blocks double clicks AND signals state to assistive tech) and swap the content to the spinner + "Saving…" label.' },
    { title: '4. Do the async work', detail: 'Replace the `setTimeout` promise with your real call, e.g. `await fetch("/api/save", { method: "POST", body: data })`. Wrap it in `try/catch` so a network failure cannot leave the button stuck in loading forever.' },
    { title: '5. Confirm, then restore', detail: 'On success, briefly show "✓ Saved" before restoring the original label and re-enabling. On failure, show an error label and re-enable immediately so the user can retry.' },
  ],
  'Always disable a submit button during the request — double-submits are one of the most common real-world form bugs.'
);

addTemplate(
  'Buttons',
  'Copy-to-Clipboard Button',
  'A button that copies text to the clipboard and confirms with a temporary "Copied!" state.',
  `<div style="display:flex;gap:8px;align-items:center;font-family:sans-serif;">
  <code id="snippet" style="background:#f1f5f9;padding:8px 12px;border-radius:6px;">npm install my-lib</code>
  <button id="copyBtn" style="padding:8px 16px;border:1px solid #cbd5e1;border-radius:6px;background:#fff;cursor:pointer;">Copy</button>
</div>
<script>
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', async () => {
  const text = document.getElementById('snippet').textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!';
  } catch {
    copyBtn.textContent = 'Press Ctrl+C';
  }
  setTimeout(() => (copyBtn.textContent = 'Copy'), 2000);
});
</script>`,
  'Use next to code snippets, coupon codes, wallet addresses, or share links.',
  [
    { title: '1. Mark the text source', detail: 'Give the element containing the copyable text an `id` (here `#snippet`) so the script can read `element.textContent` — this always copies the current text even if it changes dynamically.' },
    { title: '2. Call the Clipboard API', detail: '`navigator.clipboard.writeText(text)` returns a promise, so mark the handler `async` and `await` it. It only works on secure contexts (https:// or localhost) and must be triggered by a user gesture like this click.' },
    { title: '3. Confirm visually', detail: 'Users need feedback that the copy worked. Swap the button label to "Copied!" immediately after the promise resolves.' },
    { title: '4. Handle failure gracefully', detail: 'In the `catch` branch (permissions denied, insecure context), change the label to hint at manual copying instead of failing silently.' },
    { title: '5. Reset the label', detail: 'A `setTimeout` restores the original label after ~2 seconds so the button is ready for reuse.' },
  ],
  'The old `document.execCommand("copy")` API is deprecated — use `navigator.clipboard` in all new code.'
);

addTemplate(
  'Buttons',
  'Toggle Switch (checkbox)',
  'An accessible iOS-style toggle switch built on a real checkbox, so keyboard and forms work for free.',
  `<style>
.switch { position: relative; display: inline-block; width: 52px; height: 28px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute; inset: 0; cursor: pointer;
  background: #cbd5e1; border-radius: 28px; transition: background 0.25s;
}
.slider::before {
  content: ""; position: absolute; height: 22px; width: 22px;
  left: 3px; top: 3px; background: #fff; border-radius: 50%;
  transition: transform 0.25s; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.switch input:checked + .slider { background: #4f46e5; }
.switch input:checked + .slider::before { transform: translateX(24px); }
.switch input:focus-visible + .slider { outline: 2px solid #4f46e5; outline-offset: 2px; }
</style>
<label class="switch">
  <input type="checkbox" id="darkToggle">
  <span class="slider"></span>
</label>
<span id="state" style="font-family:sans-serif;margin-left:8px;">Off</span>
<script>
document.getElementById('darkToggle').addEventListener('change', (e) => {
  document.getElementById('state').textContent = e.target.checked ? 'On' : 'Off';
});
</script>`,
  'Use for boolean settings: dark mode, notifications on/off, feature flags.',
  [
    { title: '1. Start with a real checkbox', detail: 'Wrap an `<input type="checkbox">` and a `<span class="slider">` inside a `<label>`. Because the label wraps the input, clicking anywhere on the switch toggles the checkbox — no JS needed for the toggle itself.' },
    { title: '2. Hide the checkbox, keep it functional', detail: 'Use `opacity: 0; width: 0; height: 0;` — NOT `display: none` — so the input stays focusable and screen-reader accessible.' },
    { title: '3. Draw the track and knob', detail: 'The `.slider` span is the rounded track; its `::before` pseudo-element is the white knob. Both get `transition` so state changes animate.' },
    { title: '4. React to the checked state in pure CSS', detail: 'The sibling selector `input:checked + .slider` recolors the track, and `input:checked + .slider::before` slides the knob 24px right. The checkbox is the single source of truth.' },
    { title: '5. Keep keyboard focus visible', detail: 'Because the input is invisible, add `input:focus-visible + .slider { outline: ... }` so Tab users can see where focus is. Space toggles it, exactly like a native checkbox.' },
    { title: '6. Read the value in JS', detail: 'Listen for the `change` event and read `e.target.checked` to run your logic (save the setting, flip the theme, etc.). In a form, the checkbox submits like any other.' },
  ],
  'Building on a native checkbox gives you keyboard support, form submission, and screen-reader semantics for free — never rebuild those by hand with divs.'
);

/* ======================= INPUTS & FORMS ======================= */

addTemplate(
  'Inputs & Forms',
  'Live Input Validation',
  'An email field that validates as the user types, showing inline success/error messages.',
  `<style>
.field { font-family: sans-serif; max-width: 320px; }
.field input {
  width: 100%; padding: 10px 12px; font-size: 15px;
  border: 2px solid #cbd5e1; border-radius: 8px; outline: none;
  transition: border-color 0.2s;
}
.field input.valid { border-color: #16a34a; }
.field input.invalid { border-color: #dc2626; }
.msg { font-size: 13px; margin-top: 6px; min-height: 18px; }
.msg.ok { color: #16a34a; }
.msg.err { color: #dc2626; }
</style>
<div class="field">
  <label for="email"><strong>Email</strong></label>
  <input type="email" id="email" placeholder="you@example.com" autocomplete="email">
  <div class="msg" id="emailMsg" aria-live="polite"></div>
</div>
<script>
const input = document.getElementById('email');
const msg = document.getElementById('emailMsg');
const emailRe = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

input.addEventListener('input', () => {
  const value = input.value.trim();
  if (value === '') {
    input.className = ''; msg.className = 'msg'; msg.textContent = '';
  } else if (emailRe.test(value)) {
    input.className = 'valid'; msg.className = 'msg ok'; msg.textContent = '✓ Looks good';
  } else {
    input.className = 'invalid'; msg.className = 'msg err'; msg.textContent = 'Please enter a valid email address';
  }
});
</script>`,
  'Use on signup and checkout forms — catching typos while typing beats a wall of errors on submit.',
  [
    { title: '1. Structure the field', detail: 'Pair the `<input>` with a `<label for="...">` (accessibility + bigger click target) and an empty message `<div>` below it. `min-height` on the message prevents the layout jumping when text appears.' },
    { title: '2. Define visual states in CSS', detail: 'Three border states: neutral gray, `.valid` green, `.invalid` red, with a `transition` so the color change is smooth.' },
    { title: '3. Listen to the input event', detail: 'The `input` event fires on every keystroke, paste, and autofill — unlike `change`, which only fires on blur. This is what makes the validation feel "live".' },
    { title: '4. Validate the value', detail: 'Trim whitespace, then test against a simple email regex. Empty input resets to neutral rather than showing an error — do not scold users for a field they have not filled yet.' },
    { title: '5. Announce results accessibly', detail: 'The message div has `aria-live="polite"` so screen readers speak validation messages when they change, without interrupting typing.' },
    { title: '6. Still validate on submit', detail: 'Client-side hints improve UX but are trivially bypassed — always re-validate on the server too.' },
  ],
  'For most cases you can also lean on built-in HTML validation (`type="email"`, `required`, `pattern`) and the `:valid` / `:invalid` CSS pseudo-classes.'
);

addTemplate(
  'Inputs & Forms',
  'Password Visibility Toggle',
  'A password field with an eye button that toggles between hidden and visible text.',
  `<style>
.pw-wrap { position: relative; max-width: 320px; font-family: sans-serif; }
.pw-wrap input {
  width: 100%; padding: 10px 44px 10px 12px; font-size: 15px;
  border: 2px solid #cbd5e1; border-radius: 8px; outline: none;
}
.pw-wrap button {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  border: none; background: none; cursor: pointer; font-size: 18px; padding: 4px;
}
</style>
<div class="pw-wrap">
  <input type="password" id="pw" placeholder="Password" autocomplete="current-password">
  <button type="button" id="pwToggle" aria-label="Show password">👁️</button>
</div>
<script>
const pw = document.getElementById('pw');
const toggle = document.getElementById('pwToggle');
toggle.addEventListener('click', () => {
  const show = pw.type === 'password';
  pw.type = show ? 'text' : 'password';
  toggle.textContent = show ? '🙈' : '👁️';
  toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  pw.focus();
});
</script>`,
  'Use on login and signup forms — letting users verify what they typed reduces failed logins dramatically.',
  [
    { title: '1. Position the toggle inside the field', detail: 'Wrap the input and button in a `position: relative` container, then absolutely position the button at the right edge, vertically centered with `top: 50%; transform: translateY(-50%)`. Add right padding to the input so text never runs under the button.' },
    { title: '2. Use type="button"', detail: 'Inside a `<form>`, a bare `<button>` defaults to `type="submit"` — clicking the eye would submit the form! Always set `type="button"` on the toggle.' },
    { title: '3. Flip the input type', detail: 'The whole trick is one line: switch `input.type` between `"password"` (masked dots) and `"text"` (visible). The value is untouched.' },
    { title: '4. Sync the icon and label', detail: 'Swap the emoji/icon and update `aria-label` so screen-reader users hear the correct action ("Show password" vs "Hide password") each time.' },
    { title: '5. Return focus to the field', detail: 'Calling `pw.focus()` after toggling keeps the user in typing flow instead of stranding focus on the button.' },
  ],
  'Keep `autocomplete="current-password"` so password managers still recognize and fill the field.'
);

addTemplate(
  'Inputs & Forms',
  'Character Counter Textarea',
  'A textarea with a live character counter that warns as the limit approaches.',
  `<style>
.counter-field { max-width: 360px; font-family: sans-serif; }
.counter-field textarea {
  width: 100%; padding: 10px 12px; font-size: 14px; resize: vertical;
  border: 2px solid #cbd5e1; border-radius: 8px; outline: none; min-height: 80px;
}
.count { text-align: right; font-size: 13px; color: #64748b; }
.count.warn { color: #d97706; font-weight: 600; }
.count.over { color: #dc2626; font-weight: 700; }
</style>
<div class="counter-field">
  <label for="bio"><strong>Bio</strong></label>
  <textarea id="bio" maxlength="150" placeholder="Tell us about yourself…"></textarea>
  <div class="count" id="bioCount">0 / 150</div>
</div>
<script>
const area = document.getElementById('bio');
const counter = document.getElementById('bioCount');
const max = Number(area.getAttribute('maxlength'));

area.addEventListener('input', () => {
  const len = area.value.length;
  counter.textContent = len + ' / ' + max;
  counter.className = 'count' + (len >= max ? ' over' : len >= max * 0.9 ? ' warn' : '');
});
</script>`,
  'Use for tweets, bios, review boxes, SMS composers — anywhere content has a hard length limit.',
  [
    { title: '1. Set maxlength on the textarea', detail: 'The `maxlength="150"` attribute makes the browser itself refuse extra characters — the JS counter is feedback on top of that hard limit, not the enforcement.' },
    { title: '2. Read the limit from the DOM', detail: 'The script reads `getAttribute("maxlength")` instead of hard-coding 150, so changing the limit in HTML automatically updates the counter logic.' },
    { title: '3. Count on every input event', detail: 'Update `counter.textContent` with `value.length` on each `input` event, which covers typing, pasting, and cutting.' },
    { title: '4. Add warning thresholds', detail: 'At 90% of the limit the counter turns amber (`.warn`), and at 100% red (`.over`). Progressive color cues let users wrap up naturally rather than hitting a wall.' },
    { title: '5. Adapt for no hard limit', detail: 'If you want a soft limit (allow overflow but flag it), drop `maxlength` and instead disable the submit button when `len > max`.' },
  ],
  'Note that emoji and some characters count as 2+ JS string units — for user-facing counts of complex text, `[...value].length` is more accurate.'
);

addTemplate(
  'Inputs & Forms',
  'Debounced Live Search Input',
  'A search box that filters a list as you type, debounced so filtering only runs after typing pauses.',
  `<style>
.search-demo { max-width: 320px; font-family: sans-serif; }
.search-demo input {
  width: 100%; padding: 10px 12px; font-size: 15px;
  border: 2px solid #cbd5e1; border-radius: 8px; outline: none;
}
.search-demo li { padding: 6px 4px; border-bottom: 1px solid #e2e8f0; list-style: none; }
</style>
<div class="search-demo">
  <input type="search" id="q" placeholder="Search fruits…" aria-label="Search fruits">
  <ul id="results" style="padding:0;margin:10px 0;"></ul>
</div>
<script>
const fruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach', 'Pear', 'Strawberry'];
const inputEl = document.getElementById('q');
const list = document.getElementById('results');

function render(items) {
  list.innerHTML = items.length
    ? items.map((f) => '<li>' + f + '</li>').join('')
    : '<li style="color:#94a3b8;">No matches</li>';
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const onSearch = debounce(() => {
  const q = inputEl.value.trim().toLowerCase();
  render(fruits.filter((f) => f.toLowerCase().includes(q)));
}, 250);

inputEl.addEventListener('input', onSearch);
render(fruits);
</script>`,
  'Use for search-as-you-type over lists, tables, or remote APIs without hammering the server on every keystroke.',
  [
    { title: '1. Render the full list first', detail: 'A `render(items)` helper turns an array into `<li>` elements (with a friendly "No matches" empty state). Call it once on load so the list is visible before any search.' },
    { title: '2. Write the debounce helper', detail: '`debounce(fn, delay)` returns a wrapped function that resets a timer on every call — `fn` only actually runs after the calls stop for `delay` ms. This generic helper is reusable anywhere.' },
    { title: '3. Filter case-insensitively', detail: 'Lowercase both the query and each item, then use `.includes(q)` for substring matching. `.startsWith(q)` is an alternative for prefix-style search.' },
    { title: '4. Wire it to the input event', detail: 'Attach the debounced handler to `input`. Typing "straw" fires the event 5 times but filters only once, 250ms after the last keystroke.' },
    { title: '5. Swap in a real API', detail: 'For remote search, replace the local filter with `fetch("/api/search?q=" + encodeURIComponent(q))` inside the debounced function — debouncing is what keeps you from sending a request per keystroke.' },
  ],
  '250–300ms is the sweet spot for search debounce: fast enough to feel live, slow enough to skip intermediate keystrokes.'
);

addTemplate(
  'Inputs & Forms',
  'Full Form Validation on Submit',
  'A complete signup form that validates all fields on submit, focuses the first error, and blocks bad submissions.',
  `<style>
.form { max-width: 340px; font-family: sans-serif; display: grid; gap: 12px; }
.form input {
  width: 100%; padding: 10px 12px; font-size: 14px;
  border: 2px solid #cbd5e1; border-radius: 8px; outline: none;
}
.form input.invalid { border-color: #dc2626; }
.form .err { color: #dc2626; font-size: 12px; min-height: 15px; margin-top: 3px; }
.form button {
  padding: 11px; border: none; border-radius: 8px;
  background: #4f46e5; color: #fff; font-size: 15px; cursor: pointer;
}
</style>
<form class="form" id="signup" novalidate>
  <div>
    <input id="name" placeholder="Full name">
    <div class="err" id="nameErr"></div>
  </div>
  <div>
    <input id="email2" type="email" placeholder="Email">
    <div class="err" id="emailErr"></div>
  </div>
  <div>
    <input id="pass" type="password" placeholder="Password (8+ chars)">
    <div class="err" id="passErr"></div>
  </div>
  <button type="submit">Create account</button>
</form>
<script>
const form = document.getElementById('signup');

const rules = [
  { id: 'name', errId: 'nameErr', test: (v) => v.trim().length >= 2, msg: 'Name must be at least 2 characters' },
  { id: 'email2', errId: 'emailErr', test: (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v), msg: 'Enter a valid email' },
  { id: 'pass', errId: 'passErr', test: (v) => v.length >= 8, msg: 'Password must be 8+ characters' },
];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let firstBad = null;
  for (const rule of rules) {
    const el = document.getElementById(rule.id);
    const errEl = document.getElementById(rule.errId);
    const ok = rule.test(el.value);
    el.classList.toggle('invalid', !ok);
    errEl.textContent = ok ? '' : rule.msg;
    if (!ok && !firstBad) firstBad = el;
  }
  if (firstBad) { firstBad.focus(); return; }
  alert('Form is valid — ready to send to the server!');
  // fetch('/api/signup', { method: 'POST', body: new FormData(form) })
});
</script>`,
  'Use as the backbone for any signup, checkout, or settings form that needs client-side validation.',
  [
    { title: '1. Disable native bubbles with novalidate', detail: 'Adding `novalidate` to the `<form>` turns off the browser\u2019s default popup validation so your custom inline messages take over completely.' },
    { title: '2. Describe rules as data', detail: 'Each rule object holds the input id, the error-element id, a `test(value)` function, and a message. Adding a field to the form later = adding one object to the array, no new logic.' },
    { title: '3. Intercept the submit event', detail: 'Listen on the FORM\u2019s `submit` event (not the button\u2019s click — submit also fires when pressing Enter in a field) and call `e.preventDefault()` to stop the page reload while validating.' },
    { title: '4. Validate every field, not just the first', detail: 'Loop over all rules, toggling the `.invalid` class and error text per field, so the user sees ALL problems at once instead of fixing them one submit at a time.' },
    { title: '5. Focus the first error', detail: 'Track the first failing input and call `.focus()` on it — keyboard and screen-reader users land directly on what needs fixing.' },
    { title: '6. Submit for real', detail: 'When every rule passes, send the data with `fetch` and `new FormData(form)`, or remove `preventDefault` conditionally to allow a classic form POST. Always re-validate on the server.' },
  ],
  'Pattern to remember: rules-as-data + single submit handler. It scales from 3 fields to 30 without growing the logic.'
);

/* ======================= UI COMPONENTS ======================= */

addTemplate(
  'UI Components',
  'Modal Dialog',
  'An accessible modal with overlay that opens, closes on button, overlay click, or Escape key.',
  `<style>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.55);
  display: none; place-items: center; z-index: 50;
}
.overlay.open { display: grid; }
.modal {
  background: #fff; border-radius: 14px; padding: 24px;
  max-width: 380px; width: 90%; font-family: sans-serif;
  animation: pop 0.22s ease-out;
}
@keyframes pop { from { transform: scale(0.92); opacity: 0; } }
</style>
<button id="openModal" style="padding:10px 22px;border:none;border-radius:8px;background:#4f46e5;color:#fff;cursor:pointer;">Open modal</button>
<div class="overlay" id="overlay" role="dialog" aria-modal="true" aria-labelledby="mTitle">
  <div class="modal">
    <h3 id="mTitle" style="margin:0 0 8px 0;">Confirm action</h3>
    <p style="margin:0 0 18px 0;color:#475569;">Are you sure you want to continue? This cannot be undone.</p>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button id="cancelBtn" style="padding:8px 18px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;cursor:pointer;">Cancel</button>
      <button id="confirmBtn" style="padding:8px 18px;border:none;border-radius:8px;background:#dc2626;color:#fff;cursor:pointer;">Delete</button>
    </div>
  </div>
</div>
<script>
const overlay = document.getElementById('overlay');
const openBtn = document.getElementById('openModal');

function open() { overlay.classList.add('open'); document.getElementById('cancelBtn').focus(); }
function close() { overlay.classList.remove('open'); openBtn.focus(); }

openBtn.addEventListener('click', open);
document.getElementById('cancelBtn').addEventListener('click', close);
document.getElementById('confirmBtn').addEventListener('click', () => { close(); alert('Confirmed!'); });
overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
</script>`,
  'Use for confirmations, forms, and alerts that must interrupt the flow and demand a decision.',
  [
    { title: '1. Build the overlay + modal structure', detail: 'A full-screen fixed `.overlay` (`inset: 0`) darkens the page and centers the `.modal` card with `display: grid; place-items: center`. It starts as `display: none` and the `.open` class shows it.' },
    { title: '2. Add dialog semantics', detail: '`role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at the title tell assistive tech this is a modal and what it is about.' },
    { title: '3. Wire open and close', detail: 'Two tiny functions toggle the `.open` class. Everything else — the trigger button, Cancel, Confirm — just calls them.' },
    { title: '4. Close on overlay click, but not modal click', detail: 'The listener checks `e.target === overlay` so clicks on the dark backdrop close the modal, but clicks inside the card (which bubble up through it) do not.' },
    { title: '5. Close on Escape', detail: 'A document-level `keydown` listener for `e.key === "Escape"` matches what users expect from every native dialog.' },
    { title: '6. Manage focus', detail: 'On open, move focus into the dialog (here the Cancel button); on close, return focus to the button that opened it. This keeps keyboard users oriented.' },
  ],
  'Modern browsers also ship a native `<dialog>` element with `showModal()` that gives you focus trapping and Escape handling for free — worth using when you do not need to support very old browsers.'
);

addTemplate(
  'UI Components',
  'Toast Notifications',
  'Stackable toast notifications that slide in, auto-dismiss after a delay, and can be closed manually.',
  `<style>
#toasts {
  position: fixed; bottom: 16px; right: 16px; display: flex;
  flex-direction: column; gap: 8px; z-index: 100; font-family: sans-serif;
}
.toast {
  display: flex; align-items: center; gap: 10px;
  background: #1e293b; color: #fff; padding: 12px 14px;
  border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  animation: slideIn 0.25s ease-out;
}
.toast.success { border-left: 4px solid #22c55e; }
.toast.error { border-left: 4px solid #ef4444; }
.toast button { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px; }
@keyframes slideIn { from { transform: translateX(110%); opacity: 0; } }
</style>
<button onclick="showToast('Profile saved ✓', 'success')" style="padding:9px 18px;margin-right:6px;border:none;border-radius:8px;background:#16a34a;color:#fff;cursor:pointer;">Success toast</button>
<button onclick="showToast('Upload failed — try again', 'error')" style="padding:9px 18px;border:none;border-radius:8px;background:#dc2626;color:#fff;cursor:pointer;">Error toast</button>
<div id="toasts" aria-live="polite"></div>
<script>
function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toasts');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;

  const text = document.createElement('span');
  text.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Dismiss');
  closeBtn.addEventListener('click', () => toast.remove());

  toast.append(text, closeBtn);
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}
</script>`,
  'Use for non-blocking feedback: saved settings, sent messages, background errors — anywhere an alert() would be too disruptive.',
  [
    { title: '1. Create one fixed container', detail: 'A single `#toasts` div is fixed to the bottom-right corner with `flex-direction: column; gap`. Every toast is appended into it, so multiple toasts stack automatically.' },
    { title: '2. Write a reusable showToast() function', detail: 'It takes `(message, type, duration)` and builds the toast DOM with `createElement` + `textContent` (never `innerHTML` with user text — that invites XSS).' },
    { title: '3. Style variants with a modifier class', detail: 'The type argument becomes a class (`success` / `error`) that just changes the accent border color. Add `info` or `warning` variants the same way.' },
    { title: '4. Animate the entrance', detail: 'The `slideIn` keyframes start off-screen right (`translateX(110%)`) — since the element is appended already, only a `from` frame is needed; it animates to its natural position.' },
    { title: '5. Auto-dismiss with a manual escape hatch', detail: '`setTimeout(() => toast.remove(), duration)` clears it automatically, and the ✕ button removes it instantly for impatient users.' },
    { title: '6. Announce to screen readers', detail: '`aria-live="polite"` on the container makes assistive tech read each toast when it appears, without needing focus.' },
  ],
  'Call `showToast()` from anywhere in your app — after fetch success/failure is the classic use.'
);

addTemplate(
  'UI Components',
  'Tabs Component',
  'A keyboard-friendly tab switcher that shows one panel at a time.',
  `<style>
.tabs { max-width: 380px; font-family: sans-serif; }
.tablist { display: flex; gap: 4px; border-bottom: 2px solid #e2e8f0; }
.tab {
  padding: 9px 18px; border: none; background: none; cursor: pointer;
  font-size: 14px; color: #64748b; border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}
.tab[aria-selected="true"] { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }
.panel { padding: 16px 4px; }
.panel[hidden] { display: none; }
</style>
<div class="tabs">
  <div class="tablist" role="tablist" aria-label="Account settings">
    <button class="tab" role="tab" aria-selected="true" aria-controls="p1" id="t1">Profile</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="p2" id="t2">Billing</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="p3" id="t3">Security</button>
  </div>
  <div class="panel" id="p1" role="tabpanel" aria-labelledby="t1">Edit your name, avatar and bio here.</div>
  <div class="panel" id="p2" role="tabpanel" aria-labelledby="t2" hidden>Manage payment methods and invoices.</div>
  <div class="panel" id="p3" role="tabpanel" aria-labelledby="t3" hidden>Change password and enable 2FA.</div>
</div>
<script>
const tabs = [...document.querySelectorAll('[role="tab"]')];

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activate(i));
  tab.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') activate((i + 1) % tabs.length);
    if (e.key === 'ArrowLeft') activate((i - 1 + tabs.length) % tabs.length);
  });
});

function activate(index) {
  tabs.forEach((tab, i) => {
    const selected = i === index;
    tab.setAttribute('aria-selected', String(selected));
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
  });
  tabs[index].focus();
}
</script>`,
  'Use for settings pages, product detail sections, dashboards — dense content grouped into views without navigation.',
  [
    { title: '1. Use ARIA tab semantics', detail: 'Buttons get `role="tab"` inside a `role="tablist"`; each panel gets `role="tabpanel"`. `aria-controls` links a tab to its panel id, and `aria-labelledby` links back. Screen readers then announce "tab 1 of 3, selected".' },
    { title: '2. Hide inactive panels with the hidden attribute', detail: 'The native `hidden` attribute (plus a `[hidden] { display: none; }` safety rule) removes inactive panels from both view and the accessibility tree — no custom show/hide classes needed.' },
    { title: '3. Style the selected state via aria-selected', detail: 'Instead of a separate `.active` class, style `[aria-selected="true"]` directly. The accessibility state and the visual state can never drift apart.' },
    { title: '4. Centralize switching in activate(index)', detail: 'One function loops over all tabs, sets `aria-selected`, and toggles each linked panel\u2019s `hidden`. Every interaction (click, keyboard) funnels through it.' },
    { title: '5. Add arrow-key navigation', detail: 'Left/Right arrows move between tabs with wrap-around (the `% tabs.length` trick), matching the standard ARIA tabs keyboard pattern.' },
    { title: '6. Add more tabs declaratively', detail: 'To add a fourth tab, add one `<button role="tab">` and one panel with matching ids — the script picks them up automatically since it queries by role.' },
  ],
  'This is the W3C ARIA "tabs" pattern in its simplest form — the same structure scales up to any design system.'
);

addTemplate(
  'UI Components',
  'Accordion / FAQ',
  'An expandable FAQ list built on native <details>/<summary> with smooth styling — zero JavaScript required.',
  `<style>
.faq { max-width: 380px; font-family: sans-serif; }
.faq details {
  border: 1px solid #e2e8f0; border-radius: 10px;
  margin-bottom: 8px; overflow: hidden;
}
.faq summary {
  padding: 14px 16px; cursor: pointer; font-weight: 600;
  list-style: none; display: flex; justify-content: space-between; align-items: center;
}
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: "+"; font-size: 18px; color: #4f46e5; transition: transform 0.2s; }
.faq details[open] summary::after { transform: rotate(45deg); }
.faq .body { padding: 0 16px 14px; color: #475569; font-size: 14px; line-height: 1.6; }
</style>
<div class="faq">
  <details>
    <summary>Do I need an account to order?</summary>
    <div class="body">No — guest checkout is available. Creating an account lets you track orders and save addresses.</div>
  </details>
  <details>
    <summary>What is the return policy?</summary>
    <div class="body">Returns are free within 30 days of delivery. Items must be unused and in original packaging.</div>
  </details>
  <details>
    <summary>How long does shipping take?</summary>
    <div class="body">Standard shipping takes 3–5 business days; express options are shown at checkout.</div>
  </details>
</div>`,
  'Use for FAQs, settings groups, and long documents — collapsing content keeps pages scannable.',
  [
    { title: '1. Use native details/summary', detail: 'Each Q&A pair is a `<details>` element whose `<summary>` is the question. The browser handles toggling, keyboard support (Enter/Space), and accessibility natively — no JS at all.' },
    { title: '2. Remove the default triangle', detail: '`list-style: none` on the summary (plus the `::-webkit-details-marker` rule for Safari) removes the default disclosure triangle so you can add your own indicator.' },
    { title: '3. Add a rotating plus icon', detail: 'A `::after` pseudo-element renders "+". When the panel opens, the `[open]` attribute appears on `<details>`, and the selector `details[open] summary::after` rotates it 45° into an "×".' },
    { title: '4. Style the answer body', detail: 'Wrap the answer in a div for padding control. Everything inside `<details>` other than the summary is hidden until expanded.' },
    { title: '5. Optional: one-open-at-a-time', detail: 'Give every details element the same `name="faq"` attribute (supported in modern browsers) and the browser closes the others automatically, like a classic accordion.' },
  ],
  'Reaching for native elements first (`<details>`, `<dialog>`, `<select>`) means less code, fewer bugs, and built-in accessibility.'
);

addTemplate(
  'UI Components',
  'Dark Mode Toggle (persisted)',
  'A dark/light theme switcher that remembers the choice in localStorage and respects the OS preference.',
  `<style>
:root { --bg: #ffffff; --fg: #111827; --card: #f1f5f9; }
[data-theme="dark"] { --bg: #0f172a; --fg: #e2e8f0; --card: #1e293b; }
.themed {
  background: var(--bg); color: var(--fg);
  padding: 24px; border-radius: 14px; font-family: sans-serif;
  transition: background 0.3s, color 0.3s;
}
.themed .card { background: var(--card); padding: 14px; border-radius: 10px; margin-top: 12px; }
</style>
<div class="themed" id="app">
  <button id="themeBtn" style="padding:9px 18px;border:1px solid currentColor;border-radius:8px;background:none;color:inherit;cursor:pointer;">🌙 Dark mode</button>
  <div class="card">This panel recolors instantly when the theme changes — and the choice survives a page reload.</div>
</div>
<script>
const app = document.getElementById('app');
const btn = document.getElementById('themeBtn');

const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(saved || (prefersDark ? 'dark' : 'light'));

btn.addEventListener('click', () => {
  const next = app.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  localStorage.setItem('theme', next);
});

function setTheme(theme) {
  app.dataset.theme = theme;
  btn.textContent = theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode';
}
</script>`,
  'Use as the theme system for any site — the CSS variable pattern scales from this demo to a full design system.',
  [
    { title: '1. Define theme colors as CSS variables', detail: 'Declare defaults on `:root` (light theme), then override the SAME variable names under `[data-theme="dark"]`. Components only ever reference `var(--bg)` etc., so they are theme-agnostic.' },
    { title: '2. Switch theme by flipping one attribute', detail: 'Setting `data-theme="dark"` on the root container swaps every variable at once. In a real site put the attribute on `<html>` (`document.documentElement`), so the entire page recolors.' },
    { title: '3. Respect the OS preference initially', detail: 'On first visit (no saved choice), `matchMedia("(prefers-color-scheme: dark)")` detects the user\u2019s system setting and uses it as the default.' },
    { title: '4. Persist the explicit choice', detail: 'When the user clicks the toggle, store the result in `localStorage`. On future loads, the saved value takes priority over the OS preference.' },
    { title: '5. Keep the button label in sync', detail: 'A single `setTheme()` function updates both the attribute and the button text, so state can never disagree with the UI.' },
    { title: '6. Avoid the flash of wrong theme', detail: 'In production, run the localStorage check in a tiny inline `<script>` in the `<head>` BEFORE the page renders, so users never see a white flash before dark mode applies.' },
  ],
  'Add `transition: background 0.3s, color 0.3s` to themed containers so switching feels smooth rather than jarring.'
);

/* ============================ MERGE ============================ */

const existingIds = new Set(data.map((e) => e.id));
const fresh = templates.filter((t) => !existingIds.has(t.id));
const combined = data.concat(fresh);
fs.writeFileSync(contentPath, JSON.stringify(combined, null, 2));
console.log(`Added ${fresh.length} curated templates (${templates.length - fresh.length} already present). Total entries: ${combined.length}`);
