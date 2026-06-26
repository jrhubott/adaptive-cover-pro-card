/*! adaptive-cover-pro-card v2.8.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function e(e,t,s,i){var o,n=arguments.length,r=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,s,r):o(t,s))||r);return n>3&&r&&Object.defineProperty(t,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let n=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new n(s,e,i)},a=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",f=_.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},b=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);o?.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...u(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(t,s.type);this._$Em=e,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const n=o.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){if(void 0!==e){const n=this.constructor;if(!1===i&&(o=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??b)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,f?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,A=e=>e,k=$.trustedTypes,C=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,O=`<${z}>`,M=document,I=()=>M.createComment(""),F=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,P="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,N=/>/g,D=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,V=/"/g,G=/^(?:script|style|textarea|title)$/i,K=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),L=K(1),q=K(2),U=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),Y=new WeakMap,Q=M.createTreeWalker(M,129);function H(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const X=(e,t)=>{const s=e.length-1,i=[];let o,n=2===t?"<svg>":3===t?"<math>":"",r=j;for(let t=0;t<s;t++){const s=e[t];let a,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===j?"!--"===l[1]?r=R:void 0!==l[1]?r=N:void 0!==l[2]?(G.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=D):void 0!==l[3]&&(r=D):r===D?">"===l[0]?(r=o??j,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?D:'"'===l[3]?V:B):r===V||r===B?r=D:r===R||r===N?r=j:(r=D,o=void 0);const h=r===D&&e[t+1].startsWith("/>")?" ":"";n+=r===j?s+O:c>=0?(i.push(a),s.slice(0,c)+S+s.slice(c)+E+h):s+E+(-2===c?t:h)}return[H(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Z{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,n=0;const r=e.length-1,a=this.parts,[l,c]=X(e,t);if(this.el=Z.createElement(l,s),Q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Q.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(S)){const t=c[n++],s=i.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?ie:"?"===r[1]?oe:"@"===r[1]?ne:se}),i.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:o}),i.removeAttribute(e));if(G.test(i.tagName)){const e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],I()),Q.nextNode(),a.push({type:2,index:++o});i.append(e[t],I())}}}else if(8===i.nodeType)if(i.data===z)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=i.data.indexOf(E,e+1));)a.push({type:7,index:o}),e+=E.length-1}o++}}static createElement(e,t){const s=M.createElement("template");return s.innerHTML=e,s}}function J(e,t,s=e,i){if(t===U)return t;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=F(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(t=J(e,o._$AS(e,t.values),o,i)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??M).importNode(t,!0);Q.currentNode=i;let o=Q.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new te(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new re(o,this,e)),this._$AV.push(t),a=s[++r]}n!==a?.index&&(o=Q.nextNode(),n++)}return Q.currentNode=M,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),F(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==U&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Z.createElement(H(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ee(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=Y.get(e.strings);return void 0===t&&Y.set(e.strings,t=new Z(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const o of e)i===t.length?t.push(s=new te(this.O(I()),this.O(I()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class se{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(e,t=this,s,i){const o=this.strings;let n=!1;if(void 0===o)e=J(this,e,t,0),n=!F(e)||e!==this._$AH&&e!==U,n&&(this._$AH=e);else{const i=e;let r,a;for(e=o[0],r=0;r<o.length-1;r++)a=J(this,i[s+r],t,r),a===U&&(a=this._$AH[r]),n||=!F(a)||a!==this._$AH[r],a===W?e=W:e!==W&&(e+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends se{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class oe extends se{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class ne extends se{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??W)===U)return;const s=this._$AH,i=e===W&&s!==W||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const ae=$.litHtmlPolyfillSupport;ae?.(Z,te),($.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let o=i._$litPart$;if(void 0===o){const e=s?.renderBefore??null;i._$litPart$=o=new te(t.insertBefore(I(),e),e,void 0,s??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ue={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},pe=(e=ue,t,s)=>{const{kind:i,metadata:o}=s;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const o=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,o,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];t.call(this,s),this.requestUpdate(i,o,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function _e(e){return(t,s)=>"object"==typeof s?pe(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function ge(e){return _e({...e,state:!0,attribute:!1})}function me(e,t,s){if(!e)return!0;for(const i of s)if(i&&e.states[i]!==t.states[i])return!0;return!1}const fe="2.8.0",ve="adaptive-cover-pro-card",ye="adaptive-cover-pro-card-editor",be="adaptive-cover-pro-sky-compass-card",we="adaptive-cover-pro-sky-compass-card-editor",xe="adaptive-cover-pro-tile-card",$e="adaptive-cover-pro-tile-card-editor",Ae="adaptive-cover-pro-decision-card",ke="adaptive-cover-pro-decision-card-editor",Ce="adaptive_cover_pro",Se=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default","floor_clamp"],Ee={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},ze={force:"handler.force",weather:"handler.weather",manual:"handler.manual",custom_position:"handler.custom_position",motion:"handler.motion",cloud:"handler.cloud",climate:"handler.climate",glare_zone:"handler.glare_zone",solar:"handler.solar",default:"handler.default",floor_clamp:"handler.floor_clamp"},Oe={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},Me={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open"},Ie={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds"},Fe={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion"},Te={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Solar tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Motion",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"},off_schedule:{label:"Off-schedule",bg:"rgba(96, 125, 139, 0.22)",fg:"#37474f"}},Pe={auto:"badge.auto",manual:"badge.manual",force:"badge.force",weather:"badge.weather",glare_zone:"badge.glare_zone",climate:"badge.climate",cloud:"badge.cloud",custom_position:"badge.custom_position",solar:"badge.solar",motion:"badge.motion",off:"badge.off",off_schedule:"badge.off_schedule"},je={auto:"mdi:autorenew",manual:"mdi:hand-back-right",force:"mdi:flash",weather:"mdi:shield-sun",glare_zone:"mdi:weather-sunny-alert",climate:"mdi:thermostat",cloud:"mdi:weather-cloudy",custom_position:"mdi:bookmark",solar:"mdi:white-balance-sunny",motion:"mdi:motion-sensor",off:"mdi:power",off_schedule:"mdi:clock-alert-outline"},Re={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Ne={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","sensor:solar_calculation":"solar_calculation_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"},De={en:{handler:{force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Weather safety",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Solar tracking",motion:"Motion idle",off:"Off",off_schedule:"Off-schedule",floor_suffix:" ↥",safety:"Safety"},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window field of view",fov_exit:"Sun leaves window field of view"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks.",solar_only_note:"Solar geometry only — does not reflect manual overrides, custom positions, cloud suppression, or weather."},dialog:{configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"↥",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Motion",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Motion",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"expires in {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance",mode_off:"Climate mode off",standby:"Standby",threshold_low:"low",threshold_high:"high",threshold_summer_outside:"summer",reason:{outside_time_window:"Outside the operating time window",thresholds_not_met:"Temperatures within the comfort band — no action needed",other_mode_active:"Another control mode is currently active",readings_unavailable:"Temperature readings unavailable",mode_off:"Climate mode is turned off"}},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in FOV",in_fov:"in FOV",in_fov_tooltip:"Sun is currently within this window’s field of view",none:"—",sun:"Sun",moon:"Moon",sun_up_not_hitting:"Sun (up, not hitting)",sun_below_horizon:"Sun (below horizon)",window_fov:"Window FOV",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_target:"Cover target",cover_held:"Cover position (held)",window_normal:"Window azimuth",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"FOV {left} left / {right} right{elev}",window_normal_tooltip:"Window azimuth: {bearing}",cover_position_target:"Target: {pct}%",cover_position_target_awning:"Target (extended): {pct}%",cover_position_actual:"Actual: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",target_solar:"Solar target: {pct}",click_to_set:"Click to set position",target_tooltip:"Target {pct}%",target_tooltip_override:"Would-be solar target {pct}% — cover is held by manual override"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor",outside_schedule:"Outside schedule — automatic control paused",outside_schedule_tooltip:"The configured schedule window is not active, so automatic positioning is paused.",solar_would_be:"solar {pct}",next_change_in:"Next adjustment allowed in {time}"},solar:{title:"Solar Calculation",axis_position:"Position axis",axis_tilt:"Tilt axis",group_inputs:"Inputs",group_intermediates:"Intermediates",group_output:"Output",show_all:"Show all {count} values",show_less:"Show less",no_target:"No solar target — {status}",status:{direct_sun:"Direct sun",fov_exit:"Default · FOV exit",elevation_limit:"Default · elevation limit",sunset_offset:"Default · sunset offset",blind_spot:"Default · blind spot",default:"Default"},field:{sol_elev_deg:"Sun elevation",gamma_deg:"Relative azimuth (γ)",position_pct:"Position",effective_distance_m:"Effective distance",adjusted_height_m:"Adjusted height",safety_margin:"Safety margin",awn_angle_deg:"Awning angle",vertical_position_m:"Vertical position",length_m:"Extension length",slat_angle_raw_deg:"Slat angle",tilt_mode:"Tilt mode",max_degrees:"Max angle"}},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Motion timeout pending",motion_detected:"Motion detected",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found."},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"FOV: {from} → {to}",fov_windows:"FOV: {windows}",fov_window_named:"{name}: {windows}",no_fov_today:"Sun does not enter FOV today",placeholder:"Sun elevation chart unavailable.",schedule:"Schedule {from} – {to}",schedule_from:"Schedule from {from}",schedule_until:"Schedule until {to}",schedule_start_tooltip:"Schedule start",schedule_end_tooltip:"Schedule end"},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",support_alt:"Buy me a coffee",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window FOV, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with FOV band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, motion tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy; shows standby when climate mode is off or inactive",section_solar_label:"Solar calculation",section_solar_desc:"Raw solar geometry breakdown (inputs → intermediates → output); requires the integration’s solar_calculation sensor",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑■▼ controls",show_badge:"Show contextual badge",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Solar tracking",badge_force:"Force override",badge_weather:"Weather safety",badge_manual:"Manual override",badge_custom_position:"Custom position",badge_motion:"Motion",badge_climate:"Climate",badge_glare_zone:"Glare zone",badge_cloud:"Cloud suppression",show_compass:"Show sun compass in dialog",show_elevation_chart:"Show sun-today chart in dialog",show_solar_calc:"Show solar calculation in dialog",show_motion_icon:"Show motion indicator",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth.",toggle_elevation_chart_label:"Sun-today chart",toggle_elevation_chart_desc:"Elevation-vs-time chart below the compass, with FOV band and elevation limits."},decision:{title:"Title (optional)",compact_label:"Compact mode",compact_desc:"Tighter rows; also hides inactive handlers.",hide_inactive_handlers_label:"Hide inactive handlers",hide_inactive_handlers_desc:"Show only the winner and actively matched pipeline handlers.",show_decision_summary_label:"Show decision summary",show_decision_summary_desc:'Render a plain-English "Why this position?" sentence above the strip.'}}},fr:{handler:{force:"Dérogation forcée",weather:"Sécurité météo",manual:"Dérogation manuelle",custom_position:"Position personnalisée",motion:"Délai d'inactivité du mouvement",cloud:"Désactivation par temps nuageux",climate:"Climatique",glare_zone:"Zone d'éblouissement",solar:"Suivi solaire",default:"Par défaut",floor_clamp:"Plancher"},badge:{auto:"Auto",manual:"Manuel",force:"Forcé",weather:"Sécurité météo",glare_zone:"Éblouissement",climate:"Climatique",cloud:"Nuageux",custom_position:"Personnalisé",solar:"Suivi solaire",motion:"Inactivité",off:"Off",off_schedule:"Hors planning",floor_suffix:" ↥",safety:"Sécurité"},forecast:{event:{sunrise:"Lever du soleil",sunset:"Coucher du soleil",fov_enter:"Le soleil entre dans le champ de vision de la fenêtre",fov_exit:"Le soleil quitte le champ de vision de la fenêtre"},hover_hint:"Survolez la courbe pour voir l'heure et la position prévue ; survolez une ligne colorée pour voir l'événement qu'elle indique.",solar_only_note:"Géométrie solaire uniquement — ne tient pas compte des dérogations manuelles, des positions personnalisées, de la désactivation par temps nuageux ni des conditions météo."},dialog:{configure_integration:"Configurer l'intégration",open_device_page:"Ouvrir la page de l'appareil",close:"Fermer",target:"Cible",resume_auto:"Reprendre l'automatique",hide_advanced:"▼ Masquer les options avancées",show_advanced:"▶ Afficher les options avancées",custom_positions:"Positions personnalisées",floor_tooltip:"Plancher — cette valeur force une position minimale au-dessus du calcul automatique",floor:"↥",disable_slot:"Désactiver le créneau {slot}",enable_slot:"Activer le créneau {slot}",on:"Activé",off:"Désactivé",controls:"Commandes",automatic:"Automatique",climate:"Climatique",motion:"Mouvement",toggle_hint:"{label} {state} — appuyez pour basculer",state_on:"activé",state_off:"désactivé",todays_forecast:"Prévisions du jour"},overrides:{title:"Dérogations",manual:"Manuel",force:"Forcé",motion:"Mouvement",active:"Actif",off:"Désactivé",ends_in:"se termine dans {time}",active_count:"{count} dérogation(s) active(s)",timeout:"expire dans {time}",reset_manual:"Réinitialiser le mode manuel"},climate:{title:"Climatique",active:"Actif : {strategy}",indoor:"Intérieur",outdoor:"Extérieur",presence:"Présence",sunny:"Ensoleillé",lux:"Lux",irradiance:"Irradiance",mode_off:"Mode climatique désactivé",standby:"En veille",threshold_low:"bas",threshold_high:"haut",threshold_summer_outside:"été",reason:{outside_time_window:"En dehors de la plage horaire de fonctionnement",thresholds_not_met:"Températures dans la plage de confort — aucune action requise",other_mode_active:"Un autre mode de contrôle est actuellement actif",readings_unavailable:"Relevés de température indisponibles",mode_off:"Le mode climatique est désactivé"}},compass:{placeholder_no_entries:"Aucune instance Adaptive Cover Pro sélectionnée.",placeholder_no_sun:"Le capteur solaire n'est pas encore renseigné.",sun_tooltip:"Soleil : {az} az / {el} él",sunrise_tooltip:"Lever du soleil : {time}",sunset_tooltip:"Coucher du soleil : {time}",moon_tooltip:"Lune : {phase} ({pct}%)",sun_path_tooltip:"Trajectoire solaire (aujourd'hui)",in_fov_check:"✓ dans le champ de vision",in_fov:"dans le champ de vision",in_fov_tooltip:"Le soleil est actuellement dans le champ de vision de cette fenêtre",none:"—",sun:"Soleil",moon:"Lune",sun_up_not_hitting:"Soleil (levé, ne frappe pas)",sun_below_horizon:"Soleil (sous l’horizon)",window_fov:"Champ de vision",sun_path:"Trajectoire solaire",sunrise:"Lever du soleil",sunset:"Coucher du soleil",cover_target:"Cible du store",cover_held:"Position du store (maintenue)",window_normal:"Azimut de la fenêtre",stat_sun:"Soleil : ",stat_azi:"Azi : ",stat_elev:"Élév : ",stat_window:"Fenêtre : ",active_sun_arc:"Arc solaire actif {from} – {to}{elev}",fov_arc:"Champ de vision {left} gauche / {right} droite{elev}",window_normal_tooltip:"Azimut de la fenêtre : {bearing}",cover_position_target:"Cible : {pct}%",cover_position_target_awning:"Cible (déployé) : {pct}%",cover_position_actual:"Réel : {pct}%",blind_spot:"Soleil masqué : {from} - {to}",elev_suffix:" · élév {min}–{max}"},covers:{placeholder:"Aucun store signalé par l'intégration.",title:"Stores",target:"Cible : {pct}",target_solar:"Cible solaire : {pct}",click_to_set:"Cliquer pour définir la position",target_tooltip:"Cible {pct}%",target_tooltip_override:"Cible solaire théorique {pct}% — le store est maintenu par la commande manuelle"},decision:{placeholder:"La trace de décision n'est pas encore renseignée.",pipeline:"Pipeline",winner:"Actif : {name}",summary_tooltip:"Pourquoi cette position ?",not_evaluated:"non évalué",floor_suffix:" plancher",outside_schedule:"Hors planning — contrôle automatique en pause",outside_schedule_tooltip:"La fenêtre de planning configurée n'est pas active, le positionnement automatique est donc en pause.",solar_would_be:"solaire {pct}",next_change_in:"Prochain ajustement autorisé dans {time}"},solar:{title:"Calcul solaire",axis_position:"Axe de position",axis_tilt:"Axe d'inclinaison",group_inputs:"Entrées",group_intermediates:"Intermédiaires",group_output:"Sortie",show_all:"Afficher les {count} valeurs",show_less:"Afficher moins",no_target:"Pas de cible solaire — {status}",status:{direct_sun:"Soleil direct",fov_exit:"Par défaut · sortie du champ de vision",elevation_limit:"Par défaut · limite d'élévation",sunset_offset:"Par défaut · décalage coucher du soleil",blind_spot:"Par défaut · angle mort",default:"Par défaut"},field:{sol_elev_deg:"Élévation du soleil",gamma_deg:"Azimut relatif (γ)",position_pct:"Position",effective_distance_m:"Distance effective",adjusted_height_m:"Hauteur ajustée",safety_margin:"Marge de sécurité",awn_angle_deg:"Angle du store",vertical_position_m:"Position verticale",length_m:"Longueur d'extension",slat_angle_raw_deg:"Angle des lamelles",tilt_mode:"Mode d'inclinaison",max_degrees:"Angle maximal"}},header:{on:"ON",off:"OFF",integration_enabled:"Intégration activée",auto:"Auto",automatic_control:"Contrôle automatique"},tile:{motion_pending:"Délai de mouvement en cours",motion_detected:"Mouvement détecté",open:"Ouvrir",stop:"Arrêter",close:"Fermer",resume_aria:"Reprendre le contrôle automatique",registry_failed:"Échec de la récupération du registre : {error}",loading:"Chargement…",entry_not_found:"Instance Adaptive Cover Pro {entry} introuvable."},formatters:{expired:"expiré"},elevation:{title:"Soleil aujourd'hui",fov_window:"Champ de vision : {from} → {to}",fov_windows:"Champ de vision : {windows}",fov_window_named:"{name} : {windows}",no_fov_today:"Pas de soleil dans le champ de vision aujourd'hui",placeholder:"Graphique d'élévation solaire indisponible.",schedule:"Programmation {from} – {to}",schedule_from:"Programmation à partir de {from}",schedule_until:"Programmation jusqu'à {to}",schedule_start_tooltip:"Début de programmation",schedule_end_tooltip:"Fin de programmation"},root:{loading_registry:"Chargement du registre Adaptive Cover Pro…",no_entities_title:"Aucune entité Adaptive Cover Pro trouvée",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Aucune entité Adaptive Cover Pro correspondante",compass_configured:"Instances configurées : {entries}",compass_not_found:"Instances introuvables : {entries}"},editor:{common:{entry_id:"Instance Adaptive Cover Pro",support_alt:"Offrez-moi un café",title_optional:"Titre (facultatif)",title_placeholder:"ex. Fenêtres côté ouest",north_offset:"Décalage nord de la boussole (°)",north_offset_hint:"Faites pivoter la boussole dans le sens horaire pour que « haut » corresponde à votre carte. Par défaut : 0.",loading_entries:"Chargement des entrées de configuration Adaptive Cover Pro…",load_failed:"Échec du chargement des entrées de configuration : {error}",no_entries:"Aucune entrée de configuration Adaptive Cover Pro trouvée. Ajoutez une instance sous",no_entries_path:"Paramètres → Appareils et services",no_entries_then:", puis revenez ici.",entry_id_manual_placeholder:"Saisir manuellement l'ID d'entrée de configuration",entry_id_fallback_label:"ID d'entrée",unknown_entry:"(inconnu : {entry})",reset:"Réinitialiser"},main:{sections:"Sections",sections_hint:"Activer ou désactiver les parties de la carte affichées.",section_sky_label:"Boussole céleste",section_sky_desc:"Soleil par rapport au champ de vision de la fenêtre, tracé polaire",section_elevation_label:"Soleil aujourd'hui",section_elevation_desc:"Graphique élévation/temps avec bande FOV et curseur temps réel",section_decision_label:"Bande de décision",section_decision_desc:"Les 10 gestionnaires du pipeline avec la ligne gagnante mise en évidence",section_covers_label:"Positions des stores",section_covers_desc:"Barres position réelle/cible par store ; cliquer pour définir la position",section_overrides_label:"Panneau des dérogations",section_overrides_desc:"Tuiles Manuel, Forcé, Mouvement + bouton de réinitialisation",section_climate_label:"Panneau climatique",section_climate_desc:"Stratégie été/hiver/intermédiaire ; affiche le mode veille si le mode climatique est désactivé ou inactif",section_solar_label:"Calcul solaire",section_solar_desc:"Décomposition de la géométrie solaire brute (entrées → intermédiaires → sortie) ; nécessite le capteur solar_calculation de l’intégration",controls:"Commandes",controls_hint:"Afficher en lecture seule (visible mais non cliquable).",integration_pill_label:"Bouton ON/OFF de l'intégration",integration_pill_desc:"Permettre de basculer l'intégration depuis l'en-tête de la carte.",automatic_pill_label:"Bouton contrôle automatique",automatic_pill_desc:"Permettre de basculer le contrôle automatique depuis l'en-tête de la carte.",reset_button_label:"Bouton de réinitialisation de la dérogation manuelle",reset_button_desc:"Permettre d'appuyer sur la tuile de réinitialisation dans le panneau des dérogations.",display:"Affichage",compact_label:"Mode compact",compact_desc:"Espacement réduit entre les sections.",show_compass_stats_label:"Afficher les statistiques de la boussole",show_compass_stats_desc:"Azi, Élév, ∠ et angle de fenêtre sous la boussole céleste.",show_compass_legend_label:"Afficher la légende de la boussole",show_compass_legend_desc:"Clé de couleur sous la boussole céleste.",show_moon_label:"Afficher la lune sur la boussole",show_moon_desc:"Position et phase de la lune en superposition sur la boussole céleste.",hide_inactive_label:"Masquer les gestionnaires inactifs",hide_inactive_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs."},tile:{name:"Titre personnalisé",icon:"Icône personnalisée",cover:"Entité de store",layout:"Disposition",show_position:"Afficher la position %",show_state:"Afficher l'état (Ouvert/Fermé)",show_decision_summary:"Afficher le résumé de décision",show_controls:"Afficher les commandes ↑■▼",show_badge:"Afficher le badge contextuel",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Suivi solaire",badge_force:"Dérogation forcée",badge_weather:"Sécurité météo",badge_manual:"Dérogation manuelle",badge_custom_position:"Position personnalisée",badge_motion:"Mouvement",badge_climate:"Climatique",badge_glare_zone:"Zone d'éblouissement",badge_cloud:"Suppression nuageuse",show_compass:"Afficher la boussole solaire dans le dialogue",show_elevation_chart:"Afficher le graphique du soleil dans le dialogue",show_solar_calc:"Afficher le calcul solaire dans le dialogue",show_motion_icon:"Afficher l'indicateur de mouvement",tap_action:"Action au toucher",hold_action:"Action au maintien",double_tap_action:"Action au double toucher",cover_blank_hint:"Laisser vide pour utiliser automatiquement le premier store géré.",layout_option_one_line:"Une ligne (compact)",layout_option_detailed:"Détaillé (titre, état, indicateurs)"},compass:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition à la boussole.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"SVG plus petit, légende masquée.",toggle_legend_label:"Légende",toggle_legend_desc:"Échantillons de couleur et étiquettes d'instance sous la boussole.",toggle_stats_label:"Statistiques",toggle_stats_desc:"Soleil + lignes numériques par fenêtre.",toggle_moon_label:"Lune",toggle_moon_desc:"Afficher la position et la phase de la lune.",toggle_cardinals_label:"Points cardinaux",toggle_cardinals_desc:"Lettres N/E/S/O autour de la boussole.",toggle_blind_spot_label:"Zones de soleil masqué",toggle_blind_spot_desc:"Secteurs hachurés pour la plage où le soleil est masqué de chaque fenêtre.",toggle_sun_path_label:"Trajectoire solaire",toggle_sun_path_desc:"Arc solaire du jour dans le ciel.",toggle_sunrise_sunset_label:"Repères lever / coucher du soleil",toggle_sunrise_sunset_desc:"Petits points aux azimuts de lever et coucher du soleil.",toggle_cover_fill_label:"Remplissage de fermeture du store",toggle_cover_fill_desc:"Secteur intérieur indiquant le taux de fermeture de chaque store.",toggle_window_arrow_label:"Flèche de normale de fenêtre",toggle_window_arrow_desc:"Ligne du centre vers l'azimut de chaque fenêtre.",toggle_elevation_chart_label:"Graphique du soleil",toggle_elevation_chart_desc:"Graphique élévation/temps sous la boussole, avec bande FOV et limites d'élévation."},decision:{title:"Titre (facultatif)",compact_label:"Mode compact",compact_desc:"Lignes plus serrées ; masque aussi les gestionnaires inactifs.",hide_inactive_handlers_label:"Masquer les gestionnaires inactifs",hide_inactive_handlers_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs.",show_decision_summary_label:"Afficher le résumé de décision",show_decision_summary_desc:"Afficher une phrase explicite « Pourquoi cette position ? » au-dessus de la bande."}}}};function Be(e,t){const s=t.split(".");let i=e;for(const e of s){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function Ve(e,t){return t?e.replace(/\{(\w+)\}/g,(e,s)=>Object.prototype.hasOwnProperty.call(t,s)?String(t[s]):e):e}function Ge(e,t,s){const i=function(e){const t=(e?.locale?.language??e?.language??"en").toLowerCase().split("-")[0];return t in De?t:"en"}(t),o=Be(De[i],e);if(void 0!==o)return Ve(o,s);if("en"!==i){const t=Be(De.en,e);if(void 0!==t)return Ve(t,s)}return e}const Ke=e=>(...t)=>({_$litDirective$:e,values:t});class Le{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const qe=(e,t)=>{const s=e._$AN;if(void 0===s)return!1;for(const e of s)e._$AO?.(t,!1),qe(e,t);return!0},Ue=e=>{let t,s;do{if(void 0===(t=e._$AM))break;s=t._$AN,s.delete(e),e=t}while(0===s?.size)},We=e=>{for(let t;t=e._$AM;e=t){let s=t._$AN;if(void 0===s)t._$AN=s=new Set;else if(s.has(e))break;s.add(e),He(t)}};function Ye(e){void 0!==this._$AN?(Ue(this),this._$AM=e,We(this)):this._$AM=e}function Qe(e,t=!1,s=0){const i=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(t)if(Array.isArray(i))for(let e=s;e<i.length;e++)qe(i[e],!1),Ue(i[e]);else null!=i&&(qe(i,!1),Ue(i));else qe(this,e)}const He=e=>{2==e.type&&(e._$AP??=Qe,e._$AQ??=Ye)};class Xe extends Le{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,s){super._$AT(e,t,s),We(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(qe(this,e),Ue(this))}setValue(e){if((()=>void 0===this._$Ct.strings)())this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}const Ze=[12,16];function Je(e,t,s=0){const i=(e-90+s)*Math.PI/180;return{x:t*Math.cos(i),y:t*Math.sin(i)}}function et(e){return 1-Math.max(0,Math.min(90,e))/90}function tt(e,t,s,i=0,o=0){const n=e=>(e%360+360)%360,r=n(e),a=n(t);let l=a-r;l<0&&(l+=360);const c=l>180?1:0,d=Je(r,s,o),h=Je(a,s,o);if(i<=0)return`M 0 0 L ${d.x} ${d.y} A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y} Z`;const u=Je(a,i,o),p=Je(r,i,o);return[`M ${d.x} ${d.y}`,`A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y}`,`L ${u.x} ${u.y}`,`A ${i} ${i} 0 ${c} 0 ${p.x} ${p.y}`,"Z"].join(" ")}function st(e,t,s=0){return Je(e,et(t),s)}function it(e){return(e%360+360)%360}function ot(e,t,s,i){const o=i??0;let n=-1,r=-1;for(let i=t;i<=s&&i<e.length;i++)e[i].elevation>o&&(-1===n&&(n=i),r=i);return-1===n?null:{wedgeStart:e[n].azimuth,wedgeEnd:e[r].azimuth}}function nt(e,t,s){const i=(e-t)/864e5;return Math.max(0,Math.min(s,i*s))}function rt(e,t,s){return((e-t)%360+360)%360<=((s-t)%360+360)%360}function at(e,t,s,i){return rt(s,e,t)||rt(i,e,t)||rt(e,s,i)||rt(t,s,i)}function lt(e,t,s,i){const o="cover_awning"===t?e/100:1-e/100;return Math.min(s*o,i)}function ct(e,t,s){return e&&null!=t&&Number.isFinite(t)?t===s?null:t:null}function dt(e,t){return e<.5?-4*t*e:4*t*(1-e)}function ht(e,t,s,i,o){const n=Je(s,1),r=-n.y,a=n.x,l=e-n.x*i,c=t-n.y*i;return`M ${e} ${t} L ${l+r*o} ${c+a*o} L ${l-r*o} ${c-a*o} Z`}let ut=class extends ce{constructor(){super(...arguments),this.text="",this.cursorX=0,this.cursorY=0,this.offset=Ze,this.visible=!1,this._x=0,this._y=0}connectedCallback(){super.connectedCallback(),this.hasAttribute("role")||this.setAttribute("role","tooltip")}updated(){if(!this.visible)return;this.setAttribute("aria-hidden","false");const e=this.shadowRoot?.querySelector(".bubble"),t=e?.offsetWidth??0,s=e?.offsetHeight??0,i="undefined"!=typeof window?window.innerWidth:0,o="undefined"!=typeof window?window.innerHeight:0,{x:n,y:r}=function(e){const{cursorX:t,cursorY:s,ttW:i,ttH:o,vpW:n,vpH:r}=e,[a,l]=e.offset??Ze;let c=t+a,d=!1;c+i>n&&(c=t-a-i,d=!0),c<0&&(c=0);let h=s+l;return h+o>r&&(h=s-l-o),h<0&&(h=0),{x:c,y:h,flipped:d}}({cursorX:this.cursorX,cursorY:this.cursorY,ttW:t,ttH:s,vpW:i,vpH:o,offset:this.offset});n!==this._x&&(this._x=n),r!==this._y&&(this._y=r)}render(){return this.visible?L`<div class="bubble" style="transform: translate3d(${this._x}px, ${this._y}px, 0)">
      ${this.text}
    </div>`:(this.setAttribute("aria-hidden","true"),W)}};ut.styles=r`
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
  `,e([_e({type:String})],ut.prototype,"text",void 0),e([_e({type:Number})],ut.prototype,"cursorX",void 0),e([_e({type:Number})],ut.prototype,"cursorY",void 0),e([_e({attribute:!1})],ut.prototype,"offset",void 0),e([_e({type:Boolean,reflect:!0})],ut.prototype,"visible",void 0),e([ge()],ut.prototype,"_x",void 0),e([ge()],ut.prototype,"_y",void 0),ut=e([he("acp-floating-tooltip")],ut);const pt={enabled:!0,offset:Ze,delay:400};function _t(e){void 0!==e.enabled&&(pt.enabled=e.enabled),void 0!==e.offset&&(pt.offset=e.offset),void 0!==e.delay&&(pt.delay=e.delay)}const gt="acp-floating-tooltip-bubble",mt=new class{constructor(){this._el=null,this._refs=0}get id(){return gt}retain(){this._refs+=1,this._ensure()}release(){this._refs=Math.max(0,this._refs-1)}_ensure(){if("undefined"==typeof document)return null;if(this._el&&this._el.isConnected)return this._el;const e=document.createElement("acp-floating-tooltip");return e.id=gt,document.body.appendChild(e),this._el=e,e}show(e,t,s,i){const o=this._ensure();o&&(o.text=e,o.cursorX=t,o.cursorY=s,o.offset=i,o.visible=!0)}move(e,t){this._el&&this._el.visible&&(this._el.cursorX=e,this._el.cursorY=t)}hide(){this._el&&(this._el.visible=!1)}_reset(){this._el&&this._el.parentNode&&this._el.parentNode.removeChild(this._el),this._el=null,this._refs=0}},ft=Ke(class extends Xe{constructor(e){if(super(e),this._el=null,this._text="",this._offset=Ze,this._delay=400,this._enabled=!0,this._openTimer=null,this._shown=!1,this._retained=!1,this._lastX=0,this._lastY=0,this._onEnter=e=>this._handleEnter(e),this._onMove=e=>this._handleMove(e),this._onLeave=()=>this._dismiss(),this._onFocus=()=>this._handleFocus(),this._onBlur=()=>this._dismiss(),this._onKey=e=>{"Escape"===e.key&&this._dismiss()},this._onScroll=()=>this._dismiss(),6!==e.type)throw new Error("tooltip() can only be used as an element-part directive")}render(e,t){return W}update(e,[t,s]){const i=e.element;return this._text=t??"",this._offset=s?.offset??pt.offset,this._delay=s?.delay??pt.delay,this._enabled=s?.enabled??pt.enabled,this._el!==i?(this._teardown(),this._el=i,this._wire()):this._applyAttributes(),this.render(t,s)}_wire(){const e=this._el;e&&(this._applyAttributes(),this._enabled&&(mt.retain(),this._retained=!0,e.addEventListener("pointerenter",this._onEnter),e.addEventListener("pointermove",this._onMove),e.addEventListener("pointerleave",this._onLeave),e.addEventListener("focusin",this._onFocus),e.addEventListener("focusout",this._onBlur),e.addEventListener("keydown",this._onKey),window.addEventListener("scroll",this._onScroll,!0)))}_applyAttributes(){const e=this._el;e&&(this._enabled?(e.removeAttribute("title"),e.setAttribute("data-tooltip",this._text),e.setAttribute("aria-describedby",mt.id)):(e.removeAttribute("data-tooltip"),e.removeAttribute("aria-describedby"),e.removeAttribute("acp-tt-shown"),e.setAttribute("title",this._text)))}_handleEnter(e){this._lastX=e.clientX,this._lastY=e.clientY,this._armOpen()}_handleFocus(){const e=this._el;if(e&&"function"==typeof e.getBoundingClientRect){const t=e.getBoundingClientRect();this._lastX=t.left+t.width/2,this._lastY=t.bottom}this._armOpen()}_armOpen(){null===this._openTimer&&(this._openTimer=setTimeout(()=>{this._openTimer=null,this._open()},this._delay))}_open(){this._el&&(mt.show(this._text,this._lastX,this._lastY,this._offset),this._shown=!0,this._el.setAttribute("acp-tt-shown",""))}_handleMove(e){this._lastX=e.clientX,this._lastY=e.clientY,this._shown&&mt.move(this._lastX,this._lastY)}_dismiss(){null!==this._openTimer&&(clearTimeout(this._openTimer),this._openTimer=null),this._shown&&(mt.hide(),this._shown=!1),this._el?.removeAttribute("acp-tt-shown")}_teardown(){const e=this._el;e&&(this._dismiss(),e.removeEventListener("pointerenter",this._onEnter),e.removeEventListener("pointermove",this._onMove),e.removeEventListener("pointerleave",this._onLeave),e.removeEventListener("focusin",this._onFocus),e.removeEventListener("focusout",this._onBlur),e.removeEventListener("keydown",this._onKey),"undefined"!=typeof window&&window.removeEventListener("scroll",this._onScroll,!0),this._retained&&(mt.release(),this._retained=!1),this._el=null)}disconnected(){this._teardown()}reconnected(){this._wire()}});function vt(){let e=null;return(t,s,i)=>{const o=s.entry_id??"";if(!o)return e=null,null;const n=null!==e&&e.registry===i&&e.entryId===o,r=n?e.base:yt(o,i);if(!r)return e={registry:i,entryId:o,base:null,devices:null,posState:null,ctrlState:null,result:null},null;const a=t.devices,l=r.entities.target_position_sensor,c=r.entities.control_status_sensor,d=l?t.states[l]:void 0,h=c?t.states[c]:void 0;if(n&&null!==e&&null!==e.result&&e.devices===a&&e.posState===d&&e.ctrlState===h)return e.result;const u=bt(t,o,r);return e={registry:i,entryId:o,base:r,devices:a,posState:d,ctrlState:h,result:u},u}}function yt(e,t){const s={},i=`${e}_`;let o,n=!1;for(const r of t){if(r.config_entry_id!==e)continue;if(r.platform!==Ce)continue;if(n=!0,!o&&r.device_id&&(o=r.device_id),!r.unique_id.startsWith(i))continue;const t=r.unique_id.slice(i.length),a=r.entity_id.split(".")[0],l=Ne[`${a}:${t}`];l&&(s[l]=r.entity_id)}return n&&0!==Object.keys(s).length?{entities:s,deviceId:o}:null}function bt(e,t,s){const{entities:i,deviceId:o}=s,n=e;let r=t;if(n.devices)for(const e of Object.values(n.devices))if(e.config_entries?.includes(t)){r=e.name_by_user??e.name??t;break}const a=[],l=i.target_position_sensor;if(l){const t=e.states[l]?.attributes?.actual_positions;t&&a.push(...Object.keys(t))}let c="cover_blind";const d=i.control_status_sensor;if(d){const t=e.states[d]?.attributes;t?.cover_type&&(c=t.cover_type)}return{entry_id:t,entry_title:r,cover_type:c,entities:i,managed_covers:a,device_id:o}}function wt(e,t,s){const i=t.entry_id;if(!i)return null;const o=yt(i,s);return o?bt(e,i,o):null}async function xt(e){return(await e.callWS({type:"config_entries/get",domain:Ce})).filter(e=>e.domain===Ce).map(e=>({entry_id:e.entry_id,title:e.title}))}async function $t(e){return e.callWS({type:"config/entity_registry/list"})}function At(e,t){let s=null,i=!1;return e.connection.subscribeEvents(e=>t(e.data),"entity_registry_updated").then(e=>{i?e():s=e}).catch(()=>{}),()=>{i=!0,s&&s()}}let kt=null,Ct=null;function St(){return kt}function Et(e,t=!1){if(Ct)return Ct;if(!t&&kt)return Promise.resolve(kt);const s=$t(e).then(e=>(kt=e,Ct=null,e)).catch(e=>{throw Ct=null,e});return Ct=s,s}function zt(e){return`acp-card:registry:v1:${e}`}const Ot={get(e){try{const t=localStorage.getItem(zt(e));if(!t)return null;const s=JSON.parse(t);return 1!==s.schemaVersion?null:s}catch{return null}},set(e,t){try{const s={schemaVersion:1,cardVersion:fe,fetchedAt:Date.now(),entries:t};localStorage.setItem(zt(e),JSON.stringify(s))}catch{}},invalidate(e){try{localStorage.removeItem(zt(e))}catch{}},clear(){try{const e="acp-card:registry:v1:",t=[];for(let s=0;s<localStorage.length;s++){const i=localStorage.key(s);i?.startsWith(e)&&t.push(i)}t.forEach(e=>localStorage.removeItem(e))}catch{}}};function Mt(e){return`${e.entity_id}|${e.unique_id}|${e.platform}|${e.config_entry_id??""}`}function It(e,t,s){return e.filter(e=>e.config_entry_id===t&&void 0===s)}let Ft=class extends ce{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return L`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        ${ft(this.title)}
        aria-disabled=${this.readonly?"true":W}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};Ft.styles=r`
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
  `,e([_e({type:Boolean})],Ft.prototype,"on",void 0),e([_e({type:Boolean})],Ft.prototype,"readonly",void 0),e([_e({type:String})],Ft.prototype,"label",void 0),e([_e({type:String})],Ft.prototype,"title",void 0),Ft=e([he("acp-header-pill")],Ft);const Tt=Ke(class extends Le{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const s=e.element.classList;for(const e of this.st)e in t||(s.remove(e),this.st.delete(e));for(const e in t){const i=!!t[e];i===this.st.has(e)||this.nt?.has(e)||(i?(s.add(e),this.st.add(e)):(s.remove(e),this.st.delete(e)))}return U}});function Pt(e,t){const s=t.entities.target_position_sensor;if(!s)return null;const i=parseFloat(e.states[s]?.state??"");return Number.isNaN(i)?null:i}function jt(e,t){const s=t.entities.target_position_sensor;if(!s)return null;const i=e.states[s]?.attributes,o=i?.raw_calculated_position;return"number"==typeof o&&Number.isFinite(o)?o:null}function Rt(e,t){const s=t.entities.target_position_sensor;if(!s)return null;const i=e.states[s]?.attributes;return i?.actual_positions?function(e){const t=Object.values(e).filter(e=>"number"==typeof e);return 0===t.length?null:t.reduce((e,t)=>e+t,0)/t.length}(i.actual_positions):null}function Nt(e,t){const s=t.entities.manual_override_binary;return!!s&&"on"===e.states[s]?.state}function Dt(e,t){const s=Pt(e,t);return ct(Nt(e,t),jt(e,t),s)??s}function Bt(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Vt,Gt,Kt={exports:{}},Lt=(Vt||(Vt=1,Gt=Kt,function(){var e=Math.PI,t=Math.sin,s=Math.cos,i=Math.tan,o=Math.asin,n=Math.atan2,r=Math.acos,a=e/180,l=864e5,c=2440588,d=2451545;function h(e){return new Date((e+.5-c)*l)}function u(e){return function(e){return e.valueOf()/l-.5+c}(e)-d}var p=23.4397*a;function _(e,o){return n(t(e)*s(p)-i(o)*t(p),s(e))}function g(e,i){return o(t(i)*s(p)+s(i)*t(p)*t(e))}function m(e,o,r){return n(t(e),s(e)*t(o)-i(r)*s(o))}function f(e,i,n){return o(t(i)*t(n)+s(i)*s(n)*s(e))}function v(e,t){return a*(280.16+360.9856235*e)-t}function y(e){return a*(357.5291+.98560028*e)}function b(s){return s+a*(1.9148*t(s)+.02*t(2*s)+3e-4*t(3*s))+102.9372*a+e}function w(e){var t=b(y(e));return{dec:g(t,0),ra:_(t,0)}}var x={getPosition:function(e,t,s){var i=a*-s,o=a*t,n=u(e),r=w(n),l=v(n,i)-r.ra;return{azimuth:m(l,o,r.dec),altitude:f(l,o,r.dec)}}},$=x.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];x.addTime=function(e,t,s){$.push([e,t,s])};var A=9e-4;function k(t,s,i){return A+(t+s)/(2*e)+i}function C(e,s,i){return d+e+.0053*t(s)-.0069*t(2*i)}function S(e,i,o,n,a,l,c){var d=function(e,i,o){return r((t(e)-t(i)*t(o))/(s(i)*s(o)))}(e,o,n);return C(k(d,i,a),l,c)}function E(e){var i=a*(134.963+13.064993*e),o=a*(93.272+13.22935*e),n=a*(218.316+13.176396*e)+6.289*a*t(i),r=5.128*a*t(o),l=385001-20905*s(i);return{ra:_(n,r),dec:g(n,r),dist:l}}function z(e,t){return new Date(e.valueOf()+t*l/24)}x.getTimes=function(t,s,i,o){var n,r,l,c,d,p=a*-i,_=a*s,m=function(e){return-2.076*Math.sqrt(e)/60}(o=o||0),f=function(t,s){return Math.round(t-A-s/(2*e))}(u(t),p),v=k(0,p,f),w=y(v),x=b(w),E=g(x,0),z=C(v,w,x),O={solarNoon:h(z),nadir:h(z-.5)};for(n=0,r=$.length;n<r;n+=1)d=z-((c=S(((l=$[n])[0]+m)*a,p,_,E,f,w,x))-z),O[l[1]]=h(d),O[l[2]]=h(c);return O},x.getMoonPosition=function(e,o,r){var l=a*-r,c=a*o,d=u(e),h=E(d),p=v(d,l)-h.ra,_=f(p,c,h.dec),g=n(t(p),i(c)*s(h.dec)-t(h.dec)*s(p));return _+=function(e){return e<0&&(e=0),2967e-7/Math.tan(e+.00312536/(e+.08901179))}(_),{azimuth:m(p,c,h.dec),altitude:_,distance:h.dist,parallacticAngle:g}},x.getMoonIllumination=function(e){var i=u(e||new Date),o=w(i),a=E(i),l=149598e3,c=r(t(o.dec)*t(a.dec)+s(o.dec)*s(a.dec)*s(o.ra-a.ra)),d=n(l*t(c),a.dist-l*s(c)),h=n(s(o.dec)*t(o.ra-a.ra),t(o.dec)*s(a.dec)-s(o.dec)*t(a.dec)*s(o.ra-a.ra));return{fraction:(1+s(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},x.getMoonTimes=function(e,t,s,i){var o=new Date(e);i?o.setUTCHours(0,0,0,0):o.setHours(0,0,0,0);for(var n,r,l,c,d,h,u,p,_,g,m,f,v,y=.133*a,b=x.getMoonPosition(o,t,s).altitude-y,w=1;w<=24&&(n=x.getMoonPosition(z(o,w),t,s).altitude-y,p=((d=(b+(r=x.getMoonPosition(z(o,w+1),t,s).altitude-y))/2-n)*(u=-(h=(r-b)/2)/(2*d))+h)*u+n,g=0,(_=h*h-4*d*n)>=0&&(m=u-(v=Math.sqrt(_)/(2*Math.abs(d))),f=u+v,Math.abs(m)<=1&&g++,Math.abs(f)<=1&&g++,m<-1&&(m=f)),1===g?b<0?l=w+m:c=w+m:2===g&&(l=w+(p<0?f:m),c=w+(p<0?m:f)),!l||!c);w+=2)b=r;var $={};return l&&($.rise=z(o,l)),c&&($.set=z(o,c)),l||c||($[p>0?"alwaysUp":"alwaysDown"]=!0),$},Gt.exports=x}()),Kt.exports),qt=Bt(Lt);const Ut=new Map;function Wt(e,t,s,i=10){const o=`${e},${t},${s.getTime()},${i}`,n=Ut.get(o);if(n)return Ut.delete(o),Ut.set(o,n),n;const r=[],a=s.getTime()+864e5;for(let o=s.getTime();o<=a;o+=60*i*1e3){const s=new Date(o),i=qt.getPosition(s,e,t);r.push({t:s,elevation:180*i.altitude/Math.PI,azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360})}if(Ut.set(o,r),Ut.size>4){const e=Ut.keys().next().value;void 0!==e&&Ut.delete(e)}return r}function Yt(e=new Date){const t=new Date(e);return t.setHours(0,0,0,0),t}function Qt(e,t=new Date){if(!e)return Yt(t);const s=new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(t),[i,o,n]=s.split("-").map(Number),r=Date.UTC(i,o-1,n,0,0,0),a=function(e,t){const s=new Intl.DateTimeFormat("en-US",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(t),i={};for(const e of s)"literal"!==e.type&&(i[e.type]=Number(e.value));return Date.UTC(i.year,i.month-1,i.day,i.hour,i.minute,i.second)-t.getTime()}(e,new Date(r));return new Date(r-a)}function Ht(e,t,s,i){const o=((t-s)%360+360)%360;return((e-o)%360+360)%360<=((((t+i)%360+360)%360-o)%360+360)%360}function Xt(e,t,s,i){const o=[];let n=-1;for(let r=0;r<e.length;r++){const a=e[r];a.elevation>0&&Ht(a.azimuth,t,s,i)?-1===n&&(n=r):-1!==n&&(o.push({startIdx:n,endIdx:r-1}),n=-1)}return-1!==n&&o.push({startIdx:n,endIdx:e.length-1}),o}function Zt(e,t,s=new Date){const i=qt.getMoonPosition(s,e,t),o=qt.getMoonIllumination(s);return{azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360,elevation:180*i.altitude/Math.PI,phase:o.phase,fraction:o.fraction,phaseName:Jt(o.phase)}}function Jt(e){return e<.0625||e>=.9375?"New Moon":e<.1875?"Waxing Crescent":e<.3125?"First Quarter":e<.4375?"Waxing Gibbous":e<.5625?"Full Moon":e<.6875?"Waning Gibbous":e<.8125?"Last Quarter":"Waning Crescent"}function es(e){return null==e||Number.isNaN(e)?"—":`${Math.round(e)}%`}function ts(e){return null==e||Number.isNaN(e)?"—":`${e.toFixed(1)}°`}function ss(e,t){if(!e)return"—";const s=new Date(e);return Number.isNaN(s.getTime())?"—":s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",timeZone:t})}function is(e,t){if(!e)return"—";const s=new Date(e).getTime();if(Number.isNaN(s))return"—";const i=Math.round((s-Date.now())/1e3);return i<=0?t?Ge("formatters.expired",t):"expired":function(e){if(null==e||Number.isNaN(e))return"—";const t=Math.max(0,Math.round(e));if(t<60)return`${t}s`;const s=Math.floor(t/60);return s<60?`${s}m ${t%60}s`:`${Math.floor(s/60)}h ${s%60}m`}(i)}const os=new Set(["outside_fov","in_fov_not_valid","hitting"]),ns={night:"sun night",hitting:"sun valid",in_fov_not_valid:"sun in-fov",outside_fov:"sun up"};function rs(e){return e.belowHorizon?"night":e.sunState&&os.has(e.sunState)?e.sunState:e.directSunValid?"hitting":e.inFov?"in_fov_not_valid":"outside_fov"}const as=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function ls(e){const t=as.length;return as[(e%t+t)%t]}function cs(e,t){return"string"==typeof e&&e.length>0?{color:e,isOverride:!0}:{color:ls(t),isOverride:!1}}const ds="data:image/png;base64,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",hs=110;let us=0,ps=class extends ce{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set,this._legendMoonMaskId="acp-legend-moon-"+us++}shouldUpdate(e){return e.size>1||!e.has("hass")||me(e.get("hass"),this.hass,this._relevantIds())}_relevantIds(){const e=[];for(const t of this.discovered_list){const s=t.entities;e.push(s.sun_sensor,s.target_position_sensor,s.manual_override_binary,s.sun_infront_binary,s.decision_trace_sensor,s.start_sensor,s.end_sensor)}return e}_toggleEntry(e){const t=new Set(this._hiddenEntries);t.has(e)?t.delete(e):t.add(e),this._hiddenEntries=t}_sunFor(e){const t=e.entities.sun_sensor;if(!t)return null;const s=this.hass.states[t];if(!s)return null;const i=parseFloat(s.state);return Number.isNaN(i)?null:{...s.attributes,window_azimuth:s.attributes.window_azimuth}}_sunInfrontFor(e){const t=e.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}_sunDotStateFor(e,t){const s=e.entities.decision_trace_sensor?this.hass.states[e.entities.decision_trace_sensor]?.attributes:void 0;return rs({belowHorizon:t.elevation<=0,sunState:s?.sun_state??null,directSunValid:s?.direct_sun_valid??!1,inFov:!0===t.in_fov})}_readActiveAzimuth(e){if(!e)return null;const t=this.hass.states[e];if(!t)return null;if("unavailable"===t.state||"unknown"===t.state)return null;const s=t.attributes.azimuth;return"number"==typeof s&&Number.isFinite(s)?s:null}_buildOverlays(){const e=[];return this.discovered_list.forEach((t,s)=>{const i=this._sunFor(t);if(!i)return;const o=t.entities.sun_sensor,n=parseFloat(this.hass.states[o]?.state??"0"),{color:r,isOverride:a}=cs(this.coverColors?.[s],s);e.push({d:t,sun:i,sunAzi:n,sunInfront:this._sunInfrontFor(t),dotState:this._sunDotStateFor(t,i),coverPos:Dt(this.hass,t),actualPos:Rt(this.hass,t),coverType:t.cover_type,color:r,isOverride:a,index:s})}),e}render(){if(!this.hass)return W;if(!this.discovered_list||0===this.discovered_list.length)return L`<div class="placeholder">${Ge("compass.placeholder_no_entries",this.hass)}</div>`;const e=this._buildOverlays();if(0===e.length)return L`<div class="placeholder">${Ge("compass.placeholder_no_sun",this.hass)}</div>`;const t=e.filter(e=>!this._hiddenEntries.has(e.d.entry_id)),s=it(this.northOffsetDeg),i=e.length>1,o=e[0],n=o.sunAzi,r=o.sun.elevation,a=st(n,r,s),l={night:-1,outside_fov:0,in_fov_not_valid:1,hitting:2},c=r<=0?"night":e.reduce((e,t)=>l[t.dotState]>l[e]?t.dotState:e,"outside_fov"),d=ns[c],{latitude:h,longitude:u,time_zone:p}=this.hass.config,_=void 0!==h&&void 0!==u?Wt(h,u,Qt(p)):[],g=this.showMoon&&void 0!==h&&void 0!==u?Zt(h,u):null,m=null!==g&&g.elevation>0,f=g?dt(g.phase,6):0,v=m?st(g.azimuth,g.elevation,s):null,y=v?v.x*hs:0,b=v?v.y*hs:0,w=this.showSunPath?function(e){const t=[];let s=-1;for(let i=0;i<e.length;i++)e[i].elevation>0?-1===s&&(s=i):-1!==s&&(t.push({startIdx:s,endIdx:i-1}),s=-1);return-1!==s&&t.push({startIdx:s,endIdx:e.length-1}),t}(_).map(e=>_.slice(e.startIdx,e.endIdx+1).map(e=>{const t=st(e.azimuth,e.elevation,s);return{x:t.x*hs,y:t.y*hs,elev:e.elevation}})):[],x=[122,127,135],$=[245,197,24],A=e=>{const t=Math.sqrt(Math.max(0,Math.min(1,e/90))),s=x.map((e,s)=>Math.round(e+($[s]-e)*t));return`rgb(${s[0]},${s[1]},${s[2]})`},k=this.showSunPath&&this.showSunriseSunset?w.filter(e=>e.length>1).map((e,t)=>{const s=e[0],i=e[e.length-1],o=i.x-s.x,n=i.y-s.y,r=o*o+n*n||1,a=e.filter((t,s)=>s%6==0||s===e.length-1).map(e=>({offset:100*Math.max(0,Math.min(1,((e.x-s.x)*o+(e.y-s.y)*n)/r)),color:A(e.elev)}));return{id:`sun-path-grad-${t}`,x1:s.x,y1:s.y,x2:i.x,y2:i.y,stops:a}}):[],C=e=>this.showSunriseSunset?`url(#sun-path-grad-${e})`:"var(--warning-color, gold)",S=Je(0,124,s),E=Je(90,124,s),z=Je(180,124,s),O=Je(270,124,s),M=Je(0,hs,s),I=Je(180,hs,s),F=Je(90,hs,s),T=Je(270,hs,s),P=Ge("compass.sun_tooltip",this.hass,{az:ts(n),el:ts(r)}),j=null!==g?Ge("compass.moon_tooltip",this.hass,{phase:g.phaseName,pct:Math.round(100*g.fraction)}):"",R=Ge("compass.sun_path_tooltip",this.hass);return L`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${q`
            <defs>
              ${m?q`
                <mask id="moon-phase-mask">
                  <circle cx=${y} cy=${b} r=${6} fill="white"></circle>
                  <circle cx=${y+f} cy=${b} r=${6} fill="black"></circle>
                </mask>
              `:W}
              ${k.map(e=>q`
                <linearGradient id=${e.id} gradientUnits="userSpaceOnUse"
                  x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}>
                  ${e.stops.map(e=>q`<stop offset="${e.offset}%" stop-color=${e.color}></stop>`)}
                </linearGradient>
              `)}
            </defs>

            <circle class="grid" r=${hs}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${hs/3}></circle>
            <line class="grid thin" x1=${M.x} y1=${M.y} x2=${I.x} y2=${I.y}></line>
            <line class="grid thin" x1=${F.x} y1=${F.y} x2=${T.x} y2=${T.y}></line>

            ${t.map(e=>this._renderEntryLayers(e,i,s,_))}

            ${this.showSunPath&&w.length?q`<g ${ft(R)}>${w.filter(e=>e.length>1).flatMap((e,t)=>{const s=e.map(e=>`${e.x},${e.y}`).join(" "),i=q`<polyline class="sun-path-line" points=${s}
                        style="stroke:${C(t)}"></polyline>`,o=[];for(let t=0;t<e.length;t+=10){const s=e[t],i=e[Math.max(0,t-1)],n=e[Math.min(e.length-1,t+1)],r=180*Math.atan2(n.y-i.y,n.x-i.x)/Math.PI,a=this.showSunriseSunset?A(s.elev):"var(--warning-color, gold)";o.push(q`<path class="sun-path-chevron"
                          transform=${`translate(${s.x} ${s.y}) rotate(${r})`}
                          d="M -2.4 -3 L 1.8 0 L -2.4 3 L -0.7 0 Z"
                          style=${`fill:${a}`}></path>`)}return[i,...o]})}</g>`:W}

            ${this.showCardinals?q`
              <text class="cardinal" x=${S.x} y=${S.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${z.x} y=${z.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${O.x} y=${O.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:W}

            ${m?q`
              <g ${ft(j)}>
                <circle class="moon-outline" cx=${y} cy=${b} r=${6}></circle>
                <image
                  class="moon-img"
                  href=${ds}
                  x=${y-6}
                  y=${b-6}
                  width=${12}
                  height=${12}
                  mask="url(#moon-phase-mask)"
                ></image>
              </g>
            `:W}

            <g ${ft(P)}>
              <circle class=${d} cx=${a.x*hs} cy=${a.y*hs} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(e,i,d,g):W}
        ${this.showStats?this._renderStats(e,i):W}
      </div>
    `}_renderEntryLayers(e,t,s=0,i=[]){const o=it(e.sun.window_azimuth),n=it(o-e.sun.fov_left),r=it(o+e.sun.fov_right),a=this._readActiveAzimuth(e.d.entities.start_sensor),l=this._readActiveAzimuth(e.d.entities.end_sensor),c=null!==a&&null!==l;let d,h;if(c)({wedgeStart:d,wedgeEnd:h}=function(e,t,s,i,o){const n=((s-i)%360+360)%360,r=i+o,a=((t-n)%360+360)%360,l=e=>e<=r?e:e-r<360-e?r:0,c=l(((e-n)%360+360)%360),d=l(a);return c===d?{wedgeStart:n,wedgeEnd:((n+r)%360+360)%360}:{wedgeStart:((n+Math.min(c,d))%360+360)%360,wedgeEnd:((n+Math.max(c,d))%360+360)%360}}(it(a),it(l),o,e.sun.fov_left,e.sun.fov_right));else{const t=function(e,t,s,i,o){if(void 0===o)return null;const n=it(t-s),r=s+i,a=e.filter(e=>((e.azimuth-n)%360+360)%360<=r&&e.elevation>o);return 0===a.length?null:{wedgeStart:a[0].azimuth,wedgeEnd:a[a.length-1].azimuth}}(i,o,e.sun.fov_left,e.sun.fov_right,e.sun.min_elevation);d=t?t.wedgeStart:n,h=t?t.wedgeEnd:r}const u=Je(o,hs,s),{outer:p,inner:_}=(g=e.sun.min_elevation,m=e.sun.max_elevation,f=hs,void 0!==g&&void 0!==m&&g>m?{outer:f,inner:0}:{outer:void 0!==g?f*et(g):f,inner:void 0!==m?f*et(m):0});var g,m,f;const v=null!==e.coverPos?lt(e.coverPos,e.coverType,hs,p):null,y=null!==e.actualPos?lt(e.actualPos,e.coverType,hs,p):null,b=e.sun.blind_spot_range?[it((w=o)-(x=e.sun.blind_spot_range)[1]),it(w-x[0])]:null;var w,x;const $=b?tt(b[0],b[1],hs,0,s):null,A=tt(d,h,p,_,s),k=c&&(d!==n||h!==r),C=k?tt(n,r,p,_,s):"",S=null!==v&&v>_?tt(d,h,v,_,s):"",E=null!==y&&y>_?tt(d,h,y,_,s):"",z=[];for(const t of Xt(i,o,e.sun.fov_left,e.sun.fov_right)){const o=ot(i,t.startIdx,t.endIdx,e.sun.min_elevation);o&&!at(o.wedgeStart,o.wedgeEnd,d,h)&&z.push({fov:tt(o.wedgeStart,o.wedgeEnd,p,_,s),cover:this.showCoverFill&&null!==v&&v>_?tt(o.wedgeStart,o.wedgeEnd,v,_,s):"",actual:this.showCoverFill&&null!==y&&y>_?tt(o.wedgeStart,o.wedgeEnd,y,_,s):"",from:o.wedgeStart,to:o.wedgeEnd})}const O=t?`${e.d.entry_title}: `:"",M=void 0!==e.sun.min_elevation||void 0!==e.sun.max_elevation?Ge("compass.elev_suffix",this.hass,{min:ts(e.sun.min_elevation??0),max:ts(e.sun.max_elevation??90)}):"",I=c?`${O}${Ge("compass.active_sun_arc",this.hass,{from:ts(d),to:ts(h),elev:M})}`:`${O}${Ge("compass.fov_arc",this.hass,{left:ts(e.sun.fov_left),right:ts(e.sun.fov_right),elev:M})}`,F=`${O}${Ge("compass.window_normal_tooltip",this.hass,{bearing:ts(o)})}`,T=[];if(null!==e.coverPos){const t="cover_awning"===e.coverType?"compass.cover_position_target_awning":"compass.cover_position_target";T.push(`${O}${Ge(t,this.hass,{pct:e.coverPos})}`),null!==e.actualPos&&T.push(Ge("compass.cover_position_actual",this.hass,{pct:Math.round(e.actualPos)}))}const P=T.join("\n"),j=b?`${O}${Ge("compass.blind_spot",this.hass,{from:ts(b[0]),to:ts(b[1])})}`:"",R=t||e.isOverride,N=t||e.isOverride,D=R?`fill: ${e.color}; stroke: ${e.color};`:"",B=N?`fill: ${e.color}; stroke: ${e.color};`:"",V=R?`fill: ${e.color}; stroke: ${e.color};`:"",G=R?`stroke: ${e.color};`:"",K=R?`fill: ${e.color};`:"",L=this.showCoverFill&&""!==S,U=this.showBlindSpot&&!!$,Y=this.showWindowArrow,Q=`M 0 0 L ${u.x} ${u.y}`,H=R?`fill: ${e.color}; stroke: ${e.color};`:"",X=ht(u.x,u.y,o+s,9,5),Z="display: none;",J=`${O}${Ge("compass.fov_arc",this.hass,{left:ts(e.sun.fov_left),right:ts(e.sun.fov_right),elev:M})}`;return q`<g class="entry-overlay">
      ${k?q`<g ${ft(J)}>
              <path class="fov fov-static" style=${D} d=${C}></path>
            </g>`:W}
      <g ${ft(I)}>
        <path class="fov" style=${D} d=${A}></path>
      </g>
      ${z.map(e=>{const t=`${O}${Ge("compass.active_sun_arc",this.hass,{from:ts(e.from),to:ts(e.to),elev:M})}`;return q`<g ${ft(t)}>
          <path class="fov-extra" style=${D} d=${e.fov}></path>
          ${e.cover?q`<path class="cover-fill-extra" style=${B} d=${e.cover}></path>`:W}
          ${e.actual?q`<path class="cover-actual-extra" style=${B} d=${e.actual}></path>`:W}
        </g>`})}
      <g class="arrow-group" style=${Y?"":Z} ${ft(F)}>
        <path class="window" style=${G} d=${Q}></path>
        <path class="window-head" style=${H} d=${X}></path>
        <circle class="window-base" style=${K} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" style=${L?"":Z} ${ft(P)}>
        <path class="cover-fill" style=${B} d=${S}></path>
        ${this.showCoverFill&&E?q`<path class="cover-actual" style=${B} d=${E}></path>`:W}
      </g>
      <g class="blind-group" style=${U?"":Z} ${ft(j)}>
        <path class="blind-spot" style=${V} d=${$??""}></path>
      </g>
    </g>`}_legendSunGlyph(e){return L`<span class="glyph"
      ><svg viewBox="-8 -8 16 16" width="20" height="20">
        ${q`<circle class=${e} cx="0" cy="0" r="5"></circle>`}
      </svg></span
    >`}_legendMoonGlyph(e){const t=e?dt(e.phase,4):0,s=this._legendMoonMaskId;return L`<span class="glyph"
      ><svg viewBox="-5 -5 10 10" width="11" height="11">
        ${q`
          <defs>
            <mask id=${s}>
              <circle cx="0" cy="0" r=${4} fill="white"></circle>
              <circle cx=${t} cy="0" r=${4} fill="black"></circle>
            </mask>
          </defs>
          <circle class="moon-outline" cx="0" cy="0" r=${4}></circle>
          <image
            class="moon-img"
            href=${ds}
            x=${-4}
            y=${-4}
            width=${8}
            height=${8}
            mask=${`url(#${s})`}
          ></image>
        `}
      </svg></span
    >`}_legendWindowGlyph(e){const t=e?`stroke: ${e};`:"",s=e?`fill: ${e};`:"",i=ht(5,0,90,4,2);return L`<span class="glyph"
      ><svg class="window-glyph" viewBox="-6 -6 12 12" width="13" height="13">
        ${q`
          <line class="window" style=${t} x1="-5" y1="0" x2="1.5" y2="0"></line>
          <path class="window-head" style=${s} d=${i}></path>
        `}
      </svg></span
    >`}_renderLegend(e,t,s,i){const o=e[0]?.isOverride?e[0].color??null:null,n=e[0],r=null!==n?.coverPos&&null!=n?.actualPos&&void 0!==n?.coverPos&&Math.round(n.actualPos)!==Math.round(n.coverPos);return t?L`
        <div class="legend">
          <div>${this._legendSunGlyph(s)} ${Ge("compass.sun",this.hass)}</div>
          ${this.showMoon?L`<div>${this._legendMoonGlyph(i)} ${Ge("compass.moon",this.hass)}</div>`:W}
          ${e.map(e=>L`
              <button
                type="button"
                class=${Tt({"entry-toggle":!0,hidden:this._hiddenEntries.has(e.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(e.d.entry_id)}
                @click=${()=>this._toggleEntry(e.d.entry_id)}
              >
                <span class="licell"
                  ><span class="swatch entry" style="background: ${e.color}"></span
                ></span>
                ${e.d.entry_title}
                ${e.sunInfront?L`<span class="status valid">${Ge("compass.in_fov_check",this.hass)}</span>`:e.sun.in_fov?L`<span class="status in-fov">${Ge("compass.in_fov",this.hass)}</span>`:L`<span class="status">${Ge("compass.none",this.hass)}</span>`}
              </button>
            `)}
        </div>
      `:L`<div class="legend">
      <div>${this._legendSunGlyph(s)} ${Ge("compass.sun",this.hass)}</div>
      ${this.showMoon?L`<div>${this._legendMoonGlyph(i)} ${Ge("compass.moon",this.hass)}</div>`:W}
      <div>
        <span class="licell"
          ><span
            class="swatch fov"
            style=${o?`background: ${o}`:""}
          ></span
        ></span>
        ${Ge("compass.window_fov",this.hass)}
      </div>
      ${this.showCoverFill?L`<div>
            <span class="licell"
              ><span
                class="swatch cover-fill-swatch"
                style=${o?`background: ${o}`:""}
              ></span
            ></span>
            ${Ge("compass.cover_target",this.hass)}
          </div>`:W}
      ${this.showCoverFill&&r?L`<div>
            <span class="licell"
              ><span
                class="swatch cover-actual-swatch"
                style=${o?`border-color: ${o}`:""}
              ></span
            ></span>
            ${Ge("compass.cover_held",this.hass)}
          </div>`:W}
      ${this.showWindowArrow?L`<div>
            ${this._legendWindowGlyph(o)} ${Ge("compass.window_normal",this.hass)}
          </div>`:W}
    </div>`}_renderStats(e,t){const s=e[0],i=s.sunAzi,o=s.sun.elevation,{latitude:n,longitude:r}=this.hass.config,a=this.showMoon&&void 0!==n&&void 0!==r?Zt(n,r):null;return t?L`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${Ge("compass.stat_sun",this.hass)}${ts(i)} /
              ${ts(o)}</span
            >
            ${this.showMoon&&a?L`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:W}
          </div>
          ${e.map(e=>L`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${e.color}"></span>
                <span class="entry-name">${e.d.entry_title}</span>
                <span>∠${ts(e.sun.gamma)}</span>
                <span>W ${ts(it(e.sun.window_azimuth))}</span>
                ${e.sun.in_fov?L`<span
                      class="status in-fov"
                      ${ft(Ge("compass.in_fov_tooltip",this.hass))}
                      >✓</span
                    >`:W}
              </div>
            `)}
        </div>
      `:L`<div class="stats dim">
      <span>${Ge("compass.stat_azi",this.hass)}${ts(i)}</span>
      <span>${Ge("compass.stat_elev",this.hass)}${ts(o)}</span>
      <span>∠: ${ts(s.sun.gamma)}</span>
      <span
        >${Ge("compass.stat_window",this.hass)}${ts(it(s.sun.window_azimuth))}</span
      >
      ${this.showMoon&&a?L`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:W}
    </div>`}};function _s(e){let t=null,s=null;const i=6e4-Date.now()%6e4;return t=setTimeout(()=>{t=null,e(),s=setInterval(e,6e4)},i),()=>{null!==t&&(clearTimeout(t),t=null),null!==s&&(clearInterval(s),s=null)}}ps.styles=r`
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
  `,e([_e({attribute:!1})],ps.prototype,"hass",void 0),e([_e({attribute:!1})],ps.prototype,"discovered_list",void 0),e([_e({type:Boolean,reflect:!0})],ps.prototype,"compact",void 0),e([_e({attribute:!1})],ps.prototype,"showStats",void 0),e([_e({attribute:!1})],ps.prototype,"showLegend",void 0),e([_e({attribute:!1})],ps.prototype,"showMoon",void 0),e([_e({attribute:!1})],ps.prototype,"showCardinals",void 0),e([_e({attribute:!1})],ps.prototype,"showBlindSpot",void 0),e([_e({attribute:!1})],ps.prototype,"showSunPath",void 0),e([_e({attribute:!1})],ps.prototype,"showSunriseSunset",void 0),e([_e({attribute:!1})],ps.prototype,"showCoverFill",void 0),e([_e({attribute:!1})],ps.prototype,"showWindowArrow",void 0),e([_e({attribute:!1})],ps.prototype,"coverColors",void 0),e([_e({attribute:!1})],ps.prototype,"northOffsetDeg",void 0),e([ge()],ps.prototype,"_hiddenEntries",void 0),ps=e([he("acp-sky-compass")],ps);const gs=32,ms=864e5;function fs(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}let vs=class extends ce{constructor(){super(...arguments),this.discoveredList=[],this.coverColors=[],this.compact=!1,this._cancelMinuteTimer=null}connectedCallback(){super.connectedCallback(),this._cancelMinuteTimer=_s(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._cancelMinuteTimer?.(),this._cancelMinuteTimer=null}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=[];for(const e of this.discoveredList){const t=e.entities;s.push(t.sun_sensor,t.decision_trace_sensor,t.control_status_sensor)}return me(t,this.hass,s)}_sunAttrsFor(e){const t=e.entities.sun_sensor;if(!t)return null;const s=this.hass.states[t];return s?s.attributes:null}_sunDotTraceInputs(){const e=this.discoveredList[0]?.entities.decision_trace_sensor,t=e?this.hass.states[e]?.attributes:void 0;return{sunState:t?.sun_state??null,directSunValid:t?.direct_sun_valid??!1}}_scheduleBounds(){const e=this.discoveredList[0]?.entities.control_status_sensor;if(!e)return null;const t=this.hass.states[e]?.attributes;return t?{start:fs(t.schedule_start),end:fs(t.schedule_end)}:null}render(){if(!this.hass||0===this.discoveredList.length)return W;const e=this._sunAttrsFor(this.discoveredList[0]),{latitude:t,longitude:s,time_zone:i}=this.hass.config??{};if(void 0===t||void 0===s||!e)return L`<div class="placeholder">${Ge("elevation.placeholder",this.hass)}</div>`;const o=Qt(i),n=Wt(t,s,o),r=new Date,a=e=>{const t=e.getTime()-o.getTime();return gs+t/864e5*360},l=e=>138-(e- -10)/100*128,c=n.map(e=>`${a(e.t).toFixed(1)},${l(e.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(r),u=this._interpAt(n,r),p=u?l(u.elevation):null,_=!u||u.elevation<=0,g=this._sunDotTraceInputs(),m=ns[rs({belowHorizon:_,sunState:g.sunState,directSunValid:g.directSunValid,inFov:!0===e.in_fov})].replace(/^sun /,""),f=e=>138-128*e,v=this.discoveredList.length>1,y=this._scheduleBounds(),b=y?function(e,t,s,i){if(!e&&!t)return{offSchedule:[],bars:[]};const o=e=>(e.getTime()-s)/i,n=e=>Math.max(0,Math.min(1,e)),r=e=>n(e),a=e=>e>1?e-Math.floor(e):n(e),l=e=>e>0&&e<1?[e]:[];if(e&&!t){const t=o(e);return{offSchedule:[{x0:0,x1:r(t)}],bars:l(t)}}if(!e&&t){const e=o(t);return{offSchedule:[{x0:a(e),x1:1}],bars:l(e)}}const c=o(e),d=o(t),h=r(c),u=a(d),p=[...l(c),...l(d)];if(h>u)return{offSchedule:[{x0:u,x1:h}],bars:p};const _=[];return h>0&&_.push({x0:0,x1:h}),u<1&&_.push({x0:u,x1:1}),{offSchedule:_,bars:p}}(y.start,y.end,o.getTime(),ms):{offSchedule:[],bars:[]},w=e=>gs+360*e,x=b.offSchedule.map(e=>({x:w(e.x0),width:w(e.x1)-w(e.x0)})),$=y?.start&&o?(y.start.getTime()-o.getTime())/ms:null,A=b.bars.map(e=>{const t=null!==$&&Math.abs(e-$)<1e-9?y.start.toISOString():y.end.toISOString(),s=null!==$&&Math.abs(e-$)<1e-9,o=w(e);return{x:o,anchor:o>=391?"end":o<=33?"start":"middle",label:ss(t,i),tooltip:Ge(s?"elevation.schedule_start_tooltip":"elevation.schedule_end_tooltip",this.hass)}}),k=(()=>{if(!y)return null;const e=y.start?ss(y.start.toISOString(),i):null,t=y.end?ss(y.end.toISOString(),i):null;return e&&t?Ge("elevation.schedule",this.hass,{from:e,to:t}):e?Ge("elevation.schedule_from",this.hass,{from:e}):t?Ge("elevation.schedule_until",this.hass,{to:t}):null})(),C=this.discoveredList.map((e,t)=>{const s=this._sunAttrsFor(e),{color:o,isOverride:r}=cs(this.coverColors?.[t],t),l=r;if(!s)return{d:e,runs:[],inPlotBands:[],runBars:[],label:"",color:o,inlineFill:l};const c=Xt(n,s.window_azimuth,s.fov_left,s.fov_right),d="number"==typeof s.min_elevation,h="number"==typeof s.max_elevation,{loFrac:u,hiFrac:p}=function(e,t){if(void 0!==e&&void 0!==t&&e>t)return{loFrac:0,hiFrac:1};const s=e=>Math.max(0,Math.min(1,(e- -10)/100));return{loFrac:void 0!==e?s(e):0,hiFrac:void 0!==t?s(t):1}}(s.min_elevation,s.max_elevation),_=d||h?f(p):10,g=d||h?f(u):138,m=_,y=Math.max(0,g-_),b=c.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),y:m,height:y})),w=c.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),range:`${ss(n[e.startIdx].t.toISOString(),i)} → ${ss(n[e.endIdx].t.toISOString(),i)}`})),x=c.map(e=>`${ss(n[e.startIdx].t.toISOString(),i)} → ${ss(n[e.endIdx].t.toISOString(),i)}`).join(", "),$=[];return v||(d&&$.push(g),h&&$.push(_)),{d:e,runs:c,inPlotBands:b,runBars:w,label:x,color:o,inlineFill:l,limitLines:$}}),S=C.some(e=>e.runs.length>0),E=v?function(e){if(e<=0)return{rows:[],height:0};const t=Array.from({length:e},(e,t)=>({y:0+11*t,height:8}));return{rows:t,height:0+8*e+3*(e-1)+0}}(C.length):{rows:[],height:0},z=138-E.height-3;return L`
      <div class="wrap">
        <div class="head">
          <span class="label">${Ge("elevation.title",this.hass)}</span>
          <span class="head-meta">
            ${v?W:S?L`<span class="dim"
                      >${Ge("elevation.fov_windows",this.hass,{windows:C[0].label})}</span
                    >`:L`<span class="dim">${Ge("elevation.no_fov_today",this.hass)}</span>`}
            ${k?L`<span class="dim schedule">${k}</span>`:W}
          </span>
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${q`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(e=>q`
              <line class="grid" x1=${gs} y1=${l(e)} x2=${392} y2=${l(e)} />
              <text class="tick" x=${28} y=${l(e)+3} text-anchor="end">${e}°</text>
            `)}

            <!-- horizon -->
            <line class="horizon" x1=${gs} y1=${d} x2=${392} y2=${d} />

            <!-- elevation limit gridlines (single-window legacy path only) -->
            ${C.flatMap(e=>(e.limitLines??[]).map(e=>q`<line class="limit-line" x1=${gs} y1=${e} x2=${392} y2=${e} />`))}

            <!-- In-plot FOV bands: single-window legacy path only. -->
            ${v?W:C.flatMap(e=>e.inPlotBands.map(t=>q`<rect
                        class="fov-band"
                        x=${t.x0}
                        y=${t.y}
                        width=${t.x1-t.x0}
                        height=${t.height}
                        style=${e.inlineFill?`fill:${e.color}`:W}
                      />`))}

            <!-- Per-window FOV ribbon (multi-window only): one row per window,
                 a faint full-width track plus color-keyed bars for in-FOV runs,
                 sharing the plot's xAt() time scale. Overlaid as a band anchored
                 to the bottom of the plot; drawn BEFORE the curve so the blue
                 curve stays crisp on top. -->
            ${E.rows.flatMap((e,t)=>{const s=C[t],i=z+e.y,o=s.runs.length?s.d.entry_title:Ge("elevation.fov_window_named",this.hass,{name:s.d.entry_title,windows:Ge("elevation.no_fov_today",this.hass)}),n=q`<rect
                class="ribbon-track"
                x=${gs}
                y=${i}
                width=${360}
                height=${e.height}
                rx="2"
                ${ft(o)}
              ></rect>`,r=s.runBars.map(t=>q`<rect
                  class="ribbon-bar"
                  x=${t.x0}
                  y=${i}
                  width=${t.x1-t.x0}
                  height=${e.height}
                  rx="2"
                  style=${`fill:${s.color}`}
                  ${ft(Ge("elevation.fov_window_named",this.hass,{name:s.d.entry_title,windows:t.range}))}
                ></rect>`);return[n,...r]})}

            <!-- Schedule window overlay (issue #128): faint off-schedule gray
                 zone(s) + thin start/end bars with a clock-time tick. Rendered
                 PRE-CURVE so the sun curve and now-line paint on top. The tick
                 label sits slightly higher than the axis ticks (its own class)
                 so it doesn't read as an axis tick. -->
            ${x.map(e=>q`<rect
                class="off-schedule-zone"
                x=${e.x}
                y=${10}
                width=${e.width}
                height=${128}
              />`)}
            ${A.flatMap(e=>[q`<line
                class="schedule-bar"
                x1=${e.x}
                y1=${10}
                x2=${e.x}
                y2=${138}
                ${ft(e.tooltip)}
              ></line>`,q`<text
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
            <g class="now-group" ${ft(ss(r.toISOString(),i))}>
              <line class="now-hit" x1=${h} y1=${10} x2=${h} y2=${138} />
              <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />
            </g>
            ${null!==p?q`<circle class="sun-dot ${m}" cx=${h} cy=${p} r="4" />`:W}

            <!-- x-axis gridlines + time labels at every 6h, drawn last so the
                 axis sits on the topmost layer (nothing paints over the times).
                 Edge labels anchor inward (start at 00:00, end at 24:00) so they
                 don't clip past the viewBox. -->
            ${[0,6,12,18,24].map(e=>{const t=new Date(o.getTime()+36e5*e),s=0===e?"start":24===e?"end":"middle";return q`
                <line class="grid faint" x1=${a(t)} y1=${10} x2=${a(t)} y2=${138} />
                <text class="tick" x=${a(t)} y=${152} text-anchor=${s}>${e.toString().padStart(2,"0")}:00</text>
              `})}
          `}
        </svg>
      </div>
    `}_interpAt(e,t){if(0===e.length)return null;const s=t.getTime();if(s<=e[0].t.getTime())return e[0];if(s>=e[e.length-1].t.getTime())return e[e.length-1];for(let i=1;i<e.length;i++)if(e[i].t.getTime()>=s){const o=e[i-1],n=e[i],r=(s-o.t.getTime())/(n.t.getTime()-o.t.getTime());return{t:t,elevation:o.elevation+(n.elevation-o.elevation)*r,azimuth:o.azimuth+(n.azimuth-o.azimuth)*r}}return e[e.length-1]}};function ys(e,t){if(!0===e?.custom_position_minimum_mode&&Array.isArray(e.custom_position_slots)&&void 0!==e.custom_position_active_slot){const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);if(void 0!==t&&null!==t.position&&void 0!==t.position)return t.position}return t}function bs(e){if(void 0===e?.custom_position_active_slot||!Array.isArray(e.custom_position_slots))return!1;const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);return 100===t?.priority}function ws(e){const t=e.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(t))return"custom_position";switch(t){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return t}}function xs(e,t,s,i=Ee,o="Safety"){const n=new Map;for(const t of e){if(!t.matched)continue;const e=ws(t.handler);Se.includes(e)&&n.set(e,t)}const r=[...Se].reverse().filter(e=>n.has(e));return 0===r.length?t.reason??"":r.map(e=>function(e,t,s,i,o){const n=i[e]??e,r=t.position,a=null==r?"":` ${es(r)}`;if("custom_position"!==e)return`${n}${a}`.trimEnd();return`${s.custom_position_active_slot_name?`${n} · ${s.custom_position_active_slot_name}`:s.custom_position_active_slot?`${n} #${s.custom_position_active_slot}`:n}${a}${!0===s.custom_position_minimum_mode?" floor":""}${bs(s)?` · ${o}`:""}`}(e,n.get(e),t,i,o)).join(" → ")}vs.styles=r`
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
  `,e([_e({attribute:!1})],vs.prototype,"hass",void 0),e([_e({attribute:!1})],vs.prototype,"discoveredList",void 0),e([_e({attribute:!1})],vs.prototype,"coverColors",void 0),e([_e({type:Boolean,reflect:!0})],vs.prototype,"compact",void 0),vs=e([he("acp-elevation-chart")],vs);let $s=class extends ce{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this._tick=null,this.hideInactive=!1}disconnectedCallback(){super.disconnectedCallback(),this._syncTimer(!1)}updated(){const e=Boolean(this.hass&&this.discovered&&this._throttleNextAllowedIso());this._syncTimer(e)}_syncTimer(e){e&&null===this._tick?this._tick=setInterval(()=>this.requestUpdate(),1e3):e||null===this._tick||(clearInterval(this._tick),this._tick=null)}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=this.discovered?.entities;return me(t,this.hass,[s?.decision_trace_sensor,s?.last_skipped_sensor])}_throttleNextAllowedIso(){const e=this.discovered.entities.last_skipped_sensor;if(!e)return null;const t=this.hass.states[e];if(!t||"time_delta_too_small"!==t.state)return null;const s=t.attributes,i=function(e,t){if(!e)return null;if(null==t||Number.isNaN(t))return null;const s=new Date(e).getTime();return Number.isNaN(s)?null:new Date(s+6e4*t).toISOString()}(s?.timestamp,s?.time_threshold_minutes);return i?new Date(i).getTime()<=Date.now()?null:i:null}_trace(){const e=this.discovered.entities.decision_trace_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const s=t.attributes;if(!s?.trace)return null;const i=new Map;for(const e of s.trace)i.set(ws(e.handler),{matched:e.matched,reason:e.reason,position:e.position,held_position:e.held_position});const o={};for(const[e,t]of Object.entries(ze))o[e]=Ge(t,this.hass);return{winner:t.state,reason:s.reason??"",steps:i,enabledHandlers:s.enabled_handlers,summary:xs(s.trace,s,t.state,o),inTimeWindow:s.in_time_window}}render(){if(!this.hass||!this.discovered)return W;const e=this._trace();if(!e)return L`<div class="placeholder">${Ge("decision.placeholder",this.hass)}</div>`;const t=this._throttleNextAllowedIso(),s=function(e){if(!e)return new Set;const t=new Set(e);return new Set(Se.filter(e=>!t.has(e)))}(e.enabledHandlers),i=function(e,t,s,i,o=new Set){return e.filter(e=>e===s||!o.has(e)&&(!i||!0===t.get(e)?.matched))}(Se,e.steps,e.winner,this.hideInactive,s);return L`
      <div class="wrap">
        <div class="head">
          <span class="label">${Ge("decision.pipeline",this.hass)}</span>
          <span class="winner">${Ge("decision.winner",this.hass,{name:e.winner})}</span>
        </div>
        ${!1===e.inTimeWindow?L`<div
              class="off-schedule"
              ${ft(Ge("decision.outside_schedule_tooltip",this.hass))}
            >
              ${Ge("decision.outside_schedule",this.hass)}
            </div>`:W}
        ${t?L`<div class="throttle-countdown">
              <ha-icon icon="mdi:timer-sand"></ha-icon>
              <span
                >${Ge("decision.next_change_in",this.hass,{time:is(t,this.hass)})}</span
              >
            </div>`:W}
        ${this.showSummary&&e.summary?L`<div class="summary" ${ft(Ge("decision.summary_tooltip",this.hass))}>
              ${e.summary}
            </div>`:W}
        <div class="rows">
          ${i.map(t=>this._row(t,e.steps.get(t),e.winner===t))}
        </div>
        <div class="reason dim">${e.reason}</div>
      </div>
    `}_row(e,t,s){const i=t?.matched??!1,o=t?.reason??Ge("decision.not_evaluated",this.hass),n=t?.position,r=t?.held_position,a=null!=r,l=a?es(r):null!=n?es(n):"",c=a&&null!=n?L` · ${Ge("decision.solar_would_be",this.hass,{pct:es(n)})}`:W;return L`
      <div class="row ${s?"winner":i?"match":"skip"}">
        <span class="name">${Ge(ze[e],this.hass)}</span>
        <span class="dots" aria-hidden="true">${i?"████":"────"}</span>
        <span class="pos">${l}</span>
        <span class="reason-inline dim">${o}${c}</span>
        ${s?L`<span class="badge">✓</span>`:W}
      </div>
    `}};var As,ks;$s.styles=r`
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
  `,e([_e({attribute:!1})],$s.prototype,"hass",void 0),e([_e({attribute:!1})],$s.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],$s.prototype,"compact",void 0),e([_e({type:Boolean,reflect:!0,attribute:"show-summary"})],$s.prototype,"showSummary",void 0),e([_e({type:Boolean,reflect:!0,attribute:"hide-inactive"})],$s.prototype,"hideInactive",void 0),$s=e([he("acp-decision-strip")],$s),function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(As||(As={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ks||(ks={}));const Cs=["closed","locked","off"],Ss=(e,t,s,i)=>{i=i||{},s=null==s?{}:s;const o=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return o.detail=s,e.dispatchEvent(o),o},Es=e=>{Ss(window,"haptic",e)};function zs(e){return void 0!==e&&"none"!==e.action}function Os(e,t,s){return e.filter(e=>"off"===e||("solar"===e?function(e){return e.solarMatched&&!e.cloudIsWinner}(s)&&!1!==t?.solar:!1!==t?.[e]))}function Ms(e){return!!e&&e.some(e=>e.matched&&"solar"===ws(e.handler))}function Is(e){return"cloud"===ws(e)}function Fs(e){if(!1===e.integrationEnabled)return"off";const t=ws(e.winner);return e.manualActive&&"force"!==t&&"custom_position"!==t?"manual":Fe[t]??"auto"}function Ts(e,t){return{solarMatched:Ms(e),cloudIsWinner:Is(t)}}let Ps=class extends ce{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0,this.manualActive=!1,this.safetyActive=!1,this.resumable=!1}render(){const e=this._kind(),t="custom_position"===e&&this.safetyActive,s=t?Te.force:Te[e],i=this.hass?Ge(Pe[e],this.hass):Te[e].label,o=t?this.hass?Ge("badge.safety",this.hass):"Safety":this._label(e,i),n=t?je.force:je[e],r=L`${n?L`<ha-icon class="badge-icon" icon=${n}></ha-icon>`:W}${o}${this.resumable?L`<ha-icon class="resume-icon" icon="mdi:restore"></ha-icon>`:W}`;if(this.resumable){const t=this.hass?Ge("tile.resume_aria",this.hass):"Resume automatic control";return L`<button
        class="badge kind-${e} resumable"
        style="background:${s.bg};color:${s.fg};"
        part="badge"
        type="button"
        ${ft(t)}
        aria-label=${t}
        @click=${this._onResumeClick}
        @pointerdown=${this._stop}
      >
        ${r}
      </button>`}return L`<span
      class="badge kind-${e}"
      style="background:${s.bg};color:${s.fg};"
      part="badge"
      >${r}</span
    >`}_stop(e){e.stopPropagation()}_onResumeClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-resume",{bubbles:!0,composed:!0}))}_kind(){return this.kindOverride??Fs({winner:this.winner,integrationEnabled:this.integrationEnabled,manualActive:this.manualActive})}_label(e,t){return"manual"===e?this.manualEndIso?ss(this.manualEndIso):t:"custom_position"===e?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${t} #${this.slotNumber}`:t}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?this.hass?Ge("badge.floor_suffix",this.hass):" ↥":""}`:t}};Ps.styles=r`
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
  `,e([_e({attribute:!1})],Ps.prototype,"hass",void 0),e([_e()],Ps.prototype,"winner",void 0),e([_e({attribute:"manual-end-iso"})],Ps.prototype,"manualEndIso",void 0),e([_e({type:Number,attribute:"slot-number"})],Ps.prototype,"slotNumber",void 0),e([_e({attribute:"slot-name"})],Ps.prototype,"slotName",void 0),e([_e({type:Number})],Ps.prototype,"pct",void 0),e([_e({type:Boolean,attribute:"minimum-mode"})],Ps.prototype,"minimumMode",void 0),e([_e({type:Boolean,reflect:!0})],Ps.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"integration-enabled"})],Ps.prototype,"integrationEnabled",void 0),e([_e({type:Boolean,attribute:"manual-active"})],Ps.prototype,"manualActive",void 0),e([_e({type:Boolean,attribute:"safety-active"})],Ps.prototype,"safetyActive",void 0),e([_e({attribute:"kind-override"})],Ps.prototype,"kindOverride",void 0),e([_e({type:Boolean,reflect:!0})],Ps.prototype,"resumable",void 0),Ps=e([he("acp-tile-badge")],Ps);let js=class extends ce{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0,this._tick=null}disconnectedCallback(){super.disconnectedCallback(),this._syncTimer(!1)}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=this.discovered?.entities;return me(t,this.hass,[s?.manual_override_binary,s?.manual_override_end_sensor,s?.motion_status_sensor,s?.reset_override_button])}updated(){if(!this.hass||!this.discovered)return void this._syncTimer(!1);const e=!this.compact&&(null!==this._manualEndIso()||null!=this._motionStatus()?.endIso);this._syncTimer(e)}_syncTimer(e){e&&null===this._tick?this._tick=setInterval(()=>this.requestUpdate(),1e3):e||null===this._tick||(clearInterval(this._tick),this._tick=null)}_manualActive(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualEndIso(){const e=this.discovered.entities.manual_override_end_sensor;if(!e)return null;const t=this.hass.states[e];return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:null}_motionStatus(){const e=this.discovered.entities.motion_status_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const s=t.attributes.motion_timeout_end_time;return{state:t.state,endIso:s??null}}_resetManual(){const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_motionStateLabel(e,t){if(e){const t=this.hass.states[e],s=this.hass.formatEntityState;if(t&&"function"==typeof s){const e=s(t);if(e)return e}}return t.replace(/_/g," ")}render(){if(!this.hass||!this.discovered)return W;const e=this._manualActive(),t=this._manualEndIso(),s=this._motionStatus(),i=this.discovered.entities.motion_status_sensor,o=this.discovered.entities.reset_override_button,n=Ge("overrides.reset_manual",this.hass);return L`
      <div class="wrap">
        <div class="label dim">${Ge("overrides.title",this.hass)}</div>
        <div class="grid">
          <div class="tile ${e?"active":""}">
            <div class="tile-label">${Ge("overrides.manual",this.hass)}</div>
            <div class="tile-value">
              ${Ge(e?"overrides.active":"overrides.off",this.hass)}
            </div>
            ${t?L`<div class="tile-sub dim">
                  ${Ge("overrides.ends_in",this.hass,{time:is(t,this.hass)})}
                </div>`:W}
          </div>

          ${s?L`<div class="tile ${"motion_detected"===s.state?"active":""}">
                <div class="tile-label">${Ge("overrides.motion",this.hass)}</div>
                <div class="tile-value">${this._motionStateLabel(i,s.state)}</div>
                ${s.endIso?L`<div class="tile-sub dim">
                      ${Ge("overrides.timeout",this.hass,{time:is(s.endIso,this.hass)})}
                    </div>`:W}
              </div>`:W}
          ${o?this.resetEnabled?L`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${n}</div>
                </button>`:L`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${n}</div>
                </button>`:W}
        </div>
      </div>
    `}};js.styles=r`
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
  `,e([_e({attribute:!1})],js.prototype,"hass",void 0),e([_e({attribute:!1})],js.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],js.prototype,"compact",void 0),e([_e({type:Boolean,attribute:"reset-enabled"})],js.prototype,"resetEnabled",void 0),js=e([he("acp-overrides-panel")],js);const Rs=new Set(["mode_off","active"]),Ns={summer_mode:"mdi:weather-sunny",winter_mode:"mdi:snowflake",intermediate:"mdi:weather-partly-cloudy"};let Ds=class extends ce{constructor(){super(...arguments),this.compact=!1}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=this.discovered?.entities;return me(t,this.hass,[s?.climate_status_sensor,s?.climate_mode_switch])}render(){if(!this.hass||!this.discovered)return W;const e=this.discovered.entities.climate_status_sensor;if(!e)return W;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return W;if("unknown"===t.state||""===t.state){const e=this.discovered.entities.climate_mode_switch,s=!!e&&"off"===this.hass.states[e]?.state,i=Ge(s?"climate.mode_off":"climate.standby",this.hass),o=s?"mdi:power-off":"mdi:thermostat",n=t.attributes?.inactive_reason,r=n&&!Rs.has(n)?Ge(`climate.reason.${n}`,this.hass):void 0;return L`
        <div class="wrap">
          <div class="head">
            <span class="label">${Ge("climate.title",this.hass)}</span>
          </div>
          <div class="strategy standby">
            <ha-icon icon=${o}></ha-icon>
            <span class="strategy-name dim">${i}</span>
          </div>
          ${r?L`<div class="standby-reason dim">${r}</div>`:W}
        </div>
      `}const s=t.state,i=t.attributes??{},o=Ns[s]??"mdi:thermostat",n=i.temperature_unit??"°",r=this.hass.formatEntityState,a="function"==typeof r?r(t)??s:s,l=void 0!==i.active_temperature?`${i.active_temperature.toFixed(1)}${n}`:"—",c=!0===i.temp_switch,d=(e,t)=>null==t||Number.isNaN(t)?null:`${Ge(e,this.hass)} ${t.toFixed(1)}${n}`,h=c?null:[d("climate.threshold_low",i.temp_low),d("climate.threshold_high",i.temp_high)].filter(e=>null!==e).join(" ")||null,u=[...c?[d("climate.threshold_low",i.temp_low),d("climate.threshold_high",i.temp_high)]:[],d("climate.threshold_summer_outside",i.temp_summer_outside)].filter(e=>null!==e).join(" ")||null,p=[void 0!==i.indoor_temperature?{label:Ge("climate.indoor",this.hass),value:i.indoor_temperature,unit:n,threshold:h}:null,void 0!==i.outdoor_temperature?{label:Ge("climate.outdoor",this.hass),value:i.outdoor_temperature,unit:n,threshold:u}:null].filter(e=>null!==e),_=[{label:Ge("climate.presence",this.hass),value:i.is_presence,icon:"mdi:account-check"},{label:Ge("climate.sunny",this.hass),value:i.is_sunny,icon:"mdi:white-balance-sunny"},{label:Ge("climate.lux",this.hass),value:i.lux_active,icon:"mdi:brightness-7"},{label:Ge("climate.irradiance",this.hass),value:i.irradiance_active,icon:"mdi:solar-power"}].filter(e=>void 0!==e.value);return L`
      <div class="wrap">
        <div class="head">
          <span class="label">${Ge("climate.title",this.hass)}</span>
          <span class="dim">${Ge("climate.active",this.hass,{strategy:l})}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${o}></ha-icon>
          <span class="strategy-name">${a}</span>
        </div>
        ${p.length?L`
              <div class="temps">
                ${p.map(e=>L`
                    <div class="temp">
                      <span class="temp-label dim">${e.label}</span>
                      <span class="temp-value">${e.value.toFixed(1)}${e.unit}</span>
                      ${e.threshold?L`<span class="temp-threshold dim">${e.threshold}</span>`:W}
                    </div>
                  `)}
              </div>
            `:W}
        ${_.length?L`
              <div class="conditions">
                ${_.map(e=>L`
                    <div class="chip ${e.value?"on":"off"}" ${ft(e.label)}>
                      <ha-icon icon=${e.icon}></ha-icon>
                      <span>${e.label}</span>
                    </div>
                  `)}
              </div>
            `:W}
      </div>
    `}};Ds.styles=r`
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
  `,e([_e({attribute:!1})],Ds.prototype,"hass",void 0),e([_e({attribute:!1})],Ds.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Ds.prototype,"compact",void 0),Ds=e([he("acp-climate-panel")],Ds);let Bs=class extends ce{constructor(){super(...arguments),this.compact=!1,this.coverColor=null}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=this.discovered?.entities;return me(t,this.hass,[s?.target_position_sensor,s?.position_mismatch_binary,s?.manual_override_binary])}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return{target:null,covers:{}};const t=this.hass.states[e];if(!t)return{target:null,covers:{}};const s=t.attributes;return{target:Dt(this.hass,this.discovered),covers:s?.actual_positions??{}}}_mismatched(){const e=this.discovered.entities.position_mismatch_binary;if(!e)return new Set;const t=this.hass.states[e];if("on"!==t?.state)return new Set;const s=t.attributes.entities;return s?new Set(Object.entries(s).filter(([,e])=>e.mismatch).map(([e])=>e)):new Set}_setPosition(e,t){this.hass.callService(Ce,"set_position",{position:t},{entity_id:e})}render(){if(!this.hass||!this.discovered)return W;const{target:e,covers:t}=this._target(),s=this._mismatched(),i=(n=this.hass,r=this.discovered,null!==ct(Nt(n,r),jt(n,r),Pt(n,r))),o=Object.entries(t);var n,r;return 0===o.length?L`<div class="placeholder">${Ge("covers.placeholder",this.hass)}</div>`:L`
      <div class="wrap" style=${this.coverColor?`--acp-cover-color:${this.coverColor}`:W}>
        <div class="head">
          <span class="label">${Ge("covers.title",this.hass)}</span>
          <span class="target"
            >${Ge(i?"covers.target_solar":"covers.target",this.hass,{pct:es(e)})}</span
          >
        </div>
        ${o.map(([t,o])=>this._bar(t,o,e,s.has(t),i))}
      </div>
    `}_bar(e,t,s,i,o){const n=this.hass.states[e]?.attributes?.friendly_name??e,r=t??0,a=s??0;return L`
      <div class="cover ${i?"mismatch":""}">
        <div class="name" ${ft(e)}>${n}</div>
        <div class="num">${es(t)}</div>
        <div
          class="track"
          @click=${t=>this._handleTrackClick(t,e)}
          ${ft(Ge("covers.click_to_set",this.hass))}
        >
          <div class="fill" style="width:${r}%"></div>
          <div class="fill-closed" style="width:${100-r}%"></div>
          ${null!==s?L`<div
                class="marker"
                style="left:clamp(1px, ${a}%, calc(100% - 1px))"
                ${ft(Ge(o?"covers.target_tooltip_override":"covers.target_tooltip",this.hass,{pct:a}))}
              ></div>`:W}
        </div>
        ${i&&!o?L`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:W}
      </div>
    `}_handleTrackClick(e,t){const s=e.currentTarget.getBoundingClientRect(),i=Math.round((e.clientX-s.left)/s.width*100),o=Math.max(0,Math.min(100,i));this._setPosition(t,o)}};var Vs;Bs.styles=r`
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
  `,e([_e({attribute:!1})],Bs.prototype,"hass",void 0),e([_e({attribute:!1})],Bs.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],Bs.prototype,"compact",void 0),e([_e({attribute:!1})],Bs.prototype,"coverColor",void 0),Bs=e([he("acp-cover-bar")],Bs);const Gs=864e5;let Ks=Vs=class extends ce{constructor(){super(...arguments),this.samples=[],this.events=[],this.now=Date.now(),this._hoverIdx=null,this._onPointerMove=e=>{const t=e.currentTarget.getBoundingClientRect();if(t.width<=0)return;const s=(e.clientX-t.left)/t.width,i=Math.max(0,Math.min(1,s))*Vs.VIEW_W;this._hoverIdx=this._nearestSampleIdx(i)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){if(!this.samples||0===this.samples.length)return W;const{VIEW_W:e,VIEW_H:t,TOP_PAD:s,EVENT_HIT_W:i}=Vs,o=t-s,n=Yt(new Date(this.now)).getTime(),r=t=>nt(t,n,e),a=this.samples.map(e=>{const t=Date.parse(e.t);return{t:t,x:r(t),y:s+(1-Ls(e.position)/100)*o,sample:e,inDay:!Number.isNaN(t)&&t>=n&&t<=n+Gs}}),l=a.filter(e=>e.inDay).map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)}`).join(" "),c=(this.events??[]).map(e=>{const o=Date.parse(e.t);if(Number.isNaN(o)||o<n||o>n+Gs)return null;const a=r(o),l=`evt-${e.kind}`,c=function(e,t){const s=`forecast.event.${e.kind}`,i=Ge(s,t),o=i===s?e.label??e.kind:i,n=ss(e.t);return"—"===n?o:`${o} — ${n}`}(e,this.hass);return q`<g class="event-group" ${ft(c)}>
          <line
            class="event-hit"
            x1=${a.toFixed(1)}
            x2=${a.toFixed(1)}
            y1=${s}
            y2=${t}
            stroke-width=${i}
          ></line>
          <line
            class="event-marker ${l}"
            x1=${a.toFixed(1)}
            x2=${a.toFixed(1)}
            y1=${s}
            y2=${t}
          ></line>
        </g>`}).filter(e=>null!==e),d=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<a.length?a[this._hoverIdx]:null,h=d?q`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${d.x.toFixed(1)} x2=${d.x.toFixed(1)}
            y1=${s} y2=${t}></line>
          <circle class="hover-dot" cx=${d.x.toFixed(1)} cy=${d.y.toFixed(1)} r="3"></circle>
        </g>`:W,u=d?L`<div class="hover-label" style=${`left: ${(d.x/e*100).toFixed(2)}%`}>
          ${function(e){const t=ss(e.t),s=`${Math.round(Ls(e.position))}%`;return e.handler?`${t} · ${s} · ${e.handler}`:`${t} · ${s}`}(d.sample)}
        </div>`:W,p=[0,6,12,18,24].map(e=>{const i=r(n+36e5*e);return q`
        <line class="grid faint" x1=${i} y1=${s} x2=${i} y2=${t-.5} />
        <text class="axis-label tick-time" x=${i} y=${t-3} text-anchor="middle">${e.toString().padStart(2,"0")}:00</text>
      `}),_=this.now,g=r(_),m=_>=n&&_<=n+Gs?q`<g class="now-group" ${ft(ss(new Date(_).toISOString()))}>
          <line class="now-hit" x1=${g.toFixed(1)} y1=${s} x2=${g.toFixed(1)} y2=${t-.5}></line>
          <line class="now" x1=${g.toFixed(1)} y1=${s} x2=${g.toFixed(1)} y2=${t-.5}></line>
        </g>`:W;return L`
      <div class="wrap">
        <svg
          viewBox="0 0 ${e} ${t}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <line class="baseline" x1="0" y1=${t-.5} x2=${e} y2=${t-.5}></line>
          <text class="axis-label" x="4" y=${s+8} text-anchor="start">100%</text>
          ${p}
          <polyline class="curve" points=${l} fill="none"></polyline>
          ${c} ${h} ${m}
        </svg>
        ${u}
      </div>
    `}_nearestSampleIdx(e){const t=Yt(new Date(this.now)).getTime();let s=-1,i=Number.POSITIVE_INFINITY;for(let o=0;o<this.samples.length;o++){const n=Date.parse(this.samples[o].t);if(Number.isNaN(n)||n<t||n>t+Gs)continue;const r=nt(n,t,Vs.VIEW_W),a=Math.abs(r-e);a<i&&(i=a,s=o)}return s>=0?s:null}};function Ls(e){return Number.isNaN(e)||e<0?0:e>100?100:e}Ks.VIEW_W=600,Ks.VIEW_H=80,Ks.TOP_PAD=10,Ks.EVENT_HIT_W=12,Ks.styles=r`
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
  `,e([_e({attribute:!1})],Ks.prototype,"hass",void 0),e([_e({attribute:!1})],Ks.prototype,"samples",void 0),e([_e({attribute:!1})],Ks.prototype,"events",void 0),e([_e({attribute:!1})],Ks.prototype,"now",void 0),e([ge()],Ks.prototype,"_hoverIdx",void 0),Ks=Vs=e([he("acp-forecast-strip")],Ks);const qs=["sol_elev_deg","gamma_deg"],Us=["position_pct"],Ws=new Set([...qs,...Us,"status","cover_type","tilt"]),Ys={cover_blind:["effective_distance_m","adjusted_height_m","safety_margin"],cover_awning:["awn_angle_deg","vertical_position_m","length_m"],cover_tilt:["slat_angle_raw_deg","tilt_mode","max_degrees"]},Qs=new Set([...qs,...Us,...Object.values(Ys).flat()]);function Hs(e,t){return null==t?"—":"boolean"==typeof t?t?"✓":"✗":Array.isArray(t)?t.length?t.join(", "):"—":"number"==typeof t?Number.isNaN(t)?"—":"position_pct"===e||e.endsWith("_pct")?`${Math.round(t)}%`:e.endsWith("_deg")?`${t.toFixed(1)}°`:e.endsWith("_m")?`${t.toFixed(3)} m`:e.endsWith("_rad")?`${t.toFixed(3)} rad`:t.toFixed(3):String(t)}function Xs(e,t,s){const i=[];for(const s of t)s in e&&i.push({key:s,value:Hs(s,e[s]),curated:Qs.has(s)});return i}function Zs(e,t,s){const i=Xs(e,qs),o=Xs(e,Us);let n;if(s){const s=Ys[t]??[],i=Object.keys(e).filter(e=>!Ws.has(e)&&!s.includes(e));n=[...s.filter(t=>t in e),...i]}else n=(Ys[t]??[]).filter(t=>t in e);const r=Xs(e,n),a=e.position_pct;return{status:"string"==typeof e.status?e.status:void 0,hasTarget:"number"==typeof a&&!Number.isNaN(a),inputs:i,intermediates:r,output:o}}function Js(e,t){const s="string"==typeof e.cover_type?e.cover_type:"",i=Zs(e,s,t);let o;if("cover_venetian"===s){const s=e.tilt;s&&"object"==typeof s&&(o=Zs(s,"cover_tilt",t))}return{coverType:s,position:i,tilt:o}}let ei=class extends ce{constructor(){super(...arguments),this.compact=!1,this._showAll=!1,this._toggleShowAll=()=>{this._showAll=!this._showAll}}shouldUpdate(e){return e.size>1||!e.has("hass")||me(e.get("hass"),this.hass,[this.discovered?.entities.solar_calculation_sensor])}render(){if(!this.hass||!this.discovered)return W;const e=this.discovered.entities.solar_calculation_sensor;if(!e)return W;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return W;const s=t.attributes,i=Js(s,this._showAll),o=function(e){const t=Js(e,!0),s=Js(e,!1),i=e=>e.position.intermediates.length+(e.tilt?.intermediates.length??0);return Math.max(0,i(t)-i(s))}(s);return L`
      <div class="wrap">
        <div class="head">
          <span class="label">${Ge("solar.title",this.hass)}</span>
          ${this._statusChip(i.position.status)}
        </div>
        ${this._axis(i.position,i.tilt?Ge("solar.axis_position",this.hass):void 0)}
        ${i.tilt?this._axis(i.tilt,Ge("solar.axis_tilt",this.hass)):W}
        ${o>0?L`<button class="show-all" type="button" @click=${this._toggleShowAll}>
              ${this._showAll?Ge("solar.show_less",this.hass):Ge("solar.show_all",this.hass,{count:o})}
            </button>`:W}
      </div>
    `}_statusChip(e){if(!e)return W;const t=e.startsWith("Direct"),s=this._statusSlug(e),i="_unknown"===s?e:Ge(`solar.status.${s}`,this.hass);return L`<span class="status-chip ${t?"direct":"default"}">${i}</span>`}_statusSlug(e){return{"Direct Sun":"direct_sun","Default: FOV Exit":"fov_exit","Default: Elevation Limit":"elevation_limit","Default: Sunset Offset":"sunset_offset","Default: Blind Spot":"blind_spot",Default:"default"}[e]??"_unknown"}_axis(e,t){return L`
      <div class="axis">
        ${t?L`<div class="axis-title dim">${t}</div>`:W}
        ${this._group(Ge("solar.group_inputs",this.hass),e.inputs)}
        ${this._group(Ge("solar.group_intermediates",this.hass),e.intermediates)}
        ${e.hasTarget?this._group(Ge("solar.group_output",this.hass),e.output):L`<div class="no-target dim">
              ${Ge("solar.no_target",this.hass,{status:e.status??"—"})}
            </div>`}
      </div>
    `}_group(e,t){return 0===t.length?W:L`
      <div class="group">
        <div class="group-label dim">${e}</div>
        <div class="rows">
          ${t.map(e=>L`<div class="row">
                <span class="key ${e.curated?"":"raw"}"
                  >${e.curated?Ge(`solar.field.${e.key}`,this.hass):e.key}</span
                >
                <span class="value">${e.value}</span>
              </div>`)}
        </div>
      </div>
    `}};ei.styles=r`
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
  `,e([_e({attribute:!1})],ei.prototype,"hass",void 0),e([_e({attribute:!1})],ei.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],ei.prototype,"compact",void 0),e([ge()],ei.prototype,"_showAll",void 0),ei=e([he("acp-solar-calc")],ei);let ti=class extends ce{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this.showElevationChart=!0,this.showSolarCalc=!0,this._cancelMinuteTimer=null,this._listSource=null,this._list=[],this._onResume=()=>{const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const e=this.discovered.device_id;e&&this._navigate(`/config/devices/device/${e}`)},this._openIntegrationPage=()=>{this._navigate(`/config/integrations/integration/${Ce}`)},this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}updated(){this._syncMinuteTimer(this.open)}disconnectedCallback(){super.disconnectedCallback(),this._syncMinuteTimer(!1)}_syncMinuteTimer(e){e&&null===this._cancelMinuteTimer?this._cancelMinuteTimer=_s(()=>this.requestUpdate()):e||null===this._cancelMinuteTimer||(this._cancelMinuteTimer(),this._cancelMinuteTimer=null)}get _discoveredList(){return this.discovered!==this._listSource&&(this._listSource=this.discovered,this._list=this.discovered?[this.discovered]:[]),this._list}_buildHandlerLabels(){const e={};for(const[t,s]of Object.entries(ze))e[t]=Ge(s,this.hass);return e}render(){if(!this.open||!this.hass||!this.discovered)return W;const e=this._winner(),t=this._traceAttrs(),s=this._matchedHandlers(t,e),i=bs(t),o=t?xs(t.trace??[],t,0,this._buildHandlerLabels(),Ge("badge.safety",this.hass)):"",n=this._target(),r=this._shouldShowResume(e),a=this._switchOn("integration_enabled_switch"),l=this._switchOn("automatic_control_switch"),c=Ge("dialog.configure_integration",this.hass),d=Ge("dialog.open_device_page",this.hass),h=Ge("dialog.close",this.hass);return L`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${Oe[this.discovered.cover_type]??"mdi:window-shutter"}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${a?l?s.map(e=>L`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${e}
                          .slotNumber=${"custom_position"===e?t?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===e?t?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===e?ys(t,n)??void 0:void 0}
                          .minimumMode=${"custom_position"===e?t?.custom_position_minimum_mode:void 0}
                          .safetyActive=${"custom_position"===e&&i}
                        ></acp-tile-badge>`):W:L`<acp-tile-badge
                    .hass=${this.hass}
                    .integrationEnabled=${!1}
                  ></acp-tile-badge>`}
            </div>
            <button
              class="icon-btn options-link"
              type="button"
              aria-label=${c}
              ${ft(c)}
              @click=${this._openIntegrationPage}
            >
              <ha-icon icon="mdi:tune-variant"></ha-icon>
            </button>
            ${this.discovered.device_id?L`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label=${d}
                  ${ft(d)}
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:cog"></ha-icon>
                </button>`:W}
            <button class="close" type="button" aria-label=${h} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${o?L`<div class="summary">${o}</div>`:W}

          <div class="position-block">
            <div class="position-label">${Ge("dialog.target",this.hass)}</div>
            <div class="position-value">${es(n)}</div>
            ${this._mismatchActive()?L`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:W}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${r?L`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${Ge("dialog.resume_auto",this.hass)}
                </button>
              </div>`:W}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?Ge("dialog.hide_advanced",this.hass):Ge("dialog.show_advanced",this.hass)}
          </button>
          ${this.advancedOpen?L`<div class="advanced">
                ${this.showCompass?L`<div class="advanced-compass">
                      <acp-sky-compass
                        .hass=${this.hass}
                        .discovered_list=${this._discoveredList}
                        ?compact=${!0}
                        .showLegend=${!1}
                        .showStats=${!0}
                      ></acp-sky-compass>
                    </div>`:W}
                ${this.showElevationChart?L`<acp-elevation-chart
                      .hass=${this.hass}
                      .discoveredList=${this._discoveredList}
                      ?compact=${!0}
                    ></acp-elevation-chart>`:W}
                ${this._renderSlots(t?.custom_position_slots)}
                <acp-decision-strip
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-decision-strip>
                ${this.showSolarCalc?L`<acp-solar-calc
                      .hass=${this.hass}
                      .discovered=${this.discovered}
                    ></acp-solar-calc>`:W}
                <acp-overrides-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-overrides-panel>
                <acp-climate-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-climate-panel>
              </div>`:W}
        </div>
      </div>
    `}_winner(){const e=this.discovered.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(){const e=this.discovered.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_matchedHandlers(e,t){if(!e?.trace)return[];const s=new Set;for(const t of e.trace){if(!t.matched)continue;const e=ws(t.handler);Se.includes(e)&&s.add(e)}const i=Se.filter(e=>s.has(e)).map(e=>Fe[e]).filter(e=>void 0!==e),o=Ts(e.trace,t);return Os(i,this.badges,o)}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const s=parseFloat(t.state);return Number.isNaN(s)?null:s}_mismatchActive(){const e=this.discovered.entities.position_mismatch_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualOverrideOn(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(e){const t=this.discovered.entities[e];return!t||"off"!==this.hass.states[t]?.state}_shouldShowResume(e){return!(!this.discovered.entities.reset_override_button||!this._manualOverrideOn()&&"custom_position"!==ws(e))}_renderSlots(e){if(!e)return W;const t=e.filter(e=>null!==e.sensor);return 0===t.length?W:L`<div class="slots-section">
      <div class="slots-label">${Ge("dialog.custom_positions",this.hass)}</div>
      ${t.map(e=>this._renderSlotRow(e))}
    </div>`}_renderSlotRow(e){const t=e.sensor_name??`#${e.slot}`,s=e.sensors?.length??0,i=!0===e.template?L`<span
            class="slot-template"
            ${ft("Template"+(s>0?` · ${s} sensors${e.template_mode?` (${e.template_mode})`:""}`:""))}
          >
            <ha-icon icon="mdi:code-braces"></ha-icon>
          </span>`:W;return L`<div class="slot-row" data-slot=${e.slot}>
      <span class="slot-label">${t}</span>
      ${i}
      <span class="slot-position">${es(e.position)}</span>
      ${!0===e.min_mode?L`<span
            class="slot-min-mode${null!=e.priority&&e.priority>80?"":" is-bypassable"}"
            ${ft(Ge("dialog.floor_tooltip",this.hass))}
          >
            ${Ge("dialog.floor",this.hass)}
          </span>`:W}
      <button
        class="slot-toggle ${e.enabled?"on":"off"}"
        type="button"
        aria-label=${e.enabled?Ge("dialog.disable_slot",this.hass,{slot:e.slot}):Ge("dialog.enable_slot",this.hass,{slot:e.slot})}
        @click=${()=>this._toggleSlot(e)}
      >
        ${e.enabled?Ge("dialog.on",this.hass):Ge("dialog.off",this.hass)}
      </button>
    </div>`}_renderControls(){const e=[{role:"automatic_control_switch",label:Ge("dialog.automatic",this.hass)},{role:"climate_mode_switch",label:Ge("dialog.climate",this.hass)},{role:"motion_control_switch",label:Ge("dialog.motion",this.hass)}].filter(e=>!!this.discovered.entities[e.role]);return 0===e.length?W:L`<div class="controls-block">
      <div class="controls-label">${Ge("dialog.controls",this.hass)}</div>
      <div class="controls-row">${e.map(e=>this._renderSwitchChip(e.role,e.label))}</div>
    </div>`}_renderSwitchChip(e,t){const s=this.discovered.entities[e],i="on"===this.hass.states[s]?.state,o=Ge(i?"dialog.state_on":"dialog.state_off",this.hass),n=Ge(i?"dialog.on":"dialog.off",this.hass);return L`<button
      class="ctrl-toggle ${i?"on":"off"}"
      type="button"
      aria-pressed=${i}
      aria-label=${Ge("dialog.toggle_hint",this.hass,{label:t,state:o})}
      @click=${()=>this._toggleSwitch(s,i)}
    >
      <span class="ctrl-label">${t}</span>
      <span class="ctrl-state">${n}</span>
    </button>`}_toggleSwitch(e,t){this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:e})}_renderForecastStrip(){const e=this.discovered.entities.position_forecast_sensor;if(!e)return W;const t=this.hass.states[e]?.attributes,s=t?.forecast??[],i=t?.events??[];return 0===s.length?W:L`<div class="forecast-block">
      <div class="forecast-label">${Ge("dialog.todays_forecast",this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${s}
        .events=${i}
        .now=${Date.now()}
      ></acp-forecast-strip>
      <div class="forecast-note">${Ge("forecast.solar_only_note",this.hass)}</div>
    </div>`}_toggleSlot(e){const t=this.discovered.managed_covers[0];t&&this.hass.callService(Ce,"set_custom_position",{entity_id:t,slot:e.slot,enabled:!e.enabled})}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};function si(e){return L`
    <div
      class="editor-footer"
      style="display:flex;align-items:center;justify-content:space-between;gap:8px;"
    >
      <a href=${"https://www.buymeacoffee.com/jrhubott"} target="_blank" rel="noopener noreferrer">
        <img src=${"https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black"} alt=${Ge("editor.common.support_alt",e)} height="20" />
      </a>
      <span class="version-footer dim">
        ${Ge("root.footer_version",e,{version:fe})}
      </span>
    </div>
  `}ti.styles=r`
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
  `,e([_e({attribute:!1})],ti.prototype,"hass",void 0),e([_e({attribute:!1})],ti.prototype,"discovered",void 0),e([_e({type:Boolean,reflect:!0})],ti.prototype,"open",void 0),e([_e({type:Boolean})],ti.prototype,"advancedOpen",void 0),e([_e({type:Boolean})],ti.prototype,"showCompass",void 0),e([_e({type:Boolean})],ti.prototype,"showElevationChart",void 0),e([_e({type:Boolean})],ti.prototype,"showSolarCalc",void 0),e([_e({attribute:!1})],ti.prototype,"badges",void 0),ti=e([he("acp-more-info-dialog")],ti);const ii=["auto","solar","force","weather","manual","custom_position","motion","climate","glare_zone","cloud"],oi={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_compass:!0,show_elevation_chart:!0,show_solar_calc:!0,show_motion_icon:!0,layout:"detailed",badge_auto:!0,badge_solar:!0,badge_force:!0,badge_weather:!0,badge_manual:!0,badge_custom_position:!0,badge_motion:!0,badge_climate:!0,badge_glare_zone:!0,badge_cloud:!0},ni={entry_id:"editor.common.entry_id",name:"editor.tile.name",icon:"editor.tile.icon",cover:"editor.tile.cover",layout:"editor.tile.layout",show_position:"editor.tile.show_position",show_state:"editor.tile.show_state",show_decision_summary:"editor.tile.show_decision_summary",show_controls:"editor.tile.show_controls",show_badge:"editor.tile.show_badge",badge_section:"editor.tile.badge_section",badge_auto:"editor.tile.badge_auto",badge_solar:"editor.tile.badge_solar",badge_force:"editor.tile.badge_force",badge_weather:"editor.tile.badge_weather",badge_manual:"editor.tile.badge_manual",badge_custom_position:"editor.tile.badge_custom_position",badge_motion:"editor.tile.badge_motion",badge_climate:"editor.tile.badge_climate",badge_glare_zone:"editor.tile.badge_glare_zone",badge_cloud:"editor.tile.badge_cloud",show_compass:"editor.tile.show_compass",show_elevation_chart:"editor.tile.show_elevation_chart",show_solar_calc:"editor.tile.show_solar_calc",show_motion_icon:"editor.tile.show_motion_icon",tap_action:"editor.tile.tap_action",hold_action:"editor.tile.hold_action",double_tap_action:"editor.tile.double_tap_action"};let ri=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=e=>{const t=ni[e.name];return t?Ge(t,this.hass):e.name},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,s]of Object.entries(oi))e.startsWith("badge_")?t[e]===s&&delete t[e]:this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==s||delete t[e];const s={};for(const e of ii){const i=`badge_${e}`;!1===t[i]&&(s[e]=!1),delete t[i]}const i={...this._config??{type:"",entry_id:""},...t};Object.keys(s).length>0?i.badges=s:delete i.badges,this._emit(i)}}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),e.has("_registry")&&null!==this._registry&&this._maybePrefillCover()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,xt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id}),this._maybePrefillCover()}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,$t(this.hass).then(e=>{this._registry=e,this._maybePrefillCover()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=At(this.hass,()=>{this._registryFetchInFlight=!0,$t(this.hass).then(e=>{this._registry=e}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_maybePrefillCover(){if(!this._config?.entry_id||this._config?.cover||!this._registry||!this.hass)return;const e=wt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=e?.managed_covers??[],1===e?.managed_covers.length&&this._emit({...this._config,cover:e.managed_covers[0]})}render(){if(!this._config)return W;if(this._entriesError&&!this._entries)return L`
        <div class="form">
          <div class="error">
            ${Ge("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${Ge("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${Ge("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          ${si(this.hass)}
        </div>
      `;const e=this._schema(),{badges:t,...s}=this._config,i={};for(const e of ii)t&&!1===t[e]&&(i[`badge_${e}`]=!1);const o={...oi,...s,...i};return L`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${o}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${this._managedCovers.length>1&&!this._config?.cover?L`<div class="hint">${Ge("editor.tile.cover_blank_hint",this.hass)}</div>`:W}
        ${si(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[],t=[{value:"one-line",label:Ge("editor.tile.layout_option_one_line",this.hass)},{value:"detailed",label:Ge("editor.tile.layout_option_detailed",this.hass)}];let s={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const e=wt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);e&&e.managed_covers.length>0&&(s={entity:{domain:"cover",include_entities:e.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:s},{name:"layout",selector:{select:{mode:"list",options:t}}},{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{type:"expandable",name:"",title:Ge("editor.tile.badge_section",this.hass),icon:"mdi:label-multiple-outline",schema:[{type:"grid",name:"",schema:ii.map(e=>({name:`badge_${e}`,selector:{boolean:{}}}))}]},{name:"show_motion_icon",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"show_elevation_chart",selector:{boolean:{}}},{name:"show_solar_calc",selector:{boolean:{}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};ri.styles=r`
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
  `,e([_e({attribute:!1})],ri.prototype,"hass",void 0),e([ge()],ri.prototype,"_config",void 0),e([ge()],ri.prototype,"_entries",void 0),e([ge()],ri.prototype,"_entriesError",void 0),e([ge()],ri.prototype,"_registry",void 0),e([ge()],ri.prototype,"_managedCovers",void 0),ri=e([he($e)],ri);let ai=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=vt(),this._discovered=null,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),zs(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return zs(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${xe}: \`entry_id\` is required and must be a non-empty string`);let t={...e};if("string"==typeof t.tap_action&&(t={...t,tap_action:"none"===t.tap_action?{action:"none"}:void 0}),this._config=t,t.tooltips&&_t(t.tooltips),null===this._registry){const e=Ot.get(t.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 1}getGridOptions(){return{columns:"full",rows:"auto",min_columns:3,min_rows:"one-line"!==this._config?.layout?2:1}}static async getStubConfig(e){let t="";try{const s=await xt(e);t=s[0]?.entry_id??""}catch{}return{type:`custom:${xe}`,entry_id:t}}static async getConfigElement(){return document.createElement($e)}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=St();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||me(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=At(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Et(this.hass,e).then(e=>{t===this._fetchGen&&e!==this._registry&&(this._registry=e,this._registryError=null,this._config&&Ot.set(this._config.entry_id,It(e,this._config.entry_id)))}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return W;if(null===this._registry)return L`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Ge("tile.registry_failed",this.hass,{error:this._registryError}):Ge("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=this._discovered;return e?L`
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
    `:L`<ha-card>
        <div class="empty">
          <p class="dim">
            ${Ge("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`}_buildHandlerLabels(){const e={};for(const[t,s]of Object.entries(ze))e[t]=Ge(s,this.hass);return e}_renderTile(e){const t=this._config,s=t.name??e.entry_title,i=this._resolvedCover(e),o=t.icon??function(e,t){if(null!==t&&!Number.isNaN(t)){if(t>=95)return Me[e]??"mdi:window-shutter-open";if(t<=5)return Ie[e]??"mdi:window-shutter"}return Oe[e]??"mdi:window-shutter"}(e.cover_type,this._liveCoverPosition(i)),n=!1!==t.show_position,r=!1!==t.show_state,a=!1!==t.show_controls,l=!1!==t.show_badge,c=!1!==t.show_motion_icon?this._motionActiveState(e):null,d=Ge("timeout_pending"===c?"tile.motion_pending":"tile.motion_detected",this.hass),h="one-line"!==t.layout,u=this._currentPosition(e),p=this._liveCoverPosition(i),_=p??u,g=null!==p&&p>=100,m=null!==p&&p<=0,f=this._winner(e),v=this._traceAttrs(e),y=this._manualEndIso(e),b=this._isFullyInert(t),w=bs(v),x=!0===t.show_decision_summary&&v?xs(v.trace??[],v,0,this._buildHandlerLabels(),Ge("badge.safety",this.hass)):"",$=!!x&&h,A=this._switchOn(e,"integration_enabled_switch"),k=this._switchOn(e,"automatic_control_switch"),C=this._manualOverrideOn(e),S=function(e){const t=function(e){const t=Fs(e);return"motion"!==t?t:!1===e.badges?.motion||e.showMotionIcon?!1===e.badges?.auto?null:"auto":t}(e);return!1===e.inTimeWindow&&!1!==e.badges?.off_schedule&&"off"!==t&&"manual"!==t&&"force"!==t?"off_schedule":t}({winner:f,integrationEnabled:A,manualActive:C,badges:t.badges,showMotionIcon:!1!==t.show_motion_icon,inTimeWindow:v?.in_time_window}),E=Ts(v?.trace,f),z=null!==S&&Os([S],t.badges,E).length>0,O=l&&z&&!(!1===k&&!0===A),M=function(e){if(!e.integrationEnabled)return!1;if(!e.automaticControl)return!1;if(e.manualActive)return!1;const t=ws(e.winner);return"force"!==t&&("custom_position"!==t||!e.bypassAutoControl&&!0!==e.safetyActive)}({winner:f,integrationEnabled:A,automaticControl:k,manualActive:C,bypassAutoControl:!0===v?.bypass_auto_control,safetyActive:w}),I=h&&l&&!1!==t.badges?.auto&&M,F=!(I&&"auto"===S),T=r?function(e,t){if(!e||!t)return null;const s=e.states[t];if(!s?.state||"unknown"===s.state||"unavailable"===s.state)return null;if("function"==typeof e.formatEntityState){const t=e.formatEntityState(s);if(t)return t}if("function"==typeof e.localize){const t=e.localize(`component.cover.entity_component._.state.${s.state}`);if(t)return t}return s.state.charAt(0).toUpperCase()+s.state.slice(1)}(this.hass,i):null,P=[T,n&&null!==_?es(_):null].filter(e=>!!e),j=!!T,R=function(e,t,s){if(!Array.isArray(e?.custom_position_slots))return null;const i=e.custom_position_slots.filter(e=>!0===e.min_mode&&!0===e.enabled&&null!==e.sensor&&null!==e.position&&"on"===t[e.sensor]?.state);if(0===i.length)return null;const o=i.reduce((e,t)=>(t.position??0)>(e.position??0)?t:e),n=o.position,r=o.priority??null;return{slot:o.slot,position:n,label:o.sensor_name??`#${o.slot}`,clamping:null!==s&&n>s,sensorOn:!0,priority:r,resistsManual:null!=r&&r>80}}(v,this.hass.states,u),N=ws(f),D=!!R&&!("custom_position"===N&&!0===v?.custom_position_minimum_mode)&&A,B=C&&!!e.entities.reset_override_button,V=P.length>0?L`<div class="position">${P.join(" · ")}</div>`:W,G=D?L`<span
          class=${`acp-floor-chip${R.clamping?"":" is-armed"}${R.resistsManual?" resists-manual":" is-bypassable"}`}
          ${ft(Ge("dialog.floor_tooltip",this.hass))}
          >${Ge("dialog.floor",this.hass)} ${es(R.position)}</span
        >`:W,K=O?L`<acp-tile-badge
          .hass=${this.hass}
          .winner=${f}
          .kindOverride=${S??void 0}
          .integrationEnabled=${A}
          .slotNumber=${v?.custom_position_active_slot}
          .slotName=${v?.custom_position_active_slot_name}
          .pct=${ys(v,u)??void 0}
          .minimumMode=${v?.custom_position_minimum_mode}
          .safetyActive=${w}
          .manualEndIso=${y}
          .manualActive=${C}
          .resumable=${B}
          @acp-resume=${()=>this._resume(e)}
        ></acp-tile-badge>`:W,q=I?L`<acp-tile-badge
          .hass=${this.hass}
          .winner=${f}
          .kindOverride=${"auto"}
          .integrationEnabled=${A}
        ></acp-tile-badge>`:W;return L`
      <div
        class=${`tile-body${h?" detailed":""}${$?" has-summary":""}${j?" has-state-label":""}${D?" has-floor-chip":""}`}
        role=${b?"group":"button"}
        tabindex=${b?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
          <ha-icon class="cover-icon" icon=${o}></ha-icon>
          ${c?L`<ha-icon
                class="motion-overlay ${c}"
                icon="mdi:motion-sensor"
                ${ft(d)}
              ></ha-icon>`:W}
        </div>
        <div class="label">
          <div class="title">${s}</div>
          ${x&&!h?L`<div class="summary">${x}</div>`:W}
          ${$?L`<div class="summary inline-summary" ${ft(x)}>${x}</div>`:W}
        </div>
        ${h&&I?L`<div class="auto-line">${q}</div>`:W}
        ${h?L`<div class="detail-line">
              ${V}${G}${F?K:W}
            </div>`:L`${V}${G}`}
        ${a?L`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${Ge("tile.open",this.hass)}
                ?disabled=${!i||g}
                @click=${()=>this._setCoverPosition(i,100)}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${Ge("tile.stop",this.hass)}
                ?disabled=${!i}
                @click=${()=>this._stopCover(i)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${Ge("tile.close",this.hass)}
                ?disabled=${!i||m}
                @click=${()=>this._setCoverPosition(i,0)}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </div>`:W}
        ${h?W:K}
      </div>
    `}_resolvedCover(e){return this._config?.cover?this._config.cover:e.managed_covers[0]}_currentPosition(e){const t=e.entities.target_position_sensor;if(!t)return null;const s=this.hass.states[t];if(!s)return null;const i=parseFloat(s.state);return Number.isNaN(i)?null:i}_liveCoverPosition(e){if(!e)return null;const t=this.hass.states[e]?.attributes?.current_position;return"number"!=typeof t||Number.isNaN(t)?null:t}_winner(e){const t=e.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(e){const t=e.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_motionActiveState(e){const t=e.entities.motion_status_sensor;if(!t)return null;const s=this.hass.states[t]?.state;return"motion_detected"===s||"timeout_pending"===s?s:null}_manualOverrideOn(e){const t=e.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(e,t){const s=e.entities[t];return!s||"off"!==this.hass.states[s]?.state}_manualEndIso(e){if(!this._manualOverrideOn(e))return;const t=e.entities.manual_override_end_sensor;return t?this.hass.states[t]?.state:void 0}_setCoverPosition(e,t){e&&this.hass.callService(Ce,"set_position",{position:t},{entity_id:e})}_stopCover(e){e&&this.hass.callService(Ce,"stop",{},{entity_id:e})}_resume(e){const t=e.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}_tapActionConfig(){const e=this._config?.tap_action;if("string"!=typeof e)return e}_isFullyInert(e){return!!(e=>!!e&&"none"===e.action)(this._tapActionConfig())&&!zs(e.hold_action)&&!zs(e.double_tap_action)}_fireAction(e){if(!this._config||!this.hass)return;const t=this._tapActionConfig();if("tap"===e&&void 0===t)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const s=this._resolvedCoverFromState();((e,t,s,i)=>{let o;"double_tap"===i&&s.double_tap_action?o=s.double_tap_action:"hold"===i&&s.hold_action?o=s.hold_action:"tap"===i&&s.tap_action&&(o=s.tap_action),((e,t,s,i)=>{if(i||(i={action:"more-info"}),!i.confirmation||i.confirmation.exemptions&&i.confirmation.exemptions.some(e=>e.user===t.user.id)||(Es("warning"),confirm(i.confirmation.text||`Are you sure you want to ${i.action}?`)))switch(i.action){case"more-info":(s.entity||s.camera_image)&&Ss(e,"hass-more-info",{entityId:s.entity?s.entity:s.camera_image});break;case"navigate":i.navigation_path&&((e,t,s=!1)=>{s?history.replaceState(null,"",t):history.pushState(null,"",t),Ss(window,"location-changed",{replace:s})})(0,i.navigation_path);break;case"url":i.url_path&&window.open(i.url_path);break;case"toggle":s.entity&&(((e,t)=>{((e,t,s=!0)=>{const i=function(e){return e.substr(0,e.indexOf("."))}(t),o="group"===i?"homeassistant":i;let n;switch(i){case"lock":n=s?"unlock":"lock";break;case"cover":n=s?"open_cover":"close_cover";break;default:n=s?"turn_on":"turn_off"}e.callService(o,n,{entity_id:t})})(e,t,Cs.includes(e.states[t].state))})(t,s.entity),Es("success"));break;case"call-service":{if(!i.service)return void Es("failure");const[e,s]=i.service.split(".",2);t.callService(e,s,i.service_data,i.target),Es("success");break}case"fire-dom-event":Ss(e,"ll-custom",i)}})(e,t,s,o)})(this,this.hass,{entity:s,tap_action:t,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},e)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const e=this._discovered??this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?.managed_covers[0]}_stop(e){e.stopPropagation()}};ai.styles=r`
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
  `,e([_e({attribute:!1})],ai.prototype,"hass",void 0),e([ge()],ai.prototype,"_config",void 0),e([ge()],ai.prototype,"_registry",void 0),e([ge()],ai.prototype,"_registryError",void 0),e([ge()],ai.prototype,"_dialogOpen",void 0),ai=e([he(xe)],ai),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===xe)||window.customCards.push({type:xe,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const li=[{key:"sky",labelKey:"editor.main.section_sky_label",descKey:"editor.main.section_sky_desc"},{key:"elevation",labelKey:"editor.main.section_elevation_label",descKey:"editor.main.section_elevation_desc"},{key:"decision",labelKey:"editor.main.section_decision_label",descKey:"editor.main.section_decision_desc"},{key:"covers",labelKey:"editor.main.section_covers_label",descKey:"editor.main.section_covers_desc"},{key:"overrides",labelKey:"editor.main.section_overrides_label",descKey:"editor.main.section_overrides_desc"},{key:"climate",labelKey:"editor.main.section_climate_label",descKey:"editor.main.section_climate_desc"},{key:"solar",labelKey:"editor.main.section_solar_label",descKey:"editor.main.section_solar_desc",enabledByDefault:!1}],ci=li.filter(e=>!1!==e.enabledByDefault).map(e=>e.key);let di=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,xt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??ci}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_onEntryChange(e){const t=e.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:t})}_onSectionToggle(e,t){const s=new Set(this._currentSections);t?s.add(e):s.delete(e);const i=li.map(e=>e.key).filter(e=>s.has(e));this._emit({...this._config??{type:"",entry_id:""},show_sections:i})}_onCompactToggle(e){this._emit({...this._config??{type:"",entry_id:""},compact:e})}_onCompassStatsToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:e})}_onCompassLegendToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:e})}_onMoonToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_moon:e})}_onHideInactiveToggle(e){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:e})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),s=Number.isFinite(t)?t:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:s})}_onControlToggle(e,t){const s=this._config??{type:"",entry_id:""};this._emit({...s,controls:{...s.controls,[e]:t}})}_onCoverColorChange(e){const t=this._config??{type:"",entry_id:""};this._emit({...t,cover_colors:[e]})}_onCoverColorReset(){const e={...this._config??{type:"",entry_id:""}};delete e.cover_colors,this._emit(e)}render(){if(!this._config)return W;const e=new Set(this._currentSections);return L`
      <div class="form">
        <div class="section">
          <label class="field-label">${Ge("editor.common.entry_id",this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${Ge("editor.main.sections",this.hass)}</label>
          <div class="hint">${Ge("editor.main.sections_hint",this.hass)}</div>
          ${li.map(t=>L`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${e.has(t.key)}
                  @change=${e=>this._onSectionToggle(t.key,e.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${Ge(t.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${Ge(t.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${Ge("editor.main.controls",this.hass)}</label>
          <div class="hint">${Ge("editor.main.controls_hint",this.hass)}</div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.integration_enabled??!0}
              @change=${e=>this._onControlToggle("integration_enabled",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${Ge("editor.main.integration_pill_label",this.hass)}</span
              >
              <span class="toggle-desc">${Ge("editor.main.integration_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.automatic_control??!0}
              @change=${e=>this._onControlToggle("automatic_control",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Ge("editor.main.automatic_pill_label",this.hass)}</span>
              <span class="toggle-desc">${Ge("editor.main.automatic_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.reset_manual_override??!0}
              @change=${e=>this._onControlToggle("reset_manual_override",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Ge("editor.main.reset_button_label",this.hass)}</span>
              <span class="toggle-desc">${Ge("editor.main.reset_button_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        ${this._config.entry_id?L`
              <div class="section">
                <label class="field-label">${Ge("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${Ge("editor.compass.cover_colors_hint",this.hass)}</div>
                ${(()=>{const e=this._config.cover_colors?.[0]??null,t=e??ls(0);return L`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${t}
                        @change=${e=>this._onCoverColorChange(e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-desc"
                          >${e||Ge("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!e}
                        @click=${()=>this._onCoverColorReset()}
                      >
                        ${Ge("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})()}
              </div>
            `:W}

        <div class="section">
          <label class="field-label">${Ge("editor.main.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${e=>this._onCompactToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Ge("editor.main.compact_label",this.hass)}</span>
              <span class="toggle-desc">${Ge("editor.main.compact_desc",this.hass)}</span>
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
                >${Ge("editor.main.show_compass_stats_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${Ge("editor.main.show_compass_stats_desc",this.hass)}</span
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
                >${Ge("editor.main.show_compass_legend_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${Ge("editor.main.show_compass_legend_desc",this.hass)}</span
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
              <span class="toggle-label">${Ge("editor.main.show_moon_label",this.hass)}</span>
              <span class="toggle-desc">${Ge("editor.main.show_moon_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.hide_inactive_handlers??!1}
              @change=${e=>this._onHideInactiveToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${Ge("editor.main.hide_inactive_label",this.hass)}</span>
              <span class="toggle-desc">${Ge("editor.main.hide_inactive_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">${Ge("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${Ge("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${si(this.hass)}
      </div>
    `}_renderEntryPicker(){return this._entriesError?L`
        <div class="error">
          ${Ge("editor.common.load_failed",this.hass,{error:this._entriesError})}
        </div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder=${Ge("editor.common.entry_id_manual_placeholder",this.hass)}
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?L`
        <div class="error">
          ${Ge("editor.common.no_entries",this.hass)}
          <code>${Ge("editor.common.no_entries_path",this.hass)}</code>${Ge("editor.common.no_entries_then",this.hass)}
        </div>
      `:L`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(e=>e.entry_id===this._config.entry_id)?L`<option value=${this._config.entry_id}>
              ${Ge("editor.common.unknown_entry",this.hass,{entry:this._config.entry_id})}
            </option>`:W}
        ${this._entries.map(e=>L`
            <option value=${e.entry_id} ?selected=${e.entry_id===this._config?.entry_id}>
              ${e.title}
            </option>
          `)}
      </select>
    `:L`<div class="hint">${Ge("editor.common.loading_entries",this.hass)}</div>`}};di.styles=r`
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
  `,e([_e({attribute:!1})],di.prototype,"hass",void 0),e([ge()],di.prototype,"_config",void 0),e([ge()],di.prototype,"_entries",void 0),e([ge()],di.prototype,"_entriesError",void 0),di=e([he(ye)],di);const hi=[{key:"compact",labelKey:"editor.compass.toggle_compact_label",descKey:"editor.compass.toggle_compact_desc",defaultOn:!1},{key:"show_legend",labelKey:"editor.compass.toggle_legend_label",descKey:"editor.compass.toggle_legend_desc",defaultOn:!0},{key:"show_stats",labelKey:"editor.compass.toggle_stats_label",descKey:"editor.compass.toggle_stats_desc",defaultOn:!0},{key:"show_moon",labelKey:"editor.compass.toggle_moon_label",descKey:"editor.compass.toggle_moon_desc",defaultOn:!1},{key:"show_cardinals",labelKey:"editor.compass.toggle_cardinals_label",descKey:"editor.compass.toggle_cardinals_desc",defaultOn:!0},{key:"show_blind_spot",labelKey:"editor.compass.toggle_blind_spot_label",descKey:"editor.compass.toggle_blind_spot_desc",defaultOn:!0},{key:"show_sun_path",labelKey:"editor.compass.toggle_sun_path_label",descKey:"editor.compass.toggle_sun_path_desc",defaultOn:!0},{key:"show_sunrise_sunset",labelKey:"editor.compass.toggle_sunrise_sunset_label",descKey:"editor.compass.toggle_sunrise_sunset_desc",defaultOn:!0},{key:"show_cover_fill",labelKey:"editor.compass.toggle_cover_fill_label",descKey:"editor.compass.toggle_cover_fill_desc",defaultOn:!0},{key:"show_window_arrow",labelKey:"editor.compass.toggle_window_arrow_label",descKey:"editor.compass.toggle_window_arrow_desc",defaultOn:!0},{key:"show_elevation_chart",labelKey:"editor.compass.toggle_elevation_chart_label",descKey:"editor.compass.toggle_elevation_chart_desc",defaultOn:!0}];let ui=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,xt(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${be}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let s=0;s<e.length;s++)e[s]&&(t=s);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,s){const i=this._trimColors(t),{cover_colors:o,...n}=e,r=i?{...n,...s,cover_colors:i}:{...n,...s};this._emit(r)}_onCoverColorChange(e,t){const s=this._baseConfig(),i=[...s.cover_colors??[]];for(;i.length<=e;)i.push(null);i[e]=t,this._emitWithColors(s,i)}_onCoverColorReset(e){const t=this._baseConfig(),s=[...t.cover_colors??[]];e<s.length&&(s[e]=null),this._emitWithColors(t,s)}_onEntryToggle(e,t){const s=this._baseConfig(),i=new Set(s.entry_ids);t?i.add(e):i.delete(e);const o=(this._entries??[]).map(e=>e.entry_id).filter(e=>i.has(e)),n=s.cover_colors??[],r=o.map(e=>{const t=s.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(s,r,{entry_ids:o})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),s=Number.isFinite(t)?t:0;this._emit({...this._baseConfig(),north_offset:s})}_onTitleChange(e){const t=e.target.value,s=this._baseConfig();if(t)this._emit({...s,title:t});else{const{title:e,...t}=s;this._emit(t)}}render(){if(!this._config)return W;const e=new Set(this._config.entry_ids);return L`
      <div class="form">
        <div class="section">
          <label class="field-label">${Ge("editor.compass.instances",this.hass)}</label>
          <div class="hint">${Ge("editor.compass.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(e)}
        </div>

        <div class="section">
          <label class="field-label">${Ge("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${Ge("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?L`
              <div class="section">
                <label class="field-label">${Ge("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${Ge("editor.compass.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const s=this._config.cover_colors?.[t]??null,i=s??ls(t),o=this._entries?.find(t=>t.entry_id===e);return L`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${i}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${o?.title??e}</span>
                        <span class="toggle-desc"
                          >${s||Ge("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!s}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${Ge("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:W}

        <div class="section">
          <label class="field-label">${Ge("editor.compass.display",this.hass)}</label>
          ${hi.map(e=>L`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${this._config[e.key]??e.defaultOn}
                  @change=${t=>this._onToggle(e.key,t.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${Ge(e.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${Ge(e.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${Ge("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${Ge("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${si(this.hass)}
      </div>
    `}_renderEntryPicker(e){return this._entriesError?L`<div class="error">
        ${Ge("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?L`
        <div class="error">
          ${Ge("editor.common.no_entries",this.hass)}
          <code>${Ge("editor.common.no_entries_path",this.hass)}</code>${Ge("editor.common.no_entries_then",this.hass)}
        </div>
      `:L`
      <div class="entry-list">
        ${this._entries.map(t=>L`
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
    `:L`<div class="hint">${Ge("editor.common.loading_entries",this.hass)}</div>`}};ui.styles=r`
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
  `,e([_e({attribute:!1})],ui.prototype,"hass",void 0),e([ge()],ui.prototype,"_config",void 0),e([ge()],ui.prototype,"_entries",void 0),e([ge()],ui.prototype,"_entriesError",void 0),ui=e([he(we)],ui);let pi=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._listMemo=function(){const e=new Map;let t=[],s=[],i={list:[],missing:[]};return(o,n,r,a)=>{const l=n.map(t=>{let s=e.get(t);return s||(s=vt(),e.set(t,s)),s(o,{type:a,entry_id:t},r)});if(e.size>n.length)for(const t of e.keys())n.includes(t)||e.delete(t);const c=t.length===n.length&&t.every((e,t)=>e===n[t])&&s.length===l.length&&s.every((e,t)=>e===l[t]);if(c)return i;t=n.slice(),s=l;const d=[],h=[];return n.forEach((e,t)=>{const s=l[t];s?d.push(s):h.push(e)}),i={list:d,missing:h},i}}(),this._discoveredResult={list:[],missing:[]}}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");if(this._config={...e,entry_ids:[...e.entry_ids]},e.tooltips&&_t(e.tooltips),null===this._registry){const e=this._config.entry_ids.map(e=>Ot.get(e)?.entries);e.every(e=>void 0!==e)&&(this._registry=e.flat())}}getCardSize(){return 4}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(we)}static async getStubConfig(e){let t=[];try{const s=await xt(e);s[0]&&(t=[s[0].entry_id])}catch{}return{type:`custom:${be}`,entry_ids:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=St();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=[];for(const e of this._discoveredResult.list)t.push(...Object.values(e.entities));return 0===t.length||me(e.get("hass"),this.hass,t)}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discoveredResult=this._listMemo(this.hass,this._config.entry_ids,this._registry,this._config.type))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=At(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Et(this.hass,e).then(e=>{if(e!==this._registry&&(this._registry=e,this._registryError=null,this._config))for(const t of this._config.entry_ids)Ot.set(t,It(e,t))}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return W;if(null===this._registry)return L`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Ge("tile.registry_failed",this.hass,{error:this._registryError}):Ge("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const{list:e,missing:t}=this._discoveredResult;if(0===e.length)return L`<ha-card>
        <div class="empty">
          <p><strong>${Ge("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${Ge("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const s=this._config;return L`
      <ha-card>
        ${s.title?L`<div class="card-header">${s.title}</div>`:W}
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
          .northOffsetDeg=${it(s.north_offset??0)}
        ></acp-sky-compass>
        ${!1!==s.show_elevation_chart?L`<acp-elevation-chart
              .hass=${this.hass}
              .discoveredList=${e}
              .coverColors=${s.cover_colors??[]}
              ?compact=${!!s.compact}
            ></acp-elevation-chart>`:W}
        ${t.length>0?L`<div class="warn dim">
              ${Ge("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:W}
      </ha-card>
    `}};pi.styles=r`
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
  `,e([_e({attribute:!1})],pi.prototype,"hass",void 0),e([ge()],pi.prototype,"_config",void 0),e([ge()],pi.prototype,"_registry",void 0),e([ge()],pi.prototype,"_registryError",void 0),pi=e([he(be)],pi),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===be)||window.customCards.push({type:be,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const _i={compact:!1,hide_inactive_handlers:!1,show_decision_summary:!0},gi={entry_id:"editor.common.entry_id",title:"editor.decision.title",compact:"editor.decision.compact_label",hide_inactive_handlers:"editor.decision.hide_inactive_handlers_label",show_decision_summary:"editor.decision.show_decision_summary_label"},mi={compact:"editor.decision.compact_desc",hide_inactive_handlers:"editor.decision.hide_inactive_handlers_desc",show_decision_summary:"editor.decision.show_decision_summary_desc"};let fi=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._entriesFetchInFlight=!1,this._computeLabel=e=>{const t=gi[e.name];return t?Ge(t,this.hass):e.name},this._computeHelper=e=>{const t=mi[e.name];return t?Ge(t,this.hass):void 0},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,s]of Object.entries(_i))this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==s||delete t[e];const s={...this._config??{type:"",entry_id:""},...t};this._emit(s)}}setConfig(e){this._config={...e}}updated(e){e.has("hass")&&this.hass&&this._ensureEntries()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,xt(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this._config)return W;if(this._entriesError&&!this._entries)return L`
        <div class="form">
          <div class="error">
            ${Ge("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${Ge("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${Ge("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          ${si(this.hass)}
        </div>
      `;const e=this._schema(),t={..._i,...this._config};return L`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${t}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${si(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[];return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"title",selector:{text:{}}},{name:"compact",selector:{boolean:{}}},{name:"hide_inactive_handlers",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}}]}};fi.styles=r`
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
  `,e([_e({attribute:!1})],fi.prototype,"hass",void 0),e([ge()],fi.prototype,"_config",void 0),e([ge()],fi.prototype,"_entries",void 0),e([ge()],fi.prototype,"_entriesError",void 0),fi=e([he(ke)],fi);let vi=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._memo=vt(),this._discovered=null}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${Ae}: \`entry_id\` is required and must be a non-empty string`);if(this._config={...e},e.tooltips&&_t(e.tooltips),null===this._registry){const t=Ot.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 3}getGridOptions(){return{columns:12,rows:"auto",min_columns:4,max_columns:12}}static async getStubConfig(e){let t="";try{const s=await xt(e);t=s[0]?.entry_id??""}catch{}return{type:`custom:${Ae}`,entry_id:t}}static async getConfigElement(){return document.createElement(ke)}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=St();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||me(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=At(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Et(this.hass,e).then(e=>{t===this._fetchGen&&e!==this._registry&&(this._registry=e,this._registryError=null,this._config&&Ot.set(this._config.entry_id,It(e,this._config.entry_id)))}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return W;if(null===this._registry)return L`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?Ge("tile.registry_failed",this.hass,{error:this._registryError}):Ge("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=this._discovered;if(!e)return L`<ha-card>
        <div class="empty">
          <p class="dim">
            ${Ge("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`;const t=this._config;return L`
      <ha-card>
        ${t.title?L`<div class="card-header">${t.title}</div>`:W}
        <acp-decision-strip
          .hass=${this.hass}
          .discovered=${e}
          ?compact=${!!t.compact}
          ?hide-inactive=${!!t.hide_inactive_handlers||!!t.compact}
          .showSummary=${!1!==t.show_decision_summary}
        ></acp-decision-strip>
      </ha-card>
    `}};vi.styles=r`
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
  `,e([_e({attribute:!1})],vi.prototype,"hass",void 0),e([ge()],vi.prototype,"_config",void 0),e([ge()],vi.prototype,"_registry",void 0),e([ge()],vi.prototype,"_registryError",void 0),vi=e([he(Ae)],vi),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===Ae)||window.customCards.push({type:Ae,name:"Adaptive Cover Pro — Decision Strip",description:"Standalone decision strip: all pipeline handlers for one Adaptive Cover Pro instance with the winning row highlighted.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const yi=["sky","elevation","decision","covers","overrides","climate"];let bi=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._discoveredList=[],this._discoveredListSource=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=vt(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(e){if(!e?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...e},e.tooltips&&_t(e.tooltips),null===this._registry){const t=Ot.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(ye)}static async getStubConfig(e){let t="";try{const s=await xt(e);t=s[0]?.entry_id??""}catch{}return{type:`custom:${ve}`,entry_id:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=St();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||me(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){null!==this._registry&&this._config&&this.hass&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry)),this._discovered!==this._discoveredListSource&&(this._discoveredListSource=this._discovered,this._discoveredList=this._discovered?[this._discovered]:[])}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=At(this.hass,e=>{const t=new Set(It(this._registry??[],this._config?.entry_id??"").map(e=>e.entity_id));(function(e,t){return"create"===e.action||t.has(e.entity_id)})(e,t)&&this._scheduleRefetch()}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Et(this.hass,e).then(e=>{if(e===this._registry)return;const t=this._config?.entry_id;if(t){const s=It(e,t);(null===this._registry||function(e,t){if(e.length!==t.length)return!0;const s=new Map(e.map(e=>[e.entity_id,Mt(e)]));for(const e of t)if(s.get(e.entity_id)!==Mt(e))return!0;return!1}(It(this._registry,t),s))&&(this._registry=e,Ot.set(t,s))}else this._registry=e;this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const e=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=e);const t=e-this._debounceFirstAt,s=this._DEBOUNCE_MAX-t,i=Math.min(this._DEBOUNCE_DELAY,s);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),i<=0)return this._debounceFirstAt=null,void this._fetchRegistry(!0);this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry(!0)},i)}get _sections(){return this._config?.show_sections??yi}_renderHeader(e,t){const s=Oe[e.cover_type]??"mdi:window-shutter",i=e.entities.integration_enabled_switch,o=e.entities.automatic_control_switch,n=!i||"on"===this.hass.states[i]?.state,r=!o||"on"===this.hass.states[o]?.state;return L`
      <div class="header">
        <ha-icon .icon=${s}></ha-icon>
        <span class="title">${e.entry_title}</span>
        <span class="spacer"></span>
        ${i?L`<acp-header-pill
              .on=${n}
              .readonly=${!t.integration_enabled}
              .label=${Ge(n?"header.on":"header.off",this.hass)}
              title=${Ge("header.integration_enabled",this.hass)}
              @pill-click=${()=>this._toggle(i)}
            ></acp-header-pill>`:W}
        ${o?L`<acp-header-pill
              .on=${r}
              .readonly=${!t.automatic_control}
              .label=${Ge("header.auto",this.hass)}
              title=${Ge("header.automatic_control",this.hass)}
              @pill-click=${()=>this._toggle(o)}
            ></acp-header-pill>`:W}
      </div>
    `}_toggle(e){const t=e.split(".")[0];this.hass.callService(t,"toggle",{entity_id:e})}_renderLoading(){return L`
      <ha-card>
        <div class="empty">
          <p class="dim">${Ge("root.loading_registry",this.hass)}</p>
        </div>
      </ha-card>
    `}_renderEmpty(e){const t=this._config.entry_id,s=this._registry?.length??0,i=this._registry?.filter(e=>e.config_entry_id===t&&"adaptive_cover_pro"===e.platform).length;return L`
      <ha-card>
        <div class="empty">
          <p><strong>${Ge("root.no_entities_title",this.hass)}</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${t}</code></p>
          <ul class="diag">
            <li>Reason: <code>${e}</code></li>
            <li>Registry entries loaded: <code>${s}</code></li>
            <li>ACP entities matching entry_id: <code>${i??"—"}</code></li>
            ${this._registryError?L`<li>Registry fetch error: <code>${this._registryError}</code></li>`:W}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return W;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const e=this._discovered;if(!e)return this._renderEmpty("no matching entities after unique_id lookup");const t=(s=this._config,{...Re,...s?.controls});var s;const i=this._sections;return L`
      <ha-card>
        ${this._renderHeader(e,t)}
        <div class="body ${this._config.compact?"compact":""}">
          ${i.includes("sky")?L`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .coverColors=${this._config.cover_colors??[]}
                .northOffsetDeg=${it(this._config.north_offset??0)}
              ></acp-sky-compass>`:W}
          ${i.includes("elevation")?L`<acp-elevation-chart
                .hass=${this.hass}
                .discoveredList=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .coverColors=${this._config.cover_colors??[]}
              ></acp-elevation-chart>`:W}
          ${i.includes("decision")?L`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                .showSummary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:W}
          ${i.includes("covers")?L`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .coverColor=${this._config.cover_colors?.[0]??null}
              ></acp-cover-bar>`:W}
          ${i.includes("overrides")?L`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .resetEnabled=${t.reset_manual_override}
              ></acp-overrides-panel>`:W}
          ${i.includes("climate")?L`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:W}
          ${i.includes("solar")?L`<acp-solar-calc
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-solar-calc>`:W}
        </div>
      </ha-card>
    `}};bi.styles=r`
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
  `,e([_e({attribute:!1})],bi.prototype,"hass",void 0),e([ge()],bi.prototype,"_config",void 0),e([ge()],bi.prototype,"_registry",void 0),e([ge()],bi.prototype,"_registryError",void 0),e([ge()],bi.prototype,"_discovered",void 0),bi=e([he(ve)],bi),window.customCards=window.customCards||[],window.customCards.push({type:ve,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${fe} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{bi as AdaptiveCoverProCard};
