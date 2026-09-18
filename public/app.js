// Vanilla DOM rendering. All content comes from the Express JSON endpoints.
const status = document.querySelector('#status');
const list = document.querySelector('#fight-list');
const detail = document.querySelector('#fight-detail');

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function link(href, text, className) {
  const node = element('a', className, text);
  node.href = href;
  return node;
}
function rank(number) { return String(number).padStart(2, '0'); }

function renderCard(fight) {
  const card = element('article', `fight-card card-${fight.rank}`);
  const heading = element('div', 'card-top');
  heading.append(element('span', 'rank', rank(fight.rank)), element('span', 'format', fight.format));
  const title = element('h3');
  title.append(link(`/fights/${fight.slug}`, fight.title, 'fight-link'));
  const footer = element('div', 'card-bottom');
  footer.append(element('span', 'spotlight', fight.spotlight), element('span', 'card-arrow', '↗'));
  footer.lastChild.setAttribute('aria-hidden', 'true');
  card.append(heading, element('p', 'card-arc', fight.arc), title, element('p', 'card-description', fight.description), footer);
  return card;
}

function renderDetail(fight) {
  document.title = `${fight.title} — Super Fights`;
  const hero = element('section', 'detail-hero');
  hero.append(element('p', 'eyebrow', `RANK ${rank(fight.rank)} / ${fight.format.toUpperCase()} / SPOILERS`), element('h1', '', fight.title), element('p', 'detail-description', fight.description));
  const panel = element('article', 'facts-panel');
  panel.append(element('h2', '', 'The matchup'));
  const facts = element('dl', 'facts');
  for (const [label, value] of [['Fighters', fight.fighters.join(' / ')], ['Story arc or movie', fight.arc], ['Location', fight.location], ['Spotlight', fight.spotlight], ['Rank', `#${fight.rank} of 6`], ['Format', fight.format], ['Record ID', fight.id], ['Slug', fight.slug]]) {
    const pair = element('div');
    pair.append(element('dt', '', label), element('dd', '', String(value)));
    facts.append(pair);
  }
  panel.append(facts, link(fight.source, 'Story reference ↗', 'source-link'));
  const story = element('div', 'fight-story');
  for (const [heading, text] of [['The standout moment', fight.standoutMoment], ['Why it makes the list', fight.whyItRanks], ['How it ends', fight.outcome]]) {
    const section = element('section');
    section.append(element('h2', '', heading), element('p', '', text));
    story.append(section);
  }
  const body = element('div', 'detail-grid');
  body.append(story, panel);
  detail.append(hero, body, link('/', '← Explore all six fights', 'back-link'));
}

async function load() {
  try {
    const slug = location.pathname.split('/').filter(Boolean)[1];
    const response = await fetch(list ? '/api/fights' : `/api/fights/${encodeURIComponent(slug)}`);
    if (!response.ok) throw new Error('Unable to load fights');
    const data = await response.json();
    if (list) data.forEach(fight => list.append(renderCard(fight)));
    else renderDetail(data);
    status.hidden = true;
  } catch {
    status.replaceChildren(element('span', '', 'The fight data couldn’t load. '));
    const retry = element('button', 'retry', 'Try again');
    retry.type = 'button';
    retry.addEventListener('click', () => {
      status.textContent = 'Loading…';
      if (list) list.replaceChildren();
      if (detail) detail.replaceChildren();
      load();
    });
    status.append(retry);
  }
}
load();
