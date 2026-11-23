"use client";
import {BottomSheet} from "@/components/ui/BottomSheet";

export function RatingBottomSheet({open,onClose,reviews=[]}:{open:boolean;onClose:()=>void;reviews?:any[]}){
	const average=reviews.length?reviews.reduce((sum,review)=>sum+Number(review.rating),0)/reviews.length:0;
	return <BottomSheet open={open} onClose={onClose} title="Valutazioni autista"><div className="mb-3 flex items-center gap-2"><span className="text-2xl font-extrabold">{reviews.length?`★ ${average.toFixed(1)}`:"Nuovo"}</span><span className="text-xs text-muted">({reviews.length} recensioni)</span></div>{reviews.length?<div className="space-y-2">{reviews.map((review:any)=><div key={review.id} className="rounded-xl bg-subtle p-3"><p className="text-xs font-bold">{review.tags?.length?review.tags.join(" · "):"Valutazione del viaggio"}</p>{review.comment&&<p className="mt-1 text-[11px] text-muted">{review.comment}</p>}<p className="mt-2 text-[10px] text-muted">{review.profiles?.full_name||"Pendolare"}</p></div>)}</div>:<p className="rounded-xl bg-subtle p-3 text-xs text-muted">Nessuna recensione ancora.</p>}</BottomSheet>;
}
