import { useCallback, useEffect, useState } from 'react'
import { OverlayDialog } from './OverlayDialog'

interface TokenState {
  amount: number
}
export const SetTokenForm = ({
  state,
  onSet,
}: {
  state: TokenState
  onSet: (state: TokenState) => void
}): any => {
  const [amount, setAmount] = useState(0)
  const [open_form, setFormOpen] = useState(false)

  const onSetAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const x = Number.parseFloat(event.target.value)

      setAmount(Number.isNaN(x) ? 0 : x)
      
    },
    []
  )
  

  const onSubmit = (e: any) => {
    e.preventDefault()

    onSet({
      amount: amount,
    })
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
          value={amount}
        ></input>
      </OverlayDialog>
      <div
        className="rounded-md p-4 bg-slate-700 cursor-pointer"
        onClick={setFormOpen.bind(null, true)}
      >
        {!amount ? 'set amount' : amount}
      </div>
    </>
  )
}

export const SetNotesForm = ({ state, onSet }: any): any => {
  const [notes, setNotes] = useState('')
  const [open_form, setFormOpen] = useState(false)

  const onSetNotesChange = (e: any) => {
    setNotes(e.target.value)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()

    onSet({
      notes: notes,
    })
    setFormOpen(false)
  }

  return (
    <>
      <OverlayDialog
        show={open_form}
        onSubmit={onSubmit}
        onClose={setFormOpen.bind(null, false)}
      >
        <div className="p-2">set notes</div>
        <textarea
          className="bg-slate-800 p-6 text-lg"
          onChange={onSetNotesChange}
          value={notes}
          placeholder="set notes"
        ></textarea>
      </OverlayDialog>
      <div
        onClick={setFormOpen.bind(null, true)}
        className="rounded-md p-4 bg-slate-800 cursor-pointer"
      >
        {!notes ? 'set notes' : notes}
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

export const SetRecieverForm = ({ state, onSet }: any): any => {
  const [address, setAddress] = useState('')
  const [open_form, setFormOpen] = useState(false)

  const onSetAddressChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(event.target.value)
    },
    []
  )

  const onSubmit = (e: any) => {
    e.preventDefault()
    // console.log('submit')
    onSet({
      address: address,
    })
    setFormOpen(false)
  }

  return (
    <>
      <OverlayDialog
        show={open_form}
        onSubmit={onSubmit}
        onClose={setFormOpen.bind(null, false)}
      >
        <div className="p-2">set reciever</div>
        <input
          className="bg-slate-800 p-6 text-lg"
          onChange={onSetAddressChange}
          value={address}
          placeholder="select address"
        ></input>
      </OverlayDialog>
      <div
        onClick={setFormOpen.bind(null, true)}
        className="rounded-md p-4 bg-slate-800 cursor-pointer"
      >
        {!address ? 'select address' : address}
      </div>
    </>
  )
}
