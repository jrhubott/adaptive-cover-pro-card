/*! adaptive-cover-pro-card v1.2.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function t(t,e,s,i){var o,n=arguments.length,r=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,s,r):o(e,s))||r);return n>3&&r&&Object.defineProperty(e,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,v=g.trustedTypes,m=v?v.emptyScript:"",_=g.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);o?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const n=o.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const n=this.constructor;if(!1===i&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??$)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,_?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,A=w.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,T=`<${M}>`,z=document,P=()=>z.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,I="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,D=/>/g,F=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,B=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),W=B(1),V=B(2),q=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),J=new WeakMap,G=z.createTreeWalker(z,129);function X(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<s;e++){const s=t[e];let a,c,l=-1,d=0;for(;d<s.length&&(r.lastIndex=d,c=r.exec(s),null!==c);)d=r.lastIndex,r===R?"!--"===c[1]?r=U:void 0!==c[1]?r=D:void 0!==c[2]?(L.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=F):void 0!==c[3]&&(r=F):r===F?">"===c[0]?(r=o??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?F:'"'===c[3]?j:H):r===j||r===H?r=F:r===U||r===D?r=R:(r=F,o=void 0);const h=r===F&&t[e+1].startsWith("/>")?" ":"";n+=r===R?s+T:l>=0?(i.push(a),s.slice(0,l)+E+s.slice(l)+C+h):s+C+(-2===l?e:h)}return[X(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Q{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[c,l]=K(t,e);if(this.el=Q.createElement(c,s),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=G.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=l[n++],s=i.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?it:"?"===r[1]?ot:"@"===r[1]?nt:st}),i.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),G.nextNode(),a.push({type:2,index:++o});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===M)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function Y(t,e,s=t,i){if(e===q)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=O(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Y(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);G.currentNode=i;let o=G.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new rt(o,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(o=G.nextNode(),n++)}return G.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),O(t)?t===Z||null==t||""===t?(this._$AH!==Z&&this._$AR(),this._$AH=Z):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Z&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Q.createElement(X(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new Q(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new et(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Z}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(void 0===o)t=Y(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Y(this,i[s+r],e,r),a===q&&(a=this._$AH[r]),n||=!O(a)||a!==this._$AH[r],a===Z?t=Z:t!==Z&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Z?void 0:t}}class ot extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Z)}}class nt extends st{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??Z)===q)return;const s=this._$AH,i=t===Z&&s!==Z||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==Z&&(s===Z||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Q,et),(w.litHtmlVersions??=[]).push("3.3.2");const ct=globalThis;class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(P(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ut=(t=pt,e,s)=>{const{kind:i,metadata:o}=s;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function gt(t){return(e,s)=>"object"==typeof s?ut(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function vt(t){return gt({...t,state:!0,attribute:!1})}const mt="1.2.0",_t="adaptive-cover-pro-card",ft="adaptive-cover-pro-card-editor",yt="adaptive_cover_pro",$t=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default"],bt={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},xt={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},wt={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},kt={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"};function At(t){return`acp-card:registry:v1:${t}`}const St={get(t){try{const e=localStorage.getItem(At(t));if(!e)return null;const s=JSON.parse(e);return 1!==s.schemaVersion?null:s}catch{return null}},set(t,e){try{const s={schemaVersion:1,cardVersion:mt,fetchedAt:Date.now(),entries:e};localStorage.setItem(At(t),JSON.stringify(s))}catch{}},invalidate(t){try{localStorage.removeItem(At(t))}catch{}},clear(){try{const t="acp-card:registry:v1:",e=[];for(let s=0;s<localStorage.length;s++){const i=localStorage.key(s);i?.startsWith(t)&&e.push(i)}e.forEach(t=>localStorage.removeItem(t))}catch{}}};function Et(t){return`${t.entity_id}|${t.unique_id}|${t.platform}|${t.config_entry_id??""}`}function Ct(t,e,s){return t.filter(t=>t.config_entry_id===e&&void 0===s)}let Mt=class extends lt{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return W`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":Z}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};function Tt(t,e){const s=(t-90)*Math.PI/180;return{x:e*Math.cos(s),y:e*Math.sin(s)}}function zt(t,e,s,i=0){const o=t=>(t%360+360)%360,n=o(t),r=o(e);let a=r-n;a<0&&(a+=360);const c=a>180?1:0,l=Tt(n,s),d=Tt(r,s);if(i<=0)return`M 0 0 L ${l.x} ${l.y} A ${s} ${s} 0 ${c} 1 ${d.x} ${d.y} Z`;const h=Tt(r,i),p=Tt(n,i);return[`M ${l.x} ${l.y}`,`A ${s} ${s} 0 ${c} 1 ${d.x} ${d.y}`,`L ${h.x} ${h.y}`,`A ${i} ${i} 0 ${c} 0 ${p.x} ${p.y}`,"Z"].join(" ")}function Pt(t,e){return Tt(t,function(t){return 1-Math.max(0,Math.min(90,t))/90}(e))}function Ot(t){return(t%360+360)%360}function Nt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}Mt.styles=r`
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
  `,t([gt({type:Boolean})],Mt.prototype,"on",void 0),t([gt({type:Boolean})],Mt.prototype,"readonly",void 0),t([gt({type:String})],Mt.prototype,"label",void 0),t([gt({type:String})],Mt.prototype,"title",void 0),Mt=t([ht("acp-header-pill")],Mt);var It,Rt={exports:{}};It=Rt,function(){var t=Math.PI,e=Math.sin,s=Math.cos,i=Math.tan,o=Math.asin,n=Math.atan2,r=Math.acos,a=t/180,c=864e5,l=2440588,d=2451545;function h(t){return new Date((t+.5-l)*c)}function p(t){return function(t){return t.valueOf()/c-.5+l}(t)-d}var u=23.4397*a;function g(t,o){return n(e(t)*s(u)-i(o)*e(u),s(t))}function v(t,i){return o(e(i)*s(u)+s(i)*e(u)*e(t))}function m(t,o,r){return n(e(t),s(t)*e(o)-i(r)*s(o))}function _(t,i,n){return o(e(i)*e(n)+s(i)*s(n)*s(t))}function f(t,e){return a*(280.16+360.9856235*t)-e}function y(t){return a*(357.5291+.98560028*t)}function $(s){return s+a*(1.9148*e(s)+.02*e(2*s)+3e-4*e(3*s))+102.9372*a+t}function b(t){var e=$(y(t));return{dec:v(e,0),ra:g(e,0)}}var x={getPosition:function(t,e,s){var i=a*-s,o=a*e,n=p(t),r=b(n),c=f(n,i)-r.ra;return{azimuth:m(c,o,r.dec),altitude:_(c,o,r.dec)}}},w=x.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];x.addTime=function(t,e,s){w.push([t,e,s])};var k=9e-4;function A(e,s,i){return k+(e+s)/(2*t)+i}function S(t,s,i){return d+t+.0053*e(s)-.0069*e(2*i)}function E(t,i,o,n,a,c,l){var d=function(t,i,o){return r((e(t)-e(i)*e(o))/(s(i)*s(o)))}(t,o,n);return S(A(d,i,a),c,l)}function C(t){var i=a*(134.963+13.064993*t),o=a*(93.272+13.22935*t),n=a*(218.316+13.176396*t)+6.289*a*e(i),r=5.128*a*e(o),c=385001-20905*s(i);return{ra:g(n,r),dec:v(n,r),dist:c}}function M(t,e){return new Date(t.valueOf()+e*c/24)}x.getTimes=function(e,s,i,o){var n,r,c,l,d,u=a*-i,g=a*s,m=function(t){return-2.076*Math.sqrt(t)/60}(o=o||0),_=function(e,s){return Math.round(e-k-s/(2*t))}(p(e),u),f=A(0,u,_),b=y(f),x=$(b),C=v(x,0),M=S(f,b,x),T={solarNoon:h(M),nadir:h(M-.5)};for(n=0,r=w.length;n<r;n+=1)d=M-((l=E(((c=w[n])[0]+m)*a,u,g,C,_,b,x))-M),T[c[1]]=h(d),T[c[2]]=h(l);return T},x.getMoonPosition=function(t,o,r){var c=a*-r,l=a*o,d=p(t),h=C(d),u=f(d,c)-h.ra,g=_(u,l,h.dec),v=n(e(u),i(l)*s(h.dec)-e(h.dec)*s(u));return g+=function(t){return t<0&&(t=0),2967e-7/Math.tan(t+.00312536/(t+.08901179))}(g),{azimuth:m(u,l,h.dec),altitude:g,distance:h.dist,parallacticAngle:v}},x.getMoonIllumination=function(t){var i=p(t||new Date),o=b(i),a=C(i),c=149598e3,l=r(e(o.dec)*e(a.dec)+s(o.dec)*s(a.dec)*s(o.ra-a.ra)),d=n(c*e(l),a.dist-c*s(l)),h=n(s(o.dec)*e(o.ra-a.ra),e(o.dec)*s(a.dec)-s(o.dec)*e(a.dec)*s(o.ra-a.ra));return{fraction:(1+s(d))/2,phase:.5+.5*d*(h<0?-1:1)/Math.PI,angle:h}},x.getMoonTimes=function(t,e,s,i){var o=new Date(t);i?o.setUTCHours(0,0,0,0):o.setHours(0,0,0,0);for(var n,r,c,l,d,h,p,u,g,v,m,_,f,y=.133*a,$=x.getMoonPosition(o,e,s).altitude-y,b=1;b<=24&&(n=x.getMoonPosition(M(o,b),e,s).altitude-y,u=((d=($+(r=x.getMoonPosition(M(o,b+1),e,s).altitude-y))/2-n)*(p=-(h=(r-$)/2)/(2*d))+h)*p+n,v=0,(g=h*h-4*d*n)>=0&&(m=p-(f=Math.sqrt(g)/(2*Math.abs(d))),_=p+f,Math.abs(m)<=1&&v++,Math.abs(_)<=1&&v++,m<-1&&(m=_)),1===v?$<0?c=b+m:l=b+m:2===v&&(c=b+(u<0?_:m),l=b+(u<0?m:_)),!c||!l);b+=2)$=r;var w={};return c&&(w.rise=M(o,c)),l&&(w.set=M(o,l)),c||l||(w[u>0?"alwaysUp":"alwaysDown"]=!0),w},It.exports=x}();var Ut=Nt(Rt.exports);function Dt(t,e,s,i=10){const o=[],n=s.getTime()+864e5;for(let r=s.getTime();r<=n;r+=60*i*1e3){const s=new Date(r),i=Ut.getPosition(s,t,e);o.push({t:s,elevation:180*i.altitude/Math.PI,azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360})}return o}function Ft(t=new Date){const e=new Date(t);return e.setHours(0,0,0,0),e}function Ht(t,e,s,i){const o=((e-s)%360+360)%360;return((t-o)%360+360)%360<=((((e+i)%360+360)%360-o)%360+360)%360}function jt(t){return t<.0625||t>=.9375?"New Moon":t<.1875?"Waxing Crescent":t<.3125?"First Quarter":t<.4375?"Waxing Gibbous":t<.5625?"Full Moon":t<.6875?"Waning Gibbous":t<.8125?"Last Quarter":"Waning Crescent"}function Lt(t){return null==t||Number.isNaN(t)?"—":`${Math.round(t)}%`}function Bt(t){return null==t||Number.isNaN(t)?"—":`${t.toFixed(1)}°`}function Wt(t){if(!t)return"—";const e=new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Vt(t){if(!t)return"—";const e=new Date(t).getTime();if(Number.isNaN(e))return"—";const s=Math.round((e-Date.now())/1e3);return s<=0?"expired":function(t){if(null==t||Number.isNaN(t))return"—";const e=Math.max(0,Math.round(t));if(e<60)return`${e}s`;const s=Math.floor(e/60);return s<60?`${s}m ${e%60}s`:`${Math.floor(s/60)}h ${s%60}m`}(s)}const qt=110;let Zt=class extends lt{constructor(){super(...arguments),this.compact=!1,this.showStats=!0,this.showLegend=!0,this.showMoon=!1}_sun(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=parseFloat(e.state);return Number.isNaN(s)?null:{...e.attributes,window_azimuth:e.attributes.window_azimuth}}_coverPosition(){const t=this.discovered.entities.target_position_sensor;if(!t)return null;const e=parseFloat(this.hass.states[t]?.state??"");return Number.isNaN(e)?null:e}_sunInfront(){const t=this.discovered.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}render(){if(!this.hass||!this.discovered)return Z;const t=this._sun();if(!t)return W`<div class="placeholder">Sun sensor not yet populated.</div>`;const e=Ot(t.window_azimuth),s=Ot(e-t.fov_left),i=Ot(e+t.fov_right),o=this.discovered.entities.sun_sensor,n=parseFloat(this.hass.states[o]?.state??"0"),r=t.elevation,a=Pt(n,r),c=Tt(e,qt),{latitude:l,longitude:d}=this.hass.config,h=void 0!==l&&void 0!==d?Dt(l,d,Ft()):[],p=this.showMoon&&void 0!==l&&void 0!==d?function(t,e,s=new Date){const i=Ut.getMoonPosition(s,t,e),o=Ut.getMoonIllumination(s);return{azimuth:((180*i.azimuth/Math.PI+180)%360+360)%360,elevation:180*i.altitude/Math.PI,phase:o.phase,fraction:o.fraction,phaseName:jt(o.phase)}}(l,d):null,u=null!==p&&p.elevation>0,g=p?p.phase<.5?-24*p.phase:24*(1-p.phase):0,v=u?Pt(p.azimuth,p.elevation):null,m=v?v.x*qt:0,_=v?v.y*qt:0,f=h.filter(t=>t.elevation>0).map(t=>{const e=Pt(t.azimuth,t.elevation);return`${(e.x*qt).toFixed(1)},${(e.y*qt).toFixed(1)}`}).join(" "),{riseAzimuth:y,setAzimuth:$}=function(t){let e=-1,s=-1;for(let i=0;i<t.length;i++)t[i].elevation>0&&(-1===e&&(e=i),s=i);return{riseAzimuth:e>=0?t[e].azimuth:null,setAzimuth:s>=0?t[s].azimuth:null}}(h),b=null!==y?Tt(y,qt):null,x=null!==$?Tt($,qt):null,w=t.blind_spot_range?zt(Ot(t.blind_spot_range[0]),Ot(t.blind_spot_range[1]),qt):null,k=this._coverPosition(),A=null!==k?qt*(1-k/100):null,S=t.in_fov,E=this._sunInfront(),C=r<=0,M=!C&&E?"sun valid":!C&&S?"sun in-fov":"sun",T=`Window FOV: ${Bt(t.fov_left)} left / ${Bt(t.fov_right)} right`,z=`Window normal: ${Bt(e)}`,P=`Sun: ${Bt(n)} az / ${Bt(r)} el`;return W`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${V`
            <defs>
              ${u?V`
                <mask id="moon-phase-mask">
                  <circle cx=${m} cy=${_} r=${6} fill="white" />
                  <circle cx=${m+g} cy=${_} r=${6} fill="black" />
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
              <path class="fov" d=${zt(s,i,qt)} />
            </g>

            <!-- cover closure fill (inner wedge, same FOV span, radius ∝ closure) -->
            ${null!==A&&A>.5?V`<g data-tooltip=${"Cover closed: "+k+"%"}><path class="cover-fill" d=${zt(s,i,A)} /></g>`:Z}

            <!-- blind spot (hatched) -->
            ${w?V`<g data-tooltip=${"Blind spot: "+Bt(t.blind_spot_range[0])+" – "+Bt(t.blind_spot_range[1])}><path class="blind-spot" d=${w} /></g>`:Z}

            <!-- sun path arc -->
            ${f?V`<g data-tooltip="Sun path (today)"><polyline class="sun-path" points=${f} /></g>`:Z}

            <!-- sunrise / sunset markers -->
            ${b&&null!==y?V`<g data-tooltip=${"Sunrise: "+Bt(y)}><circle class="rise-marker" cx=${b.x} cy=${b.y} r="4" /></g>`:Z}
            ${x&&null!==$?V`<g data-tooltip=${"Sunset: "+Bt($)}><circle class="set-marker" cx=${x.x} cy=${x.y} r="4" /></g>`:Z}

            <!-- window normal arrow -->
            <g data-tooltip=${z}>
              <line class="window" x1="0" y1="0" x2=${c.x} y2=${c.y} />
              <circle class="window-base" cx="0" cy="0" r="4" />
            </g>

            <!-- cardinal labels -->
            <text class="cardinal" x="0" y=${-116} text-anchor="middle">N</text>
            <text class="cardinal" x=${120} y="4" text-anchor="middle">E</text>
            <text class="cardinal" x="0" y=${124} text-anchor="middle">S</text>
            <text class="cardinal" x=${-120} y="4" text-anchor="middle">W</text>

            <!-- moon dot (above-horizon only) -->
            ${u?V`
              <g data-tooltip=${"Moon: "+p.phaseName+" ("+Math.round(100*p.fraction)+"%)"}>
                <circle class="moon-outline" cx=${m} cy=${_} r=${6} />
                <circle class="moon-lit" cx=${m} cy=${_} r=${6} mask="url(#moon-phase-mask)" />
              </g>
            `:Z}

            <!-- sun dot -->
            <g data-tooltip=${P}>
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
  `,t([gt({attribute:!1})],Zt.prototype,"hass",void 0),t([gt({attribute:!1})],Zt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Zt.prototype,"compact",void 0),t([gt({attribute:!1})],Zt.prototype,"showStats",void 0),t([gt({attribute:!1})],Zt.prototype,"showLegend",void 0),t([gt({attribute:!1})],Zt.prototype,"showMoon",void 0),Zt=t([ht("acp-sky-compass")],Zt);let Jt=class extends lt{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];return e?e.attributes:null}render(){if(!this.hass||!this.discovered)return Z;const t=this._sunAttrs(),{latitude:e,longitude:s}=this.hass.config;if(void 0===e||void 0===s||!t)return W`<div class="placeholder">Sun elevation chart unavailable.</div>`;const i=Ft(),o=Dt(e,s,i),n=new Date,r=function(t,e,s,i){let o=-1,n=-1,r=-1;for(let a=0;a<t.length;a++){const c=t[a];c.elevation>0&&Ht(c.azimuth,e,s,i)?(-1===r&&(r=a),a-r>n-o&&(o=r,n=a)):r=-1}return-1===o?null:{startIdx:o,endIdx:n}}(o,t.window_azimuth,t.fov_left,t.fov_right),a=t=>32+(t.getTime()-i.getTime())/864e5*360,c=t=>138-(t- -10)/100*128,l=o.map(t=>`${a(t.t).toFixed(1)},${c(t.elevation).toFixed(1)}`).join(" "),d=c(0),h=a(n),p=this._interpAt(o,n),u=p?c(p.elevation):null,g=r?o[r.startIdx].t:null,v=r?o[r.endIdx].t:null,m=g?a(g):null,_=v?a(v):null;return W`
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
              <line class="grid" x1=${32} y1=${c(t)} x2=${392} y2=${c(t)} />
              <text class="tick" x=${28} y=${c(t)+3} text-anchor="end">${t}°</text>
            `)}

            <!-- x-axis gridlines at every 6h -->
            ${[0,6,12,18,24].map(t=>{const e=new Date(i.getTime()+36e5*t);return V`
                <line class="grid faint" x1=${a(e)} y1=${10} x2=${a(e)} y2=${138} />
                <text class="tick" x=${a(e)} y=${152} text-anchor="middle">${t.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${d} x2=${392} y2=${d} />

            <!-- FOV shaded band (only the time the sun is actually in FOV + above horizon) -->
            ${null!==m&&null!==_?V`<rect
                  class="fov-band"
                  x=${m}
                  y=${10}
                  width=${_-m}
                  height=${128}
                />`:Z}

            <!-- elevation curve -->
            <polyline class="curve" points=${l} />

            <!-- current-time cursor -->
            <line class="now" x1=${h} y1=${10} x2=${h} y2=${138} />

            <!-- current sun dot -->
            ${null!==u?V`<circle class="sun-dot" cx=${h} cy=${u} r="4" />`:Z}
          `}
        </svg>
      </div>
    `}_interpAt(t,e){if(0===t.length)return null;const s=e.getTime();if(s<=t[0].t.getTime())return t[0];if(s>=t[t.length-1].t.getTime())return t[t.length-1];for(let i=1;i<t.length;i++)if(t[i].t.getTime()>=s){const o=t[i-1],n=t[i],r=(s-o.t.getTime())/(n.t.getTime()-o.t.getTime());return{t:e,elevation:o.elevation+(n.elevation-o.elevation)*r,azimuth:o.azimuth+(n.azimuth-o.azimuth)*r}}return t[t.length-1]}};Jt.styles=r`
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
  `,t([gt({attribute:!1})],Jt.prototype,"hass",void 0),t([gt({attribute:!1})],Jt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Jt.prototype,"compact",void 0),Jt=t([ht("acp-elevation-chart")],Jt);let Gt=class extends lt{constructor(){super(...arguments),this.compact=!1,this.hideInactive=!1}_trace(){const t=this.discovered.entities.decision_trace_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=e.attributes;if(!s?.trace)return null;const i=new Map;for(const t of s.trace)i.set(Xt(t.handler),{matched:t.matched,reason:t.reason,position:t.position});return{winner:e.state,reason:s.reason??"",steps:i}}render(){if(!this.hass||!this.discovered)return Z;const t=this._trace();if(!t)return W`<div class="placeholder">Decision trace not yet populated.</div>`;const e=(s=$t,i=t.steps,o=t.winner,this.hideInactive?s.filter(t=>t===o||!0===i.get(t)?.matched):[...s]);var s,i,o;return W`
      <div class="wrap">
        <div class="head">
          <span class="label">Pipeline</span>
          <span class="winner">Winner: ${t.winner}</span>
        </div>
        <div class="rows">${e.map(e=>this._row(e,t.steps.get(e),t.winner===e))}</div>
        <div class="reason dim">${t.reason}</div>
      </div>
    `}_row(t,e,s){const i=e?.matched??!1,o=e?.reason??"not evaluated",n=e?.position;return W`
      <div class="row ${s?"winner":i?"match":"skip"}">
        <span class="name">${bt[t]}</span>
        <span class="dots" aria-hidden="true">${i?"████":"────"}</span>
        <span class="pos">${null!=n?Lt(n):""}</span>
        <span class="reason-inline dim">${o}</span>
        ${s?W`<span class="badge">✓</span>`:Z}
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
  `,t([gt({attribute:!1})],Gt.prototype,"hass",void 0),t([gt({attribute:!1})],Gt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Gt.prototype,"compact",void 0),t([gt({type:Boolean,reflect:!0,attribute:"hide-inactive"})],Gt.prototype,"hideInactive",void 0),Gt=t([ht("acp-decision-strip")],Gt);let Kt=class extends lt{constructor(){super(...arguments),this.compact=!1}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return{target:null,covers:{}};const e=this.hass.states[t];if(!e)return{target:null,covers:{}};const s=parseFloat(e.state),i=e.attributes;return{target:Number.isNaN(s)?null:s,covers:i?.actual_positions??{}}}_mismatched(){const t=this.discovered.entities.position_mismatch_binary;if(!t)return new Set;const e=this.hass.states[t];if("on"!==e?.state)return new Set;const s=e.attributes.entities;return s?new Set(Object.entries(s).filter(([,t])=>t.mismatch).map(([t])=>t)):new Set}_setPosition(t,e){this.hass.callService("cover","set_cover_position",{entity_id:t,position:e})}render(){if(!this.hass||!this.discovered)return Z;const{target:t,covers:e}=this._target(),s=this._mismatched(),i=Object.entries(e);return 0===i.length?W`<div class="placeholder">No covers reported by the integration.</div>`:W`
      <div class="wrap">
        <div class="head">
          <span class="label">Covers</span>
          <span class="target">Target: ${Lt(t)}</span>
        </div>
        ${i.map(([e,i])=>this._bar(e,i,t,s.has(e)))}
      </div>
    `}_bar(t,e,s,i){const o=this.hass.states[t]?.attributes?.friendly_name??t,n=s??0;return W`
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
                style="left:${n}%"
                title="Target ${n}%"
              ></div>`:Z}
        </div>
        <div class="num">${Lt(e)}</div>
        ${i?W`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:Z}
      </div>
    `}_handleTrackClick(t,e){const s=t.currentTarget.getBoundingClientRect(),i=Math.round((t.clientX-s.left)/s.width*100),o=Math.max(0,Math.min(100,i));this._setPosition(e,o)}};Kt.styles=r`
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
  `,t([gt({attribute:!1})],Kt.prototype,"hass",void 0),t([gt({attribute:!1})],Kt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Kt.prototype,"compact",void 0),Kt=t([ht("acp-cover-bar")],Kt);let Qt=class extends lt{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualEndIso(){const t=this.discovered.entities.manual_override_end_sensor;if(!t)return null;const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:null}_motionStatus(){const t=this.discovered.entities.motion_status_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const s=e.attributes.motion_timeout_end_time;return{state:e.state,endIso:s??null}}_forceActive(){const t=this.discovered.entities.force_override_sensor;if(!t)return 0;const e=this.hass.states[t];return e&&parseInt(e.state,10)||0}_resetManual(){const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}render(){if(!this.hass||!this.discovered)return Z;const t=this._manualActive(),e=this._manualEndIso(),s=this._motionStatus(),i=this._forceActive(),o=this.discovered.entities.reset_override_button;return W`
      <div class="wrap">
        <div class="label dim">Overrides</div>
        <div class="grid">
          <div class="tile ${t?"active":""}">
            <div class="tile-label">Manual</div>
            <div class="tile-value">${t?"Active":"Off"}</div>
            ${e?W`<div class="tile-sub dim">ends in ${Vt(e)}</div>`:Z}
          </div>

          <div class="tile ${i>0?"active warning":""}">
            <div class="tile-label">Force</div>
            <div class="tile-value">${i>0?`${i} active`:"Off"}</div>
          </div>

          ${s?W`<div class="tile ${"motion_detected"===s.state?"active":""}">
                <div class="tile-label">Motion</div>
                <div class="tile-value">${s.state.replace(/_/g," ")}</div>
                ${s.endIso?W`<div class="tile-sub dim">timeout ${Vt(s.endIso)}</div>`:Z}
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
  `,t([gt({attribute:!1})],Qt.prototype,"hass",void 0),t([gt({attribute:!1})],Qt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Qt.prototype,"compact",void 0),t([gt({type:Boolean,attribute:"reset-enabled"})],Qt.prototype,"resetEnabled",void 0),Qt=t([ht("acp-overrides-panel")],Qt);const Yt={"Summer Mode":"mdi:weather-sunny","Winter Mode":"mdi:snowflake",Intermediate:"mdi:weather-partly-cloudy"};let te=class extends lt{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return Z;const t=this.discovered.entities.climate_status_sensor;if(!t)return Z;const e=this.hass.states[t];if(!e||"unavailable"===e.state)return Z;const s=e.state,i=e.attributes??{},o=Yt[s]??"mdi:thermostat",n=i.temperature_unit??"°",r=[void 0!==i.indoor_temperature?{label:"Indoor",value:i.indoor_temperature,unit:n}:null,void 0!==i.outdoor_temperature?{label:"Outdoor",value:i.outdoor_temperature,unit:n}:null].filter(t=>null!==t),a=[{label:"Presence",value:i.is_presence,icon:"mdi:account-check"},{label:"Sunny",value:i.is_sunny,icon:"mdi:white-balance-sunny"},{label:"Lux",value:i.lux_active,icon:"mdi:brightness-7"},{label:"Irradiance",value:i.irradiance_active,icon:"mdi:solar-power"}].filter(t=>void 0!==t.value);return W`
      <div class="wrap">
        <div class="head">
          <span class="label">Climate</span>
          <span class="dim"
            >Active:
            ${void 0!==i.active_temperature?`${i.active_temperature.toFixed(1)}${n}`:"—"}</span
          >
        </div>
        <div class="strategy">
          <ha-icon icon=${o}></ha-icon>
          <span class="strategy-name">${s}</span>
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
  `,t([gt({attribute:!1})],te.prototype,"hass",void 0),t([gt({attribute:!1})],te.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],te.prototype,"compact",void 0),te=t([ht("acp-climate-panel")],te);const ee=[{key:"sky",label:"Sky compass",description:"Sun vs. window FOV, polar plot"},{key:"elevation",label:"Sun today",description:"Elevation-vs-time chart with FOV band and current-time cursor"},{key:"decision",label:"Decision strip",description:"All 10 pipeline handlers with the winning row highlighted"},{key:"covers",label:"Cover positions",description:"Per-cover live vs. target bars; click to set position"},{key:"overrides",label:"Overrides panel",description:"Manual, force, motion tiles + reset button"},{key:"climate",label:"Climate panel",description:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)"}],se=ee.map(t=>t.key);let ie=class extends lt{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,async function(t){return(await t.callWS({type:"config_entries/get",domain:yt})).filter(t=>t.domain===yt).map(t=>({entry_id:t.entry_id,title:t.title}))}(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id})}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??se}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_onEntryChange(t){const e=t.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:e})}_onSectionToggle(t,e){const s=new Set(this._currentSections);e?s.add(t):s.delete(t);const i=ee.map(t=>t.key).filter(t=>s.has(t));this._emit({...this._config??{type:"",entry_id:""},show_sections:i})}_onCompactToggle(t){this._emit({...this._config??{type:"",entry_id:""},compact:t})}_onVersionToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_version:t})}_onCompassStatsToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:t})}_onCompassLegendToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_legend:t})}_onMoonToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_moon:t})}_onHideInactiveToggle(t){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:t})}_onControlToggle(t,e){const s=this._config??{type:"",entry_id:""};this._emit({...s,controls:{...s.controls,[t]:e}})}render(){if(!this._config)return Z;const t=new Set(this._currentSections);return W`
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
    `:W`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};ie.styles=r`
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
  `,t([gt({attribute:!1})],ie.prototype,"hass",void 0),t([vt()],ie.prototype,"_config",void 0),t([vt()],ie.prototype,"_entries",void 0),t([vt()],ie.prototype,"_entriesError",void 0),ie=t([ht(ft)],ie);const oe=["sky","elevation","decision","covers","overrides","climate"];let ne=class extends lt{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._discovered=null,this._unsubRegistry=null,this._fetchInFlight=!1,this._memo=function(){let t=null,e=null;return(s,i,o)=>{const n=i.entry_id??"";return null!==t&&t.registry===o&&t.hass===s&&t.entryId===n||(t={registry:o,hass:s,entryId:n},e=function(t,e,s){const i=e.entry_id;if(!i)return null;const o={},n=`${i}_`;let r=!1;for(const t of s){if(t.config_entry_id!==i)continue;if(t.platform!==yt)continue;if(r=!0,!t.unique_id.startsWith(n))continue;const e=t.unique_id.slice(n.length),s=t.entity_id.split(".")[0],a=kt[`${s}:${e}`];a&&(o[a]=t.entity_id)}if(!r||0===Object.keys(o).length)return null;const a=t;let c=i;if(a.devices)for(const t of Object.values(a.devices))if(t.config_entries?.includes(i)){c=t.name_by_user??t.name??i;break}const l=[],d=o.target_position_sensor;if(d){const e=t.states[d]?.attributes?.actual_positions;e&&l.push(...Object.keys(e))}let h="cover_blind";const p=o.control_status_sensor;if(p){const e=t.states[p]?.attributes;e?.cover_type&&(h=e.cover_type)}return{entry_id:i,entry_title:c,cover_type:h,entities:o,managed_covers:l}}(s,i,o)),e}}(),this._debounceTimer=null,this._debounceFirstAt=null,this._DEBOUNCE_DELAY=500,this._DEBOUNCE_MAX=2e3}setConfig(t){if(!t?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");if(this._config={...t},null===this._registry){const e=St.get(t.entry_id);e&&(this._registry=e.entries)}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(ft)}static getStubConfig(){return{type:`custom:${_t}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null),null!==this._debounceTimer&&(clearTimeout(this._debounceTimer),this._debounceTimer=null,this._debounceFirstAt=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}willUpdate(t){null!==this._registry&&this._config&&this.hass&&(t.has("hass")||t.has("_registry")||t.has("_config"))&&(this._discovered=this._memo(this.hass,this._config,this._registry))}_ensureRegistry(){this._fetchRegistry(),this._unsubRegistry||(this._unsubRegistry=function(t,e){let s=null,i=!1;return t.connection.subscribeEvents(t=>e(t.data),"entity_registry_updated").then(t=>{i?t():s=t}).catch(()=>{}),()=>{i=!0,s&&s()}}(this.hass,t=>{const e=new Set(Ct(this._registry??[],this._config?.entry_id??"").map(t=>t.entity_id));(function(t,e){return"create"===t.action||e.has(t.entity_id)})(t,e)&&this._scheduleRefetch()}))}_fetchRegistry(){this._fetchInFlight||(this._fetchInFlight=!0,async function(t){return t.callWS({type:"config/entity_registry/list"})}(this.hass).then(t=>{const e=this._config?.entry_id;if(e){const s=Ct(t,e);(null===this._registry||function(t,e){if(t.length!==e.length)return!0;const s=new Map(t.map(t=>[t.entity_id,Et(t)]));for(const t of e)if(s.get(t.entity_id)!==Et(t))return!0;return!1}(Ct(this._registry,e),s))&&(this._registry=t,St.set(e,s))}else this._registry=t;this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}))}_scheduleRefetch(){const t=Date.now();null===this._debounceFirstAt&&(this._debounceFirstAt=t);const e=t-this._debounceFirstAt,s=this._DEBOUNCE_MAX-e,i=Math.min(this._DEBOUNCE_DELAY,s);if(null!==this._debounceTimer&&clearTimeout(this._debounceTimer),i<=0)return this._debounceFirstAt=null,void this._fetchRegistry();this._debounceTimer=setTimeout(()=>{this._debounceTimer=null,this._debounceFirstAt=null,this._fetchRegistry()},i)}get _sections(){return this._config?.show_sections??oe}_renderHeader(t,e){const s=xt[t.cover_type]??"mdi:window-shutter",i=t.entities.integration_enabled_switch,o=t.entities.automatic_control_switch,n=!i||"on"===this.hass.states[i]?.state,r=!o||"on"===this.hass.states[o]?.state;return W`
      <div class="header">
        <ha-icon .icon=${s}></ha-icon>
        <span class="title">${t.entry_title}</span>
        <span class="spacer"></span>
        ${i?W`<acp-header-pill
              .on=${n}
              .readonly=${!e.integration_enabled}
              .label=${n?"ON":"OFF"}
              title="Integration Enabled"
              @pill-click=${()=>this._toggle(i)}
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
    `}_renderEmpty(t){const e=this._config.entry_id,s=this._registry?.length??0,i=this._registry?.filter(t=>t.config_entry_id===e&&"adaptive_cover_pro"===t.platform).length;return W`
      <ha-card>
        <div class="empty">
          <p><strong>No Adaptive Cover Pro entities found</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${e}</code></p>
          <ul class="diag">
            <li>Reason: <code>${t}</code></li>
            <li>Registry entries loaded: <code>${s}</code></li>
            <li>ACP entities matching entry_id: <code>${i??"—"}</code></li>
            ${this._registryError?W`<li>Registry fetch error: <code>${this._registryError}</code></li>`:Z}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return Z;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const t=this._discovered;if(!t)return this._renderEmpty("no matching entities after unique_id lookup");const e=(s=this._config,{...wt,...s?.controls});var s;const i=this._sections;return W`
      <ha-card>
        ${this._renderHeader(t,e)}
        <div class="body ${this._config.compact?"compact":""}">
          ${i.includes("sky")?W`<acp-sky-compass
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats??!0}
                .showLegend=${this._config.show_compass_legend??!0}
                .showMoon=${this._config.show_moon??!1}
              ></acp-sky-compass>`:Z}
          ${i.includes("elevation")?W`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:Z}
          ${i.includes("decision")?W`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
              ></acp-decision-strip>`:Z}
          ${i.includes("covers")?W`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:Z}
          ${i.includes("overrides")?W`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                .resetEnabled=${e.reset_manual_override}
              ></acp-overrides-panel>`:Z}
          ${i.includes("climate")?W`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:Z}
        </div>
        ${this._config.show_version?W`<div class="footer dim">adaptive-cover-pro-card v${mt}</div>`:Z}
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
  `,t([gt({attribute:!1})],ne.prototype,"hass",void 0),t([vt()],ne.prototype,"_config",void 0),t([vt()],ne.prototype,"_registry",void 0),t([vt()],ne.prototype,"_registryError",void 0),t([vt()],ne.prototype,"_discovered",void 0),ne=t([ht(_t)],ne),window.customCards=window.customCards||[],window.customCards.push({type:_t,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${mt} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{ne as AdaptiveCoverProCard};
