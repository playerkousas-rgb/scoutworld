// Scout World Explorer — jsdom runtime tests（整合版，waves 1–28）
// 用法：先喺 localhost:8080 serve 個 repo（python3 -m http.server 8080），再 npm ci
// jsdom 係開發工具，裝喺本 repo 的 devDependencies。
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = __dirname;
const BASE = 'http://localhost:8080/';
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

function runTest(label, test) {
  return test().then(() => { console.log('✅ ' + label); return true; })
    .catch((e) => { console.log('❌ ' + label + ' — ' + e.message); return false; });
}
const assert = (c, m) => { if (!c) throw new Error(m); };
const getLocal = (reg, cc) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', reg, 'local', cc + '.json'), 'utf8'));

(async () => {
  const dom = new JSDOM(html, { url: BASE, runScripts: 'dangerously', pretendToBeVisual: true });
  const w = dom.window;
  const doc = w.document;

  function chainable() { const h = () => h; return h; }
  const mkLayer = () => ({
    addTo: () => mkLayer(), bindPopup: () => mkLayer(), bindTooltip: () => mkLayer(), on: () => mkLayer(),
    remove: () => mkLayer(), clearLayers: () => mkLayer(), openPopup: () => mkLayer(),
    setLatLng: () => mkLayer(), _latlng: { lat: 0, lng: 0 }
  });
  const mkMap = () => ({
    addTo: () => mkMap(), on: () => mkMap(), remove: () => mkMap(), removeLayer: () => mkMap(),
    setView: () => mkMap(), panTo: () => mkMap(), fitBounds: () => mkMap(), flyTo: () => mkMap(),
    invalidateSize: () => mkMap(), getZoom: () => 5, getCenter: () => ({ lat: 22.3, lng: 114.2 }),
    getBounds: () => ({ pad: () => ({}) }), eachLayer: () => {}, addLayer: () => mkLayer(),
    scrollWheelZoom: { disable: () => {} }, touchZoom: { disable: () => {} },
    doubleClickZoom: { disable: () => {} }, boxZoom: { disable: () => {} },
    keyboard: { disable: () => {} }, dragging: { disable: () => {} }, _container: doc.createElement('div')
  });
  w.L = {
    map: () => mkMap(),
    control: { zoom: () => ({ addTo: () => ({}) }), scale: () => ({ addTo: () => ({}) }) },
    tileLayer: () => ({ addTo: () => mkMap() }),
    marker: () => mkLayer(), circleMarker: () => mkLayer(), circle: () => mkLayer(),
    layerGroup: () => mkLayer(), featureGroup: () => mkLayer(),
    polygon: () => mkLayer(), polyline: () => mkLayer(), icon: () => ({}), divIcon: () => ({}),
    latLng: (a, b) => ({ lat: a, lng: b }), latLngBounds: () => ({ pad: () => ({}) })
  };
  // app 以相對路徑 fetch data/*.json → 駁去 localhost:8080
  w.fetch = (u, o) => fetch(new URL(String(u), BASE).href, o);
  w.open = () => null;

  const $ = s => doc.querySelector(s);
  const l3Rows = () => [...doc.querySelectorAll('#l3-list > div')];
  async function clickHot(cc) {
    const b = doc.querySelector(`.hot-chip[data-cc="${cc}"]`);
    assert(b, `hot chip ${cc} missing`);
    b.click();
    await new Promise(r => setTimeout(r, 1500));
  }
  async function jump(cc) { w.eval(`jumpToCountryByCode('${cc}')`); await new Promise(r => setTimeout(r, 1200)); }

  await new Promise(r => setTimeout(r, 2500)); // 等 app init

  // ============ 核心咁載 ============
  await runTest('核心：索引/計數一致 + 熱籤掣齊', async () => {
    const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/search-index.json'), 'utf8'));
    const idxLen = Array.isArray(idx) ? idx.length : (idx.items || []).length;
    assert(idxLen === 1366, 'index 1366: got ' + idxLen);
    const pc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/place-counts.json'), 'utf8'));
    assert(Object.keys(pc).length === 178, '178 codes');
    ['JP','TW','KR','SG','TH','AU','GB','CH'].forEach(cc => assert(doc.querySelector(`.hot-chip[data-cc="${cc}"]`), 'hot chip ' + cc));
  });

  // ============ 第18波 Phase 6 貢獻流程 ============
  await runTest('第18波 issue 三表＋頁尾報料', async () => {
    ['01-new-place.yml', '02-outdated-info.yml', '03-correction.yml', 'config.yml'].forEach(f => {
      assert(fs.existsSync(path.join(ROOT, '.github/ISSUE_TEMPLATE', f)), 'missing ' + f);
    });
    const t1 = fs.readFileSync(path.join(ROOT, '.github/ISSUE_TEMPLATE/01-new-place.yml'), 'utf8');
    assert(/來源網址/.test(t1), '01 source rule');
    assert(/報料|issues\/new\/choose/.test(html), 'footer link');
  });

  // ============ 第19波 ⭐收藏夾 ============
  await runTest('第19波 收藏夾全鏈（JP）', async () => {
    assert(/sw-favorites-v1/.test(html) && html.includes('fav-drawer-btn'), 'fav code');
    w.localStorage.removeItem('sw-favorites-v1');
    await clickHot('JP');
    const rows = l3Rows();
    assert(rows.length > 5, 'JP rows');
    const favBtns = [...doc.querySelectorAll('.fav-star-btn')];
    assert(favBtns.length > 0, 'row stars');
    rows[0].click();
    await new Promise(r => setTimeout(r, 800));
    const dbtn = $('#fav-drawer-btn');
    assert(dbtn, 'drawer fav btn');
    dbtn.click();
    await new Promise(r => setTimeout(r, 500));
    const fav = JSON.parse(w.localStorage.getItem('sw-favorites-v1') || '[]');
    assert(Array.isArray(fav) ? fav.length >= 1 : Object.keys(fav).length >= 1, 'fav saved');
    assert($('#favorites-panel'), 'panel exists');
    w.localStorage.removeItem('sw-favorites-v1');
  });

  // ============ 第20波 fee/bookingUrl ============
  await runTest('第20波 營地 fee/bookingUrl chips', async () => {
    const jp = getLocal('asia-pacific', 'JP');
    const osaka = jp.find(p => p.id === 'JP-CAMP-OSAKA');
    assert(osaka && osaka.fee && /100/.test(osaka.fee) && osaka.bookingUrl, 'osaka camp chips');
    const thelea = getLocal('asia-pacific', 'AU').find(p => p.id === 'AU-CAMP-THELEA-TAS');
    assert(thelea.fee && !thelea.bookingUrl, 'thelea honest fee-only');
    assert(/fetched 2026-08-10/.test(thelea.verificationStatus), 'thelea date');
    const th = getLocal('asia-pacific', 'TH');
    assert(th.filter(p => p.type === 'Campsite').every(p => !p.fee && !p.bookingUrl), 'TH chip-free');
  });

  // ============ 第21波 openingHours ============
  await runTest('第21波 openingHours chips', async () => {
    const jp = getLocal('asia-pacific', 'JP');
    assert(/11:00–19:00/.test(jp.find(p => p.id === 'JP-SHOP-OSAKA').openingHours), 'osaka hours');
    assert(/09:30–16:30/.test(getLocal('asia-pacific', 'SG').find(p => p.id === 'SG-SHOP-HQ').openingHours), 'sg hours');
    assert(/11:00–17:30/.test(getLocal('europe', 'GB').find(p => p.id === 'GB-SHOP-GLASGOW').openingHours), 'glasgow');
    assert(/fa-clock/.test(html), 'clock icon');
  });

  // ============ 第22波 KE 騎劫域名清零 ============
  await runTest('第22波 肯雅騎劫域名連結清零', async () => {
    // 騎劫域名唔准出現喺任何可點擊欄位（status 文字警告保留）
    const files = ['data/africa/local/KE.json', 'data/world/local/SHOPPING.json'];
    for (const f of files) {
      const d = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
      const items = Array.isArray(d) ? d : Object.values(d).flatMap(v => (v && v.items) || []);
      for (const it of items) {
        for (const k of ['website', 'bookingUrl', 'facebook', 'instagram', 'verificationSource'])
          assert(!/kenyascouts\.org/.test(it[k] || ''), `${f} ${it.id}.${k} still links hijacked domain`);
      }
    }
    const ke = getLocal('africa', 'KE');
    assert(/騎劫/.test(ke.find(p => p.id === 'KE-SHOPS-NETWORK').verificationStatus), 'KE warn missing');
  });

  // ============ 第23波 地蔵山＋山中 ============
  await runTest('第23波 地蔵山＋山中', async () => {
    const jp = getLocal('asia-pacific', 'JP');
    assert(jp.length === 20, 'JP count 20: got ' + jp.length);
    const jizo = jp.find(p => p.id === 'JP-CAMP-JIZOUYAMA');
    assert(jizo && jizo.fee && jizo.bookingUrl, 'jizo chips');
    assert(/official camp website/.test(jizo.verificationStatus), 'jizo status');
    const yama = jp.find(p => p.id === 'JP-CAMP-YAMANAKA');
    assert(!yama.fee && !yama.bookingUrl && /tertiary/.test(yama.verificationStatus), 'yama honesty');
  });

  // ============ 第24波 visitorNote ============
  await runTest('第24波 visitorNote chips', async () => {
    const jp = getLocal('asia-pacific', 'JP');
    assert(/公眾不可用/.test(jp.find(p => p.id === 'JP-CAMP-JIZOUYAMA').visitorNote), 'jizo note');
    assert(/必須致電|未經官方確認/.test(jp.find(p => p.id === 'JP-CAMP-YAMANAKA').visitorNote), 'yama note');
    assert(/全球童軍/.test(getLocal('europe', 'CH').find(p => p.id === 'CH-CAMP-KISC').visitorNote), 'KISC note');
    assert(/國際署/.test(getLocal('europe', 'GR').find(p => p.id === 'GR-CAMP-AGIOS-ANDREAS').visitorNote), 'GR note');
    const th = getLocal('asia-pacific', 'TH');
    assert(th.filter(p => p.type === 'Campsite').every(p => !p.visitorNote), 'TH note-free');
    assert(/fa-earth-asia/.test(html), 'earth icon');
  });

  // ============ 第25波 對外開放篩選 ============
  await runTest('第25波 大掃＋🌏對外開放篩選掣', async () => {
    assert(html.includes('data-type="access"'), 'access chip missing');
    assert(/startsWith\(['"]✅['"]\)/.test(html), 'access logic missing');
    const gb = getLocal('europe', 'GB');
    const gilwell = gb.find(p => p.id === 'GB-CAMP-GILWELL');
    assert(gilwell.visitorNote.includes('歡迎海外') && gilwell.phone === '+44 20 8138 0191', 'gilwell fields');
    assert(gb.find(p => p.id === 'GB-CAMP-BROWNSEA').visitorNote.includes('National Trust'), 'brownsea');
    const se = getLocal('europe', 'SE');
    assert(se.find(p => p.id === 'SE-CAMP-VASSARO-UPPLAND').visitorNote.startsWith('✅'), 'vassaro');
    await clickHot('GB');
    doc.querySelector('.l3-type-btn[data-type="access"]').click();
    await new Promise(r => setTimeout(r, 600));
    const rows = l3Rows();
    assert(rows.length > 0, 'no rows after access filter');
    assert(rows.every(r => r.textContent.includes('🌏')), 'non-access rows leaked');
    const text = rows.map(r => r.textContent).join('');
    assert(text.includes('Gilwell') && text.includes('白浪島'), 'expected centres missing');
    doc.querySelector('.l3-type-btn[data-type="all"]').click();
  });

  // ============ 第26波 AU/CA/ID/NZ ============
  await runTest('第26波 澳加印尼紐西蘭營地結構化', async () => {
    const au = getLocal('asia-pacific', 'AU');
    const wh = au.find(p => p.id === 'AU-CAMP-WOODHOUSE-SA');
    assert(/A\$22/.test(wh.fee) && /venue\.life/.test(wh.bookingUrl), 'woodhouse fee/booking');
    assert(/9:00/.test(wh.openingHours) && wh.visitorNote.startsWith('✅'), 'woodhouse hours/note');
    const gv = au.find(p => p.id === 'AU-CAMP-GILWELL-VIC');
    assert(gv.visitorNote.startsWith('✅') && !gv.bookingUrl && !gv.fee, 'gilwellVIC honesty');
    const hsr = getLocal('americas', 'CA').find(p => p.id === 'CA-CAMP-HALIBURTON');
    assert(hsr.bookingUrl === 'https://scouts.doubleknot.com/facilitysearch/4646', 'HSR booking');
    assert(hsr.visitorNote.startsWith('⚠️'), 'HSR note');
    const idn = getLocal('asia-pacific', 'ID');
    const cib = idn.find(p => p.id === 'ID-CAMP-BUPERTA-CIBUBUR');
    assert(cib.visitorNote.startsWith('⚠️') && !cib.fee && /Kompas/.test(cib.verificationStatus), 'cibubur honest');
    const nz = getLocal('asia-pacific', 'NZ');
    assert(nz.find(p => p.id === 'NZ-CAMP-BROOKFIELD').visitorNote.startsWith('✅'), 'brookfield');
    assert(/drive\.google/.test(nz.find(p => p.id === 'NZ-CAMP-RUAPEHU').bookingUrl), 'ruapehu');
    await clickHot('AU');
    doc.querySelector('.l3-type-btn[data-type="access"]').click();
    await new Promise(r => setTimeout(r, 600));
    const t = l3Rows().map(r => r.textContent).join('');
    assert(t.includes('Woodhouse') && t.includes('Cataract') && !t.includes('Cottermouth'), 'AU access split');
    doc.querySelector('.l3-type-btn[data-type="all"]').click();
  });

  // ============ 第27波 KR/MX ============
  await runTest('第27波 韓HQ場租＋江原修練場修復', async () => {
    const kr = getLocal('asia-pacific', 'KR');
    const hq = kr.find(p => p.id === 'KR-HQ-KSA');
    assert(/₩25萬/.test(hq.fee) && /association\/facility/.test(hq.bookingUrl), 'KR HQ hall');
    assert(hq.type === 'Headquarters' && !hq.visitorNote, 'HQ no visitorNote');
    const gw = kr.find(p => p.id === 'KR-CAMP-GANGWON-JAMBOREE');
    assert(gw.website === 'http://wjs.or.kr/' && gw.visitorNote.startsWith('⚠️'), 'gangwon');
    const mz = getLocal('americas', 'MX').find(p => p.id === 'MX-CAMP-MEZTITLA');
    assert(/2026-08-10 重核/.test(mz.verificationStatus), 'MX honest');
    const my = getLocal('asia-pacific', 'MY');
    assert(my.length === 10 && !my.some(p => p.type === 'Campsite'), 'MY honest hold');
    await clickHot('KR');
    doc.querySelector('.l3-type-btn[data-type="access"]').click();
    await new Promise(r => setTimeout(r, 600));
    const krRows = l3Rows();
    assert(krRows.length === 1 && krRows[0].textContent.includes('中央訓練院'), 'KR access = only 中央訓練院');
    doc.querySelector('.l3-type-btn[data-type="all"]').click();
  });

  // ============ 第28波 歐洲小國＋美洲 ============
  await runTest('第28波 BE/FR/EE/CZ/ES/CY/AR/US 結構化', async () => {
    const be = getLocal('europe', 'BE');
    const dk = be.find(p => p.id === 'BE-CAMP-DE-KLUIS');
    assert(dk.visitorNote.startsWith('✅') && /hopper\.be/.test(dk.bookingUrl) && /1,200/.test(dk.description), 'de kluis');
    const mk = be.find(p => p.id === 'BE-CAMP-MERKENVELD');
    assert(mk.visitorNote.startsWith('✅') && /1,300/.test(mk.description), 'merkenveld');
    const fr = getLocal('europe', 'FR');
    const jv = fr.find(p => p.id === 'FR-CAMP-JAMBVILLE');
    assert(/365/.test(jv.openingHours) && /formulaire-de-reservation/.test(jv.bookingUrl) && jv.visitorNote.startsWith('✅'), 'jambville 3 chips');
    const ee = getLocal('europe', 'EE');
    const tg = ee.find(p => p.id === 'EE-CAMP-TAGAMETSA');
    assert(tg.visitorNote.startsWith('✅') && /1999/.test(tg.description) && !tg.bookingUrl && !tg.fee, 'tagametsa honest ✅ no-booking');
    const cz = getLocal('europe', 'CZ');
    const km = cz.find(p => p.id === 'CZ-CAMP-KAPRALUV-MLYN');
    assert(km.visitorNote.startsWith('⚠️') && /國際署/.test(km.visitorNote) && km.phone === '+420 739 834 879', 'kapraluv ⚠️');
    const es = getLocal('europe', 'ES');
    assert(es.find(p => p.id === 'ES-CAMP-GRIEBAL').visitorNote.includes('歐洲'), 'griebal ✅');
    const cy = getLocal('europe', 'CY');
    const pl = cy.find(p => p.id === 'CY-CAMP-PLATANIA');
    assert(/6–8 月/.test(pl.openingHours) && pl.visitorNote.startsWith('⚠️') && /180 人/.test(pl.description), 'platania');
    assert(/Your Content Goes Here|空白/.test(cy.find(p => p.id === 'CY-CAMP-KAPPARIS').verificationStatus), 'kapparis honest');
    const at = getLocal('europe', 'AT');
    assert(/HTTPS Not Available|SSL/.test(at.find(p => p.id === 'AT-CAMP-SCOUT-CAMP-AUSTRIA').verificationStatus), 'AT SSL flag');
    const ar = getLocal('americas', 'AR');
    const csa = ar.find(p => p.id === 'AR-CAMP-CENTRO-SCOUT');
    assert(csa.visitorNote.startsWith('✅') && /reservar/.test(csa.bookingUrl) && csa.verificationSource.includes('centroscout'), 'AR reservar+✅');
    const us = getLocal('americas', 'US');
    const sb = us.find(p => p.id === 'US-CAMP-SEA-BASE');
    assert(sb.visitorNote.startsWith('✅') && /SCENES/.test(sb.description), 'sea base ✅');
    ['US-CAMP-PHILMONT', 'US-CAMP-SUMMIT-BECHTEL', 'US-CAMP-NORTHERN-TIER'].forEach(id => {
      const it = us.find(p => p.id === id);
      assert(it.visitorNote.startsWith('⚠️') && it.bookingUrl, id + ' ⚠️+booking');
    });
    // 全庫重算斷言（第28波後）
    let bk = 0, vn = 0, fee = 0, oh = 0, c0 = 0;
    require('child_process').execSync('true');
    const glob = fs.readdirSync; // hand-rolled glob
    for (const reg of fs.readdirSync(path.join(ROOT, 'data'))) {
      const lp = path.join(ROOT, 'data', reg, 'local');
      if (!fs.existsSync(lp)) continue;
      for (const fn of fs.readdirSync(lp)) {
        if (!fn.endsWith('.json') || fn === 'region.json') continue;
        let arr; try { arr = JSON.parse(fs.readFileSync(path.join(lp, fn), 'utf8')); } catch (e) { continue; }
        if (!Array.isArray(arr)) continue;
        for (const it of arr) {
          if (it.fee) fee++; if (it.bookingUrl) bk++; if (it.openingHours) oh++; if (it.visitorNote) vn++;
          if (it.type === 'Campsite' && !it.fee && !it.bookingUrl && !it.openingHours && !it.visitorNote) c0++;
        }
      }
    }
    assert(bk === 47 && vn === 58 && fee === 10 && oh === 15 && c0 === 180, `totals bk${bk} vn${vn} fee${fee} oh${oh} c0${c0}`);
    // 動態：BE 對外開放 → De Kluis＋Merkenveld 出列
    await jump('BE');
    doc.querySelector('.l3-type-btn[data-type="access"]').click();
    await new Promise(r => setTimeout(r, 600));
    const beRows = l3Rows();
    assert(beRows.length > 0 && beRows.every(r => r.textContent.includes('🌏')), 'BE access rows');
    const bt = beRows.map(r => r.textContent).join('');
    assert(bt.includes('De Kluis') && bt.includes('Merkenveld'), 'BE ✅ missing');
    doc.querySelector('.l3-type-btn[data-type="all"]').click();
  });

  console.log('\n===== 測試結束 =====');
})();
