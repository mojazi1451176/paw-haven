/**
 * PawHaven — app.js
 *
 * API Endpoints used:
 *  1. TheDogAPI  (https://api.thedogapi.com/v1/) — breeds + images
 *  2. TheCatAPI  (https://api.thecatapi.com/v1/) — breeds + images
 *
 * These are public APIs that do not require an API key for basic use.
 * For higher rate limits, add your free API key to a .env file and
 * inject it via Vite: VITE_DOG_API_KEY and VITE_CAT_API_KEY.
 *
 * Adoption listing details (age, owners, health, rescue background)
 * are simulated data layered on top of real breed/image data,
 * as adoption-specific endpoints vary by shelter partner.
 *
 * Insurance data is curated illustrative data; no live insurance API
 * is publicly available without commercial agreements.
 */

// ── API Config ──────────────────────────────────────────────────────────────
const DOG_API_BASE = 'https://api.thedogapi.com/v1';
const CAT_API_BASE = 'https://api.thecatapi.com/v1';

// API key injected by Vite at build time from .env file (VITE_DOG_API_KEY)
const DOG_API_KEY = import.meta.env.VITE_DOG_API_KEY || '';
const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY || '';

// ── Hero image on load ───────────────────────────────────────────────────────
async function loadHeroImage() {
  try {
    const headers = DOG_API_KEY ? { 'x-api-key': DOG_API_KEY } : {};
    const res = await fetch(`${DOG_API_BASE}/images/search?size=med&mime_types=jpg`, { headers });
    if (!res.ok) throw new Error('Hero fetch failed');
    const [img] = await res.json();
    const heroEl = document.getElementById('hero-dog-img');
    if (img && heroEl) {
      heroEl.src = img.url;
      heroEl.alt = 'Adorable adoptable dog';
    }
  } catch (e) {
    console.warn('Hero image could not be loaded:', e.message);
  }
}

// ── Shelter names & locations for realistic mock data ──────────────────────
const SHELTERS = [
  'Happy Tails Rescue, Austin TX',
  'Second Chances Animal Shelter, Denver CO',
  'Open Hearts Pet Rescue, Portland OR',
  'The Forever Home Foundation, Chicago IL',
  'Saving Grace Animal Society, Raleigh NC',
  'Paws & Claws Rescue, Phoenix AZ',
  'Bay Area Pet Haven, San Francisco CA',
  'Heartland Humane Society, Omaha NE',
  'Coastal Critters Rescue, Savannah GA',
  'Mountain Pet Rescue, Salt Lake City UT'
];

const RESCUE_STORIES = [
  'Found abandoned on a highway off-ramp in poor condition — malnourished but alert and responsive to handlers. A passing motorist called animal control, and the pet was transferred to our partner shelter within hours. No identification or microchip was found.',
  'Surrendered voluntarily by an owner facing a housing change that did not permit pets. The owner provided vaccination records and described the pet as well-socialized with children and other animals. Transition was calm and without incident.',
  'Pulled from an overcrowded municipal shelter where the pet was at risk of euthanasia due to space constraints. Our rescue team transported them the same day. The pet arrived stressed but physically healthy.',
  'Found as a stray wandering near a public park. No microchip was detected and no owner came forward after a 10-day hold period. The pet appeared to have been on its own for at least a week based on body condition.',
  'Owner passed away unexpectedly. A family member reached out to the rescue network and facilitated a smooth handover with full medical history. The pet is grieving the loss of its primary caregiver and benefits from extra patience and comfort.',
  'Recovered from a large-scale hoarding situation involving over 30 animals. All animals required rehabilitation. This pet completed a 60-day foster program before being cleared for adoption.',
  'Surrendered by a breeder who had overproduced and could no longer care for the litter. The pet had limited early socialization and benefited from a structured foster home environment.',
  'Displaced during a severe weather event in the Gulf Coast region. The pet was recovered from a temporary emergency shelter and transported north by a partner rescue convoy.',
  null, // Rescue background not documented
  null, // Records lost during shelter transfer
];

/**
 * Rescue condition descriptions. null means no intake condition on file.
 */
const RESCUE_CONDITIONS = [
  'The pet arrived in poor physical condition — visibly underweight, dehydrated, and with a matted coat. Immediate veterinary care was administered, including IV fluids and nutritional support. Recovery took approximately three weeks.',
  'Arrived in fair condition. Slightly underweight and anxious, but no acute medical concerns. Required flea treatment and a basic dental cleaning during the intake process.',
  'Arrived in good condition overall. Alert, responsive, and at a healthy weight. A minor ear infection was treated during intake but required no hospitalization.',
  'Arrived in excellent condition with full records and a clean bill of health from a private veterinarian. No interventions were needed beyond routine shelter intake procedures.',
  null, // Intake condition not recorded
  null, // Transferred mid-care; condition at original intake unknown
];

/**
 * Health history entries. Some are null to simulate pets with no records on file.
 * Each non-null entry is a paragraph string (or array of strings for multi-paragraph).
 */
const HEALTH_CONDITIONS = [
  'This pet arrived fully vaccinated and spayed/neutered. A microchip was placed during intake. Heartworm test returned negative and all parasite prevention is current. No chronic conditions noted by the intake vet.',
  'Vaccinated and neutered prior to arrival at the shelter. Received a dental cleaning during the 30-day observation period. No signs of flea or tick infestation. Overall health assessed as good.',
  'Vaccinated and spayed on intake. Diagnosed with mild hip dysplasia, which is being managed with a vet-prescribed joint supplement. Mobility is not significantly impaired and the condition is monitored regularly. Microchipped.',
  'Up to date on all core vaccinations and neutered. A mild skin allergy was identified during the first week; it is well-controlled with a hypoallergenic diet. Microchipped and heartworm negative.',
  'Fully vaccinated and spayed/neutered. Treated for an ear infection upon arrival — fully resolved after a 10-day antibiotic course. Microchipped. No recurring health issues noted.',
  'Vaccinated and microchipped. Recovered from kennel cough contracted at the previous facility; fully cleared by a licensed vet. Currently on a weight-management diet recommended by the shelter veterinarian.',
  'Vaccinated and spayed. Dental disease was present at intake and treated with a professional cleaning and two minor extractions. Microchipped. Eating well and no further dental concerns at last exam.',
  'Vaccinated and neutered. Displays some anxiety-related behaviors, particularly around strangers, which are improving steadily with consistent socialization and positive reinforcement training. Microchipped.',
  null, // No health records available for this pet
  null, // Records were not transferred from prior shelter
];

/**
 * Abuse/neglect history entries. null means no concerns on file.
 * Non-null entries are paragraph strings describing prior concerns.
 */
const ABUSE_FLAGS = [
  null,
  null,
  null,
  null,
  null,
  'This pet showed signs of prior malnourishment when first rescued — significantly underweight with a dull coat. After several weeks of a structured feeding plan and veterinary oversight, they reached a healthy weight and their coat has fully recovered. No behavioral indicators of physical trauma were observed.',
  'Intake staff noted a fear response to raised voices and quick hand movements, which may indicate prior exposure to a stressful environment. The pet has made meaningful progress through patient handling and routine-based care. No physical injuries were found during the initial exam.',
  'There is a documented history of neglect from a previous hoarding situation. The pet had limited socialization and required significant rehabilitation over a 60-day foster period. They are now comfortable with gentle strangers and have been cleared for adoption by the behavioral team.',
  null,
  null
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Build a simulated adoption pet object from real breed + image API data.
 * @param {Object} breed - breed data from TheDogAPI or TheCatAPI
 * @param {string|null} imageUrl - resolved image URL
 * @param {string} species - 'dog' or 'cat'
 * @param {string} filterLocation - user-entered city/state for display
 * @returns {Object} pet object
 */
function buildPet(breed, imageUrl, species, filterLocation) {
  const ageMonths = randomInt(2, 120);
  const ageFmt = ageMonths < 12
    ? `${ageMonths} month${ageMonths !== 1 ? 's' : ''}`
    : `${Math.floor(ageMonths / 12)} yr${Math.floor(ageMonths / 12) !== 1 ? 's' : ''} ${ageMonths % 12 > 0 ? (ageMonths % 12) + 'mo' : ''}`;

  const shelter = randomItem(SHELTERS);

  // Link to Petfinder search results filtered by breed — always works
  const breedEncoded = encodeURIComponent(breed.name);
  const adoptionUrl = species === 'cat'
    ? `https://www.petfinder.com/search/cats-for-adoption/?breed%5B0%5D=${breedEncoded}`
    : `https://www.petfinder.com/search/dogs-for-adoption/?breed%5B0%5D=${breedEncoded}`;

  return {
    id: Math.random().toString(36).slice(2),
    name: generatePetName(species),
    breed: breed.name,
    species,
    imageUrl,
    age: ageFmt,
    ownersCount: randomInt(1, 4),
    health: randomItem(HEALTH_CONDITIONS),          // string | null
    abusePrior: randomItem(ABUSE_FLAGS),            // string | null
    shelter,                                         // always present
    rescueStory: randomItem(RESCUE_STORIES),        // string | null
    rescueCondition: randomItem(RESCUE_CONDITIONS), // string | null
    location: filterLocation || shelter.split(',')[1]?.trim() || 'Nearby',
    adoptionUrl
  };
}

const DOG_NAMES = ['Biscuit', 'Pepper', 'Mochi', 'Scout', 'Luna', 'Rusty', 'Hazel', 'Bruno', 'Stella', 'Ziggy', 'Cleo', 'Ollie', 'Nala', 'Baxter', 'Rosie', 'Finn', 'Maple', 'Duke', 'Winnie', 'Chester'];
const CAT_NAMES = ['Miso', 'Clover', 'Theo', 'Saffron', 'Pixel', 'Jasper', 'Mochi', 'Willow', 'Cosmo', 'Fern', 'Atlas', 'Luna', 'Sage', 'Biscuit', 'Nimbus', 'Pippin', 'Cleo', 'Onyx', 'Poppy', 'Chester'];

function generatePetName(species) {
  return species === 'cat' ? randomItem(CAT_NAMES) : randomItem(DOG_NAMES);
}

// ── API Fetch helpers ────────────────────────────────────────────────────────
async function fetchDogBreeds(breedFilter) {
  const headers = DOG_API_KEY ? { 'x-api-key': DOG_API_KEY } : {};
  let url = `${DOG_API_BASE}/breeds?limit=20`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Dog breed API error: ${res.status}`);
  let breeds = await res.json();
  if (breedFilter) {
    const q = breedFilter.toLowerCase();
    breeds = breeds.filter(b => b.name.toLowerCase().includes(q));
  }
  return breeds.slice(0, 10);
}

async function fetchCatBreeds(breedFilter) {
  const headers = CAT_API_KEY ? { 'x-api-key': CAT_API_KEY } : {};
  let url = `${CAT_API_BASE}/breeds?limit=20`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Cat breed API error: ${res.status}`);
  let breeds = await res.json();
  if (breedFilter) {
    const q = breedFilter.toLowerCase();
    breeds = breeds.filter(b => b.name.toLowerCase().includes(q));
  }
  return breeds.slice(0, 10);
}

async function fetchDogImageForBreed(breedId) {
  const headers = DOG_API_KEY ? { 'x-api-key': DOG_API_KEY } : {};
  try {
    const res = await fetch(`${DOG_API_BASE}/images/search?breed_ids=${breedId}&size=med`, { headers });
    if (!res.ok) return null;
    const [img] = await res.json();
    return img ? img.url : null;
  } catch { return null; }
}

async function fetchCatImageForBreed(breedId) {
  const headers = CAT_API_KEY ? { 'x-api-key': CAT_API_KEY } : {};
  try {
    const res = await fetch(`${CAT_API_BASE}/images/search?breed_ids=${breedId}&size=med`, { headers });
    if (!res.ok) return null;
    const [img] = await res.json();
    return img ? img.url : null;
  } catch { return null; }
}

// ── Main search function ─────────────────────────────────────────────────────
async function searchPets() {
  const zip     = document.getElementById('zip-input').value.trim();
  const city    = document.getElementById('city-input').value.trim();
  const state   = document.getElementById('state-input').value.trim();
  const radius  = document.getElementById('radius-input').value;
  const breed   = document.getElementById('breed-input').value.trim();
  const species = document.getElementById('species-input').value;

  // Validate: need at least one location field
  if (!zip && !city && !state) {
    showError('Please enter at least a ZIP code, city, or state to search.');
    return;
  }

  const locationLabel = [city, state, zip].filter(Boolean).join(', ');

  clearError();
  showLoading(true);
  hideResults();

  try {
    let pets = [];

    if (species === 'any' || species === 'dog') {
      const dogBreeds = await fetchDogBreeds(breed);
      if (dogBreeds.length === 0 && species === 'dog') {
        showError(`No dog breeds found matching "${breed}". Try a different breed name.`);
        showLoading(false);
        return;
      }
      const dogPets = await Promise.all(
        dogBreeds.map(async (b) => {
          const imgUrl = await fetchDogImageForBreed(b.id);
          return buildPet(b, imgUrl, 'dog', locationLabel);
        })
      );
      pets = pets.concat(dogPets);
    }

    if (species === 'any' || species === 'cat') {
      const catBreeds = await fetchCatBreeds(breed);
      const catPets = await Promise.all(
        catBreeds.map(async (b) => {
          const imgUrl = await fetchCatImageForBreed(b.id);
          return buildPet(b, imgUrl, 'cat', locationLabel);
        })
      );
      pets = pets.concat(catPets);
    }

    if (pets.length === 0) {
      showError('No pets found matching your filters. Try broadening your search.');
      showLoading(false);
      return;
    }

    // Shuffle for variety
    pets = pets.sort(() => Math.random() - 0.5);

    showLoading(false);
    renderResults(pets, locationLabel, radius);

  } catch (err) {
    showLoading(false);
    showError('Something went wrong while fetching pets. Please try again. (' + err.message + ')');
    console.error(err);
  }
}

// ── Render ───────────────────────────────────────────────────────────────────
function renderResults(pets, locationLabel, radius) {
  const grid  = document.getElementById('results-grid');
  const count = document.getElementById('results-count');

  const radiusLabel = radius === 'any' ? 'any distance' : `${radius} miles`;
  count.textContent = `Found ${pets.length} pet${pets.length !== 1 ? 's' : ''} near ${locationLabel} within ${radiusLabel}`;
  count.style.display = 'block';

  grid.innerHTML = '';
  pets.forEach(pet => {
    grid.appendChild(buildPetCard(pet));
  });
  grid.style.display = 'grid';
}

function buildPetCard(pet) {
  const card = document.createElement('div');
  card.className = 'pet-card';

  // ── Image ──────────────────────────────────────────────────────────────────
  let imgHtml;
  if (pet.imageUrl) {
    imgHtml = `<img class="pet-card-img" src="${escapeHtml(pet.imageUrl)}" alt="${escapeHtml(pet.name)} the ${escapeHtml(pet.breed)}" loading="lazy" />`;
  } else {
    imgHtml = `<div class="pet-img-unavailable">
      <span class="img-icon">📷</span>
      <span>Photo not available</span>
    </div>`;
  }

  /**
   * Helper: render a labeled detail block.
   * If value is null/empty, shows "No information available" in muted style.
   * Otherwise renders value as a paragraph.
   * @param {string} label - section heading
   * @param {string|null} value - content or null
   * @param {string} [icon] - optional emoji prefix on the label
   * @param {string} [warnClass] - extra CSS class on the wrapper when value exists
   */
  function detailBlock(label, value, icon = '', warnClass = '') {
    const hasInfo = value && value.trim().length > 0;
    return `
      <div class="pet-detail-block ${warnClass}">
        <p class="detail-label">${icon ? icon + ' ' : ''}${escapeHtml(label)}</p>
        ${hasInfo
          ? `<p class="detail-text">${escapeHtml(value)}</p>`
          : `<p class="detail-text detail-empty">No information available.</p>`
        }
      </div>`;
  }

  card.innerHTML = `
    ${imgHtml}
    <div class="pet-card-body">
      <div class="pet-name">${escapeHtml(pet.name)}</div>
      <div class="pet-breed">${escapeHtml(pet.breed)} &middot; ${pet.species === 'dog' ? '🐶' : '🐱'}</div>
      <div class="pet-location">📍 ${escapeHtml(pet.location)}</div>

      <!-- Basic facts table (age & owners — always available) -->
      <table class="pet-table" aria-label="Basic pet facts">
        <tbody>
          <tr><td>Age</td><td>${escapeHtml(pet.age)}</td></tr>
          <tr><td>Prior Owners</td><td>${pet.ownersCount}</td></tr>
          <tr><td>Rescued From</td><td>${escapeHtml(pet.shelter)}</td></tr>
        </tbody>
      </table>

      <!-- Four fields that may or may not have information -->
      ${detailBlock('Health History', pet.health, '🩺')}
      ${detailBlock('Abuse / Neglect History', pet.abusePrior, '⚠️', pet.abusePrior ? 'detail-warn' : '')}
      ${detailBlock('Rescue Story', pet.rescueStory, '📖')}
      ${detailBlock('Condition When Found', pet.rescueCondition, '🏥')}

      <div class="card-actions">
        <a
          class="btn-adopt"
          href="${escapeHtml(pet.adoptionUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Adopt ${escapeHtml(pet.name)} — opens in new tab"
        >🏠 Adopt Me</a>
        <button
          class="btn-insurance"
          onclick="scrollToInsurance()"
          aria-label="View insurance options for ${escapeHtml(pet.name)}"
        >🛡️ Insurance</button>
      </div>
    </div>
  `;

  return card;
}

function scrollToInsurance() {
  document.getElementById('insurance-section').scrollIntoView({ behavior: 'smooth' });
}

// ── Insurance data (Endpoint 2) ──────────────────────────────────────────────
const INSURANCE_PLANS = [
  {
    name: 'PawShield Basic',
    badge: 'Most Affordable',
    badgeClass: '',
    price: '$18',
    period: '/month',
    paymentType: 'Monthly subscription',
    treatments: [
      'Accident & injury coverage',
      'Emergency vet visits',
      'X-rays and diagnostics',
      'Prescription medications (accident-related)'
    ],
    copay: '$100 annual deductible; 10% copay after deductible.',
    quoteUrl: 'https://www.embracepetinsurance.com/'
  },
  {
    name: 'FurFirst Complete',
    badge: 'Best Value',
    badgeClass: 'best',
    price: '$34',
    period: '/month',
    paymentType: 'Monthly subscription',
    treatments: [
      'Accident & illness coverage',
      'Hereditary & congenital conditions',
      'Dental illness treatment',
      'Behavioral therapy',
      'Prescription medications',
      'Specialist & emergency care'
    ],
    copay: '$250 annual deductible; 20% copay. No copay for preventive care.',
    quoteUrl: 'https://www.trupanion.com/'
  },
  {
    name: 'TailCare Wellness+',
    badge: 'Wellness Focused',
    badgeClass: '',
    price: '$27',
    period: '/month',
    paymentType: 'Monthly subscription',
    treatments: [
      'Annual wellness exams',
      'Vaccinations & boosters',
      'Flea, tick & heartworm prevention',
      'Spay/neuter coverage',
      'Dental cleanings',
      'Microchipping'
    ],
    copay: 'No deductible. $15 copay per wellness visit.',
    quoteUrl: 'https://www.petsbest.com/'
  },
  {
    name: 'LifePaws Premium',
    badge: 'Comprehensive',
    badgeClass: '',
    price: '$59',
    period: '/month',
    paymentType: 'Monthly or annual (save 10% annually)',
    treatments: [
      'Unlimited accident & illness',
      'Cancer treatment & chemotherapy',
      'Orthopedic surgery',
      'Chronic condition management',
      'Alternative therapies (acupuncture, rehab)',
      'Telehealth vet consultations 24/7',
      'End-of-life & cremation allowance'
    ],
    copay: '$150 annual deductible; 10% copay. Unlimited annual max.',
    quoteUrl: 'https://www.healthypawspetinsurance.com/'
  },
  {
    name: 'QuickPaw Accident-Only',
    badge: 'Budget Pick',
    badgeClass: '',
    price: '$9',
    period: '/month',
    paymentType: 'Fixed monthly rate — price never changes',
    treatments: [
      'Accidental injuries only',
      'Broken bones & lacerations',
      'Swallowed objects / poisoning',
      'Emergency stabilization'
    ],
    copay: 'No deductible. 20% copay per claim. $5,000 annual max.',
    quoteUrl: 'https://www.spotpetins.com/'
  },
  {
    name: 'AdoptEase First Year',
    badge: 'New Adopters',
    badgeClass: '',
    price: '$199',
    period: ' flat / 1st year',
    paymentType: 'One-time fixed payment for first 12 months',
    treatments: [
      'First-year wellness package',
      'All vaccinations included',
      'Spay or neuter if not done',
      'One emergency visit (up to $500)',
      'Microchip registration'
    ],
    copay: 'No copay. Fixed coverage — no claims process for included items.',
    quoteUrl: 'https://www.aspcapetinsurance.com/'
  }
];

function renderInsurance() {
  const grid = document.getElementById('insurance-grid');
  const loading = document.getElementById('insurance-loading');

  // Simulate brief async load
  setTimeout(() => {
    loading.style.display = 'none';
    grid.innerHTML = '';

    INSURANCE_PLANS.forEach(plan => {
      const card = document.createElement('div');
      card.className = 'insurance-card';
      card.innerHTML = `
        <span class="ins-badge ${escapeHtml(plan.badgeClass)}">${escapeHtml(plan.badge)}</span>
        <div class="ins-name">${escapeHtml(plan.name)}</div>
        <div class="ins-price">${escapeHtml(plan.price)}<span>${escapeHtml(plan.period)}</span></div>
        <hr class="ins-divider" />
        <div>
          <p class="ins-section-label">Payment Type</p>
          <p style="font-size:0.875rem; color:var(--charcoal);">${escapeHtml(plan.paymentType)}</p>
        </div>
        <div>
          <p class="ins-section-label">Treatments Covered</p>
          <ul class="ins-treatments">
            ${plan.treatments.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
          </ul>
        </div>
        <div class="ins-copay">
          <strong>Copay &amp; Deductible:</strong> ${escapeHtml(plan.copay)}
        </div>
        <a
          class="btn-ins-quote"
          href="${escapeHtml(plan.quoteUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get a quote from ${escapeHtml(plan.name)} — opens in new tab"
        >Get a Free Quote →</a>
      `;
      grid.appendChild(card);
    });

    grid.style.display = 'grid';
  }, 600);
}

// ── UI Helpers ───────────────────────────────────────────────────────────────
function showError(msg) {
  const el = document.getElementById('search-error');
  el.textContent = '⚠️ ' + msg;
  el.style.display = 'block';
}

function clearError() {
  const el = document.getElementById('search-error');
  el.style.display = 'none';
  el.textContent = '';
}

function showLoading(visible) {
  document.getElementById('search-loading').style.display = visible ? 'flex' : 'none';
}

function hideResults() {
  document.getElementById('results-grid').style.display = 'none';
  document.getElementById('results-grid').innerHTML = '';
  document.getElementById('results-count').style.display = 'none';
}

/**
 * Safely escape HTML to prevent XSS when inserting API data into the DOM.
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Background Slideshow ─────────────────────────────────────────────────────
/**
 * A curated set of royalty-free Unsplash photos showing happy pets and owners.
 * Unsplash Source URLs serve a random photo matching the keywords — reliable,
 * no API key required, freely usable.
 *
 * Format: https://source.unsplash.com/featured/?{keywords}&sig={unique-seed}
 * The `sig` param forces a different photo each time even for similar keywords.
 */
const BG_PHOTOS = [
  // Happy dog + person moments
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80&fit=crop', // golden retriever outdoors
  'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=1600&q=80&fit=crop', // person hugging dog
  'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1600&q=80&fit=crop', // labrador happy outdoors
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1600&q=80&fit=crop', // two dogs running field
  'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=1600&q=80&fit=crop', // husky eye close-up
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1600&q=80&fit=crop', // dog in sunlight portrait
  // Cat + owner moments
  'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=1600&q=80&fit=crop', // cat on lap
  'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=1600&q=80&fit=crop', // cat face close
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1600&q=80&fit=crop', // cozy cat indoors
  // Families / adoption vibes
  'https://images.unsplash.com/photo-1607923432780-7a9c30adcb87?w=1600&q=80&fit=crop', // kid with dog
  'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1600&q=80&fit=crop', // pup in arms
  'https://images.unsplash.com/photo-1581888227599-779811939961?w=1600&q=80&fit=crop', // dog smiling outdoors
];

let bgCurrentIndex = 0;
let bgActiveSlot  = 0; // which of the 3 slide divs is showing
let bgSlideTimer  = null;
const BG_INTERVAL_MS = 8000; // rotate every 8 seconds

/**
 * Preload an image URL in the background so there's no flash when it appears.
 */
function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => resolve(url);
    img.onerror = () => resolve(url); // still resolve — we'll try to show it
    img.src = url;
  });
}

/**
 * Advance to the next photo in BG_PHOTOS and crossfade to it.
 */
async function advanceBgSlide() {
  const slides = document.querySelectorAll('.bg-slide');
  if (!slides.length) return;

  const nextIndex = (bgCurrentIndex + 1) % BG_PHOTOS.length;
  const nextSlot  = (bgActiveSlot  + 1) % slides.length;

  // Pre-load the next image before crossfading to avoid a blank flash
  await preloadImage(BG_PHOTOS[nextIndex]);

  // Set the incoming slide's background, then fade it in
  slides[nextSlot].style.backgroundImage = `url('${BG_PHOTOS[nextIndex]}')`;
  slides[bgActiveSlot].classList.remove('active');
  slides[nextSlot].classList.add('active');

  bgCurrentIndex = nextIndex;
  bgActiveSlot   = nextSlot;
}

/**
 * Initialise the slideshow:
 *  - Load the first image immediately
 *  - Start the auto-rotate timer
 *  - Advance on Page Visibility change (user switching tabs or windows)
 */
function initBgSlideshow() {
  const slides = document.querySelectorAll('.bg-slide');
  if (!slides.length) return;

  // Seed all three slots so the first crossfade has something to show
  BG_PHOTOS.slice(0, slides.length).forEach((url, i) => {
    slides[i].style.backgroundImage = `url('${url}')`;
  });
  slides[0].classList.add('active');
  bgCurrentIndex = 0;
  bgActiveSlot   = 0;

  // Auto-rotate every BG_INTERVAL_MS milliseconds
  bgSlideTimer = setInterval(advanceBgSlide, BG_INTERVAL_MS);

  // Also rotate whenever the user comes BACK to this tab/window
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Clear and restart the timer so the interval is fresh after refocus
      clearInterval(bgSlideTimer);
      advanceBgSlide();
      bgSlideTimer = setInterval(advanceBgSlide, BG_INTERVAL_MS);
    }
  });
}

// ── Allow Enter key in search form ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ['zip-input', 'city-input', 'state-input', 'breed-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchPets();
      });
    }
  });

  loadHeroImage();
  renderInsurance();
  initBgSlideshow();
});

// Expose functions to global scope so inline onclick handlers in HTML work
// when app.js is loaded as a Vite ES module
window.searchPets = searchPets;
window.scrollToInsurance = scrollToInsurance;