'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {createSong,Song,SongInput} from '../services/songGenerator';
import {getPalette} from '../services/albumGenerator';
import {toPng} from 'html-to-image';
import './globals.css';

const moods=['想逃跑','有点空','很平静','莫名开心','心里很吵','想念某个人','想重新开始','不知道，就是怪怪的'];
const scenes=['凌晨','黄昏','下雨天','地铁','便利店','出租屋','海边','陌生城市'];

function today(){return new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}
function AlbumArt({song,large=false}:{song:Song;large?:boolean}){const p=getPalette(song.template); return <div className={`album-art ${large?'large':''} kind-${p.kind}`} style={{background:p.bg,color:p.fg,'--accent':p.accent} as React.CSSProperties}><div className="art-grid"/><div className="art-no">{song.code} · TRACK 01</div><div className="art-main"><span className="art-kicker">UNRELEASED TODAY</span><strong>{song.title}</strong><em>{song.album}</em></div><div className="art-foot"><span>{song.date}</span><span>STEREO / SIDE A</span></div></div>}

export default function Home(){
 const [page,setPage]=useState<'home'|'form'|'result'>('home');
 const [mood,setMood]=useState(''); const [scene,setScene]=useState(''); const [note,setNote]=useState('');
 const [song,setSong]=useState<Song|null>(null); const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const [replay,setReplay]=useState(0);
 const cardRef=useRef<HTMLDivElement>(null);
 const input={mood,scene,note};
 const generate=(offset=0)=>{if(!mood||!scene){setError('先选一个今天的情绪和场景。');return} setError('');setLoading(true);window.setTimeout(()=>{setSong(createSong(input,offset));setLoading(false);setPage('result')},650)};
 const reset=()=>{setPage('form');setSong(null);setError('')};
 const save=async()=>{if(!cardRef.current||!song)return; try{const data=await toPng(cardRef.current,{pixelRatio:3,cacheBust:true,backgroundColor:getPalette(song.template).bg});const a=document.createElement('a');a.download=`${song.code}-today-record.png`;a.href=data;a.click()}catch{setError('保存失败，请稍后再试。')}};
 if(page==='home') return <main className="shell home"><div className="home-top"><span className="mark">UT / 01</span><span className="date">{today()}</span></div><section className="hero"><p className="eyebrow">PRIVATE RECORDS · 2026</p><h1>今日<br/><i>未发行</i></h1><p className="english">UNRELEASED<br/>TODAY</p><p className="intro">There is a song for today.<br/>It just hasn&apos;t been written yet.</p><button className="primary hero-btn" onClick={()=>setPage('form')}>生成今天的歌 <span>↗</span></button></section><div className="home-bottom"><span>每一天，都有一首从未发行过的歌。</span><span>EST. 2026</span></div></main>;
 if(page==='form') return <main className="shell form-page"><header className="page-head"><button className="back" onClick={()=>setPage('home')}>←</button><span>描述今天</span><span className="step">01 / 01</span></header><section className="form-content"><p className="eyebrow">A SMALL RECORDING OF TODAY</p><h2>今天更接近<br/><i>哪一种？</i></h2><div className="chips">{moods.map(x=><button key={x} className={mood===x?'chip selected':'chip'} onClick={()=>setMood(x)}>{x}</button>)}</div><h3>今天发生在哪？</h3><div className="chips scenes">{scenes.map(x=><button key={x} className={scene===x?'chip selected':'chip'} onClick={()=>setScene(x)}>{x}</button>)}</div><label className="note-label" htmlFor="note">如果愿意，留一句今天发生的事。<span>可选 · {note.length}/100</span></label><textarea id="note" maxLength={100} value={note} onChange={e=>setNote(e.target.value)} placeholder="下班回家的时候，突然特别想吃小时候的冰棍。"/>{error&&<p className="error">{error}</p>}<button className="primary generate" disabled={loading} onClick={()=>generate()}>{loading?<><span className="spinner"/>正在翻找今天的唱片……</>:`给今天配一首歌 ${'↗'}`}</button></section></main>;
 return <main className="shell result-page" style={{'--result-bg':getPalette(song!.template).bg,'--result-fg':getPalette(song!.template).fg} as React.CSSProperties}><header className="page-head result-head"><button className="back" onClick={reset}>←</button><span>今日唱片</span><span className="step">{song!.code}</span></header><section className="result-wrap"><div ref={cardRef} className="share-card"><AlbumArt song={song!} large/><div className="share-info"><span className="share-label">A SONG FOR {song!.date}</span><h2>{song!.title}</h2><p className="lyric">“{song!.lyric}”</p><div className="share-meta"><span>{song!.genre}</span><span>{song!.duration}</span><span>{song!.album}</span></div><div className="share-bottom"><span>{song!.code}</span><span>全球仅发行 1 份。</span></div></div></div><p className="result-note">这首歌只在今天存在过。</p><div className="result-actions"><button className="primary" onClick={save}>保存今日唱片 <span>↓</span></button><button className="secondary" onClick={()=>{setReplay(x=>x+1);generate(replay+1)}}>再听一首 <span>↗</span></button><button className="text-btn" onClick={reset}>重新选择</button></div>{error&&<p className="error">{error}</p>}</section></main>
}
