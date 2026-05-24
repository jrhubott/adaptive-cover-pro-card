/*! adaptive-cover-pro-card v2.0.0-beta.2 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function t(t,e,i,s){var o,r=arguments.length,n=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,i,n):o(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,_=g.trustedTypes,m=_?_.emptyScript:"",v=g.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const r=o.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const r=this.constructor;if(!1===s&&(o=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??b)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,v?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=t=>t,C=x.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+E,z=`<${O}>`,T=document,P=()=>T.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,I=Array.isArray,N="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,U=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,W=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),B=W(1),V=W(2),q=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Y=new WeakMap,Z=T.createTreeWalker(T,129);function X(t,e){if(!I(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=F;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===F?"!--"===l[1]?n=R:void 0!==l[1]?n=D:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=U):void 0!==l[3]&&(n=U):n===U?">"===l[0]?(n=o??F,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?U:'"'===l[3]?L:H):n===L||n===H?n=U:n===R||n===D?n=F:(n=U,o=void 0);const h=n===U&&t[e+1].startsWith("/>")?" ":"";r+=n===F?i+z:c>=0?(s.push(a),i.slice(0,c)+A+i.slice(c)+E+h):i+E+(-2===c?e:h)}return[X(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=K.createElement(l,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=c[r++],i=s.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?st:"?"===n[1]?ot:"@"===n[1]?rt:it}),s.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(j.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),Z.nextNode(),a.push({type:2,index:++o});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===O)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=M(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);Z.currentNode=s;let o=Z.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(o=Z.nextNode(),r++)}return Z.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),M(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>I(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new K(t)),e}k(t){I(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new et(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=Q(this,t,e,0),r=!M(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const s=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Q(this,s[i+n],e,n),a===q&&(a=this._$AH[n]),r||=!M(a)||a!==this._$AH[n],a===G?t=G:t!==G&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!s&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class ot extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class rt extends it{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??G)===q)return;const i=this._$AH,s=t===G&&i!==G||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=x.litHtmlPolyfillSupport;at?.(K,et),(x.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;let ct=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new et(e.insertBefore(P(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ut=(t=pt,e,i)=>{const{kind:s,metadata:o}=i;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function gt(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function _t(t){return gt({...t,state:!0,attribute:!1})}const mt="2.0.0-beta.2",vt="adaptive-cover-pro-card",ft="adaptive-cover-pro-card-editor",yt="adaptive-cover-pro-sky-compass-card",bt="adaptive-cover-pro-sky-compass-card-editor",$t="adaptive-cover-pro-tile-card",wt="adaptive-cover-pro-tile-card-editor",xt="adaptive_cover_pro",kt=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default"],Ct={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},St={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},At={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open"},Et={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds"},Ot={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion"},zt={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Sun tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Motion",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"}},Tt={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Pt={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"};function Mt(t,e,i){const s=e.entry_id;if(!s)return null;const o={},r=`${s}_`;let n,a=!1;for(const t of i){if(t.config_entry_id!==s)continue;if(t.platform!==xt)continue;if(a=!0,!n&&t.device_id&&(n=t.device_id),!t.unique_id.startsWith(r))continue;const e=t.unique_id.slice(r.length),i=t.entity_id.split(".")[0],l=Pt[`${i}:${e}`];l&&(o[l]=t.entity_id)}if(!a||0===Object.keys(o).length)return null;const l=t;let c=s;if(l.devices)for(const t of Object.values(l.devices))if(t.config_entries?.includes(s)){c=t.name_by_user??t.name??s;break}const d=[],h=o.target_position_sensor;if(h){const e=t.states[h]?.attributes?.actual_positions;e&&d.push(...Object.keys(e))}let p="cover_blind";const u=o.control_status_sensor;if(u){const e=t.states[u]?.attributes;e?.cover_type&&(p=e.cover_type)}return{entry_id:s,entry_title:c,cover_type:p,entities:o,managed_covers:d,device_id:n}}function It(t,e,i=0){const s=(t-90+i)*Math.PI/180;return{x:e*Math.cos(s),y:e*Math.sin(s)}}function Nt(t){return 1-Math.max(0,Math.min(90,t))/90}function Ft(t,e,i,s=0,o=0){const r=t=>(t%360+360)%360,n=r(t),a=r(e);let l=a-n;l<0&&(l+=360);const c=l>180?1:0,d=It(n,i,o),h=It(a,i,o);if(s<=0)return`M 0 0 L ${d.x} ${d.y} A ${i} ${i} 0 ${c} 1 ${h.x} ${h.y} Z`;const p=It(a,s,o),u=It(n,s,o);return[`M ${d.x} ${d.y}`,`A ${i} ${i} 0 ${c} 1 ${h.x} ${h.y}`,`L ${p.x} ${p.y}`,`A ${s} ${s} 0 ${c} 0 ${u.x} ${u.y}`,"Z"].join(" ")}function Rt(t,e,i=0){return It(t,Nt(e),i)}function Dt(t){return(t%360+360)%360}async function Ut(t){return t.callWS({type:"config/entity_registry/list"})}function Ht(t,e){let i=null,s=!1;return t.connection.subscribeEvents(t=>e(t.data),"entity_registry_updated").then(t=>{s?t():i=t}).catch(()=>{}),()=>{s=!0,i&&i()}}function Lt(t){return`acp-card:registry:v1:${t}`}const jt={get(t){try{const e=localStorage.getItem(Lt(t));if(!e)return null;const i=JSON.parse(e);return 1!==i.schemaVersion?null:i}catch{return null}},set(t,e){try{const i={schemaVersion:1,cardVersion:mt,fetchedAt:Date.now(),entries:e};localStorage.setItem(Lt(t),JSON.stringify(i))}catch{}},invalidate(t){try{localStorage.removeItem(Lt(t))}catch{}},clear(){try{const t="acp-card:registry:v1:",e=[];for(let i=0;i<localStorage.length;i++){const s=localStorage.key(i);s?.startsWith(t)&&e.push(s)}e.forEach(t=>localStorage.removeItem(t))}catch{}}};function Wt(t){return`${t.entity_id}|${t.unique_id}|${t.platform}|${t.config_entry_id??""}`}function Bt(t,e,i){return t.filter(t=>t.config_entry_id===e&&void 0===i)}let Vt=class extends ct{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return B`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":G}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};Vt.styles=n`
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
  `,t([gt({type:Boolean})],Vt.prototype,"on",void 0),t([gt({type:Boolean})],Vt.prototype,"readonly",void 0),t([gt({type:String})],Vt.prototype,"label",void 0),t([gt({type:String})],Vt.prototype,"title",void 0),Vt=t([ht("acp-header-pill")],Vt);class qt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Gt=(Yt=class extends qt{constructor(t){if(super(t),1!==t.type||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return q}},(...t)=>({_$litDirective$:Yt,values:t}));var Yt;function Zt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Xt,Jt,Kt={exports:{}},Qt=(Xt||(Xt=1,Jt=Kt,function(){var t=Math.PI,e=Math.sin,i=Math.cos,s=Math.tan,o=Math.asin,r=Math.atan2,n=Math.acos,a=t/180,l=864e5,c=2440588,d=2451545;function h(t){return new Date((t+.5-c)*l)}function p(t){return function(t){return t.valueOf()/l-.5+c}(t)-d}var u=23.4397*a;function g(t,o){return r(e(t)*i(u)-s(o)*e(u),i(t))}function _(t,s){return o(e(s)*i(u)+i(s)*e(u)*e(t))}function m(t,o,n){return r(e(t),i(t)*e(o)-s(n)*i(o))}function v(t,s,r){return o(e(s)*e(r)+i(s)*i(r)*i(t))}function f(t,e){return a*(280.16+360.9856235*t)-e}function y(t){return a*(357.5291+.98560028*t)}function b(i){return i+a*(1.9148*e(i)+.02*e(2*i)+3e-4*e(3*i))+102.9372*a+t}function $(t){var e=b(y(t));return{dec:_(e,0),ra:g(e,0)}}var w={getPosition:function(t,e,i){var s=a*-i,o=a*e,r=p(t),n=$(r),l=f(r,s)-n.ra;return{azimuth:m(l,o,n.dec),altitude:v(l,o,n.dec)}}},x=w.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];w.addTime=function(t,e,i){x.push([t,e,i])};var k=9e-4;function C(e,i,s){return k+(e+i)/(2*t)+s}function S(t,i,s){return d+t+.0053*e(i)-.0069*e(2*s)}function A(t,s,o,r,a,l,c){var d=function(t,s,o){return n((e(t)-e(s)*e(o))/(i(s)*i(o)))}(t,o,r);return S(C(d,s,a),l,c)}function E(t){var s=a*(134.963+13.064993*t),o=a*(93.272+13.22935*t),r=a*(218.316+13.176396*t)+6.289*a*e(s),n=5.128*a*e(o),l=385001-20905*i(s);return{ra:g(r,n),dec:_(r,n),dist:l}}function O(t,e){return new Date(t.valueOf()+e*l/24)}w.getTimes=function(e,i,s,o){var r,n,l,c,d,u=a*-s,g=a*i,m=function(t){return-2.076*Math.sqrt(t)/60}(o=o||0),v=function(e,i){return Math.round(e-k-i/(2*t))}(p(e),u),f=C(0,u,v),$=y(f),w=b($),E=_(w,0),O=S(f,$,w),z={solarNoon:h(O),nadir:h(O-.5)};for(r=0,n=x.length;r<n;r+=1)d=O-((c=A(((l=x[r])[0]+m)*a,u,g,E,v,$,w))-O),z[l[1]]=h(d),z[l[2]]=h(c);return z},w.getMoonPosition=function(t,o,n){var l=a*-n,c=a*o,d=p(t),h=E(d),u=f(d,l)-h.ra,g=v(u,c,h.dec),_=r(e(u),s(c)*i(h.dec)-e(h.dec)*i(u));return g+=function(t){return t<0&&(t=0),2967e-7/Math.tan(t+.00312536/(t+.08901179))}(g),{azimuth:m(u,c,h.dec),altitude:g,distance:h.dist,parallacticAngle:_}},w.getMoonIllumination=function(t){var s=p(t||new Date),o=$(s),a=E(s),l=149598e3,c=n(e(o.dec)*e(a.dec)+i(o.dec)*i(a.dec)*i(o.ra-a.ra)),d=r(l*e(c),a.dist-l*i(c)),h=r(i(o.dec)*e(o.ra-a.ra),e(o.dec)*i(a.dec)-i(o.dec)*e(a.dec)*i(o.ra-a.ra));return{fraction:(1+i(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},w.getMoonTimes=function(t,e,i,s){var o=new Date(t);s?o.setUTCHours(0,0,0,0):o.setHours(0,0,0,0);for(var r,n,l,c,d,h,p,u,g,_,m,v,f,y=.133*a,b=w.getMoonPosition(o,e,i).altitude-y,$=1;$<=24&&(r=w.getMoonPosition(O(o,$),e,i).altitude-y,u=((d=(b+(n=w.getMoonPosition(O(o,$+1),e,i).altitude-y))/2-r)*(p=-(h=(n-b)/2)/(2*d))+h)*p+r,_=0,(g=h*h-4*d*r)>=0&&(m=p-(f=Math.sqrt(g)/(2*Math.abs(d))),v=p+f,Math.abs(m)<=1&&_++,Math.abs(v)<=1&&_++,m<-1&&(m=v)),1===_?b<0?l=$+m:c=$+m:2===_&&(l=$+(u<0?v:m),c=$+(u<0?m:v)),!l||!c);$+=2)b=n;var x={};return l&&(x.rise=O(o,l)),c&&(x.set=O(o,c)),l||c||(x[u>0?"alwaysUp":"alwaysDown"]=!0),x},Jt.exports=w}()),Kt.exports),te=Zt(Qt);function ee(t,e,i,s=10){const o=[],r=i.getTime()+864e5;for(let n=i.getTime();n<=r;n+=60*s*1e3){const i=new Date(n),s=te.getPosition(i,t,e);o.push({t:i,elevation:180*s.altitude/Math.PI,azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360})}return o}function ie(t=new Date){const e=new Date(t);return e.setHours(0,0,0,0),e}function se(t,e,i,s){const o=((e-i)%360+360)%360;return((t-o)%360+360)%360<=((((e+s)%360+360)%360-o)%360+360)%360}function oe(t,e,i=new Date){const s=te.getMoonPosition(i,t,e),o=te.getMoonIllumination(i);return{azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360,elevation:180*s.altitude/Math.PI,phase:o.phase,fraction:o.fraction,phaseName:re(o.phase)}}function re(t){return t<.0625||t>=.9375?"New Moon":t<.1875?"Waxing Crescent":t<.3125?"First Quarter":t<.4375?"Waxing Gibbous":t<.5625?"Full Moon":t<.6875?"Waning Gibbous":t<.8125?"Last Quarter":"Waning Crescent"}function ne(t){return null==t||Number.isNaN(t)?"—":`${Math.round(t)}%`}function ae(t){return null==t||Number.isNaN(t)?"—":`${t.toFixed(1)}°`}function le(t){if(!t)return"—";const e=new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function ce(t){if(!t)return"—";const e=new Date(t).getTime();if(Number.isNaN(e))return"—";const i=Math.round((e-Date.now())/1e3);return i<=0?"expired":function(t){if(null==t||Number.isNaN(t))return"—";const e=Math.max(0,Math.round(t));if(e<60)return`${e}s`;const i=Math.floor(e/60);return i<60?`${i}m ${e%60}s`:`${Math.floor(i/60)}h ${i%60}m`}(i)}const de=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function he(t){const e=de.length;return de[(t%e+e)%e]}const pe=110;let ue=class extends ct{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set}_toggleEntry(t){const e=new Set(this._hiddenEntries);e.has(t)?e.delete(t):e.add(t),this._hiddenEntries=e}_sunFor(t){const e=t.entities.sun_sensor;if(!e)return null;const i=this.hass.states[e];if(!i)return null;const s=parseFloat(i.state);return Number.isNaN(s)?null:{...i.attributes,window_azimuth:i.attributes.window_azimuth}}_coverPositionFor(t){const e=t.entities.target_position_sensor;if(!e)return null;const i=parseFloat(this.hass.states[e]?.state??"");return Number.isNaN(i)?null:i}_sunInfrontFor(t){const e=t.entities.sun_infront_binary;return!!e&&"on"===this.hass.states[e]?.state}_readActiveAzimuth(t){if(!t)return null;const e=this.hass.states[t];if(!e)return null;if("unavailable"===e.state||"unknown"===e.state)return null;const i=e.attributes.azimuth;return"number"==typeof i&&Number.isFinite(i)?i:null}_buildOverlays(){const t=[];return this.discovered_list.forEach((e,i)=>{const s=this._sunFor(e);if(!s)return;const o=e.entities.sun_sensor,r=parseFloat(this.hass.states[o]?.state??"0"),{color:n,isOverride:a}=(l=this.coverColors?.[i],c=i,"string"==typeof l&&l.length>0?{color:l,isOverride:!0}:{color:he(c),isOverride:!1});var l,c;t.push({d:e,sun:s,sunAzi:r,sunInfront:this._sunInfrontFor(e),coverPos:this._coverPositionFor(e),coverType:e.cover_type,color:n,isOverride:a,index:i})}),t}render(){if(!this.hass)return G;if(!this.discovered_list||0===this.discovered_list.length)return B`<div class="placeholder">No Adaptive Cover Pro entries selected.</div>`;const t=this._buildOverlays();if(0===t.length)return B`<div class="placeholder">Sun sensor not yet populated.</div>`;const e=t.filter(t=>!this._hiddenEntries.has(t.d.entry_id)),i=Dt(this.northOffsetDeg),s=t.length>1,o=t[0],r=o.sunAzi,n=o.sun.elevation,a=Rt(r,n,i),l=t.some(t=>t.sun.in_fov),c=t.some(t=>t.sunInfront),d=n<=0,h=!d&&c?"sun valid":!d&&l?"sun in-fov":"sun",{latitude:p,longitude:u}=this.hass.config,g=void 0!==p&&void 0!==u?ee(p,u,ie()):[],_=this.showMoon&&void 0!==p&&void 0!==u?oe(p,u):null,m=null!==_&&_.elevation>0,v=_?_.phase<.5?-24*_.phase:24*(1-_.phase):0,f=m?Rt(_.azimuth,_.elevation,i):null,y=f?f.x*pe:0,b=f?f.y*pe:0,$=this.showSunPath?g.filter(t=>t.elevation>0).map(t=>{const e=Rt(t.azimuth,t.elevation,i);return`${(e.x*pe).toFixed(1)},${(e.y*pe).toFixed(1)}`}).join(" "):"",{riseAzimuth:w,setAzimuth:x}=this.showSunriseSunset?function(t){let e=-1,i=-1;for(let s=0;s<t.length;s++)t[s].elevation>0&&(-1===e&&(e=s),i=s);return{riseAzimuth:e>=0?t[e].azimuth:null,setAzimuth:i>=0?t[i].azimuth:null}}(g):{riseAzimuth:null,setAzimuth:null},k=null!==w?It(w,pe,i):null,C=null!==x?It(x,pe,i):null,S=It(0,124,i),A=It(90,124,i),E=It(180,124,i),O=It(270,124,i),z=It(0,pe,i),T=It(180,pe,i),P=It(90,pe,i),M=It(270,pe,i),I=`Sun: ${ae(r)} az / ${ae(n)} el`,N=null!==w?`Sunrise: ${ae(w)}`:"",F=null!==x?`Sunset: ${ae(x)}`:"",R=null!==_?`Moon: ${_.phaseName} (${Math.round(100*_.fraction)}%)`:"";return B`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${V`
            <defs>
              ${m?V`
                <mask id="moon-phase-mask">
                  <circle cx=${y} cy=${b} r=${6} fill="white"></circle>
                  <circle cx=${y+v} cy=${b} r=${6} fill="black"></circle>
                </mask>
              `:G}
            </defs>

            <circle class="grid" r=${pe}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${pe/3}></circle>
            <line class="grid thin" x1=${z.x} y1=${z.y} x2=${T.x} y2=${T.y}></line>
            <line class="grid thin" x1=${P.x} y1=${P.y} x2=${M.x} y2=${M.y}></line>

            ${e.map(t=>this._renderEntryLayers(t,s,i))}

            ${this.showSunPath&&$?V`<g data-tooltip="Sun path (today)"><title>Sun path (today)</title><polyline class="sun-path" points=${$}></polyline></g>`:G}

            ${this.showSunriseSunset&&k&&null!==w?V`<g data-tooltip=${N}><title>${N}</title><circle class="rise-marker" cx=${k.x} cy=${k.y} r="4"></circle></g>`:G}
            ${this.showSunriseSunset&&C&&null!==x?V`<g data-tooltip=${F}><title>${F}</title><circle class="set-marker" cx=${C.x} cy=${C.y} r="4"></circle></g>`:G}

            ${this.showCardinals?V`
              <text class="cardinal" x=${S.x} y=${S.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${A.x} y=${A.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${O.x} y=${O.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:G}

            ${m?V`
              <g data-tooltip=${R}>
                <title>${R}</title>
                <circle class="moon-outline" cx=${y} cy=${b} r=${6}></circle>
                <circle class="moon-lit" cx=${y} cy=${b} r=${6} mask="url(#moon-phase-mask)"></circle>
              </g>
            `:G}

            <g data-tooltip=${I}>
              <title>${I}</title>
              <circle class=${h} cx=${a.x*pe} cy=${a.y*pe} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(t,s):G}
        ${this.showStats?this._renderStats(t,s):G}
      </div>
    `}_renderEntryLayers(t,e,i=0){const s=Dt(t.sun.window_azimuth),o=Dt(s-t.sun.fov_left),r=Dt(s+t.sun.fov_right),n=this._readActiveAzimuth(t.d.entities.start_sensor),a=this._readActiveAzimuth(t.d.entities.end_sensor),l=null!==n&&null!==a,c=l?Dt(n):o,d=l?Dt(a):r,h=It(s,pe,i),{outer:p,inner:u}=(g=t.sun.min_elevation,_=t.sun.max_elevation,m=pe,void 0!==g&&void 0!==_&&g>_?{outer:m,inner:0}:{outer:void 0!==g?m*Nt(g):m,inner:void 0!==_?m*Nt(_):0});var g,_,m;const v="cover_awning"===t.coverType?t.coverPos/100:1-t.coverPos/100,f=null!==t.coverPos?pe*v:null,y=null!==f?Math.min(f,p):null,b=t.sun.blind_spot_range?[Dt(($=s)-(w=t.sun.blind_spot_range)[1]),Dt($-w[0])]:null;var $,w;const x=b?Ft(b[0],b[1],pe,0,i):null,k=Ft(c,d,p,u,i),C=null!==y&&y>u?Ft(c,d,y,u,i):"",S=e?`${t.d.entry_title}: `:"",A=void 0!==t.sun.min_elevation||void 0!==t.sun.max_elevation?` · elev ${ae(t.sun.min_elevation??0)}–${ae(t.sun.max_elevation??90)}`:"",E=l?`${S}Active sun arc ${ae(c)} – ${ae(d)}${A}`:`${S}FOV ${ae(t.sun.fov_left)} left / ${ae(t.sun.fov_right)} right${A}`,O=`${S}Window normal: ${ae(s)}`,z=null!==t.coverPos?"cover_awning"===t.coverType?`${S}Cover extended: ${t.coverPos}%`:`${S}Cover closed: ${t.coverPos}%`:"",T=b?`${S}Blind spot: ${ae(b[0])} – ${ae(b[1])}`:"",P=e||t.isOverride,M=P?`fill: ${t.color}; stroke: ${t.color};`:"",I=P?`fill: ${t.color}; stroke: ${t.color};`:"",N=P?`fill: ${t.color}; stroke: ${t.color};`:"",F=P?`stroke: ${t.color};`:"",R=P?`fill: ${t.color};`:"",D=this.showCoverFill&&""!==C,U=this.showBlindSpot&&!!x,H=this.showWindowArrow,L=`M 0 0 L ${h.x} ${h.y}`,j="display: none;";return V`<g class="entry-overlay">
      <g data-tooltip=${E}>
        <title>${E}</title>
        <path class="fov" style=${M} d=${k}></path>
      </g>
      <g class="arrow-group" data-tooltip=${O} style=${H?"":j}>
        <title>${O}</title>
        <path class="window" style=${F} d=${L}></path>
        <circle class="window-base" style=${R} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" data-tooltip=${z} style=${D?"":j}>
        <title>${z}</title>
        <path class="cover-fill" style=${I} d=${C}></path>
      </g>
      <g class="blind-group" data-tooltip=${T} style=${U?"":j}>
        <title>${T}</title>
        <path class="blind-spot" style=${N} d=${x??""}></path>
      </g>
    </g>`}_renderLegend(t,e){return e?B`
        <div class="legend">
          ${t.map(t=>B`
              <button
                type="button"
                class=${Gt({"entry-toggle":!0,hidden:this._hiddenEntries.has(t.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(t.d.entry_id)}
                @click=${()=>this._toggleEntry(t.d.entry_id)}
              >
                <span class="swatch entry" style="background: ${t.color}"></span>
                ${t.d.entry_title}
                ${t.sunInfront?B`<span class="status valid">✓ in FOV</span>`:t.sun.in_fov?B`<span class="status in-fov">in FOV</span>`:B`<span class="status">—</span>`}
              </button>
            `)}
          <div><span class="dot sun valid"></span> Sun</div>
          ${this.showMoon?B`<div><span class="dot moon-dot"></span> Moon</div>`:G}
        </div>
      `:B`<div class="legend">
      <div><span class="dot sun valid"></span> Sun (hitting window)</div>
      <div><span class="dot sun in-fov"></span> Sun (in FOV, not valid)</div>
      <div><span class="dot sun"></span> Sun (outside FOV)</div>
      ${this.showMoon?B`<div><span class="dot moon-dot"></span> Moon</div>`:G}
      <div><span class="swatch fov"></span> Window FOV</div>
      ${this.showSunPath?B`<div><span class="swatch sun-path-swatch"></span> Sun path</div>`:G}
      ${this.showSunriseSunset?B`<div><span class="dot rise-dot"></span> Sunrise</div>
            <div><span class="dot set-dot"></span> Sunset</div>`:G}
      ${this.showCoverFill?B`<div><span class="swatch cover-fill-swatch"></span> Cover closed</div>`:G}
      ${this.showWindowArrow?B`<div><span class="swatch window-swatch"></span> Window normal</div>`:G}
    </div>`}_renderStats(t,e){const i=t[0],s=i.sunAzi,o=i.sun.elevation,{latitude:r,longitude:n}=this.hass.config,a=this.showMoon&&void 0!==r&&void 0!==n?oe(r,n):null;return e?B`
        <div class="stats dim">
          <div class="stats-row">
            <span>Sun: ${ae(s)} / ${ae(o)}</span>
            ${this.showMoon&&a?B`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:G}
          </div>
          ${t.map(t=>B`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${t.color}"></span>
                <span class="entry-name">${t.d.entry_title}</span>
                <span>∠${ae(t.sun.gamma)}</span>
                <span>W ${ae(Dt(t.sun.window_azimuth))}</span>
                ${t.sun.in_fov?B`<span class="status in-fov">✓</span>`:G}
              </div>
            `)}
        </div>
      `:B`<div class="stats dim">
      <span>Azi: ${ae(s)}</span>
      <span>Elev: ${ae(o)}</span>
      <span>∠: ${ae(i.sun.gamma)}</span>
      <span>Window: ${ae(Dt(i.sun.window_azimuth))}</span>
      ${this.showMoon&&a?B`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:G}
    </div>`}};ue.styles=n`
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
  `,t([gt({attribute:!1})],ue.prototype,"hass",void 0),t([gt({attribute:!1})],ue.prototype,"discovered_list",void 0),t([gt({type:Boolean,reflect:!0})],ue.prototype,"compact",void 0),t([gt({attribute:!1})],ue.prototype,"showStats",void 0),t([gt({attribute:!1})],ue.prototype,"showLegend",void 0),t([gt({attribute:!1})],ue.prototype,"showMoon",void 0),t([gt({attribute:!1})],ue.prototype,"showCardinals",void 0),t([gt({attribute:!1})],ue.prototype,"showBlindSpot",void 0),t([gt({attribute:!1})],ue.prototype,"showSunPath",void 0),t([gt({attribute:!1})],ue.prototype,"showSunriseSunset",void 0),t([gt({attribute:!1})],ue.prototype,"showCoverFill",void 0),t([gt({attribute:!1})],ue.prototype,"showWindowArrow",void 0),t([gt({attribute:!1})],ue.prototype,"coverColors",void 0),t([gt({attribute:!1})],ue.prototype,"northOffsetDeg",void 0),t([_t()],ue.prototype,"_hiddenEntries",void 0),ue=t([ht("acp-sky-compass")],ue);let ge=class extends ct{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];return e?e.attributes:null}render(){if(!this.hass||!this.discovered)return G;const t=this._sunAttrs(),{latitude:e,longitude:i}=this.hass.config;if(void 0===e||void 0===i||!t)return B`<div class="placeholder">Sun elevation chart unavailable.</div>`;const s=ie(),o=ee(e,i,s),r=new Date,n=function(t,e,i,s){let o=-1,r=-1,n=-1;for(let a=0;a<t.length;a++){const l=t[a];l.elevation>0&&se(l.azimuth,e,i,s)?(-1===n&&(n=a),a-n>r-o&&(o=n,r=a)):n=-1}return-1===o?null:{startIdx:o,endIdx:r}}(o,t.window_azimuth,t.fov_left,t.fov_right),a=t=>32+(t.getTime()-s.getTime())/864e5*360,l=t=>138-(t- -10)/100*128,c=o.map(t=>`${a(t.t).toFixed(1)},${l(t.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(r),p=this._interpAt(o,r),u=p?l(p.elevation):null,g=n?o[n.startIdx].t:null,_=n?o[n.endIdx].t:null,m=g?a(g):null,v=_?a(_):null;return B`
      <div class="wrap">
        <div class="head">
          <span class="label">Sun today</span>
          ${g&&_?B`<span class="dim"
                >FOV: ${le(g.toISOString())} →
                ${le(_.toISOString())}</span
              >`:B`<span class="dim">Sun does not enter FOV today</span>`}
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${V`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(t=>V`
              <line class="grid" x1=${32} y1=${l(t)} x2=${392} y2=${l(t)} />
              <text class="tick" x=${28} y=${l(t)+3} text-anchor="end">${t}°</text>
            `)}

            <!-- x-axis gridlines at every 6h -->
            ${[0,6,12,18,24].map(t=>{const e=new Date(s.getTime()+36e5*t);return V`
                <line class="grid faint" x1=${a(e)} y1=${10} x2=${a(e)} y2=${138} />
                <text class="tick" x=${a(e)} y=${152} text-anchor="middle">${t.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${d} x2=${392} y2=${d} />

            <!-- FOV shaded band (only the time the sun is actually in FOV + above horizon) -->
            ${null!==m&&null!==v?V`<rect
                  class="fov-band"
                  x=${m}
                  y=${10}
                  width=${v-m}
                  height=${128}
                />`:G}

            <!-- elevation curve -->
            <polyline class="curve" points=${c} />

            <!-- current-time cursor -->
            <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />

            <!-- current sun dot -->
            ${null!==u?V`<circle class="sun-dot" cx=${h} cy=${u} r="4" />`:G}
          `}
        </svg>
      </div>
    `}_interpAt(t,e){if(0===t.length)return null;const i=e.getTime();if(i<=t[0].t.getTime())return t[0];if(i>=t[t.length-1].t.getTime())return t[t.length-1];for(let s=1;s<t.length;s++)if(t[s].t.getTime()>=i){const o=t[s-1],r=t[s],n=(i-o.t.getTime())/(r.t.getTime()-o.t.getTime());return{t:e,elevation:o.elevation+(r.elevation-o.elevation)*n,azimuth:o.azimuth+(r.azimuth-o.azimuth)*n}}return t[t.length-1]}};function _e(t){const e=t.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(e))return"custom_position";switch(e){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return e}}function me(t,e,i,s=Ct){const o=new Map;for(const e of t){if(!e.matched)continue;const t=_e(e.handler);kt.includes(t)&&o.set(t,e)}const r=[...kt].reverse().filter(t=>o.has(t));return 0===r.length?e.reason??"":r.map(t=>function(t,e,i,s){const o=s[t]??t,r=e.position,n=null==r?"":` ${ne(r)}`;if("custom_position"!==t)return`${o}${n}`.trimEnd();return`${i.custom_position_active_slot_name?`${o} · ${i.custom_position_active_slot_name}`:i.custom_position_active_slot?`${o} #${i.custom_position_active_slot}`:o}${n}${!0===i.custom_position_minimum_mode?" floor":""}`}(t,o.get(t),e,s)).join(" → ")}ge.styles=n`
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
  `,t([gt({attribute:!1})],ge.prototype,"hass",void 0),t([gt({attribute:!1})],ge.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],ge.prototype,"compact",void 0),ge=t([ht("acp-elevation-chart")],ge);let ve=class extends ct{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this.hideInactive=!1}_trace(){const t=this.discovered.entities.decision_trace_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=e.attributes;if(!i?.trace)return null;const s=new Map;for(const t of i.trace)s.set(_e(t.handler),{matched:t.matched,reason:t.reason,position:t.position});return{winner:e.state,reason:i.reason??"",steps:s,enabledHandlers:i.enabled_handlers,summary:me(i.trace,i,e.state)}}render(){if(!this.hass||!this.discovered)return G;const t=this._trace();if(!t)return B`<div class="placeholder">Decision trace not yet populated.</div>`;const e=function(t){if(!t)return new Set;const e=new Set(t);return new Set(kt.filter(t=>!e.has(t)))}(t.enabledHandlers),i=function(t,e,i,s,o=new Set){return t.filter(t=>t===i||!o.has(t)&&(!s||!0===e.get(t)?.matched))}(kt,t.steps,t.winner,this.hideInactive,e);return B`
      <div class="wrap">
        <div class="head">
          <span class="label">Pipeline</span>
          <span class="winner">Winner: ${t.winner}</span>
        </div>
        ${this.showSummary&&t.summary?B`<div class="summary" title="Why this position?">${t.summary}</div>`:G}
        <div class="rows">${i.map(e=>this._row(e,t.steps.get(e),t.winner===e))}</div>
        <div class="reason dim">${t.reason}</div>
      </div>
    `}_row(t,e,i){const s=e?.matched??!1,o=e?.reason??"not evaluated",r=e?.position;return B`
      <div class="row ${i?"winner":s?"match":"skip"}">
        <span class="name">${Ct[t]}</span>
        <span class="dots" aria-hidden="true">${s?"████":"────"}</span>
        <span class="pos">${null!=r?ne(r):""}</span>
        <span class="reason-inline dim">${o}</span>
        ${i?B`<span class="badge">✓</span>`:G}
      </div>
    `}};var fe,ye;ve.styles=n`
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
  `,t([gt({attribute:!1})],ve.prototype,"hass",void 0),t([gt({attribute:!1})],ve.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],ve.prototype,"compact",void 0),t([gt({type:Boolean,reflect:!0,attribute:"show-summary"})],ve.prototype,"showSummary",void 0),t([gt({type:Boolean,reflect:!0,attribute:"hide-inactive"})],ve.prototype,"hideInactive",void 0),ve=t([ht("acp-decision-strip")],ve),function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(fe||(fe={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(ye||(ye={}));const be=["closed","locked","off"],$e=(t,e,i,s)=>{s=s||{},i=null==i?{}:i;const o=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,t.dispatchEvent(o),o},we=t=>{$e(window,"haptic",t)};function xe(t){return void 0!==t&&"none"!==t.action}let ke=class extends ct{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0}render(){const t=this._kind(),e=zt[t],i=this._label(t,e.label);return B`<span
      class="badge kind-${t}"
      style="background:${e.bg};color:${e.fg};"
      part="badge"
      >${i}</span
    >`}_kind(){if(!1===this.integrationEnabled)return"off";const t=_e(this.winner);return Ot[t]??"auto"}_label(t,e){return"manual"===t?this.manualEndIso?le(this.manualEndIso):e:"custom_position"===t?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${e} #${this.slotNumber}`:e}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?" floor":""}`:e}};ke.styles=n`
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
  `,t([gt()],ke.prototype,"winner",void 0),t([gt({attribute:"manual-end-iso"})],ke.prototype,"manualEndIso",void 0),t([gt({type:Number,attribute:"slot-number"})],ke.prototype,"slotNumber",void 0),t([gt({attribute:"slot-name"})],ke.prototype,"slotName",void 0),t([gt({type:Number})],ke.prototype,"pct",void 0),t([gt({type:Boolean,attribute:"minimum-mode"})],ke.prototype,"minimumMode",void 0),t([gt({type:Boolean,reflect:!0})],ke.prototype,"compact",void 0),t([gt({type:Boolean,attribute:"integration-enabled"})],ke.prototype,"integrationEnabled",void 0),ke=t([ht("acp-tile-badge")],ke);let Ce=class extends ct{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualEndIso(){const t=this.discovered.entities.manual_override_end_sensor;if(!t)return null;const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:null}_motionStatus(){const t=this.discovered.entities.motion_status_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=e.attributes.motion_timeout_end_time;return{state:e.state,endIso:i??null}}_forceActive(){const t=this.discovered.entities.force_override_sensor;if(!t)return 0;const e=this.hass.states[t];return e&&parseInt(e.state,10)||0}_resetManual(){const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}render(){if(!this.hass||!this.discovered)return G;const t=this._manualActive(),e=this._manualEndIso(),i=this._motionStatus(),s=this._forceActive(),o=this.discovered.entities.reset_override_button;return B`
      <div class="wrap">
        <div class="label dim">Overrides</div>
        <div class="grid">
          <div class="tile ${t?"active":""}">
            <div class="tile-label">Manual</div>
            <div class="tile-value">${t?"Active":"Off"}</div>
            ${e?B`<div class="tile-sub dim">ends in ${ce(e)}</div>`:G}
          </div>

          <div class="tile ${s>0?"active warning":""}">
            <div class="tile-label">Force</div>
            <div class="tile-value">${s>0?`${s} active`:"Off"}</div>
          </div>

          ${i?B`<div class="tile ${"motion_detected"===i.state?"active":""}">
                <div class="tile-label">Motion</div>
                <div class="tile-value">${i.state.replace(/_/g," ")}</div>
                ${i.endIso?B`<div class="tile-sub dim">timeout ${ce(i.endIso)}</div>`:G}
              </div>`:G}
          ${o?this.resetEnabled?B`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">Reset Manual</div>
                </button>`:B`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">Reset Manual</div>
                </button>`:G}
        </div>
      </div>
    `}};Ce.styles=n`
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
  `,t([gt({attribute:!1})],Ce.prototype,"hass",void 0),t([gt({attribute:!1})],Ce.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ce.prototype,"compact",void 0),t([gt({type:Boolean,attribute:"reset-enabled"})],Ce.prototype,"resetEnabled",void 0),Ce=t([ht("acp-overrides-panel")],Ce);const Se={"Summer Mode":"mdi:weather-sunny","Winter Mode":"mdi:snowflake",Intermediate:"mdi:weather-partly-cloudy"};let Ae=class extends ct{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return G;const t=this.discovered.entities.climate_status_sensor;if(!t)return G;const e=this.hass.states[t];if(!e||"unavailable"===e.state)return G;const i=e.state,s=e.attributes??{},o=Se[i]??"mdi:thermostat",r=s.temperature_unit??"°",n=[void 0!==s.indoor_temperature?{label:"Indoor",value:s.indoor_temperature,unit:r}:null,void 0!==s.outdoor_temperature?{label:"Outdoor",value:s.outdoor_temperature,unit:r}:null].filter(t=>null!==t),a=[{label:"Presence",value:s.is_presence,icon:"mdi:account-check"},{label:"Sunny",value:s.is_sunny,icon:"mdi:white-balance-sunny"},{label:"Lux",value:s.lux_active,icon:"mdi:brightness-7"},{label:"Irradiance",value:s.irradiance_active,icon:"mdi:solar-power"}].filter(t=>void 0!==t.value);return B`
      <div class="wrap">
        <div class="head">
          <span class="label">Climate</span>
          <span class="dim"
            >Active:
            ${void 0!==s.active_temperature?`${s.active_temperature.toFixed(1)}${r}`:"—"}</span
          >
        </div>
        <div class="strategy">
          <ha-icon icon=${o}></ha-icon>
          <span class="strategy-name">${i}</span>
        </div>
        ${n.length?B`
              <div class="temps">
                ${n.map(t=>B`
                    <div class="temp">
                      <span class="temp-label dim">${t.label}</span>
                      <span class="temp-value">${t.value.toFixed(1)}${t.unit}</span>
                    </div>
                  `)}
              </div>
            `:G}
        ${a.length?B`
              <div class="conditions">
                ${a.map(t=>B`
                    <div class="chip ${t.value?"on":"off"}" title=${t.label}>
                      <ha-icon icon=${t.icon}></ha-icon>
                      <span>${t.label}</span>
                    </div>
                  `)}
              </div>
            `:G}
      </div>
    `}};Ae.styles=n`
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
  `,t([gt({attribute:!1})],Ae.prototype,"hass",void 0),t([gt({attribute:!1})],Ae.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ae.prototype,"compact",void 0),Ae=t([ht("acp-climate-panel")],Ae);let Ee=class extends ct{constructor(){super(...arguments),this.compact=!1}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return{target:null,covers:{}};const e=this.hass.states[t];if(!e)return{target:null,covers:{}};const i=parseFloat(e.state),s=e.attributes;return{target:Number.isNaN(i)?null:i,covers:s?.actual_positions??{}}}_mismatched(){const t=this.discovered.entities.position_mismatch_binary;if(!t)return new Set;const e=this.hass.states[t];if("on"!==e?.state)return new Set;const i=e.attributes.entities;return i?new Set(Object.entries(i).filter(([,t])=>t.mismatch).map(([t])=>t)):new Set}_setPosition(t,e){this.hass.callService("cover","set_cover_position",{entity_id:t,position:e})}render(){if(!this.hass||!this.discovered)return G;const{target:t,covers:e}=this._target(),i=this._mismatched(),s=Object.entries(e);return 0===s.length?B`<div class="placeholder">No covers reported by the integration.</div>`:B`
      <div class="wrap">
        <div class="head">
          <span class="label">Covers</span>
          <span class="target">Target: ${ne(t)}</span>
        </div>
        ${s.map(([e,s])=>this._bar(e,s,t,i.has(e)))}
      </div>
    `}_bar(t,e,i,s){const o=this.hass.states[t]?.attributes?.friendly_name??t,r=i??0;return B`
      <div class="cover ${s?"mismatch":""}">
        <div class="name" title=${t}>${o}</div>
        <div
          class="track"
          @click=${e=>this._handleTrackClick(e,t)}
          title="Click to set position"
        >
          <div class="fill" style="width:${e??0}%"></div>
          ${null!==i?B`<div
                class="marker"
                style="left:${r}%"
                title="Target ${r}%"
              ></div>`:G}
        </div>
        <div class="num">${ne(e)}</div>
        ${s?B`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:G}
      </div>
    `}_handleTrackClick(t,e){const i=t.currentTarget.getBoundingClientRect(),s=Math.round((t.clientX-i.left)/i.width*100),o=Math.max(0,Math.min(100,s));this._setPosition(e,o)}};var Oe;Ee.styles=n`
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
  `,t([gt({attribute:!1})],Ee.prototype,"hass",void 0),t([gt({attribute:!1})],Ee.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ee.prototype,"compact",void 0),Ee=t([ht("acp-cover-bar")],Ee);let ze=Oe=class extends ct{constructor(){super(...arguments),this.samples=[],this.events=[],this._hoverIdx=null,this._onPointerMove=t=>{const e=t.currentTarget.getBoundingClientRect();if(e.width<=0)return;const i=(t.clientX-e.left)/e.width,s=Math.max(0,Math.min(1,i))*Oe.VIEW_W;this._hoverIdx=this._nearestSampleIdx(s)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){if(!this.samples||0===this.samples.length)return G;const t=this._timeRange();if(!t)return G;const{start:e,end:i}=t,s=i-e;if(s<=0)return G;const{VIEW_W:o,VIEW_H:r,TOP_PAD:n,EVENT_HIT_W:a}=Oe,l=r-n,c=this.samples.map(t=>{const i=Date.parse(t.t);return{t:i,x:(i-e)/s*o,y:n+(1-Te(t.position)/100)*l,sample:t}}),d=c.map(t=>`${t.x.toFixed(1)},${t.y.toFixed(1)}`).join(" "),h=(this.events??[]).map(t=>{const l=Date.parse(t.t);if(Number.isNaN(l)||l<e||l>i)return null;const c=(l-e)/s*o,d=`evt-${t.kind}`,h=function(t){const e=Pe[t.kind]??t.label??t.kind,i=le(t.t);return"—"===i?e:`${e} — ${i}`}(t);return V`<g class="event-group" data-tooltip=${h}>
          <title>${h}</title>
          <line
            class="event-hit"
            x1=${c.toFixed(1)}
            x2=${c.toFixed(1)}
            y1=${n}
            y2=${r}
            stroke-width=${a}
          ></line>
          <line
            class="event-marker ${d}"
            x1=${c.toFixed(1)}
            x2=${c.toFixed(1)}
            y1=${n}
            y2=${r}
          ></line>
        </g>`}).filter(t=>null!==t),p=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<c.length?c[this._hoverIdx]:null,u=p?V`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${p.x.toFixed(1)} x2=${p.x.toFixed(1)}
            y1=${n} y2=${r}></line>
          <circle class="hover-dot" cx=${p.x.toFixed(1)} cy=${p.y.toFixed(1)} r="3"></circle>
        </g>`:G,g=p?B`<div class="hover-label" style=${`left: ${(p.x/o*100).toFixed(2)}%`}>
          ${function(t){const e=le(t.t),i=`${Math.round(Te(t.position))}%`;return t.handler?`${e} · ${i} · ${t.handler}`:`${e} · ${i}`}(p.sample)}
        </div>`:G,_=le(this.samples[0].t),m=le(this.samples[this.samples.length-1].t);return B`
      <div class="wrap">
        <svg
          viewBox="0 0 ${o} ${r}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <title>
            Hover the curve for time + forecast position; hover a colored line for the event it
            marks.
          </title>
          <line class="baseline" x1="0" y1=${r-.5} x2=${o} y2=${r-.5}></line>
          <polyline class="curve" points=${d} fill="none"></polyline>
          <text class="axis-label" x="4" y=${n+8} text-anchor="start">100%</text>
          <text class="axis-label" x="4" y=${r-3} text-anchor="start">${_}</text>
          <text class="axis-label" x=${o-4} y=${r-3} text-anchor="end">
            ${m}
          </text>
          ${h} ${u}
        </svg>
        ${g}
      </div>
    `}_timeRange(){let t=Number.POSITIVE_INFINITY,e=Number.NEGATIVE_INFINITY;for(const i of this.samples){const s=Date.parse(i.t);Number.isNaN(s)||(s<t&&(t=s),s>e&&(e=s))}return t===Number.POSITIVE_INFINITY?null:{start:t,end:e}}_nearestSampleIdx(t){const e=this._timeRange();if(!e)return null;const i=e.end-e.start;if(i<=0)return null;let s=-1,o=Number.POSITIVE_INFINITY;for(let r=0;r<this.samples.length;r++){const n=Date.parse(this.samples[r].t);if(Number.isNaN(n))continue;const a=(n-e.start)/i*Oe.VIEW_W,l=Math.abs(a-t);l<o&&(o=l,s=r)}return s>=0?s:null}};function Te(t){return Number.isNaN(t)||t<0?0:t>100?100:t}ze.VIEW_W=600,ze.VIEW_H=80,ze.TOP_PAD=10,ze.EVENT_HIT_W=12,ze.styles=n`
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
  `,t([gt({attribute:!1})],ze.prototype,"samples",void 0),t([gt({attribute:!1})],ze.prototype,"events",void 0),t([_t()],ze.prototype,"_hoverIdx",void 0),ze=Oe=t([ht("acp-forecast-strip")],ze);const Pe={sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window field of view",fov_exit:"Sun leaves window field of view"};let Me=class extends ct{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this._onResume=()=>{const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const t=this.discovered.device_id;t&&this._navigate(`/config/devices/device/${t}`)},this._openIntegrationPage=()=>{this._navigate(`/config/integrations/integration/${xt}`)},this._onBackdrop=t=>{t.target===t.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=t=>{t.stopPropagation()}}render(){if(!this.open||!this.hass||!this.discovered)return G;const t=this._winner(),e=this._traceAttrs(),i=this._matchedHandlers(e),s=e?me(e.trace??[],e):"",o=this._target(),r=this._shouldShowResume(t),n=this._switchOn("integration_enabled_switch"),a=this._switchOn("automatic_control_switch");return B`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${St[this.discovered.cover_type]??"mdi:window-shutter"}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${n?a?i.map(t=>B`<acp-tile-badge
                          .winner=${t}
                          .slotNumber=${"custom_position"===t?e?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===t?e?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===t?o??void 0:void 0}
                          .minimumMode=${"custom_position"===t?e?.custom_position_minimum_mode:void 0}
                        ></acp-tile-badge>`):G:B`<acp-tile-badge .integrationEnabled=${!1}></acp-tile-badge>`}
            </div>
            <button
              class="icon-btn options-link"
              type="button"
              aria-label="Configure integration"
              title="Configure integration"
              @click=${this._openIntegrationPage}
            >
              <ha-icon icon="mdi:tune-variant"></ha-icon>
            </button>
            ${this.discovered.device_id?B`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label="Open device page"
                  title="Open device page"
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:cog"></ha-icon>
                </button>`:G}
            <button class="close" type="button" aria-label="Close" @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${s?B`<div class="summary">${s}</div>`:G}

          <div class="position-block">
            <div class="position-label">Target</div>
            <div class="position-value">${ne(o)}</div>
            ${this._mismatchActive()?B`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:G}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${r?B`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>Resume Auto</button>
              </div>`:G}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?"▼ Hide advanced":"▶ Advanced"}
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
                    </div>`:G}
                ${this._renderSlots(e?.custom_position_slots)}
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
              </div>`:G}
        </div>
      </div>
    `}_winner(){const t=this.discovered.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(){const t=this.discovered.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_matchedHandlers(t){if(!t?.trace)return[];const e=new Set;for(const i of t.trace){if(!i.matched)continue;const t=_e(i.handler);kt.includes(t)&&e.add(t)}return kt.filter(t=>e.has(t))}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=parseFloat(e.state);return Number.isNaN(i)?null:i}_mismatchActive(){const t=this.discovered.entities.position_mismatch_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualOverrideOn(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(t){const e=this.discovered.entities[t];return!e||"off"!==this.hass.states[e]?.state}_shouldShowResume(t){return!(!this.discovered.entities.reset_override_button||!this._manualOverrideOn()&&"custom_position"!==_e(t))}_renderSlots(t){if(!t)return G;const e=t.filter(t=>null!==t.sensor);return 0===e.length?G:B`<div class="slots-section">
      <div class="slots-label">Custom positions</div>
      ${e.map(t=>this._renderSlotRow(t))}
    </div>`}_renderSlotRow(t){const e=t.sensor_name??`#${t.slot}`;return B`<div class="slot-row" data-slot=${t.slot}>
      <span class="slot-label">${e}</span>
      <span class="slot-position">${ne(t.position)}</span>
      ${!0===t.min_mode?B`<span class="slot-min-mode" title="Floor — slot raises position above raw calc">
            floor
          </span>`:G}
      <button
        class="slot-toggle ${t.enabled?"on":"off"}"
        type="button"
        aria-label=${t.enabled?`Disable slot ${t.slot}`:`Enable slot ${t.slot}`}
        @click=${()=>this._toggleSlot(t)}
      >
        ${t.enabled?"On":"Off"}
      </button>
    </div>`}_renderControls(){const t=[{role:"automatic_control_switch",label:"Automatic"},{role:"climate_mode_switch",label:"Climate"},{role:"motion_control_switch",label:"Motion"}].filter(t=>!!this.discovered.entities[t.role]);return 0===t.length?G:B`<div class="controls-block">
      <div class="controls-label">Controls</div>
      <div class="controls-row">${t.map(t=>this._renderSwitchChip(t.role,t.label))}</div>
    </div>`}_renderSwitchChip(t,e){const i=this.discovered.entities[t],s="on"===this.hass.states[i]?.state;return B`<button
      class="ctrl-toggle ${s?"on":"off"}"
      type="button"
      aria-pressed=${s}
      aria-label=${`${e} ${s?"on":"off"} — tap to toggle`}
      @click=${()=>this._toggleSwitch(i,s)}
    >
      <span class="ctrl-label">${e}</span>
      <span class="ctrl-state">${s?"On":"Off"}</span>
    </button>`}_toggleSwitch(t,e){this.hass.callService("switch",e?"turn_off":"turn_on",{entity_id:t})}_renderForecastStrip(){const t=this.discovered.entities.position_forecast_sensor;if(!t)return G;const e=this.hass.states[t]?.attributes,i=e?.forecast??[],s=e?.events??[];return 0===i.length?G:B`<div class="forecast-block">
      <div class="forecast-label">Today's forecast</div>
      <acp-forecast-strip
        .samples=${i}
        .events=${s}
        .now=${Date.now()}
      ></acp-forecast-strip>
    </div>`}_toggleSlot(t){const e=this.discovered.managed_covers[0];e&&this.hass.callService(xt,"set_custom_position",{entity_id:e,slot:t.slot,enabled:!t.enabled})}_navigate(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};async function Ie(t){return(await t.callWS({type:"config_entries/get",domain:xt})).filter(t=>t.domain===xt).map(t=>({entry_id:t.entry_id,title:t.title}))}Me.styles=n`
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
  `,t([gt({attribute:!1})],Me.prototype,"hass",void 0),t([gt({attribute:!1})],Me.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Me.prototype,"open",void 0),t([gt({type:Boolean})],Me.prototype,"advancedOpen",void 0),t([gt({type:Boolean})],Me.prototype,"showCompass",void 0),Me=t([ht("acp-more-info-dialog")],Me);const Ne=[{value:"auto",label:"Auto (manual override or custom position)"},{value:"always",label:"Always (when reset button is available)"},{value:"never",label:"Never"}],Fe=[{value:"one-line",label:"One line (compact)"},{value:"detailed",label:"Detailed (title, state, indicators)"}],Re={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_compass:!0,show_motion_icon:!0,show_resume:"auto",layout:"one-line"},De={entry_id:"Adaptive Cover Pro instance",name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",show_compass:"Show sun compass in dialog",show_motion_icon:"Show motion indicator",show_resume:"Resume button",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action"};let Ue=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=t=>De[t.name]??t.name,this._valueChanged=t=>{t.stopPropagation();const e={...t.detail.value};for(const[t,i]of Object.entries(Re))this._config&&Object.prototype.hasOwnProperty.call(this._config,t)||e[t]!==i||delete e[t];this._emit({...this._config??{type:"",entry_id:""},...e})}}setConfig(t){this._config={...t}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),t.has("_registry")&&null!==this._registry&&this._maybePrefillCover()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Ie(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id}),this._maybePrefillCover()}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,Ut(this.hass).then(t=>{this._registry=t,this._maybePrefillCover()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=Ht(this.hass,()=>{this._registryFetchInFlight=!0,Ut(this.hass).then(t=>{this._registry=t}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_maybePrefillCover(){if(!this._config?.entry_id||this._config?.cover||!this._registry||!this.hass)return;const t=Mt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=t?.managed_covers??[],1===t?.managed_covers.length&&this._emit({...this._config,cover:t.managed_covers[0]})}render(){if(!this._config)return G;if(this._entriesError&&!this._entries)return B`
        <div class="form">
          <div class="error">Failed to load config entries: ${this._entriesError}</div>
          <label class="field-label" for="entry-id-fallback">Entry ID</label>
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder="Enter config entry ID manually"
            @change=${t=>this._emit({...this._config??{type:"",entry_id:""},entry_id:t.target.value})}
          />
        </div>
      `;const t=this._schema(),e={...Re,...this._config};return B`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${t}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._managedCovers.length>1&&!this._config?.cover?B`<div class="hint">
            ${"Leave blank to use the first managed cover automatically."}
          </div>`:G}
    `}_schema(){const t=this._entries?.map(t=>({value:t.entry_id,label:t.title}))??[];let e={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const t=Mt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);t&&t.managed_covers.length>0&&(e={entity:{domain:"cover",include_entities:t.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:t,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:e},{name:"layout",selector:{select:{mode:"list",options:Fe}}},{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{name:"show_motion_icon",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"show_resume",selector:{select:{mode:"list",options:Ne}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};Ue.styles=n`
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
  `,t([gt({attribute:!1})],Ue.prototype,"hass",void 0),t([_t()],Ue.prototype,"_config",void 0),t([_t()],Ue.prototype,"_entries",void 0),t([_t()],Ue.prototype,"_entriesError",void 0),t([_t()],Ue.prototype,"_registry",void 0),t([_t()],Ue.prototype,"_managedCovers",void 0),Ue=t([ht(wt)],Ue);let He=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),xe(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return xe(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(t){if(!t||"string"!=typeof t.entry_id||0===t.entry_id.length)throw new Error(`${$t}: \`entry_id\` is required and must be a non-empty string`);let e={...t};"string"==typeof e.tap_action&&(e={...e,tap_action:"none"===e.tap_action?{action:"none"}:void 0}),this._config=e}getCardSize(){return 1}static getStubConfig(){return{type:`custom:${$t}`,entry_id:""}}static async getConfigElement(){return document.createElement(wt)}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ht(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Ut(this.hass).then(e=>{t===this._fetchGen&&(this._registry=e,this._registryError=null)}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return G;if(null===this._registry)return B`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?`Registry fetch failed: ${this._registryError}`:"Loading…"}
          </p>
        </div>
      </ha-card>`;const t=Mt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return t?B`
      <ha-card>${this._renderTile(t)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${t}
        .open=${this._dialogOpen}
        .showCompass=${!1!==this._config.show_compass}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `:B`<ha-card>
        <div class="empty">
          <p class="dim">
            Adaptive Cover Pro entry <code>${this._config.entry_id}</code> not found.
          </p>
        </div>
      </ha-card>`}_renderTile(t){const e=this._config,i=e.name??t.entry_title,s=this._resolvedCover(t),o=e.icon??function(t,e){if(null!==e&&!Number.isNaN(e)){if(e>=95)return At[t]??"mdi:window-shutter-open";if(e<=5)return Et[t]??"mdi:window-shutter"}return St[t]??"mdi:window-shutter"}(t.cover_type,this._liveCoverPosition(s)),r=!1!==e.show_position,n=!1!==e.show_state,a=!1!==e.show_controls,l=!1!==e.show_badge,c=!1!==e.show_motion_icon?this._motionActiveState(t):null,d="timeout_pending"===c?"Motion timeout pending":"Motion detected",h="detailed"===e.layout,p=this._currentPosition(t),u=this._winner(t),g=this._traceAttrs(t),_=this._manualEndIso(t),m=this._shouldShowResume(t,u),v=this._isFullyInert(e),f=!0===e.show_decision_summary&&g?me(g.trace??[],g):"",y=!!f&&h,b=this._switchOn(t,"integration_enabled_switch"),$=this._switchOn(t,"automatic_control_switch"),w=l&&!(!1===$&&!0===b),x=n?function(t,e){if(!t||!e)return null;const i=t.states[e];if(!i?.state||"unknown"===i.state||"unavailable"===i.state)return null;if("function"==typeof t.formatEntityState){const e=t.formatEntityState(i);if(e)return e}if("function"==typeof t.localize){const e=t.localize(`component.cover.entity_component._.state.${i.state}`);if(e)return e}return i.state.charAt(0).toUpperCase()+i.state.slice(1)}(this.hass,s):null,k=[x,r&&null!==p?ne(p):null].filter(t=>!!t);return B`
      <div
        class=${`tile-body${h?" detailed":""}${y?" has-summary":""}${x?" has-state-label":""}${h&&(w||m)?" has-row3":""}`}
        role=${v?"group":"button"}
        tabindex=${v?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
          <ha-icon class="cover-icon" icon=${o}></ha-icon>
          ${c?B`<ha-icon
                class="motion-overlay ${c}"
                icon="mdi:motion-sensor"
                title=${d}
              ></ha-icon>`:G}
        </div>
        <div class="label">
          <div class="title" title=${t.entry_title}>${i}</div>
          ${f&&!h?B`<div class="summary">${f}</div>`:G}
          ${y?B`<div class="summary inline-summary" title=${f}>${f}</div>`:G}
        </div>
        ${k.length>0?B`<div class="position">${k.join(" · ")}</div>`:G}
        ${a?B`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label="Open"
                ?disabled=${!s}
                @click=${()=>this._command(s,"open_cover")}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label="Stop"
                ?disabled=${!s}
                @click=${()=>this._command(s,"stop_cover")}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label="Close"
                ?disabled=${!s}
                @click=${()=>this._command(s,"close_cover")}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </div>`:G}
        ${w?B`<acp-tile-badge
              .winner=${u}
              .integrationEnabled=${b}
              .slotNumber=${g?.custom_position_active_slot}
              .slotName=${g?.custom_position_active_slot_name}
              .pct=${p??void 0}
              .minimumMode=${g?.custom_position_minimum_mode}
              .manualEndIso=${_}
            ></acp-tile-badge>`:G}
        ${m?B`<button
              class="resume"
              type="button"
              aria-label="Resume automatic control"
              @click=${e=>{e.stopPropagation(),this._resume(t)}}
              @pointerdown=${this._stop}
            >
              Resume
            </button>`:G}
      </div>
    `}_resolvedCover(t){return this._config?.cover?this._config.cover:t.managed_covers[0]}_currentPosition(t){const e=t.entities.target_position_sensor;if(!e)return null;const i=this.hass.states[e];if(!i)return null;const s=parseFloat(i.state);return Number.isNaN(s)?null:s}_liveCoverPosition(t){if(!t)return null;const e=this.hass.states[t]?.attributes?.current_position;return"number"!=typeof e||Number.isNaN(e)?null:e}_winner(t){const e=t.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(t){const e=t.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_motionActiveState(t){const e=t.entities.motion_status_sensor;if(!e)return null;const i=this.hass.states[e]?.state;return"motion_detected"===i||"timeout_pending"===i?i:null}_manualOverrideOn(t){const e=t.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(t,e){const i=t.entities[e];return!i||"off"!==this.hass.states[i]?.state}_manualEndIso(t){if(!this._manualOverrideOn(t))return;const e=t.entities.manual_override_end_sensor;return e?this.hass.states[e]?.state:void 0}_shouldShowResume(t,e){if(!t.entities.reset_override_button)return!1;const i=this._config?.show_resume??"auto";return"never"!==i&&("always"===i||!!this._manualOverrideOn(t)||"custom_position"===_e(e))}_command(t,e){t&&this.hass.callService("cover",e,{entity_id:t})}_resume(t){const e=t.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_tapActionConfig(){const t=this._config?.tap_action;if("string"!=typeof t)return t}_isFullyInert(t){return!!(t=>!!t&&"none"===t.action)(this._tapActionConfig())&&!xe(t.hold_action)&&!xe(t.double_tap_action)}_fireAction(t){if(!this._config||!this.hass)return;const e=this._tapActionConfig();if("tap"===t&&void 0===e)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const i=this._resolvedCoverFromState();((t,e,i,s)=>{let o;"double_tap"===s&&i.double_tap_action?o=i.double_tap_action:"hold"===s&&i.hold_action?o=i.hold_action:"tap"===s&&i.tap_action&&(o=i.tap_action),((t,e,i,s)=>{if(s||(s={action:"more-info"}),!s.confirmation||s.confirmation.exemptions&&s.confirmation.exemptions.some(t=>t.user===e.user.id)||(we("warning"),confirm(s.confirmation.text||`Are you sure you want to ${s.action}?`)))switch(s.action){case"more-info":(i.entity||i.camera_image)&&$e(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":s.navigation_path&&((t,e,i=!1)=>{i?history.replaceState(null,"",e):history.pushState(null,"",e),$e(window,"location-changed",{replace:i})})(0,s.navigation_path);break;case"url":s.url_path&&window.open(s.url_path);break;case"toggle":i.entity&&(((t,e)=>{((t,e,i=!0)=>{const s=function(t){return t.substr(0,t.indexOf("."))}(e),o="group"===s?"homeassistant":s;let r;switch(s){case"lock":r=i?"unlock":"lock";break;case"cover":r=i?"open_cover":"close_cover";break;default:r=i?"turn_on":"turn_off"}t.callService(o,r,{entity_id:e})})(t,e,be.includes(t.states[e].state))})(e,i.entity),we("success"));break;case"call-service":{if(!s.service)return void we("failure");const[t,i]=s.service.split(".",2);e.callService(t,i,s.service_data,s.target),we("success");break}case"fire-dom-event":$e(t,"ll-custom",s)}})(t,e,i,o)})(this,this.hass,{entity:i,tap_action:e,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},t)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const t=Mt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return t?.managed_covers[0]}_stop(t){t.stopPropagation()}};He.styles=n`
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
  `,t([gt({attribute:!1})],He.prototype,"hass",void 0),t([_t()],He.prototype,"_config",void 0),t([_t()],He.prototype,"_registry",void 0),t([_t()],He.prototype,"_registryError",void 0),t([_t()],He.prototype,"_dialogOpen",void 0),He=t([ht($t)],He),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===$t)||window.customCards.push({type:$t,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Le=[{key:"sky",label:"Sky compass",description:"Sun vs. window FOV, polar plot"},{key:"elevation",label:"Sun today",description:"Elevation-vs-time chart with FOV band and current-time cursor"},{key:"decision",label:"Decision strip",description:"All 10 pipeline handlers with the winning row highlighted"},{key:"covers",label:"Cover positions",description:"Per-cover live vs. target bars; click to set position"},{key:"overrides",label:"Overrides panel",description:"Manual, force, motion tiles + reset button"},{key:"climate",label:"Climate panel",description:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)"}],je=Le.map(t=>t.key);let We=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ie(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id})}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??je}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_onEntryChange(t){const e=t.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:e})}_onSectionToggle(t,e){const i=new Set(this._currentSections);e?i.add(t):i.delete(t);const s=Le.map(t=>t.key).filter(t=>i.has(t));this._emit({...this._config??{type:"",entry_id:""},show_sections:s})}_onCompactToggle(t){this._emit({...this._config??{type:"",entry_id:""},compact:t})}_onVersionToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_version:t})}_onCompassStatsToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:t})}_onCompassLegendToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:t})}_onMoonToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_moon:t})}_onHideInactiveToggle(t){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:t})}_onNorthOffsetChange(t){const e=parseFloat(t.target.value),i=Number.isFinite(e)?e:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:i})}_onControlToggle(t,e){const i=this._config??{type:"",entry_id:""};this._emit({...i,controls:{...i.controls,[t]:e}})}render(){if(!this._config)return G;const t=new Set(this._currentSections);return B`
      <div class="form">
        <div class="section">
          <label class="field-label">Adaptive Cover Pro instance</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">Sections</label>
          <div class="hint">Toggle which parts of the card are shown.</div>
          ${Le.map(e=>B`
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
          <label class="field-label">Controls</label>
          <div class="hint">Render as read-only (visible but not clickable).</div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.integration_enabled??!0}
              @change=${t=>this._onControlToggle("integration_enabled",t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Integration ON/OFF pill</span>
              <span class="toggle-desc">Allow toggling the integration from the card header.</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.automatic_control??!0}
              @change=${t=>this._onControlToggle("automatic_control",t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Automatic Control pill</span>
              <span class="toggle-desc"
                >Allow toggling automatic control from the card header.</span
              >
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.reset_manual_override??!0}
              @change=${t=>this._onControlToggle("reset_manual_override",t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Reset Manual Override button</span>
              <span class="toggle-desc">Allow pressing the reset tile in the overrides panel.</span>
            </span>
          </label>
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
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_compass_stats??!0}
              @change=${t=>this._onCompassStatsToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Show compass stats</span>
              <span class="toggle-desc">Azi, Elev, ∠, and Window angle below the sky compass.</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_compass_legend??!0}
              @change=${t=>this._onCompassLegendToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Show compass legend</span>
              <span class="toggle-desc">Color key below the sky compass.</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_moon??!1}
              @change=${t=>this._onMoonToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Show moon on compass</span>
              <span class="toggle-desc">Moon position and phase overlay on the sky compass.</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.hide_inactive_handlers??!1}
              @change=${t=>this._onHideInactiveToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Hide inactive handlers</span>
              <span class="toggle-desc"
                >Show only the winner and actively matched pipeline handlers.</span
              >
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_version??!1}
              @change=${t=>this._onVersionToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Show version tag</span>
              <span class="toggle-desc">Display card version at the bottom.</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">Compass north offset (°)</label>
          <div class="hint">Rotate the compass clockwise so "up" matches your map. Default: 0.</div>
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
        <div class="error">Failed to load config entries: ${this._entriesError}</div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder="Enter config entry ID manually"
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?B`
        <div class="error">
          No Adaptive Cover Pro config entries found. Add an instance under
          <code>Settings → Devices &amp; Services</code>, then come back.
        </div>
      `:B`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(t=>t.entry_id===this._config.entry_id)?B`<option value=${this._config.entry_id}>
              (unknown: ${this._config.entry_id})
            </option>`:G}
        ${this._entries.map(t=>B`
            <option value=${t.entry_id} ?selected=${t.entry_id===this._config?.entry_id}>
              ${t.title}
            </option>
          `)}
      </select>
    `:B`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};We.styles=n`
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
  `,t([gt({attribute:!1})],We.prototype,"hass",void 0),t([_t()],We.prototype,"_config",void 0),t([_t()],We.prototype,"_entries",void 0),t([_t()],We.prototype,"_entriesError",void 0),We=t([ht(ft)],We);const Be=[{key:"compact",label:"Compact mode",description:"Smaller SVG, legend hidden.",defaultOn:!1},{key:"show_legend",label:"Legend",description:"Color swatches + entry labels below compass.",defaultOn:!0},{key:"show_stats",label:"Stats",description:"Sun + per-window numeric rows.",defaultOn:!0},{key:"show_moon",label:"Moon",description:"Render moon position and phase.",defaultOn:!1},{key:"show_cardinals",label:"Cardinal labels",description:"N/E/S/W letters around the compass.",defaultOn:!0},{key:"show_blind_spot",label:"Blind spots",description:"Hatched wedges for each window’s blind range.",defaultOn:!0},{key:"show_sun_path",label:"Sun path",description:"Today’s sun arc across the sky.",defaultOn:!0},{key:"show_sunrise_sunset",label:"Sunrise / sunset markers",description:"Small dots at rise and set azimuths.",defaultOn:!0},{key:"show_cover_fill",label:"Cover closure fill",description:"Inner wedge showing how closed each cover is.",defaultOn:!0},{key:"show_window_arrow",label:"Window-normal arrow",description:"Line from center toward each window’s azimuth.",defaultOn:!0}];let Ve=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ie(this.hass).then(t=>{this._entries=t,this._entriesError=null}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${yt}`,entry_ids:[]}}_trimColors(t){let e=-1;for(let i=0;i<t.length;i++)t[i]&&(e=i);if(!(e<0))return t.slice(0,e+1)}_emitWithColors(t,e,i){const s=this._trimColors(e),{cover_colors:o,...r}=t,n=s?{...r,...i,cover_colors:s}:{...r,...i};this._emit(n)}_onCoverColorChange(t,e){const i=this._baseConfig(),s=[...i.cover_colors??[]];for(;s.length<=t;)s.push(null);s[t]=e,this._emitWithColors(i,s)}_onCoverColorReset(t){const e=this._baseConfig(),i=[...e.cover_colors??[]];t<i.length&&(i[t]=null),this._emitWithColors(e,i)}_onEntryToggle(t,e){const i=this._baseConfig(),s=new Set(i.entry_ids);e?s.add(t):s.delete(t);const o=(this._entries??[]).map(t=>t.entry_id).filter(t=>s.has(t)),r=i.cover_colors??[],n=o.map(t=>{const e=i.entry_ids.indexOf(t);return e>=0?r[e]??null:null});this._emitWithColors(i,n,{entry_ids:o})}_onToggle(t,e){this._emit({...this._baseConfig(),[t]:e})}_onNorthOffsetChange(t){const e=parseFloat(t.target.value),i=Number.isFinite(e)?e:0;this._emit({...this._baseConfig(),north_offset:i})}_onTitleChange(t){const e=t.target.value,i=this._baseConfig();if(e)this._emit({...i,title:e});else{const{title:t,...e}=i;this._emit(e)}}render(){if(!this._config)return G;const t=new Set(this._config.entry_ids);return B`
      <div class="form">
        <div class="section">
          <label class="field-label">Adaptive Cover Pro instances</label>
          <div class="hint">
            Pick one or more. Each selected entry adds an overlay to the compass.
          </div>
          ${this._renderEntryPicker(t)}
        </div>

        <div class="section">
          <label class="field-label">Title (optional)</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder="e.g. West-facing windows"
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?B`
              <div class="section">
                <label class="field-label">Cover colors</label>
                <div class="hint">Override the default palette color for each overlay.</div>
                ${this._config.entry_ids.map((t,e)=>{const i=this._config.cover_colors?.[e]??null,s=i??he(e),o=this._entries?.find(e=>e.entry_id===t);return B`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${s}
                        @change=${t=>this._onCoverColorChange(e,t.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${o?.title??t}</span>
                        <span class="toggle-desc">${i||"default"}</span>
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!i}
                        @click=${()=>this._onCoverColorReset(e)}
                      >
                        Reset
                      </button>
                    </div>
                  `})}
              </div>
            `:G}

        <div class="section">
          <label class="field-label">Display</label>
          ${Be.map(t=>B`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${this._config[t.key]??t.defaultOn}
                  @change=${e=>this._onToggle(t.key,e.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${t.label}</span>
                  <span class="toggle-desc">${t.description}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">Compass north offset (°)</label>
          <div class="hint">Rotate the compass clockwise so "up" matches your map. Default: 0.</div>
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
    `}_renderEntryPicker(t){return this._entriesError?B`<div class="error">Failed to load config entries: ${this._entriesError}</div>`:this._entries?0===this._entries.length?B`
        <div class="error">
          No Adaptive Cover Pro config entries found. Add an instance under
          <code>Settings → Devices &amp; Services</code>, then come back.
        </div>
      `:B`
      <div class="entry-list">
        ${this._entries.map(e=>B`
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${t.has(e.entry_id)}
                @change=${t=>this._onEntryToggle(e.entry_id,t.target.checked)}
              />
              <span class="toggle-text">
                <span class="toggle-label">${e.title}</span>
                <span class="toggle-desc">${e.entry_id}</span>
              </span>
            </label>
          `)}
      </div>
    `:B`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};Ve.styles=n`
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
  `,t([gt({attribute:!1})],Ve.prototype,"hass",void 0),t([_t()],Ve.prototype,"_config",void 0),t([_t()],Ve.prototype,"_entries",void 0),t([_t()],Ve.prototype,"_entriesError",void 0),Ve=t([ht(bt)],Ve);let qe=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(t){if(!t||!Array.isArray(t.entry_ids)||0===t.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(t.entry_ids.some(t=>"string"!=typeof t||0===t.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");this._config={...t,entry_ids:[...t.entry_ids]}}getCardSize(){return 4}static async getConfigElement(){return document.createElement(bt)}static getStubConfig(){return{type:`custom:${yt}`,entry_ids:[]}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ht(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Ut(this.hass).then(t=>{this._registry=t,this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return G;if(null===this._registry)return B`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?`Registry fetch failed: ${this._registryError}`:"Loading Adaptive Cover Pro registry…"}
          </p>
        </div>
      </ha-card>`;const t=[],e=[];for(const i of this._config.entry_ids){const s=Mt(this.hass,{type:this._config.type,entry_id:i},this._registry);s?t.push(s):e.push(i)}if(0===t.length)return B`<ha-card>
        <div class="empty">
          <p><strong>No matching Adaptive Cover Pro entities</strong></p>
          <p class="dim">Configured entries: ${this._config.entry_ids.join(", ")}</p>
        </div>
      </ha-card>`;const i=this._config;return B`
      <ha-card>
        ${i.title?B`<div class="card-header">${i.title}</div>`:G}
        <acp-sky-compass
          .hass=${this.hass}
          .discovered_list=${t}
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
          .northOffsetDeg=${Dt(i.north_offset??0)}
        ></acp-sky-compass>
        ${e.length>0?B`<div class="warn dim">Entries not found: ${e.join(", ")}</div>`:G}
      </ha-card>
    `}};qe.styles=n`
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
  `,t([gt({attribute:!1})],qe.prototype,"hass",void 0),t([_t()],qe.prototype,"_config",void 0),t([_t()],qe.prototype,"_registry",void 0),t([_t()],qe.prototype,"_registryError",void 0),qe=t([ht(yt)],qe),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===yt)||window.customCards.push({type:yt,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Ge=["sky","elevation","decision","covers","overrides","climate"];let Ye=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let t=null,e=null;return(i,s,o)=>{const r=s.entry_id??"";return null!==t&&t.registry===o&&t.hass===i&&t.entryId===r||(t={registry:o,hass:i,entryId:r},e=Mt(i,s,o)),e}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(t){if(!t?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...t},null===this._registry){const e=jt.get(t.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(ft)}static getStubConfig(){return{type:`custom:${vt}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(t){null!==this._registry&&this._config&&this.hass&&(t.has("hass")||t.has("_registry")||t.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Ht(this.hass,t=>{const e=new Set(Bt(this._registry??[],this._config?.entry_id??"").map(t=>t.entity_id));(function(t,e){return"create"===t.action||e.has(t.entity_id)})(t,e)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Ut(this.hass).then(t=>{const e=this._config?.entry_id;if(e){const i=Bt(t,e);(null===this._registry||function(t,e){if(t.length!==e.length)return!0;const i=new Map(t.map(t=>[t.entity_id,Wt(t)]));for(const t of e)if(i.get(t.entity_id)!==Wt(t))return!0;return!1}(Bt(this._registry,e),i))&&(this._registry=t,jt.set(e,i))}else this._registry=t;this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const t=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=t);const e=t-this._debounceFirstAt,i=this._DEBOUNCE_MAX-e,s=Math.min(this._DEBOUNCE_DELAY,i);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),s<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},s)}get _sections(){return this._config?.show_sections??Ge}_renderHeader(t,e){const i=St[t.cover_type]??"mdi:window-shutter",s=t.entities.integration_enabled_switch,o=t.entities.automatic_control_switch,r=!s||"on"===this.hass.states[s]?.state,n=!o||"on"===this.hass.states[o]?.state;return B`
      <div class="header">
        <ha-icon .icon=${i}></ha-icon>
        <span class="title">${t.entry_title}</span>
        <span class="spacer"></span>
        ${s?B`<acp-header-pill
              .on=${r}
              .readonly=${!e.integration_enabled}
              .label=${r?"ON":"OFF"}
              title="Integration Enabled"
              @pill-click=${()=>this._toggle(s)}
            ></acp-header-pill>`:G}
        ${o?B`<acp-header-pill
              .on=${n}
              .readonly=${!e.automatic_control}
              label="Auto"
              title="Automatic Control"
              @pill-click=${()=>this._toggle(o)}
            ></acp-header-pill>`:G}
      </div>
    `}_toggle(t){const e=t.split(".")[0];this.hass.callService(e,"toggle",{entity_id:t})}_renderLoading(){return B`
      <ha-card>
        <div class="empty">
          <p class="dim">Loading Adaptive Cover Pro registry…</p>
        </div>
      </ha-card>
    `}_renderEmpty(t){const e=this._config.entry_id,i=this._registry?.length??0,s=this._registry?.filter(t=>t.config_entry_id===e&&"adaptive_cover_pro"===t.platform).length;return B`
      <ha-card>
        <div class="empty">
          <p><strong>No Adaptive Cover Pro entities found</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${e}</code></p>
          <ul class="diag">
            <li>Reason: <code>${t}</code></li>
            <li>Registry entries loaded: <code>${i}</code></li>
            <li>ACP entities matching entry_id: <code>${s??"—"}</code></li>
            ${this._registryError?B`<li>Registry fetch error: <code>${this._registryError}</code></li>`:G}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return G;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const t=this._discovered;if(!t)return this._renderEmpty("no matching entities after unique_id lookup");const e=(i=this._config,{...Tt,...i?.controls});var i;const s=this._sections;return B`
      <ha-card>
        ${this._renderHeader(t,e)}
        <div class="body ${this._config.compact?"compact":""}">
          ${s.includes("sky")?B`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${[t]}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .northOffsetDeg=${Dt(this._config.north_offset??0)}
              ></acp-sky-compass>`:G}
          ${s.includes("elevation")?B`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:G}
          ${s.includes("decision")?B`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                ?show-summary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:G}
          ${s.includes("covers")?B`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:G}
          ${s.includes("overrides")?B`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                .resetEnabled=${e.reset_manual_override}
              ></acp-overrides-panel>`:G}
          ${s.includes("climate")?B`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:G}
        </div>
        ${this._config.show_version?B`<div class="footer dim">adaptive-cover-pro-card v${mt}</div>`:G}
      </ha-card>
    `}};Ye.styles=n`
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
  `,t([gt({attribute:!1})],Ye.prototype,"hass",void 0),t([_t()],Ye.prototype,"_config",void 0),t([_t()],Ye.prototype,"_registry",void 0),t([_t()],Ye.prototype,"_registryError",void 0),t([_t()],Ye.prototype,"_discovered",void 0),Ye=t([ht(vt)],Ye),window.customCards=window.customCards||[],window.customCards.push({type:vt,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${mt} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{Ye as AdaptiveCoverProCard};
