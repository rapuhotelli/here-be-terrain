function getLayerStorageKey(campaign: string, encounter: string) {
  return `encounter_layers.${campaign}.${encounter}`;
}

function getDataStorageKey(campaign: string, encounter: string, layerId: string) {
  return `encounter_layerData.${campaign}.${encounter}.${layerId}`;
}

export function getLayers(campaign: string, encounter: string) {
  const key = getLayerStorageKey(campaign, encounter);
  return JSON.parse(localStorage.getItem(key) || '{}');
}

export function addLayer(campaign: string, encounter: string, layerId: string) {
  const key = getLayerStorageKey(campaign, encounter);
  const layers = getLayers(campaign, encounter);
  layers[layerId] = true;
  return localStorage.setItem(key, JSON.stringify(layers));
}

export function hasLayer(campaign: string, encounter: string, layerId: string) {
  const layers = getLayers(campaign, encounter);
  return layers[layerId];
}

export function removeLayer(campaign: string, encounter: string, layerId: string) {
  const key = getLayerStorageKey(campaign, encounter);
  const layers = getLayers(campaign, encounter);
  delete layers[layerId];
  return localStorage.setItem(key, JSON.stringify(layers));
}

export function saveLayerData(campaign: string, encounter: string, layerId: string, layerData: string) {
  const key = getDataStorageKey(campaign, encounter, layerId);
  localStorage.setItem(key, layerData);
}

export function getLayerData(campaign: string, encounter: string, layerId: string) {
  const key = getDataStorageKey(campaign, encounter, layerId);
  return localStorage.getItem(key);
}

export function hasLayerData(campaign: string, encounter: string, layerId: string) {
  return !!getLayerData(campaign, encounter, layerId);
}