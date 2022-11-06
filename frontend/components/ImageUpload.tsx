export const AuditList = ({}: any): any => {
	function captureFile (event){
		event.preventDefault()
		const file = event.target.files[0]
		const reader = new window.FileReader()
		reader.readAsArrayBuffer(file)
		reader.onloadend = () => {
			this.setState({ buffer: Buffer(reader.result) })
			console.log('buffer', this.state.buffer)
		}
	}

	return <div className="pure-g">
		<div className="pure-u-1-1">
			<h1>Your Image</h1>
			<p>This image is stored on IPFS & The Ethereum Blockchain!</p>
			<img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
			<h2>Upload Image</h2>
			<form onSubmit={this.onSubmit} >
			<input type='file' onChange={this.captureFile} />
			<input type='submit' />
			</form>
		</div>
	</div>
	
}
