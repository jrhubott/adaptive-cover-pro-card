/*! adaptive-cover-pro-card v2.0.0-beta.1 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function t(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,_=g.trustedTypes,m=_?_.emptyScript:"",v=g.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??b)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,v?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=t=>t,C=x.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+E,T=`<${O}>`,z=document,P=()=>z.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,F="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,U=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,H=/"/g,j=/^(?:script|style|textarea|title)$/i,B=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),W=B(1),V=B(2),q=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Z=new WeakMap,Y=z.createTreeWalker(z,129);function J(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const X=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=I;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===I?"!--"===l[1]?n=R:void 0!==l[1]?n=D:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=U):void 0!==l[3]&&(n=U):n===U?">"===l[0]?(n=o??I,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?U:'"'===l[3]?H:L):n===H||n===L?n=U:n===R||n===D?n=I:(n=U,o=void 0);const h=n===U&&t[e+1].startsWith("/>")?" ":"";r+=n===I?s+T:c>=0?(i.push(a),s.slice(0,c)+A+s.slice(c)+E+h):s+E+(-2===c?e:h)}return[J(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,c]=X(t,e);if(this.el=K.createElement(l,s),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Y.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(A)){const e=c[r++],s=i.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?it:"?"===n[1]?ot:"@"===n[1]?rt:st}),i.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=C?C.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),Y.nextNode(),a.push({type:2,index:++o});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===O)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===q)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=M(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);Y.currentNode=i;let o=Y.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=Y.nextNode(),r++)}return Y.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),M(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new K(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new et(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=G}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=Q(this,t,e,0),r=!M(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Q(this,i[s+n],e,n),a===q&&(a=this._$AH[n]),r||=!M(a)||a!==this._$AH[n],a===G?t=G:t!==G&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class ot extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class rt extends st{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??G)===q)return;const s=this._$AH,i=t===G&&s!==G||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==G&&(s===G||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=x.litHtmlPolyfillSupport;at?.(K,et),(x.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;let ct=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(P(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ut=(t=pt,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function gt(t){return(e,s)=>"object"==typeof s?ut(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function _t(t){return gt({...t,state:!0,attribute:!1})}const mt="2.0.0-beta.1",vt="adaptive-cover-pro-card",ft="adaptive-cover-pro-card-editor",yt="adaptive-cover-pro-sky-compass-card",bt="adaptive-cover-pro-sky-compass-card-editor",$t="adaptive-cover-pro-tile-card",wt="adaptive-cover-pro-tile-card-editor",xt="adaptive_cover_pro",kt=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default"],Ct={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},St={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},At={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open"},Et={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds"},Ot={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion"},Tt={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Sun tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Motion",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"}},zt={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Pt={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"};function Mt(t,e,s){const i=e.entry_id;if(!i)return null;const o={},r=`${i}_`;let n=!1;for(const t of s){if(t.config_entry_id!==i)continue;if(t.platform!==xt)continue;if(n=!0,!t.unique_id.startsWith(r))continue;const e=t.unique_id.slice(r.length),s=t.entity_id.split(".")[0],a=Pt[`${s}:${e}`];a&&(o[a]=t.entity_id)}if(!n||0===Object.keys(o).length)return null;const a=t;let l=i;if(a.devices)for(const t of Object.values(a.devices))if(t.config_entries?.includes(i)){l=t.name_by_user??t.name??i;break}const c=[],d=o.target_position_sensor;if(d){const e=t.states[d]?.attributes?.actual_positions;e&&c.push(...Object.keys(e))}let h="cover_blind";const p=o.control_status_sensor;if(p){const e=t.states[p]?.attributes;e?.cover_type&&(h=e.cover_type)}return{entry_id:i,entry_title:l,cover_type:h,entities:o,managed_covers:c}}function Nt(t,e,s=0){const i=(t-90+s)*Math.PI/180;return{x:e*Math.cos(i),y:e*Math.sin(i)}}function Ft(t){return 1-Math.max(0,Math.min(90,t))/90}function It(t,e,s,i=0,o=0){const r=t=>(t%360+360)%360,n=r(t),a=r(e);let l=a-n;l<0&&(l+=360);const c=l>180?1:0,d=Nt(n,s,o),h=Nt(a,s,o);if(i<=0)return`M 0 0 L ${d.x} ${d.y} A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y} Z`;const p=Nt(a,i,o),u=Nt(n,i,o);return[`M ${d.x} ${d.y}`,`A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y}`,`L ${p.x} ${p.y}`,`A ${i} ${i} 0 ${c} 0 ${u.x} ${u.y}`,"Z"].join(" ")}function Rt(t,e,s=0){return Nt(t,Ft(e),s)}function Dt(t){return(t%360+360)%360}async function Ut(t){return t.callWS({type:"config/entity_registry/list"})}function Lt(t,e){let s=null,i=!1;return t.connection.subscribeEvents(t=>e(t.data),"entity_registry_updated").then(t=>{i?t():s=t}).catch(()=>{}),()=>{i=!0,s&&s()}}function Ht(t){return`acp-card:registry:v1:${t}`}const jt={get(t){try{const e=localStorage.getItem(Ht(t));if(!e)return null;const s=JSON.parse(e);return 1!==s.schemaVersion?null:s}catch{return null}},set(t,e){try{const s={schemaVersion:1,cardVersion:mt,fetchedAt:Date.now(),entries:e};localStorage.setItem(Ht(t),JSON.stringify(s))}catch{}},invalidate(t){try{localStorage.removeItem(Ht(t))}catch{}},clear(){try{const t="acp-card:registry:v1:",e=[];for(let s=0;s<localStorage.length;s++){const i=localStorage.key(s);i?.startsWith(t)&&e.push(i)}e.forEach(t=>localStorage.removeItem(t))}catch{}}};function Bt(t){return`${t.entity_id}|${t.unique_id}|${t.platform}|${t.config_entry_id??""}`}function Wt(t,e,s){return t.filter(t=>t.config_entry_id===e&&void 0===s)}let Vt=class extends ct{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return W`
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
  `,t([gt({type:Boolean})],Vt.prototype,"on",void 0),t([gt({type:Boolean})],Vt.prototype,"readonly",void 0),t([gt({type:String})],Vt.prototype,"label",void 0),t([gt({type:String})],Vt.prototype,"title",void 0),Vt=t([ht("acp-header-pill")],Vt);class qt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Gt=(Zt=class extends qt{constructor(t){if(super(t),1!==t.type||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return q}},(...t)=>({_$litDirective$:Zt,values:t}));var Zt;function Yt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Jt,Xt,Kt={exports:{}},Qt=(Jt||(Jt=1,Xt=Kt,function(){var t=Math.PI,e=Math.sin,s=Math.cos,i=Math.tan,o=Math.asin,r=Math.atan2,n=Math.acos,a=t/180,l=864e5,c=2440588,d=2451545;function h(t){return new Date((t+.5-c)*l)}function p(t){return function(t){return t.valueOf()/l-.5+c}(t)-d}var u=23.4397*a;function g(t,o){return r(e(t)*s(u)-i(o)*e(u),s(t))}function _(t,i){return o(e(i)*s(u)+s(i)*e(u)*e(t))}function m(t,o,n){return r(e(t),s(t)*e(o)-i(n)*s(o))}function v(t,i,r){return o(e(i)*e(r)+s(i)*s(r)*s(t))}function f(t,e){return a*(280.16+360.9856235*t)-e}function y(t){return a*(357.5291+.98560028*t)}function b(s){return s+a*(1.9148*e(s)+.02*e(2*s)+3e-4*e(3*s))+102.9372*a+t}function $(t){var e=b(y(t));return{dec:_(e,0),ra:g(e,0)}}var w={getPosition:function(t,e,s){var i=a*-s,o=a*e,r=p(t),n=$(r),l=f(r,i)-n.ra;return{azimuth:m(l,o,n.dec),altitude:v(l,o,n.dec)}}},x=w.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];w.addTime=function(t,e,s){x.push([t,e,s])};var k=9e-4;function C(e,s,i){return k+(e+s)/(2*t)+i}function S(t,s,i){return d+t+.0053*e(s)-.0069*e(2*i)}function A(t,i,o,r,a,l,c){var d=function(t,i,o){return n((e(t)-e(i)*e(o))/(s(i)*s(o)))}(t,o,r);return S(C(d,i,a),l,c)}function E(t){var i=a*(134.963+13.064993*t),o=a*(93.272+13.22935*t),r=a*(218.316+13.176396*t)+6.289*a*e(i),n=5.128*a*e(o),l=385001-20905*s(i);return{ra:g(r,n),dec:_(r,n),dist:l}}function O(t,e){return new Date(t.valueOf()+e*l/24)}w.getTimes=function(e,s,i,o){var r,n,l,c,d,u=a*-i,g=a*s,m=function(t){return-2.076*Math.sqrt(t)/60}(o=o||0),v=function(e,s){return Math.round(e-k-s/(2*t))}(p(e),u),f=C(0,u,v),$=y(f),w=b($),E=_(w,0),O=S(f,$,w),T={solarNoon:h(O),nadir:h(O-.5)};for(r=0,n=x.length;r<n;r+=1)d=O-((c=A(((l=x[r])[0]+m)*a,u,g,E,v,$,w))-O),T[l[1]]=h(d),T[l[2]]=h(c);return T},w.getMoonPosition=function(t,o,n){var l=a*-n,c=a*o,d=p(t),h=E(d),u=f(d,l)-h.ra,g=v(u,c,h.dec),_=r(e(u),i(c)*s(h.dec)-e(h.dec)*s(u));return g+=function(t){return t<0&&(t=0),2967e-7/Math.tan(t+.00312536/(t+.08901179))}(g),{azimuth:m(u,c,h.dec),altitude:g,distance:h.dist,parallacticAngle:_}},w.getMoonIllumination=function(t){var i=p(t||new Date),o=$(i),a=E(i),l=149598e3,c=n(e(o.dec)*e(a.dec)+s(o.dec)*s(a.dec)*s(o.ra-a.ra)),d=r(l*e(c),a.dist-l*s(c)),h=r(s(o.dec)*e(o.ra-a.ra),e(o.dec)*s(a.dec)-s(o.dec)*e(a.dec)*s(o.ra-a.ra));return{fraction:(1+s(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},w.getMoonTimes=function(t,e,s,i){var o=new Date(t);i?o.setUTCHours(0,0,0,0):o.setHours(0,0,0,0);for(var r,n,l,c,d,h,p,u,g,_,m,v,f,y=.133*a,b=w.getMoonPosition(o,e,s).altitude-y,$=1;$<=24&&(r=w.getMoonPosition(O(o,$),e,s).altitude-y,u=((d=(b+(n=w.getMoonPosition(O(o,$+1),e,s).altitude-y))/2-r)*(p=-(h=(n-b)/2)/(2*d))+h)*p+r,_=0,(g=h*h-4*d*r)>=0&&(m=p-(f=Math.sqrt(g)/(2*Math.abs(d))),v=p+f,Math.abs(m)<=1&&_++,Math.abs(v)<=1&&_++,m<-1&&(m=v)),1===_?b<0?l=$+m:c=$+m:2===_&&(l=$+(u<0?v:m),c=$+(u<0?m:v)),!l||!c);$+=2)b=n;var x={};return l&&(x.rise=O(o,l)),c&&(x.set=O(o,c)),l||c||(x[u>0?"alwaysUp":"alwaysDown"]=!0),x},Xt.exports=w}()),Kt.exports),te=Yt(Qt);function ee(t,e,s,i=10){const o=[],r=s.getTime()+864e5;for(let n=s.getTime();n<=r;n+=60*i*1e3){const s=new Date(n),i=te.getPosition(s,t,e);o.push({t:s,elevation:180*i.altitude/Math.PI,azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360})}return o}function se(t=new Date){const e=new Date(t);return e.setHours(0,0,0,0),e}function ie(t,e,s,i){const o=((e-s)%360+360)%360;return((t-o)%360+360)%360<=((((e+i)%360+360)%360-o)%360+360)%360}function oe(t,e,s=new Date){const i=te.getMoonPosition(s,t,e),o=te.getMoonIllumination(s);return{azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360,elevation:180*i.altitude/Math.PI,phase:o.phase,fraction:o.fraction,phaseName:re(o.phase)}}function re(t){return t<.0625||t>=.9375?"New Moon":t<.1875?"Waxing Crescent":t<.3125?"First Quarter":t<.4375?"Waxing Gibbous":t<.5625?"Full Moon":t<.6875?"Waning Gibbous":t<.8125?"Last Quarter":"Waning Crescent"}function ne(t){return null==t||Number.isNaN(t)?"—":`${Math.round(t)}%`}function ae(t){return null==t||Number.isNaN(t)?"—":`${t.toFixed(1)}°`}function le(t){if(!t)return"—";const e=new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function ce(t){if(!t)return"—";const e=new Date(t).getTime();if(Number.isNaN(e))return"—";const s=Math.round((e-Date.now())/1e3);return s<=0?"expired":function(t){if(null==t||Number.isNaN(t))return"—";const e=Math.max(0,Math.round(t));if(e<60)return`${e}s`;const s=Math.floor(e/60);return s<60?`${s}m ${e%60}s`:`${Math.floor(s/60)}h ${s%60}m`}(s)}const de=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function he(t){const e=de.length;return de[(t%e+e)%e]}const pe=110;let ue=class extends ct{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set}_toggleEntry(t){const e=new Set(this._hiddenEntries);e.has(t)?e.delete(t):e.add(t),this._hiddenEntries=e}_sunFor(t){const e=t.entities.sun_sensor;if(!e)return null;const s=this.hass.states[e];if(!s)return null;const i=parseFloat(s.state);return Number.isNaN(i)?null:{...s.attributes,window_azimuth:s.attributes.window_azimuth}}_coverPositionFor(t){const e=t.entities.target_position_sensor;if(!e)return null;const s=parseFloat(this.hass.states[e]?.state??"");return Number.isNaN(s)?null:s}_sunInfrontFor(t){const e=t.entities.sun_infront_binary;return!!e&&"on"===this.hass.states[e]?.state}_readActiveAzimuth(t){if(!t)return null;const e=this.hass.states[t];if(!e)return null;if("unavailable"===e.state||"unknown"===e.state)return null;const s=e.attributes.azimuth;return"number"==typeof s&&Number.isFinite(s)?s:null}_buildOverlays(){const t=[];return this.discovered_list.forEach((e,s)=>{const i=this._sunFor(e);if(!i)return;const o=e.entities.sun_sensor,r=parseFloat(this.hass.states[o]?.state??"0"),{color:n,isOverride:a}=(l=this.coverColors?.[s],c=s,"string"==typeof l&&l.length>0?{color:l,isOverride:!0}:{color:he(c),isOverride:!1});var l,c;t.push({d:e,sun:i,sunAzi:r,sunInfront:this._sunInfrontFor(e),coverPos:this._coverPositionFor(e),coverType:e.cover_type,color:n,isOverride:a,index:s})}),t}render(){if(!this.hass)return G;if(!this.discovered_list||0===this.discovered_list.length)return W`<div class="placeholder">No Adaptive Cover Pro entries selected.</div>`;const t=this._buildOverlays();if(0===t.length)return W`<div class="placeholder">Sun sensor not yet populated.</div>`;const e=t.filter(t=>!this._hiddenEntries.has(t.d.entry_id)),s=Dt(this.northOffsetDeg),i=t.length>1,o=t[0],r=o.sunAzi,n=o.sun.elevation,a=Rt(r,n,s),l=t.some(t=>t.sun.in_fov),c=t.some(t=>t.sunInfront),d=n<=0,h=!d&&c?"sun valid":!d&&l?"sun in-fov":"sun",{latitude:p,longitude:u}=this.hass.config,g=void 0!==p&&void 0!==u?ee(p,u,se()):[],_=this.showMoon&&void 0!==p&&void 0!==u?oe(p,u):null,m=null!==_&&_.elevation>0,v=_?_.phase<.5?-24*_.phase:24*(1-_.phase):0,f=m?Rt(_.azimuth,_.elevation,s):null,y=f?f.x*pe:0,b=f?f.y*pe:0,$=this.showSunPath?g.filter(t=>t.elevation>0).map(t=>{const e=Rt(t.azimuth,t.elevation,s);return`${(e.x*pe).toFixed(1)},${(e.y*pe).toFixed(1)}`}).join(" "):"",{riseAzimuth:w,setAzimuth:x}=this.showSunriseSunset?function(t){let e=-1,s=-1;for(let i=0;i<t.length;i++)t[i].elevation>0&&(-1===e&&(e=i),s=i);return{riseAzimuth:e>=0?t[e].azimuth:null,setAzimuth:s>=0?t[s].azimuth:null}}(g):{riseAzimuth:null,setAzimuth:null},k=null!==w?Nt(w,pe,s):null,C=null!==x?Nt(x,pe,s):null,S=Nt(0,124,s),A=Nt(90,124,s),E=Nt(180,124,s),O=Nt(270,124,s),T=Nt(0,pe,s),z=Nt(180,pe,s),P=Nt(90,pe,s),M=Nt(270,pe,s),N=`Sun: ${ae(r)} az / ${ae(n)} el`,F=null!==w?`Sunrise: ${ae(w)}`:"",I=null!==x?`Sunset: ${ae(x)}`:"",R=null!==_?`Moon: ${_.phaseName} (${Math.round(100*_.fraction)}%)`:"";return W`
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
            <line class="grid thin" x1=${T.x} y1=${T.y} x2=${z.x} y2=${z.y}></line>
            <line class="grid thin" x1=${P.x} y1=${P.y} x2=${M.x} y2=${M.y}></line>

            ${e.map(t=>this._renderEntryLayers(t,i,s))}

            ${this.showSunPath&&$?V`<g data-tooltip="Sun path (today)"><title>Sun path (today)</title><polyline class="sun-path" points=${$}></polyline></g>`:G}

            ${this.showSunriseSunset&&k&&null!==w?V`<g data-tooltip=${F}><title>${F}</title><circle class="rise-marker" cx=${k.x} cy=${k.y} r="4"></circle></g>`:G}
            ${this.showSunriseSunset&&C&&null!==x?V`<g data-tooltip=${I}><title>${I}</title><circle class="set-marker" cx=${C.x} cy=${C.y} r="4"></circle></g>`:G}

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

            <g data-tooltip=${N}>
              <title>${N}</title>
              <circle class=${h} cx=${a.x*pe} cy=${a.y*pe} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(t,i):G}
        ${this.showStats?this._renderStats(t,i):G}
      </div>
    `}_renderEntryLayers(t,e,s=0){const i=Dt(t.sun.window_azimuth),o=Dt(i-t.sun.fov_left),r=Dt(i+t.sun.fov_right),n=this._readActiveAzimuth(t.d.entities.start_sensor),a=this._readActiveAzimuth(t.d.entities.end_sensor),l=null!==n&&null!==a,c=l?Dt(n):o,d=l?Dt(a):r,h=Nt(i,pe,s),{outer:p,inner:u}=(g=t.sun.min_elevation,_=t.sun.max_elevation,m=pe,void 0!==g&&void 0!==_&&g>_?{outer:m,inner:0}:{outer:void 0!==g?m*Ft(g):m,inner:void 0!==_?m*Ft(_):0});var g,_,m;const v="cover_awning"===t.coverType?t.coverPos/100:1-t.coverPos/100,f=null!==t.coverPos?pe*v:null,y=null!==f?Math.min(f,p):null,b=t.sun.blind_spot_range?[Dt(($=i)-(w=t.sun.blind_spot_range)[1]),Dt($-w[0])]:null;var $,w;const x=b?It(b[0],b[1],pe,0,s):null,k=It(c,d,p,u,s),C=null!==y&&y>u?It(c,d,y,u,s):"",S=e?`${t.d.entry_title}: `:"",A=void 0!==t.sun.min_elevation||void 0!==t.sun.max_elevation?` · elev ${ae(t.sun.min_elevation??0)}–${ae(t.sun.max_elevation??90)}`:"",E=l?`${S}Active sun arc ${ae(c)} – ${ae(d)}${A}`:`${S}FOV ${ae(t.sun.fov_left)} left / ${ae(t.sun.fov_right)} right${A}`,O=`${S}Window normal: ${ae(i)}`,T=null!==t.coverPos?"cover_awning"===t.coverType?`${S}Cover extended: ${t.coverPos}%`:`${S}Cover closed: ${t.coverPos}%`:"",z=b?`${S}Blind spot: ${ae(b[0])} – ${ae(b[1])}`:"",P=e||t.isOverride,M=P?`fill: ${t.color}; stroke: ${t.color};`:"",N=P?`fill: ${t.color}; stroke: ${t.color};`:"",F=P?`fill: ${t.color}; stroke: ${t.color};`:"",I=P?`stroke: ${t.color};`:"",R=P?`fill: ${t.color};`:"",D=this.showCoverFill&&""!==C,U=this.showBlindSpot&&!!x,L=this.showWindowArrow,H=`M 0 0 L ${h.x} ${h.y}`,j="display: none;";return V`<g class="entry-overlay">
      <g data-tooltip=${E}>
        <title>${E}</title>
        <path class="fov" style=${M} d=${k}></path>
      </g>
      <g class="arrow-group" data-tooltip=${O} style=${L?"":j}>
        <title>${O}</title>
        <path class="window" style=${I} d=${H}></path>
        <circle class="window-base" style=${R} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" data-tooltip=${T} style=${D?"":j}>
        <title>${T}</title>
        <path class="cover-fill" style=${N} d=${C}></path>
      </g>
      <g class="blind-group" data-tooltip=${z} style=${U?"":j}>
        <title>${z}</title>
        <path class="blind-spot" style=${F} d=${x??""}></path>
      </g>
    </g>`}_renderLegend(t,e){return e?W`
        <div class="legend">
          ${t.map(t=>W`
              <button
                type="button"
                class=${Gt({"entry-toggle":!0,hidden:this._hiddenEntries.has(t.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(t.d.entry_id)}
                @click=${()=>this._toggleEntry(t.d.entry_id)}
              >
                <span class="swatch entry" style="background: ${t.color}"></span>
                ${t.d.entry_title}
                ${t.sunInfront?W`<span class="status valid">✓ in FOV</span>`:t.sun.in_fov?W`<span class="status in-fov">in FOV</span>`:W`<span class="status">—</span>`}
              </button>
            `)}
          <div><span class="dot sun valid"></span> Sun</div>
          ${this.showMoon?W`<div><span class="dot moon-dot"></span> Moon</div>`:G}
        </div>
      `:W`<div class="legend">
      <div><span class="dot sun valid"></span> Sun (hitting window)</div>
      <div><span class="dot sun in-fov"></span> Sun (in FOV, not valid)</div>
      <div><span class="dot sun"></span> Sun (outside FOV)</div>
      ${this.showMoon?W`<div><span class="dot moon-dot"></span> Moon</div>`:G}
      <div><span class="swatch fov"></span> Window FOV</div>
      ${this.showSunPath?W`<div><span class="swatch sun-path-swatch"></span> Sun path</div>`:G}
      ${this.showSunriseSunset?W`<div><span class="dot rise-dot"></span> Sunrise</div>
            <div><span class="dot set-dot"></span> Sunset</div>`:G}
      ${this.showCoverFill?W`<div><span class="swatch cover-fill-swatch"></span> Cover closed</div>`:G}
      ${this.showWindowArrow?W`<div><span class="swatch window-swatch"></span> Window normal</div>`:G}
    </div>`}_renderStats(t,e){const s=t[0],i=s.sunAzi,o=s.sun.elevation,{latitude:r,longitude:n}=this.hass.config,a=this.showMoon&&void 0!==r&&void 0!==n?oe(r,n):null;return e?W`
        <div class="stats dim">
          <div class="stats-row">
            <span>Sun: ${ae(i)} / ${ae(o)}</span>
            ${this.showMoon&&a?W`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:G}
          </div>
          ${t.map(t=>W`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${t.color}"></span>
                <span class="entry-name">${t.d.entry_title}</span>
                <span>∠${ae(t.sun.gamma)}</span>
                <span>W ${ae(Dt(t.sun.window_azimuth))}</span>
                ${t.sun.in_fov?W`<span class="status in-fov">✓</span>`:G}
              </div>
            `)}
        </div>
      `:W`<div class="stats dim">
      <span>Azi: ${ae(i)}</span>
      <span>Elev: ${ae(o)}</span>
      <span>∠: ${ae(s.sun.gamma)}</span>
      <span>Window: ${ae(Dt(s.sun.window_azimuth))}</span>
      ${this.showMoon&&a?W`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:G}
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
  `,t([gt({attribute:!1})],ue.prototype,"hass",void 0),t([gt({attribute:!1})],ue.prototype,"discovered_list",void 0),t([gt({type:Boolean,reflect:!0})],ue.prototype,"compact",void 0),t([gt({attribute:!1})],ue.prototype,"showStats",void 0),t([gt({attribute:!1})],ue.prototype,"showLegend",void 0),t([gt({attribute:!1})],ue.prototype,"showMoon",void 0),t([gt({attribute:!1})],ue.prototype,"showCardinals",void 0),t([gt({attribute:!1})],ue.prototype,"showBlindSpot",void 0),t([gt({attribute:!1})],ue.prototype,"showSunPath",void 0),t([gt({attribute:!1})],ue.prototype,"showSunriseSunset",void 0),t([gt({attribute:!1})],ue.prototype,"showCoverFill",void 0),t([gt({attribute:!1})],ue.prototype,"showWindowArrow",void 0),t([gt({attribute:!1})],ue.prototype,"coverColors",void 0),t([gt({attribute:!1})],ue.prototype,"northOffsetDeg",void 0),t([_t()],ue.prototype,"_hiddenEntries",void 0),ue=t([ht("acp-sky-compass")],ue);let ge=class extends ct{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];return e?e.attributes:null}render(){if(!this.hass||!this.discovered)return G;const t=this._sunAttrs(),{latitude:e,longitude:s}=this.hass.config;if(void 0===e||void 0===s||!t)return W`<div class="placeholder">Sun elevation chart unavailable.</div>`;const i=se(),o=ee(e,s,i),r=new Date,n=function(t,e,s,i){let o=-1,r=-1,n=-1;for(let a=0;a<t.length;a++){const l=t[a];l.elevation>0&&ie(l.azimuth,e,s,i)?(-1===n&&(n=a),a-n>r-o&&(o=n,r=a)):n=-1}return-1===o?null:{startIdx:o,endIdx:r}}(o,t.window_azimuth,t.fov_left,t.fov_right),a=t=>32+(t.getTime()-i.getTime())/864e5*360,l=t=>138-(t- -10)/100*128,c=o.map(t=>`${a(t.t).toFixed(1)},${l(t.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(r),p=this._interpAt(o,r),u=p?l(p.elevation):null,g=n?o[n.startIdx].t:null,_=n?o[n.endIdx].t:null,m=g?a(g):null,v=_?a(_):null;return W`
      <div class="wrap">
        <div class="head">
          <span class="label">Sun today</span>
          ${g&&_?W`<span class="dim"
                >FOV: ${le(g.toISOString())} →
                ${le(_.toISOString())}</span
              >`:W`<span class="dim">Sun does not enter FOV today</span>`}
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${V`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(t=>V`
              <line class="grid" x1=${32} y1=${l(t)} x2=${392} y2=${l(t)} />
              <text class="tick" x=${28} y=${l(t)+3} text-anchor="end">${t}°</text>
            `)}

            <!-- x-axis gridlines at every 6h -->
            ${[0,6,12,18,24].map(t=>{const e=new Date(i.getTime()+36e5*t);return V`
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
    `}_interpAt(t,e){if(0===t.length)return null;const s=e.getTime();if(s<=t[0].t.getTime())return t[0];if(s>=t[t.length-1].t.getTime())return t[t.length-1];for(let i=1;i<t.length;i++)if(t[i].t.getTime()>=s){const o=t[i-1],r=t[i],n=(s-o.t.getTime())/(r.t.getTime()-o.t.getTime());return{t:e,elevation:o.elevation+(r.elevation-o.elevation)*n,azimuth:o.azimuth+(r.azimuth-o.azimuth)*n}}return t[t.length-1]}};function _e(t){const e=t.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(e))return"custom_position";switch(e){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return e}}function me(t,e,s,i=Ct){const o=new Map;for(const e of t){if(!e.matched)continue;const t=_e(e.handler);kt.includes(t)&&o.set(t,e)}const r=[...kt].reverse().filter(t=>o.has(t));return 0===r.length?e.reason??"":r.map(t=>function(t,e,s,i){const o=i[t]??t,r=e.position,n=null==r?"":` ${ne(r)}`;if("custom_position"!==t)return`${o}${n}`.trimEnd();return`${s.custom_position_active_slot_name?`${o} · ${s.custom_position_active_slot_name}`:s.custom_position_active_slot?`${o} #${s.custom_position_active_slot}`:o}${n}${!0===s.custom_position_minimum_mode?" floor":""}`}(t,o.get(t),e,i)).join(" → ")}ge.styles=n`
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
  `,t([gt({attribute:!1})],ge.prototype,"hass",void 0),t([gt({attribute:!1})],ge.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],ge.prototype,"compact",void 0),ge=t([ht("acp-elevation-chart")],ge);let ve=class extends ct{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this.hideInactive=!1}_trace(){const t=this.discovered.entities.decision_trace_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=e.attributes;if(!s?.trace)return null;const i=new Map;for(const t of s.trace)i.set(_e(t.handler),{matched:t.matched,reason:t.reason,position:t.position});return{winner:e.state,reason:s.reason??"",steps:i,enabledHandlers:s.enabled_handlers,summary:me(s.trace,s,e.state)}}render(){if(!this.hass||!this.discovered)return G;const t=this._trace();if(!t)return W`<div class="placeholder">Decision trace not yet populated.</div>`;const e=function(t){if(!t)return new Set;const e=new Set(t);return new Set(kt.filter(t=>!e.has(t)))}(t.enabledHandlers),s=function(t,e,s,i,o=new Set){return t.filter(t=>t===s||!o.has(t)&&(!i||!0===e.get(t)?.matched))}(kt,t.steps,t.winner,this.hideInactive,e);return W`
      <div class="wrap">
        <div class="head">
          <span class="label">Pipeline</span>
          <span class="winner">Winner: ${t.winner}</span>
        </div>
        ${this.showSummary&&t.summary?W`<div class="summary" title="Why this position?">${t.summary}</div>`:G}
        <div class="rows">${s.map(e=>this._row(e,t.steps.get(e),t.winner===e))}</div>
        <div class="reason dim">${t.reason}</div>
      </div>
    `}_row(t,e,s){const i=e?.matched??!1,o=e?.reason??"not evaluated",r=e?.position;return W`
      <div class="row ${s?"winner":i?"match":"skip"}">
        <span class="name">${Ct[t]}</span>
        <span class="dots" aria-hidden="true">${i?"████":"────"}</span>
        <span class="pos">${null!=r?ne(r):""}</span>
        <span class="reason-inline dim">${o}</span>
        ${s?W`<span class="badge">✓</span>`:G}
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
  `,t([gt({attribute:!1})],ve.prototype,"hass",void 0),t([gt({attribute:!1})],ve.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],ve.prototype,"compact",void 0),t([gt({type:Boolean,reflect:!0,attribute:"show-summary"})],ve.prototype,"showSummary",void 0),t([gt({type:Boolean,reflect:!0,attribute:"hide-inactive"})],ve.prototype,"hideInactive",void 0),ve=t([ht("acp-decision-strip")],ve),function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(fe||(fe={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(ye||(ye={}));const be=["closed","locked","off"],$e=(t,e,s,i)=>{i=i||{},s=null==s?{}:s;const o=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return o.detail=s,t.dispatchEvent(o),o},we=t=>{$e(window,"haptic",t)};function xe(t){return void 0!==t&&"none"!==t.action}let ke=class extends ct{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0}render(){const t=this._kind(),e=Tt[t],s=this._label(t,e.label);return W`<span
      class="badge kind-${t}"
      style="background:${e.bg};color:${e.fg};"
      part="badge"
      >${s}</span
    >`}_kind(){if(!1===this.integrationEnabled)return"off";const t=_e(this.winner);return Ot[t]??"auto"}_label(t,e){return"manual"===t?this.manualEndIso?le(this.manualEndIso):e:"custom_position"===t?`${this.slotName?`${e} · ${this.slotName}`:void 0!==this.slotNumber?`${e} #${this.slotNumber}`:e}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?" floor":""}`:e}};ke.styles=n`
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
  `,t([gt()],ke.prototype,"winner",void 0),t([gt({attribute:"manual-end-iso"})],ke.prototype,"manualEndIso",void 0),t([gt({type:Number,attribute:"slot-number"})],ke.prototype,"slotNumber",void 0),t([gt({attribute:"slot-name"})],ke.prototype,"slotName",void 0),t([gt({type:Number})],ke.prototype,"pct",void 0),t([gt({type:Boolean,attribute:"minimum-mode"})],ke.prototype,"minimumMode",void 0),t([gt({type:Boolean,reflect:!0})],ke.prototype,"compact",void 0),t([gt({type:Boolean,attribute:"integration-enabled"})],ke.prototype,"integrationEnabled",void 0),ke=t([ht("acp-tile-badge")],ke);let Ce=class extends ct{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualEndIso(){const t=this.discovered.entities.manual_override_end_sensor;if(!t)return null;const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:null}_motionStatus(){const t=this.discovered.entities.motion_status_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=e.attributes.motion_timeout_end_time;return{state:e.state,endIso:s??null}}_forceActive(){const t=this.discovered.entities.force_override_sensor;if(!t)return 0;const e=this.hass.states[t];return e&&parseInt(e.state,10)||0}_resetManual(){const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}render(){if(!this.hass||!this.discovered)return G;const t=this._manualActive(),e=this._manualEndIso(),s=this._motionStatus(),i=this._forceActive(),o=this.discovered.entities.reset_override_button;return W`
      <div class="wrap">
        <div class="label dim">Overrides</div>
        <div class="grid">
          <div class="tile ${t?"active":""}">
            <div class="tile-label">Manual</div>
            <div class="tile-value">${t?"Active":"Off"}</div>
            ${e?W`<div class="tile-sub dim">ends in ${ce(e)}</div>`:G}
          </div>

          <div class="tile ${i>0?"active warning":""}">
            <div class="tile-label">Force</div>
            <div class="tile-value">${i>0?`${i} active`:"Off"}</div>
          </div>

          ${s?W`<div class="tile ${"motion_detected"===s.state?"active":""}">
                <div class="tile-label">Motion</div>
                <div class="tile-value">${s.state.replace(/_/g," ")}</div>
                ${s.endIso?W`<div class="tile-sub dim">timeout ${ce(s.endIso)}</div>`:G}
              </div>`:G}
          ${o?this.resetEnabled?W`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">Reset Manual</div>
                </button>`:W`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
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
  `,t([gt({attribute:!1})],Ce.prototype,"hass",void 0),t([gt({attribute:!1})],Ce.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ce.prototype,"compact",void 0),t([gt({type:Boolean,attribute:"reset-enabled"})],Ce.prototype,"resetEnabled",void 0),Ce=t([ht("acp-overrides-panel")],Ce);const Se={"Summer Mode":"mdi:weather-sunny","Winter Mode":"mdi:snowflake",Intermediate:"mdi:weather-partly-cloudy"};let Ae=class extends ct{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return G;const t=this.discovered.entities.climate_status_sensor;if(!t)return G;const e=this.hass.states[t];if(!e||"unavailable"===e.state)return G;const s=e.state,i=e.attributes??{},o=Se[s]??"mdi:thermostat",r=i.temperature_unit??"°",n=[void 0!==i.indoor_temperature?{label:"Indoor",value:i.indoor_temperature,unit:r}:null,void 0!==i.outdoor_temperature?{label:"Outdoor",value:i.outdoor_temperature,unit:r}:null].filter(t=>null!==t),a=[{label:"Presence",value:i.is_presence,icon:"mdi:account-check"},{label:"Sunny",value:i.is_sunny,icon:"mdi:white-balance-sunny"},{label:"Lux",value:i.lux_active,icon:"mdi:brightness-7"},{label:"Irradiance",value:i.irradiance_active,icon:"mdi:solar-power"}].filter(t=>void 0!==t.value);return W`
      <div class="wrap">
        <div class="head">
          <span class="label">Climate</span>
          <span class="dim"
            >Active:
            ${void 0!==i.active_temperature?`${i.active_temperature.toFixed(1)}${r}`:"—"}</span
          >
        </div>
        <div class="strategy">
          <ha-icon icon=${o}></ha-icon>
          <span class="strategy-name">${s}</span>
        </div>
        ${n.length?W`
              <div class="temps">
                ${n.map(t=>W`
                    <div class="temp">
                      <span class="temp-label dim">${t.label}</span>
                      <span class="temp-value">${t.value.toFixed(1)}${t.unit}</span>
                    </div>
                  `)}
              </div>
            `:G}
        ${a.length?W`
              <div class="conditions">
                ${a.map(t=>W`
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
  `,t([gt({attribute:!1})],Ae.prototype,"hass",void 0),t([gt({attribute:!1})],Ae.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ae.prototype,"compact",void 0),Ae=t([ht("acp-climate-panel")],Ae);let Ee=class extends ct{constructor(){super(...arguments),this.compact=!1}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return{target:null,covers:{}};const e=this.hass.states[t];if(!e)return{target:null,covers:{}};const s=parseFloat(e.state),i=e.attributes;return{target:Number.isNaN(s)?null:s,covers:i?.actual_positions??{}}}_mismatched(){const t=this.discovered.entities.position_mismatch_binary;if(!t)return new Set;const e=this.hass.states[t];if("on"!==e?.state)return new Set;const s=e.attributes.entities;return s?new Set(Object.entries(s).filter(([,t])=>t.mismatch).map(([t])=>t)):new Set}_setPosition(t,e){this.hass.callService("cover","set_cover_position",{entity_id:t,position:e})}render(){if(!this.hass||!this.discovered)return G;const{target:t,covers:e}=this._target(),s=this._mismatched(),i=Object.entries(e);return 0===i.length?W`<div class="placeholder">No covers reported by the integration.</div>`:W`
      <div class="wrap">
        <div class="head">
          <span class="label">Covers</span>
          <span class="target">Target: ${ne(t)}</span>
        </div>
        ${i.map(([e,i])=>this._bar(e,i,t,s.has(e)))}
      </div>
    `}_bar(t,e,s,i){const o=this.hass.states[t]?.attributes?.friendly_name??t,r=s??0;return W`
      <div class="cover ${i?"mismatch":""}">
        <div class="name" title=${t}>${o}</div>
        <div
          class="track"
          @click=${e=>this._handleTrackClick(e,t)}
          title="Click to set position"
        >
          <div class="fill" style="width:${e??0}%"></div>
          ${null!==s?W`<div
                class="marker"
                style="left:${r}%"
                title="Target ${r}%"
              ></div>`:G}
        </div>
        <div class="num">${ne(e)}</div>
        ${i?W`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:G}
      </div>
    `}_handleTrackClick(t,e){const s=t.currentTarget.getBoundingClientRect(),i=Math.round((t.clientX-s.left)/s.width*100),o=Math.max(0,Math.min(100,i));this._setPosition(e,o)}};var Oe;Ee.styles=n`
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
  `,t([gt({attribute:!1})],Ee.prototype,"hass",void 0),t([gt({attribute:!1})],Ee.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ee.prototype,"compact",void 0),Ee=t([ht("acp-cover-bar")],Ee);let Te=Oe=class extends ct{constructor(){super(...arguments),this.samples=[],this.events=[]}render(){if(!this.samples||0===this.samples.length)return G;const t=this._timeRange();if(!t)return G;const{start:e,end:s}=t,i=s-e;if(i<=0)return G;const{VIEW_W:o,VIEW_H:r,TOP_PAD:n}=Oe,a=r-n,l=this.samples.map(t=>{const s=(Date.parse(t.t)-e)/i*o,r=n+(1-(l=t.position,(Number.isNaN(l)||l<0?0:l>100?100:l)/100))*a;var l;return`${s.toFixed(1)},${r.toFixed(1)}`}).join(" "),c=(this.events??[]).map(t=>{const a=Date.parse(t.t);if(Number.isNaN(a)||a<e||a>s)return null;const l=(a-e)/i*o,c=`evt-${t.kind}`;return V`<line
          class="event-marker ${c}"
          x1=${l.toFixed(1)}
          x2=${l.toFixed(1)}
          y1=${n}
          y2=${r}
        >
          <title>${t.label}</title>
        </line>`}).filter(t=>null!==t);return W`
      <div class="wrap">
        <svg
          viewBox="0 0 ${o} ${r}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line class="baseline" x1="0" y1=${r-.5} x2=${o} y2=${r-.5}></line>
          <polyline class="curve" points=${l} fill="none"></polyline>
          ${c}
        </svg>
      </div>
    `}_timeRange(){let t=Number.POSITIVE_INFINITY,e=Number.NEGATIVE_INFINITY;for(const s of this.samples){const i=Date.parse(s.t);Number.isNaN(i)||(i<t&&(t=i),i>e&&(e=i))}return t===Number.POSITIVE_INFINITY?null:{start:t,end:e}}};Te.VIEW_W=600,Te.VIEW_H=80,Te.TOP_PAD=10,Te.styles=n`
    :host {
      display: block;
    }
    .wrap {
      width: 100%;
    }
    svg {
      display: block;
      width: 100%;
      height: 80px;
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
    .event-marker {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 2 2;
      vector-effect: non-scaling-stroke;
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
  `,t([gt({attribute:!1})],Te.prototype,"samples",void 0),t([gt({attribute:!1})],Te.prototype,"events",void 0),Te=Oe=t([ht("acp-forecast-strip")],Te);let ze=class extends ct{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this._onResume=()=>{const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._onBackdrop=t=>{t.target===t.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=t=>{t.stopPropagation()}}render(){if(!this.open||!this.hass||!this.discovered)return G;const t=this._winner(),e=this._traceAttrs(),s=this._matchedHandlers(e),i=e?me(e.trace??[],e):"",o=this._target(),r=this._shouldShowResume(t),n=this._switchOn("integration_enabled_switch"),a=this._switchOn("automatic_control_switch");return W`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${St[this.discovered.cover_type]??"mdi:window-shutter"}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${n?a?s.map(t=>W`<acp-tile-badge
                          .winner=${t}
                          .slotNumber=${"custom_position"===t?e?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===t?e?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===t?o??void 0:void 0}
                          .minimumMode=${"custom_position"===t?e?.custom_position_minimum_mode:void 0}
                        ></acp-tile-badge>`):G:W`<acp-tile-badge .integrationEnabled=${!1}></acp-tile-badge>`}
            </div>
            <button class="close" type="button" aria-label="Close" @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${i?W`<div class="summary">${i}</div>`:G}

          <div class="position-block">
            <div class="position-label">Target</div>
            <div class="position-value">${ne(o)}</div>
            ${this._mismatchActive()?W`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:G}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${r?W`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>Resume Auto</button>
              </div>`:G}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?"▼ Hide advanced":"▶ Advanced"}
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
    `}_winner(){const t=this.discovered.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(){const t=this.discovered.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_matchedHandlers(t){if(!t?.trace)return[];const e=new Set;for(const s of t.trace){if(!s.matched)continue;const t=_e(s.handler);kt.includes(t)&&e.add(t)}return kt.filter(t=>e.has(t))}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=parseFloat(e.state);return Number.isNaN(s)?null:s}_mismatchActive(){const t=this.discovered.entities.position_mismatch_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualOverrideOn(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(t){const e=this.discovered.entities[t];return!e||"off"!==this.hass.states[e]?.state}_shouldShowResume(t){return!(!this.discovered.entities.reset_override_button||!this._manualOverrideOn()&&"custom_position"!==_e(t))}_renderSlots(t){if(!t)return G;const e=t.filter(t=>null!==t.sensor);return 0===e.length?G:W`<div class="slots-section">
      <div class="slots-label">Custom positions</div>
      ${e.map(t=>this._renderSlotRow(t))}
    </div>`}_renderSlotRow(t){const e=t.sensor_name??`#${t.slot}`;return W`<div class="slot-row" data-slot=${t.slot}>
      <span class="slot-label">${e}</span>
      <span class="slot-position">${ne(t.position)}</span>
      ${!0===t.min_mode?W`<span class="slot-min-mode" title="Floor — slot raises position above raw calc">
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
    </div>`}_renderControls(){const t=[{role:"automatic_control_switch",label:"Automatic"},{role:"climate_mode_switch",label:"Climate"},{role:"motion_control_switch",label:"Motion"}].filter(t=>!!this.discovered.entities[t.role]);return 0===t.length?G:W`<div class="controls-block">
      <div class="controls-label">Controls</div>
      <div class="controls-row">${t.map(t=>this._renderSwitchChip(t.role,t.label))}</div>
    </div>`}_renderSwitchChip(t,e){const s=this.discovered.entities[t],i="on"===this.hass.states[s]?.state;return W`<button
      class="ctrl-toggle ${i?"on":"off"}"
      type="button"
      aria-pressed=${i}
      aria-label=${`${e} ${i?"on":"off"} — tap to toggle`}
      @click=${()=>this._toggleSwitch(s,i)}
    >
      <span class="ctrl-label">${e}</span>
      <span class="ctrl-state">${i?"On":"Off"}</span>
    </button>`}_toggleSwitch(t,e){this.hass.callService("switch",e?"turn_off":"turn_on",{entity_id:t})}_renderForecastStrip(){const t=this.discovered.entities.position_forecast_sensor;if(!t)return G;const e=this.hass.states[t]?.attributes,s=e?.forecast??[],i=e?.events??[];return 0===s.length?G:W`<div class="forecast-block">
      <div class="forecast-label">Today's forecast</div>
      <acp-forecast-strip
        .samples=${s}
        .events=${i}
        .now=${Date.now()}
      ></acp-forecast-strip>
    </div>`}_toggleSlot(t){const e=this.discovered.managed_covers[0];e&&this.hass.callService(xt,"set_custom_position",{entity_id:e,slot:t.slot,enabled:!t.enabled})}};async function Pe(t){return(await t.callWS({type:"config_entries/get",domain:xt})).filter(t=>t.domain===xt).map(t=>({entry_id:t.entry_id,title:t.title}))}ze.styles=n`
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
  `,t([gt({attribute:!1})],ze.prototype,"hass",void 0),t([gt({attribute:!1})],ze.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],ze.prototype,"open",void 0),t([gt({type:Boolean})],ze.prototype,"advancedOpen",void 0),t([gt({type:Boolean})],ze.prototype,"showCompass",void 0),ze=t([ht("acp-more-info-dialog")],ze);const Me=[{value:"auto",label:"Auto (manual override or custom position)"},{value:"always",label:"Always (when reset button is available)"},{value:"never",label:"Never"}],Ne=[{value:"one-line",label:"One line (compact)"},{value:"two-line",label:"Two lines (title on top)"}],Fe={show_position:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_compass:!0,show_resume:"auto",layout:"one-line"},Ie={entry_id:"Adaptive Cover Pro instance",name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",show_compass:"Show sun compass in dialog",show_resume:"Resume button",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action"};let Re=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=t=>Ie[t.name]??t.name,this._valueChanged=t=>{t.stopPropagation();const e={...t.detail.value};for(const[t,s]of Object.entries(Fe))this._config&&Object.prototype.hasOwnProperty.call(this._config,t)||e[t]!==s||delete e[t];this._emit({...this._config??{type:"",entry_id:""},...e})}}setConfig(t){this._config={...t}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry())}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Pe(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id})}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,Ut(this.hass).then(t=>{this._registry=t}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=Lt(this.hass,()=>{this._registryFetchInFlight=!0,Ut(this.hass).then(t=>{this._registry=t}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){if(!this._config)return G;if(this._entriesError&&!this._entries)return W`
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
      `;const t=this._schema(),e={...Fe,...this._config};return W`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${t}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}_schema(){const t=this._entries?.map(t=>({value:t.entry_id,label:t.title}))??[];let e={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const t=Mt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);t&&t.managed_covers.length>0&&(e={entity:{domain:"cover",include_entities:t.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:t,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:e},{name:"layout",selector:{select:{mode:"list",options:Ne}}},{name:"show_position",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"show_resume",selector:{select:{mode:"list",options:Me}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};Re.styles=n`
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
  `,t([gt({attribute:!1})],Re.prototype,"hass",void 0),t([_t()],Re.prototype,"_config",void 0),t([_t()],Re.prototype,"_entries",void 0),t([_t()],Re.prototype,"_entriesError",void 0),t([_t()],Re.prototype,"_registry",void 0),Re=t([ht(wt)],Re);let De=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),xe(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return xe(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(t){if(!t||"string"!=typeof t.entry_id||0===t.entry_id.length)throw new Error(`${$t}: \`entry_id\` is required and must be a non-empty string`);let e={...t};"string"==typeof e.tap_action&&(e={...e,tap_action:"none"===e.tap_action?{action:"none"}:void 0}),this._config=e}getCardSize(){return 1}static getStubConfig(){return{type:`custom:${$t}`,entry_id:""}}static async getConfigElement(){return document.createElement(wt)}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Lt(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Ut(this.hass).then(e=>{t===this._fetchGen&&(this._registry=e,this._registryError=null)}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return G;if(null===this._registry)return W`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?`Registry fetch failed: ${this._registryError}`:"Loading…"}
          </p>
        </div>
      </ha-card>`;const t=Mt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return t?W`
      <ha-card>${this._renderTile(t)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${t}
        .open=${this._dialogOpen}
        .showCompass=${!1!==this._config.show_compass}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `:W`<ha-card>
        <div class="empty">
          <p class="dim">
            Adaptive Cover Pro entry <code>${this._config.entry_id}</code> not found.
          </p>
        </div>
      </ha-card>`}_renderTile(t){const e=this._config,s=e.name??t.entry_title,i=this._resolvedCover(t),o=e.icon??function(t,e){if(null!==e&&!Number.isNaN(e)){if(e>=95)return At[t]??"mdi:window-shutter-open";if(e<=5)return Et[t]??"mdi:window-shutter"}return St[t]??"mdi:window-shutter"}(t.cover_type,this._liveCoverPosition(i)),r=!1!==e.show_position,n=!1!==e.show_controls,a=!1!==e.show_badge,l="two-line"===e.layout,c=this._currentPosition(t),d=this._winner(t),h=this._traceAttrs(t),p=this._manualEndIso(t),u=this._shouldShowResume(t,d),g=this._isFullyInert(e),_=!0===e.show_decision_summary&&h?me(h.trace??[],h):"",m=!!_&&l,v=this._switchOn(t,"integration_enabled_switch"),f=this._switchOn(t,"automatic_control_switch"),y=a&&!(!1===f&&!0===v);return W`
      <div
        class=${`tile-body${l?" two-line":""}${m?" has-summary":""}`}
        role=${g?"group":"button"}
        tabindex=${g?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <ha-icon class="cover-icon" icon=${o}></ha-icon>
        <div class="label">
          <div class="title" title=${t.entry_title}>${s}</div>
          ${_&&!l?W`<div class="summary">${_}</div>`:G}
          ${m?W`<div class="summary inline-summary" title=${_}>${_}</div>`:G}
        </div>
        ${r?W`<div class="position">${ne(c)}</div>`:G}
        ${n?W`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label="Open"
                ?disabled=${!i}
                @click=${()=>this._command(i,"open_cover")}
              >
                ▲
              </button>
              <button
                class="stop"
                type="button"
                aria-label="Stop"
                ?disabled=${!i}
                @click=${()=>this._command(i,"stop_cover")}
              >
                ■
              </button>
              <button
                class="down"
                type="button"
                aria-label="Close"
                ?disabled=${!i}
                @click=${()=>this._command(i,"close_cover")}
              >
                ▼
              </button>
            </div>`:G}
        ${y?W`<acp-tile-badge
              .winner=${d}
              .integrationEnabled=${v}
              .slotNumber=${h?.custom_position_active_slot}
              .slotName=${h?.custom_position_active_slot_name}
              .pct=${c??void 0}
              .minimumMode=${h?.custom_position_minimum_mode}
              .manualEndIso=${p}
            ></acp-tile-badge>`:G}
        ${u?W`<button
              class="resume"
              type="button"
              aria-label="Resume automatic control"
              @click=${e=>{e.stopPropagation(),this._resume(t)}}
              @pointerdown=${this._stop}
            >
              Resume
            </button>`:G}
      </div>
    `}_resolvedCover(t){return this._config?.cover?this._config.cover:t.managed_covers[0]}_currentPosition(t){const e=t.entities.target_position_sensor;if(!e)return null;const s=this.hass.states[e];if(!s)return null;const i=parseFloat(s.state);return Number.isNaN(i)?null:i}_liveCoverPosition(t){if(!t)return null;const e=this.hass.states[t]?.attributes?.current_position;return"number"!=typeof e||Number.isNaN(e)?null:e}_winner(t){const e=t.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(t){const e=t.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_manualOverrideOn(t){const e=t.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(t,e){const s=t.entities[e];return!s||"off"!==this.hass.states[s]?.state}_manualEndIso(t){if(!this._manualOverrideOn(t))return;const e=t.entities.manual_override_end_sensor;return e?this.hass.states[e]?.state:void 0}_shouldShowResume(t,e){if(!t.entities.reset_override_button)return!1;const s=this._config?.show_resume??"auto";return"never"!==s&&("always"===s||!!this._manualOverrideOn(t)||"custom_position"===_e(e))}_command(t,e){t&&this.hass.callService("cover",e,{entity_id:t})}_resume(t){const e=t.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_tapActionConfig(){const t=this._config?.tap_action;if("string"!=typeof t)return t}_isFullyInert(t){return!!(t=>!!t&&"none"===t.action)(this._tapActionConfig())&&!xe(t.hold_action)&&!xe(t.double_tap_action)}_fireAction(t){if(!this._config||!this.hass)return;const e=this._tapActionConfig();if("tap"===t&&void 0===e)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const s=this._resolvedCoverFromState();((t,e,s,i)=>{let o;"double_tap"===i&&s.double_tap_action?o=s.double_tap_action:"hold"===i&&s.hold_action?o=s.hold_action:"tap"===i&&s.tap_action&&(o=s.tap_action),((t,e,s,i)=>{if(i||(i={action:"more-info"}),!i.confirmation||i.confirmation.exemptions&&i.confirmation.exemptions.some(t=>t.user===e.user.id)||(we("warning"),confirm(i.confirmation.text||`Are you sure you want to ${i.action}?`)))switch(i.action){case"more-info":(s.entity||s.camera_image)&&$e(t,"hass-more-info",{entityId:s.entity?s.entity:s.camera_image});break;case"navigate":i.navigation_path&&((t,e,s=!1)=>{s?history.replaceState(null,"",e):history.pushState(null,"",e),$e(window,"location-changed",{replace:s})})(0,i.navigation_path);break;case"url":i.url_path&&window.open(i.url_path);break;case"toggle":s.entity&&(((t,e)=>{((t,e,s=!0)=>{const i=function(t){return t.substr(0,t.indexOf("."))}(e),o="group"===i?"homeassistant":i;let r;switch(i){case"lock":r=s?"unlock":"lock";break;case"cover":r=s?"open_cover":"close_cover";break;default:r=s?"turn_on":"turn_off"}t.callService(o,r,{entity_id:e})})(t,e,be.includes(t.states[e].state))})(e,s.entity),we("success"));break;case"call-service":{if(!i.service)return void we("failure");const[t,s]=i.service.split(".",2);e.callService(t,s,i.service_data,i.target),we("success");break}case"fire-dom-event":$e(t,"ll-custom",i)}})(t,e,s,o)})(this,this.hass,{entity:s,tap_action:e,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},t)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const t=Mt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return t?.managed_covers[0]}_stop(t){t.stopPropagation()}};De.styles=n`
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
    .tile-body.two-line {
      grid-template-columns: 24px 3rem auto minmax(0, 1fr) auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label    label    label label'
        'icon position controls badge resume';
      row-gap: 4px;
    }
    .tile-body.two-line.has-summary .label {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }
    .tile-body.two-line.has-summary .label .title {
      flex: 1 1 auto;
      min-width: 0;
    }
    .tile-body.two-line.has-summary .label .inline-summary {
      flex: 0 1 auto;
      text-align: right;
    }
    .tile-body[role='group'] {
      cursor: default;
    }
    .cover-icon {
      grid-area: icon;
      --mdc-icon-size: 22px;
      color: var(--primary-text-color);
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
  `,t([gt({attribute:!1})],De.prototype,"hass",void 0),t([_t()],De.prototype,"_config",void 0),t([_t()],De.prototype,"_registry",void 0),t([_t()],De.prototype,"_registryError",void 0),t([_t()],De.prototype,"_dialogOpen",void 0),De=t([ht($t)],De),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===$t)||window.customCards.push({type:$t,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Ue=[{key:"sky",label:"Sky compass",description:"Sun vs. window FOV, polar plot"},{key:"elevation",label:"Sun today",description:"Elevation-vs-time chart with FOV band and current-time cursor"},{key:"decision",label:"Decision strip",description:"All 10 pipeline handlers with the winning row highlighted"},{key:"covers",label:"Cover positions",description:"Per-cover live vs. target bars; click to set position"},{key:"overrides",label:"Overrides panel",description:"Manual, force, motion tiles + reset button"},{key:"climate",label:"Climate panel",description:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)"}],Le=Ue.map(t=>t.key);let He=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Pe(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id})}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??Le}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_onEntryChange(t){const e=t.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:e})}_onSectionToggle(t,e){const s=new Set(this._currentSections);e?s.add(t):s.delete(t);const i=Ue.map(t=>t.key).filter(t=>s.has(t));this._emit({...this._config??{type:"",entry_id:""},show_sections:i})}_onCompactToggle(t){this._emit({...this._config??{type:"",entry_id:""},compact:t})}_onVersionToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_version:t})}_onCompassStatsToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:t})}_onCompassLegendToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:t})}_onMoonToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_moon:t})}_onHideInactiveToggle(t){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:t})}_onNorthOffsetChange(t){const e=parseFloat(t.target.value),s=Number.isFinite(e)?e:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:s})}_onControlToggle(t,e){const s=this._config??{type:"",entry_id:""};this._emit({...s,controls:{...s.controls,[t]:e}})}render(){if(!this._config)return G;const t=new Set(this._currentSections);return W`
      <div class="form">
        <div class="section">
          <label class="field-label">Adaptive Cover Pro instance</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">Sections</label>
          <div class="hint">Toggle which parts of the card are shown.</div>
          ${Ue.map(e=>W`
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
    `}_renderEntryPicker(){return this._entriesError?W`
        <div class="error">Failed to load config entries: ${this._entriesError}</div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder="Enter config entry ID manually"
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?W`
        <div class="error">
          No Adaptive Cover Pro config entries found. Add an instance under
          <code>Settings → Devices &amp; Services</code>, then come back.
        </div>
      `:W`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(t=>t.entry_id===this._config.entry_id)?W`<option value=${this._config.entry_id}>
              (unknown: ${this._config.entry_id})
            </option>`:G}
        ${this._entries.map(t=>W`
            <option value=${t.entry_id} ?selected=${t.entry_id===this._config?.entry_id}>
              ${t.title}
            </option>
          `)}
      </select>
    `:W`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};He.styles=n`
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
  `,t([gt({attribute:!1})],He.prototype,"hass",void 0),t([_t()],He.prototype,"_config",void 0),t([_t()],He.prototype,"_entries",void 0),t([_t()],He.prototype,"_entriesError",void 0),He=t([ht(ft)],He);const je=[{key:"compact",label:"Compact mode",description:"Smaller SVG, legend hidden.",defaultOn:!1},{key:"show_legend",label:"Legend",description:"Color swatches + entry labels below compass.",defaultOn:!0},{key:"show_stats",label:"Stats",description:"Sun + per-window numeric rows.",defaultOn:!0},{key:"show_moon",label:"Moon",description:"Render moon position and phase.",defaultOn:!1},{key:"show_cardinals",label:"Cardinal labels",description:"N/E/S/W letters around the compass.",defaultOn:!0},{key:"show_blind_spot",label:"Blind spots",description:"Hatched wedges for each window’s blind range.",defaultOn:!0},{key:"show_sun_path",label:"Sun path",description:"Today’s sun arc across the sky.",defaultOn:!0},{key:"show_sunrise_sunset",label:"Sunrise / sunset markers",description:"Small dots at rise and set azimuths.",defaultOn:!0},{key:"show_cover_fill",label:"Cover closure fill",description:"Inner wedge showing how closed each cover is.",defaultOn:!0},{key:"show_window_arrow",label:"Window-normal arrow",description:"Line from center toward each window’s azimuth.",defaultOn:!0}];let Be=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Pe(this.hass).then(t=>{this._entries=t,this._entriesError=null}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${yt}`,entry_ids:[]}}_trimColors(t){let e=-1;for(let s=0;s<t.length;s++)t[s]&&(e=s);if(!(e<0))return t.slice(0,e+1)}_emitWithColors(t,e,s){const i=this._trimColors(e),{cover_colors:o,...r}=t,n=i?{...r,...s,cover_colors:i}:{...r,...s};this._emit(n)}_onCoverColorChange(t,e){const s=this._baseConfig(),i=[...s.cover_colors??[]];for(;i.length<=t;)i.push(null);i[t]=e,this._emitWithColors(s,i)}_onCoverColorReset(t){const e=this._baseConfig(),s=[...e.cover_colors??[]];t<s.length&&(s[t]=null),this._emitWithColors(e,s)}_onEntryToggle(t,e){const s=this._baseConfig(),i=new Set(s.entry_ids);e?i.add(t):i.delete(t);const o=(this._entries??[]).map(t=>t.entry_id).filter(t=>i.has(t)),r=s.cover_colors??[],n=o.map(t=>{const e=s.entry_ids.indexOf(t);return e>=0?r[e]??null:null});this._emitWithColors(s,n,{entry_ids:o})}_onToggle(t,e){this._emit({...this._baseConfig(),[t]:e})}_onNorthOffsetChange(t){const e=parseFloat(t.target.value),s=Number.isFinite(e)?e:0;this._emit({...this._baseConfig(),north_offset:s})}_onTitleChange(t){const e=t.target.value,s=this._baseConfig();if(e)this._emit({...s,title:e});else{const{title:t,...e}=s;this._emit(e)}}render(){if(!this._config)return G;const t=new Set(this._config.entry_ids);return W`
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

        ${this._config.entry_ids.length>0?W`
              <div class="section">
                <label class="field-label">Cover colors</label>
                <div class="hint">Override the default palette color for each overlay.</div>
                ${this._config.entry_ids.map((t,e)=>{const s=this._config.cover_colors?.[e]??null,i=s??he(e),o=this._entries?.find(e=>e.entry_id===t);return W`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${i}
                        @change=${t=>this._onCoverColorChange(e,t.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${o?.title??t}</span>
                        <span class="toggle-desc">${s||"default"}</span>
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!s}
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
          ${je.map(t=>W`
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
    `}_renderEntryPicker(t){return this._entriesError?W`<div class="error">Failed to load config entries: ${this._entriesError}</div>`:this._entries?0===this._entries.length?W`
        <div class="error">
          No Adaptive Cover Pro config entries found. Add an instance under
          <code>Settings → Devices &amp; Services</code>, then come back.
        </div>
      `:W`
      <div class="entry-list">
        ${this._entries.map(e=>W`
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
    `:W`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};Be.styles=n`
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
  `,t([gt({attribute:!1})],Be.prototype,"hass",void 0),t([_t()],Be.prototype,"_config",void 0),t([_t()],Be.prototype,"_entries",void 0),t([_t()],Be.prototype,"_entriesError",void 0),Be=t([ht(bt)],Be);let We=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(t){if(!t||!Array.isArray(t.entry_ids)||0===t.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(t.entry_ids.some(t=>"string"!=typeof t||0===t.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");this._config={...t,entry_ids:[...t.entry_ids]}}getCardSize(){return 4}static async getConfigElement(){return document.createElement(bt)}static getStubConfig(){return{type:`custom:${yt}`,entry_ids:[]}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Lt(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Ut(this.hass).then(t=>{this._registry=t,this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return G;if(null===this._registry)return W`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?`Registry fetch failed: ${this._registryError}`:"Loading Adaptive Cover Pro registry…"}
          </p>
        </div>
      </ha-card>`;const t=[],e=[];for(const s of this._config.entry_ids){const i=Mt(this.hass,{type:this._config.type,entry_id:s},this._registry);i?t.push(i):e.push(s)}if(0===t.length)return W`<ha-card>
        <div class="empty">
          <p><strong>No matching Adaptive Cover Pro entities</strong></p>
          <p class="dim">Configured entries: ${this._config.entry_ids.join(", ")}</p>
        </div>
      </ha-card>`;const s=this._config;return W`
      <ha-card>
        ${s.title?W`<div class="card-header">${s.title}</div>`:G}
        <acp-sky-compass
          .hass=${this.hass}
          .discovered_list=${t}
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
          .northOffsetDeg=${Dt(s.north_offset??0)}
        ></acp-sky-compass>
        ${e.length>0?W`<div class="warn dim">Entries not found: ${e.join(", ")}</div>`:G}
      </ha-card>
    `}};We.styles=n`
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
  `,t([gt({attribute:!1})],We.prototype,"hass",void 0),t([_t()],We.prototype,"_config",void 0),t([_t()],We.prototype,"_registry",void 0),t([_t()],We.prototype,"_registryError",void 0),We=t([ht(yt)],We),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===yt)||window.customCards.push({type:yt,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Ve=["sky","elevation","decision","covers","overrides","climate"];let qe=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let t=null,e=null;return(s,i,o)=>{const r=i.entry_id??"";return null!==t&&t.registry===o&&t.hass===s&&t.entryId===r||(t={registry:o,hass:s,entryId:r},e=Mt(s,i,o)),e}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(t){if(!t?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...t},null===this._registry){const e=jt.get(t.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(ft)}static getStubConfig(){return{type:`custom:${vt}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(t){null!==this._registry&&this._config&&this.hass&&(t.has("hass")||t.has("_registry")||t.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Lt(this.hass,t=>{const e=new Set(Wt(this._registry??[],this._config?.entry_id??"").map(t=>t.entity_id));(function(t,e){return"create"===t.action||e.has(t.entity_id)})(t,e)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Ut(this.hass).then(t=>{const e=this._config?.entry_id;if(e){const s=Wt(t,e);(null===this._registry||function(t,e){if(t.length!==e.length)return!0;const s=new Map(t.map(t=>[t.entity_id,Bt(t)]));for(const t of e)if(s.get(t.entity_id)!==Bt(t))return!0;return!1}(Wt(this._registry,e),s))&&(this._registry=t,jt.set(e,s))}else this._registry=t;this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const t=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=t);const e=t-this._debounceFirstAt,s=this._DEBOUNCE_MAX-e,i=Math.min(this._DEBOUNCE_DELAY,s);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),i<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},i)}get _sections(){return this._config?.show_sections??Ve}_renderHeader(t,e){const s=St[t.cover_type]??"mdi:window-shutter",i=t.entities.integration_enabled_switch,o=t.entities.automatic_control_switch,r=!i||"on"===this.hass.states[i]?.state,n=!o||"on"===this.hass.states[o]?.state;return W`
      <div class="header">
        <ha-icon .icon=${s}></ha-icon>
        <span class="title">${t.entry_title}</span>
        <span class="spacer"></span>
        ${i?W`<acp-header-pill
              .on=${r}
              .readonly=${!e.integration_enabled}
              .label=${r?"ON":"OFF"}
              title="Integration Enabled"
              @pill-click=${()=>this._toggle(i)}
            ></acp-header-pill>`:G}
        ${o?W`<acp-header-pill
              .on=${n}
              .readonly=${!e.automatic_control}
              label="Auto"
              title="Automatic Control"
              @pill-click=${()=>this._toggle(o)}
            ></acp-header-pill>`:G}
      </div>
    `}_toggle(t){const e=t.split(".")[0];this.hass.callService(e,"toggle",{entity_id:t})}_renderLoading(){return W`
      <ha-card>
        <div class="empty">
          <p class="dim">Loading Adaptive Cover Pro registry…</p>
        </div>
      </ha-card>
    `}_renderEmpty(t){const e=this._config.entry_id,s=this._registry?.length??0,i=this._registry?.filter(t=>t.config_entry_id===e&&"adaptive_cover_pro"===t.platform).length;return W`
      <ha-card>
        <div class="empty">
          <p><strong>No Adaptive Cover Pro entities found</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${e}</code></p>
          <ul class="diag">
            <li>Reason: <code>${t}</code></li>
            <li>Registry entries loaded: <code>${s}</code></li>
            <li>ACP entities matching entry_id: <code>${i??"—"}</code></li>
            ${this._registryError?W`<li>Registry fetch error: <code>${this._registryError}</code></li>`:G}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return G;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const t=this._discovered;if(!t)return this._renderEmpty("no matching entities after unique_id lookup");const e=(s=this._config,{...zt,...s?.controls});var s;const i=this._sections;return W`
      <ha-card>
        ${this._renderHeader(t,e)}
        <div class="body ${this._config.compact?"compact":""}">
          ${i.includes("sky")?W`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${[t]}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .northOffsetDeg=${Dt(this._config.north_offset??0)}
              ></acp-sky-compass>`:G}
          ${i.includes("elevation")?W`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:G}
          ${i.includes("decision")?W`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                ?show-summary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:G}
          ${i.includes("covers")?W`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:G}
          ${i.includes("overrides")?W`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                .resetEnabled=${e.reset_manual_override}
              ></acp-overrides-panel>`:G}
          ${i.includes("climate")?W`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:G}
        </div>
        ${this._config.show_version?W`<div class="footer dim">adaptive-cover-pro-card v${mt}</div>`:G}
      </ha-card>
    `}};qe.styles=n`
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
  `,t([gt({attribute:!1})],qe.prototype,"hass",void 0),t([_t()],qe.prototype,"_config",void 0),t([_t()],qe.prototype,"_registry",void 0),t([_t()],qe.prototype,"_registryError",void 0),t([_t()],qe.prototype,"_discovered",void 0),qe=t([ht(vt)],qe),window.customCards=window.customCards||[],window.customCards.push({type:vt,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${mt} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{qe as AdaptiveCoverProCard};
