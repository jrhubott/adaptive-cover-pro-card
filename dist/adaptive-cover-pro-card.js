/*! adaptive-cover-pro-card v2.3.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function e(e,t,o,i){var s,n=arguments.length,r=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,o=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&s.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,o,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new n(o,e,i)},a=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",v=_.reactiveElementPolyfillSupport,f=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},b=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,o){const{get:i,set:s}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);s?.call(this,t),this.requestUpdate(e,n,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(o)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const o of i){const i=document.createElement("style"),s=t.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=o.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(void 0!==i&&!0===o.reflect){const s=(void 0!==o.converter?.toAttribute?o.converter:y).toAttribute(t,o.type);this._$Em=e,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){const o=this.constructor,i=o._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=o.getPropertyOptions(i),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const n=s.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,o,i=!1,s){if(void 0!==e){const n=this.constructor;if(!1===i&&(s=this[e]),o??=n.getPropertyOptions(e),!((o.hasChanged??b)(s,t)||o.useDefault&&o.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:i,wrapped:s},n){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,o,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,v?.({ReactiveElement:$}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=e=>e,C=x.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,P=`<${z}>`,O=document,M=()=>O.createComment(""),F=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,I="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,L=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,B=/"/g,q=/^(?:script|style|textarea|title)$/i,U=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),H=U(1),W=U(2),K=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),G=new WeakMap,Z=O.createTreeWalker(O,129);function X(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const J=(e,t)=>{const o=e.length-1,i=[];let s,n=2===t?"<svg>":3===t?"<math>":"",r=N;for(let t=0;t<o;t++){const o=e[t];let a,l,c=-1,d=0;for(;d<o.length&&(r.lastIndex=d,l=r.exec(o),null!==l);)d=r.lastIndex,r===N?"!--"===l[1]?r=R:void 0!==l[1]?r=D:void 0!==l[2]?(q.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=s??N,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?L:'"'===l[3]?B:j):r===B||r===j?r=L:r===R||r===D?r=N:(r=L,s=void 0);const h=r===L&&e[t+1].startsWith("/>")?" ":"";n+=r===N?o+P:c>=0?(i.push(a),o.slice(0,c)+A+o.slice(c)+E+h):o+E+(-2===c?t:h)}return[X(e,n+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Y{constructor({strings:e,_$litType$:t},o){let i;this.parts=[];let s=0,n=0;const r=e.length-1,a=this.parts,[l,c]=J(e,t);if(this.el=Y.createElement(l,o),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Z.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(A)){const t=c[n++],o=i.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:s,name:r[2],strings:o,ctor:"."===r[1]?ie:"?"===r[1]?se:"@"===r[1]?ne:oe}),i.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:s}),i.removeAttribute(e));if(q.test(i.tagName)){const e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=C?C.emptyScript:"";for(let o=0;o<t;o++)i.append(e[o],M()),Z.nextNode(),a.push({type:2,index:++s});i.append(e[t],M())}}}else if(8===i.nodeType)if(i.data===z)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=i.data.indexOf(E,e+1));)a.push({type:7,index:s}),e+=E.length-1}s++}}static createElement(e,t){const o=O.createElement("template");return o.innerHTML=e,o}}function Q(e,t,o=e,i){if(t===K)return t;let s=void 0!==i?o._$Co?.[i]:o._$Cl;const n=F(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,o,i)),void 0!==i?(o._$Co??=[])[i]=s:o._$Cl=s),void 0!==s&&(t=Q(e,s._$AS(e,t.values),s,i)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,i=(e?.creationScope??O).importNode(t,!0);Z.currentNode=i;let s=Z.nextNode(),n=0,r=0,a=o[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new te(s,s.nextSibling,this,e):1===a.type?t=new a.ctor(s,a.name,a.strings,this,e):6===a.type&&(t=new re(s,this,e)),this._$AV.push(t),a=o[++r]}n!==a?.index&&(s=Z.nextNode(),n++)}return Z.currentNode=O,i}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),F(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==K&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,i="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=Y.createElement(X(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ee(i,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new Y(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,i=0;for(const s of e)i===t.length?t.push(o=new te(this.O(M()),this.O(M()),this,this.options)):o=t[i],o._$AI(s),i++;i<t.length&&(this._$AR(o&&o._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class oe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,i,s){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=V}_$AI(e,t=this,o,i){const s=this.strings;let n=!1;if(void 0===s)e=Q(this,e,t,0),n=!F(e)||e!==this._$AH&&e!==K,n&&(this._$AH=e);else{const i=e;let r,a;for(e=s[0],r=0;r<s.length-1;r++)a=Q(this,i[o+r],t,r),a===K&&(a=this._$AH[r]),n||=!F(a)||a!==this._$AH[r],a===V?e=V:e!==V&&(e+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!i&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends oe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class se extends oe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class ne extends oe{constructor(e,t,o,i,s){super(e,t,o,i,s),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??V)===K)return;const o=this._$AH,i=e===V&&o!==V||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==V&&(o===V||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const ae=x.litHtmlPolyfillSupport;ae?.(Y,te),(x.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const i=o?.renderBefore??t;let s=i._$litPart$;if(void 0===s){const e=o?.renderBefore??null;i._$litPart$=s=new te(t.insertBefore(M(),e),e,void 0,o??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ue=(e=pe,t,o)=>{const{kind:i,metadata:s}=o;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(o.name,e),"accessor"===i){const{name:i}=o;return{set(o){const s=t.get.call(this);t.set.call(this,o),this.requestUpdate(i,s,e,!0,o)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=o;return function(o){const s=this[i];t.call(this,o),this.requestUpdate(i,s,e,!0,o)}}throw Error("Unsupported decorator location: "+i)};function _e(e){return(t,o)=>"object"==typeof o?ue(e,t,o):((e,t,o)=>{const i=t.hasOwnProperty(o);return t.constructor.createProperty(o,e),i?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}function ge(e){return _e({...e,state:!0,attribute:!1})}const me="2.3.0",ve="adaptive-cover-pro-card",fe="adaptive-cover-pro-card-editor",ye="adaptive-cover-pro-sky-compass-card",be="adaptive-cover-pro-sky-compass-card-editor",we="adaptive-cover-pro-tile-card",$e="adaptive-cover-pro-tile-card-editor",xe="adaptive_cover_pro",ke=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default","floor_clamp"],Ce={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},Se={force:"handler.force",weather:"handler.weather",manual:"handler.manual",custom_position:"handler.custom_position",motion:"handler.motion",cloud:"handler.cloud",climate:"handler.climate",glare_zone:"handler.glare_zone",solar:"handler.solar",default:"handler.default",floor_clamp:"handler.floor_clamp"},Ae={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},Ee={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open"},ze={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds"},Pe={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion"},Oe={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Solar tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Motion",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"}},Me={auto:"badge.auto",manual:"badge.manual",force:"badge.force",weather:"badge.weather",glare_zone:"badge.glare_zone",climate:"badge.climate",cloud:"badge.cloud",custom_position:"badge.custom_position",solar:"badge.solar",motion:"badge.motion",off:"badge.off"},Fe={auto:"mdi:autorenew",manual:"mdi:hand-back-right",force:"mdi:flash",weather:"mdi:shield-sun",glare_zone:"mdi:weather-sunny-alert",climate:"mdi:thermostat",cloud:"mdi:weather-cloudy",custom_position:"mdi:bookmark",solar:"mdi:white-balance-sunny",motion:"mdi:motion-sensor",off:"mdi:power"},Te={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Ie={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"},Ne={en:{handler:{force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Weather safety",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Solar tracking",motion:"Motion idle",off:"Off",floor_suffix:" ↥"},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window field of view",fov_exit:"Sun leaves window field of view"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks.",solar_only_note:"Solar geometry only — does not reflect manual overrides, custom positions, cloud suppression, or weather."},dialog:{configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"↥",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Motion",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Motion",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"expires in {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance"},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in FOV",in_fov:"in FOV",none:"—",sun:"Sun",moon:"Moon",sun_hitting:"Sun (hitting window)",sun_up_not_hitting:"Sun (up, not hitting)",sun_below_horizon:"Sun (below horizon)",window_fov:"Window FOV",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_closed:"Cover closed",window_normal:"Window normal",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"FOV {left} left / {right} right{elev}",window_normal_tooltip:"Window normal: {bearing}",cover_extended:"Cover extended: {pct}%",cover_closed_tooltip:"Cover closed: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",click_to_set:"Click to set position",target_tooltip:"Target {pct}%"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor"},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Motion timeout pending",motion_detected:"Motion detected",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found."},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"FOV: {from} → {to}",fov_windows:"FOV: {windows}",fov_window_named:"{name}: {windows}",no_fov_today:"Sun does not enter FOV today",placeholder:"Sun elevation chart unavailable."},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",support_alt:"Buy me a coffee",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window FOV, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with FOV band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, motion tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Solar tracking",badge_force:"Force override",badge_weather:"Weather safety",badge_manual:"Manual override",badge_custom_position:"Custom position",badge_motion:"Motion",badge_climate:"Climate",badge_glare_zone:"Glare zone",badge_cloud:"Cloud suppression",show_compass:"Show sun compass in dialog",show_elevation_chart:"Show sun-today chart in dialog",show_motion_icon:"Show motion indicator",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth.",toggle_elevation_chart_label:"Sun-today chart",toggle_elevation_chart_desc:"Elevation-vs-time chart below the compass, with FOV band and elevation limits."}}},fr:{handler:{force:"Dérogation forcée",weather:"Sécurité météo",manual:"Dérogation manuelle",custom_position:"Position personnalisée",motion:"Délai d'inactivité du mouvement",cloud:"Désactivation par temps nuageux",climate:"Climatique",glare_zone:"Zone d'éblouissement",solar:"Suivi solaire",default:"Par défaut",floor_clamp:"Plancher"},badge:{auto:"Auto",manual:"Manuel",force:"Forcé",weather:"Sécurité météo",glare_zone:"Éblouissement",climate:"Climatique",cloud:"Nuageux",custom_position:"Personnalisé",solar:"Suivi solaire",motion:"Inactivité",off:"Off",floor_suffix:" ↥"},forecast:{event:{sunrise:"Lever du soleil",sunset:"Coucher du soleil",fov_enter:"Le soleil entre dans le champ de vision de la fenêtre",fov_exit:"Le soleil quitte le champ de vision de la fenêtre"},hover_hint:"Survolez la courbe pour voir l'heure et la position prévue ; survolez une ligne colorée pour voir l'événement qu'elle indique.",solar_only_note:"Géométrie solaire uniquement — ne tient pas compte des dérogations manuelles, des positions personnalisées, de la désactivation par temps nuageux ni des conditions météo."},dialog:{configure_integration:"Configurer l'intégration",open_device_page:"Ouvrir la page de l'appareil",close:"Fermer",target:"Cible",resume_auto:"Reprendre l'automatique",hide_advanced:"▼ Masquer les options avancées",show_advanced:"▶ Afficher les options avancées",custom_positions:"Positions personnalisées",floor_tooltip:"Plancher — cette valeur force une position minimale au-dessus du calcul automatique",floor:"↥",disable_slot:"Désactiver le créneau {slot}",enable_slot:"Activer le créneau {slot}",on:"Activé",off:"Désactivé",controls:"Commandes",automatic:"Automatique",climate:"Climatique",motion:"Mouvement",toggle_hint:"{label} {state} — appuyez pour basculer",state_on:"activé",state_off:"désactivé",todays_forecast:"Prévisions du jour"},overrides:{title:"Dérogations",manual:"Manuel",force:"Forcé",motion:"Mouvement",active:"Actif",off:"Désactivé",ends_in:"se termine dans {time}",active_count:"{count} dérogation(s) active(s)",timeout:"expire dans {time}",reset_manual:"Réinitialiser le mode manuel"},climate:{title:"Climatique",active:"Actif : {strategy}",indoor:"Intérieur",outdoor:"Extérieur",presence:"Présence",sunny:"Ensoleillé",lux:"Lux",irradiance:"Irradiance"},compass:{placeholder_no_entries:"Aucune instance Adaptive Cover Pro sélectionnée.",placeholder_no_sun:"Le capteur solaire n'est pas encore renseigné.",sun_tooltip:"Soleil : {az} az / {el} él",sunrise_tooltip:"Lever du soleil : {time}",sunset_tooltip:"Coucher du soleil : {time}",moon_tooltip:"Lune : {phase} ({pct}%)",sun_path_tooltip:"Trajectoire solaire (aujourd'hui)",in_fov_check:"✓ dans le champ de vision",in_fov:"dans le champ de vision",none:"—",sun:"Soleil",moon:"Lune",sun_hitting:"Soleil (frappe la fenêtre)",sun_up_not_hitting:"Soleil (levé, ne frappe pas)",sun_below_horizon:"Soleil (sous l’horizon)",window_fov:"Champ de vision",sun_path:"Trajectoire solaire",sunrise:"Lever du soleil",sunset:"Coucher du soleil",cover_closed:"Store fermé",window_normal:"Axe de la fenêtre",stat_sun:"Soleil : ",stat_azi:"Azi : ",stat_elev:"Élév : ",stat_window:"Fenêtre : ",active_sun_arc:"Arc solaire actif {from} – {to}{elev}",fov_arc:"Champ de vision {left} gauche / {right} droite{elev}",window_normal_tooltip:"Axe de la fenêtre : {bearing}",cover_extended:"Store déployé : {pct}%",cover_closed_tooltip:"Store fermé : {pct}%",blind_spot:"Soleil masqué : {from} - {to}",elev_suffix:" · élév {min}–{max}"},covers:{placeholder:"Aucun store signalé par l'intégration.",title:"Stores",target:"Cible : {pct}",click_to_set:"Cliquer pour définir la position",target_tooltip:"Cible {pct}%"},decision:{placeholder:"La trace de décision n'est pas encore renseignée.",pipeline:"Pipeline",winner:"Actif : {name}",summary_tooltip:"Pourquoi cette position ?",not_evaluated:"non évalué",floor_suffix:" plancher"},header:{on:"ON",off:"OFF",integration_enabled:"Intégration activée",auto:"Auto",automatic_control:"Contrôle automatique"},tile:{motion_pending:"Délai de mouvement en cours",motion_detected:"Mouvement détecté",open:"Ouvrir",stop:"Arrêter",close:"Fermer",resume_aria:"Reprendre le contrôle automatique",registry_failed:"Échec de la récupération du registre : {error}",loading:"Chargement…",entry_not_found:"Instance Adaptive Cover Pro {entry} introuvable."},formatters:{expired:"expiré"},elevation:{title:"Soleil aujourd'hui",fov_window:"Champ de vision : {from} → {to}",fov_windows:"Champ de vision : {windows}",fov_window_named:"{name} : {windows}",no_fov_today:"Pas de soleil dans le champ de vision aujourd'hui",placeholder:"Graphique d'élévation solaire indisponible."},root:{loading_registry:"Chargement du registre Adaptive Cover Pro…",no_entities_title:"Aucune entité Adaptive Cover Pro trouvée",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Aucune entité Adaptive Cover Pro correspondante",compass_configured:"Instances configurées : {entries}",compass_not_found:"Instances introuvables : {entries}"},editor:{common:{entry_id:"Instance Adaptive Cover Pro",support_alt:"Offrez-moi un café",title_optional:"Titre (facultatif)",title_placeholder:"ex. Fenêtres côté ouest",north_offset:"Décalage nord de la boussole (°)",north_offset_hint:"Faites pivoter la boussole dans le sens horaire pour que « haut » corresponde à votre carte. Par défaut : 0.",loading_entries:"Chargement des entrées de configuration Adaptive Cover Pro…",load_failed:"Échec du chargement des entrées de configuration : {error}",no_entries:"Aucune entrée de configuration Adaptive Cover Pro trouvée. Ajoutez une instance sous",no_entries_path:"Paramètres → Appareils et services",no_entries_then:", puis revenez ici.",entry_id_manual_placeholder:"Saisir manuellement l'ID d'entrée de configuration",entry_id_fallback_label:"ID d'entrée",unknown_entry:"(inconnu : {entry})",reset:"Réinitialiser"},main:{sections:"Sections",sections_hint:"Activer ou désactiver les parties de la carte affichées.",section_sky_label:"Boussole céleste",section_sky_desc:"Soleil par rapport au champ de vision de la fenêtre, tracé polaire",section_elevation_label:"Soleil aujourd'hui",section_elevation_desc:"Graphique élévation/temps avec bande FOV et curseur temps réel",section_decision_label:"Bande de décision",section_decision_desc:"Les 10 gestionnaires du pipeline avec la ligne gagnante mise en évidence",section_covers_label:"Positions des stores",section_covers_desc:"Barres position réelle/cible par store ; cliquer pour définir la position",section_overrides_label:"Panneau des dérogations",section_overrides_desc:"Tuiles Manuel, Forcé, Mouvement + bouton de réinitialisation",section_climate_label:"Panneau climatique",section_climate_desc:"Stratégie été/hiver/intermédiaire (masqué automatiquement si le mode climatique est désactivé)",controls:"Commandes",controls_hint:"Afficher en lecture seule (visible mais non cliquable).",integration_pill_label:"Bouton ON/OFF de l'intégration",integration_pill_desc:"Permettre de basculer l'intégration depuis l'en-tête de la carte.",automatic_pill_label:"Bouton contrôle automatique",automatic_pill_desc:"Permettre de basculer le contrôle automatique depuis l'en-tête de la carte.",reset_button_label:"Bouton de réinitialisation de la dérogation manuelle",reset_button_desc:"Permettre d'appuyer sur la tuile de réinitialisation dans le panneau des dérogations.",display:"Affichage",compact_label:"Mode compact",compact_desc:"Espacement réduit entre les sections.",show_compass_stats_label:"Afficher les statistiques de la boussole",show_compass_stats_desc:"Azi, Élév, ∠ et angle de fenêtre sous la boussole céleste.",show_compass_legend_label:"Afficher la légende de la boussole",show_compass_legend_desc:"Clé de couleur sous la boussole céleste.",show_moon_label:"Afficher la lune sur la boussole",show_moon_desc:"Position et phase de la lune en superposition sur la boussole céleste.",hide_inactive_label:"Masquer les gestionnaires inactifs",hide_inactive_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs."},tile:{name:"Titre personnalisé",icon:"Icône personnalisée",cover:"Entité de store",layout:"Disposition",show_position:"Afficher la position %",show_state:"Afficher l'état (Ouvert/Fermé)",show_decision_summary:"Afficher le résumé de décision",show_controls:"Afficher les commandes ↑■▼",show_badge:"Afficher le badge contextuel",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Suivi solaire",badge_force:"Dérogation forcée",badge_weather:"Sécurité météo",badge_manual:"Dérogation manuelle",badge_custom_position:"Position personnalisée",badge_motion:"Mouvement",badge_climate:"Climatique",badge_glare_zone:"Zone d'éblouissement",badge_cloud:"Suppression nuageuse",show_compass:"Afficher la boussole solaire dans le dialogue",show_elevation_chart:"Afficher le graphique du soleil dans le dialogue",show_motion_icon:"Afficher l'indicateur de mouvement",tap_action:"Action au toucher",hold_action:"Action au maintien",double_tap_action:"Action au double toucher",cover_blank_hint:"Laisser vide pour utiliser automatiquement le premier store géré.",layout_option_one_line:"Une ligne (compact)",layout_option_detailed:"Détaillé (titre, état, indicateurs)"},compass:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition à la boussole.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"SVG plus petit, légende masquée.",toggle_legend_label:"Légende",toggle_legend_desc:"Échantillons de couleur et étiquettes d'instance sous la boussole.",toggle_stats_label:"Statistiques",toggle_stats_desc:"Soleil + lignes numériques par fenêtre.",toggle_moon_label:"Lune",toggle_moon_desc:"Afficher la position et la phase de la lune.",toggle_cardinals_label:"Points cardinaux",toggle_cardinals_desc:"Lettres N/E/S/O autour de la boussole.",toggle_blind_spot_label:"Zones de soleil masqué",toggle_blind_spot_desc:"Secteurs hachurés pour la plage où le soleil est masqué de chaque fenêtre.",toggle_sun_path_label:"Trajectoire solaire",toggle_sun_path_desc:"Arc solaire du jour dans le ciel.",toggle_sunrise_sunset_label:"Repères lever / coucher du soleil",toggle_sunrise_sunset_desc:"Petits points aux azimuts de lever et coucher du soleil.",toggle_cover_fill_label:"Remplissage de fermeture du store",toggle_cover_fill_desc:"Secteur intérieur indiquant le taux de fermeture de chaque store.",toggle_window_arrow_label:"Flèche de normale de fenêtre",toggle_window_arrow_desc:"Ligne du centre vers l'azimut de chaque fenêtre.",toggle_elevation_chart_label:"Graphique du soleil",toggle_elevation_chart_desc:"Graphique élévation/temps sous la boussole, avec bande FOV et limites d'élévation."}}}};function Re(e,t){const o=t.split(".");let i=e;for(const e of o){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function De(e,t){return t?e.replace(/\{(\w+)\}/g,(e,o)=>Object.prototype.hasOwnProperty.call(t,o)?String(t[o]):e):e}function Le(e,t,o){const i=function(e){const t=(e?.locale?.language??e?.language??"en").toLowerCase().split("-")[0];return t in Ne?t:"en"}(t),s=Re(Ne[i],e);if(void 0!==s)return De(s,o);if("en"!==i){const t=Re(Ne.en,e);if(void 0!==t)return De(t,o)}return e}function je(e,t,o){const i=t.entry_id;if(!i)return null;const s={},n=`${i}_`;let r,a=!1;for(const e of o){if(e.config_entry_id!==i)continue;if(e.platform!==xe)continue;if(a=!0,!r&&e.device_id&&(r=e.device_id),!e.unique_id.startsWith(n))continue;const t=e.unique_id.slice(n.length),o=e.entity_id.split(".")[0],l=Ie[`${o}:${t}`];l&&(s[l]=e.entity_id)}if(!a||0===Object.keys(s).length)return null;const l=e;let c=i;if(l.devices)for(const e of Object.values(l.devices))if(e.config_entries?.includes(i)){c=e.name_by_user??e.name??i;break}const d=[],h=s.target_position_sensor;if(h){const t=e.states[h]?.attributes?.actual_positions;t&&d.push(...Object.keys(t))}let p="cover_blind";const u=s.control_status_sensor;if(u){const t=e.states[u]?.attributes;t?.cover_type&&(p=t.cover_type)}return{entry_id:i,entry_title:c,cover_type:p,entities:s,managed_covers:d,device_id:r}}async function Be(e){return(await e.callWS({type:"config_entries/get",domain:xe})).filter(e=>e.domain===xe).map(e=>({entry_id:e.entry_id,title:e.title}))}function qe(e,t,o=0){const i=(e-90+o)*Math.PI/180;return{x:t*Math.cos(i),y:t*Math.sin(i)}}function Ue(e){return 1-Math.max(0,Math.min(90,e))/90}function He(e,t,o,i=0,s=0){const n=e=>(e%360+360)%360,r=n(e),a=n(t);let l=a-r;l<0&&(l+=360);const c=l>180?1:0,d=qe(r,o,s),h=qe(a,o,s);if(i<=0)return`M 0 0 L ${d.x} ${d.y} A ${o} ${o} 0 ${c} 1 ${h.x} ${h.y} Z`;const p=qe(a,i,s),u=qe(r,i,s);return[`M ${d.x} ${d.y}`,`A ${o} ${o} 0 ${c} 1 ${h.x} ${h.y}`,`L ${p.x} ${p.y}`,`A ${i} ${i} 0 ${c} 0 ${u.x} ${u.y}`,"Z"].join(" ")}function We(e,t,o=0){return qe(e,Ue(t),o)}function Ke(e){return(e%360+360)%360}function Ve(e,t,o,i){const s=i??0;let n=-1,r=-1;for(let i=t;i<=o&&i<e.length;i++)e[i].elevation>s&&(-1===n&&(n=i),r=i);return-1===n?null:{wedgeStart:e[n].azimuth,wedgeEnd:e[r].azimuth}}function Ge(e,t,o){const i=(e-t)/864e5;return Math.max(0,Math.min(o,i*o))}function Ze(e,t,o){return((e-t)%360+360)%360<=((o-t)%360+360)%360}function Xe(e,t,o,i){return Ze(o,e,t)||Ze(i,e,t)||Ze(e,o,i)||Ze(t,o,i)}async function Je(e){return e.callWS({type:"config/entity_registry/list"})}function Ye(e,t){let o=null,i=!1;return e.connection.subscribeEvents(e=>t(e.data),"entity_registry_updated").then(e=>{i?e():o=e}).catch(()=>{}),()=>{i=!0,o&&o()}}function Qe(e){return`acp-card:registry:v1:${e}`}const et={get(e){try{const t=localStorage.getItem(Qe(e));if(!t)return null;const o=JSON.parse(t);return 1!==o.schemaVersion?null:o}catch{return null}},set(e,t){try{const o={schemaVersion:1,cardVersion:me,fetchedAt:Date.now(),entries:t};localStorage.setItem(Qe(e),JSON.stringify(o))}catch{}},invalidate(e){try{localStorage.removeItem(Qe(e))}catch{}},clear(){try{const e="acp-card:registry:v1:",t=[];for(let o=0;o<localStorage.length;o++){const i=localStorage.key(o);i?.startsWith(e)&&t.push(i)}t.forEach(e=>localStorage.removeItem(e))}catch{}}};function tt(e){return`${e.entity_id}|${e.unique_id}|${e.platform}|${e.config_entry_id??""}`}function ot(e,t,o){return e.filter(e=>e.config_entry_id===t&&void 0===o)}let it=class extends ce{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return H`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":V}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};it.styles=r`
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
  `,e([_e({type:Boolean})],it.prototype,"on",void 0),e([_e({type:Boolean})],it.prototype,"readonly",void 0),e([_e({type:String})],it.prototype,"label",void 0),e([_e({type:String})],it.prototype,"title",void 0),it=e([he("acp-header-pill")],it);class st{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const nt=(rt=class extends st{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const o=e.element.classList;for(const e of this.st)e in t||(o.remove(e),this.st.delete(e));for(const e in t){const i=!!t[e];i===this.st.has(e)||this.nt?.has(e)||(i?(o.add(e),this.st.add(e)):(o.remove(e),this.st.delete(e)))}return K}},(...e)=>({_$litDirective$:rt,values:e}));var rt;function at(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var lt,ct,dt={exports:{}},ht=(lt||(lt=1,ct=dt,function(){var e=Math.PI,t=Math.sin,o=Math.cos,i=Math.tan,s=Math.asin,n=Math.atan2,r=Math.acos,a=e/180,l=864e5,c=2440588,d=2451545;function h(e){return new Date((e+.5-c)*l)}function p(e){return function(e){return e.valueOf()/l-.5+c}(e)-d}var u=23.4397*a;function _(e,s){return n(t(e)*o(u)-i(s)*t(u),o(e))}function g(e,i){return s(t(i)*o(u)+o(i)*t(u)*t(e))}function m(e,s,r){return n(t(e),o(e)*t(s)-i(r)*o(s))}function v(e,i,n){return s(t(i)*t(n)+o(i)*o(n)*o(e))}function f(e,t){return a*(280.16+360.9856235*e)-t}function y(e){return a*(357.5291+.98560028*e)}function b(o){return o+a*(1.9148*t(o)+.02*t(2*o)+3e-4*t(3*o))+102.9372*a+e}function w(e){var t=b(y(e));return{dec:g(t,0),ra:_(t,0)}}var $={getPosition:function(e,t,o){var i=a*-o,s=a*t,n=p(e),r=w(n),l=f(n,i)-r.ra;return{azimuth:m(l,s,r.dec),altitude:v(l,s,r.dec)}}},x=$.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];$.addTime=function(e,t,o){x.push([e,t,o])};var k=9e-4;function C(t,o,i){return k+(t+o)/(2*e)+i}function S(e,o,i){return d+e+.0053*t(o)-.0069*t(2*i)}function A(e,i,s,n,a,l,c){var d=function(e,i,s){return r((t(e)-t(i)*t(s))/(o(i)*o(s)))}(e,s,n);return S(C(d,i,a),l,c)}function E(e){var i=a*(134.963+13.064993*e),s=a*(93.272+13.22935*e),n=a*(218.316+13.176396*e)+6.289*a*t(i),r=5.128*a*t(s),l=385001-20905*o(i);return{ra:_(n,r),dec:g(n,r),dist:l}}function z(e,t){return new Date(e.valueOf()+t*l/24)}$.getTimes=function(t,o,i,s){var n,r,l,c,d,u=a*-i,_=a*o,m=function(e){return-2.076*Math.sqrt(e)/60}(s=s||0),v=function(t,o){return Math.round(t-k-o/(2*e))}(p(t),u),f=C(0,u,v),w=y(f),$=b(w),E=g($,0),z=S(f,w,$),P={solarNoon:h(z),nadir:h(z-.5)};for(n=0,r=x.length;n<r;n+=1)d=z-((c=A(((l=x[n])[0]+m)*a,u,_,E,v,w,$))-z),P[l[1]]=h(d),P[l[2]]=h(c);return P},$.getMoonPosition=function(e,s,r){var l=a*-r,c=a*s,d=p(e),h=E(d),u=f(d,l)-h.ra,_=v(u,c,h.dec),g=n(t(u),i(c)*o(h.dec)-t(h.dec)*o(u));return _+=function(e){return e<0&&(e=0),2967e-7/Math.tan(e+.00312536/(e+.08901179))}(_),{azimuth:m(u,c,h.dec),altitude:_,distance:h.dist,parallacticAngle:g}},$.getMoonIllumination=function(e){var i=p(e||new Date),s=w(i),a=E(i),l=149598e3,c=r(t(s.dec)*t(a.dec)+o(s.dec)*o(a.dec)*o(s.ra-a.ra)),d=n(l*t(c),a.dist-l*o(c)),h=n(o(s.dec)*t(s.ra-a.ra),t(s.dec)*o(a.dec)-o(s.dec)*t(a.dec)*o(s.ra-a.ra));return{fraction:(1+o(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},$.getMoonTimes=function(e,t,o,i){var s=new Date(e);i?s.setUTCHours(0,0,0,0):s.setHours(0,0,0,0);for(var n,r,l,c,d,h,p,u,_,g,m,v,f,y=.133*a,b=$.getMoonPosition(s,t,o).altitude-y,w=1;w<=24&&(n=$.getMoonPosition(z(s,w),t,o).altitude-y,u=((d=(b+(r=$.getMoonPosition(z(s,w+1),t,o).altitude-y))/2-n)*(p=-(h=(r-b)/2)/(2*d))+h)*p+n,g=0,(_=h*h-4*d*n)>=0&&(m=p-(f=Math.sqrt(_)/(2*Math.abs(d))),v=p+f,Math.abs(m)<=1&&g++,Math.abs(v)<=1&&g++,m<-1&&(m=v)),1===g?b<0?l=w+m:c=w+m:2===g&&(l=w+(u<0?v:m),c=w+(u<0?m:v)),!l||!c);w+=2)b=r;var x={};return l&&(x.rise=z(s,l)),c&&(x.set=z(s,c)),l||c||(x[u>0?"alwaysUp":"alwaysDown"]=!0),x},ct.exports=$}()),dt.exports),pt=at(ht);function ut(e,t,o,i=10){const s=[],n=o.getTime()+864e5;for(let r=o.getTime();r<=n;r+=60*i*1e3){const o=new Date(r),i=pt.getPosition(o,e,t);s.push({t:o,elevation:180*i.altitude/Math.PI,azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360})}return s}function _t(e=new Date){const t=new Date(e);return t.setHours(0,0,0,0),t}function gt(e,t=new Date){if(!e)return _t(t);const o=new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(t),[i,s,n]=o.split("-").map(Number),r=Date.UTC(i,s-1,n,0,0,0),a=function(e,t){const o=new Intl.DateTimeFormat("en-US",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(t),i={};for(const e of o)"literal"!==e.type&&(i[e.type]=Number(e.value));return Date.UTC(i.year,i.month-1,i.day,i.hour,i.minute,i.second)-t.getTime()}(e,new Date(r));return new Date(r-a)}function mt(e,t,o,i){const s=((t-o)%360+360)%360;return((e-s)%360+360)%360<=((((t+i)%360+360)%360-s)%360+360)%360}function vt(e,t,o,i){const s=[];let n=-1;for(let r=0;r<e.length;r++){const a=e[r];a.elevation>0&&mt(a.azimuth,t,o,i)?-1===n&&(n=r):-1!==n&&(s.push({startIdx:n,endIdx:r-1}),n=-1)}return-1!==n&&s.push({startIdx:n,endIdx:e.length-1}),s}function ft(e,t,o=new Date){const i=pt.getMoonPosition(o,e,t),s=pt.getMoonIllumination(o);return{azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360,elevation:180*i.altitude/Math.PI,phase:s.phase,fraction:s.fraction,phaseName:yt(s.phase)}}function yt(e){return e<.0625||e>=.9375?"New Moon":e<.1875?"Waxing Crescent":e<.3125?"First Quarter":e<.4375?"Waxing Gibbous":e<.5625?"Full Moon":e<.6875?"Waning Gibbous":e<.8125?"Last Quarter":"Waning Crescent"}function bt(e){return null==e||Number.isNaN(e)?"—":`${Math.round(e)}%`}function wt(e){return null==e||Number.isNaN(e)?"—":`${e.toFixed(1)}°`}function $t(e){if(!e)return"—";const t=new Date(e);return Number.isNaN(t.getTime())?"—":t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function xt(e,t){if(!e)return"—";const o=new Date(e).getTime();if(Number.isNaN(o))return"—";const i=Math.round((o-Date.now())/1e3);return i<=0?t?Le("formatters.expired",t):"expired":function(e){if(null==e||Number.isNaN(e))return"—";const t=Math.max(0,Math.round(e));if(t<60)return`${t}s`;const o=Math.floor(t/60);return o<60?`${o}m ${t%60}s`:`${Math.floor(o/60)}h ${o%60}m`}(i)}const kt=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function Ct(e){const t=kt.length;return kt[(e%t+t)%t]}function St(e,t){return"string"==typeof e&&e.length>0?{color:e,isOverride:!0}:{color:Ct(t),isOverride:!1}}const At=110;let Et=class extends ce{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set}_toggleEntry(e){const t=new Set(this._hiddenEntries);t.has(e)?t.delete(e):t.add(e),this._hiddenEntries=t}_sunFor(e){const t=e.entities.sun_sensor;if(!t)return null;const o=this.hass.states[t];if(!o)return null;const i=parseFloat(o.state);return Number.isNaN(i)?null:{...o.attributes,window_azimuth:o.attributes.window_azimuth}}_coverPositionFor(e){const t=e.entities.target_position_sensor;if(!t)return null;const o=parseFloat(this.hass.states[t]?.state??"");return Number.isNaN(o)?null:o}_sunInfrontFor(e){const t=e.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}_readActiveAzimuth(e){if(!e)return null;const t=this.hass.states[e];if(!t)return null;if("unavailable"===t.state||"unknown"===t.state)return null;const o=t.attributes.azimuth;return"number"==typeof o&&Number.isFinite(o)?o:null}_buildOverlays(){const e=[];return this.discovered_list.forEach((t,o)=>{const i=this._sunFor(t);if(!i)return;const s=t.entities.sun_sensor,n=parseFloat(this.hass.states[s]?.state??"0"),{color:r,isOverride:a}=St(this.coverColors?.[o],o);e.push({d:t,sun:i,sunAzi:n,sunInfront:this._sunInfrontFor(t),coverPos:this._coverPositionFor(t),coverType:t.cover_type,color:r,isOverride:a,index:o})}),e}render(){if(!this.hass)return V;if(!this.discovered_list||0===this.discovered_list.length)return H`<div class="placeholder">${Le("compass.placeholder_no_entries",this.hass)}</div>`;const e=this._buildOverlays();if(0===e.length)return H`<div class="placeholder">${Le("compass.placeholder_no_sun",this.hass)}</div>`;const t=e.filter(e=>!this._hiddenEntries.has(e.d.entry_id)),o=Ke(this.northOffsetDeg),i=e.length>1,s=e[0],n=s.sunAzi,r=s.sun.elevation,a=We(n,r,o),l=e.some(e=>e.sunInfront),c=r<=0?"sun night":l?"sun valid":"sun up",{latitude:d,longitude:h,time_zone:p}=this.hass.config,u=void 0!==d&&void 0!==h?ut(d,h,gt(p)):[],_=this.showMoon&&void 0!==d&&void 0!==h?ft(d,h):null,g=null!==_&&_.elevation>0,m=_?_.phase<.5?-24*_.phase:24*(1-_.phase):0,v=g?We(_.azimuth,_.elevation,o):null,f=v?v.x*At:0,y=v?v.y*At:0,b=this.showSunPath?u.map(e=>{const t=We(e.azimuth,e.elevation,o);return`${(t.x*At).toFixed(1)},${(t.y*At).toFixed(1)}`}).join(" "):"",{riseAzimuth:w,setAzimuth:$}=this.showSunriseSunset?function(e){let t=null,o=null;for(let i=1;i<e.length;i++){const s=e[i-1],n=e[i];s.elevation<=0&&n.elevation>0&&null===t&&(t=n.azimuth),s.elevation>0&&n.elevation<=0&&(o=s.azimuth)}return{riseAzimuth:t,setAzimuth:o}}(u):{riseAzimuth:null,setAzimuth:null},x=null!==w?qe(w,At,o):null,k=null!==$?qe($,At,o):null,C=qe(0,124,o),S=qe(90,124,o),A=qe(180,124,o),E=qe(270,124,o),z=qe(0,At,o),P=qe(180,At,o),O=qe(90,At,o),M=qe(270,At,o),F=Le("compass.sun_tooltip",this.hass,{az:wt(n),el:wt(r)}),T=null!==w?Le("compass.sunrise_tooltip",this.hass,{time:wt(w)}):"",I=null!==$?Le("compass.sunset_tooltip",this.hass,{time:wt($)}):"",N=null!==_?Le("compass.moon_tooltip",this.hass,{phase:_.phaseName,pct:Math.round(100*_.fraction)}):"",R=Le("compass.sun_path_tooltip",this.hass);return H`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${W`
            <defs>
              ${g?W`
                <mask id="moon-phase-mask">
                  <circle cx=${f} cy=${y} r=${6} fill="white"></circle>
                  <circle cx=${f+m} cy=${y} r=${6} fill="black"></circle>
                </mask>
              `:V}
            </defs>

            <circle class="grid" r=${At}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${At/3}></circle>
            <line class="grid thin" x1=${z.x} y1=${z.y} x2=${P.x} y2=${P.y}></line>
            <line class="grid thin" x1=${O.x} y1=${O.y} x2=${M.x} y2=${M.y}></line>

            ${t.map(e=>this._renderEntryLayers(e,i,o,u))}

            ${this.showSunPath&&b?W`<g data-tooltip=${R}><title>${R}</title><polyline class="sun-path" points=${b}></polyline></g>`:V}

            ${this.showSunriseSunset&&x&&null!==w?W`<g data-tooltip=${T}><title>${T}</title><circle class="rise-marker" cx=${x.x} cy=${x.y} r="5"></circle></g>`:V}
            ${this.showSunriseSunset&&k&&null!==$?W`<g data-tooltip=${I}><title>${I}</title><circle class="set-marker" cx=${k.x} cy=${k.y} r="5"></circle></g>`:V}

            ${this.showCardinals?W`
              <text class="cardinal" x=${C.x} y=${C.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${S.x} y=${S.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${A.x} y=${A.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:V}

            ${g?W`
              <g data-tooltip=${N}>
                <title>${N}</title>
                <circle class="moon-outline" cx=${f} cy=${y} r=${6}></circle>
                <circle class="moon-lit" cx=${f} cy=${y} r=${6} mask="url(#moon-phase-mask)"></circle>
              </g>
            `:V}

            <g data-tooltip=${F}>
              <title>${F}</title>
              <circle class=${c} cx=${a.x*At} cy=${a.y*At} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(e,i):V}
        ${this.showStats?this._renderStats(e,i):V}
      </div>
    `}_renderEntryLayers(e,t,o=0,i=[]){const s=Ke(e.sun.window_azimuth),n=Ke(s-e.sun.fov_left),r=Ke(s+e.sun.fov_right),a=this._readActiveAzimuth(e.d.entities.start_sensor),l=this._readActiveAzimuth(e.d.entities.end_sensor),c=null!==a&&null!==l;let d,h;if(c)({wedgeStart:d,wedgeEnd:h}=function(e,t,o,i,s){const n=((o-i)%360+360)%360,r=i+s,a=((t-n)%360+360)%360,l=e=>e<=r?e:e-r<360-e?r:0,c=l(((e-n)%360+360)%360),d=l(a);return c===d?{wedgeStart:n,wedgeEnd:((n+r)%360+360)%360}:{wedgeStart:((n+Math.min(c,d))%360+360)%360,wedgeEnd:((n+Math.max(c,d))%360+360)%360}}(Ke(a),Ke(l),s,e.sun.fov_left,e.sun.fov_right));else{const t=function(e,t,o,i,s){if(void 0===s)return null;const n=Ke(t-o),r=o+i,a=e.filter(e=>((e.azimuth-n)%360+360)%360<=r&&e.elevation>s);return 0===a.length?null:{wedgeStart:a[0].azimuth,wedgeEnd:a[a.length-1].azimuth}}(i,s,e.sun.fov_left,e.sun.fov_right,e.sun.min_elevation);d=t?t.wedgeStart:n,h=t?t.wedgeEnd:r}const p=qe(s,At,o),{outer:u,inner:_}=(g=e.sun.min_elevation,m=e.sun.max_elevation,v=At,void 0!==g&&void 0!==m&&g>m?{outer:v,inner:0}:{outer:void 0!==g?v*Ue(g):v,inner:void 0!==m?v*Ue(m):0});var g,m,v;const f="cover_awning"===e.coverType?e.coverPos/100:1-e.coverPos/100,y=null!==e.coverPos?At*f:null,b=null!==y?Math.min(y,u):null,w=e.sun.blind_spot_range?[Ke(($=s)-(x=e.sun.blind_spot_range)[1]),Ke($-x[0])]:null;var $,x;const k=w?He(w[0],w[1],At,0,o):null,C=He(d,h,u,_,o),S=c&&(d!==n||h!==r),A=S?He(n,r,u,_,o):"",E=null!==b&&b>_?He(d,h,b,_,o):"",z=[];for(const t of vt(i,s,e.sun.fov_left,e.sun.fov_right)){const s=Ve(i,t.startIdx,t.endIdx,e.sun.min_elevation);s&&!Xe(s.wedgeStart,s.wedgeEnd,d,h)&&z.push({fov:He(s.wedgeStart,s.wedgeEnd,u,_,o),cover:this.showCoverFill&&null!==b&&b>_?He(s.wedgeStart,s.wedgeEnd,b,_,o):"",from:s.wedgeStart,to:s.wedgeEnd})}const P=t?`${e.d.entry_title}: `:"",O=void 0!==e.sun.min_elevation||void 0!==e.sun.max_elevation?Le("compass.elev_suffix",this.hass,{min:wt(e.sun.min_elevation??0),max:wt(e.sun.max_elevation??90)}):"",M=c?`${P}${Le("compass.active_sun_arc",this.hass,{from:wt(d),to:wt(h),elev:O})}`:`${P}${Le("compass.fov_arc",this.hass,{left:wt(e.sun.fov_left),right:wt(e.sun.fov_right),elev:O})}`,F=`${P}${Le("compass.window_normal_tooltip",this.hass,{bearing:wt(s)})}`,T=null!==e.coverPos?"cover_awning"===e.coverType?`${P}${Le("compass.cover_extended",this.hass,{pct:e.coverPos})}`:`${P}${Le("compass.cover_closed_tooltip",this.hass,{pct:e.coverPos})}`:"",I=w?`${P}${Le("compass.blind_spot",this.hass,{from:wt(w[0]),to:wt(w[1])})}`:"",N=t||e.isOverride,R=N?`fill: ${e.color}; stroke: ${e.color};`:"",D=N?`fill: ${e.color}; stroke: ${e.color};`:"",L=N?`fill: ${e.color}; stroke: ${e.color};`:"",j=N?`stroke: ${e.color};`:"",B=N?`fill: ${e.color};`:"",q=this.showCoverFill&&""!==E,U=this.showBlindSpot&&!!k,H=this.showWindowArrow,K=`M 0 0 L ${p.x} ${p.y}`,G="display: none;",Z=`${P}${Le("compass.fov_arc",this.hass,{left:wt(e.sun.fov_left),right:wt(e.sun.fov_right),elev:O})}`;return W`<g class="entry-overlay">
      ${S?W`<g data-tooltip=${Z}>
              <title>${Z}</title>
              <path class="fov fov-static" style=${R} d=${A}></path>
            </g>`:V}
      <g data-tooltip=${M}>
        <title>${M}</title>
        <path class="fov" style=${R} d=${C}></path>
      </g>
      ${z.map(e=>{const t=`${P}${Le("compass.active_sun_arc",this.hass,{from:wt(e.from),to:wt(e.to),elev:O})}`;return W`<g data-tooltip=${t}>
          <title>${t}</title>
          <path class="fov-extra" style=${R} d=${e.fov}></path>
          ${e.cover?W`<path class="cover-fill-extra" style=${D} d=${e.cover}></path>`:V}
        </g>`})}
      <g class="arrow-group" data-tooltip=${F} style=${H?"":G}>
        <title>${F}</title>
        <path class="window" style=${j} d=${K}></path>
        <circle class="window-base" style=${B} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" data-tooltip=${T} style=${q?"":G}>
        <title>${T}</title>
        <path class="cover-fill" style=${D} d=${E}></path>
      </g>
      <g class="blind-group" data-tooltip=${I} style=${U?"":G}>
        <title>${I}</title>
        <path class="blind-spot" style=${L} d=${k??""}></path>
      </g>
    </g>`}_renderLegend(e,t){return t?H`
        <div class="legend">
          ${e.map(e=>H`
              <button
                type="button"
                class=${nt({"entry-toggle":!0,hidden:this._hiddenEntries.has(e.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(e.d.entry_id)}
                @click=${()=>this._toggleEntry(e.d.entry_id)}
              >
                <span class="swatch entry" style="background: ${e.color}"></span>
                ${e.d.entry_title}
                ${e.sunInfront?H`<span class="status valid">${Le("compass.in_fov_check",this.hass)}</span>`:e.sun.in_fov?H`<span class="status in-fov">${Le("compass.in_fov",this.hass)}</span>`:H`<span class="status">${Le("compass.none",this.hass)}</span>`}
              </button>
            `)}
          <div><span class="dot sun valid"></span> ${Le("compass.sun",this.hass)}</div>
          ${this.showMoon?H`<div><span class="dot moon-dot"></span> ${Le("compass.moon",this.hass)}</div>`:V}
        </div>
      `:H`<div class="legend">
      <div><span class="dot sun valid"></span> ${Le("compass.sun",this.hass)}</div>
      ${this.showMoon?H`<div><span class="dot moon-dot"></span> ${Le("compass.moon",this.hass)}</div>`:V}
      <div><span class="swatch fov"></span> ${Le("compass.window_fov",this.hass)}</div>
      ${this.showSunPath?H`<div>
            <span class="swatch sun-path-swatch"></span> ${Le("compass.sun_path",this.hass)}
          </div>`:V}
      ${this.showCoverFill?H`<div>
            <span class="swatch cover-fill-swatch"></span> ${Le("compass.cover_closed",this.hass)}
          </div>`:V}
      ${this.showWindowArrow?H`<div>
            <span class="swatch window-swatch"></span> ${Le("compass.window_normal",this.hass)}
          </div>`:V}
    </div>`}_renderStats(e,t){const o=e[0],i=o.sunAzi,s=o.sun.elevation,{latitude:n,longitude:r}=this.hass.config,a=this.showMoon&&void 0!==n&&void 0!==r?ft(n,r):null;return t?H`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${Le("compass.stat_sun",this.hass)}${wt(i)} /
              ${wt(s)}</span
            >
            ${this.showMoon&&a?H`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:V}
          </div>
          ${e.map(e=>H`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${e.color}"></span>
                <span class="entry-name">${e.d.entry_title}</span>
                <span>∠${wt(e.sun.gamma)}</span>
                <span>W ${wt(Ke(e.sun.window_azimuth))}</span>
                ${e.sun.in_fov?H`<span class="status in-fov">✓</span>`:V}
              </div>
            `)}
        </div>
      `:H`<div class="stats dim">
      <span>${Le("compass.stat_azi",this.hass)}${wt(i)}</span>
      <span>${Le("compass.stat_elev",this.hass)}${wt(s)}</span>
      <span>∠: ${wt(o.sun.gamma)}</span>
      <span
        >${Le("compass.stat_window",this.hass)}${wt(Ke(o.sun.window_azimuth))}</span
      >
      ${this.showMoon&&a?H`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:V}
    </div>`}};Et.styles=r`
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
      fill: #ffe680;
    }
    .sun.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 4px var(--warning-color, gold));
    }
    /* Below the horizon: dim amber filled disc — keeps the sun's warm
       identity while reading clearly different from the grey moon disc. */
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
    }
    .dot.moon-dot {
      background: var(--secondary-text-color);
      opacity: 0.6;
    }
    g[data-tooltip] {
      cursor: help;
    }
  `,e([_e({attribute:!1})],Et.prototype,"hass",void 0),e([_e({attribute:!1})],Et.prototype,"discovered_list",void 0),e([_e({type:Boolean,reflect:!0})],Et.prototype,"compact",void 0),e([_e({attribute:!1})],Et.prototype,"showStats",void 0),e([_e({attribute:!1})],Et.prototype,"showLegend",void 0),e([_e({attribute:!1})],Et.prototype,"showMoon",void 0),e([_e({attribute:!1})],Et.prototype,"showCardinals",void 0),e([_e({attribute:!1})],Et.prototype,"showBlindSpot",void 0),e([_e({attribute:!1})],Et.prototype,"showSunPath",void 0),e([_e({attribute:!1})],Et.prototype,"showSunriseSunset",void 0),e([_e({attribute:!1})],Et.prototype,"showCoverFill",void 0),e([_e({attribute:!1})],Et.prototype,"showWindowArrow",void 0),e([_e({attribute:!1})],Et.prototype,"coverColors",void 0),e([_e({attribute:!1})],Et.prototype,"northOffsetDeg",void 0),e([ge()],Et.prototype,"_hiddenEntries",void 0),Et=e([he("acp-sky-compass")],Et);let zt=class extends ce{constructor(){super(...arguments),this.discoveredList=[],this.coverColors=[],this.compact=!1}_sunAttrsFor(e){const t=e.entities.sun_sensor;if(!t)return null;const o=this.hass.states[t];return o?o.attributes:null}_sunInfront(){const e=this.discoveredList[0]?.entities.sun_infront_binary;return!!e&&"on"===this.hass.states[e]?.state}render(){if(!this.hass||0===this.discoveredList.length)return V;const e=this._sunAttrsFor(this.discoveredList[0]),{latitude:t,longitude:o,time_zone:i}=this.hass.config??{};if(void 0===t||void 0===o||!e)return H`<div class="placeholder">${Le("elevation.placeholder",this.hass)}</div>`;const s=gt(i),n=ut(t,o,s),r=new Date,a=e=>32+(e.getTime()-s.getTime())/864e5*360,l=e=>138-(e- -10)/100*128,c=n.map(e=>`${a(e.t).toFixed(1)},${l(e.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(r),p=this._interpAt(n,r),u=p?l(p.elevation):null,_=!p||p.elevation<=0?"night":this._sunInfront()?"valid":"up",g=e=>138-128*e,m=this.discoveredList.length>1,v=this.discoveredList.map((e,t)=>{const o=this._sunAttrsFor(e),{color:i,isOverride:s}=St(this.coverColors?.[t],t),r=s;if(!o)return{d:e,runs:[],inPlotBands:[],runBars:[],label:"",color:i,inlineFill:r};const l=vt(n,o.window_azimuth,o.fov_left,o.fov_right),c="number"==typeof o.min_elevation,d="number"==typeof o.max_elevation,{loFrac:h,hiFrac:p}=function(e,t){if(void 0!==e&&void 0!==t&&e>t)return{loFrac:0,hiFrac:1};const o=e=>Math.max(0,Math.min(1,(e- -10)/100));return{loFrac:void 0!==e?o(e):0,hiFrac:void 0!==t?o(t):1}}(o.min_elevation,o.max_elevation),u=c||d?g(p):10,_=c||d?g(h):138,v=u,f=Math.max(0,_-u),y=l.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),y:v,height:f})),b=l.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),range:`${$t(n[e.startIdx].t.toISOString())} → ${$t(n[e.endIdx].t.toISOString())}`})),w=l.map(e=>`${$t(n[e.startIdx].t.toISOString())} → ${$t(n[e.endIdx].t.toISOString())}`).join(", "),$=[];return m||(c&&$.push(_),d&&$.push(u)),{d:e,runs:l,inPlotBands:y,runBars:b,label:w,color:i,inlineFill:r,limitLines:$}}),f=v.some(e=>e.runs.length>0),y=m?function(e){if(e<=0)return{rows:[],height:0};const t=Array.from({length:e},(e,t)=>({y:6+11*t,height:8}));return{rows:t,height:6+8*e+3*(e-1)+4}}(v.length):{rows:[],height:0},b=m?160+y.height:160,w=m?b-4:138;return H`
      <div class="wrap">
        <div class="head">
          <span class="label">${Le("elevation.title",this.hass)}</span>
          ${m?V:f?H`<span class="dim"
                    >${Le("elevation.fov_windows",this.hass,{windows:v[0].label})}</span
                  >`:H`<span class="dim">${Le("elevation.no_fov_today",this.hass)}</span>`}
        </div>
        <svg
          viewBox="0 0 ${400} ${b}"
          preserveAspectRatio="none"
          style=${m?`aspect-ratio: 400 / ${b}`:V}
        >
          ${W`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(e=>W`
              <line class="grid" x1=${32} y1=${l(e)} x2=${392} y2=${l(e)} />
              <text class="tick" x=${28} y=${l(e)+3} text-anchor="end">${e}°</text>
            `)}

            <!-- x-axis gridlines at every 6h -->
            ${[0,6,12,18,24].map(e=>{const t=new Date(s.getTime()+36e5*e);return W`
                <line class="grid faint" x1=${a(t)} y1=${10} x2=${a(t)} y2=${138} />
                <text class="tick" x=${a(t)} y=${152} text-anchor="middle">${e.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${d} x2=${392} y2=${d} />

            <!-- elevation limit gridlines (single-window legacy path only) -->
            ${v.flatMap(e=>(e.limitLines??[]).map(e=>W`<line class="limit-line" x1=${32} y1=${e} x2=${392} y2=${e} />`))}

            <!-- In-plot FOV bands: single-window legacy path only. -->
            ${m?V:v.flatMap(e=>e.inPlotBands.map(t=>W`<rect
                        class="fov-band"
                        x=${t.x0}
                        y=${t.y}
                        width=${t.x1-t.x0}
                        height=${t.height}
                        style=${e.inlineFill?`fill:${e.color}`:V}
                      />`))}

            <!-- elevation curve -->
            <polyline class="curve" points=${c} />

            <!-- current-time cursor (extends through the ribbon in multi) -->
            <line class="now" x1=${h} y1=${10} x2=${h} y2=${w} />

            <!-- current sun dot -->
            ${null!==u?W`<circle class="sun-dot ${_}" cx=${h} cy=${u} r="4" />`:V}

            <!-- Per-window FOV ribbon (multi-window only): one row per window,
                 a faint full-width track plus color-keyed bars for in-FOV runs,
                 sharing the plot's xAt() time scale. -->
            ${y.rows.flatMap((e,t)=>{const o=v[t],i=160+e.y,s=o.runs.length?o.d.entry_title:Le("elevation.fov_window_named",this.hass,{name:o.d.entry_title,windows:Le("elevation.no_fov_today",this.hass)}),n=W`<rect
                class="ribbon-track"
                x=${32}
                y=${i}
                width=${360}
                height=${e.height}
                rx="2"
              ><title>${s}</title></rect>`,r=o.runBars.map(t=>W`<rect
                  class="ribbon-bar"
                  x=${t.x0}
                  y=${i}
                  width=${t.x1-t.x0}
                  height=${e.height}
                  rx="2"
                  style=${`fill:${o.color}`}
                ><title>${Le("elevation.fov_window_named",this.hass,{name:o.d.entry_title,windows:t.range})}</title></rect>`);return[n,...r]})}
          `}
        </svg>
      </div>
    `}_interpAt(e,t){if(0===e.length)return null;const o=t.getTime();if(o<=e[0].t.getTime())return e[0];if(o>=e[e.length-1].t.getTime())return e[e.length-1];for(let i=1;i<e.length;i++)if(e[i].t.getTime()>=o){const s=e[i-1],n=e[i],r=(o-s.t.getTime())/(n.t.getTime()-s.t.getTime());return{t:t,elevation:s.elevation+(n.elevation-s.elevation)*r,azimuth:s.azimuth+(n.azimuth-s.azimuth)*r}}return e[e.length-1]}};function Pt(e,t){if(!0===e?.custom_position_minimum_mode&&Array.isArray(e.custom_position_slots)&&void 0!==e.custom_position_active_slot){const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);if(void 0!==t&&null!==t.position&&void 0!==t.position)return t.position}return t}function Ot(e){const t=e.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(t))return"custom_position";switch(t){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return t}}function Mt(e,t,o,i=Ce){const s=new Map;for(const t of e){if(!t.matched)continue;const e=Ot(t.handler);ke.includes(e)&&s.set(e,t)}const n=[...ke].reverse().filter(e=>s.has(e));return 0===n.length?t.reason??"":n.map(e=>function(e,t,o,i){const s=i[e]??e,n=t.position,r=null==n?"":` ${bt(n)}`;if("custom_position"!==e)return`${s}${r}`.trimEnd();return`${o.custom_position_active_slot_name?`${s} · ${o.custom_position_active_slot_name}`:o.custom_position_active_slot?`${s} #${o.custom_position_active_slot}`:s}${r}${!0===o.custom_position_minimum_mode?" floor":""}`}(e,s.get(e),t,i)).join(" → ")}zt.styles=r`
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
    .ribbon-track {
      fill: var(--divider-color);
      fill-opacity: 0.25;
    }
    .ribbon-bar {
      fill: var(--warning-color, gold);
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
    }
    /* Colour states mirror acp-sky-compass .sun.* so the sun reads the same
       across both visuals. */
    .sun-dot {
      fill: var(--secondary-text-color);
      transition: fill 0.3s ease;
    }
    .sun-dot.up {
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
  `,e([_e({attribute:!1})],zt.prototype,"hass",void 0),e([_e({attribute:!1})],zt.prototype,"discoveredList",void 0),e([_e({attribute:!1})],zt.prototype,"coverColors",void 0),e([_e({type:Boolean,reflect:!0})],zt.prototype,"compact",void 0),zt=e([he("acp-elevation-chart")],zt);let Ft=class extends ce{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this.hideInactive=!1}_trace(){const e=this.discovered.entities.decision_trace_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=t.attributes;if(!o?.trace)return null;const i=new Map;for(const e of o.trace)i.set(Ot(e.handler),{matched:e.matched,reason:e.reason,position:e.position});const s={};for(const[e,t]of Object.entries(Se))s[e]=Le(t,this.hass);return{winner:t.state,reason:o.reason??"",steps:i,enabledHandlers:o.enabled_handlers,summary:Mt(o.trace,o,t.state,s)}}render(){if(!this.hass||!this.discovered)return V;const e=this._trace();if(!e)return H`<div class="placeholder">${Le("decision.placeholder",this.hass)}</div>`;const t=function(e){if(!e)return new Set;const t=new Set(e);return new Set(ke.filter(e=>!t.has(e)))}(e.enabledHandlers),o=function(e,t,o,i,s=new Set){return e.filter(e=>e===o||!s.has(e)&&(!i||!0===t.get(e)?.matched))}(ke,e.steps,e.winner,this.hideInactive,t);return H`
      <div class="wrap">
        <div class="head">
          <span class="label">${Le("decision.pipeline",this.hass)}</span>
          <span class="winner">${Le("decision.winner",this.hass,{name:e.winner})}</span>
        </div>
        ${this.showSummary&&e.summary?H`<div class="summary" title=${Le("decision.summary_tooltip",this.hass)}>
              ${e.summary}
            </div>`:V}
        <div class="rows">
          ${o.map(t=>this._row(t,e.steps.get(t),e.winner===t))}
        </div>
        <div class="reason dim">${e.reason}</div>
      </div>
    `}_row(e,t,o){const i=t?.matched??!1,s=t?.reason??Le("decision.not_evaluated",this.hass),n=t?.position;return H`
      <div class="row ${o?"winner":i?"match":"skip"}">
        <span class="name">${Le(Se[e],this.hass)}</span>
        <span class="dots" aria-hidden="true">${i?"████":"────"}</span>
        <span class="pos">${null!=n?bt(n):""}</span>
        <span class="reason-inline dim">${s}</span>
        ${o?H`<span class="badge">✓</span>`:V}
      </div>
    `}};var Tt,It;Ft.styles=r`
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
  `,e([_e({attribute:!1})],Ft.prototype,"hass",void 0),e([_e({attribute:!1})],Ft.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Ft.prototype,"compact",void 0),e([_e({type:Boolean,reflect:!0,attribute:"show-summary"})],Ft.prototype,"showSummary",void 0),e([_e({type:Boolean,reflect:!0,attribute:"hide-inactive"})],Ft.prototype,"hideInactive",void 0),Ft=e([he("acp-decision-strip")],Ft),function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Tt||(Tt={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(It||(It={}));const Nt=["closed","locked","off"],Rt=(e,t,o,i)=>{i=i||{},o=null==o?{}:o;const s=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return s.detail=o,e.dispatchEvent(s),s},Dt=e=>{Rt(window,"haptic",e)};function Lt(e){return void 0!==e&&"none"!==e.action}function jt(e,t,o){return e.filter(e=>"off"===e||("solar"===e?function(e){return e.solarMatched&&!e.cloudIsWinner}(o)&&!1!==t?.solar:!1!==t?.[e]))}function Bt(e){return!!e&&e.some(e=>e.matched&&"solar"===Ot(e.handler))}function qt(e){return"cloud"===Ot(e)}function Ut(e){if(!1===e.integrationEnabled)return"off";const t=Ot(e.winner);return e.manualActive&&"force"!==t&&"custom_position"!==t?"manual":Pe[t]??"auto"}function Ht(e,t){return{solarMatched:Bt(e),cloudIsWinner:qt(t)}}let Wt=class extends ce{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0,this.manualActive=!1,this.resumable=!1}render(){const e=this._kind(),t=Oe[e],o=this.hass?Le(Me[e],this.hass):t.label,i=this._label(e,o),s=Fe[e],n=H`${s?H`<ha-icon class="badge-icon" icon=${s}></ha-icon>`:V}${i}${this.resumable?H`<ha-icon class="resume-icon" icon="mdi:restore"></ha-icon>`:V}`;if(this.resumable){const o=this.hass?Le("tile.resume_aria",this.hass):"Resume automatic control";return H`<button
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
      </button>`}return H`<span
      class="badge kind-${e}"
      style="background:${t.bg};color:${t.fg};"
      part="badge"
      >${n}</span
    >`}_stop(e){e.stopPropagation()}_onResumeClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-resume",{bubbles:!0,composed:!0}))}_kind(){return this.kindOverride??Ut({winner:this.winner,integrationEnabled:this.integrationEnabled,manualActive:this.manualActive})}_label(e,t){return"manual"===e?this.manualEndIso?$t(this.manualEndIso):t:"custom_position"===e?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${t} #${this.slotNumber}`:t}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?this.hass?Le("badge.floor_suffix",this.hass):" ↥":""}`:t}};Wt.styles=r`
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
  `,e([_e({attribute:!1})],Wt.prototype,"hass",void 0),e([_e()],Wt.prototype,"winner",void 0),e([_e({attribute:"manual-end-iso"})],Wt.prototype,"manualEndIso",void 0),e([_e({type:Number,attribute:"slot-number"})],Wt.prototype,"slotNumber",void 0),e([_e({attribute:"slot-name"})],Wt.prototype,"slotName",void 0),e([_e({type:Number})],Wt.prototype,"pct",void 0),e([_e({type:Boolean,attribute:"minimum-mode"})],Wt.prototype,"minimumMode",void 0),e([_e({type:Boolean,reflect:!0})],Wt.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"integration-enabled"})],Wt.prototype,"integrationEnabled",void 0),e([_e({type:Boolean,attribute:"manual-active"})],Wt.prototype,"manualActive",void 0),e([_e({attribute:"kind-override"})],Wt.prototype,"kindOverride",void 0),e([_e({type:Boolean,reflect:!0})],Wt.prototype,"resumable",void 0),Wt=e([he("acp-tile-badge")],Wt);let Kt=class extends ce{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualEndIso(){const e=this.discovered.entities.manual_override_end_sensor;if(!e)return null;const t=this.hass.states[e];return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:null}_motionStatus(){const e=this.discovered.entities.motion_status_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=t.attributes.motion_timeout_end_time;return{state:t.state,endIso:o??null}}_forceActive(){const e=this.discovered.entities.force_override_sensor;if(!e)return 0;const t=this.hass.states[e];return t&&parseInt(t.state,10)||0}_resetManual(){const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_motionStateLabel(e,t){if(e){const t=this.hass.states[e],o=this.hass.formatEntityState;if(t&&"function"==typeof o){const e=o(t);if(e)return e}}return t.replace(/_/g," ")}render(){if(!this.hass||!this.discovered)return V;const e=this._manualActive(),t=this._manualEndIso(),o=this._motionStatus(),i=this.discovered.entities.motion_status_sensor,s=this._forceActive(),n=this.discovered.entities.reset_override_button,r=Le("overrides.reset_manual",this.hass);return H`
      <div class="wrap">
        <div class="label dim">${Le("overrides.title",this.hass)}</div>
        <div class="grid">
          <div class="tile ${e?"active":""}">
            <div class="tile-label">${Le("overrides.manual",this.hass)}</div>
            <div class="tile-value">
              ${Le(e?"overrides.active":"overrides.off",this.hass)}
            </div>
            ${t?H`<div class="tile-sub dim">
                  ${Le("overrides.ends_in",this.hass,{time:xt(t,this.hass)})}
                </div>`:V}
          </div>

          <div class="tile ${s>0?"active warning":""}">
            <div class="tile-label">${Le("overrides.force",this.hass)}</div>
            <div class="tile-value">
              ${s>0?Le("overrides.active_count",this.hass,{count:s}):Le("overrides.off",this.hass)}
            </div>
          </div>

          ${o?H`<div class="tile ${"motion_detected"===o.state?"active":""}">
                <div class="tile-label">${Le("overrides.motion",this.hass)}</div>
                <div class="tile-value">${this._motionStateLabel(i,o.state)}</div>
                ${o.endIso?H`<div class="tile-sub dim">
                      ${Le("overrides.timeout",this.hass,{time:xt(o.endIso,this.hass)})}
                    </div>`:V}
              </div>`:V}
          ${n?this.resetEnabled?H`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${r}</div>
                </button>`:H`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${r}</div>
                </button>`:V}
        </div>
      </div>
    `}};Kt.styles=r`
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
  `,e([_e({attribute:!1})],Kt.prototype,"hass",void 0),e([_e({attribute:!1})],Kt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Kt.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"reset-enabled"})],Kt.prototype,"resetEnabled",void 0),Kt=e([he("acp-overrides-panel")],Kt);const Vt={summer_mode:"mdi:weather-sunny",winter_mode:"mdi:snowflake",intermediate:"mdi:weather-partly-cloudy"};let Gt=class extends ce{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return V;const e=this.discovered.entities.climate_status_sensor;if(!e)return V;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return V;const o=t.state,i=t.attributes??{},s=Vt[o]??"mdi:thermostat",n=i.temperature_unit??"°",r=this.hass.formatEntityState,a="function"==typeof r?r(t)??o:o,l=void 0!==i.active_temperature?`${i.active_temperature.toFixed(1)}${n}`:"—",c=[void 0!==i.indoor_temperature?{label:Le("climate.indoor",this.hass),value:i.indoor_temperature,unit:n}:null,void 0!==i.outdoor_temperature?{label:Le("climate.outdoor",this.hass),value:i.outdoor_temperature,unit:n}:null].filter(e=>null!==e),d=[{label:Le("climate.presence",this.hass),value:i.is_presence,icon:"mdi:account-check"},{label:Le("climate.sunny",this.hass),value:i.is_sunny,icon:"mdi:white-balance-sunny"},{label:Le("climate.lux",this.hass),value:i.lux_active,icon:"mdi:brightness-7"},{label:Le("climate.irradiance",this.hass),value:i.irradiance_active,icon:"mdi:solar-power"}].filter(e=>void 0!==e.value);return H`
      <div class="wrap">
        <div class="head">
          <span class="label">${Le("climate.title",this.hass)}</span>
          <span class="dim">${Le("climate.active",this.hass,{strategy:l})}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${s}></ha-icon>
          <span class="strategy-name">${a}</span>
        </div>
        ${c.length?H`
              <div class="temps">
                ${c.map(e=>H`
                    <div class="temp">
                      <span class="temp-label dim">${e.label}</span>
                      <span class="temp-value">${e.value.toFixed(1)}${e.unit}</span>
                    </div>
                  `)}
              </div>
            `:V}
        ${d.length?H`
              <div class="conditions">
                ${d.map(e=>H`
                    <div class="chip ${e.value?"on":"off"}" title=${e.label}>
                      <ha-icon icon=${e.icon}></ha-icon>
                      <span>${e.label}</span>
                    </div>
                  `)}
              </div>
            `:V}
      </div>
    `}};Gt.styles=r`
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
  `,e([_e({attribute:!1})],Gt.prototype,"hass",void 0),e([_e({attribute:!1})],Gt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Gt.prototype,"compact",void 0),Gt=e([he("acp-climate-panel")],Gt);let Zt=class extends ce{constructor(){super(...arguments),this.compact=!1}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return{target:null,covers:{}};const t=this.hass.states[e];if(!t)return{target:null,covers:{}};const o=parseFloat(t.state),i=t.attributes;return{target:Number.isNaN(o)?null:o,covers:i?.actual_positions??{}}}_mismatched(){const e=this.discovered.entities.position_mismatch_binary;if(!e)return new Set;const t=this.hass.states[e];if("on"!==t?.state)return new Set;const o=t.attributes.entities;return o?new Set(Object.entries(o).filter(([,e])=>e.mismatch).map(([e])=>e)):new Set}_setPosition(e,t){this.hass.callService(xe,"set_position",{position:t},{entity_id:e})}render(){if(!this.hass||!this.discovered)return V;const{target:e,covers:t}=this._target(),o=this._mismatched(),i=Object.entries(t);return 0===i.length?H`<div class="placeholder">${Le("covers.placeholder",this.hass)}</div>`:H`
      <div class="wrap">
        <div class="head">
          <span class="label">${Le("covers.title",this.hass)}</span>
          <span class="target"
            >${Le("covers.target",this.hass,{pct:bt(e)})}</span
          >
        </div>
        ${i.map(([t,i])=>this._bar(t,i,e,o.has(t)))}
      </div>
    `}_bar(e,t,o,i){const s=this.hass.states[e]?.attributes?.friendly_name??e,n=t??0,r=o??0;return H`
      <div class="cover ${i?"mismatch":""}">
        <div class="name" title=${e}>${s}</div>
        <div
          class="track"
          @click=${t=>this._handleTrackClick(t,e)}
          title=${Le("covers.click_to_set",this.hass)}
        >
          <div class="fill" style="width:${n}%"></div>
          ${null!==o?H`<div
                class="marker"
                style="left:${r}%"
                title=${Le("covers.target_tooltip",this.hass,{pct:r})}
              ></div>`:V}
        </div>
        <div class="num">${bt(t)}</div>
        ${i?H`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:V}
      </div>
    `}_handleTrackClick(e,t){const o=e.currentTarget.getBoundingClientRect(),i=Math.round((e.clientX-o.left)/o.width*100),s=Math.max(0,Math.min(100,i));this._setPosition(t,s)}};var Xt;Zt.styles=r`
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
  `,e([_e({attribute:!1})],Zt.prototype,"hass",void 0),e([_e({attribute:!1})],Zt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Zt.prototype,"compact",void 0),Zt=e([he("acp-cover-bar")],Zt);const Jt=864e5;let Yt=Xt=class extends ce{constructor(){super(...arguments),this.samples=[],this.events=[],this.now=Date.now(),this._hoverIdx=null,this._onPointerMove=e=>{const t=e.currentTarget.getBoundingClientRect();if(t.width<=0)return;const o=(e.clientX-t.left)/t.width,i=Math.max(0,Math.min(1,o))*Xt.VIEW_W;this._hoverIdx=this._nearestSampleIdx(i)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){if(!this.samples||0===this.samples.length)return V;const{VIEW_W:e,VIEW_H:t,TOP_PAD:o,EVENT_HIT_W:i}=Xt,s=t-o,n=_t(new Date(this.now)).getTime(),r=t=>Ge(t,n,e),a=this.samples.map(e=>{const t=Date.parse(e.t);return{t:t,x:r(t),y:o+(1-Qt(e.position)/100)*s,sample:e,inDay:!Number.isNaN(t)&&t>=n&&t<=n+Jt}}),l=a.filter(e=>e.inDay).map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)}`).join(" "),c=(this.events??[]).map(e=>{const s=Date.parse(e.t);if(Number.isNaN(s)||s<n||s>n+Jt)return null;const a=r(s),l=`evt-${e.kind}`,c=function(e,t){const o=`forecast.event.${e.kind}`,i=Le(o,t),s=i===o?e.label??e.kind:i,n=$t(e.t);return"—"===n?s:`${s} — ${n}`}(e,this.hass);return W`<g class="event-group" data-tooltip=${c}>
          <title>${c}</title>
          <line
            class="event-hit"
            x1=${a.toFixed(1)}
            x2=${a.toFixed(1)}
            y1=${o}
            y2=${t}
            stroke-width=${i}
          ></line>
          <line
            class="event-marker ${l}"
            x1=${a.toFixed(1)}
            x2=${a.toFixed(1)}
            y1=${o}
            y2=${t}
          ></line>
        </g>`}).filter(e=>null!==e),d=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<a.length?a[this._hoverIdx]:null,h=d?W`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${d.x.toFixed(1)} x2=${d.x.toFixed(1)}
            y1=${o} y2=${t}></line>
          <circle class="hover-dot" cx=${d.x.toFixed(1)} cy=${d.y.toFixed(1)} r="3"></circle>
        </g>`:V,p=d?H`<div class="hover-label" style=${`left: ${(d.x/e*100).toFixed(2)}%`}>
          ${function(e){const t=$t(e.t),o=`${Math.round(Qt(e.position))}%`;return e.handler?`${t} · ${o} · ${e.handler}`:`${t} · ${o}`}(d.sample)}
        </div>`:V,u=[0,6,12,18,24].map(e=>{const i=r(n+36e5*e);return W`
        <line class="grid faint" x1=${i} y1=${o} x2=${i} y2=${t-.5} />
        <text class="axis-label tick-time" x=${i} y=${t-3} text-anchor="middle">${e.toString().padStart(2,"0")}:00</text>
      `}),_=this.now,g=r(_),m=_>=n&&_<=n+Jt?W`<line class="now" x1=${g.toFixed(1)} y1=${o} x2=${g.toFixed(1)} y2=${t-.5}></line>`:V;return H`
      <div class="wrap">
        <svg
          viewBox="0 0 ${e} ${t}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <title>${Le("forecast.hover_hint",this.hass)}</title>
          <line class="baseline" x1="0" y1=${t-.5} x2=${e} y2=${t-.5}></line>
          <text class="axis-label" x="4" y=${o+8} text-anchor="start">100%</text>
          ${u}
          <polyline class="curve" points=${l} fill="none"></polyline>
          ${c} ${h} ${m}
        </svg>
        ${p}
      </div>
    `}_nearestSampleIdx(e){const t=_t(new Date(this.now)).getTime();let o=-1,i=Number.POSITIVE_INFINITY;for(let s=0;s<this.samples.length;s++){const n=Date.parse(this.samples[s].t);if(Number.isNaN(n)||n<t||n>t+Jt)continue;const r=Ge(n,t,Xt.VIEW_W),a=Math.abs(r-e);a<i&&(i=a,o=s)}return o>=0?o:null}};function Qt(e){return Number.isNaN(e)||e<0?0:e>100?100:e}Yt.VIEW_W=600,Yt.VIEW_H=80,Yt.TOP_PAD=10,Yt.EVENT_HIT_W=12,Yt.styles=r`
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
  `,e([_e({attribute:!1})],Yt.prototype,"hass",void 0),e([_e({attribute:!1})],Yt.prototype,"samples",void 0),e([_e({attribute:!1})],Yt.prototype,"events",void 0),e([_e({attribute:!1})],Yt.prototype,"now",void 0),e([ge()],Yt.prototype,"_hoverIdx",void 0),Yt=Xt=e([he("acp-forecast-strip")],Yt);let eo=class extends ce{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this.showElevationChart=!0,this._onResume=()=>{const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const e=this.discovered.device_id;e&&this._navigate(`/config/devices/device/${e}`)},this._openIntegrationPage=()=>{this._navigate(`/config/integrations/integration/${xe}`)},this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}_buildHandlerLabels(){const e={};for(const[t,o]of Object.entries(Se))e[t]=Le(o,this.hass);return e}render(){if(!this.open||!this.hass||!this.discovered)return V;const e=this._winner(),t=this._traceAttrs(),o=this._matchedHandlers(t,e),i=t?Mt(t.trace??[],t,0,this._buildHandlerLabels()):"",s=this._target(),n=this._shouldShowResume(e),r=this._switchOn("integration_enabled_switch"),a=this._switchOn("automatic_control_switch"),l=Le("dialog.configure_integration",this.hass),c=Le("dialog.open_device_page",this.hass),d=Le("dialog.close",this.hass);return H`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${Ae[this.discovered.cover_type]??"mdi:window-shutter"}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${r?a?o.map(e=>H`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${e}
                          .slotNumber=${"custom_position"===e?t?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===e?t?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===e?Pt(t,s)??void 0:void 0}
                          .minimumMode=${"custom_position"===e?t?.custom_position_minimum_mode:void 0}
                        ></acp-tile-badge>`):V:H`<acp-tile-badge
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
            ${this.discovered.device_id?H`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label=${c}
                  title=${c}
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:cog"></ha-icon>
                </button>`:V}
            <button class="close" type="button" aria-label=${d} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${i?H`<div class="summary">${i}</div>`:V}

          <div class="position-block">
            <div class="position-label">${Le("dialog.target",this.hass)}</div>
            <div class="position-value">${bt(s)}</div>
            ${this._mismatchActive()?H`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:V}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${n?H`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${Le("dialog.resume_auto",this.hass)}
                </button>
              </div>`:V}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?Le("dialog.hide_advanced",this.hass):Le("dialog.show_advanced",this.hass)}
          </button>
          ${this.advancedOpen?H`<div class="advanced">
                ${this.showCompass?H`<div class="advanced-compass">
                      <acp-sky-compass
                        .hass=${this.hass}
                        .discovered_list=${[this.discovered]}
                        ?compact=${!0}
                        .showLegend=${!1}
                        .showStats=${!0}
                      ></acp-sky-compass>
                    </div>`:V}
                ${this.showElevationChart?H`<acp-elevation-chart
                      .hass=${this.hass}
                      .discoveredList=${[this.discovered]}
                      ?compact=${!0}
                    ></acp-elevation-chart>`:V}
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
              </div>`:V}
        </div>
      </div>
    `}_winner(){const e=this.discovered.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(){const e=this.discovered.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_matchedHandlers(e,t){if(!e?.trace)return[];const o=new Set;for(const t of e.trace){if(!t.matched)continue;const e=Ot(t.handler);ke.includes(e)&&o.add(e)}const i=ke.filter(e=>o.has(e)).map(e=>Pe[e]).filter(e=>void 0!==e),s=Ht(e.trace,t);return jt(i,this.badges,s)}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=parseFloat(t.state);return Number.isNaN(o)?null:o}_mismatchActive(){const e=this.discovered.entities.position_mismatch_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualOverrideOn(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(e){const t=this.discovered.entities[e];return!t||"off"!==this.hass.states[t]?.state}_shouldShowResume(e){return!(!this.discovered.entities.reset_override_button||!this._manualOverrideOn()&&"custom_position"!==Ot(e))}_renderSlots(e){if(!e)return V;const t=e.filter(e=>null!==e.sensor);return 0===t.length?V:H`<div class="slots-section">
      <div class="slots-label">${Le("dialog.custom_positions",this.hass)}</div>
      ${t.map(e=>this._renderSlotRow(e))}
    </div>`}_renderSlotRow(e){const t=e.sensor_name??`#${e.slot}`;return H`<div class="slot-row" data-slot=${e.slot}>
      <span class="slot-label">${t}</span>
      <span class="slot-position">${bt(e.position)}</span>
      ${!0===e.min_mode?H`<span
            class="slot-min-mode${null!=e.priority&&e.priority>80?"":" is-bypassable"}"
            title=${Le("dialog.floor_tooltip",this.hass)}
          >
            ${Le("dialog.floor",this.hass)}
          </span>`:V}
      <button
        class="slot-toggle ${e.enabled?"on":"off"}"
        type="button"
        aria-label=${e.enabled?Le("dialog.disable_slot",this.hass,{slot:e.slot}):Le("dialog.enable_slot",this.hass,{slot:e.slot})}
        @click=${()=>this._toggleSlot(e)}
      >
        ${e.enabled?Le("dialog.on",this.hass):Le("dialog.off",this.hass)}
      </button>
    </div>`}_renderControls(){const e=[{role:"automatic_control_switch",label:Le("dialog.automatic",this.hass)},{role:"climate_mode_switch",label:Le("dialog.climate",this.hass)},{role:"motion_control_switch",label:Le("dialog.motion",this.hass)}].filter(e=>!!this.discovered.entities[e.role]);return 0===e.length?V:H`<div class="controls-block">
      <div class="controls-label">${Le("dialog.controls",this.hass)}</div>
      <div class="controls-row">${e.map(e=>this._renderSwitchChip(e.role,e.label))}</div>
    </div>`}_renderSwitchChip(e,t){const o=this.discovered.entities[e],i="on"===this.hass.states[o]?.state,s=Le(i?"dialog.state_on":"dialog.state_off",this.hass),n=Le(i?"dialog.on":"dialog.off",this.hass);return H`<button
      class="ctrl-toggle ${i?"on":"off"}"
      type="button"
      aria-pressed=${i}
      aria-label=${Le("dialog.toggle_hint",this.hass,{label:t,state:s})}
      @click=${()=>this._toggleSwitch(o,i)}
    >
      <span class="ctrl-label">${t}</span>
      <span class="ctrl-state">${n}</span>
    </button>`}_toggleSwitch(e,t){this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:e})}_renderForecastStrip(){const e=this.discovered.entities.position_forecast_sensor;if(!e)return V;const t=this.hass.states[e]?.attributes,o=t?.forecast??[],i=t?.events??[];return 0===o.length?V:H`<div class="forecast-block">
      <div class="forecast-label">${Le("dialog.todays_forecast",this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${o}
        .events=${i}
        .now=${Date.now()}
      ></acp-forecast-strip>
      <div class="forecast-note">${Le("forecast.solar_only_note",this.hass)}</div>
    </div>`}_toggleSlot(e){const t=this.discovered.managed_covers[0];t&&this.hass.callService(xe,"set_custom_position",{entity_id:t,slot:e.slot,enabled:!e.enabled})}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};function to(e){return H`
    <div
      class="editor-footer"
      style="display:flex;align-items:center;justify-content:space-between;gap:8px;"
    >
      <a href=${"https://www.buymeacoffee.com/jrhubott"} target="_blank" rel="noopener noreferrer">
        <img src=${"https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black"} alt=${Le("editor.common.support_alt",e)} height="20" />
      </a>
      <span class="version-footer dim">
        ${Le("root.footer_version",e,{version:me})}
      </span>
    </div>
  `}eo.styles=r`
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
  `,e([_e({attribute:!1})],eo.prototype,"hass",void 0),e([_e({attribute:!1})],eo.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],eo.prototype,"open",void 0),e([_e({type:Boolean})],eo.prototype,"advancedOpen",void 0),e([_e({type:Boolean})],eo.prototype,"showCompass",void 0),e([_e({type:Boolean})],eo.prototype,"showElevationChart",void 0),e([_e({attribute:!1})],eo.prototype,"badges",void 0),eo=e([he("acp-more-info-dialog")],eo);const oo=["auto","solar","force","weather","manual","custom_position","motion","climate","glare_zone","cloud"],io={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_compass:!0,show_elevation_chart:!0,show_motion_icon:!0,layout:"detailed",badge_auto:!0,badge_solar:!0,badge_force:!0,badge_weather:!0,badge_manual:!0,badge_custom_position:!0,badge_motion:!0,badge_climate:!0,badge_glare_zone:!0,badge_cloud:!0},so={entry_id:"editor.common.entry_id",name:"editor.tile.name",icon:"editor.tile.icon",cover:"editor.tile.cover",layout:"editor.tile.layout",show_position:"editor.tile.show_position",show_state:"editor.tile.show_state",show_decision_summary:"editor.tile.show_decision_summary",show_controls:"editor.tile.show_controls",show_badge:"editor.tile.show_badge",badge_section:"editor.tile.badge_section",badge_auto:"editor.tile.badge_auto",badge_solar:"editor.tile.badge_solar",badge_force:"editor.tile.badge_force",badge_weather:"editor.tile.badge_weather",badge_manual:"editor.tile.badge_manual",badge_custom_position:"editor.tile.badge_custom_position",badge_motion:"editor.tile.badge_motion",badge_climate:"editor.tile.badge_climate",badge_glare_zone:"editor.tile.badge_glare_zone",badge_cloud:"editor.tile.badge_cloud",show_compass:"editor.tile.show_compass",show_elevation_chart:"editor.tile.show_elevation_chart",show_motion_icon:"editor.tile.show_motion_icon",tap_action:"editor.tile.tap_action",hold_action:"editor.tile.hold_action",double_tap_action:"editor.tile.double_tap_action"};let no=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=e=>{const t=so[e.name];return t?Le(t,this.hass):e.name},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,o]of Object.entries(io))e.startsWith("badge_")?t[e]===o&&delete t[e]:this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==o||delete t[e];const o={};for(const e of oo){const i=`badge_${e}`;!1===t[i]&&(o[e]=!1),delete t[i]}const i={...this._config??{type:"",entry_id:""},...t};Object.keys(o).length>0?i.badges=o:delete i.badges,this._emit(i)}}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),e.has("_registry")&&null!==this._registry&&this._maybePrefillCover()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Be(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id}),this._maybePrefillCover()}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,Je(this.hass).then(e=>{this._registry=e,this._maybePrefillCover()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=Ye(this.hass,()=>{this._registryFetchInFlight=!0,Je(this.hass).then(e=>{this._registry=e}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_maybePrefillCover(){if(!this._config?.entry_id||this._config?.cover||!this._registry||!this.hass)return;const e=je(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=e?.managed_covers??[],1===e?.managed_covers.length&&this._emit({...this._config,cover:e.managed_covers[0]})}render(){if(!this._config)return V;if(this._entriesError&&!this._entries)return H`
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
          ${to(this.hass)}
        </div>
      `;const e=this._schema(),{badges:t,...o}=this._config,i={};for(const e of oo)t&&!1===t[e]&&(i[`badge_${e}`]=!1);const s={...io,...o,...i};return H`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${s}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${this._managedCovers.length>1&&!this._config?.cover?H`<div class="hint">${Le("editor.tile.cover_blank_hint",this.hass)}</div>`:V}
        ${to(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[],t=[{value:"one-line",label:Le("editor.tile.layout_option_one_line",this.hass)},{value:"detailed",label:Le("editor.tile.layout_option_detailed",this.hass)}];let o={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const e=je(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);e&&e.managed_covers.length>0&&(o={entity:{domain:"cover",include_entities:e.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:o},{name:"layout",selector:{select:{mode:"list",options:t}}},{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{type:"expandable",name:"",title:Le("editor.tile.badge_section",this.hass),icon:"mdi:label-multiple-outline",schema:[{type:"grid",name:"",schema:oo.map(e=>({name:`badge_${e}`,selector:{boolean:{}}}))}]},{name:"show_motion_icon",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"show_elevation_chart",selector:{boolean:{}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};no.styles=r`
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
  `,e([_e({attribute:!1})],no.prototype,"hass",void 0),e([ge()],no.prototype,"_config",void 0),e([ge()],no.prototype,"_entries",void 0),e([ge()],no.prototype,"_entriesError",void 0),e([ge()],no.prototype,"_registry",void 0),e([ge()],no.prototype,"_managedCovers",void 0),no=e([he($e)],no);let ro=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),Lt(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return Lt(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${we}: \`entry_id\` is required and must be a non-empty string`);let t={...e};"string"==typeof t.tap_action&&(t={...t,tap_action:"none"===t.tap_action?{action:"none"}:void 0}),this._config=t}getCardSize(){return 1}static async getStubConfig(e){let t="";try{const o=await Be(e);t=o[0]?.entry_id??""}catch{}return{type:`custom:${we}`,entry_id:t}}static async getConfigElement(){return document.createElement($e)}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ye(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){if(this._fetchInFlight)return;this._fetchInFlight=!0;const e=++this._fetchGen;Je(this.hass).then(t=>{e===this._fetchGen&&(this._registry=t,this._registryError=null)}).catch(t=>{e===this._fetchGen&&(this._registryError=t?.message??"entity registry fetch failed")}).finally(()=>{e===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return V;if(null===this._registry)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Le("tile.registry_failed",this.hass,{error:this._registryError}):Le("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=je(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?H`
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
    `:H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${Le("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`}_buildHandlerLabels(){const e={};for(const[t,o]of Object.entries(Se))e[t]=Le(o,this.hass);return e}_renderTile(e){const t=this._config,o=t.name??e.entry_title,i=this._resolvedCover(e),s=t.icon??function(e,t){if(null!==t&&!Number.isNaN(t)){if(t>=95)return Ee[e]??"mdi:window-shutter-open";if(t<=5)return ze[e]??"mdi:window-shutter"}return Ae[e]??"mdi:window-shutter"}(e.cover_type,this._liveCoverPosition(i)),n=!1!==t.show_position,r=!1!==t.show_state,a=!1!==t.show_controls,l=!1!==t.show_badge,c=!1!==t.show_motion_icon?this._motionActiveState(e):null,d=Le("timeout_pending"===c?"tile.motion_pending":"tile.motion_detected",this.hass),h="one-line"!==t.layout,p=this._currentPosition(e),u=this._liveCoverPosition(i)??p,_=this._winner(e),g=this._traceAttrs(e),m=this._manualEndIso(e),v=this._isFullyInert(t),f=!0===t.show_decision_summary&&g?Mt(g.trace??[],g,0,this._buildHandlerLabels()):"",y=!!f&&h,b=this._switchOn(e,"integration_enabled_switch"),w=this._switchOn(e,"automatic_control_switch"),$=this._manualOverrideOn(e),x=function(e){const t=Ut(e);return"motion"!==t?t:!1===e.badges?.motion||e.showMotionIcon?!1===e.badges?.auto?null:"auto":t}({winner:_,integrationEnabled:b,manualActive:$,badges:t.badges,showMotionIcon:!1!==t.show_motion_icon}),k=Ht(g?.trace,_),C=null!==x&&jt([x],t.badges,k).length>0,S=l&&C&&!(!1===w&&!0===b),A=function(e){if(!e.integrationEnabled)return!1;if(!e.automaticControl)return!1;if(e.manualActive)return!1;const t=Ot(e.winner);return"force"!==t&&("custom_position"!==t||!e.bypassAutoControl)}({winner:_,integrationEnabled:b,automaticControl:w,manualActive:$,bypassAutoControl:!0===g?.bypass_auto_control}),E=h&&l&&!1!==t.badges?.auto&&A,z=!(E&&"auto"===x),P=r?function(e,t){if(!e||!t)return null;const o=e.states[t];if(!o?.state||"unknown"===o.state||"unavailable"===o.state)return null;if("function"==typeof e.formatEntityState){const t=e.formatEntityState(o);if(t)return t}if("function"==typeof e.localize){const t=e.localize(`component.cover.entity_component._.state.${o.state}`);if(t)return t}return o.state.charAt(0).toUpperCase()+o.state.slice(1)}(this.hass,i):null,O=[P,n&&null!==u?bt(u):null].filter(e=>!!e),M=!!P,F=function(e,t,o){if(!Array.isArray(e?.custom_position_slots))return null;const i=e.custom_position_slots.filter(e=>!0===e.min_mode&&!0===e.enabled&&null!==e.sensor&&null!==e.position&&"on"===t[e.sensor]?.state);if(0===i.length)return null;const s=i.reduce((e,t)=>(t.position??0)>(e.position??0)?t:e),n=s.position,r=s.priority??null;return{slot:s.slot,position:n,label:s.sensor_name??`#${s.slot}`,clamping:null!==o&&n>o,sensorOn:!0,priority:r,resistsManual:null!=r&&r>80}}(g,this.hass.states,p),T=Ot(_),I=!!F&&!("custom_position"===T&&!0===g?.custom_position_minimum_mode)&&b,N=$&&!!e.entities.reset_override_button,R=O.length>0?H`<div class="position">${O.join(" · ")}</div>`:V,D=I?H`<span
          class=${`acp-floor-chip${F.clamping?"":" is-armed"}${F.resistsManual?" resists-manual":" is-bypassable"}`}
          title=${Le("dialog.floor_tooltip",this.hass)}
          >${Le("dialog.floor",this.hass)} ${bt(F.position)}</span
        >`:V,L=S?H`<acp-tile-badge
          .hass=${this.hass}
          .winner=${_}
          .kindOverride=${x??void 0}
          .integrationEnabled=${b}
          .slotNumber=${g?.custom_position_active_slot}
          .slotName=${g?.custom_position_active_slot_name}
          .pct=${Pt(g,p)??void 0}
          .minimumMode=${g?.custom_position_minimum_mode}
          .manualEndIso=${m}
          .manualActive=${$}
          .resumable=${N}
          @acp-resume=${()=>this._resume(e)}
        ></acp-tile-badge>`:V,j=E?H`<acp-tile-badge
          .hass=${this.hass}
          .winner=${_}
          .kindOverride=${"auto"}
          .integrationEnabled=${b}
        ></acp-tile-badge>`:V;return H`
      <div
        class=${`tile-body${h?" detailed":""}${y?" has-summary":""}${M?" has-state-label":""}${I?" has-floor-chip":""}`}
        role=${v?"group":"button"}
        tabindex=${v?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
          <ha-icon class="cover-icon" icon=${s}></ha-icon>
          ${c?H`<ha-icon
                class="motion-overlay ${c}"
                icon="mdi:motion-sensor"
                title=${d}
              ></ha-icon>`:V}
        </div>
        <div class="label">
          <div class="title" title=${e.entry_title}>${o}</div>
          ${f&&!h?H`<div class="summary">${f}</div>`:V}
          ${y?H`<div class="summary inline-summary" title=${f}>${f}</div>`:V}
        </div>
        ${h&&E?H`<div class="auto-line">${j}</div>`:V}
        ${h?H`<div class="detail-line">
              ${R}${D}${z?L:V}
            </div>`:H`${R}${D}`}
        ${a?H`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${Le("tile.open",this.hass)}
                ?disabled=${!i}
                @click=${()=>this._setCoverPosition(i,100)}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${Le("tile.stop",this.hass)}
                ?disabled=${!i}
                @click=${()=>this._stopCover(i)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${Le("tile.close",this.hass)}
                ?disabled=${!i}
                @click=${()=>this._setCoverPosition(i,0)}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </div>`:V}
        ${h?V:L}
      </div>
    `}_resolvedCover(e){return this._config?.cover?this._config.cover:e.managed_covers[0]}_currentPosition(e){const t=e.entities.target_position_sensor;if(!t)return null;const o=this.hass.states[t];if(!o)return null;const i=parseFloat(o.state);return Number.isNaN(i)?null:i}_liveCoverPosition(e){if(!e)return null;const t=this.hass.states[e]?.attributes?.current_position;return"number"!=typeof t||Number.isNaN(t)?null:t}_winner(e){const t=e.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(e){const t=e.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_motionActiveState(e){const t=e.entities.motion_status_sensor;if(!t)return null;const o=this.hass.states[t]?.state;return"motion_detected"===o||"timeout_pending"===o?o:null}_manualOverrideOn(e){const t=e.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(e,t){const o=e.entities[t];return!o||"off"!==this.hass.states[o]?.state}_manualEndIso(e){if(!this._manualOverrideOn(e))return;const t=e.entities.manual_override_end_sensor;return t?this.hass.states[t]?.state:void 0}_setCoverPosition(e,t){e&&this.hass.callService(xe,"set_position",{position:t},{entity_id:e})}_stopCover(e){e&&this.hass.callService(xe,"stop",{},{entity_id:e})}_resume(e){const t=e.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}_tapActionConfig(){const e=this._config?.tap_action;if("string"!=typeof e)return e}_isFullyInert(e){return!!(e=>!!e&&"none"===e.action)(this._tapActionConfig())&&!Lt(e.hold_action)&&!Lt(e.double_tap_action)}_fireAction(e){if(!this._config||!this.hass)return;const t=this._tapActionConfig();if("tap"===e&&void 0===t)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const o=this._resolvedCoverFromState();((e,t,o,i)=>{let s;"double_tap"===i&&o.double_tap_action?s=o.double_tap_action:"hold"===i&&o.hold_action?s=o.hold_action:"tap"===i&&o.tap_action&&(s=o.tap_action),((e,t,o,i)=>{if(i||(i={action:"more-info"}),!i.confirmation||i.confirmation.exemptions&&i.confirmation.exemptions.some(e=>e.user===t.user.id)||(Dt("warning"),confirm(i.confirmation.text||`Are you sure you want to ${i.action}?`)))switch(i.action){case"more-info":(o.entity||o.camera_image)&&Rt(e,"hass-more-info",{entityId:o.entity?o.entity:o.camera_image});break;case"navigate":i.navigation_path&&((e,t,o=!1)=>{o?history.replaceState(null,"",t):history.pushState(null,"",t),Rt(window,"location-changed",{replace:o})})(0,i.navigation_path);break;case"url":i.url_path&&window.open(i.url_path);break;case"toggle":o.entity&&(((e,t)=>{((e,t,o=!0)=>{const i=function(e){return e.substr(0,e.indexOf("."))}(t),s="group"===i?"homeassistant":i;let n;switch(i){case"lock":n=o?"unlock":"lock";break;case"cover":n=o?"open_cover":"close_cover";break;default:n=o?"turn_on":"turn_off"}e.callService(s,n,{entity_id:t})})(e,t,Nt.includes(e.states[t].state))})(t,o.entity),Dt("success"));break;case"call-service":{if(!i.service)return void Dt("failure");const[e,o]=i.service.split(".",2);t.callService(e,o,i.service_data,i.target),Dt("success");break}case"fire-dom-event":Rt(e,"ll-custom",i)}})(e,t,o,s)})(this,this.hass,{entity:o,tap_action:t,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},e)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const e=je(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?.managed_covers[0]}_stop(e){e.stopPropagation()}};ro.styles=r`
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
  `,e([_e({attribute:!1})],ro.prototype,"hass",void 0),e([ge()],ro.prototype,"_config",void 0),e([ge()],ro.prototype,"_registry",void 0),e([ge()],ro.prototype,"_registryError",void 0),e([ge()],ro.prototype,"_dialogOpen",void 0),ro=e([he(we)],ro),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===we)||window.customCards.push({type:we,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const ao=[{key:"sky",labelKey:"editor.main.section_sky_label",descKey:"editor.main.section_sky_desc"},{key:"elevation",labelKey:"editor.main.section_elevation_label",descKey:"editor.main.section_elevation_desc"},{key:"decision",labelKey:"editor.main.section_decision_label",descKey:"editor.main.section_decision_desc"},{key:"covers",labelKey:"editor.main.section_covers_label",descKey:"editor.main.section_covers_desc"},{key:"overrides",labelKey:"editor.main.section_overrides_label",descKey:"editor.main.section_overrides_desc"},{key:"climate",labelKey:"editor.main.section_climate_label",descKey:"editor.main.section_climate_desc"}],lo=ao.map(e=>e.key);let co=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Be(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??lo}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_onEntryChange(e){const t=e.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:t})}_onSectionToggle(e,t){const o=new Set(this._currentSections);t?o.add(e):o.delete(e);const i=ao.map(e=>e.key).filter(e=>o.has(e));this._emit({...this._config??{type:"",entry_id:""},show_sections:i})}_onCompactToggle(e){this._emit({...this._config??{type:"",entry_id:""},compact:e})}_onCompassStatsToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:e})}_onCompassLegendToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:e})}_onMoonToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_moon:e})}_onHideInactiveToggle(e){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:e})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),o=Number.isFinite(t)?t:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:o})}_onControlToggle(e,t){const o=this._config??{type:"",entry_id:""};this._emit({...o,controls:{...o.controls,[e]:t}})}render(){if(!this._config)return V;const e=new Set(this._currentSections);return H`
      <div class="form">
        <div class="section">
          <label class="field-label">${Le("editor.common.entry_id",this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${Le("editor.main.sections",this.hass)}</label>
          <div class="hint">${Le("editor.main.sections_hint",this.hass)}</div>
          ${ao.map(t=>H`
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
        ${to(this.hass)}
      </div>
    `}_renderEntryPicker(){return this._entriesError?H`
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
      `:this._entries?0===this._entries.length?H`
        <div class="error">
          ${Le("editor.common.no_entries",this.hass)}
          <code>${Le("editor.common.no_entries_path",this.hass)}</code>${Le("editor.common.no_entries_then",this.hass)}
        </div>
      `:H`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(e=>e.entry_id===this._config.entry_id)?H`<option value=${this._config.entry_id}>
              ${Le("editor.common.unknown_entry",this.hass,{entry:this._config.entry_id})}
            </option>`:V}
        ${this._entries.map(e=>H`
            <option value=${e.entry_id} ?selected=${e.entry_id===this._config?.entry_id}>
              ${e.title}
            </option>
          `)}
      </select>
    `:H`<div class="hint">${Le("editor.common.loading_entries",this.hass)}</div>`}};co.styles=r`
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
  `,e([_e({attribute:!1})],co.prototype,"hass",void 0),e([ge()],co.prototype,"_config",void 0),e([ge()],co.prototype,"_entries",void 0),e([ge()],co.prototype,"_entriesError",void 0),co=e([he(fe)],co);const ho=[{key:"compact",labelKey:"editor.compass.toggle_compact_label",descKey:"editor.compass.toggle_compact_desc",defaultOn:!1},{key:"show_legend",labelKey:"editor.compass.toggle_legend_label",descKey:"editor.compass.toggle_legend_desc",defaultOn:!0},{key:"show_stats",labelKey:"editor.compass.toggle_stats_label",descKey:"editor.compass.toggle_stats_desc",defaultOn:!0},{key:"show_moon",labelKey:"editor.compass.toggle_moon_label",descKey:"editor.compass.toggle_moon_desc",defaultOn:!1},{key:"show_cardinals",labelKey:"editor.compass.toggle_cardinals_label",descKey:"editor.compass.toggle_cardinals_desc",defaultOn:!0},{key:"show_blind_spot",labelKey:"editor.compass.toggle_blind_spot_label",descKey:"editor.compass.toggle_blind_spot_desc",defaultOn:!0},{key:"show_sun_path",labelKey:"editor.compass.toggle_sun_path_label",descKey:"editor.compass.toggle_sun_path_desc",defaultOn:!0},{key:"show_sunrise_sunset",labelKey:"editor.compass.toggle_sunrise_sunset_label",descKey:"editor.compass.toggle_sunrise_sunset_desc",defaultOn:!0},{key:"show_cover_fill",labelKey:"editor.compass.toggle_cover_fill_label",descKey:"editor.compass.toggle_cover_fill_desc",defaultOn:!0},{key:"show_window_arrow",labelKey:"editor.compass.toggle_window_arrow_label",descKey:"editor.compass.toggle_window_arrow_desc",defaultOn:!0},{key:"show_elevation_chart",labelKey:"editor.compass.toggle_elevation_chart_label",descKey:"editor.compass.toggle_elevation_chart_desc",defaultOn:!0}];let po=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Be(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${ye}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let o=0;o<e.length;o++)e[o]&&(t=o);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,o){const i=this._trimColors(t),{cover_colors:s,...n}=e,r=i?{...n,...o,cover_colors:i}:{...n,...o};this._emit(r)}_onCoverColorChange(e,t){const o=this._baseConfig(),i=[...o.cover_colors??[]];for(;i.length<=e;)i.push(null);i[e]=t,this._emitWithColors(o,i)}_onCoverColorReset(e){const t=this._baseConfig(),o=[...t.cover_colors??[]];e<o.length&&(o[e]=null),this._emitWithColors(t,o)}_onEntryToggle(e,t){const o=this._baseConfig(),i=new Set(o.entry_ids);t?i.add(e):i.delete(e);const s=(this._entries??[]).map(e=>e.entry_id).filter(e=>i.has(e)),n=o.cover_colors??[],r=s.map(e=>{const t=o.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(o,r,{entry_ids:s})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),o=Number.isFinite(t)?t:0;this._emit({...this._baseConfig(),north_offset:o})}_onTitleChange(e){const t=e.target.value,o=this._baseConfig();if(t)this._emit({...o,title:t});else{const{title:e,...t}=o;this._emit(t)}}render(){if(!this._config)return V;const e=new Set(this._config.entry_ids);return H`
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

        ${this._config.entry_ids.length>0?H`
              <div class="section">
                <label class="field-label">${Le("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${Le("editor.compass.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const o=this._config.cover_colors?.[t]??null,i=o??Ct(t),s=this._entries?.find(t=>t.entry_id===e);return H`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${i}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${s?.title??e}</span>
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
            `:V}

        <div class="section">
          <label class="field-label">${Le("editor.compass.display",this.hass)}</label>
          ${ho.map(e=>H`
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
        ${to(this.hass)}
      </div>
    `}_renderEntryPicker(e){return this._entriesError?H`<div class="error">
        ${Le("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?H`
        <div class="error">
          ${Le("editor.common.no_entries",this.hass)}
          <code>${Le("editor.common.no_entries_path",this.hass)}</code>${Le("editor.common.no_entries_then",this.hass)}
        </div>
      `:H`
      <div class="entry-list">
        ${this._entries.map(t=>H`
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
    `:H`<div class="hint">${Le("editor.common.loading_entries",this.hass)}</div>`}};po.styles=r`
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
  `,e([_e({attribute:!1})],po.prototype,"hass",void 0),e([ge()],po.prototype,"_config",void 0),e([ge()],po.prototype,"_entries",void 0),e([ge()],po.prototype,"_entriesError",void 0),po=e([he(be)],po);let uo=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");this._config={...e,entry_ids:[...e.entry_ids]}}getCardSize(){return 4}static async getConfigElement(){return document.createElement(be)}static async getStubConfig(e){let t=[];try{const o=await Be(e);o[0]&&(t=[o[0].entry_id])}catch{}return{type:`custom:${ye}`,entry_ids:t}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ye(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Je(this.hass).then(e=>{this._registry=e,this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return V;if(null===this._registry)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Le("tile.registry_failed",this.hass,{error:this._registryError}):Le("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=[],t=[];for(const o of this._config.entry_ids){const i=je(this.hass,{type:this._config.type,entry_id:o},this._registry);i?e.push(i):t.push(o)}if(0===e.length)return H`<ha-card>
        <div class="empty">
          <p><strong>${Le("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${Le("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const o=this._config;return H`
      <ha-card>
        ${o.title?H`<div class="card-header">${o.title}</div>`:V}
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
          .northOffsetDeg=${Ke(o.north_offset??0)}
        ></acp-sky-compass>
        ${!1!==o.show_elevation_chart?H`<acp-elevation-chart
              .hass=${this.hass}
              .discoveredList=${e}
              .coverColors=${o.cover_colors??[]}
              ?compact=${!!o.compact}
            ></acp-elevation-chart>`:V}
        ${t.length>0?H`<div class="warn dim">
              ${Le("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:V}
      </ha-card>
    `}};uo.styles=r`
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
  `,e([_e({attribute:!1})],uo.prototype,"hass",void 0),e([ge()],uo.prototype,"_config",void 0),e([ge()],uo.prototype,"_registry",void 0),e([ge()],uo.prototype,"_registryError",void 0),uo=e([he(ye)],uo),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ye)||window.customCards.push({type:ye,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const _o=["sky","elevation","decision","covers","overrides","climate"];let go=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let e=null,t=null;return(o,i,s)=>{const n=i.entry_id??"";return null!==e&&e.registry===s&&e.hass===o&&e.entryId===n||(e={registry:s,hass:o,entryId:n},t=je(o,i,s)),t}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(e){if(!e?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...e},null===this._registry){const t=et.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(fe)}static async getStubConfig(e){let t="";try{const o=await Be(e);t=o[0]?.entry_id??""}catch{}return{type:`custom:${ve}`,entry_id:t}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(e){null!==this._registry&&this._config&&this.hass&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ye(this.hass,e=>{const t=new Set(ot(this._registry??[],this._config?.entry_id??"").map(e=>e.entity_id));(function(e,t){return"create"===e.action||t.has(e.entity_id)})(e,t)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Je(this.hass).then(e=>{const t=this._config?.entry_id;if(t){const o=ot(e,t);(null===this._registry||function(e,t){if(e.length!==t.length)return!0;const o=new Map(e.map(e=>[e.entity_id,tt(e)]));for(const e of t)if(o.get(e.entity_id)!==tt(e))return!0;return!1}(ot(this._registry,t),o))&&(this._registry=e,et.set(t,o))}else this._registry=e;this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const e=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=e);const t=e-this._debounceFirstAt,o=this._DEBOUNCE_MAX-t,i=Math.min(this._DEBOUNCE_DELAY,o);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),i<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},i)}get _sections(){return this._config?.show_sections??_o}_renderHeader(e,t){const o=Ae[e.cover_type]??"mdi:window-shutter",i=e.entities.integration_enabled_switch,s=e.entities.automatic_control_switch,n=!i||"on"===this.hass.states[i]?.state,r=!s||"on"===this.hass.states[s]?.state;return H`
      <div class="header">
        <ha-icon .icon=${o}></ha-icon>
        <span class="title">${e.entry_title}</span>
        <span class="spacer"></span>
        ${i?H`<acp-header-pill
              .on=${n}
              .readonly=${!t.integration_enabled}
              .label=${Le(n?"header.on":"header.off",this.hass)}
              title=${Le("header.integration_enabled",this.hass)}
              @pill-click=${()=>this._toggle(i)}
            ></acp-header-pill>`:V}
        ${s?H`<acp-header-pill
              .on=${r}
              .readonly=${!t.automatic_control}
              .label=${Le("header.auto",this.hass)}
              title=${Le("header.automatic_control",this.hass)}
              @pill-click=${()=>this._toggle(s)}
            ></acp-header-pill>`:V}
      </div>
    `}_toggle(e){const t=e.split(".")[0];this.hass.callService(t,"toggle",{entity_id:e})}_renderLoading(){return H`
      <ha-card>
        <div class="empty">
          <p class="dim">${Le("root.loading_registry",this.hass)}</p>
        </div>
      </ha-card>
    `}_renderEmpty(e){const t=this._config.entry_id,o=this._registry?.length??0,i=this._registry?.filter(e=>e.config_entry_id===t&&"adaptive_cover_pro"===e.platform).length;return H`
      <ha-card>
        <div class="empty">
          <p><strong>${Le("root.no_entities_title",this.hass)}</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${t}</code></p>
          <ul class="diag">
            <li>Reason: <code>${e}</code></li>
            <li>Registry entries loaded: <code>${o}</code></li>
            <li>ACP entities matching entry_id: <code>${i??"—"}</code></li>
            ${this._registryError?H`<li>Registry fetch error: <code>${this._registryError}</code></li>`:V}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return V;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const e=this._discovered;if(!e)return this._renderEmpty("no matching entities after unique_id lookup");const t=(o=this._config,{...Te,...o?.controls});var o;const i=this._sections;return H`
      <ha-card>
        ${this._renderHeader(e,t)}
        <div class="body ${this._config.compact?"compact":""}">
          ${i.includes("sky")?H`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${[e]}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .northOffsetDeg=${Ke(this._config.north_offset??0)}
              ></acp-sky-compass>`:V}
          ${i.includes("elevation")?H`<acp-elevation-chart
                .hass=${this.hass}
                .discoveredList=${[e]}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:V}
          ${i.includes("decision")?H`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                ?show-summary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:V}
          ${i.includes("covers")?H`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:V}
          ${i.includes("overrides")?H`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .resetEnabled=${t.reset_manual_override}
              ></acp-overrides-panel>`:V}
          ${i.includes("climate")?H`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:V}
        </div>
      </ha-card>
    `}};go.styles=r`
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
  `,e([_e({attribute:!1})],go.prototype,"hass",void 0),e([ge()],go.prototype,"_config",void 0),e([ge()],go.prototype,"_registry",void 0),e([ge()],go.prototype,"_registryError",void 0),e([ge()],go.prototype,"_discovered",void 0),go=e([he(ve)],go),window.customCards=window.customCards||[],window.customCards.push({type:ve,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${me} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{go as AdaptiveCoverProCard};
