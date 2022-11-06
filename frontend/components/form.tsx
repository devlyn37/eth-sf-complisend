import { useState } from 'react'
import { OverlayDialog } from './OverlayDialog'
import { WalletIcon } from '@heroicons/react/24/solid'
import cn from 'classnames'

export const SetTokenForm = ({ state, setState }: any): any => {
  const [open_form, setFormOpen] = useState(false)

  const onSetAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const x = Number.parseFloat(event.target.value)

    setState({
      amount: Number.isNaN(x) ? 0 : x,
    })
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    setFormOpen(false)
  }

  return (
    <>
      <OverlayDialog
        show={open_form}
        onSubmit={onSubmit}
        onClose={setFormOpen.bind(null, false)}
      >
        <div className="p-2">set amount</div>
        <input
          className="bg-slate-800 p-6 text-lg"
          onChange={onSetAmountChange}
          value={state.amount}
        ></input>
      </OverlayDialog>
      <div
        className="rounded-md p-4 bg-slate-700 cursor-pointer"
        onClick={setFormOpen.bind(null, true)}
      >
        {!state.amount ? 'set amount' : state.amount}
      </div>
    </>
  )
}

export const SetNotesForm = ({ state = {}, onSet }: any): any => {
  const [open_form, setFormOpen] = useState(false)

  const onSetNotesChange = (e: any) => {
    onSet({ notes: e.target.value })
  }

  return (
    <>
      <OverlayDialog show={open_form} onClose={setFormOpen.bind(null, false)}>
        <div className="p-2">set notes</div>
        <textarea
          className="bg-slate-800 p-6 text-lg"
          onChange={onSetNotesChange}
          value={state.notes}
          placeholder="set notes"
        ></textarea>
      </OverlayDialog>
      <div
        onClick={setFormOpen.bind(null, true)}
        className="rounded-md p-4 bg-slate-800 cursor-pointer"
      >
        {!state.notes ? 'set notes' : state.notes}
      </div>
    </>
  )
}

{
  /* let [addr,setAddr] = useState('')
  
let onAddrChange = function(e:any){
  setAddr(e.target.value)
} */
}

export const SetRecieverForm = ({ state = {}, onSet }: any): any => {
  const [open_form, setFormOpen] = useState(false)

  const onSetAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSet({
      address: event.target.value,
    })
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    // console.log('submit')

    setFormOpen(false)
  }

  let [is_focus, setFocus] = useState(false)

  return (
    <div
      className={cn({
        'flex flex-row bg-black p-4 text-lg w-full rounded-lg outline-4 outline-blue-500':
          true,
        outline: is_focus,
      })}
    >
      <WalletIcon className={cn({ 'w-10 text-white': true })}></WalletIcon>
      <input
        className="bg-transparent p-4 text-xl font-bold text-cyan-500 w-full rounded-lg outline-none"
        onChange={onSetAddressChange}
        autoComplete="on"
        name="wallet_address"
        onFocus={setFocus.bind(null, true)}
        onBlur={setFocus.bind(null, false)}
        placeholder="wallet address"
        value={state.address}
      ></input>
    </div>
  )
}
