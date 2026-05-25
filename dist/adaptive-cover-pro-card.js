/*! adaptive-cover-pro-card v2.0.0-beta.3 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function t(t,e,s,o){var i,n=arguments.length,r=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,s):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(r=(n<3?i(r):n>3?i(e,s,r):i(e,s))||r);return n>3&&r&&Object.defineProperty(e,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=i.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&i.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n(s,t,o)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",v=_.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!l(t,e),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),o=this.getPropertyDescriptor(t,s,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){const{get:o,set:i}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const n=o?.call(this);i?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(s)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of o){const o=document.createElement("style"),i=e.litNonce;void 0!==i&&o.setAttribute("nonce",i),o.textContent=s.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(void 0!==o&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==i?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){const s=this.constructor,o=s._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=s.getPropertyOptions(o),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o;const n=i.fromAttribute(e,t.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(t,e,s,o=!1,i){if(void 0!==t){const n=this.constructor;if(!1===o&&(i=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??b)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:i},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==i||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,s,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,v?.({ReactiveElement:$}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=t=>t,S=x.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+E,z=`<${O}>`,P=document,T=()=>P.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,I="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,D=/>/g,L=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,W=/"/g,j=/^(?:script|style|textarea|title)$/i,U=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),V=U(1),B=U(2),K=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),G=new WeakMap,Z=P.createTreeWalker(P,129);function Y(t,e){if(!F(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const X=(t,e)=>{const s=t.length-1,o=[];let i,n=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===N?"!--"===l[1]?r=R:void 0!==l[1]?r=D:void 0!==l[2]?(j.test(l[2])&&(i=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=i??N,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?L:'"'===l[3]?W:H):r===W||r===H?r=L:r===R||r===D?r=N:(r=L,i=void 0);const h=r===L&&t[e+1].startsWith("/>")?" ":"";n+=r===N?s+z:c>=0?(o.push(a),s.slice(0,c)+A+s.slice(c)+E+h):s+E+(-2===c?e:h)}return[Y(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class J{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let i=0,n=0;const r=t.length-1,a=this.parts,[l,c]=X(t,e);if(this.el=J.createElement(l,s),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=Z.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(A)){const e=c[n++],s=o.getAttribute(t).split(E),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:i,name:r[2],strings:s,ctor:"."===r[1]?ot:"?"===r[1]?it:"@"===r[1]?nt:st}),o.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:i}),o.removeAttribute(t));if(j.test(o.tagName)){const t=o.textContent.split(E),e=t.length-1;if(e>0){o.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)o.append(t[s],T()),Z.nextNode(),a.push({type:2,index:++i});o.append(t[e],T())}}}else if(8===o.nodeType)if(o.data===O)a.push({type:2,index:i});else{let t=-1;for(;-1!==(t=o.data.indexOf(E,t+1));)a.push({type:7,index:i}),t+=E.length-1}i++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,o){if(e===K)return e;let i=void 0!==o?s._$Co?.[o]:s._$Cl;const n=M(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),void 0===n?i=void 0:(i=new n(t),i._$AT(t,s,o)),void 0!==o?(s._$Co??=[])[o]=i:s._$Cl=i),void 0!==i&&(e=Q(t,i._$AS(t,e.values),i,o)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??P).importNode(e,!0);Z.currentNode=o;let i=Z.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new et(i,i.nextSibling,this,t):1===a.type?e=new a.ctor(i,a.name,a.strings,this,t):6===a.type&&(e=new rt(i,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(i=Z.nextNode(),n++)}return Z.currentNode=P,o}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),M(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==K&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>F(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(Y(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new tt(o,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new J(t)),e}k(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,o=0;for(const i of t)o===e.length?e.push(s=new et(this.O(T()),this.O(T()),this,this.options)):s=e[o],s._$AI(i),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,i){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(t,e=this,s,o){const i=this.strings;let n=!1;if(void 0===i)t=Q(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==K,n&&(this._$AH=t);else{const o=t;let r,a;for(t=i[0],r=0;r<i.length-1;r++)a=Q(this,o[s+r],e,r),a===K&&(a=this._$AH[r]),n||=!M(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+i[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ot extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class it extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class nt extends st{constructor(t,e,s,o,i){super(t,e,s,o,i),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??q)===K)return;const s=this._$AH,o=t===q&&s!==q||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==q&&(s===q||o);o&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=x.litHtmlPolyfillSupport;at?.(J,et),(x.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;let ct=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const o=s?.renderBefore??e;let i=o._$litPart$;if(void 0===i){const t=s?.renderBefore??null;o._$litPart$=i=new et(e.insertBefore(T(),t),t,void 0,s??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}};ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ut=(t=pt,e,s)=>{const{kind:o,metadata:i}=s;let n=globalThis.litPropertyMetadata.get(i);if(void 0===n&&globalThis.litPropertyMetadata.set(i,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===o){const{name:o}=s;return{set(s){const i=e.get.call(this);e.set.call(this,s),this.requestUpdate(o,i,t,!0,s)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=s;return function(s){const i=this[o];e.call(this,s),this.requestUpdate(o,i,t,!0,s)}}throw Error("Unsupported decorator location: "+o)};function _t(t){return(e,s)=>"object"==typeof s?ut(t,e,s):((t,e,s)=>{const o=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),o?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function gt(t){return _t({...t,state:!0,attribute:!1})}const mt="2.0.0-beta.3",vt="adaptive-cover-pro-card",ft="adaptive-cover-pro-card-editor",yt="adaptive-cover-pro-sky-compass-card",bt="adaptive-cover-pro-sky-compass-card-editor",wt="adaptive-cover-pro-tile-card",$t="adaptive-cover-pro-tile-card-editor",xt="adaptive_cover_pro",kt=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default"],St={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},Ct={force:"handler.force",weather:"handler.weather",manual:"handler.manual",custom_position:"handler.custom_position",motion:"handler.motion",cloud:"handler.cloud",climate:"handler.climate",glare_zone:"handler.glare_zone",solar:"handler.solar",default:"handler.default"},At={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},Et={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open"},Ot={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds"},zt={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion"},Pt={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Sun tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Motion",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"}},Tt={auto:"badge.auto",manual:"badge.manual",force:"badge.force",weather:"badge.weather",glare_zone:"badge.glare_zone",climate:"badge.climate",cloud:"badge.cloud",custom_position:"badge.custom_position",solar:"badge.solar",motion:"badge.motion",off:"badge.off"},Mt={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Ft={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"},It={en:{handler:{force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Sun protection",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Sun tracking",motion:"Motion",off:"Off"},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window field of view",fov_exit:"Sun leaves window field of view"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks."},dialog:{configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"floor",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Motion",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Motion",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"timeout {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance"},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in FOV",in_fov:"in FOV",none:"—",sun:"Sun",moon:"Moon",sun_hitting:"Sun (hitting window)",sun_in_fov_invalid:"Sun (in FOV, not valid)",sun_outside_fov:"Sun (outside FOV)",window_fov:"Window FOV",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_closed:"Cover closed",window_normal:"Window normal",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"FOV {left} left / {right} right{elev}",window_normal_tooltip:"Window normal: {bearing}",cover_extended:"Cover extended: {pct}%",cover_closed_tooltip:"Cover closed: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",click_to_set:"Click to set position",target_tooltip:"Target {pct}%"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor"},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Motion timeout pending",motion_detected:"Motion detected",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",resume:"Resume",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found."},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"FOV: {from} → {to}",no_fov_today:"Sun does not enter FOV today",placeholder:"Sun elevation chart unavailable."},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window FOV, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with FOV band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, motion tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers.",show_version_label:"Show version tag",show_version_desc:"Display card version at the bottom."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",show_compass:"Show sun compass in dialog",show_motion_icon:"Show motion indicator",show_resume:"Resume button",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",resume_option_auto:"Auto (manual override or custom position)",resume_option_always:"Always (when reset button is available)",resume_option_never:"Never",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth."}}},fr:{handler:{force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Sun protection",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Sun tracking",motion:"Motion",off:"Off"},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window field of view",fov_exit:"Sun leaves window field of view"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks."},dialog:{configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"floor",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Motion",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Motion",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"timeout {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance"},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in FOV",in_fov:"in FOV",none:"—",sun:"Sun",moon:"Moon",sun_hitting:"Sun (hitting window)",sun_in_fov_invalid:"Sun (in FOV, not valid)",sun_outside_fov:"Sun (outside FOV)",window_fov:"Window FOV",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_closed:"Cover closed",window_normal:"Window normal",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"FOV {left} left / {right} right{elev}",window_normal_tooltip:"Window normal: {bearing}",cover_extended:"Cover extended: {pct}%",cover_closed_tooltip:"Cover closed: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",click_to_set:"Click to set position",target_tooltip:"Target {pct}%"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor"},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Motion timeout pending",motion_detected:"Motion detected",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",resume:"Resume",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found."},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"FOV: {from} → {to}",no_fov_today:"Sun does not enter FOV today",placeholder:"Sun elevation chart unavailable."},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window FOV, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with FOV band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, motion tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers.",show_version_label:"Show version tag",show_version_desc:"Display card version at the bottom."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",show_compass:"Show sun compass in dialog",show_motion_icon:"Show motion indicator",show_resume:"Resume button",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",resume_option_auto:"Auto (manual override or custom position)",resume_option_always:"Always (when reset button is available)",resume_option_never:"Never",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth."}}}};function Nt(t,e){const s=e.split(".");let o=t;for(const t of s){if("object"!=typeof o||null===o)return;o=o[t]}return"string"==typeof o?o:void 0}function Rt(t,e){return e?t.replace(/\{(\w+)\}/g,(t,s)=>Object.prototype.hasOwnProperty.call(e,s)?String(e[s]):t):t}function Dt(t,e,s){const o=function(t){const e=(t?.locale?.language??t?.language??"en").toLowerCase().split("-")[0];return e in It?e:"en"}(e),i=Nt(It[o],t);if(void 0!==i)return Rt(i,s);if("en"!==o){const e=Nt(It.en,t);if(void 0!==e)return Rt(e,s)}return t}function Lt(t,e,s){const o=e.entry_id;if(!o)return null;const i={},n=`${o}_`;let r,a=!1;for(const t of s){if(t.config_entry_id!==o)continue;if(t.platform!==xt)continue;if(a=!0,!r&&t.device_id&&(r=t.device_id),!t.unique_id.startsWith(n))continue;const e=t.unique_id.slice(n.length),s=t.entity_id.split(".")[0],l=Ft[`${s}:${e}`];l&&(i[l]=t.entity_id)}if(!a||0===Object.keys(i).length)return null;const l=t;let c=o;if(l.devices)for(const t of Object.values(l.devices))if(t.config_entries?.includes(o)){c=t.name_by_user??t.name??o;break}const d=[],h=i.target_position_sensor;if(h){const e=t.states[h]?.attributes?.actual_positions;e&&d.push(...Object.keys(e))}let p="cover_blind";const u=i.control_status_sensor;if(u){const e=t.states[u]?.attributes;e?.cover_type&&(p=e.cover_type)}return{entry_id:o,entry_title:c,cover_type:p,entities:i,managed_covers:d,device_id:r}}function Ht(t,e,s=0){const o=(t-90+s)*Math.PI/180;return{x:e*Math.cos(o),y:e*Math.sin(o)}}function Wt(t){return 1-Math.max(0,Math.min(90,t))/90}function jt(t,e,s,o=0,i=0){const n=t=>(t%360+360)%360,r=n(t),a=n(e);let l=a-r;l<0&&(l+=360);const c=l>180?1:0,d=Ht(r,s,i),h=Ht(a,s,i);if(o<=0)return`M 0 0 L ${d.x} ${d.y} A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y} Z`;const p=Ht(a,o,i),u=Ht(r,o,i);return[`M ${d.x} ${d.y}`,`A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y}`,`L ${p.x} ${p.y}`,`A ${o} ${o} 0 ${c} 0 ${u.x} ${u.y}`,"Z"].join(" ")}function Ut(t,e,s=0){return Ht(t,Wt(e),s)}function Vt(t){return(t%360+360)%360}async function Bt(t){return t.callWS({type:"config/entity_registry/list"})}function Kt(t,e){let s=null,o=!1;return t.connection.subscribeEvents(t=>e(t.data),"entity_registry_updated").then(t=>{o?t():s=t}).catch(()=>{}),()=>{o=!0,s&&s()}}function qt(t){return`acp-card:registry:v1:${t}`}const Gt={get(t){try{const e=localStorage.getItem(qt(t));if(!e)return null;const s=JSON.parse(e);return 1!==s.schemaVersion?null:s}catch{return null}},set(t,e){try{const s={schemaVersion:1,cardVersion:mt,fetchedAt:Date.now(),entries:e};localStorage.setItem(qt(t),JSON.stringify(s))}catch{}},invalidate(t){try{localStorage.removeItem(qt(t))}catch{}},clear(){try{const t="acp-card:registry:v1:",e=[];for(let s=0;s<localStorage.length;s++){const o=localStorage.key(s);o?.startsWith(t)&&e.push(o)}e.forEach(t=>localStorage.removeItem(t))}catch{}}};function Zt(t){return`${t.entity_id}|${t.unique_id}|${t.platform}|${t.config_entry_id??""}`}function Yt(t,e,s){return t.filter(t=>t.config_entry_id===e&&void 0===s)}let Xt=class extends ct{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return V`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":q}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};Xt.styles=r`
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
  `,t([_t({type:Boolean})],Xt.prototype,"on",void 0),t([_t({type:Boolean})],Xt.prototype,"readonly",void 0),t([_t({type:String})],Xt.prototype,"label",void 0),t([_t({type:String})],Xt.prototype,"title",void 0),Xt=t([ht("acp-header-pill")],Xt);class Jt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Qt=(te=class extends Jt{constructor(t){if(super(t),1!==t.type||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const o=!!e[t];o===this.st.has(t)||this.nt?.has(t)||(o?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return K}},(...t)=>({_$litDirective$:te,values:t}));var te;function ee(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var se,oe,ie={exports:{}},ne=(se||(se=1,oe=ie,function(){var t=Math.PI,e=Math.sin,s=Math.cos,o=Math.tan,i=Math.asin,n=Math.atan2,r=Math.acos,a=t/180,l=864e5,c=2440588,d=2451545;function h(t){return new Date((t+.5-c)*l)}function p(t){return function(t){return t.valueOf()/l-.5+c}(t)-d}var u=23.4397*a;function _(t,i){return n(e(t)*s(u)-o(i)*e(u),s(t))}function g(t,o){return i(e(o)*s(u)+s(o)*e(u)*e(t))}function m(t,i,r){return n(e(t),s(t)*e(i)-o(r)*s(i))}function v(t,o,n){return i(e(o)*e(n)+s(o)*s(n)*s(t))}function f(t,e){return a*(280.16+360.9856235*t)-e}function y(t){return a*(357.5291+.98560028*t)}function b(s){return s+a*(1.9148*e(s)+.02*e(2*s)+3e-4*e(3*s))+102.9372*a+t}function w(t){var e=b(y(t));return{dec:g(e,0),ra:_(e,0)}}var $={getPosition:function(t,e,s){var o=a*-s,i=a*e,n=p(t),r=w(n),l=f(n,o)-r.ra;return{azimuth:m(l,i,r.dec),altitude:v(l,i,r.dec)}}},x=$.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];$.addTime=function(t,e,s){x.push([t,e,s])};var k=9e-4;function S(e,s,o){return k+(e+s)/(2*t)+o}function C(t,s,o){return d+t+.0053*e(s)-.0069*e(2*o)}function A(t,o,i,n,a,l,c){var d=function(t,o,i){return r((e(t)-e(o)*e(i))/(s(o)*s(i)))}(t,i,n);return C(S(d,o,a),l,c)}function E(t){var o=a*(134.963+13.064993*t),i=a*(93.272+13.22935*t),n=a*(218.316+13.176396*t)+6.289*a*e(o),r=5.128*a*e(i),l=385001-20905*s(o);return{ra:_(n,r),dec:g(n,r),dist:l}}function O(t,e){return new Date(t.valueOf()+e*l/24)}$.getTimes=function(e,s,o,i){var n,r,l,c,d,u=a*-o,_=a*s,m=function(t){return-2.076*Math.sqrt(t)/60}(i=i||0),v=function(e,s){return Math.round(e-k-s/(2*t))}(p(e),u),f=S(0,u,v),w=y(f),$=b(w),E=g($,0),O=C(f,w,$),z={solarNoon:h(O),nadir:h(O-.5)};for(n=0,r=x.length;n<r;n+=1)d=O-((c=A(((l=x[n])[0]+m)*a,u,_,E,v,w,$))-O),z[l[1]]=h(d),z[l[2]]=h(c);return z},$.getMoonPosition=function(t,i,r){var l=a*-r,c=a*i,d=p(t),h=E(d),u=f(d,l)-h.ra,_=v(u,c,h.dec),g=n(e(u),o(c)*s(h.dec)-e(h.dec)*s(u));return _+=function(t){return t<0&&(t=0),2967e-7/Math.tan(t+.00312536/(t+.08901179))}(_),{azimuth:m(u,c,h.dec),altitude:_,distance:h.dist,parallacticAngle:g}},$.getMoonIllumination=function(t){var o=p(t||new Date),i=w(o),a=E(o),l=149598e3,c=r(e(i.dec)*e(a.dec)+s(i.dec)*s(a.dec)*s(i.ra-a.ra)),d=n(l*e(c),a.dist-l*s(c)),h=n(s(i.dec)*e(i.ra-a.ra),e(i.dec)*s(a.dec)-s(i.dec)*e(a.dec)*s(i.ra-a.ra));return{fraction:(1+s(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},$.getMoonTimes=function(t,e,s,o){var i=new Date(t);o?i.setUTCHours(0,0,0,0):i.setHours(0,0,0,0);for(var n,r,l,c,d,h,p,u,_,g,m,v,f,y=.133*a,b=$.getMoonPosition(i,e,s).altitude-y,w=1;w<=24&&(n=$.getMoonPosition(O(i,w),e,s).altitude-y,u=((d=(b+(r=$.getMoonPosition(O(i,w+1),e,s).altitude-y))/2-n)*(p=-(h=(r-b)/2)/(2*d))+h)*p+n,g=0,(_=h*h-4*d*n)>=0&&(m=p-(f=Math.sqrt(_)/(2*Math.abs(d))),v=p+f,Math.abs(m)<=1&&g++,Math.abs(v)<=1&&g++,m<-1&&(m=v)),1===g?b<0?l=w+m:c=w+m:2===g&&(l=w+(u<0?v:m),c=w+(u<0?m:v)),!l||!c);w+=2)b=r;var x={};return l&&(x.rise=O(i,l)),c&&(x.set=O(i,c)),l||c||(x[u>0?"alwaysUp":"alwaysDown"]=!0),x},oe.exports=$}()),ie.exports),re=ee(ne);function ae(t,e,s,o=10){const i=[],n=s.getTime()+864e5;for(let r=s.getTime();r<=n;r+=60*o*1e3){const s=new Date(r),o=re.getPosition(s,t,e);i.push({t:s,elevation:180*o.altitude/Math.PI,azimuth:((180*o.azimuth/Math.PI+180)%360+360)%360})}return i}function le(t=new Date){const e=new Date(t);return e.setHours(0,0,0,0),e}function ce(t,e,s,o){const i=((e-s)%360+360)%360;return((t-i)%360+360)%360<=((((e+o)%360+360)%360-i)%360+360)%360}function de(t,e,s=new Date){const o=re.getMoonPosition(s,t,e),i=re.getMoonIllumination(s);return{azimuth:((180*o.azimuth/Math.PI+180)%360+360)%360,elevation:180*o.altitude/Math.PI,phase:i.phase,fraction:i.fraction,phaseName:he(i.phase)}}function he(t){return t<.0625||t>=.9375?"New Moon":t<.1875?"Waxing Crescent":t<.3125?"First Quarter":t<.4375?"Waxing Gibbous":t<.5625?"Full Moon":t<.6875?"Waning Gibbous":t<.8125?"Last Quarter":"Waning Crescent"}function pe(t){return null==t||Number.isNaN(t)?"—":`${Math.round(t)}%`}function ue(t){return null==t||Number.isNaN(t)?"—":`${t.toFixed(1)}°`}function _e(t){if(!t)return"—";const e=new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function ge(t,e){if(!t)return"—";const s=new Date(t).getTime();if(Number.isNaN(s))return"—";const o=Math.round((s-Date.now())/1e3);return o<=0?e?Dt("formatters.expired",e):"expired":function(t){if(null==t||Number.isNaN(t))return"—";const e=Math.max(0,Math.round(t));if(e<60)return`${e}s`;const s=Math.floor(e/60);return s<60?`${s}m ${e%60}s`:`${Math.floor(s/60)}h ${s%60}m`}(o)}const me=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function ve(t){const e=me.length;return me[(t%e+e)%e]}const fe=110;let ye=class extends ct{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set}_toggleEntry(t){const e=new Set(this._hiddenEntries);e.has(t)?e.delete(t):e.add(t),this._hiddenEntries=e}_sunFor(t){const e=t.entities.sun_sensor;if(!e)return null;const s=this.hass.states[e];if(!s)return null;const o=parseFloat(s.state);return Number.isNaN(o)?null:{...s.attributes,window_azimuth:s.attributes.window_azimuth}}_coverPositionFor(t){const e=t.entities.target_position_sensor;if(!e)return null;const s=parseFloat(this.hass.states[e]?.state??"");return Number.isNaN(s)?null:s}_sunInfrontFor(t){const e=t.entities.sun_infront_binary;return!!e&&"on"===this.hass.states[e]?.state}_readActiveAzimuth(t){if(!t)return null;const e=this.hass.states[t];if(!e)return null;if("unavailable"===e.state||"unknown"===e.state)return null;const s=e.attributes.azimuth;return"number"==typeof s&&Number.isFinite(s)?s:null}_buildOverlays(){const t=[];return this.discovered_list.forEach((e,s)=>{const o=this._sunFor(e);if(!o)return;const i=e.entities.sun_sensor,n=parseFloat(this.hass.states[i]?.state??"0"),{color:r,isOverride:a}=(l=this.coverColors?.[s],c=s,"string"==typeof l&&l.length>0?{color:l,isOverride:!0}:{color:ve(c),isOverride:!1});var l,c;t.push({d:e,sun:o,sunAzi:n,sunInfront:this._sunInfrontFor(e),coverPos:this._coverPositionFor(e),coverType:e.cover_type,color:r,isOverride:a,index:s})}),t}render(){if(!this.hass)return q;if(!this.discovered_list||0===this.discovered_list.length)return V`<div class="placeholder">${Dt("compass.placeholder_no_entries",this.hass)}</div>`;const t=this._buildOverlays();if(0===t.length)return V`<div class="placeholder">${Dt("compass.placeholder_no_sun",this.hass)}</div>`;const e=t.filter(t=>!this._hiddenEntries.has(t.d.entry_id)),s=Vt(this.northOffsetDeg),o=t.length>1,i=t[0],n=i.sunAzi,r=i.sun.elevation,a=Ut(n,r,s),l=t.some(t=>t.sun.in_fov),c=t.some(t=>t.sunInfront),d=r<=0,h=!d&&c?"sun valid":!d&&l?"sun in-fov":"sun",{latitude:p,longitude:u}=this.hass.config,_=void 0!==p&&void 0!==u?ae(p,u,le()):[],g=this.showMoon&&void 0!==p&&void 0!==u?de(p,u):null,m=null!==g&&g.elevation>0,v=g?g.phase<.5?-24*g.phase:24*(1-g.phase):0,f=m?Ut(g.azimuth,g.elevation,s):null,y=f?f.x*fe:0,b=f?f.y*fe:0,w=this.showSunPath?_.filter(t=>t.elevation>0).map(t=>{const e=Ut(t.azimuth,t.elevation,s);return`${(e.x*fe).toFixed(1)},${(e.y*fe).toFixed(1)}`}).join(" "):"",{riseAzimuth:$,setAzimuth:x}=this.showSunriseSunset?function(t){let e=-1,s=-1;for(let o=0;o<t.length;o++)t[o].elevation>0&&(-1===e&&(e=o),s=o);return{riseAzimuth:e>=0?t[e].azimuth:null,setAzimuth:s>=0?t[s].azimuth:null}}(_):{riseAzimuth:null,setAzimuth:null},k=null!==$?Ht($,fe,s):null,S=null!==x?Ht(x,fe,s):null,C=Ht(0,124,s),A=Ht(90,124,s),E=Ht(180,124,s),O=Ht(270,124,s),z=Ht(0,fe,s),P=Ht(180,fe,s),T=Ht(90,fe,s),M=Ht(270,fe,s),F=Dt("compass.sun_tooltip",this.hass,{az:ue(n),el:ue(r)}),I=null!==$?Dt("compass.sunrise_tooltip",this.hass,{time:ue($)}):"",N=null!==x?Dt("compass.sunset_tooltip",this.hass,{time:ue(x)}):"",R=null!==g?Dt("compass.moon_tooltip",this.hass,{phase:g.phaseName,pct:Math.round(100*g.fraction)}):"",D=Dt("compass.sun_path_tooltip",this.hass);return V`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${B`
            <defs>
              ${m?B`
                <mask id="moon-phase-mask">
                  <circle cx=${y} cy=${b} r=${6} fill="white"></circle>
                  <circle cx=${y+v} cy=${b} r=${6} fill="black"></circle>
                </mask>
              `:q}
            </defs>

            <circle class="grid" r=${fe}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${fe/3}></circle>
            <line class="grid thin" x1=${z.x} y1=${z.y} x2=${P.x} y2=${P.y}></line>
            <line class="grid thin" x1=${T.x} y1=${T.y} x2=${M.x} y2=${M.y}></line>

            ${e.map(t=>this._renderEntryLayers(t,o,s))}

            ${this.showSunPath&&w?B`<g data-tooltip=${D}><title>${D}</title><polyline class="sun-path" points=${w}></polyline></g>`:q}

            ${this.showSunriseSunset&&k&&null!==$?B`<g data-tooltip=${I}><title>${I}</title><circle class="rise-marker" cx=${k.x} cy=${k.y} r="4"></circle></g>`:q}
            ${this.showSunriseSunset&&S&&null!==x?B`<g data-tooltip=${N}><title>${N}</title><circle class="set-marker" cx=${S.x} cy=${S.y} r="4"></circle></g>`:q}

            ${this.showCardinals?B`
              <text class="cardinal" x=${C.x} y=${C.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${A.x} y=${A.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${O.x} y=${O.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:q}

            ${m?B`
              <g data-tooltip=${R}>
                <title>${R}</title>
                <circle class="moon-outline" cx=${y} cy=${b} r=${6}></circle>
                <circle class="moon-lit" cx=${y} cy=${b} r=${6} mask="url(#moon-phase-mask)"></circle>
              </g>
            `:q}

            <g data-tooltip=${F}>
              <title>${F}</title>
              <circle class=${h} cx=${a.x*fe} cy=${a.y*fe} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(t,o):q}
        ${this.showStats?this._renderStats(t,o):q}
      </div>
    `}_renderEntryLayers(t,e,s=0){const o=Vt(t.sun.window_azimuth),i=Vt(o-t.sun.fov_left),n=Vt(o+t.sun.fov_right),r=this._readActiveAzimuth(t.d.entities.start_sensor),a=this._readActiveAzimuth(t.d.entities.end_sensor),l=null!==r&&null!==a,c=l?Vt(r):i,d=l?Vt(a):n,h=Ht(o,fe,s),{outer:p,inner:u}=(_=t.sun.min_elevation,g=t.sun.max_elevation,m=fe,void 0!==_&&void 0!==g&&_>g?{outer:m,inner:0}:{outer:void 0!==_?m*Wt(_):m,inner:void 0!==g?m*Wt(g):0});var _,g,m;const v="cover_awning"===t.coverType?t.coverPos/100:1-t.coverPos/100,f=null!==t.coverPos?fe*v:null,y=null!==f?Math.min(f,p):null,b=t.sun.blind_spot_range?[Vt((w=o)-($=t.sun.blind_spot_range)[1]),Vt(w-$[0])]:null;var w,$;const x=b?jt(b[0],b[1],fe,0,s):null,k=jt(c,d,p,u,s),S=null!==y&&y>u?jt(c,d,y,u,s):"",C=e?`${t.d.entry_title}: `:"",A=void 0!==t.sun.min_elevation||void 0!==t.sun.max_elevation?Dt("compass.elev_suffix",this.hass,{min:ue(t.sun.min_elevation??0),max:ue(t.sun.max_elevation??90)}):"",E=l?`${C}${Dt("compass.active_sun_arc",this.hass,{from:ue(c),to:ue(d),elev:A})}`:`${C}${Dt("compass.fov_arc",this.hass,{left:ue(t.sun.fov_left),right:ue(t.sun.fov_right),elev:A})}`,O=`${C}${Dt("compass.window_normal_tooltip",this.hass,{bearing:ue(o)})}`,z=null!==t.coverPos?"cover_awning"===t.coverType?`${C}${Dt("compass.cover_extended",this.hass,{pct:t.coverPos})}`:`${C}${Dt("compass.cover_closed_tooltip",this.hass,{pct:t.coverPos})}`:"",P=b?`${C}${Dt("compass.blind_spot",this.hass,{from:ue(b[0]),to:ue(b[1])})}`:"",T=e||t.isOverride,M=T?`fill: ${t.color}; stroke: ${t.color};`:"",F=T?`fill: ${t.color}; stroke: ${t.color};`:"",I=T?`fill: ${t.color}; stroke: ${t.color};`:"",N=T?`stroke: ${t.color};`:"",R=T?`fill: ${t.color};`:"",D=this.showCoverFill&&""!==S,L=this.showBlindSpot&&!!x,H=this.showWindowArrow,W=`M 0 0 L ${h.x} ${h.y}`,j="display: none;";return B`<g class="entry-overlay">
      <g data-tooltip=${E}>
        <title>${E}</title>
        <path class="fov" style=${M} d=${k}></path>
      </g>
      <g class="arrow-group" data-tooltip=${O} style=${H?"":j}>
        <title>${O}</title>
        <path class="window" style=${N} d=${W}></path>
        <circle class="window-base" style=${R} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" data-tooltip=${z} style=${D?"":j}>
        <title>${z}</title>
        <path class="cover-fill" style=${F} d=${S}></path>
      </g>
      <g class="blind-group" data-tooltip=${P} style=${L?"":j}>
        <title>${P}</title>
        <path class="blind-spot" style=${I} d=${x??""}></path>
      </g>
    </g>`}_renderLegend(t,e){return e?V`
        <div class="legend">
          ${t.map(t=>V`
              <button
                type="button"
                class=${Qt({"entry-toggle":!0,hidden:this._hiddenEntries.has(t.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(t.d.entry_id)}
                @click=${()=>this._toggleEntry(t.d.entry_id)}
              >
                <span class="swatch entry" style="background: ${t.color}"></span>
                ${t.d.entry_title}
                ${t.sunInfront?V`<span class="status valid">${Dt("compass.in_fov_check",this.hass)}</span>`:t.sun.in_fov?V`<span class="status in-fov">${Dt("compass.in_fov",this.hass)}</span>`:V`<span class="status">${Dt("compass.none",this.hass)}</span>`}
              </button>
            `)}
          <div><span class="dot sun valid"></span> ${Dt("compass.sun",this.hass)}</div>
          ${this.showMoon?V`<div><span class="dot moon-dot"></span> ${Dt("compass.moon",this.hass)}</div>`:q}
        </div>
      `:V`<div class="legend">
      <div><span class="dot sun valid"></span> ${Dt("compass.sun_hitting",this.hass)}</div>
      <div><span class="dot sun in-fov"></span> ${Dt("compass.sun_in_fov_invalid",this.hass)}</div>
      <div><span class="dot sun"></span> ${Dt("compass.sun_outside_fov",this.hass)}</div>
      ${this.showMoon?V`<div><span class="dot moon-dot"></span> ${Dt("compass.moon",this.hass)}</div>`:q}
      <div><span class="swatch fov"></span> ${Dt("compass.window_fov",this.hass)}</div>
      ${this.showSunPath?V`<div>
            <span class="swatch sun-path-swatch"></span> ${Dt("compass.sun_path",this.hass)}
          </div>`:q}
      ${this.showSunriseSunset?V`<div><span class="dot rise-dot"></span> ${Dt("compass.sunrise",this.hass)}</div>
            <div><span class="dot set-dot"></span> ${Dt("compass.sunset",this.hass)}</div>`:q}
      ${this.showCoverFill?V`<div>
            <span class="swatch cover-fill-swatch"></span> ${Dt("compass.cover_closed",this.hass)}
          </div>`:q}
      ${this.showWindowArrow?V`<div>
            <span class="swatch window-swatch"></span> ${Dt("compass.window_normal",this.hass)}
          </div>`:q}
    </div>`}_renderStats(t,e){const s=t[0],o=s.sunAzi,i=s.sun.elevation,{latitude:n,longitude:r}=this.hass.config,a=this.showMoon&&void 0!==n&&void 0!==r?de(n,r):null;return e?V`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${Dt("compass.stat_sun",this.hass)}${ue(o)} /
              ${ue(i)}</span
            >
            ${this.showMoon&&a?V`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:q}
          </div>
          ${t.map(t=>V`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${t.color}"></span>
                <span class="entry-name">${t.d.entry_title}</span>
                <span>∠${ue(t.sun.gamma)}</span>
                <span>W ${ue(Vt(t.sun.window_azimuth))}</span>
                ${t.sun.in_fov?V`<span class="status in-fov">✓</span>`:q}
              </div>
            `)}
        </div>
      `:V`<div class="stats dim">
      <span>${Dt("compass.stat_azi",this.hass)}${ue(o)}</span>
      <span>${Dt("compass.stat_elev",this.hass)}${ue(i)}</span>
      <span>∠: ${ue(s.sun.gamma)}</span>
      <span
        >${Dt("compass.stat_window",this.hass)}${ue(Vt(s.sun.window_azimuth))}</span
      >
      ${this.showMoon&&a?V`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:q}
    </div>`}};ye.styles=r`
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
  `,t([_t({attribute:!1})],ye.prototype,"hass",void 0),t([_t({attribute:!1})],ye.prototype,"discovered_list",void 0),t([_t({type:Boolean,reflect:!0})],ye.prototype,"compact",void 0),t([_t({attribute:!1})],ye.prototype,"showStats",void 0),t([_t({attribute:!1})],ye.prototype,"showLegend",void 0),t([_t({attribute:!1})],ye.prototype,"showMoon",void 0),t([_t({attribute:!1})],ye.prototype,"showCardinals",void 0),t([_t({attribute:!1})],ye.prototype,"showBlindSpot",void 0),t([_t({attribute:!1})],ye.prototype,"showSunPath",void 0),t([_t({attribute:!1})],ye.prototype,"showSunriseSunset",void 0),t([_t({attribute:!1})],ye.prototype,"showCoverFill",void 0),t([_t({attribute:!1})],ye.prototype,"showWindowArrow",void 0),t([_t({attribute:!1})],ye.prototype,"coverColors",void 0),t([_t({attribute:!1})],ye.prototype,"northOffsetDeg",void 0),t([gt()],ye.prototype,"_hiddenEntries",void 0),ye=t([ht("acp-sky-compass")],ye);let be=class extends ct{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];return e?e.attributes:null}render(){if(!this.hass||!this.discovered)return q;const t=this._sunAttrs(),{latitude:e,longitude:s}=this.hass.config;if(void 0===e||void 0===s||!t)return V`<div class="placeholder">${Dt("elevation.placeholder",this.hass)}</div>`;const o=le(),i=ae(e,s,o),n=new Date,r=function(t,e,s,o){let i=-1,n=-1,r=-1;for(let a=0;a<t.length;a++){const l=t[a];l.elevation>0&&ce(l.azimuth,e,s,o)?(-1===r&&(r=a),a-r>n-i&&(i=r,n=a)):r=-1}return-1===i?null:{startIdx:i,endIdx:n}}(i,t.window_azimuth,t.fov_left,t.fov_right),a=t=>32+(t.getTime()-o.getTime())/864e5*360,l=t=>138-(t- -10)/100*128,c=i.map(t=>`${a(t.t).toFixed(1)},${l(t.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(n),p=this._interpAt(i,n),u=p?l(p.elevation):null,_=r?i[r.startIdx].t:null,g=r?i[r.endIdx].t:null,m=_?a(_):null,v=g?a(g):null;return V`
      <div class="wrap">
        <div class="head">
          <span class="label">${Dt("elevation.title",this.hass)}</span>
          ${_&&g?V`<span class="dim"
                >${Dt("elevation.fov_window",this.hass,{from:_e(_.toISOString()),to:_e(g.toISOString())})}</span
              >`:V`<span class="dim">${Dt("elevation.no_fov_today",this.hass)}</span>`}
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${B`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(t=>B`
              <line class="grid" x1=${32} y1=${l(t)} x2=${392} y2=${l(t)} />
              <text class="tick" x=${28} y=${l(t)+3} text-anchor="end">${t}°</text>
            `)}

            <!-- x-axis gridlines at every 6h -->
            ${[0,6,12,18,24].map(t=>{const e=new Date(o.getTime()+36e5*t);return B`
                <line class="grid faint" x1=${a(e)} y1=${10} x2=${a(e)} y2=${138} />
                <text class="tick" x=${a(e)} y=${152} text-anchor="middle">${t.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${d} x2=${392} y2=${d} />

            <!-- FOV shaded band (only the time the sun is actually in FOV + above horizon) -->
            ${null!==m&&null!==v?B`<rect
                  class="fov-band"
                  x=${m}
                  y=${10}
                  width=${v-m}
                  height=${128}
                />`:q}

            <!-- elevation curve -->
            <polyline class="curve" points=${c} />

            <!-- current-time cursor -->
            <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />

            <!-- current sun dot -->
            ${null!==u?B`<circle class="sun-dot" cx=${h} cy=${u} r="4" />`:q}
          `}
        </svg>
      </div>
    `}_interpAt(t,e){if(0===t.length)return null;const s=e.getTime();if(s<=t[0].t.getTime())return t[0];if(s>=t[t.length-1].t.getTime())return t[t.length-1];for(let o=1;o<t.length;o++)if(t[o].t.getTime()>=s){const i=t[o-1],n=t[o],r=(s-i.t.getTime())/(n.t.getTime()-i.t.getTime());return{t:e,elevation:i.elevation+(n.elevation-i.elevation)*r,azimuth:i.azimuth+(n.azimuth-i.azimuth)*r}}return t[t.length-1]}};function we(t){const e=t.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(e))return"custom_position";switch(e){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return e}}function $e(t,e,s,o=St){const i=new Map;for(const e of t){if(!e.matched)continue;const t=we(e.handler);kt.includes(t)&&i.set(t,e)}const n=[...kt].reverse().filter(t=>i.has(t));return 0===n.length?e.reason??"":n.map(t=>function(t,e,s,o){const i=o[t]??t,n=e.position,r=null==n?"":` ${pe(n)}`;if("custom_position"!==t)return`${i}${r}`.trimEnd();return`${s.custom_position_active_slot_name?`${i} · ${s.custom_position_active_slot_name}`:s.custom_position_active_slot?`${i} #${s.custom_position_active_slot}`:i}${r}${!0===s.custom_position_minimum_mode?" floor":""}`}(t,i.get(t),e,o)).join(" → ")}be.styles=r`
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
  `,t([_t({attribute:!1})],be.prototype,"hass",void 0),t([_t({attribute:!1})],be.prototype,"discovered",void 0),t([_t({type:Boolean,reflect:!0})],be.prototype,"compact",void 0),be=t([ht("acp-elevation-chart")],be);let xe=class extends ct{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this.hideInactive=!1}_trace(){const t=this.discovered.entities.decision_trace_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=e.attributes;if(!s?.trace)return null;const o=new Map;for(const t of s.trace)o.set(we(t.handler),{matched:t.matched,reason:t.reason,position:t.position});const i={};for(const[t,e]of Object.entries(Ct))i[t]=Dt(e,this.hass);return{winner:e.state,reason:s.reason??"",steps:o,enabledHandlers:s.enabled_handlers,summary:$e(s.trace,s,e.state,i)}}render(){if(!this.hass||!this.discovered)return q;const t=this._trace();if(!t)return V`<div class="placeholder">${Dt("decision.placeholder",this.hass)}</div>`;const e=function(t){if(!t)return new Set;const e=new Set(t);return new Set(kt.filter(t=>!e.has(t)))}(t.enabledHandlers),s=function(t,e,s,o,i=new Set){return t.filter(t=>t===s||!i.has(t)&&(!o||!0===e.get(t)?.matched))}(kt,t.steps,t.winner,this.hideInactive,e);return V`
      <div class="wrap">
        <div class="head">
          <span class="label">${Dt("decision.pipeline",this.hass)}</span>
          <span class="winner">${Dt("decision.winner",this.hass,{name:t.winner})}</span>
        </div>
        ${this.showSummary&&t.summary?V`<div class="summary" title=${Dt("decision.summary_tooltip",this.hass)}>
              ${t.summary}
            </div>`:q}
        <div class="rows">
          ${s.map(e=>this._row(e,t.steps.get(e),t.winner===e))}
        </div>
        <div class="reason dim">${t.reason}</div>
      </div>
    `}_row(t,e,s){const o=e?.matched??!1,i=e?.reason??Dt("decision.not_evaluated",this.hass),n=e?.position;return V`
      <div class="row ${s?"winner":o?"match":"skip"}">
        <span class="name">${Dt(Ct[t],this.hass)}</span>
        <span class="dots" aria-hidden="true">${o?"████":"────"}</span>
        <span class="pos">${null!=n?pe(n):""}</span>
        <span class="reason-inline dim">${i}</span>
        ${s?V`<span class="badge">✓</span>`:q}
      </div>
    `}};var ke,Se;xe.styles=r`
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
  `,t([_t({attribute:!1})],xe.prototype,"hass",void 0),t([_t({attribute:!1})],xe.prototype,"discovered",void 0),t([_t({type:Boolean,reflect:!0})],xe.prototype,"compact",void 0),t([_t({type:Boolean,reflect:!0,attribute:"show-summary"})],xe.prototype,"showSummary",void 0),t([_t({type:Boolean,reflect:!0,attribute:"hide-inactive"})],xe.prototype,"hideInactive",void 0),xe=t([ht("acp-decision-strip")],xe),function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(ke||(ke={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Se||(Se={}));const Ce=["closed","locked","off"],Ae=(t,e,s,o)=>{o=o||{},s=null==s?{}:s;const i=new Event(e,{bubbles:void 0===o.bubbles||o.bubbles,cancelable:Boolean(o.cancelable),composed:void 0===o.composed||o.composed});return i.detail=s,t.dispatchEvent(i),i},Ee=t=>{Ae(window,"haptic",t)};function Oe(t){return void 0!==t&&"none"!==t.action}let ze=class extends ct{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0}render(){const t=this._kind(),e=Pt[t],s=this.hass?Dt(Tt[t],this.hass):e.label,o=this._label(t,s);return V`<span
      class="badge kind-${t}"
      style="background:${e.bg};color:${e.fg};"
      part="badge"
      >${o}</span
    >`}_kind(){if(!1===this.integrationEnabled)return"off";const t=we(this.winner);return zt[t]??"auto"}_label(t,e){return"manual"===t?this.manualEndIso?_e(this.manualEndIso):e:"custom_position"===t?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${e} #${this.slotNumber}`:e}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?" floor":""}`:e}};ze.styles=r`
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
  `,t([_t({attribute:!1})],ze.prototype,"hass",void 0),t([_t()],ze.prototype,"winner",void 0),t([_t({attribute:"manual-end-iso"})],ze.prototype,"manualEndIso",void 0),t([_t({type:Number,attribute:"slot-number"})],ze.prototype,"slotNumber",void 0),t([_t({attribute:"slot-name"})],ze.prototype,"slotName",void 0),t([_t({type:Number})],ze.prototype,"pct",void 0),t([_t({type:Boolean,attribute:"minimum-mode"})],ze.prototype,"minimumMode",void 0),t([_t({type:Boolean,reflect:!0})],ze.prototype,"compact",void 0),t([_t({type:Boolean,attribute:"integration-enabled"})],ze.prototype,"integrationEnabled",void 0),ze=t([ht("acp-tile-badge")],ze);let Pe=class extends ct{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualEndIso(){const t=this.discovered.entities.manual_override_end_sensor;if(!t)return null;const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:null}_motionStatus(){const t=this.discovered.entities.motion_status_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=e.attributes.motion_timeout_end_time;return{state:e.state,endIso:s??null}}_forceActive(){const t=this.discovered.entities.force_override_sensor;if(!t)return 0;const e=this.hass.states[t];return e&&parseInt(e.state,10)||0}_resetManual(){const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}_motionStateLabel(t,e){if(t){const e=this.hass.states[t],s=this.hass.formatEntityState;if(e&&"function"==typeof s){const t=s(e);if(t)return t}}return e.replace(/_/g," ")}render(){if(!this.hass||!this.discovered)return q;const t=this._manualActive(),e=this._manualEndIso(),s=this._motionStatus(),o=this.discovered.entities.motion_status_sensor,i=this._forceActive(),n=this.discovered.entities.reset_override_button,r=Dt("overrides.reset_manual",this.hass);return V`
      <div class="wrap">
        <div class="label dim">${Dt("overrides.title",this.hass)}</div>
        <div class="grid">
          <div class="tile ${t?"active":""}">
            <div class="tile-label">${Dt("overrides.manual",this.hass)}</div>
            <div class="tile-value">
              ${Dt(t?"overrides.active":"overrides.off",this.hass)}
            </div>
            ${e?V`<div class="tile-sub dim">
                  ${Dt("overrides.ends_in",this.hass,{time:ge(e,this.hass)})}
                </div>`:q}
          </div>

          <div class="tile ${i>0?"active warning":""}">
            <div class="tile-label">${Dt("overrides.force",this.hass)}</div>
            <div class="tile-value">
              ${i>0?Dt("overrides.active_count",this.hass,{count:i}):Dt("overrides.off",this.hass)}
            </div>
          </div>

          ${s?V`<div class="tile ${"motion_detected"===s.state?"active":""}">
                <div class="tile-label">${Dt("overrides.motion",this.hass)}</div>
                <div class="tile-value">${this._motionStateLabel(o,s.state)}</div>
                ${s.endIso?V`<div class="tile-sub dim">
                      ${Dt("overrides.timeout",this.hass,{time:ge(s.endIso,this.hass)})}
                    </div>`:q}
              </div>`:q}
          ${n?this.resetEnabled?V`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${r}</div>
                </button>`:V`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${r}</div>
                </button>`:q}
        </div>
      </div>
    `}};Pe.styles=r`
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
  `,t([_t({attribute:!1})],Pe.prototype,"hass",void 0),t([_t({attribute:!1})],Pe.prototype,"discovered",void 0),t([_t({type:Boolean,reflect:!0})],Pe.prototype,"compact",void 0),t([_t({type:Boolean,attribute:"reset-enabled"})],Pe.prototype,"resetEnabled",void 0),Pe=t([ht("acp-overrides-panel")],Pe);const Te={summer_mode:"mdi:weather-sunny",winter_mode:"mdi:snowflake",intermediate:"mdi:weather-partly-cloudy"};let Me=class extends ct{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return q;const t=this.discovered.entities.climate_status_sensor;if(!t)return q;const e=this.hass.states[t];if(!e||"unavailable"===e.state)return q;const s=e.state,o=e.attributes??{},i=Te[s]??"mdi:thermostat",n=o.temperature_unit??"°",r=this.hass.formatEntityState,a="function"==typeof r?r(e)??s:s,l=void 0!==o.active_temperature?`${o.active_temperature.toFixed(1)}${n}`:"—",c=[void 0!==o.indoor_temperature?{label:Dt("climate.indoor",this.hass),value:o.indoor_temperature,unit:n}:null,void 0!==o.outdoor_temperature?{label:Dt("climate.outdoor",this.hass),value:o.outdoor_temperature,unit:n}:null].filter(t=>null!==t),d=[{label:Dt("climate.presence",this.hass),value:o.is_presence,icon:"mdi:account-check"},{label:Dt("climate.sunny",this.hass),value:o.is_sunny,icon:"mdi:white-balance-sunny"},{label:Dt("climate.lux",this.hass),value:o.lux_active,icon:"mdi:brightness-7"},{label:Dt("climate.irradiance",this.hass),value:o.irradiance_active,icon:"mdi:solar-power"}].filter(t=>void 0!==t.value);return V`
      <div class="wrap">
        <div class="head">
          <span class="label">${Dt("climate.title",this.hass)}</span>
          <span class="dim">${Dt("climate.active",this.hass,{strategy:l})}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${i}></ha-icon>
          <span class="strategy-name">${a}</span>
        </div>
        ${c.length?V`
              <div class="temps">
                ${c.map(t=>V`
                    <div class="temp">
                      <span class="temp-label dim">${t.label}</span>
                      <span class="temp-value">${t.value.toFixed(1)}${t.unit}</span>
                    </div>
                  `)}
              </div>
            `:q}
        ${d.length?V`
              <div class="conditions">
                ${d.map(t=>V`
                    <div class="chip ${t.value?"on":"off"}" title=${t.label}>
                      <ha-icon icon=${t.icon}></ha-icon>
                      <span>${t.label}</span>
                    </div>
                  `)}
              </div>
            `:q}
      </div>
    `}};Me.styles=r`
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
  `,t([_t({attribute:!1})],Me.prototype,"hass",void 0),t([_t({attribute:!1})],Me.prototype,"discovered",void 0),t([_t({type:Boolean,reflect:!0})],Me.prototype,"compact",void 0),Me=t([ht("acp-climate-panel")],Me);let Fe=class extends ct{constructor(){super(...arguments),this.compact=!1}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return{target:null,covers:{}};const e=this.hass.states[t];if(!e)return{target:null,covers:{}};const s=parseFloat(e.state),o=e.attributes;return{target:Number.isNaN(s)?null:s,covers:o?.actual_positions??{}}}_mismatched(){const t=this.discovered.entities.position_mismatch_binary;if(!t)return new Set;const e=this.hass.states[t];if("on"!==e?.state)return new Set;const s=e.attributes.entities;return s?new Set(Object.entries(s).filter(([,t])=>t.mismatch).map(([t])=>t)):new Set}_setPosition(t,e){this.hass.callService(xt,"set_position",{entity_id:t,position:e})}render(){if(!this.hass||!this.discovered)return q;const{target:t,covers:e}=this._target(),s=this._mismatched(),o=Object.entries(e);return 0===o.length?V`<div class="placeholder">${Dt("covers.placeholder",this.hass)}</div>`:V`
      <div class="wrap">
        <div class="head">
          <span class="label">${Dt("covers.title",this.hass)}</span>
          <span class="target"
            >${Dt("covers.target",this.hass,{pct:pe(t)})}</span
          >
        </div>
        ${o.map(([e,o])=>this._bar(e,o,t,s.has(e)))}
      </div>
    `}_bar(t,e,s,o){const i=this.hass.states[t]?.attributes?.friendly_name??t,n=e??0,r=s??0;return V`
      <div class="cover ${o?"mismatch":""}">
        <div class="name" title=${t}>${i}</div>
        <div
          class="track"
          @click=${e=>this._handleTrackClick(e,t)}
          title=${Dt("covers.click_to_set",this.hass)}
        >
          <div class="fill" style="width:${n}%"></div>
          ${null!==s?V`<div
                class="marker"
                style="left:${r}%"
                title=${Dt("covers.target_tooltip",this.hass,{pct:r})}
              ></div>`:q}
        </div>
        <div class="num">${pe(e)}</div>
        ${o?V`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:q}
      </div>
    `}_handleTrackClick(t,e){const s=t.currentTarget.getBoundingClientRect(),o=Math.round((t.clientX-s.left)/s.width*100),i=Math.max(0,Math.min(100,o));this._setPosition(e,i)}};var Ie;Fe.styles=r`
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
  `,t([_t({attribute:!1})],Fe.prototype,"hass",void 0),t([_t({attribute:!1})],Fe.prototype,"discovered",void 0),t([_t({type:Boolean,reflect:!0})],Fe.prototype,"compact",void 0),Fe=t([ht("acp-cover-bar")],Fe);let Ne=Ie=class extends ct{constructor(){super(...arguments),this.samples=[],this.events=[],this._hoverIdx=null,this._onPointerMove=t=>{const e=t.currentTarget.getBoundingClientRect();if(e.width<=0)return;const s=(t.clientX-e.left)/e.width,o=Math.max(0,Math.min(1,s))*Ie.VIEW_W;this._hoverIdx=this._nearestSampleIdx(o)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){if(!this.samples||0===this.samples.length)return q;const t=this._timeRange();if(!t)return q;const{start:e,end:s}=t,o=s-e;if(o<=0)return q;const{VIEW_W:i,VIEW_H:n,TOP_PAD:r,EVENT_HIT_W:a}=Ie,l=n-r,c=this.samples.map(t=>{const s=Date.parse(t.t);return{t:s,x:(s-e)/o*i,y:r+(1-Re(t.position)/100)*l,sample:t}}),d=c.map(t=>`${t.x.toFixed(1)},${t.y.toFixed(1)}`).join(" "),h=(this.events??[]).map(t=>{const l=Date.parse(t.t);if(Number.isNaN(l)||l<e||l>s)return null;const c=(l-e)/o*i,d=`evt-${t.kind}`,h=function(t,e){const s=`forecast.event.${t.kind}`,o=Dt(s,e),i=o===s?t.label??t.kind:o,n=_e(t.t);return"—"===n?i:`${i} — ${n}`}(t,this.hass);return B`<g class="event-group" data-tooltip=${h}>
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
        </g>`}).filter(t=>null!==t),p=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<c.length?c[this._hoverIdx]:null,u=p?B`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${p.x.toFixed(1)} x2=${p.x.toFixed(1)}
            y1=${r} y2=${n}></line>
          <circle class="hover-dot" cx=${p.x.toFixed(1)} cy=${p.y.toFixed(1)} r="3"></circle>
        </g>`:q,_=p?V`<div class="hover-label" style=${`left: ${(p.x/i*100).toFixed(2)}%`}>
          ${function(t){const e=_e(t.t),s=`${Math.round(Re(t.position))}%`;return t.handler?`${e} · ${s} · ${t.handler}`:`${e} · ${s}`}(p.sample)}
        </div>`:q,g=_e(this.samples[0].t),m=_e(this.samples[this.samples.length-1].t);return V`
      <div class="wrap">
        <svg
          viewBox="0 0 ${i} ${n}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <title>${Dt("forecast.hover_hint",this.hass)}</title>
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
    `}_timeRange(){let t=Number.POSITIVE_INFINITY,e=Number.NEGATIVE_INFINITY;for(const s of this.samples){const o=Date.parse(s.t);Number.isNaN(o)||(o<t&&(t=o),o>e&&(e=o))}return t===Number.POSITIVE_INFINITY?null:{start:t,end:e}}_nearestSampleIdx(t){const e=this._timeRange();if(!e)return null;const s=e.end-e.start;if(s<=0)return null;let o=-1,i=Number.POSITIVE_INFINITY;for(let n=0;n<this.samples.length;n++){const r=Date.parse(this.samples[n].t);if(Number.isNaN(r))continue;const a=(r-e.start)/s*Ie.VIEW_W,l=Math.abs(a-t);l<i&&(i=l,o=n)}return o>=0?o:null}};function Re(t){return Number.isNaN(t)||t<0?0:t>100?100:t}Ne.VIEW_W=600,Ne.VIEW_H=80,Ne.TOP_PAD=10,Ne.EVENT_HIT_W=12,Ne.styles=r`
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
  `,t([_t({attribute:!1})],Ne.prototype,"hass",void 0),t([_t({attribute:!1})],Ne.prototype,"samples",void 0),t([_t({attribute:!1})],Ne.prototype,"events",void 0),t([gt()],Ne.prototype,"_hoverIdx",void 0),Ne=Ie=t([ht("acp-forecast-strip")],Ne);let De=class extends ct{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this._onResume=()=>{const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const t=this.discovered.device_id;t&&this._navigate(`/config/devices/device/${t}`)},this._openIntegrationPage=()=>{this._navigate(`/config/integrations/integration/${xt}`)},this._onBackdrop=t=>{t.target===t.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=t=>{t.stopPropagation()}}_buildHandlerLabels(){const t={};for(const[e,s]of Object.entries(Ct))t[e]=Dt(s,this.hass);return t}render(){if(!this.open||!this.hass||!this.discovered)return q;const t=this._winner(),e=this._traceAttrs(),s=this._matchedHandlers(e),o=e?$e(e.trace??[],e,0,this._buildHandlerLabels()):"",i=this._target(),n=this._shouldShowResume(t),r=this._switchOn("integration_enabled_switch"),a=this._switchOn("automatic_control_switch"),l=Dt("dialog.configure_integration",this.hass),c=Dt("dialog.open_device_page",this.hass),d=Dt("dialog.close",this.hass);return V`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${At[this.discovered.cover_type]??"mdi:window-shutter"}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${r?a?s.map(t=>V`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${t}
                          .slotNumber=${"custom_position"===t?e?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===t?e?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===t?i??void 0:void 0}
                          .minimumMode=${"custom_position"===t?e?.custom_position_minimum_mode:void 0}
                        ></acp-tile-badge>`):q:V`<acp-tile-badge
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
            ${this.discovered.device_id?V`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label=${c}
                  title=${c}
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:cog"></ha-icon>
                </button>`:q}
            <button class="close" type="button" aria-label=${d} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${o?V`<div class="summary">${o}</div>`:q}

          <div class="position-block">
            <div class="position-label">${Dt("dialog.target",this.hass)}</div>
            <div class="position-value">${pe(i)}</div>
            ${this._mismatchActive()?V`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:q}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${n?V`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${Dt("dialog.resume_auto",this.hass)}
                </button>
              </div>`:q}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?Dt("dialog.hide_advanced",this.hass):Dt("dialog.show_advanced",this.hass)}
          </button>
          ${this.advancedOpen?V`<div class="advanced">
                ${this.showCompass?V`<div class="advanced-compass">
                      <acp-sky-compass
                        .hass=${this.hass}
                        .discovered_list=${[this.discovered]}
                        ?compact=${!0}
                        .showLegend=${!1}
                        .showStats=${!0}
                      ></acp-sky-compass>
                    </div>`:q}
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
              </div>`:q}
        </div>
      </div>
    `}_winner(){const t=this.discovered.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(){const t=this.discovered.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_matchedHandlers(t){if(!t?.trace)return[];const e=new Set;for(const s of t.trace){if(!s.matched)continue;const t=we(s.handler);kt.includes(t)&&e.add(t)}return kt.filter(t=>e.has(t))}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=parseFloat(e.state);return Number.isNaN(s)?null:s}_mismatchActive(){const t=this.discovered.entities.position_mismatch_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualOverrideOn(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(t){const e=this.discovered.entities[t];return!e||"off"!==this.hass.states[e]?.state}_shouldShowResume(t){return!(!this.discovered.entities.reset_override_button||!this._manualOverrideOn()&&"custom_position"!==we(t))}_renderSlots(t){if(!t)return q;const e=t.filter(t=>null!==t.sensor);return 0===e.length?q:V`<div class="slots-section">
      <div class="slots-label">${Dt("dialog.custom_positions",this.hass)}</div>
      ${e.map(t=>this._renderSlotRow(t))}
    </div>`}_renderSlotRow(t){const e=t.sensor_name??`#${t.slot}`;return V`<div class="slot-row" data-slot=${t.slot}>
      <span class="slot-label">${e}</span>
      <span class="slot-position">${pe(t.position)}</span>
      ${!0===t.min_mode?V`<span class="slot-min-mode" title=${Dt("dialog.floor_tooltip",this.hass)}>
            ${Dt("dialog.floor",this.hass)}
          </span>`:q}
      <button
        class="slot-toggle ${t.enabled?"on":"off"}"
        type="button"
        aria-label=${t.enabled?Dt("dialog.disable_slot",this.hass,{slot:t.slot}):Dt("dialog.enable_slot",this.hass,{slot:t.slot})}
        @click=${()=>this._toggleSlot(t)}
      >
        ${t.enabled?Dt("dialog.on",this.hass):Dt("dialog.off",this.hass)}
      </button>
    </div>`}_renderControls(){const t=[{role:"automatic_control_switch",label:Dt("dialog.automatic",this.hass)},{role:"climate_mode_switch",label:Dt("dialog.climate",this.hass)},{role:"motion_control_switch",label:Dt("dialog.motion",this.hass)}].filter(t=>!!this.discovered.entities[t.role]);return 0===t.length?q:V`<div class="controls-block">
      <div class="controls-label">${Dt("dialog.controls",this.hass)}</div>
      <div class="controls-row">${t.map(t=>this._renderSwitchChip(t.role,t.label))}</div>
    </div>`}_renderSwitchChip(t,e){const s=this.discovered.entities[t],o="on"===this.hass.states[s]?.state,i=Dt(o?"dialog.state_on":"dialog.state_off",this.hass),n=Dt(o?"dialog.on":"dialog.off",this.hass);return V`<button
      class="ctrl-toggle ${o?"on":"off"}"
      type="button"
      aria-pressed=${o}
      aria-label=${Dt("dialog.toggle_hint",this.hass,{label:e,state:i})}
      @click=${()=>this._toggleSwitch(s,o)}
    >
      <span class="ctrl-label">${e}</span>
      <span class="ctrl-state">${n}</span>
    </button>`}_toggleSwitch(t,e){this.hass.callService("switch",e?"turn_off":"turn_on",{entity_id:t})}_renderForecastStrip(){const t=this.discovered.entities.position_forecast_sensor;if(!t)return q;const e=this.hass.states[t]?.attributes,s=e?.forecast??[],o=e?.events??[];return 0===s.length?q:V`<div class="forecast-block">
      <div class="forecast-label">${Dt("dialog.todays_forecast",this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${s}
        .events=${o}
        .now=${Date.now()}
      ></acp-forecast-strip>
    </div>`}_toggleSlot(t){const e=this.discovered.managed_covers[0];e&&this.hass.callService(xt,"set_custom_position",{entity_id:e,slot:t.slot,enabled:!t.enabled})}_navigate(t){history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};async function Le(t){return(await t.callWS({type:"config_entries/get",domain:xt})).filter(t=>t.domain===xt).map(t=>({entry_id:t.entry_id,title:t.title}))}De.styles=r`
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
  `,t([_t({attribute:!1})],De.prototype,"hass",void 0),t([_t({attribute:!1})],De.prototype,"discovered",void 0),t([_t({type:Boolean,reflect:!0})],De.prototype,"open",void 0),t([_t({type:Boolean})],De.prototype,"advancedOpen",void 0),t([_t({type:Boolean})],De.prototype,"showCompass",void 0),De=t([ht("acp-more-info-dialog")],De);const He={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_compass:!0,show_motion_icon:!0,show_resume:"auto",layout:"one-line"},We={entry_id:"editor.common.entry_id",name:"editor.tile.name",icon:"editor.tile.icon",cover:"editor.tile.cover",layout:"editor.tile.layout",show_position:"editor.tile.show_position",show_state:"editor.tile.show_state",show_decision_summary:"editor.tile.show_decision_summary",show_controls:"editor.tile.show_controls",show_badge:"editor.tile.show_badge",show_compass:"editor.tile.show_compass",show_motion_icon:"editor.tile.show_motion_icon",show_resume:"editor.tile.show_resume",tap_action:"editor.tile.tap_action",hold_action:"editor.tile.hold_action",double_tap_action:"editor.tile.double_tap_action"};let je=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=t=>{const e=We[t.name];return e?Dt(e,this.hass):t.name},this._valueChanged=t=>{t.stopPropagation();const e={...t.detail.value};for(const[t,s]of Object.entries(He))this._config&&Object.prototype.hasOwnProperty.call(this._config,t)||e[t]!==s||delete e[t];this._emit({...this._config??{type:"",entry_id:""},...e})}}setConfig(t){this._config={...t}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),t.has("_registry")&&null!==this._registry&&this._maybePrefillCover()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Le(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id}),this._maybePrefillCover()}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,Bt(this.hass).then(t=>{this._registry=t,this._maybePrefillCover()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=Kt(this.hass,()=>{this._registryFetchInFlight=!0,Bt(this.hass).then(t=>{this._registry=t}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_maybePrefillCover(){if(!this._config?.entry_id||this._config?.cover||!this._registry||!this.hass)return;const t=Lt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=t?.managed_covers??[],1===t?.managed_covers.length&&this._emit({...this._config,cover:t.managed_covers[0]})}render(){if(!this._config)return q;if(this._entriesError&&!this._entries)return V`
        <div class="form">
          <div class="error">
            ${Dt("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${Dt("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${Dt("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${t=>this._emit({...this._config??{type:"",entry_id:""},entry_id:t.target.value})}
          />
        </div>
      `;const t=this._schema(),e={...He,...this._config};return V`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${t}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._managedCovers.length>1&&!this._config?.cover?V`<div class="hint">${Dt("editor.tile.cover_blank_hint",this.hass)}</div>`:q}
    `}_schema(){const t=this._entries?.map(t=>({value:t.entry_id,label:t.title}))??[],e=[{value:"auto",label:Dt("editor.tile.resume_option_auto",this.hass)},{value:"always",label:Dt("editor.tile.resume_option_always",this.hass)},{value:"never",label:Dt("editor.tile.resume_option_never",this.hass)}],s=[{value:"one-line",label:Dt("editor.tile.layout_option_one_line",this.hass)},{value:"detailed",label:Dt("editor.tile.layout_option_detailed",this.hass)}];let o={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const t=Lt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);t&&t.managed_covers.length>0&&(o={entity:{domain:"cover",include_entities:t.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:t,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:o},{name:"layout",selector:{select:{mode:"list",options:s}}},{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{name:"show_motion_icon",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"show_resume",selector:{select:{mode:"list",options:e}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};je.styles=r`
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
  `,t([_t({attribute:!1})],je.prototype,"hass",void 0),t([gt()],je.prototype,"_config",void 0),t([gt()],je.prototype,"_entries",void 0),t([gt()],je.prototype,"_entriesError",void 0),t([gt()],je.prototype,"_registry",void 0),t([gt()],je.prototype,"_managedCovers",void 0),je=t([ht($t)],je);let Ue=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),Oe(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return Oe(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(t){if(!t||"string"!=typeof t.entry_id||0===t.entry_id.length)throw new Error(`${wt}: \`entry_id\` is required and must be a non-empty string`);let e={...t};"string"==typeof e.tap_action&&(e={...e,tap_action:"none"===e.tap_action?{action:"none"}:void 0}),this._config=e}getCardSize(){return 1}static getStubConfig(){return{type:`custom:${wt}`,entry_id:""}}static async getConfigElement(){return document.createElement($t)}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Kt(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Bt(this.hass).then(e=>{t===this._fetchGen&&(this._registry=e,this._registryError=null)}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return V`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Dt("tile.registry_failed",this.hass,{error:this._registryError}):Dt("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const t=Lt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return t?V`
      <ha-card>${this._renderTile(t)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${t}
        .open=${this._dialogOpen}
        .showCompass=${!1!==this._config.show_compass}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `:V`<ha-card>
        <div class="empty">
          <p class="dim">
            ${Dt("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`}_buildHandlerLabels(){const t={};for(const[e,s]of Object.entries(Ct))t[e]=Dt(s,this.hass);return t}_renderTile(t){const e=this._config,s=e.name??t.entry_title,o=this._resolvedCover(t),i=e.icon??function(t,e){if(null!==e&&!Number.isNaN(e)){if(e>=95)return Et[t]??"mdi:window-shutter-open";if(e<=5)return Ot[t]??"mdi:window-shutter"}return At[t]??"mdi:window-shutter"}(t.cover_type,this._liveCoverPosition(o)),n=!1!==e.show_position,r=!1!==e.show_state,a=!1!==e.show_controls,l=!1!==e.show_badge,c=!1!==e.show_motion_icon?this._motionActiveState(t):null,d=Dt("timeout_pending"===c?"tile.motion_pending":"tile.motion_detected",this.hass),h="detailed"===e.layout,p=this._currentPosition(t),u=this._winner(t),_=this._traceAttrs(t),g=this._manualEndIso(t),m=this._shouldShowResume(t,u),v=this._isFullyInert(e),f=!0===e.show_decision_summary&&_?$e(_.trace??[],_,0,this._buildHandlerLabels()):"",y=!!f&&h,b=this._switchOn(t,"integration_enabled_switch"),w=this._switchOn(t,"automatic_control_switch"),$=l&&!(!1===w&&!0===b),x=r?function(t,e){if(!t||!e)return null;const s=t.states[e];if(!s?.state||"unknown"===s.state||"unavailable"===s.state)return null;if("function"==typeof t.formatEntityState){const e=t.formatEntityState(s);if(e)return e}if("function"==typeof t.localize){const e=t.localize(`component.cover.entity_component._.state.${s.state}`);if(e)return e}return s.state.charAt(0).toUpperCase()+s.state.slice(1)}(this.hass,o):null,k=[x,n&&null!==p?pe(p):null].filter(t=>!!t);return V`
      <div
        class=${`tile-body${h?" detailed":""}${y?" has-summary":""}${x?" has-state-label":""}${h&&($||m)?" has-row3":""}`}
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
          ${c?V`<ha-icon
                class="motion-overlay ${c}"
                icon="mdi:motion-sensor"
                title=${d}
              ></ha-icon>`:q}
        </div>
        <div class="label">
          <div class="title" title=${t.entry_title}>${s}</div>
          ${f&&!h?V`<div class="summary">${f}</div>`:q}
          ${y?V`<div class="summary inline-summary" title=${f}>${f}</div>`:q}
        </div>
        ${k.length>0?V`<div class="position">${k.join(" · ")}</div>`:q}
        ${a?V`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${Dt("tile.open",this.hass)}
                ?disabled=${!o}
                @click=${()=>this._setCoverPosition(o,100)}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${Dt("tile.stop",this.hass)}
                ?disabled=${!o}
                @click=${()=>this._stopCover(o)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${Dt("tile.close",this.hass)}
                ?disabled=${!o}
                @click=${()=>this._setCoverPosition(o,0)}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </div>`:q}
        ${$?V`<acp-tile-badge
              .hass=${this.hass}
              .winner=${u}
              .integrationEnabled=${b}
              .slotNumber=${_?.custom_position_active_slot}
              .slotName=${_?.custom_position_active_slot_name}
              .pct=${p??void 0}
              .minimumMode=${_?.custom_position_minimum_mode}
              .manualEndIso=${g}
            ></acp-tile-badge>`:q}
        ${m?V`<button
              class="resume"
              type="button"
              aria-label=${Dt("tile.resume_aria",this.hass)}
              @click=${e=>{e.stopPropagation(),this._resume(t)}}
              @pointerdown=${this._stop}
            >
              ${Dt("tile.resume",this.hass)}
            </button>`:q}
      </div>
    `}_resolvedCover(t){return this._config?.cover?this._config.cover:t.managed_covers[0]}_currentPosition(t){const e=t.entities.target_position_sensor;if(!e)return null;const s=this.hass.states[e];if(!s)return null;const o=parseFloat(s.state);return Number.isNaN(o)?null:o}_liveCoverPosition(t){if(!t)return null;const e=this.hass.states[t]?.attributes?.current_position;return"number"!=typeof e||Number.isNaN(e)?null:e}_winner(t){const e=t.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(t){const e=t.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_motionActiveState(t){const e=t.entities.motion_status_sensor;if(!e)return null;const s=this.hass.states[e]?.state;return"motion_detected"===s||"timeout_pending"===s?s:null}_manualOverrideOn(t){const e=t.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(t,e){const s=t.entities[e];return!s||"off"!==this.hass.states[s]?.state}_manualEndIso(t){if(!this._manualOverrideOn(t))return;const e=t.entities.manual_override_end_sensor;return e?this.hass.states[e]?.state:void 0}_shouldShowResume(t,e){if(!t.entities.reset_override_button)return!1;const s=this._config?.show_resume??"auto";return"never"!==s&&("always"===s||!!this._manualOverrideOn(t)||"custom_position"===we(e))}_setCoverPosition(t,e){t&&this.hass.callService(xt,"set_position",{entity_id:t,position:e})}_stopCover(t){t&&this.hass.callService("cover","stop_cover",{entity_id:t})}_resume(t){const e=t.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_tapActionConfig(){const t=this._config?.tap_action;if("string"!=typeof t)return t}_isFullyInert(t){return!!(t=>!!t&&"none"===t.action)(this._tapActionConfig())&&!Oe(t.hold_action)&&!Oe(t.double_tap_action)}_fireAction(t){if(!this._config||!this.hass)return;const e=this._tapActionConfig();if("tap"===t&&void 0===e)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const s=this._resolvedCoverFromState();((t,e,s,o)=>{let i;"double_tap"===o&&s.double_tap_action?i=s.double_tap_action:"hold"===o&&s.hold_action?i=s.hold_action:"tap"===o&&s.tap_action&&(i=s.tap_action),((t,e,s,o)=>{if(o||(o={action:"more-info"}),!o.confirmation||o.confirmation.exemptions&&o.confirmation.exemptions.some(t=>t.user===e.user.id)||(Ee("warning"),confirm(o.confirmation.text||`Are you sure you want to ${o.action}?`)))switch(o.action){case"more-info":(s.entity||s.camera_image)&&Ae(t,"hass-more-info",{entityId:s.entity?s.entity:s.camera_image});break;case"navigate":o.navigation_path&&((t,e,s=!1)=>{s?history.replaceState(null,"",e):history.pushState(null,"",e),Ae(window,"location-changed",{replace:s})})(0,o.navigation_path);break;case"url":o.url_path&&window.open(o.url_path);break;case"toggle":s.entity&&(((t,e)=>{((t,e,s=!0)=>{const o=function(t){return t.substr(0,t.indexOf("."))}(e),i="group"===o?"homeassistant":o;let n;switch(o){case"lock":n=s?"unlock":"lock";break;case"cover":n=s?"open_cover":"close_cover";break;default:n=s?"turn_on":"turn_off"}t.callService(i,n,{entity_id:e})})(t,e,Ce.includes(t.states[e].state))})(e,s.entity),Ee("success"));break;case"call-service":{if(!o.service)return void Ee("failure");const[t,s]=o.service.split(".",2);e.callService(t,s,o.service_data,o.target),Ee("success");break}case"fire-dom-event":Ae(t,"ll-custom",o)}})(t,e,s,i)})(this,this.hass,{entity:s,tap_action:e,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},t)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const t=Lt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return t?.managed_covers[0]}_stop(t){t.stopPropagation()}};Ue.styles=r`
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
  `,t([_t({attribute:!1})],Ue.prototype,"hass",void 0),t([gt()],Ue.prototype,"_config",void 0),t([gt()],Ue.prototype,"_registry",void 0),t([gt()],Ue.prototype,"_registryError",void 0),t([gt()],Ue.prototype,"_dialogOpen",void 0),Ue=t([ht(wt)],Ue),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===wt)||window.customCards.push({type:wt,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Ve=[{key:"sky",labelKey:"editor.main.section_sky_label",descKey:"editor.main.section_sky_desc"},{key:"elevation",labelKey:"editor.main.section_elevation_label",descKey:"editor.main.section_elevation_desc"},{key:"decision",labelKey:"editor.main.section_decision_label",descKey:"editor.main.section_decision_desc"},{key:"covers",labelKey:"editor.main.section_covers_label",descKey:"editor.main.section_covers_desc"},{key:"overrides",labelKey:"editor.main.section_overrides_label",descKey:"editor.main.section_overrides_desc"},{key:"climate",labelKey:"editor.main.section_climate_label",descKey:"editor.main.section_climate_desc"}],Be=Ve.map(t=>t.key);let Ke=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Le(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id})}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??Be}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_onEntryChange(t){const e=t.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:e})}_onSectionToggle(t,e){const s=new Set(this._currentSections);e?s.add(t):s.delete(t);const o=Ve.map(t=>t.key).filter(t=>s.has(t));this._emit({...this._config??{type:"",entry_id:""},show_sections:o})}_onCompactToggle(t){this._emit({...this._config??{type:"",entry_id:""},compact:t})}_onVersionToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_version:t})}_onCompassStatsToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:t})}_onCompassLegendToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:t})}_onMoonToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_moon:t})}_onHideInactiveToggle(t){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:t})}_onNorthOffsetChange(t){const e=parseFloat(t.target.value),s=Number.isFinite(e)?e:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:s})}_onControlToggle(t,e){const s=this._config??{type:"",entry_id:""};this._emit({...s,controls:{...s.controls,[t]:e}})}render(){if(!this._config)return q;const t=new Set(this._currentSections);return V`
      <div class="form">
        <div class="section">
          <label class="field-label">${Dt("editor.common.entry_id",this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${Dt("editor.main.sections",this.hass)}</label>
          <div class="hint">${Dt("editor.main.sections_hint",this.hass)}</div>
          ${Ve.map(e=>V`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${t.has(e.key)}
                  @change=${t=>this._onSectionToggle(e.key,t.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${Dt(e.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${Dt(e.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${Dt("editor.main.controls",this.hass)}</label>
          <div class="hint">${Dt("editor.main.controls_hint",this.hass)}</div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.integration_enabled??!0}
              @change=${t=>this._onControlToggle("integration_enabled",t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${Dt("editor.main.integration_pill_label",this.hass)}</span
              >
              <span class="toggle-desc">${Dt("editor.main.integration_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.automatic_control??!0}
              @change=${t=>this._onControlToggle("automatic_control",t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Dt("editor.main.automatic_pill_label",this.hass)}</span>
              <span class="toggle-desc">${Dt("editor.main.automatic_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.reset_manual_override??!0}
              @change=${t=>this._onControlToggle("reset_manual_override",t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Dt("editor.main.reset_button_label",this.hass)}</span>
              <span class="toggle-desc">${Dt("editor.main.reset_button_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">${Dt("editor.main.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${t=>this._onCompactToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Dt("editor.main.compact_label",this.hass)}</span>
              <span class="toggle-desc">${Dt("editor.main.compact_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_compass_stats??!0}
              @change=${t=>this._onCompassStatsToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${Dt("editor.main.show_compass_stats_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${Dt("editor.main.show_compass_stats_desc",this.hass)}</span
              >
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_compass_legend??!0}
              @change=${t=>this._onCompassLegendToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${Dt("editor.main.show_compass_legend_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${Dt("editor.main.show_compass_legend_desc",this.hass)}</span
              >
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_moon??!1}
              @change=${t=>this._onMoonToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Dt("editor.main.show_moon_label",this.hass)}</span>
              <span class="toggle-desc">${Dt("editor.main.show_moon_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.hide_inactive_handlers??!1}
              @change=${t=>this._onHideInactiveToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Dt("editor.main.hide_inactive_label",this.hass)}</span>
              <span class="toggle-desc">${Dt("editor.main.hide_inactive_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_version??!1}
              @change=${t=>this._onVersionToggle(t.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Dt("editor.main.show_version_label",this.hass)}</span>
              <span class="toggle-desc">${Dt("editor.main.show_version_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">${Dt("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${Dt("editor.common.north_offset_hint",this.hass)}</div>
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
    `}_renderEntryPicker(){return this._entriesError?V`
        <div class="error">
          ${Dt("editor.common.load_failed",this.hass,{error:this._entriesError})}
        </div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder=${Dt("editor.common.entry_id_manual_placeholder",this.hass)}
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?V`
        <div class="error">
          ${Dt("editor.common.no_entries",this.hass)}
          <code>${Dt("editor.common.no_entries_path",this.hass)}</code>${Dt("editor.common.no_entries_then",this.hass)}
        </div>
      `:V`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(t=>t.entry_id===this._config.entry_id)?V`<option value=${this._config.entry_id}>
              ${Dt("editor.common.unknown_entry",this.hass,{entry:this._config.entry_id})}
            </option>`:q}
        ${this._entries.map(t=>V`
            <option value=${t.entry_id} ?selected=${t.entry_id===this._config?.entry_id}>
              ${t.title}
            </option>
          `)}
      </select>
    `:V`<div class="hint">${Dt("editor.common.loading_entries",this.hass)}</div>`}};Ke.styles=r`
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
  `,t([_t({attribute:!1})],Ke.prototype,"hass",void 0),t([gt()],Ke.prototype,"_config",void 0),t([gt()],Ke.prototype,"_entries",void 0),t([gt()],Ke.prototype,"_entriesError",void 0),Ke=t([ht(ft)],Ke);const qe=[{key:"compact",labelKey:"editor.compass.toggle_compact_label",descKey:"editor.compass.toggle_compact_desc",defaultOn:!1},{key:"show_legend",labelKey:"editor.compass.toggle_legend_label",descKey:"editor.compass.toggle_legend_desc",defaultOn:!0},{key:"show_stats",labelKey:"editor.compass.toggle_stats_label",descKey:"editor.compass.toggle_stats_desc",defaultOn:!0},{key:"show_moon",labelKey:"editor.compass.toggle_moon_label",descKey:"editor.compass.toggle_moon_desc",defaultOn:!1},{key:"show_cardinals",labelKey:"editor.compass.toggle_cardinals_label",descKey:"editor.compass.toggle_cardinals_desc",defaultOn:!0},{key:"show_blind_spot",labelKey:"editor.compass.toggle_blind_spot_label",descKey:"editor.compass.toggle_blind_spot_desc",defaultOn:!0},{key:"show_sun_path",labelKey:"editor.compass.toggle_sun_path_label",descKey:"editor.compass.toggle_sun_path_desc",defaultOn:!0},{key:"show_sunrise_sunset",labelKey:"editor.compass.toggle_sunrise_sunset_label",descKey:"editor.compass.toggle_sunrise_sunset_desc",defaultOn:!0},{key:"show_cover_fill",labelKey:"editor.compass.toggle_cover_fill_label",descKey:"editor.compass.toggle_cover_fill_desc",defaultOn:!0},{key:"show_window_arrow",labelKey:"editor.compass.toggle_window_arrow_label",descKey:"editor.compass.toggle_window_arrow_desc",defaultOn:!0}];let Ge=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Le(this.hass).then(t=>{this._entries=t,this._entriesError=null}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${yt}`,entry_ids:[]}}_trimColors(t){let e=-1;for(let s=0;s<t.length;s++)t[s]&&(e=s);if(!(e<0))return t.slice(0,e+1)}_emitWithColors(t,e,s){const o=this._trimColors(e),{cover_colors:i,...n}=t,r=o?{...n,...s,cover_colors:o}:{...n,...s};this._emit(r)}_onCoverColorChange(t,e){const s=this._baseConfig(),o=[...s.cover_colors??[]];for(;o.length<=t;)o.push(null);o[t]=e,this._emitWithColors(s,o)}_onCoverColorReset(t){const e=this._baseConfig(),s=[...e.cover_colors??[]];t<s.length&&(s[t]=null),this._emitWithColors(e,s)}_onEntryToggle(t,e){const s=this._baseConfig(),o=new Set(s.entry_ids);e?o.add(t):o.delete(t);const i=(this._entries??[]).map(t=>t.entry_id).filter(t=>o.has(t)),n=s.cover_colors??[],r=i.map(t=>{const e=s.entry_ids.indexOf(t);return e>=0?n[e]??null:null});this._emitWithColors(s,r,{entry_ids:i})}_onToggle(t,e){this._emit({...this._baseConfig(),[t]:e})}_onNorthOffsetChange(t){const e=parseFloat(t.target.value),s=Number.isFinite(e)?e:0;this._emit({...this._baseConfig(),north_offset:s})}_onTitleChange(t){const e=t.target.value,s=this._baseConfig();if(e)this._emit({...s,title:e});else{const{title:t,...e}=s;this._emit(e)}}render(){if(!this._config)return q;const t=new Set(this._config.entry_ids);return V`
      <div class="form">
        <div class="section">
          <label class="field-label">${Dt("editor.compass.instances",this.hass)}</label>
          <div class="hint">${Dt("editor.compass.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(t)}
        </div>

        <div class="section">
          <label class="field-label">${Dt("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${Dt("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?V`
              <div class="section">
                <label class="field-label">${Dt("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${Dt("editor.compass.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((t,e)=>{const s=this._config.cover_colors?.[e]??null,o=s??ve(e),i=this._entries?.find(e=>e.entry_id===t);return V`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${o}
                        @change=${t=>this._onCoverColorChange(e,t.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${i?.title??t}</span>
                        <span class="toggle-desc"
                          >${s||Dt("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!s}
                        @click=${()=>this._onCoverColorReset(e)}
                      >
                        ${Dt("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:q}

        <div class="section">
          <label class="field-label">${Dt("editor.compass.display",this.hass)}</label>
          ${qe.map(t=>V`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${this._config[t.key]??t.defaultOn}
                  @change=${e=>this._onToggle(t.key,e.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${Dt(t.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${Dt(t.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${Dt("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${Dt("editor.common.north_offset_hint",this.hass)}</div>
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
    `}_renderEntryPicker(t){return this._entriesError?V`<div class="error">
        ${Dt("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?V`
        <div class="error">
          ${Dt("editor.common.no_entries",this.hass)}
          <code>${Dt("editor.common.no_entries_path",this.hass)}</code>${Dt("editor.common.no_entries_then",this.hass)}
        </div>
      `:V`
      <div class="entry-list">
        ${this._entries.map(e=>V`
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
    `:V`<div class="hint">${Dt("editor.common.loading_entries",this.hass)}</div>`}};Ge.styles=r`
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
  `,t([_t({attribute:!1})],Ge.prototype,"hass",void 0),t([gt()],Ge.prototype,"_config",void 0),t([gt()],Ge.prototype,"_entries",void 0),t([gt()],Ge.prototype,"_entriesError",void 0),Ge=t([ht(bt)],Ge);let Ze=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(t){if(!t||!Array.isArray(t.entry_ids)||0===t.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(t.entry_ids.some(t=>"string"!=typeof t||0===t.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");this._config={...t,entry_ids:[...t.entry_ids]}}getCardSize(){return 4}static async getConfigElement(){return document.createElement(bt)}static getStubConfig(){return{type:`custom:${yt}`,entry_ids:[]}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Kt(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Bt(this.hass).then(t=>{this._registry=t,this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return V`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Dt("tile.registry_failed",this.hass,{error:this._registryError}):Dt("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const t=[],e=[];for(const s of this._config.entry_ids){const o=Lt(this.hass,{type:this._config.type,entry_id:s},this._registry);o?t.push(o):e.push(s)}if(0===t.length)return V`<ha-card>
        <div class="empty">
          <p><strong>${Dt("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${Dt("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const s=this._config;return V`
      <ha-card>
        ${s.title?V`<div class="card-header">${s.title}</div>`:q}
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
          .northOffsetDeg=${Vt(s.north_offset??0)}
        ></acp-sky-compass>
        ${e.length>0?V`<div class="warn dim">
              ${Dt("root.compass_not_found",this.hass,{entries:e.join(", ")})}
            </div>`:q}
      </ha-card>
    `}};Ze.styles=r`
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
  `,t([_t({attribute:!1})],Ze.prototype,"hass",void 0),t([gt()],Ze.prototype,"_config",void 0),t([gt()],Ze.prototype,"_registry",void 0),t([gt()],Ze.prototype,"_registryError",void 0),Ze=t([ht(yt)],Ze),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===yt)||window.customCards.push({type:yt,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const Ye=["sky","elevation","decision","covers","overrides","climate"];let Xe=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let t=null,e=null;return(s,o,i)=>{const n=o.entry_id??"";return null!==t&&t.registry===i&&t.hass===s&&t.entryId===n||(t={registry:i,hass:s,entryId:n},e=Lt(s,o,i)),e}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(t){if(!t?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...t},null===this._registry){const e=Gt.get(t.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(ft)}static getStubConfig(){return{type:`custom:${vt}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(t){null!==this._registry&&this._config&&this.hass&&(t.has("hass")||t.has("_registry")||t.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Kt(this.hass,t=>{const e=new Set(Yt(this._registry??[],this._config?.entry_id??"").map(t=>t.entity_id));(function(t,e){return"create"===t.action||e.has(t.entity_id)})(t,e)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Bt(this.hass).then(t=>{const e=this._config?.entry_id;if(e){const s=Yt(t,e);(null===this._registry||function(t,e){if(t.length!==e.length)return!0;const s=new Map(t.map(t=>[t.entity_id,Zt(t)]));for(const t of e)if(s.get(t.entity_id)!==Zt(t))return!0;return!1}(Yt(this._registry,e),s))&&(this._registry=t,Gt.set(e,s))}else this._registry=t;this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const t=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=t);const e=t-this._debounceFirstAt,s=this._DEBOUNCE_MAX-e,o=Math.min(this._DEBOUNCE_DELAY,s);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),o<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},o)}get _sections(){return this._config?.show_sections??Ye}_renderHeader(t,e){const s=At[t.cover_type]??"mdi:window-shutter",o=t.entities.integration_enabled_switch,i=t.entities.automatic_control_switch,n=!o||"on"===this.hass.states[o]?.state,r=!i||"on"===this.hass.states[i]?.state;return V`
      <div class="header">
        <ha-icon .icon=${s}></ha-icon>
        <span class="title">${t.entry_title}</span>
        <span class="spacer"></span>
        ${o?V`<acp-header-pill
              .on=${n}
              .readonly=${!e.integration_enabled}
              .label=${Dt(n?"header.on":"header.off",this.hass)}
              title=${Dt("header.integration_enabled",this.hass)}
              @pill-click=${()=>this._toggle(o)}
            ></acp-header-pill>`:q}
        ${i?V`<acp-header-pill
              .on=${r}
              .readonly=${!e.automatic_control}
              .label=${Dt("header.auto",this.hass)}
              title=${Dt("header.automatic_control",this.hass)}
              @pill-click=${()=>this._toggle(i)}
            ></acp-header-pill>`:q}
      </div>
    `}_toggle(t){const e=t.split(".")[0];this.hass.callService(e,"toggle",{entity_id:t})}_renderLoading(){return V`
      <ha-card>
        <div class="empty">
          <p class="dim">${Dt("root.loading_registry",this.hass)}</p>
        </div>
      </ha-card>
    `}_renderEmpty(t){const e=this._config.entry_id,s=this._registry?.length??0,o=this._registry?.filter(t=>t.config_entry_id===e&&"adaptive_cover_pro"===t.platform).length;return V`
      <ha-card>
        <div class="empty">
          <p><strong>${Dt("root.no_entities_title",this.hass)}</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${e}</code></p>
          <ul class="diag">
            <li>Reason: <code>${t}</code></li>
            <li>Registry entries loaded: <code>${s}</code></li>
            <li>ACP entities matching entry_id: <code>${o??"—"}</code></li>
            ${this._registryError?V`<li>Registry fetch error: <code>${this._registryError}</code></li>`:q}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const t=this._discovered;if(!t)return this._renderEmpty("no matching entities after unique_id lookup");const e=(s=this._config,{...Mt,...s?.controls});var s;const o=this._sections;return V`
      <ha-card>
        ${this._renderHeader(t,e)}
        <div class="body ${this._config.compact?"compact":""}">
          ${o.includes("sky")?V`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${[t]}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .northOffsetDeg=${Vt(this._config.north_offset??0)}
              ></acp-sky-compass>`:q}
          ${o.includes("elevation")?V`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:q}
          ${o.includes("decision")?V`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                ?show-summary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:q}
          ${o.includes("covers")?V`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:q}
          ${o.includes("overrides")?V`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                .resetEnabled=${e.reset_manual_override}
              ></acp-overrides-panel>`:q}
          ${o.includes("climate")?V`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:q}
        </div>
        ${this._config.show_version?V`<div class="footer dim">
              ${Dt("root.footer_version",this.hass,{version:mt})}
            </div>`:q}
      </ha-card>
    `}};Xe.styles=r`
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
  `,t([_t({attribute:!1})],Xe.prototype,"hass",void 0),t([gt()],Xe.prototype,"_config",void 0),t([gt()],Xe.prototype,"_registry",void 0),t([gt()],Xe.prototype,"_registryError",void 0),t([gt()],Xe.prototype,"_discovered",void 0),Xe=t([ht(vt)],Xe),window.customCards=window.customCards||[],window.customCards.push({type:vt,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${mt} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{Xe as AdaptiveCoverProCard};
