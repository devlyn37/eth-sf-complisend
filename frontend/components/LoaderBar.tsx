
import * as React from "react";
import cn from 'classnames'
import {useState} from 'react'

export function ProgressBar({loading,progress=0}:any){
   
    let loader_bar_cn = cn({
        'w-full rounded-md h-3 bg-black/20 overflow-hidden':true,
    })

    let progress_dot_cn = cn({
        'w-full':true,
        'rounded-md h-3 transition-transform':true,
        'bg-black/0':!loading,
        'bg-white':loading,
    })

    return <div className="flex items-center justify-center">
        <div className={loader_bar_cn}>
            <div className={progress_dot_cn} style={{transform:`translatex(${-100+100*progress}%)`}}></div>
        </div>
    </div>
}


export function LoaderBar({loading}:any){
   
    let loader_bar_cn = cn({
        'rounded-md h-3 bg-black/20 search-loader-bar overflow-hidden':true,
        'w-6': !loading,
        'w-12':loading,
    })

    let loader_dot_cn = cn({
        'rounded-md h-3 transition-transform':true,
        'w-3 bg-black/0':!loading,
        'w-4 bg-white search-loader-dot-active':loading,
    })

    
    return <div className="flex items-center justify-center">
        <div className={loader_bar_cn}>
            <div className={loader_dot_cn}></div>
        </div>
    </div>
}