const questions=[
 {key:"visit_frequency",title:"Как часто вы посещаете нашу точку?",multi:false,opts:["Первый раз","Реже 1 раза в месяц","1–3 раза в месяц","1–2 раза в неделю","3 раза в неделю и чаще"]},
 {key:"service_attitude",title:"Как вы относитесь к полноценному обслуживанию за столом?",multi:false,opts:["Определённо положительно","Скорее положительно","Нейтрально","Скорее отрицательно","Определённо отрицательно","Мне сложно ответить"]},
 {key:"current_rating",title:"Как вы оцениваете текущий формат самообслуживания?",multi:false,opts:["1 — совсем неудобно","2","3","4","5 — очень удобно"]},
 {key:"price_10",title:"Если стоимость заказа увеличится на 10%, как вы отнесётесь?",multi:false,opts:["Для меня приемлемо","Скорее приемлемо","Зависит от качества обслуживания","Скорее неприемлемо","Совершенно неприемлемо","Затрудняюсь ответить"]},
 {key:"priority",title:"Что для вас важнее?",multi:false,opts:["Более низкая цена и самообслуживание","Более высокий сервис при +10%","Баланс цены и сервиса"]},
 {key:"benefits",title:"Что было бы преимуществом полноценного обслуживания?",multi:true,opts:["Не нужно самостоятельно оформлять/забирать заказ","Можно спокойно сидеть за столом","Больше внимания персонала","Удобнее для компаний","Удобнее для семей с детьми","Более комфортная атмосфера","Не вижу преимуществ"]},
 {key:"concerns",title:"Что могло бы вас беспокоить?",multi:true,opts:["Более долгое ожидание","Сложнее сделать заказ","Нужно ждать официанта","Возможное повышение цен","Сервисный сбор","Привычнее самообслуживание","Ничего"]},
 {key:"preferred_cases",title:"В каких случаях вы бы предпочли обслуживание?",multi:true,opts:["Всегда","С семьёй","С друзьями/компанией","На деловой встрече","Вечером","По выходным","Не предпочитаю"]},
];
let step=-1, answers={};
const app=document.querySelector("#app");
function render(){
 if(step===-1){app.innerHTML=`<div class="logo">♥ Ваше мнение</div><h1>Нам важно знать, что удобно именно вам</h1><p class="intro">Мы рассматриваем переход от экспресс-самообслуживания к полноценному обслуживанию за столом. Опрос займёт 1–2 минуты.</p><p class="small">Ответы используются в обобщённом виде для анализа.</p><button class="primary" onclick="step=0;render()">Начать опрос →</button>`;return}
 if(step>=questions.length){app.innerHTML=`<div class="thanks"><div class="heart">♥</div><h1>Спасибо за обратную связь!</h1><p class="intro">Ваше мнение помогает нам принимать решения о формате обслуживания.</p><button class="primary" onclick="location.reload()">Готово</button></div>`;return}
 const q=questions[step], cur=answers[q.key]||(q.multi?[]:"");
 app.innerHTML=`<div class="small">Вопрос ${step+1} из ${questions.length}</div><div class="progress"><i style="width:${(step+1)/questions.length*100}%"></i></div><h2>${q.title}</h2>`+
 q.opts.map((o,i)=>`<button class="option ${(q.multi?cur.includes(o):cur===o)?"selected":""}" data-i="${i}"><span>${q.multi?(cur.includes(o)?"✓":"□"):(cur===o?"●":"○")}</span>${o}</button>`).join("")+
 `<button class="primary" id="next">${step===questions.length-1?"Завершить":"Далее →"}</button>`;
 document.querySelectorAll(".option").forEach(b=>b.onclick=()=>{const o=q.opts[b.dataset.i];if(q.multi){const a=answers[q.key]||[];answers[q.key]=a.includes(o)?a.filter(x=>x!==o):[...a,o]}else answers[q.key]=o;render()});
 document.querySelector("#next").onclick=submitOrNext;
}
async function submitOrNext(){
 const q=questions[step]; if(!answers[q.key] || (q.multi&&!answers[q.key].length)){alert("Пожалуйста, выберите ответ.");return}
 if(step===questions.length-1){
   if(answers.current_rating) answers.current_rating=Number(String(answers.current_rating).charAt(0));
   try{await fetch("/api/responses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(answers)})}catch(e){console.error(e)}
 }
 step++;render();
}
render();