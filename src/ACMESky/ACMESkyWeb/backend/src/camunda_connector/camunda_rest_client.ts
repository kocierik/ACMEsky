import * as requests from "requests";
import * as os from "os";
import * as logging from "logging";


const BASE_URL: string = process.env.CAMUNDA_BASE_URL || "http://camunda_acmesky:8080/engine-rest";

/**
 * Send to Camunda Engine a correlate message with some process variables and an optional process_instance_id
 * @param name: the name of the message, used by the engine to know which Message Catch Event trigger
 * @param process_variables: the variables to pass to the process with the message
 * @param process_instance_id: the process instance id to use to correlate a message to a started process instance
 * @return: return the status code returned by Camunda
 */
export async function send_string_as_correlate_message(name: string, process_variables: Array<[string, string]>, process_instance_id?: string | null): Promise<number> {
    /**
     * Generate a dictionary with the variables to send to Camunda
     */
    const process_variables_dict: Record<string, { value: string; type: string }> = {};
    for (const [variable_name, variable_value] of process_variables) {
        process_variables_dict[variable_name] = {
            value: variable_value,
            type: "String",
        };
    }

    process_variables_dict["valueInfo"] = {
        transient: true,
    };

    /**
     * Create the message to send to Camunda starting from the parameters
     */
    const camunda_message: Record<string, string | { processInstanceId: string; processVariables: Record<string, { value: string; type: string }> }> = process_instance_id
        ? {
            messageName: name,
            processInstanceId: process_instance_id,
            processVariables: process_variables_dict,
        }
        : {
            messageName: name,
            processVariables: process_variables_dict,
        };

    logging.info(camunda_message);
    const response = await requests.post(BASE_URL + "/message", { json: camunda_message });
    return response.status;

