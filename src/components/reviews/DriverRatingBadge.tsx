"use client";
import {useState} from "react";
import {RatingBottomSheet} from "./RatingBottomSheet";
export function DriverRatingBadge(){const [open,setOpen]=useState(false);return <><button onClick={()=>setOpen(true)} className="text-[10px] font-bold text-accentWarm">★ 4.9 (12)</button><RatingBottomSheet open={open} onClose={()=>setOpen(false)}/></>}
