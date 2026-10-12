'use client';
import {useState} from 'react';
import Link from 'next/link';
import {readBasket,writeBasket} from '@/lib/basket';
export default function AddToQuote({slug}:{slug:string}){const [added,setAdded]=useState(false);const[error,setError]=useState('');return <div><button className="button amber" onClick={()=>{try{const items=readBasket();if(!items.some(i=>i.slug===slug))items.push({slug,quantity:1});writeBasket(items);setAdded(true);setError('');}catch{setError('Your browser could not save this selection. Open the RFQ builder to add it there.');}}}>{added?'ADDED TO RFQ ✓':'ADD REQUIREMENT TO RFQ + '}</button>{added&&<Link className="inline-link" href="/request-quote">VIEW YOUR RFQ →</Link>}<p role="status">{error}</p></div>}
