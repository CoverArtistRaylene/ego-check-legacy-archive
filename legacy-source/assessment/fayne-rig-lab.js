const stage=document.querySelector('.stage'),line=document.querySelector('#line');
const copy={idle:'She waits quietly, hands resting at her sides.',notice:'Her attention lifts toward your signal.',talk:'“Oh… you came back. I left some space beside me, just in case.”',shy:'She catches her sleeve between her fingers and looks away.',content:'Her shoulders soften. The quiet no longer feels uncertain.'};
function setState(state){stage.dataset.state=state;line.textContent=copy[state]}
document.querySelectorAll('[data-state]').forEach(button=>button.addEventListener('click',()=>setState(button.dataset.state)));
document.querySelector('#play').addEventListener('click',async()=>{for(const [state,delay] of [['idle',900],['notice',1100],['talk',3200],['shy',1800],['content',2400]]){setState(state);await new Promise(resolve=>setTimeout(resolve,delay))}});
