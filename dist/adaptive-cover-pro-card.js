/*! adaptive-cover-pro-card v2.0.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function e(e,t,s,o){var i,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,s):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,o);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(n<3?i(r):n>3?i(t,s,r):i(t,s))||r);return n>3&&r&&Object.defineProperty(t,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;let n=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&i.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[o+1],e[0]);return new n(s,e,o)},a=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,m=_.trustedTypes,g=m?m.emptyScript:"",v=_.reactiveElementPolyfillSupport,f=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},b=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),o=this.getPropertyDescriptor(e,s,t);void 0!==o&&c(this.prototype,e,o)}}static getPropertyDescriptor(e,t,s){const{get:o,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const n=o?.call(this);i?.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,o)=>{if(s)e.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of o){const o=document.createElement("style"),i=t.litNonce;void 0!==i&&o.setAttribute("nonce",i),o.textContent=s.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,s);if(void 0!==o&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(t,s.type);this._$Em=e,null==i?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(e,t){const s=this.constructor,o=s._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=s.getPropertyOptions(o),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=o;const n=i.fromAttribute(t,e.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(e,t,s,o=!1,i){if(void 0!==e){const n=this.constructor;if(!1===o&&(i=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??b)(i,t)||s.useDefault&&s.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:o,wrapped:i},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==i||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,s,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,v?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=e=>e,C=x.trustedTypes,A=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+E,z=`<${P}>`,O=document,T=()=>O.createComment(""),M=e=>null===e||"object"!=typeof e&&"function"!=typeof e,I=Array.isArray,F="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,L=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,H=/"/g,q=/^(?:script|style|textarea|title)$/i,U=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),B=U(1),W=U(2),V=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),G=new WeakMap,Z=O.createTreeWalker(O,129);function Y(e,t){if(!I(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const J=(e,t)=>{const s=e.length-1,o=[];let i,n=2===t?"<svg>":3===t?"<math>":"",r=N;for(let t=0;t<s;t++){const s=e[t];let a,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===N?"!--"===l[1]?r=R:void 0!==l[1]?r=D:void 0!==l[2]?(q.test(l[2])&&(i=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=i??N,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?L:'"'===l[3]?H:j):r===H||r===j?r=L:r===R||r===D?r=N:(r=L,i=void 0);const h=r===L&&e[t+1].startsWith("/>")?" ":"";n+=r===N?s+z:c>=0?(o.push(a),s.slice(0,c)+S+s.slice(c)+E+h):s+E+(-2===c?t:h)}return[Y(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class X{constructor({strings:e,_$litType$:t},s){let o;this.parts=[];let i=0,n=0;const r=e.length-1,a=this.parts,[l,c]=J(e,t);if(this.el=X.createElement(l,s),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=Z.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(S)){const t=c[n++],s=o.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:i,name:r[2],strings:s,ctor:"."===r[1]?oe:"?"===r[1]?ie:"@"===r[1]?ne:se}),o.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:i}),o.removeAttribute(e));if(q.test(o.tagName)){const e=o.textContent.split(E),t=e.length-1;if(t>0){o.textContent=C?C.emptyScript:"";for(let s=0;s<t;s++)o.append(e[s],T()),Z.nextNode(),a.push({type:2,index:++i});o.append(e[t],T())}}}else if(8===o.nodeType)if(o.data===P)a.push({type:2,index:i});else{let e=-1;for(;-1!==(e=o.data.indexOf(E,e+1));)a.push({type:7,index:i}),e+=E.length-1}i++}}static createElement(e,t){const s=O.createElement("template");return s.innerHTML=e,s}}function Q(e,t,s=e,o){if(t===V)return t;let i=void 0!==o?s._$Co?.[o]:s._$Cl;const n=M(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),void 0===n?i=void 0:(i=new n(e),i._$AT(e,s,o)),void 0!==o?(s._$Co??=[])[o]=i:s._$Cl=i),void 0!==i&&(t=Q(e,i._$AS(e,t.values),i,o)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,o=(e?.creationScope??O).importNode(t,!0);Z.currentNode=o;let i=Z.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new te(i,i.nextSibling,this,e):1===a.type?t=new a.ctor(i,a.name,a.strings,this,e):6===a.type&&(t=new re(i,this,e)),this._$AV.push(t),a=s[++r]}n!==a?.index&&(i=Z.nextNode(),n++)}return Z.currentNode=O,o}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,o){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),M(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>I(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,o="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=X.createElement(Y(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new ee(o,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new X(e)),t}k(e){I(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,o=0;for(const i of e)o===t.length?t.push(s=new te(this.O(T()),this.O(T()),this,this.options)):s=t[o],s._$AI(i),o++;o<t.length&&(this._$AR(s&&s._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class se{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,o,i){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=K}_$AI(e,t=this,s,o){const i=this.strings;let n=!1;if(void 0===i)e=Q(this,e,t,0),n=!M(e)||e!==this._$AH&&e!==V,n&&(this._$AH=e);else{const o=e;let r,a;for(e=i[0],r=0;r<i.length-1;r++)a=Q(this,o[s+r],t,r),a===V&&(a=this._$AH[r]),n||=!M(a)||a!==this._$AH[r],a===K?e=K:e!==K&&(e+=(a??"")+i[r+1]),this._$AH[r]=a}n&&!o&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class oe extends se{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class ie extends se{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class ne extends se{constructor(e,t,s,o,i){super(e,t,s,o,i),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??K)===V)return;const s=this._$AH,o=e===K&&s!==K||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==K&&(s===K||o);o&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const ae=x.litHtmlPolyfillSupport;ae?.(X,te),(x.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const o=s?.renderBefore??t;let i=o._$litPart$;if(void 0===i){const e=s?.renderBefore??null;o._$litPart$=i=new te(t.insertBefore(T(),e),e,void 0,s??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ue=(e=pe,t,s)=>{const{kind:o,metadata:i}=s;let n=globalThis.litPropertyMetadata.get(i);if(void 0===n&&globalThis.litPropertyMetadata.set(i,n=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),n.set(s.name,e),"accessor"===o){const{name:o}=s;return{set(s){const i=t.get.call(this);t.set.call(this,s),this.requestUpdate(o,i,e,!0,s)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=s;return function(s){const i=this[o];t.call(this,s),this.requestUpdate(o,i,e,!0,s)}}throw Error("Unsupported decorator location: "+o)};function _e(e){return(t,s)=>"object"==typeof s?ue(e,t,s):((e,t,s)=>{const o=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),o?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function me(e){return _e({...e,state:!0,attribute:!1})}const ge="2.0.0",ve="adaptive-cover-pro-card",fe="adaptive-cover-pro-card-editor",ye="adaptive-cover-pro-sky-compass-card",be="adaptive-cover-pro-sky-compass-card-editor",$e="adaptive-cover-pro-tile-card",we="adaptive-cover-pro-tile-card-editor",xe="adaptive_cover_pro",ke=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default"],Ce={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},Ae={force:"handler.force",weather:"handler.weather",manual:"handler.manual",custom_position:"handler.custom_position",motion:"handler.motion",cloud:"handler.cloud",climate:"handler.climate",glare_zone:"handler.glare_zone",solar:"handler.solar",default:"handler.default"},Se={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},Ee={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open"},Pe={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds"},ze={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion"},Oe={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Sun tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Motion",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"}},Te={auto:"badge.auto",manual:"badge.manual",force:"badge.force",weather:"badge.weather",glare_zone:"badge.glare_zone",climate:"badge.climate",cloud:"badge.cloud",custom_position:"badge.custom_position",solar:"badge.solar",motion:"badge.motion",off:"badge.off"},Me={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Ie={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"},Fe={en:{handler:{force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Weather safety",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Sun tracking",motion:"Motion idle",off:"Off"},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window field of view",fov_exit:"Sun leaves window field of view"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks."},dialog:{configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"floor",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Motion",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Motion",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"expires in {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance"},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in FOV",in_fov:"in FOV",none:"—",sun:"Sun",moon:"Moon",sun_hitting:"Sun (hitting window)",sun_in_fov_invalid:"Sun (in FOV, not valid)",sun_outside_fov:"Sun (outside FOV)",window_fov:"Window FOV",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_closed:"Cover closed",window_normal:"Window normal",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"FOV {left} left / {right} right{elev}",window_normal_tooltip:"Window normal: {bearing}",cover_extended:"Cover extended: {pct}%",cover_closed_tooltip:"Cover closed: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",click_to_set:"Click to set position",target_tooltip:"Target {pct}%"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor"},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Motion timeout pending",motion_detected:"Motion detected",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",resume:"Resume",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found."},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"FOV: {from} → {to}",no_fov_today:"Sun does not enter FOV today",placeholder:"Sun elevation chart unavailable."},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window FOV, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with FOV band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, motion tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers.",show_version_label:"Show version tag",show_version_desc:"Display card version at the bottom."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",show_compass:"Show sun compass in dialog",show_motion_icon:"Show motion indicator",show_resume:"Resume button",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",resume_option_auto:"Auto (manual override or custom position)",resume_option_always:"Always (when reset button is available)",resume_option_never:"Never",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth."}}},fr:{handler:{force:"Dérogation forcée",weather:"Sécurité météo",manual:"Dérogation manuelle",custom_position:"Position personnalisée",motion:"Délai d'inactivité du mouvement",cloud:"Désactivation par temps nuageux",climate:"Climatique",glare_zone:"Zone d'éblouissement",solar:"Suivi solaire",default:"Par défaut"},badge:{auto:"Auto",manual:"Manuel",force:"Forcé",weather:"Sécurité météo",glare_zone:"Éblouissement",climate:"Climatique",cloud:"Nuageux",custom_position:"Personnalisé",solar:"Suivi solaire",motion:"Inactivité",off:"Off"},forecast:{event:{sunrise:"Lever du soleil",sunset:"Coucher du soleil",fov_enter:"Le soleil entre dans le champ de vision de la fenêtre",fov_exit:"Le soleil quitte le champ de vision de la fenêtre"},hover_hint:"Survolez la courbe pour voir l'heure et la position prévue ; survolez une ligne colorée pour voir l'événement qu'elle indique."},dialog:{configure_integration:"Configurer l'intégration",open_device_page:"Ouvrir la page de l'appareil",close:"Fermer",target:"Cible",resume_auto:"Reprendre l'automatique",hide_advanced:"▼ Masquer les options avancées",show_advanced:"▶ Afficher les options avancées",custom_positions:"Positions personnalisées",floor_tooltip:"Plancher — cette valeur force une position minimale au-dessus du calcul automatique",floor:"plancher",disable_slot:"Désactiver le créneau {slot}",enable_slot:"Activer le créneau {slot}",on:"Activé",off:"Désactivé",controls:"Commandes",automatic:"Automatique",climate:"Climatique",motion:"Mouvement",toggle_hint:"{label} {state} — appuyez pour basculer",state_on:"activé",state_off:"désactivé",todays_forecast:"Prévisions du jour"},overrides:{title:"Dérogations",manual:"Manuel",force:"Forcé",motion:"Mouvement",active:"Actif",off:"Désactivé",ends_in:"se termine dans {time}",active_count:"{count} dérogation(s) active(s)",timeout:"expire dans {time}",reset_manual:"Réinitialiser le mode manuel"},climate:{title:"Climatique",active:"Actif : {strategy}",indoor:"Intérieur",outdoor:"Extérieur",presence:"Présence",sunny:"Ensoleillé",lux:"Lux",irradiance:"Irradiance"},compass:{placeholder_no_entries:"Aucune instance Adaptive Cover Pro sélectionnée.",placeholder_no_sun:"Le capteur solaire n'est pas encore renseigné.",sun_tooltip:"Soleil : {az} az / {el} él",sunrise_tooltip:"Lever du soleil : {time}",sunset_tooltip:"Coucher du soleil : {time}",moon_tooltip:"Lune : {phase} ({pct}%)",sun_path_tooltip:"Trajectoire solaire (aujourd'hui)",in_fov_check:"✓ dans le champ de vision",in_fov:"dans le champ de vision",none:"—",sun:"Soleil",moon:"Lune",sun_hitting:"Soleil (frappe la fenêtre)",sun_in_fov_invalid:"Soleil (dans le champ de vision, non valide)",sun_outside_fov:"Soleil (hors du champ de vision)",window_fov:"Champ de vision",sun_path:"Trajectoire solaire",sunrise:"Lever du soleil",sunset:"Coucher du soleil",cover_closed:"Store fermé",window_normal:"Axe de la fenêtre",stat_sun:"Soleil : ",stat_azi:"Azi : ",stat_elev:"Élév : ",stat_window:"Fenêtre : ",active_sun_arc:"Arc solaire actif {from} – {to}{elev}",fov_arc:"Champ de vision {left} gauche / {right} droite{elev}",window_normal_tooltip:"Axe de la fenêtre : {bearing}",cover_extended:"Store déployé : {pct}%",cover_closed_tooltip:"Store fermé : {pct}%",blind_spot:"Soleil masqué : {from} - {to}",elev_suffix:" · élév {min}–{max}"},covers:{placeholder:"Aucun store signalé par l'intégration.",title:"Stores",target:"Cible : {pct}",click_to_set:"Cliquer pour définir la position",target_tooltip:"Cible {pct}%"},decision:{placeholder:"La trace de décision n'est pas encore renseignée.",pipeline:"Pipeline",winner:"Actif : {name}",summary_tooltip:"Pourquoi cette position ?",not_evaluated:"non évalué",floor_suffix:" plancher"},header:{on:"ON",off:"OFF",integration_enabled:"Intégration activée",auto:"Auto",automatic_control:"Contrôle automatique"},tile:{motion_pending:"Délai de mouvement en cours",motion_detected:"Mouvement détecté",open:"Ouvrir",stop:"Arrêter",close:"Fermer",resume_aria:"Reprendre le contrôle automatique",resume:"Reprendre",registry_failed:"Échec de la récupération du registre : {error}",loading:"Chargement…",entry_not_found:"Instance Adaptive Cover Pro {entry} introuvable."},formatters:{expired:"expiré"},elevation:{title:"Soleil aujourd'hui",fov_window:"Champ de vision : {from} → {to}",no_fov_today:"Pas de soleil dans le champ de vision aujourd'hui",placeholder:"Graphique d'élévation solaire indisponible."},root:{loading_registry:"Chargement du registre Adaptive Cover Pro…",no_entities_title:"Aucune entité Adaptive Cover Pro trouvée",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Aucune entité Adaptive Cover Pro correspondante",compass_configured:"Instances configurées : {entries}",compass_not_found:"Instances introuvables : {entries}"},editor:{common:{entry_id:"Instance Adaptive Cover Pro",title_optional:"Titre (facultatif)",title_placeholder:"ex. Fenêtres côté ouest",north_offset:"Décalage nord de la boussole (°)",north_offset_hint:"Faites pivoter la boussole dans le sens horaire pour que « haut » corresponde à votre carte. Par défaut : 0.",loading_entries:"Chargement des entrées de configuration Adaptive Cover Pro…",load_failed:"Échec du chargement des entrées de configuration : {error}",no_entries:"Aucune entrée de configuration Adaptive Cover Pro trouvée. Ajoutez une instance sous",no_entries_path:"Paramètres → Appareils et services",no_entries_then:", puis revenez ici.",entry_id_manual_placeholder:"Saisir manuellement l'ID d'entrée de configuration",entry_id_fallback_label:"ID d'entrée",unknown_entry:"(inconnu : {entry})",reset:"Réinitialiser"},main:{sections:"Sections",sections_hint:"Activer ou désactiver les parties de la carte affichées.",section_sky_label:"Boussole céleste",section_sky_desc:"Soleil par rapport au champ de vision de la fenêtre, tracé polaire",section_elevation_label:"Soleil aujourd'hui",section_elevation_desc:"Graphique élévation/temps avec bande FOV et curseur temps réel",section_decision_label:"Bande de décision",section_decision_desc:"Les 10 gestionnaires du pipeline avec la ligne gagnante mise en évidence",section_covers_label:"Positions des stores",section_covers_desc:"Barres position réelle/cible par store ; cliquer pour définir la position",section_overrides_label:"Panneau des dérogations",section_overrides_desc:"Tuiles Manuel, Forcé, Mouvement + bouton de réinitialisation",section_climate_label:"Panneau climatique",section_climate_desc:"Stratégie été/hiver/intermédiaire (masqué automatiquement si le mode climatique est désactivé)",controls:"Commandes",controls_hint:"Afficher en lecture seule (visible mais non cliquable).",integration_pill_label:"Bouton ON/OFF de l'intégration",integration_pill_desc:"Permettre de basculer l'intégration depuis l'en-tête de la carte.",automatic_pill_label:"Bouton contrôle automatique",automatic_pill_desc:"Permettre de basculer le contrôle automatique depuis l'en-tête de la carte.",reset_button_label:"Bouton de réinitialisation de la dérogation manuelle",reset_button_desc:"Permettre d'appuyer sur la tuile de réinitialisation dans le panneau des dérogations.",display:"Affichage",compact_label:"Mode compact",compact_desc:"Espacement réduit entre les sections.",show_compass_stats_label:"Afficher les statistiques de la boussole",show_compass_stats_desc:"Azi, Élév, ∠ et angle de fenêtre sous la boussole céleste.",show_compass_legend_label:"Afficher la légende de la boussole",show_compass_legend_desc:"Clé de couleur sous la boussole céleste.",show_moon_label:"Afficher la lune sur la boussole",show_moon_desc:"Position et phase de la lune en superposition sur la boussole céleste.",hide_inactive_label:"Masquer les gestionnaires inactifs",hide_inactive_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs.",show_version_label:"Afficher l'étiquette de version",show_version_desc:"Afficher la version de la carte en bas."},tile:{name:"Titre personnalisé",icon:"Icône personnalisée",cover:"Entité de store",layout:"Disposition",show_position:"Afficher la position %",show_state:"Afficher l'état (Ouvert/Fermé)",show_decision_summary:"Afficher le résumé de décision",show_controls:"Afficher les commandes ↑■▼",show_badge:"Afficher le badge contextuel",show_compass:"Afficher la boussole solaire dans le dialogue",show_motion_icon:"Afficher l'indicateur de mouvement",show_resume:"Bouton Reprendre",tap_action:"Action au toucher",hold_action:"Action au maintien",double_tap_action:"Action au double toucher",cover_blank_hint:"Laisser vide pour utiliser automatiquement le premier store géré.",resume_option_auto:"Auto (dérogation manuelle ou position personnalisée)",resume_option_always:"Toujours (quand le bouton de réinitialisation est disponible)",resume_option_never:"Jamais",layout_option_one_line:"Une ligne (compact)",layout_option_detailed:"Détaillé (titre, état, indicateurs)"},compass:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition à la boussole.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"SVG plus petit, légende masquée.",toggle_legend_label:"Légende",toggle_legend_desc:"Échantillons de couleur et étiquettes d'instance sous la boussole.",toggle_stats_label:"Statistiques",toggle_stats_desc:"Soleil + lignes numériques par fenêtre.",toggle_moon_label:"Lune",toggle_moon_desc:"Afficher la position et la phase de la lune.",toggle_cardinals_label:"Points cardinaux",toggle_cardinals_desc:"Lettres N/E/S/O autour de la boussole.",toggle_blind_spot_label:"Zones de soleil masqué",toggle_blind_spot_desc:"Secteurs hachurés pour la plage où le soleil est masqué de chaque fenêtre.",toggle_sun_path_label:"Trajectoire solaire",toggle_sun_path_desc:"Arc solaire du jour dans le ciel.",toggle_sunrise_sunset_label:"Repères lever / coucher du soleil",toggle_sunrise_sunset_desc:"Petits points aux azimuts de lever et coucher du soleil.",toggle_cover_fill_label:"Remplissage de fermeture du store",toggle_cover_fill_desc:"Secteur intérieur indiquant le taux de fermeture de chaque store.",toggle_window_arrow_label:"Flèche de normale de fenêtre",toggle_window_arrow_desc:"Ligne du centre vers l'azimut de chaque fenêtre."}}}};function Ne(e,t){const s=t.split(".");let o=e;for(const e of s){if("object"!=typeof o||null===o)return;o=o[e]}return"string"==typeof o?o:void 0}function Re(e,t){return t?e.replace(/\{(\w+)\}/g,(e,s)=>Object.prototype.hasOwnProperty.call(t,s)?String(t[s]):e):e}function De(e,t,s){const o=function(e){const t=(e?.locale?.language??e?.language??"en").toLowerCase().split("-")[0];return t in Fe?t:"en"}(t),i=Ne(Fe[o],e);if(void 0!==i)return Re(i,s);if("en"!==o){const t=Ne(Fe.en,e);if(void 0!==t)return Re(t,s)}return e}function Le(e,t,s){const o=t.entry_id;if(!o)return null;const i={},n=`${o}_`;let r,a=!1;for(const e of s){if(e.config_entry_id!==o)continue;if(e.platform!==xe)continue;if(a=!0,!r&&e.device_id&&(r=e.device_id),!e.unique_id.startsWith(n))continue;const t=e.unique_id.slice(n.length),s=e.entity_id.split(".")[0],l=Ie[`${s}:${t}`];l&&(i[l]=e.entity_id)}if(!a||0===Object.keys(i).length)return null;const l=e;let c=o;if(l.devices)for(const e of Object.values(l.devices))if(e.config_entries?.includes(o)){c=e.name_by_user??e.name??o;break}const d=[],h=i.target_position_sensor;if(h){const t=e.states[h]?.attributes?.actual_positions;t&&d.push(...Object.keys(t))}let p="cover_blind";const u=i.control_status_sensor;if(u){const t=e.states[u]?.attributes;t?.cover_type&&(p=t.cover_type)}return{entry_id:o,entry_title:c,cover_type:p,entities:i,managed_covers:d,device_id:r}}function je(e,t,s=0){const o=(e-90+s)*Math.PI/180;return{x:t*Math.cos(o),y:t*Math.sin(o)}}function He(e){return 1-Math.max(0,Math.min(90,e))/90}function qe(e,t,s,o=0,i=0){const n=e=>(e%360+360)%360,r=n(e),a=n(t);let l=a-r;l<0&&(l+=360);const c=l>180?1:0,d=je(r,s,i),h=je(a,s,i);if(o<=0)return`M 0 0 L ${d.x} ${d.y} A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y} Z`;const p=je(a,o,i),u=je(r,o,i);return[`M ${d.x} ${d.y}`,`A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y}`,`L ${p.x} ${p.y}`,`A ${o} ${o} 0 ${c} 0 ${u.x} ${u.y}`,"Z"].join(" ")}function Ue(e,t,s=0){return je(e,He(t),s)}function Be(e){return(e%360+360)%360}async function We(e){return e.callWS({type:"config/entity_registry/list"})}function Ve(e,t){let s=null,o=!1;return e.connection.subscribeEvents(e=>t(e.data),"entity_registry_updated").then(e=>{o?e():s=e}).catch(()=>{}),()=>{o=!0,s&&s()}}function Ke(e){return`acp-card:registry:v1:${e}`}const Ge={get(e){try{const t=localStorage.getItem(Ke(e));if(!t)return null;const s=JSON.parse(t);return 1!==s.schemaVersion?null:s}catch{return null}},set(e,t){try{const s={schemaVersion:1,cardVersion:ge,fetchedAt:Date.now(),entries:t};localStorage.setItem(Ke(e),JSON.stringify(s))}catch{}},invalidate(e){try{localStorage.removeItem(Ke(e))}catch{}},clear(){try{const e="acp-card:registry:v1:",t=[];for(let s=0;s<localStorage.length;s++){const o=localStorage.key(s);o?.startsWith(e)&&t.push(o)}t.forEach(e=>localStorage.removeItem(e))}catch{}}};function Ze(e){return`${e.entity_id}|${e.unique_id}|${e.platform}|${e.config_entry_id??""}`}function Ye(e,t,s){return e.filter(e=>e.config_entry_id===t&&void 0===s)}let Je=class extends ce{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return B`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":K}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};Je.styles=r`
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
  `,e([_e({type:Boolean})],Je.prototype,"on",void 0),e([_e({type:Boolean})],Je.prototype,"readonly",void 0),e([_e({type:String})],Je.prototype,"label",void 0),e([_e({type:String})],Je.prototype,"title",void 0),Je=e([he("acp-header-pill")],Je);class Xe{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const Qe=(et=class extends Xe{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const s=e.element.classList;for(const e of this.st)e in t||(s.remove(e),this.st.delete(e));for(const e in t){const o=!!t[e];o===this.st.has(e)||this.nt?.has(e)||(o?(s.add(e),this.st.add(e)):(s.remove(e),this.st.delete(e)))}return V}},(...e)=>({_$litDirective$:et,values:e}));var et;function tt(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var st,ot,it={exports:{}},nt=(st||(st=1,ot=it,function(){var e=Math.PI,t=Math.sin,s=Math.cos,o=Math.tan,i=Math.asin,n=Math.atan2,r=Math.acos,a=e/180,l=864e5,c=2440588,d=2451545;function h(e){return new Date((e+.5-c)*l)}function p(e){return function(e){return e.valueOf()/l-.5+c}(e)-d}var u=23.4397*a;function _(e,i){return n(t(e)*s(u)-o(i)*t(u),s(e))}function m(e,o){return i(t(o)*s(u)+s(o)*t(u)*t(e))}function g(e,i,r){return n(t(e),s(e)*t(i)-o(r)*s(i))}function v(e,o,n){return i(t(o)*t(n)+s(o)*s(n)*s(e))}function f(e,t){return a*(280.16+360.9856235*e)-t}function y(e){return a*(357.5291+.98560028*e)}function b(s){return s+a*(1.9148*t(s)+.02*t(2*s)+3e-4*t(3*s))+102.9372*a+e}function $(e){var t=b(y(e));return{dec:m(t,0),ra:_(t,0)}}var w={getPosition:function(e,t,s){var o=a*-s,i=a*t,n=p(e),r=$(n),l=f(n,o)-r.ra;return{azimuth:g(l,i,r.dec),altitude:v(l,i,r.dec)}}},x=w.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];w.addTime=function(e,t,s){x.push([e,t,s])};var k=9e-4;function C(t,s,o){return k+(t+s)/(2*e)+o}function A(e,s,o){return d+e+.0053*t(s)-.0069*t(2*o)}function S(e,o,i,n,a,l,c){var d=function(e,o,i){return r((t(e)-t(o)*t(i))/(s(o)*s(i)))}(e,i,n);return A(C(d,o,a),l,c)}function E(e){var o=a*(134.963+13.064993*e),i=a*(93.272+13.22935*e),n=a*(218.316+13.176396*e)+6.289*a*t(o),r=5.128*a*t(i),l=385001-20905*s(o);return{ra:_(n,r),dec:m(n,r),dist:l}}function P(e,t){return new Date(e.valueOf()+t*l/24)}w.getTimes=function(t,s,o,i){var n,r,l,c,d,u=a*-o,_=a*s,g=function(e){return-2.076*Math.sqrt(e)/60}(i=i||0),v=function(t,s){return Math.round(t-k-s/(2*e))}(p(t),u),f=C(0,u,v),$=y(f),w=b($),E=m(w,0),P=A(f,$,w),z={solarNoon:h(P),nadir:h(P-.5)};for(n=0,r=x.length;n<r;n+=1)d=P-((c=S(((l=x[n])[0]+g)*a,u,_,E,v,$,w))-P),z[l[1]]=h(d),z[l[2]]=h(c);return z},w.getMoonPosition=function(e,i,r){var l=a*-r,c=a*i,d=p(e),h=E(d),u=f(d,l)-h.ra,_=v(u,c,h.dec),m=n(t(u),o(c)*s(h.dec)-t(h.dec)*s(u));return _+=function(e){return e<0&&(e=0),2967e-7/Math.tan(e+.00312536/(e+.08901179))}(_),{azimuth:g(u,c,h.dec),altitude:_,distance:h.dist,parallacticAngle:m}},w.getMoonIllumination=function(e){var o=p(e||new Date),i=$(o),a=E(o),l=149598e3,c=r(t(i.dec)*t(a.dec)+s(i.dec)*s(a.dec)*s(i.ra-a.ra)),d=n(l*t(c),a.dist-l*s(c)),h=n(s(i.dec)*t(i.ra-a.ra),t(i.dec)*s(a.dec)-s(i.dec)*t(a.dec)*s(i.ra-a.ra));return{fraction:(1+s(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},w.getMoonTimes=function(e,t,s,o){var i=new Date(e);o?i.setUTCHours(0,0,0,0):i.setHours(0,0,0,0);for(var n,r,l,c,d,h,p,u,_,m,g,v,f,y=.133*a,b=w.getMoonPosition(i,t,s).altitude-y,$=1;$<=24&&(n=w.getMoonPosition(P(i,$),t,s).altitude-y,u=((d=(b+(r=w.getMoonPosition(P(i,$+1),t,s).altitude-y))/2-n)*(p=-(h=(r-b)/2)/(2*d))+h)*p+n,m=0,(_=h*h-4*d*n)>=0&&(g=p-(f=Math.sqrt(_)/(2*Math.abs(d))),v=p+f,Math.abs(g)<=1&&m++,Math.abs(v)<=1&&m++,g<-1&&(g=v)),1===m?b<0?l=$+g:c=$+g:2===m&&(l=$+(u<0?v:g),c=$+(u<0?g:v)),!l||!c);$+=2)b=r;var x={};return l&&(x.rise=P(i,l)),c&&(x.set=P(i,c)),l||c||(x[u>0?"alwaysUp":"alwaysDown"]=!0),x},ot.exports=w}()),it.exports),rt=tt(nt);function at(e,t,s,o=10){const i=[],n=s.getTime()+864e5;for(let r=s.getTime();r<=n;r+=60*o*1e3){const s=new Date(r),o=rt.getPosition(s,e,t);i.push({t:s,elevation:180*o.altitude/Math.PI,azimuth:((180*o.azimuth/Math.PI+180)%360+360)%360})}return i}function lt(e=new Date){const t=new Date(e);return t.setHours(0,0,0,0),t}function ct(e,t,s,o){const i=((t-s)%360+360)%360;return((e-i)%360+360)%360<=((((t+o)%360+360)%360-i)%360+360)%360}function dt(e,t,s=new Date){const o=rt.getMoonPosition(s,e,t),i=rt.getMoonIllumination(s);return{azimuth:((180*o.azimuth/Math.PI+180)%360+360)%360,elevation:180*o.altitude/Math.PI,phase:i.phase,fraction:i.fraction,phaseName:ht(i.phase)}}function ht(e){return e<.0625||e>=.9375?"New Moon":e<.1875?"Waxing Crescent":e<.3125?"First Quarter":e<.4375?"Waxing Gibbous":e<.5625?"Full Moon":e<.6875?"Waning Gibbous":e<.8125?"Last Quarter":"Waning Crescent"}function pt(e){return null==e||Number.isNaN(e)?"—":`${Math.round(e)}%`}function ut(e){return null==e||Number.isNaN(e)?"—":`${e.toFixed(1)}°`}function _t(e){if(!e)return"—";const t=new Date(e);return Number.isNaN(t.getTime())?"—":t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function mt(e,t){if(!e)return"—";const s=new Date(e).getTime();if(Number.isNaN(s))return"—";const o=Math.round((s-Date.now())/1e3);return o<=0?t?De("formatters.expired",t):"expired":function(e){if(null==e||Number.isNaN(e))return"—";const t=Math.max(0,Math.round(e));if(t<60)return`${t}s`;const s=Math.floor(t/60);return s<60?`${s}m ${t%60}s`:`${Math.floor(s/60)}h ${s%60}m`}(o)}const gt=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function vt(e){const t=gt.length;return gt[(e%t+t)%t]}const ft=110;let yt=class extends ce{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set}_toggleEntry(e){const t=new Set(this._hiddenEntries);t.has(e)?t.delete(e):t.add(e),this._hiddenEntries=t}_sunFor(e){const t=e.entities.sun_sensor;if(!t)return null;const s=this.hass.states[t];if(!s)return null;const o=parseFloat(s.state);return Number.isNaN(o)?null:{...s.attributes,window_azimuth:s.attributes.window_azimuth}}_coverPositionFor(e){const t=e.entities.target_position_sensor;if(!t)return null;const s=parseFloat(this.hass.states[t]?.state??"");return Number.isNaN(s)?null:s}_sunInfrontFor(e){const t=e.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}_readActiveAzimuth(e){if(!e)return null;const t=this.hass.states[e];if(!t)return null;if("unavailable"===t.state||"unknown"===t.state)return null;const s=t.attributes.azimuth;return"number"==typeof s&&Number.isFinite(s)?s:null}_buildOverlays(){const e=[];return this.discovered_list.forEach((t,s)=>{const o=this._sunFor(t);if(!o)return;const i=t.entities.sun_sensor,n=parseFloat(this.hass.states[i]?.state??"0"),{color:r,isOverride:a}=(l=this.coverColors?.[s],c=s,"string"==typeof l&&l.length>0?{color:l,isOverride:!0}:{color:vt(c),isOverride:!1});var l,c;e.push({d:t,sun:o,sunAzi:n,sunInfront:this._sunInfrontFor(t),coverPos:this._coverPositionFor(t),coverType:t.cover_type,color:r,isOverride:a,index:s})}),e}render(){if(!this.hass)return K;if(!this.discovered_list||0===this.discovered_list.length)return B`<div class="placeholder">${De("compass.placeholder_no_entries",this.hass)}</div>`;const e=this._buildOverlays();if(0===e.length)return B`<div class="placeholder">${De("compass.placeholder_no_sun",this.hass)}</div>`;const t=e.filter(e=>!this._hiddenEntries.has(e.d.entry_id)),s=Be(this.northOffsetDeg),o=e.length>1,i=e[0],n=i.sunAzi,r=i.sun.elevation,a=Ue(n,r,s),l=e.some(e=>e.sun.in_fov),c=e.some(e=>e.sunInfront),d=r<=0,h=!d&&c?"sun valid":!d&&l?"sun in-fov":"sun",{latitude:p,longitude:u}=this.hass.config,_=void 0!==p&&void 0!==u?at(p,u,lt()):[],m=this.showMoon&&void 0!==p&&void 0!==u?dt(p,u):null,g=null!==m&&m.elevation>0,v=m?m.phase<.5?-24*m.phase:24*(1-m.phase):0,f=g?Ue(m.azimuth,m.elevation,s):null,y=f?f.x*ft:0,b=f?f.y*ft:0,$=this.showSunPath?_.filter(e=>e.elevation>0).map(e=>{const t=Ue(e.azimuth,e.elevation,s);return`${(t.x*ft).toFixed(1)},${(t.y*ft).toFixed(1)}`}).join(" "):"",{riseAzimuth:w,setAzimuth:x}=this.showSunriseSunset?function(e){let t=-1,s=-1;for(let o=0;o<e.length;o++)e[o].elevation>0&&(-1===t&&(t=o),s=o);return{riseAzimuth:t>=0?e[t].azimuth:null,setAzimuth:s>=0?e[s].azimuth:null}}(_):{riseAzimuth:null,setAzimuth:null},k=null!==w?je(w,ft,s):null,C=null!==x?je(x,ft,s):null,A=je(0,124,s),S=je(90,124,s),E=je(180,124,s),P=je(270,124,s),z=je(0,ft,s),O=je(180,ft,s),T=je(90,ft,s),M=je(270,ft,s),I=De("compass.sun_tooltip",this.hass,{az:ut(n),el:ut(r)}),F=null!==w?De("compass.sunrise_tooltip",this.hass,{time:ut(w)}):"",N=null!==x?De("compass.sunset_tooltip",this.hass,{time:ut(x)}):"",R=null!==m?De("compass.moon_tooltip",this.hass,{phase:m.phaseName,pct:Math.round(100*m.fraction)}):"",D=De("compass.sun_path_tooltip",this.hass);return B`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${W`
            <defs>
              ${g?W`
                <mask id="moon-phase-mask">
                  <circle cx=${y} cy=${b} r=${6} fill="white"></circle>
                  <circle cx=${y+v} cy=${b} r=${6} fill="black"></circle>
                </mask>
              `:K}
            </defs>

            <circle class="grid" r=${ft}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${ft/3}></circle>
            <line class="grid thin" x1=${z.x} y1=${z.y} x2=${O.x} y2=${O.y}></line>
            <line class="grid thin" x1=${T.x} y1=${T.y} x2=${M.x} y2=${M.y}></line>

            ${t.map(e=>this._renderEntryLayers(e,o,s))}

            ${this.showSunPath&&$?W`<g data-tooltip=${D}><title>${D}</title><polyline class="sun-path" points=${$}></polyline></g>`:K}

            ${this.showSunriseSunset&&k&&null!==w?W`<g data-tooltip=${F}><title>${F}</title><circle class="rise-marker" cx=${k.x} cy=${k.y} r="4"></circle></g>`:K}
            ${this.showSunriseSunset&&C&&null!==x?W`<g data-tooltip=${N}><title>${N}</title><circle class="set-marker" cx=${C.x} cy=${C.y} r="4"></circle></g>`:K}

            ${this.showCardinals?W`
              <text class="cardinal" x=${A.x} y=${A.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${S.x} y=${S.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${P.x} y=${P.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:K}

            ${g?W`
              <g data-tooltip=${R}>
                <title>${R}</title>
                <circle class="moon-outline" cx=${y} cy=${b} r=${6}></circle>
                <circle class="moon-lit" cx=${y} cy=${b} r=${6} mask="url(#moon-phase-mask)"></circle>
              </g>
            `:K}

            <g data-tooltip=${I}>
              <title>${I}</title>
              <circle class=${h} cx=${a.x*ft} cy=${a.y*ft} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(e,o):K}
        ${this.showStats?this._renderStats(e,o):K}
      </div>
    `}_renderEntryLayers(e,t,s=0){const o=Be(e.sun.window_azimuth),i=Be(o-e.sun.fov_left),n=Be(o+e.sun.fov_right),r=this._readActiveAzimuth(e.d.entities.start_sensor),a=this._readActiveAzimuth(e.d.entities.end_sensor),l=null!==r&&null!==a,c=l?Be(r):i,d=l?Be(a):n,h=je(o,ft,s),{outer:p,inner:u}=(_=e.sun.min_elevation,m=e.sun.max_elevation,g=ft,void 0!==_&&void 0!==m&&_>m?{outer:g,inner:0}:{outer:void 0!==_?g*He(_):g,inner:void 0!==m?g*He(m):0});var _,m,g;const v="cover_awning"===e.coverType?e.coverPos/100:1-e.coverPos/100,f=null!==e.coverPos?ft*v:null,y=null!==f?Math.min(f,p):null,b=e.sun.blind_spot_range?[Be(($=o)-(w=e.sun.blind_spot_range)[1]),Be($-w[0])]:null;var $,w;const x=b?qe(b[0],b[1],ft,0,s):null,k=qe(c,d,p,u,s),C=null!==y&&y>u?qe(c,d,y,u,s):"",A=t?`${e.d.entry_title}: `:"",S=void 0!==e.sun.min_elevation||void 0!==e.sun.max_elevation?De("compass.elev_suffix",this.hass,{min:ut(e.sun.min_elevation??0),max:ut(e.sun.max_elevation??90)}):"",E=l?`${A}${De("compass.active_sun_arc",this.hass,{from:ut(c),to:ut(d),elev:S})}`:`${A}${De("compass.fov_arc",this.hass,{left:ut(e.sun.fov_left),right:ut(e.sun.fov_right),elev:S})}`,P=`${A}${De("compass.window_normal_tooltip",this.hass,{bearing:ut(o)})}`,z=null!==e.coverPos?"cover_awning"===e.coverType?`${A}${De("compass.cover_extended",this.hass,{pct:e.coverPos})}`:`${A}${De("compass.cover_closed_tooltip",this.hass,{pct:e.coverPos})}`:"",O=b?`${A}${De("compass.blind_spot",this.hass,{from:ut(b[0]),to:ut(b[1])})}`:"",T=t||e.isOverride,M=T?`fill: ${e.color}; stroke: ${e.color};`:"",I=T?`fill: ${e.color}; stroke: ${e.color};`:"",F=T?`fill: ${e.color}; stroke: ${e.color};`:"",N=T?`stroke: ${e.color};`:"",R=T?`fill: ${e.color};`:"",D=this.showCoverFill&&""!==C,L=this.showBlindSpot&&!!x,j=this.showWindowArrow,H=`M 0 0 L ${h.x} ${h.y}`,q="display: none;";return W`<g class="entry-overlay">
      <g data-tooltip=${E}>
        <title>${E}</title>
        <path class="fov" style=${M} d=${k}></path>
      </g>
      <g class="arrow-group" data-tooltip=${P} style=${j?"":q}>
        <title>${P}</title>
        <path class="window" style=${N} d=${H}></path>
        <circle class="window-base" style=${R} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" data-tooltip=${z} style=${D?"":q}>
        <title>${z}</title>
        <path class="cover-fill" style=${I} d=${C}></path>
      </g>
      <g class="blind-group" data-tooltip=${O} style=${L?"":q}>
        <title>${O}</title>
        <path class="blind-spot" style=${F} d=${x??""}></path>
      </g>
    </g>`}_renderLegend(e,t){return t?B`
        <div class="legend">
          ${e.map(e=>B`
              <button
                type="button"
                class=${Qe({"entry-toggle":!0,hidden:this._hiddenEntries.has(e.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(e.d.entry_id)}
                @click=${()=>this._toggleEntry(e.d.entry_id)}
              >
                <span class="swatch entry" style="background: ${e.color}"></span>
                ${e.d.entry_title}
                ${e.sunInfront?B`<span class="status valid">${De("compass.in_fov_check",this.hass)}</span>`:e.sun.in_fov?B`<span class="status in-fov">${De("compass.in_fov",this.hass)}</span>`:B`<span class="status">${De("compass.none",this.hass)}</span>`}
              </button>
            `)}
          <div><span class="dot sun valid"></span> ${De("compass.sun",this.hass)}</div>
          ${this.showMoon?B`<div><span class="dot moon-dot"></span> ${De("compass.moon",this.hass)}</div>`:K}
        </div>
      `:B`<div class="legend">
      <div><span class="dot sun valid"></span> ${De("compass.sun_hitting",this.hass)}</div>
      <div><span class="dot sun in-fov"></span> ${De("compass.sun_in_fov_invalid",this.hass)}</div>
      <div><span class="dot sun"></span> ${De("compass.sun_outside_fov",this.hass)}</div>
      ${this.showMoon?B`<div><span class="dot moon-dot"></span> ${De("compass.moon",this.hass)}</div>`:K}
      <div><span class="swatch fov"></span> ${De("compass.window_fov",this.hass)}</div>
      ${this.showSunPath?B`<div>
            <span class="swatch sun-path-swatch"></span> ${De("compass.sun_path",this.hass)}
          </div>`:K}
      ${this.showSunriseSunset?B`<div><span class="dot rise-dot"></span> ${De("compass.sunrise",this.hass)}</div>
            <div><span class="dot set-dot"></span> ${De("compass.sunset",this.hass)}</div>`:K}
      ${this.showCoverFill?B`<div>
            <span class="swatch cover-fill-swatch"></span> ${De("compass.cover_closed",this.hass)}
          </div>`:K}
      ${this.showWindowArrow?B`<div>
            <span class="swatch window-swatch"></span> ${De("compass.window_normal",this.hass)}
          </div>`:K}
    </div>`}_renderStats(e,t){const s=e[0],o=s.sunAzi,i=s.sun.elevation,{latitude:n,longitude:r}=this.hass.config,a=this.showMoon&&void 0!==n&&void 0!==r?dt(n,r):null;return t?B`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${De("compass.stat_sun",this.hass)}${ut(o)} /
              ${ut(i)}</span
            >
            ${this.showMoon&&a?B`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:K}
          </div>
          ${e.map(e=>B`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${e.color}"></span>
                <span class="entry-name">${e.d.entry_title}</span>
                <span>∠${ut(e.sun.gamma)}</span>
                <span>W ${ut(Be(e.sun.window_azimuth))}</span>
                ${e.sun.in_fov?B`<span class="status in-fov">✓</span>`:K}
              </div>
            `)}
        </div>
      `:B`<div class="stats dim">
      <span>${De("compass.stat_azi",this.hass)}${ut(o)}</span>
      <span>${De("compass.stat_elev",this.hass)}${ut(i)}</span>
      <span>∠: ${ut(s.sun.gamma)}</span>
      <span
        >${De("compass.stat_window",this.hass)}${ut(Be(s.sun.window_azimuth))}</span
      >
      ${this.showMoon&&a?B`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:K}
    </div>`}};yt.styles=r`
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
        flex: 0 0 auto;
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
    .fov {
      fill: var(--warning-color, gold);
      fill-opacity: 0.22;
      stroke: var(--warning-color, gold);
      stroke-width: 1;
      stroke-opacity: 0.7;
      transition: all 0.3s ease;
    }
    .cover-fill {
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
    .sun.in-fov {
      fill: var(--state-active-color, orange);
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
    .dot.sun.in-fov {
      background: var(--state-active-color, orange);
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
      opacity: 0.75;
    }
    .set-marker {
      fill: var(--secondary-text-color);
      opacity: 0.55;
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
  `,e([_e({attribute:!1})],yt.prototype,"hass",void 0),e([_e({attribute:!1})],yt.prototype,"discovered_list",void 0),e([_e({type:Boolean,reflect:!0})],yt.prototype,"compact",void 0),e([_e({attribute:!1})],yt.prototype,"showStats",void 0),e([_e({attribute:!1})],yt.prototype,"showLegend",void 0),e([_e({attribute:!1})],yt.prototype,"showMoon",void 0),e([_e({attribute:!1})],yt.prototype,"showCardinals",void 0),e([_e({attribute:!1})],yt.prototype,"showBlindSpot",void 0),e([_e({attribute:!1})],yt.prototype,"showSunPath",void 0),e([_e({attribute:!1})],yt.prototype,"showSunriseSunset",void 0),e([_e({attribute:!1})],yt.prototype,"showCoverFill",void 0),e([_e({attribute:!1})],yt.prototype,"showWindowArrow",void 0),e([_e({attribute:!1})],yt.prototype,"coverColors",void 0),e([_e({attribute:!1})],yt.prototype,"northOffsetDeg",void 0),e([me()],yt.prototype,"_hiddenEntries",void 0),yt=e([he("acp-sky-compass")],yt);let bt=class extends ce{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const e=this.discovered.entities.sun_sensor;if(!e)return null;const t=this.hass.states[e];return t?t.attributes:null}render(){if(!this.hass||!this.discovered)return K;const e=this._sunAttrs(),{latitude:t,longitude:s}=this.hass.config;if(void 0===t||void 0===s||!e)return B`<div class="placeholder">${De("elevation.placeholder",this.hass)}</div>`;const o=lt(),i=at(t,s,o),n=new Date,r=function(e,t,s,o){let i=-1,n=-1,r=-1;for(let a=0;a<e.length;a++){const l=e[a];l.elevation>0&&ct(l.azimuth,t,s,o)?(-1===r&&(r=a),a-r>n-i&&(i=r,n=a)):r=-1}return-1===i?null:{startIdx:i,endIdx:n}}(i,e.window_azimuth,e.fov_left,e.fov_right),a=e=>32+(e.getTime()-o.getTime())/864e5*360,l=e=>138-(e- -10)/100*128,c=i.map(e=>`${a(e.t).toFixed(1)},${l(e.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(n),p=this._interpAt(i,n),u=p?l(p.elevation):null,_=r?i[r.startIdx].t:null,m=r?i[r.endIdx].t:null,g=_?a(_):null,v=m?a(m):null;return B`
      <div class="wrap">
        <div class="head">
          <span class="label">${De("elevation.title",this.hass)}</span>
          ${_&&m?B`<span class="dim"
                >${De("elevation.fov_window",this.hass,{from:_t(_.toISOString()),to:_t(m.toISOString())})}</span
              >`:B`<span class="dim">${De("elevation.no_fov_today",this.hass)}</span>`}
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${W`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(e=>W`
              <line class="grid" x1=${32} y1=${l(e)} x2=${392} y2=${l(e)} />
              <text class="tick" x=${28} y=${l(e)+3} text-anchor="end">${e}°</text>
            `)}

            <!-- x-axis gridlines at every 6h -->
            ${[0,6,12,18,24].map(e=>{const t=new Date(o.getTime()+36e5*e);return W`
                <line class="grid faint" x1=${a(t)} y1=${10} x2=${a(t)} y2=${138} />
                <text class="tick" x=${a(t)} y=${152} text-anchor="middle">${e.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${d} x2=${392} y2=${d} />

            <!-- FOV shaded band (only the time the sun is actually in FOV + above horizon) -->
            ${null!==g&&null!==v?W`<rect
                  class="fov-band"
                  x=${g}
                  y=${10}
                  width=${v-g}
                  height=${128}
                />`:K}

            <!-- elevation curve -->
            <polyline class="curve" points=${c} />

            <!-- current-time cursor -->
            <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />

            <!-- current sun dot -->
            ${null!==u?W`<circle class="sun-dot" cx=${h} cy=${u} r="4" />`:K}
          `}
        </svg>
      </div>
    `}_interpAt(e,t){if(0===e.length)return null;const s=t.getTime();if(s<=e[0].t.getTime())return e[0];if(s>=e[e.length-1].t.getTime())return e[e.length-1];for(let o=1;o<e.length;o++)if(e[o].t.getTime()>=s){const i=e[o-1],n=e[o],r=(s-i.t.getTime())/(n.t.getTime()-i.t.getTime());return{t:t,elevation:i.elevation+(n.elevation-i.elevation)*r,azimuth:i.azimuth+(n.azimuth-i.azimuth)*r}}return e[e.length-1]}};function $t(e,t){if(!0===e?.custom_position_minimum_mode&&Array.isArray(e.custom_position_slots)&&void 0!==e.custom_position_active_slot){const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);if(void 0!==t&&null!==t.position&&void 0!==t.position)return t.position}return t}function wt(e){const t=e.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(t))return"custom_position";switch(t){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return t}}function xt(e,t,s,o=Ce){const i=new Map;for(const t of e){if(!t.matched)continue;const e=wt(t.handler);ke.includes(e)&&i.set(e,t)}const n=[...ke].reverse().filter(e=>i.has(e));return 0===n.length?t.reason??"":n.map(e=>function(e,t,s,o){const i=o[e]??e,n=t.position,r=null==n?"":` ${pt(n)}`;if("custom_position"!==e)return`${i}${r}`.trimEnd();return`${s.custom_position_active_slot_name?`${i} · ${s.custom_position_active_slot_name}`:s.custom_position_active_slot?`${i} #${s.custom_position_active_slot}`:i}${r}${!0===s.custom_position_minimum_mode?" floor":""}`}(e,i.get(e),t,o)).join(" → ")}bt.styles=r`
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
  `,e([_e({attribute:!1})],bt.prototype,"hass",void 0),e([_e({attribute:!1})],bt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],bt.prototype,"compact",void 0),bt=e([he("acp-elevation-chart")],bt);let kt=class extends ce{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this.hideInactive=!1}_trace(){const e=this.discovered.entities.decision_trace_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const s=t.attributes;if(!s?.trace)return null;const o=new Map;for(const e of s.trace)o.set(wt(e.handler),{matched:e.matched,reason:e.reason,position:e.position});const i={};for(const[e,t]of Object.entries(Ae))i[e]=De(t,this.hass);return{winner:t.state,reason:s.reason??"",steps:o,enabledHandlers:s.enabled_handlers,summary:xt(s.trace,s,t.state,i)}}render(){if(!this.hass||!this.discovered)return K;const e=this._trace();if(!e)return B`<div class="placeholder">${De("decision.placeholder",this.hass)}</div>`;const t=function(e){if(!e)return new Set;const t=new Set(e);return new Set(ke.filter(e=>!t.has(e)))}(e.enabledHandlers),s=function(e,t,s,o,i=new Set){return e.filter(e=>e===s||!i.has(e)&&(!o||!0===t.get(e)?.matched))}(ke,e.steps,e.winner,this.hideInactive,t);return B`
      <div class="wrap">
        <div class="head">
          <span class="label">${De("decision.pipeline",this.hass)}</span>
          <span class="winner">${De("decision.winner",this.hass,{name:e.winner})}</span>
        </div>
        ${this.showSummary&&e.summary?B`<div class="summary" title=${De("decision.summary_tooltip",this.hass)}>
              ${e.summary}
            </div>`:K}
        <div class="rows">
          ${s.map(t=>this._row(t,e.steps.get(t),e.winner===t))}
        </div>
        <div class="reason dim">${e.reason}</div>
      </div>
    `}_row(e,t,s){const o=t?.matched??!1,i=t?.reason??De("decision.not_evaluated",this.hass),n=t?.position;return B`
      <div class="row ${s?"winner":o?"match":"skip"}">
        <span class="name">${De(Ae[e],this.hass)}</span>
        <span class="dots" aria-hidden="true">${o?"████":"────"}</span>
        <span class="pos">${null!=n?pt(n):""}</span>
        <span class="reason-inline dim">${i}</span>
        ${s?B`<span class="badge">✓</span>`:K}
      </div>
    `}};var Ct,At;kt.styles=r`
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
  `,e([_e({attribute:!1})],kt.prototype,"hass",void 0),e([_e({attribute:!1})],kt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],kt.prototype,"compact",void 0),e([_e({type:Boolean,reflect:!0,attribute:"show-summary"})],kt.prototype,"showSummary",void 0),e([_e({type:Boolean,reflect:!0,attribute:"hide-inactive"})],kt.prototype,"hideInactive",void 0),kt=e([he("acp-decision-strip")],kt),function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Ct||(Ct={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(At||(At={}));const St=["closed","locked","off"],Et=(e,t,s,o)=>{o=o||{},s=null==s?{}:s;const i=new Event(t,{bubbles:void 0===o.bubbles||o.bubbles,cancelable:Boolean(o.cancelable),composed:void 0===o.composed||o.composed});return i.detail=s,e.dispatchEvent(i),i},Pt=e=>{Et(window,"haptic",e)};function zt(e){return void 0!==e&&"none"!==e.action}let Ot=class extends ce{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0,this.manualActive=!1}render(){const e=this._kind(),t=Oe[e],s=this.hass?De(Te[e],this.hass):t.label,o=this._label(e,s);return B`<span
      class="badge kind-${e}"
      style="background:${t.bg};color:${t.fg};"
      part="badge"
      >${o}</span
    >`}_kind(){if(!1===this.integrationEnabled)return"off";const e=wt(this.winner);return this.manualActive&&"force"!==e&&"custom_position"!==e?"manual":ze[e]??"auto"}_label(e,t){return"manual"===e?this.manualEndIso?_t(this.manualEndIso):t:"custom_position"===e?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${t} #${this.slotNumber}`:t}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?" floor":""}`:t}};Ot.styles=r`
    :host {
      display: inline-flex;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      line-height: 1.4;
    }
    :host([compact]) .badge {
      padding: 1px 6px;
      font-size: 0.7rem;
    }
  `,e([_e({attribute:!1})],Ot.prototype,"hass",void 0),e([_e()],Ot.prototype,"winner",void 0),e([_e({attribute:"manual-end-iso"})],Ot.prototype,"manualEndIso",void 0),e([_e({type:Number,attribute:"slot-number"})],Ot.prototype,"slotNumber",void 0),e([_e({attribute:"slot-name"})],Ot.prototype,"slotName",void 0),e([_e({type:Number})],Ot.prototype,"pct",void 0),e([_e({type:Boolean,attribute:"minimum-mode"})],Ot.prototype,"minimumMode",void 0),e([_e({type:Boolean,reflect:!0})],Ot.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"integration-enabled"})],Ot.prototype,"integrationEnabled",void 0),e([_e({type:Boolean,attribute:"manual-active"})],Ot.prototype,"manualActive",void 0),Ot=e([he("acp-tile-badge")],Ot);let Tt=class extends ce{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualEndIso(){const e=this.discovered.entities.manual_override_end_sensor;if(!e)return null;const t=this.hass.states[e];return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:null}_motionStatus(){const e=this.discovered.entities.motion_status_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const s=t.attributes.motion_timeout_end_time;return{state:t.state,endIso:s??null}}_forceActive(){const e=this.discovered.entities.force_override_sensor;if(!e)return 0;const t=this.hass.states[e];return t&&parseInt(t.state,10)||0}_resetManual(){const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_motionStateLabel(e,t){if(e){const t=this.hass.states[e],s=this.hass.formatEntityState;if(t&&"function"==typeof s){const e=s(t);if(e)return e}}return t.replace(/_/g," ")}render(){if(!this.hass||!this.discovered)return K;const e=this._manualActive(),t=this._manualEndIso(),s=this._motionStatus(),o=this.discovered.entities.motion_status_sensor,i=this._forceActive(),n=this.discovered.entities.reset_override_button,r=De("overrides.reset_manual",this.hass);return B`
      <div class="wrap">
        <div class="label dim">${De("overrides.title",this.hass)}</div>
        <div class="grid">
          <div class="tile ${e?"active":""}">
            <div class="tile-label">${De("overrides.manual",this.hass)}</div>
            <div class="tile-value">
              ${De(e?"overrides.active":"overrides.off",this.hass)}
            </div>
            ${t?B`<div class="tile-sub dim">
                  ${De("overrides.ends_in",this.hass,{time:mt(t,this.hass)})}
                </div>`:K}
          </div>

          <div class="tile ${i>0?"active warning":""}">
            <div class="tile-label">${De("overrides.force",this.hass)}</div>
            <div class="tile-value">
              ${i>0?De("overrides.active_count",this.hass,{count:i}):De("overrides.off",this.hass)}
            </div>
          </div>

          ${s?B`<div class="tile ${"motion_detected"===s.state?"active":""}">
                <div class="tile-label">${De("overrides.motion",this.hass)}</div>
                <div class="tile-value">${this._motionStateLabel(o,s.state)}</div>
                ${s.endIso?B`<div class="tile-sub dim">
                      ${De("overrides.timeout",this.hass,{time:mt(s.endIso,this.hass)})}
                    </div>`:K}
              </div>`:K}
          ${n?this.resetEnabled?B`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${r}</div>
                </button>`:B`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${r}</div>
                </button>`:K}
        </div>
      </div>
    `}};Tt.styles=r`
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
  `,e([_e({attribute:!1})],Tt.prototype,"hass",void 0),e([_e({attribute:!1})],Tt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Tt.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"reset-enabled"})],Tt.prototype,"resetEnabled",void 0),Tt=e([he("acp-overrides-panel")],Tt);const Mt={summer_mode:"mdi:weather-sunny",winter_mode:"mdi:snowflake",intermediate:"mdi:weather-partly-cloudy"};let It=class extends ce{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return K;const e=this.discovered.entities.climate_status_sensor;if(!e)return K;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return K;const s=t.state,o=t.attributes??{},i=Mt[s]??"mdi:thermostat",n=o.temperature_unit??"°",r=this.hass.formatEntityState,a="function"==typeof r?r(t)??s:s,l=void 0!==o.active_temperature?`${o.active_temperature.toFixed(1)}${n}`:"—",c=[void 0!==o.indoor_temperature?{label:De("climate.indoor",this.hass),value:o.indoor_temperature,unit:n}:null,void 0!==o.outdoor_temperature?{label:De("climate.outdoor",this.hass),value:o.outdoor_temperature,unit:n}:null].filter(e=>null!==e),d=[{label:De("climate.presence",this.hass),value:o.is_presence,icon:"mdi:account-check"},{label:De("climate.sunny",this.hass),value:o.is_sunny,icon:"mdi:white-balance-sunny"},{label:De("climate.lux",this.hass),value:o.lux_active,icon:"mdi:brightness-7"},{label:De("climate.irradiance",this.hass),value:o.irradiance_active,icon:"mdi:solar-power"}].filter(e=>void 0!==e.value);return B`
      <div class="wrap">
        <div class="head">
          <span class="label">${De("climate.title",this.hass)}</span>
          <span class="dim">${De("climate.active",this.hass,{strategy:l})}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${i}></ha-icon>
          <span class="strategy-name">${a}</span>
        </div>
        ${c.length?B`
              <div class="temps">
                ${c.map(e=>B`
                    <div class="temp">
                      <span class="temp-label dim">${e.label}</span>
                      <span class="temp-value">${e.value.toFixed(1)}${e.unit}</span>
                    </div>
                  `)}
              </div>
            `:K}
        ${d.length?B`
              <div class="conditions">
                ${d.map(e=>B`
                    <div class="chip ${e.value?"on":"off"}" title=${e.label}>
                      <ha-icon icon=${e.icon}></ha-icon>
                      <span>${e.label}</span>
                    </div>
                  `)}
              </div>
            `:K}
      </div>
    `}};It.styles=r`
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
  `,e([_e({attribute:!1})],It.prototype,"hass",void 0),e([_e({attribute:!1})],It.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],It.prototype,"compact",void 0),It=e([he("acp-climate-panel")],It);let Ft=class extends ce{constructor(){super(...arguments),this.compact=!1}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return{target:null,covers:{}};const t=this.hass.states[e];if(!t)return{target:null,covers:{}};const s=parseFloat(t.state),o=t.attributes;return{target:Number.isNaN(s)?null:s,covers:o?.actual_positions??{}}}_mismatched(){const e=this.discovered.entities.position_mismatch_binary;if(!e)return new Set;const t=this.hass.states[e];if("on"!==t?.state)return new Set;const s=t.attributes.entities;return s?new Set(Object.entries(s).filter(([,e])=>e.mismatch).map(([e])=>e)):new Set}_setPosition(e,t){this.hass.callService(xe,"set_position",{position:t},{entity_id:e})}render(){if(!this.hass||!this.discovered)return K;const{target:e,covers:t}=this._target(),s=this._mismatched(),o=Object.entries(t);return 0===o.length?B`<div class="placeholder">${De("covers.placeholder",this.hass)}</div>`:B`
      <div class="wrap">
        <div class="head">
          <span class="label">${De("covers.title",this.hass)}</span>
          <span class="target"
            >${De("covers.target",this.hass,{pct:pt(e)})}</span
          >
        </div>
        ${o.map(([t,o])=>this._bar(t,o,e,s.has(t)))}
      </div>
    `}_bar(e,t,s,o){const i=this.hass.states[e]?.attributes?.friendly_name??e,n=t??0,r=s??0;return B`
      <div class="cover ${o?"mismatch":""}">
        <div class="name" title=${e}>${i}</div>
        <div
          class="track"
          @click=${t=>this._handleTrackClick(t,e)}
          title=${De("covers.click_to_set",this.hass)}
        >
          <div class="fill" style="width:${n}%"></div>
          ${null!==s?B`<div
                class="marker"
                style="left:${r}%"
                title=${De("covers.target_tooltip",this.hass,{pct:r})}
              ></div>`:K}
        </div>
        <div class="num">${pt(t)}</div>
        ${o?B`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:K}
      </div>
    `}_handleTrackClick(e,t){const s=e.currentTarget.getBoundingClientRect(),o=Math.round((e.clientX-s.left)/s.width*100),i=Math.max(0,Math.min(100,o));this._setPosition(t,i)}};var Nt;Ft.styles=r`
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
  `,e([_e({attribute:!1})],Ft.prototype,"hass",void 0),e([_e({attribute:!1})],Ft.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Ft.prototype,"compact",void 0),Ft=e([he("acp-cover-bar")],Ft);let Rt=Nt=class extends ce{constructor(){super(...arguments),this.samples=[],this.events=[],this._hoverIdx=null,this._onPointerMove=e=>{const t=e.currentTarget.getBoundingClientRect();if(t.width<=0)return;const s=(e.clientX-t.left)/t.width,o=Math.max(0,Math.min(1,s))*Nt.VIEW_W;this._hoverIdx=this._nearestSampleIdx(o)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){if(!this.samples||0===this.samples.length)return K;const e=this._timeRange();if(!e)return K;const{start:t,end:s}=e,o=s-t;if(o<=0)return K;const{VIEW_W:i,VIEW_H:n,TOP_PAD:r,EVENT_HIT_W:a}=Nt,l=n-r,c=this.samples.map(e=>{const s=Date.parse(e.t);return{t:s,x:(s-t)/o*i,y:r+(1-Dt(e.position)/100)*l,sample:e}}),d=c.map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)}`).join(" "),h=(this.events??[]).map(e=>{const l=Date.parse(e.t);if(Number.isNaN(l)||l<t||l>s)return null;const c=(l-t)/o*i,d=`evt-${e.kind}`,h=function(e,t){const s=`forecast.event.${e.kind}`,o=De(s,t),i=o===s?e.label??e.kind:o,n=_t(e.t);return"—"===n?i:`${i} — ${n}`}(e,this.hass);return W`<g class="event-group" data-tooltip=${h}>
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
        </g>`}).filter(e=>null!==e),p=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<c.length?c[this._hoverIdx]:null,u=p?W`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${p.x.toFixed(1)} x2=${p.x.toFixed(1)}
            y1=${r} y2=${n}></line>
          <circle class="hover-dot" cx=${p.x.toFixed(1)} cy=${p.y.toFixed(1)} r="3"></circle>
        </g>`:K,_=p?B`<div class="hover-label" style=${`left: ${(p.x/i*100).toFixed(2)}%`}>
          ${function(e){const t=_t(e.t),s=`${Math.round(Dt(e.position))}%`;return e.handler?`${t} · ${s} · ${e.handler}`:`${t} · ${s}`}(p.sample)}
        </div>`:K,m=_t(this.samples[0].t),g=_t(this.samples[this.samples.length-1].t);return B`
      <div class="wrap">
        <svg
          viewBox="0 0 ${i} ${n}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <title>${De("forecast.hover_hint",this.hass)}</title>
          <line class="baseline" x1="0" y1=${n-.5} x2=${i} y2=${n-.5}></line>
          <polyline class="curve" points=${d} fill="none"></polyline>
          <text class="axis-label" x="4" y=${r+8} text-anchor="start">100%</text>
          <text class="axis-label" x="4" y=${n-3} text-anchor="start">${m}</text>
          <text class="axis-label" x=${i-4} y=${n-3} text-anchor="end">
            ${g}
          </text>
          ${h} ${u}
        </svg>
        ${_}
      </div>
    `}_timeRange(){let e=Number.POSITIVE_INFINITY,t=Number.NEGATIVE_INFINITY;for(const s of this.samples){const o=Date.parse(s.t);Number.isNaN(o)||(o<e&&(e=o),o>t&&(t=o))}return e===Number.POSITIVE_INFINITY?null:{start:e,end:t}}_nearestSampleIdx(e){const t=this._timeRange();if(!t)return null;const s=t.end-t.start;if(s<=0)return null;let o=-1,i=Number.POSITIVE_INFINITY;for(let n=0;n<this.samples.length;n++){const r=Date.parse(this.samples[n].t);if(Number.isNaN(r))continue;const a=(r-t.start)/s*Nt.VIEW_W,l=Math.abs(a-e);l<i&&(i=l,o=n)}return o>=0?o:null}};function Dt(e){return Number.isNaN(e)||e<0?0:e>100?100:e}Rt.VIEW_W=600,Rt.VIEW_H=80,Rt.TOP_PAD=10,Rt.EVENT_HIT_W=12,Rt.styles=r`
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
  `,e([_e({attribute:!1})],Rt.prototype,"hass",void 0),e([_e({attribute:!1})],Rt.prototype,"samples",void 0),e([_e({attribute:!1})],Rt.prototype,"events",void 0),e([me()],Rt.prototype,"_hoverIdx",void 0),Rt=Nt=e([he("acp-forecast-strip")],Rt);let Lt=class extends ce{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this._onResume=()=>{const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const e=this.discovered.device_id;e&&this._navigate(`/config/devices/device/${e}`)},this._openIntegrationPage=()=>{this._navigate(`/config/integrations/integration/${xe}`)},this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}_buildHandlerLabels(){const e={};for(const[t,s]of Object.entries(Ae))e[t]=De(s,this.hass);return e}render(){if(!this.open||!this.hass||!this.discovered)return K;const e=this._winner(),t=this._traceAttrs(),s=this._matchedHandlers(t),o=t?xt(t.trace??[],t,0,this._buildHandlerLabels()):"",i=this._target(),n=this._shouldShowResume(e),r=this._switchOn("integration_enabled_switch"),a=this._switchOn("automatic_control_switch"),l=De("dialog.configure_integration",this.hass),c=De("dialog.open_device_page",this.hass),d=De("dialog.close",this.hass);return B`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${Se[this.discovered.cover_type]??"mdi:window-shutter"}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${r?a?s.map(e=>B`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${e}
                          .slotNumber=${"custom_position"===e?t?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===e?t?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===e?$t(t,i)??void 0:void 0}
                          .minimumMode=${"custom_position"===e?t?.custom_position_minimum_mode:void 0}
                        ></acp-tile-badge>`):K:B`<acp-tile-badge
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
            ${this.discovered.device_id?B`<button
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

          ${o?B`<div class="summary">${o}</div>`:K}

          <div class="position-block">
            <div class="position-label">${De("dialog.target",this.hass)}</div>
            <div class="position-value">${pt(i)}</div>
            ${this._mismatchActive()?B`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:K}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${n?B`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${De("dialog.resume_auto",this.hass)}
                </button>
              </div>`:K}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?De("dialog.hide_advanced",this.hass):De("dialog.show_advanced",this.hass)}
          </button>
          ${this.advancedOpen?B`<div class="advanced">
                ${this.showCompass?B`<div class="advanced-compass">
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
    `}_winner(){const e=this.discovered.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(){const e=this.discovered.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_matchedHandlers(e){if(!e?.trace)return[];const t=new Set;for(const s of e.trace){if(!s.matched)continue;const e=wt(s.handler);ke.includes(e)&&t.add(e)}return ke.filter(e=>t.has(e))}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const s=parseFloat(t.state);return Number.isNaN(s)?null:s}_mismatchActive(){const e=this.discovered.entities.position_mismatch_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualOverrideOn(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(e){const t=this.discovered.entities[e];return!t||"off"!==this.hass.states[t]?.state}_shouldShowResume(e){return!(!this.discovered.entities.reset_override_button||!this._manualOverrideOn()&&"custom_position"!==wt(e))}_renderSlots(e){if(!e)return K;const t=e.filter(e=>null!==e.sensor);return 0===t.length?K:B`<div class="slots-section">
      <div class="slots-label">${De("dialog.custom_positions",this.hass)}</div>
      ${t.map(e=>this._renderSlotRow(e))}
    </div>`}_renderSlotRow(e){const t=e.sensor_name??`#${e.slot}`;return B`<div class="slot-row" data-slot=${e.slot}>
      <span class="slot-label">${t}</span>
      <span class="slot-position">${pt(e.position)}</span>
      ${!0===e.min_mode?B`<span class="slot-min-mode" title=${De("dialog.floor_tooltip",this.hass)}>
            ${De("dialog.floor",this.hass)}
          </span>`:K}
      <button
        class="slot-toggle ${e.enabled?"on":"off"}"
        type="button"
        aria-label=${e.enabled?De("dialog.disable_slot",this.hass,{slot:e.slot}):De("dialog.enable_slot",this.hass,{slot:e.slot})}
        @click=${()=>this._toggleSlot(e)}
      >
        ${e.enabled?De("dialog.on",this.hass):De("dialog.off",this.hass)}
      </button>
    </div>`}_renderControls(){const e=[{role:"automatic_control_switch",label:De("dialog.automatic",this.hass)},{role:"climate_mode_switch",label:De("dialog.climate",this.hass)},{role:"motion_control_switch",label:De("dialog.motion",this.hass)}].filter(e=>!!this.discovered.entities[e.role]);return 0===e.length?K:B`<div class="controls-block">
      <div class="controls-label">${De("dialog.controls",this.hass)}</div>
      <div class="controls-row">${e.map(e=>this._renderSwitchChip(e.role,e.label))}</div>
    </div>`}_renderSwitchChip(e,t){const s=this.discovered.entities[e],o="on"===this.hass.states[s]?.state,i=De(o?"dialog.state_on":"dialog.state_off",this.hass),n=De(o?"dialog.on":"dialog.off",this.hass);return B`<button
      class="ctrl-toggle ${o?"on":"off"}"
      type="button"
      aria-pressed=${o}
      aria-label=${De("dialog.toggle_hint",this.hass,{label:t,state:i})}
      @click=${()=>this._toggleSwitch(s,o)}
    >
      <span class="ctrl-label">${t}</span>
      <span class="ctrl-state">${n}</span>
    </button>`}_toggleSwitch(e,t){this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:e})}_renderForecastStrip(){const e=this.discovered.entities.position_forecast_sensor;if(!e)return K;const t=this.hass.states[e]?.attributes,s=t?.forecast??[],o=t?.events??[];return 0===s.length?K:B`<div class="forecast-block">
      <div class="forecast-label">${De("dialog.todays_forecast",this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${s}
        .events=${o}
        .now=${Date.now()}
      ></acp-forecast-strip>
    </div>`}_toggleSlot(e){const t=this.discovered.managed_covers[0];t&&this.hass.callService(xe,"set_custom_position",{entity_id:t,slot:e.slot,enabled:!e.enabled})}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};async function jt(e){return(await e.callWS({type:"config_entries/get",domain:xe})).filter(e=>e.domain===xe).map(e=>({entry_id:e.entry_id,title:e.title}))}Lt.styles=r`
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
  `,e([_e({attribute:!1})],Lt.prototype,"hass",void 0),e([_e({attribute:!1})],Lt.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Lt.prototype,"open",void 0),e([_e({type:Boolean})],Lt.prototype,"advancedOpen",void 0),e([_e({type:Boolean})],Lt.prototype,"showCompass",void 0),Lt=e([he("acp-more-info-dialog")],Lt);const Ht={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_compass:!0,show_motion_icon:!0,show_resume:"auto",layout:"one-line"},qt={entry_id:"editor.common.entry_id",name:"editor.tile.name",icon:"editor.tile.icon",cover:"editor.tile.cover",layout:"editor.tile.layout",show_position:"editor.tile.show_position",show_state:"editor.tile.show_state",show_decision_summary:"editor.tile.show_decision_summary",show_controls:"editor.tile.show_controls",show_badge:"editor.tile.show_badge",show_compass:"editor.tile.show_compass",show_motion_icon:"editor.tile.show_motion_icon",show_resume:"editor.tile.show_resume",tap_action:"editor.tile.tap_action",hold_action:"editor.tile.hold_action",double_tap_action:"editor.tile.double_tap_action"};let Ut=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=e=>{const t=qt[e.name];return t?De(t,this.hass):e.name},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,s]of Object.entries(Ht))this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==s||delete t[e];this._emit({...this._config??{type:"",entry_id:""},...t})}}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),e.has("_registry")&&null!==this._registry&&this._maybePrefillCover()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,jt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id}),this._maybePrefillCover()}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,We(this.hass).then(e=>{this._registry=e,this._maybePrefillCover()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=Ve(this.hass,()=>{this._registryFetchInFlight=!0,We(this.hass).then(e=>{this._registry=e}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_maybePrefillCover(){if(!this._config?.entry_id||this._config?.cover||!this._registry||!this.hass)return;const e=Le(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=e?.managed_covers??[],1===e?.managed_covers.length&&this._emit({...this._config,cover:e.managed_covers[0]})}render(){if(!this._config)return K;if(this._entriesError&&!this._entries)return B`
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
        </div>
      `;const e=this._schema(),t={...Ht,...this._config};return B`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${e}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._managedCovers.length>1&&!this._config?.cover?B`<div class="hint">${De("editor.tile.cover_blank_hint",this.hass)}</div>`:K}
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[],t=[{value:"auto",label:De("editor.tile.resume_option_auto",this.hass)},{value:"always",label:De("editor.tile.resume_option_always",this.hass)},{value:"never",label:De("editor.tile.resume_option_never",this.hass)}],s=[{value:"one-line",label:De("editor.tile.layout_option_one_line",this.hass)},{value:"detailed",label:De("editor.tile.layout_option_detailed",this.hass)}];let o={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const e=Le(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);e&&e.managed_covers.length>0&&(o={entity:{domain:"cover",include_entities:e.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:o},{name:"layout",selector:{select:{mode:"list",options:s}}},{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{name:"show_motion_icon",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"show_resume",selector:{select:{mode:"list",options:t}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};Ut.styles=r`
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
  `,e([_e({attribute:!1})],Ut.prototype,"hass",void 0),e([me()],Ut.prototype,"_config",void 0),e([me()],Ut.prototype,"_entries",void 0),e([me()],Ut.prototype,"_entriesError",void 0),e([me()],Ut.prototype,"_registry",void 0),e([me()],Ut.prototype,"_managedCovers",void 0),Ut=e([he(we)],Ut);let Bt=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),zt(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return zt(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${$e}: \`entry_id\` is required and must be a non-empty string`);let t={...e};"string"==typeof t.tap_action&&(t={...t,tap_action:"none"===t.tap_action?{action:"none"}:void 0}),this._config=t}getCardSize(){return 1}static getStubConfig(){return{type:`custom:${$e}`,entry_id:""}}static async getConfigElement(){return document.createElement(we)}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ve(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){if(this._fetchInFlight)return;this._fetchInFlight=!0;const e=++this._fetchGen;We(this.hass).then(t=>{e===this._fetchGen&&(this._registry=t,this._registryError=null)}).catch(t=>{e===this._fetchGen&&(this._registryError=t?.message??"entity registry fetch failed")}).finally(()=>{e===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return K;if(null===this._registry)return B`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?De("tile.registry_failed",this.hass,{error:this._registryError}):De("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=Le(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?B`
      <ha-card>${this._renderTile(e)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${e}
        .open=${this._dialogOpen}
        .showCompass=${!1!==this._config.show_compass}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `:B`<ha-card>
        <div class="empty">
          <p class="dim">
            ${De("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`}_buildHandlerLabels(){const e={};for(const[t,s]of Object.entries(Ae))e[t]=De(s,this.hass);return e}_renderTile(e){const t=this._config,s=t.name??e.entry_title,o=this._resolvedCover(e),i=t.icon??function(e,t){if(null!==t&&!Number.isNaN(t)){if(t>=95)return Ee[e]??"mdi:window-shutter-open";if(t<=5)return Pe[e]??"mdi:window-shutter"}return Se[e]??"mdi:window-shutter"}(e.cover_type,this._liveCoverPosition(o)),n=!1!==t.show_position,r=!1!==t.show_state,a=!1!==t.show_controls,l=!1!==t.show_badge,c=!1!==t.show_motion_icon?this._motionActiveState(e):null,d=De("timeout_pending"===c?"tile.motion_pending":"tile.motion_detected",this.hass),h="detailed"===t.layout,p=this._currentPosition(e),u=this._liveCoverPosition(o)??p,_=this._winner(e),m=this._traceAttrs(e),g=this._manualEndIso(e),v=this._shouldShowResume(e),f=this._isFullyInert(t),y=!0===t.show_decision_summary&&m?xt(m.trace??[],m,0,this._buildHandlerLabels()):"",b=!!y&&h,$=this._switchOn(e,"integration_enabled_switch"),w=this._switchOn(e,"automatic_control_switch"),x=l&&!(!1===w&&!0===$),k=r?function(e,t){if(!e||!t)return null;const s=e.states[t];if(!s?.state||"unknown"===s.state||"unavailable"===s.state)return null;if("function"==typeof e.formatEntityState){const t=e.formatEntityState(s);if(t)return t}if("function"==typeof e.localize){const t=e.localize(`component.cover.entity_component._.state.${s.state}`);if(t)return t}return s.state.charAt(0).toUpperCase()+s.state.slice(1)}(this.hass,o):null,C=[k,n&&null!==u?pt(u):null].filter(e=>!!e);return B`
      <div
        class=${`tile-body${h?" detailed":""}${b?" has-summary":""}${k?" has-state-label":""}${h&&(x||v)?" has-row3":""}`}
        role=${f?"group":"button"}
        tabindex=${f?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
          <ha-icon class="cover-icon" icon=${i}></ha-icon>
          ${c?B`<ha-icon
                class="motion-overlay ${c}"
                icon="mdi:motion-sensor"
                title=${d}
              ></ha-icon>`:K}
        </div>
        <div class="label">
          <div class="title" title=${e.entry_title}>${s}</div>
          ${y&&!h?B`<div class="summary">${y}</div>`:K}
          ${b?B`<div class="summary inline-summary" title=${y}>${y}</div>`:K}
        </div>
        ${C.length>0?B`<div class="position">${C.join(" · ")}</div>`:K}
        ${a?B`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${De("tile.open",this.hass)}
                ?disabled=${!o}
                @click=${()=>this._setCoverPosition(o,100)}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${De("tile.stop",this.hass)}
                ?disabled=${!o}
                @click=${()=>this._stopCover(o)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${De("tile.close",this.hass)}
                ?disabled=${!o}
                @click=${()=>this._setCoverPosition(o,0)}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </div>`:K}
        ${x?B`<acp-tile-badge
              .hass=${this.hass}
              .winner=${_}
              .integrationEnabled=${$}
              .slotNumber=${m?.custom_position_active_slot}
              .slotName=${m?.custom_position_active_slot_name}
              .pct=${$t(m,p)??void 0}
              .minimumMode=${m?.custom_position_minimum_mode}
              .manualEndIso=${g}
              .manualActive=${this._manualOverrideOn(e)}
            ></acp-tile-badge>`:K}
        ${v?B`<button
              class="resume"
              type="button"
              aria-label=${De("tile.resume_aria",this.hass)}
              @click=${t=>{t.stopPropagation(),this._resume(e)}}
              @pointerdown=${this._stop}
            >
              ${De("tile.resume",this.hass)}
            </button>`:K}
      </div>
    `}_resolvedCover(e){return this._config?.cover?this._config.cover:e.managed_covers[0]}_currentPosition(e){const t=e.entities.target_position_sensor;if(!t)return null;const s=this.hass.states[t];if(!s)return null;const o=parseFloat(s.state);return Number.isNaN(o)?null:o}_liveCoverPosition(e){if(!e)return null;const t=this.hass.states[e]?.attributes?.current_position;return"number"!=typeof t||Number.isNaN(t)?null:t}_winner(e){const t=e.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(e){const t=e.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_motionActiveState(e){const t=e.entities.motion_status_sensor;if(!t)return null;const s=this.hass.states[t]?.state;return"motion_detected"===s||"timeout_pending"===s?s:null}_manualOverrideOn(e){const t=e.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(e,t){const s=e.entities[t];return!s||"off"!==this.hass.states[s]?.state}_manualEndIso(e){if(!this._manualOverrideOn(e))return;const t=e.entities.manual_override_end_sensor;return t?this.hass.states[t]?.state:void 0}_shouldShowResume(e){if(!e.entities.reset_override_button)return!1;const t=this._config?.show_resume??"auto";return"never"!==t&&("always"===t||this._manualOverrideOn(e))}_setCoverPosition(e,t){e&&this.hass.callService(xe,"set_position",{position:t},{entity_id:e})}_stopCover(e){e&&this.hass.callService(xe,"stop",{},{entity_id:e})}_resume(e){const t=e.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}_tapActionConfig(){const e=this._config?.tap_action;if("string"!=typeof e)return e}_isFullyInert(e){return!!(e=>!!e&&"none"===e.action)(this._tapActionConfig())&&!zt(e.hold_action)&&!zt(e.double_tap_action)}_fireAction(e){if(!this._config||!this.hass)return;const t=this._tapActionConfig();if("tap"===e&&void 0===t)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const s=this._resolvedCoverFromState();((e,t,s,o)=>{let i;"double_tap"===o&&s.double_tap_action?i=s.double_tap_action:"hold"===o&&s.hold_action?i=s.hold_action:"tap"===o&&s.tap_action&&(i=s.tap_action),((e,t,s,o)=>{if(o||(o={action:"more-info"}),!o.confirmation||o.confirmation.exemptions&&o.confirmation.exemptions.some(e=>e.user===t.user.id)||(Pt("warning"),confirm(o.confirmation.text||`Are you sure you want to ${o.action}?`)))switch(o.action){case"more-info":(s.entity||s.camera_image)&&Et(e,"hass-more-info",{entityId:s.entity?s.entity:s.camera_image});break;case"navigate":o.navigation_path&&((e,t,s=!1)=>{s?history.replaceState(null,"",t):history.pushState(null,"",t),Et(window,"location-changed",{replace:s})})(0,o.navigation_path);break;case"url":o.url_path&&window.open(o.url_path);break;case"toggle":s.entity&&(((e,t)=>{((e,t,s=!0)=>{const o=function(e){return e.substr(0,e.indexOf("."))}(t),i="group"===o?"homeassistant":o;let n;switch(o){case"lock":n=s?"unlock":"lock";break;case"cover":n=s?"open_cover":"close_cover";break;default:n=s?"turn_on":"turn_off"}e.callService(i,n,{entity_id:t})})(e,t,St.includes(e.states[t].state))})(t,s.entity),Pt("success"));break;case"call-service":{if(!o.service)return void Pt("failure");const[e,s]=o.service.split(".",2);t.callService(e,s,o.service_data,o.target),Pt("success");break}case"fire-dom-event":Et(e,"ll-custom",o)}})(e,t,s,i)})(this,this.hass,{entity:s,tap_action:t,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},e)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const e=Le(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?.managed_covers[0]}_stop(e){e.stopPropagation()}};Bt.styles=r`
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
      grid-template-columns: 24px minmax(0, 1fr) 3rem auto auto auto;
      grid-template-areas: 'icon label position controls badge resume';
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
      grid-template-columns: 24px minmax(0, 1fr) auto auto auto auto;
    }
    /* Detailed layout: title row, state row, optional badge/resume row.
       Icon spans every row so it's vertically centered against the whole
       tile; controls float to the right of rows 1-2 (HA tile-card style);
       resume sits below controls on row 3 when shown. */
    .tile-body.detailed {
      grid-template-columns: 24px minmax(0, 1fr) auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label    controls'
        'icon position controls';
      row-gap: 4px;
    }
    .tile-body.detailed.has-row3 {
      grid-template-rows: auto auto auto;
      grid-template-areas:
        'icon label    controls'
        'icon position controls'
        'icon badge    resume';
    }
    .tile-body.detailed.has-state-label {
      grid-template-columns: 24px minmax(0, 1fr) auto;
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
    .tile-body.detailed acp-tile-badge {
      justify-self: start;
      margin-top: 2px;
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
    .resume {
      grid-area: resume;
      padding: 2px 8px;
      border: 1px solid var(--primary-color);
      border-radius: 999px;
      background: transparent;
      color: var(--primary-color);
      font-size: 0.75rem;
      cursor: pointer;
    }
    .resume:hover {
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
    }
    .empty {
      padding: 12px;
      text-align: center;
    }
    .dim {
      color: var(--secondary-text-color);
      margin: 0;
    }
  `,e([_e({attribute:!1})],Bt.prototype,"hass",void 0),e([me()],Bt.prototype,"_config",void 0),e([me()],Bt.prototype,"_registry",void 0),e([me()],Bt.prototype,"_registryError",void 0),e([me()],Bt.prototype,"_dialogOpen",void 0),Bt=e([he($e)],Bt),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===$e)||window.customCards.push({type:$e,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Wt=[{key:"sky",labelKey:"editor.main.section_sky_label",descKey:"editor.main.section_sky_desc"},{key:"elevation",labelKey:"editor.main.section_elevation_label",descKey:"editor.main.section_elevation_desc"},{key:"decision",labelKey:"editor.main.section_decision_label",descKey:"editor.main.section_decision_desc"},{key:"covers",labelKey:"editor.main.section_covers_label",descKey:"editor.main.section_covers_desc"},{key:"overrides",labelKey:"editor.main.section_overrides_label",descKey:"editor.main.section_overrides_desc"},{key:"climate",labelKey:"editor.main.section_climate_label",descKey:"editor.main.section_climate_desc"}],Vt=Wt.map(e=>e.key);let Kt=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,jt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??Vt}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_onEntryChange(e){const t=e.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:t})}_onSectionToggle(e,t){const s=new Set(this._currentSections);t?s.add(e):s.delete(e);const o=Wt.map(e=>e.key).filter(e=>s.has(e));this._emit({...this._config??{type:"",entry_id:""},show_sections:o})}_onCompactToggle(e){this._emit({...this._config??{type:"",entry_id:""},compact:e})}_onVersionToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_version:e})}_onCompassStatsToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:e})}_onCompassLegendToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:e})}_onMoonToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_moon:e})}_onHideInactiveToggle(e){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:e})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),s=Number.isFinite(t)?t:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:s})}_onControlToggle(e,t){const s=this._config??{type:"",entry_id:""};this._emit({...s,controls:{...s.controls,[e]:t}})}render(){if(!this._config)return K;const e=new Set(this._currentSections);return B`
      <div class="form">
        <div class="section">
          <label class="field-label">${De("editor.common.entry_id",this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${De("editor.main.sections",this.hass)}</label>
          <div class="hint">${De("editor.main.sections_hint",this.hass)}</div>
          ${Wt.map(t=>B`
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
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_version??!1}
              @change=${e=>this._onVersionToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${De("editor.main.show_version_label",this.hass)}</span>
              <span class="toggle-desc">${De("editor.main.show_version_desc",this.hass)}</span>
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
      </div>
    `}_renderEntryPicker(){return this._entriesError?B`
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
      `:this._entries?0===this._entries.length?B`
        <div class="error">
          ${De("editor.common.no_entries",this.hass)}
          <code>${De("editor.common.no_entries_path",this.hass)}</code>${De("editor.common.no_entries_then",this.hass)}
        </div>
      `:B`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(e=>e.entry_id===this._config.entry_id)?B`<option value=${this._config.entry_id}>
              ${De("editor.common.unknown_entry",this.hass,{entry:this._config.entry_id})}
            </option>`:K}
        ${this._entries.map(e=>B`
            <option value=${e.entry_id} ?selected=${e.entry_id===this._config?.entry_id}>
              ${e.title}
            </option>
          `)}
      </select>
    `:B`<div class="hint">${De("editor.common.loading_entries",this.hass)}</div>`}};Kt.styles=r`
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
  `,e([_e({attribute:!1})],Kt.prototype,"hass",void 0),e([me()],Kt.prototype,"_config",void 0),e([me()],Kt.prototype,"_entries",void 0),e([me()],Kt.prototype,"_entriesError",void 0),Kt=e([he(fe)],Kt);const Gt=[{key:"compact",labelKey:"editor.compass.toggle_compact_label",descKey:"editor.compass.toggle_compact_desc",defaultOn:!1},{key:"show_legend",labelKey:"editor.compass.toggle_legend_label",descKey:"editor.compass.toggle_legend_desc",defaultOn:!0},{key:"show_stats",labelKey:"editor.compass.toggle_stats_label",descKey:"editor.compass.toggle_stats_desc",defaultOn:!0},{key:"show_moon",labelKey:"editor.compass.toggle_moon_label",descKey:"editor.compass.toggle_moon_desc",defaultOn:!1},{key:"show_cardinals",labelKey:"editor.compass.toggle_cardinals_label",descKey:"editor.compass.toggle_cardinals_desc",defaultOn:!0},{key:"show_blind_spot",labelKey:"editor.compass.toggle_blind_spot_label",descKey:"editor.compass.toggle_blind_spot_desc",defaultOn:!0},{key:"show_sun_path",labelKey:"editor.compass.toggle_sun_path_label",descKey:"editor.compass.toggle_sun_path_desc",defaultOn:!0},{key:"show_sunrise_sunset",labelKey:"editor.compass.toggle_sunrise_sunset_label",descKey:"editor.compass.toggle_sunrise_sunset_desc",defaultOn:!0},{key:"show_cover_fill",labelKey:"editor.compass.toggle_cover_fill_label",descKey:"editor.compass.toggle_cover_fill_desc",defaultOn:!0},{key:"show_window_arrow",labelKey:"editor.compass.toggle_window_arrow_label",descKey:"editor.compass.toggle_window_arrow_desc",defaultOn:!0}];let Zt=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,jt(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${ye}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let s=0;s<e.length;s++)e[s]&&(t=s);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,s){const o=this._trimColors(t),{cover_colors:i,...n}=e,r=o?{...n,...s,cover_colors:o}:{...n,...s};this._emit(r)}_onCoverColorChange(e,t){const s=this._baseConfig(),o=[...s.cover_colors??[]];for(;o.length<=e;)o.push(null);o[e]=t,this._emitWithColors(s,o)}_onCoverColorReset(e){const t=this._baseConfig(),s=[...t.cover_colors??[]];e<s.length&&(s[e]=null),this._emitWithColors(t,s)}_onEntryToggle(e,t){const s=this._baseConfig(),o=new Set(s.entry_ids);t?o.add(e):o.delete(e);const i=(this._entries??[]).map(e=>e.entry_id).filter(e=>o.has(e)),n=s.cover_colors??[],r=i.map(e=>{const t=s.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(s,r,{entry_ids:i})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),s=Number.isFinite(t)?t:0;this._emit({...this._baseConfig(),north_offset:s})}_onTitleChange(e){const t=e.target.value,s=this._baseConfig();if(t)this._emit({...s,title:t});else{const{title:e,...t}=s;this._emit(t)}}render(){if(!this._config)return K;const e=new Set(this._config.entry_ids);return B`
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

        ${this._config.entry_ids.length>0?B`
              <div class="section">
                <label class="field-label">${De("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${De("editor.compass.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const s=this._config.cover_colors?.[t]??null,o=s??vt(t),i=this._entries?.find(t=>t.entry_id===e);return B`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${o}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${i?.title??e}</span>
                        <span class="toggle-desc"
                          >${s||De("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!s}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${De("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:K}

        <div class="section">
          <label class="field-label">${De("editor.compass.display",this.hass)}</label>
          ${Gt.map(e=>B`
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
      </div>
    `}_renderEntryPicker(e){return this._entriesError?B`<div class="error">
        ${De("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?B`
        <div class="error">
          ${De("editor.common.no_entries",this.hass)}
          <code>${De("editor.common.no_entries_path",this.hass)}</code>${De("editor.common.no_entries_then",this.hass)}
        </div>
      `:B`
      <div class="entry-list">
        ${this._entries.map(t=>B`
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
    `:B`<div class="hint">${De("editor.common.loading_entries",this.hass)}</div>`}};Zt.styles=r`
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
  `,e([_e({attribute:!1})],Zt.prototype,"hass",void 0),e([me()],Zt.prototype,"_config",void 0),e([me()],Zt.prototype,"_entries",void 0),e([me()],Zt.prototype,"_entriesError",void 0),Zt=e([he(be)],Zt);let Yt=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");this._config={...e,entry_ids:[...e.entry_ids]}}getCardSize(){return 4}static async getConfigElement(){return document.createElement(be)}static getStubConfig(){return{type:`custom:${ye}`,entry_ids:[]}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ve(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,We(this.hass).then(e=>{this._registry=e,this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return K;if(null===this._registry)return B`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?De("tile.registry_failed",this.hass,{error:this._registryError}):De("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=[],t=[];for(const s of this._config.entry_ids){const o=Le(this.hass,{type:this._config.type,entry_id:s},this._registry);o?e.push(o):t.push(s)}if(0===e.length)return B`<ha-card>
        <div class="empty">
          <p><strong>${De("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${De("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const s=this._config;return B`
      <ha-card>
        ${s.title?B`<div class="card-header">${s.title}</div>`:K}
        <acp-sky-compass
          .hass=${this.hass}
          .discovered_list=${e}
          ?compact=${!!s.compact}
          .showLegend=${s.show_legend??!0}
          .showStats=${s.show_stats??!0}
          .showMoon=${s.show_moon??!1}
          .showCardinals=${s.show_cardinals??!0}
          .showBlindSpot=${s.show_blind_spot??!0}
          .showSunPath=${s.show_sun_path??!0}
          .showSunriseSunset=${s.show_sunrise_sunset??!0}
          .showCoverFill=${s.show_cover_fill??!0}
          .showWindowArrow=${s.show_window_arrow??!0}
          .coverColors=${s.cover_colors??[]}
          .northOffsetDeg=${Be(s.north_offset??0)}
        ></acp-sky-compass>
        ${t.length>0?B`<div class="warn dim">
              ${De("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:K}
      </ha-card>
    `}};Yt.styles=r`
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
  `,e([_e({attribute:!1})],Yt.prototype,"hass",void 0),e([me()],Yt.prototype,"_config",void 0),e([me()],Yt.prototype,"_registry",void 0),e([me()],Yt.prototype,"_registryError",void 0),Yt=e([he(ye)],Yt),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ye)||window.customCards.push({type:ye,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Jt=["sky","elevation","decision","covers","overrides","climate"];let Xt=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let e=null,t=null;return(s,o,i)=>{const n=o.entry_id??"";return null!==e&&e.registry===i&&e.hass===s&&e.entryId===n||(e={registry:i,hass:s,entryId:n},t=Le(s,o,i)),t}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(e){if(!e?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...e},null===this._registry){const t=Ge.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(fe)}static getStubConfig(){return{type:`custom:${ve}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(e){null!==this._registry&&this._config&&this.hass&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ve(this.hass,e=>{const t=new Set(Ye(this._registry??[],this._config?.entry_id??"").map(e=>e.entity_id));(function(e,t){return"create"===e.action||t.has(e.entity_id)})(e,t)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,We(this.hass).then(e=>{const t=this._config?.entry_id;if(t){const s=Ye(e,t);(null===this._registry||function(e,t){if(e.length!==t.length)return!0;const s=new Map(e.map(e=>[e.entity_id,Ze(e)]));for(const e of t)if(s.get(e.entity_id)!==Ze(e))return!0;return!1}(Ye(this._registry,t),s))&&(this._registry=e,Ge.set(t,s))}else this._registry=e;this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const e=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=e);const t=e-this._debounceFirstAt,s=this._DEBOUNCE_MAX-t,o=Math.min(this._DEBOUNCE_DELAY,s);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),o<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},o)}get _sections(){return this._config?.show_sections??Jt}_renderHeader(e,t){const s=Se[e.cover_type]??"mdi:window-shutter",o=e.entities.integration_enabled_switch,i=e.entities.automatic_control_switch,n=!o||"on"===this.hass.states[o]?.state,r=!i||"on"===this.hass.states[i]?.state;return B`
      <div class="header">
        <ha-icon .icon=${s}></ha-icon>
        <span class="title">${e.entry_title}</span>
        <span class="spacer"></span>
        ${o?B`<acp-header-pill
              .on=${n}
              .readonly=${!t.integration_enabled}
              .label=${De(n?"header.on":"header.off",this.hass)}
              title=${De("header.integration_enabled",this.hass)}
              @pill-click=${()=>this._toggle(o)}
            ></acp-header-pill>`:K}
        ${i?B`<acp-header-pill
              .on=${r}
              .readonly=${!t.automatic_control}
              .label=${De("header.auto",this.hass)}
              title=${De("header.automatic_control",this.hass)}
              @pill-click=${()=>this._toggle(i)}
            ></acp-header-pill>`:K}
      </div>
    `}_toggle(e){const t=e.split(".")[0];this.hass.callService(t,"toggle",{entity_id:e})}_renderLoading(){return B`
      <ha-card>
        <div class="empty">
          <p class="dim">${De("root.loading_registry",this.hass)}</p>
        </div>
      </ha-card>
    `}_renderEmpty(e){const t=this._config.entry_id,s=this._registry?.length??0,o=this._registry?.filter(e=>e.config_entry_id===t&&"adaptive_cover_pro"===e.platform).length;return B`
      <ha-card>
        <div class="empty">
          <p><strong>${De("root.no_entities_title",this.hass)}</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${t}</code></p>
          <ul class="diag">
            <li>Reason: <code>${e}</code></li>
            <li>Registry entries loaded: <code>${s}</code></li>
            <li>ACP entities matching entry_id: <code>${o??"—"}</code></li>
            ${this._registryError?B`<li>Registry fetch error: <code>${this._registryError}</code></li>`:K}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return K;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const e=this._discovered;if(!e)return this._renderEmpty("no matching entities after unique_id lookup");const t=(s=this._config,{...Me,...s?.controls});var s;const o=this._sections;return B`
      <ha-card>
        ${this._renderHeader(e,t)}
        <div class="body ${this._config.compact?"compact":""}">
          ${o.includes("sky")?B`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${[e]}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .northOffsetDeg=${Be(this._config.north_offset??0)}
              ></acp-sky-compass>`:K}
          ${o.includes("elevation")?B`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:K}
          ${o.includes("decision")?B`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                ?show-summary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:K}
          ${o.includes("covers")?B`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:K}
          ${o.includes("overrides")?B`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .resetEnabled=${t.reset_manual_override}
              ></acp-overrides-panel>`:K}
          ${o.includes("climate")?B`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:K}
        </div>
        ${this._config.show_version?B`<div class="footer dim">
              ${De("root.footer_version",this.hass,{version:ge})}
            </div>`:K}
      </ha-card>
    `}};Xt.styles=r`
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
    .footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `,e([_e({attribute:!1})],Xt.prototype,"hass",void 0),e([me()],Xt.prototype,"_config",void 0),e([me()],Xt.prototype,"_registry",void 0),e([me()],Xt.prototype,"_registryError",void 0),e([me()],Xt.prototype,"_discovered",void 0),Xt=e([he(ve)],Xt),window.customCards=window.customCards||[],window.customCards.push({type:ve,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${ge} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{Xt as AdaptiveCoverProCard};
