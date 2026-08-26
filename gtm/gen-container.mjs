// Gera o export de container GTM (formato exportFormatVersion 2) para a Sólida.
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const ACCOUNT = "0";
const CONTAINER = "0";

let tagSeq = 0, trgSeq = 0, varSeq = 0;
const tags = [], triggers = [], variables = [];
const trgId = {};
const T = (k, v) => ({ type: "TEMPLATE", key: k, value: v });
const B = (k, v) => ({ type: "BOOLEAN", key: k, value: String(v) });

function variable(name, type, parameter) {
  variables.push({ accountId: ACCOUNT, containerId: CONTAINER, variableId: String(++varSeq), name, type, parameter });
}
function constant(name, value) { variable(name, "c", [T("value", value)]); }
function dlv(key) {
  variable(`DLV - ${key}`, "v", [B("setDefaultValue", false), T("name", key), T("dataLayerVersion", "2")]);
}
function trigger(name, type, extra = {}) {
  const id = String(++trgSeq);
  trgId[name] = id;
  triggers.push({ accountId: ACCOUNT, containerId: CONTAINER, triggerId: id, name, type, ...extra });
  return id;
}
function ceTrigger(event) {
  return trigger(`CE - ${event}`, "CUSTOM_EVENT", {
    customEventFilter: [{ type: "EQUALS", parameter: [T("arg0", "{{_event}}"), T("arg1", event)] }],
  });
}
function tag(name, type, parameter, firing, extra = {}) {
  tags.push({
    accountId: ACCOUNT, containerId: CONTAINER, tagId: String(++tagSeq), name, type, parameter,
    firingTriggerId: firing.map((n) => trgId[n]),
    tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: { type: "MAP" },
    consentSettings: { consentStatus: "NOT_SET" },
    ...extra,
  });
}
const eventTable = (pairs) => ({
  type: "LIST", key: "eventSettingsTable",
  list: pairs.map(([p, v]) => ({ type: "MAP", map: [T("parameter", p), T("parameterValue", v)] })),
});
function ga4Event(eventName, triggerName, pairs, tagName) {
  tag(tagName ?? `GA4 - ${eventName}`, "gaawe", [
    B("sendEcommerceData", false),
    T("eventName", eventName),
    eventTable(pairs),
    T("measurementIdOverride", "{{CONST - GA4 Measurement ID}}"),
  ], [triggerName]);
}
function adsConversion(name, labelVar, triggerName) {
  tag(name, "awct", [
    B("enableConversionLinker", true),
    B("enableProductReporting", false),
    B("enableNewCustomerReporting", false),
    B("enableEnhancedConversion", false),
    T("conversionCookiePrefix", "_gcl"),
    T("conversionId", "{{CONST - Google Ads Conversion ID}}"),
    T("conversionLabel", `{{${labelVar}}}`),
  ], [triggerName]);
}

// ---------- Variáveis ----------
constant("CONST - GA4 Measurement ID", "G-TQHKY7G5TL");
constant("CONST - Google Ads Conversion ID", "17712344467");
constant("CONST - Ads Label - whatsapp_click", "Oz1PCK7MqugcEJPb8_1B");
constant("CONST - Ads Label - phone_click", "S1OrCLHSqugcEJPb8_1B");
constant("CONST - Ads Label - whatsapp_central_open", "v3B3CKyEtOgcEJPb8_1B");
[
  "source", "subject", "option", "page", "page_path", "page_location", "page_title",
  "consent_choice", "phone", "label", "email", "network", "unit",
  "post_slug", "post_title", "post_category", "loaded_count",
].forEach(dlv);

// ---------- Gatilhos ----------
trigger("Initialization - All Pages", "INIT");
trigger("All Pages", "PAGEVIEW");
const CUSTOM_EVENTS = [
  "page_view", "cookie_consent", "whatsapp_central_open", "whatsapp_click", "phone_click",
  "email_click", "social_click", "maps_click", "blog_post_view", "blog_filter", "blog_load_more",
];
CUSTOM_EVENTS.forEach(ceTrigger);
trigger("Scroll - 25/50/75/90", "SCROLL_DEPTH", {
  parameter: [
    B("verticalThresholdOn", true), T("verticalThresholdUnits", "PERCENT"),
    T("verticalThresholdsPercent", "25,50,75,90"), B("horizontalThresholdOn", false),
    T("triggerStartOption", "WINDOW_LOAD"),
  ],
});
const linkClickBase = {
  waitForTags: { type: "BOOLEAN", value: "false" },
  checkValidation: { type: "BOOLEAN", value: "true" },
  waitForTagsTimeout: { type: "TEMPLATE", value: "2000" },
  uniqueTriggerId: { type: "TEMPLATE" },
  autoEventFilter: [{ type: "MATCH_REGEX", parameter: [T("arg0", "{{Page URL}}"), T("arg1", ".*")] }],
};
trigger("Click - Outbound link", "LINK_CLICK", {
  ...linkClickBase,
  filter: [
    { type: "STARTS_WITH", parameter: [T("arg0", "{{Click URL}}"), T("arg1", "http")] },
    { type: "CONTAINS", parameter: [T("arg0", "{{Click URL}}"), T("arg1", "solidatransporte.com.br")], negate: true },
    { type: "CONTAINS", parameter: [T("arg0", "{{Click URL}}"), T("arg1", "wa.me")], negate: true },
    { type: "CONTAINS", parameter: [T("arg0", "{{Click URL}}"), T("arg1", "google.com/maps")], negate: true },
  ],
});
trigger("Click - File download", "LINK_CLICK", {
  ...linkClickBase,
  filter: [{ type: "MATCH_REGEX", parameter: [T("arg0", "{{Click URL}}"), T("arg1", "\\.(pdf|docx?|xlsx?|pptx?|zip|csv|xml)(\\?.*)?$")] }],
});

// ---------- Tags: GA4 ----------
tag("Google Tag - GA4", "googtag", [
  T("tagId", "{{CONST - GA4 Measurement ID}}"),
  { type: "LIST", key: "configSettingsTable", list: [
    { type: "MAP", map: [T("parameter", "send_page_view"), T("parameterValue", "false")] },
  ]},
], ["Initialization - All Pages"]);

ga4Event("page_view", "CE - page_view", [
  ["page_location", "{{DLV - page_location}}"], ["page_path", "{{DLV - page_path}}"], ["page_title", "{{DLV - page_title}}"],
]);
ga4Event("cookie_consent", "CE - cookie_consent", [["consent_choice", "{{DLV - consent_choice}}"]]);
ga4Event("whatsapp_central_open", "CE - whatsapp_central_open", [["source", "{{DLV - source}}"], ["page", "{{DLV - page}}"]]);
ga4Event("whatsapp_click", "CE - whatsapp_click", [
  ["subject", "{{DLV - subject}}"], ["option", "{{DLV - option}}"], ["source", "{{DLV - source}}"], ["page", "{{DLV - page}}"],
]);
ga4Event("phone_click", "CE - phone_click", [
  ["phone", "{{DLV - phone}}"], ["label", "{{DLV - label}}"], ["source", "{{DLV - source}}"], ["page", "{{DLV - page}}"],
]);
ga4Event("email_click", "CE - email_click", [["email", "{{DLV - email}}"], ["source", "{{DLV - source}}"], ["page", "{{DLV - page}}"]]);
ga4Event("social_click", "CE - social_click", [["network", "{{DLV - network}}"], ["source", "{{DLV - source}}"], ["page", "{{DLV - page}}"]]);
ga4Event("maps_click", "CE - maps_click", [["unit", "{{DLV - unit}}"], ["page", "{{DLV - page}}"]]);
ga4Event("blog_post_view", "CE - blog_post_view", [
  ["post_slug", "{{DLV - post_slug}}"], ["post_title", "{{DLV - post_title}}"], ["post_category", "{{DLV - post_category}}"],
]);
ga4Event("blog_filter", "CE - blog_filter", [["post_category", "{{DLV - post_category}}"]]);
ga4Event("blog_load_more", "CE - blog_load_more", [["post_category", "{{DLV - post_category}}"], ["loaded_count", "{{DLV - loaded_count}}"]]);
ga4Event("scroll_depth", "Scroll - 25/50/75/90", [["percent_scrolled", "{{Scroll Depth Threshold}}"], ["page_path", "{{Page Path}}"]]);
ga4Event("click_outbound", "Click - Outbound link", [["link_url", "{{Click URL}}"], ["link_text", "{{Click Text}}"], ["page_path", "{{Page Path}}"]]);
ga4Event("file_download", "Click - File download", [["file_url", "{{Click URL}}"], ["link_text", "{{Click Text}}"], ["page_path", "{{Page Path}}"]]);

// ---------- Tags: Google Ads ----------
tag("Ads - Conversion Linker", "gclidw", [
  B("enableCrossDomain", false), B("enableUrlPassthrough", false), B("enableCookieOverrides", false),
], ["Initialization - All Pages"]);
tag("Ads - Remarketing", "sp", [
  B("enableConversionLinker", true), B("enableDynamicRemarketing", false),
  T("conversionId", "{{CONST - Google Ads Conversion ID}}"), T("customParamsFormat", "NONE"),
], ["CE - page_view"]);
adsConversion("Ads - Conversão - WhatsApp Click (principal)", "CONST - Ads Label - whatsapp_click", "CE - whatsapp_click");
adsConversion("Ads - Conversão - Phone Click", "CONST - Ads Label - phone_click", "CE - phone_click");
adsConversion("Ads - Conversão - WhatsApp Central Open (secundária)", "CONST - Ads Label - whatsapp_central_open", "CE - whatsapp_central_open");

const out = {
  exportFormatVersion: 2,
  exportTime: "2026-08-26 00:00:00",
  containerVersion: {
    path: `accounts/${ACCOUNT}/containers/${CONTAINER}/versions/0`,
    accountId: ACCOUNT,
    containerId: CONTAINER,
    containerVersionId: "0",
    name: "Sólida Transporte — GA4 + Google Ads",
    description: "Container gerado para www.solidatransporte.com.br. Preencher as variáveis CONST - * após importar.",
    container: {
      accountId: ACCOUNT, containerId: CONTAINER, name: "www.solidatransporte.com.br",
      publicId: "GTM-MKR53GH3", usageContext: ["WEB"],
    },
    tag: tags,
    trigger: triggers,
    variable: variables,
    builtInVariable: [
      { accountId: ACCOUNT, containerId: CONTAINER, type: "PAGE_URL", name: "Page URL" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "PAGE_HOSTNAME", name: "Page Hostname" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "PAGE_PATH", name: "Page Path" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "REFERRER", name: "Referrer" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "EVENT", name: "Event" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "CLICK_URL", name: "Click URL" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "CLICK_TEXT", name: "Click Text" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "CLICK_CLASSES", name: "Click Classes" },
      { accountId: ACCOUNT, containerId: CONTAINER, type: "SCROLL_DEPTH_THRESHOLD", name: "Scroll Depth Threshold" },
    ],
  },
};
writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(`tags=${tags.length} triggers=${triggers.length} variables=${variables.length} -> ${OUT}`);
