/**
 * Parameters for creating an instance of an agent.
 *
 */
import {Client, AgentInstance, IPackageClient, PackageInstance} from "../schema";

type CreatePackageInstanceParams = {
     /**
     * Handle of the agent you are creating an instance of. This is a remote service deployed to Steamship.
     */
    package: string;

    /**
     * Optional Version of the agent you are creating.
     */
    version?: string

    /**
     * Optional handle identifying this particular agent instance. This uniquely identifies the data and chat history
     * that will be maintained by the instance.
     */
    handle?: string

    /**
     * Optional configuration to pass to the agent upon construction.
     */
    config?: Record<string, any>

    /**
     * Fetch if exists
     */
    fetchIfExists?: boolean
}

export type { CreatePackageInstanceParams }

export class PackageClient implements IPackageClient {
    private client: Client;

    constructor(client: Client) {
        this.client = client
    }

    public async createInstance(params: CreatePackageInstanceParams): Promise<PackageInstance> {
        if (!params.handle) {
            // We'll need to create a workspace for this agent so we can make sure to get/fetch the Agent in its own
            // workspace.
            const workspace_ = await this.client.workspace.create({})
            params.handle = workspace_.handle;
        }

        const {version, handle, fetchIfExists=true, config} = params
        const response = await this.client.post('package/instance/create', {
            packageHandle: params.package,
            packageVersionHandle: version,
            handle: handle,
            fetchIfExists: fetchIfExists,
            config: config
        })
        const json = await response.json()
        return json?.packageInstance as PackageInstance
    }

    /**
     * Invoke a method on a package using its base_url.
     *
     * @param params
     * @param client
     */
    public async invoke(params: {
        base_url: string,
        method: string,
        payload?: Record<string, any>
        verb?: "GET" | "POST"
    }): Promise<Response> {
        return await this.client.invokePackageMethod(params.base_url, params.method, {
            method: params.verb || "POST",
            body: JSON.stringify(params.payload || {}),
            json: true
        })
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default PackageClient
