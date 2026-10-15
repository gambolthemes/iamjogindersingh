// Add your verified details here, then run npm run build.
export const profile = {
  name: 'Joginder Singh',
  role: 'Freelance AI Developer & Designer',
  location: 'Ludhiana, Punjab, India',
  email: '', // Your public email. Shown in Contact and used for the form's email-draft fallback.
  formKey: '477600ef-b0b4-4456-9bca-92b6f295262d', // Public access key when formEndpoint is a form service such as https://api.web3forms.com/submit (the key only lets it deliver to your own inbox).
  formEndpoint: 'https://api.web3forms.com/submit', // Where the enquiry form posts JSON, e.g. './contact.php' (see public/contact.php) or a Formspree URL. Leave empty to use email instead.
  linkedin: '',
  github: '',
  portrait: './portrait-square.jpg', // square photo in public/, shown whole (1:1) in the About frame
  resume: '', // e.g. './Joginder-Singh-Resume.pdf'; otherwise opens print-ready resume
};

// Screenshots live in public/work/. They are homepage captures taken on 2026-10-14.
// To refresh one, replace the file with the same name and run npm run build.

// Client work: live websites I have worked on.
export const clientWork = [
  {name:'BirthdayApp',url:'https://birthdayapp.org/',image:'birthdayapp.jpg',description:'Free birthday reminders with cards sent by email or social link.'},
  {name:'Birthday Horoscope',url:'https://birthdayhoroscope.org/',image:'birthdayhoroscope.jpg',description:'Personalised zodiac birthday readings with a 30-day free trial.'},
  {name:'Eclipse Astrology',url:'https://eclipseastrology.org/',image:'eclipseastrology.jpg',description:'Eclipse readings that show where each eclipse falls in your own birth chart.'},
  {name:'Astro Readings',url:'https://astroreadings.org/',image:'astroreadings.jpg',description:'Daily, weekly and monthly astrology forecasts from your birth details.'},
  {name:'Celebria',url:'https://celebria.org/',image:'celebria.jpg',description:'Pick a design, write a message and send a birthday card by email.'},
  {name:'Affectionate Wishes',url:'https://affectionatewishes.com/',image:'affectionatewishes.jpg',description:'Personalised birthday eCards you can share by link, WhatsApp or SMS.'},
  {name:'FancyCards',url:'https://fancycards.org/',image:'fancycards.jpg',description:'A card for every occasion, from Navratri and Diwali to everyday wishes.'},
];

// Personal work: HubToolify (my own product) and its tools.
export const hubtoolify = {
  url: 'https://hubtoolify.com',
  tools: [
    {name:'Icons',path:'/icons/duotone',image:'ht-icons.jpg',description:'2,908 original icons in 11 styles. Line, Solid and Duotone are free.'},
    {name:'Icon Sets',path:'/icons/sets',image:'ht-icon-sets.jpg',description:'Themed icon sets, every design drawn in 4 matching styles.'},
    {name:'Stickers',path:'/stickers',image:'ht-stickers.jpg',description:'1,030 original stickers for festivals, birthdays and everyday moods.'},
    {name:'Icon Studio',path:'/icon-studio',image:'ht-icon-studio.jpg',description:'Customise SVG icons online and export them.'},
    {name:'Sticker Studio',path:'/stickers/creator',image:'ht-sticker-studio.jpg',description:'Design personalised stickers with Hindi, Punjabi or English text.'},
    {name:'Animated SVG Studio',path:'/animated-svg-studio',image:'ht-animated-svg-studio.jpg',description:'Bring SVG icons to life with animation presets and a keyframe timeline.'},
    {name:'Festival Post Maker',path:'/stickers/post-maker',image:'ht-festival-post-maker.jpg',description:'Create festival greeting posts with your own logo and offer.'},
    {name:'Festival Reel Maker',path:'/stickers/reel-maker',image:'ht-festival-reel-maker.jpg',description:'Turn stickers and your logo into short festival reels.'},
  ],
};

// Personal work: templates and scripts sold on Gambolthemes. Images are the product cover art.
export const gambolthemes = {
  url: 'https://gambolthemes.net/products',
  themeforest: 'https://themeforest.net/user/gambolthemes/',
  products: [
    {name:'Northwind Goods',subtitle:'React Ecommerce Storefront Template',type:'Site Templates',slug:'northwind-goods-react-ecommerce-template',image:'gt-northwind-goods.jpg'},
    {name:'Wishtales',subtitle:'AI Digital Greeting Card and Gift SaaS Platform',type:'PHP Scripts',slug:'wishtales-ai-digital-greeting-card-amp-gift-saas-platform',image:'gt-wishtales.webp'},
    {name:'VendorHive',subtitle:'Multi-Vendor Marketplace Package for Laravel',type:'PHP Scripts',slug:'vendorhive-multi-vendor-marketplace-package-for-laravel',image:'gt-vendorhive.webp'},
    {name:'Linkora',subtitle:'All-in-One Digital Marketplace, LMS & Community Platform',type:'PHP Scripts',slug:'linkora-all-in-one-digital-marketplace-lms-amp-community-platform',image:'gt-linkora.webp'},
    {name:'GamboDeals',subtitle:'Coupons, Cashback, Offers and Promo Code',type:'HTML Templates',slug:'gambodeals-coupons-cashback-offers-and-promo-code-html-template',image:'gt-gambodeals.webp'},
    {name:'Kamalo',subtitle:'Online Grocery Supermarket Mobile Template',type:'HTML Templates',slug:'kamalo-online-grocery-supermarket-mobile-template',image:'gt-kamalo.webp'},
    {name:'Barren',subtitle:'Event Booking',type:'HTML Templates',slug:'barren-event-booking-html-template',image:'gt-barren.webp'},
    {name:'Ukiyox',subtitle:'NFT Marketplace',type:'HTML Templates',slug:'ukiyox-nft-marketplace-html-template',image:'gt-ukiyox.webp'},
    {name:'Micko',subtitle:'Social Community and Marketplace',type:'HTML Templates',slug:'micko-social-community-and-marketplace-html-template',image:'gt-micko.webp'},
    {name:'Gambo',subtitle:'Online Grocery Supermarket',type:'HTML Templates',slug:'gambo-online-grocery-supermarket-html-template',image:'gt-gambo.webp'},
    {name:'Cursus',subtitle:'LMS & Online Courses Marketplace',type:'HTML Templates',slug:'cursus-lms-amp-online-courses-marketplace-html-template',image:'gt-cursus.webp'},
    {name:'Mediacamp',subtitle:'Online Advertising',type:'HTML Templates',slug:'mediacamp-online-advertising-html-template',image:'gt-mediacamp-html.webp'},
    {name:'Jobby',subtitle:'Job Portal Multi-Purpose Marketplace',type:'HTML Templates',slug:'jobby-job-portal-multi-purpose-marketplace-html-template',image:'gt-jobby.webp'},
    {name:'Goeveni',subtitle:'Event Sharing Social Network',type:'HTML Templates',slug:'goeveni-event-sharing-social-network-html-template',image:'gt-goeveni-html.webp'},
    {name:'Natto',subtitle:'Online Food Ordering Social Networking',type:'HTML Templates',slug:'natto-online-food-ordering-social-networking-html-template',image:'gt-natto-html.webp'},
    {name:'Brexit',subtitle:'Classified and Directory Social Networking',type:'HTML Templates',slug:'brexit-classified-and-directory-social-networking-html-template',image:'gt-brexit.webp'},
    {name:'DS Studio',subtitle:'Photography Template for Photographers',type:'HTML Templates',slug:'ds-studio-photography-html-template-for-photographers',image:'gt-ds-studio.webp'},
    {name:'Visa Corner',subtitle:'Immigration and Consulting',type:'PSD Templates',slug:'visa-corner-immigration-and-consulting-psd-template',image:'gt-visa-corner.webp'},
    {name:'Goeveni',subtitle:'Event Sharing Social Network',type:'PSD Templates',slug:'goeveni-event-sharing-social-network-psd-template',image:'gt-goeveni-psd.webp'},
    {name:'Natto',subtitle:'Online Food Ordering Social Networking',type:'PSD Templates',slug:'natto-online-food-ordering-social-networking-psd-template',image:'gt-natto-psd.webp'},
    {name:'Mediacamp',subtitle:'Online Advertising',type:'PSD Templates',slug:'mediacamp-online-advertising-psd-template',image:'gt-mediacamp-psd.webp'},
    {name:'YouListing',subtitle:'Classified Listing and Directory Social Networking',type:'PSD Templates',slug:'youlisting-classified-listing-and-directory-social-networking-psd-template',image:'gt-youlisting.webp'},
    {name:'Workwise',subtitle:'The Freelancer and Social Networking',type:'PSD Templates',slug:'workwise-the-freelancer-and-social-networking-psd-template',image:'gt-workwise.webp'},
  ],
};
