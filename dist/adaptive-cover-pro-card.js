/*! adaptive-cover-pro-card v1.0.0 | MIT License | https://github.com/jrhubott/adaptive-cover-pro-card */
function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,g=globalThis,v=g.trustedTypes,f=v?v.emptyScript:"",m=g.reactiveElementPolyfillSupport,_=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??$)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,m?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,A=w.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,P=`<${M}>`,z=document,O=()=>z.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,I="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,H=/>/g,D=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,F=/"/g,L=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),V=B(1),W=B(2),q=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),J=new WeakMap,K=z.createTreeWalker(z,129);function G(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,c=r.exec(i),null!==c);)d=r.lastIndex,r===R?"!--"===c[1]?r=U:void 0!==c[1]?r=H:void 0!==c[2]?(L.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=D):void 0!==c[3]&&(r=D):r===D?">"===c[0]?(r=o??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?D:'"'===c[3]?F:j):r===F||r===j?r=D:r===U||r===H?r=R:(r=D,o=void 0);const p=r===D&&t[e+1].startsWith("/>")?" ":"";n+=r===R?i+P:l>=0?(s.push(a),i.slice(0,l)+E+i.slice(l)+C+p):i+C+(-2===l?e:p)}return[G(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[c,l]=X(t,e);if(this.el=Q.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[n++],i=s.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?st:"?"===r[1]?ot:"@"===r[1]?nt:it}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],O()),K.nextNode(),a.push({type:2,index:++o});s.append(t[e],O())}}}else if(8===s.nodeType)if(s.data===M)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=T(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Y(t,o._$AS(t,e.values),o,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);K.currentNode=s;let o=K.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new rt(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=K.nextNode(),n++)}return K.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),T(t)?t===Z||null==t||""===t?(this._$AH!==Z&&this._$AR(),this._$AH=Z):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Z&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new Q(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new et(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Z}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=Y(this,t,e,0),n=!T(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Y(this,s[i+r],e,r),a===q&&(a=this._$AH[r]),n||=!T(a)||a!==this._$AH[r],a===Z?t=Z:t!==Z&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Z?void 0:t}}class ot extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Z)}}class nt extends it{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??Z)===q)return;const i=this._$AH,s=t===Z&&i!==Z||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==Z&&(i===Z||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Q,et),(w.litHtmlVersions??=[]).push("3.3.2");const ct=globalThis;class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new et(e.insertBefore(O(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const pt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ut=(t=ht,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function gt(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function vt(t){return gt({...t,state:!0,attribute:!1})}const ft="1.0.0-dev.ae7cf2b-dirty.6",mt="adaptive-cover-pro-card",_t="adaptive-cover-pro-card-editor",yt="adaptive_cover_pro",$t=["force","weather","manual","custom_position","motion","cloud","climate","glare_zone","solar","default"],bt={force:"Force Override",weather:"Weather Safety",manual:"Manual Override",custom_position:"Custom Position",motion:"Motion Timeout",cloud:"Cloud Suppression",climate:"Climate",glare_zone:"Glare Zone",solar:"Solar Tracking",default:"Default"},xt={cover_blind:"mdi:blinds-horizontal",cover_awning:"mdi:awning-outline",cover_tilt:"mdi:blinds"},wt={integration_enabled:!0,automatic_control:!0,reset_manual_override:!0},kt={"sensor:Cover_Position":"target_position_sensor","sensor:sun_position":"sun_sensor","sensor:Start Sun":"start_sensor","sensor:End Sun":"end_sensor","sensor:control_status":"control_status_sensor","sensor:decision_trace":"decision_trace_sensor","sensor:last_cover_action":"last_action_sensor","sensor:last_skipped_action":"last_skipped_sensor","sensor:manual_override_end_time":"manual_override_end_sensor","sensor:position_verification":"position_verification_sensor","sensor:motion_status":"motion_status_sensor","sensor:force_override_triggers":"force_override_sensor","sensor:climate_status":"climate_status_sensor","binary_sensor:sun_motion":"sun_infront_binary","binary_sensor:manual_override":"manual_override_binary","binary_sensor:position_mismatch":"position_mismatch_binary","binary_sensor:glare_active":"glare_active_binary","switch:Integration Enabled":"integration_enabled_switch","switch:Automatic Control":"automatic_control_switch","switch:Manual Override":"manual_toggle_switch","switch:Climate Mode":"climate_mode_switch","switch:Motion Control":"motion_control_switch","button:Reset Manual Override":"reset_override_button"};let At=class extends lt{constructor(){super(...arguments),this.on=!1,this.readonly=!1,this.label="",this.title=""}_handleClick(){this.readonly||this.dispatchEvent(new CustomEvent("pill-click",{bubbles:!0,composed:!0}))}render(){return V`
      <button
        class="pill ${this.on?"on":"off"} ${this.readonly?"readonly":""}"
        title=${this.title}
        aria-disabled=${this.readonly?"true":Z}
        tabindex=${this.readonly?"-1":"0"}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `}};function St(t,e){const i=(t-90)*Math.PI/180;return{x:e*Math.cos(i),y:e*Math.sin(i)}}function Et(t,e,i,s=0){const o=t=>(t%360+360)%360,n=o(t),r=o(e);let a=r-n;a<0&&(a+=360);const c=a>180?1:0,l=St(n,i),d=St(r,i);if(s<=0)return`M 0 0 L ${l.x} ${l.y} A ${i} ${i} 0 ${c} 1 ${d.x} ${d.y} Z`;const p=St(r,s),h=St(n,s);return[`M ${l.x} ${l.y}`,`A ${i} ${i} 0 ${c} 1 ${d.x} ${d.y}`,`L ${p.x} ${p.y}`,`A ${s} ${s} 0 ${c} 0 ${h.x} ${h.y}`,"Z"].join(" ")}function Ct(t){return(t%360+360)%360}function Mt(t){return null==t||Number.isNaN(t)?"—":`${Math.round(t)}%`}function Pt(t){return null==t||Number.isNaN(t)?"—":`${t.toFixed(1)}°`}function zt(t){if(!t)return"—";const e=new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Ot(t){if(!t)return"—";const e=new Date(t).getTime();if(Number.isNaN(e))return"—";const i=Math.round((e-Date.now())/1e3);return i<=0?"expired":function(t){if(null==t||Number.isNaN(t))return"—";const e=Math.max(0,Math.round(t));if(e<60)return`${e}s`;const i=Math.floor(e/60);return i<60?`${i}m ${e%60}s`:`${Math.floor(i/60)}h ${i%60}m`}(i)}At.styles=r`
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
  `,t([gt({type:Boolean})],At.prototype,"on",void 0),t([gt({type:Boolean})],At.prototype,"readonly",void 0),t([gt({type:String})],At.prototype,"label",void 0),t([gt({type:String})],At.prototype,"title",void 0),At=t([pt("acp-header-pill")],At);const Tt=110;let Nt=class extends lt{constructor(){super(...arguments),this.compact=!1,this.showStats=!0}_sun(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=parseFloat(e.state);return Number.isNaN(i)?null:{...e.attributes,window_azimuth:e.attributes.window_azimuth}}_sunInfront(){const t=this.discovered.entities.sun_infront_binary;return!!t&&"on"===this.hass.states[t]?.state}render(){if(!this.hass||!this.discovered)return Z;const t=this._sun();if(!t)return V`<div class="placeholder">Sun sensor not yet populated.</div>`;const e=Ct(t.window_azimuth),i=Ct(e-t.fov_left),s=Ct(e+t.fov_right),o=this.discovered.entities.sun_sensor,n=parseFloat(this.hass.states[o]?.state??"0"),r=t.elevation,a=St(n,function(t){return 1-Math.max(0,Math.min(90,t))/90}(r)),c=St(e,Tt),l=t.blind_spot_range?Et(Ct(t.blind_spot_range[0]),Ct(t.blind_spot_range[1]),Tt):null,d=t.in_fov,p=this._sunInfront(),h=r<=0,u=!h&&p?"sun valid":!h&&d?"sun in-fov":"sun";return V`
      <div class="compass">
        <svg viewBox="${-140} ${-140} ${280} ${280}">
          ${W`
            <!-- concentric elevation rings at 30°, 60° -->
            <circle class="grid" r=${Tt} />
            <circle class="grid" r=${220/3} />
            <circle class="grid" r=${Tt/3} />
            <!-- cardinal direction lines -->
            <line class="grid thin" x1="0" y1=${-110} x2="0" y2=${Tt} />
            <line class="grid thin" x1=${-110} y1="0" x2=${Tt} y2="0" />

            <!-- FOV wedge -->
            <path class="fov" d=${Et(i,s,Tt)} />

            <!-- blind spot (hatched) -->
            ${l?W`<path class="blind-spot" d=${l} />`:Z}

            <!-- window normal arrow -->
            <line
              class="window"
              x1="0" y1="0"
              x2=${c.x} y2=${c.y}
            />
            <circle class="window-base" cx="0" cy="0" r="4" />

            <!-- cardinal labels -->
            <text class="cardinal" x="0" y=${-116} text-anchor="middle">N</text>
            <text class="cardinal" x=${120} y="4" text-anchor="middle">E</text>
            <text class="cardinal" x="0" y=${124} text-anchor="middle">S</text>
            <text class="cardinal" x=${-120} y="4" text-anchor="middle">W</text>

            <!-- sun dot -->
            <circle
              class=${u}
              cx=${a.x*Tt}
              cy=${a.y*Tt}
              r="7"
            />
          `}
        </svg>
        <div class="legend">
          <div><span class="dot sun valid"></span> Sun (in FOV)</div>
          <div><span class="dot sun"></span> Sun (outside)</div>
          <div><span class="swatch fov"></span> Window FOV</div>
        </div>
        ${this.showStats?V`<div class="stats dim">
              <span>Azi: ${Pt(n)}</span>
              <span>Elev: ${Pt(r)}</span>
              <span>∠: ${Pt(t.gamma)}</span>
              <span>Window: ${Pt(e)}</span>
            </div>`:Z}
      </div>
    `}};function It(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}Nt.styles=r`
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
  `,t([gt({attribute:!1})],Nt.prototype,"hass",void 0),t([gt({attribute:!1})],Nt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Nt.prototype,"compact",void 0),t([gt({attribute:!1})],Nt.prototype,"showStats",void 0),Nt=t([pt("acp-sky-compass")],Nt);var Rt,Ut={exports:{}};Rt=Ut,function(){var t=Math.PI,e=Math.sin,i=Math.cos,s=Math.tan,o=Math.asin,n=Math.atan2,r=Math.acos,a=t/180,c=864e5,l=2440588,d=2451545;function p(t){return new Date((t+.5-l)*c)}function h(t){return function(t){return t.valueOf()/c-.5+l}(t)-d}var u=23.4397*a;function g(t,o){return n(e(t)*i(u)-s(o)*e(u),i(t))}function v(t,s){return o(e(s)*i(u)+i(s)*e(u)*e(t))}function f(t,o,r){return n(e(t),i(t)*e(o)-s(r)*i(o))}function m(t,s,n){return o(e(s)*e(n)+i(s)*i(n)*i(t))}function _(t,e){return a*(280.16+360.9856235*t)-e}function y(t){return a*(357.5291+.98560028*t)}function $(i){return i+a*(1.9148*e(i)+.02*e(2*i)+3e-4*e(3*i))+102.9372*a+t}function b(t){var e=$(y(t));return{dec:v(e,0),ra:g(e,0)}}var x={getPosition:function(t,e,i){var s=a*-i,o=a*e,n=h(t),r=b(n),c=_(n,s)-r.ra;return{azimuth:f(c,o,r.dec),altitude:m(c,o,r.dec)}}},w=x.times=[[-.833,"sunrise","sunset"],[-.3,"sunriseEnd","sunsetStart"],[-6,"dawn","dusk"],[-12,"nauticalDawn","nauticalDusk"],[-18,"nightEnd","night"],[6,"goldenHourEnd","goldenHour"]];x.addTime=function(t,e,i){w.push([t,e,i])};var k=9e-4;function A(e,i,s){return k+(e+i)/(2*t)+s}function S(t,i,s){return d+t+.0053*e(i)-.0069*e(2*s)}function E(t,s,o,n,a,c,l){var d=function(t,s,o){return r((e(t)-e(s)*e(o))/(i(s)*i(o)))}(t,o,n);return S(A(d,s,a),c,l)}function C(t){var s=a*(134.963+13.064993*t),o=a*(93.272+13.22935*t),n=a*(218.316+13.176396*t)+6.289*a*e(s),r=5.128*a*e(o),c=385001-20905*i(s);return{ra:g(n,r),dec:v(n,r),dist:c}}function M(t,e){return new Date(t.valueOf()+e*c/24)}x.getTimes=function(e,i,s,o){var n,r,c,l,d,u=a*-s,g=a*i,f=function(t){return-2.076*Math.sqrt(t)/60}(o=o||0),m=function(e,i){return Math.round(e-k-i/(2*t))}(h(e),u),_=A(0,u,m),b=y(_),x=$(b),C=v(x,0),M=S(_,b,x),P={solarNoon:p(M),nadir:p(M-.5)};for(n=0,r=w.length;n<r;n+=1)d=M-((l=E(((c=w[n])[0]+f)*a,u,g,C,m,b,x))-M),P[c[1]]=p(d),P[c[2]]=p(l);return P},x.getMoonPosition=function(t,o,r){var c=a*-r,l=a*o,d=h(t),p=C(d),u=_(d,c)-p.ra,g=m(u,l,p.dec),v=n(e(u),s(l)*i(p.dec)-e(p.dec)*i(u));return g+=function(t){return t<0&&(t=0),2967e-7/Math.tan(t+.00312536/(t+.08901179))}(g),{azimuth:f(u,l,p.dec),altitude:g,distance:p.dist,parallacticAngle:v}},x.getMoonIllumination=function(t){var s=h(t||new Date),o=b(s),a=C(s),c=149598e3,l=r(e(o.dec)*e(a.dec)+i(o.dec)*i(a.dec)*i(o.ra-a.ra)),d=n(c*e(l),a.dist-c*i(l)),p=n(i(o.dec)*e(o.ra-a.ra),e(o.dec)*i(a.dec)-i(o.dec)*e(a.dec)*i(o.ra-a.ra));return{fraction:(1+i(d))/2,phase:.5+.5*d*(p<0?-1:1)/Math.PI,angle:p}},x.getMoonTimes=function(t,e,i,s){var o=new Date(t);s?o.setUTCHours(0,0,0,0):o.setHours(0,0,0,0);for(var n,r,c,l,d,p,h,u,g,v,f,m,_,y=.133*a,$=x.getMoonPosition(o,e,i).altitude-y,b=1;b<=24&&(n=x.getMoonPosition(M(o,b),e,i).altitude-y,u=((d=($+(r=x.getMoonPosition(M(o,b+1),e,i).altitude-y))/2-n)*(h=-(p=(r-$)/2)/(2*d))+p)*h+n,v=0,(g=p*p-4*d*n)>=0&&(f=h-(_=Math.sqrt(g)/(2*Math.abs(d))),m=h+_,Math.abs(f)<=1&&v++,Math.abs(m)<=1&&v++,f<-1&&(f=m)),1===v?$<0?c=b+f:l=b+f:2===v&&(c=b+(u<0?m:f),l=b+(u<0?f:m)),!c||!l);b+=2)$=r;var w={};return c&&(w.rise=M(o,c)),l&&(w.set=M(o,l)),c||l||(w[u>0?"alwaysUp":"alwaysDown"]=!0),w},Rt.exports=x}();var Ht=It(Ut.exports);function Dt(t,e,i,s){const o=((e-i)%360+360)%360;return((t-o)%360+360)%360<=((((e+s)%360+360)%360-o)%360+360)%360}let jt=class extends lt{constructor(){super(...arguments),this.compact=!1}_sunAttrs(){const t=this.discovered.entities.sun_sensor;if(!t)return null;const e=this.hass.states[t];return e?e.attributes:null}render(){if(!this.hass||!this.discovered)return Z;const t=this._sunAttrs(),{latitude:e,longitude:i}=this.hass.config;if(void 0===e||void 0===i||!t)return V`<div class="placeholder">Sun elevation chart unavailable.</div>`;const s=function(t=new Date){const e=new Date(t);return e.setHours(0,0,0,0),e}(),o=function(t,e,i,s=10){const o=[],n=i.getTime()+864e5;for(let r=i.getTime();r<=n;r+=60*s*1e3){const i=new Date(r),s=Ht.getPosition(i,t,e);o.push({t:i,elevation:180*s.altitude/Math.PI,azimuth:((180*s.azimuth/Math.PI+180)%360+360)%360})}return o}(e,i,s),n=new Date,r=function(t,e,i,s){let o=-1,n=-1,r=-1;for(let a=0;a<t.length;a++){const c=t[a];c.elevation>0&&Dt(c.azimuth,e,i,s)?(-1===r&&(r=a),a-r>n-o&&(o=r,n=a)):r=-1}return-1===o?null:{startIdx:o,endIdx:n}}(o,t.window_azimuth,t.fov_left,t.fov_right),a=t=>32+(t.getTime()-s.getTime())/864e5*360,c=t=>138-(t- -10)/100*128,l=o.map(t=>`${a(t.t).toFixed(1)},${c(t.elevation).toFixed(1)}`).join(" "),d=c(0),p=a(n),h=this._interpAt(o,n),u=h?c(h.elevation):null,g=r?o[r.startIdx].t:null,v=r?o[r.endIdx].t:null,f=g?a(g):null,m=v?a(v):null;return V`
      <div class="wrap">
        <div class="head">
          <span class="label">Sun today</span>
          ${g&&v?V`<span class="dim"
                >FOV: ${zt(g.toISOString())} →
                ${zt(v.toISOString())}</span
              >`:V`<span class="dim">Sun does not enter FOV today</span>`}
        </div>
        <svg viewBox="0 0 ${400} ${160}" preserveAspectRatio="none">
          ${W`
            <!-- y-axis gridlines -->
            ${[0,30,60,90].map(t=>W`
              <line class="grid" x1=${32} y1=${c(t)} x2=${392} y2=${c(t)} />
              <text class="tick" x=${28} y=${c(t)+3} text-anchor="end">${t}°</text>
            `)}

            <!-- x-axis gridlines at every 6h -->
            ${[0,6,12,18,24].map(t=>{const e=new Date(s.getTime()+36e5*t);return W`
                <line class="grid faint" x1=${a(e)} y1=${10} x2=${a(e)} y2=${138} />
                <text class="tick" x=${a(e)} y=${152} text-anchor="middle">${t.toString().padStart(2,"0")}:00</text>
              `})}

            <!-- horizon -->
            <line class="horizon" x1=${32} y1=${d} x2=${392} y2=${d} />

            <!-- FOV shaded band (only the time the sun is actually in FOV + above horizon) -->
            ${null!==f&&null!==m?W`<rect
                  class="fov-band"
                  x=${f}
                  y=${10}
                  width=${m-f}
                  height=${128}
                />`:Z}

            <!-- elevation curve -->
            <polyline class="curve" points=${l} />

            <!-- current-time cursor -->
            <line class="now" x1=${p} y1=${10} x2=${p} y2=${138} />

            <!-- current sun dot -->
            ${null!==u?W`<circle class="sun-dot" cx=${p} cy=${u} r="4" />`:Z}
          `}
        </svg>
      </div>
    `}_interpAt(t,e){if(0===t.length)return null;const i=e.getTime();if(i<=t[0].t.getTime())return t[0];if(i>=t[t.length-1].t.getTime())return t[t.length-1];for(let s=1;s<t.length;s++)if(t[s].t.getTime()>=i){const o=t[s-1],n=t[s],r=(i-o.t.getTime())/(n.t.getTime()-o.t.getTime());return{t:e,elevation:o.elevation+(n.elevation-o.elevation)*r,azimuth:o.azimuth+(n.azimuth-o.azimuth)*r}}return t[t.length-1]}};jt.styles=r`
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
  `,t([gt({attribute:!1})],jt.prototype,"hass",void 0),t([gt({attribute:!1})],jt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],jt.prototype,"compact",void 0),jt=t([pt("acp-elevation-chart")],jt);let Ft=class extends lt{constructor(){super(...arguments),this.compact=!1,this.hideInactive=!1}_trace(){const t=this.discovered.entities.decision_trace_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=e.attributes;if(!i?.trace)return null;const s=new Map;for(const t of i.trace)s.set(Lt(t.handler),{matched:t.matched,reason:t.reason,position:t.position});return{winner:e.state,reason:i.reason??"",steps:s}}render(){if(!this.hass||!this.discovered)return Z;const t=this._trace();if(!t)return V`<div class="placeholder">Decision trace not yet populated.</div>`;const e=(i=$t,s=t.steps,o=t.winner,this.hideInactive?i.filter(t=>t===o||!0===s.get(t)?.matched):[...i]);var i,s,o;return V`
      <div class="wrap">
        <div class="head">
          <span class="label">Pipeline</span>
          <span class="winner">Winner: ${t.winner}</span>
        </div>
        <div class="rows">${e.map(e=>this._row(e,t.steps.get(e),t.winner===e))}</div>
        <div class="reason dim">${t.reason}</div>
      </div>
    `}_row(t,e,i){const s=e?.matched??!1,o=e?.reason??"not evaluated",n=e?.position;return V`
      <div class="row ${i?"winner":s?"match":"skip"}">
        <span class="name">${bt[t]}</span>
        <span class="dots" aria-hidden="true">${s?"████":"────"}</span>
        <span class="pos">${null!=n?Mt(n):""}</span>
        <span class="reason-inline dim">${o}</span>
        ${i?V`<span class="badge">✓</span>`:Z}
      </div>
    `}};function Lt(t){return t.replace(/Handler$/,"").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase().replace(/^force_override$/,"force").replace(/^weather_override$/,"weather").replace(/^manual_override$/,"manual").replace(/^motion_timeout$/,"motion").replace(/^cloud_suppression$/,"cloud")}Ft.styles=r`
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
  `,t([gt({attribute:!1})],Ft.prototype,"hass",void 0),t([gt({attribute:!1})],Ft.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Ft.prototype,"compact",void 0),t([gt({type:Boolean,reflect:!0,attribute:"hide-inactive"})],Ft.prototype,"hideInactive",void 0),Ft=t([pt("acp-decision-strip")],Ft);let Bt=class extends lt{constructor(){super(...arguments),this.compact=!1}_target(){const t=this.discovered.entities.target_position_sensor;if(!t)return{target:null,covers:{}};const e=this.hass.states[t];if(!e)return{target:null,covers:{}};const i=parseFloat(e.state),s=e.attributes;return{target:Number.isNaN(i)?null:i,covers:s?.actual_positions??{}}}_mismatched(){const t=this.discovered.entities.position_mismatch_binary;if(!t)return new Set;const e=this.hass.states[t];if("on"!==e?.state)return new Set;const i=e.attributes.entities;return i?new Set(Object.entries(i).filter(([,t])=>t.mismatch).map(([t])=>t)):new Set}_setPosition(t,e){this.hass.callService("cover","set_cover_position",{entity_id:t,position:e})}render(){if(!this.hass||!this.discovered)return Z;const{target:t,covers:e}=this._target(),i=this._mismatched(),s=Object.entries(e);return 0===s.length?V`<div class="placeholder">No covers reported by the integration.</div>`:V`
      <div class="wrap">
        <div class="head">
          <span class="label">Covers</span>
          <span class="target">Target: ${Mt(t)}</span>
        </div>
        ${s.map(([e,s])=>this._bar(e,s,t,i.has(e)))}
      </div>
    `}_bar(t,e,i,s){const o=this.hass.states[t]?.attributes?.friendly_name??t,n=i??0;return V`
      <div class="cover ${s?"mismatch":""}">
        <div class="name" title=${t}>${o}</div>
        <div
          class="track"
          @click=${e=>this._handleTrackClick(e,t)}
          title="Click to set position"
        >
          <div class="fill" style="width:${e??0}%"></div>
          ${null!==i?V`<div
                class="marker"
                style="left:${n}%"
                title="Target ${n}%"
              ></div>`:Z}
        </div>
        <div class="num">${Mt(e)}</div>
        ${s?V`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`:Z}
      </div>
    `}_handleTrackClick(t,e){const i=t.currentTarget.getBoundingClientRect(),s=Math.round((t.clientX-i.left)/i.width*100),o=Math.max(0,Math.min(100,s));this._setPosition(e,o)}};Bt.styles=r`
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
  `,t([gt({attribute:!1})],Bt.prototype,"hass",void 0),t([gt({attribute:!1})],Bt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Bt.prototype,"compact",void 0),Bt=t([pt("acp-cover-bar")],Bt);let Vt=class extends lt{constructor(){super(...arguments),this.compact=!1,this.resetEnabled=!0}_manualActive(){const t=this.discovered.entities.manual_override_binary;return!!t&&"on"===this.hass.states[t]?.state}_manualEndIso(){const t=this.discovered.entities.manual_override_end_sensor;if(!t)return null;const e=this.hass.states[t];return e&&"unknown"!==e.state&&"unavailable"!==e.state?e.state:null}_motionStatus(){const t=this.discovered.entities.motion_status_sensor;if(!t)return null;const e=this.hass.states[t];if(!e)return null;const i=e.attributes.motion_timeout_end_time;return{state:e.state,endIso:i??null}}_forceActive(){const t=this.discovered.entities.force_override_sensor;if(!t)return 0;const e=this.hass.states[t];return e&&parseInt(e.state,10)||0}_resetManual(){const t=this.discovered.entities.reset_override_button;t&&this.hass.callService("button","press",{entity_id:t})}render(){if(!this.hass||!this.discovered)return Z;const t=this._manualActive(),e=this._manualEndIso(),i=this._motionStatus(),s=this._forceActive(),o=this.discovered.entities.reset_override_button;return V`
      <div class="wrap">
        <div class="label dim">Overrides</div>
        <div class="grid">
          <div class="tile ${t?"active":""}">
            <div class="tile-label">Manual</div>
            <div class="tile-value">${t?"Active":"Off"}</div>
            ${e?V`<div class="tile-sub dim">ends in ${Ot(e)}</div>`:Z}
          </div>

          <div class="tile ${s>0?"active warning":""}">
            <div class="tile-label">Force</div>
            <div class="tile-value">${s>0?`${s} active`:"Off"}</div>
          </div>

          ${i?V`<div class="tile ${"motion_detected"===i.state?"active":""}">
                <div class="tile-label">Motion</div>
                <div class="tile-value">${i.state.replace(/_/g," ")}</div>
                ${i.endIso?V`<div class="tile-sub dim">timeout ${Ot(i.endIso)}</div>`:Z}
              </div>`:Z}
          ${o?this.resetEnabled?V`<button class="tile action" @click=${this._resetManual}>
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">Reset Manual</div>
                </button>`:V`<button class="tile action readonly" aria-disabled="true" tabindex="-1">
                  <ha-icon icon="mdi:restore"></ha-icon>
                  <div class="tile-value">Reset Manual</div>
                </button>`:Z}
        </div>
      </div>
    `}};Vt.styles=r`
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
  `,t([gt({attribute:!1})],Vt.prototype,"hass",void 0),t([gt({attribute:!1})],Vt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],Vt.prototype,"compact",void 0),t([gt({type:Boolean,attribute:"reset-enabled"})],Vt.prototype,"resetEnabled",void 0),Vt=t([pt("acp-overrides-panel")],Vt);const Wt={"Summer Mode":"mdi:weather-sunny","Winter Mode":"mdi:snowflake",Intermediate:"mdi:weather-partly-cloudy"};let qt=class extends lt{constructor(){super(...arguments),this.compact=!1}render(){if(!this.hass||!this.discovered)return Z;const t=this.discovered.entities.climate_status_sensor;if(!t)return Z;const e=this.hass.states[t];if(!e||"unavailable"===e.state)return Z;const i=e.state,s=e.attributes??{},o=Wt[i]??"mdi:thermostat",n=s.temperature_unit??"°",r=[void 0!==s.indoor_temperature?{label:"Indoor",value:s.indoor_temperature,unit:n}:null,void 0!==s.outdoor_temperature?{label:"Outdoor",value:s.outdoor_temperature,unit:n}:null].filter(t=>null!==t),a=[{label:"Presence",value:s.is_presence,icon:"mdi:account-check"},{label:"Sunny",value:s.is_sunny,icon:"mdi:white-balance-sunny"},{label:"Lux",value:s.lux_active,icon:"mdi:brightness-7"},{label:"Irradiance",value:s.irradiance_active,icon:"mdi:solar-power"}].filter(t=>void 0!==t.value);return V`
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
        ${r.length?V`
              <div class="temps">
                ${r.map(t=>V`
                    <div class="temp">
                      <span class="temp-label dim">${t.label}</span>
                      <span class="temp-value">${t.value.toFixed(1)}${t.unit}</span>
                    </div>
                  `)}
              </div>
            `:Z}
        ${a.length?V`
              <div class="conditions">
                ${a.map(t=>V`
                    <div class="chip ${t.value?"on":"off"}" title=${t.label}>
                      <ha-icon icon=${t.icon}></ha-icon>
                      <span>${t.label}</span>
                    </div>
                  `)}
              </div>
            `:Z}
      </div>
    `}};qt.styles=r`
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
  `,t([gt({attribute:!1})],qt.prototype,"hass",void 0),t([gt({attribute:!1})],qt.prototype,"discovered",void 0),t([gt({type:Boolean,reflect:!0})],qt.prototype,"compact",void 0),qt=t([pt("acp-climate-panel")],qt);const Zt=[{key:"sky",label:"Sky compass",description:"Sun vs. window FOV, polar plot"},{key:"elevation",label:"Sun today",description:"Elevation-vs-time chart with FOV band and current-time cursor"},{key:"decision",label:"Decision strip",description:"All 10 pipeline handlers with the winning row highlighted"},{key:"covers",label:"Cover positions",description:"Per-cover live vs. target bars; click to set position"},{key:"overrides",label:"Overrides panel",description:"Manual, force, motion tiles + reset button"},{key:"climate",label:"Climate panel",description:"Summer/winter/intermediate strategy (auto-hidden if climate mode is off)"}],Jt=Zt.map(t=>t.key);let Kt=class extends lt{constructor(){super(...arguments),this._entries=null,this._entriesError=null,this._fetchInFlight=!1}setConfig(t){this._config=t}updated(t){t.has("hass")&&this.hass&&!this._entries&&!this._fetchInFlight&&(this._fetchInFlight=!0,async function(t){return(await t.callWS({type:"config_entries/get",domain:yt})).filter(t=>t.domain===yt).map(t=>({entry_id:t.entry_id,title:t.title}))}(this.hass).then(t=>{this._entries=t,this._entriesError=null,this._config?.entry_id||1!==t.length||this._emit({...this._config??{type:"",entry_id:""},entry_id:t[0].entry_id})}).catch(t=>{this._entriesError=t?.message??"failed to load config entries"}).finally(()=>{this._fetchInFlight=!1}))}get _currentSections(){return this._config?.show_sections??Jt}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_onEntryChange(t){const e=t.target.value;this._emit({...this._config??{type:"",entry_id:""},entry_id:e})}_onSectionToggle(t,e){const i=new Set(this._currentSections);e?i.add(t):i.delete(t);const s=Zt.map(t=>t.key).filter(t=>i.has(t));this._emit({...this._config??{type:"",entry_id:""},show_sections:s})}_onCompactToggle(t){this._emit({...this._config??{type:"",entry_id:""},compact:t})}_onVersionToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_version:t})}_onCompassStatsToggle(t){this._emit({...this._config??{type:"",entry_id:""},show_compass_stats:t})}_onHideInactiveToggle(t){this._emit({...this._config??{type:"",entry_id:""},hide_inactive_handlers:t})}_onControlToggle(t,e){const i=this._config??{type:"",entry_id:""};this._emit({...i,controls:{...i.controls,[t]:e}})}render(){if(!this._config)return Z;const t=new Set(this._currentSections);return V`
      <div class="form">
        <div class="section">
          <label class="field-label">Adaptive Cover Pro instance</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">Sections</label>
          <div class="hint">Toggle which parts of the card are shown.</div>
          ${Zt.map(e=>V`
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
    `}_renderEntryPicker(){return this._entriesError?V`
        <div class="error">Failed to load config entries: ${this._entriesError}</div>
        <input
          type="text"
          .value=${this._config?.entry_id??""}
          placeholder="Enter config entry ID manually"
          @change=${this._onEntryChange}
          class="text-input"
        />
      `:this._entries?0===this._entries.length?V`
        <div class="error">
          No Adaptive Cover Pro config entries found. Add an instance under
          <code>Settings → Devices &amp; Services</code>, then come back.
        </div>
      `:V`
      <select class="select" .value=${this._config?.entry_id??""} @change=${this._onEntryChange}>
        ${this._config?.entry_id&&!this._entries.some(t=>t.entry_id===this._config.entry_id)?V`<option value=${this._config.entry_id}>
              (unknown: ${this._config.entry_id})
            </option>`:Z}
        ${this._entries.map(t=>V`
            <option value=${t.entry_id} ?selected=${t.entry_id===this._config?.entry_id}>
              ${t.title}
            </option>
          `)}
      </select>
    `:V`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`}};Kt.styles=r`
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
  `,t([gt({attribute:!1})],Kt.prototype,"hass",void 0),t([vt()],Kt.prototype,"_config",void 0),t([vt()],Kt.prototype,"_entries",void 0),t([vt()],Kt.prototype,"_entriesError",void 0),Kt=t([pt(_t)],Kt);const Gt=["sky","elevation","decision","covers","overrides","climate"];let Xt=class extends lt{constructor(){super(...arguments),this._registry=null,this._registryError=null,this._unsubRegistry=null,this._fetchInFlight=!1}setConfig(t){if(!t?.entry_id)throw new Error("adaptive-cover-pro-card: `entry_id` is required");this._config={...t}}getCardSize(){return 6}static async getConfigElement(){return document.createElement(_t)}static getStubConfig(){return{type:`custom:${mt}`,entry_id:""}}connectedCallback(){super.connectedCallback(),this.hass&&this._ensureRegistry()}disconnectedCallback(){super.disconnectedCallback(),this._unsubRegistry&&(this._unsubRegistry(),this._unsubRegistry=null)}updated(t){t.has("hass")&&this.hass&&this._ensureRegistry()}_ensureRegistry(){null!==this._registry||this._fetchInFlight||(this._fetchInFlight=!0,async function(t){return t.callWS({type:"config/entity_registry/list"})}(this.hass).then(t=>{this._registry=t,this._registryError=null}).catch(t=>{this._registryError=t?.message??"entity registry fetch failed"}).finally(()=>{this._fetchInFlight=!1}),this._unsubRegistry||(this._unsubRegistry=function(t,e){let i=null,s=!1;return t.connection.subscribeEvents(e,"entity_registry_updated").then(t=>{s?t():i=t}).catch(()=>{}),()=>{s=!0,i&&i()}}(this.hass,()=>{this._registry=null,this._fetchInFlight=!1,this._ensureRegistry()})))}get _sections(){return this._config?.show_sections??Gt}_renderHeader(t,e){const i=xt[t.cover_type]??"mdi:window-shutter",s=t.entities.integration_enabled_switch,o=t.entities.automatic_control_switch,n=!s||"on"===this.hass.states[s]?.state,r=!o||"on"===this.hass.states[o]?.state;return V`
      <div class="header">
        <ha-icon .icon=${i}></ha-icon>
        <span class="title">${t.entry_title}</span>
        <span class="spacer"></span>
        ${s?V`<acp-header-pill
              .on=${n}
              .readonly=${!e.integration_enabled}
              .label=${n?"ON":"OFF"}
              title="Integration Enabled"
              @pill-click=${()=>this._toggle(s)}
            ></acp-header-pill>`:Z}
        ${o?V`<acp-header-pill
              .on=${r}
              .readonly=${!e.automatic_control}
              label="Auto"
              title="Automatic Control"
              @pill-click=${()=>this._toggle(o)}
            ></acp-header-pill>`:Z}
      </div>
    `}_toggle(t){const e=t.split(".")[0];this.hass.callService(e,"toggle",{entity_id:t})}_renderLoading(){return V`
      <ha-card>
        <div class="empty">
          <p class="dim">Loading Adaptive Cover Pro registry…</p>
        </div>
      </ha-card>
    `}_renderEmpty(t){const e=this._config.entry_id,i=this._registry?.length??0,s=this._registry?.filter(t=>t.config_entry_id===e&&"adaptive_cover_pro"===t.platform).length;return V`
      <ha-card>
        <div class="empty">
          <p><strong>No Adaptive Cover Pro entities found</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${e}</code></p>
          <ul class="diag">
            <li>Reason: <code>${t}</code></li>
            <li>Registry entries loaded: <code>${i}</code></li>
            <li>ACP entities matching entry_id: <code>${s??"—"}</code></li>
            ${this._registryError?V`<li>Registry fetch error: <code>${this._registryError}</code></li>`:Z}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `}render(){if(!this._config||!this.hass)return Z;if(null===this._registry)return this._registryError?this._renderEmpty("registry fetch failed"):this._renderLoading();const t=function(t,e,i){const s=e.entry_id;if(!s)return null;const o={},n=`${s}_`;let r=!1;for(const t of i){if(t.config_entry_id!==s)continue;if(t.platform!==yt)continue;if(r=!0,!t.unique_id.startsWith(n))continue;const e=t.unique_id.slice(n.length),i=t.entity_id.split(".")[0],a=kt[`${i}:${e}`];a&&(o[a]=t.entity_id)}if(!r||0===Object.keys(o).length)return null;const a=t;let c=s;if(a.devices)for(const t of Object.values(a.devices))if(t.config_entries?.includes(s)){c=t.name_by_user??t.name??s;break}const l=[],d=o.target_position_sensor;if(d){const e=t.states[d]?.attributes?.actual_positions;e&&l.push(...Object.keys(e))}let p="cover_blind";const h=o.control_status_sensor;if(h){const e=t.states[h]?.attributes;e?.cover_type&&(p=e.cover_type)}return{entry_id:s,entry_title:c,cover_type:p,entities:o,managed_covers:l}}(this.hass,this._config,this._registry);if(!t)return this._renderEmpty("no matching entities after unique_id lookup");const e=(i=this._config,{...wt,...i?.controls});var i;const s=this._sections;return V`
      <ha-card>
        ${this._renderHeader(t,e)}
        <div class="body ${this._config.compact?"compact":""}">
          ${s.includes("sky")?V`<acp-sky-compass .hass=${this.hass} .discovered=${t} ?compact=${!!this._config.compact} .showStats=${this._config.show_compass_stats??!0}></acp-sky-compass>`:Z}
          ${s.includes("elevation")?V`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`:Z}
          ${s.includes("decision")?V`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers||!!this._config.compact}
              ></acp-decision-strip>`:Z}
          ${s.includes("covers")?V`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`:Z}
          ${s.includes("overrides")?V`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
                .resetEnabled=${e.reset_manual_override}
              ></acp-overrides-panel>`:Z}
          ${s.includes("climate")?V`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${t}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`:Z}
        </div>
        ${this._config.show_version?V`<div class="footer dim">adaptive-cover-pro-card v${ft}</div>`:Z}
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
  `,t([gt({attribute:!1})],Xt.prototype,"hass",void 0),t([vt()],Xt.prototype,"_config",void 0),t([vt()],Xt.prototype,"_registry",void 0),t([vt()],Xt.prototype,"_registryError",void 0),Xt=t([pt(mt)],Xt),window.customCards=window.customCards||[],window.customCards.push({type:mt,name:"Adaptive Cover Pro",description:"Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.",preview:!0,documentationURL:"https://github.com/jrhubott/adaptive-cover-pro-card"}),console.info(`%c adaptive-cover-pro-card %c v${ft} `,"color: white; background: #3f51b5; font-weight: 700;","color: #3f51b5; background: white; font-weight: 700;");export{Xt as AdaptiveCoverProCard};
