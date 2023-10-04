import {Client, IWorkspaceClient, Workspace} from "../schema";

export class WorkspaceClient implements IWorkspaceClient {
    private client: Client;

    constructor(client: Client) {
        this.client = client
    }

    /**
     * Creates a new Workspace.
     *
     * @param params
     * @param client
     */
    public async create(params: {
        handle?: string
        fetch_if_exists?: boolean
    }): Promise<Workspace> {
        const {handle, fetch_if_exists=true} = params
        const response = await this.client.post('workspace/create', {handle, fetch_if_exists})
        const json = await response.json()
        return json?.workspace as Workspace
    }}


// eslint-disable-next-line import/no-anonymous-default-export
export default WorkspaceClient
