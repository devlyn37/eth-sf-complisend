import { useState } from 'react'
import { OverlayDialog } from './OverlayDialog'
import { WalletIcon,CurrencyDollarIcon,PencilSquareIcon, AtSymbolIcon} from '@heroicons/react/24/solid'
import cn from 'classnames'
import {ShieldExclamationIcon,CheckCircleIcon} from '@heroicons/react/24/solid'

export const SetTokenForm = ({ state, onSet }: any): any => {
  const [open_form, setFormOpen] = useState(false)

  const onSetAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const x = Number.parseFloat(event.target.value)

    onSet({
      amount: Number.isNaN(x) ? 0 : x,
    })
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    setFormOpen(false)
  }

  let [is_focus, setFocus] = useState(false)

  return (
    <>
      <div
        className={cn({
          'flex flex-row bg-green-400 text-black p-4 text-lg w-full rounded-lg outline-4 outline-green-800':
            true,
          outline: is_focus,
        })}
      >
        <CurrencyDollarIcon className={cn({ 'w-10 text-green-700': true })}></CurrencyDollarIcon>
        <input
          className="bg-transparent p-4 text-xl font-bold text-black w-full rounded-lg outline-none"
          onChange={onSetAmountChange}
          autoComplete="on"
          name="wallet_address"
          onFocus={setFocus.bind(null, true)}
          onBlur={setFocus.bind(null, false)}
          placeholder="wallet address"
          value={state.amount}
        ></input>
      </div>
      {/* <OverlayDialog
        show={open_form}
        onSubmit={onSubmit}
        onClose={setFormOpen.bind(null, false)}
      > */}
      {/* <div className="p-2">set amount</div> */}
      
      {/* </OverlayDialog> */}
      {/* <div
        className="rounded-md p-4 bg-slate-700 cursor-pointer"
        onClick={setFormOpen.bind(null, true)}
      >
        {!state.amount ? 'set amount' : state.amount}
      </div> */}
    </>
  )
}

export const SetNotesForm = ({ state = {}, onSet }: any): any => {
  const [open_form, setFormOpen] = useState(false)
  console.log(state)
  const onSetNotesChange = (e: any) => {
    onSet({ notes: e.target.value })
  }

  let [is_focus, setFocus] = useState(false)

  return (
    <>
     <div
        className={cn({
          'flex flex-row bg-green-400 text-black p-4 text-lg w-full rounded-lg outline-4 outline-green-800':
            true,
          outline: is_focus,
        })}
      >
        <PencilSquareIcon className={cn({ 'w-10 text-green-700': true })}></PencilSquareIcon>
        <input
          className="bg-transparent p-4 text-xl font-bold text-black w-full rounded-lg outline-none placeholder-green-700"
          onChange={onSetNotesChange}
          autoComplete="on"
          name="wallet_address"
          onFocus={setFocus.bind(null, true)}
          onBlur={setFocus.bind(null, false)}
          placeholder="notes"
          value={state.notes}
        ></input>
      </div>
    
      {/* <div
        onClick={setFormOpen.bind(null, true)}
        className="rounded-md p-4 bg-slate-800 cursor-pointer"
      >
        {!state.notes ? 'set notes' : state.notes}
      </div> */}
    </>
  )
}

{
  /* let [addr,setAddr] = useState('')
  
let onAddrChange = function(e:any){
  setAddr(e.target.value)
} */
}

export const SetRecieverForm = ({ state = {}, onSet,ownsNFT }: any): any => {
  const [open_form, setFormOpen] = useState(false)
  const [addr, setAddr] = useState('')
  const onSetAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSet({
      address: event.target.value,
    })
    setAddr(event.target.value)
  }
  // console.log(state.address)

  const onSubmit = (e: any) => {
    e.preventDefault()
    // console.log('submit')

    setFormOpen(false)
  }

  let [is_focus, setFocus] = useState(false)

  let nft_owner_indicator = <div>
    {ownsNFT == false && <div className='rounded-md bg-red-500 text-white self-center w-fit mr-3 p-1 px-3 flex flex-row items-center'><ShieldExclamationIcon className='w-12 p-2'/><strong className='pr-4'>unverified</strong></div>}
    {ownsNFT == true && <div className='rounded-md bg-green-500 text-black self-center w-fit mr-3 p-1 px-3 flex flex-row items-center content-center'><CheckCircleIcon className='w-12 p-2'/><strong className='pr-4'>verified</strong></div>}
  </div>

  return (
    <div
      className={cn({
        'flex flex-row bg-green-400 p-4 text-lg w-full rounded-lg outline-4 outline-green-800':true,
        
        // 'bg-white text-black': ownsNFT == true,
        // 'bg-red-500 text-white': ownsNFT == false,
        outline: is_focus,
      })}
    >
      <AtSymbolIcon className={cn({ 'w-10 text-green-700 shrink-0': true })}></AtSymbolIcon>
      <input
        className="bg-transparent p-4 text-xl font-bold w-full rounded-lg outline-none placeholder-green-700"
        onChange={onSetAddressChange}
        autoComplete="on"
        name="wallet_address"
        onFocus={setFocus.bind(null, true)}
        onBlur={setFocus.bind(null, false)}
        placeholder="wallet address"
        value={state.address}
      ></input>
      {state.address && nft_owner_indicator}
    </div>
  )
}
