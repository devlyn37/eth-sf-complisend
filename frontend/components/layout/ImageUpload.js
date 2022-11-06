import { useState, useEffect } from 'react'
const WEB3_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUwNzY0ZkMzMkM5ZTQwQjIyMkQwNjE1NzBkMTJkODlENzMxMDcyNkQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc3MTMzMDQwMzksIm5hbWUiOiJldGhnbG9iYWwifQ.aeOrkh_4IAx4SwMjWDotoZYlWwB-HcODQqSLBRp3X0A'
import {PhotoIcon} from '@heroicons/react/24/solid'
import { Web3Storage } from 'web3.storage'
import cn from 'classnames'
import { LoaderBar,ProgressBar } from '../LoaderBar'


const client = new Web3Storage({ token: WEB3_TOKEN })


export const ImageUpload = ({onSet}) => {
	const [id, setId] = useState(null);
	const [ipfs, setIpfs] = useState(null);
	const [version, setVersion] = useState(null);
	const [isOnline, setIsOnline] = useState(false);
	const [img_loading,setImageLoading] = useState(false);
	const [total_size,setTotalSize] = useState(0);
	const [loaded_size,setLoadedSize] = useState(0);

	function getFiles () {
		const fileInput = document.querySelector('input[type="file"]')
		return fileInput.files
	}
	
	let [ipfsHash, setIpfsHash] = useState(null);
	let [img_url, setUrl] = useState(null);
	
	let uploaded_size = 0
	async function onStoredChunk(size){
		console.log("onStoredChunk",size)
		uploaded_size += size
		setLoadedSize(uploaded_size/total_size)
	}

	async function captureFile(event){
		event.preventDefault()
		const file = event.target.files[0]
		const reader = new window.FileReader()
		console.log('file', file)
		setTotalSize(file.size)
		setImageLoading(true)
		const cid = await client.put([file], { maxRetries: 1, onStoredChunk })
		let url = `https://ipfs.io/ipfs/${cid}/`+file.name
		onSet(cid)
		setImageLoading(false)
		setUrl(url)
		onSet({
			ipfs:url
		})
	}
	
	let [is_focus, setFocus] = useState(false)

	return (
		<div
		className={cn({
			'flex flex-col bg-slate-700 p-4 text-lg w-full rounded-lg outline-4 outline-blue-500':
			true,
			outline: is_focus,
		})}
		>
		<PhotoIcon className={cn({ 'w-10 text-white': true })}></PhotoIcon>
		{img_url && <img className='w-10 h-auto' src={img_url} alt=""/>}
		
		<input
			className="bg-transparent p-4 text-xl font-bold text-cyan-500 w-full rounded-lg outline-none"
			onChange={captureFile}
			autoComplete="on"
			type='file'
			name="wallet_address"
			onFocus={setFocus.bind(null, true)}
			onBlur={setFocus.bind(null, false)}
			placeholder="upload image"
		></input>
		
		<ProgressBar progress={(loaded_size)||0} loading={true} ></ProgressBar>
		{img_url && <div className='text-bold text-blue-500'>{img_url}</div>}
		</div>
		
	)


}

