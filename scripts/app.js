
/*Ladataan sivunsisäinen HTML pages-kansion tiedostoista
  ja luodaan historiaentry, jotta back/forward toimii.
*/
function loadPage(page, addToHistory = true) {
  fetch(`pages/${page}.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;
      if (addToHistory) {
        if (!(history.state && history.state.page === page)) {
          history.pushState({ page }, '', `#${page}`);
        }
      }
      setActiveNav(page);
    })
    .catch(err => {
      document.getElementById("content").innerHTML = "Virhe ladattaessa sivua";
    });

}

// Ladataan aloitussivu ja asetetaan historiaentry
loadPage("homepage", false);
history.replaceState({ page: 'homepage' }, '', '#homepage');

// Apufunktio, joka yrittää päätellä sivun nimen linkistä
function getPageFromLink(link) {
  if (link.dataset && link.dataset.page) return link.dataset.page;
  const onclickAttr = link.getAttribute && link.getAttribute('onclick');
  if (onclickAttr) {
    const m = onclickAttr.match(/loadPage\(\s*['\"]([^'\"]+)['\"]\s*\)/);
    if (m) return m[1];
  }

  const href = link.getAttribute && link.getAttribute('href');
  if (!href) return null;
  if (href.includes('#')) return href.split('#').pop().replace('.html','');
  const parts = href.split('/').pop();
  return parts.replace('.html','');
}

// Asetetaan aktiivinen navigaatiolinkki
function setActiveNav(page) {
  const links = document.querySelectorAll("nav a");
  links.forEach(l => {
    const p = getPageFromLink(l);
    if (p && p === page) l.classList.add('aktiivinen'); else l.classList.remove('aktiivinen');
  });
}

const links = document.querySelectorAll("nav a");

// Asetetaan klikkikuuntelijat navigaatiolinkeille
links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = getPageFromLink(link) || 'homepage';
    links.forEach(l => l.classList.remove("aktiivinen"));
    link.classList.add("aktiivinen");
    loadPage(page);
  });
});

// Käsitellään back/forward-navigointi
window.addEventListener('popstate', (e) => {
  const page = (e.state && e.state.page) || location.hash.replace('#','') || 'homepage';
  loadPage(page, false);
});

//Form eventlistener
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'laheta') {
    alert("Lomake lähetetty.\nOlemme yhteydessä teihin mahdollisimman pian");
  }
});


//Tuotesivun eventlistenerit
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'puukko1' || e.target && e.target.id === 'puukkokuva1') {
    loadPage("puukko1");
  }
});
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'puukko2' || e.target && e.target.id === 'puukkokuva2') {
    loadPage("puukko2");
  }
});
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'puukko3' || e.target && e.target.id === 'puukkokuva3') {
    loadPage("puukko3");
  }
});

