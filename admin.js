async function load(){
 const r=await fetch("/api/analytics"); if(r.status===401||r.status===403){document.body.innerHTML="<main><h2>Доступ к аналитике защищён.</h2><p>Обновите страницу и введите логин/пароль администратора.</p></main>";return}
 const d=await r.json();
 kpis.innerHTML=[["Ответов",d.total],["Положительно к обслуживанию",d.servicePositive+"%"],["Приемлемость +10%",d.acceptable10+"%"],["Средняя оценка текущего формата",d.avgRating+"/5"]].map(x=>`<div class=kpi>${x[0]}<b>${x[1]}</b></div>`).join("");
 draw("service",d.serviceAttitude,d.total);draw("price",d.price10,d.total);
 drawMap("benefits",d.benefits);drawMap("concerns",d.concerns);
 rows.innerHTML="<table><tr><th>Дата</th><th>Посещение</th><th>Обслуживание</th><th>+10%</th><th>Оценка</th></tr>"+d.rows.slice(0,50).map(x=>`<tr><td>${x.created_at}</td><td>${x.visit_frequency}</td><td>${x.service_attitude}</td><td>${x.price_10}</td><td>${x.current_rating||""}</td></tr>`).join("")+"</table>";
}
function draw(id,a,total){document.getElementById(id).innerHTML=a.map(x=>`<div class=bar><div class=barlabel><span>${x.label}</span><b>${x.count}</b></div><div class=track><div class=fill style="width:${total?x.count/total*100:0}%"></div></div></div>`).join("")}
function drawMap(id,m){let a=Object.entries(m).sort((x,y)=>y[1]-x[1]);document.getElementById(id).innerHTML=a.map(x=>`<div class=bar><div class=barlabel><span>${x[0]}</span><b>${x[1]}</b></div><div class=track><div class=fill style="width:${Math.min(100,x[1]/Math.max(...a.map(z=>z[1]))*100)}%"></div></div></div>`).join("")}
function downloadQR(){const a=document.createElement("a");a.href="/api/qr";a.download="QR-опрос-гостей.png";a.click()}
load();