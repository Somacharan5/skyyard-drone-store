const db = require('./schema');

const categories = [
  { name: 'Drones', slug: 'drones', icon: 'drone', sort_order: 1 },
  { name: 'RC Cars', slug: 'rc-cars', icon: 'car', sort_order: 2 },
  { name: 'RC Planes & Helicopters', slug: 'rc-planes-helicopters', icon: 'plane', sort_order: 3 },
  { name: 'Gel Blasters & Guns', slug: 'gel-blasters-guns', icon: 'blaster', sort_order: 4 },
  { name: 'Gadgets', slug: 'gadgets', icon: 'gadget', sort_order: 5 },
  { name: 'Spares & Batteries', slug: 'spare-parts', icon: 'battery', sort_order: 6 },
];

const products = [
  // Drones
  { name: 'SkyForce X7 Camera Drone with GPS & 4K Camera', category: 'drones', brand: 'SkyForce', price: 12990, compare: 16990, badge: 'Hot', featured: 1, image: 'drone', variant: 0,
    short: 'GPS return-to-home, 4K UHD camera, 25 min flight time.',
    desc: 'The SkyForce X7 packs a stabilised 4K camera, GPS-assisted hover, and smart return-to-home into a foldable frame that fits in a daypack. Follow-me mode and gesture selfies make it a favourite for travel vlogging.',
    specs: { 'Flight time': '25 minutes', 'Control range': '1.2 km', 'Camera': '4K UHD, 90° adjustable', 'Battery': '2 x 2500mAh (included)', 'GPS': 'Yes, with RTH' }, stock: 24, rating: 4.7, reviews: 63 },
  { name: 'SkyForce Mini Nano Drone for Kids', category: 'drones', brand: 'SkyForce', price: 1790, compare: 2290, badge: null, featured: 0, image: 'drone', variant: 1,
    short: 'Palm-sized beginner drone with one-key takeoff and headless mode.',
    desc: 'Built for first-time flyers, the Mini Nano survives crashes thanks to prop guards and a lightweight shell. One-key takeoff/land and headless mode make it easy for kids to fly within minutes.',
    specs: { 'Flight time': '7 minutes', 'Control range': '30 m', 'Camera': 'None', 'Battery': '1 x 500mAh (included)', 'GPS': 'No' }, stock: 61, rating: 4.4, reviews: 118 },
  { name: 'SkyForce Falcon Pro Foldable Drone 5G WiFi FPV', category: 'drones', brand: 'SkyForce', price: 8990, compare: 11490, badge: 'New', featured: 0, image: 'drone', variant: 2,
    short: 'Foldable FPV drone with 5G WiFi live transmission and brushless motors.',
    desc: 'Brushless motors give the Falcon Pro punchy acceleration and a stable hover even in light wind. Real-time 5G WiFi FPV streams straight to your phone through the companion app.',
    specs: { 'Flight time': '20 minutes', 'Control range': '800 m', 'Camera': '2.7K, EIS stabilised', 'Battery': '2 x 2000mAh (included)', 'GPS': 'Optical flow positioning' }, stock: 17, rating: 4.6, reviews: 41 },
  { name: 'SkyForce Racer FPV Drone Kit', category: 'drones', brand: 'SkyForce', price: 15990, compare: null, badge: null, featured: 0, image: 'drone', variant: 3,
    short: '5-inch freestyle FPV kit with goggles and dual-rate racing controller.',
    desc: 'A ready-to-fly analog FPV racing kit for pilots moving beyond beginner drones — includes goggles, a dual-rate controller, and spare props for your first crash (there will be one).',
    specs: { 'Flight time': '9 minutes', 'Control range': '2 km (analog)', 'Frame': '5-inch freestyle', 'Battery': '4S 1500mAh (included)', 'Goggles': 'Included' }, stock: 9, rating: 4.8, reviews: 22 },
  { name: 'SkyForce Beginner Drone with Altitude Hold', category: 'drones', brand: 'SkyForce', price: 3490, compare: 4290, badge: 'Bestseller', featured: 1, image: 'drone', variant: 4,
    short: 'Altitude hold, one-key flips, and a 720p camera for new pilots.',
    desc: 'Altitude hold keeps the Beginner Drone steady in the air the moment you let go of the sticks, so new pilots can focus on learning stick direction instead of fighting drift.',
    specs: { 'Flight time': '15 minutes', 'Control range': '100 m', 'Camera': '720p', 'Battery': '1 x 1200mAh (included)', 'GPS': 'No' }, stock: 38, rating: 4.5, reviews: 97 },
  { name: 'VoltEdge Pro Camera Drone GPS 4K Gimbal', category: 'drones', brand: 'VoltEdge', price: 34990, compare: 42990, badge: 'Premium', featured: 1, image: 'drone', variant: 0,
    short: '3-axis mechanical gimbal, obstacle sensing, 34-minute flight time.',
    desc: 'The flagship of the lineup: a true 3-axis mechanical gimbal for silky footage, forward obstacle sensing, and a 34-minute flight time that turns location scouting into an all-morning affair.',
    specs: { 'Flight time': '34 minutes', 'Control range': '10 km', 'Camera': '4K/60fps, 3-axis gimbal', 'Battery': '2 x 5000mAh (included)', 'GPS': 'Dual GPS + GLONASS' }, stock: 6, rating: 4.9, reviews: 34 },

  // RC Cars
  { name: 'TurboDrift Raptor 1/10 4WD Off-Road Monster Truck', category: 'rc-cars', brand: 'TurboDrift', price: 6990, compare: 9490, badge: 'Bestseller', featured: 1, image: 'car', variant: 0,
    short: '4WD monster truck, 45 km/h top speed, all-terrain tires.',
    desc: 'Steel-reinforced suspension and deep-tread all-terrain tires let the Raptor shrug off gravel, mud, and the occasional curb jump at up to 45 km/h.',
    specs: { 'Scale': '1:10', 'Drivetrain': '4WD', 'Top speed': '45 km/h', 'Battery': '2 x 2000mAh (included)', 'Runtime': '~20 minutes' }, stock: 22, rating: 4.6, reviews: 84 },
  { name: 'TurboDrift Nitro Blaze Drift Car 2.4G', category: 'rc-cars', brand: 'TurboDrift', price: 7490, compare: 8990, badge: null, featured: 0, image: 'car', variant: 1,
    short: 'Drift-tuned chassis with swappable low-grip tires and 2.4GHz radio.',
    desc: 'A drift-tuned chassis, adjustable steering angle, and swappable low-grip tires let you practice countersteer and sideways entries on any smooth floor.',
    specs: { 'Scale': '1:18', 'Drivetrain': 'RWD', 'Top speed': '35 km/h', 'Battery': '1 x 1500mAh (included)', 'Runtime': '~15 minutes' }, stock: 19, rating: 4.5, reviews: 37 },
  { name: 'TurboDrift Crawler X4 Rock Crawler RTR', category: 'rc-cars', brand: 'TurboDrift', price: 10990, compare: null, badge: null, featured: 0, image: 'car', variant: 2,
    short: 'Portal axles, locked diffs, and a low crawl gear for technical terrain.',
    desc: 'Portal axles and a low crawl gear ratio give the X4 the torque to climb rock gardens and stair-steps at a walking pace without wheel spin.',
    specs: { 'Scale': '1:10', 'Drivetrain': '4WD, locked diffs', 'Top speed': '15 km/h', 'Battery': '1 x 3000mAh (included)', 'Runtime': '~40 minutes' }, stock: 11, rating: 4.7, reviews: 29 },
  { name: 'TurboDrift Mini Racer 1/24 High Speed Car', category: 'rc-cars', brand: 'TurboDrift', price: 2290, compare: 2790, badge: 'New', featured: 0, image: 'car', variant: 3,
    short: 'Pocket-sized 1:24 racer that hits 20 km/h indoors or out.',
    desc: 'Small enough for a desk shelf, quick enough for the hallway — the Mini Racer is a great first RC car for kids who want real speed without a big price tag.',
    specs: { 'Scale': '1:24', 'Drivetrain': 'RWD', 'Top speed': '20 km/h', 'Battery': '1 x 400mAh (included)', 'Runtime': '~12 minutes' }, stock: 54, rating: 4.3, reviews: 71 },
  { name: 'TurboDrift Extreme Buggy 4WD Waterproof', category: 'rc-cars', brand: 'TurboDrift', price: 13990, compare: 16990, badge: null, featured: 0, image: 'car', variant: 4,
    short: 'Fully waterproof electronics, long-travel suspension, 60 km/h.',
    desc: 'Sealed, waterproof electronics mean puddles and wet grass are no longer off-limits. Long-travel suspension keeps all four wheels planted through rough jumps at up to 60 km/h.',
    specs: { 'Scale': '1:8', 'Drivetrain': '4WD', 'Top speed': '60 km/h', 'Battery': '2 x 3000mAh (included)', 'Runtime': '~25 minutes' }, stock: 8, rating: 4.8, reviews: 19 },

  // RC Planes & Helicopters
  { name: 'AeroMax Glider Pro RC Airplane RTF', category: 'rc-planes-helicopters', brand: 'AeroMax', price: 5990, compare: null, badge: null, featured: 0, image: 'plane', variant: 0,
    short: 'EPP foam glider with a stabiliser mode for calm, gentle flights.',
    desc: 'A wide wingspan and a beginner-friendly stabiliser mode make the Glider Pro forgiving in light wind — nudge the sticks and it self-levels the moment you let go.',
    specs: { 'Wingspan': '780 mm', 'Material': 'EPP foam', 'Flight time': '18 minutes', 'Battery': '1 x 1000mAh (included)', 'Skill level': 'Beginner' }, stock: 16, rating: 4.5, reviews: 26 },
  { name: 'AeroMax Sky Trainer Beginner Plane Kit', category: 'rc-planes-helicopters', brand: 'AeroMax', price: 4290, compare: 5290, badge: null, featured: 0, image: 'plane', variant: 1,
    short: 'High-wing trainer with reinforced nose for crash-friendly first flights.',
    desc: 'A high-wing trainer layout is the most stable configuration for a first fixed-wing flight, and the reinforced foam nose shrugs off the inevitable rough landing.',
    specs: { 'Wingspan': '650 mm', 'Material': 'EPO foam', 'Flight time': '12 minutes', 'Battery': '1 x 800mAh (included)', 'Skill level': 'Beginner' }, stock: 21, rating: 4.4, reviews: 33 },
  { name: 'AeroMax Apache 3.5CH Helicopter', category: 'rc-planes-helicopters', brand: 'AeroMax', price: 3490, compare: null, badge: null, featured: 0, image: 'plane', variant: 2,
    short: 'Coaxial rotor helicopter with a gyro for stable indoor hovering.',
    desc: 'A coaxial twin-rotor design and built-in gyro cancel out spin, so the Apache hovers rock-steady indoors — ideal for living-room flying.',
    specs: { 'Rotor type': 'Coaxial, gyro-stabilised', 'Flight time': '8 minutes', 'Control range': '25 m', 'Battery': '1 x 500mAh (included)', 'Skill level': 'Beginner' }, stock: 27, rating: 4.3, reviews: 48 },
  { name: 'AeroMax Warbird Foam Fighter Jet', category: 'rc-planes-helicopters', brand: 'AeroMax', price: 6490, compare: 7990, badge: 'Hot', featured: 1, image: 'plane', variant: 3,
    short: 'EDF-powered warbird replica with retractable landing gear.',
    desc: 'A ducted-fan powertrain gives the Warbird a genuine jet sound and fast, punchy passes, while working retractable landing gear adds scale realism on takeoff.',
    specs: { 'Wingspan': '640 mm', 'Propulsion': 'EDF ducted fan', 'Flight time': '7 minutes', 'Battery': '1 x 1300mAh 3S (included)', 'Skill level': 'Intermediate' }, stock: 12, rating: 4.7, reviews: 21 },
  { name: 'AeroMax Dual Rotor Chinook Helicopter', category: 'rc-planes-helicopters', brand: 'AeroMax', price: 8990, compare: null, badge: null, featured: 0, image: 'plane', variant: 4,
    short: 'Twin tandem-rotor scale helicopter with LED night-flight lights.',
    desc: 'Modelled on the tandem-rotor Chinook, this scale helicopter is a head-turner at the park, complete with LED lights for low-light flying sessions.',
    specs: { 'Rotor type': 'Tandem twin-rotor', 'Flight time': '10 minutes', 'Control range': '80 m', 'Battery': '1 x 1200mAh (included)', 'Skill level': 'Intermediate' }, stock: 7, rating: 4.6, reviews: 14 },

  // Gel Blasters & Guns
  { name: 'StrikeForce Vulcan Gel Blaster Rifle', category: 'gel-blasters-guns', brand: 'StrikeForce', price: 3990, compare: 4990, badge: 'Hot', featured: 1, image: 'blaster', variant: 0,
    short: 'Full-auto electric gel blaster with a 400-round hopper.',
    desc: 'A full-auto gearbox and 400-round hopper keep the Vulcan feeding through backyard skirmishes, with an adjustable stock for shooters of any height.',
    specs: { 'Fire mode': 'Full-auto / semi-auto', 'Ammo': '7-8mm water gel beads', 'Hopper capacity': '400 rounds', 'Power': 'Rechargeable battery (included)', 'Age rating': '14+' }, stock: 33, rating: 4.6, reviews: 91 },
  { name: 'StrikeForce Sidearm Gel Blaster Pistol', category: 'gel-blasters-guns', brand: 'StrikeForce', price: 1590, compare: null, badge: null, featured: 0, image: 'blaster', variant: 1,
    short: 'Compact spring-action sidearm with a 120-round magazine.',
    desc: 'A compact, spring-action backup piece with a quick-release 120-round magazine — the go-to sidearm once the Vulcan runs dry.',
    specs: { 'Fire mode': 'Manual spring-action', 'Ammo': '7-8mm water gel beads', 'Magazine capacity': '120 rounds', 'Power': 'None (manual)', 'Age rating': '14+' }, stock: 47, rating: 4.4, reviews: 55 },
  { name: 'StrikeForce Storm SMG Electric Blaster', category: 'gel-blasters-guns', brand: 'StrikeForce', price: 4990, compare: 5990, badge: null, featured: 0, image: 'blaster', variant: 2,
    short: 'SMG-style blaster with adjustable hop-up for longer range.',
    desc: 'An adjustable hop-up unit lets you dial in range and accuracy, turning the compact Storm SMG into a genuinely competitive backyard-battle sidearm.',
    specs: { 'Fire mode': 'Full-auto / semi-auto', 'Ammo': '7-8mm water gel beads', 'Hopper capacity': '300 rounds', 'Power': 'Rechargeable battery (included)', 'Age rating': '14+' }, stock: 18, rating: 4.5, reviews: 27 },
  { name: 'StrikeForce Sniper Pro Bolt Action Blaster', category: 'gel-blasters-guns', brand: 'StrikeForce', price: 5490, compare: null, badge: null, featured: 0, image: 'blaster', variant: 3,
    short: 'Bolt-action sniper with scope and bipod for long-range plinking.',
    desc: 'A bolt-action cycle, included scope, and folding bipod give the Sniper Pro real long-range accuracy for skirmish snipers who prefer patience over spray-and-pray.',
    specs: { 'Fire mode': 'Manual bolt-action', 'Ammo': '7-8mm water gel beads', 'Magazine capacity': '25 rounds', 'Power': 'None (manual)', 'Age rating': '14+' }, stock: 14, rating: 4.7, reviews: 18 },
  { name: 'StrikeForce Junior Foam Dart Blaster Combo', category: 'gel-blasters-guns', brand: 'StrikeForce', price: 1290, compare: 1590, badge: null, featured: 0, image: 'blaster', variant: 4,
    short: 'Soft foam-dart blaster twin pack, safe for younger kids.',
    desc: 'A twin-pack of soft foam-dart blasters built for younger kids — no gel beads, no mess, just safe, springy foam darts and a target to aim at.',
    specs: { 'Fire mode': 'Manual spring-action', 'Ammo': 'Foam darts (20 included)', 'Magazine capacity': '6 darts', 'Power': 'None (manual)', 'Age rating': '5+' }, stock: 62, rating: 4.5, reviews: 103 },

  // Gadgets
  { name: 'VoltEdge Action Camera 4K Waterproof', category: 'gadgets', brand: 'VoltEdge', price: 5990, compare: 7490, badge: 'New', featured: 0, image: 'gadget', variant: 0,
    short: '4K/30fps action cam with EIS and a waterproof housing to 30m.',
    desc: 'Electronic image stabilisation keeps footage smooth on a bike or a wakeboard, and the included housing is rated to 30 metres for anything underwater.',
    specs: { 'Video': '4K/30fps, 1080p/120fps', 'Waterproof': '30 m with case', 'Battery life': '~90 minutes recording', 'Storage': 'microSD up to 256GB', 'Mounts': 'Standard action-cam mount' }, stock: 29, rating: 4.5, reviews: 44 },
  { name: 'VoltEdge Smart Electric Scooter', category: 'gadgets', brand: 'VoltEdge', price: 24990, compare: 28990, badge: null, featured: 1, image: 'gadget', variant: 1,
    short: 'Foldable e-scooter, 25 km range, app-connected ride stats.',
    desc: 'A foldable frame fits in a car boot or under a desk, while a 25 km range and companion app tracking make it a practical daily commuter.',
    specs: { 'Range': '25 km per charge', 'Top speed': '25 km/h', 'Charge time': '~5 hours', 'Max load': '100 kg', 'Foldable': 'Yes' }, stock: 10, rating: 4.6, reviews: 31 },
  { name: 'VoltEdge Handheld Gimbal Stabilizer', category: 'gadgets', brand: 'VoltEdge', price: 3290, compare: null, badge: null, featured: 0, image: 'gadget', variant: 2,
    short: '3-axis smartphone gimbal with follow-focus and gesture control.',
    desc: 'A 3-axis brushless gimbal smooths out handheld phone footage, with gesture and voice control so you can start a shot without touching the phone.',
    specs: { 'Axes': '3-axis brushless', 'Battery life': '~12 hours', 'Compatibility': 'Most phones up to 280g', 'Modes': 'Pan-follow, lock, POV, gesture', 'Charging': 'USB-C' }, stock: 25, rating: 4.4, reviews: 22 },
  { name: 'VoltEdge Mini Retro Game Console', category: 'gadgets', brand: 'VoltEdge', price: 2490, compare: 2990, badge: 'Bestseller', featured: 0, image: 'gadget', variant: 3,
    short: 'Plug-and-play retro console preloaded with 620 classic games.',
    desc: 'Plug it into any HDMI TV and go — 620 classic-style games are preloaded, with two wireless controllers included for couch co-op.',
    specs: { 'Output': 'HDMI, 720p', 'Games included': '620', 'Controllers': '2 wireless (included)', 'Storage': 'Internal, expandable via USB', 'Power': 'USB-C' }, stock: 40, rating: 4.3, reviews: 76 },
  { name: 'VoltEdge Bluetooth FPV Goggles', category: 'gadgets', brand: 'VoltEdge', price: 6990, compare: null, badge: null, featured: 0, image: 'gadget', variant: 4,
    short: 'Lightweight FPV goggles compatible with SkyForce drone feeds.',
    desc: 'Lightweight FPV goggles with adjustable diopters, built to pair with the SkyForce Falcon Pro and Racer FPV Kit for an immersive first-person view.',
    specs: { 'Display': 'Dual 5-inch LCD', 'Latency': '<40ms', 'Compatibility': 'SkyForce FPV-enabled drones', 'Battery life': '~2 hours', 'Diopter adjustment': 'Yes' }, stock: 15, rating: 4.5, reviews: 17 },

  // Spares & Batteries
  { name: 'NovaRC 2200mAh LiPo Battery 2S', category: 'spare-parts', brand: 'NovaRC', price: 1290, compare: null, badge: null, featured: 0, image: 'battery', variant: 0,
    short: 'High-discharge 2S LiPo pack compatible with most hobby-grade RCs.',
    desc: 'A high-discharge-rate 2S LiPo pack that drops straight into most hobby-grade drones, cars, and planes needing a standard XT30/XT60 connector.',
    specs: { 'Capacity': '2200mAh', 'Cell config': '2S (7.4V)', 'Discharge rate': '35C', 'Connector': 'XT30 (adapter included)', 'Weight': '~130g' }, stock: 80, rating: 4.6, reviews: 52 },
  { name: 'NovaRC Smart Balance Charger', category: 'spare-parts', brand: 'NovaRC', price: 1990, compare: null, badge: null, featured: 0, image: 'battery', variant: 1,
    short: 'Balance charger for 1-4S LiPo packs with auto cut-off.',
    desc: 'Charges and balances 1S to 4S LiPo packs with automatic cut-off, protecting your batteries from the overcharging that shortens their lifespan.',
    specs: { 'Compatible cells': '1S-4S LiPo', 'Charge current': '0.5A-2A adjustable', 'Safety': 'Auto cut-off, short protection', 'Ports': '1 balance + 1 charge', 'Power': 'USB-C input' }, stock: 44, rating: 4.7, reviews: 39 },
  { name: 'NovaRC Replacement Propeller Set (4pc)', category: 'spare-parts', brand: 'NovaRC', price: 490, compare: 590, badge: null, featured: 0, image: 'battery', variant: 2,
    short: 'Balanced replacement propellers, fits most SkyForce drones.',
    desc: 'Factory-balanced replacement propellers sized for the SkyForce drone range — keep a spare set on hand since props are the first thing a hard landing breaks.',
    specs: { 'Compatibility': 'SkyForce X7, Falcon Pro, Beginner Drone', 'Material': 'Reinforced polymer', 'Set size': '2 pairs (4 blades)', 'Colour': 'Black', 'Balanced': 'Yes' }, stock: 95, rating: 4.4, reviews: 61 },
  { name: 'NovaRC All-Terrain Tire Set for 1/10 Cars', category: 'spare-parts', brand: 'NovaRC', price: 890, compare: null, badge: null, featured: 0, image: 'battery', variant: 3,
    short: 'Deep-tread foam-filled tires, pre-glued to 1/10-scale wheels.',
    desc: 'Deep-tread, foam-filled tires pre-glued to standard 1/10-scale wheel hubs — a quick swap that revives grip on a worn-out crawler or monster truck.',
    specs: { 'Scale fit': '1:10', 'Tread': 'All-terrain deep-tread', 'Fill': 'Foam-filled (no flats)', 'Set size': '4 wheels', 'Hub type': '12mm hex' }, stock: 51, rating: 4.5, reviews: 28 },
  { name: 'NovaRC Drone Motor Replacement Kit', category: 'spare-parts', brand: 'NovaRC', price: 1590, compare: null, badge: null, featured: 0, image: 'battery', variant: 4,
    short: 'Set of 4 brushed motors compatible with entry-level camera drones.',
    desc: 'A set of four brushed replacement motors sized for entry-level camera drones, plus mounting screws — the fix for a drone that suddenly pulls to one side.',
    specs: { 'Compatibility': 'Most entry-level camera drones', 'Motor type': 'Brushed, coreless', 'Set size': '2 CW + 2 CCW', 'Includes': 'Mounting screws', 'Voltage': '3.7V' }, stock: 36, rating: 4.3, reviews: 15 },
];

const insertCategory = db.prepare(`INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES (@name, @slug, @icon, @sort_order)`);
const insertProduct = db.prepare(`
  INSERT INTO products (name, slug, category_id, brand, price, compare_at_price, short_description, description, specs, image_key, image_variant, stock, rating, review_count, badge, featured)
  VALUES (@name, @slug, @category_id, @brand, @price, @compare_at_price, @short_description, @description, @specs, @image_key, @image_variant, @stock, @rating, @review_count, @badge, @featured)
`);
const insertReview = db.prepare(`
  INSERT INTO reviews (product_id, name, rating, comment) VALUES (@product_id, @name, @rating, @comment)
`);

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const testimonialPool = [
  { name: 'Rohan M., Mumbai', rating: 5, comment: "Flew it the same evening it arrived — the GPS hold made learning so much easier than I expected." },
  { name: 'Priya S., Pune', rating: 5, comment: "Ordered on a Tuesday, had it by Thursday. Packaging was solid, nothing rattled inside." },
  { name: 'Arjun K., Bengaluru', rating: 4, comment: "Great build quality for the price. Battery life is a little shorter than advertised but still good." },
  { name: 'Sneha T., Delhi', rating: 5, comment: "Customer support actually picked up the phone when I had a question about the charger. Rare these days." },
  { name: 'Vikram R., Ahmedabad', rating: 5, comment: "My son hasn't put it down since it arrived. Survived three crashes into the sofa already." },
  { name: 'Ananya G., Chennai', rating: 4, comment: "Exactly as described. Would like more colour options but no complaints on performance." },
];

const seedTx = db.transaction(() => {
  for (const c of categories) insertCategory.run(c);

  const categoryRows = db.prepare('SELECT id, slug FROM categories').all();
  const categoryIdBySlug = Object.fromEntries(categoryRows.map((r) => [r.slug, r.id]));

  const productIds = [];
  for (const p of products) {
    const info = insertProduct.run({
      name: p.name,
      slug: slugify(p.name),
      category_id: categoryIdBySlug[p.category],
      brand: p.brand,
      price: p.price,
      compare_at_price: p.compare ?? null,
      short_description: p.short,
      description: p.desc,
      specs: JSON.stringify(p.specs || {}),
      image_key: p.image,
      image_variant: p.variant,
      stock: p.stock,
      rating: p.rating,
      review_count: p.reviews,
      badge: p.badge,
      featured: p.featured,
    });
    productIds.push(info.lastInsertRowid);
  }

  // Attach a couple of testimonial reviews to a spread of featured products
  const featuredIds = productIds.filter((_, i) => products[i].featured);
  featuredIds.forEach((pid, i) => {
    const t1 = testimonialPool[i % testimonialPool.length];
    const t2 = testimonialPool[(i + 3) % testimonialPool.length];
    insertReview.run({ product_id: pid, name: t1.name, rating: t1.rating, comment: t1.comment });
    insertReview.run({ product_id: pid, name: t2.name, rating: t2.rating, comment: t2.comment });
  });
});

function seedIfEmpty() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM categories').get();
  if (count > 0) return false;
  seedTx();
  return true;
}

if (require.main === module) {
  seedTx();
  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

module.exports = { seedIfEmpty };
