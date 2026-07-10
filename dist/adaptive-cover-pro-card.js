/*! adaptive-cover-pro-card v2.10.1 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function e(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new n(i,e,s)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",f=_.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const n=s?.call(this);o?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=s;const n=o.fromAttribute(t,e.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(e,t,i,s=!1,o){if(void 0!==e){const n=this.constructor;if(!1===s&&(o=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??b)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,f?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,A=$.trustedTypes,C=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,M=`<${z}>`,O=document,I=()=>O.createComment(""),F=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,P="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,j=/>/g,D=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,K=/"/g,G=/^(?:script|style|textarea|title)$/i,L=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=L(1),W=L(2),U=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),Y=new WeakMap,H=O.createTreeWalker(O,129);function Q(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,s=[];let o,n=2===t?"<svg>":3===t?"<math>":"",r=R;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===R?"!--"===l[1]?r=N:void 0!==l[1]?r=j:void 0!==l[2]?(G.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=D):void 0!==l[3]&&(r=D):r===D?">"===l[0]?(r=o??R,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?D:'"'===l[3]?K:B):r===K||r===B?r=D:r===N||r===j?r=R:(r=D,o=void 0);const h=r===D&&e[t+1].startsWith("/>")?" ":"";n+=r===R?i+M:c>=0?(s.push(a),i.slice(0,c)+S+i.slice(c)+E+h):i+E+(-2===c?t:h)}return[Q(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class X{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,n=0;const r=e.length-1,a=this.parts,[l,c]=Z(e,t);if(this.el=X.createElement(l,i),H.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=H.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(S)){const t=c[n++],i=s.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?se:"?"===r[1]?oe:"@"===r[1]?ne:ie}),s.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:o}),s.removeAttribute(e));if(G.test(s.tagName)){const e=s.textContent.split(E),t=e.length-1;if(t>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],I()),H.nextNode(),a.push({type:2,index:++o});s.append(e[t],I())}}}else if(8===s.nodeType)if(s.data===z)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(E,e+1));)a.push({type:7,index:o}),e+=E.length-1}o++}}static createElement(e,t){const i=O.createElement("template");return i.innerHTML=e,i}}function J(e,t,i=e,s){if(t===U)return t;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=F(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(t=J(e,o._$AS(e,t.values),o,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??O).importNode(t,!0);H.currentNode=s;let o=H.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new te(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new re(o,this,e)),this._$AV.push(t),a=i[++r]}n!==a?.index&&(o=H.nextNode(),n++)}return H.currentNode=O,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),F(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==U&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=X.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Y.get(e.strings);return void 0===t&&Y.set(e.strings,t=new X(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new te(this.O(I()),this.O(I()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(e,t=this,i,s){const o=this.strings;let n=!1;if(void 0===o)e=J(this,e,t,0),n=!F(e)||e!==this._$AH&&e!==U,n&&(this._$AH=e);else{const s=e;let r,a;for(e=o[0],r=0;r<o.length-1;r++)a=J(this,s[i+r],t,r),a===U&&(a=this._$AH[r]),n||=!F(a)||a!==this._$AH[r],a===q?e=q:e!==q&&(e+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class oe extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class ne extends ie{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??q)===U)return;const i=this._$AH,s=e===q&&i!==q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const ae=$.litHtmlPolyfillSupport;ae?.(X,te),($.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=i?.renderBefore??null;s._$litPart$=o=new te(t.insertBefore(I(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ue={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},pe=(e=ue,t,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,o,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];t.call(this,i),this.requestUpdate(s,o,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function _e(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ge(e){return _e({...e,state:!0,attribute:!1})}function me(e,t,i){if(!e)return!0;for(const s of i)if(s&&e.states[s]!==t.states[s])return!0;return!1}const fe="2.10.1",ve="adaptive-cover-pro-card",ye="adaptive-cover-pro-card-editor",be="adaptive-cover-pro-sky-compass-card",we="adaptive-cover-pro-sky-compass-card-editor",xe="adaptive-cover-pro-tile-card",$e="adaptive-cover-pro-tile-card-editor",ke="adaptive-cover-pro-decision-card",Ae="adaptive-cover-pro-decision-card-editor",Ce="adaptive-cover-pro-solar-chart-card",Se="adaptive-cover-pro-solar-chart-card-editor",Ee="adaptive_cover_pro",ze=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default","floor_clamp"],Me={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},Oe={force:"handler.force",weather:"handler.weather",manual:"handler.manual",custom_position:"handler.custom_position",motion:"handler.motion",cloud:"handler.cloud",climate:"handler.climate",glare_zone:"handler.glare_zone",solar:"handler.solar",default:"handler.default",floor_clamp:"handler.floor_clamp"},Ie={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},Fe={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open"},Te={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds"},Pe={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion"},Re={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Solar tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Motion",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"},off_schedule:{label:"Off-schedule",bg:"rgba(96, 125, 139, 0.22)",fg:"#37474f"}},Ne={auto:"badge.auto",manual:"badge.manual",force:"badge.force",weather:"badge.weather",glare_zone:"badge.glare_zone",climate:"badge.climate",cloud:"badge.cloud",custom_position:"badge.custom_position",solar:"badge.solar",motion:"badge.motion",off:"badge.off",off_schedule:"badge.off_schedule"},je={auto:"mdi:autorenew",manual:"mdi:hand-back-right",force:"mdi:flash",weather:"mdi:shield-sun",glare_zone:"mdi:weather-sunny-alert",climate:"mdi:thermostat",cloud:"mdi:weather-cloudy",custom_position:"mdi:bookmark",solar:"mdi:white-balance-sunny",motion:"mdi:motion-sensor",off:"mdi:power",off_schedule:"mdi:clock-alert-outline"},De={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Be={position:"target_position_sensor",tilt:"target_tilt_sensor"},Ke={tilt:"covers.tilt_title"},Ge={"sensor:Cover_Position":"target_position_sensor","sensor:Cover_Tilt":"target_tilt_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","sensor:solar_calculation":"solar_calculation_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"},Le={en:{handler:{force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Weather safety",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Solar tracking",motion:"Motion idle",off:"Off",off_schedule:"Off-schedule",floor_suffix:" ↥",safety:"Safety"},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window field of view",fov_exit:"Sun leaves window field of view"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks.",solar_only_note:"Solar geometry only — does not reflect manual overrides, custom positions, cloud suppression, or weather."},dialog:{configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"↥",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Motion",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Motion",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"expires in {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance",mode_off:"Climate mode off",standby:"Standby",threshold_low:"low",threshold_high:"high",threshold_summer_outside:"summer",reason:{outside_time_window:"Outside the operating time window",thresholds_not_met:"Temperatures within the comfort band — no action needed",other_mode_active:"Another control mode is currently active",readings_unavailable:"Temperature readings unavailable",mode_off:"Climate mode is turned off"}},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in FOV",in_fov:"in FOV",in_fov_tooltip:"Sun is currently within this window’s field of view",none:"—",sun:"Sun",moon:"Moon",sun_up_not_hitting:"Sun (up, not hitting)",sun_below_horizon:"Sun (below horizon)",window_fov:"Window FOV",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_target:"Cover target",cover_held:"Cover position (held)",window_normal:"Window azimuth",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"FOV {left} left / {right} right{elev}",window_normal_tooltip:"Window azimuth: {bearing}",cover_position_target:"Target: {pct}%",cover_position_target_awning:"Target (extended): {pct}%",cover_position_actual:"Actual: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",target_solar:"Solar target: {pct}",click_to_set:"Click to set position",target_tooltip:"Target {pct}%",target_tooltip_override:"Would-be solar target {pct}% — cover is held by manual override",tilt_title:"Tilt",tilt_target:"Tilt: {pct}",tilt_click_to_set:"Click to set tilt",tilt_target_tooltip:"Tilt target {pct}%"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor",outside_schedule:"Outside schedule — automatic control paused",outside_schedule_tooltip:"The configured schedule window is not active, so automatic positioning is paused.",solar_would_be:"solar {pct}",next_change_in:"Next adjustment allowed in {time}"},solar:{title:"Solar Calculation",axis_position:"Position axis",axis_tilt:"Tilt axis",group_inputs:"Inputs",group_intermediates:"Intermediates",group_output:"Output",show_all:"Show all {count} values",show_less:"Show less",no_target:"No solar target — {status}",status:{direct_sun:"Direct sun",fov_exit:"Default · FOV exit",elevation_limit:"Default · elevation limit",sunset_offset:"Default · sunset offset",blind_spot:"Default · blind spot",default:"Default"},field:{sol_elev_deg:"Sun elevation",gamma_deg:"Relative azimuth (γ)",position_pct:"Position",effective_distance_m:"Effective distance",adjusted_height_m:"Adjusted height",safety_margin:"Safety margin",awn_angle_deg:"Awning angle",vertical_position_m:"Vertical position",length_m:"Extension length",slat_angle_raw_deg:"Slat angle",tilt_mode:"Tilt mode",max_degrees:"Max angle"}},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Motion timeout pending",motion_detected:"Motion detected",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found."},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"FOV: {from} → {to}",fov_windows:"FOV: {windows}",fov_window_named:"{name}: {windows}",no_fov_today:"Sun does not enter FOV today",placeholder:"Sun elevation chart unavailable.",schedule:"Schedule {from} – {to}",schedule_from:"Schedule from {from}",schedule_until:"Schedule until {to}",schedule_start_tooltip:"Schedule start",schedule_end_tooltip:"Schedule end"},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",support_alt:"Buy me a coffee",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window FOV, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with FOV band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, motion tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy; shows standby when climate mode is off or inactive",section_solar_label:"Solar calculation",section_solar_desc:"Raw solar geometry breakdown (inputs → intermediates → output); requires the integration’s solar_calculation sensor",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Solar tracking",badge_force:"Force override",badge_weather:"Weather safety",badge_manual:"Manual override",badge_custom_position:"Custom position",badge_motion:"Motion",badge_climate:"Climate",badge_glare_zone:"Glare zone",badge_cloud:"Cloud suppression",show_compass:"Show sun compass in dialog",show_elevation_chart:"Show sun-today chart in dialog",show_solar_calc:"Show solar calculation in dialog",show_motion_icon:"Show motion indicator",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth.",toggle_elevation_chart_label:"Sun-today chart",toggle_elevation_chart_desc:"Elevation-vs-time chart below the compass, with FOV band and elevation limits."},decision:{title:"Title (optional)",compact_label:"Compact mode",compact_desc:"Tighter rows; also hides inactive handlers.",hide_inactive_handlers_label:"Hide inactive handlers",hide_inactive_handlers_desc:"Show only the winner and actively matched pipeline handlers.",show_decision_summary_label:"Show decision summary",show_decision_summary_desc:'Render a plain-English "Why this position?" sentence above the strip.'},solar_chart:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds a FOV overlay to the chart.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller chart, tighter spacing."}}},fr:{handler:{force:"Dérogation forcée",weather:"Sécurité météo",manual:"Dérogation manuelle",custom_position:"Position personnalisée",motion:"Délai d'inactivité du mouvement",cloud:"Désactivation par temps nuageux",climate:"Climatique",glare_zone:"Zone d'éblouissement",solar:"Suivi solaire",default:"Par défaut",floor_clamp:"Plancher"},badge:{auto:"Auto",manual:"Manuel",force:"Forcé",weather:"Sécurité météo",glare_zone:"Éblouissement",climate:"Climatique",cloud:"Nuageux",custom_position:"Personnalisé",solar:"Suivi solaire",motion:"Inactivité",off:"Off",off_schedule:"Hors planning",floor_suffix:" ↥",safety:"Sécurité"},forecast:{event:{sunrise:"Lever du soleil",sunset:"Coucher du soleil",fov_enter:"Le soleil entre dans le champ de vision de la fenêtre",fov_exit:"Le soleil quitte le champ de vision de la fenêtre"},hover_hint:"Survolez la courbe pour voir l'heure et la position prévue ; survolez une ligne colorée pour voir l'événement qu'elle indique.",solar_only_note:"Géométrie solaire uniquement — ne tient pas compte des dérogations manuelles, des positions personnalisées, de la désactivation par temps nuageux ni des conditions météo."},dialog:{configure_integration:"Configurer l'intégration",open_device_page:"Ouvrir la page de l'appareil",close:"Fermer",target:"Cible",resume_auto:"Reprendre l'automatique",hide_advanced:"▼ Masquer les options avancées",show_advanced:"▶ Afficher les options avancées",custom_positions:"Positions personnalisées",floor_tooltip:"Plancher — cette valeur force une position minimale au-dessus du calcul automatique",floor:"↥",disable_slot:"Désactiver le créneau {slot}",enable_slot:"Activer le créneau {slot}",on:"Activé",off:"Désactivé",controls:"Commandes",automatic:"Automatique",climate:"Climatique",motion:"Mouvement",toggle_hint:"{label} {state} — appuyez pour basculer",state_on:"activé",state_off:"désactivé",todays_forecast:"Prévisions du jour"},overrides:{title:"Dérogations",manual:"Manuel",force:"Forcé",motion:"Mouvement",active:"Actif",off:"Désactivé",ends_in:"se termine dans {time}",active_count:"{count} dérogation(s) active(s)",timeout:"expire dans {time}",reset_manual:"Réinitialiser le mode manuel"},climate:{title:"Climatique",active:"Actif : {strategy}",indoor:"Intérieur",outdoor:"Extérieur",presence:"Présence",sunny:"Ensoleillé",lux:"Lux",irradiance:"Irradiance",mode_off:"Mode climatique désactivé",standby:"En veille",threshold_low:"bas",threshold_high:"haut",threshold_summer_outside:"été",reason:{outside_time_window:"En dehors de la plage horaire de fonctionnement",thresholds_not_met:"Températures dans la plage de confort — aucune action requise",other_mode_active:"Un autre mode de contrôle est actuellement actif",readings_unavailable:"Relevés de température indisponibles",mode_off:"Le mode climatique est désactivé"}},compass:{placeholder_no_entries:"Aucune instance Adaptive Cover Pro sélectionnée.",placeholder_no_sun:"Le capteur solaire n'est pas encore renseigné.",sun_tooltip:"Soleil : {az} az / {el} él",sunrise_tooltip:"Lever du soleil : {time}",sunset_tooltip:"Coucher du soleil : {time}",moon_tooltip:"Lune : {phase} ({pct}%)",sun_path_tooltip:"Trajectoire solaire (aujourd'hui)",in_fov_check:"✓ dans le champ de vision",in_fov:"dans le champ de vision",in_fov_tooltip:"Le soleil est actuellement dans le champ de vision de cette fenêtre",none:"—",sun:"Soleil",moon:"Lune",sun_up_not_hitting:"Soleil (levé, ne frappe pas)",sun_below_horizon:"Soleil (sous l’horizon)",window_fov:"Champ de vision",sun_path:"Trajectoire solaire",sunrise:"Lever du soleil",sunset:"Coucher du soleil",cover_target:"Cible du store",cover_held:"Position du store (maintenue)",window_normal:"Azimut de la fenêtre",stat_sun:"Soleil : ",stat_azi:"Azi : ",stat_elev:"Élév : ",stat_window:"Fenêtre : ",active_sun_arc:"Arc solaire actif {from} – {to}{elev}",fov_arc:"Champ de vision {left} gauche / {right} droite{elev}",window_normal_tooltip:"Azimut de la fenêtre : {bearing}",cover_position_target:"Cible : {pct}%",cover_position_target_awning:"Cible (déployé) : {pct}%",cover_position_actual:"Réel : {pct}%",blind_spot:"Soleil masqué : {from} - {to}",elev_suffix:" · élév {min}–{max}"},covers:{placeholder:"Aucun store signalé par l'intégration.",title:"Stores",target:"Cible : {pct}",target_solar:"Cible solaire : {pct}",click_to_set:"Cliquer pour définir la position",target_tooltip:"Cible {pct}%",target_tooltip_override:"Cible solaire théorique {pct}% — le store est maintenu par la commande manuelle",tilt_title:"Inclinaison",tilt_target:"Inclinaison : {pct}",tilt_click_to_set:"Cliquer pour définir l'inclinaison",tilt_target_tooltip:"Cible inclinaison {pct}%"},decision:{placeholder:"La trace de décision n'est pas encore renseignée.",pipeline:"Pipeline",winner:"Actif : {name}",summary_tooltip:"Pourquoi cette position ?",not_evaluated:"non évalué",floor_suffix:" plancher",outside_schedule:"Hors planning — contrôle automatique en pause",outside_schedule_tooltip:"La fenêtre de planning configurée n'est pas active, le positionnement automatique est donc en pause.",solar_would_be:"solaire {pct}",next_change_in:"Prochain ajustement autorisé dans {time}"},solar:{title:"Calcul solaire",axis_position:"Axe de position",axis_tilt:"Axe d'inclinaison",group_inputs:"Entrées",group_intermediates:"Intermédiaires",group_output:"Sortie",show_all:"Afficher les {count} valeurs",show_less:"Afficher moins",no_target:"Pas de cible solaire — {status}",status:{direct_sun:"Soleil direct",fov_exit:"Par défaut · sortie du champ de vision",elevation_limit:"Par défaut · limite d'élévation",sunset_offset:"Par défaut · décalage coucher du soleil",blind_spot:"Par défaut · angle mort",default:"Par défaut"},field:{sol_elev_deg:"Élévation du soleil",gamma_deg:"Azimut relatif (γ)",position_pct:"Position",effective_distance_m:"Distance effective",adjusted_height_m:"Hauteur ajustée",safety_margin:"Marge de sécurité",awn_angle_deg:"Angle du store",vertical_position_m:"Position verticale",length_m:"Longueur d'extension",slat_angle_raw_deg:"Angle des lamelles",tilt_mode:"Mode d'inclinaison",max_degrees:"Angle maximal"}},header:{on:"ON",off:"OFF",integration_enabled:"Intégration activée",auto:"Auto",automatic_control:"Contrôle automatique"},tile:{motion_pending:"Délai de mouvement en cours",motion_detected:"Mouvement détecté",open:"Ouvrir",stop:"Arrêter",close:"Fermer",resume_aria:"Reprendre le contrôle automatique",registry_failed:"Échec de la récupération du registre : {error}",loading:"Chargement…",entry_not_found:"Instance Adaptive Cover Pro {entry} introuvable."},formatters:{expired:"expiré"},elevation:{title:"Soleil aujourd'hui",fov_window:"Champ de vision : {from} → {to}",fov_windows:"Champ de vision : {windows}",fov_window_named:"{name} : {windows}",no_fov_today:"Pas de soleil dans le champ de vision aujourd'hui",placeholder:"Graphique d'élévation solaire indisponible.",schedule:"Programmation {from} – {to}",schedule_from:"Programmation à partir de {from}",schedule_until:"Programmation jusqu'à {to}",schedule_start_tooltip:"Début de programmation",schedule_end_tooltip:"Fin de programmation"},root:{loading_registry:"Chargement du registre Adaptive Cover Pro…",no_entities_title:"Aucune entité Adaptive Cover Pro trouvée",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Aucune entité Adaptive Cover Pro correspondante",compass_configured:"Instances configurées : {entries}",compass_not_found:"Instances introuvables : {entries}"},editor:{common:{entry_id:"Instance Adaptive Cover Pro",support_alt:"Offrez-moi un café",title_optional:"Titre (facultatif)",title_placeholder:"ex. Fenêtres côté ouest",north_offset:"Décalage nord de la boussole (°)",north_offset_hint:"Faites pivoter la boussole dans le sens horaire pour que « haut » corresponde à votre carte. Par défaut : 0.",loading_entries:"Chargement des entrées de configuration Adaptive Cover Pro…",load_failed:"Échec du chargement des entrées de configuration : {error}",no_entries:"Aucune entrée de configuration Adaptive Cover Pro trouvée. Ajoutez une instance sous",no_entries_path:"Paramètres → Appareils et services",no_entries_then:", puis revenez ici.",entry_id_manual_placeholder:"Saisir manuellement l'ID d'entrée de configuration",entry_id_fallback_label:"ID d'entrée",unknown_entry:"(inconnu : {entry})",reset:"Réinitialiser"},main:{sections:"Sections",sections_hint:"Activer ou désactiver les parties de la carte affichées.",section_sky_label:"Boussole céleste",section_sky_desc:"Soleil par rapport au champ de vision de la fenêtre, tracé polaire",section_elevation_label:"Soleil aujourd'hui",section_elevation_desc:"Graphique élévation/temps avec bande FOV et curseur temps réel",section_decision_label:"Bande de décision",section_decision_desc:"Les 10 gestionnaires du pipeline avec la ligne gagnante mise en évidence",section_covers_label:"Positions des stores",section_covers_desc:"Barres position réelle/cible par store ; cliquer pour définir la position",section_overrides_label:"Panneau des dérogations",section_overrides_desc:"Tuiles Manuel, Forcé, Mouvement + bouton de réinitialisation",section_climate_label:"Panneau climatique",section_climate_desc:"Stratégie été/hiver/intermédiaire ; affiche le mode veille si le mode climatique est désactivé ou inactif",section_solar_label:"Calcul solaire",section_solar_desc:"Décomposition de la géométrie solaire brute (entrées → intermédiaires → sortie) ; nécessite le capteur solar_calculation de l’intégration",controls:"Commandes",controls_hint:"Afficher en lecture seule (visible mais non cliquable).",integration_pill_label:"Bouton ON/OFF de l'intégration",integration_pill_desc:"Permettre de basculer l'intégration depuis l'en-tête de la carte.",automatic_pill_label:"Bouton contrôle automatique",automatic_pill_desc:"Permettre de basculer le contrôle automatique depuis l'en-tête de la carte.",reset_button_label:"Bouton de réinitialisation de la dérogation manuelle",reset_button_desc:"Permettre d'appuyer sur la tuile de réinitialisation dans le panneau des dérogations.",display:"Affichage",compact_label:"Mode compact",compact_desc:"Espacement réduit entre les sections.",show_compass_stats_label:"Afficher les statistiques de la boussole",show_compass_stats_desc:"Azi, Élév, ∠ et angle de fenêtre sous la boussole céleste.",show_compass_legend_label:"Afficher la légende de la boussole",show_compass_legend_desc:"Clé de couleur sous la boussole céleste.",show_moon_label:"Afficher la lune sur la boussole",show_moon_desc:"Position et phase de la lune en superposition sur la boussole céleste.",hide_inactive_label:"Masquer les gestionnaires inactifs",hide_inactive_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs."},tile:{name:"Titre personnalisé",icon:"Icône personnalisée",cover:"Entité de store",layout:"Disposition",show_position:"Afficher la position %",show_state:"Afficher l'état (Ouvert/Fermé)",show_decision_summary:"Afficher le résumé de décision",show_controls:"Afficher les commandes ↑■▼",show_badge:"Afficher le badge contextuel",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Suivi solaire",badge_force:"Dérogation forcée",badge_weather:"Sécurité météo",badge_manual:"Dérogation manuelle",badge_custom_position:"Position personnalisée",badge_motion:"Mouvement",badge_climate:"Climatique",badge_glare_zone:"Zone d'éblouissement",badge_cloud:"Suppression nuageuse",show_compass:"Afficher la boussole solaire dans le dialogue",show_elevation_chart:"Afficher le graphique du soleil dans le dialogue",show_solar_calc:"Afficher le calcul solaire dans le dialogue",show_motion_icon:"Afficher l'indicateur de mouvement",tap_action:"Action au toucher",hold_action:"Action au maintien",double_tap_action:"Action au double toucher",cover_blank_hint:"Laisser vide pour utiliser automatiquement le premier store géré.",layout_option_one_line:"Une ligne (compact)",layout_option_detailed:"Détaillé (titre, état, indicateurs)"},compass:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition à la boussole.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"SVG plus petit, légende masquée.",toggle_legend_label:"Légende",toggle_legend_desc:"Échantillons de couleur et étiquettes d'instance sous la boussole.",toggle_stats_label:"Statistiques",toggle_stats_desc:"Soleil + lignes numériques par fenêtre.",toggle_moon_label:"Lune",toggle_moon_desc:"Afficher la position et la phase de la lune.",toggle_cardinals_label:"Points cardinaux",toggle_cardinals_desc:"Lettres N/E/S/O autour de la boussole.",toggle_blind_spot_label:"Zones de soleil masqué",toggle_blind_spot_desc:"Secteurs hachurés pour la plage où le soleil est masqué de chaque fenêtre.",toggle_sun_path_label:"Trajectoire solaire",toggle_sun_path_desc:"Arc solaire du jour dans le ciel.",toggle_sunrise_sunset_label:"Repères lever / coucher du soleil",toggle_sunrise_sunset_desc:"Petits points aux azimuts de lever et coucher du soleil.",toggle_cover_fill_label:"Remplissage de fermeture du store",toggle_cover_fill_desc:"Secteur intérieur indiquant le taux de fermeture de chaque store.",toggle_window_arrow_label:"Flèche de normale de fenêtre",toggle_window_arrow_desc:"Ligne du centre vers l'azimut de chaque fenêtre.",toggle_elevation_chart_label:"Graphique du soleil",toggle_elevation_chart_desc:"Graphique élévation/temps sous la boussole, avec bande FOV et limites d'élévation."},decision:{title:"Titre (facultatif)",compact_label:"Mode compact",compact_desc:"Lignes plus serrées ; masque aussi les gestionnaires inactifs.",hide_inactive_handlers_label:"Masquer les gestionnaires inactifs",hide_inactive_handlers_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs.",show_decision_summary_label:"Afficher le résumé de décision",show_decision_summary_desc:"Afficher une phrase explicite « Pourquoi cette position ? » au-dessus de la bande."},solar_chart:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition FOV au graphique.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"Graphique plus petit, espacement plus serré."}}},de:{handler:{force:"Zwangsübersteuerung",weather:"Wettersicherheit",manual:"Manuelle Übersteuerung",custom_position:"Benutzerdefinierte Position",motion:"Bewegungs-Timeout",cloud:"Wolkenunterdrückung",climate:"Klima",glare_zone:"Blendungszone",solar:"Sonnenverfolgung",default:"Standard",floor_clamp:"Mindestposition"},badge:{auto:"Auto",manual:"Manuell",force:"Zwang",weather:"Wettersicherheit",glare_zone:"Blendung",climate:"Klima",cloud:"Bewölkt",custom_position:"Benutzerdefiniert",solar:"Sonnenverfolgung",motion:"Bewegung inaktiv",off:"Aus",off_schedule:"Außerhalb des Zeitplans",floor_suffix:" ↥",safety:"Sicherheit"},forecast:{event:{sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",fov_enter:"Sonne tritt in das Sichtfeld des Fensters ein",fov_exit:"Sonne verlässt das Sichtfeld des Fensters"},hover_hint:"Kurve überfahren für Uhrzeit und prognostizierte Position; farbige Linie überfahren für das markierte Ereignis.",solar_only_note:"Nur Sonnengeometrie — berücksichtigt keine manuellen Übersteuerungen, benutzerdefinierten Positionen, Wolkenunterdrückung oder Wetter."},dialog:{configure_integration:"Integration konfigurieren",open_device_page:"Geräteseite öffnen",close:"Schließen",target:"Ziel",resume_auto:"Automatik fortsetzen",hide_advanced:"▼ Erweitert ausblenden",show_advanced:"▶ Erweitert",custom_positions:"Benutzerdefinierte Positionen",floor_tooltip:"Mindestposition — hebt die Position über den berechneten Wert",floor:"↥",disable_slot:"Slot {slot} deaktivieren",enable_slot:"Slot {slot} aktivieren",on:"An",off:"Aus",controls:"Steuerung",automatic:"Automatisch",climate:"Klima",motion:"Bewegung",toggle_hint:"{label} {state} — tippen zum Umschalten",state_on:"an",state_off:"aus",todays_forecast:"Heutige Prognose"},overrides:{title:"Übersteuerungen",manual:"Manuell",force:"Zwang",motion:"Bewegung",active:"Aktiv",off:"Aus",ends_in:"endet in {time}",active_count:"{count} aktiv",timeout:"läuft in {time} ab",reset_manual:"Manuell zurücksetzen"},climate:{title:"Klima",active:"Aktiv: {strategy}",indoor:"Innen",outdoor:"Außen",presence:"Anwesenheit",sunny:"Sonnig",lux:"Lux",irradiance:"Einstrahlung",mode_off:"Klimamodus deaktiviert",standby:"Bereitschaft",threshold_low:"niedrig",threshold_high:"hoch",threshold_summer_outside:"Sommer",reason:{outside_time_window:"Außerhalb des Betriebszeitfensters",thresholds_not_met:"Temperaturen im Komfortbereich — keine Maßnahme erforderlich",other_mode_active:"Ein anderer Steuermodus ist derzeit aktiv",readings_unavailable:"Temperaturwerte nicht verfügbar",mode_off:"Klimamodus ist deaktiviert"}},compass:{placeholder_no_entries:"Kein Adaptive Cover Pro-Eintrag ausgewählt.",placeholder_no_sun:"Sonnensensor noch nicht befüllt.",sun_tooltip:"Sonne: {az} az / {el} el",sunrise_tooltip:"Sonnenaufgang: {time}",sunset_tooltip:"Sonnenuntergang: {time}",moon_tooltip:"Mond: {phase} ({pct}%)",sun_path_tooltip:"Sonnenbahn (heute)",in_fov_check:"✓ im Sichtfeld",in_fov:"im Sichtfeld",in_fov_tooltip:"Sonne befindet sich derzeit im Sichtfeld dieses Fensters",none:"—",sun:"Sonne",moon:"Mond",sun_up_not_hitting:"Sonne (aufgegangen, trifft nicht)",sun_below_horizon:"Sonne (unter dem Horizont)",window_fov:"Fenster-Sichtfeld",sun_path:"Sonnenbahn",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",cover_target:"Beschattungsziel",cover_held:"Beschattungsposition (gehalten)",window_normal:"Fensterazimut",stat_sun:"Sonne: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Fenster: ",active_sun_arc:"Aktiver Sonnenbogen {from} – {to}{elev}",fov_arc:"Sichtfeld {left} links / {right} rechts{elev}",window_normal_tooltip:"Fensterazimut: {bearing}",cover_position_target:"Ziel: {pct}%",cover_position_target_awning:"Ziel (ausgefahren): {pct}%",cover_position_actual:"Aktuell: {pct}%",blind_spot:"Blindfleck: {from} – {to}",elev_suffix:" · Elev {min}–{max}"},covers:{placeholder:"Keine Beschattungen von der Integration gemeldet.",title:"Beschattungen",target:"Ziel: {pct}",target_solar:"Sonnenziel: {pct}",click_to_set:"Klicken zum Festlegen der Position",target_tooltip:"Ziel {pct}%",target_tooltip_override:"Theoretisches Sonnenziel {pct}% — Beschattung wird durch manuelle Übersteuerung gehalten",tilt_title:"Neigung",tilt_target:"Neigung: {pct}",tilt_click_to_set:"Klicken zum Festlegen der Neigung",tilt_target_tooltip:"Neigungsziel {pct}%"},decision:{placeholder:"Entscheidungsprotokoll noch nicht befüllt.",pipeline:"Pipeline",winner:"Gewinner: {name}",summary_tooltip:"Warum diese Position?",not_evaluated:"nicht ausgewertet",floor_suffix:" Mindestposition",outside_schedule:"Außerhalb des Zeitplans — automatische Steuerung pausiert",outside_schedule_tooltip:"Das konfigurierte Zeitplanfenster ist nicht aktiv, daher ist die automatische Positionierung pausiert.",solar_would_be:"solar {pct}",next_change_in:"Nächste Anpassung erlaubt in {time}"},solar:{title:"Sonnenberechnung",axis_position:"Positionsachse",axis_tilt:"Neigungsachse",group_inputs:"Eingaben",group_intermediates:"Zwischenwerte",group_output:"Ausgabe",show_all:"Alle {count} Werte anzeigen",show_less:"Weniger anzeigen",no_target:"Kein Sonnenziel — {status}",status:{direct_sun:"Direkte Sonne",fov_exit:"Standard · Sichtfeld-Austritt",elevation_limit:"Standard · Höhengrenze",sunset_offset:"Standard · Sonnenuntergangs-Versatz",blind_spot:"Standard · Blindfleck",default:"Standard"},field:{sol_elev_deg:"Sonnenhöhe",gamma_deg:"Relativer Azimut (γ)",position_pct:"Position",effective_distance_m:"Effektive Distanz",adjusted_height_m:"Angepasste Höhe",safety_margin:"Sicherheitsabstand",awn_angle_deg:"Markisenwinkel",vertical_position_m:"Vertikale Position",length_m:"Ausfahrlänge",slat_angle_raw_deg:"Lamellenwinkel",tilt_mode:"Neigungsmodus",max_degrees:"Maximaler Winkel"}},header:{on:"ON",off:"OFF",integration_enabled:"Integration aktiviert",auto:"Auto",automatic_control:"Automatische Steuerung"},tile:{motion_pending:"Bewegungs-Timeout läuft",motion_detected:"Bewegung erkannt",open:"Öffnen",stop:"Stopp",close:"Schließen",resume_aria:"Automatische Steuerung fortsetzen",registry_failed:"Registry-Abruf fehlgeschlagen: {error}",loading:"Wird geladen…",entry_not_found:"Adaptive Cover Pro-Eintrag {entry} nicht gefunden."},formatters:{expired:"abgelaufen"},elevation:{title:"Sonne heute",fov_window:"Sichtfeld: {from} → {to}",fov_windows:"Sichtfeld: {windows}",fov_window_named:"{name}: {windows}",no_fov_today:"Sonne tritt heute nicht in das Sichtfeld ein",placeholder:"Sonnenhöhen-Diagramm nicht verfügbar.",schedule:"Zeitplan {from} – {to}",schedule_from:"Zeitplan ab {from}",schedule_until:"Zeitplan bis {to}",schedule_start_tooltip:"Zeitplanstart",schedule_end_tooltip:"Zeitplanende"},root:{loading_registry:"Adaptive Cover Pro-Registry wird geladen…",no_entities_title:"Keine Adaptive Cover Pro-Entitäten gefunden",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Keine passenden Adaptive Cover Pro-Entitäten",compass_configured:"Konfigurierte Einträge: {entries}",compass_not_found:"Einträge nicht gefunden: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro-Instanz",support_alt:"Kauf mir einen Kaffee",title_optional:"Titel (optional)",title_placeholder:"z. B. Fenster Westseite",north_offset:"Kompass-Nordversatz (°)",north_offset_hint:'Kompass im Uhrzeigersinn drehen, sodass „oben" Ihrer Karte entspricht. Standard: 0.',loading_entries:"Adaptive Cover Pro-Konfigurationseinträge werden geladen…",load_failed:"Konfigurationseinträge konnten nicht geladen werden: {error}",no_entries:"Keine Adaptive Cover Pro-Konfigurationseinträge gefunden. Fügen Sie eine Instanz unter",no_entries_path:"Einstellungen → Geräte & Dienste",no_entries_then:" hinzu und kehren Sie dann zurück.",entry_id_manual_placeholder:"Konfigurations-Eintrags-ID manuell eingeben",entry_id_fallback_label:"Eintrags-ID",unknown_entry:"(unbekannt: {entry})",reset:"Zurücksetzen"},main:{sections:"Abschnitte",sections_hint:"Sichtbare Bereiche der Karte ein- oder ausblenden.",section_sky_label:"Himmelskompass",section_sky_desc:"Sonne vs. Fenster-Sichtfeld, Polardiagramm",section_elevation_label:"Sonne heute",section_elevation_desc:"Höhen-Zeit-Diagramm mit Sichtfeldbereich und aktuellem Zeitcursor",section_decision_label:"Entscheidungsleiste",section_decision_desc:"Alle 10 Pipeline-Handler mit hervorgehobener Gewinnerzeile",section_covers_label:"Beschattungspositionen",section_covers_desc:"Aktuelle und Zielposition je Beschattung; klicken zum Festlegen der Position",section_overrides_label:"Übersteuerungsbereich",section_overrides_desc:"Kacheln für Manuell, Zwang, Bewegung + Zurücksetzen-Schaltfläche",section_climate_label:"Klimabereich",section_climate_desc:"Sommer-/Winter-/Übergangsstrategie; zeigt Bereitschaft, wenn Klimamodus deaktiviert oder inaktiv ist",section_solar_label:"Sonnenberechnung",section_solar_desc:"Aufschlüsselung der Sonnengeometrie (Eingaben → Zwischenwerte → Ausgabe); erfordert den solar_calculation-Sensor der Integration",controls:"Steuerung",controls_hint:"Als schreibgeschützt anzeigen (sichtbar, aber nicht klickbar).",integration_pill_label:"Integration EIN/AUS-Schalter",integration_pill_desc:"Integration über den Karten-Header umschalten.",automatic_pill_label:"Automatische Steuerung-Schalter",automatic_pill_desc:"Automatische Steuerung über den Karten-Header umschalten.",reset_button_label:'Schaltfläche „Manuelle Übersteuerung zurücksetzen"',reset_button_desc:"Zurücksetzen-Kachel im Übersteuerungsbereich betätigen lassen.",display:"Anzeige",compact_label:"Kompaktmodus",compact_desc:"Engerer Abstand zwischen Abschnitten.",show_compass_stats_label:"Kompassstatistiken anzeigen",show_compass_stats_desc:"Azi, Elev, ∠ und Fensterwinkel unterhalb des Himmelskompasses.",show_compass_legend_label:"Kompasslegende anzeigen",show_compass_legend_desc:"Farbschlüssel unterhalb des Himmelskompasses.",show_moon_label:"Mond auf Kompass anzeigen",show_moon_desc:"Mondposition und Mondphase als Überlagerung auf dem Himmelskompass.",hide_inactive_label:"Inaktive Handler ausblenden",hide_inactive_desc:"Nur den Gewinner und aktiv übereinstimmende Pipeline-Handler anzeigen."},tile:{name:"Titel überschreiben",icon:"Symbol überschreiben",cover:"Beschattungsentität",layout:"Layout",show_position:"Position % anzeigen",show_state:"Status anzeigen (Offen/Geschlossen)",show_decision_summary:"Entscheidungszusammenfassung anzeigen",show_controls:"Steuerung ↑■▼ anzeigen",show_badge:"Kontextbadge anzeigen",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Sonnenverfolgung",badge_force:"Zwangsübersteuerung",badge_weather:"Wettersicherheit",badge_manual:"Manuelle Übersteuerung",badge_custom_position:"Benutzerdefinierte Position",badge_motion:"Bewegung",badge_climate:"Klima",badge_glare_zone:"Blendungszone",badge_cloud:"Wolkenunterdrückung",show_compass:"Sonnenkompass im Dialog anzeigen",show_elevation_chart:"Sonne-heute-Diagramm im Dialog anzeigen",show_solar_calc:"Sonnenberechnung im Dialog anzeigen",show_motion_icon:"Bewegungsanzeige einblenden",tap_action:"Tipp-Aktion",hold_action:"Gedrückthalten-Aktion",double_tap_action:"Doppeltippen-Aktion",cover_blank_hint:"Leer lassen, um automatisch die erste verwaltete Beschattung zu verwenden.",layout_option_one_line:"Eine Zeile (kompakt)",layout_option_detailed:"Detailliert (Titel, Status, Indikatoren)"},compass:{instances:"Adaptive Cover Pro-Instanzen",instances_hint:"Eine oder mehrere auswählen. Jeder gewählte Eintrag fügt dem Kompass eine Überlagerung hinzu.",cover_colors:"Beschattungsfarben",cover_colors_hint:"Standardpalettenfarbe für jede Überlagerung überschreiben.",default_color:"Standard",display:"Anzeige",toggle_compact_label:"Kompaktmodus",toggle_compact_desc:"Kleineres SVG, Legende ausgeblendet.",toggle_legend_label:"Legende",toggle_legend_desc:"Farbmuster und Eintragsbezeichnungen unterhalb des Kompasses.",toggle_stats_label:"Statistiken",toggle_stats_desc:"Sonne + numerische Zeilen je Fenster.",toggle_moon_label:"Mond",toggle_moon_desc:"Mondposition und Mondphase anzeigen.",toggle_cardinals_label:"Himmelsrichtungen",toggle_cardinals_desc:"N/O/S/W-Buchstaben rund um den Kompass.",toggle_blind_spot_label:"Blindflecke",toggle_blind_spot_desc:"Schraffierte Sektoren für den Blindfleckbereich jedes Fensters.",toggle_sun_path_label:"Sonnenbahn",toggle_sun_path_desc:"Heutiger Sonnenbogen am Himmel.",toggle_sunrise_sunset_label:"Sonnenaufgangs-/Untergangsmarkierungen",toggle_sunrise_sunset_desc:"Kleine Punkte bei Aufgangs- und Untergangsazimut.",toggle_cover_fill_label:"Schlussfüllbereich der Beschattung",toggle_cover_fill_desc:"Innerer Sektor, der zeigt, wie weit jede Beschattung geschlossen ist.",toggle_window_arrow_label:"Fenster-Normalenpfeil",toggle_window_arrow_desc:"Linie vom Mittelpunkt zum Azimut jedes Fensters.",toggle_elevation_chart_label:"Sonne-heute-Diagramm",toggle_elevation_chart_desc:"Höhen-Zeit-Diagramm unterhalb des Kompasses, mit Sichtfeldbereich und Höhengrenzen."},decision:{title:"Titel (optional)",compact_label:"Kompaktmodus",compact_desc:"Engere Zeilen; blendet inaktive Handler ebenfalls aus.",hide_inactive_handlers_label:"Inaktive Handler ausblenden",hide_inactive_handlers_desc:"Nur den Gewinner und aktiv übereinstimmende Pipeline-Handler anzeigen.",show_decision_summary_label:"Entscheidungszusammenfassung anzeigen",show_decision_summary_desc:'Einen verständlichen Satz „Warum diese Position?" oberhalb der Leiste anzeigen.'},solar_chart:{instances:"Adaptive Cover Pro-Instanzen",instances_hint:"Eine oder mehrere auswählen. Jeder gewählte Eintrag fügt dem Diagramm eine Sichtfeld-Überlagerung hinzu.",cover_colors:"Beschattungsfarben",cover_colors_hint:"Standardpalettenfarbe für jede Überlagerung überschreiben.",default_color:"Standard",display:"Anzeige",toggle_compact_label:"Kompaktmodus",toggle_compact_desc:"Kleineres Diagramm, engerer Abstand."}}}};function Ve(e,t){const i=t.split(".");let s=e;for(const e of i){if("object"!=typeof s||null===s)return;s=s[e]}return"string"==typeof s?s:void 0}function We(e,t){return t?e.replace(/\{(\w+)\}/g,(e,i)=>Object.prototype.hasOwnProperty.call(t,i)?String(t[i]):e):e}function Ue(e,t,i){const s=function(e){const t=(e?.locale?.language??e?.language??"en").toLowerCase().split("-")[0];return t in Le?t:"en"}(t),o=Ve(Le[s],e);if(void 0!==o)return We(o,i);if("en"!==s){const t=Ve(Le.en,e);if(void 0!==t)return We(t,i)}return e}const qe=e=>(...t)=>({_$litDirective$:e,values:t});class Ye{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const He=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),He(e,t);return!0},Qe=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},Ze=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),et(t)}};function Xe(e){void 0!==this._$AN?(Qe(this),this._$AM=e,Ze(this)):this._$AM=e}function Je(e,t=!1,i=0){const s=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(t)if(Array.isArray(s))for(let e=i;e<s.length;e++)He(s[e],!1),Qe(s[e]);else null!=s&&(He(s,!1),Qe(s));else He(this,e)}const et=e=>{2==e.type&&(e._$AP??=Je,e._$AQ??=Xe)};class tt extends Ye{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),Ze(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(He(this,e),Qe(this))}setValue(e){if((()=>void 0===this._$Ct.strings)())this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}const it=[12,16];function st(e,t,i=0){const s=(e-90+i)*Math.PI/180;return{x:t*Math.cos(s),y:t*Math.sin(s)}}function ot(e){return 1-Math.max(0,Math.min(90,e))/90}function nt(e,t,i,s=0,o=0){const n=e=>(e%360+360)%360,r=n(e),a=n(t);let l=a-r;l<0&&(l+=360);const c=l>180?1:0,d=st(r,i,o),h=st(a,i,o);if(s<=0)return`M 0 0 L ${d.x} ${d.y} A ${i} ${i} 0 ${c} 1 ${h.x} ${h.y} Z`;const u=st(a,s,o),p=st(r,s,o);return[`M ${d.x} ${d.y}`,`A ${i} ${i} 0 ${c} 1 ${h.x} ${h.y}`,`L ${u.x} ${u.y}`,`A ${s} ${s} 0 ${c} 0 ${p.x} ${p.y}`,"Z"].join(" ")}function rt(e,t,i=0){return st(e,ot(t),i)}function at(e){return(e%360+360)%360}function lt(e,t,i,s){const o=s??0;let n=-1,r=-1;for(let s=t;s<=i&&s<e.length;s++)e[s].elevation>o&&(-1===n&&(n=s),r=s);return-1===n?null:{wedgeStart:e[n].azimuth,wedgeEnd:e[r].azimuth}}function ct(e,t,i){const s=(e-t)/864e5;return Math.max(0,Math.min(i,s*i))}function dt(e,t,i){return t+(1-(Number.isNaN(e)?0:Math.max(0,Math.min(100,e)))/100)*i}function ht(e,t,i){return((e-t)%360+360)%360<=((i-t)%360+360)%360}function ut(e,t,i,s){return ht(i,e,t)||ht(s,e,t)||ht(e,i,s)||ht(t,i,s)}function pt(e,t,i,s){const o="cover_awning"===t?e/100:1-e/100;return Math.min(i*o,s)}function _t(e,t,i){return e&&null!=t&&Number.isFinite(t)?t===i?null:t:null}function gt(e,t){return e<.5?-4*t*e:4*t*(1-e)}function mt(e,t,i,s,o){const n=st(i,1),r=-n.y,a=n.x,l=e-n.x*s,c=t-n.y*s;return`M ${e} ${t} L ${l+r*o} ${c+a*o} L ${l-r*o} ${c-a*o} Z`}let ft=class extends ce{constructor(){super(...arguments),this.text="",this.cursorX=0,this.cursorY=0,this.offset=it,this.visible=!1,this._x=0,this._y=0}connectedCallback(){super.connectedCallback(),this.hasAttribute("role")||this.setAttribute("role","tooltip")}updated(){if(!this.visible)return;this.setAttribute("aria-hidden","false");const e=this.shadowRoot?.querySelector(".bubble"),t=e?.offsetWidth??0,i=e?.offsetHeight??0,s="undefined"!=typeof window?window.innerWidth:0,o="undefined"!=typeof window?window.innerHeight:0,{x:n,y:r}=function(e){const{cursorX:t,cursorY:i,ttW:s,ttH:o,vpW:n,vpH:r}=e,[a,l]=e.offset??it;let c=t+a,d=!1;c+s>n&&(c=t-a-s,d=!0),c<0&&(c=0);let h=i+l;return h+o>r&&(h=i-l-o),h<0&&(h=0),{x:c,y:h,flipped:d}}({cursorX:this.cursorX,cursorY:this.cursorY,ttW:t,ttH:i,vpW:s,vpH:o,offset:this.offset});n!==this._x&&(this._x=n),r!==this._y&&(this._y=r)}render(){return this.visible?V`<div class="bubble" style="transform: translate3d(${this._x}px, ${this._y}px, 0)">
      ${this.text}
    </div>`:(this.setAttribute("aria-hidden","true"),q)}};ft.styles=r`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100000;
      pointer-events: none;
    }
    :host(:not([visible])) {
      display: none;
    }
    .bubble {
      position: absolute;
      top: 0;
      left: 0;
      width: max-content;
      max-width: 280px;
      padding: 6px 10px;
      border-radius: 6px;
      background: var(--acp-tooltip-bg, rgba(40, 40, 40, 0.96));
      color: var(--acp-tooltip-fg, #fff);
      font-size: 0.78rem;
      line-height: 1.35;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      white-space: normal;
      word-break: break-word;
    }
  `,e([_e({type:String})],ft.prototype,"text",void 0),e([_e({type:Number})],ft.prototype,"cursorX",void 0),e([_e({type:Number})],ft.prototype,"cursorY",void 0),e([_e({attribute:!1})],ft.prototype,"offset",void 0),e([_e({type:Boolean,reflect:!0})],ft.prototype,"visible",void 0),e([ge()],ft.prototype,"_x",void 0),e([ge()],ft.prototype,"_y",void 0),ft=e([he("acp-floating-tooltip")],ft);const vt={enabled:!0,offset:it,delay:400};function yt(e){void 0!==e.enabled&&(vt.enabled=e.enabled),void 0!==e.offset&&(vt.offset=e.offset),void 0!==e.delay&&(vt.delay=e.delay)}const bt="acp-floating-tooltip-bubble",wt=new class{constructor(){this._el=null,this._refs=0}get id(){return bt}retain(){this._refs+=1,this._ensure()}release(){this._refs=Math.max(0,this._refs-1)}_ensure(){if("undefined"==typeof document)return null;if(this._el&&this._el.isConnected)return this._el;const e=document.createElement("acp-floating-tooltip");return e.id=bt,document.body.appendChild(e),this._el=e,e}show(e,t,i,s){const o=this._ensure();o&&(o.text=e,o.cursorX=t,o.cursorY=i,o.offset=s,o.visible=!0)}move(e,t){this._el&&this._el.visible&&(this._el.cursorX=e,this._el.cursorY=t)}hide(){this._el&&(this._el.visible=!1)}_reset(){this._el&&this._el.parentNode&&this._el.parentNode.removeChild(this._el),this._el=null,this._refs=0}},xt=qe(class extends tt{constructor(e){if(super(e),this._el=null,this._text="",this._offset=it,this._delay=400,this._enabled=!0,this._openTimer=null,this._shown=!1,this._retained=!1,this._lastX=0,this._lastY=0,this._onEnter=e=>this._handleEnter(e),this._onMove=e=>this._handleMove(e),this._onLeave=()=>this._dismiss(),this._onFocus=()=>this._handleFocus(),this._onBlur=()=>this._dismiss(),this._onKey=e=>{"Escape"===e.key&&this._dismiss()},this._onScroll=()=>this._dismiss(),6!==e.type)throw new Error("tooltip() can only be used as an element-part directive")}render(e,t){return q}update(e,[t,i]){const s=e.element;return this._text=t??"",this._offset=i?.offset??vt.offset,this._delay=i?.delay??vt.delay,this._enabled=i?.enabled??vt.enabled,this._el!==s?(this._teardown(),this._el=s,this._wire()):this._applyAttributes(),this.render(t,i)}_wire(){const e=this._el;e&&(this._applyAttributes(),this._enabled&&(wt.retain(),this._retained=!0,e.addEventListener("pointerenter",this._onEnter),e.addEventListener("pointermove",this._onMove),e.addEventListener("pointerleave",this._onLeave),e.addEventListener("focusin",this._onFocus),e.addEventListener("focusout",this._onBlur),e.addEventListener("keydown",this._onKey),window.addEventListener("scroll",this._onScroll,!0)))}_applyAttributes(){const e=this._el;e&&(this._enabled?(e.removeAttribute("title"),e.setAttribute("data-tooltip",this._text),e.setAttribute("aria-describedby",wt.id)):(e.removeAttribute("data-tooltip"),e.removeAttribute("aria-describedby"),e.removeAttribute("acp-tt-shown"),e.setAttribute("title",this._text)))}_handleEnter(e){this._lastX=e.clientX,this._lastY=e.clientY,this._armOpen()}_handleFocus(){const e=this._el;if(e&&"function"==typeof e.getBoundingClientRect){const t=e.getBoundingClientRect();this._lastX=t.left+t.width/2,this._lastY=t.bottom}this._armOpen()}_armOpen(){null===this._openTimer&&(this._openTimer=setTimeout(()=>{this._openTimer=null,this._open()},this._delay))}_open(){this._el&&(wt.show(this._text,this._lastX,this._lastY,this._offset),this._shown=!0,this._el.setAttribute("acp-tt-shown",""))}_handleMove(e){this._lastX=e.clientX,this._lastY=e.clientY,this._shown&&wt.move(this._lastX,this._lastY)}_dismiss(){null!==this._openTimer&&(clearTimeout(this._openTimer),this._openTimer=null),this._shown&&(wt.hide(),this._shown=!1),this._el?.removeAttribute("acp-tt-shown")}_teardown(){const e=this._el;e&&(this._dismiss(),e.removeEventListener("pointerenter",this._onEnter),e.removeEventListener("pointermove",this._onMove),e.removeEventListener("pointerleave",this._onLeave),e.removeEventListener("focusin",this._onFocus),e.removeEventListener("focusout",this._onBlur),e.removeEventListener("keydown",this._onKey),"undefined"!=typeof window&&window.removeEventListener("scroll",this._onScroll,!0),this._retained&&(wt.release(),this._retained=!1),this._el=null)}disconnected(){this._teardown()}reconnected(){this._wire()}});function $t(){let e=null;return(t,i,s)=>{const o=i.entry_id??"";if(!o)return e=null,null;const n=null!==e&&e.registry===s&&e.entryId===o,r=n?e.base:At(o,s);if(!r)return e={registry:s,entryId:o,base:null,devices:null,posState:null,ctrlState:null,result:null},null;const a=t.devices,l=r.entities.target_position_sensor,c=r.entities.control_status_sensor,d=l?t.states[l]:void 0,h=c?t.states[c]:void 0;if(n&&null!==e&&null!==e.result&&e.devices===a&&e.posState===d&&e.ctrlState===h)return e.result;const u=Ct(t,o,r);return e={registry:s,entryId:o,base:r,devices:a,posState:d,ctrlState:h,result:u},u}}function kt(){const e=new Map;let t=[],i=[],s={list:[],missing:[]};return(o,n,r,a)=>{const l=n.map(t=>{let i=e.get(t);return i||(i=$t(),e.set(t,i)),i(o,{type:a,entry_id:t},r)});if(e.size>n.length)for(const t of e.keys())n.includes(t)||e.delete(t);const c=t.length===n.length&&t.every((e,t)=>e===n[t])&&i.length===l.length&&i.every((e,t)=>e===l[t]);if(c)return s;t=n.slice(),i=l;const d=[],h=[];return n.forEach((e,t)=>{const i=l[t];i?d.push(i):h.push(e)}),s={list:d,missing:h},s}}function At(e,t){const i={},s=`${e}_`;let o,n=!1;for(const r of t){if(r.config_entry_id!==e)continue;if(r.platform!==Ee)continue;if(n=!0,!o&&r.device_id&&(o=r.device_id),!r.unique_id.startsWith(s))continue;const t=r.unique_id.slice(s.length),a=r.entity_id.split(".")[0],l=Ge[`${a}:${t}`];l&&(i[l]=r.entity_id)}return n&&0!==Object.keys(i).length?{entities:i,deviceId:o}:null}function Ct(e,t,i){const{entities:s,deviceId:o}=i,n=e;let r=t;if(n.devices)for(const e of Object.values(n.devices))if(e.config_entries?.includes(t)){r=e.name_by_user??e.name??t;break}const a=[],l=s.target_position_sensor;if(l){const t=e.states[l]?.attributes?.actual_positions;t&&a.push(...Object.keys(t))}let c,d="cover_blind";const h=s.control_status_sensor;if(h){const t=e.states[h]?.attributes;t?.cover_type&&(d=t.cover_type);const i=t?.cover_discovery;i&&"object"==typeof i&&Array.isArray(i.axes)&&(c=i)}return{entry_id:t,entry_title:r,cover_type:d,entities:s,managed_covers:a,device_id:o,...c?{discovery:c}:{}}}function St(e,t,i){const s=t.entry_id;if(!s)return null;const o=At(s,i);return o?Ct(e,s,o):null}async function Et(e){return e.callWS({type:"config/entity_registry/list"})}function zt(e,t){let i=null,s=!1;return e.connection.subscribeEvents(e=>t(e.data),"entity_registry_updated").then(e=>{s?e():i=e}).catch(()=>{}),()=>{s=!0,i&&i()}}async function Mt(e){const[t,i]=await Promise.all([e.callWS({type:"config_entries/get",domain:Ee}),Et(e)]),s=new Set(i.filter(e=>e.platform===Ee&&null!=e.config_entry_id).map(e=>e.config_entry_id));return t.filter(e=>e.domain===Ee&&s.has(e.entry_id)).map(e=>({entry_id:e.entry_id,title:e.title}))}let Ot=null,It=null;function Ft(){return Ot}function Tt(e,t=!1){if(It)return It;if(!t&&Ot)return Promise.resolve(Ot);const i=Et(e).then(e=>(Ot=e,It=null,e)).catch(e=>{throw It=null,e});return It=i,i}function Pt(e){return`acp-card:registry:v1:${e}`}const Rt={get(e){try{const t=localStorage.getItem(Pt(e));if(!t)return null;const i=JSON.parse(t);return 1!==i.schemaVersion?null:i.entries?.length?"number"==typeof i.fetchedAt&&Date.now()-i.fetchedAt>6e4?null:i:null}catch{return null}},set(e,t){if(0!==t.length)try{const i={schemaVersion:1,cardVersion:fe,fetchedAt:Date.now(),entries:t};localStorage.setItem(Pt(e),JSON.stringify(i))}catch{}},invalidate(e){try{localStorage.removeItem(Pt(e))}catch{}},clear(){try{const e="acp-card:registry:v1:",t=[];for(let i=0;i<localStorage.length;i++){const s=localStorage.key(i);s?.startsWith(e)&&t.push(s)}t.forEach(e=>localStorage.removeItem(e))}catch{}}};function Nt(e){return`${e.entity_id}|${e.unique_id}|${e.platform}|${e.config_entry_id??""}`}function jt(e,t,i){return e.filter(e=>e.config_entry_id===t&&void 0===i)}let Dt=class extends ce{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return V`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        ${xt(this.title)}
        aria-disabled=${this.readonly?"true":q}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};Dt.styles=r`
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
    .pill.readonly {
      cursor: default;
      opacity: 0.85;
    }
    /* Readonly pills aren't clickable, so a help cursor is a useful "hover for
       more" hint; clickable pills keep their pointer cursor (below). The shown
       state reverts to default once OUR bubble appears. */
    .pill.readonly[data-tooltip]:hover {
      cursor: help;
    }
    .pill[data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    .pill.on.readonly {
      opacity: 0.85;
    }
  `,e([_e({type:Boolean})],Dt.prototype,"on",void 0),e([_e({type:Boolean})],Dt.prototype,"readonly",void 0),e([_e({type:String})],Dt.prototype,"label",void 0),e([_e({type:String})],Dt.prototype,"title",void 0),Dt=e([he("acp-header-pill")],Dt);const Bt=qe(class extends Ye{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const s=!!t[e];s===this.st.has(e)||this.nt?.has(e)||(s?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return U}});function Kt(e,t){const i=t.entities.target_position_sensor;if(!i)return null;const s=parseFloat(e.states[i]?.state??"");return Number.isNaN(s)?null:s}function Gt(e,t){const i=t.entities.target_position_sensor;if(!i)return null;const s=e.states[i]?.attributes,o=s?.raw_calculated_position;return"number"==typeof o&&Number.isFinite(o)?o:null}function Lt(e,t){const i=t.entities.target_position_sensor;if(!i)return null;const s=e.states[i]?.attributes;return s?.actual_positions?function(e){const t=Object.values(e).filter(e=>"number"==typeof e);return 0===t.length?null:t.reduce((e,t)=>e+t,0)/t.length}(s.actual_positions):null}function Vt(e,t){const i=t.entities.manual_override_binary;return!!i&&"on"===e.states[i]?.state}function Wt(e,t){const i=Kt(e,t);return _t(Vt(e,t),Gt(e,t),i)??i}function Ut(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var qt,Yt,Ht={exports:{}},Qt=(qt||(qt=1,Yt=Ht,function(){var e=Math.PI,t=Math.sin,i=Math.cos,s=Math.tan,o=Math.asin,n=Math.atan2,r=Math.acos,a=e/180,l=864e5,c=2440588,d=2451545;function h(e){return new Date((e+.5-c)*l)}function u(e){return function(e){return e.valueOf()/l-.5+c}(e)-d}var p=23.4397*a;function _(e,o){return n(t(e)*i(p)-s(o)*t(p),i(e))}function g(e,s){return o(t(s)*i(p)+i(s)*t(p)*t(e))}function m(e,o,r){return n(t(e),i(e)*t(o)-s(r)*i(o))}function f(e,s,n){return o(t(s)*t(n)+i(s)*i(n)*i(e))}function v(e,t){return a*(280.16+360.9856235*e)-t}function y(e){return a*(357.5291+.98560028*e)}function b(i){return i+a*(1.9148*t(i)+.02*t(2*i)+3e-4*t(3*i))+102.9372*a+e}function w(e){var t=b(y(e));return{dec:g(t,0),ra:_(t,0)}}var x={getPosition:function(e,t,i){var s=a*-i,o=a*t,n=u(e),r=w(n),l=v(n,s)-r.ra;return{azimuth:m(l,o,r.dec),altitude:f(l,o,r.dec)}}},$=x.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];x.addTime=function(e,t,i){$.push([e,t,i])};var k=9e-4;function A(t,i,s){return k+(t+i)/(2*e)+s}function C(e,i,s){return d+e+.0053*t(i)-.0069*t(2*s)}function S(e,s,o,n,a,l,c){var d=function(e,s,o){return r((t(e)-t(s)*t(o))/(i(s)*i(o)))}(e,o,n);return C(A(d,s,a),l,c)}function E(e){var s=a*(134.963+13.064993*e),o=a*(93.272+13.22935*e),n=a*(218.316+13.176396*e)+6.289*a*t(s),r=5.128*a*t(o),l=385001-20905*i(s);return{ra:_(n,r),dec:g(n,r),dist:l}}function z(e,t){return new Date(e.valueOf()+t*l/24)}x.getTimes=function(t,i,s,o){var n,r,l,c,d,p=a*-s,_=a*i,m=function(e){return-2.076*Math.sqrt(e)/60}(o=o||0),f=function(t,i){return Math.round(t-k-i/(2*e))}(u(t),p),v=A(0,p,f),w=y(v),x=b(w),E=g(x,0),z=C(v,w,x),M={solarNoon:h(z),nadir:h(z-.5)};for(n=0,r=$.length;n<r;n+=1)d=z-((c=S(((l=$[n])[0]+m)*a,p,_,E,f,w,x))-z),M[l[1]]=h(d),M[l[2]]=h(c);return M},x.getMoonPosition=function(e,o,r){var l=a*-r,c=a*o,d=u(e),h=E(d),p=v(d,l)-h.ra,_=f(p,c,h.dec),g=n(t(p),s(c)*i(h.dec)-t(h.dec)*i(p));return _+=function(e){return e<0&&(e=0),2967e-7/Math.tan(e+.00312536/(e+.08901179))}(_),{azimuth:m(p,c,h.dec),altitude:_,distance:h.dist,parallacticAngle:g}},x.getMoonIllumination=function(e){var s=u(e||new Date),o=w(s),a=E(s),l=149598e3,c=r(t(o.dec)*t(a.dec)+i(o.dec)*i(a.dec)*i(o.ra-a.ra)),d=n(l*t(c),a.dist-l*i(c)),h=n(i(o.dec)*t(o.ra-a.ra),t(o.dec)*i(a.dec)-i(o.dec)*t(a.dec)*i(o.ra-a.ra));return{fraction:(1+i(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},x.getMoonTimes=function(e,t,i,s){var o=new Date(e);s?o.setUTCHours(0,0,0,0):o.setHours(0,0,0,0);for(var n,r,l,c,d,h,u,p,_,g,m,f,v,y=.133*a,b=x.getMoonPosition(o,t,i).altitude-y,w=1;w<=24&&(n=x.getMoonPosition(z(o,w),t,i).altitude-y,p=((d=(b+(r=x.getMoonPosition(z(o,w+1),t,i).altitude-y))/2-n)*(u=-(h=(r-b)/2)/(2*d))+h)*u+n,g=0,(_=h*h-4*d*n)>=0&&(m=u-(v=Math.sqrt(_)/(2*Math.abs(d))),f=u+v,Math.abs(m)<=1&&g++,Math.abs(f)<=1&&g++,m<-1&&(m=f)),1===g?b<0?l=w+m:c=w+m:2===g&&(l=w+(p<0?f:m),c=w+(p<0?m:f)),!l||!c);w+=2)b=r;var $={};return l&&($.rise=z(o,l)),c&&($.set=z(o,c)),l||c||($[p>0?"alwaysUp":"alwaysDown"]=!0),$},Yt.exports=x}()),Ht.exports),Zt=Ut(Qt);const Xt=new Map;function Jt(e,t,i,s=10){const o=`${e},${t},${i.getTime()},${s}`,n=Xt.get(o);if(n)return Xt.delete(o),Xt.set(o,n),n;const r=[],a=i.getTime()+864e5;for(let o=i.getTime();o<=a;o+=60*s*1e3){const i=new Date(o),s=Zt.getPosition(i,e,t);r.push({t:i,elevation:180*s.altitude/Math.PI,azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360})}if(Xt.set(o,r),Xt.size>4){const e=Xt.keys().next().value;void 0!==e&&Xt.delete(e)}return r}function ei(e=new Date){const t=new Date(e);return t.setHours(0,0,0,0),t}function ti(e,t=new Date){if(!e)return ei(t);const i=new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(t),[s,o,n]=i.split("-").map(Number),r=Date.UTC(s,o-1,n,0,0,0),a=function(e,t){const i=new Intl.DateTimeFormat("en-US",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(t),s={};for(const e of i)"literal"!==e.type&&(s[e.type]=Number(e.value));return Date.UTC(s.year,s.month-1,s.day,s.hour,s.minute,s.second)-t.getTime()}(e,new Date(r));return new Date(r-a)}function ii(e,t,i,s){const o=((t-i)%360+360)%360;return((e-o)%360+360)%360<=((((t+s)%360+360)%360-o)%360+360)%360}function si(e,t,i,s){const o=[];let n=-1;for(let r=0;r<e.length;r++){const a=e[r];a.elevation>0&&ii(a.azimuth,t,i,s)?-1===n&&(n=r):-1!==n&&(o.push({startIdx:n,endIdx:r-1}),n=-1)}return-1!==n&&o.push({startIdx:n,endIdx:e.length-1}),o}function oi(e,t,i=new Date){const s=Zt.getMoonPosition(i,e,t),o=Zt.getMoonIllumination(i);return{azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360,elevation:180*s.altitude/Math.PI,phase:o.phase,fraction:o.fraction,phaseName:ni(o.phase)}}function ni(e){return e<.0625||e>=.9375?"New Moon":e<.1875?"Waxing Crescent":e<.3125?"First Quarter":e<.4375?"Waxing Gibbous":e<.5625?"Full Moon":e<.6875?"Waning Gibbous":e<.8125?"Last Quarter":"Waning Crescent"}function ri(e){return null==e||Number.isNaN(e)?"—":`${Math.round(e)}%`}function ai(e){return null==e||Number.isNaN(e)?"—":`${e.toFixed(1)}°`}function li(e,t){if(!e)return"—";const i=new Date(e);return Number.isNaN(i.getTime())?"—":i.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",timeZone:t})}function ci(e,t){if(!e)return"—";const i=new Date(e).getTime();if(Number.isNaN(i))return"—";const s=Math.round((i-Date.now())/1e3);return s<=0?t?Ue("formatters.expired",t):"expired":function(e){if(null==e||Number.isNaN(e))return"—";const t=Math.max(0,Math.round(e));if(t<60)return`${t}s`;const i=Math.floor(t/60);return i<60?`${i}m ${t%60}s`:`${Math.floor(i/60)}h ${i%60}m`}(s)}const di=new Set(["outside_fov","in_fov_not_valid","hitting"]),hi={night:"sun night",hitting:"sun valid",in_fov_not_valid:"sun in-fov",outside_fov:"sun up"};function ui(e){return e.belowHorizon?"night":e.sunState&&di.has(e.sunState)?e.sunState:e.directSunValid?"hitting":e.inFov?"in_fov_not_valid":"outside_fov"}const pi=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function _i(e){const t=pi.length;return pi[(e%t+t)%t]}function gi(e,t){return"string"==typeof e&&e.length>0?{color:e,isOverride:!0}:{color:_i(t),isOverride:!1}}const mi="data:image/png;base64,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",fi=110;let vi=0,yi=class extends ce{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set,this._legendMoonMaskId="acp-legend-moon-"+vi++}shouldUpdate(e){return e.size>1||!e.has("hass")||me(e.get("hass"),this.hass,this._relevantIds())}_relevantIds(){const e=[];for(const t of this.discovered_list){const i=t.entities;e.push(i.sun_sensor,i.target_position_sensor,i.manual_override_binary,i.sun_infront_binary,i.decision_trace_sensor,i.start_sensor,i.end_sensor)}return e}_toggleEntry(e){const t=new Set(this._hiddenEntries);t.has(e)?t.delete(e):t.add(e),this._hiddenEntries=t}_sunFor(e){const t=e.entities.sun_sensor;if(!t)return null;const i=this.hass.states[t];if(!i)return null;const s=parseFloat(i.state);return Number.isNaN(s)?null:{...i.attributes,window_azimuth:i.attributes.window_azimuth}}_sunInfrontFor(e){const t=e.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}_sunDotStateFor(e,t){const i=e.entities.decision_trace_sensor?this.hass.states[e.entities.decision_trace_sensor]?.attributes:void 0;return ui({belowHorizon:t.elevation<=0,sunState:i?.sun_state??null,directSunValid:i?.direct_sun_valid??!1,inFov:!0===t.in_fov})}_readActiveAzimuth(e){if(!e)return null;const t=this.hass.states[e];if(!t)return null;if("unavailable"===t.state||"unknown"===t.state)return null;const i=t.attributes.azimuth;return"number"==typeof i&&Number.isFinite(i)?i:null}_buildOverlays(){const e=[];return this.discovered_list.forEach((t,i)=>{const s=this._sunFor(t);if(!s)return;const o=t.entities.sun_sensor,n=parseFloat(this.hass.states[o]?.state??"0"),{color:r,isOverride:a}=gi(this.coverColors?.[i],i);e.push({d:t,sun:s,sunAzi:n,sunInfront:this._sunInfrontFor(t),dotState:this._sunDotStateFor(t,s),coverPos:Wt(this.hass,t),actualPos:Lt(this.hass,t),coverType:t.cover_type,color:r,isOverride:a,index:i})}),e}render(){if(!this.hass)return q;if(!this.discovered_list||0===this.discovered_list.length)return V`<div class="placeholder">${Ue("compass.placeholder_no_entries",this.hass)}</div>`;const e=this._buildOverlays();if(0===e.length)return V`<div class="placeholder">${Ue("compass.placeholder_no_sun",this.hass)}</div>`;const t=e.filter(e=>!this._hiddenEntries.has(e.d.entry_id)),i=at(this.northOffsetDeg),s=e.length>1,o=e[0],n=o.sunAzi,r=o.sun.elevation,a=rt(n,r,i),l={night:-1,outside_fov:0,in_fov_not_valid:1,hitting:2},c=r<=0?"night":e.reduce((e,t)=>l[t.dotState]>l[e]?t.dotState:e,"outside_fov"),d=hi[c],{latitude:h,longitude:u,time_zone:p}=this.hass.config,_=void 0!==h&&void 0!==u?Jt(h,u,ti(p)):[],g=this.showMoon&&void 0!==h&&void 0!==u?oi(h,u):null,m=null!==g&&g.elevation>0,f=g?gt(g.phase,6):0,v=m?rt(g.azimuth,g.elevation,i):null,y=v?v.x*fi:0,b=v?v.y*fi:0,w=this.showSunPath?function(e){const t=[];let i=-1;for(let s=0;s<e.length;s++)e[s].elevation>0?-1===i&&(i=s):-1!==i&&(t.push({startIdx:i,endIdx:s-1}),i=-1);return-1!==i&&t.push({startIdx:i,endIdx:e.length-1}),t}(_).map(e=>_.slice(e.startIdx,e.endIdx+1).map(e=>{const t=rt(e.azimuth,e.elevation,i);return{x:t.x*fi,y:t.y*fi,elev:e.elevation}})):[],x=[122,127,135],$=[245,197,24],k=e=>{const t=Math.sqrt(Math.max(0,Math.min(1,e/90))),i=x.map((e,i)=>Math.round(e+($[i]-e)*t));return`rgb(${i[0]},${i[1]},${i[2]})`},A=this.showSunPath&&this.showSunriseSunset?w.filter(e=>e.length>1).map((e,t)=>{const i=e[0],s=e[e.length-1],o=s.x-i.x,n=s.y-i.y,r=o*o+n*n||1,a=e.filter((t,i)=>i%6==0||i===e.length-1).map(e=>({offset:100*Math.max(0,Math.min(1,((e.x-i.x)*o+(e.y-i.y)*n)/r)),color:k(e.elev)}));return{id:`sun-path-grad-${t}`,x1:i.x,y1:i.y,x2:s.x,y2:s.y,stops:a}}):[],C=e=>this.showSunriseSunset?`url(#sun-path-grad-${e})`:"var(--warning-color, gold)",S=st(0,124,i),E=st(90,124,i),z=st(180,124,i),M=st(270,124,i),O=st(0,fi,i),I=st(180,fi,i),F=st(90,fi,i),T=st(270,fi,i),P=Ue("compass.sun_tooltip",this.hass,{az:ai(n),el:ai(r)}),R=null!==g?Ue("compass.moon_tooltip",this.hass,{phase:g.phaseName,pct:Math.round(100*g.fraction)}):"",N=Ue("compass.sun_path_tooltip",this.hass);return V`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${W`
            <defs>
              ${m?W`
                <mask id="moon-phase-mask">
                  <circle cx=${y} cy=${b} r=${6} fill="white"></circle>
                  <circle cx=${y+f} cy=${b} r=${6} fill="black"></circle>
                </mask>
              `:q}
              ${A.map(e=>W`
                <linearGradient id=${e.id} gradientUnits="userSpaceOnUse"
                  x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}>
                  ${e.stops.map(e=>W`<stop offset="${e.offset}%" stop-color=${e.color}></stop>`)}
                </linearGradient>
              `)}
            </defs>

            <circle class="grid" r=${fi}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${fi/3}></circle>
            <line class="grid thin" x1=${O.x} y1=${O.y} x2=${I.x} y2=${I.y}></line>
            <line class="grid thin" x1=${F.x} y1=${F.y} x2=${T.x} y2=${T.y}></line>

            ${t.map(e=>this._renderEntryLayers(e,s,i,_))}

            ${this.showSunPath&&w.length?W`<g ${xt(N)}>${w.filter(e=>e.length>1).flatMap((e,t)=>{const i=e.map(e=>`${e.x},${e.y}`).join(" "),s=W`<polyline class="sun-path-line" points=${i}
                        style="stroke:${C(t)}"></polyline>`,o=[];for(let t=0;t<e.length;t+=10){const i=e[t],s=e[Math.max(0,t-1)],n=e[Math.min(e.length-1,t+1)],r=180*Math.atan2(n.y-s.y,n.x-s.x)/Math.PI,a=this.showSunriseSunset?k(i.elev):"var(--warning-color, gold)";o.push(W`<path class="sun-path-chevron"
                          transform=${`translate(${i.x} ${i.y}) rotate(${r})`}
                          d="M -2.4 -3 L 1.8 0 L -2.4 3 L -0.7 0 Z"
                          style=${`fill:${a}`}></path>`)}return[s,...o]})}</g>`:q}

            ${this.showCardinals?W`
              <text class="cardinal" x=${S.x} y=${S.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${z.x} y=${z.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${M.x} y=${M.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:q}

            ${m?W`
              <g ${xt(R)}>
                <circle class="moon-outline" cx=${y} cy=${b} r=${6}></circle>
                <image
                  class="moon-img"
                  href=${mi}
                  x=${y-6}
                  y=${b-6}
                  width=${12}
                  height=${12}
                  mask="url(#moon-phase-mask)"
                ></image>
              </g>
            `:q}

            <g ${xt(P)}>
              <circle class=${d} cx=${a.x*fi} cy=${a.y*fi} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(e,s,d,g):q}
        ${this.showStats?this._renderStats(e,s):q}
      </div>
    `}_renderEntryLayers(e,t,i=0,s=[]){const o=at(e.sun.window_azimuth),n=at(o-e.sun.fov_left),r=at(o+e.sun.fov_right),a=this._readActiveAzimuth(e.d.entities.start_sensor),l=this._readActiveAzimuth(e.d.entities.end_sensor),c=null!==a&&null!==l;let d,h;if(c)({wedgeStart:d,wedgeEnd:h}=function(e,t,i,s,o){const n=((i-s)%360+360)%360,r=s+o,a=((t-n)%360+360)%360,l=e=>e<=r?e:e-r<360-e?r:0,c=l(((e-n)%360+360)%360),d=l(a);return c===d?{wedgeStart:n,wedgeEnd:((n+r)%360+360)%360}:{wedgeStart:((n+Math.min(c,d))%360+360)%360,wedgeEnd:((n+Math.max(c,d))%360+360)%360}}(at(a),at(l),o,e.sun.fov_left,e.sun.fov_right));else{const t=function(e,t,i,s,o){if(void 0===o)return null;const n=at(t-i),r=i+s,a=e.filter(e=>((e.azimuth-n)%360+360)%360<=r&&e.elevation>o);return 0===a.length?null:{wedgeStart:a[0].azimuth,wedgeEnd:a[a.length-1].azimuth}}(s,o,e.sun.fov_left,e.sun.fov_right,e.sun.min_elevation);d=t?t.wedgeStart:n,h=t?t.wedgeEnd:r}const u=st(o,fi,i),{outer:p,inner:_}=(g=e.sun.min_elevation,m=e.sun.max_elevation,f=fi,void 0!==g&&void 0!==m&&g>m?{outer:f,inner:0}:{outer:void 0!==g?f*ot(g):f,inner:void 0!==m?f*ot(m):0});var g,m,f;const v=null!==e.coverPos?pt(e.coverPos,e.coverType,fi,p):null,y=null!==e.actualPos?pt(e.actualPos,e.coverType,fi,p):null,b=e.sun.blind_spot_range?[at((w=o)-(x=e.sun.blind_spot_range)[1]),at(w-x[0])]:null;var w,x;const $=b?nt(b[0],b[1],fi,0,i):null,k=nt(d,h,p,_,i),A=c&&(d!==n||h!==r),C=A?nt(n,r,p,_,i):"",S=null!==v&&v>_?nt(d,h,v,_,i):"",E=null!==y&&y>_?nt(d,h,y,_,i):"",z=[];for(const t of si(s,o,e.sun.fov_left,e.sun.fov_right)){const o=lt(s,t.startIdx,t.endIdx,e.sun.min_elevation);o&&!ut(o.wedgeStart,o.wedgeEnd,d,h)&&z.push({fov:nt(o.wedgeStart,o.wedgeEnd,p,_,i),cover:this.showCoverFill&&null!==v&&v>_?nt(o.wedgeStart,o.wedgeEnd,v,_,i):"",actual:this.showCoverFill&&null!==y&&y>_?nt(o.wedgeStart,o.wedgeEnd,y,_,i):"",from:o.wedgeStart,to:o.wedgeEnd})}const M=t?`${e.d.entry_title}: `:"",O=void 0!==e.sun.min_elevation||void 0!==e.sun.max_elevation?Ue("compass.elev_suffix",this.hass,{min:ai(e.sun.min_elevation??0),max:ai(e.sun.max_elevation??90)}):"",I=c?`${M}${Ue("compass.active_sun_arc",this.hass,{from:ai(d),to:ai(h),elev:O})}`:`${M}${Ue("compass.fov_arc",this.hass,{left:ai(e.sun.fov_left),right:ai(e.sun.fov_right),elev:O})}`,F=`${M}${Ue("compass.window_normal_tooltip",this.hass,{bearing:ai(o)})}`,T=[];if(null!==e.coverPos){const t="cover_awning"===e.coverType?"compass.cover_position_target_awning":"compass.cover_position_target";T.push(`${M}${Ue(t,this.hass,{pct:e.coverPos})}`),null!==e.actualPos&&T.push(Ue("compass.cover_position_actual",this.hass,{pct:Math.round(e.actualPos)}))}const P=T.join("\n"),R=b?`${M}${Ue("compass.blind_spot",this.hass,{from:ai(b[0]),to:ai(b[1])})}`:"",N=t||e.isOverride,j=t||e.isOverride,D=N?`fill: ${e.color}; stroke: ${e.color};`:"",B=j?`fill: ${e.color}; stroke: ${e.color};`:"",K=N?`fill: ${e.color}; stroke: ${e.color};`:"",G=N?`stroke: ${e.color};`:"",L=N?`fill: ${e.color};`:"",V=this.showCoverFill&&""!==S,U=this.showBlindSpot&&!!$,Y=this.showWindowArrow,H=`M 0 0 L ${u.x} ${u.y}`,Q=N?`fill: ${e.color}; stroke: ${e.color};`:"",Z=mt(u.x,u.y,o+i,9,5),X="display: none;",J=`${M}${Ue("compass.fov_arc",this.hass,{left:ai(e.sun.fov_left),right:ai(e.sun.fov_right),elev:O})}`;return W`<g class="entry-overlay">
      ${A?W`<g ${xt(J)}>
              <path class="fov fov-static" style=${D} d=${C}></path>
            </g>`:q}
      <g ${xt(I)}>
        <path class="fov" style=${D} d=${k}></path>
      </g>
      ${z.map(e=>{const t=`${M}${Ue("compass.active_sun_arc",this.hass,{from:ai(e.from),to:ai(e.to),elev:O})}`;return W`<g ${xt(t)}>
          <path class="fov-extra" style=${D} d=${e.fov}></path>
          ${e.cover?W`<path class="cover-fill-extra" style=${B} d=${e.cover}></path>`:q}
          ${e.actual?W`<path class="cover-actual-extra" style=${B} d=${e.actual}></path>`:q}
        </g>`})}
      <g class="arrow-group" style=${Y?"":X} ${xt(F)}>
        <path class="window" style=${G} d=${H}></path>
        <path class="window-head" style=${Q} d=${Z}></path>
        <circle class="window-base" style=${L} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" style=${V?"":X} ${xt(P)}>
        <path class="cover-fill" style=${B} d=${S}></path>
        ${this.showCoverFill&&E?W`<path class="cover-actual" style=${B} d=${E}></path>`:q}
      </g>
      <g class="blind-group" style=${U?"":X} ${xt(R)}>
        <path class="blind-spot" style=${K} d=${$??""}></path>
      </g>
    </g>`}_legendSunGlyph(e){return V`<span class="glyph"
      ><svg viewBox="-8 -8 16 16" width="20" height="20">
        ${W`<circle class=${e} cx="0" cy="0" r="5"></circle>`}
      </svg></span
    >`}_legendMoonGlyph(e){const t=e?gt(e.phase,4):0,i=this._legendMoonMaskId;return V`<span class="glyph"
      ><svg viewBox="-5 -5 10 10" width="11" height="11">
        ${W`
          <defs>
            <mask id=${i}>
              <circle cx="0" cy="0" r=${4} fill="white"></circle>
              <circle cx=${t} cy="0" r=${4} fill="black"></circle>
            </mask>
          </defs>
          <circle class="moon-outline" cx="0" cy="0" r=${4}></circle>
          <image
            class="moon-img"
            href=${mi}
            x=${-4}
            y=${-4}
            width=${8}
            height=${8}
            mask=${`url(#${i})`}
          ></image>
        `}
      </svg></span
    >`}_legendWindowGlyph(e){const t=e?`stroke: ${e};`:"",i=e?`fill: ${e};`:"",s=mt(5,0,90,4,2);return V`<span class="glyph"
      ><svg class="window-glyph" viewBox="-6 -6 12 12" width="13" height="13">
        ${W`
          <line class="window" style=${t} x1="-5" y1="0" x2="1.5" y2="0"></line>
          <path class="window-head" style=${i} d=${s}></path>
        `}
      </svg></span
    >`}_renderLegend(e,t,i,s){const o=e[0]?.isOverride?e[0].color??null:null,n=e[0],r=null!==n?.coverPos&&null!=n?.actualPos&&void 0!==n?.coverPos&&Math.round(n.actualPos)!==Math.round(n.coverPos);return t?V`
        <div class="legend">
          <div>${this._legendSunGlyph(i)} ${Ue("compass.sun",this.hass)}</div>
          ${this.showMoon?V`<div>${this._legendMoonGlyph(s)} ${Ue("compass.moon",this.hass)}</div>`:q}
          ${e.map(e=>V`
              <button
                type="button"
                class=${Bt({"entry-toggle":!0,hidden:this._hiddenEntries.has(e.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(e.d.entry_id)}
                @click=${()=>this._toggleEntry(e.d.entry_id)}
              >
                <span class="licell"
                  ><span class="swatch entry" style="background: ${e.color}"></span
                ></span>
                ${e.d.entry_title}
                ${e.sunInfront?V`<span class="status valid">${Ue("compass.in_fov_check",this.hass)}</span>`:e.sun.in_fov?V`<span class="status in-fov">${Ue("compass.in_fov",this.hass)}</span>`:V`<span class="status">${Ue("compass.none",this.hass)}</span>`}
              </button>
            `)}
        </div>
      `:V`<div class="legend">
      <div>${this._legendSunGlyph(i)} ${Ue("compass.sun",this.hass)}</div>
      ${this.showMoon?V`<div>${this._legendMoonGlyph(s)} ${Ue("compass.moon",this.hass)}</div>`:q}
      <div>
        <span class="licell"
          ><span
            class="swatch fov"
            style=${o?`background: ${o}`:""}
          ></span
        ></span>
        ${Ue("compass.window_fov",this.hass)}
      </div>
      ${this.showCoverFill?V`<div>
            <span class="licell"
              ><span
                class="swatch cover-fill-swatch"
                style=${o?`background: ${o}`:""}
              ></span
            ></span>
            ${Ue("compass.cover_target",this.hass)}
          </div>`:q}
      ${this.showCoverFill&&r?V`<div>
            <span class="licell"
              ><span
                class="swatch cover-actual-swatch"
                style=${o?`border-color: ${o}`:""}
              ></span
            ></span>
            ${Ue("compass.cover_held",this.hass)}
          </div>`:q}
      ${this.showWindowArrow?V`<div>
            ${this._legendWindowGlyph(o)} ${Ue("compass.window_normal",this.hass)}
          </div>`:q}
    </div>`}_renderStats(e,t){const i=e[0],s=i.sunAzi,o=i.sun.elevation,{latitude:n,longitude:r}=this.hass.config,a=this.showMoon&&void 0!==n&&void 0!==r?oi(n,r):null;return t?V`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${Ue("compass.stat_sun",this.hass)}${ai(s)} /
              ${ai(o)}</span
            >
            ${this.showMoon&&a?V`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:q}
          </div>
          ${e.map(e=>V`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${e.color}"></span>
                <span class="entry-name">${e.d.entry_title}</span>
                <span>∠${ai(e.sun.gamma)}</span>
                <span>W ${ai(at(e.sun.window_azimuth))}</span>
                ${e.sun.in_fov?V`<span
                      class="status in-fov"
                      ${xt(Ue("compass.in_fov_tooltip",this.hass))}
                      >✓</span
                    >`:q}
              </div>
            `)}
        </div>
      `:V`<div class="stats dim">
      <span>${Ue("compass.stat_azi",this.hass)}${ai(s)}</span>
      <span>${Ue("compass.stat_elev",this.hass)}${ai(o)}</span>
      <span>∠: ${ai(i.sun.gamma)}</span>
      <span
        >${Ue("compass.stat_window",this.hass)}${ai(at(i.sun.window_azimuth))}</span
      >
      ${this.showMoon&&a?V`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:q}
    </div>`}};function bi(e){let t=null,i=null;const s=6e4-Date.now()%6e4;return t=setTimeout(()=>{t=null,e(),i=setInterval(e,6e4)},s),()=>{null!==t&&(clearTimeout(t),t=null),null!==i&&(clearInterval(i),i=null)}}yi.styles=r`
    :host {
      display: block;
      width: 100%;
      container-type: inline-size;
    }
    .compass {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    /* Plot SVG only — scoped to the direct child of .compass so these sizing
       rules never cascade onto the small inline legend glyph SVGs (which size
       themselves via their width/height attributes). */
    .compass > svg {
      width: 100%;
      max-width: 260px;
      height: auto;
      display: block;
    }
    :host([compact]) .compass > svg {
      max-width: 180px;
    }
    :host([compact]) .legend {
      display: none;
    }
    @container (min-width: 320px) {
      .compass {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }
      .compass > svg {
        max-width: none;
        flex: 1 1 0;
        min-width: 200px;
      }
      :host([compact]) .compass > svg {
        max-width: 280px;
      }
      .compass .legend,
      .compass .stats {
        flex: 0 1 auto;
        min-width: 0;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }
      /* Match the stats column's row rhythm to the legend's so the two side-by-
         side columns share the same vertical spacing: same row gap as .legend
         (12px) and the same per-row height as the legend's 20px icon cell, with
         the stat text vertically centred in that height. */
      .compass .stats {
        gap: 12px;
      }
      .compass .stats-row,
      .compass .stats > span {
        justify-content: flex-start;
        min-height: 20px;
        display: flex;
        align-items: center;
      }
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
    .fov,
    .fov-extra {
      /* Default (single-entry, no override): a lighter, more-transparent shade
         of the cover colour — same identity as the cover wedge, just fainter —
         matching how multi-entry/override mode already colours the FOV. Keeping
         it off gold lets the gold sun dot read clearly against it. */
      fill: var(--primary-color);
      fill-opacity: 0.22;
      stroke: var(--primary-color);
      stroke-width: 1;
      stroke-opacity: 0.7;
      transition:
        fill 0.3s ease,
        fill-opacity 0.3s ease,
        stroke 0.3s ease,
        stroke-opacity 0.3s ease;
    }
    /* Static FOV envelope shown dim beneath the active sun arc — lets the
       reader see the configured ±fov_left/right span at the same time as
       today's reachable sub-arc. */
    .fov.fov-static {
      fill-opacity: 0.07;
      stroke-opacity: 0.25;
      stroke-dasharray: 4 3;
    }
    .cover-fill,
    .cover-fill-extra {
      fill: var(--primary-color);
      fill-opacity: 0.3;
      stroke: var(--primary-color);
      stroke-width: 1;
      stroke-opacity: 0.6;
      transition:
        fill 0.3s ease,
        fill-opacity 0.3s ease,
        stroke 0.3s ease,
        stroke-opacity 0.3s ease;
    }
    /* Live/actual cover position drawn over the solid target wedge: same fill
       colour but fainter and dashed, so when actual == target it disappears
       into the target wedge and only a divergence reads as a second ring. */
    .cover-actual,
    .cover-actual-extra {
      fill: var(--primary-color);
      fill-opacity: 0.15;
      stroke: var(--primary-color);
      stroke-width: 1;
      stroke-opacity: 0.6;
      stroke-dasharray: 3 2;
      transition:
        fill 0.3s ease,
        fill-opacity 0.3s ease,
        stroke 0.3s ease,
        stroke-opacity 0.3s ease;
    }
    .blind-spot {
      fill: var(--error-color, crimson);
      fill-opacity: 0.12;
      stroke: var(--error-color, crimson);
      stroke-dasharray: 3 3;
    }
    .window {
      fill: none;
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
      transition: fill 0.3s ease;
    }
    .sun.up {
      /* outside FOV, above horizon — light yellow */
      fill: #ffe680;
    }
    .sun.in-fov {
      /* in FOV but not hitting — plain gold (no glow) */
      fill: var(--warning-color, gold);
    }
    .sun.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 4px var(--warning-color, gold));
    }
    .sun.night {
      /* below horizon — dim grey */
      fill: var(--secondary-text-color);
      opacity: 0.55;
    }
    .legend {
      display: flex;
      gap: 12px;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      flex-wrap: wrap;
      justify-content: center;
    }
    /* Centre each glyph/swatch row against its label so larger glyphs (the sun)
       stay vertically aligned — vertical-align:middle drifts as the glyph grows.
       The cover-entry rows are buttons that already do this; these are the
       plain sun/moon/window/FOV rows. The glyph/swatch margin-right keeps the
       gap between icon and text. */
    .legend > div {
      display: flex;
      align-items: center;
    }
    button.entry-toggle {
      background: none;
      border: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    button.entry-toggle.hidden {
      opacity: 0.45;
      text-decoration: line-through;
    }
    .legend .status {
      margin-left: 4px;
      opacity: 0.8;
    }
    .legend .status.valid {
      color: var(--warning-color, gold);
    }
    .legend .status.in-fov {
      color: var(--state-active-color, orange);
    }
    .dot,
    .swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .swatch.fov {
      background: var(--warning-color, gold);
      opacity: 0.4;
      border-radius: 2px;
    }
    .swatch.entry {
      border-radius: 2px;
      opacity: 0.9;
    }
    /* Uniform fixed-width icon cell shared by every legend row's leading icon —
       glyph wrappers (.glyph: live sun, phased moon, window arrow) and swatch
       wrappers (.licell). Centring each icon in a constant-width cell keeps all
       labels left-aligned in a column even though the glyphs differ in size
       (the sun is intentionally the largest). The cell is a fixed flex item of
       the flex legend rows; overflow stays visible so the sun's glow isn't
       clipped. */
    .glyph,
    .licell {
      flex: 0 0 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 6px;
    }
    .glyph svg {
      /* Size comes from each glyph's own width/height attributes; display:block
         inside the inline-block wrapper avoids inline-descender spacing. The
         explicit min/max-width reset guards against any ancestor svg rule. */
      display: block;
      overflow: visible;
      min-width: 0;
      max-width: none;
    }
    /* The legend arrow reuses the plot's .window stroke colour but the plot's
       stroke-width: 3 is far too heavy for the 12-unit glyph viewBox — scope a
       proportional shaft width here so it reads as a slim arrow, not a blob. */
    .window-glyph .window {
      stroke-width: 1.6;
    }
    /* Arrowhead on the legend window-azimuth glyph (and matched on the plotted
       window line); follows the override colour via inline style when set. */
    .window-head {
      fill: var(--primary-color);
    }
    .swatch.cover-fill-swatch {
      background: var(--primary-color);
      /* The cover wedge is drawn ON TOP of the FOV wedge in the same arc, so the
         visible cover region is the two fills composited: the FOV's 0.22 plus the
         cover's 0.30 → 1 − (1−0.22)(1−0.30) ≈ 0.45. Matching that here keeps the
         legend swatch the same darker shade the reader sees in the plot. */
      opacity: 0.45;
      border-radius: 2px;
    }
    /* Mirrors the dashed, faint .cover-actual held ring: a near-transparent fill
       inside a dashed primary-colour border, so the legend swatch reads like the
       second (held) ring rather than the solid target wedge (#158). */
    .swatch.cover-actual-swatch {
      background: color-mix(in srgb, var(--primary-color) 15%, transparent);
      border: 1px dashed var(--primary-color);
      border-radius: 2px;
      box-sizing: border-box;
    }
    .dot.rise-dot {
      background: var(--warning-color, gold);
      opacity: 0.75;
    }
    .dot.set-dot {
      background: var(--secondary-text-color);
      opacity: 0.55;
    }
    .stats {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.78rem;
      align-items: center;
    }
    .stats-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .entry-row .entry-name {
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .entry-row .status.in-fov {
      color: var(--state-active-color, orange);
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 20px;
    }
    /* The sun path is a thin spine + directional block-arrow chevrons per
       above-horizon run. The spine carries the per-run gradient (sunrise gold →
       sunset grey, see sunPathGradients in render) and sits faint beneath the
       chevrons, which point in the direction of the sun's travel. */
    .sun-path-line {
      fill: none;
      stroke-width: 1;
      stroke-linecap: round;
      opacity: 0.45;
    }
    .sun-path-chevron {
      stroke: none;
      opacity: 0.95;
    }
    .moon-outline {
      fill: none;
      stroke: var(--secondary-text-color);
      stroke-width: 0.8;
      opacity: 0.5;
    }
    /* Photographic moon disc, clipped to the lit fraction by moon-phase-mask. */
    .moon-img {
      opacity: 0.95;
    }
    /* Floating-tooltip cursor lifecycle: a help cursor hints "there's more
       here" on hover (SVG groups + the in-FOV status pip), flipping to default
       the moment OUR bubble appears. */
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
  `,e([_e({attribute:!1})],yi.prototype,"hass",void 0),e([_e({attribute:!1})],yi.prototype,"discovered_list",void 0),e([_e({type:Boolean,reflect:!0})],yi.prototype,"compact",void 0),e([_e({attribute:!1})],yi.prototype,"showStats",void 0),e([_e({attribute:!1})],yi.prototype,"showLegend",void 0),e([_e({attribute:!1})],yi.prototype,"showMoon",void 0),e([_e({attribute:!1})],yi.prototype,"showCardinals",void 0),e([_e({attribute:!1})],yi.prototype,"showBlindSpot",void 0),e([_e({attribute:!1})],yi.prototype,"showSunPath",void 0),e([_e({attribute:!1})],yi.prototype,"showSunriseSunset",void 0),e([_e({attribute:!1})],yi.prototype,"showCoverFill",void 0),e([_e({attribute:!1})],yi.prototype,"showWindowArrow",void 0),e([_e({attribute:!1})],yi.prototype,"coverColors",void 0),e([_e({attribute:!1})],yi.prototype,"northOffsetDeg",void 0),e([ge()],yi.prototype,"_hiddenEntries",void 0),yi=e([he("acp-sky-compass")],yi);const wi=32,xi=864e5;function $i(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}let ki=class extends ce{constructor(){super(...arguments),this.discoveredList=[],this.coverColors=[],this.compact=!1,this._cancelMinuteTimer=null}connectedCallback(){super.connectedCallback(),this._cancelMinuteTimer=bi(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._cancelMinuteTimer?.(),this._cancelMinuteTimer=null}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),i=[];for(const e of this.discoveredList){const t=e.entities;i.push(t.sun_sensor,t.decision_trace_sensor,t.control_status_sensor)}return me(t,this.hass,i)}_sunAttrsFor(e){const t=e.entities.sun_sensor;if(!t)return null;const i=this.hass.states[t];return i?i.attributes:null}_sunDotTraceInputs(){const e=this.discoveredList[0]?.entities.decision_trace_sensor,t=e?this.hass.states[e]?.attributes:void 0;return{sunState:t?.sun_state??null,directSunValid:t?.direct_sun_valid??!1}}_scheduleBounds(){const e=this.discoveredList[0]?.entities.control_status_sensor;if(!e)return null;const t=this.hass.states[e]?.attributes;return t?{start:$i(t.schedule_start),end:$i(t.schedule_end)}:null}render(){if(!this.hass||0===this.discoveredList.length)return q;const e=this._sunAttrsFor(this.discoveredList[0]),{latitude:t,longitude:i,time_zone:s}=this.hass.config??{};if(void 0===t||void 0===i||!e)return V`<div class="placeholder">${Ue("elevation.placeholder",this.hass)}</div>`;const o=ti(s),n=Jt(t,i,o),r=new Date,a=e=>{const t=e.getTime()-o.getTime();return wi+t/864e5*360},l=e=>138-(e- -10)/100*128,c=n.map(e=>`${a(e.t).toFixed(1)},${l(e.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(r),u=this._interpAt(n,r),p=u?l(u.elevation):null,_=!u||u.elevation<=0,g=this._sunDotTraceInputs(),m=hi[ui({belowHorizon:_,sunState:g.sunState,directSunValid:g.directSunValid,inFov:!0===e.in_fov})].replace(/^sun /,""),f=e=>138-128*e,v=this.discoveredList.length>1,y=this._scheduleBounds(),b=y?function(e,t,i,s){if(!e&&!t)return{offSchedule:[],bars:[]};const o=e=>(e.getTime()-i)/s,n=e=>Math.max(0,Math.min(1,e)),r=e=>n(e),a=e=>e>1?e-Math.floor(e):n(e),l=e=>e>0&&e<1?[e]:[];if(e&&!t){const t=o(e);return{offSchedule:[{x0:0,x1:r(t)}],bars:l(t)}}if(!e&&t){const e=o(t);return{offSchedule:[{x0:a(e),x1:1}],bars:l(e)}}const c=o(e),d=o(t),h=r(c),u=a(d),p=[...l(c),...l(d)];if(h>u)return{offSchedule:[{x0:u,x1:h}],bars:p};const _=[];return h>0&&_.push({x0:0,x1:h}),u<1&&_.push({x0:u,x1:1}),{offSchedule:_,bars:p}}(y.start,y.end,o.getTime(),xi):{offSchedule:[],bars:[]},w=e=>wi+360*e,x=b.offSchedule.map(e=>({x:w(e.x0),width:w(e.x1)-w(e.x0)})),$=y?.start&&o?(y.start.getTime()-o.getTime())/xi:null,k=b.bars.map(e=>{const t=null!==$&&Math.abs(e-$)<1e-9?y.start.toISOString():y.end.toISOString(),i=null!==$&&Math.abs(e-$)<1e-9,o=w(e);return{x:o,anchor:o>=391?"end":o<=33?"start":"middle",label:li(t,s),tooltip:Ue(i?"elevation.schedule_start_tooltip":"elevation.schedule_end_tooltip",this.hass)}}),A=(()=>{if(!y)return null;const e=y.start?li(y.start.toISOString(),s):null,t=y.end?li(y.end.toISOString(),s):null;return e&&t?Ue("elevation.schedule",this.hass,{from:e,to:t}):e?Ue("elevation.schedule_from",this.hass,{from:e}):t?Ue("elevation.schedule_until",this.hass,{to:t}):null})(),C=this.discoveredList.map((e,t)=>{const i=this._sunAttrsFor(e),{color:o,isOverride:r}=gi(this.coverColors?.[t],t),l=r;if(!i)return{d:e,runs:[],inPlotBands:[],runBars:[],label:"",color:o,inlineFill:l};const c=si(n,i.window_azimuth,i.fov_left,i.fov_right),d="number"==typeof i.min_elevation,h="number"==typeof i.max_elevation,{loFrac:u,hiFrac:p}=function(e,t){if(void 0!==e&&void 0!==t&&e>t)return{loFrac:0,hiFrac:1};const i=e=>Math.max(0,Math.min(1,(e- -10)/100));return{loFrac:void 0!==e?i(e):0,hiFrac:void 0!==t?i(t):1}}(i.min_elevation,i.max_elevation),_=d||h?f(p):10,g=d||h?f(u):138,m=_,y=Math.max(0,g-_),b=c.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),y:m,height:y})),w=c.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),range:`${li(n[e.startIdx].t.toISOString(),s)} → ${li(n[e.endIdx].t.toISOString(),s)}`})),x=c.map(e=>`${li(n[e.startIdx].t.toISOString(),s)} → ${li(n[e.endIdx].t.toISOString(),s)}`).join(", "),$=[];return v||(d&&$.push(g),h&&$.push(_)),{d:e,runs:c,inPlotBands:b,runBars:w,label:x,color:o,inlineFill:l,limitLines:$}}),S=C.some(e=>e.runs.length>0),E=v?function(e){if(e<=0)return{rows:[],height:0};const t=Array.from({length:e},(e,t)=>({y:0+11*t,height:8}));return{rows:t,height:0+8*e+3*(e-1)+0}}(C.length):{rows:[],height:0},z=138-E.height-3;return V`
      <div class="wrap">
        <div class="head">
          <span class="label">${Ue("elevation.title",this.hass)}</span>
          <span class="head-meta">
            ${v?q:S?V`<span class="dim"
                      >${Ue("elevation.fov_windows",this.hass,{windows:C[0].label})}</span
                    >`:V`<span class="dim">${Ue("elevation.no_fov_today",this.hass)}</span>`}
            ${A?V`<span class="dim schedule">${A}</span>`:q}
          </span>
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${W`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(e=>W`
              <line class="grid" x1=${wi} y1=${l(e)} x2=${392} y2=${l(e)} />
              <text class="tick" x=${28} y=${l(e)+3} text-anchor="end">${e}°</text>
            `)}

            <!-- horizon -->
            <line class="horizon" x1=${wi} y1=${d} x2=${392} y2=${d} />

            <!-- elevation limit gridlines (single-window legacy path only) -->
            ${C.flatMap(e=>(e.limitLines??[]).map(e=>W`<line class="limit-line" x1=${wi} y1=${e} x2=${392} y2=${e} />`))}

            <!-- In-plot FOV bands: single-window legacy path only. -->
            ${v?q:C.flatMap(e=>e.inPlotBands.map(t=>W`<rect
                        class="fov-band"
                        x=${t.x0}
                        y=${t.y}
                        width=${t.x1-t.x0}
                        height=${t.height}
                        style=${e.inlineFill?`fill:${e.color}`:q}
                      />`))}

            <!-- Per-window FOV ribbon (multi-window only): one row per window,
                 a faint full-width track plus color-keyed bars for in-FOV runs,
                 sharing the plot's xAt() time scale. Overlaid as a band anchored
                 to the bottom of the plot; drawn BEFORE the curve so the blue
                 curve stays crisp on top. -->
            ${E.rows.flatMap((e,t)=>{const i=C[t],s=z+e.y,o=i.runs.length?i.d.entry_title:Ue("elevation.fov_window_named",this.hass,{name:i.d.entry_title,windows:Ue("elevation.no_fov_today",this.hass)}),n=W`<rect
                class="ribbon-track"
                x=${wi}
                y=${s}
                width=${360}
                height=${e.height}
                rx="2"
                ${xt(o)}
              ></rect>`,r=i.runBars.map(t=>W`<rect
                  class="ribbon-bar"
                  x=${t.x0}
                  y=${s}
                  width=${t.x1-t.x0}
                  height=${e.height}
                  rx="2"
                  style=${`fill:${i.color}`}
                  ${xt(Ue("elevation.fov_window_named",this.hass,{name:i.d.entry_title,windows:t.range}))}
                ></rect>`);return[n,...r]})}

            <!-- Schedule window overlay (issue #128): faint off-schedule gray
                 zone(s) + thin start/end bars with a clock-time tick. Rendered
                 PRE-CURVE so the sun curve and now-line paint on top. The tick
                 label sits slightly higher than the axis ticks (its own class)
                 so it doesn't read as an axis tick. -->
            ${x.map(e=>W`<rect
                class="off-schedule-zone"
                x=${e.x}
                y=${10}
                width=${e.width}
                height=${128}
              />`)}
            ${k.flatMap(e=>[W`<line
                class="schedule-bar"
                x1=${e.x}
                y1=${10}
                x2=${e.x}
                y2=${138}
                ${xt(e.tooltip)}
              ></line>`,W`<text
                class="schedule-tick"
                x=${e.x}
                y=${17}
                text-anchor=${e.anchor}
              >${e.label}</text>`])}

            <!-- elevation curve (drawn after the ribbon so it sits on top) -->
            <polyline class="curve" points=${c} />

            <!-- current-time cursor + sun dot, drawn last so they sit on top of
                 the curve AND the ribbon bars. A wide transparent hit-line widens
                 the hover target so the thin now-line is easy to tooltip. -->
            <g class="now-group" ${xt(li(r.toISOString(),s))}>
              <line class="now-hit" x1=${h} y1=${10} x2=${h} y2=${138} />
              <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />
            </g>
            ${null!==p?W`<circle class="sun-dot ${m}" cx=${h} cy=${p} r="4" />`:q}

            <!-- x-axis gridlines + time labels at every 6h, drawn last so the
                 axis sits on the topmost layer (nothing paints over the times).
                 Edge labels anchor inward (start at 00:00, end at 24:00) so they
                 don't clip past the viewBox. -->
            ${[0,6,12,18,24].map(e=>{const t=new Date(o.getTime()+36e5*e),i=0===e?"start":24===e?"end":"middle";return W`
                <line class="grid faint" x1=${a(t)} y1=${10} x2=${a(t)} y2=${138} />
                <text class="tick" x=${a(t)} y=${152} text-anchor=${i}>${e.toString().padStart(2,"0")}:00</text>
              `})}
          `}
        </svg>
      </div>
    `}_interpAt(e,t){if(0===e.length)return null;const i=t.getTime();if(i<=e[0].t.getTime())return e[0];if(i>=e[e.length-1].t.getTime())return e[e.length-1];for(let s=1;s<e.length;s++)if(e[s].t.getTime()>=i){const o=e[s-1],n=e[s],r=(i-o.t.getTime())/(n.t.getTime()-o.t.getTime());return{t:t,elevation:o.elevation+(n.elevation-o.elevation)*r,azimuth:o.azimuth+(n.azimuth-o.azimuth)*r}}return e[e.length-1]}};function Ai(e,t){if(!0===e?.custom_position_minimum_mode&&Array.isArray(e.custom_position_slots)&&void 0!==e.custom_position_active_slot){const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);if(void 0!==t&&null!==t.position&&void 0!==t.position)return t.position}return t}function Ci(e){if(void 0===e?.custom_position_active_slot||!Array.isArray(e.custom_position_slots))return!1;const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);return 100===t?.priority}function Si(e){const t=e.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(t))return"custom_position";switch(t){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return t}}function Ei(e,t,i,s=Me,o="Safety"){const n=new Map;for(const t of e){if(!t.matched)continue;const e=Si(t.handler);ze.includes(e)&&n.set(e,t)}const r=[...ze].reverse().filter(e=>n.has(e));return 0===r.length?t.reason??"":r.map(e=>function(e,t,i,s,o){const n=s[e]??e,r=t.position,a=null==r?"":` ${ri(r)}`;if("custom_position"!==e)return`${n}${a}`.trimEnd();return`${i.custom_position_active_slot_name?`${n} · ${i.custom_position_active_slot_name}`:i.custom_position_active_slot?`${n} #${i.custom_position_active_slot}`:n}${a}${!0===i.custom_position_minimum_mode?" floor":""}${Ci(i)?` · ${o}`:""}`}(e,n.get(e),t,s,o)).join(" → ")}ki.styles=r`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
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
    .head-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1px;
      text-align: right;
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
      display: none;
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
    .limit-line {
      stroke: var(--warning-color, gold);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      opacity: 0.7;
    }
    .fov-band {
      /* Lighter shade of the cover colour (not gold), so the gold sun-dot reads
         clearly against it. Matches the sky-compass .fov default. */
      fill: var(--primary-color);
      fill-opacity: 0.18;
    }
    .off-schedule-zone {
      fill: var(--divider-color);
      fill-opacity: 0.12;
      pointer-events: none;
    }
    /* Floating-tooltip cursor lifecycle: help hint on hover, default once OUR
       bubble is shown. Applies to every tooltip carrier (schedule bar, ribbon
       track/bar, now-cursor group). */
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    .schedule-bar {
      stroke: var(--divider-color);
      stroke-width: 1;
    }
    .schedule-tick {
      font-size: 8px;
      fill: var(--secondary-text-color);
    }
    .ribbon-track {
      fill: var(--divider-color);
      fill-opacity: 0.25;
    }
    .ribbon-bar {
      /* Fallback only — the ribbon always sets an inline per-window fill. Kept on
         the cover colour for consistency with the FOV band. */
      fill: var(--primary-color);
      fill-opacity: 0.85;
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
      pointer-events: none;
    }
    .now-hit {
      stroke: transparent;
      stroke-width: 10;
    }
    /* Colour states mirror acp-sky-compass .sun.* so the sun reads the same
       across both visuals. */
    .sun-dot {
      fill: var(--secondary-text-color);
      transition: fill 0.3s ease;
    }
    .sun-dot.up {
      /* outside FOV, above horizon — light yellow */
      fill: #ffe680;
    }
    .sun-dot.in-fov {
      /* in FOV but not hitting — plain gold (no glow) */
      fill: var(--warning-color, gold);
    }
    .sun-dot.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 3px var(--warning-color, gold));
    }
    .sun-dot.night {
      /* below horizon — dim grey */
      fill: var(--secondary-text-color);
      opacity: 0.55;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 20px;
    }
  `,e([_e({attribute:!1})],ki.prototype,"hass",void 0),e([_e({attribute:!1})],ki.prototype,"discoveredList",void 0),e([_e({attribute:!1})],ki.prototype,"coverColors",void 0),e([_e({type:Boolean,reflect:!0})],ki.prototype,"compact",void 0),ki=e([he("acp-elevation-chart")],ki);let zi=class extends ce{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this._tick=null,this.hideInactive=!1}disconnectedCallback(){super.disconnectedCallback(),this._syncTimer(!1)}updated(){const e=Boolean(this.hass&&this.discovered&&this._throttleNextAllowedIso());this._syncTimer(e)}_syncTimer(e){e&&null===this._tick?this._tick=setInterval(()=>this.requestUpdate(),1e3):e||null===this._tick||(clearInterval(this._tick),this._tick=null)}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),i=this.discovered?.entities;return me(t,this.hass,[i?.decision_trace_sensor,i?.last_skipped_sensor])}_throttleNextAllowedIso(){const e=this.discovered.entities.last_skipped_sensor;if(!e)return null;const t=this.hass.states[e];if(!t||"time_delta_too_small"!==t.state)return null;const i=t.attributes,s=function(e,t){if(!e)return null;if(null==t||Number.isNaN(t))return null;const i=new Date(e).getTime();return Number.isNaN(i)?null:new Date(i+6e4*t).toISOString()}(i?.timestamp,i?.time_threshold_minutes);return s?new Date(s).getTime()<=Date.now()?null:s:null}_trace(){const e=this.discovered.entities.decision_trace_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const i=t.attributes;if(!i?.trace)return null;const s=new Map;for(const e of i.trace)s.set(Si(e.handler),{matched:e.matched,reason:e.reason,position:e.position,held_position:e.held_position});const o={};for(const[e,t]of Object.entries(Oe))o[e]=Ue(t,this.hass);return{winner:t.state,reason:i.reason??"",steps:s,enabledHandlers:i.enabled_handlers,summary:Ei(i.trace,i,t.state,o),inTimeWindow:i.in_time_window}}render(){if(!this.hass||!this.discovered)return q;const e=this._trace();if(!e)return V`<div class="placeholder">${Ue("decision.placeholder",this.hass)}</div>`;const t=this._throttleNextAllowedIso(),i=function(e){if(!e)return new Set;const t=new Set(e);return new Set(ze.filter(e=>!t.has(e)))}(e.enabledHandlers),s=function(e,t,i,s,o=new Set){return e.filter(e=>e===i||!o.has(e)&&(!s||!0===t.get(e)?.matched))}(ze,e.steps,e.winner,this.hideInactive,i);return V`
      <div class="wrap">
        <div class="head">
          <span class="label">${Ue("decision.pipeline",this.hass)}</span>
          <span class="winner">${Ue("decision.winner",this.hass,{name:e.winner})}</span>
        </div>
        ${!1===e.inTimeWindow?V`<div
              class="off-schedule"
              ${xt(Ue("decision.outside_schedule_tooltip",this.hass))}
            >
              ${Ue("decision.outside_schedule",this.hass)}
            </div>`:q}
        ${t?V`<div class="throttle-countdown">
              <ha-icon icon="mdi:timer-sand"></ha-icon>
              <span
                >${Ue("decision.next_change_in",this.hass,{time:ci(t,this.hass)})}</span
              >
            </div>`:q}
        ${this.showSummary&&e.summary?V`<div class="summary" ${xt(Ue("decision.summary_tooltip",this.hass))}>
              ${e.summary}
            </div>`:q}
        <div class="rows">
          ${s.map(t=>this._row(t,e.steps.get(t),e.winner===t))}
        </div>
        <div class="reason dim">${e.reason}</div>
      </div>
    `}_row(e,t,i){const s=t?.matched??!1,o=t?.reason??Ue("decision.not_evaluated",this.hass),n=t?.position,r=t?.held_position,a=null!=r,l=a?ri(r):null!=n?ri(n):"",c=a&&null!=n?V` · ${Ue("decision.solar_would_be",this.hass,{pct:ri(n)})}`:q;return V`
      <div class="row ${i?"winner":s?"match":"skip"}">
        <span class="name">${Ue(Oe[e],this.hass)}</span>
        <span class="dots" aria-hidden="true">${s?"████":"────"}</span>
        <span class="pos">${l}</span>
        <span class="reason-inline dim">${o}${c}</span>
        ${i?V`<span class="badge">✓</span>`:q}
      </div>
    `}};var Mi,Oi;zi.styles=r`
    :host {
      display: block;
    }
    /* Floating-tooltip cursor lifecycle: a help cursor hints "there's more
       here" on hover, flipping to default the moment OUR bubble appears. */
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
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
    :host([compact]) .head {
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
    .summary {
      font-size: 0.85rem;
      line-height: 1.3;
      padding: 2px 4px 4px;
      color: var(--primary-text-color);
    }
    :host([compact]) .summary {
      font-size: 0.75rem;
      padding: 0 2px 2px;
    }
    .off-schedule {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      padding: 3px 8px;
      border-radius: 4px;
      border-left: 3px solid var(--secondary-text-color);
      background: rgba(127, 127, 127, 0.08);
    }
    :host([compact]) .off-schedule {
      font-size: 0.72rem;
      padding: 2px 6px;
    }
    .throttle-countdown {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      padding: 3px 8px;
      border-radius: 4px;
      border-left: 3px solid var(--primary-color);
      background: rgba(127, 127, 127, 0.08);
    }
    .throttle-countdown ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-color);
    }
    :host([compact]) .throttle-countdown {
      font-size: 0.72rem;
      padding: 2px 6px;
    }
    :host([compact]) .throttle-countdown ha-icon {
      --mdc-icon-size: 14px;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      padding: 16px;
      text-align: center;
    }
  `,e([_e({attribute:!1})],zi.prototype,"hass",void 0),e([_e({attribute:!1})],zi.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],zi.prototype,"compact",void 0),e([_e({type:Boolean,reflect:!0,attribute:"show-summary"})],zi.prototype,"showSummary",void 0),e([_e({type:Boolean,reflect:!0,attribute:"hide-inactive"})],zi.prototype,"hideInactive",void 0),zi=e([he("acp-decision-strip")],zi),function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Mi||(Mi={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Oi||(Oi={}));const Ii=["closed","locked","off"],Fi=(e,t,i,s)=>{s=s||{},i=null==i?{}:i;const o=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,e.dispatchEvent(o),o},Ti=e=>{Fi(window,"haptic",e)};function Pi(e){return void 0!==e&&"none"!==e.action}function Ri(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Ni(e){const t=e.discovery?.axes;if(Array.isArray(t))return t.filter(e=>!!e&&"string"==typeof e.id&&!1!==e.supported).map(e=>({id:e.id,label:e.label??Ri(e.id),min:"number"==typeof e.min?e.min:0,max:"number"==typeof e.max?e.max:100,unit:"string"==typeof e.unit?e.unit:"%",stateAttr:"string"==typeof e.state_attr?e.state_attr:void 0,targetRole:Be[e.id]}));const i=[{id:"position",label:Ri("position"),min:0,max:100,unit:"%",stateAttr:"current_position",targetRole:"target_position_sensor"}];return e.entities.target_tilt_sensor&&i.push({id:"tilt",label:Ri("tilt"),min:0,max:100,unit:"%",stateAttr:"current_tilt_position",targetRole:"target_tilt_sensor"}),i}const ji={position:"set_position",tilt:"set_tilt"};function Di(e,t,i,s){if(function(e){const t=e.services;return!!t?.[Ee]?.set_axes}(e)){const s={axes:i};return void e.callService(Ee,"set_axes",s,{entity_id:t})}for(const[s,o]of Object.entries(i)){const i=ji[s];i&&e.callService(Ee,i,{[s]:o},{entity_id:t})}}function Bi(e,t,i){return e.filter(e=>"off"===e||("solar"===e?function(e){return e.solarMatched&&!e.cloudIsWinner}(i)&&!1!==t?.solar:!1!==t?.[e]))}function Ki(e){return!!e&&e.some(e=>e.matched&&"solar"===Si(e.handler))}function Gi(e){return"cloud"===Si(e)}function Li(e){if(!1===e.integrationEnabled)return"off";const t=Si(e.winner);return e.manualActive&&"force"!==t&&"custom_position"!==t?"manual":Pe[t]??"auto"}function Vi(e,t){return{solarMatched:Ki(e),cloudIsWinner:Gi(t)}}let Wi=class extends ce{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0,this.manualActive=!1,this.safetyActive=!1,this.resumable=!1}render(){const e=this._kind(),t="custom_position"===e&&this.safetyActive,i=t?Re.force:Re[e],s=this.hass?Ue(Ne[e],this.hass):Re[e].label,o=t?this.hass?Ue("badge.safety",this.hass):"Safety":this._label(e,s),n=t?je.force:je[e],r=V`${n?V`<ha-icon class="badge-icon" icon=${n}></ha-icon>`:q}${o}${this.resumable?V`<ha-icon class="resume-icon" icon="mdi:restore"></ha-icon>`:q}`;if(this.resumable){const t=this.hass?Ue("tile.resume_aria",this.hass):"Resume automatic control";return V`<button
        class="badge kind-${e} resumable"
        style="background:${i.bg};color:${i.fg};"
        part="badge"
        type="button"
        ${xt(t)}
        aria-label=${t}
        @click=${this._onResumeClick}
        @pointerdown=${this._stop}
      >
        ${r}
      </button>`}return V`<span
      class="badge kind-${e}"
      style="background:${i.bg};color:${i.fg};"
      part="badge"
      >${r}</span
    >`}_stop(e){e.stopPropagation()}_onResumeClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-resume",{bubbles:!0,composed:!0}))}_kind(){return this.kindOverride??Li({winner:this.winner,integrationEnabled:this.integrationEnabled,manualActive:this.manualActive})}_label(e,t){return"manual"===e?this.manualEndIso?li(this.manualEndIso):t:"custom_position"===e?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${t} #${this.slotNumber}`:t}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?this.hass?Ue("badge.floor_suffix",this.hass):" ↥":""}`:t}};Wi.styles=r`
    :host {
      display: inline-flex;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      line-height: 1.4;
    }
    .badge-icon {
      --mdc-icon-size: 14px;
      line-height: 0;
      flex: 0 0 auto;
    }
    button.badge {
      /* Inherit only the family — the font shorthand would reset font-size to
         the page value and make the resumable (manual) badge larger than the
         span badges, which keep the .badge 0.75rem size. */
      font-family: inherit;
      border: none;
      cursor: pointer;
    }
    button.badge:hover {
      filter: brightness(0.92);
    }
    .resume-icon {
      --mdc-icon-size: 14px;
      line-height: 0;
      flex: 0 0 auto;
      opacity: 0.85;
    }
    :host([compact]) .resume-icon {
      --mdc-icon-size: 12px;
    }
    :host([compact]) .badge {
      padding: 1px 6px;
      font-size: 0.7rem;
    }
    :host([compact]) .badge-icon {
      --mdc-icon-size: 12px;
    }
  `,e([_e({attribute:!1})],Wi.prototype,"hass",void 0),e([_e()],Wi.prototype,"winner",void 0),e([_e({attribute:"manual-end-iso"})],Wi.prototype,"manualEndIso",void 0),e([_e({type:Number,attribute:"slot-number"})],Wi.prototype,"slotNumber",void 0),e([_e({attribute:"slot-name"})],Wi.prototype,"slotName",void 0),e([_e({type:Number})],Wi.prototype,"pct",void 0),e([_e({type:Boolean,attribute:"minimum-mode"})],Wi.prototype,"minimumMode",void 0),e([_e({type:Boolean,reflect:!0})],Wi.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"integration-enabled"})],Wi.prototype,"integrationEnabled",void 0),e([_e({type:Boolean,attribute:"manual-active"})],Wi.prototype,"manualActive",void 0),e([_e({type:Boolean,attribute:"safety-active"})],Wi.prototype,"safetyActive",void 0),e([_e({attribute:"kind-override"})],Wi.prototype,"kindOverride",void 0),e([_e({type:Boolean,reflect:!0})],Wi.prototype,"resumable",void 0),Wi=e([he("acp-tile-badge")],Wi);let Ui=class extends ce{constructor(){super(...arguments),this.actual=null,this.target=null,this.coverColor=null,this.compact=!1,this.layout="cover",this.label=null,this.min=0,this.max=100,this.unit="%"}_frac(e){const t=e??this.min,i=this.max-this.min;if(0===i)return 0;const s=(t-this.min)/i*100;return Math.max(0,Math.min(100,s))}render(){if(!this.hass)return q;const e=this._frac(this.actual),t=this._frac(this.target),i=this.label??Ue("covers.tilt_title",this.hass);return V`
      <div
        class="row ${this.layout}"
        style=${this.coverColor?`--acp-cover-color:${this.coverColor}`:q}
      >
        <span class="label">${i}</span>
        <span class="num">${ri(this.actual)}</span>
        <div
          class="track"
          @click=${this._onClick}
          ${xt(Ue("covers.tilt_click_to_set",this.hass))}
        >
          <div class="fill" style="width:${e}%"></div>
          <div class="fill-closed" style="width:${100-e}%"></div>
          ${null!==this.target?V`<div
                class="marker"
                style="left:clamp(1px, ${t}%, calc(100% - 1px))"
                ${xt(Ue("covers.tilt_target_tooltip",this.hass,{pct:t}))}
              ></div>`:q}
        </div>
      </div>
    `}_onClick(e){const t=e.currentTarget.getBoundingClientRect(),i=(e.clientX-t.left)/t.width,s=this.min+i*(this.max-this.min),o=Math.max(this.min,Math.min(this.max,Math.round(s)));this.dispatchEvent(new CustomEvent("acp-tilt-set",{detail:o,bubbles:!0,composed:!0}))}};Ui.styles=r`
    :host {
      display: block;
    }
    .row {
      display: grid;
      align-items: center;
    }
    /* Cover-bar variant: mirror .cover's grid so the track + percentage line up
       with the Position row directly above (name | num | track | warn-spacer). */
    .row.cover {
      grid-template-columns: minmax(80px, 1fr) 48px 3fr 16px;
      gap: 8px;
      font-size: 0.82rem;
    }
    :host([compact]) .row.cover {
      gap: 6px;
      font-size: 0.75rem;
    }
    /* Tile variant: inline "TILT 35% [track]" — label then % then the bar. */
    .row.tile {
      grid-template-columns: auto auto 1fr;
      gap: 6px;
      font-size: 0.75rem;
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .num {
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .row.cover .num {
      text-align: right;
    }
    /* Track mirrors the position bar: open segment pale, closed solid — same
       hue as the cover wedge. */
    .track {
      position: relative;
      display: flex;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
    }
    :host([compact]) .track,
    .row.tile .track {
      height: 6px;
    }
    .fill {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 18%, transparent);
      transition: width 0.3s ease;
    }
    .fill-closed {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 50%, transparent);
      transition: width 0.3s ease;
    }
    .marker {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 14px;
      background: var(--accent-color, red);
      transform: translateX(-50%);
      transition: left 0.3s ease;
    }
  `,e([_e({attribute:!1})],Ui.prototype,"hass",void 0),e([_e({attribute:!1})],Ui.prototype,"actual",void 0),e([_e({attribute:!1})],Ui.prototype,"target",void 0),e([_e({attribute:!1})],Ui.prototype,"coverColor",void 0),e([_e({type:Boolean,reflect:!0})],Ui.prototype,"compact",void 0),e([_e({reflect:!0})],Ui.prototype,"layout",void 0),e([_e({attribute:!1})],Ui.prototype,"label",void 0),e([_e({type:Number})],Ui.prototype,"min",void 0),e([_e({type:Number})],Ui.prototype,"max",void 0),e([_e()],Ui.prototype,"unit",void 0),Ui=e([he("acp-axis-bar")],Ui),customElements.get("acp-tilt-bar")||customElements.define("acp-tilt-bar",class extends Ui{});let qi=class extends ce{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0,this._tick=null}disconnectedCallback(){super.disconnectedCallback(),this._syncTimer(!1)}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),i=this.discovered?.entities;return me(t,this.hass,[i?.manual_override_binary,i?.manual_override_end_sensor,i?.motion_status_sensor,i?.reset_override_button])}updated(){if(!this.hass||!this.discovered)return void this._syncTimer(!1);const e=!this.compact&&(null!==this._manualEndIso()||null!=this._motionStatus()?.endIso);this._syncTimer(e)}_syncTimer(e){e&&null===this._tick?this._tick=setInterval(()=>this.requestUpdate(),1e3):e||null===this._tick||(clearInterval(this._tick),this._tick=null)}_manualActive(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualEndIso(){const e=this.discovered.entities.manual_override_end_sensor;if(!e)return null;const t=this.hass.states[e];return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:null}_motionStatus(){const e=this.discovered.entities.motion_status_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const i=t.attributes.motion_timeout_end_time;return{state:t.state,endIso:i??null}}_resetManual(){const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_motionStateLabel(e,t){if(e){const t=this.hass.states[e],i=this.hass.formatEntityState;if(t&&"function"==typeof i){const e=i(t);if(e)return e}}return t.replace(/_/g," ")}render(){if(!this.hass||!this.discovered)return q;const e=this._manualActive(),t=this._manualEndIso(),i=this._motionStatus(),s=this.discovered.entities.motion_status_sensor,o=this.discovered.entities.reset_override_button,n=Ue("overrides.reset_manual",this.hass);return V`
      <div class="wrap">
        <div class="label dim">${Ue("overrides.title",this.hass)}</div>
        <div class="grid">
          <div class="tile ${e?"active":""}">
            <div class="tile-label">${Ue("overrides.manual",this.hass)}</div>
            <div class="tile-value">
              ${Ue(e?"overrides.active":"overrides.off",this.hass)}
            </div>
            ${t?V`<div class="tile-sub dim">
                  ${Ue("overrides.ends_in",this.hass,{time:ci(t,this.hass)})}
                </div>`:q}
          </div>

          ${i?V`<div class="tile ${"motion_detected"===i.state?"active":""}">
                <div class="tile-label">${Ue("overrides.motion",this.hass)}</div>
                <div class="tile-value">${this._motionStateLabel(s,i.state)}</div>
                ${i.endIso?V`<div class="tile-sub dim">
                      ${Ue("overrides.timeout",this.hass,{time:ci(i.endIso,this.hass)})}
                    </div>`:q}
              </div>`:q}
          ${o?this.resetEnabled?V`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${n}</div>
                </button>`:V`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${n}</div>
                </button>`:q}
        </div>
      </div>
    `}};qi.styles=r`
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
    :host([compact]) .label {
      display: none;
    }
    .tile.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
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
    .tile.action.readonly {
      cursor: default;
      opacity: 0.85;
      pointer-events: none;
    }
    .tile.action.readonly:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: inherit;
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
  `,e([_e({attribute:!1})],qi.prototype,"hass",void 0),e([_e({attribute:!1})],qi.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],qi.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"reset-enabled"})],qi.prototype,"resetEnabled",void 0),qi=e([he("acp-overrides-panel")],qi);const Yi=new Set(["mode_off","active"]),Hi={summer_mode:"mdi:weather-sunny",winter_mode:"mdi:snowflake",intermediate:"mdi:weather-partly-cloudy"};let Qi=class extends ce{constructor(){super(...arguments),this.compact=!1}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),i=this.discovered?.entities;return me(t,this.hass,[i?.climate_status_sensor,i?.climate_mode_switch])}render(){if(!this.hass||!this.discovered)return q;const e=this.discovered.entities.climate_status_sensor;if(!e)return q;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return q;if("unknown"===t.state||""===t.state){const e=this.discovered.entities.climate_mode_switch,i=!!e&&"off"===this.hass.states[e]?.state,s=Ue(i?"climate.mode_off":"climate.standby",this.hass),o=i?"mdi:power-off":"mdi:thermostat",n=t.attributes?.inactive_reason;return this._renderStandby(o,s,n)}const i=t.state,s=t.attributes??{},o=Hi[i]??"mdi:thermostat",n=this.hass.formatEntityState,r="function"==typeof n?n(t)??i:i;if(null!=(a=s.inactive_reason)&&"active"!==a)return this._renderStandby(o,r,s.inactive_reason);var a;const l=s.temperature_unit??"°",c=void 0!==s.active_temperature?`${s.active_temperature.toFixed(1)}${l}`:"—",d=!0===s.temp_switch,h=(e,t)=>null==t||Number.isNaN(t)?null:`${Ue(e,this.hass)} ${t.toFixed(1)}${l}`,u=d?null:[h("climate.threshold_low",s.temp_low),h("climate.threshold_high",s.temp_high)].filter(e=>null!==e).join(" ")||null,p=[...d?[h("climate.threshold_low",s.temp_low),h("climate.threshold_high",s.temp_high)]:[],h("climate.threshold_summer_outside",s.temp_summer_outside)].filter(e=>null!==e).join(" ")||null,_=[void 0!==s.indoor_temperature?{label:Ue("climate.indoor",this.hass),value:s.indoor_temperature,unit:l,threshold:u}:null,void 0!==s.outdoor_temperature?{label:Ue("climate.outdoor",this.hass),value:s.outdoor_temperature,unit:l,threshold:p}:null].filter(e=>null!==e),g=[{label:Ue("climate.presence",this.hass),value:s.is_presence,icon:"mdi:account-check"},{label:Ue("climate.sunny",this.hass),value:s.is_sunny,icon:"mdi:white-balance-sunny"},{label:Ue("climate.lux",this.hass),value:s.lux_active,icon:"mdi:brightness-7"},{label:Ue("climate.irradiance",this.hass),value:s.irradiance_active,icon:"mdi:solar-power"}].filter(e=>void 0!==e.value);return V`
      <div class="wrap">
        <div class="head">
          <span class="label">${Ue("climate.title",this.hass)}</span>
          <span class="dim">${Ue("climate.active",this.hass,{strategy:c})}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${o}></ha-icon>
          <span class="strategy-name">${r}</span>
        </div>
        ${_.length?V`
              <div class="temps">
                ${_.map(e=>V`
                    <div class="temp">
                      <span class="temp-label dim">${e.label}</span>
                      <span class="temp-value">${e.value.toFixed(1)}${e.unit}</span>
                      ${e.threshold?V`<span class="temp-threshold dim">${e.threshold}</span>`:q}
                    </div>
                  `)}
              </div>
            `:q}
        ${g.length?V`
              <div class="conditions">
                ${g.map(e=>V`
                    <div class="chip ${e.value?"on":"off"}" ${xt(e.label)}>
                      <ha-icon icon=${e.icon}></ha-icon>
                      <span>${e.label}</span>
                    </div>
                  `)}
              </div>
            `:q}
      </div>
    `}_renderStandby(e,t,i){const s=i&&!Yi.has(i)?Ue(`climate.reason.${i}`,this.hass):void 0;return V`
      <div class="wrap">
        <div class="head">
          <span class="label">${Ue("climate.title",this.hass)}</span>
        </div>
        <div class="strategy standby">
          <ha-icon icon=${e}></ha-icon>
          <span class="strategy-name dim">${t}</span>
        </div>
        ${s?V`<div class="standby-reason dim">${s}</div>`:q}
      </div>
    `}};Qi.styles=r`
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
    .strategy.standby ha-icon {
      color: var(--secondary-text-color);
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
    .temp-threshold {
      font-size: 0.62rem;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .standby-reason {
      font-size: 0.78rem;
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
    :host([compact]) .head {
      display: none;
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
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
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
  `,e([_e({attribute:!1})],Qi.prototype,"hass",void 0),e([_e({attribute:!1})],Qi.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Qi.prototype,"compact",void 0),Qi=e([he("acp-climate-panel")],Qi);let Zi=class extends ce{constructor(){super(...arguments),this.compact=!1,this.coverColor=null}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),i=this.discovered?.entities,s=this.discovered?Ni(this.discovered).map(e=>e.targetRole?i?.[e.targetRole]:void 0).filter(e=>!!e):[];return me(t,this.hass,[...s,i?.position_mismatch_binary,i?.manual_override_binary,...this.discovered?.managed_covers??[]])}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return{target:null,covers:{}};const t=this.hass.states[e];if(!t)return{target:null,covers:{}};const i=t.attributes;return{target:Wt(this.hass,this.discovered),covers:i?.actual_positions??{}}}_mismatched(){const e=this.discovered.entities.position_mismatch_binary;if(!e)return new Set;const t=this.hass.states[e];if("on"!==t?.state)return new Set;const i=t.attributes.entities;return i?new Set(Object.entries(i).filter(([,e])=>e.mismatch).map(([e])=>e)):new Set}_setAxis(e,t,i){Di(this.hass,e,{[t]:i})}_axisTarget(e){const t=e.targetRole;if(!t)return null;const i=this.discovered.entities[t];if(!i)return null;const s=parseFloat(this.hass.states[i]?.state??"");return Number.isNaN(s)?null:s}_axisActual(e,t){if(!e.stateAttr)return null;const i=this.hass.states[t]?.attributes?.[e.stateAttr];return"number"==typeof i?i:null}_axisLabel(e){const t=Ke[e.id];return t?Ue(t,this.hass):e.label}_axisTargetLabel(e,t){return"tilt"===e.id?Ue("covers.tilt_target",this.hass,{pct:ri(t)}):`${this._axisLabel(e)}: ${ri(t)}`}render(){if(!this.hass||!this.discovered)return q;const{target:e,covers:t}=this._target(),i=this._mismatched(),s=(n=this.hass,r=this.discovered,null!==_t(Vt(n,r),Gt(n,r),Kt(n,r))),o=Object.entries(t);var n,r;if(0===o.length)return V`<div class="placeholder">${Ue("covers.placeholder",this.hass)}</div>`;const a=Ni(this.discovered).filter(e=>"position"!==e.id),l=new Map(a.map(e=>[e.id,this._axisTarget(e)]));return V`
      <div class="wrap" style=${this.coverColor?`--acp-cover-color:${this.coverColor}`:q}>
        <div class="head">
          <span class="label">${Ue("covers.title",this.hass)}</span>
          <span class="targets">
            <span class="target"
              >${Ue(s?"covers.target_solar":"covers.target",this.hass,{pct:ri(e)})}</span
            >
            ${a.map(e=>V`<span class="target"
                  >${this._axisTargetLabel(e,l.get(e.id)??null)}</span
                >`)}
          </span>
        </div>
        ${o.map(([t,o])=>V`
            <div class="cover-group">
              ${this._bar(t,o,e,i.has(t),s)}
              ${a.map(e=>V`<acp-tilt-bar
                    .hass=${this.hass}
                    .label=${this._axisLabel(e)}
                    .min=${e.min}
                    .max=${e.max}
                    .unit=${e.unit}
                    .actual=${this._axisActual(e,t)}
                    .target=${l.get(e.id)??null}
                    .coverColor=${this.coverColor}
                    .compact=${this.compact}
                    @acp-tilt-set=${i=>this._setAxis(t,e.id,i.detail)}
                  ></acp-tilt-bar>`)}
            </div>
          `)}
      </div>
    `}_bar(e,t,i,s,o){const n=this.hass.states[e]?.attributes?.friendly_name??e,r=t??0,a=i??0;return V`
      <div class="cover ${s?"mismatch":""}">
        <div class="name" ${xt(e)}>${n}</div>
        <div class="num">${ri(t)}</div>
        <div
          class="track"
          @click=${t=>this._handleTrackClick(t,e)}
          ${xt(Ue("covers.click_to_set",this.hass))}
        >
          <div class="fill" style="width:${r}%"></div>
          <div class="fill-closed" style="width:${100-r}%"></div>
          ${null!==i?V`<div
                class="marker"
                style="left:clamp(1px, ${a}%, calc(100% - 1px))"
                ${xt(Ue(o?"covers.target_tooltip_override":"covers.target_tooltip",this.hass,{pct:a}))}
              ></div>`:q}
        </div>
        ${s&&!o?V`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:q}
      </div>
    `}_handleTrackClick(e,t){const i=e.currentTarget.getBoundingClientRect(),s=Math.round((e.clientX-i.left)/i.width*100),o=Math.max(0,Math.min(100,s));this._setAxis(t,"position",o)}};var Xi;Zi.styles=r`
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
    .targets {
      display: flex;
      gap: 12px;
    }
    .target {
      font-variant-numeric: tabular-nums;
    }
    /* Position + (optional) tilt row stack for one cover. */
    .cover-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .cover-group acp-tilt-bar {
      /* Indent the tilt row under the position track so the two read as one
         cover's two axes. Aligns roughly with the position bar's track column. */
      padding-left: 0;
    }
    .cover {
      display: grid;
      /* Final column is fixed at the warn-icon size (16px) rather than auto so
         the track (3fr) keeps the same width whether or not the badge renders —
         a toggling badge no longer reflows the bar graph (#158). */
      grid-template-columns: minmax(80px, 1fr) 48px 3fr 16px;
      gap: 8px;
      align-items: center;
      font-size: 0.82rem;
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* The cover name hints with a help cursor; the track is clickable and keeps
       its pointer cursor (it is excluded from the help rule below). Both revert
       to their natural cursor once OUR bubble is shown. */
    .name[data-tooltip]:hover {
      cursor: help;
    }
    .name[data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    .track {
      position: relative;
      display: flex;
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
    :host([compact]) .head {
      display: none;
    }
    /* Both segments derive from the cover colour (override, else --primary-color),
       distinguished by opacity: open is pale, closed is solid — "lighter = more
       open" — matching the compass FOV (light) vs cover wedge (solid) of the same
       hue. No gold, so nothing competes with the gold sun on the compass. */
    .fill {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 18%, transparent);
      transition: width 0.3s ease;
    }
    .fill-closed {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 50%, transparent);
      transition: width 0.3s ease;
    }
    /* The marker is centred on its left value via translateX(-50%) and its
       left is clamped 1px inside the rail (inline), so the 2px box never gets
       clipped by .track { overflow:hidden } at the 0%/100% extremes (#158). */
    .marker {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 14px;
      background: var(--accent-color, red);
      transform: translateX(-50%);
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
    /* On a position mismatch the open segment is already gold, so recoloring it
       gold would be invisible — flag the divergence with the error colour and
       lean on the warn icon at the end of the row. */
    .mismatch .fill {
      background: color-mix(in srgb, var(--error-color, crimson) 35%, transparent);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 16px;
    }
  `,e([_e({attribute:!1})],Zi.prototype,"hass",void 0),e([_e({attribute:!1})],Zi.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Zi.prototype,"compact",void 0),e([_e({attribute:!1})],Zi.prototype,"coverColor",void 0),Zi=e([he("acp-cover-bar")],Zi);const Ji=864e5;let es=Xi=class extends ce{constructor(){super(...arguments),this.samples=[],this.events=[],this.now=Date.now(),this._hoverIdx=null,this._onPointerMove=e=>{const t=e.currentTarget.getBoundingClientRect();if(t.width<=0)return;const i=(e.clientX-t.left)/t.width,s=Math.max(0,Math.min(1,i))*Xi.VIEW_W;this._hoverIdx=this._nearestSampleIdx(s)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){if(!this.samples||0===this.samples.length)return q;const{VIEW_W:e,VIEW_H:t,TOP_PAD:i,EVENT_HIT_W:s}=Xi,o=t-i,n=ei(new Date(this.now)).getTime(),r=t=>ct(t,n,e),a=this.samples.map(e=>{const t=Date.parse(e.t);return{t:t,x:r(t),y:dt(e.position,i,o),sample:e,inDay:!Number.isNaN(t)&&t>=n&&t<=n+Ji}}),l=a.filter(e=>e.inDay).map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)}`).join(" "),c=function(e){for(const t of e)for(const e of Object.keys(t))if(!is.has(e)&&"number"==typeof t[e])return e;return null}(this.samples),d=[];if(null!==c){let e=[];for(const t of a){if(!t.inDay)continue;const s=t.sample[c];if("number"==typeof s){const n=dt(s,i,o);e.push(`${t.x.toFixed(1)},${n.toFixed(1)}`)}else e.length>0&&(d.push(e.join(" ")),e=[])}e.length>0&&d.push(e.join(" "))}const h=d.map(e=>W`<polyline class="curve-secondary" points=${e} fill="none"></polyline>`),u=(this.events??[]).map(e=>{const o=Date.parse(e.t);if(Number.isNaN(o)||o<n||o>n+Ji)return null;const a=r(o),l=`evt-${e.kind}`,c=function(e,t){const i=`forecast.event.${e.kind}`,s=Ue(i,t),o=s===i?e.label??e.kind:s,n=li(e.t);return"—"===n?o:`${o} — ${n}`}(e,this.hass);return W`<g class="event-group" ${xt(c)}>
          <line
            class="event-hit"
            x1=${a.toFixed(1)}
            x2=${a.toFixed(1)}
            y1=${i}
            y2=${t}
            stroke-width=${s}
          ></line>
          <line
            class="event-marker ${l}"
            x1=${a.toFixed(1)}
            x2=${a.toFixed(1)}
            y1=${i}
            y2=${t}
          ></line>
        </g>`}).filter(e=>null!==e),p=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<a.length?a[this._hoverIdx]:null,_=p?W`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${p.x.toFixed(1)} x2=${p.x.toFixed(1)}
            y1=${i} y2=${t}></line>
          <circle class="hover-dot" cx=${p.x.toFixed(1)} cy=${p.y.toFixed(1)} r="3"></circle>
        </g>`:q,g=p?V`<div class="hover-label" style=${`left: ${(p.x/e*100).toFixed(2)}%`}>
          ${function(e,t,i,s){const o=li(e.t),n=`${Math.round(ts(e.position))}%`,r=e.handler?`${o} · ${n} · ${e.handler}`:`${o} · ${n}`;if(null===t)return r;const a=e[t];if("number"!=typeof a)return r;const l=function(e,t,i){const s=ss[e];if(s)return Ue(s,t);const o=i?.[e];return o||e.charAt(0).toUpperCase()+e.slice(1)}(t,i,s);return`${r} · ${l}: ${`${Math.round(ts(a))}%`}`}(p.sample,c,this.hass,this.axisLabels)}
        </div>`:q,m=[0,6,12,18,24].map(e=>{const s=r(n+36e5*e);return W`
        <line class="grid faint" x1=${s} y1=${i} x2=${s} y2=${t-.5} />
        <text class="axis-label tick-time" x=${s} y=${t-3} text-anchor="middle">${e.toString().padStart(2,"0")}:00</text>
      `}),f=this.now,v=r(f),y=f>=n&&f<=n+Ji?W`<g class="now-group" ${xt(li(new Date(f).toISOString()))}>
          <line class="now-hit" x1=${v.toFixed(1)} y1=${i} x2=${v.toFixed(1)} y2=${t-.5}></line>
          <line class="now" x1=${v.toFixed(1)} y1=${i} x2=${v.toFixed(1)} y2=${t-.5}></line>
        </g>`:q;return V`
      <div class="wrap">
        <svg
          viewBox="0 0 ${e} ${t}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <line class="baseline" x1="0" y1=${t-.5} x2=${e} y2=${t-.5}></line>
          <text class="axis-label" x="4" y=${i+8} text-anchor="start">100%</text>
          ${m}
          <polyline class="curve" points=${l} fill="none"></polyline>
          ${h} ${u} ${_} ${y}
        </svg>
        ${g}
      </div>
    `}_nearestSampleIdx(e){const t=ei(new Date(this.now)).getTime();let i=-1,s=Number.POSITIVE_INFINITY;for(let o=0;o<this.samples.length;o++){const n=Date.parse(this.samples[o].t);if(Number.isNaN(n)||n<t||n>t+Ji)continue;const r=ct(n,t,Xi.VIEW_W),a=Math.abs(r-e);a<s&&(s=a,i=o)}return i>=0?i:null}};function ts(e){return Number.isNaN(e)||e<0?0:e>100?100:e}es.VIEW_W=600,es.VIEW_H=80,es.TOP_PAD=10,es.EVENT_HIT_W=12,es.styles=r`
    :host {
      display: block;
    }
    .wrap {
      position: relative;
      width: 100%;
    }
    svg {
      display: block;
      width: 100%;
      height: 80px;
      overflow: visible;
    }
    .baseline {
      stroke: var(--divider-color, rgba(0, 0, 0, 0.12));
      stroke-width: 1;
    }
    .curve {
      stroke: var(--primary-color);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .curve-secondary {
      stroke: var(--accent-color, currentColor);
      stroke-width: 1.5;
      stroke-dasharray: 4 2;
      vector-effect: non-scaling-stroke;
    }
    /* Floating-tooltip cursor lifecycle: a help cursor hints at the event
       marker on hover, flipping to default once OUR bubble appears. */
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    .event-hit {
      stroke: transparent;
      vector-effect: non-scaling-stroke;
    }
    .event-marker {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 2 2;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .evt-sunrise {
      stroke: #fbc02d;
    }
    .evt-sunset {
      stroke: #f57c00;
    }
    .evt-fov_enter {
      stroke: #4caf50;
    }
    .evt-fov_exit {
      stroke: #9e9e9e;
    }
    .hover-line {
      stroke: var(--primary-text-color, currentColor);
      stroke-width: 1;
      stroke-dasharray: 1 2;
      opacity: 0.55;
      vector-effect: non-scaling-stroke;
    }
    .hover-dot {
      fill: var(--primary-color);
      stroke: var(--card-background-color, #fff);
      stroke-width: 1;
    }
    .hover-label {
      position: absolute;
      bottom: calc(100% + 4px);
      transform: translateX(-50%);
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.75));
      color: var(--primary-text-color, #fff);
      font-size: 0.72rem;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .axis-label {
      font-size: 9px;
      fill: var(--secondary-text-color, #888);
      pointer-events: none;
      vector-effect: non-scaling-stroke;
      user-select: none;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 0.5;
      opacity: 0.6;
    }
    .grid.faint {
      opacity: 0.25;
    }
    .now {
      stroke: var(--accent-color, crimson);
      stroke-width: 1.25;
      pointer-events: none;
    }
    .now-hit {
      stroke: transparent;
      stroke-width: 10;
    }
  `,e([_e({attribute:!1})],es.prototype,"hass",void 0),e([_e({attribute:!1})],es.prototype,"samples",void 0),e([_e({attribute:!1})],es.prototype,"events",void 0),e([_e({attribute:!1})],es.prototype,"now",void 0),e([_e({attribute:!1})],es.prototype,"axisLabels",void 0),e([ge()],es.prototype,"_hoverIdx",void 0),es=Xi=e([he("acp-forecast-strip")],es);const is=new Set(["t","position","handler"]),ss={tilt:"covers.tilt_title"},os=["sol_elev_deg","gamma_deg"],ns=["position_pct"],rs=new Set([...os,...ns,"status","cover_type","tilt"]),as={cover_blind:["effective_distance_m","adjusted_height_m","safety_margin"],cover_awning:["awn_angle_deg","vertical_position_m","length_m"],cover_tilt:["slat_angle_raw_deg","tilt_mode","max_degrees"]},ls=new Set([...os,...ns,...Object.values(as).flat()]);function cs(e,t){return null==t?"—":"boolean"==typeof t?t?"✓":"✗":Array.isArray(t)?t.length?t.join(", "):"—":"number"==typeof t?Number.isNaN(t)?"—":"position_pct"===e||e.endsWith("_pct")?`${Math.round(t)}%`:e.endsWith("_deg")?`${t.toFixed(1)}°`:e.endsWith("_m")?`${t.toFixed(3)} m`:e.endsWith("_rad")?`${t.toFixed(3)} rad`:t.toFixed(3):String(t)}function ds(e,t,i){const s=[];for(const i of t)i in e&&s.push({key:i,value:cs(i,e[i]),curated:ls.has(i)});return s}function hs(e,t,i){const s=ds(e,os),o=ds(e,ns);let n;if(i){const i=as[t]??[],s=Object.keys(e).filter(e=>!rs.has(e)&&!i.includes(e));n=[...i.filter(t=>t in e),...s]}else n=(as[t]??[]).filter(t=>t in e);const r=ds(e,n),a=e.position_pct;return{status:"string"==typeof e.status?e.status:void 0,hasTarget:"number"==typeof a&&!Number.isNaN(a),inputs:s,intermediates:r,output:o}}function us(e,t){const i="string"==typeof e.cover_type?e.cover_type:"",s=hs(e,i,t);let o;if("cover_venetian"===i){const i=e.tilt;i&&"object"==typeof i&&(o=hs(i,"cover_tilt",t))}return{coverType:i,position:s,tilt:o}}let ps=class extends ce{constructor(){super(...arguments),this.compact=!1,this._showAll=!1,this._toggleShowAll=()=>{this._showAll=!this._showAll}}shouldUpdate(e){return e.size>1||!e.has("hass")||me(e.get("hass"),this.hass,[this.discovered?.entities.solar_calculation_sensor])}render(){if(!this.hass||!this.discovered)return q;const e=this.discovered.entities.solar_calculation_sensor;if(!e)return q;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return q;const i=t.attributes,s=us(i,this._showAll),o=function(e){const t=us(e,!0),i=us(e,!1),s=e=>e.position.intermediates.length+(e.tilt?.intermediates.length??0);return Math.max(0,s(t)-s(i))}(i);return V`
      <div class="wrap">
        <div class="head">
          <span class="label">${Ue("solar.title",this.hass)}</span>
          ${this._statusChip(s.position.status)}
        </div>
        ${this._axis(s.position,s.tilt?Ue("solar.axis_position",this.hass):void 0)}
        ${s.tilt?this._axis(s.tilt,Ue("solar.axis_tilt",this.hass)):q}
        ${o>0?V`<button class="show-all" type="button" @click=${this._toggleShowAll}>
              ${this._showAll?Ue("solar.show_less",this.hass):Ue("solar.show_all",this.hass,{count:o})}
            </button>`:q}
      </div>
    `}_statusChip(e){if(!e)return q;const t=e.startsWith("Direct"),i=this._statusSlug(e),s="_unknown"===i?e:Ue(`solar.status.${i}`,this.hass);return V`<span class="status-chip ${t?"direct":"default"}">${s}</span>`}_statusSlug(e){return{"Direct Sun":"direct_sun","Default: FOV Exit":"fov_exit","Default: Elevation Limit":"elevation_limit","Default: Sunset Offset":"sunset_offset","Default: Blind Spot":"blind_spot",Default:"default"}[e]??"_unknown"}_axis(e,t){return V`
      <div class="axis">
        ${t?V`<div class="axis-title dim">${t}</div>`:q}
        ${this._group(Ue("solar.group_inputs",this.hass),e.inputs)}
        ${this._group(Ue("solar.group_intermediates",this.hass),e.intermediates)}
        ${e.hasTarget?this._group(Ue("solar.group_output",this.hass),e.output):V`<div class="no-target dim">
              ${Ue("solar.no_target",this.hass,{status:e.status??"—"})}
            </div>`}
      </div>
    `}_group(e,t){return 0===t.length?q:V`
      <div class="group">
        <div class="group-label dim">${e}</div>
        <div class="rows">
          ${t.map(e=>V`<div class="row">
                <span class="key ${e.curated?"":"raw"}"
                  >${e.curated?Ue(`solar.field.${e.key}`,this.hass):e.key}</span
                >
                <span class="value">${e.value}</span>
              </div>`)}
        </div>
      </div>
    `}};ps.styles=r`
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
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .status-chip {
      font-size: 0.72rem;
      padding: 1px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .status-chip.direct {
      background: rgba(76, 175, 80, 0.22);
      color: #1b5e20;
    }
    .status-chip.default {
      background: rgba(96, 125, 139, 0.22);
      color: #37474f;
    }
    .axis {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .axis-title {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 600;
    }
    .group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .group-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .rows {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1px 12px;
    }
    .row {
      display: contents;
    }
    .key {
      font-size: 0.82rem;
    }
    .key.raw {
      font-family: var(--code-font-family, monospace);
      font-size: 0.74rem;
      color: var(--secondary-text-color);
    }
    .value {
      font-size: 0.82rem;
      font-variant-numeric: tabular-nums;
      text-align: right;
      white-space: nowrap;
    }
    .no-target {
      font-size: 0.82rem;
      font-style: italic;
    }
    .show-all {
      align-self: flex-start;
      border: 0;
      background: transparent;
      cursor: pointer;
      color: var(--primary-color);
      font-size: 0.8rem;
      padding: 2px 0;
    }
    :host([compact]) .head {
      display: none;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
  `,e([_e({attribute:!1})],ps.prototype,"hass",void 0),e([_e({attribute:!1})],ps.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],ps.prototype,"compact",void 0),e([ge()],ps.prototype,"_showAll",void 0),ps=e([he("acp-solar-calc")],ps);let _s=class extends ce{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this.showElevationChart=!0,this.showSolarCalc=!0,this._cancelMinuteTimer=null,this._listSource=null,this._list=[],this._onResume=()=>{const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const e=this.discovered.device_id;e&&this._navigate(`/config/devices/device/${e}`)},this._openIntegrationPage=()=>{this._navigate(`/config/integrations/integration/${Ee}`)},this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}updated(){this._syncMinuteTimer(this.open)}disconnectedCallback(){super.disconnectedCallback(),this._syncMinuteTimer(!1)}_syncMinuteTimer(e){e&&null===this._cancelMinuteTimer?this._cancelMinuteTimer=bi(()=>this.requestUpdate()):e||null===this._cancelMinuteTimer||(this._cancelMinuteTimer(),this._cancelMinuteTimer=null)}get _discoveredList(){return this.discovered!==this._listSource&&(this._listSource=this.discovered,this._list=this.discovered?[this.discovered]:[]),this._list}_buildHandlerLabels(){const e={};for(const[t,i]of Object.entries(Oe))e[t]=Ue(i,this.hass);return e}render(){if(!this.open||!this.hass||!this.discovered)return q;const e=this._winner(),t=this._traceAttrs(),i=this._matchedHandlers(t,e),s=Ci(t),o=t?Ei(t.trace??[],t,0,this._buildHandlerLabels(),Ue("badge.safety",this.hass)):"",n=this._target(),r=this._shouldShowResume(e),a=this._switchOn("integration_enabled_switch"),l=this._switchOn("automatic_control_switch"),c=Ue("dialog.configure_integration",this.hass),d=Ue("dialog.open_device_page",this.hass),h=Ue("dialog.close",this.hass);return V`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${Ie[this.discovered.cover_type]??"mdi:window-shutter"}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${a?l?i.map(e=>V`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${e}
                          .slotNumber=${"custom_position"===e?t?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===e?t?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===e?Ai(t,n)??void 0:void 0}
                          .minimumMode=${"custom_position"===e?t?.custom_position_minimum_mode:void 0}
                          .safetyActive=${"custom_position"===e&&s}
                        ></acp-tile-badge>`):q:V`<acp-tile-badge
                    .hass=${this.hass}
                    .integrationEnabled=${!1}
                  ></acp-tile-badge>`}
            </div>
            <button
              class="icon-btn options-link"
              type="button"
              aria-label=${c}
              ${xt(c)}
              @click=${this._openIntegrationPage}
            >
              <ha-icon icon="mdi:tune-variant"></ha-icon>
            </button>
            ${this.discovered.device_id?V`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label=${d}
                  ${xt(d)}
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:cog"></ha-icon>
                </button>`:q}
            <button class="close" type="button" aria-label=${h} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${o?V`<div class="summary">${o}</div>`:q}

          <div class="position-block">
            <div class="position-label">${Ue("dialog.target",this.hass)}</div>
            <div class="position-value">${ri(n)}</div>
            ${this._mismatchActive()?V`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:q}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${r?V`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${Ue("dialog.resume_auto",this.hass)}
                </button>
              </div>`:q}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?Ue("dialog.hide_advanced",this.hass):Ue("dialog.show_advanced",this.hass)}
          </button>
          ${this.advancedOpen?V`<div class="advanced">
                ${this.showCompass?V`<div class="advanced-compass">
                      <acp-sky-compass
                        .hass=${this.hass}
                        .discovered_list=${this._discoveredList}
                        ?compact=${!0}
                        .showLegend=${!1}
                        .showStats=${!0}
                      ></acp-sky-compass>
                    </div>`:q}
                ${this.showElevationChart?V`<acp-elevation-chart
                      .hass=${this.hass}
                      .discoveredList=${this._discoveredList}
                      ?compact=${!0}
                    ></acp-elevation-chart>`:q}
                ${this._renderSlots(t?.custom_position_slots)}
                <acp-decision-strip
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-decision-strip>
                ${this.showSolarCalc?V`<acp-solar-calc
                      .hass=${this.hass}
                      .discovered=${this.discovered}
                    ></acp-solar-calc>`:q}
                <acp-overrides-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-overrides-panel>
                <acp-climate-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-climate-panel>
              </div>`:q}
        </div>
      </div>
    `}_winner(){const e=this.discovered.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(){const e=this.discovered.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_matchedHandlers(e,t){if(!e?.trace)return[];const i=new Set;for(const t of e.trace){if(!t.matched)continue;const e=Si(t.handler);ze.includes(e)&&i.add(e)}const s=ze.filter(e=>i.has(e)).map(e=>Pe[e]).filter(e=>void 0!==e),o=Vi(e.trace,t);return Bi(s,this.badges,o)}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const i=parseFloat(t.state);return Number.isNaN(i)?null:i}_mismatchActive(){const e=this.discovered.entities.position_mismatch_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualOverrideOn(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(e){const t=this.discovered.entities[e];return!t||"off"!==this.hass.states[t]?.state}_shouldShowResume(e){return!(!this.discovered.entities.reset_override_button||!this._manualOverrideOn()&&"custom_position"!==Si(e))}_renderSlots(e){if(!e)return q;const t=e.filter(e=>null!==e.sensor);return 0===t.length?q:V`<div class="slots-section">
      <div class="slots-label">${Ue("dialog.custom_positions",this.hass)}</div>
      ${t.map(e=>this._renderSlotRow(e))}
    </div>`}_renderSlotRow(e){const t=e.sensor_name??`#${e.slot}`,i=e.sensors?.length??0,s=!0===e.template?V`<span
            class="slot-template"
            ${xt("Template"+(i>0?` · ${i} sensors${e.template_mode?` (${e.template_mode})`:""}`:""))}
          >
            <ha-icon icon="mdi:code-braces"></ha-icon>
          </span>`:q;return V`<div class="slot-row" data-slot=${e.slot}>
      <span class="slot-label">${t}</span>
      ${s}
      <span class="slot-position">${ri(e.position)}</span>
      ${!0===e.min_mode?V`<span
            class="slot-min-mode${null!=e.priority&&e.priority>80?"":" is-bypassable"}"
            ${xt(Ue("dialog.floor_tooltip",this.hass))}
          >
            ${Ue("dialog.floor",this.hass)}
          </span>`:q}
      <button
        class="slot-toggle ${e.enabled?"on":"off"}"
        type="button"
        aria-label=${e.enabled?Ue("dialog.disable_slot",this.hass,{slot:e.slot}):Ue("dialog.enable_slot",this.hass,{slot:e.slot})}
        @click=${()=>this._toggleSlot(e)}
      >
        ${e.enabled?Ue("dialog.on",this.hass):Ue("dialog.off",this.hass)}
      </button>
    </div>`}_renderControls(){const e=[{role:"automatic_control_switch",label:Ue("dialog.automatic",this.hass)},{role:"climate_mode_switch",label:Ue("dialog.climate",this.hass)},{role:"motion_control_switch",label:Ue("dialog.motion",this.hass)}].filter(e=>!!this.discovered.entities[e.role]);return 0===e.length?q:V`<div class="controls-block">
      <div class="controls-label">${Ue("dialog.controls",this.hass)}</div>
      <div class="controls-row">${e.map(e=>this._renderSwitchChip(e.role,e.label))}</div>
    </div>`}_renderSwitchChip(e,t){const i=this.discovered.entities[e],s="on"===this.hass.states[i]?.state,o=Ue(s?"dialog.state_on":"dialog.state_off",this.hass),n=Ue(s?"dialog.on":"dialog.off",this.hass);return V`<button
      class="ctrl-toggle ${s?"on":"off"}"
      type="button"
      aria-pressed=${s}
      aria-label=${Ue("dialog.toggle_hint",this.hass,{label:t,state:o})}
      @click=${()=>this._toggleSwitch(i,s)}
    >
      <span class="ctrl-label">${t}</span>
      <span class="ctrl-state">${n}</span>
    </button>`}_toggleSwitch(e,t){this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:e})}_renderForecastStrip(){const e=this.discovered.entities.position_forecast_sensor;if(!e)return q;const t=this.hass.states[e]?.attributes,i=t?.forecast??[],s=t?.events??[];if(0===i.length)return q;const o={};for(const e of Ni(this.discovered))o[e.id]=e.label;return V`<div class="forecast-block">
      <div class="forecast-label">${Ue("dialog.todays_forecast",this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${i}
        .events=${s}
        .now=${Date.now()}
        .axisLabels=${o}
      ></acp-forecast-strip>
      <div class="forecast-note">${Ue("forecast.solar_only_note",this.hass)}</div>
    </div>`}_toggleSlot(e){const t=this.discovered.managed_covers[0];t&&this.hass.callService(Ee,"set_custom_position",{entity_id:t,slot:e.slot,enabled:!e.enabled})}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};function gs(e){return V`
    <div
      class="editor-footer"
      style="display:flex;align-items:center;justify-content:space-between;gap:8px;"
    >
      <a href=${"https://www.buymeacoffee.com/jrhubott"} target="_blank" rel="noopener noreferrer">
        <img src=${"https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black"} alt=${Ue("editor.common.support_alt",e)} height="20" />
      </a>
      <span class="version-footer dim">
        ${Ue("root.footer_version",e,{version:fe})}
      </span>
    </div>
  `}_s.styles=r`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 5vh 12px;
      overflow-y: auto;
    }
    .dialog {
      width: 100%;
      max-width: 520px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      border-radius: 12px;
      padding: 14px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .header .cover-icon {
      --mdc-icon-size: 22px;
    }
    .header .title {
      font-size: 1.1rem;
      font-weight: 600;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header .badges {
      display: inline-flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .close {
      border: 0;
      background: transparent;
      cursor: pointer;
      font-size: 1.1rem;
      color: var(--secondary-text-color);
      padding: 4px 6px;
    }
    .close:hover {
      color: var(--primary-text-color);
    }
    .icon-btn {
      border: 0;
      background: transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px 6px;
      display: inline-flex;
      align-items: center;
      --mdc-icon-size: 18px;
    }
    .icon-btn:hover {
      color: var(--primary-text-color);
    }
    .summary {
      font-size: 0.9rem;
      font-style: italic;
      color: var(--secondary-text-color);
    }
    .position-block {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
    }
    .position-label {
      color: var(--secondary-text-color);
    }
    .position-value {
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
    .warn {
      color: var(--warning-color, orange);
      --mdc-icon-size: 18px;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .resume {
      padding: 6px 14px;
      border: 1px solid var(--primary-color);
      border-radius: 999px;
      background: transparent;
      color: var(--primary-color);
      font-size: 0.9rem;
      cursor: pointer;
    }
    .resume:hover {
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
    }
    .advanced-toggle {
      border: 0;
      background: transparent;
      cursor: pointer;
      color: var(--primary-color);
      font-size: 0.85rem;
      text-align: left;
      padding: 4px 0;
    }
    .advanced {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .advanced-compass {
      display: flex;
      justify-content: center;
    }
    .slots-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .slots-label {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .slot-row {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 8px;
      align-items: center;
      font-size: 0.85rem;
      padding: 2px 4px;
    }
    .slot-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .slot-position {
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .slot-template {
      display: inline-flex;
      align-items: center;
      color: var(--secondary-text-color);
    }
    /* Floating-tooltip cursor lifecycle for the informational chips (the
       clickable .icon-btn buttons keep their pointer cursor — they are excluded
       from this rule). Help hint on hover, default once OUR bubble appears. */
    .slot-template[data-tooltip]:hover,
    .slot-min-mode[data-tooltip]:hover {
      cursor: help;
    }
    .slot-template[data-tooltip][acp-tt-shown],
    .slot-min-mode[data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    .slot-template ha-icon {
      --mdc-icon-size: 14px;
    }
    .slot-min-mode {
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 999px;
      background: rgba(156, 39, 176, 0.22);
      color: #6a1b9a;
    }
    /* Priority axis: floor whose priority ≤ manual-override is bypassable by a
       manual ↓ → subdued. Per-slot rows have no clamping notion, so no fill/outline. */
    .slot-min-mode.is-bypassable {
      opacity: 0.6;
    }
    .slot-toggle {
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.16));
      background: transparent;
      cursor: pointer;
      font-size: 0.75rem;
      min-width: 40px;
    }
    .slot-toggle.on {
      background: rgba(76, 175, 80, 0.22);
      color: #1b5e20;
      border-color: rgba(76, 175, 80, 0.5);
    }
    .slot-toggle.off {
      color: var(--secondary-text-color);
    }
    .forecast-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .forecast-label {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .forecast-note {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      opacity: 0.75;
    }
    .controls-block {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .controls-label {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .controls-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .ctrl-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.16));
      background: transparent;
      cursor: pointer;
      font-size: 0.8rem;
      color: var(--primary-text-color);
    }
    .ctrl-toggle .ctrl-label {
      font-weight: 500;
    }
    .ctrl-toggle .ctrl-state {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    .ctrl-toggle.on {
      background: rgba(76, 175, 80, 0.16);
      border-color: rgba(76, 175, 80, 0.5);
    }
    .ctrl-toggle.on .ctrl-state {
      color: #1b5e20;
    }
    .ctrl-toggle.off {
      opacity: 0.85;
    }
    .ctrl-toggle:hover {
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
    }
  `,e([_e({attribute:!1})],_s.prototype,"hass",void 0),e([_e({attribute:!1})],_s.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],_s.prototype,"open",void 0),e([_e({type:Boolean})],_s.prototype,"advancedOpen",void 0),e([_e({type:Boolean})],_s.prototype,"showCompass",void 0),e([_e({type:Boolean})],_s.prototype,"showElevationChart",void 0),e([_e({type:Boolean})],_s.prototype,"showSolarCalc",void 0),e([_e({attribute:!1})],_s.prototype,"badges",void 0),_s=e([he("acp-more-info-dialog")],_s);const ms=["auto","solar","force","weather","manual","custom_position","motion","climate","glare_zone","cloud"],fs={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_compass:!0,show_elevation_chart:!0,show_solar_calc:!0,show_motion_icon:!0,layout:"detailed",badge_auto:!0,badge_solar:!0,badge_force:!0,badge_weather:!0,badge_manual:!0,badge_custom_position:!0,badge_motion:!0,badge_climate:!0,badge_glare_zone:!0,badge_cloud:!0},vs={entry_id:"editor.common.entry_id",name:"editor.tile.name",icon:"editor.tile.icon",cover:"editor.tile.cover",layout:"editor.tile.layout",show_position:"editor.tile.show_position",show_state:"editor.tile.show_state",show_decision_summary:"editor.tile.show_decision_summary",show_controls:"editor.tile.show_controls",show_badge:"editor.tile.show_badge",badge_section:"editor.tile.badge_section",badge_auto:"editor.tile.badge_auto",badge_solar:"editor.tile.badge_solar",badge_force:"editor.tile.badge_force",badge_weather:"editor.tile.badge_weather",badge_manual:"editor.tile.badge_manual",badge_custom_position:"editor.tile.badge_custom_position",badge_motion:"editor.tile.badge_motion",badge_climate:"editor.tile.badge_climate",badge_glare_zone:"editor.tile.badge_glare_zone",badge_cloud:"editor.tile.badge_cloud",show_compass:"editor.tile.show_compass",show_elevation_chart:"editor.tile.show_elevation_chart",show_solar_calc:"editor.tile.show_solar_calc",show_motion_icon:"editor.tile.show_motion_icon",tap_action:"editor.tile.tap_action",hold_action:"editor.tile.hold_action",double_tap_action:"editor.tile.double_tap_action"};let ys=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=e=>{const t=vs[e.name];return t?Ue(t,this.hass):e.name},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,i]of Object.entries(fs))e.startsWith("badge_")?t[e]===i&&delete t[e]:this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==i||delete t[e];const i={};for(const e of ms){const s=`badge_${e}`;!1===t[s]&&(i[e]=!1),delete t[s]}const s={...this._config??{type:"",entry_id:""},...t};Object.keys(i).length>0?s.badges=i:delete s.badges,this._emit(s)}}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),e.has("_registry")&&null!==this._registry&&this._maybePrefillCover()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Mt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id}),this._maybePrefillCover()}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,Et(this.hass).then(e=>{this._registry=e,this._maybePrefillCover()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=zt(this.hass,()=>{this._registryFetchInFlight=!0,Et(this.hass).then(e=>{this._registry=e}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_maybePrefillCover(){if(!this._config?.entry_id||this._config?.cover||!this._registry||!this.hass)return;const e=St(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=e?.managed_covers??[],1===e?.managed_covers.length&&this._emit({...this._config,cover:e.managed_covers[0]})}render(){if(!this._config)return q;if(this._entriesError&&!this._entries)return V`
        <div class="form">
          <div class="error">
            ${Ue("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${Ue("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${Ue("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          ${gs(this.hass)}
        </div>
      `;const e=this._schema(),{badges:t,...i}=this._config,s={};for(const e of ms)t&&!1===t[e]&&(s[`badge_${e}`]=!1);const o={...fs,...i,...s};return V`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${o}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${this._managedCovers.length>1&&!this._config?.cover?V`<div class="hint">${Ue("editor.tile.cover_blank_hint",this.hass)}</div>`:q}
        ${gs(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[],t=[{value:"one-line",label:Ue("editor.tile.layout_option_one_line",this.hass)},{value:"detailed",label:Ue("editor.tile.layout_option_detailed",this.hass)}];let i={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const e=St(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);e&&e.managed_covers.length>0&&(i={entity:{domain:"cover",include_entities:e.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:i},{name:"layout",selector:{select:{mode:"list",options:t}}},{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{type:"expandable",name:"",title:Ue("editor.tile.badge_section",this.hass),icon:"mdi:label-multiple-outline",schema:[{type:"grid",name:"",schema:ms.map(e=>({name:`badge_${e}`,selector:{boolean:{}}}))}]},{name:"show_motion_icon",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"show_elevation_chart",selector:{boolean:{}}},{name:"show_solar_calc",selector:{boolean:{}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};ys.styles=r`
    :host {
      display: block;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
    }
    .field-label {
      font-weight: 500;
      font-size: 0.88rem;
      color: var(--primary-text-color);
    }
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
    .error {
      font-size: 0.82rem;
      color: var(--error-color, crimson);
    }
    .hint {
      font-size: 0.8rem;
      color: var(--secondary-text-color, #888);
      padding: 4px 0 0;
    }
    .version-footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `,e([_e({attribute:!1})],ys.prototype,"hass",void 0),e([ge()],ys.prototype,"_config",void 0),e([ge()],ys.prototype,"_entries",void 0),e([ge()],ys.prototype,"_entriesError",void 0),e([ge()],ys.prototype,"_registry",void 0),e([ge()],ys.prototype,"_managedCovers",void 0),ys=e([he($e)],ys);let bs=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=$t(),this._discovered=null,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),Pi(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return Pi(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${xe}: \`entry_id\` is required and must be a non-empty string`);let t={...e};if("string"==typeof t.tap_action&&(t={...t,tap_action:"none"===t.tap_action?{action:"none"}:void 0}),this._config=t,t.tooltips&&yt(t.tooltips),null===this._registry){const e=Rt.get(t.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 1}getGridOptions(){return{columns:"full",rows:"auto",min_columns:3,min_rows:"one-line"!==this._config?.layout?2:1}}static async getStubConfig(e){let t="";try{const i=await Mt(e);t=i[0]?.entry_id??""}catch{}return{type:`custom:${xe}`,entry_id:t}}static async getConfigElement(){return document.createElement($e)}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Ft();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||me(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zt(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Tt(this.hass,e).then(e=>{t===this._fetchGen&&e!==this._registry&&(this._registry=e,this._registryError=null,this._config&&Rt.set(this._config.entry_id,jt(e,this._config.entry_id)))}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return V`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Ue("tile.registry_failed",this.hass,{error:this._registryError}):Ue("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=this._discovered;return e?V`
      <ha-card>${this._renderTile(e)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${e}
        .open=${this._dialogOpen}
        .showCompass=${!1!==this._config.show_compass}
        .showElevationChart=${!1!==this._config.show_elevation_chart}
        .showSolarCalc=${!1!==this._config.show_solar_calc}
        .badges=${this._config.badges}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `:V`<ha-card>
        <div class="empty">
          <p class="dim">
            ${Ue("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`}_buildHandlerLabels(){const e={};for(const[t,i]of Object.entries(Oe))e[t]=Ue(i,this.hass);return e}_renderTile(e){const t=this._config,i=t.name??e.entry_title,s=this._resolvedCover(e),o=t.icon??function(e,t){if(null!==t&&!Number.isNaN(t)){if(t>=95)return Fe[e]??"mdi:window-shutter-open";if(t<=5)return Te[e]??"mdi:window-shutter"}return Ie[e]??"mdi:window-shutter"}(e.cover_type,this._liveCoverPosition(s)),n=!1!==t.show_position,r=!1!==t.show_state,a=!1!==t.show_controls,l=!1!==t.show_badge,c=!1!==t.show_motion_icon?this._motionActiveState(e):null,d=Ue("timeout_pending"===c?"tile.motion_pending":"tile.motion_detected",this.hass),h="one-line"!==t.layout,u=this._currentPosition(e),p=this._liveCoverPosition(s),_=p??u,g=Ni(e).find(e=>"position"!==e.id),m=!1!==t.show_tilt&&!!g,f=g?this._liveAxis(s,g):null,v=g?this._axisTarget(e,g):null,y=null!==p&&p>=100,b=null!==p&&p<=0,w=this._winner(e),x=this._traceAttrs(e),$=this._manualEndIso(e),k=this._isFullyInert(t),A=Ci(x),C=!0===t.show_decision_summary&&x?Ei(x.trace??[],x,0,this._buildHandlerLabels(),Ue("badge.safety",this.hass)):"",S=!!C&&h,E=this._switchOn(e,"integration_enabled_switch"),z=this._switchOn(e,"automatic_control_switch"),M=this._manualOverrideOn(e),O=function(e){const t=function(e){const t=Li(e);return"motion"!==t?t:!1===e.badges?.motion||e.showMotionIcon?!1===e.badges?.auto?null:"auto":t}(e);return!1===e.inTimeWindow&&!1!==e.badges?.off_schedule&&"off"!==t&&"manual"!==t&&"force"!==t?"off_schedule":t}({winner:w,integrationEnabled:E,manualActive:M,badges:t.badges,showMotionIcon:!1!==t.show_motion_icon,inTimeWindow:x?.in_time_window}),I=Vi(x?.trace,w),F=null!==O&&Bi([O],t.badges,I).length>0,T=l&&F&&!(!1===z&&!0===E),P=function(e){if(!e.integrationEnabled)return!1;if(!e.automaticControl)return!1;if(e.manualActive)return!1;const t=Si(e.winner);return"force"!==t&&("custom_position"!==t||!e.bypassAutoControl&&!0!==e.safetyActive)}({winner:w,integrationEnabled:E,automaticControl:z,manualActive:M,bypassAutoControl:!0===x?.bypass_auto_control,safetyActive:A}),R=h&&l&&!1!==t.badges?.auto&&P,N=!(R&&"auto"===O),j=r?function(e,t){if(!e||!t)return null;const i=e.states[t];if(!i?.state||"unknown"===i.state||"unavailable"===i.state)return null;if("function"==typeof e.formatEntityState){const t=e.formatEntityState(i);if(t)return t}if("function"==typeof e.localize){const t=e.localize(`component.cover.entity_component._.state.${i.state}`);if(t)return t}return i.state.charAt(0).toUpperCase()+i.state.slice(1)}(this.hass,s):null,D=[j,n&&null!==_?ri(_):null,m&&!h&&null!==f?`⟂${ri(f)}`:null].filter(e=>!!e),B=!!j,K=function(e,t,i){if(!Array.isArray(e?.custom_position_slots))return null;const s=e.custom_position_slots.filter(e=>!0===e.min_mode&&!0===e.enabled&&null!==e.sensor&&null!==e.position&&"on"===t[e.sensor]?.state);if(0===s.length)return null;const o=s.reduce((e,t)=>(t.position??0)>(e.position??0)?t:e),n=o.position,r=o.priority??null;return{slot:o.slot,position:n,label:o.sensor_name??`#${o.slot}`,clamping:null!==i&&n>i,sensorOn:!0,priority:r,resistsManual:null!=r&&r>80}}(x,this.hass.states,u),G=Si(w),L=!!K&&!("custom_position"===G&&!0===x?.custom_position_minimum_mode)&&E,W=M&&!!e.entities.reset_override_button,U=D.length>0?V`<div class="position">${D.join(" · ")}</div>`:q,Y=L?V`<span
          class=${`acp-floor-chip${K.clamping?"":" is-armed"}${K.resistsManual?" resists-manual":" is-bypassable"}`}
          ${xt(Ue("dialog.floor_tooltip",this.hass))}
          >${Ue("dialog.floor",this.hass)} ${ri(K.position)}</span
        >`:q,H=T?V`<acp-tile-badge
          .hass=${this.hass}
          .winner=${w}
          .kindOverride=${O??void 0}
          .integrationEnabled=${E}
          .slotNumber=${x?.custom_position_active_slot}
          .slotName=${x?.custom_position_active_slot_name}
          .pct=${Ai(x,u)??void 0}
          .minimumMode=${x?.custom_position_minimum_mode}
          .safetyActive=${A}
          .manualEndIso=${$}
          .manualActive=${M}
          .resumable=${W}
          @acp-resume=${()=>this._resume(e)}
        ></acp-tile-badge>`:q,Q=R?V`<acp-tile-badge
          .hass=${this.hass}
          .winner=${w}
          .kindOverride=${"auto"}
          .integrationEnabled=${E}
        ></acp-tile-badge>`:q;return V`
      <div
        class=${`tile-body${h?" detailed":""}${S?" has-summary":""}${B?" has-state-label":""}${L?" has-floor-chip":""}${m&&h?" has-tilt":""}`}
        role=${k?"group":"button"}
        tabindex=${k?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
          <ha-icon class="cover-icon" icon=${o}></ha-icon>
          ${c?V`<ha-icon
                class="motion-overlay ${c}"
                icon="mdi:motion-sensor"
                ${xt(d)}
              ></ha-icon>`:q}
        </div>
        <div class="label">
          <div class="title">${i}</div>
          ${C&&!h?V`<div class="summary">${C}</div>`:q}
          ${S?V`<div class="summary inline-summary" ${xt(C)}>${C}</div>`:q}
        </div>
        ${h&&R?V`<div class="auto-line">${Q}</div>`:q}
        ${h?V`<div class="detail-line">
              ${U}${Y}${N?H:q}
            </div>`:V`${U}${Y}`}
        ${m&&h?V`<div
              class="tilt-line"
              @click=${this._stop}
              @pointerdown=${this._stop}
              @pointerup=${this._stop}
            >
              <acp-tilt-bar
                layout="tile"
                .hass=${this.hass}
                .label=${g?this._axisLabel(g):null}
                .min=${g?.min??0}
                .max=${g?.max??100}
                .unit=${g?.unit??"%"}
                .actual=${f}
                .target=${v}
                @acp-tilt-set=${e=>g&&this._setAxis(s,g.id,e.detail)}
              ></acp-tilt-bar>
            </div>`:q}
        ${a?V`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${Ue("tile.open",this.hass)}
                ?disabled=${!s||y}
                @click=${()=>this._setCoverPosition(s,100)}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${Ue("tile.stop",this.hass)}
                ?disabled=${!s}
                @click=${()=>this._stopCover(s)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${Ue("tile.close",this.hass)}
                ?disabled=${!s||b}
                @click=${()=>this._setCoverPosition(s,0)}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </div>`:q}
        ${h?q:H}
      </div>
    `}_resolvedCover(e){return this._config?.cover?this._config.cover:e.managed_covers[0]}_currentPosition(e){const t=e.entities.target_position_sensor;if(!t)return null;const i=this.hass.states[t];if(!i)return null;const s=parseFloat(i.state);return Number.isNaN(s)?null:s}_liveCoverPosition(e){if(!e)return null;const t=this.hass.states[e]?.attributes?.current_position;return"number"!=typeof t||Number.isNaN(t)?null:t}_winner(e){const t=e.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(e){const t=e.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_motionActiveState(e){const t=e.entities.motion_status_sensor;if(!t)return null;const i=this.hass.states[t]?.state;return"motion_detected"===i||"timeout_pending"===i?i:null}_manualOverrideOn(e){const t=e.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(e,t){const i=e.entities[t];return!i||"off"!==this.hass.states[i]?.state}_manualEndIso(e){if(!this._manualOverrideOn(e))return;const t=e.entities.manual_override_end_sensor;return t?this.hass.states[t]?.state:void 0}_setCoverPosition(e,t){e&&this._setAxis(e,"position",t)}_stopCover(e){e&&this.hass.callService(Ee,"stop",{},{entity_id:e})}_setAxis(e,t,i){e&&Di(this.hass,e,{[t]:i})}_axisTarget(e,t){const i=t.targetRole;if(!i)return null;const s=e.entities[i];if(!s)return null;const o=parseFloat(this.hass.states[s]?.state??"");return Number.isNaN(o)?null:o}_liveAxis(e,t){if(!e||!t.stateAttr)return null;const i=this.hass.states[e]?.attributes?.[t.stateAttr];return"number"!=typeof i||Number.isNaN(i)?null:i}_axisLabel(e){const t=Ke[e.id];return t?Ue(t,this.hass):e.label}_resume(e){const t=e.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}_tapActionConfig(){const e=this._config?.tap_action;if("string"!=typeof e)return e}_isFullyInert(e){return!!(e=>!!e&&"none"===e.action)(this._tapActionConfig())&&!Pi(e.hold_action)&&!Pi(e.double_tap_action)}_fireAction(e){if(!this._config||!this.hass)return;const t=this._tapActionConfig();if("tap"===e&&void 0===t)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const i=this._resolvedCoverFromState();((e,t,i,s)=>{let o;"double_tap"===s&&i.double_tap_action?o=i.double_tap_action:"hold"===s&&i.hold_action?o=i.hold_action:"tap"===s&&i.tap_action&&(o=i.tap_action),((e,t,i,s)=>{if(s||(s={action:"more-info"}),!s.confirmation||s.confirmation.exemptions&&s.confirmation.exemptions.some(e=>e.user===t.user.id)||(Ti("warning"),confirm(s.confirmation.text||`Are you sure you want to ${s.action}?`)))switch(s.action){case"more-info":(i.entity||i.camera_image)&&Fi(e,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":s.navigation_path&&((e,t,i=!1)=>{i?history.replaceState(null,"",t):history.pushState(null,"",t),Fi(window,"location-changed",{replace:i})})(0,s.navigation_path);break;case"url":s.url_path&&window.open(s.url_path);break;case"toggle":i.entity&&(((e,t)=>{((e,t,i=!0)=>{const s=function(e){return e.substr(0,e.indexOf("."))}(t),o="group"===s?"homeassistant":s;let n;switch(s){case"lock":n=i?"unlock":"lock";break;case"cover":n=i?"open_cover":"close_cover";break;default:n=i?"turn_on":"turn_off"}e.callService(o,n,{entity_id:t})})(e,t,Ii.includes(e.states[t].state))})(t,i.entity),Ti("success"));break;case"call-service":{if(!s.service)return void Ti("failure");const[e,i]=s.service.split(".",2);t.callService(e,i,s.service_data,s.target),Ti("success");break}case"fire-dom-event":Fi(e,"ll-custom",s)}})(e,t,i,o)})(this,this.hass,{entity:i,tap_action:t,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},e)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const e=this._discovered??this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?.managed_covers[0]}_stop(e){e.stopPropagation()}};bs.styles=r`
    :host {
      display: block;
      height: 100%;
    }
    ha-card {
      padding: 6px 10px;
      overflow: hidden;
      height: 100%;
      box-sizing: border-box;
      /* Center the tile body vertically so a taller-than-default grid cell
         (Sections drag-resize) keeps the content centered rather than top-aligned. */
      display: flex;
      flex-direction: column;
      justify-content: center;
      /* In HA's "Sections" view the tile width is driven by the dashboard
         column, not the viewport, so @media can't see the squeeze. Make the
         card a query container (issue #136) so the detailed layout can reflow
         its controls onto their own row once the column gets narrow. */
      container-type: inline-size;
    }
    .tile-body {
      display: grid;
      /* Position column is fixed-width so the controls land at the same x
         across stacked tiles regardless of the digit count (87% vs 100%). */
      grid-template-columns: 24px minmax(0, 1fr) 3rem auto auto;
      grid-template-areas: 'icon label position controls badge';
      align-items: center;
      column-gap: 8px;
      row-gap: 2px;
      cursor: pointer;
      user-select: none;
      min-width: 0;
    }
    /* When the state label is rendered ("Open · 12%") the position cell needs
       to grow to fit variable-width text. Strict tile-to-tile alignment of the
       ▲ ■ ▼ controls is impossible once the label is variable, so we let
       the cell auto-size. */
    .tile-body.has-state-label {
      grid-template-columns: 24px minmax(0, 1fr) auto auto auto;
    }
    /* Detailed layout: title row, then a state row that inlines the position
       text + contextual badge + floor chip (.detail-line). Icon spans both
       rows so it's vertically centered; controls float to the right of rows
       1-2 (HA tile-card style). Always two rows — the Resume action is folded
       into the Manual badge rather than getting its own row. */
    .tile-body.detailed {
      grid-template-columns: 24px minmax(0, 1fr) auto auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label       auto-line   controls'
        'icon detail-line detail-line controls';
      row-gap: 2px;
    }
    /* The standalone Auto indicator (issue #110) rides right-aligned on the
       title row — same line as the cover name, above the state line — so the
       tile stays two text lines tall. When absent the cell collapses to 0px. */
    .auto-line {
      grid-area: auto-line;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      min-width: 0;
    }
    .auto-line acp-tile-badge {
      overflow: visible;
    }
    .detail-line {
      grid-area: detail-line;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .detail-line .position {
      padding: 0;
      text-align: left;
      /* Push the badge + floor chip to the right edge of the row so they sit
         flush against the controls column. */
      margin-right: auto;
    }
    .detail-line acp-tile-badge {
      overflow: visible;
    }
    .tile-body.detailed.has-state-label {
      grid-template-columns: 24px minmax(0, 1fr) auto auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label       auto-line   controls'
        'icon detail-line detail-line controls';
    }
    /* Dual-axis venetian: add a third full-width row for the mini tilt bar,
       beneath the detail line and spanning under the controls column. */
    .tile-body.detailed.has-tilt,
    .tile-body.detailed.has-tilt.has-state-label {
      grid-template-rows: auto auto auto;
      /* The tilt row skips the icon column so "TILT" aligns with the state text
         ("open · 60%") rather than the icon. */
      grid-template-areas:
        'icon label       auto-line   controls'
        'icon detail-line detail-line controls'
        '.    tilt-line   tilt-line   tilt-line';
    }
    .tilt-line {
      grid-area: tilt-line;
      min-width: 0;
      margin-top: 2px;
      cursor: default;
    }
    .tile-body.detailed.has-summary .label {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }
    .tile-body.detailed.has-summary .label .title {
      flex: 1 1 auto;
      min-width: 0;
    }
    .tile-body.detailed.has-summary .label .inline-summary {
      flex: 0 1 auto;
      text-align: right;
    }
    .tile-body.detailed .position {
      text-align: left;
      padding: 0;
    }
    .tile-body.detailed .controls {
      align-self: center;
      gap: 6px;
    }
    .tile-body.detailed .controls button {
      width: 56px;
      height: 44px;
      border-radius: 12px;
      border: none;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
    .tile-body.detailed .controls button ha-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-text-color);
    }
    .tile-body.detailed .controls button:hover {
      background: var(--divider-color, rgba(127, 127, 127, 0.25));
    }
    .tile-body.detailed .cover-icon-wrap {
      place-self: center;
    }
    .tile-body[role='group'] {
      cursor: default;
    }
    .cover-icon-wrap {
      grid-area: icon;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    .cover-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-text-color);
    }
    .motion-overlay {
      position: absolute;
      top: -4px;
      right: -6px;
      --mdc-icon-size: 12px;
      color: var(--warning-color, #f1c232);
      background: var(--card-background-color, white);
      border-radius: 50%;
      padding: 1px;
      line-height: 0;
    }
    .label {
      grid-area: label;
      min-width: 0;
    }
    .title {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .summary {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .position {
      grid-area: position;
      font-size: 0.85rem;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
      padding: 0 4px;
      /* Right-align the digits so the % sign sits flush against the controls
         column edge — combined with the fixed-width position grid column, this
         keeps the ▲ ■ ▼ row aligned across stacked tiles. */
      text-align: right;
    }
    .controls {
      grid-area: controls;
      display: inline-flex;
      gap: 2px;
    }
    .controls button {
      width: 26px;
      height: 26px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.8rem;
      line-height: 1;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .controls button ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-text-color);
      line-height: 0;
    }
    .controls button:hover {
      background: var(--secondary-background-color);
    }
    .controls button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    acp-tile-badge {
      grid-area: badge;
      min-width: 0;
      overflow: hidden;
    }
    .acp-floor-chip {
      grid-area: floor-chip;
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 999px;
      background: rgba(156, 39, 176, 0.22);
      color: #6a1b9a;
      /* Reserve the border so the outline (is-armed) state doesn't shift layout. */
      border: 1px solid transparent;
      white-space: nowrap;
      align-self: center;
    }
    /* Floating-tooltip cursor lifecycle for the tooltip carriers inside the
       tile (floor chip, title, inline summary, motion overlay). Help hint on
       hover, default once OUR bubble appears. */
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    /* Clamping axis: not-clamping → hollow/outline (transparent fill + purple border). */
    .acp-floor-chip.is-armed {
      background: transparent;
      border-color: rgba(156, 39, 176, 0.5);
    }
    /* Priority axis: bypassable (priority ≤ 80) → subdued. */
    .acp-floor-chip.is-bypassable {
      opacity: 0.6;
    }
    /* Priority axis: resists manual ↓ (priority > 80) → emphasized. */
    .acp-floor-chip.resists-manual {
      font-weight: 600;
    }
    /* One-line layout: add a second row for the floor chip under the position cell */
    .tile-body.has-floor-chip {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label     position  controls badge resume'
        'icon label     floor-chip .        .     .';
    }
    .tile-body.has-state-label.has-floor-chip {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label     position  controls badge resume'
        'icon label     floor-chip .        .     .';
    }
    /* Detailed layout: the floor chip rides inline on the state line
       (.detail-line), so these just re-assert the detailed grid — the
       one-line .has-floor-chip rules have equal specificity and would
       otherwise win by source order. */
    .tile-body.detailed.has-floor-chip {
      grid-template-columns: 24px minmax(0, 1fr) auto auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label       auto-line   controls'
        'icon detail-line detail-line controls';
    }
    .tile-body.detailed.has-row3.has-floor-chip {
      grid-template-columns: 24px minmax(0, 1fr) auto auto;
      grid-template-rows: auto auto auto;
      grid-template-areas:
        'icon label       auto-line   controls'
        'icon detail-line detail-line controls'
        'icon resume      resume      resume';
    }
    /* Reflow (issues #136, #154): drop the ↑■▼ controls onto their own
       full-width row beneath the name so the cover name gets the whole column.
       The same reflow fires from two independent triggers, because "the tile is
       narrow" alone can't tell a phone from a medium tile in a multi-column
       desktop dashboard — both can be ~400px wide:

         1. #154 — a phone: the whole viewport is narrow (≤500px) AND the tile is
            near full-width (≤480px). Gated on the *viewport*, not the container
            alone, so a ~400px tile on a wide laptop screen keeps the inline
            layout and does not grow an extra control row (the bug from blanket
            @container 450px).
         2. #136 — a desktop "Sections" narrow column (≤340px): the tile width is
            column-driven on a wide viewport, so @media can't see the squeeze;
            the bare container query catches the genuinely-tiny column.

       The two blocks below are identical reflow declarations — keep them in
       sync. Each detailed grid variant is re-asserted (placed after the wide
       rules so it wins when a query matches — the grid rules rely on source
       order, not just specificity). */
    @media (max-width: 500px) {
      @container (max-width: 480px) {
        .tile-body.detailed,
        .tile-body.detailed.has-state-label,
        .tile-body.detailed.has-floor-chip {
          grid-template-columns: 24px minmax(0, 1fr) auto;
          grid-template-rows: auto auto auto;
          grid-template-areas:
            'icon label       auto-line'
            'icon detail-line detail-line'
            'controls controls controls';
        }
        .tile-body.detailed.has-row3.has-floor-chip {
          grid-template-columns: 24px minmax(0, 1fr) auto;
          grid-template-rows: auto auto auto auto;
          grid-template-areas:
            'icon label       auto-line'
            'icon detail-line detail-line'
            'icon resume      resume'
            'controls controls controls';
        }
        .tile-body.detailed .controls {
          margin-top: 4px;
          gap: 6px;
          justify-content: space-between;
        }
        .tile-body.detailed .controls button {
          flex: 1 1 0;
          width: auto;
          height: 40px;
        }
      }
    }
    @container (max-width: 340px) {
      .tile-body.detailed,
      .tile-body.detailed.has-state-label,
      .tile-body.detailed.has-floor-chip {
        grid-template-columns: 24px minmax(0, 1fr) auto;
        grid-template-rows: auto auto auto;
        grid-template-areas:
          'icon label       auto-line'
          'icon detail-line detail-line'
          'controls controls controls';
      }
      .tile-body.detailed.has-row3.has-floor-chip {
        grid-template-columns: 24px minmax(0, 1fr) auto;
        grid-template-rows: auto auto auto auto;
        grid-template-areas:
          'icon label       auto-line'
          'icon detail-line detail-line'
          'icon resume      resume'
          'controls controls controls';
      }
      /* Controls now own a full-width row — spread the three buttons across it
         and trim their fixed 56px width so they share the space evenly. */
      .tile-body.detailed .controls {
        margin-top: 4px;
        gap: 6px;
        justify-content: space-between;
      }
      .tile-body.detailed .controls button {
        flex: 1 1 0;
        width: auto;
        height: 40px;
      }
    }
    .empty {
      padding: 12px;
      text-align: center;
    }
    .dim {
      color: var(--secondary-text-color);
      margin: 0;
    }
  `,e([_e({attribute:!1})],bs.prototype,"hass",void 0),e([ge()],bs.prototype,"_config",void 0),e([ge()],bs.prototype,"_registry",void 0),e([ge()],bs.prototype,"_registryError",void 0),e([ge()],bs.prototype,"_dialogOpen",void 0),bs=e([he(xe)],bs),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===xe)||window.customCards.push({type:xe,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const ws=[{key:"sky",labelKey:"editor.main.section_sky_label",descKey:"editor.main.section_sky_desc"},{key:"elevation",labelKey:"editor.main.section_elevation_label",descKey:"editor.main.section_elevation_desc"},{key:"decision",labelKey:"editor.main.section_decision_label",descKey:"editor.main.section_decision_desc"},{key:"covers",labelKey:"editor.main.section_covers_label",descKey:"editor.main.section_covers_desc"},{key:"overrides",labelKey:"editor.main.section_overrides_label",descKey:"editor.main.section_overrides_desc"},{key:"climate",labelKey:"editor.main.section_climate_label",descKey:"editor.main.section_climate_desc"},{key:"solar",labelKey:"editor.main.section_solar_label",descKey:"editor.main.section_solar_desc",enabledByDefault:!1}],xs=ws.filter(e=>!1!==e.enabledByDefault).map(e=>e.key);let $s=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Mt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??xs}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_onEntryChange(e){const t=e.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:t})}_onSectionToggle(e,t){const i=new Set(this._currentSections);t?i.add(e):i.delete(e);const s=ws.map(e=>e.key).filter(e=>i.has(e));this._emit({...this._config??{type:"",entry_id:""},show_sections:s})}_onCompactToggle(e){this._emit({...this._config??{type:"",entry_id:""},compact:e})}_onCompassStatsToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:e})}_onCompassLegendToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:e})}_onMoonToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_moon:e})}_onHideInactiveToggle(e){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:e})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),i=Number.isFinite(t)?t:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:i})}_onControlToggle(e,t){const i=this._config??{type:"",entry_id:""};this._emit({...i,controls:{...i.controls,[e]:t}})}_onCoverColorChange(e){const t=this._config??{type:"",entry_id:""};this._emit({...t,cover_colors:[e]})}_onCoverColorReset(){const e={...this._config??{type:"",entry_id:""}};delete e.cover_colors,this._emit(e)}render(){if(!this._config)return q;const e=new Set(this._currentSections);return V`
      <div class="form">
        <div class="section">
          <label class="field-label">${Ue("editor.common.entry_id",this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${Ue("editor.main.sections",this.hass)}</label>
          <div class="hint">${Ue("editor.main.sections_hint",this.hass)}</div>
          ${ws.map(t=>V`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${e.has(t.key)}
                  @change=${e=>this._onSectionToggle(t.key,e.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${Ue(t.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${Ue(t.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${Ue("editor.main.controls",this.hass)}</label>
          <div class="hint">${Ue("editor.main.controls_hint",this.hass)}</div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.integration_enabled??!0}
              @change=${e=>this._onControlToggle("integration_enabled",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${Ue("editor.main.integration_pill_label",this.hass)}</span
              >
              <span class="toggle-desc">${Ue("editor.main.integration_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.automatic_control??!0}
              @change=${e=>this._onControlToggle("automatic_control",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Ue("editor.main.automatic_pill_label",this.hass)}</span>
              <span class="toggle-desc">${Ue("editor.main.automatic_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.reset_manual_override??!0}
              @change=${e=>this._onControlToggle("reset_manual_override",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Ue("editor.main.reset_button_label",this.hass)}</span>
              <span class="toggle-desc">${Ue("editor.main.reset_button_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        ${this._config.entry_id?V`
              <div class="section">
                <label class="field-label">${Ue("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${Ue("editor.compass.cover_colors_hint",this.hass)}</div>
                ${(()=>{const e=this._config.cover_colors?.[0]??null,t=e??_i(0);return V`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${t}
                        @change=${e=>this._onCoverColorChange(e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-desc"
                          >${e||Ue("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!e}
                        @click=${()=>this._onCoverColorReset()}
                      >
                        ${Ue("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})()}
              </div>
            `:q}

        <div class="section">
          <label class="field-label">${Ue("editor.main.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${e=>this._onCompactToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Ue("editor.main.compact_label",this.hass)}</span>
              <span class="toggle-desc">${Ue("editor.main.compact_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_compass_stats??!0}
              @change=${e=>this._onCompassStatsToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${Ue("editor.main.show_compass_stats_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${Ue("editor.main.show_compass_stats_desc",this.hass)}</span
              >
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_compass_legend??!0}
              @change=${e=>this._onCompassLegendToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${Ue("editor.main.show_compass_legend_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${Ue("editor.main.show_compass_legend_desc",this.hass)}</span
              >
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_moon??!1}
              @change=${e=>this._onMoonToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Ue("editor.main.show_moon_label",this.hass)}</span>
              <span class="toggle-desc">${Ue("editor.main.show_moon_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.hide_inactive_handlers??!1}
              @change=${e=>this._onHideInactiveToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Ue("editor.main.hide_inactive_label",this.hass)}</span>
              <span class="toggle-desc">${Ue("editor.main.hide_inactive_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">${Ue("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${Ue("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${gs(this.hass)}
      </div>
    `}_renderEntryPicker(){return this._entriesError?V`
        <div class="error">
          ${Ue("editor.common.load_failed",this.hass,{error:this._entriesError})}
        </div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder=${Ue("editor.common.entry_id_manual_placeholder",this.hass)}
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?V`
        <div class="error">
          ${Ue("editor.common.no_entries",this.hass)}
          <code>${Ue("editor.common.no_entries_path",this.hass)}</code>${Ue("editor.common.no_entries_then",this.hass)}
        </div>
      `:V`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(e=>e.entry_id===this._config.entry_id)?V`<option value=${this._config.entry_id}>
              ${Ue("editor.common.unknown_entry",this.hass,{entry:this._config.entry_id})}
            </option>`:q}
        ${this._entries.map(e=>V`
            <option value=${e.entry_id} ?selected=${e.entry_id===this._config?.entry_id}>
              ${e.title}
            </option>
          `)}
      </select>
    `:V`<div class="hint">${Ue("editor.common.loading_entries",this.hass)}</div>`}};$s.styles=r`
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
    .color-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
    }
    .color-row input[type='color'] {
      width: 32px;
      height: 32px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 2px;
      background: none;
      cursor: pointer;
      flex-shrink: 0;
    }
    .color-row .toggle-text {
      flex: 1;
    }
    .reset-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      cursor: pointer;
      flex-shrink: 0;
    }
    .reset-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    code {
      background: var(--code-editor-background-color, rgba(0, 0, 0, 0.08));
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 0.85em;
    }
    .version-footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `,e([_e({attribute:!1})],$s.prototype,"hass",void 0),e([ge()],$s.prototype,"_config",void 0),e([ge()],$s.prototype,"_entries",void 0),e([ge()],$s.prototype,"_entriesError",void 0),$s=e([he(ye)],$s);const ks=[{key:"compact",labelKey:"editor.compass.toggle_compact_label",descKey:"editor.compass.toggle_compact_desc",defaultOn:!1},{key:"show_legend",labelKey:"editor.compass.toggle_legend_label",descKey:"editor.compass.toggle_legend_desc",defaultOn:!0},{key:"show_stats",labelKey:"editor.compass.toggle_stats_label",descKey:"editor.compass.toggle_stats_desc",defaultOn:!0},{key:"show_moon",labelKey:"editor.compass.toggle_moon_label",descKey:"editor.compass.toggle_moon_desc",defaultOn:!1},{key:"show_cardinals",labelKey:"editor.compass.toggle_cardinals_label",descKey:"editor.compass.toggle_cardinals_desc",defaultOn:!0},{key:"show_blind_spot",labelKey:"editor.compass.toggle_blind_spot_label",descKey:"editor.compass.toggle_blind_spot_desc",defaultOn:!0},{key:"show_sun_path",labelKey:"editor.compass.toggle_sun_path_label",descKey:"editor.compass.toggle_sun_path_desc",defaultOn:!0},{key:"show_sunrise_sunset",labelKey:"editor.compass.toggle_sunrise_sunset_label",descKey:"editor.compass.toggle_sunrise_sunset_desc",defaultOn:!0},{key:"show_cover_fill",labelKey:"editor.compass.toggle_cover_fill_label",descKey:"editor.compass.toggle_cover_fill_desc",defaultOn:!0},{key:"show_window_arrow",labelKey:"editor.compass.toggle_window_arrow_label",descKey:"editor.compass.toggle_window_arrow_desc",defaultOn:!0},{key:"show_elevation_chart",labelKey:"editor.compass.toggle_elevation_chart_label",descKey:"editor.compass.toggle_elevation_chart_desc",defaultOn:!0}];let As=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Mt(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${be}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let i=0;i<e.length;i++)e[i]&&(t=i);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,i){const s=this._trimColors(t),{cover_colors:o,...n}=e,r=s?{...n,...i,cover_colors:s}:{...n,...i};this._emit(r)}_onCoverColorChange(e,t){const i=this._baseConfig(),s=[...i.cover_colors??[]];for(;s.length<=e;)s.push(null);s[e]=t,this._emitWithColors(i,s)}_onCoverColorReset(e){const t=this._baseConfig(),i=[...t.cover_colors??[]];e<i.length&&(i[e]=null),this._emitWithColors(t,i)}_onEntryToggle(e,t){const i=this._baseConfig(),s=new Set(i.entry_ids);t?s.add(e):s.delete(e);const o=(this._entries??[]).map(e=>e.entry_id).filter(e=>s.has(e)),n=i.cover_colors??[],r=o.map(e=>{const t=i.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(i,r,{entry_ids:o})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),i=Number.isFinite(t)?t:0;this._emit({...this._baseConfig(),north_offset:i})}_onTitleChange(e){const t=e.target.value,i=this._baseConfig();if(t)this._emit({...i,title:t});else{const{title:e,...t}=i;this._emit(t)}}render(){if(!this._config)return q;const e=new Set(this._config.entry_ids);return V`
      <div class="form">
        <div class="section">
          <label class="field-label">${Ue("editor.compass.instances",this.hass)}</label>
          <div class="hint">${Ue("editor.compass.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(e)}
        </div>

        <div class="section">
          <label class="field-label">${Ue("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${Ue("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?V`
              <div class="section">
                <label class="field-label">${Ue("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${Ue("editor.compass.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const i=this._config.cover_colors?.[t]??null,s=i??_i(t),o=this._entries?.find(t=>t.entry_id===e);return V`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${s}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${o?.title??e}</span>
                        <span class="toggle-desc"
                          >${i||Ue("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!i}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${Ue("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:q}

        <div class="section">
          <label class="field-label">${Ue("editor.compass.display",this.hass)}</label>
          ${ks.map(e=>V`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${this._config[e.key]??e.defaultOn}
                  @change=${t=>this._onToggle(e.key,t.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${Ue(e.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${Ue(e.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${Ue("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${Ue("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${gs(this.hass)}
      </div>
    `}_renderEntryPicker(e){return this._entriesError?V`<div class="error">
        ${Ue("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?V`
        <div class="error">
          ${Ue("editor.common.no_entries",this.hass)}
          <code>${Ue("editor.common.no_entries_path",this.hass)}</code>${Ue("editor.common.no_entries_then",this.hass)}
        </div>
      `:V`
      <div class="entry-list">
        ${this._entries.map(t=>V`
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${e.has(t.entry_id)}
                @change=${e=>this._onEntryToggle(t.entry_id,e.target.checked)}
              />
              <span class="toggle-text">
                <span class="toggle-label">${t.title}</span>
                <span class="toggle-desc">${t.entry_id}</span>
              </span>
            </label>
          `)}
      </div>
    `:V`<div class="hint">${Ue("editor.common.loading_entries",this.hass)}</div>`}};As.styles=r`
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
    .entry-list {
      display: flex;
      flex-direction: column;
    }
    .color-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
    }
    .color-row input[type='color'] {
      width: 32px;
      height: 32px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 2px;
      background: none;
      cursor: pointer;
      flex-shrink: 0;
    }
    .color-row .toggle-text {
      flex: 1;
    }
    .reset-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      cursor: pointer;
      flex-shrink: 0;
    }
    .reset-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    code {
      background: var(--code-editor-background-color, rgba(0, 0, 0, 0.08));
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 0.85em;
    }
    .version-footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `,e([_e({attribute:!1})],As.prototype,"hass",void 0),e([ge()],As.prototype,"_config",void 0),e([ge()],As.prototype,"_entries",void 0),e([ge()],As.prototype,"_entriesError",void 0),As=e([he(we)],As);let Cs=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._listMemo=kt(),this._discoveredResult={list:[],missing:[]}}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");if(this._config={...e,entry_ids:[...e.entry_ids]},e.tooltips&&yt(e.tooltips),null===this._registry){const e=this._config.entry_ids.map(e=>Rt.get(e)?.entries);e.every(e=>void 0!==e)&&(this._registry=e.flat())}}getCardSize(){return 4}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(we)}static async getStubConfig(e){let t=[];try{const i=await Mt(e);i[0]&&(t=[i[0].entry_id])}catch{}return{type:`custom:${be}`,entry_ids:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Ft();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=[];for(const e of this._discoveredResult.list)t.push(...Object.values(e.entities));return 0===t.length||me(e.get("hass"),this.hass,t)}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discoveredResult=this._listMemo(this.hass,this._config.entry_ids,this._registry,this._config.type))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zt(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Tt(this.hass,e).then(e=>{if(e!==this._registry&&(this._registry=e,this._registryError=null,this._config))for(const t of this._config.entry_ids)Rt.set(t,jt(e,t))}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return V`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Ue("tile.registry_failed",this.hass,{error:this._registryError}):Ue("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const{list:e,missing:t}=this._discoveredResult;if(0===e.length)return V`<ha-card>
        <div class="empty">
          <p><strong>${Ue("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${Ue("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const i=this._config;return V`
      <ha-card>
        ${i.title?V`<div class="card-header">${i.title}</div>`:q}
        <acp-sky-compass
          .hass=${this.hass}
          .discovered_list=${e}
          ?compact=${!!i.compact}
          .showLegend=${i.show_legend??!0}
          .showStats=${i.show_stats??!0}
          .showMoon=${i.show_moon??!1}
          .showCardinals=${i.show_cardinals??!0}
          .showBlindSpot=${i.show_blind_spot??!0}
          .showSunPath=${i.show_sun_path??!0}
          .showSunriseSunset=${i.show_sunrise_sunset??!0}
          .showCoverFill=${i.show_cover_fill??!0}
          .showWindowArrow=${i.show_window_arrow??!0}
          .coverColors=${i.cover_colors??[]}
          .northOffsetDeg=${at(i.north_offset??0)}
        ></acp-sky-compass>
        ${!1!==i.show_elevation_chart?V`<acp-elevation-chart
              .hass=${this.hass}
              .discoveredList=${e}
              .coverColors=${i.cover_colors??[]}
              ?compact=${!!i.compact}
            ></acp-elevation-chart>`:q}
        ${t.length>0?V`<div class="warn dim">
              ${Ue("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:q}
      </ha-card>
    `}};Cs.styles=r`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-sizing: border-box;
    }
    .card-header {
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .empty {
      padding: 16px;
      text-align: center;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .warn {
      font-size: 0.78rem;
      text-align: center;
    }
  `,e([_e({attribute:!1})],Cs.prototype,"hass",void 0),e([ge()],Cs.prototype,"_config",void 0),e([ge()],Cs.prototype,"_registry",void 0),e([ge()],Cs.prototype,"_registryError",void 0),Cs=e([he(be)],Cs),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===be)||window.customCards.push({type:be,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Ss={compact:!1,hide_inactive_handlers:!1,show_decision_summary:!0},Es={entry_id:"editor.common.entry_id",title:"editor.decision.title",compact:"editor.decision.compact_label",hide_inactive_handlers:"editor.decision.hide_inactive_handlers_label",show_decision_summary:"editor.decision.show_decision_summary_label"},zs={compact:"editor.decision.compact_desc",hide_inactive_handlers:"editor.decision.hide_inactive_handlers_desc",show_decision_summary:"editor.decision.show_decision_summary_desc"};let Ms=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._entriesFetchInFlight=!1,this._computeLabel=e=>{const t=Es[e.name];return t?Ue(t,this.hass):e.name},this._computeHelper=e=>{const t=zs[e.name];return t?Ue(t,this.hass):void 0},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,i]of Object.entries(Ss))this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==i||delete t[e];const i={...this._config??{type:"",entry_id:""},...t};this._emit(i)}}setConfig(e){this._config={...e}}updated(e){e.has("hass")&&this.hass&&this._ensureEntries()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Mt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this._config)return q;if(this._entriesError&&!this._entries)return V`
        <div class="form">
          <div class="error">
            ${Ue("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${Ue("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${Ue("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          ${gs(this.hass)}
        </div>
      `;const e=this._schema(),t={...Ss,...this._config};return V`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${t}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${gs(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[];return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"title",selector:{text:{}}},{name:"compact",selector:{boolean:{}}},{name:"hide_inactive_handlers",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}}]}};Ms.styles=r`
    :host {
      display: block;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
    }
    .field-label {
      font-weight: 500;
      font-size: 0.88rem;
      color: var(--primary-text-color);
    }
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
    .error {
      font-size: 0.82rem;
      color: var(--error-color, crimson);
    }
    .version-footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `,e([_e({attribute:!1})],Ms.prototype,"hass",void 0),e([ge()],Ms.prototype,"_config",void 0),e([ge()],Ms.prototype,"_entries",void 0),e([ge()],Ms.prototype,"_entriesError",void 0),Ms=e([he(Ae)],Ms);let Os=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._memo=$t(),this._discovered=null}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${ke}: \`entry_id\` is required and must be a non-empty string`);if(this._config={...e},e.tooltips&&yt(e.tooltips),null===this._registry){const t=Rt.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 3}getGridOptions(){return{columns:12,rows:"auto",min_columns:4,max_columns:12}}static async getStubConfig(e){let t="";try{const i=await Mt(e);t=i[0]?.entry_id??""}catch{}return{type:`custom:${ke}`,entry_id:t}}static async getConfigElement(){return document.createElement(Ae)}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Ft();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||me(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zt(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Tt(this.hass,e).then(e=>{t===this._fetchGen&&e!==this._registry&&(this._registry=e,this._registryError=null,this._config&&Rt.set(this._config.entry_id,jt(e,this._config.entry_id)))}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return V`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Ue("tile.registry_failed",this.hass,{error:this._registryError}):Ue("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=this._discovered;if(!e)return V`<ha-card>
        <div class="empty">
          <p class="dim">
            ${Ue("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`;const t=this._config;return V`
      <ha-card>
        ${t.title?V`<div class="card-header">${t.title}</div>`:q}
        <acp-decision-strip
          .hass=${this.hass}
          .discovered=${e}
          ?compact=${!!t.compact}
          ?hide-inactive=${!!t.hide_inactive_handlers||!!t.compact}
          .showSummary=${!1!==t.show_decision_summary}
        ></acp-decision-strip>
      </ha-card>
    `}};Os.styles=r`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-sizing: border-box;
    }
    .card-header {
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .empty {
      padding: 16px;
      text-align: center;
    }
    .dim {
      color: var(--secondary-text-color);
      margin: 0;
    }
  `,e([_e({attribute:!1})],Os.prototype,"hass",void 0),e([ge()],Os.prototype,"_config",void 0),e([ge()],Os.prototype,"_registry",void 0),e([ge()],Os.prototype,"_registryError",void 0),Os=e([he(ke)],Os),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ke)||window.customCards.push({type:ke,name:"Adaptive Cover Pro — Decision Strip",description:"Standalone decision strip: all pipeline handlers for one Adaptive Cover Pro instance with the winning row highlighted.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});let Is=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Mt(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${Ce}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let i=0;i<e.length;i++)e[i]&&(t=i);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,i){const s=this._trimColors(t),{cover_colors:o,...n}=e,r=s?{...n,...i,cover_colors:s}:{...n,...i};this._emit(r)}_onCoverColorChange(e,t){const i=this._baseConfig(),s=[...i.cover_colors??[]];for(;s.length<=e;)s.push(null);s[e]=t,this._emitWithColors(i,s)}_onCoverColorReset(e){const t=this._baseConfig(),i=[...t.cover_colors??[]];e<i.length&&(i[e]=null),this._emitWithColors(t,i)}_onEntryToggle(e,t){const i=this._baseConfig(),s=new Set(i.entry_ids);t?s.add(e):s.delete(e);const o=(this._entries??[]).map(e=>e.entry_id).filter(e=>s.has(e)),n=i.cover_colors??[],r=o.map(e=>{const t=i.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(i,r,{entry_ids:o})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onTitleChange(e){const t=e.target.value,i=this._baseConfig();if(t)this._emit({...i,title:t});else{const{title:e,...t}=i;this._emit(t)}}render(){if(!this._config)return q;const e=new Set(this._config.entry_ids);return V`
      <div class="form">
        <div class="section">
          <label class="field-label">${Ue("editor.solar_chart.instances",this.hass)}</label>
          <div class="hint">${Ue("editor.solar_chart.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(e)}
        </div>

        <div class="section">
          <label class="field-label">${Ue("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${Ue("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?V`
              <div class="section">
                <label class="field-label"
                  >${Ue("editor.solar_chart.cover_colors",this.hass)}</label
                >
                <div class="hint">${Ue("editor.solar_chart.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const i=this._config.cover_colors?.[t]??null,s=i??_i(t),o=this._entries?.find(t=>t.entry_id===e);return V`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${s}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${o?.title??e}</span>
                        <span class="toggle-desc"
                          >${i||Ue("editor.solar_chart.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!i}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${Ue("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:q}

        <div class="section">
          <label class="field-label">${Ue("editor.solar_chart.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${e=>this._onToggle("compact",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${Ue("editor.solar_chart.toggle_compact_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${Ue("editor.solar_chart.toggle_compact_desc",this.hass)}</span
              >
            </span>
          </label>
        </div>
        ${gs(this.hass)}
      </div>
    `}_renderEntryPicker(e){return this._entriesError?V`<div class="error">
        ${Ue("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?V`
        <div class="error">
          ${Ue("editor.common.no_entries",this.hass)}
          <code>${Ue("editor.common.no_entries_path",this.hass)}</code>${Ue("editor.common.no_entries_then",this.hass)}
        </div>
      `:V`
      <div class="entry-list">
        ${this._entries.map(t=>V`
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${e.has(t.entry_id)}
                @change=${e=>this._onEntryToggle(t.entry_id,e.target.checked)}
              />
              <span class="toggle-text">
                <span class="toggle-label">${t.title}</span>
                <span class="toggle-desc">${t.entry_id}</span>
              </span>
            </label>
          `)}
      </div>
    `:V`<div class="hint">${Ue("editor.common.loading_entries",this.hass)}</div>`}};Is.styles=r`
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
    .entry-list {
      display: flex;
      flex-direction: column;
    }
    .color-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
    }
    .color-row input[type='color'] {
      width: 32px;
      height: 32px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 2px;
      background: none;
      cursor: pointer;
      flex-shrink: 0;
    }
    .color-row .toggle-text {
      flex: 1;
    }
    .reset-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      cursor: pointer;
      flex-shrink: 0;
    }
    .reset-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    code {
      background: var(--code-editor-background-color, rgba(0, 0, 0, 0.08));
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 0.85em;
    }
    .version-footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `,e([_e({attribute:!1})],Is.prototype,"hass",void 0),e([ge()],Is.prototype,"_config",void 0),e([ge()],Is.prototype,"_entries",void 0),e([ge()],Is.prototype,"_entriesError",void 0),Is=e([he(Se)],Is);let Fs=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._listMemo=kt(),this._discoveredResult={list:[],missing:[]}}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-solar-chart-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-solar-chart-card: every `entry_ids` entry must be a non-empty string");if(this._config={...e,entry_ids:[...e.entry_ids]},e.tooltips&&yt(e.tooltips),null===this._registry){const e=this._config.entry_ids.map(e=>Rt.get(e)?.entries);e.every(e=>void 0!==e)&&(this._registry=e.flat())}}getCardSize(){return 2}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(Se)}static async getStubConfig(e){let t=[];try{const i=await Mt(e);i[0]&&(t=[i[0].entry_id])}catch{}return{type:`custom:${Ce}`,entry_ids:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Ft();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=[];for(const e of this._discoveredResult.list)t.push(...Object.values(e.entities));return 0===t.length||me(e.get("hass"),this.hass,t)}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discoveredResult=this._listMemo(this.hass,this._config.entry_ids,this._registry,this._config.type))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zt(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Tt(this.hass,e).then(e=>{if(e!==this._registry&&(this._registry=e,this._registryError=null,this._config))for(const t of this._config.entry_ids)Rt.set(t,jt(e,t))}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return V`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Ue("tile.registry_failed",this.hass,{error:this._registryError}):Ue("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const{list:e,missing:t}=this._discoveredResult;if(0===e.length)return V`<ha-card>
        <div class="empty">
          <p><strong>${Ue("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${Ue("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const i=this._config;return V`
      <ha-card>
        ${i.title?V`<div class="card-header">${i.title}</div>`:q}
        <acp-elevation-chart
          .hass=${this.hass}
          .discoveredList=${e}
          .coverColors=${i.cover_colors??[]}
          ?compact=${!!i.compact}
        ></acp-elevation-chart>
        ${t.length>0?V`<div class="warn dim">
              ${Ue("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:q}
      </ha-card>
    `}};Fs.styles=r`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-sizing: border-box;
    }
    .card-header {
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .empty {
      padding: 16px;
      text-align: center;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .warn {
      font-size: 0.78rem;
      text-align: center;
    }
  `,e([_e({attribute:!1})],Fs.prototype,"hass",void 0),e([ge()],Fs.prototype,"_config",void 0),e([ge()],Fs.prototype,"_registry",void 0),e([ge()],Fs.prototype,"_registryError",void 0),Fs=e([he(Ce)],Fs),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===Ce)||window.customCards.push({type:Ce,name:"Adaptive Cover Pro — Solar Chart",description:"Standalone solar elevation-vs-time chart; overlay one or more entries’ field-of-view windows.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Ts=["sky","elevation","decision","covers","overrides","climate"];let Ps=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._discoveredList=[],this._discoveredListSource=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=$t(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(e){if(!e?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...e},e.tooltips&&yt(e.tooltips),null===this._registry){const t=Rt.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(ye)}static async getStubConfig(e){let t="";try{const i=await Mt(e);t=i[0]?.entry_id??""}catch{}return{type:`custom:${ve}`,entry_id:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Ft();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||me(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){null!==this._registry&&this._config&&this.hass&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry)),this._discovered!==this._discoveredListSource&&(this._discoveredListSource=this._discovered,this._discoveredList=this._discovered?[this._discovered]:[])}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zt(this.hass,e=>{const t=new Set(jt(this._registry??[],this._config?.entry_id??"").map(e=>e.entity_id));(function(e,t){return"create"===e.action||t.has(e.entity_id)})(e,t)&&this._scheduleRefetch()}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Tt(this.hass,e).then(e=>{if(e===this._registry)return;const t=this._config?.entry_id;if(t){const i=jt(e,t);(null===this._registry||function(e,t){if(e.length!==t.length)return!0;const i=new Map(e.map(e=>[e.entity_id,Nt(e)]));for(const e of t)if(i.get(e.entity_id)!==Nt(e))return!0;return!1}(jt(this._registry,t),i))&&(this._registry=e,i.length&&Rt.set(t,i))}else this._registry=e;this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const e=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=e);const t=e-this._debounceFirstAt,i=this._DEBOUNCE_MAX-t,s=Math.min(this._DEBOUNCE_DELAY,i);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),s<=0)return this._debounceFirstAt=null,void this._fetchRegistry(!0);this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry(!0)},s)}get _sections(){return this._config?.show_sections??Ts}_renderHeader(e,t){const i=Ie[e.cover_type]??"mdi:window-shutter",s=e.entities.integration_enabled_switch,o=e.entities.automatic_control_switch,n=!s||"on"===this.hass.states[s]?.state,r=!o||"on"===this.hass.states[o]?.state;return V`
      <div class="header">
        <ha-icon .icon=${i}></ha-icon>
        <span class="title">${e.entry_title}</span>
        <span class="spacer"></span>
        ${s?V`<acp-header-pill
              .on=${n}
              .readonly=${!t.integration_enabled}
              .label=${Ue(n?"header.on":"header.off",this.hass)}
              title=${Ue("header.integration_enabled",this.hass)}
              @pill-click=${()=>this._toggle(s)}
            ></acp-header-pill>`:q}
        ${o?V`<acp-header-pill
              .on=${r}
              .readonly=${!t.automatic_control}
              .label=${Ue("header.auto",this.hass)}
              title=${Ue("header.automatic_control",this.hass)}
              @pill-click=${()=>this._toggle(o)}
            ></acp-header-pill>`:q}
      </div>
    `}_toggle(e){const t=e.split(".")[0];this.hass.callService(t,"toggle",{entity_id:e})}_renderLoading(){return V`
      <ha-card>
        <div class="empty">
          <p class="dim">${Ue("root.loading_registry",this.hass)}</p>
        </div>
      </ha-card>
    `}_renderEmpty(e){const t=this._config.entry_id,i=this._registry?.length??0,s=this._registry?.filter(e=>e.config_entry_id===t&&"adaptive_cover_pro"===e.platform).length;return V`
      <ha-card>
        <div class="empty">
          <p><strong>${Ue("root.no_entities_title",this.hass)}</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${t}</code></p>
          <ul class="diag">
            <li>Reason: <code>${e}</code></li>
            <li>Registry entries loaded: <code>${i}</code></li>
            <li>ACP entities matching entry_id: <code>${s??"—"}</code></li>
            ${this._registryError?V`<li>Registry fetch error: <code>${this._registryError}</code></li>`:q}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const e=this._discovered;if(!e)return this._renderEmpty("no matching entities after unique_id lookup");const t=(i=this._config,{...De,...i?.controls});var i;const s=this._sections;return V`
      <ha-card>
        ${this._renderHeader(e,t)}
        <div class="body ${this._config.compact?"compact":""}">
          ${s.includes("sky")?V`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .coverColors=${this._config.cover_colors??[]}
                .northOffsetDeg=${at(this._config.north_offset??0)}
              ></acp-sky-compass>`:q}
          ${s.includes("elevation")?V`<acp-elevation-chart
                .hass=${this.hass}
                .discoveredList=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .coverColors=${this._config.cover_colors??[]}
              ></acp-elevation-chart>`:q}
          ${s.includes("decision")?V`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                .showSummary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:q}
          ${s.includes("covers")?V`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .coverColor=${this._config.cover_colors?.[0]??null}
              ></acp-cover-bar>`:q}
          ${s.includes("overrides")?V`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .resetEnabled=${t.reset_manual_override}
              ></acp-overrides-panel>`:q}
          ${s.includes("climate")?V`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:q}
          ${s.includes("solar")?V`<acp-solar-calc
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-solar-calc>`:q}
        </div>
      </ha-card>
    `}};Ps.styles=r`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-sizing: border-box;
    }
    .header {
      display: flex;
      align-items: flex-start;
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
    .dim {
      color: var(--secondary-text-color);
    }
  `,e([_e({attribute:!1})],Ps.prototype,"hass",void 0),e([ge()],Ps.prototype,"_config",void 0),e([ge()],Ps.prototype,"_registry",void 0),e([ge()],Ps.prototype,"_registryError",void 0),e([ge()],Ps.prototype,"_discovered",void 0),Ps=e([he(ve)],Ps),window.customCards=window.customCards||[],window.customCards.push({type:ve,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"}),console.info(`%c adaptive-cover-pro-card %c v${fe} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{Ps as AdaptiveCoverProCard};
