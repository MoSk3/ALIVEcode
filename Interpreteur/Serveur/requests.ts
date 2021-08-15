type requestTypes = {
	"user-to-server": {
		versionAS: string
	}
	"server-to-user": {
		permissions: ("get" | "set")[]
		dependencies: string[]
	}
}

export default requestTypes
