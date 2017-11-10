export default {
    handleEvent:function(e){
       var type=e.type;
       this[type]&&this[type](e);		  
    },
    change:function(e){
       this._change(e.target,false);
    },
    submit:function(e){
       for(var form=e.target,els=form.elements,i=0,ii=els.length;i<ii;i++)
       {
          if(!this._change(els[i],true)){
             e.preventDefault();
             e.stopImmediatePropagation();
             return false;
          }
       }
    },
    _change:function(el,hasFocus){
       this._isH5||this.setValidity(el);
       this.checkValidity(el,hasFocus);
       return el.validity.valid;
    },
    DOMNodeInserted:function(e){
       var t=e.target,fms,i;
       if(t.nodeType===1)
       {
         if(t.tagName==="FORM")
         {
             this.bind(t);
         }
         else
         {
             fms=app.$$("form",t);
             i=fms.length;
             while(i--&&this.bind(fms[i]));
         }
       }
    },
    setValidity:function(el){
        var validity=el.validity||(el.validity={}),
            type=el.type,
            value=el.value,
            r=el.hasAttribute("required");
 
            if(r)
            {
               switch(type){
                   case "checkbox":
                      validity.valueMissing=!el.checked;
                   break;
                   case "radio":
                      validity.valueMissing=el.checked?false:!el.form.querySelector("input[name='"+el.name+"']:checked");
                   break;
                   default:
                      validity.valueMissing=!value;
                   break;
               }
            }

            if(type!=="checkbox"&&type!=="radio"&&type!=="select-one"&&type!=="select-multipl"&&value)
            {
                r=el.getAttribute("pattern");
                validity.patternMismatch=r?!new RegExp("^"+r+"$").test(value):false;

               //如果要兼容IE9，还是老老实实用pattern验证吧，常用的那几个h5表单ie9这货会从根源上转成type="text"，毫无办法！
                switch(type){
                   case "number":
                      validity.typeMismatch=isNaN(value);
                   break;
                   case "tel":
                      validity.typeMismatch=isNaN(value)||!/^\d+$/.test(value);
                   break;
                   case "email":
                       validity.typeMismatch=!/^\w+(?:\.\w+)*@\w+(?:\.\w+)+$/.test(value);
                   break;
                   default:
                     validity.typeMismatch=false;
                }
            }
            else
            {
               validity.patternMismatch=validity.typeMismatch=validity.customError=false;
            }

         validity.valid=!validity.valueMissing&&!validity.patternMismatch&&!validity.typeMismatch&&!validity.customError;
    },
    checkValidity:function(el,hasFocus){
        var span=this.getSpan(el),
            validity=el.validity;
            if(validity.valid)
            {
               span.style.display="none";
            }
            else
            {
               this.setMsg(el,validity,span);
               this.focus&&hasFocus&&el.focus();
            }          
    },
    defaultMessage:{
       "required":"请填写该项",	
       "select-required":"请选择该项",
       "pattern":"信息填写错误",
       "type":"信息填写有误"
    },
    setMsg:function(el,validity,span){
       var msg;
       if(validity.valueMissing)
       {
          msg=el.getAttribute("data-required")||this.defaultMessage[el.tagName==="SELECT"?"select-required":"required"];
       }
       else if(validity.patternMismatch)
       {
          msg=el.getAttribute("data-pattern")||this.defaultMessage.pattern;
       }
       else if(validity.typeMismatch)
       {
          msg=el.getAttribute("data-type")||this.defaultMessage.type;
       }
       else
       {
          msg=el.validationMessage||"";
       }

       if(typeof span==="function")
       {
           span(msg,el);
       }
       else
       {
          span.innerHTML=msg;
          span.style.display="";
       }
    },
    getSpan:function(el){
        var span=el._valid_msg;
        if(!span){
          span=document.createElement("span");
          span.className="valid-msg";
          el._valid_msg=span;
          el.parentNode.appendChild(span);
        }
        return span;
    },
    bind:function(fm){
       fm.noValidate=true;
       fm.addEventListener("change",this,false);
       fm.addEventListener("submit",this,false);
       return true;
    },
    prevent:function(e){
      e.preventDefault();
    },
    install:function(Vue,opts){
       var that,opt;
       if(!this._isReady){
           that=this;
           this._isReady=true;
           
           opts=opts||{};
           for(opt in opts){
               this[opt]=opts[opt];
           }
           this.focus=opts.focus===true;
 
           if(typeof this.callback==="function"){
                this.checkValidity=function(el,hasFocus){
                    var cb=this.callback,
                        validity=el.validity;
                        if(validity.valid)
                        {
                           cb(null,el);
                        }
                        else
                        {
                           this.setMsg(el,validity,cb);
                           this.focus&&hasFocus&&el.focus();
                        }          
                };
           }
           
           this._isH5="noValidate" in document.createElement("form");           
           if(!this._isH5){			   
             HTMLInputElement.prototype.setCustomValidity=function(msg){
               var validity=this.validity;
                   if(!validity){
                     that.setValidity(this);
                     validity=this.validity;
                   }
                   this.validationMessage=msg;
                   validity.customError=!!msg;
                   validity.valid=!validity.valueMissing&&!validity.patternMismatch&&!validity.typeMismatch&&!validity.customError;
             };
           }

           //改变后立即显示错误
           HTMLInputElement.prototype.setMessage=function(msg,hasFocus){
                 this.setCustomValidity(msg);
                 that.checkValidity(this,hasFocus);
           };           

           Vue.directive("valid",function(el,binding,vnode){            
                var submit=binding.value;
                 that.bind(el);
                if(submit)
                {
                    el.addEventListener("submit",submit,false);
                    binding.modifiers.prevent&&el.addEventListener("submit",that.prevent,false);
                }            
            });
       }
    }
};