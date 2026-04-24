/*! adaptive-cover-pro-card v1.4.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function t(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,v=g.trustedTypes,_=v?v.emptyScript:"",f=g.reactiveElementPolyfillSupport,y=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:m).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??$)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,f?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=t=>t,A=x.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+E,P=`<${M}>`,z=document,O=()=>z.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,R="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,U=/>/g,D=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,L=/"/g,j=/^(?:script|style|textarea|title)$/i,W=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),B=W(1),V=W(2),q=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),G=new WeakMap,J=z.createTreeWalker(z,129);function X(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=I;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===I?"!--"===l[1]?n=F:void 0!==l[1]?n=U:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=D):void 0!==l[3]&&(n=D):n===D?">"===l[0]?(n=o??I,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?D:'"'===l[3]?L:H):n===L||n===H?n=D:n===F||n===U?n=I:(n=D,o=void 0);const h=n===D&&t[e+1].startsWith("/>")?" ":"";r+=n===I?s+P:c>=0?(i.push(a),s.slice(0,c)+C+s.slice(c)+E+h):s+E+(-2===c?e:h)}return[X(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Q{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,c]=K(t,e);if(this.el=Q.createElement(l,s),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=J.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[r++],s=i.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?it:"?"===n[1]?ot:"@"===n[1]?rt:st}),i.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),J.nextNode(),a.push({type:2,index:++o});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===M)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function Y(t,e,s=t,i){if(e===q)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=T(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Y(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);J.currentNode=i;let o=J.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=J.nextNode(),r++)}return J.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),T(t)?t===Z||null==t||""===t?(this._$AH!==Z&&this._$AR(),this._$AH=Z):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Z&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Q.createElement(X(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Q(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new et(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Z}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=Y(this,t,e,0),r=!T(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Y(this,i[s+n],e,n),a===q&&(a=this._$AH[n]),r||=!T(a)||a!==this._$AH[n],a===Z?t=Z:t!==Z&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Z?void 0:t}}class ot extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Z)}}class rt extends st{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??Z)===q)return;const s=this._$AH,i=t===Z&&s!==Z||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==Z&&(s===Z||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const at=x.litHtmlPolyfillSupport;at?.(Q,et),(x.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;class ct extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(O(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:$},ut=(t=pt,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function gt(t){return(e,s)=>"object"==typeof s?ut(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function vt(t){return gt({...t,state:!0,attribute:!1})}const _t="1.4.0",ft="adaptive-cover-pro-card",yt="adaptive-cover-pro-card-editor",mt="adaptive-cover-pro-sky-compass-card",$t="adaptive-cover-pro-sky-compass-card-editor",bt="adaptive_cover_pro",wt=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default"],xt={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},kt={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},At={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},St={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"};function Ct(t,e,s){const i=e.entry_id;if(!i)return null;const o={},r=`${i}_`;let n=!1;for(const t of s){if(t.config_entry_id!==i)continue;if(t.platform!==bt)continue;if(n=!0,!t.unique_id.startsWith(r))continue;const e=t.unique_id.slice(r.length),s=t.entity_id.split(".")[0],a=St[`${s}:${e}`];a&&(o[a]=t.entity_id)}if(!n||0===Object.keys(o).length)return null;const a=t;let l=i;if(a.devices)for(const t of Object.values(a.devices))if(t.config_entries?.includes(i)){l=t.name_by_user??t.name??i;break}const c=[],d=o.target_position_sensor;if(d){const e=t.states[d]?.attributes?.actual_positions;e&&c.push(...Object.keys(e))}let h="cover_blind";const p=o.control_status_sensor;if(p){const e=t.states[p]?.attributes;e?.cover_type&&(h=e.cover_type)}return{entry_id:i,entry_title:l,cover_type:h,entities:o,managed_covers:c}}async function Et(t){return t.callWS({type:"config/entity_registry/list"})}function Mt(t,e){let s=null,i=!1;return t.connection.subscribeEvents(t=>e(t.data),"entity_registry_updated").then(t=>{i?t():s=t}).catch(()=>{}),()=>{i=!0,s&&s()}}function Pt(t){return`acp-card:registry:v1:${t}`}const zt={get(t){try{const e=localStorage.getItem(Pt(t));if(!e)return null;const s=JSON.parse(e);return 1!==s.schemaVersion?null:s}catch{return null}},set(t,e){try{const s={schemaVersion:1,cardVersion:_t,fetchedAt:Date.now(),entries:e};localStorage.setItem(Pt(t),JSON.stringify(s))}catch{}},invalidate(t){try{localStorage.removeItem(Pt(t))}catch{}},clear(){try{const t="acp-card:registry:v1:",e=[];for(let s=0;s<localStorage.length;s++){const i=localStorage.key(s);i?.startsWith(t)&&e.push(i)}e.forEach(t=>localStorage.removeItem(t))}catch{}}};function Ot(t){return`${t.entity_id}|${t.unique_id}|${t.platform}|${t.config_entry_id??""}`}function Tt(t,e,s){return t.filter(t=>t.config_entry_id===e&&void 0===s)}let Nt=class extends ct{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return B`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":Z}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};function Rt(t,e){const s=(t-90)*Math.PI/180;return{x:e*Math.cos(s),y:e*Math.sin(s)}}function It(t,e,s,i=0){const o=t=>(t%360+360)%360,r=o(t),n=o(e);let a=n-r;a<0&&(a+=360);const l=a>180?1:0,c=Rt(r,s),d=Rt(n,s);if(i<=0)return`M 0 0 L ${c.x} ${c.y} A ${s} ${s} 0 ${l} 1 ${d.x} ${d.y} Z`;const h=Rt(n,i),p=Rt(r,i);return[`M ${c.x} ${c.y}`,`A ${s} ${s} 0 ${l} 1 ${d.x} ${d.y}`,`L ${h.x} ${h.y}`,`A ${i} ${i} 0 ${l} 0 ${p.x} ${p.y}`,"Z"].join(" ")}function Ft(t,e){return Rt(t,function(t){return 1-Math.max(0,Math.min(90,t))/90}(e))}function Ut(t){return(t%360+360)%360}function Dt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}Nt.styles=n`
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
  `,t([gt({type:Boolean})],Nt.prototype,"on",void 0),t([gt({type:Boolean})],Nt.prototype,"readonly",void 0),t([gt({type:String})],Nt.prototype,"label",void 0),t([gt({type:String})],Nt.prototype,"title",void 0),Nt=t([ht("acp-header-pill")],Nt);var Ht,Lt={exports:{}};Ht=Lt,function(){var t=Math.PI,e=Math.sin,s=Math.cos,i=Math.tan,o=Math.asin,r=Math.atan2,n=Math.acos,a=t/180,l=864e5,c=2440588,d=2451545;function h(t){return new Date((t+.5-c)*l)}function p(t){return function(t){return t.valueOf()/l-.5+c}(t)-d}var u=23.4397*a;function g(t,o){return r(e(t)*s(u)-i(o)*e(u),s(t))}function v(t,i){return o(e(i)*s(u)+s(i)*e(u)*e(t))}function _(t,o,n){return r(e(t),s(t)*e(o)-i(n)*s(o))}function f(t,i,r){return o(e(i)*e(r)+s(i)*s(r)*s(t))}function y(t,e){return a*(280.16+360.9856235*t)-e}function m(t){return a*(357.5291+.98560028*t)}function $(s){return s+a*(1.9148*e(s)+.02*e(2*s)+3e-4*e(3*s))+102.9372*a+t}function b(t){var e=$(m(t));return{dec:v(e,0),ra:g(e,0)}}var w={getPosition:function(t,e,s){var i=a*-s,o=a*e,r=p(t),n=b(r),l=y(r,i)-n.ra;return{azimuth:_(l,o,n.dec),altitude:f(l,o,n.dec)}}},x=w.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];w.addTime=function(t,e,s){x.push([t,e,s])};var k=9e-4;function A(e,s,i){return k+(e+s)/(2*t)+i}function S(t,s,i){return d+t+.0053*e(s)-.0069*e(2*i)}function C(t,i,o,r,a,l,c){var d=function(t,i,o){return n((e(t)-e(i)*e(o))/(s(i)*s(o)))}(t,o,r);return S(A(d,i,a),l,c)}function E(t){var i=a*(134.963+13.064993*t),o=a*(93.272+13.22935*t),r=a*(218.316+13.176396*t)+6.289*a*e(i),n=5.128*a*e(o),l=385001-20905*s(i);return{ra:g(r,n),dec:v(r,n),dist:l}}function M(t,e){return new Date(t.valueOf()+e*l/24)}w.getTimes=function(e,s,i,o){var r,n,l,c,d,u=a*-i,g=a*s,_=function(t){return-2.076*Math.sqrt(t)/60}(o=o||0),f=function(e,s){return Math.round(e-k-s/(2*t))}(p(e),u),y=A(0,u,f),b=m(y),w=$(b),E=v(w,0),M=S(y,b,w),P={solarNoon:h(M),nadir:h(M-.5)};for(r=0,n=x.length;r<n;r+=1)d=M-((c=C(((l=x[r])[0]+_)*a,u,g,E,f,b,w))-M),P[l[1]]=h(d),P[l[2]]=h(c);return P},w.getMoonPosition=function(t,o,n){var l=a*-n,c=a*o,d=p(t),h=E(d),u=y(d,l)-h.ra,g=f(u,c,h.dec),v=r(e(u),i(c)*s(h.dec)-e(h.dec)*s(u));return g+=function(t){return t<0&&(t=0),2967e-7/Math.tan(t+.00312536/(t+.08901179))}(g),{azimuth:_(u,c,h.dec),altitude:g,distance:h.dist,parallacticAngle:v}},w.getMoonIllumination=function(t){var i=p(t||new Date),o=b(i),a=E(i),l=149598e3,c=n(e(o.dec)*e(a.dec)+s(o.dec)*s(a.dec)*s(o.ra-a.ra)),d=r(l*e(c),a.dist-l*s(c)),h=r(s(o.dec)*e(o.ra-a.ra),e(o.dec)*s(a.dec)-s(o.dec)*e(a.dec)*s(o.ra-a.ra));return{fraction:(1+s(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},w.getMoonTimes=function(t,e,s,i){var o=new Date(t);i?o.setUTCHours(0,0,0,0):o.setHours(0,0,0,0);for(var r,n,l,c,d,h,p,u,g,v,_,f,y,m=.133*a,$=w.getMoonPosition(o,e,s).altitude-m,b=1;b<=24&&(r=w.getMoonPosition(M(o,b),e,s).altitude-m,u=((d=($+(n=w.getMoonPosition(M(o,b+1),e,s).altitude-m))/2-r)*(p=-(h=(n-$)/2)/(2*d))+h)*p+r,v=0,(g=h*h-4*d*r)>=0&&(_=p-(y=Math.sqrt(g)/(2*Math.abs(d))),f=p+y,Math.abs(_)<=1&&v++,Math.abs(f)<=1&&v++,_<-1&&(_=f)),1===v?$<0?l=b+_:c=b+_:2===v&&(l=b+(u<0?f:_),c=b+(u<0?_:f)),!l||!c);b+=2)$=n;var x={};return l&&(x.rise=M(o,l)),c&&(x.set=M(o,c)),l||c||(x[u>0?"alwaysUp":"alwaysDown"]=!0),x},Ht.exports=w}();var jt=Dt(Lt.exports);function Wt(t,e,s,i=10){const o=[],r=s.getTime()+864e5;for(let n=s.getTime();n<=r;n+=60*i*1e3){const s=new Date(n),i=jt.getPosition(s,t,e);o.push({t:s,elevation:180*i.altitude/Math.PI,azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360})}return o}function Bt(t=new Date){const e=new Date(t);return e.setHours(0,0,0,0),e}function Vt(t,e,s,i){const o=((e-s)%360+360)%360;return((t-o)%360+360)%360<=((((e+i)%360+360)%360-o)%360+360)%360}function qt(t,e,s=new Date){const i=jt.getMoonPosition(s,t,e),o=jt.getMoonIllumination(s);return{azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360,elevation:180*i.altitude/Math.PI,phase:o.phase,fraction:o.fraction,phaseName:Zt(o.phase)}}function Zt(t){return t<.0625||t>=.9375?"New Moon":t<.1875?"Waxing Crescent":t<.3125?"First Quarter":t<.4375?"Waxing Gibbous":t<.5625?"Full Moon":t<.6875?"Waning Gibbous":t<.8125?"Last Quarter":"Waning Crescent"}function Gt(t){return null==t||Number.isNaN(t)?"—":`${Math.round(t)}%`}function Jt(t){return null==t||Number.isNaN(t)?"—":`${t.toFixed(1)}°`}function Xt(t){if(!t)return"—";const e=new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Kt(t){if(!t)return"—";const e=new Date(t).getTime();if(Number.isNaN(e))return"—";const s=Math.round((e-Date.now())/1e3);return s<=0?"expired":function(t){if(null==t||Number.isNaN(t))return"—";const e=Math.max(0,Math.round(t));if(e<60)return`${e}s`;const s=Math.floor(e/60);return s<60?`${s}m ${e%60}s`:`${Math.floor(s/60)}h ${s%60}m`}(s)}const Qt=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#17becf","#e377c2"];function Yt(t){const e=Qt.length;return Qt[(t%e+e)%e]}const te=110;let ee=class extends ct{constructor(){super(...arguments),this.discovered_list=[],this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1,this.showCardinals=!0,this.showBlindSpot=!0,this.showSunPath=!0,this.showSunriseSunset=!0,this.showCoverFill=!0,this.showWindowArrow=!0,this.coverColors=[]}_sunFor(t){const e=t.entities.sun_sensor;if(!e)return null;const s=this.hass.states[e];if(!s)return null;const i=parseFloat(s.state);return Number.isNaN(i)?null:{...s.attributes,window_azimuth:s.attributes.window_azimuth}}_coverPositionFor(t){const e=t.entities.target_position_sensor;if(!e)return null;const s=parseFloat(this.hass.states[e]?.state??"");return Number.isNaN(s)?null:s}_sunInfrontFor(t){const e=t.entities.sun_infront_binary;return!!e&&"on"===this.hass.states[e]?.state}_buildOverlays(){const t=[];return this.discovered_list.forEach((e,s)=>{const i=this._sunFor(e);if(!i)return;const o=e.entities.sun_sensor,r=parseFloat(this.hass.states[o]?.state??"0"),{color:n,isOverride:a}=(l=this.coverColors?.[s],c=s,"string"==typeof l&&l.length>0?{color:l,isOverride:!0}:{color:Yt(c),isOverride:!1});var l,c;t.push({d:e,sun:i,sunAzi:r,sunInfront:this._sunInfrontFor(e),coverPos:this._coverPositionFor(e),color:n,isOverride:a,index:s})}),t}render(){if(!this.hass)return Z;if(!this.discovered_list||0===this.discovered_list.length)return B`<div class="placeholder">No Adaptive Cover Pro entries selected.</div>`;const t=this._buildOverlays();if(0===t.length)return B`<div class="placeholder">Sun sensor not yet populated.</div>`;const e=t.length>1,s=t[0],i=s.sunAzi,o=s.sun.elevation,r=Ft(i,o),n=t.some(t=>t.sun.in_fov),a=t.some(t=>t.sunInfront),l=o<=0,c=!l&&a?"sun valid":!l&&n?"sun in-fov":"sun",{latitude:d,longitude:h}=this.hass.config,p=void 0!==d&&void 0!==h?Wt(d,h,Bt()):[],u=this.showMoon&&void 0!==d&&void 0!==h?qt(d,h):null,g=null!==u&&u.elevation>0,v=u?u.phase<.5?-24*u.phase:24*(1-u.phase):0,_=g?Ft(u.azimuth,u.elevation):null,f=_?_.x*te:0,y=_?_.y*te:0,m=this.showSunPath?p.filter(t=>t.elevation>0).map(t=>{const e=Ft(t.azimuth,t.elevation);return`${(e.x*te).toFixed(1)},${(e.y*te).toFixed(1)}`}).join(" "):"",{riseAzimuth:$,setAzimuth:b}=this.showSunriseSunset?function(t){let e=-1,s=-1;for(let i=0;i<t.length;i++)t[i].elevation>0&&(-1===e&&(e=i),s=i);return{riseAzimuth:e>=0?t[e].azimuth:null,setAzimuth:s>=0?t[s].azimuth:null}}(p):{riseAzimuth:null,setAzimuth:null},w=null!==$?Rt($,te):null,x=null!==b?Rt(b,te):null,k=`Sun: ${Jt(i)} az / ${Jt(o)} el`,A=null!==$?`Sunrise: ${Jt($)}`:"",S=null!==b?`Sunset: ${Jt(b)}`:"",C=null!==u?`Moon: ${u.phaseName} (${Math.round(100*u.fraction)}%)`:"";return B`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${V`
            <defs>
              ${g?V`
                <mask id="moon-phase-mask">
                  <circle cx=${f} cy=${y} r=${6} fill="white"></circle>
                  <circle cx=${f+v} cy=${y} r=${6} fill="black"></circle>
                </mask>
              `:Z}
            </defs>

            <circle class="grid" r=${te}></circle>
            <circle class="grid" r=${220/3}></circle>
            <circle class="grid" r=${te/3}></circle>
            <line class="grid thin" x1="0" y1=${-110} x2="0" y2=${te}></line>
            <line class="grid thin" x1=${-110} y1="0" x2=${te} y2="0"></line>

            ${t.map(t=>this._renderEntryLayers(t,e))}

            ${this.showSunPath&&m?V`<g data-tooltip="Sun path (today)"><title>Sun path (today)</title><polyline class="sun-path" points=${m}></polyline></g>`:Z}

            ${this.showSunriseSunset&&w&&null!==$?V`<g data-tooltip=${A}><title>${A}</title><circle class="rise-marker" cx=${w.x} cy=${w.y} r="4"></circle></g>`:Z}
            ${this.showSunriseSunset&&x&&null!==b?V`<g data-tooltip=${S}><title>${S}</title><circle class="set-marker" cx=${x.x} cy=${x.y} r="4"></circle></g>`:Z}

            ${this.showCardinals?V`
              <text class="cardinal" x="0" y=${-116} text-anchor="middle">N</text>
              <text class="cardinal" x=${120} y="4" text-anchor="middle">E</text>
              <text class="cardinal" x="0" y=${124} text-anchor="middle">S</text>
              <text class="cardinal" x=${-120} y="4" text-anchor="middle">W</text>
            `:Z}

            ${g?V`
              <g data-tooltip=${C}>
                <title>${C}</title>
                <circle class="moon-outline" cx=${f} cy=${y} r=${6}></circle>
                <circle class="moon-lit" cx=${f} cy=${y} r=${6} mask="url(#moon-phase-mask)"></circle>
              </g>
            `:Z}

            <g data-tooltip=${k}>
              <title>${k}</title>
              <circle class=${c} cx=${r.x*te} cy=${r.y*te} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend?this._renderLegend(t,e):Z}
        ${this.showStats?this._renderStats(t,e):Z}
      </div>
    `}_renderEntryLayers(t,e){const s=Ut(t.sun.window_azimuth),i=Ut(s-t.sun.fov_left),o=Ut(s+t.sun.fov_right),r=Rt(s,te),n=null!==t.coverPos?te*(1-t.coverPos/100):null,a=t.sun.blind_spot_range?It(Ut(t.sun.blind_spot_range[0]),Ut(t.sun.blind_spot_range[1]),te):null,l=It(i,o,te),c=null!==n?It(i,o,n):"",d=e?`${t.d.entry_title}: `:"",h=`${d}FOV ${Jt(t.sun.fov_left)} left / ${Jt(t.sun.fov_right)} right`,p=`${d}Window normal: ${Jt(s)}`,u=null!==t.coverPos?`${d}Cover closed: ${t.coverPos}%`:"",g=t.sun.blind_spot_range?`${d}Blind spot: ${Jt(t.sun.blind_spot_range[0])} – ${Jt(t.sun.blind_spot_range[1])}`:"",v=e||t.isOverride,_=v?`fill: ${t.color}; stroke: ${t.color};`:"",f=v?`fill: ${t.color}; stroke: ${t.color};`:"",y=v?`fill: ${t.color}; stroke: ${t.color};`:"",m=v?`stroke: ${t.color};`:"",$=v?`fill: ${t.color};`:"",b=this.showCoverFill&&null!==n&&n>.5,w=this.showBlindSpot&&!!a,x=this.showWindowArrow,k=`M 0 0 L ${r.x} ${r.y}`,A="display: none;";return V`<g class="entry-overlay">
      <g data-tooltip=${h}>
        <title>${h}</title>
        <path class="fov" style=${_} d=${l}></path>
      </g>
      <g class="arrow-group" data-tooltip=${p} style=${x?"":A}>
        <title>${p}</title>
        <path class="window" style=${m} d=${k}></path>
        <circle class="window-base" style=${$} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" data-tooltip=${u} style=${b?"":A}>
        <title>${u}</title>
        <path class="cover-fill" style=${f} d=${c}></path>
      </g>
      <g class="blind-group" data-tooltip=${g} style=${w?"":A}>
        <title>${g}</title>
        <path class="blind-spot" style=${y} d=${a??""}></path>
      </g>
    </g>`}_renderLegend(t,e){return e?B`
        <div class="legend">
          ${t.map(t=>B`
              <div>
                <span class="swatch entry" style="background: ${t.color}"></span>
                ${t.d.entry_title}
                ${t.sunInfront?B`<span class="status valid">✓ in FOV</span>`:t.sun.in_fov?B`<span class="status in-fov">in FOV</span>`:B`<span class="status">—</span>`}
              </div>
            `)}
          <div><span class="dot sun valid"></span> Sun</div>
          ${this.showMoon?B`<div><span class="dot moon-dot"></span> Moon</div>`:Z}
        </div>
      `:B`<div class="legend">
      <div><span class="dot sun valid"></span> Sun (in FOV)</div>
      <div><span class="dot sun"></span> Sun (outside)</div>
      ${this.showMoon?B`<div><span class="dot moon-dot"></span> Moon</div>`:Z}
      <div><span class="swatch fov"></span> Window FOV</div>
      ${this.showSunPath?B`<div><span class="swatch sun-path-swatch"></span> Sun path</div>`:Z}
      ${this.showSunriseSunset?B`<div><span class="dot rise-dot"></span> Sunrise</div>
            <div><span class="dot set-dot"></span> Sunset</div>`:Z}
      ${this.showCoverFill?B`<div><span class="swatch cover-fill-swatch"></span> Cover closed</div>`:Z}
      ${this.showWindowArrow?B`<div><span class="swatch window-swatch"></span> Window normal</div>`:Z}
    </div>`}_renderStats(t,e){const s=t[0],i=s.sunAzi,o=s.sun.elevation,{latitude:r,longitude:n}=this.hass.config,a=this.showMoon&&void 0!==r&&void 0!==n?qt(r,n):null;return e?B`
        <div class="stats dim">
          <div class="stats-row">
            <span>Sun: ${Jt(i)} / ${Jt(o)}</span>
            ${this.showMoon&&a?B`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:Z}
          </div>
          ${t.map(t=>B`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${t.color}"></span>
                <span class="entry-name">${t.d.entry_title}</span>
                <span>∠${Jt(t.sun.gamma)}</span>
                <span>W ${Jt(Ut(t.sun.window_azimuth))}</span>
                ${t.sun.in_fov?B`<span class="status in-fov">✓</span>`:Z}
              </div>
            `)}
        </div>
      `:B`<div class="stats dim">
      <span>Azi: ${Jt(i)}</span>
      <span>Elev: ${Jt(o)}</span>
      <span>∠: ${Jt(s.sun.gamma)}</span>
      <span>Window: ${Jt(Ut(s.sun.window_azimuth))}</span>
      ${this.showMoon&&a?B`<span>${a.phaseName} ${Math.round(100*a.fraction)}%</span>`:Z}
    </div>`}};ee.styles=n`
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
    .legend .status {
      margin-left: 4px;
      opacity: 0.8;
    }
    .legend .status.valid {
      color: gold;
    }
    .legend .status.in-fov {
      color: orange;
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
    .swatch.entry {
      border-radius: 2px;
      opacity: 0.9;
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
      color: orange;
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
  `,t([gt({attribute:!1})],ee.prototype,"hass",void 0),t([gt({attribute:!1})],ee.prototype,"discovered_list",void 0),t([gt({type:Boolean,reflect:!0})],ee.prototype,"compact",void 0),t([gt({attribute:!1})],ee.prototype,"showStats",void 0),t([gt({attribute:!1})],ee.prototype,"showLegend",void 0),t([gt({attribute:!1})],ee.prototype,"showMoon",void 0),t([gt({attribute:!1})],ee.prototype,"showCardinals",void 0),t([gt({attribute:!1})],ee.prototype,"showBlindSpot",void 0),t([gt({attribute:!1})],ee.prototype,"showSunPath",void 0),t([gt({attribute:!1})],ee.prototype,"showSunriseSunset",void 0),t([gt({attribute:!1})],ee.prototype,"showCoverFill",void 0),t([gt({attribute:!1})],ee.prototype,"showWindowArrow",void 0),t([gt({attribute:!1})],ee.prototype,"coverColors",void 0),ee=t([ht("acp-sky-compass")],ee);let se=class extends ct{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];return e?e.attributes:null}render(){if(!this.hass||!this.discovered)return Z;const t=this._sunAttrs(),{latitude:e,longitude:s}=this.hass.config;if(void 0===e||void 0===s||!t)return B`<div class="placeholder">Sun elevation chart unavailable.</div>`;const i=Bt(),o=Wt(e,s,i),r=new Date,n=function(t,e,s,i){let o=-1,r=-1,n=-1;for(let a=0;a<t.length;a++){const l=t[a];l.elevation>0&&Vt(l.azimuth,e,s,i)?(-1===n&&(n=a),a-n>r-o&&(o=n,r=a)):n=-1}return-1===o?null:{startIdx:o,endIdx:r}}(o,t.window_azimuth,t.fov_left,t.fov_right),a=t=>32+(t.getTime()-i.getTime())/864e5*360,l=t=>138-(t- -10)/100*128,c=o.map(t=>`${a(t.t).toFixed(1)},${l(t.elevation).toFixed(1)}`).join(" "),d=l(0),h=a(r),p=this._interpAt(o,r),u=p?l(p.elevation):null,g=n?o[n.startIdx].t:null,v=n?o[n.endIdx].t:null,_=g?a(g):null,f=v?a(v):null;return B`
      <div class="wrap">
        <div class="head">
          <span class="label">Sun today</span>
          ${g&&v?B`<span class="dim"
                >FOV: ${Xt(g.toISOString())} →
                ${Xt(v.toISOString())}</span
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
            ${[0,6,12,18,24].map(t=>{const e=new Date(i.getTime()+36e5*t);return V`
                <line class="grid faint" x1=${a(e)} y1=${10} x2=${a(e)} y2=${138} />
                <text class="tick" x=${a(e)} y=${152} text-anchor="middle">${t.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${d} x2=${392} y2=${d} />

            <!-- FOV shaded band (only the time the sun is actually in FOV + above horizon) -->
            ${null!==_&&null!==f?V`<rect
                  class="fov-band"
                  x=${_}
                  y=${10}
                  width=${f-_}
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
    `}_interpAt(t,e){if(0===t.length)return null;const s=e.getTime();if(s<=t[0].t.getTime())return t[0];if(s>=t[t.length-1].t.getTime())return t[t.length-1];for(let i=1;i<t.length;i++)if(t[i].t.getTime()>=s){const o=t[i-1],r=t[i],n=(s-o.t.getTime())/(r.t.getTime()-o.t.getTime());return{t:e,elevation:o.elevation+(r.elevation-o.elevation)*n,azimuth:o.azimuth+(r.azimuth-o.azimuth)*n}}return t[t.length-1]}};se.styles=n`
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
  `,t([gt({attribute:!1})],se.prototype,"hass",void 0),t([gt({attribute:!1})],se.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],se.prototype,"compact",void 0),se=t([ht("acp-elevation-chart")],se);let ie=class extends ct{constructor(){super(...arguments),this.compact=!1,this.hideInactive=!1}_trace(){const t=this.discovered.entities.decision_trace_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=e.attributes;if(!s?.trace)return null;const i=new Map;for(const t of s.trace)i.set(oe(t.handler),{matched:t.matched,reason:t.reason,position:t.position});return{winner:e.state,reason:s.reason??"",steps:i}}render(){if(!this.hass||!this.discovered)return Z;const t=this._trace();if(!t)return B`<div class="placeholder">Decision trace not yet populated.</div>`;const e=(s=wt,i=t.steps,o=t.winner,this.hideInactive?s.filter(t=>t===o||!0===i.get(t)?.matched):[...s]);var s,i,o;return B`
      <div class="wrap">
        <div class="head">
          <span class="label">Pipeline</span>
          <span class="winner">Winner: ${t.winner}</span>
        </div>
        <div class="rows">${e.map(e=>this._row(e,t.steps.get(e),t.winner===e))}</div>
        <div class="reason dim">${t.reason}</div>
      </div>
    `}_row(t,e,s){const i=e?.matched??!1,o=e?.reason??"not evaluated",r=e?.position;return B`
      <div class="row ${s?"winner":i?"match":"skip"}">
        <span class="name">${xt[t]}</span>
        <span class="dots" aria-hidden="true">${i?"████":"────"}</span>
        <span class="pos">${null!=r?Gt(r):""}</span>
        <span class="reason-inline dim">${o}</span>
        ${s?B`<span class="badge">✓</span>`:Z}
      </div>
    `}};function oe(t){return t.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase().replace(/^force_override$/,"force").replace(/^weather_override$/,"weather").replace(/^manual_override$/,"manual").replace(/^motion_timeout$/,"motion").replace(/^cloud_suppression$/,"cloud")}ie.styles=n`
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
  `,t([gt({attribute:!1})],ie.prototype,"hass",void 0),t([gt({attribute:!1})],ie.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],ie.prototype,"compact",void 0),t([gt({type:Boolean,reflect:!0,attribute:"hide-inactive"})],ie.prototype,"hideInactive",void 0),ie=t([ht("acp-decision-strip")],ie);let re=class extends ct{constructor(){super(...arguments),this.compact=!1}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return{target:null,covers:{}};const e=this.hass.states[t];if(!e)return{target:null,covers:{}};const s=parseFloat(e.state),i=e.attributes;return{target:Number.isNaN(s)?null:s,covers:i?.actual_positions??{}}}_mismatched(){const t=this.discovered.entities.position_mismatch_binary;if(!t)return new Set;const e=this.hass.states[t];if("on"!==e?.state)return new Set;const s=e.attributes.entities;return s?new Set(Object.entries(s).filter(([,t])=>t.mismatch).map(([t])=>t)):new Set}_setPosition(t,e){this.hass.callService("cover","set_cover_position",{entity_id:t,position:e})}render(){if(!this.hass||!this.discovered)return Z;const{target:t,covers:e}=this._target(),s=this._mismatched(),i=Object.entries(e);return 0===i.length?B`<div class="placeholder">No covers reported by the integration.</div>`:B`
      <div class="wrap">
        <div class="head">
          <span class="label">Covers</span>
          <span class="target">Target: ${Gt(t)}</span>
        </div>
        ${i.map(([e,i])=>this._bar(e,i,t,s.has(e)))}
      </div>
    `}_bar(t,e,s,i){const o=this.hass.states[t]?.attributes?.friendly_name??t,r=s??0;return B`
      <div class="cover ${i?"mismatch":""}">
        <div class="name" title=${t}>${o}</div>
        <div
          class="track"
          @click=${e=>this._handleTrackClick(e,t)}
          title="Click to set position"
        >
          <div class="fill" style="width:${e??0}%"></div>
          ${null!==s?B`<div
                class="marker"
                style="left:${r}%"
                title="Target ${r}%"
              ></div>`:Z}
        </div>
        <div class="num">${Gt(e)}</div>
        ${i?B`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:Z}
      </div>
    `}_handleTrackClick(t,e){const s=t.currentTarget.getBoundingClientRect(),i=Math.round((t.clientX-s.left)/s.width*100),o=Math.max(0,Math.min(100,i));this._setPosition(e,o)}};re.styles=n`
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
  `,t([gt({attribute:!1})],re.prototype,"hass",void 0),t([gt({attribute:!1})],re.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],re.prototype,"compact",void 0),re=t([ht("acp-cover-bar")],re);let ne=class extends ct{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualEndIso(){const t=this.discovered.entities.manual_override_end_sensor;if(!t)return null;const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:null}_motionStatus(){const t=this.discovered.entities.motion_status_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=e.attributes.motion_timeout_end_time;return{state:e.state,endIso:s??null}}_forceActive(){const t=this.discovered.entities.force_override_sensor;if(!t)return 0;const e=this.hass.states[t];return e&&parseInt(e.state,10)||0}_resetManual(){const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}render(){if(!this.hass||!this.discovered)return Z;const t=this._manualActive(),e=this._manualEndIso(),s=this._motionStatus(),i=this._forceActive(),o=this.discovered.entities.reset_override_button;return B`
      <div class="wrap">
        <div class="label dim">Overrides</div>
        <div class="grid">
          <div class="tile ${t?"active":""}">
            <div class="tile-label">Manual</div>
            <div class="tile-value">${t?"Active":"Off"}</div>
            ${e?B`<div class="tile-sub dim">ends in ${Kt(e)}</div>`:Z}
          </div>

          <div class="tile ${i>0?"active warning":""}">
            <div class="tile-label">Force</div>
            <div class="tile-value">${i>0?`${i} active`:"Off"}</div>
          </div>

          ${s?B`<div class="tile ${"motion_detected"===s.state?"active":""}">
                <div class="tile-label">Motion</div>
                <div class="tile-value">${s.state.replace(/_/g," ")}</div>
                ${s.endIso?B`<div class="tile-sub dim">timeout ${Kt(s.endIso)}</div>`:Z}
              </div>`:Z}
          ${o?this.resetEnabled?B`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">Reset Manual</div>
                </button>`:B`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">Reset Manual</div>
                </button>`:Z}
        </div>
      </div>
    `}};ne.styles=n`
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
  `,t([gt({attribute:!1})],ne.prototype,"hass",void 0),t([gt({attribute:!1})],ne.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],ne.prototype,"compact",void 0),t([gt({type:Boolean,attribute:"reset-enabled"})],ne.prototype,"resetEnabled",void 0),ne=t([ht("acp-overrides-panel")],ne);const ae={"Summer Mode":"mdi:weather-sunny","Winter Mode":"mdi:snowflake",Intermediate:"mdi:weather-partly-cloudy"};let le=class extends ct{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return Z;const t=this.discovered.entities.climate_status_sensor;if(!t)return Z;const e=this.hass.states[t];if(!e||"unavailable"===e.state)return Z;const s=e.state,i=e.attributes??{},o=ae[s]??"mdi:thermostat",r=i.temperature_unit??"°",n=[void 0!==i.indoor_temperature?{label:"Indoor",value:i.indoor_temperature,unit:r}:null,void 0!==i.outdoor_temperature?{label:"Outdoor",value:i.outdoor_temperature,unit:r}:null].filter(t=>null!==t),a=[{label:"Presence",value:i.is_presence,icon:"mdi:account-check"},{label:"Sunny",value:i.is_sunny,icon:"mdi:white-balance-sunny"},{label:"Lux",value:i.lux_active,icon:"mdi:brightness-7"},{label:"Irradiance",value:i.irradiance_active,icon:"mdi:solar-power"}].filter(t=>void 0!==t.value);return B`
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
        ${n.length?B`
              <div class="temps">
                ${n.map(t=>B`
                    <div class="temp">
                      <span class="temp-label dim">${t.label}</span>
                      <span class="temp-value">${t.value.toFixed(1)}${t.unit}</span>
                    </div>
                  `)}
              </div>
            `:Z}
        ${a.length?B`
              <div class="conditions">
                ${a.map(t=>B`
                    <div class="chip ${t.value?"on":"off"}" title=${t.label}>
                      <ha-icon icon=${t.icon}></ha-icon>
                      <span>${t.label}</span>
                    </div>
                  `)}
              </div>
            `:Z}
      </div>
    `}};async function ce(t){return(await t.callWS({type:"config_entries/get",domain:bt})).filter(t=>t.domain===bt).map(t=>({entry_id:t.entry_id,title:t.title}))}le.styles=n`
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
  `,t([gt({attribute:!1})],le.prototype,"hass",void 0),t([gt({attribute:!1})],le.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],le.prototype,"compact",void 0),le=t([ht("acp-climate-panel")],le);const de=[{key:"sky",label:"Sky compass",description:"Sun vs. window FOV, polar plot"},{key:"elevation",label:"Sun today",description:"Elevation-vs-time chart with FOV band and current-time cursor"},{key:"decision",label:"Decision strip",description:"All 10 pipeline handlers with the winning row highlighted"},{key:"covers",label:"Cover positions",description:"Per-cover live vs. target bars; click to set position"},{key:"overrides",label:"Overrides panel",description:"Manual, force, motion tiles + reset button"},{key:"climate",label:"Climate panel",description:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)"}],he=de.map(t=>t.key);let pe=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,ce(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id})}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??he}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_onEntryChange(t){const e=t.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:e})}_onSectionToggle(t,e){const s=new Set(this._currentSections);e?s.add(t):s.delete(t);const i=de.map(t=>t.key).filter(t=>s.has(t));this._emit({...this._config??{type:"",entry_id:""},show_sections:i})}_onCompactToggle(t){this._emit({...this._config??{type:"",entry_id:""},compact:t})}_onVersionToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_version:t})}_onCompassStatsToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:t})}_onCompassLegendToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:t})}_onMoonToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_moon:t})}_onHideInactiveToggle(t){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:t})}_onControlToggle(t,e){const s=this._config??{type:"",entry_id:""};this._emit({...s,controls:{...s.controls,[t]:e}})}render(){if(!this._config)return Z;const t=new Set(this._currentSections);return B`
      <div class="form">
        <div class="section">
          <label class="field-label">Adaptive Cover Pro instance</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">Sections</label>
          <div class="hint">Toggle which parts of the card are shown.</div>
          ${de.map(e=>B`
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
            </option>`:Z}
        ${this._entries.map(t=>B`
            <option value=${t.entry_id} ?selected=${t.entry_id===this._config?.entry_id}>
              ${t.title}
            </option>
          `)}
      </select>
    `:B`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};pe.styles=n`
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
  `,t([gt({attribute:!1})],pe.prototype,"hass",void 0),t([vt()],pe.prototype,"_config",void 0),t([vt()],pe.prototype,"_entries",void 0),t([vt()],pe.prototype,"_entriesError",void 0),pe=t([ht(yt)],pe);const ue=[{key:"compact",label:"Compact mode",description:"Smaller SVG, legend hidden.",defaultOn:!1},{key:"show_legend",label:"Legend",description:"Color swatches + entry labels below compass.",defaultOn:!0},{key:"show_stats",label:"Stats",description:"Sun + per-window numeric rows.",defaultOn:!0},{key:"show_moon",label:"Moon",description:"Render moon position and phase.",defaultOn:!1},{key:"show_cardinals",label:"Cardinal labels",description:"N/E/S/W letters around the compass.",defaultOn:!0},{key:"show_blind_spot",label:"Blind spots",description:"Hatched wedges for each window’s blind range.",defaultOn:!0},{key:"show_sun_path",label:"Sun path",description:"Today’s sun arc across the sky.",defaultOn:!0},{key:"show_sunrise_sunset",label:"Sunrise / sunset markers",description:"Small dots at rise and set azimuths.",defaultOn:!0},{key:"show_cover_fill",label:"Cover closure fill",description:"Inner wedge showing how closed each cover is.",defaultOn:!0},{key:"show_window_arrow",label:"Window-normal arrow",description:"Line from center toward each window’s azimuth.",defaultOn:!0}];let ge=class extends ct{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,ce(this.hass).then(t=>{this._entries=t,this._entriesError=null}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_baseConfig(){return this._config??{type:`custom:${mt}`,entry_ids:[]}}_trimColors(t){let e=-1;for(let s=0;s<t.length;s++)t[s]&&(e=s);if(!(e<0))return t.slice(0,e+1)}_emitWithColors(t,e,s){const i=this._trimColors(e),{cover_colors:o,...r}=t,n=i?{...r,...s,cover_colors:i}:{...r,...s};this._emit(n)}_onCoverColorChange(t,e){const s=this._baseConfig(),i=[...s.cover_colors??[]];for(;i.length<=t;)i.push(null);i[t]=e,this._emitWithColors(s,i)}_onCoverColorReset(t){const e=this._baseConfig(),s=[...e.cover_colors??[]];t<s.length&&(s[t]=null),this._emitWithColors(e,s)}_onEntryToggle(t,e){const s=this._baseConfig(),i=new Set(s.entry_ids);e?i.add(t):i.delete(t);const o=(this._entries??[]).map(t=>t.entry_id).filter(t=>i.has(t)),r=s.cover_colors??[],n=o.map(t=>{const e=s.entry_ids.indexOf(t);return e>=0?r[e]??null:null});this._emitWithColors(s,n,{entry_ids:o})}_onToggle(t,e){this._emit({...this._baseConfig(),[t]:e})}_onTitleChange(t){const e=t.target.value,s=this._baseConfig();if(e)this._emit({...s,title:e});else{const{title:t,...e}=s;this._emit(e)}}render(){if(!this._config)return Z;const t=new Set(this._config.entry_ids);return B`
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
                ${this._config.entry_ids.map((t,e)=>{const s=this._config.cover_colors?.[e]??null,i=s??Yt(e),o=this._entries?.find(e=>e.entry_id===t);return B`
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
            `:Z}

        <div class="section">
          <label class="field-label">Display</label>
          ${ue.map(t=>B`
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
    `:B`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};ge.styles=n`
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
  `,t([gt({attribute:!1})],ge.prototype,"hass",void 0),t([vt()],ge.prototype,"_config",void 0),t([vt()],ge.prototype,"_entries",void 0),t([vt()],ge.prototype,"_entriesError",void 0),ge=t([ht($t)],ge);let ve=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(t){if(!t||!Array.isArray(t.entry_ids)||0===t.entry_ids.length)throw new Error("adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array");if(t.entry_ids.some(t=>"string"!=typeof t||0===t.length))throw new Error("adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string");this._config={...t,entry_ids:[...t.entry_ids]}}getCardSize(){return 4}static async getConfigElement(){return document.createElement($t)}static getStubConfig(){return{type:`custom:${mt}`,entry_ids:[]}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Mt(this.hass,()=>{this._fetchRegistry()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Et(this.hass).then(t=>{this._registry=t,this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}render(){if(!this._config||!this.hass)return Z;if(null===this._registry)return B`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError?`Registry fetch failed: ${this._registryError}`:"Loading Adaptive Cover Pro registry…"}
          </p>
        </div>
      </ha-card>`;const t=[],e=[];for(const s of this._config.entry_ids){const i=Ct(this.hass,{type:this._config.type,entry_id:s},this._registry);i?t.push(i):e.push(s)}if(0===t.length)return B`<ha-card>
        <div class="empty">
          <p><strong>No matching Adaptive Cover Pro entities</strong></p>
          <p class="dim">Configured entries: ${this._config.entry_ids.join(", ")}</p>
        </div>
      </ha-card>`;const s=this._config;return B`
      <ha-card>
        ${s.title?B`<div class="card-header">${s.title}</div>`:Z}
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
        ></acp-sky-compass>
        ${e.length>0?B`<div class="warn dim">Entries not found: ${e.join(", ")}</div>`:Z}
      </ha-card>
    `}};ve.styles=n`
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
  `,t([gt({attribute:!1})],ve.prototype,"hass",void 0),t([vt()],ve.prototype,"_config",void 0),t([vt()],ve.prototype,"_registry",void 0),t([vt()],ve.prototype,"_registryError",void 0),ve=t([ht(mt)],ve),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===mt)||window.customCards.push({type:mt,name:"Adaptive Cover Pro — Sky Compass",description:"Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card"});const _e=["sky","elevation","decision","covers","overrides","climate"];let fe=class extends ct{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let t=null,e=null;return(s,i,o)=>{const r=i.entry_id??"";return null!==t&&t.registry===o&&t.hass===s&&t.entryId===r||(t={registry:o,hass:s,entryId:r},e=Ct(s,i,o)),e}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(t){if(!t?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...t},null===this._registry){const e=zt.get(t.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(yt)}static getStubConfig(){return{type:`custom:${ft}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(t){null!==this._registry&&this._config&&this.hass&&(t.has("hass")||t.has("_registry")||t.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=Mt(this.hass,t=>{const e=new Set(Tt(this._registry??[],this._config?.entry_id??"").map(t=>t.entity_id));(function(t,e){return"create"===t.action||e.has(t.entity_id)})(t,e)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,Et(this.hass).then(t=>{const e=this._config?.entry_id;if(e){const s=Tt(t,e);(null===this._registry||function(t,e){if(t.length!==e.length)return!0;const s=new Map(t.map(t=>[t.entity_id,Ot(t)]));for(const t of e)if(s.get(t.entity_id)!==Ot(t))return!0;return!1}(Tt(this._registry,e),s))&&(this._registry=t,zt.set(e,s))}else this._registry=t;this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const t=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=t);const e=t-this._debounceFirstAt,s=this._DEBOUNCE_MAX-e,i=Math.min(this._DEBOUNCE_DELAY,s);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),i<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},i)}get _sections(){return this._config?.show_sections??_e}_renderHeader(t,e){const s=kt[t.cover_type]??"mdi:window-shutter",i=t.entities.integration_enabled_switch,o=t.entities.automatic_control_switch,r=!i||"on"===this.hass.states[i]?.state,n=!o||"on"===this.hass.states[o]?.state;return B`
      <div class="header">
        <ha-icon .icon=${s}></ha-icon>
        <span class="title">${t.entry_title}</span>
        <span class="spacer"></span>
        ${i?B`<acp-header-pill
              .on=${r}
              .readonly=${!e.integration_enabled}
              .label=${r?"ON":"OFF"}
              title="Integration Enabled"
              @pill-click=${()=>this._toggle(i)}
            ></acp-header-pill>`:Z}
        ${o?B`<acp-header-pill
              .on=${n}
              .readonly=${!e.automatic_control}
              label="Auto"
              title="Automatic Control"
              @pill-click=${()=>this._toggle(o)}
            ></acp-header-pill>`:Z}
      </div>
    `}_toggle(t){const e=t.split(".")[0];this.hass.callService(e,"toggle",{entity_id:t})}_renderLoading(){return B`
      <ha-card>
        <div class="empty">
          <p class="dim">Loading Adaptive Cover Pro registry…</p>
        </div>
      </ha-card>
    `}_renderEmpty(t){const e=this._config.entry_id,s=this._registry?.length??0,i=this._registry?.filter(t=>t.config_entry_id===e&&"adaptive_cover_pro"===t.platform).length;return B`
      <ha-card>
        <div class="empty">
          <p><strong>No Adaptive Cover Pro entities found</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${e}</code></p>
          <ul class="diag">
            <li>Reason: <code>${t}</code></li>
            <li>Registry entries loaded: <code>${s}</code></li>
            <li>ACP entities matching entry_id: <code>${i??"—"}</code></li>
            ${this._registryError?B`<li>Registry fetch error: <code>${this._registryError}</code></li>`:Z}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return Z;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const t=this._discovered;if(!t)return this._renderEmpty("no matching entities after unique_id lookup");const e=(s=this._config,{...At,...s?.controls});var s;const i=this._sections;return B`
      <ha-card>
        ${this._renderHeader(t,e)}
        <div class="body ${this._config.compact?"compact":""}">
          ${i.includes("sky")?B`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${[t]}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
              ></acp-sky-compass>`:Z}
          ${i.includes("elevation")?B`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:Z}
          ${i.includes("decision")?B`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
              ></acp-decision-strip>`:Z}
          ${i.includes("covers")?B`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:Z}
          ${i.includes("overrides")?B`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                .resetEnabled=${e.reset_manual_override}
              ></acp-overrides-panel>`:Z}
          ${i.includes("climate")?B`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:Z}
        </div>
        ${this._config.show_version?B`<div class="footer dim">adaptive-cover-pro-card v${_t}</div>`:Z}
      </ha-card>
    `}};fe.styles=n`
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
  `,t([gt({attribute:!1})],fe.prototype,"hass",void 0),t([vt()],fe.prototype,"_config",void 0),t([vt()],fe.prototype,"_registry",void 0),t([vt()],fe.prototype,"_registryError",void 0),t([vt()],fe.prototype,"_discovered",void 0),fe=t([ht(ft)],fe),window.customCards=window.customCards||[],window.customCards.push({type:ft,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${_t} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{fe as AdaptiveCoverProCard};
