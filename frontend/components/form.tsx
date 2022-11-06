import { useCallback, useEffect, useState } from 'react'
import { OverlayDialog } from './OverlayDialog'
import { WalletIcon,CurrencyDollarIcon,PencilSquareIcon} from '@heroicons/react/24/solid'
import cn from 'classnames'

interface TokenState {
  amount: number | undefined
}
export const SetTokenForm = ({
  state,
  onSet,
}: {
  state: TokenState
  onSet: (state: TokenState) => void
}): any => {
  const [open_form, setFormOpen] = useState(false)

  const onSetAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const x = Number.parseFloat(event.target.value)

      onSet({
        amount: Number.isNaN(x) ? 0 : x,
      })
    },
    []
  )

  const onSubmit = (e: any) => {
    e.preventDefault()
    setFormOpen(false)
  }

  let [is_focus, setFocus] = useState(false)

  return (
    <>
      <div
        className={cn({
          'flex flex-row bg-slate-700 p-4 text-lg w-full rounded-lg outline-4 outline-blue-500':
            true,
          outline: is_focus,
        })}
      >
        <CurrencyDollarIcon className={cn({ 'w-10 text-white': true })}></CurrencyDollarIcon>
        <input
          className="bg-transparent p-4 text-xl font-bold text-cyan-500 w-full rounded-lg outline-none"
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

export const SetNotesForm = ({ state={}, onSet }: any): any => {
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
          'flex flex-row bg-slate-700 p-4 text-lg w-full rounded-lg outline-4 outline-blue-500':
            true,
          outline: is_focus,
        })}
      >
        <PencilSquareIcon className={cn({ 'w-10 text-white': true })}></PencilSquareIcon>
        <input
          className="bg-transparent p-4 text-xl font-bold text-cyan-500 w-full rounded-lg outline-none"
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

export const SetRecieverForm = ({ state={}, onSet }: any): any => {
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
        'flex flex-row bg-slate-700 p-4 text-lg w-full rounded-lg outline-4 outline-blue-500':
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
