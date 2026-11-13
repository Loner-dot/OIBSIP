(() => {
  "use strict";
  const expressionView=document.getElementById("expression");
  const resultView=document.getElementById("result");
  const resultCaption=document.getElementById("result-caption");
  const keypad=document.getElementById("keypad");
  let expression="";
  let justSolved=false;
  let hasError=false;

  const pretty=value=>value.replace(/\*/g," × ").replace(/\//g," ÷ ").replace(/-/g," − ").replace(/\+/g," + ");
  function render(){expressionView.textContent=expression?pretty(expression):"0";expressionView.scrollLeft=expressionView.scrollWidth;}
  function format(value){if(!Number.isFinite(value))throw new Error("Invalid result");const rounded=Number.parseFloat(value.toPrecision(11));return Object.is(rounded,-0)?"0":String(rounded);}
  function tokenize(input){
    const tokens=[];let i=0;
    while(i<input.length){
      const char=input[i];
      if(/\s/.test(char)){i++;continue;}
      if(/[0-9.]/.test(char)){
        let number="";let dots=0;
        while(i<input.length&&/[0-9.]/.test(input[i])){if(input[i]===".")dots++;number+=input[i++];}
        if(dots>1||number===".")throw new Error("Invalid number");
        tokens.push(Number(number));continue;
      }
      if("+-*/()".includes(char)){tokens.push(char);i++;continue;}
      throw new Error("Invalid character");
    }
    return tokens;
  }
  function calculate(input){
    const tokens=tokenize(input);let position=0;
    function primary(){
      const token=tokens[position++];
      if(token==="+")return primary();
      if(token==="-")return-primary();
      if(token==="("){const value=addSub();if(tokens[position++]!==")")throw new Error("Missing bracket");return value;}
      if(typeof token==="number")return token;
      throw new Error("Incomplete expression");
    }
    function multiplyDivide(){
      let value=primary();
      while(tokens[position]==="*"||tokens[position]==="/"){
        const operator=tokens[position++];const next=primary();
        if(operator==="/"&&next===0)throw new Error("Cannot divide by zero");
        value=operator==="*"?value*next:value/next;
      }
      return value;
    }
    function addSub(){
      let value=multiplyDivide();
      while(tokens[position]==="+"||tokens[position]==="-"){
        const operator=tokens[position++];const next=multiplyDivide();
        value=operator==="+"?value+next:value-next;
      }
      return value;
    }
    if(!tokens.length)throw new Error("Empty expression");
    const result=addSub();
    if(position!==tokens.length)throw new Error("Unexpected input");
    if(!Number.isFinite(result))throw new Error("Invalid result");
    return result;
  }
  function clear(){expression="";justSolved=false;hasError=false;render();showPreview();}
  function backspace(){if(hasError)return clear();expression=expression.slice(0,-1);justSolved=false;render();showPreview();}
  function showPreview(){
    if(!expression){resultView.textContent="0";resultCaption.textContent="RESULT";return;}
    try{resultView.textContent=format(calculate(expression));resultCaption.textContent="LIVE RESULT";}
    catch{resultView.textContent="…";resultCaption.textContent="RESULT";}
  }
  function append(value){
    if(hasError)clear();
    if(justSolved&&/[0-9.(]/.test(value))expression="";
    if(justSolved&&/[+\-*/]/.test(value))justSolved=false;
    if(value==="."){
      const currentNumber=expression.split(/[+\-*/()]/).pop();
      if(currentNumber.includes("."))return;
      if(!currentNumber)expression+="0";
    }
    if("+-*/".includes(value)){
      const last=expression.slice(-1);
      if(!expression&&value!=="-")return;
      if("+-*/".includes(last)){
        if(value==="-"&&last!=="-")expression+=value;
        else expression=expression.slice(0,-1)+value;
      }else if(last!=="(")expression+=value;
      else if(value==="-")expression+=value;
      else return;
    }else expression+=value;
    justSolved=false;render();showPreview();
  }
  function solve(){
    if(!expression)return;
    try{
      const answer=format(calculate(expression));
      resultView.textContent=answer;resultCaption.textContent="ANSWER";
      expression=answer;justSolved=true;hasError=false;render();
    }catch(error){
      resultView.textContent=error.message==="Cannot divide by zero"?"Cannot divide by 0":"Check expression";
      resultCaption.textContent="NOT A VALID CALCULATION";hasError=true;
    }
  }
  keypad.addEventListener("click",event=>{
    const button=event.target.closest("button");if(!button)return;
    const {action,value}=button.dataset;
    if(action==="clear")clear();
    else if(action==="backspace")backspace();
    else if(action==="equals")solve();
    else if(value!==undefined)append(value);
  });
  document.addEventListener("keydown",event=>{
    if(/^[0-9.]$/.test(event.key))append(event.key);
    else if(["+","-","*","/","(",")"].includes(event.key))append(event.key);
    else if(event.key==="Enter"||event.key==="="){event.preventDefault();solve();}
    else if(event.key==="Backspace")backspace();
    else if(event.key==="Escape"||event.key==="Delete")clear();
  });
  clear();
})();