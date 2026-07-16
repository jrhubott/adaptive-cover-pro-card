/*! adaptive-cover-pro-card v2.13.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function e(e,t,s,i){var o,n=arguments.length,r=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,s,r):o(t,s))||r);return n>3&&r&&Object.defineProperty(t,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let n=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new n(s,e,i)},a=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,g=globalThis,_=g.trustedTypes,m=_?_.emptyScript:"",f=g.reactiveElementPolyfillSupport,v=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},y=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);o?.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...u(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(t,s.type);this._$Em=e,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=i;const n=o.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){if(void 0!==e){const n=this.constructor;if(!1===i&&(o=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??y)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,f?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,A=$.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,O=`<${z}>`,M=document,I=()=>M.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,P="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,j=/>/g,D=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,K=/"/g,G=/^(?:script|style|textarea|title)$/i,L=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),U=L(1),W=L(2),V=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),H=new WeakMap,Y=M.createTreeWalker(M,129);function Q(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Z=(e,t)=>{const s=e.length-1,i=[];let o,n=2===t?"<svg>":3===t?"<math>":"",r=F;for(let t=0;t<s;t++){const s=e[t];let a,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===F?"!--"===l[1]?r=R:void 0!==l[1]?r=j:void 0!==l[2]?(G.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=D):void 0!==l[3]&&(r=D):r===D?">"===l[0]?(r=o??F,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?D:'"'===l[3]?K:B):r===K||r===B?r=D:r===R||r===j?r=F:(r=D,o=void 0);const h=r===D&&e[t+1].startsWith("/>")?" ":"";n+=r===F?s+O:c>=0?(i.push(a),s.slice(0,c)+C+s.slice(c)+E+h):s+E+(-2===c?t:h)}return[Q(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class X{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,n=0;const r=e.length-1,a=this.parts,[l,c]=Z(e,t);if(this.el=X.createElement(l,s),Y.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Y.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(C)){const t=c[n++],s=i.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?ie:"?"===r[1]?oe:"@"===r[1]?ne:se}),i.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:o}),i.removeAttribute(e));if(G.test(i.tagName)){const e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],I()),Y.nextNode(),a.push({type:2,index:++o});i.append(e[t],I())}}}else if(8===i.nodeType)if(i.data===z)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=i.data.indexOf(E,e+1));)a.push({type:7,index:o}),e+=E.length-1}o++}}static createElement(e,t){const s=M.createElement("template");return s.innerHTML=e,s}}function J(e,t,s=e,i){if(t===V)return t;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=T(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(t=J(e,o._$AS(e,t.values),o,i)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??M).importNode(t,!0);Y.currentNode=i;let o=Y.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new te(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new re(o,this,e)),this._$AV.push(t),a=s[++r]}n!==a?.index&&(o=Y.nextNode(),n++)}return Y.currentNode=M,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),T(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=X.createElement(Q(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ee(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=H.get(e.strings);return void 0===t&&H.set(e.strings,t=new X(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const o of e)i===t.length?t.push(s=new te(this.O(I()),this.O(I()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class se{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=q}_$AI(e,t=this,s,i){const o=this.strings;let n=!1;if(void 0===o)e=J(this,e,t,0),n=!T(e)||e!==this._$AH&&e!==V,n&&(this._$AH=e);else{const i=e;let r,a;for(e=o[0],r=0;r<o.length-1;r++)a=J(this,i[s+r],t,r),a===V&&(a=this._$AH[r]),n||=!T(a)||a!==this._$AH[r],a===q?e=q:e!==q&&(e+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends se{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class oe extends se{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class ne extends se{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??q)===V)return;const s=this._$AH,i=e===q&&s!==q||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==q&&(s===q||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const ae=$.litHtmlPolyfillSupport;ae?.(X,te),($.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let o=i._$litPart$;if(void 0===o){const e=s?.renderBefore??null;i._$litPart$=o=new te(t.insertBefore(I(),e),e,void 0,s??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ue={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},pe=(e=ue,t,s)=>{const{kind:i,metadata:o}=s;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const o=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,o,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];t.call(this,s),this.requestUpdate(i,o,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ge(e){return(t,s)=>"object"==typeof s?pe(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function _e(e){return ge({...e,state:!0,attribute:!1})}function me(e,t,s){if(!e)return!0;for(const i of s)if(i&&e.states[i]!==t.states[i])return!0;return!1}const fe="2.13.0",ve="adaptive-cover-pro-card",be="adaptive-cover-pro-card-editor",ye="adaptive-cover-pro-sky-compass-card",we="adaptive-cover-pro-sky-compass-card-editor",xe="adaptive-cover-pro-tile-card",$e="adaptive-cover-pro-tile-card-editor",ke="adaptive-cover-pro-decision-card",Ae="adaptive-cover-pro-decision-card-editor",Se="adaptive-cover-pro-solar-chart-card",Ce="adaptive-cover-pro-solar-chart-card-editor",Ee="adaptive_cover_pro",ze=["force","weather","group_scene","manual","group_lock","custom_position","motion","cloud","climate","glare_zone","solar","default","floor_clamp"],Oe={force:"Force Override",weather:"Weather Safety",group_scene:"Group Scene",manual:"Manual Override",group_lock:"Group Lock",custom_position:"Custom Position",motion:"Occupancy Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},Me={force:"handler.force",weather:"handler.weather",group_scene:"handler.group_scene",manual:"handler.manual",group_lock:"handler.group_lock",custom_position:"handler.custom_position",motion:"handler.motion",cloud:"handler.cloud",climate:"handler.climate",glare_zone:"handler.glare_zone",solar:"handler.solar",default:"handler.default",floor_clamp:"handler.floor_clamp"},Ie={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds",cover_venetian:"mdi:blinds"},Te={cover_blind:"mdi:blinds-open",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds-open",cover_venetian:"mdi:blinds-open"},Ne={cover_blind:"mdi:blinds-horizontal-closed",cover_awning:"mdi:window-closed-variant",cover_tilt:"mdi:blinds",cover_venetian:"mdi:blinds"},Pe={awning:{open:"mdi:awning-outline",partial:"mdi:awning-outline",closed:"mdi:awning-outline"},blind:{open:"mdi:blinds-open",partial:"mdi:blinds-horizontal",closed:"mdi:blinds-horizontal-closed"},curtain:{open:"mdi:curtains",partial:"mdi:curtains",closed:"mdi:curtains-closed"},damper:{open:"mdi:circle",partial:"mdi:circle-slice-8",closed:"mdi:circle-slice-8"},door:{open:"mdi:door-open",partial:"mdi:door-open",closed:"mdi:door-closed"},garage:{open:"mdi:garage-open",partial:"mdi:garage-open",closed:"mdi:garage"},gate:{open:"mdi:gate-open",partial:"mdi:gate-open",closed:"mdi:gate"},shade:{open:"mdi:roller-shade",partial:"mdi:roller-shade",closed:"mdi:roller-shade-closed"},shutter:{open:"mdi:window-shutter-open",partial:"mdi:window-shutter",closed:"mdi:window-shutter"},window:{open:"mdi:window-open",partial:"mdi:window-open",closed:"mdi:window-closed"}},Fe=new Set(["awning","curtain","door","gate"]),Re={manual:"manual",force:"force",weather:"weather",glare_zone:"glare_zone",climate:"climate",cloud:"cloud",custom_position:"custom_position",solar:"solar",motion:"motion",group_scene:"group",group_lock:"group"},je={auto:{label:"Auto",bg:"rgba(76, 175, 80, 0.18)",fg:"#2e7d32"},manual:{label:"Manual",bg:"rgba(255, 152, 0, 0.22)",fg:"#e65100"},force:{label:"Force",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},weather:{label:"Sun protection",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},glare_zone:{label:"Glare",bg:"rgba(244, 67, 54, 0.22)",fg:"#b71c1c"},climate:{label:"Climate",bg:"rgba(0, 150, 136, 0.22)",fg:"#00695c"},cloud:{label:"Cloudy",bg:"rgba(33, 150, 243, 0.22)",fg:"#0d47a1"},custom_position:{label:"Custom",bg:"rgba(156, 39, 176, 0.22)",fg:"#6a1b9a"},solar:{label:"Solar tracking",bg:"rgba(76, 175, 80, 0.22)",fg:"#1b5e20"},motion:{label:"Occupancy",bg:"rgba(255, 235, 59, 0.22)",fg:"#827717"},off:{label:"Off",bg:"rgba(97, 97, 97, 0.28)",fg:"#212121"},off_schedule:{label:"Off-schedule",bg:"rgba(96, 125, 139, 0.22)",fg:"#37474f"},group:{label:"Group",bg:"rgba(63, 81, 181, 0.20)",fg:"#283593"}},De={auto:"badge.auto",manual:"badge.manual",force:"badge.force",weather:"badge.weather",glare_zone:"badge.glare_zone",climate:"badge.climate",cloud:"badge.cloud",custom_position:"badge.custom_position",solar:"badge.solar",motion:"badge.motion",off:"badge.off",off_schedule:"badge.off_schedule",group:"badge.group"},Be={auto:"mdi:autorenew",manual:"mdi:hand-back-right",force:"mdi:flash",weather:"mdi:shield-sun",glare_zone:"mdi:weather-sunny-alert",climate:"mdi:thermostat",cloud:"mdi:weather-cloudy",custom_position:"mdi:bookmark",solar:"mdi:white-balance-sunny",motion:"mdi:motion-sensor",off:"mdi:power",off_schedule:"mdi:clock-alert-outline",group:"mdi:window-shutter-cog"},Ke={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},Ge={position:"target_position_sensor",tilt:"target_tilt_sensor"},Le={tilt:"covers.tilt_title"},Ue={"sensor:Cover_Position":"target_position_sensor","sensor:Cover_Tilt":"target_tilt_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:climate_status":"climate_status_sensor","sensor:position_forecast":"position_forecast_sensor","sensor:solar_calculation":"solar_calculation_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button","sensor:group_position":"group_position_sensor","sensor:group_state":"group_state_sensor","sensor:group_active_scene":"group_active_scene_sensor","sensor:group_climate_mode":"group_climate_mode_sensor","sensor:group_who_won":"group_who_won_sensor","select:group_scene_select":"group_scene_select","switch:group_automation":"group_automation_switch","switch:group_lock":"group_lock_switch","button:group_scene_all_open":"group_scene_all_open_button","button:group_scene_all_closed":"group_scene_all_closed_button","button:group_scene_privacy":"group_scene_privacy_button","button:group_clear_overrides":"group_clear_overrides_button","cover:group_cover":"group_cover"},We={en:{handler:{force:"Force Override",weather:"Weather Safety",group_scene:"Group Scene",manual:"Manual Override",group_lock:"Group Lock",custom_position:"Custom Position",motion:"Occupancy Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default",floor_clamp:"Min Floor"},badge:{auto:"Auto",manual:"Manual",force:"Force",weather:"Weather safety",glare_zone:"Glare",climate:"Climate",cloud:"Cloudy",custom_position:"Custom",solar:"Solar tracking",motion:"Occupancy idle",off:"Off",off_schedule:"Off-schedule",floor_suffix:" ↥",safety:"Safety",group:"Group"},group:{title:"Cover Group",scene:"Scene",scene_auto:"Auto",scene_all_open:"All open",scene_all_closed:"All closed",scene_privacy:"Privacy",state_open:"Open",state_closed:"Closed",state_mixed:"Mixed",state_unknown:"Unknown",lock:"Lock group",unlock:"Unlock group",automation:"Automation",clear_overrides:"Clear overrides",who_won:"{count}/{total} group-driven",members:"Members",member_placeholder:"No members reported by the integration."},forecast:{event:{sunrise:"Sunrise",sunset:"Sunset",fov_enter:"Sun enters window sun acceptance angle",fov_exit:"Sun leaves window sun acceptance angle"},hover_hint:"Hover the curve for time + forecast position; hover a colored line for the event it marks.",solar_only_note:"Solar geometry only — does not reflect manual overrides, custom positions, cloud suppression, or weather.",legend_forecast:"Forecast",legend_actual:"Actual"},dialog:{extend:{title:"Extend manual override",presets_label:"Until",relative_label:"Add time",absolute_label:"End at",preview:"Override until {time}",confirm:"Extend",cancel:"Cancel",tomorrow_suffix:" (tomorrow)"},configure_integration:"Configure integration",open_device_page:"Open device page",close:"Close",target:"Target",resume_auto:"Resume Auto",hide_advanced:"▼ Hide advanced",show_advanced:"▶ Advanced",custom_positions:"Custom positions",floor_tooltip:"Floor — slot raises position above raw calc",floor:"↥",disable_slot:"Disable slot {slot}",enable_slot:"Enable slot {slot}",on:"On",off:"Off",controls:"Controls",automatic:"Automatic",climate:"Climate",motion:"Occupancy",toggle_hint:"{label} {state} — tap to toggle",state_on:"on",state_off:"off",todays_forecast:"Today's forecast"},overrides:{title:"Overrides",manual:"Manual",force:"Force",motion:"Occupancy",active:"Active",off:"Off",ends_in:"ends in {time}",active_count:"{count} active",timeout:"expires in {time}",reset_manual:"Reset Manual"},climate:{title:"Climate",active:"Active: {strategy}",indoor:"Indoor",outdoor:"Outdoor",presence:"Presence",sunny:"Sunny",lux:"Lux",irradiance:"Irradiance",mode_off:"Climate mode off",standby:"Standby",threshold_low:"low",threshold_high:"high",threshold_summer_outside:"summer",reason:{outside_time_window:"Outside the operating time window",thresholds_not_met:"Temperatures within the comfort band — no action needed",other_mode_active:"Another control mode is currently active",readings_unavailable:"Temperature readings unavailable",mode_off:"Climate mode is turned off"}},compass:{placeholder_no_entries:"No Adaptive Cover Pro entries selected.",placeholder_no_sun:"Sun sensor not yet populated.",sun_tooltip:"Sun: {az} az / {el} el",sunrise_tooltip:"Sunrise: {time}",sunset_tooltip:"Sunset: {time}",moon_tooltip:"Moon: {phase} ({pct}%)",sun_path_tooltip:"Sun path (today)",in_fov_check:"✓ in SAA",in_fov:"in SAA",in_fov_tooltip:"Sun is currently within this window’s sun acceptance angle",none:"—",sun:"Sun",moon:"Moon",sun_up_not_hitting:"Sun (up, not hitting)",sun_below_horizon:"Sun (below horizon)",window_fov:"Window SAA",sun_path:"Sun path",sunrise:"Sunrise",sunset:"Sunset",cover_target:"Cover target",cover_held:"Cover position (held)",window_normal:"Window azimuth",stat_sun:"Sun: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Window: ",active_sun_arc:"Active sun arc {from} – {to}{elev}",fov_arc:"SAA {left} left / {right} right{elev}",window_normal_tooltip:"Window azimuth: {bearing}",cover_position_target:"Target: {pct}%",cover_position_target_awning:"Target (extended): {pct}%",cover_position_actual:"Actual: {pct}%",blind_spot:"Blind spot: {from} – {to}",elev_suffix:" · elev {min}–{max}"},covers:{placeholder:"No covers reported by the integration.",title:"Covers",target:"Target: {pct}",target_solar:"Solar target: {pct}",click_to_set:"Click to set position",opening:"Opening…",closing:"Closing…",target_tooltip:"Target {pct}%",target_tooltip_override:"Would-be solar target {pct}% — cover is held by manual override",target_tooltip_motor:"Motor: {pct}% (before calibration)",tilt_title:"Tilt",tilt_target:"Tilt: {pct}",tilt_click_to_set:"Click to set tilt",tilt_target_tooltip:"Tilt target {pct}%"},decision:{placeholder:"Decision trace not yet populated.",pipeline:"Pipeline",winner:"Winner: {name}",summary_tooltip:"Why this position?",not_evaluated:"not evaluated",floor_suffix:" floor",outside_schedule:"Outside schedule — automatic control paused",outside_schedule_tooltip:"The configured schedule window is not active, so automatic positioning is paused.",solar_would_be:"solar {pct}",next_change_in:"Next adjustment allowed in {time}"},solar:{title:"Solar Calculation",axis_position:"Position axis",axis_tilt:"Tilt axis",group_inputs:"Inputs",group_intermediates:"Intermediates",group_output:"Output",show_all:"Show all {count} values",show_less:"Show less",no_target:"No solar target — {status}",status:{direct_sun:"Direct sun",fov_exit:"Default · SAA exit",elevation_limit:"Default · elevation limit",sunset_offset:"Default · sunset offset",blind_spot:"Default · blind spot",default:"Default"},field:{sol_elev_deg:"Sun elevation",gamma_deg:"Relative azimuth (γ)",position_pct:"Position",effective_distance_m:"Effective distance",adjusted_height_m:"Adjusted height",safety_margin:"Safety margin",awn_angle_deg:"Awning angle",vertical_position_m:"Vertical position",length_m:"Extension length",slat_angle_raw_deg:"Slat angle",tilt_mode:"Tilt mode",max_degrees:"Max angle"}},header:{on:"ON",off:"OFF",integration_enabled:"Integration Enabled",auto:"Auto",automatic_control:"Automatic Control"},tile:{motion_pending:"Occupancy timeout pending",motion_detected:"Occupancy detected",open:"Open",stop:"Stop",close:"Close",resume_aria:"Resume automatic control",extend_aria:"Extend manual override",registry_failed:"Registry fetch failed: {error}",loading:"Loading…",entry_not_found:"Adaptive Cover Pro entry {entry} not found.",unavailable:"Unavailable"},formatters:{expired:"expired"},elevation:{title:"Sun today",fov_window:"SAA: {from} → {to}",fov_windows:"SAA: {windows}",fov_window_named:"{name}: {windows}",no_fov_today:"Sun does not enter SAA today",placeholder:"Sun elevation chart unavailable.",schedule:"Schedule {from} – {to}",schedule_from:"Schedule from {from}",schedule_until:"Schedule until {to}",schedule_start_tooltip:"Schedule start",schedule_end_tooltip:"Schedule end"},root:{loading_registry:"Loading Adaptive Cover Pro registry…",no_entities_title:"No Adaptive Cover Pro entities found",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"No matching Adaptive Cover Pro entities",compass_configured:"Configured entries: {entries}",compass_not_found:"Entries not found: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro instance",support_alt:"Buy me a coffee",title_optional:"Title (optional)",title_placeholder:"e.g. West-facing windows",north_offset:"Compass north offset (°)",north_offset_hint:'Rotate the compass clockwise so "up" matches your map. Default: 0.',loading_entries:"Loading Adaptive Cover Pro config entries…",load_failed:"Failed to load config entries: {error}",no_entries:"No Adaptive Cover Pro config entries found. Add an instance under",no_entries_path:"Settings → Devices & Services",no_entries_then:", then come back.",entry_id_manual_placeholder:"Enter config entry ID manually",entry_id_fallback_label:"Entry ID",unknown_entry:"(unknown: {entry})",reset:"Reset"},main:{sections:"Sections",sections_hint:"Toggle which parts of the card are shown.",section_sky_label:"Sky compass",section_sky_desc:"Sun vs. window SAA, polar plot",section_elevation_label:"Sun today",section_elevation_desc:"Elevation-vs-time chart with SAA band and current-time cursor",section_decision_label:"Decision strip",section_decision_desc:"All 10 pipeline handlers with the winning row highlighted",section_covers_label:"Cover positions",section_covers_desc:"Per-cover live vs. target bars; click to set position",section_overrides_label:"Overrides panel",section_overrides_desc:"Manual, force, occupancy tiles + reset button",section_climate_label:"Climate panel",section_climate_desc:"Summer/winter/intermediate strategy; shows standby when climate mode is off or inactive",section_solar_label:"Solar calculation",section_solar_desc:"Raw solar geometry breakdown (inputs → intermediates → output); requires the integration’s solar_calculation sensor",controls:"Controls",controls_hint:"Render as read-only (visible but not clickable).",integration_pill_label:"Integration ON/OFF pill",integration_pill_desc:"Allow toggling the integration from the card header.",automatic_pill_label:"Automatic Control pill",automatic_pill_desc:"Allow toggling automatic control from the card header.",reset_button_label:"Reset Manual Override button",reset_button_desc:"Allow pressing the reset tile in the overrides panel.",display:"Display",compact_label:"Compact mode",compact_desc:"Tighter spacing between sections.",show_compass_stats_label:"Show compass stats",show_compass_stats_desc:"Azi, Elev, ∠, and Window angle below the sky compass.",show_compass_legend_label:"Show compass legend",show_compass_legend_desc:"Color key below the sky compass.",show_moon_label:"Show moon on compass",show_moon_desc:"Moon position and phase overlay on the sky compass.",hide_inactive_label:"Hide inactive handlers",hide_inactive_desc:"Show only the winner and actively matched pipeline handlers.",state_color_label:"Color icon by state",state_color_desc:"Header cover icon takes on the theme’s open/closed/active color."},tile:{name:"Title override",icon:"Icon override",cover:"Cover entity",layout:"Layout",show_position:"Show position %",show_state:"Show state (Open/Closed)",show_decision_summary:"Show decision summary",show_controls:"Show ↑ ■ ↓ controls",show_badge:"Show contextual badge",show_position_bar:"Show position bar",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Solar tracking",badge_force:"Force override",badge_weather:"Weather safety",badge_manual:"Manual override",badge_custom_position:"Custom position",badge_motion:"Occupancy",badge_climate:"Climate",badge_glare_zone:"Glare zone",badge_cloud:"Cloud suppression",show_compass:"Show sun compass in dialog",show_elevation_chart:"Show sun-today chart in dialog",show_solar_calc:"Show solar calculation in dialog",show_motion_icon:"Show occupancy indicator",state_color:"Color icon by state",tap_action:"Tap action",hold_action:"Hold action",double_tap_action:"Double-tap action",cover_blank_hint:"Leave blank to use the first managed cover automatically.",layout_option_one_line:"One line (compact)",layout_option_detailed:"Detailed (title, state, indicators)"},compass:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds an overlay to the compass.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller SVG, legend hidden.",toggle_legend_label:"Legend",toggle_legend_desc:"Color swatches + entry labels below compass.",toggle_stats_label:"Stats",toggle_stats_desc:"Sun + per-window numeric rows.",toggle_moon_label:"Moon",toggle_moon_desc:"Render moon position and phase.",toggle_cardinals_label:"Cardinal labels",toggle_cardinals_desc:"N/E/S/W letters around the compass.",toggle_blind_spot_label:"Blind spots",toggle_blind_spot_desc:"Hatched wedges for each window’s blind range.",toggle_sun_path_label:"Sun path",toggle_sun_path_desc:"Today’s sun arc across the sky.",toggle_sunrise_sunset_label:"Sunrise / sunset markers",toggle_sunrise_sunset_desc:"Small dots at rise and set azimuths.",toggle_cover_fill_label:"Cover closure fill",toggle_cover_fill_desc:"Inner wedge showing how closed each cover is.",toggle_window_arrow_label:"Window-normal arrow",toggle_window_arrow_desc:"Line from center toward each window’s azimuth.",toggle_elevation_chart_label:"Sun-today chart",toggle_elevation_chart_desc:"Elevation-vs-time chart below the compass, with SAA band and elevation limits."},decision:{title:"Title (optional)",compact_label:"Compact mode",compact_desc:"Tighter rows; also hides inactive handlers.",hide_inactive_handlers_label:"Hide inactive handlers",hide_inactive_handlers_desc:"Show only the winner and actively matched pipeline handlers.",show_decision_summary_label:"Show decision summary",show_decision_summary_desc:'Render a plain-English "Why this position?" sentence above the strip.'},solar_chart:{instances:"Adaptive Cover Pro instances",instances_hint:"Pick one or more. Each selected entry adds a SAA overlay to the chart.",cover_colors:"Cover colors",cover_colors_hint:"Override the default palette color for each overlay.",default_color:"default",display:"Display",toggle_compact_label:"Compact mode",toggle_compact_desc:"Smaller chart, tighter spacing."}}},fr:{handler:{force:"Dérogation forcée",weather:"Sécurité météo",group_scene:"Scène de groupe",manual:"Dérogation manuelle",group_lock:"Verrouillage de groupe",custom_position:"Position personnalisée",motion:"Délai d'occupation",cloud:"Désactivation par temps nuageux",climate:"Climatique",glare_zone:"Zone d'éblouissement",solar:"Suivi solaire",default:"Par défaut",floor_clamp:"Plancher"},badge:{auto:"Auto",manual:"Manuel",force:"Forcé",weather:"Sécurité météo",glare_zone:"Éblouissement",climate:"Climatique",cloud:"Nuageux",custom_position:"Personnalisé",solar:"Suivi solaire",motion:"Occupation inactive",off:"Off",off_schedule:"Hors planning",floor_suffix:" ↥",safety:"Sécurité",group:"Groupe"},group:{title:"Groupe de couvertures",scene:"Scène",scene_auto:"Auto",scene_all_open:"Tout ouvrir",scene_all_closed:"Tout fermer",scene_privacy:"Intimité",state_open:"Ouvert",state_closed:"Fermé",state_mixed:"Mixte",state_unknown:"Inconnu",lock:"Verrouiller le groupe",unlock:"Déverrouiller le groupe",automation:"Automatisation",clear_overrides:"Effacer les dérogations",who_won:"{count}/{total} pilotés par le groupe",members:"Membres",member_placeholder:"Aucun membre signalé par l'intégration."},forecast:{event:{sunrise:"Lever du soleil",sunset:"Coucher du soleil",fov_enter:"Le soleil entre dans l'angle d'acceptation solaire de la fenêtre",fov_exit:"Le soleil quitte l'angle d'acceptation solaire de la fenêtre"},hover_hint:"Survolez la courbe pour voir l'heure et la position prévue ; survolez une ligne colorée pour voir l'événement qu'elle indique.",solar_only_note:"Géométrie solaire uniquement — ne tient pas compte des dérogations manuelles, des positions personnalisées, de la désactivation par temps nuageux ni des conditions météo.",legend_forecast:"Prévision",legend_actual:"Réel"},dialog:{extend:{title:"Prolonger la dérogation manuelle",presets_label:"Jusqu'à",relative_label:"Ajouter du temps",absolute_label:"Fin à",preview:"Dérogation jusqu'à {time}",confirm:"Prolonger",cancel:"Annuler",tomorrow_suffix:" (demain)"},configure_integration:"Configurer l'intégration",open_device_page:"Ouvrir la page de l'appareil",close:"Fermer",target:"Cible",resume_auto:"Reprendre l'automatique",hide_advanced:"▼ Masquer les options avancées",show_advanced:"▶ Afficher les options avancées",custom_positions:"Positions personnalisées",floor_tooltip:"Plancher — cette valeur force une position minimale au-dessus du calcul automatique",floor:"↥",disable_slot:"Désactiver le créneau {slot}",enable_slot:"Activer le créneau {slot}",on:"Activé",off:"Désactivé",controls:"Commandes",automatic:"Automatique",climate:"Climatique",motion:"Occupation",toggle_hint:"{label} {state} — appuyez pour basculer",state_on:"activé",state_off:"désactivé",todays_forecast:"Prévisions du jour"},overrides:{title:"Dérogations",manual:"Manuel",force:"Forcé",motion:"Occupation",active:"Actif",off:"Désactivé",ends_in:"se termine dans {time}",active_count:"{count} dérogation(s) active(s)",timeout:"expire dans {time}",reset_manual:"Réinitialiser le mode manuel"},climate:{title:"Climatique",active:"Actif : {strategy}",indoor:"Intérieur",outdoor:"Extérieur",presence:"Présence",sunny:"Ensoleillé",lux:"Lux",irradiance:"Irradiance",mode_off:"Mode climatique désactivé",standby:"En veille",threshold_low:"bas",threshold_high:"haut",threshold_summer_outside:"été",reason:{outside_time_window:"En dehors de la plage horaire de fonctionnement",thresholds_not_met:"Températures dans la plage de confort — aucune action requise",other_mode_active:"Un autre mode de contrôle est actuellement actif",readings_unavailable:"Relevés de température indisponibles",mode_off:"Le mode climatique est désactivé"}},compass:{placeholder_no_entries:"Aucune instance Adaptive Cover Pro sélectionnée.",placeholder_no_sun:"Le capteur solaire n'est pas encore renseigné.",sun_tooltip:"Soleil : {az} az / {el} él",sunrise_tooltip:"Lever du soleil : {time}",sunset_tooltip:"Coucher du soleil : {time}",moon_tooltip:"Lune : {phase} ({pct}%)",sun_path_tooltip:"Trajectoire solaire (aujourd'hui)",in_fov_check:"✓ dans le SAA",in_fov:"dans le SAA",in_fov_tooltip:"Le soleil est actuellement dans l'angle d'acceptation solaire de cette fenêtre",none:"—",sun:"Soleil",moon:"Lune",sun_up_not_hitting:"Soleil (levé, ne frappe pas)",sun_below_horizon:"Soleil (sous l’horizon)",window_fov:"SAA de la fenêtre",sun_path:"Trajectoire solaire",sunrise:"Lever du soleil",sunset:"Coucher du soleil",cover_target:"Cible du store",cover_held:"Position du store (maintenue)",window_normal:"Azimut de la fenêtre",stat_sun:"Soleil : ",stat_azi:"Azi : ",stat_elev:"Élév : ",stat_window:"Fenêtre : ",active_sun_arc:"Arc solaire actif {from} – {to}{elev}",fov_arc:"SAA {left} gauche / {right} droite{elev}",window_normal_tooltip:"Azimut de la fenêtre : {bearing}",cover_position_target:"Cible : {pct}%",cover_position_target_awning:"Cible (déployé) : {pct}%",cover_position_actual:"Réel : {pct}%",blind_spot:"Soleil masqué : {from} - {to}",elev_suffix:" · élév {min}–{max}"},covers:{placeholder:"Aucun store signalé par l'intégration.",title:"Stores",target:"Cible : {pct}",target_solar:"Cible solaire : {pct}",click_to_set:"Cliquer pour définir la position",opening:"Ouverture…",closing:"Fermeture…",target_tooltip:"Cible {pct}%",target_tooltip_override:"Cible solaire théorique {pct}% — le store est maintenu par la commande manuelle",target_tooltip_motor:"Moteur : {pct}% (avant étalonnage)",tilt_title:"Inclinaison",tilt_target:"Inclinaison : {pct}",tilt_click_to_set:"Cliquer pour définir l'inclinaison",tilt_target_tooltip:"Cible inclinaison {pct}%"},decision:{placeholder:"La trace de décision n'est pas encore renseignée.",pipeline:"Pipeline",winner:"Actif : {name}",summary_tooltip:"Pourquoi cette position ?",not_evaluated:"non évalué",floor_suffix:" plancher",outside_schedule:"Hors planning — contrôle automatique en pause",outside_schedule_tooltip:"La fenêtre de planning configurée n'est pas active, le positionnement automatique est donc en pause.",solar_would_be:"solaire {pct}",next_change_in:"Prochain ajustement autorisé dans {time}"},solar:{title:"Calcul solaire",axis_position:"Axe de position",axis_tilt:"Axe d'inclinaison",group_inputs:"Entrées",group_intermediates:"Intermédiaires",group_output:"Sortie",show_all:"Afficher les {count} valeurs",show_less:"Afficher moins",no_target:"Pas de cible solaire — {status}",status:{direct_sun:"Soleil direct",fov_exit:"Par défaut · sortie du SAA",elevation_limit:"Par défaut · limite d'élévation",sunset_offset:"Par défaut · décalage coucher du soleil",blind_spot:"Par défaut · angle mort",default:"Par défaut"},field:{sol_elev_deg:"Élévation du soleil",gamma_deg:"Azimut relatif (γ)",position_pct:"Position",effective_distance_m:"Distance effective",adjusted_height_m:"Hauteur ajustée",safety_margin:"Marge de sécurité",awn_angle_deg:"Angle du store",vertical_position_m:"Position verticale",length_m:"Longueur d'extension",slat_angle_raw_deg:"Angle des lamelles",tilt_mode:"Mode d'inclinaison",max_degrees:"Angle maximal"}},header:{on:"ON",off:"OFF",integration_enabled:"Intégration activée",auto:"Auto",automatic_control:"Contrôle automatique"},tile:{motion_pending:"Délai d'occupation en cours",motion_detected:"Occupation détectée",open:"Ouvrir",stop:"Arrêter",close:"Fermer",resume_aria:"Reprendre le contrôle automatique",extend_aria:"Prolonger la dérogation manuelle",registry_failed:"Échec de la récupération du registre : {error}",loading:"Chargement…",entry_not_found:"Instance Adaptive Cover Pro {entry} introuvable.",unavailable:"Indisponible"},formatters:{expired:"expiré"},elevation:{title:"Soleil aujourd'hui",fov_window:"SAA : {from} → {to}",fov_windows:"SAA : {windows}",fov_window_named:"{name} : {windows}",no_fov_today:"Le soleil n'entre pas dans le SAA aujourd'hui",placeholder:"Graphique d'élévation solaire indisponible.",schedule:"Programmation {from} – {to}",schedule_from:"Programmation à partir de {from}",schedule_until:"Programmation jusqu'à {to}",schedule_start_tooltip:"Début de programmation",schedule_end_tooltip:"Fin de programmation"},root:{loading_registry:"Chargement du registre Adaptive Cover Pro…",no_entities_title:"Aucune entité Adaptive Cover Pro trouvée",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Aucune entité Adaptive Cover Pro correspondante",compass_configured:"Instances configurées : {entries}",compass_not_found:"Instances introuvables : {entries}"},editor:{common:{entry_id:"Instance Adaptive Cover Pro",support_alt:"Offrez-moi un café",title_optional:"Titre (facultatif)",title_placeholder:"ex. Fenêtres côté ouest",north_offset:"Décalage nord de la boussole (°)",north_offset_hint:"Faites pivoter la boussole dans le sens horaire pour que « haut » corresponde à votre carte. Par défaut : 0.",loading_entries:"Chargement des entrées de configuration Adaptive Cover Pro…",load_failed:"Échec du chargement des entrées de configuration : {error}",no_entries:"Aucune entrée de configuration Adaptive Cover Pro trouvée. Ajoutez une instance sous",no_entries_path:"Paramètres → Appareils et services",no_entries_then:", puis revenez ici.",entry_id_manual_placeholder:"Saisir manuellement l'ID d'entrée de configuration",entry_id_fallback_label:"ID d'entrée",unknown_entry:"(inconnu : {entry})",reset:"Réinitialiser"},main:{sections:"Sections",sections_hint:"Activer ou désactiver les parties de la carte affichées.",section_sky_label:"Boussole céleste",section_sky_desc:"Soleil par rapport au SAA de la fenêtre, tracé polaire",section_elevation_label:"Soleil aujourd'hui",section_elevation_desc:"Graphique élévation/temps avec bande SAA et curseur temps réel",section_decision_label:"Bande de décision",section_decision_desc:"Les 10 gestionnaires du pipeline avec la ligne gagnante mise en évidence",section_covers_label:"Positions des stores",section_covers_desc:"Barres position réelle/cible par store ; cliquer pour définir la position",section_overrides_label:"Panneau des dérogations",section_overrides_desc:"Tuiles Manuel, Forcé, Occupation + bouton de réinitialisation",section_climate_label:"Panneau climatique",section_climate_desc:"Stratégie été/hiver/intermédiaire ; affiche le mode veille si le mode climatique est désactivé ou inactif",section_solar_label:"Calcul solaire",section_solar_desc:"Décomposition de la géométrie solaire brute (entrées → intermédiaires → sortie) ; nécessite le capteur solar_calculation de l’intégration",controls:"Commandes",controls_hint:"Afficher en lecture seule (visible mais non cliquable).",integration_pill_label:"Bouton ON/OFF de l'intégration",integration_pill_desc:"Permettre de basculer l'intégration depuis l'en-tête de la carte.",automatic_pill_label:"Bouton contrôle automatique",automatic_pill_desc:"Permettre de basculer le contrôle automatique depuis l'en-tête de la carte.",reset_button_label:"Bouton de réinitialisation de la dérogation manuelle",reset_button_desc:"Permettre d'appuyer sur la tuile de réinitialisation dans le panneau des dérogations.",display:"Affichage",compact_label:"Mode compact",compact_desc:"Espacement réduit entre les sections.",show_compass_stats_label:"Afficher les statistiques de la boussole",show_compass_stats_desc:"Azi, Élév, ∠ et angle de fenêtre sous la boussole céleste.",show_compass_legend_label:"Afficher la légende de la boussole",show_compass_legend_desc:"Clé de couleur sous la boussole céleste.",show_moon_label:"Afficher la lune sur la boussole",show_moon_desc:"Position et phase de la lune en superposition sur la boussole céleste.",hide_inactive_label:"Masquer les gestionnaires inactifs",hide_inactive_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs.",state_color_label:"Colorer l'icône selon l'état",state_color_desc:"L'icône d'en-tête prend la couleur ouvert/fermé/actif du thème."},tile:{name:"Titre personnalisé",icon:"Icône personnalisée",cover:"Entité de store",layout:"Disposition",show_position:"Afficher la position %",show_state:"Afficher l'état (Ouvert/Fermé)",show_decision_summary:"Afficher le résumé de décision",show_controls:"Afficher les commandes ↑ ■ ↓",show_badge:"Afficher le badge contextuel",show_position_bar:"Afficher la barre de position",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Suivi solaire",badge_force:"Dérogation forcée",badge_weather:"Sécurité météo",badge_manual:"Dérogation manuelle",badge_custom_position:"Position personnalisée",badge_motion:"Occupation",badge_climate:"Climatique",badge_glare_zone:"Zone d'éblouissement",badge_cloud:"Suppression nuageuse",show_compass:"Afficher la boussole solaire dans le dialogue",show_elevation_chart:"Afficher le graphique du soleil dans le dialogue",show_solar_calc:"Afficher le calcul solaire dans le dialogue",show_motion_icon:"Afficher l'indicateur d'occupation",state_color:"Colorer l'icône selon l'état",tap_action:"Action au toucher",hold_action:"Action au maintien",double_tap_action:"Action au double toucher",cover_blank_hint:"Laisser vide pour utiliser automatiquement le premier store géré.",layout_option_one_line:"Une ligne (compact)",layout_option_detailed:"Détaillé (titre, état, indicateurs)"},compass:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition à la boussole.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"SVG plus petit, légende masquée.",toggle_legend_label:"Légende",toggle_legend_desc:"Échantillons de couleur et étiquettes d'instance sous la boussole.",toggle_stats_label:"Statistiques",toggle_stats_desc:"Soleil + lignes numériques par fenêtre.",toggle_moon_label:"Lune",toggle_moon_desc:"Afficher la position et la phase de la lune.",toggle_cardinals_label:"Points cardinaux",toggle_cardinals_desc:"Lettres N/E/S/O autour de la boussole.",toggle_blind_spot_label:"Zones de soleil masqué",toggle_blind_spot_desc:"Secteurs hachurés pour la plage où le soleil est masqué de chaque fenêtre.",toggle_sun_path_label:"Trajectoire solaire",toggle_sun_path_desc:"Arc solaire du jour dans le ciel.",toggle_sunrise_sunset_label:"Repères lever / coucher du soleil",toggle_sunrise_sunset_desc:"Petits points aux azimuts de lever et coucher du soleil.",toggle_cover_fill_label:"Remplissage de fermeture du store",toggle_cover_fill_desc:"Secteur intérieur indiquant le taux de fermeture de chaque store.",toggle_window_arrow_label:"Flèche de normale de fenêtre",toggle_window_arrow_desc:"Ligne du centre vers l'azimut de chaque fenêtre.",toggle_elevation_chart_label:"Graphique du soleil",toggle_elevation_chart_desc:"Graphique élévation/temps sous la boussole, avec bande SAA et limites d'élévation."},decision:{title:"Titre (facultatif)",compact_label:"Mode compact",compact_desc:"Lignes plus serrées ; masque aussi les gestionnaires inactifs.",hide_inactive_handlers_label:"Masquer les gestionnaires inactifs",hide_inactive_handlers_desc:"Afficher uniquement le gestionnaire sélectionné et les gestionnaires du pipeline actifs.",show_decision_summary_label:"Afficher le résumé de décision",show_decision_summary_desc:"Afficher une phrase explicite « Pourquoi cette position ? » au-dessus de la bande."},solar_chart:{instances:"Instances Adaptive Cover Pro",instances_hint:"Sélectionnez une ou plusieurs instances. Chaque instance sélectionnée ajoute une superposition SAA au graphique.",cover_colors:"Couleurs des stores",cover_colors_hint:"Remplacer la couleur de palette par défaut pour chaque superposition.",default_color:"par défaut",display:"Affichage",toggle_compact_label:"Mode compact",toggle_compact_desc:"Graphique plus petit, espacement plus serré."}}},de:{handler:{force:"Zwangsübersteuerung",weather:"Wettersicherheit",group_scene:"Gruppenszene",manual:"Manuelle Übersteuerung",group_lock:"Gruppensperre",custom_position:"Benutzerdefinierte Position",motion:"Anwesenheits-Timeout",cloud:"Wolkenunterdrückung",climate:"Klima",glare_zone:"Blendungszone",solar:"Sonnenverfolgung",default:"Standard",floor_clamp:"Mindestposition"},badge:{auto:"Auto",manual:"Manuell",force:"Zwang",weather:"Wettersicherheit",glare_zone:"Blendung",climate:"Klima",cloud:"Bewölkt",custom_position:"Benutzerdefiniert",solar:"Sonnenverfolgung",motion:"Anwesenheit inaktiv",off:"Aus",off_schedule:"Außerhalb des Zeitplans",floor_suffix:" ↥",safety:"Sicherheit",group:"Gruppe"},group:{title:"Abdeckungsgruppe",scene:"Szene",scene_auto:"Auto",scene_all_open:"Alle öffnen",scene_all_closed:"Alle schließen",scene_privacy:"Sichtschutz",state_open:"Offen",state_closed:"Geschlossen",state_mixed:"Gemischt",state_unknown:"Unbekannt",lock:"Gruppe sperren",unlock:"Gruppe entsperren",automation:"Automatisierung",clear_overrides:"Übersteuerungen löschen",who_won:"{count}/{total} gruppengesteuert",members:"Mitglieder",member_placeholder:"Keine Mitglieder von der Integration gemeldet."},forecast:{event:{sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",fov_enter:"Sonne tritt in den Sonnenakzeptanzwinkel des Fensters ein",fov_exit:"Sonne verlässt den Sonnenakzeptanzwinkel des Fensters"},hover_hint:"Kurve überfahren für Uhrzeit und prognostizierte Position; farbige Linie überfahren für das markierte Ereignis.",solar_only_note:"Nur Sonnengeometrie — berücksichtigt keine manuellen Übersteuerungen, benutzerdefinierten Positionen, Wolkenunterdrückung oder Wetter.",legend_forecast:"Prognose",legend_actual:"Ist"},dialog:{extend:{title:"Manuelle Übersteuerung verlängern",presets_label:"Bis",relative_label:"Zeit hinzufügen",absolute_label:"Ende um",preview:"Übersteuerung bis {time}",confirm:"Verlängern",cancel:"Abbrechen",tomorrow_suffix:" (morgen)"},configure_integration:"Integration konfigurieren",open_device_page:"Geräteseite öffnen",close:"Schließen",target:"Ziel",resume_auto:"Automatik fortsetzen",hide_advanced:"▼ Erweitert ausblenden",show_advanced:"▶ Erweitert",custom_positions:"Benutzerdefinierte Positionen",floor_tooltip:"Mindestposition — hebt die Position über den berechneten Wert",floor:"↥",disable_slot:"Slot {slot} deaktivieren",enable_slot:"Slot {slot} aktivieren",on:"An",off:"Aus",controls:"Steuerung",automatic:"Automatisch",climate:"Klima",motion:"Anwesenheit",toggle_hint:"{label} {state} — tippen zum Umschalten",state_on:"an",state_off:"aus",todays_forecast:"Heutige Prognose"},overrides:{title:"Übersteuerungen",manual:"Manuell",force:"Zwang",motion:"Anwesenheit",active:"Aktiv",off:"Aus",ends_in:"endet in {time}",active_count:"{count} aktiv",timeout:"läuft in {time} ab",reset_manual:"Manuell zurücksetzen"},climate:{title:"Klima",active:"Aktiv: {strategy}",indoor:"Innen",outdoor:"Außen",presence:"Anwesenheit",sunny:"Sonnig",lux:"Lux",irradiance:"Einstrahlung",mode_off:"Klimamodus deaktiviert",standby:"Bereitschaft",threshold_low:"niedrig",threshold_high:"hoch",threshold_summer_outside:"Sommer",reason:{outside_time_window:"Außerhalb des Betriebszeitfensters",thresholds_not_met:"Temperaturen im Komfortbereich — keine Maßnahme erforderlich",other_mode_active:"Ein anderer Steuermodus ist derzeit aktiv",readings_unavailable:"Temperaturwerte nicht verfügbar",mode_off:"Klimamodus ist deaktiviert"}},compass:{placeholder_no_entries:"Kein Adaptive Cover Pro-Eintrag ausgewählt.",placeholder_no_sun:"Sonnensensor noch nicht befüllt.",sun_tooltip:"Sonne: {az} az / {el} el",sunrise_tooltip:"Sonnenaufgang: {time}",sunset_tooltip:"Sonnenuntergang: {time}",moon_tooltip:"Mond: {phase} ({pct}%)",sun_path_tooltip:"Sonnenbahn (heute)",in_fov_check:"✓ im SAA",in_fov:"im SAA",in_fov_tooltip:"Sonne befindet sich derzeit im Sonnenakzeptanzwinkel dieses Fensters",none:"—",sun:"Sonne",moon:"Mond",sun_up_not_hitting:"Sonne (aufgegangen, trifft nicht)",sun_below_horizon:"Sonne (unter dem Horizont)",window_fov:"Fenster-SAA",sun_path:"Sonnenbahn",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",cover_target:"Beschattungsziel",cover_held:"Beschattungsposition (gehalten)",window_normal:"Fensterazimut",stat_sun:"Sonne: ",stat_azi:"Azi: ",stat_elev:"Elev: ",stat_window:"Fenster: ",active_sun_arc:"Aktiver Sonnenbogen {from} – {to}{elev}",fov_arc:"SAA {left} links / {right} rechts{elev}",window_normal_tooltip:"Fensterazimut: {bearing}",cover_position_target:"Ziel: {pct}%",cover_position_target_awning:"Ziel (ausgefahren): {pct}%",cover_position_actual:"Aktuell: {pct}%",blind_spot:"Blindfleck: {from} – {to}",elev_suffix:" · Elev {min}–{max}"},covers:{placeholder:"Keine Beschattungen von der Integration gemeldet.",title:"Beschattungen",target:"Ziel: {pct}",target_solar:"Sonnenziel: {pct}",click_to_set:"Klicken zum Festlegen der Position",opening:"Öffnet…",closing:"Schließt…",target_tooltip:"Ziel {pct}%",target_tooltip_override:"Theoretisches Sonnenziel {pct}% — Beschattung wird durch manuelle Übersteuerung gehalten",target_tooltip_motor:"Motor: {pct}% (vor Kalibrierung)",tilt_title:"Neigung",tilt_target:"Neigung: {pct}",tilt_click_to_set:"Klicken zum Festlegen der Neigung",tilt_target_tooltip:"Neigungsziel {pct}%"},decision:{placeholder:"Entscheidungsprotokoll noch nicht befüllt.",pipeline:"Pipeline",winner:"Gewinner: {name}",summary_tooltip:"Warum diese Position?",not_evaluated:"nicht ausgewertet",floor_suffix:" Mindestposition",outside_schedule:"Außerhalb des Zeitplans — automatische Steuerung pausiert",outside_schedule_tooltip:"Das konfigurierte Zeitplanfenster ist nicht aktiv, daher ist die automatische Positionierung pausiert.",solar_would_be:"solar {pct}",next_change_in:"Nächste Anpassung erlaubt in {time}"},solar:{title:"Sonnenberechnung",axis_position:"Positionsachse",axis_tilt:"Neigungsachse",group_inputs:"Eingaben",group_intermediates:"Zwischenwerte",group_output:"Ausgabe",show_all:"Alle {count} Werte anzeigen",show_less:"Weniger anzeigen",no_target:"Kein Sonnenziel — {status}",status:{direct_sun:"Direkte Sonne",fov_exit:"Standard · SAA-Austritt",elevation_limit:"Standard · Höhengrenze",sunset_offset:"Standard · Sonnenuntergangs-Versatz",blind_spot:"Standard · Blindfleck",default:"Standard"},field:{sol_elev_deg:"Sonnenhöhe",gamma_deg:"Relativer Azimut (γ)",position_pct:"Position",effective_distance_m:"Effektive Distanz",adjusted_height_m:"Angepasste Höhe",safety_margin:"Sicherheitsabstand",awn_angle_deg:"Markisenwinkel",vertical_position_m:"Vertikale Position",length_m:"Ausfahrlänge",slat_angle_raw_deg:"Lamellenwinkel",tilt_mode:"Neigungsmodus",max_degrees:"Maximaler Winkel"}},header:{on:"ON",off:"OFF",integration_enabled:"Integration aktiviert",auto:"Auto",automatic_control:"Automatische Steuerung"},tile:{motion_pending:"Anwesenheits-Timeout läuft",motion_detected:"Anwesenheit erkannt",open:"Öffnen",stop:"Stopp",close:"Schließen",resume_aria:"Automatische Steuerung fortsetzen",extend_aria:"Manuelle Übersteuerung verlängern",registry_failed:"Registry-Abruf fehlgeschlagen: {error}",loading:"Wird geladen…",entry_not_found:"Adaptive Cover Pro-Eintrag {entry} nicht gefunden.",unavailable:"Nicht verfügbar"},formatters:{expired:"abgelaufen"},elevation:{title:"Sonne heute",fov_window:"SAA: {from} → {to}",fov_windows:"SAA: {windows}",fov_window_named:"{name}: {windows}",no_fov_today:"Sonne tritt heute nicht in den SAA ein",placeholder:"Sonnenhöhen-Diagramm nicht verfügbar.",schedule:"Zeitplan {from} – {to}",schedule_from:"Zeitplan ab {from}",schedule_until:"Zeitplan bis {to}",schedule_start_tooltip:"Zeitplanstart",schedule_end_tooltip:"Zeitplanende"},root:{loading_registry:"Adaptive Cover Pro-Registry wird geladen…",no_entities_title:"Keine Adaptive Cover Pro-Entitäten gefunden",footer_version:"adaptive-cover-pro-card v{version}",compass_no_match:"Keine passenden Adaptive Cover Pro-Entitäten",compass_configured:"Konfigurierte Einträge: {entries}",compass_not_found:"Einträge nicht gefunden: {entries}"},editor:{common:{entry_id:"Adaptive Cover Pro-Instanz",support_alt:"Kauf mir einen Kaffee",title_optional:"Titel (optional)",title_placeholder:"z. B. Fenster Westseite",north_offset:"Kompass-Nordversatz (°)",north_offset_hint:'Kompass im Uhrzeigersinn drehen, sodass „oben" Ihrer Karte entspricht. Standard: 0.',loading_entries:"Adaptive Cover Pro-Konfigurationseinträge werden geladen…",load_failed:"Konfigurationseinträge konnten nicht geladen werden: {error}",no_entries:"Keine Adaptive Cover Pro-Konfigurationseinträge gefunden. Fügen Sie eine Instanz unter",no_entries_path:"Einstellungen → Geräte & Dienste",no_entries_then:" hinzu und kehren Sie dann zurück.",entry_id_manual_placeholder:"Konfigurations-Eintrags-ID manuell eingeben",entry_id_fallback_label:"Eintrags-ID",unknown_entry:"(unbekannt: {entry})",reset:"Zurücksetzen"},main:{sections:"Abschnitte",sections_hint:"Sichtbare Bereiche der Karte ein- oder ausblenden.",section_sky_label:"Himmelskompass",section_sky_desc:"Sonne vs. Fenster-SAA, Polardiagramm",section_elevation_label:"Sonne heute",section_elevation_desc:"Höhen-Zeit-Diagramm mit SAA-Bereich und aktuellem Zeitcursor",section_decision_label:"Entscheidungsleiste",section_decision_desc:"Alle 10 Pipeline-Handler mit hervorgehobener Gewinnerzeile",section_covers_label:"Beschattungspositionen",section_covers_desc:"Aktuelle und Zielposition je Beschattung; klicken zum Festlegen der Position",section_overrides_label:"Übersteuerungsbereich",section_overrides_desc:"Kacheln für Manuell, Zwang, Anwesenheit + Zurücksetzen-Schaltfläche",section_climate_label:"Klimabereich",section_climate_desc:"Sommer-/Winter-/Übergangsstrategie; zeigt Bereitschaft, wenn Klimamodus deaktiviert oder inaktiv ist",section_solar_label:"Sonnenberechnung",section_solar_desc:"Aufschlüsselung der Sonnengeometrie (Eingaben → Zwischenwerte → Ausgabe); erfordert den solar_calculation-Sensor der Integration",controls:"Steuerung",controls_hint:"Als schreibgeschützt anzeigen (sichtbar, aber nicht klickbar).",integration_pill_label:"Integration EIN/AUS-Schalter",integration_pill_desc:"Integration über den Karten-Header umschalten.",automatic_pill_label:"Automatische Steuerung-Schalter",automatic_pill_desc:"Automatische Steuerung über den Karten-Header umschalten.",reset_button_label:'Schaltfläche „Manuelle Übersteuerung zurücksetzen"',reset_button_desc:"Zurücksetzen-Kachel im Übersteuerungsbereich betätigen lassen.",display:"Anzeige",compact_label:"Kompaktmodus",compact_desc:"Engerer Abstand zwischen Abschnitten.",show_compass_stats_label:"Kompassstatistiken anzeigen",show_compass_stats_desc:"Azi, Elev, ∠ und Fensterwinkel unterhalb des Himmelskompasses.",show_compass_legend_label:"Kompasslegende anzeigen",show_compass_legend_desc:"Farbschlüssel unterhalb des Himmelskompasses.",show_moon_label:"Mond auf Kompass anzeigen",show_moon_desc:"Mondposition und Mondphase als Überlagerung auf dem Himmelskompass.",hide_inactive_label:"Inaktive Handler ausblenden",hide_inactive_desc:"Nur den Gewinner und aktiv übereinstimmende Pipeline-Handler anzeigen.",state_color_label:"Symbol nach Status einfärben",state_color_desc:"Kopfzeilen-Symbol nimmt die Offen/Geschlossen/Aktiv-Farbe des Themes an."},tile:{name:"Titel überschreiben",icon:"Symbol überschreiben",cover:"Beschattungsentität",layout:"Layout",show_position:"Position % anzeigen",show_state:"Status anzeigen (Offen/Geschlossen)",show_decision_summary:"Entscheidungszusammenfassung anzeigen",show_controls:"Steuerung ↑ ■ ↓ anzeigen",show_badge:"Kontextbadge anzeigen",show_position_bar:"Positionsleiste anzeigen",badge_section:"Badges",badge_auto:"Auto",badge_solar:"Sonnenverfolgung",badge_force:"Zwangsübersteuerung",badge_weather:"Wettersicherheit",badge_manual:"Manuelle Übersteuerung",badge_custom_position:"Benutzerdefinierte Position",badge_motion:"Anwesenheit",badge_climate:"Klima",badge_glare_zone:"Blendungszone",badge_cloud:"Wolkenunterdrückung",show_compass:"Sonnenkompass im Dialog anzeigen",show_elevation_chart:"Sonne-heute-Diagramm im Dialog anzeigen",show_solar_calc:"Sonnenberechnung im Dialog anzeigen",show_motion_icon:"Anwesenheitsanzeige einblenden",state_color:"Symbol nach Status einfärben",tap_action:"Tipp-Aktion",hold_action:"Gedrückthalten-Aktion",double_tap_action:"Doppeltippen-Aktion",cover_blank_hint:"Leer lassen, um automatisch die erste verwaltete Beschattung zu verwenden.",layout_option_one_line:"Eine Zeile (kompakt)",layout_option_detailed:"Detailliert (Titel, Status, Indikatoren)"},compass:{instances:"Adaptive Cover Pro-Instanzen",instances_hint:"Eine oder mehrere auswählen. Jeder gewählte Eintrag fügt dem Kompass eine Überlagerung hinzu.",cover_colors:"Beschattungsfarben",cover_colors_hint:"Standardpalettenfarbe für jede Überlagerung überschreiben.",default_color:"Standard",display:"Anzeige",toggle_compact_label:"Kompaktmodus",toggle_compact_desc:"Kleineres SVG, Legende ausgeblendet.",toggle_legend_label:"Legende",toggle_legend_desc:"Farbmuster und Eintragsbezeichnungen unterhalb des Kompasses.",toggle_stats_label:"Statistiken",toggle_stats_desc:"Sonne + numerische Zeilen je Fenster.",toggle_moon_label:"Mond",toggle_moon_desc:"Mondposition und Mondphase anzeigen.",toggle_cardinals_label:"Himmelsrichtungen",toggle_cardinals_desc:"N/O/S/W-Buchstaben rund um den Kompass.",toggle_blind_spot_label:"Blindflecke",toggle_blind_spot_desc:"Schraffierte Sektoren für den Blindfleckbereich jedes Fensters.",toggle_sun_path_label:"Sonnenbahn",toggle_sun_path_desc:"Heutiger Sonnenbogen am Himmel.",toggle_sunrise_sunset_label:"Sonnenaufgangs-/Untergangsmarkierungen",toggle_sunrise_sunset_desc:"Kleine Punkte bei Aufgangs- und Untergangsazimut.",toggle_cover_fill_label:"Schlussfüllbereich der Beschattung",toggle_cover_fill_desc:"Innerer Sektor, der zeigt, wie weit jede Beschattung geschlossen ist.",toggle_window_arrow_label:"Fenster-Normalenpfeil",toggle_window_arrow_desc:"Linie vom Mittelpunkt zum Azimut jedes Fensters.",toggle_elevation_chart_label:"Sonne-heute-Diagramm",toggle_elevation_chart_desc:"Höhen-Zeit-Diagramm unterhalb des Kompasses, mit SAA-Bereich und Höhengrenzen."},decision:{title:"Titel (optional)",compact_label:"Kompaktmodus",compact_desc:"Engere Zeilen; blendet inaktive Handler ebenfalls aus.",hide_inactive_handlers_label:"Inaktive Handler ausblenden",hide_inactive_handlers_desc:"Nur den Gewinner und aktiv übereinstimmende Pipeline-Handler anzeigen.",show_decision_summary_label:"Entscheidungszusammenfassung anzeigen",show_decision_summary_desc:'Einen verständlichen Satz „Warum diese Position?" oberhalb der Leiste anzeigen.'},solar_chart:{instances:"Adaptive Cover Pro-Instanzen",instances_hint:"Eine oder mehrere auswählen. Jeder gewählte Eintrag fügt dem Diagramm eine SAA-Überlagerung hinzu.",cover_colors:"Beschattungsfarben",cover_colors_hint:"Standardpalettenfarbe für jede Überlagerung überschreiben.",default_color:"Standard",display:"Anzeige",toggle_compact_label:"Kompaktmodus",toggle_compact_desc:"Kleineres Diagramm, engerer Abstand."}}}};function Ve(e,t){const s=t.split(".");let i=e;for(const e of s){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function qe(e,t){return t?e.replace(/\{(\w+)\}/g,(e,s)=>Object.prototype.hasOwnProperty.call(t,s)?String(t[s]):e):e}function He(e,t,s){const i=function(e){const t=(e?.locale?.language??e?.language??"en").toLowerCase().split("-")[0];return t in We?t:"en"}(t),o=Ve(We[i],e);if(void 0!==o)return qe(o,s);if("en"!==i){const t=Ve(We.en,e);if(void 0!==t)return qe(t,s)}return e}function Ye(e){return null==e||Number.isNaN(e)?"—":`${Math.round(e)}%`}function Qe(e){return!e||"unavailable"===e||"unknown"===e}function Ze(e){return null==e||Number.isNaN(e)?"—":`${e.toFixed(1)}°`}function Xe(e,t){if(!e)return"—";const s=new Date(e);return Number.isNaN(s.getTime())?"—":s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",timeZone:t})}function Je(e,t){if(!e)return"—";const s=new Date(e).getTime();if(Number.isNaN(s))return"—";const i=Math.round((s-Date.now())/1e3);return i<=0?t?He("formatters.expired",t):"expired":function(e){if(null==e||Number.isNaN(e))return"—";const t=Math.max(0,Math.round(e));if(t<60)return`${t}s`;const s=Math.floor(t/60);return s<60?`${s}m ${t%60}s`:`${Math.floor(s/60)}h ${s%60}m`}(i)}function et(e,t){if(null!==t&&!Number.isNaN(t)){if(t>=95)return e.open;if(t<=5)return e.closed}return e.partial}function tt(e){const{explicitIcon:t,deviceClass:s,coverType:i,position:o}=e;if("string"==typeof t&&t.length>0)return t;if(s){const e=Pe[s];if(e)return et(e,o)}return function(e,t){return et({open:Te[e]??"mdi:window-shutter-open",partial:Ie[e]??"mdi:window-shutter",closed:Ne[e]??"mdi:window-shutter"},t)}(i,o)}function st(e){if(Qe(e)||!e)return"var(--state-unavailable-color)";const t=e.toLowerCase(),s="closed"!==t?"active":"inactive";return`var(--state-cover-${t}-color, var(--state-cover-${s}-color, var(--state-cover-color, var(--state-${s}-color))))`}const it=e=>(...t)=>({_$litDirective$:e,values:t});class ot{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const nt=(e,t)=>{const s=e._$AN;if(void 0===s)return!1;for(const e of s)e._$AO?.(t,!1),nt(e,t);return!0},rt=e=>{let t,s;do{if(void 0===(t=e._$AM))break;s=t._$AN,s.delete(e),e=t}while(0===s?.size)},at=e=>{for(let t;t=e._$AM;e=t){let s=t._$AN;if(void 0===s)t._$AN=s=new Set;else if(s.has(e))break;s.add(e),dt(t)}};function lt(e){void 0!==this._$AN?(rt(this),this._$AM=e,at(this)):this._$AM=e}function ct(e,t=!1,s=0){const i=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(t)if(Array.isArray(i))for(let e=s;e<i.length;e++)nt(i[e],!1),rt(i[e]);else null!=i&&(nt(i,!1),rt(i));else nt(this,e)}const dt=e=>{2==e.type&&(e._$AP??=ct,e._$AQ??=lt)};class ht extends ot{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,s){super._$AT(e,t,s),at(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(nt(this,e),rt(this))}setValue(e){if((()=>void 0===this._$Ct.strings)())this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}const ut=[12,16];function pt(e,t,s=0){const i=(e-90+s)*Math.PI/180;return{x:t*Math.cos(i),y:t*Math.sin(i)}}function gt(e){return 1-Math.max(0,Math.min(90,e))/90}function _t(e,t,s,i=0,o=0){const n=e=>(e%360+360)%360,r=n(e),a=n(t);let l=a-r;l<0&&(l+=360);const c=l>180?1:0,d=pt(r,s,o),h=pt(a,s,o);if(i<=0)return`M 0 0 L ${d.x} ${d.y} A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y} Z`;const u=pt(a,i,o),p=pt(r,i,o);return[`M ${d.x} ${d.y}`,`A ${s} ${s} 0 ${c} 1 ${h.x} ${h.y}`,`L ${u.x} ${u.y}`,`A ${i} ${i} 0 ${c} 0 ${p.x} ${p.y}`,"Z"].join(" ")}function mt(e,t,s=0){return pt(e,gt(t),s)}function ft(e){return(e%360+360)%360}function vt(e,t,s,i){const o=i??0;let n=-1,r=-1;for(let i=t;i<=s&&i<e.length;i++)e[i].elevation>o&&(-1===n&&(n=i),r=i);return-1===n?null:{wedgeStart:e[n].azimuth,wedgeEnd:e[r].azimuth}}function bt(e,t,s){const i=(e-t)/864e5;return Math.max(0,Math.min(s,i*s))}function yt(e,t,s){return t+(1-(Number.isNaN(e)?0:Math.max(0,Math.min(100,e)))/100)*s}function wt(e,t,s){return((e-t)%360+360)%360<=((s-t)%360+360)%360}function xt(e,t,s,i){return wt(s,e,t)||wt(i,e,t)||wt(e,s,i)||wt(t,s,i)}function $t(e){const t=Object.values(e).filter(e=>"number"==typeof e);return 0===t.length?null:t.reduce((e,t)=>e+t,0)/t.length}function kt(e,t,s,i){const o="cover_awning"===t?e/100:1-e/100;return Math.min(s*o,i)}function At(e,t,s){return e&&null!=t&&Number.isFinite(t)?t===s?null:t:null}function St(e,t){return e<.5?-4*t*e:4*t*(1-e)}function Ct(e,t,s,i,o){const n=pt(s,1),r=-n.y,a=n.x,l=e-n.x*i,c=t-n.y*i;return`M ${e} ${t} L ${l+r*o} ${c+a*o} L ${l-r*o} ${c-a*o} Z`}let Et=class extends ce{constructor(){super(...arguments),this.text="",this.cursorX=0,this.cursorY=0,this.offset=ut,this.visible=!1,this._x=0,this._y=0}connectedCallback(){super.connectedCallback(),this.hasAttribute("role")||this.setAttribute("role","tooltip")}updated(){if(!this.visible)return;this.setAttribute("aria-hidden","false");const e=this.shadowRoot?.querySelector(".bubble"),t=e?.offsetWidth??0,s=e?.offsetHeight??0,i="undefined"!=typeof window?window.innerWidth:0,o="undefined"!=typeof window?window.innerHeight:0,{x:n,y:r}=function(e){const{cursorX:t,cursorY:s,ttW:i,ttH:o,vpW:n,vpH:r}=e,[a,l]=e.offset??ut;let c=t+a,d=!1;c+i>n&&(c=t-a-i,d=!0),c<0&&(c=0);let h=s+l;return h+o>r&&(h=s-l-o),h<0&&(h=0),{x:c,y:h,flipped:d}}({cursorX:this.cursorX,cursorY:this.cursorY,ttW:t,ttH:s,vpW:i,vpH:o,offset:this.offset});n!==this._x&&(this._x=n),r!==this._y&&(this._y=r)}render(){return this.visible?U`<div class="bubble" style="transform: translate3d(${this._x}px, ${this._y}px, 0)">
      ${this.text}
    </div>`:(this.setAttribute("aria-hidden","true"),q)}};Et.styles=r`
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
  `,e([ge({type:String})],Et.prototype,"text",void 0),e([ge({type:Number})],Et.prototype,"cursorX",void 0),e([ge({type:Number})],Et.prototype,"cursorY",void 0),e([ge({attribute:!1})],Et.prototype,"offset",void 0),e([ge({type:Boolean,reflect:!0})],Et.prototype,"visible",void 0),e([_e()],Et.prototype,"_x",void 0),e([_e()],Et.prototype,"_y",void 0),Et=e([he("acp-floating-tooltip")],Et);const zt={enabled:!0,offset:ut,delay:400};function Ot(e){void 0!==e.enabled&&(zt.enabled=e.enabled),void 0!==e.offset&&(zt.offset=e.offset),void 0!==e.delay&&(zt.delay=e.delay)}const Mt="acp-floating-tooltip-bubble",It=new class{constructor(){this._el=null,this._refs=0}get id(){return Mt}retain(){this._refs+=1,this._ensure()}release(){this._refs=Math.max(0,this._refs-1)}_ensure(){if("undefined"==typeof document)return null;if(this._el&&this._el.isConnected)return this._el;const e=document.createElement("acp-floating-tooltip");return e.id=Mt,document.body.appendChild(e),this._el=e,e}show(e,t,s,i){const o=this._ensure();o&&(o.text=e,o.cursorX=t,o.cursorY=s,o.offset=i,o.visible=!0)}move(e,t){this._el&&this._el.visible&&(this._el.cursorX=e,this._el.cursorY=t)}hide(){this._el&&(this._el.visible=!1)}_reset(){this._el&&this._el.parentNode&&this._el.parentNode.removeChild(this._el),this._el=null,this._refs=0}},Tt=it(class extends ht{constructor(e){if(super(e),this._el=null,this._text="",this._offset=ut,this._delay=400,this._enabled=!0,this._openTimer=null,this._shown=!1,this._retained=!1,this._lastX=0,this._lastY=0,this._onEnter=e=>this._handleEnter(e),this._onMove=e=>this._handleMove(e),this._onLeave=()=>this._dismiss(),this._onFocus=()=>this._handleFocus(),this._onBlur=()=>this._dismiss(),this._onKey=e=>{"Escape"===e.key&&this._dismiss()},this._onScroll=()=>this._dismiss(),6!==e.type)throw new Error("tooltip() can only be used as an element-part directive")}render(e,t){return q}update(e,[t,s]){const i=e.element;return this._text=t??"",this._offset=s?.offset??zt.offset,this._delay=s?.delay??zt.delay,this._enabled=s?.enabled??zt.enabled,this._el!==i?(this._teardown(),this._el=i,this._wire()):this._applyAttributes(),this.render(t,s)}_wire(){const e=this._el;e&&(this._applyAttributes(),this._enabled&&(It.retain(),this._retained=!0,e.addEventListener("pointerenter",this._onEnter),e.addEventListener("pointermove",this._onMove),e.addEventListener("pointerleave",this._onLeave),e.addEventListener("focusin",this._onFocus),e.addEventListener("focusout",this._onBlur),e.addEventListener("keydown",this._onKey),window.addEventListener("scroll",this._onScroll,!0)))}_applyAttributes(){const e=this._el;e&&(this._enabled?(e.removeAttribute("title"),e.setAttribute("data-tooltip",this._text),e.setAttribute("aria-describedby",It.id)):(e.removeAttribute("data-tooltip"),e.removeAttribute("aria-describedby"),e.removeAttribute("acp-tt-shown"),e.setAttribute("title",this._text)))}_handleEnter(e){this._lastX=e.clientX,this._lastY=e.clientY,this._armOpen()}_handleFocus(){const e=this._el;if(e&&"function"==typeof e.getBoundingClientRect){const t=e.getBoundingClientRect();this._lastX=t.left+t.width/2,this._lastY=t.bottom}this._armOpen()}_armOpen(){null===this._openTimer&&(this._openTimer=setTimeout(()=>{this._openTimer=null,this._open()},this._delay))}_open(){this._el&&(It.show(this._text,this._lastX,this._lastY,this._offset),this._shown=!0,this._el.setAttribute("acp-tt-shown",""))}_handleMove(e){this._lastX=e.clientX,this._lastY=e.clientY,this._shown&&It.move(this._lastX,this._lastY)}_dismiss(){null!==this._openTimer&&(clearTimeout(this._openTimer),this._openTimer=null),this._shown&&(It.hide(),this._shown=!1),this._el?.removeAttribute("acp-tt-shown")}_teardown(){const e=this._el;e&&(this._dismiss(),e.removeEventListener("pointerenter",this._onEnter),e.removeEventListener("pointermove",this._onMove),e.removeEventListener("pointerleave",this._onLeave),e.removeEventListener("focusin",this._onFocus),e.removeEventListener("focusout",this._onBlur),e.removeEventListener("keydown",this._onKey),"undefined"!=typeof window&&window.removeEventListener("scroll",this._onScroll,!0),this._retained&&(It.release(),this._retained=!1),e.removeAttribute("data-tooltip"),e.removeAttribute("aria-describedby"),e.removeAttribute("acp-tt-shown"),this._el=null)}disconnected(){this._teardown()}reconnected(){this._wire()}});function Nt(){let e=null;return(t,s,i)=>{const o=s.entry_id??"";if(!o)return e=null,null;const n=null!==e&&e.registry===i&&e.entryId===o,r=n?e.base:Ft(o,i);if(!r)return e={registry:i,entryId:o,base:null,devices:null,posState:null,ctrlState:null,result:null},null;const a=t.devices,l=r.entities.target_position_sensor??r.entities.group_position_sensor,c=r.entities.control_status_sensor,d=l?t.states[l]:void 0,h=c?t.states[c]:void 0;if(n&&null!==e&&null!==e.result&&e.devices===a&&e.posState===d&&e.ctrlState===h)return e.result;const u=Rt(t,o,r);return e={registry:i,entryId:o,base:r,devices:a,posState:d,ctrlState:h,result:u},u}}function Pt(){const e=new Map;let t=[],s=[],i={list:[],missing:[]};return(o,n,r,a)=>{const l=n.map(t=>{let s=e.get(t);return s||(s=Nt(),e.set(t,s)),s(o,{type:a,entry_id:t},r)});if(e.size>n.length)for(const t of e.keys())n.includes(t)||e.delete(t);const c=t.length===n.length&&t.every((e,t)=>e===n[t])&&s.length===l.length&&s.every((e,t)=>e===l[t]);if(c)return i;t=n.slice(),s=l;const d=[],h=[];return n.forEach((e,t)=>{const s=l[t];s?d.push(s):h.push(e)}),i={list:d,missing:h},i}}function Ft(e,t){const s={},i=`${e}_`;let o,n=!1;for(const r of t){if(r.config_entry_id!==e)continue;if(r.platform!==Ee)continue;if(n=!0,!o&&r.device_id&&(o=r.device_id),!r.unique_id.startsWith(i))continue;const t=r.unique_id.slice(i.length),a=r.entity_id.split(".")[0],l=Ue[`${a}:${t}`];l&&(s[l]=r.entity_id)}return n&&0!==Object.keys(s).length?{entities:s,deviceId:o}:null}function Rt(e,t,s){const{entities:i,deviceId:o}=s,n=e;let r=t;if(n.devices)for(const e of Object.values(n.devices))if(e.config_entries?.includes(t)){r=e.name_by_user??e.name??t;break}const a=!!i.group_active_scene_sensor,l=[];if(a){const t=i.group_position_sensor;if(t){const s=e.states[t]?.attributes?.member_positions;s&&l.push(...Object.keys(s))}}else{const t=i.target_position_sensor;if(t){const s=e.states[t]?.attributes?.actual_positions;s&&l.push(...Object.keys(s))}}let c,d="cover_blind";const h=i.control_status_sensor;if(h){const t=e.states[h]?.attributes;t?.cover_type&&(d=t.cover_type);const s=t?.cover_discovery;s&&"object"==typeof s&&Array.isArray(s.axes)&&(c=s)}return{entry_id:t,entry_title:r,cover_type:d,entities:i,managed_covers:l,device_id:o,is_group:a,...c?{discovery:c}:{}}}function jt(e,t,s){const i=t.entry_id;if(!i)return null;const o=Ft(i,s);return o?Rt(e,i,o):null}async function Dt(e){return e.callWS({type:"config/entity_registry/list"})}function Bt(e,t){let s=null,i=!1;return e.connection.subscribeEvents(e=>t(e.data),"entity_registry_updated").then(e=>{i?e():s=e}).catch(()=>{}),()=>{i=!0,s&&s()}}let Kt=null,Gt=null;function Lt(){return Kt}function Ut(e,t=!1){if(Gt)return Gt;if(!t&&Kt)return Promise.resolve(Kt);const s=Dt(e).then(e=>(Kt=e,Gt=null,e)).catch(e=>{throw Gt=null,e});return Gt=s,s}let Wt=null,Vt=null;function qt(e,t){return function(){if(Kt||Gt)return;const e=globalThis.hassConnection;e&&(Gt=e.then(({conn:e})=>e.sendMessagePromise({type:"config/entity_registry/list"})).then(e=>(Kt=e,Gt=null,e)).catch(e=>{throw Gt=null,e}),Gt.catch(()=>{}))}(),(s,i)=>{const o=function(e,t){const s=Lt();if(!s)return e.callWS&&Ut(e).catch(()=>{}),null;const i=function(e){if(Wt===e&&Vt)return Vt;const t=new Map;for(const s of e)t.set(s.entity_id,s);return Wt=e,Vt=t,t}(s),o=i.get(t);if(o?.platform===Ee)return o.config_entry_id;if(!t.startsWith("cover."))return null;for(const[s,o]of Object.entries(e.states)){const e=o?.attributes,n=e?.actual_positions??e?.member_positions;if(!n||!(t in n))continue;const r=i.get(s);if(r?.platform===Ee)return r.config_entry_id}return null}(s,i);return o?{config:"entry_ids"===t?{type:e,entry_ids:[o]}:{type:e,entry_id:o}}:null}}async function Ht(e){const[t,s]=await Promise.all([e.callWS({type:"config_entries/get",domain:Ee}),Dt(e)]),i=new Set(s.filter(e=>e.platform===Ee&&null!=e.config_entry_id).map(e=>e.config_entry_id));return t.filter(e=>e.domain===Ee&&i.has(e.entry_id)).map(e=>({entry_id:e.entry_id,title:e.title}))}function Yt(e){return`acp-card:registry:v1:${e}`}const Qt={get(e){try{const t=localStorage.getItem(Yt(e));if(!t)return null;const s=JSON.parse(t);return 1!==s.schemaVersion?null:s.entries?.length?"number"==typeof s.fetchedAt&&Date.now()-s.fetchedAt>6e4?null:s:null}catch{return null}},set(e,t){if(0!==t.length)try{const s={schemaVersion:1,cardVersion:fe,fetchedAt:Date.now(),entries:t};localStorage.setItem(Yt(e),JSON.stringify(s))}catch{}},invalidate(e){try{localStorage.removeItem(Yt(e))}catch{}},clear(){try{const e="acp-card:registry:v1:",t=[];for(let s=0;s<localStorage.length;s++){const i=localStorage.key(s);i?.startsWith(e)&&t.push(i)}t.forEach(e=>localStorage.removeItem(e))}catch{}}};function Zt(e){return`${e.entity_id}|${e.unique_id}|${e.platform}|${e.config_entry_id??""}`}function Xt(e,t,s){return e.filter(e=>e.config_entry_id===t&&void 0===s)}let Jt=class extends ce{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return U`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        ${Tt(this.title)}
        aria-disabled=${this.readonly?"true":q}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};Jt.styles=r`
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
  `,e([ge({type:Boolean})],Jt.prototype,"on",void 0),e([ge({type:Boolean})],Jt.prototype,"readonly",void 0),e([ge({type:String})],Jt.prototype,"label",void 0),e([ge({type:String})],Jt.prototype,"title",void 0),Jt=e([he("acp-header-pill")],Jt);const es=it(class extends ot{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const s=e.element.classList;for(const e of this.st)e in t||(s.remove(e),this.st.delete(e));for(const e in t){const i=!!t[e];i===this.st.has(e)||this.nt?.has(e)||(i?(s.add(e),this.st.add(e)):(s.remove(e),this.st.delete(e)))}return V}});function ts(e,t){const s=t.entities.target_position_sensor;if(!s)return null;const i=parseFloat(e.states[s]?.state??"");return Number.isNaN(i)?null:i}function ss(e,t){const s=t.entities.target_position_sensor;if(!s)return null;const i=e.states[s]?.attributes,o=i?.linear_position;return"number"==typeof o&&Number.isFinite(o)?o:null}function is(e,t){return ss(e,t)??ts(e,t)}function os(e,t){const s=t.entities.target_position_sensor;if(!s)return null;const i=e.states[s]?.attributes,o=i?.raw_calculated_position;return"number"==typeof o&&Number.isFinite(o)?o:null}function ns(e,t){const s=t.entities.target_position_sensor;if(!s)return null;const i=e.states[s]?.attributes;return i?.actual_positions?$t(i.actual_positions):null}function rs(e,t){const s=t.entities.manual_override_binary;return!!s&&"on"===e.states[s]?.state}function as(e,t){const s=is(e,t);return At(rs(e,t),os(e,t),s)??s}function ls(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var cs,ds,hs={exports:{}},us=(cs||(cs=1,ds=hs,function(){var e=Math.PI,t=Math.sin,s=Math.cos,i=Math.tan,o=Math.asin,n=Math.atan2,r=Math.acos,a=e/180,l=864e5,c=2440588,d=2451545;function h(e){return new Date((e+.5-c)*l)}function u(e){return function(e){return e.valueOf()/l-.5+c}(e)-d}var p=23.4397*a;function g(e,o){return n(t(e)*s(p)-i(o)*t(p),s(e))}function _(e,i){return o(t(i)*s(p)+s(i)*t(p)*t(e))}function m(e,o,r){return n(t(e),s(e)*t(o)-i(r)*s(o))}function f(e,i,n){return o(t(i)*t(n)+s(i)*s(n)*s(e))}function v(e,t){return a*(280.16+360.9856235*e)-t}function b(e){return a*(357.5291+.98560028*e)}function y(s){return s+a*(1.9148*t(s)+.02*t(2*s)+3e-4*t(3*s))+102.9372*a+e}function w(e){var t=y(b(e));return{dec:_(t,0),ra:g(t,0)}}var x={getPosition:function(e,t,s){var i=a*-s,o=a*t,n=u(e),r=w(n),l=v(n,i)-r.ra;return{azimuth:m(l,o,r.dec),altitude:f(l,o,r.dec)}}},$=x.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];x.addTime=function(e,t,s){$.push([e,t,s])};var k=9e-4;function A(t,s,i){return k+(t+s)/(2*e)+i}function S(e,s,i){return d+e+.0053*t(s)-.0069*t(2*i)}function C(e,i,o,n,a,l,c){var d=function(e,i,o){return r((t(e)-t(i)*t(o))/(s(i)*s(o)))}(e,o,n);return S(A(d,i,a),l,c)}function E(e){var i=a*(134.963+13.064993*e),o=a*(93.272+13.22935*e),n=a*(218.316+13.176396*e)+6.289*a*t(i),r=5.128*a*t(o),l=385001-20905*s(i);return{ra:g(n,r),dec:_(n,r),dist:l}}function z(e,t){return new Date(e.valueOf()+t*l/24)}x.getTimes=function(t,s,i,o){var n,r,l,c,d,p=a*-i,g=a*s,m=function(e){return-2.076*Math.sqrt(e)/60}(o=o||0),f=function(t,s){return Math.round(t-k-s/(2*e))}(u(t),p),v=A(0,p,f),w=b(v),x=y(w),E=_(x,0),z=S(v,w,x),O={solarNoon:h(z),nadir:h(z-.5)};for(n=0,r=$.length;n<r;n+=1)d=z-((c=C(((l=$[n])[0]+m)*a,p,g,E,f,w,x))-z),O[l[1]]=h(d),O[l[2]]=h(c);return O},x.getMoonPosition=function(e,o,r){var l=a*-r,c=a*o,d=u(e),h=E(d),p=v(d,l)-h.ra,g=f(p,c,h.dec),_=n(t(p),i(c)*s(h.dec)-t(h.dec)*s(p));return g+=function(e){return e<0&&(e=0),2967e-7/Math.tan(e+.00312536/(e+.08901179))}(g),{azimuth:m(p,c,h.dec),altitude:g,distance:h.dist,parallacticAngle:_}},x.getMoonIllumination=function(e){var i=u(e||new Date),o=w(i),a=E(i),l=149598e3,c=r(t(o.dec)*t(a.dec)+s(o.dec)*s(a.dec)*s(o.ra-a.ra)),d=n(l*t(c),a.dist-l*s(c)),h=n(s(o.dec)*t(o.ra-a.ra),t(o.dec)*s(a.dec)-s(o.dec)*t(a.dec)*s(o.ra-a.ra));return{fraction:(1+s(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},x.getMoonTimes=function(e,t,s,i){var o=new Date(e);i?o.setUTCHours(0,0,0,0):o.setHours(0,0,0,0);for(var n,r,l,c,d,h,u,p,g,_,m,f,v,b=.133*a,y=x.getMoonPosition(o,t,s).altitude-b,w=1;w<=24&&(n=x.getMoonPosition(z(o,w),t,s).altitude-b,p=((d=(y+(r=x.getMoonPosition(z(o,w+1),t,s).altitude-b))/2-n)*(u=-(h=(r-y)/2)/(2*d))+h)*u+n,_=0,(g=h*h-4*d*n)>=0&&(m=u-(v=Math.sqrt(g)/(2*Math.abs(d))),f=u+v,Math.abs(m)<=1&&_++,Math.abs(f)<=1&&_++,m<-1&&(m=f)),1===_?y<0?l=w+m:c=w+m:2===_&&(l=w+(p<0?f:m),c=w+(p<0?m:f)),!l||!c);w+=2)y=r;var $={};return l&&($.rise=z(o,l)),c&&($.set=z(o,c)),l||c||($[p>0?"alwaysUp":"alwaysDown"]=!0),$},ds.exports=x}()),hs.exports),ps=ls(us);const gs=new Map;function _s(e,t,s,i=10){const o=`${e},${t},${s.getTime()},${i}`,n=gs.get(o);if(n)return gs.delete(o),gs.set(o,n),n;const r=[],a=s.getTime()+864e5;for(let o=s.getTime();o<=a;o+=60*i*1e3){const s=new Date(o),i=ps.getPosition(s,e,t);r.push({t:s,elevation:180*i.altitude/Math.PI,azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360})}if(gs.set(o,r),gs.size>4){const e=gs.keys().next().value;void 0!==e&&gs.delete(e)}return r}function ms(e=new Date){const t=new Date(e);return t.setHours(0,0,0,0),t}function fs(e,t=new Date){if(!e)return ms(t);const s=new Intl.DateTimeFormat("en-CA",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}).format(t),[i,o,n]=s.split("-").map(Number),r=Date.UTC(i,o-1,n,0,0,0),a=function(e,t){const s=new Intl.DateTimeFormat("en-US",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(t),i={};for(const e of s)"literal"!==e.type&&(i[e.type]=Number(e.value));return Date.UTC(i.year,i.month-1,i.day,i.hour,i.minute,i.second)-t.getTime()}(e,new Date(r));return new Date(r-a)}function vs(e,t,s,i){const o=((t-s)%360+360)%360;return((e-o)%360+360)%360<=((((t+i)%360+360)%360-o)%360+360)%360}function bs(e,t,s,i){const o=[];let n=-1;for(let r=0;r<e.length;r++){const a=e[r];a.elevation>0&&vs(a.azimuth,t,s,i)?-1===n&&(n=r):-1!==n&&(o.push({startIdx:n,endIdx:r-1}),n=-1)}return-1!==n&&o.push({startIdx:n,endIdx:e.length-1}),o}function ys(e,t,s=new Date){const i=ps.getMoonPosition(s,e,t),o=ps.getMoonIllumination(s);return{azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360,elevation:180*i.altitude/Math.PI,phase:o.phase,fraction:o.fraction,phaseName:ws(o.phase)}}function ws(e){return e<.0625||e>=.9375?"New Moon":e<.1875?"Waxing Crescent":e<.3125?"First Quarter":e<.4375?"Waxing Gibbous":e<.5625?"Full Moon":e<.6875?"Waning Gibbous":e<.8125?"Last Quarter":"Waning Crescent"}const xs=new Set(["outside_fov","in_fov_not_valid","hitting"]),$s={night:"sun night",hitting:"sun valid",in_fov_not_valid:"sun in-fov",outside_fov:"sun up"};function ks(e){return e.belowHorizon?"night":e.sunState&&xs.has(e.sunState)?e.sunState:e.directSunValid?"hitting":e.inFov?"in_fov_not_valid":"outside_fov"}const As=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function Ss(e){const t=As.length;return As[(e%t+t)%t]}function Cs(e,t){return"string"==typeof e&&e.length>0?{color:e,isOverride:!0}:{color:Ss(t),isOverride:!1}}const Es="data:image/png;base64,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",zs=110;let Os=0,Ms=class extends ce{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[],this.northOffsetDeg=0,this._hiddenEntries=new Set,this._legendMoonMaskId="acp-legend-moon-"+Os++}shouldUpdate(e){return e.size>1||!e.has("hass")||me(e.get("hass"),this.hass,this._relevantIds())}_relevantIds(){const e=[];for(const t of this.discovered_list){const s=t.entities;e.push(s.sun_sensor,s.target_position_sensor,s.manual_override_binary,s.sun_infront_binary,s.decision_trace_sensor,s.start_sensor,s.end_sensor)}return e}_toggleEntry(e){const t=new Set(this._hiddenEntries);t.has(e)?t.delete(e):t.add(e),this._hiddenEntries=t}_sunFor(e){const t=e.entities.sun_sensor;if(!t)return null;const s=this.hass.states[t];if(!s)return null;const i=parseFloat(s.state);return Number.isNaN(i)?null:{...s.attributes,window_azimuth:s.attributes.window_azimuth}}_sunInfrontFor(e){const t=e.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}_sunDotStateFor(e,t){const s=e.entities.decision_trace_sensor?this.hass.states[e.entities.decision_trace_sensor]?.attributes:void 0;return ks({belowHorizon:t.elevation<=0,sunState:s?.sun_state??null,directSunValid:s?.direct_sun_valid??!1,inFov:!0===t.in_fov})}_readActiveAzimuth(e){if(!e)return null;const t=this.hass.states[e];if(!t)return null;if("unavailable"===t.state||"unknown"===t.state)return null;const s=t.attributes.azimuth;return"number"==typeof s&&Number.isFinite(s)?s:null}_buildOverlays(){const e=[];return this.discovered_list.forEach((t,s)=>{const i=this._sunFor(t);if(!i)return;const o=t.entities.sun_sensor,n=parseFloat(this.hass.states[o]?.state??"0"),{color:r,isOverride:a}=Cs(this.coverColors?.[s],s);e.push({d:t,sun:i,sunAzi:n,sunInfront:this._sunInfrontFor(t),dotState:this._sunDotStateFor(t,i),coverPos:as(this.hass,t),actualPos:ns(this.hass,t),coverType:t.cover_type,color:r,isOverride:a,index:s})}),e}render(){if(!this.hass)return q;if(!this.discovered_list||0===this.discovered_list.length)return U`<div class="placeholder">${He("compass.placeholder_no_entries",this.hass)}</div>`;const e=this._buildOverlays();if(0===e.length)return U`<div class="placeholder">${He("compass.placeholder_no_sun",this.hass)}</div>`;const t=e.filter(e=>!this._hiddenEntries.has(e.d.entry_id)),s=ft(this.northOffsetDeg),i=e.length>1,o=e[0],n=o.sunAzi,r=o.sun.elevation,a=mt(n,r,s),l={night:-1,outside_fov:0,in_fov_not_valid:1,hitting:2},c=r<=0?"night":e.reduce((e,t)=>l[t.dotState]>l[e]?t.dotState:e,"outside_fov"),d=$s[c],{latitude:h,longitude:u,time_zone:p}=this.hass.config,g=void 0!==h&&void 0!==u?_s(h,u,fs(p)):[],_=this.showMoon&&void 0!==h&&void 0!==u?ys(h,u):null,m=null!==_&&_.elevation>0,f=_?St(_.phase,6):0,v=m?mt(_.azimuth,_.elevation,s):null,b=v?v.x*zs:0,y=v?v.y*zs:0,w=this.showSunPath?function(e){const t=[];let s=-1;for(let i=0;i<e.length;i++)e[i].elevation>0?-1===s&&(s=i):-1!==s&&(t.push({startIdx:s,endIdx:i-1}),s=-1);return-1!==s&&t.push({startIdx:s,endIdx:e.length-1}),t}(g).map(e=>g.slice(e.startIdx,e.endIdx+1).map(e=>{const t=mt(e.azimuth,e.elevation,s);return{x:t.x*zs,y:t.y*zs,elev:e.elevation}})):[],x=[122,127,135],$=[245,197,24],k=e=>{const t=Math.sqrt(Math.max(0,Math.min(1,e/90))),s=x.map((e,s)=>Math.round(e+($[s]-e)*t));return`rgb(${s[0]},${s[1]},${s[2]})`},A=this.showSunPath&&this.showSunriseSunset?w.filter(e=>e.length>1).map((e,t)=>{const s=e[0],i=e[e.length-1],o=i.x-s.x,n=i.y-s.y,r=o*o+n*n||1,a=e.filter((t,s)=>s%6==0||s===e.length-1).map(e=>({offset:100*Math.max(0,Math.min(1,((e.x-s.x)*o+(e.y-s.y)*n)/r)),color:k(e.elev)}));return{id:`sun-path-grad-${t}`,x1:s.x,y1:s.y,x2:i.x,y2:i.y,stops:a}}):[],S=e=>this.showSunriseSunset?`url(#sun-path-grad-${e})`:"var(--warning-color, gold)",C=pt(0,124,s),E=pt(90,124,s),z=pt(180,124,s),O=pt(270,124,s),M=pt(0,zs,s),I=pt(180,zs,s),T=pt(90,zs,s),N=pt(270,zs,s),P=He("compass.sun_tooltip",this.hass,{az:Ze(n),el:Ze(r)}),F=null!==_?He("compass.moon_tooltip",this.hass,{phase:_.phaseName,pct:Math.round(100*_.fraction)}):"",R=He("compass.sun_path_tooltip",this.hass);return U`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${W`
            <defs>
              ${m?W`
                <mask id="moon-phase-mask">
                  <circle cx=${b} cy=${y} r=${6} fill="white"></circle>
                  <circle cx=${b+f} cy=${y} r=${6} fill="black"></circle>
                </mask>
              `:q}
              ${A.map(e=>W`
                <linearGradient id=${e.id} gradientUnits="userSpaceOnUse"
                  x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}>
                  ${e.stops.map(e=>W`<stop offset="${e.offset}%" stop-color=${e.color}></stop>`)}
                </linearGradient>
              `)}
            </defs>

            <circle class="grid" r=${zs}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${zs/3}></circle>
            <line class="grid thin" x1=${M.x} y1=${M.y} x2=${I.x} y2=${I.y}></line>
            <line class="grid thin" x1=${T.x} y1=${T.y} x2=${N.x} y2=${N.y}></line>

            ${t.map(e=>this._renderEntryLayers(e,i,s,g))}

            ${this.showSunPath&&w.length?W`<g ${Tt(R)}>${w.filter(e=>e.length>1).flatMap((e,t)=>{const s=e.map(e=>`${e.x},${e.y}`).join(" "),i=W`<polyline class="sun-path-line" points=${s}
                        style="stroke:${S(t)}"></polyline>`,o=[];for(let t=0;t<e.length;t+=10){const s=e[t],i=e[Math.max(0,t-1)],n=e[Math.min(e.length-1,t+1)],r=180*Math.atan2(n.y-i.y,n.x-i.x)/Math.PI,a=this.showSunriseSunset?k(s.elev):"var(--warning-color, gold)";o.push(W`<path class="sun-path-chevron"
                          transform=${`translate(${s.x} ${s.y}) rotate(${r})`}
                          d="M -2.4 -3 L 1.8 0 L -2.4 3 L -0.7 0 Z"
                          style=${`fill:${a}`}></path>`)}return[i,...o]})}</g>`:q}

            ${this.showCardinals?W`
              <text class="cardinal" x=${C.x} y=${C.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${E.x} y=${E.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${z.x} y=${z.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${O.x} y=${O.y} text-anchor="middle" dominant-baseline="central">W</text>
            `:q}

            ${m?W`
              <g ${Tt(F)}>
                <circle class="moon-outline" cx=${b} cy=${y} r=${6}></circle>
                <image
                  class="moon-img"
                  href=${Es}
                  x=${b-6}
                  y=${y-6}
                  width=${12}
                  height=${12}
                  mask="url(#moon-phase-mask)"
                ></image>
              </g>
            `:q}

            <g ${Tt(P)}>
              <circle class=${d} cx=${a.x*zs} cy=${a.y*zs} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(e,i,d,_):q}
        ${this.showStats?this._renderStats(e,i):q}
      </div>
    `}_renderEntryLayers(e,t,s=0,i=[]){const o=ft(e.sun.window_azimuth),n=ft(o-e.sun.fov_left),r=ft(o+e.sun.fov_right),a=this._readActiveAzimuth(e.d.entities.start_sensor),l=this._readActiveAzimuth(e.d.entities.end_sensor),c=null!==a&&null!==l;let d,h;if(c)({wedgeStart:d,wedgeEnd:h}=function(e,t,s,i,o){const n=((s-i)%360+360)%360,r=i+o,a=((t-n)%360+360)%360,l=e=>e<=r?e:e-r<360-e?r:0,c=l(((e-n)%360+360)%360),d=l(a);return c===d?{wedgeStart:n,wedgeEnd:((n+r)%360+360)%360}:{wedgeStart:((n+Math.min(c,d))%360+360)%360,wedgeEnd:((n+Math.max(c,d))%360+360)%360}}(ft(a),ft(l),o,e.sun.fov_left,e.sun.fov_right));else{const t=function(e,t,s,i,o){if(void 0===o)return null;const n=ft(t-s),r=s+i,a=e.filter(e=>((e.azimuth-n)%360+360)%360<=r&&e.elevation>o);return 0===a.length?null:{wedgeStart:a[0].azimuth,wedgeEnd:a[a.length-1].azimuth}}(i,o,e.sun.fov_left,e.sun.fov_right,e.sun.min_elevation);d=t?t.wedgeStart:n,h=t?t.wedgeEnd:r}const u=pt(o,zs,s),{outer:p,inner:g}=(_=e.sun.min_elevation,m=e.sun.max_elevation,f=zs,void 0!==_&&void 0!==m&&_>m?{outer:f,inner:0}:{outer:void 0!==_?f*gt(_):f,inner:void 0!==m?f*gt(m):0});var _,m,f;const v=null!==e.coverPos?kt(e.coverPos,e.coverType,zs,p):null,b=null!==e.actualPos?kt(e.actualPos,e.coverType,zs,p):null,y=e.sun.blind_spot_range?[ft((w=o)-(x=e.sun.blind_spot_range)[1]),ft(w-x[0])]:null;var w,x;const $=y?_t(y[0],y[1],zs,0,s):null,k=_t(d,h,p,g,s),A=c&&(d!==n||h!==r),S=A?_t(n,r,p,g,s):"",C=null!==v&&v>g?_t(d,h,v,g,s):"",E=null!==b&&b>g?_t(d,h,b,g,s):"",z=[];for(const t of bs(i,o,e.sun.fov_left,e.sun.fov_right)){const o=vt(i,t.startIdx,t.endIdx,e.sun.min_elevation);o&&!xt(o.wedgeStart,o.wedgeEnd,d,h)&&z.push({fov:_t(o.wedgeStart,o.wedgeEnd,p,g,s),cover:this.showCoverFill&&null!==v&&v>g?_t(o.wedgeStart,o.wedgeEnd,v,g,s):"",actual:this.showCoverFill&&null!==b&&b>g?_t(o.wedgeStart,o.wedgeEnd,b,g,s):"",from:o.wedgeStart,to:o.wedgeEnd})}const O=t?`${e.d.entry_title}: `:"",M=void 0!==e.sun.min_elevation||void 0!==e.sun.max_elevation?He("compass.elev_suffix",this.hass,{min:Ze(e.sun.min_elevation??0),max:Ze(e.sun.max_elevation??90)}):"",I=c?`${O}${He("compass.active_sun_arc",this.hass,{from:Ze(d),to:Ze(h),elev:M})}`:`${O}${He("compass.fov_arc",this.hass,{left:Ze(e.sun.fov_left),right:Ze(e.sun.fov_right),elev:M})}`,T=`${O}${He("compass.window_normal_tooltip",this.hass,{bearing:Ze(o)})}`,N=[];if(null!==e.coverPos){const t="cover_awning"===e.coverType?"compass.cover_position_target_awning":"compass.cover_position_target";N.push(`${O}${He(t,this.hass,{pct:e.coverPos})}`),null!==e.actualPos&&N.push(He("compass.cover_position_actual",this.hass,{pct:Math.round(e.actualPos)}))}const P=N.join("\n"),F=y?`${O}${He("compass.blind_spot",this.hass,{from:Ze(y[0]),to:Ze(y[1])})}`:"",R=t||e.isOverride,j=t||e.isOverride,D=R?`fill: ${e.color}; stroke: ${e.color};`:"",B=j?`fill: ${e.color}; stroke: ${e.color};`:"",K=R?`fill: ${e.color}; stroke: ${e.color};`:"",G=R?`stroke: ${e.color};`:"",L=R?`fill: ${e.color};`:"",U=this.showCoverFill&&""!==C,V=this.showBlindSpot&&!!$,H=this.showWindowArrow,Y=`M 0 0 L ${u.x} ${u.y}`,Q=R?`fill: ${e.color}; stroke: ${e.color};`:"",Z=Ct(u.x,u.y,o+s,9,5),X="display: none;",J=`${O}${He("compass.fov_arc",this.hass,{left:Ze(e.sun.fov_left),right:Ze(e.sun.fov_right),elev:M})}`;return W`<g class="entry-overlay">
      ${A?W`<g ${Tt(J)}>
              <path class="fov fov-static" style=${D} d=${S}></path>
            </g>`:q}
      <g ${Tt(I)}>
        <path class="fov" style=${D} d=${k}></path>
      </g>
      ${z.map(e=>{const t=`${O}${He("compass.active_sun_arc",this.hass,{from:Ze(e.from),to:Ze(e.to),elev:M})}`;return W`<g ${Tt(t)}>
          <path class="fov-extra" style=${D} d=${e.fov}></path>
          ${e.cover?W`<path class="cover-fill-extra" style=${B} d=${e.cover}></path>`:q}
          ${e.actual?W`<path class="cover-actual-extra" style=${B} d=${e.actual}></path>`:q}
        </g>`})}
      <g class="arrow-group" style=${H?"":X} ${Tt(T)}>
        <path class="window" style=${G} d=${Y}></path>
        <path class="window-head" style=${Q} d=${Z}></path>
        <circle class="window-base" style=${L} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" style=${U?"":X} ${Tt(P)}>
        <path class="cover-fill" style=${B} d=${C}></path>
        ${this.showCoverFill&&E?W`<path class="cover-actual" style=${B} d=${E}></path>`:q}
      </g>
      <g class="blind-group" style=${V?"":X} ${Tt(F)}>
        <path class="blind-spot" style=${K} d=${$??""}></path>
      </g>
    </g>`}_legendSunGlyph(e){return U`<span class="glyph"
      ><svg viewBox="-8 -8 16 16" width="20" height="20">
        ${W`<circle class=${e} cx="0" cy="0" r="5"></circle>`}
      </svg></span
    >`}_legendMoonGlyph(e){const t=e?St(e.phase,4):0,s=this._legendMoonMaskId;return U`<span class="glyph"
      ><svg viewBox="-5 -5 10 10" width="11" height="11">
        ${W`
          <defs>
            <mask id=${s}>
              <circle cx="0" cy="0" r=${4} fill="white"></circle>
              <circle cx=${t} cy="0" r=${4} fill="black"></circle>
            </mask>
          </defs>
          <circle class="moon-outline" cx="0" cy="0" r=${4}></circle>
          <image
            class="moon-img"
            href=${Es}
            x=${-4}
            y=${-4}
            width=${8}
            height=${8}
            mask=${`url(#${s})`}
          ></image>
        `}
      </svg></span
    >`}_legendWindowGlyph(e){const t=e?`stroke: ${e};`:"",s=e?`fill: ${e};`:"",i=Ct(5,0,90,4,2);return U`<span class="glyph"
      ><svg class="window-glyph" viewBox="-6 -6 12 12" width="13" height="13">
        ${W`
          <line class="window" style=${t} x1="-5" y1="0" x2="1.5" y2="0"></line>
          <path class="window-head" style=${s} d=${i}></path>
        `}
      </svg></span
    >`}_renderLegend(e,t,s,i){const o=e[0]?.isOverride?e[0].color??null:null,n=e[0],r=null!==n?.coverPos&&null!=n?.actualPos&&void 0!==n?.coverPos&&Math.round(n.actualPos)!==Math.round(n.coverPos);return t?U`
        <div class="legend">
          <div>${this._legendSunGlyph(s)} ${He("compass.sun",this.hass)}</div>
          ${this.showMoon?U`<div>${this._legendMoonGlyph(i)} ${He("compass.moon",this.hass)}</div>`:q}
          ${e.map(e=>U`
              <button
                type="button"
                class=${es({"entry-toggle":!0,hidden:this._hiddenEntries.has(e.d.entry_id)})}
                aria-pressed=${!this._hiddenEntries.has(e.d.entry_id)}
                @click=${()=>this._toggleEntry(e.d.entry_id)}
              >
                <span class="licell"
                  ><span class="swatch entry" style="background: ${e.color}"></span
                ></span>
                ${e.d.entry_title}
                ${e.sunInfront?U`<span class="status valid">${He("compass.in_fov_check",this.hass)}</span>`:e.sun.in_fov?U`<span class="status in-fov">${He("compass.in_fov",this.hass)}</span>`:U`<span class="status">${He("compass.none",this.hass)}</span>`}
              </button>
            `)}
        </div>
      `:U`<div class="legend">
      <div>${this._legendSunGlyph(s)} ${He("compass.sun",this.hass)}</div>
      ${this.showMoon?U`<div>${this._legendMoonGlyph(i)} ${He("compass.moon",this.hass)}</div>`:q}
      <div>
        <span class="licell"
          ><span
            class="swatch fov"
            style=${o?`background: ${o}`:""}
          ></span
        ></span>
        ${He("compass.window_fov",this.hass)}
      </div>
      ${this.showCoverFill?U`<div>
            <span class="licell"
              ><span
                class="swatch cover-fill-swatch"
                style=${o?`background: ${o}`:""}
              ></span
            ></span>
            ${He("compass.cover_target",this.hass)}
          </div>`:q}
      ${this.showCoverFill&&r?U`<div>
            <span class="licell"
              ><span
                class="swatch cover-actual-swatch"
                style=${o?`border-color: ${o}`:""}
              ></span
            ></span>
            ${He("compass.cover_held",this.hass)}
          </div>`:q}
      ${this.showWindowArrow?U`<div>
            ${this._legendWindowGlyph(o)} ${He("compass.window_normal",this.hass)}
          </div>`:q}
    </div>`}_renderStats(e,t){const s=e[0],i=s.sunAzi,o=s.sun.elevation,{latitude:n,longitude:r}=this.hass.config,a=this.showMoon&&void 0!==n&&void 0!==r?ys(n,r):null;return t?U`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${He("compass.stat_sun",this.hass)}${Ze(i)} /
              ${Ze(o)}</span
            >
            ${this.showMoon&&a?U`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:q}
          </div>
          ${e.map(e=>U`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${e.color}"></span>
                <span class="entry-name">${e.d.entry_title}</span>
                <span>∠${Ze(e.sun.gamma)}</span>
                <span>W ${Ze(ft(e.sun.window_azimuth))}</span>
                ${e.sun.in_fov?U`<span
                      class="status in-fov"
                      ${Tt(He("compass.in_fov_tooltip",this.hass))}
                      >✓</span
                    >`:q}
              </div>
            `)}
        </div>
      `:U`<div class="stats dim">
      <span>${He("compass.stat_azi",this.hass)}${Ze(i)}</span>
      <span>${He("compass.stat_elev",this.hass)}${Ze(o)}</span>
      <span>∠: ${Ze(s.sun.gamma)}</span>
      <span
        >${He("compass.stat_window",this.hass)}${Ze(ft(s.sun.window_azimuth))}</span
      >
      ${this.showMoon&&a?U`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:q}
    </div>`}};function Is(e){let t=null,s=null;const i=6e4-Date.now()%6e4;return t=setTimeout(()=>{t=null,e(),s=setInterval(e,6e4)},i),()=>{null!==t&&(clearTimeout(t),t=null),null!==s&&(clearInterval(s),s=null)}}Ms.styles=r`
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
  `,e([ge({attribute:!1})],Ms.prototype,"hass",void 0),e([ge({attribute:!1})],Ms.prototype,"discovered_list",void 0),e([ge({type:Boolean,reflect:!0})],Ms.prototype,"compact",void 0),e([ge({attribute:!1})],Ms.prototype,"showStats",void 0),e([ge({attribute:!1})],Ms.prototype,"showLegend",void 0),e([ge({attribute:!1})],Ms.prototype,"showMoon",void 0),e([ge({attribute:!1})],Ms.prototype,"showCardinals",void 0),e([ge({attribute:!1})],Ms.prototype,"showBlindSpot",void 0),e([ge({attribute:!1})],Ms.prototype,"showSunPath",void 0),e([ge({attribute:!1})],Ms.prototype,"showSunriseSunset",void 0),e([ge({attribute:!1})],Ms.prototype,"showCoverFill",void 0),e([ge({attribute:!1})],Ms.prototype,"showWindowArrow",void 0),e([ge({attribute:!1})],Ms.prototype,"coverColors",void 0),e([ge({attribute:!1})],Ms.prototype,"northOffsetDeg",void 0),e([_e()],Ms.prototype,"_hiddenEntries",void 0),Ms=e([he("acp-sky-compass")],Ms);const Ts=32,Ns=864e5;function Ps(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:t}let Fs=class extends ce{constructor(){super(...arguments),this.discoveredList=[],this.coverColors=[],this.compact=!1,this._cancelMinuteTimer=null}connectedCallback(){super.connectedCallback(),this._cancelMinuteTimer=Is(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._cancelMinuteTimer?.(),this._cancelMinuteTimer=null}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=[];for(const e of this.discoveredList){const t=e.entities;s.push(t.sun_sensor,t.decision_trace_sensor,t.control_status_sensor)}return me(t,this.hass,s)}_sunAttrsFor(e){const t=e.entities.sun_sensor;if(!t)return null;const s=this.hass.states[t];return s?s.attributes:null}_sunDotTraceInputs(){const e=this.discoveredList[0]?.entities.decision_trace_sensor,t=e?this.hass.states[e]?.attributes:void 0;return{sunState:t?.sun_state??null,directSunValid:t?.direct_sun_valid??!1}}_scheduleBounds(){const e=this.discoveredList[0]?.entities.control_status_sensor;if(!e)return null;const t=this.hass.states[e]?.attributes;return t?{start:Ps(t.schedule_start),end:Ps(t.schedule_end)}:null}render(){if(!this.hass||0===this.discoveredList.length)return q;const e=this._sunAttrsFor(this.discoveredList[0]),{latitude:t,longitude:s,time_zone:i}=this.hass.config??{};if(void 0===t||void 0===s||!e)return U`<div class="placeholder">${He("elevation.placeholder",this.hass)}</div>`;const o=fs(i),n=_s(t,s,o),r=new Date,a=e=>{const t=e.getTime()-o.getTime();return Ts+t/864e5*360},l=e=>138-(e- -10)/100*128,c=n.map(e=>`${a(e.t).toFixed(1)},${l(e.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(r),u=this._interpAt(n,r),p=u?l(u.elevation):null,g=!u||u.elevation<=0,_=this._sunDotTraceInputs(),m=$s[ks({belowHorizon:g,sunState:_.sunState,directSunValid:_.directSunValid,inFov:!0===e.in_fov})].replace(/^sun /,""),f=e=>138-128*e,v=this.discoveredList.length>1,b=this._scheduleBounds(),y=b?function(e,t,s,i){if(!e&&!t)return{offSchedule:[],bars:[]};const o=e=>(e.getTime()-s)/i,n=e=>Math.max(0,Math.min(1,e)),r=e=>n(e),a=e=>e>1?e-Math.floor(e):n(e),l=e=>e>0&&e<1?[e]:[];if(e&&!t){const t=o(e);return{offSchedule:[{x0:0,x1:r(t)}],bars:l(t)}}if(!e&&t){const e=o(t);return{offSchedule:[{x0:a(e),x1:1}],bars:l(e)}}const c=o(e),d=o(t),h=r(c),u=a(d),p=[...l(c),...l(d)];if(h>u)return{offSchedule:[{x0:u,x1:h}],bars:p};const g=[];return h>0&&g.push({x0:0,x1:h}),u<1&&g.push({x0:u,x1:1}),{offSchedule:g,bars:p}}(b.start,b.end,o.getTime(),Ns):{offSchedule:[],bars:[]},w=e=>Ts+360*e,x=y.offSchedule.map(e=>({x:w(e.x0),width:w(e.x1)-w(e.x0)})),$=b?.start&&o?(b.start.getTime()-o.getTime())/Ns:null,k=y.bars.map(e=>{const t=null!==$&&Math.abs(e-$)<1e-9?b.start.toISOString():b.end.toISOString(),s=null!==$&&Math.abs(e-$)<1e-9,o=w(e);return{x:o,anchor:o>=391?"end":o<=33?"start":"middle",label:Xe(t,i),tooltip:He(s?"elevation.schedule_start_tooltip":"elevation.schedule_end_tooltip",this.hass)}}),A=(()=>{if(!b)return null;const e=b.start?Xe(b.start.toISOString(),i):null,t=b.end?Xe(b.end.toISOString(),i):null;return e&&t?He("elevation.schedule",this.hass,{from:e,to:t}):e?He("elevation.schedule_from",this.hass,{from:e}):t?He("elevation.schedule_until",this.hass,{to:t}):null})(),S=this.discoveredList.map((e,t)=>{const s=this._sunAttrsFor(e),{color:o,isOverride:r}=Cs(this.coverColors?.[t],t),l=r;if(!s)return{d:e,runs:[],inPlotBands:[],runBars:[],label:"",color:o,inlineFill:l};const c=bs(n,s.window_azimuth,s.fov_left,s.fov_right),d="number"==typeof s.min_elevation,h="number"==typeof s.max_elevation,{loFrac:u,hiFrac:p}=function(e,t){if(void 0!==e&&void 0!==t&&e>t)return{loFrac:0,hiFrac:1};const s=e=>Math.max(0,Math.min(1,(e- -10)/100));return{loFrac:void 0!==e?s(e):0,hiFrac:void 0!==t?s(t):1}}(s.min_elevation,s.max_elevation),g=d||h?f(p):10,_=d||h?f(u):138,m=g,b=Math.max(0,_-g),y=c.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),y:m,height:b})),w=c.map(e=>({x0:a(n[e.startIdx].t),x1:a(n[e.endIdx].t),range:`${Xe(n[e.startIdx].t.toISOString(),i)} → ${Xe(n[e.endIdx].t.toISOString(),i)}`})),x=c.map(e=>`${Xe(n[e.startIdx].t.toISOString(),i)} → ${Xe(n[e.endIdx].t.toISOString(),i)}`).join(", "),$=[];return v||(d&&$.push(_),h&&$.push(g)),{d:e,runs:c,inPlotBands:y,runBars:w,label:x,color:o,inlineFill:l,limitLines:$}}),C=S.some(e=>e.runs.length>0),E=v?function(e){if(e<=0)return{rows:[],height:0};const t=Array.from({length:e},(e,t)=>({y:0+11*t,height:8}));return{rows:t,height:0+8*e+3*(e-1)+0}}(S.length):{rows:[],height:0},z=138-E.height-3;return U`
      <div class="wrap">
        <div class="head">
          <span class="label">${He("elevation.title",this.hass)}</span>
          <span class="head-meta">
            ${v?q:C?U`<span class="dim"
                      >${He("elevation.fov_windows",this.hass,{windows:S[0].label})}</span
                    >`:U`<span class="dim">${He("elevation.no_fov_today",this.hass)}</span>`}
            ${A?U`<span class="dim schedule">${A}</span>`:q}
          </span>
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${W`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(e=>W`
              <line class="grid" x1=${Ts} y1=${l(e)} x2=${392} y2=${l(e)} />
              <text class="tick" x=${28} y=${l(e)+3} text-anchor="end">${e}°</text>
            `)}

            <!-- horizon -->
            <line class="horizon" x1=${Ts} y1=${d} x2=${392} y2=${d} />

            <!-- elevation limit gridlines (single-window legacy path only) -->
            ${S.flatMap(e=>(e.limitLines??[]).map(e=>W`<line class="limit-line" x1=${Ts} y1=${e} x2=${392} y2=${e} />`))}

            <!-- In-plot FOV bands: single-window legacy path only. -->
            ${v?q:S.flatMap(e=>e.inPlotBands.map(t=>W`<rect
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
            ${E.rows.flatMap((e,t)=>{const s=S[t],i=z+e.y,o=s.runs.length?s.d.entry_title:He("elevation.fov_window_named",this.hass,{name:s.d.entry_title,windows:He("elevation.no_fov_today",this.hass)}),n=W`<rect
                class="ribbon-track"
                x=${Ts}
                y=${i}
                width=${360}
                height=${e.height}
                rx="2"
                ${Tt(o)}
              ></rect>`,r=s.runBars.map(t=>W`<rect
                  class="ribbon-bar"
                  x=${t.x0}
                  y=${i}
                  width=${t.x1-t.x0}
                  height=${e.height}
                  rx="2"
                  style=${`fill:${s.color}`}
                  ${Tt(He("elevation.fov_window_named",this.hass,{name:s.d.entry_title,windows:t.range}))}
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
                ${Tt(e.tooltip)}
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
            <g class="now-group" ${Tt(Xe(r.toISOString(),i))}>
              <line class="now-hit" x1=${h} y1=${10} x2=${h} y2=${138} />
              <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />
            </g>
            ${null!==p?W`<circle class="sun-dot ${m}" cx=${h} cy=${p} r="4" />`:q}

            <!-- x-axis gridlines + time labels at every 6h, drawn last so the
                 axis sits on the topmost layer (nothing paints over the times).
                 Edge labels anchor inward (start at 00:00, end at 24:00) so they
                 don't clip past the viewBox. -->
            ${[0,6,12,18,24].map(e=>{const t=new Date(o.getTime()+36e5*e),s=0===e?"start":24===e?"end":"middle";return W`
                <line class="grid faint" x1=${a(t)} y1=${10} x2=${a(t)} y2=${138} />
                <text class="tick" x=${a(t)} y=${152} text-anchor=${s}>${e.toString().padStart(2,"0")}:00</text>
              `})}
          `}
        </svg>
      </div>
    `}_interpAt(e,t){if(0===e.length)return null;const s=t.getTime();if(s<=e[0].t.getTime())return e[0];if(s>=e[e.length-1].t.getTime())return e[e.length-1];for(let i=1;i<e.length;i++)if(e[i].t.getTime()>=s){const o=e[i-1],n=e[i],r=(s-o.t.getTime())/(n.t.getTime()-o.t.getTime());return{t:t,elevation:o.elevation+(n.elevation-o.elevation)*r,azimuth:o.azimuth+(n.azimuth-o.azimuth)*r}}return e[e.length-1]}};function Rs(e,t){if(!0===e?.custom_position_minimum_mode&&Array.isArray(e.custom_position_slots)&&void 0!==e.custom_position_active_slot){const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);if(void 0!==t&&null!==t.position&&void 0!==t.position)return t.position}return t}function js(e){if(void 0===e?.custom_position_active_slot||!Array.isArray(e.custom_position_slots))return!1;const t=e.custom_position_slots.find(t=>t.slot===e.custom_position_active_slot);return 100===t?.priority}function Ds(e){const t=e.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();if(/^custom_position_\d+$/.test(t))return"custom_position";switch(t){case"force_override":return"force";case"weather_override":return"weather";case"manual_override":return"manual";case"motion_timeout":return"motion";case"cloud_suppression":return"cloud";default:return t}}function Bs(e,t,s,i=Oe,o="Safety"){const n=new Map;for(const t of e){if(!t.matched)continue;const e=Ds(t.handler);ze.includes(e)&&n.set(e,t)}const r=[...ze].reverse().filter(e=>n.has(e));return 0===r.length?t.reason??"":r.map(e=>function(e,t,s,i,o){const n=i[e]??e,r=t.position,a=null==r?"":` ${Ye(r)}`;if("custom_position"!==e)return`${n}${a}`.trimEnd();return`${s.custom_position_active_slot_name?`${n} · ${s.custom_position_active_slot_name}`:s.custom_position_active_slot?`${n} #${s.custom_position_active_slot}`:n}${a}${!0===s.custom_position_minimum_mode?" floor":""}${js(s)?` · ${o}`:""}`}(e,n.get(e),t,i,o)).join(" → ")}Fs.styles=r`
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
  `,e([ge({attribute:!1})],Fs.prototype,"hass",void 0),e([ge({attribute:!1})],Fs.prototype,"discoveredList",void 0),e([ge({attribute:!1})],Fs.prototype,"coverColors",void 0),e([ge({type:Boolean,reflect:!0})],Fs.prototype,"compact",void 0),Fs=e([he("acp-elevation-chart")],Fs);let Ks=class extends ce{constructor(){super(...arguments),this.compact=!1,this.showSummary=!0,this._tick=null,this.hideInactive=!1}disconnectedCallback(){super.disconnectedCallback(),this._syncTimer(!1)}updated(){const e=Boolean(this.hass&&this.discovered&&this._throttleNextAllowedIso());this._syncTimer(e)}_syncTimer(e){e&&null===this._tick?this._tick=setInterval(()=>this.requestUpdate(),1e3):e||null===this._tick||(clearInterval(this._tick),this._tick=null)}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=this.discovered?.entities;return me(t,this.hass,[s?.decision_trace_sensor,s?.last_skipped_sensor])}_throttleNextAllowedIso(){const e=this.discovered.entities.last_skipped_sensor;if(!e)return null;const t=this.hass.states[e];if(!t||"time_delta_too_small"!==t.state)return null;const s=t.attributes,i=function(e,t){if(!e)return null;if(null==t||Number.isNaN(t))return null;const s=new Date(e).getTime();return Number.isNaN(s)?null:new Date(s+6e4*t).toISOString()}(s?.timestamp,s?.time_threshold_minutes);return i?new Date(i).getTime()<=Date.now()?null:i:null}_trace(){const e=this.discovered.entities.decision_trace_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const s=t.attributes;if(!s?.trace)return null;const i=new Map;for(const e of s.trace)i.set(Ds(e.handler),{matched:e.matched,reason:e.reason,position:e.position,held_position:e.held_position});const o={};for(const[e,t]of Object.entries(Me))o[e]=He(t,this.hass);return{winner:t.state,reason:s.reason??"",steps:i,enabledHandlers:s.enabled_handlers,summary:Bs(s.trace,s,t.state,o),inTimeWindow:s.in_time_window}}render(){if(!this.hass||!this.discovered)return q;const e=this._trace();if(!e)return U`<div class="placeholder">${He("decision.placeholder",this.hass)}</div>`;const t=this._throttleNextAllowedIso(),s=function(e){if(!e)return new Set;const t=new Set(e);return new Set(ze.filter(e=>!t.has(e)))}(e.enabledHandlers),i=function(e,t,s,i,o=new Set){return e.filter(e=>e===s||!o.has(e)&&(!i||!0===t.get(e)?.matched))}(ze,e.steps,e.winner,this.hideInactive,s);return U`
      <div class="wrap">
        <div class="head">
          <span class="label">${He("decision.pipeline",this.hass)}</span>
          <span class="winner">${He("decision.winner",this.hass,{name:e.winner})}</span>
        </div>
        ${!1===e.inTimeWindow?U`<div
              class="off-schedule"
              ${Tt(He("decision.outside_schedule_tooltip",this.hass))}
            >
              ${He("decision.outside_schedule",this.hass)}
            </div>`:q}
        ${t?U`<div class="throttle-countdown">
              <ha-icon icon="mdi:timer-sand"></ha-icon>
              <span
                >${He("decision.next_change_in",this.hass,{time:Je(t,this.hass)})}</span
              >
            </div>`:q}
        ${this.showSummary&&e.summary?U`<div class="summary" ${Tt(He("decision.summary_tooltip",this.hass))}>
              ${e.summary}
            </div>`:q}
        <div class="rows">
          ${i.map(t=>this._row(t,e.steps.get(t),e.winner===t))}
        </div>
        <div class="reason dim">${e.reason}</div>
      </div>
    `}_row(e,t,s){const i=t?.matched??!1,o=t?.reason??He("decision.not_evaluated",this.hass),n=t?.position,r=t?.held_position,a=null!=r,l=a?Ye(r):null!=n?Ye(n):"",c=a&&null!=n?U` · ${He("decision.solar_would_be",this.hass,{pct:Ye(n)})}`:q;return U`
      <div class="row ${s?"winner":i?"match":"skip"}">
        <span class="name">${He(Me[e],this.hass)}</span>
        <span class="dots" aria-hidden="true">${i?"████":"────"}</span>
        <span class="pos">${l}</span>
        <span class="reason-inline dim">${o}${c}</span>
        ${s?U`<span class="badge">✓</span>`:q}
      </div>
    `}};var Gs,Ls;Ks.styles=r`
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
  `,e([ge({attribute:!1})],Ks.prototype,"hass",void 0),e([ge({attribute:!1})],Ks.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Ks.prototype,"compact",void 0),e([ge({type:Boolean,reflect:!0,attribute:"show-summary"})],Ks.prototype,"showSummary",void 0),e([ge({type:Boolean,reflect:!0,attribute:"hide-inactive"})],Ks.prototype,"hideInactive",void 0),Ks=e([he("acp-decision-strip")],Ks),function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Gs||(Gs={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ls||(Ls={}));const Us=["closed","locked","off"],Ws=(e,t,s,i)=>{i=i||{},s=null==s?{}:s;const o=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return o.detail=s,e.dispatchEvent(o),o},Vs=e=>{Ws(window,"haptic",e)};function qs(e){return void 0!==e&&"none"!==e.action}function Hs(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Ys(e){const t=e.discovery?.axes;if(Array.isArray(t))return t.filter(e=>!!e&&"string"==typeof e.id&&!1!==e.supported).map(e=>({id:e.id,label:e.label??Hs(e.id),min:"number"==typeof e.min?e.min:0,max:"number"==typeof e.max?e.max:100,unit:"string"==typeof e.unit?e.unit:"%",stateAttr:"string"==typeof e.state_attr?e.state_attr:void 0,targetRole:Ge[e.id]}));const s=[{id:"position",label:Hs("position"),min:0,max:100,unit:"%",stateAttr:"current_position",targetRole:"target_position_sensor"}];return e.entities.target_tilt_sensor&&s.push({id:"tilt",label:Hs("tilt"),min:0,max:100,unit:"%",stateAttr:"current_tilt_position",targetRole:"target_tilt_sensor"}),s}function Qs(e,t,s){return e.callService("select","select_option",{option:s},{entity_id:t})}function Zs(e,t,s){return e.callService("switch",s?"turn_on":"turn_off",{},{entity_id:t})}const Xs={position:"set_position",tilt:"set_tilt"};function Js(e,t,s,i){if(function(e){const t=e.services;return!!t?.[Ee]?.set_axes}(e)){const i={axes:s};return void e.callService(Ee,"set_axes",i,{entity_id:t})}for(const[i,o]of Object.entries(s)){const s=Xs[i];s&&e.callService(Ee,s,{[i]:o},{entity_id:t})}}const ei=3;const ti=[15,30,60,120];let si=class extends ce{constructor(){super(...arguments),this.open=!1,this.presets=[],this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-extend-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}updated(e){e.has("open")&&this.open&&(this._endMs=void 0)}render(){if(!this.open)return q;const e=this._t("dialog.extend.title","Extend manual override");return U`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="title">${e}</div>

          ${this.presets.length>0?U`<div class="section">
                <div class="label">${this._t("dialog.extend.presets_label","Until")}</div>
                <div class="chips">
                  ${this.presets.map(e=>U`<button
                        class="preset"
                        type="button"
                        @click=${()=>this._pick(Date.parse(e.t))}
                      >
                        ${this._presetLabel(e)} · ${Xe(e.t)}
                      </button>`)}
                </div>
              </div>`:q}

          <div class="section">
            <div class="label">${this._t("dialog.extend.relative_label","Add time")}</div>
            <div class="chips">
              ${ti.map(e=>U`<button
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
    `}_t(e,t){if(!this.hass)return t;const s=He(e,this.hass);return s===e?t:s}_presetLabel(e){const t=`forecast.event.${e.kind}`,s=this.hass?He(t,this.hass):t;return s===t?e.label??e.kind:s}_previewText(){if(void 0===this._endMs)return"";const e=new Date(this._endMs).toISOString(),t=Xe(e),s=new Date(this._endMs).getDate()!==(new Date).getDate()?this._t("dialog.extend.tomorrow_suffix"," (tomorrow)"):"";return`${this._t("dialog.extend.preview","Override until {time}").replace("{time}",`${t}${s}`)} · ${Je(e,this.hass)}`}_pick(e){this._endMs=e}_addRelative(e){const t=this._endMs??this.currentEndMs??Date.now();this._endMs=t+6e4*e}_onTimeChange(e){const t=e.target.value;if(!t)return;const[s,i]=t.split(":").map(Number);if(Number.isNaN(s)||Number.isNaN(i))return;const o=new Date,n=new Date(o);n.setHours(s,i,0,0),n.getTime()<=o.getTime()&&n.setDate(n.getDate()+1),this._endMs=n.getTime()}_onConfirm(){void 0!==this._endMs&&this.dispatchEvent(new CustomEvent("acp-extend-confirm",{detail:{endMs:this._endMs},bubbles:!0,composed:!0}))}};function ii(e,t,s){return e.filter(e=>"off"===e||"group"===e||("solar"===e?function(e){return e.solarMatched&&!e.cloudIsWinner}(s)&&!1!==t?.solar:!1!==t?.[e]))}function oi(e){return!!e&&e.some(e=>e.matched&&"solar"===Ds(e.handler))}function ni(e){const t=new Set;if(!e)return t;for(const s of e){if(!s.matched)continue;const e=Ds(s.handler);ze.includes(e)&&t.add(e)}return t}function ri(e){return"cloud"===Ds(e)}function ai(e){if(!1===e.integrationEnabled)return"off";const t=Ds(e.winner);return e.manualActive&&"force"!==t&&"custom_position"!==t?"manual":Re[t]??"auto"}function li(e,t){return{solarMatched:oi(e),cloudIsWinner:ri(t)}}si.styles=r`
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
  `,e([ge({attribute:!1})],si.prototype,"hass",void 0),e([ge({type:Boolean})],si.prototype,"open",void 0),e([ge({attribute:!1})],si.prototype,"presets",void 0),e([ge({type:Number,attribute:!1})],si.prototype,"currentEndMs",void 0),e([_e()],si.prototype,"_endMs",void 0),si=e([he("acp-extend-override-dialog")],si);let ci=class extends ce{constructor(){super(...arguments),this.winner="default",this.compact=!1,this.integrationEnabled=!0,this.manualActive=!1,this.safetyActive=!1,this.resumable=!1,this.extendable=!1}render(){const e=this._kind(),t="custom_position"===e&&this.safetyActive,s=t?je.force:je[e],i=this.hass?He(De[e],this.hass):je[e].label,o=t?this.hass?He("badge.safety",this.hass):"Safety":this._label(e,i),n=t?Be.force:Be[e];if(this.extendable){const t=this.hass?He("tile.extend_aria",this.hass):"Extend manual override",i=this.hass?He("tile.resume_aria",this.hass):"Resume automatic control",r=!!n&&!this.compact;return U`<span
        class="badge kind-${e} has-actions"
        style="background:${s.bg};color:${s.fg};"
        part="badge"
      >
        ${r?U`<ha-icon class="badge-icon" icon=${n}></ha-icon>`:q}
        <span class="badge-label">${o}</span>
        <button
          class="act extend"
          type="button"
          ${Tt(t)}
          aria-label=${t}
          @click=${this._onExtendClick}
          @pointerdown=${this._stop}
        >
          <ha-icon icon="mdi:clock-plus-outline"></ha-icon>
        </button>
        ${this.resumable?U`<button
              class="act resume"
              type="button"
              ${Tt(i)}
              aria-label=${i}
              @click=${this._onResumeClick}
              @pointerdown=${this._stop}
            >
              <ha-icon icon="mdi:restore"></ha-icon>
            </button>`:q}
      </span>`}const r=U`${n?U`<ha-icon class="badge-icon" icon=${n}></ha-icon>`:q}${o}${this.resumable?U`<ha-icon class="resume-icon" icon="mdi:restore"></ha-icon>`:q}`;if(this.resumable){const t=this.hass?He("tile.resume_aria",this.hass):"Resume automatic control";return U`<button
        class="badge kind-${e} resumable"
        style="background:${s.bg};color:${s.fg};"
        part="badge"
        type="button"
        ${Tt(t)}
        aria-label=${t}
        @click=${this._onResumeClick}
        @pointerdown=${this._stop}
      >
        ${r}
      </button>`}return U`<span
      class="badge kind-${e}"
      style="background:${s.bg};color:${s.fg};"
      part="badge"
      >${r}</span
    >`}_stop(e){e.stopPropagation()}_onResumeClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-resume",{bubbles:!0,composed:!0}))}_onExtendClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("acp-extend",{bubbles:!0,composed:!0}))}_kind(){return this.kindOverride??ai({winner:this.winner,integrationEnabled:this.integrationEnabled,manualActive:this.manualActive})}_label(e,t){return"manual"===e?this.manualEndIso?Xe(this.manualEndIso):t:"custom_position"===e?`${this.slotName?this.slotName:void 0!==this.slotNumber?`${t} #${this.slotNumber}`:t}${void 0!==this.pct&&null!==this.pct?` · ${Math.round(this.pct)}%`:""}${!0===this.minimumMode?this.hass?He("badge.floor_suffix",this.hass):" ↥":""}`:"group"===e?void 0===this.groupCount||void 0===this.groupTotal?t:`${this.groupCount}/${this.groupTotal}`:t}};ci.styles=r`
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
  `,e([ge({attribute:!1})],ci.prototype,"hass",void 0),e([ge()],ci.prototype,"winner",void 0),e([ge({attribute:"manual-end-iso"})],ci.prototype,"manualEndIso",void 0),e([ge({type:Number,attribute:"slot-number"})],ci.prototype,"slotNumber",void 0),e([ge({attribute:"slot-name"})],ci.prototype,"slotName",void 0),e([ge({type:Number})],ci.prototype,"pct",void 0),e([ge({type:Boolean,attribute:"minimum-mode"})],ci.prototype,"minimumMode",void 0),e([ge({type:Boolean,reflect:!0})],ci.prototype,"compact",void 0),e([ge({type:Boolean,attribute:"integration-enabled"})],ci.prototype,"integrationEnabled",void 0),e([ge({type:Boolean,attribute:"manual-active"})],ci.prototype,"manualActive",void 0),e([ge({type:Boolean,attribute:"safety-active"})],ci.prototype,"safetyActive",void 0),e([ge({attribute:"kind-override"})],ci.prototype,"kindOverride",void 0),e([ge({type:Number,attribute:"group-count"})],ci.prototype,"groupCount",void 0),e([ge({type:Number,attribute:"group-total"})],ci.prototype,"groupTotal",void 0),e([ge({type:Boolean,reflect:!0})],ci.prototype,"resumable",void 0),e([ge({type:Boolean,reflect:!0})],ci.prototype,"extendable",void 0),ci=e([he("acp-tile-badge")],ci);let di=class extends ce{constructor(){super(...arguments),this.actual=null,this.target=null,this.coverColor=null,this.compact=!1,this.disabled=!1,this.layout="cover",this.label=null,this.min=0,this.max=100,this.unit="%"}_frac(e){const t=e??this.min,s=this.max-this.min;if(0===s)return 0;const i=(t-this.min)/s*100;return Math.max(0,Math.min(100,i))}render(){if(!this.hass)return q;const e=this._frac(this.actual),t=this._frac(this.target),s=this.label??He("covers.tilt_title",this.hass);return U`
      <div
        class="row ${this.layout}"
        style=${this.coverColor?`--acp-cover-color:${this.coverColor}`:q}
      >
        <span class="label">${s}</span>
        <span class="num">${Ye(this.actual)}</span>
        <div
          class="track ${this.disabled?"disabled":""}"
          @click=${this._onClick}
          ${Tt(He("covers.tilt_click_to_set",this.hass))}
        >
          <div class="fill" style="width:${e}%"></div>
          <div class="fill-closed" style="width:${100-e}%"></div>
          ${null!==this.target?U`<div
                class="marker"
                style="left:clamp(1px, ${t}%, calc(100% - 1px))"
                ${Tt(He("covers.tilt_target_tooltip",this.hass,{pct:t}))}
              ></div>`:q}
        </div>
      </div>
    `}_onClick(e){if(this.disabled)return;const t=e.currentTarget.getBoundingClientRect(),s=(e.clientX-t.left)/t.width,i=this.min+s*(this.max-this.min),o=Math.max(this.min,Math.min(this.max,Math.round(i)));this.dispatchEvent(new CustomEvent("acp-tilt-set",{detail:o,bubbles:!0,composed:!0}))}};di.styles=r`
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
    /* Unavailable cover (issue #212): non-interactive track — no click-to-set,
       matching the up/stop/down controls disabled elsewhere on the tile. */
    .track.disabled {
      cursor: default;
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
  `,e([ge({attribute:!1})],di.prototype,"hass",void 0),e([ge({attribute:!1})],di.prototype,"actual",void 0),e([ge({attribute:!1})],di.prototype,"target",void 0),e([ge({attribute:!1})],di.prototype,"coverColor",void 0),e([ge({type:Boolean,reflect:!0})],di.prototype,"compact",void 0),e([ge({type:Boolean,reflect:!0})],di.prototype,"disabled",void 0),e([ge({reflect:!0})],di.prototype,"layout",void 0),e([ge({attribute:!1})],di.prototype,"label",void 0),e([ge({type:Number})],di.prototype,"min",void 0),e([ge({type:Number})],di.prototype,"max",void 0),e([ge()],di.prototype,"unit",void 0),di=e([he("acp-axis-bar")],di),customElements.get("acp-tilt-bar")||customElements.define("acp-tilt-bar",class extends di{});const hi=["auto","all_open","all_closed","privacy"],ui=["open","closed","mixed","unknown"];let pi=class extends ce{render(){if(!this.hass||!this.discovered)return q;const e=this.discovered.entities,t=e.group_position_sensor?this.hass.states[e.group_position_sensor]:void 0,s=t?parseFloat(t.state):NaN,i=t?.attributes?.member_positions??{},o=Object.keys(i).length,n=e.group_who_won_sensor?this.hass.states[e.group_who_won_sensor]:void 0,r=n?parseInt(n.state,10):NaN,a=this._aggregateStateLabel(),l=this._currentScene(),c=this._locked();return U`
      <div class="group-tile">
        <div class="head">
          <div class="title">${this.discovered.entry_title}</div>
          ${Number.isNaN(r)?q:U`<acp-tile-badge
                .hass=${this.hass}
                kind-override="group"
                .groupCount=${r}
                .groupTotal=${o}
              ></acp-tile-badge>`}
        </div>
        <div class="readout">
          <span class="group-state">${a}</span>
          <span class="group-position"
            >${Ye(Number.isNaN(s)?null:s)}</span
          >
        </div>
        <div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
          <select
            class="scene-select"
            aria-label=${He("group.scene",this.hass)}
            @change=${this._onSceneChange}
          >
            ${hi.map(e=>U`<option value=${e} ?selected=${e===l}>
                  ${He(`group.scene_${e}`,this.hass)}
                </option>`)}
          </select>
          <button
            class="lock-toggle ${c?"locked":""}"
            type="button"
            aria-pressed=${c?"true":"false"}
            aria-label=${He(c?"group.unlock":"group.lock",this.hass)}
            ${Tt(He(c?"group.unlock":"group.lock",this.hass))}
            @click=${()=>this._toggleLock(c)}
          >
            <ha-icon icon=${c?"mdi:lock":"mdi:lock-open-variant"}></ha-icon>
          </button>
        </div>
      </div>
    `}_aggregateStateLabel(){const e=this.discovered.entities.group_state_sensor,t=e?this.hass.states[e]?.state??"unknown":"unknown";return He(`group.state_${ui.includes(t)?t:"unknown"}`,this.hass)}_currentScene(){const e=this.discovered.entities.group_scene_select;if(!e)return"auto";const t=this.hass.states[e],s=t?.attributes?.current_option??t?.state??"auto";return hi.includes(s)?s:"auto"}_locked(){const e=this.discovered.entities.group_lock_switch;return!!e&&"on"===this.hass.states[e]?.state}_onSceneChange(e){const t=e.target.value,s=this.discovered.entities.group_scene_select;s&&Qs(this.hass,s,t)}_toggleLock(e){const t=this.discovered.entities.group_lock_switch;t&&Zs(this.hass,t,!e)}_stop(e){e.stopPropagation()}};function gi(e){if("number"==typeof e.lu)return 1e3*e.lu;if("number"==typeof e.lc)return 1e3*e.lc;const t=e.last_updated??e.last_changed;if("string"==typeof t){const e=Date.parse(t);if(!Number.isNaN(e))return e}return null}function _i(e){const t=e.a??e.attributes,s=t?.current_position;return"number"!=typeof s||Number.isNaN(s)?null:s}function mi(e){const t=[];let s=null;for(const i of e){const e=gi(i),o=_i(i);null!==o&&(s=o),null!==e&&null!==s&&t.push({t:e,position:s})}return t}pi.styles=r`
    :host {
      display: block;
    }
    .group-tile {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 6px 4px;
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }
    .title {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .readout {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 0.85rem;
      color: var(--primary-text-color);
    }
    .group-state {
      color: var(--secondary-text-color);
      text-transform: capitalize;
    }
    .group-position {
      font-variant-numeric: tabular-nums;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 8px;
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
    .lock-toggle {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 36px;
      border: none;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .lock-toggle.locked {
      background: rgba(63, 81, 181, 0.2);
      color: #283593;
    }
    .lock-toggle:hover {
      filter: brightness(0.95);
    }
    .lock-toggle ha-icon {
      --mdc-icon-size: 20px;
    }
  `,e([ge({attribute:!1})],pi.prototype,"hass",void 0),e([ge({attribute:!1})],pi.prototype,"discovered",void 0),pi=e([he("acp-group-tile")],pi);let fi=class extends ce{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0,this._tick=null}disconnectedCallback(){super.disconnectedCallback(),this._syncTimer(!1)}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=this.discovered?.entities;return me(t,this.hass,[s?.manual_override_binary,s?.manual_override_end_sensor,s?.motion_status_sensor,s?.reset_override_button])}updated(){if(!this.hass||!this.discovered)return void this._syncTimer(!1);const e=!this.compact&&(null!==this._manualEndIso()||null!=this._motionStatus()?.endIso);this._syncTimer(e)}_syncTimer(e){e&&null===this._tick?this._tick=setInterval(()=>this.requestUpdate(),1e3):e||null===this._tick||(clearInterval(this._tick),this._tick=null)}_manualActive(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualEndIso(){const e=this.discovered.entities.manual_override_end_sensor;if(!e)return null;const t=this.hass.states[e];return t&&"unknown"!==t.state&&"unavailable"!==t.state?t.state:null}_motionStatus(){const e=this.discovered.entities.motion_status_sensor;if(!e)return null;const t=this.hass.states[e];if(!t)return null;const s=t.attributes.motion_timeout_end_time;return{state:t.state,endIso:s??null}}_resetManual(){const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})}_motionStateLabel(e,t){if(e){const t=this.hass.states[e],s=this.hass.formatEntityState;if(t&&"function"==typeof s){const e=s(t);if(e)return e}}return t.replace(/_/g," ")}render(){if(!this.hass||!this.discovered)return q;const e=this._manualActive(),t=this._manualEndIso(),s=this._motionStatus(),i=this.discovered.entities.motion_status_sensor,o=this.discovered.entities.reset_override_button,n=He("overrides.reset_manual",this.hass);return U`
      <div class="wrap">
        <div class="label dim">${He("overrides.title",this.hass)}</div>
        <div class="grid">
          <div class="tile ${e?"active":""}">
            <div class="tile-label">${He("overrides.manual",this.hass)}</div>
            <div class="tile-value">
              ${He(e?"overrides.active":"overrides.off",this.hass)}
            </div>
            ${t?U`<div class="tile-sub dim">
                  ${He("overrides.ends_in",this.hass,{time:Je(t,this.hass)})}
                </div>`:q}
          </div>

          ${s?U`<div class="tile ${"motion_detected"===s.state?"active":""}">
                <div class="tile-label">${He("overrides.motion",this.hass)}</div>
                <div class="tile-value">${this._motionStateLabel(i,s.state)}</div>
                ${s.endIso?U`<div class="tile-sub dim">
                      ${He("overrides.timeout",this.hass,{time:Je(s.endIso,this.hass)})}
                    </div>`:q}
              </div>`:q}
          ${o?this.resetEnabled?U`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${n}</div>
                </button>`:U`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">${n}</div>
                </button>`:q}
        </div>
      </div>
    `}};fi.styles=r`
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
  `,e([ge({attribute:!1})],fi.prototype,"hass",void 0),e([ge({attribute:!1})],fi.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],fi.prototype,"compact",void 0),e([ge({type:Boolean,attribute:"reset-enabled"})],fi.prototype,"resetEnabled",void 0),fi=e([he("acp-overrides-panel")],fi);const vi=new Set(["mode_off","active"]),bi={summer_mode:"mdi:weather-sunny",winter_mode:"mdi:snowflake",intermediate:"mdi:weather-partly-cloudy"};let yi=class extends ce{constructor(){super(...arguments),this.compact=!1}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=this.discovered?.entities;return me(t,this.hass,[s?.climate_status_sensor,s?.climate_mode_switch])}render(){if(!this.hass||!this.discovered)return q;const e=this.discovered.entities.climate_status_sensor;if(!e)return q;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return q;if("unknown"===t.state||""===t.state){const e=this.discovered.entities.climate_mode_switch,s=!!e&&"off"===this.hass.states[e]?.state,i=He(s?"climate.mode_off":"climate.standby",this.hass),o=s?"mdi:power-off":"mdi:thermostat",n=t.attributes?.inactive_reason;return this._renderStandby(o,i,n)}const s=t.state,i=t.attributes??{},o=bi[s]??"mdi:thermostat",n=this.hass.formatEntityState,r="function"==typeof n?n(t)??s:s,a=i.temperature_unit??"°",l=!0===i.temp_switch,c=(e,t)=>null==t||Number.isNaN(t)?null:`${He(e,this.hass)} ${t.toFixed(1)}${a}`,d=l?null:[c("climate.threshold_low",i.temp_low),c("climate.threshold_high",i.temp_high)].filter(e=>null!==e).join(" ")||null,h=[...l?[c("climate.threshold_low",i.temp_low),c("climate.threshold_high",i.temp_high)]:[],c("climate.threshold_summer_outside",i.temp_summer_outside)].filter(e=>null!==e).join(" ")||null,u=[void 0!==i.indoor_temperature?{label:He("climate.indoor",this.hass),value:i.indoor_temperature,unit:a,threshold:d}:null,void 0!==i.outdoor_temperature?{label:He("climate.outdoor",this.hass),value:i.outdoor_temperature,unit:a,threshold:h}:null].filter(e=>null!==e);if(null!=(p=i.inactive_reason)&&"active"!==p)return this._renderStandby(o,r,i.inactive_reason,u);var p;const g=void 0!==i.active_temperature?`${i.active_temperature.toFixed(1)}${a}`:"—",_=[{label:He("climate.presence",this.hass),value:i.is_presence,icon:"mdi:account-check"},{label:He("climate.sunny",this.hass),value:i.is_sunny,icon:"mdi:white-balance-sunny"},{label:He("climate.lux",this.hass),value:i.lux_active,icon:"mdi:brightness-7"},{label:He("climate.irradiance",this.hass),value:i.irradiance_active,icon:"mdi:solar-power"}].filter(e=>void 0!==e.value);return U`
      <div class="wrap">
        <div class="head">
          <span class="label">${He("climate.title",this.hass)}</span>
          <span class="dim">${He("climate.active",this.hass,{strategy:g})}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${o}></ha-icon>
          <span class="strategy-name">${r}</span>
        </div>
        ${this._renderTemps(u)}
        ${_.length?U`
              <div class="conditions">
                ${_.map(e=>U`
                    <div class="chip ${e.value?"on":"off"}" ${Tt(e.label)}>
                      <ha-icon icon=${e.icon}></ha-icon>
                      <span>${e.label}</span>
                    </div>
                  `)}
              </div>
            `:q}
      </div>
    `}_renderStandby(e,t,s,i=[]){const o=s&&!vi.has(s)?He(`climate.reason.${s}`,this.hass):void 0;return U`
      <div class="wrap">
        <div class="head">
          <span class="label">${He("climate.title",this.hass)}</span>
        </div>
        <div class="strategy standby">
          <ha-icon icon=${e}></ha-icon>
          <span class="strategy-name dim">${t}</span>
        </div>
        ${o?U`<div class="standby-reason dim">${o}</div>`:q}
        ${this._renderTemps(i)}
      </div>
    `}_renderTemps(e){return e.length?U`
      <div class="temps">
        ${e.map(e=>U`
            <div class="temp">
              <span class="temp-label dim">${e.label}</span>
              <span class="temp-value">${e.value.toFixed(1)}${e.unit}</span>
              ${e.threshold?U`<span class="temp-threshold dim">${e.threshold}</span>`:q}
            </div>
          `)}
      </div>
    `:q}};yi.styles=r`
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
  `,e([ge({attribute:!1})],yi.prototype,"hass",void 0),e([ge({attribute:!1})],yi.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],yi.prototype,"compact",void 0),yi=e([he("acp-climate-panel")],yi);let wi=class extends ce{constructor(){super(...arguments),this.compact=!1,this.coverColor=null,this._openMoreInfo=()=>{this.dispatchEvent(new CustomEvent("acp-open-more-info",{bubbles:!0,composed:!0}))},this._onNameKeydown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openMoreInfo())}}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=this.discovered?.entities,i=this.discovered?Ys(this.discovered).map(e=>e.targetRole?s?.[e.targetRole]:void 0).filter(e=>!!e):[];return me(t,this.hass,[...i,s?.position_mismatch_binary,s?.manual_override_binary,...this.discovered?.managed_covers??[]])}_target(){const e=this.discovered.entities.target_position_sensor;if(!e)return{target:null,covers:{}};const t=this.hass.states[e];if(!t)return{target:null,covers:{}};const s=t.attributes;return{target:as(this.hass,this.discovered),covers:s?.actual_positions??{}}}_transit(){const e=this.discovered.entities.target_position_sensor;if(!e)return{};const t=this.hass.states[e];if(!t)return{};const s=t.attributes;return s?.transit_states??{}}_mismatched(){const e=this.discovered.entities.position_mismatch_binary;if(!e)return new Set;const t=this.hass.states[e];if("on"!==t?.state)return new Set;const s=t.attributes.entities;return s?new Set(Object.entries(s).filter(([,e])=>e.mismatch).map(([e])=>e)):new Set}_setAxis(e,t,s){Js(this.hass,e,{[t]:s})}_axisTarget(e){const t=e.targetRole;if(!t)return null;const s=this.discovered.entities[t];if(!s)return null;const i=parseFloat(this.hass.states[s]?.state??"");return Number.isNaN(i)?null:i}_axisActual(e,t){if(!e.stateAttr)return null;const s=this.hass.states[t]?.attributes?.[e.stateAttr];return"number"==typeof s?s:null}_motorDivergence(){return function(e,t){const s=ss(e,t),i=ts(e,t);return null===s||null===i||s===i?null:i}(this.hass,this.discovered)}_axisLabel(e){const t=Le[e.id];return t?He(t,this.hass):e.label}_axisTargetLabel(e,t){return"tilt"===e.id?He("covers.tilt_target",this.hass,{pct:Ye(t)}):`${this._axisLabel(e)}: ${Ye(t)}`}render(){if(!this.hass||!this.discovered)return q;const{target:e,covers:t}=this._target(),s=this._mismatched(),i=(a=this.hass,l=this.discovered,null!==At(rs(a,l),os(a,l),is(a,l))),o=this._motorDivergence(),n=this._transit(),r=Object.entries(t);var a,l;if(0===r.length)return U`<div class="placeholder">${He("covers.placeholder",this.hass)}</div>`;const c=Ys(this.discovered).filter(e=>"position"!==e.id),d=new Map(c.map(e=>[e.id,this._axisTarget(e)]));return U`
      <div class="wrap" style=${this.coverColor?`--acp-cover-color:${this.coverColor}`:q}>
        <div class="head">
          <span class="label">${He("covers.title",this.hass)}</span>
          <span class="targets">
            <span
              class="target"
              ${null!==o?Tt(He("covers.target_tooltip_motor",this.hass,{pct:o})):q}
              >${He(i?"covers.target_solar":"covers.target",this.hass,{pct:Ye(e)})}</span
            >
            ${c.map(e=>U`<span class="target"
                  >${this._axisTargetLabel(e,d.get(e.id)??null)}</span
                >`)}
          </span>
        </div>
        ${r.map(([t,o])=>U`
            <div class="cover-group">
              ${this._bar(t,o,e,s.has(t),i,n[t]??null)}
              ${c.map(e=>U`<acp-tilt-bar
                    .hass=${this.hass}
                    .label=${this._axisLabel(e)}
                    .min=${e.min}
                    .max=${e.max}
                    .unit=${e.unit}
                    .actual=${this._axisActual(e,t)}
                    .target=${d.get(e.id)??null}
                    .coverColor=${this.coverColor}
                    .compact=${this.compact}
                    @acp-tilt-set=${s=>this._setAxis(t,e.id,s.detail)}
                  ></acp-tilt-bar>`)}
            </div>
          `)}
      </div>
    `}_bar(e,t,s,i,o,n){const r=this.hass.states[e]?.attributes?.friendly_name??e,a=t??0,l=s??0;return U`
      <div class="cover ${i?"mismatch":""}">
        <div
          class="name"
          role="button"
          tabindex="0"
          @click=${this._openMoreInfo}
          @keydown=${this._onNameKeydown}
          ${Tt(e)}
        >
          ${r}
        </div>
        <div class="num">
          ${n?U`<ha-icon
                class="transit transit-${n}"
                icon=${"opening"===n?"mdi:arrow-up-thin":"mdi:arrow-down-thin"}
                ${Tt(He("covers."+n,this.hass))}
              ></ha-icon>`:q}${Ye(t)}
        </div>
        <div
          class="track"
          @click=${t=>this._handleTrackClick(t,e)}
          ${Tt(He("covers.click_to_set",this.hass))}
        >
          <div class="fill" style="width:${a}%"></div>
          <div class="fill-closed" style="width:${100-a}%"></div>
          ${null!==s?U`<div
                class="marker"
                style="left:clamp(1px, ${l}%, calc(100% - 1px))"
                ${Tt(He(o?"covers.target_tooltip_override":"covers.target_tooltip",this.hass,{pct:l}))}
              ></div>`:q}
        </div>
        ${i&&!o?U`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:q}
      </div>
    `}_handleTrackClick(e,t){const s=e.currentTarget.getBoundingClientRect(),i=Math.round((e.clientX-s.left)/s.width*100),o=Math.max(0,Math.min(100,i));this._setAxis(t,"position",o)}};var xi;wi.styles=r`
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
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 2px;
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
  `,e([ge({attribute:!1})],wi.prototype,"hass",void 0),e([ge({attribute:!1})],wi.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],wi.prototype,"compact",void 0),e([ge({attribute:!1})],wi.prototype,"coverColor",void 0),wi=e([he("acp-cover-bar")],wi);const $i=864e5;let ki=xi=class extends ce{constructor(){super(...arguments),this.samples=[],this.events=[],this.history=[],this.now=Date.now(),this._hoverIdx=null,this._onPointerMove=e=>{const t=e.currentTarget.getBoundingClientRect();if(t.width<=0)return;const s=(e.clientX-t.left)/t.width,i=Math.max(0,Math.min(1,s))*xi.VIEW_W;this._hoverIdx=this._nearestSampleIdx(i)},this._onPointerLeave=()=>{this._hoverIdx=null}}render(){const e=this.samples&&this.samples.length>0,t=this.history&&this.history.length>0;if(!e&&!t)return q;const{VIEW_W:s,VIEW_H:i,TOP_PAD:o,EVENT_HIT_W:n}=xi,r=i-o,a=ms(new Date(this.now)).getTime(),l=e=>bt(e,a,s),c=e=>yt(e,o,r),d=this.samples.map(e=>{const t=Date.parse(e.t);return{t:t,x:l(t),y:c(e.position),sample:e,inDay:!Number.isNaN(t)&&t>=a&&t<=a+$i}}),h=d.filter(e=>e.inDay).map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)}`).join(" "),u=(this.history??[]).map(e=>{const t=Date.parse(e.t),s=!Number.isNaN(t)&&t>=a&&t<=a+$i;return{t:t,x:l(t),y:c(e.position),position:e.position,inDay:s}}),p=u.filter(e=>e.inDay).map(e=>`${e.x.toFixed(1)},${e.y.toFixed(1)}`).join(" "),g=function(e){for(const t of e)for(const e of Object.keys(t))if(!Si.has(e)&&"number"==typeof t[e])return e;return null}(this.samples),_=[];if(null!==g){let e=[];for(const t of d){if(!t.inDay)continue;const s=t.sample[g];if("number"==typeof s){const i=yt(s,o,r);e.push(`${t.x.toFixed(1)},${i.toFixed(1)}`)}else e.length>0&&(_.push(e.join(" ")),e=[])}e.length>0&&_.push(e.join(" "))}const m=_.map(e=>W`<polyline class="curve-secondary" points=${e} fill="none"></polyline>`),f=(this.events??[]).map(e=>{const t=Date.parse(e.t);if(Number.isNaN(t)||t<a||t>a+$i)return null;const s=l(t),r=`evt-${e.kind}`,c=function(e,t){const s=`forecast.event.${e.kind}`,i=He(s,t),o=i===s?e.label??e.kind:i,n=Xe(e.t);return"—"===n?o:`${o} — ${n}`}(e,this.hass);return W`<g class="event-group" ${Tt(c)}>
          <line
            class="event-hit"
            x1=${s.toFixed(1)}
            x2=${s.toFixed(1)}
            y1=${o}
            y2=${i}
            stroke-width=${n}
          ></line>
          <line
            class="event-marker ${r}"
            x1=${s.toFixed(1)}
            x2=${s.toFixed(1)}
            y1=${o}
            y2=${i}
          ></line>
        </g>`}).filter(e=>null!==e),v=null!==this._hoverIdx&&this._hoverIdx>=0&&this._hoverIdx<d.length?d[this._hoverIdx]:null,b=v?W`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${v.x.toFixed(1)} x2=${v.x.toFixed(1)}
            y1=${o} y2=${i}></line>
          <circle class="hover-dot" cx=${v.x.toFixed(1)} cy=${v.y.toFixed(1)} r="3"></circle>
        </g>`:q,y=u.filter(e=>e.inDay),w=v&&y.length>0?function(e,t){let s=null,i=Number.POSITIVE_INFINITY;for(const o of e){const e=Math.abs(o.x-t);e<i&&(i=e,s=o)}return s}(y,v.x)?.position??null:null,x=v?U`<div class="hover-label" style=${`left: ${(v.x/s*100).toFixed(2)}%`}>
          ${function(e,t,s,i){const o=Xe(e.t),n=`${Math.round(Ai(e.position))}%`,r=e.handler?`${o} · ${n} · ${e.handler}`:`${o} · ${n}`;if(null===t)return r;const a=e[t];if("number"!=typeof a)return r;const l=function(e,t,s){const i=Ci[e];if(i)return He(i,t);const o=s?.[e];return o||e.charAt(0).toUpperCase()+e.slice(1)}(t,s,i);return`${r} · ${l}: ${`${Math.round(Ai(a))}%`}`}(v.sample,g,this.hass,this.axisLabels)}${null!==w?` · ${He("forecast.legend_actual",this.hass)} ${Math.round(Ai(w))}%`:""}
        </div>`:q,$=[0,6,12,18,24].map(e=>{const t=l(a+36e5*e);return W`
        <line class="grid faint" x1=${t} y1=${o} x2=${t} y2=${i-.5} />
        <text class="axis-label tick-time" x=${t} y=${i-3} text-anchor="middle">${e.toString().padStart(2,"0")}:00</text>
      `}),k=this.now,A=l(k),S=k>=a&&k<=a+$i?W`<g class="now-group" ${Tt(Xe(new Date(k).toISOString()))}>
          <line class="now-hit" x1=${A.toFixed(1)} y1=${o} x2=${A.toFixed(1)} y2=${i-.5}></line>
          <line class="now" x1=${A.toFixed(1)} y1=${o} x2=${A.toFixed(1)} y2=${i-.5}></line>
        </g>`:q;return U`
      <div class="wrap">
        <svg
          viewBox="0 0 ${s} ${i}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <line class="baseline" x1="0" y1=${i-.5} x2=${s} y2=${i-.5}></line>
          <text class="axis-label" x="4" y=${o+8} text-anchor="start">100%</text>
          ${$}
          <polyline class="curve" points=${h} fill="none"></polyline>
          ${p?W`<polyline class="actual-curve" points=${p} fill="none"></polyline>`:q}
          ${m} ${f} ${b} ${S}
        </svg>
        ${t?this._renderLegend():q} ${x}
      </div>
    `}_renderLegend(){return U`<div class="legend">
      <span class="legend-item"
        ><span class="swatch swatch-forecast"></span>${He("forecast.legend_forecast",this.hass)}</span
      >
      <span class="legend-item"
        ><span class="swatch swatch-actual"></span>${He("forecast.legend_actual",this.hass)}</span
      >
    </div>`}_nearestSampleIdx(e){const t=ms(new Date(this.now)).getTime();let s=-1,i=Number.POSITIVE_INFINITY;for(let o=0;o<this.samples.length;o++){const n=Date.parse(this.samples[o].t);if(Number.isNaN(n)||n<t||n>t+$i)continue;const r=bt(n,t,xi.VIEW_W),a=Math.abs(r-e);a<i&&(i=a,s=o)}return s>=0?s:null}};function Ai(e){return Number.isNaN(e)||e<0?0:e>100?100:e}ki.VIEW_W=600,ki.VIEW_H=80,ki.TOP_PAD=10,ki.EVENT_HIT_W=12,ki.styles=r`
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
    /* Recorded actual position: a solid contrasting line over the forecast so
       "predicted vs. reality" reads at a glance. Uses a distinct literal color
       (not --info-color, which collides with the blue --primary-color forecast
       in many themes); overridable via --acp-actual-color. */
    .actual-curve {
      stroke: var(--acp-actual-color, #e040fb);
      stroke-width: 1.75;
      vector-effect: non-scaling-stroke;
    }
    .legend {
      display: flex;
      gap: 12px;
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
      border-top: 2px solid currentColor;
    }
    .swatch-forecast {
      color: var(--primary-color);
    }
    .swatch-actual {
      color: var(--acp-actual-color, #e040fb);
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
  `,e([ge({attribute:!1})],ki.prototype,"hass",void 0),e([ge({attribute:!1})],ki.prototype,"samples",void 0),e([ge({attribute:!1})],ki.prototype,"events",void 0),e([ge({attribute:!1})],ki.prototype,"history",void 0),e([ge({attribute:!1})],ki.prototype,"now",void 0),e([ge({attribute:!1})],ki.prototype,"axisLabels",void 0),e([_e()],ki.prototype,"_hoverIdx",void 0),ki=xi=e([he("acp-forecast-strip")],ki);const Si=new Set(["t","position","handler"]),Ci={tilt:"covers.tilt_title"},Ei=["sol_elev_deg","gamma_deg"],zi=["position_pct"],Oi=new Set([...Ei,...zi,"status","cover_type","tilt"]),Mi={cover_blind:["effective_distance_m","adjusted_height_m","safety_margin"],cover_awning:["awn_angle_deg","vertical_position_m","length_m"],cover_tilt:["slat_angle_raw_deg","tilt_mode","max_degrees"]},Ii=new Set([...Ei,...zi,...Object.values(Mi).flat()]);function Ti(e,t){return null==t?"—":"boolean"==typeof t?t?"✓":"✗":Array.isArray(t)?t.length?t.join(", "):"—":"number"==typeof t?Number.isNaN(t)?"—":"position_pct"===e||e.endsWith("_pct")?`${Math.round(t)}%`:e.endsWith("_deg")?`${t.toFixed(1)}°`:e.endsWith("_m")?`${t.toFixed(3)} m`:e.endsWith("_rad")?`${t.toFixed(3)} rad`:t.toFixed(3):String(t)}function Ni(e,t,s){const i=[];for(const s of t)s in e&&i.push({key:s,value:Ti(s,e[s]),curated:Ii.has(s)});return i}function Pi(e,t,s){const i=Ni(e,Ei),o=Ni(e,zi);let n;if(s){const s=Mi[t]??[],i=Object.keys(e).filter(e=>!Oi.has(e)&&!s.includes(e));n=[...s.filter(t=>t in e),...i]}else n=(Mi[t]??[]).filter(t=>t in e);const r=Ni(e,n),a=e.position_pct;return{status:"string"==typeof e.status?e.status:void 0,hasTarget:"number"==typeof a&&!Number.isNaN(a),inputs:i,intermediates:r,output:o}}function Fi(e,t){const s="string"==typeof e.cover_type?e.cover_type:"",i=Pi(e,s,t);let o;if("cover_venetian"===s){const s=e.tilt;s&&"object"==typeof s&&(o=Pi(s,"cover_tilt",t))}return{coverType:s,position:i,tilt:o}}let Ri=class extends ce{constructor(){super(...arguments),this.compact=!1,this._showAll=!1,this._toggleShowAll=()=>{this._showAll=!this._showAll}}shouldUpdate(e){return e.size>1||!e.has("hass")||me(e.get("hass"),this.hass,[this.discovered?.entities.solar_calculation_sensor])}render(){if(!this.hass||!this.discovered)return q;const e=this.discovered.entities.solar_calculation_sensor;if(!e)return q;const t=this.hass.states[e];if(!t||"unavailable"===t.state)return q;const s=t.attributes,i=Fi(s,this._showAll),o=function(e){const t=Fi(e,!0),s=Fi(e,!1),i=e=>e.position.intermediates.length+(e.tilt?.intermediates.length??0);return Math.max(0,i(t)-i(s))}(s);return U`
      <div class="wrap">
        <div class="head">
          <span class="label">${He("solar.title",this.hass)}</span>
          ${this._statusChip(i.position.status)}
        </div>
        ${this._axis(i.position,i.tilt?He("solar.axis_position",this.hass):void 0)}
        ${i.tilt?this._axis(i.tilt,He("solar.axis_tilt",this.hass)):q}
        ${o>0?U`<button class="show-all" type="button" @click=${this._toggleShowAll}>
              ${this._showAll?He("solar.show_less",this.hass):He("solar.show_all",this.hass,{count:o})}
            </button>`:q}
      </div>
    `}_statusChip(e){if(!e)return q;const t=e.startsWith("Direct"),s=this._statusSlug(e),i="_unknown"===s?e:He(`solar.status.${s}`,this.hass);return U`<span class="status-chip ${t?"direct":"default"}">${i}</span>`}_statusSlug(e){return{"Direct Sun":"direct_sun","Default: FOV Exit":"fov_exit","Default: Elevation Limit":"elevation_limit","Default: Sunset Offset":"sunset_offset","Default: Blind Spot":"blind_spot",Default:"default"}[e]??"_unknown"}_axis(e,t){return U`
      <div class="axis">
        ${t?U`<div class="axis-title dim">${t}</div>`:q}
        ${this._group(He("solar.group_inputs",this.hass),e.inputs)}
        ${this._group(He("solar.group_intermediates",this.hass),e.intermediates)}
        ${e.hasTarget?this._group(He("solar.group_output",this.hass),e.output):U`<div class="no-target dim">
              ${He("solar.no_target",this.hass,{status:e.status??"—"})}
            </div>`}
      </div>
    `}_group(e,t){return 0===t.length?q:U`
      <div class="group">
        <div class="group-label dim">${e}</div>
        <div class="rows">
          ${t.map(e=>U`<div class="row">
                <span class="key ${e.curated?"":"raw"}"
                  >${e.curated?He(`solar.field.${e.key}`,this.hass):e.key}</span
                >
                <span class="value">${e.value}</span>
              </div>`)}
        </div>
      </div>
    `}};Ri.styles=r`
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
  `,e([ge({attribute:!1})],Ri.prototype,"hass",void 0),e([ge({attribute:!1})],Ri.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],Ri.prototype,"compact",void 0),e([_e()],Ri.prototype,"_showAll",void 0),Ri=e([he("acp-solar-calc")],Ri);let ji=class extends ce{constructor(){super(...arguments),this.open=!1,this.advancedOpen=!1,this.showCompass=!0,this.showElevationChart=!0,this.showSolarCalc=!0,this.stateColor=!0,this._cancelMinuteTimer=null,this._positionHistory=[],this._historyKey=null,this._listSource=null,this._list=[],this._onResume=()=>{const e=this.discovered.entities.reset_override_button;e&&this.hass.callService("button","press",{entity_id:e})},this._toggleAdvanced=()=>{this.advancedOpen=!this.advancedOpen},this._openDevicePage=()=>{const e=this.discovered.device_id;e&&this._navigate(`/config/devices/device/${e}`)},this._openIntegrationPage=()=>{this._navigate(`/config/integrations/integration/${Ee}`)},this._onBackdrop=e=>{e.target===e.currentTarget&&this._emitClose()},this._emitClose=()=>{this.dispatchEvent(new CustomEvent("acp-dialog-close",{bubbles:!0,composed:!0}))},this._stop=e=>{e.stopPropagation()}}updated(){this._syncMinuteTimer(this.open),this._maybeFetchHistory()}_maybeFetchHistory(){if(!this.open||!this.hass||!this.discovered)return;const e=this.discovered.managed_covers??[];if(0===e.length)return this._historyKey=null,void(this._positionHistory.length>0&&(this._positionHistory=[]));const t=Date.now(),s=ms(new Date(t)).getTime(),i=`${e.join(",")}|${s}`;i!==this._historyKey&&(this._historyKey=i,async function(e,t,s,i){if(0===t.length)return[];let o;try{o=await e.callWS({type:"history/history_during_period",start_time:new Date(s).toISOString(),end_time:new Date(i).toISOString(),entity_ids:t,minimal_response:!1,no_attributes:!1,significant_changes_only:!1})}catch{return[]}if(!o||"object"!=typeof o)return[];const n={};for(const e of t){const t=o[e];if(!Array.isArray(t))continue;const s=mi(t);s.length>0&&(n[e]=s)}const r=function(e){const t=Object.keys(e).filter(t=>e[t].length>0);if(0===t.length)return[];const s={},i=new Set;for(const o of t){const t=[...e[o]].sort((e,t)=>e.t-t.t);s[o]=t;for(const e of t)i.add(e.t)}const o=[...i].sort((e,t)=>e-t),n={},r={};for(const e of t)n[e]=0,r[e]=null;const a=[];for(const e of o){for(const i of t){const t=s[i];for(;n[i]<t.length&&t[n[i]].t<=e;)r[i]=t[n[i]].position,n[i]++}const i=$t(r);null!==i&&a.push({t:new Date(e).toISOString(),position:i})}return a}(n);if(r.length>0){const e=r[r.length-1];Date.parse(e.t)<i&&r.push({t:new Date(i).toISOString(),position:e.position})}return r}(this.hass,e,s,t).then(e=>{this._historyKey===i&&(this._positionHistory=e)}))}disconnectedCallback(){super.disconnectedCallback(),this._syncMinuteTimer(!1)}_syncMinuteTimer(e){e&&null===this._cancelMinuteTimer?this._cancelMinuteTimer=Is(()=>this.requestUpdate()):e||null===this._cancelMinuteTimer||(this._cancelMinuteTimer(),this._cancelMinuteTimer=null)}get _discoveredList(){return this.discovered!==this._listSource&&(this._listSource=this.discovered,this._list=this.discovered?[this.discovered]:[]),this._list}_buildHandlerLabels(){const e={};for(const[t,s]of Object.entries(Me))e[t]=He(s,this.hass);return e}_headerIcon(){const e=this.discovered.managed_covers?.[0],t=e?this.hass.states[e]:void 0,s=t?.attributes?.current_position;return tt({explicitIcon:t?.attributes?.icon,deviceClass:t?.attributes?.device_class,coverType:this.discovered.cover_type,position:"number"!=typeof s||Number.isNaN(s)?null:s})}_headerColor(){if(!this.stateColor)return null;const e=this.discovered.managed_covers?.[0],t=e?this.hass.states[e]:void 0;return st(t?.state)}render(){if(!this.open||!this.hass||!this.discovered)return q;const e=this._winner(),t=this._traceAttrs(),s=this._matchedHandlers(t,e),i=js(t),o=t?Bs(t.trace??[],t,0,this._buildHandlerLabels(),He("badge.safety",this.hass)):"",n=this._target(),r=this._shouldShowResume(),a=this._switchOn("integration_enabled_switch"),l=this._switchOn("automatic_control_switch"),c=He("dialog.configure_integration",this.hass),d=He("dialog.open_device_page",this.hass),h=He("dialog.close",this.hass),u=this._headerColor();return U`
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
              ${a?l?s.map(e=>U`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${e}
                          .slotNumber=${"custom_position"===e?t?.custom_position_active_slot:void 0}
                          .slotName=${"custom_position"===e?t?.custom_position_active_slot_name:void 0}
                          .pct=${"custom_position"===e?Rs(t,n)??void 0:void 0}
                          .minimumMode=${"custom_position"===e?t?.custom_position_minimum_mode:void 0}
                          .safetyActive=${"custom_position"===e&&i}
                        ></acp-tile-badge>`):q:U`<acp-tile-badge
                    .hass=${this.hass}
                    .integrationEnabled=${!1}
                  ></acp-tile-badge>`}
            </div>
            <button
              class="icon-btn options-link"
              type="button"
              aria-label=${c}
              ${Tt(c)}
              @click=${this._openIntegrationPage}
            >
              <ha-icon icon="mdi:tune-variant"></ha-icon>
            </button>
            ${this.discovered.device_id?U`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label=${d}
                  ${Tt(d)}
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:cog"></ha-icon>
                </button>`:q}
            <button class="close" type="button" aria-label=${h} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${o?U`<div class="summary">${o}</div>`:q}

          <div class="position-block">
            <div class="position-label">${He("dialog.target",this.hass)}</div>
            <div class="position-value">${Ye(n)}</div>
            ${this._mismatchActive()?U`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:q}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${r?U`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${He("dialog.resume_auto",this.hass)}
                </button>
              </div>`:q}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen?He("dialog.hide_advanced",this.hass):He("dialog.show_advanced",this.hass)}
          </button>
          ${this.advancedOpen?U`<div class="advanced">
                ${this.showCompass?U`<div class="advanced-compass">
                      <acp-sky-compass
                        .hass=${this.hass}
                        .discovered_list=${this._discoveredList}
                        ?compact=${!0}
                        .showLegend=${!1}
                        .showStats=${!0}
                      ></acp-sky-compass>
                    </div>`:q}
                ${this.showElevationChart?U`<acp-elevation-chart
                      .hass=${this.hass}
                      .discoveredList=${this._discoveredList}
                      ?compact=${!0}
                    ></acp-elevation-chart>`:q}
                ${this._renderSlots(t?.custom_position_slots)}
                <acp-decision-strip
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-decision-strip>
                ${this.showSolarCalc?U`<acp-solar-calc
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
    `}_winner(){const e=this.discovered.entities.decision_trace_sensor;return e?this.hass.states[e]?.state??"default":"default"}_traceAttrs(){const e=this.discovered.entities.decision_trace_sensor;if(e)return this.hass.states[e]?.attributes}_matchedHandlers(e,t){if(!e?.trace)return[];const s=ni(e.trace),i=ze.filter(e=>s.has(e)).map(e=>Re[e]).filter(e=>void 0!==e),o=li(e.trace,t);return ii(i,this.badges,o)}_target(){return is(this.hass,this.discovered)}_mismatchActive(){const e=this.discovered.entities.position_mismatch_binary;return!!e&&"on"===this.hass.states[e]?.state}_manualOverrideOn(){const e=this.discovered.entities.manual_override_binary;return!!e&&"on"===this.hass.states[e]?.state}_switchOn(e){const t=this.discovered.entities[e];return!t||"off"!==this.hass.states[t]?.state}_shouldShowResume(){return!!this.discovered.entities.reset_override_button&&this._manualOverrideOn()}_renderSlots(e){if(!e)return q;const t=e.filter(e=>null!==e.sensor);return 0===t.length?q:U`<div class="slots-section">
      <div class="slots-label">${He("dialog.custom_positions",this.hass)}</div>
      ${t.map(e=>this._renderSlotRow(e))}
    </div>`}_renderSlotRow(e){const t=e.sensor_name??`#${e.slot}`,s=e.sensors?.length??0,i=!0===e.template?U`<span
            class="slot-template"
            ${Tt("Template"+(s>0?` · ${s} sensors${e.template_mode?` (${e.template_mode})`:""}`:""))}
          >
            <ha-icon icon="mdi:code-braces"></ha-icon>
          </span>`:q;return U`<div class="slot-row" data-slot=${e.slot}>
      <span class="slot-label">${t}</span>
      ${i}
      <span class="slot-position">${Ye(e.position)}</span>
      ${!0===e.min_mode?U`<span
            class="slot-min-mode${null!=e.priority&&e.priority>80?"":" is-bypassable"}"
            ${Tt(He("dialog.floor_tooltip",this.hass))}
          >
            ${He("dialog.floor",this.hass)}
          </span>`:q}
      <button
        class="slot-toggle ${e.enabled?"on":"off"}"
        type="button"
        aria-label=${e.enabled?He("dialog.disable_slot",this.hass,{slot:e.slot}):He("dialog.enable_slot",this.hass,{slot:e.slot})}
        @click=${()=>this._toggleSlot(e)}
      >
        ${e.enabled?He("dialog.on",this.hass):He("dialog.off",this.hass)}
      </button>
    </div>`}_renderControls(){const e=[{role:"automatic_control_switch",label:He("dialog.automatic",this.hass)},{role:"climate_mode_switch",label:He("dialog.climate",this.hass)},{role:"motion_control_switch",label:He("dialog.motion",this.hass)}].filter(e=>!!this.discovered.entities[e.role]);return 0===e.length?q:U`<div class="controls-block">
      <div class="controls-label">${He("dialog.controls",this.hass)}</div>
      <div class="controls-row">${e.map(e=>this._renderSwitchChip(e.role,e.label))}</div>
    </div>`}_renderSwitchChip(e,t){const s=this.discovered.entities[e],i="on"===this.hass.states[s]?.state,o=He(i?"dialog.state_on":"dialog.state_off",this.hass),n=He(i?"dialog.on":"dialog.off",this.hass);return U`<button
      class="ctrl-toggle ${i?"on":"off"}"
      type="button"
      aria-pressed=${i}
      aria-label=${He("dialog.toggle_hint",this.hass,{label:t,state:o})}
      @click=${()=>this._toggleSwitch(s,i)}
    >
      <span class="ctrl-label">${t}</span>
      <span class="ctrl-state">${n}</span>
    </button>`}_toggleSwitch(e,t){this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:e})}_renderForecastStrip(){const e=this.discovered.entities.position_forecast_sensor,t=e?this.hass.states[e]?.attributes:void 0,s=t?.forecast??[],i=t?.events??[],o=this._positionHistory;if(0===s.length&&0===o.length)return q;const n={};for(const e of Ys(this.discovered))n[e.id]=e.label;return U`<div class="forecast-block">
      <div class="forecast-label">${He("dialog.todays_forecast",this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${s}
        .events=${i}
        .history=${o}
        .now=${Date.now()}
        .axisLabels=${n}
      ></acp-forecast-strip>
      <div class="forecast-note">${He("forecast.solar_only_note",this.hass)}</div>
    </div>`}_toggleSlot(e){const t=this.discovered.managed_covers[0];t&&this.hass.callService(Ee,"set_custom_position",{entity_id:t,slot:e.slot,enabled:!e.enabled})}_navigate(e){history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),this._emitClose()}};function Di(e){return U`
    <div
      class="editor-footer"
      style="display:flex;align-items:center;justify-content:space-between;gap:8px;"
    >
      <a href=${"https://www.buymeacoffee.com/jrhubott"} target="_blank" rel="noopener noreferrer">
        <img src=${"https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black"} alt=${He("editor.common.support_alt",e)} height="20" />
      </a>
      <span class="version-footer dim">
        ${He("root.footer_version",e,{version:fe})}
      </span>
    </div>
  `}ji.styles=r`
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
  `,e([ge({attribute:!1})],ji.prototype,"hass",void 0),e([ge({attribute:!1})],ji.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],ji.prototype,"open",void 0),e([ge({type:Boolean})],ji.prototype,"advancedOpen",void 0),e([ge({type:Boolean})],ji.prototype,"showCompass",void 0),e([ge({type:Boolean})],ji.prototype,"showElevationChart",void 0),e([ge({type:Boolean})],ji.prototype,"showSolarCalc",void 0),e([ge({type:Boolean})],ji.prototype,"stateColor",void 0),e([ge({attribute:!1})],ji.prototype,"badges",void 0),e([_e()],ji.prototype,"_positionHistory",void 0),ji=e([he("acp-more-info-dialog")],ji);const Bi=["auto","solar","force","weather","manual","custom_position","motion","climate","glare_zone","cloud"],Ki={show_position:!0,show_state:!0,show_decision_summary:!1,show_controls:!0,show_badge:!0,show_position_bar:!0,show_compass:!0,show_elevation_chart:!0,show_solar_calc:!0,show_motion_icon:!0,state_color:!0,layout:"detailed",badge_auto:!0,badge_solar:!0,badge_force:!0,badge_weather:!0,badge_manual:!0,badge_custom_position:!0,badge_motion:!0,badge_climate:!0,badge_glare_zone:!0,badge_cloud:!0},Gi={entry_id:"editor.common.entry_id",name:"editor.tile.name",icon:"editor.tile.icon",cover:"editor.tile.cover",layout:"editor.tile.layout",show_position:"editor.tile.show_position",show_state:"editor.tile.show_state",show_decision_summary:"editor.tile.show_decision_summary",show_controls:"editor.tile.show_controls",show_badge:"editor.tile.show_badge",show_position_bar:"editor.tile.show_position_bar",badge_section:"editor.tile.badge_section",badge_auto:"editor.tile.badge_auto",badge_solar:"editor.tile.badge_solar",badge_force:"editor.tile.badge_force",badge_weather:"editor.tile.badge_weather",badge_manual:"editor.tile.badge_manual",badge_custom_position:"editor.tile.badge_custom_position",badge_motion:"editor.tile.badge_motion",badge_climate:"editor.tile.badge_climate",badge_glare_zone:"editor.tile.badge_glare_zone",badge_cloud:"editor.tile.badge_cloud",show_compass:"editor.tile.show_compass",show_elevation_chart:"editor.tile.show_elevation_chart",show_solar_calc:"editor.tile.show_solar_calc",show_motion_icon:"editor.tile.show_motion_icon",state_color:"editor.tile.state_color",tap_action:"editor.tile.tap_action",hold_action:"editor.tile.hold_action",double_tap_action:"editor.tile.double_tap_action"};let Li=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._registry=null,this._managedCovers=[],this._entriesFetchInFlight=!1,this._registryFetchInFlight=!1,this._unsubRegistry=null,this._computeLabel=e=>{const t=Gi[e.name];return t?He(t,this.hass):e.name},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,s]of Object.entries(Ki))e.startsWith("badge_")?t[e]===s&&delete t[e]:this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==s||delete t[e];const s={};for(const e of Bi){const i=`badge_${e}`;!1===t[i]&&(s[e]=!1),delete t[i]}const i={...this._config??{type:"",entry_id:""},...t};Object.keys(s).length>0?i.badges=s:delete i.badges,this._emit(i)}}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&(this._ensureEntries(),this._ensureRegistry()),e.has("_registry")&&null!==this._registry&&this._maybePrefillCover()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Ht(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id}),this._maybePrefillCover()}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_ensureRegistry(){null!==this._registry||this._registryFetchInFlight||(this._registryFetchInFlight=!0,Dt(this.hass).then(e=>{this._registry=e,this._maybePrefillCover()}).catch(()=>{this._registry=[]}).finally(()=>{this._registryFetchInFlight=!1})),this._unsubRegistry||(this._unsubRegistry=Bt(this.hass,()=>{this._registryFetchInFlight=!0,Dt(this.hass).then(e=>{this._registry=e}).catch(()=>{}).finally(()=>{this._registryFetchInFlight=!1})}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_maybePrefillCover(){if(!this._config?.entry_id||this._config?.cover||!this._registry||!this.hass)return;const e=jt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);this._managedCovers=e?.managed_covers??[],1===e?.managed_covers.length&&this._emit({...this._config,cover:e.managed_covers[0]})}render(){if(!this._config)return q;if(this._entriesError&&!this._entries)return U`
        <div class="form">
          <div class="error">
            ${He("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${He("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${He("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          ${Di(this.hass)}
        </div>
      `;const e=this._schema(),{badges:t,...s}=this._config,i={};for(const e of Bi)t&&!1===t[e]&&(i[`badge_${e}`]=!1);const o={...Ki,...s,...i};return U`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${o}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${this._managedCovers.length>1&&!this._config?.cover?U`<div class="hint">${He("editor.tile.cover_blank_hint",this.hass)}</div>`:q}
        ${Di(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[],t=[{value:"one-line",label:He("editor.tile.layout_option_one_line",this.hass)},{value:"detailed",label:He("editor.tile.layout_option_detailed",this.hass)}];let s={entity:{domain:"cover"}};if(this._registry&&this._config?.entry_id){const e=jt(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);e&&e.managed_covers.length>0&&(s={entity:{domain:"cover",include_entities:e.managed_covers}})}return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"cover",selector:s},{name:"layout",selector:{select:{mode:"list",options:t}}},{name:"show_position",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}},{name:"show_controls",selector:{boolean:{}}},{name:"show_badge",selector:{boolean:{}}},{type:"expandable",name:"",title:He("editor.tile.badge_section",this.hass),icon:"mdi:label-multiple-outline",schema:[{type:"grid",name:"",schema:Bi.map(e=>({name:`badge_${e}`,selector:{boolean:{}}}))}]},{name:"show_position_bar",selector:{boolean:{}}},{name:"show_motion_icon",selector:{boolean:{}}},{name:"state_color",selector:{boolean:{}}},{name:"show_compass",selector:{boolean:{}}},{name:"show_elevation_chart",selector:{boolean:{}}},{name:"show_solar_calc",selector:{boolean:{}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}};Li.styles=r`
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
  `,e([ge({attribute:!1})],Li.prototype,"hass",void 0),e([_e()],Li.prototype,"_config",void 0),e([_e()],Li.prototype,"_entries",void 0),e([_e()],Li.prototype,"_entriesError",void 0),e([_e()],Li.prototype,"_registry",void 0),e([_e()],Li.prototype,"_managedCovers",void 0),Li=e([he($e)],Li);let Ui=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._dialogOpen=!1,this._extendOpen=!1,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=Nt(),this._discovered=null,this._fetchGen=0,this._closeDialog=()=>{this._dialogOpen=!1},this._holdTimer=null,this._pendingTapTimer=null,this._holdFired=!1,this._onPointerDown=()=>{this._holdFired=!1,null!=this._holdTimer&&clearTimeout(this._holdTimer),qs(this._config?.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._holdTimer=null,this._fireAction("hold")},500))},this._onPointerUp=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onPointerCancel=()=>{null!=this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)},this._onClick=()=>{if(!this._holdFired)return qs(this._config?.double_tap_action)?null!=this._pendingTapTimer?(clearTimeout(this._pendingTapTimer),this._pendingTapTimer=null,void this._fireAction("double_tap")):void(this._pendingTapTimer=setTimeout(()=>{this._pendingTapTimer=null,this._fireAction("tap")},250)):void this._fireAction("tap");this._holdFired=!1}}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${xe}: \`entry_id\` is required and must be a non-empty string`);let t={...e};if("string"==typeof t.tap_action&&(t={...t,tap_action:"none"===t.tap_action?{action:"none"}:void 0}),this._config=t,t.tooltips&&Ot(t.tooltips),null===this._registry){const e=Qt.get(t.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 1}getGridOptions(){return{columns:"full",rows:"auto",min_columns:3,min_rows:"one-line"!==this._config?.layout?2:1}}static async getStubConfig(e){let t="";try{const s=await Ht(e);t=s[0]?.entry_id??""}catch{}return{type:`custom:${xe}`,entry_id:t}}static async getConfigElement(){return document.createElement($e)}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Lt();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||me(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Bt(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Ut(this.hass,e).then(e=>{t===this._fetchGen&&e!==this._registry&&(this._registry=e,this._registryError=null,this._config&&Qt.set(this._config.entry_id,Xt(e,this._config.entry_id)))}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return U`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?He("tile.registry_failed",this.hass,{error:this._registryError}):He("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=this._discovered;return e?e.is_group?U`<ha-card>
        <acp-group-tile .hass=${this.hass} .discovered=${e}></acp-group-tile>
      </ha-card>`:U`
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
    `:U`<ha-card>
        <div class="empty">
          <p class="dim">
            ${He("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`}_extendPresets(e){const t=e.entities.position_forecast_sensor,s=t?this.hass.states[t]?.attributes:void 0;return function(e){const{events:t,nowMs:s,latitude:i,longitude:o,max:n=ei}=e,r=t.filter(e=>{const t=Date.parse(e.t);return!Number.isNaN(t)&&t>s}).map(e=>({kind:e.kind,t:e.t,label:e.label}));if(r.length<2&&null!=i&&null!=o)for(const e of function(e,t,s){const i=[];for(let o=0;o<=1;o++){const n=new Date(s+24*o*60*60*1e3),r=ps.getTimes(n,e,t);for(const[e,t]of[["sunrise",r.sunrise],["sunset",r.sunset]])t&&!Number.isNaN(t.getTime())&&(t.getTime()<=s||i.some(t=>t.kind===e)||i.push({kind:e,t:t.toISOString()}))}return i.sort((e,t)=>Date.parse(e.t)-Date.parse(t.t))}(i,o,s)){const t=r.some(t=>{return t.kind===e.kind&&(s=t.t,i=e.t,Math.floor(Date.parse(s)/6e4)===Math.floor(Date.parse(i)/6e4));var s,i});t||r.push({kind:e.kind,t:e.t,label:e.kind})}return r.sort((e,t)=>Date.parse(e.t)-Date.parse(t.t)).slice(0,n)}({events:s?.events??[],nowMs:Date.now(),latitude:this.hass.config?.latitude,longitude:this.hass.config?.longitude})}_manualEndMs(e){const t=e.entities.manual_override_end_sensor,s=t?this.hass.states[t]?.state:void 0;if(!s)return;const i=Date.parse(s);return Number.isNaN(i)?void 0:i}_onExtendConfirm(e,t){!function(e,t,s){const i={};if(s.endTime)i.end_time=s.endTime.toISOString();else{if(null==s.duration)return;i.duration={seconds:s.duration}}e.callService(Ee,"engage_manual_override",i,{entity_id:t})}(this.hass,t.managed_covers,{endTime:new Date(e.detail.endMs)}),this._extendOpen=!1}_buildHandlerLabels(){const e={};for(const[t,s]of Object.entries(Me))e[t]=He(s,this.hass);return e}_renderTile(e){const t=this._config,s=t.name??e.entry_title,i=this._resolvedCover(e),o=i?this.hass.states[i]:void 0,n=o?.attributes?.device_class,r=Qe(o?.state),a=t.icon??(r?"mdi:help-rhombus-outline":tt({explicitIcon:o?.attributes?.icon,deviceClass:n,coverType:e.cover_type,position:this._liveCoverPosition(i)})),l=!1!==t.state_color?st(o?.state):null,c=!1!==t.show_position,d=!1!==t.show_state,h=!1!==t.show_controls,u=!1!==t.show_badge,p=!1!==t.show_motion_icon?this._motionActiveState(e):null,g=He("timeout_pending"===p?"tile.motion_pending":"tile.motion_detected",this.hass),_="one-line"!==t.layout,m=this._currentPosition(e),f=this._liveCoverPosition(i),v=r?null:f??m,b=Ys(e).find(e=>"position"!==e.id),y=!1!==t.show_tilt&&!!b,w=!r&&b?this._liveAxis(i,b):null,x=!r&&b?this._axisTarget(e,b):null,$=null!==f&&f>=100,k=null!==f&&f<=0,A=this._winner(e),S=this._traceAttrs(e),C=this._manualEndIso(e),E=this._isFullyInert(t),z=js(S),O=!0===t.show_decision_summary&&S?Bs(S.trace??[],S,0,this._buildHandlerLabels(),He("badge.safety",this.hass)):"",M=!!O&&_,I=this._switchOn(e,"integration_enabled_switch"),T=this._switchOn(e,"automatic_control_switch"),N=this._manualOverrideOn(e),P=function(e){const t=function(e){const t=ai(e);return"motion"!==t?"auto"!==t?t:function(e,t){const s=ni(e);for(const e of ze){if("motion"===e)continue;if(!s.has(e))continue;const i=Re[e];if(void 0!==i){if("off"===i||"group"===i)return i;if(!1!==t?.[i])return i}}return null}(e.trace,e.badges)??"auto":!1===e.badges?.motion||e.showMotionIcon?!1===e.badges?.auto?null:"auto":t}(e);return!1===e.inTimeWindow&&!1!==e.badges?.off_schedule&&"off"!==t&&"manual"!==t&&"force"!==t?"off_schedule":t}({winner:A,integrationEnabled:I,manualActive:N,badges:t.badges,showMotionIcon:!1!==t.show_motion_icon,inTimeWindow:S?.in_time_window,trace:S?.trace}),F=li(S?.trace,A),R=null!==P&&ii([P],t.badges,F).length>0,j=u&&R&&!(!1===T&&!0===I),D=function(e){if(!e.integrationEnabled)return!1;if(!e.automaticControl)return!1;if(e.manualActive)return!1;const t=Ds(e.winner);return"force"!==t&&("custom_position"!==t||!e.bypassAutoControl&&!0!==e.safetyActive)}({winner:A,integrationEnabled:I,automaticControl:T,manualActive:N,bypassAutoControl:!0===S?.bypass_auto_control,safetyActive:z}),B=_&&u&&!1!==t.badges?.auto&&D,K=!(B&&"auto"===P),G=this._transitState(e),L=r?He("tile.unavailable",this.hass):d?function(e,t,s){if(!e||!t)return null;const i=e.states[t];if(!i||Qe(i.state))return null;const o=s?{...i,state:s}:i;if("function"==typeof e.formatEntityState){const t=e.formatEntityState(o);if(t)return t}if("function"==typeof e.localize){const t=e.localize(`component.cover.entity_component._.state.${o.state}`);if(t)return t}return o.state.charAt(0).toUpperCase()+o.state.slice(1)}(this.hass,i,G??void 0):null,W=[L,c&&null!==v?Ye(v):null,y&&!_&&null!==w?`⟂${Ye(w)}`:null].filter(e=>!!e),V=!!L,H=function(e,t,s){if(!Array.isArray(e?.custom_position_slots))return null;const i=e.custom_position_slots.filter(e=>!0===e.min_mode&&!0===e.enabled&&null!==e.sensor&&null!==e.position&&"on"===t[e.sensor]?.state);if(0===i.length)return null;const o=i.reduce((e,t)=>(t.position??0)>(e.position??0)?t:e),n=o.position,r=o.priority??null;return{slot:o.slot,position:n,label:o.sensor_name??`#${o.slot}`,clamping:null!==s&&n>s,sensorOn:!0,priority:r,resistsManual:null!=r&&r>80}}(S,this.hass.states,m),Y=Ds(A),Q=u&&!!H&&!("custom_position"===Y&&!0===S?.custom_position_minimum_mode)&&I,Z=N&&!!e.entities.reset_override_button,X=N&&function(e){const t=e.services;return!!t?.[Ee]?.engage_manual_override}(this.hass),J=W.length>0?U`<div class="position">${W.join(" · ")}</div>`:q,ee=Q?U`<span
          class=${`acp-floor-chip${H.clamping?"":" is-armed"}${H.resistsManual?" resists-manual":" is-bypassable"}`}
          ${Tt(He("dialog.floor_tooltip",this.hass))}
          >${He("dialog.floor",this.hass)} ${Ye(H.position)}</span
        >`:q,te=j?U`<acp-tile-badge
          .hass=${this.hass}
          .winner=${A}
          .kindOverride=${P??void 0}
          .integrationEnabled=${I}
          .slotNumber=${S?.custom_position_active_slot}
          .slotName=${S?.custom_position_active_slot_name}
          .pct=${Rs(S,m)??void 0}
          .minimumMode=${S?.custom_position_minimum_mode}
          .safetyActive=${z}
          .manualEndIso=${C}
          .manualActive=${N}
          .resumable=${Z}
          .extendable=${X}
          @acp-resume=${()=>this._resume(e)}
          @acp-extend=${()=>this._extendOpen=!0}
        ></acp-tile-badge>`:q,se=B?U`<acp-tile-badge
          .hass=${this.hass}
          .winner=${A}
          .kindOverride=${"auto"}
          .integrationEnabled=${I}
        ></acp-tile-badge>`:q,ie=W.length>0?U`<div class="state">${W.join(" · ")}</div>`:q,oe=_&&!1!==t.show_position_bar&&null!==v,ne=oe?null!==m?`${Ye(v)} · ${He("dialog.target",this.hass)} ${Ye(m)}`:Ye(v):"",re=oe?U`<div class="pos-bar" ${Tt(ne)}>
          <div
            class="pos-fill"
            style=${`width:${v}%${l?`;background:${l}`:""}`}
          ></div>
          ${null!==m?U`<div
                class="pos-marker"
                style=${`left:clamp(1px, ${m}%, calc(100% - 1px))`}
              ></div>`:q}
        </div>`:q,ae=j&&K,le=_&&(B||ae||Q),ce=le?U`${se}${ae?te:q}${ee}`:q,de=_&&(le||oe);return U`
      <div
        class=${`tile-body${_?" detailed":""}${V?" has-state-label":""}${Q&&!_?" has-floor-chip":""}${y&&_?" has-tilt":""}${de?" has-chrome-row":""}${de&&!le?" bar-only":""}${r?" unavailable":""}`}
        role=${E?"group":"button"}
        tabindex=${E?-1:0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
          <ha-icon
            class="cover-icon"
            icon=${a}
            style=${l?`color: ${l}`:""}
          ></ha-icon>
          ${p?U`<ha-icon
                class="motion-overlay ${p}"
                icon="mdi:motion-sensor"
                ${Tt(g)}
              ></ha-icon>`:q}
        </div>
        <div class="label">
          <div class="title">${s}</div>
          ${_?ie:q}
          ${O&&!_?U`<div class="summary">${O}</div>`:q}
          ${M?U`<div class="summary" ${Tt(O)}>${O}</div>`:q}
        </div>
        ${_?q:U`${J}${ee}`}
        ${de?U`<div class="chrome-line">${ce}${re}</div>`:q}
        ${y&&_?U`<div
              class="tilt-line"
              @click=${this._stop}
              @pointerdown=${this._stop}
              @pointerup=${this._stop}
            >
              <acp-tilt-bar
                layout="tile"
                .hass=${this.hass}
                .label=${b?this._axisLabel(b):null}
                .min=${b?.min??0}
                .max=${b?.max??100}
                .unit=${b?.unit??"%"}
                .actual=${w}
                .target=${x}
                .disabled=${r}
                @acp-tilt-set=${e=>b&&this._setAxis(i,b.id,e.detail)}
              ></acp-tilt-bar>
            </div>`:q}
        ${h?U`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${He("tile.open",this.hass)}
                ?disabled=${!i||r||$}
                @click=${()=>this._setCoverPosition(i,100)}
              >
                <ha-icon icon=${he=n,he&&Fe.has(he)?"mdi:arrow-expand-horizontal":"mdi:arrow-up"}></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${He("tile.stop",this.hass)}
                ?disabled=${!i||r}
                @click=${()=>this._stopCover(i)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${He("tile.close",this.hass)}
                ?disabled=${!i||r||k}
                @click=${()=>this._setCoverPosition(i,0)}
              >
                <ha-icon icon=${function(e){return e&&Fe.has(e)?"mdi:arrow-collapse-horizontal":"mdi:arrow-down"}(n)}></ha-icon>
              </button>
            </div>`:q}
        ${_?q:te}
      </div>
    `;var he}_resolvedCover(e){return this._config?.cover?this._config.cover:e.managed_covers[0]}_currentPosition(e){return is(this.hass,e)}_transitState(e){const t=e.entities.target_position_sensor;if(!t)return null;const s=this._resolvedCover(e);if(!s)return null;const i=this.hass.states[t]?.attributes?.transit_states;return i?.[s]??null}_liveCoverPosition(e){if(!e)return null;const t=this.hass.states[e]?.attributes?.current_position;return"number"!=typeof t||Number.isNaN(t)?null:t}_winner(e){const t=e.entities.decision_trace_sensor;return t?this.hass.states[t]?.state??"default":"default"}_traceAttrs(e){const t=e.entities.decision_trace_sensor;if(t)return this.hass.states[t]?.attributes}_motionActiveState(e){const t=e.entities.motion_status_sensor;if(!t)return null;const s=this.hass.states[t]?.state;return"motion_detected"===s||"timeout_pending"===s?s:null}_manualOverrideOn(e){const t=e.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_switchOn(e,t){const s=e.entities[t];return!s||"off"!==this.hass.states[s]?.state}_manualEndIso(e){if(!this._manualOverrideOn(e))return;const t=e.entities.manual_override_end_sensor;return t?this.hass.states[t]?.state:void 0}_setCoverPosition(e,t){e&&this._setAxis(e,"position",t)}_stopCover(e){e&&this.hass.callService(Ee,"stop",{},{entity_id:e})}_setAxis(e,t,s){e&&Js(this.hass,e,{[t]:s})}_axisTarget(e,t){const s=t.targetRole;if(!s)return null;const i=e.entities[s];if(!i)return null;const o=parseFloat(this.hass.states[i]?.state??"");return Number.isNaN(o)?null:o}_liveAxis(e,t){if(!e||!t.stateAttr)return null;const s=this.hass.states[e]?.attributes?.[t.stateAttr];return"number"!=typeof s||Number.isNaN(s)?null:s}_axisLabel(e){const t=Le[e.id];return t?He(t,this.hass):e.label}_resume(e){const t=e.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}_tapActionConfig(){const e=this._config?.tap_action;if("string"!=typeof e)return e}_isFullyInert(e){return!!(e=>!!e&&"none"===e.action)(this._tapActionConfig())&&!qs(e.hold_action)&&!qs(e.double_tap_action)}_fireAction(e){if(!this._config||!this.hass)return;const t=this._tapActionConfig();if("tap"===e&&void 0===t)return this._dialogOpen=!0,void this.dispatchEvent(new CustomEvent("acp-tile-tap",{bubbles:!0,composed:!0}));const s=this._resolvedCoverFromState();((e,t,s,i)=>{let o;"double_tap"===i&&s.double_tap_action?o=s.double_tap_action:"hold"===i&&s.hold_action?o=s.hold_action:"tap"===i&&s.tap_action&&(o=s.tap_action),((e,t,s,i)=>{if(i||(i={action:"more-info"}),!i.confirmation||i.confirmation.exemptions&&i.confirmation.exemptions.some(e=>e.user===t.user.id)||(Vs("warning"),confirm(i.confirmation.text||`Are you sure you want to ${i.action}?`)))switch(i.action){case"more-info":(s.entity||s.camera_image)&&Ws(e,"hass-more-info",{entityId:s.entity?s.entity:s.camera_image});break;case"navigate":i.navigation_path&&((e,t,s=!1)=>{s?history.replaceState(null,"",t):history.pushState(null,"",t),Ws(window,"location-changed",{replace:s})})(0,i.navigation_path);break;case"url":i.url_path&&window.open(i.url_path);break;case"toggle":s.entity&&(((e,t)=>{((e,t,s=!0)=>{const i=function(e){return e.substr(0,e.indexOf("."))}(t),o="group"===i?"homeassistant":i;let n;switch(i){case"lock":n=s?"unlock":"lock";break;case"cover":n=s?"open_cover":"close_cover";break;default:n=s?"turn_on":"turn_off"}e.callService(o,n,{entity_id:t})})(e,t,Us.includes(e.states[t].state))})(t,s.entity),Vs("success"));break;case"call-service":{if(!i.service)return void Vs("failure");const[e,s]=i.service.split(".",2);t.callService(e,s,i.service_data,i.target),Vs("success");break}case"fire-dom-event":Ws(e,"ll-custom",i)}})(e,t,s,o)})(this,this.hass,{entity:s,tap_action:t,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action},e)}_resolvedCoverFromState(){if(this._config?.cover)return this._config.cover;if(null===this._registry)return;const e=this._discovered??this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry);return e?.managed_covers[0]}_stop(e){e.stopPropagation()}};Ui.styles=r`
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
      column-gap: 12px;
      /* Tight row gap pulls the chrome row (badges + position bar) up snug under
         the name/state so the tile stays as short as possible when badges are
         present (issue #208). */
      row-gap: 2px;
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
    /* Bar-only (position bar, no badges): confine the bar to the label column so
       the controls can span both rows, then center the name/state across the
       full height with the bar hugging the bottom — so a bar-only tile centers
       its label instead of pinning it to the top (issue #208). Scoped to
       :not(.has-tilt): a tilt tile keeps its 3-row grid (label/chrome/tilt) and
       must NOT span the label across the bar + tilt rows, which would overlap
       them (the tilt grid wins on specificity, so the label span has to opt out
       explicitly here). */
    .tile-body.detailed.bar-only:not(.has-tilt) {
      grid-template-areas:
        'icon label  controls'
        'icon chrome controls';
    }
    .tile-body.detailed.bar-only:not(.has-tilt) .label {
      grid-row: 1 / -1;
      align-self: center;
    }
    .tile-body.detailed.bar-only:not(.has-tilt) .chrome-line {
      align-self: end;
    }
    /* Name over state, vertically centered against the icon (HA ha-tile-info). */
    .tile-body.detailed .label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
    }
    /* Match HA's ha-tile-info text through the same theme tokens the native
       tile card uses, so ACP inherits any theme font-scaling/recoloring
       instead of drifting with hardcoded values. Fallbacks are HA's own
       defaults (name 14px/500, state 12px/400). */
    .tile-body.detailed .title {
      font-size: var(--ha-font-size-m, 0.875rem);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-condensed, 1.375);
      color: var(--primary-text-color);
    }
    .tile-body.detailed .state {
      font-size: var(--ha-font-size-s, 0.75rem);
      font-weight: var(--ha-font-weight-normal, 400);
      line-height: var(--ha-line-height-condensed, 1.375);
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
    .chrome-line .pos-bar {
      margin-left: auto;
      align-self: center;
      position: relative;
      flex: 0 1 170px;
      max-width: 55%;
      height: 6px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      overflow: hidden;
    }
    .chrome-line .pos-fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: var(--primary-color);
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
    /* Link to HA's own ha-control-button tokens so height/radius/fill follow the
       native cover tile (and the theme) instead of hardcoded values. Fallbacks
       are HA defaults: 40px thickness, 12px radius, disabled-color @ 20% fill,
       24px glyph. Width is fixed (~56) since this inline row doesn't flex-fill
       like HA's full-width control-button-group. */
    .tile-body.detailed .controls {
      align-self: center;
      gap: 12px;
    }
    .tile-body.detailed .controls button {
      width: 56px;
      height: var(--control-button-group-thickness, 40px);
      border-radius: var(--control-button-border-radius, 12px);
      border: none;
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 20%,
        transparent
      );
    }
    .tile-body.detailed .controls button ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-text-color);
    }
    .tile-body.detailed .controls button:hover {
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 32%,
        transparent
      );
    }
    /* Bare 36px glyph, no background shape — the state color carries the
       cover's status without a tinted square behind it. */
    .tile-body.detailed .cover-icon-wrap {
      place-self: center;
      width: 36px;
      height: 36px;
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
        /* The wide bar-only grid is :not(.has-tilt) at (0,4,0), which out-weighs
           the (0,3,0) has-chrome-row reflow above — so re-assert the reflowed
           (controls on their own row) grid at matching specificity here, or a
           bar-only tile would keep its inline layout on phones. */
        .tile-body.detailed.bar-only:not(.has-tilt) {
          grid-template-areas:
            'icon label'
            'icon chrome'
            'controls controls';
        }
        /* Narrow reflow stacks the controls on their own row, so the bar-only
           label span from the wide layout would overlap them — pin it back to
           the name row. */
        .tile-body.detailed.bar-only:not(.has-tilt) .label {
          grid-row: 1 / 2;
        }
        .tile-body.detailed .controls {
          margin-top: 4px;
          gap: 8px;
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
      .tile-body.detailed {
        grid-template-columns: 36px minmax(0, 1fr);
        grid-template-areas:
          'icon label'
          'controls controls';
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
      /* Re-assert the reflowed grid for bar-only (see the 480px block): the wide
         bar-only rule out-specifies the has-chrome-row reflow, so without this a
         bar-only tile in a narrow Sections column keeps its inline controls. */
      .tile-body.detailed.bar-only:not(.has-tilt) {
        grid-template-areas:
          'icon label'
          'icon chrome'
          'controls controls';
      }
      /* Narrow reflow stacks the controls on their own row, so the bar-only
         label span from the wide layout would overlap them — pin it back. */
      .tile-body.detailed.bar-only:not(.has-tilt) .label {
        grid-row: 1 / 2;
      }
      .tile-body.detailed .controls {
        margin-top: 4px;
        gap: 8px;
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
  `,e([ge({attribute:!1})],Ui.prototype,"hass",void 0),e([_e()],Ui.prototype,"_config",void 0),e([_e()],Ui.prototype,"_registry",void 0),e([_e()],Ui.prototype,"_registryError",void 0),e([_e()],Ui.prototype,"_dialogOpen",void 0),e([_e()],Ui.prototype,"_extendOpen",void 0),Ui=e([he(xe)],Ui),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===xe)||window.customCards.push({type:xe,name:"Adaptive Cover Pro — Tile",description:"Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:qt(`custom:${xe}`,"entry_id")});const Wi=["auto","all_open","all_closed","privacy"],Vi=["open","closed","mixed","unknown"];let qi=class extends ce{constructor(){super(...arguments),this.compact=!1}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=e.get("hass"),s=this.discovered?.entities;return me(t,this.hass,[s?.group_position_sensor,s?.group_state_sensor,s?.group_who_won_sensor,s?.group_scene_select,s?.group_lock_switch,s?.group_automation_switch,...this.discovered?.managed_covers??[]])}render(){if(!this.hass||!this.discovered)return q;const e=this.discovered.entities,t=e.group_position_sensor?this.hass.states[e.group_position_sensor]:void 0,s=t?parseFloat(t.state):NaN,i=t?.attributes?.member_positions??{},o=e.group_who_won_sensor?this.hass.states[e.group_who_won_sensor]:void 0,n=o?.attributes?.member_winners??{},r=this._currentScene(),a=this._locked(),l=this._automationOn(),c=e.group_clear_overrides_button,d=Object.entries(i);return U`
      <div class="group-view">
        <div class="summary">
          <span class="agg-state">${this._aggregateStateLabel()}</span>
          <span class="agg-position"
            >${Ye(Number.isNaN(s)?null:s)}</span
          >
        </div>

        <div class="controls">
          <select
            class="scene-select"
            aria-label=${He("group.scene",this.hass)}
            @change=${this._onSceneChange}
          >
            ${Wi.map(e=>U`<option value=${e} ?selected=${e===r}>
                  ${He(`group.scene_${e}`,this.hass)}
                </option>`)}
          </select>
          <button
            class="ctrl lock-toggle ${a?"active":""}"
            type="button"
            aria-pressed=${a?"true":"false"}
            aria-label=${He(a?"group.unlock":"group.lock",this.hass)}
            ${Tt(He(a?"group.unlock":"group.lock",this.hass))}
            @click=${()=>this._toggleLock(a)}
          >
            <ha-icon icon=${a?"mdi:lock":"mdi:lock-open-variant"}></ha-icon>
          </button>
          <button
            class="ctrl automation-toggle ${l?"active":""}"
            type="button"
            aria-pressed=${l?"true":"false"}
            aria-label=${He("group.automation",this.hass)}
            ${Tt(He("group.automation",this.hass))}
            @click=${()=>this._toggleAutomation(l)}
          >
            <ha-icon icon=${l?"mdi:robot":"mdi:robot-off"}></ha-icon>
          </button>
          ${c?U`<button
                class="ctrl clear-overrides"
                type="button"
                aria-label=${He("group.clear_overrides",this.hass)}
                ${Tt(He("group.clear_overrides",this.hass))}
                @click=${()=>this._clearOverrides(c)}
              >
                <ha-icon icon="mdi:backup-restore"></ha-icon>
              </button>`:q}
        </div>

        <div class="members">
          <div class="members-head">${He("group.members",this.hass)}</div>
          ${0===d.length?U`<div class="member-placeholder">
                ${He("group.member_placeholder",this.hass)}
              </div>`:d.map(([e,t])=>this._memberRow(e,t,n[e]))}
        </div>
      </div>
    `}_memberRow(e,t,s){const i=this.hass.states[e]?.attributes?.friendly_name??e,o=t??0;return U`
      <div class="member">
        <div class="member-name" ${Tt(e)}>${i}</div>
        <div class="track">
          <div class="fill" style="width:${o}%"></div>
          <div class="fill-closed" style="width:${100-o}%"></div>
        </div>
        <div class="member-position">${Ye(t)}</div>
        ${s?U`<acp-tile-badge .hass=${this.hass} .winner=${s}></acp-tile-badge>`:U`<span class="badge-spacer"></span>`}
      </div>
    `}_aggregateStateLabel(){const e=this.discovered.entities.group_state_sensor,t=e?this.hass.states[e]?.state??"unknown":"unknown";return He(`group.state_${Vi.includes(t)?t:"unknown"}`,this.hass)}_currentScene(){const e=this.discovered.entities.group_scene_select;if(!e)return"auto";const t=this.hass.states[e],s=t?.attributes?.current_option??t?.state??"auto";return Wi.includes(s)?s:"auto"}_locked(){const e=this.discovered.entities.group_lock_switch;return!!e&&"on"===this.hass.states[e]?.state}_automationOn(){const e=this.discovered.entities.group_automation_switch;return!e||"on"===this.hass.states[e]?.state}_onSceneChange(e){const t=e.target.value,s=this.discovered.entities.group_scene_select;s&&Qs(this.hass,s,t)}_toggleLock(e){const t=this.discovered.entities.group_lock_switch;t&&Zs(this.hass,t,!e)}_toggleAutomation(e){const t=this.discovered.entities.group_automation_switch;t&&Zs(this.hass,t,!e)}_clearOverrides(e){this.hass.callService("button","press",{},{entity_id:e})}};qi.styles=r`
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
      gap: 8px;
      flex-wrap: wrap;
    }
    .scene-select {
      flex: 1 1 auto;
      min-width: 120px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      font-size: 0.9rem;
    }
    .ctrl {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 38px;
      border: none;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .ctrl:hover {
      filter: brightness(0.95);
    }
    .ctrl.active {
      background: rgba(63, 81, 181, 0.2);
      color: #283593;
    }
    .ctrl ha-icon {
      --mdc-icon-size: 20px;
    }
    .members {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .members-head {
      font-size: 0.78rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .member {
      display: grid;
      grid-template-columns: minmax(80px, 1.4fr) 3fr 44px auto;
      gap: 8px;
      align-items: center;
      font-size: 0.85rem;
    }
    .member-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .member-name[data-tooltip]:hover {
      cursor: help;
    }
    .member-position {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    .track {
      position: relative;
      display: flex;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      overflow: hidden;
    }
    :host([compact]) .track {
      height: 6px;
    }
    .fill {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      transition: width 0.3s ease;
    }
    .fill-closed {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--primary-color) 50%, transparent);
      transition: width 0.3s ease;
    }
    .badge-spacer {
      display: inline-block;
    }
    .member-placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 12px;
    }
  `,e([ge({attribute:!1})],qi.prototype,"hass",void 0),e([ge({attribute:!1})],qi.prototype,"discovered",void 0),e([ge({type:Boolean,reflect:!0})],qi.prototype,"compact",void 0),qi=e([he("acp-group-view")],qi);const Hi=[{key:"sky",labelKey:"editor.main.section_sky_label",descKey:"editor.main.section_sky_desc"},{key:"elevation",labelKey:"editor.main.section_elevation_label",descKey:"editor.main.section_elevation_desc"},{key:"decision",labelKey:"editor.main.section_decision_label",descKey:"editor.main.section_decision_desc"},{key:"covers",labelKey:"editor.main.section_covers_label",descKey:"editor.main.section_covers_desc"},{key:"overrides",labelKey:"editor.main.section_overrides_label",descKey:"editor.main.section_overrides_desc"},{key:"climate",labelKey:"editor.main.section_climate_label",descKey:"editor.main.section_climate_desc"},{key:"solar",labelKey:"editor.main.section_solar_label",descKey:"editor.main.section_solar_desc",enabledByDefault:!1}],Yi=Hi.filter(e=>!1!==e.enabledByDefault).map(e=>e.key);let Qi=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ht(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??Yi}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_onEntryChange(e){const t=e.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:t})}_onSectionToggle(e,t){const s=new Set(this._currentSections);t?s.add(e):s.delete(e);const i=Hi.map(e=>e.key).filter(e=>s.has(e));this._emit({...this._config??{type:"",entry_id:""},show_sections:i})}_onCompactToggle(e){this._emit({...this._config??{type:"",entry_id:""},compact:e})}_onCompassStatsToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:e})}_onCompassLegendToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:e})}_onMoonToggle(e){this._emit({...this._config??{type:"",entry_id:""},show_moon:e})}_onHideInactiveToggle(e){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:e})}_onStateColorToggle(e){this._emit({...this._config??{type:"",entry_id:""},state_color:e})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),s=Number.isFinite(t)?t:0;this._emit({...this._config??{type:"",entry_id:""},north_offset:s})}_onControlToggle(e,t){const s=this._config??{type:"",entry_id:""};this._emit({...s,controls:{...s.controls,[e]:t}})}_onCoverColorChange(e){const t=this._config??{type:"",entry_id:""};this._emit({...t,cover_colors:[e]})}_onCoverColorReset(){const e={...this._config??{type:"",entry_id:""}};delete e.cover_colors,this._emit(e)}render(){if(!this._config)return q;const e=new Set(this._currentSections);return U`
      <div class="form">
        <div class="section">
          <label class="field-label">${He("editor.common.entry_id",this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${He("editor.main.sections",this.hass)}</label>
          <div class="hint">${He("editor.main.sections_hint",this.hass)}</div>
          ${Hi.map(t=>U`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${e.has(t.key)}
                  @change=${e=>this._onSectionToggle(t.key,e.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${He(t.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${He(t.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${He("editor.main.controls",this.hass)}</label>
          <div class="hint">${He("editor.main.controls_hint",this.hass)}</div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.integration_enabled??!0}
              @change=${e=>this._onControlToggle("integration_enabled",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${He("editor.main.integration_pill_label",this.hass)}</span
              >
              <span class="toggle-desc">${He("editor.main.integration_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.automatic_control??!0}
              @change=${e=>this._onControlToggle("automatic_control",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${He("editor.main.automatic_pill_label",this.hass)}</span>
              <span class="toggle-desc">${He("editor.main.automatic_pill_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.reset_manual_override??!0}
              @change=${e=>this._onControlToggle("reset_manual_override",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${He("editor.main.reset_button_label",this.hass)}</span>
              <span class="toggle-desc">${He("editor.main.reset_button_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        ${this._config.entry_id?U`
              <div class="section">
                <label class="field-label">${He("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${He("editor.compass.cover_colors_hint",this.hass)}</div>
                ${(()=>{const e=this._config.cover_colors?.[0]??null,t=e??Ss(0);return U`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${t}
                        @change=${e=>this._onCoverColorChange(e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-desc"
                          >${e||He("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!e}
                        @click=${()=>this._onCoverColorReset()}
                      >
                        ${He("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})()}
              </div>
            `:q}

        <div class="section">
          <label class="field-label">${He("editor.main.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${e=>this._onCompactToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${He("editor.main.compact_label",this.hass)}</span>
              <span class="toggle-desc">${He("editor.main.compact_desc",this.hass)}</span>
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
                >${He("editor.main.show_compass_stats_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${He("editor.main.show_compass_stats_desc",this.hass)}</span
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
                >${He("editor.main.show_compass_legend_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${He("editor.main.show_compass_legend_desc",this.hass)}</span
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
              <span class="toggle-label">${He("editor.main.show_moon_label",this.hass)}</span>
              <span class="toggle-desc">${He("editor.main.show_moon_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.hide_inactive_handlers??!1}
              @change=${e=>this._onHideInactiveToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${He("editor.main.hide_inactive_label",this.hass)}</span>
              <span class="toggle-desc">${He("editor.main.hide_inactive_desc",this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${!1!==this._config.state_color}
              @change=${e=>this._onStateColorToggle(e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${He("editor.main.state_color_label",this.hass)}</span>
              <span class="toggle-desc">${He("editor.main.state_color_desc",this.hass)}</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">${He("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${He("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${Di(this.hass)}
      </div>
    `}_renderEntryPicker(){return this._entriesError?U`
        <div class="error">
          ${He("editor.common.load_failed",this.hass,{error:this._entriesError})}
        </div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder=${He("editor.common.entry_id_manual_placeholder",this.hass)}
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?U`
        <div class="error">
          ${He("editor.common.no_entries",this.hass)}
          <code>${He("editor.common.no_entries_path",this.hass)}</code>${He("editor.common.no_entries_then",this.hass)}
        </div>
      `:U`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(e=>e.entry_id===this._config.entry_id)?U`<option value=${this._config.entry_id}>
              ${He("editor.common.unknown_entry",this.hass,{entry:this._config.entry_id})}
            </option>`:q}
        ${this._entries.map(e=>U`
            <option value=${e.entry_id} ?selected=${e.entry_id===this._config?.entry_id}>
              ${e.title}
            </option>
          `)}
      </select>
    `:U`<div class="hint">${He("editor.common.loading_entries",this.hass)}</div>`}};Qi.styles=r`
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
  `,e([ge({attribute:!1})],Qi.prototype,"hass",void 0),e([_e()],Qi.prototype,"_config",void 0),e([_e()],Qi.prototype,"_entries",void 0),e([_e()],Qi.prototype,"_entriesError",void 0),Qi=e([he(be)],Qi);const Zi=[{key:"compact",labelKey:"editor.compass.toggle_compact_label",descKey:"editor.compass.toggle_compact_desc",defaultOn:!1},{key:"show_legend",labelKey:"editor.compass.toggle_legend_label",descKey:"editor.compass.toggle_legend_desc",defaultOn:!0},{key:"show_stats",labelKey:"editor.compass.toggle_stats_label",descKey:"editor.compass.toggle_stats_desc",defaultOn:!0},{key:"show_moon",labelKey:"editor.compass.toggle_moon_label",descKey:"editor.compass.toggle_moon_desc",defaultOn:!1},{key:"show_cardinals",labelKey:"editor.compass.toggle_cardinals_label",descKey:"editor.compass.toggle_cardinals_desc",defaultOn:!0},{key:"show_blind_spot",labelKey:"editor.compass.toggle_blind_spot_label",descKey:"editor.compass.toggle_blind_spot_desc",defaultOn:!0},{key:"show_sun_path",labelKey:"editor.compass.toggle_sun_path_label",descKey:"editor.compass.toggle_sun_path_desc",defaultOn:!0},{key:"show_sunrise_sunset",labelKey:"editor.compass.toggle_sunrise_sunset_label",descKey:"editor.compass.toggle_sunrise_sunset_desc",defaultOn:!0},{key:"show_cover_fill",labelKey:"editor.compass.toggle_cover_fill_label",descKey:"editor.compass.toggle_cover_fill_desc",defaultOn:!0},{key:"show_window_arrow",labelKey:"editor.compass.toggle_window_arrow_label",descKey:"editor.compass.toggle_window_arrow_desc",defaultOn:!0},{key:"show_elevation_chart",labelKey:"editor.compass.toggle_elevation_chart_label",descKey:"editor.compass.toggle_elevation_chart_desc",defaultOn:!0}];let Xi=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ht(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${ye}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let s=0;s<e.length;s++)e[s]&&(t=s);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,s){const i=this._trimColors(t),{cover_colors:o,...n}=e,r=i?{...n,...s,cover_colors:i}:{...n,...s};this._emit(r)}_onCoverColorChange(e,t){const s=this._baseConfig(),i=[...s.cover_colors??[]];for(;i.length<=e;)i.push(null);i[e]=t,this._emitWithColors(s,i)}_onCoverColorReset(e){const t=this._baseConfig(),s=[...t.cover_colors??[]];e<s.length&&(s[e]=null),this._emitWithColors(t,s)}_onEntryToggle(e,t){const s=this._baseConfig(),i=new Set(s.entry_ids);t?i.add(e):i.delete(e);const o=(this._entries??[]).map(e=>e.entry_id).filter(e=>i.has(e)),n=s.cover_colors??[],r=o.map(e=>{const t=s.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(s,r,{entry_ids:o})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onNorthOffsetChange(e){const t=parseFloat(e.target.value),s=Number.isFinite(t)?t:0;this._emit({...this._baseConfig(),north_offset:s})}_onTitleChange(e){const t=e.target.value,s=this._baseConfig();if(t)this._emit({...s,title:t});else{const{title:e,...t}=s;this._emit(t)}}render(){if(!this._config)return q;const e=new Set(this._config.entry_ids);return U`
      <div class="form">
        <div class="section">
          <label class="field-label">${He("editor.compass.instances",this.hass)}</label>
          <div class="hint">${He("editor.compass.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(e)}
        </div>

        <div class="section">
          <label class="field-label">${He("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${He("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?U`
              <div class="section">
                <label class="field-label">${He("editor.compass.cover_colors",this.hass)}</label>
                <div class="hint">${He("editor.compass.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const s=this._config.cover_colors?.[t]??null,i=s??Ss(t),o=this._entries?.find(t=>t.entry_id===e);return U`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${i}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${o?.title??e}</span>
                        <span class="toggle-desc"
                          >${s||He("editor.compass.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!s}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${He("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:q}

        <div class="section">
          <label class="field-label">${He("editor.compass.display",this.hass)}</label>
          ${Zi.map(e=>U`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${this._config[e.key]??e.defaultOn}
                  @change=${t=>this._onToggle(e.key,t.target.checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${He(e.labelKey,this.hass)}</span>
                  <span class="toggle-desc">${He(e.descKey,this.hass)}</span>
                </span>
              </label>
            `)}
        </div>

        <div class="section">
          <label class="field-label">${He("editor.common.north_offset",this.hass)}</label>
          <div class="hint">${He("editor.common.north_offset_hint",this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset??0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${Di(this.hass)}
      </div>
    `}_renderEntryPicker(e){return this._entriesError?U`<div class="error">
        ${He("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?U`
        <div class="error">
          ${He("editor.common.no_entries",this.hass)}
          <code>${He("editor.common.no_entries_path",this.hass)}</code>${He("editor.common.no_entries_then",this.hass)}
        </div>
      `:U`
      <div class="entry-list">
        ${this._entries.map(t=>U`
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
    `:U`<div class="hint">${He("editor.common.loading_entries",this.hass)}</div>`}};Xi.styles=r`
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
  `,e([ge({attribute:!1})],Xi.prototype,"hass",void 0),e([_e()],Xi.prototype,"_config",void 0),e([_e()],Xi.prototype,"_entries",void 0),e([_e()],Xi.prototype,"_entriesError",void 0),Xi=e([he(we)],Xi);let Ji=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._listMemo=Pt(),this._discoveredResult={list:[],missing:[]}}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");if(this._config={...e,entry_ids:[...e.entry_ids]},e.tooltips&&Ot(e.tooltips),null===this._registry){const e=this._config.entry_ids.map(e=>Qt.get(e)?.entries);e.every(e=>void 0!==e)&&(this._registry=e.flat())}}getCardSize(){return 4}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(we)}static async getStubConfig(e){let t=[];try{const s=await Ht(e);s[0]&&(t=[s[0].entry_id])}catch{}return{type:`custom:${ye}`,entry_ids:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Lt();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=[];for(const e of this._discoveredResult.list)t.push(...Object.values(e.entities));return 0===t.length||me(e.get("hass"),this.hass,t)}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discoveredResult=this._listMemo(this.hass,this._config.entry_ids,this._registry,this._config.type))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Bt(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Ut(this.hass,e).then(e=>{if(e!==this._registry&&(this._registry=e,this._registryError=null,this._config))for(const t of this._config.entry_ids)Qt.set(t,Xt(e,t))}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return U`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?He("tile.registry_failed",this.hass,{error:this._registryError}):He("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const{list:e,missing:t}=this._discoveredResult;if(0===e.length)return U`<ha-card>
        <div class="empty">
          <p><strong>${He("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${He("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const s=this._config;return U`
      <ha-card>
        ${s.title?U`<div class="card-header">${s.title}</div>`:q}
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
          .northOffsetDeg=${ft(s.north_offset??0)}
        ></acp-sky-compass>
        ${!1!==s.show_elevation_chart?U`<acp-elevation-chart
              .hass=${this.hass}
              .discoveredList=${e}
              .coverColors=${s.cover_colors??[]}
              ?compact=${!!s.compact}
            ></acp-elevation-chart>`:q}
        ${t.length>0?U`<div class="warn dim">
              ${He("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:q}
      </ha-card>
    `}};Ji.styles=r`
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
  `,e([ge({attribute:!1})],Ji.prototype,"hass",void 0),e([_e()],Ji.prototype,"_config",void 0),e([_e()],Ji.prototype,"_registry",void 0),e([_e()],Ji.prototype,"_registryError",void 0),Ji=e([he(ye)],Ji),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ye)||window.customCards.push({type:ye,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-SAA plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:qt(`custom:${ye}`,"entry_ids")});const eo={compact:!1,hide_inactive_handlers:!1,show_decision_summary:!0},to={entry_id:"editor.common.entry_id",title:"editor.decision.title",compact:"editor.decision.compact_label",hide_inactive_handlers:"editor.decision.hide_inactive_handlers_label",show_decision_summary:"editor.decision.show_decision_summary_label"},so={compact:"editor.decision.compact_desc",hide_inactive_handlers:"editor.decision.hide_inactive_handlers_desc",show_decision_summary:"editor.decision.show_decision_summary_desc"};let io=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._entriesFetchInFlight=!1,this._computeLabel=e=>{const t=to[e.name];return t?He(t,this.hass):e.name},this._computeHelper=e=>{const t=so[e.name];return t?He(t,this.hass):void 0},this._valueChanged=e=>{e.stopPropagation();const t={...e.detail.value};for(const[e,s]of Object.entries(eo))this._config&&Object.prototype.hasOwnProperty.call(this._config,e)||t[e]!==s||delete t[e];const s={...this._config??{type:"",entry_id:""},...t};this._emit(s)}}setConfig(e){this._config={...e}}updated(e){e.has("hass")&&this.hass&&this._ensureEntries()}_ensureEntries(){this._entries||this._entriesFetchInFlight||(this._entriesFetchInFlight=!0,Ht(this.hass).then(e=>{this._entries=e,this._entriesError=null,this._config?.entry_id||1!==e.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:e[0].entry_id})}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._entriesFetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this._config)return q;if(this._entriesError&&!this._entries)return U`
        <div class="form">
          <div class="error">
            ${He("editor.common.load_failed",this.hass,{error:this._entriesError})}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${He("editor.common.entry_id_fallback_label",this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id??""}
            placeholder=${He("editor.common.entry_id_manual_placeholder",this.hass)}
            @change=${e=>this._emit({...this._config??{type:"",entry_id:""},entry_id:e.target.value})}
          />
          ${Di(this.hass)}
        </div>
      `;const e=this._schema(),t={...eo,...this._config};return U`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${t}
          .schema=${e}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${Di(this.hass)}
      </div>
    `}_schema(){const e=this._entries?.map(e=>({value:e.entry_id,label:e.title}))??[];return[{name:"entry_id",required:!0,selector:{select:{options:e,mode:"dropdown"}}},{name:"title",selector:{text:{}}},{name:"compact",selector:{boolean:{}}},{name:"hide_inactive_handlers",selector:{boolean:{}}},{name:"show_decision_summary",selector:{boolean:{}}}]}};io.styles=r`
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
  `,e([ge({attribute:!1})],io.prototype,"hass",void 0),e([_e()],io.prototype,"_config",void 0),e([_e()],io.prototype,"_entries",void 0),e([_e()],io.prototype,"_entriesError",void 0),io=e([he(Ae)],io);let oo=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._fetchGen=0,this._memo=Nt(),this._discovered=null}setConfig(e){if(!e||"string"!=typeof e.entry_id||0===e.entry_id.length)throw new Error(`${ke}: \`entry_id\` is required and must be a non-empty string`);if(this._config={...e},e.tooltips&&Ot(e.tooltips),null===this._registry){const t=Qt.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 3}getGridOptions(){return{columns:12,rows:"auto",min_columns:4,max_columns:12}}static async getStubConfig(e){let t="";try{const s=await Ht(e);t=s[0]?.entry_id??""}catch{}return{type:`custom:${ke}`,entry_id:t}}static async getConfigElement(){return document.createElement(Ae)}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Lt();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||me(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,{type:this._config.type,entry_id:this._config.entry_id},this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Bt(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){if(this._fetchInFlight)return;this._fetchInFlight=!0;const t=++this._fetchGen;Ut(this.hass,e).then(e=>{t===this._fetchGen&&e!==this._registry&&(this._registry=e,this._registryError=null,this._config&&Qt.set(this._config.entry_id,Xt(e,this._config.entry_id)))}).catch(e=>{t===this._fetchGen&&(this._registryError=e?.message??"entity registry fetch failed")}).finally(()=>{t===this._fetchGen&&(this._fetchInFlight=!1)})}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return U`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?He("tile.registry_failed",this.hass,{error:this._registryError}):He("tile.loading",this.hass)}
          </p>
        </div>
      </ha-card>`;const e=this._discovered;if(!e)return U`<ha-card>
        <div class="empty">
          <p class="dim">
            ${He("tile.entry_not_found",this.hass,{entry:this._config.entry_id})}
          </p>
        </div>
      </ha-card>`;const t=this._config;return U`
      <ha-card>
        ${t.title?U`<div class="card-header">${t.title}</div>`:q}
        <acp-decision-strip
          .hass=${this.hass}
          .discovered=${e}
          ?compact=${!!t.compact}
          ?hide-inactive=${!!t.hide_inactive_handlers||!!t.compact}
          .showSummary=${!1!==t.show_decision_summary}
        ></acp-decision-strip>
      </ha-card>
    `}};oo.styles=r`
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
  `,e([ge({attribute:!1})],oo.prototype,"hass",void 0),e([_e()],oo.prototype,"_config",void 0),e([_e()],oo.prototype,"_registry",void 0),e([_e()],oo.prototype,"_registryError",void 0),oo=e([he(ke)],oo),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ke)||window.customCards.push({type:ke,name:"Adaptive Cover Pro — Decision Strip",description:"Standalone decision strip: all pipeline handlers for one Adaptive Cover Pro instance with the winning row highlighted.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:qt(`custom:${ke}`,"entry_id")});let no=class extends ce{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(e){this._config=e}updated(e){e.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,Ht(this.hass).then(e=>{this._entries=e,this._entriesError=null}).catch(e=>{this._entriesError=e?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${Se}`,entry_ids:[]}}_trimColors(e){let t=-1;for(let s=0;s<e.length;s++)e[s]&&(t=s);if(!(t<0))return e.slice(0,t+1)}_emitWithColors(e,t,s){const i=this._trimColors(t),{cover_colors:o,...n}=e,r=i?{...n,...s,cover_colors:i}:{...n,...s};this._emit(r)}_onCoverColorChange(e,t){const s=this._baseConfig(),i=[...s.cover_colors??[]];for(;i.length<=e;)i.push(null);i[e]=t,this._emitWithColors(s,i)}_onCoverColorReset(e){const t=this._baseConfig(),s=[...t.cover_colors??[]];e<s.length&&(s[e]=null),this._emitWithColors(t,s)}_onEntryToggle(e,t){const s=this._baseConfig(),i=new Set(s.entry_ids);t?i.add(e):i.delete(e);const o=(this._entries??[]).map(e=>e.entry_id).filter(e=>i.has(e)),n=s.cover_colors??[],r=o.map(e=>{const t=s.entry_ids.indexOf(e);return t>=0?n[t]??null:null});this._emitWithColors(s,r,{entry_ids:o})}_onToggle(e,t){this._emit({...this._baseConfig(),[e]:t})}_onTitleChange(e){const t=e.target.value,s=this._baseConfig();if(t)this._emit({...s,title:t});else{const{title:e,...t}=s;this._emit(t)}}render(){if(!this._config)return q;const e=new Set(this._config.entry_ids);return U`
      <div class="form">
        <div class="section">
          <label class="field-label">${He("editor.solar_chart.instances",this.hass)}</label>
          <div class="hint">${He("editor.solar_chart.instances_hint",this.hass)}</div>
          ${this._renderEntryPicker(e)}
        </div>

        <div class="section">
          <label class="field-label">${He("editor.common.title_optional",this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title??""}
            placeholder=${He("editor.common.title_placeholder",this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length>0?U`
              <div class="section">
                <label class="field-label"
                  >${He("editor.solar_chart.cover_colors",this.hass)}</label
                >
                <div class="hint">${He("editor.solar_chart.cover_colors_hint",this.hass)}</div>
                ${this._config.entry_ids.map((e,t)=>{const s=this._config.cover_colors?.[t]??null,i=s??Ss(t),o=this._entries?.find(t=>t.entry_id===e);return U`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${i}
                        @change=${e=>this._onCoverColorChange(t,e.target.value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${o?.title??e}</span>
                        <span class="toggle-desc"
                          >${s||He("editor.solar_chart.default_color",this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!s}
                        @click=${()=>this._onCoverColorReset(t)}
                      >
                        ${He("editor.common.reset",this.hass)}
                      </button>
                    </div>
                  `})}
              </div>
            `:q}

        <div class="section">
          <label class="field-label">${He("editor.solar_chart.display",this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact??!1}
              @change=${e=>this._onToggle("compact",e.target.checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${He("editor.solar_chart.toggle_compact_label",this.hass)}</span
              >
              <span class="toggle-desc"
                >${He("editor.solar_chart.toggle_compact_desc",this.hass)}</span
              >
            </span>
          </label>
        </div>
        ${Di(this.hass)}
      </div>
    `}_renderEntryPicker(e){return this._entriesError?U`<div class="error">
        ${He("editor.common.load_failed",this.hass,{error:this._entriesError})}
      </div>`:this._entries?0===this._entries.length?U`
        <div class="error">
          ${He("editor.common.no_entries",this.hass)}
          <code>${He("editor.common.no_entries_path",this.hass)}</code>${He("editor.common.no_entries_then",this.hass)}
        </div>
      `:U`
      <div class="entry-list">
        ${this._entries.map(t=>U`
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
    `:U`<div class="hint">${He("editor.common.loading_entries",this.hass)}</div>`}};no.styles=r`
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
  `,e([ge({attribute:!1})],no.prototype,"hass",void 0),e([_e()],no.prototype,"_config",void 0),e([_e()],no.prototype,"_entries",void 0),e([_e()],no.prototype,"_entriesError",void 0),no=e([he(Ce)],no);let ro=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._listMemo=Pt(),this._discoveredResult={list:[],missing:[]}}setConfig(e){if(!e||!Array.isArray(e.entry_ids)||0===e.entry_ids.length)throw new Error("adaptive-cover-pro-solar-chart-card: `entry_ids` must be a non-empty array");if(e.entry_ids.some(e=>"string"!=typeof e||0===e.length))throw new Error("adaptive-cover-pro-solar-chart-card: every `entry_ids` entry must be a non-empty string");if(this._config={...e,entry_ids:[...e.entry_ids]},e.tooltips&&Ot(e.tooltips),null===this._registry){const e=this._config.entry_ids.map(e=>Qt.get(e)?.entries);e.every(e=>void 0!==e)&&(this._registry=e.flat())}}getCardSize(){return 2}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(Ce)}static async getStubConfig(e){let t=[];try{const s=await Ht(e);s[0]&&(t=[s[0].entry_id])}catch{}return{type:`custom:${Se}`,entry_ids:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Lt();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){if(e.size>1||!e.has("hass"))return!0;const t=[];for(const e of this._discoveredResult.list)t.push(...Object.values(e.entities));return 0===t.length||me(e.get("hass"),this.hass,t)}willUpdate(e){this._config&&this.hass&&null!==this._registry&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discoveredResult=this._listMemo(this.hass,this._config.entry_ids,this._registry,this._config.type))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Bt(this.hass,()=>{this._fetchRegistry(!0)}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Ut(this.hass,e).then(e=>{if(e!==this._registry&&(this._registry=e,this._registryError=null,this._config))for(const t of this._config.entry_ids)Qt.set(t,Xt(e,t))}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return U`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?He("tile.registry_failed",this.hass,{error:this._registryError}):He("root.loading_registry",this.hass)}
          </p>
        </div>
      </ha-card>`;const{list:e,missing:t}=this._discoveredResult;if(0===e.length)return U`<ha-card>
        <div class="empty">
          <p><strong>${He("root.compass_no_match",this.hass)}</strong></p>
          <p class="dim">
            ${He("root.compass_configured",this.hass,{entries:this._config.entry_ids.join(", ")})}
          </p>
        </div>
      </ha-card>`;const s=this._config;return U`
      <ha-card>
        ${s.title?U`<div class="card-header">${s.title}</div>`:q}
        <acp-elevation-chart
          .hass=${this.hass}
          .discoveredList=${e}
          .coverColors=${s.cover_colors??[]}
          ?compact=${!!s.compact}
        ></acp-elevation-chart>
        ${t.length>0?U`<div class="warn dim">
              ${He("root.compass_not_found",this.hass,{entries:t.join(", ")})}
            </div>`:q}
      </ha-card>
    `}};ro.styles=r`
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
  `,e([ge({attribute:!1})],ro.prototype,"hass",void 0),e([_e()],ro.prototype,"_config",void 0),e([_e()],ro.prototype,"_registry",void 0),e([_e()],ro.prototype,"_registryError",void 0),ro=e([he(Se)],ro),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===Se)||window.customCards.push({type:Se,name:"Adaptive Cover Pro — Solar Chart",description:"Standalone solar elevation-vs-time chart; overlay one or more entries’ field-of-view windows.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:qt(`custom:${Se}`,"entry_ids")});const ao=["sky","elevation","decision","covers","overrides","climate"];let lo=class extends ce{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._dialogOpen=!1,this._discoveredList=[],this._discoveredListSource=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=Nt(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3,this._openDialog=()=>{this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1},this._onHeaderInfoKeydown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openDialog())}}setConfig(e){if(!e?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...e},e.tooltips&&Ot(e.tooltips),null===this._registry){const t=Qt.get(e.entry_id);t&&(this._registry=t.entries)}}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,max_columns:12}}static async getConfigElement(){return document.createElement(be)}static async getStubConfig(e){let t="";try{const s=await Ht(e);t=s[0]?.entry_id??""}catch{}return{type:`custom:${ve}`,entry_id:t}}connectedCallback(){if(super.connectedCallback(),null===this._registry){const e=Lt();e&&(this._registry=e)}this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(e){e.has("hass")&&this.hass&&this._ensureRegistry()}shouldUpdate(e){return e.size>1||!e.has("hass")||(!this._discovered||me(e.get("hass"),this.hass,Object.values(this._discovered.entities)))}willUpdate(e){null!==this._registry&&this._config&&this.hass&&(e.has("hass")||e.has("_registry")||e.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry)),this._discovered!==this._discoveredListSource&&(this._discoveredListSource=this._discovered,this._discoveredList=this._discovered?[this._discovered]:[])}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Bt(this.hass,e=>{const t=new Set(Xt(this._registry??[],this._config?.entry_id??"").map(e=>e.entity_id));(function(e,t){return"create"===e.action||t.has(e.entity_id)})(e,t)&&this._scheduleRefetch()}))}_fetchRegistry(e=!1){this._fetchInFlight||(this._fetchInFlight=!0,Ut(this.hass,e).then(e=>{if(e===this._registry)return;const t=this._config?.entry_id;if(t){const s=Xt(e,t);(null===this._registry||function(e,t){if(e.length!==t.length)return!0;const s=new Map(e.map(e=>[e.entity_id,Zt(e)]));for(const e of t)if(s.get(e.entity_id)!==Zt(e))return!0;return!1}(Xt(this._registry,t),s))&&(this._registry=e,s.length&&Qt.set(t,s))}else this._registry=e;this._registryError=null}).catch(e=>{this._registryError=e?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const e=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=e);const t=e-this._debounceFirstAt,s=this._DEBOUNCE_MAX-t,i=Math.min(this._DEBOUNCE_DELAY,s);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),i<=0)return this._debounceFirstAt=null,void this._fetchRegistry(!0);this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry(!0)},i)}get _sections(){return this._config?.show_sections??ao}_renderHeader(e,t){const s=e.managed_covers?.[0],i=s?this.hass.states[s]:void 0,o=i?.attributes?.current_position,n=tt({explicitIcon:i?.attributes?.icon,deviceClass:i?.attributes?.device_class,coverType:e.cover_type,position:"number"!=typeof o||Number.isNaN(o)?null:o}),r=!1!==this._config.state_color?st(i?.state):null,a=e.entities.integration_enabled_switch,l=e.entities.automatic_control_switch,c=!a||"on"===this.hass.states[a]?.state,d=!l||"on"===this.hass.states[l]?.state;return U`
      <div class="header">
        <div
          class="header-info"
          role="button"
          tabindex="0"
          @click=${this._openDialog}
          @keydown=${this._onHeaderInfoKeydown}
        >
          <ha-icon .icon=${n} style=${r?`color: ${r}`:""}></ha-icon>
          <span class="title">${e.entry_title}</span>
        </div>
        <span class="spacer"></span>
        ${a?U`<acp-header-pill
              .on=${c}
              .readonly=${!t.integration_enabled}
              .label=${He(c?"header.on":"header.off",this.hass)}
              title=${He("header.integration_enabled",this.hass)}
              @pill-click=${()=>this._toggle(a)}
            ></acp-header-pill>`:q}
        ${l?U`<acp-header-pill
              .on=${d}
              .readonly=${!t.automatic_control}
              .label=${He("header.auto",this.hass)}
              title=${He("header.automatic_control",this.hass)}
              @pill-click=${()=>this._toggle(l)}
            ></acp-header-pill>`:q}
      </div>
    `}_toggle(e){const t=e.split(".")[0];this.hass.callService(t,"toggle",{entity_id:e})}_renderLoading(){return U`
      <ha-card>
        <div class="empty">
          <p class="dim">${He("root.loading_registry",this.hass)}</p>
        </div>
      </ha-card>
    `}_renderEmpty(e){const t=this._config.entry_id,s=this._registry?.length??0,i=this._registry?.filter(e=>e.config_entry_id===t&&"adaptive_cover_pro"===e.platform).length;return U`
      <ha-card>
        <div class="empty">
          <p><strong>${He("root.no_entities_title",this.hass)}</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${t}</code></p>
          <ul class="diag">
            <li>Reason: <code>${e}</code></li>
            <li>Registry entries loaded: <code>${s}</code></li>
            <li>ACP entities matching entry_id: <code>${i??"—"}</code></li>
            ${this._registryError?U`<li>Registry fetch error: <code>${this._registryError}</code></li>`:q}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return q;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const e=this._discovered;if(!e)return this._renderEmpty("no matching entities after unique_id lookup");const t=(s=this._config,{...Ke,...s?.controls});var s;if(e.is_group)return U`
        <ha-card>
          ${this._renderHeader(e,t)}
          <div class="body ${this._config.compact?"compact":""}">
            <acp-group-view
              .hass=${this.hass}
              .discovered=${e}
              ?compact=${!!this._config.compact}
            ></acp-group-view>
          </div>
        </ha-card>
      `;const i=this._sections;return U`
      <ha-card>
        ${this._renderHeader(e,t)}
        <div class="body ${this._config.compact?"compact":""}">
          ${i.includes("sky")?U`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
                .coverColors=${this._config.cover_colors??[]}
                .northOffsetDeg=${ft(this._config.north_offset??0)}
              ></acp-sky-compass>`:q}
          ${i.includes("elevation")?U`<acp-elevation-chart
                .hass=${this.hass}
                .discoveredList=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .coverColors=${this._config.cover_colors??[]}
              ></acp-elevation-chart>`:q}
          ${i.includes("decision")?U`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
                .showSummary=${!1!==this._config.show_decision_summary}
              ></acp-decision-strip>`:q}
          ${i.includes("covers")?U`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .coverColor=${this._config.cover_colors?.[0]??null}
                @acp-open-more-info=${this._openDialog}
              ></acp-cover-bar>`:q}
          ${i.includes("overrides")?U`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
                .resetEnabled=${t.reset_manual_override}
              ></acp-overrides-panel>`:q}
          ${i.includes("climate")?U`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:q}
          ${i.includes("solar")?U`<acp-solar-calc
                .hass=${this.hass}
                .discovered=${e}
                ?compact=${!!this._config.compact}
              ></acp-solar-calc>`:q}
        </div>
      </ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${e}
        .open=${this._dialogOpen}
        .stateColor=${!1!==this._config.state_color}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `}};lo.styles=r`
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
  `,e([ge({attribute:!1})],lo.prototype,"hass",void 0),e([_e()],lo.prototype,"_config",void 0),e([_e()],lo.prototype,"_registry",void 0),e([_e()],lo.prototype,"_registryError",void 0),e([_e()],lo.prototype,"_discovered",void 0),e([_e()],lo.prototype,"_dialogOpen",void 0),lo=e([he(ve)],lo),window.customCards=window.customCards||[],window.customCards.push({type:ve,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card",getEntitySuggestion:qt(`custom:${ve}`,"entry_id")}),console.info(`%c adaptive-cover-pro-card %c v${fe} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{lo as AdaptiveCoverProCard};
