const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function licenseDisplay(license,at=Date.now()){
 if(state.licensingPaused||license?.paused)return 'Acesso liberado · exigência de licença suspensa nesta versão.';
 if(!license)return 'Ativação pendente. Ative sua licença para consultar a validade.';
 if(license.expires===null)return 'Licença de '+license.student+' · Vitalícia — sem vencimento.';
 const expiry=Number(license.expires)*1000;
 if(!Number.isFinite(expiry))return 'Não foi possível consultar a validade. Atualize a conexão.';
 const date=new Date(expiry).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
 const seconds=Math.max(0,Math.ceil((expiry-at)/1000));
 if(!seconds)return (license.temporary?'Teste encerrado em ':'Licença vencida em ')+date+'. Renove sua licença para continuar.';
 const days=Math.floor(seconds/86400),hours=Math.floor(seconds%86400/3600),minutes=Math.floor(seconds%3600/60);
 const left=days?days+' dia(s), '+hours+' hora(s) e '+minutes+' minuto(s)':hours?hours+' hora(s) e '+minutes+' minuto(s)':minutes?minutes+' minuto(s)':seconds+' segundo(s)';
 return (license.temporary?'Modo de teste temporário':'Licença de '+license.student)+' · Válida até: '+date+' · Restam: '+left+'.';
}
function renderLicense(){
 $('#license-account').value=state.account?.id||'Conecte seu Instagram primeiro';
 $('#license-form').closest('article').hidden=!!state.licensingPaused;const text=licenseDisplay(state.license);$('#license-status').textContent=text;
 if($('#license-overview'))$('#license-overview').textContent=text;
 if(state.account&&!state.license&&!state.licensingPaused)$('#account-badge').textContent='@'+state.account.username+' · licença pendente';
}

let state={},rules=[],cursor='',editing=false;
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').hidden=true,6500);}
async function api(path,options={}){const r=await fetch('/api/'+path,{...options,headers:{'Content-Type':'application/json',...options.headers}});const data=await r.json();if(!r.ok){if(r.status===401){$('#login').hidden=false;$('#shell').hidden=true;}throw Error(data.error||'Não foi possível concluir.');}return data;}
const post=(path,data={})=>api(path,{method:'POST',body:JSON.stringify(data)});
const el=(tag,text,className)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(className)e.className=className;return e;};
function button(text,action,style='outline'){const b=el('button',text,style);b.type='button';b.addEventListener('click',()=>run(action,b));return b;}
async function run(action,b){if(b)b.disabled=true;try{await action();}catch(e){toast(e.message);}finally{if(b)b.disabled=false;}}
async function refresh(){state=await api('status');rules=await api('rules');$('#account-badge').textContent=state.account?'@'+state.account.username:'Instagram não conectado';$('#stat-active').textContent=rules.filter(r=>r.active).length;const count=s=>state.counts.find(c=>c.status===s)?.total||0;$('#stat-sent').textContent=count('sent');$('#stat-pending').textContent=count('pending')+count('sending');$('#stat-errors').textContent=count('failed')+count('uncertain');renderRules();renderSetup();renderLicense();renderAccountMenu();}
function route(){const p=location.hash.slice(1)||'dashboard';const page=['dashboard','automations','activity','setup','editor','flows','map-editor','contacts'].includes(p)?p:'dashboard';$$('[data-page]').forEach(e=>e.hidden=e.dataset.page!==page);$$('[data-nav]').forEach(e=>e.classList.toggle('active',e.dataset.nav===(page==='editor'?'automations':page==='map-editor'?'flows':page)));if(page==='activity')run(activity);if(page==='contacts')run(loadContacts);if(page==='flows')renderFlows();if(page==='editor'&&!editing)newRule();if(page==='map-editor'&&!mapState)editMap();window.scrollTo(0,0);}
function renderSetup(){const f=$('#settings-form');for(const key of ['appId','owner','contact'])f.elements[key].value=state[key]||'';f.elements.appSecret.value='';$('#settings-note').textContent=state.account?'Para alterar o aplicativo, desconecte a conta primeiro.':state.configured?'Configuração salva. Preencha novamente a chave somente se precisar substituir as credenciais.':'';const host=$('#callback-fields');host.replaceChildren();for(const [name,value]of [['URL de retorno do login',state.callback],['URL do webhook',state.webhook],['Token de verificação',state.verifyToken||'Salve a configuração primeiro'],['Política e instruções de exclusão',state.privacy]]){const label=el('label',name),row=el('div',null,'copy-row'),input=el('input');input.value=value;input.readOnly=true;row.append(input,button('Copiar',async()=>{await navigator.clipboard.writeText(value);toast('Copiado!');}));label.append(row);host.append(label);}$('#connection-detail').textContent=state.account?'@'+state.account.username+' · Acesso válido até '+new Date(state.account.expires*1000).toLocaleDateString('pt-BR')+(state.lastWebhook?' · Último evento: '+new Date(state.lastWebhook*1000).toLocaleString('pt-BR'):' · Ainda sem evento real recebido.'):'Nenhuma conta conectada.';$('#disconnect').hidden=!state.account;$('#diagnose').disabled=!state.account;}
async function activity(){const data=await api('activity'),host=$('#activity-list');host.replaceChildren();const statuses={pending:'Na fila',sending:'Enviando',sent:'Aceito pela Meta',failed:'Falhou',uncertain:'Envio incerto',expired:'Prazo encerrado',cancelled:'Cancelado'};if(!data.jobs.length&&!data.events.length){host.append(el('div','Ainda sem atividade. Ative uma automação e faça um teste.','empty'));return;}for(const j of data.jobs){const row=el('div',null,'activity-row');row.append(el('span',new Date(j.created*1000).toLocaleString('pt-BR')),el('strong',statuses[j.status]||j.status,'status-'+j.status),el('p',(j.kind==='public'?'Comentário':'Direct')+' · '+(j.detail||'Aguardando envio.')));host.append(row);}for(const e of data.events){const row=el('div',null,'activity-row');row.append(el('span',new Date(e.created*1000).toLocaleString('pt-BR')),el('strong','Conexão'),el('p',e.detail));host.append(row);}}
$('#login-form').addEventListener('submit',e=>{e.preventDefault();run(async()=>{await post('login',{password:$('#password').value});$('#password').value='';await boot();},e.submitter);});
$('#logout').onclick=()=>run(async()=>{await post('logout');$('#shell').hidden=true;$('#login').hidden=false;});
$$('.new-rule').forEach(b=>b.onclick=()=>newRule());
const templates={material:{name:'Entregar meu material',keywords:'quero, material',message:'Oi! Aqui está o material que você pediu 😊'},convite:{name:'Convite para minha aula',keywords:'aula, participar',message:'Que bom ter você comigo! Inscreva-se na aula pelo link abaixo ✨'},oferta:{name:'Compartilhar minha oferta',keywords:'quero, detalhes',message:'Oi! Você encontra os detalhes e como participar neste link 😊'}};
$$('[data-template]').forEach(b=>b.onclick=()=>newRule({...templates[b.dataset.template],trigger:'comment',public_reply:'Confira seu Direct 😊'}));

$('#settings-form').addEventListener('submit',e=>{e.preventDefault();run(async()=>{await post('settings',Object.fromEntries(new FormData(e.currentTarget)));await refresh();toast('Configuração salva. Copie os endereços para a Meta.');},e.submitter);});
$('#diagnose').onclick=()=>run(async()=>{const d=await post('diagnose');toast(d.message);},$('#diagnose'));
$('#disconnect').onclick=()=>run(async()=>{if(!confirm('Apagar o token e todo o histórico desta instalação? Suas automações serão pausadas.'))return;await post('disconnect');await refresh();toast('Conta desconectada e histórico apagado.');});
$('#refresh-activity').onclick=()=>run(activity,$('#refresh-activity'));window.addEventListener('hashchange',route);
$('#license-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;run(async()=>{await post('license',{code:form.elements.code.value});form.reset();await refresh();toast('Licença ativada para seu Instagram.');},e.submitter);});
async function boot(){try{await refresh();$('#shell').hidden=false;$('#login').hidden=true;route();const result=new URLSearchParams(location.search).get('connection');if(result){toast(result==='ok'?'Instagram conectado. Faça um teste real.':result==='cancelled'?'Conexão cancelada.':'Não foi possível conectar. Confira Atividade.');history.replaceState(null,'',location.pathname+location.hash);}}catch(e){$('#login').hidden=false;$('#shell').hidden=true;if(!e.message.includes('Entre no painel'))toast(e.message);}}

$('#refresh-connection').onclick=()=>run(async()=>{await refresh();toast(state.account?'Instagram conectado. Você já pode testar suas automações.':'Ainda sem conexão. Conclua a autorização na outra aba e tente atualizar novamente.');},$('#refresh-connection'));

setInterval(()=>{if(!document.hidden)renderLicense();},1000);
