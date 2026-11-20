export async function shareOrDownload(blob:Blob,filename:string,title:string,text?:string){
 const file=new File([blob],filename,{type:blob.type})
 if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){try{await navigator.share({title,text,files:[file]});return}catch(e){if((e as Error).name==='AbortError')return}}
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
