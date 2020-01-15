var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
var delay = (ms) => new Promise(res => setTimeout(res, ms));

async function getDOC(url){
  var res = await fetch(url);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text,'text/html');
  return doc;
}

async function getSpecialties(){
  var doc = await getDOC('https://www.sharecare.com/find-a-doctor/specialty');
  return Array.from(cn(doc,'list__item')).filter(el=> tn(el,'a')[0] && /find-a-doctor\/specialty/.test(tn(el,'a')[0].href) ).map(el=> tn(el,'a')[0].href)
}

async function getStatesFromSpecialty(specialty){
  var doc = await getDOC(specialty);
  var stateLinks = Array.from(cn(doc,'state__name')).map(el=> tn(el,'a')[0].href);
  return stateLinks;
  
}

async function getProfileLinks(city){
  var doc = await getDOC(city);
  var profileLinks = Array.from(cn(doc,'media-title')).map(el=> tn(el,'a')[0].href);
  return profileLinks;
}

async function getCitiesFromStateLinks(specialty){
  var cityArr = [];
  var stateLinks = await getStatesFromSpecialty(specialty);
  for(var i=0; i<stateLinks.length; i++){
    var doc = await getDOC(stateLinks[i]);
    var cityLinks = Array.from(cn(doc,'city__name')).map(el=> el.href);
    cityLinks.forEach( el=> cityArr.push(el) );
    await delay(rando(666)+1111);
  }
  return cityArr;
}

async function loopThroughSpecialties(){
  var allCities = [];
  var specialties = await getSpecialties();
  for(var i=0; i<specialties.length; i++){
    console.log(i);
    var cities = await getCitiesFromStateLinks(specialties[i]);
    cities.forEach( el=> allCities.push(el) );
    await delay(rando(666)+1111); 
  }
  console.log(allCities);
  return allCities;
}

async function loopThroughCitites(){
  var profileLinks = [];
  var cityLinks = await loopThroughSpecialties();
  for(var i=0; i<cityLinks.length; i++){
    var profiles = getProfileLinks(cityLinks[i]);
    profiles.forEach( el=> profileLinks.push(el) );
    await delay(rando(666)+1111);
  }
  console.log(profileLinks);
}

loopThroughCitites()
