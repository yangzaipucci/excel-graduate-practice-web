(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuizCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const PREFIX='excel-practice:v1:';
  function same(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&[...a].sort().join('|')===[...b].sort().join('|');}
  function grade(questions,answers){
    const details=questions.map(q=>{const selected=Array.isArray(answers[q.id])?answers[q.id]:[];return {id:q.id,selected,correct:same(selected,q.answer),blank:selected.length===0};});
    const correct=details.filter(x=>x.correct).length,blank=details.filter(x=>x.blank).length;
    return {total:details.length,correct,blank,incorrect:details.length-correct-blank,score:details.length?Math.round(correct/details.length*10000)/100:0,details,wrongIds:details.filter(x=>!x.correct).map(x=>x.id)};
  }
  function updateWrongs(existing,questions,answers,now){
    const result=JSON.parse(JSON.stringify(existing||{}));
    for(const d of grade(questions,answers).details){
      const old=result[d.id];
      if(d.correct){if(old)result[d.id]={...old,masteredAt:now,lastReviewed:now,reviews:(old.reviews||0)+1};}
      else result[d.id]={id:d.id,wrongCount:(old?.wrongCount||0)+1,firstWrong:old?.firstWrong||now,lastWrong:now,lastReviewed:now,reviews:(old?.reviews||0)+1,masteredAt:null,lastSelection:d.selected};
    }
    return result;
  }
  function validAnswers(questions,answers){const out={};for(const q of questions){const allowed=new Set(q.options.map(o=>o.label));let selected=Array.isArray(answers?.[q.id])?[...new Set(answers[q.id])].filter(x=>allowed.has(x)):[];if(q.type!=='多选题')selected=selected.slice(0,1);if(selected.length)out[q.id]=selected;}return out;}
  return {PREFIX,same,grade,updateWrongs,validAnswers};
});
