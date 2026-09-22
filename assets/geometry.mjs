export function screenToScene(point, camera) {
  return {x:(point.x-camera.x)/camera.scale,y:(point.y-camera.y)/camera.scale};
}
export function thumbnailTransform(crop, frame) {
  const scale=Math.min(frame.width/crop.width,frame.height/crop.height);
  return {scale,x:frame.width/2-(crop.x+crop.width/2)*scale,y:frame.height/2-(crop.y+crop.height/2)*scale};
}
export function canvasBackingSize(cssSize,pixelRatio) {
  const ratio=Math.min(3,Math.max(1,Number.isFinite(pixelRatio)?pixelRatio:1));
  return {css:cssSize,pixels:Math.round(cssSize*ratio),ratio};
}
export function targetCanvasBackingSize(constrainedLandscape,pixelRatio) {
  return canvasBackingSize(constrainedLandscape?48:54,pixelRatio);
}
export function framedCrop(bounds,scene) {
  const desired=Math.max(96,Math.ceil(Math.max(bounds.width,bounds.height)*1.5));
  const size=Math.min(desired,scene.width,scene.height);
  const centreX=bounds.x+bounds.width/2,centreY=bounds.y+bounds.height/2;
  const x=Math.max(0,Math.min(scene.width-size,Math.round(centreX-size/2)));
  const y=Math.max(0,Math.min(scene.height-size,Math.round(centreY-size/2)));
  return {x,y,width:size,height:size};
}
function edgeDistance(p,a,b) {
  const dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy;
  const t=den?Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.y-a[1])*dy)/den)):0;
  return Math.hypot(p.x-a[0]-t*dx,p.y-a[1]-t*dy);
}
function polygonDistance(p,poly) {
  let inside=false,distance=Infinity;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    if((a[1]>p.y)!==(b[1]>p.y)&&p.x<(b[0]-a[0])*(p.y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
    distance=Math.min(distance,edgeDistance(p,a,b));
  }
  return inside?0:distance;
}
export function hitTest(point,targets,scale,tolerancePx=10) {
  let best=null,min=Infinity,smallestArea=Infinity;
  for(const target of targets){
    const distance=polygonDistance(point,target.hitPolygon);
    const polygon=target.hitPolygon;
    const area=Math.abs(polygon.reduce((sum,a,i)=>{const b=polygon[(i+1)%polygon.length];return sum+a[0]*b[1]-b[0]*a[1];},0))/2;
    if(distance<=tolerancePx/scale && (distance<min||(distance===min&&area<smallestArea))){best=target.id;min=distance;smallestArea=area;}
  }
  return best;
}
export function markerBounds(bounds,scale) {
  const pad=4/scale;
  return {x:bounds.x-pad,y:bounds.y-pad,width:bounds.width+pad*2,height:bounds.height+pad*2};
}
export function isValidTap(tap,type,now) {
  return !!tap && type==='pointerup' && !tap.moved && !tap.multi && now-tap.start<700;
}
export function moveSearchCursor(point,key,viewport){
  return {x:Math.max(0,Math.min(viewport.width-1,point.x+(key==='ArrowRight'?24:key==='ArrowLeft'?-24:0))),y:Math.max(0,Math.min(viewport.height-1,point.y+(key==='ArrowDown'?24:key==='ArrowUp'?-24:0)))};
}
