function parseQuerystring(){var nvpair={};var qs=window.location.search.replace('?','');var pairs=qs.split('&');for(var i=0;i<pairs.length;i++){var p=pairs[i].split('=');nvpair[p[0]]=p[1]}
return nvpair}
function getScriptPath(scriptname){var scriptTags=document.getElementsByTagName('script');for(var i=0;i<scriptTags.length;i++){if(scriptTags[i].src.match(scriptname)){script_path=scriptTags[i].src;return script_path.split('?')[0].split('/').slice(0,-1).join('/')}}
return ''}
function url_join(url,concat){function build(parts,container){for(var i=0,l=parts.length;i<l;i ++){if(parts[i]=='..'){container.pop()}else if(parts[i]=='.'){continue}else{container.push(parts[i])}}}
var url_parts=[];build(url.split('/'),url_parts);build(concat.split('/'),url_parts);return url_parts.join('/')}
var storymap=null;var storymap_url='https://senatehouselibrary.github.io/refbetamap/published.json';var params=parseQuerystring();var options={script_path:getScriptPath(/storymap(-min)?\.js/),start_at_slide:0};if(params.hasOwnProperty('start_at_slide')){options.start_at_slide=parseInt(params.start_at_slide)}
function storymap_onload(d){trace('embed: storymap data loaded');if(d&&d.storymap){var font="stock:default";if(d.font_css){font=d.font_css}
if(font.indexOf("stock:")==0){var font_name=font.split(':')[1];var base_url=url_join(options.script_path,"assets/fonts");font=url_join(base_url,"font."+font_name+".css")}else if(!font.match('^(http|https|//)')){font=url_join(options.script_path,font)}
VCO.Load.css(font,function(){trace('font loaded: '+font)});storymap=new VCO.StoryMap('storymap-embed',d,options)}}
function storymap_getjson(){if('withCredentials' in new XMLHttpRequest()){trace('embed: loading data via XMLHttpRequest');VCO.getJSON(storymap_url,storymap_onload)}else if(typeof XDomainRequest!=="undefined"){trace('embed: loading data via XDomainRequest');var xdr=new XDomainRequest();xdr.onload=function(){storymap_onload(JSON.parse(xdr.responseText))};xdr.onerror=function(){trace('embed: error loading data via XDomainRequest')};xdr.onprogress=function(){};xdr.open("get",storymap_url);xdr.send()}}
window.onload=function(){if(storymap_url.match('\\.js$')){trace('embed: loading data via script injection');var loaded=!1;var script=document.createElement("script");script.type="text/javascript";script.src=storymap_url;script.onload=script.onreadystatechange=function(){if(!loaded&&(!(d=this.readyState)||d=="loaded"||d=="complete")){loaded=!0;storymap_onload(storymap_json)}}
var insertionPoint=document.head||document.getElementsByTagName('head').item(0)||document.documentElement.childNodes[0];insertionPoint.appendChild(script)}else{storymap_getjson()}}
window.onresize=function(event){if(storymap){storymap.updateDisplay()}}
