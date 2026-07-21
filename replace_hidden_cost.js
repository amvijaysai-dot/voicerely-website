const fs = require("fs");

const htmlPath = "index.html";
let html = fs.readFileSync(htmlPath, "utf8");

// Find the hidden-cost section boundaries
const startMarker = '<!-- Section 3.5: Hidden Cost of Missed Calls -->';
const endMarker = '<!-- Section 4: ROI Calculator - Premium Dashboard -->';

const startIdx = html.indexOf(startMarker);
if (startIdx === -1) {
  console.error("Start marker not found");
  process.exit(1);
}

const endIdx = html.indexOf(endMarker, startIdx);
if (endIdx === -1) {
  console.error("End marker not found");
  process.exit(1);
}

// The section to replace is from startIdx to endIdx (exclusive)
const before = html.slice(0, startIdx);
const after = html.slice(endIdx);

const newSection = `      <!-- Section 3.5: Hidden Cost of Missed Calls — Redesigned -->
      <section id="hidden-cost" class="w-full hidden-cost-section">
        <!-- Background polish: dot grid pattern -->
        <div class="hidden-cost-bg-pattern" aria-hidden="true"></div>
        <!-- Animated gradient line at top -->
        <div class="hidden-cost-gradient-line" aria-hidden="true"></div>

        <div class="hidden-cost-container">
          <!-- Live Counter (above cards) -->
          <div class="hidden-cost-counter-wrap" aria-live="polite">
            <span class="hidden-cost-counter-label">Businesses have missed</span>
            <span class="hidden-cost-counter-value" id="hiddenCostCounter" data-target="1247">0</span>
            <span class="hidden-cost-counter-suffix">calls in the last hour</span>
          </div>

          <div class="text-center mb-10 md:mb-14">
            <div class="inline-flex items-center px-3 py-1 rounded-full bg-v-orange/10 border border-v-orange/20 text-v-orange text-xs font-semibold tracking-wider uppercase mb-6 hidden-cost-badge-pill">
              WHY VOICERELY
            </div>
            <h2 class="text-[28px] md:text-[36px] font-extrabold text-white [.light_&]:text-gray-900 tracking-tight mb-3 font-sans">
              Every Missed Call Has a Cost.
            </h2>
            <p class="text-[15px] md:text-[18px] text-v-muted [.light_&]:text-gray-600 font-sans max-w-2xl mx-auto">
              Your phone never stops ringing—but your business stops earning the moment nobody answers. Here's what happens behind the scenes when calls go unanswered.
            </p>
          </div>

          <div class="hidden-cost-grid">
            <!-- Card 1: Missed Calls -->
            <article class="hidden-cost-card" style="--animation-delay: 0;" data-card-index="0">
              <div class="hidden-cost-badge">MISSED CALLS</div>
              <div class="hidden-cost-icon-container">
                <!-- Icon 1: Phone with dollar bills flying out -->
                <svg class="hidden-cost-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <!-- Phone body -->
                  <path d="M32 4 C42.6 4 51 12.4 51 23 C51 33.6 42.6 42 32 42 C21.4 42 13 33.6 13 23 C13 12.4 21.4 4 32 4 Z" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <!-- Phone screen -->
                  <rect x="20" y="14" width="24" height="18" rx="3" stroke="#F97316" stroke-width="1.5"/>
                  <!-- Dollar bills flying out (3 bills, animated via CSS) -->
                  <g class="bill bill-1">
                    <rect x="42" y="20" width="14" height="6" rx="1" fill="#FB923C" stroke="#F97316" stroke-width="1"/>
                    <line x1="45" y1="20" x2="45" y2="26" stroke="#F97316" stroke-width="1" stroke-dasharray="2 2"/>
                    <line x1="49" y1="20" x2="49" y2="26" stroke="#F97316" stroke-width="1" stroke-dasharray="2 2"/>
                    <line x1="53" y1="20" x2="53" y2="26" stroke="#F97316" stroke-width="1" stroke-dasharray="2 2"/>
                  </g>
                  <g class="bill bill-2">
                    <rect x="46" y="28" width="14" height="6" rx="1" fill="#FB923C" stroke="#F97316" stroke-width="1"/>
                    <line x1="49" y1="28" x2="49" y2="34" stroke="#F97316" stroke-width="1" stroke-dasharray="2 2"/>
                    <line x1="53" y1="28" x2="53" y2="34" stroke="#F97316" stroke-width="1" stroke-dasharray="2 2"/>
                    <line x1="57" y1="28" x2="57" y2="34" stroke="#F97316" stroke-width="1" stroke-dasharray="2 2"/>
                  </g>
                  <g class="bill bill-3">
                    <rect x="40" y="36" width="14" height="6" rx="1" fill="#FB923C" stroke="#F97316" stroke-width="1"/>
                    <line x1="43" y1="36" x2="43" y2="42" stroke="#F97316" stroke-width="1" stroke-dasharray="2 2"/>
                    <line x1="47" y1="36" x2="47" y2="42" stroke="#F97316" stroke-width="1" stroke-dasharray="2 2"/>
                    <line x1="51" y1="36" x2="51" y2="42" stroke="#F97316" stroke-width="1" stroke-dasharray="2 2"/>
                  </g>
                </svg>
              </div>
              <h3 class="hidden-cost-heading">Lost Calls Become Lost Clients</h3>
              <div class="hidden-cost-stat">67% of callers who reach voicemail hang up forever</div>
              <p class="hidden-cost-description">
                Your competitor picks up while your phone rings. By the time you call back, they've already signed the contract.
              </p>
              <p class="hidden-cost-footer">Missed opportunities never call twice.</p>
            </article>

            <!-- Card 2: After Hours -->
            <article class="hidden-cost-card" style="--animation-delay: 1;" data-card-index="1">
              <div class="hidden-cost-badge">AFTER HOURS</div>
              <div class="hidden-cost-icon-container">
                <!-- Icon 2: Split phone screen - moon/zzz left, AI agent with sound waves right -->
                <svg class="hidden-cost-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <!-- Phone outline -->
                  <path d="M32 4 C42.6 4 51 12.4 51 23 C51 33.6 42.6 42 32 42 C21.4 42 13 33.6 13 23 C13 12.4 21.4 4 32 4 Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <!-- Center divider -->
                  <line x1="32" y1="10" x2="32" y2="38" stroke="#6B7280" stroke-width="1.5" stroke-dasharray="4 4"/>
                  <!-- Left side: Moon with ZZZ -->
                  <circle cx="20" cy="20" r="8" fill="#6B7280" fill-opacity="0.15" stroke="#6B7280" stroke-width="1.5"/>
                  <path d="M17 18 Q20 15 23 18 Q20 21 17 18" fill="#6B7280" fill-opacity="0.3"/>
                  <text x="20" y="34" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8" fill="#6B7280" font-weight="bold">Z Z Z</text>
                  <!-- Right side: AI agent with pulsing sound waves -->
                  <circle cx="44" cy="20" r="8" fill="#F97316" fill-opacity="0.15" stroke="#F97316" stroke-width="1.5"/>
                  <circle cx="44" cy="20" r="4" fill="#F97316" fill-opacity="0.3"/>
                  <!-- Sound waves (animated via CSS) -->
                  <g class="sound-waves">
                    <path d="M50 20 Q54 17 58 20 Q54 23 50 20" stroke="#F97316" stroke-width="1.5" fill="none" opacity="0.6"/>
                    <path d="M52 20 Q57 15 62 20 Q57 25 52 20" stroke="#F97316" stroke-width="1.5" fill="none" opacity="0.4"/>
                    <path d="M54 20 Q60 12 66 20 Q60 28 54 20" stroke="#F97316" stroke-width="1.5" fill="none" opacity="0.2"/>
                  </g>
                </svg>
              </div>
              <h3 class="hidden-cost-heading">Business Doesn't Stop at 5 PM</h3>
              <div class="hidden-cost-stat">35% of your best leads call after hours</div>
              <p class="hidden-cost-description">
                Your team is home. Your AI agent is clocked in, answering every call at 2 AM like it's 2 PM.
              </p>
              <p class="hidden-cost-footer">Available 24/7 without hiring another receptionist.</p>
            </article>

            <!-- Card 3: Slow Response -->
            <article class="hidden-cost-card" style="--animation-delay: 2;" data-card-index="2">
              <div class="hidden-cost-badge">SLOW RESPONSE</div>
              <div class="hidden-cost-icon-container">
                <!-- Icon 3: Hourglass with coins dropping, gold→gray -->
                <svg class="hidden-cost-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <!-- Hourglass outline -->
                  <path d="M16 12 L48 12 M16 52 L48 52 M16 12 L24 28 M48 12 L40 28 M24 28 L24 36 M40 28 L40 36 M24 36 L16 52 M40 36 L48 52" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <!-- Top bulb sand (gold coins) -->
                  <g class="coins-top">
                    <g class="coin coin-1"><circle cx="28" cy="20" r="4" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="28" y="23" text-anchor="middle" font-size="5" fill="#1A0A02" font-weight="bold">$</text></g>
                    <g class="coin coin-2"><circle cx="36" cy="18" r="4" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="36" y="21" text-anchor="middle" font-size="5" fill="#1A0A02" font-weight="bold">$</text></g>
                    <g class="coin coin-3"><circle cx="32" cy="24" r="4" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="32" y="27" text-anchor="middle" font-size="5" fill="#1A0A02" font-weight="bold">$</text></g>
                    <g class="coin coin-4"><circle cx="24" cy="22" r="4" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="24" y="25" text-anchor="middle" font-size="5" fill="#1A0A02" font-weight="bold">$</text></g>
                    <g class="coin coin-5"><circle cx="40" cy="22" r="4" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="40" y="25" text-anchor="middle" font-size="5" fill="#1A0A02" font-weight="bold">$</text></g>
                  </g>
                  <!-- Falling coins (animated) -->
                  <g class="coins-falling">
                    <g class="fall-coin fall-1"><circle cx="32" cy="30" r="3.5" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="32" y="33" text-anchor="middle" font-size="4" fill="#1A0A02" font-weight="bold">$</text></g>
                    <g class="fall-coin fall-2"><circle cx="28" cy="32" r="3.5" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="28" y="35" text-anchor="middle" font-size="4" fill="#1A0A02" font-weight="bold">$</text></g>
                    <g class="fall-coin fall-3"><circle cx="36" cy="31" r="3.5" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="36" y="34" text-anchor="middle" font-size="4" fill="#1A0A02" font-weight="bold">$</text></g>
                    <g class="fall-coin fall-4"><circle cx="30" cy="34" r="3.5" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="30" y="37" text-anchor="middle" font-size="4" fill="#1A0A02" font-weight="bold">$</text></g>
                    <g class="fall-coin fall-5"><circle cx="34" cy="33" r="3.5" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/><text x="34" y="36" text-anchor="middle" font-size="4" fill="#1A0A02" font-weight="bold">$</text></g>
                  </g>
                  <!-- Bottom bulb gray coins (accumulating) -->
                  <g class="coins-bottom">
                    <g class="gray-coin gc-1"><circle cx="26" cy="46" r="4" fill="#4B5563" stroke="#374151" stroke-width="1"/><text x="26" y="49" text-anchor="middle" font-size="5" fill="#9CA3AF" font-weight="bold">$</text></g>
                    <g class="gray-coin gc-2"><circle cx="34" cy="44" r="4" fill="#4B5563" stroke="#374151" stroke-width="1"/><text x="34" y="47" text-anchor="middle" font-size="5" fill="#9CA3AF" font-weight="bold">$</text></g>
                    <g class="gray-coin gc-3"><circle cx="30" cy="48" r="4" fill="#4B5563" stroke="#374151" stroke-width="1"/><text x="30" y="51" text-anchor="middle" font-size="5" fill="#9CA3AF" font-weight="bold">$</text></g>
                    <g class="gray-coin gc-4"><circle cx="38" cy="46" r="4" fill="#4B5563" stroke="#374151" stroke-width="1"/><text x="38" y="49" text-anchor="middle" font-size="5" fill="#9CA3AF" font-weight="bold">$</text></g>
                    <g class="gray-coin gc-5"><circle cx="28" cy="48" r="4" fill="#4B5563" stroke="#374151" stroke-width="1"/><text x="28" y="51" text-anchor="middle" font-size="5" fill="#9CA3AF" font-weight="bold">$</text></g>
                  </g>
                </svg>
              </div>
              <h3 class="hidden-cost-heading">Speed Wins Customers</h3>
              <div class="hidden-cost-stat">5-min response = 391% higher conversion</div>
              <p class="hidden-cost-description">
                The first business to answer gets the customer. Every. Single. Time. Voicerely answers in under 3 seconds.
              </p>
              <p class="hidden-cost-footer">Fast follow-up creates higher conversion.</p>
            </article>
          </div>

          <div class="hidden-cost-cta">
            <p class="hidden-cost-cta-heading">Ready to see what these missed calls are really costing you?</p>
            <p class="hidden-cost-cta-subtext">Use our live ROI Calculator below to estimate how much revenue Voicerely could recover for your business.</p>
            <a href="#roi-calculator" class="hidden-cost-cta-button">
              <span class="cta-text">See What You're Losing — Calculate Your ROI</span>
              <svg class="cta-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>
`;

const newHtml = before + newSection + after;
fs.writeFileSync(htmlPath, newHtml, "utf8");
console.log("OK: hidden-cost section replaced. New length:", newHtml.length);