/*! adaptive-cover-pro-card v2.1.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function e(e,t,o,s){var i,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,o):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,s);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(n<3?i(r):n>3?i(t,o,r):i(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,o=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&i.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,o,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[s+1],e[0]);return new n(o,e,s)},a=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",v=_.reactiveElementPolyfillSupport,f=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},b=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(e,o,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,o){const{get:s,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const n=s?.call(this);i?.call(this,t),this.requestUpdate(e,n,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(o)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const o of s){const s=document.createElement("style"),i=t.litNonce;void 0!==i&&s.setAttribute("nonce",i),s.textContent=o.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,o);if(void 0!==s&&!0===o.reflect){const i=(void 0!==o.converter?.toAttribute?o.converter:y).toAttribute(t,o.type);this._$Em=e,null==i?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,t){const o=this.constructor,s=o._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=o.getPropertyOptions(s),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=s;const n=i.fromAttribute(t,e.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(e,t,o,s=!1,i){if(void 0!==e){const n=this.constructor;if(!1===s&&(i=this[e]),o??=n.getPropertyOptions(e),!((o.hasChanged??b)(i,t)||o.useDefault&&o.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:s,wrapped:i},n){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==i||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,o,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,v?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=e=>e,C=x.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,P=`<${z}>`,O=document,M=()=>O.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,I=Array.isArray,F="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,L=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,U=/"/g,H=/^(?:script|style|textarea|title)$/i,q=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),W=q(1),B=q(2),V=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),G=new WeakMap,Z=O.createTreeWalker(O,129);function Y(e,t){if(!I(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const X=(e,t)=>{const o=e.length-1,s=[];let i,n=2===t?"<svg>":3===t?"<math>":"",r=N;for(let t=0;t<o;t++){const o=e[t];let a,l,c=-1,d=0;for(;d<o.length&&(r.lastIndex=d,l=r.exec(o),null!==l);)d=r.lastIndex,r===N?"!--"===l[1]?r=R:void 0!==l[1]?r=D:void 0!==l[2]?(H.test(l[2])&&(i=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=i??N,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?L:'"'===l[3]?U:j):r===U||r===j?r=L:r===R||r===D?r=N:(r=L,i=void 0);const h=r===L&&e[t+1].startsWith("/>")?" ":"";n+=r===N?o+P:c>=0?(s.push(a),o.slice(0,c)+A+o.slice(c)+E+h):o+E+(-2===c?t:h)}return[Y(e,n+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class J{constructor({strings:e,_$litType$:t},o){let s;this.parts=[];let i=0,n=0;const r=e.length-1,a=this.parts,[l,c]=X(e,t);if(this.el=J.createElement(l,o),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(A)){const t=c[n++],o=s.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:i,name:r[2],strings:o,ctor:"."===r[1]?se:"?"===r[1]?ie:"@"===r[1]?ne:oe}),s.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:i}),s.removeAttribute(e));if(H.test(s.tagName)){const e=s.textContent.split(E),t=e.length-1;if(t>0){s.textContent=C?C.emptyScript:"";for(let o=0;o<t;o++)s.append(e[o],M()),Z.nextNode(),a.push({type:2,index:++i});s.append(e[t],M())}}}else if(8===s.nodeType)if(s.data===z)a.push({type:2,index:i});else{let e=-1;for(;-1!==(e=s.data.indexOf(E,e+1));)a.push({type:7,index:i}),e+=E.length-1}i++}}static createElement(e,t){const o=O.createElement("template");return o.innerHTML=e,o}}function Q(e,t,o=e,s){if(t===V)return t;let i=void 0!==s?o._$Co?.[s]:o._$Cl;const n=T(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),void 0===n?i=void 0:(i=new n(e),i._$AT(e,o,s)),void 0!==s?(o._$Co??=[])[s]=i:o._$Cl=i),void 0!==i&&(t=Q(e,i._$AS(e,t.values),i,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,s=(e?.creationScope??O).importNode(t,!0);Z.currentNode=s;let i=Z.nextNode(),n=0,r=0,a=o[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new te(i,i.nextSibling,this,e):1===a.type?t=new a.ctor(i,a.name,a.strings,this,e):6===a.type&&(t=new re(i,this,e)),this._$AV.push(t),a=o[++r]}n!==a?.index&&(i=Z.nextNode(),n++)}return Z.currentNode=O,s}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,s){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),T(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>I(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,s="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=J.createElement(Y(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new J(e)),t}k(e){I(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,s=0;for(const i of e)s===t.length?t.push(o=new te(this.O(M()),this.O(M()),this,this.options)):o=t[s],o._$AI(i),s++;s<t.length&&(this._$AR(o&&o._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class oe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,s,i){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=i,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=K}_$AI(e,t=this,o,s){const i=this.strings;let n=!1;if(void 0===i)e=Q(this,e,t,0),n=!T(e)||e!==this._$AH&&e!==V,n&&(this._$AH=e);else{const s=e;let r,a;for(e=i[0],r=0;r<i.length-1;r++)a=Q(this,s[o+r],t,r),a===V&&(a=this._$AH[r]),n||=!T(a)||a!==this._$AH[r],a===K?e=K:e!==K&&(e+=(a??"")+i[r+1]),this._$AH[r]=a}n&&!s&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends oe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class ie extends oe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class ne extends oe{constructor(e,t,o,s,i){super(e,t,o,s,i),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??K)===V)return;const o=this._$AH,s=e===K&&o!==K||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==K&&(o===K||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const ae=x.litHtmlPolyfillSupport;ae?.(J,te),(x.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const s=o?.renderBefore??t;let i=s._$litPart$;if(void 0===i){const e=o?.renderBefore??null;s._$litPart$=i=new te(t.insertBefore(M(),e),e,void 0,o??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ue=(e=pe,t,o)=>{const{kind:s,metadata:i}=o;let n=globalThis.litPropertyMetadata.get(i);if(void 0===n&&globalThis.litPropertyMetadata.set(i,n=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),n.set(o.name,e),"accessor"===s){const{name:s}=o;return{set(o){const i=t.get.call(this);t.set.call(this,o),this.requestUpdate(s,i,e,!0,o)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=o;return function(o){const i=this[s];t.call(this,o),this.requestUpdate(s,i,e,!0,o)}}throw Error("Unsupported decorator location: "+s)};function _e(e){return(t,o)=>"object"==typeof o?ue(e,t,o):((e,t,o)=>{const s=t.hasOwnProperty(o);return t.constructor.createProperty(o,e),s?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}function ge(e){return _e({...e,state:!0,attribute:!1})}const me="2.1.0",ve="adaptive-cover-pro-card",fe="adaptive-cover-pro-card-editor",ye="adaptive-cover-pro-sky-compass-card",be="adaptive-cover-pro-sky-compass-card-editor",$e="adaptive-cover-pro-tile-card",we="adaptive-cover-pro-tile-card-editor",xe="adaptive_cover_pro",ke=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default","floor_clamp"],Ce={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},Se={force:"handler.force",weather:"handler.weather",manual:"handler.manual",custom_position:"handler.custom_position",motion:"handler.motion",cloud:"handler.cloud",climate:"handler.climate",glare_zone:"handler.glare_zone",solar:"handler.solar",default:"handler.default",floor_clamp:"handler.floor_clamp"},Ae={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},Ee={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open"},ze={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds"},Pe={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion"},Oe={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Solar tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Motion",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"}},Me={auto:"badge.auto",manual:"badge.manual",force:"badge.force",weather:"badge.weather",glare_zone:"badge.glare_zone",climate:"badge.climate",cloud:"badge.cloud",custom_position:"badge.custom_position",solar:"badge.solar",motion:"badge.motion",off:"badge.off"},Te={auto:"mdi:autorenew",manual:"mdi:hand-back-right",force:"mdi:flash",weather:"mdi:shield-sun",glare_zone:"mdi:weather-sunny-alert",climate:"mdi:thermostat",cloud:"mdi:weather-cloudy",custom_position:"mdi:bookmark",solar:"mdi:white-balance-sunny",motion:"mdi:motion-sensor",off:"mdi:power"},Ie={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Fe={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"},Ne={en:{handler:{force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Weather safety",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Solar tracking",motion:"Motion idle",off:"Off",floor_suffix:" ↥"},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window field of view",fov_exit:"Sun leaves window field of view"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks."},dialog:{configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"↥",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Motion",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Motion",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"expires in {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance"},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in FOV",in_fov:"in FOV",none:"—",sun:"Sun",moon:"Moon",sun_hitting:"Sun (hitting window)",sun_up_not_hitting:"Sun (up, not hitting)",sun_below_horizon:"Sun (below horizon)",window_fov:"Window FOV",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_closed:"Cover closed",window_normal:"Window normal",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"FOV {left} left / {right} right{elev}",window_normal_tooltip:"Window normal: {bearing}",cover_extended:"Cover extended: {pct}%",cover_closed_tooltip:"Cover closed: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",click_to_set:"Click to set position",target_tooltip:"Target {pct}%"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor"},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Motion timeout pending",motion_detected:"Motion detected",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found."},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"FOV: {from} → {to}",fov_windows:"FOV: {windows}",no_fov_today:"Sun does not enter FOV today",placeholder:"Sun elevation chart unavailable."},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window FOV, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with FOV band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, motion tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Solar tracking",badge_force:"Force override",badge_weather:"Weather safety",badge_manual:"Manual override",badge_custom_position:"Custom position",badge_motion:"Motion",badge_climate:"Climate",badge_glare_zone:"Glare zone",badge_cloud:"Cloud suppression",show_compass:"Show sun compass in dialog",show_motion_icon:"Show motion indicator",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth."}}},fr:{handler:{force:"Dérogation forcée",weather:"Sécurité météo",manual:"Dérogation manuelle",custom_position:"Position personnalisée",motion:"Délai d'inactivité du mouvement",cloud:"Désactivation par temps nuageux",climate:"Climatique",glare_zone:"Zone d'éblouissement",solar:"Suivi solaire",default:"Par défaut",floor_clamp:"Plancher"},badge:{auto:"Auto",manual:"Manuel",force:"Forcé",weather:"Sécurité météo",glare_zone:"Éblouissement",climate:"Climatique",cloud:"Nuageux",custom_position:"Personnalisé",solar:"Suivi solaire",motion:"Inactivité",off:"Off",floor_suffix:" ↥"},forecast:{event:{sunrise:"Lever du soleil",sunset:"Coucher du soleil",fov_enter:"Le soleil entre dans le champ de vision de la fenêtre",fov_exit:"Le soleil quitte le champ de vision de la fenêtre"},hover_hint:"Survolez la courbe pour voir l'heure et la position prévue ; survolez une ligne colorée pour voir l'événement qu'elle indique."},dialog:{configure_integration:"Configurer l'intégration",open_device_page:"Ouvrir la page de l'appareil",close:"Fermer",target:"Cible",resume_auto:"Reprendre l'automatique",hide_advanced:"▼ Masquer les options avancées",show_advanced:"▶ Afficher les options avancées",custom_positions:"Positions personnalisées",floor_tooltip:"Plancher — cette valeur force une position minimale au-dessus du calcul automatique",floor:"↥",disable_slot:"Désactiver le créneau {slot}",enable_slot:"Activer le créneau {slot}",on:"Activé",off:"Désactivé",controls:"Commandes",automatic:"Automatique",climate:"Climatique",motion:"Mouvement",toggle_hint:"{label} {state} — appuyez pour basculer",state_on:"activé",state_off:"désactivé",todays_forecast:"Prévisions du jour"},overrides:{title:"Dérogations",manual:"Manuel",force:"Forcé",motion:"Mouvement",active:"Actif",off:"Désactivé",ends_in:"se termine dans {time}",active_count:"{count} dérogation(s) active(s)",timeout:"expire dans {time}",reset_manual:"Réinitialiser le mode manuel"},climate:{title:"Climatique",active:"Actif : {strategy}",indoor:"Intérieur",outdoor:"Extérieur",presence:"Présence",sunny:"Ensoleillé",lux:"Lux",irradiance:"Irradiance"},compass:{placeholder_no_entries:"Aucune instance Adaptive Cover Pro sélectionnée.",placeholder_no_sun:"Le capteur solaire n'est pas encore renseigné.",sun_tooltip:"Soleil : {az} az / {el} él",sunrise_tooltip:"Lever du soleil : {time}",sunset_tooltip:"Coucher du soleil : {time}",moon_tooltip:"Lune : {phase} ({pct}%)",sun_path_tooltip:"Trajectoire solaire (aujourd'hui)",in_fov_check:"✓ dans le champ de vision",in_fov:"dans le champ de vision",none:"—",sun:"Soleil",moon:"Lune",sun_hitting:"Soleil (frappe la fenêtre)",sun_up_not_hitting:"Soleil (levé, ne frappe pas)",sun_below_horizon:"Soleil (sous l’horizon)",window_fov:"Champ de vision",sun_path:"Trajectoire solaire",sunrise:"Lever du soleil",sunset:"Coucher du soleil",cover_closed:"Store fermé",window_normal:"Axe de la fenêtre",stat_sun:"Soleil : ",stat_azi:"Azi : ",stat_elev:"Élév : ",stat_window:"Fenêtre : ",active_sun_arc:"Arc solaire actif {from} – {to}{elev}",fov_arc:"Champ de vision {left} gauche / {right} droite{elev}",window_normal_tooltip:"Axe de la fenêtre : {bearing}",cover_extended:"Store déployé : {pct}%",cover_closed_tooltip:"Store fermé : {pct}%",blind_spot:"Soleil masqué : {from} - {to}",elev_suffix:" · élév {min}–{max}"},covers:{placeholder:"Aucun store signalé par l'intégration.",title:"Stores",target:"Cible : {pct}",click_to_set:"Cliquer pour définir la position",target_tooltip:"Cible {pct}%"},decision:{placeholder:"La trace de décision n'est pas encore renseignée.",pipeline:"Pipeline",winner:"Actif : {name}",summary_tooltip:"Pourquoi cette position ?",not_evaluated:"non évalué",floor_suffix:" plancher"},header:{on:"ON",off:"OFF",integration_enabled:"Intégration activée",auto:"Auto",automatic_control:"Contrôle automatique"},tile:{motion_pending:"Délai de mouvement en cours",motion_detected:"Mouvement détecté",open:"Ouvrir",stop:"Arrêter",close:"Fermer",resume_aria:"Reprendre le contrôle automatique",registry_failed:"Échec de la récupération du registre : {error}",loading:"Chargement…",entry_not_found:"Instance Adaptive Cover Pro {entry} introuvable."},formatters:{expired:"expiré"},elevation:{title:"Soleil aujourd'hui",fov_window:"Champ de vision : {from} → {to}",fov_windows:"Champ de vision : {windows}",no_fov_today:"Pas de soleil dans le champ de vision aujourd'hui",placeholder:"Graphique d'élévation solaire indisponible."},root:{loading_registry:"Chargement du registre Adaptive Cover Pro…",no_entities_title:"Aucune entité Adaptive Cover Pro trouvée",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Aucune entité Adaptive Cover Pro correspondante",compass_configured:"Instances configurées : {entries}",compass_not_found:"Instances introuvables : {entries}"},editor:{common:{entry_id:"Instance Adaptive Cover Pro",title_optional:"Titre (facultatif)",title_placeholder:"ex. Fenêtres côté ouest",north_offset:"Décalage nord de la boussole (°)",north_offset_hint:"Faites pivoter la boussole dans le sens horaire pour que « haut » corresponde à votre carte. Par défaut : 0.",loading_entries:"Chargement des entrées de configuration Adaptive Cover Pro…",load_failed:"Échec du chargement des entrées de configuration : {error}",no_entries:"Aucune entrée de configuration Adaptive Cover Pro trouvée. Ajoutez une instance sous",no_entries_path:"Paramètres → Appareils et services",no_entries_then:", puis revenez ici.",entry_id_manual_placeholder:"Saisir manuellement l'ID d'entrée de configuration",entry_id_fallback_label:"ID d'entrée",unknown_entry:"(inconnu : {entry})",reset:"Réinitialiser"},main:{sections:"Sections",sections_hint:"Activer ou désactiver les parties de la carte affichées.",section_sky_label:"Boussole céleste",section_sky_desc:"Soleil par rapport au champ de vision de la fenêtre, tracé polaire",section_elevation_label:"Soleil aujourd'hui",section_elevation_desc:"Graphique élévation/temps avec bande FOV et curseur temps réel",section_decision_label:"Bande de décision",section_decision_desc:"Les 10 gestionnaires du pipeline avec la ligne gagnante mise en évidence",section_covers_label:"Positions des stores",section_covers_desc:"Barres position réelle/cible par store ; cliquer pour définir la position",section_overrides_label:"Panneau des dérogations",section_overrides_desc:"Tuiles Manuel, Forcé, Mouvement + bouton de réinitialisation",section_climate_label:"Panneau climatique",section_climate_desc:"Stratégie été/hiver/intermédiaire (masqué automatiquement si le mode climatique est désactivé)",controls:"Commandes",controls_hint:"Afficher en lecture seule (visible mais non cliquable).",integration_pill_label:"Bouton ON/OFF de l'intégration",integration_pill_desc:"Permettre de basculer l'intégration depuis l'en-tête de la carte.",automatic_pill_label:"Bouton contrôle automatique",automatic_pill_desc:"Permettre de basculer le contrôle automatique depuis l'en-tête de la carte.",reset_button_label:"Bouton de réinitialisation de la dérogation manuelle",reset_button_desc:"Permettre d'appuyer sur la tuile de réinitialisation dans le panneau des dérogations.",display:"Affichage",compact_label:"Mode compact",compact_desc:"Espacement réduit entre les sections.",show_compass_stats_label:"Afficher les statistiques de la boussole",show_compass_stats_desc:"Azi, Élév, ∠ et angle de fenêtre sous la boussole céleste.",show_compass_legend_label:"Afficher la légende de la boussole",show_compass_legend_desc:"Clé de couleur sous la boussole céleste.",show_moon_label:"Afficher la lune sur la boussole",show_moon_desc:"Position et phase de la lune en superposition sur la boussole céleste.",hide_inactive_label:"Masquer les gestionnaires inactifs",hide_inactive_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs."},tile:{name:"Titre personnalisé",icon:"Icône personnalisée",cover:"Entité de store",layout:"Disposition",show_position:"Afficher la position %",show_state:"Afficher l'état (Ouvert/Fermé)",show_decision_summary:"Afficher le résumé de décision",show_controls:"Afficher les commandes ↑■▼",show_badge:"Afficher le badge contextuel",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Suivi solaire",badge_force:"Dérogation forcée",badge_weather:"Sécurité météo",badge_manual:"Dérogation manuelle",badge_custom_position:"Position personnalisée",badge_motion:"Mouvement",badge_climate:"Climatique",badge_glare_zone:"Zone d'éblouissement",badge_cloud:"Suppression nuageuse",show_compass:"Afficher la boussole solaire dans le dialogue",show_motion_icon:"Afficher l'indicateur de mouvement",tap_action:"Action au toucher",hold_action:"Action au maintien",double_tap_action:"Action au double toucher",cover_blank_hint:"Laisser vide pour utiliser automatiquement le premier store géré.",layout_option_one_line:"Une ligne (compact)",layout_option_detailed:"Détaillé (titre, état, indicateurs)"},compass:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition à la boussole.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"SVG plus petit, légende masquée.",toggle_legend_label:"Légende",toggle_legend_desc:"Échantillons de couleur et étiquettes d'instance sous la boussole.",toggle_stats_label:"Statistiques",toggle_stats_desc:"Soleil + lignes numériques par fenêtre.",toggle_moon_label:"Lune",toggle_moon_desc:"Afficher la position et la phase de la lune.",toggle_cardinals_label:"Points cardinaux",toggle_cardinals_desc:"Lettres N/E/S/O autour de la boussole.",toggle_blind_spot_label:"Zones de soleil masqué",toggle_blind_spot_desc:"Secteurs hachurés pour la plage où le soleil est masqué de chaque fenêtre.",toggle_sun_path_label:"Trajectoire solaire",toggle_sun_path_desc:"Arc solaire du jour dans le ciel.",toggle_sunrise_sunset_label:"Repères lever / coucher du soleil",toggle_sunrise_sunset_desc:"Petits points aux azimuts de lever et coucher du soleil.",toggle_cover_fill_label:"Remplissage de fermeture du store",toggle_cover_fill_desc:"Secteur intérieur indiquant le taux de fermeture de chaque store.",toggle_window_arrow_label:"Flèche de normale de fenêtre",toggle_window_arrow_desc:"Ligne du centre vers l'azimut de chaque fenêtre."}}}};function Re(e,t){const o=t.split(".");let s=e;for(const e of o){if("object"!=typeof s||null===s)return;s=s[e]}return"string"==typeof s?s:void 0}function De(e,t){return t?e.replace(/\{(\w+)\}/g,(e,o)=>Object.prototype.hasOwnProperty.call(t,o)?String(t[o]):e):e}function Le(e,t,o){const s=function(e){const t=(e?.locale?.language??e?.language??"en").toLowerCase().split("-")[0];return t in Ne?t:"en"}(t),i=Re(Ne[s],e);if(void 0!==i)return De(i,o);if("en"!==s){const t=Re(Ne.en,e);if(void 0!==t)return De(t,o)}return e}function je(e,t,o){const s=t.entry_id;if(!s)return null;const i={},n=`${s}_`;let r,a=!1;for(const e of o){if(e.config_entry_id!==s)continue;if(e.platform!==xe)continue;if(a=!0,!r&&e.device_id&&(r=e.device_id),!e.unique_id.startsWith(n))continue;const t=e.unique_id.slice(n.length),o=e.entity_id.split(".")[0],l=Fe[`${o}:${t}`];l&&(i[l]=e.entity_id)}if(!a||0===Object.keys(i).length)return null;const l=e;let c=s;if(l.devices)for(const e of Object.values(l.devices))if(e.config_entries?.includes(s)){c=e.name_by_user??e.name??s;break}const d=[],h=i.target_position_sensor;if(h){const t=e.states[h]?.attributes?.actual_positions;t&&d.push(...Object.keys(t))}let p="cover_blind";const u=i.control_status_sensor;if(u){const t=e.states[u]?.attributes;t?.cover_type&&(p=t.cover_type)}return{entry_id:s,entry_title:c,cover_type:p,entities:i,managed_covers:d,device_id:r}}function Ue(e,t,o=0){const s=(e-90+o)*Math.PI/180;return{x:t*Math.cos(s),y:t*Math.sin(s)}}function He(e){return 1-Math.max(0,Math.min(90,e))/90}function qe(e,t,o,s=0,i=0){const n=e=>(e%360+360)%360,r=n(e),a=n(t);let l=a-r;l<0&&(l+=360);const c=l>180?1:0,d=Ue(r,o,i),h=Ue(a,o,i);if(s<=0)return`M 0 0 L ${d.x} ${d.y} A ${o} ${o} 0 ${c} 1 ${h.x} ${h.y} Z`;const p=Ue(a,s,i),u=Ue(r,s,i);return[`M ${d.x} ${d.y}`,`A ${o} ${o} 0 ${c} 1 ${h.x} ${h.y}`,`L ${p.x} ${p.y}`,`A ${s} ${s} 0 ${c} 0 ${u.x} ${u.y}`,"Z"].join(" ")}function We(e,t,o=0){return Ue(e,He(t),o)}function Be(e){return(e%360+360)%360}function Ve(e,t,o,s){const i=s??0;let n=-1,r=-1;for(let s=t;s<=o&&s<e.length;s++)e[s].elevation>i&&(-1===n&&(n=s),r=s);return-1===n?null:{wedgeStart:e[n].azimuth,wedgeEnd:e[r].azimuth}}function Ke(e,t,o){return((e-t)%360+360)%360<=((o-t)%360+360)%360}function Ge(e,t,o,s){return Ke(o,e,t)||Ke(s,e,t)||Ke(e,o,s)||Ke(t,o,s)}async function Ze(e){return e.callWS({type:"config/entity_registry/list"})}function Ye(e,t){let o=null,s=!1;return e.connection.subscribeEvents(e=>t(e.data),"entity_registry_updated").then(e=>{s?e():o=e}).catch(()=>{}),()=>{s=!0,o&&o()}}function Xe(e){return`acp-card:registry:v1:${e}`}const Je={get(e){try{const t=localStorage.getItem(Xe(e));if(!t)return null;const o=JSON.parse(t);return 1!==o.schemaVersion?null:o}catch{return null}},set(e,t){try{const o={schemaVersion:1,cardVersion:me,fetchedAt:Date.now(),entries:t};localStorage.setItem(Xe(e),JSON.stringify(o))}catch{}},invalidate(e){try{localStorage.removeItem(Xe(e))}catch{}},clear(){try{const e="acp-card:registry:v1:",t=[];for(let o=0;o<localStorage.length;o++){const s=localStorage.key(o);s?.startsWith(e)&&t.push(s)}t.forEach(e=>localStorage.removeItem(e))}catch{}}};function Qe(e){return`${e.entity_id}|${e.unique_id}|${e.platform}|${e.config_entry_id??""}`}function et(e,t,o){return e.filter(e=>e.config_entry_id===t&&void 0===o)}let tt=class extends ce{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return W`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":K}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};tt.styles=r`
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
  `,e([_e({type:Boolean})],tt.prototype,"on",void 0),e([_e({type:Boolean})],tt.prototype,"readonly",void 0),e([_e({type:String})],tt.prototype,"label",void 0),e([_e({type:String})],tt.prototype,"title",void 0),tt=e([he("acp-header-pill")],tt);class ot{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const st=(it=class extends ot{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const o=e.element.classList;for(const e of this.st)e in t||(o.remove(e),this.st.delete(e));for(const e in t){const s=!!t[e];s===this.st.has(e)||this.nt?.has(e)||(s?(o.add(e),this.st.add(e)):(o.remove(e),this.st.delete(e)))}return V}},(...e)=>({_$litDirective$:it,values:e}));var it;function nt(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var rt,at,lt={exports:{}},ct=(rt||(rt=1,at=lt,function(){var e=Math.PI,t=Math.sin,o=Math.cos,s=Math.tan,i=Math.asin,n=Math.atan2,r=Math.acos,a=e/180,l=864e5,c=2440588,d=2451545;function h(e){return new Date((e+.5-c)*l)}function p(e){return function(e){return e.valueOf()/l-.5+c}(e)-d}var u=23.4397*a;function _(e,i){return n(t(e)*o(u)-s(i)*t(u),o(e))}function g(e,s){return i(t(s)*o(u)+o(s)*t(u)*t(e))}function m(e,i,r){return n(t(e),o(e)*t(i)-s(r)*o(i))}function v(e,s,n){return i(t(s)*t(n)+o(s)*o(n)*o(e))}function f(e,t){return a*(280.16+360.9856235*e)-t}function y(e){return a*(357.5291+.98560028*e)}function b(o){return o+a*(1.9148*t(o)+.02*t(2*o)+3e-4*t(3*o))+102.9372*a+e}function $(e){var t=b(y(e));return{dec:g(t,0),ra:_(t,0)}}var w={getPosition:function(e,t,o){var s=a*-o,i=a*t,n=p(e),r=$(n),l=f(n,s)-r.ra;return{azimuth:m(l,i,r.dec),altitude:v(l,i,r.dec)}}},x=w.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];w.addTime=function(e,t,o){x.push([e,t,o])};var k=9e-4;function C(t,o,s){return k+(t+o)/(2*e)+s}function S(e,o,s){return d+e+.0053*t(o)-.0069*t(2*s)}function A(e,s,i,n,a,l,c){var d=function(e,s,i){return r((t(e)-t(s)*t(i))/(o(s)*o(i)))}(e,i,n);return S(C(d,s,a),l,c)}function E(e){var s=a*(134.963+13.064993*e),i=a*(93.272+13.22935*e),n=a*(218.316+13.176396*e)+6.289*a*t(s),r=5.128*a*t(i),l=385001-20905*o(s);return{ra:_(n,r),dec:g(n,r),dist:l}}function z(e,t){return new Date(e.valueOf()+t*l/24)}w.getTimes=function(t,o,s,i){var n,r,l,c,d,u=a*-s,_=a*o,m=function(e){return-2.076*Math.sqrt(e)/60}(i=i||0),v=function(t,o){return Math.round(t-k-o/(2*e))}(p(t),u),f=C(0,u,v),$=y(f),w=b($),E=g(w,0),z=S(f,$,w),P={solarNoon:h(z),nadir:h(z-.5)};for(n=0,r=x.length;n<r;n+=1)d=z-((c=A(((l=x[n])[0]+m)*a,u,_,E,v,$,w))-z),P[l[1]]=h(d),P[l[2]]=h(c);return P},w.getMoonPosition=function(e,i,r){var l=a*-r,c=a*i,d=p(e),h=E(d),u=f(d,l)-h.ra,_=v(u,c,h.dec),g=n(t(u),s(c)*o(h.dec)-t(h.dec)*o(u));return _+=function(e){return e<0&&(e=0),2967e-7/Math.tan(e+.00312536/(e+.08901179))}(_),{azimuth:m(u,c,h.dec),altitude:_,distance:h.dist,parallacticAngle:g}},w.getMoonIllumination=function(e){var s=p(e||new Date),i=$(s),a=E(s),l=149598e3,c=r(t(i.dec)*t(a.dec)+o(i.dec)*o(a.dec)*o(i.ra-a.ra)),d=n(l*t(c),a.dist-l*o(c)),h=n(o(i.dec)*t(i.ra-a.ra),t(i.dec)*o(a.dec)-o(i.dec)*t(a.dec)*o(i.ra-a.ra));return{fraction:(1+o(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},w.getMoonTimes=function(e,t,o,s){var i=new Date(e);s?i.setUTCHours(0,0,0,0):i.setHours(0,0,0,0);for(var n,r,l,c,d,h,p,u,_,g,m,v,f,y=.133*a,b=w.getMoonPosition(i,t,o).altitude-y,$=1;$<=24&&(n=w.getMoonPosition(z(i,$),t,o).altitude-y,u=((d=(b+(r=w.getMoonPosition(z(i,$+1),t,o).altitude-y))/2-n)*(p=-(h=(r-b)/2)/(2*d))+h)*p+n,g=0,(_=h*h-4*d*n)>=0&&(m=p-(f=Math.sqrt(_)/(2*Math.abs(d))),v=p+f,Math.abs(m)<=1&&g++,Math.abs(v)<=1&&g++,m<-1&&(m=v)),1===g?b<0?l=$+m:c=$+m:2===g&&(l=$+(u<0?v:m),c=$+(u<0?m:v)),!l||!c);$+=2)b=r;var x={};return l&&(x.rise=z(i,l)),c&&(x.set=z(i,c)),l||c||(x[u>0?"alwaysUp":"alwaysDown"]=!0),x},at.exports=w}()),lt.exports),dt=nt(ct);function ht(e,t,o,s=10){const i=[],n=o.getTime()+864e5;for(let r=o.getTime();r<=n;r+=60*s*1e3){const o=new Date(r),s=dt.getPosition(o,e,t);i.push({t:o,elevation:180*s.altitude/Math.PI,azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360})}return i}function pt(e,t=new Date){if(!e)return function(e=new Date){const t=new Date(e);return t.setHours(0,0,0,0),t}(t);const o=new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(t),[s,i,n]=o.split("-").map(Number),r=Date.UTC(s,i-1,n,0,0,0),a=function(e,t){const o=new Intl.DateTimeFormat("en-US",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(t),s={};for(const e of o)"literal"!==e.type&&(s[e.type]=Number(e.value));return Date.UTC(s.year,s.month-1,s.day,s.hour,s.minute,s.second)-t.getTime()}(e,new Date(r));return new Date(r-a)}function ut(e,t,o,s){const i=((t-o)%360+360)%360;return((e-i)%360+360)%360<=((((t+s)%360+360)%360-i)%360+360)%360}function _t(e,t,o,s){const i=[];let n=-1;for(let r=0;r<e.length;r++){const a=e[r];a.elevation>0&&ut(a.azimuth,t,o,s)?-1===n&&(n=r):-1!==n&&(i.push({startIdx:n,endIdx:r-1}),n=-1)}return-1!==n&&i.push({startIdx:n,endIdx:e.length-1}),i}function gt(e,t,o=new Date){const s=dt.getMoonPosition(o,e,t),i=dt.getMoonIllumination(o);return{azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360,elevation:180*s.altitude/Math.PI,phase:i.phase,fraction:i.fraction,phaseName:mt(i.phase)}}function mt(e){return e<.0625||e>=.9375?"New Moon":e<.1875?"Waxing Crescent":e<.3125?"First Quarter":e<.4375?"Waxing Gibbous":e<.5625?"Full Moon":e<.6875?"Waning Gibbous":e<.8125?"Last Quarter":"Waning Crescent"}function vt(e){return null==e||Number.isNaN(e)?"—":`${Math.round(e)}%`}function ft(e){return null==e||Number.isNaN(e)?"—":`${e.toFixed(1)}°`}function yt(e){if(!e)return"—";const t=new Date(e);return Number.isNaN(t.getTime())?"—":t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function bt(e,t){if(!e)return"—";const o=new Date(e).getTime();if(Number.isNaN(o))return"—";const s=Math.round((o-Date.now())/1e3);return s<=0?t?Le("formatters.expired",t):"expired":function(e){if(null==e||Number.isNaN(e))return"—";const t=Math.max(0,Math.round(e));if(t<60)return`${t}s`;const o=Math.floor(t/60);return o<60?`${o}m ${t%60}s`:`${Math.floor(o/60)}h ${o%60}m`}(s)}const $t=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function wt(e){const t=$t.length;return $t[(e%t+t)%t]}const xt=110;let kt=class extends ce{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set}_toggleEntry(e){const t=new Set(this._hiddenEntries);t.has(e)?t.delete(e):t.add(e),this._hiddenEntries=t}_sunFor(e){const t=e.entities.sun_sensor;if(!t)return null;const o=this.hass.states[t];if(!o)return null;const s=parseFloat(o.state);return Number.isNaN(s)?null:{...o.attributes,window_azimuth:o.attributes.window_azimuth}}_coverPositionFor(e){const t=e.entities.target_position_sensor;if(!t)return null;const o=parseFloat(this.hass.states[t]?.state??"");return Number.isNaN(o)?null:o}_sunInfrontFor(e){const t=e.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}_readActiveAzimuth(e){if(!e)return null;const t=this.hass.states[e];if(!t)return null;if("unavailable"===t.state||"unknown"===t.state)return null;const o=t.attributes.azimuth;return"number"==typeof o&&Number.isFinite(o)?o:null}_buildOverlays(){const e=[];return this.discovered_list.forEach((t,o)=>{const s=this._sunFor(t);if(!s)return;const i=t.entities.sun_sensor,n=parseFloat(this.hass.states[i]?.state??"0"),{color:r,isOverride:a}=(l=this.coverColors?.[o],c=o,"string"==typeof l&&l.length>0?{color:l,isOverride:!0}:{color:wt(c),isOverride:!1});var l,c;e.push({d:t,sun:s,sunAzi:n,sunInfront:this._sunInfrontFor(t),coverPos:this._coverPositionFor(t),coverType:t.cover_type,color:r,isOverride:a,index:o})}),e}render(){if(!this.hass)return K;if(!this.discovered_list||0===this.discovered_list.length)return W`<div class="placeholder">${Le("compass.placeholder_no_entries",this.hass)}</div>`;const e=this._buildOverlays();if(0===e.length)return W`<div class="placeholder">${Le("compass.placeholder_no_sun",this.hass)}</div>`;const t=e.filter(e=>!this._hiddenEntries.has(e.d.entry_id)),o=Be(this.northOffsetDeg),s=e.length>1,i=e[0],n=i.sunAzi,r=i.sun.elevation,a=We(n,r,o),l=e.some(e=>e.sunInfront),c=r<=0?"sun":l?"sun valid":"sun up",{latitude:d,longitude:h,time_zone:p}=this.hass.config,u=void 0!==d&&void 0!==h?ht(d,h,pt(p)):[],_=this.showMoon&&void 0!==d&&void 0!==h?gt(d,h):null,g=null!==_&&_.elevation>0,m=_?_.phase<.5?-24*_.phase:24*(1-_.phase):0,v=g?We(_.azimuth,_.elevation,o):null,f=v?v.x*xt:0,y=v?v.y*xt:0,b=this.showSunPath?u.map(e=>{const t=We(e.azimuth,e.elevation,o);return`${(t.x*xt).toFixed(1)},${(t.y*xt).toFixed(1)}`}).join(" "):"",{riseAzimuth:$,setAzimuth:w}=this.showSunriseSunset?function(e){let t=null,o=null;for(let s=1;s<e.length;s++){const i=e[s-1],n=e[s];i.elevation<=0&&n.elevation>0&&null===t&&(t=n.azimuth),i.elevation>0&&n.elevation<=0&&(o=i.azimuth)}return{riseAzimuth:t,setAzimuth:o}}(u):{riseAzimuth:null,setAzimuth:null},x=null!==$?Ue($,xt,o):null,k=null!==w?Ue(w,xt,o):null,C=Ue(0,124,o),S=Ue(90,124,o),A=Ue(180,124,o),E=Ue(270,124,o),z=Ue(0,xt,o),P=Ue(180,xt,o),O=Ue(90,xt,o),M=Ue(270,xt,o),T=Le("compass.sun_tooltip",this.hass,{az:ft(n),el:ft(r)}),I=null!==$?Le("compass.sunrise_tooltip",this.hass,{time:ft($)}):"",F=null!==w?Le("compass.sunset_tooltip",this.hass,{time:ft(w)}):"",N=null!==_?Le("compass.moon_tooltip",this.hass,{phase:_.phaseName,pct:Math.round(100*_.fraction)}):"",R=Le("compass.sun_path_tooltip",this.hass);return W`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${B`
            <defs>
              ${g?B`
                <mask id="moon-phase-mask">
                  <circle cx=${f} cy=${y} r=${6} fill="white"></circle>
                  <circle cx=${f+m} cy=${y} r=${6} fill="black"></circle>
                </mask>
              `:K}
            </defs>

            <circle class="grid" r=${xt}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${xt/3}></circle>
            <line class="grid thin" x1=${z.x} y1=${z.y} x2=${P.x} y2=${P.y}></line>
            <line class="grid thin" x1=${O.x} y1=${O.y} x2=${M.x} y2=${M.y}></line>

            ${t.map(e=>this._renderEntryLayers(e,s,o,u))}

            ${this.showSunPath&&b?B`<g data-tooltip=${R}><title>${R}</title><polyline class="sun-path" points=${b}></polyline></g>`:K}

            ${this.showSunriseSunset&&x&&null!==$?B`<g data-tooltip=${I}><title>${I}</title><circle class="rise-marker" cx=${x.x} cy=${x.y} r="5"></circle></g>`:K}
            ${this.showSunriseSunset&&k&&null!==w?B`<g data-tooltip=${F}><title>${F}</title><circle class="set-marker" cx=${k.x} cy=${k.y} r="5"></circle></g>`:K}

            ${this.showCardinals?B`
              <text class="cardinal" x=${C.x} y=${C.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${S.x} y=${S.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${A.x} y=${A.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:K}

            ${g?B`
              <g data-tooltip=${N}>
                <title>${N}</title>
                <circle class="moon-outline" cx=${f} cy=${y} r=${6}></circle>
                <circle class="moon-lit" cx=${f} cy=${y} r=${6} mask="url(#moon-phase-mask)"></circle>
              </g>
            `:K}

            <g data-tooltip=${T}>
              <title>${T}</title>
              <circle class=${c} cx=${a.x*xt} cy=${a.y*xt} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(e,s):K}
        ${this.showStats?this._renderStats(e,s):K}
      </div>
    `}_renderEntryLayers(e,t,o=0,s=[]){const i=Be(e.sun.window_azimuth),n=Be(i-e.sun.fov_left),r=Be(i+e.sun.fov_right),a=this._readActiveAzimuth(e.d.entities.start_sensor),l=this._readActiveAzimuth(e.d.entities.end_sensor),c=null!==a&&null!==l;let d,h;if(c)({wedgeStart:d,wedgeEnd:h}=function(e,t,o,s,i){const n=((o-s)%360+360)%360,r=s+i,a=((t-n)%360+360)%360,l=e=>e<=r?e:e-r<360-e?r:0,c=l(((e-n)%360+360)%360),d=l(a);return c===d?{wedgeStart:n,wedgeEnd:((n+r)%360+360)%360}:{wedgeStart:((n+Math.min(c,d))%360+360)%360,wedgeEnd:((n+Math.max(c,d))%360+360)%360}}(Be(a),Be(l),i,e.sun.fov_left,e.sun.fov_right));else{const t=function(e,t,o,s,i){if(void 0===i)return null;const n=Be(t-o),r=o+s,a=e.filter(e=>((e.azimuth-n)%360+360)%360<=r&&e.elevation>i);return 0===a.length?null:{wedgeStart:a[0].azimuth,wedgeEnd:a[a.length-1].azimuth}}(s,i,e.sun.fov_left,e.sun.fov_right,e.sun.min_elevation);d=t?t.wedgeStart:n,h=t?t.wedgeEnd:r}const p=Ue(i,xt,o),{outer:u,inner:_}=(g=e.sun.min_elevation,m=e.sun.max_elevation,v=xt,void 0!==g&&void 0!==m&&g>m?{outer:v,inner:0}:{outer:void 0!==g?v*He(g):v,inner:void 0!==m?v*He(m):0});var g,m,v;const f="cover_awning"===e.coverType?e.coverPos/100:1-e.coverPos/100,y=null!==e.coverPos?xt*f:null,b=null!==y?Math.min(y,u):null,$=e.sun.blind_spot_range?[Be((w=i)-(x=e.sun.blind_spot_range)[1]),Be(w-x[0])]:null;var w,x;const k=$?qe($[0],$[1],xt,0,o):null,C=qe(d,h,u,_,o),S=c&&(d!==n||h!==r),A=S?qe(n,r,u,_,o):"",E=null!==b&&b>_?qe(d,h,b,_,o):"",z=[];for(const t of _t(s,i,e.sun.fov_left,e.sun.fov_right)){const i=Ve(s,t.startIdx,t.endIdx,e.sun.min_elevation);i&&!Ge(i.wedgeStart,i.wedgeEnd,d,h)&&z.push({fov:qe(i.wedgeStart,i.wedgeEnd,u,_,o),cover:this.showCoverFill&&null!==b&&b>_?qe(i.wedgeStart,i.wedgeEnd,b,_,o):"",from:i.wedgeStart,to:i.wedgeEnd})}const P=t?`${e.d.entry_title}: `:"",O=void 0!==e.sun.min_elevation||void 0!==e.sun.max_elevation?Le("compass.elev_suffix",this.hass,{min:ft(e.sun.min_elevation??0),max:ft(e.sun.max_elevation??90)}):"",M=c?`${P}${Le("compass.active_sun_arc",this.hass,{from:ft(d),to:ft(h),elev:O})}`:`${P}${Le("compass.fov_arc",this.hass,{left:ft(e.sun.fov_left),right:ft(e.sun.fov_right),elev:O})}`,T=`${P}${Le("compass.window_normal_tooltip",this.hass,{bearing:ft(i)})}`,I=null!==e.coverPos?"cover_awning"===e.coverType?`${P}${Le("compass.cover_extended",this.hass,{pct:e.coverPos})}`:`${P}${Le("compass.cover_closed_tooltip",this.hass,{pct:e.coverPos})}`:"",F=$?`${P}${Le("compass.blind_spot",this.hass,{from:ft($[0]),to:ft($[1])})}`:"",N=t||e.isOverride,R=N?`fill: ${e.color}; stroke: ${e.color};`:"",D=N?`fill: ${e.color}; stroke: ${e.color};`:"",L=N?`fill: ${e.color}; stroke: ${e.color};`:"",j=N?`stroke: ${e.color};`:"",U=N?`fill: ${e.color};`:"",H=this.showCoverFill&&""!==E,q=this.showBlindSpot&&!!k,W=this.showWindowArrow,V=`M 0 0 L ${p.x} ${p.y}`,G="display: none;",Z=`${P}${Le("compass.fov_arc",this.hass,{left:ft(e.sun.fov_left),right:ft(e.sun.fov_right),elev:O})}`;return B`<g class="entry-overlay">
      ${S?B`<g data-tooltip=${Z}>
              <title>${Z}</title>
              <path class="fov fov-static" style=${R} d=${A}></path>
            </g>`:K}
      <g data-tooltip=${M}>
        <title>${M}</title>
        <path class="fov" style=${R} d=${C}></path>
      </g>
      ${z.map(e=>{const t=`${P}${Le("compass.active_sun_arc",this.hass,{from:ft(e.from),to:ft(e.to),elev:O})}`;return B`<g data-tooltip=${t}>
          <title>${t}</title>
          <path class="fov-extra" style=${R} d=${e.fov}></path>
          ${e.cover?B`<path class="cover-fill-extra" style=${D} d=${e.cover}></path>`:K}
        </g>`})}
      <g class="arrow-group" data-tooltip=${T} style=${W?"":G}>
        <title>${T}</title>
        <path class="window" style=${j} d=${V}></path>
        <circle class="window-base" style=${U} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" data-tooltip=${I} style=${H?"":G}>
        <title>${I}</title>
        <path class="cover-fill" style=${D} d=${E}></path>
      </g>
      <g class="blind-group" data-tooltip=${F} style=${q?"":G}>
        <title>${F}</title>
        <path class="blind-spot" style=${L} d=${k??""}></path>
      </g>
    </g>`}_renderLegend(e,t){return t?W`
        <div class="legend">
          ${e.map(e=>W`
              <button
                type="button"
                class=${st({"entry-toggle":!0,hidden:this._hiddenEntries.has(e.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(e.d.entry_id)}
                @click=${()=>this._toggleEntry(e.d.entry_id)}
              >
                <span class="swatch entry" style="background: ${e.color}"></span>
                ${e.d.entry_title}
                ${e.sunInfront?W`<span class="status valid">${Le("compass.in_fov_check",this.hass)}</span>`:e.sun.in_fov?W`<span class="status in-fov">${Le("compass.in_fov",this.hass)}</span>`:W`<span class="status">${Le("compass.none",this.hass)}</span>`}
              </button>
            `)}
          <div><span class="dot sun valid"></span> ${Le("compass.sun",this.hass)}</div>
          ${this.showMoon?W`<div><span class="dot moon-dot"></span> ${Le("compass.moon",this.hass)}</div>`:K}
        </div>
      `:W`<div class="legend">
      <div><span class="dot sun valid"></span> ${Le("compass.sun_hitting",this.hass)}</div>
      <div><span class="dot sun up"></span> ${Le("compass.sun_up_not_hitting",this.hass)}</div>
      <div><span class="dot sun"></span> ${Le("compass.sun_below_horizon",this.hass)}</div>
      ${this.showMoon?W`<div><span class="dot moon-dot"></span> ${Le("compass.moon",this.hass)}</div>`:K}
      <div><span class="swatch fov"></span> ${Le("compass.window_fov",this.hass)}</div>
      ${this.showSunPath?W`<div>
            <span class="swatch sun-path-swatch"></span> ${Le("compass.sun_path",this.hass)}
          </div>`:K}
      ${this.showSunriseSunset?W`<div><span class="dot rise-dot"></span> ${Le("compass.sunrise",this.hass)}</div>
            <div><span class="dot set-dot"></span> ${Le("compass.sunset",this.hass)}</div>`:K}
      ${this.showCoverFill?W`<div>
            <span class="swatch cover-fill-swatch"></span> ${Le("compass.cover_closed",this.hass)}
          </div>`:K}
      ${this.showWindowArrow?W`<div>
            <span class="swatch window-swatch"></span> ${Le("compass.window_normal",this.hass)}
          </div>`:K}
    </div>`}_renderStats(e,t){const o=e[0],s=o.sunAzi,i=o.sun.elevation,{latitude:n,longitude:r}=this.hass.config,a=this.showMoon&&void 0!==n&&void 0!==r?gt(n,r):null;return t?W`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${Le("compass.stat_sun",this.hass)}${ft(s)} /
              ${ft(i)}</span
            >
            ${this.showMoon&&a?W`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:K}
          </div>
          ${e.map(e=>W`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${e.color}"></span>
                <span class="entry-name">${e.d.entry_title}</span>
                <span>∠${ft(e.sun.gamma)}</span>
                <span>W ${ft(Be(e.sun.window_azimuth))}</span>
                ${e.sun.in_fov?W`<span class="status in-fov">✓</span>`:K}
              </div>
            `)}
        </div>
      `:W`<div class="stats dim">
      <span>${Le("compass.stat_azi",this.hass)}${ft(s)}</span>
      <span>${Le("compass.stat_elev",this.hass)}${ft(i)}</span>
      <span>∠: ${ft(o.sun.gamma)}</span>
      <span
        >${Le("compass.stat_window",this.hass)}${ft(Be(o.sun.window_azimuth))}</span
      >
      ${this.showMoon&&a?W`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:K}
    </div>`}};kt.styles=r`
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
      transition: all 0.3s ease;
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
      transition: all 0.3s ease;
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
      transition:
        cx 0.3s ease,
        cy 0.3s ease,
        fill 0.3s ease;
    }
    .sun.up {
      fill: #ffe680;
    }
    .sun.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 4px var(--warning-color, gold));
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
      background: #ffe680;
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
    .swatch.sun-path-swatch {
      background: var(--warning-color, gold);
      opacity: 0.45;
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
    .sun-path {
      fill: none;
      stroke: var(--warning-color, gold);
      stroke-width: 1.5;
      stroke-dasharray: 4 3;
      opacity: 0.45;
    }
    .rise-marker {
      fill: var(--warning-color, gold);
      stroke: var(--card-background-color, #fff);
      stroke-width: 1;
      paint-order: stroke;
    }
    .set-marker {
      fill: var(--secondary-text-color);
      stroke: var(--card-background-color, #fff);
      stroke-width: 1;
      paint-order: stroke;
    }
    .moon-outline {
      fill: none;
      stroke: var(--secondary-text-color);
      stroke-width: 0.8;
      opacity: 0.5;
    }
    .moon-lit {
      fill: var(--secondary-text-color);
      opacity: 0.75;
      transition:
        cx 0.3s ease,
        cy 0.3s ease;
    }
    .dot.moon-dot {
      background: var(--secondary-text-color);
      opacity: 0.6;
    }
    g[data-tooltip] {
      cursor: help;
    }
  `,e([_e({attribute:!1})],kt.prototype,"hass",void 0),e([_e({attribute:!1})],kt.prototype,"discovered_list",void 0),e([_e({type:Boolean,reflect:!0})],kt.prototype,"compact",void 0),e([_e({attribute:!1})],kt.prototype,"showStats",void 0),e([_e({attribute:!1})],kt.prototype,"showLegend",void 0),e([_e({attribute:!1})],kt.prototype,"showMoon",void 0),e([_e({attribute:!1})],kt.prototype,"showCardinals",void 0),e([_e({attribute:!1})],kt.prototype,"showBlindSpot",void 0),e([_e({attribute:!1})],kt.prototype,"showSunPath",void 0),e([_e({attribute:!1})],kt.prototype,"showSunriseSunset",void 0),e([_e({attribute:!1})],kt.prototype,"showCoverFill",void 0),e([_e({attribute:!1})],kt.prototype,"showWindowArrow",void 0),e([_e({attribute:!1})],kt.prototype,"coverColors",void 0),e([_e({attribute:!1})],kt.prototype,"northOffsetDeg",void 0),e([ge()],kt.prototype,"_hiddenEntries",void 0),kt=e([he("acp-sky-compass")],kt);let Ct=class extends ce{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const e=this.discovered.entities.sun_sensor;if(!e)return null;const t=this.hass.states[e];return t?t.attributes:null}render(){if(!this.hass||!this.discovered)return K;const e=this._sunAttrs(),{latitude:t,longitude:o,time_zone:s}=this.hass.config;if(void 0===t||void 0===o||!e)return W`<div class="placeholder">${Le("elevation.placeholder",this.hass)}</div>`;const i=pt(s),n=ht(t,o,i),r=new Date,a=_t(n,e.window_azimuth,e.fov_left,e.fov_right),l=e=>32+(e.getTime()-i.getTime())/864e5*360,c=e=>138-(e- -10)/100*128,d=n.map(e=>`${l(e.t).toFixed(1)},${c(e.elevation).toFixed(1)}`).join(" "),h=c(0),p=l(r),u=this._interpAt(n,r),_=u?c(u.elevation):null,g=a.map(e=>({x0:l(n[e.startIdx].t),x1:l(n[e.endIdx].t)})),m=a.map(e=>`${yt(n[e.startIdx].t.toISOString())} → ${yt(n[e.endIdx].t.toISOString())}`).join(", ");return W`
      <div class="wrap">
        <div class="head">
          <span class="label">${Le("elevation.title",this.hass)}</span>
          ${a.length?W`<span class="dim"
                >${Le("elevation.fov_windows",this.hass,{windows:m})}</span
              >`:W`<span class="dim">${Le("elevation.no_fov_today",this.hass)}</span>`}
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${B`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(e=>B`
              <line class="grid" x1=${32} y1=${c(e)} x2=${392} y2=${c(e)} />
              <text class="tick" x=${28} y=${c(e)+3} text-anchor="end">${e}°</text>
            `)}

            <!-- x-axis gridlines at every 6h -->
            ${[0,6,12,18,24].map(e=>{const t=new Date(i.getTime()+36e5*e);return B`
                <line class="grid faint" x1=${l(t)} y1=${10} x2=${l(t)} y2=${138} />
                <text class="tick" x=${l(t)} y=${152} text-anchor="middle">${e.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${h} x2=${392} y2=${h} />

            <!-- FOV shaded bands (each time the sun is actually in FOV + above horizon) -->
            ${g.map(e=>B`<rect
                  class="fov-band"
                  x=${e.x0}
                  y=${10}
                  width=${e.x1-e.x0}
                  height=${128}
                />`)}

            <!-- elevation curve -->
            <polyline class="curve" points=${d} />

            <!-- current-time cursor -->
            <line class="now" x1=${p} y1=${10} x2=${p} y2=${138} />

            <!-- current sun dot -->
            ${null!==_?B`<circle class="sun-dot" cx=${p} cy=${_} r="4" />`:K}
          `}
        </svg>
      </div>
    `}_interpAt(e,t){if(0===e.length)return null;const o=t.getTime();if(o<=e[0].t.getTime())return e[0];if(o>=e[e.length-1].t.getTime())return e[e.length-1];for(let s=1;s<e.length;s++)if(e[s].t.getTime()>=o){const i=e[s-1],n=e[s],r=(o-i.t.getTime())/(n.t.getTime()-i.t.getTime());return{t:t,elevation:i.elevation+(n.elevation-i.elevation)*r,azimuth:i.azimuth+(n.azimuth-i.azimuth)*r}}return e[e.length-1]}};function St(e,t){if(!0===e?.custom_position_minimum_mode&&Array.isArray(e.custom_position_slots)&&void 0!==e.custom_position_active_slot){const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);if(void 0!==t&&null!==t.position&&void 0!==t.position)return t.position}return t}function At(e){const t=e.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(t))return"custom_position";switch(t){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return t}}function Et(e,t,o,s=Ce){const i=new Map;for(const t of e){if(!t.matched)continue;const e=At(t.handler);ke.includes(e)&&i.set(e,t)}const n=[...ke].reverse().filter(e=>i.has(e));return 0===n.length?t.reason??"":n.map(e=>function(e,t,o,s){const i=s[e]??e,n=t.position,r=null==n?"":` ${vt(n)}`;if("custom_position"!==e)return`${i}${r}`.trimEnd();return`${o.custom_position_active_slot_name?`${i} · ${o.custom_position_active_slot_name}`:o.custom_position_active_slot?`${i} #${o.custom_position_active_slot}`:i}${r}${!0===o.custom_position_minimum_mode?" floor":""}`}(e,i.get(e),t,s)).join(" → ")}Ct.styles=r`
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
  `,e([_e({attribute:!1})],Ct.prototype,"hass",void 0),e([_e({attribute:!1})],Ct.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Ct.prototype,"compact",void 0),Ct=e([he("acp-elevation-chart")],Ct);let zt=class extends ce{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this.hideInactive=!1}_trace(){const e=this.discovered.entities.decision_trace_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=t.attributes;if(!o?.trace)return null;const s=new Map;for(const e of o.trace)s.set(At(e.handler),{matched:e.matched,reason:e.reason,position:e.position});const i={};for(const[e,t]of Object.entries(Se))i[e]=Le(t,this.hass);return{winner:t.state,reason:o.reason??"",steps:s,enabledHandlers:o.enabled_handlers,summary:Et(o.trace,o,t.state,i)}}render(){if(!this.hass||!this.discovered)return K;const e=this._trace();if(!e)return W`<div class="placeholder">${Le("decision.placeholder",this.hass)}</div>`;const t=function(e){if(!e)return new Set;const t=new Set(e);return new Set(ke.filter(e=>!t.has(e)))}(e.enabledHandlers),o=function(e,t,o,s,i=new Set){return e.filter(e=>e===o||!i.has(e)&&(!s||!0===t.get(e)?.matched))}(ke,e.steps,e.winner,this.hideInactive,t);return W`
      <div class="wrap">
        <div class="head">
          <span class="label">${Le("decision.pipeline",this.hass)}</span>
          <span class="winner">${Le("decision.winner",this.hass,{name:e.winner})}</span>
        </div>
        ${this.showSummary&&e.summary?W`<div class="summary" title=${Le("decision.summary_tooltip",this.hass)}>
              ${e.summary}
            </div>`:K}
        <div class="rows">
          ${o.map(t=>this._row(t,e.steps.get(t),e.winner===t))}
        </div>
        <div class="reason dim">${e.reason}</div>
      </div>
    `}_row(e,t,o){const s=t?.matched??!1,i=t?.reason??Le("decision.not_evaluated",this.hass),n=t?.position;return W`
      <div class="row ${o?"winner":s?"match":"skip"}">
        <span class="name">${Le(Se[e],this.hass)}</span>
        <span class="dots" aria-hidden="true">${s?"████":"────"}</span>
        <span class="pos">${null!=n?vt(n):""}</span>
        <span class="reason-inline dim">${i}</span>
        ${o?W`<span class="badge">✓</span>`:K}
      </div>
    `}};var Pt,Ot;zt.styles=r`
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
    }
    :host([compact]) .summary {
      font-size: 0.75rem;
      padding: 0 2px 2px;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      padding: 16px;
      text-align: center;
    }
  `,e([_e({attribute:!1})],zt.prototype,"hass",void 0),e([_e({attribute:!1})],zt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],zt.prototype,"compact",void 0),e([_e({type:Boolean,reflect:!0,attribute:"show-summary"})],zt.prototype,"showSummary",void 0),e([_e({type:Boolean,reflect:!0,attribute:"hide-inactive"})],zt.prototype,"hideInactive",void 0),zt=e([he("acp-decision-strip")],zt),function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Pt||(Pt={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ot||(Ot={}));const Mt=["closed","locked","off"],Tt=(e,t,o,s)=>{s=s||{},o=null==o?{}:o;const i=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return i.detail=o,e.dispatchEvent(i),i},It=e=>{Tt(window,"haptic",e)};function Ft(e){return void 0!==e&&"none"!==e.action}function Nt(e,t,o){return e.filter(e=>"off"===e||("solar"===e?function(e){return e.solarMatched&&!e.cloudIsWinner}(o)&&!1!==t?.solar:!1!==t?.[e]))}function Rt(e){return!!e&&e.some(e=>e.matched&&"solar"===At(e.handler))}function Dt(e){return"cloud"===At(e)}function Lt(e){if(!1===e.integrationEnabled)return"off";const t=At(e.winner);return e.manualActive&&"force"!==t&&"custom_position"!==t?"manual":Pe[t]??"auto"}function jt(e,t){return{solarMatched:Rt(e),cloudIsWinner:Dt(t)}}let Ut=class extends ce{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0,this.manualActive=!1,this.resumable=!1}render(){const e=this._kind(),t=Oe[e],o=this.hass?Le(Me[e],this.hass):t.label,s=this._label(e,o),i=Te[e],n=W`${i?W`<ha-icon class="badge-icon" icon=${i}></ha-icon>`:K}${s}${this.resumable?W`<ha-icon class="resume-icon" icon="mdi:restore"></ha-icon>`:K}`;if(this.resumable){const o=this.hass?Le("tile.resume_aria",this.hass):"Resume automatic control";return W`<button
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
      </button>`}return W`<span
      class="badge kind-${e}"
      style="background:${t.bg};color:${t.fg};"
      part="badge"
      >${n}</span
    >`}_stop(e){e.stopPropagation()}_onResumeClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-resume",{bubbles:!0,composed:!0}))}_kind(){return this.kindOverride??Lt({winner:this.winner,integrationEnabled:this.integrationEnabled,manualActive:this.manualActive})}_label(e,t){return"manual"===e?this.manualEndIso?yt(this.manualEndIso):t:"custom_position"===e?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${t} #${this.slotNumber}`:t}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?this.hass?Le("badge.floor_suffix",this.hass):" ↥":""}`:t}};Ut.styles=r`
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
      font: inherit;
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
  `,e([_e({attribute:!1})],Ut.prototype,"hass",void 0),e([_e()],Ut.prototype,"winner",void 0),e([_e({attribute:"manual-end-iso"})],Ut.prototype,"manualEndIso",void 0),e([_e({type:Number,attribute:"slot-number"})],Ut.prototype,"slotNumber",void 0),e([_e({attribute:"slot-name"})],Ut.prototype,"slotName",void 0),e([_e({type:Number})],Ut.prototype,"pct",void 0),e([_e({type:Boolean,attribute:"minimum-mode"})],Ut.prototype,"minimumMode",void 0),e([_e({type:Boolean,reflect:!0})],Ut.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"integration-enabled"})],Ut.prototype,"integrationEnabled",void 0),e([_e({type:Boolean,attribute:"manual-active"})],Ut.prototype,"manualActive",void 0),e([_e({attribute:"kind-override"})],Ut.prototype,"kindOverride",void 0),e([_e({type:Boolean,reflect:!0})],Ut.prototype,"resumable",void 0),Ut=e([he("acp-tile-badge")],Ut);let Ht=class extends ce{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualEndIso(){const e=this.discovered.entities.manual_override_end_sensor;if(!e)return null;const t=this.hass.states[e];return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:null}_motionStatus(){const e=this.discovered.entities.motion_status_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=t.attributes.motion_timeout_end_time;return{state:t.state,endIso:o??null}}_forceActive(){const e=this.discovered.entities.force_override_sensor;if(!e)return 0;const t=this.hass.states[e];return t&&parseInt(t.state,10)||0}_resetManual(){const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_motionStateLabel(e,t){if(e){const t=this.hass.states[e],o=this.hass.formatEntityState;if(t&&"function"==typeof o){const e=o(t);if(e)return e}}return t.replace(/_/g," ")}render(){if(!this.hass||!this.discovered)return K;const e=this._manualActive(),t=this._manualEndIso(),o=this._motionStatus(),s=this.discovered.entities.motion_status_sensor,i=this._forceActive(),n=this.discovered.entities.reset_override_button,r=Le("overrides.reset_manual",this.hass);return W`
      <div class="wrap">
        <div class="label dim">${Le("overrides.title",this.hass)}</div>
        <div class="grid">
          <div class="tile ${e?"active":""}">
            <div class="tile-label">${Le("overrides.manual",this.hass)}</div>
            <div class="tile-value">
              ${Le(e?"overrides.active":"overrides.off",this.hass)}
            </div>
            ${t?W`<div class="tile-sub dim">
                  ${Le("overrides.ends_in",this.hass,{time:bt(t,this.hass)})}
                </div>`:K}
          </div>

          <div class="tile ${i>0?"active warning":""}">
            <div class="tile-label">${Le("overrides.force",this.hass)}</div>
            <div class="tile-value">
              ${i>0?Le("overrides.active_count",this.hass,{count:i}):Le("overrides.off",this.hass)}
            </div>
          </div>

          ${o?W`<div class="tile ${"motion_detected"===o.state?"active":""}">
                <div class="tile-label">${Le("overrides.motion",this.hass)}</div>
                <div class="tile-value">${this._motionStateLabel(s,o.state)}</div>
                ${o.endIso?W`<div class="tile-sub dim">
                      ${Le("overrides.timeout",this.hass,{time:bt(o.endIso,this.hass)})}
                    </div>`:K}
              </div>`:K}
          ${n?this.resetEnabled?W`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${r}</div>
                </button>`:W`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${r}</div>
                </button>`:K}
        </div>
      </div>
    `}};Ht.styles=r`
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
  `,e([_e({attribute:!1})],Ht.prototype,"hass",void 0),e([_e({attribute:!1})],Ht.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Ht.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"reset-enabled"})],Ht.prototype,"resetEnabled",void 0),Ht=e([he("acp-overrides-panel")],Ht);const qt={summer_mode:"mdi:weather-sunny",winter_mode:"mdi:snowflake",intermediate:"mdi:weather-partly-cloudy"};let Wt=class extends ce{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return K;const e=this.discovered.entities.climate_status_sensor;if(!e)return K;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return K;const o=t.state,s=t.attributes??{},i=qt[o]??"mdi:thermostat",n=s.temperature_unit??"°",r=this.hass.formatEntityState,a="function"==typeof r?r(t)??o:o,l=void 0!==s.active_temperature?`${s.active_temperature.toFixed(1)}${n}`:"—",c=[void 0!==s.indoor_temperature?{label:Le("climate.indoor",this.hass),value:s.indoor_temperature,unit:n}:null,void 0!==s.outdoor_temperature?{label:Le("climate.outdoor",this.hass),value:s.outdoor_temperature,unit:n}:null].filter(e=>null!==e),d=[{label:Le("climate.presence",this.hass),value:s.is_presence,icon:"mdi:account-check"},{label:Le("climate.sunny",this.hass),value:s.is_sunny,icon:"mdi:white-balance-sunny"},{label:Le("climate.lux",this.hass),value:s.lux_active,icon:"mdi:brightness-7"},{label:Le("climate.irradiance",this.hass),value:s.irradiance_active,icon:"mdi:solar-power"}].filter(e=>void 0!==e.value);return W`
      <div class="wrap">
        <div class="head">
          <span class="label">${Le("climate.title",this.hass)}</span>
          <span class="dim">${Le("climate.active",this.hass,{strategy:l})}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${i}></ha-icon>
          <span class="strategy-name">${a}</span>
        </div>
        ${c.length?W`
              <div class="temps">
                ${c.map(e=>W`
                    <div class="temp">
                      <span class="temp-label dim">${e.label}</span>
                      <span class="temp-value">${e.value.toFixed(1)}${e.unit}</span>
                    </div>
                  `)}
              </div>
            `:K}
        ${d.length?W`
              <div class="conditions">
                ${d.map(e=>W`
                    <div class="chip ${e.value?"on":"off"}" title=${e.label}>
                      <ha-icon icon=${e.icon}></ha-icon>
                      <span>${e.label}</span>
                    </div>
                  `)}
              </div>
            `:K}
      </div>
    `}};Wt.styles=r`
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
  `,e([_e({attribute:!1})],Wt.prototype,"hass",void 0),e([_e({attribute:!1})],Wt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Wt.prototype,"compact",void 0),Wt=e([he("acp-climate-panel")],Wt);let Bt=class extends ce{constructor(){super(...arguments),this.compact=!1}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return{target:null,covers:{}};const t=this.hass.states[e];if(!t)return{target:null,covers:{}};const o=parseFloat(t.state),s=t.attributes;return{target:Number.isNaN(o)?null:o,covers:s?.actual_positions??{}}}_mismatched(){const e=this.discovered.entities.position_mismatch_binary;if(!e)return new Set;const t=this.hass.states[e];if("on"!==t?.state)return new Set;const o=t.attributes.entities;return o?new Set(Object.entries(o).filter(([,e])=>e.mismatch).map(([e])=>e)):new Set}_setPosition(e,t){this.hass.callService(xe,"set_position",{position:t},{entity_id:e})}render(){if(!this.hass||!this.discovered)return K;const{target:e,covers:t}=this._target(),o=this._mismatched(),s=Object.entries(t);return 0===s.length?W`<div class="placeholder">${Le("covers.placeholder",this.hass)}</div>`:W`
      <div class="wrap">
        <div class="head">
          <span class="label">${Le("covers.title",this.hass)}</span>
          <span class="target"
            >${Le("covers.target",this.hass,{pct:vt(e)})}</span
          >
        </div>
        ${s.map(([t,s])=>this._bar(t,s,e,o.has(t)))}
      </div>
    `}_bar(e,t,o,s){const i=this.hass.states[e]?.attributes?.friendly_name??e,n=t??0,r=o??0;return W`
      <div class="cover ${s?"mismatch":""}">
        <div class="name" title=${e}>${i}</div>
        <div
          class="track"
          @click=${t=>this._handleTrackClick(t,e)}
          title=${Le("covers.click_to_set",this.hass)}
        >
          <div class="fill" style="width:${n}%"></div>
          ${null!==o?W`<div
                class="marker"
                style="left:${r}%"
                title=${Le("covers.target_tooltip",this.hass,{pct:r})}
              ></div>`:K}
        </div>
        <div class="num">${vt(t)}</div>
        ${s?W`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:K}
      </div>
    `}_handleTrackClick(e,t){const o=e.currentTarget.getBoundingClientRect(),s=Math.round((e.clientX-o.left)/o.width*100),i=Math.max(0,Math.min(100,s));this._setPosition(t,i)}};var Vt;Bt.styles=r`
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
    :host([compact]) .head {
      display: none;
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
  `,e([_e({attribute:!1})],Bt.prototype,"hass",void 0),e([_e({attribute:!1})],Bt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Bt.prototype,"compact",void 0),Bt=e([he("acp-cover-bar")],Bt);let Kt=Vt=class extends ce{constructor(){super(...arguments),this.samples=[],this.events=[],this._hoverIdx=null,this._onPointerMove=e=>{const t=e.currentTarget.getBoundingClientRect();if(t.width<=0)return;const o=(e.clientX-t.left)/t.width,s=Math.max(0,Math.min(1,o))*Vt.VIEW_W;this._hoverIdx=this._nearestSampleIdx(s)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){if(!this.samples||0===this.samples.length)return K;const e=this._timeRange();if(!e)return K;const{start:t,end:o}=e,s=o-t;if(s<=0)return K;const{VIEW_W:i,VIEW_H:n,TOP_PAD:r,EVENT_HIT_W:a}=Vt,l=n-r,c=this.samples.map(e=>{const o=Date.parse(e.t);return{t:o,x:(o-t)/s*i,y:r+(1-Gt(e.position)/100)*l,sample:e}}),d=c.map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)}`).join(" "),h=(this.events??[]).map(e=>{const l=Date.parse(e.t);if(Number.isNaN(l)||l<t||l>o)return null;const c=(l-t)/s*i,d=`evt-${e.kind}`,h=function(e,t){const o=`forecast.event.${e.kind}`,s=Le(o,t),i=s===o?e.label??e.kind:s,n=yt(e.t);return"—"===n?i:`${i} — ${n}`}(e,this.hass);return B`<g class="event-group" data-tooltip=${h}>
          <title>${h}</title>
          <line
            class="event-hit"
            x1=${c.toFixed(1)}
            x2=${c.toFixed(1)}
            y1=${r}
            y2=${n}
            stroke-width=${a}
          ></line>
          <line
            class="event-marker ${d}"
            x1=${c.toFixed(1)}
            x2=${c.toFixed(1)}
            y1=${r}
            y2=${n}
          ></line>
        </g>`}).filter(e=>null!==e),p=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<c.length?c[this._hoverIdx]:null,u=p?B`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${p.x.toFixed(1)} x2=${p.x.toFixed(1)}
            y1=${r} y2=${n}></line>
          <circle class="hover-dot" cx=${p.x.toFixed(1)} cy=${p.y.toFixed(1)} r="3"></circle>
        </g>`:K,_=p?W`<div class="hover-label" style=${`left: ${(p.x/i*100).toFixed(2)}%`}>
          ${function(e){const t=yt(e.t),o=`${Math.round(Gt(e.position))}%`;return e.handler?`${t} · ${o} · ${e.handler}`:`${t} · ${o}`}(p.sample)}
        </div>`:K,g=yt(this.samples[0].t),m=yt(this.samples[this.samples.length-1].t);return W`
      <div class="wrap">
        <svg
          viewBox="0 0 ${i} ${n}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <title>${Le("forecast.hover_hint",this.hass)}</title>
          <line class="baseline" x1="0" y1=${n-.5} x2=${i} y2=${n-.5}></line>
          <polyline class="curve" points=${d} fill="none"></polyline>
          <text class="axis-label" x="4" y=${r+8} text-anchor="start">100%</text>
          <text class="axis-label" x="4" y=${n-3} text-anchor="start">${g}</text>
          <text class="axis-label" x=${i-4} y=${n-3} text-anchor="end">
            ${m}
          </text>
          ${h} ${u}
        </svg>
        ${_}
      </div>
    `}_timeRange(){let e=Number.POSITIVE_INFINITY,t=Number.NEGATIVE_INFINITY;for(const o of this.samples){const s=Date.parse(o.t);Number.isNaN(s)||(s<e&&(e=s),s>t&&(t=s))}return e===Number.POSITIVE_INFINITY?null:{start:e,end:t}}_nearestSampleIdx(e){const t=this._timeRange();if(!t)return null;const o=t.end-t.start;if(o<=0)return null;let s=-1,i=Number.POSITIVE_INFINITY;for(let n=0;n<this.samples.length;n++){const r=Date.parse(this.samples[n].t);if(Number.isNaN(r))continue;const a=(r-t.start)/o*Vt.VIEW_W,l=Math.abs(a-e);l<i&&(i=l,s=n)}return s>=0?s:null}};function Gt(e){return Number.isNaN(e)||e<0?0:e>100?100:e}Kt.VIEW_W=600,Kt.VIEW_H=80,Kt.TOP_PAD=10,Kt.EVENT_HIT_W=12,Kt.styles=r`
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
      cursor: help;
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
  `,e([_e({attribute:!1})],Kt.prototype,"hass",void 0),e([_e({attribute:!1})],Kt.prototype,"samples",void 0),e([_e({attribute:!1})],Kt.prototype,"events",void 0),e([ge()],Kt.prototype,"_hoverIdx",void 0),Kt=Vt=e([he("acp-forecast-strip")],Kt);let Zt=class extends ce{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this._onResume=()=>{const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const e=this.discovered.device_id;e&&this._navigate(`/config/devices/device/${e}`)},this._openIntegrationPage=()=>{this._navigate(`/config/integrations/integration/${xe}`)},this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}_buildHandlerLabels(){const e={};for(const[t,o]of Object.entries(Se))e[t]=Le(o,this.hass);return e}render(){if(!this.open||!this.hass||!this.discovered)return K;const e=this._winner(),t=this._traceAttrs(),o=this._matchedHandlers(t,e),s=t?Et(t.trace??[],t,0,this._buildHandlerLabels()):"",i=this._target(),n=this._shouldShowResume(e),r=this._switchOn("integration_enabled_switch"),a=this._switchOn("automatic_control_switch"),l=Le("dialog.configure_integration",this.hass),c=Le("dialog.open_device_page",this.hass),d=Le("dialog.close",this.hass);return W`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${Ae[this.discovered.cover_type]??"mdi:window-shutter"}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${r?a?o.map(e=>W`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${e}
                          .slotNumber=${"custom_position"===e?t?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===e?t?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===e?St(t,i)??void 0:void 0}
                          .minimumMode=${"custom_position"===e?t?.custom_position_minimum_mode:void 0}
                        ></acp-tile-badge>`):K:W`<acp-tile-badge
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
            ${this.discovered.device_id?W`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label=${c}
                  title=${c}
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:cog"></ha-icon>
                </button>`:K}
            <button class="close" type="button" aria-label=${d} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${s?W`<div class="summary">${s}</div>`:K}

          <div class="position-block">
            <div class="position-label">${Le("dialog.target",this.hass)}</div>
            <div class="position-value">${vt(i)}</div>
            ${this._mismatchActive()?W`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:K}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${n?W`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${Le("dialog.resume_auto",this.hass)}
                </button>
              </div>`:K}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?Le("dialog.hide_advanced",this.hass):Le("dialog.show_advanced",this.hass)}
          </button>
          ${this.advancedOpen?W`<div class="advanced">
                ${this.showCompass?W`<div class="advanced-compass">
                      <acp-sky-compass
                        .hass=${this.hass}
                        .discovered_list=${[this.discovered]}
                        ?compact=${!0}
                        .showLegend=${!1}
                        .showStats=${!0}
                      ></acp-sky-compass>
                    </div>`:K}
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
              </div>`:K}
        </div>
      </div>
    `}_winner(){const e=this.discovered.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(){const e=this.discovered.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_matchedHandlers(e,t){if(!e?.trace)return[];const o=new Set;for(const t of e.trace){if(!t.matched)continue;const e=At(t.handler);ke.includes(e)&&o.add(e)}const s=ke.filter(e=>o.has(e)).map(e=>Pe[e]).filter(e=>void 0!==e),i=jt(e.trace,t);return Nt(s,this.badges,i)}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=parseFloat(t.state);return Number.isNaN(o)?null:o}_mismatchActive(){const e=this.discovered.entities.position_mismatch_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualOverrideOn(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(e){const t=this.discovered.entities[e];return!t||"off"!==this.hass.states[t]?.state}_shouldShowResume(e){return!(!this.discovered.entities.reset_override_button||!this._manualOverrideOn()&&"custom_position"!==At(e))}_renderSlots(e){if(!e)return K;const t=e.filter(e=>null!==e.sensor);return 0===t.length?K:W`<div class="slots-section">
      <div class="slots-label">${Le("dialog.custom_positions",this.hass)}</div>
      ${t.map(e=>this._renderSlotRow(e))}
    </div>`}_renderSlotRow(e){const t=e.sensor_name??`#${e.slot}`;return W`<div class="slot-row" data-slot=${e.slot}>
      <span class="slot-label">${t}</span>
      <span class="slot-position">${vt(e.position)}</span>
      ${!0===e.min_mode?W`<span
            class="slot-min-mode${null!=e.priority&&e.priority>80?"":" is-bypassable"}"
            title=${Le("dialog.floor_tooltip",this.hass)}
          >
            ${Le("dialog.floor",this.hass)}
          </span>`:K}
      <button
        class="slot-toggle ${e.enabled?"on":"off"}"
        type="button"
        aria-label=${e.enabled?Le("dialog.disable_slot",this.hass,{slot:e.slot}):Le("dialog.enable_slot",this.hass,{slot:e.slot})}
        @click=${()=>this._toggleSlot(e)}
      >
        ${e.enabled?Le("dialog.on",this.hass):Le("dialog.off",this.hass)}
      </button>
    </div>`}_renderControls(){const e=[{role:"automatic_control_switch",label:Le("dialog.automatic",this.hass)},{role:"climate_mode_switch",label:Le("dialog.climate",this.hass)},{role:"motion_control_switch",label:Le("dialog.motion",this.hass)}].filter(e=>!!this.discovered.entities[e.role]);return 0===e.length?K:W`<div class="controls-block">
      <div class="controls-label">${Le("dialog.controls",this.hass)}</div>
      <div class="controls-row">${e.map(e=>this._renderSwitchChip(e.role,e.label))}</div>
    </div>`}_renderSwitchChip(e,t){const o=this.discovered.entities[e],s="on"===this.hass.states[o]?.state,i=Le(s?"dialog.state_on":"dialog.state_off",this.hass),n=Le(s?"dialog.on":"dialog.off",this.hass);return W`<button
      class="ctrl-toggle ${s?"on":"off"}"
      type="button"
      aria-pressed=${s}
      aria-label=${Le("dialog.toggle_hint",this.hass,{label:t,state:i})}
      @click=${()=>this._toggleSwitch(o,s)}
    >
      <span class="ctrl-label">${t}</span>
      <span class="ctrl-state">${n}</span>
    </button>`}_toggleSwitch(e,t){this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:e})}_renderForecastStrip(){const e=this.discovered.entities.position_forecast_sensor;if(!e)return K;const t=this.hass.states[e]?.attributes,o=t?.forecast??[],s=t?.events??[];return 0===o.length?K:W`<div class="forecast-block">
      <div class="forecast-label">${Le("dialog.todays_forecast",this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${o}
        .events=${s}
        .now=${Date.now()}
      ></acp-forecast-strip>
    </div>`}_toggleSlot(e){const t=this.discovered.managed_covers[0];t&&this.hass.callService(xe,"set_custom_position",{entity_id:t,slot:e.slot,enabled:!e.enabled})}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};async function Yt(e){return(await e.callWS({type:"config_entries/get",domain:xe})).filter(e=>e.domain===xe).map(e=>({entry_id:e.entry_id,title:e.title}))}Zt.styles=r`
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
  `,e([_e({attribute:!1})],Zt.prototype,"hass",void 0),e([_e({attribute:!1})],Zt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Zt.prototype,"open",void 0),e([_e({type:Boolean})],Zt.prototype,"advancedOpen",void 0),e([_e({type:Boolean})],Zt.prototype,"showCompass",void 0),e([_e({attribute:!1})],Zt.prototype,"badges",void 0),Zt=e([he("acp-more-info-dialog")],Zt);const Xt=["auto","solar","force","weather","manual","custom_position","motion","climate","glare_zone","cloud"],Jt={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_compass:!0,show_motion_icon:!0,layout:"detailed",badge_auto:!0,badge_solar:!0,badge_force:!0,badge_weather:!0,badge_manual:!0,badge_custom_position:!0,badge_motion:!0,badge_climate:!0,badge_glare_zone:!0,badge_cloud:!0},Qt={entry_id:"editor.common.entry_id",name:"editor.tile.name",icon:"editor.tile.icon",cover:"editor.tile.cover",layout:"editor.tile.layout",show_position:"editor.tile.show_position",show_state:"editor.tile.show_state",show_decision_summary:"editor.tile.show_decision_summary",show_controls:"editor.tile.show_controls",show_badge:"editor.tile.show_badge",badge_section:"editor.tile.badge_section",badge_auto:"editor.tile.badge_auto",badge_solar:"editor.tile.badge_solar",badge_force:"editor.tile.badge_force",badge_weather:"editor.tile.badge_weather",badge_manual:"editor.tile.badge_manual",badge_custom_position:"editor.tile.badge_custom_position",badge_motion:"editor.tile.badge_motion",badge_climate:"editor.tile.badge_climate",badge_glare_zone:"editor.tile.badge_glare_zone",badge_cloud:"editor.tile.badge_cloud",show_compass:"editor.tile.show_compass",show_motion_icon:"editor.tile.show_motion_icon",tap_action:"editor.tile.tap_action",hold_action:"editor.tile.hold_action",double_tap_action:"editor.tile.double_tap_action"};let eo=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=e=>{const t=Qt[e.name];return t?Le(t,this.hass):e.name},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,o]of Object.entries(Jt))e.startsWith("badge_")?t[e]===o&&delete t[e]:this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==o||delete t[e];const o={};for(const e of Xt){const s=`badge_${e}`;!1===t[s]&&(o[e]=!1),delete t[s]}const s={...this._config??{type:"",entry_id:""},...t};Object.keys(o).length>0?s.badges=o:delete s.badges,this._emit(s)}}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),e.has("_registry")&&null!==this._registry&&this._maybePrefillCover()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Yt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id}),this._maybePrefillCover()}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,Ze(this.hass).then(e=>{this._registry=e,this._maybePrefillCover()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=Ye(this.hass,()=>{this._registryFetchInFlight=!0,Ze(this.hass).then(e=>{this._registry=e}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_maybePrefillCover(){if(!this._config?.entry_id||this._config?.cover||!this._registry||!this.hass)return;const e=je(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=e?.managed_covers??[],1===e?.managed_covers.length&&this._emit({...this._config,cover:e.managed_covers[0]})}render(){if(!this._config)return K;if(this._entriesError&&!this._entries)return W`
        <div class="form">
          <div class="error">
            ${Le("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${Le("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${Le("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          <div class="version-footer dim">
            ${Le("root.footer_version",this.hass,{version:me})}
          </div>
        </div>
      `;const e=this._schema(),{badges:t,...o}=this._config,s={};for(const e of Xt)t&&!1===t[e]&&(s[`badge_${e}`]=!1);const i={...Jt,...o,...s};return W`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${i}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${this._managedCovers.length>1&&!this._config?.cover?W`<div class="hint">${Le("editor.tile.cover_blank_hint",this.hass)}</div>`:K}
        <div class="version-footer dim">
          ${Le("root.footer_version",this.hass,{version:me})}
        </div>
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[],t=[{value:"one-line",label:Le("editor.tile.layout_option_one_line",this.hass)},{value:"detailed",label:Le("editor.tile.layout_option_detailed",this.hass)}];let o={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const e=je(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);e&&e.managed_covers.length>0&&(o={entity:{domain:"cover",include_entities:e.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:o},{name:"layout",selector:{select:{mode:"list",options:t}}},{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{type:"expandable",name:"",title:Le("editor.tile.badge_section",this.hass),icon:"mdi:label-multiple-outline",schema:[{type:"grid",name:"",schema:Xt.map(e=>({name:`badge_${e}`,selector:{boolean:{}}}))}]},{name:"show_motion_icon",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};eo.styles=r`
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
  `,e([_e({attribute:!1})],eo.prototype,"hass",void 0),e([ge()],eo.prototype,"_config",void 0),e([ge()],eo.prototype,"_entries",void 0),e([ge()],eo.prototype,"_entriesError",void 0),e([ge()],eo.prototype,"_registry",void 0),e([ge()],eo.prototype,"_managedCovers",void 0),eo=e([he(we)],eo);let to=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),Ft(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return Ft(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${$e}: \`entry_id\` is required and must be a non-empty string`);let t={...e};"string"==typeof t.tap_action&&(t={...t,tap_action:"none"===t.tap_action?{action:"none"}:void 0}),this._config=t}getCardSize(){return 1}static getStubConfig(){return{type:`custom:${$e}`,entry_id:""}}static async getConfigElement(){return document.createElement(we)}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ye(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){if(this._fetchInFlight)return;this._fetchInFlight=!0;const e=++this._fetchGen;Ze(this.hass).then(t=>{e===this._fetchGen&&(this._registry=t,this._registryError=null)}).catch(t=>{e===this._fetchGen&&(this._registryError=t?.message??"entity registry fetch failed")}).finally(()=>{e===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return K;if(null===this._registry)return W`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Le("tile.registry_failed",this.hass,{error:this._registryError}):Le("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=je(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?W`
      <ha-card>${this._renderTile(e)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${e}
        .open=${this._dialogOpen}
        .showCompass=${!1!==this._config.show_compass}
        .badges=${this._config.badges}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `:W`<ha-card>
        <div class="empty">
          <p class="dim">
            ${Le("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`}_buildHandlerLabels(){const e={};for(const[t,o]of Object.entries(Se))e[t]=Le(o,this.hass);return e}_renderTile(e){const t=this._config,o=t.name??e.entry_title,s=this._resolvedCover(e),i=t.icon??function(e,t){if(null!==t&&!Number.isNaN(t)){if(t>=95)return Ee[e]??"mdi:window-shutter-open";if(t<=5)return ze[e]??"mdi:window-shutter"}return Ae[e]??"mdi:window-shutter"}(e.cover_type,this._liveCoverPosition(s)),n=!1!==t.show_position,r=!1!==t.show_state,a=!1!==t.show_controls,l=!1!==t.show_badge,c=!1!==t.show_motion_icon?this._motionActiveState(e):null,d=Le("timeout_pending"===c?"tile.motion_pending":"tile.motion_detected",this.hass),h="one-line"!==t.layout,p=this._currentPosition(e),u=this._liveCoverPosition(s)??p,_=this._winner(e),g=this._traceAttrs(e),m=this._manualEndIso(e),v=this._isFullyInert(t),f=!0===t.show_decision_summary&&g?Et(g.trace??[],g,0,this._buildHandlerLabels()):"",y=!!f&&h,b=this._switchOn(e,"integration_enabled_switch"),$=this._switchOn(e,"automatic_control_switch"),w=this._manualOverrideOn(e),x=function(e){const t=Lt(e);return"motion"!==t?t:!1===e.badges?.motion||e.showMotionIcon?!1===e.badges?.auto?null:"auto":t}({winner:_,integrationEnabled:b,manualActive:w,badges:t.badges,showMotionIcon:!1!==t.show_motion_icon}),k=jt(g?.trace,_),C=null!==x&&Nt([x],t.badges,k).length>0,S=l&&C&&!(!1===$&&!0===b),A=function(e){if(!e.integrationEnabled)return!1;if(!e.automaticControl)return!1;if(e.manualActive)return!1;const t=At(e.winner);return"force"!==t&&("custom_position"!==t||!e.bypassAutoControl)}({winner:_,integrationEnabled:b,automaticControl:$,manualActive:w,bypassAutoControl:!0===g?.bypass_auto_control}),E=h&&l&&!1!==t.badges?.auto&&A,z=!(E&&"auto"===x),P=r?function(e,t){if(!e||!t)return null;const o=e.states[t];if(!o?.state||"unknown"===o.state||"unavailable"===o.state)return null;if("function"==typeof e.formatEntityState){const t=e.formatEntityState(o);if(t)return t}if("function"==typeof e.localize){const t=e.localize(`component.cover.entity_component._.state.${o.state}`);if(t)return t}return o.state.charAt(0).toUpperCase()+o.state.slice(1)}(this.hass,s):null,O=[P,n&&null!==u?vt(u):null].filter(e=>!!e),M=!!P,T=function(e,t,o){if(!Array.isArray(e?.custom_position_slots))return null;const s=e.custom_position_slots.filter(e=>!0===e.min_mode&&!0===e.enabled&&null!==e.sensor&&null!==e.position&&"on"===t[e.sensor]?.state);if(0===s.length)return null;const i=s.reduce((e,t)=>(t.position??0)>(e.position??0)?t:e),n=i.position,r=i.priority??null;return{slot:i.slot,position:n,label:i.sensor_name??`#${i.slot}`,clamping:null!==o&&n>o,sensorOn:!0,priority:r,resistsManual:null!=r&&r>80}}(g,this.hass.states,p),I=At(_),F=!!T&&!("custom_position"===I&&!0===g?.custom_position_minimum_mode)&&b,N=w&&!!e.entities.reset_override_button,R=O.length>0?W`<div class="position">${O.join(" · ")}</div>`:K,D=F?W`<span
          class=${`acp-floor-chip${T.clamping?"":" is-armed"}${T.resistsManual?" resists-manual":" is-bypassable"}`}
          title=${Le("dialog.floor_tooltip",this.hass)}
          >${Le("dialog.floor",this.hass)} ${vt(T.position)}</span
        >`:K,L=S?W`<acp-tile-badge
          .hass=${this.hass}
          .winner=${_}
          .kindOverride=${x??void 0}
          .integrationEnabled=${b}
          .slotNumber=${g?.custom_position_active_slot}
          .slotName=${g?.custom_position_active_slot_name}
          .pct=${St(g,p)??void 0}
          .minimumMode=${g?.custom_position_minimum_mode}
          .manualEndIso=${m}
          .manualActive=${w}
          .resumable=${N}
          @acp-resume=${()=>this._resume(e)}
        ></acp-tile-badge>`:K,j=E?W`<acp-tile-badge
          .hass=${this.hass}
          .winner=${_}
          .kindOverride=${"auto"}
          .integrationEnabled=${b}
        ></acp-tile-badge>`:K;return W`
      <div
        class=${`tile-body${h?" detailed":""}${y?" has-summary":""}${M?" has-state-label":""}${F?" has-floor-chip":""}`}
        role=${v?"group":"button"}
        tabindex=${v?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
          <ha-icon class="cover-icon" icon=${i}></ha-icon>
          ${c?W`<ha-icon
                class="motion-overlay ${c}"
                icon="mdi:motion-sensor"
                title=${d}
              ></ha-icon>`:K}
        </div>
        <div class="label">
          <div class="title" title=${e.entry_title}>${o}</div>
          ${f&&!h?W`<div class="summary">${f}</div>`:K}
          ${y?W`<div class="summary inline-summary" title=${f}>${f}</div>`:K}
        </div>
        ${h&&E?W`<div class="auto-line">${j}</div>`:K}
        ${h?W`<div class="detail-line">
              ${R}${D}${z?L:K}
            </div>`:W`${R}${D}`}
        ${a?W`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${Le("tile.open",this.hass)}
                ?disabled=${!s}
                @click=${()=>this._setCoverPosition(s,100)}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${Le("tile.stop",this.hass)}
                ?disabled=${!s}
                @click=${()=>this._stopCover(s)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${Le("tile.close",this.hass)}
                ?disabled=${!s}
                @click=${()=>this._setCoverPosition(s,0)}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </div>`:K}
        ${h?K:L}
      </div>
    `}_resolvedCover(e){return this._config?.cover?this._config.cover:e.managed_covers[0]}_currentPosition(e){const t=e.entities.target_position_sensor;if(!t)return null;const o=this.hass.states[t];if(!o)return null;const s=parseFloat(o.state);return Number.isNaN(s)?null:s}_liveCoverPosition(e){if(!e)return null;const t=this.hass.states[e]?.attributes?.current_position;return"number"!=typeof t||Number.isNaN(t)?null:t}_winner(e){const t=e.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(e){const t=e.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_motionActiveState(e){const t=e.entities.motion_status_sensor;if(!t)return null;const o=this.hass.states[t]?.state;return"motion_detected"===o||"timeout_pending"===o?o:null}_manualOverrideOn(e){const t=e.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(e,t){const o=e.entities[t];return!o||"off"!==this.hass.states[o]?.state}_manualEndIso(e){if(!this._manualOverrideOn(e))return;const t=e.entities.manual_override_end_sensor;return t?this.hass.states[t]?.state:void 0}_setCoverPosition(e,t){e&&this.hass.callService(xe,"set_position",{position:t},{entity_id:e})}_stopCover(e){e&&this.hass.callService(xe,"stop",{},{entity_id:e})}_resume(e){const t=e.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}_tapActionConfig(){const e=this._config?.tap_action;if("string"!=typeof e)return e}_isFullyInert(e){return!!(e=>!!e&&"none"===e.action)(this._tapActionConfig())&&!Ft(e.hold_action)&&!Ft(e.double_tap_action)}_fireAction(e){if(!this._config||!this.hass)return;const t=this._tapActionConfig();if("tap"===e&&void 0===t)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const o=this._resolvedCoverFromState();((e,t,o,s)=>{let i;"double_tap"===s&&o.double_tap_action?i=o.double_tap_action:"hold"===s&&o.hold_action?i=o.hold_action:"tap"===s&&o.tap_action&&(i=o.tap_action),((e,t,o,s)=>{if(s||(s={action:"more-info"}),!s.confirmation||s.confirmation.exemptions&&s.confirmation.exemptions.some(e=>e.user===t.user.id)||(It("warning"),confirm(s.confirmation.text||`Are you sure you want to ${s.action}?`)))switch(s.action){case"more-info":(o.entity||o.camera_image)&&Tt(e,"hass-more-info",{entityId:o.entity?o.entity:o.camera_image});break;case"navigate":s.navigation_path&&((e,t,o=!1)=>{o?history.replaceState(null,"",t):history.pushState(null,"",t),Tt(window,"location-changed",{replace:o})})(0,s.navigation_path);break;case"url":s.url_path&&window.open(s.url_path);break;case"toggle":o.entity&&(((e,t)=>{((e,t,o=!0)=>{const s=function(e){return e.substr(0,e.indexOf("."))}(t),i="group"===s?"homeassistant":s;let n;switch(s){case"lock":n=o?"unlock":"lock";break;case"cover":n=o?"open_cover":"close_cover";break;default:n=o?"turn_on":"turn_off"}e.callService(i,n,{entity_id:t})})(e,t,Mt.includes(e.states[t].state))})(t,o.entity),It("success"));break;case"call-service":{if(!s.service)return void It("failure");const[e,o]=s.service.split(".",2);t.callService(e,o,s.service_data,s.target),It("success");break}case"fire-dom-event":Tt(e,"ll-custom",s)}})(e,t,o,i)})(this,this.hass,{entity:o,tap_action:t,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},e)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const e=je(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?.managed_covers[0]}_stop(e){e.stopPropagation()}};to.styles=r`
    :host {
      display: block;
    }
    ha-card {
      padding: 6px 10px;
      overflow: hidden;
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
    .empty {
      padding: 12px;
      text-align: center;
    }
    .dim {
      color: var(--secondary-text-color);
      margin: 0;
    }
  `,e([_e({attribute:!1})],to.prototype,"hass",void 0),e([ge()],to.prototype,"_config",void 0),e([ge()],to.prototype,"_registry",void 0),e([ge()],to.prototype,"_registryError",void 0),e([ge()],to.prototype,"_dialogOpen",void 0),to=e([he($e)],to),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===$e)||window.customCards.push({type:$e,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const oo=[{key:"sky",labelKey:"editor.main.section_sky_label",descKey:"editor.main.section_sky_desc"},{key:"elevation",labelKey:"editor.main.section_elevation_label",descKey:"editor.main.section_elevation_desc"},{key:"decision",labelKey:"editor.main.section_decision_label",descKey:"editor.main.section_decision_desc"},{key:"covers",labelKey:"editor.main.section_covers_label",descKey:"editor.main.section_covers_desc"},{key:"overrides",labelKey:"editor.main.section_overrides_label",descKey:"editor.main.section_overrides_desc"},{key:"climate",labelKey:"editor.main.section_climate_label",descKey:"editor.main.section_climate_desc"}],so=oo.map(e=>e.key);let io=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Yt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??so}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_onEntryChange(e){const t=e.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:t})}_onSectionToggle(e,t){const o=new Set(this._currentSections);t?o.add(e):o.delete(e);const s=oo.map(e=>e.key).filter(e=>o.has(e));this._emit({...this._config??{type:"",entry_id:""},show_sections:s})}_onCompactToggle(e){this._emit({...this._config??{type:"",entry_id:""},compact:e})}_onCompassStatsToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:e})}_onCompassLegendToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:e})}_onMoonToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_moon:e})}_onHideInactiveToggle(e){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:e})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),o=Number.isFinite(t)?t:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:o})}_onControlToggle(e,t){const o=this._config??{type:"",entry_id:""};this._emit({...o,controls:{...o.controls,[e]:t}})}render(){if(!this._config)return K;const e=new Set(this._currentSections);return W`
      <div class="form">
        <div class="section">
          <label class="field-label">${Le("editor.common.entry_id",this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${Le("editor.main.sections",this.hass)}</label>
          <div class="hint">${Le("editor.main.sections_hint",this.hass)}</div>
          ${oo.map(t=>W`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${e.has(t.key)}
                  @change=${e=>this._onSectionToggle(t.key,e.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${Le(t.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${Le(t.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${Le("editor.main.controls",this.hass)}</label>
          <div class="hint">${Le("editor.main.controls_hint",this.hass)}</div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.integration_enabled??!0}
              @change=${e=>this._onControlToggle("integration_enabled",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${Le("editor.main.integration_pill_label",this.hass)}</span
              >
              <span class="toggle-desc">${Le("editor.main.integration_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.automatic_control??!0}
              @change=${e=>this._onControlToggle("automatic_control",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Le("editor.main.automatic_pill_label",this.hass)}</span>
              <span class="toggle-desc">${Le("editor.main.automatic_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.reset_manual_override??!0}
              @change=${e=>this._onControlToggle("reset_manual_override",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Le("editor.main.reset_button_label",this.hass)}</span>
              <span class="toggle-desc">${Le("editor.main.reset_button_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">${Le("editor.main.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${e=>this._onCompactToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Le("editor.main.compact_label",this.hass)}</span>
              <span class="toggle-desc">${Le("editor.main.compact_desc",this.hass)}</span>
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
                >${Le("editor.main.show_compass_stats_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${Le("editor.main.show_compass_stats_desc",this.hass)}</span
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
                >${Le("editor.main.show_compass_legend_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${Le("editor.main.show_compass_legend_desc",this.hass)}</span
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
              <span class="toggle-label">${Le("editor.main.show_moon_label",this.hass)}</span>
              <span class="toggle-desc">${Le("editor.main.show_moon_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.hide_inactive_handlers??!1}
              @change=${e=>this._onHideInactiveToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Le("editor.main.hide_inactive_label",this.hass)}</span>
              <span class="toggle-desc">${Le("editor.main.hide_inactive_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">${Le("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${Le("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        <div class="version-footer dim">
          ${Le("root.footer_version",this.hass,{version:me})}
        </div>
      </div>
    `}_renderEntryPicker(){return this._entriesError?W`
        <div class="error">
          ${Le("editor.common.load_failed",this.hass,{error:this._entriesError})}
        </div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder=${Le("editor.common.entry_id_manual_placeholder",this.hass)}
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?W`
        <div class="error">
          ${Le("editor.common.no_entries",this.hass)}
          <code>${Le("editor.common.no_entries_path",this.hass)}</code>${Le("editor.common.no_entries_then",this.hass)}
        </div>
      `:W`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(e=>e.entry_id===this._config.entry_id)?W`<option value=${this._config.entry_id}>
              ${Le("editor.common.unknown_entry",this.hass,{entry:this._config.entry_id})}
            </option>`:K}
        ${this._entries.map(e=>W`
            <option value=${e.entry_id} ?selected=${e.entry_id===this._config?.entry_id}>
              ${e.title}
            </option>
          `)}
      </select>
    `:W`<div class="hint">${Le("editor.common.loading_entries",this.hass)}</div>`}};io.styles=r`
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
    .version-footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `,e([_e({attribute:!1})],io.prototype,"hass",void 0),e([ge()],io.prototype,"_config",void 0),e([ge()],io.prototype,"_entries",void 0),e([ge()],io.prototype,"_entriesError",void 0),io=e([he(fe)],io);const no=[{key:"compact",labelKey:"editor.compass.toggle_compact_label",descKey:"editor.compass.toggle_compact_desc",defaultOn:!1},{key:"show_legend",labelKey:"editor.compass.toggle_legend_label",descKey:"editor.compass.toggle_legend_desc",defaultOn:!0},{key:"show_stats",labelKey:"editor.compass.toggle_stats_label",descKey:"editor.compass.toggle_stats_desc",defaultOn:!0},{key:"show_moon",labelKey:"editor.compass.toggle_moon_label",descKey:"editor.compass.toggle_moon_desc",defaultOn:!1},{key:"show_cardinals",labelKey:"editor.compass.toggle_cardinals_label",descKey:"editor.compass.toggle_cardinals_desc",defaultOn:!0},{key:"show_blind_spot",labelKey:"editor.compass.toggle_blind_spot_label",descKey:"editor.compass.toggle_blind_spot_desc",defaultOn:!0},{key:"show_sun_path",labelKey:"editor.compass.toggle_sun_path_label",descKey:"editor.compass.toggle_sun_path_desc",defaultOn:!0},{key:"show_sunrise_sunset",labelKey:"editor.compass.toggle_sunrise_sunset_label",descKey:"editor.compass.toggle_sunrise_sunset_desc",defaultOn:!0},{key:"show_cover_fill",labelKey:"editor.compass.toggle_cover_fill_label",descKey:"editor.compass.toggle_cover_fill_desc",defaultOn:!0},{key:"show_window_arrow",labelKey:"editor.compass.toggle_window_arrow_label",descKey:"editor.compass.toggle_window_arrow_desc",defaultOn:!0}];let ro=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Yt(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${ye}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let o=0;o<e.length;o++)e[o]&&(t=o);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,o){const s=this._trimColors(t),{cover_colors:i,...n}=e,r=s?{...n,...o,cover_colors:s}:{...n,...o};this._emit(r)}_onCoverColorChange(e,t){const o=this._baseConfig(),s=[...o.cover_colors??[]];for(;s.length<=e;)s.push(null);s[e]=t,this._emitWithColors(o,s)}_onCoverColorReset(e){const t=this._baseConfig(),o=[...t.cover_colors??[]];e<o.length&&(o[e]=null),this._emitWithColors(t,o)}_onEntryToggle(e,t){const o=this._baseConfig(),s=new Set(o.entry_ids);t?s.add(e):s.delete(e);const i=(this._entries??[]).map(e=>e.entry_id).filter(e=>s.has(e)),n=o.cover_colors??[],r=i.map(e=>{const t=o.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(o,r,{entry_ids:i})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),o=Number.isFinite(t)?t:0;this._emit({...this._baseConfig(),north_offset:o})}_onTitleChange(e){const t=e.target.value,o=this._baseConfig();if(t)this._emit({...o,title:t});else{const{title:e,...t}=o;this._emit(t)}}render(){if(!this._config)return K;const e=new Set(this._config.entry_ids);return W`
      <div class="form">
        <div class="section">
          <label class="field-label">${Le("editor.compass.instances",this.hass)}</label>
          <div class="hint">${Le("editor.compass.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(e)}
        </div>

        <div class="section">
          <label class="field-label">${Le("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${Le("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?W`
              <div class="section">
                <label class="field-label">${Le("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${Le("editor.compass.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const o=this._config.cover_colors?.[t]??null,s=o??wt(t),i=this._entries?.find(t=>t.entry_id===e);return W`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${s}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${i?.title??e}</span>
                        <span class="toggle-desc"
                          >${o||Le("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!o}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${Le("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:K}

        <div class="section">
          <label class="field-label">${Le("editor.compass.display",this.hass)}</label>
          ${no.map(e=>W`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${this._config[e.key]??e.defaultOn}
                  @change=${t=>this._onToggle(e.key,t.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${Le(e.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${Le(e.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${Le("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${Le("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        <div class="version-footer dim">
          ${Le("root.footer_version",this.hass,{version:me})}
        </div>
      </div>
    `}_renderEntryPicker(e){return this._entriesError?W`<div class="error">
        ${Le("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?W`
        <div class="error">
          ${Le("editor.common.no_entries",this.hass)}
          <code>${Le("editor.common.no_entries_path",this.hass)}</code>${Le("editor.common.no_entries_then",this.hass)}
        </div>
      `:W`
      <div class="entry-list">
        ${this._entries.map(t=>W`
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
    `:W`<div class="hint">${Le("editor.common.loading_entries",this.hass)}</div>`}};ro.styles=r`
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
  `,e([_e({attribute:!1})],ro.prototype,"hass",void 0),e([ge()],ro.prototype,"_config",void 0),e([ge()],ro.prototype,"_entries",void 0),e([ge()],ro.prototype,"_entriesError",void 0),ro=e([he(be)],ro);let ao=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");this._config={...e,entry_ids:[...e.entry_ids]}}getCardSize(){return 4}static async getConfigElement(){return document.createElement(be)}static getStubConfig(){return{type:`custom:${ye}`,entry_ids:[]}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ye(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Ze(this.hass).then(e=>{this._registry=e,this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return K;if(null===this._registry)return W`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Le("tile.registry_failed",this.hass,{error:this._registryError}):Le("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=[],t=[];for(const o of this._config.entry_ids){const s=je(this.hass,{type:this._config.type,entry_id:o},this._registry);s?e.push(s):t.push(o)}if(0===e.length)return W`<ha-card>
        <div class="empty">
          <p><strong>${Le("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${Le("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const o=this._config;return W`
      <ha-card>
        ${o.title?W`<div class="card-header">${o.title}</div>`:K}
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
          .northOffsetDeg=${Be(o.north_offset??0)}
        ></acp-sky-compass>
        ${t.length>0?W`<div class="warn dim">
              ${Le("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:K}
      </ha-card>
    `}};ao.styles=r`
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
  `,e([_e({attribute:!1})],ao.prototype,"hass",void 0),e([ge()],ao.prototype,"_config",void 0),e([ge()],ao.prototype,"_registry",void 0),e([ge()],ao.prototype,"_registryError",void 0),ao=e([he(ye)],ao),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ye)||window.customCards.push({type:ye,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const lo=["sky","elevation","decision","covers","overrides","climate"];let co=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let e=null,t=null;return(o,s,i)=>{const n=s.entry_id??"";return null!==e&&e.registry===i&&e.hass===o&&e.entryId===n||(e={registry:i,hass:o,entryId:n},t=je(o,s,i)),t}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(e){if(!e?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...e},null===this._registry){const t=Je.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(fe)}static getStubConfig(){return{type:`custom:${ve}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(e){null!==this._registry&&this._config&&this.hass&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ye(this.hass,e=>{const t=new Set(et(this._registry??[],this._config?.entry_id??"").map(e=>e.entity_id));(function(e,t){return"create"===e.action||t.has(e.entity_id)})(e,t)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Ze(this.hass).then(e=>{const t=this._config?.entry_id;if(t){const o=et(e,t);(null===this._registry||function(e,t){if(e.length!==t.length)return!0;const o=new Map(e.map(e=>[e.entity_id,Qe(e)]));for(const e of t)if(o.get(e.entity_id)!==Qe(e))return!0;return!1}(et(this._registry,t),o))&&(this._registry=e,Je.set(t,o))}else this._registry=e;this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const e=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=e);const t=e-this._debounceFirstAt,o=this._DEBOUNCE_MAX-t,s=Math.min(this._DEBOUNCE_DELAY,o);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),s<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},s)}get _sections(){return this._config?.show_sections??lo}_renderHeader(e,t){const o=Ae[e.cover_type]??"mdi:window-shutter",s=e.entities.integration_enabled_switch,i=e.entities.automatic_control_switch,n=!s||"on"===this.hass.states[s]?.state,r=!i||"on"===this.hass.states[i]?.state;return W`
      <div class="header">
        <ha-icon .icon=${o}></ha-icon>
        <span class="title">${e.entry_title}</span>
        <span class="spacer"></span>
        ${s?W`<acp-header-pill
              .on=${n}
              .readonly=${!t.integration_enabled}
              .label=${Le(n?"header.on":"header.off",this.hass)}
              title=${Le("header.integration_enabled",this.hass)}
              @pill-click=${()=>this._toggle(s)}
            ></acp-header-pill>`:K}
        ${i?W`<acp-header-pill
              .on=${r}
              .readonly=${!t.automatic_control}
              .label=${Le("header.auto",this.hass)}
              title=${Le("header.automatic_control",this.hass)}
              @pill-click=${()=>this._toggle(i)}
            ></acp-header-pill>`:K}
      </div>
    `}_toggle(e){const t=e.split(".")[0];this.hass.callService(t,"toggle",{entity_id:e})}_renderLoading(){return W`
      <ha-card>
        <div class="empty">
          <p class="dim">${Le("root.loading_registry",this.hass)}</p>
        </div>
      </ha-card>
    `}_renderEmpty(e){const t=this._config.entry_id,o=this._registry?.length??0,s=this._registry?.filter(e=>e.config_entry_id===t&&"adaptive_cover_pro"===e.platform).length;return W`
      <ha-card>
        <div class="empty">
          <p><strong>${Le("root.no_entities_title",this.hass)}</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${t}</code></p>
          <ul class="diag">
            <li>Reason: <code>${e}</code></li>
            <li>Registry entries loaded: <code>${o}</code></li>
            <li>ACP entities matching entry_id: <code>${s??"—"}</code></li>
            ${this._registryError?W`<li>Registry fetch error: <code>${this._registryError}</code></li>`:K}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return K;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const e=this._discovered;if(!e)return this._renderEmpty("no matching entities after unique_id lookup");const t=(o=this._config,{...Ie,...o?.controls});var o;const s=this._sections;return W`
      <ha-card>
        ${this._renderHeader(e,t)}
        <div class="body ${this._config.compact?"compact":""}">
          ${s.includes("sky")?W`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${[e]}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .northOffsetDeg=${Be(this._config.north_offset??0)}
              ></acp-sky-compass>`:K}
          ${s.includes("elevation")?W`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:K}
          ${s.includes("decision")?W`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                ?show-summary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:K}
          ${s.includes("covers")?W`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:K}
          ${s.includes("overrides")?W`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .resetEnabled=${t.reset_manual_override}
              ></acp-overrides-panel>`:K}
          ${s.includes("climate")?W`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:K}
        </div>
      </ha-card>
    `}};co.styles=r`
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
  `,e([_e({attribute:!1})],co.prototype,"hass",void 0),e([ge()],co.prototype,"_config",void 0),e([ge()],co.prototype,"_registry",void 0),e([ge()],co.prototype,"_registryError",void 0),e([ge()],co.prototype,"_discovered",void 0),co=e([he(ve)],co),window.customCards=window.customCards||[],window.customCards.push({type:ve,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${me} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{co as AdaptiveCoverProCard};
