/*! adaptive-cover-pro-card v2.4.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function e(e,t,o,i){var s,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var r=e.length-1;r>=0;r--)(s=e[r])&&(a=(n<3?s(a):n>3?s(t,o,a):s(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,o=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&s.set(t,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,o,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new n(o,e,i)},r=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,g=globalThis,m=g.trustedTypes,_=m?m.emptyScript:"",f=g.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},b=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,o){const{get:i,set:s}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);s?.call(this,t),this.requestUpdate(e,n,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...u(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(o)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const o of i){const i=document.createElement("style"),s=t.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=o.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(void 0!==i&&!0===o.reflect){const s=(void 0!==o.converter?.toAttribute?o.converter:y).toAttribute(t,o.type);this._$Em=e,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){const o=this.constructor,i=o._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=o.getPropertyOptions(i),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const n=s.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,o,i=!1,s){if(void 0!==e){const n=this.constructor;if(!1===i&&(s=this[e]),o??=n.getPropertyOptions(e),!((o.hasChanged??b)(s,t)||o.useDefault&&o.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:i,wrapped:s},n){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,o,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,f?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,A=e=>e,k=$.trustedTypes,C=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+S,O=`<${z}>`,M=document,I=()=>M.createComment(""),F=e=>null===e||"object"!=typeof e&&"function"!=typeof e,P=Array.isArray,j="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,T=/>/g,D=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,K=/"/g,V=/^(?:script|style|textarea|title)$/i,G=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),q=G(1),W=G(2),Y=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),L=new WeakMap,Q=M.createTreeWalker(M,129);function H(e,t){if(!P(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const Z=(e,t)=>{const o=e.length-1,i=[];let s,n=2===t?"<svg>":3===t?"<math>":"",a=R;for(let t=0;t<o;t++){const o=e[t];let r,l,c=-1,d=0;for(;d<o.length&&(a.lastIndex=d,l=a.exec(o),null!==l);)d=a.lastIndex,a===R?"!--"===l[1]?a=N:void 0!==l[1]?a=T:void 0!==l[2]?(V.test(l[2])&&(s=RegExp("</"+l[2],"g")),a=D):void 0!==l[3]&&(a=D):a===D?">"===l[0]?(a=s??R,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?D:'"'===l[3]?K:B):a===K||a===B?a=D:a===N||a===T?a=R:(a=D,s=void 0);const h=a===D&&e[t+1].startsWith("/>")?" ":"";n+=a===R?o+O:c>=0?(i.push(r),o.slice(0,c)+E+o.slice(c)+S+h):o+S+(-2===c?t:h)}return[H(e,n+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class J{constructor({strings:e,_$litType$:t},o){let i;this.parts=[];let s=0,n=0;const a=e.length-1,r=this.parts,[l,c]=Z(e,t);if(this.el=J.createElement(l,o),Q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Q.nextNode())&&r.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(E)){const t=c[n++],o=i.getAttribute(e).split(S),a=/([.?@])?(.*)/.exec(t);r.push({type:1,index:s,name:a[2],strings:o,ctor:"."===a[1]?ie:"?"===a[1]?se:"@"===a[1]?ne:oe}),i.removeAttribute(e)}else e.startsWith(S)&&(r.push({type:6,index:s}),i.removeAttribute(e));if(V.test(i.tagName)){const e=i.textContent.split(S),t=e.length-1;if(t>0){i.textContent=k?k.emptyScript:"";for(let o=0;o<t;o++)i.append(e[o],I()),Q.nextNode(),r.push({type:2,index:++s});i.append(e[t],I())}}}else if(8===i.nodeType)if(i.data===z)r.push({type:2,index:s});else{let e=-1;for(;-1!==(e=i.data.indexOf(S,e+1));)r.push({type:7,index:s}),e+=S.length-1}s++}}static createElement(e,t){const o=M.createElement("template");return o.innerHTML=e,o}}function X(e,t,o=e,i){if(t===Y)return t;let s=void 0!==i?o._$Co?.[i]:o._$Cl;const n=F(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,o,i)),void 0!==i?(o._$Co??=[])[i]=s:o._$Cl=s),void 0!==s&&(t=X(e,s._$AS(e,t.values),s,i)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,i=(e?.creationScope??M).importNode(t,!0);Q.currentNode=i;let s=Q.nextNode(),n=0,a=0,r=o[0];for(;void 0!==r;){if(n===r.index){let t;2===r.type?t=new te(s,s.nextSibling,this,e):1===r.type?t=new r.ctor(s,r.name,r.strings,this,e):6===r.type&&(t=new ae(s,this,e)),this._$AV.push(t),r=o[++a]}n!==r?.index&&(s=Q.nextNode(),n++)}return Q.currentNode=M,i}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,i){this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),F(e)?e===U||null==e||""===e?(this._$AH!==U&&this._$AR(),this._$AH=U):e!==this._$AH&&e!==Y&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>P(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==U&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,i="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=J.createElement(H(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ee(i,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=L.get(e.strings);return void 0===t&&L.set(e.strings,t=new J(e)),t}k(e){P(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,i=0;for(const s of e)i===t.length?t.push(o=new te(this.O(I()),this.O(I()),this,this.options)):o=t[i],o._$AI(s),i++;i<t.length&&(this._$AR(o&&o._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class oe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,i,s){this.type=1,this._$AH=U,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=U}_$AI(e,t=this,o,i){const s=this.strings;let n=!1;if(void 0===s)e=X(this,e,t,0),n=!F(e)||e!==this._$AH&&e!==Y,n&&(this._$AH=e);else{const i=e;let a,r;for(e=s[0],a=0;a<s.length-1;a++)r=X(this,i[o+a],t,a),r===Y&&(r=this._$AH[a]),n||=!F(r)||r!==this._$AH[a],r===U?e=U:e!==U&&(e+=(r??"")+s[a+1]),this._$AH[a]=r}n&&!i&&this.j(e)}j(e){e===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends oe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===U?void 0:e}}class se extends oe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==U)}}class ne extends oe{constructor(e,t,o,i,s){super(e,t,o,i,s),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??U)===Y)return;const o=this._$AH,i=e===U&&o!==U||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==U&&(o===U||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(J,te),($.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const i=o?.renderBefore??t;let s=i._$litPart$;if(void 0===s){const e=o?.renderBefore??null;i._$litPart$=s=new te(t.insertBefore(I(),e),e,void 0,o??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Y}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ue={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},pe=(e=ue,t,o)=>{const{kind:i,metadata:s}=o;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(o.name,e),"accessor"===i){const{name:i}=o;return{set(o){const s=t.get.call(this);t.set.call(this,o),this.requestUpdate(i,s,e,!0,o)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=o;return function(o){const s=this[i];t.call(this,o),this.requestUpdate(i,s,e,!0,o)}}throw Error("Unsupported decorator location: "+i)};function ge(e){return(t,o)=>"object"==typeof o?pe(e,t,o):((e,t,o)=>{const i=t.hasOwnProperty(o);return t.constructor.createProperty(o,e),i?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}function me(e){return ge({...e,state:!0,attribute:!1})}const _e="2.4.0",fe="adaptive-cover-pro-card",ve="adaptive-cover-pro-card-editor",ye="adaptive-cover-pro-sky-compass-card",be="adaptive-cover-pro-sky-compass-card-editor",we="adaptive-cover-pro-tile-card",xe="adaptive-cover-pro-tile-card-editor",$e="adaptive_cover_pro",Ae=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default","floor_clamp"],ke={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},Ce={force:"handler.force",weather:"handler.weather",manual:"handler.manual",custom_position:"handler.custom_position",motion:"handler.motion",cloud:"handler.cloud",climate:"handler.climate",glare_zone:"handler.glare_zone",solar:"handler.solar",default:"handler.default",floor_clamp:"handler.floor_clamp"},Ee={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},Se={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open"},ze={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds"},Oe={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion"},Me={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Solar tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Motion",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"},off_schedule:{label:"Off-schedule",bg:"rgba(96, 125, 139, 0.22)",fg:"#37474f"}},Ie={auto:"badge.auto",manual:"badge.manual",force:"badge.force",weather:"badge.weather",glare_zone:"badge.glare_zone",climate:"badge.climate",cloud:"badge.cloud",custom_position:"badge.custom_position",solar:"badge.solar",motion:"badge.motion",off:"badge.off",off_schedule:"badge.off_schedule"},Fe={auto:"mdi:autorenew",manual:"mdi:hand-back-right",force:"mdi:flash",weather:"mdi:shield-sun",glare_zone:"mdi:weather-sunny-alert",climate:"mdi:thermostat",cloud:"mdi:weather-cloudy",custom_position:"mdi:bookmark",solar:"mdi:white-balance-sunny",motion:"mdi:motion-sensor",off:"mdi:power",off_schedule:"mdi:clock-alert-outline"},Pe={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},je={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"},Re={en:{handler:{force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Weather safety",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Solar tracking",motion:"Motion idle",off:"Off",off_schedule:"Off-schedule",floor_suffix:" ↥"},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window field of view",fov_exit:"Sun leaves window field of view"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks.",solar_only_note:"Solar geometry only — does not reflect manual overrides, custom positions, cloud suppression, or weather."},dialog:{configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"↥",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Motion",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Motion",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"expires in {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance",mode_off:"Climate mode off",standby:"Standby"},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in FOV",in_fov:"in FOV",in_fov_tooltip:"Sun is currently within this window’s field of view",none:"—",sun:"Sun",moon:"Moon",sun_up_not_hitting:"Sun (up, not hitting)",sun_below_horizon:"Sun (below horizon)",window_fov:"Window FOV",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_position:"Cover position",window_normal:"Window normal",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"FOV {left} left / {right} right{elev}",window_normal_tooltip:"Window normal: {bearing}",cover_position_target:"Target: {pct}%",cover_position_target_awning:"Target (extended): {pct}%",cover_position_actual:"Actual: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",click_to_set:"Click to set position",target_tooltip:"Target {pct}%"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor",outside_schedule:"Outside schedule — automatic control paused",outside_schedule_tooltip:"The configured schedule window is not active, so automatic positioning is paused."},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Motion timeout pending",motion_detected:"Motion detected",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found."},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"FOV: {from} → {to}",fov_windows:"FOV: {windows}",fov_window_named:"{name}: {windows}",no_fov_today:"Sun does not enter FOV today",placeholder:"Sun elevation chart unavailable.",schedule:"Schedule {from} – {to}",schedule_from:"Schedule from {from}",schedule_until:"Schedule until {to}",schedule_start_tooltip:"Schedule start",schedule_end_tooltip:"Schedule end"},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",support_alt:"Buy me a coffee",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window FOV, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with FOV band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, motion tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy; shows standby when climate mode is off or inactive",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Solar tracking",badge_force:"Force override",badge_weather:"Weather safety",badge_manual:"Manual override",badge_custom_position:"Custom position",badge_motion:"Motion",badge_climate:"Climate",badge_glare_zone:"Glare zone",badge_cloud:"Cloud suppression",show_compass:"Show sun compass in dialog",show_elevation_chart:"Show sun-today chart in dialog",show_motion_icon:"Show motion indicator",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth.",toggle_elevation_chart_label:"Sun-today chart",toggle_elevation_chart_desc:"Elevation-vs-time chart below the compass, with FOV band and elevation limits."}}},fr:{handler:{force:"Dérogation forcée",weather:"Sécurité météo",manual:"Dérogation manuelle",custom_position:"Position personnalisée",motion:"Délai d'inactivité du mouvement",cloud:"Désactivation par temps nuageux",climate:"Climatique",glare_zone:"Zone d'éblouissement",solar:"Suivi solaire",default:"Par défaut",floor_clamp:"Plancher"},badge:{auto:"Auto",manual:"Manuel",force:"Forcé",weather:"Sécurité météo",glare_zone:"Éblouissement",climate:"Climatique",cloud:"Nuageux",custom_position:"Personnalisé",solar:"Suivi solaire",motion:"Inactivité",off:"Off",off_schedule:"Hors planning",floor_suffix:" ↥"},forecast:{event:{sunrise:"Lever du soleil",sunset:"Coucher du soleil",fov_enter:"Le soleil entre dans le champ de vision de la fenêtre",fov_exit:"Le soleil quitte le champ de vision de la fenêtre"},hover_hint:"Survolez la courbe pour voir l'heure et la position prévue ; survolez une ligne colorée pour voir l'événement qu'elle indique.",solar_only_note:"Géométrie solaire uniquement — ne tient pas compte des dérogations manuelles, des positions personnalisées, de la désactivation par temps nuageux ni des conditions météo."},dialog:{configure_integration:"Configurer l'intégration",open_device_page:"Ouvrir la page de l'appareil",close:"Fermer",target:"Cible",resume_auto:"Reprendre l'automatique",hide_advanced:"▼ Masquer les options avancées",show_advanced:"▶ Afficher les options avancées",custom_positions:"Positions personnalisées",floor_tooltip:"Plancher — cette valeur force une position minimale au-dessus du calcul automatique",floor:"↥",disable_slot:"Désactiver le créneau {slot}",enable_slot:"Activer le créneau {slot}",on:"Activé",off:"Désactivé",controls:"Commandes",automatic:"Automatique",climate:"Climatique",motion:"Mouvement",toggle_hint:"{label} {state} — appuyez pour basculer",state_on:"activé",state_off:"désactivé",todays_forecast:"Prévisions du jour"},overrides:{title:"Dérogations",manual:"Manuel",force:"Forcé",motion:"Mouvement",active:"Actif",off:"Désactivé",ends_in:"se termine dans {time}",active_count:"{count} dérogation(s) active(s)",timeout:"expire dans {time}",reset_manual:"Réinitialiser le mode manuel"},climate:{title:"Climatique",active:"Actif : {strategy}",indoor:"Intérieur",outdoor:"Extérieur",presence:"Présence",sunny:"Ensoleillé",lux:"Lux",irradiance:"Irradiance",mode_off:"Mode climatique désactivé",standby:"En veille"},compass:{placeholder_no_entries:"Aucune instance Adaptive Cover Pro sélectionnée.",placeholder_no_sun:"Le capteur solaire n'est pas encore renseigné.",sun_tooltip:"Soleil : {az} az / {el} él",sunrise_tooltip:"Lever du soleil : {time}",sunset_tooltip:"Coucher du soleil : {time}",moon_tooltip:"Lune : {phase} ({pct}%)",sun_path_tooltip:"Trajectoire solaire (aujourd'hui)",in_fov_check:"✓ dans le champ de vision",in_fov:"dans le champ de vision",in_fov_tooltip:"Le soleil est actuellement dans le champ de vision de cette fenêtre",none:"—",sun:"Soleil",moon:"Lune",sun_up_not_hitting:"Soleil (levé, ne frappe pas)",sun_below_horizon:"Soleil (sous l’horizon)",window_fov:"Champ de vision",sun_path:"Trajectoire solaire",sunrise:"Lever du soleil",sunset:"Coucher du soleil",cover_position:"Position du store",window_normal:"Axe de la fenêtre",stat_sun:"Soleil : ",stat_azi:"Azi : ",stat_elev:"Élév : ",stat_window:"Fenêtre : ",active_sun_arc:"Arc solaire actif {from} – {to}{elev}",fov_arc:"Champ de vision {left} gauche / {right} droite{elev}",window_normal_tooltip:"Axe de la fenêtre : {bearing}",cover_position_target:"Cible : {pct}%",cover_position_target_awning:"Cible (déployé) : {pct}%",cover_position_actual:"Réel : {pct}%",blind_spot:"Soleil masqué : {from} - {to}",elev_suffix:" · élév {min}–{max}"},covers:{placeholder:"Aucun store signalé par l'intégration.",title:"Stores",target:"Cible : {pct}",click_to_set:"Cliquer pour définir la position",target_tooltip:"Cible {pct}%"},decision:{placeholder:"La trace de décision n'est pas encore renseignée.",pipeline:"Pipeline",winner:"Actif : {name}",summary_tooltip:"Pourquoi cette position ?",not_evaluated:"non évalué",floor_suffix:" plancher",outside_schedule:"Hors planning — contrôle automatique en pause",outside_schedule_tooltip:"La fenêtre de planning configurée n'est pas active, le positionnement automatique est donc en pause."},header:{on:"ON",off:"OFF",integration_enabled:"Intégration activée",auto:"Auto",automatic_control:"Contrôle automatique"},tile:{motion_pending:"Délai de mouvement en cours",motion_detected:"Mouvement détecté",open:"Ouvrir",stop:"Arrêter",close:"Fermer",resume_aria:"Reprendre le contrôle automatique",registry_failed:"Échec de la récupération du registre : {error}",loading:"Chargement…",entry_not_found:"Instance Adaptive Cover Pro {entry} introuvable."},formatters:{expired:"expiré"},elevation:{title:"Soleil aujourd'hui",fov_window:"Champ de vision : {from} → {to}",fov_windows:"Champ de vision : {windows}",fov_window_named:"{name} : {windows}",no_fov_today:"Pas de soleil dans le champ de vision aujourd'hui",placeholder:"Graphique d'élévation solaire indisponible.",schedule:"Programmation {from} – {to}",schedule_from:"Programmation à partir de {from}",schedule_until:"Programmation jusqu'à {to}",schedule_start_tooltip:"Début de programmation",schedule_end_tooltip:"Fin de programmation"},root:{loading_registry:"Chargement du registre Adaptive Cover Pro…",no_entities_title:"Aucune entité Adaptive Cover Pro trouvée",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Aucune entité Adaptive Cover Pro correspondante",compass_configured:"Instances configurées : {entries}",compass_not_found:"Instances introuvables : {entries}"},editor:{common:{entry_id:"Instance Adaptive Cover Pro",support_alt:"Offrez-moi un café",title_optional:"Titre (facultatif)",title_placeholder:"ex. Fenêtres côté ouest",north_offset:"Décalage nord de la boussole (°)",north_offset_hint:"Faites pivoter la boussole dans le sens horaire pour que « haut » corresponde à votre carte. Par défaut : 0.",loading_entries:"Chargement des entrées de configuration Adaptive Cover Pro…",load_failed:"Échec du chargement des entrées de configuration : {error}",no_entries:"Aucune entrée de configuration Adaptive Cover Pro trouvée. Ajoutez une instance sous",no_entries_path:"Paramètres → Appareils et services",no_entries_then:", puis revenez ici.",entry_id_manual_placeholder:"Saisir manuellement l'ID d'entrée de configuration",entry_id_fallback_label:"ID d'entrée",unknown_entry:"(inconnu : {entry})",reset:"Réinitialiser"},main:{sections:"Sections",sections_hint:"Activer ou désactiver les parties de la carte affichées.",section_sky_label:"Boussole céleste",section_sky_desc:"Soleil par rapport au champ de vision de la fenêtre, tracé polaire",section_elevation_label:"Soleil aujourd'hui",section_elevation_desc:"Graphique élévation/temps avec bande FOV et curseur temps réel",section_decision_label:"Bande de décision",section_decision_desc:"Les 10 gestionnaires du pipeline avec la ligne gagnante mise en évidence",section_covers_label:"Positions des stores",section_covers_desc:"Barres position réelle/cible par store ; cliquer pour définir la position",section_overrides_label:"Panneau des dérogations",section_overrides_desc:"Tuiles Manuel, Forcé, Mouvement + bouton de réinitialisation",section_climate_label:"Panneau climatique",section_climate_desc:"Stratégie été/hiver/intermédiaire ; affiche le mode veille si le mode climatique est désactivé ou inactif",controls:"Commandes",controls_hint:"Afficher en lecture seule (visible mais non cliquable).",integration_pill_label:"Bouton ON/OFF de l'intégration",integration_pill_desc:"Permettre de basculer l'intégration depuis l'en-tête de la carte.",automatic_pill_label:"Bouton contrôle automatique",automatic_pill_desc:"Permettre de basculer le contrôle automatique depuis l'en-tête de la carte.",reset_button_label:"Bouton de réinitialisation de la dérogation manuelle",reset_button_desc:"Permettre d'appuyer sur la tuile de réinitialisation dans le panneau des dérogations.",display:"Affichage",compact_label:"Mode compact",compact_desc:"Espacement réduit entre les sections.",show_compass_stats_label:"Afficher les statistiques de la boussole",show_compass_stats_desc:"Azi, Élév, ∠ et angle de fenêtre sous la boussole céleste.",show_compass_legend_label:"Afficher la légende de la boussole",show_compass_legend_desc:"Clé de couleur sous la boussole céleste.",show_moon_label:"Afficher la lune sur la boussole",show_moon_desc:"Position et phase de la lune en superposition sur la boussole céleste.",hide_inactive_label:"Masquer les gestionnaires inactifs",hide_inactive_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs."},tile:{name:"Titre personnalisé",icon:"Icône personnalisée",cover:"Entité de store",layout:"Disposition",show_position:"Afficher la position %",show_state:"Afficher l'état (Ouvert/Fermé)",show_decision_summary:"Afficher le résumé de décision",show_controls:"Afficher les commandes ↑■▼",show_badge:"Afficher le badge contextuel",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Suivi solaire",badge_force:"Dérogation forcée",badge_weather:"Sécurité météo",badge_manual:"Dérogation manuelle",badge_custom_position:"Position personnalisée",badge_motion:"Mouvement",badge_climate:"Climatique",badge_glare_zone:"Zone d'éblouissement",badge_cloud:"Suppression nuageuse",show_compass:"Afficher la boussole solaire dans le dialogue",show_elevation_chart:"Afficher le graphique du soleil dans le dialogue",show_motion_icon:"Afficher l'indicateur de mouvement",tap_action:"Action au toucher",hold_action:"Action au maintien",double_tap_action:"Action au double toucher",cover_blank_hint:"Laisser vide pour utiliser automatiquement le premier store géré.",layout_option_one_line:"Une ligne (compact)",layout_option_detailed:"Détaillé (titre, état, indicateurs)"},compass:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition à la boussole.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"SVG plus petit, légende masquée.",toggle_legend_label:"Légende",toggle_legend_desc:"Échantillons de couleur et étiquettes d'instance sous la boussole.",toggle_stats_label:"Statistiques",toggle_stats_desc:"Soleil + lignes numériques par fenêtre.",toggle_moon_label:"Lune",toggle_moon_desc:"Afficher la position et la phase de la lune.",toggle_cardinals_label:"Points cardinaux",toggle_cardinals_desc:"Lettres N/E/S/O autour de la boussole.",toggle_blind_spot_label:"Zones de soleil masqué",toggle_blind_spot_desc:"Secteurs hachurés pour la plage où le soleil est masqué de chaque fenêtre.",toggle_sun_path_label:"Trajectoire solaire",toggle_sun_path_desc:"Arc solaire du jour dans le ciel.",toggle_sunrise_sunset_label:"Repères lever / coucher du soleil",toggle_sunrise_sunset_desc:"Petits points aux azimuts de lever et coucher du soleil.",toggle_cover_fill_label:"Remplissage de fermeture du store",toggle_cover_fill_desc:"Secteur intérieur indiquant le taux de fermeture de chaque store.",toggle_window_arrow_label:"Flèche de normale de fenêtre",toggle_window_arrow_desc:"Ligne du centre vers l'azimut de chaque fenêtre.",toggle_elevation_chart_label:"Graphique du soleil",toggle_elevation_chart_desc:"Graphique élévation/temps sous la boussole, avec bande FOV et limites d'élévation."}}}};function Ne(e,t){const o=t.split(".");let i=e;for(const e of o){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function Te(e,t){return t?e.replace(/\{(\w+)\}/g,(e,o)=>Object.prototype.hasOwnProperty.call(t,o)?String(t[o]):e):e}function De(e,t,o){const i=function(e){const t=(e?.locale?.language??e?.language??"en").toLowerCase().split("-")[0];return t in Re?t:"en"}(t),s=Ne(Re[i],e);if(void 0!==s)return Te(s,o);if("en"!==i){const t=Ne(Re.en,e);if(void 0!==t)return Te(t,o)}return e}function Be(e,t,o){const i=t.entry_id;if(!i)return null;const s={},n=`${i}_`;let a,r=!1;for(const e of o){if(e.config_entry_id!==i)continue;if(e.platform!==$e)continue;if(r=!0,!a&&e.device_id&&(a=e.device_id),!e.unique_id.startsWith(n))continue;const t=e.unique_id.slice(n.length),o=e.entity_id.split(".")[0],l=je[`${o}:${t}`];l&&(s[l]=e.entity_id)}if(!r||0===Object.keys(s).length)return null;const l=e;let c=i;if(l.devices)for(const e of Object.values(l.devices))if(e.config_entries?.includes(i)){c=e.name_by_user??e.name??i;break}const d=[],h=s.target_position_sensor;if(h){const t=e.states[h]?.attributes?.actual_positions;t&&d.push(...Object.keys(t))}let u="cover_blind";const p=s.control_status_sensor;if(p){const t=e.states[p]?.attributes;t?.cover_type&&(u=t.cover_type)}return{entry_id:i,entry_title:c,cover_type:u,entities:s,managed_covers:d,device_id:a}}async function Ke(e){return(await e.callWS({type:"config_entries/get",domain:$e})).filter(e=>e.domain===$e).map(e=>({entry_id:e.entry_id,title:e.title}))}function Ve(e,t,o=0){const i=(e-90+o)*Math.PI/180;return{x:t*Math.cos(i),y:t*Math.sin(i)}}function Ge(e){return 1-Math.max(0,Math.min(90,e))/90}function qe(e,t,o,i=0,s=0){const n=e=>(e%360+360)%360,a=n(e),r=n(t);let l=r-a;l<0&&(l+=360);const c=l>180?1:0,d=Ve(a,o,s),h=Ve(r,o,s);if(i<=0)return`M 0 0 L ${d.x} ${d.y} A ${o} ${o} 0 ${c} 1 ${h.x} ${h.y} Z`;const u=Ve(r,i,s),p=Ve(a,i,s);return[`M ${d.x} ${d.y}`,`A ${o} ${o} 0 ${c} 1 ${h.x} ${h.y}`,`L ${u.x} ${u.y}`,`A ${i} ${i} 0 ${c} 0 ${p.x} ${p.y}`,"Z"].join(" ")}function We(e,t,o=0){return Ve(e,Ge(t),o)}function Ye(e){return(e%360+360)%360}function Ue(e,t,o,i){const s=i??0;let n=-1,a=-1;for(let i=t;i<=o&&i<e.length;i++)e[i].elevation>s&&(-1===n&&(n=i),a=i);return-1===n?null:{wedgeStart:e[n].azimuth,wedgeEnd:e[a].azimuth}}function Le(e,t,o){const i=(e-t)/864e5;return Math.max(0,Math.min(o,i*o))}function Qe(e,t,o){return((e-t)%360+360)%360<=((o-t)%360+360)%360}function He(e,t,o,i){return Qe(o,e,t)||Qe(i,e,t)||Qe(e,o,i)||Qe(t,o,i)}function Ze(e,t,o,i){const s="cover_awning"===t?e/100:1-e/100;return Math.min(o*s,i)}async function Je(e){return e.callWS({type:"config/entity_registry/list"})}function Xe(e,t){let o=null,i=!1;return e.connection.subscribeEvents(e=>t(e.data),"entity_registry_updated").then(e=>{i?e():o=e}).catch(()=>{}),()=>{i=!0,o&&o()}}function et(e){return`acp-card:registry:v1:${e}`}const tt={get(e){try{const t=localStorage.getItem(et(e));if(!t)return null;const o=JSON.parse(t);return 1!==o.schemaVersion?null:o}catch{return null}},set(e,t){try{const o={schemaVersion:1,cardVersion:_e,fetchedAt:Date.now(),entries:t};localStorage.setItem(et(e),JSON.stringify(o))}catch{}},invalidate(e){try{localStorage.removeItem(et(e))}catch{}},clear(){try{const e="acp-card:registry:v1:",t=[];for(let o=0;o<localStorage.length;o++){const i=localStorage.key(o);i?.startsWith(e)&&t.push(i)}t.forEach(e=>localStorage.removeItem(e))}catch{}}};function ot(e){return`${e.entity_id}|${e.unique_id}|${e.platform}|${e.config_entry_id??""}`}function it(e,t,o){return e.filter(e=>e.config_entry_id===t&&void 0===o)}let st=class extends ce{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return q`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":U}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};st.styles=a`
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
      pointer-events: none;
    }
    .pill.on.readonly {
      opacity: 0.85;
    }
  `,e([ge({type:Boolean})],st.prototype,"on",void 0),e([ge({type:Boolean})],st.prototype,"readonly",void 0),e([ge({type:String})],st.prototype,"label",void 0),e([ge({type:String})],st.prototype,"title",void 0),st=e([he("acp-header-pill")],st);class nt{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const at=(rt=class extends nt{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const o=e.element.classList;for(const e of this.st)e in t||(o.remove(e),this.st.delete(e));for(const e in t){const i=!!t[e];i===this.st.has(e)||this.nt?.has(e)||(i?(o.add(e),this.st.add(e)):(o.remove(e),this.st.delete(e)))}return Y}},(...e)=>({_$litDirective$:rt,values:e}));var rt;function lt(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var ct,dt,ht={exports:{}},ut=(ct||(ct=1,dt=ht,function(){var e=Math.PI,t=Math.sin,o=Math.cos,i=Math.tan,s=Math.asin,n=Math.atan2,a=Math.acos,r=e/180,l=864e5,c=2440588,d=2451545;function h(e){return new Date((e+.5-c)*l)}function u(e){return function(e){return e.valueOf()/l-.5+c}(e)-d}var p=23.4397*r;function g(e,s){return n(t(e)*o(p)-i(s)*t(p),o(e))}function m(e,i){return s(t(i)*o(p)+o(i)*t(p)*t(e))}function _(e,s,a){return n(t(e),o(e)*t(s)-i(a)*o(s))}function f(e,i,n){return s(t(i)*t(n)+o(i)*o(n)*o(e))}function v(e,t){return r*(280.16+360.9856235*e)-t}function y(e){return r*(357.5291+.98560028*e)}function b(o){return o+r*(1.9148*t(o)+.02*t(2*o)+3e-4*t(3*o))+102.9372*r+e}function w(e){var t=b(y(e));return{dec:m(t,0),ra:g(t,0)}}var x={getPosition:function(e,t,o){var i=r*-o,s=r*t,n=u(e),a=w(n),l=v(n,i)-a.ra;return{azimuth:_(l,s,a.dec),altitude:f(l,s,a.dec)}}},$=x.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];x.addTime=function(e,t,o){$.push([e,t,o])};var A=9e-4;function k(t,o,i){return A+(t+o)/(2*e)+i}function C(e,o,i){return d+e+.0053*t(o)-.0069*t(2*i)}function E(e,i,s,n,r,l,c){var d=function(e,i,s){return a((t(e)-t(i)*t(s))/(o(i)*o(s)))}(e,s,n);return C(k(d,i,r),l,c)}function S(e){var i=r*(134.963+13.064993*e),s=r*(93.272+13.22935*e),n=r*(218.316+13.176396*e)+6.289*r*t(i),a=5.128*r*t(s),l=385001-20905*o(i);return{ra:g(n,a),dec:m(n,a),dist:l}}function z(e,t){return new Date(e.valueOf()+t*l/24)}x.getTimes=function(t,o,i,s){var n,a,l,c,d,p=r*-i,g=r*o,_=function(e){return-2.076*Math.sqrt(e)/60}(s=s||0),f=function(t,o){return Math.round(t-A-o/(2*e))}(u(t),p),v=k(0,p,f),w=y(v),x=b(w),S=m(x,0),z=C(v,w,x),O={solarNoon:h(z),nadir:h(z-.5)};for(n=0,a=$.length;n<a;n+=1)d=z-((c=E(((l=$[n])[0]+_)*r,p,g,S,f,w,x))-z),O[l[1]]=h(d),O[l[2]]=h(c);return O},x.getMoonPosition=function(e,s,a){var l=r*-a,c=r*s,d=u(e),h=S(d),p=v(d,l)-h.ra,g=f(p,c,h.dec),m=n(t(p),i(c)*o(h.dec)-t(h.dec)*o(p));return g+=function(e){return e<0&&(e=0),2967e-7/Math.tan(e+.00312536/(e+.08901179))}(g),{azimuth:_(p,c,h.dec),altitude:g,distance:h.dist,parallacticAngle:m}},x.getMoonIllumination=function(e){var i=u(e||new Date),s=w(i),r=S(i),l=149598e3,c=a(t(s.dec)*t(r.dec)+o(s.dec)*o(r.dec)*o(s.ra-r.ra)),d=n(l*t(c),r.dist-l*o(c)),h=n(o(s.dec)*t(s.ra-r.ra),t(s.dec)*o(r.dec)-o(s.dec)*t(r.dec)*o(s.ra-r.ra));return{fraction:(1+o(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},x.getMoonTimes=function(e,t,o,i){var s=new Date(e);i?s.setUTCHours(0,0,0,0):s.setHours(0,0,0,0);for(var n,a,l,c,d,h,u,p,g,m,_,f,v,y=.133*r,b=x.getMoonPosition(s,t,o).altitude-y,w=1;w<=24&&(n=x.getMoonPosition(z(s,w),t,o).altitude-y,p=((d=(b+(a=x.getMoonPosition(z(s,w+1),t,o).altitude-y))/2-n)*(u=-(h=(a-b)/2)/(2*d))+h)*u+n,m=0,(g=h*h-4*d*n)>=0&&(_=u-(v=Math.sqrt(g)/(2*Math.abs(d))),f=u+v,Math.abs(_)<=1&&m++,Math.abs(f)<=1&&m++,_<-1&&(_=f)),1===m?b<0?l=w+_:c=w+_:2===m&&(l=w+(p<0?f:_),c=w+(p<0?_:f)),!l||!c);w+=2)b=a;var $={};return l&&($.rise=z(s,l)),c&&($.set=z(s,c)),l||c||($[p>0?"alwaysUp":"alwaysDown"]=!0),$},dt.exports=x}()),ht.exports),pt=lt(ut);function gt(e,t,o,i=10){const s=[],n=o.getTime()+864e5;for(let a=o.getTime();a<=n;a+=60*i*1e3){const o=new Date(a),i=pt.getPosition(o,e,t);s.push({t:o,elevation:180*i.altitude/Math.PI,azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360})}return s}function mt(e=new Date){const t=new Date(e);return t.setHours(0,0,0,0),t}function _t(e,t=new Date){if(!e)return mt(t);const o=new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(t),[i,s,n]=o.split("-").map(Number),a=Date.UTC(i,s-1,n,0,0,0),r=function(e,t){const o=new Intl.DateTimeFormat("en-US",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(t),i={};for(const e of o)"literal"!==e.type&&(i[e.type]=Number(e.value));return Date.UTC(i.year,i.month-1,i.day,i.hour,i.minute,i.second)-t.getTime()}(e,new Date(a));return new Date(a-r)}function ft(e,t,o,i){const s=((t-o)%360+360)%360;return((e-s)%360+360)%360<=((((t+i)%360+360)%360-s)%360+360)%360}function vt(e,t,o,i){const s=[];let n=-1;for(let a=0;a<e.length;a++){const r=e[a];r.elevation>0&&ft(r.azimuth,t,o,i)?-1===n&&(n=a):-1!==n&&(s.push({startIdx:n,endIdx:a-1}),n=-1)}return-1!==n&&s.push({startIdx:n,endIdx:e.length-1}),s}function yt(e,t,o=new Date){const i=pt.getMoonPosition(o,e,t),s=pt.getMoonIllumination(o);return{azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360,elevation:180*i.altitude/Math.PI,phase:s.phase,fraction:s.fraction,phaseName:bt(s.phase)}}function bt(e){return e<.0625||e>=.9375?"New Moon":e<.1875?"Waxing Crescent":e<.3125?"First Quarter":e<.4375?"Waxing Gibbous":e<.5625?"Full Moon":e<.6875?"Waning Gibbous":e<.8125?"Last Quarter":"Waning Crescent"}function wt(e){return null==e||Number.isNaN(e)?"—":`${Math.round(e)}%`}function xt(e){return null==e||Number.isNaN(e)?"—":`${e.toFixed(1)}°`}function $t(e,t){if(!e)return"—";const o=new Date(e);return Number.isNaN(o.getTime())?"—":o.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",timeZone:t})}function At(e,t){if(!e)return"—";const o=new Date(e).getTime();if(Number.isNaN(o))return"—";const i=Math.round((o-Date.now())/1e3);return i<=0?t?De("formatters.expired",t):"expired":function(e){if(null==e||Number.isNaN(e))return"—";const t=Math.max(0,Math.round(e));if(t<60)return`${t}s`;const o=Math.floor(t/60);return o<60?`${o}m ${t%60}s`:`${Math.floor(o/60)}h ${o%60}m`}(i)}const kt=new Set(["outside_fov","in_fov_not_valid","hitting"]),Ct={night:"sun night",hitting:"sun valid",in_fov_not_valid:"sun in-fov",outside_fov:"sun up"};function Et(e){return e.belowHorizon?"night":e.sunState&&kt.has(e.sunState)?e.sunState:e.directSunValid?"hitting":e.inFov?"in_fov_not_valid":"outside_fov"}const St=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function zt(e){const t=St.length;return St[(e%t+t)%t]}function Ot(e,t){return"string"==typeof e&&e.length>0?{color:e,isOverride:!0}:{color:zt(t),isOverride:!1}}const Mt=110;let It=class extends ce{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set}_toggleEntry(e){const t=new Set(this._hiddenEntries);t.has(e)?t.delete(e):t.add(e),this._hiddenEntries=t}_sunFor(e){const t=e.entities.sun_sensor;if(!t)return null;const o=this.hass.states[t];if(!o)return null;const i=parseFloat(o.state);return Number.isNaN(i)?null:{...o.attributes,window_azimuth:o.attributes.window_azimuth}}_coverPositionFor(e){const t=e.entities.target_position_sensor;if(!t)return null;const o=parseFloat(this.hass.states[t]?.state??"");return Number.isNaN(o)?null:o}_actualPositionFor(e){const t=e.entities.target_position_sensor;if(!t)return null;const o=this.hass.states[t]?.attributes;return o?.actual_positions?function(e){const t=Object.values(e).filter(e=>"number"==typeof e);return 0===t.length?null:t.reduce((e,t)=>e+t,0)/t.length}(o.actual_positions):null}_solarTargetFor(e){const t=e.entities.target_position_sensor;if(!t)return null;const o=this.hass.states[t]?.attributes,i=o?.raw_calculated_position;return"number"==typeof i&&Number.isFinite(i)?i:null}_manualOverrideActive(e){const t=e.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_sunInfrontFor(e){const t=e.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}_sunDotStateFor(e,t){const o=e.entities.decision_trace_sensor?this.hass.states[e.entities.decision_trace_sensor]?.attributes:void 0;return Et({belowHorizon:t.elevation<=0,sunState:o?.sun_state??null,directSunValid:o?.direct_sun_valid??!1,inFov:!0===t.in_fov})}_readActiveAzimuth(e){if(!e)return null;const t=this.hass.states[e];if(!t)return null;if("unavailable"===t.state||"unknown"===t.state)return null;const o=t.attributes.azimuth;return"number"==typeof o&&Number.isFinite(o)?o:null}_buildOverlays(){const e=[];return this.discovered_list.forEach((t,o)=>{const i=this._sunFor(t);if(!i)return;const s=t.entities.sun_sensor,n=parseFloat(this.hass.states[s]?.state??"0"),{color:a,isOverride:r}=Ot(this.coverColors?.[o],o),l=this._coverPositionFor(t),c=function(e,t,o){return e&&null!=t&&Number.isFinite(t)?t===o?null:t:null}(this._manualOverrideActive(t),this._solarTargetFor(t),l);e.push({d:t,sun:i,sunAzi:n,sunInfront:this._sunInfrontFor(t),dotState:this._sunDotStateFor(t,i),coverPos:c??l,actualPos:this._actualPositionFor(t),coverType:t.cover_type,color:a,isOverride:r,index:o})}),e}render(){if(!this.hass)return U;if(!this.discovered_list||0===this.discovered_list.length)return q`<div class="placeholder">${De("compass.placeholder_no_entries",this.hass)}</div>`;const e=this._buildOverlays();if(0===e.length)return q`<div class="placeholder">${De("compass.placeholder_no_sun",this.hass)}</div>`;const t=e.filter(e=>!this._hiddenEntries.has(e.d.entry_id)),o=Ye(this.northOffsetDeg),i=e.length>1,s=e[0],n=s.sunAzi,a=s.sun.elevation,r=We(n,a,o),l={night:-1,outside_fov:0,in_fov_not_valid:1,hitting:2},c=a<=0?"night":e.reduce((e,t)=>l[t.dotState]>l[e]?t.dotState:e,"outside_fov"),d=Ct[c],{latitude:h,longitude:u,time_zone:p}=this.hass.config,g=void 0!==h&&void 0!==u?gt(h,u,_t(p)):[],m=this.showMoon&&void 0!==h&&void 0!==u?yt(h,u):null,_=null!==m&&m.elevation>0,f=m?m.phase<.5?-24*m.phase:24*(1-m.phase):0,v=_?We(m.azimuth,m.elevation,o):null,y=v?v.x*Mt:0,b=v?v.y*Mt:0,w=this.showSunPath?function(e){const t=[];let o=-1;for(let i=0;i<e.length;i++)e[i].elevation>0?-1===o&&(o=i):-1!==o&&(t.push({startIdx:o,endIdx:i-1}),o=-1);return-1!==o&&t.push({startIdx:o,endIdx:e.length-1}),t}(g).map(e=>g.slice(e.startIdx,e.endIdx+1).map(e=>{const t=We(e.azimuth,e.elevation,o);return{x:t.x*Mt,y:t.y*Mt,elev:e.elevation}})):[],x=[122,127,135],$=[245,197,24],A=e=>{const t=Math.sqrt(Math.max(0,Math.min(1,e/90))),o=x.map((e,o)=>Math.round(e+($[o]-e)*t));return`rgb(${o[0]},${o[1]},${o[2]})`},k=this.showSunPath&&this.showSunriseSunset?w.filter(e=>e.length>1).map((e,t)=>{const o=e[0],i=e[e.length-1],s=i.x-o.x,n=i.y-o.y,a=s*s+n*n||1,r=e.filter((t,o)=>o%6==0||o===e.length-1).map(e=>({offset:100*Math.max(0,Math.min(1,((e.x-o.x)*s+(e.y-o.y)*n)/a)),color:A(e.elev)}));return{id:`sun-path-grad-${t}`,x1:o.x,y1:o.y,x2:i.x,y2:i.y,stops:r}}):[],C=e=>this.showSunriseSunset?`url(#sun-path-grad-${e})`:"var(--warning-color, gold)",E=Ve(0,124,o),S=Ve(90,124,o),z=Ve(180,124,o),O=Ve(270,124,o),M=Ve(0,Mt,o),I=Ve(180,Mt,o),F=Ve(90,Mt,o),P=Ve(270,Mt,o),j=De("compass.sun_tooltip",this.hass,{az:xt(n),el:xt(a)}),R=null!==m?De("compass.moon_tooltip",this.hass,{phase:m.phaseName,pct:Math.round(100*m.fraction)}):"",N=De("compass.sun_path_tooltip",this.hass);return q`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${W`
            <defs>
              ${_?W`
                <mask id="moon-phase-mask">
                  <circle cx=${y} cy=${b} r=${6} fill="white"></circle>
                  <circle cx=${y+f} cy=${b} r=${6} fill="black"></circle>
                </mask>
              `:U}
              ${k.map(e=>W`
                <linearGradient id=${e.id} gradientUnits="userSpaceOnUse"
                  x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}>
                  ${e.stops.map(e=>W`<stop offset="${e.offset}%" stop-color=${e.color}></stop>`)}
                </linearGradient>
              `)}
            </defs>

            <circle class="grid" r=${Mt}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${Mt/3}></circle>
            <line class="grid thin" x1=${M.x} y1=${M.y} x2=${I.x} y2=${I.y}></line>
            <line class="grid thin" x1=${F.x} y1=${F.y} x2=${P.x} y2=${P.y}></line>

            ${t.map(e=>this._renderEntryLayers(e,i,o,g))}

            ${this.showSunPath&&w.length?W`<g data-tooltip=${N}><title>${N}</title>${w.filter(e=>e.length>1).flatMap((e,t)=>{const o=e.map(e=>`${e.x},${e.y}`).join(" "),i=W`<polyline class="sun-path-line" points=${o}
                        style="stroke:${C(t)}"></polyline>`,s=[];for(let t=0;t<e.length;t+=10){const o=e[t],i=e[Math.max(0,t-1)],n=e[Math.min(e.length-1,t+1)],a=180*Math.atan2(n.y-i.y,n.x-i.x)/Math.PI,r=this.showSunriseSunset?A(o.elev):"var(--warning-color, gold)";s.push(W`<path class="sun-path-chevron"
                          transform=${`translate(${o.x} ${o.y}) rotate(${a})`}
                          d="M -2.4 -3 L 1.8 0 L -2.4 3 L -0.7 0 Z"
                          style=${`fill:${r}`}></path>`)}return[i,...s]})}</g>`:U}

            ${this.showCardinals?W`
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${S.x} y=${S.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${z.x} y=${z.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${O.x} y=${O.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:U}

            ${_?W`
              <g data-tooltip=${R}>
                <title>${R}</title>
                <circle class="moon-outline" cx=${y} cy=${b} r=${6}></circle>
                <image
                  class="moon-img"
                  href=${"data:image/png;base64,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"}
                  x=${y-6}
                  y=${b-6}
                  width=${12}
                  height=${12}
                  mask="url(#moon-phase-mask)"
                ></image>
              </g>
            `:U}

            <g data-tooltip=${j}>
              <title>${j}</title>
              <circle class=${d} cx=${r.x*Mt} cy=${r.y*Mt} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(e,i):U}
        ${this.showStats?this._renderStats(e,i):U}
      </div>
    `}_renderEntryLayers(e,t,o=0,i=[]){const s=Ye(e.sun.window_azimuth),n=Ye(s-e.sun.fov_left),a=Ye(s+e.sun.fov_right),r=this._readActiveAzimuth(e.d.entities.start_sensor),l=this._readActiveAzimuth(e.d.entities.end_sensor),c=null!==r&&null!==l;let d,h;if(c)({wedgeStart:d,wedgeEnd:h}=function(e,t,o,i,s){const n=((o-i)%360+360)%360,a=i+s,r=((t-n)%360+360)%360,l=e=>e<=a?e:e-a<360-e?a:0,c=l(((e-n)%360+360)%360),d=l(r);return c===d?{wedgeStart:n,wedgeEnd:((n+a)%360+360)%360}:{wedgeStart:((n+Math.min(c,d))%360+360)%360,wedgeEnd:((n+Math.max(c,d))%360+360)%360}}(Ye(r),Ye(l),s,e.sun.fov_left,e.sun.fov_right));else{const t=function(e,t,o,i,s){if(void 0===s)return null;const n=Ye(t-o),a=o+i,r=e.filter(e=>((e.azimuth-n)%360+360)%360<=a&&e.elevation>s);return 0===r.length?null:{wedgeStart:r[0].azimuth,wedgeEnd:r[r.length-1].azimuth}}(i,s,e.sun.fov_left,e.sun.fov_right,e.sun.min_elevation);d=t?t.wedgeStart:n,h=t?t.wedgeEnd:a}const u=Ve(s,Mt,o),{outer:p,inner:g}=(m=e.sun.min_elevation,_=e.sun.max_elevation,f=Mt,void 0!==m&&void 0!==_&&m>_?{outer:f,inner:0}:{outer:void 0!==m?f*Ge(m):f,inner:void 0!==_?f*Ge(_):0});var m,_,f;const v=null!==e.coverPos?Ze(e.coverPos,e.coverType,Mt,p):null,y=null!==e.actualPos?Ze(e.actualPos,e.coverType,Mt,p):null,b=e.sun.blind_spot_range?[Ye((w=s)-(x=e.sun.blind_spot_range)[1]),Ye(w-x[0])]:null;var w,x;const $=b?qe(b[0],b[1],Mt,0,o):null,A=qe(d,h,p,g,o),k=c&&(d!==n||h!==a),C=k?qe(n,a,p,g,o):"",E=null!==v&&v>g?qe(d,h,v,g,o):"",S=null!==y&&y>g?qe(d,h,y,g,o):"",z=[];for(const t of vt(i,s,e.sun.fov_left,e.sun.fov_right)){const s=Ue(i,t.startIdx,t.endIdx,e.sun.min_elevation);s&&!He(s.wedgeStart,s.wedgeEnd,d,h)&&z.push({fov:qe(s.wedgeStart,s.wedgeEnd,p,g,o),cover:this.showCoverFill&&null!==v&&v>g?qe(s.wedgeStart,s.wedgeEnd,v,g,o):"",actual:this.showCoverFill&&null!==y&&y>g?qe(s.wedgeStart,s.wedgeEnd,y,g,o):"",from:s.wedgeStart,to:s.wedgeEnd})}const O=t?`${e.d.entry_title}: `:"",M=void 0!==e.sun.min_elevation||void 0!==e.sun.max_elevation?De("compass.elev_suffix",this.hass,{min:xt(e.sun.min_elevation??0),max:xt(e.sun.max_elevation??90)}):"",I=c?`${O}${De("compass.active_sun_arc",this.hass,{from:xt(d),to:xt(h),elev:M})}`:`${O}${De("compass.fov_arc",this.hass,{left:xt(e.sun.fov_left),right:xt(e.sun.fov_right),elev:M})}`,F=`${O}${De("compass.window_normal_tooltip",this.hass,{bearing:xt(s)})}`,P=[];if(null!==e.coverPos){const t="cover_awning"===e.coverType?"compass.cover_position_target_awning":"compass.cover_position_target";P.push(`${O}${De(t,this.hass,{pct:e.coverPos})}`),null!==e.actualPos&&P.push(De("compass.cover_position_actual",this.hass,{pct:Math.round(e.actualPos)}))}const j=P.join("\n"),R=b?`${O}${De("compass.blind_spot",this.hass,{from:xt(b[0]),to:xt(b[1])})}`:"",N=t||e.isOverride,T=t||e.isOverride,D=N?`fill: ${e.color}; stroke: ${e.color};`:"",B=T?`fill: ${e.color}; stroke: ${e.color};`:"",K=N?`fill: ${e.color}; stroke: ${e.color};`:"",V=N?`stroke: ${e.color};`:"",G=N?`fill: ${e.color};`:"",q=this.showCoverFill&&""!==E,Y=this.showBlindSpot&&!!$,L=this.showWindowArrow,Q=`M 0 0 L ${u.x} ${u.y}`,H="display: none;",Z=`${O}${De("compass.fov_arc",this.hass,{left:xt(e.sun.fov_left),right:xt(e.sun.fov_right),elev:M})}`;return W`<g class="entry-overlay">
      ${k?W`<g data-tooltip=${Z}>
              <title>${Z}</title>
              <path class="fov fov-static" style=${D} d=${C}></path>
            </g>`:U}
      <g data-tooltip=${I}>
        <title>${I}</title>
        <path class="fov" style=${D} d=${A}></path>
      </g>
      ${z.map(e=>{const t=`${O}${De("compass.active_sun_arc",this.hass,{from:xt(e.from),to:xt(e.to),elev:M})}`;return W`<g data-tooltip=${t}>
          <title>${t}</title>
          <path class="fov-extra" style=${D} d=${e.fov}></path>
          ${e.cover?W`<path class="cover-fill-extra" style=${B} d=${e.cover}></path>`:U}
          ${e.actual?W`<path class="cover-actual-extra" style=${B} d=${e.actual}></path>`:U}
        </g>`})}
      <g class="arrow-group" data-tooltip=${F} style=${L?"":H}>
        <title>${F}</title>
        <path class="window" style=${V} d=${Q}></path>
        <circle class="window-base" style=${G} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" data-tooltip=${j} style=${q?"":H}>
        <title>${j}</title>
        <path class="cover-fill" style=${B} d=${E}></path>
        ${this.showCoverFill&&S?W`<path class="cover-actual" style=${B} d=${S}></path>`:U}
      </g>
      <g class="blind-group" data-tooltip=${R} style=${Y?"":H}>
        <title>${R}</title>
        <path class="blind-spot" style=${K} d=${$??""}></path>
      </g>
    </g>`}_renderLegend(e,t){return t?q`
        <div class="legend">
          ${e.map(e=>q`
              <button
                type="button"
                class=${at({"entry-toggle":!0,hidden:this._hiddenEntries.has(e.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(e.d.entry_id)}
                @click=${()=>this._toggleEntry(e.d.entry_id)}
              >
                <span class="swatch entry" style="background: ${e.color}"></span>
                ${e.d.entry_title}
                ${e.sunInfront?q`<span class="status valid">${De("compass.in_fov_check",this.hass)}</span>`:e.sun.in_fov?q`<span class="status in-fov">${De("compass.in_fov",this.hass)}</span>`:q`<span class="status">${De("compass.none",this.hass)}</span>`}
              </button>
            `)}
          <div><span class="dot sun valid"></span> ${De("compass.sun",this.hass)}</div>
          ${this.showMoon?q`<div><span class="dot moon-dot"></span> ${De("compass.moon",this.hass)}</div>`:U}
        </div>
      `:q`<div class="legend">
      <div><span class="dot sun valid"></span> ${De("compass.sun",this.hass)}</div>
      ${this.showMoon?q`<div><span class="dot moon-dot"></span> ${De("compass.moon",this.hass)}</div>`:U}
      <div>
        <span
          class="swatch fov"
          style=${e[0]?.isOverride?`background: ${e[0].color}`:""}
        ></span>
        ${De("compass.window_fov",this.hass)}
      </div>
      ${this.showCoverFill?q`<div>
            <span
              class="swatch cover-fill-swatch"
              style=${e[0]?.isOverride?`background: ${e[0].color}`:""}
            ></span>
            ${De("compass.cover_position",this.hass)}
          </div>`:U}
      ${this.showWindowArrow?q`<div>
            <span class="swatch window-swatch"></span> ${De("compass.window_normal",this.hass)}
          </div>`:U}
    </div>`}_renderStats(e,t){const o=e[0],i=o.sunAzi,s=o.sun.elevation,{latitude:n,longitude:a}=this.hass.config,r=this.showMoon&&void 0!==n&&void 0!==a?yt(n,a):null;return t?q`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${De("compass.stat_sun",this.hass)}${xt(i)} /
              ${xt(s)}</span
            >
            ${this.showMoon&&r?q`<span>${r.phaseName} ${Math.round(100*r.fraction)}%</span>`:U}
          </div>
          ${e.map(e=>q`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${e.color}"></span>
                <span class="entry-name">${e.d.entry_title}</span>
                <span>∠${xt(e.sun.gamma)}</span>
                <span>W ${xt(Ye(e.sun.window_azimuth))}</span>
                ${e.sun.in_fov?q`<span class="status in-fov" title=${De("compass.in_fov_tooltip",this.hass)}
                      >✓</span
                    >`:U}
              </div>
            `)}
        </div>
      `:q`<div class="stats dim">
      <span>${De("compass.stat_azi",this.hass)}${xt(i)}</span>
      <span>${De("compass.stat_elev",this.hass)}${xt(s)}</span>
      <span>∠: ${xt(o.sun.gamma)}</span>
      <span
        >${De("compass.stat_window",this.hass)}${xt(Ye(o.sun.window_azimuth))}</span
      >
      ${this.showMoon&&r?q`<span>${r.phaseName} ${Math.round(100*r.fraction)}%</span>`:U}
    </div>`}};It.styles=a`
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
    @container (min-width: 320px) {
      .compass {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }
      .compass svg {
        max-width: none;
        flex: 1 1 0;
        min-width: 200px;
      }
      :host([compact]) .compass svg {
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
      .compass .stats-row {
        justify-content: flex-start;
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
      fill: var(--warning-color, gold);
      fill-opacity: 0.22;
      stroke: var(--warning-color, gold);
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
      /* outside FOV, above horizon — neutral/dim */
      fill: var(--secondary-text-color);
      opacity: 0.7;
    }
    .sun.in-fov {
      /* in FOV but not hitting — light yellow */
      fill: #ffe680;
    }
    .sun.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 4px var(--warning-color, gold));
    }
    .sun.night {
      fill: var(--warning-color, #d4a017);
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
      margin-right: 4px;
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
    .dot.sun {
      background: var(--secondary-text-color);
    }
    .dot.sun.valid {
      background: var(--warning-color, gold);
    }
    .dot.sun.up {
      background: var(--secondary-text-color);
      opacity: 0.7;
    }
    .swatch.cover-fill-swatch {
      background: var(--primary-color);
      opacity: 0.35;
      border-radius: 2px;
    }
    .swatch.window-swatch {
      background: var(--primary-color);
      border-radius: 2px;
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
    .dot.moon-dot {
      background: var(--secondary-text-color);
      opacity: 0.6;
    }
    g[data-tooltip] {
      cursor: default;
    }
  `,e([ge({attribute:!1})],It.prototype,"hass",void 0),e([ge({attribute:!1})],It.prototype,"discovered_list",void 0),e([ge({type:Boolean,reflect:!0})],It.prototype,"compact",void 0),e([ge({attribute:!1})],It.prototype,"showStats",void 0),e([ge({attribute:!1})],It.prototype,"showLegend",void 0),e([ge({attribute:!1})],It.prototype,"showMoon",void 0),e([ge({attribute:!1})],It.prototype,"showCardinals",void 0),e([ge({attribute:!1})],It.prototype,"showBlindSpot",void 0),e([ge({attribute:!1})],It.prototype,"showSunPath",void 0),e([ge({attribute:!1})],It.prototype,"showSunriseSunset",void 0),e([ge({attribute:!1})],It.prototype,"showCoverFill",void 0),e([ge({attribute:!1})],It.prototype,"showWindowArrow",void 0),e([ge({attribute:!1})],It.prototype,"coverColors",void 0),e([ge({attribute:!1})],It.prototype,"northOffsetDeg",void 0),e([me()],It.prototype,"_hiddenEntries",void 0),It=e([he("acp-sky-compass")],It);const Ft=32,Pt=864e5;function jt(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}let Rt=class extends ce{constructor(){super(...arguments),this.discoveredList=[],this.coverColors=[],this.compact=!1}_sunAttrsFor(e){const t=e.entities.sun_sensor;if(!t)return null;const o=this.hass.states[t];return o?o.attributes:null}_sunDotTraceInputs(){const e=this.discoveredList[0]?.entities.decision_trace_sensor,t=e?this.hass.states[e]?.attributes:void 0;return{sunState:t?.sun_state??null,directSunValid:t?.direct_sun_valid??!1}}_scheduleBounds(){const e=this.discoveredList[0]?.entities.control_status_sensor;if(!e)return null;const t=this.hass.states[e]?.attributes;return t?{start:jt(t.schedule_start),end:jt(t.schedule_end)}:null}render(){if(!this.hass||0===this.discoveredList.length)return U;const e=this._sunAttrsFor(this.discoveredList[0]),{latitude:t,longitude:o,time_zone:i}=this.hass.config??{};if(void 0===t||void 0===o||!e)return q`<div class="placeholder">${De("elevation.placeholder",this.hass)}</div>`;const s=_t(i),n=gt(t,o,s),a=new Date,r=e=>{const t=e.getTime()-s.getTime();return Ft+t/864e5*360},l=e=>138-(e- -10)/100*128,c=n.map(e=>`${r(e.t).toFixed(1)},${l(e.elevation).toFixed(1)}`).join(" "),d=l(0),h=r(a),u=this._interpAt(n,a),p=u?l(u.elevation):null,g=!u||u.elevation<=0,m=this._sunDotTraceInputs(),_=Ct[Et({belowHorizon:g,sunState:m.sunState,directSunValid:m.directSunValid,inFov:!0===e.in_fov})].replace(/^sun /,""),f=e=>138-128*e,v=this.discoveredList.length>1,y=this._scheduleBounds(),b=y?function(e,t,o,i){if(!e&&!t)return{offSchedule:[],bars:[]};const s=e=>(e.getTime()-o)/i,n=e=>Math.max(0,Math.min(1,e)),a=e=>n(e),r=e=>e>1?e-Math.floor(e):n(e),l=e=>e>0&&e<1?[e]:[];if(e&&!t){const t=s(e);return{offSchedule:[{x0:0,x1:a(t)}],bars:l(t)}}if(!e&&t){const e=s(t);return{offSchedule:[{x0:r(e),x1:1}],bars:l(e)}}const c=s(e),d=s(t),h=a(c),u=r(d),p=[...l(c),...l(d)];if(h>u)return{offSchedule:[{x0:u,x1:h}],bars:p};const g=[];return h>0&&g.push({x0:0,x1:h}),u<1&&g.push({x0:u,x1:1}),{offSchedule:g,bars:p}}(y.start,y.end,s.getTime(),Pt):{offSchedule:[],bars:[]},w=e=>Ft+360*e,x=b.offSchedule.map(e=>({x:w(e.x0),width:w(e.x1)-w(e.x0)})),$=y?.start&&s?(y.start.getTime()-s.getTime())/Pt:null,A=b.bars.map(e=>{const t=null!==$&&Math.abs(e-$)<1e-9?y.start.toISOString():y.end.toISOString(),o=null!==$&&Math.abs(e-$)<1e-9;return{x:w(e),label:$t(t,i),tooltip:De(o?"elevation.schedule_start_tooltip":"elevation.schedule_end_tooltip",this.hass)}}),k=(()=>{if(!y)return null;const e=y.start?$t(y.start.toISOString(),i):null,t=y.end?$t(y.end.toISOString(),i):null;return e&&t?De("elevation.schedule",this.hass,{from:e,to:t}):e?De("elevation.schedule_from",this.hass,{from:e}):t?De("elevation.schedule_until",this.hass,{to:t}):null})(),C=this.discoveredList.map((e,t)=>{const o=this._sunAttrsFor(e),{color:s,isOverride:a}=Ot(this.coverColors?.[t],t),l=a;if(!o)return{d:e,runs:[],inPlotBands:[],runBars:[],label:"",color:s,inlineFill:l};const c=vt(n,o.window_azimuth,o.fov_left,o.fov_right),d="number"==typeof o.min_elevation,h="number"==typeof o.max_elevation,{loFrac:u,hiFrac:p}=function(e,t){if(void 0!==e&&void 0!==t&&e>t)return{loFrac:0,hiFrac:1};const o=e=>Math.max(0,Math.min(1,(e- -10)/100));return{loFrac:void 0!==e?o(e):0,hiFrac:void 0!==t?o(t):1}}(o.min_elevation,o.max_elevation),g=d||h?f(p):10,m=d||h?f(u):138,_=g,y=Math.max(0,m-g),b=c.map(e=>({x0:r(n[e.startIdx].t),x1:r(n[e.endIdx].t),y:_,height:y})),w=c.map(e=>({x0:r(n[e.startIdx].t),x1:r(n[e.endIdx].t),range:`${$t(n[e.startIdx].t.toISOString(),i)} → ${$t(n[e.endIdx].t.toISOString(),i)}`})),x=c.map(e=>`${$t(n[e.startIdx].t.toISOString(),i)} → ${$t(n[e.endIdx].t.toISOString(),i)}`).join(", "),$=[];return v||(d&&$.push(m),h&&$.push(g)),{d:e,runs:c,inPlotBands:b,runBars:w,label:x,color:s,inlineFill:l,limitLines:$}}),E=C.some(e=>e.runs.length>0),S=v?function(e){if(e<=0)return{rows:[],height:0};const t=Array.from({length:e},(e,t)=>({y:0+11*t,height:8}));return{rows:t,height:0+8*e+3*(e-1)+0}}(C.length):{rows:[],height:0},z=138-S.height-3;return q`
      <div class="wrap">
        <div class="head">
          <span class="label">${De("elevation.title",this.hass)}</span>
          <span class="head-meta">
            ${v?U:E?q`<span class="dim"
                      >${De("elevation.fov_windows",this.hass,{windows:C[0].label})}</span
                    >`:q`<span class="dim">${De("elevation.no_fov_today",this.hass)}</span>`}
            ${k?q`<span class="dim schedule">${k}</span>`:U}
          </span>
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${W`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(e=>W`
              <line class="grid" x1=${Ft} y1=${l(e)} x2=${392} y2=${l(e)} />
              <text class="tick" x=${28} y=${l(e)+3} text-anchor="end">${e}°</text>
            `)}

            <!-- horizon -->
            <line class="horizon" x1=${Ft} y1=${d} x2=${392} y2=${d} />

            <!-- elevation limit gridlines (single-window legacy path only) -->
            ${C.flatMap(e=>(e.limitLines??[]).map(e=>W`<line class="limit-line" x1=${Ft} y1=${e} x2=${392} y2=${e} />`))}

            <!-- In-plot FOV bands: single-window legacy path only. -->
            ${v?U:C.flatMap(e=>e.inPlotBands.map(t=>W`<rect
                        class="fov-band"
                        x=${t.x0}
                        y=${t.y}
                        width=${t.x1-t.x0}
                        height=${t.height}
                        style=${e.inlineFill?`fill:${e.color}`:U}
                      />`))}

            <!-- Per-window FOV ribbon (multi-window only): one row per window,
                 a faint full-width track plus color-keyed bars for in-FOV runs,
                 sharing the plot's xAt() time scale. Overlaid as a band anchored
                 to the bottom of the plot; drawn BEFORE the curve so the blue
                 curve stays crisp on top. -->
            ${S.rows.flatMap((e,t)=>{const o=C[t],i=z+e.y,s=o.runs.length?o.d.entry_title:De("elevation.fov_window_named",this.hass,{name:o.d.entry_title,windows:De("elevation.no_fov_today",this.hass)}),n=W`<rect
                class="ribbon-track"
                x=${Ft}
                y=${i}
                width=${360}
                height=${e.height}
                rx="2"
              ><title>${s}</title></rect>`,a=o.runBars.map(t=>W`<rect
                  class="ribbon-bar"
                  x=${t.x0}
                  y=${i}
                  width=${t.x1-t.x0}
                  height=${e.height}
                  rx="2"
                  style=${`fill:${o.color}`}
                ><title>${De("elevation.fov_window_named",this.hass,{name:o.d.entry_title,windows:t.range})}</title></rect>`);return[n,...a]})}

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
            ${A.flatMap(e=>[W`<line
                class="schedule-bar"
                x1=${e.x}
                y1=${10}
                x2=${e.x}
                y2=${138}
              ><title>${e.tooltip}</title></line>`,W`<text
                class="schedule-tick"
                x=${e.x}
                y=${17}
                text-anchor="middle"
              >${e.label}</text>`])}

            <!-- elevation curve (drawn after the ribbon so it sits on top) -->
            <polyline class="curve" points=${c} />

            <!-- current-time cursor + sun dot, drawn last so they sit on top of
                 the curve AND the ribbon bars. A wide transparent hit-line widens
                 the hover target so the thin now-line is easy to tooltip. -->
            <g class="now-group">
              <title>${$t(a.toISOString(),i)}</title>
              <line class="now-hit" x1=${h} y1=${10} x2=${h} y2=${138} />
              <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />
            </g>
            ${null!==p?W`<circle class="sun-dot ${_}" cx=${h} cy=${p} r="4" />`:U}

            <!-- x-axis gridlines + time labels at every 6h, drawn last so the
                 axis sits on the topmost layer (nothing paints over the times).
                 Edge labels anchor inward (start at 00:00, end at 24:00) so they
                 don't clip past the viewBox. -->
            ${[0,6,12,18,24].map(e=>{const t=new Date(s.getTime()+36e5*e),o=0===e?"start":24===e?"end":"middle";return W`
                <line class="grid faint" x1=${r(t)} y1=${10} x2=${r(t)} y2=${138} />
                <text class="tick" x=${r(t)} y=${152} text-anchor=${o}>${e.toString().padStart(2,"0")}:00</text>
              `})}
          `}
        </svg>
      </div>
    `}_interpAt(e,t){if(0===e.length)return null;const o=t.getTime();if(o<=e[0].t.getTime())return e[0];if(o>=e[e.length-1].t.getTime())return e[e.length-1];for(let i=1;i<e.length;i++)if(e[i].t.getTime()>=o){const s=e[i-1],n=e[i],a=(o-s.t.getTime())/(n.t.getTime()-s.t.getTime());return{t:t,elevation:s.elevation+(n.elevation-s.elevation)*a,azimuth:s.azimuth+(n.azimuth-s.azimuth)*a}}return e[e.length-1]}};function Nt(e,t){if(!0===e?.custom_position_minimum_mode&&Array.isArray(e.custom_position_slots)&&void 0!==e.custom_position_active_slot){const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);if(void 0!==t&&null!==t.position&&void 0!==t.position)return t.position}return t}function Tt(e){const t=e.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(t))return"custom_position";switch(t){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return t}}function Dt(e,t,o,i=ke){const s=new Map;for(const t of e){if(!t.matched)continue;const e=Tt(t.handler);Ae.includes(e)&&s.set(e,t)}const n=[...Ae].reverse().filter(e=>s.has(e));return 0===n.length?t.reason??"":n.map(e=>function(e,t,o,i){const s=i[e]??e,n=t.position,a=null==n?"":` ${wt(n)}`;if("custom_position"!==e)return`${s}${a}`.trimEnd();return`${o.custom_position_active_slot_name?`${s} · ${o.custom_position_active_slot_name}`:o.custom_position_active_slot?`${s} #${o.custom_position_active_slot}`:s}${a}${!0===o.custom_position_minimum_mode?" floor":""}`}(e,s.get(e),t,i)).join(" → ")}Rt.styles=a`
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
      fill: var(--warning-color, gold);
      fill-opacity: 0.18;
    }
    .off-schedule-zone {
      fill: var(--divider-color);
      fill-opacity: 0.12;
      pointer-events: none;
    }
    .schedule-bar {
      stroke: var(--divider-color);
      stroke-width: 1;
      cursor: default;
    }
    .schedule-tick {
      font-size: 8px;
      fill: var(--secondary-text-color);
    }
    .ribbon-track {
      fill: var(--divider-color);
      fill-opacity: 0.25;
      cursor: default;
    }
    .ribbon-bar {
      fill: var(--warning-color, gold);
      fill-opacity: 0.85;
      cursor: default;
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
      cursor: default;
    }
    /* Colour states mirror acp-sky-compass .sun.* so the sun reads the same
       across both visuals. */
    .sun-dot {
      fill: var(--secondary-text-color);
      transition: fill 0.3s ease;
    }
    .sun-dot.up {
      /* outside FOV, above horizon — neutral/dim */
      fill: var(--secondary-text-color);
      opacity: 0.7;
    }
    .sun-dot.in-fov {
      /* in FOV but not hitting — light yellow */
      fill: #ffe680;
    }
    .sun-dot.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 3px var(--warning-color, gold));
    }
    .sun-dot.night {
      fill: var(--warning-color, #d4a017);
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
  `,e([ge({attribute:!1})],Rt.prototype,"hass",void 0),e([ge({attribute:!1})],Rt.prototype,"discoveredList",void 0),e([ge({attribute:!1})],Rt.prototype,"coverColors",void 0),e([ge({type:Boolean,reflect:!0})],Rt.prototype,"compact",void 0),Rt=e([he("acp-elevation-chart")],Rt);let Bt=class extends ce{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this.hideInactive=!1}_trace(){const e=this.discovered.entities.decision_trace_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=t.attributes;if(!o?.trace)return null;const i=new Map;for(const e of o.trace)i.set(Tt(e.handler),{matched:e.matched,reason:e.reason,position:e.position});const s={};for(const[e,t]of Object.entries(Ce))s[e]=De(t,this.hass);return{winner:t.state,reason:o.reason??"",steps:i,enabledHandlers:o.enabled_handlers,summary:Dt(o.trace,o,t.state,s),inTimeWindow:o.in_time_window}}render(){if(!this.hass||!this.discovered)return U;const e=this._trace();if(!e)return q`<div class="placeholder">${De("decision.placeholder",this.hass)}</div>`;const t=function(e){if(!e)return new Set;const t=new Set(e);return new Set(Ae.filter(e=>!t.has(e)))}(e.enabledHandlers),o=function(e,t,o,i,s=new Set){return e.filter(e=>e===o||!s.has(e)&&(!i||!0===t.get(e)?.matched))}(Ae,e.steps,e.winner,this.hideInactive,t);return q`
      <div class="wrap">
        <div class="head">
          <span class="label">${De("decision.pipeline",this.hass)}</span>
          <span class="winner">${De("decision.winner",this.hass,{name:e.winner})}</span>
        </div>
        ${!1===e.inTimeWindow?q`<div
              class="off-schedule"
              title=${De("decision.outside_schedule_tooltip",this.hass)}
            >
              ${De("decision.outside_schedule",this.hass)}
            </div>`:U}
        ${this.showSummary&&e.summary?q`<div class="summary" title=${De("decision.summary_tooltip",this.hass)}>
              ${e.summary}
            </div>`:U}
        <div class="rows">
          ${o.map(t=>this._row(t,e.steps.get(t),e.winner===t))}
        </div>
        <div class="reason dim">${e.reason}</div>
      </div>
    `}_row(e,t,o){const i=t?.matched??!1,s=t?.reason??De("decision.not_evaluated",this.hass),n=t?.position;return q`
      <div class="row ${o?"winner":i?"match":"skip"}">
        <span class="name">${De(Ce[e],this.hass)}</span>
        <span class="dots" aria-hidden="true">${i?"████":"────"}</span>
        <span class="pos">${null!=n?wt(n):""}</span>
        <span class="reason-inline dim">${s}</span>
        ${o?q`<span class="badge">✓</span>`:U}
      </div>
    `}};var Kt,Vt;Bt.styles=a`
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
      cursor: default;
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
      cursor: default;
    }
    :host([compact]) .off-schedule {
      font-size: 0.72rem;
      padding: 2px 6px;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      padding: 16px;
      text-align: center;
    }
  `,e([ge({attribute:!1})],Bt.prototype,"hass",void 0),e([ge({attribute:!1})],Bt.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Bt.prototype,"compact",void 0),e([ge({type:Boolean,reflect:!0,attribute:"show-summary"})],Bt.prototype,"showSummary",void 0),e([ge({type:Boolean,reflect:!0,attribute:"hide-inactive"})],Bt.prototype,"hideInactive",void 0),Bt=e([he("acp-decision-strip")],Bt),function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Kt||(Kt={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Vt||(Vt={}));const Gt=["closed","locked","off"],qt=(e,t,o,i)=>{i=i||{},o=null==o?{}:o;const s=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return s.detail=o,e.dispatchEvent(s),s},Wt=e=>{qt(window,"haptic",e)};function Yt(e){return void 0!==e&&"none"!==e.action}function Ut(e,t,o){return e.filter(e=>"off"===e||("solar"===e?function(e){return e.solarMatched&&!e.cloudIsWinner}(o)&&!1!==t?.solar:!1!==t?.[e]))}function Lt(e){return!!e&&e.some(e=>e.matched&&"solar"===Tt(e.handler))}function Qt(e){return"cloud"===Tt(e)}function Ht(e){if(!1===e.integrationEnabled)return"off";const t=Tt(e.winner);return e.manualActive&&"force"!==t&&"custom_position"!==t?"manual":Oe[t]??"auto"}function Zt(e,t){return{solarMatched:Lt(e),cloudIsWinner:Qt(t)}}let Jt=class extends ce{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0,this.manualActive=!1,this.resumable=!1}render(){const e=this._kind(),t=Me[e],o=this.hass?De(Ie[e],this.hass):t.label,i=this._label(e,o),s=Fe[e],n=q`${s?q`<ha-icon class="badge-icon" icon=${s}></ha-icon>`:U}${i}${this.resumable?q`<ha-icon class="resume-icon" icon="mdi:restore"></ha-icon>`:U}`;if(this.resumable){const o=this.hass?De("tile.resume_aria",this.hass):"Resume automatic control";return q`<button
        class="badge kind-${e} resumable"
        style="background:${t.bg};color:${t.fg};"
        part="badge"
        type="button"
        title=${o}
        aria-label=${o}
        @click=${this._onResumeClick}
        @pointerdown=${this._stop}
      >
        ${n}
      </button>`}return q`<span
      class="badge kind-${e}"
      style="background:${t.bg};color:${t.fg};"
      part="badge"
      >${n}</span
    >`}_stop(e){e.stopPropagation()}_onResumeClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-resume",{bubbles:!0,composed:!0}))}_kind(){return this.kindOverride??Ht({winner:this.winner,integrationEnabled:this.integrationEnabled,manualActive:this.manualActive})}_label(e,t){return"manual"===e?this.manualEndIso?$t(this.manualEndIso):t:"custom_position"===e?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${t} #${this.slotNumber}`:t}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?this.hass?De("badge.floor_suffix",this.hass):" ↥":""}`:t}};Jt.styles=a`
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
  `,e([ge({attribute:!1})],Jt.prototype,"hass",void 0),e([ge()],Jt.prototype,"winner",void 0),e([ge({attribute:"manual-end-iso"})],Jt.prototype,"manualEndIso",void 0),e([ge({type:Number,attribute:"slot-number"})],Jt.prototype,"slotNumber",void 0),e([ge({attribute:"slot-name"})],Jt.prototype,"slotName",void 0),e([ge({type:Number})],Jt.prototype,"pct",void 0),e([ge({type:Boolean,attribute:"minimum-mode"})],Jt.prototype,"minimumMode",void 0),e([ge({type:Boolean,reflect:!0})],Jt.prototype,"compact",void 0),e([ge({type:Boolean,attribute:"integration-enabled"})],Jt.prototype,"integrationEnabled",void 0),e([ge({type:Boolean,attribute:"manual-active"})],Jt.prototype,"manualActive",void 0),e([ge({attribute:"kind-override"})],Jt.prototype,"kindOverride",void 0),e([ge({type:Boolean,reflect:!0})],Jt.prototype,"resumable",void 0),Jt=e([he("acp-tile-badge")],Jt);let Xt=class extends ce{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualEndIso(){const e=this.discovered.entities.manual_override_end_sensor;if(!e)return null;const t=this.hass.states[e];return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:null}_motionStatus(){const e=this.discovered.entities.motion_status_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=t.attributes.motion_timeout_end_time;return{state:t.state,endIso:o??null}}_forceActive(){const e=this.discovered.entities.force_override_sensor;if(!e)return 0;const t=this.hass.states[e];return t&&parseInt(t.state,10)||0}_resetManual(){const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_motionStateLabel(e,t){if(e){const t=this.hass.states[e],o=this.hass.formatEntityState;if(t&&"function"==typeof o){const e=o(t);if(e)return e}}return t.replace(/_/g," ")}render(){if(!this.hass||!this.discovered)return U;const e=this._manualActive(),t=this._manualEndIso(),o=this._motionStatus(),i=this.discovered.entities.motion_status_sensor,s=this._forceActive(),n=this.discovered.entities.reset_override_button,a=De("overrides.reset_manual",this.hass);return q`
      <div class="wrap">
        <div class="label dim">${De("overrides.title",this.hass)}</div>
        <div class="grid">
          <div class="tile ${e?"active":""}">
            <div class="tile-label">${De("overrides.manual",this.hass)}</div>
            <div class="tile-value">
              ${De(e?"overrides.active":"overrides.off",this.hass)}
            </div>
            ${t?q`<div class="tile-sub dim">
                  ${De("overrides.ends_in",this.hass,{time:At(t,this.hass)})}
                </div>`:U}
          </div>

          <div class="tile ${s>0?"active warning":""}">
            <div class="tile-label">${De("overrides.force",this.hass)}</div>
            <div class="tile-value">
              ${s>0?De("overrides.active_count",this.hass,{count:s}):De("overrides.off",this.hass)}
            </div>
          </div>

          ${o?q`<div class="tile ${"motion_detected"===o.state?"active":""}">
                <div class="tile-label">${De("overrides.motion",this.hass)}</div>
                <div class="tile-value">${this._motionStateLabel(i,o.state)}</div>
                ${o.endIso?q`<div class="tile-sub dim">
                      ${De("overrides.timeout",this.hass,{time:At(o.endIso,this.hass)})}
                    </div>`:U}
              </div>`:U}
          ${n?this.resetEnabled?q`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${a}</div>
                </button>`:q`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${a}</div>
                </button>`:U}
        </div>
      </div>
    `}};Xt.styles=a`
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
  `,e([ge({attribute:!1})],Xt.prototype,"hass",void 0),e([ge({attribute:!1})],Xt.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Xt.prototype,"compact",void 0),e([ge({type:Boolean,attribute:"reset-enabled"})],Xt.prototype,"resetEnabled",void 0),Xt=e([he("acp-overrides-panel")],Xt);const eo={summer_mode:"mdi:weather-sunny",winter_mode:"mdi:snowflake",intermediate:"mdi:weather-partly-cloudy"};let to=class extends ce{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return U;const e=this.discovered.entities.climate_status_sensor;if(!e)return U;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return U;if("unknown"===t.state||""===t.state){const e=this.discovered.entities.climate_mode_switch,t=!!e&&"off"===this.hass.states[e]?.state,o=De(t?"climate.mode_off":"climate.standby",this.hass),i=t?"mdi:power-off":"mdi:thermostat";return q`
        <div class="wrap">
          <div class="head">
            <span class="label">${De("climate.title",this.hass)}</span>
          </div>
          <div class="strategy standby">
            <ha-icon icon=${i}></ha-icon>
            <span class="strategy-name dim">${o}</span>
          </div>
        </div>
      `}const o=t.state,i=t.attributes??{},s=eo[o]??"mdi:thermostat",n=i.temperature_unit??"°",a=this.hass.formatEntityState,r="function"==typeof a?a(t)??o:o,l=void 0!==i.active_temperature?`${i.active_temperature.toFixed(1)}${n}`:"—",c=[void 0!==i.indoor_temperature?{label:De("climate.indoor",this.hass),value:i.indoor_temperature,unit:n}:null,void 0!==i.outdoor_temperature?{label:De("climate.outdoor",this.hass),value:i.outdoor_temperature,unit:n}:null].filter(e=>null!==e),d=[{label:De("climate.presence",this.hass),value:i.is_presence,icon:"mdi:account-check"},{label:De("climate.sunny",this.hass),value:i.is_sunny,icon:"mdi:white-balance-sunny"},{label:De("climate.lux",this.hass),value:i.lux_active,icon:"mdi:brightness-7"},{label:De("climate.irradiance",this.hass),value:i.irradiance_active,icon:"mdi:solar-power"}].filter(e=>void 0!==e.value);return q`
      <div class="wrap">
        <div class="head">
          <span class="label">${De("climate.title",this.hass)}</span>
          <span class="dim">${De("climate.active",this.hass,{strategy:l})}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${s}></ha-icon>
          <span class="strategy-name">${r}</span>
        </div>
        ${c.length?q`
              <div class="temps">
                ${c.map(e=>q`
                    <div class="temp">
                      <span class="temp-label dim">${e.label}</span>
                      <span class="temp-value">${e.value.toFixed(1)}${e.unit}</span>
                    </div>
                  `)}
              </div>
            `:U}
        ${d.length?q`
              <div class="conditions">
                ${d.map(e=>q`
                    <div class="chip ${e.value?"on":"off"}" title=${e.label}>
                      <ha-icon icon=${e.icon}></ha-icon>
                      <span>${e.label}</span>
                    </div>
                  `)}
              </div>
            `:U}
      </div>
    `}};to.styles=a`
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
  `,e([ge({attribute:!1})],to.prototype,"hass",void 0),e([ge({attribute:!1})],to.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],to.prototype,"compact",void 0),to=e([he("acp-climate-panel")],to);let oo=class extends ce{constructor(){super(...arguments),this.compact=!1,this.coverColor=null}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return{target:null,covers:{}};const t=this.hass.states[e];if(!t)return{target:null,covers:{}};const o=parseFloat(t.state),i=t.attributes;return{target:Number.isNaN(o)?null:o,covers:i?.actual_positions??{}}}_mismatched(){const e=this.discovered.entities.position_mismatch_binary;if(!e)return new Set;const t=this.hass.states[e];if("on"!==t?.state)return new Set;const o=t.attributes.entities;return o?new Set(Object.entries(o).filter(([,e])=>e.mismatch).map(([e])=>e)):new Set}_setPosition(e,t){this.hass.callService($e,"set_position",{position:t},{entity_id:e})}render(){if(!this.hass||!this.discovered)return U;const{target:e,covers:t}=this._target(),o=this._mismatched(),i=Object.entries(t);return 0===i.length?q`<div class="placeholder">${De("covers.placeholder",this.hass)}</div>`:q`
      <div class="wrap" style=${this.coverColor?`--acp-cover-color:${this.coverColor}`:U}>
        <div class="head">
          <span class="label">${De("covers.title",this.hass)}</span>
          <span class="target"
            >${De("covers.target",this.hass,{pct:wt(e)})}</span
          >
        </div>
        ${i.map(([t,i])=>this._bar(t,i,e,o.has(t)))}
      </div>
    `}_bar(e,t,o,i){const s=this.hass.states[e]?.attributes?.friendly_name??e,n=t??0,a=o??0;return q`
      <div class="cover ${i?"mismatch":""}">
        <div class="name" title=${e}>${s}</div>
        <div class="num">${wt(t)}</div>
        <div
          class="track"
          @click=${t=>this._handleTrackClick(t,e)}
          title=${De("covers.click_to_set",this.hass)}
        >
          <div class="fill" style="width:${n}%"></div>
          <div class="fill-closed" style="width:${100-n}%"></div>
          ${null!==o?q`<div
                class="marker"
                style="left:${a}%"
                title=${De("covers.target_tooltip",this.hass,{pct:a})}
              ></div>`:U}
        </div>
        ${i?q`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:U}
      </div>
    `}_handleTrackClick(e,t){const o=e.currentTarget.getBoundingClientRect(),i=Math.round((e.clientX-o.left)/o.width*100),s=Math.max(0,Math.min(100,i));this._setPosition(t,s)}};var io;oo.styles=a`
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
      grid-template-columns: minmax(80px, 1fr) 48px 3fr auto;
      gap: 8px;
      align-items: center;
      font-size: 0.82rem;
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
    /* Open portion of the cover — gold, matching the compass FOV wedge
       (--warning-color at fill-opacity 0.22). */
    .fill {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--warning-color, gold) 22%, transparent);
      transition: width 0.3s ease;
    }
    /* Closed portion — the user-selected cover colour, falling back to blue
       (--primary-color), matching the compass cover wedge at fill-opacity 0.3. */
    .fill-closed {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 30%, transparent);
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
  `,e([ge({attribute:!1})],oo.prototype,"hass",void 0),e([ge({attribute:!1})],oo.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],oo.prototype,"compact",void 0),e([ge({attribute:!1})],oo.prototype,"coverColor",void 0),oo=e([he("acp-cover-bar")],oo);const so=864e5;let no=io=class extends ce{constructor(){super(...arguments),this.samples=[],this.events=[],this.now=Date.now(),this._hoverIdx=null,this._onPointerMove=e=>{const t=e.currentTarget.getBoundingClientRect();if(t.width<=0)return;const o=(e.clientX-t.left)/t.width,i=Math.max(0,Math.min(1,o))*io.VIEW_W;this._hoverIdx=this._nearestSampleIdx(i)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){if(!this.samples||0===this.samples.length)return U;const{VIEW_W:e,VIEW_H:t,TOP_PAD:o,EVENT_HIT_W:i}=io,s=t-o,n=mt(new Date(this.now)).getTime(),a=t=>Le(t,n,e),r=this.samples.map(e=>{const t=Date.parse(e.t);return{t:t,x:a(t),y:o+(1-ao(e.position)/100)*s,sample:e,inDay:!Number.isNaN(t)&&t>=n&&t<=n+so}}),l=r.filter(e=>e.inDay).map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)}`).join(" "),c=(this.events??[]).map(e=>{const s=Date.parse(e.t);if(Number.isNaN(s)||s<n||s>n+so)return null;const r=a(s),l=`evt-${e.kind}`,c=function(e,t){const o=`forecast.event.${e.kind}`,i=De(o,t),s=i===o?e.label??e.kind:i,n=$t(e.t);return"—"===n?s:`${s} — ${n}`}(e,this.hass);return W`<g class="event-group" data-tooltip=${c}>
          <title>${c}</title>
          <line
            class="event-hit"
            x1=${r.toFixed(1)}
            x2=${r.toFixed(1)}
            y1=${o}
            y2=${t}
            stroke-width=${i}
          ></line>
          <line
            class="event-marker ${l}"
            x1=${r.toFixed(1)}
            x2=${r.toFixed(1)}
            y1=${o}
            y2=${t}
          ></line>
        </g>`}).filter(e=>null!==e),d=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<r.length?r[this._hoverIdx]:null,h=d?W`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${d.x.toFixed(1)} x2=${d.x.toFixed(1)}
            y1=${o} y2=${t}></line>
          <circle class="hover-dot" cx=${d.x.toFixed(1)} cy=${d.y.toFixed(1)} r="3"></circle>
        </g>`:U,u=d?q`<div class="hover-label" style=${`left: ${(d.x/e*100).toFixed(2)}%`}>
          ${function(e){const t=$t(e.t),o=`${Math.round(ao(e.position))}%`;return e.handler?`${t} · ${o} · ${e.handler}`:`${t} · ${o}`}(d.sample)}
        </div>`:U,p=[0,6,12,18,24].map(e=>{const i=a(n+36e5*e);return W`
        <line class="grid faint" x1=${i} y1=${o} x2=${i} y2=${t-.5} />
        <text class="axis-label tick-time" x=${i} y=${t-3} text-anchor="middle">${e.toString().padStart(2,"0")}:00</text>
      `}),g=this.now,m=a(g),_=g>=n&&g<=n+so?W`<line class="now" x1=${m.toFixed(1)} y1=${o} x2=${m.toFixed(1)} y2=${t-.5}></line>`:U;return q`
      <div class="wrap">
        <svg
          viewBox="0 0 ${e} ${t}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <title>${De("forecast.hover_hint",this.hass)}</title>
          <line class="baseline" x1="0" y1=${t-.5} x2=${e} y2=${t-.5}></line>
          <text class="axis-label" x="4" y=${o+8} text-anchor="start">100%</text>
          ${p}
          <polyline class="curve" points=${l} fill="none"></polyline>
          ${c} ${h} ${_}
        </svg>
        ${u}
      </div>
    `}_nearestSampleIdx(e){const t=mt(new Date(this.now)).getTime();let o=-1,i=Number.POSITIVE_INFINITY;for(let s=0;s<this.samples.length;s++){const n=Date.parse(this.samples[s].t);if(Number.isNaN(n)||n<t||n>t+so)continue;const a=Le(n,t,io.VIEW_W),r=Math.abs(a-e);r<i&&(i=r,o=s)}return o>=0?o:null}};function ao(e){return Number.isNaN(e)||e<0?0:e>100?100:e}no.VIEW_W=600,no.VIEW_H=80,no.TOP_PAD=10,no.EVENT_HIT_W=12,no.styles=a`
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
    .event-group {
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
    }
  `,e([ge({attribute:!1})],no.prototype,"hass",void 0),e([ge({attribute:!1})],no.prototype,"samples",void 0),e([ge({attribute:!1})],no.prototype,"events",void 0),e([ge({attribute:!1})],no.prototype,"now",void 0),e([me()],no.prototype,"_hoverIdx",void 0),no=io=e([he("acp-forecast-strip")],no);let ro=class extends ce{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this.showElevationChart=!0,this._onResume=()=>{const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const e=this.discovered.device_id;e&&this._navigate(`/config/devices/device/${e}`)},this._openIntegrationPage=()=>{this._navigate(`/config/integrations/integration/${$e}`)},this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}_buildHandlerLabels(){const e={};for(const[t,o]of Object.entries(Ce))e[t]=De(o,this.hass);return e}render(){if(!this.open||!this.hass||!this.discovered)return U;const e=this._winner(),t=this._traceAttrs(),o=this._matchedHandlers(t,e),i=t?Dt(t.trace??[],t,0,this._buildHandlerLabels()):"",s=this._target(),n=this._shouldShowResume(e),a=this._switchOn("integration_enabled_switch"),r=this._switchOn("automatic_control_switch"),l=De("dialog.configure_integration",this.hass),c=De("dialog.open_device_page",this.hass),d=De("dialog.close",this.hass);return q`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${Ee[this.discovered.cover_type]??"mdi:window-shutter"}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${a?r?o.map(e=>q`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${e}
                          .slotNumber=${"custom_position"===e?t?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===e?t?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===e?Nt(t,s)??void 0:void 0}
                          .minimumMode=${"custom_position"===e?t?.custom_position_minimum_mode:void 0}
                        ></acp-tile-badge>`):U:q`<acp-tile-badge
                    .hass=${this.hass}
                    .integrationEnabled=${!1}
                  ></acp-tile-badge>`}
            </div>
            <button
              class="icon-btn options-link"
              type="button"
              aria-label=${l}
              title=${l}
              @click=${this._openIntegrationPage}
            >
              <ha-icon icon="mdi:tune-variant"></ha-icon>
            </button>
            ${this.discovered.device_id?q`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label=${c}
                  title=${c}
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:cog"></ha-icon>
                </button>`:U}
            <button class="close" type="button" aria-label=${d} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${i?q`<div class="summary">${i}</div>`:U}

          <div class="position-block">
            <div class="position-label">${De("dialog.target",this.hass)}</div>
            <div class="position-value">${wt(s)}</div>
            ${this._mismatchActive()?q`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:U}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${n?q`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${De("dialog.resume_auto",this.hass)}
                </button>
              </div>`:U}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?De("dialog.hide_advanced",this.hass):De("dialog.show_advanced",this.hass)}
          </button>
          ${this.advancedOpen?q`<div class="advanced">
                ${this.showCompass?q`<div class="advanced-compass">
                      <acp-sky-compass
                        .hass=${this.hass}
                        .discovered_list=${[this.discovered]}
                        ?compact=${!0}
                        .showLegend=${!1}
                        .showStats=${!0}
                      ></acp-sky-compass>
                    </div>`:U}
                ${this.showElevationChart?q`<acp-elevation-chart
                      .hass=${this.hass}
                      .discoveredList=${[this.discovered]}
                      ?compact=${!0}
                    ></acp-elevation-chart>`:U}
                ${this._renderSlots(t?.custom_position_slots)}
                <acp-decision-strip
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-decision-strip>
                <acp-overrides-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-overrides-panel>
                <acp-climate-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-climate-panel>
              </div>`:U}
        </div>
      </div>
    `}_winner(){const e=this.discovered.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(){const e=this.discovered.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_matchedHandlers(e,t){if(!e?.trace)return[];const o=new Set;for(const t of e.trace){if(!t.matched)continue;const e=Tt(t.handler);Ae.includes(e)&&o.add(e)}const i=Ae.filter(e=>o.has(e)).map(e=>Oe[e]).filter(e=>void 0!==e),s=Zt(e.trace,t);return Ut(i,this.badges,s)}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=parseFloat(t.state);return Number.isNaN(o)?null:o}_mismatchActive(){const e=this.discovered.entities.position_mismatch_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualOverrideOn(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(e){const t=this.discovered.entities[e];return!t||"off"!==this.hass.states[t]?.state}_shouldShowResume(e){return!(!this.discovered.entities.reset_override_button||!this._manualOverrideOn()&&"custom_position"!==Tt(e))}_renderSlots(e){if(!e)return U;const t=e.filter(e=>null!==e.sensor);return 0===t.length?U:q`<div class="slots-section">
      <div class="slots-label">${De("dialog.custom_positions",this.hass)}</div>
      ${t.map(e=>this._renderSlotRow(e))}
    </div>`}_renderSlotRow(e){const t=e.sensor_name??`#${e.slot}`;return q`<div class="slot-row" data-slot=${e.slot}>
      <span class="slot-label">${t}</span>
      <span class="slot-position">${wt(e.position)}</span>
      ${!0===e.min_mode?q`<span
            class="slot-min-mode${null!=e.priority&&e.priority>80?"":" is-bypassable"}"
            title=${De("dialog.floor_tooltip",this.hass)}
          >
            ${De("dialog.floor",this.hass)}
          </span>`:U}
      <button
        class="slot-toggle ${e.enabled?"on":"off"}"
        type="button"
        aria-label=${e.enabled?De("dialog.disable_slot",this.hass,{slot:e.slot}):De("dialog.enable_slot",this.hass,{slot:e.slot})}
        @click=${()=>this._toggleSlot(e)}
      >
        ${e.enabled?De("dialog.on",this.hass):De("dialog.off",this.hass)}
      </button>
    </div>`}_renderControls(){const e=[{role:"automatic_control_switch",label:De("dialog.automatic",this.hass)},{role:"climate_mode_switch",label:De("dialog.climate",this.hass)},{role:"motion_control_switch",label:De("dialog.motion",this.hass)}].filter(e=>!!this.discovered.entities[e.role]);return 0===e.length?U:q`<div class="controls-block">
      <div class="controls-label">${De("dialog.controls",this.hass)}</div>
      <div class="controls-row">${e.map(e=>this._renderSwitchChip(e.role,e.label))}</div>
    </div>`}_renderSwitchChip(e,t){const o=this.discovered.entities[e],i="on"===this.hass.states[o]?.state,s=De(i?"dialog.state_on":"dialog.state_off",this.hass),n=De(i?"dialog.on":"dialog.off",this.hass);return q`<button
      class="ctrl-toggle ${i?"on":"off"}"
      type="button"
      aria-pressed=${i}
      aria-label=${De("dialog.toggle_hint",this.hass,{label:t,state:s})}
      @click=${()=>this._toggleSwitch(o,i)}
    >
      <span class="ctrl-label">${t}</span>
      <span class="ctrl-state">${n}</span>
    </button>`}_toggleSwitch(e,t){this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:e})}_renderForecastStrip(){const e=this.discovered.entities.position_forecast_sensor;if(!e)return U;const t=this.hass.states[e]?.attributes,o=t?.forecast??[],i=t?.events??[];return 0===o.length?U:q`<div class="forecast-block">
      <div class="forecast-label">${De("dialog.todays_forecast",this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${o}
        .events=${i}
        .now=${Date.now()}
      ></acp-forecast-strip>
      <div class="forecast-note">${De("forecast.solar_only_note",this.hass)}</div>
    </div>`}_toggleSlot(e){const t=this.discovered.managed_covers[0];t&&this.hass.callService($e,"set_custom_position",{entity_id:t,slot:e.slot,enabled:!e.enabled})}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};function lo(e){return q`
    <div
      class="editor-footer"
      style="display:flex;align-items:center;justify-content:space-between;gap:8px;"
    >
      <a href=${"https://www.buymeacoffee.com/jrhubott"} target="_blank" rel="noopener noreferrer">
        <img src=${"https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black"} alt=${De("editor.common.support_alt",e)} height="20" />
      </a>
      <span class="version-footer dim">
        ${De("root.footer_version",e,{version:_e})}
      </span>
    </div>
  `}ro.styles=a`
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
    .slot-min-mode {
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 999px;
      background: rgba(156, 39, 176, 0.22);
      color: #6a1b9a;
      cursor: default;
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
  `,e([ge({attribute:!1})],ro.prototype,"hass",void 0),e([ge({attribute:!1})],ro.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],ro.prototype,"open",void 0),e([ge({type:Boolean})],ro.prototype,"advancedOpen",void 0),e([ge({type:Boolean})],ro.prototype,"showCompass",void 0),e([ge({type:Boolean})],ro.prototype,"showElevationChart",void 0),e([ge({attribute:!1})],ro.prototype,"badges",void 0),ro=e([he("acp-more-info-dialog")],ro);const co=["auto","solar","force","weather","manual","custom_position","motion","climate","glare_zone","cloud"],ho={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_compass:!0,show_elevation_chart:!0,show_motion_icon:!0,layout:"detailed",badge_auto:!0,badge_solar:!0,badge_force:!0,badge_weather:!0,badge_manual:!0,badge_custom_position:!0,badge_motion:!0,badge_climate:!0,badge_glare_zone:!0,badge_cloud:!0},uo={entry_id:"editor.common.entry_id",name:"editor.tile.name",icon:"editor.tile.icon",cover:"editor.tile.cover",layout:"editor.tile.layout",show_position:"editor.tile.show_position",show_state:"editor.tile.show_state",show_decision_summary:"editor.tile.show_decision_summary",show_controls:"editor.tile.show_controls",show_badge:"editor.tile.show_badge",badge_section:"editor.tile.badge_section",badge_auto:"editor.tile.badge_auto",badge_solar:"editor.tile.badge_solar",badge_force:"editor.tile.badge_force",badge_weather:"editor.tile.badge_weather",badge_manual:"editor.tile.badge_manual",badge_custom_position:"editor.tile.badge_custom_position",badge_motion:"editor.tile.badge_motion",badge_climate:"editor.tile.badge_climate",badge_glare_zone:"editor.tile.badge_glare_zone",badge_cloud:"editor.tile.badge_cloud",show_compass:"editor.tile.show_compass",show_elevation_chart:"editor.tile.show_elevation_chart",show_motion_icon:"editor.tile.show_motion_icon",tap_action:"editor.tile.tap_action",hold_action:"editor.tile.hold_action",double_tap_action:"editor.tile.double_tap_action"};let po=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=e=>{const t=uo[e.name];return t?De(t,this.hass):e.name},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,o]of Object.entries(ho))e.startsWith("badge_")?t[e]===o&&delete t[e]:this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==o||delete t[e];const o={};for(const e of co){const i=`badge_${e}`;!1===t[i]&&(o[e]=!1),delete t[i]}const i={...this._config??{type:"",entry_id:""},...t};Object.keys(o).length>0?i.badges=o:delete i.badges,this._emit(i)}}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),e.has("_registry")&&null!==this._registry&&this._maybePrefillCover()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Ke(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id}),this._maybePrefillCover()}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,Je(this.hass).then(e=>{this._registry=e,this._maybePrefillCover()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=Xe(this.hass,()=>{this._registryFetchInFlight=!0,Je(this.hass).then(e=>{this._registry=e}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_maybePrefillCover(){if(!this._config?.entry_id||this._config?.cover||!this._registry||!this.hass)return;const e=Be(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=e?.managed_covers??[],1===e?.managed_covers.length&&this._emit({...this._config,cover:e.managed_covers[0]})}render(){if(!this._config)return U;if(this._entriesError&&!this._entries)return q`
        <div class="form">
          <div class="error">
            ${De("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${De("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${De("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          ${lo(this.hass)}
        </div>
      `;const e=this._schema(),{badges:t,...o}=this._config,i={};for(const e of co)t&&!1===t[e]&&(i[`badge_${e}`]=!1);const s={...ho,...o,...i};return q`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${s}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${this._managedCovers.length>1&&!this._config?.cover?q`<div class="hint">${De("editor.tile.cover_blank_hint",this.hass)}</div>`:U}
        ${lo(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[],t=[{value:"one-line",label:De("editor.tile.layout_option_one_line",this.hass)},{value:"detailed",label:De("editor.tile.layout_option_detailed",this.hass)}];let o={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const e=Be(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);e&&e.managed_covers.length>0&&(o={entity:{domain:"cover",include_entities:e.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:o},{name:"layout",selector:{select:{mode:"list",options:t}}},{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{type:"expandable",name:"",title:De("editor.tile.badge_section",this.hass),icon:"mdi:label-multiple-outline",schema:[{type:"grid",name:"",schema:co.map(e=>({name:`badge_${e}`,selector:{boolean:{}}}))}]},{name:"show_motion_icon",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"show_elevation_chart",selector:{boolean:{}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};po.styles=a`
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
  `,e([ge({attribute:!1})],po.prototype,"hass",void 0),e([me()],po.prototype,"_config",void 0),e([me()],po.prototype,"_entries",void 0),e([me()],po.prototype,"_entriesError",void 0),e([me()],po.prototype,"_registry",void 0),e([me()],po.prototype,"_managedCovers",void 0),po=e([he(xe)],po);let go=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),Yt(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return Yt(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${we}: \`entry_id\` is required and must be a non-empty string`);let t={...e};"string"==typeof t.tap_action&&(t={...t,tap_action:"none"===t.tap_action?{action:"none"}:void 0}),this._config=t}getCardSize(){return 1}static async getStubConfig(e){let t="";try{const o=await Ke(e);t=o[0]?.entry_id??""}catch{}return{type:`custom:${we}`,entry_id:t}}static async getConfigElement(){return document.createElement(xe)}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Xe(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){if(this._fetchInFlight)return;this._fetchInFlight=!0;const e=++this._fetchGen;Je(this.hass).then(t=>{e===this._fetchGen&&(this._registry=t,this._registryError=null)}).catch(t=>{e===this._fetchGen&&(this._registryError=t?.message??"entity registry fetch failed")}).finally(()=>{e===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return U;if(null===this._registry)return q`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?De("tile.registry_failed",this.hass,{error:this._registryError}):De("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=Be(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?q`
      <ha-card>${this._renderTile(e)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${e}
        .open=${this._dialogOpen}
        .showCompass=${!1!==this._config.show_compass}
        .showElevationChart=${!1!==this._config.show_elevation_chart}
        .badges=${this._config.badges}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `:q`<ha-card>
        <div class="empty">
          <p class="dim">
            ${De("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`}_buildHandlerLabels(){const e={};for(const[t,o]of Object.entries(Ce))e[t]=De(o,this.hass);return e}_renderTile(e){const t=this._config,o=t.name??e.entry_title,i=this._resolvedCover(e),s=t.icon??function(e,t){if(null!==t&&!Number.isNaN(t)){if(t>=95)return Se[e]??"mdi:window-shutter-open";if(t<=5)return ze[e]??"mdi:window-shutter"}return Ee[e]??"mdi:window-shutter"}(e.cover_type,this._liveCoverPosition(i)),n=!1!==t.show_position,a=!1!==t.show_state,r=!1!==t.show_controls,l=!1!==t.show_badge,c=!1!==t.show_motion_icon?this._motionActiveState(e):null,d=De("timeout_pending"===c?"tile.motion_pending":"tile.motion_detected",this.hass),h="one-line"!==t.layout,u=this._currentPosition(e),p=this._liveCoverPosition(i)??u,g=this._winner(e),m=this._traceAttrs(e),_=this._manualEndIso(e),f=this._isFullyInert(t),v=!0===t.show_decision_summary&&m?Dt(m.trace??[],m,0,this._buildHandlerLabels()):"",y=!!v&&h,b=this._switchOn(e,"integration_enabled_switch"),w=this._switchOn(e,"automatic_control_switch"),x=this._manualOverrideOn(e),$=function(e){const t=function(e){const t=Ht(e);return"motion"!==t?t:!1===e.badges?.motion||e.showMotionIcon?!1===e.badges?.auto?null:"auto":t}(e);return!1===e.inTimeWindow&&!1!==e.badges?.off_schedule&&"off"!==t&&"manual"!==t&&"force"!==t?"off_schedule":t}({winner:g,integrationEnabled:b,manualActive:x,badges:t.badges,showMotionIcon:!1!==t.show_motion_icon,inTimeWindow:m?.in_time_window}),A=Zt(m?.trace,g),k=null!==$&&Ut([$],t.badges,A).length>0,C=l&&k&&!(!1===w&&!0===b),E=function(e){if(!e.integrationEnabled)return!1;if(!e.automaticControl)return!1;if(e.manualActive)return!1;const t=Tt(e.winner);return"force"!==t&&("custom_position"!==t||!e.bypassAutoControl)}({winner:g,integrationEnabled:b,automaticControl:w,manualActive:x,bypassAutoControl:!0===m?.bypass_auto_control}),S=h&&l&&!1!==t.badges?.auto&&E,z=!(S&&"auto"===$),O=a?function(e,t){if(!e||!t)return null;const o=e.states[t];if(!o?.state||"unknown"===o.state||"unavailable"===o.state)return null;if("function"==typeof e.formatEntityState){const t=e.formatEntityState(o);if(t)return t}if("function"==typeof e.localize){const t=e.localize(`component.cover.entity_component._.state.${o.state}`);if(t)return t}return o.state.charAt(0).toUpperCase()+o.state.slice(1)}(this.hass,i):null,M=[O,n&&null!==p?wt(p):null].filter(e=>!!e),I=!!O,F=function(e,t,o){if(!Array.isArray(e?.custom_position_slots))return null;const i=e.custom_position_slots.filter(e=>!0===e.min_mode&&!0===e.enabled&&null!==e.sensor&&null!==e.position&&"on"===t[e.sensor]?.state);if(0===i.length)return null;const s=i.reduce((e,t)=>(t.position??0)>(e.position??0)?t:e),n=s.position,a=s.priority??null;return{slot:s.slot,position:n,label:s.sensor_name??`#${s.slot}`,clamping:null!==o&&n>o,sensorOn:!0,priority:a,resistsManual:null!=a&&a>80}}(m,this.hass.states,u),P=Tt(g),j=!!F&&!("custom_position"===P&&!0===m?.custom_position_minimum_mode)&&b,R=x&&!!e.entities.reset_override_button,N=M.length>0?q`<div class="position">${M.join(" · ")}</div>`:U,T=j?q`<span
          class=${`acp-floor-chip${F.clamping?"":" is-armed"}${F.resistsManual?" resists-manual":" is-bypassable"}`}
          title=${De("dialog.floor_tooltip",this.hass)}
          >${De("dialog.floor",this.hass)} ${wt(F.position)}</span
        >`:U,D=C?q`<acp-tile-badge
          .hass=${this.hass}
          .winner=${g}
          .kindOverride=${$??void 0}
          .integrationEnabled=${b}
          .slotNumber=${m?.custom_position_active_slot}
          .slotName=${m?.custom_position_active_slot_name}
          .pct=${Nt(m,u)??void 0}
          .minimumMode=${m?.custom_position_minimum_mode}
          .manualEndIso=${_}
          .manualActive=${x}
          .resumable=${R}
          @acp-resume=${()=>this._resume(e)}
        ></acp-tile-badge>`:U,B=S?q`<acp-tile-badge
          .hass=${this.hass}
          .winner=${g}
          .kindOverride=${"auto"}
          .integrationEnabled=${b}
        ></acp-tile-badge>`:U;return q`
      <div
        class=${`tile-body${h?" detailed":""}${y?" has-summary":""}${I?" has-state-label":""}${j?" has-floor-chip":""}`}
        role=${f?"group":"button"}
        tabindex=${f?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
          <ha-icon class="cover-icon" icon=${s}></ha-icon>
          ${c?q`<ha-icon
                class="motion-overlay ${c}"
                icon="mdi:motion-sensor"
                title=${d}
              ></ha-icon>`:U}
        </div>
        <div class="label">
          <div class="title" title=${e.entry_title}>${o}</div>
          ${v&&!h?q`<div class="summary">${v}</div>`:U}
          ${y?q`<div class="summary inline-summary" title=${v}>${v}</div>`:U}
        </div>
        ${h&&S?q`<div class="auto-line">${B}</div>`:U}
        ${h?q`<div class="detail-line">
              ${N}${T}${z?D:U}
            </div>`:q`${N}${T}`}
        ${r?q`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${De("tile.open",this.hass)}
                ?disabled=${!i}
                @click=${()=>this._setCoverPosition(i,100)}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${De("tile.stop",this.hass)}
                ?disabled=${!i}
                @click=${()=>this._stopCover(i)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${De("tile.close",this.hass)}
                ?disabled=${!i}
                @click=${()=>this._setCoverPosition(i,0)}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </div>`:U}
        ${h?U:D}
      </div>
    `}_resolvedCover(e){return this._config?.cover?this._config.cover:e.managed_covers[0]}_currentPosition(e){const t=e.entities.target_position_sensor;if(!t)return null;const o=this.hass.states[t];if(!o)return null;const i=parseFloat(o.state);return Number.isNaN(i)?null:i}_liveCoverPosition(e){if(!e)return null;const t=this.hass.states[e]?.attributes?.current_position;return"number"!=typeof t||Number.isNaN(t)?null:t}_winner(e){const t=e.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(e){const t=e.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_motionActiveState(e){const t=e.entities.motion_status_sensor;if(!t)return null;const o=this.hass.states[t]?.state;return"motion_detected"===o||"timeout_pending"===o?o:null}_manualOverrideOn(e){const t=e.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(e,t){const o=e.entities[t];return!o||"off"!==this.hass.states[o]?.state}_manualEndIso(e){if(!this._manualOverrideOn(e))return;const t=e.entities.manual_override_end_sensor;return t?this.hass.states[t]?.state:void 0}_setCoverPosition(e,t){e&&this.hass.callService($e,"set_position",{position:t},{entity_id:e})}_stopCover(e){e&&this.hass.callService($e,"stop",{},{entity_id:e})}_resume(e){const t=e.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}_tapActionConfig(){const e=this._config?.tap_action;if("string"!=typeof e)return e}_isFullyInert(e){return!!(e=>!!e&&"none"===e.action)(this._tapActionConfig())&&!Yt(e.hold_action)&&!Yt(e.double_tap_action)}_fireAction(e){if(!this._config||!this.hass)return;const t=this._tapActionConfig();if("tap"===e&&void 0===t)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const o=this._resolvedCoverFromState();((e,t,o,i)=>{let s;"double_tap"===i&&o.double_tap_action?s=o.double_tap_action:"hold"===i&&o.hold_action?s=o.hold_action:"tap"===i&&o.tap_action&&(s=o.tap_action),((e,t,o,i)=>{if(i||(i={action:"more-info"}),!i.confirmation||i.confirmation.exemptions&&i.confirmation.exemptions.some(e=>e.user===t.user.id)||(Wt("warning"),confirm(i.confirmation.text||`Are you sure you want to ${i.action}?`)))switch(i.action){case"more-info":(o.entity||o.camera_image)&&qt(e,"hass-more-info",{entityId:o.entity?o.entity:o.camera_image});break;case"navigate":i.navigation_path&&((e,t,o=!1)=>{o?history.replaceState(null,"",t):history.pushState(null,"",t),qt(window,"location-changed",{replace:o})})(0,i.navigation_path);break;case"url":i.url_path&&window.open(i.url_path);break;case"toggle":o.entity&&(((e,t)=>{((e,t,o=!0)=>{const i=function(e){return e.substr(0,e.indexOf("."))}(t),s="group"===i?"homeassistant":i;let n;switch(i){case"lock":n=o?"unlock":"lock";break;case"cover":n=o?"open_cover":"close_cover";break;default:n=o?"turn_on":"turn_off"}e.callService(s,n,{entity_id:t})})(e,t,Gt.includes(e.states[t].state))})(t,o.entity),Wt("success"));break;case"call-service":{if(!i.service)return void Wt("failure");const[e,o]=i.service.split(".",2);t.callService(e,o,i.service_data,i.target),Wt("success");break}case"fire-dom-event":qt(e,"ll-custom",i)}})(e,t,o,s)})(this,this.hass,{entity:o,tap_action:t,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},e)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const e=Be(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?.managed_covers[0]}_stop(e){e.stopPropagation()}};go.styles=a`
    :host {
      display: block;
    }
    ha-card {
      padding: 6px 10px;
      overflow: hidden;
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
    /* Narrow column (issue #136): when the dashboard column squeezes the tile,
       the fixed ~180px ↑■▼ control block starves the name. Drop the controls to
       their own full-width row beneath the name/detail lines so the name gets
       the whole column. Each detailed grid variant is re-asserted here at equal
       specificity — placed after the wide rules so it wins when the query
       matches (the file's grid rules rely on source order, not just
       specificity). The breakpoint sits below the harness's 360px tile floor so
       only genuinely narrow columns reflow. */
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
  `,e([ge({attribute:!1})],go.prototype,"hass",void 0),e([me()],go.prototype,"_config",void 0),e([me()],go.prototype,"_registry",void 0),e([me()],go.prototype,"_registryError",void 0),e([me()],go.prototype,"_dialogOpen",void 0),go=e([he(we)],go),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===we)||window.customCards.push({type:we,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const mo=[{key:"sky",labelKey:"editor.main.section_sky_label",descKey:"editor.main.section_sky_desc"},{key:"elevation",labelKey:"editor.main.section_elevation_label",descKey:"editor.main.section_elevation_desc"},{key:"decision",labelKey:"editor.main.section_decision_label",descKey:"editor.main.section_decision_desc"},{key:"covers",labelKey:"editor.main.section_covers_label",descKey:"editor.main.section_covers_desc"},{key:"overrides",labelKey:"editor.main.section_overrides_label",descKey:"editor.main.section_overrides_desc"},{key:"climate",labelKey:"editor.main.section_climate_label",descKey:"editor.main.section_climate_desc"}],_o=mo.map(e=>e.key);let fo=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ke(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??_o}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_onEntryChange(e){const t=e.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:t})}_onSectionToggle(e,t){const o=new Set(this._currentSections);t?o.add(e):o.delete(e);const i=mo.map(e=>e.key).filter(e=>o.has(e));this._emit({...this._config??{type:"",entry_id:""},show_sections:i})}_onCompactToggle(e){this._emit({...this._config??{type:"",entry_id:""},compact:e})}_onCompassStatsToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:e})}_onCompassLegendToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:e})}_onMoonToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_moon:e})}_onHideInactiveToggle(e){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:e})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),o=Number.isFinite(t)?t:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:o})}_onControlToggle(e,t){const o=this._config??{type:"",entry_id:""};this._emit({...o,controls:{...o.controls,[e]:t}})}_onCoverColorChange(e){const t=this._config??{type:"",entry_id:""};this._emit({...t,cover_colors:[e]})}_onCoverColorReset(){const e={...this._config??{type:"",entry_id:""}};delete e.cover_colors,this._emit(e)}render(){if(!this._config)return U;const e=new Set(this._currentSections);return q`
      <div class="form">
        <div class="section">
          <label class="field-label">${De("editor.common.entry_id",this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${De("editor.main.sections",this.hass)}</label>
          <div class="hint">${De("editor.main.sections_hint",this.hass)}</div>
          ${mo.map(t=>q`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${e.has(t.key)}
                  @change=${e=>this._onSectionToggle(t.key,e.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${De(t.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${De(t.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${De("editor.main.controls",this.hass)}</label>
          <div class="hint">${De("editor.main.controls_hint",this.hass)}</div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.integration_enabled??!0}
              @change=${e=>this._onControlToggle("integration_enabled",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${De("editor.main.integration_pill_label",this.hass)}</span
              >
              <span class="toggle-desc">${De("editor.main.integration_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.automatic_control??!0}
              @change=${e=>this._onControlToggle("automatic_control",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${De("editor.main.automatic_pill_label",this.hass)}</span>
              <span class="toggle-desc">${De("editor.main.automatic_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.reset_manual_override??!0}
              @change=${e=>this._onControlToggle("reset_manual_override",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${De("editor.main.reset_button_label",this.hass)}</span>
              <span class="toggle-desc">${De("editor.main.reset_button_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        ${this._config.entry_id?q`
              <div class="section">
                <label class="field-label">${De("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${De("editor.compass.cover_colors_hint",this.hass)}</div>
                ${(()=>{const e=this._config.cover_colors?.[0]??null,t=e??zt(0);return q`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${t}
                        @change=${e=>this._onCoverColorChange(e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-desc"
                          >${e||De("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!e}
                        @click=${()=>this._onCoverColorReset()}
                      >
                        ${De("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})()}
              </div>
            `:U}

        <div class="section">
          <label class="field-label">${De("editor.main.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${e=>this._onCompactToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${De("editor.main.compact_label",this.hass)}</span>
              <span class="toggle-desc">${De("editor.main.compact_desc",this.hass)}</span>
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
                >${De("editor.main.show_compass_stats_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${De("editor.main.show_compass_stats_desc",this.hass)}</span
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
                >${De("editor.main.show_compass_legend_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${De("editor.main.show_compass_legend_desc",this.hass)}</span
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
              <span class="toggle-label">${De("editor.main.show_moon_label",this.hass)}</span>
              <span class="toggle-desc">${De("editor.main.show_moon_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.hide_inactive_handlers??!1}
              @change=${e=>this._onHideInactiveToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${De("editor.main.hide_inactive_label",this.hass)}</span>
              <span class="toggle-desc">${De("editor.main.hide_inactive_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">${De("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${De("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${lo(this.hass)}
      </div>
    `}_renderEntryPicker(){return this._entriesError?q`
        <div class="error">
          ${De("editor.common.load_failed",this.hass,{error:this._entriesError})}
        </div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder=${De("editor.common.entry_id_manual_placeholder",this.hass)}
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?q`
        <div class="error">
          ${De("editor.common.no_entries",this.hass)}
          <code>${De("editor.common.no_entries_path",this.hass)}</code>${De("editor.common.no_entries_then",this.hass)}
        </div>
      `:q`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(e=>e.entry_id===this._config.entry_id)?q`<option value=${this._config.entry_id}>
              ${De("editor.common.unknown_entry",this.hass,{entry:this._config.entry_id})}
            </option>`:U}
        ${this._entries.map(e=>q`
            <option value=${e.entry_id} ?selected=${e.entry_id===this._config?.entry_id}>
              ${e.title}
            </option>
          `)}
      </select>
    `:q`<div class="hint">${De("editor.common.loading_entries",this.hass)}</div>`}};fo.styles=a`
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
  `,e([ge({attribute:!1})],fo.prototype,"hass",void 0),e([me()],fo.prototype,"_config",void 0),e([me()],fo.prototype,"_entries",void 0),e([me()],fo.prototype,"_entriesError",void 0),fo=e([he(ve)],fo);const vo=[{key:"compact",labelKey:"editor.compass.toggle_compact_label",descKey:"editor.compass.toggle_compact_desc",defaultOn:!1},{key:"show_legend",labelKey:"editor.compass.toggle_legend_label",descKey:"editor.compass.toggle_legend_desc",defaultOn:!0},{key:"show_stats",labelKey:"editor.compass.toggle_stats_label",descKey:"editor.compass.toggle_stats_desc",defaultOn:!0},{key:"show_moon",labelKey:"editor.compass.toggle_moon_label",descKey:"editor.compass.toggle_moon_desc",defaultOn:!1},{key:"show_cardinals",labelKey:"editor.compass.toggle_cardinals_label",descKey:"editor.compass.toggle_cardinals_desc",defaultOn:!0},{key:"show_blind_spot",labelKey:"editor.compass.toggle_blind_spot_label",descKey:"editor.compass.toggle_blind_spot_desc",defaultOn:!0},{key:"show_sun_path",labelKey:"editor.compass.toggle_sun_path_label",descKey:"editor.compass.toggle_sun_path_desc",defaultOn:!0},{key:"show_sunrise_sunset",labelKey:"editor.compass.toggle_sunrise_sunset_label",descKey:"editor.compass.toggle_sunrise_sunset_desc",defaultOn:!0},{key:"show_cover_fill",labelKey:"editor.compass.toggle_cover_fill_label",descKey:"editor.compass.toggle_cover_fill_desc",defaultOn:!0},{key:"show_window_arrow",labelKey:"editor.compass.toggle_window_arrow_label",descKey:"editor.compass.toggle_window_arrow_desc",defaultOn:!0},{key:"show_elevation_chart",labelKey:"editor.compass.toggle_elevation_chart_label",descKey:"editor.compass.toggle_elevation_chart_desc",defaultOn:!0}];let yo=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ke(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${ye}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let o=0;o<e.length;o++)e[o]&&(t=o);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,o){const i=this._trimColors(t),{cover_colors:s,...n}=e,a=i?{...n,...o,cover_colors:i}:{...n,...o};this._emit(a)}_onCoverColorChange(e,t){const o=this._baseConfig(),i=[...o.cover_colors??[]];for(;i.length<=e;)i.push(null);i[e]=t,this._emitWithColors(o,i)}_onCoverColorReset(e){const t=this._baseConfig(),o=[...t.cover_colors??[]];e<o.length&&(o[e]=null),this._emitWithColors(t,o)}_onEntryToggle(e,t){const o=this._baseConfig(),i=new Set(o.entry_ids);t?i.add(e):i.delete(e);const s=(this._entries??[]).map(e=>e.entry_id).filter(e=>i.has(e)),n=o.cover_colors??[],a=s.map(e=>{const t=o.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(o,a,{entry_ids:s})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),o=Number.isFinite(t)?t:0;this._emit({...this._baseConfig(),north_offset:o})}_onTitleChange(e){const t=e.target.value,o=this._baseConfig();if(t)this._emit({...o,title:t});else{const{title:e,...t}=o;this._emit(t)}}render(){if(!this._config)return U;const e=new Set(this._config.entry_ids);return q`
      <div class="form">
        <div class="section">
          <label class="field-label">${De("editor.compass.instances",this.hass)}</label>
          <div class="hint">${De("editor.compass.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(e)}
        </div>

        <div class="section">
          <label class="field-label">${De("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${De("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?q`
              <div class="section">
                <label class="field-label">${De("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${De("editor.compass.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const o=this._config.cover_colors?.[t]??null,i=o??zt(t),s=this._entries?.find(t=>t.entry_id===e);return q`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${i}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${s?.title??e}</span>
                        <span class="toggle-desc"
                          >${o||De("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!o}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${De("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:U}

        <div class="section">
          <label class="field-label">${De("editor.compass.display",this.hass)}</label>
          ${vo.map(e=>q`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${this._config[e.key]??e.defaultOn}
                  @change=${t=>this._onToggle(e.key,t.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${De(e.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${De(e.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${De("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${De("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${lo(this.hass)}
      </div>
    `}_renderEntryPicker(e){return this._entriesError?q`<div class="error">
        ${De("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?q`
        <div class="error">
          ${De("editor.common.no_entries",this.hass)}
          <code>${De("editor.common.no_entries_path",this.hass)}</code>${De("editor.common.no_entries_then",this.hass)}
        </div>
      `:q`
      <div class="entry-list">
        ${this._entries.map(t=>q`
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
    `:q`<div class="hint">${De("editor.common.loading_entries",this.hass)}</div>`}};yo.styles=a`
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
  `,e([ge({attribute:!1})],yo.prototype,"hass",void 0),e([me()],yo.prototype,"_config",void 0),e([me()],yo.prototype,"_entries",void 0),e([me()],yo.prototype,"_entriesError",void 0),yo=e([he(be)],yo);let bo=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");this._config={...e,entry_ids:[...e.entry_ids]}}getCardSize(){return 4}static async getConfigElement(){return document.createElement(be)}static async getStubConfig(e){let t=[];try{const o=await Ke(e);o[0]&&(t=[o[0].entry_id])}catch{}return{type:`custom:${ye}`,entry_ids:t}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Xe(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Je(this.hass).then(e=>{this._registry=e,this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return U;if(null===this._registry)return q`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?De("tile.registry_failed",this.hass,{error:this._registryError}):De("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=[],t=[];for(const o of this._config.entry_ids){const i=Be(this.hass,{type:this._config.type,entry_id:o},this._registry);i?e.push(i):t.push(o)}if(0===e.length)return q`<ha-card>
        <div class="empty">
          <p><strong>${De("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${De("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const o=this._config;return q`
      <ha-card>
        ${o.title?q`<div class="card-header">${o.title}</div>`:U}
        <acp-sky-compass
          .hass=${this.hass}
          .discovered_list=${e}
          ?compact=${!!o.compact}
          .showLegend=${o.show_legend??!0}
          .showStats=${o.show_stats??!0}
          .showMoon=${o.show_moon??!1}
          .showCardinals=${o.show_cardinals??!0}
          .showBlindSpot=${o.show_blind_spot??!0}
          .showSunPath=${o.show_sun_path??!0}
          .showSunriseSunset=${o.show_sunrise_sunset??!0}
          .showCoverFill=${o.show_cover_fill??!0}
          .showWindowArrow=${o.show_window_arrow??!0}
          .coverColors=${o.cover_colors??[]}
          .northOffsetDeg=${Ye(o.north_offset??0)}
        ></acp-sky-compass>
        ${!1!==o.show_elevation_chart?q`<acp-elevation-chart
              .hass=${this.hass}
              .discoveredList=${e}
              .coverColors=${o.cover_colors??[]}
              ?compact=${!!o.compact}
            ></acp-elevation-chart>`:U}
        ${t.length>0?q`<div class="warn dim">
              ${De("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:U}
      </ha-card>
    `}};bo.styles=a`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
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
  `,e([ge({attribute:!1})],bo.prototype,"hass",void 0),e([me()],bo.prototype,"_config",void 0),e([me()],bo.prototype,"_registry",void 0),e([me()],bo.prototype,"_registryError",void 0),bo=e([he(ye)],bo),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ye)||window.customCards.push({type:ye,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const wo=["sky","elevation","decision","covers","overrides","climate"];let xo=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let e=null,t=null;return(o,i,s)=>{const n=i.entry_id??"";return null!==e&&e.registry===s&&e.hass===o&&e.entryId===n||(e={registry:s,hass:o,entryId:n},t=Be(o,i,s)),t}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(e){if(!e?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...e},null===this._registry){const t=tt.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(ve)}static async getStubConfig(e){let t="";try{const o=await Ke(e);t=o[0]?.entry_id??""}catch{}return{type:`custom:${fe}`,entry_id:t}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(e){null!==this._registry&&this._config&&this.hass&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Xe(this.hass,e=>{const t=new Set(it(this._registry??[],this._config?.entry_id??"").map(e=>e.entity_id));(function(e,t){return"create"===e.action||t.has(e.entity_id)})(e,t)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Je(this.hass).then(e=>{const t=this._config?.entry_id;if(t){const o=it(e,t);(null===this._registry||function(e,t){if(e.length!==t.length)return!0;const o=new Map(e.map(e=>[e.entity_id,ot(e)]));for(const e of t)if(o.get(e.entity_id)!==ot(e))return!0;return!1}(it(this._registry,t),o))&&(this._registry=e,tt.set(t,o))}else this._registry=e;this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const e=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=e);const t=e-this._debounceFirstAt,o=this._DEBOUNCE_MAX-t,i=Math.min(this._DEBOUNCE_DELAY,o);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),i<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},i)}get _sections(){return this._config?.show_sections??wo}_renderHeader(e,t){const o=Ee[e.cover_type]??"mdi:window-shutter",i=e.entities.integration_enabled_switch,s=e.entities.automatic_control_switch,n=!i||"on"===this.hass.states[i]?.state,a=!s||"on"===this.hass.states[s]?.state;return q`
      <div class="header">
        <ha-icon .icon=${o}></ha-icon>
        <span class="title">${e.entry_title}</span>
        <span class="spacer"></span>
        ${i?q`<acp-header-pill
              .on=${n}
              .readonly=${!t.integration_enabled}
              .label=${De(n?"header.on":"header.off",this.hass)}
              title=${De("header.integration_enabled",this.hass)}
              @pill-click=${()=>this._toggle(i)}
            ></acp-header-pill>`:U}
        ${s?q`<acp-header-pill
              .on=${a}
              .readonly=${!t.automatic_control}
              .label=${De("header.auto",this.hass)}
              title=${De("header.automatic_control",this.hass)}
              @pill-click=${()=>this._toggle(s)}
            ></acp-header-pill>`:U}
      </div>
    `}_toggle(e){const t=e.split(".")[0];this.hass.callService(t,"toggle",{entity_id:e})}_renderLoading(){return q`
      <ha-card>
        <div class="empty">
          <p class="dim">${De("root.loading_registry",this.hass)}</p>
        </div>
      </ha-card>
    `}_renderEmpty(e){const t=this._config.entry_id,o=this._registry?.length??0,i=this._registry?.filter(e=>e.config_entry_id===t&&"adaptive_cover_pro"===e.platform).length;return q`
      <ha-card>
        <div class="empty">
          <p><strong>${De("root.no_entities_title",this.hass)}</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${t}</code></p>
          <ul class="diag">
            <li>Reason: <code>${e}</code></li>
            <li>Registry entries loaded: <code>${o}</code></li>
            <li>ACP entities matching entry_id: <code>${i??"—"}</code></li>
            ${this._registryError?q`<li>Registry fetch error: <code>${this._registryError}</code></li>`:U}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return U;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const e=this._discovered;if(!e)return this._renderEmpty("no matching entities after unique_id lookup");const t=(o=this._config,{...Pe,...o?.controls});var o;const i=this._sections;return q`
      <ha-card>
        ${this._renderHeader(e,t)}
        <div class="body ${this._config.compact?"compact":""}">
          ${i.includes("sky")?q`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${[e]}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .coverColors=${this._config.cover_colors??[]}
                .northOffsetDeg=${Ye(this._config.north_offset??0)}
              ></acp-sky-compass>`:U}
          ${i.includes("elevation")?q`<acp-elevation-chart
                .hass=${this.hass}
                .discoveredList=${[e]}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:U}
          ${i.includes("decision")?q`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                ?show-summary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:U}
          ${i.includes("covers")?q`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .coverColor=${this._config.cover_colors?.[0]??null}
              ></acp-cover-bar>`:U}
          ${i.includes("overrides")?q`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .resetEnabled=${t.reset_manual_override}
              ></acp-overrides-panel>`:U}
          ${i.includes("climate")?q`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:U}
        </div>
      </ha-card>
    `}};xo.styles=a`
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
  `,e([ge({attribute:!1})],xo.prototype,"hass",void 0),e([me()],xo.prototype,"_config",void 0),e([me()],xo.prototype,"_registry",void 0),e([me()],xo.prototype,"_registryError",void 0),e([me()],xo.prototype,"_discovered",void 0),xo=e([he(fe)],xo),window.customCards=window.customCards||[],window.customCards.push({type:fe,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${_e} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{xo as AdaptiveCoverProCard};
