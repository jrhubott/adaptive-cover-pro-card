/*! adaptive-cover-pro-card v1.0.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,g=globalThis,f=g.trustedTypes,v=f?f.emptyScript:"",m=g.reactiveElementPolyfillSupport,_=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,m?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,k=w.trustedTypes,E=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,P=`<${M}>`,z=document,O=()=>z.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,R="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,D=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,F=/"/g,L=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),V=B(1),W=B(2),q=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),J=new WeakMap,K=z.createTreeWalker(z,129);function G(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=I;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===I?"!--"===c[1]?n=U:void 0!==c[1]?n=H:void 0!==c[2]?(L.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=D):void 0!==c[3]&&(n=D):n===D?">"===c[0]?(n=r??I,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?D:'"'===c[3]?F:j):n===F||n===j?n=D:n===U||n===H?n=I:(n=D,r=void 0);const p=n===D&&t[e+1].startsWith("/>")?" ":"";o+=n===I?i+P:l>=0?(s.push(a),i.slice(0,l)+S+i.slice(l)+C+p):i+C+(-2===l?e:p)}return[G(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[c,l]=X(t,e);if(this.el=Q.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[o++],i=s.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?st:"?"===n[1]?rt:"@"===n[1]?ot:it}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],O()),K.nextNode(),a.push({type:2,index:++r});s.append(t[e],O())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===q)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=T(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Y(t,r._$AS(t,e.values),r,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);K.currentNode=s;let r=K.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new et(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new nt(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=K.nextNode(),o++)}return K.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),T(t)?t===Z||null==t||""===t?(this._$AH!==Z&&this._$AR(),this._$AH=Z):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Z&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new Q(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new et(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Z}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=Y(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Y(this,s[i+n],e,n),a===q&&(a=this._$AH[n]),o||=!T(a)||a!==this._$AH[n],a===Z?t=Z:t!==Z&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Z?void 0:t}}class rt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Z)}}class ot extends it{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??Z)===q)return;const i=this._$AH,s=t===Z&&i!==Z||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==Z&&(i===Z||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Q,et),(w.litHtmlVersions??=[]).push("3.3.2");const ct=globalThis;class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new et(e.insertBefore(O(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const pt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ut=(t=ht,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function gt(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ft(t){return gt({...t,state:!0,attribute:!1})}const vt="1.0.0",mt="adaptive-cover-pro-card",_t="adaptive-cover-pro-card-editor",yt="adaptive_cover_pro",$t=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default"],bt={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},xt={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},wt={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"};function At(t,e){const i=(t-90)*Math.PI/180;return{x:e*Math.cos(i),y:e*Math.sin(i)}}function kt(t,e,i,s=0){const r=t=>(t%360+360)%360,o=r(t),n=r(e);let a=n-o;a<0&&(a+=360);const c=a>180?1:0,l=At(o,i),d=At(n,i);if(s<=0)return`M 0 0 L ${l.x} ${l.y} A ${i} ${i} 0 ${c} 1 ${d.x} ${d.y} Z`;const p=At(n,s),h=At(o,s);return[`M ${l.x} ${l.y}`,`A ${i} ${i} 0 ${c} 1 ${d.x} ${d.y}`,`L ${p.x} ${p.y}`,`A ${s} ${s} 0 ${c} 0 ${h.x} ${h.y}`,"Z"].join(" ")}function Et(t){return(t%360+360)%360}function St(t){return null==t||Number.isNaN(t)?"—":`${Math.round(t)}%`}function Ct(t){return null==t||Number.isNaN(t)?"—":`${t.toFixed(1)}°`}function Mt(t){if(!t)return"—";const e=new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Pt(t){if(!t)return"—";const e=new Date(t).getTime();if(Number.isNaN(e))return"—";const i=Math.round((e-Date.now())/1e3);return i<=0?"expired":function(t){if(null==t||Number.isNaN(t))return"—";const e=Math.max(0,Math.round(t));if(e<60)return`${e}s`;const i=Math.floor(e/60);return i<60?`${i}m ${e%60}s`:`${Math.floor(i/60)}h ${i%60}m`}(i)}const zt=110;let Ot=class extends lt{constructor(){super(...arguments),this.compact=!1}_sun(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=parseFloat(e.state);return Number.isNaN(i)?null:{...e.attributes,window_azimuth:e.attributes.window_azimuth}}_sunInfront(){const t=this.discovered.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}render(){if(!this.hass||!this.discovered)return Z;const t=this._sun();if(!t)return V`<div class="placeholder">Sun sensor not yet populated.</div>`;const e=Et(t.window_azimuth),i=Et(e-t.fov_left),s=Et(e+t.fov_right),r=this.discovered.entities.sun_sensor,o=parseFloat(this.hass.states[r]?.state??"0"),n=t.elevation,a=At(o,function(t){return 1-Math.max(0,Math.min(90,t))/90}(n)),c=At(e,zt),l=t.blind_spot_range?kt(Et(t.blind_spot_range[0]),Et(t.blind_spot_range[1]),zt):null,d=t.in_fov,p=this._sunInfront()?"sun valid":d?"sun in-fov":"sun";return V`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${W`
            <!-- concentric elevation rings at 30°, 60° -->
            <circle class="grid" r=${zt} />
            <circle class="grid" r=${220/3} />
            <circle class="grid" r=${zt/3} />
            <!-- cardinal direction lines -->
            <line class="grid thin" x1="0" y1=${-110} x2="0" y2=${zt} />
            <line class="grid thin" x1=${-110} y1="0" x2=${zt} y2="0" />

            <!-- FOV wedge -->
            <path class="fov" d=${kt(i,s,zt)} />

            <!-- blind spot (hatched) -->
            ${l?W`<path class="blind-spot" d=${l} />`:Z}

            <!-- window normal arrow -->
            <line
              class="window"
              x1="0" y1="0"
              x2=${c.x} y2=${c.y}
            />
            <circle class="window-base" cx="0" cy="0" r="4" />

            <!-- cardinal labels -->
            <text class="cardinal" x="0" y=${-116} text-anchor="middle">N</text>
            <text class="cardinal" x=${120} y="4" text-anchor="middle">E</text>
            <text class="cardinal" x="0" y=${124} text-anchor="middle">S</text>
            <text class="cardinal" x=${-120} y="4" text-anchor="middle">W</text>

            <!-- sun dot -->
            <circle
              class=${p}
              cx=${a.x*zt}
              cy=${a.y*zt}
              r="7"
            />
          `}
        </svg>
        <div class="legend">
          <div><span class="dot sun valid"></span> Sun (in FOV)</div>
          <div><span class="dot sun"></span> Sun (outside)</div>
          <div><span class="swatch fov"></span> Window FOV</div>
        </div>
        <div class="stats dim">
          <span>Azi: ${Ct(o)}</span>
          <span>Elev: ${Ct(n)}</span>
          <span>γ: ${Ct(t.gamma)}</span>
          <span>Window: ${Ct(e)}</span>
        </div>
      </div>
    `}};function Tt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}Ot.styles=n`
    :host {
      display: block;
    }
    .compass {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    svg {
      width: 100%;
      max-width: 260px;
      height: auto;
      display: block;
    }
    :host([compact]) svg {
      max-width: 180px;
    }
    :host([compact]) .legend {
      display: none;
    }
    :host([compact]) .stats {
      font-size: 0.7rem;
      gap: 8px;
    }
    .grid {
      fill: none;
      stroke: var(--divider-color);
      stroke-width: 1;
    }
    .grid.thin {
      stroke-width: 0.5;
      opacity: 0.5;
    }
    .fov {
      fill: var(--warning-color, gold);
      fill-opacity: 0.22;
      stroke: var(--warning-color, gold);
      stroke-width: 1;
      stroke-opacity: 0.7;
      transition: all 0.3s ease;
    }
    .blind-spot {
      fill: var(--error-color, crimson);
      fill-opacity: 0.12;
      stroke: var(--error-color, crimson);
      stroke-dasharray: 3 3;
    }
    .window {
      stroke: var(--primary-color);
      stroke-width: 3;
      stroke-linecap: round;
    }
    .window-base {
      fill: var(--primary-color);
    }
    .cardinal {
      font-size: 12px;
      fill: var(--secondary-text-color);
      font-weight: 500;
    }
    .sun {
      fill: var(--secondary-text-color);
      transition:
        cx 0.3s ease,
        cy 0.3s ease,
        fill 0.3s ease;
    }
    .sun.in-fov {
      fill: orange;
    }
    .sun.valid {
      fill: gold;
      filter: drop-shadow(0 0 4px gold);
    }
    .legend {
      display: flex;
      gap: 12px;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      flex-wrap: wrap;
      justify-content: center;
    }
    .dot,
    .swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 4px;
    }
    .swatch.fov {
      background: gold;
      opacity: 0.4;
      border-radius: 2px;
    }
    .dot.sun {
      background: var(--secondary-text-color);
    }
    .dot.sun.valid {
      background: gold;
    }
    .stats {
      display: flex;
      gap: 12px;
      font-size: 0.78rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 20px;
    }
  `,t([gt({attribute:!1})],Ot.prototype,"hass",void 0),t([gt({attribute:!1})],Ot.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ot.prototype,"compact",void 0),Ot=t([pt("acp-sky-compass")],Ot);var Nt,Rt={exports:{}};Nt=Rt,function(){var t=Math.PI,e=Math.sin,i=Math.cos,s=Math.tan,r=Math.asin,o=Math.atan2,n=Math.acos,a=t/180,c=864e5,l=2440588,d=2451545;function p(t){return new Date((t+.5-l)*c)}function h(t){return function(t){return t.valueOf()/c-.5+l}(t)-d}var u=23.4397*a;function g(t,r){return o(e(t)*i(u)-s(r)*e(u),i(t))}function f(t,s){return r(e(s)*i(u)+i(s)*e(u)*e(t))}function v(t,r,n){return o(e(t),i(t)*e(r)-s(n)*i(r))}function m(t,s,o){return r(e(s)*e(o)+i(s)*i(o)*i(t))}function _(t,e){return a*(280.16+360.9856235*t)-e}function y(t){return a*(357.5291+.98560028*t)}function $(i){return i+a*(1.9148*e(i)+.02*e(2*i)+3e-4*e(3*i))+102.9372*a+t}function b(t){var e=$(y(t));return{dec:f(e,0),ra:g(e,0)}}var x={getPosition:function(t,e,i){var s=a*-i,r=a*e,o=h(t),n=b(o),c=_(o,s)-n.ra;return{azimuth:v(c,r,n.dec),altitude:m(c,r,n.dec)}}},w=x.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];x.addTime=function(t,e,i){w.push([t,e,i])};var A=9e-4;function k(e,i,s){return A+(e+i)/(2*t)+s}function E(t,i,s){return d+t+.0053*e(i)-.0069*e(2*s)}function S(t,s,r,o,a,c,l){var d=function(t,s,r){return n((e(t)-e(s)*e(r))/(i(s)*i(r)))}(t,r,o);return E(k(d,s,a),c,l)}function C(t){var s=a*(134.963+13.064993*t),r=a*(93.272+13.22935*t),o=a*(218.316+13.176396*t)+6.289*a*e(s),n=5.128*a*e(r),c=385001-20905*i(s);return{ra:g(o,n),dec:f(o,n),dist:c}}function M(t,e){return new Date(t.valueOf()+e*c/24)}x.getTimes=function(e,i,s,r){var o,n,c,l,d,u=a*-s,g=a*i,v=function(t){return-2.076*Math.sqrt(t)/60}(r=r||0),m=function(e,i){return Math.round(e-A-i/(2*t))}(h(e),u),_=k(0,u,m),b=y(_),x=$(b),C=f(x,0),M=E(_,b,x),P={solarNoon:p(M),nadir:p(M-.5)};for(o=0,n=w.length;o<n;o+=1)d=M-((l=S(((c=w[o])[0]+v)*a,u,g,C,m,b,x))-M),P[c[1]]=p(d),P[c[2]]=p(l);return P},x.getMoonPosition=function(t,r,n){var c=a*-n,l=a*r,d=h(t),p=C(d),u=_(d,c)-p.ra,g=m(u,l,p.dec),f=o(e(u),s(l)*i(p.dec)-e(p.dec)*i(u));return g+=function(t){return t<0&&(t=0),2967e-7/Math.tan(t+.00312536/(t+.08901179))}(g),{azimuth:v(u,l,p.dec),altitude:g,distance:p.dist,parallacticAngle:f}},x.getMoonIllumination=function(t){var s=h(t||new Date),r=b(s),a=C(s),c=149598e3,l=n(e(r.dec)*e(a.dec)+i(r.dec)*i(a.dec)*i(r.ra-a.ra)),d=o(c*e(l),a.dist-c*i(l)),p=o(i(r.dec)*e(r.ra-a.ra),e(r.dec)*i(a.dec)-i(r.dec)*e(a.dec)*i(r.ra-a.ra));return{fraction:(1+i(d))/2,phase:.5+.5*d*(p<0?-1:1)/Math.PI,angle:p}},x.getMoonTimes=function(t,e,i,s){var r=new Date(t);s?r.setUTCHours(0,0,0,0):r.setHours(0,0,0,0);for(var o,n,c,l,d,p,h,u,g,f,v,m,_,y=.133*a,$=x.getMoonPosition(r,e,i).altitude-y,b=1;b<=24&&(o=x.getMoonPosition(M(r,b),e,i).altitude-y,u=((d=($+(n=x.getMoonPosition(M(r,b+1),e,i).altitude-y))/2-o)*(h=-(p=(n-$)/2)/(2*d))+p)*h+o,f=0,(g=p*p-4*d*o)>=0&&(v=h-(_=Math.sqrt(g)/(2*Math.abs(d))),m=h+_,Math.abs(v)<=1&&f++,Math.abs(m)<=1&&f++,v<-1&&(v=m)),1===f?$<0?c=b+v:l=b+v:2===f&&(c=b+(u<0?m:v),l=b+(u<0?v:m)),!c||!l);b+=2)$=n;var w={};return c&&(w.rise=M(r,c)),l&&(w.set=M(r,l)),c||l||(w[u>0?"alwaysUp":"alwaysDown"]=!0),w},Nt.exports=x}();var It=Tt(Rt.exports);function Ut(t,e,i,s){const r=((e-i)%360+360)%360;return((t-r)%360+360)%360<=((((e+s)%360+360)%360-r)%360+360)%360}let Ht=class extends lt{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];return e?e.attributes:null}render(){if(!this.hass||!this.discovered)return Z;const t=this._sunAttrs(),{latitude:e,longitude:i}=this.hass.config;if(void 0===e||void 0===i||!t)return V`<div class="placeholder">Sun elevation chart unavailable.</div>`;const s=function(t=new Date){const e=new Date(t);return e.setHours(0,0,0,0),e}(),r=function(t,e,i,s=10){const r=[],o=i.getTime()+864e5;for(let n=i.getTime();n<=o;n+=60*s*1e3){const i=new Date(n),s=It.getPosition(i,t,e);r.push({t:i,elevation:180*s.altitude/Math.PI,azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360})}return r}(e,i,s),o=new Date,n=function(t,e,i,s){let r=-1,o=-1,n=-1;for(let a=0;a<t.length;a++){const c=t[a];c.elevation>0&&Ut(c.azimuth,e,i,s)?(-1===n&&(n=a),a-n>o-r&&(r=n,o=a)):n=-1}return-1===r?null:{startIdx:r,endIdx:o}}(r,t.window_azimuth,t.fov_left,t.fov_right),a=t=>32+(t.getTime()-s.getTime())/864e5*360,c=t=>138-(t- -10)/100*128,l=r.map(t=>`${a(t.t).toFixed(1)},${c(t.elevation).toFixed(1)}`).join(" "),d=c(0),p=a(o),h=this._interpAt(r,o),u=h?c(h.elevation):null,g=n?r[n.startIdx].t:null,f=n?r[n.endIdx].t:null,v=g?a(g):null,m=f?a(f):null;return V`
      <div class="wrap">
        <div class="head">
          <span class="label">Sun today</span>
          ${g&&f?V`<span class="dim"
                >FOV: ${Mt(g.toISOString())} →
                ${Mt(f.toISOString())}</span
              >`:V`<span class="dim">Sun does not enter FOV today</span>`}
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${W`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(t=>W`
              <line class="grid" x1=${32} y1=${c(t)} x2=${392} y2=${c(t)} />
              <text class="tick" x=${28} y=${c(t)+3} text-anchor="end">${t}°</text>
            `)}

            <!-- x-axis gridlines at every 6h -->
            ${[0,6,12,18,24].map(t=>{const e=new Date(s.getTime()+36e5*t);return W`
                <line class="grid faint" x1=${a(e)} y1=${10} x2=${a(e)} y2=${138} />
                <text class="tick" x=${a(e)} y=${152} text-anchor="middle">${t.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${d} x2=${392} y2=${d} />

            <!-- FOV shaded band (only the time the sun is actually in FOV + above horizon) -->
            ${null!==v&&null!==m?W`<rect
                  class="fov-band"
                  x=${v}
                  y=${10}
                  width=${m-v}
                  height=${128}
                />`:Z}

            <!-- elevation curve -->
            <polyline class="curve" points=${l} />

            <!-- current-time cursor -->
            <line class="now" x1=${p} y1=${10} x2=${p} y2=${138} />

            <!-- current sun dot -->
            ${null!==u?W`<circle class="sun-dot" cx=${p} cy=${u} r="4" />`:Z}
          `}
        </svg>
      </div>
    `}_interpAt(t,e){if(0===t.length)return null;const i=e.getTime();if(i<=t[0].t.getTime())return t[0];if(i>=t[t.length-1].t.getTime())return t[t.length-1];for(let s=1;s<t.length;s++)if(t[s].t.getTime()>=i){const r=t[s-1],o=t[s],n=(i-r.t.getTime())/(o.t.getTime()-r.t.getTime());return{t:e,elevation:r.elevation+(o.elevation-r.elevation)*n,azimuth:r.azimuth+(o.azimuth-r.azimuth)*n}}return t[t.length-1]}};Ht.styles=n`
    :host {
      display: block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    svg {
      width: 100%;
      height: auto;
      aspect-ratio: 400 / 160;
      display: block;
    }
    :host([compact]) svg {
      aspect-ratio: 400 / 110;
    }
    :host([compact]) .head {
      font-size: 0.72rem;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 0.5;
      opacity: 0.6;
    }
    .grid.faint {
      opacity: 0.25;
    }
    .tick {
      font-size: 9px;
      fill: var(--secondary-text-color);
    }
    .horizon {
      stroke: var(--divider-color);
      stroke-width: 1;
      stroke-dasharray: 2 2;
    }
    .fov-band {
      fill: var(--warning-color, gold);
      fill-opacity: 0.18;
    }
    .curve {
      fill: none;
      stroke: var(--primary-color);
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .now {
      stroke: var(--accent-color, crimson);
      stroke-width: 1.25;
    }
    .sun-dot {
      fill: gold;
      filter: drop-shadow(0 0 3px gold);
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 20px;
    }
  `,t([gt({attribute:!1})],Ht.prototype,"hass",void 0),t([gt({attribute:!1})],Ht.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ht.prototype,"compact",void 0),Ht=t([pt("acp-elevation-chart")],Ht);let Dt=class extends lt{constructor(){super(...arguments),this.compact=!1}_trace(){const t=this.discovered.entities.decision_trace_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=e.attributes;if(!i?.trace)return null;const s=new Map;for(const t of i.trace)s.set(jt(t.handler),{matched:t.matched,reason:t.reason,position:t.position});return{winner:e.state,reason:i.reason??"",steps:s}}render(){if(!this.hass||!this.discovered)return Z;const t=this._trace();return t?V`
      <div class="wrap">
        <div class="head">
          <span class="label">Pipeline</span>
          <span class="winner">Winner: ${t.winner}</span>
        </div>
        <div class="rows">
          ${$t.map(e=>this._row(e,t.steps.get(e),t.winner===e))}
        </div>
        <div class="reason dim">${t.reason}</div>
      </div>
    `:V`<div class="placeholder">Decision trace not yet populated.</div>`}_row(t,e,i){const s=e?.matched??!1,r=e?.reason??"not evaluated",o=e?.position;return V`
      <div class="row ${i?"winner":s?"match":"skip"}">
        <span class="name">${bt[t]}</span>
        <span class="dots" aria-hidden="true">${s?"████":"────"}</span>
        <span class="pos">${null!=o?St(o):""}</span>
        <span class="reason-inline dim">${r}</span>
        ${i?V`<span class="badge">✓</span>`:Z}
      </div>
    `}};function jt(t){return t.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase().replace(/^force_override$/,"force").replace(/^weather_override$/,"weather").replace(/^manual_override$/,"manual").replace(/^motion_timeout$/,"motion").replace(/^cloud_suppression$/,"cloud")}Dt.styles=n`
    :host {
      display: block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .head {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-bottom: 2px;
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .rows {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .row {
      display: grid;
      grid-template-columns: 112px 52px 48px 1fr auto;
      align-items: center;
      gap: 6px;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 0.8rem;
      line-height: 1.3;
    }
    :host([compact]) .row {
      grid-template-columns: 96px 36px 40px 1fr auto;
      font-size: 0.72rem;
      padding: 1px 4px;
    }
    :host([compact]) .reason {
      display: none;
    }
    .row.skip {
      opacity: 0.55;
    }
    .row.match {
      background: rgba(255, 193, 7, 0.08);
    }
    .row.winner {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
    }
    .row.winner .dim {
      color: inherit;
      opacity: 0.85;
    }
    .name {
      font-weight: 500;
    }
    .dots {
      font-family: 'ui-monospace', monospace;
      letter-spacing: -1px;
    }
    .pos {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    .reason-inline {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .badge {
      font-weight: 700;
      padding-left: 4px;
    }
    .reason {
      font-size: 0.78rem;
      font-style: italic;
      margin-top: 2px;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      padding: 16px;
      text-align: center;
    }
  `,t([gt({attribute:!1})],Dt.prototype,"hass",void 0),t([gt({attribute:!1})],Dt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Dt.prototype,"compact",void 0),Dt=t([pt("acp-decision-strip")],Dt);let Ft=class extends lt{constructor(){super(...arguments),this.compact=!1}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return{target:null,covers:{}};const e=this.hass.states[t];if(!e)return{target:null,covers:{}};const i=parseFloat(e.state),s=e.attributes;return{target:Number.isNaN(i)?null:i,covers:s?.actual_positions??{}}}_mismatched(){const t=this.discovered.entities.position_mismatch_binary;if(!t)return new Set;const e=this.hass.states[t];if("on"!==e?.state)return new Set;const i=e.attributes.entities;return i?new Set(Object.entries(i).filter(([,t])=>t.mismatch).map(([t])=>t)):new Set}_setPosition(t,e){this.hass.callService("cover","set_cover_position",{entity_id:t,position:e})}render(){if(!this.hass||!this.discovered)return Z;const{target:t,covers:e}=this._target(),i=this._mismatched(),s=Object.entries(e);return 0===s.length?V`<div class="placeholder">No covers reported by the integration.</div>`:V`
      <div class="wrap">
        <div class="head">
          <span class="label">Covers</span>
          <span class="target">Target: ${St(t)}</span>
        </div>
        ${s.map(([e,s])=>this._bar(e,s,t,i.has(e)))}
      </div>
    `}_bar(t,e,i,s){const r=this.hass.states[t]?.attributes?.friendly_name??t,o=i??0;return V`
      <div class="cover ${s?"mismatch":""}">
        <div class="name" title=${t}>${r}</div>
        <div
          class="track"
          @click=${e=>this._handleTrackClick(e,t)}
          title="Click to set position"
        >
          <div class="fill" style="width:${e??0}%"></div>
          ${null!==i?V`<div
                class="marker"
                style="left:${o}%"
                title="Target ${o}%"
              ></div>`:Z}
        </div>
        <div class="num">${St(e)}</div>
        ${s?V`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:Z}
      </div>
    `}_handleTrackClick(t,e){const i=t.currentTarget.getBoundingClientRect(),s=Math.round((t.clientX-i.left)/i.width*100),r=Math.max(0,Math.min(100,s));this._setPosition(e,r)}};Ft.styles=n`
    :host {
      display: block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .head {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .target {
      font-variant-numeric: tabular-nums;
    }
    .cover {
      display: grid;
      grid-template-columns: minmax(80px, 1fr) 3fr 48px auto;
      gap: 8px;
      align-items: center;
      font-size: 0.82rem;
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .track {
      position: relative;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
    }
    :host([compact]) .track {
      height: 6px;
    }
    :host([compact]) .cover {
      font-size: 0.75rem;
      gap: 6px;
    }
    .fill {
      height: 100%;
      background: var(--primary-color);
      transition: width 0.3s ease;
    }
    .marker {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 14px;
      background: var(--accent-color, red);
      transition: left 0.3s ease;
    }
    .num {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    .warn {
      color: var(--warning-color, orange);
      --mdc-icon-size: 16px;
    }
    .mismatch .fill {
      background: var(--warning-color, orange);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 16px;
    }
  `,t([gt({attribute:!1})],Ft.prototype,"hass",void 0),t([gt({attribute:!1})],Ft.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ft.prototype,"compact",void 0),Ft=t([pt("acp-cover-bar")],Ft);let Lt=class extends lt{constructor(){super(...arguments),this.compact=!1}_manualActive(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualEndIso(){const t=this.discovered.entities.manual_override_end_sensor;if(!t)return null;const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:null}_motionStatus(){const t=this.discovered.entities.motion_status_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=e.attributes.motion_timeout_end_time;return{state:e.state,endIso:i??null}}_forceActive(){const t=this.discovered.entities.force_override_sensor;if(!t)return 0;const e=this.hass.states[t];return e&&parseInt(e.state,10)||0}_resetManual(){const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}render(){if(!this.hass||!this.discovered)return Z;const t=this._manualActive(),e=this._manualEndIso(),i=this._motionStatus(),s=this._forceActive(),r=this.discovered.entities.reset_override_button;return V`
      <div class="wrap">
        <div class="label dim">Overrides</div>
        <div class="grid">
          <div class="tile ${t?"active":""}">
            <div class="tile-label">Manual</div>
            <div class="tile-value">${t?"Active":"Off"}</div>
            ${e?V`<div class="tile-sub dim">ends in ${Pt(e)}</div>`:Z}
          </div>

          <div class="tile ${s>0?"active warning":""}">
            <div class="tile-label">Force</div>
            <div class="tile-value">${s>0?`${s} active`:"Off"}</div>
          </div>

          ${i?V`<div class="tile ${"motion_detected"===i.state?"active":""}">
                <div class="tile-label">Motion</div>
                <div class="tile-value">${i.state.replace(/_/g," ")}</div>
                ${i.endIso?V`<div class="tile-sub dim">timeout ${Pt(i.endIso)}</div>`:Z}
              </div>`:Z}
          ${r?V`<button class="tile action" @click=${this._resetManual}>
                <ha-icon icon="mdi:restore"></ha-icon>
                <div class="tile-value">Reset Manual</div>
              </button>`:Z}
        </div>
      </div>
    `}};Lt.styles=n`
    :host {
      display: block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .label {
      font-size: 0.78rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 6px;
    }
    .tile {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 10px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      font-size: 0.8rem;
    }
    :host([compact]) .tile {
      padding: 4px 8px;
      font-size: 0.72rem;
    }
    :host([compact]) .tile-sub {
      display: none;
    }
    .tile.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .tile.active.warning {
      background: var(--warning-color, orange);
    }
    .tile.action {
      cursor: pointer;
      border: none;
      text-align: left;
      font-family: inherit;
      align-items: flex-start;
    }
    .tile.action:hover {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .tile-label {
      font-size: 0.72rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .tile-value {
      font-weight: 500;
    }
    .tile-sub {
      font-size: 0.72rem;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .tile.active .dim {
      color: inherit;
      opacity: 0.85;
    }
    ha-icon {
      --mdc-icon-size: 18px;
    }
  `,t([gt({attribute:!1})],Lt.prototype,"hass",void 0),t([gt({attribute:!1})],Lt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Lt.prototype,"compact",void 0),Lt=t([pt("acp-overrides-panel")],Lt);const Bt={"Summer Mode":"mdi:weather-sunny","Winter Mode":"mdi:snowflake",Intermediate:"mdi:weather-partly-cloudy"};let Vt=class extends lt{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return Z;const t=this.discovered.entities.climate_status_sensor;if(!t)return Z;const e=this.hass.states[t];if(!e||"unavailable"===e.state)return Z;const i=e.state,s=e.attributes??{},r=Bt[i]??"mdi:thermostat",o=s.temperature_unit??"°",n=[void 0!==s.indoor_temperature?{label:"Indoor",value:s.indoor_temperature,unit:o}:null,void 0!==s.outdoor_temperature?{label:"Outdoor",value:s.outdoor_temperature,unit:o}:null].filter(t=>null!==t),a=[{label:"Presence",value:s.is_presence,icon:"mdi:account-check"},{label:"Sunny",value:s.is_sunny,icon:"mdi:white-balance-sunny"},{label:"Lux",value:s.lux_active,icon:"mdi:brightness-7"},{label:"Irradiance",value:s.irradiance_active,icon:"mdi:solar-power"}].filter(t=>void 0!==t.value);return V`
      <div class="wrap">
        <div class="head">
          <span class="label">Climate</span>
          <span class="dim"
            >Active:
            ${void 0!==s.active_temperature?`${s.active_temperature.toFixed(1)}${o}`:"—"}</span
          >
        </div>
        <div class="strategy">
          <ha-icon icon=${r}></ha-icon>
          <span class="strategy-name">${i}</span>
        </div>
        ${n.length?V`
              <div class="temps">
                ${n.map(t=>V`
                    <div class="temp">
                      <span class="temp-label dim">${t.label}</span>
                      <span class="temp-value">${t.value.toFixed(1)}${t.unit}</span>
                    </div>
                  `)}
              </div>
            `:Z}
        ${a.length?V`
              <div class="conditions">
                ${a.map(t=>V`
                    <div class="chip ${t.value?"on":"off"}" title=${t.label}>
                      <ha-icon icon=${t.icon}></ha-icon>
                      <span>${t.label}</span>
                    </div>
                  `)}
              </div>
            `:Z}
      </div>
    `}};Vt.styles=n`
    :host {
      display: block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .head {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .strategy {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      font-weight: 500;
    }
    .strategy ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }
    .temps {
      display: flex;
      gap: 12px;
    }
    .temp {
      display: flex;
      flex-direction: column;
      padding: 6px 10px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      min-width: 64px;
    }
    .temp-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .temp-value {
      font-variant-numeric: tabular-nums;
      font-weight: 500;
    }
    .conditions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    :host([compact]) .temps {
      gap: 6px;
    }
    :host([compact]) .temp {
      padding: 4px 6px;
    }
    :host([compact]) .strategy {
      font-size: 0.85rem;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.72rem;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .chip.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .chip.off {
      opacity: 0.5;
    }
    .chip ha-icon {
      --mdc-icon-size: 14px;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `,t([gt({attribute:!1})],Vt.prototype,"hass",void 0),t([gt({attribute:!1})],Vt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Vt.prototype,"compact",void 0),Vt=t([pt("acp-climate-panel")],Vt);const Wt=[{key:"sky",label:"Sky compass",description:"Sun vs. window FOV, polar plot"},{key:"elevation",label:"Sun today",description:"Elevation-vs-time chart with FOV band and current-time cursor"},{key:"decision",label:"Decision strip",description:"All 10 pipeline handlers with the winning row highlighted"},{key:"covers",label:"Cover positions",description:"Per-cover live vs. target bars; click to set position"},{key:"overrides",label:"Overrides panel",description:"Manual, force, motion tiles + reset button"},{key:"climate",label:"Climate panel",description:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)"}],qt=Wt.map(t=>t.key);let Zt=class extends lt{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,async function(t){return(await t.callWS({type:"config_entries/get",domain:yt})).filter(t=>t.domain===yt).map(t=>({entry_id:t.entry_id,title:t.title}))}(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id})}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??qt}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_onEntryChange(t){const e=t.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:e})}_onSectionToggle(t,e){const i=new Set(this._currentSections);e?i.add(t):i.delete(t);const s=Wt.map(t=>t.key).filter(t=>i.has(t));this._emit({...this._config??{type:"",entry_id:""},show_sections:s})}_onCompactToggle(t){this._emit({...this._config??{type:"",entry_id:""},compact:t})}render(){if(!this._config)return Z;const t=new Set(this._currentSections);return V`
      <div class="form">
        <div class="section">
          <label class="field-label">Adaptive Cover Pro instance</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">Sections</label>
          <div class="hint">Toggle which parts of the card are shown.</div>
          ${Wt.map(e=>V`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${t.has(e.key)}
                  @change=${t=>this._onSectionToggle(e.key,t.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${e.label}</span>
                  <span class="toggle-desc">${e.description}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">Display</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${t=>this._onCompactToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Compact mode</span>
              <span class="toggle-desc">Tighter spacing between sections.</span>
            </span>
          </label>
        </div>
      </div>
    `}_renderEntryPicker(){return this._entriesError?V`
        <div class="error">Failed to load config entries: ${this._entriesError}</div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder="Enter config entry ID manually"
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?V`
        <div class="error">
          No Adaptive Cover Pro config entries found. Add an instance under
          <code>Settings → Devices &amp; Services</code>, then come back.
        </div>
      `:V`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(t=>t.entry_id===this._config.entry_id)?V`<option value=${this._config.entry_id}>
              (unknown: ${this._config.entry_id})
            </option>`:Z}
        ${this._entries.map(t=>V`
            <option value=${t.entry_id} ?selected=${t.entry_id===this._config?.entry_id}>
              ${t.title}
            </option>
          `)}
      </select>
    `:V`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};Zt.styles=n`
    :host {
      display: block;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    .section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-weight: 500;
      font-size: 0.88rem;
      color: var(--primary-text-color);
    }
    .hint {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .error {
      font-size: 0.82rem;
      color: var(--error-color, crimson);
    }
    .select,
    .text-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font-size: 0.9rem;
      font-family: inherit;
    }
    .select:focus,
    .text-input:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    .toggle-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 6px 0;
      cursor: pointer;
    }
    .toggle-row input[type='checkbox'] {
      margin-top: 3px;
      accent-color: var(--primary-color);
      width: 16px;
      height: 16px;
    }
    .toggle-text {
      display: flex;
      flex-direction: column;
    }
    .toggle-label {
      font-size: 0.88rem;
      color: var(--primary-text-color);
    }
    .toggle-desc {
      font-size: 0.74rem;
      color: var(--secondary-text-color);
    }
    code {
      background: var(--code-editor-background-color, rgba(0, 0, 0, 0.08));
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 0.85em;
    }
  `,t([gt({attribute:!1})],Zt.prototype,"hass",void 0),t([ft()],Zt.prototype,"_config",void 0),t([ft()],Zt.prototype,"_entries",void 0),t([ft()],Zt.prototype,"_entriesError",void 0),Zt=t([pt(_t)],Zt);const Jt=["sky","elevation","decision","covers","overrides","climate"];let Kt=class extends lt{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(t){if(!t?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");this._config={...t}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(_t)}static getStubConfig(){return{type:`custom:${mt}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||(this._fetchInFlight=!0,async function(t){return t.callWS({type:"config/entity_registry/list"})}(this.hass).then(t=>{this._registry=t,this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}),this._unsubRegistry||(this._unsubRegistry=function(t,e){let i=null,s=!1;return t.connection.subscribeEvents(e,"entity_registry_updated").then(t=>{s?t():i=t}).catch(()=>{}),()=>{s=!0,i&&i()}}(this.hass,()=>{this._registry=null,this._fetchInFlight=!1,this._ensureRegistry()})))}get _sections(){return this._config?.show_sections??Jt}_renderHeader(t){const e=xt[t.cover_type]??"mdi:window-shutter",i=t.entities.integration_enabled_switch,s=t.entities.automatic_control_switch,r=!i||"on"===this.hass.states[i]?.state,o=!s||"on"===this.hass.states[s]?.state;return V`
      <div class="header">
        <ha-icon .icon=${e}></ha-icon>
        <span class="title">${t.entry_title}</span>
        <span class="spacer"></span>
        ${i?V`<button
              class="pill ${r?"on":"off"}"
              @click=${()=>this._toggle(i)}
              title="Integration Enabled"
            >
              ${r?"ON":"OFF"}
            </button>`:Z}
        ${s?V`<button
              class="pill ${o?"on":"off"}"
              @click=${()=>this._toggle(s)}
              title="Automatic Control"
            >
              Auto
            </button>`:Z}
      </div>
    `}_toggle(t){const e=t.split(".")[0];this.hass.callService(e,"toggle",{entity_id:t})}_renderLoading(){return V`
      <ha-card>
        <div class="empty">
          <p class="dim">Loading Adaptive Cover Pro registry…</p>
        </div>
      </ha-card>
    `}_renderEmpty(t){const e=this._config.entry_id,i=this._registry?.length??0,s=this._registry?.filter(t=>t.config_entry_id===e&&"adaptive_cover_pro"===t.platform).length;return V`
      <ha-card>
        <div class="empty">
          <p><strong>No Adaptive Cover Pro entities found</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${e}</code></p>
          <ul class="diag">
            <li>Reason: <code>${t}</code></li>
            <li>Registry entries loaded: <code>${i}</code></li>
            <li>ACP entities matching entry_id: <code>${s??"—"}</code></li>
            ${this._registryError?V`<li>Registry fetch error: <code>${this._registryError}</code></li>`:Z}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return Z;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const t=function(t,e,i){const s=e.entry_id;if(!s)return null;const r={},o=`${s}_`;let n=!1;for(const t of i){if(t.config_entry_id!==s)continue;if(t.platform!==yt)continue;if(n=!0,!t.unique_id.startsWith(o))continue;const e=t.unique_id.slice(o.length),i=t.entity_id.split(".")[0],a=wt[`${i}:${e}`];a&&(r[a]=t.entity_id)}if(!n||0===Object.keys(r).length)return null;const a=t;let c=s;if(a.devices)for(const t of Object.values(a.devices))if(t.config_entries?.includes(s)){c=t.name_by_user??t.name??s;break}const l=[],d=r.target_position_sensor;if(d){const e=t.states[d]?.attributes?.actual_positions;e&&l.push(...Object.keys(e))}let p="cover_blind";const h=r.control_status_sensor;if(h){const e=t.states[h]?.attributes;e?.cover_type&&(p=e.cover_type)}return{entry_id:s,entry_title:c,cover_type:p,entities:r,managed_covers:l}}(this.hass,this._config,this._registry);if(!t)return this._renderEmpty("no matching entities after unique_id lookup");const e=this._sections;return V`
      <ha-card>
        ${this._renderHeader(t)}
        <div class="body ${this._config.compact?"compact":""}">
          ${e.includes("sky")?V`<acp-sky-compass .hass=${this.hass} .discovered=${t}></acp-sky-compass>`:Z}
          ${e.includes("elevation")?V`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:Z}
          ${e.includes("decision")?V`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-decision-strip>`:Z}
          ${e.includes("covers")?V`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:Z}
          ${e.includes("overrides")?V`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-overrides-panel>`:Z}
          ${e.includes("climate")?V`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:Z}
        </div>
        <div class="footer dim">adaptive-cover-pro-card v${vt}</div>
      </ha-card>
    `}};Kt.styles=n`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .header ha-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-color);
    }
    .title {
      font-size: 1.05rem;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .pill {
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: transparent;
      font-size: 0.78rem;
      letter-spacing: 0.04em;
      cursor: pointer;
      color: var(--secondary-text-color);
    }
    .pill.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    .pill.off {
      opacity: 0.6;
    }
    .body {
      display: grid;
      gap: 12px;
    }
    .body.compact {
      gap: 8px;
    }
    .empty {
      padding: 16px;
      text-align: center;
    }
    .empty code {
      background: var(--code-editor-background-color, rgba(0, 0, 0, 0.08));
      padding: 1px 6px;
      border-radius: 3px;
    }
    .empty ul.diag {
      list-style: none;
      padding: 0;
      margin: 8px auto;
      text-align: left;
      display: inline-block;
      font-size: 0.82rem;
    }
    .footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `,t([gt({attribute:!1})],Kt.prototype,"hass",void 0),t([ft()],Kt.prototype,"_config",void 0),t([ft()],Kt.prototype,"_registry",void 0),t([ft()],Kt.prototype,"_registryError",void 0),Kt=t([pt(mt)],Kt),window.customCards=window.customCards||[],window.customCards.push({type:mt,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${vt} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{Kt as AdaptiveCoverProCard};
