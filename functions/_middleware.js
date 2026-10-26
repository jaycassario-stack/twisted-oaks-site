// 1. Send the bare domain (twistedoaksstudio.com) to the www address, keeping the path and query.
// 2. When a page isn't found, send old WordPress addresses to the closest page on the new site.
//    Real pages are never touched: the old-site map is only checked after a 404.

const S = '/stories/';
const STORY = {
  bishop: '/stories/steve-madison-bishop-farmstead-wedding/',
  woolverton: '/stories/steve-maria-woolverton-inn-wedding/',
  johnsons: '/stories/matt-erica-johnsons-locust-hall-farm-wedding/',
  ben: '/stories/chris-danielle-cescaphe-ballroom-at-the-ben-wedding/',
  vie: '/stories/branon-celeste-the-vie-philadelphia-wedding/',
  unionTrust: '/stories/gianna-simon-union-trust-philadelphia-wedding/',
  oceanCity: '/stories/branon-celeste-ocean-city-nj-engagement/',
  capeMay: '/stories/mason-morgan-congress-hall-cape-may-engagement/',
};
const ENG = '/guides/engagement-session-locations-south-jersey-jersey-shore/';
const CHOOSE = '/guides/choosing-a-wedding-photographer-south-jersey-philadelphia/';

// Old post or page slug -> new address (checked first)
const EXACT = {
  'home': '/', 'blog': S, 'blog-grid': S, 'blog-post-3': S, 'blog-post-4': S, 'featured-weddings': S,
  'about': '/about/', 'profiles': '/about/', 'reviews': '/about/', 'gear': '/about/',
  'editing-samples': '/about/', 'post-processing-before-and-after': '/about/',
  'portfolio': '/portfolio/',
  'album-designs': '/investment/', 'albums': '/investment/', 'albums-faq': '/investment/',
  'album-reveal-melanie-joe': '/investment/', 'linen-swatches': '/investment/', 'leather-swatches': '/investment/',
  'canvas-prints': '/investment/', 'framed-cotton-prints': '/investment/', 'products': '/investment/',
  'top-philly-wedding-venues': CHOOSE, 'top-5-rustic-venues-nj-pa': CHOOSE, 'top-5-rustic-venues-nj-pa-2': CHOOSE,
  'top-6-rustic-': CHOOSE, 'why-a-professional-wedding-photographeris-a-smart-choice': CHOOSE,
  'ideal-wedding-photo-timeline-2': CHOOSE,
  'reasons-to-get-engagement-photos': ENG,
  'a-bishop-farmstead-wedding-steve-madison': STORY.bishop, 'bishop': STORY.bishop,
  '21896-2': STORY.woolverton, 'woolverton-inn-elopement-heather-randy': STORY.woolverton,
  'johnsons-locust-hall-farm-wedding': STORY.johnsons,
  'ballroom-at-the-ben-wedding-chris-danielle': STORY.ben,
  'mark-sam-cescaphe-ballroom': STORY.ben,
  'the-vie-by-cescaphe-wedding': STORY.vie, 'vie-by-cescaphe-wedding-gino-amanda': STORY.vie,
  'alyssa-jeff-the-vie-in-philly': STORY.vie, 'alyssa-jeff': STORY.vie,
  'michelle-ken-union-trust-wedding': STORY.unionTrust,
  'ocean-city-engagement-lillian-michael': STORY.oceanCity,
  'cape-may-engagement-tara-matthew': STORY.capeMay,
};

const NEW_SECTIONS = new Set(['assets', 'stories', 'guides', 'contact', 'faq', 'investment', 'locations', 'functions']);

// Services and pages that no longer exist: leave these as "not found"
const GONE = /lifestyle|family|newborn|maternity|boudoir|utah|salt-lake|red-rock|spring-sale|^chase$|stinsman|test-post|sarahs-portfolio|^tag$|^wp-|^feed$/;
// WordPress photo pages (one per uploaded photo): leave as "not found"
const PHOTO_PAGE = /jpg_\d|_o$|_k(-\d+)?$|^\d{8,}|^twisted-oaks-studio-.*\d+$|^jay_cassario_twisted_oaks|^[a-z]{0,4}\d{3,}/;

function oldSiteTarget(path) {
  const segs = path.replace(/^\/_main_site(?=\/|$)/, '').split('/').filter(Boolean);
  if (!segs.length) return '/';
  const slug = decodeURIComponent(segs[0]).toLowerCase();
  if (NEW_SECTIONS.has(slug) || /\.[a-z0-9]{2,5}$/.test(path)) return null; // new-site areas and files
  if (slug === 'category') return S;
  if (EXACT[slug]) return EXACT[slug];
  if (GONE.test(slug) || PHOTO_PAGE.test(slug)) return null;
  if (slug.startsWith('bishop-farmstead')) return STORY.bishop;
  if (slug.includes('ballroom-at-the-ben')) return STORY.ben;
  if (slug.includes('engagement')) return ENG;
  return S; // every other old wedding, elopement or anniversary post
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'twistedoaksstudio.com') {
    url.hostname = 'www.twistedoaksstudio.com';
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  const res = await context.next();
  if (res.status !== 404) return res;
  const target = oldSiteTarget(url.pathname);
  if (!target || target === url.pathname) return res;
  return Response.redirect(new URL(target, url.origin).toString(), 301);
}

