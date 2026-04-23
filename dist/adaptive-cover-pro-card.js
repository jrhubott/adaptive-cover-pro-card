/*! adaptive-cover-pro-card v1.2.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,v=g.trustedTypes,_=v?v.emptyScript:"",m=g.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??$)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,m?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,A=w.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,T=`<${M}>`,z=document,P=()=>z.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,I="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,D=/>/g,F=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),W=B(1),V=B(2),q=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),J=new WeakMap,G=z.createTreeWalker(z,129);function X(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===R?"!--"===l[1]?r=U:void 0!==l[1]?r=D:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=F):void 0!==l[3]&&(r=F):r===F?">"===l[0]?(r=o??R,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?F:'"'===l[3]?j:H):r===j||r===H?r=F:r===U||r===D?r=R:(r=F,o=void 0);const h=r===F&&t[e+1].startsWith("/>")?" ":"";n+=r===R?i+T:c>=0?(s.push(a),i.slice(0,c)+E+i.slice(c)+C+h):i+C+(-2===c?e:h)}return[X(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=K(t,e);if(this.el=Q.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=c[n++],i=s.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?st:"?"===r[1]?ot:"@"===r[1]?nt:it}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),G.nextNode(),a.push({type:2,index:++o});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=O(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Y(t,o._$AS(t,e.values),o,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);G.currentNode=s;let o=G.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new rt(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=G.nextNode(),n++)}return G.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),O(t)?t===Z||null==t||""===t?(this._$AH!==Z&&this._$AR(),this._$AH=Z):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Z&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new Q(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new et(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Z}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=Y(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Y(this,s[i+r],e,r),a===q&&(a=this._$AH[r]),n||=!O(a)||a!==this._$AH[r],a===Z?t=Z:t!==Z&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Z?void 0:t}}class ot extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Z)}}class nt extends it{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??Z)===q)return;const i=this._$AH,s=t===Z&&i!==Z||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==Z&&(i===Z||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Q,et),(w.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;class ct extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new et(e.insertBefore(P(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ut=(t=pt,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function gt(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function vt(t){return gt({...t,state:!0,attribute:!1})}const _t="1.2.0",mt="adaptive-cover-pro-card",ft="adaptive-cover-pro-card-editor",yt="adaptive_cover_pro",$t=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default"],bt={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},xt={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},wt={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},kt={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"};function At(t){return`acp-card:registry:v1:${t}`}const St={get(t){try{const e=localStorage.getItem(At(t));if(!e)return null;const i=JSON.parse(e);return 1!==i.schemaVersion?null:i}catch{return null}},set(t,e){try{const i={schemaVersion:1,cardVersion:_t,fetchedAt:Date.now(),entries:e};localStorage.setItem(At(t),JSON.stringify(i))}catch{}},invalidate(t){try{localStorage.removeItem(At(t))}catch{}},clear(){try{const t="acp-card:registry:v1:",e=[];for(let i=0;i<localStorage.length;i++){const s=localStorage.key(i);s?.startsWith(t)&&e.push(s)}e.forEach(t=>localStorage.removeItem(t))}catch{}}};function Et(t){return`${t.entity_id}|${t.unique_id}|${t.platform}|${t.config_entry_id??""}`}function Ct(t,e,i){return t.filter(t=>t.config_entry_id===e&&void 0===i)}let Mt=class extends ct{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return W`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":Z}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};function Tt(t,e){const i=(t-90)*Math.PI/180;return{x:e*Math.cos(i),y:e*Math.sin(i)}}function zt(t,e,i,s=0){const o=t=>(t%360+360)%360,n=o(t),r=o(e);let a=r-n;a<0&&(a+=360);const l=a>180?1:0,c=Tt(n,i),d=Tt(r,i);if(s<=0)return`M 0 0 L ${c.x} ${c.y} A ${i} ${i} 0 ${l} 1 ${d.x} ${d.y} Z`;const h=Tt(r,s),p=Tt(n,s);return[`M ${c.x} ${c.y}`,`A ${i} ${i} 0 ${l} 1 ${d.x} ${d.y}`,`L ${h.x} ${h.y}`,`A ${s} ${s} 0 ${l} 0 ${p.x} ${p.y}`,"Z"].join(" ")}function Pt(t,e){return Tt(t,function(t){return 1-Math.max(0,Math.min(90,t))/90}(e))}function Ot(t){return(t%360+360)%360}function Nt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}Mt.styles=r`
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
  `,t([gt({type:Boolean})],Mt.prototype,"on",void 0),t([gt({type:Boolean})],Mt.prototype,"readonly",void 0),t([gt({type:String})],Mt.prototype,"label",void 0),t([gt({type:String})],Mt.prototype,"title",void 0),Mt=t([ht("acp-header-pill")],Mt);var It,Rt={exports:{}};It=Rt,function(){var t=Math.PI,e=Math.sin,i=Math.cos,s=Math.tan,o=Math.asin,n=Math.atan2,r=Math.acos,a=t/180,l=864e5,c=2440588,d=2451545;function h(t){return new Date((t+.5-c)*l)}function p(t){return function(t){return t.valueOf()/l-.5+c}(t)-d}var u=23.4397*a;function g(t,o){return n(e(t)*i(u)-s(o)*e(u),i(t))}function v(t,s){return o(e(s)*i(u)+i(s)*e(u)*e(t))}function _(t,o,r){return n(e(t),i(t)*e(o)-s(r)*i(o))}function m(t,s,n){return o(e(s)*e(n)+i(s)*i(n)*i(t))}function f(t,e){return a*(280.16+360.9856235*t)-e}function y(t){return a*(357.5291+.98560028*t)}function $(i){return i+a*(1.9148*e(i)+.02*e(2*i)+3e-4*e(3*i))+102.9372*a+t}function b(t){var e=$(y(t));return{dec:v(e,0),ra:g(e,0)}}var x={getPosition:function(t,e,i){var s=a*-i,o=a*e,n=p(t),r=b(n),l=f(n,s)-r.ra;return{azimuth:_(l,o,r.dec),altitude:m(l,o,r.dec)}}},w=x.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];x.addTime=function(t,e,i){w.push([t,e,i])};var k=9e-4;function A(e,i,s){return k+(e+i)/(2*t)+s}function S(t,i,s){return d+t+.0053*e(i)-.0069*e(2*s)}function E(t,s,o,n,a,l,c){var d=function(t,s,o){return r((e(t)-e(s)*e(o))/(i(s)*i(o)))}(t,o,n);return S(A(d,s,a),l,c)}function C(t){var s=a*(134.963+13.064993*t),o=a*(93.272+13.22935*t),n=a*(218.316+13.176396*t)+6.289*a*e(s),r=5.128*a*e(o),l=385001-20905*i(s);return{ra:g(n,r),dec:v(n,r),dist:l}}function M(t,e){return new Date(t.valueOf()+e*l/24)}x.getTimes=function(e,i,s,o){var n,r,l,c,d,u=a*-s,g=a*i,_=function(t){return-2.076*Math.sqrt(t)/60}(o=o||0),m=function(e,i){return Math.round(e-k-i/(2*t))}(p(e),u),f=A(0,u,m),b=y(f),x=$(b),C=v(x,0),M=S(f,b,x),T={solarNoon:h(M),nadir:h(M-.5)};for(n=0,r=w.length;n<r;n+=1)d=M-((c=E(((l=w[n])[0]+_)*a,u,g,C,m,b,x))-M),T[l[1]]=h(d),T[l[2]]=h(c);return T},x.getMoonPosition=function(t,o,r){var l=a*-r,c=a*o,d=p(t),h=C(d),u=f(d,l)-h.ra,g=m(u,c,h.dec),v=n(e(u),s(c)*i(h.dec)-e(h.dec)*i(u));return g+=function(t){return t<0&&(t=0),2967e-7/Math.tan(t+.00312536/(t+.08901179))}(g),{azimuth:_(u,c,h.dec),altitude:g,distance:h.dist,parallacticAngle:v}},x.getMoonIllumination=function(t){var s=p(t||new Date),o=b(s),a=C(s),l=149598e3,c=r(e(o.dec)*e(a.dec)+i(o.dec)*i(a.dec)*i(o.ra-a.ra)),d=n(l*e(c),a.dist-l*i(c)),h=n(i(o.dec)*e(o.ra-a.ra),e(o.dec)*i(a.dec)-i(o.dec)*e(a.dec)*i(o.ra-a.ra));return{fraction:(1+i(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},x.getMoonTimes=function(t,e,i,s){var o=new Date(t);s?o.setUTCHours(0,0,0,0):o.setHours(0,0,0,0);for(var n,r,l,c,d,h,p,u,g,v,_,m,f,y=.133*a,$=x.getMoonPosition(o,e,i).altitude-y,b=1;b<=24&&(n=x.getMoonPosition(M(o,b),e,i).altitude-y,u=((d=($+(r=x.getMoonPosition(M(o,b+1),e,i).altitude-y))/2-n)*(p=-(h=(r-$)/2)/(2*d))+h)*p+n,v=0,(g=h*h-4*d*n)>=0&&(_=p-(f=Math.sqrt(g)/(2*Math.abs(d))),m=p+f,Math.abs(_)<=1&&v++,Math.abs(m)<=1&&v++,_<-1&&(_=m)),1===v?$<0?l=b+_:c=b+_:2===v&&(l=b+(u<0?m:_),c=b+(u<0?_:m)),!l||!c);b+=2)$=r;var w={};return l&&(w.rise=M(o,l)),c&&(w.set=M(o,c)),l||c||(w[u>0?"alwaysUp":"alwaysDown"]=!0),w},It.exports=x}();var Ut=Nt(Rt.exports);function Dt(t,e,i,s=10){const o=[],n=i.getTime()+864e5;for(let r=i.getTime();r<=n;r+=60*s*1e3){const i=new Date(r),s=Ut.getPosition(i,t,e);o.push({t:i,elevation:180*s.altitude/Math.PI,azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360})}return o}function Ft(t=new Date){const e=new Date(t);return e.setHours(0,0,0,0),e}function Ht(t,e,i,s){const o=((e-i)%360+360)%360;return((t-o)%360+360)%360<=((((e+s)%360+360)%360-o)%360+360)%360}function jt(t){return t<.0625||t>=.9375?"New Moon":t<.1875?"Waxing Crescent":t<.3125?"First Quarter":t<.4375?"Waxing Gibbous":t<.5625?"Full Moon":t<.6875?"Waning Gibbous":t<.8125?"Last Quarter":"Waning Crescent"}function Lt(t){return null==t||Number.isNaN(t)?"—":`${Math.round(t)}%`}function Bt(t){return null==t||Number.isNaN(t)?"—":`${t.toFixed(1)}°`}function Wt(t){if(!t)return"—";const e=new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Vt(t){if(!t)return"—";const e=new Date(t).getTime();if(Number.isNaN(e))return"—";const i=Math.round((e-Date.now())/1e3);return i<=0?"expired":function(t){if(null==t||Number.isNaN(t))return"—";const e=Math.max(0,Math.round(t));if(e<60)return`${e}s`;const i=Math.floor(e/60);return i<60?`${i}m ${e%60}s`:`${Math.floor(i/60)}h ${i%60}m`}(i)}const qt=110;let Zt=class extends ct{constructor(){super(...arguments),this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1}_sun(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=parseFloat(e.state);return Number.isNaN(i)?null:{...e.attributes,window_azimuth:e.attributes.window_azimuth}}_coverPosition(){const t=this.discovered.entities.target_position_sensor;if(!t)return null;const e=parseFloat(this.hass.states[t]?.state??"");return Number.isNaN(e)?null:e}_sunInfront(){const t=this.discovered.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}render(){if(!this.hass||!this.discovered)return Z;const t=this._sun();if(!t)return W`<div class="placeholder">Sun sensor not yet populated.</div>`;const e=Ot(t.window_azimuth),i=Ot(e-t.fov_left),s=Ot(e+t.fov_right),o=this.discovered.entities.sun_sensor,n=parseFloat(this.hass.states[o]?.state??"0"),r=t.elevation,a=Pt(n,r),l=Tt(e,qt),{latitude:c,longitude:d}=this.hass.config,h=void 0!==c&&void 0!==d?Dt(c,d,Ft()):[],p=this.showMoon&&void 0!==c&&void 0!==d?function(t,e,i=new Date){const s=Ut.getMoonPosition(i,t,e),o=Ut.getMoonIllumination(i);return{azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360,elevation:180*s.altitude/Math.PI,phase:o.phase,fraction:o.fraction,phaseName:jt(o.phase)}}(c,d):null,u=null!==p&&p.elevation>0,g=p?p.phase<.5?-24*p.phase:24*(1-p.phase):0,v=u?Pt(p.azimuth,p.elevation):null,_=v?v.x*qt:0,m=v?v.y*qt:0,f=h.filter(t=>t.elevation>0).map(t=>{const e=Pt(t.azimuth,t.elevation);return`${(e.x*qt).toFixed(1)},${(e.y*qt).toFixed(1)}`}).join(" "),{riseAzimuth:y,setAzimuth:$}=function(t){let e=-1,i=-1;for(let s=0;s<t.length;s++)t[s].elevation>0&&(-1===e&&(e=s),i=s);return{riseAzimuth:e>=0?t[e].azimuth:null,setAzimuth:i>=0?t[i].azimuth:null}}(h),b=null!==y?Tt(y,qt):null,x=null!==$?Tt($,qt):null,w=t.blind_spot_range?zt(Ot(t.blind_spot_range[0]),Ot(t.blind_spot_range[1]),qt):null,k=this._coverPosition(),A=null!==k?qt*(1-k/100):null,S=t.in_fov,E=this._sunInfront(),C=r<=0,M=!C&&E?"sun valid":!C&&S?"sun in-fov":"sun",T=`Window FOV: ${Bt(t.fov_left)} left / ${Bt(t.fov_right)} right`,z=`Window normal: ${Bt(e)}`,P=`Sun: ${Bt(n)} az / ${Bt(r)} el`,O=null!==k?`Cover closed: ${k}%`:"",N=t.blind_spot_range?`Blind spot: ${Bt(t.blind_spot_range[0])} – ${Bt(t.blind_spot_range[1])}`:"",I=null!==y?`Sunrise: ${Bt(y)}`:"",R=null!==$?`Sunset: ${Bt($)}`:"",U=null!==p?`Moon: ${p.phaseName} (${Math.round(100*p.fraction)}%)`:"";return W`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${V`
            <defs>
              ${u?V`
                <mask id="moon-phase-mask">
                  <circle cx=${_} cy=${m} r=${6} fill="white" />
                  <circle cx=${_+g} cy=${m} r=${6} fill="black" />
                </mask>
              `:Z}
            </defs>
            <!-- concentric elevation rings at 30°, 60° -->
            <circle class="grid" r=${qt} />
            <circle class="grid" r=${220/3} />
            <circle class="grid" r=${qt/3} />
            <!-- cardinal direction lines -->
            <line class="grid thin" x1="0" y1=${-110} x2="0" y2=${qt} />
            <line class="grid thin" x1=${-110} y1="0" x2=${qt} y2="0" />

            <!-- FOV wedge -->
            <g data-tooltip=${T}>
              <title>${T}</title>
              <path class="fov" d=${zt(i,s,qt)} />
            </g>

            <!-- cover closure fill (inner wedge, same FOV span, radius ∝ closure) -->
            ${null!==A&&A>.5?V`<g data-tooltip=${O}><title>${O}</title><path class="cover-fill" d=${zt(i,s,A)} /></g>`:Z}

            <!-- blind spot (hatched) -->
            ${w?V`<g data-tooltip=${N}><title>${N}</title><path class="blind-spot" d=${w} /></g>`:Z}

            <!-- sun path arc -->
            ${f?V`<g data-tooltip="Sun path (today)"><title>Sun path (today)</title><polyline class="sun-path" points=${f} /></g>`:Z}

            <!-- sunrise / sunset markers -->
            ${b&&null!==y?V`<g data-tooltip=${I}><title>${I}</title><circle class="rise-marker" cx=${b.x} cy=${b.y} r="4" /></g>`:Z}
            ${x&&null!==$?V`<g data-tooltip=${R}><title>${R}</title><circle class="set-marker" cx=${x.x} cy=${x.y} r="4" /></g>`:Z}

            <!-- window normal arrow -->
            <g data-tooltip=${z}>
              <title>${z}</title>
              <line class="window" x1="0" y1="0" x2=${l.x} y2=${l.y} />
              <circle class="window-base" cx="0" cy="0" r="4" />
            </g>

            <!-- cardinal labels -->
            <text class="cardinal" x="0" y=${-116} text-anchor="middle">N</text>
            <text class="cardinal" x=${120} y="4" text-anchor="middle">E</text>
            <text class="cardinal" x="0" y=${124} text-anchor="middle">S</text>
            <text class="cardinal" x=${-120} y="4" text-anchor="middle">W</text>

            <!-- moon dot (above-horizon only) -->
            ${u?V`
              <g data-tooltip=${U}>
                <title>${U}</title>
                <circle class="moon-outline" cx=${_} cy=${m} r=${6} />
                <circle class="moon-lit" cx=${_} cy=${m} r=${6} mask="url(#moon-phase-mask)" />
              </g>
            `:Z}

            <!-- sun dot -->
            <g data-tooltip=${P}>
              <title>${P}</title>
              <circle class=${M} cx=${a.x*qt} cy=${a.y*qt} r="7" />
            </g>
          `}
        </svg>
        ${this.showLegend?W`<div class="legend">
              <div><span class="dot sun valid"></span> Sun (in FOV)</div>
              <div><span class="dot sun"></span> Sun (outside)</div>
              ${this.showMoon?W`<div><span class="dot moon-dot"></span> Moon</div>`:Z}
              <div><span class="swatch fov"></span> Window FOV</div>
              <div><span class="swatch sun-path-swatch"></span> Sun path</div>
              <div><span class="dot rise-dot"></span> Sunrise</div>
              <div><span class="dot set-dot"></span> Sunset</div>
              <div><span class="swatch cover-fill-swatch"></span> Cover closed</div>
              <div><span class="swatch window-swatch"></span> Window normal</div>
            </div>`:Z}
        ${this.showStats?W`<div class="stats dim">
              <span>Azi: ${Bt(n)}</span>
              <span>Elev: ${Bt(r)}</span>
              <span>∠: ${Bt(t.gamma)}</span>
              <span>Window: ${Bt(e)}</span>
              ${this.showMoon&&p?W`<span>${p.phaseName} ${Math.round(100*p.fraction)}%</span>`:Z}
            </div>`:Z}
      </div>
    `}};Zt.styles=r`
    :host {
      display: block;
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
      fill: orange;
    }
    .sun.valid {
      fill: gold;
      filter: drop-shadow(0 0 4px gold);
    }
    .legend {
      display: flex;
      gap: 12px;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      flex-wrap: wrap;
      justify-content: center;
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
      background: gold;
      opacity: 0.4;
      border-radius: 2px;
    }
    .dot.sun {
      background: var(--secondary-text-color);
    }
    .dot.sun.valid {
      background: gold;
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
      background: gold;
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
      gap: 12px;
      font-size: 0.78rem;
      flex-wrap: wrap;
      justify-content: center;
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
  `,t([gt({attribute:!1})],Zt.prototype,"hass",void 0),t([gt({attribute:!1})],Zt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Zt.prototype,"compact",void 0),t([gt({attribute:!1})],Zt.prototype,"showStats",void 0),t([gt({attribute:!1})],Zt.prototype,"showLegend",void 0),t([gt({attribute:!1})],Zt.prototype,"showMoon",void 0),Zt=t([ht("acp-sky-compass")],Zt);let Jt=class extends ct{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];return e?e.attributes:null}render(){if(!this.hass||!this.discovered)return Z;const t=this._sunAttrs(),{latitude:e,longitude:i}=this.hass.config;if(void 0===e||void 0===i||!t)return W`<div class="placeholder">Sun elevation chart unavailable.</div>`;const s=Ft(),o=Dt(e,i,s),n=new Date,r=function(t,e,i,s){let o=-1,n=-1,r=-1;for(let a=0;a<t.length;a++){const l=t[a];l.elevation>0&&Ht(l.azimuth,e,i,s)?(-1===r&&(r=a),a-r>n-o&&(o=r,n=a)):r=-1}return-1===o?null:{startIdx:o,endIdx:n}}(o,t.window_azimuth,t.fov_left,t.fov_right),a=t=>32+(t.getTime()-s.getTime())/864e5*360,l=t=>138-(t- -10)/100*128,c=o.map(t=>`${a(t.t).toFixed(1)},${l(t.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(n),p=this._interpAt(o,n),u=p?l(p.elevation):null,g=r?o[r.startIdx].t:null,v=r?o[r.endIdx].t:null,_=g?a(g):null,m=v?a(v):null;return W`
      <div class="wrap">
        <div class="head">
          <span class="label">Sun today</span>
          ${g&&v?W`<span class="dim"
                >FOV: ${Wt(g.toISOString())} →
                ${Wt(v.toISOString())}</span
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
            ${[0,6,12,18,24].map(t=>{const e=new Date(s.getTime()+36e5*t);return V`
                <line class="grid faint" x1=${a(e)} y1=${10} x2=${a(e)} y2=${138} />
                <text class="tick" x=${a(e)} y=${152} text-anchor="middle">${t.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${d} x2=${392} y2=${d} />

            <!-- FOV shaded band (only the time the sun is actually in FOV + above horizon) -->
            ${null!==_&&null!==m?V`<rect
                  class="fov-band"
                  x=${_}
                  y=${10}
                  width=${m-_}
                  height=${128}
                />`:Z}

            <!-- elevation curve -->
            <polyline class="curve" points=${c} />

            <!-- current-time cursor -->
            <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />

            <!-- current sun dot -->
            ${null!==u?V`<circle class="sun-dot" cx=${h} cy=${u} r="4" />`:Z}
          `}
        </svg>
      </div>
    `}_interpAt(t,e){if(0===t.length)return null;const i=e.getTime();if(i<=t[0].t.getTime())return t[0];if(i>=t[t.length-1].t.getTime())return t[t.length-1];for(let s=1;s<t.length;s++)if(t[s].t.getTime()>=i){const o=t[s-1],n=t[s],r=(i-o.t.getTime())/(n.t.getTime()-o.t.getTime());return{t:e,elevation:o.elevation+(n.elevation-o.elevation)*r,azimuth:o.azimuth+(n.azimuth-o.azimuth)*r}}return t[t.length-1]}};Jt.styles=r`
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
  `,t([gt({attribute:!1})],Jt.prototype,"hass",void 0),t([gt({attribute:!1})],Jt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Jt.prototype,"compact",void 0),Jt=t([ht("acp-elevation-chart")],Jt);let Gt=class extends ct{constructor(){super(...arguments),this.compact=!1,this.hideInactive=!1}_trace(){const t=this.discovered.entities.decision_trace_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=e.attributes;if(!i?.trace)return null;const s=new Map;for(const t of i.trace)s.set(Xt(t.handler),{matched:t.matched,reason:t.reason,position:t.position});return{winner:e.state,reason:i.reason??"",steps:s}}render(){if(!this.hass||!this.discovered)return Z;const t=this._trace();if(!t)return W`<div class="placeholder">Decision trace not yet populated.</div>`;const e=(i=$t,s=t.steps,o=t.winner,this.hideInactive?i.filter(t=>t===o||!0===s.get(t)?.matched):[...i]);var i,s,o;return W`
      <div class="wrap">
        <div class="head">
          <span class="label">Pipeline</span>
          <span class="winner">Winner: ${t.winner}</span>
        </div>
        <div class="rows">${e.map(e=>this._row(e,t.steps.get(e),t.winner===e))}</div>
        <div class="reason dim">${t.reason}</div>
      </div>
    `}_row(t,e,i){const s=e?.matched??!1,o=e?.reason??"not evaluated",n=e?.position;return W`
      <div class="row ${i?"winner":s?"match":"skip"}">
        <span class="name">${bt[t]}</span>
        <span class="dots" aria-hidden="true">${s?"████":"────"}</span>
        <span class="pos">${null!=n?Lt(n):""}</span>
        <span class="reason-inline dim">${o}</span>
        ${i?W`<span class="badge">✓</span>`:Z}
      </div>
    `}};function Xt(t){return t.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase().replace(/^force_override$/,"force").replace(/^weather_override$/,"weather").replace(/^manual_override$/,"manual").replace(/^motion_timeout$/,"motion").replace(/^cloud_suppression$/,"cloud")}Gt.styles=r`
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
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      padding: 16px;
      text-align: center;
    }
  `,t([gt({attribute:!1})],Gt.prototype,"hass",void 0),t([gt({attribute:!1})],Gt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Gt.prototype,"compact",void 0),t([gt({type:Boolean,reflect:!0,attribute:"hide-inactive"})],Gt.prototype,"hideInactive",void 0),Gt=t([ht("acp-decision-strip")],Gt);let Kt=class extends ct{constructor(){super(...arguments),this.compact=!1}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return{target:null,covers:{}};const e=this.hass.states[t];if(!e)return{target:null,covers:{}};const i=parseFloat(e.state),s=e.attributes;return{target:Number.isNaN(i)?null:i,covers:s?.actual_positions??{}}}_mismatched(){const t=this.discovered.entities.position_mismatch_binary;if(!t)return new Set;const e=this.hass.states[t];if("on"!==e?.state)return new Set;const i=e.attributes.entities;return i?new Set(Object.entries(i).filter(([,t])=>t.mismatch).map(([t])=>t)):new Set}_setPosition(t,e){this.hass.callService("cover","set_cover_position",{entity_id:t,position:e})}render(){if(!this.hass||!this.discovered)return Z;const{target:t,covers:e}=this._target(),i=this._mismatched(),s=Object.entries(e);return 0===s.length?W`<div class="placeholder">No covers reported by the integration.</div>`:W`
      <div class="wrap">
        <div class="head">
          <span class="label">Covers</span>
          <span class="target">Target: ${Lt(t)}</span>
        </div>
        ${s.map(([e,s])=>this._bar(e,s,t,i.has(e)))}
      </div>
    `}_bar(t,e,i,s){const o=this.hass.states[t]?.attributes?.friendly_name??t,n=i??0;return W`
      <div class="cover ${s?"mismatch":""}">
        <div class="name" title=${t}>${o}</div>
        <div
          class="track"
          @click=${e=>this._handleTrackClick(e,t)}
          title="Click to set position"
        >
          <div class="fill" style="width:${e??0}%"></div>
          ${null!==i?W`<div
                class="marker"
                style="left:${n}%"
                title="Target ${n}%"
              ></div>`:Z}
        </div>
        <div class="num">${Lt(e)}</div>
        ${s?W`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:Z}
      </div>
    `}_handleTrackClick(t,e){const i=t.currentTarget.getBoundingClientRect(),s=Math.round((t.clientX-i.left)/i.width*100),o=Math.max(0,Math.min(100,s));this._setPosition(e,o)}};Kt.styles=r`
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
  `,t([gt({attribute:!1})],Kt.prototype,"hass",void 0),t([gt({attribute:!1})],Kt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Kt.prototype,"compact",void 0),Kt=t([ht("acp-cover-bar")],Kt);let Qt=class extends ct{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualEndIso(){const t=this.discovered.entities.manual_override_end_sensor;if(!t)return null;const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:null}_motionStatus(){const t=this.discovered.entities.motion_status_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=e.attributes.motion_timeout_end_time;return{state:e.state,endIso:i??null}}_forceActive(){const t=this.discovered.entities.force_override_sensor;if(!t)return 0;const e=this.hass.states[t];return e&&parseInt(e.state,10)||0}_resetManual(){const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}render(){if(!this.hass||!this.discovered)return Z;const t=this._manualActive(),e=this._manualEndIso(),i=this._motionStatus(),s=this._forceActive(),o=this.discovered.entities.reset_override_button;return W`
      <div class="wrap">
        <div class="label dim">Overrides</div>
        <div class="grid">
          <div class="tile ${t?"active":""}">
            <div class="tile-label">Manual</div>
            <div class="tile-value">${t?"Active":"Off"}</div>
            ${e?W`<div class="tile-sub dim">ends in ${Vt(e)}</div>`:Z}
          </div>

          <div class="tile ${s>0?"active warning":""}">
            <div class="tile-label">Force</div>
            <div class="tile-value">${s>0?`${s} active`:"Off"}</div>
          </div>

          ${i?W`<div class="tile ${"motion_detected"===i.state?"active":""}">
                <div class="tile-label">Motion</div>
                <div class="tile-value">${i.state.replace(/_/g," ")}</div>
                ${i.endIso?W`<div class="tile-sub dim">timeout ${Vt(i.endIso)}</div>`:Z}
              </div>`:Z}
          ${o?this.resetEnabled?W`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">Reset Manual</div>
                </button>`:W`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">Reset Manual</div>
                </button>`:Z}
        </div>
      </div>
    `}};Qt.styles=r`
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
  `,t([gt({attribute:!1})],Qt.prototype,"hass",void 0),t([gt({attribute:!1})],Qt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Qt.prototype,"compact",void 0),t([gt({type:Boolean,attribute:"reset-enabled"})],Qt.prototype,"resetEnabled",void 0),Qt=t([ht("acp-overrides-panel")],Qt);const Yt={"Summer Mode":"mdi:weather-sunny","Winter Mode":"mdi:snowflake",Intermediate:"mdi:weather-partly-cloudy"};let te=class extends ct{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return Z;const t=this.discovered.entities.climate_status_sensor;if(!t)return Z;const e=this.hass.states[t];if(!e||"unavailable"===e.state)return Z;const i=e.state,s=e.attributes??{},o=Yt[i]??"mdi:thermostat",n=s.temperature_unit??"°",r=[void 0!==s.indoor_temperature?{label:"Indoor",value:s.indoor_temperature,unit:n}:null,void 0!==s.outdoor_temperature?{label:"Outdoor",value:s.outdoor_temperature,unit:n}:null].filter(t=>null!==t),a=[{label:"Presence",value:s.is_presence,icon:"mdi:account-check"},{label:"Sunny",value:s.is_sunny,icon:"mdi:white-balance-sunny"},{label:"Lux",value:s.lux_active,icon:"mdi:brightness-7"},{label:"Irradiance",value:s.irradiance_active,icon:"mdi:solar-power"}].filter(t=>void 0!==t.value);return W`
      <div class="wrap">
        <div class="head">
          <span class="label">Climate</span>
          <span class="dim"
            >Active:
            ${void 0!==s.active_temperature?`${s.active_temperature.toFixed(1)}${n}`:"—"}</span
          >
        </div>
        <div class="strategy">
          <ha-icon icon=${o}></ha-icon>
          <span class="strategy-name">${i}</span>
        </div>
        ${r.length?W`
              <div class="temps">
                ${r.map(t=>W`
                    <div class="temp">
                      <span class="temp-label dim">${t.label}</span>
                      <span class="temp-value">${t.value.toFixed(1)}${t.unit}</span>
                    </div>
                  `)}
              </div>
            `:Z}
        ${a.length?W`
              <div class="conditions">
                ${a.map(t=>W`
                    <div class="chip ${t.value?"on":"off"}" title=${t.label}>
                      <ha-icon icon=${t.icon}></ha-icon>
                      <span>${t.label}</span>
                    </div>
                  `)}
              </div>
            `:Z}
      </div>
    `}};te.styles=r`
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
  `,t([gt({attribute:!1})],te.prototype,"hass",void 0),t([gt({attribute:!1})],te.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],te.prototype,"compact",void 0),te=t([ht("acp-climate-panel")],te);const ee=[{key:"sky",label:"Sky compass",description:"Sun vs. window FOV, polar plot"},{key:"elevation",label:"Sun today",description:"Elevation-vs-time chart with FOV band and current-time cursor"},{key:"decision",label:"Decision strip",description:"All 10 pipeline handlers with the winning row highlighted"},{key:"covers",label:"Cover positions",description:"Per-cover live vs. target bars; click to set position"},{key:"overrides",label:"Overrides panel",description:"Manual, force, motion tiles + reset button"},{key:"climate",label:"Climate panel",description:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)"}],ie=ee.map(t=>t.key);let se=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,async function(t){return(await t.callWS({type:"config_entries/get",domain:yt})).filter(t=>t.domain===yt).map(t=>({entry_id:t.entry_id,title:t.title}))}(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id})}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??ie}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_onEntryChange(t){const e=t.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:e})}_onSectionToggle(t,e){const i=new Set(this._currentSections);e?i.add(t):i.delete(t);const s=ee.map(t=>t.key).filter(t=>i.has(t));this._emit({...this._config??{type:"",entry_id:""},show_sections:s})}_onCompactToggle(t){this._emit({...this._config??{type:"",entry_id:""},compact:t})}_onVersionToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_version:t})}_onCompassStatsToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:t})}_onCompassLegendToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:t})}_onMoonToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_moon:t})}_onHideInactiveToggle(t){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:t})}_onControlToggle(t,e){const i=this._config??{type:"",entry_id:""};this._emit({...i,controls:{...i.controls,[t]:e}})}render(){if(!this._config)return Z;const t=new Set(this._currentSections);return W`
      <div class="form">
        <div class="section">
          <label class="field-label">Adaptive Cover Pro instance</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">Sections</label>
          <div class="hint">Toggle which parts of the card are shown.</div>
          ${ee.map(e=>W`
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
            </option>`:Z}
        ${this._entries.map(t=>W`
            <option value=${t.entry_id} ?selected=${t.entry_id===this._config?.entry_id}>
              ${t.title}
            </option>
          `)}
      </select>
    `:W`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};se.styles=r`
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
  `,t([gt({attribute:!1})],se.prototype,"hass",void 0),t([vt()],se.prototype,"_config",void 0),t([vt()],se.prototype,"_entries",void 0),t([vt()],se.prototype,"_entriesError",void 0),se=t([ht(ft)],se);const oe=["sky","elevation","decision","covers","overrides","climate"];let ne=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let t=null,e=null;return(i,s,o)=>{const n=s.entry_id??"";return null!==t&&t.registry===o&&t.hass===i&&t.entryId===n||(t={registry:o,hass:i,entryId:n},e=function(t,e,i){const s=e.entry_id;if(!s)return null;const o={},n=`${s}_`;let r=!1;for(const t of i){if(t.config_entry_id!==s)continue;if(t.platform!==yt)continue;if(r=!0,!t.unique_id.startsWith(n))continue;const e=t.unique_id.slice(n.length),i=t.entity_id.split(".")[0],a=kt[`${i}:${e}`];a&&(o[a]=t.entity_id)}if(!r||0===Object.keys(o).length)return null;const a=t;let l=s;if(a.devices)for(const t of Object.values(a.devices))if(t.config_entries?.includes(s)){l=t.name_by_user??t.name??s;break}const c=[],d=o.target_position_sensor;if(d){const e=t.states[d]?.attributes?.actual_positions;e&&c.push(...Object.keys(e))}let h="cover_blind";const p=o.control_status_sensor;if(p){const e=t.states[p]?.attributes;e?.cover_type&&(h=e.cover_type)}return{entry_id:s,entry_title:l,cover_type:h,entities:o,managed_covers:c}}(i,s,o)),e}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(t){if(!t?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...t},null===this._registry){const e=St.get(t.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(ft)}static getStubConfig(){return{type:`custom:${mt}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(t){null!==this._registry&&this._config&&this.hass&&(t.has("hass")||t.has("_registry")||t.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=function(t,e){let i=null,s=!1;return t.connection.subscribeEvents(t=>e(t.data),"entity_registry_updated").then(t=>{s?t():i=t}).catch(()=>{}),()=>{s=!0,i&&i()}}(this.hass,t=>{const e=new Set(Ct(this._registry??[],this._config?.entry_id??"").map(t=>t.entity_id));(function(t,e){return"create"===t.action||e.has(t.entity_id)})(t,e)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,async function(t){return t.callWS({type:"config/entity_registry/list"})}(this.hass).then(t=>{const e=this._config?.entry_id;if(e){const i=Ct(t,e);(null===this._registry||function(t,e){if(t.length!==e.length)return!0;const i=new Map(t.map(t=>[t.entity_id,Et(t)]));for(const t of e)if(i.get(t.entity_id)!==Et(t))return!0;return!1}(Ct(this._registry,e),i))&&(this._registry=t,St.set(e,i))}else this._registry=t;this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const t=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=t);const e=t-this._debounceFirstAt,i=this._DEBOUNCE_MAX-e,s=Math.min(this._DEBOUNCE_DELAY,i);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),s<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},s)}get _sections(){return this._config?.show_sections??oe}_renderHeader(t,e){const i=xt[t.cover_type]??"mdi:window-shutter",s=t.entities.integration_enabled_switch,o=t.entities.automatic_control_switch,n=!s||"on"===this.hass.states[s]?.state,r=!o||"on"===this.hass.states[o]?.state;return W`
      <div class="header">
        <ha-icon .icon=${i}></ha-icon>
        <span class="title">${t.entry_title}</span>
        <span class="spacer"></span>
        ${s?W`<acp-header-pill
              .on=${n}
              .readonly=${!e.integration_enabled}
              .label=${n?"ON":"OFF"}
              title="Integration Enabled"
              @pill-click=${()=>this._toggle(s)}
            ></acp-header-pill>`:Z}
        ${o?W`<acp-header-pill
              .on=${r}
              .readonly=${!e.automatic_control}
              label="Auto"
              title="Automatic Control"
              @pill-click=${()=>this._toggle(o)}
            ></acp-header-pill>`:Z}
      </div>
    `}_toggle(t){const e=t.split(".")[0];this.hass.callService(e,"toggle",{entity_id:t})}_renderLoading(){return W`
      <ha-card>
        <div class="empty">
          <p class="dim">Loading Adaptive Cover Pro registry…</p>
        </div>
      </ha-card>
    `}_renderEmpty(t){const e=this._config.entry_id,i=this._registry?.length??0,s=this._registry?.filter(t=>t.config_entry_id===e&&"adaptive_cover_pro"===t.platform).length;return W`
      <ha-card>
        <div class="empty">
          <p><strong>No Adaptive Cover Pro entities found</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${e}</code></p>
          <ul class="diag">
            <li>Reason: <code>${t}</code></li>
            <li>Registry entries loaded: <code>${i}</code></li>
            <li>ACP entities matching entry_id: <code>${s??"—"}</code></li>
            ${this._registryError?W`<li>Registry fetch error: <code>${this._registryError}</code></li>`:Z}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return Z;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const t=this._discovered;if(!t)return this._renderEmpty("no matching entities after unique_id lookup");const e=(i=this._config,{...wt,...i?.controls});var i;const s=this._sections;return W`
      <ha-card>
        ${this._renderHeader(t,e)}
        <div class="body ${this._config.compact?"compact":""}">
          ${s.includes("sky")?W`<acp-sky-compass
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
              ></acp-sky-compass>`:Z}
          ${s.includes("elevation")?W`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:Z}
          ${s.includes("decision")?W`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
              ></acp-decision-strip>`:Z}
          ${s.includes("covers")?W`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:Z}
          ${s.includes("overrides")?W`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                .resetEnabled=${e.reset_manual_override}
              ></acp-overrides-panel>`:Z}
          ${s.includes("climate")?W`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:Z}
        </div>
        ${this._config.show_version?W`<div class="footer dim">adaptive-cover-pro-card v${_t}</div>`:Z}
      </ha-card>
    `}};ne.styles=r`
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
  `,t([gt({attribute:!1})],ne.prototype,"hass",void 0),t([vt()],ne.prototype,"_config",void 0),t([vt()],ne.prototype,"_registry",void 0),t([vt()],ne.prototype,"_registryError",void 0),t([vt()],ne.prototype,"_discovered",void 0),ne=t([ht(mt)],ne),window.customCards=window.customCards||[],window.customCards.push({type:mt,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${_t} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{ne as AdaptiveCoverProCard};
