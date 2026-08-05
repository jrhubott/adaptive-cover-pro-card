/*! adaptive-cover-pro-card v2.16.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function e(e,t,o,i){var s,n=arguments.length,r=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,o,i);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,o=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&s.set(t,e))}return e}toString(){return this.cssText}};const r=e=>new n("string"==typeof e?e:e+"",void 0,i),a=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,o,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new n(o,e,i)},l=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return r(t)})(e):e,{is:c,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:_}=Object,g=globalThis,m=g.trustedTypes,v=m?m.emptyScript:"",f=g.reactiveElementPolyfillSupport,b=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?v:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},w=(e,t)=>!c(e,t),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,t);void 0!==i&&d(this.prototype,e,i)}}static getPropertyDescriptor(e,t,o){const{get:i,set:s}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);s?.call(this,t),this.requestUpdate(e,n,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=_(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...p(e),...u(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(o)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const o of i){const i=document.createElement("style"),s=t.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=o.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(void 0!==i&&!0===o.reflect){const s=(void 0!==o.converter?.toAttribute?o.converter:y).toAttribute(t,o.type);this._$Em=e,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){const o=this.constructor,i=o._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=o.getPropertyOptions(i),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const n=s.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,o,i=!1,s){if(void 0!==e){const n=this.constructor;if(!1===i&&(s=this[e]),o??=n.getPropertyOptions(e),!((o.hasChanged??w)(s,t)||o.useDefault&&o.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:i,wrapped:s},n){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,o,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[b("elementProperties")]=new Map,$[b("finalized")]=new Map,f?.({ReactiveElement:$}),(g.reactiveElementVersions??=[]).push("2.1.2");const k=globalThis,A=e=>e,S=k.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+z,T=`<${M}>`,I=document,P=()=>I.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,D="[ \t\n\f\r]",B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,R=/>/g,j=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,K=/"/g,G=/^(?:script|style|textarea|title)$/i,W=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),H=W(1),U=W(2),q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),Y=new WeakMap,Z=I.createTreeWalker(I,129);function Q(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}class X{constructor({strings:e,_$litType$:t},o){let i;this.parts=[];let s=0,n=0;const r=e.length-1,a=this.parts,[l,c]=((e,t)=>{const o=e.length-1,i=[];let s,n=2===t?"<svg>":3===t?"<math>":"",r=B;for(let t=0;t<o;t++){const o=e[t];let a,l,c=-1,d=0;for(;d<o.length&&(r.lastIndex=d,l=r.exec(o),null!==l);)d=r.lastIndex,r===B?"!--"===l[1]?r=F:void 0!==l[1]?r=R:void 0!==l[2]?(G.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=j):void 0!==l[3]&&(r=j):r===j?">"===l[0]?(r=s??B,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?j:'"'===l[3]?K:L):r===K||r===L?r=j:r===F||r===R?r=B:(r=j,s=void 0);const h=r===j&&e[t+1].startsWith("/>")?" ":"";n+=r===B?o+T:c>=0?(i.push(a),o.slice(0,c)+E+o.slice(c)+z+h):o+z+(-2===c?t:h)}return[Q(e,n+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]})(e,t);if(this.el=X.createElement(l,o),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Z.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(E)){const t=c[n++],o=i.getAttribute(e).split(z),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:s,name:r[2],strings:o,ctor:"."===r[1]?ie:"?"===r[1]?se:"@"===r[1]?ne:oe}),i.removeAttribute(e)}else e.startsWith(z)&&(a.push({type:6,index:s}),i.removeAttribute(e));if(G.test(i.tagName)){const e=i.textContent.split(z),t=e.length-1;if(t>0){i.textContent=S?S.emptyScript:"";for(let o=0;o<t;o++)i.append(e[o],P()),Z.nextNode(),a.push({type:2,index:++s});i.append(e[t],P())}}}else if(8===i.nodeType)if(i.data===M)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=i.data.indexOf(z,e+1));)a.push({type:7,index:s}),e+=z.length-1}s++}}static createElement(e,t){const o=I.createElement("template");return o.innerHTML=e,o}}function J(e,t,o=e,i){if(t===q)return t;let s=void 0!==i?o._$Co?.[i]:o._$Cl;const n=O(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,o,i)),void 0!==i?(o._$Co??=[])[i]=s:o._$Cl=s),void 0!==s&&(t=J(e,s._$AS(e,t.values),s,i)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,i=(e?.creationScope??I).importNode(t,!0);Z.currentNode=i;let s=Z.nextNode(),n=0,r=0,a=o[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new te(s,s.nextSibling,this,e):1===a.type?t=new a.ctor(s,a.name,a.strings,this,e):6===a.type&&(t=new re(s,this,e)),this._$AV.push(t),a=o[++r]}n!==a?.index&&(s=Z.nextNode(),n++)}return Z.currentNode=I,i}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),O(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,i="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=X.createElement(Q(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ee(i,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=Y.get(e.strings);return void 0===t&&Y.set(e.strings,t=new X(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,i=0;for(const s of e)i===t.length?t.push(o=new te(this.O(P()),this.O(P()),this,this.options)):o=t[i],o._$AI(s),i++;i<t.length&&(this._$AR(o&&o._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class oe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,i,s){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=V}_$AI(e,t=this,o,i){const s=this.strings;let n=!1;if(void 0===s)e=J(this,e,t,0),n=!O(e)||e!==this._$AH&&e!==q,n&&(this._$AH=e);else{const i=e;let r,a;for(e=s[0],r=0;r<s.length-1;r++)a=J(this,i[o+r],t,r),a===q&&(a=this._$AH[r]),n||=!O(a)||a!==this._$AH[r],a===V?e=V:e!==V&&(e+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!i&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends oe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class se extends oe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class ne extends oe{constructor(e,t,o,i,s){super(e,t,o,i,s),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??V)===q)return;const o=this._$AH,i=e===V&&o!==V||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==V&&(o===V||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const ae={I:te},le=k.litHtmlPolyfillSupport;le?.(X,te),(k.litHtmlVersions??=[]).push("3.3.2");const ce=globalThis;let de=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const i=o?.renderBefore??t;let s=i._$litPart$;if(void 0===s){const e=o?.renderBefore??null;i._$litPart$=s=new te(t.insertBefore(P(),e),e,void 0,o??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};de._$litElement$=!0,de.finalized=!0,ce.litElementHydrateSupport?.({LitElement:de});const he=ce.litElementPolyfillSupport;he?.({LitElement:de}),(ce.litElementVersions??=[]).push("4.2.2");const pe=e=>(t,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ue={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:w},_e=(e=ue,t,o)=>{const{kind:i,metadata:s}=o;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(o.name,e),"accessor"===i){const{name:i}=o;return{set(o){const s=t.get.call(this);t.set.call(this,o),this.requestUpdate(i,s,e,!0,o)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=o;return function(o){const s=this[i];t.call(this,o),this.requestUpdate(i,s,e,!0,o)}}throw Error("Unsupported decorator location: "+i)};function ge(e){return(t,o)=>"object"==typeof o?_e(e,t,o):((e,t,o)=>{const i=t.hasOwnProperty(o);return t.constructor.createProperty(o,e),i?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}function me(e){return ge({...e,state:!0,attribute:!1})}function ve(e,t,o){if(!e)return!0;for(const i of o)if(i&&e.states[i]!==t.states[i])return!0;return!1}const fe="2.16.0",be="adaptive-cover-pro-card",ye="adaptive-cover-pro-card-editor",we="adaptive-cover-pro-sky-compass-card",xe="adaptive-cover-pro-sky-compass-card-editor",$e="adaptive-cover-pro-tile-card",ke="adaptive-cover-pro-tile-card-editor",Ae="adaptive-cover-pro-decision-card",Se="adaptive-cover-pro-decision-card-editor",Ce="adaptive-cover-pro-solar-chart-card",Ee="adaptive-cover-pro-solar-chart-card-editor",ze="adaptive-cover-pro-history-card",Me="adaptive-cover-pro-history-card-editor",Te="adaptive_cover_pro",Ie=["force","weather","group_scene","manual","group_lock","custom_position","motion","cloud","climate","glare_zone","solar","default","floor_clamp"],Pe={force:"Force Override",weather:"Weather Safety",group_scene:"Group Scene",manual:"Manual Override",group_lock:"Group Lock",custom_position:"Custom Position",motion:"Occupancy Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},Oe={force:"handler.force",weather:"handler.weather",group_scene:"handler.group_scene",manual:"handler.manual",group_lock:"handler.group_lock",custom_position:"handler.custom_position",motion:"handler.motion",cloud:"handler.cloud",climate:"handler.climate",glare_zone:"handler.glare_zone",solar:"handler.solar",default:"handler.default",floor_clamp:"handler.floor_clamp"},Ne={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds",cover_venetian:"mdi:blinds"},De={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open",cover_venetian:"mdi:blinds-open"},Be={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds",cover_venetian:"mdi:blinds"},Fe={awning:{open:"mdi:awning-outline",partial:"mdi:awning-outline",closed:"mdi:awning-outline"},blind:{open:"mdi:blinds-open",partial:"mdi:blinds-horizontal",closed:"mdi:blinds-horizontal-closed"},curtain:{open:"mdi:curtains",partial:"mdi:curtains",closed:"mdi:curtains-closed"},damper:{open:"mdi:circle",partial:"mdi:circle-slice-8",closed:"mdi:circle-slice-8"},door:{open:"mdi:door-open",partial:"mdi:door-open",closed:"mdi:door-closed"},garage:{open:"mdi:garage-open",partial:"mdi:garage-open",closed:"mdi:garage"},gate:{open:"mdi:gate-open",partial:"mdi:gate-open",closed:"mdi:gate"},shade:{open:"mdi:roller-shade",partial:"mdi:roller-shade",closed:"mdi:roller-shade-closed"},shutter:{open:"mdi:window-shutter-open",partial:"mdi:window-shutter",closed:"mdi:window-shutter"},window:{open:"mdi:window-open",partial:"mdi:window-open",closed:"mdi:window-closed"}},Re=new Set(["awning","curtain","door","gate"]),je={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion",group_scene:"group",group_lock:"group"};function Le(e,t,o=22){return{label:e,accent:t,bg:`color-mix(in srgb, ${t} ${o}%, transparent)`,fg:`color-mix(in srgb, ${t} 40%, var(--primary-text-color, #212121))`}}const Ke={auto:Le("Auto","#4caf50",18),manual:Le("Manual","#ff9800"),force:Le("Force","#f44336"),weather:Le("Sun protection","#f44336"),glare_zone:Le("Glare","#f44336"),climate:Le("Climate","#009688"),cloud:Le("Cloudy","#2196f3"),custom_position:Le("Custom","#9c27b0"),solar:Le("Solar tracking","#4caf50"),motion:Le("Occupancy","#ffeb3b"),off:Le("Off","#616161",28),off_schedule:Le("Off-schedule","#607d8b"),group:Le("Group","#4caf50",18)},Ge={auto:"badge.auto",manual:"badge.manual",force:"badge.force",weather:"badge.weather",glare_zone:"badge.glare_zone",climate:"badge.climate",cloud:"badge.cloud",custom_position:"badge.custom_position",solar:"badge.solar",motion:"badge.motion",off:"badge.off",off_schedule:"badge.off_schedule",group:"badge.group"},We={auto:"mdi:autorenew",manual:"mdi:hand-back-right",force:"mdi:flash",weather:"mdi:shield-sun",glare_zone:"mdi:weather-sunny-alert",climate:"mdi:thermostat",cloud:"mdi:weather-cloudy",custom_position:"mdi:bookmark",solar:"mdi:white-balance-sunny",motion:"mdi:motion-sensor",off:"mdi:power",off_schedule:"mdi:clock-alert-outline",group:"mdi:window-shutter-cog"},He={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Ue={position:"target_position_sensor",tilt:"target_tilt_sensor"},qe={position:"covers.position_title",tilt:"covers.tilt_title"},Ve="mdi:chart-box",Ye={active:"control_status.active",outside_time_window:"control_status.outside_time_window",position_delta_too_small:"control_status.position_delta_too_small",time_delta_too_small:"control_status.time_delta_too_small",manual_override:"control_status.manual_override",automatic_control_off:"control_status.automatic_control_off",sun_not_visible:"control_status.sun_not_visible",force_override_active:"control_status.force_override_active",weather_override_active:"control_status.weather_override_active",motion_timeout:"control_status.motion_timeout"},Ze=new Set(["active"]),Qe=[{role:"integration_enabled_switch",key:"history.track_enabled",cls:"ctx-enabled"},{role:"automatic_control_switch",key:"history.track_auto",cls:"ctx-auto"},{role:"sun_infront_binary",key:"history.track_sun",cls:"ctx-sun"},{role:"glare_active_binary",key:"history.track_glare",cls:"ctx-glare"},{role:"manual_override_binary",key:"history.track_manual",cls:"ctx-manual"},{role:"position_mismatch_binary",key:"history.track_mismatch",cls:"ctx-mismatch"}],Xe=[6,12,24,48,72],Je={pipeline_evaluated:"info",cover_command_sent:"action",cover_command_skipped:"warn",end_time_default_sent:"action",manual_override_gate_closed:"warn",sun_entered_fov:"info",sun_left_fov:"info",sunset_window_opened:"info",transit_cleared:"info",transit_optimistic_target_replay:"info",transit_progress_forward:"info",transit_startup_delay:"warn",transit_timeout_cleared:"warn",reconcile_gave_up:"warn",reconcile_skipped_in_transit:"warn"},et={"sensor:Cover_Position":"target_position_sensor","sensor:Cover_Tilt":"target_tilt_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","sensor:solar_calculation":"solar_calculation_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button","sensor:group_position":"group_position_sensor","sensor:group_state":"group_state_sensor","sensor:group_active_scene":"group_active_scene_sensor","sensor:group_climate_mode":"group_climate_mode_sensor","sensor:group_who_won":"group_who_won_sensor","select:group_scene_select":"group_scene_select","switch:group_automation":"group_automation_switch","switch:group_lock":"group_lock_switch","button:group_scene_all_open":"group_scene_all_open_button","button:group_scene_all_closed":"group_scene_all_closed_button","button:group_scene_privacy":"group_scene_privacy_button","button:group_clear_overrides":"group_clear_overrides_button","cover:group_cover":"group_cover"},tt={en:{handler:{force:"Force Override",weather:"Weather Safety",group_scene:"Group Scene",manual:"Manual Override",group_lock:"Group Lock",custom_position:"Custom Position",motion:"Occupancy Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Weather safety",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Solar tracking",motion:"Occupancy idle",off:"Off",off_schedule:"Off-schedule",floor_suffix:" ↥",safety:"Safety",group:"Group",tip:{auto:"Automatic control is on and no handler is overriding — the cover follows the pipeline result.",manual:"Manual override is active — the cover is held where you put it and automatic control is paused.",manual_until:"Manual override is active until {time} — the cover is held where you put it until then.",force:"A forced position is overriding every other handler.",weather:"Weather safety is driving the position.",glare_zone:"The sun is in a configured glare zone, and the glare handler is driving the position.",climate:"Climate control is driving the position.",cloud:"Cloud cover is suppressing solar tracking.",custom_position:"A custom position slot is driving this cover.",custom_position_slot:"Slot: {name}.",custom_position_value:"Its position is {pct}%.",custom_position_floor:"It is applied as a floor: it raises the position above the raw calculation rather than replacing it.",solar:"Solar tracking — the position follows the sun across the window.",motion:"The room reads as unoccupied, so the occupancy handler is holding position.",off:"The integration is disabled for this cover — nothing is being driven.",off_schedule:"Outside the configured schedule window, so automatic control is paused.",group:"The Cover Group is currently deciding this position.",safety:"A safety position is overriding every other handler."}},group:{title:"Cover Group",scene:"Scene",scene_auto:"Auto",scene_all_open:"All open",scene_all_closed:"All closed",scene_privacy:"Privacy",state_open:"Open",state_closed:"Closed",state_mixed:"Mixed",state_unknown:"Unknown",lock:"Lock group",unlock:"Unlock group",automation:"Automation",automation_count:"{count} of {total} members automating",clear_overrides:"Clear overrides",clear_overrides_none:"No member overrides to clear",who_won:"{count} of {total} members are group-driven — a group scene or the group lock is currently deciding their position",members:"Members",member_placeholder:"No members reported by the integration.",position:"Position",open:"Open group",close:"Close group",stop:"Stop group",position_slider_label:"Group position",range:"{min}–{max}%",exception_held:"{count} held",exception_unavailable:"{count} unavailable",drag_to_set_all:"Drag to set all {count} covers",spread_value:"{min}% to {max}% across {count} covers"},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window sun acceptance angle",fov_exit:"Sun leaves window sun acceptance angle"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks.",solar_only_note:"Solar geometry only — does not reflect manual overrides, custom positions, cloud suppression, or weather.",legend_forecast:"Forecast",legend_actual:"Actual"},dialog:{battery:"{level}% battery",battery_named:"{name}: {level}%",battery_unknown:"Battery level unknown",extend:{title:"Extend manual override",presets_label:"Until",relative_label:"Add time",absolute_label:"End at",preview:"Override until {time}",confirm:"Extend",cancel:"Cancel",tomorrow_suffix:" (tomorrow)"},configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"↥",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Occupancy",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Occupancy",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"expires in {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance",mode_off:"Climate mode off",standby:"Standby",threshold_low:"low",threshold_high:"high",threshold_summer_outside:"summer",reason:{outside_time_window:"Outside the operating time window",thresholds_not_met:"Temperatures within the comfort band — no action needed",other_mode_active:"Another control mode is currently active",readings_unavailable:"Temperature readings unavailable",mode_off:"Climate mode is turned off"}},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in SAA",in_fov:"in SAA",in_fov_tooltip:"Sun is currently within this window’s sun acceptance angle",none:"—",sun:"Sun",moon:"Moon",sun_up_not_hitting:"Sun (up, not hitting)",sun_below_horizon:"Sun (below horizon)",window_fov:"Window SAA",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_target:"Cover target",cover_held:"Cover position (held)",window_normal:"Window azimuth",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"SAA {left} left / {right} right{elev}",window_normal_tooltip:"Window azimuth: {bearing}",cover_position_target:"Target: {pct}%",cover_position_target_awning:"Target (extended): {pct}%",cover_position_actual:"Actual: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",target_solar:"Solar target: {pct}",click_to_set:"Click to set position",position_slider_label:"Cover position slider",position_open_value:"{pct} open",opening:"Opening…",closing:"Closing…",target_tooltip:"Target {pct}%",target_tooltip_override:"Would-be solar target {pct}% — cover is held by manual override",target_tooltip_motor:"Motor: {pct}% (before calibration)",position_title:"Position",tilt_title:"Tilt",tilt_target:"Tilt: {pct}",tilt_click_to_set:"Click to set tilt",tilt_target_tooltip:"Tilt target {pct}%",goto_target:"Move to target ({pct}%) — keeps automatic control"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor",outside_schedule:"Outside schedule — automatic control paused",outside_schedule_tooltip:"The configured schedule window is not active, so automatic positioning is paused.",solar_would_be:"solar {pct}",next_change_in:"Next adjustment allowed in {time}"},solar:{title:"Solar Calculation",axis_position:"Position axis",axis_tilt:"Tilt axis",group_inputs:"Inputs",group_intermediates:"Intermediates",group_output:"Output",show_all:"Show all {count} values",show_less:"Show less",no_target:"No solar target — {status}",status:{direct_sun:"Direct sun",fov_exit:"Default · SAA exit",elevation_limit:"Default · elevation limit",sunset_offset:"Default · sunset offset",blind_spot:"Default · blind spot",default:"Default"},field:{sol_elev_deg:"Sun elevation",gamma_deg:"Relative azimuth (γ)",position_pct:"Position",effective_distance_m:"Effective distance",adjusted_height_m:"Adjusted height",safety_margin:"Safety margin",awn_angle_deg:"Awning angle",vertical_position_m:"Vertical position",length_m:"Extension length",slat_angle_raw_deg:"Slat angle",tilt_mode:"Tilt mode",max_degrees:"Max angle"}},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Occupancy timeout pending",motion_detected:"Occupancy detected",battery_low:"Low battery — {level}%",battery_unknown:"Battery level unknown",icon_action_label:"Cover icon action",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",extend_aria:"Extend manual override",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found.",unavailable:"Unavailable",rails_layered:"{count} rails of one cover",rails_separate:"{count} covers",rails_layered_hint:"Rails of one cover"},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"SAA: {from} → {to}",fov_windows:"SAA: {windows}",fov_window_named:"{name}: {windows}",no_fov_today:"Sun does not enter SAA today",placeholder:"Sun elevation chart unavailable.",schedule:"Schedule {from} – {to}",schedule_from:"Schedule from {from}",schedule_until:"Schedule until {to}",schedule_start_tooltip:"Schedule start",schedule_end_tooltip:"Schedule end"},control_status:{active:"Active",outside_time_window:"Outside time window",position_delta_too_small:"Position change too small",time_delta_too_small:"Too soon since last move",manual_override:"Manual override",automatic_control_off:"Automatic control off",sun_not_visible:"Sun not visible",force_override_active:"Force override",weather_override_active:"Weather safety",motion_timeout:"Occupancy timeout"},history:{title:"History",open:"History",close:"Close",refresh:"Refresh",loading:"Loading history…",no_data:"No recorded data",window_label:"History window",window_hours:"{hours}h",show_more:"Show more",expand:"Expand to full view",collapse:"Back to history",today:"Today",yesterday:"Yesterday",section_tracks:"Timeline",track_position:"Position",track_who_won:"Who won",track_control_status:"Control status",track_enabled:"Integration",track_auto:"Automatic control",track_sun:"Sun in SAA",track_glare:"Glare",track_manual:"Manual override",track_mismatch:"Position mismatch",legend_target:"Target",legend_actual:"Actual",legend_per_cover:"Per cover",legend_saa:"Sun in SAA",legend_night:"Night",stat_moves:"moves",stat_travel:"pts travelled",stat_override:"in manual override",copy_diagnostics:"Copy diagnostics",copied:"Copied",no_recorder_data:"Not recorded — check your recorder settings",activity_title:"Activity",activity_empty:"No recorded activity in this window.",advanced:"Advanced — event buffer",events_search:"Filter events…",events_count:"{shown} of {total} events",events_empty:"No events match the filter.",events_unavailable:"Event buffer unavailable — the integration did not return diagnostics.",buffer_size:"Buffer size: {size}",data_window:"Buffer window: {from} → {to}"},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",support_alt:"Buy me a coffee",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window SAA, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with SAA band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, occupancy tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy; shows standby when climate mode is off or inactive",section_solar_label:"Solar calculation",section_solar_desc:"Raw solar geometry breakdown (inputs → intermediates → output); requires the integration’s solar_calculation sensor",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers.",state_color_label:"Color icon by state",state_color_desc:"Header cover icon takes on the theme’s open/closed/active color."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑ ■ ↓ controls",covers:"Position bars (order)",covers_hint:"Drag a row, or use the arrows, to set the order the position bars appear in. The eye hides a bar without unbinding the cover.",member_names:"Member names",member_names_hint:"Rename a group member as it appears on this card. Leave blank to use the entry’s own name.",covers_move_up:"Move up",covers_move_down:"Move down",covers_hide:"Hide this bar",covers_show:"Show this bar",controls_cover:"Cover driven by ↑ ■ ↓",controls_axis:"Axis driven by ↑ ■ ↓",show_badge:"Show contextual badge",show_position_bar:"Show position bar",show_tilt:"Show tilt bar",content_section:"Content",controls_section:"Controls",dialog_section:"Dialog sections",group_row_section:"Group controls",show_scene_select:"Show scene selector",show_lock:"Show group lock",show_automation:"Show member automation toggle",show_clear_overrides:"Show clear-overrides button",show_member_badges:"Show member override badges",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Solar tracking",badge_force:"Force override",badge_weather:"Weather safety",badge_manual:"Manual override",badge_custom_position:"Custom position",badge_motion:"Occupancy",badge_climate:"Climate",badge_glare_zone:"Glare zone",badge_cloud:"Cloud suppression",show_compass:"Show sun compass in dialog",show_elevation_chart:"Show sun-today chart in dialog",show_solar_calc:"Show solar calculation in dialog",show_motion_icon:"Show occupancy indicator",state_color:"Color icon by state",interactions_section:"Interactions",tap_action:"Tap action",icon_tap_action:"Icon tap behavior",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",name_composed_hint:"A composed name is set in YAML. Type a new title here to replace it with plain text.",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth.",toggle_elevation_chart_label:"Sun-today chart",toggle_elevation_chart_desc:"Elevation-vs-time chart below the compass, with SAA band and elevation limits."},decision:{title:"Title (optional)",compact_label:"Compact mode",compact_desc:"Tighter rows; also hides inactive handlers.",hide_inactive_handlers_label:"Hide inactive handlers",hide_inactive_handlers_desc:"Show only the winner and actively matched pipeline handlers.",show_decision_summary_label:"Show decision summary",show_decision_summary_desc:'Render a plain-English "Why this position?" sentence above the strip.'},solar_chart:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds a SAA overlay to the chart.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller chart, tighter spacing."},history:{title:"Title (optional)",hours_label:"History window",hours_desc:"How far back the tracks reach, counting from now.",track_position_label:"Position track",track_position_desc:"Recorded cover position over the window.",track_who_won_label:"Who-won track",track_who_won_desc:"Banded strip of the winning pipeline handler over time.",track_context_label:"Context tracks",track_context_desc:"Sun-in-SAA, glare and manual-override spans.",track_actions_label:"Cover actions list",track_actions_desc:"Recorded cover actions and skipped actions, newest first.",advanced_open_label:"Start with Advanced open",advanced_open_desc:"Expand the event-buffer section on load.",hide_advanced_label:"Hide Advanced section",hide_advanced_desc:"Never show the diagnostic event buffer on this card."}}},fr:{handler:{force:"Dérogation forcée",weather:"Sécurité météo",group_scene:"Scène de groupe",manual:"Dérogation manuelle",group_lock:"Verrouillage de groupe",custom_position:"Position personnalisée",motion:"Délai d'occupation",cloud:"Désactivation par temps nuageux",climate:"Climatique",glare_zone:"Zone d'éblouissement",solar:"Suivi solaire",default:"Par défaut",floor_clamp:"Plancher"},badge:{auto:"Auto",manual:"Manuel",force:"Forcé",weather:"Sécurité météo",glare_zone:"Éblouissement",climate:"Climatique",cloud:"Nuageux",custom_position:"Personnalisé",solar:"Suivi solaire",motion:"Occupation inactive",off:"Off",off_schedule:"Hors planning",floor_suffix:" ↥",safety:"Sécurité",group:"Groupe",tip:{auto:"Le contrôle automatique est actif et aucun gestionnaire ne le remplace — le volet suit le résultat du pipeline.",manual:"Une dérogation manuelle est active — le volet reste où vous l'avez placé et le contrôle automatique est en pause.",manual_until:"Une dérogation manuelle est active jusqu'à {time} — le volet reste où vous l'avez placé jusque-là.",force:"Une position forcée remplace tous les autres gestionnaires.",weather:"La sécurité météo pilote la position.",glare_zone:"Le soleil se trouve dans une zone d'éblouissement configurée, et le gestionnaire d'éblouissement pilote la position.",climate:"Le contrôle climatique pilote la position.",cloud:"La couverture nuageuse désactive le suivi solaire.",custom_position:"Un emplacement de position personnalisée pilote ce volet.",custom_position_slot:"Emplacement : {name}.",custom_position_value:"Sa position est de {pct} %.",custom_position_floor:"Il agit comme un plancher : il relève la position au-dessus du calcul brut au lieu de le remplacer.",solar:"Suivi solaire — la position suit la course du soleil devant la fenêtre.",motion:"La pièce est considérée comme inoccupée, le gestionnaire d'occupation maintient donc la position.",off:"L'intégration est désactivée pour ce volet — rien n'est piloté.",off_schedule:"En dehors de la plage horaire configurée, le contrôle automatique est donc en pause.",group:"Le groupe de volets décide actuellement de cette position.",safety:"Une position de sécurité remplace tous les autres gestionnaires."}},group:{title:"Groupe de couvertures",scene:"Scène",scene_auto:"Auto",scene_all_open:"Tout ouvrir",scene_all_closed:"Tout fermer",scene_privacy:"Intimité",state_open:"Ouvert",state_closed:"Fermé",state_mixed:"Mixte",state_unknown:"Inconnu",lock:"Verrouiller le groupe",unlock:"Déverrouiller le groupe",automation:"Automatisation",automation_count:"{count} membre(s) sur {total} automatisé(s)",clear_overrides:"Effacer les dérogations",clear_overrides_none:"Aucune dérogation de membre à effacer",who_won:"{count} membre(s) sur {total} sont pilotés par le groupe — une scène de groupe ou le verrouillage du groupe détermine actuellement leur position",members:"Membres",member_placeholder:"Aucun membre signalé par l'intégration.",position:"Position",open:"Ouvrir le groupe",close:"Fermer le groupe",stop:"Arrêter le groupe",position_slider_label:"Position du groupe",range:"{min}–{max} %",exception_held:"{count} maintenu(s)",exception_unavailable:"{count} indisponible(s)",drag_to_set_all:"Glisser pour régler les {count} stores",spread_value:"de {min} % à {max} % sur {count} stores"},forecast:{event:{sunrise:"Lever du soleil",sunset:"Coucher du soleil",fov_enter:"Le soleil entre dans l'angle d'acceptation solaire de la fenêtre",fov_exit:"Le soleil quitte l'angle d'acceptation solaire de la fenêtre"},hover_hint:"Survolez la courbe pour voir l'heure et la position prévue ; survolez une ligne colorée pour voir l'événement qu'elle indique.",solar_only_note:"Géométrie solaire uniquement — ne tient pas compte des dérogations manuelles, des positions personnalisées, de la désactivation par temps nuageux ni des conditions météo.",legend_forecast:"Prévision",legend_actual:"Réel"},dialog:{battery:"Batterie {level}%",battery_named:"{name} : {level}%",battery_unknown:"Niveau de batterie inconnu",extend:{title:"Prolonger la dérogation manuelle",presets_label:"Jusqu'à",relative_label:"Ajouter du temps",absolute_label:"Fin à",preview:"Dérogation jusqu'à {time}",confirm:"Prolonger",cancel:"Annuler",tomorrow_suffix:" (demain)"},configure_integration:"Configurer l'intégration",open_device_page:"Ouvrir la page de l'appareil",close:"Fermer",target:"Cible",resume_auto:"Reprendre l'automatique",hide_advanced:"▼ Masquer les options avancées",show_advanced:"▶ Afficher les options avancées",custom_positions:"Positions personnalisées",floor_tooltip:"Plancher — cette valeur force une position minimale au-dessus du calcul automatique",floor:"↥",disable_slot:"Désactiver le créneau {slot}",enable_slot:"Activer le créneau {slot}",on:"Activé",off:"Désactivé",controls:"Commandes",automatic:"Automatique",climate:"Climatique",motion:"Occupation",toggle_hint:"{label} {state} — appuyez pour basculer",state_on:"activé",state_off:"désactivé",todays_forecast:"Prévisions du jour"},overrides:{title:"Dérogations",manual:"Manuel",force:"Forcé",motion:"Occupation",active:"Actif",off:"Désactivé",ends_in:"se termine dans {time}",active_count:"{count} dérogation(s) active(s)",timeout:"expire dans {time}",reset_manual:"Réinitialiser le mode manuel"},climate:{title:"Climatique",active:"Actif : {strategy}",indoor:"Intérieur",outdoor:"Extérieur",presence:"Présence",sunny:"Ensoleillé",lux:"Lux",irradiance:"Irradiance",mode_off:"Mode climatique désactivé",standby:"En veille",threshold_low:"bas",threshold_high:"haut",threshold_summer_outside:"été",reason:{outside_time_window:"En dehors de la plage horaire de fonctionnement",thresholds_not_met:"Températures dans la plage de confort — aucune action requise",other_mode_active:"Un autre mode de contrôle est actuellement actif",readings_unavailable:"Relevés de température indisponibles",mode_off:"Le mode climatique est désactivé"}},compass:{placeholder_no_entries:"Aucune instance Adaptive Cover Pro sélectionnée.",placeholder_no_sun:"Le capteur solaire n'est pas encore renseigné.",sun_tooltip:"Soleil : {az} az / {el} él",sunrise_tooltip:"Lever du soleil : {time}",sunset_tooltip:"Coucher du soleil : {time}",moon_tooltip:"Lune : {phase} ({pct}%)",sun_path_tooltip:"Trajectoire solaire (aujourd'hui)",in_fov_check:"✓ dans le SAA",in_fov:"dans le SAA",in_fov_tooltip:"Le soleil est actuellement dans l'angle d'acceptation solaire de cette fenêtre",none:"—",sun:"Soleil",moon:"Lune",sun_up_not_hitting:"Soleil (levé, ne frappe pas)",sun_below_horizon:"Soleil (sous l’horizon)",window_fov:"SAA de la fenêtre",sun_path:"Trajectoire solaire",sunrise:"Lever du soleil",sunset:"Coucher du soleil",cover_target:"Cible du store",cover_held:"Position du store (maintenue)",window_normal:"Azimut de la fenêtre",stat_sun:"Soleil : ",stat_azi:"Azi : ",stat_elev:"Élév : ",stat_window:"Fenêtre : ",active_sun_arc:"Arc solaire actif {from} – {to}{elev}",fov_arc:"SAA {left} gauche / {right} droite{elev}",window_normal_tooltip:"Azimut de la fenêtre : {bearing}",cover_position_target:"Cible : {pct}%",cover_position_target_awning:"Cible (déployé) : {pct}%",cover_position_actual:"Réel : {pct}%",blind_spot:"Soleil masqué : {from} - {to}",elev_suffix:" · élév {min}–{max}"},covers:{placeholder:"Aucun store signalé par l'intégration.",title:"Stores",target:"Cible : {pct}",target_solar:"Cible solaire : {pct}",click_to_set:"Cliquer pour définir la position",position_slider_label:"Curseur de position du store",position_open_value:"{pct} ouvert",opening:"Ouverture…",closing:"Fermeture…",target_tooltip:"Cible {pct}%",target_tooltip_override:"Cible solaire théorique {pct}% — le store est maintenu par la commande manuelle",target_tooltip_motor:"Moteur : {pct}% (avant étalonnage)",position_title:"Position",tilt_title:"Inclinaison",tilt_target:"Inclinaison : {pct}",tilt_click_to_set:"Cliquer pour définir l'inclinaison",tilt_target_tooltip:"Cible inclinaison {pct}%",goto_target:"Aller à la cible ({pct}%) — le contrôle automatique est conservé"},decision:{placeholder:"La trace de décision n'est pas encore renseignée.",pipeline:"Pipeline",winner:"Actif : {name}",summary_tooltip:"Pourquoi cette position ?",not_evaluated:"non évalué",floor_suffix:" plancher",outside_schedule:"Hors planning — contrôle automatique en pause",outside_schedule_tooltip:"La fenêtre de planning configurée n'est pas active, le positionnement automatique est donc en pause.",solar_would_be:"solaire {pct}",next_change_in:"Prochain ajustement autorisé dans {time}"},solar:{title:"Calcul solaire",axis_position:"Axe de position",axis_tilt:"Axe d'inclinaison",group_inputs:"Entrées",group_intermediates:"Intermédiaires",group_output:"Sortie",show_all:"Afficher les {count} valeurs",show_less:"Afficher moins",no_target:"Pas de cible solaire — {status}",status:{direct_sun:"Soleil direct",fov_exit:"Par défaut · sortie du SAA",elevation_limit:"Par défaut · limite d'élévation",sunset_offset:"Par défaut · décalage coucher du soleil",blind_spot:"Par défaut · angle mort",default:"Par défaut"},field:{sol_elev_deg:"Élévation du soleil",gamma_deg:"Azimut relatif (γ)",position_pct:"Position",effective_distance_m:"Distance effective",adjusted_height_m:"Hauteur ajustée",safety_margin:"Marge de sécurité",awn_angle_deg:"Angle du store",vertical_position_m:"Position verticale",length_m:"Longueur d'extension",slat_angle_raw_deg:"Angle des lamelles",tilt_mode:"Mode d'inclinaison",max_degrees:"Angle maximal"}},header:{on:"ON",off:"OFF",integration_enabled:"Intégration activée",auto:"Auto",automatic_control:"Contrôle automatique"},tile:{motion_pending:"Délai d'occupation en cours",motion_detected:"Occupation détectée",battery_low:"Batterie faible — {level}%",battery_unknown:"Niveau de batterie inconnu",icon_action_label:"Action de l'icône du store",open:"Ouvrir",stop:"Arrêter",close:"Fermer",resume_aria:"Reprendre le contrôle automatique",extend_aria:"Prolonger la dérogation manuelle",registry_failed:"Échec de la récupération du registre : {error}",loading:"Chargement…",entry_not_found:"Instance Adaptive Cover Pro {entry} introuvable.",unavailable:"Indisponible",rails_layered:"{count} toiles d’un même store",rails_separate:"{count} stores",rails_layered_hint:"Toiles d’un même store"},formatters:{expired:"expiré"},elevation:{title:"Soleil aujourd'hui",fov_window:"SAA : {from} → {to}",fov_windows:"SAA : {windows}",fov_window_named:"{name} : {windows}",no_fov_today:"Le soleil n'entre pas dans le SAA aujourd'hui",placeholder:"Graphique d'élévation solaire indisponible.",schedule:"Programmation {from} – {to}",schedule_from:"Programmation à partir de {from}",schedule_until:"Programmation jusqu'à {to}",schedule_start_tooltip:"Début de programmation",schedule_end_tooltip:"Fin de programmation"},control_status:{active:"Actif",outside_time_window:"Hors plage horaire",position_delta_too_small:"Changement de position trop faible",time_delta_too_small:"Trop tôt depuis le dernier mouvement",manual_override:"Dérogation manuelle",automatic_control_off:"Contrôle automatique désactivé",sun_not_visible:"Soleil non visible",force_override_active:"Dérogation forcée",weather_override_active:"Sécurité météo",motion_timeout:"Délai d'occupation"},history:{title:"Historique",open:"Historique",close:"Fermer",refresh:"Actualiser",loading:"Chargement de l'historique…",no_data:"Aucune donnée enregistrée",window_label:"Fenêtre d'historique",window_hours:"{hours} h",show_more:"Afficher plus",expand:"Afficher en plein écran",collapse:"Retour à l'historique",today:"Aujourd'hui",yesterday:"Hier",section_tracks:"Chronologie",track_position:"Position",track_who_won:"Gagnant",track_control_status:"État du contrôle",track_enabled:"Intégration",track_auto:"Contrôle automatique",track_sun:"Soleil dans SAA",track_glare:"Éblouissement",track_manual:"Dérogation manuelle",track_mismatch:"Écart de position",legend_target:"Cible",legend_actual:"Réel",legend_per_cover:"Par store",legend_saa:"Soleil dans SAA",legend_night:"Nuit",stat_moves:"mouvements",stat_travel:"pts parcourus",stat_override:"en dérogation manuelle",copy_diagnostics:"Copier les diagnostics",copied:"Copié",no_recorder_data:"Non enregistré — vérifiez la configuration du recorder",activity_title:"Activité",activity_empty:"Aucune activité enregistrée sur cette période.",advanced:"Avancé — tampon d'événements",events_search:"Filtrer les événements…",events_count:"{shown} événements sur {total}",events_empty:"Aucun événement ne correspond au filtre.",events_unavailable:"Tampon d'événements indisponible — l'intégration n'a pas renvoyé de diagnostics.",buffer_size:"Taille du tampon : {size}",data_window:"Fenêtre du tampon : {from} → {to}"},root:{loading_registry:"Chargement du registre Adaptive Cover Pro…",no_entities_title:"Aucune entité Adaptive Cover Pro trouvée",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Aucune entité Adaptive Cover Pro correspondante",compass_configured:"Instances configurées : {entries}",compass_not_found:"Instances introuvables : {entries}"},editor:{common:{entry_id:"Instance Adaptive Cover Pro",support_alt:"Offrez-moi un café",title_optional:"Titre (facultatif)",title_placeholder:"ex. Fenêtres côté ouest",north_offset:"Décalage nord de la boussole (°)",north_offset_hint:"Faites pivoter la boussole dans le sens horaire pour que « haut » corresponde à votre carte. Par défaut : 0.",loading_entries:"Chargement des entrées de configuration Adaptive Cover Pro…",load_failed:"Échec du chargement des entrées de configuration : {error}",no_entries:"Aucune entrée de configuration Adaptive Cover Pro trouvée. Ajoutez une instance sous",no_entries_path:"Paramètres → Appareils et services",no_entries_then:", puis revenez ici.",entry_id_manual_placeholder:"Saisir manuellement l'ID d'entrée de configuration",entry_id_fallback_label:"ID d'entrée",unknown_entry:"(inconnu : {entry})",reset:"Réinitialiser"},main:{sections:"Sections",sections_hint:"Activer ou désactiver les parties de la carte affichées.",section_sky_label:"Boussole céleste",section_sky_desc:"Soleil par rapport au SAA de la fenêtre, tracé polaire",section_elevation_label:"Soleil aujourd'hui",section_elevation_desc:"Graphique élévation/temps avec bande SAA et curseur temps réel",section_decision_label:"Bande de décision",section_decision_desc:"Les 10 gestionnaires du pipeline avec la ligne gagnante mise en évidence",section_covers_label:"Positions des stores",section_covers_desc:"Barres position réelle/cible par store ; cliquer pour définir la position",section_overrides_label:"Panneau des dérogations",section_overrides_desc:"Tuiles Manuel, Forcé, Occupation + bouton de réinitialisation",section_climate_label:"Panneau climatique",section_climate_desc:"Stratégie été/hiver/intermédiaire ; affiche le mode veille si le mode climatique est désactivé ou inactif",section_solar_label:"Calcul solaire",section_solar_desc:"Décomposition de la géométrie solaire brute (entrées → intermédiaires → sortie) ; nécessite le capteur solar_calculation de l’intégration",controls:"Commandes",controls_hint:"Afficher en lecture seule (visible mais non cliquable).",integration_pill_label:"Bouton ON/OFF de l'intégration",integration_pill_desc:"Permettre de basculer l'intégration depuis l'en-tête de la carte.",automatic_pill_label:"Bouton contrôle automatique",automatic_pill_desc:"Permettre de basculer le contrôle automatique depuis l'en-tête de la carte.",reset_button_label:"Bouton de réinitialisation de la dérogation manuelle",reset_button_desc:"Permettre d'appuyer sur la tuile de réinitialisation dans le panneau des dérogations.",display:"Affichage",compact_label:"Mode compact",compact_desc:"Espacement réduit entre les sections.",show_compass_stats_label:"Afficher les statistiques de la boussole",show_compass_stats_desc:"Azi, Élév, ∠ et angle de fenêtre sous la boussole céleste.",show_compass_legend_label:"Afficher la légende de la boussole",show_compass_legend_desc:"Clé de couleur sous la boussole céleste.",show_moon_label:"Afficher la lune sur la boussole",show_moon_desc:"Position et phase de la lune en superposition sur la boussole céleste.",hide_inactive_label:"Masquer les gestionnaires inactifs",hide_inactive_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs.",state_color_label:"Colorer l'icône selon l'état",state_color_desc:"L'icône d'en-tête prend la couleur ouvert/fermé/actif du thème."},tile:{name:"Titre personnalisé",icon:"Icône personnalisée",cover:"Entité de store",layout:"Disposition",show_position:"Afficher la position %",show_state:"Afficher l'état (Ouvert/Fermé)",show_decision_summary:"Afficher le résumé de décision",show_controls:"Afficher les commandes ↑ ■ ↓",covers:"Barres de position (ordre)",covers_hint:"Faites glisser une ligne, ou utilisez les flèches, pour définir l'ordre des barres de position. L'œil masque une barre sans dissocier le volet.",member_names:"Noms des membres",member_names_hint:"Renommer un membre du groupe tel qu'il apparaît sur cette carte. Laisser vide pour utiliser le nom de l'instance.",covers_move_up:"Monter",covers_move_down:"Descendre",covers_hide:"Masquer cette barre",covers_show:"Afficher cette barre",controls_cover:"Volet piloté par ↑ ■ ↓",controls_axis:"Axe piloté par ↑ ■ ↓",show_badge:"Afficher le badge contextuel",show_position_bar:"Afficher la barre de position",show_tilt:"Afficher la barre d'inclinaison",content_section:"Contenu",controls_section:"Commandes",dialog_section:"Sections de la boîte de dialogue",group_row_section:"Commandes de groupe",show_scene_select:"Afficher le sélecteur de scène",show_lock:"Afficher le verrouillage du groupe",show_automation:"Afficher l'interrupteur d'automatisation des membres",show_clear_overrides:"Afficher le bouton d’effacement des dérogations",show_member_badges:"Afficher les badges de dérogation des membres",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Suivi solaire",badge_force:"Dérogation forcée",badge_weather:"Sécurité météo",badge_manual:"Dérogation manuelle",badge_custom_position:"Position personnalisée",badge_motion:"Occupation",badge_climate:"Climatique",badge_glare_zone:"Zone d'éblouissement",badge_cloud:"Suppression nuageuse",show_compass:"Afficher la boussole solaire dans le dialogue",show_elevation_chart:"Afficher le graphique du soleil dans le dialogue",show_solar_calc:"Afficher le calcul solaire dans le dialogue",show_motion_icon:"Afficher l'indicateur d'occupation",state_color:"Colorer l'icône selon l'état",interactions_section:"Interactions",tap_action:"Action au toucher",icon_tap_action:"Action au toucher de l'icône",hold_action:"Action au maintien",double_tap_action:"Action au double toucher",cover_blank_hint:"Laisser vide pour utiliser automatiquement le premier store géré.",name_composed_hint:"Un titre composé est défini en YAML. Saisissez un nouveau titre ici pour le remplacer par du texte simple.",layout_option_one_line:"Une ligne (compact)",layout_option_detailed:"Détaillé (titre, état, indicateurs)"},compass:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition à la boussole.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"SVG plus petit, légende masquée.",toggle_legend_label:"Légende",toggle_legend_desc:"Échantillons de couleur et étiquettes d'instance sous la boussole.",toggle_stats_label:"Statistiques",toggle_stats_desc:"Soleil + lignes numériques par fenêtre.",toggle_moon_label:"Lune",toggle_moon_desc:"Afficher la position et la phase de la lune.",toggle_cardinals_label:"Points cardinaux",toggle_cardinals_desc:"Lettres N/E/S/O autour de la boussole.",toggle_blind_spot_label:"Zones de soleil masqué",toggle_blind_spot_desc:"Secteurs hachurés pour la plage où le soleil est masqué de chaque fenêtre.",toggle_sun_path_label:"Trajectoire solaire",toggle_sun_path_desc:"Arc solaire du jour dans le ciel.",toggle_sunrise_sunset_label:"Repères lever / coucher du soleil",toggle_sunrise_sunset_desc:"Petits points aux azimuts de lever et coucher du soleil.",toggle_cover_fill_label:"Remplissage de fermeture du store",toggle_cover_fill_desc:"Secteur intérieur indiquant le taux de fermeture de chaque store.",toggle_window_arrow_label:"Flèche de normale de fenêtre",toggle_window_arrow_desc:"Ligne du centre vers l'azimut de chaque fenêtre.",toggle_elevation_chart_label:"Graphique du soleil",toggle_elevation_chart_desc:"Graphique élévation/temps sous la boussole, avec bande SAA et limites d'élévation."},decision:{title:"Titre (facultatif)",compact_label:"Mode compact",compact_desc:"Lignes plus serrées ; masque aussi les gestionnaires inactifs.",hide_inactive_handlers_label:"Masquer les gestionnaires inactifs",hide_inactive_handlers_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs.",show_decision_summary_label:"Afficher le résumé de décision",show_decision_summary_desc:"Afficher une phrase explicite « Pourquoi cette position ? » au-dessus de la bande."},solar_chart:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition SAA au graphique.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"Graphique plus petit, espacement plus serré."},history:{title:"Titre (facultatif)",hours_label:"Fenêtre d'historique",hours_desc:"Profondeur de l'historique affiché, à partir de maintenant.",track_position_label:"Piste Position",track_position_desc:"Position enregistrée du store sur la période.",track_who_won_label:"Piste Gagnant",track_who_won_desc:"Bandes du gestionnaire de pipeline gagnant au fil du temps.",track_context_label:"Pistes de contexte",track_context_desc:"Périodes soleil-dans-SAA, éblouissement et dérogation manuelle.",track_actions_label:"Liste des actions",track_actions_desc:"Actions de store enregistrées et ignorées, les plus récentes en premier.",advanced_open_label:"Ouvrir Avancé au démarrage",advanced_open_desc:"Déplier la section du tampon d'événements au chargement.",hide_advanced_label:"Masquer la section Avancé",hide_advanced_desc:"Ne jamais afficher le tampon d'événements de diagnostic sur cette carte."}}},de:{handler:{force:"Zwangsübersteuerung",weather:"Wettersicherheit",group_scene:"Gruppenszene",manual:"Manuelle Übersteuerung",group_lock:"Gruppensperre",custom_position:"Benutzerdefinierte Position",motion:"Anwesenheits-Timeout",cloud:"Wolkenunterdrückung",climate:"Klima",glare_zone:"Blendungszone",solar:"Sonnenverfolgung",default:"Standard",floor_clamp:"Mindestposition"},badge:{auto:"Auto",manual:"Manuell",force:"Zwang",weather:"Wettersicherheit",glare_zone:"Blendung",climate:"Klima",cloud:"Bewölkt",custom_position:"Benutzerdefiniert",solar:"Sonnenverfolgung",motion:"Anwesenheit inaktiv",off:"Aus",off_schedule:"Außerhalb des Zeitplans",floor_suffix:" ↥",safety:"Sicherheit",group:"Gruppe",tip:{auto:"Die Automatiksteuerung ist aktiv und kein Handler übersteuert — die Abdeckung folgt dem Ergebnis der Pipeline.",manual:"Eine manuelle Übersteuerung ist aktiv — die Abdeckung bleibt dort, wo Sie sie eingestellt haben, und die Automatik pausiert.",manual_until:"Eine manuelle Übersteuerung ist bis {time} aktiv — bis dahin bleibt die Abdeckung dort, wo Sie sie eingestellt haben.",force:"Eine erzwungene Position übersteuert alle anderen Handler.",weather:"Die Wettersicherheit steuert die Position.",glare_zone:"Die Sonne steht in einer konfigurierten Blendungszone, und der Blendungs-Handler steuert die Position.",climate:"Die Klimasteuerung steuert die Position.",cloud:"Bewölkung unterdrückt die Sonnenverfolgung.",custom_position:"Ein benutzerdefinierter Positions-Slot steuert diese Abdeckung.",custom_position_slot:"Slot: {name}.",custom_position_value:"Seine Position beträgt {pct} %.",custom_position_floor:"Er wirkt als Mindestposition: Er hebt die Position über den Rohwert der Berechnung an, statt ihn zu ersetzen.",solar:"Sonnenverfolgung — die Position folgt der Sonne über das Fenster.",motion:"Der Raum gilt als nicht belegt, daher hält der Anwesenheits-Handler die Position.",off:"Die Integration ist für diese Abdeckung deaktiviert — es wird nichts gesteuert.",off_schedule:"Außerhalb des konfigurierten Zeitfensters, daher pausiert die Automatiksteuerung.",group:"Die Abdeckungsgruppe bestimmt derzeit diese Position.",safety:"Eine Sicherheitsposition übersteuert alle anderen Handler."}},group:{title:"Abdeckungsgruppe",scene:"Szene",scene_auto:"Auto",scene_all_open:"Alle öffnen",scene_all_closed:"Alle schließen",scene_privacy:"Sichtschutz",state_open:"Offen",state_closed:"Geschlossen",state_mixed:"Gemischt",state_unknown:"Unbekannt",lock:"Gruppe sperren",unlock:"Gruppe entsperren",automation:"Automatisierung",automation_count:"{count} von {total} Mitgliedern automatisiert",clear_overrides:"Übersteuerungen löschen",clear_overrides_none:"Keine Mitglieder-Übersteuerungen zum Löschen",who_won:"{count} von {total} Mitgliedern sind gruppengesteuert — eine Gruppenszene oder die Gruppensperre bestimmt derzeit ihre Position",members:"Mitglieder",member_placeholder:"Keine Mitglieder von der Integration gemeldet.",position:"Position",open:"Gruppe öffnen",close:"Gruppe schließen",stop:"Gruppe stoppen",position_slider_label:"Gruppenposition",range:"{min}–{max} %",exception_held:"{count} gehalten",exception_unavailable:"{count} nicht verfügbar",drag_to_set_all:"Ziehen, um alle {count} Behänge zu setzen",spread_value:"{min} % bis {max} % über {count} Behänge"},forecast:{event:{sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",fov_enter:"Sonne tritt in den Sonnenakzeptanzwinkel des Fensters ein",fov_exit:"Sonne verlässt den Sonnenakzeptanzwinkel des Fensters"},hover_hint:"Kurve überfahren für Uhrzeit und prognostizierte Position; farbige Linie überfahren für das markierte Ereignis.",solar_only_note:"Nur Sonnengeometrie — berücksichtigt keine manuellen Übersteuerungen, benutzerdefinierten Positionen, Wolkenunterdrückung oder Wetter.",legend_forecast:"Prognose",legend_actual:"Ist"},dialog:{battery:"Batterie {level}%",battery_named:"{name}: {level}%",battery_unknown:"Batteriestand unbekannt",extend:{title:"Manuelle Übersteuerung verlängern",presets_label:"Bis",relative_label:"Zeit hinzufügen",absolute_label:"Ende um",preview:"Übersteuerung bis {time}",confirm:"Verlängern",cancel:"Abbrechen",tomorrow_suffix:" (morgen)"},configure_integration:"Integration konfigurieren",open_device_page:"Geräteseite öffnen",close:"Schließen",target:"Ziel",resume_auto:"Automatik fortsetzen",hide_advanced:"▼ Erweitert ausblenden",show_advanced:"▶ Erweitert",custom_positions:"Benutzerdefinierte Positionen",floor_tooltip:"Mindestposition — hebt die Position über den berechneten Wert",floor:"↥",disable_slot:"Slot {slot} deaktivieren",enable_slot:"Slot {slot} aktivieren",on:"An",off:"Aus",controls:"Steuerung",automatic:"Automatisch",climate:"Klima",motion:"Anwesenheit",toggle_hint:"{label} {state} — tippen zum Umschalten",state_on:"an",state_off:"aus",todays_forecast:"Heutige Prognose"},overrides:{title:"Übersteuerungen",manual:"Manuell",force:"Zwang",motion:"Anwesenheit",active:"Aktiv",off:"Aus",ends_in:"endet in {time}",active_count:"{count} aktiv",timeout:"läuft in {time} ab",reset_manual:"Manuell zurücksetzen"},climate:{title:"Klima",active:"Aktiv: {strategy}",indoor:"Innen",outdoor:"Außen",presence:"Anwesenheit",sunny:"Sonnig",lux:"Lux",irradiance:"Einstrahlung",mode_off:"Klimamodus deaktiviert",standby:"Bereitschaft",threshold_low:"niedrig",threshold_high:"hoch",threshold_summer_outside:"Sommer",reason:{outside_time_window:"Außerhalb des Betriebszeitfensters",thresholds_not_met:"Temperaturen im Komfortbereich — keine Maßnahme erforderlich",other_mode_active:"Ein anderer Steuermodus ist derzeit aktiv",readings_unavailable:"Temperaturwerte nicht verfügbar",mode_off:"Klimamodus ist deaktiviert"}},compass:{placeholder_no_entries:"Kein Adaptive Cover Pro-Eintrag ausgewählt.",placeholder_no_sun:"Sonnensensor noch nicht befüllt.",sun_tooltip:"Sonne: {az} az / {el} el",sunrise_tooltip:"Sonnenaufgang: {time}",sunset_tooltip:"Sonnenuntergang: {time}",moon_tooltip:"Mond: {phase} ({pct}%)",sun_path_tooltip:"Sonnenbahn (heute)",in_fov_check:"✓ im SAA",in_fov:"im SAA",in_fov_tooltip:"Sonne befindet sich derzeit im Sonnenakzeptanzwinkel dieses Fensters",none:"—",sun:"Sonne",moon:"Mond",sun_up_not_hitting:"Sonne (aufgegangen, trifft nicht)",sun_below_horizon:"Sonne (unter dem Horizont)",window_fov:"Fenster-SAA",sun_path:"Sonnenbahn",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",cover_target:"Beschattungsziel",cover_held:"Beschattungsposition (gehalten)",window_normal:"Fensterazimut",stat_sun:"Sonne: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Fenster: ",active_sun_arc:"Aktiver Sonnenbogen {from} – {to}{elev}",fov_arc:"SAA {left} links / {right} rechts{elev}",window_normal_tooltip:"Fensterazimut: {bearing}",cover_position_target:"Ziel: {pct}%",cover_position_target_awning:"Ziel (ausgefahren): {pct}%",cover_position_actual:"Aktuell: {pct}%",blind_spot:"Blindfleck: {from} – {to}",elev_suffix:" · Elev {min}–{max}"},covers:{placeholder:"Keine Beschattungen von der Integration gemeldet.",title:"Beschattungen",target:"Ziel: {pct}",target_solar:"Sonnenziel: {pct}",click_to_set:"Klicken zum Festlegen der Position",position_slider_label:"Positionsschieberegler",position_open_value:"{pct} offen",opening:"Öffnet…",closing:"Schließt…",target_tooltip:"Ziel {pct}%",target_tooltip_override:"Theoretisches Sonnenziel {pct}% — Beschattung wird durch manuelle Übersteuerung gehalten",target_tooltip_motor:"Motor: {pct}% (vor Kalibrierung)",position_title:"Position",tilt_title:"Neigung",tilt_target:"Neigung: {pct}",tilt_click_to_set:"Klicken zum Festlegen der Neigung",tilt_target_tooltip:"Neigungsziel {pct}%",goto_target:"Auf Ziel fahren ({pct}%) — automatische Steuerung bleibt aktiv"},decision:{placeholder:"Entscheidungsprotokoll noch nicht befüllt.",pipeline:"Pipeline",winner:"Gewinner: {name}",summary_tooltip:"Warum diese Position?",not_evaluated:"nicht ausgewertet",floor_suffix:" Mindestposition",outside_schedule:"Außerhalb des Zeitplans — automatische Steuerung pausiert",outside_schedule_tooltip:"Das konfigurierte Zeitplanfenster ist nicht aktiv, daher ist die automatische Positionierung pausiert.",solar_would_be:"solar {pct}",next_change_in:"Nächste Anpassung erlaubt in {time}"},solar:{title:"Sonnenberechnung",axis_position:"Positionsachse",axis_tilt:"Neigungsachse",group_inputs:"Eingaben",group_intermediates:"Zwischenwerte",group_output:"Ausgabe",show_all:"Alle {count} Werte anzeigen",show_less:"Weniger anzeigen",no_target:"Kein Sonnenziel — {status}",status:{direct_sun:"Direkte Sonne",fov_exit:"Standard · SAA-Austritt",elevation_limit:"Standard · Höhengrenze",sunset_offset:"Standard · Sonnenuntergangs-Versatz",blind_spot:"Standard · Blindfleck",default:"Standard"},field:{sol_elev_deg:"Sonnenhöhe",gamma_deg:"Relativer Azimut (γ)",position_pct:"Position",effective_distance_m:"Effektive Distanz",adjusted_height_m:"Angepasste Höhe",safety_margin:"Sicherheitsabstand",awn_angle_deg:"Markisenwinkel",vertical_position_m:"Vertikale Position",length_m:"Ausfahrlänge",slat_angle_raw_deg:"Lamellenwinkel",tilt_mode:"Neigungsmodus",max_degrees:"Maximaler Winkel"}},header:{on:"ON",off:"OFF",integration_enabled:"Integration aktiviert",auto:"Auto",automatic_control:"Automatische Steuerung"},tile:{motion_pending:"Anwesenheits-Timeout läuft",motion_detected:"Anwesenheit erkannt",battery_low:"Batterie schwach — {level}%",battery_unknown:"Batteriestand unbekannt",icon_action_label:"Aktion des Beschattungssymbols",open:"Öffnen",stop:"Stopp",close:"Schließen",resume_aria:"Automatische Steuerung fortsetzen",extend_aria:"Manuelle Übersteuerung verlängern",registry_failed:"Registry-Abruf fehlgeschlagen: {error}",loading:"Wird geladen…",entry_not_found:"Adaptive Cover Pro-Eintrag {entry} nicht gefunden.",unavailable:"Nicht verfügbar",rails_layered:"{count} Behänge einer Beschattung",rails_separate:"{count} Beschattungen",rails_layered_hint:"Behänge einer Beschattung"},formatters:{expired:"abgelaufen"},elevation:{title:"Sonne heute",fov_window:"SAA: {from} → {to}",fov_windows:"SAA: {windows}",fov_window_named:"{name}: {windows}",no_fov_today:"Sonne tritt heute nicht in den SAA ein",placeholder:"Sonnenhöhen-Diagramm nicht verfügbar.",schedule:"Zeitplan {from} – {to}",schedule_from:"Zeitplan ab {from}",schedule_until:"Zeitplan bis {to}",schedule_start_tooltip:"Zeitplanstart",schedule_end_tooltip:"Zeitplanende"},control_status:{active:"Aktiv",outside_time_window:"Außerhalb des Zeitfensters",position_delta_too_small:"Positionsänderung zu gering",time_delta_too_small:"Zu kurz seit der letzten Bewegung",manual_override:"Manuelle Übersteuerung",automatic_control_off:"Automatische Steuerung aus",sun_not_visible:"Sonne nicht sichtbar",force_override_active:"Zwangsübersteuerung",weather_override_active:"Wettersicherheit",motion_timeout:"Anwesenheits-Timeout"},history:{title:"Verlauf",open:"Verlauf",close:"Schließen",refresh:"Aktualisieren",loading:"Verlauf wird geladen…",no_data:"Keine aufgezeichneten Daten",window_label:"Verlaufszeitraum",window_hours:"{hours} Std.",show_more:"Mehr anzeigen",expand:"Vollansicht öffnen",collapse:"Zurück zum Verlauf",today:"Heute",yesterday:"Gestern",section_tracks:"Zeitverlauf",track_position:"Position",track_who_won:"Gewinner",track_control_status:"Steuerungsstatus",track_enabled:"Integration",track_auto:"Automatische Steuerung",track_sun:"Sonne im SAA",track_glare:"Blendung",track_manual:"Manuelle Übersteuerung",track_mismatch:"Positionsabweichung",legend_target:"Ziel",legend_actual:"Ist",legend_per_cover:"Pro Beschattung",legend_saa:"Sonne im SAA",legend_night:"Nacht",stat_moves:"Bewegungen",stat_travel:"Pkt. zurückgelegt",stat_override:"in manueller Übersteuerung",copy_diagnostics:"Diagnose kopieren",copied:"Kopiert",no_recorder_data:"Nicht aufgezeichnet — Recorder-Einstellungen prüfen",activity_title:"Aktivität",activity_empty:"Keine aufgezeichnete Aktivität in diesem Zeitraum.",advanced:"Erweitert — Ereignispuffer",events_search:"Ereignisse filtern…",events_count:"{shown} von {total} Ereignissen",events_empty:"Keine Ereignisse entsprechen dem Filter.",events_unavailable:"Ereignispuffer nicht verfügbar — die Integration hat keine Diagnose zurückgegeben.",buffer_size:"Puffergröße: {size}",data_window:"Pufferzeitraum: {from} → {to}"},root:{loading_registry:"Adaptive Cover Pro-Registry wird geladen…",no_entities_title:"Keine Adaptive Cover Pro-Entitäten gefunden",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Keine passenden Adaptive Cover Pro-Entitäten",compass_configured:"Konfigurierte Einträge: {entries}",compass_not_found:"Einträge nicht gefunden: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro-Instanz",support_alt:"Kauf mir einen Kaffee",title_optional:"Titel (optional)",title_placeholder:"z. B. Fenster Westseite",north_offset:"Kompass-Nordversatz (°)",north_offset_hint:'Kompass im Uhrzeigersinn drehen, sodass „oben" Ihrer Karte entspricht. Standard: 0.',loading_entries:"Adaptive Cover Pro-Konfigurationseinträge werden geladen…",load_failed:"Konfigurationseinträge konnten nicht geladen werden: {error}",no_entries:"Keine Adaptive Cover Pro-Konfigurationseinträge gefunden. Fügen Sie eine Instanz unter",no_entries_path:"Einstellungen → Geräte & Dienste",no_entries_then:" hinzu und kehren Sie dann zurück.",entry_id_manual_placeholder:"Konfigurations-Eintrags-ID manuell eingeben",entry_id_fallback_label:"Eintrags-ID",unknown_entry:"(unbekannt: {entry})",reset:"Zurücksetzen"},main:{sections:"Abschnitte",sections_hint:"Sichtbare Bereiche der Karte ein- oder ausblenden.",section_sky_label:"Himmelskompass",section_sky_desc:"Sonne vs. Fenster-SAA, Polardiagramm",section_elevation_label:"Sonne heute",section_elevation_desc:"Höhen-Zeit-Diagramm mit SAA-Bereich und aktuellem Zeitcursor",section_decision_label:"Entscheidungsleiste",section_decision_desc:"Alle 10 Pipeline-Handler mit hervorgehobener Gewinnerzeile",section_covers_label:"Beschattungspositionen",section_covers_desc:"Aktuelle und Zielposition je Beschattung; klicken zum Festlegen der Position",section_overrides_label:"Übersteuerungsbereich",section_overrides_desc:"Kacheln für Manuell, Zwang, Anwesenheit + Zurücksetzen-Schaltfläche",section_climate_label:"Klimabereich",section_climate_desc:"Sommer-/Winter-/Übergangsstrategie; zeigt Bereitschaft, wenn Klimamodus deaktiviert oder inaktiv ist",section_solar_label:"Sonnenberechnung",section_solar_desc:"Aufschlüsselung der Sonnengeometrie (Eingaben → Zwischenwerte → Ausgabe); erfordert den solar_calculation-Sensor der Integration",controls:"Steuerung",controls_hint:"Als schreibgeschützt anzeigen (sichtbar, aber nicht klickbar).",integration_pill_label:"Integration EIN/AUS-Schalter",integration_pill_desc:"Integration über den Karten-Header umschalten.",automatic_pill_label:"Automatische Steuerung-Schalter",automatic_pill_desc:"Automatische Steuerung über den Karten-Header umschalten.",reset_button_label:'Schaltfläche „Manuelle Übersteuerung zurücksetzen"',reset_button_desc:"Zurücksetzen-Kachel im Übersteuerungsbereich betätigen lassen.",display:"Anzeige",compact_label:"Kompaktmodus",compact_desc:"Engerer Abstand zwischen Abschnitten.",show_compass_stats_label:"Kompassstatistiken anzeigen",show_compass_stats_desc:"Azi, Elev, ∠ und Fensterwinkel unterhalb des Himmelskompasses.",show_compass_legend_label:"Kompasslegende anzeigen",show_compass_legend_desc:"Farbschlüssel unterhalb des Himmelskompasses.",show_moon_label:"Mond auf Kompass anzeigen",show_moon_desc:"Mondposition und Mondphase als Überlagerung auf dem Himmelskompass.",hide_inactive_label:"Inaktive Handler ausblenden",hide_inactive_desc:"Nur den Gewinner und aktiv übereinstimmende Pipeline-Handler anzeigen.",state_color_label:"Symbol nach Status einfärben",state_color_desc:"Kopfzeilen-Symbol nimmt die Offen/Geschlossen/Aktiv-Farbe des Themes an."},tile:{name:"Titel überschreiben",icon:"Symbol überschreiben",cover:"Beschattungsentität",layout:"Layout",show_position:"Position % anzeigen",show_state:"Status anzeigen (Offen/Geschlossen)",show_decision_summary:"Entscheidungszusammenfassung anzeigen",show_controls:"Steuerung ↑ ■ ↓ anzeigen",covers:"Positionsleisten (Reihenfolge)",covers_hint:"Ziehen Sie eine Zeile oder verwenden Sie die Pfeile, um die Reihenfolge der Positionsleisten festzulegen. Das Auge blendet eine Leiste aus, ohne den Behang zu entfernen.",member_names:"Mitgliedsnamen",member_names_hint:"Benennen Sie ein Gruppenmitglied nur für diese Karte um. Leer lassen, um den Namen des Eintrags zu verwenden.",covers_move_up:"Nach oben",covers_move_down:"Nach unten",covers_hide:"Diese Leiste ausblenden",covers_show:"Diese Leiste anzeigen",controls_cover:"Von ↑ ■ ↓ gesteuerter Behang",controls_axis:"Von ↑ ■ ↓ gesteuerte Achse",show_badge:"Kontextbadge anzeigen",show_position_bar:"Positionsleiste anzeigen",show_tilt:"Neigungsleiste anzeigen",content_section:"Inhalt",controls_section:"Bedienelemente",dialog_section:"Dialogbereiche",group_row_section:"Gruppensteuerung",show_scene_select:"Szenenauswahl anzeigen",show_lock:"Gruppensperre anzeigen",show_automation:"Umschalter für Mitglieder-Automatisierung anzeigen",show_clear_overrides:"Schaltfläche „Übersteuerungen löschen“ anzeigen",show_member_badges:"Mitglieder-Übersteuerungs-Badges anzeigen",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Sonnenverfolgung",badge_force:"Zwangsübersteuerung",badge_weather:"Wettersicherheit",badge_manual:"Manuelle Übersteuerung",badge_custom_position:"Benutzerdefinierte Position",badge_motion:"Anwesenheit",badge_climate:"Klima",badge_glare_zone:"Blendungszone",badge_cloud:"Wolkenunterdrückung",show_compass:"Sonnenkompass im Dialog anzeigen",show_elevation_chart:"Sonne-heute-Diagramm im Dialog anzeigen",show_solar_calc:"Sonnenberechnung im Dialog anzeigen",show_motion_icon:"Anwesenheitsanzeige einblenden",state_color:"Symbol nach Status einfärben",interactions_section:"Interaktionen",tap_action:"Tipp-Aktion",icon_tap_action:"Tipp-Aktion für Symbol",hold_action:"Gedrückthalten-Aktion",double_tap_action:"Doppeltippen-Aktion",cover_blank_hint:"Leer lassen, um automatisch die erste verwaltete Beschattung zu verwenden.",name_composed_hint:"In YAML ist ein zusammengesetzter Titel festgelegt. Hier einen neuen Titel eingeben, um ihn durch einfachen Text zu ersetzen.",layout_option_one_line:"Eine Zeile (kompakt)",layout_option_detailed:"Detailliert (Titel, Status, Indikatoren)"},compass:{instances:"Adaptive Cover Pro-Instanzen",instances_hint:"Eine oder mehrere auswählen. Jeder gewählte Eintrag fügt dem Kompass eine Überlagerung hinzu.",cover_colors:"Beschattungsfarben",cover_colors_hint:"Standardpalettenfarbe für jede Überlagerung überschreiben.",default_color:"Standard",display:"Anzeige",toggle_compact_label:"Kompaktmodus",toggle_compact_desc:"Kleineres SVG, Legende ausgeblendet.",toggle_legend_label:"Legende",toggle_legend_desc:"Farbmuster und Eintragsbezeichnungen unterhalb des Kompasses.",toggle_stats_label:"Statistiken",toggle_stats_desc:"Sonne + numerische Zeilen je Fenster.",toggle_moon_label:"Mond",toggle_moon_desc:"Mondposition und Mondphase anzeigen.",toggle_cardinals_label:"Himmelsrichtungen",toggle_cardinals_desc:"N/O/S/W-Buchstaben rund um den Kompass.",toggle_blind_spot_label:"Blindflecke",toggle_blind_spot_desc:"Schraffierte Sektoren für den Blindfleckbereich jedes Fensters.",toggle_sun_path_label:"Sonnenbahn",toggle_sun_path_desc:"Heutiger Sonnenbogen am Himmel.",toggle_sunrise_sunset_label:"Sonnenaufgangs-/Untergangsmarkierungen",toggle_sunrise_sunset_desc:"Kleine Punkte bei Aufgangs- und Untergangsazimut.",toggle_cover_fill_label:"Schlussfüllbereich der Beschattung",toggle_cover_fill_desc:"Innerer Sektor, der zeigt, wie weit jede Beschattung geschlossen ist.",toggle_window_arrow_label:"Fenster-Normalenpfeil",toggle_window_arrow_desc:"Linie vom Mittelpunkt zum Azimut jedes Fensters.",toggle_elevation_chart_label:"Sonne-heute-Diagramm",toggle_elevation_chart_desc:"Höhen-Zeit-Diagramm unterhalb des Kompasses, mit SAA-Bereich und Höhengrenzen."},decision:{title:"Titel (optional)",compact_label:"Kompaktmodus",compact_desc:"Engere Zeilen; blendet inaktive Handler ebenfalls aus.",hide_inactive_handlers_label:"Inaktive Handler ausblenden",hide_inactive_handlers_desc:"Nur den Gewinner und aktiv übereinstimmende Pipeline-Handler anzeigen.",show_decision_summary_label:"Entscheidungszusammenfassung anzeigen",show_decision_summary_desc:'Einen verständlichen Satz „Warum diese Position?" oberhalb der Leiste anzeigen.'},solar_chart:{instances:"Adaptive Cover Pro-Instanzen",instances_hint:"Eine oder mehrere auswählen. Jeder gewählte Eintrag fügt dem Diagramm eine SAA-Überlagerung hinzu.",cover_colors:"Beschattungsfarben",cover_colors_hint:"Standardpalettenfarbe für jede Überlagerung überschreiben.",default_color:"Standard",display:"Anzeige",toggle_compact_label:"Kompaktmodus",toggle_compact_desc:"Kleineres Diagramm, engerer Abstand."},history:{title:"Titel (optional)",hours_label:"Verlaufszeitraum",hours_desc:"Wie weit die Spuren zurückreichen, gerechnet ab jetzt.",track_position_label:"Positionsspur",track_position_desc:"Aufgezeichnete Beschattungsposition im Zeitraum.",track_who_won_label:"Gewinner-Spur",track_who_won_desc:"Bänder des jeweils gewinnenden Pipeline-Handlers im Zeitverlauf.",track_context_label:"Kontextspuren",track_context_desc:"Zeiträume für Sonne-im-SAA, Blendung und manuelle Übersteuerung.",track_actions_label:"Aktionsliste",track_actions_desc:"Aufgezeichnete und übersprungene Beschattungsaktionen, neueste zuerst.",advanced_open_label:"Erweitert beim Start öffnen",advanced_open_desc:"Den Ereignispuffer-Abschnitt beim Laden ausklappen.",hide_advanced_label:"Erweitert-Abschnitt ausblenden",hide_advanced_desc:"Den Diagnose-Ereignispuffer auf dieser Karte nie anzeigen."}}}};function ot(e,t){const o=t.split(".");let i=e;for(const e of o){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function it(e,t){return t?e.replace(/\{(\w+)\}/g,(e,o)=>Object.prototype.hasOwnProperty.call(t,o)?String(t[o]):e):e}function st(e,t,o){const i=function(e){const t=(e?.locale?.language??e?.language??"en").toLowerCase().split("-")[0];return t in tt?t:"en"}(t),s=ot(tt[i],e);if(void 0!==s)return it(s,o);if("en"!==i){const t=ot(tt.en,e);if(void 0!==t)return it(t,o)}return e}function nt(e){return null==e||Number.isNaN(e)?"—":`${Math.round(e)}%`}function rt(e){return!e||"unavailable"===e||"unknown"===e}function at(e){return!e||"unavailable"===e}function lt(e,t,o){if(!e||!t)return null;const i=e.states[t];if(!i||at(i.state))return null;const s=o?{...i,state:o}:i;if("function"==typeof e.formatEntityState){const t=e.formatEntityState(s);if(t)return t}if("function"==typeof e.localize){const t=e.localize(`component.cover.entity_component._.state.${s.state}`);if(t)return t}return s.state.charAt(0).toUpperCase()+s.state.slice(1)}function ct(e){return null==e||Number.isNaN(e)?"—":`${e.toFixed(1)}°`}function dt(e,t){if(!e)return"—";const o=new Date(e);return Number.isNaN(o.getTime())?"—":o.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",timeZone:t})}function ht(e,t){if(!e)return"—";const o=new Date(e).getTime();if(Number.isNaN(o))return"—";const i=Math.round((o-Date.now())/1e3);return i<=0?t?st("formatters.expired",t):"expired":function(e){if(null==e||Number.isNaN(e))return"—";const t=Math.max(0,Math.round(e));if(t<60)return`${t}s`;const o=Math.floor(t/60);return o<60?`${o}m ${t%60}s`:`${Math.floor(o/60)}h ${o%60}m`}(i)}function pt(e,t){if(null!==t&&!Number.isNaN(t)){if(t>=95)return e.open;if(t<=5)return e.closed}return e.partial}function ut(e){const{explicitIcon:t,deviceClass:o,coverType:i,position:s}=e;if("string"==typeof t&&t.length>0)return t;if(o){const e=Fe[o];if(e)return pt(e,s)}return function(e,t){return pt({open:De[e]??"mdi:window-shutter-open",partial:Ne[e]??"mdi:window-shutter",closed:Be[e]??"mdi:window-shutter"},t)}(i,s)}function _t(e){return e&&Re.has(e)?"mdi:arrow-expand-horizontal":"mdi:arrow-up"}function gt(e){return e&&Re.has(e)?"mdi:arrow-collapse-horizontal":"mdi:arrow-down"}const mt="var(--state-cover-active-color, var(--state-cover-color, var(--state-active-color, var(--primary-color))))";function vt(e){if(at(e)||!e)return"var(--state-unavailable-color)";const t=e.toLowerCase(),o="closed"!==t&&"unknown"!==t?"active":"inactive";return`var(--state-cover-${t}-color, var(--state-cover-${o}-color, var(--state-cover-color, var(--state-${o}-color))))`}function ft(e,t){return t.openBlocksSun?e:t.min+t.max-e}const bt=100,yt="%",wt=new Set(["cover_awning","cover_oscillating_awning"]);function xt(e,t){return"position"===t&&wt.has(e.cover_type)}function $t(e){return e.charAt(0).toUpperCase()+e.slice(1)}function kt(e){const t=e.discovery?.axes;if(Array.isArray(t))return t.filter(e=>!!e&&"string"==typeof e.id&&!1!==e.supported).map(t=>({id:t.id,label:t.label??$t(t.id),min:"number"==typeof t.min?t.min:0,max:"number"==typeof t.max?t.max:bt,unit:"string"==typeof t.unit?t.unit:yt,stateAttr:"string"==typeof t.state_attr?t.state_attr:void 0,targetRole:Ue[t.id],inverted:!0===t.inverted,openBlocksSun:"boolean"==typeof t.open_blocks_sun?t.open_blocks_sun:xt(e,t.id)}));const o=[{id:"position",label:$t("position"),min:0,max:bt,unit:yt,stateAttr:"current_position",targetRole:"target_position_sensor",inverted:!1,openBlocksSun:xt(e,"position")}];return e.entities.target_tilt_sensor&&o.push({id:"tilt",label:$t("tilt"),min:0,max:bt,unit:yt,stateAttr:"current_tilt_position",targetRole:"target_tilt_sensor",inverted:!1,openBlocksSun:!1}),o}function At(e){return kt(e).find(e=>"position"===e.id)??{id:"position",label:"Position",min:0,max:bt,unit:yt,stateAttr:"current_position",targetRole:"target_position_sensor",inverted:!1,openBlocksSun:xt(e,"position")}}function St(e){return kt(e).find(e=>"position"===e.id)?.inverted??!1}const Ct=[12,16];function Et(e,t,o=0){const i=(e-90+o)*Math.PI/180;return{x:t*Math.cos(i),y:t*Math.sin(i)}}function zt(e){return 1-Math.max(0,Math.min(90,e))/90}function Mt(e,t,o,i=0,s=0){const n=e=>(e%360+360)%360,r=n(e),a=n(t);let l=a-r;l<0&&(l+=360);const c=l>180?1:0,d=Et(r,o,s),h=Et(a,o,s);if(i<=0)return`M 0 0 L ${d.x} ${d.y} A ${o} ${o} 0 ${c} 1 ${h.x} ${h.y} Z`;const p=Et(a,i,s),u=Et(r,i,s);return[`M ${d.x} ${d.y}`,`A ${o} ${o} 0 ${c} 1 ${h.x} ${h.y}`,`L ${p.x} ${p.y}`,`A ${i} ${i} 0 ${c} 0 ${u.x} ${u.y}`,"Z"].join(" ")}function Tt(e,t,o=0){return Et(e,zt(t),o)}function It(e){return(e%360+360)%360}function Pt(e,t,o,i){const s=i??0;let n=-1,r=-1;for(let i=t;i<=o&&i<e.length;i++)e[i].elevation>s&&(-1===n&&(n=i),r=i);return-1===n?null:{wedgeStart:e[n].azimuth,wedgeEnd:e[r].azimuth}}function Ot(e,t,o){const i=(e-t)/864e5;return Math.max(0,Math.min(o,i*o))}function Nt(e,t,o){return t+(1-(Number.isNaN(e)?0:Math.max(0,Math.min(100,e)))/100)*o}function Dt(e,t,o){return((e-t)%360+360)%360<=((o-t)%360+360)%360}function Bt(e,t,o,i){return Dt(o,e,t)||Dt(i,e,t)||Dt(e,o,i)||Dt(t,o,i)}function Ft(e){const t=Object.values(e).filter(e=>"number"==typeof e);return 0===t.length?null:t.reduce((e,t)=>e+t,0)/t.length}function Rt(e,t,o,i){const s=t?e/100:1-e/100;return Math.min(o*s,i)}function jt(e,t,o){return e&&null!=t&&Number.isFinite(t)?t===o?null:t:null}function Lt(e,t){return e<.5?-4*t*e:4*t*(1-e)}function Kt(e,t,o,i,s){const n=Et(o,1),r=-n.y,a=n.x,l=e-n.x*i,c=t-n.y*i;return`M ${e} ${t} L ${l+r*s} ${c+a*s} L ${l-r*s} ${c-a*s} Z`}function Gt(e,t){const o=t.entities.target_position_sensor;if(!o)return null;const i=parseFloat(e.states[o]?.state??"");return Number.isNaN(i)?null:i}function Wt(e,t){const o=t.entities.target_position_sensor;if(!o)return null;const i=e.states[o]?.attributes,s=i?.linear_position;return"number"==typeof s&&Number.isFinite(s)?s:null}function Ht(e,t){return Wt(e,t)??Gt(e,t)}function Ut(e,t){const o=t.entities.target_position_sensor;if(!o)return null;const i=e.states[o]?.attributes,s=i?.raw_calculated_position;return"number"==typeof s&&Number.isFinite(s)?s:null}function qt(e,t){const o=t.entities.target_position_sensor;if(!o)return{};const i=e.states[o]?.attributes,s=i?.linear_actual_positions;if(s&&"object"==typeof s)return s;const n=i?.actual_positions;return n?St(t)?Object.fromEntries(Object.entries(n).map(([e,t])=>[e,"number"==typeof t?100-t:null])):n:{}}function Vt(e,t,o){if(!o)return null;const i=e.states[o]?.attributes?.current_position;return"number"!=typeof i||Number.isNaN(i)?null:St(t)?100-i:i}function Yt(e,t,o){if(!o||!t.stateAttr)return null;const i=e.states[o]?.attributes?.[t.stateAttr];return"number"!=typeof i||Number.isNaN(i)?null:t.inverted?100-i:i}function Zt(e,t){return Ft(qt(e,t))}function Qt(e,t){const o=t.entities.manual_override_binary;return!!o&&"on"===e.states[o]?.state}function Xt(e,t){const o=Ht(e,t);return jt(Qt(e,t),Ut(e,t),o)??o}const{I:Jt}=ae,eo=e=>e,to=()=>document.createComment(""),oo=(e,t,o)=>{const i=e._$AA.parentNode,s=void 0===t?e._$AB:t._$AA;if(void 0===o){const t=i.insertBefore(to(),s),n=i.insertBefore(to(),s);o=new Jt(t,n,e,e.options)}else{const t=o._$AB.nextSibling,n=o._$AM,r=n!==e;if(r){let t;o._$AQ?.(e),o._$AM=e,void 0!==o._$AP&&(t=e._$AU)!==n._$AU&&o._$AP(t)}if(t!==s||r){let e=o._$AA;for(;e!==t;){const t=eo(e).nextSibling;eo(i).insertBefore(e,s),e=t}}}return o},io=(e,t,o=e)=>(e._$AI(t,o),e),so={},no=(e,t=so)=>e._$AH=t,ro=e=>{e._$AR(),e._$AA.remove()},ao=e=>(...t)=>({_$litDirective$:e,values:t});class lo{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const co=(e,t)=>{const o=e._$AN;if(void 0===o)return!1;for(const e of o)e._$AO?.(t,!1),co(e,t);return!0},ho=e=>{let t,o;do{if(void 0===(t=e._$AM))break;o=t._$AN,o.delete(e),e=t}while(0===o?.size)},po=e=>{for(let t;t=e._$AM;e=t){let o=t._$AN;if(void 0===o)t._$AN=o=new Set;else if(o.has(e))break;o.add(e),go(t)}};function uo(e){void 0!==this._$AN?(ho(this),this._$AM=e,po(this)):this._$AM=e}function _o(e,t=!1,o=0){const i=this._$AH,s=this._$AN;if(void 0!==s&&0!==s.size)if(t)if(Array.isArray(i))for(let e=o;e<i.length;e++)co(i[e],!1),ho(i[e]);else null!=i&&(co(i,!1),ho(i));else co(this,e)}const go=e=>{2==e.type&&(e._$AP??=_o,e._$AQ??=uo)};class mo extends lo{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,o){super._$AT(e,t,o),po(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(co(this,e),ho(this))}setValue(e){if((()=>void 0===this._$Ct.strings)())this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}let vo=class extends de{constructor(){super(...arguments),this.text="",this.cursorX=0,this.cursorY=0,this.offset=Ct,this.visible=!1,this._x=0,this._y=0}connectedCallback(){super.connectedCallback(),this.hasAttribute("role")||this.setAttribute("role","tooltip")}updated(){if(!this.visible)return;this.setAttribute("aria-hidden","false");const e=this.shadowRoot?.querySelector(".bubble"),t=e?.offsetWidth??0,o=e?.offsetHeight??0,i="undefined"!=typeof window?window.innerWidth:0,s="undefined"!=typeof window?window.innerHeight:0,{x:n,y:r}=function(e){const{cursorX:t,cursorY:o,ttW:i,ttH:s,vpW:n,vpH:r}=e,[a,l]=e.offset??Ct;let c=t+a,d=!1;c+i>n&&(c=t-a-i,d=!0),c<0&&(c=0);let h=o+l;return h+s>r&&(h=o-l-s),h<0&&(h=0),{x:c,y:h,flipped:d}}({cursorX:this.cursorX,cursorY:this.cursorY,ttW:t,ttH:o,vpW:i,vpH:s,offset:this.offset});n!==this._x&&(this._x=n),r!==this._y&&(this._y=r)}render(){return this.visible?H`<div class="bubble" style="transform: translate3d(${this._x}px, ${this._y}px, 0)">
      ${this.text}
    </div>`:(this.setAttribute("aria-hidden","true"),V)}};vo.styles=a`
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
  `,e([ge({type:String})],vo.prototype,"text",void 0),e([ge({type:Number})],vo.prototype,"cursorX",void 0),e([ge({type:Number})],vo.prototype,"cursorY",void 0),e([ge({attribute:!1})],vo.prototype,"offset",void 0),e([ge({type:Boolean,reflect:!0})],vo.prototype,"visible",void 0),e([me()],vo.prototype,"_x",void 0),e([me()],vo.prototype,"_y",void 0),vo=e([pe("acp-floating-tooltip")],vo);const fo={enabled:!0,offset:Ct,delay:400};function bo(e){void 0!==e.enabled&&(fo.enabled=e.enabled),void 0!==e.offset&&(fo.offset=e.offset),void 0!==e.delay&&(fo.delay=e.delay)}const yo="acp-floating-tooltip-bubble",wo=new class{constructor(){this._el=null,this._refs=0}get id(){return yo}retain(){this._refs+=1,this._ensure()}release(){this._refs=Math.max(0,this._refs-1)}_ensure(){if("undefined"==typeof document)return null;if(this._el&&this._el.isConnected)return this._el;const e=document.createElement("acp-floating-tooltip");return e.id=yo,document.body.appendChild(e),this._el=e,e}show(e,t,o,i){const s=this._ensure();s&&(s.text=e,s.cursorX=t,s.cursorY=o,s.offset=i,s.visible=!0)}move(e,t){this._el&&this._el.visible&&(this._el.cursorX=e,this._el.cursorY=t)}hide(){this._el&&(this._el.visible=!1)}_reset(){this._el&&this._el.parentNode&&this._el.parentNode.removeChild(this._el),this._el=null,this._refs=0}},xo=ao(class extends mo{constructor(e){if(super(e),this._el=null,this._text="",this._offset=Ct,this._delay=400,this._enabled=!0,this._openTimer=null,this._shown=!1,this._retained=!1,this._lastX=0,this._lastY=0,this._onEnter=e=>this._handleEnter(e),this._onMove=e=>this._handleMove(e),this._onLeave=()=>this._dismiss(),this._onFocus=()=>this._handleFocus(),this._onBlur=()=>this._dismiss(),this._onKey=e=>{"Escape"===e.key&&this._dismiss()},this._onScroll=()=>this._dismiss(),6!==e.type)throw new Error("tooltip() can only be used as an element-part directive")}render(e,t){return V}update(e,[t,o]){const i=e.element;return this._text=t??"",this._offset=o?.offset??fo.offset,this._delay=o?.delay??fo.delay,this._enabled=o?.enabled??fo.enabled,this._el!==i?(this._teardown(),this._el=i,this._wire()):this._applyAttributes(),this.render(t,o)}_wire(){const e=this._el;e&&(this._applyAttributes(),this._enabled&&(wo.retain(),this._retained=!0,e.addEventListener("pointerenter",this._onEnter),e.addEventListener("pointermove",this._onMove),e.addEventListener("pointerleave",this._onLeave),e.addEventListener("focusin",this._onFocus),e.addEventListener("focusout",this._onBlur),e.addEventListener("keydown",this._onKey),window.addEventListener("scroll",this._onScroll,!0)))}_applyAttributes(){const e=this._el;e&&(this._enabled?(e.removeAttribute("title"),e.setAttribute("data-tooltip",this._text),e.setAttribute("aria-describedby",wo.id)):(e.removeAttribute("data-tooltip"),e.removeAttribute("aria-describedby"),e.removeAttribute("acp-tt-shown"),e.setAttribute("title",this._text)))}_handleEnter(e){this._lastX=e.clientX,this._lastY=e.clientY,this._armOpen()}_handleFocus(){const e=this._el;if(e&&"function"==typeof e.getBoundingClientRect){const t=e.getBoundingClientRect();this._lastX=t.left+t.width/2,this._lastY=t.bottom}this._armOpen()}_armOpen(){null===this._openTimer&&(this._openTimer=setTimeout(()=>{this._openTimer=null,this._open()},this._delay))}_open(){this._el&&(wo.show(this._text,this._lastX,this._lastY,this._offset),this._shown=!0,this._el.setAttribute("acp-tt-shown",""))}_handleMove(e){this._lastX=e.clientX,this._lastY=e.clientY,this._shown&&wo.move(this._lastX,this._lastY)}_dismiss(){null!==this._openTimer&&(clearTimeout(this._openTimer),this._openTimer=null),this._shown&&(wo.hide(),this._shown=!1),this._el?.removeAttribute("acp-tt-shown")}_teardown(){const e=this._el;e&&(this._dismiss(),e.removeEventListener("pointerenter",this._onEnter),e.removeEventListener("pointermove",this._onMove),e.removeEventListener("pointerleave",this._onLeave),e.removeEventListener("focusin",this._onFocus),e.removeEventListener("focusout",this._onBlur),e.removeEventListener("keydown",this._onKey),"undefined"!=typeof window&&window.removeEventListener("scroll",this._onScroll,!0),this._retained&&(wo.release(),this._retained=!1),e.removeAttribute("data-tooltip"),e.removeAttribute("aria-describedby"),e.removeAttribute("acp-tt-shown"),this._el=null)}disconnected(){this._teardown()}reconnected(){this._wire()}});function $o(){let e=null;return(t,o,i)=>{const s=o.entry_id??"";if(!s)return e=null,null;const n=null!==e&&e.registry===i&&e.entryId===s,r=n?e.base:Ao(s,i);if(!r)return e={registry:i,entryId:s,base:null,devices:null,areas:null,posState:null,ctrlState:null,result:null},null;const a=t.devices,l=t.areas,c=r.entities.target_position_sensor??r.entities.group_position_sensor,d=r.entities.control_status_sensor,h=c?t.states[c]:void 0,p=d?t.states[d]:void 0;if(n&&null!==e&&null!==e.result&&e.devices===a&&e.areas===l&&e.posState===h&&e.ctrlState===p)return e.result;const u=So(t,s,r);return e={registry:i,entryId:s,base:r,devices:a,areas:l,posState:h,ctrlState:p,result:u},u}}function ko(){const e=new Map;let t=[],o=[],i={list:[],missing:[]};return(s,n,r,a)=>{const l=n.map(t=>{let o=e.get(t);return o||(o=$o(),e.set(t,o)),o(s,{type:a,entry_id:t},r)});if(e.size>n.length)for(const t of e.keys())n.includes(t)||e.delete(t);const c=t.length===n.length&&t.every((e,t)=>e===n[t])&&o.length===l.length&&o.every((e,t)=>e===l[t]);if(c)return i;t=n.slice(),o=l;const d=[],h=[];return n.forEach((e,t)=>{const o=l[t];o?d.push(o):h.push(e)}),i={list:d,missing:h},i}}function Ao(e,t){const o={},i=`${e}_`;let s,n=!1;for(const r of t){if(r.config_entry_id!==e)continue;if(r.platform!==Te)continue;if(n=!0,!s&&r.device_id&&(s=r.device_id),!r.unique_id.startsWith(i))continue;const t=r.unique_id.slice(i.length),a=r.entity_id.split(".")[0],l=et[`${a}:${t}`];l&&(o[l]=r.entity_id)}return n&&0!==Object.keys(o).length?{entities:o,deviceId:s}:null}function So(e,t,o){const{entities:i,deviceId:s}=o,n=e;let r=t;if(n.devices)for(const e of Object.values(n.devices))if(e.config_entries?.includes(t)){r=e.name_by_user??e.name??t;break}const a=s?n.devices?.[s]?.area_id:void 0,l=a?e.areas?.[a]?.name:void 0,c=!!i.group_active_scene_sensor,d=[];if(c){const t=i.group_position_sensor;if(t){const o=e.states[t]?.attributes?.member_positions;o&&d.push(...Object.keys(o))}}else{const t=i.target_position_sensor;if(t){const o=e.states[t]?.attributes?.actual_positions;o&&d.push(...Object.keys(o))}}let h,p="cover_blind";const u=i.control_status_sensor;if(u){const t=e.states[u]?.attributes;t?.cover_type&&(p=t.cover_type);const o=t?.cover_discovery;o&&"object"==typeof o&&Array.isArray(o.axes)&&(h=o)}return{entry_id:t,entry_title:r,cover_type:p,entities:i,managed_covers:d,device_id:s,is_group:c,...h?{discovery:h}:{},...l?{area_name:l}:{}}}function Co(e,t,o){const i=t.entry_id;if(!i)return null;const s=Ao(i,o);return s?So(e,i,s):null}async function Eo(e){return e.callWS({type:"config/entity_registry/list"})}function zo(e,t){let o=null,i=!1;return e.connection.subscribeEvents(e=>t(e.data),"entity_registry_updated").then(e=>{i?e():o=e}).catch(()=>{}),()=>{i=!0,o&&o()}}let Mo=null,To=null;function Io(){return Mo}function Po(e,t=!1){if(To)return To;if(!t&&Mo)return Promise.resolve(Mo);const o=Eo(e).then(e=>(Mo=e,To=null,e)).catch(e=>{throw To=null,e});return To=o,o}let Oo=null,No=null;function Do(e){if(Oo===e&&No)return No;const t=new Map;for(const o of e)t.set(o.entity_id,o);return Oo=e,No=t,t}function Bo(e,t,o){if(!t.startsWith("cover."))return null;const i=o??Io();if(!i)return null;const s=Do(i);if(s.get(t)?.platform===Te)return null;for(const[o,i]of Object.entries(e.states)){const e=i?.attributes?.actual_positions;if(!e||!(t in e))continue;const n=s.get(o);if(n?.platform===Te)return n.config_entry_id}return null}function Fo(e,t){return function(){if(Mo||To)return;const e=globalThis.hassConnection;e&&(To=e.then(({conn:e})=>e.sendMessagePromise({type:"config/entity_registry/list"})).then(e=>(Mo=e,To=null,e)).catch(e=>{throw To=null,e}),To.catch(()=>{}))}(),(o,i)=>{const s=function(e,t){const o=Io();if(!o)return e.callWS&&Po(e).catch(()=>{}),null;const i=Do(o),s=i.get(t);if(s?.platform===Te)return s.config_entry_id;if(!t.startsWith("cover."))return null;for(const[o,s]of Object.entries(e.states)){const e=s?.attributes,n=e?.actual_positions??e?.member_positions;if(!n||!(t in n))continue;const r=i.get(o);if(r?.platform===Te)return r.config_entry_id}return null}(o,i);return s?{config:"entry_ids"===t?{type:e,entry_ids:[s]}:{type:e,entry_id:s}}:null}}async function Ro(e){const[t,o]=await Promise.all([e.callWS({type:"config_entries/get",domain:Te}),Eo(e)]),i=new Set(o.filter(e=>e.platform===Te&&null!=e.config_entry_id).map(e=>e.config_entry_id));return t.filter(e=>e.domain===Te&&i.has(e.entry_id)).map(e=>({entry_id:e.entry_id,title:e.title}))}function jo(e){return`acp-card:registry:v1:${e}`}const Lo={get(e){try{const t=localStorage.getItem(jo(e));if(!t)return null;const o=JSON.parse(t);return 1!==o.schemaVersion?null:o.entries?.length?"number"==typeof o.fetchedAt&&Date.now()-o.fetchedAt>6e4?null:o:null}catch{return null}},set(e,t){if(0!==t.length)try{const o={schemaVersion:1,cardVersion:fe,fetchedAt:Date.now(),entries:t};localStorage.setItem(jo(e),JSON.stringify(o))}catch{}},invalidate(e){try{localStorage.removeItem(jo(e))}catch{}},clear(){try{const e="acp-card:registry:v1:",t=[];for(let o=0;o<localStorage.length;o++){const i=localStorage.key(o);i?.startsWith(e)&&t.push(i)}t.forEach(e=>localStorage.removeItem(e))}catch{}}};function Ko(e){return`${e.entity_id}|${e.unique_id}|${e.platform}|${e.config_entry_id??""}`}function Go(e,t,o){return e.filter(e=>e.config_entry_id===t&&void 0===o)}let Wo=class extends de{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return H`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        ${xo(this.title)}
        aria-disabled=${this.readonly?"true":V}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};Wo.styles=a`
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
  `,e([ge({type:Boolean})],Wo.prototype,"on",void 0),e([ge({type:Boolean})],Wo.prototype,"readonly",void 0),e([ge({type:String})],Wo.prototype,"label",void 0),e([ge({type:String})],Wo.prototype,"title",void 0),Wo=e([pe("acp-header-pill")],Wo);const Ho=ao(class extends lo{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const o=e.element.classList;for(const e of this.st)e in t||(o.remove(e),this.st.delete(e));for(const e in t){const i=!!t[e];i===this.st.has(e)||this.nt?.has(e)||(i?(o.add(e),this.st.add(e)):(o.remove(e),this.st.delete(e)))}return q}});function Uo(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var qo,Vo,Yo={exports:{}},Zo=(qo||(qo=1,Vo=Yo,function(){var e=Math.PI,t=Math.sin,o=Math.cos,i=Math.tan,s=Math.asin,n=Math.atan2,r=Math.acos,a=e/180,l=864e5,c=2440588,d=2451545;function h(e){return new Date((e+.5-c)*l)}function p(e){return function(e){return e.valueOf()/l-.5+c}(e)-d}var u=23.4397*a;function _(e,s){return n(t(e)*o(u)-i(s)*t(u),o(e))}function g(e,i){return s(t(i)*o(u)+o(i)*t(u)*t(e))}function m(e,s,r){return n(t(e),o(e)*t(s)-i(r)*o(s))}function v(e,i,n){return s(t(i)*t(n)+o(i)*o(n)*o(e))}function f(e,t){return a*(280.16+360.9856235*e)-t}function b(e){return a*(357.5291+.98560028*e)}function y(o){return o+a*(1.9148*t(o)+.02*t(2*o)+3e-4*t(3*o))+102.9372*a+e}function w(e){var t=y(b(e));return{dec:g(t,0),ra:_(t,0)}}var x={getPosition:function(e,t,o){var i=a*-o,s=a*t,n=p(e),r=w(n),l=f(n,i)-r.ra;return{azimuth:m(l,s,r.dec),altitude:v(l,s,r.dec)}}},$=x.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];x.addTime=function(e,t,o){$.push([e,t,o])};var k=9e-4;function A(t,o,i){return k+(t+o)/(2*e)+i}function S(e,o,i){return d+e+.0053*t(o)-.0069*t(2*i)}function C(e,i,s,n,a,l,c){var d=function(e,i,s){return r((t(e)-t(i)*t(s))/(o(i)*o(s)))}(e,s,n);return S(A(d,i,a),l,c)}function E(e){var i=a*(134.963+13.064993*e),s=a*(93.272+13.22935*e),n=a*(218.316+13.176396*e)+6.289*a*t(i),r=5.128*a*t(s),l=385001-20905*o(i);return{ra:_(n,r),dec:g(n,r),dist:l}}function z(e,t){return new Date(e.valueOf()+t*l/24)}x.getTimes=function(t,o,i,s){var n,r,l,c,d,u=a*-i,_=a*o,m=function(e){return-2.076*Math.sqrt(e)/60}(s=s||0),v=function(t,o){return Math.round(t-k-o/(2*e))}(p(t),u),f=A(0,u,v),w=b(f),x=y(w),E=g(x,0),z=S(f,w,x),M={solarNoon:h(z),nadir:h(z-.5)};for(n=0,r=$.length;n<r;n+=1)d=z-((c=C(((l=$[n])[0]+m)*a,u,_,E,v,w,x))-z),M[l[1]]=h(d),M[l[2]]=h(c);return M},x.getMoonPosition=function(e,s,r){var l=a*-r,c=a*s,d=p(e),h=E(d),u=f(d,l)-h.ra,_=v(u,c,h.dec),g=n(t(u),i(c)*o(h.dec)-t(h.dec)*o(u));return _+=function(e){return e<0&&(e=0),2967e-7/Math.tan(e+.00312536/(e+.08901179))}(_),{azimuth:m(u,c,h.dec),altitude:_,distance:h.dist,parallacticAngle:g}},x.getMoonIllumination=function(e){var i=p(e||new Date),s=w(i),a=E(i),l=149598e3,c=r(t(s.dec)*t(a.dec)+o(s.dec)*o(a.dec)*o(s.ra-a.ra)),d=n(l*t(c),a.dist-l*o(c)),h=n(o(s.dec)*t(s.ra-a.ra),t(s.dec)*o(a.dec)-o(s.dec)*t(a.dec)*o(s.ra-a.ra));return{fraction:(1+o(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},x.getMoonTimes=function(e,t,o,i){var s=new Date(e);i?s.setUTCHours(0,0,0,0):s.setHours(0,0,0,0);for(var n,r,l,c,d,h,p,u,_,g,m,v,f,b=.133*a,y=x.getMoonPosition(s,t,o).altitude-b,w=1;w<=24&&(n=x.getMoonPosition(z(s,w),t,o).altitude-b,u=((d=(y+(r=x.getMoonPosition(z(s,w+1),t,o).altitude-b))/2-n)*(p=-(h=(r-y)/2)/(2*d))+h)*p+n,g=0,(_=h*h-4*d*n)>=0&&(m=p-(f=Math.sqrt(_)/(2*Math.abs(d))),v=p+f,Math.abs(m)<=1&&g++,Math.abs(v)<=1&&g++,m<-1&&(m=v)),1===g?y<0?l=w+m:c=w+m:2===g&&(l=w+(u<0?v:m),c=w+(u<0?m:v)),!l||!c);w+=2)y=r;var $={};return l&&($.rise=z(s,l)),c&&($.set=z(s,c)),l||c||($[u>0?"alwaysUp":"alwaysDown"]=!0),$},Vo.exports=x}()),Yo.exports),Qo=Uo(Zo);const Xo=new Map;function Jo(e,t,o,i=10){const s=`${e},${t},${o.getTime()},${i}`,n=Xo.get(s);if(n)return Xo.delete(s),Xo.set(s,n),n;const r=[],a=o.getTime()+864e5;for(let s=o.getTime();s<=a;s+=60*i*1e3){const o=new Date(s),i=Qo.getPosition(o,e,t);r.push({t:o,elevation:180*i.altitude/Math.PI,azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360})}if(Xo.set(s,r),Xo.size>4){const e=Xo.keys().next().value;void 0!==e&&Xo.delete(e)}return r}function ei(e=new Date){const t=new Date(e);return t.setHours(0,0,0,0),t}function ti(e,t=new Date){if(!e)return ei(t);const o=new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(t),[i,s,n]=o.split("-").map(Number),r=Date.UTC(i,s-1,n,0,0,0),a=function(e,t){const o=new Intl.DateTimeFormat("en-US",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(t),i={};for(const e of o)"literal"!==e.type&&(i[e.type]=Number(e.value));return Date.UTC(i.year,i.month-1,i.day,i.hour,i.minute,i.second)-t.getTime()}(e,new Date(r));return new Date(r-a)}function oi(e,t,o,i){const s=((t-o)%360+360)%360;return((e-s)%360+360)%360<=((((t+i)%360+360)%360-s)%360+360)%360}function ii(e,t,o,i){const s=[];let n=-1;for(let r=0;r<e.length;r++){const a=e[r];a.elevation>0&&oi(a.azimuth,t,o,i)?-1===n&&(n=r):-1!==n&&(s.push({startIdx:n,endIdx:r-1}),n=-1)}return-1!==n&&s.push({startIdx:n,endIdx:e.length-1}),s}function si(e){const t=[];let o=-1;for(let i=0;i<e.length;i++)e[i].elevation>0?-1===o&&(o=i):-1!==o&&(t.push({startIdx:o,endIdx:i-1}),o=-1);return-1!==o&&t.push({startIdx:o,endIdx:e.length-1}),t}function ni(e,t,o=new Date){const i=Qo.getMoonPosition(o,e,t),s=Qo.getMoonIllumination(o);return{azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360,elevation:180*i.altitude/Math.PI,phase:s.phase,fraction:s.fraction,phaseName:ri(s.phase)}}function ri(e){return e<.0625||e>=.9375?"New Moon":e<.1875?"Waxing Crescent":e<.3125?"First Quarter":e<.4375?"Waxing Gibbous":e<.5625?"Full Moon":e<.6875?"Waning Gibbous":e<.8125?"Last Quarter":"Waning Crescent"}const ai=new Set(["outside_fov","in_fov_not_valid","hitting"]),li={night:"sun night",hitting:"sun valid",in_fov_not_valid:"sun in-fov",outside_fov:"sun up"};function ci(e){return e.belowHorizon?"night":e.sunState&&ai.has(e.sunState)?e.sunState:e.directSunValid?"hitting":e.inFov?"in_fov_not_valid":"outside_fov"}const di=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function hi(e){const t=di.length;return di[(e%t+t)%t]}function pi(e,t){return"string"==typeof e&&e.length>0?{color:e,isOverride:!0}:{color:hi(t),isOverride:!1}}const ui="data:image/png;base64,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",_i=110;let gi=0,mi=class extends de{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set,this._legendMoonMaskId="acp-legend-moon-"+gi++}shouldUpdate(e){return e.size>1||!e.has("hass")||ve(e.get("hass"),this.hass,this._relevantIds())}_relevantIds(){const e=[];for(const t of this.discovered_list){const o=t.entities;e.push(o.sun_sensor,o.target_position_sensor,o.manual_override_binary,o.sun_infront_binary,o.decision_trace_sensor,o.start_sensor,o.end_sensor)}return e}_toggleEntry(e){const t=new Set(this._hiddenEntries);t.has(e)?t.delete(e):t.add(e),this._hiddenEntries=t}_sunFor(e){const t=e.entities.sun_sensor;if(!t)return null;const o=this.hass.states[t];if(!o)return null;const i=parseFloat(o.state);return Number.isNaN(i)?null:{...o.attributes,window_azimuth:o.attributes.window_azimuth}}_sunInfrontFor(e){const t=e.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}_sunDotStateFor(e,t){const o=e.entities.decision_trace_sensor?this.hass.states[e.entities.decision_trace_sensor]?.attributes:void 0;return ci({belowHorizon:t.elevation<=0,sunState:o?.sun_state??null,directSunValid:o?.direct_sun_valid??!1,inFov:!0===t.in_fov})}_readActiveAzimuth(e){if(!e)return null;const t=this.hass.states[e];if(!t)return null;if("unavailable"===t.state||"unknown"===t.state)return null;const o=t.attributes.azimuth;return"number"==typeof o&&Number.isFinite(o)?o:null}_buildOverlays(){const e=[];return this.discovered_list.forEach((t,o)=>{const i=this._sunFor(t);if(!i)return;const s=t.entities.sun_sensor,n=parseFloat(this.hass.states[s]?.state??"0"),{color:r,isOverride:a}=pi(this.coverColors?.[o],o);e.push({d:t,sun:i,sunAzi:n,sunInfront:this._sunInfrontFor(t),dotState:this._sunDotStateFor(t,i),coverPos:Xt(this.hass,t),actualPos:Zt(this.hass,t),coverType:t.cover_type,openBlocksSun:At(t).openBlocksSun,color:r,isOverride:a,index:o})}),e}render(){if(!this.hass)return V;if(!this.discovered_list||0===this.discovered_list.length)return H`<div class="placeholder">${st("compass.placeholder_no_entries",this.hass)}</div>`;const e=this._buildOverlays();if(0===e.length)return H`<div class="placeholder">${st("compass.placeholder_no_sun",this.hass)}</div>`;const t=e.filter(e=>!this._hiddenEntries.has(e.d.entry_id)),o=It(this.northOffsetDeg),i=e.length>1,s=e[0],n=s.sunAzi,r=s.sun.elevation,a=Tt(n,r,o),l={night:-1,outside_fov:0,in_fov_not_valid:1,hitting:2},c=r<=0?"night":e.reduce((e,t)=>l[t.dotState]>l[e]?t.dotState:e,"outside_fov"),d=li[c],{latitude:h,longitude:p,time_zone:u}=this.hass.config,_=void 0!==h&&void 0!==p?Jo(h,p,ti(u)):[],g=this.showMoon&&void 0!==h&&void 0!==p?ni(h,p):null,m=null!==g&&g.elevation>0,v=g?Lt(g.phase,6):0,f=m?Tt(g.azimuth,g.elevation,o):null,b=f?f.x*_i:0,y=f?f.y*_i:0,w=this.showSunPath?si(_).map(e=>_.slice(e.startIdx,e.endIdx+1).map(e=>{const t=Tt(e.azimuth,e.elevation,o);return{x:t.x*_i,y:t.y*_i,elev:e.elevation}})):[],x=[122,127,135],$=[245,197,24],k=e=>{const t=Math.sqrt(Math.max(0,Math.min(1,e/90))),o=x.map((e,o)=>Math.round(e+($[o]-e)*t));return`rgb(${o[0]},${o[1]},${o[2]})`},A=this.showSunPath&&this.showSunriseSunset?w.filter(e=>e.length>1).map((e,t)=>{const o=e[0],i=e[e.length-1],s=i.x-o.x,n=i.y-o.y,r=s*s+n*n||1,a=e.filter((t,o)=>o%6==0||o===e.length-1).map(e=>({offset:100*Math.max(0,Math.min(1,((e.x-o.x)*s+(e.y-o.y)*n)/r)),color:k(e.elev)}));return{id:`sun-path-grad-${t}`,x1:o.x,y1:o.y,x2:i.x,y2:i.y,stops:a}}):[],S=e=>this.showSunriseSunset?`url(#sun-path-grad-${e})`:"var(--warning-color, gold)",C=Et(0,124,o),E=Et(90,124,o),z=Et(180,124,o),M=Et(270,124,o),T=Et(0,_i,o),I=Et(180,_i,o),P=Et(90,_i,o),O=Et(270,_i,o),N=st("compass.sun_tooltip",this.hass,{az:ct(n),el:ct(r)}),D=null!==g?st("compass.moon_tooltip",this.hass,{phase:g.phaseName,pct:Math.round(100*g.fraction)}):"",B=st("compass.sun_path_tooltip",this.hass);return H`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${U`
            <defs>
              ${m?U`
                <mask id="moon-phase-mask">
                  <circle cx=${b} cy=${y} r=${6} fill="white"></circle>
                  <circle cx=${b+v} cy=${y} r=${6} fill="black"></circle>
                </mask>
              `:V}
              ${A.map(e=>U`
                <linearGradient id=${e.id} gradientUnits="userSpaceOnUse"
                  x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}>
                  ${e.stops.map(e=>U`<stop offset="${e.offset}%" stop-color=${e.color}></stop>`)}
                </linearGradient>
              `)}
            </defs>

            <circle class="grid" r=${_i}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${_i/3}></circle>
            <line class="grid thin" x1=${T.x} y1=${T.y} x2=${I.x} y2=${I.y}></line>
            <line class="grid thin" x1=${P.x} y1=${P.y} x2=${O.x} y2=${O.y}></line>

            ${t.map(e=>this._renderEntryLayers(e,i,o,_))}

            ${this.showSunPath&&w.length?U`<g ${xo(B)}>${w.filter(e=>e.length>1).flatMap((e,t)=>{const o=e.map(e=>`${e.x},${e.y}`).join(" "),i=U`<polyline class="sun-path-line" points=${o}
                        style="stroke:${S(t)}"></polyline>`,s=[];for(let t=0;t<e.length;t+=10){const o=e[t],i=e[Math.max(0,t-1)],n=e[Math.min(e.length-1,t+1)],r=180*Math.atan2(n.y-i.y,n.x-i.x)/Math.PI,a=this.showSunriseSunset?k(o.elev):"var(--warning-color, gold)";s.push(U`<path class="sun-path-chevron"
                          transform=${`translate(${o.x} ${o.y}) rotate(${r})`}
                          d="M -2.4 -3 L 1.8 0 L -2.4 3 L -0.7 0 Z"
                          style=${`fill:${a}`}></path>`)}return[i,...s]})}</g>`:V}

            ${this.showCardinals?U`
              <text class="cardinal" x=${C.x} y=${C.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${z.x} y=${z.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${M.x} y=${M.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:V}

            ${m?U`
              <g ${xo(D)}>
                <circle class="moon-outline" cx=${b} cy=${y} r=${6}></circle>
                <image
                  class="moon-img"
                  href=${ui}
                  x=${b-6}
                  y=${y-6}
                  width=${12}
                  height=${12}
                  mask="url(#moon-phase-mask)"
                ></image>
              </g>
            `:V}

            <g ${xo(N)}>
              <circle class=${d} cx=${a.x*_i} cy=${a.y*_i} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(e,i,d,g):V}
        ${this.showStats?this._renderStats(e,i):V}
      </div>
    `}_renderEntryLayers(e,t,o=0,i=[]){const s=It(e.sun.window_azimuth),n=It(s-e.sun.fov_left),r=It(s+e.sun.fov_right),a=this._readActiveAzimuth(e.d.entities.start_sensor),l=this._readActiveAzimuth(e.d.entities.end_sensor),c=null!==a&&null!==l;let d,h;if(c)({wedgeStart:d,wedgeEnd:h}=function(e,t,o,i,s){const n=((o-i)%360+360)%360,r=i+s,a=((t-n)%360+360)%360,l=e=>e<=r?e:e-r<360-e?r:0,c=l(((e-n)%360+360)%360),d=l(a);return c===d?{wedgeStart:n,wedgeEnd:((n+r)%360+360)%360}:{wedgeStart:((n+Math.min(c,d))%360+360)%360,wedgeEnd:((n+Math.max(c,d))%360+360)%360}}(It(a),It(l),s,e.sun.fov_left,e.sun.fov_right));else{const t=function(e,t,o,i,s){if(void 0===s)return null;const n=It(t-o),r=o+i,a=e.filter(e=>((e.azimuth-n)%360+360)%360<=r&&e.elevation>s);return 0===a.length?null:{wedgeStart:a[0].azimuth,wedgeEnd:a[a.length-1].azimuth}}(i,s,e.sun.fov_left,e.sun.fov_right,e.sun.min_elevation);d=t?t.wedgeStart:n,h=t?t.wedgeEnd:r}const p=Et(s,_i,o),{outer:u,inner:_}=(g=e.sun.min_elevation,m=e.sun.max_elevation,v=_i,void 0!==g&&void 0!==m&&g>m?{outer:v,inner:0}:{outer:void 0!==g?v*zt(g):v,inner:void 0!==m?v*zt(m):0});var g,m,v;const f=null!==e.coverPos?Rt(e.coverPos,e.openBlocksSun,_i,u):null,b=null!==e.actualPos?Rt(e.actualPos,e.openBlocksSun,_i,u):null,y=e.sun.blind_spot_range?[It((w=s)-(x=e.sun.blind_spot_range)[1]),It(w-x[0])]:null;var w,x;const $=y?Mt(y[0],y[1],_i,0,o):null,k=Mt(d,h,u,_,o),A=c&&(d!==n||h!==r),S=A?Mt(n,r,u,_,o):"",C=null!==f&&f>_?Mt(d,h,f,_,o):"",E=null!==b&&b>_?Mt(d,h,b,_,o):"",z=[];for(const t of ii(i,s,e.sun.fov_left,e.sun.fov_right)){const s=Pt(i,t.startIdx,t.endIdx,e.sun.min_elevation);s&&!Bt(s.wedgeStart,s.wedgeEnd,d,h)&&z.push({fov:Mt(s.wedgeStart,s.wedgeEnd,u,_,o),cover:this.showCoverFill&&null!==f&&f>_?Mt(s.wedgeStart,s.wedgeEnd,f,_,o):"",actual:this.showCoverFill&&null!==b&&b>_?Mt(s.wedgeStart,s.wedgeEnd,b,_,o):"",from:s.wedgeStart,to:s.wedgeEnd})}const M=t?`${e.d.entry_title}: `:"",T=void 0!==e.sun.min_elevation||void 0!==e.sun.max_elevation?st("compass.elev_suffix",this.hass,{min:ct(e.sun.min_elevation??0),max:ct(e.sun.max_elevation??90)}):"",I=c?`${M}${st("compass.active_sun_arc",this.hass,{from:ct(d),to:ct(h),elev:T})}`:`${M}${st("compass.fov_arc",this.hass,{left:ct(e.sun.fov_left),right:ct(e.sun.fov_right),elev:T})}`,P=`${M}${st("compass.window_normal_tooltip",this.hass,{bearing:ct(s)})}`,O=[];if(null!==e.coverPos){const t=e.openBlocksSun?"compass.cover_position_target_awning":"compass.cover_position_target";O.push(`${M}${st(t,this.hass,{pct:e.coverPos})}`),null!==e.actualPos&&O.push(st("compass.cover_position_actual",this.hass,{pct:Math.round(e.actualPos)}))}const N=O.join("\n"),D=y?`${M}${st("compass.blind_spot",this.hass,{from:ct(y[0]),to:ct(y[1])})}`:"",B=t||e.isOverride,F=t||e.isOverride,R=B?`fill: ${e.color}; stroke: ${e.color};`:"",j=F?`fill: ${e.color}; stroke: ${e.color};`:"",L=B?`fill: ${e.color}; stroke: ${e.color};`:"",K=B?`stroke: ${e.color};`:"",G=B?`fill: ${e.color};`:"",W=this.showCoverFill&&""!==C,H=this.showBlindSpot&&!!$,q=this.showWindowArrow,Y=`M 0 0 L ${p.x} ${p.y}`,Z=B?`fill: ${e.color}; stroke: ${e.color};`:"",Q=Kt(p.x,p.y,s+o,9,5),X="display: none;",J=`${M}${st("compass.fov_arc",this.hass,{left:ct(e.sun.fov_left),right:ct(e.sun.fov_right),elev:T})}`;return U`<g class="entry-overlay">
      ${A?U`<g ${xo(J)}>
              <path class="fov fov-static" style=${R} d=${S}></path>
            </g>`:V}
      <g ${xo(I)}>
        <path class="fov" style=${R} d=${k}></path>
      </g>
      ${z.map(e=>{const t=`${M}${st("compass.active_sun_arc",this.hass,{from:ct(e.from),to:ct(e.to),elev:T})}`;return U`<g ${xo(t)}>
          <path class="fov-extra" style=${R} d=${e.fov}></path>
          ${e.cover?U`<path class="cover-fill-extra" style=${j} d=${e.cover}></path>`:V}
          ${e.actual?U`<path class="cover-actual-extra" style=${j} d=${e.actual}></path>`:V}
        </g>`})}
      <g class="arrow-group" style=${q?"":X} ${xo(P)}>
        <path class="window" style=${K} d=${Y}></path>
        <path class="window-head" style=${Z} d=${Q}></path>
        <circle class="window-base" style=${G} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" style=${W?"":X} ${xo(N)}>
        <path class="cover-fill" style=${j} d=${C}></path>
        ${this.showCoverFill&&E?U`<path class="cover-actual" style=${j} d=${E}></path>`:V}
      </g>
      <g class="blind-group" style=${H?"":X} ${xo(D)}>
        <path class="blind-spot" style=${L} d=${$??""}></path>
      </g>
    </g>`}_legendSunGlyph(e){return H`<span class="glyph"
      ><svg viewBox="-8 -8 16 16" width="20" height="20">
        ${U`<circle class=${e} cx="0" cy="0" r="5"></circle>`}
      </svg></span
    >`}_legendMoonGlyph(e){const t=e?Lt(e.phase,4):0,o=this._legendMoonMaskId;return H`<span class="glyph"
      ><svg viewBox="-5 -5 10 10" width="11" height="11">
        ${U`
          <defs>
            <mask id=${o}>
              <circle cx="0" cy="0" r=${4} fill="white"></circle>
              <circle cx=${t} cy="0" r=${4} fill="black"></circle>
            </mask>
          </defs>
          <circle class="moon-outline" cx="0" cy="0" r=${4}></circle>
          <image
            class="moon-img"
            href=${ui}
            x=${-4}
            y=${-4}
            width=${8}
            height=${8}
            mask=${`url(#${o})`}
          ></image>
        `}
      </svg></span
    >`}_legendWindowGlyph(e){const t=e?`stroke: ${e};`:"",o=e?`fill: ${e};`:"",i=Kt(5,0,90,4,2);return H`<span class="glyph"
      ><svg class="window-glyph" viewBox="-6 -6 12 12" width="13" height="13">
        ${U`
          <line class="window" style=${t} x1="-5" y1="0" x2="1.5" y2="0"></line>
          <path class="window-head" style=${o} d=${i}></path>
        `}
      </svg></span
    >`}_renderLegend(e,t,o,i){const s=e[0]?.isOverride?e[0].color??null:null,n=e[0],r=null!==n?.coverPos&&null!=n?.actualPos&&void 0!==n?.coverPos&&Math.round(n.actualPos)!==Math.round(n.coverPos);return t?H`
        <div class="legend">
          <div>${this._legendSunGlyph(o)} ${st("compass.sun",this.hass)}</div>
          ${this.showMoon?H`<div>${this._legendMoonGlyph(i)} ${st("compass.moon",this.hass)}</div>`:V}
          ${e.map(e=>H`
              <button
                type="button"
                class=${Ho({"entry-toggle":!0,hidden:this._hiddenEntries.has(e.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(e.d.entry_id)}
                @click=${()=>this._toggleEntry(e.d.entry_id)}
              >
                <span class="licell"
                  ><span class="swatch entry" style="background: ${e.color}"></span
                ></span>
                ${e.d.entry_title}
                ${e.sunInfront?H`<span class="status valid">${st("compass.in_fov_check",this.hass)}</span>`:e.sun.in_fov?H`<span class="status in-fov">${st("compass.in_fov",this.hass)}</span>`:H`<span class="status">${st("compass.none",this.hass)}</span>`}
              </button>
            `)}
        </div>
      `:H`<div class="legend">
      <div>${this._legendSunGlyph(o)} ${st("compass.sun",this.hass)}</div>
      ${this.showMoon?H`<div>${this._legendMoonGlyph(i)} ${st("compass.moon",this.hass)}</div>`:V}
      <div>
        <span class="licell"
          ><span
            class="swatch fov"
            style=${s?`background: ${s}`:""}
          ></span
        ></span>
        ${st("compass.window_fov",this.hass)}
      </div>
      ${this.showCoverFill?H`<div>
            <span class="licell"
              ><span
                class="swatch cover-fill-swatch"
                style=${s?`background: ${s}`:""}
              ></span
            ></span>
            ${st("compass.cover_target",this.hass)}
          </div>`:V}
      ${this.showCoverFill&&r?H`<div>
            <span class="licell"
              ><span
                class="swatch cover-actual-swatch"
                style=${s?`border-color: ${s}`:""}
              ></span
            ></span>
            ${st("compass.cover_held",this.hass)}
          </div>`:V}
      ${this.showWindowArrow?H`<div>
            ${this._legendWindowGlyph(s)} ${st("compass.window_normal",this.hass)}
          </div>`:V}
    </div>`}_renderStats(e,t){const o=e[0],i=o.sunAzi,s=o.sun.elevation,{latitude:n,longitude:r}=this.hass.config,a=this.showMoon&&void 0!==n&&void 0!==r?ni(n,r):null;return t?H`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${st("compass.stat_sun",this.hass)}${ct(i)} /
              ${ct(s)}</span
            >
            ${this.showMoon&&a?H`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:V}
          </div>
          ${e.map(e=>H`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${e.color}"></span>
                <span class="entry-name">${e.d.entry_title}</span>
                <span>∠${ct(e.sun.gamma)}</span>
                <span>W ${ct(It(e.sun.window_azimuth))}</span>
                ${e.sun.in_fov?H`<span
                      class="status in-fov"
                      ${xo(st("compass.in_fov_tooltip",this.hass))}
                      >✓</span
                    >`:V}
              </div>
            `)}
        </div>
      `:H`<div class="stats dim">
      <span>${st("compass.stat_azi",this.hass)}${ct(i)}</span>
      <span>${st("compass.stat_elev",this.hass)}${ct(s)}</span>
      <span>∠: ${ct(o.sun.gamma)}</span>
      <span
        >${st("compass.stat_window",this.hass)}${ct(It(o.sun.window_azimuth))}</span
      >
      ${this.showMoon&&a?H`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:V}
    </div>`}};function vi(e){let t=null,o=null;const i=6e4-Date.now()%6e4;return t=setTimeout(()=>{t=null,e(),o=setInterval(e,6e4)},i),()=>{null!==t&&(clearTimeout(t),t=null),null!==o&&(clearInterval(o),o=null)}}mi.styles=a`
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
  `,e([ge({attribute:!1})],mi.prototype,"hass",void 0),e([ge({attribute:!1})],mi.prototype,"discovered_list",void 0),e([ge({type:Boolean,reflect:!0})],mi.prototype,"compact",void 0),e([ge({attribute:!1})],mi.prototype,"showStats",void 0),e([ge({attribute:!1})],mi.prototype,"showLegend",void 0),e([ge({attribute:!1})],mi.prototype,"showMoon",void 0),e([ge({attribute:!1})],mi.prototype,"showCardinals",void 0),e([ge({attribute:!1})],mi.prototype,"showBlindSpot",void 0),e([ge({attribute:!1})],mi.prototype,"showSunPath",void 0),e([ge({attribute:!1})],mi.prototype,"showSunriseSunset",void 0),e([ge({attribute:!1})],mi.prototype,"showCoverFill",void 0),e([ge({attribute:!1})],mi.prototype,"showWindowArrow",void 0),e([ge({attribute:!1})],mi.prototype,"coverColors",void 0),e([ge({attribute:!1})],mi.prototype,"northOffsetDeg",void 0),e([me()],mi.prototype,"_hiddenEntries",void 0),mi=e([pe("acp-sky-compass")],mi);const fi=32,bi=864e5;function yi(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}let wi=class extends de{constructor(){super(...arguments),this.discoveredList=[],this.coverColors=[],this.compact=!1,this._cancelMinuteTimer=null}connectedCallback(){super.connectedCallback(),this._cancelMinuteTimer=vi(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._cancelMinuteTimer?.(),this._cancelMinuteTimer=null}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),o=[];for(const e of this.discoveredList){const t=e.entities;o.push(t.sun_sensor,t.decision_trace_sensor,t.control_status_sensor)}return ve(t,this.hass,o)}_sunAttrsFor(e){const t=e.entities.sun_sensor;if(!t)return null;const o=this.hass.states[t];return o?o.attributes:null}_sunDotTraceInputs(){const e=this.discoveredList[0]?.entities.decision_trace_sensor,t=e?this.hass.states[e]?.attributes:void 0;return{sunState:t?.sun_state??null,directSunValid:t?.direct_sun_valid??!1}}_scheduleBounds(){const e=this.discoveredList[0]?.entities.control_status_sensor;if(!e)return null;const t=this.hass.states[e]?.attributes;return t?{start:yi(t.schedule_start),end:yi(t.schedule_end)}:null}render(){if(!this.hass||0===this.discoveredList.length)return V;const e=this._sunAttrsFor(this.discoveredList[0]),{latitude:t,longitude:o,time_zone:i}=this.hass.config??{};if(void 0===t||void 0===o||!e)return H`<div class="placeholder">${st("elevation.placeholder",this.hass)}</div>`;const s=ti(i),n=Jo(t,o,s),r=new Date,a=e=>{const t=e.getTime()-s.getTime();return fi+t/864e5*360},l=e=>138-(e- -10)/100*128,c=n.map(e=>`${a(e.t).toFixed(1)},${l(e.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(r),p=this._interpAt(n,r),u=p?l(p.elevation):null,_=!p||p.elevation<=0,g=this._sunDotTraceInputs(),m=li[ci({belowHorizon:_,sunState:g.sunState,directSunValid:g.directSunValid,inFov:!0===e.in_fov})].replace(/^sun /,""),v=e=>138-128*e,f=this.discoveredList.length>1,b=this._scheduleBounds(),y=b?function(e,t,o,i){if(!e&&!t)return{offSchedule:[],bars:[]};const s=e=>(e.getTime()-o)/i,n=e=>Math.max(0,Math.min(1,e)),r=e=>n(e),a=e=>e>1?e-Math.floor(e):n(e),l=e=>e>0&&e<1?[e]:[];if(e&&!t){const t=s(e);return{offSchedule:[{x0:0,x1:r(t)}],bars:l(t)}}if(!e&&t){const e=s(t);return{offSchedule:[{x0:a(e),x1:1}],bars:l(e)}}const c=s(e),d=s(t),h=r(c),p=a(d),u=[...l(c),...l(d)];if(h>p)return{offSchedule:[{x0:p,x1:h}],bars:u};const _=[];return h>0&&_.push({x0:0,x1:h}),p<1&&_.push({x0:p,x1:1}),{offSchedule:_,bars:u}}(b.start,b.end,s.getTime(),bi):{offSchedule:[],bars:[]},w=e=>fi+360*e,x=y.offSchedule.map(e=>({x:w(e.x0),width:w(e.x1)-w(e.x0)})),$=b?.start&&s?(b.start.getTime()-s.getTime())/bi:null,k=y.bars.map(e=>{const t=null!==$&&Math.abs(e-$)<1e-9?b.start.toISOString():b.end.toISOString(),o=null!==$&&Math.abs(e-$)<1e-9,s=w(e);return{x:s,anchor:s>=391?"end":s<=33?"start":"middle",label:dt(t,i),tooltip:st(o?"elevation.schedule_start_tooltip":"elevation.schedule_end_tooltip",this.hass)}}),A=(()=>{if(!b)return null;const e=b.start?dt(b.start.toISOString(),i):null,t=b.end?dt(b.end.toISOString(),i):null;return e&&t?st("elevation.schedule",this.hass,{from:e,to:t}):e?st("elevation.schedule_from",this.hass,{from:e}):t?st("elevation.schedule_until",this.hass,{to:t}):null})(),S=this.discoveredList.map((e,t)=>{const o=this._sunAttrsFor(e),{color:s,isOverride:r}=pi(this.coverColors?.[t],t),l=r;if(!o)return{d:e,runs:[],inPlotBands:[],runBars:[],label:"",color:s,inlineFill:l};const c=ii(n,o.window_azimuth,o.fov_left,o.fov_right),d="number"==typeof o.min_elevation,h="number"==typeof o.max_elevation,{loFrac:p,hiFrac:u}=function(e,t){if(void 0!==e&&void 0!==t&&e>t)return{loFrac:0,hiFrac:1};const o=e=>Math.max(0,Math.min(1,(e- -10)/100));return{loFrac:void 0!==e?o(e):0,hiFrac:void 0!==t?o(t):1}}(o.min_elevation,o.max_elevation),_=d||h?v(u):10,g=d||h?v(p):138,m=_,b=Math.max(0,g-_),y=c.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),y:m,height:b})),w=c.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),range:`${dt(n[e.startIdx].t.toISOString(),i)} → ${dt(n[e.endIdx].t.toISOString(),i)}`})),x=c.map(e=>`${dt(n[e.startIdx].t.toISOString(),i)} → ${dt(n[e.endIdx].t.toISOString(),i)}`).join(", "),$=[];return f||(d&&$.push(g),h&&$.push(_)),{d:e,runs:c,inPlotBands:y,runBars:w,label:x,color:s,inlineFill:l,limitLines:$}}),C=S.some(e=>e.runs.length>0),E=f?function(e){if(e<=0)return{rows:[],height:0};const t=Array.from({length:e},(e,t)=>({y:0+11*t,height:8}));return{rows:t,height:0+8*e+3*(e-1)+0}}(S.length):{rows:[],height:0},z=138-E.height-3;return H`
      <div class="wrap">
        <div class="head">
          <span class="label">${st("elevation.title",this.hass)}</span>
          <span class="head-meta">
            ${f?V:C?H`<span class="dim"
                      >${st("elevation.fov_windows",this.hass,{windows:S[0].label})}</span
                    >`:H`<span class="dim">${st("elevation.no_fov_today",this.hass)}</span>`}
            ${A?H`<span class="dim schedule">${A}</span>`:V}
          </span>
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${U`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(e=>U`
              <line class="grid" x1=${fi} y1=${l(e)} x2=${392} y2=${l(e)} />
              <text class="tick" x=${28} y=${l(e)+3} text-anchor="end">${e}°</text>
            `)}

            <!-- horizon -->
            <line class="horizon" x1=${fi} y1=${d} x2=${392} y2=${d} />

            <!-- elevation limit gridlines (single-window legacy path only) -->
            ${S.flatMap(e=>(e.limitLines??[]).map(e=>U`<line class="limit-line" x1=${fi} y1=${e} x2=${392} y2=${e} />`))}

            <!-- In-plot FOV bands: single-window legacy path only. -->
            ${f?V:S.flatMap(e=>e.inPlotBands.map(t=>U`<rect
                        class="fov-band"
                        x=${t.x0}
                        y=${t.y}
                        width=${t.x1-t.x0}
                        height=${t.height}
                        style=${e.inlineFill?`fill:${e.color}`:V}
                      />`))}

            <!-- Per-window FOV ribbon (multi-window only): one row per window,
                 a faint full-width track plus color-keyed bars for in-FOV runs,
                 sharing the plot's xAt() time scale. Overlaid as a band anchored
                 to the bottom of the plot; drawn BEFORE the curve so the blue
                 curve stays crisp on top. -->
            ${E.rows.flatMap((e,t)=>{const o=S[t],i=z+e.y,s=o.runs.length?o.d.entry_title:st("elevation.fov_window_named",this.hass,{name:o.d.entry_title,windows:st("elevation.no_fov_today",this.hass)}),n=U`<rect
                class="ribbon-track"
                x=${fi}
                y=${i}
                width=${360}
                height=${e.height}
                rx="2"
                ${xo(s)}
              ></rect>`,r=o.runBars.map(t=>U`<rect
                  class="ribbon-bar"
                  x=${t.x0}
                  y=${i}
                  width=${t.x1-t.x0}
                  height=${e.height}
                  rx="2"
                  style=${`fill:${o.color}`}
                  ${xo(st("elevation.fov_window_named",this.hass,{name:o.d.entry_title,windows:t.range}))}
                ></rect>`);return[n,...r]})}

            <!-- Schedule window overlay (issue #128): faint off-schedule gray
                 zone(s) + thin start/end bars with a clock-time tick. Rendered
                 PRE-CURVE so the sun curve and now-line paint on top. The tick
                 label sits slightly higher than the axis ticks (its own class)
                 so it doesn't read as an axis tick. -->
            ${x.map(e=>U`<rect
                class="off-schedule-zone"
                x=${e.x}
                y=${10}
                width=${e.width}
                height=${128}
              />`)}
            ${k.flatMap(e=>[U`<line
                class="schedule-bar"
                x1=${e.x}
                y1=${10}
                x2=${e.x}
                y2=${138}
                ${xo(e.tooltip)}
              ></line>`,U`<text
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
            <g class="now-group" ${xo(dt(r.toISOString(),i))}>
              <line class="now-hit" x1=${h} y1=${10} x2=${h} y2=${138} />
              <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />
            </g>
            ${null!==u?U`<circle class="sun-dot ${m}" cx=${h} cy=${u} r="4" />`:V}

            <!-- x-axis gridlines + time labels at every 6h, drawn last so the
                 axis sits on the topmost layer (nothing paints over the times).
                 Edge labels anchor inward (start at 00:00, end at 24:00) so they
                 don't clip past the viewBox. -->
            ${[0,6,12,18,24].map(e=>{const t=new Date(s.getTime()+36e5*e),o=0===e?"start":24===e?"end":"middle";return U`
                <line class="grid faint" x1=${a(t)} y1=${10} x2=${a(t)} y2=${138} />
                <text class="tick" x=${a(t)} y=${152} text-anchor=${o}>${e.toString().padStart(2,"0")}:00</text>
              `})}
          `}
        </svg>
      </div>
    `}_interpAt(e,t){if(0===e.length)return null;const o=t.getTime();if(o<=e[0].t.getTime())return e[0];if(o>=e[e.length-1].t.getTime())return e[e.length-1];for(let i=1;i<e.length;i++)if(e[i].t.getTime()>=o){const s=e[i-1],n=e[i],r=(o-s.t.getTime())/(n.t.getTime()-s.t.getTime());return{t:t,elevation:s.elevation+(n.elevation-s.elevation)*r,azimuth:s.azimuth+(n.azimuth-s.azimuth)*r}}return e[e.length-1]}};function xi(e,t){if(!0===e?.custom_position_minimum_mode&&Array.isArray(e.custom_position_slots)&&void 0!==e.custom_position_active_slot){const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);if(void 0!==t&&null!==t.position&&void 0!==t.position)return t.position}return t}function $i(e){if(void 0===e?.custom_position_active_slot||!Array.isArray(e.custom_position_slots))return!1;const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);return 100===t?.priority}function ki(e){const t=e.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(t))return"custom_position";switch(t){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return t}}function Ai(e,t,o,i=Pe,s="Safety"){const n=new Map;for(const t of e){if(!t.matched)continue;const e=ki(t.handler);Ie.includes(e)&&n.set(e,t)}const r=[...Ie].reverse().filter(e=>n.has(e));return 0===r.length?t.reason??"":r.map(e=>function(e,t,o,i,s){const n=i[e]??e,r=t.position,a=null==r?"":` ${nt(r)}`;if("custom_position"!==e)return`${n}${a}`.trimEnd();return`${o.custom_position_active_slot_name?`${n} · ${o.custom_position_active_slot_name}`:o.custom_position_active_slot?`${n} #${o.custom_position_active_slot}`:n}${a}${!0===o.custom_position_minimum_mode?" floor":""}${$i(o)?` · ${s}`:""}`}(e,n.get(e),t,i,s)).join(" → ")}wi.styles=a`
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
  `,e([ge({attribute:!1})],wi.prototype,"hass",void 0),e([ge({attribute:!1})],wi.prototype,"discoveredList",void 0),e([ge({attribute:!1})],wi.prototype,"coverColors",void 0),e([ge({type:Boolean,reflect:!0})],wi.prototype,"compact",void 0),wi=e([pe("acp-elevation-chart")],wi);let Si=class extends de{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this._tick=null,this.hideInactive=!1}disconnectedCallback(){super.disconnectedCallback(),this._syncTimer(!1)}updated(){const e=Boolean(this.hass&&this.discovered&&this._throttleNextAllowedIso());this._syncTimer(e)}_syncTimer(e){e&&null===this._tick?this._tick=setInterval(()=>this.requestUpdate(),1e3):e||null===this._tick||(clearInterval(this._tick),this._tick=null)}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),o=this.discovered?.entities;return ve(t,this.hass,[o?.decision_trace_sensor,o?.last_skipped_sensor])}_throttleNextAllowedIso(){const e=this.discovered.entities.last_skipped_sensor;if(!e)return null;const t=this.hass.states[e];if(!t||"time_delta_too_small"!==t.state)return null;const o=t.attributes,i=function(e,t){if(!e)return null;if(null==t||Number.isNaN(t))return null;const o=new Date(e).getTime();return Number.isNaN(o)?null:new Date(o+6e4*t).toISOString()}(o?.timestamp,o?.time_threshold_minutes);return i?new Date(i).getTime()<=Date.now()?null:i:null}_trace(){const e=this.discovered.entities.decision_trace_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=t.attributes;if(!o?.trace)return null;const i=new Map;for(const e of o.trace)i.set(ki(e.handler),{matched:e.matched,reason:e.reason,position:e.position,held_position:e.held_position});const s={};for(const[e,t]of Object.entries(Oe))s[e]=st(t,this.hass);return{winner:t.state,reason:o.reason??"",steps:i,enabledHandlers:o.enabled_handlers,summary:Ai(o.trace,o,t.state,s),inTimeWindow:o.in_time_window}}render(){if(!this.hass||!this.discovered)return V;const e=this._trace();if(!e)return H`<div class="placeholder">${st("decision.placeholder",this.hass)}</div>`;const t=this._throttleNextAllowedIso(),o=function(e){if(!e)return new Set;const t=new Set(e);return new Set(Ie.filter(e=>!t.has(e)))}(e.enabledHandlers),i=function(e,t,o,i,s=new Set){return e.filter(e=>e===o||!s.has(e)&&(!i||!0===t.get(e)?.matched))}(Ie,e.steps,e.winner,this.hideInactive,o);return H`
      <div class="wrap">
        <div class="head">
          <span class="label">${st("decision.pipeline",this.hass)}</span>
          <span class="winner">${st("decision.winner",this.hass,{name:e.winner})}</span>
        </div>
        ${!1===e.inTimeWindow?H`<div
              class="off-schedule"
              ${xo(st("decision.outside_schedule_tooltip",this.hass))}
            >
              ${st("decision.outside_schedule",this.hass)}
            </div>`:V}
        ${t?H`<div class="throttle-countdown">
              <ha-icon icon="mdi:timer-sand"></ha-icon>
              <span
                >${st("decision.next_change_in",this.hass,{time:ht(t,this.hass)})}</span
              >
            </div>`:V}
        ${this.showSummary&&e.summary?H`<div class="summary" ${xo(st("decision.summary_tooltip",this.hass))}>
              ${e.summary}
            </div>`:V}
        <div class="rows">
          ${i.map(t=>this._row(t,e.steps.get(t),e.winner===t))}
        </div>
        <div class="reason dim">${e.reason}</div>
      </div>
    `}_row(e,t,o){const i=t?.matched??!1,s=t?.reason??st("decision.not_evaluated",this.hass),n=t?.position,r=t?.held_position,a=null!=r,l=a?nt(r):null!=n?nt(n):"",c=a&&null!=n?H` · ${st("decision.solar_would_be",this.hass,{pct:nt(n)})}`:V;return H`
      <div class="row ${o?"winner":i?"match":"skip"}">
        <span class="name">${st(Oe[e],this.hass)}</span>
        <span class="dots" aria-hidden="true">${i?"████":"────"}</span>
        <span class="pos">${l}</span>
        <span class="reason-inline dim">${s}${c}</span>
        ${o?H`<span class="badge">✓</span>`:V}
      </div>
    `}};var Ci,Ei;Si.styles=a`
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
  `,e([ge({attribute:!1})],Si.prototype,"hass",void 0),e([ge({attribute:!1})],Si.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Si.prototype,"compact",void 0),e([ge({type:Boolean,reflect:!0,attribute:"show-summary"})],Si.prototype,"showSummary",void 0),e([ge({type:Boolean,reflect:!0,attribute:"hide-inactive"})],Si.prototype,"hideInactive",void 0),Si=e([pe("acp-decision-strip")],Si),function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Ci||(Ci={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ei||(Ei={}));const zi=["closed","locked","off"],Mi=(e,t,o,i)=>{i=i||{},o=null==o?{}:o;const s=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return s.detail=o,e.dispatchEvent(s),s},Ti=e=>{Mi(window,"haptic",e)},Ii=(e,t,o,i)=>{let s;"double_tap"===i&&o.double_tap_action?s=o.double_tap_action:"hold"===i&&o.hold_action?s=o.hold_action:"tap"===i&&o.tap_action&&(s=o.tap_action),((e,t,o,i)=>{if(i||(i={action:"more-info"}),!i.confirmation||i.confirmation.exemptions&&i.confirmation.exemptions.some(e=>e.user===t.user.id)||(Ti("warning"),confirm(i.confirmation.text||`Are you sure you want to ${i.action}?`)))switch(i.action){case"more-info":(o.entity||o.camera_image)&&Mi(e,"hass-more-info",{entityId:o.entity?o.entity:o.camera_image});break;case"navigate":i.navigation_path&&((e,t,o=!1)=>{o?history.replaceState(null,"",t):history.pushState(null,"",t),Mi(window,"location-changed",{replace:o})})(0,i.navigation_path);break;case"url":i.url_path&&window.open(i.url_path);break;case"toggle":o.entity&&(((e,t)=>{((e,t,o=!0)=>{const i=function(e){return e.substr(0,e.indexOf("."))}(t),s="group"===i?"homeassistant":i;let n;switch(i){case"lock":n=o?"unlock":"lock";break;case"cover":n=o?"open_cover":"close_cover";break;default:n=o?"turn_on":"turn_off"}e.callService(s,n,{entity_id:t})})(e,t,zi.includes(e.states[t].state))})(t,o.entity),Ti("success"));break;case"call-service":{if(!i.service)return void Ti("failure");const[e,o]=i.service.split(".",2);t.callService(e,o,i.service_data,i.target),Ti("success");break}case"fire-dom-event":Mi(e,"ll-custom",i)}})(e,t,o,s)};function Pi(e){return void 0!==e&&"none"!==e.action}function Oi(e,t){if(null==e)return t.entry_title;if("string"==typeof e)return e;if(Array.isArray(e)){const o=e.map(e=>function(e,t){if(e&&"object"==typeof e)switch(e.type){case"entry":return t.entry_title||void 0;case"area":return t.area_name||void 0;case"text":return e.text||void 0;default:return}}(e,t)).filter(e=>!!e);return o.length>0?o.join(" "):t.entry_title}return"object"==typeof e?t.entry_title:String(e)}function Ni(e){if(!e||"object"!=typeof e)return!1;const t=e.type;return"entry"===t||"area"===t||"text"===t&&"string"==typeof e.text}const Di=new Set(["cover_day_night_shade","cover_dual_panel"]);function Bi(e,t){if(!t)return!1;const o=e.states[t]?.attributes?.supported_features;return"number"==typeof o&&!!(128&o)}function Fi(e,t,o){return e.callService("switch",o?"turn_on":"turn_off",{},{entity_id:t})}const Ri={position:"set_position",tilt:"set_tilt"};function ji(e){const t=e.services;return!!t?.[Te]?.set_axes}function Li(e,t,o,i){if(ji(e)){const s={axes:o};return null!=i?.force&&(s.force=i.force),void e.callService(Te,"set_axes",s,{entity_id:t})}for(const[i,s]of Object.entries(o)){const o=Ri[i];o&&e.callService(Te,o,{[i]:s},{entity_id:t})}}const Ki=3;const Gi=[15,30,60,120];let Wi=class extends de{constructor(){super(...arguments),this.open=!1,this.presets=[],this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-extend-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}updated(e){e.has("open")&&this.open&&(this._endMs=void 0)}render(){if(!this.open)return V;const e=this._t("dialog.extend.title","Extend manual override");return H`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="title">${e}</div>

          ${this.presets.length>0?H`<div class="section">
                <div class="label">${this._t("dialog.extend.presets_label","Until")}</div>
                <div class="chips">
                  ${this.presets.map(e=>H`<button
                        class="preset"
                        type="button"
                        @click=${()=>this._pick(Date.parse(e.t))}
                      >
                        ${this._presetLabel(e)} · ${dt(e.t)}
                      </button>`)}
                </div>
              </div>`:V}

          <div class="section">
            <div class="label">${this._t("dialog.extend.relative_label","Add time")}</div>
            <div class="chips">
              ${Gi.map(e=>H`<button
                    class="rel"
                    type="button"
                    data-mins=${e}
                    @click=${()=>this._addRelative(e)}
                  >
                    +${e<60?`${e}m`:e/60+"h"}
                  </button>`)}
            </div>
          </div>

          <div class="section">
            <div class="label">${this._t("dialog.extend.absolute_label","End at")}</div>
            <input type="time" @change=${this._onTimeChange} />
          </div>

          <div class="preview">${this._previewText()}</div>

          <div class="actions">
            <button class="cancel" type="button" @click=${this._emitClose}>
              ${this._t("dialog.extend.cancel","Cancel")}
            </button>
            <button
              class="confirm"
              type="button"
              ?disabled=${void 0===this._endMs}
              @click=${this._onConfirm}
            >
              ${this._t("dialog.extend.confirm","Extend")}
            </button>
          </div>
        </div>
      </div>
    `}_t(e,t){if(!this.hass)return t;const o=st(e,this.hass);return o===e?t:o}_presetLabel(e){const t=`forecast.event.${e.kind}`,o=this.hass?st(t,this.hass):t;return o===t?e.label??e.kind:o}_previewText(){if(void 0===this._endMs)return"";const e=new Date(this._endMs).toISOString(),t=dt(e),o=new Date(this._endMs).getDate()!==(new Date).getDate()?this._t("dialog.extend.tomorrow_suffix"," (tomorrow)"):"";return`${this._t("dialog.extend.preview","Override until {time}").replace("{time}",`${t}${o}`)} · ${ht(e,this.hass)}`}_pick(e){this._endMs=e}_addRelative(e){const t=this._endMs??this.currentEndMs??Date.now();this._endMs=t+6e4*e}_onTimeChange(e){const t=e.target.value;if(!t)return;const[o,i]=t.split(":").map(Number);if(Number.isNaN(o)||Number.isNaN(i))return;const s=new Date,n=new Date(s);n.setHours(o,i,0,0),n.getTime()<=s.getTime()&&n.setDate(n.getDate()+1),this._endMs=n.getTime()}_onConfirm(){void 0!==this._endMs&&this.dispatchEvent(new CustomEvent("acp-extend-confirm",{detail:{endMs:this._endMs},bubbles:!0,composed:!0}))}};function Hi(e){if(null==e||""===e)return null;if("number"!=typeof e&&"string"!=typeof e)return null;const t="number"==typeof e?e:Number(e);return Number.isFinite(t)?Math.max(0,Math.min(100,t)):null}function Ui(e,t){if(!e||0===t.length)return[];const o=e.entities;let i=null;const s=()=>{const t=new Map;if(!o)return t;for(const[i,s]of Object.entries(o)){const o=s?.device_id;if(!o)continue;if(!i.startsWith("sensor."))continue;const n=e.states[i];if("battery"!==n?.attributes?.device_class)continue;const r=t.get(o);void 0!==r?null===Hi(e.states[r]?.state)&&null!==Hi(n.state)&&t.set(o,i):t.set(o,i)}return t},n=[];for(const r of t){const t=e.states[r];if(!t)continue;const a=Hi(t.attributes?.battery_level);if(null!==a){n.push({cover_id:r,source_id:r,level:a,charging:!0===t.attributes?.battery_charging});continue}const l=o?.[r]?.device_id;if(!l)continue;i??(i=s());const c=i.get(l);if(!c)continue;const d=e.states[c];n.push({cover_id:r,source_id:c,level:Hi(d?.state),charging:!0===d?.attributes?.battery_charging})}return n}function qi(e){return!!e&&(null===e.level||e.level<=20)}function Vi(e){let t=null;for(const o of e)t?null===o.level?t=null===t.level?t:o:null!==t.level&&o.level<t.level&&(t=o):t=o;return t}function Yi(e,t=!1){if(null===e)return"mdi:battery-alert-variant-outline";const o=Math.max(0,Math.min(10,Math.floor(e/10)));return 10===o?t?"mdi:battery-charging-100":"mdi:battery":0===o?t?"mdi:battery-charging-10":"mdi:battery-outline":t?"mdi:battery-charging-"+10*o:"mdi:battery-"+10*o}function Zi(e,t,o){return e.filter(e=>"off"===e||"group"===e||("solar"===e?function(e){return e.solarMatched&&!e.cloudIsWinner}(o)&&!1!==t?.solar:!1!==t?.[e]))}function Qi(e){return!!e&&e.some(e=>e.matched&&"solar"===ki(e.handler))}function Xi(e){const t=new Set;if(!e)return t;for(const o of e){if(!o.matched)continue;const e=ki(o.handler);Ie.includes(e)&&t.add(e)}return t}function Ji(e){return"cloud"===ki(e)}function es(e){if(!1===e.integrationEnabled)return"off";const t=ki(e.winner);return e.manualActive&&"force"!==t&&"custom_position"!==t?"manual":je[t]??"auto"}function ts(e,t){return{solarMatched:Qi(e),cloudIsWinner:Ji(t)}}Wi.styles=a`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 12px;
      padding: 16px;
      min-width: 280px;
      max-width: 92vw;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .title {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 12px;
    }
    .section {
      margin-bottom: 12px;
    }
    .label {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-bottom: 4px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chips button {
      font-family: inherit;
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: none;
      color: inherit;
      cursor: pointer;
    }
    .chips button:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    input[type='time'] {
      font-family: inherit;
      font-size: 0.9rem;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: none;
      color: inherit;
    }
    .preview {
      min-height: 1.2em;
      font-size: 0.8rem;
      opacity: 0.85;
      margin-bottom: 12px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .actions button {
      font-family: inherit;
      font-size: 0.85rem;
      padding: 6px 14px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      background: none;
      color: inherit;
    }
    .actions .confirm {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .actions .confirm[disabled] {
      opacity: 0.4;
      cursor: default;
    }
  `,e([ge({attribute:!1})],Wi.prototype,"hass",void 0),e([ge({type:Boolean})],Wi.prototype,"open",void 0),e([ge({attribute:!1})],Wi.prototype,"presets",void 0),e([ge({type:Number,attribute:!1})],Wi.prototype,"currentEndMs",void 0),e([me()],Wi.prototype,"_endMs",void 0),Wi=e([pe("acp-extend-override-dialog")],Wi);const os=new Set(["group_scene","group_lock","solar","default","motion"]);function is(e){if(!e)return[];const t=new Set;for(const o of Object.values(e)){if(!o)continue;const e=ki(o);os.has(e)||e in je&&t.add(e)}return Ie.filter(e=>t.has(e))}let ss=class extends de{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0,this.manualActive=!1,this.safetyActive=!1,this.resumable=!1,this.extendable=!1}render(){const e=this._kind(),t="custom_position"===e&&this.safetyActive,o=t?Ke.force:Ke[e],i=this.hass?st(Ge[e],this.hass):Ke[e].label,s=t?this.hass?st("badge.safety",this.hass):"Safety":this._label(e,i),n=t?We.force:We[e],r=this._hint(e,t);if(this.extendable){const t=this.hass?st("tile.extend_aria",this.hass):"Extend manual override",i=this.hass?st("tile.resume_aria",this.hass):"Resume automatic control",a=!!n&&!this.compact;return H`<span
        class="badge kind-${e} has-actions"
        style="background:${o.bg};color:${o.fg};"
        part="badge"
      >
        ${a?H`<ha-icon class="badge-icon" icon=${n}></ha-icon>`:V}
        <span class="badge-label" ${r?xo(r):V}>${s}</span>
        <button
          class="act extend"
          type="button"
          ${xo(t)}
          aria-label=${t}
          @click=${this._onExtendClick}
          @pointerdown=${this._stop}
        >
          <ha-icon icon="mdi:clock-plus-outline"></ha-icon>
        </button>
        ${this.resumable?H`<button
              class="act resume"
              type="button"
              ${xo(i)}
              aria-label=${i}
              @click=${this._onResumeClick}
              @pointerdown=${this._stop}
            >
              <ha-icon icon="mdi:restore"></ha-icon>
            </button>`:V}
      </span>`}const a=H`${n?H`<ha-icon class="badge-icon" icon=${n}></ha-icon>`:V}${s}${this.resumable?H`<ha-icon class="resume-icon" icon="mdi:restore"></ha-icon>`:V}`;if(this.resumable){const t=this.hass?st("tile.resume_aria",this.hass):"Resume automatic control",i=r?`${r} — ${t}`:t;return H`<button
        class="badge kind-${e} resumable"
        style="background:${o.bg};color:${o.fg};"
        part="badge"
        type="button"
        ${xo(i)}
        aria-label=${t}
        @click=${this._onResumeClick}
        @pointerdown=${this._stop}
      >
        ${a}
      </button>`}return H`<span
      class="badge kind-${e}"
      style="background:${o.bg};color:${o.fg};"
      part="badge"
      ${r?xo(r):V}
      >${a}</span
    >`}_hint(e,t){if(t)return this._tip("safety");if("manual"===e){const e=this.manualEndIso?dt(this.manualEndIso):null;return e&&"—"!==e?this._tip("manual_until",{time:e}):this._tip("manual")}return"custom_position"===e?this._customPositionHint():"group"===e&&void 0!==this.groupCount&&void 0!==this.groupTotal?st("group.who_won",this.hass,{count:this.groupCount,total:this.groupTotal}):this._tip(e)}_customPositionHint(){const e=[this._tip("custom_position")],t=this.slotName??(void 0!==this.slotNumber?`#${this.slotNumber}`:null);return t&&e.push(this._tip("custom_position_slot",{name:t})),void 0!==this.pct&&null!==this.pct&&e.push(this._tip("custom_position_value",{pct:Math.round(this.pct)})),!0===this.minimumMode&&e.push(this._tip("custom_position_floor")),e.filter(e=>null!==e).join(" ")}_tip(e,t){const o=`badge.tip.${e}`,i=st(o,this.hass,t);return i===o?null:i}_stop(e){e.stopPropagation()}_onResumeClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-resume",{bubbles:!0,composed:!0}))}_onExtendClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-extend",{bubbles:!0,composed:!0}))}_kind(){return this.kindOverride??es({winner:this.winner,integrationEnabled:this.integrationEnabled,manualActive:this.manualActive})}_label(e,t){return"manual"===e?this.manualEndIso?dt(this.manualEndIso):t:"custom_position"===e?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${t} #${this.slotNumber}`:t}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?this.hass?st("badge.floor_suffix",this.hass):" ↥":""}`:"group"===e?void 0===this.groupCount||void 0===this.groupTotal?t:`${this.groupCount}/${this.groupTotal}`:t}};ss.styles=a`
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
    /* Floating-tooltip cursor lifecycle, and it MUST be declared here rather
       than inherited. The hosts that render badges make themselves clickable
       (the tile card sets cursor: pointer on .tile-body), cursor is an
       inherited property, and inheritance crosses the shadow boundary through
       the host element — so without a rule of its own every badge showed a
       pointer while the floor chip and title beside it showed the help cursor
       from the tile card's own [data-tooltip] rule. A shadow root has to
       restate this pair; it cannot borrow its host's.

       Scoped to the NON-interactive anchors, mirroring header-pill's
       .pill.readonly precedent: a resumable badge is a real button and keeps
       cursor: pointer from the rule below, as do the Extend/Resume glyphs. The
       .badge-label carrier is the two-button variant's label, which is inert. */
    span.badge[data-tooltip]:hover,
    .badge-label[data-tooltip]:hover {
      cursor: help;
    }
    span.badge[data-tooltip][acp-tt-shown],
    .badge-label[data-tooltip][acp-tt-shown] {
      cursor: default;
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
    .badge.has-actions {
      /* Deliberately the same 4px every other badge uses. Only the Extend/Resume
         pair needs extra separation (see .act + .act) — and gap is a *container*
         property, so widening it here would re-space badge-icon/badge-label and
         badge-label/Extend as collateral. This container has 4 children normally
         and 3 in compact, so a widened gap costs 3x / 2x what the pair actually
         needs and leaves this badge spaced looser than every other badge for no
         functional reason. Scope the spacing to the pair instead. */
      gap: 4px;
    }
    .act {
      background: none;
      border: none;
      /* WCAG 2.2 SC 2.5.8 wants a 24px-minimum target. With zero padding the
         button box *is* the 14px glyph, so Resume and Extend become two sub-24px
         targets 4px apart on a touch tile — mis-tapping "extend the override"
         for "cancel the override". The padding grows the target to 24px and the
         matching negative margin pulls the box back onto the glyph's original
         footprint, so the badge lays out exactly as it did before. Padding and
         margin must stay equal and opposite, and sum with the glyph to 24. */
      box-sizing: border-box;
      padding: 5px;
      margin: -5px;
      min-width: 24px;
      min-height: 24px;
      color: inherit;
      font: inherit;
      line-height: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.85;
      --mdc-icon-size: 14px;
    }
    .act:hover {
      opacity: 1;
    }
    :host([compact]) .act {
      /* Smaller glyph, same 24px target — so the padding takes up the slack. */
      --mdc-icon-size: 12px;
      padding: 6px;
      margin: -6px;
    }
    .act + .act {
      /* The negative margin on .act shrinks its *margin* box back to the glyph,
         but its 24px *border* box — the box that hit-tests — still bleeds padding
         px past that on every side. Left alone the two action buttons overlap, and
         Resume (later in DOM order, no z-index on either) paints last and wins,
         turning taps on the Extend glyph into "cancel the override".

         Separation between the two border boxes is
             Extend margin-right + container gap + Resume margin-left
           = -5 + 4 + margin-left
         so margin-left must be >= 1px to reach zero overlap; at 1px they abut
         exactly and both buttons get a true, unshared 24px target. This is NOT
         the "gap >= 2 x padding" the container-gap approach needed: overriding
         margin-left cancels this button's own negative margin instead of adding
         separation on top of it, so the number is much smaller. Only Resume
         matches — Extend follows the label, not an .act, and keeps its -5px.
         Costs 6px of badge width (margin-left -5 to 1), and unlike a widened
         container gap it costs it once rather than on every child boundary.
         Keep in sync with the padding on .act. */
      margin-left: 1px;
    }
    :host([compact]) .act + .act {
      /* Compact .act pads 6px a side, so zero overlap needs -6 + 4 + 2 = 0, i.e.
         margin-left >= 2px. NOT redundant with the rule above: ":host([compact])
         .act" is specificity (0,3,0) and its margin shorthand would re-clobber
         that (0,2,0) margin-left straight back to -6px. This selector is (0,4,0)
         and wins. Costs 8px of badge width (-6 to 2) — the compact has-actions
         branch already drops the kind icon and the "Manual · " prefix to buy that
         room back. */
      margin-left: 2px;
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
  `,e([ge({attribute:!1})],ss.prototype,"hass",void 0),e([ge()],ss.prototype,"winner",void 0),e([ge({attribute:"manual-end-iso"})],ss.prototype,"manualEndIso",void 0),e([ge({type:Number,attribute:"slot-number"})],ss.prototype,"slotNumber",void 0),e([ge({attribute:"slot-name"})],ss.prototype,"slotName",void 0),e([ge({type:Number})],ss.prototype,"pct",void 0),e([ge({type:Boolean,attribute:"minimum-mode"})],ss.prototype,"minimumMode",void 0),e([ge({type:Boolean,reflect:!0})],ss.prototype,"compact",void 0),e([ge({type:Boolean,attribute:"integration-enabled"})],ss.prototype,"integrationEnabled",void 0),e([ge({type:Boolean,attribute:"manual-active"})],ss.prototype,"manualActive",void 0),e([ge({type:Boolean,attribute:"safety-active"})],ss.prototype,"safetyActive",void 0),e([ge({attribute:"kind-override"})],ss.prototype,"kindOverride",void 0),e([ge({type:Number,attribute:"group-count"})],ss.prototype,"groupCount",void 0),e([ge({type:Number,attribute:"group-total"})],ss.prototype,"groupTotal",void 0),e([ge({type:Boolean,reflect:!0})],ss.prototype,"resumable",void 0),e([ge({type:Boolean,reflect:!0})],ss.prototype,"extendable",void 0),ss=e([pe("acp-tile-badge")],ss);let ns=class extends de{constructor(){super(...arguments),this.actual=null,this.target=null,this.coverColor=null,this.compact=!1,this.disabled=!1,this.layout="cover",this.label=null,this.min=0,this.max=100,this.unit="%",this.hintKey=null,this.targetHintKey=null,this._dragValue=null,this.openBlocksSun=!0,this._onPointerDown=e=>{if(this.disabled)return;const t=e.currentTarget;t.setPointerCapture?.(e.pointerId),this._dragValue=this._valueFromEvent(e,t)},this._onPointerMove=e=>{this.disabled||null===this._dragValue||(this._dragValue=this._valueFromEvent(e,e.currentTarget))},this._onPointerEnd=()=>{this._dragValue=null}}_frac(e){if(null==e||Number.isNaN(e))return 0;const t=this.max-this.min;if(0===t)return 0;const o=(e-this.min)/t*100,i=Math.max(0,Math.min(100,o));return this.openBlocksSun?i:100-i}render(){if(!this.hass)return V;const e=null!==this._dragValue,t=this._dragValue??this.actual,o=this._frac(t),i=this._frac(this.target),s=this.label??st("covers.tilt_title",this.hass);return H`
      <div
        class="row ${this.layout}"
        style=${this.coverColor?`--acp-cover-color:${this.coverColor}`:V}
      >
        <span class="label">${s}</span>
        <span class="num">${nt(t)}</span>
        <div
          class="track ${this.disabled?"disabled":""}${e?" dragging":""}"
          role="slider"
          tabindex=${this.disabled?-1:0}
          aria-disabled=${this.disabled?"true":"false"}
          aria-valuemin=${this.min}
          aria-valuemax=${this.max}
          aria-valuenow=${null===t?this.min:this.openBlocksSun?t:this.min+this.max-t}
          aria-valuetext=${nt(t)}
          aria-label=${s}
          @click=${this._onClick}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerEnd}
          @pointercancel=${this._onPointerEnd}
          @keydown=${this._onKeydown}
          ${xo(st(this.hintKey??"covers.tilt_click_to_set",this.hass))}
        >
          <div class="fill" style="width:${o}%"></div>
          <div class="fill-closed" style="width:${100-o}%"></div>
          ${null!==this.target?H`<div
                class="marker"
                style="left:clamp(1px, ${i}%, calc(100% - 1px))"
                ${xo(st(this.targetHintKey??"covers.tilt_target_tooltip",this.hass,{pct:this.target}))}
              ></div>`:V}
        </div>
      </div>
    `}_valueFromEvent(e,t){const o=t.getBoundingClientRect(),i=(e.clientX-o.left)/o.width,s=this.openBlocksSun?i:1-i,n=this.min+s*(this.max-this.min);return this._clamp(n)}_clamp(e){return Math.max(this.min,Math.min(this.max,Math.round(e)))}_commit(e){this.dispatchEvent(new CustomEvent("acp-tilt-set",{detail:e,bubbles:!0,composed:!0}))}_onClick(e){this.disabled||this._commit(this._valueFromEvent(e,e.currentTarget))}_onKeydown(e){if(this.disabled)return;const t=this.openBlocksSun?1:-1,o=this.openBlocksSun?this.min:this.max,i=this.openBlocksSun?this.max:this.min,s=this.actual??o;let n;switch(e.key){case"ArrowRight":case"ArrowUp":n=s+t;break;case"ArrowLeft":case"ArrowDown":n=s-t;break;case"PageUp":n=s+10*t;break;case"PageDown":n=s-10*t;break;case"Home":n=o;break;case"End":n=i;break;default:return}e.preventDefault(),this._commit(this._clamp(n))}};function rs(e,t){const o=[],i=[];for(const s of Object.values(e))"number"!=typeof s||Number.isNaN(s)||(o.push(ft(s,t)),i.push(s));if(0===o.length)return null;o.sort((e,t)=>e-t),i.sort((e,t)=>e-t);const s=o.filter((e,t)=>0===t||e!==o[t-1]);return{min:o[0],max:o[o.length-1],ticks:s,readable:o.length,aligned:o[0]===o[o.length-1],logicalMin:i[0],logicalMax:i[i.length-1]}}ns.styles=a`
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
      /* Must stay identical to acp-cover-bar's .cover grid — these are two
         separate grids stacked in one .cover-group, so any divergence offsets
         this track from the position track directly above it. Fixed, not
         minmax: an auto track resolves per-grid to its own content.

         The 22px column is the position row's go-to-target button. This row has
         no counterpart — the button drives the POSITION axis, and a tilt target
         is a separate value — so the column is present here purely as a spacer
         to keep the two tracks aligned. */
      grid-template-columns: minmax(80px, 1fr) 11ch 3fr 22px 16px;
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
    /* Track mirrors the position bar: the LEADING segment carries the
       sun-blocking portion and is solid, the trailing clear portion is pale —
       same hue as the cover wedge. The leading segment is sized from the drawn
       fraction, so on a mirrored axis it is the closed end. */
    .track {
      position: relative;
      display: flex;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
      /* A touch-drag must move the fill, not scroll the page — own the gesture. */
      touch-action: none;
    }
    .track:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    /* The 0.3s ease below smooths server-driven updates; during a drag it would
       read as the fill lagging behind the finger, so drop it for the gesture. */
    .track.dragging .fill,
    .track.dragging .fill-closed {
      transition: none;
    }
    :host([compact]) .track,
    .row.tile .track {
      height: 6px;
    }
    /* Unavailable cover (issue #212): non-interactive track — no click-to-set,
       matching the up/stop/down controls disabled elsewhere on the tile. */
    .track.disabled {
      cursor: default;
      touch-action: auto;
    }
    .fill {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 50%, transparent);
      transition: width 0.3s ease;
    }
    .fill-closed {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 18%, transparent);
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
  `,e([ge({attribute:!1})],ns.prototype,"hass",void 0),e([ge({attribute:!1})],ns.prototype,"actual",void 0),e([ge({attribute:!1})],ns.prototype,"target",void 0),e([ge({attribute:!1})],ns.prototype,"coverColor",void 0),e([ge({type:Boolean,reflect:!0})],ns.prototype,"compact",void 0),e([ge({type:Boolean,reflect:!0})],ns.prototype,"disabled",void 0),e([ge({reflect:!0})],ns.prototype,"layout",void 0),e([ge({attribute:!1})],ns.prototype,"label",void 0),e([ge({type:Number})],ns.prototype,"min",void 0),e([ge({type:Number})],ns.prototype,"max",void 0),e([ge()],ns.prototype,"unit",void 0),e([ge({attribute:!1})],ns.prototype,"hintKey",void 0),e([ge({attribute:!1})],ns.prototype,"targetHintKey",void 0),e([me()],ns.prototype,"_dragValue",void 0),e([ge({type:Boolean})],ns.prototype,"openBlocksSun",void 0),ns=e([pe("acp-axis-bar")],ns),customElements.get("acp-tilt-bar")||customElements.define("acp-tilt-bar",class extends ns{});const as={status:"unknown",on:0,total:0};let ls=null,cs=null;function ds(e,t,o){if(!t||0===o.length)return as;const i=function(e){if(ls===e&&cs)return cs;const t=new Map;for(const o of e){if(o.platform!==Te)continue;const e=o.config_entry_id;if(!e)continue;const i=`${e}_`;if(!o.unique_id.startsWith(i))continue;const s=o.unique_id.slice(i.length),n=o.entity_id.split(".")[0],r=et[`${n}:${s}`];if("target_position_sensor"!==r&&"automatic_control_switch"!==r&&"integration_enabled_switch"!==r)continue;const a=t.get(e)??{};"target_position_sensor"===r?a.positionSensor=o.entity_id:"automatic_control_switch"===r?a.automaticControl=o.entity_id:a.integrationEnabled=o.entity_id,t.set(e,a)}return ls=e,cs=t,t}(t),s=new Map;for(const[t,o]of i){if(!o.positionSensor)continue;const i=e.states[o.positionSensor]?.attributes?.actual_positions;if(i)for(const e of Object.keys(i))s.set(e,t)}const n=new Map;let r=0,a=0;for(const t of new Set(o)){const o=s.get(t);if(!o)continue;let l=n.get(o);void 0===l&&(l=hs(e,i.get(o)),n.set(o,l)),null!==l&&(a++,l&&r++)}return 0===a?as:{status:r===a?"all":0===r?"none":"some",on:r,total:a}}function hs(e,t){if(!t?.automaticControl)return null;const o=e.states[t.automaticControl];if(!o)return null;const i=!t.integrationEnabled||"off"!==e.states[t.integrationEnabled]?.state;return"on"===o.state&&i}const ps=["auto","all_open","all_closed","privacy"],us=["open","closed","mixed","unknown"];function _s(e,t){const o=t.entities,i=o.group_position_sensor?e.states[o.group_position_sensor]:void 0,s=i?parseFloat(i.state):NaN,n=i?.attributes?.member_positions??{},r=o.group_who_won_sensor?e.states[o.group_who_won_sensor]:void 0,a=r?.attributes?.member_winners,l=o.group_state_sensor?e.states[o.group_state_sensor]?.state??"unknown":"unknown",c=o.group_scene_select?e.states[o.group_scene_select]:void 0,d=c?.attributes?.current_option??c?.state??"auto",h=new Set;for(const t of Object.keys(n)){const o=e.states[t]?.attributes?.device_class;o&&h.add(o)}const p=o.group_cover,u=Bi(e,p);return{position:Number.isNaN(s)?null:s,memberPositions:n,rosterTotal:Object.keys(n).length,whoWonCount:r?parseInt(r.state,10):NaN,memberWinners:a,aggregate:us.includes(l)?l:"unknown",scene:ps.includes(d)?d:"auto",locked:!!o.group_lock_switch&&"on"===e.states[o.group_lock_switch]?.state,automationOn:!o.group_automation_switch||"on"===e.states[o.group_automation_switch]?.state,memberAutomation:ds(e,Io(),Object.keys(a??{})),lockId:o.group_lock_switch,automationId:o.group_automation_switch,clearId:o.group_clear_overrides_button,target:p??o.group_position_sensor,deviceClass:1===h.size?[...h][0]:void 0,tilt:p&&u?{entityId:p,value:e.states[p]?.attributes?.current_tilt_position??null}:void 0}}function gs(e,t){return ut({deviceClass:e.deviceClass,coverType:"",position:t})}const ms=new Set(["manual","force"]),vs=new Set(["force","weather","group_scene","manual","group_lock","custom_position"]);function fs(e,t,o){t.target&&function(e,t,o){const i={position:o};e.callService(Te,"group_set_position",i,{entity_id:t})}(e,t.target,o)}function bs(e,t,o){o.target&&function(e,t,o=[]){const i=e.services;i?.[Te]?.group_stop?e.callService(Te,"group_stop",{},{entity_id:t}):0!==o.length&&e.callService("cover","stop_cover",{},{entity_id:o})}(e,o.target,t.managed_covers??[])}function ys(e,t,o){t.tilt&&function(e,t,o){e.callService("cover","set_cover_tilt_position",{tilt_position:o},{entity_id:t})}(e,t.tilt.entityId,o)}let ws=class extends de{constructor(){super(...arguments),this.position=null,this.enabled=!0,this.labels="tile",this.compact=!1,this.fill=!1}render(){const e=null!==this.position&&this.position>=100,t=null!==this.position&&this.position<=0;return H`
      <div class="move-buttons">
        <button
          class="up"
          type="button"
          aria-label=${st(`${this.labels}.open`,this.hass)}
          ?disabled=${!this.enabled||e}
          @click=${()=>this._emit("open")}
        >
          <ha-icon icon=${_t(this.deviceClass)}></ha-icon>
        </button>
        <button
          class="stop"
          type="button"
          aria-label=${st(`${this.labels}.stop`,this.hass)}
          ?disabled=${!this.enabled}
          @click=${()=>this._emit("stop")}
        >
          <ha-icon icon="mdi:stop"></ha-icon>
        </button>
        <button
          class="down"
          type="button"
          aria-label=${st(`${this.labels}.close`,this.hass)}
          ?disabled=${!this.enabled||t}
          @click=${()=>this._emit("close")}
        >
          <ha-icon icon=${gt(this.deviceClass)}></ha-icon>
        </button>
      </div>
    `}_emit(e){this.dispatchEvent(new CustomEvent("acp-move",{detail:e,bubbles:!0,composed:!0}))}};ws.styles=a`
    :host {
      display: contents;
    }
    .move-buttons {
      display: inline-flex;
      align-items: center;
      /* --feature-button-spacing */
      gap: 12px;
    }
    :host([fill]) .move-buttons {
      width: 100%;
    }
    :host([compact]) .move-buttons {
      gap: 6px;
    }
    .move-buttons button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 0;
      font-size: 0.8rem;
      line-height: 1;
      /* Square at HA's inline-feature thickness by default, matching the cover
         tile's detailed control row — see that rule for the upstream token
         trail. Only [fill] flex-fills; see the property doc for why. */
      width: var(--control-button-group-thickness, 36px);
      height: var(--control-button-group-thickness, 36px);
      border-radius: var(--control-button-border-radius, 12px);
      border: none;
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 20%,
        transparent
      );
      cursor: pointer;
    }
    /* The two overrides let a narrow host opt back out of filling without
       needing to drop the [fill] attribute reactively — see the group tile's
       container query. Custom properties inherit through the shadow boundary. */
    :host([fill]) .move-buttons button {
      flex: var(--acp-move-button-flex, 1 1 0);
      width: var(--acp-move-button-width, auto);
    }
    :host([compact]) .move-buttons button {
      width: 40px;
      height: 32px;
      border-radius: 8px;
    }
    .move-buttons button ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-text-color);
      line-height: 0;
    }
    :host([compact]) .move-buttons button ha-icon {
      --mdc-icon-size: 18px;
    }
    .move-buttons button:hover:not(:disabled) {
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 32%,
        transparent
      );
    }
    .move-buttons button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,e([ge({attribute:!1})],ws.prototype,"hass",void 0),e([ge({attribute:!1})],ws.prototype,"position",void 0),e([ge({attribute:!1})],ws.prototype,"deviceClass",void 0),e([ge({type:Boolean})],ws.prototype,"enabled",void 0),e([ge()],ws.prototype,"labels",void 0),e([ge({type:Boolean,reflect:!0})],ws.prototype,"compact",void 0),e([ge({type:Boolean,reflect:!0})],ws.prototype,"fill",void 0),ws=e([pe("acp-cover-move-buttons")],ws);const xs={all:"mdi:robot",some:"mdi:robot-outline",none:"mdi:robot-off"};let $s=class extends de{constructor(){super(...arguments),this.showSceneSelect=!0,this.showLock=!0,this.showAutomation=!0,this.showClearOverrides=!0}render(){if(!this.hass||!this.discovered||!this.snapshot)return V;const e=this.snapshot,t=this.showClearOverrides?e.clearId:void 0,o=this.showLock&&!!e.lockId,i=this.showAutomation&&!!e.automationId,s=this.showSceneSelect&&!!this.discovered.entities.group_scene_select;if(!(s||o||i||t))return V;const n=function(e){if(!e)return!0;const t=Object.values(e);return 0!==t.length&&t.some(e=>!e||vs.has(ki(e)))}(e.memberWinners);return H`
      <div class="group-row" @click=${this._stop} @pointerdown=${this._stop} @keydown=${this._stop}>
        ${s?H`<select
              class="scene-select"
              aria-label=${st("group.scene",this.hass)}
              @change=${this._onSceneChange}
            >
              ${ps.map(t=>H`<option value=${t} ?selected=${t===e.scene}>
                    ${st(`group.scene_${t}`,this.hass)}
                  </option>`)}
            </select>`:V}
        ${o?H`<button
              class="ctrl lock-toggle ${e.locked?"active":""}"
              type="button"
              aria-pressed=${e.locked?"true":"false"}
              aria-label=${st(e.locked?"group.unlock":"group.lock",this.hass)}
              ${xo(st(e.locked?"group.unlock":"group.lock",this.hass))}
              @click=${()=>function(e,t,o){const i=t.entities.group_lock_switch;i&&Fi(e,i,!o)}(this.hass,this.discovered,e.locked)}
            >
              <ha-icon icon=${e.locked?"mdi:lock":"mdi:lock-open-variant"}></ha-icon>
            </button>`:V}
        ${i?this._automationButton(this._automationView(e)):V}
        ${t?H`<button
              class="ctrl clear-overrides"
              type="button"
              aria-label=${st("group.clear_overrides",this.hass)}
              ?disabled=${!n}
              ${xo(st(n?"group.clear_overrides":"group.clear_overrides_none",this.hass))}
              @click=${()=>{return e=this.hass,o=t,void e.callService("button","press",{},{entity_id:o});var e,o}}
            >
              <ha-icon icon="mdi:backup-restore"></ha-icon>
            </button>`:V}
      </div>
    `}_automationView(e){const t=st("group.automation",this.hass),o=e.memberAutomation.status;if("unknown"===o)return{cls:e.automationOn?"active":"",icon:e.automationOn?xs.all:xs.none,ariaPressed:e.automationOn?"true":"false",label:t,on:e.automationOn};const i="all"===o,s=st("group.automation_count",this.hass,{count:e.memberAutomation.on,total:e.memberAutomation.total});return{cls:`auto-${o}`,icon:xs[o],ariaPressed:"some"===o?"mixed":i?"true":"false",label:`${t} — ${s}`,on:i}}_automationButton(e){return H`<button
      class="ctrl automation-toggle ${e.cls}"
      type="button"
      aria-pressed=${e.ariaPressed}
      aria-label=${e.label}
      ${xo(e.label)}
      @click=${()=>function(e,t,o){const i=t.entities.group_automation_switch;i&&Fi(e,i,!o)}(this.hass,this.discovered,e.on)}
    >
      <ha-icon icon=${e.icon}></ha-icon>
    </button>`}_onSceneChange(e){!function(e,t,o){const i=t.entities.group_scene_select;i&&function(e,t,o){e.callService("select","select_option",{option:o},{entity_id:t})}(e,i,o)}(this.hass,this.discovered,e.target.value)}_stop(e){e.stopPropagation()}};var ks;$s.styles=a`
    :host {
      display: block;
    }
    .group-row {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: default;
    }
    .scene-select {
      flex: 1 1 auto;
      min-width: 0;
      padding: 4px 6px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      font-size: 0.85rem;
    }
    .ctrl {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 0;
      width: 40px;
      height: 36px;
      border: none;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .ctrl:hover:not(:disabled) {
      filter: brightness(0.95);
    }
    .ctrl.active {
      background: rgba(63, 81, 181, 0.2);
      color: #283593;
    }
    /* Automation status (3 colors), speaking the same language as the badges
       sitting inches away on the same tile: green = the pipeline owns this (the
       auto / group badge), amber = a human has partly taken over (the manual
       badge), grey = deliberately off, not a fault. Red is left alone: it already
       means force / weather / glare in this card.

       The glyph color is mixed toward --primary-text-color rather than used raw.
       HA's --success-color / --warning-color defaults (#4caf50, #ffa600) sit
       around 1.7-2.3:1 over these tints — under the 3:1 WCAG 1.4.11 floor for
       meaningful non-text content, since glyph and backdrop share a hue. Because
       that token is near-black in a light theme and near-white in a dark one,
       one rule darkens the glyph on a light pill and lightens it on a dark one:
       ~4.6:1 and ~3.5:1 over the light tints, higher on dark, and it cannot
       invert on a theme we have not seen.

       The tints stay. They are what makes an engaged control look engaged — the
       same job .active does on lock — and dropping them left the all-automated
       state with no pressed affordance plus a visible un-highlight on every
       load, since the button paints the tinted unresolved fallback until the
       registry cache warms. */
    .ctrl.auto-all {
      background: rgba(76, 175, 80, 0.18);
      color: color-mix(in srgb, var(--success-color, #4caf50) 60%, var(--primary-text-color));
    }
    .ctrl.auto-some {
      background: rgba(255, 152, 0, 0.22);
      color: color-mix(in srgb, var(--warning-color, #ffa600) 60%, var(--primary-text-color));
    }
    /* Off is the resting state, so it takes the resting look — and the untinted
       fallback for a latch that reads off, so that path never flashes either. */
    .ctrl.auto-none {
      color: var(--secondary-text-color);
    }
    .ctrl:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .ctrl ha-icon {
      --mdc-icon-size: 20px;
    }
  `,e([ge({attribute:!1})],$s.prototype,"hass",void 0),e([ge({attribute:!1})],$s.prototype,"discovered",void 0),e([ge({attribute:!1})],$s.prototype,"snapshot",void 0),e([ge({type:Boolean})],$s.prototype,"showSceneSelect",void 0),e([ge({type:Boolean})],$s.prototype,"showLock",void 0),e([ge({type:Boolean})],$s.prototype,"showAutomation",void 0),e([ge({type:Boolean})],$s.prototype,"showClearOverrides",void 0),$s=e([pe("acp-group-controls-row")],$s);let As=ks=class extends de{constructor(){super(...arguments),this.showControls=!0,this.showPositionBar=!0,this.showTilt=!0,this.showSceneSelect=!0,this.showLock=!0,this.showAutomation=!0,this.showClearOverrides=!0,this.showMemberBadges=!0,this.stateColor=!0,this.iconInteractive=!1,this._posDrag=null,this._openMoreInfo=()=>{this.dispatchEvent(new CustomEvent("acp-open-more-info",{bubbles:!0,composed:!0}))},this._onIconClick=e=>{this.iconInteractive&&(e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-icon-action",{bubbles:!0,composed:!0})))},this._onIconKeydown=e=>{this.iconInteractive&&("Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._onIconClick(e)))},this._onBodyKeydown=e=>{e.target===e.currentTarget&&("Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openMoreInfo()))},this._posDownX=null,this._posMoved=!1,this._onPosPointerMove=e=>{null!==this._posDownX&&(e.stopPropagation(),Math.abs(e.clientX-this._posDownX)>=ks.DRAG_THRESHOLD_PX&&(this._posMoved=!0),this._posMoved&&(this._posDrag=ft(this._pctFromEvent(e,e.currentTarget),At(this.discovered))))},this._onPosPointerEnd=(e,t)=>{e.stopPropagation();const o=this._posDrag,i=this._posMoved;this._posDrag=null,this._posDownX=null,this._posMoved=!1,i&&null!==o&&t.target&&fs(this.hass,t,o)},this._onPosCancel=e=>{e.stopPropagation(),this._posDrag=null,this._posDownX=null,this._posMoved=!1}}render(){if(!this.hass||!this.discovered)return V;const e=_s(this.hass,this.discovered),t=st(`group.state_${e.aggregate}`,this.hass),o=this._posDrag??e.position,i=At(this.discovered),s=null===o?0:ft(o,i),n=this.stateColor?vt(e.aggregate):"",r=!!e.target,a=rs(e.memberPositions,i),l=null!==this._posDrag,c=function(e,t){let o=0;for(const[i,s]of Object.entries(t.memberPositions)){const t=e.states[i];(null===s||void 0!==t&&at(t.state))&&(o+=1)}if(o>0)return{kind:"unavailable",count:o};const i=t.memberWinners;if(!i)return null;let s=0;for(const e of Object.values(i))e&&ms.has(ki(e))&&(s+=1);return s>0?{kind:"held",count:s}:null}(this.hass,e),d=l?nt(o):c?st(`group.exception_${c.kind}`,this.hass,{count:c.count}):a?a.aligned?nt(a.logicalMin):st("group.range",this.hass,{min:Math.round(a.logicalMin),max:Math.round(a.logicalMax)}):nt(o),h=this.showMemberBadges?is(e.memberWinners):[];return H`
      <div
        class=${"group-tile"+(this.showControls?" has-controls":"")}
        role="button"
        tabindex="0"
        @click=${this._openMoreInfo}
        @keydown=${this._onBodyKeydown}
      >
        <div
          class=${"cover-icon-wrap"+(this.iconInteractive?" background":"")}
          role=${this.iconInteractive?"button":V}
          tabindex=${this.iconInteractive?0:V}
          aria-label=${this.iconInteractive?st("tile.icon_action_label",this.hass):V}
          style=${n?`--acp-tile-icon-color: ${n}`:V}
          @click=${this._onIconClick}
          @keydown=${this._onIconKeydown}
        >
          <ha-icon
            class="cover-icon"
            icon=${this.icon??gs(e,o)}
            style=${n?`color: ${n}`:""}
          ></ha-icon>
        </div>

        <div class="label">
          <div class="title">${this.name??this.discovered.entry_title}</div>
          <div class="state">${t} · ${d}</div>
        </div>

        ${this.showControls?H`<div
              class="controls"
              @click=${this._stop}
              @pointerdown=${this._stop}
              @keydown=${this._stop}
            >
              <acp-cover-move-buttons
                fill
                labels="group"
                .hass=${this.hass}
                .position=${e.position}
                .deviceClass=${e.deviceClass}
                .enabled=${r}
                @acp-move=${t=>this._move(t,e)}
              ></acp-cover-move-buttons>
            </div>`:V}

        <div class="chrome-line">
          ${Number.isNaN(e.whoWonCount)?V:H`<acp-tile-badge
                .hass=${this.hass}
                kind-override="group"
                .groupCount=${e.whoWonCount}
                .groupTotal=${e.rosterTotal}
              ></acp-tile-badge>`}
          ${h.map(e=>H`<acp-tile-badge .hass=${this.hass} .winner=${e}></acp-tile-badge>`)}
          ${this.showPositionBar?H`<div
                class="pos-slider${null!==this._posDrag?" dragging":""}${r?"":" disabled"}"
                role="slider"
                tabindex=${r?0:-1}
                aria-disabled=${r?"false":"true"}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${a&&!l?a.min:s}
                aria-valuetext=${!a||a.aligned||l?st("covers.position_open_value",this.hass,{pct:nt(o)}):st("group.spread_value",this.hass,{min:Math.round(a.logicalMin),max:Math.round(a.logicalMax),count:a.readable})}
                aria-label=${st("group.position_slider_label",this.hass)}
                ${xo(st("group.drag_to_set_all",this.hass,{count:e.rosterTotal}))}
                @click=${this._stop}
                @pointerdown=${e=>this._onPosPointerDown(e,r)}
                @pointermove=${this._onPosPointerMove}
                @pointerup=${t=>this._onPosPointerEnd(t,e)}
                @pointercancel=${this._onPosCancel}
                @keydown=${t=>this._onPosKeydown(t,e)}
              >
                <div class="pos-bar">
                  ${l||!a?H`<div class="pos-fill" style=${`width:${s}%`}></div>`:H`
                        <!-- Solid to the LEAST-covered member: the coverage every
                             member has reached. Band on top spans to the most-
                             covered one, so the gap between them IS the disagreement
                             the word "Mixed" was gesturing at. -->
                        <div class="pos-fill" style=${`width:${a.min}%`}></div>
                        ${a.aligned?V:H`<div
                              class="pos-band"
                              style=${`left:${a.min}%;width:${a.max-a.min}%`}
                            ></div>`}
                        ${a.ticks.map(e=>H`<div
                              class="pos-tick"
                              style=${`left:clamp(1px, ${e}%, calc(100% - 1px))`}
                            ></div>`)}
                      `}
                </div>
              </div>`:V}
        </div>

        ${this.showTilt&&e.tilt?H`<div
              class="tilt-line"
              @click=${this._stop}
              @pointerdown=${this._stop}
              @keydown=${this._stop}
            >
              <acp-axis-bar
                layout="tile"
                .hass=${this.hass}
                .label=${st("covers.tilt_title",this.hass)}
                .actual=${e.tilt.value}
                .openBlocksSun=${!1}
                @acp-tilt-set=${t=>ys(this.hass,e,t.detail)}
              ></acp-axis-bar>
            </div>`:V}

        <acp-group-controls-row
          .hass=${this.hass}
          .discovered=${this.discovered}
          .snapshot=${e}
          .showSceneSelect=${this.showSceneSelect}
          .showLock=${this.showLock}
          .showAutomation=${this.showAutomation}
          .showClearOverrides=${this.showClearOverrides}
        ></acp-group-controls-row>
      </div>
    `}_move(e,t){"stop"===e.detail?bs(this.hass,this.discovered,t):fs(this.hass,t,"open"===e.detail?100:0)}_pctFromEvent(e,t){const o=t.getBoundingClientRect(),i=Math.round((e.clientX-o.left)/o.width*100);return Math.max(0,Math.min(100,i))}_onPosPointerDown(e,t){if(e.stopPropagation(),!t)return;const o=e.currentTarget;o.setPointerCapture?.(e.pointerId),this._posDownX=e.clientX,this._posMoved=!1}_onPosKeydown(e,t){const o=At(this.discovered),i=rs(t.memberPositions,o),s=i?.min??(null===t.position?0:ft(t.position,o));let n;switch(e.key){case"ArrowRight":case"ArrowUp":n=s+1;break;case"ArrowLeft":case"ArrowDown":n=s-1;break;case"PageUp":n=s+10;break;case"PageDown":n=s-10;break;case"Home":n=0;break;case"End":n=100;break;default:return}e.preventDefault(),e.stopPropagation(),t.target&&fs(this.hass,t,ft(Math.max(0,Math.min(100,n)),o))}_stop(e){e.stopPropagation()}};As.DRAG_THRESHOLD_PX=4,As.styles=a`
    :host {
      display: block;
    }
    /* Mirrors the cover tile's detailed grid: the glyph spans the label +
       chrome rows so it stays vertically centered, controls sit right. */
    .group-tile {
      display: grid;
      grid-template-areas:
        'icon label controls'
        'icon chrome chrome'
        'tilt tilt tilt'
        'group group group';
      grid-template-columns: 36px minmax(0, 1fr) auto;
      /* HA's ha-tile-container .content: 10px gap, 56px row floor. */
      column-gap: 10px;
      min-height: var(--row-height, 56px);
      row-gap: 2px;
      align-items: center;
      padding: 6px 4px;
      cursor: pointer;
    }
    /* Same 50% controls track as the cover tile's detailed grid — HA's inline
       features block is half the card. Gated so a show_controls: false tile
       doesn't reserve half its width for an empty area. */
    .group-tile.has-controls {
      grid-template-columns: 36px minmax(0, 1fr) calc(50% - 12px);
    }
    /* Unlike the cover tile this element has no reflow that moves the controls
       onto their own row, so the 50% track would keep squeezing the name all
       the way down. Below the cover tile's own narrow threshold, hand the track
       back to content and square the buttons off — flex-filling a content-sized
       track collapses them to the glyph width. The container is the host card's
       ha-card (container-type: inline-size); container queries resolve across
       the shadow boundary. */
    @container (max-width: 340px) {
      .group-tile.has-controls {
        grid-template-columns: 36px minmax(0, 1fr) auto;
      }
      acp-cover-move-buttons {
        --acp-move-button-flex: 0 0 auto;
        --acp-move-button-width: var(--control-button-group-thickness, 36px);
      }
    }
    .group-tile:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
      border-radius: 8px;
    }
    .cover-icon-wrap {
      grid-area: icon;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }
    /* HA's ha-tile-icon shape, opt-in via icon_tap_action — see the matching
       rule on the cover tile for the upstream trail. */
    .cover-icon-wrap.background {
      position: relative;
      border-radius: var(--ha-border-radius-pill, 9999px);
      overflow: hidden;
      cursor: pointer;
    }
    .cover-icon-wrap.background::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: var(--acp-tile-icon-color, var(--disabled-color, #7f7f7f));
      opacity: 0.2;
      transition: opacity 180ms ease-in-out;
    }
    .cover-icon-wrap.background:hover::before {
      opacity: 0.35;
    }
    .cover-icon-wrap.background:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--acp-tile-icon-color, var(--primary-text-color));
    }
    .cover-icon-wrap.background .cover-icon {
      position: relative;
    }
    .cover-icon {
      --mdc-icon-size: 24px;
    }
    .label {
      grid-area: label;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    /* Same theme tokens HA's ha-tile-info uses, matching the cover tile — see
       that rule for why the two lines take different line-heights. */
    .title {
      font-size: var(--ha-font-size-m, 0.875rem);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-normal, 1.6);
      letter-spacing: 0.1px;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .state {
      font-size: var(--ha-font-size-s, 0.75rem);
      font-weight: var(--ha-font-weight-normal, 400);
      line-height: var(--ha-line-height-condensed, 1.2);
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .controls {
      grid-area: controls;
      align-self: center;
      display: inline-flex;
    }
    .chrome-line {
      grid-area: chrome;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      /* Reserve the badge pill's height even with no badge, so the row keeps the
         same height either way and the bar centers in it (cover tile parity). */
      min-height: 22px;
      /* The one deliberate divergence from the cover tile's nowrap: a group's
         badge count is unbounded (one per distinct member override), so the row
         wraps rather than crushing the slider. With the usual 0-1 badges the
         layout is identical. */
      flex-wrap: wrap;
    }
    /* Badges hold their intrinsic width so the bar absorbs any shortage. */
    .chrome-line acp-tile-badge {
      overflow: visible;
      flex: 0 0 auto;
    }
    /* Interactive wrapper carries the sizing; the visible rail below stays 6px.
       Geometry is copied from the cover tile's .chrome-line .pos-slider rule so
       a group tile stacked under cover tiles lines its bar up with theirs,
       instead of stretching the full width of the row. */
    .pos-slider {
      margin-left: auto;
      align-self: center;
      position: relative;
      flex: 0 1 170px;
      max-width: 55%;
      cursor: pointer;
      /* A touch-drag must move the fill, not scroll the dashboard. */
      touch-action: none;
    }
    /* The rail is too thin to grab on a phone — widen the hit area vertically
       with an invisible absolute box, which adds no layout height. */
    .pos-slider::before {
      content: '';
      position: absolute;
      inset: -8px 0;
    }
    .pos-slider:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
      border-radius: 6px;
    }
    /* Nothing to drive: match the buttons rather than looking live and no-oping. */
    .pos-slider.disabled {
      cursor: default;
      opacity: 0.4;
      touch-action: auto;
    }
    .pos-bar {
      position: relative;
      width: 100%;
      height: 6px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      overflow: hidden;
    }
    .pos-fill {
      position: absolute;
      inset: 0 auto 0 0;
      /* One constant color for every rail, never the cover's state color: a rail
         that changed hue as it crossed open/closed read as a status light rather
         than a measurement. Overridable per-theme via --acp-pos-fill-color. */
      background: var(--acp-pos-fill-color, ${r(mt)});
      opacity: 0.55;
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    /* Disagreement band: from the least-covered member to the most-covered one.
       Same hue as the fill at a lower opacity, so it reads as "some of them are
       also this far" rather than as a second measurement. Zero-width when the
       members agree, which is why it isn't rendered at all in that case. */
    .pos-band {
      position: absolute;
      top: 0;
      bottom: 0;
      background: var(--acp-pos-fill-color, ${r(mt)});
      opacity: 0.22;
      transition:
        left 0.3s ease,
        width 0.3s ease;
    }
    /* One tick per DISTINCT member value. Two clusters of covers draw two ticks,
       which is the whole point: "Mixed" stops being a word and becomes a picture
       of where they actually are. Clamped inside the rail (inline) so the 2px box
       survives .pos-bar's overflow:hidden at either extreme, same as the cover
       bar's target marker. */
    .pos-tick {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 10px;
      border-radius: 1px;
      background: var(--acp-pos-fill-color, ${r(mt)});
      transform: translateX(-50%);
      transition: left 0.3s ease;
    }
    /* The rail has to show the ticks that overhang it. Only the FILL and BAND
       need clipping to the rounded ends, so they round themselves instead. */
    .pos-bar {
      overflow: visible;
    }
    .pos-band {
      border-radius: 6px;
    }
    /* The ease above smooths server-driven updates; mid-drag it reads as lag. */
    .pos-slider.dragging .pos-fill {
      transition: none;
    }
    .tilt-line {
      grid-area: tilt;
      min-width: 0;
      cursor: default;
    }
    acp-group-controls-row {
      grid-area: group;
      margin-top: 4px;
    }
  `,e([ge({attribute:!1})],As.prototype,"hass",void 0),e([ge({attribute:!1})],As.prototype,"discovered",void 0),e([ge({type:Boolean})],As.prototype,"showControls",void 0),e([ge({type:Boolean})],As.prototype,"showPositionBar",void 0),e([ge({type:Boolean})],As.prototype,"showTilt",void 0),e([ge({type:Boolean})],As.prototype,"showSceneSelect",void 0),e([ge({type:Boolean})],As.prototype,"showLock",void 0),e([ge({type:Boolean})],As.prototype,"showAutomation",void 0),e([ge({type:Boolean})],As.prototype,"showClearOverrides",void 0),e([ge({type:Boolean})],As.prototype,"showMemberBadges",void 0),e([ge({type:Boolean})],As.prototype,"stateColor",void 0),e([ge({type:Boolean})],As.prototype,"iconInteractive",void 0),e([ge({attribute:!1})],As.prototype,"name",void 0),e([ge({attribute:!1})],As.prototype,"icon",void 0),e([me()],As.prototype,"_posDrag",void 0),As=ks=e([pe("acp-group-tile")],As);const Ss=(e,t,o)=>{const i=new Map;for(let s=t;s<=o;s++)i.set(e[s],s);return i},Cs=ao(class extends lo{constructor(e){if(super(e),2!==e.type)throw Error("repeat() can only be used in text expressions")}dt(e,t,o){let i;void 0===o?o=t:void 0!==t&&(i=t);const s=[],n=[];let r=0;for(const t of e)s[r]=i?i(t,r):r,n[r]=o(t,r),r++;return{values:n,keys:s}}render(e,t,o){return this.dt(e,t,o).values}update(e,[t,o,i]){const s=(e=>e._$AH)(e),{values:n,keys:r}=this.dt(t,o,i);if(!Array.isArray(s))return this.ut=r,n;const a=this.ut??=[],l=[];let c,d,h=0,p=s.length-1,u=0,_=n.length-1;for(;h<=p&&u<=_;)if(null===s[h])h++;else if(null===s[p])p--;else if(a[h]===r[u])l[u]=io(s[h],n[u]),h++,u++;else if(a[p]===r[_])l[_]=io(s[p],n[_]),p--,_--;else if(a[h]===r[_])l[_]=io(s[h],n[_]),oo(e,l[_+1],s[h]),h++,_--;else if(a[p]===r[u])l[u]=io(s[p],n[u]),oo(e,s[h],s[p]),p--,u++;else if(void 0===c&&(c=Ss(r,u,_),d=Ss(a,h,p)),c.has(a[h]))if(c.has(a[p])){const t=d.get(r[u]),o=void 0!==t?s[t]:null;if(null===o){const t=oo(e,s[h]);io(t,n[u]),l[u]=t}else l[u]=io(o,n[u]),oo(e,s[h],o),s[t]=null;u++}else ro(s[p]),p--;else ro(s[h]),h++;for(;u<=_;){const t=oo(e,l[_+1]);io(t,n[u]),l[u++]=t}for(;h<=p;){const e=s[h++];null!==e&&ro(e)}return this.ut=r,no(e,l),q}}),Es=new Map;function zs(e,t,o){return function(e,t){const o=[],i=new Map;for(const s of e){const e=t(s);if(!e){o.push({entryId:null,covers:[s]});continue}const n=i.get(e);if(n){n.covers.push(s);continue}const r={entryId:e,covers:[s]};i.set(e,r),o.push(r)}return o}(t,t=>{const i=Bo(e,t,o);return i?(Es.set(t,i),i):Es.get(t)??null})}function Ms(){let e=null,t=null,o=[];return(i,s,n)=>{const r=s.join("|");return e===r&&t===n&&o.length>0||(e=r,t=n,o=zs(i,s,n)),o}}function Ts(e){return e.entryId??`generic:${e.covers[0]}`}function Is(e){return e.entryId??e.covers[0]}const Ps=["acp-dialog-close","acp-tile-tap","acp-open-more-info","acp-resume","acp-extend","acp-extend-confirm","acp-extend-close","acp-tilt-set"];let Os=0;const Ns=new WeakMap;let Ds=class extends de{constructor(){super(...arguments),this.position=null,this.winner=null,this.acpManaged=!1,this.showTilt=!0,this.openBlocksSun=!0,this.compact=!1,this._entryId=null,this._tile=null,this._tileKey=null,this._resolveKey=null,this._onMove=e=>{var t,o;"stop"===e.detail?(t=this.hass,o=this.entityId,this.acpManaged?t.callService(Te,"stop",{},{entity_id:o}):t.callService("cover","stop_cover",{},{entity_id:o})):this._set("position","open"===e.detail?100:0)}}willUpdate(e){if(!this.hass||!this.entityId)return;e.has("entityId")&&(this._entryId=null,this._tile=null,this._tileKey=null,this._resolveKey=null);const t=Io();if(!t)return;const o=`${this.entityId}|${function(e){let t=Ns.get(e);return void 0===t&&(t=++Os,Ns.set(e,t)),t}(t)}`;if(this._resolveKey===o)return;this._resolveKey=o;const i=Bo(this.hass,this.entityId);i&&(this._entryId=i)}updated(){this._tile&&this.hass&&(this._tile.hass=this.hass)}_tileCard(e){const t=this.coverIds?.length?this.coverIds:[this.entityId],o=`${e}|${t.join(",")}|${this.displayName??""}|${this.showTilt}`;if(this._tile&&this._tileKey===o)return this._tile.hass=this.hass,this._tile;if(!customElements.get($e))return null;const i=document.createElement($e);i.setConfig({type:`custom:${$e}`,entry_id:e,covers:t,...this.displayName?{name:this.displayName}:{},show_tilt:this.showTilt});for(const e of Ps)i.addEventListener(e,e=>e.stopPropagation());return i.hass=this.hass,this._tile=i,this._tileKey=o,i}render(){if(!this.hass||!this.entityId)return V;if(this._entryId){const e=this._tileCard(this._entryId);if(e)return H`<div class="tile-host">${e}</div>`}return this._fallbackRow()}_fallbackRow(){const e=this.hass.states[this.entityId],t=this.displayName||e?.attributes?.friendly_name||this.entityId,o=at(e?.state),i=this.showTilt&&Bi(this.hass,this.entityId),s=i?e?.attributes?.current_tilt_position??null:null;return H`
      <div class="member ${o?"unavailable":""}">
        <div class="head">
          <div class="name" ${xo(this.entityId)}>${t}</div>
          ${this.winner?H`<acp-tile-badge .hass=${this.hass} .winner=${this.winner}></acp-tile-badge>`:V}
        </div>
        <div class="body">
          <div class="tracks">
            <acp-axis-bar
              layout="cover"
              .hass=${this.hass}
              .label=${st("group.position",this.hass)}
              .hintKey=${"covers.click_to_set"}
              .targetHintKey=${"covers.target_tooltip"}
              .actual=${this.position}
              .openBlocksSun=${this.openBlocksSun}
              .disabled=${o}
              .compact=${this.compact}
              @acp-tilt-set=${e=>this._set("position",e.detail)}
            ></acp-axis-bar>
            ${i?H`<acp-axis-bar
                    layout="cover"
                    .hass=${this.hass}
                    .label=${st("covers.tilt_title",this.hass)}
                    .actual=${s}
                    .openBlocksSun=${!1}
                    .disabled=${o}
                    .compact=${this.compact}
                    @acp-tilt-set=${e=>this._set("tilt",e.detail)}
                  ></acp-axis-bar>`:V}
          </div>
          <acp-cover-move-buttons
            compact
            labels="tile"
            .hass=${this.hass}
            .position=${this.position}
            .deviceClass=${e?.attributes?.device_class}
            .enabled=${!o}
            @acp-move=${this._onMove}
          ></acp-cover-move-buttons>
          </div>
        </div>
      </div>
    `}_set(e,t){!function(e,t,o,i,s){s?Li(e,t,{[o]:i}):"tilt"!==o?e.callService("cover","set_cover_position",{position:i},{entity_id:t}):e.callService("cover","set_cover_tilt_position",{tilt_position:i},{entity_id:t})}(this.hass,this.entityId,e,t,this.acpManaged)}};Ds.styles=a`
    :host {
      display: block;
    }
    /* The nested tile brings its own <ha-card> inside its own shadow root, so
       it can only be restyled through the custom properties ha-card reads (they
       inherit across the boundary; a descendant selector would not reach it).
       Drop the elevation and let a hairline carry the separation — otherwise a
       roster reads as a pile of floating cards rather than one surface. */
    .tile-host {
      display: block;
      --ha-card-box-shadow: none;
      --ha-card-border-width: 1px;
      --ha-card-border-color: var(--divider-color, rgba(127, 127, 127, 0.25));
    }
    .member {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .member.unavailable {
      opacity: 0.5;
    }
    .head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      min-width: 0;
    }
    .name {
      flex: 1 1 auto;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name[data-tooltip]:hover {
      cursor: help;
    }
    .body {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tracks {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    /* A roster repeats this triple per member, so it is deliberately smaller
       than the tile's own ↑■↓ — four members otherwise read as a button wall. */
    .move-buttons {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .move-buttons button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 20%,
        transparent
      );
      cursor: pointer;
    }
    .move-buttons button ha-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-text-color);
    }
    .move-buttons button:hover {
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 32%,
        transparent
      );
    }
    .move-buttons button:disabled {
      opacity: 0.4;
      cursor: default;
    }
  `,e([ge({attribute:!1})],Ds.prototype,"hass",void 0),e([ge({attribute:!1})],Ds.prototype,"entityId",void 0),e([ge({attribute:!1})],Ds.prototype,"coverIds",void 0),e([ge({attribute:!1})],Ds.prototype,"displayName",void 0),e([ge({attribute:!1})],Ds.prototype,"position",void 0),e([ge({attribute:!1})],Ds.prototype,"winner",void 0),e([ge({type:Boolean})],Ds.prototype,"acpManaged",void 0),e([ge({type:Boolean})],Ds.prototype,"showTilt",void 0),e([ge({type:Boolean})],Ds.prototype,"openBlocksSun",void 0),e([ge({type:Boolean,reflect:!0})],Ds.prototype,"compact",void 0),e([me()],Ds.prototype,"_entryId",void 0),Ds=e([pe("acp-group-member-row")],Ds);let Bs=class extends de{constructor(){super(...arguments),this.open=!1,this.showTilt=!0,this.showSceneSelect=!0,this.showLock=!0,this.showAutomation=!0,this.showClearOverrides=!0,this.showMemberBadges=!0,this.stateColor=!0,this._roster=Ms(),this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}render(){if(!this.open||!this.hass||!this.discovered)return V;const e=_s(this.hass,this.discovered),t=this.stateColor?vt(e.aggregate):"",o=Object.entries(e.memberPositions),i=!!e.target,s=this.showMemberBadges?is(e.memberWinners):[],n=st("dialog.close",this.hass);return H`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${this.icon??gs(e,e.position)}
              style=${t?`color: ${t}`:""}
            ></ha-icon>
            <div class="title">${this.name??this.discovered.entry_title}</div>
            ${Number.isNaN(e.whoWonCount)?V:H`<acp-tile-badge
                  .hass=${this.hass}
                  kind-override="group"
                  .groupCount=${e.whoWonCount}
                  .groupTotal=${e.rosterTotal}
                ></acp-tile-badge>`}
            ${s.map(e=>H`<acp-tile-badge .hass=${this.hass} .winner=${e}></acp-tile-badge>`)}
            <button class="close" type="button" aria-label=${n} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          <div class="summary">
            <span class="agg-state">${st(`group.state_${e.aggregate}`,this.hass)}</span>
            <span class="agg-position">${nt(e.position)}</span>
          </div>

          <acp-axis-bar
            layout="cover"
            .hass=${this.hass}
            .label=${st("group.position",this.hass)}
            .hintKey=${"covers.click_to_set"}
            .targetHintKey=${"covers.target_tooltip"}
            .actual=${e.position}
            .openBlocksSun=${At(this.discovered).openBlocksSun}
            .disabled=${!i}
            @acp-tilt-set=${t=>fs(this.hass,e,t.detail)}
          ></acp-axis-bar>
          ${this.showTilt&&e.tilt?H`<acp-axis-bar
                layout="cover"
                .hass=${this.hass}
                .label=${st("covers.tilt_title",this.hass)}
                .actual=${e.tilt.value}
                .openBlocksSun=${!1}
                @acp-tilt-set=${t=>ys(this.hass,e,t.detail)}
              ></acp-axis-bar>`:V}

          <div class="controls">
            <acp-cover-move-buttons
              labels="group"
              .hass=${this.hass}
              .position=${e.position}
              .deviceClass=${e.deviceClass}
              .enabled=${i}
              @acp-move=${t=>this._move(t,e)}
            ></acp-cover-move-buttons>
          </div>

          <acp-group-controls-row
            .hass=${this.hass}
            .discovered=${this.discovered}
            .snapshot=${e}
            .showSceneSelect=${this.showSceneSelect}
            .showLock=${this.showLock}
            .showAutomation=${this.showAutomation}
            .showClearOverrides=${this.showClearOverrides}
          ></acp-group-controls-row>

          <div class="members">
            <div class="members-head">${st("group.members",this.hass)}</div>
            ${0===o.length?H`<div class="member-placeholder">
                  ${st("group.member_placeholder",this.hass)}
                </div>`:Cs(this._roster(this.hass,o.map(([e])=>e),Io()??void 0),Ts,t=>H`<acp-group-member-row
                      .hass=${this.hass}
                      .entityId=${t.covers[0]}
                      .coverIds=${t.covers}
                      .position=${e.memberPositions[t.covers[0]]??null}
                      .winner=${e.memberWinners?.[t.covers[0]]}
                      .openBlocksSun=${At(this.discovered).openBlocksSun}
                      .acpManaged=${!!e.memberWinners&&t.covers[0]in e.memberWinners}
                      .displayName=${this.memberNames?.[Is(t)]}
                      .showTilt=${this.showTilt}
                    ></acp-group-member-row>`)}
          </div>
        </div>
      </div>
    `}_move(e,t){"stop"===e.detail?bs(this.hass,this.discovered,t):fs(this.hass,t,"open"===e.detail?100:0)}};function Fs(e){if("number"==typeof e.lu)return 1e3*e.lu;if("number"==typeof e.lc)return 1e3*e.lc;const t=e.last_updated??e.last_changed;if("string"==typeof t){const e=Date.parse(t);if(!Number.isNaN(e))return e}return null}Bs.styles=a`
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
      flex-wrap: wrap;
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
    .summary {
      display: flex;
      align-items: baseline;
      gap: 10px;
      font-size: 1.1rem;
    }
    .agg-state {
      color: var(--secondary-text-color);
      text-transform: capitalize;
    }
    .agg-position {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .members {
      display: flex;
      flex-direction: column;
      gap: 10px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
      padding-top: 10px;
    }
    .members-head {
      font-size: 0.78rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .member-placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 12px;
    }
  `,e([ge({attribute:!1})],Bs.prototype,"hass",void 0),e([ge({attribute:!1})],Bs.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Bs.prototype,"open",void 0),e([ge({type:Boolean})],Bs.prototype,"showTilt",void 0),e([ge({type:Boolean})],Bs.prototype,"showSceneSelect",void 0),e([ge({type:Boolean})],Bs.prototype,"showLock",void 0),e([ge({type:Boolean})],Bs.prototype,"showAutomation",void 0),e([ge({type:Boolean})],Bs.prototype,"showClearOverrides",void 0),e([ge({type:Boolean})],Bs.prototype,"showMemberBadges",void 0),e([ge({type:Boolean})],Bs.prototype,"stateColor",void 0),e([ge({attribute:!1})],Bs.prototype,"name",void 0),e([ge({attribute:!1})],Bs.prototype,"icon",void 0),e([ge({attribute:!1})],Bs.prototype,"memberNames",void 0),Bs=e([pe("acp-group-dialog")],Bs);const Rs="current_position";function js(e,t=Rs){const o=e.a??e.attributes,i=o?.[t];return"number"!=typeof i||Number.isNaN(i)?null:i}function Ls(e,t=Rs){const o=[];let i=null;for(const s of e){const e=Fs(s),n=js(s,t);null!==n&&(i=n),null!==e&&null!==i&&o.push({t:e,position:i})}return o}function Ks(e){const t=Object.keys(e).filter(t=>e[t].length>0);if(0===t.length)return[];const o={},i=new Set;for(const s of t){const t=[...e[s]].sort((e,t)=>e.t-t.t);o[s]=t;for(const e of t)i.add(e.t)}const s=[...i].sort((e,t)=>e-t),n={},r={};for(const e of t)n[e]=0,r[e]=null;const a=[];for(const e of s){for(const i of t){const t=o[i];for(;n[i]<t.length&&t[n[i]].t<=e;)r[i]=t[n[i]].position,n[i]++}const i=Ft(r);null!==i&&a.push({t:new Date(e).toISOString(),position:i})}return a}async function Gs(e,t,o,i,s={}){const n={position:{},tilt:{}},r=t.filter(e=>"string"==typeof e&&e.length>0);if(0===r.length)return n;let a;try{a=await e.callWS({type:"history/history_during_period",start_time:new Date(o).toISOString(),end_time:new Date(i).toISOString(),entity_ids:r,minimal_response:!1,no_attributes:!1,significant_changes_only:!1})}catch{return n}if(!a||"object"!=typeof a)return n;const l={position:{},tilt:{}};for(const e of r){const t=a[e];if(!Array.isArray(t))continue;const o=Ws(t,Rs,!!s.inverted,i);if(o&&(l.position[e]=o),s.wantTilt){const o=Ws(t,"current_tilt_position",!!s.tiltInverted,i);o&&(l.tilt[e]=o)}}return l}function Ws(e,t,o,i){const s=Ls(e,t);if(0===s.length)return null;const n=s.sort((e,t)=>e.t-t.t).map(e=>({t:new Date(e.t).toISOString(),position:o?100-e.position:e.position})),r=n[n.length-1];return Date.parse(r.t)<i&&n.push({t:new Date(i).toISOString(),position:r.position}),n}let Hs=class extends de{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0,this._tick=null}disconnectedCallback(){super.disconnectedCallback(),this._syncTimer(!1)}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),o=this.discovered?.entities;return ve(t,this.hass,[o?.manual_override_binary,o?.manual_override_end_sensor,o?.motion_status_sensor,o?.reset_override_button])}updated(){if(!this.hass||!this.discovered)return void this._syncTimer(!1);const e=!this.compact&&(null!==this._manualEndIso()||null!=this._motionStatus()?.endIso);this._syncTimer(e)}_syncTimer(e){e&&null===this._tick?this._tick=setInterval(()=>this.requestUpdate(),1e3):e||null===this._tick||(clearInterval(this._tick),this._tick=null)}_manualActive(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualEndIso(){const e=this.discovered.entities.manual_override_end_sensor;if(!e)return null;const t=this.hass.states[e];return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:null}_motionStatus(){const e=this.discovered.entities.motion_status_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const o=t.attributes.motion_timeout_end_time;return{state:t.state,endIso:o??null}}_resetManual(){const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_motionStateLabel(e,t){if(e){const t=this.hass.states[e],o=this.hass.formatEntityState;if(t&&"function"==typeof o){const e=o(t);if(e)return e}}return t.replace(/_/g," ")}render(){if(!this.hass||!this.discovered)return V;const e=this._manualActive(),t=this._manualEndIso(),o=this._motionStatus(),i=this.discovered.entities.motion_status_sensor,s=this.discovered.entities.reset_override_button,n=st("overrides.reset_manual",this.hass);return H`
      <div class="wrap">
        <div class="label dim">${st("overrides.title",this.hass)}</div>
        <div class="grid">
          <div class="tile ${e?"active":""}">
            <div class="tile-label">${st("overrides.manual",this.hass)}</div>
            <div class="tile-value">
              ${st(e?"overrides.active":"overrides.off",this.hass)}
            </div>
            ${t?H`<div class="tile-sub dim">
                  ${st("overrides.ends_in",this.hass,{time:ht(t,this.hass)})}
                </div>`:V}
          </div>

          ${o?H`<div class="tile ${"motion_detected"===o.state?"active":""}">
                <div class="tile-label">${st("overrides.motion",this.hass)}</div>
                <div class="tile-value">${this._motionStateLabel(i,o.state)}</div>
                ${o.endIso?H`<div class="tile-sub dim">
                      ${st("overrides.timeout",this.hass,{time:ht(o.endIso,this.hass)})}
                    </div>`:V}
              </div>`:V}
          ${s?this.resetEnabled?H`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${n}</div>
                </button>`:H`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${n}</div>
                </button>`:V}
        </div>
      </div>
    `}};Hs.styles=a`
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
  `,e([ge({attribute:!1})],Hs.prototype,"hass",void 0),e([ge({attribute:!1})],Hs.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Hs.prototype,"compact",void 0),e([ge({type:Boolean,attribute:"reset-enabled"})],Hs.prototype,"resetEnabled",void 0),Hs=e([pe("acp-overrides-panel")],Hs);const Us=new Set(["mode_off","active"]),qs={summer_mode:"mdi:weather-sunny",winter_mode:"mdi:snowflake",intermediate:"mdi:weather-partly-cloudy"};let Vs=class extends de{constructor(){super(...arguments),this.compact=!1}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),o=this.discovered?.entities;return ve(t,this.hass,[o?.climate_status_sensor,o?.climate_mode_switch])}render(){if(!this.hass||!this.discovered)return V;const e=this.discovered.entities.climate_status_sensor;if(!e)return V;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return V;if("unknown"===t.state||""===t.state){const e=this.discovered.entities.climate_mode_switch,o=!!e&&"off"===this.hass.states[e]?.state,i=st(o?"climate.mode_off":"climate.standby",this.hass),s=o?"mdi:power-off":"mdi:thermostat",n=t.attributes?.inactive_reason;return this._renderStandby(s,i,n)}const o=t.state,i=t.attributes??{},s=qs[o]??"mdi:thermostat",n=this.hass.formatEntityState,r="function"==typeof n?n(t)??o:o,a=i.temperature_unit??"°",l=!0===i.temp_switch,c=(e,t)=>null==t||Number.isNaN(t)?null:`${st(e,this.hass)} ${t.toFixed(1)}${a}`,d=l?null:[c("climate.threshold_low",i.temp_low),c("climate.threshold_high",i.temp_high)].filter(e=>null!==e).join(" ")||null,h=[...l?[c("climate.threshold_low",i.temp_low),c("climate.threshold_high",i.temp_high)]:[],c("climate.threshold_summer_outside",i.temp_summer_outside)].filter(e=>null!==e).join(" ")||null,p=[void 0!==i.indoor_temperature?{label:st("climate.indoor",this.hass),value:i.indoor_temperature,unit:a,threshold:d}:null,void 0!==i.outdoor_temperature?{label:st("climate.outdoor",this.hass),value:i.outdoor_temperature,unit:a,threshold:h}:null].filter(e=>null!==e);if(null!=(u=i.inactive_reason)&&"active"!==u)return this._renderStandby(s,r,i.inactive_reason,p);var u;const _=void 0!==i.active_temperature?`${i.active_temperature.toFixed(1)}${a}`:"—",g=[{label:st("climate.presence",this.hass),value:i.is_presence,icon:"mdi:account-check"},{label:st("climate.sunny",this.hass),value:i.is_sunny,icon:"mdi:white-balance-sunny"},{label:st("climate.lux",this.hass),value:i.lux_active,icon:"mdi:brightness-7"},{label:st("climate.irradiance",this.hass),value:i.irradiance_active,icon:"mdi:solar-power"}].filter(e=>void 0!==e.value);return H`
      <div class="wrap">
        <div class="head">
          <span class="label">${st("climate.title",this.hass)}</span>
          <span class="dim">${st("climate.active",this.hass,{strategy:_})}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${s}></ha-icon>
          <span class="strategy-name">${r}</span>
        </div>
        ${this._renderTemps(p)}
        ${g.length?H`
              <div class="conditions">
                ${g.map(e=>H`
                    <div class="chip ${e.value?"on":"off"}" ${xo(e.label)}>
                      <ha-icon icon=${e.icon}></ha-icon>
                      <span>${e.label}</span>
                    </div>
                  `)}
              </div>
            `:V}
      </div>
    `}_renderStandby(e,t,o,i=[]){const s=o&&!Us.has(o)?st(`climate.reason.${o}`,this.hass):void 0;return H`
      <div class="wrap">
        <div class="head">
          <span class="label">${st("climate.title",this.hass)}</span>
        </div>
        <div class="strategy standby">
          <ha-icon icon=${e}></ha-icon>
          <span class="strategy-name dim">${t}</span>
        </div>
        ${s?H`<div class="standby-reason dim">${s}</div>`:V}
        ${this._renderTemps(i)}
      </div>
    `}_renderTemps(e){return e.length?H`
      <div class="temps">
        ${e.map(e=>H`
            <div class="temp">
              <span class="temp-label dim">${e.label}</span>
              <span class="temp-value">${e.value.toFixed(1)}${e.unit}</span>
              ${e.threshold?H`<span class="temp-threshold dim">${e.threshold}</span>`:V}
            </div>
          `)}
      </div>
    `:V}};Vs.styles=a`
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
  `,e([ge({attribute:!1})],Vs.prototype,"hass",void 0),e([ge({attribute:!1})],Vs.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Vs.prototype,"compact",void 0),Vs=e([pe("acp-climate-panel")],Vs);let Ys=class extends de{constructor(){super(...arguments),this.compact=!1,this.coverColor=null,this._dragPreview=null,this._openMoreInfo=()=>{this.dispatchEvent(new CustomEvent("acp-open-more-info",{bubbles:!0,composed:!0}))},this._onNameKeydown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openMoreInfo())},this._onTrackPointerDown=(e,t,o)=>{const i=e.currentTarget;i.setPointerCapture?.(e.pointerId),this._dragPreview={entityId:t,pct:ft(this._pctFromEvent(e,i),o)}},this._onTrackPointerMove=(e,t,o)=>{if(this._dragPreview?.entityId!==t)return;const i=e.currentTarget;this._dragPreview={entityId:t,pct:ft(this._pctFromEvent(e,i),o)}},this._onTrackPointerEnd=e=>{this._dragPreview?.entityId===e&&(this._dragPreview=null)}}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),o=this.discovered?.entities,i=this.discovered?kt(this.discovered).map(e=>e.targetRole?o?.[e.targetRole]:void 0).filter(e=>!!e):[];return ve(t,this.hass,[...i,o?.position_mismatch_binary,o?.manual_override_binary,...this.discovered?.managed_covers??[]])}_target(){const e=this.discovered.entities.target_position_sensor;return e&&this.hass.states[e]?{target:Xt(this.hass,this.discovered),covers:qt(this.hass,this.discovered)}:{target:null,covers:{}}}_transit(){const e=this.discovered.entities.target_position_sensor;if(!e)return{};const t=this.hass.states[e];if(!t)return{};const o=t.attributes;return o?.transit_states??{}}_mismatched(){const e=this.discovered.entities.position_mismatch_binary;if(!e)return new Set;const t=this.hass.states[e];if("on"!==t?.state)return new Set;const o=t.attributes.entities;return o?new Set(Object.entries(o).filter(([,e])=>e.mismatch).map(([e])=>e)):new Set}_setAxis(e,t,o){Li(this.hass,e,{[t]:o})}_gotoTarget(e,t){Li(this.hass,e,{position:t},{force:!0})}_axisTarget(e){const t=e.targetRole;if(!t)return null;const o=this.discovered.entities[t];if(!o)return null;const i=parseFloat(this.hass.states[o]?.state??"");return Number.isNaN(i)?null:i}_axisActual(e,t){return Yt(this.hass,e,t)}_motorDivergence(){return function(e,t){const o=Wt(e,t),i=Gt(e,t);return null===o||null===i||o===i||St(t)&&i===100-o?null:i}(this.hass,this.discovered)}_axisLabel(e){const t=qe[e.id];return t?st(t,this.hass):e.label}_axisTargetLabel(e,t){return"tilt"===e.id?st("covers.tilt_target",this.hass,{pct:nt(t)}):`${this._axisLabel(e)}: ${nt(t)}`}render(){if(!this.hass||!this.discovered)return V;const{target:e,covers:t}=this._target(),o=this._mismatched(),i=(l=this.hass,c=this.discovered,null!==jt(Qt(l,c),Ut(l,c),Ht(l,c))),s=this._motorDivergence(),n=this._transit(),r=this.coverOrder?.length?this.coverOrder.filter(e=>e in t).map(e=>[e,t[e]]):[],a=r.length>0?r:Object.entries(t);var l,c;if(0===a.length)return H`<div class="placeholder">${st("covers.placeholder",this.hass)}</div>`;const d=kt(this.discovered).filter(e=>"position"!==e.id),h=At(this.discovered),p=new Map(d.map(e=>[e.id,this._axisTarget(e)]));return H`
      <div class="wrap" style=${this.coverColor?`--acp-cover-color:${this.coverColor}`:V}>
        <div class="head">
          <span class="label">${st("covers.title",this.hass)}</span>
          <span class="targets">
            <span
              class="target"
              ${null!==s?xo(st("covers.target_tooltip_motor",this.hass,{pct:s})):V}
              >${st(i?"covers.target_solar":"covers.target",this.hass,{pct:nt(e)})}</span
            >
            ${d.map(e=>H`<span class="target"
                  >${this._axisTargetLabel(e,p.get(e.id)??null)}</span
                >`)}
          </span>
        </div>
        ${a.map(([t,s])=>H`
            <div class="cover-group">
              ${this._bar(t,s,e,o.has(t),i,n[t]??null,h)}
              ${d.map(e=>H`<acp-tilt-bar
                    .hass=${this.hass}
                    .label=${this._axisLabel(e)}
                    .min=${e.min}
                    .max=${e.max}
                    .unit=${e.unit}
                    .actual=${this._axisActual(e,t)}
                    .target=${p.get(e.id)??null}
                    .openBlocksSun=${e.openBlocksSun}
                    .coverColor=${this.coverColor}
                    .compact=${this.compact}
                    @acp-tilt-set=${o=>this._setAxis(t,e.id,o.detail)}
                  ></acp-tilt-bar>`)}
            </div>
          `)}
      </div>
    `}_bar(e,t,o,i,s,n,r){const a=this.hass.states[e]?.attributes?.friendly_name??e,l=o??0,c=this._dragPreview?.entityId===e?this._dragPreview.pct:null,d=nt(null!==c?c:t),h=c??t,p=null===h?0:ft(h,r),u=ft(l,r),_=lt(this.hass,e,n??void 0);return H`
      <div class="cover ${i?"mismatch":""}">
        <div
          class="name"
          role="button"
          tabindex="0"
          @click=${this._openMoreInfo}
          @keydown=${this._onNameKeydown}
          ${xo(e)}
        >
          ${a}
        </div>
        <div class="num">
          ${n&&!_?H`<ha-icon
                class="transit transit-${n}"
                icon=${"opening"===n?"mdi:arrow-up-thin":"mdi:arrow-down-thin"}
                ${xo(st("covers."+n,this.hass))}
              ></ha-icon>`:V}${_?H`<span class="num-state">${_}</span><span class="num-sep"> · </span>`:V}<span class="num-pct">${d}</span>
        </div>
        <div
          class="track"
          role="slider"
          tabindex="0"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${p}
          aria-valuetext=${st("covers.position_open_value",this.hass,{pct:d})}
          aria-label=${st("covers.position_slider_label",this.hass)}
          @click=${t=>this._handleTrackClick(t,e,r)}
          @pointerdown=${t=>this._onTrackPointerDown(t,e,r)}
          @pointermove=${t=>this._onTrackPointerMove(t,e,r)}
          @pointerup=${()=>this._onTrackPointerEnd(e)}
          @pointercancel=${()=>this._onTrackPointerEnd(e)}
          @keydown=${t=>this._onTrackKeydown(t,e,p,r)}
          ${xo(st("covers.click_to_set",this.hass))}
        >
          <div class="fill" style="width:${p}%"></div>
          <div class="fill-closed" style="width:${100-p}%"></div>
          ${null!==o?H`<div
                class="marker"
                style="left:clamp(1px, ${u}%, calc(100% - 1px))"
                ${xo(st(s?"covers.target_tooltip_override":"covers.target_tooltip",this.hass,{pct:l}))}
              ></div>`:V}
        </div>
        ${null!==o&&ji(this.hass)?H`<button
              class="goto-target"
              type="button"
              aria-label=${st("covers.goto_target",this.hass,{pct:l})}
              ${xo(st("covers.goto_target",this.hass,{pct:l}))}
              @click=${()=>this._gotoTarget(e,o)}
            >
              <ha-icon icon="mdi:target"></ha-icon>
            </button>`:H`<span class="goto-target-spacer"></span>`}
        ${i&&!s?H`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:V}
      </div>
    `}_pctFromEvent(e,t){const o=t.getBoundingClientRect(),i=Math.round((e.clientX-o.left)/o.width*100);return Math.max(0,Math.min(100,i))}_handleTrackClick(e,t,o){const i=e.currentTarget,s=this._pctFromEvent(e,i);this._setAxis(t,"position",ft(s,o))}_onTrackKeydown(e,t,o,i){let s;switch(e.key){case"ArrowRight":case"ArrowUp":s=o+1;break;case"ArrowLeft":case"ArrowDown":s=o-1;break;case"PageUp":s=o+10;break;case"PageDown":s=o-10;break;case"Home":s=0;break;case"End":s=100;break;default:return}e.preventDefault();const n=Math.max(0,Math.min(100,s));this._setAxis(t,"position",ft(n,i))}};function Zs(e){if("number"==typeof e.lu)return 1e3*e.lu;if("number"==typeof e.lc)return 1e3*e.lc;const t=e.last_updated??e.last_changed;if("string"==typeof t){const e=Date.parse(t);if(!Number.isNaN(e))return e}return null}function Qs(e){if(!Array.isArray(e))return[];const t=[];for(const o of e){if(!o||"object"!=typeof o)continue;const e=Zs(o),i=o.s??o.state;null!==e&&"string"==typeof i&&t.push({t:e,state:i,attributes:o.a??o.attributes??{}})}return t.sort((e,t)=>e.t-t.t),t}function Xs(e,t,o){if(0===e.length||o<=t)return[];let i=null;const s=[];for(const n of e){if(n.t>=o)break;n.t<=t?i=n:s.push(n)}const n=i?[{...i,t:t},...s]:[...s];if(0===n.length)return[];const r=[];for(const e of n){const t=r[r.length-1];t&&t.state===e.state||(t&&(t.end=e.t),r.push({start:e.t,end:o,state:e.state,attributes:e.attributes}))}return r.filter(e=>e.end>e.start)}function Js(e,t={}){const o=[];for(const i of e){const e=t.preferAttribute?i.attributes[t.preferAttribute]:void 0;if("number"==typeof e&&Number.isFinite(e)){o.push({t:i.t,value:e});continue}const s=parseFloat(i.state);Number.isNaN(s)||o.push({t:i.t,value:t.inverted?100-s:s})}return o}function en(e){return e.map(e=>({t:Date.parse(e.t),value:e.position})).filter(e=>!Number.isNaN(e.t))}function tn(e,t){if(0===e.length)return[];const o=[e[0]];for(let t=1;t<e.length;t++){const i=e[t-1],s=e[t];s.value!==i.value&&o.push({t:s.t,value:i.value}),o.push(s)}const i=o[o.length-1];return i.t<t&&o.push({t:t,value:i.value}),o}function on(e,t){let o=null,i=Number.NEGATIVE_INFINITY;for(const s of e)Number.isNaN(s.t)||s.t<=t&&s.t>=i&&(i=s.t,o=s.value);return o}async function sn(e,t,o,i){const s=t.filter(e=>"string"==typeof e&&e.length>0);if(0===s.length)return{};let n;try{n=await e.callWS({type:"history/history_during_period",start_time:new Date(o).toISOString(),end_time:new Date(i).toISOString(),entity_ids:s,minimal_response:!1,no_attributes:!1,significant_changes_only:!1})}catch{return{}}if(!n||"object"!=typeof n)return{};const r={};for(const e of s){const t=Qs(n[e]);t.length>0&&(r[e]=t)}return r}var nn;Ys.styles=a`
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
         a toggling badge no longer reflows the bar graph (#158).

         The readout column carries "Open · 25%" and is FIXED, not minmax: every
         row is its own grid, so an auto-sized track resolves to that row's own
         max-content and two rows with different state words would put their
         tracks at different x. A longer localized state (de "Geschlossen")
         ellipsises the state word instead — .num-pct is never truncated, so the
         percentage always survives.

         The go-to-target column is FIXED for the same reason the warn column is:
         it empties out whenever the entry has no target, and an auto column
         would hand those pixels to the track and reflow the bar graph. A spacer
         holds the cell instead. Keep in lock-step with acp-tilt-bar's .row.cover
         grid — they are separate grids stacked in one .cover-group. */
      grid-template-columns: minmax(80px, 1fr) 11ch 3fr 22px 16px;
      gap: 8px;
      align-items: center;
      font-size: 0.82rem;
    }
    /* Snap this cover to the marker's value. Sized and coloured like the row's
       other glyphs rather than like a control, so a row of covers does not read
       as a row of buttons — it lights up on hover/focus. */
    .goto-target {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
      transition:
        color 0.15s ease,
        background 0.15s ease;
    }
    .goto-target:hover {
      color: var(--accent-color, var(--primary-color));
      background: color-mix(in srgb, currentColor 14%, transparent);
    }
    .goto-target:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
      color: var(--accent-color, var(--primary-color));
    }
    /* Floating-tooltip cursor lifecycle for this shadow root's INERT tooltip
       carriers: the transit arrow and the header target chip. Restated here
       because a shadow root cannot borrow its host's copy of this pair.

       Deliberately not a bare [data-tooltip] selector. The other three anchors
       in here are interactive and already carry the right cursor — .name is a
       role="button" that opens more-info, and .track / the tilt track are
       drag-to-set sliders — so a blanket rule would replace three correct
       pointers with a help cursor that promises information instead of action. */
    .transit[data-tooltip]:hover,
    .target[data-tooltip]:hover {
      cursor: help;
    }
    .transit[data-tooltip][acp-tt-shown],
    .target[data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    /* The cover name is a tap target that opens the entry's more-info dialog,
       so it carries a pointer cursor and a keyboard focus ring. It still hovers
       an entity-id tooltip, but click/Enter/Space open the dialog. */
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      border-radius: 4px;
    }
    .name:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .track {
      position: relative;
      display: flex;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
      /* A touch-drag must move the fill, not the page — own the gesture. */
      touch-action: none;
    }
    .track:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    :host([compact]) .track {
      height: 6px;
    }
    :host([compact]) .cover {
      font-size: 0.75rem;
      gap: 6px;
    }
    :host([compact]) .goto-target {
      width: 18px;
      height: 18px;
      --mdc-icon-size: 14px;
    }
    :host([compact]) .head {
      display: none;
    }
    /* Both segments derive from the cover colour (override, else --primary-color),
       distinguished by opacity: blocking is solid, clear is pale — "lighter =
       more open" — matching the compass FOV (light) vs cover wedge (solid) of
       the same hue. No gold, so nothing competes with the gold sun on the compass.

       .fill is the LEADING segment and now carries the sun-blocking portion, so
       the track fills from the left as the cover closes — the same polarity as
       the tile rails and the compass wedge. Class names are kept (a rename buys
       nothing the comment does not) but the colours swapped with the meaning. */
    .fill {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 50%, transparent);
      transition: width 0.3s ease;
    }
    .fill-closed {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 18%, transparent);
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
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 2px;
      white-space: nowrap;
      min-width: 0;
      overflow: hidden;
    }
    /* The state word yields first; the percentage is the part that must never
       be cut, so it holds its intrinsic width. */
    .num-state {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .num-sep,
    .num-pct {
      flex: 0 0 auto;
    }
    /* In-transit motion indicator for no-feedback covers: a small direction
       arrow beside the percent, sized to the .num text. */
    .transit {
      --mdc-icon-size: 1em;
      color: var(--primary-color);
      flex-shrink: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .transit {
        animation: acp-transit-pulse 1.1s ease-in-out infinite;
      }
    }
    @keyframes acp-transit-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.35;
      }
    }
    .warn {
      color: var(--warning-color, orange);
      --mdc-icon-size: 16px;
    }
    /* On a position mismatch, recolour the leading (sun-blocking) segment with
       the error colour and lean on the warn icon at the end of the row. It is
       the segment that carries the cover hue, so tinting it is what reads as a
       divergence rather than as a second cover colour. */
    .mismatch .fill {
      background: color-mix(in srgb, var(--error-color, crimson) 35%, transparent);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 16px;
    }
  `,e([ge({attribute:!1})],Ys.prototype,"hass",void 0),e([ge({attribute:!1})],Ys.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Ys.prototype,"compact",void 0),e([ge({attribute:!1})],Ys.prototype,"coverColor",void 0),e([ge({attribute:!1})],Ys.prototype,"coverOrder",void 0),e([me()],Ys.prototype,"_dragPreview",void 0),Ys=e([pe("acp-cover-bar")],Ys);const rn=864e5;let an=nn=class extends de{constructor(){super(...arguments),this.samples=[],this.events=[],this.history=[],this.now=Date.now(),this._hoverIdx=null,this._onPointerMove=e=>{const t=e.currentTarget.getBoundingClientRect();if(t.width<=0)return;const o=(e.clientX-t.left)/t.width,i=Math.max(0,Math.min(1,o))*nn.VIEW_W;this._hoverIdx=this._nearestSampleIdx(i)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){const e=this.samples&&this.samples.length>0,t=this.history&&this.history.length>0;if(!e&&!t)return V;const{VIEW_W:o,VIEW_H:i,TOP_PAD:s,EVENT_HIT_W:n}=nn,r=i-s,a=ei(new Date(this.now)).getTime(),l=a+rn,c=function(e,t,o){if(void 0===t)return[pn,...un(e)].map((e,t)=>hn(e,o,t));if(0===t.length)return[hn(pn,o,0)];const i=new Set,s=t.filter(e=>!i.has(e.id)&&(i.add(e.id),!0));return s.filter((t,o)=>{return 0===o||(i=t.id,e.some(e=>"number"==typeof e[i]));var i}).map((e,t)=>hn(e,o,t))}(this.samples,this.axes,this.hass),d=c[0],h=e=>Ot(e,a,o),p=c.find(e=>"position"===e.key)??d,u=this.samples.map(e=>{const t=Date.parse(e.t),o=h(t),i=e[d.key];return{t:t,x:o,y:Nt(_n("number"==typeof i?i:e.position,d),s,r),sample:e,inDay:!Number.isNaN(t)&&t>=a&&t<=l}}),_=function(e,t,o){if(0===e.length||!(o>t))return[];const i=[...e].sort((e,t)=>e.t-t.t);let s=null;const n=[];for(const e of i){if(e.t>o)break;e.t<=t?s=e:n.push(e)}return s?[{t:t,value:s.value},...n]:n}(en(this.history??[]),a,this.now),g=tn(_,this.now).map(e=>{return`${h(e.t).toFixed(1)},${(t=e.value,Nt(_n(t,p),s,r)).toFixed(1)}`;var t}).join(" ");for(const e of c){let t=[];for(const o of u){if(!o.inDay)continue;const i=o.sample[e.key];"number"==typeof i?t.push(`${o.x.toFixed(1)},${Nt(_n(i,e),s,r).toFixed(1)}`):t.length>0&&(e.runs.push(t.join(" ")),t=[])}t.length>0&&e.runs.push(t.join(" "))}const m=c.filter(e=>e.runs.some(e=>e.includes(" "))),v=m.flatMap(e=>e.runs.map(t=>U`<polyline class="track ${e.cls}" points=${t} fill="none"></polyline>`)),f=(this.events??[]).map(e=>{const t=Date.parse(e.t);if(Number.isNaN(t)||t<a||t>l)return null;const o=h(t),r=`evt-${e.kind}`,c=function(e,t){const o=`forecast.event.${e.kind}`,i=st(o,t),s=i===o?e.label??e.kind:i,n=dt(e.t);return"—"===n?s:`${s} — ${n}`}(e,this.hass);return U`<g class="event-group" ${xo(c)}>
          <line
            class="event-hit"
            x1=${o.toFixed(1)}
            x2=${o.toFixed(1)}
            y1=${s}
            y2=${i}
            stroke-width=${n}
          ></line>
          <line
            class="event-marker ${r}"
            x1=${o.toFixed(1)}
            x2=${o.toFixed(1)}
            y1=${s}
            y2=${i}
          ></line>
        </g>`}).filter(e=>null!==e),b=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<u.length?u[this._hoverIdx]:null,y=b?U`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${b.x.toFixed(1)} x2=${b.x.toFixed(1)}
            y1=${s} y2=${i}></line>
          <circle class="hover-dot" cx=${b.x.toFixed(1)} cy=${b.y.toFixed(1)} r="3"></circle>
        </g>`:V,w=!b||b.t>this.now?null:on(_,b.t),x=b?H`<div class="hover-label" style=${`left: ${(b.x/o*100).toFixed(2)}%`}>
          ${function(e,t){const o=dt(e.t),i=t.find(e=>e.primary)??t[0],s=e[i.key],n=gn("number"==typeof s?s:e.position,i);return`${e.handler?`${o} · ${n} · ${e.handler}`:`${o} · ${n}`}${t.filter(e=>e!==i).map(t=>{const o=e[t.key];return"number"==typeof o?` · ${t.label}: ${gn(o,t)}`:""}).join("")}`}(b.sample,c)}${null!==w?` · ${st("forecast.legend_actual",this.hass)} ${gn(w,p)}`:""}
        </div>`:V,$=[0,6,12,18,24].map(e=>{const t=h(a+36e5*e);return U`
        <line class="grid faint" x1=${t} y1=${s} x2=${t} y2=${i-.5} />
        <text class="axis-label tick-time" x=${t} y=${i-3} text-anchor="middle">${e.toString().padStart(2,"0")}:00</text>
      `}),k=this.now,A=h(k),S=k>=a&&k<=l?U`<g class="now-group" ${xo(dt(new Date(k).toISOString()))}>
          <line class="now-hit" x1=${A.toFixed(1)} y1=${s} x2=${A.toFixed(1)} y2=${i-.5}></line>
          <line class="now" x1=${A.toFixed(1)} y1=${s} x2=${A.toFixed(1)} y2=${i-.5}></line>
        </g>`:V;return H`
      <div class="wrap">
        <svg
          viewBox="0 0 ${o} ${i}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <line class="baseline" x1="0" y1=${i-.5} x2=${o} y2=${i-.5}></line>
          <text class="axis-label" x="4" y=${s+8} text-anchor="start">
            ${gn(d.max,d)}
          </text>
          ${$}
          <!-- Actual UNDER the forecast, deliberately. SVG paints in document
               order and .actual-curve is the thicker stroke (1.75 vs 1.5), so
               drawing it last hid the forecast completely wherever the two
               agreed — which is most of a normal day, and read as "the blue line
               is missing" rather than "the lines coincide". Underneath, the
               extra width becomes a halo: agreement shows as a blue core in a
               magenta casing, divergence still shows two separate lines. -->
          ${g?U`<polyline class="track actual-curve" points=${g} fill="none"></polyline>`:V}
          ${v} ${f} ${y} ${S}
        </svg>
        ${this._renderLegend(m,t)} ${x}
      </div>
    `}_renderLegend(e,t){if(e.length<2&&!t)return V;const o=e.length>1;return H`<div class="legend">
      ${e.map(e=>H`<span class="legend-item"
            ><span class="swatch ${e.cls}"></span>${e.primary&&!o?st("forecast.legend_forecast",this.hass):e.label}</span
          >`)}
      ${t?H`<span class="legend-item"
            ><span class="swatch actual-curve"></span>${st("forecast.legend_actual",this.hass)}</span
          >`:V}
    </div>`}_nearestSampleIdx(e){const t=ei(new Date(this.now)).getTime(),o=t+rn;let i=-1,s=Number.POSITIVE_INFINITY;for(let n=0;n<this.samples.length;n++){const r=Date.parse(this.samples[n].t);if(Number.isNaN(r)||r<t||r>o)continue;const a=Ot(r,t,nn.VIEW_W),l=Math.abs(a-e);l<s&&(s=l,i=n)}return i>=0?i:null}};an.VIEW_W=600,an.VIEW_H=80,an.TOP_PAD=10,an.EVENT_HIT_W=12,an.styles=a`
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
    /* One color per plotted series, declared once as --acp-track-color and then
       consumed as a stroke by the polyline and as a border color by the legend
       swatch carrying the same class. That shared declaration is what keeps the
       legend honest: a track cannot change color without its swatch following. */
    .track {
      stroke: var(--acp-track-color, var(--primary-color));
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .track.secondary {
      stroke-dasharray: 4 2;
    }
    .track.actual-curve {
      stroke-width: 1.75;
    }
    .curve {
      --acp-track-color: var(--primary-color);
    }
    /* Recorded actual position: a solid contrasting line over the forecast so
       "predicted vs. reality" reads at a glance. Uses a distinct literal color
       (not --info-color, which collides with the blue --primary-color forecast
       in many themes); overridable via --acp-actual-color. */
    .actual-curve {
      --acp-track-color: var(--acp-actual-color, #e040fb);
    }
    /* Secondary-axis palette. Deliberately clear of every color already spoken
       for on this strip: the primary blue, the magenta actual line, and the
       amber/orange/green/grey of the sunrise, sunset and acceptance-angle
       markers. It notably does NOT use --accent-color, which these tracks used
       to take and which resolves to the same amber as the sunrise marker in
       HA's stock dark theme, so a horizontal tilt track and a vertical sunrise
       line were drawn identically. */
    .axis-c0 {
      --acp-track-color: var(--acp-forecast-axis-1, #26a69a);
    }
    .axis-c1 {
      --acp-track-color: var(--acp-forecast-axis-2, #7e57c2);
    }
    .axis-c2 {
      --acp-track-color: var(--acp-forecast-axis-3, #8d6e63);
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      margin-top: 2px;
      font-size: 0.68rem;
      color: var(--secondary-text-color, #888);
    }
    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .swatch {
      display: inline-block;
      width: 12px;
      height: 0;
      border-top: 2px solid var(--acp-track-color, currentColor);
    }
    .swatch.secondary {
      border-top-style: dashed;
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
  `,e([ge({attribute:!1})],an.prototype,"hass",void 0),e([ge({attribute:!1})],an.prototype,"samples",void 0),e([ge({attribute:!1})],an.prototype,"events",void 0),e([ge({attribute:!1})],an.prototype,"history",void 0),e([ge({attribute:!1})],an.prototype,"now",void 0),e([ge({attribute:!1})],an.prototype,"axes",void 0),e([me()],an.prototype,"_hoverIdx",void 0),an=nn=e([pe("acp-forecast-strip")],an);const ln=new Set(["t","position","handler"]),cn=3;function dn(e,t){const o=qe[e.id];return o?st(o,t):e.label?e.label:e.id.charAt(0).toUpperCase()+e.id.slice(1)}function hn(e,t,o){return{key:e.id,primary:0===o,label:dn(e,t),min:e.min,max:e.max,unit:e.unit,cls:0===o?"curve":`axis-c${(o-1)%cn} secondary`,runs:[]}}const pn={id:"position",label:"",min:0,max:100,unit:"%"};function un(e){for(const t of e)for(const e of Object.keys(t))if(!ln.has(e)&&"number"==typeof t[e])return[{id:e,label:"",min:0,max:100,unit:"%"}];return[]}function _n(e,t){const o=t.max-t.min;return 0===o?0:function(e){return Number.isNaN(e)||e<0?0:e>100?100:e}((e-t.min)/o*100)}function gn(e,t){const o=Math.round(function(e,t){return Number.isNaN(e)?t.min:Math.max(t.min,Math.min(t.max,e))}(e,t));return`${o}${""===t.unit||"%"===t.unit||"°"===t.unit?"":" "}${t.unit}`}const mn=["sol_elev_deg","gamma_deg"],vn=["position_pct"],fn=new Set([...mn,...vn,"status","cover_type","tilt"]),bn={cover_blind:["effective_distance_m","adjusted_height_m","safety_margin"],cover_awning:["awn_angle_deg","vertical_position_m","length_m"],cover_tilt:["slat_angle_raw_deg","tilt_mode","max_degrees"]},yn=new Set([...mn,...vn,...Object.values(bn).flat()]);function wn(e,t){return null==t?"—":"boolean"==typeof t?t?"✓":"✗":Array.isArray(t)?t.length?t.join(", "):"—":"number"==typeof t?Number.isNaN(t)?"—":"position_pct"===e||e.endsWith("_pct")?`${Math.round(t)}%`:e.endsWith("_deg")?`${t.toFixed(1)}°`:e.endsWith("_m")?`${t.toFixed(3)} m`:e.endsWith("_rad")?`${t.toFixed(3)} rad`:t.toFixed(3):String(t)}function xn(e,t,o){const i=[];for(const o of t)o in e&&i.push({key:o,value:wn(o,e[o]),curated:yn.has(o)});return i}function $n(e,t,o){const i=xn(e,mn),s=xn(e,vn);let n;if(o){const o=bn[t]??[],i=Object.keys(e).filter(e=>!fn.has(e)&&!o.includes(e));n=[...o.filter(t=>t in e),...i]}else n=(bn[t]??[]).filter(t=>t in e);const r=xn(e,n),a=e.position_pct;return{status:"string"==typeof e.status?e.status:void 0,hasTarget:"number"==typeof a&&!Number.isNaN(a),inputs:i,intermediates:r,output:s}}function kn(e,t){const o="string"==typeof e.cover_type?e.cover_type:"",i=$n(e,o,t);let s;if("cover_venetian"===o){const o=e.tilt;o&&"object"==typeof o&&(s=$n(o,"cover_tilt",t))}return{coverType:o,position:i,tilt:s}}let An=class extends de{constructor(){super(...arguments),this.compact=!1,this._showAll=!1,this._toggleShowAll=()=>{this._showAll=!this._showAll}}shouldUpdate(e){return e.size>1||!e.has("hass")||ve(e.get("hass"),this.hass,[this.discovered?.entities.solar_calculation_sensor])}render(){if(!this.hass||!this.discovered)return V;const e=this.discovered.entities.solar_calculation_sensor;if(!e)return V;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return V;const o=t.attributes,i=kn(o,this._showAll),s=function(e){const t=kn(e,!0),o=kn(e,!1),i=e=>e.position.intermediates.length+(e.tilt?.intermediates.length??0);return Math.max(0,i(t)-i(o))}(o);return H`
      <div class="wrap">
        <div class="head">
          <span class="label">${st("solar.title",this.hass)}</span>
          ${this._statusChip(i.position.status)}
        </div>
        ${this._axis(i.position,i.tilt?st("solar.axis_position",this.hass):void 0)}
        ${i.tilt?this._axis(i.tilt,st("solar.axis_tilt",this.hass)):V}
        ${s>0?H`<button class="show-all" type="button" @click=${this._toggleShowAll}>
              ${this._showAll?st("solar.show_less",this.hass):st("solar.show_all",this.hass,{count:s})}
            </button>`:V}
      </div>
    `}_statusChip(e){if(!e)return V;const t=e.startsWith("Direct"),o=this._statusSlug(e),i="_unknown"===o?e:st(`solar.status.${o}`,this.hass);return H`<span class="status-chip ${t?"direct":"default"}">${i}</span>`}_statusSlug(e){return{"Direct Sun":"direct_sun","Default: FOV Exit":"fov_exit","Default: Elevation Limit":"elevation_limit","Default: Sunset Offset":"sunset_offset","Default: Blind Spot":"blind_spot",Default:"default"}[e]??"_unknown"}_axis(e,t){return H`
      <div class="axis">
        ${t?H`<div class="axis-title dim">${t}</div>`:V}
        ${this._group(st("solar.group_inputs",this.hass),e.inputs)}
        ${this._group(st("solar.group_intermediates",this.hass),e.intermediates)}
        ${e.hasTarget?this._group(st("solar.group_output",this.hass),e.output):H`<div class="no-target dim">
              ${st("solar.no_target",this.hass,{status:e.status??"—"})}
            </div>`}
      </div>
    `}_group(e,t){return 0===t.length?V:H`
      <div class="group">
        <div class="group-label dim">${e}</div>
        <div class="rows">
          ${t.map(e=>H`<div class="row">
                <span class="key ${e.curated?"":"raw"}"
                  >${e.curated?st(`solar.field.${e.key}`,this.hass):e.key}</span
                >
                <span class="value">${e.value}</span>
              </div>`)}
        </div>
      </div>
    `}};function Sn(e){const t=new Map;let o=0;for(const i of e){const e=Math.max(0,i.end-i.start);0!==e&&(t.set(i.state,(t.get(i.state)??0)+e),o+=e)}return 0===o?[]:[...t.entries()].map(([e,t])=>({handler:e,ms:t,fraction:t/o})).sort((e,t)=>t.ms-e.ms)}function Cn(e,t){let o=0;for(const i of e)t(i.state)&&(o+=Math.max(0,i.end-i.start));return o}function En(e){const t=Math.round(e/6e4);if(t<1)return"<1m";const o=Math.floor(t/60),i=t%60;return 0===o?`${i}m`:0===i?`${o}h`:`${o}h ${i}m`}function zn(e){const t=e.services;return!!t?.[Te]?.get_diagnostics}function Mn(e){if(!e||"object"!=typeof e||Array.isArray(e))return null;const t=e,o="string"==typeof t.ts?t.ts:null,i="string"==typeof t.event?t.event:null;if(null===o||null===i)return null;const s=Date.parse(o);if(Number.isNaN(s))return null;const n={};for(const[e,o]of Object.entries(t))"ts"!==e&&"event"!==e&&(n[e]=o);return{ts:o,t:s,event:i,fields:n}}async function Tn(e,t){const o={events:[],window:null,bufferSize:null,available:!1,raw:null};if(!zn(e))return o;const i=e.callService;let s;try{s=await i(Te,"get_diagnostics",{config_entry_id:[t]},void 0,!1,!0)}catch{return o}return function(e,t){const o={events:[],window:null,bufferSize:null,available:!1,raw:null};if(!e||"object"!=typeof e)return o;const i=e.entries;if(!i||"object"!=typeof i)return o;const s=i[t];if(!s||"object"!=typeof s)return o;const n=s.diagnostics;if(!n||"object"!=typeof n)return o;if("error"in n)return o;const r=Array.isArray(n.event_timeline)?n.event_timeline:[],a=[];for(const e of r){const t=Mn(e);t&&a.push(t)}a.sort((e,t)=>e.t-t.t);const l=n.data_window,c=l&&"object"==typeof l?{start:"string"==typeof l.start?l.start:null,end:"string"==typeof l.end?l.end:null,capturedAt:"string"==typeof l.captured_at?l.captured_at:null}:null,d=n.debug_config?.debug_event_buffer_size;return{events:a,window:c,bufferSize:"number"==typeof d?d:null,available:!0,raw:e}}(s&&"object"==typeof s&&"response"in s?s.response:s,t)}function In(e){return"string"==typeof e&&e.length>0?e:null}function Pn(e){if(!e||"object"!=typeof e||Array.isArray(e))return null;const t=e,o=t.when;return"number"==typeof o&&Number.isFinite(o)?{t:1e3*o,entityId:In(t.entity_id),name:In(t.name)??In(t.entity_id)??"",state:In(t.state),message:In(t.message),icon:In(t.icon),contextUserId:In(t.context_user_id),contextName:In(t.context_name),contextDomain:In(t.context_domain),contextService:In(t.context_service)}:null}async function On(e,t,o,i){const s=t.filter(e=>"string"==typeof e&&e.length>0);if(0===s.length)return[];try{return function(e){if(!Array.isArray(e))return[];const t=[];for(const o of e){const e=Pn(o);e&&t.push(e)}return t.sort((e,t)=>t.t-e.t),t}(await e.callWS({type:"logbook/get_events",start_time:new Date(o).toISOString(),end_time:new Date(i).toISOString(),entity_ids:s}))}catch{return[]}}function Nn(e,t){if(e.contextName)return e.contextName;const o=e.contextUserId;return o?t.get(o)??null:null}An.styles=a`
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
  `,e([ge({attribute:!1})],An.prototype,"hass",void 0),e([ge({attribute:!1})],An.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],An.prototype,"compact",void 0),e([me()],An.prototype,"_showAll",void 0),An=e([pe("acp-solar-calc")],An);const Dn={cover_command_sent:{skipped:!1},end_time_default_sent:{skipped:!1},reconcile_gave_up:{skipped:!0},reconcile_skipped_in_transit:{skipped:!0}},Bn=["position","target_position","to"];function Fn(e,t){return t?100-e:e}function Rn(e,t=!1){const o=[],i=new Set(["entity_id","service","entity_ids"]);for(const s of Bn){const n=e[s];if("number"==typeof n&&Number.isFinite(n)){o.push(`${s} ${Math.round(Fn(n,t))}%`),i.add(s);break}}for(const[t,s]of Object.entries(e))i.has(t)||null!=s&&""!==s&&"object"!=typeof s&&o.push(`${t} ${String(s)}`);return o.length>0?o.join(" · "):null}var jn;const Ln=36e5,Kn=864e5;let Gn=jn=class extends de{constructor(){super(...arguments),this.hours=24,this.advancedOpen=!1,this.hideAdvanced=!1,this.showWindowPicker=!0,this.active=!0,this._target=[],this._actual=[],this._perCover={},this._tiltTarget=[],this._tiltActual={},this._copied=!1,this._whoWon=[],this._controlStatus=[],this._stateBands={},this._activity=[],this._loading=!1,this._loaded=!1,this._timeline=null,this._eventFilter="",this._advanced=!1,this._maximized=null,this._hoverT=null,this._now=Date.now(),this._cancelMinuteTimer=null,this._minutesSinceFetch=0,this._fetchKey=null,this._onPointerMove=e=>{const t=this.renderRoot.querySelector(".track-plot");if(!t)return;const o=t.getBoundingClientRect();if(o.width<=0)return;const i=Math.max(0,Math.min(1,(e.clientX-o.left)/o.width));this._hoverT=this._start+i*(this._now-this._start)},this._onPointerLeave=()=>{this._hoverT=null}}get _posH(){return"tracks"===this._maximized?jn.POS_H_MAX:jn.POS_H}connectedCallback(){super.connectedCallback(),this._advanced=this.advancedOpen}disconnectedCallback(){super.disconnectedCallback(),this._stopMinuteTimer()}updated(e){e.has("advancedOpen")&&(this._advanced=this.advancedOpen),e.has("_maximized")&&this.toggleAttribute("maximized",null!==this._maximized),e.has("active")&&!this.active&&(this._fetchKey=null,this._minutesSinceFetch=0,null!==this._maximized&&(this._maximized=null,this.dispatchEvent(new CustomEvent("acp-history-expand",{detail:{expanded:!1,section:null},bubbles:!0,composed:!0})))),this._syncMinuteTimer(),this._maybeFetch()}shouldUpdate(e){return e.size>1||!e.has("hass")}get _entryId(){return this.discovered?.entry_id??null}_syncMinuteTimer(){this.active&&null===this._cancelMinuteTimer?this._cancelMinuteTimer=vi(()=>{this._minutesSinceFetch+=1,this._minutesSinceFetch>=5?(this._fetchKey=null,this._maybeFetch()):this.requestUpdate()}):this.active||this._stopMinuteTimer()}_stopMinuteTimer(){null!==this._cancelMinuteTimer&&(this._cancelMinuteTimer(),this._cancelMinuteTimer=null)}_maybeFetch(){if(!this.active||!this.hass||!this.discovered)return;const e=this._entryId;if(!e)return;const t=`${e}|${this.hours}|${St(this.discovered)}`;t!==this._fetchKey&&(this._fetchKey=t,this._minutesSinceFetch=0,this._fetch(t))}async _fetch(e){const t=this.hass,o=this.discovered,i=Date.now(),s=i-this.hours*Ln;this._loading=!0,this._now=i;const n=o.entities,r=o.managed_covers??[],a=St(o),l=kt(o).find(e=>"tilt"===e.id),c=l?.inverted??!1,d=!!l,h=[];n.target_position_sensor&&h.push(n.target_position_sensor),d&&n.target_tilt_sensor&&h.push(n.target_tilt_sensor),n.control_status_sensor&&h.push(n.control_status_sensor),n.decision_trace_sensor&&h.push(n.decision_trace_sensor);for(const e of Qe){const t=n[e.role];t&&h.push(t)}const p=[...r];for(const e of Qe){const t=n[e.role];t&&p.push(t)}n.control_status_sensor&&p.push(n.control_status_sensor),n.decision_trace_sensor&&p.push(n.decision_trace_sensor),n.last_action_sensor&&p.push(n.last_action_sensor);const u=this._show("actions"),_=this._show("position")&&r.length>0,[g,m,v,f]=await Promise.all([_?Gs(t,r,s,i,{inverted:a,tiltInverted:c,wantTilt:d}):Promise.resolve({position:{},tilt:{}}),sn(t,h,s,i),u?On(t,p,s,i):Promise.resolve([]),u||this._advanced?Tn(t,this._entryId??""):Promise.resolve(null)]);if(this._fetchKey!==e)return;this._actual=function(e){const t={};for(const[o,i]of Object.entries(e)){const e=i.map(e=>({t:Date.parse(e.t),position:e.position})).filter(e=>!Number.isNaN(e.t));e.length>0&&(t[o]=e)}return Ks(t)}(g.position),this._perCover=r.length>1?g.position:{},this._tiltActual=g.tilt,this._tiltTarget=d&&n.target_tilt_sensor?Js(m[n.target_tilt_sensor]??[]):[],this._target=n.target_position_sensor?Js(m[n.target_position_sensor]??[],{preferAttribute:"linear_position",inverted:a}):[],this._whoWon=n.decision_trace_sensor?Xs(m[n.decision_trace_sensor]??[],s,i):[],this._controlStatus=n.control_status_sensor?Xs(m[n.control_status_sensor]??[],s,i):[];const b={};for(const e of Qe){const t=n[e.role];t&&(b[e.role]=Xs(m[t]??[],s,i))}this._stateBands=b,f&&(this._timeline=f),this._activity=u?function(e,t,o,i){const s=o.filter(e=>e.t>=i.startMs&&e.t<=i.endMs).map(e=>function(e,t=!1){const o=Dn[e.event];if(!o)return null;const i="string"==typeof e.fields.service?e.fields.service:null,s="string"==typeof e.fields.entity_id?e.fields.entity_id:null;return{t:e.t,source:"command",title:i??e.event,name:null,entityId:s&&s.length>0?s:null,detail:Rn(e.fields,t),service:i,triggeredBy:null,skipped:o.skipped}}(e,i.inverted)).filter(e=>null!==e),n=[...t].sort((e,t)=>e.t-t.t),r=new Set;for(const e of s)if(e.entityId)for(const t of n)if(!r.has(t)&&t.entityId===e.entityId&&!(t.t<e.t||t.t-e.t>5e3||t.contextUserId||t.contextName)){r.add(t);break}const a=function(e){const t=new Map;for(const o of Object.values(e.states??{})){if(!o.entity_id.startsWith("person."))continue;const e=o.attributes.user_id,i=o.attributes.friendly_name;"string"==typeof e&&"string"==typeof i&&i.length>0&&t.set(e,i)}const o=e.user;return o?.id&&o.name&&!t.has(o.id)&&t.set(o.id,o.name),t}(e),l=[...s,...t.filter(e=>!r.has(e)).map(t=>function(e,t,o){const i=e.entityId?o.states?.[e.entityId]?.attributes?.friendly_name:void 0;return{t:e.t,source:"logbook",title:e.state??e.message??"",name:i||e.name||null,entityId:e.entityId,detail:null,service:null,triggeredBy:Nn(e,t),skipped:!1}}(t,a,e))];return l.sort((e,t)=>t.t-e.t),l}(t,v,f?.events??[],{startMs:s,endMs:i,inverted:a}):[],this._loading=!1,this._loaded=!0}_show(e){return!1!==this.tracks?.[e]}_setHours(e){e!==this.hours&&(this.hours=e,this.dispatchEvent(new CustomEvent("acp-history-hours",{detail:{hours:e},bubbles:!0,composed:!0})))}_refresh(){this._fetchKey=null,this._timeline=null,this._maybeFetch()}_toggleMaximize(e){this._maximized=this._maximized===e?null:e,"events"===this._maximized&&null===this._timeline&&Tn(this.hass,this._entryId??"").then(e=>{this._timeline=e}),this.dispatchEvent(new CustomEvent("acp-history-expand",{detail:{expanded:null!==this._maximized,section:this._maximized},bubbles:!0,composed:!0}))}_maximizeButton(e){const t=this._maximized===e,o=st(t?"history.collapse":"history.expand",this.hass);return H`<button
      type="button"
      class="icon-btn"
      @click=${()=>this._toggleMaximize(e)}
      ${xo(o)}
      aria-label=${o}
      aria-pressed=${t?"true":"false"}
    >
      <ha-icon icon=${t?"mdi:arrow-collapse":"mdi:arrow-expand"}></ha-icon>
    </button>`}_toggleAdvanced(){this._advanced=!this._advanced,this._advanced&&null===this._timeline&&Tn(this.hass,this._entryId??"").then(e=>{this._timeline=e})}async _copyDiagnostics(){const e=this._timeline?.raw;if(null!=e)try{await navigator.clipboard.writeText(JSON.stringify(e,null,2)),this._copied=!0,setTimeout(()=>{this._copied=!1},2e3)}catch{}}_showMore(e,t){const o=new URLSearchParams;t.length>0&&o.set("entity_id",t.join(",")),o.set("start_date",new Date(this._start).toISOString()),o.set("end_date",new Date(this._now).toISOString());const i=`/${e}?${o.toString()}`;history.pushState(null,"",i),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this.dispatchEvent(new CustomEvent("acp-history-closed",{bubbles:!0,composed:!0}))}get _start(){return this._now-this.hours*Ln}_pct(e){const t=this._now-this._start;return t>0?Math.max(0,Math.min(100,(e-this._start)/t*100)):0}_x(e){return function(e,t,o,i){const s=o-t;if(!(s>0))return 0;const n=(e-t)/s;return Math.max(0,Math.min(i,n*i))}(e,this._start,this._now,jn.VIEW_W)}_stepPoints(e,t){return tn(e,this._now).map(e=>`${this._x(e.t).toFixed(1)},${t(e.value).toFixed(1)}`).join(" ")}render(){return this.hass&&this.discovered?null!==this._maximized?this._renderMaximized():H`
      <div class="history">
        ${this._renderToolbar()} ${this._renderStats()} ${this._renderReadout()}
        <div
          class="tracks"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          ${this._show("position")?this._renderPositionTrack():V}
          ${this._show("position")?this._renderTiltTrack():V}
          ${this._show("who_won")?this._renderWhoWonTrack():V}
          ${this._show("who_won")?this._renderControlStatusTrack():V}
          ${this._show("context")?this._renderStateTracks():V} ${this._renderAxis()}
        </div>
        ${this._loading&&!this._loaded?H`<p class="dim">${st("history.loading",this.hass)}</p>`:V}
        ${this._show("actions")?this._renderActivity():V} ${this._renderAdvanced()}
      </div>
    `:V}_renderToolbar(){return this.showWindowPicker?H`
      <div class="toolbar">
        <div class="windows" role="group" aria-label=${st("history.window_label",this.hass)}>
          ${Xe.map(e=>H`
              <button
                type="button"
                class="chip ${e===this.hours?"on":""}"
                aria-pressed=${e===this.hours?"true":"false"}
                @click=${()=>this._setHours(e)}
              >
                ${st("history.window_hours",this.hass,{hours:e})}
              </button>
            `)}
        </div>
        <div class="toolbar-right">
          ${null===this._maximized?H`<button
                  type="button"
                  class="link"
                  @click=${()=>this._showMore("history",this._allEntityIds())}
                >
                  ${st("history.show_more",this.hass)}
                </button>`:V}
          <button
            type="button"
            class="icon-btn"
            @click=${this._refresh}
            ${xo(st("history.refresh",this.hass))}
            aria-label=${st("history.refresh",this.hass)}
          >
            <ha-icon icon="mdi:refresh" class=${this._loading?"spin":""}></ha-icon>
          </button>
          ${null===this._maximized?this._maximizeButton("tracks"):V}
        </div>
      </div>
    `:V}_allEntityIds(){const e=this.discovered.entities,t=[...this.discovered.managed_covers??[]];e.target_position_sensor&&t.push(e.target_position_sensor),e.control_status_sensor&&t.push(e.control_status_sensor),e.decision_trace_sensor&&t.push(e.decision_trace_sensor);for(const o of Qe){const i=e[o.role];i&&t.push(i)}return t}_renderReadout(){const e=this._hoverT;if(null===e)return H`<div class="readout dim">${this._renderRangeLabel()}</div>`;const t=[qn(e)],o=on(this._target,e);null!==o&&t.push(`${st("history.legend_target",this.hass)} ${Math.round(o)}%`);const i=on(en(this._actual),e);null!==i&&t.push(`${st("history.legend_actual",this.hass)} ${Math.round(i)}%`);const s=Un(this._whoWon,e);s&&t.push(this._handlerLabel(s.state));const n=Un(this._controlStatus,e);n&&!Ze.has(n.state)&&t.push(this._controlStatusLabel(n.state));for(const o of Qe){const i=Un(this._stateBands[o.role]??[],e);i&&Hn(i.state)&&t.push(st(o.key,this.hass))}return H`<div class="readout">${t.join(" · ")}</div>`}_renderRangeLabel(){const e=this._now-this._start>Kn,t=t=>e?`${Vn(t)} ${qn(t)}`:qn(t);return`${t(this._start)} → ${t(this._now)}`}_renderPositionTrack(){const{VIEW_W:e,POS_TOP_PAD:t}=jn,o=this._posH,i=o-t,s=e=>Nt(e,t,i),n=this._stepPoints(this._target,s),r=this._stepPoints(en(this._actual),s),a=Object.entries(this._perCover).map(([e,t])=>({id:e,points:this._stepPoints(en(t),s)})),l=!n&&!r;return H`
      <div class="track">
        <div class="track-label">${st("history.track_position",this.hass)}</div>
        <div class="track-plot">
          <svg
            viewBox="0 0 ${e} ${o}"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style="height: ${o}px"
          >
            ${this._sunShading(t,o)} ${this._gridLines(t,o)}
            <line class="baseline" x1="0" y1=${o-.5} x2=${e} y2=${o-.5}></line>
            ${a.map(e=>e.points?U`<polyline class="cover-curve" points=${e.points} fill="none"></polyline>`:V)}
            ${n?U`<polyline class="target-curve" points=${n} fill="none"></polyline>`:V}
            ${r?U`<polyline class="actual-curve" points=${r} fill="none"></polyline>`:V}
            ${this._hoverLine(t,o)}
          </svg>
          ${l?this._renderEmptyNote(this.discovered.managed_covers?.[0]):V}
          <span class="y-max">100%</span>
        </div>
      </div>
      ${l?V:this._renderPositionLegend(a.length>0)}
    `}_renderTiltTrack(){const{VIEW_W:e,POS_TOP_PAD:t}=jn,o=this._posH,i=Object.values(this._tiltActual);if(0===this._tiltTarget.length&&0===i.length)return V;const s=o-t,n=e=>Nt(e,t,s),r=this._stepPoints(this._tiltTarget,n),a=i.map(e=>this._stepPoints(en(e),n));return H`
      <div class="track">
        <div class="track-label">${st("covers.tilt_title",this.hass)}</div>
        <div class="track-plot">
          <svg
            viewBox="0 0 ${e} ${o}"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style="height: ${o}px"
          >
            ${this._sunShading(t,o)} ${this._gridLines(t,o)}
            <line class="baseline" x1="0" y1=${o-.5} x2=${e} y2=${o-.5}></line>
            ${a.map(e=>e?U`<polyline class="actual-curve" points=${e} fill="none"></polyline>`:V)}
            ${r?U`<polyline class="target-curve" points=${r} fill="none"></polyline>`:V}
            ${this._hoverLine(t,o)}
          </svg>
          <span class="y-max">100%</span>
        </div>
      </div>
    `}_sunShading(e,t){const o=[],i=t-e;for(const t of this._nightSegments()){const s=this._x(t.start),n=this._x(t.end)-s;n<=0||o.push(U`<rect class="night" x=${s.toFixed(1)} y=${e} width=${n.toFixed(1)} height=${i}></rect>`)}for(const t of this._stateBands.sun_infront_binary??[]){if(!Hn(t.state))continue;const s=this._x(t.start),n=this._x(t.end)-s;n<=0||o.push(U`<rect class="saa" x=${s.toFixed(1)} y=${e} width=${n.toFixed(1)} height=${i}></rect>`)}return o}_nightSegments(){const e=this.hass?.config?.latitude,t=this.hass?.config?.longitude;if("number"!=typeof e||"number"!=typeof t)return[];const o=[];let i=ei(new Date(this._start)).getTime();for(let s=0;s<8&&i<this._now;s++){const s=Jo(e,t,new Date(i));if(0===s.length)continue;const n=si(s);let r=s[0].t.getTime();for(const e of n){const t=s[e.startIdx].t.getTime();t>r&&o.push({start:r,end:t}),r=s[e.endIdx].t.getTime()}const a=s[s.length-1].t.getTime();r<a&&o.push({start:r,end:a});const l=ei(new Date(i+Kn+432e5)).getTime();i=l>i?l:i+Kn}return o.map(e=>({start:Math.max(e.start,this._start),end:Math.min(e.end,this._now)})).filter(e=>e.end>e.start)}_renderEmptyNote(e){const t=!!e&&!!this.hass.states?.[e];return H`<span class="empty-note"
      >${st(t?"history.no_recorder_data":"history.no_data",this.hass)}</span
    >`}_renderPositionLegend(e){return H`
      <div class="track">
        <div class="track-label"></div>
        <div class="legend">
          <span class="legend-item"
            ><span class="line-swatch target"></span>${st("history.legend_target",this.hass)}</span
          >
          <span class="legend-item"
            ><span class="line-swatch actual"></span>${st("history.legend_actual",this.hass)}</span
          >
          ${e?H`<span class="legend-item"
                ><span class="line-swatch cover"></span>${st("history.legend_per_cover",this.hass)}</span
              >`:V}
          <span class="legend-item"
            ><span class="swatch saa-swatch"></span>${st("history.legend_saa",this.hass)}</span
          >
          <span class="legend-item"
            ><span class="swatch night-swatch"></span>${st("history.legend_night",this.hass)}</span
          >
        </div>
      </div>
    `}_renderStats(){if(!this._loaded)return V;const e=function(e){const{moves:t,travel:o}=function(e){let t=0,o=0,i=null;for(const s of e)Number.isFinite(s.position)&&(null!==i&&s.position!==i&&(t+=1,o+=Math.abs(s.position-i)),i=s.position);return{moves:t,travel:Math.round(o)}}(e.actual);return{moves:t,travel:o,handlers:Sn(e.whoWon),activeMs:Cn(e.overrideBands,e.isActive)}}({actual:this._actual,whoWon:this._whoWon,overrideBands:this._stateBands.manual_override_binary??[],isActive:Hn});return 0===e.moves&&0===e.handlers.length?V:H`
      <div class="stats">
        <span class="stat"
          ><strong>${e.moves}</strong> ${st("history.stat_moves",this.hass)}</span
        >
        <span class="stat"
          ><strong>${e.travel}</strong> ${st("history.stat_travel",this.hass)}</span
        >
        ${e.activeMs>0?H`<span class="stat"
              ><strong>${En(e.activeMs)}</strong> ${st("history.stat_override",this.hass)}</span
            >`:V}
        ${e.handlers.slice(0,3).map(e=>{const t=Ke[this._badgeKind(e.handler)];return H`<span class="stat handler-stat">
            <span class="swatch" style="background:${t.bg};border-color:${t.fg}"></span>
            ${this._handlerLabel(e.handler)} ${En(e.ms)}
          </span>`})}
      </div>
    `}_renderWhoWonTrack(){const e=this._whoWon.map(e=>{const t=this._pct(e.start),o=Math.max(.2,this._pct(e.end)-t),i=Ke[this._badgeKind(e.state)],s=this._handlerLabel(e.state);return H`<div
        class="band"
        style=${`left:${t.toFixed(2)}%;width:${o.toFixed(2)}%;background:${i.bg};color:${i.fg};box-shadow:inset 0 0 0 1px ${i.fg}`}
        ${xo(`${s} — ${qn(e.start)} → ${qn(e.end)}`)}
      >
        ${o>=6?s:""}
      </div>`});return H`
      <div class="track">
        <div class="track-label">${st("history.track_who_won",this.hass)}</div>
        <div class="track-plot">
          <div class="bar">
            ${e}${this._hoverMarker()}
            ${0===e.length?H`<span class="empty-note">${st("history.no_data",this.hass)}</span>`:V}
          </div>
        </div>
      </div>
      ${this._renderWhoWonLegend()}
    `}_renderWhoWonLegend(){const e=new Map;for(const t of this._whoWon)e.set(this._badgeKind(t.state),t.state);return 0===e.size?V:H`
      <div class="track">
        <div class="track-label"></div>
        <div class="legend">
          ${[...e.entries()].map(([e,t])=>{const o=Ke[e];return H`<span class="legend-item">
              <span class="swatch" style="background:${o.bg};border-color:${o.fg}"></span>
              <ha-icon icon=${We[e]} style="color:${o.fg}"></ha-icon>
              ${this._handlerLabel(t)}
            </span>`})}
        </div>
      </div>
    `}_renderControlStatusTrack(){if(0===this._controlStatus.length)return V;const e=st("history.track_control_status",this.hass);return H`
      <div class="track">
        <div class="track-label" ${xo(e)}>${e}</div>
        <div class="track-plot">
          <div class="bar">
            ${this._controlStatus.map(e=>{const t=this._pct(e.start),o=Math.max(.2,this._pct(e.end)-t),i=this._controlStatusLabel(e.state),s=Ze.has(e.state);return H`<div
                class=${"band status "+(s?"active":"idle")}
                style=${`left:${t.toFixed(2)}%;width:${o.toFixed(2)}%`}
                ${xo(`${i} — ${qn(e.start)} → ${qn(e.end)}`)}
              >
                ${o>=6?i:""}
              </div>`})}${this._hoverMarker()}
          </div>
        </div>
      </div>
    `}_renderStateTracks(){return Qe.filter(e=>this.discovered.entities[e.role]).map(e=>{const t=this._stateBands[e.role]??[],o=st(e.key,this.hass);return H`
        <div class="track">
          <div class="track-label" ${xo(o)}>${o}</div>
          <div class="track-plot">
            <div class="bar">
              ${t.map(t=>{const i=this._pct(t.start),s=Math.max(.2,this._pct(t.end)-i),n=Hn(t.state),r=this._stateLabel(t.state);return H`<div
                  class=${`band state ${n?"on":"off"} ${e.cls}`}
                  style=${`left:${i.toFixed(2)}%;width:${s.toFixed(2)}%`}
                  ${xo(`${o}: ${r} — ${qn(t.start)} → ${qn(t.end)}`)}
                >
                  ${s>=6?r:""}
                </div>`})}${this._hoverMarker()}
              ${0===t.length?H`<span class="empty-note">${st("history.no_data",this.hass)}</span>`:V}
            </div>
          </div>
        </div>
      `})}_renderAxis(){const e=this._axisTicks();return H`
      <div class="track axis">
        <div class="track-label"></div>
        <div class="track-plot">
          <div class="axis-row">
            ${e.map((e,t)=>{return H`<span
                  class=${"axis-tick"+(0===t?" first":"")}
                  style="left:${this._pct(e).toFixed(2)}%"
                  >${0===t||(o=e,0===new Date(o).getHours())?Vn(e):qn(e)}</span
                >`;var o})}
          </div>
        </div>
      </div>
    `}_axisTicks(){const e=(this._now-this._start)/4,t=[];for(let o=0;o<=4;o++)t.push(Math.round((this._start+o*e)/Ln)*Ln);return t}_gridLines(e,t){return this._axisTicks().map(o=>{const i=this._x(o).toFixed(1);return U`<line class="grid" x1=${i} y1=${e} x2=${i} y2=${t}></line>`})}_hoverLine(e,t){if(null===this._hoverT)return V;const o=this._x(this._hoverT).toFixed(1);return U`<line class="hover-line" x1=${o} y1=${e} x2=${o} y2=${t}></line>`}_hoverMarker(){return null===this._hoverT?V:H`<div
      class="hover-marker"
      style="left:${this._pct(this._hoverT).toFixed(2)}%"
    ></div>`}_renderActivity(){const e=function(e){const t=new Map;for(const o of e){const e=new Date(o.t);e.setHours(0,0,0,0);const i=e.getTime(),s=t.get(i);s?s.push(o):t.set(i,[o])}return[...t.entries()].sort((e,t)=>t[0]-e[0]).map(([e,t])=>({dayMs:e,entries:[...t].sort((e,t)=>t.t-e.t)}))}(this._activity);return H`
      <div class="section">
        ${"activity"===this._maximized?V:H`<div class="section-head">
              <h4>${st("history.activity_title",this.hass)}</h4>
              <span class="head-actions">
                <button
                  type="button"
                  class="link"
                  @click=${()=>this._showMore("logbook",this._allEntityIds())}
                >
                  ${st("history.show_more",this.hass)}
                </button>
                ${this._maximizeButton("activity")}
              </span>
            </div>`}
        ${0===this._activity.length?H`<p class="dim">${st("history.activity_empty",this.hass)}</p>`:H`<div class="activity">
              ${e.map(e=>H`
                  <div class="day-head">${function(e,t,o){const i=new Date(t);i.setHours(0,0,0,0);const s=Math.round((i.getTime()-e)/Kn),n=new Date(e).toLocaleDateString([],{year:"numeric",month:"long",day:"numeric"});return 0===s?`${st("history.today",o)} · ${n}`:1===s?`${st("history.yesterday",o)} · ${n}`:n}(e.dayMs,this._now,this.hass)}</div>
                  <ul class="log">
                    ${e.entries.map(e=>this._renderActivityRow(e))}
                  </ul>
                `)}
            </div>`}
      </div>
    `}_renderActivityRow(e){const t=e.triggeredBy;return H`<li class=${`evt-row ${e.source}${e.skipped?" skipped":""}`}>
      <span class="dot"></span>
      <span class="evt-main">
        <span class="evt-title">${e.title}</span>
        ${e.detail?H`<span class="evt-detail">${e.detail}</span>`:V}
        ${e.name&&"logbook"===e.source?H`<span class="evt-entity">${e.name}</span>`:V}
      </span>
      ${t?H`<span class="who" ${xo(t)}>${function(e){const t=e.trim().split(/\s+/).filter(Boolean);return 0===t.length?"?":1===t.length?t[0].slice(0,2).toUpperCase():(t[0][0]+t[t.length-1][0]).toUpperCase()}(t)}</span>`:V}
      <span class="evt-time">${qn(e.t)}</span>
    </li>`}_renderMaximized(){const e=this._maximized,t={tracks:st("history.section_tracks",this.hass),activity:st("history.activity_title",this.hass),events:st("history.advanced",this.hass)},o="tracks"===e?"history":"activity"===e?"logbook":null;return H`
      <div class=${`history full full-${e}`}>
        <div class="full-head">
          <button type="button" class="disclosure" @click=${()=>this._toggleMaximize(e)}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
            ${t[e]}
          </button>
          <span class="head-actions">
            ${o?H`<button
                  type="button"
                  class="link"
                  @click=${()=>this._showMore(o,this._allEntityIds())}
                >
                  ${st("history.show_more",this.hass)}
                </button>`:V}
            ${this._maximizeButton(e)}
          </span>
        </div>
        ${"events"===e?V:this._renderToolbar()}
        ${"tracks"===e?H`
              ${this._renderStats()} ${this._renderReadout()}
              <div
                class="tracks"
                @pointermove=${this._onPointerMove}
                @pointerleave=${this._onPointerLeave}
              >
                ${this._show("position")?this._renderPositionTrack():V}
                ${this._show("position")?this._renderTiltTrack():V}
                ${this._show("who_won")?this._renderWhoWonTrack():V}
                ${this._show("who_won")?this._renderControlStatusTrack():V}
                ${this._show("context")?this._renderStateTracks():V} ${this._renderAxis()}
              </div>
            `:V}
        ${"activity"===e?this._renderActivity():V}
        ${"events"===e?this._renderEventBuffer():V}
      </div>
    `}_renderAdvanced(){return this.hideAdvanced?V:zn(this.hass)?H`
      <div class="section advanced">
        <div class="section-head">
          <button
            type="button"
            class="disclosure"
            aria-expanded=${this._advanced?"true":"false"}
            @click=${this._toggleAdvanced}
          >
            <ha-icon icon=${this._advanced?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
            ${st("history.advanced",this.hass)}
          </button>
          ${this._maximizeButton("events")}
        </div>
        <div class="advanced-body">${this._advanced?this._renderEventBuffer():V}</div>
      </div>
    `:V}_renderEventBuffer(){const e=this._timeline;if(null===e)return H`<p class="dim">${st("history.loading",this.hass)}</p>`;if(!e.available)return H`<p class="dim">${st("history.events_unavailable",this.hass)}</p>`;const t=this._eventFilter.trim().toLowerCase(),o=t?e.events.filter(e=>function(e){return`${e.event} ${Yn(e.fields)}`.toLowerCase()}(e).includes(t)):e.events;return H`
      <div class="events">
        <div class="events-meta">
          <span
            >${st("history.events_count",this.hass,{shown:o.length,total:e.events.length})}</span
          >
          ${null!==e.bufferSize?H`<span
                >${st("history.buffer_size",this.hass,{size:e.bufferSize})}</span
              >`:V}
          ${e.window?.start?H`<span
                >${st("history.data_window",this.hass,{from:dt(e.window.start),to:dt(e.window.end??e.window.start)})}</span
              >`:V}
          ${null!==e.raw&&void 0!==e.raw?H`<button type="button" class="link" @click=${()=>{this._copyDiagnostics()}}>
                ${this._copied?st("history.copied",this.hass):st("history.copy_diagnostics",this.hass)}
              </button>`:V}
        </div>
        <input
          class="events-search"
          type="search"
          .value=${this._eventFilter}
          placeholder=${st("history.events_search",this.hass)}
          aria-label=${st("history.events_search",this.hass)}
          @input=${e=>{this._eventFilter=e.target.value}}
        />
        ${0===o.length?H`<p class="dim">${st("history.events_empty",this.hass)}</p>`:H`<ul class="event-list">
              ${[...o].reverse().map(e=>H`<li class="evt sev-${Je[e.event]??"info"}">
                    <span class="evt-time">${dt(e.ts)}</span>
                    <span class="evt-name">${e.event}</span>
                    <span class="evt-fields">${Yn(e.fields)}</span>
                  </li>`)}
            </ul>`}
      </div>
    `}_badgeKind(e){return je[e]??"auto"}_handlerLabel(e){const t=Oe[e];if(t)return st(t,this.hass);const o=Ge[e];return o?st(o,this.hass):Wn(e)}_controlStatusLabel(e){const t=Ye[e];return t?st(t,this.hass):Wn(e)}_stateLabel(e){return"on"===e?st("dialog.on",this.hass):"off"===e?st("dialog.off",this.hass):e}};function Wn(e){if(!e)return e;const t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}function Hn(e){return"off"!==e&&"unavailable"!==e&&"unknown"!==e}function Un(e,t){for(const o of e)if(t>=o.start&&t<o.end)return o;return null}function qn(e){const t=new Date(e);return Number.isNaN(t.getTime())?"—":t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Vn(e){return new Date(e).toLocaleDateString([],{month:"short",day:"numeric"})}function Yn(e){const t=[];for(const[o,i]of Object.entries(e))null!=i&&""!==i&&t.push(`${o}=${"object"==typeof i?JSON.stringify(i):String(i)}`);return t.join("  ")}Gn.VIEW_W=600,Gn.POS_H=96,Gn.POS_H_MAX=220,Gn.POS_TOP_PAD=8,Gn.styles=a`
    :host {
      display: block;
    }
    /* Maximized mode: the host must fill its container for the chosen section's
       flex sizing to have anything to resolve against. */
    :host([maximized]) {
      height: 100%;
    }
    .history {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .history.full {
      height: 100%;
      min-height: 0;
    }
    .full-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    /* In full mode the list is the only scroller: everything above it is fixed
       chrome, and min-height 0 is what lets a flex child actually shrink so
       the list's own overflow engages instead of the page growing. */
    .history.full .events {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .history.full .event-list {
      flex: 1;
      min-height: 0;
      max-height: none;
      font-size: 0.72rem;
    }
    .history.full .evt {
      grid-template-columns: 64px 190px 1fr;
    }
    /* Activity maximized: the day-grouped feed becomes the only scroller,
       instead of a 300px window inside the page scroller. */
    .history.full-activity .section {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      border-top: none;
      padding-top: 0;
    }
    .history.full-activity .activity {
      flex: 1;
      min-height: 0;
      max-height: none;
    }
    /* Tracks maximized: taller band rows to match the taller plots, and the
       stack scrolls if the entry has enough entities to overflow. */
    .history.full-tracks .tracks {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      gap: 8px;
    }
    .history.full-tracks .bar {
      height: 30px;
    }
    .history.full-tracks .band {
      font-size: 0.72rem;
    }
    .history.full-tracks .track-label {
      font-size: 0.74rem;
    }
    .head-actions {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .windows {
      display: flex;
      gap: 4px;
    }
    .chip {
      font: inherit;
      font-size: 0.72rem;
      padding: 3px 9px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .chip.on {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .link {
      font: inherit;
      font-size: 0.76rem;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--primary-color);
    }
    .link:hover {
      text-decoration: underline;
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 2px;
      display: inline-flex;
    }
    .spin {
      animation: acp-spin 1s linear infinite;
    }
    @keyframes acp-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spin {
        animation: none;
      }
    }
    .readout {
      font-size: 0.74rem;
      color: var(--primary-text-color);
      min-height: 1.1em;
    }
    .dim {
      color: var(--secondary-text-color);
      margin: 0;
      font-size: 0.78rem;
    }
    .tracks {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .track {
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: 8px;
      align-items: center;
    }
    .track-label {
      font-size: 0.68rem;
      color: var(--secondary-text-color);
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .track-plot {
      position: relative;
      min-width: 0;
    }
    .track-plot svg {
      display: block;
      width: 100%;
      overflow: visible;
    }
    /* Band tracks are HTML, not SVG: a preserveAspectRatio="none" viewBox
       stretches text horizontally, and these bands must carry readable labels
       (HA writes the state name inside the band). */
    .bar {
      position: relative;
      height: 22px;
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
      background: var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .band {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      padding: 0 4px;
      box-sizing: border-box;
      font-size: 0.64rem;
      line-height: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Control status: green while acting, muted amber while deliberately idle —
       "not acting" is normal, not an error, so it must not read as a fault. */
    .band.status.active {
      background: #66bb6a;
      color: #1b3d1c;
    }
    .band.status.idle {
      background: var(--divider-color, rgba(0, 0, 0, 0.18));
      color: var(--primary-text-color);
    }
    .band.state.off {
      background: var(--history-unavailable-color, #9e9e9e);
      color: var(--primary-text-color);
      opacity: 0.55;
    }
    .band.state.on {
      color: #fff;
    }
    .band.state.on.ctx-sun {
      background: #fbc02d;
      color: #3e2723;
    }
    .band.state.on.ctx-glare {
      background: #ef5350;
    }
    .band.state.on.ctx-manual {
      background: #ff9800;
      color: #3e2723;
    }
    .band.state.on.ctx-mismatch {
      background: #ab47bc;
    }
    .band.state.on.ctx-enabled,
    .band.state.on.ctx-auto {
      background: #66bb6a;
      color: #1b3d1c;
    }
    .empty-note {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .y-max {
      position: absolute;
      top: 0;
      left: 2px;
      font-size: 0.6rem;
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .baseline {
      stroke: var(--divider-color, rgba(0, 0, 0, 0.12));
      stroke-width: 1;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 0.5;
      opacity: 0.35;
      vector-effect: non-scaling-stroke;
    }
    /* Target = what ACP commanded, actual = where the cover went. Same pairing
       and colors the forecast strip uses, so the two views read alike. */
    .target-curve {
      stroke: var(--primary-color);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .actual-curve {
      stroke: var(--acp-actual-color, #e040fb);
      stroke-width: 1.75;
      vector-effect: non-scaling-stroke;
    }
    .hover-line {
      stroke: var(--primary-text-color, currentColor);
      stroke-width: 1;
      stroke-dasharray: 1 2;
      opacity: 0.55;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .hover-marker {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--primary-text-color, currentColor);
      opacity: 0.55;
      pointer-events: none;
    }
    .axis-row {
      position: relative;
      height: 14px;
    }
    .axis-tick {
      position: absolute;
      transform: translateX(-50%);
      font-size: 0.6rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .axis-tick.first {
      transform: none;
      left: 0 !important;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 0.66rem;
      color: var(--secondary-text-color);
    }
    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .legend-item ha-icon {
      --mdc-icon-size: 12px;
      width: 12px;
      height: 12px;
    }
    .swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      border: 1px solid;
      display: inline-block;
    }
    .line-swatch {
      width: 14px;
      height: 0;
      border-top: 2px solid currentColor;
      display: inline-block;
    }
    .line-swatch.target {
      color: var(--primary-color);
    }
    .line-swatch.actual {
      color: var(--acp-actual-color, #e040fb);
    }
    .line-swatch.cover {
      color: var(--secondary-text-color);
      border-top-style: dashed;
    }
    .saa-swatch {
      background: rgba(251, 192, 45, 0.35);
      border-color: rgba(251, 192, 45, 0.8);
    }
    .night-swatch {
      background: rgba(63, 81, 181, 0.18);
      border-color: rgba(63, 81, 181, 0.5);
    }
    /* Cause, drawn behind the curves: dimmed night, highlighted acceptance
       angle. Both are backdrop, so they must never compete with the lines. */
    .night {
      fill: var(--acp-night-color, rgba(63, 81, 181, 0.14));
    }
    .saa {
      fill: var(--acp-saa-color, rgba(251, 192, 45, 0.22));
    }
    /* Individual covers sit under the aggregate: thin, dashed, muted. */
    .cover-curve {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.65;
      vector-effect: non-scaling-stroke;
    }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
    }
    .stat strong {
      color: var(--primary-text-color);
      font-weight: 600;
    }
    .handler-stat {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .section {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-top: 8px;
    }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .section h4 {
      margin: 0 0 6px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .activity {
      max-height: 300px;
      overflow-y: auto;
    }
    .day-head {
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 6px 0 2px;
      position: sticky;
      top: 0;
      background: var(--card-background-color, #fff);
      padding: 2px 0;
    }
    .log {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 0.74rem;
    }
    .evt-row {
      display: grid;
      grid-template-columns: 14px 1fr auto auto;
      gap: 8px;
      align-items: baseline;
      padding: 3px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }
    .evt-row:last-child {
      border-bottom: none;
    }
    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--secondary-text-color);
      align-self: center;
    }
    .evt-row.command .dot {
      background: var(--primary-color);
    }
    .evt-row.skipped .dot {
      background: #ff9800;
    }
    .evt-row.skipped .evt-title {
      color: var(--secondary-text-color);
    }
    .evt-main {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
      min-width: 0;
    }
    .evt-title {
      color: var(--primary-text-color);
    }
    .evt-detail {
      font-family: var(--code-font-family, monospace);
      font-size: 0.7rem;
      color: var(--primary-color);
    }
    .evt-entity {
      font-size: 0.68rem;
      color: var(--secondary-text-color);
    }
    .who {
      display: inline-grid;
      place-items: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--light-primary-color, #b3e5fc);
      color: var(--primary-text-color);
      font-size: 0.6rem;
      font-weight: 600;
      align-self: center;
    }
    .evt-time {
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
      font-size: 0.7rem;
    }
    .disclosure {
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-text-color);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .disclosure ha-icon {
      --mdc-icon-size: 16px;
      width: 16px;
      height: 16px;
    }
    .events {
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .events-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 0.66rem;
      color: var(--secondary-text-color);
    }
    .events-search {
      font: inherit;
      font-size: 0.72rem;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
    }
    .event-list {
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 260px;
      overflow-y: auto;
      font-size: 0.68rem;
    }
    .evt {
      display: grid;
      grid-template-columns: 52px 150px 1fr;
      gap: 6px;
      padding: 2px 0 2px 6px;
      border-left: 3px solid transparent;
      align-items: baseline;
    }
    .evt-name {
      font-weight: 600;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .evt-fields {
      color: var(--secondary-text-color);
      font-family: var(--code-font-family, monospace);
      overflow-wrap: anywhere;
    }
    .sev-info {
      border-left-color: var(--divider-color, rgba(0, 0, 0, 0.2));
    }
    .sev-action {
      border-left-color: #4caf50;
    }
    .sev-warn {
      border-left-color: #ff9800;
    }
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
  `,e([ge({attribute:!1})],Gn.prototype,"hass",void 0),e([ge({attribute:!1})],Gn.prototype,"discovered",void 0),e([ge({type:Number})],Gn.prototype,"hours",void 0),e([ge({attribute:!1})],Gn.prototype,"tracks",void 0),e([ge({type:Boolean})],Gn.prototype,"advancedOpen",void 0),e([ge({type:Boolean})],Gn.prototype,"hideAdvanced",void 0),e([ge({type:Boolean})],Gn.prototype,"showWindowPicker",void 0),e([ge({type:Boolean})],Gn.prototype,"active",void 0),e([me()],Gn.prototype,"_target",void 0),e([me()],Gn.prototype,"_actual",void 0),e([me()],Gn.prototype,"_perCover",void 0),e([me()],Gn.prototype,"_tiltTarget",void 0),e([me()],Gn.prototype,"_tiltActual",void 0),e([me()],Gn.prototype,"_copied",void 0),e([me()],Gn.prototype,"_whoWon",void 0),e([me()],Gn.prototype,"_controlStatus",void 0),e([me()],Gn.prototype,"_stateBands",void 0),e([me()],Gn.prototype,"_activity",void 0),e([me()],Gn.prototype,"_loading",void 0),e([me()],Gn.prototype,"_loaded",void 0),e([me()],Gn.prototype,"_timeline",void 0),e([me()],Gn.prototype,"_eventFilter",void 0),e([me()],Gn.prototype,"_advanced",void 0),e([me()],Gn.prototype,"_maximized",void 0),e([me()],Gn.prototype,"_hoverT",void 0),e([me()],Gn.prototype,"_now",void 0),Gn=jn=e([pe("acp-history-view")],Gn);let Zn=class extends de{constructor(){super(...arguments),this.open=!1,this.hours=24,this._expanded=null,this._onKeyDown=e=>{this.open&&"Escape"===e.key&&this._close()},this._close=()=>{this.open=!1,this._expanded=null,this.dispatchEvent(new CustomEvent("acp-history-closed",{bubbles:!0,composed:!0}))},this._onBackdrop=e=>{e.target===e.currentTarget&&this._close()}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeyDown)}render(){if(!this.hass||!this.discovered)return V;const e=this.discovered.entry_title||st("history.title",this.hass);return H`
      <div
        class="backdrop"
        role="dialog"
        aria-modal="true"
        aria-label=${st("history.title",this.hass)}
        @click=${this._onBackdrop}
      >
        <div
          class=${`panel${this._expanded?" expanded":""}${"activity"===this._expanded?" narrow":""}`}
        >
          <header>
            <div class="titles">
              <span class="title">${e}</span>
              <span class="subtitle">${st("history.title",this.hass)}</span>
            </div>
            <button
              type="button"
              class="close"
              @click=${this._close}
              aria-label=${st("history.close",this.hass)}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <div class="body">
            <acp-history-view
              .hass=${this.hass}
              .discovered=${this.discovered}
              .hours=${this.hours}
              .tracks=${this.tracks}
              .active=${this.open}
              @acp-history-hours=${e=>{this.hours=e.detail.hours}}
              @acp-history-expand=${e=>{this._expanded=e.detail.section}}
            ></acp-history-view>
          </div>
        </div>
      </div>
    `}};Zn.styles=a`
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
    }
    /* Above the more-info dialog's backdrop (z-index 9999), because History is
       most often opened FROM that dialog and renders as its sibling — anything
       lower is painted behind it and cannot be seen or clicked. Still below the
       card's floating-tooltip layer (100000), so tooltips inside History work. */
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.45);
      display: grid;
      place-items: center;
      padding: 16px;
      box-sizing: border-box;
    }
    .panel {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      width: min(720px, 100%);
      max-height: min(86vh, 900px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    /* Maximized: wider for the charts' time axis and the event table's three
       columns, taller for row count, and the body stops scrolling so the
       section owns the scroll. */
    .panel.expanded {
      width: min(1200px, 100%);
      height: min(94vh, 1200px);
      max-height: 94vh;
    }
    .panel.expanded.narrow {
      width: min(900px, 100%);
    }
    .panel.expanded .body {
      overflow: hidden;
      display: flex;
      min-height: 0;
    }
    .panel.expanded .body acp-history-view {
      flex: 1;
      min-height: 0;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px 8px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    }
    .titles {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .title {
      font-size: 1rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .subtitle {
      font-size: 0.72rem;
      color: var(--secondary-text-color);
    }
    .close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px;
      display: inline-flex;
    }
    .body {
      padding: 12px 14px 14px;
      overflow-y: auto;
    }
  `,e([ge({attribute:!1})],Zn.prototype,"hass",void 0),e([ge({attribute:!1})],Zn.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Zn.prototype,"open",void 0),e([ge({type:Number})],Zn.prototype,"hours",void 0),e([ge({attribute:!1})],Zn.prototype,"tracks",void 0),e([me()],Zn.prototype,"_expanded",void 0),Zn=e([pe("acp-history-dialog")],Zn);let Qn=class extends de{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this.showElevationChart=!0,this.showSolarCalc=!0,this.stateColor=!0,this._cancelMinuteTimer=null,this._positionHistory=[],this._historyKey=null,this._historyOpen=!1,this._listSource=null,this._list=[],this._openHistory=e=>{e.stopPropagation(),this._historyOpen=!0},this._onResume=()=>{const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const e=this.discovered.device_id;e&&this._navigate(`/config/devices/device/${e}`)},this._openIntegrationPage=()=>{const e=this.discovered.entry_id;this._navigate(`/config/integrations/integration/${Te}`+(e?`#config_entry=${e}`:""))},this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}updated(){this._syncMinuteTimer(this.open),this._maybeFetchHistory()}_maybeFetchHistory(){if(!this.open||!this.hass||!this.discovered)return;const e=this.discovered.managed_covers??[];if(0===e.length)return this._historyKey=null,void(this._positionHistory.length>0&&(this._positionHistory=[]));const t=Date.now(),o=ei(new Date(t)).getTime(),i=St(this.discovered),s=`${e.join(",")}|${o}|${i}`;s!==this._historyKey&&(this._historyKey=s,async function(e,t,o,i,s=!1){if(0===t.length)return[];let n;try{n=await e.callWS({type:"history/history_during_period",start_time:new Date(o).toISOString(),end_time:new Date(i).toISOString(),entity_ids:t,minimal_response:!1,no_attributes:!1,significant_changes_only:!1})}catch{return[]}if(!n||"object"!=typeof n)return[];const r={};for(const e of t){const t=n[e];if(!Array.isArray(t))continue;const o=Ls(t);o.length>0&&(r[e]=o)}const a=Ks(r);if(a.length>0){const e=a[a.length-1];Date.parse(e.t)<i&&a.push({t:new Date(i).toISOString(),position:e.position})}return s?a.map(e=>({t:e.t,position:100-e.position})):a}(this.hass,e,o,t,i).then(e=>{this._historyKey===s&&(this._positionHistory=e)}))}disconnectedCallback(){super.disconnectedCallback(),this._syncMinuteTimer(!1)}_syncMinuteTimer(e){e&&null===this._cancelMinuteTimer?this._cancelMinuteTimer=vi(()=>this.requestUpdate()):e||null===this._cancelMinuteTimer||(this._cancelMinuteTimer(),this._cancelMinuteTimer=null)}get _discoveredList(){return this.discovered!==this._listSource&&(this._listSource=this.discovered,this._list=this.discovered?[this.discovered]:[]),this._list}_buildHandlerLabels(){const e={};for(const[t,o]of Object.entries(Oe))e[t]=st(o,this.hass);return e}_headerIcon(){const e=this.discovered.managed_covers?.[0],t=e?this.hass.states[e]:void 0;return ut({explicitIcon:t?.attributes?.icon,deviceClass:t?.attributes?.device_class,coverType:this.discovered.cover_type,position:Vt(this.hass,this.discovered,e)})}_headerColor(){if(!this.stateColor)return null;const e=this.discovered.managed_covers?.[0],t=e?this.hass.states[e]:void 0;return vt(t?.state)}_batteryTpl(){const e=this.coverOrder??this.discovered?.managed_covers??[],t=Ui(this.hass,e),o=Vi(t);if(!o)return V;const i=1===t.length?null===o.level?st("dialog.battery_unknown",this.hass):st("dialog.battery",this.hass,{level:o.level}):t.map(e=>st("dialog.battery_named",this.hass,{name:this._coverName(e.cover_id),level:null===e.level?"—":e.level})).join(" · ");return H`<div
      class="icon-btn battery${qi(o)?" low":""}"
      role="img"
      aria-label=${i}
      ${xo(i)}
    >
      <ha-icon icon=${Yi(o.level,o.charging)}></ha-icon>
    </div>`}_coverName(e){return this.hass?.states[e]?.attributes?.friendly_name??e}render(){if(!this.open||!this.hass||!this.discovered)return V;const e=this._winner(),t=this._traceAttrs(),o=this._matchedHandlers(t,e),i=$i(t),s=t?Ai(t.trace??[],t,0,this._buildHandlerLabels(),st("badge.safety",this.hass)):"",n=this._target(),r=this._shouldShowResume(),a=this._switchOn("integration_enabled_switch"),l=this._switchOn("automatic_control_switch"),c=st("dialog.configure_integration",this.hass),d=st("dialog.open_device_page",this.hass),h=st("dialog.close",this.hass),p=st("history.open",this.hass),u=this._headerColor();return H`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${this._headerIcon()}
              style=${u?`color: ${u}`:""}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${a?l?o.map(e=>H`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${e}
                          .slotNumber=${"custom_position"===e?t?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===e?t?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===e?xi(t,n)??void 0:void 0}
                          .minimumMode=${"custom_position"===e?t?.custom_position_minimum_mode:void 0}
                          .safetyActive=${"custom_position"===e&&i}
                        ></acp-tile-badge>`):V:H`<acp-tile-badge
                    .hass=${this.hass}
                    .integrationEnabled=${!1}
                  ></acp-tile-badge>`}
            </div>
            ${this._batteryTpl()}
            <button
              class="icon-btn history-link"
              type="button"
              aria-label=${p}
              ${xo(p)}
              @click=${this._openHistory}
            >
              <ha-icon icon=${Ve}></ha-icon>
            </button>
            <button
              class="icon-btn options-link"
              type="button"
              aria-label=${c}
              ${xo(c)}
              @click=${this._openIntegrationPage}
            >
              <ha-icon icon="mdi:cog"></ha-icon>
            </button>
            ${this.discovered.device_id?H`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label=${d}
                  ${xo(d)}
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:tune-variant"></ha-icon>
                </button>`:V}
            <button class="close" type="button" aria-label=${h} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${s?H`<div class="summary">${s}</div>`:V}

          <div class="position-block">
            <div class="position-label">${st("dialog.target",this.hass)}</div>
            <div class="position-value">${nt(n)}</div>
            ${this._mismatchActive()?H`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:V}
          </div>

          <acp-cover-bar
            .hass=${this.hass}
            .discovered=${this.discovered}
            .coverOrder=${this.coverOrder}
          ></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${r?H`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${st("dialog.resume_auto",this.hass)}
                </button>
              </div>`:V}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?st("dialog.hide_advanced",this.hass):st("dialog.show_advanced",this.hass)}
          </button>
          ${this.advancedOpen?H`<div class="advanced">
                ${this.showCompass?H`<div class="advanced-compass">
                      <acp-sky-compass
                        .hass=${this.hass}
                        .discovered_list=${this._discoveredList}
                        ?compact=${!0}
                        .showLegend=${!1}
                        .showStats=${!0}
                      ></acp-sky-compass>
                    </div>`:V}
                ${this.showElevationChart?H`<acp-elevation-chart
                      .hass=${this.hass}
                      .discoveredList=${this._discoveredList}
                      ?compact=${!0}
                    ></acp-elevation-chart>`:V}
                ${this._renderSlots(t?.custom_position_slots)}
                <acp-decision-strip
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-decision-strip>
                ${this.showSolarCalc?H`<acp-solar-calc
                      .hass=${this.hass}
                      .discovered=${this.discovered}
                    ></acp-solar-calc>`:V}
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
      <acp-history-dialog
        .hass=${this.hass}
        .discovered=${this.discovered}
        .open=${this._historyOpen}
        @acp-history-closed=${()=>{this._historyOpen=!1}}
      ></acp-history-dialog>
    `}_winner(){const e=this.discovered.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(){const e=this.discovered.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_matchedHandlers(e,t){if(!e?.trace)return[];const o=Xi(e.trace),i=Ie.filter(e=>o.has(e)).map(e=>je[e]).filter(e=>void 0!==e),s=ts(e.trace,t);return Zi(i,this.badges,s)}_target(){return Ht(this.hass,this.discovered)}_mismatchActive(){const e=this.discovered.entities.position_mismatch_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualOverrideOn(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(e){const t=this.discovered.entities[e];return!t||"off"!==this.hass.states[t]?.state}_shouldShowResume(){return!!this.discovered.entities.reset_override_button&&this._manualOverrideOn()}_renderSlots(e){if(!e)return V;const t=e.filter(e=>null!==e.sensor);return 0===t.length?V:H`<div class="slots-section">
      <div class="slots-label">${st("dialog.custom_positions",this.hass)}</div>
      ${t.map(e=>this._renderSlotRow(e))}
    </div>`}_renderSlotRow(e){const t=e.sensor_name??`#${e.slot}`,o=e.sensors?.length??0,i=!0===e.template?H`<span
            class="slot-template"
            ${xo("Template"+(o>0?` · ${o} sensors${e.template_mode?` (${e.template_mode})`:""}`:""))}
          >
            <ha-icon icon="mdi:code-braces"></ha-icon>
          </span>`:V;return H`<div class="slot-row" data-slot=${e.slot}>
      <span class="slot-label">${t}</span>
      ${i}
      <span class="slot-position">${nt(e.position)}</span>
      ${!0===e.min_mode?H`<span
            class="slot-min-mode${null!=e.priority&&e.priority>80?"":" is-bypassable"}"
            ${xo(st("dialog.floor_tooltip",this.hass))}
          >
            ${st("dialog.floor",this.hass)}
          </span>`:V}
      <button
        class="slot-toggle ${e.enabled?"on":"off"}"
        type="button"
        aria-label=${e.enabled?st("dialog.disable_slot",this.hass,{slot:e.slot}):st("dialog.enable_slot",this.hass,{slot:e.slot})}
        @click=${()=>this._toggleSlot(e)}
      >
        ${e.enabled?st("dialog.on",this.hass):st("dialog.off",this.hass)}
      </button>
    </div>`}_renderControls(){const e=[{role:"automatic_control_switch",label:st("dialog.automatic",this.hass)},{role:"climate_mode_switch",label:st("dialog.climate",this.hass)},{role:"motion_control_switch",label:st("dialog.motion",this.hass)}].filter(e=>!!this.discovered.entities[e.role]);return 0===e.length?V:H`<div class="controls-block">
      <div class="controls-label">${st("dialog.controls",this.hass)}</div>
      <div class="controls-row">${e.map(e=>this._renderSwitchChip(e.role,e.label))}</div>
    </div>`}_renderSwitchChip(e,t){const o=this.discovered.entities[e],i="on"===this.hass.states[o]?.state,s=st(i?"dialog.state_on":"dialog.state_off",this.hass),n=st(i?"dialog.on":"dialog.off",this.hass);return H`<button
      class="ctrl-toggle ${i?"on":"off"}"
      type="button"
      aria-pressed=${i}
      aria-label=${st("dialog.toggle_hint",this.hass,{label:t,state:s})}
      @click=${()=>this._toggleSwitch(o,i)}
    >
      <span class="ctrl-label">${t}</span>
      <span class="ctrl-state">${n}</span>
    </button>`}_toggleSwitch(e,t){this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:e})}_renderForecastStrip(){const e=this.discovered.entities.position_forecast_sensor,t=e?this.hass.states[e]?.attributes:void 0,o=t?.forecast??[],i=t?.events??[],s=this._positionHistory;return 0===o.length&&0===s.length?V:H`<div class="forecast-block">
      <div class="forecast-label">${st("dialog.todays_forecast",this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${o}
        .events=${i}
        .history=${s}
        .now=${Date.now()}
        .axes=${kt(this.discovered)}
      ></acp-forecast-strip>
      <div class="forecast-note">${st("forecast.solar_only_note",this.hass)}</div>
    </div>`}_toggleSlot(e){const t=this.discovered.managed_covers[0];t&&this.hass.callService(Te,"set_custom_position",{entity_id:t,slot:e.slot,enabled:!e.enabled})}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};function Xn(e){return H`
    <div
      class="editor-footer"
      style="display:flex;align-items:center;justify-content:space-between;gap:8px;"
    >
      <a href=${"https://www.buymeacoffee.com/jrhubott"} target="_blank" rel="noopener noreferrer">
        <img src=${"https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black"} alt=${st("editor.common.support_alt",e)} height="20" />
      </a>
      <span class="version-footer dim">
        ${st("root.footer_version",e,{version:fe})}
      </span>
    </div>
  `}Qn.styles=a`
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
    /* The battery shares .icon-btn's metrics so it lines up with the buttons
       beside it, but it is a readout, not a control — no pointer affordance. */
    .icon-btn.battery {
      cursor: default;
    }
    .icon-btn.battery.low {
      color: var(--error-color, #db4437);
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
    /* The dialog's copy of the tile's floor chip, and it resolves its purple the
       same way and for the same reason: the literal #6a1b9a it replaces is a
       light-theme color that sat near 1.6:1 on HA's dark theme. Keep the two in
       step — they are the same marker on two surfaces. */
    .slot-min-mode {
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 999px;
      --acp-floor-accent: #9c27b0;
      background: color-mix(in srgb, var(--acp-floor-accent) ${22}%, transparent);
      color: color-mix(
        in srgb,
        var(--acp-floor-accent) ${40}%,
        var(--primary-text-color, #212121)
      );
    }
    /* Priority axis: floor whose priority ≤ manual-override is bypassable by a
       manual ↓ → subdued. Per-slot rows have no clamping notion, so no
       fill/outline. Subdued via the background rather than opacity, which
       multiplied into the text and was half of why this chip was unreadable. */
    .slot-min-mode.is-bypassable {
      background: color-mix(in srgb, var(--acp-floor-accent) 10%, transparent);
      font-weight: 400;
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
  `,e([ge({attribute:!1})],Qn.prototype,"hass",void 0),e([ge({attribute:!1})],Qn.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Qn.prototype,"open",void 0),e([ge({type:Boolean})],Qn.prototype,"advancedOpen",void 0),e([ge({type:Boolean})],Qn.prototype,"showCompass",void 0),e([ge({type:Boolean})],Qn.prototype,"showElevationChart",void 0),e([ge({type:Boolean})],Qn.prototype,"showSolarCalc",void 0),e([ge({type:Boolean})],Qn.prototype,"stateColor",void 0),e([ge({attribute:!1})],Qn.prototype,"badges",void 0),e([ge({attribute:!1})],Qn.prototype,"coverOrder",void 0),e([me()],Qn.prototype,"_positionHistory",void 0),e([me()],Qn.prototype,"_historyOpen",void 0),Qn=e([pe("acp-more-info-dialog")],Qn);const Jn=["auto","solar","force","weather","manual","custom_position","motion","climate","glare_zone","cloud"],er={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_position_bar:!0,show_tilt:!0,show_compass:!0,show_elevation_chart:!0,show_solar_calc:!0,show_motion_icon:!0,state_color:!0,layout:"detailed",badge_auto:!0,badge_solar:!0,badge_force:!0,badge_weather:!0,badge_manual:!0,badge_custom_position:!0,badge_motion:!0,badge_climate:!0,badge_glare_zone:!0,badge_cloud:!0,show_scene_select:!0,show_lock:!0,show_automation:!0,show_clear_overrides:!0,show_member_badges:!0},tr={entry_id:"editor.common.entry_id",name:"editor.tile.name",icon:"editor.tile.icon",cover:"editor.tile.cover",layout:"editor.tile.layout",show_position:"editor.tile.show_position",show_state:"editor.tile.show_state",show_decision_summary:"editor.tile.show_decision_summary",show_controls:"editor.tile.show_controls",controls_cover:"editor.tile.controls_cover",controls_axis:"editor.tile.controls_axis",show_badge:"editor.tile.show_badge",show_position_bar:"editor.tile.show_position_bar",show_tilt:"editor.tile.show_tilt",badge_section:"editor.tile.badge_section",badge_auto:"editor.tile.badge_auto",badge_solar:"editor.tile.badge_solar",badge_force:"editor.tile.badge_force",badge_weather:"editor.tile.badge_weather",badge_manual:"editor.tile.badge_manual",badge_custom_position:"editor.tile.badge_custom_position",badge_motion:"editor.tile.badge_motion",badge_climate:"editor.tile.badge_climate",badge_glare_zone:"editor.tile.badge_glare_zone",badge_cloud:"editor.tile.badge_cloud",show_compass:"editor.tile.show_compass",show_elevation_chart:"editor.tile.show_elevation_chart",show_solar_calc:"editor.tile.show_solar_calc",show_motion_icon:"editor.tile.show_motion_icon",state_color:"editor.tile.state_color",tap_action:"editor.tile.tap_action",icon_tap_action:"editor.tile.icon_tap_action",hold_action:"editor.tile.hold_action",double_tap_action:"editor.tile.double_tap_action",interactions_section:"editor.tile.interactions_section",content_section:"editor.tile.content_section",controls_section:"editor.tile.controls_section",dialog_section:"editor.tile.dialog_section",group_row_section:"editor.tile.group_row_section",show_scene_select:"editor.tile.show_scene_select",show_lock:"editor.tile.show_lock",show_automation:"editor.tile.show_automation",show_clear_overrides:"editor.tile.show_clear_overrides",show_member_badges:"editor.tile.show_member_badges"};let or=class extends de{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._isGroupEntry=!1,this._groupDiscovered=null,this._memberDrafts=null,this._memberDraftsFor=null,this._computeLabel=e=>{const t=tr[e.name];return t?st(t,this.hass):e.name},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};this._nameIsComposed()&&!t.name&&delete t.name;for(const[e,o]of Object.entries(er))e.startsWith("badge_")?t[e]===o&&delete t[e]:this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==o||delete t[e];const o={};for(const e of Jn){const i=`badge_${e}`;!1===t[i]&&(o[e]=!1),delete t[i]}const i={...this._config??{type:"",entry_id:""},...t};this._config?.entry_id&&i.entry_id!==this._config.entry_id&&(delete i.cover,delete i.covers,delete i.controls_cover,delete i.controls_axis),Object.keys(o).length>0?i.badges=o:delete i.badges,this._emit(i)},this._dragFrom=null,this._memberLabels=new Map}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),(e.has("_registry")||e.has("_config"))&&null!==this._registry&&this._refreshManagedCovers()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Ro(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id}),this._refreshManagedCovers()}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){if(null===this._registry){const e=Io();e&&(this._registry=e,this._refreshManagedCovers())}null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,Eo(this.hass).then(e=>{this._registry=e,this._refreshManagedCovers()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=zo(this.hass,()=>{this._registryFetchInFlight=!0,Eo(this.hass).then(e=>{this._registry=e}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_refreshManagedCovers(){if(!this._config?.entry_id||!this._registry||!this.hass)return;const e=Co(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=e?.managed_covers??[],this._isGroupEntry=!!e?.is_group,this._groupDiscovered=e?.is_group?e:null,this._memberLabels.clear();const t=this._config?.entry_id??"";null!==this._memberDrafts&&this._memberDraftsFor===t||(this._memberDrafts={...this._config?.member_names??{}},this._memberDraftsFor=t)}_nameIsComposed(){return Array.isArray(this._config?.name)}render(){if(!this._config)return V;if(this._entriesError&&!this._entries)return H`
        <div class="form">
          <div class="error">
            ${st("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${st("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${st("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>{const t={...this._config??{type:"",entry_id:""},entry_id:e.target.value};this._config?.entry_id&&t.entry_id!==this._config.entry_id&&(delete t.cover,delete t.covers,delete t.controls_cover,delete t.controls_axis),this._emit(t)}}
          />
          ${Xn(this.hass)}
        </div>
      `;const e=this._schema(),{badges:t,...o}=this._config,i={};for(const e of Jn)t&&!1===t[e]&&(i[`badge_${e}`]=!1);const s=this._nameIsComposed(),n={...er,...o,...s?{name:""}:{},...i};return H`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${n}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${s?H`<div class="hint">${st("editor.tile.name_composed_hint",this.hass)}</div>`:V}
        ${this._managedCovers.length>1&&!this._config?.cover?H`<div class="hint">${st("editor.tile.cover_blank_hint",this.hass)}</div>`:V}
        ${this._renderRailOrder()} ${this._renderMemberNames()} ${Xn(this.hass)}
      </div>
    `}_railRows(){const e=this._managedCovers,t=(this._config?.covers??[]).filter(t=>e.includes(t)),o=e.filter(e=>!t.includes(e)),i=t.length>0?[...t.map(e=>({id:e,shown:!0})),...o.map(e=>({id:e,shown:!1}))]:e.map(e=>({id:e,shown:this._defaultShows(e)}));return[...i.filter(e=>e.shown),...i.filter(e=>!e.shown)]}_defaultShows(e){return!this._config?.cover||e===this._config.cover}_coverName(e){return this.hass?.states[e]?.attributes?.friendly_name??e}_emitRails(e){if(!this._config)return;const t=e.filter(e=>e.shown).map(e=>e.id),o=this._managedCovers.filter(e=>this._defaultShows(e)),i=t.length===o.length&&t.every((e,t)=>e===o[t]),{covers:s,...n}=this._config;this._emit(i?n:{...n,covers:t})}_moveRail(e,t){const o=this._railRows(),i=o.filter(e=>e.shown).length;if(t<0||t>=i||e>=i||e===t)return;const s=[...o],[n]=s.splice(e,1);s.splice(t,0,n),this._emitRails(s)}_toggleRail(e){const t=this._railRows();if(t[e].shown&&1===t.filter(e=>e.shown).length)return;const o=t[e];if(o.shown)return void this._emitRails(t.map((t,o)=>o===e?{...t,shown:!1}:t));const i=t.filter(e=>e.shown),s=this._managedCovers.indexOf(o.id),n=i.filter(e=>this._managedCovers.indexOf(e.id)<s).length,r=[...i];r.splice(n,0,{...o,shown:!0}),this._emitRails(r)}_renderMemberNames(){const e=this._groupDiscovered;if(!e||!this.hass)return V;const t=_s(this.hass,e),o=zs(this.hass,Object.keys(t.memberPositions),this._registry??void 0);if(0===o.length)return V;const i=this._memberDrafts??{};return H`
      <div class="rail-order">
        <div class="rail-order-title">${st("editor.tile.member_names",this.hass)}</div>
        <div class="hint">${st("editor.tile.member_names_hint",this.hass)}</div>
        <ha-form
          .hass=${this.hass}
          .data=${i}
          .schema=${o.map(e=>({name:Is(e),selector:{text:{}}}))}
          .computeLabel=${e=>this._memberFieldLabel(e.name,o)}
          @value-changed=${e=>this._memberNamesChanged(e.detail.value)}
        ></ha-form>
      </div>
    `}_memberRowLabel(e){const t=this._memberLabels.get(e.entryId??e.covers[0]);if(void 0!==t)return t;let o;if(e.entryId&&this._registry){const t=Co(this.hass,{type:this._config.type,entry_id:e.entryId},this._registry);o=t?.entry_title}if(!o){const t=this.hass.states[e.covers[0]];o=t?.attributes?.friendly_name??e.covers[0]}return this._memberLabels.set(e.entryId??e.covers[0],o),o}_memberFieldLabel(e,t){const o=t.find(t=>Is(t)===e);return o?this._memberRowLabel(o):e}_memberNamesChanged(e){const t={};for(const[o,i]of Object.entries(e??{})){const e="string"==typeof i?i.trim():"";e&&(t[o]=e)}this._memberDrafts={...e},this._memberDraftsFor=this._config?.entry_id??"";const o={...this._config};Object.keys(t).length>0?o.member_names=t:delete o.member_names,this._emit(o)}_renderRailOrder(){if(this._isGroupEntry||this._managedCovers.length<2)return V;const e=this._railRows(),t=e.filter(e=>e.shown).length;return H`
      <div class="rail-order">
        <div class="rail-order-title">${st("editor.tile.covers",this.hass)}</div>
        <div class="hint">${st("editor.tile.covers_hint",this.hass)}</div>
        <ul>
          ${e.map((e,o)=>H`
              <li
                class=${`rail${e.shown?"":" hidden-rail"}${this._dragFrom===o?" dragging":""}`}
                draggable=${e.shown?"true":"false"}
                @dragstart=${()=>this._dragFrom=o}
                @dragend=${()=>this._dragFrom=null}
                @dragover=${t=>{e.shown&&t.preventDefault()}}
                @drop=${t=>{t.preventDefault(),null!==this._dragFrom&&e.shown&&this._moveRail(this._dragFrom,o),this._dragFrom=null}}
              >
                <ha-icon class="grip" icon="mdi:drag-horizontal-variant"></ha-icon>
                <span class="rail-name">${this._coverName(e.id)}</span>
                <button
                  type="button"
                  class="rail-btn"
                  aria-label=${st("editor.tile.covers_move_up",this.hass)}
                  ?disabled=${!e.shown||0===o}
                  @click=${()=>this._moveRail(o,o-1)}
                >
                  <ha-icon icon="mdi:arrow-up"></ha-icon>
                </button>
                <button
                  type="button"
                  class="rail-btn"
                  aria-label=${st("editor.tile.covers_move_down",this.hass)}
                  ?disabled=${!e.shown||o>=t-1}
                  @click=${()=>this._moveRail(o,o+1)}
                >
                  <ha-icon icon="mdi:arrow-down"></ha-icon>
                </button>
                <button
                  type="button"
                  class="rail-btn"
                  aria-label=${st(e.shown?"editor.tile.covers_hide":"editor.tile.covers_show",this.hass)}
                  aria-pressed=${e.shown?"true":"false"}
                  ?disabled=${e.shown&&1===t}
                  @click=${()=>this._toggleRail(o)}
                >
                  <ha-icon icon=${e.shown?"mdi:eye":"mdi:eye-off"}></ha-icon>
                </button>
              </li>
            `)}
        </ul>
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[],t=[{value:"one-line",label:st("editor.tile.layout_option_one_line",this.hass)},{value:"detailed",label:st("editor.tile.layout_option_detailed",this.hass)}];let o={entity:{domain:"cover"}},i=!1,s=0,n=[];if(this._registry&&this._config?.entry_id){const e=Co(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);i=!!e?.is_group,s=e?.managed_covers.length??0,e&&!i&&e.managed_covers.length>0&&(o={entity:{domain:"cover",include_entities:e.managed_covers}}),e&&!i&&(n=kt(e).map(e=>({value:e.id,label:qe[e.id]?st(qe[e.id],this.hass):e.label})))}return i?[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},this._section("content_section","mdi:format-text",!0,[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},this._grid([{name:"state_color",selector:{boolean:{}}}])]),this._section("controls_section","mdi:arrow-up-down",!1,[this._grid([{name:"show_controls",selector:{boolean:{}}},{name:"show_position_bar",selector:{boolean:{}}},{name:"show_tilt",selector:{boolean:{}}}])]),this._section("group_row_section","mdi:window-shutter-cog",!1,[this._grid([{name:"show_scene_select",selector:{boolean:{}}},{name:"show_lock",selector:{boolean:{}}},{name:"show_automation",selector:{boolean:{}}},{name:"show_clear_overrides",selector:{boolean:{}}},{name:"show_member_badges",selector:{boolean:{}}}])]),this._interactionsSection()]:[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},...s>1||this._config?.cover?[{name:"cover",selector:o}]:[],this._section("content_section","mdi:format-text",!0,[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"layout",selector:{select:{mode:"list",options:t}}},this._grid([{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"state_color",selector:{boolean:{}}},{name:"show_motion_icon",selector:{boolean:{}}}])]),this._section("controls_section","mdi:arrow-up-down",!1,[this._grid([{name:"show_controls",selector:{boolean:{}}},{name:"show_position_bar",selector:{boolean:{}}},{name:"show_tilt",selector:{boolean:{}}}]),...s>1||this._config?.controls_cover?[{name:"controls_cover",selector:o}]:[],...n.length>1||this._config?.controls_axis?[{name:"controls_axis",selector:{select:{options:n,mode:"dropdown"}}}]:[]]),this._section("badge_section","mdi:label-multiple-outline",!1,[{name:"show_badge",selector:{boolean:{}}},this._grid(Jn.map(e=>({name:`badge_${e}`,selector:{boolean:{}}})))]),this._section("dialog_section","mdi:card-text-outline",!1,[this._grid([{name:"show_compass",selector:{boolean:{}}},{name:"show_elevation_chart",selector:{boolean:{}}},{name:"show_solar_calc",selector:{boolean:{}}}])]),this._interactionsSection()]}_section(e,t,o,i){return{type:"expandable",name:"",title:st(`editor.tile.${e}`,this.hass),icon:t,expanded:o,schema:i}}_grid(e){return{type:"grid",name:"",schema:e}}_interactionsSection(){return this._section("interactions_section","mdi:gesture-tap",!1,[{name:"tap_action",selector:{ui_action:{}}},{name:"icon_tap_action",selector:{ui_action:{default_action:"none"}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}])}};or.styles=a`
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
    /* Rail order: a sortable list, because HA's multi-entity selector can add
       and remove but not reorder. */
    .rail-order-title {
      font-weight: 500;
      font-size: 0.88rem;
      color: var(--primary-text-color);
    }
    .rail-order ul {
      list-style: none;
      margin: 6px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .rail-order li.rail {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, transparent);
      cursor: grab;
    }
    .rail-order li.rail.dragging {
      opacity: 0.5;
      cursor: grabbing;
    }
    .rail-order li.rail.hidden-rail .rail-name {
      opacity: 0.45;
      text-decoration: line-through;
    }
    .rail-order .grip {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
      flex: 0 0 auto;
    }
    .rail-order .rail-name {
      flex: 1 1 auto;
      min-width: 0;
      font-size: 0.88rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .rail-order .rail-btn {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .rail-order .rail-btn:hover:not(:disabled) {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
    .rail-order .rail-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }
    .rail-order .rail-btn ha-icon {
      --mdc-icon-size: 18px;
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
  `,e([ge({attribute:!1})],or.prototype,"hass",void 0),e([me()],or.prototype,"_config",void 0),e([me()],or.prototype,"_entries",void 0),e([me()],or.prototype,"_entriesError",void 0),e([me()],or.prototype,"_registry",void 0),e([me()],or.prototype,"_managedCovers",void 0),e([me()],or.prototype,"_isGroupEntry",void 0),e([me()],or.prototype,"_groupDiscovered",void 0),e([me()],or.prototype,"_memberDrafts",void 0),e([me()],or.prototype,"_dragFrom",void 0),or=e([pe(ke)],or);let ir=class extends de{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._posDrag=null,this._extendOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=$o(),this._discovered=null,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._onPosPointerDown=(e,t,o)=>{e.stopPropagation();const i=e.currentTarget;i.setPointerCapture?.(e.pointerId),this._posDrag={id:t,pct:ft(this._posPctFromEvent(e,i),o)}},this._onPosPointerMove=(e,t,o)=>{this._posDrag?.id===t&&(e.stopPropagation(),this._posDrag={id:t,pct:ft(this._posPctFromEvent(e,e.currentTarget),o)})},this._onPosPointerEnd=e=>{e.stopPropagation(),this._posDrag=null},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),Pi(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return Pi(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1},this._onIconClick=e=>{this._hasIconAction()&&(e.stopPropagation(),this._config&&this.hass&&Ii(this,this.hass,{entity:this._actionEntity(),tap_action:this._config.icon_tap_action},"tap"))},this._onIconKeydown=e=>{this._hasIconAction()&&("Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._onIconClick(e)))}}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${$e}: \`entry_id\` is required and must be a non-empty string`);if(null!=(t=e.name)&&"string"!=typeof t&&!(Array.isArray(t)?t.every(Ni):"object"!=typeof t))throw new Error(`${$e}: \`name\` must be a string or an array of {type: 'entry'|'area'} or {type: 'text', text: string} parts`);var t;let o={...e};if("string"==typeof o.tap_action&&(o={...o,tap_action:"none"===o.tap_action?{action:"none"}:void 0}),this._config=o,o.tooltips&&bo(o.tooltips),null===this._registry){const e=Lo.get(o.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 1}getGridOptions(){return{columns:"full",rows:"auto",min_columns:3,min_rows:"one-line"!==this._config?.layout?2:1}}static async getStubConfig(e){let t="";try{const o=await Ro(e);t=o[0]?.entry_id??""}catch{}return{type:`custom:${$e}`,entry_id:t}}static async getConfigElement(){return document.createElement(ke)}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Io();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||(!!this._discovered.is_group||ve(e.get("hass"),this.hass,Object.values(this._discovered.entities))))}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zo(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Po(this.hass,e).then(e=>{t===this._fetchGen&&e!==this._registry&&(this._registry=e,this._registryError=null,this._config&&Lo.set(this._config.entry_id,Go(e,this._config.entry_id)))}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return V;if(null===this._registry)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?st("tile.registry_failed",this.hass,{error:this._registryError}):st("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=this._discovered;if(!e)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${st("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`;if(e.is_group){const t=Oi(this._config.name,e);return H`
        <ha-card>
          <acp-group-tile
            @pointerdown=${this._onPointerDown}
            @pointerup=${this._onPointerUp}
            @pointercancel=${this._onPointerCancel}
            @pointerleave=${this._onPointerCancel}
            .hass=${this.hass}
            .discovered=${e}
            .name=${t}
            .icon=${this._config.icon}
            .stateColor=${!1!==this._config.state_color}
            .showControls=${!1!==this._config.show_controls}
            .showPositionBar=${!1!==this._config.show_position_bar}
            .showTilt=${!1!==this._config.show_tilt}
            .showSceneSelect=${!1!==this._config.show_scene_select}
            .showLock=${!1!==this._config.show_lock}
            .showAutomation=${!1!==this._config.show_automation}
            .showClearOverrides=${!1!==this._config.show_clear_overrides}
            .showMemberBadges=${!1!==this._config.show_member_badges}
            .iconInteractive=${this._hasIconAction()}
            @acp-open-more-info=${this._onClick}
            @acp-icon-action=${this._onIconClick}
          ></acp-group-tile>
        </ha-card>
        <acp-group-dialog
          .hass=${this.hass}
          .discovered=${e}
          .open=${this._dialogOpen}
          .name=${t}
          .memberNames=${this._config.member_names}
          .icon=${this._config.icon}
          .stateColor=${!1!==this._config.state_color}
          .showTilt=${!1!==this._config.show_tilt}
          .showSceneSelect=${!1!==this._config.show_scene_select}
          .showLock=${!1!==this._config.show_lock}
          .showAutomation=${!1!==this._config.show_automation}
          .showClearOverrides=${!1!==this._config.show_clear_overrides}
          .showMemberBadges=${!1!==this._config.show_member_badges}
          @acp-dialog-close=${this._closeDialog}
        ></acp-group-dialog>
      `}return H`
      <ha-card>${this._renderTile(e)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${e}
        .open=${this._dialogOpen}
        .showCompass=${!1!==this._config.show_compass}
        .showElevationChart=${!1!==this._config.show_elevation_chart}
        .showSolarCalc=${!1!==this._config.show_solar_calc}
        .stateColor=${!1!==this._config.state_color}
        .badges=${this._config.badges}
        .coverOrder=${this._config.covers}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
      <acp-extend-override-dialog
        .hass=${this.hass}
        .open=${this._extendOpen}
        .presets=${this._extendPresets(e)}
        .currentEndMs=${this._manualEndMs(e)}
        @acp-extend-confirm=${t=>this._onExtendConfirm(t,e)}
        @acp-extend-close=${()=>this._extendOpen=!1}
      ></acp-extend-override-dialog>
    `}_extendPresets(e){const t=e.entities.position_forecast_sensor,o=t?this.hass.states[t]?.attributes:void 0;return function(e){const{events:t,nowMs:o,latitude:i,longitude:s,max:n=Ki}=e,r=t.filter(e=>{const t=Date.parse(e.t);return!Number.isNaN(t)&&t>o}).map(e=>({kind:e.kind,t:e.t,label:e.label}));if(r.length<2&&null!=i&&null!=s)for(const e of function(e,t,o){const i=[];for(let s=0;s<=1;s++){const n=new Date(o+24*s*60*60*1e3),r=Qo.getTimes(n,e,t);for(const[e,t]of[["sunrise",r.sunrise],["sunset",r.sunset]])t&&!Number.isNaN(t.getTime())&&(t.getTime()<=o||i.some(t=>t.kind===e)||i.push({kind:e,t:t.toISOString()}))}return i.sort((e,t)=>Date.parse(e.t)-Date.parse(t.t))}(i,s,o)){const t=r.some(t=>{return t.kind===e.kind&&(o=t.t,i=e.t,Math.floor(Date.parse(o)/6e4)===Math.floor(Date.parse(i)/6e4));var o,i});t||r.push({kind:e.kind,t:e.t,label:e.kind})}return r.sort((e,t)=>Date.parse(e.t)-Date.parse(t.t)).slice(0,n)}({events:o?.events??[],nowMs:Date.now(),latitude:this.hass.config?.latitude,longitude:this.hass.config?.longitude})}_manualEndMs(e){const t=e.entities.manual_override_end_sensor,o=t?this.hass.states[t]?.state:void 0;if(!o)return;const i=Date.parse(o);return Number.isNaN(i)?void 0:i}_onExtendConfirm(e,t){!function(e,t,o){const i={};if(o.endTime)i.end_time=o.endTime.toISOString();else{if(null==o.duration)return;i.duration={seconds:o.duration}}e.callService(Te,"engage_manual_override",i,{entity_id:t})}(this.hass,t.managed_covers,{endTime:new Date(e.detail.endMs)}),this._extendOpen=!1}_buildHandlerLabels(){const e={};for(const[t,o]of Object.entries(Oe))e[t]=st(o,this.hass);return e}_renderTile(e){const t=this._config,o=this._resolvedCover(e),i=Oi(t.name,e),s=o?this.hass.states[o]:void 0,n=s?.attributes?.device_class,r=at(s?.state),a=rt(s?.state),l=this._currentPosition(e),c=a?null:this._liveCoverPosition(e,o),d=r?null:c??l,h=t.icon??(r?"mdi:help-rhombus-outline":ut({explicitIcon:s?.attributes?.icon,deviceClass:n,coverType:e.cover_type,position:d})),p=!1!==t.state_color?vt(s?.state):null,u=this._hasIconAction(),_=!1!==t.show_position,g=!1!==t.show_state,m=!1!==t.show_controls,v=!1!==t.show_badge,f=!1!==t.show_motion_icon?this._motionActiveState(e):null,b=st("timeout_pending"===f?"tile.motion_pending":"tile.motion_detected",this.hass),y="one-line"!==t.layout,w=kt(e),x=w.find(e=>"position"!==e.id),$=At(e),k=!1!==t.show_tilt&&!!x,A=!a&&x?this._liveAxis(o,x):null,S=!r&&x?this._axisTarget(e,x):null,C=w.find(e=>e.id===t.controls_axis)??At(e),E=t.controls_cover&&(0===e.managed_covers.length||e.managed_covers.includes(t.controls_cover))?t.controls_cover:o,z=E?this.hass.states[E]:void 0,M=at(z?.state),T=rt(z?.state)||!C?null:"position"===C.id?Vt(this.hass,e,E):Yt(this.hass,C,E),I=null!==T&&T>=(C?.max??100),P=null!==T&&T<=(C?.min??0),O=this._winner(e),N=this._traceAttrs(e),D=this._manualEndIso(e),B=this._isFullyInert(t),F=$i(N),R=!0===t.show_decision_summary&&N?Ai(N.trace??[],N,0,this._buildHandlerLabels(),st("badge.safety",this.hass)):"",j=!!R&&y,L=this._switchOn(e,"integration_enabled_switch"),K=this._switchOn(e,"automatic_control_switch"),G=this._manualOverrideOn(e),W=function(e){const t=function(e){const t=es(e);return"motion"!==t?"auto"!==t?t:function(e,t){const o=Xi(e);for(const e of Ie){if("motion"===e)continue;if(!o.has(e))continue;const i=je[e];if(void 0!==i){if("off"===i||"group"===i)return i;if(!1!==t?.[i])return i}}return null}(e.trace,e.badges)??"auto":!1===e.badges?.motion||e.showMotionIcon?!1===e.badges?.auto?null:"auto":t}(e);return!1===e.inTimeWindow&&!1!==e.badges?.off_schedule&&"off"!==t&&"manual"!==t&&"force"!==t?"off_schedule":t}({winner:O,integrationEnabled:L,manualActive:G,badges:t.badges,showMotionIcon:!1!==t.show_motion_icon,inTimeWindow:N?.in_time_window,trace:N?.trace}),U=ts(N?.trace,O),q=null!==W&&Zi([W],t.badges,U).length>0,Y=v&&q&&!(!1===K&&!0===L),Z=function(e){if(!e.integrationEnabled)return!1;if(!e.automaticControl)return!1;if(e.manualActive)return!1;const t=ki(e.winner);return"force"!==t&&("custom_position"!==t||!e.bypassAutoControl&&!0!==e.safetyActive)}({winner:O,integrationEnabled:L,automaticControl:K,manualActive:G,bypassAutoControl:!0===N?.bypass_auto_control,safetyActive:F}),Q=y&&v&&!1!==t.badges?.auto&&Z,X=!(Q&&"auto"===W),J=this._transitState(e),ee=r?st("tile.unavailable",this.hass):g?lt(this.hass,o,J??void 0):null,te=[ee,_&&null!==d?nt(d):null,k&&!y&&null!==A?`⟂${nt(A)}`:null].filter(e=>!!e),oe=!!ee,ie=function(e,t,o){if(!Array.isArray(e?.custom_position_slots))return null;const i=e.custom_position_slots.filter(e=>!0===e.min_mode&&!0===e.enabled&&null!==e.sensor&&null!==e.position&&"on"===t[e.sensor]?.state);if(0===i.length)return null;const s=i.reduce((e,t)=>(t.position??0)>(e.position??0)?t:e),n=s.position,r=s.priority??null;return{slot:s.slot,position:n,label:s.sensor_name??`#${s.slot}`,clamping:null!==o&&n>o,sensorOn:!0,priority:r,resistsManual:null!=r&&r>80}}(N,this.hass.states,l),se=ki(O),ne=v&&!!ie&&!("custom_position"===se&&!0===N?.custom_position_minimum_mode)&&L,re=G&&!!e.entities.reset_override_button,ae=G&&function(e){const t=e.services;return!!t?.[Te]?.engage_manual_override}(this.hass),le=te.length>0?H`<div class="position">${te.join(" · ")}</div>`:V,ce=ne?H`<span
          class=${`acp-floor-chip${ie.clamping?"":" is-armed"}${ie.resistsManual?" resists-manual":" is-bypassable"}`}
          ${xo(st("dialog.floor_tooltip",this.hass))}
          >${st("dialog.floor",this.hass)} ${nt(ie.position)}</span
        >`:V,de=Y?H`<acp-tile-badge
          .hass=${this.hass}
          .winner=${O}
          .kindOverride=${W??void 0}
          .integrationEnabled=${L}
          .slotNumber=${N?.custom_position_active_slot}
          .slotName=${N?.custom_position_active_slot_name}
          .pct=${xi(N,l)??void 0}
          .minimumMode=${N?.custom_position_minimum_mode}
          .safetyActive=${F}
          .manualEndIso=${D}
          .manualActive=${G}
          .resumable=${re}
          .extendable=${ae}
          @acp-resume=${()=>this._resume(e)}
          @acp-extend=${()=>this._extendOpen=!0}
        ></acp-tile-badge>`:V,he=Q?H`<acp-tile-badge
          .hass=${this.hass}
          .winner=${O}
          .kindOverride=${"auto"}
          .integrationEnabled=${L}
        ></acp-tile-badge>`:V,pe=te.length>0?H`<div class="state">${te.join(" · ")}</div>`:V,ue=t.cover?[t.cover]:e.managed_covers.length>0?e.managed_covers:o?[o]:[],_e=t.covers?.length?e.managed_covers.length>0?t.covers.filter(t=>e.managed_covers.includes(t)):t.covers:[],ge=_e.length>0?_e:ue,me=function(e,t){return!(t<2)&&!e.is_group&&Di.has(e.cover_type)}(e,ge.length),ve=(()=>{const e=Vi(Ui(this.hass,ge));return qi(e)?e:null})(),fe=qt(this.hass,e),be=t=>{if(t===o)return d;const i=this.hass.states[t];return at(i?.state)?null:(rt(i?.state)?null:Vt(this.hass,e,t))??fe[t]??null},ye=function(e,t){const o=t.entities.position_verification_sensor;if(!o)return{};const i=e.states[o]?.attributes?.per_entity;if(!i||"object"!=typeof i)return{};const s=St(t),n={};for(const[e,t]of Object.entries(i)){const o=t?.target;"number"==typeof o&&Number.isFinite(o)&&(n[e]=s?100-o:o)}return n}(this.hass,e),we=e=>e===o?l:ye[e]??null,xe=y&&!1!==t.show_position_bar&&ge.some(e=>null!==be(e)),$e=xe?1===ge.length?this._posBar(ge[0],be(ge[0]),we(ge[0]),$):H`<div
            class=${"pos-stack"+(me?" layered":"")}
            role="group"
            aria-label=${st(me?"tile.rails_layered":"tile.rails_separate",this.hass,{count:ge.length})}
            ${me?xo(st("tile.rails_layered_hint",this.hass)):V}
          >
            ${ge.map(t=>{const o=be(t),i=this._coverShortName(t,e);return H`<div class="pos-row">
                <ha-icon
                  class="pos-glyph"
                  icon=${this._railIcon(t,e,o)}
                  ${xo(i)}
                ></ha-icon>
                ${this._posBar(t,o,we(t),$,i)}
              </div>`})}
          </div>`:V,ke=Y&&X,Ae=y&&(Q||ke||ne),Se=Ae?H`${he}${ke?de:V}${ce}`:V,Ce=y&&(Ae||xe);return H`
      <div
        class=${`tile-body${y?" detailed":""}${oe?" has-state-label":""}${ne&&!y?" has-floor-chip":""}${k&&y?" has-tilt":""}${Ce?" has-chrome-row":""}${Ce&&!Ae?" bar-only":""}${m?" has-controls":""}${r?" unavailable":""}`}
        role=${B?"group":"button"}
        tabindex=${B?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div
          class=${"cover-icon-wrap"+(u?" background":"")}
          role=${u?"button":V}
          tabindex=${u?0:V}
          aria-label=${u?st("tile.icon_action_label",this.hass):V}
          style=${p?`--acp-tile-icon-color: ${p}`:V}
          @click=${this._onIconClick}
          @keydown=${this._onIconKeydown}
        >
          <ha-icon
            class="cover-icon"
            icon=${h}
            style=${p?`color: ${p}`:""}
          ></ha-icon>
          ${f?H`<ha-icon
                class="motion-overlay ${f}"
                icon="mdi:motion-sensor"
                ${xo(b)}
              ></ha-icon>`:V}
          ${ve?H`<ha-icon
                class="battery-overlay"
                icon=${Yi(ve.level,ve.charging)}
                ${xo(null===ve.level?st("tile.battery_unknown",this.hass):st("tile.battery_low",this.hass,{level:ve.level}))}
              ></ha-icon>`:V}
        </div>
        <div class="label">
          <div class="title">${i}</div>
          ${y?pe:V}
          ${R&&!y?H`<div class="summary">${R}</div>`:V}
          ${j?H`<div class="summary" ${xo(R)}>${R}</div>`:V}
        </div>
        ${y?V:H`${le}${ce}`}
        ${Ce?H`<div class="chrome-line">${Se}${$e}</div>`:V}
        ${k&&y?H`<div
              class="tilt-line"
              @click=${this._stop}
              @pointerdown=${this._stop}
              @pointerup=${this._stop}
            >
              <acp-tilt-bar
                layout="tile"
                .hass=${this.hass}
                .label=${x?this._axisLabel(x):null}
                .min=${x?.min??0}
                .max=${x?.max??100}
                .unit=${x?.unit??"%"}
                .actual=${A}
                .target=${S}
                .openBlocksSun=${x?.openBlocksSun??!1}
                .disabled=${r}
                @acp-tilt-set=${e=>x&&this._setAxis(o,x.id,e.detail)}
              ></acp-tilt-bar>
            </div>`:V}
        ${m?H`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${st("tile.open",this.hass)}
                ?disabled=${!E||M||I}
                @click=${()=>C&&this._setAxis(E,C.id,C.max)}
              >
                <ha-icon icon=${_t(n)}></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${st("tile.stop",this.hass)}
                ?disabled=${!E||M}
                @click=${()=>this._stopCover(E)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${st("tile.close",this.hass)}
                ?disabled=${!E||M||P}
                @click=${()=>C&&this._setAxis(E,C.id,C.min)}
              >
                <ha-icon icon=${gt(n)}></ha-icon>
              </button>
            </div>`:V}
        ${y?V:de}
      </div>
    `}_resolvedCover(e){return this._config?.cover?this._config.cover:e.managed_covers[0]}_currentPosition(e){return Ht(this.hass,e)}_transitState(e){const t=e.entities.target_position_sensor;if(!t)return null;const o=this._resolvedCover(e);if(!o)return null;const i=this.hass.states[t]?.attributes?.transit_states;return i?.[o]??null}_liveCoverPosition(e,t){return Vt(this.hass,e,t)}_winner(e){const t=e.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(e){const t=e.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_motionActiveState(e){const t=e.entities.motion_status_sensor;if(!t)return null;const o=this.hass.states[t]?.state;return"motion_detected"===o||"timeout_pending"===o?o:null}_manualOverrideOn(e){const t=e.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(e,t){const o=e.entities[t];return!o||"off"!==this.hass.states[o]?.state}_manualEndIso(e){if(!this._manualOverrideOn(e))return;const t=e.entities.manual_override_end_sensor;return t?this.hass.states[t]?.state:void 0}_setCoverPosition(e,t){e&&this._setAxis(e,"position",t)}_posBar(e,t,o,i,s){const n=this._posDrag?.id===e,r=n?this._posDrag.pct:t,a=null===r?0:ft(r,i),l=null===o?null:ft(o,i),c=null!==o?`${nt(r)} · ${st("dialog.target",this.hass)} ${nt(o)}`:nt(r);return H`<div
      class="pos-slider${n?" dragging":""}"
      role="slider"
      tabindex="0"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${a}
      aria-valuetext=${st("covers.position_open_value",this.hass,{pct:nt(r)})}
      aria-label=${s?`${s} · ${st("covers.position_slider_label",this.hass)}`:st("covers.position_slider_label",this.hass)}
      @click=${t=>this._onPosClick(t,e,i)}
      @pointerdown=${t=>this._onPosPointerDown(t,e,i)}
      @pointermove=${t=>this._onPosPointerMove(t,e,i)}
      @pointerup=${this._onPosPointerEnd}
      @pointercancel=${this._onPosPointerEnd}
      @keydown=${t=>this._onPosKeydown(t,e,a,i)}
    >
      <div class="pos-bar" ${xo(c)}>
        <div class="pos-fill" style=${`width:${a}%`}></div>
        ${null!==l?H`<div
              class="pos-marker"
              style=${`left:clamp(1px, ${l}%, calc(100% - 1px))`}
            ></div>`:V}
      </div>
      ${n?H`<div
            class="pos-readout"
            style=${`left:clamp(16px, ${a}%, calc(100% - 16px))`}
          >
            ${nt(r)}
          </div>`:V}
    </div>`}_railIcon(e,t,o){const i=this.hass.states[e];return ut({explicitIcon:i?.attributes?.icon,deviceClass:i?.attributes?.device_class,coverType:t.cover_type,position:o})}_coverShortName(e,t){const o=this.hass.states[e]?.attributes?.friendly_name??e,i=t.entry_title;if(i&&o.toLowerCase().startsWith(i.toLowerCase())){const e=o.slice(i.length).replace(/^[\s\-–—:]+/,"");if(e)return e}return o}_posPctFromEvent(e,t){const o=t.getBoundingClientRect(),i=Math.round((e.clientX-o.left)/o.width*100);return Math.max(0,Math.min(100,i))}_onPosClick(e,t,o){e.stopPropagation(),this._setCoverPosition(t,ft(this._posPctFromEvent(e,e.currentTarget),o))}_onPosKeydown(e,t,o,i){let s;switch(e.key){case"ArrowRight":case"ArrowUp":s=o+1;break;case"ArrowLeft":case"ArrowDown":s=o-1;break;case"PageUp":s=o+10;break;case"PageDown":s=o-10;break;case"Home":s=0;break;case"End":s=100;break;default:return}e.preventDefault(),e.stopPropagation(),this._setCoverPosition(t,ft(Math.max(0,Math.min(100,s)),i))}_stopCover(e){e&&this.hass.callService(Te,"stop",{},{entity_id:e})}_setAxis(e,t,o){e&&Li(this.hass,e,{[t]:o})}_axisTarget(e,t){const o=t.targetRole;if(!o)return null;const i=e.entities[o];if(!i)return null;const s=parseFloat(this.hass.states[i]?.state??"");return Number.isNaN(s)?null:s}_liveAxis(e,t){return Yt(this.hass,t,e)}_axisLabel(e){const t=qe[e.id];return t?st(t,this.hass):e.label}_resume(e){const t=e.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}_tapActionConfig(){const e=this._config?.tap_action;if("string"!=typeof e)return e}_isFullyInert(e){return!!(e=>!!e&&"none"===e.action)(this._tapActionConfig())&&!Pi(e.hold_action)&&!Pi(e.double_tap_action)}_fireAction(e){if(!this._config||!this.hass)return;const t=this._tapActionConfig();if("tap"===e&&void 0===t)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));Ii(this,this.hass,{entity:this._actionEntity(),tap_action:t,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},e)}_hasIconAction(){return Pi(this._config?.icon_tap_action)}_actionEntity(){const e=this._discovered;return e?.is_group?e.entities.group_cover??e.entities.group_position_sensor:this._resolvedCoverFromState()}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const e=this._discovered??this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?.managed_covers[0]}_stop(e){e.stopPropagation()}};ir.styles=a`
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
    /* Detailed layout matches HA's native tile card: a tinted icon shape, a
       name-over-state label column, and inline control buttons on the right —
       all on one row. ACP's own chrome (Auto / winner / floor badges) and the
       position bar share a second row (.chrome-line): badges left, bar right.
       The icon spans both rows so it stays vertically centered (issue #208). */
    .tile-body.detailed {
      grid-template-columns: 36px minmax(0, 1fr) auto;
      grid-template-rows: auto;
      grid-template-areas: 'icon label controls';
      align-items: center;
      /* HA's ha-tile-container .content uses a 10px gap and a 56px row floor. */
      column-gap: 10px;
      min-height: var(--row-height, 56px);
      /* Tight row gap pulls the chrome row (badges + position bar) up snug under
         the name/state so the tile stays as short as possible when badges are
         present (issue #208). */
      row-gap: 2px;
    }
    /* HA's inline features block is a hard 50% of the card, not a content-sized
       or equal-share column — see the .controls rule below. The 12px subtrahend
       is its --ha-space-3 inline-end padding. Gated on .has-controls: with
       show_controls false the track is empty, and a 50% track would reserve half
       the tile for nothing where the auto above collapses to zero. */
    .tile-body.detailed.has-controls {
      grid-template-columns: 36px minmax(0, 1fr) calc(50% - 12px);
    }
    /* Row 2 = the chrome row: Auto/winner/floor badges on the left, position bar
       right-aligned. The icon spans both rows (grid-area repeated) so it stays
       vertically centered in the tile rather than pinned to the name row
       (issue #208). */
    .tile-body.detailed.has-chrome-row {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label  controls'
        'icon chrome chrome';
    }
    /* Row 2 (or 3) = the venetian tilt slider, indented under label; icon still
       spans every row so it stays centered. */
    .tile-body.detailed.has-tilt {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label controls'
        'icon tilt  tilt';
    }
    .tile-body.detailed.has-chrome-row.has-tilt {
      grid-template-rows: auto auto auto;
      grid-template-areas:
        'icon label  controls'
        'icon chrome chrome'
        'icon tilt   tilt';
    }
    /* Bar-only (position bar, no badges) gets NO grid special-case: it uses the
       same .has-chrome-row grid as a badged tile, so the bar spans label+controls
       at full tile width and the name/state sit in row 1. The old special-case
       confined the bar to the label column and spanned .label across both rows to
       keep it centered (issue #208) — but a centered label and a bottom-aligned
       bar then shared one cell and overlapped (issue #260), and the confined bar
       read as a different component from the badged tile's full-width one. A
       bar-only tile is now a badged tile minus the badges. */
    /* Name over state, vertically centered against the icon (HA ha-tile-info).
       No gap: HA's .info stacks the two lines with no gap and lets the primary
       line-height (normal, 1.6) do the spacing. */
    .tile-body.detailed .label {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    /* Match HA's ha-tile-info text through the same theme tokens the native
       tile card uses, so ACP inherits any theme font-scaling/recoloring
       instead of drifting with hardcoded values. Fallbacks are HA's own
       defaults: name 14px/500 at line-height normal with 0.1px tracking, state
       12px/400 at condensed with 0.4px. Note the primary and secondary lines
       use DIFFERENT line-heights upstream — normal for the name, condensed for
       the state. */
    .tile-body.detailed .title {
      font-size: var(--ha-font-size-m, 0.875rem);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-normal, 1.6);
      letter-spacing: 0.1px;
      color: var(--primary-text-color);
    }
    .tile-body.detailed .state {
      font-size: var(--ha-font-size-s, 0.75rem);
      font-weight: var(--ha-font-weight-normal, 400);
      line-height: var(--ha-line-height-condensed, 1.2);
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    /* Chrome row: Auto/winner/floor badges (left) and the position bar (right)
       share one row under the name/state. Kept on a single line (nowrap): the
       badges hold their size and the position bar shrinks to absorb the squeeze,
       so badges never spill onto a second row before the bar has given up its
       width (issue #208). */
    .chrome-line {
      grid-area: chrome;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 6px;
      min-width: 0;
      /* Rail geometry, shared by the lone rail and the multi-cover stack so the
         two stay the same length — see the .pos-stack note (issue #260). The
         glyph lane is the per-rail glyph plus the .pos-row gap that separates it
         from the rail. */
      --acp-rail-basis: 170px;
      --acp-rail-max: 55%;
      --acp-rail-glyph-size: 15px;
      --acp-rail-glyph-gap: 6px;
      --acp-rail-glyph-lane: calc(var(--acp-rail-glyph-size) + var(--acp-rail-glyph-gap));
      /* Reserve the badge pill's height even when no badge is present, so a
         bar-only tile is the same height as one with badges — the position bar
         just centers in the reserved space (issue #208). Matches the tile-badge
         height (0.75rem × 1.4 line + 2px×2 padding ≈ 22px). */
      min-height: 22px;
    }
    /* Badges hold their intrinsic width so the bar (not the badges) absorbs any
       shortage of room on the single chrome line. */
    .chrome-line acp-tile-badge {
      overflow: visible;
      flex: 0 0 auto;
    }
    .chrome-line .acp-floor-chip {
      flex: 0 0 auto;
    }
    /* Target-vs-actual mini bar: right-aligned (margin-left:auto) so it fills the
       otherwise-empty space beneath the ↑■↓ buttons. Fill = live openness in the
       state color; the tick marks the auto/solar target. */
    /* Interactive wrapper: carries the flex sizing the rail used to own, so the
       visible 6px rail below is unchanged while the gesture target is bigger. */
    .chrome-line .pos-slider {
      margin-left: auto;
      align-self: center;
      position: relative;
      flex: 0 1 var(--acp-rail-basis);
      max-width: var(--acp-rail-max);
      cursor: pointer;
      /* A touch-drag must move the fill, not scroll the dashboard. */
      touch-action: none;
    }
    /* The rail is 6px tall — too thin to grab on a phone. Widen the hit area
       vertically with an invisible absolute box, which adds no layout height. */
    .chrome-line .pos-slider::before {
      content: '';
      position: absolute;
      inset: -8px 0;
    }
    /* Multi-cover entry: the rails stack in the slot the single rail occupies,
       each labelled with its cover's glyph. The stack owns the flex sizing so
       each rail below it can size itself to the full stack width.

       It is WIDER than a lone rail by exactly the glyph lane, so the glyphs hang
       to the left of the rail track instead of shortening the rails. Both are
       margin-left:auto, so the right edges meet and — the lane cancelling out on
       the left — a stacked rail and a lone rail are the same length and start at
       the same x (issue #260). Derive, never hardcode: the lane is the glyph's
       own width plus the .pos-row gap. */
    .chrome-line .pos-stack {
      margin-left: auto;
      align-self: center;
      flex: 0 1 calc(var(--acp-rail-basis) + var(--acp-rail-glyph-lane));
      max-width: calc(var(--acp-rail-max) + var(--acp-rail-glyph-lane));
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .chrome-line .pos-stack .pos-row {
      display: flex;
      align-items: center;
      gap: var(--acp-rail-glyph-gap);
      min-width: 0;
    }
    /* Layers of ONE cover vs. separate covers. A day/night shade's two rails and
       a blind entry with three windows attached both render as a rail stack, and
       until now looked identical — same glyph, same spacing, same everything.

       Layered rails get a BRACE: a hairline down the glyph lane's gap, tying the
       rails into one object. Separate covers keep today's rendering untouched,
       so the common path has nothing to regress.

       The brace is absolutely positioned, so it costs no layout width — but the
       6px gap is too tight to sit a line in with air either side, so the layered
       stack widens its gap. That widens the derived glyph lane, which moves the
       stack's LEFT edge out; the rails keep their length and their right edge,
       which is the invariant issue #260 established. */
    .chrome-line .pos-stack.layered {
      --acp-rail-glyph-gap: 10px;
      /* Re-declare the lane HERE, not just the gap. A custom property is
         substituted at computed-value time on the element that DECLARES it, so
         the lane inherited from .chrome-line is already frozen at the 6px gap —
         overriding the gap alone would leave the flex basis 4px short and the
         rails 4px stubbier than a lone rail. Redeclaring recomputes it against
         the local gap, which is the whole point of deriving it. */
      --acp-rail-glyph-lane: calc(var(--acp-rail-glyph-size) + var(--acp-rail-glyph-gap));
      position: relative;
      gap: 2px;
    }
    .chrome-line .pos-stack.layered::before {
      content: '';
      position: absolute;
      /* Centered in the gap between the glyph column and the rails. */
      left: calc(var(--acp-rail-glyph-size) + (var(--acp-rail-glyph-gap) / 2) - 1px);
      width: 2px;
      /* Span rail-center to rail-center rather than the full box, so the brace
         reads as joining the rails instead of boxing the stack. A row is the
         glyph's height, so half of one is the inset at each end. */
      top: calc(var(--acp-rail-glyph-size) / 2);
      bottom: calc(var(--acp-rail-glyph-size) / 2);
      border-radius: 1px;
      background: var(--secondary-text-color);
      opacity: 0.45;
    }
    /* Per-rail glyph in place of a name: two rails of one shade have long,
       near-identical names that ate the rail's width.

       ha-icon defaults to inline-flex and inherits the tile's line-height, so
       its glyph sits low inside its own box even though the row centers that
       box. Making it a zero-line-height flex box centers the glyph on the rail
       rather than on a text baseline the rail knows nothing about. */
    .chrome-line .pos-stack .pos-glyph {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: center;
      line-height: 0;
      --mdc-icon-size: var(--acp-rail-glyph-size);
      width: var(--acp-rail-glyph-size);
      height: var(--acp-rail-glyph-size);
      color: var(--secondary-text-color);
    }
    .chrome-line .pos-stack .pos-slider {
      margin-left: 0;
      flex: 1 1 auto;
      max-width: none;
    }
    /* Rails sit tight in the stack, so the ±8px grab boxes would overlap and
       the upper rail would swallow the lower rail's top half. */
    .chrome-line .pos-stack .pos-slider::before {
      inset: -2px 0;
    }
    .chrome-line .pos-slider:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
      border-radius: 6px;
    }
    /* The 0.3s ease below smooths server-driven updates; mid-drag it would read
       as the fill lagging behind the finger. */
    .chrome-line .pos-slider.dragging .pos-fill {
      transition: none;
    }
    /* Live percentage while a drag is in flight. The hover tooltip carries the
       same number, but a tooltip is mouse-only — on a phone, the finger setting
       the position is also the thing covering the rail, so without this the user
       is dragging blind. Sits in .pos-slider, NOT .pos-bar: the bar is
       overflow:hidden to clip the fill, which would clip this too. Pointer-events
       off so it never eats the drag it is reporting on. */
    .chrome-line .pos-readout {
      position: absolute;
      bottom: calc(100% + 6px);
      transform: translateX(-50%);
      padding: 1px 5px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.9));
      color: var(--primary-text-color);
      font-size: var(--ha-font-size-s, 0.75rem);
      line-height: var(--ha-line-height-condensed, 1.2);
      white-space: nowrap;
      pointer-events: none;
      z-index: 2;
    }
    .chrome-line .pos-bar {
      position: relative;
      width: 100%;
      height: 6px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      overflow: hidden;
    }
    .chrome-line .pos-fill {
      position: absolute;
      inset: 0 auto 0 0;
      /* One constant color for every rail, never the cover's state color: a rail
         that changed hue as it crossed open/closed read as a status light rather
         than a measurement, and on a multi-rail tile the rails disagreed with
         each other. The icon still carries state color (the state_color option),
         which is where that signal belongs. Overridable per-theme via
         --acp-pos-fill-color. */
      background: var(--acp-pos-fill-color, ${r(mt)});
      opacity: 0.55;
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    .chrome-line .pos-marker {
      position: absolute;
      top: 0;
      width: 2px;
      height: 100%;
      background: var(--accent-color, #ff9800);
      transform: translateX(-50%);
      transition: left 0.3s ease;
    }
    .tilt-line {
      grid-area: tilt;
      min-width: 0;
      margin-top: 2px;
      cursor: default;
    }
    /* Optional decision summary stacks as a dim third line under the state. */
    .tile-body.detailed .label .summary {
      font-size: 0.72rem;
    }
    /* Mirror HA's tile card in features_position: inline mode, whose spec
       differs from the bottom feature row. ha-tile-container's
       .container.horizontal rule for the features slot sets
       --feature-height: var(--ha-space-9) — 36px, not the 42px of a bottom row —
       and pins the block to calc(50% - gap/2 - var(--ha-space-3)). Inside it,
       card-feature-styles maps --feature-height onto
       --control-button-group-thickness and --feature-border-radius
       (--ha-border-radius-lg = 12px) onto --control-button-border-radius, while
       ha-control-button contributes a 20px glyph and a --disabled-color fill at
       20% opacity. Buttons are flex: 1 inside that block, so they widen with the
       tile exactly as HA's do. */
    .tile-body.detailed .controls {
      align-self: center;
      /* --feature-button-spacing */
      gap: 12px;
      width: 100%;
    }
    .tile-body.detailed .controls button {
      flex: 1 1 0;
      width: auto;
      height: var(--control-button-group-thickness, 36px);
      border-radius: var(--control-button-border-radius, 12px);
      border: none;
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 20%,
        transparent
      );
    }
    .tile-body.detailed .controls button ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-text-color);
    }
    .tile-body.detailed .controls button:hover {
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 32%,
        transparent
      );
    }
    /* Bare 36px glyph by default — the state color carries the cover's status
       with nothing behind it. HA does the same for covers, though by a
       different route: its shape is drawn only when the icon is interactive,
       and getEntityDefaultTileIconAction returns none for the cover domain.
       Setting icon_tap_action opts into the shape via .background below. */
    .tile-body.detailed .cover-icon-wrap {
      place-self: center;
      width: 36px;
      height: 36px;
    }
    /* HA's ha-tile-icon shape: a pill at --ha-border-radius-pill filled with the
       icon's own color at 0.2 opacity (0.35 on hover), painted as a ::before so
       the tint never dims the glyph on top of it. --acp-tile-icon-color is set
       inline from coverStateColor, so shape and glyph always agree. */
    /* Scoped to .detailed: the one-line layout's glyph box is 24px around a 22px
       icon, so a pill there would be a hairline of tint around the glyph. The
       tap action still works in one-line — only the shape is detailed-only. */
    .tile-body.detailed .cover-icon-wrap.background {
      position: relative;
      border-radius: var(--ha-border-radius-pill, 9999px);
      overflow: hidden;
      cursor: pointer;
    }
    .tile-body.detailed .cover-icon-wrap.background::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: var(--acp-tile-icon-color, var(--disabled-color, #7f7f7f));
      opacity: 0.2;
      transition: opacity 180ms ease-in-out;
    }
    .tile-body.detailed .cover-icon-wrap.background:hover::before {
      opacity: 0.35;
    }
    .cover-icon-wrap.background:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--acp-tile-icon-color, var(--primary-text-color));
      border-radius: var(--ha-border-radius-pill, 9999px);
    }
    /* The glyph must sit above the ::before wash. */
    .tile-body.detailed .cover-icon-wrap.background .cover-icon {
      position: relative;
    }
    .tile-body.detailed .cover-icon {
      --mdc-icon-size: 24px;
    }
    .tile-body[role='group'] {
      cursor: default;
    }
    /* Offline/unresponsive cover (issue #212): dim the whole tile so it reads
       as unavailable at a glance, matching HA's own unavailable-entity dimming. */
    .tile-body.unavailable {
      opacity: 0.5;
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
    /* Sibling of .motion-overlay, pinned to the opposite corner so a cover that
       is both occupied and low on battery shows both without them colliding —
       motion top-right, battery bottom-left. */
    .battery-overlay {
      position: absolute;
      bottom: -4px;
      left: -6px;
      --mdc-icon-size: 12px;
      color: var(--error-color, #db4437);
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
      background: color-mix(in srgb, var(--acp-floor-accent) ${22}%, transparent);
      /* The custom-position purple resolved AGAINST THE THEME'S OWN TEXT COLOR
         rather than pinned to a literal. The literal it replaces (#6a1b9a) is a
         dark purple chosen for a light background; on HA's dark theme it landed
         at 1.6:1 filled and 1.3:1 hollow — the chip was legible only if you knew
         what it said. Mixing with --primary-text-color leans the same hue dark
         on a light theme and light on a dark one, so one declaration covers
         both, and it follows a custom theme rather than guessing from the OS
         the way prefers-color-scheme would.

         The ratios come from const.ts rather than being restated here. Written
         out by hand this chip used 60%, which reads as a deliberate emphasis
         and is not — it lands at 4.35:1 on HA dark, under the 4.5:1 floor the
         badges beside it clear at 40%. Importing the constants is what stops the
         chip and the badges from drifting apart again. */
      --acp-floor-accent: #9c27b0;
      color: color-mix(
        in srgb,
        var(--acp-floor-accent) ${40}%,
        var(--primary-text-color, #212121)
      );
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
      border-color: color-mix(in srgb, var(--acp-floor-accent) 60%, transparent);
    }
    /* Priority axis: bypassable (priority ≤ 80) → subdued.
       NOT opacity any more. Opacity multiplies into the TEXT as much as the
       chrome, and stacked on the hollow variant it was what took this chip to
       1.3:1 — a legibility cost paid to signal a secondary attribute. The
       priority axis already has a non-destructive carrier in font-weight (see
       .resists-manual), so bypassable states itself by NOT being emphasized,
       and softens its outline instead. Text contrast is untouched. */
    .acp-floor-chip.is-bypassable {
      font-weight: 400;
    }
    /* Scoped to the hollow variant on purpose: the filled one has a deliberately
       transparent border, and softening a border that isn't drawn would instead
       make one appear. */
    .acp-floor-chip.is-armed.is-bypassable {
      border-color: color-mix(in srgb, var(--acp-floor-accent) 35%, transparent);
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
    /* Reflow (issues #136, #154): drop the ↑■▼ controls onto their own
       full-width row beneath the name so the cover name gets the whole column,
       with the badge and tilt rows stacked between. The same reflow fires from
       two independent triggers, because "the tile is narrow" alone can't tell a
       phone from a medium tile in a multi-column desktop dashboard — both can be
       ~400px wide:

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
        .tile-body.detailed {
          grid-template-columns: 36px minmax(0, 1fr);
          grid-template-areas:
            'icon label'
            'controls controls';
        }
        /* The 50% has-controls track is (0,3,0) and a query adds no specificity,
           so without this it would keep a third column alive here and strand the
           reflowed full-width controls row beside it. */
        .tile-body.detailed.has-controls {
          grid-template-columns: 36px minmax(0, 1fr);
        }
        .tile-body.detailed.has-chrome-row {
          grid-template-areas:
            'icon label'
            'icon chrome'
            'controls controls';
        }
        .tile-body.detailed.has-tilt {
          grid-template-areas:
            'icon label'
            'icon tilt'
            'controls controls';
        }
        .tile-body.detailed.has-chrome-row.has-tilt {
          grid-template-areas:
            'icon label'
            'icon chrome'
            'icon tilt'
            'controls controls';
        }
        /* No bar-only re-assertion needed: the wide layout no longer special-cases
           bar-only, so the .has-chrome-row reflow above already applies (#260). */
        .tile-body.detailed .controls {
          margin-top: 4px;
          gap: 8px;
          justify-content: space-between;
        }
        .tile-body.detailed .controls button {
          flex: 1 1 0;
          width: auto;
          height: var(--control-button-group-thickness, 36px);
        }
      }
    }
    @container (max-width: 340px) {
      .tile-body.detailed {
        grid-template-columns: 36px minmax(0, 1fr);
        grid-template-areas:
          'icon label'
          'controls controls';
      }
      /* Same re-assertion as the 480px block — see the note there. */
      .tile-body.detailed.has-controls {
        grid-template-columns: 36px minmax(0, 1fr);
      }
      .tile-body.detailed.has-chrome-row {
        grid-template-areas:
          'icon label'
          'icon chrome'
          'controls controls';
      }
      .tile-body.detailed.has-tilt {
        grid-template-areas:
          'icon label'
          'icon tilt'
          'controls controls';
      }
      .tile-body.detailed.has-chrome-row.has-tilt {
        grid-template-areas:
          'icon label'
          'icon chrome'
          'tilt tilt'
          'controls controls';
      }
      /* Same as the 480px block: no bar-only re-assertion needed (#260). */
      .tile-body.detailed .controls {
        margin-top: 4px;
        gap: 8px;
        justify-content: space-between;
      }
      .tile-body.detailed .controls button {
        flex: 1 1 0;
        width: auto;
        height: var(--control-button-group-thickness, 36px);
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
  `,e([ge({attribute:!1})],ir.prototype,"hass",void 0),e([me()],ir.prototype,"_config",void 0),e([me()],ir.prototype,"_registry",void 0),e([me()],ir.prototype,"_registryError",void 0),e([me()],ir.prototype,"_dialogOpen",void 0),e([me()],ir.prototype,"_posDrag",void 0),e([me()],ir.prototype,"_extendOpen",void 0),ir=e([pe($e)],ir),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===$e)||window.customCards.push({type:$e,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:Fo(`custom:${$e}`,"entry_id")});let sr=class extends de{constructor(){super(...arguments),this.compact=!1,this._roster=Ms()}render(){if(!this.hass||!this.discovered)return V;const e=_s(this.hass,this.discovered),t=Object.entries(e.memberPositions),o=!!e.target;return H`
      <div class="group-view">
        <div class="summary">
          <span class="agg-state">${st(`group.state_${e.aggregate}`,this.hass)}</span>
          <span class="agg-position">${nt(e.position)}</span>
          ${is(e.memberWinners).map(e=>H`<acp-tile-badge .hass=${this.hass} .winner=${e}></acp-tile-badge>`)}
        </div>

        <acp-axis-bar
          layout="cover"
          .hass=${this.hass}
          .label=${st("group.position",this.hass)}
          .hintKey=${"covers.click_to_set"}
          .targetHintKey=${"covers.target_tooltip"}
          .actual=${e.position}
          .openBlocksSun=${At(this.discovered).openBlocksSun}
          .compact=${this.compact}
          .disabled=${!o}
          @acp-tilt-set=${t=>fs(this.hass,e,t.detail)}
        ></acp-axis-bar>
        ${e.tilt?H`<acp-axis-bar
              layout="cover"
              .hass=${this.hass}
              .label=${st("covers.tilt_title",this.hass)}
              .actual=${e.tilt.value}
              .openBlocksSun=${!1}
              .compact=${this.compact}
              @acp-tilt-set=${t=>ys(this.hass,e,t.detail)}
            ></acp-axis-bar>`:V}

        <div class="controls">
          <acp-cover-move-buttons
            labels="group"
            .hass=${this.hass}
            .position=${e.position}
            .deviceClass=${e.deviceClass}
            .enabled=${o}
            @acp-move=${t=>this._move(t,e)}
          ></acp-cover-move-buttons>
        </div>

        <acp-group-controls-row
          .hass=${this.hass}
          .discovered=${this.discovered}
          .snapshot=${e}
        ></acp-group-controls-row>

        <div class="members">
          <div class="members-head">${st("group.members",this.hass)}</div>
          ${0===t.length?H`<div class="member-placeholder">
                ${st("group.member_placeholder",this.hass)}
              </div>`:Cs(this._roster(this.hass,t.map(([e])=>e),Io()??void 0),Ts,t=>H`<acp-group-member-row
                    .hass=${this.hass}
                    .entityId=${t.covers[0]}
                    .coverIds=${t.covers}
                    .position=${e.memberPositions[t.covers[0]]??null}
                    .winner=${e.memberWinners?.[t.covers[0]]}
                    .openBlocksSun=${At(this.discovered).openBlocksSun}
                    .acpManaged=${!!e.memberWinners&&t.covers[0]in e.memberWinners}
                    .displayName=${this.memberNames?.[Is(t)]}
                    .compact=${this.compact}
                  ></acp-group-member-row>`)}
        </div>
      </div>
    `}_move(e,t){"stop"===e.detail?bs(this.hass,this.discovered,t):fs(this.hass,t,"open"===e.detail?100:0)}};sr.styles=a`
    :host {
      display: block;
    }
    .group-view {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .summary {
      display: flex;
      align-items: baseline;
      gap: 10px;
      font-size: 1.1rem;
      flex-wrap: wrap;
    }
    .agg-state {
      color: var(--secondary-text-color);
      text-transform: capitalize;
    }
    .agg-position {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .controls {
      display: flex;
      align-items: center;
    }
    .members {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .members-head {
      font-size: 0.78rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .member-placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 12px;
    }
  `,e([ge({attribute:!1})],sr.prototype,"hass",void 0),e([ge({attribute:!1})],sr.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],sr.prototype,"compact",void 0),e([ge({attribute:!1})],sr.prototype,"memberNames",void 0),sr=e([pe("acp-group-view")],sr);const nr=[{key:"sky",labelKey:"editor.main.section_sky_label",descKey:"editor.main.section_sky_desc"},{key:"elevation",labelKey:"editor.main.section_elevation_label",descKey:"editor.main.section_elevation_desc"},{key:"decision",labelKey:"editor.main.section_decision_label",descKey:"editor.main.section_decision_desc"},{key:"covers",labelKey:"editor.main.section_covers_label",descKey:"editor.main.section_covers_desc"},{key:"overrides",labelKey:"editor.main.section_overrides_label",descKey:"editor.main.section_overrides_desc"},{key:"climate",labelKey:"editor.main.section_climate_label",descKey:"editor.main.section_climate_desc"},{key:"solar",labelKey:"editor.main.section_solar_label",descKey:"editor.main.section_solar_desc",enabledByDefault:!1}],rr=nr.filter(e=>!1!==e.enabledByDefault).map(e=>e.key);let ar=class extends de{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ro(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??rr}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_onEntryChange(e){const t=e.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:t})}_onSectionToggle(e,t){const o=new Set(this._currentSections);t?o.add(e):o.delete(e);const i=nr.map(e=>e.key).filter(e=>o.has(e));this._emit({...this._config??{type:"",entry_id:""},show_sections:i})}_onCompactToggle(e){this._emit({...this._config??{type:"",entry_id:""},compact:e})}_onCompassStatsToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:e})}_onCompassLegendToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:e})}_onMoonToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_moon:e})}_onHideInactiveToggle(e){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:e})}_onStateColorToggle(e){this._emit({...this._config??{type:"",entry_id:""},state_color:e})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),o=Number.isFinite(t)?t:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:o})}_onControlToggle(e,t){const o=this._config??{type:"",entry_id:""};this._emit({...o,controls:{...o.controls,[e]:t}})}_onCoverColorChange(e){const t=this._config??{type:"",entry_id:""};this._emit({...t,cover_colors:[e]})}_onCoverColorReset(){const e={...this._config??{type:"",entry_id:""}};delete e.cover_colors,this._emit(e)}render(){if(!this._config)return V;const e=new Set(this._currentSections);return H`
      <div class="form">
        <div class="section">
          <label class="field-label">${st("editor.common.entry_id",this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${st("editor.main.sections",this.hass)}</label>
          <div class="hint">${st("editor.main.sections_hint",this.hass)}</div>
          ${nr.map(t=>H`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${e.has(t.key)}
                  @change=${e=>this._onSectionToggle(t.key,e.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${st(t.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${st(t.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${st("editor.main.controls",this.hass)}</label>
          <div class="hint">${st("editor.main.controls_hint",this.hass)}</div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.integration_enabled??!0}
              @change=${e=>this._onControlToggle("integration_enabled",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${st("editor.main.integration_pill_label",this.hass)}</span
              >
              <span class="toggle-desc">${st("editor.main.integration_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.automatic_control??!0}
              @change=${e=>this._onControlToggle("automatic_control",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${st("editor.main.automatic_pill_label",this.hass)}</span>
              <span class="toggle-desc">${st("editor.main.automatic_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.reset_manual_override??!0}
              @change=${e=>this._onControlToggle("reset_manual_override",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${st("editor.main.reset_button_label",this.hass)}</span>
              <span class="toggle-desc">${st("editor.main.reset_button_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        ${this._config.entry_id?H`
              <div class="section">
                <label class="field-label">${st("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${st("editor.compass.cover_colors_hint",this.hass)}</div>
                ${(()=>{const e=this._config.cover_colors?.[0]??null,t=e??hi(0);return H`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${t}
                        @change=${e=>this._onCoverColorChange(e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-desc"
                          >${e||st("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!e}
                        @click=${()=>this._onCoverColorReset()}
                      >
                        ${st("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})()}
              </div>
            `:V}

        <div class="section">
          <label class="field-label">${st("editor.main.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${e=>this._onCompactToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${st("editor.main.compact_label",this.hass)}</span>
              <span class="toggle-desc">${st("editor.main.compact_desc",this.hass)}</span>
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
                >${st("editor.main.show_compass_stats_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${st("editor.main.show_compass_stats_desc",this.hass)}</span
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
                >${st("editor.main.show_compass_legend_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${st("editor.main.show_compass_legend_desc",this.hass)}</span
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
              <span class="toggle-label">${st("editor.main.show_moon_label",this.hass)}</span>
              <span class="toggle-desc">${st("editor.main.show_moon_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.hide_inactive_handlers??!1}
              @change=${e=>this._onHideInactiveToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${st("editor.main.hide_inactive_label",this.hass)}</span>
              <span class="toggle-desc">${st("editor.main.hide_inactive_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${!1!==this._config.state_color}
              @change=${e=>this._onStateColorToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${st("editor.main.state_color_label",this.hass)}</span>
              <span class="toggle-desc">${st("editor.main.state_color_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">${st("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${st("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${Xn(this.hass)}
      </div>
    `}_renderEntryPicker(){return this._entriesError?H`
        <div class="error">
          ${st("editor.common.load_failed",this.hass,{error:this._entriesError})}
        </div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder=${st("editor.common.entry_id_manual_placeholder",this.hass)}
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?H`
        <div class="error">
          ${st("editor.common.no_entries",this.hass)}
          <code>${st("editor.common.no_entries_path",this.hass)}</code>${st("editor.common.no_entries_then",this.hass)}
        </div>
      `:H`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(e=>e.entry_id===this._config.entry_id)?H`<option value=${this._config.entry_id}>
              ${st("editor.common.unknown_entry",this.hass,{entry:this._config.entry_id})}
            </option>`:V}
        ${this._entries.map(e=>H`
            <option value=${e.entry_id} ?selected=${e.entry_id===this._config?.entry_id}>
              ${e.title}
            </option>
          `)}
      </select>
    `:H`<div class="hint">${st("editor.common.loading_entries",this.hass)}</div>`}};ar.styles=a`
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
  `,e([ge({attribute:!1})],ar.prototype,"hass",void 0),e([me()],ar.prototype,"_config",void 0),e([me()],ar.prototype,"_entries",void 0),e([me()],ar.prototype,"_entriesError",void 0),ar=e([pe(ye)],ar);const lr=[{key:"compact",labelKey:"editor.compass.toggle_compact_label",descKey:"editor.compass.toggle_compact_desc",defaultOn:!1},{key:"show_legend",labelKey:"editor.compass.toggle_legend_label",descKey:"editor.compass.toggle_legend_desc",defaultOn:!0},{key:"show_stats",labelKey:"editor.compass.toggle_stats_label",descKey:"editor.compass.toggle_stats_desc",defaultOn:!0},{key:"show_moon",labelKey:"editor.compass.toggle_moon_label",descKey:"editor.compass.toggle_moon_desc",defaultOn:!1},{key:"show_cardinals",labelKey:"editor.compass.toggle_cardinals_label",descKey:"editor.compass.toggle_cardinals_desc",defaultOn:!0},{key:"show_blind_spot",labelKey:"editor.compass.toggle_blind_spot_label",descKey:"editor.compass.toggle_blind_spot_desc",defaultOn:!0},{key:"show_sun_path",labelKey:"editor.compass.toggle_sun_path_label",descKey:"editor.compass.toggle_sun_path_desc",defaultOn:!0},{key:"show_sunrise_sunset",labelKey:"editor.compass.toggle_sunrise_sunset_label",descKey:"editor.compass.toggle_sunrise_sunset_desc",defaultOn:!0},{key:"show_cover_fill",labelKey:"editor.compass.toggle_cover_fill_label",descKey:"editor.compass.toggle_cover_fill_desc",defaultOn:!0},{key:"show_window_arrow",labelKey:"editor.compass.toggle_window_arrow_label",descKey:"editor.compass.toggle_window_arrow_desc",defaultOn:!0},{key:"show_elevation_chart",labelKey:"editor.compass.toggle_elevation_chart_label",descKey:"editor.compass.toggle_elevation_chart_desc",defaultOn:!0}];let cr=class extends de{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ro(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${we}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let o=0;o<e.length;o++)e[o]&&(t=o);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,o){const i=this._trimColors(t),{cover_colors:s,...n}=e,r=i?{...n,...o,cover_colors:i}:{...n,...o};this._emit(r)}_onCoverColorChange(e,t){const o=this._baseConfig(),i=[...o.cover_colors??[]];for(;i.length<=e;)i.push(null);i[e]=t,this._emitWithColors(o,i)}_onCoverColorReset(e){const t=this._baseConfig(),o=[...t.cover_colors??[]];e<o.length&&(o[e]=null),this._emitWithColors(t,o)}_onEntryToggle(e,t){const o=this._baseConfig(),i=new Set(o.entry_ids);t?i.add(e):i.delete(e);const s=(this._entries??[]).map(e=>e.entry_id).filter(e=>i.has(e)),n=o.cover_colors??[],r=s.map(e=>{const t=o.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(o,r,{entry_ids:s})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),o=Number.isFinite(t)?t:0;this._emit({...this._baseConfig(),north_offset:o})}_onTitleChange(e){const t=e.target.value,o=this._baseConfig();if(t)this._emit({...o,title:t});else{const{title:e,...t}=o;this._emit(t)}}render(){if(!this._config)return V;const e=new Set(this._config.entry_ids);return H`
      <div class="form">
        <div class="section">
          <label class="field-label">${st("editor.compass.instances",this.hass)}</label>
          <div class="hint">${st("editor.compass.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(e)}
        </div>

        <div class="section">
          <label class="field-label">${st("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${st("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?H`
              <div class="section">
                <label class="field-label">${st("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${st("editor.compass.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const o=this._config.cover_colors?.[t]??null,i=o??hi(t),s=this._entries?.find(t=>t.entry_id===e);return H`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${i}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${s?.title??e}</span>
                        <span class="toggle-desc"
                          >${o||st("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!o}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${st("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:V}

        <div class="section">
          <label class="field-label">${st("editor.compass.display",this.hass)}</label>
          ${lr.map(e=>H`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${this._config[e.key]??e.defaultOn}
                  @change=${t=>this._onToggle(e.key,t.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${st(e.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${st(e.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${st("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${st("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${Xn(this.hass)}
      </div>
    `}_renderEntryPicker(e){return this._entriesError?H`<div class="error">
        ${st("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?H`
        <div class="error">
          ${st("editor.common.no_entries",this.hass)}
          <code>${st("editor.common.no_entries_path",this.hass)}</code>${st("editor.common.no_entries_then",this.hass)}
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
    `:H`<div class="hint">${st("editor.common.loading_entries",this.hass)}</div>`}};cr.styles=a`
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
  `,e([ge({attribute:!1})],cr.prototype,"hass",void 0),e([me()],cr.prototype,"_config",void 0),e([me()],cr.prototype,"_entries",void 0),e([me()],cr.prototype,"_entriesError",void 0),cr=e([pe(xe)],cr);let dr=class extends de{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._listMemo=ko(),this._discoveredResult={list:[],missing:[]}}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");if(this._config={...e,entry_ids:[...e.entry_ids]},e.tooltips&&bo(e.tooltips),null===this._registry){const e=this._config.entry_ids.map(e=>Lo.get(e)?.entries);e.every(e=>void 0!==e)&&(this._registry=e.flat())}}getCardSize(){return 4}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(xe)}static async getStubConfig(e){let t=[];try{const o=await Ro(e);o[0]&&(t=[o[0].entry_id])}catch{}return{type:`custom:${we}`,entry_ids:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Io();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=[];for(const e of this._discoveredResult.list)t.push(...Object.values(e.entities));return 0===t.length||ve(e.get("hass"),this.hass,t)}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discoveredResult=this._listMemo(this.hass,this._config.entry_ids,this._registry,this._config.type))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zo(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Po(this.hass,e).then(e=>{if(e!==this._registry&&(this._registry=e,this._registryError=null,this._config))for(const t of this._config.entry_ids)Lo.set(t,Go(e,t))}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return V;if(null===this._registry)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?st("tile.registry_failed",this.hass,{error:this._registryError}):st("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const{list:e,missing:t}=this._discoveredResult;if(0===e.length)return H`<ha-card>
        <div class="empty">
          <p><strong>${st("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${st("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
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
          .northOffsetDeg=${It(o.north_offset??0)}
        ></acp-sky-compass>
        ${!1!==o.show_elevation_chart?H`<acp-elevation-chart
              .hass=${this.hass}
              .discoveredList=${e}
              .coverColors=${o.cover_colors??[]}
              ?compact=${!!o.compact}
            ></acp-elevation-chart>`:V}
        ${t.length>0?H`<div class="warn dim">
              ${st("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:V}
      </ha-card>
    `}};dr.styles=a`
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
  `,e([ge({attribute:!1})],dr.prototype,"hass",void 0),e([me()],dr.prototype,"_config",void 0),e([me()],dr.prototype,"_registry",void 0),e([me()],dr.prototype,"_registryError",void 0),dr=e([pe(we)],dr),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===we)||window.customCards.push({type:we,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-SAA plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:Fo(`custom:${we}`,"entry_ids")});const hr={compact:!1,hide_inactive_handlers:!1,show_decision_summary:!0},pr={entry_id:"editor.common.entry_id",title:"editor.decision.title",compact:"editor.decision.compact_label",hide_inactive_handlers:"editor.decision.hide_inactive_handlers_label",show_decision_summary:"editor.decision.show_decision_summary_label"},ur={compact:"editor.decision.compact_desc",hide_inactive_handlers:"editor.decision.hide_inactive_handlers_desc",show_decision_summary:"editor.decision.show_decision_summary_desc"};let _r=class extends de{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._entriesFetchInFlight=!1,this._computeLabel=e=>{const t=pr[e.name];return t?st(t,this.hass):e.name},this._computeHelper=e=>{const t=ur[e.name];return t?st(t,this.hass):void 0},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,o]of Object.entries(hr))this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==o||delete t[e];const o={...this._config??{type:"",entry_id:""},...t};this._emit(o)}}setConfig(e){this._config={...e}}updated(e){e.has("hass")&&this.hass&&this._ensureEntries()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Ro(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this._config)return V;if(this._entriesError&&!this._entries)return H`
        <div class="form">
          <div class="error">
            ${st("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${st("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${st("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          ${Xn(this.hass)}
        </div>
      `;const e=this._schema(),t={...hr,...this._config};return H`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${t}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${Xn(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[];return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"title",selector:{text:{}}},{name:"compact",selector:{boolean:{}}},{name:"hide_inactive_handlers",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}}]}};_r.styles=a`
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
  `,e([ge({attribute:!1})],_r.prototype,"hass",void 0),e([me()],_r.prototype,"_config",void 0),e([me()],_r.prototype,"_entries",void 0),e([me()],_r.prototype,"_entriesError",void 0),_r=e([pe(Se)],_r);let gr=class extends de{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._historyOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._memo=$o(),this._discovered=null}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${Ae}: \`entry_id\` is required and must be a non-empty string`);if(this._config={...e},e.tooltips&&bo(e.tooltips),null===this._registry){const t=Lo.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 3}getGridOptions(){return{columns:12,rows:"auto",min_columns:4,max_columns:12}}static async getStubConfig(e){let t="";try{const o=await Ro(e);t=o[0]?.entry_id??""}catch{}return{type:`custom:${Ae}`,entry_id:t}}static async getConfigElement(){return document.createElement(Se)}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Io();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||ve(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zo(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Po(this.hass,e).then(e=>{t===this._fetchGen&&e!==this._registry&&(this._registry=e,this._registryError=null,this._config&&Lo.set(this._config.entry_id,Go(e,this._config.entry_id)))}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return V;if(null===this._registry)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?st("tile.registry_failed",this.hass,{error:this._registryError}):st("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=this._discovered;if(!e)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${st("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`;const t=this._config,o=st("history.open",this.hass);return H`
      <ha-card>
        <div class="card-top">
          ${t.title?H`<div class="card-header">${t.title}</div>`:V}
          <button
            class="icon-btn"
            type="button"
            aria-label=${o}
            title=${o}
            @click=${()=>{this._historyOpen=!0}}
          >
            <ha-icon icon=${Ve}></ha-icon>
          </button>
        </div>
        <acp-decision-strip
          .hass=${this.hass}
          .discovered=${e}
          ?compact=${!!t.compact}
          ?hide-inactive=${!!t.hide_inactive_handlers||!!t.compact}
          .showSummary=${!1!==t.show_decision_summary}
        ></acp-decision-strip>
      </ha-card>
      <acp-history-dialog
        .hass=${this.hass}
        .discovered=${e}
        .open=${this._historyOpen}
        @acp-history-closed=${()=>{this._historyOpen=!1}}
      ></acp-history-dialog>
    `}};gr.styles=a`
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
    /* Always present so the History button has a home; .card-header inside it
       stays conditional on the title, as it was before the button existed. */
    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-height: 24px;
    }
    .card-header {
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 2px;
      display: inline-flex;
      flex: 0 0 auto;
    }
    .icon-btn:hover {
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
  `,e([ge({attribute:!1})],gr.prototype,"hass",void 0),e([me()],gr.prototype,"_config",void 0),e([me()],gr.prototype,"_registry",void 0),e([me()],gr.prototype,"_registryError",void 0),e([me()],gr.prototype,"_historyOpen",void 0),gr=e([pe(Ae)],gr),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===Ae)||window.customCards.push({type:Ae,name:"Adaptive Cover Pro — Decision Strip",description:"Standalone decision strip: all pipeline handlers for one Adaptive Cover Pro instance with the winning row highlighted.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:Fo(`custom:${Ae}`,"entry_id")});let mr=class extends de{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ro(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${Ce}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let o=0;o<e.length;o++)e[o]&&(t=o);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,o){const i=this._trimColors(t),{cover_colors:s,...n}=e,r=i?{...n,...o,cover_colors:i}:{...n,...o};this._emit(r)}_onCoverColorChange(e,t){const o=this._baseConfig(),i=[...o.cover_colors??[]];for(;i.length<=e;)i.push(null);i[e]=t,this._emitWithColors(o,i)}_onCoverColorReset(e){const t=this._baseConfig(),o=[...t.cover_colors??[]];e<o.length&&(o[e]=null),this._emitWithColors(t,o)}_onEntryToggle(e,t){const o=this._baseConfig(),i=new Set(o.entry_ids);t?i.add(e):i.delete(e);const s=(this._entries??[]).map(e=>e.entry_id).filter(e=>i.has(e)),n=o.cover_colors??[],r=s.map(e=>{const t=o.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(o,r,{entry_ids:s})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onTitleChange(e){const t=e.target.value,o=this._baseConfig();if(t)this._emit({...o,title:t});else{const{title:e,...t}=o;this._emit(t)}}render(){if(!this._config)return V;const e=new Set(this._config.entry_ids);return H`
      <div class="form">
        <div class="section">
          <label class="field-label">${st("editor.solar_chart.instances",this.hass)}</label>
          <div class="hint">${st("editor.solar_chart.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(e)}
        </div>

        <div class="section">
          <label class="field-label">${st("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${st("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?H`
              <div class="section">
                <label class="field-label"
                  >${st("editor.solar_chart.cover_colors",this.hass)}</label
                >
                <div class="hint">${st("editor.solar_chart.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const o=this._config.cover_colors?.[t]??null,i=o??hi(t),s=this._entries?.find(t=>t.entry_id===e);return H`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${i}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${s?.title??e}</span>
                        <span class="toggle-desc"
                          >${o||st("editor.solar_chart.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!o}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${st("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:V}

        <div class="section">
          <label class="field-label">${st("editor.solar_chart.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${e=>this._onToggle("compact",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${st("editor.solar_chart.toggle_compact_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${st("editor.solar_chart.toggle_compact_desc",this.hass)}</span
              >
            </span>
          </label>
        </div>
        ${Xn(this.hass)}
      </div>
    `}_renderEntryPicker(e){return this._entriesError?H`<div class="error">
        ${st("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?H`
        <div class="error">
          ${st("editor.common.no_entries",this.hass)}
          <code>${st("editor.common.no_entries_path",this.hass)}</code>${st("editor.common.no_entries_then",this.hass)}
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
    `:H`<div class="hint">${st("editor.common.loading_entries",this.hass)}</div>`}};mr.styles=a`
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
  `,e([ge({attribute:!1})],mr.prototype,"hass",void 0),e([me()],mr.prototype,"_config",void 0),e([me()],mr.prototype,"_entries",void 0),e([me()],mr.prototype,"_entriesError",void 0),mr=e([pe(Ee)],mr);let vr=class extends de{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._listMemo=ko(),this._discoveredResult={list:[],missing:[]}}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-solar-chart-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-solar-chart-card: every `entry_ids` entry must be a non-empty string");if(this._config={...e,entry_ids:[...e.entry_ids]},e.tooltips&&bo(e.tooltips),null===this._registry){const e=this._config.entry_ids.map(e=>Lo.get(e)?.entries);e.every(e=>void 0!==e)&&(this._registry=e.flat())}}getCardSize(){return 2}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(Ee)}static async getStubConfig(e){let t=[];try{const o=await Ro(e);o[0]&&(t=[o[0].entry_id])}catch{}return{type:`custom:${Ce}`,entry_ids:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Io();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=[];for(const e of this._discoveredResult.list)t.push(...Object.values(e.entities));return 0===t.length||ve(e.get("hass"),this.hass,t)}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discoveredResult=this._listMemo(this.hass,this._config.entry_ids,this._registry,this._config.type))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zo(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Po(this.hass,e).then(e=>{if(e!==this._registry&&(this._registry=e,this._registryError=null,this._config))for(const t of this._config.entry_ids)Lo.set(t,Go(e,t))}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return V;if(null===this._registry)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?st("tile.registry_failed",this.hass,{error:this._registryError}):st("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const{list:e,missing:t}=this._discoveredResult;if(0===e.length)return H`<ha-card>
        <div class="empty">
          <p><strong>${st("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${st("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const o=this._config;return H`
      <ha-card>
        ${o.title?H`<div class="card-header">${o.title}</div>`:V}
        <acp-elevation-chart
          .hass=${this.hass}
          .discoveredList=${e}
          .coverColors=${o.cover_colors??[]}
          ?compact=${!!o.compact}
        ></acp-elevation-chart>
        ${t.length>0?H`<div class="warn dim">
              ${st("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:V}
      </ha-card>
    `}};vr.styles=a`
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
  `,e([ge({attribute:!1})],vr.prototype,"hass",void 0),e([me()],vr.prototype,"_config",void 0),e([me()],vr.prototype,"_registry",void 0),e([me()],vr.prototype,"_registryError",void 0),vr=e([pe(Ce)],vr),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===Ce)||window.customCards.push({type:Ce,name:"Adaptive Cover Pro — Solar Chart",description:"Standalone solar elevation-vs-time chart; overlay one or more entries’ field-of-view windows.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:Fo(`custom:${Ce}`,"entry_ids")});const fr={hours:24,advanced_open:!1,hide_advanced:!1,track_position:!0,track_who_won:!0,track_context:!0,track_actions:!0},br={track_position:"position",track_who_won:"who_won",track_context:"context",track_actions:"actions"},yr={entry_id:"editor.common.entry_id",title:"editor.history.title",hours:"editor.history.hours_label",advanced_open:"editor.history.advanced_open_label",hide_advanced:"editor.history.hide_advanced_label",track_position:"editor.history.track_position_label",track_who_won:"editor.history.track_who_won_label",track_context:"editor.history.track_context_label",track_actions:"editor.history.track_actions_label"},wr={hours:"editor.history.hours_desc",advanced_open:"editor.history.advanced_open_desc",hide_advanced:"editor.history.hide_advanced_desc",track_position:"editor.history.track_position_desc",track_who_won:"editor.history.track_who_won_desc",track_context:"editor.history.track_context_desc",track_actions:"editor.history.track_actions_desc"};let xr=class extends de{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._entriesFetchInFlight=!1,this._computeLabel=e=>{const t=yr[e.name];return t?st(t,this.hass):e.name},this._computeHelper=e=>{const t=wr[e.name];return t?st(t,this.hass):void 0},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value},o={};for(const[e,i]of Object.entries(br))!1===t[e]&&(o[i]=!1),delete t[e];for(const[e,o]of Object.entries(fr))e in br||this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==o||delete t[e];const i={...this._config??{type:"",entry_id:""},...t};Object.keys(o).length>0?i.tracks=o:delete i.tracks,this._emit(i)}}setConfig(e){this._config={...e}}updated(e){e.has("hass")&&this.hass&&this._ensureEntries()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Ro(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this._config)return V;if(this._entriesError&&!this._entries)return H`
        <div class="form">
          <div class="error">
            ${st("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${st("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${st("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          ${Xn(this.hass)}
        </div>
      `;const e=this._config,t={...fr,...e,track_position:!1!==e.tracks?.position,track_who_won:!1!==e.tracks?.who_won,track_context:!1!==e.tracks?.context,track_actions:!1!==e.tracks?.actions};return H`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${t}
          .schema=${this._schema()}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${Xn(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[],t=Xe.map(e=>({value:e,label:st("history.window_hours",this.hass,{hours:e})}));return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"title",selector:{text:{}}},{name:"hours",selector:{select:{options:t,mode:"dropdown"}}},{name:"track_position",selector:{boolean:{}}},{name:"track_who_won",selector:{boolean:{}}},{name:"track_context",selector:{boolean:{}}},{name:"track_actions",selector:{boolean:{}}},{name:"advanced_open",selector:{boolean:{}}},{name:"hide_advanced",selector:{boolean:{}}}]}};xr.styles=a`
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
  `,e([ge({attribute:!1})],xr.prototype,"hass",void 0),e([me()],xr.prototype,"_config",void 0),e([me()],xr.prototype,"_entries",void 0),e([me()],xr.prototype,"_entriesError",void 0),xr=e([pe(Me)],xr);let $r=class extends de{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._memo=$o(),this._discovered=null}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${ze}: \`entry_id\` is required and must be a non-empty string`);if(void 0!==e.hours&&("number"!=typeof e.hours||e.hours<=0))throw new Error(`${ze}: \`hours\` must be a positive number`);if(this._config={...e},e.tooltips&&bo(e.tooltips),null===this._registry){const t=Lo.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getStubConfig(e){let t="";try{const o=await Ro(e);t=o[0]?.entry_id??""}catch{}return{type:`custom:${ze}`,entry_id:t,hours:24}}static async getConfigElement(){return document.createElement(Me)}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Io();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zo(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Po(this.hass,e).then(e=>{t===this._fetchGen&&e!==this._registry&&(this._registry=e,this._registryError=null,this._config&&Lo.set(this._config.entry_id,Go(e,this._config.entry_id)))}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return V;if(null===this._registry)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?st("tile.registry_failed",this.hass,{error:this._registryError}):st("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=this._discovered;if(!e)return H`<ha-card>
        <div class="empty">
          <p class="dim">
            ${st("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`;const t=this._config;return H`
      <ha-card>
        <div class="card-header">${t.title??st("history.title",this.hass)}</div>
        <acp-history-view
          .hass=${this.hass}
          .discovered=${e}
          .hours=${t.hours??24}
          .tracks=${t.tracks}
          .advancedOpen=${!!t.advanced_open}
          .hideAdvanced=${!!t.hide_advanced}
        ></acp-history-view>
      </ha-card>
    `}};$r.styles=a`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 14px 12px;
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
  `,e([ge({attribute:!1})],$r.prototype,"hass",void 0),e([me()],$r.prototype,"_config",void 0),e([me()],$r.prototype,"_registry",void 0),e([me()],$r.prototype,"_registryError",void 0),$r=e([pe(ze)],$r),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ze)||window.customCards.push({type:ze,name:"Adaptive Cover Pro — History",description:"Recorded position, winning handler, sun/glare/override context and cover actions for one Adaptive Cover Pro instance, plus the diagnostic event buffer.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:Fo(`custom:${ze}`,"entry_id")});const kr=["sky","elevation","decision","covers","overrides","climate"];let Ar=class extends de{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._dialogOpen=!1,this._discoveredList=[],this._discoveredListSource=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=$o(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3,this._openDialog=()=>{this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1},this._onHeaderInfoKeydown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openDialog())}}setConfig(e){if(!e?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...e},e.tooltips&&bo(e.tooltips),null===this._registry){const t=Lo.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(ye)}static async getStubConfig(e){let t="";try{const o=await Ro(e);t=o[0]?.entry_id??""}catch{}return{type:`custom:${be}`,entry_id:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Io();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||(!!this._discovered.is_group||ve(e.get("hass"),this.hass,Object.values(this._discovered.entities))))}willUpdate(e){null!==this._registry&&this._config&&this.hass&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry)),this._discovered!==this._discoveredListSource&&(this._discoveredListSource=this._discovered,this._discoveredList=this._discovered?[this._discovered]:[])}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=zo(this.hass,e=>{const t=new Set(Go(this._registry??[],this._config?.entry_id??"").map(e=>e.entity_id));(function(e,t){return"create"===e.action||t.has(e.entity_id)})(e,t)&&this._scheduleRefetch()}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Po(this.hass,e).then(e=>{if(e===this._registry)return;const t=this._config?.entry_id;if(t){const o=Go(e,t);(null===this._registry||function(e,t){if(e.length!==t.length)return!0;const o=new Map(e.map(e=>[e.entity_id,Ko(e)]));for(const e of t)if(o.get(e.entity_id)!==Ko(e))return!0;return!1}(Go(this._registry,t),o))&&(this._registry=e,o.length&&Lo.set(t,o))}else this._registry=e;this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const e=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=e);const t=e-this._debounceFirstAt,o=this._DEBOUNCE_MAX-t,i=Math.min(this._DEBOUNCE_DELAY,o);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),i<=0)return this._debounceFirstAt=null,void this._fetchRegistry(!0);this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry(!0)},i)}get _sections(){return this._config?.show_sections??kr}_renderHeader(e,t){const o=e.managed_covers?.[0],i=o?this.hass.states[o]:void 0,s=ut({explicitIcon:i?.attributes?.icon,deviceClass:i?.attributes?.device_class,coverType:e.cover_type,position:Vt(this.hass,e,o)}),n=!1!==this._config.state_color?vt(i?.state):null,r=e.entities.integration_enabled_switch,a=e.entities.automatic_control_switch,l=!r||"on"===this.hass.states[r]?.state,c=!a||"on"===this.hass.states[a]?.state;return H`
      <div class="header">
        <div
          class="header-info"
          role="button"
          tabindex="0"
          @click=${this._openDialog}
          @keydown=${this._onHeaderInfoKeydown}
        >
          <ha-icon .icon=${s} style=${n?`color: ${n}`:""}></ha-icon>
          <span class="title">${e.entry_title}</span>
        </div>
        <span class="spacer"></span>
        ${r?H`<acp-header-pill
              .on=${l}
              .readonly=${!t.integration_enabled}
              .label=${st(l?"header.on":"header.off",this.hass)}
              title=${st("header.integration_enabled",this.hass)}
              @pill-click=${()=>this._toggle(r)}
            ></acp-header-pill>`:V}
        ${a?H`<acp-header-pill
              .on=${c}
              .readonly=${!t.automatic_control}
              .label=${st("header.auto",this.hass)}
              title=${st("header.automatic_control",this.hass)}
              @pill-click=${()=>this._toggle(a)}
            ></acp-header-pill>`:V}
      </div>
    `}_toggle(e){const t=e.split(".")[0];this.hass.callService(t,"toggle",{entity_id:e})}_renderLoading(){return H`
      <ha-card>
        <div class="empty">
          <p class="dim">${st("root.loading_registry",this.hass)}</p>
        </div>
      </ha-card>
    `}_renderEmpty(e){const t=this._config.entry_id,o=this._registry?.length??0,i=this._registry?.filter(e=>e.config_entry_id===t&&"adaptive_cover_pro"===e.platform).length;return H`
      <ha-card>
        <div class="empty">
          <p><strong>${st("root.no_entities_title",this.hass)}</strong></p>
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
    `}render(){if(!this._config||!this.hass)return V;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const e=this._discovered;if(!e)return this._renderEmpty("no matching entities after unique_id lookup");const t=(o=this._config,{...He,...o?.controls});var o;if(e.is_group)return H`
        <ha-card>
          ${this._renderHeader(e,t)}
          <div class="body ${this._config.compact?"compact":""}">
            <acp-group-view
              .hass=${this.hass}
              .discovered=${e}
              .memberNames=${this._config.member_names}
              ?compact=${!!this._config.compact}
            ></acp-group-view>
          </div>
        </ha-card>
      `;const i=this._sections;return H`
      <ha-card>
        ${this._renderHeader(e,t)}
        <div class="body ${this._config.compact?"compact":""}">
          ${i.includes("sky")?H`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .coverColors=${this._config.cover_colors??[]}
                .northOffsetDeg=${It(this._config.north_offset??0)}
              ></acp-sky-compass>`:V}
          ${i.includes("elevation")?H`<acp-elevation-chart
                .hass=${this.hass}
                .discoveredList=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .coverColors=${this._config.cover_colors??[]}
              ></acp-elevation-chart>`:V}
          ${i.includes("decision")?H`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                .showSummary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:V}
          ${i.includes("covers")?H`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .coverColor=${this._config.cover_colors?.[0]??null}
                @acp-open-more-info=${this._openDialog}
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
          ${i.includes("solar")?H`<acp-solar-calc
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-solar-calc>`:V}
        </div>
      </ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${e}
        .open=${this._dialogOpen}
        .stateColor=${!1!==this._config.state_color}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `}};Ar.styles=a`
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
    .header-info {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      border-radius: 6px;
    }
    .header-info:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
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
  `,e([ge({attribute:!1})],Ar.prototype,"hass",void 0),e([me()],Ar.prototype,"_config",void 0),e([me()],Ar.prototype,"_registry",void 0),e([me()],Ar.prototype,"_registryError",void 0),e([me()],Ar.prototype,"_discovered",void 0),e([me()],Ar.prototype,"_dialogOpen",void 0),Ar=e([pe(be)],Ar),window.customCards=window.customCards||[],window.customCards.push({type:be,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:Fo(`custom:${be}`,"entry_id")}),console.info(`%c adaptive-cover-pro-card %c v${fe} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{Ar as AdaptiveCoverProCard};
