export function calculateCoverScale(
  viewportWidth,
  viewportHeight,
  sceneWidth,
  sceneHeight,
) {
  return Math.max(viewportWidth / sceneWidth, viewportHeight / sceneHeight);
}

export function clampTransform(transform, viewport, scene) {
  const scaledWidth = scene.width * transform.scale;
  const scaledHeight = scene.height * transform.scale;
  const minX = Math.min(0, viewport.width - scaledWidth);
  const minY = Math.min(0, viewport.height - scaledHeight);

  return {
    x: scaledWidth < viewport.width ? (viewport.width-scaledWidth)/2 : Math.min(0, Math.max(minX, transform.x)),
    y: scaledHeight < viewport.height ? (viewport.height-scaledHeight)/2 : Math.min(0, Math.max(minY, transform.y)),
    scale: transform.scale,
  };
}

export function fitCamera(viewport,scene,mode='play',pixelRatio=1) {
  const overview=Math.min(viewport.width/scene.width,viewport.height/scene.height);
  const desired=mode==='overview'?overview:Math.max(overview,Math.min(viewport.width/scene.width*2.4,viewport.height/scene.height));
  const limits=sceneScaleLimits(viewport,scene,pixelRatio);
  const scale=Math.max(limits.min,Math.min(limits.max,desired));
  return clampTransform({x:(viewport.width-scene.width*scale)/2,y:(viewport.height-scene.height*scale)/2,scale},viewport,scene);
}
export function sceneScaleLimits(viewport,scene,pixelRatio=1) {
  const fit=Math.min(viewport.width/scene.width,viewport.height/scene.height);
  const ratio=Number.isFinite(pixelRatio)&&pixelRatio>0?pixelRatio:1;
  const max=1/ratio;
  return {min:Math.min(fit,max),max};
}
export function fitRegionScale(viewport,region,limits,padding=.85) {
  const desired=Math.min(viewport.width/region.width,viewport.height/region.height)*padding;
  return Math.max(limits.min,Math.min(limits.max,desired));
}
export function resizeCamera(camera,oldViewport,newViewport,scene,pixelRatio=1) {
  const point={x:(oldViewport.width/2-camera.x)/camera.scale,y:(oldViewport.height/2-camera.y)/camera.scale};
  const oldBase=Math.min(oldViewport.width/scene.width,oldViewport.height/scene.height);
  const newBase=Math.min(newViewport.width/scene.width,newViewport.height/scene.height);
  const desired=camera.scale*newBase/oldBase;
  const limits=sceneScaleLimits(newViewport,scene,pixelRatio);
  const scale=Math.max(limits.min,Math.min(limits.max,desired));
  return clampTransform({x:newViewport.width/2-point.x*scale,y:newViewport.height/2-point.y*scale,scale},newViewport,scene);
}

export function zoomAroundPoint(transform, nextScale, point) {
  const ratio = nextScale / transform.scale;
  return {
    x: point.x - (point.x - transform.x) * ratio,
    y: point.y - (point.y - transform.y) * ratio,
    scale: nextScale,
  };
}

export function districtSwipeDirection(start, end, atFitScale) {
  if (!atFitScale || !start || !end) return 0;
  const horizontal = end.x - start.x;
  const vertical = end.y - start.y;
  if (Math.abs(horizontal) < 72 || Math.abs(vertical) > 36) return 0;
  return horizontal < 0 ? 1 : -1;
}
