const main = document.querySelector('main');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escapeHTML;
let portfolio, frameworks, presentation;
const frameworkMeta = [
  {key:'standards',label:'Teaching standards',short:'Standards',title:'Eight standards. One connected practice.',intro:'The 2026 Standards for the Teaching Profession provide a lens for reflecting on my teaching, relationships and professional growth.',dataKey:'standards'},
  {key:'domains',label:'King’s College Domains',short:'King’s domains',title:'Values made visible in everyday practice.',intro:'Learning is larger than a lesson. These eight domains offer a way to reflect on my contribution to classroom and house life at King’s.',dataKey:'domains'},
  {key:'code',label:'Code of Professional Responsibility',short:'Professional code',title:'The commitments behind the work.',intro:'Professional responsibility shapes how I teach, communicate and contribute to the community around each learner.',dataKey:'code'},
  {key:'tataiako',label:'Tātaiako',short:'Tātaiako',title:'Culture, identity and reciprocal learning.',intro:'A place to reflect specifically on practice that supports Māori learners and on my own continuing cultural learning.',dataKey:'tataiako'},
  {key:'tapasa',label:'Tapasā',short:'Tapasā',title:'Relationships that recognise Pacific learners.',intro:'A place to make Pacific learners’ identities, languages, cultures and aspirations visible in my professional reflection.',dataKey:'tapasa'}
];
const domainDescriptions = [
  'Making understanding, curiosity and purposeful progress central to the learning experience.',
  'Recognising different languages, cultures and perspectives in the classroom and in house life.',
  'Listening to students, making room for different views and sharing meaningful responsibility.',
  'Considering how our choices, including digital choices, affect the world around us.',
  'Helping learners approach unfamiliar challenges with curiosity, preparation and resilience.',
  'Modelling responsibility and supporting others to contribute with confidence and care.',
  'Using our knowledge, time and abilities to make a useful contribution to others.',
  'Making space for reflection, purpose, personal values and a sense of belonging.'
];
const criterionTitle = (group,index) => {
  const text=frameworks[group].criteria[index].originalText;
  if(group===0) return text.replace(/^\d+ - PS 2026 - /,'').split(' - ')[0];
  if(group===1 || group===2) return text.replace(/^\d+ - /,'').replace(/\.$/,'');
  if(group===3) return text.replace(/^\d+ - /,'').split(' - ')[0];
  return text.replace(/^\d+ - /,'');
};
const criterionDescription=(group,index)=>{
  if(group===1) return domainDescriptions[index];
  const text=frameworks[group].criteria[index].originalText;
  if(group===0) return text.split(' - ').slice(3).join(' - ');
  if(group===3) return text.split(' - ').slice(2).join(' - ');
  if(group===2) return ['Reflecting honestly, maintaining professional knowledge and learning with colleagues.','Supporting learning, dignity, inclusion and wellbeing in professional decisions.','Developing respectful, reciprocal communication with families and whānau.','Considering the wider contribution and responsibilities of education.'][index];
  return ['Knowing and valuing Pacific learners’ identities, languages and cultures.','Building relationships that support learners, families and professional collaboration.','Connecting knowledge of Pacific learners with responsive teaching and reflection.'][index];
};
function matchesCriterion(item,group,index){
  const key=frameworkMeta[group].dataKey;
  return item[key].includes(group<2 ? index+1 : frameworks[group].criteria[index].interleadId);
}
const linkedEntries=(group,index)=>portfolio.evidence.filter(item=>matchesCriterion(item,group,index));
const eyebrow=text=>`<div class="eyebrow"><span class="dash"></span>${text}</div>`;
const breadcrumb=(label,parent='')=>`<div class="breadcrumb"><a href="#/">Overview</a><span>/</span>${parent}${e(label)}</div>`;

const isIntention=item=>item.entryType==='intention';
const displayYears=item=>item.yearLabel||item.year;
const paragraphs=text=>String(text||'').split(/\n\s*\n/).filter(Boolean).map(text=>`<p>${e(text)}</p>`).join('');
const safeEvidenceURL=value=>{try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:'';}catch{return '';}};
function visualFor(item){return presentation[item.id]||{cover:{lines:[item.title],label:item.category}};}
// Broad content categories retain their meaning; a cover may specify a more precise visual category.
const cardCategories = {
  'Curriculum and Pedagogy': {className:'card-curriculum'},
  'Creative Technologies': {className:'card-creative'},
  'Assessment and Reflection': {className:'card-assessment'},
  'Pastoral Care and Mentoring': {className:'card-pastoral'},
  'Professional Growth and PD': {className:'card-growth'}
};
const cardCategoryAliases = {
  Teaching:'Curriculum and Pedagogy',
  Curriculum:'Curriculum and Pedagogy',
  Assessment:'Assessment and Reflection',
  Pastoral:'Pastoral Care and Mentoring',
  'Professional learning':'Professional Growth and PD',
  Culture:'Professional Growth and PD'
};
function coverArt(item){
  const cover=visualFor(item).cover, image=item.gallery?.[cover.galleryIndex];
  const category=cover.category||cardCategoryAliases[item.category]||item.category;
  const colour=cardCategories[category]||cardCategories['Curriculum and Pedagogy'];
  const photo=image?`<span class="cover-photo ${cover.fit==='contain'?'cover-contained':''}"><img src="${e(cover.thumbnail||image.src)}" alt="" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" style="object-fit:${e(cover.fit||'cover')};object-position:${e(cover.position||'center')}"></span>`:'';
  return `<div class="reflection-cover type-cover ${colour.className}" data-card-category="${e(category)}" aria-hidden="true"><span class="type-label">${e(cover.label||item.category)}</span><span class="type-title">${(cover.lines||[item.title]).map(line=>`<span>${e(line)}</span>`).join('')}</span><span class="type-footer">Cici Yang <span>Teaching notes</span></span>${photo}</div>`;
}
function card(item){
  return `<a class="practice-card" href="#/evidence/${e(item.id)}" aria-labelledby="card-title-${e(item.id)}">${coverArt(item)}<div class="card-body"><div class="card-meta"><span><span class="reflection-number">${e(item.number)}</span> / ${e(item.category)}</span>${item.year?`<span>${e(item.years?.length>1?item.years[0]+' to '+item.years.at(-1):item.year)}</span>`:''}</div><h3 id="card-title-${e(item.id)}">${e(item.title)}</h3></div></a>`;
}
function evidenceFigure(image,{feature=false,wide=false}={}){
  return `<figure class="${feature?'case-feature':'evidence-figure'}${wide?' evidence-wide':''}"><a href="${e(image.src)}" target="_blank" rel="noopener" aria-label="View full image: ${e(image.alt)}"><img src="${e(image.src)}" alt="${e(image.alt)}" width="${image.width}" height="${image.height}" ${feature?'fetchpriority="high"':'loading="lazy"'} decoding="async"></a><figcaption>${e(image.caption)}</figcaption></figure>`;
}
function home(){
  return `<div class="wrap"><section class="hero"><div>${eyebrow('A PROFESSIONAL PORTFOLIO · 2024 to 2026')}<h1>Teaching minds.<br><em>Supporting<br>people.</em></h1><p class="hero-copy">${e(portfolio.profile.introduction[1])} ${e(portfolio.profile.introduction[2])}</p><div class="button-row"><a class="button" href="#/evidence">Explore my practice <span>↗</span></a><a class="text-link" href="#/about">My teaching story <span>→</span></a></div><div class="hero-footnote">COMPUTER SCIENCE &nbsp; / &nbsp; PASTORAL CARE &nbsp; / &nbsp; PROFESSIONAL GROWTH</div></div><figure class="portrait-feature"><img src="assets/cici-yang.svg" width="2226" height="2176" alt="Cici Yang" fetchpriority="high"><figcaption><strong>Cici Yang</strong><span>Teacher · Designer · Lifelong learner</span></figcaption></figure></section><div class="context-strip"><div class="context-item"><small>Early foundations</small><p>Year 9 coding</p></div><div class="context-item"><small>Building pathways</small><p>Year 11 computer science</p></div><div class="context-item"><small>Senior learning</small><p>Cambridge AS · NCEA 2 & 3</p></div><div class="context-item"><small>Pastoral connection</small><p>Middlemore House tutor</p></div></div><section class="section"><div class="section-heading"><div>${eyebrow('SELECTED REFLECTIONS')}<h2>Where practice becomes<br>something to learn from.</h2></div><a class="text-link" href="#/evidence">All ${portfolio.evidence.length} reflections <span>↗</span></a></div><div class="grid-three featured-grid">${['first-lines','debugging-together','middlemore'].map(id=>card(portfolio.evidence.find(x=>x.id===id))).join('')}</div></section><section class="feature-pastoral"><div>${eyebrow('THE OTHER SIDE OF MY PRACTICE')}<h2>Good teaching starts<br>with knowing people.</h2><p>My Middlemore House tutor role brings another perspective to my work: listening, noticing, following through, and helping students feel connected to school life.</p><a class="button light" href="#/evidence?category=Pastoral">Explore pastoral reflections <span>↗</span></a></div><div class="pastoral-principles"><div><span>01.</span><p>Listen with care.</p></div><div><span>02.</span><p>Build a connection.</p></div><div><span>03.</span><p>Follow through.</p></div></div></section><section class="section"><div class="section-heading"><div>${eyebrow('THE FRAMEWORKS BEHIND THE PRACTICE')}<h2>Different lenses.<br>A connected portfolio.</h2></div><p>One experience can speak to more than one commitment. Each reflection is connected to the standards and values it could help demonstrate.</p></div><div class="framework-grid"><a class="framework-tile main" href="#/frameworks/standards"><div><small>2026 teaching profession</small><div class="big-number">08</div></div><div><h3>Standards for<br>the Teaching Profession</h3><p>Knowledge, practice and relationships, brought together.</p></div><span class="tile-arrow">↗</span></a><a class="framework-tile" href="#/frameworks/domains"><small>Life at King’s</small><h3>King’s College<br>Domains</h3><p>Eight ways of considering a wider contribution.</p><span class="tile-arrow">↗</span></a><a class="framework-tile" href="#/frameworks/code"><small>Professional commitments</small><h3>Our professional<br>responsibility</h3><p>To learners, families, the profession and society.</p><span class="tile-arrow">↗</span></a><a class="framework-tile wide" href="#/frameworks/tataiako"><div><small>Cultural competencies</small><h3>Tātaiako & Tapasā</h3></div><p>Reflecting specifically on practice for Māori and Pacific learners.</p><span class="tile-arrow">↗</span></a></div></section><div class="closing-note"><p>“${e(portfolio.profile.philosophy.at(-1))}”</p><small>My teaching philosophy</small></div></div>`;
}

function evidencePage(params){
  const selected=params.get('framework')||'';
  const group=frameworkMeta.findIndex(f=>f.key===selected);
  const criteriaOptions=group<0?'':frameworks[group].criteria.map((c,i)=>`<option value="${i}" ${params.get('criterion')===String(i)?'selected':''}>${e(criterionTitle(group,i))}</option>`).join('');
  return `<div class="wrap gallery-page"><div class="gallery-intro"><div><div class="eyebrow">REFLECTIONS / 2024 to 2026</div><h1>My practice.</h1></div><p>Explore my teaching, pastoral care and professional learning. These reflections bring together experiences, questions and intentions for my practice.</p></div><div class="filters" role="search" aria-label="Filter reflections"><div class="filter-field"><label for="search">Find a reflection</label><input id="search" type="search" placeholder="Try coding, tutoring, feedback…" value="${e(params.get('q')||'')}"></div><div class="filter-field"><label for="year">Year</label><select id="year"><option value="">All years</option>${['2024','2025','2026'].map(y=>`<option ${params.get('year')===y?'selected':''}>${y}</option>`).join('')}</select></div><div class="filter-field"><label for="framework">Framework</label><select id="framework"><option value="">All frameworks</option>${frameworkMeta.map(f=>`<option value="${f.key}" ${selected===f.key?'selected':''}>${f.short}</option>`).join('')}</select></div><div class="filter-field"><label for="criterion">Criterion</label><select id="criterion" ${group<0?'disabled':''}><option value="">All criteria</option>${criteriaOptions}</select></div></div><div class="results-header"><span id="results-count" aria-live="polite"></span><button class="clear-button" id="clear-filters">Clear all filters</button></div><div class="grid-three evidence-grid" id="evidence-results"></div></div>`;
}
function filterResults(params){
  const q=(params.get('q')||'').toLowerCase(),year=params.get('year'),group=frameworkMeta.findIndex(f=>f.key===params.get('framework')),criterion=params.get('criterion'),category=params.get('category');
  return portfolio.evidence.filter(item=>{
    if(year&&!(item.years||[item.year]).includes(year))return false;
    if(category&&item.category!==category)return false;
    if(q&&!`${item.title} ${item.summary} ${item.context} ${item.category} ${item.practice}`.toLowerCase().includes(q))return false;
    if(group>=0){
      if(criterion!==null&&criterion!=='')return Number.isInteger(Number(criterion))&&!!frameworks[group].criteria[Number(criterion)]&&matchesCriterion(item,group,Number(criterion));
      return item[frameworkMeta[group].dataKey].length>0;
    }
    return true;
  });
}
function updateResults(params){
  const items=filterResults(params);
  document.querySelector('#results-count').textContent=`${items.length} reflection${items.length===1?'':'s'}${params.get('category')?' · '+params.get('category'):''}`;
  document.querySelector('#evidence-results').innerHTML=items.length?items.map(card).join(''):'<div class="empty-state"><h3>A different starting point?</h3><p>No reflections match these filters. Try a broader search or clear the filters.</p></div>';
}
function attachFilters(params){
  updateResults(params);
  ['search','year','framework','criterion'].forEach(id=>document.getElementById(id).addEventListener(id==='search'?'input':'change',()=>{
    const values={q:document.getElementById('search').value,year:document.getElementById('year').value,framework:document.getElementById('framework').value,criterion:id==='framework'?'':document.getElementById('criterion').value};
    Object.entries(values).forEach(([key,value])=>value?params.set(key,value):params.delete(key));
    history.replaceState(null,'',`#/evidence${params.size?'?'+params.toString():''}`);
    if(id==='framework'){
      const group=frameworkMeta.findIndex(f=>f.key===values.framework),select=document.getElementById('criterion');
      select.disabled=group<0;
      select.innerHTML='<option value="">All criteria</option>'+(group<0?'':frameworks[group].criteria.map((c,i)=>`<option value="${i}">${e(criterionTitle(group,i))}</option>`).join(''));
    }
    updateResults(params);
  }));
  document.getElementById('clear-filters').addEventListener('click',()=>{
    history.replaceState(null,'','#/evidence');main.innerHTML=evidencePage(new URLSearchParams());attachFilters(new URLSearchParams());document.getElementById('search').focus();
  });
}
function frameworksPage(key='standards'){
  const group=frameworkMeta.findIndex(f=>f.key===key);
  if(group<0)return notFound();
  const meta=frameworkMeta[group];
  return `<div class="wrap">${breadcrumb('Standards & values')}<div class="page-intro">${eyebrow('A FRAMEWORK FOR REFLECTION')}<h1>${meta.title}</h1><p>${meta.intro}</p></div><nav class="framework-tabs" aria-label="Portfolio frameworks">${frameworkMeta.map(f=>`<a class="${key===f.key?'active':''}" href="#/frameworks/${f.key}" ${key===f.key?'aria-current="page"':''}>${f.short}</a>`).join('')}</nav><div class="criteria-list">${frameworks[group].criteria.map((c,i)=>`<a class="criterion-card" href="#/criterion/${key}/${i+1}"><div class="criterion-number">${String(i+1).padStart(2,'0')}</div><div><h3>${e(criterionTitle(group,i))}</h3><p>${e(criterionDescription(group,i))}</p><small>${linkedEntries(group,i).length} reflection${linkedEntries(group,i).length===1?'':'s'} <span>↗</span></small></div></a>`).join('')}</div>${group===0?'<div class="notice">Transition note: the 2026 Standards apply to the Professional Growth Cycle in 2026 and to re-certification from 2027. <a class="text-link" href="https://teachingcouncil.nz/en/code-and-standards/our-code-our-standards/move-to-the-2026-standards" target="_blank" rel="noopener">Teaching Council guidance ↗</a></div>':''}</div>`;
}
function criterionPage(key,number){
  const group=frameworkMeta.findIndex(f=>f.key===key),index=Number(number)-1;
  if(group<0||!frameworks[group].criteria[index])return notFound();
  const title=criterionTitle(group,index),items=linkedEntries(group,index);
  return `<div class="wrap">${breadcrumb(title,`<a href="#/frameworks/${key}">${frameworkMeta[group].short}</a><span>/</span>`)}<div class="page-intro">${eyebrow(`${frameworkMeta[group].label.toUpperCase()} · ${String(index+1).padStart(2,'0')}`)}<h1 class="${title.split(/\s+/).some(word=>word.length>13)?'long-word-title':''}">${e(title)}</h1><p>${e(criterionDescription(group,index))}</p></div>${items.length?`<div class="framework-summary"><div class="large">${String(items.length).padStart(2,'0')}</div><div><h3>Connections to my practice</h3><p>My reflections and teaching intentions explore this aspect of professional practice.</p></div></div>`:''}<div class="grid-three evidence-grid">${items.length?items.map(card).join(''):''}</div></div>`;
}
function evidenceDetail(id){
  const index=portfolio.evidence.findIndex(x=>x.id===id),item=portfolio.evidence[index];if(!item)return notFound();
  const intention=isIntention(item),visual=visualFor(item),linked=[];
  frameworks.forEach((g,gi)=>g.criteria.forEach((c,ci)=>{if(matchesCriterion(item,gi,ci))linked.push(`<a class="tag-link" href="#/criterion/${frameworkMeta[gi].key}/${ci+1}">${frameworkMeta[gi].short} · ${e(criterionTitle(gi,ci))}</a>`);}));
  const sections=item.sections ? item.sections.map(section=>[section.title,section.text]) : intention
    ?[['The learning need',item.need],['My teaching intentions',item.practice],['My reflection',item.reflection],['My next steps',item.next]]
    :[['The situation and learning need',item.need],['What I did and why',item.practice],['What changed',item.impact],['My reflection',item.reflection],['My next steps',item.next]];
  const featureIndex=visual.feature?.galleryIndex,feature=item.gallery?.[featureIndex];
  const gallery=(item.gallery||[]).map((image,i)=>i===featureIndex?'':evidenceFigure(image,{wide:visual.wideEvidence?.includes(i)})).join('');
  const resources=(item.evidenceLinks||[]).filter(link=>safeEvidenceURL(link.url)).map(link=>`<li><a class="text-link" href="${e(safeEvidenceURL(link.url))}" target="_blank" rel="noopener">${e(link.title)} ↗</a></li>`).join('');
  const codeExample=item.codeSample?`<div class="code-evidence"><h3>${e(item.codeSample.title)}</h3><p>${e(item.codeSample.description)}</p><details class="code-example"><summary>View the annotated Python example</summary><pre tabindex="0" aria-label="Python quiz code"><code>${e(item.codeSample.code)}</code></pre></details></div>`:'';
  const feedback=(item.studentFeedback||[]).length?`<section class="student-feedback"><h3>What students told me</h3><p class="evidence-note">Paraphrased from my notes of Year 11 student feedback.</p>${item.studentFeedback.map(response=>`<div class="student-response"><h4>${e(response.label)}</h4><p>${e(response.text)}</p></div>`).join('')}</section>`:'';
  const related=(item.relatedEntries||[]).map(id=>portfolio.evidence.find(entry=>entry.id===id)).filter(Boolean).map(entry=>`<li><a class="text-link" href="#/evidence/${e(entry.id)}">${e(entry.number)} · ${e(entry.title)} ↗</a></li>`).join('');
  const sourceCredits=(item.resourceCredits||[]).map(credit=>'<li>'+e(credit)+'</li>').join('');
  const acknowledgements=sourceCredits?'<section class="resource-credits"><h3>Sources & acknowledgements</h3><ul>'+sourceCredits+'</ul></section>':'';
  const hasEvidence=item.evidenceNotes||gallery||resources||codeExample||feedback||related||acknowledgements;
  const previous=portfolio.evidence[index-1],next=portfolio.evidence[index+1];
  const neighbour=(entry,direction)=>entry?`<a class="case-neighbour" href="#/evidence/${e(entry.id)}"><span>${direction==='Previous'?'← ':''}${direction} reflection / ${e(entry.number)}${direction==='Next'?' →':''}</span><h3>${e(entry.title)}</h3></a>`:`<a class="case-neighbour" href="#/evidence"><span>All reflections</span><h3>Back to my practice</h3></a>`;
  return `<div class="wrap case-study">${breadcrumb('Reflection '+item.number,'<a href="#/evidence">My practice</a><span>/</span>')}<header class="case-intro"><div class="case-meta"><span>${e(item.number)} / ${e(item.category)}</span>${item.year?`<span>${e(displayYears(item))}</span>`:''}${intention?'<span>Teaching intentions</span>':''}</div><h1>${e(item.title)}</h1><p>${e(item.summary)}</p></header>${feature?evidenceFigure(feature,{feature:true}):''}<div class="case-reading"><article>${sections.map(([title,text])=>`<section class="article-section"><h2>${e(title)}</h2>${paragraphs(text)}</section>`).join('')}</article><aside class="detail-sidebar"><section class="sidebar-box"><h2>At a glance</h2><dl><dt>Context</dt><dd>${e(item.context)}</dd>${intention||!displayYears(item)?'':`<dt>Teaching period</dt><dd>${e(displayYears(item))}</dd>`}${item.tool?`<dt>Learning tool</dt><dd>${e(item.tool)}</dd>`:''}<dt>Focus</dt><dd>${e(item.category)}</dd><dt>Portfolio period</dt><dd>King’s College · 2024 to 2026</dd></dl></section>${linked.length?`<section class="sidebar-box"><h2>Connected criteria</h2>${linked.join('')}</section>`:''}</aside></div>${hasEvidence?`<section class="case-evidence"><div class="section-heading"><h2>Evidence & examples</h2><span>${e(item.number)} / Supporting material</span></div><div class="evidence-notes">${item.evidenceNotes?paragraphs(item.evidenceNotes):''}${codeExample}${feedback}</div>${gallery?`<div class="evidence-gallery">${gallery}</div>`:''}${acknowledgements}<div class="resource-columns">${resources?`<div><h3>Linked resources</h3><ul class="evidence-resources">${resources}</ul></div>`:''}${related?`<div><h3>Related reflections</h3><ul class="evidence-resources">${related}</ul></div>`:''}</div></section>`:''}<div class="evidence-actions"><a class="text-link" href="#/evidence">← All reflections</a><button class="outline-button" id="print-reflection">Print this reflection</button></div><nav class="case-navigation" aria-label="Previous and next reflections">${neighbour(previous,'Previous')}${neighbour(next,'Next')}</nav></div>`;
}

function growth(){
  return `<div class="wrap">${breadcrumb('Professional growth')}<div class="page-intro">${eyebrow('A PRACTICE THAT KEEPS DEVELOPING')}<h1>Three years.<br>Always learning.</h1><p>My journey at King’s from 2024 to 2026: adapting to Cambridge, developing my NCEA teaching, and exploring the balance between academic rigour, creativity and student independence.</p></div><div class="timeline">${portfolio.profile.growth.map(({year,title,paragraphs})=>`<section class="timeline-row"><div class="timeline-year">${e(year)}</div><div class="timeline-body">${eyebrow('MY PROFESSIONAL GROWTH')}<h2>${e(title)}</h2>${paragraphs.map(text=>`<p>${e(text)}</p>`).join('')}<a class="text-link" href="#/evidence?year=${year}">Explore the ${year} reflections <span>↗</span></a></div></section>`).join('')}</div><div class="growth-prompt"><div>${eyebrow('A REFLECTIVE HABIT')}<h3 style="margin-top:15px">A better question<br>for the next lesson.</h3></div><ol><li>What am I noticing about learning or belonging?</li><li>Whose perspective do I need to understand?</li><li>What could I change, and why?</li><li>What evidence would help me judge the difference?</li><li>What should I carry into my next step?</li></ol></div></div>`;
}
function about(){
  const profile=portfolio.profile;
  return `<div class="wrap">${breadcrumb('About me')}<div class="page-intro about-intro"><img class="profile-portrait" src="assets/cici-yang.svg" width="2226" height="2176" alt="Cici Yang" fetchpriority="high"><div>${eyebrow('THE PERSON BEHIND THE PORTFOLIO')}<h1>Kia ora.<br>I’m ${e(profile.name)}.</h1><p>${e(profile.role)}<br>${e(profile.school)} · Portfolio period ${e(profile.period)}</p></div></div><div class="about-layout"><div class="about-copy">${profile.introduction.slice(1).map(text=>`<p>${e(text)}</p>`).join('')}<p>Alongside my classroom role, I am a Middlemore House tutor with responsibility for pastoral care.</p><h2>What I want my practice to stand for.</h2>${profile.philosophy.map(text=>`<p>${e(text)}</p>`).join('')}<div class="button-row"><a class="button" href="#/growth">My professional growth <span>↗</span></a><a class="text-link" href="#/evidence">Explore my practice <span>↗</span></a></div></div><div><div class="quote-panel"><span class="quote-mark">“</span><p>${e(profile.philosophy.at(-1))}</p><small>MY TEACHING PHILOSOPHY</small></div><div class="role-list">${[['01','Year 9 coding','An introduction to programming and computational thinking.'],['02','Year 11 computer science','Preparation for NCEA Level 2 and Cambridge AS pathways.'],['03','Senior computer science','Cambridge AS, NCEA Level 2 and NCEA Level 3.'],['04','Middlemore House tutoring','Pastoral care and connection beyond the classroom.']].map(([n,title,text])=>`<div class="role-row"><span>${n}</span><div><strong>${title}</strong><p>${text}</p></div></div>`).join('')}</div></div></div></div>`;
}
function notFound(){return '<div class="wrap page-error"><h1>Let’s find your way back.</h1><p>That page isn’t part of this portfolio.</p><a class="button" href="#/">Back to the overview →</a></div>';}

function render(){
  if(!portfolio)return;
  const hash=location.hash.slice(1)||'/',[path,query='']=hash.split('?'),segments=path.split('/').filter(Boolean),params=new URLSearchParams(query);
  const route=segments[0]||'home';
  let html,title;
  if(route==='home'){html=home();title='Teaching & belonging';}
  else if(route==='evidence'&&segments[1]){html=evidenceDetail(segments[1]);title=portfolio.evidence.find(x=>x.id===segments[1])?.title||'Page not found';}
  else if(route==='evidence'){html=evidencePage(params);title='My practice';}
  else if(route==='frameworks'){html=frameworksPage(segments[1]);title='Standards & values';}
  else if(route==='criterion'){html=criterionPage(segments[1],segments[2]);title='A connection to practice';}
  else if(route==='growth'){html=growth();title='Professional growth';}
  else if(route==='about'){html=about();title='About me';}
  else {html=notFound();title='Page not found';}
  main.innerHTML=html;main.classList.remove('fade-in');void main.offsetWidth;main.classList.add('fade-in');
  document.title=`${title} · Cici Yang`;
  document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===(route==='criterion'?'frameworks':route);active?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
  document.querySelector('#navigation').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
  if(route==='evidence'&&!segments[1])attachFilters(params);
  document.querySelector('#print-reflection')?.addEventListener('click',()=>window.print());
  window.scrollTo({top:0,behavior:'instant'});
}
document.querySelector('.menu-toggle').addEventListener('click',event=>{const button=event.currentTarget,open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));document.querySelector('#navigation').classList.toggle('open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('#navigation').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');}});
document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();main.focus();main.scrollIntoView();});
window.addEventListener('hashchange',()=>{render();main.focus({preventScroll:true});});
try{
  const responses=await Promise.all([fetch('content/portfolio.json'),fetch('content/frameworks.json'),fetch('content/presentation.json')]);
  if(responses.some(r=>!r.ok))throw new Error('Could not load portfolio content.');
  const [data,criteria,visuals]=await Promise.all(responses.map(r=>r.json()));portfolio=data;frameworks=criteria.frameworks;presentation=visuals;render();
}catch(error){main.innerHTML='<div class="wrap page-error"><h1>The portfolio could not load.</h1><p>Please open the site through its local preview address, rather than opening the HTML file directly.</p><button class="button" onclick="location.reload()">Try again →</button></div>';console.error(error);}
